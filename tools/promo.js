#!/usr/bin/env node
/* Livret du joueur et planches de promotion.
   Tout ce qui est montré vient du jeu : écrans capturés en jouant, sprites tirés du moteur, textes tirés des données.
   Usage : node tools/promo.js [captures|recit|decors|coeur|equipement|mobile|sprites|livret|planches|all]
     captures : joue le prologue et la saga I, s'arrête aux moments utiles, écrit promo/img/*.jpg
     sprites  : personnages, sceaux, égrégores, carreaux, pièces à bâtir, écrit promo/img/*.png
     livret   : assemble promo/livret.src.html et les données en promo/livret.html (autonome)
                et promo/livret.artifact.html (fragment à publier)
     planches : exporte chaque planche du livret en promo/planches/*.jpg (1920 px de large) */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const PROMO = path.join(ROOT, 'promo'), IMG = path.join(PROMO, 'img'), OUT = path.join(PROMO, 'planches');
const GAME = 'file://' + path.join(ROOT, 'index.html');
const mode = process.argv[2] || 'all';
const only = process.argv[3] ? process.argv[3].split(',') : null;
[PROMO, IMG, OUT].forEach(d => fs.mkdirSync(d, { recursive: true }));

/* ---------- tribus, peuples et alliés : qui l'on rencontre ----------
   Le nom et l'apparence viennent des données. La présentation reprend le début d'une entrée du Recueil
   (recueil : [saga, id]) ou, à défaut, une ligne neutre (texte). f : personnage de fiction. */
const GROUPES = [
  { titre: 'Les Ansâr de Médine', texte: 'Les « Auxiliaires » : les gens de Médine, Aws et Khazraj, qui ont ouvert leurs maisons et leurs palmeraies aux Émigrés venus de La Mecque.',
    gens: [['abubakr', 'hubab'], ['abubakr', 'bashir'], ['abubakr', 'ancien'], ['ali', 'abuayyub']] },
  { titre: 'Les tribus d’Arabie', recueil: ['abubakr', 'ridda'], n: 1,
    gens: [['abubakr', 'delegue'], ['abubakr', 'dirgham', 'f'], ['umar', 'bedouin'], ['umar', 'fazari'], ['umar', 'suraqa'], ['khalid', 'bedouin'], ['khalid', 'chamelier']] },
  { titre: 'Les Arabes chrétiens : Ghassân, al-Hîra, Najrân', recueil: ['khalid', 'arabes_chretiens'], n: 1,
    gens: [['umar', 'jabala'], ['khalid', 'wahb', 'f'], ['khalid', 'amr_hira'], ['abubakr', 'najran'], ['khalid', 'econome', 'f'], ['khalid', 'ermite']] },
  { titre: 'Rome et le Shâm', texte: 'L’empire romain d’Orient tient le Shâm : des garnisons, des marchands, des moines, et à Îliyâ’ (Jérusalem) le patriarche Sophrone, qui ne veut remettre la ville qu’au calife en personne.',
    gens: [['umar', 'sophrone'], ['umar', 'garde'], ['umar', 'moine'], ['khalid', 'marchand'], ['khalid', 'ancien_bourg', 'f'], ['uthman', 'pretre']] },
  { titre: 'La Perse', recueil: ['umar', 'hurmuzan'], n: 1, gens: [['umar', 'hurmuzan'], ['caid', 'farrokh', 'f']] },
  { titre: 'Koufa et l’Irak', recueil: ['ali', 'koufa'], n: 2, gens: [['ali', 'kumayl'], ['ali', 'shurayh'], ['ali', 'qanbar'], ['ali', 'ashtar'], ['ali', 'ibnkawwa']] },
  { titre: 'L’Égypte et la mer', recueil: ['uthman', 'flotte'], n: 2, gens: [['uthman', 'ibnsad'], ['uthman', 'charpentier'], ['uthman', 'vigie'], ['uthman', 'ancien_ile']] },
  { titre: 'Les gens de la Citadelle', texte: 'Autour du Caïd : les amghars des tribus berbères, un général, un caravanier, un moine-médecin, et des géomètres perses à qui son père donna asile. Tous sont de fiction.',
    gens: [['caid', 'idir', 'f'], ['caid', 'meksa', 'f'], ['caid', 'amezyan', 'f'], ['caid', 'warsen', 'f'], ['caid', 'izem', 'f'], ['caid', 'yishaq', 'f'], ['caid', 'cyprien', 'f']] },
  { titre: 'Les gens de la Cité-Miroir', texte: 'En 2084, sous le grand écran : un enfant qui pose des questions, et ceux que la ville a enfermés chacun dans son idole. Tous sont de fiction.',
    gens: [['idris', 'gamin', 'f'], ['idris', 'defileur', 'f'], ['idris', 'regent', 'f'], ['idris', 'admire', 'f'], ['idris', 'compteur', 'f'], ['idris', 'carto', 'f']] },
  { titre: 'Ceux qui parlent des deux côtés', texte: 'Dans chaque saga, un personnage inventé dit à chacun ce qu’il veut entendre et sert son propre compte. Il vient toujours du camp du héros. Ce n’est jamais un Compagnon ni un personnage historique.',
    gens: [['abubakr', 'thamir', 'f'], ['umar', 'hazim', 'f'], ['khalid', 'ghalib', 'f'], ['uthman', 'akhbar', 'f'], ['ali', 'madan', 'f'], ['caid', 'chambellan', 'f']] }
];

/* ---------- l'équipement : tenues d'exemple, sur une silhouette sans nom ----------
   [nom de fichier, rôle, titre, ce qui est porté]. Les noms des pièces viennent des données. */
const SILH = { kind: 'homme', robe: '#7a4a32', head: '#e6dcc4', cloak: '#4a3626', coiffe: 'imama', manteau: 'long' }, LETTRE = { kind: 'homme', robe: '#e9e2d0', head: '#f4f0e6', cloak: '#7a6a52', coiffe: 'imama_large', manteau: 'epaule' };
const TENUES = [
  ['depart', 'guerrier', 'Au départ', { md: 'epee_fer', tete: 'turban', corps: 'tunique' }, SILH],
  ['lancier', 'guerrier', 'Lancier', { md: 'lance_khatt', mg: 'rondache', tete: 'casque_fer', corps: 'cotte' }, SILH],
  ['archer', 'guerrier', 'Archer', { md: 'arc_nab', tete: 'casque_cuir', corps: 'gilet_cuir' }, SILH],
  ['ligne', 'gardien', 'Homme de ligne', { md: 'masse_fer', mg: 'grand_bouclier', tete: 'casque_bandes', corps: 'lamelles' }, SILH],
  ['eclaireur', 'stratege', 'Éclaireur', { md: 'dague', mg: 'bouclier_cuir', tete: 'coiffe_mailles', corps: 'matelassee' }, SILH],
  ['scribe', 'sage', 'Scribe', { md: 'ecritoire', mg: 'tablette', tete: 'turban_voyage', corps: 'tunique_lin' }, LETTRE],
  ['marcheur', 'soigneur', 'Marcheur', { md: 'baton_acacia', mg: 'gourde', tete: 'calotte', corps: 'manteau_laine' }, LETTRE]
];

