/* ISNAD — le cœur : œuvres et provision, lames, maux du cœur, énigmes, compagnons de lumière.
   Les textes sont du contenu (src/data/coeur.js) ; ici, seulement les règles et le dessin. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, W = I.world;
  const O = I.oeuvres = {};
  const C0 = () => I.sagas.coeur || { oeuvres: {}, lames: {}, animaux: {}, enemies: {} };
  const JOUR = ['dhikr', 'etude', 'jeune', 'aumone', 'visite']; // les œuvres du jour ; la prière et le pèlerinage ont leur propre règle
  const MAX_JOUR = 3, MAX_ZAD = 5;
  O.JOUR = JOUR; O.MAX_JOUR = MAX_JOUR; O.MAX_ZAD = MAX_ZAD;

  /* ----- état sauvegardé ----- */
  function st() {
    const d = I.save.data;
    d.oeuvres = d.oeuvres || {}; d.lames = d.lames || {}; d.vices = d.vices || {}; d.animaux = d.animaux || {}; d.enigmes = d.enigmes || {};
    if (typeof d.zad !== 'number') d.zad = 0;
    return d;
  }
  O.state = st;
  O.zad = () => st().zad;
  O.count = k => st().oeuvres[k] || 0;
  O.hasBlade = v => !!st().lames[v];
  O.viceOf = k => Object.keys(D.VICES).find(v => D.VICES[v].oeuvre === k);
  O.fasting = () => !!S.flags._o_jeune;
  const bas = n => n.replace(/^L(’|a |e )/, (m, x) => 'l' + x); // « L’Avarice » → « l’Avarice » en cours de phrase
  const e_ = v => v === 'orgueil' ? '' : 'e'; // accord : l'orgueil est le seul masculin des sept
  // le Recueil du cœur s'ouvre à mesure : une entrée la première fois que l'on rencontre la chose
  O.learn = function (id) {
    const cid = 'coeur/' + id, sv = I.save.data; if (sv.codex.includes(cid)) return;
    const e = (C0().codex || []).find(c => c.id === id); if (!e) return;
    sv.codex.push(cid); S.toast('Recueil : <b>' + I.esc(e.title) + '</b>');
  };
  const hasPurse = () => !!(I.trade && W.saga && (!W.saga.frame || W.saga.veillees));
  // les lames et les maux tranchés sont visibles des scripts : ['if', 'lame_avarice', …], ['if', 'tranche_avarice', …]
  O.syncFlags = function () {
    const d = st();
    Object.keys(D.VICES).forEach(v => { if (d.lames[v]) S.flags['lame_' + v] = true; else delete S.flags['lame_' + v]; if (d.vices[v] === 'tranche') S.flags['tranche_' + v] = true; else delete S.flags['tranche_' + v]; });
    if (Object.keys(D.VICES).every(v => d.vices[v] === 'tranche')) S.flags.sept_tranches = true; else delete S.flags.sept_tranches;
  };

  /* ----- le chapitre : une journée ----- */
  O.newChapter = function () { Object.keys(S.flags).forEach(k => { if (k.indexOf('_o_') === 0) delete S.flags[k]; }); };
  O.enigme = function () { const e = W.ch && W.ch.enigme; return e && !st().enigmes[e.id] ? e : null; };
  O.afflicted = id => { const e = O.enigme(); return !!(e && e.who === id); };
  O.openChapter = async function () {
    const e = O.enigme();
    if (e && !S.flags._o_enig) { S.flags._o_enig = true; await S.run(e.intro || []); S.toast('Énigme du cœur : <b>' + I.esc(e.title) + '</b>', 4600); }
    W.hud();
  };
  // fin de chapitre : le jeûne s'accomplit au couchant, la caravane du pèlerinage part
  O.endChapter = async function () {
    const T = C0().oeuvres;
    if (S.flags._o_jeune) {
      S.toast(I.esc(T.jeune.fin), 4200);
      if (S.flags._o_jeune_c) await O.gain('jeune', { noZad: true }); // il ne compte pour la lame que s'il a été tenu dans l'épreuve
    }
    if (S.flags._o_hajj) {
      I.audio.sfx('light');
      for (const l of T.hajj.lignes) await S.card('oeuvre', '<div class="orn">' + T.hajj.glyph + '</div><p class="small">Œuvre</p><h1>' + I.esc(T.hajj.name) + '</h1><p>' + I.fmt(l) + '</p><div class="hint">▼</div>', 9000);
      await O.gain('hajj');
    }
    O.newChapter();
  };

  /* ----- accomplir une œuvre ----- */
  O.dayCount = () => JOUR.filter(k => S.flags['_o_' + k]).length;
  // '' si l'œuvre est possible ici et maintenant ; sinon la raison
  O.can = function (k) {
    const T = C0().oeuvres[k]; if (!T || !W.saga) return 'indisponible';
    if (S.flags['_o_' + k]) return k === 'hajj' ? 'intention formulée' : 'déjà accompli aujourd’hui';
    if (k === 'hajj') return !(W.ch && W.ch.hajj) ? 'aucune caravane ne part' : O.count('hajj') >= 1 ? 'déjà accompli' : '';
    if (O.dayCount() >= MAX_JOUR) return 'la journée est pleine';
    if (k === 'aumone') { if (!hasPurse()) return 'pas de bourse ici'; if (I.trade.dirhams() < T.prix) return 'il faut ' + T.prix + ' dirhams'; }
    return '';
  };
  O.gain = async function (k, o) {
    const d = st(); d.oeuvres[k] = (d.oeuvres[k] || 0) + 1;
    O.learn('oeuvres'); O.learn('zad'); if (k === 'dhikr') O.learn('dhikr');
    if (!(o && o.noZad)) d.zad = Math.min(MAX_ZAD, d.zad + (k === 'hajj' ? MAX_ZAD : 1));
    // la première fois dans un règne, l'œuvre élève aussi ce qu'elle bâtit
    const pil = { etude: 'savoir', visite: 'lien', aumone: 'justice' }[k];
    if (pil && !S.flags['op_' + k]) { S.flags['op_' + k] = true; W.pillar(pil, 1); }
    await O.solve(k); await O.forge(k); await O.rally();
    W.hud();
  };
  O.perform = async function (k) {
    const why = O.can(k); if (why) { S.toast(I.esc(why.charAt(0).toUpperCase() + why.slice(1)) + '.', 1800); I.audio.sfx('dark'); return false; }
    const T = C0().oeuvres[k];
    S.flags['_o_' + k] = true;
    S.depth++;
    try {
      I.audio.sfx('light');
      if (k === 'hajj') { S.toast('L’intention est formulée. La caravane du pèlerinage partira à la fin de la veillée.', 5200); }
      else {
        if (k === 'aumone') I.trade.dirhams(-T.prix);
        await S.card('oeuvre', '<div class="orn">' + T.glyph + '</div><p class="small">Œuvre</p><h1>' + I.esc(T.name) + '</h1><p>' + I.fmt(I.pick(T.lignes)) + '</p><p class="small">' + (k === 'jeune' ? 'Provision du cœur +1 · les vivres attendront le soir' : 'Provision du cœur +1') + '</p><div class="hint">▼</div>', 8000);
        if (k === 'jeune') { const d = st(); d.zad = Math.min(MAX_ZAD, d.zad + 1); await O.solve(k); }
        else await O.gain(k);
        if (k === 'dhikr') W.gainSakina(25);
      }
      W.hud(); W.checkpoint();
    } finally { S.depth--; S.hideDialog(); }
    return true;
  };
  // la natte : prier, accomplir les œuvres du jour, sauvegarder
  O.natte = async function () {
    S.depth++;
    try {
      // la première fois : dire en deux lignes ce que la natte permet, dans l'en-tête du menu (un message à part recouvrait les choix)
      let premiere = false; if (!st().vuNatte && !I.debug.auto) { st().vuNatte = true; O.learn('oeuvres'); premiere = true; }
      while (true) {
        const d = st(), left = MAX_JOUR - O.dayCount();
        const titre = { html: 'Une natte tournée vers La Mecque, au cœur de l’étoile.' + (premiere ? '<small>On y prie, et le groupe s’y repose. On y accomplit aussi les œuvres du jour : chacune nourrit la provision du cœur (♥), que les grandes épreuves consomment.</small>' : '') };
        const i = I.debug.auto ? 3 : await S.menuPick(titre, [
          { t: 'Prier et se reposer : Constance et Souffle à 100 %, la Sakîna descend' },
          { t: 'Les œuvres du jour (' + (left > 0 ? 'encore ' + left : 'journée pleine') + ') · provision ♥ ' + d.zad + ' / ' + MAX_ZAD },
          { t: 'Garder une copie de la partie (elle se sauvegarde déjà toute seule)' }, { t: 'Plus tard' }]);
        if (i === 0) { await W.pray(); return; }
        if (i === 2) { await I.ui.saveMenu(); return; }
        if (i === 3) return;
        await O.menu();
      }
    } finally { S.depth--; S.hideDialog(); }
  };
  O.menu = async function () {
    const T = C0().oeuvres;
    while (true) {
      const ks = JOUR.concat(W.ch && W.ch.hajj ? ['hajj'] : []);
      const opts = ks.map(k => { const why = O.can(k), v = O.viceOf(k), n = O.count(k), need = v ? D.VICES[v].need : 0;
        return { k, t: T[k].menu + (k === 'aumone' ? ' (' + T[k].prix + ' dirhams)' : ''), note: why ? why : (v && !O.hasBlade(v) ? C0().lames[v].name + ' ' + Math.min(n, need) + ' / ' + need : v ? 'lame forgée' : '') }; });
      const i = await S.menuPick('Les œuvres du jour · ' + (MAX_JOUR - O.dayCount()) + ' encore possibles', opts.map(o => ({ t: o.t + (o.note ? ' · *' + o.note + '*' : '') })).concat([{ t: 'Retour' }]));
      if (i >= opts.length) return;
      await O.perform(opts[i].k);
    }
  };
  // tests : accomplit ce qui est possible, comme le ferait un joueur appliqué (l'ordre tourne d'un chapitre à l'autre)
  O.auto = async function () {
    const off = ((W.ci || 0) * 2 + (W.saga.order || 0)) % JOUR.length, en = O.enigme();
    let ks = JOUR.slice(off).concat(JOUR.slice(0, off), ['hajj']);
    if (en && JOUR.includes(en.cure)) ks = [en.cure].concat(ks.filter(k => k !== en.cure)); // l'énigme d'abord
    for (const k of ks) {
      if (I.debug.noOeuvres) break;
      if (k === 'aumone' && en && en.cure === 'aumone' && I.trade && I.trade.dirhams() < C0().oeuvres.aumone.prix) I.trade.dirhams(C0().oeuvres.aumone.prix); // le test ne doit pas dépendre de la bourse
      if (!O.can(k)) await O.perform(k);
    }
  };
  // le mal du cœur qui attend au bout d'un maillon (la rencontre de la Cité-Miroir qui le suit), et où en est sa lame
  O.viceApres = function (sagaId) { const fr = I.sagas.idris, c = fr && fr.chapters.find(x => x.after === sagaId); return c && c.vice ? c.vice : null; };
  O.quete = function (v) {
    if (!v) return '';
    const d = st(), V = D.VICES[v], E = C0().enemies[v], L = C0().lames[v], T = C0().oeuvres[V.oeuvre], n = Math.min(O.count(V.oeuvre), V.need);
    if (d.vices[v] === 'tranche') return I.esc(E.name) + ' : tranché' + e_(v);
    return I.esc(E.name) + ' · ' + (d.lames[v] ? 'lame forgée : ' + I.esc(bas(L.name)) : I.esc(L.name) + ' : ' + I.esc(T.court.toLowerCase()) + ' ' + n + ' / ' + V.need);
  };

  /* ----- énigmes ----- */
  O.solve = async function (k) {
    const e = O.enigme(); if (!e) return;
    const h = W.saga.heroes[e.who], nom = h ? h.name : 'Il';
    if (e.cure !== k) { S.toast(I.esc(nom) + ' ne va pas mieux : ce n’était pas ce qui lui manquait.', 3600); return; }
    st().enigmes[e.id] = true; I.audio.sfx('roll'); G.flash('#fff3c8'); O.learn('enigmes');
    await S.run(e.solved || []);
    const xp = Math.round(30 + 14 * W.hero(W.party[0]).lvl), lines = I.battle.grantXP(xp);
    await S.card('victory', '<p class="small">Énigme du cœur</p><h1>' + I.esc(e.title) + '</h1><ul><li>' + I.fmt(e.mot) + '</li><li>Sagesse acquise : <b>+' + xp + '</b></li>' + lines.join('') + '</ul><div class="hint">▼</div>');
    W.pillar('lien', 1); W.healAll();
  };

  /* ----- lames ----- */
  O.forge = async function (k) {
    const v = O.viceOf(k), d = st(); if (!v || d.lames[v] || (d.oeuvres[k] || 0) < D.VICES[v].need) return;
    d.lames[v] = true; O.syncFlags(); O.learn('lames');
    const L = C0().lames[v], E = C0().enemies[v];
    I.audio.sfx('roll'); G.flash(L.couleur); if (D.TRACKS.includes('lame')) I.audio.music('lame');
    await S.card('lame', '<img class="lame" alt="" src="' + O.lameURL(v) + '"><p class="small">Une lame est forgée</p><h1 style="color:' + L.couleur + '">' + I.esc(L.name) + '</h1><p class="ar">' + I.esc(L.ar) + '</p><p>' + I.fmt(L.texte) + '</p><p class="small">Elle tranche ' + I.esc(bas(E.name)) + '</p><div class="hint">▼</div>');
    if (D.TRACKS.includes('lame')) I.audio.back();
  };

  /* ----- compagnons de lumière ----- */
  O.animal = function () { const d = st(); return d.animal && d.animaux[d.animal] ? d.animal : null; };
  O.rally = async function () {
    const d = st(), got = [];
    const cond = { renard: Object.keys(d.enigmes).length >= 1, aigle: Object.keys(d.lames).length >= 1, phenix: Object.keys(d.vices).some(v => d.vices[v] === 'tranche'), lion: (d.pret || 0) >= 3, gazelle: !!(d.parley && d.parley.won >= 5) };
    D.ANIMAUX.forEach(id => { if (cond[id] && !d.animaux[id]) { d.animaux[id] = true; if (!d.animal) d.animal = id; got.push(id); } });
    if (got.length) O.learn('figures_ciel');
    for (const id of got) {
      const A = C0().animaux[id]; I.audio.sfx('light');
      await S.card('animal', '<img class="bete" alt="" src="' + O.animalURL(id) + '"><p class="small">Un compagnon de lumière</p><h1 style="color:' + A.couleur + '">' + I.esc(A.name) + '</h1><p class="ar">' + I.esc(A.ar) + '</p><p>' + I.fmt(A.texte) + '</p><p class="small">' + I.esc(A.don) + ' · ' + I.esc(A.effet) + '</p><div class="hint">▼</div>');
    }
  };

  /* ----- le combat : poids de l'épreuve, provision, maux tranchés ou repoussés ----- */
  const defOf = id => (W.saga && W.saga.enemies[id]) || (I.common && I.common.enemies[id]) || {};
  // 0 : escarmouche · 2 : idole · 3 : mal du cœur
  O.weight = function (opts) {
    if (opts.noir) return 0; if (typeof opts.w === 'number') return opts.w;
    const defs = opts.group.map(defOf);
    return defs.some(d => d.vice) ? 3 : (opts.boss || defs.some(d => d.tier === 'boss')) ? 2 : 0;
  };
  // à l'entrée : l'épreuve consomme la provision ; ce qui manque pèse sur le cœur (allégé à chaque reprise)
  O.enter = function (opts, first) {
    if (!first) { const c = opts._coeur || { w: 0, had: 0, lack: 0 }; c.lack = Math.max(0, c.lack - 1); return c; }
    const d = st(), w = O.weight(opts), had = d.zad, lack = Math.max(0, w - had);
    d.zad = Math.max(0, had - w);
    if (S.flags._o_jeune) S.flags._o_jeune_c = (S.flags._o_jeune_c || 0) + 1;
    return (opts._coeur = { w, had, lack });
  };
  O.leave = async function (opts, foes, result) {
    if (result !== 'win') return;
    const d = st(), c = opts._coeur || {};
    if (c.w >= 2 && !c.lack) d.pret = (d.pret || 0) + 1;
    foes.forEach(e => { const v = e.def.vice; if (v) { d.vices[v] = O.hasBlade(v) ? 'tranche' : (d.vices[v] || 'repousse'); O.learn('maux'); } });
    O.syncFlags();
    await O.rally();
  };
  // dernier chapitre : les maux qui n'ont pas été tranchés se dressent une dernière fois, deux par deux
  O.finale = async function (o) {
    o = o || {}; const d = st(), left = Object.keys(D.VICES).filter(v => d.vices[v] !== 'tranche');
    if (!left.length) { await S.run(o.aucun || []); }
    else {
      await S.run(o.avant || []);
      for (let i = 0; i < left.length; i += 2) {
        const g = left.slice(i, i + 2), noms = g.map(v => C0().enemies[v].name).join(' et ');
        await I.battle.start({ group: g, bg: o.bg || 'cite', boss: true, w: 1, intro: noms + (g.length > 1 ? ' se dressent.' : ' se dresse.') + (g.some(v => O.hasBlade(v)) ? ' Une lame attend son heure.' : '') });
        W.healAll();
      }
    }
    O.syncFlags();
    const n = Object.keys(D.VICES).filter(v => d.vices[v] === 'tranche').length, L = C0().lames, E = C0().enemies;
    await S.card('victory', '<p class="small">Les sept maux du cœur</p><h1>' + (n === 7 ? 'Les sept sont tranchés' : n + ' tranché' + (n > 1 ? 's' : '') + ' sur sept') + '</h1><ul>' +
      Object.keys(D.VICES).map(v => '<li>' + I.esc(E[v].name) + ' : ' + (d.vices[v] === 'tranche' ? '<b>tranché' + e_(v) + '</b> par ' + I.esc(bas(L[v].name)) : 'repoussé' + e_(v) + ' ; ' + (v === 'orgueil' ? 'il' : 'elle') + ' reviendra') + '</li>').join('') +
      '</ul><p class="small">' + (n === 7 ? 'Aucun ne reviendra de ton vivant. Les suivants auront les leurs à trancher.' : 'Une lame se forge par l’œuvre : ce qui n’est que repoussé revient.') + '</p><div class="hint">▼</div>');
    await S.run(n === 7 ? (o.tous || []) : (o.reste || []));
  };

  /* ----- dessin : lames et figures du ciel, sans inscription ni trait ----- */
  const cache = {};
  // une lame droite, à double tranchant ; la couleur est celle de la vertu
  O.lame = function (v) {
    if (cache['l' + v]) return cache['l' + v];
    const col = (C0().lames[v] || {}).couleur || '#e6dcc4', cv = G.mk(18, 44), c = cv.getContext('2d'), R = (x, y, w, h, k) => { c.fillStyle = k; c.fillRect(x, y, w, h); };
    const hi = G.shade(col, 1.55), mid = G.shade(col, 1.15), lo = G.shade(col, 0.62), dk = '#1a1420', gold = '#e9c877', gold2 = '#a8843a';
    // liseré
    R(7, 1, 4, 1, dk); R(6, 2, 6, 27, dk); R(3, 28, 12, 4, dk); R(6, 31, 6, 9, dk); R(5, 39, 8, 4, dk);
    // lame : pointe, plat clair, tranchant sombre, gouttière
    R(8, 2, 2, 1, hi); R(7, 3, 4, 25, mid); R(7, 3, 1, 25, hi); R(10, 3, 1, 25, lo); R(8, 6, 1, 20, lo); R(9, 6, 1, 20, hi);
    // garde, fusée, pommeau
    R(4, 29, 10, 2, gold); R(4, 30, 10, 1, gold2); R(4, 29, 1, 2, hi); R(13, 29, 1, 2, gold2);
    R(7, 31, 4, 8, '#4a3526'); R(7, 32, 4, 1, '#2f2118'); R(7, 34, 4, 1, '#2f2118'); R(7, 36, 4, 1, '#2f2118');
    R(6, 39, 6, 3, gold); R(6, 41, 6, 1, gold2); R(8, 40, 2, 1, col);
    return (cache['l' + v] = cv);
  };
  O.lameURL = v => cache['lu' + v] || (cache['lu' + v] = O.lame(v).toDataURL());
  // figures du ciel : une silhouette de lumière semée d'étoiles, de profil, sans aucun trait
  // deux tailles : la grande pour le combat et la halte, la petite pour suivre le groupe dans la fiction
  const BETES = {
    renard: ['......#.....#...............', '.....##....##...............', '.....###..###...............', '.....########...............', '....#########...............', '...##########..........oo...', '..###########.........oooo..', '...###########.......#oooo..', '.....##########.....###oo...', '......#################.....', '......################......', '......###############.......', '......###.#####..####.......', '......##...###....###.......', '......##...##.....##........', '.....###..###....###........'],
    aigle: ['.............##.............', '............####............', '#...........####...........#', '##.#.......######.......#.##', '####.#....########....#.####', '.######..##########..######.', '..########################..', '...######################...', '.....##################.....', '.......##############.......', '.........##########.........', '..........########..........', '.........##########.........', '........###.####.###........', '........#...####...#........'],
    phenix: ['...o.................o......', '...oo...............oo......', '..#oo......o.......ooo......', '..###.....###.....#oo.......', '..####...#####...###o.......', '...####..#####..####........', '...#####..###..#####........', '....################........', '.....##############.........', '......############..........', '.......##########...........', '........########............', '.......###.####.#o..........', '......##...###...oo.........', '.....#o....##.o...oo........', '....oo....##...oo..oo.......', '...oo.....#.....oo..o.......', '..........o......o..........'],
    lion: ['....#####...................', '..#########.............oo..', '.###########...........o#o..', '.############..........#....', '#############.........#.....', '##############.......##.....', '.#########################..', '.########################...', '..#######################...', '...######################...', '....####################....', '....#####......#########....', '....####........###.####....', '....###.........###..###....', '....###.........###..###....', '...####........####.####....'],
    gazelle: ['...#....#...................', '...#...#....................', '...#..#.....................', '...#.##.....................', '...####.....................', '..#####.....................', '.######.....................', '..#####..............#......', '...####.............##......', '....####....############....', '....####################....', '.....###################....', '.....##################.....', '.....####..........####.....', '.....#.#...........#..#.....', '.....#.#...........#..#.....', '....#..#..........#...#.....', '....#..#..........#...#.....']
  };
  const PETITES = {
    renard: ['..#...#...............', '.##..##...............', '.######...............', '########.........###..', '.#########.....######.', '..###############oo##.', '...##############oo#..', '...#############......', '...####.....####......', '...##........##.......', '...##........##.......', '..##........##........'],
    aigle: ['##................##', '.###............###.', '..#####......#####..', '...##############...', '.....##########.....', '......########......', '.....###.##.###.....', '.........##.........', '........####........', '........#..#........'],
    phenix: ['...o........o...', '..###......###..', '...####..####...', '....########....', '.....######.....', '......####......', '......####......', '.....#o##o#.....', '....o..oo..o....', '...o...oo...o...'],
    lion: ['..###.............o.', '.#####...........#o.', '#######.........#...', '#######.#########...', '.###############....', '..##############....', '..###.###..#####....', '..##...##...##.##...', '..##...##...##.##...', '.###..###..###.###..'],
    gazelle: ['.#..#...............', '.#.#................', '.###................', '####..........#.....', '.###.....########...', '..##############....', '..#############.....', '..##.#......#.##....', '..#..#......#..#....', '.#...#.....#...#....']
  };
  O.bete = function (id, petit) {
    const ck = (petit ? 'p' : 'b') + id; if (cache[ck]) return cache[ck];
    const g = (petit ? PETITES : BETES)[id] || BETES.renard, w = g[0].length + 2, h = g.length + 2, cv = G.mk(w, h), c = cv.getContext('2d'), col = (C0().animaux[id] || {}).couleur || '#ffe9a8';
    const at = (x, y) => (g[y] && g[y][x] && g[y][x] !== '.') ? g[y][x] : null, r = I.rng(I.hash('bete' + id));
    for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) {
      const k = at(x, y);
      if (!k) { if (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) { c.fillStyle = 'rgba(20,14,40,.55)'; c.fillRect(x + 1, y + 1, 1, 1); } continue; }
      const top = !at(x, y - 1), bot = !at(x, y + 1);
      c.fillStyle = k === 'o' ? G.shade(col, 1.6) : top ? G.shade(col, 1.35) : bot ? G.shade(col, 0.7) : col; c.fillRect(x + 1, y + 1, 1, 1);
      if (!top && !bot && r() < 0.09) { c.fillStyle = '#ffffff'; c.fillRect(x + 1, y + 1, 1, 1); } // étoiles
    }
    return (cache[ck] = cv);
  };
  O.animalURL = function (id) {
    if (cache['bu' + id]) return cache['bu' + id];
    const s = O.bete(id), k = 3, cv = G.mk(s.width * k, s.height * k), c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(s, 0, 0, cv.width, cv.height);
    return (cache['bu' + id] = cv.toDataURL());
  };

  /* ----- pages de la halte ----- */
  O.paneOeuvres = function () {
    const d = st(), T = C0().oeuvres, L = C0().lames, E = C0().enemies;
    let h = '<h3>Œuvres et lames</h3><p>Provision du cœur : <b>♥ ' + d.zad + ' / ' + MAX_ZAD + '</b>. Chaque œuvre y ajoute ; une idole en demande 2, un mal du cœur 3. Qui s’y présente sans provision combat le cœur lourd.</p>' +
      '<p class="src">Les œuvres s’accomplissent sur la natte d’une mosquée : trois par chapitre au plus, la prière en sus.' + (O.fasting() ? ' <b>Jeûne en cours</b> : les vivres attendent le soir.' : '') + '</p>';
    h += '<div class="lames">' + Object.keys(D.VICES).map(v => { const V = D.VICES[v], n = O.count(V.oeuvre), ok = !!d.lames[v], stt = d.vices[v];
      return '<div class="lm' + (ok ? ' ok' : '') + '"><img alt="" src="' + O.lameURL(v) + '"><div><b style="color:' + (ok ? L[v].couleur : 'inherit') + '">' + I.esc(L[v].name) + '</b> <small>' + I.esc(L[v].ar) + '</small><br><small>' + I.esc(T[V.oeuvre].court) + ' ' + Math.min(n, V.need) + ' / ' + V.need + ' · contre ' + I.esc(bas(E[v].name)) + (stt === 'tranche' ? ' — <b>tranché' + e_(v) + '</b>' : stt === 'repousse' ? ' — repoussé' + e_(v) : '') + '</small></div></div>'; }).join('') + '</div>';
    return h + '<p class="src">Les lames sont une image : une vertu pratiquée, qui tranche le mal contraire. Ce ne sont pas des reliques.</p>';
  };
  O.paneAnimaux = function () {
    const d = st(), A = C0().animaux, cur = O.animal();
    return '<h3>Compagnons de lumière</h3><p>Des figures du ciel, qui prennent corps dans la noosphère. Un seul t’accompagne au combat : choisis-le dans la liste.</p>' +
      D.ANIMAUX.map(id => d.animaux[id]
        ? '<div class="stat bete' + (cur === id ? ' cur' : '') + '"><img class="fig" alt="" src="' + O.animalURL(id) + '"><div><b style="color:' + A[id].couleur + '">' + I.esc(A[id].name) + '</b> <small>' + I.esc(A[id].ar) + (cur === id ? ' · à tes côtés' : '') + '</small><br><small><b>' + I.esc(A[id].don) + '</b> · ' + I.esc(A[id].effet) + '</small><div class="sk">' + I.fmt(A[id].texte) + '</div></div></div>'
        : '<div class="stat bete off"><span class="fig">?</span><div><b>Une figure du ciel</b><br><small>' + I.esc(A[id].vient) + '</small></div></div>').join('') +
      '<p class="src">Fiction : aucun de ces compagnons n’appartient au récit historique.</p>';
  };
})();
