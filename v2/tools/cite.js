#!/usr/bin/env node
/* ISNAD 2.23 (D212) — les quartiers de la Cité-Miroir, par les vrais boutons, sur un téléphone, en hauteur et en largeur.
   - « Revenir en 2084 » (la halte d'un récit) mène, une fois joués les retours dus (« retour: n »), à la vieille mosquée (2.47), à
     côté de Maître Yûnus ; la première fois, il dit qu'on peut y revenir (la leçon de l'outil « cite »).
   - Parler à Maître Yûnus : une réplique du rôle de râwî, puis « Reprendre le récit », « La Chaîne », « Rester dans la Cité » ;
     B y répond « Rester » ; « Reprendre le récit » rend le joueur exactement à sa place (saga, chapitre, objectif, carte, point,
     groupe, drapeaux) ; la halte des quartiers offre les deux mêmes sorties ; « La Cité-Miroir », au pied de la Chaîne, y
     mène — et n'y est pas offerte avant le prologue.
   - Chaque lieu nommé atteint à pied (clavier simulé, vraies collisions) et au doigt (de vrais touchers sur la scène).
   - Les voitures : elles roulent, s'arrêtent devant le joueur, repartent quand il s'écarte ; aucune ne le traverse, il n'entre
     dans aucune ; aucune ne reste bloquée quand personne n'est sur sa voie ; les voitures de course tournent.
   - Ce qui rôde : seulement les chimères de D.CITE.rodent (aucune idée noire de D.NOIRS, sur quarante tirages) ; une chimère
     passe au travers des passants, qui ne bougent pas ; « Personne d'autre ne la voit. » à la première ; son contact ouvre un
     combat, d'où l'on peut fuir ; après le combat, la prière est rappelée, puis « Revoir Maître Yûnus » / « Plus tard » :
     B et « Plus tard » ne font rien ; oui mène à côté de Maître Yûnus, qui dit une réplique du rôle de râwî.
   - La partie garde `cite`, s'exporte et se réimporte à l'identique ; aucune erreur console.
   - Quel que soit l'avancement (le décideur, 21 novembre) : « Revenir en 2084 », depuis la halte de chacun des cinq récits et
     d'une veillée, aucun maillon achevé, mène aux quartiers ; au niveau 1, seul, dans une partie neuve, chaque chimère des rues
     se vainc à la seule touche A (Frapper), sans défaite, et l'on peut en fuir.
   - 2.27 (D216), Sâlim et la course : au premier passage au circuit, Sâlim arrive en moto ; on monte derrière lui (la leçon de
     l'outil « virages », dite par lui) ; la moto menée au joystick (en hauteur) et au clavier (en largeur), Idris se penchant
     vers l'intérieur de chaque virage ; sans se pencher, elle ralentit. L'organisateur : avant le tour de moto, rien ; après,
     les cinq circuits, chacun scellé tant que le précédent n'est pas gagné, puis ouvert ; chacun plus long ou plus serré que
     le précédent. La course menée jusqu'à l'arrivée (le premier circuit par les vrais boutons, joystick et A, ou flèches et
     Entrée ; les suivants par le pilote d'essai), la prime versée, plafonnée par visite ; la pause (B), « Reprendre » (B), et
     « Quitter la course », qui ne compte rien. Aucune mise offerte : aucune réponse, aucun mot de la course ne propose de
     parier. La manette ne recouvre ni le chrono, ni le classement, ni le signe, ni le bilan. Le Pari rôde dans la tribune,
     parmi les parieurs ; sa fiche. Le dernier maillon : des retrouvailles si Idris a couru avec Sâlim, la rencontre de
     toujours sinon. La partie garde la course, à l'identique. Captures : la moto et Sâlim à côté d'Idris, la course, le podium
     et la prime, la tribune et Le Pari, le circuit scellé ; la moto dans les trois dessins.
   - 2.28 (D217), les activités (partie 16) : une partie d'avant, puis une partie neuve. La grande roue, les chaises volantes, les
     tasses : le menu dit le prix et la somme (« Payer » / « Plus tard », B) ; sans prime, un refus sobre, rien d'avancé ; avec la
     prime, le tour payé, les dirhams débités et gardés ; la roue lève la vue jusqu'au haut de la Cité puis la repose, rien
     d'autre ne bouge ; Idris sur son manège. L'écran géant : assis (« assis »), relevé par B, puis par un pas. L'étal : un achat
     payé avec la prime, un achat trop cher refusé. La borne « Les lueurs », par les vrais boutons (le joystick et A, ou les
     flèches et Entrée) : un score, le meilleur gardé et relu après un rechargement, la pause (B, « Reprendre » par B), « Quitter
     la partie » qui ne compte rien ; la manette ne recouvre ni le tableau ni le bilan. La course reste gratuite. Aucune mise
     offerte nulle part. La partie garde les activités, à l'identique. Dans une partie neuve : chaque leçon dite une seule fois, au
     premier essai ; une activité attend quand la progression ne peut pas encore la donner.
   - 2.28 (D218), 2.47 (D238), la rue, la ruelle et la vieille mosquée (partie 17), au doigt (en hauteur) et au clavier (en largeur) :
     le prologue mène Idris lui-même par la rue, les quartiers (où rien ne rôde encore) et la ruelle abandonnée jusqu'à la vieille
     mosquée, sans passage ni récit rangé ; la porte de la mosquée ne s'y ouvre pas ; le refuge commence dans la mosquée, à côté de
     Maître Yûnus : la porte mène à la ruelle, la ruelle aux quartiers (Maître Yûnus n'y est pas, la flèche montre le chemin), et
     retour, le même chapitre ; un retour (« x_descendu ») quitté par la porte est rangé, puis repris par Maître Yûnus ; une
     rencontre (« r_abubakr ») ouvre la rue ; le dernier maillon ne l'ouvre pas ; le joueur de test du moteur ne passe jamais.
   Usage : node v2/tools/cite.js [dossier de captures] [avancement|niveau1|course|activites|passages]      « CITÉ CONFORME », sinon « ÉCART », « BLOQUÉ »,
   « INACCESSIBLE », « COINCÉ », « ABSENT » ; code de sortie 1. (« course » : la seule partie 15, en hauteur et en largeur ; « activites » : la
   seule partie 16 ; « passages » : la seule partie 17) */
const path = require('path'), fs = require('fs');
const { chromium, devices } = require('playwright');
const ACTI = process.argv[3] === 'activites', PASS = process.argv[3] === 'passages';
const out = process.argv[2] || path.join(__dirname, '../.smoke/cite'), COURSE = process.argv[3] === 'course', SEUL = process.argv[3] === 'avancement' || process.argv[3] === 'niveau1' || COURSE || ACTI || PASS, NIV1 = process.argv[3] === 'niveau1' || COURSE || ACTI || PASS; // « avancement » : les seules parties 13 et 14 ; « niveau1 » : la seule partie 14 ; « course » : la seule partie 15 ; « activites », « passages » : la 16, la 17
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(__dirname, '../index.html');
const orient = ([w, h]) => !process.env.ORIENT || (process.env.ORIENT === 'haut') === (h > w);   // (ORIENT=haut|large : une seule orientation)
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); }, si = (c, bien, mal, mot) => c ? ok(bien) : ko((mot || 'ÉCART') + ' ' + (mal || bien));