/* ---------- outillage commun ---------- */
async function openGame(browser, errors) {
  const ctx = await browser.newContext({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await p.goto(GAME); await p.waitForTimeout(1900);
  await p.addStyleTag({ content: 'body.promo-clean #hud,body.promo-clean #toasts,body.promo-clean #compass,body.promo-clean #menubtn,body.promo-clean #buildbtn,body.promo-clean #pad{visibility:hidden!important}' });
  // arrêts : le jeu automatique s'interrompt quand la condition devient vraie, au repos, entre deux objectifs
  await p.evaluate(() => {
    const I = window.ISNAD, W = I.world, o = W.autoStep;
    I.audio.setOn(false);
    W.autoStep = function () {
      if (window.__stop) { let k = false; try { k = window.__stop(W, I); } catch (e) { k = false; }
        if (k) { I.debug.auto = false; I.speed = 1; window.__stop = null; window.__stopped = true; return; } }
      return o.apply(this, arguments);
    };
  });
  const ev = (fn, arg) => p.evaluate(fn, arg);
  const T = {
    p, ev,
    key: async (k, n, w) => { for (let i = 0; i < (n || 1); i++) { await p.keyboard.press(k); await p.waitForTimeout(w || 260); } },
    shot: async (name) => { if (only && !only.includes(name)) return; await p.screenshot({ path: path.join(IMG, name + '.jpg'), type: 'jpeg', quality: 90 }); console.log('  ✓', name); },
    clean: on => ev(on => { document.body.classList.toggle('promo-clean', on); const m = window.ISNAD.world.map; if (m) { if (on) { if (m.mini) m._mini = m.mini; m.mini = null; } else if (m._mini) m.mini = m._mini; } }, on),
    // place le joueur sur un lieu nommé (décalage en pixels), compagnons en file derrière lui
    place: (spot, dx, dy, dir, tx, ty) => ev(([spot, dx, dy, dir, tx, ty]) => {
      const W = window.ISNAD.world, P = W.player; if (!W.map.spots[spot]) return false; const s = W.resolve(spot, W.map.id, P); if (!s || isNaN(s[0])) return false;
      P.x = s[0] + (dx || 0); P.y = s[1] + (dy || 0); if (dir !== undefined && dir !== null) P.dir = dir;
      W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([P.x + (tx || 0) * i * 1.25, P.y + (ty || 0) * i * 1.25, P.dir]);
      W.updateCam(true); return [Math.round(P.x / 16), Math.round(P.y / 16)];
    }, [spot, dx, dy, dir, tx, ty]),
    runTo: async (cond, timeout) => {
      await ev(src => { const I = window.ISNAD; window.__stop = new Function('W', 'I', 'return (' + src + ')'); window.__stopped = false; I.debug.auto = true; I.speed = 30; }, cond);
      const t0 = Date.now();
      while (Date.now() - t0 < (timeout || 150000)) { if (await ev(() => window.__stopped)) { await p.waitForTimeout(450); return true; } await p.waitForTimeout(50); }
      await ev(() => { window.ISNAD.debug.auto = false; window.ISNAD.speed = 1; window.__stop = null; });
      console.log('  ! arrêt non atteint :', cond); return false;
    },
    // avance le dialogue touche par touche jusqu'à ce que la condition soit vraie
    until: async (fn, max, arg) => { for (let i = 0; i < (max || 60); i++) { if (await ev(fn, arg)) return true; await p.keyboard.press('Enter'); await p.waitForTimeout(330); } return false; },
    state: () => ev(() => { const I = window.ISNAD, W = I.world; return { saga: W.saga && W.saga.id, ch: W.ch && W.ch.id, obj: W.objIndex, map: W.map && W.map.id, busy: I.script.busy, battle: !!I.battle.active, party: W.party }; })
  };
  return T;
}
const idle = () => { const I = window.ISNAD; return !I.script.busy && I.scene === I.world && !I.battle.active; };
const chainShown = () => !document.querySelector('#chain').hidden;

/* ---------- 1. captures en jouant ---------- */
async function captures(browser, errors) {
  if (process.env.SEUL_CHANTIER) return chantier(browser, errors);
  console.log('Captures — récit');
  const T = await openGame(browser, errors), { p, ev, key, shot, clean, place, runTo, until } = T;
  await shot('titre');
  // prologue : Cité-Miroir, Archives, la Chaîne
  await ev(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 30; window.__stop = new Function('W', 'I', 'return W.ch && W.ch.id === "p1" && W.objIndex === 0'); window.__stopped = false; });
  await p.keyboard.press('Enter');
  for (let i = 0; i < 400; i++) { if (await ev(() => window.__stopped)) break; await p.waitForTimeout(50); }
  await p.waitForTimeout(700);
  await place('rue', 0, 0, 2); await p.waitForTimeout(900); await shot('cite');
  await runTo('W.ch.id === "p1" && W.objIndex === 3');
  await p.waitForTimeout(500); await shot('archives');
  await ev(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 30; });
  for (let i = 0; i < 600; i++) { if (await ev(chainShown)) break; await p.waitForTimeout(100); }
  await ev(() => { window.ISNAD.debug.auto = false; window.ISNAD.speed = 1; }); await p.waitForTimeout(900);
  await shot('chaine');
  // saga I
  await p.keyboard.press('Enter'); await p.waitForTimeout(2300); await shot('saga-carton');
  await runTo('W.saga.id === "abubakr" && W.ch.id === "ab1" && W.objIndex === 0');
  await p.waitForTimeout(600); await shot('explorer');
  // la natte : prier, sauvegarder
  await place('priere', 0, 14, 3); await p.waitForTimeout(900);
  await key('Enter', 1, 700);
  await key('ArrowDown', 2, 200); await key('Enter', 1, 700); await shot('emplacements');
  await key('Escape', 1, 500); await until(idle, 6);
  await place('priere', 0, 14, 3); await p.waitForTimeout(400);
  await key('Enter', 1, 600); await key('Enter', 1, 1300); await shot('priere');
  await until(idle, 12);
  // noosphère, puis la Saqîfa : pourparler, choix, citation, combat à trois
  await runTo('W.ch.id === "ab1" && W.objIndex === 3');
  await p.waitForTimeout(700); await shot('noosphere');
  // l'émotion sans visage : 'Umar à genoux dans la cour de la mosquée, Abû Bakr devant lui
  if (await runTo('W.ch.id === "ab1" && W.objIndex === 4')) {
    await ev(() => { const W = window.ISNAD.world, n = W.npcs.find(x => x.id === 'umar'), P = W.player; n.dir = 0; P.x = n.x - 2; P.y = n.y + 30; P.dir = 3;
      W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([P.x + i * 1.25, P.y + i * 0.5, 3]); W.updateCam(true); });
    await clean(true); await p.waitForTimeout(1200); await shot('emotion'); await clean(false);
  }
  await runTo('W.ch.id === "ab1" && W.objIndex === 5');
  await ev(() => { const W = window.ISNAD.world, s = W.resolve(W.cur().goto, W.map.id, W.player); W.player.x = s[0]; W.player.y = s[1]; W.resetTrail(); });
  const seen = {};
  for (let i = 0; i < 140; i++) {
    await p.waitForTimeout(420);
    const st = await ev(() => { const I = window.ISNAD, c = document.querySelector('#card'), ch = document.querySelector('#choice'), d = document.querySelector('#dialog');
      return { battle: !!I.battle.active, idle: !I.script.busy && I.scene === I.world && !I.battle.active, card: c.hidden ? '' : c.className, parley: !ch.hidden && !!ch.querySelector('.phead'), choice: !ch.hidden && !ch.querySelector('.phead'), dialog: !d.hidden, obj: I.world.objIndex }; });
    if (st.idle && st.obj !== 5) break;
    if (st.battle && !seen.battle) {
      seen.battle = 1;
      const cmdReady = () => { const c = document.querySelector('#battle .cmd'), b = document.querySelector('#battle .banner'); return c.children.length > 1 && !c.querySelector('.mhint') && b.hidden; };
      for (let j = 0; j < 40; j++) { if (await ev(cmdReady)) break; await p.waitForTimeout(600); if (j > 5 && j % 2) await p.keyboard.press('Enter'); }
      await p.waitForTimeout(500); await shot('combat-menu');
      await ev(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 6; });
      for (let j = 0; j < 200; j++) { if (!(await ev(() => !!window.ISNAD.battle.active))) break; await p.waitForTimeout(150); }
      await ev(() => { window.ISNAD.debug.auto = false; window.ISNAD.speed = 1; }); await p.waitForTimeout(500); continue;
    }
    if (st.parley && !seen.parley) { seen.parley = 1; await shot('pourparler'); }
    else if (st.card.indexOf('parley') >= 0 && !seen.pcard) { seen.pcard = 1; await p.waitForTimeout(400); await shot('pourparler-carton'); }
    else if (st.card.indexOf('quote') >= 0 && !seen.quote) { seen.quote = 1; await p.waitForTimeout(500); await shot('citation'); }
    else if (st.card.indexOf('victory') >= 0 && !seen.victory) { seen.victory = 1; await p.waitForTimeout(400); await shot('victoire'); }
    else if (st.choice && !seen.choice) { seen.choice = 1; await shot('choix'); }
    else if (st.dialog && !seen.dialog && seen.parley) { seen.dialog = 1; await p.waitForTimeout(2600); await shot('dialogue'); }
    await p.keyboard.press('Enter');
  }
  console.log('  Saqîfa :', Object.keys(seen).join(', '));
  // chapitre 2 : bâtir, comptoir des caravanes, cadran des étoiles
  await runTo('W.ch.id === "ab2" && W.objIndex === 1 && !!W.cur().build');
  await p.waitForTimeout(600);
  await ev(() => { const B = window.ISNAD.build, W = window.ISNAD.world; ['pierre', 'eau', 'grain', 'palme', 'pise', 'laine'].forEach(k => B.give(k, 14, true)); });
  await place('souk', -40, 60, 0); await p.waitForTimeout(500);
  const pos = await ev(() => { const W = window.ISNAD.world; return [Math.floor(W.player.x / 16), Math.floor(W.player.y / 16)]; });
  console.log('  poses :', JSON.stringify(await ev(([px, py]) => { const B = window.ISNAD.build, r = [];
    r.push(B.placeAt(px + 3, py + 2, 'puits')); [[4, 3], [5, 2], [2, 3]].forEach(d => r.push(B.placeAt(px + d[0], py + d[1], 'palmier')));
    [[3, 4], [4, 4], [5, 4]].forEach(d => r.push(B.placeAt(px + d[0], py + d[1], 'champ'))); r.push(B.placeAt(px - 3, py + 2, 'bergerie')); r.push(B.placeAt(px - 4, py + 4, 'chamelier'));
    [[-1, 4], [0, 4], [1, 4]].forEach(d => r.push(B.placeAt(px + d[0], py + d[1], 'tranchee'))); r.push(B.placeAt(px + 1, py + 2, 'rosace')); r.push(B.placeAt(px - 1, py + 2, 'lanterne')); B.refresh(); return r.map(x => x || 'ok'); }, pos)));
  await key('b', 1, 500); for (let i = 0; i < 5; i++) await key('v', 1, 90);
  await p.waitForTimeout(400); await shot('batir');
  await key('b', 1, 400);
  await place('comptoir', 0, 5, 2); await p.waitForTimeout(800); await shot('etoiles');
  await key('Enter', 1, 700); await shot('comptoir');
  await key('ArrowDown', 2, 150); await key('Enter', 1, 600); await shot('routes');
  await key('Enter', 1, 700);                                   // confier la cargaison à la première route
  await key('ArrowDown', 3, 150); await key('Enter', 1, 600);   // « Partir »
  await until(idle, 10);
  // halte : le groupe, le Recueil, les quatre piliers
  await key('Escape', 1, 600); await key('ArrowDown', 1, 350); await shot('halte-groupe');
  await key('ArrowDown', 2, 200); await key('Enter', 1, 500); await key('ArrowDown', 3, 200); await p.waitForTimeout(300); await shot('recueil');
  await key('Escape', 1, 500); await key('ArrowDown', 4, 200); await p.waitForTimeout(300); await shot('halte-piliers');
  await key('Escape', 1, 500); await until(idle, 4);
  // la route pillée : renforts, pourparler
  ev(() => { window.ISNAD.trade.raid({ loss: 12, name: 'le Yémen' }); return 1; });
  const rs = {};
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(480);
    const k = await ev(() => { const c = document.querySelector('#choice'); return c.hidden ? '' : (c.querySelector('.phead') ? 'parley' : 'menu'); });
    if (k === 'menu' && !rs.menu) { rs.menu = 1; await shot('renforts'); }
    if (k === 'parley') { await shot('pillage'); break; }
    await p.keyboard.press('Enter');
  }
  await p.close();

  if (!process.env.SANS_CHANTIER) await chantier(browser, errors);
}

