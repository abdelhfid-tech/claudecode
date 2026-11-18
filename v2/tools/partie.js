#!/usr/bin/env node
/* ISNAD 2.0 — la partie du joueur : format, export, import.
   Usage : node tools/partie.js
   1. Une partie jouée (prologue, premier maillon, sa veillée et sa rencontre), dont le râwî a un autre nom et un habit
      composé pièce par pièce (2.x : profil.compo), s'exporte par les vrais boutons, en texte et en fichier ; effacée — un
      autre navigateur, vide —, elle se réimporte par les vrais boutons, à l'identique, son râwî avec elle, et
      « Continuer » la retrouve. Même chose au milieu d'un chapitre : on reprend au même objectif, dans le même lieu.
   2. Ce qui n'est pas une partie est refusé avec un message, et rien ne change : texte vide, texte abîmé, autre chose
      qu'une partie, partie d'un format plus récent, partie dont un champ n'a pas la forme attendue.
   3. Une partie de la 1.32 (format 1), prise dans la 1.32 gelée — lue seulement —, est acceptée et remise à jour.
   4. La 2.0 ne touche jamais aux clés de la 1.32, même posées dans le même navigateur.
   Sortie : « OK » par preuve, « ÉCART » ou « BLOQUÉ » sinon ; captures dans .smoke/partie/. Code 1 à la première anomalie. */
const fs = require('fs'), path = require('path'), os = require('os');
const { chromium } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/partie');
const url = 'file://' + path.join(V2, 'index.html'), url131 = 'file://' + path.join(V2, '..', 'archive', 'v1.32', 'index.html');   // la 1.32 archivée (D181) : lue seulement
fs.mkdirSync(out, { recursive: true });
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); };

