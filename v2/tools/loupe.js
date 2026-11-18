#!/usr/bin/env node
/* ISNAD 2.x — la loupe : sur un téléphone, l'image s'agrandit et le texte se lit (src/core/ui.js, « l'agrandissement de
   l'image » ; src/style.css, « écran tactile »).
   Usage : node tools/loupe.js
   Sur un écran tactile de téléphone, tenu en hauteur puis en largeur, par les vrais gestes :
   1. sans choix du joueur, l'image est agrandie — une fois et demie en hauteur, une fois et quart en largeur — et le
      texte est « grand » ; rien n'est écrit dans les réglages ;
   2. deux doigts qui s'écartent agrandissent l'image, deux doigts qui se rapprochent la rendent entière ; le pincement ne
      fait marcher personne ; l'agrandissement est gardé ;
   3. le bouton « × » fait le tour des grandeurs ;
   4. à × 2, toucher une case y mène le héros — le toucher tombe juste —, et les étiquettes sont sur leurs personnages ;
   5. le combat garde son cadrage ; au retour, l'image retrouve son agrandissement ; une page rechargée aussi ;
   6. sur la carte, dans un dialogue, en combat et à la halte, aucun texte n'est plus petit que dix points.
   Sortie : « OK » par preuve, puis « LOUPE CONFORME ». Sinon « ÉCART » (une grandeur attendue n'y est pas),
   « INACCESSIBLE » (le toucher ne mène pas où il faut), « INVISIBLE » (un texte trop petit pour être lu). Code 1 à la
   première anomalie. Captures dans .smoke/loupe. */
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/loupe'), url = 'file://' + path.resolve(V2, process.env.JEU || 'index.html');
const PLANCHER = 10; // points : en dessous, un texte ne se lit plus sur un téléphone
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = (mot, m) => { anomalies++; console.log(mot + ' ' + m); }, dit = (v, mot, m) => (v ? ok(m) : ko(mot, m));

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(), errors = [];
  for (const [nom, cle, vp] of [['en hauteur', 'haut', { width: 390, height: 760 }], ['en largeur', 'large', { width: 844, height: 390 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }), p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
    p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForTimeout(1600);
    const shot = n => p.screenshot({ path: path.join(out, `${cle}-${n}.png`) }), office = cle === 'haut' ? 1.5 : 1.25, fr = z => '× ' + String(z).replace('.', ',');
    // un carton ou un dialogue : valider ; un choix : sa dernière option (« pas maintenant »)
    const entree = async () => { if (await p.evaluate(() => { const c = document.querySelector('#choice'); if (c && !c.hidden) { const o = c.querySelectorAll('.opt'); if (o.length) { o[o.length - 1].click(); return false; } } return ['#card', '#dialog'].some(q => { const e = document.querySelector(q); return e && !e.hidden; }); })) await p.keyboard.press('Enter'); };
    const calme = async (n = 80) => { for (let i = 0; i < n && await p.evaluate(() => window.ISNAD.script.busy || window.ISNAD.world.lock); i++) { await entree(); await p.waitForTimeout(160); } await p.waitForTimeout(250); };
    // les textes trop petits : tout élément visible qui porte lui-même du texte
    const petits = () => p.evaluate(seuil => { const vus = [], racines = [document.getElementById('ui')].concat([...document.querySelectorAll('.screen')].filter(e => !e.hidden));
      racines.forEach(r => r.querySelectorAll('*').forEach(el => { if (!el.getClientRects().length || el.closest('[hidden]')) return; const st = getComputedStyle(el); if (st.visibility === 'hidden' || +st.opacity < 0.1) return;
        const t = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(); if (t.length < 2) return; const fs2 = parseFloat(st.fontSize); if (fs2 < seuil) vus.push(`« ${t.slice(0, 28)} » ${fs2.toFixed(1)} (${el.id ? '#' + el.id : el.className ? '.' + String(el.className).split(' ')[0] : el.tagName.toLowerCase()})`); })); return [...new Set(vus)]; }, PLANCHER);
    const lisible = async ou => { const l = await petits(); dit(!l.length, 'INVISIBLE', `${nom} · ${ou} : ${l.length ? 'texte(s) sous ' + PLANCHER + ' points — ' + l.slice(0, 6).join(' · ') : 'aucun texte sous ' + PLANCHER + ' points'}`); };
    // 2.08 : les réglages sont rangés derrière « Réglages » ; on les ouvre, on les lit, puis on revient à l'essentiel
    const reglages = () => p.evaluate(() => { const r = [...document.querySelectorAll('#title .vmenu button')].find(x => /^Réglages/.test(x.textContent)); if (r) r.click(); return [...document.querySelectorAll('#title .vmenu button')].map(b => b.textContent); });
    const titre = (await reglages()).filter(t => /Image|Texte/.test(t));
    dit(titre.some(t => /Texte : grand/.test(t)) && titre.some(t => t === 'Image : ' + fr(office)), 'ÉCART', `${nom} · écran-titre : ${titre.join(' · ') || 'ni « Texte » ni « Image »'}`);
    await lisible('écran-titre, réglages'); await shot('1-titre-reglages');
    await p.evaluate(() => { const r = [...document.querySelectorAll('#title .vmenu button')].find(x => /Retour/.test(x.textContent)); if (r) r.click(); }); await p.waitForTimeout(200);
    const essentiel = await p.evaluate(() => [...document.querySelectorAll('#title .vmenu button')].map(b => b.textContent));
    dit(essentiel.some(t => /^Nouvelle partie/.test(t)) && essentiel.some(t => /^Réglages/.test(t)) && !essentiel.some(t => /^(Son|Musique|Dessin|Rendu|Texte|Image)/.test(t)), 'ÉCART', `${nom} · écran-titre : l'essentiel seulement (${essentiel.join(' · ')})`);
    await lisible('écran-titre'); await shot('1-titre');
    await p.evaluate(() => { const I = window.ISNAD; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => e.hidden = true); document.body.classList.remove('in-screen'); I.input.reset();
      I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter('khalid', 2); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); });
    await p.waitForTimeout(1800); await calme(); await p.waitForTimeout(400); await calme(); await p.waitForTimeout(600);
    const etat = () => p.evaluate(() => { const I = window.ISNAD, U = I.ui, W = I.world, G = I.gfx, st = document.getElementById('stage').getBoundingClientRect(); return { zf: U.zf, Z: U.Z, garde: I.save.data.opts.zoom, tz: I.save.data.opts.tz, x: Math.round(W.player.x), y: Math.round(W.player.y), dest: !!W.dest, vue: [G.view.x, G.view.y, +G.view.w.toFixed(1), +G.view.h.toFixed(1)], st: [st.left, st.top, st.width, st.height], bouton: document.getElementById('zoombtn').textContent, tr: document.getElementById('cv').style.transform, scale: U.scale, perso: Math.round(24 * U.scale) }; });
    // 1. sans choix du joueur
    const e0 = await etat(); dit(e0.zf === office && e0.garde === undefined && e0.tz === undefined, 'ÉCART', `${nom} : sans choix du joueur, l'image est agrandie de ${e0.zf} — un personnage fait ${e0.perso} points de haut — et rien n'est écrit dans les réglages · bouton « ${e0.bouton} »`);
    await p.evaluate(() => window.ISNAD.script.toast('Reçu : <b>Épée de fer</b><br><small>Force +11 %</small>', 5000)); await p.waitForTimeout(350);   // une annonce, avec sa petite ligne
    await lisible('la carte, une annonce'); await shot('2-carte');
    // 2. le pincement
    const cx = e0.st[0] + e0.st[2] / 2, cy = e0.st[1] + e0.st[3] * 0.62;
    const pincer = async (d0, d1) => { const pts = d => [{ x: cx - d / 2, y: cy, id: 1 }, { x: cx + d / 2, y: cy, id: 2 }];
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pts(d0)[0]] }); await p.waitForTimeout(40);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts(d0) }); await p.waitForTimeout(40);
      for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pts(d0 + (d1 - d0) * i / 8) }); await p.waitForTimeout(30); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [pts(d1)[0]] }); await p.waitForTimeout(40);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(500); };
    await pincer(80, 150); const e1 = await etat();
    dit(Math.abs(e1.zf - office * 150 / 80) < 0.08 && e1.garde === e1.zf, 'ÉCART', `${nom} : deux doigts qui s'écartent (de 80 à 150 points) : × ${e1.zf}, gardé dans les réglages`);
    dit(e1.x === e0.x && e1.y === e0.y && !e1.dest, 'ÉCART', `${nom} : le pincement n'a fait marcher personne`);
    await shot('3-pince');
    await pincer(160, 50); const e2 = await etat();
    dit(e2.zf === 1 && !/scale/.test(e2.tr) && e2.vue[1] === 0 && e2.vue[3] === 216, 'ÉCART', `${nom} : deux doigts qui se rapprochent : × ${e2.zf}, l'image entière`);
    // 3. le bouton
    const suite = []; for (let i = 0; i < 4; i++) { await p.locator('#zoombtn').tap(); await p.waitForTimeout(250); suite.push((await etat()).zf); }
    dit(suite.join(' ') === '1.5 2 3 1', 'ÉCART', `${nom} : le bouton « × » fait le tour des grandeurs : ${suite.join(' → ')}`);
    // 4. à × 2 : toucher une case libre près du héros ; les étiquettes
    await p.evaluate(() => window.ISNAD.ui.zoomer(2)); await p.waitForTimeout(500);
    const cible = await p.evaluate(() => { const I = window.ISNAD, W = I.world, G = I.gfx, U = I.ui, m = W.map, T = 16, st = document.getElementById('stage').getBoundingClientRect(), px = Math.floor(W.player.x / T), py = Math.floor(W.player.y / T), loin = (l, r) => !l.some(q => Math.hypot(q[0] - r[0], q[1] - r[1]) < 28);
      const gens = W.npcs.filter(n => !n.hidden && n.map === m.id && n.placed).map(n => [n.x, n.y]), coffres = (W.chests || []).filter(c => c.map === m.id && c.placed).map(c => [c.x, c.y]), nattes = (W.prayerPts() || []).map(q => [q[0] * T + 8, q[1] * T + 8]);
      for (const [dx, dy] of [[-2, 1], [2, 1], [-2, 0], [2, 0], [0, 2], [-1, 2], [1, 2], [-3, 1], [3, 1], [-2, 2], [2, 2], [-3, 0], [3, 0], [0, 3], [-2, -1], [2, -1]]) { const x = px + dx, y = py + dy; if (x < 1 || y < 1 || x >= m.w - 1 || y >= m.h - 1 || m.solid[y * m.w + x]) continue;
        const c = [x * T + 8, y * T + 8]; if (!loin(gens, c) || !loin(coffres, c) || !loin(nattes, c)) continue;
        const wx = x * T + 8, wy = y * T + 9, sx = st.left + (wx - G.cale(W.cam.x) - G.view.x) * U.scale, sy = st.top + (wy - G.cale(W.cam.y) - G.view.y) * U.scale;
        if (sx < st.left + 12 || sx > st.right - 12 || sy < st.top + 70 || sy > st.bottom - 12) continue; return { wx, wy, sx, sy }; } return null; });
    if (!cible) ko('INACCESSIBLE', `${nom} : aucune case libre visible près du héros, à × 2`);
    else { await p.touchscreen.tap(cible.sx, cible.sy); await p.waitForTimeout(1700); const e3 = await etat(); dit(Math.hypot(e3.x - cible.wx, e3.y - cible.wy) < 12, 'INACCESSIBLE', `${nom} : à × 2, toucher la case (${cible.wx}, ${cible.wy}) y mène le héros — il est en (${e3.x}, ${e3.y})`); }
    await p.waitForTimeout(1200);
    const noms = await p.evaluate(() => { const I = window.ISNAD, W = I.world, G = I.gfx, U = I.ui, st = document.getElementById('stage').getBoundingClientRect(), l = [];
      document.querySelectorAll('#noms .nom').forEach(el => { const k = el.dataset.k, r = el.getBoundingClientRect(); const e = k[0] === 'n' ? W.npcs.find(n => 'n' + n.id === k) : (W.party.indexOf(k.slice(1)) === 0 ? W.player : null); if (!e) return;
        const sx = st.left + (e.x - Math.round(W.cam.x) - G.view.x) * U.scale, sy = st.top + (e.y - Math.round(W.cam.y) - G.view.y - 25) * U.scale; l.push([Math.round(r.left + r.width / 2 - sx), Math.round(r.bottom - sy)]); }); return l; });
    dit(noms.length > 0 && noms.every(q => Math.abs(q[0]) <= 3 && Math.abs(q[1]) <= 3), 'ÉCART', `${nom} : ${noms.length} étiquette(s), chacune sur son personnage (écarts en points : ${noms.map(q => q.join(',')).join(' · ') || '—'})`);
    await shot('4-fois-deux');
    // 6. un dialogue, lisible
    await p.evaluate(() => { window.ISNAD.script.run([['say', 'khalid', 'Nous tiendrons la passe jusqu’à l’aube. Que chacun garde son rang.']]); }); await p.waitForTimeout(900);
    await lisible('un dialogue'); await shot('5-dialogue'); await p.keyboard.press('Enter'); await p.waitForTimeout(250); await p.keyboard.press('Enter'); await calme(10);
    // 5. le combat garde son cadrage
    await p.evaluate(() => { const I = window.ISNAD; I.battle.start({ group: Object.keys(I.world.saga.enemies).slice(0, 1), bg: 'desert' }); });
    for (let i = 0; i < 60 && !(await p.evaluate(() => !!document.querySelector('#battle .cmd .mi'))); i++) { if (await p.evaluate(() => { const b = document.querySelector('#battle .banner'); return b && !b.hidden; })) await p.keyboard.press('Enter'); await p.waitForTimeout(300); }
    const e4 = await etat(); dit(e4.Z === 1 && e4.vue[1] === 0 && !/scale/.test(e4.tr), 'ÉCART', `${nom} : en combat, l'image garde son cadrage (× ${e4.Z})`);
    await lisible('un combat'); await shot('6-combat');
    await p.evaluate(() => { const I = window.ISNAD; I.debug.auto = true; I.speed = 40; }); for (let i = 0; i < 400 && await p.evaluate(() => window.ISNAD.battle.active); i++) { await p.keyboard.press('Enter'); await p.waitForTimeout(120); }
    await p.evaluate(() => { const I = window.ISNAD; I.debug.auto = false; I.speed = 1; }); await p.waitForTimeout(900); await calme(20); await p.waitForTimeout(500);
    const e5 = await etat(); dit(e5.Z === 2 && /scale\(2\)/.test(e5.tr), 'ÉCART', `${nom} : après le combat, l'image retrouve son agrandissement (× ${e5.Z})`);
    // la halte, lisible ; puis une page rechargée
    await p.evaluate(() => { window.ISNAD.ui.pause(); }); await p.waitForTimeout(700); await lisible('la halte'); await shot('7-halte');
    await p.reload(); await p.waitForTimeout(1500); const e6 = await p.evaluate(() => { const r = [...document.querySelectorAll('#title .vmenu button')].find(x => /^Réglages/.test(x.textContent)); if (r) r.click(); return { zf: window.ISNAD.ui.zf, t: [...document.querySelectorAll('#title .vmenu button')].map(b => b.textContent).filter(t => /Image/.test(t)) }; });
    dit(e6.zf === 2 && e6.t.some(t => /Image : × 2/.test(t)), 'ÉCART', `${nom} : page rechargée, l'agrandissement est resté (× ${e6.zf} · « ${e6.t.join('')} »)`);
    await ctx.close();
  }
  if (errors.length) ko('ÉCART', `erreur console : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`);
  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ LOUPE CONFORME — l’image s’agrandit, le toucher tombe juste, le texte se lit (captures dans .smoke/loupe)');
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
