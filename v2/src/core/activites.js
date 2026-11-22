/* ISNAD 2.28 (D217) — les activités des quartiers de la Cité-Miroir : la borne, l'étal de la galerie, l'écran géant, la grande
   roue et les manèges du parc. Demandes du décideur, 21 et 22 novembre : « améliore la cité miroir avec des belles voitures,
   des jeux en tous genres, des activités […] il y trouve beaucoup d'activités mais tout le monde est triste et seul » ; « Les
   activités de la cité miroir sont omniprésents des le début et peuvent faire l'objet de jeux légers quelque soit
   l'avancement dans la saga » ; « il faut qu'idriss puisse "faire les activités" en les payant dans les quartiers : manèges
   etc ». La course est à part (circuit.js), et reste gratuite.
   - La borne (salle de jeux, la borne du milieu) : « Les lueurs », un jeu d'adresse inventé par le jeu, d'une minute au plus
     (D.BORNE). Le joystick ou les flèches mènent une lueur dans l'écran de la borne ; A (Entrée) lui donne un élan ; on rassemble
     les lueurs qui passent, on évite les ombres (une ombre touchée défait la chaîne, rien de plus). Le tirage est le même à
     chaque partie : seule l'adresse fait le score ; on garde le meilleur. B (Échap) met en pause, puis offre de quitter (B revient
     d'un cran). Les autres bornes restent du décor.
   - L'étal de la galerie (devant la vitrine du milieu) : des pièces ordinaires (D.GEAR_SHOPS.quartiers, D.GEAR_PRIX ; gear.js).
   - L'écran géant : près d'un banc libre de la place, A — Idris s'assied (l'attitude « assis ») et regarde ; l'écran montre des
     formes qui coulent (gfx.js, qecran) ; une ligne, sa pensée, dit la solitude des autres. B ou un pas le relève. C'est libre.
   - La grande roue, les chaises volantes, les tasses (le parc ; dessinées par le jeu, gfx.js) : un tour se joue en vue. Idris
     monte (sa nacelle, sa chaise, sa tasse), le manège tourne, il redescend. La grande roue lève la vue sur toute la Cité
     (W.regard), puis la repose ; rien d'autre ne bouge sur la carte.
   - Payer (D.ACTIVITES : le prix d'une partie ou d'un tour) : avec les primes du circuit — ce que l'organisateur des courses a
     versé, moins ce qui a déjà été dépensé dans les quartiers (AC.bourse), dans la limite des dirhams d'Idris. Un menu dit le
     prix et la somme : « Payer », ou « Plus tard » (B). Quand elle manque, un refus sobre ; rien n'est avancé. Une activité
     qu'on paie ne rapporte rien : ni dirhams, ni lot, ni objet (la borne ne donne que son score) ; aucun hasard ne décide de
     rien ; on ne paie jamais pour courir (regles.js).
   - La progression (lecons.js) : un outil par activité (D.OUTILS : borne, etal, ecran, manege), dit au premier essai par
     I.lecons.proposer ; si la progression ne peut pas encore le donner, l'activité attend (comme Sâlim : I.lecons.pret(1)).
     Chaque essai suivant est une séquence, et l'outil y resert (I.lecons.reemploi). Payer n'est pas une leçon.
   - La partie garde `cite.activites` (base.js) : { borne: { record, parties }, tours: { roue, chaises, tasses }, ecran, achats,
     depenses, essais: { borne, etal, ecran, manege } } — des comptes, rien d'autre.
   La première moitié (le jeu de la borne et son pilote d'essai) ne touche pas à la page. */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D;
  const AC = I.activites = { journal: [], K: null, occupe: false, assis: null, vue: null };
  const TAU = Math.PI * 2;
  const borne = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, k) => a + (b - a) * k;
  // un tirage fixe : la même suite à chaque partie (aucun hasard ne décide de rien)
  const graine = s => () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  /* ================= « Les lueurs » : le jeu de la borne ================= */
  AC.nouvellePartie = function () {
    const B = D.BORNE;
    return { t: 0, duree: B.duree, x: B.arene[0] / 2, y: B.arene[1] / 2, elan: 0, repos: 0, choc: 0, score: 0, chaine: 0, meilleure: 0, prises: 0, heurts: 0, elans: 0,
      lueurs: [], ombres: [], orbite: [], eclats: [], prochaineL: 0.5, prochaineO: 2.6, r: graine(20841128), n: 0 };
  };
  // ce qui entre dans l'écran : par un bord, vers un point du milieu ; une lueur (genre 'l') ou une ombre ('o')
  function lancer(K, genre, k) {
    const B = D.BORNE, AW = B.arene[0], AH = B.arene[1], r = K.r, cote = Math.floor(r() * 4);
    let x, y; if (cote === 0) { x = -8; y = 20 + r() * (AH - 40); } else if (cote === 1) { x = AW + 8; y = 20 + r() * (AH - 40); } else if (cote === 2) { x = 20 + r() * (AW - 40); y = -8; } else { x = 20 + r() * (AW - 40); y = AH + 8; }
    const tx = AW * (0.25 + r() * 0.5), ty = AH * (0.25 + r() * 0.5), a = Math.atan2(ty - y, tx - x), V = genre === 'o' ? B.lentes : B.vives, v = lerp(V[0], V[1], k) * (0.85 + r() * 0.3);
    const e = { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: 0, n: K.n++, col: K.n % 5 };
    (genre === 'o' ? K.ombres : K.lueurs).push(e);
  }
  // e = { cap (le cap voulu, ou null), elan (A pressé) }
  AC.avancer = function (K, dt, e) {
    const B = D.BORNE, AW = B.arene[0], AH = B.arene[1]; K.t += dt; const k = Math.min(1, K.t / K.duree);
    K.elan = Math.max(0, K.elan - dt); K.repos = Math.max(0, K.repos - dt); K.choc = Math.max(0, K.choc - dt);
    const va = e && typeof e.cap === 'number';
    if (e && e.elan && va && K.repos <= 0) { K.elan = B.elanDuree; K.repos = B.elanRepos; K.elans++; }
    if (va) { const v = B.vitesse * (K.elan > 0 ? B.elan : 1); K.x = borne(K.x + Math.cos(e.cap) * v * dt, 6, AW - 6); K.y = borne(K.y + Math.sin(e.cap) * v * dt, 6, AH - 6); }
    K.prochaineL -= dt; if (K.prochaineL <= 0) { lancer(K, 'l', k); K.prochaineL += lerp(B.cadence[0], B.cadence[1], k); }
    K.prochaineO -= dt; if (K.prochaineO <= 0) { lancer(K, 'o', k); K.prochaineO += lerp(B.cadenceOmbres[0], B.cadenceOmbres[1], k); }
    const dehors = o => o.age > 1 && (o.x < -20 || o.y < -20 || o.x > AW + 20 || o.y > AH + 20);
    K.lueurs.forEach(l => { l.x += l.vx * dt; l.y += l.vy * dt; l.age += dt;
      if (!l.pris && Math.hypot(l.x - K.x, l.y - K.y) < B.prise) { l.pris = true; K.chaine++; K.meilleure = Math.max(K.meilleure, K.chaine); const pts = 1 + Math.min(4, Math.floor((K.chaine - 1) / B.palier));
        K.score += pts; K.prises++; K.orbite.push({ col: l.col, a: K.prises * 2.4 }); if (K.orbite.length > 10) K.orbite.shift(); K.eclats.push({ x: l.x, y: l.y, t: 0, col: l.col, pts }); K.pris = (K.pris || 0) + 1; } });
    K.ombres.forEach(o => { o.x += o.vx * dt; o.y += o.vy * dt; o.age += dt;
      if (K.choc <= 0 && Math.hypot(o.x - K.x, o.y - K.y) < B.ombre + 4) { K.heurts++; K.chaine = 0; K.choc = B.choc; K.orbite.forEach(q => K.eclats.push({ x: K.x, y: K.y, t: 0, col: q.col, a: q.a, fuit: true })); K.orbite = []; K.heurte = (K.heurte || 0) + 1; } });
    K.lueurs = K.lueurs.filter(l => !l.pris && !dehors(l)); K.ombres = K.ombres.filter(o => !dehors(o));
    K.eclats.forEach(x => { x.t += dt; }); K.eclats = K.eclats.filter(x => x.t < 0.7);
    K.orbite.forEach(q => { q.a += dt * 3; });
    if (K.t >= K.duree) K.fini = true;
  };
  // un joueur d'essai : il vise la lueur qu'il rejoint le plus vite, s'écarte des ombres et des bords, prend son élan de loin
  AC.pilote = function (K, o) {
    o = o || {}; const B = D.BORNE, AW = B.arene[0], AH = B.arene[1], v = B.vitesse;
    let best = null, bt = Infinity;
    K.lueurs.forEach(l => { if (l.pris) return; const d = Math.hypot(l.x - K.x, l.y - K.y), t = d / v, px = l.x + l.vx * t, py = l.y + l.vy * t;
      if (px < 6 || px > AW - 6 || py < 6 || py > AH - 6) return;
      const risque = K.ombres.some(s => Math.hypot(s.x + s.vx * t - px, s.y + s.vy * t - py) < B.ombre + 12), sc = t + (risque ? 2 : 0);
      if (sc < bt) { bt = sc; best = { px, py, d }; } });
    let ax = 0, ay = 0; if (best) { const dx = best.px - K.x, dy = best.py - K.y, d = Math.hypot(dx, dy) || 1; ax = dx / d; ay = dy / d; }
    K.ombres.forEach(s => { const dx = K.x - s.x, dy = K.y - s.y, d = Math.hypot(dx, dy), R = B.ombre + 28; if (d < R && d > 0.01) { const w = (R - d) / R * 2.4; ax += dx / d * w; ay += dy / d * w; } });
    const m = 16; if (K.x < m) ax += (m - K.x) / m; if (K.x > AW - m) ax -= (K.x - AW + m) / m; if (K.y < m) ay += (m - K.y) / m; if (K.y > AH - m) ay -= (K.y - AH + m) / m;
    const cap = (Math.abs(ax) + Math.abs(ay) > 0.05) ? Math.atan2(ay, ax) : null;
    return { cap, elan: !o.sansElan && !!best && best.d > 60 && K.repos <= 0 };
  };

  /* ================= ce qui suit ne vit que dans la page ================= */
  if (typeof document === 'undefined') return;
  const G = I.gfx, W = I.world, S = I.script, $ = I.$;
  const textes = () => (((I.sagas.idris || {}).cite || {}).activites) || {};
  AC.textes = textes;
  const tactile = () => document.body.classList.contains('touch');

  /* ----- la partie : cite.activites ----- */
  AC.etat = function () { const e = I.cite.etat(); let a = e.activites; if (!a || typeof a !== 'object' || Array.isArray(a)) a = e.activites = {};
    if (!a.borne || typeof a.borne !== 'object' || Array.isArray(a.borne)) a.borne = { record: 0, parties: 0 };
    ['tours', 'essais'].forEach(k => { if (!a[k] || typeof a[k] !== 'object' || Array.isArray(a[k])) a[k] = {}; }); return a; };
  const lu = () => { const c = I.save.data.cite && I.save.data.cite.activites; return c && typeof c === 'object' ? c : {}; };
  // la bourse des quartiers : ce que l'organisateur des courses a versé, moins ce qui a été dépensé ici, dans la limite des dirhams d'Idris
  AC.primes = () => (((I.save.data.cite || {}).course || {}).primes) | 0;
  AC.bourse = () => Math.max(0, Math.min(I.trade.dirhams(), AC.primes() - (lu().depenses | 0)));
  function depenser(n) { const a = AC.etat(); I.trade.dirhams(-n); a.depenses = (a.depenses | 0) + n; I.save.store(); }

  /* ----- où sont les activités (en points de la carte des quartiers) -----
     La borne du milieu (la quatrième de la rangée) ; la vitrine du milieu de la galerie (le lieu « galerie ») ; les bancs de la
     place, face à l'écran ; la grande roue (son pied, le lieu « roue ») ; les chaises volantes ; les tasses. Chacune a sa zone :
     un rectangle où se tenir, et le point où l'on se rend quand on la touche du doigt. */
  const BORNE_X = 43, BANCS_Y = 26;
  const objet = type => (W.map && W.map.objs.find(o => o.type === type && (type !== 'qborne' || Math.floor(o.x / 16) === BORNE_X))) || null;
  function zones() {
    if (!W.map || W.map.id !== 'quartiers') return [];
    const Z = [], b = objet('qborne'), g = W.spotPx('galerie'), r = objet('qroue'), ch = objet('qmanege'), ta = objet('qtasses');
    if (b) Z.push({ id: 'borne', x0: b.x - 18, x1: b.x + 18, y0: b.y + 4, y1: b.y + 38, px: b.x, py: b.y + 20, dir: 3, rect: [b.x - 8, b.y - 31, 16, 32] });
    if (g) Z.push({ id: 'etal', x0: g[0] - 22, x1: g[0] + 22, y0: g[1] - 25, y1: g[1] + 9, px: g[0], py: g[1] - 14, dir: 3, rect: [g[0] - 22, g[1] - 60, 44, 32] });
    W.map.objs.filter(o => o.type === 'qbanc' && Math.floor(o.y / 16) === BANCS_Y && o.x > 380 && o.x < 660).forEach(o => { const sx = o.x, sy = o.y - 18;
      if (W.npcs.some(n => !n.hidden && n.placed && n.map === W.map.id && Math.hypot(n.x - sx, n.y - sy) < 20)) return;   // un banc où quelqu'un se tient déjà
      Z.push({ id: 'banc', x0: sx - 12, x1: sx + 12, y0: sy - 12, y1: sy + 12, px: sx, py: sy, dir: 3, rect: [o.x - 12, o.y - 13, 24, 14], banc: o }); });
    if (r) Z.push({ id: 'roue', x0: r.x - 18, x1: r.x + 18, y0: r.y + 2, y1: r.y + 26, px: r.x, py: r.y + 14, dir: 3, rect: [r.x - 50, r.y - 120, 100, 120] });
    if (ch) Z.push({ id: 'chaises', x0: ch.x - 42, x1: ch.x + 42, y0: ch.y - 26, y1: ch.y + 20, px: ch.x + 32, py: ch.y - 2, dir: 1, rect: [ch.x - 32, ch.y - 64, 64, 64] });
    if (ta) Z.push({ id: 'tasses', x0: ta.x - 42, x1: ta.x + 42, y0: ta.y - 30, y1: ta.y - 4, px: ta.x, py: ta.y - 18, dir: 0, rect: [ta.x - 28, ta.y - 30, 56, 28] });
    return Z;
  }
  AC.zones = zones;
  AC.ici = function () { if (!I.cite || !I.cite.ici()) return null; const p = W.player; return zones().find(z => p.x >= z.x0 && p.x <= z.x1 && p.y >= z.y0 && p.y <= z.y1) || null; };
  const libre = () => !AC.occupe && !AC.assis && !I.debug.auto && !I.debug.walk;
  AC.aPortee = () => libre() && !!AC.ici();
  // toucher une activité du doigt : où se rendre, et vers où se tourner
  AC.touche = function (wx, wy) { if (!libre() || !I.cite || !I.cite.ici()) return null; const z = zones().find(z => wx >= z.rect[0] && wx <= z.rect[0] + z.rect[2] && wy >= z.rect[1] && wy <= z.rect[1] + z.rect[3]); return z ? { x: z.px, y: z.py, dir: z.dir } : null; };
  // A, dans une zone (world.js, W.interact) ; le joueur de test du moteur les ignore
  AC.agir = function () {
    if (!libre()) return false; const z = AC.ici(); if (!z) return false;
    if (z.id === 'borne') AC.borne(); else if (z.id === 'etal') AC.etal(); else if (z.id === 'banc') AC.asseoir(z); else AC.tour(z.id);
    return true;
  };

  /* ----- la progression : la leçon au premier essai ; l'activité attend si elle ne peut pas encore être donnée ----- */
  const dire = outil => { if (I.lecons) I.lecons.dit(outil); };
  AC.dispo = outil => !I.lecons || !I.lecons.actif() || I.lecons.recu(outil) || I.lecons.pret(1);
  function essayer(outil) {
    const a = AC.etat(), L = I.lecons, actif = L && L.actif();
    if (actif && !L.recu(outil)) {
      if (!L.pret(1)) { const t = textes().attend; if (t) S.toast(I.fmt(I.esc(t)), 4000); AC.journal.push({ quoi: 'attend', outil }); return false; }
      L.sequence(); L.proposer(outil, () => dire(outil)); a.essais[outil] = (a.essais[outil] | 0) + 1; I.save.store(); AC.journal.push({ quoi: 'lecon', outil }); return true;
    }
    if (actif) L.sequence(); else if (!a.essais[outil]) { dire(outil); AC.journal.push({ quoi: 'lecon', outil }); }
    a.essais[outil] = (a.essais[outil] | 0) + 1; I.save.store(); return true;
  }
  const finEssai = outil => { if (I.lecons) I.lecons.reemploi(outil); };

  /* ----- payer : le prix et la somme, « Payer » ou « Plus tard » (B) ; un refus sobre quand elle manque ----- */
  const PRIX = {
    borne: p => I.t('Une partie à la borne : {prix} dirhams.', { prix: p }),
    roue: p => I.t('Un tour de grande roue : {prix} dirhams.', { prix: p }),
    chaises: p => I.t('Un tour de chaises volantes : {prix} dirhams.', { prix: p }),
    tasses: p => I.t('Un tour de tasses : {prix} dirhams.', { prix: p })
  };
  AC.question = id => PRIX[id]((D.ACTIVITES[id] || {}).prix | 0) + ' ' + I.t('Tes primes du circuit : {n} dirham.¦Tes primes du circuit : {n} dirhams.', { n: AC.bourse() });
  async function payer(id) {
    const prix = (D.ACTIVITES[id] || {}).prix | 0; if (!prix) return true;
    S.hideDialog(); const k = await S.menuPick(AC.question(id), [{ t: I.t('Payer') }, { t: I.t('Plus tard'), retour: true }]);
    AC.journal.push({ quoi: k === 0 ? 'payer' : 'plus-tard', id });
    if (k !== 0) return false;
    if (AC.bourse() < prix) { await refus(); AC.journal.push({ quoi: 'refus', id }); return false; }
    depenser(prix); I.audio.sfx('blip'); AC.journal.push({ quoi: 'paye', id, prix }); return true;
  }
  // tant qu'aucune prime n'a été versée : une ligne, la première fois, dit d'où vient l'argent des quartiers
  async function refus() {
    I.audio.sfx('dark'); const t = textes().sansPrime;
    if (!AC.primes() && t && !AC._sansPrimeDit) { AC._sansPrimeDit = true; S.depth++; try { await S.run([['nar', t]]); } finally { S.depth--; S.hideDialog(); } return; }
    S.toast(I.t('Il te manque des dirhams.'), 2200);
  }
  const ligne = async t => { if (!t) return; S.depth++; try { await S.run([['nar', t]]); } finally { S.depth--; S.hideDialog(); } };
  const lire = (L, n) => (Array.isArray(L) && L.length ? L[(Math.max(1, n) - 1) % L.length] : null);

  /* ================= la borne ================= */
  AC.borne = async function () {
    if (AC.occupe) return; AC.occupe = true; let r = null; S.depth++;
    try {
      W.stop(); I.input.clearHeld(); W.player.dir = 3;
      if (!essayer('borne')) return;
      if (!(await payer('borne'))) return;
      r = await jouer(AC.nouvellePartie());
      if (r && !r.quitte) finEssai('borne');
    } finally { S.depth--; S.hideDialog(); AC.occupe = false; }
    if (r && r.record && r.score > 0) await ligne(textes().record);
    W.checkpoint();
  };
  const chrono = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); };
  AC.mene = () => { const K = AC.K; return !!K && I.scene === AC.scene && !K.pause && (K.mode === 'jeu' || K.mode === 'compte'); };
  function entree(K) {
    const h = I.input.held; let cap = null;
    if (typeof I.input.joyAngle === 'number') cap = I.input.joyAngle;
    else { const dx = (h.right ? 1 : 0) - (h.left ? 1 : 0), dy = (h.down ? 1 : 0) - (h.up ? 1 : 0); if (dx || dy) cap = Math.atan2(dy, dx); }
    const elan = !!K.elanVoulu; K.elanVoulu = false; return { cap, elan };
  }
  function pas(K, dt) {
    if (K.mode === 'compte') { const avant = Math.ceil(K.compte); K.compte -= dt; const apres = Math.ceil(K.compte); if (apres < avant) I.audio.sfx(apres > 0 ? 'blip' : 'ok'); if (K.compte <= 0) { K.mode = 'jeu'; AC.journal.push({ quoi: 'commence' }); } return; }
    if (K.mode === 'fin') { K.tF += dt; if (K.tF > 1 && K.resoudre) { const f = K.resoudre; K.resoudre = null; f({ fini: true }); } return; }
    if (K.mode !== 'jeu') return;
    const pil = I.debug.piloteBorne, e = pil ? AC.pilote(K, pil) : entree(K); K.elanVoulu = false;
    const p0 = K.prises, h0 = K.heurts; AC.avancer(K, dt, e);
    if (K.prises > p0) I.audio.sfx('move'); if (K.heurts > h0) { I.audio.sfx('dark'); K.vuHeurt = K.t; }
    if (K.fini) { K.mode = 'fin'; K.tF = 0; I.audio.sfx('ok'); }
  }
  AC.scene = {
    update(dt) { const K = AC.K; if (!K) return; K.vu = (K.vu || 0) + dt; if (!K.pause) { const n = Math.max(1, I.debug.accelBorne | 0); for (let k = 0; k < n; k++) pas(K, Math.min(dt, 0.05)); } hud(K); },
    render() { return dessiner(AC.K); }
  };
  // l'écran de la borne, dans ce que l'on voit (G.view) : en hauteur, toute l'image (le tableau est dessous) ; en largeur, entre
  // le tableau du haut et le signe du bas, au milieu (la manette tient les deux coins du bas)
  function arene() {
    const V = G.view, haut = document.body.classList.contains('portrait'), AW = D.BORNE.arene[0], AH = D.BORNE.arene[1];
    const top = haut ? V.y + 10 : V.y + V.h * 0.17, bas = haut ? V.y + V.h - 10 : V.y + V.h * 0.8, larg = haut ? V.w - 20 : V.w * 0.6;
    const s = Math.min(larg / AW, (bas - top) / AH), w = AW * s, h = AH * s;
    return { x: G.cale(V.x + (V.w - w) / 2), y: G.cale(top + (bas - top - h) / 2), s, w, h };
  }
  AC.arene = arene;
  const COULEURS = ['#ffe08a', '#7dffb0', '#39e6ff', '#ff7ad8', '#c49bff'];
  function dessiner(K) {
    const c = G.px; c.fillStyle = '#0a0812'; c.fillRect(0, 0, G.PW, G.PH); if (!K) return {};
    const R = arene(), t = K.vu || 0, lights = [], X = x => R.x + x * R.s, Y = y => R.y + y * R.s, s = R.s;
    // autour : la salle sombre, et le caisson de la borne (sans un mot, sans un signe)
    { const g = c.createRadialGradient(R.x + R.w / 2, R.y + R.h / 2, 10, R.x + R.w / 2, R.y + R.h / 2, Math.max(R.w, R.h)); g.addColorStop(0, '#2a1c3e'); g.addColorStop(1, '#0a0812'); c.fillStyle = g; c.fillRect(0, 0, G.PW, G.PH); }
    c.fillStyle = '#16121f'; c.fillRect(R.x - 9, R.y - 9, R.w + 18, R.h + 18); c.fillStyle = '#2a2338'; c.fillRect(R.x - 7, R.y - 7, R.w + 14, R.h + 14);
    { const g = c.createLinearGradient(R.x - 7, 0, R.x + R.w + 7, 0); g.addColorStop(0, '#39e6ff'); g.addColorStop(1, '#7dffb0'); c.fillStyle = g; c.fillRect(R.x - 7, R.y - 7, R.w + 14, 2); c.fillRect(R.x - 7, R.y + R.h + 5, R.w + 14, 2); }
    lights.push({ x: R.x + R.w / 2, y: R.y - 6, r: R.w * 0.6, color: '#39e6ff', a: 0.25 });
    c.save(); c.beginPath(); c.rect(R.x, R.y, R.w, R.h); c.clip();
    { const g = c.createLinearGradient(0, R.y, 0, R.y + R.h); g.addColorStop(0, '#101a3c'); g.addColorStop(1, '#22123a'); c.fillStyle = g; c.fillRect(R.x, R.y, R.w, R.h); }
    c.fillStyle = 'rgba(120,160,255,.08)'; for (let u = 25; u < D.BORNE.arene[0]; u += 25) c.fillRect(X(u), R.y, 0.5, R.h); for (let u = 25; u < D.BORNE.arene[1]; u += 25) c.fillRect(R.x, Y(u), R.w, 0.5);
    // les ombres : des nappes sombres, au bord violet ; elles passent lentement
    K.ombres.forEach(o => { const x = X(o.x), y = Y(o.y), r = D.BORNE.ombre * s * (1 + 0.08 * Math.sin(t * 3 + o.n)); const g = c.createRadialGradient(x, y, 1, x, y, r * 1.5);
      g.addColorStop(0, 'rgba(6,4,14,.95)'); g.addColorStop(0.62, 'rgba(20,10,40,.9)'); g.addColorStop(0.8, 'rgba(120,60,200,.45)'); g.addColorStop(1, 'rgba(120,60,200,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 1.5, 0, TAU); c.fill(); });
    // les lueurs qui passent
    K.lueurs.forEach(l => { const x = X(l.x), y = Y(l.y), col = COULEURS[l.col], r = 3.8 * s * (1 + 0.15 * Math.sin(t * 6 + l.n)); const g = c.createRadialGradient(x, y, 0.5, x, y, r * 2.4);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.3, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 2.4, 0, TAU); c.fill(); lights.push({ x, y, r: 14 * s, color: col, a: 0.5 }); });
    // les éclats : une lueur rassemblée s'efface en anneau ; défaite par une ombre, la chaîne s'éparpille
    K.eclats.forEach(e => { const k = e.t / 0.7, col = COULEURS[e.col]; c.globalAlpha = 1 - k;
      if (e.fuit) { const x = X(e.x) + Math.cos(e.a) * k * 30 * s, y = Y(e.y) + Math.sin(e.a) * k * 30 * s; c.fillStyle = col; c.beginPath(); c.arc(x, y, 2 * s, 0, TAU); c.fill(); }
      else { c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.arc(X(e.x), Y(e.y), (3 + k * 10) * s, 0, TAU); c.stroke(); }
      c.globalAlpha = 1; });
    // la lueur d'Idris, et ce qu'il a rassemblé, qui tourne autour d'elle
    { const x = X(K.x), y = Y(K.y), cl = K.choc > 0 && Math.floor(t * 12) % 2, r = 4.2 * s;
      K.orbite.forEach((q, i) => { const a = q.a + i * TAU / Math.max(1, K.orbite.length), rr = (9 + (i % 3) * 2) * s, ox = x + Math.cos(a) * rr, oy = y + Math.sin(a) * rr * 0.8; c.fillStyle = COULEURS[q.col]; c.beginPath(); c.arc(ox, oy, 1.5 * s, 0, TAU); c.fill(); });
      if (K.elan > 0) { c.fillStyle = 'rgba(255,240,200,.25)'; c.beginPath(); c.arc(x, y, r * 2.6, 0, TAU); c.fill(); }
      const g = c.createRadialGradient(x, y, 0.5, x, y, r * 2); g.addColorStop(0, '#ffffff'); g.addColorStop(0.45, cl ? '#8a8aa8' : '#fff0c0'); g.addColorStop(1, 'rgba(255,220,150,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 2, 0, TAU); c.fill();
      lights.push({ x, y, r: 26 * s, color: '#fff0c8', a: 0.7 }); }
    c.restore();
    return { ambient: ['#dcd4f4', '#aca4d4'], lights, bloom: 0.3, scan: true, grade: ['#7a2cff', 0.05], vignette: 0.45, tilt: false };
  }
  /* ----- ce qui s'écrit sur la borne (#course, comme la course : style.css) ----- */
  function hud(K) {
    const box = $('#course'); if (!K || !box) return; const set = (sel, html) => { const e = box.querySelector(sel); if (e && e._h !== html) { e._h = html; e.innerHTML = html; e.dir = I.langue.sens(e.textContent); } };
    const rec = (lu().borne || {}).record | 0;
    set('.chrono', `<b>${chrono(K.duree - K.t)}</b>`);
    set('.tour', `<span>${I.esc(I.t('Score : {n}', { n: K.score }))}</span> · <span>${I.esc(I.t('record : {n}', { n: Math.max(rec, 0) }))}</span>`); set('.rangs', '');
    set('.signe', K.mode === 'compte' ? `<b>${I.esc(I.t('Les lueurs'))}</b><br>` + I.esc(tactile() ? I.t('Joystick : mener ta lueur · A : un élan · B : pause') : I.t('Flèches : mener ta lueur · Entrée : un élan · Échap : pause'))
      : K.vuHeurt !== undefined && K.t - K.vuHeurt < 1.2 ? `<span class="mal">${I.esc(I.t('Une ombre : la chaîne se défait'))}</span>` : K.chaine > D.BORNE.palier ? `<span class="bien">${I.esc(I.t('Chaîne : {n}', { n: K.chaine }))}</span>` : '');
    set('.compte', K.mode === 'compte' ? (Math.ceil(K.compte) > 0 ? String(Math.ceil(K.compte)) : I.esc(I.t('À toi !'))) : K.mode === 'jeu' && K.t < 0.7 ? I.esc(I.t('À toi !')) : '');
    const tab = box.querySelector('.tableau'), sg = box.querySelector('.signe'), sous = tab && document.body.classList.contains('portrait') ? (tab.offsetTop + tab.offsetHeight + 8) + 'px' : '';
    if (sg && sg.style.top !== sous) sg.style.top = sous;
  }
  AC.abandon = function () { const K = AC.K; if (!K) return; if (K.resoudre) { const f = K.resoudre; K.resoudre = null; f({ quitte: true }); } if (K.attente) K.attente(true); };
  async function jouer(K) {
    const prev = I.scene, mark = I.input.mark(), box = $('#course'); let res = null;
    K.mode = 'compte'; K.compte = 2.6; K.pause = false; AC.K = K; box.classList.add('borne');
    const fin = new Promise(r => { K.resoudre = r; });
    const pause = async () => { if (K.pause) return; K.pause = true; I.input.clearHeld(); AC.journal.push({ quoi: 'pause' }); box.classList.add('pause');
      let i = 0; try { i = await S.menuPick(I.t('La partie est en pause.'), [{ t: I.t('Reprendre'), retour: true }, { t: I.t('Quitter la partie') }]); } finally { box.classList.remove('pause'); }
      K.pause = false; if (i === 1 && K.resoudre) { AC.journal.push({ quoi: 'quitte' }); const f = K.resoudre; K.resoudre = null; f({ quitte: true }); } };
    K.enPause = pause;
    const h = I.input.push(a => { if ((a === 'cancel' || a === 'menu' || a === 'frappe') && (K.mode === 'jeu' || K.mode === 'compte')) pause(); else if (a === 'ok') { if (K.attente) K.attente(); else if (K.mode === 'jeu') K.elanVoulu = true; } return true; });
    try {
      await S.fade('out', 240);
      I.setScene(AC.scene); $('#hud').hidden = true; box.querySelector('.bilan').hidden = true; box.hidden = false; hud(K);
      G.clearParts(); G.amb = { kind: 'brume', rate: 0, n: 0 };
      await S.fade('in', 240);
      const f = await fin;
      if (f.quitte) res = { quitte: true };
      else {
        const a = AC.etat(), avant = a.borne.record | 0, record = K.score > avant; if (record) a.borne.record = K.score; a.borne.parties = (a.borne.parties | 0) + 1; I.save.store();
        res = { score: K.score, record, avant, prises: K.prises, heurts: K.heurts, meilleure: K.meilleure, elans: K.elans }; AC.journal.push(Object.assign({ quoi: 'partie' }, res));
        K.mode = 'bilan'; I.audio.sfx(record ? 'roll' : 'blip');
        const b = box.querySelector('.bilan'); b.innerHTML = bilan(res); b.dir = I.langue.sens(b.textContent); b.hidden = false; box.classList.add('fini');
        await new Promise(r => { const t0 = performance.now(); K.attente = force => { if (force || performance.now() - t0 > 500) { K.attente = null; r(); } }; if (I.debug.auto) setTimeout(() => { K.attente = null; r(); }, 80); });
      }
    } finally {
      I.input.pop(h); I.input.trim(mark);
      try { await S.fade('out', 220); } catch (e) { /* le fondu ne doit pas retenir la sortie */ }
      box.hidden = true; box.classList.remove('fini', 'borne', 'pause'); box.querySelector('.bilan').hidden = true; AC.K = null; I.input.clearHeld(); I.input.aTenu = false; I.input.joyAngle = null;
      I.setScene(prev === AC.scene ? W : prev); G.clearParts();
      if (W.map) { const env = W.map.env; G.amb = { kind: env.particles, rate: env.rate, hue: env.hue, n: 0 }; $('#hud').hidden = false; W.hud(); W.stop(); W.updateCam(true); }
      try { await S.fade('in', 260); } catch (e) { /* idem */ }
    }
    return res;
  }
  function bilan(R) {
    const l = [`<h3>${I.esc(I.t('Les lueurs'))}</h3>`];
    l.push(`<p><b>${I.esc(I.t('Score : {n}', { n: R.score }))}</b> · ${I.esc(R.record ? I.t('ton meilleur score') : I.t('ton record : {n}', { n: R.avant }))}</p>`);
    l.push(`<p><small>${I.esc(I.t('{n} lueur rassemblée¦{n} lueurs rassemblées', { n: R.prises }))} · ${I.esc(I.t('la plus longue chaîne : {n}', { n: R.meilleure }))}</small></p>`);
    l.push(`<div class="suite">${tactile() ? 'A ▸' : I.esc(I.t('Entrée ▸'))}</div>`);
    return l.join('');
  }

  /* ================= l'étal de la galerie ================= */
  AC.etal = async function () {
    if (AC.occupe) return; AC.occupe = true; S.depth++;
    try {
      W.stop(); I.input.clearHeld(); W.player.dir = 3;
      if (!essayer('etal')) return;
      const a = AC.etat(), Gr = I.gear, shop = D.GEAR_SHOPS.quartiers || [], heroes = W.party.map(id => W.hero(id));
      if ((a.essais.etal | 0) === 1) await ligne(textes().etal);
      const mieux = (h, id) => Gr.can(h.def, id) && Gr.score(h.def, id) > (Gr.of(h)[Gr.slotOf(id)] ? Gr.score(h.def, Gr.of(h)[Gr.slotOf(id)]) : 0) + 0.01;
      for (;;) {
        const n = AC.bourse(), o = shop.map(id => { const g = D.GEAR[id], p = Gr.prix(id), qui = heroes.filter(h => mieux(h, id));
          return { html: `${Gr.img(id)} ${n < p ? I.t('<b>{nom}</b> · {prix} dirhams (trop cher)', { nom: I.esc(g.name), prix: p }) : I.t('<b>{nom}</b> · {prix} dirhams', { nom: I.esc(g.name), prix: p })}<br><small>${Gr.effets(g)}${qui.length ? ' · ' + I.t('mieux pour {noms}', { noms: qui.map(h => I.esc(h.def.name)).join(', ') }) : ''}</small>` }; }).concat([{ t: I.t('Retour'), retour: true }]);
        const j = await S.menuPick(I.t('L’étal de la galerie · tes primes du circuit : {n} dirham¦L’étal de la galerie · tes primes du circuit : {n} dirhams', { n }), o);
        if (j >= shop.length) break;
        const id = shop[j], p = Gr.prix(id);
        if (AC.bourse() < p) { await refus(); AC.journal.push({ quoi: 'refus', id }); continue; }
        depenser(p); a.achats = (a.achats | 0) + 1; I.save.store(); AC.journal.push({ quoi: 'achat', id, prix: p }); await Gr.receive(id);
      }
      finEssai('etal');
    } finally { S.depth--; S.hideDialog(); AC.occupe = false; }
    W.checkpoint();
  };

  /* ================= l'écran géant : s'asseoir, regarder ================= */
  AC.asseoir = async function (z) {
    if (AC.occupe || AC.assis) return; AC.occupe = true;
    try {
      W.stop(); I.input.clearHeld();
      if (!essayer('ecran')) return;
      const p = W.player, a = AC.etat(); p.x = z.px; p.y = z.py; p.dir = 3; W.resetTrail(); W.emote('hero', 'assis'); p.dy = 7; AC.assis = { x: p.x, y: p.y };
      a.ecran = (a.ecran | 0) + 1; I.save.store(); AC.journal.push({ quoi: 'assis', x: z.px }); finEssai('ecran');
      await ligne(lire(textes().ecran, a.ecran));
    } finally { AC.occupe = false; }
  };
  AC.relever = function () { if (!AC.assis) return; AC.assis = null; W.emote('hero', null); W.player.dy = 0; AC.journal.push({ quoi: 'releve' }); };
  // B (ou Échap) relève Idris (world.js, W.onInput) ; A ne fait rien tant qu'il est assis
  AC.onInput = function (a) { if (!AC.assis) return false; if (a === 'frappe' || a === 'cancel' || a === 'menu') { AC.relever(); return true; } return a === 'ok'; };
  // à chaque image (world.js) : un pas, un combat ou un récit qui l'emmène ailleurs le relèvent
  AC.tic = function (dt, can) {
    const z = AC.assis; if (!z) return; const p = W.player;
    if (!I.cite || !I.cite.ici() || I.battle.active || p.moving || Math.hypot(p.x - z.x, p.y - z.y) > 1.5) AC.relever();
  };
  // la vue (world.js, W.regard) : assis, elle montre l'écran au-dessus de lui ; sur la grande roue, elle monte sur toute la Cité
  // (AC.vue : le milieu voulu de la vue, en points de la carte, pendant un tour de grande roue)
  // (assis : ses pieds aux trois quarts de la vue au plus — au-dessus de la boussole, en hauteur —, l'écran au-dessus de lui)
  AC.regard = function () { if (typeof AC.vue === 'number') return Math.max(0, W.player.y - 10 - AC.vue); if (AC.assis) return Math.max(0, G.view.h * 0.22 - 10); return 0; };

  /* ================= la grande roue et les manèges : un tour, en vue ================= */
  const ecart = (a, b) => { let d = (a - b) % TAU; if (d > Math.PI) d -= TAU; else if (d < -Math.PI) d += TAU; return d; };
  const lisse = k => k * k * (3 - 2 * k);
  // une animation de `dur` secondes (accélérée avec le jeu : I.speed) ; fn(k), k de 0 à 1
  const anime = (dur, fn) => new Promise(res => { const t0 = performance.now(); const pas2 = now => { const k = Math.min(1, (now - t0) / 1000 * (I.speed || 1) / dur); fn(k); if (k >= 1 || I.scene !== W) { fn(1); res(); return; } requestAnimationFrame(pas2); }; requestAnimationFrame(pas2); });
  const MANEGES = { roue: { type: 'qroue', vit: 0.12, n: 12 }, chaises: { type: 'qmanege', vit: 0.9, n: 10 }, tasses: { type: 'qtasses', vit: 0.6, n: 4 } };
  AC.tour = async function (id) {
    const M = MANEGES[id], A = D.ACTIVITES[id], o = M && objet(M.type); if (!M || !A || !o || AC.occupe) return;
    AC.occupe = true; let fait = false; S.depth++;
    try {
      W.stop(); I.input.clearHeld();
      if (!essayer(A.outil)) return;
      if (!(await payer(id))) return;
      S.hideDialog(); AC.journal.push({ quoi: 'monte', id });
      await rouler(id, o, M, A.duree || 10);
      fait = true; const a = AC.etat(); a.tours[id] = (a.tours[id] | 0) + 1; I.save.store(); finEssai(A.outil);
      AC.journal.push({ quoi: 'tour', id });
      if (id !== 'roue') await ligne(lire((textes().maneges || {})[id], a.tours[id]));
    } finally { S.depth--; S.hideDialog(); AC.occupe = false; AC.vue = null; W.passager = false; if (o) { if (o.angle !== undefined) { o.decal = o.angle - W.t * M.vit; delete o.angle; } delete o.passager; } }
    if (fait) W.checkpoint();
  };
  async function rouler(id, o, M, duree) {
    const a0 = W.t * M.vit + (o.decal || 0), pas = TAU / M.n, cible = Math.PI / 2;   // sa place : en bas (la roue), devant (les chaises, les tasses)
    let k = 0, bd = 9; for (let j = 0; j < M.n; j++) { const e = Math.abs(ecart(a0 + j * pas, cible)); if (e < bd) { bd = e; k = j; } }
    const base = a0 + ecart(cible, a0 + k * pas);
    o.angle = a0; await anime(0.6, q => { o.angle = a0 + (base - a0) * lisse(q); });
    o.passager = { sheet: W.sheets[0], k }; W.passager = true; I.audio.sfx('door');
    if (id === 'roue') {
      // la montée : la vue suit la nacelle jusqu'en haut de la roue, puis lève les yeux sur toute la Cité (jusqu'au haut de la
      // carte) ; la pensée d'Idris, là-haut ; puis la vue revient à la nacelle, qui redescend
      const nacelle = () => o.y - 66 + Math.sin(o.angle + k * pas) * 44 + 7, haut = () => (G.view.h || G.PH) / 2;
      AC.vue = nacelle();
      await anime(duree * 0.3, q => { o.angle = base + Math.PI * lisse(q); AC.vue = nacelle(); });
      const y0 = AC.vue; await anime(duree * 0.15, q => { AC.vue = y0 + (haut() - y0) * lisse(q); });
      await new Promise(r => setTimeout(r, 450 / (I.speed || 1)));
      AC.journal.push({ quoi: 'en-haut', y: Math.round(W.cam.y + G.view.y) });
      const a = AC.etat(); await ligne(lire(textes().roue, (a.tours.roue | 0) + 1));
      await anime(duree * 0.15, q => { AC.vue = haut() + (y0 - haut()) * lisse(q); });
      await anime(duree * 0.3, q => { o.angle = base + Math.PI + Math.PI * lisse(q); AC.vue = nacelle(); });
      AC.vue = null;
    } else {
      const tours = id === 'chaises' ? 3 : 2;
      await anime(duree, q => { o.angle = base + tours * TAU * lisse(q); if (id === 'chaises') o.passager.envol = Math.sin(Math.PI * q); else o.passager.tasse = q * 18; });
    }
    W.passager = false; delete o.passager;
  }
})();
