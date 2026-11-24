/* ISNAD 2.x — les gens du lieu et leurs bêtes.
   2.32 (D224) : les chameaux chargés des pillards, sur la carte du monde (monde.js), et La Razzia qui se lève (une image).
   2.33 (D225 ; le décideur, 24 novembre : « rajoute quelques personnes crédibles et quelques animaux dans les villes » ; son
   choix : « Villes visitées ») : dans les villes qu'on visite depuis la carte du monde, La Mecque comprise, des gens du lieu
   (des hommes et un garçon de fiction, sans nom, chacun avec son visage) et leurs bêtes ; dans les villes des récits, les bêtes
   seulement, pour ne rien ajouter aux scènes de l'histoire. Ce qu'ils sont, où ils se tiennent : `D.GENS`, `D.BETES` (defs.js).
   Une bête est dessinée par le jeu (gfx.js, `b_<espèce>`), de profil ; elle paît autour de sa place, s'arrête quand celui qui
   mène approche, et s'écarte s'il la pousse : elle a un corps, on ne la traverse pas (W.tryMove, `Gn.bloque`). Un homme du lieu
   est un PNJ comme les autres (W.npcs, `gens`) : il a un corps, il fait un pas de côté ; A devant lui, il dit une ligne de sa
   journée — ni fait d'histoire, ni formule, ni verset. Rien de cela n'est d'un récit ni n'entre dans la partie : tout se repose
   au chargement d'un lieu, d'après une graine fixe (le lieu), toujours aux mêmes places. */
