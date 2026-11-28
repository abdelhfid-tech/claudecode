#!/usr/bin/env node
/* ISNAD 2.x — mener plusieurs récits de front, revenir en 2084, et ce qui s'y passe.
   Le joueur peut à tout moment quitter un récit par la halte (« Revenir en 2084 ») : le récit est rangé là où il le
   laisse, et se reprend là, même après en avoir joué un autre. Au retour, il peut s'être passé quelque chose aux
   vieille mosquée (2.47 ; avant, les Archives basses) (chapitres « retour: n » de l'histoire-cadre) ; et la Citadelle, où Idris est né, s'ouvre depuis la
   Chaîne dès la première veillée entendue (chapitre « visite »).
   Cet outil le joue par les vrais boutons : deux sagas entamées et quittées, la partie exportée puis réimportée, chaque
   récit repris à son objectif et à sa place, les trois retours joués jusqu'au bout, la Citadelle visitée deux fois.
   2.23 (D212) : « Revenir en 2084 » mène, une fois joués les retours dus, aux quartiers de la Cité, à côté de Maître Yûnus ;
   on regagne la Chaîne par lui (« La Chaîne, au fond de la mosquée »), par les vrais boutons. Le contrôle des quartiers
   eux-mêmes est cite.js.
   2.48 (D240 ; le décideur, 27 novembre : « je veux que tu débloque toutes les sagas avec possibilité de sauvegarder
   l'avancement de chacune des saga » ; « dans la première page le bouton "continuer" pourra renvoyer vers les différentes
   sauvegardes » ; et, pour l'Agrégor, « Dans l'ordre où on joue ») : (a) après le prologue, les cinq maillons s'ouvrent par
   leurs boutons, dans l'ordre qu'on veut, et le dernier reste scellé ; (b) avec deux récits en cours, « Continuer » les
   montre, chacun repris exactement à sa place, B revient ; avec un seul, il le reprend comme toujours ; (c) la rencontre de
   'Uthmân jouée la première dit l'étape I, sans nommer l'Agrégor, la suivante l'étape II, la troisième l'étape III et la
   fiche — les textes des sagas et du Recueil suivent le nom reçu ; un soir laissé en chemin passe avant le dernier maillon ;
   (d) une partie de la 2.47 se charge, garde ses récits et continue à l'étape suivante. Après les contre-lectures : au refuge,
   un récit rangé, « Continuer » montre les deux ; un maillon achevé qu'on rejouait reprend à sa place ; une rencontre ouverte
   par le dernier maillon puis quittée reprend à sa place après sa veillée ; « Les degrés du mal » ne nomme pas l'Agrégor avant
   son nom reçu, dans chaque langue.
   Usage : node tools/retours.js [dossier de captures]      code de sortie 1 au premier « ÉCART » ou « BLOQUÉ » */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const out = process.argv[2] || path.join(__dirname, '../.smoke/retours');
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(__dirname, '../index.html');
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); };

