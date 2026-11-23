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
     d'un lieu du jeu) et une natte, où l'on prie et se repose sans que les œuvres se comptent (oeuvres.js, O.sobre) — on n'y
     descend pas dans la noosphère. On en ressort par sa porte, vers la carte du monde. Rien n'y rôde. La Mecque : ni mosquée,
     ni Haram, ni Kaaba (maps.js, la variante « mecque »).
   - La progression (lecons.js) : l'outil « route », un simple geste, dit à la première sortie (I.lecons.proposer) ; si la
     progression ne peut pas encore le donner, la porte attend. Revenir à la ville du récit est son réemploi.
   - La partie : rien de plus que les drapeaux du chapitre, gardés avec son point de reprise ; le format reste le 2. Une partie
     d'avant (sans `lecons`) entend la leçon une fois (I.save.data._route). */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D, W = I.world, S = I.script, P = I.passages, T = 16;
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
      W.player.dir = DIR[nom]; W.loadMap(MONDE, Mo.opts(), ville); aCote(ville, nom); W.checkpoint();
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
        if (W.degager()) W.resetTrail(); W.updateCam(true); W.checkpoint();
        Mo.journal.push({ quoi: 'revient', ville, ch: W.ch.id, obj: W.objIndex });
        if (I.lecons) I.lecons.reemploi('route');
        await S.fade('in', 300);
      } else {
        const g = (D.MAPS[V.carte] || {}).gabarit, spot = g === 'romaine' ? 'porte' : g === 'camp' ? 'entree' : nord ? 'porte_nord' : 'porte_sud';
        F.visite = ville; W.player.dir = g === 'romaine' ? 3 : g === 'camp' ? 2 : nord ? 0 : 3;
        W.loadMap(V.carte, { time: Mo.opts().time }, spot); W.checkpoint();
        Mo.journal.push({ quoi: 'visite', ville, ch: W.ch.id, obj: W.objIndex });
        await S.fade('in', 300);
        const c2 = Mo.chapitre(); I.audio.sfx('roll');
        await S.card('title', `<h1>${I.esc(D.LIEUX[ville] || ville)}</h1>${c2 && c2.epoque ? `<p>${I.esc(c2.epoque)}</p>` : ''}<div class="rule"></div>`, 3000);
      }
    } finally { S.depth--; P.occupe = false; S.hideDialog(); }
  };
})();
