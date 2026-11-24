/* ISNAD 2.29 (D220) — la carte du monde : sortir d'une ville par sa porte, prendre la route, entrer dans une autre ville, revenir.
   Demande du décideur, 23 novembre : « un "meta-monde" […] ou on accéderait aux autres villes via le désert avec une carte
   réaliste qui rend accès aux villes prévue dans la saga et les autres saga même s'il ne s'y passe rien […] une carte global
   ou les points d'intérêt sont accessibles en sortant de chaque ville par sa porte. » Ses choix : les villes des sagas, La Mecque et Tâ'if, Jérusalem, Bassora et Fustât ; La Mecque, une visite sobre ;
   une ville n'apparaît qu'à partir de l'époque où elle existe. Les données sont dans defs.js (D.MONDE), la carte dans maps.js
   (monde), le dessin des villes dans gfx.js.
   - Les portes : dans un chapitre d'un récit, sur la carte que D.MONDE.depuis lui donne, à partir de son objectif — la ville
     d'Arabie au nord et au sud (porte_nord, porte_sud), la cité romaine au sud (sous la porte), le camp à l'ouest (devant
     l'entrée) ; Koufa, retournée, suit son miroir. On sort en marchant vers le bord, ou par A, tourné vers lui (passages.js,
     P.ajouter : les mêmes gardes que la rue — Idris a la main, ni récit, ni combat, ni menu ; le joueur de test du moteur ne
     sort jamais). Jamais dans l'histoire-cadre, les veillées, le dernier maillon ; ni la mer, ni la noosphère, ni une route.
   - Sortir, c'est le schéma de l'ascenseur (2.28) : le même chapitre, rien n'est rangé ; le point de retour (la carte, ses
     réglages, la place d'Idris un pas en deçà de la porte, celle des personnages) est gardé dans les drapeaux du chapitre
     (S.flags._monde), et le point de reprise est pris sur la carte du monde : une partie quittée là s'y rouvre. Idris paraît à
     côté de la ville du récit, du côté de la porte ; la flèche la montre. Y revenir (y marcher, ou A) recharge la carte du
     chapitre à la porte : l'objectif, les drapeaux et les personnages n'ont pas bougé.
   - Les visites : marcher sur une autre ville (ou A, tout près) y entre — « Entrer : Damas » se lit au-dessus d'elle. Sa carte
     (D.MAPS, visite_…) n'a ni personnage ni objectif ; un carton dit son nom et l'époque du chapitre ; un comptoir (les étals
     d'un lieu du jeu) et un tapis, où l'on prie et se repose sans que les œuvres se comptent (oeuvres.js, O.sobre) — on n'y
     descend pas dans la noosphère. On en ressort par sa porte, vers la carte du monde. Rien n'y rôde. La Mecque : ni mosquée,
     ni Haram, ni Kaaba (maps.js, la variante « mecque »).
   - La progression (lecons.js) : l'outil « route », un simple geste, dit à la première sortie (I.lecons.proposer) ; si la
     progression ne peut pas encore le donner, la porte attend. Revenir à la ville du récit est son réemploi.
   - La partie : rien de plus que les drapeaux du chapitre, gardés avec son point de reprise ; le format reste le 2. Une partie
     d'avant (sans `lecons`) entend la leçon une fois (I.save.data._route).
   - 2.30 (D222) : le bandeau d'une ville visitée dit son nom (Mo.sousTitre) ; et les rencontres de la route — les chimères du
     désert, les brigands, le voyageur —, plus bas. Une ville visitée n'a pas d'étendard (maps.js, MB.finish). */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D, W = I.world, S = I.script, P = I.passages, G = I.gfx, T = 16;
  const Mo = I.monde = { journal: [] };
  const MONDE = 'monde';
  const recit = () => !!(W.saga && !W.saga.frame && !W.saga.veillees && W.ch && !W.ch.fin);
  // ce que D.MONDE dit du chapitre en cours : son année, son époque, ses portes (null hors d'un récit qui en a)
  Mo.chapitre = () => (recit() && D.MONDE.depuis[W.ch.id]) || null;
  Mo.dehors = () => !!(recit() && S.flags && S.flags._monde);   // sur la route, ou dans une ville de passage
  Mo.surRoute = () => Mo.dehors() && !!W.map && W.map.id === MONDE;
  Mo.enVisite = () => { const F = Mo.dehors() && S.flags._monde, V = F && F.visite && D.MONDE.villes[F.visite]; return !!(V && W.map && W.map.id === V.carte); };
  // la porte de la carte du récit, à cet objectif : la dernière ouverte de cette carte ({ carte, des, ville }), ou null
  Mo.porte = function () {
    const c = Mo.chapitre(); if (!c || !W.map || Mo.dehors()) return null; let r = null;
    c.portes.forEach(p => { if (p.carte === W.map.id && W.objIndex >= p.des && (!r || p.des >= r.des)) r = p; });
    return r;
  };
  // l'outil peut-il être donné, ou l'est-il déjà ? (comme une activité des quartiers : activites.js, AC.dispo)
  const dispo = () => !I.lecons || !I.lecons.actif() || I.lecons.recu('route') || I.lecons.pret(1);

  /* ----- les bords : où se tient une porte, selon le gabarit de la carte ----- */
  const BORDS = { ville: { nord: 'porte_nord', sud: 'porte_sud' }, romaine: { sud: 'porte' }, camp: { ouest: 'entree' } };
  const LARGE = { ville: 56, romaine: 40, camp: 40 };   // la largeur de la porte, de part et d'autre de son lieu (en points)
  const DIR = { nord: 3, sud: 0, ouest: 1 }, DOS = { nord: 0, sud: 3, ouest: 2 }, DECALE = { nord: [0, -2], sud: [0, 2], ouest: [-2, 0] };
  const gabarit = () => W.map && (D.MAPS[W.map.id] || {}).gabarit;
  const zone = (nom, p, marge) => {
    const g = gabarit(), lieu = BORDS[g] && BORDS[g][nom], s = lieu && W.spotPx(lieu); if (!s) return false; const m = W.map, L = LARGE[g];
    if (nom === 'nord') return p.y <= marge && Math.abs(p.x - s[0]) <= L;
    if (nom === 'sud') return p.y >= m.h * T - marge && Math.abs(p.x - s[0]) <= L;
    return p.x <= marge && Math.abs(p.y - s[1]) <= L;
  };
  const bordOuvert = nom => { const g = gabarit(); if (!BORDS[g] || !BORDS[g][nom]) return false; return Mo.enVisite() || (!!Mo.porte() && dispo()); };
  Object.keys(DIR).forEach(nom => P.ajouter({ id: 'porte-' + nom, dir: DIR[nom], ok: () => bordOuvert(nom), dans: p => zone(nom, p, 14), devant: p => zone(nom, p, 34), fn: () => Mo.sortir(nom) }));

  /* ----- les villes sur la carte du monde ----- */
  const centre = id => { const s = W.map && W.map.spots[id]; return s ? [s[0] * T + 8, s[1] * T + 13] : null; };
  // une ville où l'on peut entrer : une ville de l'époque (elle a son lieu sur la carte), ou le lieu du récit
  const ouverte = id => { const V = D.MONDE.villes[id], F = S.flags._monde; return !!V && !!(W.map && W.map.spots[id]) && (V.genre === 'ville' || (F && F.ville === id)); };
  const villeSous = (p, r) => Object.keys(D.MONDE.villes).find(id => { const c = centre(id); return !!c && ouverte(id) && Math.abs(p.x - c[0]) <= r && Math.abs(p.y - c[1]) <= r; }) || null;
  P.ajouter({ id: 'ville', dir: null, ok: () => Mo.surRoute(), dans: p => !!(Mo._ici = villeSous(p, 9)), devant: p => !!(Mo._ici = villeSous(p, 22)), fn: () => Mo.entrer(Mo._ici), cible: o => Mo.cible(o) });
  // où montre la flèche : sur la route, la ville du récit ; dans une ville de passage, sa porte (au bord de la carte)
  Mo.cible = function () {
    if (Mo.surRoute()) { const c = centre(S.flags._monde.ville); return c ? { x: c[0], y: c[1], gx: c[0], gy: c[1], kind: 'goto', passage: true } : null; }
    if (Mo.enVisite()) { const g = gabarit(), B = BORDS[g], m = W.map; let best = null;
      Object.keys(B || {}).forEach(nom => { const s = W.spotPx(B[nom]); if (!s) return; const q = nom === 'nord' ? [s[0], 6] : nom === 'sud' ? [s[0], m.h * T - 4] : [6, s[1]], d = Math.hypot(q[0] - W.player.x, q[1] - W.player.y); if (!best || d < best.d) best = { d, q }; });
      return best ? { x: best.q[0], y: best.q[1], gx: best.q[0], gy: best.q[1], kind: 'goto', passage: true } : null; }
    return null;
  };
  // les étiquettes au-dessus des villes proches (ui.js, U.noms) : leur nom ; tout près, ce qu'on y fait
  Mo.etiquettes = function (list) {
    if (!Mo.surRoute()) return; const p = W.player, F = S.flags._monde;
    Object.keys(W.map.spots).forEach(id => { const c = centre(id); if (!c) return; const d = Math.hypot(c[0] - p.x, c[1] - p.y); if (d > 150) return;
      const nom = D.LIEUX[id] || id, pres = d <= 30 && ouverte(id), t = pres ? (F && F.ville === id ? I.t('Revenir : {ville}', { ville: nom }) : I.t('Entrer : {ville}', { ville: nom })) : nom;
      list.push({ k: 'v' + id + (pres ? '+' : ''), t, x: c[0], y: c[1] - 10, d: pres ? -2 : d, c: F && F.ville === id ? '#ffe9a8' : '#f3e7cc', bord: true }); });
  };

  /* ----- sortir : de la carte du récit, ou d'une ville de passage, vers la route ----- */
  Mo.opts = () => { const F = S.flags._monde, c = Mo.chapitre(); return { time: ((F && F.retour && F.retour.opts) || {}).time || 'day', an: c ? c.an : undefined }; };
  // Idris à côté de la ville, du côté où il est sorti : une case libre, reliée à la ville, au plus près de ce côté
  function aCote(ville, nom) {
    const m = W.map, s = m.spots[ville]; if (!s) return; const d = DECALE[nom] || [0, 2], but = [s[0] + d[0], s[1] + d[1]], vu = new Set([s[0] + ',' + s[1]]), q = [[s[0], s[1], 0]];
    let best = null;
    for (let i = 0; i < q.length; i++) { const [x, y, k] = q[i]; if (Math.max(Math.abs(x - s[0]), Math.abs(y - s[1])) >= 2) { const e = Math.hypot(x - but[0], y - but[1]); if (!best || e < best.e) best = { x, y, e }; }
      if (k >= 5) continue; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([i2, j2]) => { const nx = x + i2, ny = y + j2, key = nx + ',' + ny; if (nx < 1 || ny < 1 || nx >= m.w - 1 || ny >= m.h - 1 || vu.has(key) || m.solid[ny * m.w + nx]) return; vu.add(key); q.push([nx, ny, k + 1]); }); }
    if (best) { W.player.x = best.x * T + 8; W.player.y = best.y * T + 13; W.resetTrail(); W.updateCam(true); }
  }
  Mo.sortir = async function (nom) {
    if (P.occupe) return; P.occupe = true; S.depth++;
    let dire = false;
    try {
      const p = W.player, m = W.map, visite = Mo.enVisite();
      let ville;
      if (visite) ville = S.flags._monde.visite;
      else {
        const g = Mo.porte(); if (!g) return; ville = g.ville;
        // le point de retour : un pas en deçà de la porte, tourné vers la ville ; les personnages là où ils se tiennent
        const pos = [Math.round(p.x), Math.round(p.y)]; if (nom === 'nord') pos[1] = Math.max(pos[1], 34); else if (nom === 'sud') pos[1] = Math.min(pos[1], m.h * T - 34); else pos[0] = Math.max(pos[0], 34);
        const npcs = {}; W.npcs.forEach(n => { if (n.map === m.id && n.placed && !n.hidden) npcs[n.id] = [Math.round(n.x), Math.round(n.y)]; });
        S.flags._monde = { ville, retour: { map: m.id, opts: W.mapOpts || {}, pos, dir: DOS[nom], npcs } };
        if (I.lecons && I.lecons.actif()) { if (!I.lecons.recu('route')) { I.lecons.sequence(); I.lecons.proposer('route', () => { dire = true; }); } }
        else if (!I.save.data._route) { I.save.data._route = 1; dire = true; }
      }
      W.stop(); I.input.clearHeld();
      Mo.journal.push({ quoi: 'sort', ville, visite, bord: nom, ch: W.ch.id, obj: W.objIndex });
      I.audio.sfx('door'); await S.fade('out', 300);
      delete S.flags._monde.visite;
      // 2.30 (D222) : une traversée commence — ses comptes, neufs (plus bas, « les rencontres de la route »)
      S.flags._monde.tr = neuve(((S.flags._monde.tr || {}).n | 0) + 1);
      W.player.dir = DIR[nom]; W.loadMap(MONDE, Mo.opts(), ville); aCote(ville, nom); W.hud(); W.checkpoint();
      await S.fade('in', 300);
      if (dire && I.lecons) I.lecons.dit('route');
    } finally { S.depth--; P.occupe = false; }
  };

  /* ----- entrer : dans la ville du récit (on y revient), ou dans une ville de passage ----- */
  Mo.entrer = async function (ville) {
    const F = S.flags._monde; if (!F || !ville || P.occupe || !Mo.surRoute()) return; P.occupe = true; S.depth++;
    try {
      W.stop(); I.input.clearHeld();
      const V = D.MONDE.villes[ville], c = centre(ville), nord = !!c && W.player.y < c[1] - 2;
      I.audio.sfx('door'); await S.fade('out', 300);
      if (ville === F.ville) {
        const r = F.retour; delete S.flags._monde;
        W.player.dir = r.dir; W.loadMap(r.map, r.opts || {}, r.pos);
        W.npcs.forEach(n => { const q = r.npcs && r.npcs[n.id]; if (q && n.map === r.map) { n.x = q[0]; n.y = q[1]; n.placed = true; n.placedMap = r.map; } });
        if (W.degager()) W.resetTrail(); W.updateCam(true); W.hud(); W.checkpoint();
        Mo.journal.push({ quoi: 'revient', ville, ch: W.ch.id, obj: W.objIndex });
        if (I.lecons) I.lecons.reemploi('route');
        await S.fade('in', 300);
      } else {
        const g = (D.MAPS[V.carte] || {}).gabarit, spot = g === 'romaine' ? 'porte' : g === 'camp' ? 'entree' : nord ? 'porte_nord' : 'porte_sud';
        F.visite = ville; W.player.dir = g === 'romaine' ? 3 : g === 'camp' ? 2 : nord ? 0 : 3;
        W.loadMap(V.carte, { time: Mo.opts().time }, spot); W.hud(); W.checkpoint();   // (2.30 : le bandeau dit la ville visitée — Mo.sousTitre)
        Mo.journal.push({ quoi: 'visite', ville, ch: W.ch.id, obj: W.objIndex });
        await S.fade('in', 300);
        const c2 = Mo.chapitre(); I.audio.sfx('roll');
        await S.card('title', `<h1>${I.esc(D.LIEUX[ville] || ville)}</h1>${c2 && c2.epoque ? `<p>${I.esc(c2.epoque)}</p>` : ''}<div class="rule"></div>`, 3000);
      }
    } finally { S.depth--; P.occupe = false; S.hideDialog(); }
  };
  // le bandeau du chapitre, dans une ville de passage : son époque et le nom de la ville visitée (null ailleurs : le sous-titre
  // du chapitre) — 2.30 : à La Mecque, on lisait encore « An 11 H · 632 · Médine »
  Mo.sousTitre = function () { if (!Mo.enVisite()) return null; const c = Mo.chapitre(), v = S.flags._monde.visite; return c && c.epoque ? I.t('{epoque} · {ville}', { epoque: c.epoque, ville: D.LIEUX[v] || v }) : null; };

  /* ================= 2.30 (D222) — les rencontres de la route =================
     Le décideur, 23 novembre, en demandant la carte du monde : « Ça permettrait aussi de croiser des brigands et des monstres
     dans le déserts et se faire de l'argent » (pour les brigands : la parole d'abord, puis leur chimère, « La Razzia ») ; puis :
     « Ok mais je veux qu'un moment il rencontre le désespoir » (« La parole, puis sa chimère » ; « Parfois, à chaque
     traversée »). Les nombres sont dans D.MONDE.rencontres, les textes dans coeur.js (route) ; rien d'autre ne s'écrit ici.
     - La traversée va de la sortie par une porte à l'entrée dans une ville. Ses comptes vivent dans les drapeaux du chapitre
       (S.flags._monde.tr : son numéro, sa graine, les cases passées, les chimères vaincues, les brigands croisés, le voyageur
       posé) ; ils partent avec eux quand on revient à la ville du récit. Le format de la partie reste le 2.
     - Rien près des villes ni de La Mecque (Mo.interdit) : à deux cases d'une ville ou moins, à trois cases de La Mecque ou
       moins — un territoire sacré —, ni chimère, ni combat, ni rencontre d'aucune sorte. Rien dans une ville de passage.
     - Les chimères du désert : le mécanisme des rues (rodeurs.js, poserRues, env.rues), réglé ici (Mo.rodent).
     - Les brigands : loin des routes, une embuscade au plus par traversée (trade.js, Tr.raid, `embuscade`).
     - Le voyageur : une fois par traversée, peut-être, un voyageur de fiction est assis dans le sable, accablé. A devant lui
       ouvre un pourparler où le Désespoir parle en lui (une idée noire : on lui répond, par la parole, la pédagogie ou la
       bienveillance) ; apaisé, il se relève et reprend la route ; sinon, la chimère qui le tient (coeur.js,
       route.voyageur.chimere) se lève, et l'on se bat contre elle, jamais contre lui ; on peut la fuir ; vaincue, elle le
       libère. Ce sont les Compagnons qui lui répondent : aucun texte ne leur prête le désespoir.
     - Sur la route, rien de ce qui se dit ne touche au récit : ni l'idole du chapitre (mal.js), ni ses piliers (world.js), ni
       le compte de ses pourparlers (script.js). Rien ne s'y gagne hors de l'ordinaire : l'expérience d'une parole ou d'un
       combat, les dirhams d'une victoire.
     - La progression (lecons.js) : aucun outil ne dit le pourparler ni l'idée noire ; on y entre en parlant. Tant que l'outil
       « parler » n'est pas reçu, ni brigands ni voyageur : la rencontre attend. Aucun message de plus, aucun outil de plus.
     - Le joueur de test du moteur ne sort jamais : rien de cela ne lui arrive (passages.js, P.main). */
  const VOY = '_voyageur', DESERT = ['sand', 'dune', 'steppe'];
  const RG = () => D.MONDE.rencontres || {};
  const route = () => ((I.sagas.coeur || {}).route) || {};
  // (un outil de contrôle peut forcer une chance, ou le nombre de chimères : I.debug.rencontres = { brigands, voyageur, chimeres })
  const dbg = (k, v) => { const d = I.debug.rencontres; return d && typeof d[k] === 'number' ? d[k] : v; };
  const neuve = n => ({ n: n || 1, g: 1 + Math.floor(Math.random() * 1e9), pas: 0 });
  // la traversée en cours (une partie de la 2.29 quittée sur la route n'en avait pas : elle commence là)
  const trav = () => { const F = Mo.dehors() && S.flags._monde; if (!F) return null; return F.tr || (F.tr = neuve(1)); };
  Mo.traversee = trav;
  const cas = (px, py) => [Math.floor(px / T), Math.floor(py / T)];
  const cheb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
  // la distance, en cases (la diagonale pour une), de chaque case à la plus proche de celles que `src` désigne (255 au plus)
  function distances(m, src) {
    const w = m.w, h = m.h, d = new Uint8Array(w * h).fill(255); for (let i = 0; i < w * h; i++) if (src(i)) d[i] = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; let v = d[i]; if (x > 0) v = Math.min(v, d[i - 1] + 1); if (y > 0) { v = Math.min(v, d[i - w] + 1); if (x > 0) v = Math.min(v, d[i - w - 1] + 1); if (x < w - 1) v = Math.min(v, d[i - w + 1] + 1); } d[i] = v; }
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) { const i = y * w + x; let v = d[i]; if (x < w - 1) v = Math.min(v, d[i + 1] + 1); if (y < h - 1) { v = Math.min(v, d[i + w] + 1); if (x < w - 1) v = Math.min(v, d[i + w + 1] + 1); if (x > 0) v = Math.min(v, d[i + w - 1] + 1); } d[i] = v; }
    return d;
  }
  // ce que la carte du monde sait d'elle-même, une fois pour toutes : la distance aux routes et aux points d'eau (une oasis, un
  // fleuve, une terre verte), et les cases où rien ne se croise (autour des villes de l'époque, et de La Mecque)
  function champs(m) {
    if (m._champs) return m._champs;
    const w = m.w, R0 = RG(), sol = i => m.g0((i % w) * T + 8, Math.floor(i / w) * T + 8), lieux = Object.keys(m.spots).map(k => [k, m.spots[k]]), interdit = new Uint8Array(w * m.h);
    const carre = (s, r, M) => { for (let y = s[1] - r; y <= s[1] + r; y++) for (let x = s[0] - r; x <= s[0] + r; x++) if (x >= 0 && y >= 0 && x < w && y < m.h) M[y * w + x] = 1; };
    lieux.forEach(([k, s]) => carre(s, k === 'mecque' ? R0.mecque : R0.villes, interdit));
    // les chimères, plus loin encore de La Mecque : on ne les voit pas depuis elle (chimeres.mecque)
    const ferme = interdit.slice(); if (m.spots.mecque) carre(m.spots.mecque, (R0.chimeres || {}).mecque | 0, ferme);
    return (m._champs = { route: distances(m, i => !!(m.pistes && m.pistes[i])), eau: distances(m, i => ['grass', 'water', 'wood'].indexOf(sol(i)) >= 0), interdit, ferme, lieux: lieux.map(q => q[1]) });
  }
  Mo.champs = () => (W.map && W.map.id === MONDE ? champs(W.map) : null);

  /* ----- 2.33 (le décideur, 24 novembre : « ajoute une carte pour se situer dans le désert et les différentes villes » ; son
     choix : « Petite carte + carte entière ») — sur la route, une petite carte dans le coin, comme celle des villes : le pays
     autour de celui qui mène (la mer, les fleuves, le sable, la steppe, les montagnes), les routes, les villes proches et leur
     nom, l'objectif ; la toucher ouvre la carte entière (la Carte de la halte, world.js : W.miniRect). Rien dans les villes. ----- */
  const COUL = { sea: '#2c5f7c', water: '#4189aa', sand: '#d9b97c', dune: '#c8a160', steppe: '#a8a56b', grass: '#7f9a55', mont: '#86705a' };
  let fond = null;
  const fondMonde = m => { if (fond && fond.m === m) return fond.cv; const cv = G.mk(m.w, m.h), c = cv.getContext('2d'), R = champs(m).route;
    for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) { const n = m.g0(x * T + 8, y * T + 8); c.fillStyle = R[y * m.w + x] === 0 && n !== 'sea' ? '#f3e6c4' : (COUL[n] || '#c8a160'); c.fillRect(x, y, 1, 1); }
    fond = { m, cv }; return cv; };
  Mo.RAYON = 12;   // la petite carte montre vingt-cinq cases de côté (une case : une vingtaine de kilomètres)
  Mo.miniCarte = function (c, t, tg) {
    const m = W.map; if (!m || m.id !== MONDE) return false;
    const V = G.view, Zm = (I.ui && I.ui.Z) || 1, haut = I.ui && I.ui.zoom, q = Math.min(1, (haut ? 1.25 : 1) / Zm), n = Mo.RAYON * 2 + 1, k = 2.4 * q, mw = n * k, mh = n * k, crop = V.w < G.PW || V.h < G.PH;
    const mx = !crop ? G.PW - mw - 8 : haut ? V.x + 5 / Zm : V.x + V.w - mw - 8 / Zm, my = !crop ? 27 : V.y + (haut ? 5 : 27) / Zm, b2 = 2 * q;
    const p = W.player, px = Math.floor(p.x / T), py = Math.floor(p.y / T), x0 = px - Mo.RAYON, y0 = py - Mo.RAYON;
    W.miniRect = [mx - b2, my - b2, mw + 2 * b2, mh + 2 * b2];
    c.save(); c.globalAlpha = 0.9; c.fillStyle = 'rgba(8,6,16,.6)'; c.fillRect(mx - b2, my - b2, mw + 2 * b2, mh + 2 * b2);
    c.beginPath(); c.rect(mx, my, mw, mh); c.clip(); c.fillStyle = COUL.sea; c.fillRect(mx, my, mw, mh); c.imageSmoothingEnabled = false;
    const sx = Math.max(0, x0), sy = Math.max(0, y0), ex = Math.min(m.w, x0 + n), ey = Math.min(m.h, y0 + n);
    if (ex > sx && ey > sy) c.drawImage(fondMonde(m), sx, sy, ex - sx, ey - sy, mx + (sx - x0) * k, my + (sy - y0) * k, (ex - sx) * k, (ey - sy) * k);
    c.globalAlpha = 1;
    // les villes : un carré d'or, et leur nom, sans qu'un nom en chevauche un autre (celle du récit d'abord, puis la plus proche) ;
    // une ville un peu hors du cadre : une encoche au bord, et son nom au plus près, dedans
    const noms = Object.assign({}, D.LIEUX, (D.MAPS[MONDE] || {}).noms || {}), F = S.flags._monde, fs = Math.max(6.5, 7.5 * q), pris = [{ x: mx + Mo.RAYON * k - 3 * q, y: my + Mo.RAYON * k - 3 * q, w: k + 6 * q, h: k + 6 * q }];   // (la place d'Idris d'abord : aucun nom dessus)
    c.font = `700 ${fs}px "Alegreya", "Amiri", serif`; c.textBaseline = 'middle'; c.lineJoin = 'round';
    const libre = r => r.x >= mx + 1 && r.y >= my + 1 && r.x + r.w <= mx + mw - 1 && r.y + r.h <= my + mh - 1 && !pris.some(o => r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y);
    const ecrire = (nom, tx, ty) => { c.strokeStyle = 'rgba(16,10,22,.85)'; c.lineWidth = 2.2 * q; c.strokeText(nom, tx, ty); c.fillStyle = '#fff6dc'; c.fillText(nom, tx, ty); };
    Object.keys(D.MONDE.villes).filter(id => m.spots[id]).map(id => ({ id, s: m.spots[id], d: Math.hypot(m.spots[id][0] - px, m.spots[id][1] - py) }))
      .filter(v => v.d <= Mo.RAYON * 2.2).sort((a, b) => ((F && b.id === F.ville) - (F && a.id === F.ville)) || a.d - b.d).forEach(v => {
        const X = mx + (v.s[0] - x0 + 0.5) * k, Y = my + (v.s[1] - y0 + 0.5) * k, dedans = X >= mx && X <= mx + mw && Y >= my && Y <= my + mh;
        const nom = noms[v.id] || v.id, w = c.measureText(nom).width, h = fs + 1;
        if (dedans) {
          c.fillStyle = '#1a1420'; c.fillRect(X - 2.2 * q, Y - 2.2 * q, 4.4 * q, 4.4 * q); c.fillStyle = F && v.id === F.ville ? '#ffe08a' : '#e9c877'; c.fillRect(X - 1.5 * q, Y - 1.5 * q, 3 * q, 3 * q);
          pris.push({ x: X - 2.5 * q, y: Y - 2.5 * q, w: 5 * q, h: 5 * q });
          const essais = [[X + 4 * q, Y], [X - 4 * q - w, Y], [X - w / 2, Y - h * 0.9], [X - w / 2, Y + h * 0.9]];
          for (const [tx, ty] of essais) { const r = { x: tx - 1, y: ty - h / 2, w: w + 2, h }; if (libre(r)) { pris.push(r); ecrire(nom, tx, ty); break; } }
        } else {
          // l'encoche au bord, dans la direction de la ville ; le nom tout contre, dedans
          const bx = Math.max(mx + 1.5 * q, Math.min(mx + mw - 1.5 * q, X)), by = Math.max(my + 1.5 * q, Math.min(my + mh - 1.5 * q, Y));
          c.fillStyle = '#e9c877'; c.beginPath(); c.arc(bx, by, 1.8 * q, 0, 6.3); c.fill();
          const tx = Math.max(mx + 3 * q, Math.min(mx + mw - w - 3 * q, bx - w / 2)), ty = Math.max(my + h / 2 + 2 * q, Math.min(my + mh - h / 2 - 2 * q, by + (by > my + mh / 2 ? -h * 0.75 : h * 0.75)));
          const r = { x: tx - 1, y: ty - h / 2, w: w + 2, h }; if (libre(r)) { pris.push(r); c.globalAlpha = 0.85; ecrire(nom, tx, ty); c.globalAlpha = 1; }
        }
      });
    // l'objectif (la ville du récit), puis celui qui mène, au centre
    if (tg && Math.floor(t * 3) % 2) { const X = mx + (tg.gx / T - x0) * k, Y = my + (tg.gy / T - y0) * k; c.strokeStyle = '#ffe08a'; c.lineWidth = q; c.strokeRect(X - 3 * q, Y - 3 * q, 6 * q, 6 * q); }
    c.fillStyle = '#1a1420'; c.fillRect(mx + Mo.RAYON * k - 0.5 * q, my + Mo.RAYON * k - 0.5 * q, k + q, k + q);
    c.fillStyle = Math.floor(t * 4) % 2 ? '#ffffff' : '#ff7a5c'; c.fillRect(mx + Mo.RAYON * k, my + Mo.RAYON * k, k, k);
    c.restore();
    c.strokeStyle = 'rgba(233,200,119,.6)'; c.lineWidth = q; c.strokeRect(mx - 1.5 * q, my - 1.5 * q, mw + 3 * q, mh + 3 * q);
    return true;
  };
  // rien ne se croise ici (une case ; un point de la carte)
  Mo.interditCase = (x, y) => { const m = W.map; if (!m || m.id !== MONDE) return false; if (x < 0 || y < 0 || x >= m.w || y >= m.h) return true; return !!champs(m).interdit[y * m.w + x]; };
  Mo.interdit = (px, py) => { const c = cas(px, py); return Mo.interditCase(c[0], c[1]); };
  // une chimère n'y va pas (rodeurs.js, rueOk) : là où rien ne se croise, et à douze cases de La Mecque ou moins
  Mo.fermeAuxChimeres = (x, y) => { const m = W.map; if (!m || m.id !== MONDE) return false; if (x < 0 || y < 0 || x >= m.w || y >= m.h) return true; return !!champs(m).ferme[y * m.w + x]; };
  const loinRoute = (x, y) => champs(W.map).route[y * W.map.w + x];
  const loinEau = (x, y) => champs(W.map).eau[y * W.map.w + x];
  const loinVilles = (x, y) => champs(W.map).lieux.reduce((d, s) => Math.min(d, cheb(s, [x, y])), 999);
  const desert = (x, y) => { const m = W.map; return x >= 0 && y >= 0 && x < m.w && y < m.h && !m.solid[y * m.w + x] && DESERT.indexOf(m.g0(x * T + 8, y * T + 8)) >= 0; };
  // la rencontre peut-elle venir ? (dans une partie neuve, pas avant l'outil « parler » : on y entre en parlant)
  const pret = () => !I.lecons || !I.lecons.actif() || I.lecons.recu('parler');
  Mo.pret = pret;

  /* ----- les chimères du désert : les réglages de rodeurs.js ----- */
  Mo.rodent = function () {
    const tr = trav(); if (!tr || !Mo.surRoute()) return null;
    const R0 = RG(), C = R0.chimeres || {}, E0 = W.saga.enemies || {}, idoles = new Set();
    (W.saga.chapters || []).forEach(ch => I.mal.lignee(W.saga, ch).idoles.forEach(id => idoles.add(id)));   // ni l'idole d'un chapitre
    if (!tr.c) tr.c = cas(W.player.x, W.player.y);   // la ville d'où l'on part : elles se posent autour d'elle, et à l'écart
    const c = tr.c, p = cas(W.player.x, W.player.y);
    return { qui: Object.keys(E0).filter(k => D.rodeDehors(k, E0[k]) && !idoles.has(k)), poids: () => 1, zones: {},
      nombre: dbg('chimeres', C.nombre | 0), vue: C.vue, pas: C.pas, ecart: C.ecart, sel: 'desert/', graine: () => tr.g,
      vaincue: k => !!(tr.vaincues && tr.vaincues[k]), vaincre: k => Mo.vaincre(k),
      libre: (x, y) => { const d = cheb([x, y], c); return d >= C.loin && d <= C.rayon && cheb([x, y], p) >= C.loin; },
      poidsCase: (x, y) => (loinRoute(x, y) >= R0.route ? 1 : C.pres) };
  };
  // une chimère de la traversée est vaincue : elle ne revient pas avant la traversée suivante (celle qui tenait le voyageur le libère)
  Mo.vaincre = function (cle) { const tr = trav(); if (!tr) return; (tr.vaincues || (tr.vaincues = {}))[cle] = 1; if (cle === 'voy' && tr.voy) tr.voy.etat = 'libre'; };

  /* ----- à chaque case : les brigands, le voyageur ----- */
  Mo.tic = function () {
    if (Mo.occupe || !Mo.surRoute() || !P.main || !P.main() || (I.rodeurs && I.rodeurs.fuite)) return;   // (une chimère poursuit : rien d'autre)
    const tr = trav(); if (!tr) return; const c = cas(W.player.x, W.player.y), k = c[0] + ',' + c[1];
    if (tr.ici === k) return; tr.ici = k; tr.pas = (tr.pas | 0) + 1;
    // près d'une ville ou de La Mecque, hors du sable, des dunes et de la steppe : rien ; sans l'outil « parler » : la rencontre attend
    if (!desert(c[0], c[1]) || Mo.interditCase(c[0], c[1]) || !pret()) return;
    const R0 = RG(), B = R0.brigands || {}, V = R0.voyageur || {};
    if (!tr.brig && tr.pas >= B.apres && loinRoute(c[0], c[1]) >= R0.route && Math.random() < dbg('brigands', B.chance)) { tr.brig = 1; Mo.embuscade(); return; }
    if (!tr.voy && !tr.tire && tr.pas >= V.apres && loinVilles(c[0], c[1]) >= V.loin) {
      tr.tire = 1; const pres = loinRoute(c[0], c[1]) < R0.route || loinEau(c[0], c[1]) < V.eau;   // une seule fois par traversée
      if (Math.random() < dbg('voyageur', V.chance * (pres ? V.pres : 1))) poserVoyageur();
    }
  };

  /* ----- les brigands : une embuscade, la parole avec le chef, puis La Razzia (trade.js) ----- */
  // 2.32 (D224 ; le décideur, 24 novembre : « On ne voit pas les pillards il faut quand même que le combat soit visuellement
  // justifié ») : ils paraissent — quatre hommes qui barrent la piste devant celui qui mène, leurs deux chameaux chargés derrière
  // eux ; le chef parle avec son visage ; la parole perdue, La Razzia se lève du milieu d'eux, puis le combat, où ils se tiennent à
  // l'écart (battle.js, `temoins`) ; à la fin, ils baissent les armes et s'en vont avec les bêtes. Sans place pour eux (une rive,
  // un relief), l'embuscade reste dite par le texte, comme en 2.30.
  Mo.embuscade = async function () {
    if (Mo.occupe) return; Mo.occupe = true; S.depth++; let bande = null;
    try { W.stop(); I.input.clearHeld(); const c = cas(W.player.x, W.player.y); Mo.journal.push({ quoi: 'brigands', x: c[0], y: c[1], n: (trav() || {}).n }); I.audio.sfx('dark');
      bande = await poserPillards();
      await I.trade.raid({ embuscade: true, chef: bande ? CHEF : null, lever: bande ? () => leverRazzia(bande) : null, apaises: bande ? lutte => baisser(bande, lutte) : null });
      if (bande) await partirPillards(bande);
      W.checkpoint(); }
    finally { if (bande) oterPillards(bande); S.depth--; Mo.occupe = false; S.hideDialog(); }
  };

  /* ----- 2.32 : les pillards qu'on voit ----- */
  const CHEF = '_pillards_chef';
  const versDir = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
  const libreIci = (x, y) => { const m = W.map; if (x < 8 || y < 8 || x > m.w * T - 8 || y > m.h * T - 8) return false; const k = cas(x, y); return desert(k[0], k[1]) && !W.solidAt(x - 5, y - 3) && !W.solidAt(x + 5, y - 3) && !W.solidAt(x, y); };
  // où ils se tiennent : en arc, à trois cases devant (puis sur un autre côté, s'il le faut) ; d'où ils viennent : cinq cases plus loin
  function placesPillards() {
    const p = W.player, dirs = [p.dir].concat([0, 1, 2, 3].filter(d => d !== p.dir));
    for (const d of dirs) {
      const fx = [0, -1, 1, 0][d], fy = [1, 0, 0, -1][d], lx = -fy, ly = fx, pt = (av, lat) => [p.x + fx * av + lx * lat, p.y + fy * av + ly * lat];
      const H0 = [[40, 0], [48, -22], [48, 22], [58, -8]], B0 = [[80, -14], [84, 14]], fin = H0.map(q => pt(q[0], q[1])), betes = B0.map(q => pt(q[0], q[1]));
      if (!fin.concat(betes).every(q => libreIci(q[0], q[1]))) continue;
      // d'où ils viennent : le plus loin possible sur la même ligne (70, 45 ou 20 points de plus), sinon ils sont déjà là
      for (const k of [70, 45, 20, 0]) { const dep = H0.map(q => pt(q[0] + k, q[1])), depB = B0.map(q => pt(q[0] + k, q[1]));
        if (dep.concat(depB).every(q => libreIci(q[0], q[1]))) return { fin, dep, betes, depB, face: versDir(-fx, -fy) }; }
    }
    return null;
  }
  async function poserPillards() {
    if (!I.gens || I.debug.auto) return null;   // (le joueur de test du moteur ne sort jamais ; s'il le faisait, rien ne paraîtrait)
    const L = placesPillards(); if (!L) { Mo.journal.push({ quoi: 'brigands', etat: 'sans-place' }); return null; }
    const P0 = I.trade.PILLARDS, hommes = P0.map((look, i) => ({ id: i ? '_pillard_' + i : CHEF, name: i ? I.t('Un pillard') : I.t('Le chef des pillards'), map: MONDE, route: true, pillard: true, hidden: false, placed: true, placedMap: MONDE,
      x: L.dep[i][0], y: L.dep[i][1], dir: L.face, pose: null, sheet: I.gfx.planche(look), aura: null }));
    W.npcs = W.npcs.filter(n => !n.pillard); hommes.forEach(n => W.npcs.push(n));
    const betes = L.depB.map((q, i) => I.gens.ajouter({ esp: 'chameau', map: MONDE, x: q[0], y: q[1], charge: true, route: true, pillards: true, vit: 0.9 }));
    Mo.journal.push({ quoi: 'brigands', etat: 'paraissent', hommes: hommes.length, betes: betes.length });
    await Promise.all(hommes.map((n, i) => W.walkTo(n, L.fin[i][0], L.fin[i][1])).concat(betes.map((b, i) => I.gens.aller(b, L.betes[i][0], L.betes[i][1]))));
    hommes.forEach(n => { n.dir = versDir(W.player.x - n.x, W.player.y - n.y); n.moving = false; });
    W.player.dir = versDir(hommes[0].x - W.player.x, hommes[0].y - W.player.y);
    await I.sleep(250);
    return { hommes, betes, L, razzia: null };
  }
  // la parole perdue : La Razzia se lève du milieu d'eux — une image, qu'on ne touche pas — puis le combat s'ouvre
  async function leverRazzia(B) {
    const c = B.hommes.reduce((a, n) => [a[0] + n.x / B.hommes.length, a[1] + n.y / B.hommes.length], [0, 0]);
    B.hommes.forEach(n => { n.pose = 'colere'; });
    B.razzia = I.gens.lever('razzia', MONDE, c[0], c[1] + 6); I.audio.sfx('dark'); Mo.journal.push({ quoi: 'brigands', etat: 'razzia' });
    await I.sleep(1300);
    I.gens.retirer(b => b === B.razzia); B.razzia = null;
  }
  // la chimère vaincue : des hommes fatigués, qui posent les armes (la parole gagnée : le chef ne baisse pas la tête — coeur.js)
  function baisser(B, lutte) { B.hommes.forEach(n => { n.pose = lutte ? 'triste' : null; }); Mo.journal.push({ quoi: 'brigands', etat: lutte ? 'baissent' : 'rendent' }); }
  // ils s'en vont avec les bêtes, à l'opposé de celui qui mène, et sortent de la vue
  async function partirPillards(B) {
    const p = W.player, L = B.L, loin = (q, k) => [q[0] + (q[0] - p.x) * k, q[1] + (q[1] - p.y) * k];
    B.hommes.forEach(n => { n.pose = null; });
    await Promise.all(B.hommes.map((n, i) => { const q = loin(L.fin[i], 1.6); return libreIci(q[0], q[1]) ? W.walkTo(n, q[0], q[1]) : W.walkTo(n, L.dep[i][0], L.dep[i][1]); })
      .concat(B.betes.map((b, i) => I.gens.aller(b, L.depB[i][0], L.depB[i][1]))));
    Mo.journal.push({ quoi: 'brigands', etat: 'partis' });
  }
  function oterPillards(B) { W.npcs = W.npcs.filter(n => !n.pillard); I.gens.retirer(b => b.pillards || b === B.razzia); }

  /* ----- le voyageur ----- */
  // un homme de fiction, sans nom (« Un voyageur ») : il a un visage, puisqu'il n'est pas un Compagnon (sprites.js) ; une tenue de
  // route, des couleurs de sable, rien qui dise un peuple ni une tribu
  const LOOK = { kind: 'homme', robe: '#8c7558', head: '#ddd2bb', cloak: '#6c5a44', manteau: 'long' };
  function pnj(v) { return { id: VOY, name: I.t('Un voyageur'), map: MONDE, route: true, hidden: false, placed: true, placedMap: MONDE, x: v.x, y: v.y, dir: 0, pose: 'accable', sheet: I.gfx.planche(LOOK), aura: null }; }
  // il s'assied devant celui qui mène, à quelques cases : dans le désert, loin des villes, hors de la route s'il se peut
  function poserVoyageur() {
    const tr = trav(), p = W.player, V = RG().voyageur || {}, m = W.map, c = cas(p.x, p.y), bx = c[0] + [0, -1, 1, 0][p.dir] * V.devant, by = c[1] + [1, 0, 0, -1][p.dir] * V.devant;
    let best = null;
    for (let r = 0; r <= 3; r++) for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { if (Math.max(Math.abs(i), Math.abs(j)) !== r) continue; const x = bx + i, y = by + j;
      if (!desert(x, y) || Mo.interditCase(x, y) || loinVilles(x, y) < V.loin || cheb([x, y], c) < 3) continue;
      if (W.foes.some(f => !f.done && f.map === m.id && f.placed && cheb(cas(f.x, f.y), [x, y]) <= 1)) continue;
      if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => desert(x + a, y + b))) continue;
      const e = (loinRoute(x, y) ? 0 : 2) + Math.hypot(i, j) * 0.25; if (!best || e < best.e) best = { x, y, e }; }
    if (!best) { Mo.journal.push({ quoi: 'voyageur', etat: 'sans-place' }); return false; }
    tr.voy = { x: best.x * T + 8, y: best.y * T + 13, etat: 'assis' };
    W.npcs = W.npcs.filter(n => !n.route); W.npcs.push(pnj(tr.voy));
    Mo.journal.push({ quoi: 'voyageur', etat: 'pose', x: best.x, y: best.y, n: tr.n });
    return true;
  }
  // la chimère qui le tient se lève, juste derrière lui ; elle ne s'en éloigne pas (rodeurs.js : `garde`), sauf pour poursuivre
  function lever(n) {
    const R0 = route().voyageur || {}, id = R0.chimere, def = id && I.common && I.common.enemies[id]; if (!def) return null;
    W.foes = W.foes.filter(f => f.cle !== 'voy');
    const R = I.rodeurs, cx = Math.floor(n.x / T), cy = Math.floor((n.y - 2) / T), C = RG().chimeres || {};
    const q = [[cx, cy - 1], [cx + 1, cy], [cx - 1, cy], [cx, cy + 1]].find(([x, y]) => R.rueOk(x, y)) || [cx, cy], x = q[0] * T + 8, y = q[1] * T + 8;
    const f = { id: 'voyageur_chimere', group: [id], map: MONDE, rodeur: true, rue: true, desert: true, voyageur: true, garde: true, cle: 'voy', done: false, placed: true, x, y, x0: x, y0: y, cx: null, ph: 1.3, v: R.MARCHE * C.pas, vue: C.vue, intro: I.t('{nom} ne le lâche pas.', { nom: def.name }) };
    W.foes.push(f); return f;
  }
  // il se relève, et reprend la route : quelques pas à l'écart de celui qui mène, puis il s'éloigne hors de la vue
  async function reprendre(n) {
    const tr = trav(); if (tr && tr.voy) tr.voy.etat = 'parti';
    n.pose = null; const c = cas(n.x, n.y - 2), p = W.player; let best = null;
    for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) { const x = c[0] + i, y = c[1] + j; if (Math.max(Math.abs(i), Math.abs(j)) < 3 || !desert(x, y)) continue; const d = Math.hypot(x * T + 8 - p.x, y * T + 13 - p.y); if (!best || d > best.d) best = { x, y, d }; }
    if (best) await W.walkTo(n, best.x * T + 8, best.y * T + 13);
    n.hidden = true; W.npcs = W.npcs.filter(q => q !== n); Mo.journal.push({ quoi: 'voyageur', etat: 'parti' });
    if (W.saga && !I.debug.auto) W.checkpoint();
  }
  // à chaque chargement d'un lieu : le voyageur de la traversée, assis là où il était (et, s'il est encore tenu, sa chimère)
  Mo.arme = function () {
    if (W.npcs.some(n => n.route)) W.npcs = W.npcs.filter(n => !n.route);
    if (!W.map || W.map.id !== MONDE || !Mo.surRoute()) return;
    const tr = trav(), v = tr && tr.voy; if (!v || v.etat === 'parti' || v.etat === 'libre') return;
    const n = pnj(v); W.npcs.push(n);
    if (v.etat === 'tenu' && !(tr.vaincues && tr.vaincues.voy)) lever(n);
  };
  // A devant lui (world.js, W.interact)
  Mo.parle = function (n) { if (!n || n.id !== VOY || !n.route) return false; if (!Mo.occupe) Mo.voyageur(n); return true; };
  Mo.voyageur = async function (n) {
    const tr = trav(), v = tr && tr.voy, R0 = route().voyageur || {}; if (!v || Mo.occupe || v.etat === 'parti' || v.etat === 'libre') return;
    Mo.occupe = true; S.depth++; let f = null, res = null;
    try {
      W.stop(); I.input.clearHeld();
      if (v.etat === 'assis') {
        // le pourparler : le Désespoir parle en lui ; « _voyageur_tenu », s'il n'est pas apaisé (coeur.js, route.voyageur.parle)
        Mo.journal.push({ quoi: 'voyageur', etat: 'parle' }); delete S.flags._voyageur_tenu;
        await S.run(R0.parle || []); S.hideDialog();
        const tenu = !!S.flags._voyageur_tenu; delete S.flags._voyageur_tenu;
        if (!tenu) { Mo.journal.push({ quoi: 'voyageur', etat: 'apaise' }); await reprendre(n); return; }
        v.etat = 'tenu'; f = lever(n); W.checkpoint();
      } else { await S.run(R0.encore || []); S.hideDialog(); f = W.foes.find(q => q.cle === 'voy' && !q.done) || lever(n); }
      if (!f) return;
      Mo.journal.push({ quoi: 'voyageur', etat: 'combat' });
      res = await I.rodeurs.combatDehors(f);   // contre la chimère qui le tient, jamais contre lui
      Mo.journal.push({ quoi: 'voyageur', etat: res });
    } finally { S.depth--; Mo.occupe = false; S.hideDialog(); }
    if (res) await Mo.apres(f, res);
  };
  // après un combat sur la route (rodeurs.js) : la chimère qui tenait le voyageur, vaincue, le libère ; rien d'autre n'est dit
  Mo.apres = async function (f, res) {
    if (!f || !f.voyageur || res !== 'win') return;
    const n = W.npcs.find(x => x.id === VOY && x.route); if (!n) return;
    Mo.occupe = true; S.depth++;
    try { await S.run((route().voyageur || {}).libere || []); S.hideDialog(); await reprendre(n); }
    finally { S.depth--; Mo.occupe = false; S.hideDialog(); }
  };
})();
