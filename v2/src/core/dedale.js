/* ISNAD 2.x — le tirage d'un labyrinthe de la noosphère.
   Ce module ne dessine rien et ne connaît pas le jeu : il tire un plan, et sait dire si ce plan est bon. Il se charge
   sous Node (require) comme dans un navigateur (window.ISNAD_DEDALE) : `v2/tools/dedales.js` l'éprouve sur des
   milliers de graines, `maps.js` bâtit le lieu d'après le plan, `rodeurs.js` y pose le chrono et ceux qui rôdent.

   plan(hasard, profondeur, genre) → {
     w, h           la carte : 60 × 40 cases, comme la noosphère d'avant
     g              Uint8Array(w × h) : 0 le vide, 1 un pont, 2 le sol d'une salle, 3 le sol d'un abri
     lieux          { nom: [x, y] } — la case du milieu de chaque salle nommée
     salles         { nom: [x, y, largeur, hauteur] }
     pas, cellules, impasses, boucles     ce qui mesure sa complexité
     tour           le nombre de cases d'un tour de tous les lieux, en partant du seuil
     loin           des carrefours, du plus loin du seuil au plus proche (là où poser ceux qui rôdent)
     essais         le nombre de tirages qu'il a fallu ; secours : vrai si l'on a dû prendre le plan de repli
     interdite      la pièce interdite (2.x) : { porte, face, devant, salle, repli, petite } — voir interdite(), plus bas.
                    Elle se choisit après le tirage, d'après le plan seul : g, lieux et salles sont ceux d'un plan sans elle }
   hasard : une fonction qui rend un nombre de [0, 1[ — la même suite donne le même plan.
   profondeur : 0 (le plus simple) à 5. genre : 'chapitre' (seuil, trois nœuds, faille, miroir, cœur) ou 'descente'
   (seuil, issue, deux abris).
   verifie(plan, genre) → [erreurs] : les lieux y sont, du bon côté, assez grands, tous reliés ; les culs-de-sac en sont. */
