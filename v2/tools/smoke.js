#!/usr/bin/env node
/* Test de fumée : lance le jeu dans Chromium, capture des écrans, puis joue automatiquement
   le prologue, les cinq sagas et l'épilogue (mode ISNAD.debug.auto).
   Usage : node tools/smoke.js [shots|auto|walk|tap|wrong|all] [dossier de sortie]
   auto : saute d'objectif en objectif · walk : marche réellement (clavier simulé, vraies collisions)
   tap : marche comme au doigt (chemin tracé jusqu'à l'objectif, vraies collisions)
   wrong : choisit d'abord toutes les mauvaises réponses avant la bonne
   SANS_OEUVRES=1 : le joueur automatique n'accomplit aucune œuvre (épreuves abordées le cœur lourd)
   « MUSIQUE » : à un point de reprise, ou après une défaite forcée dans la noosphère, la piste voulue n'est pas celle du lieu */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const mode = process.argv[2] || 'all';
const out = process.argv[3] || path.join(__dirname, '../.smoke');
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(__dirname, '../index.html');

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const mkPage = async (vp, dsf) => {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dsf || 1, hasTouch: vp.width < 600 });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url); await page.waitForTimeout(1900);
    return page;
  };
  const shot = (page, name) => page.screenshot({ path: path.join(out, name + '.png') });

  if (mode === 'shots' || mode === 'all') {
    const page = await mkPage({ width: 1280, height: 720 });
    await shot(page, '01-titre');
    await page.keyboard.press('Enter'); // Nouvelle partie
    await page.waitForTimeout(1500); await shot(page, '02-carton');
    for (let i = 0; i < 8; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(450); }
    await page.waitForTimeout(600); await shot(page, '03-cite');
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(2600); await page.keyboard.up('ArrowRight');
    await shot(page, '04-cite-marche');
    // sauts de test vers d'autres ambiances
    const jump = async (saga, ci, name, wait) => {
      await page.evaluate(([s, c]) => { const I = window.ISNAD; I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; document.querySelectorAll('.screen').forEach(e => e.hidden = true); I.world.startChapter(s, c); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); }, [saga, ci]);
      await page.waitForTimeout(wait || 2500); await shot(page, name);
    };
    await page.evaluate(() => { window.ISNAD.save.data.started = true; });
    await jump('abubakr', 0, '05-medine');
    await jump('umar', 0, '06-medine-nuit');
    await jump('khalid', 0, '07-desert');
    await jump('khalid', 1, '08-camp');
    await jump('umar', 1, '09-saga-umar-2');
    await jump('uthman', 1, '10-uthman-2');
    await jump('ali', 0, '11-koufa');
    // combat
    await page.evaluate(() => { const I = window.ISNAD; I.debug.auto = false; I.speed = 1; I.battle.start({ group: Object.keys(I.world.saga.enemies).slice(0, 3), bg: 'ville' }); });
    await page.waitForTimeout(2600); await shot(page, '12-combat');
    await page.keyboard.press('Enter'); await page.waitForTimeout(400); await page.keyboard.press('Enter'); await page.waitForTimeout(900); await shot(page, '13-combat-action');
    await page.close();
    // mobile portrait
    const m = await mkPage({ width: 390, height: 780 }, 2);
    await shot(m, '20-mobile-titre');
    await m.evaluate(() => { const I = window.ISNAD; I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => e.hidden = true); document.body.classList.remove('in-screen'); I.world.startChapter('abubakr', 0); });
    await m.waitForTimeout(3200); await shot(m, '21-mobile-carton');
    for (let i = 0; i < 3; i++) { await m.mouse.click(195, 300); await m.waitForTimeout(700); }
    await shot(m, '22-mobile-dialogue');
    await m.close();
  }

  if (mode === 'auto' || mode === 'walk' || mode === 'tap' || mode === 'wrong' || mode === 'all') {
    const page = await mkPage({ width: 960, height: 540 });
    const res = await page.evaluate(async ([walk, sans]) => {
      const I = window.ISNAD, W = I.world, log = I.debug.log = [], stats = [];
      I.debug.noOeuvres = !!sans;
      I.debug.auto = true; I.debug.walk = walk === 'walk' ? true : walk === 'tap' ? 'tap' : false; I.debug.pickWrong = walk === 'wrong'; I.speed = 40; I.audio.setOn(false);
      I.save.reset(); I.save.data.started = true;
      const hide = () => document.querySelectorAll('.screen').forEach(e => { e.hidden = true; });
      // instrumentation des combats
      // La musique. Dans chaque saga, le premier combat livré dans la noosphère est perdu une fois exprès (I.debug.perd) : après la
      // reprise et la victoire, la carte doit retrouver sa piste. Et à chaque point de reprise, la piste voulue est celle du lieu.
      const orig = I.battle.start, forcees = {}, PASSAGE = ['victoire', 'combat', 'boss', 'vice', 'lame'];
      const ock = W.checkpoint; W.checkpoint = function () { const A = I.audio; if (I.scene === W && !I.battle.active && (A.wantTrack !== A.place || PASSAGE.includes(A.place))) log.push(`MUSIQUE ${W.saga.id}/${W.ch.id} objectif ${W.objIndex} : voulue « ${A.wantTrack} », lieu « ${A.place} »`); return ock.apply(this, arguments); };
      I.battle.start = async function (o) { const t0 = performance.now(); let tries = 0; const force = !!(W.map && (I.D.MAPS[W.map.id] || {}).gabarit === 'noos' && I.scene === W && !o.noir && !forcees[W.saga.id]); if (force) { forcees[W.saga.id] = true; I.debug.perd = 1; } const rac = I.mal && I.mal.estIdole(o) ? I.mal.niveau() : 0;
        const oc = I.script.card; I.script.card = async function (cls, html, a) { if (cls === 'defeat') tries++; return oc(cls, html, a); }; await orig(o); I.script.card = oc;
        if (force && I.audio.wantTrack !== I.audio.place) log.push(`MUSIQUE ${W.saga.id}/${W.ch.id} après une défaite : voulue « ${I.audio.wantTrack} », lieu « ${I.audio.place} »`);
        stats.push({ saga: W.saga.id, ch: W.ch.id, group: o.group.join('+'), boss: !!o.boss, interieur: !!o.interieur, secours: !!I.battle.last.secours, defeats: tries - (force ? 1 : 0), forcee: force, rac, champ: I.battle.last.champ, turns: I.battle.last.turns, kos: I.battle.last.kos, min: Math.round(I.battle.last.minHp * 100), lv: W.party.map(id => W.hero(id).lvl).join('/'), hp: W.party.map(id => Math.round(W.hero(id).hp)).join('/') }); };
      const waitChain = () => new Promise(res => { const t0 = Date.now(); const iv = setInterval(() => { if (!document.querySelector('#chain').hidden || !document.querySelector('#title').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 240000) { clearInterval(iv); res(false); } }, 100); });
      const order = [['idris', 0], ['abubakr'], ['umar'], ['khalid'], ['uthman'], ['ali'], ['idris', 1]];
      for (const [sid, ci] of order) {
        hide(); W.roster = {}; W.saga = null; const t0 = performance.now();
        if (ci !== undefined) W.startChapter(sid, ci); else I.ui.startSaga(I.sagas[sid]);
        const ok = await waitChain();
        log.push(`${ok ? 'OK ' : 'BLOQUÉ '} ${sid}${ci !== undefined ? '#' + ci : ''} en ${((performance.now() - t0) / 1000).toFixed(1)} s${ok ? '' : ' — chapitre ' + (W.ch && W.ch.id) + ' objectif ' + W.objIndex + ' carte ' + (W.map && W.map.id)}`);
        if (!ok) break;
      }
      // sauvegarde : aller-retour sur un emplacement ; haltes de prière : accessibles à pied depuis chaque lieu
      const before = JSON.stringify(I.save.data.lights), okW = I.save.write(3, { label: 'essai' }); I.save.data.lights = []; const okR = I.save.read(3);
      log.push(`SAUVEGARDE écriture ${okW} lecture ${okR} identique ${JSON.stringify(I.save.data.lights) === before}`); try { localStorage.removeItem('isnad2.slot.3'); } catch (e) {}
      const bad = []; I.debug.auto = false; I.script.depth = 1;
      for (const id of Object.keys(I.D.MAPS).filter(k => I.D.MAPS[k].spots.includes('priere'))) { W.loadMap(id, {}, null); const m = W.map, q = W.resolve('priere', id, W.player); for (const k of Object.keys(m.spots)) { if (k === 'priere') continue; const a = W.resolve(k, id, W.player); if (!W.reach(a[0], a[1], q[0], q[1])) bad.push(id + ':' + k); } }
      log.push(bad.length ? 'NATTE INACCESSIBLE depuis ' + bad.join(', ') : 'NATTES toutes accessibles à pied');
      return { log, stats, save: { lights: I.save.data.lights, isnad: I.save.data.isnad, codex: I.save.data.codex.length, epilogue: I.save.data.epilogue, veillees: Object.keys(I.save.data.veillees || {}), rencontres: Object.keys(I.save.data.rencontres || {}), coeur: { zad: I.save.data.zad, oeuvres: I.save.data.oeuvres, lames: Object.keys(I.save.data.lames || {}), vices: I.save.data.vices, animaux: Object.keys(I.save.data.animaux || {}), enigmes: Object.keys(I.save.data.enigmes || {}), pret: I.save.data.pret || 0 }, equipement: { reserve: Object.values(I.save.data.gear || {}).reduce((a, b) => a + b, 0), pieces: Object.keys(I.save.data.gear || {}).length, portees: Object.values(I.save.data.equip || {}).reduce((a, e) => a + Object.keys(e).length, 0), dirhams: I.save.data.dirhams }, citadel: I.save.data.citadel, parley: I.save.data.parley, piliers: Object.fromEntries(Object.entries(I.save.data.sagas).filter(([k, v]) => v.pil).map(([k, v]) => [k, Object.values(v.pil).join('/')])) } };
    }, [mode, process.env.SANS_OEUVRES || '']);
    console.log(res.log.join('\n'));
    console.log('--- combats ---');
    res.stats.forEach(s => console.log(`${s.saga}/${s.ch} ${s.boss ? 'BOSS ' : ''}${s.group}${s.interieur ? ' (noosphère intérieure : le râwî seul)' : ''}  ${s.secours ? 'secours ' : ''}${s.rac ? 'enracinement:' + s.rac + ' ' : ''}${s.champ ? `rangs:${s.champ.rangs} pas:${s.champ.pas} flancs:${s.champ.flancs} ` : ''}défaites:${s.defeats}${s.forcee ? ' (+1 forcée)' : ''} tours:${s.turns} KO:${s.kos} PVmin:${s.min}%  niv:${s.lv}`));
    console.log('--- sauvegarde ---', JSON.stringify(res.save));
    await shot(page, '30-fin-auto');
    await page.close();
  }
  if (errors.length) { console.log('--- ERREURS (' + errors.length + ') ---'); [...new Set(errors)].slice(0, 25).forEach(e => console.log(e)); }
  else console.log('Aucune erreur console.');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
