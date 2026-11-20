#!/usr/bin/env node
/* ISNAD 2.x — la loupe : sur un téléphone, l'image s'agrandit et le texte se lit (src/core/ui.js, « l'agrandissement de
   l'image » ; src/style.css, « écran tactile »).
   Usage : node tools/loupe.js
   Sur un écran tactile de téléphone, tenu en hauteur puis en largeur, par les vrais gestes :
   1. sans choix du joueur, l'image est agrandie — une fois et demie en hauteur ; en largeur (2.18), elle remplit l'écran,
      où elle est déjà agrandie d'un cinquième : × 1 — et le texte est « grand » ; rien n'est écrit dans les réglages ;
   2. deux doigts qui s'écartent agrandissent l'image, deux doigts qui se rapprochent la rendent entière ; le pincement ne
      fait marcher personne ; l'agrandissement est gardé ;
   3. le bouton « × » fait le tour des grandeurs ;
   4. à × 2, toucher une case y mène le héros — le toucher tombe juste —, et les étiquettes sont sur leurs personnages ;
   5. le combat garde son cadrage, et chaque héros y a sa place (aucun point de sa silhouette sur celle d'un autre, vingt-six
      points au moins d'un centre à l'autre — en hauteur, aussi sur un téléphone plus élancé, où la scène est la plus
      étroite) ; au retour, l'image retrouve son agrandissement ; une page rechargée aussi ;
   6. sur la carte, dans un dialogue, en combat et à la halte, aucun texte n'est plus petit que dix points ;
   7. (2.17) les messages du combat se posent en bas, sur personne — en 390 × 844, 390 × 760, 360 × 640 et 844 × 390, en
      français et en arabe : chacun relevé au moment où il paraît (voir « messages », à la fin du fichier).
   Usage : node tools/loupe.js [messages] — « messages » : le 7 seulement (JEU=… pour l'éprouver sur un autre jeu assemblé).
   Sortie : « OK » par preuve, puis « LOUPE CONFORME ». Sinon « ÉCART » (une grandeur attendue n'y est pas),
   « INACCESSIBLE » (le toucher ne mène pas où il faut), « INVISIBLE » (un texte trop petit pour être lu, coupé, hors de
   l'écran ou sans fond), « RECOUVERT » (un message du combat sur une figure, une plaque, la frise des tours ou le champ),
   « ABSENT » (un message attendu ne paraît pas). Code 1 à la première anomalie. Captures dans .smoke/loupe. */
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/loupe'), url = 'file://' + path.resolve(V2, process.env.JEU || 'index.html');
const PLANCHER = 10; // points : en dessous, un texte ne se lit plus sur un téléphone
const SEUL = process.argv.includes('messages'); // « node tools/loupe.js messages » : les messages du combat seulement (7.)
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = (mot, m) => { anomalies++; console.log(mot + ' ' + m); }, dit = (v, mot, m) => (v ? ok(m) : ko(mot, m));

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(), errors = [];
  for (const [nom, cle, vp] of SEUL ? [] : [['en hauteur', 'haut', { width: 390, height: 760 }], ['en largeur', 'large', { width: 844, height: 390 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }), p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
    p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForTimeout(1600);
    // (2.18 : en largeur, l'image remplit l'écran — en 844 × 390, elle y est déjà agrandie d'un cinquième : × 1 d'office)
    const shot = n => p.screenshot({ path: path.join(out, `${cle}-${n}.png`) }), office = cle === 'haut' ? 1.5 : 1, fr = z => '× ' + String(z).replace('.', ',');
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
    await p.evaluate(() => { const S = window.ISNAD.script; S.filVide(); S.toast('Reçu : <b>Épée de fer</b><br><small>Force +11 %</small>', 5000); }); await p.waitForTimeout(350);   // une annonce, avec sa petite ligne (le fil vidé de ce que l'ouverture du chapitre y a laissé)
    // 2.12 (D189) : l'annonce passe dans le fil — la main est libre, elle s'y montre aussitôt ; ses petits textes ne descendent pas sous 10,5 points
    const fil = await p.evaluate(() => { const f = document.getElementById('toasts'), t = [...f.querySelectorAll('.toast')].find(e => !e.hidden && /Épée de fer/.test(e.textContent)); return { montre: f.classList.contains('montre') && !!t, petit: t ? Math.min(...[t, ...t.querySelectorAll('*')].filter(e => (e.textContent || '').trim()).map(e => parseFloat(getComputedStyle(e).fontSize))) : 0 }; });
    dit(fil.montre && fil.petit >= 10.5, fil.montre ? 'INVISIBLE' : 'ÉCART', `${nom} · le fil : l'annonce posée quand la main est libre se montre aussitôt${fil.montre ? `, son plus petit texte à ${fil.petit.toFixed(1)} points` : ' — elle n’est pas à l’écran'}`);
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
    // (2.18 : en largeur, l'image qui remplit l'écran montre toute sa largeur, et sa hauteur autant que l'écran le permet)
    dit(e2.zf === 1 && !/scale/.test(e2.tr) && (cle === 'haut' ? e2.vue[1] === 0 && e2.vue[3] === 216 : e2.vue[2] === 384 && Math.abs(e2.vue[3] - Math.min(216, e2.st[3] / e2.scale)) < 0.2), 'ÉCART', `${nom} : deux doigts qui se rapprochent : × ${e2.zf}, l'image entière${cle === 'haut' ? '' : ` en largeur (${e2.vue[2]} × ${e2.vue[3]} points)`}`);
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
    // 2.12 (D189) : une narration — son nom (« La Chaîne », en petites capitales) ne descend pas sous 10,5 points, en largeur non plus
    await p.evaluate(() => { window.ISNAD.script.run([['nar', 'Le jour se lève sur la passe.']]); }); await p.waitForTimeout(900);
    const nar = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#dialog .name')).fontSize));
    dit(nar >= 10.5, 'INVISIBLE', `${nom} · une narration : son nom à ${nar.toFixed(1)} points`); await shot('5b-narration');
    await p.keyboard.press('Enter'); await p.waitForTimeout(250); await p.keyboard.press('Enter'); await calme(10);
    // 5. le combat garde son cadrage
    await p.evaluate(() => { const I = window.ISNAD; I.battle.start({ group: Object.keys(I.world.saga.enemies).slice(0, 1), bg: 'desert' }); });
    for (let i = 0; i < 60 && !(await p.evaluate(() => !!document.querySelector('#battle .cmd .mi'))); i++) { if (await p.evaluate(() => { const b = document.querySelector('#battle .banner'); return b && !b.hidden; })) await p.keyboard.press('Enter'); await p.waitForTimeout(300); }
    const e4 = await etat(); dit(e4.Z === 1 && e4.vue[1] === 0 && !/scale/.test(e4.tr), 'ÉCART', `${nom} : en combat, l'image garde son cadrage (× ${e4.Z})`);
    // 2.16 — en combat, chaque héros a sa place : aucun point de la silhouette de l'un sur celle d'un autre (chaque figure
    // posée, point de figure par point de figure, là où le combat la pose), et vingt-six points au moins d'un centre au
    // centre voisin. Mesuré à la taille de l'essai puis, en hauteur, sur un téléphone plus élancé (390 × 844), où la scène
    // visible est la plus étroite (216 points). La 2.15, que le seuil d'avant (quatre points de recouvrement des boîtes)
    // laissait passer, y échoue : 22 et 23 points d'écart et 66 points en commun ici, 20 points et 202 en commun là-bas.
    const places = () => p.evaluate(() => { const I = window.ISNAD, W = I.world, G = I.gfx, h = I.battle.places().filter(e => e.camp === 'hero').sort((a, b) => a.x - b.x);
      const masque = e => { const im = G.figure(I.gear.look(W.hero(e.id)), 1, 0, null), q = im.hd || 1, d = im.getContext('2d').getImageData(0, 0, im.width, im.height).data, X = Math.round((e.x - 16) * q), Y = Math.round((e.y + 22 - 46) * q), m = new Set();
        for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) if (d[(y * im.width + x) * 4 + 3] > 40) m.add((X + x) + ',' + (Y + y)); return m; };
      const M = h.map(masque), communs = []; for (let i = 0; i < M.length; i++) for (let j = i + 1; j < M.length; j++) { let n = 0; M[i].forEach(k => { if (M[j].has(k)) n++; }); communs.push([h[i].nom, h[j].nom, n]); }
      return { vue: Math.round(G.view.w), n: h.length, communs, ecarts: h.slice(1).map((e, i) => [h[i].nom, e.nom, Math.round(e.x - h[i].x)]) }; });
    const sesPlaces = (r, ou) => dit(r.n >= 2 && r.communs.every(q => q[2] === 0) && r.ecarts.every(q => q[2] >= 26), 'ÉCART', `${nom}${ou} : en combat (scène visible de ${r.vue} points), ${r.n} héros, chacun à sa place — écarts ${r.ecarts.map(q => q[0] + ' / ' + q[1] + ' ' + q[2] + ' pt').join(' · ')} ; points de silhouette en commun ${r.communs.map(q => q[0] + ' / ' + q[1] + ' ' + q[2]).join(' · ')}`);
    sesPlaces(await places(), '');
    if (cle === 'haut') { await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(700); sesPlaces(await places(), ' · téléphone élancé, 390 × 844'); await p.setViewportSize(vp); await p.waitForTimeout(700); }
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
  await messages(browser, errors);
  if (errors.length) ko('ÉCART', `erreur console : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`);
  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ LOUPE CONFORME — l’image s’agrandit, le toucher tombe juste, le texte se lit (captures dans .smoke/loupe)');
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

/* 7. (2.17) Les messages du combat se posent en bas — demande du décideur, 19 novembre : « Les messages au moment du combat
   doivent être en bas pas sur les personnages. » Sur un téléphone tenu en hauteur (390 × 844, 390 × 760, 360 × 640) et en
   largeur (844 × 390), en français puis en arabe (l'autre sens d'écriture), un vrai combat de la Cité, joué par ses boutons
   dans une partie neuve : son introduction (celle de la capture du décideur), la leçon d'une commande nouvelle (« Vertus »),
   l'annonce d'une vertu, le dévoilement de la chimère, la victoire ; puis, posés comme le jeu les pose (battle.dire), les
   autres bandeaux avec leurs vrais textes — la plus longue parole d'une chimère de toutes les sagas, la Sérénité, une
   chimère qui agit, l'épreuve du cœur, le secours, la besace vide ; enfin un vrai combat d'idole de bataille déclarée
   (Yarmoûk), son champ à l'écran et le bandeau d'un flanc découvert. Pour chaque message, au moment où il est là : son
   rectangle ne coupe celui d'aucune figure (héros, chimère, compagnon de lumière : battle.boites), d'aucune plaque (le nom
   et la jauge de voiles), ni la frise des tours, ni le champ d'une bataille déclarée — sinon « RECOUVERT » ; il est dans
   l'écran, entier, sur un fond qui le porte, et aucun de ses textes n'est sous dix points — sinon « INVISIBLE ». Les
   chiffres qui sautent au-dessus d'une cible (dégâts, soins) et les petits mots d'état (« Garde », « Étourdi »…) ne sont pas
   des messages : ils désignent leur cible, et y restent. Sur un jeu d'avant la 2.17 (JEU=… node tools/loupe.js messages),
   les figures sont relevées par battle.places, et ce qui ne se pose pas sans battle.dire n'est pas éprouvé.
   Captures : .smoke/loupe/messages-<langue>-<taille>-<n>.png (CAPTURES=dossier : ailleurs). */
async function messages(browser, errors) {
  const TAILLES = [[390, 844], [390, 760], [360, 640], [844, 390]], dossier = process.env.CAPTURES ? path.resolve(process.env.CAPTURES) : out;
  fs.mkdirSync(dossier, { recursive: true });
  for (const lang of ['fr', 'ar']) for (const [w, h] of TAILLES) {
    const sens = h > w ? 'en hauteur' : 'en largeur', T = `${lang} ${w} × ${h} ${sens}`, cle = `${lang}-${w}x${h}`;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }), p = await ctx.newPage();
    p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    // le relevé, dans la page, au moment même : chaque message à l'écran, et ce qu'il ne doit pas couvrir
    await p.addInitScript(() => { window.__releve = function (genre) {
      const I = window.ISNAD, B = I.battle, G = I.gfx, cv = document.querySelector('#cv').getBoundingClientRect(), k = cv.width / G.PW, E = q => [cv.left + q.x * k, cv.top + q.y * k, cv.left + (q.x + q.w) * k, cv.top + (q.y + q.h) * k];
      const vis = e => !!e && !e.hidden && !e.closest('[hidden]') && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.1, R = e => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; };
      let figures = B.boites ? B.boites().map(q => ({ quoi: q.qui === 'champ' ? 'le champ de la bataille' : q.qui === 'bete' ? 'le compagnon de lumière' : q.qui, r: E(q) })) : null;
      if (!figures) { const ch = B.champ && B.champ(); // un jeu d'avant la 2.17 : les figures d'après battle.places, le champ d'après rangs.cadre
        if (ch && ch.vue) { const c = I.rangs.cadre(ch); figures = [{ quoi: 'le champ de la bataille', r: E({ x: c.x, y: c.y, w: c.w, h: c.h }) }]; }
        else figures = B.places().map(e => { if (e.camp === 'hero') return { quoi: e.nom, r: E({ x: e.x - 16, y: e.y - 24, w: 32, h: 50 }) }; const d = Object.values(I.world.saga.enemies).concat(Object.values((I.common || {}).enemies || {})).find(q => q.name === e.nom) || {}, sc = d.scale || (d.tier === 'boss' ? 3 : d.tier === 'elite' ? 2 : 1), s = sc >= 3 ? 112 : sc === 2 ? 80 : 52; return { quoi: e.nom, r: E({ x: e.x - s / 2, y: e.y - s / 2 - 3, w: s, h: s + 6 }) }; }); }
      const obst = figures.concat([...document.querySelectorAll('#battle .plate')].filter(vis).map(e => ({ quoi: 'la plaque « ' + e.querySelector('.nm').textContent + ' »', r: R(e) })), vis(document.querySelector('#battle .order')) ? [{ quoi: 'la frise des tours', r: R(document.querySelector('#battle .order')) }] : []);
      const msgs = [], b = document.querySelector('#battle .banner'), l = document.querySelector('#battle .cmd .mlecon'), c = document.querySelector('#card');
      if (vis(b)) msgs.push({ quoi: 'le bandeau', el: b }); if (vis(l)) msgs.push({ quoi: 'la leçon', el: l }); if (vis(c) && c.classList.contains('on')) msgs.push({ quoi: 'le carton', el: c });
      document.querySelectorAll('#floaters .fl.break').forEach(f => { if (vis(f)) msgs.push({ quoi: 'le mot « ' + f.textContent + ' »', el: f }); });
      const croise = (a, q) => Math.max(0, Math.min(a[2], q[2]) - Math.max(a[0], q[0])) * Math.max(0, Math.min(a[3], q[3]) - Math.max(a[1], q[1]));
      const fond = e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const st = getComputedStyle(x), m = /rgba?\(([^)]+)\)/.exec(st.backgroundColor), a = m ? m[1].split(',').map(Number) : null; if (a && (a.length < 4 || a[3] >= 0.85)) return a.length < 4 ? 1 : a[3]; if (/gradient/.test(st.backgroundImage)) return 0.9; } return 0; };
      return { genre, msgs: msgs.map(m => { const r = R(m.el), tailles = [m.el, ...m.el.querySelectorAll('*')].filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 0) && vis(x)).map(x => parseFloat(getComputedStyle(x).fontSize));
        return { quoi: m.quoi, texte: m.el.textContent.replace(/\s+/g, ' ').trim().slice(0, 64), r: r.map(Math.round), couvre: obst.filter(o => croise(r, o.r) > 1).map(o => o.quoi), petit: Math.min(...tailles, 99), dehors: r[0] < -1 || r[1] < -1 || r[2] > innerWidth + 1 || r[3] > innerHeight + 1, coupe: m.el.scrollWidth > m.el.clientWidth + 1 || (m.quoi !== 'le carton' && m.el.scrollHeight > m.el.clientHeight + 2), fond: fond(m.el) }; }) };
    }; });
    await p.goto(url + (lang === 'fr' ? '' : '?lang=' + lang)); await p.waitForTimeout(1600);
    const shot = n => p.screenshot({ path: path.join(dossier, `messages-${cle}-${n}.png`) }), emit = a => p.evaluate(a => window.ISNAD.input.emit(a), a);
    const attendre = async (f, arg, ms = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const r = await p.evaluate(f, arg); if (r) return r; await p.waitForTimeout(40); } return null; };
    const calme = async () => { for (let i = 0; i < 80 && await p.evaluate(() => window.ISNAD.script.busy || window.ISNAD.world.lock); i++) { await p.evaluate(() => { const c = document.querySelector('#choice'); if (c && !c.hidden) { const o = c.querySelectorAll('.opt'); if (o.length) o[o.length - 1].click(); } else window.ISNAD.input.emit('ok'); }); await p.waitForTimeout(160); } await p.waitForTimeout(250); };
    const ouvrir = (saga, ci) => p.evaluate(([saga, ci]) => { const I = window.ISNAD; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => e.hidden = true); document.body.classList.remove('in-screen'); I.input.reset();
      I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter(saga, ci); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); }, [saga, ci]);
    const juger = (rel, attendu) => { if (!rel || !rel.msgs.length) { ko('ABSENT', `messages · ${T} · ${attendu} : aucun message à l'écran`); return; }
      rel.msgs.forEach(m => { const nom = `messages · ${T} · ${rel.genre} — ${m.quoi} « ${m.texte} »`;
        if (m.couvre.length) ko('RECOUVERT', `${nom} couvre ${m.couvre.join(', ')} (${m.r.join(',')})`); else ok(`${nom} : sur personne (${m.r.join(',')})`);
        if (m.dehors || m.coupe || m.petit < PLANCHER || m.fond < 0.85) ko('INVISIBLE', `${nom} : ${[m.dehors && `hors de l’écran (${m.r.join(',')} dans ${w} × ${h})`, m.coupe && 'coupé', m.petit < PLANCHER && `texte à ${m.petit.toFixed(1)} points`, m.fond < 0.85 && 'sans fond qui le porte'].filter(Boolean).join(', ')}`); }); };
    // un défaut se relève deux fois, à quatre dixièmes de seconde : la page qui finit de se mettre en place (une liste de
    // commandes qui défile jusqu'à la commande choisie) ne compte pas — un message qui reste sur quelqu'un, si
    const releve = async (genre, n) => { let r = await p.evaluate(g => window.__releve(g), genre);
      if (r.msgs.some(m => m.couvre.length || m.dehors || m.coupe)) { await p.waitForTimeout(400); const r2 = await p.evaluate(g => window.__releve(g), genre); if (r2.msgs.length) r = r2; }
      if (n) await shot(n); return r; };
    // A. un vrai combat de la Cité, dans une partie neuve où « frapper » est reçu et « Vertus » sera la commande nouvelle
    await ouvrir('idris', 0); await p.waitForTimeout(1800); await calme(); await p.waitForTimeout(400); await calme(); await p.waitForTimeout(500);
    const pret = await p.evaluate(() => { const I = window.ISNAD, cherche = l => { for (const x of l || []) { if (Array.isArray(x) && x[0] === 'battle') return x[1]; if (Array.isArray(x)) { const y = cherche(x); if (y) return y; } } return null; };
      const op = I.sagas.idris.chapters[0].objectives.map(o => cherche(o.then)).find(Boolean); if (!op) return false;
      I.sagas.idris.enemies.notif.lvl = 4; // pour cette page seulement : la chimère tient assez pour que tout passe — l'annonce, les bandeaux, le dévoilement
      I.save.data.lecons = { seq: 5, recus: { marcher: 0, parler: 1, frapper: 2 }, re: { marcher: 1, parler: 1, frapper: 1 }, dernier: 'frapper', donne: 2 };
      window.__fin = false; window.__dev = null; window.__vic = null;
      // le dévoilement et la victoire se relèvent au moment même où ils paraissent
      // (un sixième de seconde après : le grand mot de la 2.16 entre en fondu, le carton aussi)
      const vu = () => { if (!window.__devT && (document.querySelector('#floaters .fl.break') || document.querySelector('#battle .banner.break:not([hidden])'))) window.__devT = setTimeout(() => { window.__dev = window.__releve('le dévoilement'); }, 160);
        if (!window.__vicT && (document.querySelector('#battle .banner.fin:not([hidden])') || document.querySelector('#card.victory.on'))) window.__vicT = setTimeout(() => { window.__vic = window.__releve('la victoire'); }, 160); };
      new MutationObserver(vu).observe(document.querySelector('#battle'), { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class'] });
      new MutationObserver(vu).observe(document.querySelector('#floaters'), { childList: true }); new MutationObserver(vu).observe(document.querySelector('#card'), { attributes: true, attributeFilter: ['class'] });
      I.battle.start(op).then(() => { window.__fin = true; }); return true; });
    if (!pret) { ko('ABSENT', `messages · ${T} : le combat de la Cité n'a pas été trouvé`); await ctx.close(); continue; }
    if (!await attendre(() => { const b = document.querySelector('#battle .banner'); return !!b && !b.hidden && b.textContent.length > 20; })) ko('ABSENT', `messages · ${T} : l'introduction du combat`);
    await p.waitForTimeout(450); juger(await releve('l’introduction', '1-intro'), 'l’introduction');
    await emit('ok');
    if (!await attendre(() => !!document.querySelector('#battle .cmd .mlist.main .mi'))) ko('ABSENT', `messages · ${T} : les commandes`);
    await p.waitForTimeout(400); juger(await releve('la leçon de « Vertus »', '2-lecon'), 'la leçon');
    // « Vertus », puis « Reprendre souffle » sur Idris : une vertu annoncée, et la chimère encore debout pour la suite
    await emit('down'); await emit('down'); await p.waitForTimeout(200); await emit('ok'); await p.waitForTimeout(350); await emit('down'); await emit('down'); await p.waitForTimeout(150); await emit('ok'); await p.waitForTimeout(350); await emit('ok');
    if (await attendre(() => { const b = document.querySelector('#battle .banner'); return !!b && !b.hidden; }, null, 5000)) { await p.waitForTimeout(60); juger(await releve('l’annonce d’une vertu', '3-competence'), 'l’annonce'); } else ko('ABSENT', `messages · ${T} : l'annonce d'une vertu`);
    // les autres bandeaux, avec leurs vrais textes, quand le joueur a de nouveau la main
    if (await p.evaluate(() => !!window.ISNAD.battle.dire)) {
      await attendre(() => !!document.querySelector('#battle .cmd .mlist.main .mi'));
      const L = await p.evaluate(() => { const I = window.ISNAD, T = (I.sagas.coeur || {}).secours || {}; let say = null, qui = '';
        Object.values(I.sagas).forEach(s => Object.values(s.enemies || {}).forEach(d => (d.phases || []).forEach(f => { if (f.say && (!say || I.langue.poids(f.say) > I.langue.poids(say))) { say = f.say; qui = d.name; } })));
        const h = I.world.hero(I.world.party[0]), esc = I.esc;
        return [['la plus longue parole d’une chimère', `<small>${esc(qui)}</small>${I.t('« {parole} »', { parole: esc(say) })}`, 4000, true, 'foe speech', '4-parole'],
          ['la Sérénité', esc(h.def.limit.name), 900, false, 'limit'], ['une chimère agit', I.t('Assaut'), 900, false, 'foe'],
          ['l’épreuve du cœur', `<small>${I.t('Épreuve de poids {w} · provision du cœur {had} · enracinement {traits}', { w: 3, had: 1, traits: '▮▮▮▮' })}</small>${I.t('Le cœur est lourd')}`, 1500, false, 'speech foe'],
          ['le secours', `<small>${esc(T.titre || '')}</small>${esc(T.bandeau || '')}`, 1700, false, 'speech intro'],
          ['la besace vide', I.t('La besace est vide.'), 900, false, '']]; });
      for (const [genre, html, ms, wait, cls, n] of L) { await p.evaluate(([html, ms, wait, cls]) => { window.ISNAD.battle.dire(html, wait ? 60000 : ms * 30, wait, cls); }, [html, ms, wait, cls]); await p.waitForTimeout(120);
        juger(await releve(genre, n), genre); if (wait) { await p.waitForTimeout(500); await emit('ok'); } await p.waitForTimeout(150); }
      await p.evaluate(() => { document.querySelector('#battle .banner').hidden = true; });
    } else console.log(`--  messages · ${T} : parole, Sérénité, épreuve du cœur, secours, besace — non éprouvés (ce jeu n'a pas battle.dire)`);
    // jusqu'au dévoilement (Éclairer porte la faille), puis Frapper, jusqu'à la victoire
    let vuDev = false; for (let n = 0; n < 500 && !(await p.evaluate(() => window.__fin)); n++) {
      const s = await p.evaluate(() => ({ dev: !!window.__dev, main: !!document.querySelector('#battle .cmd .mlist.main .mi'), cible: !!document.querySelector('#battle .cmd .mhint'), fin: !!document.querySelector('#battle .banner.fin:not([hidden])') || !!document.querySelector('#card.on') }));
      if (s.dev && !vuDev) { vuDev = true; await p.waitForTimeout(220); await shot('5-devoile'); } // (après l'éclair blanc du dévoilement)
      if (s.fin) { await p.waitForTimeout(500); await shot('6-victoire'); await p.waitForTimeout(300); await emit('ok'); await p.waitForTimeout(600); continue; }
      if (s.main) { await p.waitForTimeout(300); await p.evaluate(i => { const b = document.querySelectorAll('#battle .cmd .mlist.main .mi')[i]; if (b) b.click(); }, s.dev ? 0 : 1); await p.waitForTimeout(250); }
      else if (s.cible) { await emit('ok'); const t0 = Date.now(); while (Date.now() - t0 < 2500 && !(await p.evaluate(() => !!window.__dev))) await p.waitForTimeout(25); }
      else await p.waitForTimeout(80);
    }
    if (await p.evaluate(() => window.ISNAD.battle.active)) await p.evaluate(() => window.ISNAD.battle.abort());
    await p.waitForTimeout(400); const dv = await p.evaluate(() => window.__dev), vc = await p.evaluate(() => window.__vic);
    if (dv) juger(dv, 'le dévoilement'); else ko('ABSENT', `messages · ${T} : le dévoilement n'a pas été vu`);
    if (vc) juger(vc, 'la victoire'); else ko('ABSENT', `messages · ${T} : la victoire n'a pas été vue`);
    // B. un combat d'idole de bataille déclarée (Khâlid, Yarmoûk) : son champ, et le bandeau d'un flanc découvert
    await ouvrir('khalid', 1); await p.waitForTimeout(1800); await calme(); await p.waitForTimeout(400);
    // le chapitre ouvert et calme (son ouverture lue), on y cherche le combat de l'idole, où qu'il soit dans ses scripts
    // (s'il n'a pas pris — la page sortait d'un combat —, on le rouvre)
    for (let i = 0; i < 18 && !(await p.evaluate(() => { const I = window.ISNAD, W = I.world; return W.saga && W.saga.id === 'khalid' && W.ch && W.ch.id === I.sagas.khalid.chapters[1].id && !I.script.busy && !I.battle.active; })); i++) {
      if (i === 6 || i === 12) { await ouvrir('khalid', 1); await p.waitForTimeout(1800); } await calme(); await p.waitForTimeout(500); }
    const idole = await p.evaluate(() => { const I = window.ISNAD, W = I.world, cherche = x => { if (Array.isArray(x)) { if (x[0] === 'battle' && x[1] && x[1].boss) return x[1]; for (const y of x) { const z = cherche(y); if (z) return z; } } else if (x && typeof x === 'object') for (const y of Object.values(x)) { const z = cherche(y); if (z) return z; } return null; };
      const ici = `${W.saga ? W.saga.id : '—'}/${W.ch ? W.ch.id : '—'}${I.battle.active ? ', un combat en cours' : ''}${I.script.busy ? ', un récit en cours' : ''}`;
      if (!W.ch || W.ch.id !== I.sagas.khalid.chapters[1].id || I.battle.active) return 'la page est sur ' + ici; const op = cherche(W.ch.objectives); if (!op) return 'aucun combat d’idole dans ' + ici;
      I.debug.auto = true; I.battle.start(op); I.debug.auto = false; return true; }); // sans la page de préparation (comme le joueur de test), puis à la main
    if (idole !== true) ko('ABSENT', `messages · ${T} : le combat d'idole de Yarmoûk — ${idole}`);
    else if (!await attendre(() => !!document.querySelector('#battle .cmd .mlist.main .mi'), null, 30000)) ko('ABSENT', `messages · ${T} : les commandes de la bataille déclarée`);
    else {
      await p.waitForTimeout(300);
      const vu = await p.evaluate(() => { const I = window.ISNAD, ch = I.battle.champ(); if (!ch || !ch.rangs.length) return false; const r = ch.rangs[0]; ch.vue = true; I.battle.relayout();
        ch.api.banner(`<small>${I.esc(r.name)} · ${I.t('aile nord')}</small>${I.t('Flanc découvert : un voile tombe')}`, 60000, false, 'speech intro'); return true; });
      if (!vu) ko('ABSENT', `messages · ${T} : le champ de la bataille déclarée`);
      else { await p.waitForTimeout(250); juger(await releve('le bandeau du champ (bataille déclarée)', '7-bataille'), 'le bandeau du champ'); }
      await p.evaluate(() => { const I = window.ISNAD, ch = I.battle.champ(); if (ch) { ch.vue = false; I.battle.relayout(); } I.battle.abort(); });
    }
    await ctx.close();
  }
}
