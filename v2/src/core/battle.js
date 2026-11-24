/* ISNAD — combat : ordre des tours visible (CTB), voiles et faiblesses, Niyya (élan), Sakîna (ultime). */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, $ = I.$;
  const B = I.battle = { active: false };
  const TIER = { minion: { hp: 0.78, atk: 0.8, def: 0.8, spd: 0.95, xp: 1 }, elite: { hp: 2.4, atk: 1.0, def: 1.0, spd: 1.0, xp: 3.2 }, boss: { hp: 6.4, atk: 1.15, def: 1.05, spd: 1.04, xp: 7 } };
  const base = L => ({ hp: 70 + 26 * L, sp: 14 + 4 * L, atk: 9 + 3 * L, def: 7 + 2.2 * L, spd: 10 + 0.6 * L });

  I.calc = {
    hero(def, lvl) { const r = D.ROLES[def.role], b = base(lvl); return { hp: Math.round(b.hp * r.hp), sp: Math.round(b.sp * r.sp), atk: b.atk * r.atk, mag: b.atk * r.mag, def: b.def * r.def, spd: b.spd * r.spd }; },
    // le même, avec ce que le héros porte : l'équipement ajoute des pourcentages (gear.js)
    of(h, eq) { const st0 = I.calc.hero(h.def, h.lvl), st = h.id === 'idris' && I.rodeurs ? I.rodeurs.avecAbris(st0) : st0, m = I.gear ? I.gear.mods(h, eq) : null; if (!m) return st; const f = k => 1 + m[k] / 100; return { hp: Math.round(st.hp * f('hp')), sp: Math.round(st.sp * f('sp')), atk: st.atk * f('atk'), mag: st.mag * f('mag'), def: st.def * f('def'), spd: st.spd * f('spd') }; }, // 2.x : ce que les abris de la noosphère ont laissé au râwî
    enemy(def, nHeroes, nFoes) {
      const t0 = TIER[def.tier], early = def.tier === 'boss' && def.lvl <= 4, t = early ? Object.assign({}, t0, { hp: t0.hp * 0.75, atk: t0.atk * 0.9 }) : t0, b = base(def.lvl), ps = (nHeroes >= 3 ? 1 : nHeroes === 2 ? 0.64 : 0.42) * (def.tier === 'elite' && def.lvl <= 3 ? 0.85 : 1), crowd = nFoes >= 3 ? 0.85 : 1;
      return { hp: Math.round(b.hp * t.hp * ps * crowd), atk: b.atk * t.atk * (nHeroes === 1 ? 0.72 : nHeroes === 2 ? 0.84 : 1), mag: b.atk * t.atk * (nHeroes === 1 ? 0.72 : nHeroes === 2 ? 0.84 : 1), def: b.def * t.def, spd: b.spd * t.spd };
    },
    xpNeed: l => 40 + 40 * l,
    xpOf: def => Math.round((10 + 7 * def.lvl) * TIER[def.tier].xp)
  };

  const FER = { id: '_fer', name: I.T('Frapper'), target: 'foe', el: 'fer', pow: 1.0, anim: 'slash', basic: true };
  const lightOf = h => ({ id: '_lum', name: I.T('Éclairer'), target: 'foe', el: h.def.el, pow: 0.9, anim: 'light', basic: true });
  const ASSAUT = { name: I.T('Assaut'), target: 'foe', el: 'fer', pow: 1.0, anim: 'dark', w: 3 };
  const STN = { atk: I.T('Force'), mag: I.T('Esprit'), def: I.T('Garde'), spd: I.T('Élan§stat'), stun: I.T('Étourdi'), doute: I.T('Doute'), waswas: I.T('Waswâs'), regen: I.T('Régén.'), garde: I.T('En garde'), esquive: I.T('Esquive'), taunt: I.T('Cible'), recul: I.T('Retardé') };
  const BIEN = ['regen', 'garde', 'esquive', 'taunt'];   // les états qui servent celui qui les porte (sur sa rangée, en vert)

  let C = null; // contexte du combat en cours
  B.contexte = () => C;   // pour les outils (une attitude ou une mimique posée sur un combattant, pour une image)

  /* ================= décor ================= */
  // la lumière de fin de journée (2.18) ; au cran « sombre » de la luminosité, celle de la 2.15 (gfx.js, G.lum)
  let v15 = G.lum === 215;
  const SKY_215 = { desert: ['#150c30', '#5c2756', '#e08a4a'], ville: ['#0c0e2c', '#35285c', '#c8785a'], camp: ['#080a20', '#281e4c', '#9a4a48'], romaine: ['#0e1232', '#383876', '#d8a070'], palais: ['#120a26', '#48205c', '#c89040'], mer: ['#051028', '#123c66', '#5fb4cc'], cite: ['#04030d', '#180e3c', '#7a2cff'], noos: ['#02021a', '#0a0d36', '#30209a'] };
    // un ciel de fin de journée : bleu-violet en haut, rose au milieu, or ou orangé à l'horizon ; 2084 au crépuscule néon
  const SKY_217 = { desert: ['#3a2e6e', '#c0607a', '#ffc070'], ville: ['#32306e', '#b45c80', '#ffb46c'], camp: ['#2a2a62', '#9a5078', '#f09a64'], romaine: ['#34407e', '#a2709a', '#ffc890'], palais: ['#36265e', '#a2507a', '#ffbe62'], mer: ['#25427e', '#5a8cc0', '#ffc890'], cite: ['#2c1252', '#b02c84', '#ff8a4a'], noos: ['#0a0c3a', '#1c2370', '#5444c8'] };
  // le sol : tiré du lieu (le sable, la pierre, l'eau, l'asphalte mouillé), sombre au pied du ciel et plus sombre au premier plan
  const SOL = { desert: ['#8e5e3a', '#36202e'], ville: ['#845636', '#33202e'], camp: ['#6c4632', '#2a1a2c'], romaine: ['#605450', '#262236'], palais: ['#643a2c', '#2a1830'], mer: ['#1e5474', '#0c2238'], cite: ['#4a1e56', '#160c28'], noos: ['#161a52', '#080a24'] };
  // La Cité-Miroir (prototype « ville de verre ») : sous une voûte qui luit comme un écran (ni astre ni étoile), une brume
  // de sable dorée ; des tours de verre, le viaduc d'un métro, puis le vieux quartier, ses tours à vent et ses claustras,
  // au bord d'une crique où les tours se renversent et où dorment des barques ; devant, la pierre couleur de sable.
  // Deux couches : l'arrière (ciel, tours, viaduc), où passent les rames à chaque image, et l'avant, qui les cache.
  const VIA_COMBAT = 64, EAU_COMBAT = 84;
  function citeBg(cv, c, r, hue, H0) {
    const W = G.PW, PH = G.PH, VIA = VIA_COMBAT, EAU = EAU_COMBAT, arr = G.toile(W, PH), av = G.toile(W, PH);
    const a = arr.getContext('2d'), v = av.getContext('2d');
    const rect = (q, col, x, y, w, h) => { q.fillStyle = col; q.fillRect(x, y, w, h); };
    const grad = (q, y0, y1, stops) => { const g = q.createLinearGradient(0, y0, 0, y1); stops.forEach(s => g.addColorStop(s[0], s[1])); return g; };
    /* --- l'arrière --- */
    a.fillStyle = grad(a, 0, EAU, [[0, '#2c1252'], [0.4, '#8e2c7c'], [0.8, '#ff7a4a'], [1, '#ffc27a']]); a.fillRect(0, 0, W, EAU);
    // la voûte : des méridiens qui montent vers un point au-dessus de l'image, des parallèles de plus en plus serrées
    const vx = W / 2, vy = -240, mx = (bx, y) => vx + (bx - vx) * (y - vy) / (EAU - vy), PAR = [4, 11, 19, 28, 39, 52, 68];
    for (let i = 0; i < 26; i++) { const j = Math.floor(r() * 6), k = Math.floor(r() * 24) - 12, b0 = vx + k * 30, b1 = b0 + 30;
      a.fillStyle = `rgba(255,190,226,${(0.04 + r() * 0.07).toFixed(3)})`; a.beginPath(); a.moveTo(mx(b0, PAR[j]), PAR[j]); a.lineTo(mx(b1, PAR[j]), PAR[j]); a.lineTo(mx(b1, PAR[j + 1]), PAR[j + 1]); a.lineTo(mx(b0, PAR[j + 1]), PAR[j + 1]); a.fill(); }
    a.strokeStyle = 'rgba(255,226,240,.12)'; a.lineWidth = 0.5; a.beginPath(); for (let k = -14; k <= 14; k++) { a.moveTo(mx(vx + k * 30, 0), 0); a.lineTo(mx(vx + k * 30, EAU), EAU); } a.stroke();
    PAR.forEach((y, i) => rect(a, `rgba(255,226,240,${(0.16 - i * 0.015).toFixed(3)})`, 0, y, W, 0.5));
    // l'écran luit plus fort vers l'horizon : une lumière sans disque
    const lg = a.createRadialGradient(W / 2, EAU, 4, W / 2, EAU, 190); lg.addColorStop(0, 'rgba(255,214,150,.45)'); lg.addColorStop(1, 'rgba(255,214,150,0)'); a.fillStyle = lg; a.fillRect(0, 0, W, EAU);
    // au loin, d'autres tours dans la brume de sable (sans un point de lumière)
    for (let x = -4; x < W;) { const w = 7 + r() * 10, top = 22 + r() * 36; rect(a, 'rgba(176,88,124,.55)', x, top, w, EAU - top); rect(a, 'rgba(255,206,170,.2)', x + w - 0.5, top, 0.5, EAU - top); x += w + 2 + r() * 7; }
    a.fillStyle = grad(a, 30, EAU, [[0, 'rgba(255,186,120,0)'], [1, 'rgba(255,190,124,.55)']]); a.fillRect(0, 30, W, EAU - 30);
    // les tours de verre (aucune n'est la copie d'un édifice ; les plus hautes sont de simples murs-rideaux)
    [[2, 44, -20, 'rideau'], [54, 26, 12, 'gradins'], [88, 32, -8, 'torsade'], [130, 18, 28, 'lame'], [156, 30, 4, 'rideau'], [196, 24, 20, 'couronne'], [228, 50, -24, 'rideau'], [288, 24, 14, 'gradins'], [322, 34, -2, 'torsade'], [362, 22, 26, 'lame']]
      .forEach(t => I.maps.tourDeVerre(a, r, t[0], t[1], t[2], EAU, t[3]));
    a.fillStyle = grad(a, 44, EAU, [[0, 'rgba(255,196,130,0)'], [1, 'rgba(255,200,136,.42)']]); a.fillRect(0, 44, W, EAU - 44);
    // le viaduc du métro (ses rames passent à chaque image, entre lui et le vieux quartier)
    I.maps.viaduc(a, 0, W, VIA, EAU, 56);
    /* --- l'avant : le vieux quartier, ses tours à vent trapues, ses claustras éclairés --- */
    const tons = ['#8e7a66', '#887360', '#94806b', '#836e5b']; // à contre-jour : le couchant est derrière les tours
    // une tour à vent trapue, dessinée à la taille du combat (point par point, sans réduction) : sa tête dépasse du toit de
    // la moitié de la hauteur de la maison au plus ; trois fentes, un toit plat (sa base se cache derrière la façade)
    const tourAVent = (x, top, hm) => { const h = Math.min(10, Math.floor(hm / 2)), t = top - h;
      rect(v, '#94806a', x, t + 1, 12, h + 2); rect(v, '#6e5c4a', x + 12, t + 2, 2, h + 1); rect(v, '#b29c80', x - 1, t, 15, 1.5); rect(v, '#86725c', x - 1, t + 1.5, 15, 0.5);
      for (let i = 0; i < 3; i++) rect(v, '#3a2622', x + 1.5 + i * 3.5, t + 2.5, 2, h - 2.5); rect(v, '#2e1e1c', x + 12.5, t + 3, 1, h - 3); };
    for (let x = -6; x < W;) { const w = 24 + Math.floor(r() * 30), top = EAU - 16 - Math.floor(r() * 8);
      if (w >= 28 && r() < 0.6) tourAVent(x + 3 + Math.floor(r() * Math.max(1, w - 18)), top, EAU - top);
      rect(v, tons[Math.floor(r() * 4)], x, top, w, EAU - top); rect(v, '#ae987c', x, top, w, 1.5); rect(v, 'rgba(90,56,48,.22)', x + w - 1.5, top, 1.5, EAU - top);
      for (let k = x + 3; k < x + w - 3; k += 5) rect(v, '#6a4a30', k, top + 3, 0.75, 0.75);
      for (let k = x + 5; k < x + w - 6; k += 11) { const lit = r() < 0.6; rect(v, '#8a7056', k - 0.5, top + 5.5, 5, 6); rect(v, lit ? '#ffc878' : '#3a2a26', k, top + 6, 4, 5); rect(v, lit ? '#7a4a28' : '#5a4434', k + 1.75, top + 6, 0.5, 5); }
      // une porte de bois, ou une échoppe sous son auvent rayé
      const m = x + Math.floor(w / 2); if (w >= 40 && r() < 0.4) { rect(v, '#5a3a2a', m - 8, EAU - 7, 16, 7); rect(v, '#ffc070', m - 7, EAU - 6, 14, 6); for (let k = 0; k < 4; k++) rect(v, k % 2 ? '#e8dcc0' : '#b8442e', m - 9 + k * 4.5, EAU - 10, 4.5, 3); }
      else if (w >= 30) { rect(v, '#6a4426', m - 2.5, EAU - 8, 5, 8); rect(v, '#4e301a', m - 0.25, EAU - 8, 0.5, 8); }
      x += w + (r() < 0.2 ? 6 : 0); }
    v.fillStyle = grad(v, EAU - 8, EAU, [[0, 'rgba(255,200,140,0)'], [1, 'rgba(255,206,150,.18)']]); v.fillRect(0, EAU - 8, W, 8);
    // la crique : les tours et les maisons s'y renversent, rompues par les rides ; le chemin de lumière ; des barques amarrées
    const tmp = G.toile(W, EAU), t = tmp.getContext('2d'); t.drawImage(arr, 0, 0, W, EAU, 0, 0, W, EAU); t.drawImage(av, 0, 0, W, EAU, 0, 0, W, EAU);
    v.fillStyle = grad(v, EAU, H0 - 2, [[0, '#3a3e6a'], [1, '#1a2444']]); v.fillRect(0, EAU, W, H0 - 2 - EAU);
    for (let j = 0; j < H0 - 2 - EAU; j += 0.5) { const ty = EAU - 0.5 - j / 0.55; if (ty < 0) break; v.globalAlpha = 0.55 * (1 - j / (H0 - EAU + 4)); v.drawImage(tmp, 0, ty, W, 0.5, Math.round(Math.sin(j * 1.9) * 1.6 * 2) / 2, EAU + j, W, 0.5); }
    v.globalAlpha = 1;
    v.fillStyle = 'rgba(255,230,180,.45)'; for (let y = EAU + 1; y < H0 - 2; y += 1.5) { const w2 = 4 + (y - EAU) * 1.4; v.fillRect(W / 2 - w2 / 2 + Math.sin(y * 2.3) * 2, y, w2, 0.5); }
    for (let i = 0; i < 40; i++) { v.fillStyle = ['rgba(255,200,110,.55)', 'rgba(255,120,190,.4)', 'rgba(120,232,255,.4)'][i % 3]; v.fillRect(Math.floor(r() * W), EAU + 1 + Math.floor(r() * (H0 - EAU - 4) * 2) / 2, 2 + Math.floor(r() * 5), 0.5); }
    const abra = G.obj('cabra', null, 3), abra2 = G.obj('cabra', { flip: 1 }, 5);
    [[36, 87, abra], [262, 88, abra2], [318, 86.5, abra]].forEach(([x, y, im]) => v.drawImage(im, x, y, 31, 15.6));
    rect(v, '#cdb08a', 0, H0 - 2, W, 2); rect(v, '#f0dcb4', 0, H0 - 2, W, 0.5);
    /* --- la pierre couleur de sable, ses joints immobiles en perspective, le ciel qu'elle renvoie à peine --- */
    v.fillStyle = grad(v, H0, PH, [[0, '#604c3c'], [0.4, '#3e302e'], [1, '#150e19']]); v.fillRect(0, H0, W, PH - H0);
    v.fillStyle = grad(v, H0, H0 + 30, [[0, 'rgba(255,200,150,.14)'], [1, 'rgba(255,200,150,0)']]); v.fillRect(0, H0, W, 30);
    for (let i = 0; i < 70; i++) { const y = H0 + 2 + Math.pow(r(), 1.6) * (PH - H0 - 2); rect(v, 'rgba(240,214,160,.1)', r() * W, y, 4 + (y - H0) * 0.2 * r(), 0.5); }
    v.fillStyle = 'rgba(90,60,40,.2)'; for (let i = 1; i < 10; i++) { const f = i / 10, y = H0 + (PH - H0) * f * f; v.fillRect(0, y, W, 0.5); }
    v.strokeStyle = 'rgba(90,60,40,.16)'; v.lineWidth = 0.5; v.beginPath(); for (let i = -10; i <= 10; i++) { v.moveTo(W / 2 + i * 12, H0); v.lineTo(W / 2 + i * 84, PH); } v.stroke();
    // deux dattiers éclairés par le pied, au bord du quai
    const pa = G.obj('cpalmier', null, 11); [[-6, 0], [W - 24, 2]].forEach(([x, d]) => v.drawImage(pa, x, H0 + 3 + d - 56));
    rect(v, 'rgba(255,226,170,.5)', 0, H0, W, 0.5);
    c.drawImage(arr, 0, 0, W, PH); c.drawImage(av, 0, 0, W, PH);
    cv.couches = { arr, av };
    return cv;
  }
  // les rames du métro, sur le viaduc du fond de combat de la Cité : l'une vers l'est, l'autre vers l'ouest, vides
  function rames(c, t) { const W = G.PW, e = 0.55, L = 110 * e, P = W + L * 2;
    G.rameMetro(c, P - L - ((t * 22 + P * 0.4) % P), VIA_COMBAT - 2, 110, -1, e); G.rameMetro(c, ((t * 22) % P) - L, VIA_COMBAT - 0.5, 110, 1, e); }
  function paintBg(kind, hue) {
    v15 = G.lum === 215;   // la luminosité du moment (Réglages)
    if (kind === 'cite') { const cv = G.toile(G.PW, G.PH); return citeBg(cv, cv.getContext('2d'), I.rng(I.hash(kind + hue)), hue, 100); }
    // la cité-grille d'avant : sous terre (les Archives) et dans la noosphère, la ville de verre n'a pas sa place ; et pas un
    // point dans son ciel, ni astre — en 2084, le ciel n'a de points qu'à la fin, quand la Cité s'éteint (le tirage reste
    // le même : ses tours ne bougent pas)
    const flux = kind === 'flux'; if (flux) kind = 'cite';
    const SKY = v15 ? SKY_215 : SKY_217;
    const cv = G.toile(G.PW, G.PH), c = cv.getContext('2d'), sky = SKY[kind] || SKY.noos, H0 = 100, r = I.rng(I.hash(kind + hue));
    const g = c.createLinearGradient(0, 0, 0, H0); g.addColorStop(0, sky[0]); g.addColorStop(0.6, sky[1]); g.addColorStop(1, sky[2]); c.fillStyle = g; c.fillRect(0, 0, G.PW, H0);
    const etoile = flux ? 0 : v15 || kind === 'noos' ? 1 : 0.35; // au couchant, les étoiles ne font que poindre
    for (let i = 0; i < 70; i++) { const a = (0.2 + r() * 0.7) * etoile, x = Math.floor(r() * G.PW), y = Math.floor(r() * 62); if (a > 0) { c.fillStyle = `rgba(255,255,255,${a})`; c.fillRect(x, y, 1, 1); } }
    // astre
    if (!flux) { const ax = kind === 'cite' ? 300 : 250, ay = kind === 'noos' ? 44 : 64; const ag = c.createRadialGradient(ax, ay, 2, ax, ay, 60); ag.addColorStop(0, 'rgba(255,240,200,.95)'); ag.addColorStop(0.18, `hsla(${hue},90%,75%,.5)`); ag.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = ag; c.fillRect(ax - 60, ay - 60, 120, 120);
      c.strokeStyle = `hsla(${hue},100%,75%,.35)`; c.lineWidth = 1; for (let i = 1; i < 4; i++) { c.beginPath(); c.ellipse(ax, ay, 18 * i, 6 * i, -0.3, 0, 6.3); c.stroke(); } }
    const sil = v15 ? '#0b0818' : '#21143a', sil2 = v15 ? '#16102c' : '#3a2452';
    c.fillStyle = sil2;
    if (kind === 'desert' || kind === 'camp') { c.beginPath(); c.moveTo(0, H0); for (let x = 0; x <= G.PW; x += 4) c.lineTo(x, H0 - 14 - Math.sin(x / 46) * 9 - Math.sin(x / 17) * 3); c.lineTo(G.PW, H0); c.fill(); }
    c.fillStyle = sil;
    if (kind === 'desert') { c.beginPath(); c.moveTo(0, H0); for (let x = 0; x <= G.PW; x += 4) c.lineTo(x, H0 - 6 - Math.sin(x / 30 + 2) * 6); c.lineTo(G.PW, H0); c.fill(); }
    else if (kind === 'camp') { for (let x = 10; x < G.PW; x += 34) { const h = 14 + r() * 10; c.beginPath(); c.moveTo(x, H0); c.lineTo(x + 14, H0 - h); c.lineTo(x + 28, H0); c.fill(); if (r() < 0.5) { c.fillRect(x + 30, H0 - 30, 1, 30); c.fillRect(x + 31, H0 - 30, 7, 5); } } }
    else if (kind === 'ville') { for (let x = 0; x < G.PW;) { const w = 18 + r() * 26, h = 10 + r() * 18; c.fillRect(x, H0 - h, w, h); if (r() < 0.4) { c.fillStyle = '#ffc878'; c.fillRect(x + 4, H0 - h + 4, 2, 3); c.fillStyle = sil; } if (r() < 0.35) { c.fillRect(x + w + 3, H0 - 34, 2, 34); for (let k = 0; k < 6; k++) c.fillRect(x + w - 6 + k * 3, H0 - 36 + Math.abs(k - 2.5) * 2, 4, 2); } x += w + 6; } }
    else if (kind === 'romaine') { c.fillRect(40, H0 - 46, 150, 4); c.beginPath(); c.moveTo(36, H0 - 46); c.lineTo(115, H0 - 66); c.lineTo(194, H0 - 46); c.fill(); for (let x = 46; x < 190; x += 18) c.fillRect(x, H0 - 42, 6, 42); for (let x = 220; x < G.PW; x += 30) { c.fillRect(x, H0 - 30, 22, 30); c.fillStyle = sky[2]; c.beginPath(); c.arc(x + 11, H0 - 8, 6, Math.PI, 0); c.fillRect(x + 5, H0 - 8, 12, 8); c.fill(); c.fillStyle = sil; } }
    else if (kind === 'palais') { c.fillRect(0, H0 - 70, G.PW, 70); c.fillStyle = sky[1]; c.beginPath(); c.moveTo(130, H0); c.quadraticCurveTo(192, H0 - 150, 254, H0); c.fill(); c.fillStyle = sky[2]; c.globalAlpha = 0.5; c.beginPath(); c.moveTo(150, H0); c.quadraticCurveTo(192, H0 - 110, 234, H0); c.fill(); c.globalAlpha = 1; c.fillStyle = sil; for (let x = 20; x < 120; x += 30) { c.fillStyle = sky[1]; c.fillRect(x, H0 - 40, 12, 40); c.fillRect(G.PW - x - 12, H0 - 40, 12, 40); } }
    else if (kind === 'mer') { for (let k = 0; k < 2; k++) { const x = 60 + k * 190; c.fillRect(x, H0 - 60, 2, 60); c.beginPath(); c.moveTo(x - 18, H0 - 54); c.lineTo(x + 20, H0 - 54); c.lineTo(x + 16, H0 - 22); c.lineTo(x - 14, H0 - 22); c.fill(); c.beginPath(); c.moveTo(x - 34, H0 - 10); c.lineTo(x + 36, H0 - 10); c.lineTo(x + 26, H0); c.lineTo(x - 24, H0); c.fill(); } }
    else if (kind === 'cite') { for (let x = 0; x < G.PW;) { const w = 14 + r() * 22, h = 30 + r() * 70; c.fillStyle = sil; c.fillRect(x, H0 - h, w, h); for (let k = 0; k < h / 5; k++) if (r() < 0.5) { c.fillStyle = ['#39e6ff', '#ff4fd8', '#ffe08a'][Math.floor(r() * 3)]; c.fillRect(x + 2 + Math.floor(r() * (w - 4)), H0 - h + 3 + k * 5, 2, 1); } x += w + 2; } }
    else { c.strokeStyle = `hsla(${hue},100%,70%,.5)`; for (let i = 0; i < 9; i++) { const x = r() * G.PW, y = 20 + r() * 80, s = 4 + r() * 10; c.strokeRect(x, y, s, s * 0.6); } }
    // sol
    const sol = v15 ? ['#0b0820', '#05040f'] : SOL[kind] || SOL.noos;
    const gg = c.createLinearGradient(0, H0, 0, G.PH); gg.addColorStop(0, sol[0]); gg.addColorStop(1, sol[1]); c.fillStyle = gg; c.fillRect(0, H0, G.PW, G.PH - H0);
    c.fillStyle = `hsla(${hue},100%,70%,.5)`; c.fillRect(0, H0, G.PW, 1);
    return cv;
  }
  function drawGrid(c, hue, t) {
    const H0 = 100, H = G.PH - H0;
    c.fillStyle = `hsla(${hue},100%,66%,.34)`;
    for (let i = 0; i < 9; i++) { const f = ((i + (t * 0.35) % 1) / 9); const y = H0 + H * f * f; c.fillRect(0, Math.round(y), G.PW, 1); }
    c.strokeStyle = `hsla(${hue},100%,66%,.22)`; c.lineWidth = 1; c.beginPath();
    for (let i = -8; i <= 8; i++) { c.moveTo(192 + i * 10, H0); c.lineTo(192 + i * 70, G.PH); } c.stroke();
  }

  /* ================= mise en place ================= */
  const FOE_POS = { 1: [[112, 146]], 2: [[80, 126], [154, 150]], 3: [[62, 122], [140, 128], [100, 156]], 4: [[54, 120], [128, 116], [86, 154], [164, 152]] };
  const HERO_POS = [[270, 120], [306, 132], [342, 144]];
  const TEMOIN_POS = [[14, 104], [32, 112], [12, 124], [34, 132]];   // 2.32 : les témoins, à gauche, derrière les chimères (hors de la manette)
  // écran en hauteur : la fenêtre visible est plus étroite, les deux camps se rapprochent du centre
  const bx = x => G.view.w < G.PW ? Math.round(G.PW / 2 + (x - G.PW / 2) * I.clamp((G.view.w - 20) / 350, 0.5, 1)) : x;
  // 2.16 — en hauteur, les héros se resserrent autour du centre de leur groupe, et non du centre de l'écran : resserrés comme
  // les autres, ils n'étaient plus qu'à vingt points l'un de l'autre pour des figures de trente-deux, et se recouvraient.
  // Ils gardent vingt-sept points d'écart au moins en largeur — là où la scène visible est la plus étroite (216 points, un
  // téléphone élancé) ; à vingt-six, deux silhouettes s'y touchaient encore — et s'étagent davantage en profondeur
  // (dix-huit points au lieu de douze). loupe.js le vérifie : aucun point d'une silhouette sur une autre.
  const HERO_MID = HERO_POS[1];
  const heroPos = (x0, y0) => { if (!(G.view.w < G.PW)) return [x0, y0]; const k = I.clamp((G.view.w - 20) / 350, 0.5, 1); if (k >= 1) return [x0, y0];
    const c = bx(HERO_MID[0]), f = 1 - (1 - k) * 0.55; return [Math.round(c + (x0 - HERO_MID[0]) * f), Math.round(HERO_MID[1] + (y0 - HERO_MID[1]) * (1 + (1 - k) * 1.14))]; };
  const pctX = x => ((x - G.view.x) / G.view.w * 100) + '%';
  B.relayout = function () { if (!C) return; C.all.forEach(e => { if (e.side === 'hero' && e.y0 !== undefined) { const q = heroPos(e.x0, e.y0); e.x = q[0]; e.y = q[1]; } else e.x = bx(e.x0); }); refresh(); const b = $('#battle .banner'); if (b && !b.hidden) placer(b); };
  B.champ = () => (C && C.champ) || null; // le champ de la bataille en cours, pour les outils de test
  let chef = null; // celui sur qui se règle le niveau des égrégores communs : le premier du groupe qui combat
  function mkHero(x, i) {
    const h = typeof x === 'string' ? I.world.hero(x) : x, id = h.id, st = I.calc.of(h);
    const po = I.postures ? I.postures.de(h) : null, Pe = (po && D.POSTURES[po]) || {}; // 2.x : la posture qu'il a prise règle un peu le combat (D.POSTURES)
    return { side: 'hero', id, name: h.def.name, def: h.def, ref: h, lvl: h.lvl, max: { hp: st.hp, sp: st.sp }, hp: Math.min(h.hp, st.hp), sp: Math.min(h.sp, st.sp), atk: Pe.atk ? Math.round(st.atk * (1 + Pe.atk)) : st.atk, mag: Pe.mag ? Math.round(st.mag * (1 + Pe.mag)) : st.mag, df: st.def, spd: st.spd,
      posture: po, soin: Pe.soin || 0, menace: Pe.menace || 0,
      buffs: {}, st: {}, niyya: 1 + (Pe.niyya || 0), sakina: Math.min(100, (h.sakina || 0) + (Pe.sakina || 0)), x: heroPos(HERO_POS[i][0], HERO_POS[i][1])[0], x0: HERO_POS[i][0], y: heroPos(HERO_POS[i][0], HERO_POS[i][1])[1], y0: HERO_POS[i][1], ox: 0, flash: 0, ct: 0, alive: h.hp > 0, sheet: G.planche(I.gear.look(h)), color: D.ELEMENTS[h.def.el].color, ray: (G.D > 1 && h.def.look && h.def.look.rayon) || D.ELEMENTS[h.def.el].color, gear: I.gear.traits(h) }; // ray : la couleur à laquelle on le reconnaît (son rayonnement, en dessin fin) ; color : celle de sa Lumière, pour les effets
  }
  // égrégore de la saga, ou égrégore commun des routes (niveau calé sur le groupe)
  function foeDef(id) { const W = I.world, d = W.saga.enemies[id] || (I.common && I.common.enemies[id]); return d && !d.lvl ? Object.assign({}, d, { lvl: Math.max(1, (chef || W.hero(W.party[0])).lvl) }) : d; }
  function mkFoe(id, i, n, nH) {
    const def = foeDef(id), st = I.calc.enemy(def, nH, n), sc = def.scale || (def.tier === 'boss' ? 3 : def.tier === 'elite' ? 2 : 1);
    const pos = n === 1 && sc >= 3 ? [118, 156] : FOE_POS[n][i];
    return { side: 'foe', id, name: def.name, def, lvl: def.lvl, max: { hp: st.hp, sp: 0 }, hp: st.hp, sp: 0, atk: st.atk, mag: st.mag, df: st.def, spd: st.spd, buffs: {}, st: {}, veils: def.veils, veilsMax: def.veils, broken: false,
      known: {}, tried: {}, phase: 0, skills: (def.skills || []).slice(), x: bx(pos[0]), x0: pos[0], y: pos[1], ox: 0, flash: 0, ct: 0, alive: true, spr: G.enemy(def.art, def.hue, sc, 0), size: sc >= 3 ? 112 : sc === 2 ? 80 : 52, ph: Math.random() * 6, fade: 1 };
  }
  const eff = (e, k) => { const bv = e.buffs[k]; const v = k === 'df' ? e.df : e[k]; return v * (bv ? (bv.v > 0 ? 1.3 : 0.72) : 1); };
  const alive = side => C.all.filter(e => e.side === side && e.alive);

  // Ce que le combat prête au champ de bataille (rangs.js) : ses menus, ses bandeaux, ses effets sur l'idole et sur le groupe.
  const champApi = {
    floater, banner, refresh, listMenu, box: () => $('#battle .cmd'), heros: () => alive('hero'),
    dessous: () => document.body.classList.contains('portrait'), // le panneau est sous la scène : le champ a toute la hauteur
    idole: () => { if (!C) return null; const L = I.mal.lignee(I.world.saga, I.world.ch).idoles; return C.all.find(e => e.side === 'foe' && e.alive && L.includes(e.id)) || alive('foe')[0] || null; },
    voile(e) { if (e.broken || e.veils <= 0) return null; e.veils--; e.flash = 1; if (e.veils <= 0) { e.broken = true; e.ct += 400; return 'devoile'; } return 'ote'; },
    revele(e) { const w = e.def.weak.find(x => !e.known[x]); if (w) e.known[w] = true; },
    doute(h) { h.st.waswas = Math.max(h.st.waswas || 0, 2); h.flash = 1; }
  };

  B.start = async function (opts) {
    const W = I.world, prev = I.scene === B.scene ? W : I.scene, mark = I.input.mark(); let first = true;
    while (true) {
      let res;
      // toute idole : la bataille se déclare, et l'on vérifie d'abord ce que l'on a (à chaque tentative : on peut se rééquiper)
      if (I.mal.estIdole(opts)) { try { await I.ui.prepare(opts); } catch (e) { I.report(e, 'préparation'); } }
      try { res = await run(opts, first); }
      catch (e) { I.report(e, 'combat'); B.abort(prev, mark); res = 'win'; } // un incident ne doit pas arrêter le récit : on rend la main, le combat compte pour gagné
      first = false;
      if (res === 'win') break;
      if (res === 'fuite') return 'fuite'; // 2.19 : le groupe a quitté le combat — rien de gagné, rien de perdu ; qui l'a lancé décide de la suite (la poursuite)
      if (opts.sansReprise) return 'lose'; // un combat que l'on a choisi : on peut en revenir sans l'avoir gagné
      W.healAll(); W.party.forEach(id => { W.hero(id).sakina = 50; });
    }
    try { if (I.lecons && I.debug.auto) I.lecons.COMBAT.forEach(id => I.lecons.reemploi(id, true)); if (I.postures && !opts.heros) I.postures.veille(); } catch (e) { /* une leçon ne doit jamais arrêter le récit */ }
    // l'idole du dernier chapitre (`fin`) est tombée : la Cité-Miroir s'éteint (maps.js, M.eteinte) — le récit le dit, le
    // moteur le montre ; aucun fichier de saga ne le pose
    try { if (W.ch && W.ch.fin && I.mal.estIdole(opts)) I.maps.eteinte = true; } catch (e) { /* le décor ne doit jamais arrêter le récit */ }
    return 'win';
  };
  // sortie de secours : referme le combat où qu'il en soit et rend l'écran
  B.abort = function (prev, mark) {
    try { I.audio.stopBeat(); } catch (e) { /* le son ne compte pas ici */ }
    $('#battle').hidden = true; $('#battle').classList.remove('champ', 'ordre'); document.body.classList.remove('in-battle'); B.active = false; $('#floaters').innerHTML = ''; $('#battle .cmd').innerHTML = ''; $('#battle .banner').hidden = true;
    C = null; if (mark !== undefined) I.input.trim(mark);
    I.setScene(prev || I.world); G.clearParts();
    const W = I.world; if ((prev || W) === W && W.map) { const env = W.map.env; G.amb = { kind: env.particles, rate: env.rate, hue: env.hue, n: 0 }; $('#hud').hidden = false; } I.audio.back();
    const f = $('#fade'); f.style.transition = 'opacity .3s ease'; f.style.opacity = 0; document.body.classList.remove('noir');
  };

  async function run(opts, first) {
    const W = I.world, prev = I.scene;
    const d0 = foeDef(opts.group[0]), hue = d0.hue;
    // un combat marqué 'cite' montre la ville de verre dans la Cité-Miroir seulement ; ailleurs (les Archives, la noosphère),
    // il garde la cité-grille d'avant ('flux')
    const fond = opts.bg === 'cite' && !(W.map && W.map.env && W.map.env.time === 'cite') ? 'flux' : (opts.bg || 'noos');
    C = { opts, hue, bg: paintBg(fond, hue), all: [], t: 0, cursor: null, log: [], turn: 0, vise: null, nom0: d0.name };
    chef = opts.heros ? opts.heros[0] : null; // `heros` : un groupe prêté pour ce combat-là (le râwî seul, dans la noosphère intérieure)
    (opts.heros || W.party).forEach((x, i) => C.all.push(mkHero(x, i)));
    const nH = C.all.length; opts.group.forEach((id, i) => C.all.push(mkFoe(id, i, opts.group.length, nH)));
    // 2.32 (D224 ; le décideur, 24 novembre : « il faut quand même que le combat soit visuellement justifié ») — `temoins` : des
    // hommes de fiction (les pillards que La Razzia tient) se tiennent à l'écart, au bord de la scène, derrière les chimères.
    // Ils ne sont pas du combat : jamais dans C.all, aucune cible (exigence 6 : on ne frappe jamais un homme).
    C.temoins = (opts.temoins || []).slice(0, TEMOIN_POS.length).map((look, i) => ({ look, x0: TEMOIN_POS[i][0], y: TEMOIN_POS[i][1], ph: i * 1.7 }));
    C.all.forEach(e => { e.ct = 1000 / eff(e, 'spd') * (0.6 + Math.random() * 0.4) * (e.side === 'foe' ? 1.15 : 1) * (e.gear && e.gear.prime ? 0.55 : 1); });
    if (first) { I.audio.sfx('glitch'); G.flash('#fff'); await S.fade('out', 220); }
    I.setScene(B.scene); B.active = true; G.clearParts(); G.amb = { kind: 'noos', rate: 5, hue, n: 0 };
    document.body.classList.add('in-battle'); $('#hud').hidden = true; $('#battle').hidden = false; refresh(); // 2.x (D189) : le fil n'est plus vidé — il se tait pendant le combat, et ce qui y attend passera après
    // la musique à retrouver n'est plus retenue ici : c'est celle du lieu (I.audio.place). Retenue à chaque tentative, elle
    // devenait l'air de deuil après une défaite, et la carte le gardait jusqu'à ce qu'on la quitte.
    I.audio.music(opts.group.some(id => (foeDef(id) || {}).vice) && D.TRACKS.includes('vice') ? 'vice' : opts.boss ? 'boss' : 'combat'); I.audio.beat(opts.boss ? 'malfuf' : (opts.bg === 'romaine' || opts.bg === 'palais') ? 'marche' : (opts.bg === 'cite' || opts.bg === 'noos') ? 'cyber' : 'ayyub');
    await S.fade('in', 260);
    // piliers de la Citadelle : ce qui a été bâti pèse dans le combat
    const P = W.pillars(); C.pJust = 1 - 0.03 * (P.justice || 0); C.pLien = 1 + 0.03 * (P.lien || 0);
    const discerne = C.all.some(e => e.side === 'hero' && e.alive && e.posture && (D.POSTURES[e.posture] || {}).faille) ? 1 : 0; // un sage dans le groupe : une faille de chaque égrégore est connue d'emblée
    C.all.forEach(e => { if (e.side === 'hero') e.sakina = Math.min(100, e.sakina + 6 * (P.priere || 0)); else { e.def.weak.slice(0, Math.floor((P.savoir || 0) / 2) + discerne).forEach(w => { e.known[w] = true; }); } });
    // le cœur : l'épreuve consomme la provision ; ce qui manque pèse. Celui qui languit tient moins.
    C.zad0 = first ? I.oeuvres.state().zad : null;   // 2.19 : la provision du cœur avant l'épreuve — une fuite la rend (rien de perdu)
    const HC = I.oeuvres.enter(opts, first); C.lack = HC.lack || 0;
    // l'enracinement de l'idole : il a déjà pesé sur l'épreuve (O.weight) ; ici, sur ses voiles
    C.rac = I.mal.entree(opts, first, C.all.filter(e => e.side === 'foe'));
    // la bataille déclarée : nos rangs sur le champ, et en face les nuées de l'idole
    C.champ = I.rangs.ouvre(C, opts, champApi);
    // 2.19 — « Fuir » : seulement d'un combat de rencontre (celui qui le lance le dit : `fuite`), jamais d'une idole, d'une
    // bataille déclarée, d'une parole, ni d'un combat que le récit attend
    C.peutFuir = !!opts.fuite && !opts.boss && !C.champ && !opts.noir && !I.mal.estIdole(opts);
    C.all.forEach(e => { if (e.side === 'hero' && I.oeuvres.afflicted(e.id)) { e.max.hp = Math.round(e.max.hp * 0.75); e.hp = Math.min(e.hp, e.max.hp); } });
    refresh();
    if (first) await I.rangs.declare(C, opts);
    // 2.x — la progression (lecons.js) : dans une partie neuve, le combat donne une commande nouvelle à la fois
    C.neuf = I.lecons && !I.debug.auto ? I.lecons.combat(I.mal.estIdole(opts)) : null; C.neufVu = false;
    // sa leçon ne passe plus en bandeau sur l'image : elle s'écrit dans le panneau, sous la commande nouvelle, cerclée (D189)
    C.lecon = C.neuf && C.neuf !== 'frapper' ? I.lecons.banniere(C.neuf) : '';
    if (first && opts.intro) await banner(I.esc(opts.intro), readTime(opts.intro), true, 'speech intro');
    else if (first) await banner(opts.boss ? I.t('{nom} se dresse.', { nom: d0.name }) : I.t('Une emprise se referme…'), 1100);
    if (HC.w) {
      await banner(`<small>${C.rac ? I.t('Épreuve de poids {w} · provision du cœur {had} · enracinement {traits}', { w: HC.w, had: HC.had, traits: I.mal.traits(C.rac) }) : I.t('Épreuve de poids {w} · provision du cœur {had}', { w: HC.w, had: HC.had })}</small>${C.lack ? I.t('Le cœur est lourd') : I.t('Le cœur est prêt')}`, 1500, false, C.lack ? 'speech foe' : 'speech intro');
      if (!C.lack) C.all.forEach(e => { if (e.side === 'hero') e.sakina = Math.min(100, e.sakina + 10); });
    }
    for (const e of alive('foe')) {
      const v = e.def.vice; if (!v) continue;
      const L = I.sagas.coeur.lames[v];
      if (!I.oeuvres.hasBlade(v)) { if (first) await banner(`<small>${I.t('Sans sa lame · {lame}', { lame: I.esc(L.name) })}</small>${v === 'orgueil' ? I.t('On ne peut que le repousser') : I.t('On ne peut que la repousser')}`, 1700, false, 'speech foe'); continue; }
      await banner(`<small>${I.t('Lame · {ar}', { ar: I.esc(L.ar) })}</small>${I.t('{lame} tranche ses voiles', { lame: I.esc(L.name) })}`, 1700, false, 'speech intro'); I.audio.sfx('slash'); G.flash(L.couleur);
      e.cut = true; e.veilsMax = 1; e.veils = 1; e.hp = Math.round(e.max.hp * 0.6); e.def.weak.forEach(w => { e.known[w] = true; }); e.flash = 1; fx('slash', e, L.couleur); refresh(); await I.sleep(500);
    }
    C.bete = I.oeuvres.animal();
    if (C.bete && first) {
      const A = I.sagas.coeur.animaux[C.bete], hs = alive('hero'), fs = alive('foe');
      await banner(`<small>${I.t('Compagnon de lumière · {don}', { don: I.esc(A.don) })}</small>${I.esc(A.name)}`, 1300, false, 'speech intro'); I.audio.sfx('light');
      if (C.bete === 'renard') fs.forEach(e => { const w = e.def.weak.find(x => !e.known[x]); if (w) { e.known[w] = true; floater(e, I.t('Faille flairée'), 'info'); } });
      else if (C.bete === 'aigle') hs.forEach(e => { e.ct *= 0.5; e.niyya = Math.min(5, e.niyya + 1); floater(e, I.t('+Niyya'), 'buff'); });
      else if (C.bete === 'lion') fs.forEach(e => { e.buffs.atk = { v: -1, t: 3 }; floater(e, I.t('Force') + ' ▼', 'debuff'); });
      else if (C.bete === 'gazelle') hs.forEach(e => { e.st.regen = 3; e.sakina = Math.min(100, e.sakina + 10); floater(e, I.t('Régén.'), 'buff'); });
      refresh(); await I.sleep(500);
    }
    for (const al of (opts.allies || [])) {
      if (!S.flags[al.flag]) continue;
      if (C.champ && C.champ.rangs.some(r => r.allie && r.name === al.name)) continue; // bataille déclarée : le renfort est un rang, sur le champ
      await banner(`<small>${I.t('Renfort')}</small>${I.esc(al.name)}`, 1700, false, 'speech intro'); I.audio.sfx('roll'); await I.sleep(500);
      alive('foe').forEach(e => { if (!e.broken && al.veil !== 0) { e.veils = Math.max(0, e.veils - 1); if (e.veils <= 0) { e.broken = true; e.ct += 400; devoile(e, I.t('DÉVOILÉ')); } else floater(e, I.t('Voile ôté'), 'info'); } e.hp = Math.max(1, Math.round(e.hp - e.max.hp * (al.hp === undefined ? 0.08 : al.hp))); e.flash = 1; fx('light', e, '#ffe08a'); });
      refresh(); await I.sleep(700);
    }
    // le champ, d'un coup d'œil, avant le premier tour ; le renfort gagné par la parole y prend place
    if (C.champ && first && !I.debug.auto) { const ch = C.champ; ch.vue = true; refresh();
      for (const r of ch.rangs.filter(x => x.allie)) { ch.sel = r; banner(`<small>${I.t('Renfort')}</small>${I.esc(r.name)}`, 1700, false, 'speech intro'); I.audio.sfx('roll'); await I.sleep(1900); }
      await I.sleep(ch.rangs.some(x => x.allie) ? 500 : 1700); ch.sel = null; ch.vue = false; refresh(); }
    let result = first && I.debug.perd ? (I.debug.perd--, 'lose') : null; // crochet de test : une défaite forcée à la première tentative
    while (!result) {
      // prochain acteur
      const act = C.all.filter(e => e.alive).sort((a, b) => a.ct - b.ct)[0]; const dt = act.ct; C.all.forEach(e => { if (e.alive) e.ct -= dt; });
      C.active = act; C.turn++; refresh();
      await takeTurn(act);
      if (C.fuite) { result = 'fuite'; break; } // 2.19 : le groupe a fui
      // après chaque tour de l'idole, et au plus tard tous les trois tours : nos rangs exécutent leur ordre, puis ses nuées avancent
      if (C.champ && I.rangs.du(C, act) && alive('foe').length && alive('hero').length) await I.rangs.pas(C);
      act.ct = 1000 / eff(act, 'spd');
      C.active = null;
      if (!alive('foe').length) result = 'win'; else if (!alive('hero').length && !(await leSecours(opts))) result = 'lose';
    }
    B.last = { turns: C.turn, kos: C.kos || 0, minHp: C.minHp === undefined ? 1 : C.minHp, result, secours: !!C.secouru, esquives: C.esquives || 0, vole: C.vole || 0, champ: C.champ ? Object.assign({ rangs: C.champ.rangs.length, pas: C.champ.pas, flancs: C.champ.flancs.filter(Boolean).length }, C.champ.stats) : null };
    I.audio.stopBeat(); $('#battle .cmd').innerHTML = ''; C.cursor = null;
    if (result === 'fuite') return partir(prev);
    if (result === 'win') { I.audio.afterJingle = I.audio.place || null; I.audio.music('victoire'); } else I.audio.music('deuil');
    if (result === 'win') await victory(); else await defeat();
    // retour
    C.all.filter(e => e.side === 'hero').forEach(e => { const h = e.ref, st = I.calc.of(h); h.hp = Math.min(st.hp, Math.max(1, e.hp) + Math.round(st.hp * 0.35)); h.sp = Math.min(st.sp, e.sp + Math.round(st.sp * 0.35)); h.sakina = e.sakina; });
    await S.fade('out', 260);
    $('#battle').hidden = true; $('#battle').classList.remove('champ', 'ordre'); document.body.classList.remove('in-battle'); B.active = false; $('#floaters').innerHTML = '';
    I.setScene(prev); G.clearParts();
    if (prev === W) { const env = W.map.env; G.amb = { kind: env.particles, rate: env.rate, hue: env.hue, n: 0 }; $('#hud').hidden = false; }
    if (result === 'win') { if (!(I.audio.curTrack && I.audio.curTrack.name === 'victoire')) I.audio.back(); else I.audio.afterJingle = I.audio.place || null; }
    const foes0 = C.all.filter(e => e.side === 'foe');
    const prise = C.prise;
    if (result === 'win') { await S.fade('in', 260); I.mal.chute(opts); await I.oeuvres.leave(opts, foes0, result); }
    C = null;
    // la pièce trouvée : on propose aussitôt de la porter (le joueur de test s'équipe au mieux)
    if (result === 'win' && prise) { I.gear.learn(); if (I.debug.auto) I.gear.bestAll(); else await I.gear.offer(prise); if (prev === W) W.hud(); }
    return result;
  }
  // 2.19 — la fuite : on quitte le combat sur-le-champ. Rien de gagné (ni expérience, ni trouvaille), rien de perdu : chacun
  // garde la Constance, le Souffle et la Sérénité qu'il avait (sans le répit d'après une victoire), la provision du cœur prise
  // à l'entrée est rendue. Ce qui suit — la chimère qui poursuit — est l'affaire de celui qui a lancé le combat (rodeurs.js).
  async function partir(prev) {
    const W = I.world;
    C.all.filter(e => e.side === 'hero').forEach(e => { const h = e.ref, st = I.calc.of(h); h.hp = Math.min(st.hp, Math.max(1, Math.round(e.hp))); h.sp = Math.min(st.sp, e.sp); h.sakina = e.sakina; });
    if (C.zad0 !== null && C.zad0 !== undefined) { const d = I.oeuvres.state(); d.zad = Math.max(d.zad, C.zad0); }
    await S.fade('out', 260);
    $('#battle').hidden = true; $('#battle').classList.remove('champ', 'ordre'); document.body.classList.remove('in-battle'); B.active = false; $('#floaters').innerHTML = ''; $('#battle .banner').hidden = true;
    I.setScene(prev); G.clearParts();
    if (prev === W && W.map) { const env = W.map.env; G.amb = { kind: env.particles, rate: env.rate, hue: env.hue, n: 0 }; $('#hud').hidden = false; W.hud(); }
    I.audio.back();
    C = null;
    await S.fade('in', 260);
    return 'fuite';
  }

  /* ================= tour ================= */
  async function takeTurn(e) {
    // effets de début de tour
    if (e.st.garde) delete e.st.garde;
    if (e.st.esquive) delete e.st.esquive; // 2.19 : l'esquive tient jusqu'à son prochain tour, comme la garde
    if (e.st.recul) delete e.st.recul;     // 2.20 : le tour qui avait reculé est arrivé
    if (e.st.regen) { const v = Math.round(e.max.hp * 0.08); heal(e, v); tick(e, 'regen'); }
    if (e.st.waswas) { const v = Math.max(1, Math.round(e.max.hp * (e.side === 'foe' ? 0.04 : 0.06))); e.hp = Math.max(e.side === 'hero' ? 1 : 0, e.hp - v); floater(e, v, 'dmg dot'); tick(e, 'waswas'); if (e.hp <= 0) { await kill(e); return; } }
    for (const k of ['atk', 'mag', 'df', 'spd']) if (e.buffs[k] && --e.buffs[k].t <= 0) delete e.buffs[k];
    if (e.st.taunt) tick(e, 'taunt');
    if (e.side === 'foe' && e.broken) { e.broken = false; e.veils = e.veilsMax; floater(e, I.t('Se revoile'), 'info'); refresh(); await I.sleep(500); return; }
    if (e.st.stun) { delete e.st.stun; floater(e, I.t('Étourdi'), 'info'); refresh(); await I.sleep(550); return; }
    if (e.side === 'hero') { e.niyya = Math.min(5, e.niyya + 1); e.sakina = Math.min(100, e.sakina + 4); refresh(); }
    const cmd = e.side === 'hero' ? (I.debug.auto ? autoCmd(e) : await playerCmd(e)) : foeCmd(e);
    if (e.st.doute) tick(e, 'doute');
    await perform(e, cmd);
    refresh();
  }
  function tick(e, k) { if (e.st[k] !== undefined && --e.st[k] <= 0) delete e.st[k]; }

  function foeCmd(e) {
    if (e.def.taunts && Math.random() < 0.16) banner(I.t('« {parole} »', { parole: I.pick(e.def.taunts) }), 1500);
    let pool = [ASSAUT].concat(e.st.doute ? [] : e.skills);
    if (e.def.noBasic && pool.length > 1) pool = pool.slice(1);
    // évite de se soigner/renforcer en boucle
    pool = pool.filter(k => !(k.target === 'self' && !k.pow && e.lastSelf));
    let tot = 0; pool.forEach(k => tot += (k.w || 1)); let r = Math.random() * tot, sk = pool[0];
    for (const k of pool) { r -= (k.w || 1); if (r <= 0) { sk = k; break; } }
    e.lastSelf = sk.target === 'self' && !sk.pow;
    return { type: 'skill', skill: sk, targets: targetsFor(e, sk), boost: 0 };
  }
  function targetsFor(e, sk, chosen) {
    const foes = alive(e.side === 'hero' ? 'foe' : 'hero'), allies = alive(e.side);
    switch (sk.target) {
      case 'foes': return foes;
      case 'allies': return sk.revive ? C.all.filter(x => x.side === e.side) : allies;
      case 'self': return [e];
      case 'ally': return [chosen || allies.slice().sort((a, b) => a.hp / a.max.hp - b.hp / b.max.hp)[0]];
      default: { if (chosen) return [chosen]; const t = foes.find(f => f.st.taunt); if (t) return [t]; const pool = foes.slice(); foes.forEach(f => { if (f.menace && Math.random() < f.menace) pool.push(f); }); return [I.pick(pool)]; } // celui qui s'expose (posture du héros) attire plus souvent les coups
    }
  }

  /* ----- commande automatique (tests) ----- */
  function autoCmd(h) {
    if (C.champ) I.rangs.auto(C, h); // le stratège ajuste un rang sans que cela lui coûte son tour
    const skills = h.def.skills.filter(k => k.lvl <= h.lvl && k.cost <= h.sp && !h.st.doute), foes = alive('foe'), allies = alive('hero');
    const low = allies.slice().sort((a, b) => a.hp / a.max.hp - b.hp / b.max.hp)[0];
    const down = C.all.find(x => x.side === 'hero' && !x.alive);
    const fast = I.oeuvres.fasting();
    if (down) { const rv = skills.find(k => k.revive); if (rv) return { type: 'skill', skill: rv, targets: targetsFor(h, rv, down), boost: 0 }; if (!fast && (I.save.data.items.lait || 0) > 0) return { type: 'item', item: 'lait', targets: [down] }; }
    if (low.hp / low.max.hp < 0.45) { const hl = skills.find(k => k.heal); if (hl) return { type: 'skill', skill: hl, targets: targetsFor(h, hl, low), boost: Math.min(h.niyya, 1) }; if (low.hp / low.max.hp < 0.3 && !fast) { const it = ['eau', 'dattes', 'pain', 'miel'].find(k => (I.save.data.items[k] || 0) > 0); if (it) return { type: 'item', item: it, targets: D.ITEMS[it].target === 'allies' ? allies : [low] }; } }
    const t = foes.slice().sort((a, b) => (b.broken ? 1 : 0) - (a.broken ? 1 : 0) || a.hp - b.hp)[0];
    if (h.sakina >= 100 && h.def.limit.pow && !(t.def.immune || []).includes(h.def.limit.el)) return { type: 'skill', skill: h.def.limit, limit: true, targets: targetsFor(h, h.def.limit, t), boost: 0 };
    const atks = skills.filter(k => k.pow).concat([FER, lightOf(h)]).filter(k => !(t.tried[k.el] && (t.def.immune || []).includes(k.el)));
    const score = k => (t.known[k.el] ? 3 : t.tried[k.el] ? 0 : 1.5) + k.pow * (k.hits || 1) * 0.5 + (t.broken ? k.pow : 0) - (k.basic ? 0.3 : 0);
    atks.sort((a, b) => score(b) - score(a));
    const sk = atks[0] || FER, boost = t.broken ? Math.min(3, h.niyya) : (t.known[sk.el] && sk.basic ? Math.min(2, h.niyya) : 0);
    return { type: 'skill', skill: sk, targets: targetsFor(h, sk, t), boost };
  }

  /* ----- commande du joueur ----- */
  // 2.12 (D189) — sur un téléphone tenu en hauteur, le panneau tient dans l'écran. Une Sérénité pleine, seule sur sa
  // rangée, en prend toute la largeur (elle ne passe plus sur deux lignes) ; si le panneau dépasse encore le bas de l'écran
  // (une bataille déclarée, « Ordonner » et la Sérénité : sept commandes, en 360 × 560 ou 360 × 640), les commandes se
  // resserrent, cran par cran, sans jamais descendre sous la taille « normal » — comme une liste de choix (S.ajuster).
  // 2.14 : de même sur un téléphone tenu en largeur (en 844 × 390, le groupe de Khâlid, « Le Sabre dégainé » sur deux
  // lignes, passait sous le bas de l'écran). Au bureau, le panneau tient : rien ne change.
  function tenir(box, btns, main) {
    box.style.fontSize = '';
    const vus = btns.filter(b => !b.hidden), der = vus[vus.length - 1];
    if (main && der && vus.length % 2 && der.classList.contains('limit')) der.classList.add('seul');
    const pan = box.closest('.panel'); if (!pan) return;
    const tz = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tz')) || 1, mini = Math.min(1, 1 / tz);
    // déborder : le panneau sort de l'écran, ou la liste des commandes doit défiler pour montrer la dernière (une liste de
    // vertus ou d'objets, elle, peut défiler). En largeur, le panneau est posé sur le bas de l'écran : la liste des
    // commandes s'allonge d'abord vers le haut, tant que le panneau reste dans l'écran ; ensuite seulement, elle se resserre.
    const list = main ? box.querySelector('.mlist') : null, defile = () => !!list && list.scrollHeight > list.clientHeight + 1;
    const bas = innerHeight - ((I.ui && I.ui.padBas) || 0);   // 2.x : en hauteur, la bande de la manette tactile reste libre (ui.js, layout)
    const deborde = () => { const r = pan.getBoundingClientRect(); return r.bottom > bas + 1 || r.top < 0 || defile(); };
    const sous = main ? null : box.querySelector('.mlist'); if (sous) sous.style.maxHeight = '';
    if (list) { list.style.maxHeight = ''; if (defile() && !document.body.classList.contains('portrait')) { list.style.maxHeight = 'none'; if (pan.getBoundingClientRect().top < 0) list.style.maxHeight = ''; } }
    for (const f of [0.94, 0.88, 0.82].filter(v => v > mini + 0.01).concat(mini)) { if (!deborde()) break; box.style.fontSize = (0.86 * f).toFixed(3) + 'em'; }
    // 2.19 — une liste qui défile (les vertus, les objets, les ordres) : si le panneau sort encore de l'écran (un très petit
    // téléphone), elle raccourcit et défile, pour que « ◂ Retour », sous elle, reste dans l'écran et sous le doigt
    if (sous && deborde()) { const r = pan.getBoundingClientRect(), trop = Math.max(r.bottom - bas, -r.top) + 4, ligne = (sous.querySelector('.mi:not([hidden])') || {}).offsetHeight || 24;
      sous.style.maxHeight = Math.max(ligne * 1.6, sous.clientHeight - trop) + 'px'; }
  }
  /* 2.19 — le choix d'une cible se fait dans la liste même (demande du décideur, 20 novembre : « Par défaut quand on combat
     si on appuie sur frapper et encore sur frapper (ou sur les boutons) ça frappe ou ça active l'action sur l'adversaire ou
     l'ennemi identifié par défaut »). Une commande qui vise quelqu'un (`o.viser(i)` rend ceux qu'elle peut viser) ne quitte
     pas la liste : elle s'arme — son bouton dit sur qui elle porte (« → nom »), le curseur le montre sur la scène et sa
     plaque s'éclaire — et une barre se pose sous la liste, l'indication et « ◂ Retour ». Alors : la même commande touchée
     de nouveau, ou Valider (A), agit sur celui que montre le curseur ; toucher une figure ou sa plaque agit sur elle ; ◂ ▸
     (le joystick) change de cible ; Échap, B ou « Retour » désarment, sans rien dépenser ; toucher une autre commande
     désarme et la prend à sa place. Celui qui est visé d'emblée : `defaut`. Le choix revient par `o.cible`. */
  function listMenu(box, title, items, o) {
    o = o || {}; o.cible = null;
    return new Promise(res => {
      box.innerHTML = ''; box.classList.remove('vise', 'replie'); if (title) box.appendChild(I.el('div', 'mtitle', title));
      const list = I.el('div', 'mlist' + (o.cls ? ' ' + o.cls : '')); box.appendChild(list);
      if (o.note) { const n = I.el('div', 'mlecon', o.note); n.dir = I.langue.sens(n.textContent); box.appendChild(n); } // 2.x (D189) : la leçon d'une commande nouvelle, sous la liste
      const desc = I.el('div', 'mdesc'); if (o.desc) box.appendChild(desc);
      let idx = o.start || 0, fini = false, vise = null, bk = null; const btns = [], main = o.cls === 'main';
      const sel = (i, pas) => { idx = (i + items.length) % items.length; for (let k = 0; k < items.length && items[idx].cache; k++) idx = (idx + (pas || 1) + items.length) % items.length; // une commande pas encore reçue (lecons.js) est sautée
        btns.forEach((b, j) => b.classList.toggle('sel', j === idx)); if (o.desc) desc.innerHTML = items[idx].desc || ''; if (o.onSel) o.onSel(idx); btns[idx].scrollIntoView && btns[idx].scrollIntoView({ block: 'nearest' }); };
      const done = v => { if (fini) return; fini = true; desarmer(true); I.input.pop(h); res(v); }, ne = performance.now();
      // la commande armée : son bouton, la barre, le curseur ; `montre` suit la cible du moment
      // si la liste et sa barre ne tiennent plus (un petit téléphone : la manette garderait sa bande), la liste se replie sur la
      // commande armée — comme le choix d'une cible d'avant la 2.19 ; « Retour » ou B la rouvrent
      const replier = () => { box.classList.remove('replie'); tenir(box, btns, main); const pan = box.closest('.panel'); if (!pan) return; const r = pan.getBoundingClientRect(), bas = innerHeight - ((I.ui && I.ui.padBas) || 0);
        if (r.bottom > bas + 1 || r.top < 0) { box.classList.add('replie'); tenir(box, btns, main); } };
      const montre = () => { const v = vise, e = v.pool[v.k]; C.cursor = e; v.sm.textContent = I.t('→ {nom}', { nom: e.name }); refresh(); replier(); };
      const armer = (i, pool) => {
        const b = btns[i]; let sm = b.querySelector('small'); const avant = sm ? sm.innerHTML : null; if (!sm) { sm = I.el('small'); b.appendChild(sm); }
        const barre = I.el('div', 'mvise'), tactile = document.body.classList.contains('touch');
        barre.appendChild(I.el('div', 'mhint', tactile ? I.t('Choisis une cible · touche-la, ou touche encore la commande') : I.t('Choisis une cible · touche-la, ou ◂ ▸ puis Valider')));
        const rb = I.el('button', 'mback', '◂ ' + I.t('Retour')); rb.type = 'button'; rb.onclick = ev => { ev.stopPropagation(); if (fini) return; I.audio.sfx('move'); desarmer(); }; barre.appendChild(rb);
        list.after(barre); if (bk) bk.hidden = true;
        vise = { i, pool, k: defaut(pool), b, sm, avant, barre }; b.classList.add('arme'); box.classList.add('vise');
        C.pool = pool;
        C.pickCb = e => { if (fini || !vise || !pool.includes(e)) return; I.audio.sfx('ok'); o.cible = e; done(vise.i); };
        C.pickSel = e => { if (!vise) return; const j = pool.indexOf(e); if (j >= 0 && j !== vise.k) { vise.k = j; montre(); } };
        montre();
      };
      // désarmer : la barre s'en va, le bouton reprend ce qu'il disait ; rien n'est dépensé (fin : la liste se referme)
      function desarmer(fin) {
        if (!vise) return; const v = vise; vise = null;
        v.barre.remove(); v.b.classList.remove('arme'); box.classList.remove('vise', 'replie'); if (v.avant === null) v.sm.remove(); else v.sm.innerHTML = v.avant;
        if (bk) bk.hidden = false; if (C) { C.cursor = null; C.pickCb = null; C.pickSel = null; C.pool = null; refresh(); }
        if (!fin) tenir(box, btns, main);
      }
      // choisir la commande i (un toucher, ou Valider) : elle agit, ou elle s'arme si elle vise quelqu'un
      const choisir = i => {
        if (items[i].disabled) { I.audio.sfx('dark'); return; }
        const pool = o.viser ? o.viser(i) : null;
        if (pool && !pool.length) { I.audio.sfx('dark'); if (o.vide) o.vide(i); return; }
        I.audio.sfx('ok'); if (pool) armer(i, pool); else done(i);
      };
      items.forEach((it, i) => {
        const b = I.el('button', 'mi' + (it.disabled ? ' off' : '') + (it.cache ? ' cache' : '') + (it.cls ? ' ' + it.cls : ''), `<span>${it.label}</span>${it.sub ? `<small>${it.sub}</small>` : ''}`); b.type = 'button'; if (it.cache) b.hidden = true;
        b.onclick = ev => { ev.stopPropagation(); if (fini || performance.now() - ne < 250) return; // pas de toucher fantôme
          if (vise) { if (vise.i === i) { I.audio.sfx('ok'); o.cible = vise.pool[vise.k]; done(i); return; } desarmer(); } // la même commande, de nouveau : elle agit sur celui qui est montré
          sel(i); choisir(i); };
        b.onmouseenter = () => { if (!vise) sel(i); }; btns.push(b); list.appendChild(b);
      });
      if (o.back) { bk = I.el('button', 'mback', '◂ ' + I.t('Retour')); bk.type = 'button'; bk.onclick = ev => { ev.stopPropagation(); done(-1); }; box.appendChild(bk); }
      tenir(box, btns, main); sel(idx);
      const h = I.input.push(a => {
        if (fini) return true;
        if (vise) { const n = vise.pool.length;
          if (a === 'up' || a === 'left') { vise.k = (vise.k - 1 + n) % n; montre(); I.audio.sfx('move'); }
          else if (a === 'down' || a === 'right') { vise.k = (vise.k + 1) % n; montre(); I.audio.sfx('move'); }
          else if (a === 'ok') { I.audio.sfx('ok'); o.cible = vise.pool[vise.k]; done(vise.i); }
          else if (a === 'cancel') { I.audio.sfx('move'); desarmer(); }
          return true; }
        if (a === 'up' || (o.grid && a === 'left')) { sel(idx - 1, -1); I.audio.sfx('move'); }
        else if (a === 'down' || (o.grid && a === 'right')) { sel(idx + 1, 1); I.audio.sfx('move'); }
        else if ((a === 'left' || a === 'right') && o.onLR) o.onLR(a === 'left' ? -1 : 1);
        else if (a === 'ok') choisir(idx);
        else if (a === 'cancel' && o.back) done(-1);
        return true;
      });
    });
  }
  // qui est visé d'emblée : parmi les chimères, celle que le groupe a visée en dernier, si elle tient encore ; sinon une
  // chimère dévoilée ; sinon la première. Parmi les nôtres : un éprouvé (pour le relever), sinon le plus éprouvé des debout.
  function defaut(pool) {
    if (!pool.length || !C) return 0;
    if (pool[0].side === 'foe') { let j = C.vise ? pool.indexOf(C.vise) : -1; if (j < 0 || !pool[j].alive) j = pool.findIndex(e => e.broken); return Math.max(0, j); }
    const ko = pool.findIndex(e => !e.alive); if (ko >= 0) return ko;
    let j = 0; pool.forEach((e, k) => { if (e.hp / e.max.hp < pool[j].hp / pool[j].max.hp) j = k; }); return j;
  }
  B.listMenu = listMenu;

  // Toucher ou cliquer un combattant sur la scène : pendant le choix d'une cible, c'est le choisir — comme toucher sa plaque.
  // (x, y) en points logiques. survol : seulement montrer celui que l'on vise.
  function sous(lx, ly) { let best = null, bd = 1e9; if (!C) return null;
    C.all.forEach(e => { let x0, y0, w, h; if (e.side === 'foe') { if (!e.alive || e.fade <= 0) return; w = e.size; h = e.size; x0 = e.x + e.ox - w / 2; y0 = e.y - h - 6; } else { w = 32; h = 48; x0 = e.x + e.ox - 16; y0 = e.y - 46; }
      if (lx < x0 - 4 || lx > x0 + w + 4 || ly < y0 - 4 || ly > y0 + h + 8) return; const d = Math.hypot(lx - (x0 + w / 2), ly - (y0 + h / 2)); if (d < bd) { bd = d; best = e; } });
    return best; }
  B.touche = function (lx, ly) { if (!C || !C.pickCb) return false; const e = sous(lx, ly); if (!e) return false; const cb = C.pickCb; cb(e); return true; };
  B.survol = function (lx, ly) { if (!C || !C.pickSel) return; const e = sous(lx, ly); if (e) C.pickSel(e); };
  // où se tient chacun sur la scène, en points logiques, et qui peut être choisi en ce moment : pour les outils de contrôle (doigt.js)
  B.places = function () { return !C ? [] : C.all.filter(e => e.alive && (e.side !== 'foe' || e.fade > 0)).map(e => Object.assign({ nom: e.name, camp: e.side, x: e.x + e.ox, y: e.side === 'foe' ? e.y - 6 - e.size / 2 : e.y - 22, choix: !!(C.pool && C.pool.includes(e)) },
    e.side === 'hero' ? { id: e.id, posture: e.posture || null, atk: e.atk, mag: e.mag, niyya: e.niyya, sakina: e.sakina, soin: e.soin || 0, menace: e.menace || 0 } : { connues: Object.keys(e.known).filter(k => e.known[k] === true).length })); };
  // ceux qu'une vertu ou la Sérénité peut viser : une chimère, ou l'un des nôtres ; null : elle ne vise personne en
  // particulier (tous, ou soi-même)
  const poolDe = sk => sk.target === 'foe' ? alive('foe') : sk.target === 'ally' ? C.all.filter(e => e.side === 'hero' && (sk.revive ? true : e.alive)) : null;
  const viseFoe = t => { if (t && t.side === 'foe') C.vise = t; }; // le groupe s'en souvient : c'est elle que l'on visera d'emblée

  async function playerCmd(h) {
    const box = $('#battle .cmd'); let boost = 0, start = 0;
    const elc = el => `<i class="el" style="color:${D.ELEMENTS[el].color}">${D.ELEMENTS[el].glyph}</i>`;
    while (true) {
      const pips = () => { let s = ''; for (let i = 0; i < 5; i++) s += `<i class="pip${i < h.niyya - boost ? ' on' : i < h.niyya ? ' use' : ''}"></i>`; return s; };
      const Lc = I.lecons, voit = k => !Lc || Lc.voit(k), sert = k => { const t = Lc && Lc.outilDe(k); if (!t) return; if (C.neuf === t && !C.neufVu) C.neufVu = true; else Lc.reemploi(t, true); }; // (la première fois, on vient de l'apprendre ; ensuite, c'est sans aide)
      const title = () => `<span class="qui"><b style="color:${h.ray || h.color}">${h.name}</b><small class="niv">${I.t('Niv. {n}', { n: h.ref.lvl })}${h.posture && I.postures.offertes() ? ' · ' + D.POSTURES[h.posture].court : ''}</small></span>` + (voit('niyya') ? `<span class="niyya"><button type="button" class="nb" data-d="-1">−</button>${I.t('Niyya')} ${pips()}<button type="button" class="nb" data-d="1">+</button>${boost ? `<em>${I.t('élan ×{n}', { n: boost })}</em>` : ''}</span>` : '');
      const setBoost = d => { if (!voit('niyya')) return; const was = boost; boost = I.clamp(boost + d, 0, Math.min(3, h.niyya)); if (boost > was) { G.spawn({ x: h.x, y: h.y - 24, type: 'ring', r0: 6, r1: 24 + boost * 4, life: 0.4, size: 2, color: h.color }); for (let q = 0; q < 8; q++) G.spawn({ x: h.x + (Math.random() - 0.5) * 20, y: h.y, vy: -50 - Math.random() * 40, life: 0.6, size: 0.9, color: h.color, type: 'spark' }); } const t = box.querySelector('.mtitle'); if (t) { t.innerHTML = title(); wire(); } I.audio.sfx('move'); };
      const wire = () => box.querySelectorAll('.nb').forEach(b => b.onclick = ev => { ev.stopPropagation(); setBoost(+b.dataset.d); });
      const lum = lightOf(h);
      // 2.19 — les commandes : Frapper ; les Vertus (Éclairer en tête : « Éclairer devient une vertu pour éviter la
      // surcharge ») ; les Objets ; les parades — la Garde, l'Esquive, et Fuir là où l'on peut fuir ; puis, s'il y a lieu,
      // Ordonner et la Sérénité
      const items = [
        { id: 'frapper', label: `${elc('fer')} ${I.t('Frapper')}`, sub: boost ? I.t('{n} coups', { n: 1 + boost }) : (h.gear.arme ? D.GEAR_TYPES[h.gear.arme.t].name : I.t('Force')) },
        { id: 'vertus', label: '✦ ' + I.t('Vertus'), sub: I.t('Souffle {sp}', { sp: h.sp }), cache: !voit('light') },
        { id: 'objets', label: '◍ ' + I.t('Objets'), cache: !voit('items') },
        { id: 'garde', label: '⛨ ' + I.t('Garde'), sub: I.t('+ Niyya'), cache: !voit('guard') },
        { id: 'esquive', label: '↷ ' + I.t('Esquive'), sub: I.t('éviter'), cache: !voit('dodge') }
      ];
      if (C.peutFuir) items.push({ id: 'fuir', label: '⇢ ' + I.t('Fuir'), sub: I.t('s’en aller'), cache: !voit('flee') }); // absente là où l'on ne fuit pas
      if (C.champ) items.push({ id: 'ordonner', label: '⚑ ' + I.t('Ordonner'), sub: h.def.stratege && C.champ.libre !== C.turn ? I.t('sans perdre son tour') : I.t('les rangs') });
      if (h.sakina >= 100) items.push({ id: 'limite', label: `❂ ${h.def.limit.name}`, sub: I.t('Sérénité'), cls: 'limit' });
      // la commande nouvelle est cerclée, sa leçon dessous, jusqu'au geste — pour « Se protéger », les trois parades
      const neufs = C.lecon && !C.neufVu ? ({ vertus: ['vertus'], objets: ['objets'], garde: ['garde', 'esquive', 'fuir'] })[C.neuf] || [] : [];
      items.forEach(it => { if (neufs.includes(it.id)) it.cls = 'neuf'; });
      const o = { start, onLR: setBoost, cls: 'main', note: items.some(it => it.cls === 'neuf') ? C.lecon : '',
        viser: j => items[j].id === 'frapper' ? alive('foe') : items[j].id === 'limite' ? poolDe(h.def.limit) : null };
      const p = listMenu(box, title(), items, o); wire();
      const i = await p, it = items[i]; start = i;
      if (it.id === 'frapper') { viseFoe(o.cible); sert('attack'); if (boost) sert('niyya'); return { type: 'skill', skill: FER, targets: [o.cible], boost }; }
      if (it.id === 'vertus') {
        // Éclairer, puis les vertus de chacun (une fois l'outil « vertus » reçu) ; le doute retient les vertus, pas Éclairer
        const sks = voit('skills') ? h.def.skills.filter(k => k.lvl <= h.lvl) : [], L = [lum].concat(sks);
        const ov = { back: true, desc: true, viser: j => poolDe(L[j]) };
        const j = await listMenu(box, `<b>${I.t('Vertus')}</b> <span class="niyya">${I.t('Souffle {sp}/{max}', { sp: h.sp, max: h.max.sp })}${boost ? ` · <em>${I.t('élan ×{n}', { n: boost })}</em>` : ''}</span>`,
          L.map((k, n) => n === 0 ? { label: `${elc(lum.el)} ${I.t('Éclairer')}`, sub: D.ELEMENTS[lum.el].name, desc: I.t('Sans Souffle : une frappe de {element}.', { element: D.ELEMENTS[lum.el].name }) }
            : { label: `${k.pow ? elc(k.el) : k.heal ? '<i class="el" style="color:#7fd69a">✚</i>' : '<i class="el">◇</i>'} ${k.name}`, sub: `${k.cost}`, disabled: k.cost > h.sp || !!h.st.doute, desc: I.esc(k.desc) }), ov);
        if (j < 0) continue;
        const sk = L[j], tg = ov.cible ? [ov.cible] : targetsFor(h, sk); viseFoe(ov.cible);
        sert(j === 0 ? 'attack' : 'skills'); if (boost) sert('niyya'); return { type: 'skill', skill: sk, targets: tg, boost };
      }
      if (it.id === 'objets') {
        const inv = I.save.data.items, ids = Object.keys(D.ITEMS).filter(k => (inv[k] || 0) > 0);
        if (!ids.length) { banner(I.t('La besace est vide.'), 900); continue; }
        const fast = I.oeuvres.fasting();
        const ov = { back: true, desc: true, viser: j => { const x = D.ITEMS[ids[j]]; return x.target === 'allies' ? null : C.all.filter(e => e.side === 'hero' && (x.revive ? !e.alive : e.alive)); }, vide: () => banner(I.t('Personne n’en a besoin.'), 900) };
        const j = await listMenu(box, '<b>' + I.t('Objets') + '</b>' + (fast ? ' <span class="niyya">' + I.t('jour de jeûne') + '</span>' : ''), ids.map(k => ({ label: D.ITEMS[k].name, sub: fast && D.ITEMS[k].vivre ? I.t('jeûne') : '×' + inv[k], disabled: fast && D.ITEMS[k].vivre, desc: fast && D.ITEMS[k].vivre ? I.t('Jour de jeûne : les vivres attendent le coucher du soleil.') : D.ITEMS[k].desc })), ov);
        if (j < 0) continue;
        sert('items'); return { type: 'item', item: ids[j], targets: D.ITEMS[ids[j]].target === 'allies' ? alive('hero') : [ov.cible] };
      }
      if (it.id === 'garde') { sert('guard'); return { type: 'guard' }; }
      if (it.id === 'esquive') { sert('dodge'); return { type: 'esquive' }; }
      if (it.id === 'fuir') { sert('flee'); return { type: 'fuite' }; }
      if (it.id === 'ordonner') { const fait = await I.rangs.ordonner(C, h); if (fait === true) return { type: 'ordre' }; continue; } // 'libre' : le stratège garde son tour
      if (it.id === 'limite') { const sk = h.def.limit, tg = o.cible ? [o.cible] : targetsFor(h, sk); viseFoe(o.cible); return { type: 'skill', skill: sk, targets: tg, boost: 0, limit: true }; }
    }
  }

  /* ================= résolution ================= */
  async function perform(e, cmd) {
    $('#battle .cmd').innerHTML = '';
    if (cmd.type === 'ordre') { floater(e, I.t('Ordonne'), 'info'); await I.sleep(260); return; } // son tour est allé à l'ordre donné aux rangs
    if (cmd.type === 'guard') { e.st.garde = 1; e.niyya = Math.min(5, e.niyya + 1); e.sakina = Math.min(100, e.sakina + 8); fx('guard', e, e.color); floater(e, I.t('Garde'), 'info'); I.audio.sfx('tek'); await I.sleep(420); return; }
    // 2.19 — l'esquive : un mouvement du corps, rien d'autre (exigence 17) ; jusqu'à son prochain tour, un coup peut passer à
    // côté de lui (D.ESQUIVE). Un pari, quand la garde est une certitude : ni Niyya, un peu de Sérénité.
    // 2.32 (D224 ; le décideur, 24 novembre : « l'esquive doit être appliquée au moment de recevoir le coup pas au moment où
    // on sélectionne l'esquive ») : au choix, rien ne paraît sur la scène — l'ordre pris se lit sur sa rangée (« Esquive ») ;
    // l'esquive se voit au coup, et seulement là (plus bas, `esquiver`).
    if (cmd.type === 'esquive') { e.st.esquive = 1; e.sakina = Math.min(100, e.sakina + 4); await I.sleep(260); return; }
    // 2.19 — la fuite : le mot en bas (2.17), les nôtres s'éloignent, et le combat se referme (run, partir)
    if (cmd.type === 'fuite') {
      banner(I.t('Vous fuyez. {nom} vous poursuit : courez !', { nom: I.esc(C.nom0 || '') }), 1700, false, 'speech foe'); I.audio.sfx('roll');
      const H = alive('hero'); H.forEach(x => { x.marche = 1; tween(x, 'ox', 70, 700); }); await I.sleep(1100); H.forEach(x => { x.marche = 0; });
      C.fuite = true; return;
    }
    if (cmd.type === 'item') {
      const it = D.ITEMS[cmd.item]; I.save.data.items[cmd.item]--; await banner(it.name, 700);
      cmd.targets.forEach(t => { if (it.revive && !t.alive) { t.alive = true; t.hp = Math.round(t.max.hp * it.revive); floater(t, I.t('Relevé§combat'), 'heal'); } if (it.hp && t.alive) heal(t, Math.round(t.max.hp * it.hp)); if (it.sp) { t.sp = Math.min(t.max.sp, t.sp + Math.round(t.max.sp * it.sp)); floater(t, I.t('+Souffle'), 'heal'); } if (it.cleanse) cleanse(t); if (it.niyya) { t.niyya = Math.min(5, t.niyya + it.niyya); floater(t, I.t('+Niyya'), 'info'); } fx('heal', t, '#7fd69a'); });
      I.audio.sfx('heal'); await I.sleep(520); return;
    }
    const sk = cmd.skill, boost = cmd.boost || 0, hero = e.side === 'hero';
    if (hero) { if (sk.cost) e.sp = Math.max(0, e.sp - sk.cost); e.niyya -= boost; if (cmd.limit) e.sakina = 0; }
    if (!sk.basic || !hero) banner(sk === ASSAUT ? I.t(sk.name) : sk.name, 800, false, cmd.limit ? 'limit' : hero ? '' : 'foe');
    if (hero && !sk.basic) { e.pose = 'resolu'; setTimeout(() => { e.pose = null; }, 900 / I.speed); }
    if (cmd.limit) { G.flash(e.color); I.audio.sfx('roll'); await I.sleep(350); }
    const col = sk.el ? D.ELEMENTS[sk.el].color : (hero ? e.color : `hsl(${e.def.hue},90%,65%)`), dir = hero ? -1 : 1;
    // quelques pas vers l'avant ; puis, à chaque coup, le geste : l'élan, le coup (2.x)
    const ga = hero ? e.gear.arme : null, fer0 = sk.basic && sk.el === 'fer', geste = hero && sk.pow ? { anim: fer0 ? (e.gear.anim || (ga ? 'slash' : 'geste')) : 'geste', port: fer0 && ga ? (ga.port || (D.GEAR_TYPES[ga.t] || {}).port || null) : null } : null; // « Frapper » : avec l'arme en main ; « Éclairer » et les vertus qui portent un coup : le geste seul
    if (hero) e.marche = 1; await tween(e, 'ox', dir * (hero ? 16 : 14), hero ? 180 : 110); e.marche = 0;
    // l'arme en main : une dague frappe parfois deux fois, une masse étourdit parfois
    const fer = hero && sk.basic && sk.el === 'fer', vif = fer && e.gear.vif && Math.random() < e.gear.vif; if (vif) floater(e, I.t('Coup double'), 'info');
    const hits = (sk.hits || 1) + (sk.basic && hero ? boost : 0) + (vif ? 1 : 0), mult = sk.basic ? 1 : 1 + 0.5 * boost;
    let targets = cmd.targets.filter(t => t.alive || sk.revive);
    // 2.19 — l'esquive : un coup d'une chimère sur l'un des nôtres qui s'est mis à l'esquive peut passer à côté de lui — un
    // tirage par coup porté (D.ESQUIVE : seul visé, ou tout le groupe) ; il n'en prend ni dégâts ni effets. Il se dit et se
    // voit quand le coup arrive : « Esquivé », un pas de côté, loin des chimères.
    const evites = !hero && (sk.target === 'foe' || sk.target === 'foes') ? targets.filter(t => t.side === 'hero' && t.st.esquive && Math.random() < ((D.ESQUIVE || {})[sk.target === 'foe' && targets.length === 1 ? 'seul' : 'groupe'] || 0)) : [];
    if (evites.length) targets = targets.filter(t => !evites.includes(t));
    // 2.32 (D224) : au moment où la chimère arrive au bout de son élan, celui qui esquive s'écarte d'un pas, et le coup tombe
    // dans le vide, là où il se tenait — « Esquivé », le bruit de l'air.
    const esquiver = () => { const n = evites.length; evites.splice(0).forEach(t => { floater(t, I.t('Esquivé'), 'buff'); C.esquives = (C.esquives || 0) + 1; fx(sk.anim || (sk.el === 'fer' ? 'slash' : 'dark'), { x: t.x, ox: 0, y: t.y, size: t.size, side: t.side }, col, e); tween(t, 'ox', 16, 90).then(() => I.sleep(260)).then(() => tween(t, 'ox', 0, 260)); }); if (n) I.audio.sfx('move'); };
    if (sk.pow) {
      for (let hI = 0; hI < hits; hI++) {
        targets = targets.filter(t => t.alive); if (!targets.length && !evites.length) break;
        if (geste) { e.geste = Object.assign({ t0: performance.now() }, geste); await I.sleep((G.FRAPPE.elan + G.FRAPPE.balai * 0.5) * 1000); } // le coup porte au milieu du balai
        if (evites.length) { esquiver(); if (!targets.length) { await I.sleep(300); break; } }
        if (!targets.length) break;
        for (const t of targets) strike(e, t, sk, mult, col);
        I.audio.sfx(sk.el === 'fer' ? (hero ? 'slash' : 'hit') : hero ? 'light' : 'dark');
        await I.sleep(hits > 1 ? 190 : 300);
      }
      if (fer && e.gear.choc) for (const t of cmd.targets) if (t.alive && t.hp > 0) applyFx(e, t, { st: 'stun', chance: e.gear.choc }, 0);
      for (const t of cmd.targets) if (t.alive && t.hp <= 0) await kill(t);
      for (const t of cmd.targets) if (t.side === 'foe' && t.alive) await checkPhase(t);
    } else { fx(sk.anim || (sk.heal ? 'heal' : 'glyph'), sk.target === 'self' ? e : targets[0] || cmd.targets[0] || e, col); I.audio.sfx(sk.heal ? 'heal' : hero ? 'light' : 'dark'); esquiver(); }
    if (sk.heal || sk.revive || sk.sp) {
      for (const t of targets) {
        if (sk.revive && !t.alive) { t.alive = true; t.hp = 1; t.st = {}; floater(t, I.t('Relevé§combat'), 'heal'); }
        if (!t.alive) continue;
        if (sk.heal) heal(t, Math.round(eff(e, 'mag') * sk.heal * 2.7 * (1 + 0.4 * boost) * (1 + (e.soin || 0))));
        if (sk.sp) { t.sp = Math.min(t.max.sp, t.sp + Math.round(t.max.sp * sk.sp)); floater(t, I.t('+Souffle'), 'heal'); }
        fx('heal', t, '#7fd69a');
      }
    }
    (sk.fx || []).forEach(f => {
      const tg = f.self ? [e] : targets.filter(t => t.alive);
      tg.forEach(t => applyFx(e, t, f, boost));
    });
    await I.sleep(240); e.geste = null;
    if (hero) e.marche = 1; await tween(e, 'ox', 0, hero ? 170 : 120); e.marche = 0;
  }

  function strike(a, t, sk, mult, col) {
    const el = sk.el, stat = el === 'fer' ? eff(a, 'atk') : eff(a, 'mag');
    const immune = t.side === 'foe' && (t.def.immune || []).includes(el), weak = t.side === 'foe' && t.def.weak.includes(el);
    if (t.side === 'foe') t.tried[el] = true;
    if (immune) { t.known[el] = 'x'; floater(t, I.t('Sans effet'), 'info'); fx('guard', t, '#889'); return; }
    // l'équipement : une lance perce une part de la garde ; un bouclier pare parfois un coup de fer
    const gA = a.gear || {}, gT = t.gear || {}, perce = el === 'fer' && gA.perce ? 1 - gA.perce : 1;
    let d = stat * sk.pow * mult * 2.2 * (50 / (50 + eff(t, 'df') * perce)) * (0.92 + Math.random() * 0.16);
    const pare = el === 'fer' && gT.parade && !t.st.stun && Math.random() < gT.parade; if (pare) d *= 0.5;
    if (weak) d *= 1.3; if (t.broken) d *= 1.5; if (t.st.garde) d *= 0.5;
    d *= a.side === 'hero' ? (C.pLien || 1) * (1 - 0.08 * (C.lack || 0)) : (C.pJust || 1) * (1 + 0.08 * (C.lack || 0));
    d = Math.max(1, Math.round(d));
    t.hp = Math.max(0, t.hp - d); t.flash = 1; t.shake = 0.25;
    floater(t, d, 'dmg' + (weak ? ' weak' : '') + (t.side === 'hero' ? ' hero' : '')); if (pare) { floater(t, I.t('Paré'), 'info'); fx('guard', t, '#c3c8d2'); }
    fx((sk.basic && el === 'fer' && gA.anim) || sk.anim || (el === 'fer' ? 'slash' : 'light'), t, col, a);
    if (t.side === 'hero') { t.sakina = Math.min(100, t.sakina + d / t.max.hp * 70); G.shake(160); C.minHp = Math.min(C.minHp === undefined ? 1 : C.minHp, t.hp / t.max.hp); if (t.hp <= 0) C.kos = (C.kos || 0) + 1; }
    if (weak) {
      t.known[el] = true; if (a.side === 'hero') a.sakina = Math.min(100, a.sakina + 7);
      if (!t.broken) { t.veils--; if (t.veils <= 0) { t.broken = true; t.veils = 0; t.ct += 400; devoile(t, I.t('DÉVOILÉ')); I.audio.sfx('break'); G.flash('#fff'); G.shake(380); if (a.side === 'hero') a.sakina = Math.min(100, a.sakina + 12); for (let i = 0; i < 26; i++) G.spawn({ x: t.x, y: t.y - t.size / 2, vx: (Math.random() - 0.5) * 240, vy: (Math.random() - 0.7) * 200, grav: 300, life: 0.9, size: 1.2, color: '#fff', type: 'spark' }); } }
    }
  }
  function heal(t, v) { if (!t.alive) return; t.hp = Math.min(t.max.hp, t.hp + v); floater(t, '+' + v, 'heal'); }
  function cleanse(t) { ['atk', 'mag', 'df', 'spd'].forEach(k => { if (t.buffs[k] && t.buffs[k].v < 0) delete t.buffs[k]; }); delete t.st.doute; delete t.st.waswas; delete t.st.stun; }
  function applyFx(a, t, f, boost) {
    if (f.chance !== undefined && Math.random() > f.chance * (t.def && t.def.tier === 'boss' && (f.st === 'stun' || f.st === 'doute') ? 0.5 : 1)) return;
    const turns = (f.turns || 3) + (a.side === 'hero' ? boost : 0);
    switch (f.st) {
      case 'atk': case 'mag': case 'def': case 'spd': { const k = f.st === 'def' ? 'df' : f.st; t.buffs[k] = { v: f.v, t: turns }; floater(t, `${I.t(STN[f.st])} ${f.v > 0 ? '▲' : '▼'}`, f.v > 0 ? 'buff' : 'debuff'); break; }
      case 'stun': if (t.side === 'foe' && t.def.tier === 'boss' && t.stunned) break; if (t.gear && t.gear.ferme && Math.random() < t.gear.ferme) { floater(t, I.t('Tient bon'), 'buff'); break; } t.st.stun = 1; t.stunned = true; floater(t, I.t('Étourdi'), 'debuff'); break;
      case 'doute': t.st.doute = f.turns || 2; floater(t, I.t('Doute'), 'debuff'); break;
      case 'waswas': t.st.waswas = turns; floater(t, I.t('Waswâs'), 'debuff'); break;
      case 'regen': t.st.regen = turns; floater(t, I.t('Régén.'), 'buff'); break;
      case 'garde': t.st.garde = 1; floater(t, I.t('Garde'), 'buff'); break;
      case 'reveal': if (t.side === 'foe') { t.def.weak.forEach(w => t.known[w] = true); (t.def.immune || []).forEach(w => t.known[w] = 'x'); floater(t, I.t('Failles révélées'), 'info'); } break;
      case 'cleanse': cleanse(t); floater(t, I.t('Purifié'), 'buff'); break;
      case 'dispel': ['atk', 'mag', 'df', 'spd'].forEach(k => { if (t.buffs[k] && t.buffs[k].v > 0) delete t.buffs[k]; }); delete t.st.regen; floater(t, I.t('Dissipé'), 'debuff'); break;
      case 'veil': if (t.side === 'foe' && !t.broken) { t.veils = Math.max(0, t.veils + (f.v || -1)); if (t.veils <= 0) { t.broken = true; t.ct += 400; devoile(t, I.t('DÉVOILÉ')); I.audio.sfx('break'); G.flash('#fff'); } } break;
      case 'niyya': t.niyya = I.clamp((t.niyya || 0) + (f.v || 1), 0, 5); if (t.side === 'hero') floater(t, I.t('+Niyya'), 'buff'); break;
      case 'sakina': if (t.side === 'hero') { t.sakina = I.clamp(t.sakina + (f.v || 20), 0, 100); floater(t, I.t('+Sérénité'), 'buff'); } break;
      case 'taunt': t.st.taunt = turns; floater(t, I.t('Fait front'), 'buff'); break;
      // 2.20 — le temps volé (D.TEMPS ; proposition validée par le décideur le 20 novembre, D210). Ces attaques prennent du
      // temps plutôt que de la Constance. La Garde les reçoit comme un coup, à moitié ; une attaque esquivée ne porte rien
      // (perform : l'esquivé n'est plus parmi les cibles). « recul » : le prochain tour arrive plus tard — la frise le montre,
      // et la rangée dit « Retardé » jusqu'à ce tour. « baisse » : la Niyya baisse ; sans Niyya, ou tant que le joueur ne la
      // voit pas encore (lecons.js), c'est la Sérénité. « perdu » : l'étourdissement, une chance sur quatre.
      case 'recul': { const T = D.TEMPS, k = T.recul * (t.st.garde ? T.garde : 1); t.ct += k * 1000 / eff(t, 'spd'); t.st.recul = 1; C.vole = (C.vole || 0) + 1; floater(t, I.t('Retardé'), 'debuff'); refresh(); break; } // la frise le montre aussitôt
      case 'baisse': { const T = D.TEMPS; if (t.st.garde && Math.random() >= T.garde) { floater(t, I.t('Tient bon'), 'buff'); break; }
        const vue = t.side !== 'hero' || !I.lecons || I.lecons.voit('niyya'); C.vole = (C.vole || 0) + 1;
        if (vue && t.niyya > 0) { t.niyya = Math.max(0, t.niyya - T.niyya); floater(t, I.t('Niyya − {n}', { n: T.niyya }), 'debuff'); }
        else if (t.side === 'hero') { t.sakina = Math.max(0, t.sakina - T.serenite); floater(t, I.t('Sérénité − {n}', { n: T.serenite }), 'debuff'); }
        refresh(); break; }
      case 'perdu': { const T = D.TEMPS, avant = !!t.st.stun; applyFx(a, t, { st: 'stun', chance: T.perdu * (t.st.garde ? T.garde : 1) }, 0); if (t.st.stun && !avant) C.vole = (C.vole || 0) + 1; break; }
    }
  }
  async function kill(t) {
    if (!t.alive) return; t.alive = false; t.hp = 0; t.st = {}; t.buffs = {};
    if (t.side === 'foe' && t.def.vice) devoile(t, t.cut ? I.t('TRANCHÉ') : I.t('Repoussé'));
    if (t.side === 'foe') { I.audio.sfx('break'); for (let i = 0; i < 40; i++) G.spawn({ x: t.x + (Math.random() - 0.5) * t.size * 0.7, y: t.y - Math.random() * t.size, vx: (Math.random() - 0.5) * 40, vy: -20 - Math.random() * 60, life: 1.2 + Math.random(), size: 1 + Math.random(), color: `hsl(${t.def.hue},100%,75%)`, type: 'glyph' }); await tween(t, 'fade', 0, 500); }
    else {
      floater(t, I.t('Éprouvé'), 'debuff'); I.audio.sfx('dark'); await I.sleep(300);
      if (C.bete === 'phenix' && !C.phenix) { C.phenix = true; await banner('<small>' + I.t('Le Phénix') + '</small>' + I.t('Ce qui a brûlé se relève'), 1200, false, 'speech intro'); t.alive = true; t.hp = Math.round(t.max.hp * 0.4); floater(t, I.t('Relevé§combat'), 'heal'); fx('pillar', t, '#ff9a5c'); refresh(); }
    }
  }
  async function checkPhase(t) {
    const ph = t.def.phases; if (!ph) return;
    while (t.phase < ph.length && t.alive && t.hp / t.max.hp <= ph[t.phase].at) {
      const p = ph[t.phase++]; G.shake(500); G.flash(`hsl(${t.def.hue},90%,60%)`); I.audio.sfx('dark');
      if (p.say) await banner(`<small>${I.esc(t.name)}</small>${I.t('« {parole} »', { parole: I.esc(p.say) })}`, readTime(p.say), true, 'foe speech');
      (p.fx || []).forEach(f => applyFx(t, t, f, 0)); (p.addSkills || []).forEach(k => t.skills.push(k));
      t.broken = false; t.veils = t.veilsMax; refresh();
    }
  }

  /* ================= fins ================= */
  B.grantXP = function (xp) {
    const W = I.world, lines = [];
    W.party.forEach(id => { const h = W.hero(id); h.xp += xp; let up = false;
      while (h.xp >= I.calc.xpNeed(h.lvl) && h.lvl < 12) { h.xp -= I.calc.xpNeed(h.lvl); h.lvl++; up = true; h.def.skills.filter(k => k.lvl === h.lvl).forEach(k => lines.push(`<li>${I.t('<b>{nom}</b> apprend <em>{vertu}</em>', { nom: h.def.name, vertu: k.name })}</li>`)); }
      if (up) { lines.unshift(`<li>${I.t('<b>{nom}</b> atteint le niveau <b>{n}</b>', { nom: h.def.name, n: h.lvl })}</li>`); const st = I.calc.of(h); h.hp = st.hp; h.sp = st.sp; } });
    W.persistHeroes(); return lines;
  };
  async function victory() {
    const W = I.world, sv = I.save.data; I.audio.sfx('roll');
    let xp = 0; C.all.filter(e => e.side === 'foe').forEach(e => { xp += I.calc.xpOf(e.def); const cid = 'foe:' + (W.saga.enemies[e.id] ? W.saga.id : '_') + ':' + e.id; if (!sv.codex.includes(cid)) sv.codex.push(cid); });
    const lines = [];
    C.all.filter(e => e.side === 'hero').forEach(e => {
      const h = e.ref; h.xp += xp; let up = false;
      while (h.xp >= I.calc.xpNeed(h.lvl) && h.lvl < 12) { h.xp -= I.calc.xpNeed(h.lvl); h.lvl++; up = true; h.def.skills.filter(k => k.lvl === h.lvl).forEach(k => lines.push(`<li>${I.t('<b>{nom}</b> apprend <em>{vertu}</em>', { nom: h.def.name, vertu: k.name })}</li>`)); }
      if (up) { lines.unshift(`<li>${I.t('<b>{nom}</b> atteint le niveau <b>{n}</b>', { nom: h.def.name, n: h.lvl })}</li>`); const st = I.calc.of(h); e.max = { hp: st.hp, sp: st.sp }; e.hp = st.hp; e.sp = st.sp; }
    });
    let drop = '';
    if (!C.opts.interieur && (C.opts.boss || Math.random() < 0.4)) { const k = C.opts.boss ? I.pick(['musc', 'lait', 'eau']) : I.pick(['dattes', 'dattes', 'pain', 'eau', 'miel', 'siwak']); sv.items[k] = (sv.items[k] || 0) + 1; drop = `<li>${I.t('Trouvé : <b>{objet}</b>', { objet: D.ITEMS[k].name })}</li>`; }
    // une victoire rapporte aussi du matériel : quelques dirhams, et parfois une pièce d'équipement (toujours après une idole).
    // Rien de tel après un mal du cœur ou une idée noire : ce combat-là ne se paie pas.
    const maux = C.all.filter(e => e.side === 'foe' && e.def.vice), materiel = !maux.length && !C.opts.noir && !C.opts.interieur;
    if (materiel) {
      const piece = I.gear.prise({ boss: !!C.opts.boss, elite: C.all.some(e => e.side === 'foe' && e.def.tier !== 'minion') });
      if (piece) { I.gear.add(piece, 1); C.prise = piece; drop += `<li>${I.t('Trouvé : {img} <b>{objet}</b>', { img: I.gear.img(piece), objet: I.esc(D.GEAR[piece].name) })}</li>`; }
      if (I.trade && W.saga && (!W.saga.frame || W.saga.veillees)) { const dh = C.opts.boss ? 8 + Math.floor(Math.random() * 7) : 2 + Math.floor(Math.random() * 4); I.trade.dirhams(dh); drop += `<li>${I.t('Trouvé : <b>{n} dirhams</b>', { n: dh })}</li>`; }
    }
    W.persistHeroes();
    C.all.forEach(e => { if (e.side === 'hero' && e.alive) e.pose = 'salut'; });
    // 2.17 — la victoire se dit en bas, comme tout message du combat (elle était un carton plein écran) : les héros, debout,
    // restent à la vue. Elle attend un toucher, ou le temps de la lire (cinq secondes au moins).
    const sous = maux.length ? (maux.every(e => e.cut) ? I.t('La lame a tranché') : I.t('Sans sa lame, le mal recule')) : C.opts.noir ? I.t('Ce n’est pas lui qu’on a combattu : c’est ce qu’il regardait.') : C.opts.boss ? I.t('L’idole se brise') : I.t('L’emprise est brisée');
    const titre = maux.length ? (maux.every(e => e.cut) ? I.t('Tranché') : maux.some(e => e.cut) ? I.t('Tranché et repoussé') : I.t('Repoussé')) : C.opts.noir ? I.t('La chimère lâche prise') : I.t('Dévoilement');
    const gains = `<li>${I.t('Expérience : <b>+{n}</b>', { n: xp })}</li>${lines.join('')}${drop}`;
    await banner(`<small>${sous}</small><b class="titre">${titre}</b><ul>${gains}</ul>`, Math.max(5000, readTime(`${sous} ${titre} ${gains}`.replace(/<[^>]*>/g, ' '))), true, 'fin');
  }
  // Le secours (décision du décideur) : avant la fin d'une bataille déclarée presque perdue, si la prière a été tenue dans le
  // chapitre, le groupe est relevé, une fois par tentative. On ne montre que de la lumière : ni figure, ni nom, ni nombre.
  // On ne le commande pas : aucune action du combat ne le déclenche, et il ne vient pas dans un combat ordinaire.
  // Son carton : le verset et sa référence (2.x : dans la langue secondaire aussi, sous ceux de la langue du jeu) — à part
  // depuis la 2.24, pour que v2/tools/longueurs.js l'éprouve tel qu'il se montre
  B.cartonSecours = function (T) {
    const v2 = I.langue.l2() ? I.langue.second(T.verset, T, 'verset') : null, r2 = v2 ? I.langue.second(T.ref, T, 'ref') : null;
    return `<div class="orn">✧</div><p class="small">${I.esc(T.titre)}</p><h1>${I.t('On ne le commande pas')}</h1><p>${I.esc(T.verset)}</p><p class="small">${I.esc(T.ref)}</p>${v2 ? S.bloc2(`<p>${I.esc(v2)}</p>${r2 ? `<p class="small">${I.esc(r2)}</p>` : ''}`) : ''}<p class="mot">${I.esc(T.mot)}</p><div class="hint">▼</div>`;
  };
  async function leSecours(opts) {
    if (C.secouru || !I.mal.estIdole(opts) || !S.flags._prayed) return false;
    C.secouru = true; const T = (I.sagas.coeur && I.sagas.coeur.secours) || { titre: I.t('Le secours'), bandeau: I.t('Le groupe est relevé') }, vite = I.debug.auto;
    $('#battle .cmd').innerHTML = ''; I.audio.sfx('light'); G.flash('#fff6dc'); if (!vite) await I.sleep(650);
    C.all.forEach(e => {
      if (e.side !== 'hero') { if (e.alive) e.ct += 320; return; } // l'idole marque le pas
      e.alive = true; e.hp = Math.max(e.hp, Math.round(e.max.hp * 0.5)); e.sp = Math.max(e.sp, Math.round(e.max.sp * 0.5)); cleanse(e);
      e.sakina = Math.min(100, e.sakina + 25); e.ct = Math.min(e.ct, 60); e.flash = 1; fx('pillar', e, '#fff6dc'); floater(e, I.t('Relevé§combat'), 'heal');
    });
    I.audio.sfx('roll'); refresh(); I.oeuvres.learn('secours');
    const d = I.oeuvres.state();
    if (!d.vuSecours && !vite && T.verset) { d.vuSecours = true; await I.sleep(500); await S.card('pray secours', B.cartonSecours(T)); }
    else await banner(`<small>${I.esc(T.titre)}</small>${I.esc(T.bandeau)}`, 1700, false, 'speech intro');
    if (!vite) await I.sleep(500);
    return true;
  }
  async function defeat() {
    I.audio.sfx('dark');
    if (C.opts.interieur) { if (I.world.excursion) return; // dans la descente, la carte du râwî rattrapé suit (rodeurs.js) : une seule carte
      const T = ((I.sagas.coeur || {}).portes || {}).remonte || {}; // la noosphère intérieure : on remonte, rien n'est perdu
      await S.card('defeat', `<p class="small">${I.esc(T.titre || '')}</p><h1>${I.esc(T.h1 || '')}</h1><p>${I.esc(T.texte || '')}</p><div class="hint">▼</div>`); return; }
    await S.card('defeat', `<p class="small">${I.t('Le groupe est éprouvé')}</p><h1>${I.t('La chaîne ne rompt pas')}</h1><p>${I.t('Ce qui fut transmis ne se perd pas.')}</p><div class="hint">${I.t('Reprendre')} ▼</div>`);
  }

  /* ================= présentation ================= */
  function tween(e, k, to, ms) { const from = e[k], t0 = performance.now(); ms = ms / I.speed; return new Promise(res => { (function st() { const f = Math.min(1, (performance.now() - t0) / ms); e[k] = from + (to - from) * f; if (f < 1) requestAnimationFrame(st); else res(); })(); }); }
  function pos(e) { return { x: e.x + e.ox, y: e.y - (e.side === 'foe' ? e.size * 0.55 : 26) }; }
  function fx(kind, e, col, from) {
    const p = pos(e), x = p.x, y = p.y;
    switch (kind) {
      // coups portés avec l'arme en main : estoc de lance, flèche, choc de masse ou de bâton
      case 'thrust': { const s = from && from.x < x ? 1 : -1; for (let i = 0; i < 14; i++) G.spawn({ x: x - s * (40 - i * 3), y: y + (Math.random() - 0.5) * 3, vx: s * (200 + Math.random() * 140), vy: (Math.random() - 0.5) * 16, life: 0.24, size: 1.2, color: i % 3 ? '#fff' : col, type: 'spark' }); G.spawn({ x, y, type: 'ring', r0: 3, r1: 18, life: 0.3, size: 2, color: '#fff' }); break; }
      case 'arrow': { const fp = from ? pos(from) : { x: x + 120, y: y }, T = 0.16; for (let i = 0; i < 8; i++) G.spawn({ x: fp.x + (x - fp.x) * i * 0.035, y: fp.y + (y - fp.y) * i * 0.035, vx: (x - fp.x) / T, vy: (y - fp.y) / T, life: T, size: 1.1, color: i ? '#e6dcc4' : '#fff', type: 'spark' }); setTimeout(() => { G.spawn({ x, y, type: 'ring', r0: 2, r1: 14, life: 0.3, size: 2, color: '#fff' }); for (let i = 0; i < 7; i++) G.spawn({ x, y, vx: (Math.random() - 0.5) * 150, vy: (Math.random() - 0.5) * 150, life: 0.3, size: 0.9, color: col, type: 'spark' }); }, T * 1000 / I.speed); break; }
      case 'smash': G.spawn({ x, y: y + 16, type: 'ring', r0: 6, r1: 36, life: 0.36, size: 3, color: '#fff' }); for (let i = 0; i < 16; i++) G.spawn({ x: x + (Math.random() - 0.5) * 22, y: y + 12, vx: (Math.random() - 0.5) * 220, vy: -60 - Math.random() * 170, grav: 520, life: 0.5, size: 1.2, color: i % 2 ? col : '#e6dcc4', type: 'spark' }); G.shake(150); break;
      case 'slash': G.spawn({ x, y, type: 'arc', r0: 18, a0: -2.4, sweep: 2.6, life: 0.28, size: 2, color: col }); G.spawn({ x, y, type: 'arc', r0: 14, a0: 0.7, sweep: 2.4, life: 0.32, size: 1.5, color: '#fff' }); for (let i = 0; i < 10; i++) G.spawn({ x, y, vx: (Math.random() - 0.5) * 260, vy: (Math.random() - 0.5) * 200, life: 0.35, size: 0.9, color: col, type: 'spark' }); break;
      case 'light': G.spawn({ x, y: y + 22, type: 'pillar', w: 12, life: 0.5, color: col, a: 0.8 }); G.spawn({ x, y, type: 'ring', r0: 4, r1: 30, life: 0.45, size: 2, color: col }); G.spawn({ x, y, type: 'glow', size: 5, life: 0.4, color: col }); break;
      case 'burst': for (let i = 0; i < 26; i++) { const a = Math.random() * 6.28, v = 80 + Math.random() * 200; G.spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5, size: 1.1, color: i % 3 ? col : '#fff', type: 'spark' }); } G.spawn({ x, y, type: 'ring', r0: 6, r1: 44, life: 0.4, size: 3, color: col }); break;
      case 'wave': for (let i = 0; i < 3; i++) setTimeout(() => G.spawn({ x, y, type: 'ring', r0: 4, r1: 52, life: 0.6, size: 2, color: col }), i * 110); break;
      case 'pillar': G.spawn({ x, y: y + 26, type: 'pillar', w: 26, life: 0.8, color: col, a: 0.95 }); G.spawn({ x, y: y + 26, type: 'pillar', w: 8, life: 0.9, color: '#fff', a: 0.9 }); for (let i = 0; i < 20; i++) G.spawn({ x: x + (Math.random() - 0.5) * 30, y: y + 20, vy: -60 - Math.random() * 140, life: 0.8, size: 1, color: col, type: 'spark' }); G.shake(260); break;
      case 'glyph': for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28; G.spawn({ x: x + Math.cos(a) * 20, y: y + Math.sin(a) * 12, vx: -Math.sin(a) * 30, vy: -18, life: 0.8, size: 1.6, color: col, type: 'glyph' }); } G.spawn({ x, y, type: 'ring', r0: 22, r1: 8, life: 0.6, size: 1.5, color: col }); break;
      case 'heal': for (let i = 0; i < 16; i++) G.spawn({ x: x + (Math.random() - 0.5) * 24, y: y + 18, vy: -30 - Math.random() * 40, life: 0.9, size: 1, color: i % 2 ? col : '#eaffea', type: 'mote' }); G.spawn({ x, y, type: 'glow', size: 4, life: 0.6, color: col }); break;
      case 'guard': G.spawn({ x, y, type: 'ring', r0: 18, r1: 22, life: 0.5, size: 2.5, color: col }); G.spawn({ x, y, type: 'ring', r0: 12, r1: 15, life: 0.4, size: 1.5, color: '#fff' }); break;
      case 'dark': for (let i = 0; i < 14; i++) { const a = Math.random() * 6.28, d = 34 + Math.random() * 20; G.spawn({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: -Math.cos(a) * 130, vy: -Math.sin(a) * 130, life: 0.3, size: 1.4, color: col, type: 'spark' }); } G.spawn({ x, y, type: 'ring', r0: 34, r1: 4, life: 0.32, size: 2.5, color: col }); break;
    }
  }
  function floater(e, text, cls) {
    const p = pos(e), f = I.el('div', 'fl ' + (cls || ''), String(text));
    f.style.left = pctX(p.x + (Math.random() - 0.5) * 14); f.style.top = ((p.y - 6 - (e._fl = ((e._fl || 0) + 1) % 3) * 9) / G.PH * 100) + '%';
    $('#floaters').appendChild(f); setTimeout(() => f.remove(), 1100);
    // 2.20 — un mot posé sur celui qui est au bord de l'image (le dernier du groupe, en hauteur) reste entier : il glisse vers
    // l'intérieur, sans quitter sa cible (sa largeur, à sa plus grande taille dans l'animation « fl » : × 1,15)
    const L = f.parentNode.clientWidth, x = parseFloat(f.style.left) / 100 * L, demi = f.offsetWidth * 0.58, m = 4;
    if (L && x - demi < m) f.style.marginLeft = (m - (x - demi)) + 'px'; else if (L && x + demi > L - m) f.style.marginLeft = ((L - m) - (x + demi)) + 'px';
  }
  const readTime = txt => I.clamp(1800 + I.langue.poids(txt) * 48, 2400, 7500);   // le poids d'un texte dépend de son écriture (langue.js)
  // 2.17 — les messages du combat se posent en bas (demande du décideur, 19 novembre : « Les messages au moment du combat
  // doivent être en bas pas sur les personnages »). Le bandeau est dans le panneau, dans la case des commandes (style.css) :
  // en hauteur, sous les rangées du groupe, hors de la scène ; en largeur, au pied de la scène, sous les combattants. Un
  // bandeau qui attend un toucher (`wait`, .attend) n'est pas recouvert par un bandeau de passage. Un guillemet ne reste pas
  // seul au bout d'une ligne : l'espace qui le suit (ou le précède) devient insécable.
  let bannerT = null, attend = false;
  function banner(html, ms, wait, cls) {
    const b = $('#battle .banner'); if (attend && !wait && !b.hidden) return Promise.resolve();
    b.className = 'banner ' + (cls || '') + (wait ? ' attend' : ''); b.innerHTML = String(html).replace(/« /g, '«\u00a0').replace(/ »/g, '\u00a0»'); b.dir = I.langue.sens(b.textContent); b.hidden = false; clearTimeout(bannerT); attend = !!wait; placer(b);
    const hide = () => { b.hidden = true; attend = false; };
    if (!wait) { bannerT = setTimeout(hide, ms / Math.min(I.speed, 3)); return Promise.resolve(); }
    return I.input.waitTimed(['ok', 'cancel'], ms, 450).then(hide);
  }
  // En largeur et au bureau, le panneau est posé sur le bas de la scène : si le bandeau y montait jusqu'à une figure (ou
  // jusqu'au champ d'une bataille déclarée), il prend toute la largeur du panneau (.large), puis resserre ses caractères,
  // cran par cran, jamais sous dix points et demi. En hauteur, il est sous la scène : il tient dans l'écran, et défile au-delà.
  function placer(b) {
    b.classList.remove('large'); b.style.fontSize = ''; b.style.maxHeight = '';
    const haut = document.body.classList.contains('portrait'), cv = $('#cv').getBoundingClientRect(), k = cv.width / G.PW;
    const corps = haut ? [] : boites().map(q => [cv.left + q.x * k, cv.top + q.y * k, cv.left + (q.x + q.w) * k, cv.top + (q.y + q.h) * k]);
    const bas = innerHeight - ((I.ui && I.ui.padBas) || 0);   // 2.17 : en hauteur, la bande du bas est à la manette
    const gene = () => { const r = b.getBoundingClientRect(); return r.bottom > bas - 2 || corps.some(q => r.left < q[2] && r.right > q[0] && r.top < q[3] && r.bottom > q[1]); };
    if (!gene()) return;
    if (!haut) { b.classList.add('large'); if (!gene()) return; }
    const f0 = parseFloat(getComputedStyle(b).fontSize);
    for (const f of [0.92, 0.85, 0.78, 0.72]) { if (f0 * f < 10.5) break; b.style.fontSize = (f0 * f).toFixed(2) + 'px'; if (!gene()) return; }
    if (haut) b.style.maxHeight = Math.max(48, bas - b.getBoundingClientRect().top - 6) + 'px';
  }
  // le rectangle de chaque figure sur la scène, en points du canevas : une chimère avec son souffle (trois points), un héros
  // debout ou éprouvé, le compagnon de lumière ; le temps d'un ordre ou d'un pas d'une bataille déclarée, le champ, qui
  // remplace alors la scène. Le bandeau s'en écarte (placer) ; loupe.js les relève.
  function boites() {
    if (!C) return [];
    if (C.champ && C.champ.vue) { const k = I.rangs.cadre(C.champ); return [{ qui: 'champ', x: k.x, y: k.y, w: k.w, h: k.h }]; }
    const L = C.all.filter(e => e.side === 'hero' || (e.alive && e.fade > 0)).map(e => e.side === 'foe' ? { qui: e.name, camp: 'foe', x: e.x + e.ox - e.size / 2, y: e.y - e.size - 9, w: e.size, h: e.size + 6 } : { qui: e.name, camp: 'hero', x: e.x + e.ox - 16, y: e.y - 46, w: 32, h: 50 });
    if (C.bete) { const h0 = C.all.find(e => e.side === 'hero'), im = I.oeuvres.bete(C.bete); if (h0 && im) L.push({ qui: 'bete', x: h0.x + 26 - im.width / 2, y: h0.y - 60, w: im.width, h: im.height + 4 }); }
    (C.temoins || []).forEach((m, i) => L.push({ qui: 'temoin' + i, camp: 'temoin', x: bx(m.x0) - 16, y: m.y - 46, w: 32, h: 50 })); // 2.32 : les témoins (aucun n'est une cible)
    return L;
  }
  B.boites = boites;
  B.dire = (html, ms, wait, cls) => C ? banner(html, ms, wait, cls) : Promise.resolve(); // un message du combat, posé comme le jeu le pose : pour les outils de contrôle (loupe.js)
  // 2.17 — une chimère dévoilée, un mal tranché ou repoussé : le mot passe en bas, avec le nom (sa plaque le dit aussi) ; ceux
  // qui tombent ensemble — un coup qui porte sur tous — se disent sur la même ligne
  let devT = 0, devM = '', devN = [];
  function devoile(e, mot) {
    const t = performance.now(); if (t - devT > 400 || mot !== devM) devN = []; devT = t; devM = mot; if (!devN.includes(e.name)) devN.push(e.name);
    banner(`<small>${devN.map(n => I.esc(n)).join(' · ')}</small>${mot}`, 1300, false, 'break');
  }

  function refresh() {
    if (!C) return;
    { const fr = $('#battle .front'), ch = C.champ, bt = $('#battle'); bt.classList.toggle('champ', !!(ch && ch.vue)); bt.classList.toggle('ordre', !!(ch && ch.vue && ch.menu)); if (fr) { fr.hidden = !ch || ch.vue; if (ch && !ch.vue) fr.innerHTML = I.rangs.bande(C); } }
    // ordre des tours (simulation) ; 2.20 : un tour qui a reculé (D.TEMPS) est marqué jusqu'à ce qu'il arrive (.rec)
    const sim = C.all.filter(e => e.alive).map(e => ({ e, ct: e === C.active ? -1 : e.ct })); const ord = [];
    for (let i = 0; i < 8 && sim.length; i++) { sim.sort((a, b) => a.ct - b.ct); const s = sim[0]; ord.push(s.e); const d = Math.max(0, s.ct); sim.forEach(x => x.ct -= d); s.ct = 1000 / eff(s.e, 'spd'); }
    $('#battle .order').innerHTML = '<span class="olab">' + I.t('Tours') + '</span>' + ord.map((e, i) => `<i class="${e.side}${i === 0 ? ' now' : ''}${e.broken ? ' brk' : ''}${e.st.recul ? ' rec' : ''}" style="--c:${e.side === 'hero' ? e.ray || e.color : `hsl(${e.def.hue},80%,62%)`}">${I.esc(I.langue.initiales(e.name))}</i>`).join('');
    // plaques ennemies
    const pl = $('#battle .plates'); pl.innerHTML = '';
    C.all.filter(e => e.side === 'foe' && e.alive).forEach(e => {
      const weak = e.def.weak.map(w => e.known[w] ? `<i style="color:${D.ELEMENTS[w].color}" title="${D.ELEMENTS[w].name}">${D.ELEMENTS[w].glyph}</i>` : '<i class="unk">?</i>').join('') + (e.def.immune || []).filter(w => e.known[w] === 'x').map(w => `<i class="imm" title="${I.t('Insensible : {element}', { element: D.ELEMENTS[w].name })}">${D.ELEMENTS[w].glyph}</i>`).join('');
      const sts = Object.keys(e.buffs).map(k => `<b class="${e.buffs[k].v > 0 ? 'up' : 'dn'}">${I.t(STN[k === 'df' ? 'def' : k])}${e.buffs[k].v > 0 ? '▲' : '▼'}</b>`).join('') + Object.keys(e.st).map(k => `<b class="dn">${I.t(STN[k] || k)}</b>`).join('');
      const d = I.el('button', 'plate' + (C.cursor === e ? ' cur' : '') + (e.broken ? ' brk' : ''), `<span class="nm">${I.esc(e.name)}</span><span class="bar"><i style="width:${Math.max(0, e.hp / e.max.hp * 100)}%"></i></span><span class="row"><span class="veil">${e.broken ? I.t('DÉVOILÉ') : '⛊ ' + e.veils}</span><span class="wk">${weak}</span></span>${sts ? `<span class="sts">${sts}</span>` : ''}`);
      d.type = 'button'; d.style.left = pctX(e.x); d.style.top = (Math.max(44, e.y - e.size - 4) / G.PH * 100) + '%';
      d.onclick = ev => { ev.stopPropagation(); if (C.pickCb) C.pickCb(e); };
      pl.appendChild(d);
    });
    // héros
    const hb = $('#battle .heroes'); hb.innerHTML = '';
    C.all.filter(e => e.side === 'hero').forEach(e => {
      let pips = ''; if (!I.lecons || I.lecons.voit('niyya')) for (let i = 0; i < 5; i++) pips += `<i class="pip${i < e.niyya ? ' on' : ''}"></i>`; // la Niyya ne se montre qu'une fois reçue (lecons.js)
      const sts = Object.keys(e.buffs).map(k => `<b class="${e.buffs[k].v > 0 ? 'up' : 'dn'}">${I.t(STN[k === 'df' ? 'def' : k])}${e.buffs[k].v > 0 ? '▲' : '▼'}</b>`).join('') + Object.keys(e.st).map(k => `<b class="${BIEN.includes(k) ? 'up' : 'dn'}">${I.t(STN[k] || k)}</b>`).join('');
      const r = I.el('button', 'hrow' + (e === C.active ? ' act' : '') + (e.alive ? '' : ' ko') + (C.cursor === e ? ' cur' : ''),
        `<span class="hs" style="background-image:url(${G.sealURL(e.def.arabic, e.ray || e.color)})"></span><span class="hn"><b style="color:${e.ray || e.color}">${I.esc(e.name)}</b><small><span class="nv">${I.t('Niv. {n}', { n: e.ref.lvl })}${e.posture && I.postures.offertes() ? ' · ' + D.POSTURES[e.posture].court : ''}</span> ${sts}</small></span>
         <span class="hbars"><span class="bar hp"><i style="width:${e.hp / e.max.hp * 100}%"></i><em>${e.alive ? Math.ceil(e.hp) : I.t('Éprouvé')}</em></span><span class="bar sp"><i style="width:${e.max.sp ? e.sp / e.max.sp * 100 : 0}%"></i><em>${e.sp}</em></span></span>
         <span class="hx"><span class="pips">${pips}</span><span class="bar sk${e.sakina >= 100 ? ' full' : ''}"><i style="width:${e.sakina}%"></i></span></span>`);
      r.type = 'button'; r.onclick = ev => { ev.stopPropagation(); if (C.pickCb) C.pickCb(e); };
      hb.appendChild(r);
    });
  }

  B.scene = {
    update(dt) { if (C) { C.t += dt; if (C.champ) I.rangs.maj(C, dt); C.all.forEach(e => { if (e.flash > 0) e.flash -= dt * 4; if (e.shake > 0) e.shake -= dt; }); } },
    render() {
      const c = G.px; if (!C) { c.fillStyle = '#000'; c.fillRect(0, 0, G.PW, G.PH); return {}; }
      const t = C.t, lights = [];
      if (C.champ && C.champ.vue) return I.rangs.dessine(C, c, t); // le champ de bataille, le temps d'un ordre ou d'un pas
      if (C.bg.couches) { c.drawImage(C.bg.couches.arr, 0, 0); rames(c, t); c.drawImage(C.bg.couches.av, 0, 0); } else { c.drawImage(C.bg, 0, 0); drawGrid(c, C.hue, t); } // la Cité : ses rames passent, ses joints ne défilent pas
      if (C.champ) I.rangs.masse(C, c, t); // nos rangs, derrière le groupe
      // 2.32 (D224) : les témoins, à l'écart, tournés vers le combat — immobiles, un souffle seulement ; ombrés, plus loin que lui
      (C.temoins || []).forEach(m => { const x = bx(m.x0), y = m.y; c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(x, y + 1, 10, 3, 0, 0, 6.3); c.fill();
        c.globalAlpha = 0.92; c.drawImage(G.figure(m.look, 2, 0, null), x - 16, y - 46 + (Math.sin(t * 1.6 + m.ph) > 0.6 ? -1 : 0)); c.globalAlpha = 1; });
      const list = C.all.slice().sort((a, b) => a.y - b.y);
      for (const e of list) {
        const jx = e.shake > 0 ? (Math.random() - 0.5) * 4 : 0;
        if (e.side === 'foe') {
          if (e.fade <= 0) continue;
          const bob = e.broken ? 0 : Math.sin(t * 1.8 + e.ph) * 3, x = Math.round(e.x + e.ox + jx - e.size / 2), y = Math.round(e.y - e.size + bob - 6);
          c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(e.x + e.ox, e.y + 2, e.size * 0.36, e.size * 0.09, 0, 0, 6.3); c.fill();
          c.globalAlpha = e.fade * (e.broken ? 0.75 : 1); c.drawImage(e.spr, x, y);
          if (e.broken) { c.globalCompositeOperation = 'source-atop'; c.globalAlpha = 1; }
          if (e.flash > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, e.flash); c.drawImage(e.spr, x, y); }
          c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
          // glitch d'égrégore
          if (!e.broken && Math.random() < 0.05) { const sy = Math.floor(Math.random() * e.size), hh = 2 + Math.floor(Math.random() * 4); c.drawImage(e.spr, 0, sy, e.size, hh, x + (Math.random() < 0.5 ? -4 : 4), y + sy, e.size, hh); }
          lights.push({ x: e.x + e.ox, y: e.y - e.size * 0.5, r: e.size * 0.9, color: `hsl(${e.def.hue},90%,${e.broken ? 30 : 55}%)`, a: e.fade * 0.9 });
          if (C.cursor === e) cursor(c, e.x + e.ox, y - 4, t);
        } else {
          const x = Math.round(e.x + e.ox + jx), y = Math.round(e.y), act = C.active === e;
          c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(x, y + 1, 12, 4, 0, 0, 6.3); c.fill();
          const look = e.sheet.look;
          if (!e.alive) { c.globalAlpha = 0.62; c.drawImage(G.figure(look, 1, 0, 'accable'), x - 16, y - 46); c.globalAlpha = 1; }
          else {
            // il marche quand il s'avance ou revient ; sinon il respire — plus vite quand c'est à lui (le dessin d'origine garde son piétinement)
            const fin2 = G.D > 1 && G.natif, f = e.marche ? [1, 0, 2, 0][Math.floor(t * 11) % 4] : fin2 ? (Math.sin(t * (act ? 5.2 : 2.2) + e.x) > 0.3 ? 3 : 0) : act ? [1, 0, 2, 0][Math.floor(t * 6) % 4] : 0, bob = fin2 || act ? 0 : Math.round(Math.sin(t * 2 + e.x) * 0.6);
            const pose = e.pose || (e.st.garde ? 'garde' : (!act && e.hp / e.max.hp < 0.2) ? 'accable' : null), img = G.figure(look, 1, pose && !e.marche ? 0 : f, e.marche ? null : pose);
            const gs = e.geste; if (!(gs && G.frappe && G.frappe(c, look, 1, x - 16, y - 46, gs, (performance.now() - gs.t0) / 1000 * I.speed, 'combat')))
            c.drawImage(img, x - 16, y - 46 + bob);
            if (e.flash > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, e.flash) * 0.8; c.drawImage(img, x - 16, y - 46 + bob); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; }
            if (e.st.garde) { c.strokeStyle = e.color; c.lineWidth = 1; c.beginPath(); c.ellipse(x - 14, y - 24, 4, 20, 0, 0, 6.3); c.stroke(); }
            lights.push({ x, y: y - 26, r: act ? 46 : 32, color: e.color, a: act ? 0.9 : 0.5 });
            if (G.D > 1 && look.rayon && e.alive) lights.push({ x: x - 3, y: y - 38, r: 15, color: look.rayon, a: 0.55 }); // son visage rayonne de la couleur qui lui est propre
            if (e.sakina >= 100 && Math.random() < 0.3) G.spawn({ x: x + (Math.random() - 0.5) * 18, y: y - 4, vy: -30, life: 0.9, size: 0.8, color: e.color, type: 'mote' });
          }
          if (C.cursor === e) cursor(c, x, y - 52, t);
          if (act && e.alive) { c.fillStyle = e.ray || e.color; c.fillRect(x - 10, y + 4, 20, 1); }
        }
      }
      if (C.bete) { const im = I.oeuvres.bete(C.bete), h0 = C.all.find(e => e.side === 'hero'), bx = Math.round(h0.x + 26), by = Math.round(h0.y - 58 + Math.sin(t * 2.2) * 2); c.globalAlpha = 0.9; c.drawImage(im, bx - Math.round(im.width / 2), by); c.globalAlpha = 1; lights.push({ x: bx, y: by + 6, r: 30, color: I.sagas.coeur.animaux[C.bete].couleur, a: 0.8 }); if (Math.random() < 0.12) G.spawn({ x: bx + (Math.random() - 0.5) * 20, y: by + 8, vy: -8, life: 1.2, size: 0.6, color: '#fff', type: 'mote' }); }
      return { ambient: v15 ? '#9a94e0' : ['#e4a888', '#b098c8'], lights, bloom: 0.34, scan: true, grade: [`hsl(${C.hue},80%,50%)`, v15 ? 0.14 : 0.08], vignette: 0.62, tilt: false };
    }
  };
  function cursor(c, x, y, t) { const b = Math.sin(t * 8) * 2; c.fillStyle = '#1a1420'; c.beginPath(); c.moveTo(x - 6, y - 9 + b); c.lineTo(x + 6, y - 9 + b); c.lineTo(x, y + 1 + b); c.fill(); c.fillStyle = '#ffe08a'; c.beginPath(); c.moveTo(x - 4, y - 8 + b); c.lineTo(x + 4, y - 8 + b); c.lineTo(x, y - 1 + b); c.fill(); }
})();
