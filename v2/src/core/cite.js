/* ISNAD 2.23 (D212) — le refuge de 2084 : les quartiers de la Cité-Miroir, à côté de Maître Yûnus.
   Demande du décideur, 21 novembre : « la possibilité de remonter à la cité miroir à chaque moment à côté de Maître Yunus, il
   y trouve beaucoup d'activités mais tout le monde est triste et seul, personne ne voit les idées noires modernes […]
   Chaque rencontre ou combat avec une idée noire qu'il est seul à voir lui rappelle la prière et lui propose de revoir maître
   Yunus qui lui rappelle son rôle de rawi. »
   - Le refuge est un chapitre de l'histoire-cadre marqué `visite: 'quartiers'` (frame.js) : il se rejoue, et reste sobre
     (oeuvres.js, O.sobre : aucune œuvre comptée, aucune descente). On y arrive par « Revenir en 2084 » (ui.js, U.partir), une
     fois joués les retours dus (`retour: n`), ou par le bouton « La Cité-Miroir » du pied de la Chaîne, dès le prologue joué.
     Chaque arrivée est neuve : Idris paraît à côté de Maître Yûnus — depuis la 2.47 (D238), dans la vieille mosquée, au bout de
     la ruelle abandonnée ; il en sort à pied vers les quartiers (passages.js). Le point de reprise du refuge n'est jamais
     rangé parmi les récits quittés (world.js, W.ranger, W.rangees) : on en sort par Maître Yûnus ou par la halte —
     « Reprendre le récit » (le dernier récit quitté, repris exactement à sa place) ou « La Chaîne ».
   - Ce qui rôde (rodeurs.js, les rues) : les chimères de D.CITE.rodent, qu'Idris est seul à voir. Après chaque combat avec
     l'une d'elles : une ligne, la pensée d'Idris, qui rappelle la prière (frame.js, cite.rappels, l'une après l'autre) ; puis
     « Revoir Maître Yûnus » ou « Plus tard » (B y répond). Oui : Idris est mené à côté de lui, qui lui rappelle son rôle de
     râwî (cite.yunus, l'une après l'autre). Aucune prière n'y est un pouvoir, aucun texte n'y promet rien (exigences 13, 15).
   - La progression (lecons.js) : l'outil « cite », dit par Maître Yûnus à la première arrivée, quand on peut l'y recevoir.
   La partie garde `cite` (base.js) : { arrivees, rappels, yunus, vue, lecon } — des comptes, rien d'autre. */
