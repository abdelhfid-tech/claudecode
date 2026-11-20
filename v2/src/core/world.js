/* ISNAD — exploration : carte, héros, compagnons, PNJ, ennemis visibles, objectifs, points de reprise. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, $ = I.$, T = 16;
  const W = I.world = { map: null, player: { x: 0, y: 0, dir: 0, moving: false }, npcs: [], foes: [], chests: [], party: [], roster: {}, cam: { x: 0, y: 0 }, t: 0, lock: false, tint: null, trail: [] };
  const mapCache = {};
  const MINLVL = [1, 4, 6, 8];

  /* ----- héros ----- */
  W.hero = function (id) {
    if (W.roster[id]) return W.roster[id];
    const def = W.saga.heroes[id]; if (!def) return null;
    const key = W.saga.id + ':' + id, sv = I.save.data.heroes[key] || { lvl: 1, xp: 0 };
    const h = { id, key, def, lvl: sv.lvl, xp: sv.xp, sakina: 0, niyya: 0 };
    const st = I.calc.of(h); h.hp = st.hp; h.sp = st.sp;
    return (W.roster[id] = h);
  };
  W.persistHeroes = function () { for (const id in W.roster) { const h = W.roster[id]; I.save.data.heroes[W.saga.id + ':' + id] = { lvl: h.lvl, xp: h.xp }; } };
  W.ensureLevel = function (h) { if (h.lvl < W.minLvl) { h.lvl = W.minLvl; h.xp = 0; const st = I.calc.of(h); h.hp = st.hp; h.sp = st.sp; } };
  W.healAll = function () { W.party.forEach(id => { const h = W.hero(id), st = I.calc.of(h); h.hp = st.hp; h.sp = st.sp; }); };
  W.gainSakina = function (v) { W.party.forEach(id => { const h = W.hero(id); h.sakina = Math.min(100, h.sakina + v); }); };
  W.join = function (id) {
    if (W.party.includes(id) || !W.saga.heroes[id]) return;
    if (W.party.length >= 3) return;
    W.party.push(id); const h = W.hero(id); W.ensureLevel(h);
    const lead = W.hero(W.party[0]); if (lead && h.lvl < lead.lvl - 1) { h.lvl = lead.lvl - 1; const st = I.calc.of(h); h.hp = st.hp; h.sp = st.sp; }
    W.refreshSheets(); S.toast(I.t('<b>{nom}</b> rejoint le groupe.', { nom: h.def.name })); I.audio.sfx('ok'); if (I.debug.auto) I.gear.best(h);
  };
  W.leave = function (id) { const i = W.party.indexOf(id); if (i < 0 || W.party.length <= 1) return; W.party.splice(i, 1); W.refreshSheets(); };
  function lookOf(def) { return Object.assign({ kind: 'compagnon' }, def.look); }
  const lueur = look => (G.D > 1 && look.rayon) || look.aura || null; // en dessin fin, un Compagnon rayonne de sa couleur propre (D.RAYONS)
  W.refreshSheets = function () { W.sheets = W.party.map(id => G.planche(lookOf(W.saga.heroes[id]))); W.sheets.forEach(s => { if (s.courir) s.courir(); }); };   // ceux qui courent : leur course est prête avant le premier pas

  /* ----- piliers de la Citadelle, prière ----- */
  W.pillars = function () {
    const sv = I.save.data; if (!W.saga) return { priere: 0, savoir: 0, justice: 0, lien: 0 };
    if (W.saga.veillees) return sv.citadel;
    const sp = sv.sagas[W.saga.id] || (sv.sagas[W.saga.id] = { ch: 0, done: false, flags: {} });
    return sp.pil || (sp.pil = { priere: 0, savoir: 0, justice: 0, lien: 0 });
  };
  W.pillar = function (name, d) {
    const P = W.pillars(), def = D.PILLARS[name]; if (!def) return; const was = P[name] || 0;
    P[name] = I.clamp(was + d, 0, 5); W.hud();
    if (P[name] !== was) { S.toast(`${I.t('Pilier · <b>{nom}</b>', { nom: def.name })} ${d > 0 ? '▲' : '▼'} <span class="pl">${def.glyph} ${P[name]}</span>`, 2800); I.audio.sfx(d > 0 ? 'light' : 'dark'); }
  };
  const PRAY_LINES = {
    fajr: [I.T('Avant le jour, ils se rangèrent, épaule contre épaule. Puis la lumière vint, comme une réponse.'), I.T('L’aube n’était encore qu’un fil. Ils prièrent, et le jour eut un commencement.')],
    dhuhr: [I.T('Au plus haut du soleil, ils posèrent ce qu’ils portaient. Rien ne pressait plus que cela.'), I.T('Midi. La ville se tut le temps d’une prière, et chacun retrouva sa place.')],
    asr: [I.T('L’ombre s’allongeait. Ils prièrent, et la journée retrouva sa mesure.')],
    maghrib: [I.T('Le soleil toucha la terre. Ils prièrent, et le vacarme du jour retomba.')],
    isha: [I.T('La nuit était entière. Ils prièrent, et le silence cessa d’être vide.'), I.T('Dernière prière. Ce qui restait à décider attendrait le matin, et s’en trouverait mieux.')]
  };
  W.pose = [];
  W.emote = function (who, pose) {
    const p = pose && D.POSES.includes(pose) ? pose : null;
    if (who === 'groupe') W.pose = W.party.map(() => p); else if (who === 'hero') W.pose[0] = p; else { const n = W.npcs.find(x => x.id === who); if (n) n.pose = p; }
  };
  // `parLeRecit` : la prière est une étape d'un objectif en cours. Elle repose le groupe, mais ne prend pas de point de
  // reprise : écrit à ce moment-là, il ferait rejouer l'objectif depuis un lieu où il ne peut plus s'accomplir.
  W.pray = async function (moment, parLeRecit) {
    const env = W.map ? W.map.env : {}, m = moment || ({ dawn: 'fajr', day: 'dhuhr', dusk: 'maghrib', night: 'isha' })[env.time] || 'isha';
    S.depth++;
    try {
      S.hideDialog(); W.emote('groupe', 'prie'); await I.sleep(I.debug.auto ? 10 : 700); await S.fade('out', 600); I.audio.sfx('light');
      const fz = $('#fade'); fz.style.transition = 'none'; fz.style.opacity = 0; // le carton prend le relais du fondu
      await S.card('pray', `<div class="orn">◠</div><p class="small">${D.PRAYERS[m]}</p><h1>${I.t('La prière')}</h1><p>${I.t(I.pick(PRAY_LINES[m]))}</p><p class="small">${I.t('Le groupe est reposé : Constance et Souffle à 100 % · Sérénité')}</p><div class="hint">▼</div>`, 6500);
      W.healAll(); W.gainSakina(35); S.flags._prayed = true;
      if (!S.flags._prayPillar && !(I.oeuvres.sobre && I.oeuvres.sobre())) { S.flags._prayPillar = true; W.pillar('priere', 1); await I.oeuvres.gain('priere'); } // la première prière du chapitre nourrit la provision (pas celle d'une visite : elle se rejoue)
      if (W.map && !parLeRecit) W.checkpoint();
    } finally { S.depth--; S.hideDialog(); W.emote('groupe', null); }
  };
  W.prayerPts = function () { const m = W.map, out = []; if (!m) return out; if (m.spots.priere) out.push(m.spots.priere); if (I.build && W.saga) I.build.prayerPoints().forEach(q => out.push(q)); return out; };
  W.nearPrayer = function () { return W.prayerPts().some(sp => Math.hypot(sp[0] * T + 8 - W.player.x, sp[1] * T + 13 - W.player.y) < 26); };

  /* ----- cartes ----- */
  W.loadMap = function (id, opts, spot) {
    opts = opts || {}; const key = id + JSON.stringify(opts);
    W.mapKey = key; const bl = I.build && W.saga ? I.build.peek(id) : null;
    if (bl && bl.length) { W.map = I.maps.build(id, opts); bl.forEach(e => I.build.apply(e, W.map)); } // ce qui a été bâti reste
    else W.map = mapCache[key] || (mapCache[key] = I.maps.build(id, opts));
    W.mapOpts = opts; if (I.build && I.build.on && !I.build.outdoor(id)) I.build.set(false);
    const garde = G.D > 1 ? 2 : 4, ks = Object.keys(mapCache); if (ks.length > garde) ks.filter(k2 => k2 !== key).slice(0, ks.length - garde).forEach(k2 => { delete mapCache[k2]; }); // une carte fine pèse quatre fois plus : on en garde moins
    const env = W.map.env; G.clearParts(); G.amb = { kind: env.particles, rate: env.rate, hue: env.hue, n: 0 };
    I.audio.scene(env.music || 'silence');
    W.npcs.forEach(n => { if (n.map === id) W.place(n); });
    W.foes.forEach(f => { if (f.map === id && !f.placed) { const p = W.resolve(f.at, id, f); if (p) { f.x = p[0]; f.y = p[1]; f.placed = true; } } });
    W.chests.forEach(c => { if (c.map === id && !c.placed) { const p = W.resolve(c.at, id, c); if (p) { c.x = p[0]; c.y = p[1]; c.placed = true; } } });
    if (spot) { const p = Array.isArray(spot) && typeof spot[0] === 'number' ? spot : W.resolve(spot, id, W.player); W.player.x = p[0]; W.player.y = p[1]; }
    W.degager(); W.resetTrail(); W.tint = null; W.pose = []; W.dest = null; W.focus = null; W._way = null; W.updateCam(true);
    document.body.dataset.theme = (D.gabarit(id) || {}).theme || 'orient'; // le thème de l'interface suit le gabarit du lieu
    $('#ui').style.setProperty('--mini', (W.map.mini ? ((27 + W.map.h + 6) / G.PH * 100).toFixed(1) : '14') + '%'); // les annonces s'empilent sous la mini-carte
    if (I.rodeurs) I.rodeurs.arme(); // un labyrinthe de la noosphère arme son chrono
  };
  W.uncache = function () { delete mapCache[W.mapKey]; };
  // la définition du dessin a changé : la carte et les planches de marche se refont, rien d'autre ne bouge
  G.surDefinition.push(() => { Object.keys(mapCache).forEach(k => { delete mapCache[k]; }); if (!W.map || !W.saga) return;
    const id = W.map.id, opts = W.mapOpts || {}, bl = I.build ? I.build.peek(id) : null;
    if (bl && bl.length) { W.map = I.maps.build(id, opts); bl.forEach(e => I.build.apply(e, W.map)); } else W.map = mapCache[W.mapKey] = I.maps.build(id, opts);
    W.refreshSheets(); W.npcs.forEach(n => { if (n.sheet && n.sheet.look) n.sheet = G.planche(n.sheet.look); }); });
  W.solidAt = function (px, py) { const m = W.map, tx = Math.floor(px / T), ty = Math.floor(py / T); if (tx < 0 || ty < 0 || tx >= m.w || ty >= m.h) return true; return !!m.solid[ty * m.w + tx]; };
  function occupied(x, y, self) {
    const near = e => e !== self && !e.hidden && e.map === W.map.id && e.placed !== false && Math.abs(e.x - x) < 12 && Math.abs(e.y - y) < 10;
    return W.npcs.some(near) || W.foes.some(f => !f.done && near(f)) || W.chests.some(near) || (self !== W.player && Math.abs(W.player.x - x) < 12 && Math.abs(W.player.y - y) < 10);
  }
  // 'lieu' | ['lieu',dx,dy] -> position libre la plus proche (px)
  W.resolve = function (at, mapId, self, tile) {
    const m = W.map; if (!m || m.id !== mapId) return null;
    const name = Array.isArray(at) ? at[0] : at, s = tile || m.spots[name] || [Math.floor(m.w / 2), Math.floor(m.h / 2)];
    const tx0 = s[0] + (Array.isArray(at) ? at[1] : 0), ty0 = s[1] + (Array.isArray(at) ? at[2] : 0);
    for (let rad = 0; rad < 9; rad++) for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue;
      const tx = tx0 + dx, ty = ty0 + dy; if (tx < 1 || ty < 1 || tx >= m.w - 1 || ty >= m.h - 1) continue;
      if (m.solid[ty * m.w + tx]) continue;
      const x = tx * T + 8, y = ty * T + 13; if (occupied(x, y, self)) continue; // 2.16 : le joueur non plus n'est jamais posé sur quelqu'un (Idris sur Maître Yûnus, au bureau)
      return [x, y];
    }
    return [tx0 * T + 8, ty0 * T + 13];
  };
  W.place = function (e) { if (e.map !== W.map.id) return; if (e.placed && e.placedMap === W.map.id) return; const p = W.resolve(e.at, e.map, e); if (p) { e.x = p[0]; e.y = p[1]; e.placed = true; e.placedMap = W.map.id; } };
  W.ent = function (id) { return id === 'hero' ? W.player : W.npcs.find(n => n.id === id); };
  /* 2.16 — le chemin du meneur, mesuré en distance parcourue (et non en images) : un point chaque fois qu'il a avancé
     d'un point et demi, au moins cent quarante points de chemin gardés. Les suiveurs s'y placent à seize points l'un de
     l'autre (W.suiveur), quelle que soit la cadence de l'écran : à 120 images par seconde, ils ne se chevauchent plus.
     Ils restent sans corps : ils ne bloquent personne, comme dans les jeux de rôle d'autrefois. */
  const PAS_CHEMIN = 1.5, LONG_CHEMIN = 140, ECART = 16, DXD = [0, -1, 1, 0], DYD = [1, 0, 0, -1];
  const VITESSE = 82, COURSE = 1.225; // points par seconde à la marche ; la course va 1,225 fois plus vite (2.16 : 1,75 ; le décideur, 19 novembre : « il va trop vite, diminue de 30 % »)
  W.VITESSE = VITESSE; W.COURSE = COURSE;
  // au chargement d'un lieu, le chemin est semé derrière le meneur, à l'opposé de son regard : un mur le fait tourner
  // (jamais revenir sur ses pas), un corps ou un mur sans issue l'arrête — les siens apparaissent déjà en file
  W.resetTrail = function () {
    const p = W.player, t = W.trail = []; if (!W.map) return;
    const L = corps(), libre = (x, y) => boxFree(x, y) && !L.some(e => touche(e, x, y)), course = (x, y, d, max) => { let n = 0; while (n < max && libre(x + DXD[d] * PAS_CHEMIN * (n + 1), y + DYD[d] * PAS_CHEMIN * (n + 1))) n++; return n; };
    let x = p.x, y = p.y, d = [3, 2, 1, 0][p.dir], fait = 0;
    while (fait < LONG_CHEMIN) {
      if (!libre(x + DXD[d] * PAS_CHEMIN, y + DYD[d] * PAS_CHEMIN)) {
        const a = d === 0 || d === 3 ? [1, 2] : [0, 3], na =course(x, y, a[0], 16), nb = course(x, y, a[1], 16); if (!na && !nb) break;
        d = na >= nb ? a[0] : a[1]; }
      x += DXD[d] * PAS_CHEMIN; y += DYD[d] * PAS_CHEMIN; fait += PAS_CHEMIN; t.push([x, y, [3, 2, 1, 0][d]]); // qui suit regarde vers le meneur
    }
  };
  // le point du chemin à « d » points parcourus derrière le meneur (d'office, seize points par rang), interpolé
  W.suiveur = function (i, d) {
    const p = W.player, t = W.trail; let reste = d !== undefined ? d : i * ECART, ax = p.x, ay = p.y, adir = p.dir;
    for (let k = 0; k < t.length; k++) { const b = t[k], L = Math.hypot(b[0] - ax, b[1] - ay);
      if (L > 0 && L >= reste) { const f = reste / L; return [ax + (b[0] - ax) * f, ay + (b[1] - ay) * f, adir]; }
      reste -= L; ax = b[0]; ay = b[1]; adir = b[2]; }
    return [ax, ay, adir];
  };
  /* 2.16 — les marches de récit suivent un chemin (W.route), case par case, en segments droits, chacun avec le bon sens du
     personnage ; elles contournent le joueur et les autres quand c'est possible. Leur durée reste bornée : au plus trois
     fois celle de la ligne droite d'avant (le pas s'allonge au besoin). Sans chemin, la ligne droite d'avant. */
  W.walkTo = async function (e, x, y) {
    if (e !== W.player && e.map !== W.map.id) { e.x = x; e.y = y; return; }
    const dist = Math.hypot(x - e.x, y - e.y); if (dist < 2) return;
    const pts = W.chemin(e, x, y), seg = []; let total = 0;
    for (let k = 1; k < pts.length; k++) { const a = pts[k - 1], b = pts[k], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.01) continue; seg.push({ a, b, L, t0: total }); total += L; }
    if (!seg.length) return;
    const dirDe = s => { const dx = s.b[0] - s.a[0], dy = s.b[1] - s.a[1]; return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); };
    e.dir = dirDe(seg[0]); e.moving = true; e.scripted = true; e.pas = null;
    const dur = Math.min(total, dist * 3) / 70 * 1000 / I.speed, t0 = performance.now();
    await new Promise(res => { (function step() { const f = Math.min(1, (performance.now() - t0) / dur), s0 = f * total; let s = seg[0];
      for (const q of seg) { if (q.t0 <= s0) s = q; else break; }
      const g = Math.min(1, (s0 - s.t0) / s.L); e.x = s.a[0] + (s.b[0] - s.a[0]) * g; e.y = s.a[1] + (s.b[1] - s.a[1]) * g; e.dir = dirDe(s);
      if (e === W.player) pushTrail(); if (f < 1) requestAnimationFrame(step); else res(); })(); });
    e.x = x; e.y = y; e.moving = false; e.scripted = false;
  };
  // les points par où passe une marche de récit : le chemin des cases, en segments horizontaux et verticaux
  W.chemin = function (e, x, y) {
    const path = W.route(x, y, e), dest = path.length ? path[path.length - 1] : null;
    if (!path.length || Math.floor(dest[0] / T) !== Math.floor(x / T) || Math.floor(dest[1] / T) !== Math.floor((y - 2) / T)) return [[e.x, e.y], [x, y]]; // sans chemin jusqu'à la case : la ligne droite d'avant
    const pts = [[e.x, e.y]], vers = (a, b) => { // de a à b, d'abord sur un axe puis sur l'autre, par où le décor le permet
      if (Math.abs(a[0] - b[0]) < 0.5 || Math.abs(a[1] - b[1]) < 0.5) { pts.push(b); return; }
      const c1 = [b[0], a[1]], c2 = [a[0], b[1]], ok = c => !W.solidAt(c[0], c[1]) && !W.solidAt((a[0] + c[0]) / 2, (a[1] + c[1]) / 2) && !W.solidAt((b[0] + c[0]) / 2, (b[1] + c[1]) / 2);
      pts.push(ok(c1) || !ok(c2) ? c1 : c2, b); };
    path.forEach(q => vers(pts[pts.length - 1], [q[0], q[1] + 2]));
    vers(pts[pts.length - 1], [x, y]);
    return pts;
  };
  function pushTrail() {
    const p = W.player, t = W.trail, a = t[0];
    if (a && Math.hypot(p.x - a[0], p.y - a[1]) < PAS_CHEMIN) return;
    t.unshift([p.x, p.y, p.dir]);
    let L = 0; for (let k = 1; k < t.length; k++) { L += Math.hypot(t[k][0] - t[k - 1][0], t[k][1] - t[k - 1][1]); if (L > LONG_CHEMIN) { t.length = k + 1; break; } }
  }
  W.updateCam = function (snap) {
    const m = W.map, mw = m.w * T, mh = m.h * T;
    let cx = mw <= G.PW ? (mw - G.PW) / 2 : I.clamp(W.player.x - G.PW / 2, 0, mw - G.PW);
    let cy = mh <= G.PH ? (mh - G.PH) / 2 : I.clamp(W.player.y - G.PH / 2 - 8, 0, mh - G.PH);
    if (snap) { W.cam.x = cx; W.cam.y = cy; } else { W.cam.x += (cx - W.cam.x) * 0.14; W.cam.y += (cy - W.cam.y) * 0.14; }
    // fenêtre visible (écran en hauteur) : elle suit le héros, se tourne vers celui qui parle et s'arrête aux bords de la carte
    const V = G.view;
    if (V.w < G.PW) {
      const f = W.focus, half = V.w / 2 - 22, off = f && f.map === m.id && !f.hidden && f.placed ? I.clamp((f.x - W.player.x) / 2, -half, half) : 0;
      W.foff = snap ? off : (W.foff || 0) + (off - (W.foff || 0)) * 0.1;
      const lo = Math.max(0, -cx), hi = Math.min(G.PW, mw - cx) - V.w, want = hi < lo ? (lo + hi) / 2 : I.clamp(W.player.x + W.foff - cx - V.w / 2, lo, hi);
      V.t = snap ? want : V.t + (want - V.t) * 0.14; V.x = V.h < G.PH ? G.cale(V.t) : Math.round(V.t);
    } else { V.x = 0; V.t = 0; }
    // 2.x — l'image agrandie : la fenêtre suit aussi le héros de haut en bas, et s'arrête aux bords de la carte
    if (V.h < G.PH) {
      const f = W.focus, half = V.h / 2 - 26, off = f && f.map === m.id && !f.hidden && f.placed ? I.clamp((f.y - W.player.y) / 2, -half, half) : 0;
      W.foffY = snap ? off : (W.foffY || 0) + (off - (W.foffY || 0)) * 0.1;
      const lo = Math.max(0, -cy), hi = Math.min(G.PH, mh - cy) - V.h, want = hi < lo ? (lo + hi) / 2 : I.clamp(W.player.y - 10 + W.foffY - cy - V.h / 2, lo, hi);
      V.ty = snap ? want : V.ty + (want - V.ty) * 0.14; V.y = G.cale(V.ty);
    } else { V.y = 0; V.ty = 0; }
  };

  /* ----- chapitres et objectifs ----- */
  W.cur = function () { return W.ch && W.ch.objectives[W.objIndex]; };
  W.startChapter = async function (sagaId, ci, cp) {
    const saga = I.sagas[sagaId], ch = saga.chapters[ci];
    W.lock = true;
    if (W.saga !== saga) W.roster = {};
    W.saga = saga; W.ci = ci; W.ch = ch; W.minLvl = saga.frame ? (ch.minLvl || 1) : (MINLVL[ci] || 6);
    const sp = I.save.data.sagas[sagaId] || (I.save.data.sagas[sagaId] = { ch: 0, done: false, flags: {} });
    S.flags = cp ? (cp.flags || {}) : Object.assign({}, sp.flags || {});
    if (!cp) { delete S.flags._prayed; delete S.flags._prayPillar; I.oeuvres.newChapter(); I.mal.ouvre(); }
    if (saga.frame && !saga.veillees && (Number.isInteger(ch.retour) || ch.visite) && I.ui.drapeaux2084) I.ui.drapeaux2084(S.flags); // 2.x : l'état de 2084, pour un retour ou une visite
    I.oeuvres.syncFlags();
    W.party = (cp ? cp.party : ch.party).slice(); W.party.forEach(id => W.ensureLevel(W.hero(id))); W.healAll(); W.refreshSheets();
    W.npcs = (ch.npcs || []).map(n => { const def = n.hero && saga.heroes[n.hero]; const look = def ? lookOf(def) : Object.assign({ kind: 'homme', robe: '#8a7355', head: '#e6dcc4' }, n.look); if (!def && (look.kind === 'soldat' || look.kind === 'romain') && !look.item && !look.coiffe) look.sel = I.hash(n.id || n.name || '') % 97; return Object.assign({}, n, { map: n.map || ch.map, hidden: !!n.hidden, placed: false, dir: 0, sheet: G.planche(look), aura: def ? (lueur(def.look) || '#ffe9a8') : (look.kind === 'compagnon' ? (lueur(look) || '#ffe9a8') : null) }); });
    W.foes = (ch.foes || []).map(f => Object.assign({}, f, { map: f.map || ch.map, done: false, placed: false, ph: Math.random() * 6 }));
    W.chests = (ch.chests || []).map(c => Object.assign({}, c, { map: c.map || ch.map, open: false, placed: false }));
    W.objIndex = cp ? cp.obj : 0;
    if (cp) {
      (cp.foes || []).forEach(id => { const f = W.foes.find(f => f.id === id); if (f) f.done = true; });
      (cp.chests || []).forEach(i => { if (W.chests[i]) W.chests[i].open = true; });
      W.npcs.forEach(n => { const s = cp.npcs && cp.npcs[n.id]; if (s) { n.hidden = !!s.h; } });
    }
    S.depth++;
    try { await S.fade('out', 300); } finally { S.depth--; }
    I.setScene(W);
    W.player.dir = 0; // avant le chargement : les siens sont semés derrière lui (W.resetTrail)
    W.loadMap(cp ? cp.map : ch.map, cp ? cp.opts : (ch.opts || {}), cp ? cp.pos : ch.start);
    if (cp) { W.npcs.forEach(n => { const s = cp.npcs && cp.npcs[n.id]; if (s && s.x !== undefined && n.map === W.map.id) { n.x = s.x; n.y = s.y; n.placed = true; n.placedMap = W.map.id; } }); if (W.degager()) W.resetTrail(); }
    W.hud(); $('#hud').hidden = false;
    S.depth++; W.lock = false; // verrouille le déplacement pendant l'ouverture
    try {
      await S.fade('in', 500);
      if (!cp) { W.checkpoint(); await S.run(ch.intro || [['title', ch.title, ch.sub]]); await I.oeuvres.openChapter(); }
      if (I.build) { I.build.set(false); if (!cp && (!saga.frame || saga.veillees)) { I.build.yields(); await I.trade.resolve(); } }
      // 2.x — la progression (lecons.js) : dans une partie neuve, un seul outil à la fois. Au début du prologue, se déplacer, et rien d'autre.
      const appr = I.lecons && I.lecons.actif();
      if (appr) { if (saga.frame && !saga.veillees && ci === 0) I.lecons.depart(); }
      else if (saga.frame && ci === 0) S.toast(document.body.classList.contains('touch') ? I.t('Touche un endroit pour t’y rendre, un personnage pour lui parler · <b>?</b> : que faire') : I.t('<b>Flèches</b>, <b>ZQSD</b> ou clic : marcher · <b>Entrée</b> : parler · <b>H</b> ou <b>?</b> : que faire · <b>Échap</b> : halte'), 10000);
      // l'équipement : le joueur de test s'habille au mieux ; le joueur est prévenu quand la réserve tient mieux que ce qu'il porte
      if (I.debug.auto) I.gear.bestAll(); else if (!cp) { if (appr) I.lecons.chapitre(); else if (I.gear.better()) S.toast(I.t('La réserve tient de quoi mieux équiper ce groupe : <b>Halte</b>, puis <b>Équipement</b>.'), 7000); }
      if (!cp && I.postures) I.postures.veille(); // une posture s'ouvre à quelqu'un du groupe : on le dit, une fois
      await W.advance();
    } finally { S.depth--; S.hideDialog(); }
  };
  W.hud = function () {
    const o = W.cur();
    $('#hud .chap').textContent = W.ch ? W.ch.title : '';
    const tm = W.map && ({ dawn: I.t('Fajr'), day: I.t('Dhuhr'), dusk: I.t('Maghrib'), night: I.t("'Ishâ") })[W.map.env.time];
    $('#hud .sub').textContent = (W.ch ? W.ch.sub : '') + (tm ? '  ·  ◠ ' + tm : '');
    const P = W.pillars(); $('#hud .pil').innerHTML = Object.keys(D.PILLARS).map(k => `<span title="${D.PILLARS[k].name}"><i>${D.PILLARS[k].glyph}</i>${P[k] || 0}</span>`).join('') + (I.trade && W.saga && (!W.saga.frame || W.saga.veillees) ? `<span title="${I.t('Dirhams')}"><i>◎</i>${I.trade.dirhams()}</span>` : '') + `<span title="${I.t('Provision du cœur')}" class="zad"><i>♥</i>${I.oeuvres.zad()}${I.oeuvres.fasting() ? ' <i>☾</i>' + I.t('jeûne') : ''}</span>`;
    const en = I.oeuvres.enigme(); $('#hud .enig').hidden = !en; if (en) $('#hud .enig').textContent = I.t('Énigme : {signe}', { signe: en.signe });
    $('#hud .obj').textContent = (o && o.text ? o.text : '') + (o && o.build ? I.build.objectiveText(o.build) : '');
    $('#hud .obj').hidden = !(o && o.text);
    ['.chap', '.sub', '.obj', '.enig'].forEach(k => { const e = $('#hud ' + k); e.dir = I.langue.sens(e.textContent); }); // 2.x : chaque ligne prend le sens de sa langue
    if (S.filPlace) S.filPlace(); // en hauteur, le fil se pose sous l'en-tête (D189)
  };
  /* Mener plusieurs récits de front (2.x). La partie garde un point de reprise courant (cp) et, rangés à part, ceux des
     récits que l'on a quittés en chemin (cps) : un par saga de la Chaîne, un par chapitre de l'histoire-cadre ou des
     veillées. Quitter un récit range son point ; le rouvrir le reprend. Champ absent des parties d'avant : le format reste le 2. */
  W.cleReprise = function (c) { const s = I.sagas[c.saga]; return s && s.frame ? c.saga + ':' + c.ci : c.saga; };
  W.ranger = function () { const sv = I.save.data, c = sv.cp; if (!c) return null; c.t = Date.now(); (sv.cps = sv.cps || {})[W.cleReprise(c)] = c; sv.cp = null; return c; };
  // le point de reprise de ce récit, s'il en a un : il redevient le point courant (celui d'un autre récit est rangé)
  W.reprise = function (sagaId, ci) {
    const sv = I.save.data, k = W.cleReprise({ saga: sagaId, ci });
    if (sv.cp && W.cleReprise(sv.cp) === k) return sv.cp;
    const c = sv.cps && sv.cps[k]; if (!c) return null;
    W.ranger(); delete sv.cps[k]; sv.cp = c; return c;
  };
  W.rangees = function () { const sv = I.save.data; return Object.keys(sv.cps || {}).map(k => sv.cps[k]).filter(c => c && I.sagas[c.saga] && (I.sagas[c.saga].chapters || [])[c.ci]).sort((x, y) => (y.t || 0) - (x.t || 0)); };
  W.checkpoint = function () {
    if (W.excursion) return; // pendant la descente du râwî, le point de reprise reste celui d'avant
    { const sv = I.save.data, k = W.cleReprise({ saga: W.saga.id, ci: W.ci }); if (sv.cp && W.cleReprise(sv.cp) !== k) W.ranger(); if (sv.cps && sv.cps[k]) delete sv.cps[k]; } // le point d'un autre récit est rangé, jamais écrasé
    const npcs = {}; W.npcs.forEach(n => { npcs[n.id] = { h: n.hidden ? 1 : 0, x: n.placed && n.map === W.map.id ? Math.round(n.x) : undefined, y: n.placed && n.map === W.map.id ? Math.round(n.y) : undefined }; });
    I.save.data.cp = { saga: W.saga.id, ci: W.ci, obj: W.objIndex, map: W.map.id, opts: W.mapOpts, pos: [Math.round(W.player.x), Math.round(W.player.y)], party: W.party.slice(), npcs, foes: W.foes.filter(f => f.done).map(f => f.id), chests: W.chests.map((c, i) => c.open ? i : -1).filter(i => i >= 0), flags: S.flags };
    W.persistHeroes(); I.save.store();
    { const lead = W.party.length ? W.hero(W.party[0]) : null; const ok = I.save.auto(lead ? I.t('{saga} · {chapitre} · niv. {niv}', { saga: W.saga.name, chapitre: W.ch.title, niv: lead.lvl }) : I.t('{saga} · {chapitre}', { saga: W.saga.name, chapitre: W.ch.title })); W.unsaved = 0;
      if (!ok && !W._sansStock) { W._sansStock = true; S.toast(I.t('Ce navigateur refuse le stockage : la partie ne pourra pas être reprise après la fermeture de la page.'), { urgent: true }); } } // la partie se garde toute seule
  };
  // exécute les objectifs automatiques ; termine le chapitre s'il n'en reste plus
  W.advance = async function () {
    while (true) {
      const o = W.cur();
      if (!o) return W.endChapter();
      W.hud();
      if (o.foe) { const f = W.foes.find(f => f.id === o.foe); if (f && f.done) { await W.complete(true); continue; } }
      if (o.build && I.build.objectiveDone(o.build)) { await W.complete(true); continue; }
      if (!o.auto) { if (I.lecons) I.lecons.objectif(o); return; }
      await W.complete(true);
    }
  };
  W.complete = async function (noAdvance) {
    const o = W.cur(); if (!o) return;
    S.depth++;
    try {
      if (!o.auto) { I.audio.sfx('light'); }
      if (o.then) await S.run(o.then);
      if (I.lecons) I.lecons.atteint(o, W._mene === W.objIndex); // une séquence s'achève (lecons.js)
      W.objIndex++; W.hud(); W.checkpoint();
    } finally { S.depth--; S.hideDialog(); }
    if (!noAdvance) await W.advance();
  };
  W.endChapter = async function () {
    const saga = W.saga, ch = W.ch, sv = I.save.data;
    S.depth++;
    try {
      if (ch.outro) await S.run(ch.outro);
      await I.oeuvres.endChapter();
      const sp = sv.sagas[saga.id]; sp.flags = S.flags; W.persistHeroes(); if (sv.cp && W.cleReprise(sv.cp) !== W.cleReprise({ saga: saga.id, ci: W.ci })) W.ranger(); sv.cp = null; if (sv.cps) delete sv.cps[W.cleReprise({ saga: saga.id, ci: W.ci })];
      $('#hud').hidden = true;
      if (W.ci + 1 < saga.chapters.length && !(saga.frame && ch.last)) {
        sp.ch = Math.max(sp.ch, W.ci + 1); I.save.store();
        S.hideDialog(); // la dernière ligne du chapitre a été lue : elle ne reste pas sous le noir pendant que le lieu suivant se bâtit
        await S.fade('out', 500);
        S.depth--; try { await W.startChapter(saga.id, W.ci + 1); } finally { S.depth++; }
      } else {
        S.hideDialog(); await S.fade('out', 600); I.setScene(I.ui.blank); G.clearParts(); G.amb = { kind: 'noos', rate: 6, hue: 40, n: 0 }; await S.fade('in', 400);
        if (saga.outro && (!saga.frame || (saga.veillees ? W.ci === saga.chapters.length - 1 : !!ch.fin))) await S.run(saga.outro);
        if (!saga.frame && sp.cTot) {
          const perfect = (sp.cOk || 0) === sp.cTot;
          if (perfect) { sv.items.siwak = (sv.items.siwak || 0) + 2; sv.items.musc = (sv.items.musc || 0) + 1; I.audio.sfx('roll'); }
          await S.card('victory', `<p class="small">${I.t('Fidélité à la Chaîne · {saga}', { saga: I.esc(saga.name) })}</p><h1>${perfect ? I.t('Chaîne fidèle') : I.t('Chaîne transmise')}</h1><ul><li>${I.t('Actes retrouvés du premier coup : <b>{ok} / {total}</b>', { ok: sp.cOk || 0, total: sp.cTot })}</li>${perfect ? '<li>' + I.t('Chaîne sans faille : chaque acte fut celui que les transmetteurs ont rapporté.') + '</li><li>' + I.t('Reçu : <b>Siwâk ×2</b>, <b>Musc</b>') + '</li>' : '<li>' + I.t('Là où la chaîne a vacillé, relis le Recueil : chaque acte y a sa source.') + '</li>'}</ul><div class="hint">▼</div>`);
        }
        sp.done = true; sp.ch = saga.frame ? W.ci + 1 : 0;
        if (!saga.frame) I.gear.deposer(saga.id); // ce que ce groupe portait rejoint la réserve : le suivant s'en servira
        I.save.store();
        await I.ui.afterSaga(saga, ch);
      }
    } finally { S.depth--; S.hideDialog(); }
  };

  /* ----- interaction ----- */
  W.interact = async function (who) {
    if (S.busy || W.lock) return;
    const p = W.player, fx = [0, -1, 1, 0][p.dir], fy = [1, 0, 0, -1][p.dir];
    const px = p.x + fx * 12, py = p.y + fy * 12;
    let best = null, bd = 22;
    W.npcs.forEach(n => { if (n.hidden || n.map !== W.map.id || !n.placed) return; const d = Math.hypot(n.x - px, n.y - py); if (d < bd) { bd = d; best = n; } });
    const o0 = W.cur();
    if (o0 && o0.talk) { const n = W.npcs.find(n => n.id === o0.talk); if (n && !n.hidden && n.map === W.map.id && n.placed && (Math.hypot(n.x - px, n.y - py) < 27 || Math.hypot(n.x - p.x, n.y - p.y) < 24)) best = n; }
    // sur la natte, la prière et la sauvegarde passent avant un voisin que l'on ne regarde pas en face
    const onMat = W.nearPrayer() && !(o0 && o0.talk && best && best.id === o0.talk);
    if (onMat && best && bd > 13) best = null;
    if (who && W.npcs.includes(who) && !who.hidden && who.map === W.map.id && Math.hypot(who.x - p.x, who.y - p.y) < 34) best = who; // celui que l'on a touché du doigt
    if (best) {
      const dx = p.x - best.x, dy = p.y - best.y; best.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
      const o = W.cur();
      if (o && o.talk === best.id) return W.complete();
      if (best.talk) { I.audio.sfx('blip'); await S.run(best.talk); }
      return;
    }
    const c = who && W.chests.includes(who) && !who.open && Math.hypot(who.x - p.x, who.y - p.y) < 30 ? who : W.chests.find(c => !c.open && c.map === W.map.id && c.placed && Math.hypot(c.x - px, c.y - py) < 18);
    if (c) { c.open = true; I.audio.sfx('door'); if (c.codex) { S.toast(I.t('Un feuillet. Tu le lis lentement.')); await S.run([['codex', c.codex]]); } else await S.run([['give', c.gear || c.item, c.n || 1]]); W.checkpoint(); return; }
    if (I.rodeurs && I.rodeurs.faceAPorte()) { I.rodeurs.direPorte(); return; } // 2.x : la porte interdite — elle ne s'ouvre pas, on en parle
    if (W.nearPrayer()) {
      await I.oeuvres.natte();
    } else if (I.trade && I.trade.near()) await I.trade.open();
    else if (I.build) await I.build.gather();
  };
  W.fight = async function (f) {
    S.depth++;
    try {
      await I.battle.start({ group: f.group, bg: f.bg || W.map.env.bg, boss: f.boss, intro: f.intro });
      f.done = true; W.checkpoint();
    } finally { S.depth--; }
    const o = W.cur(); if (o && o.foe === f.id) await W.complete();
  };

  /* ----- mise à jour ----- */
  W.onInput = function (a) {
    if (I.scene !== W || S.busy || W.lock) return false;
    if (W.excursion) { if (a === 'ok') { if (I.rodeurs.faceAPorte()) I.rodeurs.direPorte(); else if (!I.rodeurs.attendre()) I.rodeurs.frappe(); } else if (a === 'frappe') I.rodeurs.frappe(); else if (a === 'build' || a === 'help' || a === 'prev' || a === 'menu' || a === 'cancel') S.toast(I.rodeurs.texte('pasDeHalte'), 2600); return true; } // la descente du râwî se fait d'une traite
    if (a === 'build') { I.build.set(!I.build.on); return true; }
    if (I.build.on) { if (a === 'ok') { I.build.place(); return true; } if (a === 'cancel' || a === 'frappe') { I.build.set(false); return true; } /* B, en bâtissant : on cesse de bâtir */ if (a === 'prev') { I.build.cycle(-1); return true; } if (a === 'next') { I.build.cycle(1); return true; } }
    if (a === 'ok') { W.stop(); if (I.rodeurs && I.rodeurs.faceAPorte()) I.rodeurs.direPorte(); else if (I.rodeurs && I.rodeurs.aFrapper()) I.rodeurs.frappe(); else W.interact(); return true; } // 2.x : dans un labyrinthe, quand quelque chose rôde à portée, « Valider » frappe ; devant la porte interdite, il la désigne
    if (a === 'frappe') { W.stop(); if (I.rodeurs && I.rodeurs.aFrapper()) I.rodeurs.frappe(); return true; } // 2.x : B frappe ce qui rôde ; ailleurs, rien
    if (a === 'help') { W.stop(); I.ui.guide(); return true; }
    if (a === 'prev') { W.stop(); I.ui.pause('carte'); return true; }
    if (a === 'menu' || a === 'cancel') { W.stop(); I.ui.pause(); return true; }
    return false;
  };
  W.update = function (dt) {
    W.t += dt; const p = W.player, h = I.input.held;
    const can = !S.busy && !W.lock && !I.ui.menuOpen;
    if (can && I.rodeurs && I.rodeurs.attente && !W.excursion && !W._autoBusy) { I.rodeurs.depart(); return; } // la descente demandée commence dès que le joueur a la main
    if (can && I.debug.auto && !W._autoBusy && !I.debug.walk) { if (!W.excursion) W.autoStep(); W.updateCam(); return; }
    if (I.rodeurs) { if (can) I.rodeurs.tic(dt); else I.rodeurs.cache(); }
    if (I.ui.frapper) I.ui.frapper(can && !!I.rodeurs && I.rodeurs.aFrapper() && !(W.excursion && (W.excursion.abri || W.excursion.fin))); // le bouton du pouce droit dit « Frapper »
    if (can && I.lecons && !I.debug.auto) I.lecons.temps(dt); // le chrono ne court que lorsque le joueur a la main
    if (can && (W.solidAt(p.x - 4, p.y - 5) || W.solidAt(p.x + 4, p.y) || W.solidAt(p.x - 4, p.y) || W.solidAt(p.x + 4, p.y - 5))) { const q = W.resolve([null, 0, 0], W.map.id, p, [Math.floor(p.x / T), Math.floor((p.y - 2) / T)]); if (q) { p.x = q[0]; p.y = q[1]; W.resetTrail(); } }
    if (can) {
      let dx = (h.right ? 1 : 0) - (h.left ? 1 : 0), dy = (h.down ? 1 : 0) - (h.up ? 1 : 0);
      if (dx || dy) {
        W.dest = null; if (I.build) I.build.aim = null;
        const court = !!(I.input.course || I.input.maj), sp = VITESSE * dt * (dx && dy ? 0.7071 : 1) * (court ? COURSE : 1), x0 = p.x, y0 = p.y; // on court : le joystick avec B tenu (2.17), ou Maj tenue
        p.dir = dx < 0 ? 1 : dx > 0 ? 2 : dy < 0 ? 3 : 0;
        const m1 = dx && tryMove(dx * sp, 0), m2 = dy && tryMove(0, dy * sp);
        p.moving = !!(m1 || m2); p.court = p.moving && court; p.parcours = (p.parcours || 0) + Math.hypot(p.x - x0, p.y - y0); if (p.moving) { pushTrail(); pas(dt); }
      } else if (W.dest) follow(dt);
      else { p.moving = false; p.court = false; }
      pousser(dt);
      const o = W.cur();
      if (o && o.goto) { const s = W.spotPx(o.goto), pr = W.map.spots.priere, near = pr && s && Math.hypot(pr[0] * T + 8 - s[0], pr[1] * T + 13 - s[1]) < 70; if (s && Math.hypot(s[0] - p.x, s[1] - p.y) < (near ? 20 : 36)) W.complete(); }
      // en promenade : un point de reprise toutes les douze secondes (jamais au milieu d'un récit : il serait rejoué à moitié fait)
      W.unsaved = (W.unsaved || 0) + dt; if (W.unsaved > 12 && !S.busy && !W.lock && !I.debug.auto && !I.debug.walk && !(I.ui && I.ui.menuOpen)) W.checkpoint();
      for (const f of W.foes) {
        if (f.done || f.map !== W.map.id || !f.placed || f.rodeur) continue; // ceux qui rôdent dans la descente ont leur propre allure (rodeurs.js)
        const d = Math.hypot(f.x - p.x, f.y - p.y);
        if (d < 15) { W.fight(f); break; }
        // 2.16 : une chimère ne vient pas à moins de douze points d'un PNJ ni d'une autre chimère (elles ne se superposent plus)
        if (d < 72 && !f.boss) { const vx = (p.x - f.x) / d * 22 * dt, vy = (p.y - f.y) / d * 22 * dt, m2 = W.map, voisins = W.npcs.filter(n => !n.hidden && n.map === m2.id && n.placed).concat(W.foes.filter(g => g !== f && !g.done && g.map === m2.id && g.placed)),
          serre = (x, y) => voisins.some(g => { const d1 = Math.hypot(g.x - x, g.y - y); return d1 < 12 && d1 < Math.hypot(g.x - f.x, g.y - f.y); }),
          stop = (x, y) => W.solidAt(x, y) || (m2.trench && m2.trench.has(Math.floor(y / T) * m2.w + Math.floor(x / T))) || serre(x, y); if (!stop(f.x + vx, f.y)) f.x += vx; if (!stop(f.x, f.y + vy)) f.y += vy; }
      }
    } else { W.dest = null; if (!p.scripted) p.moving = false; p.court = false; }
    W.npcs.forEach(n => { if (n.pas) avancerPas(n, dt); }); // le pas de côté va jusqu'au bout, même si un récit commence
    W.updateCam();
  };

  /* ----- déplacement au doigt ou à la souris : on touche un endroit, le héros s'y rend ----- */
  const DX = [1, -1, 0, 0], DY = [0, 0, 1, -1];
  const boxFree = (x, y) => !(W.solidAt(x - 4, y - 5) || W.solidAt(x + 4, y - 5) || W.solidAt(x - 4, y) || W.solidAt(x + 4, y));
  /* 2.16 — un corps pour les PNJ et les coffres, contre le joueur : un pied de 10 × 5, calé sur l'ombre (x ± 5, de y − 4
     à y + 1), contre le sien (x ± 4, de y − 5 à y). Un pas n'est refusé que s'il rapproche d'un corps qu'il toucherait :
     on peut toujours s'en écarter (un joueur repris sur quelqu'un en ressort). Les suiveurs, ce qui rôde et les chimères
     de la carte n'en ont pas pour lui : le contact d'une chimère reste ce qui ouvre le combat. */
  function corps() { const id = W.map.id, l = []; W.npcs.forEach(n => { if (!n.hidden && n.map === id && n.placed) l.push(n); }); W.chests.forEach(c => { if (c.map === id && c.placed) l.push(c); }); return l; }
  const touche = (e, x, y) => Math.abs(x - e.x) < 9 && y - e.y > -4 && y - e.y < 6;
  W.corps = corps; W.touche = touche; // pour les outils de contrôle (« SUPERPOSÉ », « PNJ EN TRAVERS »)
  function heurte(x0, y0, x1, y1, L) { for (const e of L || corps()) if (touche(e, x1, y1) && (!touche(e, x0, y0) || Math.hypot(x1 - e.x, y1 - e.y) < Math.hypot(x0 - e.x, y0 - e.y))) return e; return null; }
  function tryMove(mx, my) { const p = W.player, nx = p.x + mx, ny = p.y + my; if (!boxFree(nx, ny)) { if (I.rodeurs && W.map.env.dedale) I.rodeurs.heurte(nx, ny); return false; } const e = heurte(p.x, p.y, nx, ny); if (e) { W._heurte = e; return false; } p.x = nx; p.y = ny; return true; } // 2.x : buter sur la porte interdite la fait parler d'elle (rodeurs.js)
  // le joueur posé sur quelqu'un (une partie d'avant, un récit) : la case libre la plus proche
  W.degager = function () { const p = W.player; if (!W.map || !corps().some(e => touche(e, p.x, p.y))) return false; const q = W.resolve([null, 0, 0], W.map.id, p, [Math.floor(p.x / T), Math.floor((p.y - 2) / T)]); if (q) { p.x = q[0]; p.y = q[1]; } return true; };
  // un PNJ qui paraît (« show ») là où se tient le joueur — il y était posé, caché — prend la case libre la plus proche
  W.ecarter = function (e) { const p = W.player; if (!W.map || e.hidden || e.map !== W.map.id || !e.placed || !(Math.abs(e.x - p.x) < 12 && Math.abs(e.y - p.y) < 10)) return false;
    const q = W.resolve([null, 0, 0], e.map, e, [Math.floor(e.x / T), Math.floor((e.y - 2) / T)]); if (q) { e.x = q[0]; e.y = q[1]; } return true; };
  // poussé plus de quatre dixièmes de seconde, un PNJ fait un pas de côté : vers une case libre, d'abord sur le côté, puis
  // devant lui, jamais vers celui qui pousse ni sur le chemin qu'il suit
  function pasDeCote(n) {
    const p = W.player, m = W.map, tx = Math.floor(n.x / T), ty = Math.floor((n.y - 2) / T), vx = n.x - p.x, vy = n.y - p.y, axeX = Math.abs(vx) > Math.abs(vy);
    const fx = axeX ? Math.sign(vx) || 1 : 0, fy = axeX ? 0 : Math.sign(vy) || 1, chemin = W.dest && W.dest.path ? W.dest.path.map(q => Math.floor(q[0] / T) + ',' + Math.floor((q[1] - 2) / T)) : [];
    const loin = c => Math.hypot(n.x + c[0] * T - p.x, n.y + c[1] * T - p.y), cotes = [[fy, fx], [-fy, -fx]].sort((a, b) => loin(b) - loin(a));
    for (const [dx, dy] of cotes.concat([[fx, fy], [fx + fy, fy + fx], [fx - fy, fy - fx]])) {
      const cx = tx + dx, cy = ty + dy; if (cx < 1 || cy < 1 || cx >= m.w - 1 || cy >= m.h - 1 || m.solid[cy * m.w + cx] || chemin.includes(cx + ',' + cy)) continue;
      const x = cx * T + 8, y = cy * T + 13; if (!boxFree(x, y) || occupied(x, y, n) || touche({ x, y }, p.x, p.y)) continue;
      n.pas = { x0: n.x, y0: n.y, x1: x, y1: y, t: 0 }; n.moving = true; n.dir = Math.abs(x - n.x) > Math.abs(y - n.y) ? (x < n.x ? 1 : 2) : (y < n.y ? 3 : 0); return true; }
    return false;
  }
  function avancerPas(n, dt) { const q = n.pas, f = Math.min(1, (q.t += dt) / 0.3); n.x = q.x0 + (q.x1 - q.x0) * f; n.y = q.y0 + (q.y1 - q.y0) * f;
    if (f >= 1) { n.pas = null; n.moving = false; const dx = W.player.x - n.x, dy = W.player.y - n.y; n.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); } }
  function pousser(dt) {
    const hz = W._heurte; W._heurte = null;
    if (hz && !hz.pas && !hz.scripted && W.npcs.includes(hz)) { const q = W._pousse && W._pousse.e === hz ? W._pousse : (W._pousse = { e: hz, t: 0, libre: 0 }); q.t += dt; q.libre = 0; if (q.t > 0.4) { W._pousse = null; if (!pasDeCote(hz)) hz._coince = W.t; } }
    else if (W._pousse && (W._pousse.libre += dt) > 0.25) W._pousse = null;
  }
  // ligne droite praticable entre deux points : sert à couper les angles d'un chemin (un corps la coupe aussi)
  function clearLine(x0, y0, x1, y1, L) { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 3); for (let i = 1; i <= n; i++) { const f = i / n, x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f; if (!boxFree(x, y) || (L && L.some(e => touche(e, x, y) && !touche(e, x0, y0)))) return false; } return true; }
  // chemin jusqu'à la case praticable la plus proche du point visé (parcours en largeur sur la grille). 2.16 : la case d'un
  // PNJ ou d'un coffre compte comme pleine (celle du joueur aussi, pour qui marche dans un récit), sauf la case visée ; si
  // la case visée n'est plus joignable ainsi, le chemin se refait sans eux (celui qu'on pousse fera un pas de côté)
  W.route = function (x1, y1, from, sansCorps) {
    const m = W.map, p = from || W.player, w = m.w, sx = I.clamp(Math.floor(p.x / T), 0, w - 1), sy = I.clamp(Math.floor((p.y - 2) / T), 0, m.h - 1), ex = I.clamp(Math.floor(x1 / T), 0, w - 1), ey = I.clamp(Math.floor((y1 - 2) / T), 0, m.h - 1);
    const s = sy * w + sx, e0 = ey * w + ex, prev = new Int32Array(w * m.h).fill(-1), q = new Int32Array(w * m.h); let qh = 0, qt = 0, best = s, bd = 1e9, plein = null;
    if (!sansCorps) { plein = new Uint8Array(w * m.h); const met = e => { if (e === p) return; const i = Math.floor((e.y - 2) / T) * w + Math.floor(e.x / T); if (i >= 0 && i < plein.length && i !== s && i !== e0) plein[i] = 1; };
      corps().forEach(met); if (p !== W.player) met(W.player); }
    prev[s] = s; q[qt++] = s;
    while (qh < qt) {
      const i = q[qh++], x = i % w, y = (i - x) / w, d = (x - ex) * (x - ex) + (y - ey) * (y - ey);
      if (d < bd) { bd = d; best = i; if (!d) break; }
      for (let k = 0; k < 4; k++) { const nx = x + DX[k], ny = y + DY[k]; if (nx < 0 || ny < 0 || nx >= w || ny >= m.h) continue; const j = ny * w + nx; if (prev[j] >= 0 || m.solid[j] || (plein && plein[j])) continue; prev[j] = i; q[qt++] = j; }
    }
    const path = []; for (let i = best; prev[i] !== i; i = prev[i]) path.unshift([(i % w) * T + 8, Math.floor(i / w) * T + 11]);
    if (bd > 0 && !sansCorps) { const autre = W.route(x1, y1, from, true), fin = autre.length ? autre[autre.length - 1] : [p.x, p.y + 2], dfin = (Math.floor(fin[0] / T) - ex) ** 2 + (Math.floor((fin[1] - 2) / T) - ey) ** 2; if (dfin < bd) return autre; }
    return path;
  };
  // o : { ent (cible mobile), stop (distance d'arrêt), then (à l'arrivée), quiet (pas de repère au sol) }
  W.goTo = function (x, y, o) {
    o = o || {}; const p = W.player, path = W.route(x, y);
    if (!o.ent && !o.then && boxFree(x, y)) { const l = path.length ? path[path.length - 1] : [p.x, p.y]; if (Math.hypot(l[0] - x, l[1] - y) < 14) path.push([x, y]); } // jusqu'au point exact, s'il est libre
    W.dest = { x, y, path, ent: o.ent || null, stop: o.stop || 0, then: o.then || null, mark: !o.quiet && !o.ent, stall: 0, raw: false, course: !!o.course }; // course : choisi d'un double toucher (2.16)
  };
  W.stop = function () { if (W.dest) { W.dest = null; W.player.moving = false; } };
  function follow(dt) {
    const d = W.dest, p = W.player;
    if (I.build) I.build.aim = null;
    if (d.ent) { if (d.ent.hidden || d.ent.done || d.ent.map !== W.map.id) return W.stop(); if (Math.hypot(d.ent.x - d.x, d.ent.y - d.y) > 12) { d.x = d.ent.x; d.y = d.ent.y; d.path = W.route(d.x, d.y); } }
    const arrive = () => { const th = d.then; W.dest = null; p.moving = false; if (th) th(); };
    if (d.stop && Math.hypot(d.x - p.x, d.y - p.y) <= d.stop) return arrive();
    const LC = corps();
    if (!d.raw) for (let j = Math.min(d.path.length - 1, 6); j > 0; j--) if (clearLine(p.x, p.y, d.path[j][0], d.path[j][1], LC)) { d.path.splice(0, j); break; }
    while (d.path.length && Math.hypot(d.path[0][0] - p.x, d.path[0][1] - p.y) < 1.2) d.path.shift();
    if (!d.path.length) return arrive();
    const wp = d.path[0], vx = wp[0] - p.x, vy = wp[1] - p.y, L = Math.hypot(vx, vy), sp = Math.min(L, VITESSE * dt * (d.course ? COURSE : 1)), mx = vx / L * sp, my = vy / L * sp, x0 = p.x, y0 = p.y;
    if (!tryMove(mx, my)) { tryMove(mx, 0); tryMove(0, my); }
    const moved = Math.hypot(p.x - x0, p.y - y0);
    if (Math.abs(vx) > Math.abs(vy) * 1.25) p.dir = vx < 0 ? 1 : 2; else if (Math.abs(vy) > Math.abs(vx) * 1.25) p.dir = vy < 0 ? 3 : 0;
    p.moving = moved > 0.01; p.court = p.moving && !!d.course; p.parcours = (p.parcours || 0) + moved;
    if (p.moving) { pushTrail(); pas(dt); }
    // buter sur quelqu'un qui va faire un pas de côté n'est pas être coincé (sauf s'il n'a pu s'écarter)
    const pousse = W._heurte && W.npcs.includes(W._heurte) && !(W._heurte._coince > W.t - 1.5);
    if (moved < sp * 0.3 && !pousse) { if (++d.stall > 14) { if (d.raw) return arrive(); d.raw = true; d.stall = 0; d.path = W.route(d.x, d.y); } } else d.stall = 0;
  }
  // le bruit des pas : cinq par seconde en marchant ; en courant, un à chaque appui (la foulée : G.FOULEE × 4 points de chemin)
  function pas(dt) { const p = W.player;
    if (p.court && G.FOULEE) { const n = Math.floor((p.parcours || 0) / (G.FOULEE * 4)); if (n !== p._appui) { p._appui = n; I.audio.sfx('step'); } return; }
    const r = 5; if (Math.floor(W.t * r) !== Math.floor((W.t - dt) * r)) I.audio.sfx('step'); }
  // conduit le héros jusqu'à l'objectif : l'aide « M'y conduire », et le test « au doigt »
  W.lead = function () {
    const tg = W.target(), p = W.player; if (!tg) return false;
    W._mene = W.objIndex; // conduit vers cet objectif : y arriver ne compte pas pour « sans aide » (lecons.js)
    const face = e => { const dx = e.x - p.x, dy = e.y - p.y; p.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); };
    if (tg.kind === 'talk') W.goTo(tg.gx, tg.gy, { ent: tg.ent, stop: 21, then() { face(tg.ent); W.interact(tg.ent); } });
    else if (tg.kind === 'foe') W.goTo(tg.gx, tg.gy, { ent: tg.ent, stop: 3 });
    else W.goTo(tg.gx, tg.gy);
    return true;
  };
  W.tapStep = function () {
    const o = W.cur(), p = W.player, log = I.debug.log || (I.debug.log = []), st = W._tap || (W._tap = {});
    if (!o || o.auto) return;
    if (o.build && I.debug.noBuild) return;
    if (o.build) { if (!W._bb) { W._bb = true; I.build.autoBuild(o.build); I.build.after().then(() => { W._bb = false; }, e => { log.push('ERR bâtir ' + e.message); W._bb = false; }); } return; }
    const key = W.saga.id + W.ch.id + W.objIndex + W.map.id, tg = W.target();
    if (st.key !== key) { st.key = key; st.n = 0; st.led = 0; }
    if (!tg) { if (!st.gone) { st.gone = key; log.push((o.talk ? 'PNJ ABSENT ' : o.foe ? 'FOE ABSENT ' : 'CIBLE ABSENTE ') + key); } if (o.foe) { const f = W.foes.find(f => f.id === o.foe); if (f) f.done = true; } W.complete(); return; }
    if (++st.n > 60000 || st.led > 12) { log.push('COINCÉ (au doigt) ' + key + ' à ' + Math.round(Math.hypot(tg.gx - p.x, tg.gy - p.y)) + ' px'); p.x = tg.gx; p.y = tg.gy + (tg.kind === 'goto' ? 0 : 14); W.resetTrail(); W.dest = null; st.key = null; if (tg.kind === 'talk') W.complete(); return; }
    if (!W.dest) { st.led++; W.lead(); }
  };
  // un toucher sur la scène, en coordonnées de la carte : aller là, parler à celui qu'on touche, agir sur ce qu'on touche.
  // (2.17 : le double toucher ne fait plus courir — le décideur, 19 novembre : « réserver le joystick + B pour courir »)
  W.tap = function (wx, wy) { return toucher(wx, wy); };
  function toucher(wx, wy) { if (W.excursion && I.rodeurs.touche(wx, wy)) return;
    if (I.scene !== W || S.busy || W.lock || I.ui.menuOpen || I.debug.auto || I.debug.walk) return false;
    const p = W.player, m = W.map, here = e => !e.hidden && e.map === m.id && e.placed;
    { const r = W.miniRect, sx = wx - Math.round(W.cam.x), sy = wy - Math.round(W.cam.y); if (r && sx >= r[0] && sx <= r[0] + r[2] && sy >= r[1] && sy <= r[1] + r[3]) { W.stop(); I.ui.pause('carte'); return true; } }
    if (I.rodeurs && I.rodeurs.toucherPorte(wx, wy)) return true; // 2.x : toucher la porte interdite (ou sa pièce), c'est la désigner
    const face = (x, y) => { const dx = x - p.x, dy = y - p.y; p.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); };
    if (I.build && I.build.on) {
      const tx = Math.floor(wx / T), ty = Math.floor(wy / T), put = () => { face(tx * T + 8, ty * T + 11); I.build.aim = [tx, ty]; I.build.place(); };
      if (Math.max(Math.abs(tx - Math.floor(p.x / T)), Math.abs(ty - Math.floor((p.y - 3) / T))) <= 2) put(); else W.goTo(tx * T + 8, ty * T + 11, { stop: 27, then: put });
      return true;
    }
    if (I.rodeurs && I.rodeurs.viseDu(wx, wy)) return true; // 2.x : toucher ce qui rôde, c'est le frapper (rodeurs.js)
    const n = W.npcs.find(n => here(n) && Math.abs(n.x - wx) < 10 && wy > n.y - 27 && wy < n.y + 6);
    if (n) { W.goTo(n.x, n.y, { ent: n, stop: 21, then() { face(n.x, n.y); W.interact(n); } }); return true; }
    const f = W.foes.find(f => !f.done && f.map === m.id && f.placed && Math.abs(f.x - wx) < 15 && wy > f.y - 36 && wy < f.y + 6);
    if (f) { W.goTo(f.x, f.y, { ent: f, stop: 3 }); return true; }
    const c = W.chests.find(c => !c.open && c.map === m.id && c.placed && Math.abs(c.x - wx) < 10 && Math.abs(c.y - 6 - wy) < 11);
    if (c) { W.goTo(c.x, c.y, { stop: 17, then() { face(c.x, c.y); W.interact(c); } }); return true; }
    if (Math.abs(wx - p.x) < 9 && wy > p.y - 24 && wy < p.y + 5) { W.stop(); W.interact(); return true; } // se toucher soi-même : agir devant soi
    const mat = W.prayerPts().find(sp => Math.hypot(sp[0] * T + 8 - wx, sp[1] * T + 9 - wy) < 13);
    if (mat) { W.goTo(mat[0] * T + 8, mat[1] * T + 13, { stop: 7, then() { W.interact(); } }); return true; }
    const cs = m.spots.comptoir;
    if (cs && I.trade && W.saga && (!W.saga.frame || W.saga.veillees) && Math.hypot(cs[0] * T + 8 - wx, cs[1] * T + 9 - wy) < 15) { W.goTo(cs[0] * T + 8, cs[1] * T + 13, { stop: 24, then() { W.interact(); } }); return true; }
    // 2.x, dans le labyrinthe d'un chapitre : toucher le vide en direction de l'objectif, c'est demander d'y être conduit (la même
    // aide que « M'y conduire ») — sans quoi, au doigt, on irait buter au fond de l'impasse la plus proche de l'objectif
    if (m.env.dedale && !W.excursion && W.solidAt(wx, wy)) { const tg = W.target(); if (tg) { const ax = wx - p.x, ay = wy - p.y, bx = tg.gx - p.x, by = tg.gy - p.y, na = Math.hypot(ax, ay), nb = Math.hypot(bx, by);
      if (na > 24 && nb > 24 && (ax * bx + ay * by) / (na * nb) > 0.8) { W.wayT = W.t + 8; W.lead(); return true; } } }
    if (W.solidAt(wx, wy)) W.goTo(wx, wy, { then() { face(wx, wy); W.interact(); } }); // un palmier, un rocher, un puits : on s'en approche et l'on s'y adresse
    else W.goTo(wx, wy);
    return true;
  };
  // tests : chemin praticable (BFS sur la grille) puis saut à l'objectif
  W.reach = function (x0, y0, x1, y1) {
    const m = W.map, T2 = 16, sx = Math.floor(x0 / T2), sy = Math.floor(y0 / T2), ex = Math.floor(x1 / T2), ey = Math.floor(y1 / T2);
    const seen = new Uint8Array(m.w * m.h), q = [[sx, sy]]; seen[sy * m.w + sx] = 1;
    while (q.length) { const [x, y] = q.shift(); if (Math.abs(x - ex) <= 1 && Math.abs(y - ey) <= 1) return true;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) continue; const i = ny * m.w + nx; if (seen[i] || m.solid[i]) continue; seen[i] = 1; q.push([nx, ny]); } }
    return false;
  };
  // tests « à pied » : pilote le héros au clavier simulé le long d'un chemin, avec la vraie physique
  // 2.16 : comme un joueur, il passe à côté des PNJ et des coffres (leur case compte comme pleine, sauf celle visée) ; s'il
  // n'y a pas d'autre passage, il va droit (celui qu'il pousse fera un pas de côté)
  W.pathTo = function (x0, y0, x1, y1, sansCorps) {
    const m = W.map, sx = Math.floor(x0 / 16), sy = Math.floor((y0 - 2) / 16), ex = Math.floor(x1 / 16), ey = Math.floor((y1 - 2) / 16);
    const plein = new Uint8Array(m.w * m.h); if (!sansCorps) corps().forEach(e => { const i = Math.floor((e.y - 2) / 16) * m.w + Math.floor(e.x / 16); if (i >= 0 && i < plein.length && i !== sy * m.w + sx && i !== ey * m.w + ex) plein[i] = 1; });
    const prev = new Int32Array(m.w * m.h).fill(-1), q = [sy * m.w + sx]; prev[sy * m.w + sx] = sy * m.w + sx; let end = -1;
    while (q.length) { const i = q.shift(), x = i % m.w, y = (i - x) / m.w; if (Math.abs(x - ex) + Math.abs(y - ey) <= 1) { end = i; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) continue; const j = ny * m.w + nx; if (prev[j] >= 0 || m.solid[j] || plein[j]) continue; prev[j] = i; q.push(j); } }
    if (end < 0) return sansCorps ? null : W.pathTo(x0, y0, x1, y1, true); const path = []; for (let i = end; prev[i] !== i; i = prev[i]) path.unshift([(i % m.w) * 16 + 8, Math.floor(i / m.w) * 16 + 11]); return path;
  };
  W.walkStep = function () {
    const o = W.cur(), p = W.player, h = I.input.held, log = I.debug.log || (I.debug.log = []), st = W._walk || (W._walk = {});
    h.up = h.down = h.left = h.right = false; if (!o || o.auto) return;
    if (o.build && I.debug.noBuild) return;
    if (o.build) { if (!W._bb) { W._bb = true; I.build.autoBuild(o.build); I.build.after().then(() => { W._bb = false; }, e => { log.push('ERR bâtir ' + e.message); W._bb = false; }); } return; }
    const key = W.saga.id + W.ch.id + W.objIndex + W.map.id;
    let tx, ty, kind = o.goto ? 'goto' : o.talk ? 'talk' : 'foe';
    if (o.goto) { const sp = W.spotPx(o.goto); if (!sp) return; tx = sp[0]; ty = sp[1]; }
    else if (o.talk) { const n = W.npcs.find(n => n.id === o.talk); if (!n || n.hidden || n.map !== W.map.id || !n.placed) { if (st.key !== key) { st.key = key; log.push(`PNJ ABSENT ${key} ${o.talk}`); } W.complete(); return; } tx = n.x; ty = n.y; }
    else { const f = W.foes.find(f => f.id === o.foe); if (!f || f.map !== W.map.id || !f.placed) { if (st.key !== key) { st.key = key; log.push(`FOE ABSENT ${key} ${o.foe}`); } if (f) f.done = true; W.complete(); return; } tx = f.x; ty = f.y; }
    if (st.key !== key) { st.key = key; st.path = W.pathTo(p.x, p.y, tx, ty); st.t = 0; st.best = 1e9; st.stall = 0; st.detours = 0; if (!st.path) { log.push(`SANS CHEMIN ${key} ${kind}`); } }
    st.t++;
    const d = Math.hypot(tx - p.x, ty - p.y);
    if (kind === 'talk' && d < 26) { const dx = tx - p.x, dy = ty - p.y; p.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); const before = W.objIndex; W.interact(); if (W.objIndex === before && !S.busy) { if (!st.miss) { st.miss = 1; } } return; }
    const prog = st.path ? st.path.length * 16 + (st.path.length ? Math.hypot(st.path[0][0] - p.x, st.path[0][1] - p.y) : d) : d;
    if (prog < st.best - 0.5) { st.best = prog; st.stall = 0; } else st.stall++;
    // 2.16 : arrêté plus d'une seconde et demie (quelqu'un s'est mis en travers), il cherche un autre chemin — trois fois au plus
    if (st.stall === 90 && (st.detours || 0) < 3 && st.path) { st.detours = (st.detours || 0) + 1; st.path = W.pathTo(p.x, p.y, tx, ty) || st.path; st.best = 1e9; st.stall = 0; }
    if (!st.path || st.stall > 300 || st.t > 30000) { log.push(`COINCÉ ${key} ${kind} à ${Math.round(d)} px (${st.path ? 'chemin trouvé' : 'aucun chemin'})`); p.x = tx; p.y = ty + (kind === 'goto' ? 0 : 14); W.resetTrail(); st.key = null; if (kind === 'talk') W.complete(); return; }
    while (st.path.length > 1 && Math.hypot(st.path[0][0] - p.x, st.path[0][1] - p.y) < 3) st.path.shift();
    const wp = st.path.length ? st.path[0] : [tx, ty], wx = st.path.length > 1 || kind !== 'goto' ? wp[0] : tx, wy = st.path.length > 1 || kind !== 'goto' ? wp[1] : ty;
    if (st.path.length <= 1 && Math.hypot(wp[0] - p.x, wp[1] - p.y) < 3) { st.path = [[tx, ty]]; }
    const ddx = wx - p.x, ddy = wy - p.y; if (ddx > 1.2) h.right = true; else if (ddx < -1.2) h.left = true; if (ddy > 1.2) h.down = true; else if (ddy < -1.2) h.up = true;
  };
  W.autoStep = function () {
    const o = W.cur(); if (!o) return; const p = W.player, log = I.debug.log || (I.debug.log = []);
    if (I.trade && W.map.spots.comptoir && !S.flags._trade_test && !W.saga.frame && !W._autoBusy) { S.flags._trade_test = true; W._autoBusy = true; I.trade._autoStep = 0; I.trade._sold = I.trade._bought = I.trade._forge = 0; I.trade.open().then(() => { W._autoBusy = false; }, e => { log.push('ERR commerce ' + e.message); W._autoBusy = false; }); return; }
    if (o.build && I.debug.noBuild) return;
    if (o.build) { W._autoBusy = true; I.build.autoBuild(o.build); I.build.after().then(() => { W._autoBusy = false; }, e => { log.push('ERR bâtir ' + e.message); W._autoBusy = false; }); return; }
    if (W.map.spots.priere && !S.flags._prayed && !W._autoBusy) { W._autoBusy = true; W.pray().then(() => I.valeurs.porte('priere')).then(() => I.oeuvres.auto()).then(() => { W._autoBusy = false; }, e => { log.push('ERR prière ' + e.message); W._autoBusy = false; }); return; }
    const go = (x, y, what) => { if (!W.reach(p.x, p.y, x, y)) log.push(`INACCESSIBLE ${W.saga.id}/${W.ch.id} obj${W.objIndex} ${what} sur ${W.map.id}`); p.x = x; p.y = y; W.resetTrail(); };
    const ck = !W._autoBusy && W.chests.find(c => !c.open && !c._vu && c.map === W.map.id && c.placed);
    if (ck) { ck._vu = true; const quoi = ck.gear || ck.item || ck.codex;
      if (![[0, 14], [0, -14], [-14, 0], [14, 0]].some(([dx, dy]) => W.reach(p.x, p.y, ck.x + dx, ck.y + dy))) log.push(`INACCESSIBLE ${W.saga.id}/${W.ch.id} coffre ${quoi} sur ${W.map.id}`);
      W._autoBusy = true; ck.open = true; S.run([ck.codex ? ['codex', ck.codex] : ['give', ck.gear || ck.item, ck.n || 1]]).then(() => { W.checkpoint(); W._autoBusy = false; }, e => { log.push('ERR coffre ' + e.message); W._autoBusy = false; }); return; }
    W._autoBusy = true; const done = () => { W._autoBusy = false; };
    if (o.goto) { const s = W.resolve(o.goto, W.map.id, p); go(s[0], s[1], 'goto ' + o.goto); W.complete().then(done, e => { log.push('ERR ' + e.message); done(); }); }
    else if (o.talk) { const n = W.npcs.find(n => n.id === o.talk); if (!n || n.hidden || n.map !== W.map.id || !n.placed) { log.push(`PNJ ABSENT ${W.saga.id}/${W.ch.id} obj${W.objIndex} talk ${o.talk} (carte ${W.map.id}, pnj ${n ? n.map + (n.hidden ? ' caché' : '') : '?'})`); } else go(n.x, n.y + 14, 'talk ' + o.talk); W.complete().then(done, e => { log.push('ERR ' + e.message); done(); }); }
    else if (o.foe) { const f = W.foes.find(f => f.id === o.foe); if (!f || f.map !== W.map.id || !f.placed) { log.push(`FOE ABSENT ${W.saga.id}/${W.ch.id} obj${W.objIndex} foe ${o.foe} (carte ${W.map.id})`); if (f) f.done = true; W.complete().then(done, done); } else { go(f.x, f.y + 14, 'foe ' + o.foe); W.fight(f).then(done, e => { log.push('ERR ' + e.message); done(); }); } }
    else done();
  };
  W.carte = function () {
    const m = W.map, cv = G.toile(m.w * T, m.h * T), c = cv.getContext('2d');
    c.drawImage(m.canvas, 0, 0);
    m.objs.slice().sort((a, b) => a.y - b.y).forEach(o => { try { c.drawImage(G.obj(o.type, o.opt, o.seed), Math.round(o.x - o.w / 2), o.y - o.h + 1); } catch (e) { /* objet sans dessin */ } });
    return cv;
  };
  W.spotPx = function (at) { const m = W.map, name = Array.isArray(at) ? at[0] : at, s = m.spots[name]; if (!s) return null; return [(s[0] + (Array.isArray(at) ? at[1] : 0)) * T + 8, (s[1] + (Array.isArray(at) ? at[2] : 0)) * T + 13]; };
  W.target = function () {
    if (W.excursion) return I.rodeurs.cible();
    const o = W.cur(); if (!o) return null;
    if (o.goto) { const s = W.spotPx(o.goto); return s && { x: s[0], y: s[1], gx: s[0], gy: s[1], kind: 'goto' }; }
    if (o.build) { const st = o.build.site && I.build.sites()[o.build.site]; return st && st.map === W.map.id ? { x: (st.x + st.w / 2) * T, y: (st.y + st.h / 2) * T, gx: (st.x + st.w / 2) * T, gy: (st.y + st.h) * T + 8, kind: 'goto', site: true } : null; }
    if (o.talk) { const n = W.npcs.find(n => n.id === o.talk); return n && !n.hidden && n.map === W.map.id && n.placed ? { x: n.x, y: n.y - 26, gx: n.x, gy: n.y, kind: 'talk', ent: n } : null; }
    if (o.foe) { const f = W.foes.find(f => f.id === o.foe); return f && !f.done && f.map === W.map.id && f.placed ? { x: f.x, y: f.y - 30, gx: f.x, gy: f.y, kind: 'foe', ent: f } : null; }
    return null;
  };

  /* ----- rendu ----- */
  const POUSSIERE = { sand: '#ecd9aa', dune: '#ecd9aa', path: '#d8be8e' }; // les sols qui lèvent de la poussière, en dessin fin
  // en courant, une petite poussière à chaque appui — sur la terre et le sable seulement : jamais sur une natte, un tapis, un
  // pavé ni un sol de maison ; posée au sol (dans le repère de la carte), elle reste où le pied l'a levée
  const POUDRE = [];
  function poudre(e, sheet, x, y, dir, parcours) {
    if (G.D < 2 || G.low || !sheet.course || !G.FOULEE) return;
    const n = Math.floor(parcours / G.FOULEE), avant = e._img; if (avant === n) return; e._img = n; if (avant === undefined || ((n % 4) + 4) % 4) return;
    const sol = W.map && W.map.g0 && POUSSIERE[W.map.g0(x, y)]; if (!sol) return;
    const g = ((n % 8) + 8) % 8 ? 1 : -1, fx = x + (dir === 1 ? -4.5 : dir === 2 ? 4.5 : g * 2.5), fy = y + (dir === 0 ? 1.5 : 0.5);
    for (let i = 0; i < 3; i++) POUDRE.push({ x: fx + (Math.random() - 0.5) * 3, y: fy, vx: (dir === 1 ? 5 : dir === 2 ? -5 : 0) + (Math.random() - 0.5) * 8, vy: -2 - Math.random() * 3, t: 0, vie: 0.3 + Math.random() * 0.15, r: 0.8 + Math.random() * 0.6, c: sol });
  }
  function dessinePoudre(c, cx, cy, dt) {
    for (let i = POUDRE.length - 1; i >= 0; i--) { const q = POUDRE[i]; q.t += dt || 0; if (q.t >= q.vie) { POUDRE.splice(i, 1); continue; }
      q.x += q.vx * (dt || 0); q.y += q.vy * (dt || 0); const k = q.t / q.vie, r = q.r * (1 + k); c.globalAlpha = 0.5 * (1 - k); c.fillStyle = q.c; c.fillRect(q.x - cx - r / 2, q.y - cy - r / 2, r, r); }
    c.globalAlpha = 1; }
  // geste : { anim, port, tau } — celui qui frappe (R.geste) ; le dessin fin seul le connaît.
  // court : il court — en dessin fin, les huit images de sa foulée (sprites.js, « la course »), choisies d'après le chemin
  // parcouru (parcours, en points) : une image tous les G.FOULEE points, de sorte que le pied d'appui ne glisse pas ; dans le
  // dessin d'origine, les pas de la 1.32, à la cadence de la marche réglée sur la vitesse (une image tous les VITESSE / 8 points)
  const imageCourse = (sheet, parcours) => sheet.course ? 4 + ((Math.floor(parcours / G.FOULEE) % sheet.course) + sheet.course) % sheet.course : [1, 0, 2, 0][((Math.floor(parcours / (VITESSE / 8)) % 4) + 4) % 4];
  W.imageCourse = imageCourse;
  function drawChar(c, sheet, x, y, dir, moving, t, aura, pose, geste, court, parcours) {
    let f = moving ? (court ? imageCourse(sheet, parcours || 0) : [1, 0, 2, 0][Math.floor(t * 8) % 4]) : 0;
    x = G.cale(x); y = G.cale(y);
    c.fillStyle = 'rgba(20,12,30,.32)'; c.beginPath(); c.ellipse(x, y + 1, 6, 2.5, 0, 0, 6.3); c.fill();
    if (geste && sheet.look && G.frappe && G.frappe(c, sheet.look, dir, x - 8, y - 22, geste, geste.tau, 'carte')) return;
    if (pose && !moving && sheet.look) { c.drawImage(G.pose(sheet.look, dir, pose), x - 8, y - 22 - (pose === 'surpris' ? 2 : 0)); return; }
    if (W.trace) W.trace.push({ sheet, x, y, dir, f, court: !!(moving && court) });   // pour les outils (la mesure du pied d'appui)
    if (!sheet.souffle) { c.drawImage(sheet, f * 16, dir * 24, 16, 24, x - 8, y - 22 - (moving && f ? 1 : 0), 16, 24); return; } // le dessin d'origine : comme dans la 1.32
    // en dessin fin : immobile, il respire (une image sur quatre, à son rythme) ; en marche, le corps se hausse d'un point
    // quand les jambes se croisent et se pose quand le pied touche le sol
    if (!moving && Math.sin(t * 2.3) > 0.42) f = 3;
    if (f >= 4) { c.drawImage(sheet.courir(), (f - 4) * 16, dir * 24, 16, 24, x - 8, y - 22, 16, 24); return; }   // la course (sa planche à part) : le corps monte et descend dans l'image même
    c.drawImage(sheet, f * 16, dir * 24, 16, 24, x - 8, y - 22 - (moving && !f ? 0.5 : 0), 16, 24);
  }
  W.drawChar = drawChar;
  function drawFlame(c, x, y, t, big) {
    const n = big ? 7 : 5; for (let i = 0; i < n; i++) { const hgt = 3 + ((Math.sin(t * 13 + i * 2.1) + 1) * (big ? 4 : 3)) | 0; c.fillStyle = i % 2 ? '#ffb347' : '#ff7a2a'; c.fillRect(x - n + i * 2, y - hgt, 2, hgt); c.fillStyle = '#fff0a8'; c.fillRect(x - n + i * 2, y - Math.max(1, hgt - 3), 1, Math.max(1, hgt - 3)); }
  }
  W.render = function (dt) {
    const c = G.px, m = W.map, cx = G.cale(W.cam.x), cy = G.cale(W.cam.y), t = W.t, env = m.env; // en dessin fin, la vue glisse par demi-points
    c.fillStyle = env.time === 'noos' ? '#04051a' : '#0a0810'; c.fillRect(0, 0, G.PW, G.PH);
    c.drawImage(m.canvas, -cx, -cy);
    // eau animée
    const fr = Math.floor(t * 2.2) % 4;
    for (const a of m.anim) { const x = a.x * T - cx, y = a.y * T - cy; if (x < -16 || y < -16 || x > G.PW || y > G.PH) continue; c.drawImage(G.tile(a.n, (a.x + a.y + fr) % 4, 0), x, y); }
    if (I.build) I.build.render(c, cx, cy, t);
    // marqueur d'objectif au sol
    const tg = W.target();
    if (tg && tg.kind === 'goto') { const rr = 9 + Math.sin(t * 4) * 2; c.strokeStyle = 'rgba(255,224,138,.9)'; c.lineWidth = 1; c.beginPath(); c.ellipse(tg.x - cx, tg.y - cy, rr, rr * 0.45, 0, 0, 6.3); c.stroke(); c.fillStyle = 'rgba(255,224,138,.25)'; c.fill(); if (Math.random() < 0.3) G.spawn({ x: tg.x - cx + (Math.random() - 0.5) * 14, y: tg.y - cy, vy: -18, life: 1.2, size: 0.7, color: '#ffe08a', type: 'mote' }); }
    // chemin montré par l'aide : des points d'or du héros à l'objectif
    if (W.wayT > t && tg) {
      if (!W._way || t - W._wayAt > 0.35) { W._way = W.route(tg.gx, tg.gy); W._wayAt = t; }
      W._way.forEach((q, i) => { const ph = (i - Math.floor(t * 7)) % 4; c.fillStyle = ph === 0 ? 'rgba(255,246,220,.95)' : 'rgba(255,224,138,.55)'; c.fillRect(q[0] - cx - 1, q[1] - cy - 1, 2, 2); });
    } else W._way = null;
    // repère de l'endroit touché
    if (W.dest && W.dest.mark) { const d = W.dest, rr = 4.5 + Math.sin(t * 9) * 1.2; c.strokeStyle = 'rgba(255,246,220,.9)'; c.lineWidth = 1; c.beginPath(); c.ellipse(d.x - cx, d.y - cy, rr, rr * 0.5, 0, 0, 6.3); c.stroke(); }
    dessinePoudre(c, cx, cy, dt);
    // éléments triés par profondeur
    const list = [];
    for (const o of m.objs) { if (o.x + o.w < cx || o.x - o.w > cx + G.PW || o.y < cy - 4 || o.y - o.h > cy + G.PH) continue; list.push({ y: o.y, o }); }
    W.npcs.forEach(n => { if (!n.hidden && n.map === m.id && n.placed) list.push({ y: n.y, n }); });
    W.foes.forEach(f => { if (!f.done && f.map === m.id && f.placed) list.push({ y: f.y, f }); });
    W.chests.forEach(ch => { if (ch.map === m.id && ch.placed) list.push({ y: ch.y, ch }); });
    for (let i = W.party.length - 1; i >= 1; i--) { const tr = W.suiveur(i); if (tr) list.push({ y: tr[1] - 0.1, fol: i, tr }); }
    list.push({ y: W.player.y, p: true });
    const bete = W.saga.frame && I.oeuvres.animal(), btr = bete && W.suiveur(0, W.party.length * ECART + 8);
    if (btr) list.push({ y: btr[1] - 0.2, bete, tr: btr }); // figure du ciel : seulement dans la fiction (Cité-Miroir, Citadelle)
    list.sort((a, b) => a.y - b.y);
    const lights = [];
    if (I.rodeurs && m.env.dedale) I.rodeurs.dessinerPorte(c, cx, cy, t, lights); // 2.x : la pièce interdite et sa porte, sur le sol, sous les personnages
    for (const e of list) {
      if (e.o) { const o = e.o; c.drawImage(G.obj(o.type, o.opt, o.seed), Math.round(o.x - o.w / 2) - cx, o.y - o.h + 1 - cy); if (o.anim) drawFlame(c, o.x - cx, o.y - cy - (o.type === 'brazier' ? 10 : 3), t + o.seed, o.type === 'fire'); if (G.OBJ[o.type].herd) I.build.herd(c, o, o.x - cx, o.y - cy, t); }
      else if (e.n) { const n = e.n; if (n.ph === undefined) n.ph = (I.hash((n.id || n.name || '') + '|' + (n.map || '')) >>> 0) % 628 / 100; /* chacun respire à son rythme */ drawChar(c, n.sheet, n.x - cx, n.y - cy, n.dir, n.moving, t + n.ph, n.aura, n.pose); if (n.aura) lights.push({ x: n.x - cx, y: n.y - cy - 14, r: 26, color: n.aura, a: 0.5 }); }
      else if (e.f) { const f = e.f, d = W.saga.enemies[f.group[0]], spr = G.enemy(d.art, d.hue, 1, 0), bob = Math.sin(t * 2.4 + f.ph) * 2.5, s = f.boss ? 34 : 26; c.fillStyle = 'rgba(20,12,30,.3)'; c.beginPath(); c.ellipse(f.x - cx, f.y - cy + 1, 8, 3, 0, 0, 6.3); c.fill(); c.globalAlpha = f.sonne > 0 ? 0.4 + Math.sin(t * 22) * 0.12 : 0.85 + (Math.sin(t * 5 + f.ph) + 1) * 0.06; /* 2.16 : un plancher de 0,85 — encore un peu de transparence : ce n'est pas une personne (exigence 6) */ c.drawImage(spr, f.x - cx - s / 2, f.y - cy - s - 3 + bob, s, s); c.globalAlpha = 1; if (f.rodeur && (f.voiles > 0 || f.tenue > 0) && (f.meute || f.tenue !== undefined)) { const nv = Math.ceil(f.meute ? f.voiles : f.tenue); c.fillStyle = f.sonne > 0 ? '#fff3c8' : `hsl(${d.hue},90%,78%)`; for (let i = 0; i < nv; i++) c.fillRect(Math.round(f.x - cx - nv * 2 + i * 4 + 1), Math.round(f.y - cy - s - 7 + bob), 2, 2); } /* ce qui rôde : ses voiles, et le tremblement de qui vient d'être frappé */ lights.push({ x: f.x - cx, y: f.y - cy - 14, r: 40, color: `hsl(${d.hue},90%,60%)`, a: 0.8 }); if (Math.random() < 0.15) G.spawn({ x: f.x - cx + (Math.random() - 0.5) * 16, y: f.y - cy - 8, vy: -14, vx: (Math.random() - 0.5) * 8, life: 1, size: 0.8, color: `hsl(${d.hue},100%,70%)`, type: 'glyph' }); }
      else if (e.ch) { const ch = e.ch; c.drawImage(G.obj('chest', { open: ch.open }), Math.round(ch.x) - 7 - cx, Math.round(ch.y) - 11 - cy); if (!ch.open) lights.push({ x: ch.x - cx, y: ch.y - cy - 6, r: 18, color: '#ffe08a', a: 0.5 }); }
      else if (e.bete) { const tr = e.tr, im = I.oeuvres.bete(e.bete, true), bx = Math.round(tr[0] - cx), by = Math.round(tr[1] - cy - im.height - 1 + Math.sin(t * 3) * 1.2); if (tr[2] === 2) { c.save(); c.translate(bx, 0); c.scale(-1, 1); c.drawImage(im, -Math.round(im.width / 2), by); c.restore(); } else c.drawImage(im, bx - Math.round(im.width / 2), by); c.globalAlpha = 1; lights.push({ x: bx, y: by + 6, r: 24, color: (I.sagas.coeur.animaux[e.bete] || {}).couleur || '#ffe9a8', a: 0.7 }); }
      else if (e.fol) { const tr = e.tr, mv = W.player.moving, pf = (W.player.parcours || 0) - e.fol * ECART, sh = W.sheets[e.fol]; if (mv && W.player.court) { const su = W._suit || (W._suit = {}); poudre(su[e.fol] || (su[e.fol] = {}), sh, tr[0], tr[1], tr[2], pf); } drawChar(c, sh, tr[0] - cx, tr[1] - cy, tr[2], mv, t + e.fol * 0.13, null, W.pose[e.fol] || (I.oeuvres.afflicted(W.party[e.fol]) ? 'accable' : null), null, W.player.court, pf); /* les suiveurs courent quand le meneur court : la même foulée, à leur place sur son chemin */ lights.push({ x: tr[0] - cx, y: tr[1] - cy - 14, r: 22, color: (lueur(W.saga.heroes[W.party[e.fol]].look) || '#ffe9a8'), a: 0.4 }); }
      else if (e.p) { const p = W.player;
        if (G.D > 1 && p.moving && !G.low && POUSSIERE[m.g0 ? m.g0(p.x, p.y) : ''] && Math.random() < 0.3) G.spawn({ x: p.x - cx + (Math.random() - 0.5) * 6, y: p.y - cy + 1, vx: (Math.random() - 0.5) * 10, vy: -4 - Math.random() * 5, life: 0.5 + Math.random() * 0.3, size: 0.6 + Math.random() * 0.5, color: POUSSIERE[m.g0(p.x, p.y)], a: 0.3, type: 'mote', blend: 'source-over' }); // la poussière sous les pas
        const rg = I.rodeurs && I.rodeurs.geste, tau = rg ? W.t - rg.t : -1, gt = rg && D.GEAR_TYPES[rg.type];   // celui qui mène frappe : l'élan, le coup, l'arme en main (s'il repart, le geste s'efface après le coup)
        const frappe = rg && tau >= 0 && tau < (p.moving ? G.FRAPPE.elan + G.FRAPPE.balai : G.dureeFrappe) ? { anim: (gt && gt.anim) || 'geste', port: (rg.port !== undefined ? rg.port : gt && gt.port) || null, tau } : null;
        if (p.moving && p.court) poudre(p, W.sheets[0], p.x, p.y, p.dir, p.parcours || 0);
        drawChar(c, W.sheets[0], p.x - cx, p.y - cy, p.dir, p.moving, t, null, W.pose[0] || (rg && tau >= 0 && tau < 0.2 ? 'resolu' : null) || (I.oeuvres.afflicted(W.party[0]) && !S.busy && W.t % 9 > 6.5 ? 'accable' : null), frappe, p.court, p.parcours || 0); const lk = W.saga.heroes[W.party[0]].look; if (D.DE_2084.indexOf(lk.kind) < 0) lights.push({ x: p.x - cx, y: p.y - cy - 14, r: 30, color: lueur(lk) || '#ffe9a8', a: 0.6 }); else lights.push({ x: p.x - cx, y: p.y - cy - 12, r: 22, color: '#39e6ff', a: 0.35 }); }
    }
    // marqueurs au-dessus des cibles + flèche de bord d'écran
    if (tg) {
      const sx = tg.x - cx, sy = tg.y - cy;
      if (tg.kind !== 'goto' && sx > 0 && sx < G.PW && sy > 0 && sy < G.PH) { const by = sy + Math.sin(t * 5) * 2; c.fillStyle = '#ffe08a'; c.beginPath(); c.moveTo(sx, by + 4); c.lineTo(sx - 4, by - 2); c.lineTo(sx, by - 6); c.lineTo(sx + 4, by - 2); c.fill(); c.fillStyle = '#fff6dc'; c.fillRect(sx - 1, by - 3, 2, 3); }
      const v0 = G.view.x, v1 = G.view.x + G.view.w, w0 = G.view.y, w1 = G.view.y + G.view.h, zq = (I.ui && I.ui.Z) || 1; // ce que l'on voit de l'image (elle peut être agrandie)
      if (sx < v0 + 6 || sx > v1 - 6 || sy < w0 + 6 || sy > w1 - 6) {
        const ang = Math.atan2(sy - (w0 + w1) / 2, sx - (v0 + v1) / 2), ex = I.clamp(sx, v0 + 12 / zq, v1 - 12 / zq), ey = I.clamp(sy, w0 + 22 / zq, w1 - 12 / zq), pu = (1 + Math.sin(t * 6) * 0.2) / Math.sqrt(zq);
        c.save(); c.translate(ex, ey); c.rotate(ang); c.scale(pu, pu); c.rotate(-ang + t * 0.6); const star = (r, col) => { c.fillStyle = col; c.beginPath(); for (let q = 0; q < 8; q++) { const rr = q % 2 ? r * 0.3 : r, aa = q * Math.PI / 4; c.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } c.closePath(); c.fill(); }; star(8, '#1a1420'); star(6.5, '#ffe9a8'); star(2.5, '#fff'); c.restore(); lights.push({ x: ex, y: ey, r: 16, color: '#ffe9a8', a: 0.7 });
      }
    }
    // bulle « parler » au-dessus du personnage à portée
    if (!S.busy && !W.lock) {
      const p = W.player, px = p.x + [0, -1, 1, 0][p.dir] * 12, py = p.y + [1, 0, 0, -1][p.dir] * 12; let best = null, bd = 22;
      W.npcs.forEach(n => { if (n.hidden || n.map !== m.id || !n.placed) return; const d = Math.hypot(n.x - px, n.y - py); if (d < bd) { bd = d; best = n; } });
      if (!best) { const ch = W.chests.find(ch => !ch.open && ch.map === m.id && ch.placed && Math.hypot(ch.x - px, ch.y - py) < 18); if (ch) best = { x: ch.x, y: ch.y + 12 }; }
      if (!best && (W.nearPrayer() || (I.trade && I.trade.near()))) best = { x: p.x, y: p.y + 6 };
      if (!best && I.rodeurs && m.env.dedale && I.rodeurs.faceAPorte()) best = { x: p.x, y: p.y + 6 }; // la porte interdite : on peut la désigner (la bulle au-dessus de celui qui mène, comme sur la natte)
      if (best && !(tg && tg.kind === 'talk' && Math.abs(tg.x - best.x) < 2)) { const bx = Math.round(best.x - cx), by = Math.round(best.y - cy - 34 + Math.sin(t * 5) * 1.5); c.fillStyle = '#1a1420'; c.fillRect(bx - 7, by - 1, 14, 9); c.fillStyle = '#fff6dc'; c.fillRect(bx - 6, by, 12, 7); c.fillRect(bx - 1, by + 7, 2, 2); c.fillStyle = '#1a1420'; c.fillRect(bx - 4, by + 3, 2, 2); c.fillRect(bx - 1, by + 3, 2, 2); c.fillRect(bx + 2, by + 3, 2, 2); }
    }
    for (const pp of W.prayerPts()) { const px2 = pp[0] * T + 8 - cx, py2 = pp[1] * T + 8 - cy; if (px2 > -30 && py2 > -30 && px2 < G.PW + 30 && py2 < G.PH + 30) {
      // étoile à huit branches en lumière : deux carrés qui tournent en sens contraires
      const sq = (rot, r, col) => { c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); for (let i = 0; i < 4; i++) { const a = rot + i * Math.PI / 2, X = px2 + Math.cos(a) * r, Y = py2 + 4 + Math.sin(a) * r * 0.62; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); } c.closePath(); c.stroke(); };
      sq(t * 0.45, 11, 'rgba(255,236,170,.9)'); sq(-t * 0.45 + Math.PI / 4, 11, 'rgba(255,236,170,.9)'); sq(t * 0.3 + 0.4, 6, 'rgba(130,225,235,.75)'); lights.push({ x: px2, y: py2, r: 30 + Math.sin(t * 2) * 3, color: '#fff3c8', a: 0.55 }); if (Math.random() < 0.06) G.spawn({ x: px2 + (Math.random() - 0.5) * 16, y: py2 + 4, vy: -10, life: 1.6, size: 0.6, color: '#fff3c8', type: 'mote' }); } }
    // lumières de la carte
    const la = env.lightA === undefined ? 1 : env.lightA;
    if (la > 0) for (const L of m.lights) { const x = L.x - cx, y = L.y - cy; if (x < -L.r || y < -L.r || x > G.PW + L.r || y > G.PH + L.r) continue; lights.push({ x, y, r: L.r, color: L.color, a: la * (1 - L.flicker * (0.5 + 0.5 * Math.sin(t * 9 + L.x))) }); }
    // mini-carte (hors dialogue)
    if (!S.busy && m.mini) {
      // le plan : dans le coin de ce que l'on voit ; quand l'image est agrandie, il ne grossit que d'un quart sur un écran en
      // hauteur (il y est seul dans son coin) et pas du tout en largeur, où le pouce passe à côté pour marcher (q : son échelle)
      const V = G.view, Zm = (I.ui && I.ui.Z) || 1, haut = I.ui && I.ui.zoom, q = Math.min(1, (haut ? 1.25 : 1) / Zm), mw = m.w * q, mh = m.h * q, crop = V.w < G.PW || V.h < G.PH;
      const mx = !crop ? G.PW - mw - 8 : haut ? V.x + 5 / Zm : V.x + V.w - mw - 8 / Zm, my = !crop ? 27 : V.y + (haut ? 5 : 27) / Zm, b2 = 2 * q;
      c.globalAlpha = 0.82; W.miniRect = [mx - b2, my - b2, mw + 2 * b2, mh + 2 * b2]; c.fillStyle = 'rgba(8,6,16,.55)'; c.fillRect(mx - b2, my - b2, mw + 2 * b2, mh + 2 * b2); c.drawImage(m.mini, mx, my, mw, mh); c.globalAlpha = 1;
      c.strokeStyle = 'rgba(233,200,119,.6)'; c.lineWidth = q; c.strokeRect(mx - 1.5 * q, my - 1.5 * q, mw + 3 * q, mh + 3 * q);
      if (tg && Math.floor(t * 3) % 2) { c.fillStyle = '#ffe08a'; c.fillRect(mx + (Math.floor(tg.x / T) - 1) * q, my + (Math.floor((tg.kind === 'goto' ? tg.y : tg.y + 28) / T) - 1) * q, 3 * q, 3 * q); }
      W.foes.forEach(f => { if (!f.done && f.map === m.id && f.placed) { c.fillStyle = '#ff6a8a'; c.fillRect(mx + Math.floor(f.x / T) * q, my + Math.floor(f.y / T) * q, q, q); } });
      if (I.rodeurs && m.env.dedale && I.rodeurs.porteVue()) { const pi = I.rodeurs.interdite(); I.rodeurs.signe(c, mx + (pi.porte[0] + 0.5) * q, my + (pi.porte[1] + 0.5) * q, 2.2 * q); } // 2.x : la porte interdite, vue de près
      c.fillStyle = Math.floor(t * 4) % 2 ? '#fff' : '#ffe08a'; c.fillRect(mx + (Math.floor(W.player.x / T) - 1) * q, my + (Math.floor(W.player.y / T) - 1) * q, 3 * q, 3 * q);
    } else W.miniRect = null;
    return { ambient: env.ambient, lights, grade: env.grade, rays: env.rays, scan: env.scan, bloom: env.bloom, tint: W.tint, clouds: env.clouds ? { x: cx, y: cy } : null };
  };
})();
