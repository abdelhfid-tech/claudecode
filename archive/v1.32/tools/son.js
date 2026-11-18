#!/usr/bin/env node
/* Le son, pour de vrai : Chromium avec un contexte audio qui tourne. On écoute le bus de la musique pendant que le
   jeu se joue, et l'on dit ce qui s'entend : quelle piste, à quel niveau, avec quels trous.
   Usage : node tools/son.js [victoire|defaite|bride|tout]
     victoire : saga I, premier chapitre, jusqu'à la noosphère de Médine ; un combat gagné du premier coup ; retour à la mosquée
     defaite  : idem, mais ce combat est perdu une fois, puis repris
     bride    : idem « victoire », mais pendant l'écoute les minuteries sont bridées à une par seconde et l'affichage à deux images par seconde
   Niveaux : moyenne efficace du bus de la musique, en dB. « tél. » : la même au-dessus de 400 Hz, ce que rend un
   petit haut-parleur.
   « MUSIQUE MUETTE » : une piste est voulue et le bus reste sous −55 dB plus de deux secondes.
   « MUSIQUE AUTRE »  : au repos sur une carte, la piste qui joue n'est pas celle du lieu. */
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '../index.html');
const quoi = process.argv[2] || 'tout';
const VARIANTES = { victoire: {}, defaite: { perdre: true }, bride: { bride: true } };
const PAS = 400, SEUIL = -55;

// posé avant les scripts de la page : tant que window.__bride est vrai, les minuteries répétées ne passent qu'une fois par
// seconde et l'affichage deux fois par seconde (un onglet en retrait, un appareil qui peine)
const bridage = () => {
  const si = window.setInterval.bind(window);
  window.setInterval = (fn, ms, ...a) => { let vu = 0; return si(() => { const n = performance.now(); if (window.__bride && n - vu < 1000) return; vu = n; fn(...a); }, ms); };
  const raf = window.requestAnimationFrame.bind(window); let img = 0;
  window.requestAnimationFrame = fn => raf(t => { if (window.__bride && t - img < 500) return window.requestAnimationFrame(fn); img = t; fn(t); });
};

const pose = () => {
  const I = window.ISNAD, W = I.world, S = I.script, A = I.audio;
  I.debug.log = []; I.debug.auto = true; I.speed = 40; I.save.reset(); I.save.data.started = true;
  document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen');
  A.unlock(); A.setOn(true); if (!A.musicOn) A.setMusic(true);
  const c = A.ctx, z = c.createGain(); z.gain.value = 0; z.connect(c.destination);
  const an = c.createAnalyser(), an2 = c.createAnalyser(), h1 = c.createBiquadFilter(), h2 = c.createBiquadFilter();
  an.fftSize = an2.fftSize = 32768; h1.type = h2.type = 'highpass'; h1.frequency.value = h2.frequency.value = 400;
  A.mbus.connect(an); an.connect(z); A.mbus.connect(h1); h1.connect(h2); h2.connect(an2); an2.connect(z);
  const buf = new Float32Array(an.fftSize);
  const db = a => { a.getFloatTimeDomainData(buf); let s = 0; for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i]; return 10 * Math.log10(s / buf.length + 1e-12); };
  window.__ecoute = () => ({ voulue: A.wantTrack, cours: A.curTrack ? A.curTrack.name : null, lieu: A.place !== undefined ? A.place : (W.map ? W.map.env.music : null), ctx: c.state, incidents: A.fails || 0, on: A.musicOn,
    db: db(an), tel: db(an2), carte: W.map ? W.map.id : null, libre: I.scene === W && !S.busy && !W.lock, fini: !!window.__fini, defaites: window.__defaites || 0, etat: `objectif ${W.objIndex} · récit ${S.busy ? 'en cours' : 'au repos'} · ${W.lock ? 'verrouillé' : 'libre'} · combat ${I.battle.active ? 'ouvert' : 'fermé'} · carton ${document.querySelector('#card').hidden ? 'non' : 'oui'} · dialogue ${document.querySelector('#dialog').hidden ? 'non' : 'oui'} · secours ${document.querySelector('#secours').hidden ? 'non' : 'oui'} · auto ${I.debug.auto} · tenu ${!!window.__tenir} · bridé ${!!window.__bride}`, stats: A.stats ? Object.assign({}, A.stats) : null });
  // le joueur de test s'arrête quand on le lui demande ; il s'arrête de lui-même en entrant dans la noosphère
  const oa = W.autoStep; W.autoStep = function () { if (window.__tenir) return; return oa.apply(this, arguments); };
  const ol = W.loadMap; W.loadMap = function (id) { if (id === 'noos' && !window.__arrive) { window.__arrive = true; window.__tenir = true; } else if (id === 'medine' && window.__retour) { window.__retour = false; window.__tenir = true; } return ol.apply(this, arguments); };
  // défaite forcée : tant que __perdre est vrai les égrégores écrasent le groupe ; le carton de défaite lève le drapeau
  const oe = I.calc.enemy; I.calc.enemy = function () { const st = oe.apply(this, arguments); if (window.__perdre) { st.atk *= 80; if (st.mag) st.mag *= 80; st.spd *= 4; } return st; };
  const oc = S.card; S.card = function (cls) { if (cls === 'defeat') { window.__perdre = false; window.__defaites = (window.__defaites || 0) + 1; } return oc.apply(this, arguments); };
  W.roster = {}; W.saga = null; W.startChapter('abubakr', 0);
};

