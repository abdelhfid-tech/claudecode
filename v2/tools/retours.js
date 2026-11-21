#!/usr/bin/env node
/* ISNAD 2.x — mener plusieurs récits de front, revenir en 2084, et ce qui s'y passe.
   Le joueur peut à tout moment quitter un récit par la halte (« Revenir en 2084 ») : le récit est rangé là où il le
   laisse, et se reprend là, même après en avoir joué un autre. Au retour, il peut s'être passé quelque chose aux
   Archives basses (chapitres « retour: n » de l'histoire-cadre) ; et la Citadelle, où Idris est né, s'ouvre depuis la
   Chaîne dès la première veillée entendue (chapitre « visite »).
   Cet outil le joue par les vrais boutons : deux sagas entamées et quittées, la partie exportée puis réimportée, chaque
   récit repris à son objectif et à sa place, les trois retours joués jusqu'au bout, la Citadelle visitée deux fois.
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
    T.journal = []; { const os = W.startChapter; W.startChapter = function (sid, ci) { T.journal.push(I.sagas[sid].chapters[ci].id); return os.apply(this, arguments); }; } // les chapitres ouverts, dans l'ordre
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
  });
  const ev = (fn, arg) => page.evaluate(fn, arg);
  const cap = n => page.screenshot({ path: path.join(out, n + '.png') });

  // ---------- 1. une partie neuve, le prologue derrière soi ; deux sagas entamées, quittées par la halte ----------
  await ev(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.ui.showChain(); });
  await page.waitForTimeout(400);
  const c0 = await ev(() => window.__t.chaine());
  if (c0.pied.includes('La Citadelle')) ko('ÉCART « La Citadelle » est offerte avant toute veillée'); else ok('avant toute veillée, la Chaîne n’offre pas la Citadelle (' + c0.pied.length + ' boutons au pied)');

  const ouvrir = async (nom, n) => { await ev(nom => { window.ISNAD.debug.auto = true; window.__t.toucher(window.__t.maillon(nom)); }, nom); return ev(n => window.__t.jusqua(n), n); };
  const revenir = async () => {
    const n0 = await ev(() => window.__t.journal.length);
    const r = await ev(() => window.__t.halte('Revenir en 2084'));
    if (r !== true) { ko('INACCESSIBLE la halte n’offre pas « Revenir en 2084 » : ' + JSON.stringify(r)); return null; }
    const fini = await ev(() => window.__t.jusquaLaChaine()); // ce qui s'est passé en 2084 se joue (tout seul), puis la Chaîne s'ouvre
    const ici = await ev(n0 => window.__t.journal[n0] || '', n0);
    if (!fini) { const e = await ev(() => window.__t.etat()); ko(`BLOQUÉ le retour « ${ici} » ne revient pas à la Chaîne — objectif ${e.obj}, carte ${e.carte}`); }
    await ev(() => { window.ISNAD.debug.auto = false; }); await page.waitForTimeout(350);
    return ici || '';
  };

  if (!(await ouvrir('Abû Bakr', 2))) ko('BLOQUÉ la saga d’Abû Bakr n’atteint pas son deuxième objectif');
  const A = await ev(() => window.__t.etat());
  await cap('1-abubakr-en-route');
  const r1 = await revenir();
  const s1 = await ev(() => { const sv = window.ISNAD.save.data; return { cp: sv.cp, cps: Object.keys(sv.cps || {}), a: sv.cps && sv.cps.abubakr, retours: sv.retours, rebonds: Object.keys(sv.rebonds || {}) }; });
  if (r1 !== 'x_descendu') ko('ÉCART au premier retour en 2084, rien ne s’est passé (attendu : « Ce qui est descendu ») — joué : ' + JSON.stringify(r1));
  else if (!s1.rebonds.includes('x_descendu')) ko('ÉCART le premier retour s’est joué sans être noté dans la partie');
  else ok('premier retour en 2084 : « Ce qui est descendu » se joue jusqu’au bout (un combat), puis la Chaîne');
  if (s1.cp || !s1.a || s1.a.obj !== A.obj || s1.a.map !== A.carte) ko('ÉCART le récit quitté n’est pas rangé tel qu’on l’a laissé : ' + JSON.stringify({ cp: !!s1.cp, range: s1.a && [s1.a.obj, s1.a.map], attendu: [A.obj, A.carte] }));
  else ok(`Abû Bakr est rangé à l’objectif ${A.obj}, sur « ${A.carte} » ; la partie ne garde plus de point courant`);
  const c1 = await ev(() => window.__t.chaine()); await cap('2-chaine-un-recit-en-route');
  const mA = c1.maillons.find(m => (m.nom || '').indexOf('Abû Bakr') === 0);
  if (!/^▶ Reprendre : Abû Bakr/.test(c1.bouton) || !mA || !/en route/.test(mA.etat) || !/Reprendre/.test(mA.ouvrir)) ko('INVISIBLE la Chaîne ne dit pas qu’un récit est en route : ' + JSON.stringify({ bouton: c1.bouton, maillon: mA }));
  else ok(`la Chaîne le dit : « ${c1.bouton} », maillon « ${mA.etat} »`);

  // 2.22 : les maillons se suivent — tant qu'Abû Bakr n'est pas achevé, 'Umar est scellé, et le toucher n'ouvre rien
  { const sc = await ev(async () => { const T = window.__t, b = T.maillon("'Umar"); if (!b) return null; const etat = (b.querySelector('.stt') || {}).textContent || '';
      T.toucher(b); await new Promise(r => setTimeout(r, 700)); return { scelle: b.disabled && b.classList.contains('locked'), etat, chaine: T.visible('#chain'), saga: window.ISNAD.world.saga && window.ISNAD.world.saga.id }; });
    if (!sc || !sc.scelle || !/Scellé tant que le maillon I /.test(sc.etat + ' ') || !sc.chaine || sc.saga === 'umar') ko('ÉCART ’Umar s’ouvre alors qu’Abû Bakr n’est pas achevé : ' + JSON.stringify(sc));
    else ok(`les maillons se suivent : ’Umar est scellé (« ${sc.etat} ») et le toucher n’ouvre rien`); }
  // une partie d'avant, où l'on menait deux récits de front : le scellé ne s'appliquait pas (I.debug.all le lève ici)
  await ev(() => { window.ISNAD.debug.all = true; window.ISNAD.ui.showChain(); }); await page.waitForTimeout(300);
  const ouvU = await ouvrir("'Umar", 1); await ev(() => { window.ISNAD.debug.all = false; });
  if (!ouvU) ko('BLOQUÉ la saga de ’Umar n’atteint pas son premier objectif');
  const B = await ev(() => window.__t.etat());
  const mid = await ev(() => { const sv = window.ISNAD.save.data; return { cp: sv.cp && sv.cp.saga, cps: Object.keys(sv.cps || {}) }; });
  if (mid.cp !== 'umar' || !mid.cps.includes('abubakr')) ko('ÉCART en jouant ’Umar, le récit d’Abû Bakr n’est plus rangé : ' + JSON.stringify(mid)); else ok('en jouant ’Umar, le point de reprise d’Abû Bakr reste rangé à part');
  const r2 = await revenir();
  if (r2) ko('ÉCART un retour s’est joué au deuxième retour (« ' + r2 + ' ») : le suivant n’est attendu qu’au troisième'); else ok('deuxième retour : rien ne se passe, la Chaîne s’ouvre');
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
  await ev(() => { const I = window.ISNAD; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.save.readAuto(); I.ui.resume(); }); await page.waitForTimeout(500);
  if (!(await ev(() => window.__t.visible('#chain')))) ko('ÉCART « Continuer », en 2084, ne rouvre pas la Chaîne'); else ok('« Continuer », quand on est en 2084, rouvre la Chaîne');

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
  await ev(() => { const I = window.ISNAD; I.save.data.veillees.abubakr = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.ui.showChain(); }); await page.waitForTimeout(300);
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
  const ancien = await ev(async () => { const I = window.ISNAD, W = I.world, T = window.__t, sv = I.save.data; W.checkpoint(); const garde = JSON.stringify([sv.cp.saga, sv.cp.ci, sv.cp.obj]); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); delete sv.cps.umar; sv.sagas.umar = { ch: 0, done: false, flags: {} };
    I.debug.all = true; await I.ui.showChain(); I.debug.auto = true; T.toucher(T.maillon("'Umar")); I.debug.all = false; const okk = await T.jusqua(1); const a = sv.cps && sv.cps.abubakr; return { okk, garde, range: a ? JSON.stringify([a.saga, a.ci, a.obj]) : null, cp: sv.cp && sv.cp.saga }; });
  if (!ancien.okk || ancien.range !== ancien.garde || ancien.cp !== 'umar') ko('ÉCART un point de reprise resté courant est écrasé par un autre récit : ' + JSON.stringify(ancien)); else ok('une partie d’avant (un point de reprise resté courant) : ouvrir un autre récit le range au lieu de l’écraser');

  // ---------- 6. une veillée quittée en chemin attend elle aussi : la Chaîne la reprend ----------
  { const v0 = await ev(async () => { const I = window.ISNAD, W = I.world, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null; I.debug.auto = true; W.startChapter('caid', 0); const okk = await T.jusqua(1); return Object.assign({ okk }, T.etat()); });
    const rv = await revenir();
    const cv = await ev(() => ({ bouton: window.__t.chaine().bouton, cps: Object.keys(window.ISNAD.save.data.cps || {}).sort() }));
    if (!v0.okk || rv === null || !cv.cps.includes('caid:0') || !/^▶ Reprendre : la veillée/.test(cv.bouton)) ko('ÉCART une veillée quittée en chemin n’est pas rangée ou pas offerte : ' + JSON.stringify({ v0: [v0.okk, v0.saga, v0.obj], rv, cv }));
    else { await ev(() => window.__t.toucher('#chain header .cta')); await ev(() => window.__t.attendre(() => window.__t.calme(), 30000)); await page.waitForTimeout(300);
      const v1 = await ev(() => window.__t.etat());
      if (v1.saga !== 'caid' || v1.ci !== 0 || v1.obj !== v0.obj || v1.carte !== v0.carte || Math.hypot(v1.x - v0.x, v1.y - v0.y) > 3) ko(`ÉCART la veillée ne reprend pas là où on l’a laissée :\n   laissée ${JSON.stringify(v0)}\n   reprise ${JSON.stringify(v1)}`);
      else ok(`une veillée quittée en chemin attend elle aussi (« ${cv.bouton} ») et reprend à son objectif ${v1.obj}, à sa place`); } }

  if (errors.length) { anomalies++; console.log('--- ERREURS ---'); [...new Set(errors)].slice(0, 10).forEach(e => console.log(e)); }
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ RETOURS CONFORMES — maillons dans l’ordre, récits quittés et repris, retours en 2084, Citadelle (captures dans ${path.relative(path.join(__dirname, '..'), out)})`);
  await browser.close();
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
