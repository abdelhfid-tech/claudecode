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
    const h = { id, def, lvl: sv.lvl, xp: sv.xp, sakina: 0, niyya: 0 };
    const st = I.calc.hero(def, h.lvl); h.hp = st.hp; h.sp = st.sp;
    return (W.roster[id] = h);
  };
  W.persistHeroes = function () { for (const id in W.roster) { const h = W.roster[id]; I.save.data.heroes[W.saga.id + ':' + id] = { lvl: h.lvl, xp: h.xp }; } };
  W.ensureLevel = function (h) { if (h.lvl < W.minLvl) { h.lvl = W.minLvl; h.xp = 0; const st = I.calc.hero(h.def, h.lvl); h.hp = st.hp; h.sp = st.sp; } };
  W.healAll = function () { W.party.forEach(id => { const h = W.hero(id), st = I.calc.hero(h.def, h.lvl); h.hp = st.hp; h.sp = st.sp; }); };
  W.gainSakina = function (v) { W.party.forEach(id => { const h = W.hero(id); h.sakina = Math.min(100, h.sakina + v); }); };
  W.join = function (id) {
    if (W.party.includes(id) || !W.saga.heroes[id]) return;
    if (W.party.length >= 3) return;
    W.party.push(id); const h = W.hero(id); W.ensureLevel(h);
    const lead = W.hero(W.party[0]); if (lead && h.lvl < lead.lvl - 1) { h.lvl = lead.lvl - 1; const st = I.calc.hero(h.def, h.lvl); h.hp = st.hp; h.sp = st.sp; }
    W.refreshSheets(); S.toast(`<b>${h.def.name}</b> rejoint le groupe.`); I.audio.sfx('ok');
  };
  W.leave = function (id) { const i = W.party.indexOf(id); if (i < 0 || W.party.length <= 1) return; W.party.splice(i, 1); W.refreshSheets(); };
  function lookOf(def) { return Object.assign({ kind: 'compagnon' }, def.look); }
  W.refreshSheets = function () { W.sheets = W.party.map(id => G.charSheet(lookOf(W.saga.heroes[id]))); };

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
    if (P[name] !== was) { S.toast(`Pilier · <b>${def.name}</b> ${d > 0 ? '▲' : '▼'} <span class="pl">${def.glyph} ${P[name]}</span>`, 2800); I.audio.sfx(d > 0 ? 'light' : 'dark'); }
  };
  const PRAY_LINES = {
    fajr: ['Avant le jour, ils se rangèrent, épaule contre épaule. Puis la lumière vint, comme une réponse.', 'L’aube n’était encore qu’un fil. Ils prièrent, et le jour eut un commencement.'],
    dhuhr: ['Au plus haut du soleil, ils posèrent ce qu’ils portaient. Rien ne pressait plus que cela.', 'Midi. La ville se tut le temps d’une prière, et chacun retrouva sa place.'],
    asr: ['L’ombre s’allongeait. Ils prièrent, et la journée retrouva sa mesure.'],
    maghrib: ['Le soleil toucha la terre. Ils prièrent, et le vacarme du jour retomba.'],
    isha: ['La nuit était entière. Ils prièrent, et le silence cessa d’être vide.', 'Dernière prière. Ce qui restait à décider attendrait le matin, et s’en trouverait mieux.']
  };
  W.pray = async function (moment) {
    const env = W.map ? W.map.env : {}, m = moment || ({ dawn: 'fajr', day: 'dhuhr', dusk: 'maghrib', night: 'isha' })[env.time] || 'isha';
    S.depth++;
    try {
      S.hideDialog(); await S.fade('out', 600); I.audio.sfx('light');
      const fz = $('#fade'); fz.style.transition = 'none'; fz.style.opacity = 0; // le carton prend le relais du fondu
      await S.card('pray', `<div class="orn">◠</div><p class="small">${D.PRAYERS[m]}</p><h1>La prière</h1><p>${I.pick(PRAY_LINES[m])}</p><p class="small">Le groupe est reposé · Sakîna</p><div class="hint">▼</div>`, 6500);
      W.healAll(); W.gainSakina(35); S.flags._prayed = true;
      if (!S.flags._prayPillar) { S.flags._prayPillar = true; W.pillar('priere', 1); }
      if (W.map) W.checkpoint();
    } finally { S.depth--; S.hideDialog(); }
  };
  W.nearPrayer = function () { const m = W.map, sp = m && m.spots.priere; if (!sp) return false; return Math.hypot(sp[0] * T + 8 - W.player.x, sp[1] * T + 13 - W.player.y) < 26; };

  /* ----- cartes ----- */
  W.loadMap = function (id, opts, spot) {
    opts = opts || {}; const key = id + JSON.stringify(opts);
    W.map = mapCache[key] || (mapCache[key] = I.maps.build(id, opts)); W.mapOpts = opts;
    const ks = Object.keys(mapCache); if (ks.length > 4) ks.filter(k2 => k2 !== key).slice(0, ks.length - 4).forEach(k2 => { delete mapCache[k2]; });
    const env = W.map.env; G.clearParts(); G.amb = { kind: env.particles, rate: env.rate, hue: env.hue, n: 0 };
    I.audio.amb(env.sound || 'vent'); I.audio.music(env.music || 'silence');
    W.npcs.forEach(n => { if (n.map === id) W.place(n); });
    W.foes.forEach(f => { if (f.map === id && !f.placed) { const p = W.resolve(f.at, id, f); if (p) { f.x = p[0]; f.y = p[1]; f.placed = true; } } });
    W.chests.forEach(c => { if (c.map === id && !c.placed) { const p = W.resolve(c.at, id, c); if (p) { c.x = p[0]; c.y = p[1]; c.placed = true; } } });
    if (spot) { const p = Array.isArray(spot) && typeof spot[0] === 'number' ? spot : W.resolve(spot, id, W.player); W.player.x = p[0]; W.player.y = p[1]; }
    W.resetTrail(); W.tint = null; W.updateCam(true);
    document.body.dataset.theme = (id === 'noos' || id === 'cite' || id === 'archives') ? 'cyber' : (id === 'romaine' || id === 'palais') ? 'roman' : 'orient';
  };
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
      const x = tx * T + 8, y = ty * T + 13; if (self !== W.player && occupied(x, y, self)) continue;
      return [x, y];
    }
    return [tx0 * T + 8, ty0 * T + 13];
  };
  W.place = function (e) { if (e.map !== W.map.id) return; if (e.placed && e.placedMap === W.map.id) return; const p = W.resolve(e.at, e.map, e); if (p) { e.x = p[0]; e.y = p[1]; e.placed = true; e.placedMap = W.map.id; } };
  W.ent = function (id) { return id === 'hero' ? W.player : W.npcs.find(n => n.id === id); };
  W.resetTrail = function () { W.trail = []; for (let i = 0; i < 60; i++) W.trail.push([W.player.x, W.player.y, W.player.dir]); };
  W.walkTo = async function (e, x, y) {
    if (e !== W.player && e.map !== W.map.id) { e.x = x; e.y = y; return; }
    const dx = x - e.x, dy = y - e.y, dist = Math.hypot(dx, dy); if (dist < 2) return;
    e.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); e.moving = true; e.scripted = true;
    const dur = dist / 70 * 1000 / I.speed, t0 = performance.now(), x0 = e.x, y0 = e.y;
    await new Promise(res => { (function step() { const f = Math.min(1, (performance.now() - t0) / dur); e.x = x0 + dx * f; e.y = y0 + dy * f; if (e === W.player) pushTrail(); if (f < 1) requestAnimationFrame(step); else res(); })(); });
    e.moving = false; e.scripted = false;
  };
  function pushTrail() { W.trail.unshift([W.player.x, W.player.y, W.player.dir]); if (W.trail.length > 64) W.trail.pop(); }
  W.updateCam = function (snap) {
    const m = W.map, mw = m.w * T, mh = m.h * T;
    let cx = mw <= G.PW ? (mw - G.PW) / 2 : I.clamp(W.player.x - G.PW / 2, 0, mw - G.PW);
    let cy = mh <= G.PH ? (mh - G.PH) / 2 : I.clamp(W.player.y - G.PH / 2 - 8, 0, mh - G.PH);
    if (snap) { W.cam.x = cx; W.cam.y = cy; } else { W.cam.x += (cx - W.cam.x) * 0.14; W.cam.y += (cy - W.cam.y) * 0.14; }
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
    if (!cp) { delete S.flags._prayed; delete S.flags._prayPillar; }
    W.party = (cp ? cp.party : ch.party).slice(); W.party.forEach(id => W.ensureLevel(W.hero(id))); W.healAll(); W.refreshSheets();
    W.npcs = (ch.npcs || []).map(n => { const def = n.hero && saga.heroes[n.hero]; const look = def ? lookOf(def) : Object.assign({ kind: 'homme', robe: '#8a7355', head: '#e6dcc4' }, n.look); return Object.assign({}, n, { map: n.map || ch.map, hidden: !!n.hidden, placed: false, dir: 0, sheet: G.charSheet(look), aura: def ? (def.look.aura || '#ffe9a8') : (look.kind === 'compagnon' ? '#ffe9a8' : null) }); });
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
    W.loadMap(cp ? cp.map : ch.map, cp ? cp.opts : (ch.opts || {}), cp ? cp.pos : ch.start);
    if (cp) W.npcs.forEach(n => { const s = cp.npcs && cp.npcs[n.id]; if (s && s.x !== undefined && n.map === W.map.id) { n.x = s.x; n.y = s.y; n.placed = true; n.placedMap = W.map.id; } });
    W.player.dir = 0; W.hud(); $('#hud').hidden = false;
    S.depth++; W.lock = false; // verrouille le déplacement pendant l'ouverture
    try {
      await S.fade('in', 500);
      if (!cp) { W.checkpoint(); await S.run(ch.intro || [['title', ch.title, ch.sub]]); }
      if (saga.frame && ci === 0) S.toast(document.body.classList.contains('touch') ? 'Croix : marcher · <b>OK</b> : parler, valider · <b>MENU</b> : halte' : '<b>Flèches</b> ou <b>ZQSD</b> : marcher · <b>Entrée</b> : parler · <b>Échap</b> : menu', 9000);
      await W.advance();
    } finally { S.depth--; S.hideDialog(); }
  };
  W.hud = function () {
    const o = W.cur();
    $('#hud .chap').textContent = W.ch ? W.ch.title : '';
    const tm = W.map && ({ dawn: 'Fajr', day: 'Dhuhr', dusk: 'Maghrib', night: '’Ishâ' })[W.map.env.time];
    $('#hud .sub').textContent = (W.ch ? W.ch.sub : '') + (tm ? '  ·  ◠ ' + tm : '');
    const P = W.pillars(); $('#hud .pil').innerHTML = Object.keys(D.PILLARS).map(k => `<span title="${D.PILLARS[k].name}"><i>${D.PILLARS[k].glyph}</i>${P[k] || 0}</span>`).join('');
    $('#hud .obj').textContent = o && o.text ? o.text : '';
    $('#hud .obj').hidden = !(o && o.text);
  };
  W.checkpoint = function () {
    const npcs = {}; W.npcs.forEach(n => { npcs[n.id] = { h: n.hidden ? 1 : 0, x: n.placed && n.map === W.map.id ? Math.round(n.x) : undefined, y: n.placed && n.map === W.map.id ? Math.round(n.y) : undefined }; });
    I.save.data.cp = { saga: W.saga.id, ci: W.ci, obj: W.objIndex, map: W.map.id, opts: W.mapOpts, pos: [Math.round(W.player.x), Math.round(W.player.y)], party: W.party.slice(), npcs, foes: W.foes.filter(f => f.done).map(f => f.id), chests: W.chests.map((c, i) => c.open ? i : -1).filter(i => i >= 0), flags: S.flags };
    W.persistHeroes(); I.save.store();
  };
  // exécute les objectifs automatiques ; termine le chapitre s'il n'en reste plus
  W.advance = async function () {
    while (true) {
      const o = W.cur();
      if (!o) return W.endChapter();
      W.hud();
      if (o.foe) { const f = W.foes.find(f => f.id === o.foe); if (f && f.done) { await W.complete(true); continue; } }
      if (!o.auto) return;
      await W.complete(true);
    }
  };
  W.complete = async function (noAdvance) {
    const o = W.cur(); if (!o) return;
    S.depth++;
    try {
      if (!o.auto) { I.audio.sfx('light'); }
      if (o.then) await S.run(o.then);
      W.objIndex++; W.hud(); W.checkpoint();
    } finally { S.depth--; S.hideDialog(); }
    if (!noAdvance) await W.advance();
  };
  W.endChapter = async function () {
    const saga = W.saga, ch = W.ch, sv = I.save.data;
    S.depth++;
    try {
      if (ch.outro) await S.run(ch.outro);
      const sp = sv.sagas[saga.id]; sp.flags = S.flags; W.persistHeroes(); sv.cp = null;
      $('#hud').hidden = true;
      if (W.ci + 1 < saga.chapters.length && !(saga.frame && ch.last)) {
        sp.ch = Math.max(sp.ch, W.ci + 1); I.save.store();
        await S.fade('out', 500);
        S.depth--; try { await W.startChapter(saga.id, W.ci + 1); } finally { S.depth++; }
      } else {
        await S.fade('out', 600); I.setScene(I.ui.blank); G.clearParts(); G.amb = { kind: 'noos', rate: 6, hue: 40, n: 0 }; await S.fade('in', 400);
        if (saga.outro && (!saga.frame || W.ci === saga.chapters.length - 1)) await S.run(saga.outro);
        if (!saga.frame && sp.cTot) {
          const perfect = (sp.cOk || 0) === sp.cTot;
          if (perfect) { sv.items.siwak = (sv.items.siwak || 0) + 2; sv.items.musc = (sv.items.musc || 0) + 1; I.audio.sfx('roll'); }
          await S.card('victory', `<p class="small">Fidélité à la Chaîne · ${I.esc(saga.name)}</p><h1>${perfect ? 'Isnâd sahîh' : 'Chaîne transmise'}</h1><ul><li>Actes retrouvés du premier coup : <b>${sp.cOk || 0} / ${sp.cTot}</b></li>${perfect ? '<li>Chaîne sans faille : chaque acte fut celui que les transmetteurs ont rapporté.</li><li>Reçu : <b>Siwâk ×2</b>, <b>Musc</b></li>' : '<li>Là où la chaîne a vacillé, relis le codex : chaque acte y a sa source.</li>'}</ul><div class="hint">▼</div>`);
        }
        sp.done = true; sp.ch = saga.frame ? W.ci + 1 : 0; I.save.store();
        await I.ui.afterSaga(saga, ch);
      }
    } finally { S.depth--; S.hideDialog(); }
  };

  /* ----- interaction ----- */
  W.interact = async function () {
    if (S.busy || W.lock) return;
    const p = W.player, fx = [0, -1, 1, 0][p.dir], fy = [1, 0, 0, -1][p.dir];
    const px = p.x + fx * 12, py = p.y + fy * 12;
    let best = null, bd = 22;
    W.npcs.forEach(n => { if (n.hidden || n.map !== W.map.id || !n.placed) return; const d = Math.hypot(n.x - px, n.y - py); if (d < bd) { bd = d; best = n; } });
    const o0 = W.cur();
    if (o0 && o0.talk) { const n = W.npcs.find(n => n.id === o0.talk); if (n && !n.hidden && n.map === W.map.id && n.placed && (Math.hypot(n.x - px, n.y - py) < 27 || Math.hypot(n.x - p.x, n.y - p.y) < 24)) best = n; }
    if (best) {
      const dx = p.x - best.x, dy = p.y - best.y; best.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
      const o = W.cur();
      if (o && o.talk === best.id) return W.complete();
      if (best.talk) { I.audio.sfx('blip'); await S.run(best.talk); }
      return;
    }
    const c = W.chests.find(c => !c.open && c.map === W.map.id && c.placed && Math.hypot(c.x - px, c.y - py) < 18);
    if (c) { c.open = true; I.audio.sfx('door'); if (c.codex) { S.toast('Un feuillet. Tu le lis lentement.'); await S.run([['codex', c.codex]]); } else await S.run([['give', c.item, c.n || 1]]); W.checkpoint(); return; }
    if (W.nearPrayer()) {
      await S.run([['ask', 'Une natte tournée vers La Mecque. Faire halte pour la prière ?', [{ t: 'Prier', r: [['pray']] }, { t: 'Plus tard', r: [] }]]]);
    }
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
    if (a === 'ok') { W.interact(); return true; }
    if (a === 'menu' || a === 'cancel') { I.ui.pause(); return true; }
    return false;
  };
  W.update = function (dt) {
    W.t += dt; const p = W.player, h = I.input.held;
    const can = !S.busy && !W.lock && !I.ui.menuOpen;
    if (can && I.debug.auto && !W._autoBusy && !I.debug.walk) { W.autoStep(); W.updateCam(); return; }
    if (can && (W.solidAt(p.x - 4, p.y - 5) || W.solidAt(p.x + 4, p.y) || W.solidAt(p.x - 4, p.y) || W.solidAt(p.x + 4, p.y - 5))) { const q = W.resolve([null, 0, 0], W.map.id, p, [Math.floor(p.x / T), Math.floor((p.y - 2) / T)]); if (q) { p.x = q[0]; p.y = q[1]; W.resetTrail(); } }
    if (can) {
      let dx = (h.right ? 1 : 0) - (h.left ? 1 : 0), dy = (h.down ? 1 : 0) - (h.up ? 1 : 0);
      if (dx || dy) {
        const crowd = W.npcs.some(n => !n.hidden && n.map === W.map.id && n.placed && Math.abs(n.x - p.x) < 8 && Math.abs(n.y - p.y) < 6);
        const sp = 82 * dt * (dx && dy ? 0.7071 : 1) * (crowd ? 0.55 : 1);
        p.dir = dx < 0 ? 1 : dx > 0 ? 2 : dy < 0 ? 3 : 0;
        const tryMove = (mx, my) => {
          const nx = p.x + mx, ny = p.y + my;
          if (W.solidAt(nx - 4, ny - 5) || W.solidAt(nx + 4, ny - 5) || W.solidAt(nx - 4, ny) || W.solidAt(nx + 4, ny)) return false;
          p.x = nx; p.y = ny; return true;
        };
        const m1 = dx && tryMove(dx * sp, 0), m2 = dy && tryMove(0, dy * sp);
        p.moving = !!(m1 || m2); if (p.moving) { pushTrail(); if (Math.floor(W.t * 5) !== Math.floor((W.t - dt) * 5)) I.audio.sfx('step'); }
      } else p.moving = false;
      const o = W.cur();
      if (o && o.goto) { const s = W.spotPx(o.goto); if (s && Math.hypot(s[0] - p.x, s[1] - p.y) < 36) W.complete(); }
      for (const f of W.foes) {
        if (f.done || f.map !== W.map.id || !f.placed) continue;
        const d = Math.hypot(f.x - p.x, f.y - p.y);
        if (d < 15) { W.fight(f); break; }
        if (d < 72 && !f.boss) { const vx = (p.x - f.x) / d * 22 * dt, vy = (p.y - f.y) / d * 22 * dt; if (!W.solidAt(f.x + vx, f.y)) f.x += vx; if (!W.solidAt(f.x, f.y + vy)) f.y += vy; }
      }
    } else if (!p.scripted) p.moving = false;
    W.updateCam();
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
  W.pathTo = function (x0, y0, x1, y1) {
    const m = W.map, sx = Math.floor(x0 / 16), sy = Math.floor((y0 - 2) / 16), ex = Math.floor(x1 / 16), ey = Math.floor((y1 - 2) / 16);
    const prev = new Int32Array(m.w * m.h).fill(-1), q = [sy * m.w + sx]; prev[sy * m.w + sx] = sy * m.w + sx; let end = -1;
    while (q.length) { const i = q.shift(), x = i % m.w, y = (i - x) / m.w; if (Math.abs(x - ex) + Math.abs(y - ey) <= 1) { end = i; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) continue; const j = ny * m.w + nx; if (prev[j] >= 0 || m.solid[j]) continue; prev[j] = i; q.push(j); } }
    if (end < 0) return null; const path = []; for (let i = end; prev[i] !== i; i = prev[i]) path.unshift([(i % m.w) * 16 + 8, Math.floor(i / m.w) * 16 + 11]); return path;
  };
  W.walkStep = function () {
    const o = W.cur(), p = W.player, h = I.input.held, log = I.debug.log || (I.debug.log = []), st = W._walk || (W._walk = {});
    h.up = h.down = h.left = h.right = false; if (!o || o.auto) return;
    const key = W.saga.id + W.ch.id + W.objIndex + W.map.id;
    let tx, ty, kind = o.goto ? 'goto' : o.talk ? 'talk' : 'foe';
    if (o.goto) { const sp = W.spotPx(o.goto); if (!sp) return; tx = sp[0]; ty = sp[1]; }
    else if (o.talk) { const n = W.npcs.find(n => n.id === o.talk); if (!n || n.hidden || n.map !== W.map.id || !n.placed) { if (st.key !== key) { st.key = key; log.push(`PNJ ABSENT ${key} ${o.talk}`); } W.complete(); return; } tx = n.x; ty = n.y; }
    else { const f = W.foes.find(f => f.id === o.foe); if (!f || f.map !== W.map.id || !f.placed) { if (st.key !== key) { st.key = key; log.push(`FOE ABSENT ${key} ${o.foe}`); } if (f) f.done = true; W.complete(); return; } tx = f.x; ty = f.y; }
    if (st.key !== key) { st.key = key; st.path = W.pathTo(p.x, p.y, tx, ty); st.t = 0; st.best = 1e9; st.stall = 0; if (!st.path) { log.push(`SANS CHEMIN ${key} ${kind}`); } }
    st.t++;
    const d = Math.hypot(tx - p.x, ty - p.y);
    if (kind === 'talk' && d < 26) { const dx = tx - p.x, dy = ty - p.y; p.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); const before = W.objIndex; W.interact(); if (W.objIndex === before && !S.busy) { if (!st.miss) { st.miss = 1; } } return; }
    const prog = st.path ? st.path.length * 16 + (st.path.length ? Math.hypot(st.path[0][0] - p.x, st.path[0][1] - p.y) : d) : d;
    if (prog < st.best - 0.5) { st.best = prog; st.stall = 0; } else st.stall++;
    if (!st.path || st.stall > 300 || st.t > 30000) { log.push(`COINCÉ ${key} ${kind} à ${Math.round(d)} px (${st.path ? 'chemin trouvé' : 'aucun chemin'})`); p.x = tx; p.y = ty + (kind === 'goto' ? 0 : 14); W.resetTrail(); st.key = null; if (kind === 'talk') W.complete(); return; }
    while (st.path.length > 1 && Math.hypot(st.path[0][0] - p.x, st.path[0][1] - p.y) < 3) st.path.shift();
    const wp = st.path.length ? st.path[0] : [tx, ty], wx = st.path.length > 1 || kind !== 'goto' ? wp[0] : tx, wy = st.path.length > 1 || kind !== 'goto' ? wp[1] : ty;
    if (st.path.length <= 1 && Math.hypot(wp[0] - p.x, wp[1] - p.y) < 3) { st.path = [[tx, ty]]; }
    const ddx = wx - p.x, ddy = wy - p.y; if (ddx > 1.2) h.right = true; else if (ddx < -1.2) h.left = true; if (ddy > 1.2) h.down = true; else if (ddy < -1.2) h.up = true;
  };
  W.autoStep = function () {
    const o = W.cur(); if (!o) return; const p = W.player, log = I.debug.log || (I.debug.log = []);
    if (W.map.spots.priere && !S.flags._prayed && !W._autoBusy) { W._autoBusy = true; W.pray().then(() => { W._autoBusy = false; }, e => { log.push('ERR prière ' + e.message); W._autoBusy = false; }); return; }
    const go = (x, y, what) => { if (!W.reach(p.x, p.y, x, y)) log.push(`INACCESSIBLE ${W.saga.id}/${W.ch.id} obj${W.objIndex} ${what} sur ${W.map.id}`); p.x = x; p.y = y; W.resetTrail(); };
    W._autoBusy = true; const done = () => { W._autoBusy = false; };
    if (o.goto) { const s = W.resolve(o.goto, W.map.id, p); go(s[0], s[1], 'goto ' + o.goto); W.complete().then(done, e => { log.push('ERR ' + e.message); done(); }); }
    else if (o.talk) { const n = W.npcs.find(n => n.id === o.talk); if (!n || n.hidden || n.map !== W.map.id || !n.placed) { log.push(`PNJ ABSENT ${W.saga.id}/${W.ch.id} obj${W.objIndex} talk ${o.talk} (carte ${W.map.id}, pnj ${n ? n.map + (n.hidden ? ' caché' : '') : '?'})`); } else go(n.x, n.y + 14, 'talk ' + o.talk); W.complete().then(done, e => { log.push('ERR ' + e.message); done(); }); }
    else if (o.foe) { const f = W.foes.find(f => f.id === o.foe); if (!f || f.map !== W.map.id || !f.placed) { log.push(`FOE ABSENT ${W.saga.id}/${W.ch.id} obj${W.objIndex} foe ${o.foe} (carte ${W.map.id})`); if (f) f.done = true; W.complete().then(done, done); } else { go(f.x, f.y + 14, 'foe ' + o.foe); W.fight(f).then(done, e => { log.push('ERR ' + e.message); done(); }); } }
    else done();
  };
  W.spotPx = function (at) { const m = W.map, name = Array.isArray(at) ? at[0] : at, s = m.spots[name]; if (!s) return null; return [(s[0] + (Array.isArray(at) ? at[1] : 0)) * T + 8, (s[1] + (Array.isArray(at) ? at[2] : 0)) * T + 13]; };
  W.target = function () {
    const o = W.cur(); if (!o) return null;
    if (o.goto) { const s = W.spotPx(o.goto); return s && { x: s[0], y: s[1], kind: 'goto' }; }
    if (o.talk) { const n = W.npcs.find(n => n.id === o.talk); return n && !n.hidden && n.map === W.map.id && n.placed ? { x: n.x, y: n.y - 26, kind: 'talk' } : null; }
    if (o.foe) { const f = W.foes.find(f => f.id === o.foe); return f && !f.done && f.map === W.map.id && f.placed ? { x: f.x, y: f.y - 30, kind: 'foe' } : null; }
    return null;
  };

  /* ----- rendu ----- */
  function drawChar(c, sheet, x, y, dir, moving, t, aura) {
    const f = moving ? [1, 0, 2, 0][Math.floor(t * 8) % 4] : 0;
    c.fillStyle = 'rgba(20,12,30,.32)'; c.beginPath(); c.ellipse(Math.round(x), Math.round(y) + 1, 6, 2.5, 0, 0, 6.3); c.fill();
    c.drawImage(sheet, f * 16, dir * 24, 16, 24, Math.round(x) - 8, Math.round(y) - 22 - (moving && f ? 1 : 0), 16, 24);
  }
  W.drawChar = drawChar;
  function drawFlame(c, x, y, t, big) {
    const n = big ? 7 : 5; for (let i = 0; i < n; i++) { const hgt = 3 + ((Math.sin(t * 13 + i * 2.1) + 1) * (big ? 4 : 3)) | 0; c.fillStyle = i % 2 ? '#ffb347' : '#ff7a2a'; c.fillRect(x - n + i * 2, y - hgt, 2, hgt); c.fillStyle = '#fff0a8'; c.fillRect(x - n + i * 2, y - Math.max(1, hgt - 3), 1, Math.max(1, hgt - 3)); }
  }
  W.render = function (dt) {
    const c = G.px, m = W.map, cx = Math.round(W.cam.x), cy = Math.round(W.cam.y), t = W.t, env = m.env;
    c.fillStyle = env.time === 'noos' ? '#04051a' : '#0a0810'; c.fillRect(0, 0, G.PW, G.PH);
    c.drawImage(m.canvas, -cx, -cy);
    // eau animée
    const fr = Math.floor(t * 2.2) % 4;
    for (const a of m.anim) { const x = a.x * T - cx, y = a.y * T - cy; if (x < -16 || y < -16 || x > G.PW || y > G.PH) continue; c.drawImage(G.tile(a.n, (a.x + a.y + fr) % 4, 0), x, y); }
    // marqueur d'objectif au sol
    const tg = W.target();
    if (tg && tg.kind === 'goto') { const rr = 9 + Math.sin(t * 4) * 2; c.strokeStyle = 'rgba(255,224,138,.9)'; c.lineWidth = 1; c.beginPath(); c.ellipse(tg.x - cx, tg.y - cy, rr, rr * 0.45, 0, 0, 6.3); c.stroke(); c.fillStyle = 'rgba(255,224,138,.25)'; c.fill(); if (Math.random() < 0.3) G.spawn({ x: tg.x - cx + (Math.random() - 0.5) * 14, y: tg.y - cy, vy: -18, life: 1.2, size: 0.7, color: '#ffe08a', type: 'mote' }); }
    // éléments triés par profondeur
    const list = [];
    for (const o of m.objs) { if (o.x + o.w < cx || o.x - o.w > cx + G.PW || o.y < cy - 4 || o.y - o.h > cy + G.PH) continue; list.push({ y: o.y, o }); }
    W.npcs.forEach(n => { if (!n.hidden && n.map === m.id && n.placed) list.push({ y: n.y, n }); });
    W.foes.forEach(f => { if (!f.done && f.map === m.id && f.placed) list.push({ y: f.y, f }); });
    W.chests.forEach(ch => { if (ch.map === m.id && ch.placed) list.push({ y: ch.y, ch }); });
    for (let i = W.party.length - 1; i >= 1; i--) { const tr = W.trail[Math.min(W.trail.length - 1, i * 13)]; if (tr) list.push({ y: tr[1] - 0.1, fol: i, tr }); }
    list.push({ y: W.player.y, p: true });
    list.sort((a, b) => a.y - b.y);
    const lights = [];
    for (const e of list) {
      if (e.o) { const o = e.o; c.drawImage(G.obj(o.type, o.opt, o.seed), Math.round(o.x - o.w / 2) - cx, o.y - o.h + 1 - cy); if (o.anim) drawFlame(c, o.x - cx, o.y - cy - (o.type === 'brazier' ? 10 : 3), t + o.seed, o.type === 'fire'); }
      else if (e.n) { const n = e.n; drawChar(c, n.sheet, n.x - cx, n.y - cy, n.dir, n.moving, t, n.aura); if (n.aura) lights.push({ x: n.x - cx, y: n.y - cy - 14, r: 26, color: n.aura, a: 0.5 }); }
      else if (e.f) { const f = e.f, d = W.saga.enemies[f.group[0]], spr = G.enemy(d.art, d.hue, 1, 0), bob = Math.sin(t * 2.4 + f.ph) * 2.5, s = f.boss ? 34 : 26; c.fillStyle = 'rgba(20,12,30,.3)'; c.beginPath(); c.ellipse(f.x - cx, f.y - cy + 1, 8, 3, 0, 0, 6.3); c.fill(); c.globalAlpha = 0.86 + Math.sin(t * 5 + f.ph) * 0.12; c.drawImage(spr, f.x - cx - s / 2, f.y - cy - s - 3 + bob, s, s); c.globalAlpha = 1; lights.push({ x: f.x - cx, y: f.y - cy - 14, r: 40, color: `hsl(${d.hue},90%,60%)`, a: 0.8 }); if (Math.random() < 0.15) G.spawn({ x: f.x - cx + (Math.random() - 0.5) * 16, y: f.y - cy - 8, vy: -14, vx: (Math.random() - 0.5) * 8, life: 1, size: 0.8, color: `hsl(${d.hue},100%,70%)`, type: 'glyph' }); }
      else if (e.ch) { const ch = e.ch; c.drawImage(G.obj('chest', { open: ch.open }), Math.round(ch.x) - 7 - cx, Math.round(ch.y) - 11 - cy); if (!ch.open) lights.push({ x: ch.x - cx, y: ch.y - cy - 6, r: 18, color: '#ffe08a', a: 0.5 }); }
      else if (e.fol) { const tr = e.tr, mv = W.player.moving; drawChar(c, W.sheets[e.fol], tr[0] - cx, tr[1] - cy, tr[2], mv, t + e.fol * 0.13); lights.push({ x: tr[0] - cx, y: tr[1] - cy - 14, r: 22, color: (W.saga.heroes[W.party[e.fol]].look.aura || '#ffe9a8'), a: 0.4 }); }
      else if (e.p) { const p = W.player; drawChar(c, W.sheets[0], p.x - cx, p.y - cy, p.dir, p.moving, t); const lk = W.saga.heroes[W.party[0]].look; if (lk.kind !== 'cyber') lights.push({ x: p.x - cx, y: p.y - cy - 14, r: 30, color: lk.aura || '#ffe9a8', a: 0.6 }); else lights.push({ x: p.x - cx, y: p.y - cy - 12, r: 22, color: '#39e6ff', a: 0.35 }); }
    }
    // marqueurs au-dessus des cibles + flèche de bord d'écran
    if (tg) {
      const sx = tg.x - cx, sy = tg.y - cy;
      if (tg.kind !== 'goto' && sx > 0 && sx < G.PW && sy > 0 && sy < G.PH) { const by = sy + Math.sin(t * 5) * 2; c.fillStyle = '#ffe08a'; c.beginPath(); c.moveTo(sx, by + 4); c.lineTo(sx - 4, by - 2); c.lineTo(sx, by - 6); c.lineTo(sx + 4, by - 2); c.fill(); c.fillStyle = '#fff6dc'; c.fillRect(sx - 1, by - 3, 2, 3); }
      if (sx < 6 || sx > G.PW - 6 || sy < 6 || sy > G.PH - 6) {
        const ang = Math.atan2(sy - G.PH / 2, sx - G.PW / 2), ex = I.clamp(sx, 12, G.PW - 12), ey = I.clamp(sy, 22, G.PH - 12), pu = 1 + Math.sin(t * 6) * 0.2;
        c.save(); c.translate(ex, ey); c.rotate(ang); c.scale(pu, pu); c.fillStyle = '#1a1420'; c.beginPath(); c.moveTo(7, 0); c.lineTo(-5, -6); c.lineTo(-5, 6); c.fill(); c.fillStyle = '#ffe08a'; c.beginPath(); c.moveTo(5, 0); c.lineTo(-4, -4); c.lineTo(-4, 4); c.fill(); c.restore();
      }
    }
    // bulle « parler » au-dessus du personnage à portée
    if (!S.busy && !W.lock) {
      const p = W.player, px = p.x + [0, -1, 1, 0][p.dir] * 12, py = p.y + [1, 0, 0, -1][p.dir] * 12; let best = null, bd = 22;
      W.npcs.forEach(n => { if (n.hidden || n.map !== m.id || !n.placed) return; const d = Math.hypot(n.x - px, n.y - py); if (d < bd) { bd = d; best = n; } });
      if (!best) { const ch = W.chests.find(ch => !ch.open && ch.map === m.id && ch.placed && Math.hypot(ch.x - px, ch.y - py) < 18); if (ch) best = { x: ch.x, y: ch.y + 12 }; }
      if (!best && W.nearPrayer()) best = { x: p.x, y: p.y + 6 };
      if (best && !(tg && tg.kind === 'talk' && Math.abs(tg.x - best.x) < 2)) { const bx = Math.round(best.x - cx), by = Math.round(best.y - cy - 34 + Math.sin(t * 5) * 1.5); c.fillStyle = '#1a1420'; c.fillRect(bx - 7, by - 1, 14, 9); c.fillStyle = '#fff6dc'; c.fillRect(bx - 6, by, 12, 7); c.fillRect(bx - 1, by + 7, 2, 2); c.fillStyle = '#1a1420'; c.fillRect(bx - 4, by + 3, 2, 2); c.fillRect(bx - 1, by + 3, 2, 2); c.fillRect(bx + 2, by + 3, 2, 2); }
    }
    if (m.spots.priere) { const px2 = m.spots.priere[0] * T + 8 - cx, py2 = m.spots.priere[1] * T + 8 - cy; if (px2 > -30 && py2 > -30 && px2 < G.PW + 30 && py2 < G.PH + 30) { lights.push({ x: px2, y: py2, r: 30 + Math.sin(t * 2) * 3, color: '#fff3c8', a: 0.55 }); if (Math.random() < 0.06) G.spawn({ x: px2 + (Math.random() - 0.5) * 16, y: py2 + 4, vy: -10, life: 1.6, size: 0.6, color: '#fff3c8', type: 'mote' }); } }
    // lumières de la carte
    const la = env.lightA === undefined ? 1 : env.lightA;
    if (la > 0) for (const L of m.lights) { const x = L.x - cx, y = L.y - cy; if (x < -L.r || y < -L.r || x > G.PW + L.r || y > G.PH + L.r) continue; lights.push({ x, y, r: L.r, color: L.color, a: la * (1 - L.flicker * (0.5 + 0.5 * Math.sin(t * 9 + L.x))) }); }
    // mini-carte (hors dialogue)
    if (!S.busy && m.mini) {
      const mw = m.w, mh = m.h, mx = G.PW - mw - 30, my = 6; c.globalAlpha = 0.82; c.fillStyle = 'rgba(8,6,16,.55)'; c.fillRect(mx - 2, my - 2, mw + 4, mh + 4); c.drawImage(m.mini, mx, my); c.globalAlpha = 1;
      c.strokeStyle = 'rgba(233,200,119,.6)'; c.lineWidth = 1; c.strokeRect(mx - 1.5, my - 1.5, mw + 3, mh + 3);
      if (tg && Math.floor(t * 3) % 2) { c.fillStyle = '#ffe08a'; c.fillRect(mx + Math.floor(tg.x / T) - 1, my + Math.floor((tg.kind === 'goto' ? tg.y : tg.y + 28) / T) - 1, 3, 3); }
      W.foes.forEach(f => { if (!f.done && f.map === m.id && f.placed) { c.fillStyle = '#ff6a8a'; c.fillRect(mx + Math.floor(f.x / T), my + Math.floor(f.y / T), 1, 1); } });
      c.fillStyle = '#fff'; c.fillRect(mx + Math.floor(W.player.x / T) - 1, my + Math.floor(W.player.y / T) - 1, 2, 2);
    }
    return { ambient: env.ambient, lights, grade: env.grade, rays: env.rays, scan: env.scan, bloom: env.bloom, tint: W.tint, clouds: env.clouds ? { x: cx, y: cy } : null };
  };
})();