(function (racine) {
  'use strict';
  const W = 60, H = 40, MARGE = 2, LARGE = 2; // la largeur d'un pont, en cases
  // plus on descend, plus la maille est serrée et moins il y a de raccourcis
  const PROFONDEURS = [{ pas: 6, tresse: 0.30 }, { pas: 5, tresse: 0.24 }, { pas: 5, tresse: 0.16 }, { pas: 4, tresse: 0.12 }, { pas: 4, tresse: 0.07 }, { pas: 3, tresse: 0.04 }];
  // un lieu : son nom, sa taille minimale en cases, sa zone (en fractions de la carte : de x0 à x1, de y0 à y1), son nombre
  // de portes au plus, et son sol (2 : salle, 3 : abri). Un lieu à une seule porte est un cul-de-sac.
  const LIEUX = {
    chapitre: [['seuil', 7, 5, [0, 0.12, 0.3, 0.7], 2, 2], ['coeur', 13, 11, [0.7, 1, 0.15, 0.85], 2, 2], ['noeud1', 7, 7, [0.2, 0.42, 0.3, 0.7], 4, 2],
      ['noeud2', 7, 5, [0.4, 0.68, 0, 0.3], 3, 2], ['noeud3', 7, 5, [0.4, 0.68, 0.7, 1], 3, 2], ['faille', 5, 5, [0.12, 0.4, 0, 0.28], 1, 2], ['miroir', 5, 5, [0.12, 0.4, 0.72, 1], 1, 2]],
    descente: [['seuil', 5, 5, [0, 0.12, 0.3, 0.7], 2, 2], ['issue', 5, 5, [0.86, 1, 0.1, 0.9], 1, 2], ['abri', 5, 5, [0.28, 0.6, 0, 0.4], 1, 3], ['refuge', 5, 5, [0.45, 0.8, 0.6, 1], 1, 3]]
  };
  // les côtés où chaque lieu doit se trouver : ce que les récits disent (« le seuil à l'ouest, le cœur à l'est… »)
  const COTES = { seuil: p => p[0] < 14, coeur: p => p[0] > 38, noeud2: p => p[1] < 17, noeud3: p => p[1] > 22, issue: p => p[0] > 44 };

  function maille(pas) { return { nc: Math.floor((W - 2 * MARGE - LARGE) / pas) + 1, nr: Math.floor((H - 2 * MARGE - LARGE) / pas) + 1 }; }

  function tirage(hasard, n, genre, repli) {
    const P = PROFONDEURS[Math.max(0, Math.min(PROFONDEURS.length - 1, n | 0))], pas = P.pas, { nc, nr } = maille(pas), defs = LIEUX[genre] || LIEUX.chapitre;
    const ent = (a, b) => a + Math.floor(hasard() * (b - a + 1)), cx = i => MARGE + i * pas, cy = j => MARGE + j * pas;
    // 1. les salles, posées sur la maille, chacune dans sa zone
    const salle = new Int16Array(nc * nr).fill(-1), S = [];
    for (let k = 0; k < defs.length; k++) { const [nom, lw, lh, z, portes, sol] = defs[k], si = Math.ceil((lw - LARGE) / pas), sj = Math.ceil((lh - LARGE) / pas);
      const a0 = Math.min(nc - 1 - si, Math.max(0, Math.ceil(z[0] * (nc - 1)))), a1 = Math.max(a0, Math.min(nc - 1 - si, Math.floor(z[1] * (nc - 1)) - si));
      const b0 = Math.min(nr - 1 - sj, Math.max(0, Math.ceil(z[2] * (nr - 1)))), b1 = Math.max(b0, Math.min(nr - 1 - sj, Math.floor(z[3] * (nr - 1)) - sj));
      let ok = false, i0 = 0, j0 = 0;
      for (let t = 0; t < 24 && !ok; t++) { i0 = repli ? Math.round((a0 + a1) / 2) : ent(a0, a1); j0 = repli ? Math.round((b0 + b1) / 2) : ent(b0, b1); ok = true;
        for (let j = j0; j <= j0 + sj && ok; j++) for (let i = i0; i <= i0 + si; i++) if (salle[j * nc + i] >= 0) { ok = false; break; }
        if (repli) break; }
      if (!ok) return null;
      for (let j = j0; j <= j0 + sj; j++) for (let i = i0; i <= i0 + si; i++) salle[j * nc + i] = k;
      S.push({ nom, i0, j0, si, sj, portes, sol, x: cx(i0), y: cy(j0), w: si * pas + LARGE, h: sj * pas + LARGE, deg: 0 }); }
    // 2. le dédale : un arbre qui passe par tous les carrefours ; une salle y compte pour un seul nœud
    const N = nc * nr, noeud = c => salle[c] >= 0 ? N + salle[c] : c, vu = new Uint8Array(N + S.length), ouvert = new Set(), deg = new Uint16Array(N + S.length);
    const cle = (a, b) => a < b ? a * 4096 + b : b * 4096 + a, voisins = c => { const i = c % nc, j = (c - i) / nc, v = []; if (i) v.push(c - 1); if (i < nc - 1) v.push(c + 1); if (j) v.push(c - nc); if (j < nr - 1) v.push(c + nc); return v; };
    const cellulesDe = u => { if (u < N) return [u]; const s = S[u - N], v = []; for (let j = s.j0; j <= s.j0 + s.sj; j++) for (let i = s.i0; i <= s.i0 + s.si; i++) v.push(j * nc + i); return v; };
    const feuille = u => u >= N && S[u - N].portes === 1, plein = u => u >= N && deg[u] >= S[u - N].portes;
    const ouvre = (a, b) => { ouvert.add(cle(a, b)); deg[noeud(a)]++; deg[noeud(b)]++; };
    const depart = N + 0; vu[depart] = 1; const actifs = [depart];
    while (actifs.length) { const k = hasard() < 0.72 ? actifs.length - 1 : Math.floor(hasard() * actifs.length), u = actifs[k], choix = [];
      if (!plein(u)) cellulesDe(u).forEach(c => voisins(c).forEach(d => { const v = noeud(d); if (v !== u && !vu[v] && !plein(v)) choix.push([c, d]); }));
      if (!choix.length) { actifs.splice(k, 1); continue; }
      const [c, d] = choix[Math.floor(hasard() * choix.length)], v = noeud(d); ouvre(c, d); vu[v] = 1; if (!feuille(v)) actifs.push(v); }
    if (S.some((s, k) => !vu[N + k])) return null; // une salle est restée hors du dédale : on retire
    // 3. les raccourcis : une impasse sur quelques-unes se perce vers un voisin
    let boucles = 0;
    for (let c = 0; c < N; c++) { if (salle[c] >= 0 || !vu[c] || deg[c] !== 1 || hasard() >= P.tresse * 2.4) continue;
      const v = voisins(c).filter(d => vu[noeud(d)] && !ouvert.has(cle(c, d)) && !feuille(noeud(d)) && !plein(noeud(d))); if (!v.length) continue;
      ouvre(c, v[Math.floor(hasard() * v.length)]); boucles++; }
    // 4. le plan, case par case
    const g = new Uint8Array(W * H), pose = (x, y, w, h, t) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < W && j < H && (t > 1 || !g[j * W + i])) g[j * W + i] = t; };
    let cellules = 0, impasses = 0;
    for (let c = 0; c < N; c++) { if (salle[c] >= 0 || !vu[c]) continue; const i = c % nc, j = (c - i) / nc; pose(cx(i), cy(j), LARGE, LARGE, 1); cellules++; if (deg[c] === 1) impasses++; }
    ouvert.forEach(k => { const a = Math.floor(k / 4096), b = k % 4096, ia = a % nc, ja = (a - ia) / nc; if (b === a + 1) pose(cx(ia) + LARGE, cy(ja), pas - LARGE, LARGE, 1); else pose(cx(ia), cy(ja) + LARGE, LARGE, pas - LARGE, 1); });
    const lieux = {}, salles = {};
    S.forEach(s => { pose(s.x, s.y, s.w, s.h, s.sol); lieux[s.nom] = [s.x + (s.w >> 1), s.y + (s.h >> 1)]; salles[s.nom] = [s.x, s.y, s.w, s.h]; });
    // 5. les distances : le tour de tous les lieux depuis le seuil, et les carrefours les plus lointains
    const p = { w: W, h: H, g, lieux, salles, pas, cellules, impasses, boucles };
    const d0 = distances(p, lieux.seuil), noms = Object.keys(lieux); let tour = 0, ici = 'seuil'; const reste = noms.filter(n => n !== 'seuil'), dist = { seuil: d0 };
    while (reste.length) { const d = dist[ici] || (dist[ici] = distances(p, lieux[ici])); let m = 0; for (let k = 1; k < reste.length; k++) if (d[lieux[reste[k]][1] * W + lieux[reste[k]][0]] < d[lieux[reste[m]][1] * W + lieux[reste[m]][0]]) m = k;
      const pas1 = d[lieux[reste[m]][1] * W + lieux[reste[m]][0]]; if (pas1 < 0) return null; tour += pas1; ici = reste[m]; reste.splice(m, 1); }
    p.tour = tour; p.loin = [];
    for (let c = 0; c < N; c++) { if (salle[c] >= 0 || !vu[c]) continue; const i = c % nc, j = (c - i) / nc, d = d0[cy(j) * W + cx(i)]; if (d > 0) p.loin.push([cx(i), cy(j), d]); }
    p.loin.sort((a, b) => b[2] - a[2] || a[0] - b[0] || a[1] - b[1]);
    return p;
  }

  // les distances depuis une case, en pas de case (−1 : hors d'atteinte)
  function distances(p, de) { const d = new Int32Array(p.w * p.h).fill(-1), q = [de[1] * p.w + de[0]]; if (!p.g[q[0]]) return d; d[q[0]] = 0;
    for (let k = 0; k < q.length; k++) { const c = q[k], x = c % p.w, y = (c - x) / p.w;
      if (x && p.g[c - 1] && d[c - 1] < 0) { d[c - 1] = d[c] + 1; q.push(c - 1); } if (x < p.w - 1 && p.g[c + 1] && d[c + 1] < 0) { d[c + 1] = d[c] + 1; q.push(c + 1); }
      if (y && p.g[c - p.w] && d[c - p.w] < 0) { d[c - p.w] = d[c] + 1; q.push(c - p.w); } if (y < p.h - 1 && p.g[c + p.w] && d[c + p.w] < 0) { d[c + p.w] = d[c] + 1; q.push(c + p.w); } }
    return d; }

  function verifie(p, genre) {
    const E = [], defs = LIEUX[genre] || LIEUX.chapitre; if (!p) return ['pas de plan'];
    if (p.w !== W || p.h !== H || p.g.length !== W * H) E.push('la carte n’a pas la taille attendue');
    const d0 = p.lieux.seuil ? distances(p, p.lieux.seuil) : null; if (!d0) E.push('pas de seuil');
    defs.forEach(([nom, lw, lh, z, portes, sol]) => { const l = p.lieux[nom], s = p.salles[nom]; if (!l || !s) { E.push('lieu absent : ' + nom); return; }
      if (s[2] < lw || s[3] < lh) E.push(nom + ' : salle trop petite (' + s[2] + ' × ' + s[3] + ')');
      for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (p.g[(l[1] + j) * W + l[0] + i] !== sol) { E.push(nom + ' : le sol manque autour de son milieu'); i = j = 9; }
      if (COTES[nom] && !COTES[nom](l)) E.push(nom + ' : du mauvais côté (' + l.join(', ') + ')');
      if (d0 && d0[l[1] * W + l[0]] < 0) E.push(nom + ' : coupé du seuil');
      // ses portes : les ponts qui touchent son bord, comptés par tronçons
      let n = 0; const plein = (x, y) => x >= 0 && y >= 0 && x < W && y < H && p.g[y * W + x] > 0;
      for (let i = s[0]; i < s[0] + s[2]; i++) { if (plein(i, s[1] - 1) && !(i > s[0] && plein(i - 1, s[1] - 1))) n++; if (plein(i, s[1] + s[3]) && !(i > s[0] && plein(i - 1, s[1] + s[3]))) n++; }
      for (let j = s[1]; j < s[1] + s[3]; j++) { if (plein(s[0] - 1, j) && !(j > s[1] && plein(s[0] - 1, j - 1))) n++; if (plein(s[0] + s[2], j) && !(j > s[1] && plein(s[0] + s[2], j - 1))) n++; }
      if (n < 1) E.push(nom + ' : aucune porte'); if (n > portes) E.push(nom + ' : ' + n + ' portes, ' + portes + ' au plus'); });
    for (let k = 0; k < p.g.length; k++) if (p.g[k] && d0 && d0[k] < 0) { E.push('un bout du dédale est coupé du seuil (' + (k % W) + ', ' + Math.floor(k / W) + ')'); break; }
    for (let x = 0; x < W; x++) if (p.g[x] || p.g[(H - 1) * W + x]) { E.push('le dédale touche le bord'); break; }
    for (let y = 0; y < H; y++) if (p.g[y * W] || p.g[y * W + W - 1]) { E.push('le dédale touche le bord'); break; }
    if (!(p.tour > 0)) E.push('pas de tour possible');
    return E;
  }

  /* ---------- la pièce interdite (2.x ; demande du décideur, 19 novembre) ----------
     Chaque labyrinthe a la sienne : une porte toujours close, posée dans le mur d'un pont, et derrière elle la masse fermée
     de la pièce, dans le vide du plan. Elle se choisit APRÈS le tirage, d'après le plan seul (un hachage de g départage) :
     elle ne consomme rien de la suite « hasard » et ne change pas une case de g — la porte et la pièce restent du vide, que
     rien ne traverse. La porte est une case vide bordée d'une seule case praticable, « devant », qui est un pont ; la pièce,
     un rectangle de vide derrière elle, qui ne touche aucune case praticable. De préférence, la porte est au fond d'un
     cul-de-sac, à l'écart du seuil, des lieux nommés et du chemin qui les relie (secrète par sa place). Dans une descente, elle
     est toujours loin du seuil (la moitié au moins de la plus grande distance) et ne touche ni l'issue ni les abris.
     Les replis, du meilleur au dernier (repli) — « à l'écart » : hors du chemin des objectifs, à plus d'un tiers de la plus
     grande distance au seuil (la moitié dans une descente), à deux cases au moins de toute salle nommée (trois pour 0 à 2) :
       0  au fond d'un cul-de-sac, à l'écart, une pièce d'au moins quatre cases
       1  au fond d'un cul-de-sac, à l'écart, une pièce plus petite (deux ou trois cases)
       2  sur le côté d'un cul-de-sac, à l'écart, au moins quatre cases
       3  sur le pourtour du dédale, la pièce dans la marge du plan, à l'écart, au moins quatre cases
       4  dans un cul-de-sac, à l'écart, quelle que soit la pièce
       5  sur un autre pont, à l'écart, au moins quatre cases
       6  n'importe où sur un pont, sans autre exigence que celles de la descente
       7  (une descente qui n'offrirait rien d'assez loin : posée comme dans un chapitre — jamais vu)
     Le pourtour en offre toujours : la marge (deux cases au moins) reçoit une porte et une pièce d'une case.
     interdite(plan, genre) → { porte: [x, y], face, devant: [x, y], salle: [x, y, l, h], repli, petite }
       face : où regarde la porte, c'est-à-dire de quel côté est « devant » ('nord', 'sud', 'est', 'ouest') ;
       petite : la pièce a moins de quatre cases. */
  const FACES = [['est', 1, 0], ['ouest', -1, 0], ['sud', 0, 1], ['nord', 0, -1]], OPPOSE = { est: 'ouest', ouest: 'est', sud: 'nord', nord: 'sud' };
  function interdite(p, genre) {
    const L0 = p.w, H0 = p.h, g = p.g, descente = genre === 'descente', dans = (x, y) => x >= 0 && y >= 0 && x < L0 && y < H0, marche = (x, y) => dans(x, y) && g[y * L0 + x] > 0;
    // les cases où la pièce peut s'étendre : du vide, dans la carte, sans voisin praticable
    const libre = new Uint8Array(L0 * H0);
    for (let y = 0; y < H0; y++) for (let x = 0; x < L0; x++) if (!g[y * L0 + x] && !marche(x - 1, y) && !marche(x + 1, y) && !marche(x, y - 1) && !marche(x, y + 1)) libre[y * L0 + x] = 1;
    const vide = (x, y) => dans(x, y) && libre[y * L0 + x] === 1;
    // le hachage du plan : il départage les places également bonnes, sans rien tirer
    let hg = 2166136261; for (let k = 0; k < g.length; k++) { hg ^= g[k]; hg = Math.imul(hg, 16777619); }
    const brin = k => { let h = (hg ^ Math.imul(k + 1, 2654435761)) >>> 0; h = Math.imul(h ^ (h >>> 16), 2246822519); h = Math.imul(h ^ (h >>> 13), 3266489917); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    // le seuil : les distances, et la plus grande
    const d0 = distances(p, p.lieux.seuil); let dmax = 1; for (let k = 0; k < d0.length; k++) if (d0[k] > dmax) dmax = d0[k];
    // le chemin des objectifs : les cases d'un plus court chemin entre deux lieux qui se suivent dans le tour (le même tour que tirage)
    const chemin = new Uint8Array(L0 * H0), D0 = { seuil: d0 }, dist = n => D0[n] || (D0[n] = distances(p, p.lieux[n]));
    { let ici = 'seuil'; const reste = Object.keys(p.lieux).filter(n => n !== 'seuil');
      while (reste.length) { const da = dist(ici), at = n => da[p.lieux[n][1] * L0 + p.lieux[n][0]]; let m = 0; for (let k = 1; k < reste.length; k++) if (at(reste[k]) < at(reste[m])) m = k;
        const b = reste[m], db = dist(b), tot = at(b); if (tot > 0) for (let k = 0; k < chemin.length; k++) if (da[k] >= 0 && db[k] >= 0 && da[k] + db[k] === tot) chemin[k] = 1;
        ici = b; reste.splice(m, 1); } }
    // la maille : un carrefour est un pont de 2 × 2 ; un cul-de-sac, un carrefour qui n'a qu'une ouverture
    const pas = p.pas, mm = maille(pas), bx1 = MARGE + (mm.nc - 1) * pas + LARGE - 1, by1 = MARGE + (mm.nr - 1) * pas + LARGE - 1;
    const bloc = (x, y) => { const i = Math.floor((x - MARGE) / pas), j = Math.floor((y - MARGE) / pas), bx = MARGE + i * pas, by = MARGE + j * pas;
      if (i < 0 || j < 0 || i >= mm.nc || j >= mm.nr || x - bx >= LARGE || y - by >= LARGE || g[by * L0 + bx] !== 1) return null;
      const ouv = []; if (marche(bx + LARGE, by)) ouv.push('est'); if (marche(bx - 1, by)) ouv.push('ouest'); if (marche(bx, by + LARGE)) ouv.push('sud'); if (marche(bx, by - 1)) ouv.push('nord');
      return ouv; };
    // l'écart (en cases, d'un coin à l'autre) entre deux rectangles : 0, ils se chevauchent ; 1, ils se touchent
    const ecart = (x0, y0, x1, y1, s) => Math.max(0, s[0] - x1, x0 - (s[0] + s[2] - 1), s[1] - y1, y0 - (s[1] + s[3] - 1));
    const salles = Object.keys(p.salles).map(n => p.salles[n]), refuges = ['issue', 'abri', 'refuge'].filter(n => p.salles[n]).map(n => p.salles[n]);
    let meilleur = null, nb = 0;
    for (let y = 0; y < H0; y++) for (let x = 0; x < L0; x++) { if (g[y * L0 + x] !== 1) continue;
      for (let f = 0; f < 4; f++) { const dir = FACES[f][0], dx = FACES[f][1], dy = FACES[f][2];
        const qx = x + dx, qy = y + dy, px = dy ? 1 : 0, py = dx ? 1 : 0; // la porte, à côté de ce pont ; (px, py) : le long du mur
        if (!dans(qx, qy) || g[qy * L0 + qx] || marche(qx + px, qy + py) || marche(qx - px, qy - py) || marche(qx + dx, qy + dy)) continue; // une seule case praticable la borde
        // la pièce : derrière la porte, d'une à quatre cases de profondeur et d'une à six de large, la porte au plus près du milieu
        let ga = 3, dr = 3, fk = 0, fa = 0, fb = 0, fq = -1e9;
        for (let k = 1; k <= 4; k++) { const rx = qx + dx * k, ry = qy + dy * k; if (!vide(rx, ry)) break;
          let a = 0, b = 0; while (a < ga && vide(rx - px * (a + 1), ry - py * (a + 1))) a++; while (b < dr && vide(rx + px * (b + 1), ry + py * (b + 1))) b++; ga = a; dr = b;
          while (a + b + 1 > 6) { if (a >= b) a--; else b--; }
          const l = a + b + 1, q = Math.min(k * l, 12) - 0.5 * Math.max(0, Math.max(k, l) / Math.min(k, l) - 2) - 0.25 * Math.abs(a - b);
          if (q > fq) { fq = q; fk = k; fa = a; fb = b; } }
        if (!fk) continue;
        const xa = dx ? Math.min(qx + dx, qx + dx * fk) : qx - fa, xb = dx ? Math.max(qx + dx, qx + dx * fk) : qx + fb;
        const ya = dy ? Math.min(qy + dy, qy + dy * fk) : qy - fa, yb = dy ? Math.max(qy + dy, qy + dy * fk) : qy + fb, aire = (xb - xa + 1) * (yb - ya + 1);
        const pres = s => Math.min(ecart(xa, ya, xb, yb, s), ecart(qx, qy, qx, qy, s)), part = d0[y * L0 + x] / dmax;
        let loinRefuges = 99, loinLieux = 99; for (const s of refuges) loinRefuges = Math.min(loinRefuges, pres(s)); for (const s of salles) loinLieux = Math.min(loinLieux, pres(s));
        if (descente && (part < 0.5 || loinRefuges < 2)) continue; // la descente : toujours loin du seuil, à l'écart de l'issue et des abris
        const ouv = bloc(x, y), impasse = !!(ouv && ouv.length === 1), fond = impasse && ouv[0] === OPPOSE[dir], marge = xb < MARGE || xa > bx1 || yb < MARGE || ya > by1;
        const ecarte = !chemin[y * L0 + x] && part >= (descente ? 0.5 : 0.35);
        const repli = fond && aire >= 4 && ecarte && loinLieux >= 3 ? 0 : fond && aire >= 2 && ecarte && loinLieux >= 3 ? 1 : impasse && aire >= 4 && ecarte && loinLieux >= 3 ? 2
          : marge && aire >= 4 && ecarte && loinLieux >= 2 ? 3 : impasse && ecarte && loinLieux >= 2 ? 4 : aire >= 4 && ecarte && loinLieux >= 2 ? 5 : 6;
        const k0 = nb++; if (meilleur && repli > meilleur.repli) continue;
        let clair = 1; for (let j = ya - 1; j <= yb + 1 && clair; j++) for (let i = xa - 1; i <= xb + 1; i++) if (marche(i, j)) { clair = 0; break; }
        const note = -1000 * repli + fq + part * 6 + Math.min(loinLieux, 8) * 0.4 + clair * 1.5 + brin(k0) * 2.5;
        if (!meilleur || note > meilleur.note) meilleur = { note, porte: [qx, qy], face: OPPOSE[dir], devant: [x, y], salle: [xa, ya, xb - xa + 1, yb - ya + 1], repli, petite: aire < 4 }; } }
    if (meilleur) delete meilleur.note;
    // jamais un plan sans pièce : si la descente n'offrait aucune place assez loin (cela n'arrive sur aucun des cent vingt mille
    // plans que tools/dedales.js éprouve, qui le signalerait), la pièce se pose comme dans un chapitre
    if (!meilleur && descente) { meilleur = interdite(p, 'chapitre'); if (meilleur) meilleur.repli = 7; }
    return meilleur;
  }

  // Tire jusqu'à obtenir un plan bon ; au pire, le plan de repli (les salles au milieu de leurs zones), qui l'est toujours.
  // Le plan choisi reçoit ensuite sa pièce interdite, qui ne change rien au tirage (nu : sans elle — tools/dedales.js compare).
  function plan(hasard, n, genre, nu) {
    for (let k = 1; k <= 40; k++) { const p = tirage(hasard, n, genre, false); if (p && !verifie(p, genre).length) { p.essais = k; if (!nu) p.interdite = interdite(p, genre); return p; } }
    for (let k = 1; k <= 40; k++) { const p = tirage(hasard, n, genre, true); if (p && !verifie(p, genre).length) { p.essais = 40 + k; p.secours = true; if (!nu) p.interdite = interdite(p, genre); return p; } }
    return null;
  }

  const api = { plan, verifie, distances, interdite, PROFONDEURS, LIEUX, maille, W, H, MARGE, LARGE };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else racine.ISNAD_DEDALE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
