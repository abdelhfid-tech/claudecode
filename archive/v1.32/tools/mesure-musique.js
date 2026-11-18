#!/usr/bin/env node
/* Niveaux de la bande-son. Chaque piste est rendue hors ligne par ISNAD.audio.render (mêmes timbres, même bus, même
   limiteur que le jeu), puis mesurée : crête et niveau moyen en dB, et « tél. », le niveau moyen au-dessus de 400 Hz
   (ce que rend un petit haut-parleur).
   Usage : node tools/mesure-musique.js [piste ...]   (sans argument : toutes les pistes) */
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '../index.html');
(async () => {
  const browser = await chromium.launch();
  const p = await browser.newPage();
  p.on('pageerror', e => console.log('pageerror: ' + e.message));
  await p.goto(url); await p.waitForTimeout(1200);
  const noms = process.argv.slice(2).length ? process.argv.slice(2) : await p.evaluate(() => Object.keys(window.ISNAD.music));
  const L = [];
  for (const nom of noms) {
    const r = await p.evaluate(async nom => {
      const I = window.ISNAD, def = I.music[nom]; if (!def) return null;
      const buf = await I.audio.render(nom), n = buf.length, sr = buf.sampleRate, nc = buf.numberOfChannels;
      const mesure = b => { let pk = 0, s = 0; for (let ch = 0; ch < b.numberOfChannels; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < d.length; i++) { const v = d[i]; s += v * v; const a = v < 0 ? -v : v; if (a > pk) pk = a; } } return { crete: 20 * Math.log10(pk + 1e-9), moyen: 10 * Math.log10(s / (b.length * b.numberOfChannels) + 1e-12) }; };
      const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext, c = new OC(nc, n, sr), src = c.createBufferSource(), h1 = c.createBiquadFilter(), h2 = c.createBiquadFilter();
      src.buffer = buf; h1.type = h2.type = 'highpass'; h1.frequency.value = h2.frequency.value = 400; src.connect(h1); h1.connect(h2); h2.connect(c.destination); src.start(0);
      const haut = await c.startRendering(), a = mesure(buf), b = mesure(haut);
      return { nom, bpm: def.bpm, duree: n / sr, crete: a.crete, moyen: a.moyen, tel: b.moyen };
    }, nom);
    if (!r) { console.log(`${nom} : piste inconnue`); continue; }
    L.push(r);
  }
  L.sort((a, b) => b.moyen - a.moyen);
  console.log('piste        crête   moyen    tél.   durée');
  L.forEach(r => console.log(`${r.nom.padEnd(11)} ${r.crete.toFixed(1).padStart(6)} ${r.moyen.toFixed(1).padStart(7)} ${r.tel.toFixed(1).padStart(7)}  ${r.duree.toFixed(0).padStart(4)} s`));
  if (L.length > 1) console.log(`moyen : de ${L[0].moyen.toFixed(1)} dB (${L[0].nom}) à ${L[L.length - 1].moyen.toFixed(1)} dB (${L[L.length - 1].nom}) · crête la plus haute ${Math.max(...L.map(r => r.crete)).toFixed(1)} dB`);
  await browser.close();
})();