const moy = L => 10 * Math.log10(L.reduce((s, v) => s + Math.pow(10, v / 10), 0) / Math.max(1, L.length));
const mode = L => { const n = {}; L.forEach(v => { n[v] = (n[v] || 0) + 1; }); return Object.keys(n).sort((a, b) => n[b] - n[a])[0]; };

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  let anomalies = 0;
  for (const nom of (quoi === 'tout' ? Object.keys(VARIANTES) : [quoi])) {
    const o = VARIANTES[nom]; if (!o) { console.log('variante inconnue : ' + nom); continue; }
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(bridage);
    const p = await ctx.newPage(), errors = [];
    p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForTimeout(1500); await p.evaluate(pose);
    const ecoute = () => p.evaluate(() => window.__ecoute());
    const jusqua = async (cond, max) => { const t0 = Date.now(); for (;;) { const e = await ecoute(); if (cond(e)) return e; if (Date.now() - t0 > max) return null; await p.waitForTimeout(200); } };
    const tenir = async sec => { if (o.bride) await p.evaluate(() => { window.__bride = true; }); const L = []; const t0 = Date.now(); while (Date.now() - t0 < sec * 1000) { L.push(await ecoute()); await p.waitForTimeout(PAS); } if (o.bride) await p.evaluate(() => { window.__bride = false; }); return L; };
    const lignes = [];
    const dire = (phase, L, repos) => {
      const fin = L[L.length - 1]; let trou = 0, plus = 0;
      L.forEach(e => { if (e.db < SEUIL) { trou += PAS / 1000; plus = Math.max(plus, trou); } else trou = 0; });
      const reel = n => n && n !== 'silence';
      const muette = reel(fin.voulue) && fin.on && plus >= 2, autre = repos && reel(fin.lieu) && fin.cours !== fin.lieu;
      if (muette) anomalies++; if (autre) anomalies++;
      lignes.push(`  ${phase.padEnd(34)} lieu ${String(fin.lieu).padEnd(8)} voulue ${String(fin.voulue).padEnd(8)} joue ${String(mode(L.map(e => String(e.cours)))).padEnd(8)} ${moy(L.map(e => e.db)).toFixed(1).padStart(6)} dB  tél. ${moy(L.map(e => e.tel)).toFixed(1).padStart(6)} dB  silence ${plus.toFixed(1)} s${muette ? '  MUSIQUE MUETTE' : ''}${autre ? '  MUSIQUE AUTRE' : ''}`);
    };
    const arrive = await jusqua(e => e.carte === 'noos' && e.libre, 90000);
    if (!arrive) { console.log(`${nom} : BLOQUÉ avant la noosphère`); anomalies++; await ctx.close(); continue; }
    dire('noosphère, en arrivant', await tenir(7), true);
    await p.evaluate(perdre => { const I = window.ISNAD; window.__perdre = perdre; window.__fini = false; I.battle.start({ group: ['murmure', 'murmure'], bg: 'noos' }).then(() => { window.__fini = true; }); }, !!o.perdre);
    const fin = await jusqua(e => e.fini, 120000);
    if (!fin) { console.log(`${nom} : BLOQUÉ pendant le combat`); anomalies++; await ctx.close(); continue; }
    dire(`noosphère, après le combat${fin.defaites ? ' (' + fin.defaites + ' défaite' + (fin.defaites > 1 ? 's' : '') + ')' : ''}`, await tenir(9), true);
    await p.evaluate(() => { window.__retour = true; window.__tenir = false; });
    const mosquee = await jusqua(e => e.carte === 'medine' && e.libre, 120000);
    if (mosquee) dire('mosquée, au retour', await tenir(7), true); else { const e = await ecoute(); lignes.push(`  retour à la mosquée : BLOQUÉ (carte ${e.carte} · ${e.etat})`); anomalies++; }
    const der = await ecoute();
    console.log(`${nom} · contexte ${der.ctx} · incidents ${der.incidents}${der.stats ? ' · ' + JSON.stringify(der.stats) : ''}`); console.log(lignes.join('\n'));
    if (errors.length) { anomalies += errors.length; console.log('  ERREURS : ' + [...new Set(errors)].slice(0, 5).join(' | ')); }
    await ctx.close();
  }
  console.log(`FIN son ${anomalies}`);
  await browser.close();
  process.exit(anomalies ? 1 : 0);
})();
