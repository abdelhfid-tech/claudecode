/* ISNAD — cartes : boîte à outils + générateurs (ville arabe, désert, camp, cité romaine, palais, navire, noosphère, cité-miroir, archives). */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, T = 16;
  const M = I.maps = {};

  class MB {
    constructor(id, w, h, base, opts, graine) {
      this.id = id; this.w = w; this.h = h; this.opts = opts || {}; this.hue = (opts && opts.hue) || 0;
      this.g = new Array(w * h).fill(base); this.solid = new Uint8Array(w * h);
      this.objs = []; this.lights = []; this.spots = {}; this.r = I.rng(I.hash((graine || id) + JSON.stringify(opts || {})));
      if (G.isSolidTile(base)) this.solid.fill(1);
      this.mirror = false;
    }
    X(x, w) { return this.mirror ? this.w - (x + (w || 1)) : x; }
    set(x, y, t, solid) { x = this.X(x); if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; const i = y * this.w + x; this.g[i] = t; this.solid[i] = solid === undefined ? (G.isSolidTile(t) ? 1 : 0) : (solid ? 1 : 0); }
    get(x, y) { x = this.X(x); return this.g[y * this.w + x]; }
    fill(x, y, w, h, t, solid) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, t, solid); }
    ring(x, y, w, h, t, solid) { const so = solid === undefined ? true : solid; for (let i = 0; i < w; i++) { this.set(x + i, y, t, so); this.set(x + i, y + h - 1, t, so); } for (let j = 0; j < h; j++) { this.set(x, y + j, t, so); this.set(x + w - 1, y + j, t, so); } }
    rosette(x, y, R, n, pal) { (this.decals || (this.decals = [])).push({ x: this.X(x) * T + 8, y: y * T + 8, R, n, pal }); }
    block(x, y, w, h) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const xx = this.X(x + i); if (xx >= 0 && y + j >= 0 && xx < this.w && y + j < this.h) this.solid[(y + j) * this.w + xx] = 1; } }
    free(x, y) { x = this.X(x); return x >= 0 && y >= 0 && x < this.w && y < this.h && !this.solid[y * this.w + x]; }
    obj(type, x, y, opt) {
      const d = G.OBJ[type]; const xx = this.X(x);
      const o = { type, opt: opt || (d.hue ? { hue: this.hue } : undefined), x: xx * T + 8, y: y * T + 15, w: d.w, h: d.h, flat: !!d.flat, anim: !!d.anim, seed: Math.floor(this.r() * 9999) };
      if (d.hue && !o.opt.hue) o.opt.hue = this.hue;
      this.objs.push(o);
      if (d.fw) { const tw = Math.max(1, Math.round(d.fw / T)), x0 = xx - Math.floor((tw - 1) / 2); for (let i = 0; i < tw; i++) if (x0 + i >= 0 && x0 + i < this.w) this.solid[y * this.w + x0 + i] = 1; }
      return o;
    }
    light(x, y, r, color, flicker) { this.lights.push({ x: this.X(x) * T + 8, y: y * T + 8, r, color, flicker: flicker || 0 }); }
    spot(name, x, y) { this.spots[name] = [this.X(x), y]; }
    // maison : toit, bord de toit, 2 rangs de mur, porte au centre
    house(x, y, w, h, st) {
      st = st || {}; const roof = st.roof || 'roof', edge = st.edge || 'roofedge', wall = st.wall || 'wall', door = st.door || 'door';
      this.fill(x, y, w, h - 2, roof, true); this.fill(x, y + h - 3, w, 1, edge, true); this.fill(x, y + h - 2, w, 2, wall, true);
      const dx = x + (st.doorAt === undefined ? Math.floor(w / 2) : st.doorAt);
      if (door !== 'none') this.set(dx, y + h - 1, door, true);
      if (st.window !== false && w >= 4) { this.set(x + 1, y + h - 2, st.windowTile || 'window', true); if (w >= 6) this.set(x + w - 2, y + h - 2, st.windowTile || 'window', true); }
      if (st.lit !== false) this.light(dx, y + h - 1, 44, '#ffb45a', 0.15);
      (this.shadows || (this.shadows = [])).push([this.X(x, w), y + h, w]);
      return [dx, y + h];
    }
    scatter(type, n, x, y, w, h, opt) { let tries = n * 12; while (n > 0 && tries-- > 0) { const tx = x + Math.floor(this.r() * w), ty = y + Math.floor(this.r() * h); if (this.free(tx, ty) && this.free(tx, ty + 1) && !this.reserved(tx, ty)) { this.obj(type, tx, ty, typeof opt === 'function' ? opt() : opt); n--; } } }
    reserved(x, y) { const xx = this.X(x); for (const k in this.spots) { const s = this.spots[k]; if (Math.abs(s[0] - xx) <= 2 && Math.abs(s[1] - y) <= 2) return true; } return false; }
    road(x1, y1, x2, y2, t, wd) { wd = wd || 2; const sx = Math.min(x1, x2), ex = Math.max(x1, x2), sy = Math.min(y1, y2), ey = Math.max(y1, y2); this.fillSoft(sx, y1, ex - sx + wd, wd, t); this.fillSoft(x2, sy, wd, ey - sy + wd, t); }
    fillSoft(x, y, w, h, t) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const xx = this.X(x + i); if (xx < 0 || y + j < 0 || xx >= this.w || y + j >= this.h) continue; if (!this.solid[(y + j) * this.w + xx]) this.g[(y + j) * this.w + xx] = t; } }
    patch(t, cx, cy, rad, solid) { for (let j = -rad; j <= rad; j++) for (let i = -rad; i <= rad; i++) if (i * i + j * j <= rad * rad + this.r() * rad) this.set(cx + i, cy + j, t, solid); }
    finish(env) {
      const cv = G.mk(this.w * T, this.h * T), c = cv.getContext('2d'); const anim = [];
      for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
        const n = this.g[y * this.w + x], v = (x * 7 + y * 13 + ((x * y) % 5)) % 4;
        c.drawImage(G.tile(n, v, this.hue), x * T, y * T);
        if (n === 'water' || n === 'sea') anim.push({ x, y, n });
      }
      (this.decals || []).forEach(d => drawRosette(c, d));
      // ombres portées au pied des bâtiments
      (this.shadows || []).forEach(sh => { const g = c.createLinearGradient(0, sh[1] * T, 0, sh[1] * T + 9); g.addColorStop(0, 'rgba(30,18,44,.42)'); g.addColorStop(1, 'rgba(30,18,44,0)'); c.fillStyle = g; c.fillRect(sh[0] * T + 3, sh[1] * T, sh[2] * T, 9); });
      // mini-carte : 1 pixel par case
      const mini = G.mk(this.w, this.h), mc = mini.getContext('2d');
      for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) { const n = this.g[y * this.w + x], so = this.solid[y * this.w + x]; mc.fillStyle = (n === 'water' || n === 'sea') ? 'rgba(70,150,200,.75)' : n === 'void' ? 'rgba(8,8,30,.5)' : so ? 'rgba(20,14,30,.8)' : (n === 'path' || n === 'stone' || n === 'nbridge' || n === 'wood' || n === 'marble' || n === 'mosaic' || n === 'carpet') ? 'rgba(240,225,190,.75)' : 'rgba(200,180,140,.5)'; mc.fillRect(x, y, 1, 1); }
      // objets plats (nattes, sources) cuits dans le sol
      this.objs.filter(o => o.flat).forEach(o => c.drawImage(G.obj(o.type, o.opt, o.seed), Math.round(o.x - o.w / 2), o.y - o.h + 1));
      // ombres portées douces sous les objets
      c.fillStyle = 'rgba(30,20,40,.22)';
      this.objs.filter(o => !o.flat && G.OBJ[o.type].fw).forEach(o => { c.beginPath(); c.ellipse(o.x + 3, o.y + 1, Math.max(5, G.OBJ[o.type].fw * 0.7), 3, 0, 0, 6.3); c.fill(); });
      return { id: this.id, w: this.w, h: this.h, canvas: cv, mini, solid: this.solid, objs: this.objs.filter(o => !o.flat), lights: this.lights, spots: this.spots, anim, env: env || {}, opts: this.opts, hue: this.hue };
    }
  }

  // rosace : la même étoile à n branches, tournée et réduite, comme dans un entrelacs
  function drawRosette(c, d) {
    const x = d.x, y = d.y, R = d.R, n = d.n, pal = d.pal || ['rgba(190,150,56,.8)', 'rgba(45,127,143,.34)', 'rgba(241,231,204,.5)', 'rgba(142,90,42,.55)'];
    const star = (r1, r2, rot, fill, stroke) => { c.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r2 : r1; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.86); } c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } };
    [1, 0.94].forEach(k => { c.strokeStyle = pal[3]; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, R * k, R * k * 0.86, 0, 0, 6.3); c.stroke(); });
    star(R * 0.9, R * 0.6, 0, pal[1], pal[0]); star(R * 0.9, R * 0.6, Math.PI / n, null, pal[0]);
    star(R * 0.56, R * 0.3, Math.PI / n, pal[2], pal[3]); star(R * 0.56, R * 0.3, 0, null, pal[3]);
    star(R * 0.26, R * 0.13, 0, pal[0], null);
    c.fillStyle = pal[0]; for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n; c.fillRect(Math.round(x + Math.cos(a) * R * 0.9) - 1, Math.round(y + Math.sin(a) * R * 0.9 * 0.86) - 1, 2, 2); }
  }

  const TIME = {
    day: { ambient: null, grade: ['#ffb866', 0.1], rays: { a: 0.03, color: '#fff2c8' }, lightA: 0, bloom: 0.12 },
    dusk: { ambient: '#d99676', grade: ['#ff6a3c', 0.2], lightA: 0.75, bloom: 0.2 },
    night: { ambient: '#4456a6', grade: ['#2a3a9a', 0.2], lightA: 1, bloom: 0.22 },
    dawn: { ambient: '#cfa9bd', grade: ['#ff9aa0', 0.18], rays: { a: 0.05, color: '#ffd9c8' }, lightA: 0.5, bloom: 0.18 }
  };
  function envFor(time, extra) { return Object.assign({ time: time || 'day', clouds: time !== 'night' }, TIME[time || 'day'], extra || {}); }

  /* ---------- Ville arabe : Médine, et sa variante « fleuve » (Koufa) ---------- */
  function ville(id, o, L, graine) {
    const fleuve = !!L && L.variante === 'fleuve', b = new MB(id, 60, 46, 'sand', o, graine); b.mirror = fleuve;
    // chemins
    b.road(29, 0, 29, 45, 'path', 3); b.road(2, 24, 57, 24, 'path', 3); b.road(12, 24, 12, 38, 'path', 2); b.road(46, 24, 46, 38, 'path', 2); b.road(16, 12, 29, 12, 'path', 2);
    // place pavée
    b.fill(23, 21, 15, 8, 'stone');
    // mosquée : enceinte de pisé, cour ouverte, colonnes de troncs de palmier
    b.fill(21, 5, 19, 14, 'path'); b.ring(21, 5, 19, 14, 'gwall');
    b.fill(22, 6, 17, 6, fleuve ? 'zellij' : 'zsand', false); b.ring(22, 12, 17, 6, fleuve ? 'zellij' : 'zsand', false);
    b.rosette(30, 15, 34, fleuve ? 12 : 8); if (fleuve) { b.set(30, 5, 'mihrab', true); b.obj('basin', 36, 15); }
    b.obj('minbar', 37, 7);
    b.set(30, 18, 'path', false); b.set(29, 18, 'path', false); b.set(31, 18, 'path', false);
    for (let x = 24; x <= 36; x += 3) { b.obj('trunkcol', x, 8); b.obj('trunkcol', x, 11); }
    for (let x = 25; x <= 34; x += 3) b.obj('mat', x, 10);
    b.obj('lantern', 23, 16); b.obj('lantern', 37, 16); b.obj('lantern', 23, 7); b.light(23, 6, 50, '#ffc878', 0.12); b.light(23, 15, 60, '#ffc878', 0.12); b.light(37, 15, 60, '#ffc878', 0.12); b.light(30, 9, 80, '#ffd9a0', 0.05);
    b.spot('mosquee_cour', 30, 12); b.spot('mosquee_porte', 30, 20);
    b.spot('priere', 30, 15); b.light(30, 15, 70, '#fff0c0', 0.05); b.obj('shelf', 35, 16); b.obj('mat', 34, 17); b.spot('ecole', 33, 17);
    b.spot('place', 30, 25);
    b.obj('well', 25, 23); b.spot('puits', 25, 25);
    // halle (Saqîfa / tribunal) : auvent de palmes sur piliers, à l'ouest
    b.house(6, 17, 9, 6, { roof: 'thatch', edge: 'thatch', doorAt: 4 }); b.fill(6, 23, 9, 3, 'stone');
    b.rosette(10, 24, 20, 8); b.obj('trunkcol', 6, 25); b.obj('trunkcol', 14, 25); b.obj('rug', 8, 23, { color: '#6b3f2a', trim: '#d9b45a' }); b.obj('rug', 12, 23, { color: '#6b3f2a', trim: '#d9b45a' }); b.obj('lantern', 16, 23); b.light(16, 22, 56, '#ffc878', 0.12);
    b.spot('halle', 10, 26);
    // maison du Compagnon (nord-ouest)
    b.house(12, 7, 6, 5); b.spot('maison', 15, 13); b.obj('jar', 12, 12); b.obj('sack', 18, 12);
    // autres maisons
    [[3, 5, 6, 5], [3, 31, 6, 5], [16, 30, 7, 5], [44, 5, 6, 5], [52, 12, 6, 5], [42, 12, 6, 5], [34, 31, 6, 5], [20, 38, 6, 5], [50, 29, 6, 5]].forEach(h => b.house(h[0], h[1], h[2], h[3]));
    // souk à l'est
    b.fill(40, 20, 15, 8, 'path');
    ['#a53c33', '#2f6f8f', '#c9a13f', '#3d8a6a'].forEach((col, i) => b.obj('stall', 42 + i * 4, 21, { color: col }));
    b.obj('stall', 44, 27, { color: '#6b3f7a' }); b.obj('stall', 50, 27, { color: '#a53c33' });
    b.obj('rug', 45, 24, { color: '#8e2f2a' }); b.obj('rug', 50, 25, { color: '#27608f', trim: '#f1e7cc' }); b.obj('jar', 41, 23); b.obj('crate', 55, 22); b.obj('sack', 54, 26); b.obj('lamp', 48, 24); b.light(48, 23, 60, '#ffc878', 0.12);
    b.obj('bales', 53, 23); b.obj('camel', 53, 26); b.spot('comptoir', 52, 24); b.light(53, 23, 44, '#ffc878', 0.1);
    b.spot('souk', 47, 25);
    // palmeraie (sud-est) avec rigole
    b.patch('grass', 49, 38, 6); b.fill(44, 41, 12, 1, 'water'); b.set(49, 41, 'wood', false); b.set(50, 41, 'wood', false);
    b.spot('palmeraie', 49, 37);
    b.scatter('palm', 16, 42, 32, 16, 12); b.scatter('bush', 5, 42, 33, 16, 10);
    // enclos (sud-ouest)
    b.fill(6, 38, 9, 6, 'path'); for (let x = 6; x < 15; x += 2) { b.obj('crate', x, 38); } b.obj('camel', 9, 41); b.obj('camel', 12, 43); b.obj('sack', 7, 43);
    b.spot('enclos', 11, 40);
    // colline (nord-est)
    b.obj('bigrock', 54, 5); b.obj('bigrock', 57, 8); b.obj('rock', 51, 4); b.obj('rock', 56, 3); b.spot('colline', 53, 8);
    // portes
    b.obj('banner', 27, 2, { color: '#1e1e1e' }); b.obj('banner', 33, 2, { color: '#1e1e1e' }); b.spot('porte_nord', 30, 2);
    b.obj('lamp', 27, 43); b.obj('lamp', 33, 43); b.light(27, 42, 50, '#ffc878', 0.12); b.light(33, 42, 50, '#ffc878', 0.12); b.spot('porte_sud', 30, 43);
    if (fleuve) { b.fill(0, 0, 2, 46, 'water'); b.scatter('cypress', 5, 3, 2, 3, 40); }
    b.scatter('palm', 14, 0, 0, 60, 46); b.scatter('rock', 8, 0, 0, 60, 46); b.scatter('bush', 8, 0, 0, 60, 46);
    const t = o.time || 'day';
    return b.finish(envFor(t, { particles: t === 'night' ? 'fireflies' : 'dust', rate: t === 'night' ? 3 : 8, bg: 'ville', music: t === 'night' ? 'nuit' : 'medine' }));
  }

  /* ---------- Désert ---------- */
  function desert(id, o, L, graine) {
    const b = new MB(id, 80, 40, 'sand', o, graine);
    for (let i = 0; i < 260; i++) b.patch('dune', Math.floor(b.r() * 80), Math.floor(b.r() * 40), 1 + Math.floor(b.r() * 2));
    // piste sinueuse
    let y = 20; for (let x = 0; x < 80; x++) { y += Math.round(Math.sin(x / 7) * 0.8); y = I.clamp(y, 16, 24); b.fillSoft(x, y, 1, 2, 'path'); }
    b.spot('depart', 3, 20);
    b.spot('dunes', 16, 11);
    b.obj('bigrock', 28, 29); b.obj('bigrock', 33, 31); b.obj('rock', 30, 26); b.obj('rock', 36, 28); b.obj('bigrock', 26, 33); b.spot('rochers', 31, 28);
    for (let x = 38; x < 52; x += 3) b.obj(x % 2 ? 'bigrock' : 'rock', x, 5 + (x % 4)); b.spot('crete', 45, 9);
    b.obj('brokencol', 40, 18); b.obj('brokencol', 43, 21); b.obj('column', 38, 21); b.fill(39, 19, 4, 2, 'stone'); b.spot('ruines', 41, 21);
    b.patch('grass', 58, 31, 4); b.patch('water', 58, 31, 1); b.scatter('palm', 9, 53, 26, 11, 10); b.spot('oasis', 58, 34);
    b.obj('thorn', 67, 8); b.obj('spring', 66, 10); b.obj('rock', 69, 9); b.obj('thorn', 63, 6); b.spot('source', 66, 11);
    b.obj('tent', 8, 30, { color: '#d8c8a8' }); b.obj('tent', 13, 33, { color: '#cdb892', trim: '#2f6f4f' }); b.obj('fire', 10, 34); b.light(10, 33, 70, '#ff9a4a', 0.25); b.obj('camel', 15, 29); b.obj('camel', 6, 35); b.spot('caravane', 11, 32); b.obj('bales', 13, 36); b.spot('comptoir', 14, 36); b.obj('mat', 16, 32); b.spot('priere', 16, 33);
    b.spot('arrivee', 76, 20);
    b.scatter('rock', 22, 0, 0, 80, 40); b.scatter('thorn', 10, 0, 0, 80, 40); b.scatter('bigrock', 6, 0, 0, 80, 40);
    const t = o.time || 'day';
    return b.finish(envFor(t, { particles: 'sand', rate: t === 'night' ? 4 : 14, bg: 'desert', haze: true, music: 'desert' }));
  }

  /* ---------- Camp militaire ---------- */
  function camp(id, o, L, graine) {
    const b = new MB(id, 52, 38, 'sand', o, graine);
    b.road(0, 19, 51, 19, 'path', 3); b.road(25, 8, 25, 30, 'path', 3);
    b.spot('entree', 4, 20);
    b.obj('bigtent', 26, 9, { color: '#e6dcc4', trim: '#2f6f4f' }); b.spot('tente_chef', 26, 12); b.obj('banner', 22, 10, { color: '#1e1e1e' }); b.obj('banner', 30, 10, { color: '#f1ece2', trim: '#1e1e1e' });
    b.spot('etendard', 20, 12); b.obj('mat', 33, 13); b.obj('mat', 35, 13); b.spot('priere', 34, 14);
    b.fill(23, 17, 7, 6, 'path'); b.obj('fire', 26, 20); b.light(26, 19, 90, '#ff9a4a', 0.25); b.spot('feu', 26, 22);
    const cols = ['#d8c8a8', '#cdb892', '#e0d2b4'];
    for (let i = 0; i < 4; i++) { b.obj('tent', 8 + i * 4 + (i % 2), 8 + (i % 2) * 5, { color: cols[i % 3] }); }
    b.spot('tentes', 13, 15);
    for (let i = 0; i < 4; i++) b.obj('tent', 8 + i * 7, 31 + (i % 2) * 3, { color: cols[(i + 1) % 3], trim: '#2f6f8f' });
    for (let i = 0; i < 3; i++) b.obj('tent', 36 + i * 5, 30 + (i % 2) * 3, { color: cols[i % 3] });
    b.obj('fire', 14, 26); b.light(14, 25, 60, '#ff9a4a', 0.25); b.obj('fire', 40, 26); b.light(40, 25, 60, '#ff9a4a', 0.25);
    b.obj('camel', 7, 26); b.obj('camel', 11, 28); b.obj('sack', 5, 28); b.obj('crate', 4, 25); b.spot('enclos', 9, 24); b.obj('bales', 13, 25); b.spot('comptoir', 13, 26);
    for (let y = 10; y < 30; y += 3) b.obj('banner', 48, y, { color: y % 2 ? '#1e1e1e' : '#2f6f4f' });
    b.spot('lignes', 45, 20);
    b.obj('bigrock', 40, 5); b.obj('rock', 44, 4); b.obj('rock', 37, 3); b.spot('tertre', 41, 8);
    b.scatter('rock', 10, 0, 0, 52, 38); b.scatter('bush', 8, 0, 0, 52, 38); b.scatter('jar', 4, 6, 6, 40, 26); b.scatter('crate', 4, 6, 6, 40, 26);
    const t = o.time || 'dusk';
    return b.finish(envFor(t, { particles: 'embers', rate: 5, bg: 'camp', music: 'camp' }));
  }

  /* ---------- Cité romaine (Damas, Jérusalem, Homs) ---------- */
  function romaine(id, o, L, graine) {
    const b = new MB(id, 64, 46, 'path', o, graine);
    const RS = { roof: 'rroof', edge: 'rroofedge', wall: 'rwall', door: 'rdoor', windowTile: 'rwall' };
    // remparts sud + porte
    b.fill(0, 42, 64, 3, 'rwall', true); b.fill(0, 41, 64, 1, 'rroofedge', true); b.fill(30, 41, 4, 4, 'stone', false); b.set(29, 43, 'arch', true); b.set(34, 43, 'arch', true);
    b.spot('porte', 31, 43); b.obj('aquila', 28, 40); b.obj('aquila', 35, 40);
    // cardo à colonnades
    b.fill(30, 12, 4, 30, 'stone'); for (let y = 15; y < 40; y += 3) { b.obj('column', 29, y); b.obj('column', 34, y); }
    b.spot('cardo', 31, 34);
    // forum, mosaïque et fontaine
    b.fill(22, 20, 20, 9, 'stone'); b.fill(28, 22, 8, 5, 'mosaic'); b.obj('fountain', 25, 25); b.spot('fontaine', 25, 27); b.spot('forum', 32, 25);
    b.obj('brazier', 22, 21); b.light(22, 20, 60, '#ffb45a', 0.2); b.obj('brazier', 41, 21); b.light(41, 20, 60, '#ffb45a', 0.2);
    // esplanade (nord)
    b.fill(24, 3, 16, 9, 'marble'); [[24, 4], [39, 4], [24, 11], [39, 11]].forEach(p => b.obj('column', p[0], p[1])); b.obj('brokencol', 28, 4); b.obj('brokencol', 35, 5); b.spot('esplanade', 32, 8); b.obj('mat', 36, 9); b.spot('priere', 36, 10); b.spot('quartier', 15, 27);
    // basilique (nord-est)
    b.house(44, 4, 12, 9, Object.assign({}, RS, { door: 'arch' })); b.obj('column', 47, 14); b.obj('column', 53, 14); b.fill(46, 13, 9, 3, 'stone'); b.spot('basilique', 50, 15); b.light(50, 12, 60, '#ffd9a0', 0.1);
    // palais du gouverneur (nord-ouest)
    b.house(8, 4, 12, 9, RS); b.obj('column', 11, 14); b.obj('column', 17, 14); b.fill(10, 13, 9, 3, 'stone'); b.obj('aquila', 9, 14); b.spot('palais', 14, 15);
    // îlots d'habitation
    [[4, 20, 7, 5], [12, 21, 7, 5], [4, 29, 8, 5], [45, 19, 7, 5], [54, 20, 7, 5], [20, 32, 7, 5], [37, 32, 7, 5], [54, 28, 7, 5]].forEach(h => b.house(h[0], h[1], h[2], h[3], RS));
    // jardin
    b.patch('grass', 11, 37, 4); b.scatter('cypress', 6, 6, 34, 11, 6); b.spot('jardin', 12, 38);
    // marché
    ['#b33327', '#2f6f8f', '#c9a13f'].forEach((c, i) => b.obj('stall', 46 + i * 5, 34, { color: c })); b.obj('jar', 45, 36); b.obj('crate', 58, 36); b.spot('marche', 51, 37); b.obj('bales', 55, 38); b.obj('camel', 57, 39); b.spot('comptoir', 54, 39);
    b.spot('remparts', 54, 40);
    b.scatter('jar', 6, 2, 16, 60, 24); b.scatter('cypress', 6, 0, 0, 64, 40);
    const t = o.time || 'day';
    return b.finish(envFor(t, { particles: 'dust', rate: 6, bg: 'romaine', music: 'rome' }));
  }

  /* ---------- Palais perse (salle du trône) ---------- */
  function palais(id, o, L, graine) {
    const b = new MB(id, 40, 30, 'glaze', o, graine);
    b.ring(0, 0, 40, 30, 'pwall'); b.fill(1, 1, 38, 2, 'pwall', true);
    b.fill(17, 4, 6, 24, 'carpet'); b.set(19, 29, 'glaze', false); b.set(20, 29, 'glaze', false);
    b.obj('throne', 20, 5); b.spot('trone', 20, 8); b.obj('brazier', 16, 6); b.obj('brazier', 24, 6); b.light(16, 5, 70, '#ffb45a', 0.2); b.light(24, 5, 70, '#ffb45a', 0.2);
    for (let y = 9; y < 27; y += 4) { b.obj('column', 14, y); b.obj('column', 25, y); b.light(14, y - 1, 34, '#ffd9a0', 0.05); }
    b.spot('nef', 20, 17); b.spot('entree', 20, 27);
    b.obj('treasure', 33, 6); b.obj('treasure', 35, 9); b.obj('treasure', 31, 9); b.obj('chest', 36, 6); b.obj('jar', 30, 6); b.light(33, 7, 60, '#ffe08a', 0.1); b.spot('tresor', 33, 11);
    for (let y = 8; y < 26; y += 3) b.obj('column', 6, y); b.spot('colonnade', 9, 17);
    b.fill(29, 19, 9, 8, 'grass'); b.obj('fountain', 33, 22); b.obj('cypress', 30, 20); b.obj('cypress', 37, 25); b.spot('jardin', 33, 25); b.obj('mat', 36, 20); b.spot('priere', 36, 21);
    b.obj('carpetroll', 4, 5); b.obj('jar', 3, 26); b.obj('brazier', 10, 26); b.light(10, 25, 60, '#ffb45a', 0.2);
    return b.finish(Object.assign(envFor('dusk'), { clouds: false, ambient: '#8a78a8', grade: ['#ffb060', 0.18], particles: 'dust', rate: 4, bg: 'palais', rays: { a: 0.06, color: '#ffe0b0' }, bloom: 0.24, music: 'palais' }));
  }

  /* ---------- Navires enchaînés ---------- */
  function navire(id, o, L, graine) {
    const b = new MB(id, 52, 24, 'sea', o, graine);
    const ship = (x0, x1) => { for (let x = x0; x <= x1; x++) { const e = Math.min(x - x0, x1 - x), inset = e === 0 ? 3 : e === 1 ? 2 : e === 2 ? 1 : 0; b.fill(x, 7 + inset, 1, 9 - inset * 2, 'wood', false); b.set(x, 16 - inset, 'hull', true); } };
    ship(4, 25); ship(29, 49);
    b.fill(26, 10, 3, 3, 'wood', false); b.obj('chain', 27, 9); b.obj('chain', 27, 13);
    b.obj('mast', 14, 10); b.obj('mast', 39, 10); b.obj('crate', 10, 9); b.obj('crate', 20, 14); b.obj('jar', 21, 9); b.obj('sack', 34, 14); b.obj('crate', 44, 9); b.obj('lamp', 6, 11); b.light(6, 10, 50, '#ffc878', 0.15); b.obj('lamp', 47, 11); b.light(47, 10, 50, '#ffc878', 0.15);
    b.obj('mat', 10, 13); b.spot('priere', 10, 14); b.spot('poupe', 7, 12); b.spot('pont', 17, 12); b.spot('mat', 15, 13); b.spot('proue', 23, 11); b.spot('passerelle', 27, 11); b.spot('pont2', 37, 12);
    const t = o.time || 'day';
    return b.finish(envFor(t, { particles: 'spray', rate: 8, bg: 'mer', bob: true, music: 'mer' }));
  }

  /* ---------- Noosphère ---------- */
  function noos(id, o, L, graine) {
    const b = new MB(id, 60, 40, 'void', o, graine); const hue = b.hue = (o.hue === undefined ? 210 : o.hue);
    const room = (name, cx, cy, hw, hh) => { b.fill(cx - hw, cy - hh, hw * 2 + 1, hh * 2 + 1, 'nfloor', false); b.spot(name, cx, cy); b.light(cx, cy, 70 + hw * 10, `hsl(${hue},90%,60%)`, 0.1); };
    const bridge = (x1, y1, x2, y2) => { const sx = Math.min(x1, x2), ex = Math.max(x1, x2), sy = Math.min(y1, y2), ey = Math.max(y1, y2); for (let x = sx; x <= ex; x++) for (let k = 0; k < 2; k++) if (b.g[(y1 + k) * b.w + x] === 'void') b.set(x, y1 + k, 'nbridge', false); for (let y = sy; y <= ey + 1; y++) for (let k = 0; k < 2; k++) if (b.g[y * b.w + x2 + k] === 'void') b.set(x2 + k, y, 'nbridge', false); };
    bridge(6, 20, 18, 20); bridge(18, 20, 30, 11); bridge(18, 20, 30, 28); bridge(18, 8, 18, 20); bridge(18, 20, 18, 32); bridge(30, 11, 47, 19); bridge(30, 28, 47, 21);
    room('seuil', 6, 20, 3, 2); room('noeud1', 18, 20, 3, 3); room('noeud2', 30, 11, 3, 2); room('noeud3', 30, 28, 3, 2); room('faille', 18, 8, 2, 2); room('miroir', 18, 32, 2, 2); room('coeur', 48, 20, 6, 5);
    [[3, 18], [9, 18], [15, 17], [21, 17], [15, 23], [21, 23], [27, 9], [33, 9], [27, 30], [33, 30], [42, 15], [54, 15], [42, 25], [54, 25], [16, 6], [20, 6], [16, 34], [20, 34]].forEach(p => { if (b.free(p[0], p[1])) b.obj('pylon', p[0], p[1], { hue }); });
    b.light(48, 20, 150, `hsl(${(hue + 150) % 360},100%,65%)`, 0.15);
    return b.finish({ time: 'noos', ambient: '#6a62c8', grade: [`hsl(${hue},90%,55%)`, 0.2], particles: 'noos', hue, rate: 9, bg: 'noos', scan: true, bloom: 0.36, lightA: 1, music: 'noos' });
  }

  /* ---------- La Citadelle du Caïd (ksar au bord du désert) ---------- */
  function citadelle(id, o, L, graine) {
    const b = new MB(id, 58, 46, 'sand', o, graine);
    for (let i = 0; i < 120; i++) b.patch('dune', Math.floor(b.r() * 58), Math.floor(b.r() * 46), 1);
    // enceinte de pisé, tours d'angle, porte au sud, poterne à l'est
    b.fill(8, 6, 43, 31, 'path', false); b.ring(8, 6, 43, 31, 'wall'); b.fill(8, 5, 43, 1, 'roofedge', true);
    [[7, 4], [48, 4], [7, 34], [48, 34]].forEach(t => { b.fill(t[0], t[1], 4, 3, 'roof', true); b.fill(t[0], t[1] + 2, 4, 1, 'roofedge', true); b.fill(t[0], t[1] + 3, 4, 2, 'wall', true); });
    b.fill(28, 36, 3, 1, 'stone', false); b.spot('porte', 29, 38); b.obj('lamp', 26, 38); b.obj('lamp', 32, 38); b.light(26, 37, 54, '#ffc878', 0.12); b.light(32, 37, 54, '#ffc878', 0.12);
    b.set(50, 20, 'path', false); b.spot('poterne', 52, 20);
    // cour pavée et puits
    b.fill(22, 18, 15, 9, 'stone'); b.ring(22, 18, 15, 9, 'zellij', false); b.rosette(29, 22, 46, 12); b.obj('well', 29, 21); b.spot('puits', 29, 23); b.spot('cour', 29, 25);
    // salle du Caïd (nord)
    b.house(23, 8, 13, 7, { roof: 'roof', doorAt: 6 }); b.obj('banner', 22, 16, { color: '#1c3a5a', trim: '#e6dcc4' }); b.obj('banner', 36, 16, { color: '#1c3a5a', trim: '#e6dcc4' }); b.obj('brazier', 26, 16); b.obj('brazier', 32, 16); b.light(26, 15, 60, '#ffb45a', 0.2); b.light(32, 15, 60, '#ffb45a', 0.2); b.spot('salle', 29, 16);
    // mosquée (nord-ouest) : cour ouverte, nattes
    b.fill(10, 8, 10, 9, 'zellij', false); b.ring(10, 8, 10, 9, 'gwall'); b.set(15, 8, 'mihrab', true); b.set(15, 16, 'zellij', false); b.set(14, 16, 'zellij', false); b.rosette(15, 13, 22, 8); b.obj('basin', 12, 15);
    b.obj('column', 12, 10); b.obj('column', 18, 10); b.obj('lantern', 17, 15); b.light(11, 14, 50, '#ffc878', 0.1); b.light(15, 12, 60, '#fff0c0', 0.05);
    b.spot('mosquee', 15, 18); b.spot('priere', 15, 13);
    // école (nord-est) : auvent, rayonnage, nattes
    b.house(39, 8, 8, 5, { roof: 'thatch', edge: 'thatch' }); b.obj('shelf', 41, 14); b.obj('rug', 44, 16, { color: '#3d8a6a', trim: '#f1e7cc' }); b.obj('lamp', 46, 15); b.light(46, 14, 50, '#ffc878', 0.1); b.spot('ecole', 43, 16);
    // souk (est)
    ['#1c3a5a', '#a53c33', '#c9a13f'].forEach((c, i) => b.obj('stall', 41 + i * 4, 22, { color: c })); b.obj('rug', 43, 24, { color: '#1c3a5a', trim: '#f1e7cc' }); b.obj('rug', 47, 26, { color: '#8e2f2a' }); b.obj('jar', 40, 24); b.obj('crate', 48, 25); b.obj('camel', 46, 28); b.obj('bales', 44, 28); b.spot('comptoir', 43, 29); b.spot('souk', 44, 25);
    // greniers (sud-ouest)
    b.house(10, 26, 6, 5); b.house(17, 28, 5, 5, { window: false }); b.obj('sack', 12, 32); b.obj('jar', 15, 32); b.obj('sack', 18, 34); b.obj('crate', 21, 34); b.spot('greniers', 15, 33);
    // jardin (sud-est) : rigole, palmiers
    b.patch('grass', 42, 32, 3); b.fill(39, 34, 7, 1, 'water'); b.set(42, 34, 'wood', false); b.scatter('palm', 5, 38, 29, 10, 5); b.spot('jardin', 42, 31);
    // remparts et tour (nord-est) : chemin de ronde au pied du mur
    b.obj('lamp', 37, 7); b.light(37, 7, 50, '#ffc878', 0.12); b.spot('remparts', 38, 7); b.spot('tour', 47, 8);
    // dehors : palmeraie, piste, rochers
    b.road(28, 37, 28, 45, 'path', 3); b.patch('grass', 14, 41, 3); b.scatter('palm', 12, 8, 38, 14, 7); b.spot('palmeraie', 14, 41);
    b.scatter('rock', 10, 0, 0, 58, 5); b.scatter('thorn', 6, 0, 38, 58, 8); b.scatter('bigrock', 3, 52, 0, 6, 46);
    b.scatter('jar', 4, 10, 18, 40, 16);
    const t = o.time || 'dusk';
    return b.finish(envFor(t, { particles: t === 'night' ? 'fireflies' : 'dust', rate: 6, bg: 'ville', music: t === 'night' ? 'nuit' : 'citadelle' }));
  }

  /* ---------- Cité-Miroir (cyberpunk) ---------- */
  function cite(id, o, L, graine) {
    const b = new MB(id, 60, 22, 'asphalt', o, graine);
    b.fill(0, 0, 60, 7, 'croof', true); b.fill(0, 7, 60, 2, 'cwall', true); b.fill(0, 17, 60, 5, 'croof', true); b.fill(0, 12, 60, 1, 'neonline', false);
    const cols = ['#ff4fd8', '#39e6ff', '#ffe08a', '#7dffb0', '#ff7a5c'];
    for (let x = 4; x < 58; x += 7) { const c = cols[(x >> 1) % cols.length]; b.obj('neon', x, 9, { color: c }); b.light(x, 8, 70, c, 0.3); }
    b.obj('screen', 30, 9); b.light(30, 8, 120, '#7a5cff', 0.3); b.obj('screen', 14, 16); b.obj('screen', 46, 16); b.light(14, 15, 80, '#39e6ff', 0.3); b.light(46, 15, 80, '#ff4fd8', 0.3);
    b.set(56, 8, 'arch', true); b.light(56, 9, 60, '#ffe08a', 0.1);
    b.spot('parvis', 4, 13); b.spot('rue', 16, 13); b.spot('ecran', 30, 11); b.spot('ruelle', 44, 14); b.spot('ascenseur', 56, 10);
    b.scatter('crate', 5, 2, 9, 56, 8);
    return b.finish({ time: 'cite', ambient: '#5a5ca8', grade: ['#7a2cff', 0.2], particles: 'rain', rate: 70, bg: 'cite', scan: true, bloom: 0.3, lightA: 1, music: 'cite' });
  }

  /* ---------- Archives basses ---------- */
  function archives(id, o, L, graine) {
    const b = new MB(id, 34, 24, 'metal', o, graine);
    b.ring(0, 0, 34, 24, 'cwall'); b.fill(1, 1, 32, 2, 'cwall', true); b.set(16, 23, 'metal', false); b.set(17, 23, 'metal', false);
    for (let x = 4; x < 16; x += 4) { b.obj('shelf', x, 5); b.obj('shelf', x, 10); }
    for (let x = 5; x < 15; x += 3) b.obj('rack', x, 17);
    b.obj('desk', 8, 20); b.spot('bureau', 9, 21);
    b.fill(22, 6, 9, 9, 'nfloor', false); b.obj('isnad', 26, 9); b.light(26, 9, 110, '#ffd27a', 0.2); b.spot('chaine', 26, 12);
    b.obj('rack', 30, 4); b.obj('rack', 21, 4); b.obj('rack', 30, 19); b.obj('lamp', 20, 12); b.light(20, 11, 60, '#39e6ff', 0.1); b.light(8, 8, 80, '#ffb45a', 0.1);
    b.spot('entree', 17, 21); b.spot('rayonnages', 14, 13); b.obj('mat', 27, 19); b.spot('priere', 27, 20); b.light(27, 19, 50, '#fff0c0', 0.05);
    return b.finish({ time: 'archives', ambient: '#6a66a0', grade: ['#ffb45a', 0.14], particles: 'dust', rate: 5, bg: 'cite', rays: { a: 0.05, color: '#ffe0a0' }, lightA: 1, bloom: 0.26, music: 'chaine' });
  }

  M.drawRosette = drawRosette;
  const GEN = { ville, desert, camp, romaine, palais, navire, noos, citadelle, cite, archives };
  // Tous les lieux nommés d'une carte se rejoignent-ils à pied ? Même parcours que les tests (cases libres voisines).
  function libre(m, s) {
    for (let rad = 0; rad < 9; rad++) for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue;
      const x = s[0] + dx, y = s[1] + dy; if (x < 1 || y < 1 || x >= m.w - 1 || y >= m.h - 1) continue;
      if (!m.solid[y * m.w + x]) return [x, y];
    }
    return null;
  }
  M.relie = function (m) {
    const pts = Object.keys(m.spots).map(k => libre(m, m.spots[k])); if (pts.some(p => !p)) return false; if (pts.length < 2) return true;
    const vu = new Uint8Array(m.w * m.h), q = [pts[0]]; vu[pts[0][1] * m.w + pts[0][0]] = 1;
    for (let i = 0; i < q.length; i++) { const x = q[i][0], y = q[i][1];
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + d[0], ny = y + d[1]; if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) continue; const k = ny * m.w + nx; if (vu[k] || m.solid[k]) continue; vu[k] = 1; q.push([nx, ny]); } }
    return pts.every(p => vu[p[1] * m.w + p[0]]);
  };
  // Un lieu est bâti sur son gabarit (D.MAPS, D.GABARITS). Les lieux du jeu de base sortent comme ils sont toujours sortis.
  // Un lieu déclaré par un paquet a sa propre graine : si un lieu nommé s'y trouve coupé des autres, on rebat les cartes.
  M.build = function (id, opts) {
    opts = opts || {};
    const L = D.MAPS[id], gen = L && GEN[L.gabarit];
    if (!gen) return noos('noos', opts);
    let m = gen(id, opts, L);
    if (L.paquet) for (let k = 1; k <= 12 && !M.relie(m); k++) m = gen(id, opts, L, id + '~' + k);
    if (L.piste && m.env.music === D.GABARITS[L.gabarit].piste) m.env.music = L.piste;
    return m;
  };
})();
