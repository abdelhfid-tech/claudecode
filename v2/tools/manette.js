#!/usr/bin/env node
/* ISNAD 2.x — la manette tactile, partout (src/core/ui.js, pad, layout ; src/core/base.js, « retour »).
   Demande du décideur, 19 novembre : « aussi il faut que les boutons puissent servir à sélectionner (A) ou faire marche
   arrière (B) ». Usage : node tools/manette.js
   Sur un téléphone tenu en hauteur (390 × 844), en largeur (844 × 390), puis sur un petit téléphone (360 × 640), au doigt,
   avec les vrais boutons de la manette seulement (A, B, le joystick ; le bouton ☰ de la scène pour ouvrir la halte) :
   1. l'écran-titre : le joystick descend jusqu'à « Réglages », A y entre, B revient à l'essentiel ;
   2. en exploration : B n'ouvre pas la halte (tout au plus, il arrête la marche) ;
   3. la halte : ouverte par ☰, on y descend au joystick jusqu'à « Carte », A y entre, B revient, B la referme ;
   4. un dialogue : A passe la première réplique, B la seconde ;
   5. une liste de choix : B ne fait rien devant un choix à faire ; le joystick descend, A choisit ; devant un choix qui a
      son « retour », B le prend ;
   6. un carton du récit : A le passe ;
   7. le combat : A choisit « Frapper », B revient du choix de la cible, A de nouveau, le joystick change de cible, A frappe
      celle qu'il montre ;
   8. dans un labyrinthe : B frappe ce qui rôde à portée.
   À chaque état : la manette est là (« INACCESSIBLE » sinon) ; aucun de ses boutons ne recouvre un texte, un élément
   touchable ni l'image de la scène (rectangles comparés : « RECOUVERT ») ; ce qui est sélectionné se voit (sur la capture,
   le contraste de son anneau avec son fond, et avec celui d'un voisin non choisi : « INVISIBLE ») ; chaque touche fait ce
   qu'elle doit (« ÉCART » sinon).
   Sortie : « OK » par preuve, puis « MANETTE CONFORME ». Code 1 à la moindre anomalie. Captures dans .smoke/manette. */
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/manette'), url = 'file://' + path.resolve(V2, process.env.JEU || 'index.html');
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = (mot, m) => { anomalies++; console.log(mot + ' ' + m); }, dit = (v, mot, m) => (v ? ok(m) : ko(mot, m));
const TELEPHONES = [['en hauteur', 'haut', 390, 844], ['en largeur', 'large', 844, 390], ['petit téléphone', 'petit', 360, 640]];

/* dans la page : ce que la manette recouvre — tout élément visible qui porte du texte ou qui se touche, et l'image de la
   scène ; rogné par ce qui le fait défiler, et seulement s'il est bien dessus (ce qu'un écran couvre ne compte pas) */
function recouvre() {
  const pad = document.getElementById('pad'), vus = [], R = q => q.getBoundingClientRect();
  const montre = e => { if (e.closest('[hidden]')) return false; for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; } return true; };
  const pads = ['#pad .joy', '#pad .a', '#pad .b'].map(q => document.querySelector(q)).filter(e => e && montre(e)).map(R);
  if (!pads.length) return { pads: 0, l: [] };
  const coupe = (e, r) => { let x0 = r.left, y0 = r.top, x1 = r.right, y1 = r.bottom; for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) { const s = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(s.overflow + s.overflowX + s.overflowY)) { const q = R(a); x0 = Math.max(x0, q.left); y0 = Math.max(y0, q.top); x1 = Math.min(x1, q.right); y1 = Math.min(y1, q.bottom); } } x0 = Math.max(x0, 0); y0 = Math.max(y0, 0); x1 = Math.min(x1, innerWidth); y1 = Math.min(y1, innerHeight); return x1 - x0 > 1 && y1 - y0 > 1 ? [x0, y0, x1, y1] : null; };
  const touche = (q, p) => q[0] < p.right - 1 && q[2] > p.left + 1 && q[1] < p.bottom - 1 && q[3] > p.top + 1;
  const dessus = (e, q, p) => { const x = (Math.max(q[0], p.left) + Math.min(q[2], p.right)) / 2, y = (Math.max(q[1], p.top) + Math.min(q[3], p.bottom)) / 2, v = pad.style.visibility; pad.style.visibility = 'hidden'; const h = document.elementFromPoint(x, y); pad.style.visibility = v; return !!h && (h === e || e.contains(h) || h.contains(e)); };
  const voir = (e, rects, quoi) => { for (const r of rects) { const q = coupe(e, r); if (!q) continue; const p = pads.find(p => touche(q, p)); if (p && dessus(e, q, p)) { vus.push(quoi + ' ' + (e.id ? '#' + e.id : (e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''))) + ' « ' + (e.textContent || '').trim().slice(0, 24) + ' »'); return; } } };
  document.querySelectorAll('body *').forEach(e => { if (pad.contains(e) || !montre(e)) return;
    if (e.matches('button, a, input, textarea, select, .opt, .mi, .plate, .hrow, .link, canvas#cv')) voir(e, [R(e)], 'touchable');
    [...e.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).forEach(n => { const g = document.createRange(); g.selectNodeContents(n); voir(e, [...g.getClientRects()], 'texte'); }); });
  const st = document.getElementById('stage'), cs = R(st); if (!document.querySelector('.screen:not([hidden])') && document.getElementById('card').hidden) { const q = coupe(st, cs); if (q && pads.some(p => touche(q, p))) vus.push('l’image de la scène'); }
  return { pads: pads.length, l: [...new Set(vus)] };
}

