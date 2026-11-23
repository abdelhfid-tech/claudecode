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
    // En dessin fin, deux sols naturels qui se touchent ne se coupent plus au cordeau : le plus « haut » (l'herbe sur le
    // chemin, le chemin sur le sable) déborde sur l'autre d'une frange irrégulière. Le sol reste le même case par case :
    // seule l'image change.
    lisieres(c) {
      const RANG = { sand: 0, dune: 1, steppe: 1.5, path: 2, grass: 3 }, w = this.w, h = this.h, g = this.g, hue = this.hue;   // (2.29 : la steppe de la carte du monde, entre le sable et le chemin)
      const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? -1 : (RANG[g[y * w + x]] === undefined ? -1 : RANG[g[y * w + x]]);
      const br = k => { const n = Math.sin(k * 12.9898) * 43758.5453; return n - Math.floor(n); }, vague = (u, k) => { const a = Math.floor(u / 3), f = u / 3 - a, s = f * f * (3 - 2 * f); return (br(a * 7.13 + k) * (1 - s) + br((a + 1) * 7.13 + k) * s); };
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const r0 = at(x, y); if (r0 < 0) continue; const v = (x * 7 + y * 13 + ((x * y) % 5)) % 4, X = x * T, Y = y * T;
        [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], q) => { const r1 = at(x + dx, y + dy); if (r1 <= r0) return; const n = g[(y + dy) * w + x + dx];
          c.save(); c.beginPath();
          for (let i = 0; i <= 32; i++) { const u = i / 2, gl = (dy ? X : Y) + u, p = 0.6 + vague(gl * 2, (dy ? y + (dy > 0 ? 1 : 0) : x + (dx > 0 ? 1 : 0)) * 3.7 + (dy ? 0 : 91)) * 2.6; // la frange suit la ligne de partage : elle ne casse pas d'une case à l'autre
            const px = dy ? X + u : (dx > 0 ? X + T - p : X + p), py = dy ? (dy > 0 ? Y + T - p : Y + p) : Y + u; if (i) c.lineTo(px, py); else c.moveTo(px, py); }
          if (dy) { c.lineTo(X + T, dy > 0 ? Y + T : Y); c.lineTo(X, dy > 0 ? Y + T : Y); } else { c.lineTo(dx > 0 ? X + T : X, Y + T); c.lineTo(dx > 0 ? X + T : X, Y); }
          c.closePath(); c.clip(); c.drawImage(G.tile(n, v, hue), X, Y); c.restore(); });
        // les coins : un sol plus haut qui ne touche que par la pointe arrondit son angle
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy]) => { const r1 = at(x + dx, y + dy); if (r1 <= r0 || at(x + dx, y) > r0 || at(x, y + dy) > r0) return;
          c.save(); c.beginPath(); c.arc(dx > 0 ? X + T : X, dy > 0 ? Y + T : Y, 1.2 + br(x * 3.1 + y * 5.7) * 1.4, 0, 6.3); c.clip(); c.drawImage(G.tile(g[(y + dy) * w + x + dx], v, hue), X, Y); c.restore(); });
      }
    }
    finish(env) {
      const cv = G.toile(this.w * T, this.h * T), c = cv.getContext('2d'); const anim = [];
      for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
        const n = this.g[y * this.w + x], v = (x * 7 + y * 13 + ((x * y) % 5)) % 4;
        c.drawImage(G.tile(n, v, this.hue), x * T, y * T);
        if (n === 'water' || n === 'sea') anim.push({ x, y, n });
        else if (G.ANIME[n]) anim.push({ x, y, n: G.ANIME[n] }); // une eau peinte qui bouge : un calque de rides par-dessus (la crique de la Cité)
      }
      if (cv.hd > 1) this.lisieres(c);
      if (this.aretes) this.aretes(c);
      // un décor peint d'un tenant par-dessus les cases (la Cité-Miroir) : il ne change ni les cases ni le passage
      if (this.peint) this.peint(c);
      (this.decals || []).forEach(d => drawRosette(c, d));
      // ombres portées au pied des bâtiments
      (this.shadows || []).forEach(sh => { const g = c.createLinearGradient(0, sh[1] * T, 0, sh[1] * T + 9); g.addColorStop(0, 'rgba(30,18,44,.42)'); g.addColorStop(1, 'rgba(30,18,44,0)'); c.fillStyle = g; c.fillRect(sh[0] * T + 3, sh[1] * T, sh[2] * T, 9); });
      // mini-carte : 1 pixel par case (2.29 : la carte du monde n'en a pas — la carte, c'est elle)
      const mini = this.sansMini ? null : G.mk(this.w, this.h), mc = mini && mini.getContext('2d');
      if (mini) for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) { const n = this.g[y * this.w + x], so = this.solid[y * this.w + x]; mc.fillStyle = (n === 'water' || n === 'sea' || n === 'ccrique' || n === 'ceau') ? 'rgba(70,150,200,.75)' : n === 'void' ? 'rgba(8,8,30,.5)' : n === 'mont' ? 'rgba(110,84,58,.85)' : n === 'steppe' ? 'rgba(170,160,100,.6)' : so ? 'rgba(20,14,30,.8)' : (n === 'path' || n === 'stone' || n === 'nbridge' || n === 'wood' || n === 'marble' || n === 'mosaic' || n === 'carpet') ? 'rgba(240,225,190,.75)' : n === 'npont' ? 'rgba(150,190,255,.7)' : n === 'nabri' ? 'rgba(255,230,170,.85)' : n === 'qroute' ? 'rgba(120,110,150,.7)' : (n === 'qgazon' || n === 'qallee') ? 'rgba(90,140,80,.7)' : n === 'qjardin' ? 'rgba(255,230,170,.7)' : 'rgba(200,180,140,.5)'; mc.fillRect(x, y, 1, 1); }
      // objets plats (nattes, sources) cuits dans le sol
      this.objs.filter(o => o.flat).forEach(o => c.drawImage(G.obj(o.type, o.opt, o.seed), Math.round(o.x - o.w / 2), o.y - o.h + 1));
      // ombres portées douces sous les objets
      c.fillStyle = 'rgba(30,20,40,.22)';
      this.objs.filter(o => !o.flat && G.OBJ[o.type].fw).forEach(o => { c.beginPath(); c.ellipse(o.x + 3, o.y + 1, Math.max(5, G.OBJ[o.type].fw * 0.7), 3, 0, 0, 6.3); c.fill(); });
      const sols = this.g, lw = this.w, lh = this.h;
      return { id: this.id, w: this.w, h: this.h, canvas: cv, mini, g0: (px, py) => { const x = Math.floor(px / T), y = Math.floor(py / T); return x < 0 || y < 0 || x >= lw || y >= lh ? '' : sols[y * lw + x]; }, solid: this.solid, objs: this.objs.filter(o => !o.flat), lights: this.lights, spots: this.spots, anim, env: env || {}, opts: this.opts, hue: this.hue };
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

  // les heures : au cran « sombre » de la luminosité, celles de la 2.15 (gfx.js, G.lum) ; sinon celles de la 2.18
  const TIME_215 = {
    day: { ambient: null, grade: ['#ffb866', 0.1], rays: { a: 0.03, color: '#fff2c8' }, lightA: 0, bloom: 0.12 },
    dusk: { ambient: '#d99676', grade: ['#ff6a3c', 0.2], lightA: 0.75, bloom: 0.2 },
    night: { ambient: '#4456a6', grade: ['#2a3a9a', 0.2], lightA: 1, bloom: 0.22 },
    dawn: { ambient: '#cfa9bd', grade: ['#ff9aa0', 0.18], rays: { a: 0.05, color: '#ffd9c8' }, lightA: 0.5, bloom: 0.18 }
  }, TIME_217 = { // le jour doré, un couchant orangé qui passe au rose, une nuit éclaircie aux ombres turquoise (gfx.js, G.LUM)
    day: { ambient: '#fff1d6', grade: ['#ffb052', 0.16], rays: { a: 0.05, color: '#fff0c0' }, lightA: 0, bloom: 0.14 },
    dusk: { ambient: ['#e48c60', '#c27896'], grade: ['#ff6a3c', 0.18], lightA: 0.8, bloom: 0.22 },
    night: { ambient: '#3046b4', grade: ['#1a48b8', 0.22], etalon: [null, '#04122a'], lightA: 1, bloom: 0.24 },
    dawn: { ambient: ['#dca2a8', '#bca2cc'], grade: ['#ff9aa0', 0.16], rays: { a: 0.06, color: '#ffd9c8' }, lightA: 0.5, bloom: 0.2 }
  };
  function envFor(time, extra) { return Object.assign({ time: time || 'day', clouds: time !== 'night' }, (G.lum === 215 ? TIME_215 : TIME_217)[time || 'day'], extra || {}); }

  /* ---------- Ville arabe : Médine, et ses variantes « fleuve » (Koufa, Bassora), « nil » (Fustât) et « mecque » ----------
     2.29 (D220) : « nil », le fleuve à l'ouest (la ville n'est pas retournée) ; « mecque », la visite sobre de La Mecque — ni
     mosquée, ni Haram, ni Kaaba, rien qui les évoque : au cœur de la ville, des maisons de part et d'autre de la grand-rue, un
     petit marché, et une cour bordée d'un mur de terre au nord et à l'est, où le tapis est posé. Médine et Koufa ne changent pas d'une case. */
  function ville(id, o, L, graine) {
    const v = L && L.variante, fleuve = v === 'fleuve' || v === 'nil', mecque = v === 'mecque', b = new MB(id, 60, 46, 'sand', o, graine); b.mirror = v === 'fleuve';
    // chemins
    b.road(29, 0, 29, 45, 'path', 3); b.road(2, 24, 57, 24, 'path', 3); b.road(12, 24, 12, 38, 'path', 2); b.road(46, 24, 46, 38, 'path', 2); b.road(16, 12, 29, 12, 'path', 2);
    // place pavée
    b.fill(23, 21, 15, 8, 'stone');
    if (mecque) {
      // des maisons de part et d'autre de la grand-rue ; entre elles, un petit marché ; à l'est, la cour de la natte
      b.house(21, 5, 7, 6); b.house(33, 5, 7, 6);
      ['#8e5a2a', '#2f6f8f', '#a53c33'].forEach((col, i) => b.obj('stall', 19 + i * 4, 16, { color: col })); b.obj('jar', 18, 18); b.obj('sack', 22, 18); b.obj('crate', 26, 18);
      // (la cour n'a de mur qu'au nord et à l'est : ouverte sur la grand-rue et au sud, on n'y reste jamais pris en touchant
      // l'écran vers la porte du nord)
      b.fill(33, 12, 7, 6, 'path', false); for (let x = 33; x < 40; x++) b.set(x, 12, 'wall', true); for (let y = 13; y < 18; y++) b.set(39, y, 'wall', true);
      b.obj('mat', 36, 14); b.obj('lamp', 34, 14); b.obj('jar', 38, 13); b.light(34, 13, 50, '#ffc878', 0.12);
      b.spot('priere', 36, 15); b.light(36, 15, 60, '#fff0c0', 0.05);
    } else {
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
    }
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
    // (2.29 : une ville de passage, sous le califat, n'a plus les enseignes de Rûm à sa porte ni à son palais)
    const rum = !(L && L.visite);
    b.spot('porte', 31, 43); if (rum) { b.obj('aquila', 28, 40); b.obj('aquila', 35, 40); }
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
    b.house(8, 4, 12, 9, RS); b.obj('column', 11, 14); b.obj('column', 17, 14); b.fill(10, 13, 9, 3, 'stone'); if (rum) b.obj('aquila', 9, 14); b.spot('palais', 14, 15);
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
    const env = { time: 'noos', ambient: '#6a62c8', grade: [`hsl(${hue},90%,55%)`, 0.2], particles: 'noos', hue, rate: 9, bg: 'noos', scan: true, bloom: 0.36, lightA: 1, music: 'noos' };
    // 2.x : une graine (o.g) fait du lieu un labyrinthe, tiré par dedale.js à la profondeur o.n ; sans graine, le lieu d'avant
    if (o.g !== undefined && window.ISNAD_DEDALE) { const p = window.ISNAD_DEDALE.plan(I.rng(o.g >>> 0), o.n | 0, o.descente ? 'descente' : 'chapitre'); if (p) return dedale(b, p, hue, env, o); }
    const room = (name, cx, cy, hw, hh) => { b.fill(cx - hw, cy - hh, hw * 2 + 1, hh * 2 + 1, 'nfloor', false); b.spot(name, cx, cy); b.light(cx, cy, 70 + hw * 10, `hsl(${hue},90%,60%)`, 0.1); };
    const bridge = (x1, y1, x2, y2) => { const sx = Math.min(x1, x2), ex = Math.max(x1, x2), sy = Math.min(y1, y2), ey = Math.max(y1, y2); for (let x = sx; x <= ex; x++) for (let k = 0; k < 2; k++) if (b.g[(y1 + k) * b.w + x] === 'void') b.set(x, y1 + k, 'nbridge', false); for (let y = sy; y <= ey + 1; y++) for (let k = 0; k < 2; k++) if (b.g[y * b.w + x2 + k] === 'void') b.set(x2 + k, y, 'nbridge', false); };
    bridge(6, 20, 18, 20); bridge(18, 20, 30, 11); bridge(18, 20, 30, 28); bridge(18, 8, 18, 20); bridge(18, 20, 18, 32); bridge(30, 11, 47, 19); bridge(30, 28, 47, 21);
    room('seuil', 6, 20, 3, 2); room('noeud1', 18, 20, 3, 3); room('noeud2', 30, 11, 3, 2); room('noeud3', 30, 28, 3, 2); room('faille', 18, 8, 2, 2); room('miroir', 18, 32, 2, 2); room('coeur', 48, 20, 6, 5);
    [[3, 18], [9, 18], [15, 17], [21, 17], [15, 23], [21, 23], [27, 9], [33, 9], [27, 30], [33, 30], [42, 15], [54, 15], [42, 25], [54, 25], [16, 6], [20, 6], [16, 34], [20, 34]].forEach(p => { if (b.free(p[0], p[1])) b.obj('pylon', p[0], p[1], { hue }); });
    b.light(48, 20, 150, `hsl(${(hue + 150) % 360},100%,65%)`, 0.15);
    return b.finish(env);
  }
  // Le labyrinthe : les ponts et les salles du plan, un lieu nommé au milieu de chaque salle, sa lumière, des pylônes aux
  // coins des grandes salles (jamais contre une porte). Le plan a déjà été vérifié : tous les lieux y sont reliés.
  function dedale(b, p, hue, env, o) {
    const sol = (x, y) => x >= 0 && y >= 0 && x < p.w && y < p.h ? p.g[y * p.w + x] : 0;
    for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const t = sol(x, y); if (t) b.set(x, y, t === 1 ? 'npont' : t === 3 ? 'nabri' : 'nfloor', false); }
    // les arêtes : tout ce qui se marche est bordé d'un trait de lumière, là où il touche le vide — on lit le dédale d'un coup d'œil
    b.aretes = c => { const e = G.D > 1 ? 0.5 : 1;
      for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const t = sol(x, y); if (!t) continue; const X = x * T, Y = y * T, h2 = t === 3 ? 44 : hue;
        [[0, -1, X, Y, T, e, X, Y, T, 3], [0, 1, X, Y + T - e, T, e, X, Y + T - 3, T, 3], [-1, 0, X, Y, e, T, X, Y, 3, T], [1, 0, X + T - e, Y, e, T, X + T - 3, Y, 3, T]].forEach(q => { if (sol(x + q[0], y + q[1])) return;
          c.fillStyle = `hsla(${h2},100%,72%,.2)`; c.fillRect(q[6], q[7], q[8], q[9]); c.fillStyle = `hsla(${h2},100%,${t === 1 ? 76 : 80}%,${t === 1 ? 0.9 : 0.95})`; c.fillRect(q[2], q[3], q[4], q[5]); }); } };
    Object.keys(p.lieux).forEach(nom => { const l = p.lieux[nom], s = p.salles[nom], abri = sol(l[0], l[1]) === 3;
      b.spot(nom, l[0], l[1]); b.light(l[0], l[1], 60 + s[2] * 7, abri ? '#ffe9b0' : `hsl(${nom === 'coeur' || nom === 'issue' ? (hue + 150) % 360 : hue},90%,60%)`, 0.1);
      if (s[2] >= 7 && s[3] >= 5) [[s[0], s[1]], [s[0] + s[2] - 1, s[1]], [s[0], s[1] + s[3] - 1], [s[0] + s[2] - 1, s[1] + s[3] - 1]].forEach(q => {
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(d => sol(q[0] + d[0], q[1] + d[1]) === 1)) return; if (b.free(q[0], q[1])) b.obj('pylon', q[0], q[1], { hue }); }); });
    env.dedale = { n: o.n | 0, tour: p.tour, graine: o.g, descente: !!o.descente, loin: p.loin, pas: p.pas, interdite: p.interdite ? Object.assign({ hue }, p.interdite) : null };
    const m = b.finish(env); if (env.dedale.interdite) Object.assign(env.dedale.interdite, interdite(env.dedale.interdite)); // l'image se refait avec la carte (et donc avec le dessin choisi)
    return m;
  }
  /* 2.x — la pièce interdite (demande du décideur, 19 novembre ; dedale.js la place, rodeurs.js la fait parler). Une image à
     part, posée sur la carte au-dessus du sol et sous les personnages : elle ne change rien à ce qui se marche — la porte et
     la pièce sont du vide, que rien ne traverse. Derrière la porte, la masse fermée de la pièce : un mur, un toit, sa face
     sud dans l'ombre, bordée d'une lueur rouge sombre. La porte, lourde, dans le mur qui regarde « devant » : des montants de
     pierre, un vantail de planches cerclé de fer, un seuil d'ombre (c'est par là que filtre la fumée) ; dessus, droit quel que
     soit le mur, le signe d'interdit : un cercle rouge barré, posé au point (ni lettre, ni émoji, ni symbole religieux).
     Rend { img, ox, oy } : l'image et la place de son coin, en points de la carte. */
  const ANGLE = { sud: 0, ouest: Math.PI / 2, nord: Math.PI, est: -Math.PI / 2 };
  const SIGNE = ['..RRRRR..', '.RwwwwwR.', 'RwRwwwwwR', 'RwwRwwwwR', 'RwwwRwwwR', 'RwwwwRwwR', 'RwwwwwRwR', '.RwwwwwR.', '..RRRRR..'];
  function interdite(q) {
    const s = q.salle, P = q.porte, x0 = Math.min(s[0], P[0]), y0 = Math.min(s[1], P[1]), x1 = Math.max(s[0] + s[2] - 1, P[0]), y1 = Math.max(s[1] + s[3] - 1, P[1]);
    const ox = x0 * T - 2, oy = y0 * T - 2, cv = G.toile((x1 - x0 + 1) * T + 4, (y1 - y0 + 1) * T + 4), c = cv.getContext('2d'), f = G.D > 1 ? 0.5 : 1;
    const g2 = v => Math.round(v * G.D) / G.D, R = (x, y, w, h, col) => { const a = g2(x), b = g2(y); c.fillStyle = col; c.fillRect(a, b, g2(x + w) - a, g2(y + h) - b); }; // au point réel près : net dans les trois dessins
    c.translate(-ox, -oy);
    // la pièce : le haut du mur tout autour, le toit au milieu (des rangs de tuiles, un faîte), la face sud dans l'ombre
    const X = s[0] * T, Y = s[1] * T, L = s[2] * T, H = s[3] * T, face = Math.min(6, Math.round(H * 0.35)), toitH = H - face - 6;
    R(X, Y, L, H, '#5e3350'); R(X, Y, L, f, '#8a5272'); R(X, Y, f, H - face, '#74435f');
    if (toitH > 0) { R(X + 3, Y + 3, L - 6, toitH, '#3a1b30');
      for (let k = 0, ty = Y + 5; ty < Y + 3 + toitH; k++, ty += 3) for (let tx = X + 4 + (k % 2) * 2; tx < X + L - 5; tx += 4) R(tx, ty, 2.5, f, '#55294a');
      if (L >= H) R(X + 3, Y + 3 + Math.floor(toitH / 2), L - 6, f, '#7a4468'); else R(X + Math.floor(L / 2), Y + 3, f, toitH, '#7a4468'); }
    R(X, Y + H - face, L, face, '#2a1222'); R(X, Y + H - face, L, f, '#9a5878');
    for (let jx = X + 3; jx < X + L - 1; jx += 4) R(jx, Y + H - face + 1.5, f, face - 2, '#160810');
    c.fillStyle = 'rgba(255,96,124,.85)'; c.fillRect(X, Y, L, f); c.fillRect(X, Y + H - f, L, f); c.fillRect(X, Y, f, H); c.fillRect(X + L - f, Y, f, H);
    // la porte : dessinée « devant en bas », puis tournée vers devant
    const cx = P[0] * T + 8, cy = P[1] * T + 8;
    c.save(); c.translate(cx, cy); c.rotate(ANGLE[q.face] || 0); c.translate(-8, -8);
    R(0, 0, 16, 16, '#4a2640'); R(0, 0, 16, f, '#8a5272');
    R(0, 0, 3.5, 16, '#7d4c66'); R(12.5, 0, 3.5, 16, '#7d4c66'); R(0, 0, 16, 3, '#7d4c66'); R(0.5, 0.5, 2, 15.5, '#a36d8a'); R(13, 0.5, 2, 15.5, '#5a3048'); R(0.5, 0.5, 15, 1.5, '#a36d8a');
    R(3.5, 3, 9, 13, '#74462a');
    for (const px of [5.5, 8, 10.5]) R(px, 3, f, 13, '#3e2212');
    for (const by of [5.5, 11.5]) { R(3.5, by, 9, 1.5, '#77727f'); R(3.5, by, 9, f, '#aaa4b6'); for (const rx of [4.5, 8, 11]) R(rx, by + 0.25, 1, 1, '#d2ccdc'); }
    R(3.5, 15, 9, 1, '#050205');
    c.fillStyle = 'rgba(255,96,124,.85)'; c.fillRect(0, 0, f, 16); c.fillRect(16 - f, 0, f, 16); c.fillRect(0, 0, 16, f);
    c.restore();
    // le signe d'interdit, droit : un disque pâle, un cercle rouge, une barre du haut à gauche au bas à droite — au point ;
    // dans le dessin d'origine, neuf points sur neuf, posés un à un (SIGNE)
    if (G.D > 1) { const n = 18, pt = 0.5, r0 = n / 2;
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const dx = i + 0.5 - r0, dy = j + 0.5 - r0, r = Math.hypot(dx, dy) / r0, barre = Math.abs(dx - dy) / Math.SQRT2 / r0;
        const col = r > 1 ? null : r > 0.68 ? '#d0182a' : barre < 0.17 ? '#d0182a' : '#f1e6e4'; if (col) R(cx - 4.5 + i * pt, cy - 4.5 + j * pt, pt, pt, col); } }
    else SIGNE.forEach((l, j) => [...l].forEach((ch, i) => { if (ch !== '.') R(cx - 4 + i, cy - 4 + j, 1, 1, ch === 'R' ? '#d0182a' : '#f1e6e4'); }));
    return { img: cv, ox, oy };
  }
  M.interdite = interdite;

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

  /* ---------- Cité-Miroir : un vieux quartier de pierre au pied des tours de verre (prototype « ville de verre ») ----------
     Les cases, les lieux nommés et le passage sont ceux d'avant : la rue (rangs 9 à 16) se marche, le reste est plein.
     Le décor se peint une fois, d'un tenant, sur la toile de la carte (peindreCite) : au nord, les maisons de pierre de
     corail, leurs tours à vent et leurs claustras ; juste derrière, le viaduc d'un métro, puis des tours de verre géantes
     qui renvoient le couchant ; deux d'entre elles descendent jusqu'à la rue — celle du grand écran, celle de l'ascenseur.
     Au-dessus, le ciel luit comme un écran : une voûte de carreaux, sans astre ni étoile. La pierre polie de la rue renvoie
     la ville, pâle et renversée ; devant l'écran, un miroir d'eau et ses jets. Sur la rue, l'ombre longue des tours. Au
     sud, le quai, la crique, ses barques, un boutre et l'embarcadère. Ni lettre, ni signe, ni édifice religieux ; personne
     n'est ajouté au décor (les rames du métro et les bateaux sont vides).
     La Cité éteinte (M.eteinte) : posée par le moteur quand l'idole du chapitre `fin` tombe (battle.js), levée au début de
     tout chapitre (world.js). Les écrans et les bornes sont du verre noir, les tours n'ont plus de lumière, la voûte est
     éteinte : derrière elle, le ciel de nuit, et seulement alors des points dedans ; le verre noir des tours le renvoie,
     points compris — sur un téléphone, c'est lui qu'on voit au-dessus du grand écran. Les cases, les objets, leurs
     graines et le passage ne changent pas. */
  M.eteinte = false;
  // ce qui distingue, dans le cache des cartes (world.js), une Cité éteinte d'une Cité allumée
  M.cle = id => (M.eteinte && (D.MAPS[id] || {}).gabarit === 'cite') ? '|eteinte' : '';
  // le miroir d'eau devant le grand écran (x0, x1, y0, y1, en points de la carte) et ses quatre jets, en deux rangs
  // décalés ; le milieu reste libre (le lieu 'ecran', où Idris arrive)
  const MIROIR = [404, 572, 164, 188], JETS = [[416, 182], [440, 171], [536, 171], [560, 182]];
  function cite(id, o, L, graine) {
    const b = new MB(id, 60, 22, 'cdalle', o, graine), et = b.eteinte = !!M.eteinte;
    b.fill(0, 0, 60, 7, 'ctour', true); b.fill(0, 7, 60, 2, 'cfacade', true); b.fill(0, 17, 60, 5, 'ccrique', true); b.fill(0, 12, 60, 1, 'crigole', false);
    // le quai et le ponton de l'embarcadère ne bougent pas : l'eau (ccrique) s'anime autour d'eux ; au seuil de la ruelle, de vieux pavés
    b.fill(0, 17, 60, 1, 'cquai', true); b.fill(42, 18, 6, 2, 'ceau', true); b.fill(43, 9, 3, 3, 'cpave', false);
    const cols = ['#ffcf6a', '#39e6ff', '#ffb45a', '#ff6ac8', '#ffe2a0'], v15 = G.lum === 215, noir = et ? { eteint: 1 } : undefined;
    // 2.18 : des lumières plus franches (le 5e nombre d'une lumière est son vacillement, non sa force). Retouche du
    // crépuscule : la lumière d'une lampe tombe à son pied, plus serrée — une flaque sur les dalles (peindreCite), et la
    // rue entre deux lampes reste dans le soir
    const nr = v15 ? 70 : 58, nf = v15 ? 0.3 : 0.12;
    // les objets d'avant gardent leur nombre, leur ordre, leurs cases et leur empreinte : les caisses tirées ensuite tombent
    // aux mêmes cases. Devant le grand écran, un banc de pierre bas plutôt qu'un fût, pour ne pas le cacher. Éteinte, la
    // Cité garde ses lampes de rue, toutes d'un même jaune, plus basses.
    b.obj('cgrandecran', 30, 9, noir);
    b.lampes = [];
    for (let x = 4; x < 58; x += 7) { const c = et ? '#ffcf8a' : cols[(x >> 1) % cols.length]; if (x === 32) b.obj('cplot', x, 9); else { b.obj('cposte', x, 9, { color: c }); b.light(x, v15 ? 8 : 9, et ? 60 : nr, c, nf); b.lampes.push([x * T + 8, c]); } }
    b.obj('cborne', 14, 16, noir); b.obj('cborne', 46, 16, noir);
    if (!et) { b.light(30, 8, v15 ? 130 : 118, '#c45cff', nf); b.light(14, 15, v15 ? 80 : 70, '#39e6ff', nf); b.light(46, 15, v15 ? 80 : 64, '#ff6ac8', nf); }
    b.set(56, 8, 'cgrille', true); b.light(56, 9, 64, '#ffd28a', 0.1);
    // le filet de laiton de la rigole
    if (!v15) for (let x = 2; x < 60; x += 6) b.light(x, 12, 34, x % 12 === 2 && !et ? '#7fe8ff' : '#ffd080', 0.08);
    b.spot('parvis', 4, 13); b.spot('rue', 16, 13); b.spot('ecran', 30, 11); b.spot('ruelle', 44, 14); b.spot('ascenseur', 56, 10);
    b.scatter('ccaisse', 5, 2, 9, 56, 8);
    // 2.28 (D218) : au bout de la rue, à l'est, on passe à pied dans les quartiers (passages.js). Posé après le tirage des
    // caisses (un lieu en réserve les cases voisines) : elles tombent aux mêmes cases, et aucune case ne change
    b.spot('traverse', 59, 14);
    // après le tirage : ce qui ne bloque rien (posé sur des cases déjà pleines, ou au ras du sol) — dattiers du quai, barques,
    // un boutre, les jets du miroir d'eau (chacun sa lueur bleue), les rames du métro
    [6, 13, 26, 35, 52, 58].forEach(x => { b.obj('cpalmier', x, 17); b.light(x, 17, 54, '#ffb46a', 0.08); });
    [[8, 18, 1], [11, 20], [16, 19, 1], [21, 18], [24, 20, 1], [29, 19], [34, 18, 1], [40, 19], [49, 19, 1], [53, 19], [57, 20, 1]].forEach(a => b.obj('cabra', a[0], a[1], a[2] ? { flip: 1 } : undefined));
    b.obj('cboutre', 2, 20);
    [[2, 18], [21, 18], [44, 18], [53, 19]].forEach(a => b.light(a[0], a[1], 34, '#ffd9a0', 0.15));
    JETS.forEach(([x, y], i) => { b.obj('cjet', (x - 8) / T, (y - 15) / T).ph = i * 1.6; b.light((x - 8) / T, (y - 18) / T, 24, '#3aa8ff', 0.1); });
    b.rame = b.obj('crame', 30, 5);
    b.peint = c => peindreCite(c, b);
    // La Cité au crépuscule — un couchant orangé qui passe au magenta ; il ne pleut plus : une brume de sable. Retouche du
    // crépuscule (2.18 ; décideur, 19 novembre : la ramener à la lumière validée, luminance de la scène vers 27 à 30) : le
    // couchant est derrière les tours, l'ambiance plus basse, le halo plus faible ; ce sont les lampes, les vitrines, les
    // néons et le grand écran qui portent la rue. Éteinte : la nuit, sans brume ni sursaut d'écran.
    // La vue regarde plus haut que celui qui mène (world.js, W.regard) : elle cherche les toits du vieux quartier (y = 100),
    // ses pieds au plus bas aux quatre cinquièmes de l'image sur un téléphone tenu en hauteur (au-dessus de la boussole), aux deux
    // tiers ailleurs (au-dessus de la boîte de dialogue) ; à l'ouverture d'un chapitre, et quand la Cité éteinte se tait,
    // elle lève les yeux (leve) : les tours à vent, le viaduc, le pied des tours de verre — éteinte, le verre noir et le ciel.
    const regard = [100, 0.8, 0.64], leve = [et ? 20 : 56, 0.97];
    if (et) return b.finish(v15 ? { time: 'cite', ambient: '#3a4a96', grade: ['#2a3a9a', 0.2], rate: 0, bg: 'cite', bloom: 0.24, lightA: 1, music: 'cite', regard, leve }
      : { time: 'cite', ambient: ['#6a76c4', '#3e4898'], grade: ['#1a48b8', 0.18], etalon: [null, '#04122a'], rate: 0, bg: 'cite', bloom: 0.22, lightA: 1, music: 'cite', regard, leve });
    return b.finish(v15 ? { time: 'cite', ambient: '#5a5ca8', grade: ['#7a2cff', 0.2], particles: 'brume', rate: 8, bg: 'cite', scan: true, bloom: 0.3, lightA: 1, music: 'cite', regard, leve }
      : { time: 'cite', ambient: ['#a04a34', '#58247a'], grade: ['#ff3d8f', 0.14], particles: 'brume', rate: 8, bg: 'cite', scan: true, bloom: 0.18, lightA: 1, music: 'cite', regard, leve });
  }
  // un aplat de la Cité : en dessin fin, tel quel ; au dessin d'origine (un point réel par point logique), calé sur les points
  // entiers — un filet d'un demi-point y devient un point, au lieu d'une demi-teinte floue
  const aplat = c => (c.canvas.hd || 1) > 1 ? (col, x, y, w, h) => { c.fillStyle = col; c.fillRect(x, y, w, h); }
    : (col, x, y, w, h) => { c.fillStyle = col; const x0 = Math.round(x), y0 = Math.round(y); c.fillRect(x0, y0, Math.max(1, Math.round(x + w) - x0), Math.max(1, Math.round(y + h) - y0)); };
  // les manières d'une tour de verre (la Cité-Miroir, sur la carte et derrière ses combats)
  function formeTour(c, x, w, top, bas, st) { const cx = x + w / 2; c.beginPath();
    if (st === 'gradins') { const h = bas - top, g = Math.floor(x / 10) % 2 ? 1 : -1, X = k => g > 0 ? x + k * w : x + w - k * w;
      // des retraits d'un seul côté, comme des marches : ni flèche, ni symétrie
      c.moveTo(X(0), bas); c.lineTo(X(0), top); c.lineTo(X(0.52), top); c.lineTo(X(0.52), top + h * 0.22); c.lineTo(X(0.76), top + h * 0.22); c.lineTo(X(0.76), top + h * 0.46); c.lineTo(X(1), top + h * 0.46); c.lineTo(X(1), bas); }
    else if (st === 'torsade') { const pts = []; for (let y = top; y <= bas; y += 2) { const ph = (y - top) / 22, hw = w / 2 * (0.76 + 0.24 * Math.abs(Math.cos(ph))); pts.push([cx - hw, y, cx + hw]); }
      c.moveTo(cx - w * 0.38, top); pts.forEach(p => c.lineTo(p[0], p[1])); pts.reverse().forEach(p => c.lineTo(p[2], p[1])); c.lineTo(cx + w * 0.38, top); }
    else if (st === 'lame') { c.moveTo(x, bas); c.lineTo(x, top + 14); c.lineTo(x + w, top); c.lineTo(x + w, bas); }
    else c.rect(x, top, w, bas - top);
    c.closePath(); }
  // une tour de verre, à contre-jour : un verre sombre que le couchant ne prend qu'au bord et en bas, ses meneaux dorés,
  // quelques étages allumés sur la trame des meneaux, un éclat de soleil renvoyé. La nuit (la Cité éteinte) : un verre
  // noir qui renvoie le ciel et ses points, des meneaux à peine vus, aucun étage allumé, aucun éclat — le tirage (r) reste
  // le même, pour que la suite du décor ne bouge pas.
  function tourDeVerre(c, r, x, w, top, bas, st, nuit) {
    const rect = aplat(c);
    const grad = (x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(q => g.addColorStop(q[0], q[1])); return g; };
    c.save(); formeTour(c, x, w, top, bas, st); c.clip();
    // à contre-jour : le couchant est derrière elles — un verre sombre qui ne prend le soleil qu'au bord et en bas
    c.fillStyle = grad(0, top, 0, bas, nuit ? [[0, '#070a18'], [0.5, '#0e1330'], [1, '#1a2244']] : [[0, '#1a1230'], [0.35, '#2a1c44'], [0.7, '#46285a'], [1, '#7e3a5a']]); c.fillRect(x - 6, top - 12, w + 12, bas - top + 12);
    c.fillStyle = grad(x, 0, x + w, 0, nuit ? [[0, 'rgba(120,150,220,.12)'], [0.4, 'rgba(120,150,220,.03)'], [1, 'rgba(0,0,12,.3)']] : [[0, 'rgba(255,170,100,.3)'], [0.3, 'rgba(255,170,100,.06)'], [1, 'rgba(12,6,30,.34)']]); c.fillRect(x - 6, top - 12, w + 12, bas - top + 12);
    // éteinte : le verre noir renvoie le ciel de nuit, et ses points s'y voient (tirés à part : r ne bouge pas)
    if (nuit) { const re = I.rng(I.hash('cite|verre|' + Math.round(x) + '|' + Math.round(top))), n = Math.round(w * (bas - top) / 240);
      for (let i = 0; i < n; i++) { const sx = Math.floor((x + re() * w) * 2) / 2, sy = Math.floor((top + re() * (bas - top)) * 2) / 2, a = 0.4 + re() * 0.5, gros = re() < 0.22 ? 1 : 0.5; rect(`rgba(226,234,255,${a.toFixed(2)})`, sx, sy, gros, gros); } }
    for (let xx = x + 1.5; xx < x + w; xx += 3) rect(nuit ? 'rgba(150,150,140,.1)' : 'rgba(236,192,112,.3)', xx, top - 12, 0.5, bas - top + 12);
    for (let yy = Math.ceil(top / 4) * 4; yy < bas; yy += 4) rect(nuit ? 'rgba(2,4,14,.4)' : 'rgba(30,14,44,.32)', x - 6, yy, w + 12, 0.5);
    if (st === 'torsade') for (let y = top; y < bas; y += 2) { const ph = (y - top) / 22; rect(nuit ? 'rgba(140,170,230,.07)' : 'rgba(255,222,170,.26)', x + w / 2 + Math.sin(ph) * w * 0.3 - 3, y, 6, 2); }
    // quelques étages allumés, en courtes rangées alignées sur les meneaux ; rarement une vitre bleutée
    for (let yy = Math.ceil(top / 4) * 4 + 1; yy < bas - 3; yy += 4) if (r() < 0.14) { const n = 2 + Math.floor(r() * 5), k0 = Math.floor(r() * Math.max(1, w / 3 - n)), col = r() < 0.92 ? 'rgba(255,210,150,.48)' : 'rgba(170,226,255,.36)';
      for (let k = 0; k < n; k++) if (r() < 0.85 && !nuit) rect(col, x + 2 + (k0 + k) * 3, yy + 0.5, 2.5, 2.5); }
    const gx = x + w * (0.2 + r() * 0.25); if (!nuit) { c.fillStyle = grad(gx - 3, 0, gx + 3, 0, [[0, 'rgba(255,232,176,0)'], [0.5, 'rgba(255,232,176,.4)'], [1, 'rgba(255,232,176,0)']]); c.fillRect(gx - 3, top - 12, 6, bas - top + 12); }
    c.restore();
    c.save(); formeTour(c, x, w, top, bas, st); c.strokeStyle = nuit ? 'rgba(4,6,16,.8)' : 'rgba(40,18,48,.7)'; c.lineWidth = 0.5; c.stroke(); c.restore();
    const y0 = Math.max(top + (st === 'lame' ? 14 : 0), 0); rect(nuit ? 'rgba(140,160,210,.22)' : 'rgba(255,200,140,.5)', x, y0, 0.5, bas - y0);
    const or = nuit ? '#4a4438' : '#d8b070';
    if (st === 'gradins') { const h = bas - top, g = Math.floor(x / 10) % 2 ? 1 : -1, X = k => g > 0 ? x + k * w : x + w - k * w;
      [[0, 0.52, 0], [0.52, 0.76, 0.22], [0.76, 1, 0.46]].forEach(([a, z, f]) => rect(or, Math.min(X(a), X(z)), top + h * f, Math.abs(X(z) - X(a)), 0.75)); }
    if (st === 'couronne') for (let k = 0; k < 4; k++) { const fx = x + w * (0.14 + k * 0.24); c.fillStyle = or; c.beginPath(); c.moveTo(fx - 1.5, top); c.lineTo(fx, top - 10 - (k % 3) * 5); c.lineTo(fx + 1.5, top); c.fill(); }
    if (st === 'rideau') { for (let k = 0; k < 3; k++) rect(or, x + 2 + k * (w - 5) / 2, top - 8, 1, 8); rect(or, x + 1, top - 8, w - 2, 0.75); rect(or, x + 1, top - 4, w - 2, 0.5); } }
  M.tourDeVerre = tourDeVerre;
  // Les tours de verre derrière le vieux quartier : [x, largeur, sommet, manière]. Des formes communes aux grandes villes
  // d'aujourd'hui — tour à gradins, tour torsadée, lame, mur-rideau, couronne d'ailettes —, aucune n'est la copie d'un
  // édifice ; les plus hautes sont de simples murs-rideaux.
  const TOURS_CITE = [[8, 46, -30, 'rideau'], [66, 30, 16, 'gradins'], [108, 40, -14, 'torsade'], [162, 24, 34, 'lame'], [194, 54, -40, 'rideau'], [262, 32, 4, 'gradins'],
    [306, 40, 24, 'couronne'], [358, 30, -22, 'lame'], [572, 40, -2, 'torsade'], [622, 28, 30, 'lame'], [656, 52, -30, 'rideau'], [722, 34, 10, 'gradins'], [770, 44, 22, 'couronne'], [818, 28, -12, 'lame']];
  // les deux tours qui descendent jusqu'à la rue : [x, largeur]
  const PIEDS_CITE = [[392, 184], [848, 112]];
  // le viaduc du métro : le haut de son tablier (ses deux voies), juste au-dessus des toits du vieux quartier
  const VIADUC = 94;
  // un viaduc mince, vu de côté : le tablier clair, ses deux voies, la poutre éclairée par-dessous, ses piles (sur une toile, de x0 à x1)
  function viaduc(c, x0, x1, y, bas, pas) {
    const rect = aplat(c);
    for (let x = x0 + pas / 2; x < x1; x += pas) { rect('#7a5a5a', x - 2, y + 3, 4, bas - y - 3); rect('rgba(255,210,150,.35)', x - 2, y + 3, 0.75, bas - y - 3); }
    rect('#5a4450', x0, y - 3.5, x1 - x0, 1.5); rect('#8a7a80', x0, y - 3.5, x1 - x0, 0.5); rect('#5a4450', x0, y - 1, x1 - x0, 1); rect('#8a7a80', x0, y - 1, x1 - x0, 0.5);
    rect('#d8c6aa', x0, y, x1 - x0, 2.5); rect('#f2e2c4', x0, y, x1 - x0, 0.5); rect('#8e6e66', x0, y + 2.5, x1 - x0, 1); rect('rgba(255,214,150,.8)', x0, y + 3.5, x1 - x0, 0.5);
  }
  M.viaduc = viaduc;
  function peindreCite(c, b) {
    const r = I.rng(I.hash('cite|vieux-quartier')), W = b.w * T, PIED = 144, QUAI = 272, H = b.h * T, lights = b.lights, masque = [], nuit = !!b.eteinte;
    const hd1 = (c.canvas.hd || 1) === 1, rect = aplat(c);
    const grad = (x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(s => g.addColorStop(s[0], s[1])); return g; };
    const lumiere = (x, y, rr, col, f) => lights.push({ x, y, r: rr, color: col, flicker: f || 0 });
    /* --- le ciel : un écran qui luit, une voûte de carreaux ; ni astre ni étoile. Éteint : derrière le verre noir, le ciel
       de nuit, et quelques points dedans (tirés à part : le reste du décor ne bouge pas) --- */
    c.fillStyle = grad(0, 0, 0, 126, nuit ? [[0, '#02030a'], [0.55, '#060a1a'], [1, '#121a36']] : [[0, '#3a1c66'], [0.42, '#a8367e'], [0.78, '#ff7f52'], [1, '#ffc27c']]); c.fillRect(0, 0, W, 126);
    if (nuit) { const re = I.rng(I.hash('cite|etoiles')); for (let i = 0; i < 260; i++) { const x = Math.floor(re() * W), y = Math.floor(re() * 112), a = 0.55 + re() * 0.45; rect(`rgba(236,240,255,${a.toFixed(2)})`, x, y, 1, 1); } }
    for (let y = 5; y < 100; y += 11) rect(nuit ? `rgba(150,170,220,${(0.06 - y / 2400).toFixed(3)})` : `rgba(255,226,240,${(0.2 - y / 600).toFixed(3)})`, 0, y, W, 0.5);
    for (let x = 0; x < W; x += 18) rect(nuit ? 'rgba(150,170,220,.035)' : 'rgba(255,226,240,.09)', x, 0, 0.5, 100);
    for (let i = 0; i < 46; i++) { const x = Math.floor(r() * W / 18) * 18, y = 5 + Math.floor(r() * 8) * 11, a = 0.05 + r() * 0.09; if (!nuit) rect(`rgba(255,196,226,${a.toFixed(3)})`, x + 0.5, y + 0.5, 17.5, 10.5); }
    /* --- au loin, d'autres tours, voilées par la brume de sable (sans un point de lumière : rien qui passe pour une étoile) --- */
    for (let x = -6; x < W;) { const w = 10 + r() * 14, top = 34 + r() * 50; rect(nuit ? 'rgba(20,26,50,.92)' : 'rgba(184,92,124,.55)', x, top, w, 130 - top); rect(nuit ? 'rgba(120,140,200,.1)' : 'rgba(255,206,170,.22)', x + w - 1, top, 0.5, 130 - top);
      if (r() < 0.3) rect(nuit ? 'rgba(20,26,50,.92)' : 'rgba(184,92,124,.55)', x + w * 0.2, top - 4, w * 0.6, 4); x += w + 2 + r() * 10; }
    c.fillStyle = grad(0, 60, 0, 126, nuit ? [[0, 'rgba(40,60,120,0)'], [1, 'rgba(40,60,120,.3)']] : [[0, 'rgba(255,186,120,0)'], [1, 'rgba(255,190,124,.55)']]); c.fillRect(0, 60, W, 66);
    /* --- les tours de verre --- */
    const verre = (x, w, top, bas, st) => tourDeVerre(c, r, x, w, top, bas, st, nuit);
    TOURS_CITE.forEach(t => verre(t[0], t[1], t[2], 126, t[3]));
    c.fillStyle = grad(0, 92, 0, 126, nuit ? [[0, 'rgba(30,40,80,0)'], [1, 'rgba(30,40,80,.3)']] : [[0, 'rgba(255,190,124,0)'], [1, 'rgba(255,196,130,.4)']]); c.fillRect(0, 92, W, 34);
    /* --- le viaduc du métro, entre les tours de verre et le vieux quartier (ses rames passent : objet « crame ») --- */
    viaduc(c, 0, W, VIADUC, 128, 64);
    /* --- les deux tours qui descendent jusqu'à la rue (elles passent devant le viaduc) --- */
    PIEDS_CITE.forEach(p => { verre(p[0], p[1], -40, PIED, 'rideau'); masque.push([p[0], 70, p[1], 40]); });
    // le pied de la tour du grand écran : un socle, deux portes vitrées de part et d'autre (l'écran est un objet, posé devant)
    rect('#2a1a30', 392, 139, 184, 5); rect('#a8874e', 392, 139, 184, 0.75);
    [[397, 24], [553, 20]].forEach(([x, w]) => { rect('#2a1a30', x - 2, 116, w + 4, 28); rect('#a8874e', x - 2, 116, w + 4, 0.75); c.fillStyle = grad(0, 118, 0, 144, [[0, '#ffdca0'], [1, '#d07a44']]); c.fillRect(x, 118, w, 26);
      for (let k = x; k <= x + w; k += w / 3) rect('#8a6a40', k, 118, 0.75, 26); rect('rgba(60,30,40,.35)', x, 130, w, 0.5); lumiere(x + w / 2, 134, 40, '#ffc880', 0.05); });
    // l'ascenseur : une grille de bronze au pied de la tour, au bout de la rue
    rect('#2a1a30', 884, 114, 40, 30); rect('#9a7c4c', 886, 116, 36, 28); rect('#1e1424', 889, 119, 30, 25);
    c.fillStyle = grad(0, 120, 0, 128, [[0, '#ffe4b0'], [1, '#c87a3e']]); c.fillRect(891, 120, 26, 7); rect('#9a7c4c', 889, 127.5, 30, 0.5);
    c.drawImage(G.tile('cgrille', 0, 0), 896, 128); rect('#fff0c0', 913.5, 133, 1.5, 1.5);
    /* --- le vieux quartier : maisons de pierre de corail, tours à vent, claustras, portes de bois --- */
    const TONS = ['#786352', '#725e4d', '#7e6957', '#6e5a49']; // à contre-jour : le couchant est derrière les tours
    const claustra = (x, y, w, h, allume) => { rect('#8a7056', x - 1, y - 1, w + 2, h + 2); rect(allume ? '#ffc878' : '#3a2a26', x, y, w, h);
      c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.strokeStyle = allume ? '#6a4428' : '#6a5440'; c.lineWidth = hd1 ? 1 : 0.5; c.beginPath();
      for (let k = -h; k < w + h; k += 2) { c.moveTo(x + k, y); c.lineTo(x + k + h, y + h); c.moveTo(x + k + h, y); c.lineTo(x + k, y + h); }
      c.stroke(); c.restore(); };
    const porte = x => { const y = PIED - 18; rect('#e6d6b6', x - 1.5, y - 2, 13, 20); rect('#6a4426', x, y, 10, 18); for (let k = 2.5; k < 10; k += 2.5) rect('#4e301a', x + k, y, 0.5, 18);
      rect('#5a3a22', x - 2, y - 3, 14, 1.5); [4, 9, 14].forEach(yy => { rect('#b8945a', x + 1.5, y + yy, 0.75, 0.75); rect('#b8945a', x + 7.75, y + yy, 0.75, 0.75); }); };
    const echoppes = [], boutique = (x, w) => { const y = PIED - 15; echoppes.push([x, w]); rect('#5a3a2a', x - 1, y - 1, w + 2, 16); c.fillStyle = grad(0, y, 0, PIED, [[0, '#ffd08a'], [1, '#c8703c']]); c.fillRect(x, y, w, 15);
      for (let k = 0; k < w / 4; k++) rect(['#a8502e', '#3a6a5a', '#d8b45a', '#7a3a5a'][Math.floor(r() * 4)], x + 1 + k * 4, PIED - 6 - Math.floor(r() * 4), 3, 6);
      for (let k = 0; k * 4 < w + 4; k++) { const col = k % 2 ? '#e8dcc0' : '#b8442e'; rect(col, x - 2 + k * 4, y - 6, 4, 4); rect(col, x - 2 + k * 4 + 0.5, y - 2, 3, 1); rect(col, x - 2 + k * 4 + 1, y - 1, 2, 0.5); }
      lumiere(x + w / 2, PIED - 6, 40, '#ffb460', 0.08); };
    const maisons = (x0, x1) => { let x = x0;
      while (x < x1 - 8) { const w = Math.min(x1 - x, 38 + Math.floor(r() * 46)), top = 104 + Math.floor(r() * 12), ton = TONS[Math.floor(r() * TONS.length)];
        // une tour à vent trapue, posée sur le toit (sa base se cache derrière la façade) : jamais seule, jamais plus haute qu'il ne faut
        if (w >= 40 && r() < 0.6) { const bx = x + 2 + Math.floor(r() * (w - 34)); c.drawImage(G.obj('cbarjil', null, Math.floor(r() * 99)), bx, top + 8 - 34); masque.push([bx - 1, top - 27, 30, 28]); }
        rect(ton, x, top, w, PIED - top);
        for (let i = 0; i < w * (PIED - top) / 10; i++) rect('rgba(112,92,74,.6)', x + Math.floor(r() * w * 2) / 2, top + 3 + Math.floor(r() * (PIED - top - 3) * 2) / 2, 0.5, 0.5);
        rect('rgba(90,56,48,.2)', x + w - 2, top, 2, PIED - top); rect('rgba(255,240,214,.5)', x, top, 0.5, PIED - top);
        rect('#9a826a', x, top, w, 2.5); rect('#5e4a3a', x, top + 2.5, w, 0.5);
        for (let k = x + 3; k < x + w - 3; k += 6) rect('#6a4a30', k, top + 5, 1, 1);
        for (let k = x + 8; k < x + w - 6; k += 22) rect('#5a3c26', k, top + 3, 3, 1.25);
        const mil = x + Math.floor(w / 2);
        if (w >= 52 && r() < 0.45) boutique(x + 6 + Math.floor(r() * (w - 34)), 22); else if (w >= 24) porte(mil - 5);
        if (PIED - top >= 30) { const n = w >= 56 ? 2 : 1; for (let k = 0; k < n; k++) { const wx = n === 1 ? mil - 4 + (r() < 0.5 ? -12 : 12) : x + 7 + k * (w - 22); if (wx > x + 2 && wx + 8 < x + w - 2) claustra(wx, top + 8, 7, 9, r() < 0.55); } }
        if (w >= 48 && r() < 0.3) { const mx = x + 4 + Math.floor(r() * (w - 22)); rect('#7a4e2e', mx, top + 6, 16, 12); claustra(mx + 2, top + 8, 12, 8, true); rect('#5a3a22', mx - 1, top + 5, 18, 1.5); rect('#5a3a22', mx, top + 18, 16, 1); }
        x += w; } };
    maisons(0, 392); maisons(576, 688); maisons(736, 848);
    // la ruelle : une entrée étroite entre deux maisons, sous une poutre ; des marches montent vers une porte éclairée et sa lanterne
    c.fillStyle = grad(688, 0, 736, 0, [[0, '#6a4e40'], [0.3, '#2c1e28'], [0.7, '#2c1e28'], [1, '#4a3632']]); c.fillRect(688, 108, 48, 36);
    c.fillStyle = grad(0, 108, 0, 144, [[0, '#c8a47a'], [1, '#a4825e']]); c.beginPath(); c.moveTo(688, 108); c.lineTo(703, 117); c.lineTo(703, 129); c.lineTo(688, PIED); c.fill();
    c.fillStyle = '#7a6250'; c.beginPath(); c.moveTo(736, 108); c.lineTo(721, 117); c.lineTo(721, 129); c.lineTo(736, PIED); c.fill();
    claustra(691, 118, 6, 9, true); rect('rgba(40,24,30,.25)', 691, 118, 6, 9);
    c.fillStyle = '#b8966c'; c.beginPath(); c.moveTo(688, PIED); c.lineTo(703, 129); c.lineTo(721, 129); c.lineTo(736, PIED); c.fill();
    for (let k = 0; k < 5; k++) { const y = PIED - k * 3, d = PIED - y; rect('#8a6a4e', 688 + d, y - 1.5, 48 - 2 * d, 1.5); rect('#e2c69c', 688 + d + 0.5, y - 3, 47 - 2 * d, 0.75); }
    rect('#5a3a2a', 707.5, 116, 9, 13); rect('#ffc070', 709, 117.5, 6, 11.5); rect('#c88040', 711.75, 117.5, 0.5, 11.5); rect('rgba(90,50,30,.4)', 709, 124, 6, 0.5);
    rect('#5a3a22', 684, 106, 56, 2.5); rect('#3a2618', 711.5, 108.5, 1, 3); rect('#3a2618', 710, 111.5, 4, 0.75); rect('#ffd890', 710.25, 112.25, 3.5, 3); rect('#3a2618', 710, 115, 4, 0.75); lumiere(712, 118, 46, '#ffc070', 0.1);
    /* --- la rue --- */
    // le parvis, devant le quai : de grandes dalles plus claires, et un treillis de losanges incrusté de laiton, discret
    rect('rgba(240,214,170,.08)', 0, 166, 122, 98); rect('rgba(110,80,60,.3)', 0, 164, 124, 2); rect('rgba(110,80,60,.3)', 122, 164, 2, 102); rect('rgba(250,228,190,.25)', 0, 166, 122, 0.5);
    c.save(); c.beginPath(); c.rect(6, 172, 110, 86); c.clip(); c.strokeStyle = 'rgba(236,200,130,.2)'; c.lineWidth = hd1 ? 1 : 0.5; c.beginPath();
    for (let k = -86; k < 116; k += 40) { c.moveTo(6 + k, 172); c.lineTo(6 + k + 86, 258); c.moveTo(6 + k + 86, 172); c.lineTo(6 + k, 258); } c.stroke(); c.restore();
    // devant le grand écran, un miroir d'eau : une mince nappe sur la pierre, au ras des dalles (on y marche), qui renvoie
    // l'écran ; ses jets sortent de grilles rondes (objets « cjet »)
    const [MX0, MX1, MY0, MY1] = MIROIR, rm = I.rng(I.hash('cite|miroir')), ec = G.obj('cgrandecran', nuit ? { eteint: 1 } : null, 1);
    rect('#dcc8a0', MX0 - 2, MY0 - 2, MX1 - MX0 + 4, 2); rect('#f0e0bc', MX0 - 2, MY0 - 2, MX1 - MX0 + 4, 0.5); rect('#b89c74', MX0 - 2, MY1, MX1 - MX0 + 4, 1.5); rect('#8a7050', MX0 - 2, MY1 + 1.5, MX1 - MX0 + 4, 0.5);
    rect('#c9b28c', MX0 - 2, MY0, 2, MY1 - MY0); rect('#c9b28c', MX1, MY0, 2, MY1 - MY0);
    rect(nuit ? 'rgba(14,22,44,.62)' : 'rgba(58,100,150,.36)', MX0, MY0, MX1 - MX0, MY1 - MY0);
    // l'écran s'y renverse (le reflet d'un objet de 34 points de haut posé à y = 126, autour de la ligne y = 160), chaque
    // rangée un peu déplacée par l'eau, et de plus en plus pâle à mesure qu'on s'en éloigne
    c.save(); c.beginPath(); c.rect(MX0, MY0, MX1 - MX0, MY1 - MY0); c.clip();
    for (let y = MY0; y < MY1; y += 0.5) { const ly = 320 - y - 126 - 0.5; if (ly < 0 || ly >= 34) continue; c.globalAlpha = (nuit ? 0.24 : 0.2) * (1 - (y - MY0) / (MY1 - MY0) * 0.7); c.drawImage(ec, 0, ly, 128, 0.5, 424 + Math.round(Math.sin(y * 0.9) * 1.5 * 2) / 2, y, 128, 0.5); }
    c.restore();
    for (let y = MY0 + 1.5; y < MY1; y += 2.5) rect('rgba(10,18,40,.18)', MX0, y, MX1 - MX0, 0.5);
    for (let i = 0; i < 40; i++) rect(nuit ? 'rgba(170,190,240,.16)' : 'rgba(220,240,255,.3)', MX0 + 2 + Math.floor(rm() * (MX1 - MX0 - 10) * 2) / 2, MY0 + 1 + Math.floor(rm() * (MY1 - MY0 - 2) * 2) / 2, 2 + Math.floor(rm() * 8) / 2, 0.5);
    JETS.forEach(([x, y]) => { rect('rgba(200,230,255,.45)', x - 3, y - 2, 6, 0.5); rect('#1a2636', x - 2.5, y - 1.5, 5, 2); rect('#34465e', x - 1.5, y - 1, 3, 1); rect('rgba(200,230,255,.45)', x - 3, y + 0.5, 6, 0.5); });
    // le couchant est bas, derrière les tours : leur ombre longue traverse la rue en biais ; entre elles, la lumière dorée
    // (la nuit, ni l'une ni l'autre)
    c.save(); c.beginPath(); c.rect(0, PIED, W, QUAI - PIED); c.clip(); const pente = 1.15;
    TOURS_CITE.concat(PIEDS_CITE.map(p => [p[0], p[1] * 0.6])).forEach((t, i) => { if (t[1] < 40 || (i > 0 && r() < 0.3)) return; const x = t[0] + 4 + Math.floor(r() * 12), w = t[1] * (0.8 + r() * 0.5), d = (QUAI - PIED) * (pente + (r() - 0.5) * 0.12), al = 0.2 + r() * 0.07;
      if (nuit) return;
      c.fillStyle = `rgba(52,20,78,${(al * 1.55).toFixed(2)})`; c.beginPath(); c.moveTo(x, PIED); c.lineTo(x + w, PIED); c.lineTo(x + w + d, QUAI); c.lineTo(x + d, QUAI); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,214,140,.1)'; c.beginPath(); c.moveTo(x + w, PIED); c.lineTo(x + w + 6, PIED); c.lineTo(x + w + 6 + d, QUAI); c.lineTo(x + w + d, QUAI); c.closePath(); c.fill(); });
    c.restore();
    /* --- la Cité-Miroir : la pierre polie de la rue renvoie les tours de verre qui la dominent — renversées, tassées, pâles,
       rompues dalle par dalle (chaque rang de huit points décalé d'un rien) ; la rigole les renvoie plus nettes. Les tours
       sont repeintes à part (leur propre tirage : le reste du décor ne bouge pas), sur une toile qui va de y = -40 au pied
       des façades ; tout est cuit ici, une fois. --- */
    const HT = PIED + 40, tv = G.toile(W, HT), tc = tv.getContext('2d'), rt = I.rng(I.hash('cite|reflet')); tc.translate(0, 40);
    TOURS_CITE.forEach(t => tourDeVerre(tc, rt, t[0], t[1], t[2], 126, t[3], nuit)); PIEDS_CITE.forEach(q => tourDeVerre(tc, rt, q[0], q[1], -40, PIED, 'rideau', nuit));
    const RH = 100, rv = G.toile(W, RH), rvc = rv.getContext('2d'), kz = HT / RH;
    for (let j = 0; j < RH; j += 0.5) { const sy = HT - 0.5 - j * kz; if (sy < 0) break; rvc.drawImage(tv, 0, sy, W, 0.5, [0, 1, -0.5, 1.5, -1, 0.5][Math.floor((PIED + 2 + j) / 8) % 6], j, W, 0.5); }
    rvc.globalCompositeOperation = 'destination-in'; rvc.fillStyle = grad(0, 0, 0, RH, [[0, 'rgba(0,0,0,1)'], [0.55, 'rgba(0,0,0,.55)'], [1, 'rgba(0,0,0,0)']]); rvc.fillRect(0, 0, W, RH);
    c.save(); c.beginPath(); c.rect(0, PIED, 684, RH + 2); c.rect(740, PIED, W - 740, RH + 2); c.clip(); c.globalAlpha = nuit ? 0.4 : 0.34; c.drawImage(rv, 0, PIED + 2); c.restore();
    c.save(); c.globalAlpha = 0.45; c.drawImage(rv, 0, 0, W, RH * 0.6, 0, 198.5, W, 3.5); c.restore();
    // l'ombre franche au pied des façades, le sable poussé contre les murs
    c.fillStyle = grad(0, PIED, 0, PIED + 24, [[0, 'rgba(40,16,36,.66)'], [0.45, 'rgba(40,16,36,.32)'], [1, 'rgba(40,16,36,0)']]); c.fillRect(0, PIED, W, 24);
    c.fillStyle = 'rgba(200,172,128,.22)'; for (let x = 0; x < W; x += 6 + r() * 20) { if (x > 684 && x < 740) continue; c.beginPath(); c.ellipse(x, PIED + 1.5 + r() * 2, 3 + r() * 6, 1 + r() * 1.2, 0, 0, 6.3); c.fill(); }
    // (retouche du crépuscule) la lumière des lampes et des vitrines tombe sur les dalles : une flaque de la couleur du
    // claustra au pied de chaque fût, un pan chaud devant chaque échoppe (sans tirage : le reste du décor ne bouge pas)
    const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    (b.lampes || []).forEach(([px, col]) => { c.save(); c.translate(px, 164); c.scale(1, 0.34); const g = c.createRadialGradient(0, 0, 2, 0, 0, 30);
      g.addColorStop(0, rgba(col, 0.3)); g.addColorStop(0.5, rgba(col, 0.12)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(-30, -30, 60, 60); c.restore(); });
    echoppes.forEach(([x, w]) => { c.fillStyle = grad(0, PIED, 0, PIED + 22, [[0, 'rgba(255,186,110,.26)'], [1, 'rgba(255,186,110,0)']]);
      c.beginPath(); c.moveTo(x, PIED); c.lineTo(x + w, PIED); c.lineTo(x + w + 9, PIED + 22); c.lineTo(x - 9, PIED + 22); c.closePath(); c.fill(); });
    c.fillStyle = 'rgba(226,196,148,.22)'; c.beginPath(); c.moveTo(690, 192); c.lineTo(734, 192); c.lineTo(728, 214); c.lineTo(704, 222); c.lineTo(694, 210); c.fill();
    if (!nuit) [[396, 572], [850, 958]].forEach(p => { c.fillStyle = 'rgba(255,204,136,.07)'; c.beginPath(); c.moveTo(p[0], PIED + 6); c.lineTo(p[1], PIED + 6); c.lineTo(Math.min(W, p[1] + 50), QUAI - 6); c.lineTo(p[0] + 50, QUAI - 6); c.fill(); });
    /* --- le quai, la crique --- */
    const quai = (x0, x1) => { rect('#a48c6c', x0, QUAI, x1 - x0, 5); rect('#c8b08a', x0, QUAI, x1 - x0, 0.75); for (let x = x0; x < x1; x += 16) rect('#9a7c5c', x, QUAI, 0.5, 5);
      rect('#6e5444', x0, QUAI + 5, x1 - x0, 10); for (let x = x0 + (x0 % 12); x < x1; x += 12) rect('#54402f', x, QUAI + 5, 0.5, 10);
      rect('#54402f', x0, QUAI + 10, x1 - x0, 0.5); rect('#2e2228', x0, QUAI + 14.5, x1 - x0, 1);
      for (let x = x0 + 30; x < x1 - 6; x += 64) { rect('#2a2026', x - 1.5, QUAI - 2, 3, 5); rect('#4a3a40', x - 1.5, QUAI - 2, 3, 0.75); } };
    quai(0, W);
    c.fillStyle = grad(0, QUAI + 15, 0, QUAI + 30, [[0, 'rgba(8,6,20,.5)'], [1, 'rgba(8,6,20,0)']]); c.fillRect(0, QUAI + 15, W, 15);
    // les reflets : les tours, l'écran, les lanternes, dans l'eau qui bouge à peine (la nuit, des tours sombres et le ciel)
    const reflet = (x, w, cs, dens) => { for (let y = QUAI + 18; y < H; y += 2.5) if (r() < dens) { c.fillStyle = cs[Math.floor(r() * cs.length)]; const x0 = x + r() * w * 0.8, l = 2 + r() * w * 0.4; if (hd1) c.fillRect(Math.round(x0), Math.round(y), Math.max(1, Math.round(l)), 1); else c.fillRect(x0, y, l, 0.5); } };
    TOURS_CITE.forEach(t => reflet(t[0], t[1], nuit ? ['rgba(70,90,150,.2)', 'rgba(50,70,130,.2)', 'rgba(110,130,180,.14)'] : ['rgba(255,170,100,.32)', 'rgba(170,96,170,.3)', 'rgba(255,214,150,.25)'], 0.35));
    PIEDS_CITE.forEach(p => reflet(p[0], p[1], nuit ? ['rgba(80,100,160,.2)', 'rgba(110,130,180,.16)'] : ['rgba(255,190,120,.38)', 'rgba(255,214,150,.3)'], 0.55));
    reflet(430, 116, nuit ? ['rgba(60,70,110,.2)', 'rgba(40,50,90,.2)', 'rgba(70,80,120,.16)'] : ['rgba(255,79,200,.4)', 'rgba(120,230,255,.35)', 'rgba(255,190,90,.4)'], 0.7);
    for (let x = 4; x < 58; x += 7) reflet(x * T + 2, 12, ['rgba(255,190,150,.35)', 'rgba(255,214,150,.35)'], 0.5);
    for (let i = 0; i < 90; i++) rect('rgba(200,224,255,.16)', r() * W, QUAI + 18 + r() * (H - QUAI - 18), 3 + r() * 6, 0.5);
    if (nuit) { const re = I.rng(I.hash('cite|etoiles-eau')); for (let i = 0; i < 40; i++) rect(`rgba(220,230,255,${(0.2 + re() * 0.35).toFixed(2)})`, Math.floor(re() * W * 2) / 2, QUAI + 20 + Math.floor(re() * (H - QUAI - 22) * 2) / 2, re() < 0.3 ? 1 : 0.5, 0.5); }
    /* --- l'embarcadère des barques, devant la ruelle : une passerelle, un ponton de bois, une ombrière de toile --- */
    const E0 = 676, E1 = 752;
    rect('rgba(8,6,20,.4)', E0 + 3, 312, E1 - E0, 6);
    rect('#6a4a2e', 704, QUAI + 14, 16, 18); for (let y = QUAI + 16; y < QUAI + 32; y += 2.5) rect('#4e3420', 704, y, 16, 0.5); rect('#a07448', 704, QUAI + 14, 0.75, 18); rect('#a07448', 719.25, QUAI + 14, 0.75, 18);
    rect('#7a5434', E0, 300, E1 - E0, 11); for (let x = E0; x < E1; x += 3) rect('#5a3a22', x, 300, 0.5, 11); rect('#b08250', E0, 300, E1 - E0, 0.75); rect('#3a2618', E0, 310, E1 - E0, 1.5);
    for (const px of [E0 + 3, E0 + 26, E1 - 28, E1 - 5]) { rect('#3a2618', px, 290, 1.5, 12); rect('rgba(255,214,150,.4)', px, 290, 0.5, 12); }
    c.fillStyle = '#efe2c4'; c.beginPath(); c.moveTo(E0 - 4, 291); c.lineTo(E1 + 4, 291); c.lineTo(E1, 285); c.lineTo(E0, 285); c.closePath(); c.fill();
    rect('#d8c49c', E0 - 4, 291, E1 - E0 + 8, 1.5); for (let x = E0 - 4; x < E1 + 4; x += 4) { const col = (x / 4) % 2 ? '#e8dcc0' : '#b8442e'; rect(col, x, 292.5, 4, 1); rect(col, x + 0.5, 293.5, 3, 0.5); rect(col, x + 1, 294, 2, 0.5); }
    rect('#3a2618', 713.25, 294, 0.75, 3); rect('#ffd890', 711.75, 297, 3.5, 3); lumiere(713, 300, 40, '#ffd9a0', 0.1);
    if (b.rame) b.rame.masque = masque;
  }

  /* ---------- 2.23 (D212) : les quartiers de la Cité-Miroir ----------
     Demande du décideur, 21 novembre : « améliore la cité miroir avec des belles voitures, des jeux en tous genres, des
     activités, des courses de voitures […] il y trouve beaucoup d'activités mais tout le monde est triste et seul ». La même
     ville de verre que la rue de la Cité (cite(), plus haut, qui ne change pas d'une case), au même crépuscule, vue d'un peu
     plus haut : au nord, la galerie marchande et ses vitrines, la salle de jeux ouverte sur la rue, des tours de verre ; une
     boucle d'avenues à sens unique, où roulent les voitures (trafic.js) ; au milieu, le parvis et l'ascenseur qui remonte des
     Archives basses, la place du grand écran, et, derrière une haie basse, un coin calme où un tapis est posé au sol ; au
     sud, le parc, sa grande roue et ses manèges qui tournent à vide, et le circuit, sa tribune et ses voitures de course.
     Aucune ville réelle, aucun monument copié, aucune lettre, aucune marque, aucun logo, aucun édifice ni symbole religieux :
     les vitrines montrent des formes, l'écran des couleurs qui coulent, les néons des courbes. Les voitures garées tiennent
     leurs deux cases ; celles qui roulent ont leur corps à part (trafic.js). Les rues (dalles, places, avenues) sont là où
     rôde ce que seul Idris voit (rodeurs.js, env.rues) ; le parc, le coin calme, la tribune et les salles n'en sont pas. */
  const Q = { // la boucle des avenues (le milieu des voies, en points) et le circuit (le milieu de sa piste)
    boucle: [[976, 200], [48, 200], [48, 504], [976, 504]],
    circuit: { x0: 568, x1: 936, y0: 604, y1: 700, r: 48 } };
  M.QUARTIERS = Q;
  function quartiers(id, o, L, graine) {
    const b = new MB(id, 64, 46, 'cdalle', o, graine), v15 = G.lum === 215, T2 = 16;
    // le bâti du nord (tours, façades) et les bords de la carte
    b.fill(0, 0, 64, 8, 'qbat', true); b.fill(0, 0, 1, 46, 'qbat', true); b.fill(63, 0, 1, 46, 'qbat', true); b.fill(0, 45, 64, 1, 'qhaie', true);
    // 2.28 (D218) : au nord-ouest, le trottoir continue vers la rue de la Cité-Miroir — l'entrée de la rue (passages.js)
    b.fill(0, 8, 1, 3, 'cdalle', false);
    // la galerie marchande : un passage couvert, ses vitrines au fond ; la salle de jeux, ouverte sur la rue
    b.fill(8, 6, 20, 2, 'qparvis', false); b.fill(38, 5, 12, 3, 'qsalle', false);
    // les avenues : une boucle à sens unique (vers l'ouest au nord, vers l'est au sud)
    b.fill(2, 11, 60, 2, 'qroute', false); b.fill(2, 30, 60, 2, 'qroute', false); b.fill(2, 11, 2, 21, 'qroute', false); b.fill(60, 11, 2, 21, 'qroute', false);
    // le parvis, la place du grand écran ; le pavillon de l'écran, l'immeuble de l'est
    b.fill(5, 14, 16, 15, 'qparvis', false); b.fill(22, 20, 20, 9, 'qparvis', false);
    b.fill(24, 14, 16, 6, 'qbat', true); b.fill(43, 14, 16, 5, 'qbat', true);
    // le coin calme : une haie basse, du gravier, une ouverture à l'ouest
    b.ring(45, 20, 13, 9, 'qhaie', true); b.fill(46, 21, 11, 7, 'qjardin', false); b.fill(45, 23, 1, 2, 'qjardin', false);
    // le parc, ses allées ; le circuit, sa tribune et l'entrée des stands ; le passage entre les deux
    b.fill(1, 34, 28, 11, 'qgazon', false); b.fill(2, 36, 26, 1, 'qallee', false); b.fill(15, 34, 1, 11, 'qallee', false); b.fill(16, 41, 12, 1, 'qallee', false);
    b.fill(31, 34, 32, 11, 'qpiste', true); b.fill(35, 34, 20, 2, 'qgradin', false); b.fill(32, 34, 3, 2, 'cdalle', false); b.fill(29, 34, 2, 11, 'cdalle', false);
    // les lieux nommés
    b.spot('parvis', 12, 19); b.spot('galerie', 17, 7); b.spot('jeux', 44, 7); b.spot('ecran', 32, 21); b.spot('priere', 51, 24);
    b.spot('parc', 15, 37); b.spot('roue', 8, 43); b.spot('circuit', 33, 35); b.spot('tribune', 45, 34); b.spot('traverse', 2, 9);
    // les lampadaires (la lumière tombe à leur pied)
    const lampe = (x, y, col) => { b.obj('qlampe', x, y); b.light(x, y - 1, v15 ? 64 : 54, col, 0.08); (b.lampes || (b.lampes = [])).push([x * T2 + 11, y * T2 + 15, col]); };
    [6, 13, 20, 27, 34, 41, 48, 55].forEach((x, i) => lampe(x, 10, i % 3 ? '#ffd9a0' : '#ffc0e0'));
    [6, 13, 20, 27, 36, 43, 50, 57].forEach((x, i) => lampe(x, 32, i % 2 ? '#ffd9a0' : '#a8e8ff'));
    [8, 17].forEach(x => lampe(x, 13, '#ffd9a0')); [22, 41].forEach(x => lampe(x, 29, '#ffd9a0'));
    // la galerie : un banc ; les vitrines s'éclairent (peindreQuartiers)
    b.obj('qbanc', 24, 7); for (let x = 9; x < 28; x += 4) b.light(x, 5, 40, '#ffd4a0', 0.05);
    // la salle de jeux : une rangée de bornes contre le mur du fond, chacune sa lueur
    [['#ff4fd8', '#39e6ff'], ['#ffd84a', '#ff5a3a'], ['#39e6ff', '#7dffb0'], ['#c49bff', '#ff4fd8'], ['#7dffb0', '#ffd84a'], ['#ff5a3a', '#39e6ff']].forEach(([col, alt], i) => { const x = 39 + i * 2; b.obj('qborne', x, 5, { color: col, alt }); b.light(x, 5, 30, col, 0.15); });
    b.light(44, 6, 90, '#7a5cff', 0.1);
    // le parvis : l'ascenseur qui remonte des Archives basses, des dattiers dans leurs vasques, deux bancs
    b.obj('qkiosque', 12, 16).x = 13 * T2; b.light(12, 15, 60, '#ffd8a0', 0.08);
    [[6, 15], [19, 15], [6, 27], [19, 27]].forEach(([x, y]) => { b.obj('cpalmier', x, y); b.light(x, y, 40, '#ffb46a', 0.08); });
    b.obj('qbanc', 9, 24); b.obj('qbanc', 16, 24);
    // la place du grand écran : l'écran sur la façade du pavillon, ses bancs
    b.obj('qecran', 31, 19).x = 32 * T2; b.light(32, 17, v15 ? 130 : 120, '#d05cff', 0.1); b.light(26, 18, 60, '#ff7ab0', 0.08); b.light(38, 18, 60, '#5ad8ff', 0.08);
    [25, 29, 35, 39].forEach(x => b.obj('qbanc', x, 26));
    // le coin calme : une natte posée au sol, deux dattiers, un banc — ni édifice, ni symbole
    b.obj('mat', 51, 24); b.light(51, 24, 46, '#fff0c8', 0.04); [[47, 21], [55, 21]].forEach(([x, y]) => { b.obj('cpalmier', x, y); b.light(x, y, 36, '#ffb46a', 0.06); }); b.obj('qbanc', 54, 27);
    // le parc : la grande roue, les chaises volantes, les tasses ; des arbres
    b.obj('qroue', 8, 42); b.light(8, 37, 70, '#ffd8a0', 0.12); b.obj('qmanege', 21, 40); b.light(21, 38, 54, '#ff8ac8', 0.12); b.obj('qtasses', 24, 44); b.light(24, 43, 40, '#8ad8ff', 0.1);
    [[3, 35], [27, 35], [11, 39], [4, 39], [27, 38], [17, 44], [12, 44]].forEach(([x, y]) => b.obj('qarbre', x, y));
    // la tribune : la lumière des projecteurs sur la piste
    [40, 48].forEach(x => b.light(x, 37, 80, '#fff4dc', 0.05));
    // des voitures garées le long des trottoirs : chacune tient ses deux cases (des modèles du jeu, sans marque)
    const garee = (x, y, m, c, d) => { const v = b.obj('qvoiture', x, y, { m, c, d }); v.x = (x + 1) * T2; };
    [[6, 29, 'berline', 1, 'd'], [9, 29, 'coupe', 2, 'd'], [13, 29, 'citadine', 8, 'd'], [24, 29, 'tout', 5, 'g'], [28, 29, 'coupe', 0, 'g'], [35, 29, 'berline', 6, 'g'], [39, 29, 'citadine', 7, 'g'],
      [15, 10, 'coupe', 3, 'g'], [22, 10, 'berline', 4, 'd']].forEach(a => garee(a[0], a[1], a[2], a[3], a[4]));
    b.peint = c => peindreQuartiers(c, b);
    // la même lumière que la rue de la Cité (le crépuscule validé) ; le moment de la prière, au coin calme : le couchant
    const env = v15 ? { time: 'cite', ambient: '#5a5ca8', grade: ['#7a2cff', 0.2], particles: 'brume', rate: 6, bg: 'cite', scan: true, bloom: 0.3, lightA: 1, music: 'cite' }
      : { time: 'cite', ambient: ['#a04a34', '#58247a'], grade: ['#ff3d8f', 0.14], particles: 'brume', rate: 6, bg: 'cite', scan: true, bloom: 0.18, lightA: 1, music: 'cite' };
    return b.finish(Object.assign(env, { moment: 'maghrib', rues: { cases: ['cdalle', 'qparvis', 'qroute'] }, trafic: Q }));
  }
  function peindreQuartiers(c, b) {
    const r = I.rng(I.hash('quartiers|decor')), W = b.w * T, rect = aplat(c), hd1 = (c.canvas.hd || 1) === 1;
    const grad = (x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(s => g.addColorStop(s[0], s[1])); return g; };
    const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    /* --- le ciel : la même voûte qui luit, sans astre ni étoile --- */
    c.fillStyle = grad(0, 0, 0, 96, [[0, '#3a1c66'], [0.45, '#a8367e'], [0.8, '#ff7f52'], [1, '#ffc27c']]); c.fillRect(0, 0, W, 96);
    for (let y = 5; y < 80; y += 11) rect(`rgba(255,226,240,${(0.18 - y / 600).toFixed(3)})`, 0, y, W, 0.5);
    for (let x = 0; x < W; x += 18) rect('rgba(255,226,240,.08)', x, 0, 0.5, 80);
    for (let x = -6; x < W;) { const w = 10 + r() * 14, top = 18 + r() * 40; rect('rgba(184,92,124,.55)', x, top, w, 100 - top); rect('rgba(255,206,170,.22)', x + w - 1, top, 0.5, 100 - top); x += w + 2 + r() * 10; }
    /* --- les tours de verre, à contre-jour --- */
    [[0, 40, -20, 'rideau'], [44, 30, 4, 'gradins'], [92, 36, -24, 'torsade'], [452, 44, -30, 'rideau'], [500, 30, 10, 'lame'], [540, 52, -16, 'couronne'], [808, 40, -26, 'torsade'], [852, 34, 2, 'gradins'], [892, 52, -34, 'rideau'], [950, 30, 12, 'lame'], [986, 38, -10, 'rideau']]
      .forEach(t => tourDeVerre(c, r, t[0], t[1], t[2], 128, t[3], false));
    c.fillStyle = grad(0, 70, 0, 128, [[0, 'rgba(255,190,124,0)'], [1, 'rgba(255,196,130,.32)']]); c.fillRect(0, 70, W, 58);
    // le pied des tours : des halls vitrés, éclairés
    const hall = (x0, x1) => { rect('#2a1c30', x0, 92, x1 - x0, 36); c.fillStyle = grad(0, 98, 0, 128, [[0, '#ffd8a0'], [1, '#c8703c']]); c.fillRect(x0 + 3, 98, x1 - x0 - 6, 28);
      for (let x = x0 + 3; x < x1 - 3; x += 8) rect('#6a4a3a', x, 98, 0.75, 28); rect('#a8874e', x0, 92, x1 - x0, 1); rect('rgba(60,30,40,.3)', x0 + 3, 112, x1 - x0 - 6, 0.5); };
    hall(16, 120); hall(456, 600); hall(808, 1000);
    /* --- la galerie marchande : deux étages de verre, un auvent qui luit, et ses vitrines --- */
    const G0 = 128, G1 = 448;
    rect('#2c2236', G0, 10, G1 - G0, 54); c.fillStyle = grad(0, 10, 0, 64, [[0, 'rgba(120,140,210,.35)'], [1, 'rgba(255,170,130,.45)']]); c.fillRect(G0 + 2, 12, G1 - G0 - 4, 50);
    for (let y = 22; y < 62; y += 12) rect('rgba(30,14,44,.5)', G0 + 2, y, G1 - G0 - 4, 0.75);
    for (let x = G0 + 2; x < G1; x += 16) rect('rgba(236,192,112,.3)', x, 12, 0.5, 50);
    for (let i = 0; i < 40; i++) { const x = G0 + 4 + Math.floor(r() * (G1 - G0 - 12) / 4) * 4, y = 13 + Math.floor(r() * 4) * 12; rect('rgba(255,214,160,.5)', x, y + 2, 3, 7); }
    // l'auvent, une lame de verre et un filet de lumière
    c.fillStyle = grad(0, 60, 0, 68, [[0, '#4a3a5a'], [1, '#8a6a7a']]); c.fillRect(G0 - 4, 60, G1 - G0 + 8, 7); rect('#ffe0b0', G0 - 4, 66.5, G1 - G0 + 8, 1); rect('#a8874e', G0 - 4, 60, G1 - G0 + 8, 0.75);
    // les vitrines : des formes posées sur des socles, qui ne nomment rien (ni lettre, ni marque, ni logo, ni mannequin)
    for (let x = G0 + 2, k = 0; x < G1 - 4; x += 32, k++) {
      rect('#3a2a34', x, 68, 30, 28); c.fillStyle = grad(0, 69, 0, 95, [[0, '#ffe8c4'], [1, '#e8a070']]); c.fillRect(x + 1.5, 69, 27, 26);
      rect('rgba(255,255,255,.35)', x + 3, 70, 1.5, 24); rect('#c8a878', x + 1.5, 89, 27, 1.5); rect('#8a6a50', x + 1.5, 90.5, 27, 4.5);
      const rk = I.rng(I.hash('vitrine|' + k)), cols = ['#3a6a8a', '#a83a4a', '#2a8a6a', '#d8b450', '#6a4a8a', '#e8e0d0', '#2a2a36'];
      const sorte = k % 4;
      if (sorte === 0) for (let j = 0; j < 3; j++) { const sx = x + 5 + j * 8, col = cols[Math.floor(rk() * cols.length)]; rect('#8a7060', sx + 2.5, 74, 0.5, 2); rect(col, sx, 76, 6, 10); rect(G.shade(col, 1.25), sx, 76, 6, 1); rect('#5a4a44', sx + 1, 72.5, 4, 0.75); }   // des vêtements sur leurs cintres
      else if (sorte === 1) for (let j = 0; j < 4; j++) { const sx = x + 4 + j * 6, col = cols[Math.floor(rk() * cols.length)], h = 4 + Math.floor(rk() * 6); rect(col, sx, 89 - h, 4.5, h); rect(G.shade(col, 1.3), sx, 89 - h, 4.5, 0.75); }   // des boîtes
      else if (sorte === 2) for (let j = 0; j < 3; j++) { const sx = x + 6 + j * 8, col = cols[Math.floor(rk() * cols.length)]; c.fillStyle = col; c.beginPath(); c.ellipse(sx + 2, 87, 3.5, 1.8, 0, 0, 6.3); c.fill(); rect(col, sx - 1.5, 84.5, 5, 2.5); rect('#f4ecd8', sx - 1, 85, 2, 0.5); }   // des chaussures
      else { rect('#2a2a36', x + 6, 76, 18, 11); rect('#5ad8ff', x + 7, 77, 16, 9); rect('rgba(255,255,255,.4)', x + 7, 77, 16, 1.5); rect('#2a2a36', x + 13, 87, 4, 2); }   // un écran éteint
    }
    /* --- la salle de jeux : un mur du fond où courent des néons sans un mot ; au-dessus, un bâtiment sombre --- */
    const S0 = 608, S1 = 800;
    rect('#1c1626', S0, 6, S1 - S0, 74); rect('#2a2236', S0 + 2, 8, S1 - S0 - 4, 48);
    for (let y = 14; y < 56; y += 10) for (let x = S0 + 6; x < S1 - 6; x += 9) if (r() < 0.4) rect('rgba(160,140,255,.25)', x, y, 5, 5);
    c.lineWidth = hd1 ? 1 : 1; [['#ff4fd8', 642, 30, 16], ['#39e6ff', 704, 28, 22], ['#ffd84a', 766, 32, 14]].forEach(([col, x, y, rr]) => { c.strokeStyle = col; c.globalAlpha = 0.85; c.beginPath(); c.arc(x, y, rr, 0, 6.3); c.stroke(); c.globalAlpha = 0.25; c.lineWidth = 3; c.stroke(); c.lineWidth = 1; c.globalAlpha = 1; });
    c.strokeStyle = '#7dffb0'; c.beginPath(); for (let x = S0 + 8; x < S1 - 8; x += 2) { const y = 50 + Math.sin(x / 9) * 3; if (x === S0 + 8) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke();
    // l'ouverture : un linteau, le mur du fond, des reflets au sol
    rect('#0e0a16', S0, 56, S1 - S0, 24); rect('#a8874e', S0, 56, S1 - S0, 1); for (let x = S0 + 4; x < S1 - 4; x += 12) rect(['rgba(255,79,216,.35)', 'rgba(57,230,255,.35)'][(x / 12 | 0) % 2], x, 60, 8, 1);
    rect('#3a2a44', S0 - 4, 54, 6, 74); rect('#3a2a44', S1 - 2, 54, 6, 74); rect('#ff4fd8', S0 - 1, 60, 0.75, 66); rect('#39e6ff', S1 + 0.25, 60, 0.75, 66);
    /* --- les avenues : un liseré de bordure, des passages piétons (des bandes, aucun signe) --- */
    const bord = (x, y, w, h) => { rect('#a89480', x, y, w, h); rect('rgba(255,236,210,.35)', x, y, w, Math.min(h, 0.5)); };
    bord(32, 175, 960, 1.5); bord(64, 208, 896, 1.5); bord(64, 479, 896, 1.5); bord(32, 512, 960, 1.5); bord(31, 176, 1.5, 337); bord(64, 209, 1.5, 271); bord(959, 209, 1.5, 271); bord(991.5, 176, 1.5, 337);
    // (les bandes sont dans le sens de la circulation : une avenue est-ouest a des bandes est-ouest, empilées)
    const zebre = (x, y, w, h, vert) => { for (let k = 0; vert ? k < w : k < h; k += 4) rect('rgba(236,226,210,.55)', vert ? x + k : x, vert ? y : y + k, vert ? 2 : w, vert ? h : 2); };
    zebre(160, 180, 32, 26); zebre(656, 180, 32, 26); zebre(240, 484, 32, 26); zebre(528, 484, 32, 26); zebre(880, 484, 32, 26); zebre(34, 336, 28, 32, true); zebre(962, 336, 28, 32, true);
    // le sens de la boucle : des flèches au sol, simples traits
    const fleche = (x, y, dx, dy) => { c.fillStyle = 'rgba(236,226,210,.3)'; c.beginPath(); c.moveTo(x + dx * 6, y + dy * 6); c.lineTo(x - dy * 4 - dx * 2, y + dx * 4 - dy * 2); c.lineTo(x + dy * 4 - dx * 2, y - dx * 4 - dy * 2); c.closePath(); c.fill(); };
    [[400, 192, -1, 0], [800, 192, -1, 0], [300, 496, 1, 0], [720, 496, 1, 0], [48, 260, 0, 1], [976, 420, 0, -1]].forEach(a => fleche(...a));
    /* --- le parvis : un cercle de laiton incrusté autour de l'ascenseur --- */
    c.save(); c.strokeStyle = 'rgba(236,200,130,.28)'; c.lineWidth = hd1 ? 1 : 0.5; [40, 64, 88].forEach(rr => { c.beginPath(); c.ellipse(208, 290, rr, rr * 0.62, 0, 0, 6.3); c.stroke(); }); c.restore();
    rect('rgba(110,80,60,.3)', 80, 222, 256, 1.5);
    /* --- le pavillon du grand écran : du verre, des étages éclairés, deux portes au pied --- */
    const P0 = 384, P1 = 640;
    rect('#241a30', P0, 224, P1 - P0, 96); c.fillStyle = grad(0, 224, 0, 320, [[0, 'rgba(120,140,210,.3)'], [1, 'rgba(255,160,140,.35)']]); c.fillRect(P0 + 2, 226, P1 - P0 - 4, 92);
    for (let x = P0 + 4; x < P1; x += 12) rect('rgba(236,192,112,.25)', x, 226, 0.5, 26); rect('#a8874e', P0, 224, P1 - P0, 1); rect('#a8874e', P0, 252, P1 - P0, 0.75);
    for (let i = 0; i < 18; i++) rect('rgba(255,214,160,.5)', P0 + 6 + Math.floor(r() * 20) * 12, 229 + Math.floor(r() * 2) * 11, 6, 6);
    [[P0 + 6, 30], [P1 - 36, 30]].forEach(([x, w]) => { rect('#2a1a30', x, 292, w, 28); c.fillStyle = grad(0, 294, 0, 320, [[0, '#ffdca0'], [1, '#d07a44']]); c.fillRect(x + 2, 294, w - 4, 26); rect('#8a6a40', x + w / 2, 294, 0.75, 26); });
    /* --- l'immeuble de l'est : des balcons, des fenêtres éclairées ou non --- */
    const E0 = 688, E1 = 944;
    rect('#4a3a46', E0, 224, E1 - E0, 80); rect('#5e4c58', E0, 224, E1 - E0, 2); rect('#a8874e', E0, 224, E1 - E0, 0.75);
    for (let y = 232; y < 300; y += 18) { rect('#3a2c38', E0 + 2, y + 12, E1 - E0 - 4, 1.5); for (let x = E0 + 8; x < E1 - 12; x += 20) { const allume = r() < 0.55; rect('#2a2030', x, y, 12, 11); rect(allume ? '#ffcf8a' : '#3a3450', x + 1, y + 1, 10, 9); if (allume) rect('rgba(255,255,255,.25)', x + 1, y + 1, 10, 1); rect('#2a2030', x + 5.75, y + 1, 0.5, 9); } }
    rect('#2a1a30', 800, 284, 32, 20); c.fillStyle = grad(0, 286, 0, 304, [[0, '#ffdca0'], [1, '#d07a44']]); c.fillRect(802, 286, 28, 18);
    /* --- le coin calme : une bordure de pierre au pied de la haie, des pas japonais vers le tapis --- */
    rect('rgba(40,30,24,.3)', 736, 336, 176, 1.5);
    [[740, 376], [756, 382], [772, 380], [788, 386], [804, 388]].forEach(([x, y]) => { c.fillStyle = 'rgba(200,184,160,.5)'; c.beginPath(); c.ellipse(x, y, 5, 2.6, 0, 0, 6.3); c.fill(); });
    /* --- le parc : des massifs de fleurs, des bordures --- */
    for (let i = 0; i < 70; i++) { const x = 20 + r() * 420, y = 548 + r() * 160, tx = Math.floor(x / 16), ty = Math.floor(y / 16); if (b.g[ty * b.w + tx] !== 'qgazon') continue; rect(['#ff8aa8', '#ffd84a', '#c49bff', '#8ad8ff', '#fff0d0'][Math.floor(r() * 5)], x, y, 1, 1); }
    rect('rgba(30,40,24,.4)', 16, 544, 448, 1);
    /* --- le circuit : la piste, ses vibreurs, la ligne de départ en damier, la barrière au pied de la tribune --- */
    const K = M.QUARTIERS.circuit, stade = (dr) => { c.beginPath(); c.moveTo(K.x0, K.y0 - dr); c.lineTo(K.x1, K.y0 - dr); c.arc(K.x1, (K.y0 + K.y1) / 2, K.r + dr, -Math.PI / 2, Math.PI / 2); c.lineTo(K.x0, K.y1 + dr); c.arc(K.x0, (K.y0 + K.y1) / 2, K.r + dr, Math.PI / 2, Math.PI * 1.5); c.closePath(); };
    rect('#2c4428', 496, 576, 512, 144); for (let i = 0; i < 300; i++) rect('#36522f', 496 + r() * 512, 576 + r() * 144, 1, 0.5);
    c.fillStyle = '#e8e0d0'; stade(16); c.fill(); c.fillStyle = '#34303c'; stade(14); c.fill();
    c.save(); stade(14); c.clip(); for (let i = 0; i < 320; i++) rect('#3c3846', 506 + r() * 492, 588 + r() * 130, 1, 0.5); c.restore();
    c.fillStyle = '#e8e0d0'; stade(-12); c.fill(); c.fillStyle = '#2c4428'; stade(-14); c.fill();
    // les vibreurs, rouge et blanc, au bord extérieur des virages
    const my = (K.y0 + K.y1) / 2;
    [[K.x0, Math.PI / 2], [K.x1, -Math.PI / 2]].forEach(([cx0, a0]) => { for (let k = 0; k < 18; k++) { const a = a0 + k * Math.PI / 17; rect(k % 2 ? '#e8e0d0' : '#c8283c', cx0 + Math.cos(a) * (K.r + 14.5) - 1.5, my + Math.sin(a) * (K.r + 14.5) - 1, 3, 2); } });
    for (let y = K.y1 - 14; y < K.y1 + 14; y += 2) for (let x = 0; x < 2; x++) rect(((y - K.y1) / 2 + x) % 2 ? '#e8e0d0' : '#16141c', 752 + x * 2, y, 2, 2);
    // la barrière et le grillage, le muret de la tribune
    rect('#6a6070', 496, 576, 512, 3); rect('#c8c0d0', 496, 576, 512, 0.75); for (let x = 500; x < 1006; x += 10) rect('#8a8296', x, 571, 0.75, 6);
    rect('rgba(200,200,220,.18)', 496, 568, 512, 0.5);
    rect('#3a2e36', 560, 542, 320, 2); rect('#a8874e', 560, 542, 320, 0.75);
    // à droite de la tribune, les stands : des portes roulantes, closes ; à gauche, un muret
    rect('#4a3c48', 880, 544, 128, 32); rect('#a8874e', 880, 544, 128, 0.75); for (let x = 884; x < 1004; x += 20) { rect('#2a2230', x, 552, 16, 22); for (let y = 554; y < 574; y += 2.5) rect('#3a3040', x + 1, y, 14, 0.75); rect('rgba(255,220,170,.25)', x, 551, 16, 0.75); }
    rect('#4a3c48', 496, 544, 16, 32); rect('#a8874e', 496, 544, 16, 0.75);
    // les bords de la carte : des murs de verre sombre
    // (2.28, D218 : à l'ouest, le mur s'ouvre au niveau du trottoir du nord — la rue de la Cité-Miroir continue par là)
    [[0, 16, 176], [1008, 16, 128]].forEach(([x, w, y0]) => { c.fillStyle = grad(0, 128, 0, 736, [[0, '#2a2038'], [1, '#1a1428']]); c.fillRect(x, y0, w, 720 - y0); rect('rgba(236,192,112,.25)', x + (x ? 0 : 15.5), y0, 0.5, 720 - y0); });
    rect('rgba(236,192,112,.35)', 0, 175.5, 16, 0.75); c.fillStyle = grad(0, 0, 16, 0, [[0, 'rgba(20,12,30,.5)'], [1, 'rgba(20,12,30,0)']]); c.fillRect(0, 128, 16, 48);
    /* --- la flaque de lumière au pied des lampadaires --- */
    (b.lampes || []).forEach(([px, py, col]) => { c.save(); c.translate(px, py); c.scale(1, 0.4); const g = c.createRadialGradient(0, 0, 2, 0, 0, 26); g.addColorStop(0, rgba(col, 0.26)); g.addColorStop(0.5, rgba(col, 0.1)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(-26, -26, 52, 52); c.restore(); });
    // l'ombre franche au pied des façades du nord
    c.fillStyle = grad(0, 128, 0, 146, [[0, 'rgba(40,16,36,.55)'], [1, 'rgba(40,16,36,0)']]); c.fillRect(0, 128, W, 18);
    c.fillStyle = grad(0, 320, 0, 334, [[0, 'rgba(40,16,36,.45)'], [1, 'rgba(40,16,36,0)']]); c.fillRect(384, 320, 256, 14); c.fillRect(688, 304, 256, 14);
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

  /* ---------- 2.29 (D220) — la carte du monde ----------
     D.MONDE, projeté : de la longitude et de la latitude à la case, équirectangulaire, corrigée au parallèle de D.MONDE.
     La terre et la mer (la mer ne se marche pas), la steppe, les déserts, les terres vertes, les oasis, les reliefs (des cases
     pleines), les lacs et les fleuves (de l'eau : pleine, sauf là où une route la franchit sur un pont), les routes (un col
     là où elles passent une crête). Les villes : une icône dessinée par le jeu (gfx.js : ville_arabe, ville_sham, ville_camp —
     ni enseigne, ni lettre, ni édifice religieux), un lieu nommé (son identifiant : D.LIEUX le dit). Une ville qui n'existe
     pas encore l'année du chapitre (opts.an, D.MONDE.villes[…].fondee) n'est ni dessinée ni nommée ; le sol, lui, ne change
     jamais : la même carte case pour case, à toute heure et à toute époque (sa propre graine). Pas de petite carte au coin :
     la carte, c'est elle. */
  const PROJ = () => { const P = D.MONDE, H0 = P.cases[1], k = H0 / (P.lat[1] - P.lat[0]), kx = k * Math.cos(P.parallele * Math.PI / 180), lon0 = (P.lon[0] + P.lon[1]) / 2;
    return { k, x: lon => P.cases[0] / 2 + (lon - lon0) * kx, y: lat => (P.lat[1] - lat) * k }; };
  // (lat, lon) → [x, y], en cases (fractionnaires)
  M.projeter = (lat, lon) => { const p = PROJ(); return [p.x(lon), p.y(lat)]; };
  // ce que mesure une case, du nord au sud (rayon moyen de la Terre : 6 371 km)
  M.kmCase = () => 6371 * Math.PI / 180 / PROJ().k;
  // la case de chaque ville : celle de son point ; deux villes à moins de deux cases l'une de l'autre (Koufa et al-Hîra, à six
  // kilomètres) s'écartent chacune d'une case, le long de ce qui les sépare — toujours à une case de leur point
  M.casesVilles = function () {
    const V = D.MONDE.villes, ids = Object.keys(V), pr = {}, t = {};
    ids.forEach(id => { pr[id] = M.projeter(V[id].lat, V[id].lon); t[id] = [Math.floor(pr[id][0]) + (V[id].rive || 0), Math.floor(pr[id][1])]; });   // (une ville au bord d'un fleuve : sur sa rive)
    ids.forEach((a, i) => ids.slice(i + 1).forEach(c => { const A = t[a], B = t[c]; if (Math.max(Math.abs(A[0] - B[0]), Math.abs(A[1] - B[1])) >= 2) return;
      const dx = pr[c][0] - pr[a][0], dy = pr[c][1] - pr[a][1], k = Math.abs(dy) >= Math.abs(dx) ? 1 : 0, s = (k ? dy : dx) >= 0 ? 1 : -1;
      A[k] = Math.floor(pr[a][k]) - s; B[k] = Math.floor(pr[c][k]) + s; }));
    return t;
  };
  M.existe = (id, an) => { const v = D.MONDE.villes[id]; return !!v && (v.fondee === null || v.fondee === undefined || an === undefined || an === null || an >= v.fondee); };
  function monde(id, o) {
    const P = D.MONDE, W0 = P.cases[0], H0 = P.cases[1], b = new MB(id, W0, H0, 'sea', o);
    b.r = I.rng(I.hash('monde')); b.sansMini = true;   // la même carte à toute heure et à toute époque
    const pr = PROJ(), pt = q => [pr.x(q[1]), pr.y(q[0])], g = b.g, at = (x, y) => (x < 0 || y < 0 || x >= W0 || y >= H0) ? null : g[y * W0 + x];
    const villes = M.casesVilles(), etape = e => typeof e === 'string' ? [villes[e][0] + 0.5, villes[e][1] + 0.5] : pt(e);
    // un polygone (en cases) : les cases dont le centre est dedans (fin : dont un quart au moins touche — un lac plus étroit
    // qu'une case, la mer Morte, garde sa forme)
    const poly = (L, fn, fin) => { const q = L.map(pt), xs = q.map(p => p[0]), ys = q.map(p => p[1]), x0 = Math.max(0, Math.floor(Math.min(...xs))), x1 = Math.min(W0 - 1, Math.ceil(Math.max(...xs))), y0 = Math.max(0, Math.floor(Math.min(...ys))), y1 = Math.min(H0 - 1, Math.ceil(Math.max(...ys)));
      const dedans = (cx, cy) => { let d = false; for (let i = 0, j = q.length - 1; i < q.length; j = i++) { const a = q[i], c = q[j]; if ((a[1] > cy) !== (c[1] > cy) && cx < (c[0] - a[0]) * (cy - a[1]) / (c[1] - a[1]) + a[0]) d = !d; } return d; };
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (fin ? [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75], [0.5, 0.5]].some(([i, j]) => dedans(x + i, y + j)) : dedans(x + 0.5, y + 0.5)) fn(x, y); };
    // un ruban (une crête, un cordon de dunes) : les cases à moins de « large » cases du tracé
    const ruban = (L, large, fn) => { const q = L.map(pt); for (let i = 1; i < q.length; i++) { const a = q[i - 1], c = q[i], dx = c[0] - a[0], dy = c[1] - a[1], n = dx * dx + dy * dy;
      for (let y = Math.max(0, Math.floor(Math.min(a[1], c[1]) - large - 1)); y <= Math.min(H0 - 1, Math.ceil(Math.max(a[1], c[1]) + large + 1)); y++) for (let x = Math.max(0, Math.floor(Math.min(a[0], c[0]) - large - 1)); x <= Math.min(W0 - 1, Math.ceil(Math.max(a[0], c[0]) + large + 1)); x++) {
        const px = x + 0.5, py = y + 0.5, t = n ? Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / n)) : 0; if (Math.hypot(px - a[0] - t * dx, py - a[1] - t * dy) <= large) fn(x, y); } } };
    // un trait d'une case (un fleuve, une route), sans pas en diagonale : ce qui le longe ne passe pas entre deux cases
    const trait = (Q, fn) => { let pX = null, pY = null; for (let i = 1; i < Q.length; i++) { const a = Q[i - 1], c = Q[i], n = Math.max(1, Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) * 4));
      for (let s = 0; s <= n; s++) { const x = Math.floor(a[0] + (c[0] - a[0]) * s / n), y = Math.floor(a[1] + (c[1] - a[1]) * s / n); if (x === pX && y === pY) continue;
        if (pX !== null && x !== pX && y !== pY) fn(x, pY); fn(x, y); pX = x; pY = y; } } };
    const pose = (x, y, t) => { if (x >= 0 && y >= 0 && x < W0 && y < H0) b.set(x, y, t); };
    const terre = (x, y) => { const n = at(x, y); return !!n && n !== 'sea' && n !== 'water'; };
    // la terre et la mer
    P.terres.forEach(L => poly(L, (x, y) => pose(x, y, 'sand')));
    // la steppe, les déserts, les terres vertes, les oasis (sur la terre seulement)
    const sur = (sols, t) => (x, y) => { if (sols.includes(at(x, y))) pose(x, y, t); };
    Object.keys(P.steppes).forEach(k => poly(P.steppes[k], sur(['sand'], 'steppe')));
    Object.keys(P.deserts).forEach(k => { const d = P.deserts[k], f = sur(['sand', 'steppe'], 'dune'), part = d.part, g2 = part ? (x, y) => { if (b.r() < part) f(x, y); } : f;
      if (Array.isArray(d)) poly(d, f); else if (d.trace) ruban(d.trace, d.large, g2); else poly(d.zone, g2); });
    Object.keys(P.vertes).forEach(k => poly(P.vertes[k], sur(['sand', 'steppe', 'dune'], 'grass')));
    const palmes = [];   // les oasis : de l'herbe, et des palmiers peints par-dessus
    P.oasis.forEach(([la, lo, r]) => { const c = pt([la, lo]), R = r * pr.k; for (let y = Math.floor(c[1] - R); y <= Math.ceil(c[1] + R); y++) for (let x = Math.floor(c[0] - R); x <= Math.ceil(c[0] + R); x++) if (Math.hypot(x + 0.5 - c[0], y + 0.5 - c[1]) <= Math.max(0.75, R) && terre(x, y)) { pose(x, y, 'grass'); palmes.push([x, y]); } });
    // les reliefs
    Object.keys(P.reliefs).forEach(k => ruban(P.reliefs[k].trace, P.reliefs[k].large, (x, y) => { if (terre(x, y)) pose(x, y, 'mont'); }));
    // les lacs, puis les fleuves ; leurs rives verdissent
    Object.keys(P.lacs).forEach(k => poly(P.lacs[k], (x, y) => { if (terre(x, y)) pose(x, y, 'water'); }, true));
    const eau = [];
    Object.keys(P.fleuves).forEach(k => P.fleuves[k].forEach(L => trait(L.map(pt), (x, y) => { if (terre(x, y)) { pose(x, y, 'water'); eau.push([x, y]); } })));
    eau.forEach(([x, y]) => { for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if (['sand', 'steppe', 'dune'].includes(at(x + i, y + j))) pose(x + i, y + j, 'grass'); });
    // les routes : un pont sur l'eau, un col dans la montagne ; jamais dans la mer (le contrôle le vérifie : monde.js). Le sol
    // ne change pas ailleurs : la piste se peint par-dessus, d'un trait (une case fait vingt kilomètres)
    b.horsTerre = [];
    const traces = P.routes.map(R => R.map(etape));
    traces.forEach(Q => trait(Q, (x, y) => { const n = at(x, y); if (!n) return; if (n === 'sea') { b.horsTerre.push([x, y]); return; } if (n === 'water') b.set(x, y, 'wood', false); else if (n === 'mont') pose(x, y, 'sand'); }));
    // chaque ville sur la terre ferme, et ses abords libres de relief (le fleuve, lui, passe à côté : la ville est sur sa rive)
    Object.keys(villes).forEach(v => { const [x, y] = villes[v]; [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([i, j]) => { const n = at(x + i, y + j); if (n && G.isSolidTile(n) && (!(i || j) || n === 'mont')) pose(x + i, y + j, 'sand'); }); });
    // ce qui se peint d'un tenant, par-dessus les cases (sans rien changer à ce qui se marche) : l'écume le long des côtes, les
    // sommets des reliefs (plus grands qu'une case : ils se chevauchent en chaînes), les pistes
    b.peint = c => {
      const f = G.D > 1 ? 0.5 : 1;
      for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) { if (at(x, y) !== 'sea') continue; const X = x * T, Y = y * T;
        [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([i, j]) => { const n = at(x + i, y + j); if (!n || n === 'sea') return; c.fillStyle = 'rgba(236,244,250,.6)'; c.fillRect(i > 0 ? X + T - f * 2 : X, j > 0 ? Y + T - f * 2 : Y, i ? f * 2 : T, j ? f * 2 : T);
          c.fillStyle = 'rgba(160,205,225,.35)'; c.fillRect(i > 0 ? X + T - f * 5 : i < 0 ? X + f * 2 : X, j > 0 ? Y + T - f * 5 : j < 0 ? Y + f * 2 : Y, i ? f * 3 : T, j ? f * 3 : T); }); }
      const br = k => { const n = Math.sin(k * 12.9898) * 43758.5453; return n - Math.floor(n); };
      // un massif de roche (et non une pyramide) : une crête irrégulière — deux épaulements, un sommet décentré, un second
      // plus bas de part ou d'autre —, le versant au soleil à gauche d'une arête brisée, l'autre dans l'ombre, des ravines
      const poly = (Q, col) => { c.fillStyle = col; c.beginPath(); Q.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); };
      const massif = (cx, b0, w, h, k) => {
        const L = cx - w / 2, Rx = cx + w / 2, sx = cx + (br(k) - 0.5) * w * 0.28, cote = br(k + 1) < 0.5 ? -1 : 1, s2x = sx + cote * w * (0.24 + br(k + 2) * 0.08), h2 = h * (0.5 + br(k + 3) * 0.18);
        const pic = [sx, b0 - h], pic2 = [s2x, b0 - h2], col = [(sx + s2x) / 2, b0 - h2 * (0.68 + br(k + 4) * 0.1)];
        const g1 = [L + w * (0.12 + br(k + 5) * 0.06), b0 - h * (0.2 + br(k + 6) * 0.12)], d1 = [Rx - w * (0.1 + br(k + 7) * 0.06), b0 - h * (0.16 + br(k + 8) * 0.12)];
        const crete = cote < 0 ? [g1, pic2, col, pic, d1] : [g1, pic, col, pic2, d1], i0 = crete.indexOf(pic);
        const arete = [pic, [sx + w * 0.05, b0 - h * 0.62], [sx - w * 0.04, b0 - h * 0.34], [sx + w * 0.03, b0]];
        poly([[L, b0], ...crete, [Rx, b0]], '#9a805e');
        poly([[L, b0], ...crete.slice(0, i0 + 1), ...arete.slice(1)], '#c4a77d');
        poly([...arete, [Rx, b0], ...crete.slice(i0 + 1).reverse()].reverse(), '#6c5640');
        c.strokeStyle = 'rgba(78,58,38,.55)'; c.lineWidth = f; c.beginPath(); c.moveTo(pic2[0], pic2[1]); c.lineTo(pic2[0] - cote * w * 0.03, b0 - h2 * 0.45); c.lineTo(pic2[0] + cote * w * 0.02, b0 - 1);
        c.moveTo(g1[0] + w * 0.08, g1[1] + 1); c.lineTo(g1[0] + w * 0.11, b0 - 1); c.stroke();
        c.fillStyle = 'rgba(70,52,36,.35)'; c.fillRect(L, b0 - f, w, f);
      };
      for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) { if (at(x, y) !== 'mont') continue; const k = x * 131 + y * 71;
        [[0.3, 0], [0.75, 1]].forEach(([dx, s]) => { if (s && br(k + 5) < 0.45) return; const w = 18 + br(k + s * 3) * 9, h = 8 + br(k + 7 + s) * 6, cx = x * T + T * dx + (br(k + 11 + s) - 0.5) * 6 + (s ? 0 : 4), b0 = y * T + 13 + s * 3;
          massif(cx, b0, w, h, k * 3 + s * 17); }); }
      // les ponts : l'eau dessous, un tablier de planches en travers du fleuve, ses deux garde-corps
      for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) { if (at(x, y) !== 'wood') continue; const X = x * T, Y = y * T, mouille = n => n === 'water' || n === 'wood', long = mouille(at(x - 1, y)) || mouille(at(x + 1, y)), v = (x * 7 + y * 13 + ((x * y) % 5)) % 4;
        c.drawImage(G.tile('water', v, 0), X, Y); c.fillStyle = '#8b6a45'; if (long) { c.fillRect(X + 4, Y, 8, T); c.fillStyle = '#5d4329'; for (let k = 1; k < 8; k++) c.fillRect(X + 4, Y + k * 2, 8, f); c.fillRect(X + 3, Y, f * 2, T); c.fillRect(X + 12, Y, f * 2, T); }
        else { c.fillRect(X, Y + 4, T, 8); c.fillStyle = '#5d4329'; for (let k = 1; k < 8; k++) c.fillRect(X + k * 2, Y + 4, f, 8); c.fillRect(X, Y + 3, T, f * 2); c.fillRect(X, Y + 12, T, f * 2); } }
      // les dunes : des croissants de sable, leur crête au soleil (le Nafoud, rouge, plus rouge)
      for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) { if (at(x, y) !== 'dune') continue; const k = x * 37 + y * 113, X = x * T + 4 + br(k) * 8, Y = y * T + 5 + br(k + 1) * 7, w = 5 + br(k + 2) * 4;
        c.fillStyle = 'rgba(176,112,58,.32)'; c.beginPath(); c.ellipse(X, Y + 1.5, w, 2.2, 0, 0, Math.PI); c.fill(); c.strokeStyle = 'rgba(250,226,176,.7)'; c.lineWidth = f * 1.5; c.beginPath(); c.ellipse(X, Y + 1, w, 2.5, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); }
      palmes.forEach(([x, y]) => { const k = x * 53 + y * 29; [[3 + br(k) * 4, 6 + br(k + 1) * 3], [9 + br(k + 2) * 4, 10 + br(k + 3) * 3]].forEach(([dx, dy]) => { const X = x * T + dx, Y = y * T + dy;
        c.fillStyle = 'rgba(30,40,20,.25)'; c.fillRect(X - 1, Y + 4, 3, f); c.fillStyle = '#7a5530'; c.fillRect(X, Y, f * 2, 4.5); c.fillStyle = '#3f7631'; c.fillRect(X - 2.5, Y - 1, 6, f * 2); c.fillStyle = '#4f8a3c'; c.fillRect(X - 1.5, Y - 2, 4, f * 2); c.fillRect(X - 3, Y, f * 2, 1.5); c.fillRect(X + 3, Y, f * 2, 1.5); }); });
      c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
      [['rgba(120,86,52,.55)', 3.2], ['rgba(222,196,146,.8)', 1.2]].forEach(([col, lw]) => { c.strokeStyle = col; c.lineWidth = lw; traces.forEach(Q => { c.beginPath(); Q.forEach((q, i) => { const X = q[0] * T, Y = q[1] * T; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }); c.stroke(); }); });
      c.restore();
    };
    // les villes de l'époque : leur icône, leur lieu nommé, une lumière le soir
    Object.keys(villes).forEach(v => { if (!M.existe(v, o.an)) return; const [x, y] = villes[v], V = P.villes[v];
      b.obj('ville_' + V.icone, x, y); b.spot(v, x, y); b.light(x, y - 1, 46, '#ffc878', 0.1); });
    const t = o.time || 'day', m = b.finish(envFor(t, { particles: 'sand', rate: t === 'night' ? 2 : 6, bg: 'desert', music: t === 'night' ? 'nuit' : 'desert' }));
    m.horsTerre = b.horsTerre; m.an = o.an; return m;
  }

  M.drawRosette = drawRosette;
  const GEN = { ville, desert, camp, romaine, palais, navire, noos, citadelle, cite, quartiers, archives, monde };
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
    let m = gen(id, opts, L, L.graine);   // 2.29 : une visite de Médine ou de Koufa tire la ville de son récit (D.MAPS, graine)
    if (L.paquet) for (let k = 1; k <= 12 && !M.relie(m); k++) m = gen(id, opts, L, id + '~' + k);
    if (L.piste && m.env.music === D.GABARITS[L.gabarit].piste) m.env.music = L.piste;
    return m;
  };
})();
