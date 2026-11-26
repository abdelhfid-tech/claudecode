#!/usr/bin/env node
/* Test de fumée : lance le jeu dans Chromium, capture des écrans, puis joue automatiquement
   le prologue, les cinq sagas et l'épilogue (mode ISNAD.debug.auto).
   Usage : node tools/smoke.js [shots|auto|walk|tap|wrong|suiveurs|all] [dossier de sortie]
   auto : saute d'objectif en objectif · walk : marche réellement (clavier simulé, vraies collisions)
   tap : marche comme au doigt (chemin tracé jusqu'à l'objectif, vraies collisions)
   wrong : choisit d'abord toutes les mauvaises réponses avant la bonne
   SANS_OEUVRES=1 : le joueur automatique n'accomplit aucune œuvre (épreuves abordées le cœur lourd)
   « MUSIQUE » : à un point de reprise, ou après une défaite forcée dans la noosphère, la piste voulue n'est pas celle du lieu
   2.16 — les corps : « PNJ EN TRAVERS » (à chaque point de reprise, la case d'un PNJ ou d'un coffre, rendue pleine, coupe un
   lieu nommé, et aucun pas de côté ne le rouvre) ; « SUPERPOSÉ » (walk, tap : le joueur reste plus de trente pas dans le pied
   de quelqu'un, ou un lieu se charge avec quelqu'un à moins de 9 points de lui) ; « COINCÉ » (walk, tap : le joueur de test
   n'arrive pas à l'objectif et y est porté).
   suiveurs : l'écart des siens à 30, 60, 120 et 144 images par seconde, après chaque chargement, la reprise au bureau, les
   marches de récit jouées pour de vrai — « SUIVEURS CONFORMES » */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const sondes = require('./sondes.js');