/* dans la page : le contraste de l'élément sélectionné, mesuré sur la capture (b64) — son anneau (les deux points du bord)
   contre son fond (de 4 à 6 points en dedans), et la même mesure sur un voisin non choisi */
async function contraste([b64, sel]) {
  const e = document.querySelector(sel); if (!e) return { absent: true };
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const k = img.width / innerWidth, d = g.getImageData(0, 0, c.width, c.height).data, lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (x, y) => { x = Math.floor(x * k); y = Math.floor(y * k); if (x < 0 || y < 0 || x >= c.width || y >= c.height) return null; const i = (y * c.width + x) * 4; return 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]); };
  const bande = (r, a, b) => { const L = []; for (let t = a; t <= b; t += 0.5) for (let s = 0.12; s <= 0.88; s += 0.04) [[r.left + t, r.top + r.height * s], [r.right - t, r.top + r.height * s], [r.left + r.width * s, r.top + t], [r.left + r.width * s, r.bottom - t]].forEach(([x, y]) => { const v = lum(x, y); if (v !== null) L.push(v); }); L.sort((x, y) => x - y); return L.length ? L[Math.floor(L.length / 2)] : 0; };
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const mesure = el => { const r = el.getBoundingClientRect(); return ratio(bande(r, 0.4, 1.6), bande(r, 4, 6)); };
  const voisin = [...e.parentElement.children].find(x => x !== e && x.tagName === e.tagName && x.className.replace(/\b(sel|cur)\b/g, '').trim() === e.className.replace(/\b(sel|cur)\b/g, '').trim() && x.getClientRects().length);
  return { choisi: +mesure(e).toFixed(2), voisin: voisin ? +mesure(voisin).toFixed(2) : null, texte: (e.textContent || '').trim().slice(0, 30) };
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(), errors = [];
  for (const [nom, cle, W0, H0] of TELEPHONES) {
    const ctx = await browser.newContext({ viewport: { width: W0, height: H0 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }), p = await ctx.newPage(), cdp = await ctx.newCDPSession(p);
    p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForTimeout(1600);
    let n = 0; const shot = async quoi => { const f = `${cle}-${String(++n).padStart(2, '0')}-${quoi}.png`; await p.screenshot({ path: path.join(out, f) }); return f; };
    const centre = q => p.evaluate(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && !document.body.classList.contains('pad-efface') ? { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 } : null; }, q);
    // les vrais boutons : un toucher sur A ou sur B ; le pouce poussé sur le joystick, un cran, puis lâché
    const bouton = async (q, ou) => { const c = await centre(q); if (!c) { ko('INACCESSIBLE', `${nom} · ${ou} : la manette n'est pas là (${q})`); return false; } await p.touchscreen.tap(c.x, c.y); await p.waitForTimeout(260); return true; };
    const A = ou => bouton('#pad .a', ou), B = ou => bouton('#pad .b', ou);
    const joy = async (dir, ou) => { const c = await centre('#pad .joy'); if (!c) { ko('INACCESSIBLE', `${nom} · ${ou} : le joystick n'est pas là`); return false; }
      const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir], R = c.r * 0.6;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c.x, y: c.y, id: 7 }] }); await p.waitForTimeout(30);
      for (let i = 1; i <= 3; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: c.x + dx * R * i / 3, y: c.y + dy * R * i / 3, id: 7 }] }); await p.waitForTimeout(20); }
      await p.waitForTimeout(70); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(140); return true; };
    // chaque état : la manette ne recouvre rien ; ce qui est sélectionné se voit
    const rien = async ou => { await p.waitForTimeout(250); const r = await p.evaluate(recouvre); if (!r.pads) return ko('INACCESSIBLE', `${nom} · ${ou} : la manette s'est effacée (${await p.evaluate(() => (window.ISNAD.ui.padSous || []).join(', '))})`);
      dit(!r.l.length, 'RECOUVERT', `${nom} · ${ou} : la manette ne recouvre rien${r.l.length ? ' — ' + r.l.slice(0, 4).join(' · ') : ''}`); };
    const vue = async (sel, ou) => { const b64 = (await p.screenshot()).toString('base64'), m = await p.evaluate(contraste, [b64, sel]);
      if (m.absent) return ko('INVISIBLE', `${nom} · ${ou} : rien n'est sélectionné (${sel})`);
      dit(m.choisi >= 3 && (m.voisin === null || m.choisi >= m.voisin * 1.5), 'INVISIBLE', `${nom} · ${ou} : la sélection se voit — « ${m.texte} », anneau ${m.choisi} : 1 contre son fond${m.voisin !== null ? `, un voisin non choisi ${m.voisin} : 1` : ''}`); };
    const choisi = sel => p.evaluate(sel => { const e = document.querySelector(sel); return e ? e.textContent.trim() : ''; }, sel);
    const entree = async () => { if (await p.evaluate(() => { const c = document.querySelector('#choice'); if (c && !c.hidden) { const o = c.querySelectorAll('.opt'); if (o.length) { o[o.length - 1].click(); return false; } } return ['#card', '#dialog'].some(q => { const e = document.querySelector(q); return e && !e.hidden; }); })) await p.keyboard.press('Enter'); };
    const calme = async (k = 80) => { for (let i = 0; i < k && await p.evaluate(() => window.ISNAD.script.busy || window.ISNAD.world.lock); i++) { await entree(); await p.waitForTimeout(160); } await p.waitForTimeout(250); };

    /* 1. l'écran-titre */
    { const pl = await p.evaluate(() => { const U = window.ISNAD.ui, j = document.querySelector('#pad .joy').getBoundingClientRect(), a = document.querySelector('#pad .a').getBoundingClientRect(); return { bas: U.padBas, cote: U.padCote, joy: Math.round(j.width), a: Math.round(a.width) }; });
      dit(pl.bas > 0 !== pl.cote > 0, 'ÉCART', `${nom} : la place de la manette — ${pl.bas ? `la bande du bas, ${pl.bas} points` : `les deux marges, ${pl.cote} points chacune`} ; joystick de ${pl.joy} points, A et B de ${pl.a}`); }
    await rien('écran-titre'); await vue('#title .vmenu button.sel', 'écran-titre');
    for (let i = 0; i < 9 && !/^Réglages/.test(await choisi('#title .vmenu button.sel')); i++) await joy('down', 'écran-titre');
    const t1 = await choisi('#title .vmenu button.sel'); dit(/^Réglages/.test(t1), 'INACCESSIBLE', `${nom} · écran-titre : le joystick descend jusqu'à « Réglages » (« ${t1} »)`);
    await A('écran-titre'); const t2 = await p.evaluate(() => [...document.querySelectorAll('#title .vmenu button')].map(b => b.textContent));
    dit(t2.some(t => /^Son/.test(t)), 'ÉCART', `${nom} · écran-titre : A ouvre les réglages`);
    await rien('écran-titre, réglages'); await vue('#title .vmenu button.sel', 'écran-titre, réglages'); await shot('titre-reglages');
    await B('écran-titre, réglages'); const t3 = await p.evaluate(() => [...document.querySelectorAll('#title .vmenu button')].map(b => b.textContent));
    dit(t3.some(t => /^Nouvelle partie/.test(t)) && !t3.some(t => /^Son/.test(t)), 'ÉCART', `${nom} · écran-titre : B revient à l'essentiel`);

    /* 2. en exploration : B n'ouvre pas la halte */
    await p.evaluate(() => { const I = window.ISNAD; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => e.hidden = true); document.body.classList.remove('in-screen'); I.input.reset();
      I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter('khalid', 2); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); });
    await p.waitForTimeout(1800); await calme(); await p.waitForTimeout(400); await calme(); await p.waitForTimeout(600);
    await rien('exploration'); await shot('exploration');
    const marche = await p.evaluate(() => { const W = window.ISNAD.world, T = 16, m = W.map, px = W.player.x, py = W.player.y; for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4], [3, 2], [-3, 2]]) { const x = px + dx * T, y = py + dy * T; if (x > 8 && y > 8 && x < m.w * T - 8 && y < m.h * T - 8 && !W.solidAt(x, y)) { W.tap(x, y); return !!W.dest; } } return false; });
    await p.waitForTimeout(150); await B('exploration');
    const e2 = await p.evaluate(() => { const I = window.ISNAD; return { halte: I.ui.menuOpen || !document.getElementById('menu').hidden, dest: !!I.world.dest, ecran: !!document.querySelector('.screen:not([hidden])') }; });
    dit(!e2.halte && !e2.ecran && !e2.dest, 'ÉCART', `${nom} · exploration : B n'ouvre pas la halte${marche ? ', et arrête la marche en cours' : ''}`);

    /* 2 bis. courir (2.17 : « réserver le joystick + B pour courir ») : le joystick seul, même tiré au bord, fait marcher ;
       B tenu par le pouce droit pendant que le gauche pousse le joystick fait courir — deux doigts, deux vrais touchers */
    { const dg = await p.evaluate(() => { const W = window.ISNAD.world, P = W.player, ok = (x, y) => !(W.solidAt(x - 4, y - 5) || W.solidAt(x + 4, y - 5) || W.solidAt(x - 4, y) || W.solidAt(x + 4, y));
        return [[1, 0], [-1, 0], [0, 1], [0, -1]].map(v => { let k = 0; while (k < 140 && ok(P.x + v[0] * k, P.y + v[1] * k)) k += 2; return { v, n: k, x: P.x, y: P.y }; }).sort((a, b) => b.n - a.n)[0]; });
      const vit = async avecB => { const c = await centre('#pad .joy'), b = await centre('#pad .b'); if (!c || !b) return null;
        await p.evaluate(q => { const W = window.ISNAD.world; W.player.x = q.x; W.player.y = q.y; W.dest = null; W.resetTrail(); }, dg);
        const doigtB = avecB ? [{ x: b.x, y: b.y, id: 8 }] : [], pouce = k => ({ x: c.x + dg.v[0] * c.r * k, y: c.y + dg.v[1] * c.r * k, id: 7 });
        if (avecB) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: doigtB }); await p.waitForTimeout(40); }
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [...doigtB, pouce(0)] }); await p.waitForTimeout(30);
        for (let i = 1; i <= 3; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [...doigtB, pouce(0.95 * i / 3)] }); await p.waitForTimeout(20); }
        await p.waitForTimeout(120); const lire = () => p.evaluate(() => { const W = window.ISNAD.world; return [W.player.x, W.player.y, W.t, !!W.player.court]; }), a = await lire(); await p.waitForTimeout(300); const z = await lire();
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(250);
        return { v: Math.hypot(z[0] - a[0], z[1] - a[1]) / Math.max(0.01, z[2] - a[2]), court: a[3] || z[3] }; };
      const seul = await vit(false), avec = await vit(true);
      if (!seul || !avec) ko('INACCESSIBLE', `${nom} · courir : la manette n'est pas là`);
      else dit(seul.v > 60 && seul.v < 94 && !seul.court && avec.court && avec.v > 1.15 * seul.v && avec.v < 1.33 * seul.v, 'ÉCART',
        `${nom} · courir : le joystick seul au bord marche (${seul.v.toFixed(0)} points par seconde) ; avec B tenu, on court (${avec.v.toFixed(0)}, ${(avec.v / Math.max(1, seul.v)).toFixed(2)} fois)`); }

    /* 3. la halte */
    const mb = await p.evaluate(() => { const b = document.getElementById('menubtn'), r = b.getBoundingClientRect(); return b.hidden ? null : { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    if (!mb) ko('INACCESSIBLE', `${nom} · le bouton ☰ de la halte n'est pas là`); else { await p.touchscreen.tap(mb.x, mb.y); await p.waitForTimeout(700); }
    const h0 = await p.evaluate(() => ({ ouverte: !document.getElementById('menu').hidden, titre: document.querySelector('#menu h2').textContent }));
    dit(h0.ouverte, 'INACCESSIBLE', `${nom} · le bouton ☰ ouvre la halte`);
    await rien('la halte'); await vue('#menu .side button.sel', 'la halte'); await shot('halte');
    const avant = await choisi('#menu .side button.sel'); await joy('down', 'la halte'); const apres = await choisi('#menu .side button.sel');
    dit(apres && apres !== avant, 'ÉCART', `${nom} · la halte : le joystick déplace la sélection, un cran (« ${avant} » → « ${apres} »)`);
    for (let i = 0; i < 6 && (await choisi('#menu .side button.sel')) !== 'Carte'; i++) await joy('down', 'la halte');
    await A('la halte'); const h1 = await p.evaluate(() => document.querySelector('#menu h2').textContent);
    dit(h1 === 'Carte', 'ÉCART', `${nom} · la halte : A entre dans « Carte » (« ${h1} »)`);
    await rien('la halte, la carte'); await shot('halte-carte');
    await B('la halte, la carte'); const h2 = await p.evaluate(() => ({ titre: document.querySelector('#menu h2').textContent, ouverte: !document.getElementById('menu').hidden }));
    dit(h2.ouverte && h2.titre === 'Halte', 'ÉCART', `${nom} · la halte : B revient d'un cran (« ${h2.titre} »)`);
    // le réglage « Manette tactile », et ce qu'il dit
    for (let i = 0; i < 40 && !/^Manette tactile/.test(await choisi('#menu .side button.sel')); i++) await joy('down', 'la halte, les réglages');
    const rg = await p.evaluate(() => ({ b: (document.querySelector('#menu .side button.sel') || {}).textContent || '', pane: document.querySelector('#menu .pane').textContent }));
    dit(/^Manette tactile : affichée/.test(rg.b) && /A pour parler, agir et valider ; B pour frapper et revenir en arrière/.test(rg.pane), 'ÉCART', `${nom} · la halte : le réglage « ${rg.b} » dit ce que font A et B`);
    await rien('la halte, la manette'); await vue('#menu .side button.sel', 'la halte, la manette'); await shot('halte-reglage-manette');
    await B('la halte'); const h3 = await p.evaluate(() => ({ ouverte: !document.getElementById('menu').hidden || window.ISNAD.ui.menuOpen }));
    dit(!h3.ouverte, 'ÉCART', `${nom} · la halte : B la referme, on revient au jeu`);
    await p.waitForTimeout(300);

    /* 4. un dialogue : A, puis B */
    await p.evaluate(() => { const S = window.ISNAD.script; S.depth++; window.__fin = false; S.run([['say', 'khalid', 'Nous tiendrons la passe jusqu’à l’aube. Que chacun garde son rang.'], ['say', 'khalid', 'Et que personne ne quitte la crête avant le signal.']]).then(() => { S.depth--; S.hideDialog(); window.__fin = true; }); });
    await p.waitForTimeout(1600); await rien('un dialogue'); await shot('dialogue');
    const d0 = await choisi('#dialog .text'); await A('un dialogue'); await p.waitForTimeout(1500); const d1 = await choisi('#dialog .text');
    dit(/garde son rang/.test(d0) && /quitte la crête/.test(d1), 'ÉCART', `${nom} · un dialogue : A passe à la réplique suivante`);
    await B('un dialogue'); await p.waitForTimeout(400); const d2 = await p.evaluate(() => ({ fini: window.__fin, cache: document.getElementById('dialog').hidden }));
    dit(d2.fini && d2.cache, 'ÉCART', `${nom} · un dialogue : B passe la dernière réplique`);

    /* 5. une liste de choix */
    await p.evaluate(() => { const S = window.ISNAD.script; S.depth++; window.__choix = null; S.menuPick('Que répondre à l’envoyé ?', [{ t: 'Lui rappeler la parole donnée la veille, devant les anciens du camp.' }, { t: 'Se taire, et attendre que la colère retombe.' }, { t: 'Lui proposer de partager l’eau du puits jusqu’au soir.' }, { t: 'Lui demander ce qu’il craint vraiment.' }]).then(i => { S.depth--; S.hideDialog(); window.__choix = i; }); });
    await p.waitForTimeout(700); await rien('une liste de choix'); await vue('#choice .opt.sel', 'une liste de choix');
    await B('une liste de choix'); const c0 = await p.evaluate(() => ({ ouverte: !document.getElementById('choice').hidden, choix: window.__choix }));
    dit(c0.ouverte && c0.choix === null, 'ÉCART', `${nom} · une liste de choix : B ne fait rien devant un choix à faire`);
    await joy('down', 'une liste de choix'); await joy('down', 'une liste de choix'); await shot('choix');
    const c1 = await choisi('#choice .opt.sel'); await A('une liste de choix'); await p.waitForTimeout(300); const c2 = await p.evaluate(() => window.__choix);
    dit(/partager l’eau/.test(c1) && c2 === 2, 'ÉCART', `${nom} · une liste de choix : le joystick descend de deux crans, A choisit la troisième réponse (${c2})`);
    await p.evaluate(() => { const S = window.ISNAD.script; S.depth++; window.__choix = null; S.menuPick('De l’eau.', [{ t: 'Puiser' }, { t: 'Pétrir des briques de terre' }, { t: 'Plus tard', retour: true }]).then(i => { S.depth--; S.hideDialog(); window.__choix = i; }); });
    await p.waitForTimeout(700); await B('une liste de choix qui a son retour'); await p.waitForTimeout(200); const c3 = await p.evaluate(() => window.__choix);
    dit(c3 === 2, 'ÉCART', `${nom} · une liste de choix qui a son « retour » : B le prend (${c3})`);

    /* 6. un carton du récit */
    await p.evaluate(() => { const S = window.ISNAD.script; S.depth++; window.__carton = false; S.card('title', '<p class="small">Chapitre trois</p><h1>La passe de la nuit</h1><p>Où l’on apprend que tenir est parfois plus difficile que vaincre.</p><div class="rule"></div><div class="hint">▼</div>').then(() => { S.depth--; window.__carton = true; }); });
    await p.waitForTimeout(900); await rien('un carton'); await shot('carton'); await A('un carton'); await p.waitForTimeout(700);
    dit(await p.evaluate(() => window.__carton), 'ÉCART', `${nom} · un carton : A le passe`);
    await calme(10);

    /* 7. le combat */
    await p.evaluate(() => { const I = window.ISNAD; I.battle.start({ group: Object.keys(I.world.saga.enemies).filter(k => I.world.saga.enemies[k].tier !== 'boss').slice(0, 2), bg: 'desert' }); });
    let pret = false; for (let i = 0; i < 80 && !(pret = await p.evaluate(() => !!document.querySelector('#battle .cmd .mi.sel'))); i++) { if (await p.evaluate(() => { const b = document.querySelector('#battle .banner'); return b && !b.hidden; })) await A('le combat, un bandeau'); await p.waitForTimeout(300); }
    dit(pret, 'INACCESSIBLE', `${nom} · le combat : les commandes d'un compagnon`);
    if (pret) {
      await rien('le combat'); await vue('#battle .cmd .mi.sel', 'le combat, les commandes'); await shot('combat');
      const k0 = await choisi('#battle .cmd .mi.sel'); await A('le combat');
      const k1 = await p.evaluate(() => ({ cible: !!document.querySelector('.plate.cur'), n: window.ISNAD.battle.places().filter(e => e.choix).length }));
      dit(/Frapper/.test(k0) && k1.cible, 'ÉCART', `${nom} · le combat : A choisit « Frapper », puis la cible (${k1.n} à choisir)`);
      await rien('le combat, la cible'); await vue('.plate.cur', 'le combat, la cible'); await shot('combat-cible');
      await B('le combat, la cible'); const k2 = await p.evaluate(() => ({ cible: !!document.querySelector('.plate.cur'), cmd: !!document.querySelector('#battle .cmd .mi.sel') }));
      dit(!k2.cible && k2.cmd, 'ÉCART', `${nom} · le combat : B revient du choix de la cible aux commandes`);
      await A('le combat'); const nom0 = await choisi('.plate.cur .nm'); await joy('right', 'le combat, la cible'); const nom1 = await choisi('.plate.cur .nm');
      const pv = q => p.evaluate(q => { const pl = [...document.querySelectorAll('.plate')].find(e => e.querySelector('.nm').textContent.trim() === q); return pl ? parseFloat(pl.querySelector('.bar i').style.width) : null; }, q);
      const pv0 = await pv(nom1);
      dit(k1.n < 2 || (nom1 && nom1 !== nom0), 'ÉCART', `${nom} · le combat : le joystick change de cible (« ${nom0} » → « ${nom1} »)`);
      await A('le combat, la cible'); await p.waitForTimeout(2600); const pv1 = await pv(nom1);
      dit(pv0 !== null && (pv1 === null || pv1 < pv0), 'ÉCART', `${nom} · le combat : A frappe la cible montrée (« ${nom1} » : ${pv0} % → ${pv1 === null ? 'dissipée' : pv1 + ' %'})`);
      await p.evaluate(() => { const I = window.ISNAD; I.battle.abort(I.world); }); await p.waitForTimeout(700); await calme(10);
    }

    /* 8. dans un labyrinthe : B frappe ce qui rôde */
    await p.evaluate(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; I.debug.graine = 20261116; I.debug.profondeur = 3; I.input.reset();
      I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter('abubakr', 0); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); });
    await p.waitForTimeout(1800); await calme();
    await p.evaluate(async () => { await window.ISNAD.script.run([['map', 'noos', 'seuil', { hue: 210 }]]); }); await p.waitForTimeout(600); await calme();
    // le groupe posé à une case de ce qui rôde, tourné vers lui, ce qui rôde arrêté (comme descente.js) ; refait juste avant B
    const placer = id => p.evaluate(id => { const I = window.ISNAD, W = I.world, R = I.rodeurs, T = 16, m = W.map;
      // (plus d'un voile d'abord : frappé, il reste là)
      for (const f of R.rodent().filter(q => !id || q.id === id).sort((a, b) => b.voiles - a.voiles)) { let ou = null; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(q => { if (ou) return; const x = Math.floor(f.x / T) + q[0], y = Math.floor(f.y / T) + q[1]; if (x >= 0 && y >= 0 && x < m.w && y < m.h && !m.solid[y * m.w + x] && ['npont', 'nfloor'].includes(m.g0(x * T + 8, y * T + 8))) ou = [x, y]; });
        if (!ou) continue; f.v = 0; f.sonne = 0; f.pousse = null; f.x = Math.floor(f.x / T) * T + 8; f.y = Math.floor(f.y / T) * T + 8; f.cx = null;
        W.player.x = ou[0] * T + 8; W.player.y = ou[1] * T + 8; W.dest = null; const dx = f.x - W.player.x, dy = f.y - W.player.y; W.player.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); W.updateCam(true); R._pret = 0;
        return { id: f.id, voiles: f.voiles === undefined ? R.VOILES[m.env.dedale.n] : f.voiles, coups: R.coups | 0 }; } return null; }, id);   // (ses voiles ne sont comptés qu'au premier coup : rodeurs.js)
    const pres = await placer(null);
    if (!pres) ko('INACCESSIBLE', `${nom} · un labyrinthe : rien ne rôde à portée`);
    else { await p.waitForTimeout(300); await rien('un labyrinthe'); await shot('labyrinthe');
      const p2 = (await placer(pres.id)) || pres; await p.waitForTimeout(250); const lit = await p.evaluate(() => document.body.classList.contains('frapper'));
      await B('un labyrinthe'); await p.waitForTimeout(200);
      const f1 = await p.evaluate(id => { const I = window.ISNAD, f = I.world.foes.find(q => q.id === id); return { voiles: f ? f.voiles : -1, coups: I.rodeurs.coups | 0, halte: I.ui.menuOpen || !document.getElementById('menu').hidden, combat: I.battle.active }; }, pres.id);
      const juste = lit && f1.coups === p2.coups + 1 && typeof f1.voiles === 'number' && f1.voiles < p2.voiles && !f1.halte;   // (un voile de moins ; le dernier : il se dissipe)
      dit(juste, 'ÉCART', `${nom} · un labyrinthe : B s'éclaire à portée, frappe ce qui rôde (un voile de moins), et n'ouvre pas la halte${juste ? '' : ` — éclairé : ${lit}, avant ${JSON.stringify(p2)}, après ${JSON.stringify(f1)}`}`);
      if (f1.combat) await p.evaluate(() => { const I = window.ISNAD; I.battle.abort(I.world); }); }
    await ctx.close();
  }
  if (errors.length) ko('ÉCART', `erreur console : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`);
  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ MANETTE CONFORME — A choisit, B revient en arrière, le joystick choisit ; la manette ne recouvre rien et la sélection se voit (captures dans .smoke/manette)');
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