/* ---------- 1 bis. le chantier de la mosquée, la fin de la saga I, puis une rencontre ---------- */
async function chantier(browser, errors) {
  // chapitre 3 : le chantier de la mosquée, sur une page neuve (le récit y arrive seul)
  console.log('Captures — chantier');
  const U = await openGame(browser, errors);
  await U.ev(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 30; });
  await U.p.keyboard.press('Enter');
  for (let i = 0; i < 600; i++) { if (await U.ev(chainShown)) break; await U.p.waitForTimeout(100); }
  await U.p.keyboard.press('Enter');
  if (await U.runTo('W.saga && W.saga.id === "abubakr" && W.ch.id === "ab3" && W.objIndex === 2 && !!W.cur().build', 240000)) {
    await U.p.waitForTimeout(600);
    await U.ev(() => { const W = window.ISNAD.world, st = window.ISNAD.build.sites().dhulqassa; W.player.x = (st.x + 4) * 16 + 8; W.player.y = (st.y + st.h) * 16 + 10; W.player.dir = 3; W.resetTrail(); W.updateCam(true); });
    await U.key('b', 1, 600); await U.shot('chantier');
    await U.ev(() => { const I = window.ISNAD, W = I.world; I.build.autoBuild(W.cur().build); I.build.refresh(); I.build.after(); });
    await U.p.waitForTimeout(1900); await U.shot('mosquee-fondee');
    await U.until(() => !window.ISNAD.script.busy, 14);
    await U.ev(() => { const W = window.ISNAD.world, st = window.ISNAD.build.sites().dhulqassa; W.player.x = st.nx * 16 + 8; W.player.y = st.ny * 16 + 24; W.player.dir = 3; W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([W.player.x - i * 1.25, W.player.y + i * 0.5, 3]); W.updateCam(true); });
    await U.p.waitForTimeout(800); await U.shot('mosquee-batie');
  }
  // la suite du récit se joue seule : fin de la saga I, veillée du Caïd, puis la première rencontre de la Cité-Miroir
  if (await U.runTo('W.saga && W.saga.id === "idris" && W.ch.id === "r_abubakr" && W.objIndex === 1', 420000)) {
    await U.place('ecran', 48, 52, 3, 0, 0); await U.clean(true); await U.p.waitForTimeout(1200); await U.shot('rencontre-enfant'); await U.clean(false);
    await U.ev(() => { const W = window.ISNAD.world, n = W.npcs.find(x => x.id === 'defileur'), P = W.player; P.x = n.x; P.y = n.y + 16; P.dir = 3; W.resetTrail(); W.updateCam(true); });
    await U.p.waitForTimeout(600); await U.p.keyboard.press('Enter');
    for (let i = 0; i < 30; i++) { await U.p.waitForTimeout(450); if (await U.ev(() => { const c = document.querySelector('#choice'); return !c.hidden && !!c.querySelector('.phead'); })) break; await U.p.keyboard.press('Enter'); }
    await U.p.waitForTimeout(600); await U.shot('rencontre');
  }
  await U.p.close();

}

/* ---------- 2. décors : un saut par chapitre, HUD masqué ---------- */
const DECORS = [
  // nom, saga, chapitre, [carte, heure], lieu, dx, dy, dir, file des compagnons (tx, ty)
  ['d-medine-jour', 'abubakr', 2, ['medine', 'day'], 'mosquee_cour', 0, 30, 3, 1, 0.4],
  ['d-medine-soir', 'abubakr', 2, ['medine', 'dusk'], 'priere', 0, 26, 3, -1, 0.5],
  ['d-medine-nuit', 'umar', 0, ['medine', 'night'], 'mosquee_porte', 0, 26, 3, 1, 0.3],
  ['d-souk', 'abubakr', 1, ['medine', null], 'souk', 0, 20, 0, -1, 0],
  ['d-desert', 'khalid', 0, ['desert', 'day'], 'dunes', 0, 0, 2, -1, 0.2],
  ['d-oasis', 'khalid', 0, ['desert', 'night'], 'oasis', 0, 30, 3, -1, 0.3],
  ['d-camp', 'khalid', 1, ['camp', 'dusk'], 'etendard', 0, 28, 3, 1, 0.3],
  ['d-romaine', 'khalid', 2, ['romaine', null], 'forum', 0, 20, 3, -1, 0.3],
  ['d-palais', 'umar', 2, ['palais', 'day'], 'nef', 0, 10, 3, 0, 1],
  ['d-navire', 'uthman', 1, ['navire', 'day'], 'pont', 0, 0, 2, -1, 0],
  ['d-koufa', 'ali', 0, ['koufa', null], 'place', 0, 10, 0, 1, 0.2],
  ['d-noos', 'ali', 2, ['noos', null], 'noeud2', 0, 0, 2, -1, 0.2],
  ['d-citadelle', 'caid', 0, ['citadelle', 'dusk'], 'cour', 0, 30, 3, 1, 0.3],
  ['d-citadelle-mosquee', 'caid', 1, ['citadelle', 'night'], 'priere', 0, 22, 3, -1, 0.4],
  ['d-cite', 'idris', 0, ['cite', null], 'ecran', -30, 26, 2, -1, 0],
  ['d-archives', 'idris', 0, ['archives', null], 'chaine', 0, 40, 3, 0, 1]
];
async function decors(browser, errors) {
  console.log('Captures — décors');
  const T = await openGame(browser, errors), { p, ev, shot, clean, place, runTo } = T;
  await ev(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 30; });
  await p.keyboard.press('Enter');
  for (let i = 0; i < 600; i++) { if (await ev(chainShown)) break; await p.waitForTimeout(100); }
  for (const [name, saga, ci, alt, spot, dx, dy, dir, tx, ty] of DECORS) {
    if (only && !only.includes(name)) continue;
    // le jeu automatique est enclenché avant le départ du chapitre : sinon un carton d'introduction attend une touche
    await ev(([s, c]) => { const I = window.ISNAD, W = I.world; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); /* l'écran masqué n'écoute plus les touches */
      window.__stop = () => true; window.__stopped = false; I.debug.auto = true; I.speed = 30; W.roster = {}; W.saga = null; I.script.flags = {}; W.startChapter(s, c); }, [saga, ci]);
    let ok = false; for (let i = 0; i < 400; i++) { if (await ev(() => window.__stopped)) { ok = true; break; } await p.waitForTimeout(50); }
    if (!ok) { console.log('  ! décor sauté :', name, JSON.stringify(await T.state())); continue; }
    await p.waitForTimeout(300);
    await ev(() => { const W = window.ISNAD.world; W.objIndex = 99; W.foes = []; }); // prise de vue : ni objectif ni égrégore à déclencher en posant le personnage
    if (alt) await ev(([m, t, spot]) => { const W = window.ISNAD.world; W.loadMap(m, t ? { time: t } : {}, spot); }, [alt[0], alt[1], spot]);
    const at = await place(spot, dx, dy, dir, tx, ty);
    await clean(true); await p.waitForTimeout(1500);
    await shot(name); if (!at) console.log('  ! lieu introuvable :', name, spot);
    await clean(false);
  }
  // l'idole de la saga I, groupe de trois : menu, vertus, cible, coup porté
  if (!only || only.some(n => n.startsWith('combat-'))) {
    await ev(() => { const I = window.ISNAD, W = I.world; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; });
      window.__stop = () => true; window.__stopped = false; I.debug.auto = true; I.speed = 30; W.roster = {}; W.saga = null; I.script.flags = {}; W.startChapter('abubakr', 2); });
    for (let i = 0; i < 400; i++) { if (await ev(() => window.__stopped)) break; await p.waitForTimeout(50); }
    await ev(() => { const I = window.ISNAD, W = I.world; W.objIndex = 99; W.foes = [];
      const find = a => { if (!Array.isArray(a)) { if (a && typeof a === 'object') for (const v of Object.values(a)) { const r = find(v); if (r) return r; } return null; }
        if (a[0] === 'battle' && a[1] && a[1].boss) return a[1]; for (const v of a) { const r = find(v); if (r) return r; } return null; };
      const b = find(W.saga.chapters[2].objectives); W.party.forEach(id => { W.hero(id).sakina = 100; });
      I.battle.start(Object.assign({}, b, { intro: null })); });
    const cmdReady = () => { const c = document.querySelector('#battle .cmd'), b = document.querySelector('#battle .banner'); return c.children.length > 1 && !c.querySelector('.mhint') && b.hidden; };
    for (let j = 0; j < 40; j++) { if (await ev(cmdReady)) break; await p.waitForTimeout(600); if (j > 5 && j % 2) await p.keyboard.press('Enter'); }
    await p.waitForTimeout(600); await shot('combat-boss');
    await T.key('ArrowDown', 2, 220); await T.key('Enter', 1, 550); await shot('combat-vertus');
    await T.key('Enter', 1, 550);
    if (await ev(() => !!document.querySelector('#battle .cmd .mhint'))) { await shot('combat-cible'); await p.keyboard.press('Enter'); }
    await p.waitForTimeout(380); await shot('combat-coup');
  }
  return T;
}

