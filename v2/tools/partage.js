#!/usr/bin/env node
/* ISNAD 2.x — partager sa progression (src/core/partage.js ; demande du décideur, 19 novembre).
   Usage : node v2/tools/partage.js
   1. Avant tout maillon achevé (le prologue joué), ni la Chaîne ni la halte n'offrent « Partager ma progression ».
   2. Une partie avancée — le prologue et deux maillons joués par le joueur automatique, le râwî nommé et composé — : le
      bouton est au pied de la Chaîne ; touché, l'aperçu s'ouvre ; l'image se dessine, carrée (1080 × 1080) puis
      verticale (1080 × 1920) par le bouton du format, avec et sans le personnage, et n'est pas vide ; le seul personnage
      dessiné est le râwî (aucun Compagnon) ; aucune leçon n'est proposée.
   3. Dans les quatre langues : le texte et ce que l'image porte disent le nom, les maillons, la réserve (dans la langue)
      et l'adresse (celle de v2/tools/promotion.js) ; ils ne disent aucun mot des œuvres, du cœur, des lames, des idées
      noires, des Valeurs et attributs, de la descente, des figures, du Nom divin, ni des combats. Images dans .smoke/partage/.
   4. La halte : le bouton y est, sous « Reprendre » ; l'aperçu dit le chapitre en cours ; « ◂ Retour » rend la halte ;
      Échap ferme l'aperçu.
   5. Le partage, au doigt sur un téléphone : navigator.share qui sait partager l'image (le fichier PNG et le texte
      partent) ; absent, ou qui ne sait pas partager un fichier, ou qui refuse, ou qui lève une erreur : le repli (le texte
      copié, l'image en grand, un message) ; annulé : rien de plus ; le presse-papiers refusé : le texte sélectionné et dit ;
      dans un Artifact, pas de bouton d'enregistrement. Au bureau, « Enregistrer l'image » remet un PNG de la bonne taille.
   6. Aucune requête hors du fichier, des images data: / blob: et des polices ; aucune erreur console ; aucun texte de
      l'aperçu sous dix points sur un téléphone.
   Sortie : « OK » par preuve ; « BLOQUÉ », « ABSENT », « INVISIBLE », « ÉCART » sinon ; « PARTAGE CONFORME » à la fin.
   Code 1 à la première anomalie. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/partage');
const url = 'file://' + path.join(V2, 'index.html');
const PROMO = require('./promotion.js');
fs.mkdirSync(out, { recursive: true });
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); };
const si = (c, bien, mal) => (c ? ok(bien) : ko(mal));
const LANGUES = ['fr', 'ar', 'en'];   // (2.36, D230 : le japonais est retiré du jeu)
// ce que le texte ne dit jamais, mot à mot, dans chaque langue (en plus des noms que le jeu donne lui-même : plus bas)
const INTERDITS = {
  fr: /pri[èe]re|dhikr|je[ûu]ne|aum[ôo]ne|p[èe]lerinage|provision|\blames?\b|id[ée]es? noires?|maux du c|mal du c|\bvaleurs?\b|attributs?|descente|noosph|victoire|vaincu|combat|bataille|\bh[ée]ros\b|\bsaint\b|\bsage\b|figure|Allah|\bDieu\b|pilier|pourparler/i,
  en: /prayer|dhikr|fasting|\bfast\b|charity|alms|pilgrimage|\bhajj\b|provision|blade|dark notion|ailment|\bvalues?\b|attribute|descent|noosphere|victor|defeat|battle|combat|\bheroe?s?\b|\bsaint\b|\bsage\b|figure|Allah|\bGod\b|pillar|parley/i,
  ar: /الصلاة|صلاة|الذِّكر|الذكر|الصيام|الصدقة|الحجّ|زاد القلب|النصال|نصل|الخواطر|خاطر|أدواء|الفضائل|الأسماء الحسنى|عالم الأفكار|نزول|انتصار|هزيمة|معركة|البطل|الحكيم|القدّيس|الله|الأركان|المفاوضة/,
  ja: /礼拝|ズィクル|断食|施し|巡礼|心の糧|刃|暗い想い|悪徳|美徳|御名|精神圏|降り|勝利|敗北|戦い|英雄|賢者|聖者|アッラー|柱|交渉/
};

(async () => {
  const browser = await chromium.launch(); let errors = [], dehors = [];
  const ouvrir = async (o) => { o = o || {}; const ctx = await browser.newContext(Object.assign({ viewport: { width: 960, height: 540 }, acceptDownloads: true }, o.ctx || {})); const p = await ctx.newPage();
    p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    p.on('request', r => { const u = r.url(); if (!/^(file|data|blob):|^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u)) dehors.push(u); });
    await p.goto(url); await p.waitForTimeout(1700); return p; };
  const sansErreur = quoi => { if (errors.length) { ko(`ÉCART erreur console (${quoi}) : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`); errors = []; } else ok(`aucune erreur console (${quoi})`); };
  const visible = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); return !!e && !e.hidden && e.getBoundingClientRect().height > 0; }, sel);
  const bouton = (p, dans, texte) => p.locator(`${dans} button`, { hasText: texte }).first();
  const libelle = (p, fr) => p.evaluate(t => window.ISNAD.t(t), fr);
  // l'aperçu prêt : une image neuve, dans la langue et le format voulus
  const pret = (p, l, format, perso) => p.waitForFunction(([l, f, q]) => { const d = window.ISNAD.partage.dernier, a = document.querySelector('#partage .apercu'); return !!d && d.lang === l && d.format === f && (q === undefined || d.perso === q) && a && a.getAttribute('aria-busy') === 'false' && !document.querySelector('#partage').hidden; }, [l, format, perso], { timeout: 30000 }).then(() => true, () => false);
  const oublier = p => p.evaluate(() => { window.ISNAD.partage.dernier = null; });
  const ecrirePng = (url, nom) => { fs.writeFileSync(path.join(out, nom), Buffer.from(url.split(',')[1], 'base64')); };
  // l'image n'est pas vide : beaucoup de couleurs, et du texte clair sur le fond sombre
  const mesurer = p => p.evaluate(() => new Promise(res => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data, coul = new Set(); let clairs = 0; for (let i = 0; i < d.length; i += 4 * 37) { coul.add((d[i] >> 3) << 10 | (d[i + 1] >> 3) << 5 | (d[i + 2] >> 3)); if (d[i] + d[i + 1] + d[i + 2] > 600) clairs++; }
    res({ w: im.width, h: im.height, couleurs: coul.size, clairs }); }; im.onerror = () => res({ w: 0, h: 0, couleurs: 0, clairs: 0 }); im.src = window.ISNAD.partage.dernier.url; }));
  // les noms que le jeu donne lui-même à la vie intérieure, aux figures, au mal, dans la langue courante
  const nomsInterdits = p => p.evaluate(() => { const I = window.ISNAD, C = I.sagas.coeur, D = I.D, L = [];
    const met = v => { if (typeof v === 'string' && v.trim().length > 1) L.push(v.trim()); };
    Object.keys(C.oeuvres).forEach(k => { met(C.oeuvres[k].name); met(C.oeuvres[k].court); });
    Object.keys(C.lames).forEach(k => met(C.lames[k].name)); Object.keys(C.enemies).forEach(k => met(C.enemies[k].name));
    Object.keys(C.attributs).forEach(k => { met(C.attributs[k].nom); met(C.attributs[k].sens); }); Object.keys(C.animaux).forEach(k => met(C.animaux[k].name));
    if (I.valeurs && I.valeurs.IDS) I.valeurs.IDS.forEach(v => met(I.valeurs.nom(v)));
    Object.keys(D.POSTURES || {}).forEach(k => met(D.POSTURES[k].nom));   // (les piliers de la Citadelle portent les noms de deux Lumières : « pilier » est cherché à part)
    ['Provision du cœur', 'Œuvres et lames', 'Valeurs et attributs', 'Les degrés du mal', 'Compagnons de lumière', 'Les idées noires', 'Les sept Valeurs', 'La noosphère', 'Pourparlers réussis : <b>{reussis}</b> / {total}'].forEach(t => met(I.t(t).replace(/<[^>]+>|\{\w+\}/g, '').replace(/[:：]\s*\/?\s*$/, '')));
    return [...new Set(L)].filter(x => x.replace(/[\s:：/]/g, '').length > 1); });
  const verifierTexte = async (p, l, quoi, attendu) => {
    const r = await p.evaluate(() => { const d = window.ISNAD.partage.dernier; return { texte: d.texte, image: d.textes.join('\n'), zone: document.querySelector('#partage textarea').value, reserve: window.ISNAD.t(window.ISNAD_PROMO.RESERVE), promo: window.ISNAD_PROMO }; });
    const noms = await nomsInterdits(p), net = s => s.replace(/\s+/g, '');
    si(r.zone === r.texte, `${l} · ${quoi} : le texte montré est celui qui part`, `ÉCART ${l} · ${quoi} : le texte de l'aperçu n'est pas celui qui part`);
    si(r.promo.ADRESSE === PROMO.ADRESSE && r.promo.RESERVE === PROMO.RESERVE, `${l} · l'adresse et la réserve viennent de v2/tools/promotion.js`, `ÉCART ${l} · window.ISNAD_PROMO ne dit pas ce que dit v2/tools/promotion.js : ${JSON.stringify(r.promo)}`);
    for (const [ou, t] of [['le texte', r.texte], ['l’image', r.image]]) {
      const manque = [['le nom', attendu.nom], ['les maillons', ou === 'le texte' ? attendu.phrase : attendu.maillons], ['la réserve', r.reserve], ['l’adresse', PROMO.ADRESSE]].filter(([, v]) => !net(t).includes(net(v))).map(([k]) => k);
      if (ou === 'le texte' && l !== 'fr' && r.reserve === PROMO.RESERVE) manque.push('la réserve dans la langue');
      si(!manque.length, `${l} · ${quoi} · ${ou} dit le nom, les maillons (« ${ou === 'le texte' ? attendu.phrase : attendu.maillons} »), la réserve et l’adresse`, `ABSENT ${l} · ${quoi} · ${ou} ne dit pas ${manque.join(', ')} : ${JSON.stringify(t).slice(0, 300)}`);
      const m1 = t.match(INTERDITS[l]), m2 = noms.filter(n => t.includes(n));
      si(!m1 && !m2.length, `${l} · ${quoi} · ${ou} : aucun mot des œuvres, du cœur, des Valeurs, de la descente, des figures ni des combats (${noms.length} noms du jeu cherchés)`, `ÉCART ${l} · ${quoi} · ${ou} dit « ${(m1 && m1[0]) || m2.join(', ')} » : ${JSON.stringify(t).slice(0, 300)}`);
    }
    return r.texte;
  };

  /* ---------- 1. avant tout maillon : pas de bouton ---------- */
  let p = await ouvrir();
  const prologue = await p.evaluate(async () => { const I = window.ISNAD, W = I.world; I.debug.auto = true; I.speed = 40; I.audio.setOn(false); I.save.reset(); I.save.data.started = true;
    const cache = () => document.querySelectorAll('.screen').forEach(e => { e.hidden = true; });
    // le joueur a la main : dans un lieu, ni récit en cours, ni combat, ni écran ouvert (on fait avancer ce qui se lit)
    window.__main = async () => { for (let i = 0; i < 300; i++) { if (I.scene === W && W.map && W.saga && !I.script.busy && !W.lock && !I.ui.menuOpen && !I.battle.active && !document.querySelector('.screen:not([hidden])')) return true; I.input.emit('ok'); await new Promise(r => setTimeout(r, 150)); } return false; };
    window.__chaine = () => new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (!document.querySelector('#chain').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 240000) { clearInterval(iv); res(false); } }, 100); });
    cache(); W.roster = {}; W.saga = null; W.startChapter('idris', 0); return window.__chaine(); });
  if (!prologue) { ko('BLOQUÉ le prologue ne mène pas à la Chaîne'); await browser.close(); process.exit(1); }
  { const L = await p.evaluate(() => [...document.querySelectorAll('#chain .chainfoot button')].map(b => b.textContent));
    si(!L.some(t => /Partager/.test(t)), `le prologue joué, aucun maillon achevé : la Chaîne n’offre pas le partage (${L.length} boutons au pied)`, `ÉCART la Chaîne offre le partage avant tout maillon : ${JSON.stringify(L)}`); }
  // la halte, dans une autre page : le prologue achevé, aucun maillon — le premier récit ouvert, la main au joueur
  { const h = await ouvrir();
    const L = await h.evaluate(async () => { const I = window.ISNAD, W = I.world; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; I.save.data.prologue = true;
      document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
      W.roster = {}; W.saga = null; W.startChapter('abubakr', 0);
      for (let i = 0; i < 300; i++) { if (I.scene === W && W.map && W.saga && !I.script.busy && !W.lock && !I.ui.menuOpen && !I.battle.active && !document.querySelector('.screen:not([hidden])')) break; I.input.emit('ok'); await new Promise(r => setTimeout(r, 150)); }
      I.ui.pause(); const n = [...document.querySelectorAll('#menu .side button')].map(b => b.textContent.trim()); I.input.emit('cancel'); return n; });
    si(L.includes(await libelle(h, 'Reprendre')) && !L.some(t => /Partager/.test(t)), `dans un récit, avant tout maillon : la halte n’offre pas le partage (${L.length} rubriques)`, `ÉCART la halte, avant tout maillon : ${JSON.stringify(L)}`);
    await h.context().close(); }
  sansErreur('avant tout maillon');

  /* ---------- 2. une partie avancée : deux maillons ---------- */
  // (la suite de la même partie : le prologue vient d'être joué)
  const joue = await p.evaluate(async () => { const I = window.ISNAD, W = I.world; I.debug.auto = true; I.speed = 40;
    const cache = () => document.querySelectorAll('.screen').forEach(e => { e.hidden = true; });
    for (const id of ['abubakr', 'umar']) { cache(); W.roster = {}; W.saga = null; I.ui.startSaga(I.sagas[id]); if (!await window.__chaine()) return { ok: false, ou: id }; }
    I.debug.auto = false; I.speed = 1; const sv = I.save.data;
    const refus = I.perso.choisir('Khalil'); I.save.store(); I.save.auto('La Chaîne');
    return { ok: !refus, ou: refus || '', maillons: I.save.maillons(), lumieres: sv.lights.slice(), isnad: sv.isnad, texte: I.save.exporter() }; });
  if (!joue.ok || joue.maillons.length !== 2) { ko(`BLOQUÉ la partie avancée ne se joue pas (${joue.ou || JSON.stringify(joue.maillons)})`); await browser.close(); process.exit(1); }
  ok(`une partie avancée : le prologue, puis ${joue.maillons.join(' et ')} achevés par le joueur automatique (Lumières ${joue.lumieres.join(', ')} ; fidélité ${joue.isnad.ok} / ${joue.isnad.total}) ; le râwî s’appelle Khalil`);
  // (un écran fermé à la main laisse ses touches en place : I.input.reset() les retire, comme dans les autres contrôles)
  await p.evaluate(() => { const I = window.ISNAD; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); I.ui.showChain();
    // ce que le moteur dessine, et les leçons qu'il propose, pendant tout ce qui suit
    window.__figures = []; const f = I.gfx.figure; I.gfx.figure = function (look) { window.__figures.push((look && look.kind) || '?'); return f.apply(this, arguments); };
    window.__lecons = 0; if (I.lecons && I.lecons.proposer) { const o = I.lecons.proposer; I.lecons.proposer = function () { window.__lecons++; return o.apply(this, arguments); }; } });
  await p.waitForTimeout(500);
  { const lab = await libelle(p, 'Partager ma progression'), b = bouton(p, '#chain .chainfoot', lab);
    si(await b.count() && await b.isVisible(), `deux maillons achevés : « ${lab} » est au pied de la Chaîne, à côté des Lumières et de la fidélité`, 'ABSENT le bouton du partage n’est pas au pied de la Chaîne');
    await oublier(p); await b.scrollIntoViewIfNeeded(); await b.click(); }
  si(await pret(p, 'fr', 'carre', true), 'touché, il ouvre l’aperçu : l’image se dessine', 'BLOQUÉ l’aperçu ne s’ouvre pas, ou l’image ne se dessine pas');
  await p.screenshot({ path: path.join(out, 'bureau-apercu.png') });
  { const m = await mesurer(p); si(m.w === 1080 && m.h === 1080 && m.couleurs > 400 && m.clairs > 200, `l’image carrée : ${m.w} × ${m.h}, ${m.couleurs} couleurs, du texte clair`, `ÉCART l’image carrée : ${JSON.stringify(m)}`); }
  const fig = await p.evaluate(() => window.__figures.slice());
  si(fig.length >= 1 && fig.every(k => k !== 'compagnon'), `le seul personnage dessiné est le râwî (type « ${[...new Set(fig)].join(', ')} ») : aucun Compagnon, seulement les sceaux de la Chaîne`, `ÉCART des personnages dessinés sur l’image : ${JSON.stringify(fig)}`);
  // sans le personnage, puis de nouveau avec
  await bouton(p, '#partage', await libelle(p, 'Ton personnage : montré')).click();
  si(await pret(p, 'fr', 'carre', false), 'sans le personnage, l’image se redessine', 'BLOQUÉ l’image sans le personnage ne se dessine pas');
  { const n = await p.evaluate(() => window.__figures.length); si(n === fig.length, 'sans le personnage, aucun personnage n’est dessiné', `ÉCART un personnage dessiné alors qu'il est caché (${n - fig.length})`); }
  ecrirePng(await p.evaluate(() => window.ISNAD.partage.dernier.url), 'fr-carre-sans-personnage.png');
  await p.waitForTimeout(700); await bouton(p, '#partage', await libelle(p, 'Ton personnage : caché')).click();   // (un bouton ignore un second toucher dans les 600 ms : tapable, ui.js)
  si(await pret(p, 'fr', 'carre', true), 'avec le personnage, de nouveau', 'BLOQUÉ l’image avec le personnage ne revient pas');
  // Échap referme l'aperçu et rend la Chaîne
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  si(await visible(p, '#chain') && !(await visible(p, '#partage')), 'Échap referme l’aperçu et rend la Chaîne', 'ÉCART Échap ne referme pas l’aperçu');

  /* ---------- 3. les quatre langues ---------- */
  const attendu = { nom: 'Khalil' };
  for (const l of LANGUES) {
    await p.evaluate(l => { const I = window.ISNAD; I.ui.langue(l); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); I.ui.showChain(); }, l); await p.waitForTimeout(400);
    const lab = await libelle(p, 'Partager ma progression'); await oublier(p); await bouton(p, '#chain .chainfoot', lab).click();
    if (!(await pret(p, l, 'carre', true))) { await p.screenshot({ path: path.join(out, 'bloque-' + l + '.png') });
      ko(`BLOQUÉ ${l} · l’aperçu ne s’ouvre pas : ${JSON.stringify(await p.evaluate(() => { const I = window.ISNAD; return { menuOpen: I.ui.menuOpen, ecrans: [...document.querySelectorAll('.screen')].filter(e => !e.hidden).map(e => e.id), dernier: I.partage.dernier && [I.partage.dernier.lang, I.partage.dernier.format], occupe: (document.querySelector('#partage .apercu') || {}).getAttribute && document.querySelector('#partage .apercu').getAttribute('aria-busy'), incidents: I.errors.map(e => e.msg).slice(-3) }; }))}`);
      await p.evaluate(() => { const b = [...document.querySelectorAll('#partage button')].pop(); if (b && !document.querySelector('#partage').hidden) b.click(); }); continue; }   // (l'aperçu refermé par son bouton : la suite n'en pâtit pas)
    Object.assign(attendu, await p.evaluate(() => ({ maillons: window.ISNAD.t('{n} maillon achevé sur {total}¦{n} maillons achevés sur {total}', { n: 2, total: 5 }),
      phrase: window.ISNAD.t('{nom} suit la Chaîne : {n} maillon achevé sur {total}.¦{nom} suit la Chaîne : {n} maillons achevés sur {total}.', { nom: 'Khalil', n: 2, total: 5 }) })));
    await p.screenshot({ path: path.join(out, l + '-apercu-bureau.png') });
    const t = await verifierTexte(p, l, 'carré', attendu); fs.writeFileSync(path.join(out, l + '-texte.txt'), t + '\n');
    ecrirePng(await p.evaluate(() => window.ISNAD.partage.dernier.url), l + '-carre.png');
    await bouton(p, '#partage', await libelle(p, 'Format : carré')).click();
    if (!(await pret(p, l, 'vertical', true))) { ko(`BLOQUÉ ${l} · l’image verticale ne se dessine pas`); continue; }
    { const m = await mesurer(p); si(m.w === 1080 && m.h === 1920 && m.couleurs > 400 && m.clairs > 200, `${l} · l’image verticale : ${m.w} × ${m.h}, ${m.couleurs} couleurs`, `ÉCART ${l} · l’image verticale : ${JSON.stringify(m)}`); }
    await verifierTexte(p, l, 'vertical', attendu); ecrirePng(await p.evaluate(() => window.ISNAD.partage.dernier.url), l + '-vertical.png');
    { const d = await p.evaluate(() => ({ dir: document.querySelector('#partage textarea').dir, html: document.documentElement.dir })); si(l !== 'ar' || (d.dir === 'rtl' && d.html === 'rtl'), `${l} · le texte s’écrit dans le sens de la langue (${d.dir})`, `ÉCART ${l} · le sens du texte : ${JSON.stringify(d)}`); }
    await p.waitForTimeout(700); await bouton(p, '#partage', await libelle(p, 'Format : vertical')).click(); await pret(p, l, 'carre', true);
    await bouton(p, '#partage', await libelle(p, '◂ Retour')).click(); await p.waitForTimeout(300);
  }
  await p.evaluate(() => window.ISNAD.ui.langue('fr'));
  si((await p.evaluate(() => window.__lecons)) === 0, 'aucune leçon n’a été proposée : le partage n’est pas un outil du jeu', 'ÉCART une leçon a été proposée pendant le partage');

  /* ---------- 4. la halte ---------- */
  const halte = await p.evaluate(async () => { const I = window.ISNAD, W = I.world; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
    W.roster = {}; W.saga = null; W.startChapter('khalid', 0); if (!await window.__main()) return { L: [], chapitre: '(la main ne revient pas)' };
    I.ui.pause(); const L = [...document.querySelectorAll('#menu .side button')].map(b => b.textContent.trim()); return { L, chapitre: W.ch && W.ch.title, recit: W.saga && W.saga.name }; });
  { const iR = halte.L.indexOf('Reprendre'), iP = halte.L.indexOf('Partager ma progression');
    si(iP > iR && iR >= 0 && iP <= iR + 3, `la halte : « Partager ma progression » sous « Reprendre » (${halte.L.slice(0, iP + 1).join(' · ')})`, `ABSENT la halte n’offre pas le partage sous « Reprendre » : ${JSON.stringify(halte.L)}`); }
  await bouton(p, '#menu .side', 'Partager ma progression').hover(); await p.waitForTimeout(300);
  { const pane = await p.evaluate(() => document.querySelector('#menu .pane').innerText); si(pane.includes('Khalil') && pane.includes(halte.chapitre), 'sa page dit ce qui partira, en toutes lettres', `ÉCART la page de la halte : ${pane.slice(0, 200)}`); }
  await oublier(p); await bouton(p, '#menu .side', 'Partager ma progression').click();
  si(await pret(p, 'fr', 'carre', true), 'touché, il ouvre l’aperçu', 'BLOQUÉ l’aperçu ne s’ouvre pas depuis la halte');
  { const t = await p.evaluate(() => window.ISNAD.partage.dernier.texte), dit = `En cours : ${halte.recit} · ${halte.chapitre}`;
    si(t.includes(dit), `l’aperçu dit le chapitre en cours : « ${dit} »`, `ÉCART le chapitre en cours n’est pas dit : ${t}`); }
  await p.screenshot({ path: path.join(out, 'bureau-halte-apercu.png') });
  // au bureau : « Enregistrer l'image » remet un PNG de la bonne taille
  { const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }).catch(() => null), bouton(p, '#partage', 'Enregistrer l’image').click()]);
    let dims = null; if (dl) { const f = path.join(out, 'enregistree.png'); await dl.saveAs(f); const b = fs.readFileSync(f); if (b.slice(1, 4).toString() === 'PNG') dims = [b.readUInt32BE(16), b.readUInt32BE(20)]; }
    si(dl && dl.suggestedFilename() === 'isnad-progression.png' && dims && dims[0] === 1080 && dims[1] === 1080, `au bureau, « Enregistrer l’image » remet « isnad-progression.png », ${dims ? dims.join(' × ') : '?'}`, `ÉCART l’image n’est pas remise au navigateur (${dl ? dl.suggestedFilename() : 'aucun fichier'}, ${JSON.stringify(dims)})`); }
  await bouton(p, '#partage', '◂ Retour').click(); await p.waitForTimeout(500);
  si(await visible(p, '#menu') && !(await visible(p, '#partage')), '« ◂ Retour » rend la halte', 'ÉCART « ◂ Retour » ne rend pas la halte');
  await p.evaluate(() => window.ISNAD.input.emit('cancel'));
  sansErreur('au bureau, quatre langues, la halte');
  await p.context().close();

  /* ---------- 5. au doigt, sur un téléphone : le partage et ses replis ---------- */
  p = await ouvrir({ ctx: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 } });
  await p.evaluate(t => { const I = window.ISNAD, r = I.save.lireTexte(t); I.save.adopter(r.partie); I.save.auto('La Chaîne'); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); I.ui.showChain();
    // le presse-papiers : ce qui y est écrit est noté, et l'on peut le refuser
    window.__copie = null; window.__clipRefus = false;
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: s => { if (window.__clipRefus) return Promise.reject(new DOMException('refusé', 'NotAllowedError')); window.__copie = s; return Promise.resolve(); } } });
    const ex = document.execCommand.bind(document); document.execCommand = function (k) { if (window.__clipRefus) return false; return ex.apply(document, arguments); };
    // navigator.share : chaque scénario pose le sien
    window.__poser = sc => { window.__parti = null; const def = (k, v) => Object.defineProperty(navigator, k, { value: v, configurable: true, writable: true });
      if (sc === 'absent') { def('share', undefined); def('canShare', undefined); }
      else if (sc === 'sansFichier') { def('share', () => Promise.resolve()); def('canShare', d => !(d && d.files)); }
      else if (sc === 'refus') { def('share', () => Promise.reject(new DOMException('refusé', 'NotAllowedError'))); def('canShare', () => true); }
      else if (sc === 'erreur') { def('share', () => { throw new TypeError('indisponible'); }); def('canShare', () => true); }
      else if (sc === 'annule') { def('share', () => Promise.reject(new DOMException('annulé', 'AbortError'))); def('canShare', () => true); }
      else if (sc === 'accepte') { def('share', d => { const f = d.files && d.files[0]; window.__parti = { n: (d.files || []).length, nom: f && f.name, type: f && f.type, taille: f ? f.size : 0, texte: d.text, titre: d.title }; return Promise.resolve(); }); def('canShare', d => !!(d && d.files && d.files.length)); } }; }, joue.texte);
  await p.waitForTimeout(500);
  { const b = bouton(p, '#chain .chainfoot', 'Partager ma progression'); await oublier(p); await b.scrollIntoViewIfNeeded(); await b.tap(); }
  si(await pret(p, 'fr', 'carre', true), 'au doigt, sur un téléphone (390 × 844) : le bouton touché ouvre l’aperçu', 'BLOQUÉ au doigt, l’aperçu ne s’ouvre pas');
  { const r = await p.evaluate(() => { const im = document.querySelector('#partage .apercu img').getBoundingClientRect(), vw = window.innerWidth, petits = [];
      document.querySelectorAll('#partage *').forEach(e => { const t = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(); if (t.length < 2 || !e.getClientRects().length) return; const fz = parseFloat(getComputedStyle(e).fontSize); if (fz < 10) petits.push(t.slice(0, 20) + ' ' + fz); });
      const ta = document.querySelector('#partage textarea'); if (ta && parseFloat(getComputedStyle(ta).fontSize) < 10) petits.push('texte ' + getComputedStyle(ta).fontSize);
      return { l: im.left, r: im.right, w: im.width, vw, petits, debord: document.querySelector('#partage').scrollWidth > vw + 1 }; });
    si(r.l >= 0 && r.r <= r.vw && r.w > 300 && !r.debord, `l’image tient dans la largeur du téléphone (${Math.round(r.w)} points sur ${r.vw}), rien ne déborde`, `ÉCART l’aperçu déborde du téléphone : ${JSON.stringify(r)}`);
    si(!r.petits.length, 'aucun texte de l’aperçu sous dix points', `INVISIBLE des textes de l’aperçu sous dix points : ${r.petits.join(' · ')}`); }
  await p.screenshot({ path: path.join(out, 'telephone-apercu.png'), fullPage: false });
  const texteParti = await p.evaluate(() => window.ISNAD.partage.dernier.texte);
  const scenario = async (sc, refusClip) => { await p.evaluate(([sc, rc]) => { window.__poser(sc); window.__copie = null; window.__clipRefus = !!rc; const n = document.querySelector('#partage .note'); n.textContent = ''; n.className = 'note'; document.querySelector('#partage .apercu').classList.remove('grand'); }, [sc, refusClip]);
    await p.waitForTimeout(700); await bouton(p, '#partage', 'Partager').first().tap();   // (un bouton ignore un second toucher dans les 600 ms : tapable, ui.js)
    await p.waitForFunction(() => (document.querySelector('#partage .note').textContent || '').length > 0, null, { timeout: 5000 }).catch(() => {});
    await p.waitForTimeout(250);
    return p.evaluate(() => { const n = document.querySelector('#partage .note'), a = document.querySelector('#partage .apercu'), im = a.querySelector('img'), ta = document.querySelector('#partage textarea'), q = im.getBoundingClientRect();
      return { note: n.textContent, cls: n.className, grand: a.classList.contains('grand'), copie: window.__copie, parti: window.__parti, appui: getComputedStyle(im).webkitTouchCallout || 'default', src: (im.getAttribute('src') || '').slice(0, 22), vue: q.bottom > 0 && q.top < window.innerHeight,
        choisi: ta.selectionStart === 0 && ta.selectionEnd === ta.value.length && ta.value.length > 0 }; }); };
  { const r = await scenario('accepte');
    si(r.parti && r.parti.n === 1 && r.parti.nom === 'isnad-progression.png' && r.parti.type === 'image/png' && r.parti.taille > 20000 && r.parti.texte === texteParti && r.parti.titre === PROMO.NOM && /transmis/.test(r.note) && !r.grand,
      `navigator.share qui sait partager un fichier : l’image part (${r.parti && r.parti.nom}, ${r.parti && Math.round(r.parti.taille / 1024)} Ko) avec son texte — « ${r.note} »`, `ÉCART le partage accepté : ${JSON.stringify(r)}`); }
  for (const [sc, quoi, cause] of [['absent', 'navigator.share absent', /ne sait pas/], ['sansFichier', 'navigator.share qui ne sait pas partager un fichier', /ne sait pas/], ['refus', 'navigator.share qui refuse (NotAllowedError)', /pas permis/], ['erreur', 'navigator.share qui lève une erreur', /pas permis/]]) {
    const r = await scenario(sc);
    si(cause.test(r.note) && /Texte copié/.test(r.note) && /appui long/.test(r.note) && r.copie === texteParti && r.grand && r.vue && r.appui !== 'none' && r.src.startsWith('data:image/png'),
      `${quoi} : le repli — le texte copié, l’image en grand à garder d’un appui long — « ${r.note} »`, `ÉCART ${quoi} : ${JSON.stringify(r)}`);
  }
  { const r = await scenario('annule'); si(/annulé/.test(r.note) && !r.grand && r.copie === null, `le partage annulé : « ${r.note} », rien de plus`, `ÉCART le partage annulé : ${JSON.stringify(r)}`); }
  { const r = await scenario('absent', true); si(/n’a pas pu se faire/.test(r.note) && /ko/.test(r.cls) && r.choisi && r.grand, `le presse-papiers refusé aussi : le texte reste sélectionné, et c’est dit — « ${r.note} »`, `ÉCART le presse-papiers refusé : ${JSON.stringify(r)}`); }
  await p.screenshot({ path: path.join(out, 'telephone-repli.png') });
  { await p.evaluate(() => { window.__clipRefus = false; window.__copie = null; }); await p.waitForTimeout(700); await bouton(p, '#partage', 'Copier le texte').tap(); await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({ note: document.querySelector('#partage .note').textContent, copie: window.__copie }));
    si(r.copie === texteParti && /Texte copié/.test(r.note), '« Copier le texte » copie le texte qui part', `ÉCART « Copier le texte » : ${JSON.stringify(r)}`); }
  // dans un Artifact (une page qui ne peut pas remettre un fichier, dans un cadre isolé où le partage est refusé)
  await bouton(p, '#partage', '◂ Retour').tap(); await p.waitForTimeout(400);
  await p.evaluate(() => { window.claude = { hot: {} }; window.__poser('refus'); }); await oublier(p); await bouton(p, '#chain .chainfoot', 'Partager ma progression').tap();
  await pret(p, 'fr', 'carre', true);
  { const n = await p.locator('#partage button', { hasText: 'Enregistrer l’image' }).count(); const r = await scenario('refus');
    si(n === 0 && /pas permis/.test(r.note) && r.copie === texteParti && r.grand, `dans un Artifact : pas de bouton d’enregistrement ; le partage refusé y donne le repli, sans erreur — « ${r.note} »`, `ÉCART dans un Artifact : ${JSON.stringify({ n, r })}`); }
  await p.evaluate(() => { delete window.claude; });
  sansErreur('au doigt, les replis');
  await p.context().close();

  si(!dehors.length, 'aucune requête hors du fichier, des images data: / blob: et des polices', `ÉCART des requêtes réseau : ${[...new Set(dehors)].slice(0, 4).join(' ')}`);
  await browser.close();
  console.log(`images : ${path.relative(process.cwd(), out)}/`);
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ PARTAGE CONFORME');
  process.exit(anomalies ? 1 : 0);
})();
