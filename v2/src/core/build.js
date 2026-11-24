/* ISNAD — bâtir : récolter, poser des pièces case par case, fonder des mosquées, élever, cultiver. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, W = I.world, $ = I.$, T = 16;
  const Bd = I.build = { on: false, sel: 'tranchee' };
  // on bâtit à ciel ouvert : c'est le gabarit du lieu qui le dit (D.GABARITS). 2.29 : on ne bâtit pas dans une ville de passage —
  // 2.33 (D226) : sauf sur le chantier d'une demande des gens du lieu (entraide.js), où que soit la ville
  const visite = id => !!(D.MAPS[id] || {}).visite;
  Bd.outdoor = id => visite(id) ? !!(I.entraide && I.entraide.chantier(id)) : !!(D.gabarit(id) || {}).dehors;
  // 2.33 : ce qui est bâti dans une ville visitée y reste, d'un récit à l'autre ; ailleurs, c'est l'affaire du récit
  const cle = id => visite(id) ? 'visite:' + id : W.saga.id + ':' + id;
  const WATER = { well: 1, fountain: 1, basin: 1, spring: 1 };

  /* ----- réserves ----- */
  Bd.mats = function () { const sv = I.save.data; return sv.mats || (sv.mats = { eau: 2, pise: 0, palme: 0, pierre: 0, grain: 1, laine: 0 }); };
  Bd.give = function (k, n, quiet) { const m = Bd.mats(); m[k] = Math.max(0, (m[k] || 0) + n); if (!quiet) S.toast(`${n > 0 ? '+' : ''}${n} <b>${D.MATS[k].name}</b> <span class="pl">${D.MATS[k].g} ${m[k]}</span>`, 2200); Bd.refresh(); };
  Bd.peek = function (mapId) { const b = I.save.data.built; return (b && W.saga && b[cle(mapId)]) || null; };
  Bd.list = function () { const sv = I.save.data; sv.built = sv.built || {}; const k = cle(W.map.id); return sv.built[k] || (sv.built[k] = []); };
  Bd.sites = function () { const sv = I.save.data, sp = sv.sagas[W.saga.id] || (sv.sagas[W.saga.id] = { ch: 0, done: false, flags: {} }); return sp.sites || (sp.sites = {}); };
  Bd.count = function (id) { const l = Bd.peek(W.map.id) || []; return l.filter(e => e.t === id).length; };
  const afford = id => { const c = D.PIECES[id].cost, m = Bd.mats(); return Object.keys(c).every(k => (m[k] || 0) >= c[k]); };
  const costText = id => { const c = D.PIECES[id].cost, ks = Object.keys(c); return ks.length ? ks.map(k => I.t('{n} {min_mat}', { n: c[k], min_mat: D.MATS[k].name.toLowerCase(), mat: D.MATS[k].name })).join(I.t(', ')) : I.t('la peine de creuser'); };

  /* ----- pose d'une pièce sur une carte (sans coût) ----- */
  Bd.apply = function (e, m) {
    const p = D.PIECES[e.t]; if (!p) return; const i = e.y * m.w + e.x, c = m.canvas.getContext('2d');
    if (p.tile) { c.drawImage(G.tile(p.tile, (e.x * 7 + e.y * 13) % 4, 0), e.x * T, e.y * T); m.solid[i] = p.solid ? 1 : 0; if (e.t === 'tranchee') (m.trench || (m.trench = new Set())).add(i); }
    else if (p.decal) I.maps.drawRosette(c, { x: e.x * T + 8, y: e.y * T + 8, R: 15, n: 8 });
    else {
      const d = G.OBJ[p.obj], o = { type: p.obj, opt: undefined, x: e.x * T + 8, y: e.y * T + 15, w: d.w, h: d.h, flat: !!d.flat, built: true, seed: e.x * 31 + e.y };
      if (d.flat) c.drawImage(G.obj(o.type, o.opt, o.seed), Math.round(o.x - o.w / 2), o.y - o.h + 1); else m.objs.push(o);
      if (p.solid) m.solid[i] = 1;
      if (p.light) m.lights.push({ x: o.x, y: o.y - 18, r: 52, color: '#ffc878', flicker: 0.12 });
    }
    if (m.mini) { const mc = m.mini.getContext('2d'); mc.fillStyle = p.solid ? 'rgba(120,80,40,.95)' : 'rgba(230,200,120,.9)'; mc.fillRect(e.x, e.y, 1, 1); }
  };

  /* ----- règles ----- */
  Bd.target = function () { if (Bd.aim) return Bd.aim; const p = W.player; return [Math.floor(p.x / T) + [0, -1, 1, 0][p.dir], Math.floor((p.y - 3) / T) + [1, 0, 0, -1][p.dir]]; };
  Bd.eauPres = (tx, ty) => waterNear(tx, ty);   // (entraide.js : une oasis se trace près de l'eau)
  function waterNear(tx, ty) {
    const m = W.map;
    if ((Bd.peek(m.id) || []).some(e => e.t === 'puits' && Math.abs(e.x - tx) <= 6 && Math.abs(e.y - ty) <= 6)) return true;
    if (m.objs.some(o => WATER[o.type] && Math.abs(o.x / T - tx) <= 6.5 && Math.abs(o.y / T - ty) <= 6.5)) return true;
    return m.anim.some(a => Math.abs(a.x - tx) <= 6 && Math.abs(a.y - ty) <= 6);
  }
  function flood(sx, sy) { const m = W.map, seen = new Uint8Array(m.w * m.h), q = [sy * m.w + sx]; seen[q[0]] = 1; while (q.length) { const i = q.pop(), x = i % m.w, y = (i - x) / m.w; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) continue; const j = ny * m.w + nx; if (seen[j] || m.solid[j]) continue; seen[j] = 1; q.push(j); } } return seen; }
  // 2.33 (D226) — où trouver ce qui manque : une phrase, et une flèche vers le plus proche (Bd.render)
  const SOURCES = { palme: ['troncs', 'palm'], pierre: ['tas_pierres', 'rock', 'bigrock'], eau: Object.keys(WATER), pise: Object.keys(WATER), grain: ['stall'] };
  const OU = { palme: I.T('Le bois de palmier : un tas de troncs, ou un palmier.'), pierre: I.T('La pierre : un tas de pierres, ou un rocher.'), eau: I.T('L’eau : un puits, une fontaine ou une rive.'),
    pise: I.T('Le pisé : de l’eau puisée au puits, puis pétrie (deux mesures d’eau donnent trois briques).'), grain: I.T('Le grain : un étal du souk.'), laine: I.T('La laine : un enclos de moutons, ou le comptoir.') };
  const manque = id => { const c = D.PIECES[id].cost, m = Bd.mats(); return Object.keys(c).filter(k => (m[k] || 0) < c[k]); };
  function ouTrouver(id) { const k = manque(id)[0]; return k && OU[k] ? I.t(OU[k]) : ''; }
  Bd.fleche = null;
  function montrerSource(id) {
    const k = manque(id)[0], types = k && SOURCES[k], p = W.player, m = W.map; if (!types) return;
    let best = null; m.objs.forEach(o => { if (types.indexOf(o.type) < 0 || o.used) return; const d = Math.hypot(o.x - p.x, o.y - p.y); if (!best || d < best.d) best = { d, x: o.x, y: o.y - (o.h || 16) }; });
    if (best) Bd.fleche = { x: best.x, y: best.y, t: W.t + 9 };
    if (I.lecons) I.lecons.proposer('recolter', () => I.lecons.dit('recolter'));   // 2.33 : « Récolter », au premier matériau qui manque
  }
  Bd.can = function (tx, ty, id) {
    const m = W.map, p = D.PIECES[id]; if (!p) return I.t('Pièce inconnue.');
    // dans une ville qu'on visite, on ne bâtit que les pièces du chantier d'une demande, chacune à sa case
    if (visite(m.id)) { const g = Bd.fantome(tx, ty); if (!g) return I.t('Ici, on ne bâtit que ce qui est tracé en pointillés.'); if (g !== id) return I.t('Ici, c’est : {piece}.', { piece: D.PIECES[g].name }); }
    if (tx < 1 || ty < 1 || tx >= m.w - 1 || ty >= m.h - 1) return I.t('Trop près du bord.');
    const i = ty * m.w + tx; if (m.solid[i]) return I.t('Le sol n’est pas libre ici.');
    if (Bd.list().some(e => e.x === tx && e.y === ty)) return I.t('Quelque chose est déjà bâti ici.');
    for (const k in m.spots) if (m.spots[k][0] === tx && m.spots[k][1] === ty) return I.t('On ne bâtit pas sur un lieu de passage.');
    if (W.npcs.some(n => !n.hidden && n.map === m.id && n.placed && Math.floor(n.x / T) === tx && Math.floor((n.y - 3) / T) === ty)) return I.t('Quelqu’un se tient là.');
    if (p.near && !waterNear(tx, ty)) return I.t('Il faut de l’eau à moins de six pas : creuse d’abord un puits.');
    if (!afford(id)) return I.t('Il te manque : {cout}.', { cout: costText(id) }) + ' ' + ouTrouver(id);
    if (p.solid) { // on ne mure pas un passage : chaque lieu doit rester accessible
      const pl = W.player, px = Math.floor(pl.x / T), py = Math.floor((pl.y - 3) / T); if (px === tx && py === ty) return I.t('Recule d’un pas.');
      m.solid[i] = 1; const seen = flood(px, py); m.solid[i] = 0;
      const okAt = (x, y) => { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < m.w && yy < m.h && seen[yy * m.w + xx]) return true; } return false; };
      const before = flood(px, py), was = (x, y) => { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < m.w && yy < m.h && before[yy * m.w + xx]) return true; } return false; };
      for (const k in m.spots) { const s = m.spots[k]; if (was(s[0], s[1]) && !okAt(s[0], s[1])) return I.t('On ne mure pas un passage.'); }
      for (const n of W.npcs.concat(W.foes, W.chests)) if (!n.hidden && n.map === m.id && n.placed) { const x = Math.floor(n.x / T), y = Math.floor((n.y - 3) / T); if (was(x, y) && !okAt(x, y)) return I.t('On ne mure pas un passage.'); }
    }
    return '';
  };

  /* ----- poser, retirer ----- */
  Bd.placeAt = function (tx, ty, id) {
    const why = Bd.can(tx, ty, id); if (why) return why;
    const c = D.PIECES[id].cost, m = Bd.mats(); Object.keys(c).forEach(k => { m[k] -= c[k]; });
    const e = { x: tx, y: ty, t: id }; Bd.list().push(e); W.uncache(); Bd.apply(e, W.map);
    for (let k = 0; k < 10; k++) G.spawn({ x: tx * T + 8 - W.cam.x + (Math.random() - 0.5) * 14, y: ty * T + 12 - W.cam.y, vx: (Math.random() - 0.5) * 30, vy: -20 - Math.random() * 20, grav: 60, life: 0.7, size: 0.8, color: '#e2c389', type: 'mote', blend: 'source-over' });
    return '';
  };
  Bd.place = async function () {
    const [tx, ty] = Bd.target();
    if (Bd.sel === '_retirer') { const l = Bd.list(), k = l.findIndex(e => e.x === tx && e.y === ty); if (k < 0) { S.toast(I.t('Rien de bâti devant toi.'), 1500); return; } const e = l.splice(k, 1)[0], c = D.PIECES[e.t].cost; Object.keys(c).forEach(q => Bd.give(q, c[q], true)); I.audio.sfx('door'); const p = W.player; W.loadMap(W.map.id, W.mapOpts, [p.x, p.y]); Bd.refresh(); return; }
    const id = Bd.fantome(tx, ty) || Bd.sel;   // 2.33 (D226) : une pièce en pointillés se pose d'elle-même, sans la choisir
    if (id === '_retirer') return;
    const why = Bd.placeAt(tx, ty, id); if (why) { S.toast(why, 3400); I.audio.sfx('dark'); if (!afford(id)) montrerSource(id); return; }
    Bd.fleche = null; I.audio.sfx(D.PIECES[id].tile === 'trench' ? 'hit' : 'door'); Bd.refresh(); await Bd.after();
  };
  // après chaque pose : oasis, mosquée achevée, objectif
  Bd.after = async function () {
    const m = W.map, l = Bd.list(), sp = I.save.data.sagas[W.saga.id] || {}; sp.flags = sp.flags || {};
    const well = l.find(e => e.t === 'puits' && l.filter(q => q.t === 'palmier' && Math.abs(q.x - e.x) <= 6 && Math.abs(q.y - e.y) <= 6).length >= 3);
    if (well && !S.flags['_oasis_' + m.id]) { S.flags['_oasis_' + m.id] = true; I.audio.sfx('roll'); S.toast(I.t('<b>Une oasis est née.</b> Là où il y a de l’eau et de l’ombre, les routes se rejoignent.'), 4200); W.pillar('lien', 1); }
    if (l.filter(e => e.t === 'tranchee').length >= 6 && !S.flags['_fosse_' + m.id]) { S.flags['_fosse_' + m.id] = true; S.toast(I.t('<b>Le fossé tient.</b> Ce qui rôde ne le franchira pas.'), 3600); }
    const sites = Bd.sites();
    for (const id in sites) { const st = sites[id]; if (st.map !== m.id || st.done) continue; const pr = Bd.progress(st); if (Object.keys(st.need).every(k => pr[k] >= st.need[k])) await consecrate(st); }
    if (I.entraide && visite(m.id)) { await I.entraide.apres(); W.hud(); return; }   // 2.33 : le chantier d'une demande achevé, l'aide est payée
    const o = W.cur(); if (o && o.build && Bd.objectiveDone(o.build) && !S.busy) { Bd.set(false); await W.complete(); } else W.hud();
  };
  Bd.progress = function (st) { const l = Bd.peek(st.map) || [], pr = {}; Object.keys(st.need).forEach(k => { pr[k] = l.filter(e => e.t === k && e.x >= st.x && e.x < st.x + st.w && e.y >= st.y && e.y < st.y + st.h).length; }); return pr; };
  Bd.objectiveDone = function (b) { if (b.site) { const st = Bd.sites()[b.site]; return !!(st && st.done); } return Bd.count(b.piece) >= b.n; };
  Bd.objectiveText = function (b) { if (b.site) { const st = Bd.sites()[b.site]; if (!st) return ''; const pr = Bd.progress(st); return ' · ' + Object.keys(st.need).map(k => I.t('{min_piece} {n}/{sur}', { min_piece: D.PIECES[k].name.split(' ')[0].toLowerCase(), piece: D.PIECES[k].name, n: Math.min(pr[k], st.need[k]), sur: st.need[k] })).join(I.t(', ')); } return ` (${Math.min(Bd.count(b.piece), b.n)}/${b.n})`; };
  /* ----- 2.33 (D226) — le plan : chaque pièce attendue à sa case, en pointillés ----- */
  // un chantier de récit (`site`) n'a pas de plan écrit : le moteur le trace, toujours le même — la niche au milieu du mur du haut,
  // les murs le long du bord (une porte de trois cases au milieu du bas), le tapis sous la niche, les piliers en symétrie, le
  // reste dedans, ligne après ligne ; seulement sur des cases où l'on peut bâtir
  const libreIci = (m, x, y) => x >= 1 && y >= 1 && x < m.w - 1 && y < m.h - 1 && !m.solid[y * m.w + x] && !Object.keys(m.spots).some(k => m.spots[k][0] === x && m.spots[k][1] === y)
    && !m.objs.some(o => !o.built && Math.floor(o.x / T) === x && Math.floor((o.y - 3) / T) === y);
  Bd.planDe = function (st) {
    if (st.plan) return st.plan;
    const m = W.map, k0 = st.x + ',' + st.y + ',' + st.w + ',' + st.h + ',' + JSON.stringify(st.need); if (m._plans && m._plans[k0]) return m._plans[k0];
    const need = Object.assign({}, st.need), out = [], pris = new Set(), cle2 = (x, y) => x + ',' + y, bati = (Bd.peek(m.id) || []);
    const ok = (x, y) => !pris.has(cle2(x, y)) && (libreIci(m, x, y) || bati.some(b => b.x === x && b.y === y));
    const met = (x, y, t) => { if (!(need[t] > 0) || !ok(x, y)) return false; out.push([x, y, t]); pris.add(cle2(x, y)); need[t]--; return true; };
    const x0 = st.x, y0 = st.y, w = st.w, h = st.h, cx = x0 + Math.floor(w / 2);
    met(cx, y0, 'mihrab');
    const bord = []; for (let x = x0; x < x0 + w; x++) bord.push([x, y0]); for (let y = y0 + 1; y < y0 + h; y++) { bord.push([x0, y]); bord.push([x0 + w - 1, y]); } for (let x = x0 + 1; x < x0 + w - 1; x++) if (Math.abs(x - cx) > 1) bord.push([x, y0 + h - 1]);
    ['mur', 'lanterne'].forEach(t => bord.forEach(q => met(q[0], q[1], t)));
    met(cx, y0 + 1, 'natte');
    [[x0 + 2, y0 + 2], [x0 + w - 3, y0 + 2], [x0 + 2, y0 + h - 3], [x0 + w - 3, y0 + h - 3]].forEach(q => met(q[0], q[1], 'pilier'));
    const dedans = []; for (let y = y0 + 1; y < y0 + h - 1; y++) for (let x = x0 + 1; x < x0 + w - 1; x++) dedans.push([x, y]);
    Object.keys(need).forEach(t => dedans.forEach(q => met(q[0], q[1], t)));
    Object.keys(need).forEach(t => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) met(x, y, t); });
    (m._plans || (m._plans = {}))[k0] = out; return out;
  };
  // les plans ouverts sur ce lieu : ceux des chantiers du récit et celui d'une demande (entraide.js)
  Bd.plans = function () {
    const m = W.map, L = []; if (!m || !W.saga) return L;
    if (!visite(m.id)) { const sites = ((I.save.data.sagas[W.saga.id] || {}).sites) || {}; for (const id in sites) { const st = sites[id]; if (st.map === m.id && !st.done) L.push({ st, plan: Bd.planDe(st) }); } }
    else if (I.entraide) { const ch = I.entraide.chantier(m.id); if (ch) L.push({ st: ch, plan: ch.plan }); }
    // un objectif « bâtir n pièces » sans chantier : des cases en pointillés devant le lieu de l'objectif (ou devant soi)
    const o = W.cur(); if (o && o.build && o.build.piece && !Bd.objectiveDone(o.build)) { const pl = Bd.planPiece(o.build); if (pl.length) L.push({ st: null, plan: pl }); }
    return L;
  };
  Bd.planPiece = function (b) {
    const m = W.map, k0 = 'piece:' + b.piece + ':' + b.n; if (m._plans && m._plans[k0]) return m._plans[k0].filter(q => !(Bd.peek(m.id) || []).some(e => e.x === q[0] && e.y === q[1]));
    const p = W.player, px = Math.floor(p.x / T), py = Math.floor((p.y - 3) / T), out = [], rest = b.n - Bd.count(b.piece), solid = D.PIECES[b.piece].solid;
    for (let r = 2; r < 9 && out.length < rest; r++) for (let dy = -r; dy <= r && out.length < rest; dy++) for (let dx = -r; dx <= r && out.length < rest; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; const x = px + dx, y = py + dy; if (!libreIci(m, x, y) || (D.PIECES[b.piece].near && !waterNear(x, y))) continue;
      if (solid && out.some(q => Math.abs(q[0] - x) + Math.abs(q[1] - y) === 1)) continue; out.push([x, y, b.piece]); }
    (m._plans || (m._plans = {}))[k0] = out; return out;
  };
  // la pièce qui manque à cette case, d'après les plans ouverts (ou rien)
  Bd.fantome = function (tx, ty) {
    const bati = Bd.peek(W.map.id) || [];
    for (const P of Bd.plans()) { const q = P.plan.find(e => e[0] === tx && e[1] === ty); if (q && !bati.some(b => b.x === tx && b.y === ty)) { if (P.st && P.st.need && !P.st.plan) { const pr = Bd.progress(P.st); if ((pr[q[2]] || 0) >= P.st.need[q[2]]) continue; } return q[2]; } }
    return null;
  };
  // ce qu'un chantier de récit demande encore, par pièce (la barre ne montre qu'elles)
  function besoin() {
    const P = Bd.plans().filter(x => x.st)[0]; if (!P) return null; const bati = Bd.peek(W.map.id) || [], st = P.st, out = {};
    if (st.need && !st.plan) { const pr = Bd.progress(st); Object.keys(st.need).forEach(k => { out[k] = [Math.min(pr[k] || 0, st.need[k]), st.need[k]]; }); }
    else P.plan.forEach(q => { const o = out[q[2]] || (out[q[2]] = [0, 0]); o[1]++; if (bati.some(b => b.x === q[0] && b.y === q[1] && b.t === q[2])) o[0]++; });
    return out;
  }
  // la leçon « Bâtir », quand le besoin se présente : un chantier ouvert, un objectif qui demande de bâtir
  Bd.leconBatir = function () { if (I.lecons) I.lecons.proposer('batir', () => I.lecons.dit('batir')); };
  async function consecrate(st) {
    st.done = true; const nt = (Bd.peek(st.map) || []).find(e => e.t === 'natte' && e.x >= st.x && e.x < st.x + st.w && e.y >= st.y && e.y < st.y + st.h); if (nt) { st.nx = nt.x; st.ny = nt.y; }
    S.depth++;
    try {
      I.audio.sfx('roll'); G.flash('#fff3c8'); I.audio.scene('espoir');
      await S.card('lightcard', `<div class="glyph" style="color:#ffe08a">✦</div><p class="small">${I.t('Mosquée fondée')}</p><h1 style="color:#ffe08a">${I.esc(st.name)}</h1><p>${I.t('Bloc après bloc, de tes mains. Sur son tapis, on peut désormais prier, se reposer et accomplir les œuvres du jour.')}</p><div class="hint">▼</div>`);
      W.pillar('priere', 1); W.pillar('lien', 1);
    } finally { S.depth--; S.hideDialog(); }
  }
  Bd.openSite = function (def) {
    const m = W.map, name = Array.isArray(def.at) ? def.at[0] : def.at, s = m.spots[name] || [10, 10];
    const x = s[0] + (Array.isArray(def.at) ? def.at[1] : 0), y = s[1] + (Array.isArray(def.at) ? def.at[2] : 0), sites = Bd.sites();
    if (!sites[def.id]) { sites[def.id] = { map: m.id, x, y, w: def.w || 9, h: def.h || 7, name: def.name, need: def.need, done: false }; Object.keys(def.give || {}).forEach(k => Bd.give(k, def.give[k], true)); S.toast(I.t('Chantier ouvert : <b>{nom}</b>. Les matériaux sont livrés.', { nom: I.esc(def.name) }), 4200); I.audio.sfx('ok'); Bd.leconBatir(); }
    Bd.refresh();
  };
  // points de prière ajoutés par les mosquées bâties
  Bd.prayerPoints = function () { const out = [], sites = W.saga ? (((I.save.data.sagas[W.saga.id] || {}).sites) || {}) : {}; for (const id in sites) { const st = sites[id]; if (st.done && st.map === W.map.id && st.nx !== undefined) out.push([st.nx, st.ny]); } return out; };

  /* ----- récolter ----- */
  // le menu d'eau est géré ici pour rester hors du contrat de données
  const _ask = (q, o) => S.menuPick(q, o);
  Bd.water = async function () {
    S.depth++;
    try {
      const i = await _ask(I.t('De l’eau.'), [{ t: I.t('Puiser (+2 eau)') }, { t: I.t('Pétrir des briques de terre (2 eau → 3 pisé)') }, { t: I.t('Plus tard'), retour: true }]);
      if (i === 0) { I.audio.sfx('blip'); Bd.give('eau', 2); }
      else if (i === 1) { if (Bd.mats().eau < 2) S.toast(I.t('Il faut deux mesures d’eau.'), 1800); else { Bd.give('eau', -2, true); I.audio.sfx('door'); Bd.give('pise', 3); } }
    } finally { S.depth--; S.hideDialog(); }
  };
  // 2.33 (D226) — au doigt : toucher ce qui se récolte y mène Idris, qui récolte (world.js). Seulement quand un chantier attend
  // (ou dans une ville qui demande de l'aide) : ailleurs, toucher un palmier reste marcher
  const RECOLTE = ['palm', 'rock', 'bigrock', 'stall', 'troncs', 'tas_pierres'].concat(Object.keys(WATER));
  Bd.recoltable = function (wx, wy) {
    if (!W.saga || (W.saga.frame && !W.saga.veillees) || Bd.on) return null;
    const id = W.map.id; if (visite(id) ? !D.ENTRAIDE.villes[id] : (!Bd.outdoor(id) || !Bd.plans().length)) return null;
    const o = W.map.objs.find(o => RECOLTE.indexOf(o.type) >= 0 && Math.abs(o.x - wx) < Math.max(9, (o.w || 16) / 2) && wy > o.y - (o.h || 16) && wy < o.y + 5);
    return o ? { x: o.x, y: o.y, ox: o.x, oy: o.y - 4 } : null;
  };
  Bd.gather = async function () {
    if (!W.saga || (W.saga.frame && !W.saga.veillees)) return false;
    if (visite(W.map.id) ? !D.ENTRAIDE.villes[W.map.id] : !Bd.outdoor(W.map.id)) return false;   // 2.33 : on récolte dans une ville qui demande de l'aide (jamais La Mecque)
    const p = W.player, px = p.x + [0, -1, 1, 0][p.dir] * 12, py = p.y + [1, 0, 0, -1][p.dir] * 12, m = W.map;
    const o = m.objs.find(o => Math.abs(o.x - px) < 13 && Math.abs(o.y - 4 - py) < 13 && (o.type === 'palm' || o.type === 'rock' || o.type === 'bigrock' || o.type === 'stall' || o.reserve || WATER[o.type]));
    const [tx, ty] = Bd.target(), wt = m.anim.some(a => a.x === tx && a.y === ty);
    if (!o && !wt) return false;
    if (o && o.reserve) { const R = D.ENTRAIDE.reserve[o.type] || {}; if (o.used) S.toast(I.t('Ce tas a déjà donné : il se refera d’ici ta prochaine venue.'), 2000); else { o.used = true; I.audio.sfx(o.type === 'troncs' ? 'slash' : 'hit'); Object.keys(R).forEach(k => Bd.give(k, R[k])); Bd.fleche = null; } return true; }
    if (o && o.type === 'stall') { if (o.used) S.toast(I.t('Le marchand n’a plus d’orge à céder aujourd’hui.'), 1600); else { o.used = true; I.audio.sfx('ok'); Bd.give('grain', 2); } return true; }
    if (o && o.type === 'palm') { if (o.used) S.toast(I.t('Ce palmier a déjà donné.'), 1500); else { o.used = true; I.audio.sfx('slash'); Bd.give('palme', 1); } return true; }
    if (o && (o.type === 'rock' || o.type === 'bigrock')) { if (o.used) S.toast(I.t('Il n’y a plus rien à tirer de ce rocher.'), 1500); else { o.used = true; I.audio.sfx('hit'); Bd.give('pierre', o.type === 'rock' ? 1 : 2); } return true; }
    await Bd.water(); return true;
  };

  /* ----- ce que donnent troupeaux, champs et palmiers à chaque chapitre ----- */
  Bd.yields = function () {
    const b = I.save.data.built || {}, n = { enclos: 0, bergerie: 0, chamelier: 0, champ: 0, palmier: 0, puits: 0 };
    Object.keys(b).forEach(k => { if (k.indexOf(W.saga.id + ':') === 0) b[k].forEach(e => { if (n[e.t] !== undefined) n[e.t]++; }); });
    const got = [], inv = I.save.data.items, add = (k, v, item) => { if (v <= 0) return; if (item) { inv[k] = (inv[k] || 0) + v; got.push(`${D.ITEMS[k].name} ×${v}`); } else { Bd.give(k, v, true); got.push(`${D.MATS[k].name} +${v}`); } };
    add('lait', Math.min(2, n.enclos), true); add('laine', Math.min(4, n.bergerie * 2)); add('pierre', Math.min(4, n.chamelier * 2));
    add('pain', Math.min(2, Math.floor(n.champ / 3)), true); add('grain', Math.min(4, n.champ)); add('dattes', Math.min(3, Math.floor(n.palmier / 2)), true); add('eau', Math.min(6, n.puits * 3));
    if (got.length) S.toast(I.t('Ce que tu as bâti a donné : <b>{dons}</b>', { dons: got.join(I.t(', ')) }), 5200);
    // le dû des troupeaux : ce que la Ridda refusait de verser
    if (n.enclos + n.bergerie + n.chamelier > 0) { S.toast(I.t('Le dû des troupeaux est versé : la part des pauvres est prélevée la première.'), 5200); W.pillar('justice', 1); }
  };

  /* ----- mode Bâtir ----- */
  const ORDER = ['_retirer'].concat(Object.keys(D.PIECES));
  Bd.set = function (on) {
    if (on && (I.scene !== W || S.busy || !W.saga || (W.saga.frame && !W.saga.veillees))) return;   // 2.33 : jamais dans l'histoire-cadre
    if (on && !Bd.outdoor(W.map.id)) { S.toast(I.t('On ne bâtit pas ici. Cherche un sol à ciel ouvert.'), 2200); return; }
    Bd.on = !!on; document.body.classList.toggle('in-build', Bd.on); $('#buildbar').hidden = !Bd.on; if (Bd.on) { I.audio.sfx('ok'); const b = besoin(); if (b && !b[Bd.sel]) Bd.sel = Object.keys(b)[0]; Bd.refresh(); }
  };
  Bd.cycle = function (d) { const i = ORDER.indexOf(Bd.sel); Bd.sel = ORDER[(i + d + ORDER.length) % ORDER.length]; I.audio.sfx('move'); Bd.refresh(); };
  const iconURL = {};
  const iconCv = {};
  function iconCanvas(id) { if (iconCv[id]) return iconCv[id]; const p = D.PIECES[id], cv = G.mk(20, 20), c = cv.getContext('2d'); c.imageSmoothingEnabled = false; if (p.tile) c.drawImage(G.tile(p.tile, 0, 0), 2, 2); else if (p.decal) I.maps.drawRosette(c, { x: 10, y: 10, R: 9, n: 8 }); else { const o = G.obj(p.obj), k = Math.min(20 / o.width, 20 / o.height); c.drawImage(o, (20 - o.width * k) / 2, (20 - o.height * k) / 2, o.width * k, o.height * k); } return (iconCv[id] = cv); }
  function icon(id) { if (iconURL[id]) return iconURL[id]; const p = D.PIECES[id], cv = G.mk(20, 20), c = cv.getContext('2d'); if (p.tile) c.drawImage(G.tile(p.tile, 0, 0), 2, 2); else if (p.decal) I.maps.drawRosette(c, { x: 10, y: 10, R: 9, n: 8 }); else { const o = G.obj(p.obj), k = Math.min(20 / o.width, 20 / o.height); c.imageSmoothingEnabled = false; c.drawImage(o, (20 - o.width * k) / 2, (20 - o.height * k) / 2, o.width * k, o.height * k); } return (iconURL[id] = cv.toDataURL()); }
  Bd.refresh = function () {
    const bar = $('#buildbar'); if (!bar || bar.hidden) return; const m = Bd.mats();
    bar.querySelector('.mats').innerHTML = Object.keys(D.MATS).map(k => `<span title="${D.MATS[k].name}"><i>${D.MATS[k].g}</i>${D.MATS[k].name} <b>${m[k] || 0}</b></span>`).join('');
    const box = bar.querySelector('.pieces'); box.innerHTML = '';
    // 2.33 (D226) : dans un chantier, seulement ses pièces, avec leur compte (« Mur 3/8 ») ; ailleurs, toutes, rangées par groupes
    const bs = besoin(), liste = bs ? Object.keys(bs) : ORDER.filter(id => !visite(W.map.id) || id !== '_retirer'); let grp = null;
    liste.forEach(id => {
      const g = id === '_retirer' ? null : D.PIECES[id].group; if (!bs && g && g !== grp) { grp = g; box.appendChild(I.el('span', 'grp', I.esc(I.t(g)))); }
      const cpt = bs && bs[id] ? ` <b class="cpt">${bs[id][0]}/${bs[id][1]}</b>` : '';
      const b = I.el('button', 'pc' + (id === Bd.sel ? ' sel' : '') + (id !== '_retirer' && !afford(id) ? ' poor' : '') + (bs && bs[id] && bs[id][0] >= bs[id][1] ? ' fini' : ''), id === '_retirer' ? '<span class="ic">✕</span><span>' + I.t('Retirer') + '</span>' : `<span class="ic" style="background-image:url(${icon(id)})"></span><span>${D.PIECES[id].name}${cpt}</span>`); b.type = 'button'; b.onclick = ev => { ev.stopPropagation(); Bd.sel = id; I.audio.sfx('move'); Bd.refresh(); }; box.appendChild(b); if (id === Bd.sel) setTimeout(() => b.scrollIntoView && b.scrollIntoView({ block: 'nearest', inline: 'nearest' }), 0); });
    const geste = document.body.classList.contains('touch') ? I.t('Touche une pièce en pointillés pour la poser.') : I.t('Devant une pièce en pointillés, <kbd>Entrée</kbd> la pose.');
    bar.querySelector('.info').innerHTML = Bd.sel === '_retirer' ? I.t('<b>Retirer</b> · reprend la pièce posée devant toi et rend ses matériaux.') : `${bs ? geste + ' ' : ''}<b>${D.PIECES[Bd.sel].name}</b> · ${D.PIECES[Bd.sel].desc} <em>${I.t('Coût : {cout}.', { cout: costText(Bd.sel) })}</em>`;
  };

  /* ----- rendu : case visée, chantiers, troupeaux ----- */
  Bd.render = function (c, cx, cy, t) {
    const m = W.map, sites = W.saga ? (((I.save.data.sagas[W.saga.id] || {}).sites) || {}) : {};
    for (const id in sites) { const st = sites[id]; if (st.map !== m.id) continue; const x = st.x * T - cx, y = st.y * T - cy, w = st.w * T, h = st.h * T; c.strokeStyle = st.done ? 'rgba(255,224,138,.35)' : `rgba(255,224,138,${0.55 + 0.25 * Math.sin(t * 3)})`; c.lineWidth = 1; c.setLineDash([4, 3]); c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); c.setLineDash([]); if (!st.done) { c.fillStyle = 'rgba(255,224,138,.07)'; c.fillRect(x, y, w, h); } }
    if (I.entraide && visite(m.id)) { const ch = I.entraide.chantier(m.id); if (ch) { const x = ch.x * T - cx, y = ch.y * T - cy; c.strokeStyle = `rgba(255,224,138,${0.55 + 0.25 * Math.sin(t * 3)})`; c.lineWidth = 1; c.setLineDash([4, 3]); c.strokeRect(x + 0.5, y + 0.5, ch.w * T - 1, ch.h * T - 1); c.setLineDash([]); c.fillStyle = 'rgba(255,224,138,.07)'; c.fillRect(x, y, ch.w * T, ch.h * T); } I.entraide.render(c, cx, cy, t); }
    // 2.33 (D226) : chaque pièce attendue, en pointillés à sa case — on la touche, ou A devant elle, et elle se pose
    const plans = Bd.plans(), bati = Bd.peek(m.id) || [];
    plans.forEach(P => P.plan.forEach(q => { if (bati.some(b => b.x === q[0] && b.y === q[1])) return; if (Bd.fantome(q[0], q[1]) !== q[2]) return; const x = q[0] * T - cx, y = q[1] * T - cy;
      c.globalAlpha = 0.32 + 0.12 * Math.sin(t * 3 + q[0]); c.drawImage(iconCanvas(q[2]), x - 2, y - 2, 20, 20); c.globalAlpha = 1; c.strokeStyle = 'rgba(255,246,220,.75)'; c.lineWidth = 1; c.setLineDash([2, 2]); c.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3); c.setLineDash([]); }));
    // ce qui se récolte, tout près, quand un chantier attend : une lueur au-dessus
    if (plans.length) { const p = W.player, types = ['palm', 'rock', 'bigrock', 'stall', 'troncs', 'tas_pierres'].concat(Object.keys(WATER));
      m.objs.forEach(o => { if (types.indexOf(o.type) < 0 || o.used || Math.hypot(o.x - p.x, o.y - p.y) > 56) return; const x = o.x - cx, y = o.y - (o.h || 16) - cy - 3 + Math.sin(t * 4 + o.x) * 1.5; c.fillStyle = 'rgba(255,240,190,.9)'; c.fillRect(x - 0.5, y - 2, 1, 5); c.fillRect(x - 2.5, y, 5, 1); }); }
    // ce qui manque : une flèche au-dessus du plus proche endroit où le trouver
    if (Bd.fleche && W.t < Bd.fleche.t) { const f = Bd.fleche, x = f.x - cx, y = f.y - cy - 8 + Math.sin(t * 6) * 2.5; c.fillStyle = '#1a1420'; c.beginPath(); c.moveTo(x - 6, y - 7); c.lineTo(x + 6, y - 7); c.lineTo(x, y + 1); c.fill(); c.fillStyle = '#ffe08a'; c.beginPath(); c.moveTo(x - 4, y - 6); c.lineTo(x + 4, y - 6); c.lineTo(x, y - 1); c.fill(); }
    if (Bd.on && !S.busy) { const [tx, ty] = Bd.target(), ok = Bd.sel === '_retirer' ? Bd.list().some(e => e.x === tx && e.y === ty) : !Bd.can(tx, ty, Bd.sel); c.strokeStyle = ok ? 'rgba(140,255,170,.95)' : 'rgba(255,120,100,.95)'; c.lineWidth = 1; c.strokeRect(tx * T - cx + 0.5, ty * T - cy + 0.5, T - 1, T - 1); c.fillStyle = ok ? 'rgba(140,255,170,.18)' : 'rgba(255,120,100,.18)'; c.fillRect(tx * T - cx, ty * T - cy, T, T); }
  };
  // bêtes en blocs, sans traits : un corps, une tête, quatre pattes
  Bd.herd = function (c, o, x, y, t) {
    const h = G.OBJ[o.type].herd; if (!h) return;
    for (let k = 0; k < h[2]; k++) { const ph = o.seed + k * 2.3, bx = Math.round(x - 9 + k * (18 / Math.max(1, h[2] - 1 || 1)) + Math.sin(t * 0.5 + ph) * 3), by = Math.round(y - 9 + Math.cos(t * 0.4 + ph) * 2), hop = Math.abs(Math.sin(t * 2 + ph)) < 0.2 ? 1 : 0, big = h[3] ? 1 : 0;
      c.fillStyle = h[1]; c.fillRect(bx, by + 3 + big, 1, 2 + hop); c.fillRect(bx + 4 + big, by + 3 + big, 1, 2 + hop);
      c.fillStyle = h[0]; c.fillRect(bx - 1, by - big, 7 + big, 4 + big); if (big) c.fillRect(bx + 2, by - 3, 3, 2);
      c.fillStyle = G.shade(h[0], 0.8); c.fillRect((k % 2 ? bx - 3 : bx + 6 + big), by - 2 - big * 2, 3, 3 + big); }
  };

  /* ----- tests : bâtir tout seul ce qu'un objectif demande ----- */
  Bd.autoBuild = function (b) {
    const m = W.map, grant = id => { const c = D.PIECES[id].cost; Object.keys(c).forEach(k => { if ((Bd.mats()[k] || 0) < c[k]) Bd.give(k, c[k] + 2, true); }); };
    const p = W.player, px = Math.floor(p.x / T), py = Math.floor((p.y - 3) / T), log = I.debug.log || (I.debug.log = []);
    const tryPut = (x, y, id) => { grant(id); return !Bd.placeAt(x, y, id); };
    if (b.site) {
      const st = Bd.sites()[b.site]; if (!st) { log.push('SITE ABSENT ' + b.site); return; }
      Bd.planDe(st).forEach(q => { if ((Bd.progress(st)[q[2]] || 0) < st.need[q[2]] && Bd.fantome(q[0], q[1]) === q[2] && !(q[0] === px && q[1] === py)) tryPut(q[0], q[1], q[2]); });   // 2.33 : d'abord le plan
      Object.keys(st.need).forEach(id => { let left = st.need[id] - (Bd.progress(st)[id] || 0); const solid = D.PIECES[id].solid;
        for (let y = st.y; y < st.y + st.h && left > 0; y++) for (let x = st.x; x < st.x + st.w && left > 0; x++) { const edge = y === st.y || x === st.x || x === st.x + st.w - 1; if (solid !== edge && !(solid && y === st.y)) continue; if (x === px && y === py) continue; if (tryPut(x, y, id)) left--; }
        for (let y = st.y; y < st.y + st.h && left > 0; y++) for (let x = st.x; x < st.x + st.w && left > 0; x++) { if (x === px && y === py) continue; if (tryPut(x, y, id)) left--; }
        if (left > 0) log.push(`SITE ${b.site} : impossible de poser ${left} × ${id}`); });
    } else {
      let left = b.n - Bd.count(b.piece); if (D.PIECES[b.piece].near) { for (let r = 2; r < 8 && !waterNear(px, py); r++) for (let dx = -r; dx <= r; dx++) if (tryPut(px + dx, py + r, 'puits')) { r = 99; break; } }
      for (let r = 1; r < 12 && left > 0; r++) for (let dy = -r; dy <= r && left > 0; dy++) for (let dx = -r; dx <= r && left > 0; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; if (tryPut(px + dx, py + dy, b.piece)) left--; }
      if (left > 0) log.push(`BÂTIR ${b.piece} : il en manque ${left}`);
    }
  };
})();