const mode = process.argv[2] || 'all';
const out = process.argv[3] || path.join(__dirname, '../.smoke');
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(__dirname, '../index.html') + (process.env.LANGUE ? '?lang=' + process.env.LANGUE : ''); // LANGUE=ja : la partie jouée dans une autre langue

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
    await page.waitForTimeout(700); await shot(page, '01b-personnage'); await page.keyboard.press('Enter'); // 2.0 : « Ton personnage », puis Commencer
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
    await page.evaluate(sondes.corps, mode); // 2.16 : les sondes des corps (« PNJ EN TRAVERS », « SUPERPOSÉ »), communes avec paquet.js
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
      // 2.16 — les corps : « PNJ EN TRAVERS », « SUPERPOSÉ » — les sondes de tools/sondes.js, posées avant la partie
      const ock = W.checkpoint; W.checkpoint = function () { const A = I.audio; if (I.scene === W && !I.battle.active && (A.wantTrack !== A.place || PASSAGE.includes(A.place))) log.push(`MUSIQUE ${W.saga.id}/${W.ch.id} objectif ${W.objIndex} : voulue « ${A.wantTrack} », lieu « ${A.place} »`); return ock.apply(this, arguments); };
      I.battle.start = async function (o) { const t0 = performance.now(); let tries = 0; const force = !!(W.map && (I.D.MAPS[W.map.id] || {}).gabarit === 'noos' && I.scene === W && !o.noir && !forcees[W.saga.id]); if (force) { forcees[W.saga.id] = true; I.debug.perd = 1; } const rac = I.mal && I.mal.estIdole(o) ? I.mal.niveau() : 0;
        const oc = I.script.card; I.script.card = async function (cls, html, a) { if (cls === 'defeat') tries++; return oc(cls, html, a); }; await orig(o); I.script.card = oc;
        if (force && I.audio.wantTrack !== I.audio.place) log.push(`MUSIQUE ${W.saga.id}/${W.ch.id} après une défaite : voulue « ${I.audio.wantTrack} », lieu « ${I.audio.place} »`);
        stats.push({ saga: W.saga.id, ch: W.ch.id, group: o.group.join('+'), boss: !!o.boss, interieur: !!o.interieur, secours: !!I.battle.last.secours, defeats: tries - (force ? 1 : 0), forcee: force, rac, champ: I.battle.last.champ, turns: I.battle.last.turns, kos: I.battle.last.kos, min: Math.round(I.battle.last.minHp * 100), lv: W.party.map(id => W.hero(id).lvl).join('/'), hp: W.party.map(id => Math.round(W.hero(id).hp)).join('/') }); };
      const waitChain = () => new Promise(res => { const t0 = Date.now(); const iv = setInterval(() => { if (!document.querySelector('#chain').hidden || !document.querySelector('#title').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 240000) { clearInterval(iv); res(false); } }, 100); });
      // le parcours vient des données : le prologue, les maillons du livre I, le dernier maillon, puis les autres livres
      const maillons = n => I.sagaList.filter(s => !s.frame && ((s.livre || 1) === 1) === n).map(s => [s.id]);
      const order = [['idris', 0]].concat(maillons(true), [['idris', 1]], maillons(false));
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
      log.push(`CORPS ${Object.keys(I.debug.corps.vus).length} places de PNJ et de coffres éprouvées, leur case rendue pleine (2.16)`);
      return { log, stats, save: { lights: I.save.data.lights, isnad: I.save.data.isnad, codex: I.save.data.codex.length, epilogue: I.save.data.epilogue, veillees: Object.keys(I.save.data.veillees || {}), rencontres: Object.keys(I.save.data.rencontres || {}), coeur: { zad: I.save.data.zad, oeuvres: I.save.data.oeuvres, lames: Object.keys(I.save.data.lames || {}), vices: I.save.data.vices, animaux: Object.keys(I.save.data.animaux || {}), enigmes: Object.keys(I.save.data.enigmes || {}), pret: I.save.data.pret || 0 }, equipement: { reserve: Object.values(I.save.data.gear || {}).reduce((a, b) => a + b, 0), pieces: Object.keys(I.save.data.gear || {}).length, portees: Object.values(I.save.data.equip || {}).reduce((a, e) => a + Object.keys(e).length, 0), dirhams: I.save.data.dirhams }, citadel: I.save.data.citadel, parley: I.save.data.parley, piliers: Object.fromEntries(Object.entries(I.save.data.sagas).filter(([k, v]) => v.pil).map(([k, v]) => [k, Object.values(v.pil).join('/')])) } };
    }, [mode, process.env.SANS_OEUVRES || '']);
    console.log(res.log.join('\n'));
    console.log('--- combats ---');
    res.stats.forEach(s => console.log(`${s.saga}/${s.ch} ${s.boss ? 'BOSS ' : ''}${s.group}${s.interieur ? ' (noosphère intérieure : le râwî seul)' : ''}  ${s.secours ? 'secours ' : ''}${s.rac ? 'enracinement:' + s.rac + ' ' : ''}${s.champ ? `rangs:${s.champ.rangs} pas:${s.champ.pas} flancs:${s.champ.flancs} ` : ''}défaites:${s.defeats}${s.forcee ? ' (+1 forcée)' : ''} tours:${s.turns} KO:${s.kos} PVmin:${s.min}%  niv:${s.lv}`));
    console.log('--- sauvegarde ---', JSON.stringify(res.save));
    await shot(page, '30-fin-auto');
    await page.close();
  }
  /* 2.16 — suiveurs : les siens suivent le meneur à seize points l'un de l'autre, quelle que soit la cadence de l'écran (une
     marche en ligne droite à 30, 60, 120 et 144 images par seconde : chaque écart entre 14 et 18 points) ; après le
     chargement de chaque lieu de chaque chapitre, aucun n'est à moins de 8 points du meneur, et personne n'est posé sur
     le joueur (« SUPERPOSÉ ») ; la reprise au bureau de Maître Yûnus ne pose plus Idris sur lui ; les marches de récit,
     jouées pour de vrai (hors du joueur automatique) et comme le jeu les joue (le joueur là où l'objectif le laisse, ce
     qui précède la marche joué, « show » compris), ne traversent aucune case pleine, n'entrent dans le pied de personne et
     durent au plus trois fois la ligne droite d'avant ; le joueur posé en travers de la ligne droite, elles le
     contournent ; témoin : la ligne droite d'avant, rejouée là, est relevée. « SUIVEURS CONFORMES », sinon « ÉCART » ou
     « SUPERPOSÉ ». */
  let suiveursKo = 0;
  if (mode === 'suiveurs') {
    const page = await mkPage({ width: 960, height: 540 });
    const out = await page.evaluate(async () => {
      const I = window.ISNAD, W = I.world, S = I.script, out = [], dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      I.audio.setOn(false); I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen');
      const ouvrir = async (s, ci, cp) => { I.debug.auto = true; I.speed = 40; W.roster = {}; W.saga = null; await W.startChapter(s, ci, cp); I.debug.auto = false; I.speed = 1; S.hideDialog(); };
      // 1. à toutes les cadences, en ligne droite
      for (const hz of [30, 60, 120, 144]) {
        await ouvrir('khalid', 2); const P = W.player, n = W.party.length, h = I.input.held;
        const apres = []; for (let i = 1; i < n; i++) apres.push(dist(W.suiveur(i), [P.x, P.y]));
        let best = null, bl = 0; const x0 = P.x, y0 = P.y, d0 = P.dir;
        for (const d of ['right', 'left', 'down', 'up']) { h[d] = true; for (let i = 0; i < 90; i++) W.update(1 / 60); h[d] = false; const L = Math.hypot(P.x - x0, P.y - y0); P.x = x0; P.y = y0; P.dir = d0; W.resetTrail(); if (L > bl) { bl = L; best = d; } }
        h[best] = true; for (let i = 0; i < Math.round(hz * 1.2); i++) W.update(1 / hz); h[best] = false; I.input.clearHeld(); W.update(1 / hz);
        const pts = [[P.x, P.y]]; for (let i = 1; i < n; i++) pts.push(W.suiveur(i)); const ecarts = pts.slice(1).map((q, i) => dist(q, pts[i]));
        const bon = n >= 3 && apres.every(d => d >= 8) && ecarts.every(e => e >= 14 && e <= 18);
        out.push(`${bon ? 'OK ' : 'ÉCART'} ${hz} images par seconde : après le chargement, les ${n - 1} suiveurs à ${apres.map(d => d.toFixed(1)).join(' et ')} points du meneur ; en marchant (${best}), ${ecarts.map(e => e.toFixed(1)).join(' et ')} points entre chacun`);
      }
      // 2. chaque lieu de chaque chapitre, au chargement
      const loin = [], dessus = []; let lieux = 0;
      for (const s of Object.values(I.sagas)) { if (!s.chapters) continue; s.chapters.forEach((ch, ci) => { if (!ch.map || !(ch.party || []).length) return;
        W.saga = s; W.ch = ch; W.ci = ci; W.party = ch.party.slice(); W.roster = {}; W.party.forEach(id => W.hero(id)); W.refreshSheets(); W.foes = [];
        W.npcs = (ch.npcs || []).map(q => Object.assign({}, q, { map: q.map || ch.map, hidden: !!q.hidden, placed: false, dir: 0, sheet: W.sheets[0] }));
        W.chests = (ch.chests || []).map(c => Object.assign({}, c, { map: c.map || ch.map, open: false, placed: false }));
        W.player.dir = 0; W.loadMap(ch.map, ch.opts || {}, ch.start); lieux++;
        const P = W.player; for (let i = 1; i < W.party.length; i++) { const d = dist(W.suiveur(i), [P.x, P.y]); if (d < 8) loin.push(`${s.id}/${ch.id} : le suiveur ${i} à ${d.toFixed(1)} points`); }
        W.corps().forEach(e => { const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < 9) dessus.push(`${s.id}/${ch.id} : ${e.name || 'un coffre'} à ${d.toFixed(1)} points du joueur`); }); }); }
      out.push(loin.length ? 'ÉCART après le chargement, un suiveur sous 8 points du meneur — ' + loin.join(' · ') : `OK  après le chargement de ${lieux} lieux de départ, chaque suiveur à 8 points au moins du meneur`);
      out.push(dessus.length ? 'SUPERPOSÉ au chargement — ' + dessus.join(' · ') : `OK  au chargement de ${lieux} lieux de départ, personne n'est posé sur le joueur`);
      // 3. la reprise au bureau de Maître Yûnus (personnage.js la fait aussi) : Idris n'est plus posé sur lui, et s'en écarte
      await ouvrir('idris', 0, { saga: 'idris', ci: 0, obj: 4, map: 'archives', opts: {}, pos: 'bureau', party: ['idris'], npcs: {}, foes: [], chests: [], flags: {} });
      { const y = W.npcs.find(q => q.id === 'yunus_n'), P = W.player, d = Math.hypot(y.x - P.x, y.y - P.y); out.push(`${d >= 9 && !W.corps().some(e => W.touche(e, P.x, P.y)) ? 'OK ' : 'SUPERPOSÉ'} reprise au bureau : Idris à ${d.toFixed(1)} points de Maître Yûnus`); }
      // 4. les marches de récit, jouées pour de vrai et comme le jeu les joue. Le joueur se tient là où l'objectif le laisse
      // (sous celui à qui il vient de parler, au lieu où il devait aller ; au départ pour une ouverture), non sur la place du
      // PNJ caché ; ce qui précède la marche dans le récit est joué (« hide », « show » : W.place puis W.ecarter), puis la
      // marche, hors du joueur automatique. À chaque image : une case pleine ? le pied du joueur (W.touche) ? celui d'un
      // autre ? la distance au joueur. Puis la même marche, le joueur posé en travers de la ligne droite : elle doit le
      // contourner, par un chemin plus long que la ligne droite, sans jamais entrer dans son pied (« SUPERPOSÉ »). Témoin :
      // la ligne droite d'avant, rejouée là (W.chemin remplacé le temps d'une marche), entre dans son pied et le contrôle
      // la relève — sans quoi il ne prouverait rien.
      const marches = []; const fouille = (x, ou) => { if (!x || typeof x !== 'object') return;
        if (Array.isArray(x)) x.forEach((op, k) => { if (Array.isArray(op) && op[0] === 'walk' && typeof op[1] === 'string') marches.push(Object.assign({ op, avant: x.slice(0, k) }, ou)); });
        for (const k in x) fouille(x[k], ou); };
      for (const s of Object.values(I.sagas)) (s.chapters || []).forEach((ch, ci) => { const fin = Math.max(0, (ch.objectives || []).length - 1);
        fouille(ch.intro, { s: s.id, ci, obj: 0, o: null }); (ch.objectives || []).forEach((o, oi) => fouille(o, { s: s.id, ci, obj: oi, o })); fouille(ch.outro, { s: s.id, ci, obj: fin, o: null }); });
      const T = 16, caseDe = q => [Math.floor(q.x / T), Math.floor((q.y - 2) / T)];
      // le trajet est suivi image par image, et entre deux images point par point (au plus un point d'écart) : sur une
      // machine chargée, une image peut sauter dix points — un pied fait dix-huit points de large. La marche se joue à
      // demi-vitesse (I.speed = 0,5 : deux fois plus d'images) ; sa durée est rapportée à la vitesse du jeu.
      const LENT = 0.5;
      const regarder = e => { const P = W.player, m = W.map, autres = W.corps().filter(q => q !== e), r = { n: 0, pts: 0, pleines: 0, vu: '', pied: 0, corps: 0, qui: '', min: 1e9, long: 0 }; let x0 = e.x, y0 = e.y, va = true;
        const voir = (x, y) => { r.pts++; const tx = Math.floor(x / T), ty = Math.floor((y - 2) / T); if (m.solid[ty * m.w + tx]) { r.pleines++; r.vu = tx + ',' + ty; }
          if (W.touche({ x, y }, P.x, P.y)) r.pied++; const o = autres.find(q => W.touche(q, x, y)); if (o) { r.corps++; r.qui = o.name || 'un coffre'; } r.min = Math.min(r.min, Math.hypot(x - P.x, y - P.y)); };
        const jusque = (x, y) => { const L = Math.hypot(x - x0, y - y0), n = Math.max(1, Math.ceil(L)); for (let k = 1; k <= n; k++) voir(x0 + (x - x0) * k / n, y0 + (y - y0) * k / n); r.long += L; x0 = x; y0 = y; };
        voir(x0, y0); (function image() { if (!va) return; r.n++; if (e.x !== x0 || e.y !== y0) jusque(e.x, e.y); requestAnimationFrame(image); })();
        return () => { va = false; if (e.x !== x0 || e.y !== y0) jusque(e.x, e.y); return r; }; };
      // plan : la longueur du chemin que la marche va suivre (W.chemin, comme W.walkTo l'appelle), qui ne dépend pas des images
      const marcher = async (mc, e, b) => { const c = W.chemin(e, b[0], b[1]); let plan = 0; for (let k = 1; k < c.length; k++) plan += Math.hypot(c[k][0] - c[k - 1][0], c[k][1] - c[k - 1][1]); const fin = regarder(e), t0 = performance.now(); I.speed = LENT; try { await S.run([mc.op]); } finally { I.speed = 1; } const r = fin(); r.duree = (performance.now() - t0) / 1000 * LENT; r.plan = plan; return r; };
      const pied = r => `${r.pied ? r.pied + ' point(s) du trajet dans le pied du joueur' : 'jamais dans le pied du joueur'} (au plus près à ${r.min.toFixed(1)} points), ${r.corps ? r.corps + ' dans le pied de ' + r.qui : 'ni dans celui d’un autre'}, ${r.pleines ? r.pleines + ' sur une case pleine (' + r.vu + ')' : 'aucun point sur une case pleine'}`;
      for (const mc of marches) { const s = I.sagas[mc.s], ch = s.chapters[mc.ci], def = (ch.npcs || []).find(q => q.id === mc.op[1]), o = mc.o || {}, nom = `${mc.s}/${ch.id}`;
        if (!def) { out.push(`ÉCART marche de récit ${nom} : « ${mc.op[1]} » n'est pas dans le chapitre`); continue; }
        // a. comme dans le jeu
        await ouvrir(mc.s, mc.ci, { saga: mc.s, ci: mc.ci, obj: mc.obj, map: def.map || ch.map, opts: ch.opts || {}, pos: o.goto || (mc.o ? def.at : ch.start), party: ch.party, npcs: {}, foes: [], chests: [], flags: {} });
        W.lock = true; // la carte n'avance pas d'elle-même (un lieu atteint achèverait l'objectif) : seul le récit joue
        const P = W.player, cible = o.talk ? W.ent(o.talk) : null; let ou = o.goto ? 'au lieu « ' + o.goto + ' »' : mc.o ? 'à sa place de reprise' : 'au départ';
        if (cible && cible.placed && !cible.hidden) { const c = caseDe(cible), q = W.resolve([null, 0, 0], W.map.id, P, [c[0], c[1] + 1]); if (q) { P.x = q[0]; P.y = q[1]; ou = 'sous « ' + cible.name + ' »'; } }
        W.resetTrail(); W.updateCam(true); const ici = [P.x, P.y], objectif = W.objIndex;
        I.debug.auto = true; I.speed = 40; await S.run(mc.avant); I.debug.auto = false; I.speed = 1; S.hideDialog();
        const e = W.ent(mc.op[1]), a = [e.x, e.y], b = W.resolve(mc.op[2], e.map, e), droit = dist(a, b), borne = droit * 3 / 70 + 0.4, bout = () => dist([e.x, e.y], b) <= 1;
        if (objectif !== mc.obj) out.push(`ÉCART marche de récit ${nom} : le point de reprise n'a pas gardé l'objectif ${mc.obj} (${objectif})`);
        let r = await marcher(mc, e, b);
        out.push(`${r.pied || r.corps ? 'SUPERPOSÉ' : r.pleines || r.duree > borne || !bout() ? 'ÉCART' : 'OK '} marche de récit ${nom}, comme dans le jeu : le joueur ${ou} (${ici.map(Math.round)}), « ${e.name} » ${mc.avant.some(q => q[0] === 'show' && q[1] === mc.op[1]) ? 'paraît à ' + dist(a, ici).toFixed(0) + ' points de lui et ' : ''}va de ${a.map(Math.round)} à ${b.map(Math.round)} (${droit.toFixed(0)} points en ligne droite, ${r.long.toFixed(0)} parcourus) en ${r.duree.toFixed(2)} s (au plus ${borne.toFixed(2)} s), ${r.n} images, ${r.pts} points suivis : ${pied(r)}`);
        // b. le joueur en travers de la ligne droite : la case libre, loin des deux bouts, où la ligne droite passe le plus
        // longtemps dans son pied (le témoin en a d'autant plus d'images)
        const m = W.map, L = k => [a[0] + (b[0] - a[0]) * k / 100, a[1] + (b[1] - a[1]) * k / 100]; let poste = null;
        for (let k = 15; k <= 85; k += 5) { const q = L(k), tx = Math.floor(q[0] / T), ty = Math.floor((q[1] - 2) / T), x = tx * T + 8, y = ty * T + 13;
          if (m.solid[ty * m.w + tx] || [[-4, -5], [4, -5], [-4, 0], [4, 0]].some(d => W.solidAt(x + d[0], y + d[1])) || dist([x, y], a) < 14 || dist([x, y], b) < 14) continue;
          let n = 0; for (let j = 0; j <= 100; j++) { const q2 = L(j); if (W.touche({ x: q2[0], y: q2[1] }, x, y)) n++; } if (n && (!poste || n > poste[2])) poste = [x, y, n]; }
        if (!poste) { out.push(`NOTE marche de récit ${nom} : aucune case libre sur la ligne droite pour y poser le joueur en travers`); continue; }
        e.x = a[0]; e.y = a[1]; P.x = poste[0]; P.y = poste[1]; W.resetTrail(); W.updateCam(true);
        r = await marcher(mc, e, b);
        out.push(`${r.pied || r.corps ? 'SUPERPOSÉ' : r.plan <= droit + 1 || r.pleines || r.duree > borne || !bout() ? 'ÉCART' : 'OK '} marche de récit ${nom}, le joueur en travers (${poste[0]},${poste[1]} : la ligne droite passe ${poste[2]} fois sur 101 dans son pied) : « ${e.name} » le contourne par un chemin de ${r.plan.toFixed(0)} points (${r.long.toFixed(0)} suivis) au lieu de ${droit.toFixed(0)}, en ${r.duree.toFixed(2)} s, ${r.n} images, ${r.pts} points suivis : ${pied(r)}`);
        // c. témoin : la ligne droite d'avant, rejouée le joueur en travers, doit être relevée
        e.x = a[0]; e.y = a[1]; const chemin = W.chemin; W.chemin = (q, x, y) => [[q.x, q.y], [x, y]];
        try { r = await marcher(mc, e, b); } finally { W.chemin = chemin; }
        out.push(`${r.pied ? 'OK ' : 'ÉCART'} témoin ${nom} : la ligne droite d'avant, rejouée le joueur en travers, ${r.pied ? 'passe ' + r.pied + ' point(s) de son trajet sur ' + r.pts + ' dans son pied (' + r.n + ' images) — le contrôle la relève' : 'n’entre jamais dans son pied : le contrôle ne prouverait rien'}`);
      }
      W.lock = false;
      if (!marches.length) out.push('ÉCART aucune marche de récit trouvée dans les récits');
      return out;
    });
    out.forEach(l => console.log(l)); suiveursKo = out.filter(l => /^(ÉCART|SUPERPOSÉ)/.test(l)).length;
    await page.close();
  }
  if (mode === 'suiveurs') console.log(suiveursKo || errors.length ? `✗ ${suiveursKo} écart(s)` : '✓ SUIVEURS CONFORMES — les siens à seize points, à toutes les cadences ; personne posé sur personne ; les marches de récit suivent un chemin et contournent le joueur');
  if (errors.length) { console.log('--- ERREURS (' + errors.length + ') ---'); [...new Set(errors)].slice(0, 25).forEach(e => console.log(e)); }
  else console.log('Aucune erreur console.');
  await browser.close();
  process.exit(errors.length || suiveursKo ? 1 : 0);
})();