/* ---------- 2 ter. le cœur : natte, œuvres, lame, mal du cœur, idée noire, aide, énigme ---------- */
async function coeur(browser, errors) {
  console.log('Captures — le cœur');
  const ouvrir = async () => { const T = await openGame(browser, errors); await T.ev(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 30; });
    await T.p.keyboard.press('Enter'); for (let i = 0; i < 600; i++) { if (await T.ev(chainShown)) break; await T.p.waitForTimeout(100); } return T; };
  const aller = async (T, saga, ci) => { // même départ que les décors : jeu automatique jusqu'au premier repos
    await T.ev(([s, c]) => { const I = window.ISNAD, W = I.world; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); /* l'écran masqué n'écoute plus les touches */
      window.__stop = () => true; window.__stopped = false; I.debug.auto = true; I.debug.noOeuvres = true; I.speed = 30; W.roster = {}; W.saga = null; I.script.flags = {}; W.startChapter(s, c); }, [saga, ci]);
    for (let i = 0; i < 500; i++) { if (await T.ev(() => window.__stopped)) break; await T.p.waitForTimeout(50); }
    await T.p.waitForTimeout(300); await T.ev(() => { const W = window.ISNAD.world; W.foes = []; document.querySelector('#toasts').innerHTML = ''; });
  };
  const surNatte = T => T.ev(() => { const W = window.ISNAD.world, sp = W.map.spots.priere; W.player.x = sp[0] * 16 + 8; W.player.y = sp[1] * 16 + 13; W.player.dir = 3; W.resetTrail(); W.updateCam(true); });
  const choix = async (T, i) => { const o = await T.p.$$('#choice .opt'); await o[i < 0 ? o.length + i : i].click(); await T.p.waitForTimeout(550); };
  const carton = (T, cls) => T.ev(c => { const e = document.querySelector('#card'); return !e.hidden && e.classList.contains('on') && e.classList.contains(c); }, cls);
  const attends = async (T, fn, arg, n) => { for (let i = 0; i < (n || 80); i++) { if (await fn(T, arg)) return true; await T.p.waitForTimeout(150); } return false; };
  const pret = T => T.ev(() => { const c = document.querySelector('#battle .cmd'), b = document.querySelector('#battle .banner'); return !!c && c.querySelectorAll('.mi').length > 0 && !c.querySelector('.mhint') && (!b || b.hidden); });
  const sansToasts = T => T.ev(() => { document.querySelector('#toasts').innerHTML = ''; });

  // a. Médine : la natte, les œuvres du jour, une lame forgée, un compagnon de lumière
  let T = await ouvrir(); await aller(T, 'abubakr', 0);
  await T.ev(() => { window.ISNAD.ui.pause('carte'); }); await T.p.waitForTimeout(700); await T.shot('carte');
  await T.p.keyboard.press('Escape'); await T.p.waitForTimeout(350); // la halte se referme comme le ferait le joueur
  await T.ev(() => { window.ISNAD.trade.dirhams(60); window.ISNAD.world.hud(); }); await surNatte(T);
  await T.ev(() => { window.ISNAD.oeuvres.natte(); }); await T.p.waitForTimeout(700); await T.shot('natte');
  await choix(T, 1); await T.shot('oeuvres');
  await choix(T, 0); await attends(T, carton, 'oeuvre'); await T.p.waitForTimeout(500); await T.shot('oeuvre-dhikr');
  await T.p.keyboard.press('Enter'); await T.p.waitForTimeout(900);
  await T.ev(() => { window.ISNAD.oeuvres.state().oeuvres.aumone = 2; });
  await choix(T, 3); await attends(T, carton, 'oeuvre'); await T.p.waitForTimeout(400); await T.p.keyboard.press('Enter');
  await attends(T, carton, 'lame'); await T.p.waitForTimeout(600); await sansToasts(T); await T.shot('lame');
  await T.p.keyboard.press('Enter'); await attends(T, carton, 'animal'); await T.p.waitForTimeout(600); await sansToasts(T); await T.shot('compagnon-lumiere');
  await T.p.keyboard.press('Enter'); await T.p.waitForTimeout(900);
  await choix(T, -1); await choix(T, -1); await sansToasts(T);
  // b. « Que faire ? », puis la halte
  await T.ev(() => { const W = window.ISNAD.world; W.player.y += 40; W.resetTrail(); W.updateCam(true); window.ISNAD.ui.guide(); }); await T.p.waitForTimeout(600); await T.shot('que-faire');
  await choix(T, -1);
  await T.ev(() => { const d = window.ISNAD.oeuvres.state(); d.oeuvres.dhikr = 2; d.oeuvres.jeune = 1; d.oeuvres.priere = 2; d.zad = 3; window.ISNAD.ui.pause(); }); await T.p.waitForTimeout(500);
  const cote = async label => { for (const b of await T.p.$$('#menu .side button')) { if ((await b.textContent()).includes(label)) { await b.hover(); await T.p.waitForTimeout(350); return; } } };
  await cote('Œuvres et lames'); await T.shot('halte-lames');
  await cote('Compagnons de lumière'); await T.shot('halte-lumiere');
  await T.p.keyboard.press('Escape'); await T.p.waitForTimeout(350); // la halte se referme comme le ferait le joueur
  // c. un mal du cœur, la lame en main
  await T.ev(() => { const I = window.ISNAD; I.oeuvres.state().zad = 3; I.battle.start({ group: ['avarice'], boss: true, bg: 'cite' }); });
  await attends(T, pret, null, 160); await T.p.waitForTimeout(400); await T.shot('mal');
  await T.p.close();

  // d. une idée noire, au milieu d'un pourparler (saga I, chapitre 2)
  T = await ouvrir(); await aller(T, 'abubakr', 1);
  await T.ev(() => { const I = window.ISNAD, find = a => { if (!a || typeof a !== 'object') return null; if (Array.isArray(a) && a[0] === 'parley' && a[1] && a[1].with === 'dirgham') return a[1]; for (const v of Array.isArray(a) ? a : Object.values(a)) { const r = find(v); if (r) return r; } return null; };
    const P = find(I.sagas.abubakr.chapters[1].objectives); I.debug.auto = false; I.speed = 1; I.script.run([['parley', P]]); });
  for (let i = 0; i < 40; i++) { if (await carton(T, 'noir')) break; await T.p.keyboard.press('Enter'); await T.p.waitForTimeout(420); }
  await T.p.waitForTimeout(600); await sansToasts(T); await T.shot('idee-noire');
  // on lui répond : après le carton, l'interlocuteur dit ce qui le retient, puis les trois manières s'offrent
  const offre = T => T.ev(() => { const c = document.querySelector('#choice'); return !c.hidden && c.querySelectorAll('.opt').length === 3 && !!c.querySelector('.voie'); });
  for (let i = 0; i < 30; i++) { if (await offre(T)) break; await T.p.keyboard.press('Enter'); await T.p.waitForTimeout(450); }
  await T.p.waitForTimeout(500); await sansToasts(T); await T.shot('idee-noire-reponse');
  await T.p.close();

  // e. une énigme du cœur, dans la Citadelle
  T = await ouvrir(); await aller(T, 'caid', 1); await surNatte(T);
  await T.ev(() => { const W = window.ISNAD.world; W.player.y += 30; W.player.dir = 0; W.resetTrail(); W.updateCam(true); W.hud(); }); await T.p.waitForTimeout(900); await T.shot('enigme');
  await T.p.close();
}

