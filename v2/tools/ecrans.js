#!/usr/bin/env node
/* ISNAD 2.0 — l'écran de la Chaîne du livre I est-il celui de la 1.31 ?
   La 2.0 range la Chaîne par livre et lit ses comptes dans les données. Tant qu'il n'y a qu'un livre, rien ne doit se
   voir : même texte d'accueil, mêmes maillons, mêmes mots, même bouton. Cet outil charge la 1.31 gelée (../index.html,
   lue seulement) et la 2.0 (index.html), pose des deux côtés la même partie — sept moments, du prologue à la Chaîne
   transmise — et compare l'écran : le texte, la structure, les boutons actifs ou scellés.
   Usage : node tools/ecrans.js       code de sortie 1 au premier écart (« ÉCART ») */
const path = require('path');
const { chromium } = require('playwright');
const V1 = 'file://' + path.join(__dirname, '../../index.html'), V2 = 'file://' + path.join(__dirname, '../index.html');

// dans la page : pose une partie, ouvre la Chaîne, et rend ce que l'on y lit
const releve = async () => {
  const I = window.ISNAD, sagas = ['abubakr', 'umar', 'khalid', 'uthman', 'ali'], LUM = { abubakr: 'sidq', umar: 'adl', khalid: 'shajaa', uthman: 'rahma', ali: 'ilm' };
  I.audio.setOn(false); I.speed = 40;
  const partie = (faites, plus) => { I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true;
    faites.forEach(id => { sv.sagas[id] = { ch: 0, done: true, flags: {} }; sv.lights.push(I.sagas[id].light); sv.veillees[id] = true; sv.rencontres = sv.rencontres || {}; sv.rencontres[id] = true; });
    Object.assign(sv, plus || {}); return sv; };
  const lire = () => { const c = document.querySelector('#chain'), sansVersion = e => { const k = e.cloneNode(true); k.querySelectorAll('.ver').forEach(v => v.remove()); return k; };
    return { accueil: c.querySelector('header p').innerHTML, bouton: (c.querySelector('header .cta') || {}).textContent || '', aide: (c.querySelector('header .comment') || {}).textContent || '',
      maillons: Array.from(c.querySelectorAll('.links > *')).map(b => b.tagName + '.' + b.className.replace(/\s*sel\b/, '') + (b.disabled ? '[scellé]' : '') + ' ' + b.innerHTML.replace(/url\([^)]*\)/g, 'url()')),
      sceaux: Array.from(c.querySelectorAll('.links .seal')).map(s => s.style.backgroundImage.length),
      pied: sansVersion(c.querySelector('.chainfoot')).textContent, piedBoutons: Array.from(c.querySelectorAll('.chainfoot button')).map(b => b.textContent) }; };
  const fermer = () => { document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); };
  const res = {};
  const voir = async (nom, faites, plus, msg) => { fermer(); partie(faites, plus); await I.ui.showChain(msg); res[nom] = lire(); };
  await voir('après le prologue', []);
  await voir('un maillon entamé', [], { sagas: { abubakr: { ch: 1, done: false, flags: {} } } });
  await voir('deux Lumières', ['abubakr', 'umar']);
  await voir('quatre Lumières, des pourparlers', ['abubakr', 'umar', 'khalid', 'uthman'], { parley: { won: 3, total: 4 }, isnad: { ok: 9, total: 11 } });
  await voir('cinq Lumières', sagas);
  await voir('la Chaîne transmise', sagas, { epilogue: true });
  // la fin d'un maillon : ce que la Chaîne dit en accueil (veillée et rencontre déjà vues, pour revenir droit à la Chaîne)
  const fin = async (nom, faites, id) => { fermer(); partie(faites); I.world.saga = I.sagas[id]; I.world.ci = 2; await I.ui.afterSaga(I.sagas[id], I.sagas[id].chapters[2]); res[nom] = lire(); };
  await fin('fin d’un maillon, il en reste', ['abubakr', 'umar', 'khalid'], 'khalid');
  await fin('fin du cinquième maillon', sagas, 'ali');
  fermer();
  return res;
};

(async () => {
  const browser = await chromium.launch(), erreurs = [];
  const page = async url => { const p = await browser.newPage({ viewport: { width: 960, height: 540 } }); p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
    await p.goto(url); await p.waitForTimeout(1500); return p; };
  const p1 = await page(V1), p2 = await page(V2);
  const a = await p1.evaluate(releve), b = await p2.evaluate(releve);
  await browser.close();
  let ecarts = 0, lignes = 0;
  Object.keys(a).forEach(nom => { const x = a[nom], y = b[nom]; let ici = 0;
    Object.keys(x).forEach(k => { const u = JSON.stringify(x[k]), v = JSON.stringify(y[k]); lignes += Array.isArray(x[k]) ? x[k].length : 1;
      if (u !== v) { ici++; ecarts++; let i = 0; while (i < u.length && u[i] === v[i]) i++; console.log(`ÉCART ${nom} · ${k} :\n   1.31 …${u.slice(Math.max(0, i - 60), i + 90)}\n   2.0  …${v.slice(Math.max(0, i - 60), i + 90)}`); } });
    if (!ici) console.log(`OK  ${nom} — ${x.maillons.length} maillons, « ${x.bouton || 'aucun bouton'} »`); });
  if (erreurs.length) { console.log('--- ERREURS ---'); [...new Set(erreurs)].slice(0, 10).forEach(e => console.log(e)); }
  console.log(ecarts || erreurs.length ? `✗ ${ecarts} écart(s)` : `✓ CHAÎNE IDENTIQUE à celle de la 1.31 — ${Object.keys(a).length} moments, ${lignes} éléments comparés`);
  process.exit(ecarts || erreurs.length ? 1 : 0);
})();