(function () {
  'use strict';
  const I = window.ISNAD, W = I.world, S = I.script, $ = I.$;
  const C = I.cite = { journal: [] };
  const fr = () => I.sagas.idris;
  C.refuge = ch => !!(ch && ch.visite === 'quartiers');
  C.index = () => { const f = fr(); return f ? f.chapters.findIndex(C.refuge) : -1; };
  C.ici = () => !!(W.saga && W.saga.id === 'idris' && C.refuge(W.ch) && I.scene === W);
  C.estPoint = cp => !!(cp && cp.saga === 'idris' && fr() && C.refuge(fr().chapters[cp.ci]));
  C.etat = () => { const sv = I.save.data; if (!sv.cite || typeof sv.cite !== 'object' || Array.isArray(sv.cite)) sv.cite = {}; return sv.cite; };
  const textes = () => (fr() && fr().cite) || {};
  // offert dès que le prologue est joué
  C.offert = () => C.index() >= 0 && !!I.save.data.prologue;
  // le dernier récit quitté (jamais le refuge lui-même)
  C.recit = () => W.rangees().find(c => !C.estPoint(c)) || null;
  // ce que propose « Reprendre » : le récit et son chapitre (une veillée se dit comme sur la Chaîne)
  C.reprendreDit = c => { const sg = I.sagas[c.saga], ch = sg && sg.chapters[c.ci]; if (!sg || !ch) return I.t('Reprendre le récit');
    return sg.veillees ? I.t('Reprendre la veillée : {chapitre}', { chapitre: I.esc(ch.title) }) : I.t('Reprendre le récit : {recit} · {chapitre}', { recit: I.esc(sg.frame ? I.perso.dit() : sg.name), chapitre: I.esc(ch.title) }); };
  const yunus = () => W.npcs.find(n => n.hero === 'yunus' && !n.hidden && W.map && n.map === W.map.id && n.placed) || null;
  // (2.47 : Maître Yûnus reste dans la mosquée ; ailleurs dans le refuge, il est là-bas)
  const yunusLoin = () => W.npcs.find(n => n.hero === 'yunus' && !n.hidden) || null;

  // arriver : un chapitre neuf, au parvis, à côté de Maître Yûnus
  C.arriver = async function () {
    const ri = C.index(); if (ri < 0) return false;
    const sv = I.save.data, k = 'idris:' + ri, e = C.etat();
    if (sv.cp && W.cleReprise(sv.cp) === k) sv.cp = null; if (sv.cps) delete sv.cps[k];
    if (e.lecon && I.lecons) I.lecons.reemploi('cite');   // revenir de soi-même : l'outil a resservi
    e.arrivees = (e.arrivees | 0) + 1; I.save.store(); C.journal.push({ quoi: 'arrivee', n: e.arrivees });
    W.roster = {}; W.saga = null; await W.startChapter('idris', ri); return true;
  };
  /* 2.28 (D218) — arrivé à pied par la rue (passages.js : C.parRue, posé avant C.arriver) : Idris entre dans les quartiers par
     l'entrée de la rue (le lieu « traverse », au nord-ouest). 2.47 (D238) — sorti de la mosquée pendant un retour (C.parRuelle) :
     Idris est dans la ruelle, devant la porte. Maître Yûnus, lui, est resté dans la mosquée : la leçon de l'outil « cite », qu'il
     dit, attend une arrivée à côté de lui. Le récit d'ouverture le dit (frame.js : `_2084_rue`, `_2084_porte`, posés ici). world.js l'appelle à
     l'ouverture de tout chapitre, après avoir posé ses personnages ; → { carte, lieu, dir }, ou null (à côté de lui). */
  C.parRue = false; C.parRuelle = false;
  C.depart = function (ch) {
    if (!C.refuge(ch)) return null; const rue = !!C.parRue, ruelle = !rue && !!C.parRuelle; C.parRue = false; C.parRuelle = false;
    C.journal.push({ quoi: rue ? 'par-la-rue' : ruelle ? 'par-la-porte' : 'a-la-mosquee' });
    delete I.script.flags._2084_rue; delete I.script.flags._2084_porte;
    if (!rue && !ruelle) return null;
    I.script.flags[rue ? '_2084_rue' : '_2084_porte'] = true;
    return rue ? { carte: 'quartiers', lieu: 'traverse', dir: 2 } : { carte: 'impasse', lieu: 'porte', dir: 1 };
  };
  // l'objectif du refuge, quand Maître Yûnus n'y est pas (world.js, W.hud)
  C.objectif = o => (C.ici() && o && o.talk && !yunus() && W.npcs.some(n => n.id === o.talk && n.hero === 'yunus') && W.map
    ? (W.map.id === 'impasse' ? I.t('La vieille mosquée est au bout de la ruelle · la ruelle ramène aux quartiers')
      // (2.49, D242 : tant que Sâlim n'est pas venu, l'objectif dit où il attend — texte de l'agent, à valider)
      : salimAttend() ? I.t('Te promener dans les quartiers · Sâlim t’attend au circuit, au sud · la ruelle de l’est mène à la vieille mosquée')
      : I.t('Te promener dans les quartiers · la ruelle de l’est mène à la vieille mosquée')) : null);   // (2.47, D238)
  const salimAttend = () => { const c = I.save.data.cite, e = c && c.course; return !!(I.circuit && W.map && W.map.id === 'quartiers' && !(e && (e.salim | 0) > 0)); };
  // au début d'une visite (world.js, startChapter) : ce qui rôde se tire de nouveau ; rien de la visite d'avant
  C.neuf = function (F) { Object.keys(F).forEach(k => { if (k === '_rues' || k.indexOf('_rue_') === 0 || k === '_primes') delete F[k]; }); };   // (2.27 : et les primes de la visite d'avant — circuit.js)
  // l'ouverture faite : la première fois, Maître Yûnus dit qu'on peut revenir ici (la leçon de l'outil « cite »)
  C.ouvre = async function (cp) {
    if (I.circuit) I.circuit.ouvre(cp); // 2.27 : Sâlim est au circuit s'il est déjà venu, sa moto garée (circuit.js)
    const e = C.etat(); if (cp || e.lecon) return;
    const t = ((I.sagas.coeur || {}).lecons || {}).cite, y = yunus(); if (!t || !y) return;
    let dire = false; const donne = I.lecons ? I.lecons.proposer('cite', () => { dire = true; }) : (dire = true);
    if (!donne || !dire) return;
    e.lecon = true; I.save.store(); C.journal.push({ quoi: 'lecon' });
    S.depth++; try { y.dir = 1; await S.run([['say', y.id, t]]); } finally { S.depth--; S.hideDialog(); }
  };
  // ce que dit Maître Yûnus : l'une après l'autre, ce que c'est qu'un râwî
  C.replique = async function (y) {
    const L = textes().yunus || []; if (!L.length || !y) return; const e = C.etat(), k = (e.yunus | 0) % L.length; e.yunus = (e.yunus | 0) + 1; I.save.store();
    C.journal.push({ quoi: 'yunus', k }); const p = W.player, dx = p.x - y.x, dy = p.y - y.y; y.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
    await S.run([['say', y.id, L[k]]]);
  };
  // parler à Maître Yûnus, dans le refuge : une réplique, puis où aller (world.js, W.interact). Le joueur de test du moteur
  // (auto, à pied, au doigt) l'ignore : pour lui, l'objectif s'accomplit et la visite s'achève, comme celle de la Citadelle.
  C.parle = function (n) {
    if (!C.ici() || !n || n.hero !== 'yunus' || I.debug.auto || I.debug.walk) return false;
    C.menu(n); return true;
  };
  C.menu = async function (y) {
    if (C._menu) return; C._menu = true; let k = null;
    S.depth++;
    try {
      await C.replique(y);
      const c = C.recit(), opts = [];
      if (c) opts.push({ t: C.reprendreDit(c), k: 'recit' });
      if (I.save.data.prologue) opts.push({ t: I.t('La Chaîne, au fond de la mosquée'), k: 'chaine' });   // (2.28 : pas avant que le prologue ne l'ait ouverte)
      opts.push({ t: I.t('Rester dans la Cité'), k: '', retour: true });
      S.hideDialog(); const i = await S.menuPick(I.t('Où vas-tu, Idris ?'), opts); k = opts[i] ? opts[i].k : '';
    } finally { S.depth--; S.hideDialog(); C._menu = false; }
    C.journal.push({ quoi: 'menu', k });
    if (k === 'recit') return C.versRecit(); if (k === 'chaine') return C.versChaine();
  };
  // quitter le refuge : son point de reprise n'est pas rangé ; ce que le groupe a gagné reste
  C.quitter = function () { const sv = I.save.data, k = 'idris:' + C.index(); W.persistHeroes(); if (sv.cp && W.cleReprise(sv.cp) === k) sv.cp = null; if (sv.cps) delete sv.cps[k]; if (I.rodeurs) I.rodeurs.finFuite(); I.save.store(); $('#hud').hidden = true; S.hideDialog(); };
  C.versRecit = async function () { const c = C.recit(); if (!c) return C.versChaine(); C.quitter(); C.journal.push({ quoi: 'recit', saga: c.saga, ci: c.ci }); return I.ui.reprendre(c); };
  C.versChaine = async function () {
    C.quitter(); C.journal.push({ quoi: 'chaine' });
    S.depth++; try { await S.fade('out', 300); } finally { S.depth--; }
    await I.ui.showChain(I.perso.dire(I.t('Idris est au fond de la vieille mosquée. La Chaîne tourne dans la pénombre.'))); return S.fade('in', 300);
  };
  // la première fois qu'une chimère des rues approche : personne d'autre ne la voit (rodeurs.js)
  C.vue = function (f) { if (f && f.group && f.group[0] === 'pari' && W.saga && W.saga.id === 'idris') I.ui.unlockCodex('le_pari');   // 2.27 : la fiche « Le Pari », la première fois qu'on le voit
    const e = C.etat(); if (e.vue) return; e.vue = true; I.save.store(); const t = textes().seul; if (t) S.toast(I.fmt(I.esc(t)), 6000); C.journal.push({ quoi: 'seul' });
    if (W.saga && W.saga.id === 'idris') I.ui.unlockCodex('nul_ne_voit'); };   // (le feuillet « Ce que nul ne voit » : des chimères, et non des idées noires)
  // après un combat avec une chimère des rues (rodeurs.js, R.contactRue) : la prière rappelée, puis revoir Maître Yûnus, ou plus tard
  C.apres = async function (f, res) {
    const T = textes(), L = T.rappels || []; if (!L.length || !C.ici()) return;
    const e = C.etat(), k = (e.rappels | 0) % L.length; e.rappels = (e.rappels | 0) + 1; I.save.store(); C.journal.push({ quoi: 'rappel', k, res });
    let oui = false; S.depth++;
    try {
      await S.run([['nar', L[k]]]); S.hideDialog();
      // (2.47 : Maître Yûnus est dans la mosquée ; « Revoir Maître Yûnus » y mène Idris)
      const i = I.debug.auto || !yunusLoin() ? 1 : await S.menuPick(T.question || '', [{ t: I.t('Revoir Maître Yûnus') }, { t: I.t('Plus tard'), retour: true }]);
      oui = i === 0;
    } finally { S.depth--; S.hideDialog(); }
    C.journal.push({ quoi: oui ? 'revoir' : 'plus-tard' });
    if (oui) await C.revoir();
  };
  // Idris est mené à côté de Maître Yûnus, qui lui rappelle son rôle de râwî
  C.revoir = async function () {
    let y = yunusLoin(); if (!y) return; S.depth++;
    try {
      await S.fade('out', 300); if (I.rodeurs) I.rodeurs.finFuite();
      if (y.map !== W.map.id) { W.loadMap(y.map, {}, 'bureau'); W.hud(); y = yunus() || y; }   // (2.47 : jusqu'à la mosquée)
      const p = W.resolve([null, 0, 0], W.map.id, W.player, [Math.floor(y.x / 16) + 1, Math.floor((y.y - 2) / 16)]);
      if (p) { W.player.x = p[0]; W.player.y = p[1]; } W.player.dir = W.player.x > y.x ? 1 : 2; W.stop(); W.resetTrail(); W.updateCam(true);
      await S.fade('in', 300);
      await C.replique(y);
    } finally { S.depth--; S.hideDialog(); }
    W.checkpoint();
  };
})();