/* ---------- 2 ter. l'équipement : la halte, le choix d'une pièce, la proposition, les artisans, le combat ---------- */
async function equipement(browser, errors) {
  console.log('Captures — l’équipement');
  const T = await openGame(browser, errors); await T.ev(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 30; });
  await T.p.keyboard.press('Enter'); for (let i = 0; i < 600; i++) { if (await T.ev(chainShown)) break; await T.p.waitForTimeout(100); }
  // saga III, chapitre 2 : trois compagnons d'armes, et une réserve comme on en a après un maillon
  await T.ev(() => { const I = window.ISNAD, W = I.world; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); /* l'écran masqué n'écoute plus les touches */
    window.__stop = () => true; window.__stopped = false; I.debug.auto = true; I.debug.noOeuvres = true; I.speed = 30; W.roster = {}; W.saga = null; I.script.flags = {}; W.startChapter('khalid', 1); });
  for (let i = 0; i < 500; i++) { if (await T.ev(() => window.__stopped)) break; await T.p.waitForTimeout(50); }
  await T.p.waitForTimeout(300);
  await T.ev(() => { const I = window.ISNAD, W = I.world, Gr = I.gear; W.foes = []; I.save.data.gear = {}; W.party.forEach(id => { delete I.save.data.equip[Gr.key(W.hero(id))]; delete I.save.data.gearInit[Gr.key(W.hero(id))]; Gr.of(W.hero(id)); });
    ['epee_yemen', 'lance_khatt', 'arc_nab', 'dague', 'rondache', 'casque_bandes', 'coiffe_mailles', 'cotte_saluqi', 'gilet_cuir', 'turban_voyage', 'masse_fer', 'grand_bouclier'].forEach(id => Gr.add(id, 1)); I.trade.dirhams(60); W.hud(); document.querySelector('#toasts').innerHTML = ''; });
  const sansToasts = () => T.ev(() => { document.querySelector('#toasts').innerHTML = ''; });
  await T.ev(() => window.ISNAD.ui.pause('equip')); await T.p.waitForTimeout(600); await T.shot('equipement');
  await T.ev(() => { [...document.querySelectorAll('#menu .side button')][2].click(); }); await T.p.waitForTimeout(400); await T.key('ArrowDown', 2, 200); await T.shot('equipement-piece');
  await T.key('Escape', 1, 300); await T.key('Escape', 1, 400);
  // une pièce arrive : « Qui la porte ? »
  T.ev(() => { window.ISNAD.script.run([['give', 'epee_inde']]); }); await T.p.waitForTimeout(1000); await sansToasts(); await T.shot('equipement-recu');
  await T.key('Enter', 1, 800); await sansToasts();
  // les artisans du camp
  T.ev(() => { window.ISNAD.trade.artisans(); }); await T.p.waitForTimeout(700); await T.key('Enter', 1, 500); await sansToasts(); await T.shot('artisans');
  for (let i = 0; i < 4; i++) { const k = await T.ev(() => { const c = document.querySelector('#choice'); if (c.hidden) return -1; const o = [...c.querySelectorAll('.opt')]; o[o.length - 1].click(); return o.length; }); if (k < 0) break; await T.p.waitForTimeout(450); }
  // au mieux, puis un combat : chacun porte ce qu'on lui a donné
  await T.ev(() => { const I = window.ISNAD; I.gear.bestAll(); document.querySelector('#toasts').innerHTML = ''; I.battle.start({ group: Object.keys(I.world.saga.enemies).slice(0, 2), bg: 'camp' }); });
  for (let i = 0; i < 160; i++) { if (await T.ev(() => { const c = document.querySelector('#battle .cmd'), b = document.querySelector('#battle .banner'); return !!c && c.querySelectorAll('.mi').length > 0 && !c.querySelector('.mhint') && (!b || b.hidden); })) break; await T.p.waitForTimeout(150); }
  await T.p.waitForTimeout(400); await T.shot('combat-equipe');
  await T.p.close();
}

/* ---------- 2 bis. téléphone, en portrait : croix et boutons tactiles ---------- */
async function mobile(browser, errors) {
  console.log('Captures — téléphone');
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await p.goto(GAME); await p.waitForTimeout(1900);
  const snap = async name => { await p.screenshot({ path: path.join(IMG, name + '.jpg'), type: 'jpeg', quality: 88 }); console.log('  ✓', name); };
  await snap('m-titre');
  await p.evaluate(() => { const I = window.ISNAD, W = I.world, o = W.autoStep; I.audio.setOn(false);
    W.autoStep = function () { if (window.__stop && window.__stop(W, I)) { I.debug.auto = false; I.speed = 1; window.__stop = null; window.__stopped = true; return; } return o.apply(this, arguments); };
    window.__stop = W => W.saga && W.saga.id === 'abubakr' && W.ch.id === 'ab1' && W.objIndex === 1; window.__stopped = false; I.debug.auto = true; I.speed = 30; });
  await p.keyboard.press('Enter');
  for (let i = 0; i < 600; i++) { if (await p.evaluate(() => !document.querySelector('#chain').hidden)) break; await p.waitForTimeout(100); }
  await p.waitForTimeout(500); await p.keyboard.press('Enter');
  for (let i = 0; i < 1200; i++) { if (await p.evaluate(() => window.__stopped)) break; await p.waitForTimeout(50); }
  await p.evaluate(() => { document.querySelector('#toasts').innerHTML = ''; });
  await p.waitForTimeout(1200); await snap('m-jeu');
  await p.tap('#helpbtn'); await p.waitForTimeout(600); await snap('m-aide');
  { const o = await p.$$('#choice .opt'); await o[o.length - 1].tap(); await p.waitForTimeout(400); }
  await p.evaluate(() => { const I = window.ISNAD; I.battle.start({ group: Object.keys(I.world.saga.enemies).slice(0, 2), bg: 'ville' }); });
  for (let i = 0; i < 120; i++) { if (await p.evaluate(() => { const c = document.querySelector('#battle .cmd'), b = document.querySelector('#battle .banner'); return !!c && c.querySelectorAll('.mi').length > 0 && (!b || b.hidden); })) break; await p.waitForTimeout(150); }
  await p.waitForTimeout(400); await snap('m-combat');
  await p.close();
}

/* ---------- 3. sprites tirés du moteur ---------- */
async function sprites(browser, errors, T) {
  console.log('Sprites');
  T = T || await openGame(browser, errors);
  const data = await T.ev(([PNJ, TENUES]) => {
    const I = window.ISNAD, G = I.gfx, D = window.ISNAD_DEFS, out = {};
    // tribus, peuples et alliés : le grand sprite de chaque personnage cité
    PNJ.forEach(([sid, id]) => { const s = I.sagas[sid]; let n = null; s.chapters.forEach(c => (c.npcs || []).forEach(x => { if (!n && x.id === id) n = x; })); if (!n) return;
      const look = n.hero ? Object.assign({ kind: 'compagnon' }, s.heroes[n.hero].look) : Object.assign({ kind: 'homme', robe: '#8a7355', head: '#e6dcc4' }, n.look);
      out['n-' + sid + '-' + id] = G.charGrand(look, 0, 0).toDataURL(); });
    const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x]; };
    const front = (look) => { const [c, x] = mk(16, 24); x.drawImage(G.charSheet(look), 0, 0, 16, 24, 0, 0, 16, 24); return c.toDataURL(); };
    const sagas = I.sagaList.slice().sort((a, b) => a.order - b.order);
    // héros (face), sceaux
    sagas.forEach(s => {
      Object.entries(s.heroes || {}).forEach(([id, h]) => { out['h-' + s.id + '-' + id] = front(Object.assign({ kind: 'compagnon' }, h.look)); });
      out['sceau-' + s.id] = G.seal(s.arabic, D.ELEMENTS[s.light].color).toDataURL();
    });
    // grands sprites (32 × 48) : face et profil de chaque héros ; les six attitudes de chaque meneur
    sagas.forEach(s => Object.entries(s.heroes || {}).forEach(([id, h]) => { const look = Object.assign({ kind: 'compagnon' }, h.look);
      out['g-' + s.id + '-' + id] = G.charGrand(look, 0, 0).toDataURL(); out['gl-' + s.id + '-' + id] = G.charGrand(look, 1, 0).toDataURL();
      if (id === s.id) D.POSES.forEach(p => { out['g-' + s.id + '-' + id + '-' + p] = G.charGrand(look, 0, 0, p).toDataURL(); }); }));
    // gens de rencontre : un par type
    const KIND = { homme: { robe: '#8a7355' }, ancien: { robe: '#6b5a48', head: '#e9e2d0' }, soldat: { robe: '#7a4a32' }, romain: { robe: '#8a2f2a' }, perse: { robe: '#2f5d6d', head: '#e9d9a8' }, moine: { robe: '#4a3d32' }, enfant: { robe: '#a8663c' }, marin: { robe: '#2f4a7a' }, cyber: { robe: '#2a3048', head: '#1c2030' }, savant: { robe: '#e9e2d0', head: '#f4f0e6' }, marchand: { robe: '#7b5a3a' }, berbere: { robe: '#2f4a7a', head: '#1f2f55' }, bedouin: { robe: '#7a6a52', head: '#e9dcc0', cloak: '#4a3626', trim: '#b5462f' } };
    Object.entries(KIND).forEach(([k, l]) => { out['k-' + k] = front(Object.assign({ kind: k }, l)); out['gk-' + k] = G.charGrand(Object.assign({ kind: k }, l), 0, 0).toDataURL(); });
    // égrégores : chacun à sa taille de combat
    sagas.forEach(s => Object.entries(s.enemies || {}).forEach(([id, e]) => { const sc = e.tier === 'boss' ? 3 : e.tier === 'elite' ? 2 : 1; out['e-' + s.id + '-' + id] = G.enemy(e.art, e.hue, sc, e.seed).toDataURL(); }));
    // le cœur : lames, figures du ciel, maux du cœur et idées noires
    { const O = I.oeuvres, CO = I.sagas.coeur;
      Object.keys(D.VICES).forEach(v => { out['lame-' + v] = O.lame(v).toDataURL(); });
      D.ANIMAUX.forEach(a => { out['bete-' + a] = O.bete(a).toDataURL(); });
      Object.entries(CO.enemies).forEach(([id, e]) => { out['e-coeur-' + id] = G.enemy(e.art, e.hue, 2, e.seed).toDataURL(); }); }
    // l'équipement : une icône par pièce ; des tenues d'exemple, de face et de profil ; gens d'armes variés
    { const Gr = I.gear, d = Gr.state();
      Object.keys(D.GEAR).forEach(id => { out['eq-' + id] = Gr.icon(id).toDataURL(); });
      TENUES.forEach(([nom, role, titre, eq, look]) => { const h = { id: nom, key: 'promo:' + nom, def: { role, look, name: nom }, lvl: 5 }; d.equip[h.key] = eq; d.gearInit[h.key] = 1; const L = Gr.look(h);
        out['eqh-' + nom] = G.charGrand(L, 0, 0).toDataURL(); out['eql-' + nom] = G.charGrand(L, 1, 0).toDataURL(); delete d.equip[h.key]; delete d.gearInit[h.key]; });
      ['#6a5a40', '#5a4632', '#4f4a45', '#6b5a48', '#64503a', '#3f4f6a', '#6f6250'].forEach((robe, i) => { out['tr-soldat-' + i] = G.charGrand({ kind: 'soldat', robe, head: '#e2d8c2', sel: i }, 0, 0).toDataURL(); });
      for (let i = 0; i < 4; i++) out['tr-romain-' + i] = G.charGrand({ kind: 'romain', robe: '#8a2f2a', head: '#c8c0b0', sel: i }, 0, 0).toDataURL(); }
    // carreaux et objets
    ['zellij', 'zsand', 'gwall', 'mihrab', 'trench', 'field', 'bwall'].forEach(t => { try { const [c, x] = mk(48, 48); for (let i = 0; i < 9; i++) x.drawImage(G.tile(t, i % 4, 0), (i % 3) * 16, Math.floor(i / 3) * 16); out['t-' + t] = c.toDataURL(); } catch (e) { /* carreau absent */ } });
    ['palm', 'well', 'pen_goat', 'pen_sheep', 'pen_camel', 'lantern', 'mat', 'rug', 'minbar', 'stall', 'tent', 'camel', 'bales', 'trunkcol', 'basin', 'isnad'].forEach(o => { try { out['o-' + o] = G.obj(o).toDataURL(); } catch (e) { /* objet absent */ } });
    // rosace
    { const [c, x] = mk(200, 200); x.imageSmoothingEnabled = true; I.maps.drawRosette(x, { x: 100, y: 100, R: 96, n: 8 }); out['rosace'] = c.toDataURL(); }
    return out;
  }, [GROUPES.reduce((a, g) => a.concat(g.gens), []), TENUES]);
  let n = 0;
  for (const [k, url] of Object.entries(data)) { fs.writeFileSync(path.join(IMG, k + '.png'), Buffer.from(url.split(',')[1], 'base64')); n++; }
  console.log('  ✓', n, 'sprites');
  await T.p.close();
}