async function telephone(browser, w, h, qs) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }), p = await ctx.newPage(), errors = [];
  p.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await p.goto(url + (qs || '')); await p.waitForTimeout(1600); await preparer(p);
  return { ctx, p, errors };
}
// les aides de l'outil, dans la page (à reposer après un rechargement)
async function preparer(p) {
  await p.evaluate(() => {
    const I = window.ISNAD, W = I.world, S = I.script, q = s => document.querySelector(s);
    I.audio.setOn(false); I.debug.noOeuvres = true;
    const T = window.__t = { toasts: [] };
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) T.toasts.push((n.textContent || '').trim()); }))).observe(q('#toasts'), { childList: true });
    T.journal = []; { const os = W.startChapter; W.startChapter = function (sid, ci) { const ch = I.sagas[sid].chapters[ci]; T.journal.push(ch.id); if (I.cite.refuge(ch)) I.debug.auto = false; return os.apply(this, arguments); }; } // dans les quartiers, la main revient au joueur
    { const oa = I.cite.apres; I.cite.apres = function () { I.debug.auto = false; I.speed = 1; return oa.apply(this, arguments); }; }                // après un combat mené par l'IA de test, le rappel se lit par les vrais boutons
    { const ob = I.battle.start; T.combats = []; I.battle.start = function (o) { T.combats.push({ group: (o.group || []).join('+'), fuite: !!o.fuite, bg: o.bg }); return ob.apply(this, arguments); }; }
    T.visible = s => { const e = q(s); return !!e && !e.hidden; };
    T.attendre = (cond, ms) => new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { let v = false; try { v = cond(); } catch (e) { v = false; } if (v) { clearInterval(iv); res(true); } else if (Date.now() - t0 > (ms || 60000)) { clearInterval(iv); res(false); } }, 50); });
    T.calme = () => I.scene === W && !!W.map && !S.busy && !W.lock && !I.battle.active && !I.ui.menuOpen;
    T.etat = () => ({ saga: W.saga && W.saga.id, ch: W.ch && W.ch.id, ci: W.ci, obj: W.objIndex, carte: W.map && W.map.id, x: Math.round(W.player.x), y: Math.round(W.player.y), groupe: W.party.join('+'), drapeaux: Object.keys(S.flags).filter(k => S.flags[k] && !/^(lame|tranche)_/.test(k)).sort().join(',') });
    T.yunus = () => W.npcs.find(n => n.id === 'yunus_c');
    T.pres = () => { const y = T.yunus(); return y ? Math.round(Math.hypot(y.x - W.player.x, y.y - W.player.y)) : -1; };
    T.pied = nom => [...document.querySelectorAll('#chain .chainfoot button')].find(b => b.textContent === nom);
    T.piedNoms = () => [...document.querySelectorAll('#chain .chainfoot button')].map(b => b.textContent);
    T.maillon = nom => [...document.querySelectorAll('#chain .links .link')].find(b => ((b.querySelector('h3') || {}).textContent || '').indexOf(nom) === 0);
    T.halte = () => { I.ui.pause(); return [...document.querySelectorAll('#menu .side button')].map(b => b.textContent.trim()); };
    T.halteBouton = nom => { const b = [...document.querySelectorAll('#menu .side button')].find(x => x.textContent.trim() === nom); if (!b) return false; b.click(); return true; };
    T.choix = () => T.visible('#choice') ? { prompt: (q('#choice .prompt') || {}).textContent || '', opts: [...document.querySelectorAll('#choice .opt')].map(b => b.textContent.trim()) } : null;
    T.dialogue = () => T.visible('#dialog') ? (q('#dialog .text').textContent || '').trim() : '';
    // la ligne, une fois écrite tout entière (la machine à écrire a fini : le ▼ paraît)
    // (puis un instant : une touche pressée juste avant que la ligne n'attende la suite serait perdue — comme pour un joueur)
    T.lu = async () => { if (!T.visible('#dialog')) { await new Promise(r => setTimeout(r, 200)); return ''; } await T.attendre(() => T.visible('#dialog') && getComputedStyle(q('#dialog .next')).visibility === 'visible', 8000); await new Promise(r => setTimeout(r, 200)); return T.dialogue(); };
    // jouer le récit en cours jusqu'à ce que n objectifs soient atteints, puis rendre la main
    T.jusqua = async n => { const oc = W.checkpoint; W.checkpoint = function () { const r = oc.apply(this, arguments); if (W.objIndex >= n) I.debug.auto = false; return r; };
      I.debug.auto = true; const fini = await T.attendre(() => W.objIndex >= n && !I.debug.auto && T.calme(), 180000); W.checkpoint = oc; I.debug.auto = false; return fini; };
    // le pied du joueur et une voiture l'un dans l'autre ?
    T.dans = v => { const f = I.trafic.pied(v), p = W.player; return f[0] < p.x + 4 && p.x - 4 < f[2] && f[1] < p.y && p.y - 5 < f[3]; };
    T.poser = (x, y) => { W.player.x = x; W.player.y = y; W.dest = null; W.stop(); W.resetTrail(); W.updateCam(true); };
    T.endormir = () => { W.foes.forEach(f => { if (f.rue) f.done = true; }); };   // pour marcher sans être rejoint
    // 2.47 (D238) : le refuge commence dans la vieille mosquée ; on va aux quartiers par sa porte, puis par la ruelle (les passages
    // du jeu, pris tels quels — la partie 17 les éprouve au doigt et au clavier)
    T.auxQuartiers = async () => { const f = id => I.passages.PASSAGES.find(x => x.id === id); await T.attendre(() => T.calme(), 20000);
      if (W.map.id === 'archives') { await f('sortir').fn(); await T.attendre(() => W.map.id === 'impasse' && T.calme(), 10000); }
      if (W.map.id === 'impasse') { await f('ruelle-retour').fn(); await T.attendre(() => W.map.id === 'quartiers' && T.calme(), 10000); }
      return W.map.id === 'quartiers'; };
    // un point de la carte, en points de l'écran (sans rien éviter : pour toucher un bord)
    T.brut = (wx, wy) => { const c = q('#cv').getBoundingClientRect(), G = I.gfx; return [(wx - Math.round(W.cam.x)) / G.PW * c.width + c.left, (wy - Math.round(W.cam.y)) / G.PH * c.height + c.top]; };
    // marcher jusqu'à un point au clavier simulé (les flèches tenues), en suivant le chemin des cases, comme le joueur de test « à pied »
    T.marcher = async (x, y, ms) => { const p = W.player, h = I.input.held, t0 = performance.now(); let path = W.pathTo(p.x, p.y, x, y) || [], best = 1e9, calee = 0;
      while (performance.now() - t0 < ms) { const d = Math.hypot(x - p.x, y - p.y); if (d < 18) break;
        if (S.busy || W.lock || I.battle.active) { h.up = h.down = h.left = h.right = false; await new Promise(r => setTimeout(r, 100)); continue; }
        while (path.length > 1 && Math.hypot(path[0][0] - p.x, path[0][1] - p.y) < 3) path.shift();
        const wp = path.length > 1 ? path[0] : [x, y]; h.up = h.down = h.left = h.right = false; const dx = wp[0] - p.x, dy = wp[1] - p.y; if (dx > 1.2) h.right = true; else if (dx < -1.2) h.left = true; if (dy > 1.2) h.down = true; else if (dy < -1.2) h.up = true;
        await new Promise(r => requestAnimationFrame(r));
        if (d < best - 0.5) { best = d; calee = 0; } else if (++calee > 90) { calee = 0; path = W.pathTo(p.x, p.y, x, y) || path; } }
      h.up = h.down = h.left = h.right = false; return Math.round(Math.hypot(x - p.x, y - p.y)); };
    // où toucher la scène pour aller vers un point de la carte : le point lui-même s'il se voit, sinon dans sa direction, au bord de
    // ce que l'on voit — jamais sur la manette ni sur le plan
    T.ecran = (wx, wy) => { const G = I.gfx, c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect(), p = W.player;
      const X = x => (x - Math.round(W.cam.x)) / G.PW * c.width + c.left, Y = y => (y - Math.round(W.cam.y)) / G.PH * c.height + c.top;
      const hx = X(p.x), hy = Y(p.y - 6); let tx = X(wx), ty = Y(wy - 4);
      const L = Math.max(s.left, 0) + 40, R = Math.min(s.right, innerWidth) - 40, H = Math.max(s.top, 0) + 70, B = Math.min(s.bottom, innerHeight) - 30;
      const pads = [...document.querySelectorAll('#pad .dpad, #pad button')].filter(b => getComputedStyle(b).visibility !== 'hidden').map(b => b.getBoundingClientRect()).filter(r => r.width > 4);
      const mini = W.miniRect ? [X(W.miniRect[0] + Math.round(W.cam.x)), Y(W.miniRect[1] + Math.round(W.cam.y)), X(W.miniRect[0] + W.miniRect[2] + Math.round(W.cam.x)), Y(W.miniRect[1] + W.miniRect[3] + Math.round(W.cam.y))] : null;
      // (et rien d'autre que la scène sous le doigt : ni un bouton de la scène, ni une étiquette)
      const libre = (a, b) => a > L && a < R && b > H && b < B && pads.every(r => a < r.left - 16 || a > r.right + 16 || b < r.top - 16 || b > r.bottom + 16) && !(mini && a > mini[0] - 10 && a < mini[2] + 10 && b > mini[1] - 10 && b < mini[3] + 10)
        && [[0, 0], [-14, 0], [14, 0], [0, -14], [0, 14]].every(([u, v]) => { const e = document.elementFromPoint(a + u, b + v); return !!e && ['cv', 'stage', 'ui', 'view'].includes(e.id); });   // (ce que la scène prend pour un toucher : ui.js, bare)
      for (let k = 20; k > 0; k--) { const a = hx + (tx - hx) * k / 20, b = hy + (ty - hy) * k / 20; if (libre(a, b) && Math.hypot(a - hx, b - hy) > 30) return [a, b]; }
      return null; };
  });
}
// 2.47 (D238) : le refuge ouvert (« La Cité-Miroir », « Revenir en 2084 ») : ses textes lus, puis de la mosquée aux quartiers
async function refugeAuxQuartiers(P) { const la = await P.evaluate(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers', 30000)); if (!la) return false;
  await avancer(P); return P.evaluate(() => window.__t.auxQuartiers()); }
// faire avancer ce qui se dit (dialogues, cartons) jusqu'à ce que le joueur ait la main, ou qu'un choix s'ouvre
async function avancer(p, n = 120) {
  for (let i = 0; i < n; i++) {
    const e = await p.evaluate(() => { const T = window.__t; return T.calme() ? 'calme' : T.visible('#choice') ? 'choix' : (T.visible('#dialog') || (T.visible('#card') && document.querySelector('#card').classList.contains('on'))) ? 'lire' : T.visible('#chain') ? 'chaine' : ''; });
    if (e === 'calme' || e === 'choix' || e === 'chaine') return e;
    if (e === 'lire') { await p.evaluate(() => window.__t.lu()); await p.keyboard.press('Enter'); }
    await p.waitForTimeout(170);
  }
  return 'bloque';
}

(async () => {
  const browser = await chromium.launch(); let toutesErreurs = [];
  for (const [w, h] of SEUL ? [] : [[390, 844], [844, 390]]) {
    const nom = w + '×' + h, haut = h > w;
    const T = await telephone(browser, w, h), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    // ---------- 1. une partie, le prologue joué, Abû Bakr entamé ; par l'écran-titre (« Continuer ») ----------
    // (en hauteur, le premier retour en 2084 est dû : « Ce qui est entré » se joue d'abord ; en largeur, les retours sont joués)
    // (2.27 : Sâlim est déjà passé — sa moto garée, l'organisateur ouvert — ; sa venue est éprouvée à la partie 15)
    await E(haut => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.cite.course.salim = 2; if (!haut) sv.rebonds = { x_descendu: true, x_enfant: true, x_avis: true }; I.save.auto('essai'); }, haut);
    await P.reload(); await P.waitForTimeout(1600); await preparer(P);
    {
      const b = await E(() => { const x = [...document.querySelectorAll('#title .vmenu button')].find(b => /^Continuer/.test(b.textContent)); if (x) x.click(); return !!x; });
      si(b && await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000)), `${nom} · « Continuer » rouvre la Chaîne`, `${nom} · l’écran-titre ne mène pas à la Chaîne`, 'BLOQUÉ');
      const pied0 = await E(() => window.__t.piedNoms());
      si(pied0.includes('La Cité-Miroir'), `${nom} · le pied de la Chaîne offre « La Cité-Miroir » (le prologue est joué)`, `${nom} · pas de « La Cité-Miroir » au pied de la Chaîne : ${JSON.stringify(pied0)}`, 'ABSENT');
      if (!haut) await P.screenshot({ path: path.join(out, `chaine-pied-${w}x${h}.png`) });
      await E(() => { window.ISNAD.debug.auto = true; window.__t.maillon('Abû Bakr').click(); });
      si(await E(() => window.__t.jusqua(2)), `${nom} · Abû Bakr joué jusqu’à son deuxième objectif`, `${nom} · Abû Bakr n’atteint pas son deuxième objectif`, 'BLOQUÉ');
    }
    const A = await E(() => window.__t.etat());
    // ---------- 2. « Revenir en 2084 » : (les retours dus,) puis la vieille mosquée, à côté de Maître Yûnus (2.47) ----------
    {
      const noms = await E(() => window.__t.halte());
      const offert = noms.includes('Revenir en 2084');
      si(offert, `${nom} · la halte offre « Revenir en 2084 »`, `${nom} · la halte n’offre pas « Revenir en 2084 » : ${JSON.stringify(noms)}`, 'INACCESSIBLE');
      await E(() => { window.ISNAD.debug.auto = true; window.__t.halteBouton('Revenir en 2084'); }); // ce qui se joue au retour se lit tout seul
      const arrive = await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers', 200000));
      const r = await avancer(P);
      const e = await E(() => ({ journal: window.__t.journal.slice(-3), etat: window.__t.etat(), pres: window.__t.pres(), lecon: window.ISNAD.cite.journal.some(j => j.quoi === 'lecon'), dits: window.ISNAD.cite.journal.map(j => j.quoi), cps: Object.keys(window.ISNAD.save.data.cps || {}) }));
      const attendu = haut ? ['x_descendu', 'c_quartiers'] : ['c_quartiers'];
      si(arrive && r === 'calme' && attendu.every(k => e.journal.includes(k)) && e.etat.carte === 'archives' && e.pres > 0 && e.pres < 40,
        `${nom} · « Revenir en 2084 » : ${haut ? '« Ce qui est entré » se joue d’abord (un retour dû), puis ' : ''}Idris paraît dans la vieille mosquée, à ${e.pres} points de Maître Yûnus`,
        `${nom} · l’arrivée dans les quartiers : ${JSON.stringify(e)} (${r})`, 'BLOQUÉ');
      si(e.lecon && e.cps.includes('abubakr'), `${nom} · Maître Yûnus dit, la première fois, qu’on peut revenir ici (leçon « cite ») ; Abû Bakr est rangé`, `${nom} · la leçon ou le récit rangé : ${JSON.stringify(e)}`);
      await E(() => window.__t.endormir()); await P.waitForTimeout(400); await P.screenshot({ path: path.join(out, `arrivee-yunus-${w}x${h}.png`) });
    }
    // ---------- 3. parler à Maître Yûnus : une réplique, puis où aller ; B : rester ----------
    const parler = async () => { await E(() => { const W = window.ISNAD.world, y = window.__t.yunus(); window.__t.poser(y.x + 18, y.y); W.player.dir = 1; }); await P.waitForTimeout(250); await P.keyboard.press('Enter'); await P.waitForTimeout(200);
      const d = await E(() => window.__t.lu()); const r = await avancer(P); await P.waitForTimeout(450); return { d, r, c: await E(() => window.__t.choix()) }; };
    {
      const m = await parler(), Y = await E(() => window.ISNAD.sagas.idris.cite.yunus);
      si(m.r === 'choix' && Y.some(t => m.d.indexOf(t.slice(0, 30)) >= 0) && m.c && m.c.opts.length === 3 && /^Reprendre le récit : Abû Bakr/.test(m.c.opts[0]) && /La Chaîne/.test(m.c.opts[1]) && /Rester/.test(m.c.opts[2]),
        `${nom} · Maître Yûnus : « ${m.d.slice(0, 60)}… », puis ${m.c ? m.c.opts.map(o => '« ' + o + ' »').join(', ') : '?'}`, `${nom} · parler à Maître Yûnus : ${JSON.stringify(m)}`);
      await P.screenshot({ path: path.join(out, `yunus-menu-${w}x${h}.png`) });
      await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(500);
      const apres = await E(() => ({ choix: window.__t.visible('#choice'), ch: window.ISNAD.world.ch.id, k: window.ISNAD.cite.journal.filter(j => j.quoi === 'menu').pop() }));
      si(!apres.choix && apres.ch === 'c_quartiers' && apres.k && apres.k.k === '', `${nom} · B répond « Rester dans la Cité » : rien ne change`, `${nom} · B devant Maître Yûnus : ${JSON.stringify(apres)}`);
    }
    // ---------- 3b. 2.47 (D238) : de la mosquée aux quartiers, par la porte puis la ruelle ; Maître Yûnus reste dans la mosquée ----------
    {
      const q = await E(() => window.__t.auxQuartiers()), e = await E(() => ({ carte: window.ISNAD.world.map.id, ch: window.ISNAD.world.ch.id, y: (window.__t.yunus() || {}).map, cible: !!(window.ISNAD.world.target() || {}).passage, obj: document.querySelector('#hud .obj').textContent }));
      si(q && e.ch === 'c_quartiers' && e.y === 'archives' && /vieille mosquée/.test(e.obj), `${nom} · de la mosquée, la porte puis la ruelle mènent aux quartiers ; Maître Yûnus reste dans la mosquée ; l’objectif dit le chemin du retour`, `${nom} · vers les quartiers : ${JSON.stringify({ q, e })}`, 'BLOQUÉ');
      await E(() => window.__t.endormir());
    }
    // ---------- 4. chaque lieu, à pied (en hauteur) et au doigt ----------
    {
      const lieux = await E(() => Object.keys(window.ISNAD.world.map.spots));
      const rates = [];
      if (haut) for (const k of lieux) { const d = await E(async k => { const W = window.ISNAD.world, s = W.spotPx(k); return window.__t.marcher(s[0], s[1], 30000); }, k); if (d > 24) rates.push(k + ' (' + d + ' px)'); }
      si(!haut || !rates.length, `${nom} · à pied : les ${lieux.length} lieux nommés atteints (${lieux.join(', ')})`, `${nom} · à pied, lieux non atteints : ${rates.join(', ')}`, 'COINCÉ');
      const rates2 = [];
      await E(() => { const W = window.ISNAD.world, s = W.spotPx('parvis'); window.__t.poser(s[0], s[1]); });
      for (const k of lieux) {
        let d = 1e9;
        for (let i = 0; i < 40; i++) {
          // (comme un joueur : on touche le lieu s'il se voit ; sinon un point du chemin qui y mène, quelques cases plus loin — un
          // bâtiment entre les deux se contourne)
          const st = await E(k => { const T = window.__t, W = window.ISNAD.world, s = W.spotPx(k); const d = Math.hypot(s[0] - W.player.x, s[1] - W.player.y); if (d < 22) return { d };
            const ch = W.route(s[0], s[1]), q = ch.length ? ch[Math.min(ch.length - 1, 7)] : s; return { d, pt: T.ecran(q[0], q[1] + 2) || T.ecran(s[0], s[1]), calme: T.calme() }; }, k);
          d = st.d; if (d < 22) break;
          if (!st.calme) { await avancer(P, 20); await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(200); continue; } // un passant touché en chemin : on l'écoute, puis on repart
          if (st.pt) await P.touchscreen.tap(st.pt[0], st.pt[1]);
          await P.waitForTimeout(900);
        }
        if (d >= 22) { rates2.push(k + ' (' + Math.round(d) + ' px)'); await P.screenshot({ path: path.join(out, `doigt-rate-${k}-${w}x${h}.png`) }); console.log('   (dernier état : ' + JSON.stringify(await E(k => { const W = window.ISNAD.world, s = W.spotPx(k); return { joueur: [Math.round(W.player.x), Math.round(W.player.y)], lieu: s, pt: window.__t.ecran(s[0], s[1]), dest: W.dest && [Math.round(W.dest.x), Math.round(W.dest.y), W.dest.path.length] }; }, k)) + ')'); }
        else await P.screenshot({ path: path.join(out, `lieu-${k}-${w}x${h}.png`) });
      }
      si(!rates2.length, `${nom} · au doigt : les ${lieux.length} lieux nommés atteints, par des touchers sur la scène`, `${nom} · au doigt, lieux non atteints : ${rates2.join(', ')}`, 'INACCESSIBLE');
    }
    // ---------- 5. les voitures ----------
    {
      await E(() => { const W = window.ISNAD.world, s = W.spotPx('priere'); window.__t.poser(s[0], s[1]); window.ISNAD.trafic.traverses = 0; });
      const s0 = await E(() => window.ISNAD.trafic.voitures.map(v => v.s).concat(window.ISNAD.trafic.course.map(v => v.s)));
      await P.waitForTimeout(4000);
      const r1 = await E(s0 => { const TR = window.ISNAD.trafic, n = TR.voitures.length; return { n, nc: TR.course.length, roulent: TR.voitures.filter((v, i) => v.s - s0[i] > 60).length, course: TR.course.filter((v, i) => v.s - s0[n + i] > 200).length, attente: Math.max(...TR.voitures.map(v => v.attente)) }; }, s0);
      si(r1.n >= 4 && r1.roulent === r1.n && r1.course === r1.nc && r1.attente < 2, `${nom} · ${r1.n} voitures roulent sur la boucle des avenues, ${r1.nc} voitures de course tournent ; personne n’est sur leur voie : aucune ne reste arrêtée`, `${nom} · les voitures : ${JSON.stringify(r1)}`, 'BLOQUÉ');
      // devant une voiture qui va vers l'ouest, au milieu de la voie
      // (une voiture sur une avenue, vers l'est ou vers l'ouest, et devant elle, à quatre-vingt-dix points, une voie sans autre voiture)
      const v0 = await E(async () => { const TR = window.ISNAD.trafic; for (let essai = 0; essai < 40; essai++) {
          const libreEn = (x, y) => TR.voitures.every(u => Math.abs(u.x - x) > 60 || Math.abs(u.y - y) > 30);
          const v = TR.voitures.find(v => (v.d === 'g' || v.d === 'd') && v.x > 320 && v.x < 760 && libreEn(v.x + (v.d === 'd' ? 90 : -90), v.y));
          if (v) { window.__t.poser(v.x + (v.d === 'd' ? 90 : -90), v.y); TR.traverses = 0; TR.journal.length = 0; return v.i; }
          await new Promise(r => setTimeout(r, 250)); }
        return null; });
      if (v0 === null) ko(`ÉCART ${nom} · aucune voiture sur l’avenue du nord pour l’éprouver`);
      else {
        await P.waitForTimeout(400); await P.screenshot({ path: path.join(out, `voiture-arretee-${w}x${h}.png`) });
        await P.waitForTimeout(3200);
        const r2 = await E(i => { const TR = window.ISNAD.trafic, v = TR.voitures[i], W = window.ISNAD.world; return { v: v.v, ecart: Math.round(v.d === 'd' ? W.player.x - 4 - (v.x + 18) : v.x - 18 - (W.player.x + 4)), dans: window.__t.dans(v), traverses: TR.traverses, journal: TR.journal }; }, v0);
        si(r2.v === 0 && r2.ecart > 0 && r2.ecart <= 44 && !r2.dans && r2.traverses === 0, `${nom} · une voiture s’arrête devant le joueur, à ${r2.ecart} points de lui, et ne le traverse pas`, `${nom} · devant une voiture : ${JSON.stringify(r2)}`);
        // entrer dans la voiture arrêtée, par le côté : refusé
        const r3 = await E(async i => { const I = window.ISNAD, W = I.world, TR = I.trafic, v = TR.voitures[i]; window.__t.poser(v.x, v.y - 14); const h = I.input.held; h.down = true; for (let k = 0; k < 40; k++) await new Promise(r => requestAnimationFrame(r)); h.down = false; return { dans: window.__t.dans(v), y: Math.round(W.player.y), pied: TR.pied(v).map(Math.round) }; }, v0);
        si(!r3.dans, `${nom} · on n’entre pas dans une voiture : le pas vers elle est refusé`, `${nom} · le joueur est entré dans une voiture : ${JSON.stringify(r3)}`);
        await E(i => { const v = window.ISNAD.trafic.voitures[i]; window.__t.poser(v.x + (v.d === 'd' ? 60 : -60), v.y < 300 ? 168 : 534); }, v0); await P.waitForTimeout(2500);
        const r4 = await E(i => { const TR = window.ISNAD.trafic; return { v: Math.round(TR.voitures[i].v), traverses: TR.traverses, journal: TR.journal }; }, v0);
        si(r4.v > 0 && r4.traverses === 0, `${nom} · le joueur s’écarte : elle repart (${r4.v} points par seconde) ; aucune voiture n’a traversé personne`, `${nom} · après l’écart : ${JSON.stringify(r4)}`, 'BLOQUÉ');
        await P.screenshot({ path: path.join(out, `voitures-${w}x${h}.png`) });
      }
    }
    // ---------- 6. ce qui rôde : jamais une idée noire ; au travers des passants ----------
    {
      const r = await E(() => { const I = window.ISNAD, W = I.world, S = I.script, D = I.D, vus = {}; let noirs = 0, hors = 0, n = 0; const g0 = S.flags._rues;
        for (let k = 0; k < 40; k++) { S.flags._rues = 1000 + k; I.rodeurs.poserRues(); W.foes.filter(f => f.rue).forEach(f => { n++; const id = f.group[0]; vus[id] = (vus[id] || 0) + 1; if (D.NOIRS.includes(id) || (W.saga.enemies[id] || {}).idee) noirs++; if (!D.CITE.rodent[id]) hors++; }); }
        S.flags._rues = g0; I.rodeurs.poserRues(); return { n, noirs, hors, vus }; });
      si(r.n > 60 && !r.noirs && !r.hors, `${nom} · quarante tirages : ${r.n} chimères dans les rues, toutes de D.CITE.rodent (${Object.keys(r.vus).map(k => k + ' ' + r.vus[k]).join(', ')}) — aucune idée noire`, `${nom} · ce qui rôde : ${JSON.stringify(r)}`);
      const t = await E(async () => { const I = window.ISNAD, W = I.world, n = W.npcs.find(x => x.id === 'q_livreur'), f = W.foes.find(x => x.rue && !x.done); if (!n || !f) return null;
        const avant = JSON.stringify([n.x, n.y, n.dir, n.pose, n.hidden]); f.x = n.x; f.y = n.y - 3; f.cx = null; window.__t.poser(W.spotPx('priere')[0], W.spotPx('priere')[1]);
        let sur = 0; for (let k = 0; k < 60; k++) { await new Promise(r => requestAnimationFrame(r)); if (Math.abs(f.x - n.x) < 9 && Math.abs(f.y - n.y) < 9) sur++; }
        return { avant, apres: JSON.stringify([n.x, n.y, n.dir, n.pose, n.hidden]), sur, rue: I.rodeurs.rueOk(Math.floor(n.x / 16), Math.floor(n.y / 16)) }; });
      si(t && t.avant === t.apres && t.sur > 0 && t.rue, `${nom} · une chimère passe au travers d’un passant (sur lui ${t && t.sur} images) : il ne bouge pas, ne la voit pas`, `${nom} · au travers des passants : ${JSON.stringify(t)}`);
    }
    // ---------- 7. une chimère des rues : la voir, le combat, le rappel, « Plus tard » (B) ; puis « Revoir Maître Yûnus » ----------
    const rencontre = async (n) => {
      await E(() => { window.ISNAD.rodeurs.poserRues(); }); // (de nouveau en route)
      // (la première : vue d'abord dans la rue, à quelques pas)
      if (n === 1) { const vu = await E(() => { const W = window.ISNAD.world, f = W.foes.find(x => x.rue && !x.done); if (!f) return false; window.__t.poser(f.x + 56, f.y + 2); return true; });
        if (vu) { await P.waitForTimeout(250); await P.screenshot({ path: path.join(out, `chimere-rue-${w}x${h}.png`) }); } }
      const f = await E(() => { const W = window.ISNAD.world, f = W.foes.find(x => x.rue && !x.done); if (!f) return null; const T = window.__t; f.cx = null; T.poser(f.x + 10, f.y + 4); return f.group[0]; });
      if (!f) { ko(`ABSENT ${nom} · aucune chimère dans les rues`); return null; }
      const combat = await E(() => window.__t.attendre(() => window.ISNAD.battle.active, 12000));
      if (!combat) { ko(`BLOQUÉ ${nom} · la chimère « ${f} » ne rejoint pas Idris`); return null; }
      await P.waitForTimeout(1400); if (n === 1) await P.screenshot({ path: path.join(out, `chimere-combat-${w}x${h}.png`) });
      await E(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 20; }); // le combat lui-même, l'IA de test le mène
      const fin = await E(() => window.__t.attendre(() => !window.ISNAD.battle.active && window.__t.visible('#dialog'), 90000));
      const d = await E(() => window.__t.lu()), L = await E(() => window.ISNAD.sagas.idris.cite.rappels);
      si(fin && L.some(t => d.indexOf(t.slice(0, 30)) >= 0), `${nom} · après le combat contre « ${f} », la prière rappelée : « ${d.slice(0, 70)}… »`, `${nom} · après le combat : ${JSON.stringify({ fin, d })}`);
      await P.keyboard.press('Enter'); await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 5000)); await P.waitForTimeout(500);
      const c = await E(() => window.__t.choix());
      si(c && c.opts.length === 2 && /Revoir Maître Yûnus/.test(c.opts[0]) && /Plus tard/.test(c.opts[1]), `${nom} · « ${c && c.prompt} » : ${c && c.opts.join(' / ')}`, `${nom} · le choix après le rappel : ${JSON.stringify(c)}`);
      if (n === 1) await P.screenshot({ path: path.join(out, `rappel-choix-${w}x${h}.png`) });
      return { f, c };
    };
    {
      const e0 = await E(() => ({ x: window.ISNAD.world.player.x, y: window.ISNAD.world.player.y }));
      const r1 = await rencontre(1);
      if (r1) {
        const seul = await E(() => window.__t.toasts.filter(t => /Personne d’autre ne la voit\./.test(t)).length);
        si(seul === 1, `${nom} · à la première chimère vue : « Personne d’autre ne la voit. »`, `${nom} · la ligne de la première chimère : vue ${seul} fois`);
        const avant = await E(() => ({ x: Math.round(window.ISNAD.world.player.x), y: Math.round(window.ISNAD.world.player.y), pres: window.__t.pres() }));
        await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(600);
        const apres = await E(() => ({ choix: window.__t.visible('#choice'), x: Math.round(window.ISNAD.world.player.x), y: Math.round(window.ISNAD.world.player.y), j: window.ISNAD.cite.journal.slice(-1)[0], calme: window.__t.calme() }));
        si(!apres.choix && apres.j.quoi === 'plus-tard' && Math.hypot(apres.x - avant.x, apres.y - avant.y) < 2 && apres.calme, `${nom} · B répond « Plus tard » : Idris reste où il est`, `${nom} · B après le rappel : ${JSON.stringify({ avant, apres })}`);
      }
      const r2 = await rencontre(2);
      if (r2) {
        await P.keyboard.press('Enter'); await E(() => window.__t.attendre(() => window.__t.visible('#dialog'), 6000));
        const d = await E(() => window.__t.lu()), Y = await E(() => window.ISNAD.sagas.idris.cite.yunus), pres = await E(() => window.__t.pres());
        si(pres > 0 && pres < 32 && Y.some(t => d.indexOf(t.slice(0, 30)) >= 0), `${nom} · « Revoir Maître Yûnus » : Idris est mené à ${pres} points de lui, qui dit : « ${d.slice(0, 60)}… »`, `${nom} · revoir Maître Yûnus : ${JSON.stringify({ pres, d })}`);
        await P.screenshot({ path: path.join(out, `yunus-replique-${w}x${h}.png`) });
        await avancer(P);
      }
      const cb = await E(() => window.__t.combats.filter(c => c.group.split('+').every(g => window.ISNAD.D.CITE.rodent[g])));
      si(cb.length >= 2 && cb.every(c => c.fuite), `${nom} · chaque combat des rues est un combat de rencontre, d’où l’on peut fuir (${cb.map(c => c.group).join(', ')})`, `${nom} · les combats des rues : ${JSON.stringify(cb)}`);
    }
    // ---------- 8. « Reprendre le récit » (Maître Yûnus) : exactement à sa place ----------
    {
      const m = await parler();
      if (m.r !== 'choix' || !m.c) ko(`BLOQUÉ ${nom} · Maître Yûnus ne propose rien : ${JSON.stringify(m)}`);
      else { await P.keyboard.press('Enter'); // la première réponse : reprendre le récit
        await E(() => window.__t.attendre(() => window.ISNAD.world.saga && window.ISNAD.world.saga.id === 'abubakr' && window.__t.calme(), 30000)); await P.waitForTimeout(300);
        const e = await E(() => window.__t.etat()), sv = await E(() => ({ cps: Object.keys(window.ISNAD.save.data.cps || {}), cp: window.ISNAD.save.data.cp && window.ISNAD.save.data.cp.saga }));
        const meme = e.saga === A.saga && e.ci === A.ci && e.obj === A.obj && e.carte === A.carte && Math.hypot(e.x - A.x, e.y - A.y) < 3 && e.groupe === A.groupe && e.drapeaux === A.drapeaux;
        si(meme && !sv.cps.some(k => /^idris:/.test(k)), `${nom} · « Reprendre le récit » : Abû Bakr reprend exactement là où on l’a laissé (objectif ${e.obj}, « ${e.carte} », ${e.x}, ${e.y}) ; le refuge n’est pas rangé`,
          `${nom} · reprendre le récit :\n   laissé  ${JSON.stringify(A)}\n   repris  ${JSON.stringify(e)} ${JSON.stringify(sv)}`); }
    }
    // ---------- 9. de nouveau dans les quartiers : la halte offre la Chaîne ; la Chaîne y ramène ; Maître Yûnus offre la Chaîne ----------
    {
      await E(() => { window.__t.halte(); window.__t.halteBouton('Revenir en 2084'); });
      await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers', 60000)); await avancer(P);
      const noms = await E(() => window.__t.halte());
      si(noms.includes('Reprendre le récit') && noms.includes('La Chaîne') && !noms.includes('Revenir en 2084'), `${nom} · la halte des quartiers offre « Reprendre le récit » et « La Chaîne »`, `${nom} · la halte des quartiers : ${JSON.stringify(noms)}`, 'ABSENT');
      await E(() => window.__t.halteBouton('La Chaîne'));
      const ch = await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 15000));
      const sv = await E(() => ({ cps: Object.keys(window.ISNAD.save.data.cps || {}), cp: window.ISNAD.save.data.cp }));
      si(ch && sv.cps.includes('abubakr') && !sv.cps.some(k => /^idris:/.test(k)) && !sv.cp, `${nom} · « La Chaîne », depuis la halte : la Chaîne s’ouvre ; Abû Bakr attend, rangé ; les quartiers ne le sont pas`, `${nom} · la Chaîne depuis la halte : ${JSON.stringify({ ch, sv })}`);
      await P.waitForTimeout(300); await P.screenshot({ path: path.join(out, `chaine-${w}x${h}.png`) });
      await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); });
      const la = await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers' && window.ISNAD.world.map && window.ISNAD.world.map.id === 'archives', 15000)); await avancer(P);
      const pres = await E(() => window.__t.pres());
      si(la && pres > 0 && pres < 40, `${nom} · « La Cité-Miroir », au pied de la Chaîne : Idris paraît dans la vieille mosquée, à ${pres} points de Maître Yûnus`, `${nom} · la Cité-Miroir depuis la Chaîne : ${JSON.stringify({ la, pres })}`, 'BLOQUÉ');
      const m = await parler();
      const i = m.c ? m.c.opts.findIndex(o => /La Chaîne/.test(o)) : -1;
      for (let k = 0; k < i; k++) { await P.keyboard.press('ArrowDown'); await P.waitForTimeout(120); }
      await P.keyboard.press('Enter');
      const ch2 = await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 15000));
      si(i >= 0 && ch2, `${nom} · Maître Yûnus : « La Chaîne, au fond de la mosquée » mène à la Chaîne`, `${nom} · la Chaîne par Maître Yûnus : ${JSON.stringify({ i, ch2, c: m.c })}`, 'BLOQUÉ');
    }
    // ---------- 10. la partie garde `cite`, et voyage avec ----------
    {
      const r = await E(() => { const I = window.ISNAD, c0 = JSON.stringify(I.save.data.cite), t = I.save.exporter(), l = I.save.lireTexte(t); if (!l.ok) return { ok: false, e: l.erreur };
        const ab = JSON.parse(t); ab.partie.cite = { arrivees: -1 }; const l2 = I.save.lireTexte(JSON.stringify(ab)); return { ok: true, c0, c1: JSON.stringify(l.partie.cite), refus: !l2.ok }; });
      const c = r.ok ? JSON.parse(r.c0) : {};
      si(r.ok && r.c0 === r.c1 && c.arrivees >= 3 && c.rappels >= 2 && c.yunus >= 3 && c.vue === true && c.lecon === true && r.refus, `${nom} · la partie garde « cite » (${r.c0}), l’exporte à l’identique, refuse un compte abîmé`, `${nom} · la partie et « cite » : ${JSON.stringify(r)}`);
    }
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => nom + ' · ' + e));
    await T.ctx.close();
  }
  // ---------- 11. avant le prologue, la Chaîne n'offre pas les quartiers ----------
  if (!SEUL) {
    const T = await telephone(browser, 390, 844), E = (fn, a) => T.p.evaluate(fn, a);
    const r = await E(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.ui.showChain(); return new Promise(res => setTimeout(() => res(window.__t.piedNoms()), 500)); });
    si(!r.includes('La Cité-Miroir'), 'avant le prologue, la Chaîne n’offre pas « La Cité-Miroir »', 'avant le prologue, la Chaîne offre déjà les quartiers : ' + JSON.stringify(r));
    toutesErreurs = toutesErreurs.concat(T.errors); await T.ctx.close();
  }
  // ---------- 12. le dessin des voitures, à côté des personnages, sur un téléphone, dans les trois réglages ----------
  for (const [qs, nomD] of SEUL ? [] : [['', 'fin'], ['?def=2l', 'fin-adouci'], ['?def=1', 'origine']]) {
    const T = await telephone(browser, 390, 844, qs), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    await E(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.cite.course.salim = 2; I.save.auto('essai'); });
    await P.reload(); await P.waitForTimeout(1600); await preparer(P);
    await E(() => { const b = [...document.querySelectorAll('#title .vmenu button')].find(b => /^Continuer/.test(b.textContent)); if (b) b.click(); });
    await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000));
    await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); });
    await refugeAuxQuartiers(P);
    // sur le trottoir du nord, entre deux voitures garées, près d'un passant ; on attend qu'une voiture passe dans l'image
    await E(() => { window.__t.endormir(); window.__t.poser(19 * 16 + 8, 9 * 16 + 13); });
    const vu = await E(() => window.__t.attendre(() => window.ISNAD.trafic.voitures.some(v => Math.abs(v.x - 312) < 70 && v.y < 300), 30000));
    await P.screenshot({ path: path.join(out, `voitures-dessin-${nomD}-390x844.png`) });
    await E(() => { const W = window.ISNAD.world, n = W.npcs.find(x => x.id === 'q_passante'); window.__t.poser(n.x + 20, n.y); W.player.dir = 1; }); await P.waitForTimeout(400);
    await P.screenshot({ path: path.join(out, `passant-triste-${nomD}-390x844.png`) });
    si(vu, `le dessin « ${nomD} » : une voiture qui passe et des voitures garées, à côté des personnages (captures)`, `le dessin « ${nomD} » : aucune voiture n’est passée dans l’image`);
    // 2.27 : la moto de Sâlim, garée, Sâlim et Idris à côté ; puis vue de dessus, Sâlim et Idris dessus, dans un virage
    await E(() => { const W = window.ISNAD.world, s = W.npcs.find(x => x.id === 'salim_q'); window.__t.poser(s.x + 20, s.y + 2); W.player.dir = 1; }); await P.waitForTimeout(400);
    await P.screenshot({ path: path.join(out, `moto-dessin-${nomD}-390x844.png`) });
    await E(() => { const I = window.ISNAD; I.debug.pilote = {}; I.circuit.balade(false); });
    let mo = false; for (let i = 0; i < 60 && !mo; i++) { mo = await E(() => { const K = window.ISNAD.circuit.K; return !!K && K.mode === 'course' && !!K.signe && K.bienPenche; }); if (!mo) { if (await E(() => window.__t.visible('#dialog'))) { await E(() => window.__t.lu()); await P.keyboard.press('Enter'); } await P.waitForTimeout(250); } }
    await P.waitForTimeout(150); await P.screenshot({ path: path.join(out, `moto-dessus-${nomD}-390x844.png`) });
    await E(() => { window.ISNAD.debug.accelCourse = 6; }); await E(() => window.__t.attendre(() => !window.ISNAD.circuit.K, 40000));
    for (let i = 0; i < 20; i++) { if (!(await E(() => window.__t.visible('#dialog')))) break; await E(() => window.__t.lu()); await P.keyboard.press('Enter'); await P.waitForTimeout(200); }
    await E(() => { window.ISNAD.debug.pilote = null; window.ISNAD.debug.accelCourse = 0; });
    si(mo, `le dessin « ${nomD} » : la moto de Sâlim garée, à côté de lui et d’Idris, puis vue de dessus dans un virage (captures)`, `le dessin « ${nomD} » : le tour de moto ne s’est pas montré`, 'ABSENT');
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => nomD + ' · ' + e)); await T.ctx.close();
  }
  // ---------- 13. quel que soit l'avancement (le décideur, 21 novembre : « Les activités de la cité miroir sont omniprésents dès
  //               le début […] quelque soit l'avancement dans la saga ») : « Revenir en 2084 », depuis la halte de chacun des cinq
  //               récits et d'une veillée, aucun maillon achevé, mène aux quartiers, à côté de Maître Yûnus ----------
  // (les maillons se suivent sur la Chaîne, D211 : l'outil ouvre lui-même chaque récit à son premier chapitre ; ce qu'il éprouve,
  // c'est la halte de ce récit, par son vrai bouton)
  if (!NIV1) {
    const T = await telephone(browser, 390, 844), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    await E(() => { const I = window.ISNAD; I.speed = 40; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.rebonds = { x_descendu: true, x_enfant: true, x_avis: true }; });
    const vus = [];
    for (const [sid, nomR] of [['abubakr', 'Abû Bakr'], ['umar', '’Umar'], ['khalid', 'Khâlid'], ['uthman', '’Uthmân'], ['ali', '’Alî'], ['caid', 'la première veillée']]) {
      const joue = await E(async sid => { const I = window.ISNAD, W = I.world, T = window.__t; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
        W.roster = {}; W.saga = null; W.startChapter(sid, 0); return T.jusqua(1); }, sid);
      const noms = await E(() => window.__t.halte());
      const cite = await E(() => { const b = [...document.querySelectorAll('#menu .side button')].find(x => x.textContent.trim() === 'Revenir en 2084'); if (!b) return null; b.click(); return (document.querySelector('#menu .pane') || {}).textContent || ''; });
      if (!joue || cite === null) { ko(`INACCESSIBLE ${nomR} : la halte n’offre pas « Revenir en 2084 » (${JSON.stringify({ joue, noms })})`); continue; }
      const la = await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers' && window.ISNAD.world.map && window.ISNAD.world.map.id === 'archives', 30000));
      const r = await avancer(P), e = await E(() => ({ pres: window.__t.pres(), faits: Object.keys(window.ISNAD.save.data.sagas).filter(k => window.ISNAD.save.data.sagas[k].done), cps: Object.keys(window.ISNAD.save.data.cps || {}) }));
      if (la && r === 'calme' && e.pres > 0 && e.pres < 40 && !e.faits.length) vus.push(nomR);
      else ko(`BLOQUÉ ${nomR} : « Revenir en 2084 » ne mène pas à la vieille mosquée, à côté de Maître Yûnus : ${JSON.stringify({ la, r, e })}`);
    }
    si(vus.length === 6, `« Revenir en 2084 », depuis la halte de chaque récit (${vus.join(', ')}), aucun maillon achevé : la vieille mosquée, à côté de Maître Yûnus`, `« Revenir en 2084 » n’a mené à la vieille mosquée que depuis : ${vus.join(', ')}`, 'INACCESSIBLE');
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'avancement · ' + e)); await T.ctx.close();
  }
  // ---------- 14. au niveau 1, seul : chaque chimère des rues se vainc à la seule touche A (Frapper, sur la cible désignée
  //               d'emblée), dans une partie neuve qui n'a reçu que ses premiers outils ; et l'on peut en fuir ----------
  if (!COURSE && !ACTI && !PASS) {
    const T = await telephone(browser, 390, 844), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    await E(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.rebonds = { x_descendu: true, x_enfant: true, x_avis: true };
      I.lecons.ouvrir(); ['marcher', 'parler', 'aide', 'halte'].forEach(id => { I.lecons.recevoir(id); I.lecons.sequence(); }); I.save.auto('essai'); });
    await P.reload(); await P.waitForTimeout(1600); await preparer(P);
    await E(() => { const b = [...document.querySelectorAll('#title .vmenu button')].find(b => /^Continuer/.test(b.textContent)); if (b) b.click(); });
    await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000));
    const va = await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); return !!b; });
    const la = va && await refugeAuxQuartiers(P);
    if (!la) ko('BLOQUÉ au niveau 1 : la partie neuve n’arrive pas dans les quartiers par « La Cité-Miroir »');
    await E(() => { const I = window.ISNAD, W = I.world, h = W.hero('idris'), T = window.__t; h.lvl = 1; h.xp = 0; T.endormir(); T.defaites = 0;
      const oc = I.script.card; I.script.card = function (cls) { if (cls === 'defeat') T.defaites++; return oc.apply(this, arguments); };
      const ob = I.battle.start; I.battle.start = async function () { const r = await ob.apply(this, arguments); T.res = r; return r; }; });
    // une chimère des rues, d'un nom donné, posée tout contre Idris : son contact ouvre le combat (rodeurs.js, ticRues)
    const rejoindre = id => E(id => { const I = window.ISNAD, W = I.world, f0 = W.foes.find(f => f.rue), T = window.__t; W.healAll(); T.res = null; T.defaites = 0;
      W.foes.push(Object.assign({}, f0, { id: 'essai_' + id + '_' + W.foes.length, group: [id], cle: null, done: false, enCombat: false, placed: true, x: W.player.x + 8, y: W.player.y }));
      return T.attendre(() => I.battle.active, 8000); }, id);
    // (quand elle n'ouvre pas de combat : où en est le monde, et où est-elle passée)
    const etatRue = () => E(() => { const I = window.ISNAD, W = I.world, S = I.script, R = I.rodeurs, p = W.player, T = window.__t, f = W.foes.filter(g => /^essai_/.test(g.id)).pop();
      return { calme: T.calme(), scene: I.scene === W, busy: !!S.busy, depth: S.depth, lock: !!W.lock, bataille: !!I.battle.active, menu: !!I.ui.menuOpen, choix: T.choix(), dialogue: T.dialogue().slice(0, 60), carte: W.map && W.map.id, auto: !!I.debug.auto,
        fuite: !!R.fuite, intouchable: R.intouchable(), journal: I.cite.journal.slice(-4), joueur: [Math.round(p.x), Math.round(p.y)],
        chimere: f ? { id: f.id, d: Math.round(Math.hypot(f.x - p.x, f.y - p.y)), done: f.done, enCombat: f.enCombat, placed: f.placed, map: f.map, sonne: f.sonne, chasse: f.chasse } : null }; });
    // après un combat des rues, le rappel de la prière, puis « Plus tard » (B). On attend que le jeu les ait notés (cite.journal),
    // et non le seul calme : le monde peut sembler calme un instant avant que le rappel ne paraisse, surtout sur une machine chargée
    // (la ligne restait alors à l'écran, et plus rien ne pouvait ouvrir de combat)
    const journal = () => E(() => window.ISNAD.cite.journal.length);
    const apresCombat = async (n0, calme) => { const t0 = Date.now();
      while (Date.now() - t0 < 60000) {
        const r = await avancer(P, 30); if (r === 'choix') { await P.waitForTimeout(400); await P.keyboard.press('Escape'); await P.waitForTimeout(300); continue; }
        if (await E(([n0, calme]) => window.ISNAD.cite.journal.slice(n0).some(j => j.quoi === 'plus-tard' || j.quoi === 'revoir') && (!calme || window.__t.calme()), [n0, calme])) return true;
        await P.waitForTimeout(200); }
      return false; };
    const bilan = [];
    for (const id of await E(() => Object.keys(window.ISNAD.D.CITE.rodent))) {
      const n0 = await journal();
      if (!(await rejoindre(id))) { ko(`BLOQUÉ au niveau 1 : la chimère « ${id} » n’ouvre pas de combat : ${JSON.stringify(await etatRue())}`); continue; }
      await P.waitForTimeout(600);
      const niv = await E(() => { const C = window.ISNAD.battle.contexte(); return C ? C.all.filter(e => e.side === 'foe').map(e => e.lvl) : []; });
      const t0 = Date.now();   // A, encore et encore : la commande du dessus (Frapper) s'arme, puis agit sur la cible désignée
      while (Date.now() - t0 < 180000 && await E(() => window.ISNAD.battle.active)) { await P.keyboard.press('Enter'); await P.waitForTimeout(260); }
      if (!(await apresCombat(n0, true))) ko(`BLOQUÉ au niveau 1 : après le combat contre « ${id} », le rappel de la prière ne passe pas : ${JSON.stringify(await etatRue())}`);   // le rappel ; « Plus tard » (B)
      const b = await E(() => { const I = window.ISNAD, L = I.battle.last || {}, T = window.__t; return { res: T.res, defaites: T.defaites, tours: L.turns, pv: Math.round((L.minHp === undefined ? 1 : L.minHp) * 100), lvl: I.world.hero('idris').lvl, groupe: I.world.party.join('+') }; });
      b.id = id; b.niv = niv; bilan.push(b);
      si(b.res === 'win' && b.defaites === 0 && niv.length && niv.every(n => n === 1) && b.groupe === 'idris',
        `au niveau 1, seul, à la seule touche A : « ${id} » (niveau ${niv.join('/')}) vaincue en ${b.tours} tours, Constance au plus bas ${b.pv} %, sans défaite`,
        `au niveau 1, seul : « ${id} » — ${JSON.stringify(b)}`);
      await E(() => { const I = window.ISNAD, W = I.world, h = W.hero('idris'); h.lvl = 1; h.xp = 0; window.__t.endormir(); });   // (la victoire a pu le faire monter : on le remet au niveau 1)
    }
    // la fuite, au niveau 1 : « Fuir » (l'outil « Se protéger » reçu), par son vrai bouton ; la chimère poursuit
    await E(() => { window.ISNAD.lecons.recevoir('garde'); window.ISNAD.lecons.sequence(); });
    const n0 = await journal();
    if (await rejoindre('egoisme')) {
      // les commandes du premier tour (un mot qui attend, en bas — la leçon de l'outil — se passe d'un A, comme le ferait le joueur)
      let vu = false; for (let i = 0; i < 120 && !vu; i++) { const r = await E(() => { const c = document.querySelector('#battle .cmd'), b = document.querySelector('#battle .banner'); if (b && !b.hidden && b.classList.contains('attend')) return 'attend'; return c && c.querySelector('.mlist.main .mi') && !c.querySelector('.mhint') && b.hidden ? 'cmd' : ''; });
        if (r === 'cmd') { await P.waitForTimeout(350); vu = true; } else { if (r === 'attend') await P.keyboard.press('Enter'); await P.waitForTimeout(150); } }
      const clic = vu && await E(() => { const b = [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].find(x => !x.hidden && /Fuir/.test(x.textContent)); if (b) b.click(); return !!b; });
      const fini = clic && await E(() => window.__t.attendre(() => !window.ISNAD.battle.active, 20000));
      const passe = fini && await apresCombat(n0, false);   // (la chimère fuie poursuit : le calme ne dure pas)
      const f = await E(() => ({ res: window.__t.res, carte: window.ISNAD.world.map && window.ISNAD.world.map.id, poursuit: window.ISNAD.world.foes.some(f => f.rue && !f.done && window.ISNAD.rodeurs.poursuit(f)) }));
      si(fini && passe && f.res === 'fuite' && f.carte === 'quartiers', `au niveau 1, « Fuir » quitte le combat : Idris est rendu aux quartiers${f.poursuit ? ', la chimère à ses trousses' : ''}`, `au niveau 1, la fuite : ${JSON.stringify({ vu, clic, fini, passe, f })}`, 'INACCESSIBLE');
      await E(() => window.__t.endormir());
    } else ko(`BLOQUÉ au niveau 1 : la chimère de la fuite n’ouvre pas de combat : ${JSON.stringify(await etatRue())}`);
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'niveau 1 · ' + e)); await T.ctx.close();
  }
  // ---------- 15. 2.27 (D216) : Sâlim et la course, en hauteur (le joystick) et en largeur (le clavier) ----------
  for (const [w, h] of (!SEUL || COURSE) ? [[390, 844], [844, 390]].filter(orient) : []) {   // (ORIENT=haut|large : une seule)
    const nom = w + '×' + h, haut = h > w, mode = haut ? 'joy' : 'clavier', T = await telephone(browser, w, h), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    const PARI =/(^|[^a-zà-ÿ])(pari|paris|parier|parie|parions|pariez|parié|mise|mises|miser|misez|misé|enjeux?|loteries?|casino|jeux? de hasard|double ou rien|cotes?|gager)(?![a-zà-ÿ])/i;
    // une partie neuve (« Nouvelle partie ») qui n'a reçu que ses premiers outils : Sâlim y dira la leçon des virages
    await E(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.rebonds = { x_descendu: true, x_enfant: true, x_avis: true };
      I.lecons.ouvrir(); ['marcher', 'parler', 'aide', 'halte'].forEach(id => { I.lecons.recevoir(id); I.lecons.sequence(); }); I.save.auto('essai'); });
    await P.reload(); await P.waitForTimeout(1600); await preparer(P);
    await E(() => { const I = window.ISNAD, T = window.__t;
      T.offerts = []; { const om = I.script.menuPick; I.script.menuPick = function (q, opts) { T.offerts.push({ q: typeof q === 'string' ? q : '', opts: (opts || []).map(o => (o.t || String(o.html || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()) }); return om.apply(this, arguments); }; }
      // mener par les vrais boutons : le joystick et A (pointeurs), ou les flèches et Entrée (clavier) ; le cap et A, c'est le pilote d'essai qui les choisit
      T.mener = (mode, o) => { const CI = I.circuit, joy = document.querySelector('#pad .joy'), A = document.querySelector('#pad .a'); let aBas = false, jBas = false; const tenues = new Set(); T._mene = true; T.menes = { images: 0 };
        const pt = (el, type, x, y, id) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: id, pointerType: 'touch', isPrimary: id === 7, clientX: x || 0, clientY: y || 0 }));
        const cle = (code, bas) => window.dispatchEvent(new KeyboardEvent(bas ? 'keydown' : 'keyup', { code, bubbles: true, cancelable: true }));
        const lacher = () => { if (jBas) { pt(joy, 'pointerup', 0, 0, 7); jBas = false; } if (aBas) { if (mode === 'joy') pt(A, 'pointerup', 0, 0, 8); else cle('Enter', false); aBas = false; } tenues.forEach(k => cle(k, false)); tenues.clear(); };
        const pas = () => { const K = CI.K; if (!T._mene || !K || K.mode === 'arrivee' || K.mode === 'podium') { lacher(); T._mene = false; return; }
          let cap = null, gaz = false; if (!K.pause && (K.mode === 'course' || K.mode === 'compte')) { const d = K.moto ? CI.piloteMoto(K, o || {}) : CI.pilote(K, o || { adresse: 0.95 }); cap = d.cap; gaz = !!d.gaz; }
          if (mode === 'joy') { if (cap === null) { if (jBas) { pt(joy, 'pointerup', 0, 0, 7); jBas = false; } } else { const r = joy.getBoundingClientRect(), R = r.width / 2, x = r.left + R + Math.cos(cap) * R * 0.8, y = r.top + R + Math.sin(cap) * R * 0.8; pt(joy, jBas ? 'pointermove' : 'pointerdown', x, y, 7); jBas = true; }
            if (gaz !== aBas) { pt(A, gaz ? 'pointerdown' : 'pointerup', 0, 0, 8); aBas = gaz; } }
          else { const veut = new Set(); if (cap !== null) { const s8 = Math.round(cap / (Math.PI / 4)), dx = Math.round(Math.cos(s8 * Math.PI / 4)), dy = Math.round(Math.sin(s8 * Math.PI / 4)); if (dx > 0) veut.add('ArrowRight'); if (dx < 0) veut.add('ArrowLeft'); if (dy > 0) veut.add('ArrowDown'); if (dy < 0) veut.add('ArrowUp'); }
            ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach(k => { if (veut.has(k) && !tenues.has(k)) { cle(k, true); tenues.add(k); } else if (!veut.has(k) && tenues.has(k)) { cle(k, false); tenues.delete(k); } });
            if (gaz !== aBas) { cle('Enter', gaz); aBas = gaz; } }
          T.menes.images++; requestAnimationFrame(pas); };
        requestAnimationFrame(pas); };
      // la manette recouvre-t-elle ce qui s'écrit sur la course ?
      T.recouvreCourse = () => { const pads = [...document.querySelectorAll('#pad .joy, #pad .a, #pad .b')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0), L = [];
        document.querySelectorAll('#course .tableau, #course .rangs, #course .signe, #course .bilan').forEach(e => { if (e.hidden || getComputedStyle(e).display === 'none') return; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
          if (pads.some(p => r.left < p.right - 1 && r.right > p.left + 1 && r.top < p.bottom - 1 && r.bottom > p.top + 1)) L.push(e.className); });
        return { L, efface: document.body.classList.contains('pad-efface'), sous: I.ui.padRecouvre() }; };
      T.textesCourse = () => (document.querySelector('#course') || {}).textContent || '';
      T.menu = () => T.choix();
    });
    // lire ce qui se dit, jusqu'à ce que la course commence (ou qu'un choix s'ouvre)
    const jusquACourse = async () => { for (let i = 0; i < 200; i++) { const e = await E(() => { const I = window.ISNAD, K = I.circuit.K; if (K && I.scene === I.circuit.scene) return 'course'; if (window.__t.visible('#choice')) return 'choix'; return window.__t.visible('#dialog') ? 'lire' : ''; });
        if (e === 'course' || e === 'choix') return e; if (e === 'lire') { await E(() => window.__t.lu()); await P.keyboard.press('Enter'); } await P.waitForTimeout(150); } return 'bloque'; };
    const finCourse = ms => E(ms => window.__t.attendre(() => { const K = window.ISNAD.circuit.K; return !K || K.mode === 'podium'; }, ms), ms);
    const auMonde = async () => { for (let i = 0; i < 160; i++) { const e = await E(() => { const I = window.ISNAD; return !I.circuit.K && I.scene === I.world ? (window.__t.calme() ? 'calme' : window.__t.visible('#choice') ? 'choix' : window.__t.visible('#dialog') ? 'lire' : '') : I.circuit.K && I.circuit.K.mode === 'podium' ? 'podium' : ''; });
        if (e === 'calme' || e === 'choix') return e; if (e === 'lire' || e === 'podium') { if (e === 'lire') await E(() => window.__t.lu()); await P.keyboard.press('Enter'); } await P.waitForTimeout(170); } return 'bloque'; };
    await E(() => { const b = [...document.querySelectorAll('#title .vmenu button')].find(b => /^Continuer/.test(b.textContent)); if (b) b.click(); });
    await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000));
    await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); });
    const la = await refugeAuxQuartiers(P);
    if (!la) { ko(`BLOQUÉ ${nom} · la partie neuve n’arrive pas dans les quartiers`); toutesErreurs = toutesErreurs.concat(T.errors); await T.ctx.close(); continue; }
    await E(() => window.__t.endormir());
    // a. avant le tour de moto : l'organisateur ne fait pas courir (on lui parle hors du passage de Sâlim)
    {
      const r = await E(async () => { const I = window.ISNAD, W = I.world, o = W.npcs.find(n => n.id === 'q_organisateur'); window.__t.poser(o.x + 20, o.y); W.player.dir = 1; return { salim: I.save.data.cite.course.salim, vu: !W.npcs.find(n => n.id === 'salim_q').hidden }; });
      await P.waitForTimeout(250); await P.keyboard.press('Enter'); await P.waitForTimeout(300);
      const d = await E(() => window.__t.lu()), Tx = await E(() => window.ISNAD.sagas.idris.cite.course.organisateur.avant); await avancer(P);
      const menu = await E(() => window.__t.offerts.length);
      si(r.salim === 0 && !r.vu && d.indexOf(Tx.slice(0, 30)) >= 0 && !menu, `${nom} · avant le tour de moto, Sâlim n’est pas là et l’organisateur dit : « ${d.slice(0, 60)}… » (aucun circuit)`, `${nom} · l’organisateur avant Sâlim : ${JSON.stringify({ r, d, menu })}`);
    }
    // b. on marche vers le circuit (le clavier) : Sâlim arrive en moto
    {
      await E(() => { const W = window.ISNAD.world, s = W.spotPx('circuit'); window.__t.poser(s[0] + 70, s[1] - 26); });
      const d = await E(() => { const W = window.ISNAD.world, s = W.spotPx('circuit'); return window.__t.marcher(s[0], s[1] - 18, 15000); });
      const vient = await E(() => window.__t.attendre(() => window.ISNAD.circuit.journal.some(j => j.quoi === 'arrivee'), 8000));
      await E(() => window.__t.attendre(() => !window.ISNAD.world.npcs.find(n => n.id === 'salim_q').hidden, 8000)); await P.waitForTimeout(500);
      await P.screenshot({ path: path.join(out, `salim-moto-${w}x${h}.png`) });
      const e = await E(() => { const I = window.ISNAD, W = I.world, s = W.npcs.find(n => n.id === 'salim_q'), m = I.trafic.garees.find(v => v.m === 'moto'), p = W.player; return { salim: !!s && !s.hidden, d: s ? Math.round(Math.hypot(s.x - p.x, s.y - p.y)) : -1, moto: !!m && !m.roule, dm: m ? Math.round(Math.hypot(m.x - p.x, m.y - p.y)) : -1, dans: m ? (() => { const f = I.trafic.pied(m); return f[0] < p.x + 4 && p.x - 4 < f[2] && f[1] < p.y && p.y - 5 < f[3]; })() : false }; });
      si(vient && e.salim && e.moto && e.d < 90 && e.dm < 110 && !e.dans, `${nom} · au premier passage au circuit, Sâlim arrive en moto : il est à ${e.d} points d’Idris, sa moto garée à ${e.dm} points, hors de son chemin`, `${nom} · l’arrivée de Sâlim : ${JSON.stringify({ d, vient, e })}`, 'ABSENT');
      const r = await avancer(P); const c = await E(() => window.__t.choix());
      si(r === 'choix' && c && c.opts.length === 2 && /Monter derrière Sâlim/.test(c.opts[0]) && /Pas maintenant/.test(c.opts[1]), `${nom} · « ${c && c.prompt} » : ${c && c.opts.join(' / ')}`, `${nom} · l’offre de Sâlim : ${JSON.stringify({ r, c })}`);
      await P.screenshot({ path: path.join(out, `salim-offre-${w}x${h}.png`) });
      await P.waitForTimeout(420); await P.keyboard.press('Enter');   // (une liste n'accepte rien pendant un tiers de seconde)
    }
    // c. la leçon de l'outil « virages », dite par Sâlim ; puis le tour de moto, par les vrais boutons (joystick, ou flèches)
    {
      const lecon = await E(() => window.__t.attendre(() => window.ISNAD.circuit.journal.some(j => j.quoi === 'lecon'), 8000));
      const d = await E(() => window.__t.lu()), L = await E(() => { const t = window.ISNAD.sagas.coeur.lecons.virages; return [t.doigt, t.clavier]; });
      const recu = await E(() => window.ISNAD.lecons.recu('virages'));
      si(lecon && recu && L.some(t => d.indexOf(t.replace(/\*/g, '').slice(0, 24)) >= 0), `${nom} · Sâlim dit la leçon de l’outil « Prendre les virages » : « ${d.slice(0, 70)}… »`, `${nom} · la leçon des virages : ${JSON.stringify({ lecon, recu, d })}`);
      const rr = await jusquACourse();
      if (rr !== 'course') ko(`BLOQUÉ ${nom} · le tour de moto ne commence pas (${rr})`);
      else {
        await E(m => window.__t.mener(m, {}), mode);
        await E(() => window.__t.attendre(() => { const K = window.ISNAD.circuit.K; return K && K.mode === 'course' && K.signe && K.bienPenche; }, 20000));
        await P.waitForTimeout(120); await P.screenshot({ path: path.join(out, `moto-penche-${w}x${h}.png`) });
        const rc = await E(() => window.__t.recouvreCourse());
        await E(() => window.__t.attendre(() => window.ISNAD.circuit.journal.some(x => x.quoi === 'balade'), 70000));
        const b = await E(() => { const j = window.ISNAD.circuit.journal.filter(x => x.quoi === 'balade').pop(); return j || null; }), men = await E(() => window.__t.menes);
        si(b && b.bien >= b.total - 1 && men.images > 60, `${nom} · la moto menée ${mode === 'joy' ? 'au joystick' : 'aux flèches'} : ${b && b.bien} virages sur ${b && b.total} bien pris, en se penchant vers l’intérieur`, `${nom} · le tour de moto : ${JSON.stringify({ b, men })}`);
        si(!rc.L.length && !rc.efface, `${nom} · pendant le tour, la manette ne recouvre ni le tableau ni le signe`, `${nom} · la manette sur la course : ${JSON.stringify(rc)}`, 'RECOUVERT');
        const r2 = await auMonde(); const e = await E(() => ({ salim: window.ISNAD.save.data.cite.course.salim, dits: window.ISNAD.circuit.journal.map(j => j.quoi).join(',') }));
        si(r2 === 'calme' && e.salim === 2, `${nom} · le tour fini, Sâlim parle de l’organisateur et de ses cinq circuits ; la partie garde que Sâlim a emmené Idris`, `${nom} · après le tour : ${JSON.stringify({ r2, e })}`);
      }
    }
    // d. en hauteur : un second tour, sans se pencher — la moto ralentit (sans chute ni blessure)
    if (haut) {
      await E(() => { const W = window.ISNAD.world, s = W.npcs.find(n => n.id === 'salim_q'); window.__t.poser(s.x + 18, s.y); W.player.dir = 1; }); await P.waitForTimeout(250); await P.keyboard.press('Enter');
      const r = await avancer(P); const c = await E(() => window.__t.choix());
      if (r === 'choix' && c && /Refaire un tour/.test(c.opts[0])) { await P.waitForTimeout(420); await P.keyboard.press('Enter'); const rr = await jusquACourse();
        if (rr === 'course') await E(() => window.__t.attendre(() => window.ISNAD.circuit.journal.filter(x => x.quoi === 'balade').length >= 2, 70000));
        const L = await E(() => window.ISNAD.circuit.journal.filter(x => x.quoi === 'balade'));
        const t = await E(() => window.ISNAD.circuit.journal.filter(x => x.quoi === 'partez' && x.moto).length);
        si(L.length >= 2 && L[1].bien === 0 && t >= 2, `${nom} · un second tour, sans se pencher : aucun virage bien pris, la moto ralentit à chacun (et rien d’autre)`, `${nom} · le second tour : ${JSON.stringify(L)} ${JSON.stringify(await E(() => { const I = window.ISNAD, K = I.circuit.K; return K ? { t: K.t, prog: K.prog, v: K.v, pause: K.pause, mode: K.mode, held: I.input.held, joy: I.input.joyAngle, a: I.input.aTenu, pil: I.debug.pilote, acc: I.debug.accelCourse, scene: I.scene === I.circuit.scene } : null; }))}`);
        await auMonde();
      } else ko(`ÉCART ${nom} · Sâlim ne propose pas de refaire un tour : ${JSON.stringify({ r, c })}`);
    }
    // e. les circuits : l'organisateur ; le premier ouvert, les autres scellés ; chacun plus long ou plus serré que le précédent
    const etatCourse = () => E(() => { const I = window.ISNAD, W = I.world, S = I.script; return { scene: I.scene === W ? 'monde' : I.scene === I.circuit.scene ? 'course' : '?', K: I.circuit.K && I.circuit.K.mode, busy: S.busy, depth: S.depth, lock: W.lock, occupe: I.circuit.occupe, dialogue: window.__t.dialogue().slice(0, 50), choix: window.__t.visible('#choice'), j: I.circuit.journal.slice(-3) }; });
    const organisateur = async () => { await auMonde(); await E(() => { const I = window.ISNAD, W = I.world, o = W.npcs.find(n => n.id === 'q_organisateur'); window.__t.poser(o.x + 20, o.y); W.player.dir = 1; }); await P.waitForTimeout(250); await P.keyboard.press('Enter'); const r = await avancer(P);
      const c = await E(() => { const c = window.__t.choix(); if (!c) return null; c.fermes = [...document.querySelectorAll('#choice .opt')].map(b => b.classList.contains('locked')); return c; }); return { r, c, etat: c ? null : await etatCourse() }; };
    const choisir = async i => { await P.waitForTimeout(420); for (let k = 0; k < i; k++) { await P.keyboard.press('ArrowDown'); await P.waitForTimeout(110); } await P.keyboard.press('Enter'); };
    {
      const m = await organisateur(), c = m.c;
      const ok1 = c && c.opts.length === 6 && !c.fermes[0] && c.fermes.slice(1, 5).every(Boolean) && c.opts.slice(1, 5).every(o => /Scellé/.test(o));
      si(ok1, `${nom} · l’organisateur : « ${c && c.prompt} » — le premier circuit ouvert, les quatre autres scellés (« ${c && c.opts[1].slice(0, 50)}… »)`, `${nom} · le menu des circuits : ${JSON.stringify(m)}`, 'ÉCART');
      await P.screenshot({ path: path.join(out, `circuits-scelles-${w}x${h}.png`) });
      await choisir(1); await P.waitForTimeout(500);   // un circuit scellé : rien ne s'ouvre
      const encore = await E(() => window.__t.visible('#choice') && !window.ISNAD.circuit.K);
      si(encore, `${nom} · un circuit scellé, choisi, ne s’ouvre pas`, `${nom} · un circuit scellé s’est ouvert`);
      await P.keyboard.press('ArrowUp'); await P.waitForTimeout(420); await P.keyboard.press('Enter');
      const geo = await E(() => { const I = window.ISNAD, D = I.D; return D.CIRCUITS.map(d => { const tr = I.circuit.geometrie(d); return { L: Math.round(tr.L), tours: d.tours, total: Math.round(tr.L * d.tours), hw: d.large, r: Math.min(...d.trace.map(p => p[2])), adv: d.adversaires.length, temps: d.temps, nuit: !!d.nuit, viaduc: !!d.viaduc }; }); });
      const croit = geo.every((g, i) => !i || g.L > geo[i - 1].L || g.total > geo[i - 1].total || g.hw < geo[i - 1].hw || g.r < geo[i - 1].r);
      si(croit && geo[0].adv === 0 && geo[0].temps > 0 && geo[3].viaduc && geo[3].temps > 0 && geo[4].nuit, `${nom} · cinq circuits, chacun plus long ou plus serré que le précédent : ${geo.map((g, i) => `${i + 1}. ${g.L} pts × ${g.tours}, demi-largeur ${g.hw}, rayon ${g.r}${g.adv ? ', ' + g.adv + ' adversaire' + (g.adv > 1 ? 's' : '') : ''}${g.temps ? ', à battre' : ''}${g.viaduc ? ', viaduc' : ''}${g.nuit ? ', de nuit' : ''}`).join(' · ')}`, `${nom} · les circuits : ${JSON.stringify(geo)}`);
    }
    // f. le premier circuit, par les vrais boutons, jusqu'à l'arrivée ; la prime ; le circuit suivant s'ouvre
    const d0 = await E(() => window.ISNAD.trade.dirhams());
    {
      const rr = await jusquACourse();
      if (rr !== 'course') ko(`BLOQUÉ ${nom} · la course du premier circuit ne commence pas (${rr})`);
      else {
        await E(() => window.__t.attendre(() => window.ISNAD.circuit.K && window.ISNAD.circuit.K.mode === 'compte', 4000)); await P.waitForTimeout(700);
        await P.screenshot({ path: path.join(out, `course-depart-${w}x${h}.png`) });
        await E(m => window.__t.mener(m, { adresse: 0.92 }), mode);
        await E(() => window.__t.attendre(() => { const K = window.ISNAD.circuit.K; return K && K.mode === 'course' && K.t > 6; }, 20000));
        const rc = await E(() => window.__t.recouvreCourse()); await P.screenshot({ path: path.join(out, `course-1-${w}x${h}.png`) });
        const fin = await finCourse(120000); await P.waitForTimeout(700); await P.screenshot({ path: path.join(out, `podium-1-${w}x${h}.png`) });
        const b = await E(() => ({ bilan: window.__t.textesCourse(), j: window.ISNAD.circuit.journal.filter(x => x.quoi === 'arrivee').pop(), rc: window.__t.recouvreCourse(), men: window.__t.menes, piste: window.ISNAD.audio.wantTrack }));
        si(fin && b.j && b.j.gagne && b.j.prime > 0 && /prime/.test(b.bilan) && b.men.images > 100, `${nom} · le premier circuit mené ${mode === 'joy' ? 'au joystick et à A' : 'aux flèches et à Entrée'} jusqu’à l’arrivée : ${b.j && b.j.temps && b.j.temps.toFixed(1)} s, gagné ; « ${(b.bilan.match(/L’organisateur te remet[^.]*\./) || [''])[0]} »`, `${nom} · le premier circuit : ${JSON.stringify(b)}`, 'BLOQUÉ');
        si(!rc.L.length && !rc.efface && !b.rc.L.length && !b.rc.efface, `${nom} · la manette ne recouvre ni le chrono, ni le tour, ni le bilan`, `${nom} · la manette sur la course : ${JSON.stringify([rc, b.rc])}`, 'RECOUVERT');
        si(!PARI.test(b.bilan), `${nom} · le bilan de la course ne parle d’aucune mise`, `${nom} · une mise dans le bilan : ${b.bilan}`, 'ÉCART');
        await auMonde();
        { const m = await E(() => ({ v: window.ISNAD.audio.wantTrack, l: window.ISNAD.audio.place }));   // (2.45, D236)
          si(b.piste === 'rock' && m.v === m.l && m.l === 'cite', `${nom} · pendant la course, la piste « rock » ; revenu dans les quartiers, celle du lieu (« ${m.l} »)`, `${nom} · la musique de la course : ${JSON.stringify({ course: b.piste, apres: m })}`, 'MUSIQUE'); }
      }
    }
    const d1 = await E(() => window.ISNAD.trade.dirhams()), D0 = await E(() => window.ISNAD.D.CIRCUITS[0].prime);
    si(d1 - d0 === D0, `${nom} · l’organisateur verse ${d1 - d0} dirhams (de ${d0} à ${d1}) — la prime du premier circuit`, `${nom} · la prime : ${d0} → ${d1}, attendu + ${D0}`);
    // g. la pause : B, « Reprendre » (B) ; puis « Quitter la course », qui ne compte rien
    {
      const m = await organisateur(); if (!m.c) ko(`BLOQUÉ ${nom} · l’organisateur ne propose plus rien : ${JSON.stringify(m)}`);
      await choisir(0); const rr = await jusquACourse();
      if (rr === 'course') {
        await E(() => window.__t.attendre(() => window.ISNAD.circuit.K && window.ISNAD.circuit.K.mode === 'course', 6000)); await P.waitForTimeout(300);
        const avant = await E(() => ({ courses: window.ISNAD.save.data.cite.course.courses, d: window.ISNAD.trade.dirhams() }));
        if (haut) await E(() => { const b = document.querySelector('#pad .b'); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 9, pointerType: 'touch' })); b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 9, pointerType: 'touch' })); });
        else await P.keyboard.press('Escape');
        await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 4000)); await P.waitForTimeout(400);
        const c = await E(() => window.__t.choix()), t0 = await E(() => window.ISNAD.circuit.K.t);
        await P.screenshot({ path: path.join(out, `course-pause-${w}x${h}.png`) });
        await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(700);
        const repris = await E(t0 => ({ choix: window.__t.visible('#choice'), pause: window.ISNAD.circuit.K.pause, avance: window.ISNAD.circuit.K.t > t0 }), t0);
        si(c && /pause/.test(c.prompt) && c.opts.length === 2 && /Reprendre/.test(c.opts[0]) && /Quitter la course/.test(c.opts[1]) && !repris.choix && !repris.pause && repris.avance, `${nom} · ${haut ? 'B' : 'Échap'} : « ${c && c.prompt} » ${c && c.opts.join(' / ')} ; B revient d’un cran : la course reprend`, `${nom} · la pause : ${JSON.stringify({ c, repris })}`);
        await E(() => window.ISNAD.input.emit('retour')); await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 4000)); await P.waitForTimeout(400); await choisir(1);
        const parti = await E(() => window.__t.attendre(() => !window.ISNAD.circuit.K && window.ISNAD.scene === window.ISNAD.world, 8000));
        const apres = await E(() => ({ courses: window.ISNAD.save.data.cite.course.courses, d: window.ISNAD.trade.dirhams() }));
        si(parti && apres.courses === avant.courses && apres.d === avant.d, `${nom} · « Quitter la course » : retour aux quartiers ; rien n’est compté, rien n’est versé`, `${nom} · quitter la course : ${JSON.stringify({ parti, avant, apres })}`, 'BLOQUÉ');
        await avancer(P);
      } else ko(`BLOQUÉ ${nom} · la course de la pause ne commence pas (${rr})`);
    }
    // h. les circuits 2 à 5 : chacun s'ouvre quand le précédent est gagné ; le pilote d'essai les court (plus vite que l'horloge)
    {
      const vus = [];
      for (let n = 1; n < 5; n++) {
        const m = await organisateur(), c = m.c;
        const ouvert = c && !c.fermes[n] && c.fermes.slice(n + 1, 5).every(Boolean);
        if (!ouvert) { ko(`ÉCART ${nom} · le circuit ${n + 1} n’est pas ouvert, ou le suivant ne reste pas scellé : ${JSON.stringify(c)}`); await E(() => window.ISNAD.input.emit('retour')); break; }
        await choisir(n); const rr = await jusquACourse(); if (rr !== 'course') { ko(`BLOQUÉ ${nom} · le circuit ${n + 1} ne commence pas`); break; }
        await E(() => { window.ISNAD.debug.pilote = { adresse: 0.98, regard: 0.22 }; window.ISNAD.debug.accelCourse = 3; });
        if (n === 1 || n === 4) { await E(() => window.__t.attendre(() => { const K = window.ISNAD.circuit.K; return K && K.mode === 'course' && K.t > 9; }, 30000)); await P.screenshot({ path: path.join(out, `course-${n + 1}-${w}x${h}.png`) });
          const rc = await E(() => window.__t.recouvreCourse()); si(!rc.L.length && !rc.efface, `${nom} · circuit ${n + 1} : la manette ne recouvre ni le chrono ni le classement`, `${nom} · la manette sur le circuit ${n + 1} : ${JSON.stringify(rc)}`, 'RECOUVERT'); }
        if (n === 3) { await E(() => window.__t.attendre(() => { const I = window.ISNAD, K = I.circuit.K; return K && K.voitures.some(v => I.circuit.niveau(K, v)); }, 60000)); await P.screenshot({ path: path.join(out, `course-viaduc-${w}x${h}.png`) }); }
        const fin = await finCourse(150000); await P.waitForTimeout(500); if (n === 4) await P.screenshot({ path: path.join(out, `podium-5-${w}x${h}.png`) });
        const j = await E(() => window.ISNAD.circuit.journal.filter(x => x.quoi === 'arrivee').pop()), bil = await E(() => window.__t.textesCourse());
        await E(() => { window.ISNAD.debug.pilote = null; window.ISNAD.debug.accelCourse = 0; });
        vus.push({ n: n + 1, gagne: !!(j && j.gagne), rang: j && j.rang, prime: j && j.prime, plafond: /prochaine visite/.test(bil), mise: PARI.test(bil) });
        await auMonde();
      }
      const e = await E(() => ({ g: window.ISNAD.save.data.cite.course.gagnes, primes: window.ISNAD.script.flags._primes, d: window.ISNAD.trade.dirhams(), P: window.ISNAD.D.COURSE.plafond }));
      si(vus.length === 4 && vus.every(v => v.gagne && !v.mise) && e.g.length === 5 && e.g.every(Boolean), `${nom} · les circuits 2 à 5, ouverts l’un après l’autre, gagnés par le pilote d’essai (${vus.map(v => v.n + ' : place ' + v.rang).join(', ')})`, `${nom} · les circuits 2 à 5 : ${JSON.stringify({ vus, e })}`);
      si(e.primes === e.P && vus.some(v => v.plafond), `${nom} · les primes de la visite plafonnées à ${e.P} dirhams (versé : ${e.primes}) ; le bilan le dit`, `${nom} · le plafond : ${JSON.stringify({ vus, e })}`);
    }
    // i. aucune mise offerte : ni dans une réponse, ni dans une question, de toute la visite
    {
      const of = await E(() => window.__t.offerts);
      const fautes = of.filter(m => PARI.test(m.q) || m.opts.some(o => PARI.test(o)));
      si(of.length >= 8 && !fautes.length, `${nom} · ${of.length} listes de choix offertes au circuit (Sâlim, l’organisateur, la pause) : aucune ne propose de parier ni de miser`, `${nom} · une mise offerte : ${JSON.stringify(fautes)}`, 'ÉCART');
    }
    // j. la tribune : des parieurs, chacun seul devant son écran, et Le Pari parmi eux ; sa fiche
    {
      const r = await E(async () => { const I = window.ISNAD, W = I.world, T = window.__t; I.rodeurs.poserRues(); const f = W.foes.find(x => x.rue && !x.done && x.group[0] === 'pari'); if (!f) return null;
        const cas = W.map.g0(f.x, f.y), ps = W.npcs.filter(n => /^q_parieu/.test(n.id)).map(n => ({ id: n.id, pose: n.pose, kind: n.sheet && n.sheet.look && n.sheet.look.kind, cas: W.map.g0(n.x, n.y) }));
        f.cx = null; T.poser(f.x + 44, f.y + 2); W.player.dir = 1; return { cas, ps, x: Math.round(f.x), y: Math.round(f.y) }; });
      await P.waitForTimeout(350); await P.screenshot({ path: path.join(out, `tribune-pari-${w}x${h}.png`) });
      const vu = await E(() => window.__t.attendre(() => window.ISNAD.save.data.codex.includes('idris/le_pari') || window.ISNAD.battle.active, 8000));
      const fiche = await E(() => window.ISNAD.save.data.codex.includes('idris/le_pari'));
      si(r && r.cas === 'qgradin' && r.ps.length === 3 && r.ps.every(p => p.cas === 'qgradin' && ['assis', 'triste', 'accable'].includes(p.pose)) && r.ps.some(p => p.kind === 'femme') && fiche, `${nom} · la tribune : ${r && r.ps.length} parieurs, chacun seul (${r && r.ps.map(p => p.pose).join(', ')}), une femme parmi eux ; Le Pari rôde sur les gradins, et sa fiche entre au Recueil`, `${nom} · la tribune : ${JSON.stringify({ r, vu, fiche })}`, 'ABSENT');
      await E(() => { const W = window.ISNAD.world; W.foes.forEach(f => { if (f.rue) f.done = true; }); });
      if (await E(() => window.ISNAD.battle.active)) { await E(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 20; }); await E(() => window.__t.attendre(() => !window.ISNAD.battle.active, 60000)); }
      await avancer(P, 40); if (await E(() => window.__t.visible('#choice'))) { await E(() => window.ISNAD.input.emit('retour')); await avancer(P, 30); }
    }
    // k. la partie garde la course, s'exporte et se réimporte à l'identique
    {
      const r = await E(() => { const I = window.ISNAD, c0 = JSON.stringify(I.save.data.cite), t = I.save.exporter(), l = I.save.lireTexte(t); if (!l.ok) return { ok: false, e: l.erreur };
        const ab = JSON.parse(t); ab.partie.cite.course = { salim: 7 }; const l2 = I.save.lireTexte(JSON.stringify(ab)); return { ok: true, c0, c1: JSON.stringify(l.partie.cite), refus: !l2.ok }; });
      const c = r.ok ? JSON.parse(r.c0).course : {};
      si(r.ok && r.c0 === r.c1 && c.salim === 2 && c.gagnes.length === 5 && c.temps.filter(Boolean).length === 5 && r.refus, `${nom} · la partie garde la course (${JSON.stringify(c)}), l’exporte à l’identique, refuse une course abîmée`, `${nom} · la partie et la course : ${JSON.stringify(r)}`);
    }
    // l. le dernier maillon (en hauteur) : des retrouvailles, puisqu'Idris a couru avec Sâlim ; la rencontre de toujours, sinon
    if (haut) {
      const ligne = async avec => E(async avec => { const I = window.ISNAD, W = I.world, S = I.script, T = window.__t, dits = [];
        I.save.data.cite.course.salim = avec ? 2 : 0; const or = S.run; S.run = function (ops) { (ops || []).forEach(o => { if (Array.isArray(o) && o[0] === 'say') dits.push(o[2]); if (Array.isArray(o) && o[0] === 'if') dits.push('si ' + o[1] + ' : ' + !!S.flags[o[1]]); }); return or.apply(this, arguments); };
        document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); W.roster = {}; W.saga = null; const ci = I.sagas.idris.chapters.findIndex(c => c.id === 'e1'); W.startChapter('idris', ci);
        await T.jusqua(1); S.run = or; I.debug.auto = false; return dits.filter(d => /archiviste|passager|^si _2084_salim/.test(d)); }, avec);
      const a = await ligne(true), b = await ligne(false);
      si(a.some(d => /si _2084_salim : true/.test(d)) && a.some(d => /Mon passager des virages/.test(d)) && b.some(d => /si _2084_salim : false/.test(d)) && b.some(d => /^Tu es l’archiviste \? Je m’appelle Sâlim/.test(d)), `le dernier maillon : Idris a couru avec Sâlim — « ${(a.find(d => /passager/.test(d)) || '').slice(0, 50)}… » ; sinon, la rencontre de toujours — « ${(b.find(d => /archiviste/.test(d)) || '').slice(0, 50)}… »`, `le dernier maillon, les retrouvailles : ${JSON.stringify({ a, b })}`);
    }
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'course ' + nom + ' · ' + e)); await T.ctx.close();
  }
  // ---------- 16. 2.28 (D217) : les activités des quartiers, payées avec la bourse d'Idris (2.31, D223 : une seule bourse partout) ----------
  const PARI2 = /(^|[^a-zà-ÿ])(pari|paris|parier|parie|parions|pariez|parié|mise|mises|miser|misez|misé|enjeux?|loteries?|casino|jeux? de hasard|double ou rien|cotes?|gager)(?![a-zà-ÿ])/i;
  // les aides de la partie 16 et de la 17, dans la page
  const aides = P => P.evaluate(() => { const I = window.ISNAD, T = window.__t;
    T.offerts = []; { const om = I.script.menuPick; I.script.menuPick = function (q, opts) { T.offerts.push({ q: typeof q === 'string' ? q : '', opts: (opts || []).map(o => (o.t || String(o.html || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()) }); return om.apply(this, arguments); }; }
    // un bouton de la manette, par un vrai toucher (pointeurs)
    T.bouton = sel => { const b = document.querySelector('#pad ' + sel); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 11, pointerType: 'touch' })); b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 11, pointerType: 'touch' })); };
    // le joystick poussé dans une direction (un angle), puis lâché
    T.joy = (cap, ms) => new Promise(res => { const j = document.querySelector('#pad .joy'), r = j.getBoundingClientRect(), R = r.width / 2, x = r.left + R + Math.cos(cap) * R * 0.8, y = r.top + R + Math.sin(cap) * R * 0.8, pt = (t, X, Y) => j.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'touch', isPrimary: true, clientX: X, clientY: Y }));
      pt('pointerdown', x, y); setTimeout(() => { pt('pointerup', x, y); res(); }, ms); });
    // la borne menée par les vrais boutons : le joystick et A (pointeurs), ou les flèches et Entrée (clavier) ; le cap et l'élan, c'est le joueur d'essai qui les choisit
    T.menerBorne = mode => { const AC = I.activites, joy = document.querySelector('#pad .joy'), A = document.querySelector('#pad .a'); let jBas = false; const tenues = new Set(); T._borne = true; T.borneMenee = { images: 0, elans: 0 };
      const pt = (el, type, x, y, id) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: id, pointerType: 'touch', isPrimary: id === 7, clientX: x || 0, clientY: y || 0 }));
      const cle = (code, bas) => window.dispatchEvent(new KeyboardEvent(bas ? 'keydown' : 'keyup', { code, bubbles: true, cancelable: true }));
      const lacher = () => { if (jBas) { pt(joy, 'pointerup', 0, 0, 7); jBas = false; } tenues.forEach(k => cle(k, false)); tenues.clear(); };
      const pas = () => { const K = AC.K; if (!T._borne || !K || K.mode === 'fin' || K.mode === 'bilan') { lacher(); T._borne = false; return; }
        let cap = null, elan = false; if (!K.pause && K.mode === 'jeu') { const d = AC.pilote(K, {}); cap = d.cap; elan = d.elan; }
        if (mode === 'joy') { if (cap === null) { if (jBas) { pt(joy, 'pointerup', 0, 0, 7); jBas = false; } } else { const r = joy.getBoundingClientRect(), R = r.width / 2; pt(joy, jBas ? 'pointermove' : 'pointerdown', r.left + R + Math.cos(cap) * R * 0.8, r.top + R + Math.sin(cap) * R * 0.8, 7); jBas = true; }
          if (elan) { pt(A, 'pointerdown', 0, 0, 8); pt(A, 'pointerup', 0, 0, 8); T.borneMenee.elans++; } }
        else { const veut = new Set(); if (cap !== null) { const s8 = Math.round(cap / (Math.PI / 4)), dx = Math.round(Math.cos(s8 * Math.PI / 4)), dy = Math.round(Math.sin(s8 * Math.PI / 4)); if (dx > 0) veut.add('ArrowRight'); if (dx < 0) veut.add('ArrowLeft'); if (dy > 0) veut.add('ArrowDown'); if (dy < 0) veut.add('ArrowUp'); }
          ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach(k => { if (veut.has(k) && !tenues.has(k)) { cle(k, true); tenues.add(k); } else if (!veut.has(k) && tenues.has(k)) { cle(k, false); tenues.delete(k); } });
          if (elan) { cle('Enter', true); cle('Enter', false); T.borneMenee.elans++; } }
        T.borneMenee.images++; requestAnimationFrame(pas); };
      requestAnimationFrame(pas); };
    T.recouvreBorne = () => { const pads = [...document.querySelectorAll('#pad .joy, #pad .a, #pad .b')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0), L = [];
      document.querySelectorAll('#course .tableau, #course .signe, #course .bilan').forEach(e => { if (e.hidden || getComputedStyle(e).display === 'none') return; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
        if (pads.some(p => r.left < p.right - 1 && r.right > p.left + 1 && r.top < p.bottom - 1 && r.bottom > p.top + 1)) L.push(e.className); });
      return { L, efface: document.body.classList.contains('pad-efface') }; };
    T.ac = () => JSON.parse(JSON.stringify(I.save.data.cite.activites || {}));
    T.zone = id => { const z = I.activites.zones().find(z => z.id === id); if (!z) return false; T.poser(z.px, z.py); I.world.player.dir = z.dir; return true; };
  });
  for (const [w, h] of (!SEUL || ACTI) ? [[390, 844], [844, 390]].filter(orient) : []) {
    const nom = w + '×' + h, haut = h > w, mode = haut ? 'joy' : 'clavier', T = await telephone(browser, w, h), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    // une partie d'avant (sans la progression) : le prologue joué, Sâlim venu ; la bourse vide, aucune prime
    await E(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.rebonds = { x_descendu: true, x_enfant: true, x_avis: true }; sv.cite.course.salim = 2; sv.dirhams = 0; I.save.auto('essai'); });
    await P.reload(); await P.waitForTimeout(1600); await preparer(P); await aides(P);
    await E(() => { const b = [...document.querySelectorAll('#title .vmenu button')].find(b => /^Continuer/.test(b.textContent)); if (b) b.click(); });
    await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000));
    await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); });
    const la = await refugeAuxQuartiers(P);
    if (!la) { ko(`BLOQUÉ ${nom} · les activités : la partie n’arrive pas dans les quartiers`); toutesErreurs = toutesErreurs.concat(T.errors); await T.ctx.close(); continue; }
    await E(() => window.__t.endormir());
    const A = async () => { if (haut) await E(() => window.__t.bouton('.a')); else await P.keyboard.press('Enter'); };
    const B = async () => { if (haut) await E(() => window.__t.bouton('.b')); else await P.keyboard.press('Escape'); };
    const choixVu = async () => { await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 6000)); await P.waitForTimeout(430); return E(() => window.__t.choix()); };
    const dits = () => E(() => window.ISNAD.activites.journal.map(j => j.quoi + (j.id ? ':' + j.id : j.outil ? ':' + j.outil : '')));
    const T0 = await E(() => window.ISNAD.sagas.idris.cite.activites), L0 = await E(() => window.ISNAD.sagas.coeur.lecons), tact = await E(() => document.body.classList.contains('touch'));   // (un téléphone, en hauteur comme en largeur : la leçon au doigt)
    // a. la grande roue, la bourse vide : le menu dit le prix et la somme ; « Payer » se refuse (la première fois, une ligne dit
    //    d'où vient l'argent d'Idris), rien n'est avancé
    {
      const d0 = await E(() => window.ISNAD.trade.dirhams());
      await E(() => window.__t.zone('roue')); await P.waitForTimeout(250); await A();
      const c = await choixVu(); await P.screenshot({ path: path.join(out, `activite-payer-roue-${w}x${h}.png`) });
      const lecon = await E(() => window.__t.toasts.join(' | '));
      await A(); const r = await avancer(P, 40), dl = await E(() => window.ISNAD.activites.journal.slice(-3));
      const e = await E(() => ({ d: window.ISNAD.trade.dirhams(), a: window.__t.ac() }));
      const L = L0.manege[tact ? 'doigt' : 'clavier'].replace(/\*/g, '').slice(0, 30);
      si(c && /Un tour de grande roue : 3 dirhams/.test(c.prompt) && /Ta bourse : 0 dirham/.test(c.prompt) && c.opts.join('/') === 'Payer/Plus tard' && lecon.indexOf(L) >= 0 && e.d === d0 && (e.a.depenses | 0) === 0 && !(e.a.tours || {}).roue && dl.some(j => j.quoi === 'refus'),
        `${nom} · la grande roue, la bourse vide : « ${c && c.prompt} » — ${c && c.opts.join(' / ')} ; la leçon des manèges dite ; « Payer » refusé (« ${T0.manque.slice(0, 50)}… »), rien d’avancé (${e.d} dirhams)`, `${nom} · la roue, la bourse vide : ${JSON.stringify({ c, lecon, r, dl, e })}`);
    }
    // 2.31 (D223) : des dirhams gagnés dans les récits, sans aucune prime du circuit — la même bourse paie dans les quartiers
    await E(() => { const I = window.ISNAD; I.trade.dirhams(30); I.save.store(); });
    // b. la grande roue : un tour payé, la vue monte jusqu'au haut de la Cité puis redescend ; rien d'autre ne bouge
    {
      const avant = await E(() => { const W = window.ISNAD.world; return { p: window.ISNAD.activites.primes(), d: window.ISNAD.trade.dirhams(), npcs: JSON.stringify(W.npcs.map(n => [n.id, Math.round(n.x), Math.round(n.y), !!n.hidden])), objs: W.map.objs.length, cam: Math.round(W.cam.y + window.ISNAD.gfx.view.y) }; });
      await E(() => window.__t.zone('roue')); await P.waitForTimeout(250); const pos = await E(() => [Math.round(window.ISNAD.world.player.x), Math.round(window.ISNAD.world.player.y)]);
      await A(); await choixVu(); await A();
      const haut1 = await E(() => window.__t.attendre(() => window.ISNAD.activites.journal.some(j => j.quoi === 'en-haut'), 30000));
      await P.waitForTimeout(500); const vue = await E(() => ({ cam: Math.round(window.ISNAD.world.cam.y + window.ISNAD.gfx.view.y), dans: !!window.ISNAD.world.passager, nacelle: !!(window.ISNAD.world.map.objs.find(o => o.type === 'qroue') || {}).passager }));
      await P.screenshot({ path: path.join(out, `activite-roue-haut-${w}x${h}.png`) });
      await avancer(P, 60); await E(() => window.__t.attendre(() => window.__t.calme() && !window.ISNAD.activites.occupe, 30000)); await P.waitForTimeout(800);
      const apres = await E(() => { const W = window.ISNAD.world, s = [...document.querySelectorAll('#hud .pil span')].find(x => (x.querySelector('i') || {}).textContent === '◎'); return { bandeau: s ? s.textContent : null, d: window.ISNAD.trade.dirhams(), npcs: JSON.stringify(W.npcs.map(n => [n.id, Math.round(n.x), Math.round(n.y), !!n.hidden])), objs: W.map.objs.length, cam: Math.round(W.cam.y + window.ISNAD.gfx.view.y), pos: [Math.round(W.player.x), Math.round(W.player.y)], dans: !!W.passager, a: window.__t.ac() }; });
      si(avant.p === 0 && apres.bandeau === '◎' + apres.d && haut1 && vue.cam < 20 && vue.dans && vue.nacelle && avant.d - apres.d === 3 && apres.a.tours.roue === 1 && apres.a.depenses === 3 && apres.npcs === avant.npcs && apres.objs === avant.objs && apres.pos[0] === pos[0] && apres.pos[1] === pos[1] && !apres.dans && Math.abs(apres.cam - avant.cam) < 400,
        `${nom} · un tour de grande roue payé avec les dirhams des récits, sans aucune prime (3 dirhams, de ${avant.d} à ${apres.d} ; le bandeau dit « ${apres.bandeau} ») : Idris dans sa nacelle, la vue monte jusqu’au haut de la Cité (${vue.cam} points), puis redescend ; personne ni rien d’autre n’a bougé`, `${nom} · la grande roue : ${JSON.stringify({ haut1, vue, avant: { p: avant.p, d: avant.d, cam: avant.cam }, apres: { bandeau: apres.bandeau, d: apres.d, cam: apres.cam, pos: apres.pos, dans: apres.dans, a: apres.a }, pos, memes: apres.npcs === avant.npcs })}`);
    }
    // c. les chaises volantes (et, en hauteur, les tasses) : un tour, en vue, Idris sur son siège
    for (const id of haut ? ['chaises', 'tasses'] : ['chaises']) {
      const d0 = await E(() => window.ISNAD.trade.dirhams());
      await E(id => window.__t.zone(id), id); await P.waitForTimeout(250); await A(); const c = await choixVu(); await A();
      await E(() => window.__t.attendre(() => window.ISNAD.world.passager, 8000)); await P.waitForTimeout(1800);
      const vu = await E(() => !!window.ISNAD.world.passager), pisteTour = await E(() => window.ISNAD.audio.wantTrack); await P.screenshot({ path: path.join(out, `activite-${id}-${w}x${h}.png`) });
      await E(id => window.__t.attendre(() => window.ISNAD.activites.journal.some(j => j.quoi === 'tour' && j.id === id), 30000), id); await avancer(P, 30);
      const e = await E(() => ({ d: window.ISNAD.trade.dirhams(), a: window.__t.ac(), v: window.ISNAD.audio.wantTrack, l: window.ISNAD.audio.place }));
      si(pisteTour === 'rock' && e.v === e.l && e.l === 'cite', `${nom} · pendant le tour de ${id}, la piste « rock » ; descendu, celle du lieu (« ${e.l} »)`, `${nom} · la musique du tour de ${id} : ${JSON.stringify({ tour: pisteTour, apres: [e.v, e.l] })}`, 'MUSIQUE');   // (2.45, D236)
      si(vu && d0 - e.d === 2 && e.a.tours[id] === 1 && c && /2 dirhams/.test(c.prompt), `${nom} · un tour de ${id === 'chaises' ? 'chaises volantes' : 'tasses'} payé (2 dirhams), Idris sur son siège ; puis la pensée d’Idris`, `${nom} · ${id} : ${JSON.stringify({ vu, d0, e, c })}`);
    }
    // d. l'écran géant : assis, puis B le relève ; assis de nouveau, puis un pas
    {
      await E(() => window.__t.zone('banc')); await P.waitForTimeout(250); await A();
      await E(() => window.__t.attendre(() => window.ISNAD.activites.journal.some(j => j.quoi === 'assis'), 6000)); const ligne = await E(() => window.__t.lu()); await P.keyboard.press('Enter'); await avancer(P, 20); await P.waitForTimeout(300);
      const a1 = await E(() => ({ pose: window.ISNAD.world.pose[0], assis: !!window.ISNAD.activites.assis, dir: window.ISNAD.world.player.dir }));
      await P.screenshot({ path: path.join(out, `activite-ecran-${w}x${h}.png`) });
      await B(); await P.waitForTimeout(300); const a2 = await E(() => ({ pose: window.ISNAD.world.pose[0] || null, assis: !!window.ISNAD.activites.assis, carte: window.ISNAD.world.map.id, menu: window.ISNAD.ui.menuOpen }));
      await A(); await E(() => window.__t.attendre(() => window.ISNAD.activites.assis, 6000)); await avancer(P, 20); await P.waitForTimeout(300);
      if (haut) await E(() => window.__t.joy(Math.PI / 2, 350)); else { await P.keyboard.down('ArrowDown'); await P.waitForTimeout(350); await P.keyboard.up('ArrowDown'); }
      await P.waitForTimeout(300); const a3 = await E(() => ({ pose: window.ISNAD.world.pose[0] || null, assis: !!window.ISNAD.activites.assis, ecran: window.__t.ac().ecran }));
      si(a1.pose === 'assis' && a1.assis && a1.dir === 3 && T0.ecran.some(t => ligne.indexOf(t.slice(0, 25)) >= 0) && !a2.assis && !a2.pose && !a2.menu && !a3.assis && !a3.pose && a3.ecran === 2,
        `${nom} · l’écran géant : Idris s’assied (« assis »), face à l’écran (« ${ligne.slice(0, 50)}… »), ${haut ? 'B' : 'Échap'} le relève ; assis de nouveau, un pas le relève`, `${nom} · l’écran : ${JSON.stringify({ a1, ligne, a2, a3 })}`);
    }
    // e. l'étal de la galerie : un achat payé avec la prime ; un achat trop cher, refusé
    {
      const d0 = await E(() => window.ISNAD.trade.dirhams());
      await E(() => window.__t.zone('etal')); await P.waitForTimeout(250); await A();
      const prem = await E(() => window.__t.attendre(() => window.__t.visible('#dialog'), 4000) && window.__t.lu()); await P.keyboard.press('Enter');
      let c = await choixVu(); await P.screenshot({ path: path.join(out, `activite-etal-${w}x${h}.png`) });
      // (la pièce achetée rejoint la réserve ; si elle va mieux à quelqu'un, on demande qui la porte — B : à la réserve)
      await A(); await P.waitForTimeout(900); await E(() => window.__t.attendre(() => window.__t.visible('#choice') && /Qui la porte|étal/.test(document.querySelector('#choice').textContent), 6000)); await P.waitForTimeout(430);
      const porte = await E(() => window.__t.choix()); if (porte && /Qui la porte/.test(porte.prompt)) { await B(); c = await choixVu(); } else c = porte;
      const e1 = await E(() => ({ d: window.ISNAD.trade.dirhams(), baton: window.ISNAD.save.data.gear.baton_marche | 0, porte: ((window.ISNAD.save.data.equip['idris:idris'] || {}).md) || null, a: window.__t.ac() }));
      for (let i = 0; i < 6; i++) { await P.keyboard.press('ArrowDown'); await P.waitForTimeout(120); }
      const n0 = await E(() => window.__t.toasts.length); await P.keyboard.press('Enter'); await P.waitForTimeout(700);
      const e2 = await E(n0 => ({ d: window.ISNAD.trade.dirhams(), lampe: window.ISNAD.save.data.gear.lampe | 0, refus: window.__t.toasts.slice(n0).some(t => /Il te manque des dirhams/.test(t)), choix: window.__t.visible('#choice') }), n0);
      await B(); await avancer(P, 20);
      si(prem && prem.indexOf(T0.etal.slice(0, 20)) >= 0 && c && c.opts.length === 8 && /Bâton de marche · 8 dirhams/.test(c.opts[0]) && d0 - e1.d === 8 && (e1.baton >= 1 || e1.porte === 'baton_marche') && e1.a.achats === 1 && e2.d === e1.d && !e2.lampe && e2.refus && e2.choix,
        `${nom} · l’étal : « ${prem.slice(0, 40)}… » ; le bâton de marche payé avec la prime (8 dirhams, de ${d0} à ${e1.d}) ; la lampe de veille (50) refusée — « Il te manque des dirhams. », rien de débité`, `${nom} · l’étal : ${JSON.stringify({ prem, c, porte, e1, e2 })}`);
    }
    // f. la borne « Les lueurs », par les vrais boutons ; la pause ; le meilleur score gardé
    {
      await E(() => window.__t.zone('borne')); await P.waitForTimeout(250); await A(); const c = await choixVu();
      const lecon = await E(() => window.__t.toasts.join(' | ')), LB = L0.borne[tact ? 'doigt' : 'clavier'].replace(/\*/g, '').slice(0, 30);
      await A(); await E(() => window.__t.attendre(() => window.ISNAD.activites.K && window.ISNAD.activites.K.mode === 'compte', 6000)); await P.waitForTimeout(600);
      await P.screenshot({ path: path.join(out, `borne-depart-${w}x${h}.png`) });
      await E(m => window.__t.menerBorne(m), mode);
      await E(() => window.__t.attendre(() => { const K = window.ISNAD.activites.K; return K && K.mode === 'jeu' && K.t > 7; }, 20000));
      const rc = await E(() => window.__t.recouvreBorne()); await P.screenshot({ path: path.join(out, `borne-jeu-${w}x${h}.png`) });
      // la pause : B (ou Échap) ; B revient d'un cran ; la partie reprend
      await B(); await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 4000)); await P.waitForTimeout(430);
      const pc = await E(() => window.__t.choix()), t0 = await E(() => window.ISNAD.activites.K.t); await P.screenshot({ path: path.join(out, `borne-pause-${w}x${h}.png`) });
      await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(700);
      const repris = await E(t0 => ({ choix: window.__t.visible('#choice'), pause: window.ISNAD.activites.K.pause, avance: window.ISNAD.activites.K.t > t0 }), t0);
      await E(m => { if (!window.__t._borne) window.__t.menerBorne(m); window.ISNAD.debug.accelBorne = 5; }, mode);
      const fini = await E(() => window.__t.attendre(() => !document.querySelector('#course .bilan').hidden, 60000)); await P.waitForTimeout(600);
      const b = await E(() => ({ bilan: document.querySelector('#course .bilan').textContent, j: window.ISNAD.activites.journal.filter(x => x.quoi === 'partie').pop(), rc: window.__t.recouvreBorne(), men: window.__t.borneMenee, a: window.__t.ac(), piste: window.ISNAD.audio.wantTrack }));
      await P.screenshot({ path: path.join(out, `borne-bilan-${w}x${h}.png`) });
      await E(() => { window.ISNAD.debug.accelBorne = 0; }); await A(); await avancer(P, 30);
      { const m = await E(() => ({ v: window.ISNAD.audio.wantTrack, l: window.ISNAD.audio.place }));   // (2.45, D236)
        si(b.piste === 'rock' && m.v === m.l && m.l === 'cite', `${nom} · pendant la borne, la piste « rock » ; la partie finie, celle du lieu (« ${m.l} »)`, `${nom} · la musique de la borne : ${JSON.stringify({ borne: b.piste, apres: m })}`, 'MUSIQUE'); }
      si(c && /Une partie à la borne : 2 dirhams/.test(c.prompt) && lecon.indexOf(LB) >= 0, `${nom} · la borne : « ${c && c.prompt} » ; la leçon de la borne dite (« ${LB}… »)`, `${nom} · la borne, le menu et la leçon : ${JSON.stringify({ c, lecon })}`);
      si(fini && b.j && b.j.score > 0 && b.j.prises > 0 && b.men.images > 100 && b.men.elans > 0 && b.a.borne.record === b.j.score && b.a.borne.parties === 1 && /Score/.test(b.bilan) && !PARI2.test(b.bilan),
        `${nom} · « Les lueurs » menées ${haut ? 'au joystick et à A' : 'aux flèches et à Entrée'} : score ${b.j && b.j.score} (${b.j && b.j.prises} lueurs, ${b.j && b.j.elans} élans, plus longue chaîne ${b.j && b.j.meilleure}), le meilleur gardé`, `${nom} · la borne : ${JSON.stringify(b)}`, 'BLOQUÉ');
      si(pc && /La partie est en pause/.test(pc.prompt) && pc.opts.join('/') === 'Reprendre/Quitter la partie' && !repris.choix && !repris.pause && repris.avance, `${nom} · ${haut ? 'B' : 'Échap'} : « ${pc && pc.prompt} » ${pc && pc.opts.join(' / ')} ; B revient d’un cran, la partie reprend`, `${nom} · la pause de la borne : ${JSON.stringify({ pc, repris })}`);
      si(!rc.L.length && !rc.efface && !b.rc.L.length && !b.rc.efface, `${nom} · la manette ne recouvre ni le tableau de la borne, ni son signe, ni son bilan`, `${nom} · la manette sur la borne : ${JSON.stringify([rc, b.rc])}`, 'RECOUVERT');
      // « Quitter la partie » : rien n'est compté (la partie payée reste payée)
      await E(() => window.__t.zone('borne')); await P.waitForTimeout(250); await A(); await choixVu(); await A();
      await E(() => window.__t.attendre(() => window.ISNAD.activites.K && window.ISNAD.activites.K.mode === 'jeu', 8000)); await B(); await choixVu(); await P.keyboard.press('ArrowDown'); await P.waitForTimeout(120); await P.keyboard.press('Enter');
      const q = await E(() => window.__t.attendre(() => !window.ISNAD.activites.K && window.ISNAD.scene === window.ISNAD.world, 8000)); await avancer(P, 20);
      const a2 = await E(() => window.__t.ac());
      si(q && a2.borne.parties === 1 && a2.borne.record === b.a.borne.record, `${nom} · « Quitter la partie » : retour à la salle de jeux ; rien n’est compté, le record reste ${a2.borne.record}`, `${nom} · quitter la borne : ${JSON.stringify({ q, a2 })}`);
    }
    // g. la course reste gratuite : on la commence et on la quitte, rien n'est débité, rien n'est versé
    {
      const d0 = await E(() => ({ d: window.ISNAD.trade.dirhams(), dep: window.__t.ac().depenses }));
      await E(() => { const W = window.ISNAD.world, o = W.npcs.find(n => n.id === 'q_organisateur'); window.__t.poser(o.x + 20, o.y); W.player.dir = 1; }); await P.waitForTimeout(250); await A(); await avancer(P);
      const c = await choixVu(); await A();
      await E(() => window.__t.attendre(() => window.ISNAD.circuit.K && window.ISNAD.circuit.K.mode === 'course', 10000)); await B(); await choixVu(); await P.keyboard.press('ArrowDown'); await P.waitForTimeout(120); await P.keyboard.press('Enter');
      await E(() => window.__t.attendre(() => !window.ISNAD.circuit.K && window.ISNAD.scene === window.ISNAD.world, 8000)); await avancer(P, 20);
      const d1 = await E(() => ({ d: window.ISNAD.trade.dirhams(), dep: window.__t.ac().depenses }));
      si(d1.d === d0.d && d1.dep === d0.dep && c && !c.opts.some(o => /Payer|dirham/.test(o)), `${nom} · la course reste gratuite : commencée puis quittée, ni débit ni prime (${d1.d} dirhams) ; l’organisateur ne demande rien`, `${nom} · la course gratuite : ${JSON.stringify({ d0, d1, c })}`);
    }
    // h. aucune mise offerte ; la partie garde les activités, à l'identique, et refuse un compte abîmé ; le record relu après un rechargement
    {
      const of = await E(() => window.__t.offerts), fautes = of.filter(m => PARI2.test(m.q) || m.opts.some(o => PARI2.test(o)));
      si(of.length >= 8 && !fautes.length, `${nom} · ${of.length} listes offertes (payer, la borne, l’étal, la course) : aucune ne propose de parier ni de miser`, `${nom} · une mise offerte : ${JSON.stringify(fautes)}`, 'ÉCART');
      const r = await E(() => { const I = window.ISNAD, c0 = JSON.stringify(I.save.data.cite.activites), t = I.save.exporter(), l = I.save.lireTexte(t); if (!l.ok) return { ok: false, e: l.erreur };
        const ab = JSON.parse(t); ab.partie.cite.activites.borne.record = -1; const l2 = I.save.lireTexte(JSON.stringify(ab)); I.save.auto('essai'); return { ok: true, c0, c1: JSON.stringify(l.partie.cite.activites), refus: !l2.ok }; });
      await P.reload(); await P.waitForTimeout(1600);
      const rec = await E(() => { const I = window.ISNAD; I.save.readAuto(); return (I.save.data.cite.activites || {}).borne; });
      const a = r.ok ? JSON.parse(r.c0) : {};
      si(r.ok && r.c0 === r.c1 && r.refus && rec && rec.record === a.borne.record && a.borne.record > 0, `${nom} · la partie garde les activités (${r.c0}), les exporte à l’identique, refuse un record abîmé ; après un rechargement, le record de la borne est toujours ${rec && rec.record}`, `${nom} · la partie et les activités : ${JSON.stringify({ r, rec })}`);
    }
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'activités ' + nom + ' · ' + e)); await T.ctx.close();
  }
  // ---------- 16 bis. dans une partie neuve : chaque leçon dite une seule fois, au premier essai ; une activité attend son tour ----------
  if (!SEUL || ACTI) {
    const T = await telephone(browser, 390, 844), P = T.p, E = (fn, a) => P.evaluate(fn, a), nom = '390×844';
    await E(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv.rebonds = { x_descendu: true, x_enfant: true, x_avis: true }; sv.cite.course.salim = 2; sv.cite.course.primes = 30; I.trade.dirhams(0); I.trade.dirhams(30);
      I.lecons.ouvrir(); ['marcher', 'parler', 'aide', 'halte'].forEach(id => { I.lecons.recevoir(id); I.lecons.sequence(); }); I.save.auto('essai'); });
    await P.reload(); await P.waitForTimeout(1600); await preparer(P); await aides(P);
    await E(() => { const b = [...document.querySelectorAll('#title .vmenu button')].find(b => /^Continuer/.test(b.textContent)); if (b) b.click(); });
    await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000));
    await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); });
    await refugeAuxQuartiers(P); await E(() => window.__t.endormir());
    const A = () => E(() => window.__t.bouton('.a')), B = () => E(() => window.__t.bouton('.b'));
    const essai = async id => { await E(id => window.__t.zone(id), id); await P.waitForTimeout(250); await A(); await P.waitForTimeout(700); };
    const lecons = () => E(() => ({ j: window.ISNAD.lecons.journal.map(x => x.id), a: window.ISNAD.activites.journal.filter(x => x.quoi === 'lecon' || x.quoi === 'attend').map(x => x.quoi + ':' + x.outil) }));
    await essai('borne'); const c1 = await E(() => window.__t.choix()); await B(); await avancer(P, 10);
    const l1 = await lecons();
    await essai('etal'); const l2 = await lecons(); const attend = await E(() => window.__t.toasts.some(t => /la tête ailleurs/.test(t))); await avancer(P, 10);
    // la borne de nouveau : une partie, menée par le joueur d'essai ; l'outil a resservi
    await essai('borne'); await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 4000)); await P.waitForTimeout(430); await A();
    await E(() => window.__t.attendre(() => window.ISNAD.activites.K && window.ISNAD.activites.K.mode === 'jeu', 8000)); await E(() => { window.ISNAD.debug.piloteBorne = {}; window.ISNAD.debug.accelBorne = 8; });
    await E(() => window.__t.attendre(() => !document.querySelector('#course .bilan').hidden, 60000)); await E(() => { window.ISNAD.debug.piloteBorne = null; window.ISNAD.debug.accelBorne = 0; }); await P.waitForTimeout(600); await A(); await avancer(P, 30);
    const re = await E(() => window.ISNAD.save.data.lecons.re.borne | 0);
    await essai('etal'); await avancer(P, 10); await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 4000)); await P.waitForTimeout(430); await B(); await avancer(P, 10);
    const l3 = await lecons();
    await essai('etal'); await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 4000)); await P.waitForTimeout(430); await B(); await avancer(P, 10);
    const l4 = await lecons();
    si(c1 && /borne/.test(c1.prompt) && l1.a.join() === 'lecon:borne' && l1.j.slice(-1)[0] === 'borne' && l2.a.join() === 'lecon:borne,attend:etal' && attend && re >= 1 && l3.a.filter(x => x === 'lecon:etal').length === 1 && l3.j.slice(-1)[0] === 'etal' && l4.a.filter(x => /^lecon/.test(x)).length === 2 && l4.j.join() === l3.j.join(),
      `${nom} · partie neuve : la leçon de la borne au premier essai ; l’étal attend (« ${(await E(() => window.ISNAD.sagas.idris.cite.activites.attend))} ») tant que la borne n’a pas resservi ; une partie jouée, l’étal donne sa leçon ; à l’essai suivant, rien ne se redit (outils : ${l4.j.join(', ')})`, `${nom} · la progression des activités : ${JSON.stringify({ c1, l1, l2, attend, re, l3, l4 })}`);
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'activités (partie neuve) · ' + e)); await T.ctx.close();
  }
  // ---------- 17. 2.28 (D218), 2.47 (D238) : la rue, la ruelle, la vieille mosquée — au doigt (en hauteur) et au clavier (en largeur) ----------
  for (const [w, h] of (!SEUL || PASS) ? [[390, 844], [844, 390]].filter(orient) : []) {
    const nom = w + '×' + h, haut = h > w, T = await telephone(browser, w, h), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    await aides(P);
    // une partie neuve (« Nouvelle partie ») : le prologue, au premier objectif
    await E(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; I.lecons.ouvrir(); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); I.world.roster = {}; I.world.saga = null; I.world.startChapter('idris', 0); });
    await P.waitForTimeout(1200); await avancer(P);
    // aller jusqu'à un point au bord, au doigt (des touchers sur la scène, vers lui) ou au clavier (marcher, puis pousser vers le bord)
    // (au doigt : on touche le bord lui-même, là où il se voit sur la scène — tout près du bord de l'écran, mais sur la scène)
    const versBord = async (x, y, touche, carte) => { const ici = () => E(() => window.ISNAD.world.map && window.ISNAD.world.map.id);
      if (haut) { for (let i = 0; i < 12; i++) { if ((await ici()) !== carte) return true; const pt = await E(([x, y]) => window.__t.calme() ? window.__t.brut(x, y) : null, [x, y]); if (pt) await P.touchscreen.tap(pt[0], pt[1]); await P.waitForTimeout(1200); } }
      else { await E(([x, y]) => window.__t.marcher(x, y, 20000), [x + (touche === 'ArrowRight' ? -24 : touche === 'ArrowLeft' ? 24 : 0), y + (touche === 'ArrowDown' ? -14 : touche === 'ArrowUp' ? 14 : 0)]); await P.keyboard.down(touche); for (let i = 0; i < 20 && (await ici()) === carte; i++) await P.waitForTimeout(150); await P.keyboard.up(touche); }
      for (let i = 0; i < 20 && (await ici()) === carte; i++) await P.waitForTimeout(200); return (await ici()) !== carte; };
    const etat = () => E(() => { const I = window.ISNAD, W = I.world, s = I.save.data, y = W.npcs.find(n => n.hero === 'yunus'); return Object.assign(window.__t.etat(), { cps: Object.keys(s.cps || {}), recus: Object.keys((s.lecons || {}).recus || {}), lj: I.lecons.journal.map(x => x.id).join(), yunus: y ? y.map : null, cible: !!(W.target() || {}).passage, dit: (document.querySelector('#hud .obj') || {}).textContent || '' }); });
    // a. le prologue mène lui-même par le chemin de 2084 : la rue, les quartiers, la ruelle abandonnée, la vieille mosquée (le joueur
    //    de test du moteur, à pied) ; dans les quartiers, rien ne rôde encore ; aucun passage ne s'y prend, rien n'est rangé
    await E(() => { const I = window.ISNAD, W = I.world, T = window.__t; T.cartes = []; T.rodeursVus = 0; const ol = W.loadMap; W.loadMap = function (id) { T.cartes.push(id); return ol.apply(this, arguments); };
      T.ivR = setInterval(() => { if (W.map && W.map.id === 'quartiers' && W.foes.some(f => f.rue && !f.done)) T.rodeursVus++; }, 200); I.debug.walk = true; });
    const a = await E(() => window.__t.jusqua(4)); await avancer(P);
    const e1 = await etat(), vu = await E(() => { const T = window.__t; clearInterval(T.ivR); window.ISNAD.debug.walk = false; return { cartes: T.cartes.join('>'), rodeurs: T.rodeursVus, passages: window.ISNAD.passages.journal.length }; });
    await P.screenshot({ path: path.join(out, `prologue-mosquee-${w}x${h}.png`) });
    si(a && e1.ch === 'p1' && e1.carte === 'archives' && e1.obj === 4 && /quartiers.*impasse.*archives/.test(vu.cartes) && !vu.rodeurs && !vu.passages && e1.yunus === 'archives' && !e1.cps.length,
      `${nom} · le prologue mène Idris par la rue, les quartiers et la ruelle jusqu’à la vieille mosquée et Maître Yûnus (${vu.cartes}) ; rien ne rôde encore dans les quartiers ; aucun passage, rien de rangé`, `${nom} · le prologue : ${JSON.stringify({ a, e1, vu })}`, 'BLOQUÉ');
    // b. dans le prologue, la porte de la mosquée ne mène nulle part : Idris y reste, à son objectif
    await E(() => window.__t.poser(272, 352)); await P.waitForTimeout(300);
    const sort = await versBord(272, 382, 'ArrowDown', 'archives'), e2 = await etat();
    si(!sort && e2.carte === 'archives' && e2.ch === 'p1' && e2.obj === 4, `${nom} · dans le prologue, la porte de la mosquée ne mène nulle part : Idris reste à son objectif`, `${nom} · la porte, dans le prologue : ${JSON.stringify({ sort, e2 })}`, 'ÉCART');
    // c. le refuge (« La Cité-Miroir », au pied de la Chaîne) : la vieille mosquée, à côté de Maître Yûnus ; à pied, la porte, la
    //    ruelle, les quartiers ; puis la ruelle et la porte ramènent à la mosquée — le même chapitre, rien de rangé
    await E(() => { const I = window.ISNAD; I.save.data.prologue = true; I.ui.showChain(); }); await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000));
    await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); });
    await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers' && window.__t.calme(), 15000)); await avancer(P);
    const r0 = await etat(), pres = await E(() => window.__t.pres());
    const s1 = await versBord(272, 382, 'ArrowDown', 'archives'); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'impasse' && window.__t.calme(), 10000)); await avancer(P);
    const r1 = await etat(), dP = await E(() => { const W = window.ISNAD.world, s = W.spotPx('porte'); return Math.round(Math.hypot(W.player.x - s[0], W.player.y - s[1])); });
    await P.screenshot({ path: path.join(out, `ruelle-${w}x${h}.png`) });
    const s2 = await versBord(4, 120, 'ArrowLeft', 'impasse'); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'quartiers' && window.__t.calme(), 10000)); await avancer(P); await E(() => window.__t.endormir());
    const r2 = await etat(), dR = await E(() => { const W = window.ISNAD.world, s = W.spotPx('ruelle'); return Math.round(Math.hypot(W.player.x - s[0], W.player.y - s[1])); });
    await P.screenshot({ path: path.join(out, `ruelle-quartiers-${w}x${h}.png`) });
    const s3 = await versBord(1020, 344, 'ArrowRight', 'quartiers'); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'impasse' && window.__t.calme(), 10000)); await avancer(P);
    const r3 = await etat();
    const s4 = await versBord(634, 120, 'ArrowRight', 'impasse'); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'archives' && window.__t.calme(), 10000)); await avancer(P);
    const r4 = await etat(), pres4 = await E(() => window.__t.pres());
    await P.screenshot({ path: path.join(out, `mosquee-retour-${w}x${h}.png`) });
    si(r0.ch === 'c_quartiers' && r0.carte === 'archives' && pres > 0 && pres < 40 && s1 && r1.carte === 'impasse' && dP < 30 && s2 && r2.carte === 'quartiers' && dR < 30 && r2.yunus === 'archives' && r2.cible && /vieille mosquée/.test(r2.dit)
      && s3 && r3.carte === 'impasse' && s4 && r4.carte === 'archives' && pres4 > 0 && pres4 < 200 && [r1, r2, r3, r4].every(e => e.ch === 'c_quartiers') && ![r0, r1, r2, r3, r4].some(e => e.cps.includes('idris:11')),
      `${nom} · le refuge : la vieille mosquée, à ${pres} points de Maître Yûnus ; ${haut ? 'au doigt' : 'au clavier'}, la porte mène à la ruelle, la ruelle aux quartiers (Maître Yûnus n’y est pas ; la flèche et l’objectif disent le chemin de la mosquée), puis la ruelle et la porte ramènent à la mosquée — le même chapitre, rien de rangé`,
      `${nom} · le refuge à pied : ${JSON.stringify({ r0, pres, s1, r1, dP, s2, r2, dR, s3, r3, s4, r4, pres4 })}`, 'INACCESSIBLE');
    // d. (en largeur) un retour (« x_descendu »), qui se joue dans la mosquée : sortir par la porte le range et ouvre le refuge dans la
    //    ruelle ; revenu dans la mosquée, Maître Yûnus le reprend (« Reprendre le récit ») à son objectif ; puis une rencontre
    //    (« r_abubakr »), le dernier maillon, le joueur de test
    if (!haut) {
      const ouvrir = ci => E(ci => { const I = window.ISNAD, W = I.world; I.save.data.prologue = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.input.reset(); W.roster = {}; W.saga = null; W.startChapter('idris', ci); }, ci);
      await ouvrir(7); await P.waitForTimeout(1000); await avancer(P);
      const x0 = await etat(), m1 = await versBord(272, 382, 'ArrowDown', 'archives'); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'impasse' && window.__t.calme(), 12000)); await avancer(P);
      const x1 = await etat(), m2 = await versBord(634, 120, 'ArrowRight', 'impasse'); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'archives' && window.__t.calme(), 10000)); await avancer(P);
      await E(() => { const W = window.ISNAD.world, y = window.__t.yunus(); window.__t.poser(y.x + 18, y.y); W.player.dir = 1; }); await P.waitForTimeout(250); await P.keyboard.press('Enter'); await P.waitForTimeout(200);
      const rr = await avancer(P), c = await E(() => window.__t.choix());
      if (rr === 'choix') { await P.waitForTimeout(400); await P.keyboard.press('Enter'); }
      await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'x_descendu' && window.__t.calme(), 20000)); await avancer(P);
      const x2 = await etat();
      si(m1 && m2 && x0.ch === 'x_descendu' && x1.ch === 'c_quartiers' && x1.carte === 'impasse' && x1.cps.includes('idris:7') && c && /^Reprendre le récit/.test(c.opts[0]) && x2.ch === 'x_descendu' && x2.obj === x0.obj && x2.carte === 'archives',
        `${nom} · pendant un retour (« x_descendu ») : la porte de la mosquée le range et ouvre le refuge dans la ruelle ; revenu, Maître Yûnus le reprend à son objectif (${x2.obj})`, `${nom} · le retour : ${JSON.stringify({ m1, m2, x0, x1, c, x2 })}`, 'BLOQUÉ');
      await ouvrir(2); await P.waitForTimeout(1000); await avancer(P);
      const r0 = await etat(), t1 = await versBord(950, 237, 'ArrowRight', 'cite'); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'quartiers' && window.__t.calme(), 12000)); await avancer(P);
      const t2 = await versBord(4, 157, 'ArrowLeft', 'quartiers'); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'cite' && window.__t.calme(), 12000)); await avancer(P);
      const r1 = await etat();
      si(t1 && t2 && r0.ch === 'r_abubakr' && r1.ch === 'r_abubakr' && r1.obj === r0.obj, `${nom} · pendant une rencontre (« r_abubakr ») : la rue mène aux quartiers et en revient, la rencontre reprend à son objectif`, `${nom} · la rencontre : ${JSON.stringify({ t1, t2, r0, r1 })}`, 'BLOQUÉ');
      await ouvrir(1); await P.waitForTimeout(1000); await avancer(P);
      await E(() => window.__t.poser(948, 237)); await P.keyboard.down('ArrowRight'); await P.waitForTimeout(800); await P.keyboard.up('ArrowRight'); await P.waitForTimeout(500);
      const f1 = await etat();
      await E(() => { window.ISNAD.debug.walk = true; window.__t.poser(940, 237); }); await P.keyboard.down('ArrowRight'); await P.waitForTimeout(800); await P.keyboard.up('ArrowRight'); await P.waitForTimeout(500);
      const f2 = await etat(); await E(() => { window.ISNAD.debug.walk = false; });
      si(f1.ch === 'e1' && f1.carte === 'cite' && f2.carte === 'cite', `${nom} · le dernier maillon, d’une traite : la rue ne s’y ouvre pas ; le joueur de test du moteur ne passe jamais`, `${nom} · le dernier maillon : ${JSON.stringify({ f1, f2 })}`, 'ÉCART');
    }
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'passages ' + nom + ' · ' + e)); await T.ctx.close();
  }
  if (toutesErreurs.length) { anomalies++; console.log('--- ERREURS ---'); [...new Set(toutesErreurs)].slice(0, 12).forEach(e => console.log(e)); }
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ CITÉ CONFORME — les quartiers, en hauteur et en largeur : l’arrivée à côté de Maître Yûnus, ses sorties, chaque lieu à pied et au doigt, les voitures, ce qui rôde et le rappel ; Sâlim et sa moto, les cinq circuits, la prime, aucune mise (captures dans ${path.relative(path.join(__dirname, '..'), out)})`);
  await browser.close();
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