(function () {
  const I = window.ISNAD, G = I.gfx, D = I.D, T = 16;
  const Gn = I.gens = { betes: [] };
  const W = () => I.world;
  const VIT = { chameau: 34 };   // l'allure d'une bête qui suit les pillards (2.32)

  /* ---------- les bêtes qui marchent ---------- */
  // une bête : { esp, map, x, y, dir (1 : tournée vers la droite, -1 : vers la gauche), charge, route, c (sa robe) }
  Gn.ajouter = function (b) { b.dir = b.dir || 1; b.parcours = 0; b.ph = b.ph === undefined ? (I.hash(b.esp + '|' + b.x + '|' + b.y) % 628) / 100 : b.ph; Gn.betes.push(b); return b; };
  Gn.retirer = function (pred) { Gn.betes.filter(pred).forEach(b => { if (b.fin) { const f = b.fin; b.fin = null; f(); } }); Gn.betes = Gn.betes.filter(b => !pred(b)); };
  // elle marche jusqu'à (x, y) ; la promesse se tient à l'arrivée (ou si on la retire)
  Gn.aller = function (b, x, y) { return new Promise(res => { if (b.fin) b.fin(); b.but = [x, y]; b.fin = res; }); };
  Gn.ici = function (b) { const m = W().map; return !!m && b.map === m.id && !b.hidden; };
  // 2.32 — une chimère qui se lève sous les yeux (La Razzia, du milieu des pillards) : une image, qu'on ne touche pas ; elle
  // s'efface quand le combat s'ouvre (Gn.retirer). Un peu de transparence : ce n'est pas une personne (exigence 6).
  Gn.lever = function (id, map, x, y) { const a = { chimere: id, map, x, y, t0: null, route: true, parcours: 0, dir: 1, ph: 0 }; Gn.betes.push(a); return a; };

  /* ---------- les lieux qu'on peuple ---------- */
  const lieu = () => { const m = W().map; return m ? (D.MAPS[m.id] || {}) : {}; };
  const peuple = () => { const w = W(), m = w.map, L = lieu(); if (!m || !w.saga || w.saga.frame || !D.GENS.ancres[L.gabarit]) return null; return { m, L, gab: L.gabarit, visite: !!L.visite }; };
  const cheb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
  // une case où poser quelqu'un : praticable, sans objet, loin des portes, du comptoir et du tapis, loin des autres
  function caseLibre(m, x0, y0, prises, rayon) {
    const w = W(), gardes = D.GENS.garde.map(k => m.spots[k]).filter(Boolean), p = w.player, ici = [Math.floor(p.x / T), Math.floor((p.y - 2) / T)];
    const ok = (x, y) => x >= 1 && y >= 1 && x < m.w - 1 && y < m.h - 1 && !m.solid[y * m.w + x] && !w.solidAt(x * T + 8, y * T + 13) && !w.solidAt(x * T + 3, y * T + 10) && !w.solidAt(x * T + 13, y * T + 10)
      && gardes.every(s => cheb(s, [x, y]) > D.GENS.marge) && cheb(ici, [x, y]) > 2 && prises.every(q => cheb(q, [x, y]) >= 1)
      && !w.npcs.some(n => !n.hidden && n.placed && n.map === m.id && !n.gens && Math.abs(n.x - (x * T + 8)) < 14 && Math.abs(n.y - (y * T + 13)) < 12)
      && !w.chests.some(c => c.map === m.id && c.placed && Math.abs(c.x - (x * T + 8)) < 14 && Math.abs(c.y - (y * T + 13)) < 12);
    for (let r = 0; r <= (rayon || 4); r++) for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { if (Math.max(Math.abs(i), Math.abs(j)) !== r) continue; if (ok(x0 + i, y0 + j)) return [x0 + i, y0 + j]; }
    return null;
  }
  const ancre = (m, a) => { const s = m.spots[a[0]]; return s ? [s[0] + a[1], s[1] + a[2]] : null; };

  /* ---------- ce qu'ils sont, ce qu'ils disent (des textes de l'agent, à valider) ---------- */
  const ROLES = {
    porteur: { nom: I.T('Un porteur d’eau'), dit: I.T('La première outre est toujours la plus lourde. Après, les bras s’habituent.') },
    marchand: { nom: I.T('Un marchand'), dit: I.T('Des dattes, de l’orge, du cuir tanné. Le prix se discute ; la qualité, non.') },
    artisan: { nom: I.T('Un artisan'), dit: I.T('Une couture après l’autre. Une sandale bien cousue tient une saison de route.') },
    ancien: { nom: I.T('Un vieil homme'), dit: I.T('À mon âge, on regarde passer la journée à l’ombre. Elle passe moins vite qu’on ne croit.') },
    berger: { nom: I.T('Un berger'), dit: I.T('Mes bêtes connaissent le chemin mieux que moi. Je les suis plus que je ne les mène.') },
    garcon: { nom: I.T('Un garçon'), dit: I.T('Elle s’échappe toujours par le même coin ! Un jour, je l’attraperai.') },
    passant: { nom: I.T('Un passant'), dit: I.T('Je me hâte : je veux être rentré avant la grosse chaleur.') }
  };
  Gn.ROLES = ROLES;   // pour les contrôles (monde.js)

  /* ---------- poser, à chaque chargement d'un lieu ---------- */
  Gn.arme = function () {
    Gn.retirer(b => b.route || b.lieu);
    const w = W(); w.npcs = w.npcs.filter(n => !n.gens);
    const P = peuple(); if (!P) return;
    const m = P.m, prises = [], r = I.rng(I.hash('gens|' + m.id));
    // les bêtes : dans les visites et dans les villes des récits
    (D.GENS.betes[P.gab] || []).forEach((q, i) => { const a = ancre(m, [q[1], q[2], q[3]]); if (!a) return; const c = caseLibre(m, a[0], a[1], prises, 3); if (!c) return; prises.push(c);
      const B = D.BETES[q[0]], x = c[0] * T + 8, y = c[1] * T + 13;
      Gn.ajouter({ esp: q[0], map: m.id, x, y, lieu: true, maison: [x, y], c: B.robes[Math.floor(r() * B.robes.length)], dir: r() < 0.5 ? -1 : 1, attente: 1 + r() * 4, id: 'bete_' + i }); });
    // les gens : dans les visites seulement
    if (!P.visite) return;
    const region = D.GENS.regions[m.id] || 'arabie', pal = D.GENS.palettes[region] || D.GENS.palettes.arabie, A = D.GENS.ancres[P.gab];
    Object.keys(A).forEach(role => { const q = A[role], a = ancre(m, q); if (!a) return; const c = caseLibre(m, a[0], a[1], prises, 4); if (!c) return; prises.push(c);
      const R0 = D.GENS.roles[role], col = pal[(I.hash(m.id + '|' + role) >>> 0) % pal.length], look = Object.assign({ kind: R0.kind, robe: col[0], head: col[1], cloak: col[2] }, R0.item ? { item: R0.item } : {}, R0.manteau ? { manteau: R0.manteau } : {});
      const n = { id: '_gens_' + role, name: I.t(ROLES[role].nom), role, gens: true, map: m.id, hidden: false, placed: true, placedMap: m.id, x: c[0] * T + 8, y: c[1] * T + 13, dir: 0, pose: R0.pose || null, sheet: G.planche(look), aura: null };
      const b = q[3] && ancre(m, q[3]), c2 = b && caseLibre(m, b[0], b[1], prises, 3);
      if (c2 && !R0.pose) { prises.push(c2); n.va = { a: [n.x, n.y], b: [c2[0] * T + 8, c2[1] * T + 13], vers: 1, attente: 1 + r() * 3, pts: null, k: 0 }; }
      w.npcs.push(n); });
  };

  /* ---------- A devant l'un d'eux ---------- */
  Gn.parle = function (n) {
    if (!n || !n.gens) return false;
    if (n.va) n.va.attente = Math.max(n.va.attente, 2);
    if (I.entraide && I.entraide.parle(n)) return true;   // 2.33 (D226) : celui qui demande de l'aide (entraide.js)
    (async () => { I.audio.sfx('blip'); await I.script.run([['say', n.id, I.t(ROLES[n.role].dit)]]); })();
    return true;
  };

  /* ---------- à chaque image ---------- */
  const libre = (x, y) => { const w = W(); return !w.solidAt(x, y) && !w.solidAt(x - 4, y - 3) && !w.solidAt(x + 4, y - 3); };
  const ligneLibre = (x0, y0, x1, y1) => { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 3); for (let i = 1; i <= n; i++) { const f = i / n; if (!libre(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f)) return false; } return true; };
  const loinDesGardes = (x, y) => { const m = W().map, c = [Math.floor(x / T), Math.floor((y - 2) / T)]; return D.GENS.garde.every(k => !m.spots[k] || cheb(m.spots[k], c) > D.GENS.marge); };
  // une bête choisit où aller : autour de sa place, d'où l'on va en ligne droite, loin des portes et de celui qui mène
  function nouveauBut(b, fuir) {
    const B = D.BETES[b.esp] || {}, R = (B.rayon || 1) * T, p = W().player, w = W();
    for (let k = 0; k < 10; k++) {
      let x, y; if (fuir) { const a = Math.atan2(b.y - p.y, b.x - p.x) + (Math.random() - 0.5) * 1.4, d = 14 + Math.random() * 10; x = b.x + Math.cos(a) * d; y = b.y + Math.sin(a) * d; }
      else { x = b.maison[0] + (Math.random() * 2 - 1) * R; y = b.maison[1] + (Math.random() * 2 - 1) * R * 0.7; }
      if (Math.hypot(x - b.maison[0], y - b.maison[1]) > R + 18 || Math.hypot(x - p.x, y - p.y) < 18 || !loinDesGardes(x, y) || !ligneLibre(b.x, b.y, x, y)) continue;
      if (I.entraide && I.entraide.dans(x, y)) continue;   // (jamais sur le chantier d'une demande)
      if (w.npcs.some(n => !n.hidden && n.placed && n.map === b.map && Math.abs(n.x - x) < 10 && Math.abs(n.y - y) < 8)) continue;
      b.but = [x, y]; b.vite = fuir ? 1.6 : 1; return true; }
    return false;
  }
  function paitre(b, dt) {
    const B = D.BETES[b.esp] || {}, p = W().player;
    if (!libre(b.x, b.y)) { b.x = b.maison[0]; b.y = b.maison[1]; b.but = null; }   // un mur bâti sur elle : elle revient à sa place
    const pres = Math.hypot(p.x - b.x, p.y - b.y) < (B.arret || 20);
    if (!b.but) { b.moving = false; if (pres) return; b.attente -= dt; if (b.attente <= 0) { b.attente = 2 + Math.random() * 5; nouveauBut(b, false); } return; }
    if (pres && !b.fuit) { b.moving = false; return; }   // il approche : elle s'arrête, et le regarde passer
    const dx = b.but[0] - b.x, dy = b.but[1] - b.y, d = Math.hypot(dx, dy), pas = (B.vit || 12) * (b.vite || 1) * dt;
    if (Math.abs(dx) > 0.5) b.dir = dx < 0 ? -1 : 1;
    if (d <= pas) { b.x = b.but[0]; b.y = b.but[1]; b.but = null; b.moving = false; b.fuit = false; b.parcours += d; return; }
    b.x += dx / d * pas; b.y += dy / d * pas; b.parcours += pas; b.moving = true;
  }
  // un homme qui va et vient : d'une place à l'autre par le chemin des cases, lentement ; il attend qu'on lui laisse le passage
  function allerVenir(n, dt) {
    const v = n.va, w = W(), p = w.player; if (n.pas || n.scripted || I.script.busy) { n.moving = false; return; }
    if (I.entraide && I.entraide.demandeur() === n) { n.moving = false; return; }   // (celui qui demande de l'aide attend, sur place)
    if (v.attente > 0) { v.attente -= dt; n.moving = false; return; }
    if (!v.pts) { const but = v.vers ? v.b : v.a, pts = w.chemin(n, but[0], but[1]); v.pts = pts.slice(1); v.k = 0; if (!v.pts.length) { v.vers = 1 - v.vers; v.attente = 3; v.pts = null; return; } }
    const q = v.pts[v.k], dx = q[0] - n.x, dy = q[1] - n.y, d = Math.hypot(dx, dy) || 1, pas = 26 * dt;
    if (I.entraide && I.entraide.dans(q[0], q[1])) { v.pts = null; v.vers = 1 - v.vers; v.attente = 2; n.moving = false; return; }   // (il ne traverse pas un chantier ouvert)
    if (Math.hypot(p.x - (n.x + dx / d * 10), p.y - (n.y + dy / d * 10)) < 12) { n.moving = false; v.gene = (v.gene || 0) + dt; if (v.gene > 3) { v.pts = null; v.vers = 1 - v.vers; v.gene = 0; } return; }   // on lui barre la route : il attend, puis fait demi-tour
    v.gene = 0; n.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
    if (d <= pas) { n.x = q[0]; n.y = q[1]; if (++v.k >= v.pts.length) { v.pts = null; v.vers = 1 - v.vers; v.attente = 3 + Math.random() * 4; n.moving = false; } return; }
    n.x += dx / d * pas; n.y += dy / d * pas; n.moving = true;
  }
  Gn.maj = function (dt) {
    for (const b of Gn.betes) {
      if (b.chimere) continue;
      if (b.lieu) { if (Gn.ici(b)) paitre(b, dt); continue; }
      if (!b.but) { b.moving = false; continue; }
      const dx = b.but[0] - b.x, dy = b.but[1] - b.y, d = Math.hypot(dx, dy), pas = (VIT[b.esp] || 30) * (b.vit || 1) * dt;
      if (Math.abs(dx) > 0.5) b.dir = dx < 0 ? -1 : 1;
      if (d <= pas) { b.x = b.but[0]; b.y = b.but[1]; b.but = null; b.moving = false; b.parcours += d; const f = b.fin; b.fin = null; if (f) f(); continue; }
      b.x += dx / d * pas; b.y += dy / d * pas; b.parcours += pas; b.moving = true;
    }
    const w = W(); if (w.map) w.npcs.forEach(n => { if (n.gens && n.va && n.map === w.map.id) allerVenir(n, dt); });
  };
  // celui qui mène bute sur une bête : elle ne se traverse pas ; poussée, elle s'écarte (world.js, tryMove)
  const pied = (b, x, y) => Math.abs(x - b.x) < (b.esp === 'poule' ? 5 : b.esp === 'chameau' || b.esp === 'ane' ? 9 : 7) && y - b.y > -3 && y - b.y < 4;
  Gn.bloque = function (x0, y0, x1, y1) {
    for (const b of Gn.betes) { if (!b.lieu || !Gn.ici(b)) continue;
      if (pied(b, x1, y1) && (!pied(b, x0, y0) || Math.hypot(x1 - b.x, y1 - b.y) < Math.hypot(x0 - b.x, y0 - b.y))) { if (!b.fuit) { b.fuit = true; if (!nouveauBut(b, true)) b.fuit = false; } return true; } }
    return false;
  };
  // pour les contrôles : les bêtes du lieu
  Gn.duLieu = () => Gn.betes.filter(b => b.lieu && Gn.ici(b));

  /* ---------- le dessin ---------- */
  // dans la liste triée par profondeur du monde (world.js)
  Gn.lister = function (list, cx, cy) { for (const b of Gn.betes) if (Gn.ici(b) && b.x > cx - 40 && b.x < cx + G.PW + 40 && b.y > cy - 10 && b.y < cy + G.PH + 30) list.push({ y: b.y, gb: b }); };
  function chimere(c, a, cx, cy, t, lights) {
    const d = (I.common && I.common.enemies[a.chimere]) || ((W().saga || {}).enemies || {})[a.chimere]; if (!d) return;
    if (a.t0 === null) a.t0 = t; const k = Math.min(1, (t - a.t0) / 0.9), s = 34, spr = G.enemy(d.art, d.hue, 1, 0), x = a.x - cx, y = a.y - cy, bob = Math.sin(t * 2.4) * 2.5 + (1 - k) * 14;
    c.fillStyle = 'rgba(20,12,30,.3)'; c.beginPath(); c.ellipse(x, y + 1, 10 * k, 3.5 * k, 0, 0, 6.3); c.fill();
    c.globalAlpha = 0.85 * k; c.drawImage(spr, x - s / 2, y - s - 3 + bob, s, s); c.globalAlpha = 1;
    if (lights) lights.push({ x, y: y - 16, r: 48 * k, color: `hsl(${d.hue},90%,60%)`, a: 0.85 * k });
    if (Math.random() < 0.25 * k) G.spawn({ x: x + (Math.random() - 0.5) * 20, y: y - 8, vy: -16, vx: (Math.random() - 0.5) * 8, life: 1, size: 0.8, color: `hsl(${d.hue},100%,70%)`, type: 'glyph' });
  }
  Gn.dessiner = function (c, b, cx, cy, t, lights) {
    if (b.chimere) return chimere(c, b, cx, cy, t, lights);
    const pasL = b.esp === 'poule' ? 2 : b.esp === 'chameau' ? 4 : 3, f = b.moving ? Math.floor(b.parcours / pasL) % 4 : 0, im = G.obj('b_' + b.esp, { f, charge: !!b.charge, c: b.c || null }), O = G.OBJ['b_' + b.esp];
    const x = Math.round(b.x - cx), y = Math.round(b.y - cy), lev = !b.moving && Math.sin(t * 1.3 + b.ph) > 0.85 ? -1 : 0;
    c.fillStyle = 'rgba(20,12,8,.28)'; c.beginPath(); c.ellipse(x, y + 1, O.w * 0.36, 2.5, 0, 0, 6.3); c.fill();
    if (b.dir < 0) { c.save(); c.translate(x, 0); c.scale(-1, 1); c.drawImage(im, -Math.round(O.w / 2), y - O.h + 1 + lev); c.restore(); }
    else c.drawImage(im, x - Math.round(O.w / 2), y - O.h + 1 + lev);
  };
})();