(async () => {
  const browser = await chromium.launch(); let errors = [];
  const ouvrir = async (vp, u) => { const ctx = await browser.newContext({ viewport: vp || { width: 960, height: 540 }, hasTouch: !!vp && vp.width < 600, acceptDownloads: true }); const page = await ctx.newPage();
    page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(u || url); await page.waitForTimeout(1700); return page; };
  const sansErreur = quoi => { if (errors.length) { ko(`ÉCART erreur console (${quoi}) : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`); errors = []; } };
  const bouton = (page, dans, texte) => page.locator(`${dans} button`, { hasText: texte }).first();
  // ce qui compte d'une partie : tout, sauf l'heure de la dernière écriture et les options de l'appareil
  const coeur = d => { const c = JSON.parse(JSON.stringify(d)); delete c.opts; delete c.meta; return JSON.stringify(c, Object.keys(c).sort()); };
  const profond = (a, b) => { const tri = v => (Array.isArray(v) ? v.map(tri) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { o[k] = tri(v[k]); return o; }, {}) : v); const s = d => { const c = JSON.parse(JSON.stringify(d)); delete c.opts; delete c.meta; return JSON.stringify(tri(c)); }; return s(a) === s(b); };

  /* ---------- 1. jouer, exporter, effacer, importer ---------- */
  let page = await ouvrir();
  // les clés de la 1.32, posées dans ce navigateur : la 2.0 ne doit ni les lire, ni les changer, ni les effacer
  const TEMOINS = { 'isnad.auto.v1': '{"v":1,"temoin":"auto"}', 'isnad.slot.1': '{"v":1,"temoin":"slot"}', 'isnad.opts.v1': '{"temoin":"opts"}', 'isnad.save.v1': 'temoin' };
  await page.evaluate(T => { Object.keys(T).forEach(k => localStorage.setItem(k, T[k])); }, TEMOINS);
  const joue = await page.evaluate(async () => { const I = window.ISNAD, W = I.world; I.debug.auto = true; I.speed = 40; I.audio.setOn(false); I.save.reset(); I.save.data.started = true;
    const cache = () => document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }), chaine = () => new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (!document.querySelector('#chain').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 200000) { clearInterval(iv); res(false); } }, 100); });
    cache(); W.roster = {}; W.saga = null; W.startChapter('idris', 0); if (!await chaine()) return { ok: false, ou: 'prologue' };
    cache(); W.roster = {}; W.saga = null; I.ui.startSaga(I.sagas.abubakr); if (!await chaine()) return { ok: false, ou: 'premier maillon' };
    I.debug.auto = false; I.speed = 1; const sv = I.save.data;
    // 2.x — le râwî composé : un autre nom, un ensemble, et dix pièces (des identifiants pris dans D.RAWI)
    const refus = I.perso.choisir('Khalil', 'encre', { teint: 't6', barbe: 2, poil: 'p3', coiffe: 'calotte', manteau: 'epaule', longue: true, echarpe: true, etoffe: 'e7', neon: 'n4', objet: 'feuillets' }); I.save.store();
    if (refus || !sv.profil.compo || Object.keys(sv.profil.compo).length !== 10) return { ok: false, ou: 'le râwî composé (' + (refus || JSON.stringify(sv.profil)) + ')' };
    return { ok: true, compo: Object.keys(sv.profil.compo).length, look: JSON.stringify(I.sagas.idris.heroes.idris.look), lumieres: sv.lights.length, savoirs: sv.codex.length, veillees: Object.keys(sv.veillees).length, rencontres: Object.keys(sv.rencontres || {}).length, partie: JSON.parse(JSON.stringify(sv)) }; });
  if (!joue.ok) { ko(`BLOQUÉ la partie de départ ne se joue pas (${joue.ou})`); await browser.close(); process.exit(1); }
  ok(`une partie est jouée : prologue, premier maillon, sa veillée et sa rencontre — ${joue.lumieres} Lumière, ${joue.savoirs} savoirs ; son râwî s’appelle Khalil et porte un habit composé de ${joue.compo} pièces`);
  // exporter par le bouton de la Chaîne
  await bouton(page, '#chain .chainfoot', 'Exporter la partie').click(); await page.waitForSelector('#partie:not([hidden])'); await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, '01-exporter.png') });
  const texte = await page.locator('#partie textarea').inputValue();
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }).catch(() => null), bouton(page, '#partie', 'Enregistrer le fichier').click()]);
  let fichier = null; if (dl) { fichier = path.join(os.tmpdir(), 'isnad-partie-essai-' + process.pid + '.json'); await dl.saveAs(fichier); }
  const noteF = await page.locator('#partie .note').textContent();
  await bouton(page, '#partie', 'Copier le texte').click(); await page.waitForTimeout(300); const noteC = await page.locator('#partie .note').textContent();
  let env = null; try { env = JSON.parse(texte); } catch (e) { /* vu plus bas */ }
  if (!env || env.isnad !== 'partie' || env.format !== 2 || !env.partie) ko(`ÉCART le texte exporté n'est pas une partie au format 2 : ${texte.slice(0, 120)}`);
  else if (!profond(env.partie, joue.partie)) ko('ÉCART le texte exporté ne dit pas la partie jouée');
  else if (env.partie.opts !== undefined) ko('ÉCART le texte exporté emporte les options de l’appareil');
  else ok(`exportée par le bouton de la Chaîne : ${(texte.length / 1024).toFixed(0)} Ko de texte, format ${env.format}, « ${env.jeu} »`);
  if (!dl) ko(`ÉCART aucun fichier n'a été remis au navigateur (« ${noteF} »)`);
  else if (dl.suggestedFilename() !== 'isnad-partie.json' || fs.readFileSync(fichier, 'utf8') !== texte) ko(`ÉCART le fichier « ${dl.suggestedFilename()} » ne contient pas le texte exporté`);
  else ok(`le fichier « ${dl.suggestedFilename()} » contient le même texte · après « Copier » : « ${noteC} »`);
  await bouton(page, '#partie', 'Retour').click(); await page.waitForTimeout(300);
  if (await page.locator('#chain').isHidden()) ko('ÉCART « Retour » ne ramène pas à la Chaîne');
  const cles = await page.evaluate(T => Object.keys(T).filter(k => localStorage.getItem(k) !== T[k]), TEMOINS);
  const miennes = await page.evaluate(() => Object.keys(localStorage).filter(k => k.indexOf('isnad2.') === 0).sort());
  if (cles.length) ko(`ÉCART la 2.0 a touché aux clés de la 1.32 : ${cles.join(', ')}`); else ok(`les clés de la 1.32 posées dans le même navigateur sont intactes ; la 2.0 n'écrit que les siennes (${miennes.join(', ')})`);
  sansErreur('en exportant'); await page.close();

  // un autre navigateur, vide : l'écran-titre n'a rien à continuer ; on importe par les vrais boutons, en collant le texte
  const importer = async (vp, parFichier, nom) => { const p = await ouvrir(vp);
    const avant = await p.evaluate(() => Array.from(document.querySelectorAll('#title .vmenu button')).map(b => b.textContent));
    if (avant.some(t => /Continuer/.test(t))) ko('ÉCART un navigateur neuf propose déjà « Continuer »');
    await bouton(p, '#title', 'Réglages').click(); await bouton(p, '#title', 'Importer une partie').click(); await p.waitForSelector('#partie:not([hidden])'); await p.waitForTimeout(300);
    if (parFichier) await p.locator('#partie input[type=file]').setInputFiles(parFichier); else { await p.locator('#partie textarea').fill(texte); await p.screenshot({ path: path.join(out, nom + '-coller.png') }); await bouton(p, '#partie', 'Lire cette partie').click(); }
    await p.waitForTimeout(500); await p.screenshot({ path: path.join(out, nom + '-confirmer.png') });
    const resume = (await p.locator('#partie .resume').textContent().catch(() => '')) || '', boutons = await p.evaluate(() => Array.from(document.querySelectorAll('#partie button')).map(b => b.textContent));
    return { p, resume, boutons }; };
  const reprendre = async (p, attendu, quoi) => { await bouton(p, '#partie', /Reprendre cette partie|Remplacer ma partie/).click(); await p.waitForTimeout(1500);
    const e = await p.evaluate(() => { const I = window.ISNAD; return { partie: JSON.parse(JSON.stringify(I.save.data)), chaine: !document.querySelector('#chain').hidden, monde: I.scene === I.world, auto: !!I.save.autoGet(), avis: document.querySelector('#chain header p').textContent, look: JSON.stringify(I.sagas.idris.heroes.idris.look) }; });
    if (!profond(e.partie, attendu)) ko(`ÉCART ${quoi} : la partie reprise n'est pas la partie exportée`);
    else if (e.look !== joue.look) ko(`ÉCART ${quoi} : le râwî repris n'a pas l'habit composé qu'il portait (${e.look})`); return e; };
  let r = await importer(null, null, '02-importer');
  if (!/Lumière/.test(r.resume) || !r.boutons.some(t => /Reprendre cette partie/.test(t))) ko(`ÉCART l'import ne montre pas ce qu'il va reprendre : « ${r.resume} » [${r.boutons.join(' | ')}]`);
  let e = await reprendre(r.p, joue.partie, 'texte collé');
  if (!e.chaine) ko('BLOQUÉ après l’import, on n’arrive pas à la Chaîne'); else if (!e.auto) ko('ÉCART après l’import, la partie n’est pas gardée sur l’appareil');
  else ok(`effacée puis réimportée en collant le texte : la partie reprise est identique — le râwî composé avec elle, pièce par pièce —, on arrive à la Chaîne — « ${r.resume.replace(/\s+/g, ' ').slice(0, 110)} »`);
  // la page rechargée : « Continuer » retrouve la partie
  await r.p.reload(); await r.p.waitForTimeout(1700);
  const titre = await r.p.evaluate(() => Array.from(document.querySelectorAll('#title .vmenu button')).map(b => b.textContent));
  if (!titre.some(t => /^Continuer/.test(t))) ko(`ÉCART après rechargement, l'écran-titre ne propose pas « Continuer » : ${titre.join(' | ')}`); else ok(`page rechargée : l'écran-titre propose « ${titre[0].slice(0, 60)}… »`);
  sansErreur('en important un texte'); await r.p.close();
  if (fichier) { r = await importer({ width: 390, height: 844 }, fichier, '03-importer-mobile'); e = await reprendre(r.p, joue.partie, 'fichier choisi');
    if (!e.chaine) ko('BLOQUÉ après l’import du fichier, on n’arrive pas à la Chaîne'); else ok('réimportée en choisissant le fichier, sur un écran de téléphone : identique, on arrive à la Chaîne');
    sansErreur('en important un fichier'); await r.p.close(); }

  // au milieu d'un chapitre : la partie exportée reprend au même objectif, dans le même lieu
  page = await ouvrir();
  const milieu = await page.evaluate(async () => { const I = window.ISNAD, W = I.world; I.debug.auto = true; I.speed = 40; I.audio.setOn(false); I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true;
    document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null; I.ui.startSaga(I.sagas.umar);
    const pret = await new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { const c = I.save.data.cp; if (c && c.saga === 'umar' && c.obj >= 2) { I.debug.auto = false; clearInterval(iv); res(true); } else if (Date.now() - t0 > 120000) { clearInterval(iv); res(false); } }, 20); });
    return { pret, texte: I.save.exporter(), cp: JSON.parse(JSON.stringify(I.save.data.cp)) }; });
  await page.close(); errors = [];
  if (!milieu.pret) ko('BLOQUÉ pas de point de reprise au milieu du chapitre');
  else { const p = await ouvrir(); await bouton(p, '#title', 'Réglages').click(); await bouton(p, '#title', 'Importer une partie').click(); await p.waitForSelector('#partie:not([hidden])'); await p.locator('#partie textarea').fill(milieu.texte); await bouton(p, '#partie', 'Lire cette partie').click(); await p.waitForTimeout(400);
    await bouton(p, '#partie', /Reprendre cette partie|Remplacer ma partie/).click(); await p.waitForTimeout(2500);
    const ou = await p.evaluate(() => { const I = window.ISNAD, W = I.world; return { monde: I.scene === W, saga: W.saga && W.saga.id, ci: W.ci, obj: W.objIndex, carte: W.map && W.map.id, groupe: W.party.join('+') }; });
    await p.screenshot({ path: path.join(out, '04-reprise-en-chapitre.png') });
    if (!ou.monde || ou.saga !== milieu.cp.saga || ou.ci !== milieu.cp.ci || ou.obj !== milieu.cp.obj || ou.carte !== milieu.cp.map) ko(`ÉCART reprise au milieu d'un chapitre : ${JSON.stringify(ou)} — attendu ${milieu.cp.saga} chapitre ${milieu.cp.ci} objectif ${milieu.cp.obj} carte ${milieu.cp.map}`);
    else ok(`exportée au milieu d'un chapitre, elle reprend au même endroit : ${ou.saga}, chapitre ${ou.ci + 1}, objectif ${ou.obj + 1}, lieu ${ou.carte}, groupe ${ou.groupe}`);
    sansErreur('en reprenant au milieu d’un chapitre'); await p.close(); }

  /* ---------- 2. ce qui n'est pas une partie est refusé, et rien ne change ---------- */
  page = await ouvrir(); await bouton(page, '#title', 'Réglages').click(); await bouton(page, '#title', 'Importer une partie').click(); await page.waitForSelector('#partie:not([hidden])');
  const abime = (f) => { const o = JSON.parse(texte); f(o); return JSON.stringify(o); };
  const REFUS = [['un texte vide', '', 'rien à lire'], ['un texte quelconque', 'bonjour', 'abîmé'], ['un texte coupé', texte.slice(0, Math.floor(texte.length / 2)), 'abîmé'], ['autre chose qu’une partie', '{"a":1}', 'pas une partie'],
    ['une partie d’un format plus récent', abime(o => { o.partie.v = 9; }), 'plus récente'], ['des Lumières qui n’existent pas', abime(o => { o.partie.lights = ['lueur']; }), 'abîmée'], ['un point de reprise sans forme', abime(o => { o.partie.cp = 'ici'; }), 'abîmée'],
    ['un niveau impossible', abime(o => { o.partie.heroes['abubakr:abubakr'] = { lvl: 9999, xp: 0 }; }), 'abîmée'], ['une besace qui n’en est pas une', abime(o => { o.partie.items = [1, 2]; }), 'abîmée'], ['un texte démesuré', '{"isnad":"partie","partie":{"v":2,"x":"' + 'a'.repeat(2100000) + '"}}', 'trop long']];
  const etat = () => page.evaluate(() => JSON.stringify([window.ISNAD.save.data, Object.keys(localStorage).filter(k => k.indexOf('isnad2.') === 0).map(k => k + localStorage.getItem(k).length)]));
  const e0 = await etat(); let bien = 0;
  for (const [quoi, t, raison] of REFUS) { await page.locator('#partie textarea').fill(t); await page.waitForTimeout(650); await bouton(page, '#partie', 'Lire cette partie').click(); await page.waitForTimeout(150);   // un bouton ne répond pas deux fois en moins de 600 ms
    const note = (await page.locator('#partie .note').textContent().catch(() => '')) || '', confirme = await page.locator('#partie .resume').count();
    if (confirme) { ko(`ÉCART ${quoi} : accepté`); await page.waitForTimeout(650); await bouton(page, '#partie', 'Annuler').click(); await page.waitForTimeout(200); } else if (!note.includes(raison)) ko(`ÉCART ${quoi} : refusé sans le bon message (« ${note} »)`); else bien++; }
  await page.screenshot({ path: path.join(out, '05-refus.png') });
  if (await etat() !== e0) ko('ÉCART un import refusé a changé quelque chose'); else if (bien === REFUS.length) ok(`${bien} textes qui ne sont pas des parties, tous refusés avec leur message, sans rien changer (${REFUS.map(x => x[0]).join(' ; ')})`);
  sansErreur('en refusant'); await page.close();

  /* ---------- 3. une partie de la 1.32, prise dans la 1.32 gelée (lue seulement) ---------- */
  const p1 = await ouvrir(null, url131);
  const v1 = await p1.evaluate(async () => { const I = window.ISNAD, W = I.world; I.debug.auto = true; I.speed = 40; I.audio.setOn(false); I.save.reset(); I.save.data.started = true;
    document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null; W.startChapter('idris', 0);
    const fin = await new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (!document.querySelector('#chain').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 120000) { clearInterval(iv); res(false); } }, 100); });
    return { fin, version: window.ISNAD_VERSION, texte: JSON.stringify(I.save.data), v: I.save.data.v }; });
  await p1.close(); errors = [];
  if (!v1.fin || v1.v !== 1) ko(`BLOQUÉ la 1.32 ne donne pas de partie au format 1 (${JSON.stringify({ fin: v1.fin, v: v1.v })})`);
  else { const p = await ouvrir(); await bouton(p, '#title', 'Réglages').click(); await bouton(p, '#title', 'Importer une partie').click(); await p.waitForSelector('#partie:not([hidden])'); await p.locator('#partie textarea').fill(v1.texte); await bouton(p, '#partie', 'Lire cette partie').click(); await p.waitForTimeout(400);
    const resume = (await p.locator('#partie .resume').textContent().catch(() => '')) || ''; await p.screenshot({ path: path.join(out, '06-partie-de-la-1.32.png') });
    if (!/format plus ancien/.test(resume)) ko(`ÉCART une partie de la 1.32 n'est pas reconnue comme un format plus ancien : « ${resume} »`);
    else { await bouton(p, '#partie', /Reprendre cette partie|Remplacer ma partie/).click(); await p.waitForTimeout(1500);
      const s = await p.evaluate(() => { const d = window.ISNAD.save.data; return { v: d.v, prologue: d.prologue, profil: typeof d.profil, paquets: typeof d.paquets, chaine: !document.querySelector('#chain').hidden, savoirs: d.codex.length }; });
      if (s.v !== 2 || !s.prologue || !s.chaine || s.profil !== 'object') ko(`ÉCART partie de la 1.32 mal reprise : ${JSON.stringify(s)}`); else ok(`une partie de la 1.32 (« ${v1.version} », format 1) est acceptée, remise au format ${s.v}, et se reprend à la Chaîne — ${s.savoirs} savoirs`); }
    sansErreur('en reprenant une partie de la 1.32'); await p.close(); }

  /* ---------- 3 bis. dans un Artifact, la page ne peut pas remettre un fichier : l'export n'y propose que la copie ---------- */
  { const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } }); await ctx.addInitScript(() => { window.claude = { hot: {} }; }); const p = await ctx.newPage();
    p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); }); await p.goto(url); await p.waitForTimeout(1700);
    const a = await p.evaluate(async () => { const I = window.ISNAD; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; I.save.data.prologue = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); await I.ui.showChain();
      [...document.querySelectorAll('#chain .chainfoot button')].find(b => /Exporter la partie/.test(b.textContent)).click(); await new Promise(r => setTimeout(r, 400));
      const s = document.querySelector('#partie'); return { ouvert: !s.hidden, boutons: [...s.querySelectorAll('button')].map(b => b.textContent), texte: (s.querySelector('textarea') || {}).value || '', dit: s.querySelector('header p').textContent }; });
    await p.screenshot({ path: path.join(out, '07-exporter-dans-un-artifact.png') });
    if (!a.ouvert || a.boutons.some(b => /fichier/i.test(b)) || !a.boutons.some(b => /Copier le texte/.test(b)) || a.texte.indexOf('"isnad":"partie"') < 0) ko(`ÉCART dans un Artifact, l'export propose encore un fichier ou perd la copie : ${JSON.stringify({ boutons: a.boutons, n: a.texte.length })}`);
    else ok(`dans un Artifact, où une page ne peut pas remettre de fichier : l'export ne propose que « ${a.boutons.filter(b => /Copier/.test(b))[0]} » et le texte — « ${a.dit.slice(0, 70)}… »`);
    sansErreur('dans un Artifact'); await ctx.close(); }

  /* ---------- 4. les emplacements : écrits au format 2 ; un emplacement d'un premier assemblage de la 2.0 (format 1) se relit ---------- */
  page = await ouvrir();
  const emp = await page.evaluate(vieux => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; I.save.data.prologue = true; I.save.data.lights = ['sidq'];
    const w = I.save.write(2, { label: 'essai' }), brut = JSON.parse(localStorage.getItem('isnad2.slot.2')); localStorage.setItem('isnad2.slot.1', vieux);
    const L = I.save.slots(); I.save.data.lights = []; const lu = I.save.read(1), apres = { v: I.save.data.v, codex: I.save.data.codex.length, profil: typeof I.save.data.profil };
    localStorage.removeItem('isnad2.slot.1'); localStorage.removeItem('isnad2.slot.2');
    return { w, ecrit: { v: brut.v, paquets: typeof brut.paquets, profil: typeof brut.profil }, liste: L.map(d => (d ? d.v : null)), lu, apres }; }, v1.texte || '{"v":1,"started":true,"codex":[]}');
  if (!emp.w || emp.ecrit.v !== 2 || emp.ecrit.paquets !== 'object') ko(`ÉCART un emplacement n'est pas écrit au format 2 : ${JSON.stringify(emp.ecrit)}`);
  else if (JSON.stringify(emp.liste) !== '[2,2,null]' || !emp.lu || emp.apres.v !== 2) ko(`ÉCART un emplacement au format 1 ne se relit pas : ${JSON.stringify(emp)}`);
  else ok('les emplacements s’écrivent au format 2, avec le profil et les paquets posés ; un emplacement au format 1 se relit, remis à jour');
  const abimee = await page.evaluate(() => { const I = window.ISNAD; localStorage.setItem('isnad2.slot.3', JSON.stringify({ v: 2, started: true, prologue: true, equip: { 'abubakr:abubakr': null, 'umar:umar': { md: 'piece_inconnue', tete: 7 } }, gear: null, cp: { saga: 'nulle_part', ci: 0, obj: 0, map: 'x', party: [] } }));
    let lu = false, jet = ''; try { lu = I.save.read(3); } catch (e) { jet = e.message; } const d = I.save.data, r = { lu, jet, equip: JSON.stringify(d.equip), reserve: JSON.stringify(d.gear), cp: d.cp, avis: I.save.avis }; localStorage.removeItem('isnad2.slot.3'); I.save.reset(); return r; });
  if (!abimee.lu || abimee.jet || abimee.cp !== null || abimee.equip !== '{"umar:umar":{}}' || abimee.reserve !== '{"piece_inconnue":1}') ko(`ÉCART une copie gardée abîmée ne se relit pas proprement : ${JSON.stringify(abimee)}`);
  else ok('une copie gardée abîmée sur l’appareil se relit sans trébucher : ce qui n’a pas de forme est écarté, la pièce inconnue va à la réserve, on reprend à la Chaîne');
  sansErreur('sur les emplacements'); await page.close();

  await browser.close(); if (fichier) { try { fs.unlinkSync(fichier); } catch (x) { /* déjà parti */ } }
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ PARTIE : exportée, effacée, réimportée à l'identique — aucune anomalie (captures dans ${path.relative(process.cwd(), out)})`);
  process.exit(anomalies ? 1 : 0);
})();
