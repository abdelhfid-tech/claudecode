#!/usr/bin/env node
/* ISNAD 2.0 — le personnage du joueur : le nom et la tenue du râwî.
   Usage : node tools/personnage.js
   1. Les noms : ceux qui passent, ceux qui sont refusés et pourquoi. Le nom dans les textes : chaque phrase du jeu qui
      nomme le râwî, redite avec six noms — plus un « Idris », et la bonne élision (« de Khalil », « d’Elyas »).
   2. Sans rien choisir, rien ne change : les phrases, le sceau et la silhouette sont ceux d'origine, à l'identique.
   3. Par les vrais boutons, en quatre tailles d'écran : « Nouvelle partie » ouvre « Ton personnage » ; un nom refusé
      bloque ; un nom et une tenue choisis, le prologue se joue en entier — tout ce qui s'affiche est relevé : le nom
      choisi y paraît (dialogue, combat, objectifs, Chaîne), « Idris » n'y paraît plus.
   4. Le choix tient : dans la partie gardée, après rechargement, dans une partie exportée puis importée ailleurs ; on en
      change depuis la Chaîne et depuis la halte.
   Sortie : « OK » par preuve, « ÉCART », « BLOQUÉ » ou « INVISIBLE » sinon ; captures dans .smoke/personnage/ (dont la
   planche des six tenues). Code 1 à la première anomalie. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/personnage'), url = 'file://' + path.join(V2, 'index.html');
fs.mkdirSync(out, { recursive: true });
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); };

(async () => {
  const browser = await chromium.launch(); let errors = [];
  const ouvrir = async vp => { const ctx = await browser.newContext({ viewport: vp || { width: 960, height: 540 }, hasTouch: !!vp && vp.width < 900 }); const page = await ctx.newPage();
    page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url); await page.waitForTimeout(1700); return page; };
  const sansErreur = quoi => { if (errors.length) { ko(`ÉCART erreur console (${quoi}) : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`); errors = []; } };
  const bouton = (page, dans, texte) => page.locator(`${dans} button`, { hasText: texte }).first();

  /* ---------- 1. les noms ---------- */
  let page = await ouvrir();
  const PASSENT = ['Idris', 'Khalil', 'Elyas', '’Imrân', 'Hamza', 'Abd al-Karîm', '’Abd Allah', 'Zayd', 'Nûr ad-Dîn', 'Yacine', 'Jean-Luc', 'Sélim', 'إلياس', 'Ibrâhîm', 'Mûsâ'];
  const REFUSES = [['', 'faut un nom'], ['   ', 'faut un nom'], ['Abdelkader ben Ali', 'Seize'], ['Khalil2', 'lettres'], ['<b>x</b>', 'lettres'], ['Idris*', 'lettres'], ['K@lil', 'lettres'], ['-Khalil', 'lettres'],
    ['Allah', 'Dieu'], ['allâh', 'Dieu'], ['Ar-Rahmân', 'Dieu'], ['Dieu', 'Dieu'], ['Iblîs', 'ne se porte pas'], ['Le Djinn', 'ne se porte pas'], ['Shaytân', 'ne se porte pas'],
    ['Muhammad', 'Prophète'], ['Mohamed', 'Prophète'], ['’Umar', 'personnage du jeu'], ['Umar', 'personnage du jeu'], ['Khâlid', 'personnage du jeu'], ['Abû Bakr', 'personnage du jeu'], ['ali', 'personnage du jeu'], ['’Uthmân', 'personnage du jeu'], ['Abd ar-Rahmân', 'personnage du jeu']];
  const noms = await page.evaluate(([P, R]) => { const X = window.ISNAD.perso; return { passent: P.map(n => [n, X.refus(n)]), refuses: R.map(([n, r]) => [n, r, X.refus(n)]), pris: Object.keys(X.prisParLeJeu()).length }; }, [PASSENT, REFUSES]);
  const mauvais = noms.passent.filter(x => x[1]).map(x => `« ${x[0]} » refusé (${x[1]})`).concat(noms.refuses.filter(x => !x[2]).map(x => `« ${x[0]} » accepté`), noms.refuses.filter(x => x[2] && !x[2].includes(x[1])).map(x => `« ${x[0]} » refusé sans la bonne raison (${x[2]})`));
  if (mauvais.length) mauvais.forEach(m => ko('ÉCART nom : ' + m)); else ok(`${PASSENT.length} noms acceptés (${PASSENT.slice(1, 8).join(', ')}…) ; ${REFUSES.length} refusés, chacun pour sa raison : vide, trop long, autre chose que des lettres, le Nom divin seul, un nom interdit, le nom du Prophète ﷺ, un des ${noms.pris} noms que le jeu porte déjà`);
  // le nom dans les textes : chaque phrase relevée, redite avec six noms
  const dit = await page.evaluate(() => { const X = window.ISNAD.perso, ph = X.phrases(), N = [['Khalil', false], ['Elyas', true], ['Hamza', false], ['’Imrân', false], ['Yacine', false], ['Abd ar-Rahmân', true]], faux = [];
    N.forEach(([n, elide]) => ph.forEach(t => { const d = X.dire(t, n);
      if (/(^|[^A-Za-zÀ-ÿ])Idris(?![A-Za-zÀ-ÿ])/.test(d)) faux.push(n + ' : il reste « Idris » — ' + d.slice(0, 80));
      if (!d.includes(n)) faux.push(n + ' : le nom manque — ' + d.slice(0, 80));
      if (/[dD][’']Idris|[qQ]u[’']Idris/.test(t)) { const attendu = elide ? /(?:d|qu)’/ : /(?:de|que) /, i = d.indexOf(n), avant = d.slice(Math.max(0, i - 4), i); if (!attendu.test(avant)) faux.push(n + ' : élision — …' + d.slice(Math.max(0, i - 16), i + n.length + 6) + '…'); } }));
    const ex = ph.filter(t => /[dD][’']Idris|[qQ]u[’']Idris/.test(t)).slice(0, 3).map(t => { const i = t.search(/[dDqQ]u?[’']Idris/); return [t.slice(Math.max(0, i - 22), i + 12), X.dire(t, 'Khalil').slice(Math.max(0, i - 22), i + 15), X.dire(t, 'Elyas').slice(Math.max(0, i - 22), i + 13)]; });
    return { n: ph.length, elisions: ph.filter(t => /[dD][’']Idris|[qQ]u[’']Idris/.test(t)).length, faux, ex }; });
  if (dit.n < 25 || dit.elisions < 3) ko(`ÉCART seulement ${dit.n} phrases relevées dans le jeu, dont ${dit.elisions} avec une élision : il en manque`);
  if (dit.faux.length) dit.faux.slice(0, 8).forEach(f => ko('ÉCART ' + f)); else ok(`${dit.n} phrases du jeu nomment le râwî, dont ${dit.elisions} avec une élision ; redites avec six noms : plus un « Idris », et l'élision juste — ${dit.ex.map(e => `« …${e[0].trim()}… » → « …${e[1].trim()}… » / « …${e[2].trim()}… »`).slice(0, 2).join(' ; ')}`);

  /* ---------- 2. sans rien choisir, rien ne change ---------- */
  const neutre = await page.evaluate(() => { const I = window.ISNAD, X = I.perso, h = I.sagas.idris.heroes.idris, avant = JSON.stringify(I.sagas), look0 = h.look;
    I.save.reset(); const a = JSON.stringify(I.sagas) === avant && h.look === look0;
    X.choisir('Khalil', 'veilleur'); const change = h.name === 'Khalil' && h.arabic === '' && h.look !== look0 && I.sagas.idris.name === 'Khalil';
    X.choisir('Idris', 'archives'); const b = JSON.stringify(I.sagas) === avant && h.look === look0 && h.arabic === 'إدريس';
    I.save.reset(); return { a, change, b, tenue0: JSON.stringify(I.D.TENUES[0].look) === JSON.stringify(look0) }; });
  if (!neutre.a || !neutre.b || !neutre.tenue0) ko(`ÉCART le profil d'origine ne laisse pas le jeu intact : ${JSON.stringify(neutre)}`); else if (!neutre.change) ko('ÉCART choisir un nom et une tenue ne change pas le râwî');
  else ok('sans rien choisir, rien ne change : phrases, sceau et silhouette d’origine, à l’identique — et l’on y revient en rechoisissant « Idris » et sa tenue de toujours');
  // la planche des six tenues : de face, de profil, de dos, telles que le moteur les dessine
  const planche = await page.evaluate(() => { const I = window.ISNAD, G = I.gfx, T = I.D.TENUES, k = 4, cv = document.createElement('canvas'); cv.width = T.length * 3 * 34 * k + 16; cv.height = 62 * k + 16; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
    c.fillStyle = '#12101c'; c.fillRect(0, 0, cv.width, cv.height);
    T.forEach((t, i) => { const L = Object.assign({ kind: 'compagnon' }, t.look); [0, 1, 3].forEach((d, j) => { const g = G.charGrand(L, d); c.drawImage(g, 8 + (i * 3 + j) * 34 * k, 8, g.width * k, g.height * k); });
      c.fillStyle = '#e9c877'; c.font = '14px sans-serif'; c.fillText((i + 1) + ' · ' + t.nom, 12 + i * 3 * 34 * k, 50 * k + 28); });
    return { url: cv.toDataURL('image/png'), noms: T.map(t => t.nom), distinctes: new Set(T.map(t => G.charURL(Object.assign({ kind: 'compagnon' }, t.look), 0))).size }; });
  fs.writeFileSync(path.join(out, 'tenues.png'), Buffer.from(planche.url.split(',')[1], 'base64'));
  if (planche.distinctes !== planche.noms.length) ko(`ÉCART des tenues se dessinent pareil : ${planche.distinctes} silhouettes pour ${planche.noms.length} tenues`); else ok(`six tenues, six silhouettes différentes : ${planche.noms.join(', ')} — planche dans ${path.relative(process.cwd(), path.join(out, 'tenues.png'))}`);
  sansErreur('sur les noms et les tenues'); await page.close();

  /* ---------- 3. par les vrais boutons, en quatre tailles ---------- */
  // tout ce qui s'affiche pendant le jeu, relevé au fil de l'eau
  const ecouter = p => p.evaluate(() => { window.__vu = new Set(); const noter = () => { ['#dialog', '#card', '#hud', '#toasts', '#battle', '#choice', '#chain', '#noms', '#menu'].forEach(s => { const e = document.querySelector(s); if (e && !e.hidden) { const t = e.innerText || e.textContent || ''; if (t.trim()) window.__vu.add(t.replace(/\s+/g, ' ').trim()); } }); };
    new MutationObserver(noter).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'class'] }); setInterval(noter, 60); });
  const TAILLES = [['bureau', { width: 960, height: 540 }], ['telephone', { width: 390, height: 844 }], ['paysage', { width: 844, height: 390 }], ['petit', { width: 360, height: 560 }]];
  let pageBureau = null;
  for (const [nom, vp] of TAILLES) {
    const p = await ouvrir(vp); await ecouter(p);
    await bouton(p, '#title .vmenu', 'Nouvelle partie').click(); await p.waitForTimeout(700);
    const e1 = await p.evaluate(() => { const s = document.querySelector('#perso'), vis = e => { const r = e.getBoundingClientRect(); return r.width > 3 && r.height > 3 && r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1; };
      return { ouvert: !s.hidden, nom: (s.querySelector('input') || {}).value, tenues: s.querySelectorAll('.tenue').length, choisie: [...s.querySelectorAll('.tenue')].findIndex(b => b.classList.contains('choisie')), ok: (s.querySelector('.ok') || {}).textContent, okVisible: !!s.querySelector('.ok') && vis(s.querySelector('.ok')), champVisible: !!s.querySelector('input') && vis(s.querySelector('input')),
        figures: [...s.querySelectorAll('.vue img')].map(i => i.naturalWidth + '×' + i.naturalHeight), defile: s.scrollHeight > s.clientHeight + 1, large: s.scrollWidth > s.clientWidth + 1, retour: [...s.querySelectorAll('button')].some(b => /Retour/.test(b.textContent)) }; });
    await p.screenshot({ path: path.join(out, nom + '-1-ouverture.png') });
    if (!e1.ouvert) { ko(`BLOQUÉ ${nom} : « Nouvelle partie » n'ouvre pas « Ton personnage »`); await p.close(); continue; }
    if (e1.nom !== 'Idris' || e1.tenues !== 6 || e1.choisie !== 0 || e1.ok !== 'Commencer' || e1.retour) ko(`ÉCART ${nom} : l'écran ne s'ouvre pas sur « Idris » et sa tenue de toujours : ${JSON.stringify(e1)}`);
    if (!e1.okVisible) ko(`INVISIBLE ${nom} : « Commencer » n'est pas à l'écran sans défiler`); if (!e1.champVisible) ko(`INVISIBLE ${nom} : le champ du nom n'est pas à l'écran sans défiler`); if (e1.large) ko(`ÉCART ${nom} : l'écran déborde en largeur`);
    // un nom refusé bloque ; un nom accepté débloque
    await p.locator('#perso input').fill('Allah'); await p.waitForTimeout(150);
    const e2 = await p.evaluate(() => ({ note: document.querySelector('#perso .note').textContent, bloque: document.querySelector('#perso .ok').disabled }));
    await p.screenshot({ path: path.join(out, nom + '-2-refus.png') });
    if (!e2.bloque || !/Dieu/.test(e2.note)) ko(`ÉCART ${nom} : un nom refusé ne bloque pas « Commencer » (${JSON.stringify(e2)})`);
    await p.locator('#perso input').fill('Khalil'); await p.waitForTimeout(150);
    // chaque tenue se choisit et se voit
    const vues = []; for (let i = 0; i < 6; i++) { await p.waitForTimeout(650); await p.locator('#perso .tenue').nth(i).click(); await p.waitForTimeout(200);
      vues.push(await p.evaluate(() => ({ face: document.querySelector('#perso .vue img').src.length + ':' + document.querySelector('#perso .vue img').src.slice(-40), sous: document.querySelector('#perso .sous').textContent, n: [...document.querySelectorAll('#perso .tenue')].findIndex(b => b.classList.contains('choisie')) })));
      if (nom === 'bureau' || nom === 'telephone') await p.screenshot({ path: path.join(out, nom + '-3-tenue-' + (i + 1) + '.png') }); }
    if (new Set(vues.map(v => v.face)).size !== 6 || vues.some((v, i) => v.n !== i)) ko(`ÉCART ${nom} : toucher une tenue ne la montre pas (${vues.map(v => v.n + ' ' + v.sous).join(' | ')})`);
    await p.waitForTimeout(650); await p.locator('#perso .tenue').nth(4).click(); await p.waitForTimeout(650);
    const e3 = await p.evaluate(() => ({ bloque: document.querySelector('#perso .ok').disabled, qui: document.querySelector('#perso .qui').textContent }));
    if (e3.bloque || e3.qui !== 'Khalil') ko(`ÉCART ${nom} : « Khalil » ne débloque pas « Commencer » (${JSON.stringify(e3)})`);
    await p.locator('#perso .ok').click(); await p.waitForTimeout(900);
    const e4 = await p.evaluate(() => { const I = window.ISNAD; return { ferme: document.querySelector('#perso').hidden, profil: I.save.data.profil, monde: !!(I.world.saga && I.world.saga.id === 'idris'), heros: I.sagas.idris.heroes.idris.name, sceau: I.sagas.idris.heroes.idris.arabic }; });
    if (!e4.ferme || !e4.monde || e4.profil.nom !== 'Khalil' || e4.profil.tenue !== 'veilleur' || e4.heros !== 'Khalil' || e4.sceau !== '') { ko(`BLOQUÉ ${nom} : « Commencer » ne lance pas le prologue avec le personnage choisi : ${JSON.stringify(e4)}`); await p.close(); continue; }
    // le prologue en entier, joué par le joueur automatique ; tout ce qui s'affiche est relevé
    const joue = await p.evaluate(async () => { const I = window.ISNAD; I.audio.setOn(false); I.debug.auto = true; I.speed = 24; const log = I.debug.log = [];
      const fin = await new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (!document.querySelector('#chain').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 150000) { clearInterval(iv); res(false); } }, 100); });
      I.debug.auto = false; I.speed = 1; await new Promise(r => setTimeout(r, 400));
      const vu = [...window.__vu], tout = vu.join(' ¶ '), reste = vu.filter(t => /(^|[^A-Za-zÀ-ÿ])Idris(?![A-Za-zÀ-ÿ])/.test(t)).map(t => { const i = t.indexOf('Idris'); return t.slice(Math.max(0, i - 40), i + 30); });
      const ou = { dialogue: /Khalil/.test(vu.filter(t => !/MAILLON|Halte/.test(t)).join(' ')), combat: vu.some(t => /Khalil/.test(t) && /(Niv\.|Souffle|Frapper|Garde)/.test(t)), chaine: (document.querySelector('#chain').innerText || '').includes('Khalil') };
      return { fin, n: vu.length, fois: (tout.match(/Khalil/g) || []).length, reste: [...new Set(reste)].slice(0, 6), ou, log: log.filter(l => /BLOQUÉ|INACCESSIBLE|ABSENT|ERR /.test(l)), elide: (tout.match(/(?:de|que) Khalil/g) || []).length, faute: (tout.match(/(?:d|qu)[’']Khalil/g) || []).length }; });
    await p.screenshot({ path: path.join(out, nom + '-4-chaine.png') });
    if (!joue.fin || joue.log.length) ko(`BLOQUÉ ${nom} : le prologue ne se joue pas jusqu'à la Chaîne avec un personnage choisi (${joue.log.join(' ; ')})`);
    else if (joue.reste.length) joue.reste.forEach(r => ko(`ÉCART ${nom} : « Idris » s'affiche encore — …${r}…`));
    else if (!joue.ou.dialogue || !joue.ou.combat || !joue.ou.chaine || joue.faute) ko(`ÉCART ${nom} : le nom choisi ne paraît pas partout (${JSON.stringify(joue.ou)}, élisions fautives : ${joue.faute})`);
    else ok(`${nom} ${vp.width}×${vp.height} : « Ton personnage » s'ouvre sur Idris, refuse « Allah », montre les six tenues ; Khalil en manteau du veilleur joue tout le prologue — ${joue.n} textes relevés, « Khalil » ${joue.fois} fois (dialogue, combat, Chaîne), « de Khalil » ou « que Khalil » ${joue.elide} fois, plus un seul « Idris »${e1.defile ? ' · l’écran défile' : ''}`);
    sansErreur(nom); if (nom === 'bureau') pageBureau = p; else await p.close();
  }

  /* ---------- 4. le choix tient ; on en change ---------- */
  if (pageBureau) { const p = pageBureau;
    // depuis la Chaîne : « Ton personnage », une autre tenue, « Garder »
    await bouton(p, '#chain .chainfoot', 'Ton personnage').click(); await p.waitForTimeout(600);
    const c1 = await p.evaluate(() => { const s = document.querySelector('#perso'); return { ouvert: !s.hidden, nom: s.querySelector('input').value, choisie: [...s.querySelectorAll('.tenue')].findIndex(b => b.classList.contains('choisie')), boutons: [...s.querySelectorAll('.rang button')].map(b => b.textContent) }; });
    await p.locator('#perso .tenue').nth(1).click(); await p.waitForTimeout(650); await p.screenshot({ path: path.join(out, 'bureau-5-depuis-la-chaine.png') }); await bouton(p, '#perso', 'Garder').click(); await p.waitForTimeout(700);
    const c2 = await p.evaluate(() => ({ profil: window.ISNAD.save.data.profil, chaine: !document.querySelector('#chain').hidden, auto: (window.ISNAD.save.autoGet() || {}).profil }));
    if (!c1.ouvert || c1.nom !== 'Khalil' || c1.choisie !== 4 || !c1.boutons.includes('Garder') || !c1.boutons.some(b => /Retour/.test(b))) ko(`ÉCART depuis la Chaîne, « Ton personnage » ne reprend pas le choix : ${JSON.stringify(c1)}`);
    else if (c2.profil.tenue !== 'encre' || !c2.chaine || !c2.auto || c2.auto.tenue !== 'encre') ko(`ÉCART le changement de tenue n'est pas gardé : ${JSON.stringify(c2)}`);
    else ok('depuis la Chaîne : « Ton personnage » reprend le nom et la tenue choisis ; une autre tenue, « Garder », et la partie gardée la porte');
    // rechargée : « Continuer » retrouve le personnage
    const texte = await p.evaluate(() => window.ISNAD.save.exporter());
    await p.reload(); await p.waitForTimeout(1700); await bouton(p, '#title .vmenu', 'Continuer').click(); await p.waitForTimeout(1200);
    const c3 = await p.evaluate(() => { const I = window.ISNAD; return { nom: I.perso.nom(), heros: I.sagas.idris.heroes.idris.name, tenue: I.perso.profil().tenue, chaine: (document.querySelector('#chain').innerText || '').includes('Khalil') }; });
    if (c3.nom !== 'Khalil' || c3.heros !== 'Khalil' || c3.tenue !== 'encre' || !c3.chaine) ko(`ÉCART après rechargement, le personnage est perdu : ${JSON.stringify(c3)}`); else ok('page rechargée, « Continuer » : le râwî s’appelle toujours Khalil et porte sa tenue');
    // depuis la halte, au milieu d'un chapitre : le nom change, la silhouette du héros aussi
    const c4 = await p.evaluate(async () => { const I = window.ISNAD, W = I.world; I.audio.setOn(false); I.speed = 40; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null;
      await W.startChapter('idris', 0, { saga: 'idris', ci: 0, obj: 1, map: 'archives', opts: {}, pos: 'bureau', party: ['idris'], npcs: {}, foes: [], chests: [], flags: {} }); I.speed = 1;
      const avant = JSON.stringify(W.sheets[0].look); I.ui.pause(); const b = [...document.querySelectorAll('#menu .side button')].find(x => /Ton personnage/.test(x.textContent)); return { avant, entree: !!b }; });
    if (!c4.entree) ko('ABSENT la halte ne propose pas « Ton personnage »');
    else { await bouton(p, '#menu .side', 'Ton personnage').click(); await p.waitForTimeout(700); await bouton(p, '#menu .side', 'Ton personnage').click().catch(() => {}); await p.waitForTimeout(700);
      const ouvert = await p.evaluate(() => !document.querySelector('#perso').hidden);
      if (!ouvert) ko('BLOQUÉ à la halte, « Ton personnage » n’ouvre pas l’écran');
      else { await p.locator('#perso input').fill('Sélim'); await p.locator('#perso .tenue').nth(5).click(); await p.waitForTimeout(650); await p.screenshot({ path: path.join(out, 'bureau-6-depuis-la-halte.png') }); await bouton(p, '#perso', 'Garder').click(); await p.waitForTimeout(900);
        const c5 = await p.evaluate(() => { const I = window.ISNAD, W = I.world; return { nom: I.perso.nom(), heros: W.hero('idris').def.name, apres: JSON.stringify(W.sheets[0].look), monde: I.scene === W && !I.ui.menuOpen, ferme: document.querySelector('#perso').hidden }; });
        await p.screenshot({ path: path.join(out, 'bureau-7-dans-le-chapitre.png') });
        if (c5.nom !== 'Sélim' || c5.heros !== 'Sélim' || c5.apres === c4.avant || !c5.monde || !c5.ferme) ko(`ÉCART depuis la halte, le changement ne prend pas : ${JSON.stringify(c5)}`); else ok('depuis la halte, au milieu d’un chapitre : nouveau nom, nouvelle tenue, et la silhouette du héros change aussitôt'); } }
    sansErreur('en changeant de personnage'); await p.close();
    // la partie exportée, importée dans un autre navigateur : le personnage vient avec elle
    const q = await ouvrir(); await bouton(q, '#title', 'Importer une partie').click(); await q.waitForSelector('#partie:not([hidden])'); await q.locator('#partie textarea').fill(texte); await q.waitForTimeout(650); await bouton(q, '#partie', 'Lire cette partie').click(); await q.waitForTimeout(700);
    await bouton(q, '#partie', /Reprendre cette partie|Remplacer ma partie/).click(); await q.waitForTimeout(1500);
    const c6 = await q.evaluate(() => { const I = window.ISNAD; return { nom: I.perso.nom(), tenue: I.perso.profil().tenue, heros: I.sagas.idris.heroes.idris.name, chaine: (document.querySelector('#chain').innerText || '').includes('Khalil') }; });
    if (c6.nom !== 'Khalil' || c6.tenue !== 'encre' || c6.heros !== 'Khalil' || !c6.chaine) ko(`ÉCART une partie importée perd son personnage : ${JSON.stringify(c6)}`); else ok('une partie exportée puis importée dans un autre navigateur garde son personnage : Khalil, capuche d’encre');
    // et un profil abîmé dans une partie importée ne passe pas : on retombe sur le nom d'origine
    const c7 = await q.evaluate(t => { const I = window.ISNAD, o = JSON.parse(t); o.partie.profil = { nom: '<img src=x onerror=alert(1)>', tenue: 'inconnue' }; const r = I.save.lireTexte(JSON.stringify(o)); if (!r.ok) return { refuse: r.erreur }; I.save.adopter(r.partie); return { nom: I.perso.nom(), tenue: I.perso.profil().tenue, heros: I.sagas.idris.heroes.idris.name }; }, texte);
    if (c7.refuse || c7.nom !== 'Idris' || c7.tenue !== 'archives' || c7.heros !== 'Idris') ko(`ÉCART un profil abîmé n'est pas ramené au personnage d'origine : ${JSON.stringify(c7)}`); else ok('un profil abîmé dans une partie importée (un nom qui n’en est pas un, une tenue inconnue) : le râwî redevient Idris, dans sa tenue de toujours');
    sansErreur('en important un personnage'); await q.close(); }

  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ PERSONNAGE : nom et tenue choisis, joués, gardés — aucune anomalie (captures dans ${path.relative(process.cwd(), out)})`);
  process.exit(anomalies ? 1 : 0);
})();
