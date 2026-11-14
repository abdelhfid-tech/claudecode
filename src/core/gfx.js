/* ISNAD — rendu : tuiles, objets, personnages sans visage, égrégores, sceaux, composition « rétro-HD ». */
(function () {
  'use strict';
  const I = window.ISNAD;
  const G = I.gfx = { PW: 384, PH: 216, T: 16, k: 3 };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  G.mk = mk;
  const R = (c, col, x, y, w, h) => { c.fillStyle = col; c.fillRect(x, y, w, h); };

  function shade(hex, f) { // f<1 assombrit, >1 éclaircit
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    if (f <= 1) { r *= f; g *= f; b *= f; } else { const t = f - 1; r += (255 - r) * t; g += (255 - g) * t; b += (255 - b) * t; }
    return '#' + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
  }
  G.shade = shade;

  /* ================= TUILES ================= */
  const tcache = {};
  function speck(c, r, cols, n) { R(c, cols[0], 0, 0, 16, 16); for (let i = 0; i < n; i++) R(c, cols[1 + Math.floor(r() * (cols.length - 1))], Math.floor(r() * 16), Math.floor(r() * 16), 1, 1); }
  const P = {
    sand: ['#dbb97c', '#d2ae70', '#e4c58b', '#cba769'], path: ['#bd9a67', '#b08c5a', '#c7a573', '#a8855a'],
    stone: ['#b9b1a0', '#a9a08f', '#c7c0b0', '#9d9585'], grass: ['#6f9a4c', '#5f8a42', '#7fa957', '#557d3b'],
    adobe: ['#cda571', '#bd9460', '#d9b37f', '#a98252'], roof: ['#a98a5c', '#9a7a4f', '#b6976a', '#86693f'],
    marble: ['#e6e0d4', '#d9d2c4', '#f1ece2', '#c9c1b2'], rwall: ['#d2c5a9', '#c0b294', '#dfd4ba', '#aa9c7e'],
    terra: ['#b85a3e', '#a4472f', '#c96c4c', '#8e3b26'], wood: ['#8b6a45', '#7a5b3a', '#9a7850', '#6a4d30'],
    sea: ['#1d5f86', '#22709a', '#2d83ad', '#17506f'], water: ['#2f86a6', '#3a95b6', '#63bbd2', '#27718d'],
    glaze: ['#2d6e8e', '#3a86a3', '#256080', '#e7d9a8'], asphalt: ['#1f2230', '#262a3a', '#191c28', '#2f3550'],
    metal: ['#2a2f3e', '#323849', '#232735', '#3d4560'], carpet: ['#8e2f2a', '#7a2622', '#a53c33', '#d9b45a']
  };
  const TILE = {
    sand(c, r) { speck(c, r, P.sand, 26); },
    dune(c, r) { speck(c, r, P.sand, 14); c.fillStyle = '#c9a567'; for (let i = 0; i < 3; i++) { const y = 3 + i * 5 + Math.floor(r() * 2); for (let x = 0; x < 16; x++) c.fillRect(x, y + Math.round(Math.sin((x + i * 3) / 2.6) * 1.2), 1, 1); } },
    path(c, r) { speck(c, r, P.path, 30); },
    stone(c, r) { speck(c, r, P.stone, 12); c.fillStyle = '#8f8778'; c.fillRect(0, 7, 16, 1); c.fillRect(0, 15, 16, 1); c.fillRect(7, 0, 1, 7); c.fillRect(3, 8, 1, 7); c.fillRect(11, 8, 1, 7); c.fillRect(15, 0, 1, 7); R(c, '#cfc8b8', 0, 0, 7, 1); R(c, '#cfc8b8', 8, 0, 7, 1); },
    grass(c, r) { speck(c, r, P.grass, 34); for (let i = 0; i < 4; i++) R(c, '#8fba62', Math.floor(r() * 15), Math.floor(r() * 14), 1, 2); },
    water(c, r, v) { speck(c, r, P.water, 10); c.fillStyle = '#8fd3e4'; for (let i = 0; i < 3; i++) c.fillRect((i * 6 + v * 3) % 14, 2 + i * 5, 4, 1); },
    sea(c, r, v) { speck(c, r, P.sea, 12); c.fillStyle = '#4a9cc0'; for (let i = 0; i < 2; i++) c.fillRect((i * 9 + v * 4) % 13, 3 + i * 8, 5, 1); c.fillStyle = '#9fd0e4'; c.fillRect((4 + v * 4) % 14, 11, 2, 1); },
    wall(c, r) { speck(c, r, P.adobe, 22); R(c, '#e2bd8a', 0, 0, 16, 1); R(c, '#a07a4c', 0, 15, 16, 1); c.fillStyle = '#b08a59'; c.fillRect(0, 5, 16, 1); c.fillRect(0, 10, 16, 1); },
    roof(c, r) { speck(c, r, P.roof, 20); c.fillStyle = '#86693f'; for (let y = 2; y < 16; y += 4) for (let x = (y % 8 ? 0 : 2); x < 16; x += 4) c.fillRect(x, y, 3, 1); },
    roofedge(c, r) { TILE.roof(c, r); R(c, '#d7b684', 0, 13, 16, 2); R(c, '#7a5f3a', 0, 15, 16, 1); },
    door(c, r) { TILE.wall(c, r); R(c, '#4a3220', 4, 4, 8, 12); c.fillStyle = '#4a3220'; c.beginPath(); c.arc(8, 5, 4, Math.PI, 0); c.fill(); R(c, '#6b4a2e', 5, 5, 6, 11); c.fillStyle = '#6b4a2e'; c.beginPath(); c.arc(8, 5, 3, Math.PI, 0); c.fill(); R(c, '#3a2616', 8, 3, 1, 13); c.fillStyle = '#d9b45a'; [[6, 7], [10, 7], [6, 11], [10, 11], [6, 14], [10, 14]].forEach(q => c.fillRect(q[0], q[1], 1, 1)); },
    window(c, r) { TILE.wall(c, r); R(c, '#3a2a1c', 5, 3, 6, 8); R(c, '#e8b860', 6, 4, 4, 6); c.fillStyle = '#3a2a1c'; for (let k = 0; k < 4; k++) { c.fillRect(6 + k, 4 + k, 1, 1); c.fillRect(9 - k, 4 + k, 1, 1); c.fillRect(6 + k, 9 - k, 1, 1); c.fillRect(9 - k, 9 - k, 1, 1); } R(c, '#d9b37f', 5, 2, 6, 1); },
    thatch(c, r) { speck(c, r, ['#8d7a3e', '#7c6a34', '#a08c4a', '#6b5a2a'], 24); c.fillStyle = '#5d4e24'; for (let x = 1; x < 16; x += 3) c.fillRect(x, 0, 1, 16); },
    marble(c, r) { speck(c, r, P.marble, 8); R(c, '#c4bcad', 0, 15, 16, 1); R(c, '#c4bcad', 15, 0, 1, 16); R(c, '#f7f3ea', 0, 0, 15, 1); },
    mosaic(c, r) { R(c, '#e0d9ca', 0, 0, 16, 16); const cs = ['#2f6f8f', '#b5553a', '#d9b45a', '#3d8a6a', '#e9e2d0']; for (let y = 0; y < 16; y += 2) for (let x = 0; x < 16; x += 2) { const d = Math.abs(x - 7) + Math.abs(y - 7); R(c, cs[(d >> 1) % cs.length], x, y, 2, 2); } c.fillStyle = 'rgba(60,50,40,.25)'; for (let i = 0; i < 16; i += 2) { c.fillRect(i, 0, 1, 16); c.fillRect(0, i, 16, 1); } },
    rwall(c, r) { speck(c, r, P.rwall, 16); c.fillStyle = '#a89a7c'; c.fillRect(0, 7, 16, 1); c.fillRect(0, 15, 16, 1); c.fillRect(5, 0, 1, 7); c.fillRect(12, 8, 1, 7); R(c, '#ebe2cb', 0, 0, 16, 1); },
    rroof(c, r) { speck(c, r, P.terra, 12); c.fillStyle = '#8e3b26'; for (let y = 3; y < 16; y += 4) c.fillRect(0, y, 16, 1); for (let y = 0; y < 16; y += 4) for (let x = (y % 8 ? 2 : 0); x < 16; x += 4) c.fillRect(x, y, 1, 3); },
    rroofedge(c, r) { TILE.rroof(c, r); R(c, '#e6dcc4', 0, 12, 16, 3); R(c, '#9c8f73', 0, 15, 16, 1); },
    rdoor(c, r) { TILE.rwall(c, r); R(c, '#3b2a1e', 3, 2, 10, 14); R(c, '#5d4630', 4, 4, 8, 12); c.fillStyle = '#3b2a1e'; c.fillRect(8, 4, 1, 12); R(c, '#e6dcc4', 3, 1, 10, 1); },
    arch(c, r) { TILE.rwall(c, r); R(c, '#1c1620', 4, 4, 8, 12); R(c, '#1c1620', 5, 3, 6, 1); R(c, '#2e2536', 5, 6, 6, 10); },
    wood(c, r) { speck(c, r, P.wood, 14); c.fillStyle = '#5d4329'; c.fillRect(0, 3, 16, 1); c.fillRect(0, 7, 16, 1); c.fillRect(0, 11, 16, 1); c.fillRect(0, 15, 16, 1); c.fillRect(5, 0, 1, 3); c.fillRect(11, 4, 1, 3); c.fillRect(3, 8, 1, 3); c.fillRect(13, 12, 1, 3); },
    hull(c, r) { speck(c, r, ['#5d4329', '#4e3721', '#6b4e31'], 12); R(c, '#7a5b3a', 0, 0, 16, 2); R(c, '#2e2014', 0, 14, 16, 2); },
    carpet(c, r) { R(c, P.carpet[0], 0, 0, 16, 16); c.fillStyle = P.carpet[1]; for (let i = 0; i < 16; i += 4) { c.fillRect(i, 0, 1, 16); c.fillRect(0, i, 16, 1); } c.fillStyle = P.carpet[3]; c.fillRect(7, 7, 2, 2); c.fillRect(1, 1, 1, 1); c.fillRect(13, 13, 1, 1); c.fillRect(13, 1, 1, 1); c.fillRect(1, 13, 1, 1); },
    glaze(c, r) { R(c, P.glaze[0], 0, 0, 16, 16); R(c, P.glaze[1], 1, 1, 6, 6); R(c, P.glaze[1], 9, 9, 6, 6); R(c, P.glaze[2], 9, 1, 6, 6); R(c, P.glaze[2], 1, 9, 6, 6); R(c, P.glaze[3], 7, 7, 2, 2); R(c, P.glaze[3], 3, 3, 2, 2); R(c, P.glaze[3], 11, 11, 2, 2); },
    pwall(c, r) { speck(c, r, ['#c9b48a', '#bba378', '#d6c39b'], 14); R(c, '#2d6e8e', 0, 2, 16, 3); c.fillStyle = '#e7d9a8'; for (let x = 1; x < 16; x += 4) c.fillRect(x, 3, 2, 1); R(c, '#96825c', 0, 15, 16, 1); },
    asphalt(c, r) { speck(c, r, P.asphalt, 18); if (r() < 0.5) { c.fillStyle = 'rgba(80,220,255,.10)'; c.fillRect(Math.floor(r() * 10), Math.floor(r() * 12), 5, 2); } },
    neonline(c, r) { speck(c, r, P.asphalt, 10); R(c, '#ff4fd8', 0, 7, 16, 1); R(c, 'rgba(255,79,216,.35)', 0, 6, 16, 3); },
    metal(c, r) { speck(c, r, P.metal, 10); c.fillStyle = '#1a1d28'; c.fillRect(0, 15, 16, 1); c.fillRect(15, 0, 1, 16); R(c, '#454d68', 0, 0, 15, 1); R(c, '#5ad', 2, 2, 1, 1); },
    cwall(c, r) { speck(c, r, ['#191b27', '#141620', '#20232f'], 10); R(c, '#2d3147', 0, 0, 16, 1); c.fillStyle = '#0d0e16'; c.fillRect(0, 8, 16, 1); if (r() < 0.6) R(c, r() < 0.5 ? '#39e6ff' : '#ffb347', 3 + Math.floor(r() * 8), 3, 3, 2); },
    croof(c, r) { speck(c, r, ['#10121b', '#0c0d15', '#161927'], 8); R(c, '#272b3d', 0, 14, 16, 2); },
    nfloor(c, r, v, hue) { R(c, '#0c0f2c', 0, 0, 16, 16); c.fillStyle = `hsla(${hue},90%,65%,.55)`; c.fillRect(0, 0, 16, 1); c.fillRect(0, 0, 1, 16); c.fillStyle = `hsla(${hue},90%,70%,.14)`; c.fillRect(1, 1, 15, 15); c.fillStyle = `hsla(${(hue + 40) % 360},100%,80%,.8)`; if (r() < 0.35) c.fillRect(3 + Math.floor(r() * 10), 3 + Math.floor(r() * 10), 1, 1); },
    nbridge(c, r, v, hue) { R(c, '#080a20', 0, 0, 16, 16); c.fillStyle = `hsla(${(hue + 150) % 360},100%,70%,.75)`; c.fillRect(0, 3, 16, 1); c.fillRect(0, 12, 16, 1); c.fillStyle = `hsla(${(hue + 150) % 360},100%,70%,.18)`; c.fillRect(0, 4, 16, 8); },
    void(c, r) { R(c, '#04051a', 0, 0, 16, 16); if (r() < 0.3) R(c, '#3b3f8a', Math.floor(r() * 16), Math.floor(r() * 16), 1, 1); if (r() < 0.08) R(c, '#cfd6ff', Math.floor(r() * 16), Math.floor(r() * 16), 1, 1); },
    // zellige « étoile et croix » : l'étoile à huit branches naît de deux carrés superposés
    zellij(c, r, v) { const pal = v % 2 ? ['#d8c08a', '#2d7f8f', '#f1e7cc', '#c9a13f'] : ['#d8c08a', '#27608f', '#f1e7cc', '#b5553a']; R(c, pal[0], 0, 0, 16, 16); c.fillStyle = pal[1]; c.fillRect(3, 3, 10, 10); c.beginPath(); c.moveTo(8, 1); c.lineTo(15, 8); c.lineTo(8, 15); c.lineTo(1, 8); c.fill(); c.fillStyle = pal[2]; c.beginPath(); c.moveTo(8, 4); c.lineTo(12, 8); c.lineTo(8, 12); c.lineTo(4, 8); c.fill(); R(c, pal[3], 7, 7, 2, 2); R(c, pal[3], 0, 0, 1, 1); R(c, pal[3], 15, 0, 1, 1); R(c, pal[3], 0, 15, 1, 1); R(c, pal[3], 15, 15, 1, 1); },
    zsand(c, r) { R(c, '#d4b47c', 0, 0, 16, 16); c.fillStyle = '#c29b62'; c.fillRect(3, 3, 10, 10); c.beginPath(); c.moveTo(8, 1); c.lineTo(15, 8); c.lineTo(8, 15); c.lineTo(1, 8); c.fill(); c.fillStyle = '#e6cf9c'; c.beginPath(); c.moveTo(8, 4); c.lineTo(12, 8); c.lineTo(8, 12); c.lineTo(4, 8); c.fill(); R(c, '#a8824f', 7, 7, 2, 2); },
    gwall(c, r) { TILE.wall(c, r); R(c, '#f1e0b8', 0, 2, 16, 5); c.fillStyle = '#2d7f8f'; for (let x = 0; x < 16; x += 4) { c.beginPath(); c.moveTo(x, 4.5); c.lineTo(x + 2, 2); c.lineTo(x + 4, 4.5); c.lineTo(x + 2, 7); c.fill(); } c.fillStyle = '#c9a13f'; for (let x = 1; x < 16; x += 4) c.fillRect(x, 4, 2, 1); R(c, '#8e5a2a', 0, 1, 16, 1); R(c, '#8e5a2a', 0, 7, 16, 1); },
    mihrab(c, r) { TILE.gwall(c, r); R(c, '#1c2f3a', 4, 3, 8, 13); c.fillStyle = '#1c2f3a'; c.beginPath(); c.arc(8, 4, 4, Math.PI, 0); c.fill(); R(c, '#2d7f8f', 5, 5, 6, 11); c.fillStyle = '#2d7f8f'; c.beginPath(); c.arc(8, 5, 3, Math.PI, 0); c.fill(); c.fillStyle = '#f1e7cc'; c.beginPath(); c.moveTo(8, 6); c.lineTo(10, 9); c.lineTo(8, 12); c.lineTo(6, 9); c.fill(); R(c, '#c9a13f', 7, 8, 2, 2); },
    dark(c) { R(c, '#07060c', 0, 0, 16, 16); }
  };
  const SOLID = new Set(['gwall', 'mihrab', 'water', 'sea', 'wall', 'roof', 'roofedge', 'window', 'thatch', 'rwall', 'rroof', 'rroofedge', 'pwall', 'cwall', 'croof', 'void', 'dark', 'hull']);
  G.isSolidTile = n => SOLID.has(n);
  G.tile = function (name, variant, hue) {
    const key = name + '|' + (variant || 0) + '|' + (hue || 0);
    if (tcache[key]) return tcache[key];
    const cv = mk(16, 16), c = cv.getContext('2d');
    (TILE[name] || TILE.dark)(c, I.rng(I.hash(key)), variant || 0, hue || 0);
    return (tcache[key] = cv);
  };

  /* ================= OBJETS ================= */
  // chaque objet : { w, h, fw, fh (empreinte au sol, px), draw(c, r, opt) }
  const OBJ = {
    palm: { w: 28, h: 44, fw: 6, fh: 4, draw(c, r) {
      for (let y = 18; y < 44; y++) { const x = 13 + Math.round(Math.sin(y / 9) * 1.5); R(c, y % 3 ? '#8a6238' : '#6e4c2a', x, y, 3, 1); R(c, '#a57a48', x, y, 1, 1); }
      const fr = (ang, len, col) => { for (let i = 0; i < len; i++) { const x = 14 + Math.cos(ang) * i, y = 16 + Math.sin(ang) * i + i * i * 0.022; R(c, col, Math.round(x), Math.round(y), 2, 1); if (i % 2) R(c, col, Math.round(x), Math.round(y) + 1, 1, 2); } };
      [[-2.9, 13], [-2.3, 14], [-1.7, 12], [-1.2, 13], [-0.6, 14], [-0.15, 13], [3.5, 11], [-0.9, 10]].forEach(([a, l], i) => fr(a, l, i % 2 ? '#4f8a3c' : '#3f7631'));
      R(c, '#7a4a22', 12, 16, 2, 2); R(c, '#b5651d', 15, 17, 2, 2);
    } },
    bush: { w: 16, h: 14, fw: 10, fh: 5, draw(c, r) { c.fillStyle = '#7d7a45'; for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = r() * 6; c.fillRect(Math.round(8 + Math.cos(a) * d), Math.round(8 + Math.sin(a) * d * 0.7), 2, 1); } c.fillStyle = '#5c5a30'; for (let i = 0; i < 12; i++) c.fillRect(3 + Math.floor(r() * 10), 5 + Math.floor(r() * 7), 1, 2); } },
    thorn: { w: 18, h: 18, fw: 8, fh: 4, draw(c, r) { c.strokeStyle = '#5b4a33'; c.lineWidth = 1; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(9, 17); const a = -Math.PI / 2 + (i - 4) * 0.3; c.lineTo(9 + Math.cos(a) * (8 + r() * 6), 17 + Math.sin(a) * (8 + r() * 7)); c.stroke(); } c.fillStyle = '#8c9a5a'; for (let i = 0; i < 12; i++) c.fillRect(2 + Math.floor(r() * 14), 2 + Math.floor(r() * 10), 1, 1); } },
    rock: { w: 16, h: 13, fw: 12, fh: 6, draw(c, r) { c.fillStyle = '#9a8468'; c.beginPath(); c.moveTo(1, 12); c.lineTo(3, 4); c.lineTo(8, 1); c.lineTo(14, 5); c.lineTo(15, 12); c.fill(); c.fillStyle = '#b8a283'; c.beginPath(); c.moveTo(3, 5); c.lineTo(8, 2); c.lineTo(10, 6); c.lineTo(5, 8); c.fill(); R(c, '#7a674f', 9, 8, 5, 4); } },
    bigrock: { w: 34, h: 28, fw: 28, fh: 10, draw(c, r) { c.fillStyle = '#8f7a60'; c.beginPath(); c.moveTo(1, 27); c.lineTo(4, 10); c.lineTo(13, 2); c.lineTo(24, 4); c.lineTo(32, 14); c.lineTo(33, 27); c.fill(); c.fillStyle = '#b29b7c'; c.beginPath(); c.moveTo(6, 11); c.lineTo(13, 4); c.lineTo(20, 6); c.lineTo(14, 15); c.fill(); c.fillStyle = '#6f5d48'; c.beginPath(); c.moveTo(20, 27); c.lineTo(22, 12); c.lineTo(31, 15); c.lineTo(32, 27); c.fill(); } },
    tent: { w: 48, h: 38, fw: 40, fh: 12, draw(c, r, o) { const col = (o && o.color) || '#d8c8a8', dk = shade(col, 0.72); c.fillStyle = col; c.beginPath(); c.moveTo(2, 37); c.lineTo(24, 3); c.lineTo(46, 37); c.fill(); c.fillStyle = dk; c.beginPath(); c.moveTo(24, 3); c.lineTo(46, 37); c.lineTo(30, 37); c.fill(); c.fillStyle = '#2a1c14'; c.beginPath(); c.moveTo(18, 37); c.lineTo(24, 18); c.lineTo(30, 37); c.fill(); R(c, '#6b4a2e', 23, 0, 2, 5); c.fillStyle = (o && o.trim) || '#8e2f2a'; for (let i = 0; i < 6; i++) c.fillRect(6 + i * 3, 31 - i * 4.6, 3, 1); } },
    bigtent: { w: 72, h: 50, fw: 62, fh: 14, draw(c, r, o) { const col = (o && o.color) || '#e6dcc4', dk = shade(col, 0.75); c.fillStyle = col; c.beginPath(); c.moveTo(2, 49); c.lineTo(14, 16); c.lineTo(36, 4); c.lineTo(58, 16); c.lineTo(70, 49); c.fill(); c.fillStyle = dk; c.beginPath(); c.moveTo(36, 4); c.lineTo(58, 16); c.lineTo(70, 49); c.lineTo(46, 49); c.fill(); c.fillStyle = '#231710'; c.beginPath(); c.moveTo(28, 49); c.lineTo(36, 24); c.lineTo(44, 49); c.fill(); R(c, (o && o.trim) || '#2f6f4f', 14, 16, 44, 2); R(c, '#6b4a2e', 35, 0, 2, 6); R(c, (o && o.trim) || '#2f6f4f', 37, 0, 7, 4); } },
    fire: { w: 16, h: 10, fw: 10, fh: 5, anim: true, draw(c) { R(c, '#3a2a1c', 3, 6, 10, 3); R(c, '#5d4630', 2, 7, 4, 2); R(c, '#5d4630', 10, 6, 4, 2); R(c, '#241812', 5, 8, 6, 2); } },
    lamp: { w: 8, h: 24, fw: 4, fh: 3, draw(c) { R(c, '#4a3826', 3, 6, 2, 18); R(c, '#6b5236', 1, 22, 6, 2); R(c, '#2e2218', 1, 4, 6, 3); R(c, '#ffd27a', 2, 1, 4, 3); R(c, '#fff3c0', 3, 2, 2, 1); } },
    brazier: { w: 12, h: 16, fw: 8, fh: 4, anim: true, draw(c) { R(c, '#3b3b44', 1, 6, 10, 3); R(c, '#55555f', 2, 5, 8, 1); R(c, '#2a2a31', 5, 9, 2, 6); R(c, '#3b3b44', 3, 14, 6, 2); } },
    banner: { w: 14, h: 36, fw: 4, fh: 3, draw(c, r, o) { const col = (o && o.color) || '#1e1e1e'; R(c, '#6b4a2e', 2, 2, 2, 34); R(c, '#d9b45a', 1, 0, 4, 3); R(c, col, 4, 4, 9, 12); R(c, shade(col, 1.25), 4, 4, 9, 2); c.fillStyle = col; c.beginPath(); c.moveTo(4, 16); c.lineTo(13, 16); c.lineTo(8, 21); c.fill(); R(c, (o && o.trim) || '#e6dcc4', 7, 8, 3, 3); } },
    aquila: { w: 18, h: 40, fw: 4, fh: 3, draw(c) { R(c, '#6b4a2e', 8, 8, 2, 32); R(c, '#c9a13f', 2, 6, 14, 2); c.fillStyle = '#e6c25a'; c.beginPath(); c.moveTo(9, 0); c.lineTo(17, 5); c.lineTo(9, 4); c.lineTo(1, 5); c.fill(); R(c, '#9e2b25', 4, 9, 10, 9); R(c, '#e6c25a', 6, 12, 6, 1); R(c, '#e6c25a', 6, 15, 6, 1); } },
    well: { w: 22, h: 24, fw: 18, fh: 8, draw(c) { R(c, '#8f8778', 2, 12, 18, 11); R(c, '#b9b1a0', 2, 11, 18, 3); R(c, '#1c3a4a', 5, 12, 12, 2); R(c, '#6b4a2e', 3, 2, 2, 10); R(c, '#6b4a2e', 17, 2, 2, 10); R(c, '#7a5b3a', 2, 1, 18, 2); R(c, '#c8b48a', 10, 3, 1, 7); R(c, '#5d4630', 9, 9, 3, 3); c.fillStyle = '#776f61'; c.fillRect(2, 17, 18, 1); c.fillRect(8, 14, 1, 3); c.fillRect(14, 18, 1, 5); } },
    stall: { w: 34, h: 30, fw: 30, fh: 8, draw(c, r, o) { const col = (o && o.color) || '#a53c33'; R(c, '#6b4a2e', 2, 8, 2, 22); R(c, '#6b4a2e', 30, 8, 2, 22); for (let i = 0; i < 6; i++) R(c, i % 2 ? col : '#e9e2d0', 1 + i * 5.4, 2, 6, 8); R(c, shade(col, 0.7), 1, 9, 32, 1); R(c, '#8b6a45', 3, 18, 28, 4); R(c, '#7a5b3a', 3, 22, 28, 6); const g = ['#d9a441', '#7fa957', '#b5553a', '#e6dcc4', '#6b3f7a']; for (let i = 0; i < 6; i++) R(c, g[Math.floor(r() * g.length)], 5 + i * 4, 15 + Math.floor(r() * 2), 3, 3); } },
    column: { w: 12, h: 40, fw: 8, fh: 4, draw(c) { R(c, '#d9d2c4', 2, 4, 8, 32); c.fillStyle = '#b9b1a0'; c.fillRect(4, 4, 1, 32); c.fillRect(7, 4, 1, 32); R(c, '#f1ece2', 2, 4, 1, 32); R(c, '#e6e0d4', 0, 0, 12, 4); R(c, '#c9c1b2', 0, 3, 12, 1); R(c, '#e6e0d4', 0, 36, 12, 4); R(c, '#a9a08f', 0, 39, 12, 1); } },
    brokencol: { w: 12, h: 18, fw: 8, fh: 4, draw(c) { R(c, '#d9d2c4', 2, 6, 8, 9); c.fillStyle = '#b9b1a0'; c.fillRect(4, 6, 1, 9); c.fillRect(7, 5, 1, 10); R(c, '#d9d2c4', 5, 3, 5, 3); R(c, '#e6e0d4', 0, 14, 12, 4); R(c, '#a9a08f', 0, 17, 12, 1); } },
    trunkcol: { w: 8, h: 30, fw: 4, fh: 3, draw(c) { for (let y = 2; y < 30; y++) { R(c, y % 3 ? '#8a6238' : '#6e4c2a', 2, y, 4, 1); R(c, '#a57a48', 2, y, 1, 1); } R(c, '#7a8a45', 0, 0, 8, 3); } },
    cypress: { w: 14, h: 38, fw: 6, fh: 3, draw(c, r) { c.fillStyle = '#2f5a3a'; c.beginPath(); c.moveTo(7, 0); c.lineTo(13, 30); c.lineTo(1, 30); c.fill(); c.fillStyle = '#3f7350'; c.beginPath(); c.moveTo(7, 2); c.lineTo(8, 28); c.lineTo(3, 28); c.fill(); R(c, '#5d4630', 6, 30, 2, 8); } },
    fountain: { w: 34, h: 26, fw: 30, fh: 10, draw(c) { c.fillStyle = '#c9c1b2'; c.beginPath(); c.ellipse(17, 18, 16, 7, 0, 0, 6.3); c.fill(); c.fillStyle = '#3a95b6'; c.beginPath(); c.ellipse(17, 17, 13, 5, 0, 0, 6.3); c.fill(); R(c, '#e6e0d4', 15, 4, 4, 13); R(c, '#e6e0d4', 12, 3, 10, 2); R(c, '#9fd8ea', 16, 0, 2, 4); R(c, '#9fd8ea', 11, 6, 1, 8); R(c, '#9fd8ea', 22, 6, 1, 8); } },
    jar: { w: 10, h: 12, fw: 8, fh: 4, draw(c) { c.fillStyle = '#a8663c'; c.beginPath(); c.ellipse(5, 7, 4, 5, 0, 0, 6.3); c.fill(); R(c, '#8a4f2c', 3, 0, 4, 3); R(c, '#c98755', 3, 4, 1, 4); } },
    sack: { w: 12, h: 10, fw: 10, fh: 4, draw(c) { c.fillStyle = '#c8b48a'; c.beginPath(); c.ellipse(6, 6, 5, 4, 0, 0, 6.3); c.fill(); R(c, '#a8946c', 5, 0, 2, 3); R(c, '#dccaa2', 3, 4, 2, 2); } },
    crate: { w: 12, h: 12, fw: 12, fh: 6, draw(c) { R(c, '#8b6a45', 0, 0, 12, 12); R(c, '#6a4d30', 0, 0, 12, 1); R(c, '#6a4d30', 0, 11, 12, 1); R(c, '#6a4d30', 0, 0, 1, 12); R(c, '#6a4d30', 11, 0, 1, 12); R(c, '#a8845a', 2, 5, 8, 1); } },
    camel: { w: 30, h: 20, fw: 24, fh: 6, draw(c) { c.fillStyle = '#b08a55'; c.beginPath(); c.ellipse(15, 13, 11, 5, 0, 0, 6.3); c.fill(); c.beginPath(); c.ellipse(13, 8, 4, 4, 0, 0, 6.3); c.fill(); R(c, '#b08a55', 23, 3, 3, 9); R(c, '#b08a55', 24, 1, 5, 3); R(c, '#8e6d40', 6, 16, 18, 3); R(c, '#9e2b25', 9, 6, 8, 3); R(c, '#d9b45a', 9, 9, 8, 1); } },
    mast: { w: 44, h: 70, fw: 6, fh: 4, draw(c) { R(c, '#6b4a2e', 21, 0, 3, 70); R(c, '#8b6a45', 21, 0, 1, 70); R(c, '#6b4a2e', 2, 8, 40, 2); c.fillStyle = '#e9e2d0'; c.beginPath(); c.moveTo(3, 10); c.lineTo(41, 10); c.quadraticCurveTo(44, 30, 38, 44); c.lineTo(6, 44); c.quadraticCurveTo(0, 30, 3, 10); c.fill(); c.fillStyle = '#cfc4a8'; for (let x = 8; x < 40; x += 7) c.fillRect(x, 11, 1, 33); R(c, '#2f6f4f', 24, 1, 8, 4); } },
    chain: { w: 16, h: 8, fw: 0, fh: 0, draw(c) { c.strokeStyle = '#555c66'; c.lineWidth = 1; for (let i = 0; i < 3; i++) { c.strokeRect(1.5 + i * 5, 2.5, 4, 3); } } },
    throne: { w: 28, h: 38, fw: 24, fh: 8, draw(c) { R(c, '#7a5a1e', 4, 0, 20, 30); R(c, '#d9b45a', 6, 2, 16, 26); R(c, '#8e2f2a', 8, 6, 12, 18); R(c, '#e7d9a8', 12, 0, 4, 3); R(c, '#d9b45a', 2, 22, 5, 14); R(c, '#d9b45a', 21, 22, 5, 14); R(c, '#a53c33', 7, 24, 14, 6); R(c, '#7a5a1e', 4, 30, 20, 8); R(c, '#2d6e8e', 13, 9, 2, 2); } },
    treasure: { w: 26, h: 16, fw: 22, fh: 8, draw(c, r) { c.fillStyle = '#c9a13f'; c.beginPath(); c.moveTo(0, 16); c.lineTo(8, 4); c.lineTo(15, 2); c.lineTo(26, 16); c.fill(); for (let i = 0; i < 26; i++) R(c, ['#f3d77a', '#e6c25a', '#fff0b0'][Math.floor(r() * 3)], 3 + Math.floor(r() * 20), 5 + Math.floor(r() * 10), 1, 1); R(c, '#2d6e8e', 11, 6, 2, 2); R(c, '#b33', 16, 10, 2, 2); } },
    chest: { w: 14, h: 12, fw: 12, fh: 6, draw(c, r, o) { R(c, '#6b4a2e', 0, 3, 14, 9); R(c, '#8b6a45', 1, 4, 12, 7); R(c, '#d9b45a', 0, 6, 14, 1); R(c, '#d9b45a', 6, 5, 2, 3); if (o && o.open) { R(c, '#2a1c14', 1, 1, 12, 3); R(c, '#fff0b0', 3, 2, 8, 1); } else { R(c, '#7a5b3a', 0, 0, 14, 4); R(c, '#9a7850', 1, 1, 12, 1); } } },
    rack: { w: 16, h: 34, fw: 14, fh: 6, draw(c, r) { R(c, '#151824', 0, 0, 16, 34); R(c, '#232838', 1, 1, 14, 32); for (let y = 3; y < 31; y += 4) { R(c, '#0d0f18', 2, y, 12, 3); R(c, r() < 0.5 ? '#39e6ff' : '#7dffb0', 3 + Math.floor(r() * 4), y + 1, 1, 1); if (r() < 0.4) R(c, '#ffb347', 11, y + 1, 1, 1); } } },
    shelf: { w: 32, h: 30, fw: 30, fh: 6, draw(c, r) { R(c, '#3d2c1e', 0, 0, 32, 30); for (let y = 2; y < 28; y += 9) { R(c, '#241812', 1, y, 30, 8); for (let x = 2; x < 30;) { const w = 1 + Math.floor(r() * 3); R(c, ['#8e2f2a', '#2f6f4f', '#c9a13f', '#2d6e8e', '#d8cfc0', '#5d4630'][Math.floor(r() * 6)], x, y + 1 + Math.floor(r() * 2), w, 7); x += w + (r() < 0.2 ? 2 : 0); } } } },
    desk: { w: 30, h: 18, fw: 28, fh: 8, draw(c) { R(c, '#3d2c1e', 0, 4, 30, 14); R(c, '#5d4630', 0, 3, 30, 3); R(c, '#e9e2d0', 5, 1, 8, 4); R(c, '#39e6ff', 18, 0, 8, 5); R(c, '#0d2a38', 19, 1, 6, 3); } },
    neon: { w: 26, h: 30, fw: 4, fh: 3, draw(c, r, o) { const col = (o && o.color) || '#ff4fd8'; R(c, '#2a2f3e', 12, 12, 2, 18); R(c, '#11131c', 0, 0, 26, 13); R(c, col, 2, 2, 22, 1); R(c, col, 2, 10, 22, 1); R(c, col, 2, 2, 1, 9); R(c, col, 23, 2, 1, 9); c.fillStyle = '#fff'; for (let i = 0; i < 5; i++) c.fillRect(5 + i * 4, 5 + (i % 2), 2, 3); } },
    screen: { w: 40, h: 34, fw: 6, fh: 3, draw(c, r) { R(c, '#11131c', 0, 0, 40, 26); R(c, '#1b2340', 1, 1, 38, 24); for (let i = 0; i < 40; i++) R(c, ['#39e6ff', '#ff4fd8', '#ffe08a', '#7dffb0'][Math.floor(r() * 4)], 2 + Math.floor(r() * 36), 2 + Math.floor(r() * 22), 1 + Math.floor(r() * 3), 1); R(c, '#2a2f3e', 18, 26, 4, 8); } },
    isnad: { w: 36, h: 44, fw: 28, fh: 8, draw(c) { R(c, '#2a2f3e', 4, 36, 28, 8); R(c, '#454d68', 4, 36, 28, 1); c.strokeStyle = '#c9a13f'; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(18, 30 - i * 8, 6, 4.5, i % 2 ? 0.5 : -0.5, 0, 6.3); c.stroke(); } R(c, '#fff3c0', 17, 2, 2, 2); } },
    pylon: { w: 12, h: 34, fw: 6, fh: 4, hue: true, draw(c, r, o) { const h = (o && o.hue) || 200; R(c, '#0d1030', 3, 6, 6, 26); R(c, `hsl(${h},90%,65%)`, 5, 6, 2, 26); R(c, `hsl(${h},100%,85%)`, 4, 2, 4, 4); R(c, '#1a1f55', 1, 30, 10, 4); for (let i = 0; i < 4; i++) R(c, `hsl(${(h + 60) % 360},100%,75%)`, 3 + (i % 2) * 5, 10 + i * 5, 1, 2); } },
    glyph: { w: 14, h: 14, fw: 0, fh: 0, hue: true, draw(c, r, o) { const h = (o && o.hue) || 200; c.fillStyle = `hsla(${h},100%,75%,.9)`; for (let i = 0; i < 7; i++) c.fillRect(2 + Math.floor(r() * 9), 2 + Math.floor(r() * 9), 1 + Math.floor(r() * 4), 1 + Math.floor(r() * 2)); } },
    carpetroll: { w: 16, h: 8, fw: 14, fh: 4, draw(c) { R(c, '#8e2f2a', 1, 2, 14, 5); R(c, '#d9b45a', 1, 2, 1, 5); R(c, '#d9b45a', 14, 2, 1, 5); R(c, '#a53c33', 3, 3, 10, 1); } },
    mat: { w: 20, h: 10, fw: 0, fh: 0, flat: true, draw(c) { R(c, '#b8a26a', 0, 1, 20, 8); c.fillStyle = '#9a8552'; for (let x = 1; x < 20; x += 3) c.fillRect(x, 1, 1, 8); R(c, '#d6c28a', 0, 1, 20, 1); } },
    minbar: { w: 16, h: 22, fw: 14, fh: 6, draw(c) { R(c, '#6b4a2e', 2, 14, 12, 8); R(c, '#8b6a45', 2, 14, 12, 2); R(c, '#6b4a2e', 5, 8, 9, 6); R(c, '#8b6a45', 5, 8, 9, 2); R(c, '#6b4a2e', 9, 2, 5, 6); R(c, '#8b6a45', 9, 2, 5, 2); c.fillStyle = '#c9a13f'; c.fillRect(3, 17, 1, 1); c.fillRect(6, 11, 1, 1); c.fillRect(10, 5, 1, 1); R(c, '#4a3220', 13, 0, 1, 22); } },
    rug: { w: 24, h: 14, fw: 0, fh: 0, flat: true, draw(c, r, o) { const col = (o && o.color) || '#8e2f2a', a2 = (o && o.trim) || '#d9b45a'; R(c, col, 0, 1, 24, 12); R(c, a2, 1, 2, 22, 1); R(c, a2, 1, 11, 22, 1); R(c, a2, 1, 2, 1, 10); R(c, a2, 22, 2, 1, 10); c.fillStyle = '#f1e7cc'; for (let k = 0; k < 3; k++) { const x = 6 + k * 6; c.beginPath(); c.moveTo(x, 4); c.lineTo(x + 3, 7); c.lineTo(x, 10); c.lineTo(x - 3, 7); c.fill(); } c.fillStyle = '#27608f'; for (let k = 0; k < 3; k++) c.fillRect(5 + k * 6, 6, 2, 2); } },
    lantern: { w: 10, h: 26, fw: 4, fh: 3, draw(c) { R(c, '#4a3826', 4, 8, 2, 18); R(c, '#6b5236', 2, 24, 6, 2); R(c, '#2e2218', 2, 2, 6, 7); R(c, '#ffd27a', 3, 3, 4, 5); c.fillStyle = '#2e2218'; c.fillRect(3, 5, 4, 1); c.fillRect(5, 3, 1, 5); R(c, '#c9a13f', 4, 0, 2, 2); } },
    basin: { w: 24, h: 18, fw: 20, fh: 8, draw(c) { c.fillStyle = '#c9c1b2'; c.beginPath(); c.moveTo(12, 1); c.lineTo(23, 9); c.lineTo(12, 17); c.lineTo(1, 9); c.fill(); c.fillStyle = '#e6e0d4'; c.fillRect(4, 4, 16, 10); c.fillStyle = '#3a95b6'; c.beginPath(); c.moveTo(12, 4); c.lineTo(19, 9); c.lineTo(12, 14); c.lineTo(5, 9); c.fill(); c.fillStyle = '#8fd3e4'; c.fillRect(10, 8, 4, 1); R(c, '#c9a13f', 11, 8, 2, 2); } },
    spring: { w: 20, h: 12, fw: 0, fh: 0, flat: true, draw(c) { c.fillStyle = '#3a95b6'; c.beginPath(); c.ellipse(10, 6, 9, 5, 0, 0, 6.3); c.fill(); c.fillStyle = '#8fd3e4'; c.fillRect(6, 4, 4, 1); c.fillRect(11, 7, 3, 1); } }
  };
  G.OBJ = OBJ;
  const ocache = {};
  G.obj = function (type, opt, seed) {
    const key = type + JSON.stringify(opt || {}) + (seed || 0);
    if (ocache[key]) return ocache[key];
    const d = OBJ[type]; const cv = mk(d.w, d.h); d.draw(cv.getContext('2d'), I.rng(I.hash(key)), opt);
    return (ocache[key] = cv);
  };

  /* ================= PERSONNAGES (sans visage) ================= */
  const ccache = {};
  // Personnages en blocs : des volumes, jamais de traits. Tête = cube d'étoffe ; les Compagnons portent
  // un panneau de lumière à la place du visage.
  G.charSheet = function (look) {
    const key = JSON.stringify(look); if (ccache[key]) return ccache[key];
    const cv = mk(48, 96), c = cv.getContext('2d');
    const kind = look.kind || 'homme', robe = look.robe || '#8a7355', cloak = look.cloak || shade(robe, 0.68);
    const lit = kind === 'compagnon' || !!look.aura, short = kind === 'soldat' || kind === 'romain' || kind === 'marin' || kind === 'cyber';
    let head = look.head || '#e6dcc4'; if (kind === 'berbere') head = look.veil || '#1c3a5a'; if (kind === 'moine') head = shade(robe, 0.9);
    const panel = lit ? '#fff6d4' : shade(head, 0.82), legs = short ? '#4a3d32' : shade(robe, 0.8), arm = shade(robe, 0.9);
    for (let dir = 0; dir < 4; dir++) for (let f = 0; f < 3; f++) {
      const ox = f * 16, oy = dir * 24, side = dir === 1 || dir === 2, flip = dir === 2;
      const B = (col, x, y, w, h) => R(c, col, ox + (flip ? 16 - x - w : x), oy + y, w, h);
      const cube = (col, x, y, w, h) => { B(col, x, y, w, h); B(shade(col, 1.22), x, y, w, 1); B(shade(col, 0.72), flip ? x : x + w - 1, y + 1, 1, h - 1); B(shade(col, 0.58), x, y + h - 1, w, 1); };
      if (!side) {
        cube(legs, 4, f === 1 ? 16 : 17, 4, 6); cube(legs, 8, f === 2 ? 16 : 17, 4, 6);
        cube(dir === 3 ? cloak : robe, 4, 9, 8, 8);
        if (dir === 0) { B(cloak, 4, 9, 1, 8); B(cloak, 11, 9, 1, 8); B(shade(cloak, 0.8), 4, 14, 8, 1); }
        cube(arm, 2, f === 1 ? 10 : f === 2 ? 8 : 9, 2, 7); cube(arm, 12, f === 2 ? 10 : f === 1 ? 8 : 9, 2, 7);
        cube(head, 4, 1, 8, 8); if (dir === 0) B(panel, 5, 4, 6, 4);
        if (lit) B(shade(head, 0.7), 4, 3, 8, 1);
      } else {
        if (f === 0) cube(legs, 6, 17, 4, 6); else if (f === 1) { cube(legs, 9, 17, 3, 6); cube(legs, 4, 16, 3, 6); } else { cube(legs, 8, 16, 3, 6); cube(legs, 5, 17, 3, 6); }
        cube(robe, 5, 9, 6, 8); B(cloak, 9, 9, 2, 8);
        cube(arm, f === 1 ? 5 : f === 2 ? 9 : 7, 9, 2, 7);
        cube(head, 4, 1, 8, 8); B(panel, 4, 4, 3, 4);
        if (lit) B(shade(head, 0.7), 4, 3, 8, 1);
      }
      // attributs, eux aussi en blocs
      if (kind === 'soldat') { B('#8a8f98', 4, 1, 8, 2); B('#6b4a2e', 14, 2, 1, 20); B('#c9ced6', 14, 0, 1, 2); }
      if (kind === 'romain') { B('#b9bec8', 4, 1, 8, 2); B('#b33327', 6, 0, 4, 1); if (dir !== 3) B('#b9bec8', side ? 5 : 4, 10, side ? 6 : 8, 4); B('#6b4a2e', 14, 2, 1, 20); B('#c9ced6', 14, 0, 1, 2); }
      if (kind === 'perse') { B(head, 5, 0, 6, 1); B('#d9b45a', 4, 2, 8, 1); B('#d9b45a', side ? 5 : 4, 16, side ? 6 : 8, 1); }
      if (kind === 'ancien') { B('#6b4a2e', 1, 5, 1, 18); B('#e9e2d0', side ? 5 : 4, 9, side ? 6 : 8, 2); }
      if (kind === 'savant') { B('#e9e2d0', side ? 5 : 4, 9, side ? 6 : 8, 2); if (dir === 0) { B('#f1e7cc', 9, 13, 3, 3); B('#8a6238', 9, 13, 3, 1); } }
      if (kind === 'marchand') { B('#d9b45a', side ? 5 : 4, 13, side ? 6 : 8, 1); if (dir === 0) B('#a8663c', 1, 15, 3, 3); }
      if (kind === 'berbere') { B(shade(head, 1.3), 4, 3, 8, 1); if (dir === 0) B('#c79a70', 5, 4, 6, 1); }
      if (kind === 'cyber') { B('#39e6ff', side ? 7 : 7, 10, 1, 6); B('#ff4fd8', side ? 5 : 4, 16, side ? 6 : 8, 1); }
      if (kind === 'marin') { B('#e9e2d0', side ? 5 : 4, 11, side ? 6 : 8, 1); B('#e9e2d0', side ? 5 : 4, 14, side ? 6 : 8, 1); }
    }
    if (kind === 'enfant') { const cv2 = mk(48, 96), c2 = cv2.getContext('2d'); c2.imageSmoothingEnabled = false; for (let dir = 0; dir < 4; dir++) for (let f = 0; f < 3; f++) c2.drawImage(cv, f * 16, dir * 24, 16, 24, f * 16 + 2, dir * 24 + 7, 12, 17); return (ccache[key] = cv2); }
    return (ccache[key] = cv);
  };
  G.DIRS = { down: 0, left: 1, right: 2, up: 3 };

  /* ================= ÉGRÉGORES ================= */
  const ecache = {};
  G.enemy = function (art, hue, scale, seed) {
    const key = art + '|' + hue + '|' + scale + '|' + (seed || 0); if (ecache[key]) return ecache[key];
    const S = scale >= 3 ? 112 : scale === 2 ? 80 : 52;
    const cv = mk(S, S), c = cv.getContext('2d'), r = I.rng(I.hash(key));
    const col = (l, s) => `hsl(${hue},${s === undefined ? 55 : s}%,${l}%)`;
    const c0 = col(14, 40), c1 = col(26, 50), c2 = col(42, 60), c3 = col(64, 80), c4 = col(84, 100), alt = `hsl(${(hue + 150) % 360},90%,70%)`;
    const u = S / 100; c.save(); c.scale(u, u);
    const poly = (pts, fill) => { c.fillStyle = fill; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); };
    const ell = (x, y, rx, ry, fill, rot) => { c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, 6.3); c.fill(); };
    const ring = (x, y, rr, w, st) => { c.strokeStyle = st; c.lineWidth = w; c.beginPath(); c.arc(x, y, rr, 0, 6.3); c.stroke(); };
    switch (art) {
      case 'wisp': poly([[50, 8], [72, 48], [66, 78], [50, 92], [34, 78], [28, 48]], c1); poly([[50, 22], [64, 52], [58, 76], [50, 84], [42, 76], [36, 52]], c2); ell(50, 62, 10, 16, c3); ell(50, 66, 5, 9, c4); ell(22, 30, 5, 7, c2); ell(80, 38, 4, 6, c2); ell(74, 14, 3, 4, c3); break;
      case 'mask': ell(50, 50, 30, 42, c1); ell(46, 46, 24, 36, c2); poly([[50, 8], [54, 40], [47, 58], [53, 92], [49, 92], [43, 58], [50, 40], [46, 8]], c4); poly([[14, 20], [24, 14], [22, 30]], c2); poly([[84, 70], [92, 80], [80, 84]], c2); poly([[80, 16], [90, 22], [82, 28]], c3); break;
      case 'eagle': c.fillStyle = c1; c.fillRect(47, 30, 6, 66); [0, 1, 2].forEach(i => { poly([[50, 34 + i * 10], [6 + i * 6, 12 + i * 12], [14 + i * 6, 30 + i * 11], [50, 46 + i * 10]], i === 0 ? c2 : c1); poly([[50, 34 + i * 10], [94 - i * 6, 12 + i * 12], [86 - i * 6, 30 + i * 11], [50, 46 + i * 10]], i === 0 ? c3 : c2); }); poly([[50, 4], [60, 20], [50, 32], [40, 20]], c3); ell(50, 19, 4, 5, c4); c.fillStyle = c2; c.fillRect(30, 70, 40, 5); ring(50, 82, 9, 3, c3); break;
      case 'crown': poly([[14, 70], [10, 30], [28, 50], [38, 16], [50, 46], [62, 16], [72, 50], [90, 30], [86, 70]], c2); c.fillStyle = c1; c.fillRect(14, 66, 72, 14); c.fillStyle = c3; c.fillRect(14, 66, 72, 3); [[10, 30], [38, 16], [62, 16], [90, 30]].forEach(p => ell(p[0], p[1], 4, 4, c4)); ell(50, 73, 5, 5, alt); ell(30, 73, 3, 3, c4); ell(70, 73, 3, 3, c4); ell(50, 90, 26, 5, c0); break;
      case 'throne': c.fillStyle = c1; c.fillRect(24, 6, 52, 64); poly([[24, 6], [36, 0], [50, 6], [64, 0], [76, 6]], c2); c.fillStyle = c2; c.fillRect(30, 12, 40, 50); c.fillStyle = c0; c.fillRect(36, 18, 28, 38); c.fillStyle = c1; c.fillRect(12, 50, 16, 40); c.fillRect(72, 50, 16, 40); c.fillStyle = c3; c.fillRect(12, 50, 16, 4); c.fillRect(72, 50, 16, 4); c.fillStyle = c2; c.fillRect(24, 66, 52, 12); c.fillStyle = c1; c.fillRect(18, 78, 64, 18); ell(50, 38, 6, 8, c4); ell(50, 70, 18, 3, c4); break;
      case 'tower': for (let i = 0; i < 9; i++) { const x = 50 + Math.sin(i * 0.9) * 5 * (i / 9), y = 90 - i * 9; ell(x, y + 3, 24 - i, 7, c0); ell(x, y, 24 - i, 7, i % 2 ? c2 : c1); ring(x, y, 1, 1, c3); c.strokeStyle = c3; c.lineWidth = 1.6; c.beginPath(); c.ellipse(x, y, 24 - i, 7, 0, 3.4, 6); c.stroke(); } ell(54, 10, 12, 5, c3); ell(54, 10, 5, 2, c4); break;
      case 'lens': [[50, 50, 22], [22, 30, 13], [80, 28, 12], [24, 76, 11], [78, 74, 14], [50, 14, 8], [50, 90, 7]].forEach(([x, y, rr], i) => { c.strokeStyle = c1; c.lineWidth = 3; c.beginPath(); c.moveTo(50, 50); c.lineTo(x, y); c.stroke(); ell(x, y, rr, rr, c1); ell(x, y, rr * 0.78, rr * 0.78, c0); ring(x, y, rr * 0.55, 2, i ? c2 : c3); ell(x - rr * 0.25, y - rr * 0.25, rr * 0.2, rr * 0.2, c4); }); break;
      case 'mirror': poly([[22, 96], [22, 30], [34, 10], [50, 4], [66, 10], [78, 30], [78, 96]], c1); poly([[28, 90], [28, 32], [38, 16], [50, 11], [62, 16], [72, 32], [72, 90]], c3); poly([[28, 90], [28, 50], [72, 26], [72, 60]], c4); poly([[28, 90], [72, 60], [72, 90]], c2); c.strokeStyle = c0; c.lineWidth = 2; c.beginPath(); c.moveTo(40, 18); c.lineTo(52, 44); c.lineTo(44, 60); c.lineTo(58, 88); c.stroke(); ell(50, 4, 6, 4, alt); break;
      case 'swarm': for (let i = 0; i < 46; i++) { const a = r() * 6.28, d = Math.pow(r(), 0.7) * 44, x = 50 + Math.cos(a) * d, y = 50 + Math.sin(a) * d * 0.9, w = 3 + r() * 7; c.fillStyle = [c1, c2, c3, c4][Math.floor(r() * 4)]; if (r() < 0.5) c.fillRect(x, y, w, 2 + r() * 3); else poly([[x, y], [x + w, y + 2], [x + 2, y + w]], c.fillStyle); } ell(50, 50, 9, 9, c0); ell(50, 50, 4, 4, c4); break;
      case 'idol': poly([[30, 96], [34, 14], [44, 4], [56, 4], [66, 14], [70, 96]], c1); poly([[36, 96], [39, 16], [46, 8], [54, 8], [50, 96]], c2); c.fillStyle = c0; for (let y = 28; y < 84; y += 10) c.fillRect(38, y, 24, 2); poly([[46, 40], [54, 40], [56, 54], [50, 60], [44, 54]], c4); c.fillStyle = c0; c.fillRect(20, 90, 60, 8); c.fillStyle = c2; c.fillRect(20, 90, 60, 2); break;
      case 'scale': c.fillStyle = c1; c.fillRect(47, 12, 6, 80); c.fillRect(30, 90, 40, 6); c.save(); c.translate(50, 22); c.rotate(-0.28); c.fillStyle = c2; c.fillRect(-42, -3, 84, 6); c.restore(); ell(50, 22, 7, 7, c3); c.strokeStyle = c2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(10, 34); c.lineTo(2, 62); c.moveTo(10, 34); c.lineTo(20, 62); c.moveTo(90, 10); c.lineTo(84, 30); c.stroke(); poly([[0, 62], [22, 62], [18, 72], [4, 72]], c3); ell(11, 60, 7, 4, c4); poly([[78, 30], [92, 34], [86, 40]], c1); poly([[70, 52], [80, 50], [78, 58]], c1); ell(50, 8, 5, 5, alt); break;
      case 'blade': for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.3, L = 78 - Math.abs(i - 3) * 8; const x = 50 + Math.cos(a) * L, y = 92 + Math.sin(a) * L; const nx = Math.cos(a + 1.57) * 5, ny = Math.sin(a + 1.57) * 5; poly([[50 - nx, 92 - ny], [x, y], [50 + nx, 92 + ny]], i % 2 ? c2 : c3); poly([[50, 92], [x, y], [50 + nx, 92 + ny]], i % 2 ? c1 : c2); } ell(50, 90, 12, 6, c1); ell(50, 88, 5, 3, c4); break;
      case 'wave': c.fillStyle = c1; c.beginPath(); c.moveTo(2, 96); c.bezierCurveTo(0, 40, 30, 4, 66, 10); c.bezierCurveTo(92, 14, 96, 44, 78, 50); c.bezierCurveTo(66, 54, 58, 42, 66, 34); c.bezierCurveTo(48, 30, 36, 60, 60, 78); c.bezierCurveTo(76, 88, 96, 84, 98, 96); c.fill(); c.strokeStyle = c3; c.lineWidth = 2.5; c.beginPath(); c.moveTo(8, 88); c.bezierCurveTo(8, 48, 34, 14, 66, 16); c.stroke(); ell(70, 40, 5, 5, c4); c.fillStyle = c4; [[84, 20], [92, 30], [60, 4], [76, 8]].forEach(p => c.fillRect(p[0], p[1], 3, 3)); ell(40, 74, 14, 10, c0); ell(40, 74, 7, 5, c2); break;
      case 'banner': [[26, -0.25], [50, 0], [74, 0.25]].forEach(([x, rot], i) => { c.save(); c.translate(x, 96); c.rotate(rot); c.fillStyle = c1; c.fillRect(-2, -92, 4, 92); poly([[2, -90], [30, -84], [22, -74], [30, -62], [2, -58]], [c2, c3, c2][i]); c.fillStyle = c4; c.fillRect(8, -78, 6, 6); c.restore(); }); ring(50, 62, 12, 4, c3); ell(50, 62, 5, 5, alt); break;
      case 'colossus': poly([[24, 96], [28, 44], [16, 40], [22, 22], [40, 18], [60, 18], [78, 22], [84, 40], [72, 44], [76, 96]], c1); poly([[34, 96], [36, 26], [50, 22], [50, 96]], c2); ell(50, 12, 9, 11, c2); ell(48, 11, 6, 8, c3); poly([[14, 40], [26, 42], [20, 80], [10, 78]], c1); poly([[86, 40], [74, 42], [80, 80], [90, 78]], c0); c.fillStyle = c3; c.fillRect(48, 40, 4, 56); c.fillRect(40, 44, 20, 4); ell(50, 38, 4, 4, c4); c.fillStyle = c4; c.fillRect(30, 30, 3, 3); c.fillRect(66, 30, 3, 3); break;
      default: ell(50, 50, 30, 30, c1); ell(50, 50, 14, 14, c3);
    }
    c.restore();
    // passe « pixel art » : alpha net, contour sombre, liseré clair, ombrage vertical tramé
    const im = c.getImageData(0, 0, S, S), d = im.data, op = new Uint8Array(S * S);
    for (let i = 0; i < S * S; i++) { op[i] = d[i * 4 + 3] > 120 ? 1 : 0; d[i * 4 + 3] = op[i] ? 255 : 0; }
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = y * S + x, p = i * 4;
      if (op[i]) {
        const sh = 1 - (y / S) * 0.32 - ((x + y) % 2 && y / S > 0.55 ? 0.08 : 0);
        d[p] *= sh; d[p + 1] *= sh; d[p + 2] *= sh;
        if ((y === 0 || !op[i - S]) || (x === 0 || !op[i - 1])) { d[p] = Math.min(255, d[p] * 1.5 + 30); d[p + 1] = Math.min(255, d[p + 1] * 1.5 + 30); d[p + 2] = Math.min(255, d[p + 2] * 1.5 + 30); }
      } else if ((x > 0 && op[i - 1]) || (x < S - 1 && op[i + 1]) || (y > 0 && op[i - S]) || (y < S - 1 && op[i + S])) { d[p] = 10; d[p + 1] = 8; d[p + 2] = 22; d[p + 3] = 255; }
    }
    c.putImageData(im, 0, 0);
    return (ecache[key] = cv);
  };

  /* ================= SCEAUX (à la place des portraits) ================= */
  const scache = {};
  G.seal = function (arabic, color) {
    const key = (arabic || '') + '|' + color; if (scache[key]) return scache[key];
    const S = 192, cv = mk(S, S), c = cv.getContext('2d');
    c.translate(S / 2, S / 2);
    const g = c.createRadialGradient(0, 0, 10, 0, 0, 96); g.addColorStop(0, '#1a1730'); g.addColorStop(1, '#0b0a16');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, 92, 0, 6.3); c.fill();
    c.strokeStyle = color; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 90, 0, 6.3); c.stroke();
    c.lineWidth = 1.5; c.globalAlpha = 0.9;
    for (let k = 0; k < 2; k++) { c.save(); c.rotate(k * Math.PI / 4); c.strokeRect(-62, -62, 124, 124); c.restore(); }
    c.globalAlpha = 0.5; c.beginPath(); c.arc(0, 0, 78, 0, 6.3); c.stroke();
    for (let i = 0; i < 16; i++) { c.save(); c.rotate(i * Math.PI / 8); c.fillStyle = color; c.fillRect(-1.5, -86, 3, 6); c.restore(); }
    c.globalAlpha = 1;
    if (arabic) {
      c.fillStyle = '#fff6dc'; c.textAlign = 'center'; c.textBaseline = 'middle';
      let fs = arabic.length > 5 ? 44 : 60; c.font = `700 ${fs}px "Reem Kufi", "Noto Kufi Arabic", "Amiri", "Geeza Pro", "Segoe UI", serif`;
      c.shadowColor = color; c.shadowBlur = 16; c.fillText(arabic, 0, 4);
    } else {
      c.fillStyle = color; for (let i = 0; i < 8; i++) { c.save(); c.rotate(i * Math.PI / 4); c.beginPath(); c.moveTo(0, -8); c.lineTo(9, -34); c.lineTo(0, -46); c.lineTo(-9, -34); c.closePath(); c.globalAlpha = 0.75; c.fill(); c.restore(); }
      c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(0, 0, 7, 0, 6.3); c.fill();
    }
    return (scache[key] = cv);
  };
  G.sealURL = function (arabic, color) { const key = 'u' + (arabic || '') + color; if (!scache[key]) scache[key] = G.seal(arabic, color).toDataURL(); return scache[key]; };

  /* ================= COMPOSITION ================= */
  G.init = function (canvas) {
    G.cv = canvas; G.out = canvas.getContext('2d');
    G.pcv = mk(G.PW, G.PH); G.px = G.pcv.getContext('2d'); G.px.imageSmoothingEnabled = false;
    G.bcv = mk(G.PW / 4, G.PH / 4); G.bx = G.bcv.getContext('2d');
    G.lcv = mk(G.PW / 2, G.PH / 2); G.lx = G.lcv.getContext('2d');
    G.resize();
  };
  G.resize = function () {
    const st = G.cv.parentElement, w = st.clientWidth, dpr = Math.min(window.devicePixelRatio || 1, 2);
    G.k = Math.max(2, Math.min(G.low ? 2 : 4, Math.ceil(w * dpr / G.PW)));
    G.cv.width = G.PW * G.k; G.cv.height = G.PH * G.k;
    st.style.setProperty('--u', (st.clientHeight / G.PH) + 'px');
  };
  // particules et effets HD (coordonnées en pixels logiques)
  const parts = [];
  G.parts = parts;
  G.spawn = function (p) { if (parts.length < 700) parts.push(Object.assign({ x: 0, y: 0, vx: 0, vy: 0, life: 1, t: 0, size: 1, color: '#fff', a: 1, type: 'dot', grav: 0 }, p)); };
  G.clearParts = function () { parts.length = 0; };
  G.amb = { kind: null, n: 0 };
  function ambient(dt) {
    const a = G.amb; if (!a.kind) return;
    a.n += dt * (a.rate || 12);
    while (a.n > 1) {
      a.n--;
      const x = Math.random() * G.PW, y = Math.random() * G.PH;
      if (a.kind === 'dust') G.spawn({ x, y, vx: 3 + Math.random() * 6, vy: -1 + Math.random() * 2, life: 4 + Math.random() * 3, size: 0.5 + Math.random() * 0.8, color: '#fff3d0', a: 0.5, type: 'mote' });
      else if (a.kind === 'sand') G.spawn({ x: -10, y, vx: 90 + Math.random() * 80, vy: 4 + Math.random() * 8, life: 3, size: 0.6, color: '#f1d9a8', a: 0.5, type: 'streak' });
      else if (a.kind === 'embers') G.spawn({ x, y: G.PH + 4, vx: -4 + Math.random() * 8, vy: -14 - Math.random() * 16, life: 5, size: 0.7, color: '#ffb060', a: 0.9, type: 'mote' });
      else if (a.kind === 'rain') G.spawn({ x: Math.random() * (G.PW + 60), y: -10, vx: -50, vy: 330, life: 0.8, size: 0.5, color: '#8fdcff', a: 0.55, type: 'streak' });
      else if (a.kind === 'noos') G.spawn({ x, y: G.PH + 4, vx: 0, vy: -8 - Math.random() * 14, life: 7, size: 1 + Math.random() * 1.6, color: `hsl(${(a.hue || 200) + Math.random() * 80},100%,75%)`, a: 0.7, type: 'glyph' });
      else if (a.kind === 'fireflies') G.spawn({ x, y, vx: -3 + Math.random() * 6, vy: -3 + Math.random() * 6, life: 4, size: 0.8, color: '#ffe9a0', a: 0.8, type: 'mote' });
      else if (a.kind === 'spray') G.spawn({ x, y: G.PH * (0.2 + Math.random() * 0.8), vx: 30 + Math.random() * 30, vy: -6, life: 2.5, size: 0.6, color: '#d8f2ff', a: 0.5, type: 'mote' });
    }
  }
  G.shakeT = 0; G.shake = function (ms) { G.shakeT = Math.max(G.shakeT, (ms || 300) / 1000); };
  G.flashA = 0; G.flashC = '#fff'; G.flash = function (col) { G.flashC = col || '#fff'; G.flashA = 1; };

  /* opts : { ambient:'#rrggbb' (multiplié), lights:[{x,y,r,color,a}], grade:[couleur, alpha], vignette, scan, tilt } */
  G.present = function (dt, o) {
    o = o || {};
    // qualité adaptative : si l'appareil peine, on allège (résolution, flou, nuages, balayage)
    if (!G.low && I.speed === 1) { G._slow = dt > 0.034 ? (G._slow || 0) + 1 : Math.max(0, (G._slow || 0) - 2); if (G._slow > 150) { G.low = true; G.resize(); } }
    if (G.low) { o.tilt = false; o.clouds = null; o.scan = false; o.rays = null; }
    const c = G.out, k = G.k, W = G.cv.width, H = G.cv.height;
    let sx = 0, sy = 0;
    if (G.shakeT > 0) { G.shakeT -= dt; sx = (Math.random() - 0.5) * 6 * k * Math.min(1, G.shakeT * 4); sy = (Math.random() - 0.5) * 6 * k * Math.min(1, G.shakeT * 4); }
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    c.imageSmoothingEnabled = false;
    c.fillStyle = '#05040a'; c.fillRect(0, 0, W, H);
    c.drawImage(G.pcv, sx, sy, W, H);
    // flou basse résolution réutilisé pour le halo et le tilt-shift
    G.bx.imageSmoothingEnabled = true; G.bx.globalCompositeOperation = 'source-over'; G.bx.drawImage(G.pcv, 0, 0, G.bcv.width, G.bcv.height);
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    if (o.tilt !== false) { // bandes floues haut/bas (profondeur de champ)
      const bands = 5, bh = H * 0.11 / bands;
      for (let i = 0; i < bands; i++) {
        c.globalAlpha = 0.7 * (1 - i / bands);
        c.drawImage(G.bcv, 0, (i * bh) / H * G.bcv.height, G.bcv.width, bh / H * G.bcv.height, sx, sy + i * bh, W, bh);
        const y = H - (i + 1) * bh;
        c.drawImage(G.bcv, 0, y / H * G.bcv.height, G.bcv.width, bh / H * G.bcv.height, sx, sy + y, W, bh);
      }
      c.globalAlpha = 1;
    }
    // lumière : carte d'éclairage multipliée
    if (o.ambient) {
      const l = G.lx; l.globalCompositeOperation = 'source-over'; l.fillStyle = o.ambient; l.fillRect(0, 0, G.lcv.width, G.lcv.height);
      l.globalCompositeOperation = 'lighter';
      (o.lights || []).forEach(L => {
        const x = L.x / 2, y = L.y / 2, rr = L.r / 2; if (x < -rr || y < -rr || x > G.lcv.width + rr || y > G.lcv.height + rr) return;
        const g = l.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, L.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        l.globalAlpha = L.a === undefined ? 1 : L.a; l.fillStyle = g; l.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      });
      l.globalAlpha = 1;
      c.globalCompositeOperation = 'multiply'; c.drawImage(G.lcv, sx, sy, W, H);
    }
    // ombres de nuages qui dérivent (extérieurs)
    if (o.clouds) {
      c.globalCompositeOperation = 'multiply';
      const t = performance.now() / 1000, cw = 520 * k, chh = 340 * k;
      for (let i = 0; i < 4; i++) {
        const x = ((i * 173 + t * 7 - o.clouds.x * 0.9) % 520 + 520) % 520 * k - 70 * k + sx, y = ((i * 97 + t * 2.2 - o.clouds.y * 0.9) % 340 + 340) % 340 * k - 60 * k + sy, rr = (60 + i * 16) * k;
        const g = c.createRadialGradient(x, y, rr * 0.2, x, y, rr); g.addColorStop(0, 'rgba(96,84,128,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        c.globalAlpha = 0.55; c.fillStyle = '#fff'; c.save(); c.translate(x, y); c.scale(1.7, 1); c.translate(-x, -y); c.fillStyle = g; c.fillRect(x - rr, y - rr, rr * 2, rr * 2); c.restore();
      }
      c.globalAlpha = 1;
    }
    // halo (bloom doux)
    c.globalCompositeOperation = 'screen'; c.globalAlpha = o.bloom === undefined ? 0.2 : o.bloom; c.drawImage(G.bcv, sx, sy, W, H);
    // lueurs additives des sources
    c.globalCompositeOperation = 'lighter';
    (o.lights || []).forEach(L => {
      if (L.glow === false) return;
      const x = L.x * k + sx, y = L.y * k + sy, rr = L.r * k * 0.55; if (x < -rr || y < -rr || x > W + rr || y > H + rr) return;
      const g = c.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, L.color); g.addColorStop(1, 'rgba(0,0,0,0)');
      c.globalAlpha = (L.a === undefined ? 1 : L.a) * 0.28; c.fillStyle = g; c.fillRect(x - rr, y - rr, rr * 2, rr * 2);
    });
    // rayons de lumière
    if (o.rays) {
      c.globalAlpha = o.rays.a || 0.1; c.fillStyle = o.rays.color || '#fff2c8';
      const t = performance.now() / 5000;
      for (let i = 0; i < 5; i++) { const x0 = W * (0.1 + i * 0.2) + Math.sin(t + i) * 30 * k; c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0 + 26 * k, 0); c.lineTo(x0 - 60 * k, H); c.lineTo(x0 - 110 * k, H); c.closePath(); c.fill(); }
    }
    // particules
    ambient(dt);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.t += dt; if (p.t >= p.life) { parts.splice(i, 1); continue; }
      p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      const f = p.t / p.life, al = p.a * (f < 0.15 ? f / 0.15 : 1 - (f - 0.15) / 0.85);
      c.globalAlpha = Math.max(0, al); c.fillStyle = p.color; c.strokeStyle = p.color;
      const x = p.x * k + sx, y = p.y * k + sy, s = p.size * k;
      c.globalCompositeOperation = p.blend || 'lighter';
      if (p.type === 'streak') { c.lineWidth = s; c.beginPath(); c.moveTo(x, y); c.lineTo(x - p.vx * 0.03 * k, y - p.vy * 0.03 * k); c.stroke(); }
      else if (p.type === 'glyph') { c.fillRect(x, y, s, s * 0.5); c.fillRect(x + s * 0.3, y + s * 0.8, s * 0.5, s * 0.4); }
      else if (p.type === 'ring') { c.lineWidth = Math.max(1, s * (1 - f)); c.beginPath(); c.arc(x, y, (p.r0 + (p.r1 - p.r0) * f) * k, 0, 6.3); c.stroke(); }
      else if (p.type === 'pillar') { const w = p.w * k * (1 - f * 0.6); const g = c.createLinearGradient(x - w, 0, x + w, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, p.color); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - w, 0, w * 2, y); }
      else if (p.type === 'arc') { c.lineWidth = s * (1 - f) * 2 + 1; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, p.r0 * k, p.a0 + f * p.sweep * 0.5, p.a0 + p.sweep * (0.3 + f * 0.7)); c.stroke(); }
      else if (p.type === 'spark') { c.lineWidth = s; c.beginPath(); c.moveTo(x, y); c.lineTo(x - p.vx * 0.05 * k, y - p.vy * 0.05 * k); c.stroke(); }
      else if (p.type === 'glow') { const rr = s * 6; const g = c.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, p.color); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
      else { c.beginPath(); c.arc(x, y, s, 0, 6.3); c.fill(); }
    }
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    // étalonnage
    if (o.grade) { c.globalCompositeOperation = o.grade[2] || 'soft-light'; c.globalAlpha = o.grade[1]; c.fillStyle = o.grade[0]; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; }
    if (o.tint) { c.globalAlpha = 0.28; c.fillStyle = o.tint; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
    // balayage cyber
    if (o.scan) { c.globalAlpha = 0.07; c.fillStyle = '#000'; for (let y = 0; y < H; y += k * 2) c.fillRect(0, y, W, k); c.globalAlpha = 1;
      if (Math.random() < 0.02) { const y = Math.random() * H, h = 4 * k; c.drawImage(G.cv, 0, y, W, h, (Math.random() - 0.5) * 20 * k, y, W, h); } }
    // vignette
    const vg = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(4,3,12,${o.vignette === undefined ? 0.55 : o.vignette})`);
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
    if (G.flashA > 0) { c.globalAlpha = G.flashA; c.fillStyle = G.flashC; c.fillRect(0, 0, W, H); c.globalAlpha = 1; G.flashA -= dt * 2.4; }
  };
})();
