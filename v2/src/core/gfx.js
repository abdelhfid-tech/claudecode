/* ISNAD — rendu : tuiles, objets, personnages sans visage, égrégores, sceaux, composition « rétro-HD ». */
(function () {
  'use strict';
  const I = window.ISNAD;
  const G = I.gfx = { PW: 384, PH: 216, T: 16, k: 3 };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  G.mk = mk;

  /* ================= LA DÉFINITION =================
     Le jeu se pense en points logiques : 384 × 216, des cases de 16. G.D dit combien de points réels en fait un :
     1, le dessin d'origine ; 2, un dessin deux fois plus fin (768 × 432). Le code du jeu ne change pas de repère :
     une « toile » créée par G.toile a D fois plus de points que sa taille logique, son contexte dessine en points
     logiques, et drawImage y pose une autre toile à sa taille logique. G.lisse adoucit l'agrandissement final. */
  G.D = 2; G.lisse = false;
  try { const q = /[?&]def=([12])([dl]?)/.exec(location.search); if (q) { G.D = +q[1]; G.lisse = q[2] === 'l'; G.defForce = true; } } catch (e) { /* hors navigateur */ } // ?def=1 : les outils qui comparent à la 1.32

  /* ================= LA LUMIÈRE (2.18 ; D203) =================
     « Fin de journée saturée » (décideur, 19 novembre : « telle quelle ») : une lumière chaude partout, des ombres turquoise
     au lieu de noires ; 2084 au crépuscule ; les récits en lumière dorée ; la nuit seulement où le récit la nomme,
     éclaircie. Rien n'y touche aux personnages : seulement l'image composée (G.present), les décors et les lieux.
     G.LUM règle : expo, l'ambiance relevée vers le blanc (le plancher de la lumière) ; vignette, un facteur sur toute
     vignette ; vig0, où son dégradé commence ; vigC, sa couleur ; nuages, l'ombre des nuages ; lueurs, les lueurs
     additives des sources ; halo, un facteur sur le halo doux (qui voile l'image dès qu'elle est claire) ; chaud, la
     teinte des lumières (multipliée) ; froid, celle des ombres (en « écran ») ; sat, la part de saturation ajoutée.
     Le réglage « Luminosité » (opts.lum) a trois crans : « clair » (d'office : la lumière validée), « moyen » (la même,
     moins relevée, la vignette plus marquée), « sombre » (la lumière de la 2.15 : ses tables de couleurs aussi). G.lum dit
     laquelle des tables de couleurs sert : 215 (sombre) ou 217 (clair et moyen). ?lum=clair|moyen|sombre (ou 215) dans
     l'adresse impose un cran (les outils qui comparent). */
  G.LUMS = {
    clair: { expo: 0.3, vignette: 0.45, vig0: 0.5, vigC: '12,40,52', nuages: 0.25, lueurs: 0.4, halo: 0.65, chaud: '#ffe6cc', froid: '#041c22', sat: 0.2 },
    moyen: { expo: 0.16, vignette: 0.7, vig0: 0.44, vigC: '10,30,40', nuages: 0.36, lueurs: 0.34, halo: 0.8, chaud: '#ffe9d4', froid: '#03161c', sat: 0.12 },
    sombre: { expo: 0, vignette: 1, vig0: 0.35, vigC: '4,3,12', nuages: 0.55, lueurs: 0.28, halo: 1, chaud: null, froid: null, sat: 0 } };
  G.LUMINOSITES = [['clair', I.T('clair')], ['moyen', I.T('moyen')], ['sombre', I.T('sombre')]];
  G.lumNom = 'clair'; G.lum = 217; G.LUM = G.LUMS.clair; G.expo = G.LUM.expo; G.surLumiere = [];
  try { const q = /[?&]lum=(clair|moyen|sombre|215|217)(?:&|$)/.exec(location.search); if (q) { G.lumNom = q[1] === '215' ? 'sombre' : q[1] === '217' ? 'clair' : q[1]; G.lumForce = true; } } catch (e) { /* hors navigateur */ }
  const lumTables = () => { G.lum = G.lumNom === 'sombre' ? 215 : 217; G.LUM = G.LUMS[G.lumNom]; G.expo = G.LUM.expo;
    try { document.documentElement.classList.toggle('lum215', G.lum === 215); } catch (e) { /* hors navigateur */ } };   // l'interface aussi (style.css)
  lumTables();
  // Les trois dessins que le joueur peut choisir (Réglages, « Dessin »). Changer en cours de partie : les images déjà faites
  // sont oubliées, et chaque module qui en garde (la carte, les planches de marche, le fond du titre) refait les siennes.
  G.DESSINS = [['fin', I.T('fin'), 2, false], ['doux', I.T('fin, adouci'), 2, true], ['origine', I.T('d’origine'), 1, false]];
  G.dessin = () => (G.DESSINS.find(d => d[2] === G.D && d[3] === !!G.lisse) || G.DESSINS[0])[0];
  G.surDefinition = [];
  G.definir = function (nom) { const d = G.DESSINS.find(q => q[0] === nom) || G.DESSINS[0]; if (d[2] === G.D && d[3] === !!G.lisse) return false;
    G.D = d[2]; G.lisse = d[3]; [tcache, ocache, ecache].forEach(c => { Object.keys(c).forEach(k => { delete c[k]; }); });
    if (G.cv) { G.pcv = G.toile(G.PW, G.PH); G.px = G.pcv.getContext('2d'); G.resize(); }
    G.surDefinition.forEach(f => { try { f(); } catch (e) { console.error(e); } }); return true; };
  // la luminosité (Réglages, « Luminosité ») : en cours de partie, les tuiles, les objets et les lieux déjà faits sont
  // oubliés et refaits (G.surDefinition, comme pour le dessin) — un cran imposé par l'adresse ne change pas
  G.luminosite = function (nom) { if (!G.LUMS[nom] || nom === G.lumNom || G.lumForce) return false; G.lumNom = nom; lumTables(); lumCouleurs();
    [tcache, ocache, ecache].forEach(c => { Object.keys(c).forEach(k => { delete c[k]; }); });
    G.surLumiere.concat(G.surDefinition).forEach(f => { try { f(); } catch (e) { console.error(e); } }); return true; };
  function fin(c) { // un contexte qui connaît la définition des images qu'on lui donne
    if (c._fin) return c; c._fin = true; const di = c.drawImage;
    c.drawImage = function (img, a, b, w, h, x, y, W, H) { const q = img.hd || 1, n = arguments.length;
      if (n <= 3) return q === 1 ? di.call(c, img, a, b) : di.call(c, img, a, b, img.width / q, img.height / q);
      if (n <= 5) return di.call(c, img, a, b, w, h);
      return di.call(c, img, a * q, b * q, w * q, h * q, x, y, W, H); };
    return c; }
  G.toile = function (w, h, d) { d = d || G.D; const cv = mk(Math.round(w * d), Math.round(h * d)), c = cv.getContext('2d'); cv.hd = d; c.imageSmoothingEnabled = false; if (d !== 1) c.setTransform(d, 0, 0, d, 0, 0); fin(c); return cv; };
  G.fin = fin;
  G.cale = v => Math.round(v * G.D) / G.D; // la position la plus proche qui tombe sur un point réel
  // Agrandit deux fois un dessin au pixel en arrondissant ses escaliers (EPX) : deux voisins de même couleur, en équerre,
  // gagnent le coin qui les sépare. Aucune couleur n'est inventée : un voile reste une seule surface.
  G.epx = function (src) {
    const w = src.width, h = src.height, a = src.getContext('2d').getImageData(0, 0, w, h), s = new Uint32Array(a.data.buffer);
    const cv = mk(w * 2, h * 2), c = cv.getContext('2d'), o = c.createImageData(w * 2, h * 2), t = new Uint32Array(o.data.buffer);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const p = s[y * w + x], A = y ? s[(y - 1) * w + x] : p, B = x < w - 1 ? s[y * w + x + 1] : p, C = x ? s[y * w + x - 1] : p, Dn = y < h - 1 ? s[(y + 1) * w + x] : p, i = y * 2 * w * 2 + x * 2;
      t[i] = (C === A && C !== Dn && A !== B) ? A : p; t[i + 1] = (A === B && A !== C && B !== Dn) ? B : p;
      t[i + w * 2] = (Dn === C && Dn !== B && C !== A) ? C : p; t[i + w * 2 + 1] = (B === Dn && B !== A && Dn !== C) ? Dn : p; }
    c.putImageData(o, 0, 0); cv.hd = (src.hd || 1) * 2; return cv; };
  // Dans une toile fine, ce qui a été tracé au rectangle est encore fait de pavés de 2 × 2 : on en arrondit les escaliers
  // (la même règle qu'EPX, appliquée aux pavés unis), sans toucher à ce qui a été tracé au trait.
  function arrondir(cv) { const W = cv.width, H = cv.height, w = W >> 1, h = H >> 1, c = cv.getContext('2d'), a = c.getImageData(0, 0, W, H), s = new Uint32Array(a.data.buffer), t = new Uint32Array(s);
    const bloc = new Float64Array(w * h); // la couleur d'un pavé uni, ou un nombre négatif propre à chaque pavé mêlé
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * 2 * W + x * 2, p = s[i]; bloc[y * w + x] = (s[i + 1] === p && s[i + W] === p && s[i + W + 1] === p) ? p : -1 - (y * w + x); }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const p = bloc[y * w + x]; if (p < 0) continue;
      const A = y ? bloc[(y - 1) * w + x] : p, B = x < w - 1 ? bloc[y * w + x + 1] : p, C = x ? bloc[y * w + x - 1] : p, Dn = y < h - 1 ? bloc[(y + 1) * w + x] : p, i = y * 2 * W + x * 2;
      if (C === A && C !== Dn && A !== B && A >= 0) t[i] = A; if (A === B && A !== C && B !== Dn && B >= 0) t[i + 1] = B;
      if (Dn === C && Dn !== B && C !== A && C >= 0) t[i + W] = C; if (B === Dn && B !== A && Dn !== C && Dn >= 0) t[i + W + 1] = Dn; }
    s.set(t); c.putImageData(a, 0, 0); return cv; }
  // l'encre : le bord d'un objet s'assombrit d'un point réel, comme le liseré des personnages
  function encrer(cv, f) { const W = cv.width, H = cv.height, c = cv.getContext('2d'), a = c.getImageData(0, 0, W, H), d = a.data, bord = [];
    const plein = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 127;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (plein(x, y) && !(plein(x - 1, y) && plein(x + 1, y) && plein(x, y - 1) && plein(x, y + 1))) bord.push((y * W + x) * 4);
    bord.forEach(i => { d[i] = d[i] * (1 - f) + 26 * f; d[i + 1] = d[i + 1] * (1 - f) + 18 * f; d[i + 2] = d[i + 2] * (1 - f) + 30 * f; });
    c.putImageData(a, 0, 0); return cv; }
  // Adoucit un dessin sans en perdre les contours : chaque point se fond avec ceux de ses voisins qui lui ressemblent (les
  // tons d'une même étoffe), jamais avec un trait d'encre ni avec une autre matière. Le voile reste une seule surface.
  G.adoucir = function (cv, seuil, passes) { const W = cv.width, H = cv.height, c = cv.getContext('2d'), a = c.getImageData(0, 0, W, H), d = a.data;
    for (let n = 0; n < (passes || 2); n++) { const s = new Uint8ClampedArray(d);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (s[i + 3] < 128) continue; let r = s[i] * 4, g = s[i + 1] * 4, b = s[i + 2] * 4, k = 4;
        for (let q = 0; q < 4; q++) { const X = x + (q === 0 ? 1 : q === 1 ? -1 : 0), Y = y + (q === 2 ? 1 : q === 3 ? -1 : 0); if (X < 0 || Y < 0 || X >= W || Y >= H) continue; const j = (Y * W + X) * 4;
          if (s[j + 3] < 128 || Math.abs(s[j] - s[i]) + Math.abs(s[j + 1] - s[i + 1]) + Math.abs(s[j + 2] - s[i + 2]) > (seuil || 84)) continue; r += s[j] * 1.5; g += s[j + 1] * 1.5; b += s[j + 2] * 1.5; k += 1.5; }
        d[i] = r / k; d[i + 1] = g / k; d[i + 2] = b / k; } }
    c.putImageData(a, 0, 0); return cv; };
  // le grain d'un sol fin : chaque point réel reçoit un rien de clair ou de sombre, pour que la matière ne soit plus faite de pavés
  function grain(cv, r, f) { const c = cv.getContext('2d'), w = cv.width, h = cv.height, a = c.getImageData(0, 0, w, h), d = a.data;
    for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const k = 1 + (r() - 0.5) * f; d[i] = Math.min(255, d[i] * k); d[i + 1] = Math.min(255, d[i + 1] * k); d[i + 2] = Math.min(255, d[i + 2] * k); }
    c.putImageData(a, 0, 0); return cv; }
  const R = (c, col, x, y, w, h) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  // la Cité-Miroir : un aplat calé sur les points réels. En dessin fin, tel quel ; au dessin d'origine (un point réel par
  // point logique), un filet d'un demi-point devient un point entier au lieu d'une demi-teinte floue.
  const Rc = (c, col, x, y, w, h) => { if ((c.canvas.hd || 1) > 1) return R(c, col, x, y, w, h);
    const x0 = Math.round(x), y0 = Math.round(y); R(c, col, x0, y0, Math.max(1, Math.round(x + w) - x0), Math.max(1, Math.round(y + h) - y0)); };
  G.Rc = Rc;

  function shade(hex, f) { // f<1 assombrit, >1 éclaircit
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    if (f <= 1) { r *= f; g *= f; b *= f; } else { const t = f - 1; r += (255 - r) * t; g += (255 - g) * t; b += (255 - b) * t; }
    return '#' + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
  }
  G.shade = shade;

  /* ================= TUILES ================= */
  const tcache = {};
  function speck(c, r, cols, n) { R(c, cols[0], 0, 0, 16, 16);
    if (G.D > 1) { for (let i = 0; i < n * 3; i++) R(c, cols[1 + Math.floor(r() * (cols.length - 1))], Math.floor(r() * 32) / 2, Math.floor(r() * 32) / 2, r() < 0.3 ? 1 : 0.5, 0.5); return; } // en dessin fin : un semis trois fois plus serré, de demi-points
    for (let i = 0; i < n; i++) R(c, cols[1 + Math.floor(r() * (cols.length - 1))], Math.floor(r() * 16), Math.floor(r() * 16), 1, 1); }
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
  // la Cité au crépuscule — un asphalte mouillé qui prend le ciel, des murs et des toits qu'on distingue ; au cran « sombre »,
  // ceux de la 2.15 (lumCouleurs, à chaque changement de la luminosité)
  const CITE = {}, CITE_215 = { flaque: 'rgba(80,220,255,.10)', mur: ['#191b27', '#141620', '#20232f'], murHaut: '#2d3147', murJoint: '#0d0e16', toit: ['#10121b', '#0c0d15', '#161927'], toitBord: '#272b3d' },
    CITE_217 = { flaque: 'rgba(255,150,200,.09)', mur: ['#30283e', '#2a2337', '#3a3049'], murHaut: '#584a6e', murJoint: '#1c1626', toit: ['#241d30', '#1e182a', '#2c2439'], toitBord: '#4e4064' };
  // prototype « deux villes » : la pierre de sable et de corail, ses joints, l'eau de la crique
  // (prototype « ville de verre ») : des dalles plus jaunes, presque sans bleu — sous le couchant magenta du prototype de
  // lumière, elles restent couleur de sable au lieu de tourner au saumon
  // (retouche du crépuscule, 2.18) : le couchant est passé derrière les tours ; la pierre de la rue, moins claire, n'a plus
  // que les lampes, les vitrines et l'écran pour la relever
  const CITE2 = { dalle: ['#56452f', '#51412c', '#5c4a33', '#4d3e2a'], joint: 'rgba(70,52,30,.6)', arete: 'rgba(230,206,150,.26)', pique: '#6e5a38', sable: 'rgba(220,196,140,.16)', use: 'rgba(80,62,40,.12)',
    paves: ['#8e7b53', '#86734d', '#95825a', '#806d46'], paveJoint: '#62523a',
    corail: ['#ad9d81', '#a39176', '#b5a68b', '#988567'], eau: ['#22284a', '#262f56', '#1d2240', '#2f3a66'] };
  // l'asphalte et le métal de 2084 : la rue prend le couchant (#3e3360) ; au cran « sombre », ceux de la 2.15
  const P_215 = { asphalt: P.asphalt, metal: P.metal }, P_217 = { asphalt: ['#3e3360', '#463a6c', '#352b54', '#5c4a8a'], metal: ['#343a4c', '#3d4458', '#2c3040', '#4a5270'] };
  const lumCouleurs = () => { Object.assign(CITE, G.lum === 215 ? CITE_215 : CITE_217); Object.assign(P, G.lum === 215 ? P_215 : P_217); };
  lumCouleurs();
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
    asphalt(c, r) { speck(c, r, P.asphalt, 18); if (r() < 0.5) { c.fillStyle = CITE.flaque; c.fillRect(Math.floor(r() * 10), Math.floor(r() * 12), 5, 2); } },
    neonline(c, r) { speck(c, r, P.asphalt, 10); R(c, '#ff4fd8', 0, 7, 16, 1); R(c, 'rgba(255,79,216,.35)', 0, 6, 16, 3); },
    metal(c, r) { speck(c, r, P.metal, 10); c.fillStyle = '#1a1d28'; c.fillRect(0, 15, 16, 1); c.fillRect(15, 0, 1, 16); R(c, '#454d68', 0, 0, 15, 1); R(c, '#5ad', 2, 2, 1, 1); },
    cwall(c, r) { speck(c, r, CITE.mur, 10); R(c, CITE.murHaut, 0, 0, 16, 1); c.fillStyle = CITE.murJoint; c.fillRect(0, 8, 16, 1); if (r() < 0.6) R(c, r() < 0.5 ? '#39e6ff' : '#ffb347', 3 + Math.floor(r() * 8), 3, 3, 2); },
    croof(c, r) { speck(c, r, CITE.toit, 8); R(c, CITE.toitBord, 0, 14, 16, 2); },
    // Prototype « deux villes » : la Cité-Miroir est un vieux quartier de pierre au pied de tours de verre. Ces cases ne
    // servent qu'à elle ; le gros du décor (façades, tours, quai) est peint d'un tenant par la carte (maps.js, peindreCite).
    // cdalle : de grandes dalles couleur sable, carrées ou fendues en deux, aux joints doux, piquées comme la pierre de corail
    cdalle(c, r, v) { const base = CITE2.dalle[v % 4]; speck(c, r, [base, shade(base, 0.95), shade(base, 1.05), shade(base, 0.91)], 12);
      R(c, CITE2.joint, 0, 0, 16, 0.5); R(c, CITE2.joint, 0, 0, 0.5, 16); R(c, CITE2.arete, 0.5, 0.5, 15.5, 0.5);
      if (v % 4 === 1) { R(c, CITE2.joint, 8, 0.5, 0.5, 15.5); R(c, CITE2.arete, 8.5, 0.5, 0.5, 15.5); }
      if (v % 4 === 3) { R(c, CITE2.joint, 0.5, 8, 15.5, 0.5); R(c, CITE2.arete, 0.5, 8.5, 15.5, 0.5); }
      c.fillStyle = CITE2.pique; for (let i = 0; i < 6; i++) c.fillRect(Math.floor(r() * 32) / 2, Math.floor(r() * 32) / 2, 0.5, 0.5);
      if (r() < 0.3) { c.fillStyle = CITE2.use; c.beginPath(); c.ellipse(3 + r() * 10, 3 + r() * 10, 2 + r() * 3, 1.2 + r() * 1.5, r() * 3, 0, 6.3); c.fill(); }
      if (r() < 0.25) { c.fillStyle = CITE2.sable; c.beginPath(); c.ellipse(2 + r() * 12, 2 + r() * 12, 2.5 + r() * 2, 0.8 + r(), 0, 0, 6.3); c.fill(); } },
    // crigole : une rigole d'eau entre deux bordures de pierre, qui prend les lumières ; un filet de laiton court au fond (là où
    // passait la ligne de néon de la 2.15)
    crigole(c, r) { TILE.cdalle(c, r, 1); R(c, '#8a6a46', 0, 5, 16, 1.5); R(c, '#1c2234', 0, 6.5, 16, 3.5); R(c, 'rgba(120,230,255,.18)', 0, 8.5, 16, 1.5); R(c, '#e8c070', 0, 9.5, 16, 0.5);
      R(c, '#d8bc86', 0, 10, 16, 1); R(c, '#ecd49c', 0, 5, 16, 0.5);
      [['#ffcf6a', 0.6], ['#39e6ff', 0.45], ['#ffb45a', 0.5]].forEach(([col, a]) => { c.globalAlpha = a; c.fillStyle = col; const x = Math.floor(r() * 24) / 2; c.fillRect(x, 7 + Math.floor(r() * 3) / 2, 1.5 + r() * 2, 0.5); }); c.globalAlpha = 1; },
    // le fond (tours), la façade et la crique : de simples aplats, repeints par la carte
    ctour(c) { R(c, '#3a2458', 0, 0, 16, 16); },
    cfacade(c, r) { speck(c, r, CITE2.corail, 10); },
    ccrique(c, r, v) { speck(c, r, CITE2.eau, 8); c.fillStyle = 'rgba(150,190,230,.35)'; for (let i = 0; i < 2; i++) c.fillRect((i * 7 + v * 5) % 12, 4 + i * 7, 3 + (v % 2), 0.5); },
    ceau(c, r, v) { TILE.ccrique(c, r, v); },
    cquai(c, r) { speck(c, r, ['#cdb08a', '#c2a47e', '#d8bc94', '#b89a74'], 8); },
    // au seuil de la ruelle, de vieux pavés : de petites pierres usées, à joints creux
    cpave(c, r) { R(c, CITE2.paveJoint, 0, 0, 16, 16); for (let y = 0; y < 16; y += 4) for (let x = (y % 8 ? -2 : 0); x < 16; x += 4) { R(c, CITE2.paves[Math.floor(r() * CITE2.paves.length)], x + 0.5, y + 0.5, 3, 3); R(c, 'rgba(255,240,210,.3)', x + 0.5, y + 0.5, 2, 0.5); } },
    // la crique bouge : quelques rides de lumière et un reflet doré, posés sur l'eau peinte (un calque sans fond, quatre images)
    cride(c, r, v) { c.fillStyle = 'rgba(196,224,255,.2)'; for (let i = 0; i < 3; i++) c.fillRect((i * 5 + v * 4) % 13, 2 + i * 5 + (v % 2), 2 + ((i + v) % 3), 0.5);
      c.fillStyle = 'rgba(255,214,150,.22)'; c.fillRect((v * 7 + 3) % 12, 13 - (v % 3), 3, 0.5); },
    // la grille de l'ascenseur : une cabine éclairée derrière une grille pliante de bronze
    cgrille(c) { R(c, '#2a1a22', 0, 0, 16, 16); const g = c.createLinearGradient(0, 2, 0, 16); g.addColorStop(0, '#ffd9a0'); g.addColorStop(1, '#c8783e'); c.fillStyle = g; c.fillRect(2, 2, 12, 14);
      c.strokeStyle = '#b8955a'; c.lineWidth = 0.5; c.beginPath(); for (let x = 2; x <= 14; x += 3) { c.moveTo(x, 2); c.lineTo(x, 16); } for (let k = 0; k < 4; k++) { c.moveTo(2 + k * 3, 2); c.lineTo(2 + k * 3 + 3, 9); c.lineTo(2 + k * 3, 16); } c.stroke();
      R(c, '#9a7c4c', 0, 0, 16, 2); R(c, '#9a7c4c', 0, 0, 2, 16); R(c, '#9a7c4c', 14, 0, 2, 16); R(c, '#fff0c0', 7.5, 0.5, 1, 1); },
    nfloor(c, r, v, hue) { R(c, '#0c0f2c', 0, 0, 16, 16); c.fillStyle = `hsla(${hue},90%,65%,.55)`; c.fillRect(0, 0, 16, 1); c.fillRect(0, 0, 1, 16); c.fillStyle = `hsla(${hue},90%,70%,.14)`; c.fillRect(1, 1, 15, 15); c.fillStyle = `hsla(${(hue + 40) % 360},100%,80%,.8)`; if (r() < 0.35) c.fillRect(3 + Math.floor(r() * 10), 3 + Math.floor(r() * 10), 1, 1); },
    nabri(c, r, v, hue) { R(c, '#141833', 0, 0, 16, 16); c.fillStyle = 'rgba(255,233,176,.5)'; c.fillRect(0, 0, 16, 1); c.fillRect(0, 0, 1, 16); c.fillStyle = 'rgba(255,233,176,.13)'; c.fillRect(1, 1, 15, 15); c.fillStyle = 'rgba(255,246,220,.8)'; if (r() < 0.3) c.fillRect(3 + Math.floor(r() * 10), 3 + Math.floor(r() * 10), 1, 1); }, // le sol d'un abri : une lumière chaude, là où rien ne rôde
    npont(c, r, v, hue) { R(c, '#0b0f2e', 0, 0, 16, 16); c.fillStyle = `hsla(${hue},90%,72%,.17)`; c.fillRect(0, 0, 16, 16); c.fillStyle = `hsla(${(hue + 40) % 360},100%,80%,.6)`; if (r() < 0.22) c.fillRect(2 + Math.floor(r() * 12), 2 + Math.floor(r() * 12), 1, 1); }, // un pont du labyrinthe : ses arêtes de lumière sont tracées par la carte, selon ses voisins
    nbridge(c, r, v, hue) { R(c, '#080a20', 0, 0, 16, 16); c.fillStyle = `hsla(${(hue + 150) % 360},100%,70%,.75)`; c.fillRect(0, 3, 16, 1); c.fillRect(0, 12, 16, 1); c.fillStyle = `hsla(${(hue + 150) % 360},100%,70%,.18)`; c.fillRect(0, 4, 16, 8); },
    void(c, r) { R(c, '#04051a', 0, 0, 16, 16); if (r() < 0.3) R(c, '#3b3f8a', Math.floor(r() * 16), Math.floor(r() * 16), 1, 1); if (r() < 0.08) R(c, '#cfd6ff', Math.floor(r() * 16), Math.floor(r() * 16), 1, 1); },
    // zellige « étoile et croix » : l'étoile à huit branches naît de deux carrés superposés
    zellij(c, r, v) { const pal = v % 2 ? ['#d8c08a', '#2d7f8f', '#f1e7cc', '#c9a13f'] : ['#d8c08a', '#27608f', '#f1e7cc', '#b5553a']; R(c, pal[0], 0, 0, 16, 16); c.fillStyle = pal[1]; c.fillRect(3, 3, 10, 10); c.beginPath(); c.moveTo(8, 1); c.lineTo(15, 8); c.lineTo(8, 15); c.lineTo(1, 8); c.fill(); c.fillStyle = pal[2]; c.beginPath(); c.moveTo(8, 4); c.lineTo(12, 8); c.lineTo(8, 12); c.lineTo(4, 8); c.fill(); R(c, pal[3], 7, 7, 2, 2); R(c, pal[3], 0, 0, 1, 1); R(c, pal[3], 15, 0, 1, 1); R(c, pal[3], 0, 15, 1, 1); R(c, pal[3], 15, 15, 1, 1); },
    zsand(c, r) { R(c, '#d4b47c', 0, 0, 16, 16); c.fillStyle = '#c29b62'; c.fillRect(3, 3, 10, 10); c.beginPath(); c.moveTo(8, 1); c.lineTo(15, 8); c.lineTo(8, 15); c.lineTo(1, 8); c.fill(); c.fillStyle = '#e6cf9c'; c.beginPath(); c.moveTo(8, 4); c.lineTo(12, 8); c.lineTo(8, 12); c.lineTo(4, 8); c.fill(); R(c, '#a8824f', 7, 7, 2, 2); },
    gwall(c, r) { TILE.wall(c, r); R(c, '#f1e0b8', 0, 2, 16, 5); c.fillStyle = '#2d7f8f'; for (let x = 0; x < 16; x += 4) { c.beginPath(); c.moveTo(x, 4.5); c.lineTo(x + 2, 2); c.lineTo(x + 4, 4.5); c.lineTo(x + 2, 7); c.fill(); } c.fillStyle = '#c9a13f'; for (let x = 1; x < 16; x += 4) c.fillRect(x, 4, 2, 1); R(c, '#8e5a2a', 0, 1, 16, 1); R(c, '#8e5a2a', 0, 7, 16, 1); },
    mihrab(c, r) { TILE.gwall(c, r); R(c, '#1c2f3a', 4, 3, 8, 13); c.fillStyle = '#1c2f3a'; c.beginPath(); c.arc(8, 4, 4, Math.PI, 0); c.fill(); R(c, '#2d7f8f', 5, 5, 6, 11); c.fillStyle = '#2d7f8f'; c.beginPath(); c.arc(8, 5, 3, Math.PI, 0); c.fill(); c.fillStyle = '#f1e7cc'; c.beginPath(); c.moveTo(8, 6); c.lineTo(10, 9); c.lineTo(8, 12); c.lineTo(6, 9); c.fill(); R(c, '#c9a13f', 7, 8, 2, 2); },
    // pièces à bâtir : fossé, sillons, bloc de pisé vu du dessus (face supérieure claire, face avant sombre)
    trench(c, r) { speck(c, r, P.sand, 10); R(c, '#3a2a1c', 1, 3, 14, 10); R(c, '#24180f', 2, 5, 12, 7); R(c, '#6b4a2e', 1, 3, 14, 1); R(c, '#b08a59', 0, 1, 16, 2); R(c, '#c9a567', 0, 13, 16, 2); c.fillStyle = '#8a6238'; c.fillRect(4, 2, 1, 2); c.fillRect(11, 2, 1, 2); },
    field(c, r) { R(c, '#8a6a3a', 0, 0, 16, 16); c.fillStyle = '#6e5028'; for (let y = 1; y < 16; y += 4) c.fillRect(0, y, 16, 2); c.fillStyle = '#9ac25a'; for (let y = 0; y < 16; y += 4) for (let x = 1 + (y % 8 ? 2 : 0); x < 16; x += 4) { c.fillRect(x, y, 1, 2); c.fillRect(x + 1, y + 1, 1, 1); } },
    bwall(c, r) { R(c, '#d9b37f', 0, 0, 16, 9); R(c, '#e8c896', 0, 0, 16, 2); R(c, '#b98f5c', 0, 9, 16, 7); R(c, '#a07a4c', 0, 15, 16, 1); c.fillStyle = '#a98252'; c.fillRect(0, 12, 16, 1); c.fillRect(5, 9, 1, 3); c.fillRect(11, 12, 1, 3); c.fillStyle = '#c9a56e'; for (let i = 0; i < 6; i++) c.fillRect(Math.floor(r() * 15), 2 + Math.floor(r() * 6), 1, 1); },
    dark(c) { R(c, '#07060c', 0, 0, 16, 16); }
  };
  /* 2.23 (D212) — les quartiers de la Cité-Miroir : l'asphalte des avenues, où passe le couchant ; la pierre polie des places ;
     la pelouse et les allées du parc ; les gradins de la tribune ; le gravier du coin calme ; une haie basse. Le bâti et la
     piste sont des aplats, repeints d'un tenant par la carte (maps.js, peindreQuartiers). Aucun signe, aucune lettre. */
  Object.assign(TILE, {
    qroute(c, r) { speck(c, r, ['#2e2b3e', '#332f45', '#29263a', '#3a364e'], 14); if (r() < 0.22) R(c, 'rgba(255,160,150,.07)', Math.floor(r() * 10), Math.floor(r() * 12), 6, 1.5); },
    qparvis(c, r, v) { const b = ['#6a5844', '#655440', '#705e48', '#61503d'][v % 4]; speck(c, r, [b, shade(b, 0.95), shade(b, 1.05)], 8);
      R(c, 'rgba(50,36,26,.5)', 0, 0, 16, 0.5); R(c, 'rgba(50,36,26,.5)', 0, 0, 0.5, 16); R(c, 'rgba(255,232,196,.16)', 0.5, 0.5, 15.5, 0.5);
      if (v % 4 === 2) { R(c, 'rgba(50,36,26,.32)', 8, 0.5, 0.5, 15.5); } if (r() < 0.3) R(c, 'rgba(255,214,170,.07)', 2 + Math.floor(r() * 8), 2 + Math.floor(r() * 8), 5, 3); },
    qgazon(c, r) { speck(c, r, ['#3f5a37', '#38522f', '#466340', '#334a2c'], 30); for (let i = 0; i < 5; i++) R(c, '#55744a', Math.floor(r() * 30) / 2, Math.floor(r() * 28) / 2, 0.5, 1.5); },
    qallee(c, r) { speck(c, r, ['#7c6a54', '#76644f', '#836f59', '#6d5c48'], 22); if (r() < 0.4) R(c, 'rgba(240,220,190,.12)', Math.floor(r() * 12), Math.floor(r() * 12), 3, 1); },
    qgradin(c, r) { R(c, '#584a52', 0, 0, 16, 16); R(c, '#6c5c64', 0, 0, 16, 2); R(c, '#43363e', 0, 7.5, 16, 0.5); R(c, '#6c5c64', 0, 8, 16, 2); R(c, '#43363e', 0, 15.5, 16, 0.5);
      [[1, '#b83a4e'], [5, '#2a8a9a'], [9, '#b83a4e'], [13, '#2a8a9a']].forEach(([x, col]) => { R(c, col, x, 2.5, 2.5, 2.5); R(c, col, x, 10.5, 2.5, 2.5); }); },
    qjardin(c, r) { speck(c, r, ['#6e604e', '#685a49', '#756754', '#615343'], 30); },
    qhaie(c, r) { R(c, '#26381f', 0, 0, 16, 16); speck(c, r, ['#2e4426', '#3a5430', '#24361e', '#466438'], 26); R(c, 'rgba(255,220,170,.1)', 0, 0, 16, 1); R(c, '#1a2616', 0, 14.5, 16, 1.5); },
    qsalle(c, r, v) { R(c, '#1c1828', 0, 0, 16, 16); R(c, v % 2 ? 'rgba(255,79,216,.14)' : 'rgba(57,230,255,.12)', 0, 0, 16, 0.5); R(c, 'rgba(255,255,255,.05)', 0, 0, 0.5, 16); if (r() < 0.4) R(c, 'rgba(120,200,255,.08)', 3 + Math.floor(r() * 8), 3 + Math.floor(r() * 8), 4, 4); },
    qbat(c) { R(c, '#2a2038', 0, 0, 16, 16); },
    qpiste(c) { R(c, '#2a2834', 0, 0, 16, 16); }
  });
  /* 2.29 (D220) — la carte du monde (maps.js, monde) : une case pour une vingtaine de kilomètres. La steppe (de l'herbe sèche
     sur la terre claire) ; le relief, plein : un sol de pierre, ses sommets (plus grands qu'une case) se peignent avec la carte. */
  Object.assign(TILE, {
    steppe(c, r) { speck(c, r, ['#c2b27a', '#b6a66d', '#cdbd86', '#aa9b61'], 24); for (let i = 0; i < 6; i++) { const x = Math.floor(r() * 15), y = 1 + Math.floor(r() * 13); R(c, '#8f8c4e', x, y, 1, 2); if (r() < 0.6) R(c, '#a9a65e', x + 1, y + 1, 1, 1); } },
    // (le sol pierreux du relief ; ses sommets, plus grands qu'une case, se peignent avec la carte : maps.js, monde)
    mont(c, r) { speck(c, r, ['#d2b276', '#c7a66c', '#d9bb80', '#b8986a'], 26); for (let i = 0; i < 5; i++) R(c, '#9c825f', Math.floor(r() * 14), Math.floor(r() * 14), 2, 1); }
  });
  const SANS_GRAIN = new Set(['dark', 'void', 'nfloor', 'nabri', 'npont', 'nbridge', 'neonline', 'mosaic', 'zellij', 'glaze', 'carpet', 'cgrille', 'ctour', 'cride', 'qbat', 'qpiste', 'qsalle', 'qgradin']); // lumière, vide et carreaux vernis restent nets
  const SOLID = new Set(['mont', 'bwall', 'gwall', 'mihrab', 'water', 'sea', 'wall', 'roof', 'roofedge', 'window', 'thatch', 'rwall', 'rroof', 'rroofedge', 'pwall', 'cwall', 'croof', 'void', 'dark', 'hull', 'ctour', 'cfacade', 'ccrique', 'cgrille', 'cquai', 'ceau', 'qbat', 'qpiste', 'qhaie']);
  // une eau peinte qui bouge : la case qu'on pose par-dessus, image après image (maps.js, finish)
  G.ANIME = { ccrique: 'cride' };
  G.isSolidTile = n => SOLID.has(n);
  G.tile = function (name, variant, hue) {
    const key = name + '|' + (variant || 0) + '|' + (hue || 0);
    if (tcache[key]) return tcache[key];
    const cv = G.toile(16, 16), c = cv.getContext('2d');
    if (G.D > 1) { const fr = c.fillRect.bind(c), bord = (v, n) => v === 0 ? 0 : v + n >= 16 ? v + 0.5 : v + 0.25; // en dessin fin, un trait d'un point se trace deux fois plus fin : joints, lattes, reflets
      c.fillRect = (x, y, w, h) => { if (h === 1 && w > 1) fr(x, bord(y, 1), w, 0.5); else if (w === 1 && h > 1) fr(bord(x, 1), y, 0.5, h); else fr(x, y, w, h); }; }
    (TILE[name] || TILE.dark)(c, I.rng(I.hash(key)), variant || 0, hue || 0);
    if (G.D > 1 && !SANS_GRAIN.has(name)) grain(cv, I.rng(I.hash('g' + key)), 0.09);
    return (tcache[key] = cv);
  };

  /* ================= OBJETS ================= */
  // chaque objet : { w, h, fw, fh (empreinte au sol, px), draw(c, r, opt) }
  const OBJ = {
    palm: { w: 28, h: 44, fw: 6, fh: 4, draw(c, r) {
      if (G.D > 1) { // en dessin fin : un tronc aux anneaux serrés, des palmes en lames courbes avec leurs folioles
        for (let y = 18; y < 44; y += 0.5) { const x = 13 + Math.sin(y / 9) * 1.5; R(c, (Math.floor(y * 2) % 5) ? '#8a6238' : '#6e4c2a', x, y, 3, 0.5); R(c, '#a57a48', x, y, 0.75, 0.5); R(c, '#5e4124', x + 2.5, y, 0.5, 0.5); }
        const palme = (ang, len, col, col2) => { const ox = 14.5, oy = 17, ex = ox + Math.cos(ang) * len, ey = oy + Math.sin(ang) * len + len * len * 0.022, mx = ox + Math.cos(ang) * len * 0.5, my = oy + Math.sin(ang) * len * 0.5 - 2.2;
          c.fillStyle = col; c.beginPath(); c.moveTo(ox, oy - 1); c.quadraticCurveTo(mx, my - 1.6, ex, ey); c.quadraticCurveTo(mx, my + 1.8, ox, oy + 1); c.fill();
          c.strokeStyle = col2; c.lineWidth = 0.5; for (let i = 2; i < len - 1; i += 1.5) { const t = i / len, x = (1 - t) * (1 - t) * ox + 2 * (1 - t) * t * mx + t * t * ex, y = (1 - t) * (1 - t) * oy + 2 * (1 - t) * t * my + t * t * ey; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 0.3, y + 2.4 * (1 - t * 0.5)); c.stroke(); } };
        [[-2.9, 13], [-2.3, 14], [-1.7, 12], [-1.2, 13], [-0.6, 14], [-0.15, 13], [3.5, 11], [-0.9, 10]].forEach(([a, l], i) => palme(a, l, i % 2 ? '#4f8a3c' : '#3f7631', i % 2 ? '#3a6d2c' : '#2f5c26'));
        c.fillStyle = '#7a4a22'; c.beginPath(); c.arc(13, 17.5, 1.2, 0, 6.3); c.fill(); c.fillStyle = '#b5651d'; c.beginPath(); c.arc(16, 18.2, 1.2, 0, 6.3); c.fill(); return; }
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
    // 2.32 — les bêtes qui marchent (gens.js) : de profil, tournées vers la droite (le moteur les retourne) ; o.f, la foulée (0 à 3) ;
    // o.charge, des ballots unis sur une couverture unie (ni motif, ni lettre, ni or). Jamais posées sur une carte : fw/fh à 0.
    b_chameau: { w: 32, h: 25, fw: 0, fh: 0, draw(c, r, o) { o = o || {}; const f = o.f | 0, s = [[0, 0], [1, -1], [0, 0], [-1, 1]][f], B = '#b08a55', S = '#8e6d40', L = '#c4a06a';
      R(c, S, 9 + s[1], 15, 2, 9); R(c, S, 21 + s[0], 15, 2, 9); R(c, '#a07c4a', 12 + s[0], 15, 2, 9); R(c, '#a07c4a', 24 + s[1], 15, 2, 9); // les jambes : loin, plus sombres
      c.fillStyle = B; c.beginPath(); c.ellipse(16, 13, 10, 5, 0, 0, 6.3); c.fill(); c.beginPath(); c.ellipse(14, 8, 5, 4.5, 0, 0, 6.3); c.fill();
      c.fillStyle = '#9c7848'; c.beginPath(); c.ellipse(16, 16, 8, 2, 0, 0, 6.3); c.fill(); R(c, L, 10, 6, 6, 1);
      c.fillStyle = B; c.beginPath(); c.moveTo(23, 12); c.lineTo(26, 12); c.lineTo(29, 4); c.lineTo(26, 3); c.fill(); R(c, B, 26, 2, 5, 3); R(c, '#a07c4a', 30, 3, 2, 2); R(c, S, 26, 1, 1, 1); R(c, '#2a1c14', 28, 3, 1, 1);
      R(c, S, 5, 11, 2, 5);
      if (o.charge) { R(c, '#6f4a30', 9, 8, 11, 3); R(c, '#cdb68c', 6, 9, 6, 6); R(c, '#a8916a', 6, 11, 6, 1); R(c, '#c2a97c', 17, 9, 6, 6); R(c, '#a08a62', 17, 12, 6, 1); R(c, '#6b5537', 9, 9, 1, 6); R(c, '#6b5537', 20, 9, 1, 6); }
    } },
    // 2.34 (D226) — la réserve d'une ville visitée (entraide.js) : un tas de troncs de palmier (du bois), un tas de pierres
    troncs: { w: 26, h: 14, fw: 22, fh: 6, draw(c) { [[2, 8, '#8a6238'], [6, 4, '#7a5530'], [10, 8, '#94683c'], [4, 0, '#86603a']].forEach(q => { R(c, q[2], q[0], q[1] + 2, 18, 4); R(c, '#6e4c2a', q[0], q[1] + 5, 18, 1); for (let x = q[0] + 2; x < q[0] + 18; x += 4) R(c, '#a57a48', x, q[1] + 3, 1, 1); c.fillStyle = '#c9a06a'; c.beginPath(); c.ellipse(q[0] + 18, q[1] + 4, 2, 2, 0, 0, 6.3); c.fill(); R(c, '#8a6238', q[0] + 18, q[1] + 4, 1, 1); }); } },
    tas_pierres: { w: 22, h: 13, fw: 18, fh: 6, draw(c) { [[2, 6, 6, 5, '#9a9184'], [8, 7, 7, 5, '#8a8174'], [14, 6, 6, 5, '#a39a8c'], [5, 2, 6, 5, '#b0a798'], [11, 2, 6, 5, '#948b7e'], [8, -1, 5, 4, '#a8a092']].forEach(q => { c.fillStyle = q[4]; c.beginPath(); c.ellipse(q[0] + q[2] / 2, q[1] + 1 + q[3] / 2, q[2] / 2, q[3] / 2, 0, 0, 6.3); c.fill(); R(c, '#c8c0b2', q[0] + 1, q[1] + 2, 2, 1); }); } },
    // 2.33 (D225) — les bêtes des villes : o.c, la robe (une couleur unie) ; o.f, la foulée
    b_chevre: { w: 18, h: 15, fw: 0, fh: 0, draw(c, r, o) { o = o || {}; const f = o.f | 0, s = [[0, 0], [1, -1], [0, 0], [-1, 1]][f], B = o.c || '#8a6d50', S = '#4a3a2c';
      R(c, S, 4 + s[1], 10, 1, 5); R(c, S, 11 + s[0], 10, 1, 5); R(c, B, 6 + s[0], 10, 1, 5); R(c, B, 13 + s[1], 10, 1, 5);
      c.fillStyle = B; c.beginPath(); c.ellipse(9, 8, 6, 3.5, 0, 0, 6.3); c.fill(); R(c, B, 13, 4, 2, 5); R(c, B, 14, 3, 4, 3); R(c, S, 17, 4, 1, 1); R(c, '#2a2018', 15, 4, 1, 1);
      R(c, '#5a4a38', 14, 1, 1, 2); R(c, '#5a4a38', 13, 0, 1, 1); R(c, B, 13, 4, 1, 1); R(c, S, 3, 5, 1, 2); R(c, S, 16, 6, 1, 1);
    } },
    b_mouton: { w: 18, h: 14, fw: 0, fh: 0, draw(c, r, o) { o = o || {}; const f = o.f | 0, s = [[0, 0], [1, -1], [0, 0], [-1, 1]][f], B = o.c || '#e6dcc6', T0 = '#3a2f28';
      R(c, T0, 5 + s[1], 10, 1, 4); R(c, T0, 12 + s[0], 10, 1, 4); R(c, T0, 7 + s[0], 10, 1, 4); R(c, T0, 14 + s[1], 10, 1, 4);
      c.fillStyle = B; c.beginPath(); c.ellipse(9, 7, 7, 4, 0, 0, 6.3); c.fill(); c.fillStyle = 'rgba(0,0,0,.08)'; [[5, 6], [8, 5], [11, 7], [7, 9], [12, 9]].forEach(q => c.fillRect(q[0], q[1], 1, 1));
      R(c, T0, 15, 5, 3, 3); R(c, T0, 14, 4, 1, 2); R(c, '#d8cdb4', 16, 6, 1, 1);
    } },
    b_ane: { w: 24, h: 20, fw: 0, fh: 0, draw(c, r, o) { o = o || {}; const f = o.f | 0, s = [[0, 0], [1, -1], [0, 0], [-1, 1]][f], B = o.c || '#8b8178', S = '#5e554d';
      R(c, S, 6 + s[1], 13, 2, 7); R(c, S, 15 + s[0], 13, 2, 7); R(c, B, 8 + s[0], 13, 2, 7); R(c, B, 17 + s[1], 13, 2, 7);
      c.fillStyle = B; c.beginPath(); c.ellipse(12, 11, 8, 4, 0, 0, 6.3); c.fill(); R(c, '#cfc6bb', 9, 13, 7, 1);
      c.beginPath(); c.moveTo(17, 10); c.lineTo(20, 10); c.lineTo(22, 4); c.lineTo(19, 4); c.fill(); R(c, B, 19, 4, 5, 4); R(c, '#cfc6bb', 22, 6, 2, 2); R(c, '#2a2420', 21, 5, 1, 1);
      R(c, S, 19, 0, 1, 4); R(c, S, 21, 1, 1, 3); R(c, '#3a332e', 17, 4, 2, 6); R(c, S, 3, 10, 1, 5);
    } },
    b_poule: { w: 11, h: 10, fw: 0, fh: 0, draw(c, r, o) { o = o || {}; const f = o.f | 0, B = o.c || '#c9763a';
      R(c, '#d9a54a', 4 + (f === 1 ? 1 : 0), 8, 1, 2); R(c, '#d9a54a', 6 - (f === 3 ? 1 : 0), 8, 1, 2);
      c.fillStyle = B; c.beginPath(); c.ellipse(5, 6, 3.5, 2.5, 0, 0, 6.3); c.fill(); R(c, '#5a3a22', 1, 3, 2, 3); R(c, B, 7, 2, 2, 3); R(c, '#c23a2a', 7, 1, 2, 1); R(c, '#e0a23a', 9, 3, 1, 1); R(c, '#1e1612', 8, 3, 1, 1);
    } },
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
    // Prototype « ville de verre » (la Cité-Miroir seulement) : chaque objet garde l'empreinte de celui qu'il remplace. Les
    // aplats passent par Rc (au dessin d'origine, ils tombent sur des points entiers). o.eteint : la Cité éteinte de la fin
    // (maps.js, M.eteinte) — l'écran et les bornes deviennent du verre noir.
    // cposte : là où pendaient les enseignes, un fût de rue coiffé d'un claustra de losanges éclairé de la couleur du néon
    cposte: { w: 20, h: 40, fw: 4, fh: 3, draw(c, r, o) { const col = (o && o.color) || '#ff4fd8';
      Rc(c, '#3e2c26', 9, 15, 2, 22); Rc(c, '#8a6a50', 9, 15, 0.5, 22); Rc(c, '#cdb48e', 6.5, 36, 7, 4); Rc(c, '#a88e6c', 6.5, 39, 7, 1);
      Rc(c, '#2a1c1a', 1, 1, 18, 14); Rc(c, col, 2, 2, 16, 12);
      c.save(); c.beginPath(); c.rect(2, 2, 16, 12); c.clip(); c.strokeStyle = '#2a1c1a'; c.lineWidth = (c.canvas.hd || 1) > 1 ? 0.75 : 1; c.beginPath();
      for (let k = -12; k <= 18; k += 4) { c.moveTo(2 + k, 2); c.lineTo(14 + k, 14); c.moveTo(14 + k, 2); c.lineTo(2 + k, 14); } c.stroke(); c.restore();
      for (let y = 4; y < 14; y += 2) for (let x = y % 4 ? 4 : 2; x < 18; x += 4) Rc(c, 'rgba(255,250,235,.8)', x - 0.5, y - 0.5, 1, 1);
      Rc(c, '#9a7c4c', 0, 0, 20, 1.5); Rc(c, '#9a7c4c', 1, 14.5, 18, 1); Rc(c, '#c8a868', 0, 0, 20, 0.5); } },
    // cborne : une borne-écran au cadre sombre filé de laiton ; des aplats qui défilent, sans un mot ni un signe. Éteinte : du
    // verre noir, un reflet
    cborne: { w: 16, h: 34, fw: 6, fh: 3, draw(c, r, o) { Rc(c, '#2e2634', 1, 0, 14, 27); Rc(c, '#a8874e', 1, 0, 14, 0.5); Rc(c, '#120e1a', 2, 1, 12, 25);
      const pas = [0, 1, 2, 3].map(() => [Math.floor(r() * 4), Math.floor(r() * 6) / 2]);
      if (o && o.eteint) { Rc(c, '#06070d', 2.5, 1.5, 11, 24); Rc(c, 'rgba(150,170,220,.14)', 3.5, 2, 1.5, 23); Rc(c, 'rgba(150,170,220,.08)', 6, 2, 1, 23); }
      else { const g = c.createLinearGradient(0, 2, 0, 25); g.addColorStop(0, '#7a3cff'); g.addColorStop(0.55, '#ff4fa8'); g.addColorStop(1, '#ffb45a'); Rc(c, g, 2.5, 1.5, 11, 24);
        pas.forEach(([k, l], i) => { Rc(c, 'rgba(20,10,40,.45)', 4, 3 + i * 5.5, 8, 4.5); Rc(c, ['#39e6ff', '#ffe08a', '#7dffb0', '#ffffff'][k], 4.5, 3.5 + i * 5.5, 3 + l, 3.5); }); }
      Rc(c, '#2a2030', 6, 27, 4, 5); Rc(c, '#cdb48e', 3, 32, 10, 2); Rc(c, '#e6d2ac', 3, 32, 10, 0.5); } },
    // cgrandecran : le grand écran, posé bas devant le pied d'une tour, juste au-dessus des passants : un cadre sombre de
    // 120 × 28, filé de laiton, sur deux pieds courts. Sur un téléphone tenu en hauteur, Idris au lieu 'ecran', son haut
    // (y = 127 sur la carte) passe sous la mini-carte et les boutons, qui s'arrêtent vers y = 125 (la vue y regarde plus
    // haut que celui qui mène : world.js, W.regard). Il montre une lumière
    // qui n'est pas le ciel : des vagues de couleur, une lueur sans contour, trois vignettes, une barre qui se remplit —
    // aucun mot, aucun signe, aucun objet. Éteint (la fin) : du verre noir, deux reflets.
    cgrandecran: { w: 128, h: 34, fw: 6, fh: 3, draw(c, r, o) {
      Rc(c, '#241c2c', 20, 29, 4, 4); Rc(c, '#241c2c', 104, 29, 4, 4); Rc(c, '#cdb48e', 18, 32, 8, 2); Rc(c, '#cdb48e', 102, 32, 8, 2);
      Rc(c, '#120c1c', 4, 1, 120, 28); Rc(c, '#2e2638', 4.5, 1.5, 119, 27); Rc(c, '#a8874e', 4, 1, 120, 0.5); Rc(c, '#0e0a16', 6, 3, 116, 24);
      if (o && o.eteint) { const g = c.createLinearGradient(0, 3, 0, 27); g.addColorStop(0, '#0b0d18'); g.addColorStop(1, '#040509'); Rc(c, g, 6, 3, 116, 24);
        [[16, 10, 0.08], [30, 4, 0.05], [74, 14, 0.07], [94, 5, 0.05]].forEach(([x0, l, a]) => { for (let y = 3; y < 27; y++) Rc(c, `rgba(150,170,220,${a})`, x0 + (27 - y) * 0.5, y, l, 1); });
        return; }
      const g = c.createLinearGradient(6, 3, 86, 27); g.addColorStop(0, '#4a1c8a'); g.addColorStop(0.5, '#e0388e'); g.addColorStop(1, '#ffb050'); Rc(c, g, 6, 3, 80, 24);
      // une lueur sans contour, qui ne figure rien
      const l = c.createRadialGradient(44, 16, 1, 44, 16, 24); l.addColorStop(0, 'rgba(255,236,200,.5)'); l.addColorStop(1, 'rgba(255,236,200,0)'); Rc(c, l, 6, 3, 80, 24);
      // trois vagues de couleur, en escaliers d'un demi-point
      [['rgba(255,214,150,.6)', 12, 2.5], ['rgba(120,230,255,.45)', 18, 2], ['rgba(255,255,255,.32)', 15, 1.5]].forEach(([col, y0, e], k) => {
        for (let x = 6; x < 86; x += 0.5) Rc(c, col, x, Math.round((y0 + Math.sin((x - 6) / 80 * 9.4 + k * 1.3) * 4) * 2) / 2, 0.5, e); });
      const pal = [['#39e6ff', '#7a5cff'], ['#ffe08a', '#ff7a5c'], ['#7dffb0', '#2a8a8a']];
      for (let i = 0; i < 3; i++) { const y = 4 + i * 7.5, gg = c.createLinearGradient(89, y, 121, y + 6); Rc(c, '#2a1840', 88, y, 34, 7); gg.addColorStop(0, pal[i][0]); gg.addColorStop(1, pal[i][1]); Rc(c, gg, 89, y + 1, 32, 5.5); }
      Rc(c, 'rgba(255,255,255,.25)', 9, 24, 74, 1); Rc(c, '#ffffff', 9, 24, 48, 1);
      for (let y = 3; y < 27; y += 2) Rc(c, 'rgba(0,0,0,.14)', 6, y, 116, 0.5); } },
    // cplot : devant le grand écran, un banc de pierre bas et mat, plus large que haut, sur deux pieds (il tient la case du
    // fût d'avant)
    cplot: { w: 18, h: 8, fw: 4, fh: 3, draw(c) { Rc(c, '#dcc8a2', 1, 1, 16, 3); Rc(c, '#f0e2c2', 1, 1, 16, 0.5); Rc(c, '#a68e6a', 1, 3.5, 16, 1);
      Rc(c, '#c4ab84', 2.5, 4, 3, 4); Rc(c, '#c4ab84', 12.5, 4, 3, 4); Rc(c, '#9a8262', 4.5, 4, 1, 4); Rc(c, '#9a8262', 14.5, 4, 1, 4); Rc(c, 'rgba(40,24,30,.35)', 5.5, 4.5, 7, 3.5); } },
    // ccaisse : une caisse de bois cordée, débarquée des barques, un ballot dessus
    ccaisse: { w: 12, h: 12, fw: 12, fh: 6, draw(c) { Rc(c, '#7a4e2e', 0, 3, 12, 9); Rc(c, '#5e3a20', 0, 7, 12, 0.5); Rc(c, '#9a6a40', 0, 3, 12, 0.5); Rc(c, '#5e3a20', 0, 11.5, 12, 0.5);
      Rc(c, '#d4bc84', 5.5, 3, 1, 9); Rc(c, '#9a7c4c', 0, 3, 1.5, 1.5); Rc(c, '#9a7c4c', 10.5, 3, 1.5, 1.5);
      Rc(c, '#cdb48a', 2, 1, 8, 4); Rc(c, '#cdb48a', 1.5, 1.5, 9, 3); Rc(c, '#a88e66', 3, 3.5, 6, 0.5); Rc(c, '#e2d0a8', 4, 1, 3, 0.5); } },
    // cpalmier : un dattier dans sa vasque de pierre, éclairé par le pied ; ses palmes et leurs folioles posées point à point
    cpalmier: { w: 30, h: 56, fw: 0, fh: 0, draw(c) { const q = c.canvas.hd || 1, u = 1 / q, p = v => Math.round(v * q) / q;
      for (let y = 18; y < 45; y += 0.5) { const x = p(13.5 + Math.sin(y / 10) * 1.2), k = (y - 18) / 27; Rc(c, (Math.floor(y * 2) % 5) ? '#8a5e38' : '#6a4426', x, y, 3, 0.5); Rc(c, `rgba(255,214,150,${(0.2 + k * 0.7).toFixed(2)})`, x, y, 1.5, 0.5); Rc(c, '#4a2e1c', x + 2.5, y, 0.5, 0.5); }
      const palme = (ang, len, col, dessous) => { const ox = 15, oy = 17, ex = ox + Math.cos(ang) * len, ey = oy + Math.sin(ang) * len + len * len * 0.022, mx = ox + Math.cos(ang) * len * 0.5, my = oy + Math.sin(ang) * len * 0.5 - 2.2;
        const n = Math.ceil(len * 2 * q), pas = Math.max(1, Math.round(1.5 * q));
        for (let i = 0; i <= n; i++) { const t = i / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, d = t * t, x = p(a * ox + b * mx + d * ex), y = a * oy + b * my + d * ey, e = Math.max(u, p(0.6 + 1.5 * Math.sin(Math.PI * Math.min(1, t * 1.1))));
          Rc(c, col, x, p(y - e / 2), u, e); if (i % pas === 0 && t > 0.12 && t < 0.96) Rc(c, dessous, x, p(y + e / 2), u, Math.max(u, p(2.4 * (1 - t * 0.5)))); } };
      [[-2.9, 14], [-2.3, 15], [-1.7, 13], [-1.2, 14], [-0.6, 15], [-0.15, 14], [3.5, 12], [-0.9, 11]].forEach(([a, l], i) => palme(a, l, i % 2 ? '#5a8a3c' : '#467634', i % 2 ? 'rgba(232,186,110,.7)' : 'rgba(200,150,84,.7)'));
      [[13, 18.5], [16.5, 19], [14.5, 20]].forEach(([x, y]) => { Rc(c, '#b5651d', x - 1, y - 1, 2, 2); Rc(c, '#8a4a14', x, y, 1, 1); });
      Rc(c, '#a88e6c', 8, 44, 15, 5); Rc(c, '#dcc49c', 8, 42.5, 15, 2); Rc(c, '#4a3428', 10, 43, 11, 1); Rc(c, '#8e7656', 8, 48, 15, 1); Rc(c, '#fff0c8', 15, 43, 1, 1); } },
    // cabra : une barque-taxi de la crique, à quai, son toit de toile sur quatre montants
    cabra: { w: 52, h: 26, fw: 0, fh: 0, draw(c, r, o) { if (o && o.flip) { c.translate(52, 0); c.scale(-1, 1); }
      Rc(c, 'rgba(8,6,20,.35)', 6, 22, 42, 3); for (let x = 8; x < 46; x += 5) Rc(c, 'rgba(232,210,160,.3)', x, 23 + (x % 2), 3, 0.5);
      c.fillStyle = '#6a4326'; c.beginPath(); c.moveTo(1, 14); c.lineTo(7, 22); c.lineTo(45, 22); c.lineTo(51, 15); c.lineTo(48, 14.5); c.closePath(); c.fill();
      Rc(c, '#4a2c18', 7, 20, 38, 2); Rc(c, '#d9c49a', 3, 15, 46, 0.75); Rc(c, '#8a5c34', 3, 15.75, 46, 0.5);
      [14, 26, 38].forEach(x => { Rc(c, '#1e1418', x - 1.5, 17, 3, 2); Rc(c, '#1e1418', x - 1, 16.5, 2, 3); });
      Rc(c, '#8a5e38', 12, 11, 28, 3); Rc(c, '#5a3a24', 41, 10, 6, 5);
      [11, 20, 30, 40].forEach(x => Rc(c, '#3a2618', x, 7, 0.75, 8));
      Rc(c, '#efe2c4', 9, 5, 34, 2); Rc(c, '#fff6e2', 9, 5, 34, 0.5); Rc(c, '#b4542e', 9, 7, 34, 0.75); } },
    // cbarjil : une tour à vent de pierre de corail, trapue, posée sur un toit (sa base se cache derrière la façade) : une
    // tête ouverte sur ses quatre côtés (la face, et le côté plus sombre), des fentes à traverse, un toit plat, deux perches
    // de bois qui dépassent ; ni flèche, ni balcon, ni lanterne
    cbarjil: { w: 28, h: 34, fw: 0, fh: 0, draw(c, r) {
      Rc(c, '#d6c29e', 4, 20, 18, 14); Rc(c, '#b39b78', 22, 21, 4, 13); Rc(c, '#e6d6b6', 4, 20, 0.75, 14);
      for (let i = 0; i < 10; i++) Rc(c, '#a89070', 4.5 + Math.floor(r() * 34) / 2, 22 + Math.floor(r() * 22) / 2, 0.5, 0.5);
      Rc(c, '#e6d6b6', 1, 18, 26, 2.5); Rc(c, '#b49c78', 1, 20.5, 26, 0.5);
      Rc(c, '#d6c29e', 2, 4, 20, 14); Rc(c, '#b39b78', 22, 5, 4, 13);
      for (let i = 0; i < 4; i++) { Rc(c, '#3a2622', 3.5 + i * 4.5, 6, 2.5, 11); Rc(c, '#5a4234', 3.5 + i * 4.5, 11, 2.5, 0.75); }
      Rc(c, '#2e1e1c', 22.5, 6.5, 1, 10); Rc(c, '#2e1e1c', 24.5, 6.5, 1, 10); Rc(c, '#4a3428', 22.5, 11, 3, 0.75);
      Rc(c, '#e6d6b6', 0, 1.5, 28, 3); Rc(c, '#f4ead2', 0, 1.5, 28, 0.5); Rc(c, '#c9b28e', 0, 4, 28, 0.75);
      Rc(c, '#5a3c26', 0, 8, 2, 0.75); Rc(c, '#5a3c26', 26, 8, 2, 0.75); Rc(c, '#5a3c26', 0, 15, 2, 0.75); Rc(c, '#5a3c26', 26, 15, 2, 0.75); } },
    // cboutre : un boutre de bois au repos le long du quai, personne à bord : un mât court, la vergue abaissée le long du
    // pont, sa voile serrée dessus ; il reste tout entier sous le bord du quai (posé au rang 20, son haut tombe à y = 276).
    // Ligne de flottaison : 50 points sous le haut de l'objet ; son reflet tremble dessous. Tout est posé point à point.
    cboutre: { w: 84, h: 60, fw: 0, fh: 0, draw(c) { const q = c.canvas.hd || 1, u = 1 / q, p = v => Math.round(v * q) / q, F = 50;
      // le pont se relève vers la poupe (à gauche) et vers l'étrave (à droite) ; la quille remonte en étrave
      const haut = x => x < 22 ? 30 + (x - 6) * 0.44 : x > 62 ? 37 - (x - 62) * 0.32 : 37, bas = x => x < 14 ? F - (14 - x) * 0.8 : x > 64 ? F - (x - 64) * 0.95 : F;
      for (let j = 0; j < 4; j++) Rc(c, j % 2 ? 'rgba(168,112,62,.25)' : 'rgba(106,67,38,.25)', 12 + (j % 2 ? 2 : -1), F + 1.5 + j * 1.6, 56, 0.75);
      for (let x = 6; x < 82; x += u) { const h0 = p(haut(x)), b0 = p(Math.max(bas(x), h0 + 2)); Rc(c, '#6a4326', x, h0, u, b0 - h0); Rc(c, '#a8703e', x, h0, u, 1.5); Rc(c, '#d9c49a', x, h0, u, 0.5); Rc(c, '#4a2c18', x, b0 - 1.5, u, 1.5); }
      // la dunette de poupe : une cabine basse, une lucarne éclairée
      Rc(c, '#8a5a32', 8, 24, 14, 7); Rc(c, '#c49a62', 8, 24, 14, 0.75); Rc(c, '#4a2c18', 10, 26, 3, 3); Rc(c, '#ffe0a0', 17, 26.5, 2, 2);
      // le mât, court, un peu penché vers l'avant ; deux étais
      for (let y = 6; y < 37; y += u) Rc(c, '#5a3820', p(46 + (37 - y) * 0.08), y, 1.5, u);
      const etai = (x0, y0, x1, y1) => { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * q); for (let i = 0; i <= n; i++) Rc(c, 'rgba(70,50,40,.7)', p(x0 + (x1 - x0) * i / n), p(y0 + (y1 - y0) * i / n), u, u); };
      etai(48, 7, 80, 34); etai(47, 7, 12, 24);
      // la vergue abaissée le long du pont, la voile serrée dessus, ses rabans
      for (let x = 16; x < 80; x += u) { const y = p(34.5 - (x - 16) * 0.05); Rc(c, '#6a4428', x, y, u, 1); if (x > 20 && x < 74) Rc(c, '#e8dcc0', x, y - 2, u, 2); }
      for (let x = 24; x < 74; x += 8) Rc(c, '#7a5a3a', x, p(32.5 - (x - 16) * 0.05), 1, 2.5); } },
    // cjet : un jet du miroir d'eau, qui sort d'une grille ronde au ras des dalles (peinte par la carte) : il monte, s'ouvre
    // et retombe en deux gerbes de gouttes, puis s'efface tout à fait le temps que l'anneau d'eau s'élargisse. On passe au
    // travers (aucune empreinte). o.ph : son temps, pour qu'ils dansent l'un après l'autre.
    cjet: { w: 16, h: 32, fw: 0, fh: 0, anim: true, draw() { /* rien d'immobile : la grille est peinte au sol */ },
      animer(c, x, y, t, o) { const q = c.canvas.hd || 1, u = 1 / q, p = v => Math.round(v * q) / q, P = (col, a, b, w, h) => { c.fillStyle = col; c.fillRect(p(a), p(b), Math.max(u, p(w)), Math.max(u, p(h))); };
        const v = Math.max(0, Math.sin(t * 1.7 + (o.ph || 0))), H = 21 * v * v, b = y - 1, rr = 2 + (1 - v) * 2.5, an = 'rgba(150,215,255,.55)';
        P(an, x - rr + 1, b - 1, rr * 2 - 2, 0.5); P(an, x - rr + 1, b + 0.5, rr * 2 - 2, 0.5); P(an, x - rr, b - 0.5, 0.5, 1); P(an, x + rr - 0.5, b - 0.5, 0.5, 1);
        if (H < 1) return;
        P('rgba(70,170,255,.4)', x - 1.5, b - H * 0.4, 3, H * 0.4); P('rgba(80,180,255,.55)', x - 1, b - H, 2, H); P('rgba(200,238,255,.75)', x - 0.5, b - H + 1, 1, H - 1); P('rgba(215,244,255,.8)', x - 1.5, b - H - 1, 3, 1); P('rgba(215,244,255,.6)', x - 2.5, b - H, 1, 1); P('rgba(215,244,255,.6)', x + 1.5, b - H, 1, 1);
        if (H < 5) return;
        const ec = 3 + H * 0.2; for (let k = 1; k <= 8; k++) { const f = k / 9, dy = f * f * H * 0.95, dx = f * ec, a = (0.9 - f * 0.4).toFixed(2); P(`rgba(170,224,255,${a})`, x - 0.5 - dx, b - H + dy, 1, 1); P(`rgba(170,224,255,${a})`, x - 0.5 + dx, b - H + dy, 1, 1); } } },
    // crame : les rames du métro sur leur viaduc (peint sur la carte, maps.js). L'objet couvre toute la carte pour n'être
    // jamais écarté ; seules les rames se dessinent, quelques traits par image, derrière les tours à vent et les tours qui
    // descendent à la rue (o.masque : les rectangles qui les cachent). Personne aux vitres.
    crame: { w: 960, h: 2, fw: 0, fh: 0, anim: true, draw() { /* rien d'immobile */ },
      animer(c, x, y, t, o) { const L = 120, P = 960 + L * 2, x0 = x - o.x, ry = v => y + v - o.y;
        c.save(); if (o.masque) { c.beginPath(); c.rect(x0 - 20, ry(60), 1000, 50); o.masque.forEach(m => c.rect(x0 + m[0], ry(m[1]), m[2], m[3])); c.clip('evenodd'); }
        G.rameMetro(c, x0 + P - L - ((t * 38 + P * 0.55) % P), ry(91), L, -1); G.rameMetro(c, x0 + ((t * 38) % P) - L, ry(93.5), L, 1); c.restore(); } },
    isnad: { w: 36, h: 44, fw: 28, fh: 8, draw(c) { R(c, '#2a2f3e', 4, 36, 28, 8); R(c, '#454d68', 4, 36, 28, 1); c.strokeStyle = '#c9a13f'; c.lineWidth = 2; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(18, 30 - i * 8, 6, 4.5, i % 2 ? 0.5 : -0.5, 0, 6.3); c.stroke(); } R(c, '#fff3c0', 17, 2, 2, 2); } },
    pylon: { w: 12, h: 34, fw: 6, fh: 4, hue: true, draw(c, r, o) { const h = (o && o.hue) || 200; R(c, '#0d1030', 3, 6, 6, 26); R(c, `hsl(${h},90%,65%)`, 5, 6, 2, 26); R(c, `hsl(${h},100%,85%)`, 4, 2, 4, 4); R(c, '#1a1f55', 1, 30, 10, 4); for (let i = 0; i < 4; i++) R(c, `hsl(${(h + 60) % 360},100%,75%)`, 3 + (i % 2) * 5, 10 + i * 5, 1, 2); } },
    glyph: { w: 14, h: 14, fw: 0, fh: 0, hue: true, draw(c, r, o) { const h = (o && o.hue) || 200; c.fillStyle = `hsla(${h},100%,75%,.9)`; for (let i = 0; i < 7; i++) c.fillRect(2 + Math.floor(r() * 9), 2 + Math.floor(r() * 9), 1 + Math.floor(r() * 4), 1 + Math.floor(r() * 2)); } },
    carpetroll: { w: 16, h: 8, fw: 14, fh: 4, draw(c) { R(c, '#8e2f2a', 1, 2, 14, 5); R(c, '#d9b45a', 1, 2, 1, 5); R(c, '#d9b45a', 14, 2, 1, 5); R(c, '#a53c33', 3, 3, 10, 1); } },
    mat: { w: 20, h: 10, fw: 0, fh: 0, flat: true, draw(c) { R(c, '#b8a26a', 0, 1, 20, 8); c.fillStyle = '#9a8552'; for (let x = 1; x < 20; x += 3) c.fillRect(x, 1, 1, 8); R(c, '#d6c28a', 0, 1, 20, 1); } },
    minbar: { w: 16, h: 22, fw: 14, fh: 6, draw(c) { R(c, '#6b4a2e', 2, 14, 12, 8); R(c, '#8b6a45', 2, 14, 12, 2); R(c, '#6b4a2e', 5, 8, 9, 6); R(c, '#8b6a45', 5, 8, 9, 2); R(c, '#6b4a2e', 9, 2, 5, 6); R(c, '#8b6a45', 9, 2, 5, 2); c.fillStyle = '#c9a13f'; c.fillRect(3, 17, 1, 1); c.fillRect(6, 11, 1, 1); c.fillRect(10, 5, 1, 1); R(c, '#4a3220', 13, 0, 1, 22); } },
    rug: { w: 24, h: 14, fw: 0, fh: 0, flat: true, draw(c, r, o) { const col = (o && o.color) || '#8e2f2a', a2 = (o && o.trim) || '#d9b45a'; R(c, col, 0, 1, 24, 12); R(c, a2, 1, 2, 22, 1); R(c, a2, 1, 11, 22, 1); R(c, a2, 1, 2, 1, 10); R(c, a2, 22, 2, 1, 10); c.fillStyle = '#f1e7cc'; for (let k = 0; k < 3; k++) { const x = 6 + k * 6; c.beginPath(); c.moveTo(x, 4); c.lineTo(x + 3, 7); c.lineTo(x, 10); c.lineTo(x - 3, 7); c.fill(); } c.fillStyle = '#27608f'; for (let k = 0; k < 3; k++) c.fillRect(5 + k * 6, 6, 2, 2); } },
    lantern: { w: 10, h: 26, fw: 4, fh: 3, draw(c) { R(c, '#4a3826', 4, 8, 2, 18); R(c, '#6b5236', 2, 24, 6, 2); R(c, '#2e2218', 2, 2, 6, 7); R(c, '#ffd27a', 3, 3, 4, 5); c.fillStyle = '#2e2218'; c.fillRect(3, 5, 4, 1); c.fillRect(5, 3, 1, 5); R(c, '#c9a13f', 4, 0, 2, 2); } },
    basin: { w: 24, h: 18, fw: 20, fh: 8, draw(c) { c.fillStyle = '#c9c1b2'; c.beginPath(); c.moveTo(12, 1); c.lineTo(23, 9); c.lineTo(12, 17); c.lineTo(1, 9); c.fill(); c.fillStyle = '#e6e0d4'; c.fillRect(4, 4, 16, 10); c.fillStyle = '#3a95b6'; c.beginPath(); c.moveTo(12, 4); c.lineTo(19, 9); c.lineTo(12, 14); c.lineTo(5, 9); c.fill(); c.fillStyle = '#8fd3e4'; c.fillRect(10, 8, 4, 1); R(c, '#c9a13f', 11, 8, 2, 2); } },
    pen_goat: { w: 34, h: 26, fw: 30, fh: 8, herd: ['#e9e2d0', '#8a7355', 2], draw(c) { OBJ.pen_goat.fence(c); }, fence(c) { R(c, 'rgba(120,90,50,.35)', 2, 8, 30, 16); c.fillStyle = '#8a6238'; for (let x = 1; x < 34; x += 4) { c.fillRect(x, 4, 2, 6); c.fillRect(x, 20, 2, 6); } c.fillRect(1, 4, 2, 22); c.fillRect(31, 4, 2, 22); c.fillStyle = '#6e4c2a'; c.fillRect(1, 6, 32, 1); c.fillRect(1, 22, 32, 1); } },
    pen_sheep: { w: 34, h: 26, fw: 30, fh: 8, herd: ['#f1ece2', '#3a2a1c', 3], draw(c) { OBJ.pen_goat.fence(c); } },
    pen_camel: { w: 34, h: 26, fw: 30, fh: 8, herd: ['#b08a55', '#8e6d40', 2, 1], draw(c) { OBJ.pen_goat.fence(c); } },
    bales: { w: 22, h: 18, fw: 16, fh: 6, draw(c) { R(c, '#a8845a', 1, 8, 9, 9); R(c, '#8b6a45', 1, 8, 9, 2); R(c, '#c8b48a', 11, 6, 10, 11); R(c, '#a8946c', 11, 6, 10, 2); R(c, '#8e2f2a', 4, 1, 10, 8); R(c, '#a53c33', 4, 1, 10, 2); c.fillStyle = '#5d4630'; c.fillRect(5, 8, 1, 9); c.fillRect(15, 6, 1, 11); c.fillRect(8, 1, 1, 8); R(c, '#d9b45a', 6, 4, 2, 2); R(c, '#d9b45a', 11, 4, 2, 2); } },
    spring: { w: 20, h: 12, fw: 0, fh: 0, flat: true, draw(c) { c.fillStyle = '#3a95b6'; c.beginPath(); c.ellipse(10, 6, 9, 5, 0, 0, 6.3); c.fill(); c.fillStyle = '#8fd3e4'; c.fillRect(6, 4, 4, 1); c.fillRect(11, 7, 3, 1); } }
  };
  // une rame du métro, vue de côté et d'un peu au-dessus : un long fuselage clair, effilé aux deux bouts, un bandeau de vitres
  // fumées où passe le couchant ; vide. sens 1 vers l'est, -1 vers l'ouest ; (x, y) : la queue, au ras des rails ; e :
  // l'échelle (une rame plus lointaine est plus petite).
  G.rameMetro = function (c, x, y, L, sens, e) { e = e || 1; if (x > G.PW + 4 || x + L * e < -4) return;
    const nez = 12, av = sens > 0 ? L : 0, nz = sens > 0 ? -1 : 1, ar = sens > 0 ? 0 : L;
    c.save(); c.translate(x, y); if (e !== 1) c.scale(e, e);
    c.fillStyle = '#d9dee4'; c.fillRect(nez, -10, L - nez * 2, 9);
    c.beginPath(); c.moveTo(av, -1); c.lineTo(av + nz * nez, -1); c.lineTo(av + nz * nez, -10); c.quadraticCurveTo(av + nz * 2, -9, av, -3); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(ar, -1); c.lineTo(ar - nz * nez, -1); c.lineTo(ar - nz * nez, -10); c.quadraticCurveTo(ar - nz * 4, -9, ar, -4); c.closePath(); c.fill();
    c.fillStyle = '#f6f8fa'; c.fillRect(nez, -10, L - nez * 2, 1.5);
    c.fillStyle = '#26324a'; c.fillRect(6, -7.5, L - 12, 3.5);
    c.fillStyle = 'rgba(255,170,110,.55)'; c.fillRect(6, -7.5, L - 12, 1);
    c.fillStyle = '#ffe0a0'; for (let i = 10; i < L - 10; i += 7) c.fillRect(i, -6, 3, 1.5);
    c.fillStyle = '#d9ae55'; c.fillRect(4, -3.5, L - 8, 1);
    c.fillStyle = '#6a7480'; for (let k = 1; k < 3; k++) c.fillRect(Math.round(L * k / 3), -10, 1, 9);
    c.fillStyle = '#3a3440'; c.fillRect(8, -1.5, L - 16, 1.5);
    c.restore();
  };
  /* ================= 2.23 (D212) : LES QUARTIERS DE LA CITÉ =================
     Les voitures — des modèles inventés par le jeu, sans marque, sans logo, sans plaque : un coupé, une berline, une
     citadine, un tout-terrain, une voiture de course (le circuit) ; neuf teintes. Vues de côté (vers la droite ou la gauche),
     de face (elle descend vers nous) et de dos (elle monte). Vitres fumées : personne ne s'y voit. Le point d'appui est le
     milieu du sol, à (22, 28) sur une toile de 44 × 30. Au dessin d'origine, les bords restent nets (un point plein ou rien).
     Puis les objets des quartiers : bornes d'arcade, grand écran (des formes qui coulent, sans texte ni marque), grande roue,
     chaises volantes et tasses qui tournent à vide, bancs, lampadaires, arbres, l'ascenseur du parvis. */
  G.TEINTES = [
    { b: '#e6e2da', o: '#9c988f', l: '#ffffff' },   // nacre
    { b: '#283462', o: '#121a36', l: '#7486c8' },   // bleu de nuit
    { b: '#b81e3a', o: '#661024', l: '#ff7a90' },   // carmin
    { b: '#1e7a62', o: '#0e4034', l: '#62d6ae' },   // émeraude
    { b: '#c49a52', o: '#73562a', l: '#f4dca2' },   // sable
    { b: '#1e1c26', o: '#0a090e', l: '#64627a' },   // ébène
    { b: '#9aa2b0', o: '#566070', l: '#eef2f8' },   // argent
    { b: '#e66a38', o: '#8a3818', l: '#ffb48c' },   // corail
    { b: '#26a4b8', o: '#125866', l: '#8eeaf6' }    // turquoise
  ];
  // L : longueur ; bas : le bas de caisse ; nez : le haut du pare-chocs ; capot : le capot à l'avant ; ceinture : la ligne de
  // caisse au pied du pare-brise ; pare : le pied du pare-brise (x) ; toitAv, toitAr : le toit (x) ; toit : sa hauteur ;
  // lunette : le pied de la lunette arrière (x) ; coffre : le coffre au-dessus de la ceinture ; arriere : la poupe ; rw, wx :
  // le rayon des roues et leur écart ; lw : la largeur, vue de face
  G.MODELES = {
    coupe:    { L: 38, bas: 2.5, nez: 5, capot: 7, ceinture: 8.5, pare: 3, toitAv: -2, toitAr: -9, toit: 13, lunette: -15, coffre: 0.5, arriere: 8.5, rw: 3.6, wx: 12.5, lw: 24 },
    berline:  { L: 38, bas: 3, nez: 6, capot: 8, ceinture: 9.5, pare: 5, toitAv: 0, toitAr: -8.5, toit: 15, lunette: -13, coffre: 0.5, arriere: 9.5, rw: 3.5, wx: 12, lw: 24 },
    citadine: { L: 30, bas: 3, nez: 6.5, capot: 9, ceinture: 10, pare: 7, toitAv: 3, toitAr: -9, toit: 16.5, lunette: -13, coffre: 1.5, arriere: 11.5, rw: 3.4, wx: 9.5, lw: 22 },
    tout:     { L: 36, bas: 4.5, nez: 8, capot: 11, ceinture: 12, pare: 7, toitAv: 3, toitAr: -13, toit: 19, lunette: -16, coffre: 2, arriere: 14, rw: 4.4, wx: 11.5, lw: 26 },
    course:   { L: 40, bas: 2, nez: 4, capot: 5.5, ceinture: 7, pare: 2, toitAv: -3, toitAr: -8, toit: 11.5, lunette: -14, coffre: 0.5, arriere: 7.5, rw: 3.6, wx: 13.5, lw: 25, aileron: true }
  };
  G.MODELES_RUE = ['coupe', 'berline', 'citadine', 'tout'];
  const vitre = (c, y0, y1) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#d48cb8'); g.addColorStop(0.35, '#5a3c6c'); g.addColorStop(1, '#141a2c'); return g; };
  function roue(c, x, y, rw) {
    c.fillStyle = '#121218'; c.beginPath(); c.arc(x, y, rw, 0, 6.3); c.fill();
    c.fillStyle = '#8a909c'; c.beginPath(); c.arc(x, y, rw * 0.58, 0, 6.3); c.fill();
    c.fillStyle = '#c8ccd6'; c.beginPath(); c.arc(x - rw * 0.12, y - rw * 0.12, rw * 0.42, 0, 6.3); c.fill();
    c.fillStyle = '#3a3e48'; for (let k = 0; k < 5; k++) { const a = k * 1.2566; c.fillRect(x + Math.cos(a) * rw * 0.3 - 0.25, y + Math.sin(a) * rw * 0.3 - 0.25, 0.6, 0.6); }
    c.fillStyle = '#5a5e68'; c.beginPath(); c.arc(x, y, rw * 0.14, 0, 6.3); c.fill();
  }
  // de côté, vers la droite (le miroir la tourne vers la gauche)
  function profil(c, M, T) {
    const X = x => 22 + x, Y = y => 28 - y, L2 = M.L / 2;
    // l'ombre des passages de roue
    c.fillStyle = '#0c0a12'; [M.wx, -M.wx].forEach(w => { c.beginPath(); c.arc(X(w), Y(M.rw), M.rw + 1.1, Math.PI, 0); c.fill(); });
    // la caisse : un dégradé, la lumière en haut
    const g = c.createLinearGradient(0, Y(M.toit), 0, Y(M.bas)); g.addColorStop(0, T.l); g.addColorStop(0.42, T.b); g.addColorStop(1, T.o);
    c.fillStyle = g; c.beginPath();
    c.moveTo(X(-L2 + 1.5), Y(M.bas)); c.lineTo(X(L2 - 2), Y(M.bas));
    c.quadraticCurveTo(X(L2 + 0.6), Y(M.bas), X(L2), Y(M.nez));
    c.quadraticCurveTo(X(L2 - 0.4), Y(M.capot + 0.4), X(L2 - 4), Y(M.capot));
    c.lineTo(X(M.pare), Y(M.ceinture));
    c.lineTo(X(M.toitAv), Y(M.toit));
    c.quadraticCurveTo(X((M.toitAv + M.toitAr) / 2), Y(M.toit + 0.7), X(M.toitAr), Y(M.toit));
    c.lineTo(X(M.lunette), Y(M.ceinture + M.coffre));
    c.lineTo(X(-L2 + 1), Y(M.arriere));
    c.quadraticCurveTo(X(-L2 - 0.6), Y(M.arriere - 1), X(-L2), Y(M.bas + 1.5));
    c.closePath(); c.fill();
    // le bas de caisse, plus sombre ; la ligne de caisse, un filet de lumière
    c.fillStyle = T.o; c.fillRect(X(-L2 + 2), Y(M.bas + 1.6), M.L - 4, 1.6);
    c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(X(-L2 + 2.5), Y(M.ceinture - 1.6), M.L - 6.5, 0.5);
    // les vitres, fumées : personne ne s'y voit
    c.fillStyle = vitre(c, Y(M.toit), Y(M.ceinture)); c.beginPath();
    c.moveTo(X(M.pare - 1.4), Y(M.ceinture + 0.7)); c.lineTo(X(M.toitAv - 0.7), Y(M.toit - 1.1)); c.lineTo(X(M.toitAr + 0.6), Y(M.toit - 1.1)); c.lineTo(X(M.lunette + 1.6), Y(M.ceinture + M.coffre + 0.7)); c.closePath(); c.fill();
    // le montant du milieu, un reflet en biais
    const mx = (M.toitAv + M.toitAr) / 2 + 0.5; c.fillStyle = T.o; c.fillRect(X(mx), Y(M.toit - 0.8), 1.1, M.toit - M.ceinture - 1.2);
    c.fillStyle = 'rgba(255,240,250,.28)'; c.beginPath(); c.moveTo(X(M.toitAv - 2.6), Y(M.toit - 1.2)); c.lineTo(X(M.toitAv - 4.2), Y(M.toit - 1.2)); c.lineTo(X(M.pare - 5.5), Y(M.ceinture + 0.8)); c.lineTo(X(M.pare - 3.9), Y(M.ceinture + 0.8)); c.closePath(); c.fill();
    // les portières, le rétroviseur
    c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(X(M.pare - 1.6), Y(M.ceinture), 0.5, M.ceinture - M.bas - 1.8); c.fillRect(X(mx + 0.3), Y(M.ceinture), 0.5, M.ceinture - M.bas - 1.8);
    c.fillStyle = T.o; c.fillRect(X(M.pare - 1.2), Y(M.ceinture + 1.6), 1.6, 1.2);
    // les feux : à l'avant, un trait de lumière ; à l'arrière, le rouge
    c.fillStyle = '#fff6dc'; c.fillRect(X(L2 - 3), Y(M.nez + 1.6), 2.6, 1.1); c.fillStyle = 'rgba(255,246,220,.55)'; c.fillRect(X(L2 - 0.6), Y(M.nez + 1.4), 0.6, 0.8);
    c.fillStyle = '#ff2e50'; c.fillRect(X(-L2 + 0.3), Y(M.arriere - 0.6), 1.4, 2); c.fillStyle = '#ff8a9c'; c.fillRect(X(-L2 + 0.3), Y(M.arriere - 0.6), 0.5, 2);
    if (M.aileron) { c.fillStyle = T.o; c.fillRect(X(-L2 + 2), Y(M.arriere + 3.5), 1, 3.5); c.fillStyle = T.b; c.fillRect(X(-L2 - 0.5), Y(M.arriere + 4.2), 6, 1.2); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(X(-L2 - 0.5), Y(M.arriere + 4.2), 6, 0.4);
      c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(X(-L2 + 3), Y(M.ceinture - 3.4), M.L - 7, 1); }   // une bande de couleur, sans chiffre ni signe
    roue(c, X(M.wx), Y(M.rw), M.rw); roue(c, X(-M.wx), Y(M.rw), M.rw);
  }
  // de face (sens : 'b', elle descend vers nous) ou de dos ('h', elle monte)
  function face(c, M, T, dos) {
    const W2 = M.lw / 2, X = x => 22 + x, Y = y => 28 - y, haut = M.toit + 1.5, capot = M.capot + 3;
    c.fillStyle = '#121218'; [-1, 1].forEach(s => { c.fillRect(X(s * (W2 - 2.2) - 2), Y(5.6), 4, 5.6); });
    // la caisse, le capot (ou le coffre) vu d'un peu au-dessus
    const g = c.createLinearGradient(0, Y(capot), 0, Y(M.bas)); g.addColorStop(0, T.l); g.addColorStop(0.5, T.b); g.addColorStop(1, T.o);
    c.fillStyle = g; c.beginPath(); c.moveTo(X(-W2 + 1), Y(M.bas)); c.lineTo(X(W2 - 1), Y(M.bas)); c.quadraticCurveTo(X(W2 + 0.4), Y(M.bas + 0.5), X(W2), Y(M.nez + 1));
    c.lineTo(X(W2 - 2.6), Y(capot)); c.lineTo(X(-W2 + 2.6), Y(capot)); c.lineTo(X(-W2), Y(M.nez + 1)); c.quadraticCurveTo(X(-W2 - 0.4), Y(M.bas + 0.5), X(-W2 + 1), Y(M.bas)); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(X(-W2 + 3), Y(capot - 0.4), M.lw - 6, 0.5);
    // l'habitacle : le pare-brise (ou la lunette), fumé, et le toit
    c.fillStyle = T.b; c.beginPath(); c.moveTo(X(-W2 + 2.6), Y(capot)); c.lineTo(X(W2 - 2.6), Y(capot)); c.lineTo(X(W2 - 5), Y(haut)); c.lineTo(X(-W2 + 5), Y(haut)); c.closePath(); c.fill();
    c.fillStyle = vitre(c, Y(haut - 1), Y(capot)); c.beginPath(); c.moveTo(X(-W2 + 3.6), Y(capot + (dos ? 1.2 : 0.4))); c.lineTo(X(W2 - 3.6), Y(capot + (dos ? 1.2 : 0.4))); c.lineTo(X(W2 - 5.6), Y(haut - 1.3)); c.lineTo(X(-W2 + 5.6), Y(haut - 1.3)); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,240,250,.25)'; c.beginPath(); c.moveTo(X(-W2 + 7), Y(haut - 1.4)); c.lineTo(X(-W2 + 9.5), Y(haut - 1.4)); c.lineTo(X(-W2 + 7), Y(capot + 0.6)); c.lineTo(X(-W2 + 4.5), Y(capot + 0.6)); c.closePath(); c.fill();
    c.fillStyle = T.l; c.fillRect(X(-W2 + 5), Y(haut), M.lw - 10, 0.6);
    c.fillStyle = T.o; [-1, 1].forEach(s => c.fillRect(X(s * (W2 + 0.3) - (s > 0 ? 0 : 1.4)), Y(capot + 1.6), 1.4, 1.2));   // les rétroviseurs
    if (dos) { // les feux arrière, une barre de lumière rouge ; le coffre
      c.fillStyle = '#ff2e50'; [-1, 1].forEach(s => c.fillRect(X(s * (W2 - 3) - 1.8), Y(M.nez + 1.4), 3.6, 1.2)); c.fillStyle = 'rgba(255,60,90,.55)'; c.fillRect(X(-W2 + 4.5), Y(M.nez + 1), M.lw - 9, 0.5);
      c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(X(-3), Y(M.nez - 0.5), 6, 0.5);
      if (M.aileron) { c.fillStyle = T.o; c.fillRect(X(-W2 + 1), Y(capot + 2.6), M.lw - 2, 1.2); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(X(-W2 + 1), Y(capot + 2.6), M.lw - 2, 0.4); }
    } else { // les phares, la calandre sombre (ni logo ni signe)
      c.fillStyle = '#fff6dc'; [-1, 1].forEach(s => c.fillRect(X(s * (W2 - 3.4) - 2), Y(M.nez + 1.5), 4, 1.1));
      c.fillStyle = '#1a1820'; c.fillRect(X(-M.lw * 0.2), Y(M.nez + 0.9), M.lw * 0.4, 2.2); c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(X(-M.lw * 0.2), Y(M.nez + 0.1), M.lw * 0.4, 0.4);
    }
    if (M.aileron) { c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(X(-1.2), Y(haut - 0.2), 2.4, haut - M.bas - 1); }
  }
  // au dessin d'origine, un point est plein ou vide : les bords restent nets
  function net(cv) { if ((cv.hd || 1) > 1) return; const c = cv.getContext('2d'), a = c.getImageData(0, 0, cv.width, cv.height), d = a.data;
    for (let i = 3; i < d.length; i += 4) d[i] = d[i] < 110 ? 0 : 255; c.putImageData(a, 0, 0); }
  G.voitureNet = net;
  /* 2.27 (D216) — la moto de Sâlim, vue de côté (vers la droite) : deux roues, un cadre sombre, un réservoir de sa teinte, une
     selle, une fourche ; un phare, un feu. Ni marque, ni logo, ni plaque, ni chiffre. */
  function motoProfil(c, T) {
    const X = x => 22 + x, Y = y => 28 - y, rw = 4.4;
    c.fillStyle = '#3a3e48'; c.fillRect(X(-13), Y(6.4), 11, 1.4); c.fillStyle = '#8a909c'; c.fillRect(X(-13), Y(6.4), 11, 0.5);   // l'échappement
    c.strokeStyle = '#1c1a22'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(X(-12), Y(rw)); c.lineTo(X(-3), Y(7.5)); c.lineTo(X(4), Y(9)); c.stroke();   // le bras oscillant, le cadre
    c.fillStyle = '#2a2830'; c.fillRect(X(-4), Y(9.5), 8, 5); c.fillStyle = '#5a5e68'; c.fillRect(X(-3.5), Y(9), 7, 0.75); c.fillRect(X(-3.5), Y(6.5), 7, 0.5);   // le moteur
    const g = c.createLinearGradient(0, Y(14), 0, Y(9)); g.addColorStop(0, T.l); g.addColorStop(0.5, T.b); g.addColorStop(1, T.o);
    c.fillStyle = g; c.beginPath(); c.moveTo(X(-1), Y(9.5)); c.lineTo(X(8.5), Y(10)); c.quadraticCurveTo(X(9), Y(13.6), X(5), Y(14)); c.lineTo(X(0), Y(13.2)); c.closePath(); c.fill();   // le réservoir
    c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(X(1), Y(13.3), 5, 0.5);
    c.fillStyle = '#1e1c26'; c.beginPath(); c.moveTo(X(-11), Y(11.2)); c.lineTo(X(-0.5), Y(12.4)); c.lineTo(X(-0.5), Y(10.6)); c.lineTo(X(-10.5), Y(10)); c.closePath(); c.fill();   // la selle
    c.fillStyle = T.b; c.beginPath(); c.moveTo(X(-14.5), Y(12)); c.lineTo(X(-10.5), Y(11.4)); c.lineTo(X(-10), Y(9.6)); c.lineTo(X(-14), Y(10.4)); c.closePath(); c.fill();   // la poupe
    c.fillStyle = '#ff2e50'; c.fillRect(X(-15), Y(11.6), 1.2, 1.3);
    c.strokeStyle = '#b8bec8'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(X(12.5), Y(rw)); c.lineTo(X(8.5), Y(15.2)); c.stroke();   // la fourche
    c.strokeStyle = '#2a2830'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(X(8.5), Y(15.2)); c.lineTo(X(5.5), Y(16.4)); c.stroke(); c.fillStyle = '#2a2830'; c.fillRect(X(6.5), Y(18), 0.6, 2.2); c.fillRect(X(5.8), Y(18.6), 2, 0.9);   // le guidon, le rétroviseur
    c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(X(10.6), Y(13.2), 1.4, 0, 6.3); c.fill(); c.fillStyle = 'rgba(255,246,220,.5)'; c.fillRect(X(11.8), Y(13.6), 0.8, 0.8);   // le phare
    c.fillStyle = T.o; c.beginPath(); c.moveTo(X(10), Y(9)); c.quadraticCurveTo(X(13.5), Y(9.6), X(15.5), Y(7.2)); c.lineTo(X(14.5), Y(6.8)); c.quadraticCurveTo(X(12.5), Y(8.4), X(9.8), Y(8)); c.closePath(); c.fill();   // le garde-boue
    roue(c, X(-12), Y(rw), rw); roue(c, X(12.5), Y(rw), rw);
  }
  // de face (elle vient vers nous) ou de dos
  function motoFace(c, T, dos) {
    const X = x => 22 + x, Y = y => 28 - y;
    c.fillStyle = '#121218'; c.beginPath(); c.ellipse(X(0), Y(4.4), 1.9, 4.4, 0, 0, 6.3); c.fill();
    const g = c.createLinearGradient(0, Y(15), 0, Y(9)); g.addColorStop(0, T.l); g.addColorStop(1, T.o); c.fillStyle = g; c.beginPath(); c.ellipse(X(0), Y(11.5), 3.6, 3.2, 0, 0, 6.3); c.fill();
    c.fillStyle = '#2a2830'; c.fillRect(X(-3), Y(9), 6, 3);
    if (dos) { c.fillStyle = '#1e1c26'; c.fillRect(X(-2.4), Y(14.4), 4.8, 2); c.fillStyle = '#ff2e50'; c.fillRect(X(-1.6), Y(10.6), 3.2, 1.2); }
    else { c.fillStyle = '#b8bec8'; c.fillRect(X(-2.2), Y(12), 0.8, 6); c.fillRect(X(1.4), Y(12), 0.8, 6); c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(X(0), Y(12.2), 1.6, 0, 6.3); c.fill(); }
    c.fillStyle = '#2a2830'; c.fillRect(X(-7), Y(16.2), 14, 0.9); c.fillRect(X(-7.5), Y(18.4), 1.4, 2.6); c.fillRect(X(6.1), Y(18.4), 1.4, 2.6);   // le guidon, les rétroviseurs
  }
  /* 2.27 (D216) — vus de dessus, pour la course (circuit.js) : une voiture de course et la moto de Sâlim, ses deux passagers,
     le nez à droite, dans une toile de 28 × 28 (le centre à 14, 14). Vitres fumées ; une bande de couleur, sans chiffre ni
     signe ; ni marque, ni logo, ni plaque. Vus de dessus, Sâlim et Idris ne montrent que le haut de leur tête et leurs
     épaules. Le moteur les tourne (G.dessus : trente-deux caps, gardés). */
  function voitureDessus(c, T, m) {
    const rr = (x, y, w, h, rad) => { c.beginPath(); c.moveTo(x + rad, y); c.lineTo(x + w - rad, y); c.quadraticCurveTo(x + w, y, x + w, y + rad); c.lineTo(x + w, y + h - rad); c.quadraticCurveTo(x + w, y + h, x + w - rad, y + h); c.lineTo(x + rad, y + h); c.quadraticCurveTo(x, y + h, x, y + h - rad); c.lineTo(x, y + rad); c.quadraticCurveTo(x, y, x + rad, y); c.closePath(); };
    c.fillStyle = '#121218'; [[6, 7.6], [18, 7.6], [6, 18.6], [18, 18.6]].forEach(([x, y]) => { rr(x, y, 4.6, 1.8, 0.7); c.fill(); });   // les roues
    const g = c.createLinearGradient(0, 9, 0, 19); g.addColorStop(0, T.o); g.addColorStop(0.3, T.b); g.addColorStop(0.5, T.l); g.addColorStop(0.7, T.b); g.addColorStop(1, T.o);
    c.fillStyle = g; rr(3.5, 9, 21, 10, 3.2); c.fill();
    c.fillStyle = vitre(c, 9.5, 18.5); c.beginPath(); c.moveTo(13, 10.4); c.lineTo(16.6, 11); c.lineTo(16.6, 17); c.lineTo(13, 17.6); c.closePath(); c.fill();   // le pare-brise
    c.fillStyle = T.o; rr(8.5, 10.4, 4.6, 7.2, 1.2); c.fill(); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(9, 10.8, 3.6, 0.5);   // le toit
    c.fillStyle = vitre(c, 10.4, 17.6); c.fillRect(6.6, 10.9, 1.9, 6.2);   // la lunette
    c.fillStyle = T.o; c.fillRect(15, 8.2, 1.4, 1); c.fillRect(15, 18.8, 1.4, 1);   // les rétroviseurs
    c.fillStyle = '#fff6dc'; c.fillRect(23.4, 10.2, 1.2, 1.6); c.fillRect(23.4, 16.2, 1.2, 1.6);
    c.fillStyle = '#ff2e50'; c.fillRect(3.4, 10.2, 1, 1.6); c.fillRect(3.4, 16.2, 1, 1.6);
    if (m === 'course') { c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(17, 13.5, 6.5, 1); c.fillRect(4.5, 13.5, 2, 1);   // une bande de couleur, sans chiffre ni signe
      c.fillStyle = T.o; c.fillRect(2.2, 8.4, 1.6, 11.2); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(2.2, 8.4, 0.5, 11.2); }   // l'aileron
  }
  function motoDessus(c, T, salim, idris, penche) {
    const dy = (penche || 0) * 1.1;
    c.fillStyle = '#121218'; c.beginPath(); c.ellipse(22.2, 14, 2.6, 0.95, 0, 0, 6.3); c.fill(); c.beginPath(); c.ellipse(6.4, 14, 2.6, 1, 0, 0, 6.3); c.fill();   // les roues
    const g = c.createLinearGradient(0, 12, 0, 16); g.addColorStop(0, T.o); g.addColorStop(0.5, T.l); g.addColorStop(1, T.o); c.fillStyle = g; c.beginPath(); c.ellipse(15, 14, 4.6, 1.9, 0, 0, 6.3); c.fill();   // le réservoir
    c.fillStyle = '#1e1c26'; c.fillRect(7, 12.9, 6, 2.2); c.fillStyle = T.b; c.fillRect(4.6, 13.1, 2.6, 1.8);
    c.strokeStyle = '#3a3e48'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(19.4, 10.2); c.lineTo(19.4, 17.8); c.stroke(); c.fillStyle = '#1c1a22'; c.fillRect(19, 9.4, 0.9, 1.4); c.fillRect(19, 17.2, 0.9, 1.4);   // le guidon
    c.fillStyle = '#fff6dc'; c.fillRect(23.6, 13.4, 0.9, 1.2); c.fillStyle = '#ff2e50'; c.fillRect(4, 13.5, 0.7, 1);
    // Idris derrière, Sâlim devant : leurs épaules, le haut de leur tête (rien d'autre ne se voit d'en haut)
    const corps = (x, L) => { c.fillStyle = L.cloak || L.robe || '#3a3a48'; c.beginPath(); c.ellipse(x, 14 + dy, 2.3, 3.8, 0, 0, 6.3); c.fill(); c.fillStyle = L.robe || '#3a3a48'; c.beginPath(); c.ellipse(x + 0.6, 14 + dy, 1.6, 3, 0, 0, 6.3); c.fill();
      c.fillStyle = L.head || '#2a2030'; c.beginPath(); c.arc(x + 0.4, 14 + dy, 1.9, 0, 6.3); c.fill(); c.fillStyle = 'rgba(255,255,255,.16)'; c.beginPath(); c.arc(x, 13.3 + dy, 0.8, 0, 6.3); c.fill(); };
    if (idris) corps(10.6, idris);
    if (salim) { c.fillStyle = salim.robe || '#5a2f3a'; c.fillRect(15.4, 11.3 + dy, 3.6, 0.9); c.fillRect(15.4, 15.8 + dy, 3.6, 0.9); corps(14.4, salim); }   // ses bras vers le guidon
  }
  /* 2.28 (D217) — Idris sur un manège (activites.js) : P = { sheet (sa planche de marche), k (sa nacelle, sa chaise ou sa tasse) }.
     De face, la tête et les épaules seulement (la nacelle et la tasse le cachent jusqu'à la taille ; sur sa chaise, jusqu'aux
     genoux) ; plus petit que sur la carte, à la mesure du manège. Personne d'autre ne monte. */
  function passager(c, P, gx, gy, col, genre) {
    const sh = P.sheet; if (!sh) return;
    if (genre === 'nacelle') {
      c.fillStyle = '#e8dcc8'; c.fillRect(gx - 0.25, gy, 0.5, 2.5);
      c.fillStyle = shade(col, 0.5); c.beginPath(); c.ellipse(gx, gy + 7.2, 6.4, 5.6, 0, 0, 6.3); c.fill();   // le fond de la nacelle
      c.drawImage(sh, 0, 1, 16, 13, gx - 6, gy + 1.2, 12, 9.75);
      c.fillStyle = col; c.beginPath(); c.moveTo(gx - 6.4, gy + 7.6); c.lineTo(gx + 6.4, gy + 7.6); c.quadraticCurveTo(gx + 5.6, gy + 13, gx, gy + 13); c.quadraticCurveTo(gx - 5.6, gy + 13, gx - 6.4, gy + 7.6); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(gx - 5.8, gy + 7.6, 11.6, 0.6); c.fillStyle = 'rgba(255,240,200,.95)'; c.fillRect(gx - 0.6, gy - 0.6, 1.2, 1.2);
    } else if (genre === 'chaise') {
      c.drawImage(sh, 0, 1, 16, 17, gx - 5.6, gy - 14.5, 11.2, 11.9);
      c.fillStyle = col; c.fillRect(gx - 3, gy - 3, 6, 1.4); c.fillRect(gx - 3, gy - 3, 1, 3.6); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(gx - 3, gy - 3, 6, 0.4);
    } else c.drawImage(sh, 0, 1, 16, 12, gx - 5.6, gy - 7.6, 11.2, 8.4);
  }
  G.passager = passager;
  const dcache = {};
  // une image vue de dessus, tournée : genre 'voiture' (o : { m, c }) ou 'moto' (o : { c, salim, idris, penche }) ; k : le cap, de 0 à 31
  G.dessus = function (genre, o, k) {
    const key = genre + JSON.stringify(o) + '|' + k + '|' + G.D + (G.lisse ? 'l' : ''); if (dcache[key]) return dcache[key];
    const base = dcache[genre + JSON.stringify(o)] || (dcache[genre + JSON.stringify(o)] = (() => { const cv = G.toile(28, 28), c = cv.getContext('2d'), T = G.TEINTES[(o.c | 0) % G.TEINTES.length];
      if (genre === 'moto') motoDessus(c, T, o.salim, o.idris, o.penche); else voitureDessus(c, T, o.m); return cv; })());
    const cv = G.toile(28, 28), c = cv.getContext('2d'); c.imageSmoothingEnabled = true; c.translate(14, 14); c.rotate(k * Math.PI / 16); c.drawImage(base, -14, -14); net(cv);
    return (dcache[key] = cv);
  };
  G.surDefinition.push(() => { Object.keys(dcache).forEach(k => { delete dcache[k]; }); });

  Object.assign(OBJ, {
    // une voiture (garée sur la carte, ou qui roule : trafic.js) ; o.m : le modèle, o.c : la teinte, o.d : 'd', 'g', 'b', 'h'
    qvoiture: { w: 44, h: 30, fw: 32, fh: 8, draw(c, r, o) { o = o || {}; const M = G.MODELES[o.m] || G.MODELES.berline, T = G.TEINTES[(o.c | 0) % G.TEINTES.length];
      if (o.d === 'b' || o.d === 'h') face(c, M, T, o.d === 'h');
      else { if (o.d === 'g') { c.save(); c.translate(44, 0); c.scale(-1, 1); profil(c, M, T); c.restore(); } else profil(c, M, T); }
      net(c.canvas); } },
    // 2.27 (D216) — la moto de Sâlim : une moto inventée par le jeu, sans marque, sans logo, sans plaque ; o.c : la teinte, o.d :
    // 'd', 'g', 'b', 'h' (comme une voiture). Le point d'appui est le milieu du sol, à (22, 28).
    qmoto: { w: 44, h: 30, fw: 30, fh: 6, draw(c, r, o) { o = o || {}; const T = G.TEINTES[(o.c | 0) % G.TEINTES.length];
      if (o.d === 'b' || o.d === 'h') motoFace(c, T, o.d === 'h');
      else { if (o.d === 'g') { c.save(); c.translate(44, 0); c.scale(-1, 1); motoProfil(c, T); c.restore(); } else motoProfil(c, T); }
      net(c.canvas); } },
    // une borne d'arcade : un caisson sombre, un bandeau qui luit sans un mot, un écran aux formes abstraites, deux boutons
    qborne: { w: 16, h: 32, fw: 6, fh: 3, draw(c, r, o) { const col = (o && o.color) || '#ff4fd8', alt = (o && o.alt) || '#39e6ff';
      Rc(c, '#16121f', 2, 1, 12, 30); Rc(c, '#2a2338', 2.5, 1.5, 11, 29); Rc(c, 'rgba(255,255,255,.12)', 2.5, 1.5, 0.5, 29);
      const m = c.createLinearGradient(2, 0, 14, 0); m.addColorStop(0, col); m.addColorStop(1, alt); Rc(c, m, 3, 2, 10, 3.5); Rc(c, 'rgba(255,255,255,.4)', 3, 2, 10, 0.5);
      Rc(c, '#07060c', 3, 6.5, 10, 8.5); const e = c.createLinearGradient(0, 7, 0, 15); e.addColorStop(0, '#1a2a5a'); e.addColorStop(1, '#3a1a4a'); Rc(c, e, 3.5, 7, 9, 7.5);
      for (let i = 0; i < 5; i++) Rc(c, [col, alt, '#ffe08a', '#7dffb0', '#ffffff'][Math.floor(r() * 5)], 4 + Math.floor(r() * 14) / 2, 7.5 + Math.floor(r() * 12) / 2, 1 + Math.floor(r() * 4) / 2, 1);
      Rc(c, '#4a4058', 2, 15.5, 12, 3); Rc(c, '#6a5e7c', 2, 15.5, 12, 0.5); Rc(c, '#ff3a5a', 9, 16.5, 1.5, 1); Rc(c, '#ffd84a', 11, 16.5, 1.5, 1); Rc(c, '#1a1620', 5, 16, 0.75, 1.8); Rc(c, '#c8c8d8', 4.75, 15.6, 1.25, 0.8);
      for (let k = 0; k < 3; k++) Rc(c, k % 2 ? alt : col, 3, 20 + k * 3.4, 10, 1.2);
      Rc(c, '#0e0c14', 6, 27, 4, 2); Rc(c, '#0a0810', 2, 30.5, 12, 1.5); } },
    // le grand écran de la place : un cadre sombre filé de laiton ; dedans, des formes qui coulent — aucun mot, aucun signe,
    // aucune marque, aucun visage
    qecran: { w: 184, h: 70, fw: 0, fh: 0, anim: true, draw(c) { Rc(c, '#120c1c', 2, 2, 180, 56); Rc(c, '#a8874e', 2, 2, 180, 0.75); Rc(c, '#a8874e', 2, 57.25, 180, 0.75); Rc(c, '#0a0712', 5, 5, 174, 50);
      Rc(c, '#241c2c', 40, 58, 6, 12); Rc(c, '#241c2c', 138, 58, 6, 12); Rc(c, '#8a7050', 40, 58, 6, 0.75); Rc(c, '#8a7050', 138, 58, 6, 0.75); },
      animer(c, x, y, t) { const x0 = x - 87, y0 = y - 65, w = 174, h = 50;
        c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip();
        const g = c.createLinearGradient(x0, y0, x0 + w, y0 + h), p = (Math.sin(t * 0.21) + 1) / 2; g.addColorStop(0, '#3a1a7a'); g.addColorStop(0.5 + p * 0.2 - 0.1, '#c0307e'); g.addColorStop(1, '#ff9a4a'); c.fillStyle = g; c.fillRect(x0, y0, w, h);
        // des nappes de couleur qui coulent, l'une dans l'autre
        [['255,230,170', 0.5, 0.31, 1.9, 34], ['110,230,255', 0.42, 0.23, 2.7, 30], ['255,120,200', 0.4, 0.17, 4.1, 38], ['180,255,200', 0.3, 0.27, 5.3, 24]].forEach(([rgb, a, v, ph, R0]) => {
          const bx = x0 + w * (0.5 + 0.42 * Math.sin(t * v + ph)), by = y0 + h * (0.5 + 0.38 * Math.sin(t * v * 1.37 + ph * 2)), rr = R0 + 8 * Math.sin(t * 0.5 + ph);
          const q = c.createRadialGradient(bx, by, 1, bx, by, rr); q.addColorStop(0, `rgba(${rgb},${a})`); q.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = q; c.fillRect(x0, y0, w, h); });
        c.fillStyle = 'rgba(255,255,255,.18)'; for (let k = 0; k < 3; k++) { c.beginPath(); for (let i = 0; i <= 58; i++) { const X = x0 + i * 3, Y = y0 + h * (0.3 + k * 0.2) + Math.sin(i * 0.22 + t * (0.8 + k * 0.3) + k) * 5; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); } c.lineTo(x0 + w, y0 + h * (0.3 + k * 0.2) + 1.2); c.lineTo(x0, y0 + h * (0.3 + k * 0.2) + 1.2); c.closePath(); c.fill(); }
        c.fillStyle = 'rgba(0,0,0,.12)'; for (let yy = y0; yy < y0 + h; yy += 2) c.fillRect(x0, yy, w, 0.5);
        c.restore(); } },
    // la grande roue : deux pieds en A, un moyeu ; la roue tourne lentement, ses nacelles pendent, vides
    qroue: { w: 108, h: 124, fw: 48, fh: 6, anim: true, draw(c) { const hx = 54, hy = 58;
      c.strokeStyle = '#d8c8b0'; c.lineWidth = 2; c.beginPath(); c.moveTo(hx - 26, 122); c.lineTo(hx, hy); c.lineTo(hx + 26, 122); c.stroke();
      c.strokeStyle = '#8a7a68'; c.lineWidth = 1; c.beginPath(); c.moveTo(hx - 17, 100); c.lineTo(hx + 17, 100); c.stroke();
      Rc(c, '#5a4a52', hx - 30, 119, 60, 4); Rc(c, '#8a7a80', hx - 30, 119, 60, 0.75); Rc(c, '#3a2e36', hx - 6, 112, 12, 8); Rc(c, '#ffd27a', hx - 3, 114, 6, 4); },
      // (2.28, D217 : o.angle, pendant un tour ; o.decal, après, pour que la roue reprenne sans à-coup ; o.passager : Idris
      // dans sa nacelle — activites.js)
      animer(c, x, y, t, o) { const hx = x, hy = y - 66, R0 = 44, n = 12, a0 = o && o.angle !== undefined ? o.angle : t * 0.12 + ((o && o.decal) || 0), P = o && o.passager;
        c.strokeStyle = 'rgba(240,220,200,.8)'; c.lineWidth = 1; c.beginPath(); c.arc(hx, hy, R0, 0, 6.3); c.stroke(); c.strokeStyle = 'rgba(240,220,200,.45)'; c.beginPath(); c.arc(hx, hy, R0 - 5, 0, 6.3); c.stroke();
        c.strokeStyle = 'rgba(230,210,190,.5)'; c.lineWidth = 0.5; c.beginPath(); for (let k = 0; k < n; k++) { const a = a0 + k * 6.2832 / n; c.moveTo(hx, hy); c.lineTo(hx + Math.cos(a) * R0, hy + Math.sin(a) * R0); } c.stroke();
        for (let k = 0; k < n; k++) { const a = a0 + k * 6.2832 / n, gx = hx + Math.cos(a) * R0, gy = hy + Math.sin(a) * R0, col = ['#ff6a8a', '#39c6ff', '#ffd84a', '#7dffb0'][k % 4];
          if (P && P.k === k) { passager(c, P, gx, gy, col, 'nacelle'); continue; }
          c.fillStyle = '#e8dcc8'; c.fillRect(gx - 0.25, gy, 0.5, 2.5); c.fillStyle = col; c.beginPath(); c.ellipse(gx, gy + 5.5, 3.6, 3.2, 0, 0, 6.3); c.fill();
          c.fillStyle = 'rgba(20,24,44,.75)'; c.fillRect(gx - 2.4, gy + 3.8, 4.8, 2.2); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(gx - 2.4, gy + 3.8, 1.2, 0.5);
          c.fillStyle = (Math.floor(t * 2) + k) % 3 ? 'rgba(255,240,200,.9)' : 'rgba(255,240,200,.35)'; c.fillRect(gx - 0.6, gy - 0.6, 1.2, 1.2); }
        c.fillStyle = '#e8dcc8'; c.beginPath(); c.arc(hx, hy, 3, 0, 6.3); c.fill(); c.fillStyle = '#8a7a68'; c.beginPath(); c.arc(hx, hy, 1.4, 0, 6.3); c.fill(); } },
    // les chaises volantes : un mât, une couronne qui tourne, des chaises vides au bout de leurs chaînes
    qmanege: { w: 70, h: 66, fw: 40, fh: 6, anim: true, draw(c) { c.fillStyle = '#5a4a5a'; c.beginPath(); c.ellipse(35, 61, 30, 5, 0, 0, 6.3); c.fill(); c.fillStyle = '#8a7a86'; c.beginPath(); c.ellipse(35, 60, 28, 4.2, 0, 0, 6.3); c.fill();
      c.fillStyle = '#c8a868'; c.beginPath(); c.ellipse(35, 59.5, 6, 1.6, 0, 0, 6.3); c.fill(); },
      animer(c, x, y, t, o) { const top = y - 56, a0 = o && o.angle !== undefined ? o.angle : t * 0.9 + ((o && o.decal) || 0), n = 10, P = o && o.passager, R0 = 25 + (P ? (P.envol || 0) * 6 : 0), chaise = (a, devant, k) => { const sx = Math.cos(a), sy = Math.sin(a); if ((sy > 0) !== devant) return;
          const ax = x + sx * 13, ay = top + 4 + sy * 3, cx2 = x + sx * R0, cy2 = top + 26 + sy * 7.5;
          c.strokeStyle = 'rgba(220,210,200,.7)'; c.lineWidth = 0.5; c.beginPath(); c.moveTo(ax, ay); c.lineTo(cx2, cy2 - 3); c.stroke();
          const col = ['#ff6a8a', '#39c6ff', '#ffd84a', '#7dffb0', '#c49bff'][Math.floor(((a % 6.2832) + 6.2832) % 6.2832 / 6.2832 * n) % 5];
          if (P && P.k === k) { passager(c, P, cx2, cy2, col, 'chaise', sx); return; }   // (2.28 : Idris sur sa chaise — activites.js)
          c.fillStyle = col; c.fillRect(cx2 - 2, cy2 - 3, 4, 1.4); c.fillRect(cx2 - 2, cy2 - 3, 1, 3.6); };
        for (let k = 0; k < n; k++) chaise(a0 + k * 6.2832 / n, false, k);
        c.fillStyle = '#d8c8b0'; c.fillRect(x - 1.5, top + 4, 3, 50); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x - 1.5, top + 4, 0.75, 50);
        for (let k = 0; k < 8; k++) { const a = a0 + k * 0.7854, s = Math.cos(a); c.fillStyle = k % 2 ? '#e84a6a' : '#f4e8d8'; c.beginPath(); c.moveTo(x, top - 6); c.lineTo(x + Math.cos(a) * 16, top + 4 + Math.sin(a) * 3.5); c.lineTo(x + Math.cos(a + 0.7854) * 16, top + 4 + Math.sin(a + 0.7854) * 3.5); c.closePath(); if (s > -2) c.fill(); }
        c.fillStyle = '#ffd27a'; c.beginPath(); c.arc(x, top - 6, 1.6, 0, 6.3); c.fill();
        for (let k = 0; k < n; k++) chaise(a0 + k * 6.2832 / n, true, k); } },
    // les tasses : un plateau qui tourne, quatre tasses vides qui tournent sur elles-mêmes
    qtasses: { w: 60, h: 30, fw: 40, fh: 6, anim: true, draw(c) { c.fillStyle = '#4a3e4e'; c.beginPath(); c.ellipse(30, 24, 28, 5.5, 0, 0, 6.3); c.fill(); c.fillStyle = '#7a6a80'; c.beginPath(); c.ellipse(30, 23, 26, 4.6, 0, 0, 6.3); c.fill(); },
      animer(c, x, y, t, o) { const a0 = o && o.angle !== undefined ? o.angle : t * 0.6 + ((o && o.decal) || 0), P = o && o.passager, L = [0, 1, 2, 3].map(k => { const a = a0 + k * 1.5708; return { a, sx: x + Math.cos(a) * 15, sy: y - 7 + Math.sin(a) * 3.2, k }; }).sort((p, q) => p.sy - q.sy);
        L.forEach(q => { const col = ['#ff6a8a', '#39c6ff', '#ffd84a', '#7dffb0'][q.k], w = 6 + Math.abs(Math.sin((P && P.tasse !== undefined ? P.tasse : t * 2.2) + q.k)) * 1.2;
          if (P && P.k === q.k) { c.fillStyle = shade(col, 0.45); c.beginPath(); c.ellipse(q.sx, q.sy - 5, w, 1.6, 0, 0, 6.3); c.fill(); passager(c, P, q.sx, q.sy - 5, col, 'tasse'); }   // (2.28 : Idris assis dans sa tasse — activites.js)
          c.fillStyle = shade(col, 0.6); c.beginPath(); c.ellipse(q.sx, q.sy, w, 2, 0, 0, 6.3); c.fill(); c.fillStyle = col; c.beginPath(); c.moveTo(q.sx - w, q.sy - 5); c.lineTo(q.sx + w, q.sy - 5); c.lineTo(q.sx + w * 0.75, q.sy); c.lineTo(q.sx - w * 0.75, q.sy); c.closePath(); c.fill();
          if (P && P.k === q.k) { c.fillStyle = shade(col, 0.45); c.beginPath(); c.ellipse(q.sx, q.sy - 5, w, 1.6, 0, 0, 3.1416); c.fill(); }   // (occupée : seule la moitié de devant du rebord passe sur lui)
          else { c.fillStyle = shade(col, 0.45); c.beginPath(); c.ellipse(q.sx, q.sy - 5, w, 1.6, 0, 0, 6.3); c.fill(); }
          c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(q.sx - w + 1, q.sy - 4, 1, 3); }); } },
    // un banc de rue : deux pieds de métal, des lattes de bois
    qbanc: { w: 24, h: 13, fw: 16, fh: 4, draw(c) { Rc(c, '#2e2a34', 3, 7, 1.5, 5); Rc(c, '#2e2a34', 19.5, 7, 1.5, 5); Rc(c, '#8a6040', 1, 1, 22, 2); Rc(c, '#a87a52', 1, 1, 22, 0.5); Rc(c, '#7a5236', 1, 5, 22, 2.5); Rc(c, '#9a6a46', 1, 5, 22, 0.5); Rc(c, '#3a3440', 2, 3, 1, 2); Rc(c, '#3a3440', 21, 3, 1, 2); } },
    // un lampadaire : un fût mince, un bras courbe, une tête qui éclaire vers le sol
    qlampe: { w: 14, h: 46, fw: 4, fh: 3, draw(c) { Rc(c, '#2a2632', 6, 6, 1.5, 38); Rc(c, '#6a6278', 6, 6, 0.5, 38); Rc(c, '#3a3444', 4.5, 43, 4.5, 3);
      c.strokeStyle = '#2a2632'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(6.75, 7); c.quadraticCurveTo(7, 2, 11, 2.5); c.stroke(); Rc(c, '#2a2632', 9, 2, 5, 2); Rc(c, '#fff0c8', 9.5, 3.6, 4, 1); } },
    // un arbre du parc : un tronc, une couronne ronde, sombre au crépuscule, prise de lumière en haut à gauche
    qarbre: { w: 30, h: 46, fw: 8, fh: 4, draw(c, r) { Rc(c, '#4a3426', 14, 26, 3, 18); Rc(c, '#6a4c36', 14, 26, 0.75, 18);
      [[15, 19, 12, '#2c4428'], [9, 22, 7, '#2a4026'], [21, 22, 7.5, '#2a4026'], [15, 13, 9, '#355230'], [11, 16, 6, '#3c5a34'], [19, 15, 6.5, '#3c5a34']].forEach(([x, y, rr, col]) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, rr, 0, 6.3); c.fill(); });
      c.fillStyle = 'rgba(255,200,150,.18)'; for (let i = 0; i < 14; i++) { const a = r() * 3.2 + 3.4, d = r() * 9; c.fillRect(13 + Math.cos(a) * d, 12 + Math.sin(a) * d, 1.5, 1); } } },
    // l'ascenseur du parvis, qui remonte des Archives basses : une cage de verre au cadre de laiton, une cabine éclairée
    qkiosque: { w: 44, h: 58, fw: 32, fh: 8, draw(c) { Rc(c, '#3a2e38', 3, 54, 38, 4); Rc(c, '#8a7056', 3, 54, 38, 0.75);
      const g = c.createLinearGradient(0, 8, 0, 54); g.addColorStop(0, 'rgba(120,150,200,.55)'); g.addColorStop(1, 'rgba(255,200,140,.6)'); Rc(c, g, 6, 8, 32, 46);
      Rc(c, 'rgba(255,224,170,.7)', 14, 22, 16, 32); Rc(c, '#9a7c4c', 21.75, 22, 0.5, 32); Rc(c, 'rgba(255,255,255,.25)', 8, 10, 2, 42); Rc(c, 'rgba(255,255,255,.15)', 32, 10, 1, 42);
      [6, 14, 30, 37.5].forEach(x => Rc(c, '#9a7c4c', x, 8, 0.75, 46)); Rc(c, '#9a7c4c', 6, 30, 32, 0.5);
      Rc(c, '#2a2030', 2, 3, 40, 6); Rc(c, '#b89a64', 2, 3, 40, 0.75); Rc(c, '#ffd890', 18, 6, 8, 1.5); } }
  });
  /* 2.29 (D220) — les villes de la carte du monde (maps.js, monde), dessinées par le jeu : une ville d'Arabie (des maisons de
     terre à toit plat dans un mur bas, des palmiers), une ville du Shâm (un mur de pierre crénelé, deux tours carrées, des toits
     de tuiles), un camp (des tentes). Aucune enseigne, aucune lettre, aucun signe, aucun édifice religieux — ni coupole, ni
     minaret, ni clocher : La Mecque est une ville comme les autres. Sans empreinte au sol : on marche dessus pour y entrer. */
  const petitPalmier = (c, x, y) => { R(c, '#7a5530', x, y, 1, 7); R(c, '#3f7631', x - 3, y - 1, 7, 1); R(c, '#4f8a3c', x - 2, y - 2, 5, 1); R(c, '#3f7631', x - 3, y, 1, 2); R(c, '#3f7631', x + 3, y, 1, 2); R(c, '#2f5c26', x - 1, y - 3, 3, 1); };
  const maisonTerre = (c, x, y, w, toit, face) => { R(c, '#e3c493', x, y, w, toit); R(c, '#f0d6a8', x, y, w, 1); R(c, '#b0875a', x, y + toit, w, face); R(c, '#97714a', x, y + toit, w, 1); R(c, '#4a3220', x + Math.floor(w / 2) - 1, y + toit + face - 3, 2, 3); if (w >= 7) R(c, '#5d4630', x + 1, y + toit + 1, 1, 1); };
  Object.assign(OBJ, {
    ville_arabe: { w: 40, h: 30, fw: 0, fh: 0, draw(c) {
      c.fillStyle = 'rgba(30,20,40,.28)'; c.beginPath(); c.ellipse(20, 27, 18, 3.5, 0, 0, 6.3); c.fill();
      petitPalmier(c, 4, 14); petitPalmier(c, 36, 12);
      R(c, '#d9b37f', 6, 8, 28, 2); R(c, '#c49a65', 6, 8, 2, 17); R(c, '#c49a65', 32, 8, 2, 17);
      maisonTerre(c, 9, 7, 8, 5, 4); maisonTerre(c, 18, 5, 7, 6, 5); maisonTerre(c, 26, 9, 6, 4, 4); maisonTerre(c, 10, 14, 9, 3, 4); maisonTerre(c, 22, 15, 8, 3, 4);
      R(c, '#b98f5c', 6, 22, 28, 5); R(c, '#dcb886', 6, 21, 28, 1); R(c, '#9e774b', 6, 26, 28, 1); R(c, '#4a3220', 18, 23, 4, 4); petitPalmier(c, 3, 21); } },
    ville_sham: { w: 40, h: 32, fw: 0, fh: 0, draw(c) {
      c.fillStyle = 'rgba(30,20,40,.28)'; c.beginPath(); c.ellipse(20, 29, 18, 3.5, 0, 0, 6.3); c.fill();
      R(c, '#e2d6bb', 10, 10, 20, 2); R(c, '#b85a3e', 12, 11, 7, 5); R(c, '#8e3b26', 12, 13, 7, 1); R(c, '#a4472f', 21, 8, 7, 8); R(c, '#8e3b26', 21, 11, 7, 1); R(c, '#e6dcc4', 21, 8, 7, 1);
      const tour = x => { R(c, '#cbbd9f', x, 6, 8, 22); R(c, '#e2d6bb', x, 6, 8, 2); [0, 3, 6].forEach(d => R(c, '#cbbd9f', x + d, 4, 2, 2)); R(c, '#a89a7c', x + 7, 8, 1, 20); R(c, '#2a2026', x + 3, 11, 2, 4); R(c, '#2a2026', x + 3, 19, 2, 3); };
      tour(2); tour(30);
      R(c, '#c4b597', 10, 18, 20, 10); R(c, '#d8cbb0', 10, 17, 20, 1); for (let x = 10; x < 30; x += 3) R(c, '#d8cbb0', x, 15, 2, 2); R(c, '#a89a7c', 10, 27, 20, 1);
      R(c, '#2a2026', 18, 22, 4, 6); R(c, '#2a2026', 19, 21, 2, 1); } },
    ville_camp: { w: 40, h: 26, fw: 0, fh: 0, draw(c) {
      c.fillStyle = 'rgba(30,20,40,.25)'; c.beginPath(); c.ellipse(20, 23, 18, 3, 0, 0, 6.3); c.fill();
      const tente = (x, b, w, h, col) => { const dk = shade(col, 0.72); c.fillStyle = col; c.beginPath(); c.moveTo(x, b); c.lineTo(x + w / 2, b - h); c.lineTo(x + w, b); c.fill(); c.fillStyle = dk; c.beginPath(); c.moveTo(x + w / 2, b - h); c.lineTo(x + w, b); c.lineTo(x + w * 0.62, b); c.fill(); c.fillStyle = '#2a1c14'; c.beginPath(); c.moveTo(x + w * 0.4, b); c.lineTo(x + w / 2, b - h * 0.45); c.lineTo(x + w * 0.6, b); c.fill(); R(c, '#6b4a2e', x + w / 2 - 0.5, b - h - 2, 1, 3); };
      tente(14, 14, 16, 12, '#e6dcc4'); tente(2, 22, 16, 13, '#d8c8a8'); tente(22, 23, 16, 14, '#cdb892'); } }
  });
  G.OBJ = OBJ;
  const ocache = {}, ecache = {};
  G.obj = function (type, opt, seed) {
    const key = type + JSON.stringify(opt || {}) + (seed || 0);
    if (ocache[key]) return ocache[key];
    const d = OBJ[type]; const cv = G.toile(d.w, d.h); d.draw(cv.getContext('2d'), I.rng(I.hash(key)), opt);
    if (cv.hd === 2) { arrondir(cv); if (!d.flat && !d.hue) encrer(cv, 0.42); } // en dessin fin : escaliers arrondis, bord à l'encre (pas sur ce qui est posé à plat ni sur la lumière)
    return (ocache[key] = cv);
  };

  /* ================= PERSONNAGES ================= */
  // Dessinés dans sprites.js (G.charSheet, G.charPose, G.charGrand) : silhouettes au pixel, sans visage.
  G.DIRS = { down: 0, left: 1, right: 2, up: 3 };

  /* ================= ÉGRÉGORES ================= */
  G.enemy = function (art, hue, scale, seed) {
    const key = art + '|' + hue + '|' + scale + '|' + (seed || 0); if (ecache[key]) return ecache[key];
    const S0 = scale >= 3 ? 112 : scale === 2 ? 80 : 52, S = S0 * G.D; // tracé au trait : à définition double, ses bords et son liseré sont deux fois plus fins
    const cv = mk(S, S), c = cv.getContext('2d'), r = I.rng(I.hash(key)); cv.hd = G.D;
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
      case 'colossus': poly([[24, 96], [28, 44], [16, 40], [22, 22], [40, 18], [60, 18], [78, 22], [84, 40], [72, 44], [76, 96]], c1); poly([[34, 96], [36, 26], [50, 22], [50, 96]], c2); ell(50, 12, 9, 11, c2); ell(48, 11, 6, 8, c3); poly([[14, 40], [26, 42], [20, 80], [10, 78]], c1); poly([[86, 40], [74, 42], [80, 80], [90, 78]], c0); poly([[47, 48], [53, 48], [52, 84], [50, 96], [48, 84]], c3); poly([[44, 44], [56, 46], [55, 49], [45, 47]], c4); c.fillStyle = c2; c.fillRect(48.5, 37, 3, 8); ell(50, 35, 3, 3, c4); c.fillStyle = c4; c.fillRect(30, 30, 3, 3); c.fillRect(66, 30, 3, 3); break;
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
    G.pcv = G.toile(G.PW, G.PH); G.px = G.pcv.getContext('2d');
    G.bcv = mk(G.PW / 4, G.PH / 4); G.bx = G.bcv.getContext('2d');
    G.lcv = mk(G.PW / 2, G.PH / 2); G.lx = G.lcv.getContext('2d');
    G.resize();
  };
  // fenêtre visible, en pixels logiques : sur un écran en hauteur, on ne montre qu'une partie de la largeur, agrandie ;
  // quand le joueur agrandit l'image (2.x, ui.js : U.zf), une partie de la hauteur aussi (y, h)
  G.view = { x: 0, y: 0, w: G.PW, h: G.PH, t: 0, ty: 0 };
  G.resize = function () {
    const st = document.getElementById('stage') || G.cv.parentElement, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = st.clientHeight * G.PW / G.PH > st.clientWidth + 1 ? st.clientHeight * G.PW / G.PH : st.clientWidth, coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    G.k = Math.max(2, Math.min(G.low ? 2 : coarse ? 3 : 4, Math.ceil(w * dpr / G.PW)));
    // un dessin deux fois plus fin ne s'agrandit proprement que d'un nombre entier de fois ; sur un écran tactile, il est
    // montré tel quel (768 × 432 : moins de points à composer qu'avant, pour un dessin plus fin) et l'écran fait le reste
    if (G.D === 2) G.k = (G.low || coarse || G.k < 3) ? 2 : G.lisse ? G.k : 4;
    if (G.cv.width !== G.PW * G.k) { G.cv.width = G.PW * G.k; G.cv.height = G.PH * G.k; }
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
      // la brume de sable du soir : des grains dorés qui dérivent lentement, dans le bas de l'image seulement (au-dessus de la
      // rue, jamais dans le ciel, où un point clair passerait pour une étoile)
      else if (a.kind === 'brume') G.spawn({ x: -8 + Math.random() * (G.PW + 16), y: G.PH * (0.45 + Math.random() * 0.55), vx: 5 + Math.random() * 9, vy: -1.5 + Math.random() * 2, life: 5 + Math.random() * 3, size: 0.35 + Math.random() * 0.5, color: Math.random() < 0.7 ? '#ffd9a0' : '#ffc4a0', a: 0.38, type: 'mote' });
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
    // 2.16 — « 2D simple » tient ce que son texte promet : le pixel art seul, sans éclairage (ambiance et lueurs), sans halo,
    // sans étalonnage ni vignette, comme sans profondeur de champ ni ombres de nuages (l'étalonnage de fin de journée de
    // la lumière de la 2.18 comprise : o.etalon)
    if (G.low) { o.tilt = false; o.clouds = null; o.scan = false; o.rays = null; o.ambient = null; o.lights = null; o.bloom = 0; o.grade = null; o.etalon = false; o.vignette = 0; }
    const c = G.out, k = G.k, W = G.cv.width, H = G.cv.height;
    let sx = 0, sy = 0;
    if (G.shakeT > 0) { G.shakeT -= dt; sx = (Math.random() - 0.5) * 6 * k * Math.min(1, G.shakeT * 4); sy = (Math.random() - 0.5) * 6 * k * Math.min(1, G.shakeT * 4); }
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    c.imageSmoothingEnabled = !!G.lisse; if (G.lisse) c.imageSmoothingQuality = 'high';
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
      // 2.18 : l'ambiance est relevée vers le blanc (G.expo) ; une paire de couleurs fait un dégradé en biais, du coin haut
      // et gauche (la lumière basse d'un couchant) au coin bas et droit (le ciel qui passe au rose), sur ce que l'on voit
      // (l'image peut être agrandie : G.view)
      const l = G.lx, lw = G.lcv.width, lh = G.lcv.height, am = a => G.expo ? shade(a, 1 + G.expo) : a; l.globalCompositeOperation = 'source-over';
      if (Array.isArray(o.ambient)) { const V = G.view, g = l.createLinearGradient(V.x / 2, V.y / 2, (V.x + V.w) / 2, (V.y + V.h) / 2); g.addColorStop(0, am(o.ambient[0])); g.addColorStop(1, am(o.ambient[1])); l.fillStyle = g; } else l.fillStyle = am(o.ambient);
      l.fillRect(0, 0, lw, lh);
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
        c.globalAlpha = G.LUM.nuages; c.fillStyle = '#fff'; c.save(); c.translate(x, y); c.scale(1.7, 1); c.translate(-x, -y); c.fillStyle = g; c.fillRect(x - rr, y - rr, rr * 2, rr * 2); c.restore();
      }
      c.globalAlpha = 1;
    }
    // halo (bloom doux)
    if (o.bloom !== 0) { c.globalCompositeOperation = 'screen'; c.globalAlpha = (o.bloom === undefined ? 0.2 : o.bloom) * G.LUM.halo; c.drawImage(G.bcv, sx, sy, W, H); }
    // lueurs additives des sources
    c.globalCompositeOperation = 'lighter';
    (o.lights || []).forEach(L => {
      if (L.glow === false) return;
      const x = L.x * k + sx, y = L.y * k + sy, rr = L.r * k * 0.55; if (x < -rr || y < -rr || x > W + rr || y > H + rr) return;
      const g = c.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, L.color); g.addColorStop(1, 'rgba(0,0,0,0)');
      c.globalAlpha = (L.a === undefined ? 1 : L.a) * G.LUM.lueurs; c.fillStyle = g; c.fillRect(x - rr, y - rr, rr * 2, rr * 2);
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
    // 2.18 : l'étalonnage de fin de journée — les lumières tirent vers l'orangé, les ombres vers le turquoise au lieu du
    // noir, et la couleur gagne un cran de saturation (le gris reste gris). G.LUM.froid nul : la lumière de la 2.15.
    // Un lieu peut donner son propre étalonnage (o.etalon : [chaud, froid], l'un ou l'autre nul) : la nuit reste bleue.
    if (G.LUM.froid && o.etalon !== false) { const et = o.etalon || [G.LUM.chaud, G.LUM.froid];
      if (et[0]) { c.globalCompositeOperation = 'multiply'; c.fillStyle = et[0]; c.fillRect(0, 0, W, H); }
      if (et[1]) { c.globalCompositeOperation = 'screen'; c.fillStyle = et[1]; c.fillRect(0, 0, W, H); }
      c.globalCompositeOperation = 'source-over';
      // la saturation : l'image repeinte sur elle-même à travers un filtre (un navigateur sans filtre de toile l'ignore)
      if (G.LUM.sat && !G.low && 'filter' in c) { c.filter = `saturate(${1 + G.LUM.sat})`; c.drawImage(G.cv, 0, 0); c.filter = 'none'; }
    }
    // balayage cyber
    if (o.scan) { if (G.D === 1) { c.globalAlpha = 0.07; c.fillStyle = '#000'; for (let y = 0; y < H; y += k * 2) c.fillRect(0, y, W, k); c.globalAlpha = 1; } // les lignes de balayage : seulement dans le dessin d'origine
      if (Math.random() < 0.02) { const y = Math.random() * H, h = 4 * k; c.drawImage(G.cv, 0, y, W, h, (Math.random() - 0.5) * 20 * k, y, W, h); } }
    // vignette
    const vcx = (G.view.x + G.view.w / 2) * k, vcy = (G.view.y + G.view.h / 2) * k, vr = Math.hypot(G.view.w / 2, G.view.h / 2) / Math.hypot(G.PW / 2, G.PH / 2); // autour de ce que l'on voit
    const vg = c.createRadialGradient(vcx, vcy, H * G.LUM.vig0 * vr, vcx, vcy, H * 0.95 * vr); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(${G.LUM.vigC},${(o.vignette === undefined ? 0.55 : o.vignette) * G.LUM.vignette})`);
    if (o.vignette !== 0) { c.fillStyle = vg; c.fillRect(0, 0, W, H); }
    if (G.flashA > 0) { c.globalAlpha = G.flashA; c.fillStyle = G.flashC; c.fillRect(0, 0, W, H); c.globalAlpha = 1; G.flashA -= dt * 2.4; }
  };
})();