/* ---------- 4. le livret : gabarit + données du jeu ---------- */
function livret() {
  const D = require(path.join(ROOT, 'src/core/defs.js'));
  const sagas = {}; const keep = global.ISNAD, keepW = global.window;
  global.window = global; global.ISNAD = { registerSaga: s => { sagas[s.id] = s; }, registerMusic: () => {} };
  fs.readdirSync(path.join(ROOT, 'src/data')).filter(f => /^(saga_.*|frame|caid|coeur)\.js$/.test(f)).forEach(f => require(path.join(ROOT, 'src/data', f)));
  global.ISNAD = keep; global.window = keepW;
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const five = Object.values(sagas).filter(s => !s.frame).sort((a, b) => a.order - b.order);
  const ROM = ['I', 'II', 'III', 'IV', 'V'];
  const col = s => D.ELEMENTS[s.light].color;
  const txt = g => g + '︎'; // présentation « texte », jamais émoji
  const R = {};
  R.PISTES = String(D.TRACKS.filter(t => t !== 'silence').length);
  R.SAGAS = five.map((s, i) => `
      <article class="saga" style="--c:${col(s)}">
        <img class="sceau" src="img/sceau-${s.id}.png" alt="" width="192" height="192">
        <div><span class="ord">Maillon ${ROM[i]} · ${esc(s.years)}</span><h3>${esc(s.name)}</h3><span class="lum">${esc(s.epithet)} · Lumière : ${esc(s.lightName)} (${esc(D.ELEMENTS[s.light].ar)})</span></div>
        <div><p class="dit">${esc(s.tagline)}</p>
          <ol>${s.chapters.map(c => `<li><b>${esc(c.title)}</b><span>${esc(c.sub)}</span></li>`).join('')}</ol>
          <div class="groupe">${Object.entries(s.heroes).map(([id, h]) => `<span><img class="px" src="img/g-${s.id}-${id}.png" alt="" width="32" height="48">${esc(h.name)}</span>`).join('')}</div>
        </div>
      </article>`).join('');
  R.CINQ = five.map((s, i) => `<article style="--c:${col(s)}"><img class="sceau" src="img/sceau-${s.id}.png" alt=""><span class="ord">Maillon ${ROM[i]} · ${esc(s.years.split(' · ')[1] || s.years)}</span><b>${esc(s.name)}</b><span class="lum">${esc(s.epithet)} · ${esc(s.lightName)}</span><p>${esc(s.tagline)}</p>`
    + `<ol>${s.chapters.map((c, j) => `<li><span>${ROM[j]}</span>${esc(c.title)}</li>`).join('')}</ol><div class="groupe">${Object.keys(s.heroes).map(id => `<img class="px" src="img/g-${s.id}-${id}.png" alt="">`).join('')}</div></article>`).join('');
  R.SCEAUX = five.map(s => `<figure><img src="img/sceau-${s.id}.png" alt=""><figcaption>${esc(s.heroes[s.id].name)}</figcaption></figure>`).join('');
  // planche 4 : les cinq meneurs, debout puis dans chacune des six attitudes
  const POSE = { prie: 'Recueillement', resolu: 'Résolution', accable: 'Accablement', salut: 'Salut', surpris: 'Surprise', garde: 'Garde' };
  R.ATTITUDES = '<span></span><span>Debout</span>' + D.POSES.map(p => `<span>${POSE[p]}</span>`).join('')
    + five.map(s => `<b style="color:${col(s)}">${esc(s.heroes[s.id].name)}</b><img class="px" src="img/g-${s.id}-${s.id}.png" alt="">` + D.POSES.map(p => `<img class="px" src="img/g-${s.id}-${s.id}-${p}.png" alt="">`).join('')).join('');
  // livret : une fiche par personnage, comme dans les manuels des jeux de rôle 16 bits
  const ROLE = { sage: 'Sage', gardien: 'Gardien', guerrier: 'Guerrier', soigneur: 'Soigneur', stratege: 'Stratège' };
  const FICTION = { // personnages de fiction sans entrée de biographie : résumé de ce que le jeu en dit
    'idris/idris': 'Archiviste de la Cité-Miroir, en 2084. Il descend aux Archives basses, y trouve la Chaîne et la remonte, maillon après maillon.',
    'idris/yunus': 'Il veille sur les Archives basses et sur la Chaîne. C’est auprès de lui qu’Idris apprend à citer ses sources.',
    'idris/salim': 'Dix ans passés à nourrir l’Agrégor. Il sait où est son cœur, et ne veut plus le servir.',
    'caid/geometre': 'L’un des savants perses à qui le vieux Caïd donna asile. Il mesure les champs, trace les rigoles et tient l’école.',
    'caid/capitaine': 'Il commande les sentinelles du rempart.' };
  const bioOf = (s, id) => (s.codex || []).find(c => c.cat === 'Biographie' && (c.id === id + '_bio' || c.id === 'bio_' + id));
  const debut = (t, n) => t.split(/(?<=[.!?»])\s+(?=[A-ZÀ-Ý'’«])/).slice(0, n).join(' ');
  const fiche = (s, id, lead) => { const h = s.heroes[id], e = D.ELEMENTS[h.el], b = bioOf(s, id), txt = b ? debut(b.text, lead ? 3 : 2) : FICTION[s.id + '/' + id] || '';
    const vertus = h.skills.map(k => `<li><b>${esc(k.name)}</b><span>niv. ${k.lvl}</span>${lead ? '<br><small>' + esc(k.desc) + '</small>' : ''}</li>`).join('');
    return `<article class="fiche-p${lead ? ' meneur' : ''}" style="--c:${e.color}">
        <div class="scene"><img class="px" src="img/g-${s.id}-${id}.png" alt="" width="32" height="48">${lead ? `<img class="px profil" src="img/gl-${s.id}-${id}.png" alt="" width="32" height="48">` : ''}</div>
        <div class="texte">
          <header>${lead ? `<img class="sceau" src="img/sceau-${s.id}.png" alt="">` : ''}<div><h4>${esc(h.name)}${h.arabic ? ` <span class="ar" lang="ar" dir="rtl">${h.arabic}</span>` : ''}</h4><p class="titre">${esc(h.title)}</p></div></header>
          <dl><div><dt>Rôle</dt><dd>${ROLE[h.role]}</dd></div><div><dt>Lumière</dt><dd style="color:${e.color}">${esc(e.name)} <i>(${esc(e.ar)})</i></dd></div><div><dt>Acte de Sakîna</dt><dd>${esc(h.limit.name)}</dd></div></dl>
          <p class="bio">${esc(txt)}</p>${b && b.src ? `<p class="src">${b.src === 'Fiction' ? 'Personnage de fiction' : 'D’après ' + esc(b.src)}</p>` : (b ? '' : '<p class="src">Personnage de fiction</p>')}
          ${lead ? `<p class="ultime"><b>${esc(h.limit.name)}.</b> ${esc(h.limit.desc || '')}</p><ul class="vertus">${vertus}</ul>
          <div class="attitudes">${D.POSES.map(p => `<figure><img class="px" src="img/g-${s.id}-${id}-${p}.png" alt="" width="32" height="48"><figcaption>${POSE[p]}</figcaption></figure>`).join('')}</div>` : `<p class="vertus-l">${h.skills.map(k => esc(k.name)).join(' · ')}</p>`}
        </div>
      </article>`; };
  const troupe = (s, titre) => `<div class="troupe"><h3>${titre}</h3>${fiche(s, s.id, true)}<div class="suite">${Object.keys(s.heroes).filter(id => id !== s.id).map(id => fiche(s, id, false)).join('')}</div></div>`;
  R.PERSONNAGES = five.map((s, i) => troupe(s, 'Maillon ' + ROM[i] + ' · ' + esc(s.lightName))).join('') + troupe(sagas.caid, 'La Citadelle') + troupe(sagas.idris, '2084 · La Cité-Miroir');
  const GENS = [['ancien', 'ancien'], ['savant', 'savant'], ['marchand', 'marchand'], ['bedouin', 'homme des tribus'], ['soldat', 'soldat'], ['berbere', 'Berbère'], ['perse', 'Perse'], ['romain', 'Romain'], ['moine', 'moine'], ['marin', 'marin'], ['enfant', 'enfant'], ['cyber', '2084']];
  R.GENS = GENS.map(([k, l]) => `<figure><img class="px" src="img/gk-${k}.png" alt="" width="32" height="48"><figcaption>${l}</figcaption></figure>`).join('');
  // les idoles : le nom vient des données, la légende résume la description du Recueil
  const IDOLES = [['abubakr', 'deni', 'le deuil qui refuse'], ['abubakr', 'clan', 'l’esprit de corps tribal'], ['abubakr', 'kadhdhab', 'la contrefaçon'], ['umar', 'aigle', 'l’orgueil d’empire'], ['umar', 'trone', 'la tyrannie'], ['khalid', 'peur_nombre', 'l’issue réduite à un décompte'],
    ['khalid', 'idole_heros', 'la gloire du vainqueur'], ['uthman', 'abime', 'la peur de la mer'], ['uthman', 'rumeur', 'ce qu’on répète sans l’avoir vu'], ['ali', 'slogan', 'la formule vidée de son sens'], ['ali', 'juge', 'se faire juge des cœurs'], ['idris', 'agregor', 'la fabrique des idoles']];
  R.IDOLES = IDOLES.map(([s, id, l]) => { const e = sagas[s].enemies[id]; return `<figure style="--h:${e.hue}"><img class="px" src="img/e-${s}-${id}.png" alt=""><b>${esc(e.name.replace(' — ', ', '))}</b><span>${l}</span></figure>`; }).join('');
  const CAP = { nord: 'Nord', 'nord-est': 'Nord-est', est: 'Est', 'sud-est': 'Sud-est', sud: 'Sud', 'sud-ouest': 'Sud-ouest', ouest: 'Ouest', 'nord-ouest': 'Nord-ouest' };
  const el = n => /^[aâeéèiîoôuû'’]/i.test(n) ? 'd’' : 'de ';
  R.ETOILES = Object.keys(CAP).map(d => D.STARS.find(x => x.dir === d)).map(st => `<tr><td class="n">${CAP[st.dir]}</td><td>${st.way ? st.way + ' ' + el(st.name) : ''}${esc(st.name)}</td><td class="ar" lang="ar" dir="rtl">${st.ar}</td><td>${esc(st.fr)}</td></tr>`).join('');
  R.LUMIERES = Object.entries(D.ELEMENTS).filter(([k]) => k !== 'fer').map(([k, e]) => `<div style="--c:${e.color}"><i>${txt(e.glyph)}</i><b>${esc(e.name)}</b><small>${esc(e.ar)}</small></div>`).join('');
  R.NUANCIER = Object.values(D.ELEMENTS).map(e => `<div style="--c:${e.color}"><i></i><span>${esc(e.name)}</span></div>`).join('');
  R.OBJETS = Object.values(D.ITEMS).map(o => `<tr><td class="n">${esc(o.name)}</td><td>${esc(o.desc)}</td></tr>`).join('');
  const cost = c => Object.keys(c).length ? Object.entries(c).map(([k, n]) => `${D.MATS[k].name} × ${n}`).join(', ') : 'La peine de creuser';
  const icon = p => p.tile ? `t-${p.tile}` : p.obj ? `o-${p.obj}` : 'rosace';
  let grp = ''; R.PIECES = Object.values(D.PIECES).map(p => (p.group !== grp ? (grp = p.group, `<tr><th colspan="3" style="padding-top:1.3em;color:var(--zellige)">${esc(p.group)}</th></tr>`) : '') + `<tr><td class="n"><img class="ic px" src="img/${icon(p)}.png" alt="">${esc(p.name)}</td><td style="white-space:nowrap">${cost(p.cost)}</td><td>${esc(p.desc)}</td></tr>`).join('');
  // tribus, peuples et alliés
  const pnj = (sid, id) => { let n = null; sagas[sid].chapters.forEach(c => (c.npcs || []).forEach(x => { if (!n && x.id === id) n = x; })); if (!n) throw new Error('personnage introuvable : ' + sid + '/' + id); return n; };
  const groupe = (g, court) => { const c = g.recueil ? sagas[g.recueil[0]].codex.find(x => x.id === g.recueil[1]) : null; if (g.recueil && !c) throw new Error('entrée du Recueil introuvable : ' + g.recueil.join('/'));
    const txt = c ? debut(c.text, g.n || 1) : g.texte, src = c ? `<p class="src">Recueil : ${esc(c.title)}${c.src ? ' · d’après ' + esc(c.src) : ''}</p>` : '';
    const figs = g.gens.map(([sid, id, f]) => `<figure><img class="px" src="img/n-${sid}-${id}.png" alt="" width="32" height="48"><figcaption>${court && f ? '<i>◆</i> ' : ''}${esc(pnj(sid, id).name)}${!court && f ? '<i>fiction</i>' : ''}</figcaption></figure>`).join('');
    return court ? `<article><b>${esc(g.titre)}</b><div>${figs}</div></article>` : `<article class="peuple"><h3>${esc(g.titre)}</h3><p>${esc(txt)}</p>${src}<div class="gens-l">${figs}</div></article>`; };
  R.PEUPLES = GROUPES.map(g => groupe(g, false)).join('');
  R.PEUPLESPLANCHE = GROUPES.map(g => groupe(g, true)).join('');
  // le cœur : œuvres, lames et maux, idées noires, figures du ciel
  const CO = sagas.coeur, viceDe = k => Object.keys(D.VICES).find(v => D.VICES[v].oeuvre === k), bas = n => n.replace(/^L(’|a |e )/, (m, x) => 'l' + x);
  R.OEUVRES = D.OEUVRES.map(k => { const o = CO.oeuvres[k], v = viceDe(k); return `<tr><td class="n"><span class="gl">${txt(o.glyph)}</span>${esc(o.name)}</td><td>${esc(o.desc)}</td><td style="color:${CO.lames[v].couleur}">${esc(CO.lames[v].name)} <small>· ${D.VICES[v].need} fois</small></td></tr>`; }).join('').replace(/· 1 fois/, '· une fois');
  R.LAMES = Object.keys(D.VICES).map(v => { const L = CO.lames[v], E = CO.enemies[v], V = D.VICES[v], o = CO.oeuvres[V.oeuvre];
    return `<article class="lame-f" style="--c:${L.couleur};--h:${E.hue}"><img class="px epee" src="img/lame-${v}.png" alt="" width="18" height="44"><div><h4>${esc(L.name)} <span>${esc(L.ar)}</span></h4><p class="forge">${esc(o.court)} × ${V.need}</p><p>${esc(debut(E.desc, 2))}</p></div><figure><img class="px" src="img/e-coeur-${v}.png" alt=""><figcaption>${esc(E.name)}</figcaption></figure></article>`; }).join('');
  R.NOIRES = Object.entries(CO.enemies).filter(([id]) => id.indexOf('noir_') === 0).map(([id, e]) => `<figure style="--h:${e.hue}"><img class="px" src="img/e-coeur-${id}.png" alt=""><figcaption>${esc(e.name)}</figcaption></figure>`).join('');
  R.BETES = D.ANIMAUX.map(a => { const A = CO.animaux[a]; return `<article class="bete-f" style="--c:${A.couleur}"><img class="px" src="img/bete-${a}.png" alt=""><div><h4>${esc(A.name)} <span>${esc(A.ar)}</span></h4><p class="don"><b>${esc(A.don)}.</b> ${esc(A.effet)}</p><p>${esc(A.texte)}</p><p class="src">${esc(A.vient)}</p></div></article>`; }).join('');
  R.SEPT = Object.keys(D.VICES).map(v => { const L = CO.lames[v], E = CO.enemies[v], V = D.VICES[v], o = CO.oeuvres[V.oeuvre];
    return `<article style="--c:${L.couleur};--h:${E.hue}"><img class="px epee" src="img/lame-${v}.png" alt=""><span class="oe">${esc(o.court)} × ${V.need}</span><b>${esc(L.name)}</b><i>${esc(L.ar)}</i><span class="tr">tranche</span><img class="px mal" src="img/e-coeur-${v}.png" alt=""><em>${esc(E.name)}</em></article>`; }).join('');
  R.CIEL = D.ANIMAUX.map(a => { const A = CO.animaux[a]; return `<figure style="--c:${A.couleur}"><img class="px" src="img/bete-${a}.png" alt=""><figcaption><b>${esc(A.name)}</b><span>${esc(A.don)}</span></figcaption></figure>`; }).join('');
  const malDe = c => { const v = c.vice; if (!v) return ''; const V = D.VICES[v]; return `${esc(CO.enemies[v].name)}<br><small style="color:${CO.lames[v].couleur}">${esc(CO.lames[v].name)} · ${esc(CO.oeuvres[V.oeuvre].court.toLowerCase())} × ${V.need}</small>`; };
  // les rencontres de la Cité-Miroir : qui, après quel maillon, et quels savoirs ouvrent les meilleurs arguments
  const findOp = (a, name) => { if (!a || typeof a !== 'object') return null; if (Array.isArray(a)) { if (a[0] === name && a[1] && typeof a[1] === 'object') return a[1]; for (const v of a) { const r = findOp(v, name); if (r) return r; } return null; } for (const v of Object.values(a)) { const r = findOp(v, name); if (r) return r; } return null; };
  const savoir = ref => { const [sid, id] = ref.split('/'), c = sagas[sid].codex.find(x => x.id === id); if (!c) throw new Error('savoir introuvable : ' + ref); return `${esc(c.title)} <small>(${sid === 'caid' ? 'la Citadelle' : esc(sagas[sid].heroes[sid].name)})</small>`; };
  R.RENCONTRES = sagas.idris.chapters.filter(c => c.after).map(c => { const s2 = sagas[c.after], P = findOp(c.objectives, 'parley'), needs = [];
    P.rounds.forEach(r => r.opts.forEach(o => { if (o.need && needs.indexOf(o.need) < 0) needs.push(o.need); }));
    const who = c.npcs.find(n => n.id === P.with);
    return `<tr><td class="n"><img class="ic px" style="width:32px;height:48px" src="img/n-idris-${who.id}.png" alt="">${esc(c.title)}</td><td style="color:${col(s2)}">${esc(s2.heroes[s2.id].name)} · ${esc(s2.lightName)}</td><td>${esc(P.intro)}</td><td>${needs.map(savoir).join('<br>')}</td><td>${malDe(c)}</td></tr>`; }).join('')
    + `<tr><td class="n">L’opérateur de garde</td><td style="color:${D.ELEMENTS.sabr.color}">Idris · Patience</td><td>${esc(findOp(sagas.idris.chapters.find(c => c.id === 'e1').objectives, 'parley').intro)}</td><td>L’isnâd <small>(les Archives)</small></td><td>Tous ceux qui n’ont pas été tranchés</td></tr>`;
  // l'équipement : catalogue par emplacement, étals par lieu, tenues d'exemple (mêmes mots que dans le jeu : gear.js)
  { const NOM = { atk: 'Force', mag: 'Esprit', def: 'Garde', spd: 'Élan', hp: 'Constance', sp: 'Souffle' }, pc = v => (v > 0 ? '+' : '−') + Math.abs(v) + ' %', typ = g => D.GEAR_TYPES[g.t], pct = v => Math.round(v * 100) + ' %';
    const effets = g => { const o = Object.keys(NOM).filter(k => g[k]).map(k => NOM[k] + ' ' + pc(g[k])); if (g.perce) o.push('perce la garde (' + pct(g.perce) + ')'); if (g.vif) o.push('frappe parfois deux fois (' + pct(g.vif) + ')'); if (g.prime) o.push('agit plus tôt au début du combat'); if (g.choc) o.push('peut étourdir (' + pct(g.choc) + ')'); if (g.parade) o.push('pare un coup de fer (' + pct(g.parade) + ')'); if (g.ferme) o.push('tient bon face à l’étourdissement (' + pct(g.ferme) + ')'); return o.join(' · '); };
    const ids = Object.keys(D.GEAR), de = s => ids.filter(id => typ(D.GEAR[id]).slot === s);
    R.NPIECES = String(ids.length);
    R.EQUIPEMENT = Object.keys(D.SLOTS).map(s => `<h3>${esc(D.SLOTS[s])}</h3><div class="pieces-g">` + de(s).map(id => { const g = D.GEAR[id]; return `<article class="piece"><img class="px" src="img/eq-${id}.png" alt="" width="18" height="18"><div><h4>${esc(g.name)} <span>${esc(typ(g).name.toLowerCase())}</span></h4><p class="fx">${esc(effets(g))}</p><p>${esc(g.desc)}</p></div></article>`; }).join('') + '</div>').join('');
    R.ARTISANS = Object.entries(D.GEAR_SHOPS).map(([m, L]) => `<tr><td class="n">${esc(D.MAPS[m].label)}</td><td>${L.map(id => `<span class="etal"><img class="px" src="img/eq-${id}.png" alt="" width="18" height="18">${esc(D.GEAR[id].name)}</span>`).join(' ')}</td></tr>`).join('');
    R.TENUES = TENUES.map(([nom, role, titre, eq]) => `<figure><span><img class="px" src="img/eqh-${nom}.png" alt="" width="32" height="48"><img class="px" src="img/eql-${nom}.png" alt="" width="32" height="48"></span><figcaption><b>${esc(titre)}</b>${Object.values(eq).map(id => esc(D.GEAR[id].name)).join(', ')}</figcaption></figure>`).join('');
    const COLS = { md: 5, mg: 2, tete: 3, corps: 3 }; // colonnes de la planche : 24, 8, 10 et 11 pièces tiennent en cinq rangs au plus
    R.ARSENAL = Object.keys(D.SLOTS).map(s => `<div class="ars"><span class="cap">${esc(D.SLOTS[s])} · ${de(s).length}</span><div style="--n:${COLS[s] || 3}">` + de(s).map(id => `<figure><img class="px" src="img/eq-${id}.png" alt=""><figcaption>${esc(D.GEAR[id].name)}</figcaption></figure>`).join('') + '</div></div>').join('');
    R.TROUPE = [0, 1, 2, 3, 4, 5, 6].map(i => `<img class="px" src="img/tr-soldat-${i}.png" alt="">`).join('') + [0, 1, 2, 3].map(i => `<img class="px" src="img/tr-romain-${i}.png" alt="">`).join('');
    R.TENUESPLANCHE = TENUES.slice(1).map(([nom, role, titre]) => `<figure><img class="px" src="img/eqh-${nom}.png" alt=""><figcaption>${esc(titre)}</figcaption></figure>`).join(''); }
  R.PALETTE = Object.values(D.PIECES).map(p => `<figure><img class="px" src="img/${icon(p)}.png" alt=""><figcaption>${esc(p.name)}</figcaption></figure>`).join('');
  R.VEILLEES = sagas.caid.chapters.map(c => `<tr><td class="n">${esc(c.title)}</td><td>${esc(c.sub)}</td></tr>`).join('');
  let src = fs.readFileSync(path.join(PROMO, 'livret.src.html'), 'utf8');
  src = src.replace(/\{\{([A-Z]+)\}\}/g, (m, k) => { if (!(k in R)) throw new Error('bloc inconnu : ' + k); return R[k]; });
  // images réellement utilisées (pour la publication) ; une image absente arrête l'assemblage
  const used = [...new Set([...src.matchAll(/(?:src|href)="(img\/[^"]+)"/g)].map(m => m[1]))].sort();
  const missing = used.filter(u => !fs.existsSync(path.join(PROMO, u))); if (missing.length) throw new Error('images absentes : ' + missing.join(', '));
  const [head, body] = src.split('<!-- corps -->');
  fs.writeFileSync(path.join(PROMO, 'livret.artifact.html'), head + body);
  fs.writeFileSync(path.join(PROMO, 'livret.html'), '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + '</head>\n<body>\n' + body + '</body>\n</html>\n');
  fs.writeFileSync(path.join(PROMO, 'fichiers.json'), JSON.stringify(used, null, 1) + '\n');
  const poids = used.reduce((n, u) => n + fs.statSync(path.join(PROMO, u)).size, 0);
  console.log(`Livret : ${used.length} images (${(poids / 1048576).toFixed(1)} Mo), page ${(Buffer.byteLength(head + body) / 1024).toFixed(0)} Ko`);
}

/* ---------- 5. export des planches en images ---------- */
async function planches(browser, errors) {
  const ctx = await browser.newContext({ viewport: { width: 1960, height: 1200 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await p.goto('file://' + path.join(PROMO, 'livret.html'));
  await p.evaluate(async () => { document.body.classList.add('export'); document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
    await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  await p.waitForTimeout(700);
  for (const h of await p.$$('.pl')) { const nom = await h.getAttribute('data-nom'); if (only && !only.includes(nom)) continue;
    await h.screenshot({ path: path.join(OUT, nom + '.jpg'), type: 'jpeg', quality: 93 }); const b = await h.boundingBox(); console.log('  ✓', nom, Math.round(b.width) + ' × ' + Math.round(b.height)); }
  await p.close();
}

(async () => {
  if (mode === 'livret') { livret(); return; }
  const browser = await chromium.launch(); const errors = [];
  if (mode === 'recit' || mode === 'captures' || mode === 'all') await captures(browser, errors);
  if (mode === 'coeur' || mode === 'captures' || mode === 'all') await coeur(browser, errors);
  if (mode === 'equipement' || mode === 'captures' || mode === 'all') await equipement(browser, errors);
  if (mode === 'mobile' || mode === 'captures' || mode === 'all') await mobile(browser, errors);
  if (mode === 'decors' || mode === 'captures' || mode === 'all') { const T = await decors(browser, errors); await sprites(browser, errors, T); }
  else if (mode === 'sprites') await sprites(browser, errors);
  if (mode === 'all') livret();
  if (mode === 'planches' || mode === 'all') { if (mode === 'planches') livret(); await planches(browser, errors); }
  if (errors.length) { console.log('--- ERREURS (' + errors.length + ') ---'); [...new Set(errors)].slice(0, 20).forEach(e => console.log(e)); }
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