(async () => {
  const browser = await chromium.launch(), errors = [];
  const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(url); await page.waitForTimeout(1700);

  // dans la page : de quoi mener le jeu
  await page.evaluate(() => {
    const I = window.ISNAD, W = I.world, S = I.script, q = s => document.querySelector(s);
    I.audio.setOn(false); I.speed = 40; I.debug.noOeuvres = true; // ni œuvre ni descente : on éprouve les retours, pas le cœur
    const T = window.__t = {};
    T.journal = []; { const os = W.startChapter; W.startChapter = function (sid, ci) { const ch = I.sagas[sid].chapters[ci]; T.journal.push(ch.id); if (I.cite && I.cite.refuge(ch)) I.debug.auto = false; return os.apply(this, arguments); }; } // les chapitres ouverts, dans l'ordre (2.23 : dans les quartiers de la Cité, la main revient au joueur)
    T.visible = id => { const e = q(id); return !!e && !e.hidden; };
    T.attendre = (cond, ms) => new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { let v = false; try { v = cond(); } catch (e) { v = false; } if (v) { clearInterval(iv); res(true); } else if (Date.now() - t0 > (ms || 120000)) { clearInterval(iv); res(false); } }, 60); });
    T.calme = () => I.scene === W && !!W.map && !S.busy && !W.lock && !I.battle.active && !W._autoBusy;
    // jouer le récit en cours jusqu'à ce que n objectifs soient atteints, puis rendre la main
    T.jusqua = async n => { const oc = W.checkpoint; W.checkpoint = function () { const r = oc.apply(this, arguments); if (W.objIndex >= n) I.debug.auto = false; return r; };
      I.debug.auto = true; const fini = await T.attendre(() => (W.objIndex >= n && !I.debug.auto && T.calme()) || T.visible('#chain'), 180000); W.checkpoint = oc; I.debug.auto = false; return fini && !T.visible('#chain'); };
    // jouer jusqu'à revenir devant la Chaîne
    T.jusquaLaChaine = async () => { I.debug.auto = true; const fini = await T.attendre(() => T.visible('#chain'), 240000); I.debug.auto = false; return fini; };
    T.etat = () => ({ saga: W.saga && W.saga.id, ch: W.ch && W.ch.id, ci: W.ci, obj: W.objIndex, carte: W.map && W.map.id, x: Math.round(W.player.x), y: Math.round(W.player.y), groupe: W.party.join('+'), drapeaux: Object.keys(S.flags).filter(k => S.flags[k] && !/^(lame|tranche)_/.test(k)).sort().join(',') });
    // la halte, par ses boutons
    T.halte = nom => { I.ui.pause(); const b = [...document.querySelectorAll('#menu .side button')].find(x => x.textContent.trim() === nom); if (!b) { const noms = [...document.querySelectorAll('#menu .side button')].map(x => x.textContent.trim()); I.input.emit('cancel'); return noms; } I.debug.auto = true; b.click(); return true; }; // ce qui se joue au retour se lit tout seul
    T.chaine = () => ({ bouton: (q('#chain header .cta') || {}).textContent || '', maillons: [...document.querySelectorAll('#chain .links .link')].map(b => ({ nom: (b.querySelector('h3') || {}).textContent, etat: (b.querySelector('.stt') || {}).textContent, ouvrir: (b.querySelector('.ouvrir') || {}).textContent })), pied: [...document.querySelectorAll('#chain .chainfoot button')].map(b => b.textContent) });
    T.toucher = sel => { const b = typeof sel === 'string' ? q(sel) : sel; if (!b) return false; b.click(); return true; };
    T.maillon = nom => [...document.querySelectorAll('#chain .links .link')].find(b => ((b.querySelector('h3') || {}).textContent || '').indexOf(nom) === 0);
    T.pied = nom => [...document.querySelectorAll('#chain .chainfoot button')].find(b => b.textContent === nom);
    // 2.48 : ce qui se dit (répliques, narrations, fiches données), dans l'ordre — S.run reçoit chaque liste, branches de « if » comprises
    // 2.49 : et les cartes de titre (T.titres), pour qu'un lancement n'en montre pas deux au même nom
    T.dits = []; T.titres = []; { const or = S.run; S.run = function (ops) { (Array.isArray(ops) ? ops : []).forEach(o => { if (Array.isArray(o) && o[0] === 'title') T.titres.push(String(o[1])); if (Array.isArray(o) && ['say', 'nar', 'legende', 'codex'].includes(o[0])) T.dits.push(o[0] === 'say' ? o[2] : o[0] === 'nar' || o[0] === 'legende' ? o[1] : 'codex:' + o[1]); }); return or.apply(this, arguments); }; }
    T.dernier = () => { const b = [...document.querySelectorAll('#chain .links .link')].find(x => (x.querySelector('.ord') || {}).textContent && /DERNIER MAILLON/.test(x.querySelector('.ord').textContent)); return b ? { scelle: b.disabled && b.classList.contains('locked'), nom: (((b.querySelector('.ep') || {}).childNodes || [])[0] || {}).textContent ? b.querySelector('.ep').childNodes[0].textContent.trim() : '', tl: (b.querySelector('.tl') || {}).textContent || '', el: b } : null; };
    // l'écran-titre : ses boutons ; ceux de la liste des récits en cours portent leur clé (data-reprise)
    T.titre = () => [...document.querySelectorAll('#title .vmenu > button')].map(b => ({ t: (b.childNodes[0] || {}).textContent || '', small: (b.querySelector('small') || {}).textContent || '', k: b.dataset.reprise || '', sel: b.classList.contains('sel') }));
    T.versTitre = () => { document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); I.ui.showTitle(); };
  });
  const ev = (fn, arg) => page.evaluate(fn, arg);
  const cap = n => page.screenshot({ path: path.join(out, n + '.png') });

  // ---------- 0. 2.48 (D240) : le prologue joué, les cinq maillons s'ouvrent par leurs boutons, dans l'ordre qu'on veut ----------
  { const s0 = await ev(async () => { const I = window.ISNAD, T = window.__t; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); await I.ui.showChain();
      const un = I.livres().find(L => L.n === 1).sagas, d = T.dernier();
      return { entete: document.querySelector('#chain header p').textContent, maillons: un.map(s => { const b = T.maillon(s.name); return b ? { id: s.id, nom: s.name, ouvert: !b.disabled && !b.classList.contains('locked'), etat: (b.querySelector('.stt') || {}).textContent, ouvrir: (b.querySelector('.ouvrir') || {}).textContent } : { id: s.id, nom: s.name }; }), dernier: d && { scelle: d.scelle, tl: d.tl } }; });
    await cap('0-chaine-ouverte');
    const fermes = s0.maillons.filter(m => !m.ouvert || !/Maillon à ouvrir/.test(m.etat || '') || !/Ouvrir/.test(m.ouvrir || ''));
    if (s0.maillons.length !== 5 || fermes.length) ko('ÉCART après le prologue, un maillon n’est pas ouvert : ' + JSON.stringify(fermes.length ? fermes : s0.maillons)); else ok(`après le prologue, les ${s0.maillons.length} maillons sont ouverts (« Maillon à ouvrir », « Ouvrir ▸ ») — « ${s0.entete} »`);
    if (!s0.dernier || !s0.dernier.scelle) ko('ÉCART le dernier maillon n’est pas scellé avant les cinq sagas : ' + JSON.stringify(s0.dernier)); else ok(`le dernier maillon reste scellé (« ${s0.dernier.tl} »)`);
    // chacun s'ouvre par son bouton, du V au I : la saga commence, et celle qu'on quitte pour une autre est rangée à sa place
    const ouverts = [], titresVus = [];
    for (const m of s0.maillons.slice().reverse()) {
      const r = await ev(async id => { const I = window.ISNAD, W = I.world, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); await I.ui.showChain();
        const b = T.maillon(I.sagas[id].name); if (!b || b.disabled) return { id, ferme: true }; T.titres = []; I.debug.auto = true; T.toucher(b);
        const v = await T.attendre(() => W.saga && W.saga.id === id && W.ch === I.sagas[id].chapters[0] && T.calme(), 90000); I.debug.auto = false; await T.attendre(() => T.calme(), 20000);
        return { id, v, ch: W.ch && W.ch.id, nom: I.sagas[id].name, titres: T.titres.slice(), ranges: Object.keys(I.save.data.cps || {}).sort() }; }, m.id);
      if (!r.v) ko(`BLOQUÉ le maillon « ${m.nom} » ne s’ouvre pas par son bouton : ${JSON.stringify(r)}`); else ouverts.push(`${m.nom} (${r.ch})`);
      // 2.49 (le décideur, 28 novembre : « les pages des saga s'affichent 2 fois lors du lancement ») : une carte par nom
      if (r.v) { const fois = r.titres.filter(t => t === r.nom).length, doubles = r.titres.filter((t, i) => r.titres.indexOf(t) !== i);
        if (fois !== 1 || doubles.length) ko(`ÉCART au lancement de « ${m.nom} », une carte de titre en double : ${JSON.stringify(r.titres)}`); else titresVus.push(r.titres.join(' / ')); }
    }
    if (titresVus.length === 5) ok('au lancement, chaque saga montre son nom une seule fois (' + titresVus.join(' ; ') + ')');
    const s0b = await ev(async () => { const I = window.ISNAD, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); I.save.data.cp && window.ISNAD.world.ranger(); await I.ui.showChain(); const d = T.dernier(); return { ranges: Object.keys(I.save.data.cps || {}).sort(), enRoute: T.chaine().maillons.filter(m => /en route/.test(m.etat || '')).length, dernier: d && d.scelle }; });
    await cap('0b-chaine-cinq-en-route');
    if (ouverts.length !== 5 || s0b.ranges.length !== 5 || s0b.enRoute !== 5 || !s0b.dernier) ko('ÉCART les cinq maillons ouverts l’un après l’autre, du V au I : ' + JSON.stringify({ ouverts, s0b }));
    else ok(`les cinq s’ouvrent par leur bouton, du V au I (${ouverts.join(', ')}) ; chacun est rangé à sa place, « en route » sur la Chaîne ; le dernier maillon reste scellé`);

  // ---------- 0 bis. 2.49 : un récit quitté avant son premier objectif reprend à sa place, sans rejouer son ouverture ----------
    { const id = s0.maillons[4].id, nom = s0.maillons[4].nom;
      const reprendre0 = () => ev(async id => { const I = window.ISNAD, W = I.world, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); await I.ui.showChain();
        const sv = I.save.data, c = sv.cp && sv.cp.saga === id ? sv.cp : (sv.cps || {})[id]; if (!c) return { absent: true };
        const avant = { obj: c.obj, map: c.map, pos: c.pos.slice() }; T.titres = []; const n0 = T.dits.length; T.toucher(T.maillon(I.sagas[id].name));
        const v = await T.attendre(() => W.saga && W.saga.id === id && T.calme(), 30000); await new Promise(r => setTimeout(r, 400));
        return { v, avant, apres: { obj: W.objIndex, map: W.map && W.map.id, pos: [Math.round(W.player.x), Math.round(W.player.y)] }, titres: T.titres.slice(), dits: T.dits.slice(n0) }; }, id);
      const pareil = r => r.v && r.avant.obj === r.apres.obj && r.avant.map === r.apres.map && Math.hypot(r.avant.pos[0] - r.apres.pos[0], r.avant.pos[1] - r.apres.pos[1]) <= 2 && !r.titres.length;
      // (a) rangé à l'objectif 0, tel qu'il s'est ouvert, puis repris par son bouton
      const a = await reprendre0();
      if (a.absent || a.avant.obj !== 0) ko(`ÉCART « ${nom} » n’est pas rangé à l’objectif 0 avant sa reprise : ` + JSON.stringify(a));
      else if (!pareil(a)) ko(`ÉCART « ${nom} », rangé à l’objectif 0, ne reprend pas à sa place ou rejoue son ouverture : ` + JSON.stringify(a));
      else ok(`« ${nom} », rangé à l’objectif 0, reprend par son bouton à sa place (${a.apres.map}, ${a.apres.pos.join(' × ')}), sans carte de titre ni introduction`);
      // (b) Idris fait quelques pas, la halte s'ouvre et se referme (la partie se garde), on revient à la Chaîne, puis on reprend
      let bouge = null;
      for (const k of ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']) { const p0 = await ev(() => [window.ISNAD.world.player.x, window.ISNAD.world.player.y]);
        await page.keyboard.down(k); await page.waitForTimeout(500); await page.keyboard.up(k); await page.waitForTimeout(250);
        const p1 = await ev(() => [window.ISNAD.world.player.x, window.ISNAD.world.player.y]); if (Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) > 6) { bouge = k; break; } }
      await ev(() => { window.__t.halte('—'); }); await page.waitForTimeout(400);
      const b = await reprendre0();
      if (!bouge) ko(`BLOQUÉ Idris ne bouge pas dans « ${nom} », à l’objectif 0`);
      else if (b.absent || b.avant.obj !== 0) ko(`ÉCART « ${nom} » n’est plus à l’objectif 0 après quelques pas : ` + JSON.stringify(b));
      else if (!pareil(b)) ko(`ÉCART « ${nom} », quitté à l’objectif 0 après quelques pas, ne reprend pas là où Idris s’est arrêté : ` + JSON.stringify(b));
      else ok(`après quelques pas (${bouge}) et la halte refermée, « ${nom} » reprend là où Idris s’est arrêté (${b.apres.pos.join(' × ')}), toujours sans ouverture`); } }

  // ---------- 1. une partie neuve, le prologue derrière soi ; deux sagas entamées, quittées par la halte ----------
  await ev(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); I.ui.showChain(); });
  await page.waitForTimeout(400);
  const c0 = await ev(() => window.__t.chaine());
  if (c0.pied.includes('La Citadelle')) ko('ÉCART « La Citadelle » est offerte avant toute veillée'); else ok('avant toute veillée, la Chaîne n’offre pas la Citadelle (' + c0.pied.length + ' boutons au pied)');

  const ouvrir = async (nom, n) => { await ev(nom => { window.ISNAD.debug.auto = true; window.__t.toucher(window.__t.maillon(nom)); }, nom); return ev(n => window.__t.jusqua(n), n); };
  // faire avancer ce qui se dit (dialogues, cartons), une ligne écrite tout entière à la fois, jusqu'à la main ou un choix
  const avancer = async () => { for (let i = 0; i < 120; i++) {
      // (2.49 : un choix ouvert se voit avant le calme — et s'il est ouvert alors que le joueur a la main, c'est un défaut du jeu)
      const e = await ev(() => { const T = window.__t, q = s => document.querySelector(s); return T.visible('#choice') ? (T.calme() ? 'choix-libre' : 'choix') : T.calme() ? 'calme' : T.visible('#dialog') ? (getComputedStyle(q('#dialog .next')).visibility === 'visible' ? 'lire' : 'ecrit') : (T.visible('#card') && q('#card').classList.contains('on')) ? 'lire' : ''; });
      if (e === 'choix-libre') { ko('ÉCART un choix est ouvert alors que le joueur a la main : ' + JSON.stringify(await ev(() => [...document.querySelectorAll('#choice .opt')].map(b => b.textContent.trim())))); return 'choix'; }
      // (2.49 : on ne presse que sur un texte encore à lire — à la vitesse d'essai, une carte se ferme seule ; et depuis que les
      // narrations d'arrivée ne retiennent plus, un « Entrée » de trop tombe dans le monde : à côté de Maître Yûnus, il lui parle)
      if (e === 'calme' || e === 'choix') return e;
      if (e === 'lire') { await page.waitForTimeout(200); const encore = await ev(() => { const T = window.__t, q = s => document.querySelector(s); return !T.calme() && !T.visible('#choice') && ((T.visible('#dialog') && getComputedStyle(q('#dialog .next')).visibility === 'visible') || (T.visible('#card') && q('#card').classList.contains('on'))); }); if (encore) await page.keyboard.press('Enter'); }
      await page.waitForTimeout(170); }
    return 'bloque'; };
  const revenir = async () => {
    const n0 = await ev(() => window.__t.journal.length);
    const r = await ev(() => window.__t.halte('Revenir en 2084'));
    if (r !== true) { ko('INACCESSIBLE la halte n’offre pas « Revenir en 2084 » : ' + JSON.stringify(r)); return null; }
    // ce qui s'est passé en 2084 se joue (tout seul) ; puis les quartiers de la Cité, à côté de Maître Yûnus (2.23, D212)
    const la = await ev(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers', 240000));
    const ici = await ev(n0 => window.__t.journal.slice(n0).find(id => id !== 'c_quartiers') || '', n0);
    if (!la) { const e = await ev(() => window.__t.etat()); ko(`BLOQUÉ le retour « ${ici} » ne mène pas aux quartiers de la Cité — objectif ${e.obj}, carte ${e.carte}`); await ev(() => { window.ISNAD.debug.auto = false; }); return ici; }
    await avancer(); await ev(() => { window.ISNAD.world.foes.forEach(f => { if (f.rue) f.done = true; }); }); // (ce qui rôde dans les rues n'est pas l'objet de cet outil : cite.js)
    const pres = await ev(() => { const W = window.ISNAD.world, y = W.npcs.find(n => n.id === 'yunus_c'); return y ? Math.round(Math.hypot(y.x - W.player.x, y.y - W.player.y)) : -1; });
    if (!(pres > 0 && pres < 40)) ko(`ÉCART au retour, Idris n’est pas à côté de Maître Yûnus (${pres} points)`);
    // la Chaîne, par Maître Yûnus : lui parler, puis « La Chaîne, au fond de la mosquée »
    await ev(() => { const W = window.ISNAD.world, y = W.npcs.find(n => n.id === 'yunus_c'); W.player.x = y.x + 18; W.player.y = y.y; W.player.dir = 1; W.stop(); W.resetTrail(); });
    await page.waitForTimeout(250); await page.keyboard.press('Enter');
    // (2.49 : on attend que Maître Yûnus réponde — sa réplique, ou le choix — avant de lire ; un A sans réponse est un défaut)
    const repond = await ev(() => window.__t.attendre(() => window.__t.visible('#dialog') || window.__t.visible('#choice'), 4000));
    if (!repond) { const e = await ev(() => Object.assign(window.__t.etat(), { yunus: (() => { const W = window.ISNAD.world, y = W.npcs.find(n => n.id === 'yunus_c'); return y ? [Math.round(y.x), Math.round(y.y), !!y.hidden] : null; })(), menu: window.ISNAD.cite && window.ISNAD.cite.journal.slice(-3) })); ko('INACCESSIBLE Maître Yûnus ne répond pas au premier A : ' + JSON.stringify(e)); await page.keyboard.press('Enter'); }
    const c = await avancer(), opts = await ev(() => [...document.querySelectorAll('#choice .opt')].map(b => b.textContent.trim()));
    const i = opts.findIndex(o => /^La Chaîne/.test(o));
    if (c !== 'choix' || i < 0) { ko('INACCESSIBLE Maître Yûnus n’offre pas « La Chaîne » : ' + JSON.stringify({ c, opts })); return ici; }
    await page.waitForTimeout(400); for (let k = 0; k < i; k++) { await page.keyboard.press('ArrowDown'); await page.waitForTimeout(120); } await page.keyboard.press('Enter');
    const fini = await ev(() => window.__t.attendre(() => window.__t.visible('#chain'), 30000));
    if (!fini) { const e = await ev(() => window.__t.etat()); ko(`BLOQUÉ le retour « ${ici} » ne revient pas à la Chaîne par Maître Yûnus — objectif ${e.obj}, carte ${e.carte}`); }
    await ev(() => { window.ISNAD.debug.auto = false; }); await page.waitForTimeout(350);
    return ici || '';
  };

  if (!(await ouvrir('Abû Bakr', 2))) ko('BLOQUÉ la saga d’Abû Bakr n’atteint pas son deuxième objectif');
  const A = await ev(() => window.__t.etat());
  await cap('1-abubakr-en-route');
  const r1 = await revenir();
  const s1 = await ev(() => { const sv = window.ISNAD.save.data; return { cp: sv.cp, cps: Object.keys(sv.cps || {}), a: sv.cps && sv.cps.abubakr, retours: sv.retours, rebonds: Object.keys(sv.rebonds || {}) }; });
  if (r1 !== 'x_descendu') ko('ÉCART au premier retour en 2084, rien ne s’est passé (attendu : « Ce qui est entré ») — joué : ' + JSON.stringify(r1));
  else if (!s1.rebonds.includes('x_descendu')) ko('ÉCART le premier retour s’est joué sans être noté dans la partie');
  else ok('premier retour en 2084 : « Ce qui est entré » se joue jusqu’au bout (un combat), puis les quartiers, à côté de Maître Yûnus, et la Chaîne par lui');
  if (s1.cp || !s1.a || s1.a.obj !== A.obj || s1.a.map !== A.carte) ko('ÉCART le récit quitté n’est pas rangé tel qu’on l’a laissé : ' + JSON.stringify({ cp: !!s1.cp, range: s1.a && [s1.a.obj, s1.a.map], attendu: [A.obj, A.carte] }));
  else ok(`Abû Bakr est rangé à l’objectif ${A.obj}, sur « ${A.carte} » ; la partie ne garde plus de point courant`);
  const c1 = await ev(() => window.__t.chaine()); await cap('2-chaine-un-recit-en-route');
  const mA = c1.maillons.find(m => (m.nom || '').indexOf('Abû Bakr') === 0);
  if (!/^▶ Reprendre : Abû Bakr/.test(c1.bouton) || !mA || !/en route/.test(mA.etat) || !/Reprendre/.test(mA.ouvrir)) ko('INVISIBLE la Chaîne ne dit pas qu’un récit est en route : ' + JSON.stringify({ bouton: c1.bouton, maillon: mA }));
  else ok(`la Chaîne le dit : « ${c1.bouton} », maillon « ${mA.etat} »`);
  // 2.48 (D240) : un seul récit en cours — « Continuer » le reprend comme toujours, sans liste (rangé, rien de courant : la Chaîne)
  { const t1 = await ev(async () => { const T = window.__t; T.versTitre(); const b = document.querySelector('#title .vmenu > button'), lab = b ? b.textContent : ''; T.toucher(b); await new Promise(r => setTimeout(r, 700)); return { lab, liste: document.querySelectorAll('#title .vmenu button[data-reprise]').length, chaine: T.visible('#chain') }; });
    if (!/^Continuer/.test(t1.lab) || t1.liste || !t1.chaine) ko('ÉCART avec un seul récit en cours, « Continuer » ne le reprend pas comme toujours : ' + JSON.stringify(t1)); else ok('un seul récit en cours : « Continuer » le reprend comme toujours, sans liste (ici la Chaîne, le récit y attend « en route »)'); }

  // 2.48 (D240, qui lève le sceau de la 2.22) : pendant qu'Abû Bakr est en route, 'Umar est ouvert, et son bouton l'ouvre
  { const lu = await ev(() => { const b = window.__t.maillon("'Umar"); return b ? { ouvert: !b.disabled && !b.classList.contains('locked'), etat: (b.querySelector('.stt') || {}).textContent || '' } : null; });
    if (!lu || !lu.ouvert || !/Maillon à ouvrir/.test(lu.etat)) ko('ÉCART ’Umar n’est pas ouvert pendant qu’Abû Bakr est en route : ' + JSON.stringify(lu)); else ok(`pendant qu’Abû Bakr est en route, ’Umar est ouvert (« ${lu.etat} »)`); }
  const ouvU = await ouvrir("'Umar", 1);
  if (!ouvU) ko('BLOQUÉ la saga de ’Umar n’atteint pas son premier objectif');
  const B = await ev(() => window.__t.etat());
  const mid = await ev(() => { const sv = window.ISNAD.save.data; return { cp: sv.cp && sv.cp.saga, cps: Object.keys(sv.cps || {}) }; });
  if (mid.cp !== 'umar' || !mid.cps.includes('abubakr')) ko('ÉCART en jouant ’Umar, le récit d’Abû Bakr n’est plus rangé : ' + JSON.stringify(mid)); else ok('en jouant ’Umar, le point de reprise d’Abû Bakr reste rangé à part');
  const r2 = await revenir();
  if (r2) ko('ÉCART un retour s’est joué au deuxième retour (« ' + r2 + ' ») : le suivant n’est attendu qu’au troisième'); else ok('deuxième retour : rien ne se passe à la vieille mosquée ; les quartiers, puis la Chaîne par Maître Yûnus');
  const c2 = await ev(() => window.__t.chaine()); await cap('3-chaine-deux-recits-en-route');
  const enRoute = c2.maillons.filter(m => /en route/.test(m.etat || '')).map(m => m.nom);
  if (enRoute.length !== 2 || !/’Umar|'Umar/.test(c2.bouton)) ko('ÉCART deux récits devraient être en route, le dernier quitté en tête : ' + JSON.stringify({ enRoute, bouton: c2.bouton })); else ok(`deux récits en route (${enRoute.join(', ')}) ; le dernier quitté passe devant : « ${c2.bouton} »`);
  { const lu = await ev(() => { const b = window.__t.maillon("'Umar"); return b ? { scelle: b.disabled || b.classList.contains('locked') } : null; });
    if (!lu || lu.scelle) ko('ÉCART un récit déjà entamé (une partie d’avant) est scellé : ' + JSON.stringify(lu)); else ok('un récit déjà entamé reste ouvert, même si celui d’avant n’est pas achevé (une partie d’avant)'); }

  // ---------- 2. la partie voyage avec ses récits rangés ----------
  const voyage = await ev(() => { const I = window.ISNAD, avant = JSON.stringify(I.save.data.cps), t = I.save.exporter(); I.save.reset(); const r = I.save.lireTexte(t); if (!r.ok) return { ok: false, erreur: r.erreur };
    I.save.adopter(r.partie); I.save.auto('essai'); return { ok: true, identique: JSON.stringify(I.save.data.cps) === avant, n: Object.keys(I.save.data.cps || {}).length, retours: I.save.data.retours, rebonds: Object.keys(I.save.data.rebonds || {}) }; });
  if (!voyage.ok) ko('REFUS la partie exportée avec des récits rangés n’est pas relue : ' + voyage.erreur);
  else if (!voyage.identique || voyage.n !== 2 || voyage.retours !== 2 || !voyage.rebonds.includes('x_descendu')) ko('ÉCART la partie réimportée n’a plus ses récits rangés : ' + JSON.stringify(voyage));
  else ok('la partie exportée, effacée puis réimportée garde ses deux récits rangés, ses retours et ce qui s’y est passé');
  // une partie abîmée : un récit rangé qui n'en est pas un
  const abime = await ev(() => { const I = window.ISNAD, o = JSON.parse(I.save.exporter()); o.partie.cps.abubakr = { saga: 3 }; return I.save.lireTexte(JSON.stringify(o)); });
  if (abime.ok) ko('ÉCART une partie dont un récit rangé est abîmé est acceptée'); else ok('une partie dont un récit rangé est abîmé est refusée (« ' + abime.erreur + ' »)');
  // « Continuer », depuis l'écran-titre, quand on est en 2084 : la Chaîne, pas un chapitre
  await ev(() => { const I = window.ISNAD; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); I.save.readAuto(); I.ui.resume(); }); await page.waitForTimeout(500);
  if (!(await ev(() => window.__t.visible('#chain')))) ko('ÉCART « Continuer », en 2084, ne rouvre pas la Chaîne'); else ok('« Continuer », quand on est en 2084, rouvre la Chaîne');

  // ---------- 2 bis. 2.48 (D240) : l'écran-titre — deux récits en cours, « Continuer » les montre ; chacun reprend à sa place ----------
  { const memeQue = (e, v) => e.saga === v.saga && e.ci === v.ci && e.obj === v.obj && e.carte === v.carte && Math.hypot(e.x - v.x, e.y - v.y) < 3 && e.groupe === v.groupe && e.drapeaux === v.drapeaux;
    await ev(() => window.__t.versTitre()); await page.waitForTimeout(400);
    await page.keyboard.press('Enter'); await page.waitForTimeout(500);   // au clavier : « Continuer » a la sélection d'emblée
    const L = await ev(() => window.__t.titre()); await cap('2b-titre-recits-en-cours');
    const cles = L.map(x => x.k).filter(Boolean);
    if (cles.join() !== 'umar,abubakr,chaine' || !/^▶ Reprendre : ’Umar|^▶ Reprendre : 'Umar/.test(L[0].t) || !/Chapitre 1 \/ \d/.test(L[0].small) || !/il y a|à l’instant|le /.test(L[0].small) || !/◂ Retour/.test(L[L.length - 1].t)) ko('ÉCART « Continuer » ne montre pas les deux récits en cours, le plus récent d’abord, puis la Chaîne et « ◂ Retour » : ' + JSON.stringify(L));
    else ok(`« Continuer » montre les récits en cours, le plus récent d’abord : ${L.map(x => `« ${x.t}${x.small ? ' — ' + x.small : ''} »`).join(', ')}`);
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);   // B (ou Échap) revient à l'écran-titre
    const L2 = await ev(() => window.__t.titre());
    if (!/^Continuer/.test(L2[0].t) || L2.some(x => x.k) || !L2.some(x => /^Nouvelle partie/.test(x.t))) ko('ÉCART B (Échap) ne revient pas à l’écran-titre : ' + JSON.stringify(L2)); else ok('B (Échap) revient à l’écran-titre, « Continuer » en tête');
    // Abû Bakr, au clavier : Entrée (la liste), la flèche (le second), Entrée
    await page.keyboard.press('Enter'); await page.waitForTimeout(400); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(200);
    const sel = await ev(() => (window.__t.titre().find(x => x.sel) || {}).k); await page.keyboard.press('Enter');
    await ev(() => window.__t.attendre(() => window.__t.calme(), 30000)); await page.waitForTimeout(400);
    const eA = await ev(() => window.__t.etat());
    if (sel !== 'abubakr' || !memeQue(eA, A)) ko(`ÉCART Abû Bakr, choisi dans la liste au clavier, ne reprend pas là où on l’a laissé :\n   laissé  ${JSON.stringify(A)}\n   repris  ${JSON.stringify(eA)} (sélection : ${sel})`);
    else ok(`Abû Bakr, choisi dans la liste (clavier), reprend là où on l’a laissé : objectif ${eA.obj}, « ${eA.carte} », à sa place (${eA.x}, ${eA.y}), ses drapeaux intacts`);
    await cap('2c-abubakr-repris-depuis-le-titre');
    // 'Umar, au doigt : la partie gardée n'a pas bougé — la liste est la même, et 'Umar reprend à sa place
    const eB = await ev(async () => { const T = window.__t; T.versTitre(); await new Promise(r => setTimeout(r, 300)); T.toucher(document.querySelector('#title .vmenu > button')); await new Promise(r => setTimeout(r, 400));
      const n = T.titre().map(x => x.k).filter(Boolean).join(); T.toucher(document.querySelector('#title .vmenu button[data-reprise="umar"]')); await T.attendre(() => T.calme(), 30000); await new Promise(r => setTimeout(r, 300)); return Object.assign({ liste: n }, T.etat()); });
    if (eB.liste !== 'umar,abubakr,chaine' || !memeQue(eB, B)) ko(`ÉCART ’Umar, touché dans la liste, ne reprend pas là où on l’a laissé :\n   laissé  ${JSON.stringify(B)}\n   repris  ${JSON.stringify(eB)}`);
    else ok(`’Umar, touché dans la liste, reprend là où on l’a laissé : objectif ${eB.obj}, « ${eB.carte} », à sa place (${eB.x}, ${eB.y})`);
    // « La Chaîne » de la liste : la Chaîne, les deux récits rangés
    const eC = await ev(async () => { const T = window.__t, I = window.ISNAD; T.versTitre(); await new Promise(r => setTimeout(r, 300)); T.toucher(document.querySelector('#title .vmenu > button')); await new Promise(r => setTimeout(r, 400));
      T.toucher(document.querySelector('#title .vmenu button[data-reprise="chaine"]')); await new Promise(r => setTimeout(r, 600)); return { chaine: T.visible('#chain'), cps: Object.keys(I.save.data.cps || {}).sort().join(), cp: !!I.save.data.cp, bouton: T.chaine().bouton }; });
    if (!eC.chaine || eC.cps !== 'abubakr,umar' || eC.cp) ko('ÉCART « La Chaîne », dans la liste, n’y mène pas avec les deux récits rangés : ' + JSON.stringify(eC)); else ok(`« La Chaîne », dans la liste, y mène : les deux récits rangés (« ${eC.bouton} »)`); }

  // ---------- 3. chaque récit se reprend là où on l'a laissé ----------
  const reprendre = async (nom, voulu, parBouton) => {
    await ev(([nom, parBouton]) => { const T = window.__t; if (parBouton) T.toucher('#chain header .cta'); else T.toucher(T.maillon(nom)); }, [nom, parBouton]);
    await ev(() => window.__t.attendre(() => window.__t.calme(), 30000)); await page.waitForTimeout(300);
    const e = await ev(() => window.__t.etat());
    const meme = e.saga === voulu.saga && e.ci === voulu.ci && e.obj === voulu.obj && e.carte === voulu.carte && Math.hypot(e.x - voulu.x, e.y - voulu.y) < 3 && e.groupe === voulu.groupe && e.drapeaux === voulu.drapeaux;
    if (!meme) ko(`ÉCART ${nom} ne reprend pas là où on l’a laissé :\n   laissé  ${JSON.stringify(voulu)}\n   repris  ${JSON.stringify(e)}`);
    else ok(`${nom} reprend là où on l’a laissé : objectif ${e.obj}, « ${e.carte} », à sa place (${e.x}, ${e.y}), ses drapeaux intacts`);
    return meme;
  };
  await reprendre("'Umar", B, true); await cap('4-umar-repris');
  const r3 = await revenir();
  if (r3 !== 'x_enfant') ko('ÉCART au troisième retour, attendu « Tu pars où ? » — joué : ' + JSON.stringify(r3)); else ok('troisième retour : « Tu pars où ? » se joue jusqu’au bout (une question, un pilier), puis la Chaîne');
  await reprendre('Abû Bakr', A, false); await cap('5-abubakr-repris');
  const r4 = await revenir(); if (r4) ko('ÉCART un retour s’est joué au quatrième retour (« ' + r4 + ' »)');
  await reprendre('Abû Bakr', A, false);
  const r5 = await revenir();
  if (r5 !== 'x_avis') ko('ÉCART au cinquième retour, attendu « L’avis » — joué : ' + JSON.stringify(r5)); else ok('cinquième retour : « L’avis » se joue jusqu’au bout (un pourparler), puis la Chaîne');
  await reprendre('Abû Bakr', A, false);
  const r6 = await revenir(); if (r6) ko('ÉCART un retour déjà joué se rejoue (« ' + r6 + ' »)'); else ok('les trois retours ne se rejouent pas : au sixième, la Chaîne s’ouvre');
  const s6 = await ev(() => { const sv = window.ISNAD.save.data; return { retours: sv.retours, rebonds: Object.keys(sv.rebonds || {}).sort(), cps: Object.keys(sv.cps || {}).sort(), codex: ['x_veiller', 'x_question', 'x_avis'].filter(k => sv.codex.includes('idris/' + k) || sv.codex.includes(k)) }; });
  if (s6.rebonds.join() !== 'x_avis,x_descendu,x_enfant' || s6.cps.join() !== 'abubakr,umar') ko('ÉCART état de la partie après six retours : ' + JSON.stringify(s6)); else ok(`après six retours : trois événements notés, deux récits toujours rangés, ${s6.codex.length} feuillets au Recueil`);

  // ---------- 4. la Citadelle, où Idris est né : ouverte dès la première veillée entendue ----------
  await ev(() => { const I = window.ISNAD; I.save.data.veillees.abubakr = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); I.ui.showChain(); }); await page.waitForTimeout(300);
  for (let k = 1; k <= 2; k++) {
    const la = await ev(() => { const b = window.__t.pied('La Citadelle'); if (!b) return false; window.ISNAD.debug.auto = true; b.click(); return true; });
    if (!la) { ko('INACCESSIBLE après une veillée, la Chaîne n’offre pas « La Citadelle »'); break; }
    await ev(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_citadelle' && window.ISNAD.scene === window.ISNAD.world, 20000)); await page.waitForTimeout(250);
    if (k === 1) await cap('6-citadelle');
    const e = await ev(() => ({ ch: window.ISNAD.world.ch && window.ISNAD.world.ch.id, carte: window.ISNAD.world.map && window.ISNAD.world.map.id, drapeaux: Object.keys(window.ISNAD.script.flags).filter(x => x.indexOf('_2084_') === 0).sort() }));
    const fini = await ev(() => window.__t.jusquaLaChaine());
    if (e.ch !== 'c_citadelle' || e.carte !== 'citadelle' || !fini) { ko(`BLOQUÉ la visite de la Citadelle (${k}) : ${JSON.stringify(e)} · revenue à la Chaîne : ${fini}`); break; }
    if (k === 1) ok(`la Citadelle se visite depuis la Chaîne (état de 2084 lu par le récit : ${e.drapeaux.join(', ')})`); else ok('elle se visite de nouveau : la visite ne se ferme pas');
    await page.waitForTimeout(300);
  }
  const s7 = await ev(() => { const sv = window.ISNAD.save.data, W = window.ISNAD.world; return { cps: Object.keys(sv.cps || {}).sort(), cp: sv.cp, citadelle: sv.codex.some(k => /citadelle_2084/.test(k)), niveaux: Object.keys(sv.heroes).filter(k => /^idris:/.test(k)).map(k => k + ' ' + sv.heroes[k].lvl) }; });
  if (s7.cps.join() !== 'abubakr,umar' || s7.cp) ko('ÉCART après les visites, les récits rangés ont bougé : ' + JSON.stringify(s7)); else ok('après les visites, les deux récits sont toujours rangés' + (s7.citadelle ? ' ; le feuillet de la Citadelle est au Recueil' : ''));

  // ---------- 5. un récit repris se termine comme les autres ----------
  await ev(() => { window.ISNAD.debug.auto = true; window.__t.toucher(window.__t.maillon('Abû Bakr')); });
  const suite = await ev(() => window.__t.attendre(() => window.ISNAD.world.saga && window.ISNAD.world.saga.id === 'abubakr' && window.ISNAD.world.ci === 1 && window.__t.calme(), 240000).then(v => { window.ISNAD.debug.auto = false; return v; }));
  const s8 = await ev(() => { const sv = window.ISNAD.save.data; return { ch: sv.sagas.abubakr.ch, cps: Object.keys(sv.cps || {}).sort(), cp: sv.cp && [sv.cp.saga, sv.cp.ci] }; });
  if (!suite || s8.ch !== 1 || s8.cps.join() !== 'umar' || !s8.cp || s8.cp[0] !== 'abubakr') ko('ÉCART le chapitre repris ne mène pas au suivant : ' + JSON.stringify({ suite, s8 })); else ok('le chapitre repris se termine et ouvre le suivant ; ’Umar attend toujours, rangé');
  // une partie d'avant (un seul point de reprise, resté courant devant la Chaîne) : ouvrir un autre récit ne l'écrase plus
  const ancien = await ev(async () => { const I = window.ISNAD, W = I.world, T = window.__t, sv = I.save.data; W.checkpoint(); const garde = JSON.stringify([sv.cp.saga, sv.cp.ci, sv.cp.obj]); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); delete sv.cps.umar; sv.sagas.umar = { ch: 0, done: false, flags: {} };
    await I.ui.showChain(); I.debug.auto = true; T.toucher(T.maillon("'Umar")); const okk = await T.jusqua(1); const a = sv.cps && sv.cps.abubakr; return { okk, garde, range: a ? JSON.stringify([a.saga, a.ci, a.obj]) : null, cp: sv.cp && sv.cp.saga }; });
  if (!ancien.okk || ancien.range !== ancien.garde || ancien.cp !== 'umar') ko('ÉCART un point de reprise resté courant est écrasé par un autre récit : ' + JSON.stringify(ancien)); else ok('une partie d’avant (un point de reprise resté courant) : ouvrir un autre récit le range au lieu de l’écraser');

  // ---------- 6. une veillée quittée en chemin attend elle aussi : la Chaîne la reprend ----------
  { const v0 = await ev(async () => { const I = window.ISNAD, W = I.world, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); W.roster = {}; W.saga = null; I.debug.auto = true; W.startChapter('caid', 0); const okk = await T.jusqua(1); return Object.assign({ okk }, T.etat()); });
    const rv = await revenir();
    const cv = await ev(() => ({ bouton: window.__t.chaine().bouton, cps: Object.keys(window.ISNAD.save.data.cps || {}).sort() }));
    if (!v0.okk || rv === null || !cv.cps.includes('caid:0') || !/^▶ Reprendre : la veillée/.test(cv.bouton)) ko('ÉCART une veillée quittée en chemin n’est pas rangée ou pas offerte : ' + JSON.stringify({ v0: [v0.okk, v0.saga, v0.obj], rv, cv }));
    else { await ev(() => window.__t.toucher('#chain header .cta')); await ev(() => window.__t.attendre(() => window.__t.calme(), 30000)); await page.waitForTimeout(300);
      const v1 = await ev(() => window.__t.etat());
      if (v1.saga !== 'caid' || v1.ci !== 0 || v1.obj !== v0.obj || v1.carte !== v0.carte || Math.hypot(v1.x - v0.x, v1.y - v0.y) > 3) ko(`ÉCART la veillée ne reprend pas là où on l’a laissée :\n   laissée ${JSON.stringify(v0)}\n   reprise ${JSON.stringify(v1)}`);
      else ok(`une veillée quittée en chemin attend elle aussi (« ${cv.bouton} ») et reprend à son objectif ${v1.obj}, à sa place`); } }

  // ---------- 7. 2.48 (D240) : la découverte de l'Agrégor, dans l'ordre où l'on joue les rencontres ----------
  // La rencontre de 'Uthmân jouée la première dit l'étape I, sans nommer l'Agrégor ; puis 'Alî l'étape II ; Abû Bakr, troisième,
  // l'étape III et la fiche ; 'Umar l'étape IV ; et la cinquième, celle de Khâlid, laissée en chemin, passe avant le dernier
  // maillon quand on le touche. Les textes des sagas et du Recueil qui le nomment suivent le nom reçu.
  { const OUV = { 1: 'Qu’as-tu vu, ce soir, sous le grand écran ?', 2: 'Toute la rue regarde la même chose. Qui commande, alors ?', 3: 'Ce qui rassemble les regards a-t-il un nom ?', 4: 'L’Agrégor compte tout ce qu’on regarde. Que craint-il, alors ?', 5: 'L’Agrégor additionne tout, et ne va jamais voir.' };
    const ACC = { uthman: 'Le Compteur amassait des regards, sans jamais en poser un sur quelqu’un.', ali: 'Le Cartographe additionnait des relevés sans aller voir.', abubakr: 'Tu as parlé ce soir à un homme qui défilait pour oublier.', umar: 'Cet homme validait ce que l’écran avait déjà décidé.', khalid: 'Des fenêtres qui applaudissent, et personne derrière.' };
    await ev(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.epilogue = false; I.debug.auto = false; });
    // ce que disent la saga de 'Uthmân (la fin de son deuxième chapitre) et le Recueil (deux fiches), selon le nom reçu ou non
    const nomDit = () => ev(async () => { const I = window.ISNAD, W = I.world, S = I.script, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); W.roster = {}; W.saga = null;
      I.debug.auto = true; W.startChapter('uthman', 1); await T.attendre(() => W.ch && W.ch.id === 'ut2' && T.calme(), 60000); I.debug.auto = false; const drapeau = !!S.flags._2084_agregor;
      const n0 = T.dits.length; I.debug.auto = true; await S.run([W.ch.outro.find(o => o[0] === 'if')]); I.debug.auto = false;
      return { drapeau, fin: T.dits.slice(n0).join(' '), rumeur: I.ui.codexEntry('uthman/rumeur_n').text, slogan: I.ui.codexEntry('ali/slogan').text }; });
    const avant = await nomDit();
    if (avant.drapeau || /Agrégor/.test(avant.fin + avant.rumeur + avant.slogan) || !/devant ce qui règne là-haut/.test(avant.fin) || !/les écrans lui ont donné/.test(avant.rumeur) || !/Les écrans de la Cité-Miroir/.test(avant.slogan)) ko('ÉCART avant le nom reçu, la saga ou le Recueil nomme l’Agrégor : ' + JSON.stringify(avant));
    else ok('avant le nom reçu, la fin du deuxième chapitre de ’Uthmân dit « ce qui règne là-haut », et le Recueil « les écrans » (la Rumeur, le Slogan)');
    const rencontre = async (sid, k, parDernier) => {
      const r = await ev(async ([sid, parDernier]) => { const I = window.ISNAD, W = I.world, S = I.script, T = window.__t, fr = I.sagas.idris, ri = fr.chapters.findIndex(c => c.after === sid), sv = I.save.data;
        sv.sagas[sid] = { ch: I.sagas[sid].chapters.length, done: true, flags: {} }; if (!sv.lights.includes(I.sagas[sid].light)) sv.lights.push(I.sagas[sid].light);
        document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); W.roster = {}; W.saga = null; const n0 = T.dits.length;
        if (parDernier) { await I.ui.showChain(); const d = T.dernier(); if (!d || d.scelle) return { ferme: true }; I.debug.auto = true; T.toucher(d.el); } else { I.debug.auto = true; W.startChapter('idris', ri); }
        const la = await T.attendre(() => W.ch && W.ch.after === sid && I.scene === W, 30000); const drapeaux = Object.keys(S.flags).filter(f => /^_2084_(etape_|agregor)/.test(f)).sort();
        const fini = la && await T.jusquaLaChaine(); const dits = T.dits.slice(n0), d = T.dernier();
        return { la, ch: W.ch && W.ch.id, fini, drapeaux, dits, nomme: dits.filter(t => /Agrégor/.test(t)), fiche: sv.codex.includes('idris/agregor'), rencontres: Object.keys(sv.rencontres || {}).sort(), dernier: d && d.nom }; }, [sid, !!parDernier]);
      const etape = `_2084_etape_${k}`, attendus = [ACC[sid], OUV[k]].concat(k === 3 ? ['codex:agregor'] : []);
      const manque = attendus.filter(t => !r.dits.includes(t));
      if (r.ferme || !r.la || !r.fini || r.drapeaux.filter(f => /etape/.test(f)).join() !== etape || manque.length) ko(`ÉCART la rencontre de ${sid}, jouée la ${k}e${parDernier ? ' (par le bouton du dernier maillon)' : ''}, ne dit pas l’étape ${k} : ${JSON.stringify({ ferme: r.ferme, la: r.la, fini: r.fini, drapeaux: r.drapeaux, manque })}`);
      else if (k < 3 && (r.nomme.length || r.fiche || r.dernier !== 'Ce qui se cache derrière les écrans')) ko(`ÉCART la ${k}e rencontre nomme l’Agrégor : ${JSON.stringify({ nomme: r.nomme, fiche: r.fiche, dernier: r.dernier })}`);
      else if (k >= 3 && (!r.fiche || r.dernier !== 'Le Cœur de l’Agrégor')) ko(`ÉCART à la ${k}e rencontre, le nom n’est pas reçu : ${JSON.stringify({ fiche: r.fiche, dernier: r.dernier })}`);
      else ok(`la rencontre de ${sid}, jouée la ${k}e${parDernier ? ' (le dernier maillon touché la fait passer avant lui)' : ''}, dit l’étape ${['', 'I', 'II', 'III', 'IV', 'V'][k]} : « ${ACC[sid]} » puis « ${OUV[k]} »${k < 3 ? ' — l’Agrégor n’y est pas nommé ; le dernier maillon s’appelle « ' + r.dernier + ' »' : k === 3 ? ' — son nom, et la fiche du Recueil ; le dernier maillon s’appelle « ' + r.dernier + ' »' : ''}`);
      return r; };
    await rencontre('uthman', 1); await cap('7-chaine-apres-la-premiere-rencontre');
    await rencontre('ali', 2);
    await rencontre('abubakr', 3);
    const apres = await nomDit();
    if (!apres.drapeau || !/devant l’Agrégor|devant l'Agrégor/.test(apres.fin) || !/l'Agrégor lui a donné/.test(apres.rumeur) || !/L'Agrégor de la Cité-Miroir/.test(apres.slogan)) ko('ÉCART le nom reçu, la saga ou le Recueil ne le nomme pas : ' + JSON.stringify(apres));
    else ok('le nom reçu, la même fin de chapitre et les deux fiches le nomment : l’Agrégor');
    await rencontre('umar', 4);
    // les cinq sagas achevées, la cinquième rencontre pas encore jouée : le bouton du dernier maillon la fait passer d'abord
    await ev(() => { const I = window.ISNAD, sv = I.save.data; sv.sagas.khalid = { ch: I.sagas.khalid.chapters.length, done: true, flags: {} }; });
    await rencontre('khalid', 5, true);
    const e1 = await ev(async () => { const I = window.ISNAD, W = I.world, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); await I.ui.showChain(); const d = T.dernier(); if (!d || d.scelle) return { ferme: true, d: d && d.tl };
      I.debug.auto = true; T.toucher(d.el); const la = await T.attendre(() => W.ch && W.ch.id === 'e1' && T.calme(), 60000); I.debug.auto = false; await T.attendre(() => T.calme(), 20000); return { la, ch: W.ch && W.ch.id }; });
    if (!e1.la) ko('ÉCART les cinq soirs joués, le dernier maillon ne s’ouvre pas : ' + JSON.stringify(e1)); else ok('les cinq sagas et leurs cinq soirs joués, le dernier maillon s’ouvre (« Le Cœur de l’Agrégor »)');
    await ev(() => { window.ISNAD.debug.auto = false; }); }

  // ---------- 8. 2.48 (D240) : une partie de la 2.47 (format 2) — ses récits, et l'étape suivante ----------
  // Deux maillons achevés avec leurs rencontres (dans l'ordre de la 2.47), Khâlid entamé (courant), 'Uthmân rangé en chemin,
  // aucune fiche de l'Agrégor : elle se charge sans rien perdre, « Continuer » montre ses deux récits, chacun reprend, et la
  // rencontre suivante dit l'étape III, comme la 2.47 l'aurait dit.
  { const r = await ev(async () => { const I = window.ISNAD, W = I.world, T = window.__t;
      const point = (sid, ci, obj) => { const ch = I.sagas[sid].chapters[ci]; W.loadMap(ch.map, ch.opts || {}, ch.start); return { saga: sid, ci, obj, map: ch.map, opts: ch.opts || {}, pos: [Math.round(W.player.x), Math.round(W.player.y)], party: ch.party.slice(), npcs: {}, foes: [], chests: [], flags: { ancien: true } }; };
      const partie = { v: 2, profil: {}, paquets: {}, started: true, prologue: true, epilogue: false, lights: [I.sagas.abubakr.light, I.sagas.umar.light], heroes: {}, items: { dattes: 3 }, gear: {}, equip: {}, gearInit: {}, codex: ['idris/jour'], isnad: { ok: 4, total: 5 },
        sagas: { abubakr: { ch: 3, done: true, flags: {} }, umar: { ch: 3, done: true, flags: {} }, khalid: { ch: 1, done: false, flags: {} }, uthman: { ch: 0, done: false, flags: {} } },
        citadel: { priere: 2, savoir: 2, justice: 1, lien: 2 }, veillees: { abubakr: true, umar: true }, rencontres: { abubakr: true, umar: true }, parley: { won: 2, total: 2 }, retours: 2, rebonds: { x_descendu: true },
        cp: point('khalid', 1, 1), cps: { uthman: Object.assign(point('uthman', 0, 1), { t: Date.now() - 3600000 }) } };
      const texte = JSON.stringify({ isnad: 'partie', format: 2, jeu: '2.47 · 2026-11-26 12:00 UTC', quand: Date.now() - 600000, partie });
      const lu = I.save.lireTexte(texte); if (!lu.ok) return { refus: lu.erreur };
      I.save.adopter(lu.partie); I.save.auto('Khâlid · essai'); T.versTitre(); await new Promise(r => setTimeout(r, 300));
      T.toucher(document.querySelector('#title .vmenu > button')); await new Promise(r => setTimeout(r, 400)); const liste = T.titre().map(x => x.k).filter(Boolean).join();
      T.toucher(document.querySelector('#title .vmenu button[data-reprise="uthman"]')); await T.attendre(() => T.calme(), 30000); await new Promise(r => setTimeout(r, 300)); const eU = T.etat();
      T.versTitre(); await new Promise(r => setTimeout(r, 300)); T.toucher(document.querySelector('#title .vmenu > button')); await new Promise(r => setTimeout(r, 400));
      T.toucher(document.querySelector('#title .vmenu button[data-reprise="khalid"]')); await T.attendre(() => T.calme(), 30000); await new Promise(r => setTimeout(r, 300)); const eK = T.etat();
      const voulu = { u: partie.cps.uthman, k: partie.cp }, etape = I.ui.etape(I.sagas.idris.chapters.find(c => c.after === 'khalid'));
      return { liste, eU, eK, voulu: { u: [voulu.u.obj, voulu.u.map, voulu.u.pos], k: [voulu.k.obj, voulu.k.map, voulu.k.pos] }, etape, nomme: I.ui.nomme() }; });
    const place = (e, v) => e && v && e.obj === v[0] && e.carte === v[1] && Math.hypot(e.x - v[2][0], e.y - v[2][1]) < 3;
    if (r.refus) ko('REFUS une partie de la 2.47 n’est pas relue : ' + r.refus);
    else if (r.liste !== 'khalid,uthman,chaine' || !place(r.eU, r.voulu.u) || !place(r.eK, r.voulu.k)) ko('ÉCART une partie de la 2.47 ne montre pas ses récits, ou ne les reprend pas à leur place : ' + JSON.stringify(r));
    else if (r.etape !== 3 || r.nomme) ko('ÉCART une partie de la 2.47 (deux rencontres jouées) ne continue pas à l’étape III : ' + JSON.stringify({ etape: r.etape, nomme: r.nomme }));
    else ok(`une partie de la 2.47 se charge : « Continuer » montre Khâlid (courant) puis ’Uthmân (rangé), chacun reprend à sa place ; ses deux rencontres jouées, la suivante dira l’étape III`); }

  // ---------- 9 à 12. 2.48 (D240), après les contre-lectures ----------
  // un point de reprise posé à la main : le lieu du chapitre, son départ, l'objectif voulu
  await ev(() => { const I = window.ISNAD, W = I.world, T = window.__t;
    T.point = (sid, ci, obj, t) => { const ch = I.sagas[sid].chapters[ci]; W.loadMap(ch.map, ch.opts || {}, ch.start); return { saga: sid, ci, obj, map: ch.map, opts: ch.opts || {}, pos: [Math.round(W.player.x), Math.round(W.player.y)], party: ch.party.slice(), npcs: {}, foes: [], chests: [], flags: { pose: true }, t: t || Date.now() }; };
    T.neuve = () => { I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.epilogue = false; sv.rebonds = {}; I.sagas.idris.chapters.forEach(c => { if (Number.isInteger(c.retour)) sv.rebonds[c.id] = true; }); sv.cite = Object.assign(sv.cite || {}, { arrivees: 3, lecon: true, vue: true, yunus: 3 }); return sv; };
    T.fait = (sv, id) => { sv.sagas[id] = { ch: I.sagas[id].chapters.length, done: true, flags: {} }; if (!sv.lights.includes(I.sagas[id].light)) sv.lights.push(I.sagas[id].light); };
    T.a = (e, c) => !!e && !!c && e.saga === c.saga && e.ci === c.ci && e.obj === c.obj && e.carte === c.map && Math.hypot(e.x - c.pos[0], e.y - c.pos[1]) < 3; });

  // 9. Idris au refuge (après « Revenir en 2084 » : le refuge courant, le récit rangé) — « Continuer » montre les deux, et le récit reprend
  { const r = await ev(async () => { const I = window.ISNAD, W = I.world, T = window.__t, sv = T.neuve(); sv.sagas.umar = { ch: 1, done: false, flags: {} };
      sv.cps = { umar: T.point('umar', 1, 2, Date.now() - 60000) }; sv.cp = T.point('idris', I.cite.index(), 0); I.save.auto('Idris · essai');
      T.versTitre(); await new Promise(r => setTimeout(r, 300)); T.toucher(document.querySelector('#title .vmenu > button')); await new Promise(r => setTimeout(r, 400));
      const L = T.titre().filter(x => x.k); const voulu = sv.cps.umar;
      T.toucher(document.querySelector('#title .vmenu button[data-reprise="umar"]')); await T.attendre(() => T.calme(), 30000); await new Promise(r => setTimeout(r, 300));
      return { liste: L.map(x => x.k).join(), refuge: (L[0] || {}).t, repris: T.a(T.etat(), voulu), e: T.etat() }; });
    if (!/^idris:\d+,umar,chaine$/.test(r.liste) || r.refuge !== 'La Cité-Miroir' || !r.repris) ko('ÉCART au refuge, avec un seul récit rangé, « Continuer » ne montre pas le refuge et le récit, ou le récit ne reprend pas à sa place : ' + JSON.stringify(r));
    else ok(`au refuge, avec un seul récit rangé, « Continuer » montre « La Cité-Miroir » puis ’Umar ; ’Umar reprend à sa place (objectif ${r.e.obj}, « ${r.e.carte} »)`); }

  // 10. un maillon achevé, rejoué puis quitté en chemin : la liste et le bouton de la Chaîne le reprennent à sa place ; « Rejouer » seul repart du début
  { const poser = () => ev(() => { const T = window.__t, I = window.ISNAD, sv = T.neuve(); T.fait(sv, 'abubakr'); sv.sagas.abubakr.ch = 2; sv.sagas.umar = { ch: 0, done: false, flags: {} };
      sv.cps = { abubakr: T.point('abubakr', 2, 1), umar: T.point('umar', 0, 1, Date.now() - 60000) }; sv.cp = null; I.save.auto('La Chaîne · essai'); });
    await poser();
    const a = await ev(async () => { const I = window.ISNAD, T = window.__t, voulu = I.save.data.cps.abubakr; T.versTitre(); await new Promise(r => setTimeout(r, 300)); T.toucher(document.querySelector('#title .vmenu > button')); await new Promise(r => setTimeout(r, 400));
      const L = T.titre().find(x => x.k === 'abubakr'); T.toucher(document.querySelector('#title .vmenu button[data-reprise="abubakr"]')); await T.attendre(() => T.calme(), 30000); await new Promise(r => setTimeout(r, 300));
      return { dit: L && L.small, repris: T.a(T.etat(), voulu), e: T.etat(), acheve: I.save.data.sagas.abubakr.done }; });
    await poser();
    const b = await ev(async () => { const I = window.ISNAD, T = window.__t, voulu = I.save.data.cps.abubakr; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); await I.ui.showChain();
      const bouton = T.chaine().bouton; T.toucher('#chain header .cta'); await T.attendre(() => T.calme(), 30000); await new Promise(r => setTimeout(r, 300)); return { bouton, repris: T.a(T.etat(), voulu), e: T.etat() }; });
    await poser();
    const c = await ev(async () => { const I = window.ISNAD, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); await I.ui.showChain(); const n0 = T.journal.length;
      I.debug.auto = true; T.toucher(T.maillon('Abû Bakr')); await T.attendre(() => T.journal.length > n0, 30000); I.debug.auto = false; await T.attendre(() => T.calme(), 30000); return { ouvert: T.journal.slice(n0)[0], range: !!(I.save.data.cps || {}).abubakr }; });
    if (!a.repris || !/^Chapitre 3 \//.test(a.dit || '') || !a.acheve) ko('ÉCART un maillon achevé, rejoué puis quitté, ne reprend pas à sa place depuis « Continuer » : ' + JSON.stringify(a));
    else if (!b.repris || !/^▶ Reprendre : Abû Bakr/.test(b.bouton)) ko('ÉCART un maillon achevé, rejoué puis quitté, ne reprend pas à sa place depuis le bouton de la Chaîne : ' + JSON.stringify(b));
    else if (c.ouvert !== 'ab1' || c.range) ko('ÉCART « Rejouer » ne repart pas du début du maillon : ' + JSON.stringify(c));
    else ok(`un maillon achevé, rejoué puis quitté au chapitre 3 : « Continuer » (« ${a.dit} ») et le bouton de la Chaîne le reprennent à sa place ; « Rejouer » seul repart du premier chapitre`); }

  // 11. une veillée quittée, la rencontre qui la suit ouverte par le dernier maillon puis quittée : la veillée achevée, la rencontre reprend à sa place
  { const r = await ev(async () => { const I = window.ISNAD, W = I.world, T = window.__t, sv = T.neuve();
      ['abubakr', 'umar', 'khalid', 'uthman', 'ali'].forEach(id => T.fait(sv, id)); ['abubakr', 'khalid', 'uthman', 'ali'].forEach(id => { sv.veillees[id] = true; sv.rencontres[id] = true; }); sv.codex.push('idris/agregor');
      const vi = I.sagas.caid.chapters.findIndex(c => c.after === 'umar'), ri = I.sagas.idris.chapters.findIndex(c => c.after === 'umar');
      sv.cps = { ['caid:' + vi]: T.point('caid', vi, 1, Date.now() - 120000), ['idris:' + ri]: T.point('idris', ri, 2, Date.now() - 60000) }; sv.cp = null; I.save.auto('La Chaîne · essai');
      const voulu = sv.cps['idris:' + ri]; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset();
      I.ui.reprendre(sv.cps['caid:' + vi]); await T.attendre(() => W.saga && W.saga.id === 'caid' && T.calme(), 30000);
      const os = W.startChapter; W.startChapter = function (sid, ci) { if (sid === 'idris' && ci === ri) I.debug.auto = false; return os.apply(this, arguments); };
      I.debug.auto = true; W.endChapter(); const la = await T.attendre(() => W.ch && W.ch.after === 'umar' && I.scene === W && !!W.map, 60000); W.startChapter = os; I.debug.auto = false; await new Promise(r => setTimeout(r, 1500));   // (la main n'est pas rendue : une partie posée à la main, ses leçons à venir)
      return { la, veillee: !!sv.veillees.umar, repris: T.a(T.etat(), voulu), e: T.etat(), voulu: [voulu.obj, voulu.map] }; });
    if (!r.la || !r.veillee || !r.repris) ko('ÉCART la veillée achevée, la rencontre laissée en chemin ne reprend pas à sa place : ' + JSON.stringify(r));
    else ok(`une veillée quittée, sa rencontre ouverte puis quittée : la veillée achevée, la rencontre reprend à son objectif ${r.e.obj}, à sa place`); }

  // 12. « Les degrés du mal » : l'Agrégor n'y est pas nommé avant que son nom soit reçu — ni son nom d'idole, ni le titre du dernier maillon —, dans chaque langue
  { const r = await ev(() => { const I = window.ISNAD, T = window.__t, sv = T.neuve(), NOM = /agr[ée]g(or|ateur)|aggregor|(?:ال|لل)مجمع|مجمع الخيالات/i;
      const rendre = () => (I.mal.paneVue() + I.mal.paneEpoque(I.sagas.idris)).replace(/src="[^"]*"/g, '').replace(/[ً-ْٰ]/g, '');
      const res = {}; ['fr', 'ar', 'arv', 'en'].forEach(l => { I.ui.langue(l); const h = rendre(); res[l] = { avant: NOM.test(h), dit: h.indexOf(I.t('Ce qui se cache derrière les écrans').replace(/[ً-ْٰ]/g, '')) >= 0 }; });
      sv.codex.push('idris/agregor'); ['fr', 'ar', 'arv', 'en'].forEach(l => { I.ui.langue(l); res[l].apres = NOM.test(rendre()); });
      I.ui.langue('fr'); return res; });
    const faux = Object.keys(r).filter(l => r[l].avant || !r[l].dit || !r[l].apres);
    if (faux.length) ko('ÉCART « Les degrés du mal » nomme l’Agrégor avant que son nom soit reçu, ou ne le nomme pas après : ' + JSON.stringify(r));
    else ok('« Les degrés du mal » ne nomme pas l’Agrégor avant que son nom soit reçu (« Ce qui se cache derrière les écrans »), et le nomme après — en français, en arabe, en arabe vocalisé et en anglais'); }

  if (errors.length) { anomalies++; console.log('--- ERREURS ---'); [...new Set(errors)].slice(0, 10).forEach(e => console.log(e)); }
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ RETOURS CONFORMES — maillons ouverts dans l’ordre qu’on veut, « Continuer » et ses récits, récits quittés et repris, retours en 2084, Citadelle, l’Agrégor dans l’ordre où l’on joue, une partie de la 2.47, les reprises du refuge, d’une relecture et d’une rencontre, les degrés du mal (captures dans ${path.relative(path.join(__dirname, '..'), out)})`);
  await browser.close();
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
