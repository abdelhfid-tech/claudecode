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
      // 2.16 — les corps. « PNJ EN TRAVERS » : à chaque point de reprise, chaque PNJ (et chaque coffre) posé sur le lieu, sa case
      // rendue pleine, ne doit couper aucun lieu nommé de là où se tient le joueur — à moins que le pas de côté qu'il ferait
      // (vers une case voisine libre) ne rouvre le passage. « SUPERPOSÉ » (à pied et au doigt) : le joueur reste plus de trente
      // pas dans le pied de quelqu'un, ou un lieu se charge avec quelqu'un à moins de 9 points de lui.
      const vusT = {}, travers = () => { const m = W.map, p = W.player; if (!m || !W.saga || W.excursion || I.scene !== W) return; const w = m.w, plein = new Uint8Array(m.solid);
        const zone = () => { const vu = new Uint8Array(w * m.h), s = Math.floor((p.y - 2) / 16) * w + Math.floor(p.x / 16), q = [s]; if (s < 0 || s >= vu.length) return vu; vu[s] = 1;
          for (let k = 0; k < q.length; k++) { const i = q[k], x = i % w, y = (i - x) / w; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(o => { const X = x + o[0], Y = y + o[1], j = Y * w + X; if (X < 0 || Y < 0 || X >= w || Y >= m.h || vu[j] || plein[j]) return; vu[j] = 1; q.push(j); }); } return vu; };
        const joint = (vu, s) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = s[0] + dx, Y = s[1] + dy; if (X >= 0 && Y >= 0 && X < w && Y < m.h && vu[Y * w + X]) return true; } return false; };
        const lieux = Object.keys(m.spots), v0 = zone(), base = lieux.filter(k => joint(v0, m.spots[k])), corps = W.corps(), caseDe = e => Math.floor((e.y - 2) / 16) * w + Math.floor(e.x / 16), prises = corps.map(caseDe), ici = caseDe(p);
        corps.forEach(e => { const i = caseDe(e), cle = m.id + ':' + (e.id || JSON.stringify(e.at)) + ':' + i; if (vusT[cle] || i === ici || m.solid[i]) return; vusT[cle] = 1;
          plein[i] = 1; const coupes = base.filter(k => !joint(zone(), m.spots[k])); if (!coupes.length) { plein[i] = 0; return; }
          const x = i % w, y = (i - x) / w, cote = !e.id ? null : [[1, 0], [-1, 0], [0, 1], [0, -1]].map(o => (y + o[1]) * w + x + o[0]).find(j => { if (j === ici || m.solid[j] || prises.includes(j)) return false; plein[i] = 0; plein[j] = 1; const r = base.every(k => joint(zone(), m.spots[k])); plein[j] = 0; plein[i] = 1; return r; });
          plein[i] = 0; const qui = e.id ? (e.name || e.id) : 'un coffre (' + (e.gear || e.item || e.codex) + ')';
          if (cote !== undefined && cote !== null) log.push(`PNJ dans un passage ${W.saga.id}/${W.ch.id} objectif ${W.objIndex} sur ${m.id} : ${qui} — son pas de côté rouvre le chemin de ${coupes.join(', ')}`);
          else log.push(`PNJ EN TRAVERS ${W.saga.id}/${W.ch.id} objectif ${W.objIndex} sur ${m.id} : ${qui} (case ${x},${y}) coupe ${coupes.join(', ')}`); }); };
      if (walk === 'walk' || walk === 'tap') { let dans = 0, lieu = ''; const ou = W.update; W.update = function () { const r = ou.apply(this, arguments);
        if (W.map && W.saga && I.scene === W && !W.excursion) { const p = W.player, k = W.saga.id + '/' + (W.ch && W.ch.id) + ' ' + W.map.id, L = W.corps();
          if (k !== lieu) { lieu = k; const n = L.find(e => Math.hypot(e.x - p.x, e.y - p.y) < 9); if (n) log.push(`SUPERPOSÉ ${k} : au chargement, ${n.name || 'un coffre'} à ${Math.round(Math.hypot(n.x - p.x, n.y - p.y))} points du joueur`); }
          const e = L.find(q => W.touche(q, p.x, p.y)); if (e) { if (++dans === 31) log.push(`SUPERPOSÉ ${k} objectif ${W.objIndex} : le joueur reste dans le pied de ${e.name || 'un coffre'}`); } else dans = 0; }
        return r; }; }
      const ock = W.checkpoint; W.checkpoint = function () { const A = I.audio; if (I.scene === W && !I.battle.active && (A.wantTrack !== A.place || PASSAGE.includes(A.place))) log.push(`MUSIQUE ${W.saga.id}/${W.ch.id} objectif ${W.objIndex} : voulue « ${A.wantTrack} », lieu « ${A.place} »`); const r = ock.apply(this, arguments); try { travers(); } catch (e) { log.push('ERR travers ' + e.message); } return r; };
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
      log.push(`CORPS ${Object.keys(vusT).length} places de PNJ et de coffres éprouvées, leur case rendue pleine (2.16)`);
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
     jouées pour de vrai (hors du joueur automatique), ne traversent aucune case pleine et durent au plus trois fois la
     ligne droite d'avant. « SUIVEURS CONFORMES », sinon « ÉCART » ou « SUPERPOSÉ ». */
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
      await ouvrir('idris', 0, { saga: 'idris', ci: 0, obj: 1, map: 'archives', opts: {}, pos: 'bureau', party: ['idris'], npcs: {}, foes: [], chests: [], flags: {} });
      { const y = W.npcs.find(q => q.id === 'yunus_n'), P = W.player, d = Math.hypot(y.x - P.x, y.y - P.y); out.push(`${d >= 9 && !W.corps().some(e => W.touche(e, P.x, P.y)) ? 'OK ' : 'SUPERPOSÉ'} reprise au bureau : Idris à ${d.toFixed(1)} points de Maître Yûnus`); }
      // 4. les marches de récit, jouées pour de vrai
      const marches = []; const fouille = (x, ou) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x) && x[0] === 'walk' && typeof x[1] === 'string') marches.push(Object.assign({ op: x }, ou)); for (const k in x) fouille(x[k], ou); };
      for (const s of Object.values(I.sagas)) (s.chapters || []).forEach((ch, ci) => { fouille(ch.intro, { s: s.id, ci, obj: 0 }); (ch.objectives || []).forEach((o, oi) => fouille(o, { s: s.id, ci, obj: oi })); fouille(ch.outro, { s: s.id, ci, obj: (ch.objectives || []).length - 1 }); });
      for (const mc of marches) { const s = I.sagas[mc.s], ch = s.chapters[mc.ci], def = (ch.npcs || []).find(q => q.id === mc.op[1]); if (!def) { out.push(`ÉCART marche de récit ${mc.s}/${ch.id} : « ${mc.op[1]} » n'est pas dans le chapitre`); continue; }
        await ouvrir(mc.s, mc.ci, { saga: mc.s, ci: mc.ci, obj: mc.obj, map: def.map || ch.map, opts: ch.opts || {}, pos: def.at, party: ch.party, npcs: {}, foes: [], chests: [], flags: {} });
        const e = W.ent(mc.op[1]); e.hidden = false; W.place(e); const a = [e.x, e.y], b = W.resolve(mc.op[2], e.map, e), droit = dist(a, b), m = W.map; let pleines = 0, n = 0, vu = '';
        const t0 = performance.now(); let suivre = true; (function regarde() { if (!suivre) return; n++; const tx = Math.floor(e.x / 16), ty = Math.floor((e.y - 2) / 16); if (m.solid[ty * m.w + tx]) { pleines++; vu = tx + ',' + ty; } requestAnimationFrame(regarde); })();
        await S.run([mc.op]); suivre = false; const duree = (performance.now() - t0) / 1000, borne = droit * 3 / 70 + 0.4;
        out.push(`${pleines || duree > borne || dist([e.x, e.y], b) > 1 ? 'ÉCART' : 'OK '} marche de récit ${mc.s}/${ch.id} : « ${e.name} » va de ${a.map(Math.round)} à ${b.map(Math.round)} (${droit.toFixed(0)} points en ligne droite) en ${duree.toFixed(2)} s (au plus ${borne.toFixed(2)} s), ${n} images, ${pleines ? pleines + ' sur une case pleine (' + vu + ')' : 'aucune sur une case pleine'}`); }
      if (!marches.length) out.push('ÉCART aucune marche de récit trouvée dans les récits');
      return out;
    });
    out.forEach(l => console.log(l)); suiveursKo = out.filter(l => /^(ÉCART|SUPERPOSÉ)/.test(l)).length;
    await page.close();
  }
  if (mode === 'suiveurs') console.log(suiveursKo || errors.length ? `✗ ${suiveursKo} écart(s)` : '✓ SUIVEURS CONFORMES — les siens à seize points, à toutes les cadences ; personne posé sur personne ; les marches de récit suivent un chemin');
  if (errors.length) { console.log('--- ERREURS (' + errors.length + ') ---'); [...new Set(errors)].slice(0, 25).forEach(e => console.log(e)); }
  else console.log('Aucune erreur console.');
  await browser.close();
  process.exit(errors.length || suiveursKo ? 1 : 0);
})();
