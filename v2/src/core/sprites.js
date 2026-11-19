/* ISNAD — personnages : silhouettes dessinées au pixel, à la manière des jeux 16 bits. Personne n'a de visage :
   ni yeux, ni bouche, ni trait. Les Compagnons portent un voile de lumière ; le caractère passe par la
   coiffe, le costume, l'attribut et la pose.
   Un personnage = une tête (11 lignes, selon la coiffe) + un corps (13 lignes, selon le pas ou la pose),
   en gabarits de 16 × 24 dont chaque lettre nomme une matière. Le « grand » sprite (32 × 48 : combat,
   dialogue, équipement, livret) a ses propres gabarits, de 32 de large, dessinés d'après les modèles du
   décideur : la même composition, redessinée finement (voir « le grand sprite natif », plus bas). */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = window.ISNAD_DEFS;
  const W = 16, H = 24;

  /* ---------- gabarits : têtes ----------
     T t u coiffe (clair, moyen, sombre) · A a bandeau · V v voile ou face unie · I i fer · X cimier */
  const HEADS = {
    imama: {
      d: ['................', '.....tTTTTt.....', '....TTTTutTu....', '...TTTuuTTTtu...', '...TuuTTTTutu...', '...aAAAAAAAAa...',
          '...uvVVVVVVvu...', '...uVVVVVVVVu...', '...uVVVVVVVVu...', '....vVVVVVVv....', '.....uvvvvu.....'],
      l: ['................', '.....tTTTTt.....', '....TTTTutTu....', '...TTTuuTTTtu...', '...TuuTTTTutu...', '...AAAAAAAAaa...',
          '...VVVVvuttuu...', '...VVVVVuttuu...', '...VVVVVutuuu...', '...vVVVvuuuu....', '....vvvuuu......'],
      u: ['................', '.....tTTTTt.....', '....TTTTutTu....', '...TTTuuTTTtu...', '...TuuTTTTutu...', '...aAAAAAAAAa...',
          '...TTtTTtttuu...', '...TtTTttuuuu...', '...ttTtutuuuu...', '....tuutuuuu....', '.....uutuuu.....']
    },
    casque: {
      d: ['.......II.......', '......IIIi......', '....IIIIIIii....', '...IIIIIIIiii...', '...IIiIIIiiii...', '...iiiiiiiiii...',
          '...ivVVVVVVvi...', '...iVVVVVVVVi...', '...iiVVVVVVii...', '...iIivVVviIi...', '....iiIiiIii....'],
      l: ['......II........', '.....IIIi.......', '...IIIIIIii.....', '...IIIIIIiiii...', '...IIiIIiiiii...', '...iiiiiiiiii...',
          '...VVVVviiIii...', '...VVVVViIiii...', '...VVVViiiIii...', '...vVViIiiii....', '....iiiiIii.....'],
      u: ['.......II.......', '......IIIi......', '....IIIIIIii....', '...IIIIIIIiii...', '...IIiIIIiiii...', '...iiiiiiiiii...',
          '...iIiiIiiIii...', '...iiIiiIiiii...', '...iIiiIiiIii...', '...iiiIiiIiii...', '....iiIiiiii....']
    },
    capuche: {
      d: ['................', '......tTTt......', '....TTTTTttu....', '...TTTTttttuu...', '..TTTtuuuuttuu..', '..TTuvVVVVvutu..',
          '..TtuVVVVVVutu..', '..ttuVVVVVVutu..', '..ttuVVVVVVutu..', '..tuuvVVVVvuuu..', '...tuuvvvvuuu...'],
      l: ['................', '......tTTTt.....', '....TTTTTtttu...', '...TTTTtttttuu..', '..TTTtttttttuu..', '..TuVVVvttttuu..',
          '..uVVVVVtttuuu..', '..uVVVVVttuuuu..', '..uVVVVVttuuu...', '..tuVVVutuuu....', '...tuuuutuu.....'],
      u: ['................', '......tTTt......', '....TTTTTttu....', '...TTTTTttttu...', '..TTTtTTttttuu..', '..TTtTTtttttuu..',
          '..TttTttttuuuu..', '..Tttttuttuuuu..', '..tttutttuuuu...', '..ttuuttuuuu....', '...tuuuuuuu.....']
    },
    tiare: {
      d: ['.....tTTTTt.....', '....TTTTTTtt....', '....TTTTTttu....', '....AAAAAAaa....', '...uTTTTTtttu...', '...uuuuuuuuuu...',
          '...uvVVVVVVvu...', '...uVVVVVVVVu...', '...uVVVVVVVVu...', '....vVVVVVVv....', '.....uvvvvu.....'],
      l: ['.....tTTTTt.....', '....TTTTTTtt....', '....TTTTTttu....', '....AAAAAAaa....', '...TTTTTttttu...', '...uuuuuuuuuu...',
          '...VVVVvuttuu...', '...VVVVVuttuu...', '...VVVVVutuu....', '...vVVVvuuu.....', '....vvvuu.......'],
      u: ['.....tTTTTt.....', '....TTTTTTtt....', '....TTTTTttu....', '....AAAAAAaa....', '...TTTTTttttu...', '...TTtTTtttuu...',
          '...TtTTttttuu...', '...ttTtttuuuu...', '...tttuttuuu....', '....tuuuuuu.....', '.....uuuuu......']
    },
    litham: {
      d: ['................', '.....tTTTTt.....', '....TTTTutTu....', '...TTTuuTTTtu...', '...TuuTTTTutu...', '...uuuuuuuuuu...',
          '...uVVVVVVVVu...', '...tTTTuTTttu...', '...TTuTTTtttu...', '....tTTtttuu....', '.....ttuuuu.....'],
      l: ['................', '.....tTTTTt.....', '....TTTTutTu....', '...TTTuuTTTtu...', '...TuuTTTTutu...', '...uuuuuuuuuu...',
          '...VVVVVutttu...', '...TTTuTuttuu...', '...TTuTtutuu....', '...tTtttuuu.....', '....ttuuu.......'],
      u: null // de dos : comme le turban
    }
  };
  HEADS.litham.u = HEADS.imama.u;
  // étoffe de tête des gens du désert : un voile retenu par un cordon, qui retombe sur les épaules (stylisation)
  HEADS.keffieh = {
    d: ['................', '.....tTTTTt.....', '....TTTTTTtu....', '...aAAAAAAAAa...', '...TTTtTTTTtu...', '..tTuuuuuuuutu..',
        '..TTuVVVVVVutu..', '..TtuVVVVVVutu..', '..TtuVVVVVVutu..', '..TTtuVVVVutuu..', '..tTttuvvuttuu..'],
    l: ['................', '.....tTTTTt.....', '....TTTTTTtu....', '...AAAAAAAAaa...', '...TTTtTTTTtu...', '..tuuuuuTTttu...',
        '..VVVVVuTTtttu..', '..VVVVVuTtttuu..', '..VVVVVuTTttuu..', '...vVVvuTtttuu..', '....vvutTttuuu..'],
    u: ['................', '.....tTTTTt.....', '....TTTTTTtu....', '...aAAAAAAAAa...', '...TTTtTTTTtu...', '..tTTTtTTTtttu..',
        '..TTtTTTtTTttu..', '..TtTTtTTtTttu..', '..TTtTTtTTtttu..', '..TtTTtTTtttuu..', '..tTttTttTttuu..']
  };

  // d'autres façons de se couvrir la tête : la silhouette dit qui est qui, avant même la couleur
  const BAS_D = ['...uvVVVVVVvu...', '...uVVVVVVVVu...', '...uVVVVVVVVu...', '....vVVVVVVv....', '.....uvvvvu.....'];
  const BAS_L = ['...VVVVvuttuu...', '...VVVVVuttuu...', '...VVVVVutuuu...', '...vVVVvuuuu....', '....vvvuuu......'];
  const BAS_U = ['...TTtTTtttuu...', '...TtTTttuuuu...', '...ttTtutuuuu...', '....tuutuuuu....', '.....uutuuu.....'];
  // turban haut, enroulé serré
  { const haut = ['......tTTt......', '.....TTTTut.....', '....TTTuTTtu....', '....TuuTTTtu....', '...TTTTuuTTtu...'];
    HEADS.imama_haute = { d: haut.concat(['...aAAAAAAAAa...'], BAS_D), l: haut.concat(['...AAAAAAAAaa...'], BAS_L), u: haut.concat(['...aAAAAAAAAa...'], BAS_U) }; }
  // turban large et bas
  { const large = ['................', '................', '...tTTTTTTTTt...', '..TTTuuTTTuTTu..', '..TuuTTTTuuTtu..'];
    HEADS.imama_large = { d: large.concat(['...aAAAAAAAAa...'], BAS_D), l: large.concat(['...AAAAAAAAaa...'], BAS_L), u: large.concat(['...aAAAAAAAAa...'], BAS_U) }; }
  // turban dont un pan retombe sur l'épaule (le corps prolonge le pan : voir grid)
  HEADS.imama_queue = {
    d: ['................', '.....tTTTTt.....', '....TTTTutTu....', '...TTTuuTTTtu...', '...TuuTTTTutu...', '...aAAAAAAAAaT..',
        '...uvVVVVVVvuTt.', '...uVVVVVVVVutT.', '...uVVVVVVVVuTt.', '....vVVVVVVv.tT.', '.....uvvvvu..Tt.'],
    l: ['................', '.....tTTTTt.....', '....TTTTutTu....', '...TTTuuTTTtu...', '...TuuTTTTutu...', '...AAAAAAAAaaT..',
        '...VVVVvuttuuTt.', '...VVVVVuttuutT.', '...VVVVVutuuuTt.', '...vVVVvuuuu.tT.', '....vvvuuu...Tt.'],
    u: ['................', '.....tTTTTt.....', '....TTTTutTu....', '...TTTuuTTTtu...', '...TuuTTTTutu...', '...aAAAAAAAAa...',
        '...TTtTTTTttuu..', '...TttTTTtuuuu..', '...tttuTTuuuuu..', '....tuuTTuuu....', '.....uuTTuu.....']
  };
  // calotte : une coiffe basse, l'étoffe serrée autour de la tête
  HEADS.calotte = {
    d: ['................', '................', '.....tTTTTt.....', '....TTTTTTtu....', '....aAAAAAAa....', '...tuVVVVVVut...',
        '...uvVVVVVVvu...', '...uVVVVVVVVu...', '...uVVVVVVVVu...', '....vVVVVVVv....', '.....uvvvvu.....'],
    l: ['................', '................', '.....tTTTTt.....', '....TTTTTTtu....', '....AAAAAAaa....', '...VVVVvtttuu...',
        '...VVVVVtttuu...', '...VVVVVttuuu...', '...VVVVVtuuu....', '...vVVVvuuu.....', '....vvvuu.......'],
    u: ['................', '................', '.....tTTTTt.....', '....TTTTTTtu....', '....aAAAAAAa....', '...tTTtTTtttu...',
        '...TtTTtTttuu...', '...tTttTtuuuu...', '...ttTtutuuu....', '....tuutuuu.....', '.....uutuu......']
  };
  // casque pointu ceint d'un turban, camail de mailles sur la nuque
  HEADS.casque_turban = {
    d: ['.......II.......', '......IIIi......', '.....IIIIii.....', '....IIIIIIii....', '...tTTTuTTTtu...', '...TuuTTTuuTt...',
        '...ivVVVVVVvi...', '...iVVVVVVVVi...', '...iiVVVVVVii...', '...iIivVVviIi...', '....iiIiiIii....'],
    l: ['......II........', '.....IIIi.......', '....IIIIIii.....', '...IIIIIIiii....', '...TTTuTTTttu...', '...TuuTTuuTtu...',
        '...VVVVviiIii...', '...VVVVViIiii...', '...VVVViiiIii...', '...vVViIiiii....', '....iiiiIii.....'],
    u: ['.......II.......', '......IIIi......', '.....IIIIii.....', '....IIIIIIii....', '...tTTTuTTTtu...', '...TuuTTTuuTt...',
        '...iIiiIiiIii...', '...iiIiiIiiii...', '...iIiiIiiIii...', '...iiiIiiIiii...', '....iiIiiiii....']
  };

  // casque de cuir : la calotte de fer sans sa pointe, en cuir durci (W w)
  { const cuir = r => r.replace(/I/g, 'W').replace(/i/g, 'w'), galon = r => r.replace(/[Ii]/g, 'a'), cal = (rows, bas) => ['................', '................'].concat(rows.slice(2, 5).map(cuir), [galon(rows[5])], bas);
    HEADS.casque_cuir = { d: cal(HEADS.casque.d, BAS_D), l: cal(HEADS.casque.l, BAS_L), u: cal(HEADS.casque.u, BAS_U) }; }
  // casque à bandes : plaques rivées sous des bandes (A a), sans pointe
  { const bande = (rows, xs) => rows.map((r, j) => { if (j === 0) return '................'; const a = r.split(''); if (j === 5) return a.map((m, x) => m === 'i' || m === 'I' ? (x % 2 ? 'W' : 'w') : m).join(''); if (j >= 2 && j <= 4) xs.forEach(x => { if (a[x] === 'I' || a[x] === 'i') a[x] = 'w'; }); return a.join(''); });
    HEADS.casque_bandes = { d: bande(HEADS.casque.d, [5, 10]), l: bande(HEADS.casque.l, [4, 8]), u: bande(HEADS.casque.u, [5, 10]) }; }
  // coiffe de mailles : un capuchon d'anneaux (I i en damier), taillé sur la capuche
  { const mail = rows => rows.map((r, y) => r.split('').map((m, x) => 'Ttu'.indexOf(m) >= 0 ? ((x + y) % 2 ? 'I' : 'i') : m).join(''));
    HEADS.coiffe_mailles = { d: mail(HEADS.capuche.d), l: mail(HEADS.capuche.l), u: mail(HEADS.capuche.u) }; }

  /* ---------- gabarits : corps ----------
     R r buste · S s jupe · L l bas de jupe (jambes si la tenue est courte) · M entre-jambes · Z ourlet
     C c k manteau · E e pans du manteau (absents si la tenue est courte) · B b m bas du dos · A a ceinture · N main · F f pied */
  const TOP_D = ['....CCrAArCC....', '...CCcrRRrcCC...', '...CckRRRRkcC...', '...CckRRRrkcC...', '...CkaAAAAakC...'];
  const LOW_D = ['....kSSSsSSk....', '...ckSSsSSSkc...', '...ekLLMMLLke...', '..eekLlMMLlkee..', '..eekZZMMZZkee..'];
  const TOP_L = ['.....rAArCCc....', '....RRrCCCcc....', '....RRkCCckc....', '....RRkCCckc....', '....AakCcckc....'];
  const LOW_L = ['....SSsSSkcc....', '....SSsSskcc....', '...LLLlLlkee....', '...LLlLllkeeE...', '...ZZZZZZZkee...'];
  const TOP_U = ['....CCCtuCCc....', '...CCCCtuCccc...', '...CCcCtuCckC...', '...CCcCCcCckC...', '...CCcCCcCccC...'];
  const LOW_U = ['....CcCCcCck....', '...CCcCccCckc...', '...EeBBmmBbke...', '..EeeBbmmBbkee..', '..eekZZMMZZkee..'];
  const FEET = ['....FFf..FFf....', '....FFf..FFf....'], FEET_A = ['....FFf..Ff.....', '....FFf.........'], FEET_B = ['.....fF..FFf....', '.........FFf....'];
  const SIDE = ['......FFFf......', '......FFFf......'], SIDE_A = ['...FFf....Ff....', '...FFf..........'], SIDE_B = ['....Ff...FFf....', '.........FFf....'];
  const body = (top, mid, low, feet) => top.concat([mid], low, feet);
  const BODIES = {
    d: [
      body(TOP_D, '...NkSSSSSSkN...', LOW_D, FEET),
      body(TOP_D.slice(0, 4).concat(['...CkaAAAAakN...']), '...CkSSSSSSk....', ['...NkSSSsSSk....'].concat(LOW_D.slice(1)), FEET_A),
      body(TOP_D.slice(0, 4).concat(['...NkaAAAAakC...']), '....kSSSSSSkC...', ['....kSSSsSSkN...'].concat(LOW_D.slice(1)), FEET_B)
    ],
    l: [
      body(TOP_L, '....SSkNNkcc....', LOW_L, SIDE),
      body(TOP_L.slice(0, 2).concat(['....RkCCckkc....', '....RkCCckkc....', '....AkCcckkc....']), '....SNNkkkcc....', LOW_L, SIDE_A),
      body(TOP_L.slice(0, 2).concat(['....RRrkCCkc....', '....RRrkCCkc....', '....AaakCckc....']), '....SSskNNcc....', LOW_L, SIDE_B)
    ],
    u: [
      body(TOP_U, '...NCcCCcCckN...', LOW_U, FEET),
      body(TOP_U.slice(0, 4).concat(['...CCcCCcCccN...']), '...CCcCCcCck....', ['...NcCCcCCck....'].concat(LOW_U.slice(1)), FEET_A),
      body(TOP_U.slice(0, 4).concat(['...NCcCCcCccC...']), '....CcCCcCckC...', ['....CcCCcCckN...'].concat(LOW_U.slice(1)), FEET_B)
    ]
  };

  /* ---------- poses : le corps parle ----------
     hy : la tête s'incline · kneel : corps de 8 lignes posé au sol · extra : pixels ajoutés par-dessus [x, y, matière] */
  const POSES = {
    // recueillement : debout, la tête inclinée, les mains posées l'une sur l'autre
    prie: { hy: 1,
      d: body(TOP_D.slice(0, 2).concat(['...CckRNNRkcC...', '...CckRNNrkcC...', '...CkaAAAAakC...']), '....kSSSSSSk....', LOW_D, FEET),
      l: body(TOP_L.slice(0, 2).concat(['....RRkCCckc....', '...NNCCCcckc....', '....AakkkkCc....']), '....SSsSSkcc....', LOW_L, SIDE),
      u: body(TOP_U, '....CcCCcCck....', LOW_U, FEET) },
    // résolution : un bras levé, la tête droite
    resolu: {
      d: body(['....CCrAArCC....', '.CCCCcrRRrcCC...', '....ckRRRRkcC...', '....ckRRRrkcC...', '....kaAAAAakC...'], '....kSSSSSSkN...', LOW_D, FEET),
      extraD: [[1, 11, 'C'], [2, 11, 'c'], [1, 10, 'C'], [2, 10, 'c'], [1, 9, 'C'], [2, 9, 'c'], [1, 8, 'C'], [2, 8, 'c'], [1, 7, 'C'], [2, 7, 'c'], [1, 6, 'N'], [2, 6, 'N'], [1, 5, 'N'], [2, 5, 'N']],
      l: body(['.....rAArCCc....', '...CRRrCCCcc....', '....RRrkckkc....', '....RRrkckkc....', '....Aaakckkc....'], '....SSsSSkcc....', LOW_L, SIDE),
      extraL: [[2, 11, 'C'], [3, 11, 'c'], [1, 10, 'C'], [2, 10, 'c'], [1, 9, 'C'], [2, 9, 'c'], [0, 8, 'C'], [1, 8, 'c'], [0, 7, 'N'], [1, 7, 'N'], [0, 6, 'N']],
      u: body(['....CCCtuCCc....', '...CCCCtuCcccCC.', '...CCcCtuCck....', '...CCcCCcCck....', '...CCcCCcCcc....'], '...NCcCCcCck....', LOW_U, FEET),
      extraU: [[13, 11, 'C'], [14, 11, 'c'], [13, 10, 'C'], [14, 10, 'c'], [13, 9, 'C'], [14, 9, 'c'], [13, 8, 'C'], [14, 8, 'c'], [13, 7, 'C'], [14, 7, 'c'], [13, 6, 'N'], [14, 6, 'N'], [13, 5, 'N'], [14, 5, 'N']] },
    // accablement : à genoux, la tête basse
    accable: { hy: 1, kneel: true,
      d: ['....CCrAArCC....', '...CCcrRRrcCC...', '...CckRRRRkcC...', '...CckRRRrkcC...', '...CkaAAAAakC...', '..EkNSSSSSSNkE..', '..ekLLLLLLLLke..', '.eekZZZZZZZZkee.'],
      l: ['.....rAArCCc....', '....RRrCCCcc....', '....RRkCCckc....', '...NNCCCckkc....', '....AakkkkCc....', '...SSSsSSkccE...', '..LLLLlLlkkeeE..', '..ZZZZZZZZkeee..'],
      u: ['....CCCtuCCc....', '...CCCCtuCccc...', '...CCcCtuCckC...', '...CCcCCcCckC...', '...CCcCCcCccC...', '..ECcCCcCcckcE..', '..EeBBbmmBbkee..', '.eekZZZMMZZZkee.'] },
    // salut : la main sur le cœur
    salut: {
      d: body(TOP_D.slice(0, 2).concat(['...CckNNRRkcC...', '...CkCCcRrkcC...', '...CkaAAAAakC...']), '....kSSSSSSkN...', LOW_D, FEET),
      l: body(TOP_L.slice(0, 2).concat(['....RNNCCckc....', '....RRkCCckc....', '....AakkkkCc....']), '....SSsSSkcc....', LOW_L, SIDE) },
    // surprise : les bras s'écartent (le moteur ajoute un petit sursaut)
    surpris: {
      d: body(['....CCrAArCC....', '.NCCCcrRRrcCCCN.', '....ckRRRRkc....', '....ckRRRrkc....', '....kaAAAAak....'], '....kSSSSSSk....', LOW_D, FEET),
      l: body(['.....rAArCCc....', '.NCCCRrCCCcc....', '....RRrkckkc....', '....RRrkckkcCN..', '....Aaakckkc....'], '....SSsSSkcc....', LOW_L, SIDE) },
    // garde : le manteau ramené devant soi
    garde: {
      d: body(TOP_D.slice(0, 2).concat(['...CckCCCCkcC...', '...CcCCccCCcC...', '...CkaAAAAakC...']), '....kSSSSSSk....', LOW_D, FEET),
      l: body(['.....rAArCCc....', '...CCCrCCCcc....', '..CCCcCCCckc....', '..CCccCCcckc....', '..CCccNCcckc....'], '..CcccSSSkcc....', LOW_L, SIDE) }
  };
  D.POSES.forEach(p => { if (!POSES[p]) throw new Error('pose sans dessin : ' + p); });

  /* ---------- types de personnages : coiffe, tenue, attribut ---------- */
  const KINDS = {
    compagnon: { coiffe: 'imama', lit: true }, homme: { coiffe: 'imama', varie: true }, ancien: { coiffe: 'imama_queue', chale: true, item: 'baton' },
    savant: { coiffe: 'imama_large', chale: true, item: 'feuillets' }, marchand: { coiffe: 'imama_haute', item: 'bourse', trim: '#d9b45a', motif: 'rayures' },
    soldat: { coiffe: 'casque', court: true, item: 'lance', troupe: 'soldat' }, romain: { coiffe: 'casque', court: true, item: 'lance', cimier: true, cuirasse: true, troupe: 'romain' },
    perse: { coiffe: 'tiare', trim: '#d9b45a' }, moine: { coiffe: 'capuche', sombre: true, trim: '#c9b99a' }, enfant: { coiffe: 'calotte', petit: true, manteau: 'aucun' },
    marin: { coiffe: 'calotte', court: true, raies: true, manteau: 'aucun' }, cyber: { coiffe: 'capuche', court: true, sombre: true, neon: true }, berbere: { coiffe: 'litham' },
    // 2.x (D193) — cyber : le râwî, et lui seul — la bande et la ceinture de néon sont sa marque. citadin : les autres habitants
    // de 2084 (la Cité-Miroir) : la capuche et l'habit court de la ville, sans le néon (précision du décideur : « les autres
    // habitants de la Cité-Miroir ne doivent pas ressembler à Idris »)
    citadin: { coiffe: 'capuche', court: true, sombre: true, cite: true },
    bedouin: { coiffe: 'keffieh', drape: true, trim: '#3a2a20' } // gens des tribus : la couleur du cordon et du galon (look.trim) dit le clan
  };

  // les gens sans nom ne se ressemblent pas tous : coiffe et manteau choisis d'après leurs couleurs, toujours les mêmes pour un même personnage
  const VARIE = [['imama', 'long'], ['calotte', 'aucun'], ['imama_queue', 'long'], ['imama_large', 'epaule'], ['imama_haute', 'aucun'], ['calotte', 'epaule']];
  // les gens d'armes non plus : casque, arme, bouclier et armure varient d'un homme à l'autre (look.sel : qui il est)
  const TROUPES = {
    soldat: [['casque', 'lance', null], ['casque_turban', ['sabre', 'bouclier_cuir'], 'cuir'], ['casque_cuir', 'arc', null], ['coiffe_mailles', ['lance', 'bouclier_bois'], 'mailles'], ['casque', ['sabre', 'bouclier'], 'mailles'], ['casque_bandes', 'masse', 'cuir'], ['casque_cuir', ['lance', 'bouclier_cuir'], 'matelasse']],
    romain: [['casque', ['lance', 'pavois'], 'lamelles'], ['casque_bandes', ['lance', 'pavois'], 'mailles'], ['casque', ['sabre', 'bouclier'], 'lamelles'], ['casque_bandes', 'arc', 'cuir']]
  };
  function kindOf(look) {
    const K = Object.assign({}, KINDS[look.kind] || KINDS.homme);
    if (K.troupe && look.sel !== undefined && !look.coiffe && !look.item) { const v = TROUPES[K.troupe][look.sel % TROUPES[K.troupe].length]; K.coiffe = v[0]; K.item = v[1]; if (v[2]) { K.armure = v[2]; K.cuirasse = false; } }
    if (K.varie && !look.coiffe && !look.manteau) { const v = VARIE[I.hash((look.robe || '') + (look.head || '') + (look.cloak || '')) % VARIE.length]; K.coiffe = v[0]; K.manteau = v[1]; }
    ['coiffe', 'item', 'manteau', 'motif', 'echarpe', 'court', 'cuirasse', 'chale', 'armure'].forEach(k => { if (look[k] !== undefined) K[k] = look[k]; });
    return K;
  }

  /* ---------- couleurs ---------- */
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const hex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return hex([0, 1, 2].map(i => x[i] + (y[i] - x[i]) * t)); };
  const lum = h => { const c = rgb(h); return (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255; };
  function vivid(h) { // la teinte d'une lueur pâle, ramenée à une couleur franche pour un bandeau ou une ceinture
    const [r, g, b] = rgb(h).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d < 0.02) return h;
    let hu = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hu *= 60; if (hu < 0) hu += 360;
    const s = 0.72, l = 0.56, c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((hu / 60) % 2 - 1)), m = l - c / 2;
    const t = hu < 60 ? [c, x, 0] : hu < 120 ? [x, c, 0] : hu < 180 ? [0, c, x] : hu < 240 ? [0, x, c] : hu < 300 ? [x, 0, c] : [c, 0, x];
    return hex(t.map(v => (v + m) * 255));
  }
  // trois tons par matière ; l'ombre tire vers le violet, la lumière vers le chaud, comme sur une console 16 bits
  const ramp = c => [lum(c) > 0.8 ? mix(c, '#ffffff', 0.45) : mix(c, '#fff0cc', 0.32), mix(c, '#2a1c3a', lum(c) > 0.8 ? 0.16 : 0.22), mix(c, '#20143a', lum(c) > 0.8 ? 0.42 : 0.54)];
  const INK = '#150f1d';
  function palette(look, K) {
    const robe = look.robe || '#8a7355', head = look.head || (K.coiffe === 'litham' ? (look.veil || '#1f2f55') : K.coiffe === 'capuche' ? robe : '#e6dcc4');
    const cloak = look.cloak || G.shade(robe, 0.68), trim = look.trim || (look.aura ? vivid(look.aura) : K.trim || mix(cloak, '#d9b45a', 0.5));
    const [T, t, u] = ramp(K.neon || K.cite ? mix(head, '#6272a4', 0.3) : head), [R, r] = ramp(robe), q = ramp(robe)[2], [C, c, k] = ramp(cloak), A = mix(trim, '#ffffff', 0.12), a = mix(trim, '#20143a', 0.42);
    const legs = look.legs || '#4a3d32', [L, l, z] = K.court ? ramp(legs) : [R, r, q];
    const p = { T, t, u, R, r, S: R, s: r, C, c, k, A, a, N: mix(head, '#ffffff', 0.3), F: '#7a5433', f: '#46301e',
      L, l, Z: z, M: K.court ? null : r, E: K.court ? null : c, e: K.court ? null : k, B: K.court ? L : C, b: K.court ? l : c, m: K.court ? null : c,
      I: '#c3c8d2', i: '#7f8794', X: '#b33327', W: '#8a6238', w: '#5a3d22', P: '#f3e9cf', Y: '#39e6ff', y: '#ff4fd8',
      // 2.x — les objets du râwî (D193) : le cuir de la besace (sa lumière, son corps, son ombre, la sangle), le métal et le verre de la lanterne
      O: '#8e6846', K: '#6f4e32', Q: '#523924', q: '#35261b', U: '#5b626e', n: '#2e323b', G: '#d3e3e5', g: '#93abb2' };
    if (Array.isArray(look.neon)) { p.Y = look.neon[0] || p.Y; p.y = look.neon[1] || p.y; }   // 2.x : le néon que le joueur choisit à son râwî (D.RAWI.neons) ; sans lui, celui de toujours
    if (K.lit) { p.V = '#fffbe8'; p.v = look.aura ? mix(look.aura, '#ffffff', 0.25) : '#ffe9a8'; p.N = '#fff3d6'; }
    else { p.V = mix(mix(head, '#5a4a4a', 0.6), '#2a1c3a', K.sombre ? 0.6 : 0.1); p.v = mix(p.V, '#20143a', 0.35); }
    if (K.cuirasse) { p.R = p.I; p.r = p.i; }
    return p;
  }

  /* ---------- les objets du râwî (2.x, D193) : la besace, la lanterne ----------
     Des objets ordinaires de 2084, sans motif ni ornement (exigence 17) : une besace de cuir, portée en bandoulière ; une
     lanterne — une lampe portative : une boîte de métal sombre autour d'un verre pâle, et son anse ; ni niche, ni arc, ni
     globe, ni chaîne, ni croisillon, ni or, et elle ne donne aucune lumière. Chacun est dessiné pour chaque taille où le râwî
     paraît (16 × 24, 32 × 48, 64 × 96), jamais agrandi de la taille d'en dessous. La besace tient au corps : sa sangle part
     de l'épaule et le sac pend à la hanche (de face, à gauche de l'image ; de dos, à droite). La lanterne pend à la main qui
     pend, et suit le pas ; quand cette main est prise (une pose, un geste), elle s'accroche à la ceinture ; à genoux, elle
     est posée à côté de lui. Rien de cela ne passe sur une main. Lettres : O K Q q (le cuir : sa lumière, son corps, son
     ombre, la sangle et ses bords), U n (le métal), G g (le verre). Les tailles se nomment par leur échelle : 1 (16 × 24),
     2 (32 × 48), 4 (64 × 96). */
  const RAWI_OBJETS = ['besace', 'lanterne'];
  const SAC = {
    1: ['qOOq', 'KKKQ', 'QQQq'],
    2: ['qqqqqqq', 'qOOOOOq', 'qOOOOKq', 'qqqqqqq', 'KKKKKKQ', 'KKKKKQQ', '.QQQQQ.'],
    4: ['.qqqqqqqqqqqq.', 'qOOOOOOOOOOOKq', 'qOOOOOOOOOOOKq', 'qOOOOOOOOOOKKq', 'qKKKKKKKKKKKKq', 'qqqqqqqqqqqqqq', 'qKKKKKKKKKKKQq',
        'qKKKKKKKKKKKQq', 'qKKKKKKKKKKQQq', 'qKKKKKKKKKKQQq', 'qQKKKKKKKKQQQq', '.qQQQQQQQQQQq.', '..qqqqqqqqqq..']
  };
  // la besace, vue par vue : la sangle, de l'épaule [x, y] jusqu'au coin du sac, puis le sac [x, y] (y : depuis le haut du corps)
  const BESACE = {
    1: { d: { de: [10, 0], a: [8, 3], sac: [4, 4] }, l: { de: [9, 0], a: [7, 3], sac: [4, 4] }, u: { de: [5, 0], a: [7, 3], sac: [8, 4] } },
    2: { d: { de: [21, 0], a: [16, 9], sac: [9, 10] }, l: { de: [18, 0], a: [15, 9], sac: [8, 10] }, u: { de: [10, 0], a: [15, 9], sac: [16, 10] } },
    4: { d: { de: [42, 0], a: [32, 19], sac: [18, 20] }, l: { de: [36, 0], a: [30, 19], sac: [16, 20] }, u: { de: [20, 0], a: [30, 19], sac: [32, 20] } }
  };
  // la lanterne : son anse se prend dans la main (a : la colonne de l'anse) ; dans le petit personnage, de dos, elle pend du
  // côté du dehors
  const LANTERNE = {
    1: { a: 0, rows: ['n.', 'nU', 'Gg', 'Gg', 'nn'] }, 1.5: { a: 1, rows: ['.n', 'Un', 'Gg', 'Gg', 'nn'] },
    2: { a: 2, rows: ['..n..', '.nUn.', 'nUUUn', 'nGGgn', 'nGGgn', 'nGggn', 'nUUUn', '.nnn.'] },
    4: { a: 4, rows: ['....nn....', '....nn....', '...nUUn...', '.nnUUUUnn.', 'nUUUUUUUUn', 'nnnnnnnnnn', 'nGGGGGGGgn', 'nGGGGGGGgn', 'nGGGGGGggn',
        'nGGGGGGggn', 'nGGGGGgggn', 'nGGGGGgggn', 'nnnnnnnnnn', 'nUUUUUUUUn', '.nUUUUUUn.', '..nnnnnn..'] }
  };
  const CEINTURE = { 1: 4, 2: 10 };   // la ligne de la ceinture, depuis le haut du corps
  // où va la lanterne, à l'échelle e (1 : 16 × 24 ; 2 : 32 × 48), dans une grille qui ne porte encore ni objet ni tête :
  // → { x, y, en } — x, y : où se prend l'anse ; en : 'main', 'ceinture' ou 'sol' ; null : on ne la voit pas (de dos, la main prise)
  function lanterneOu(g, key, b0, e, kneel, glisse) {
    const Wg = g[0].length, Hg = g.length, mi = Wg / 2, cote = x => key === 'd' ? x >= mi : key === 'u' ? x < mi : true, ceinture = b0 + CEINTURE[e];
    let yb = -1, xs = []; for (let y = b0; y < Hg; y++) for (let x = 0; x < Wg; x++) if (g[y][x] === 'N' && cote(x)) { if (y > yb) { yb = y; xs = []; } if (y === yb) xs.push(x); }
    const xm = xs.length ? Math.floor(xs.reduce((s, v) => s + v, 0) / xs.length) : -1, lr = LANTERNE[e].rows.length;
    if (kneel) { if (xm < 0) return null; let sol = Hg - 1; while (sol > 0 && g[sol].every(m => m === '.')) sol--;   // à genoux : posée à côté de lui
      return { x: key === 'u' ? xm - 2 * e : xm + 2 * e, y: sol - lr + 1, en: 'sol' }; }
    if (xm >= 0 && yb >= ceinture) return { x: xm, y: yb + 1, en: 'main' };
    if (key === 'u') return null;                                                    // de dos, la main prise : elle est devant lui
    const yc = ceinture + e;                                                          // sinon, accrochée à la ceinture
    return { x: (key === 'd' ? 10 : 5) * e + (glisse ? glisse(yc - b0) : 0), y: yc, en: 'ceinture' };
  }
  // pose un objet du râwî à l'échelle s (1, 2 ou 4) : put(x, y, lettre) écrit dans la grille (un point hors grille est ignoré) ;
  // o : { b0, key, ou (la lanterne, lanterneOu), glisse (une ligne du corps → son décalage, pendant un geste) }
  function poserObjet(nom, s, put, o) {
    const f = s === 4 ? 2 : 1, gl = j => (o.glisse ? o.glisse(Math.floor(j / f)) * f : 0);   // à 64 × 96, une ligne du 32 × 48 en fait deux
    if (nom === 'besace') { const B = BESACE[s][o.key], sac = SAC[s], ep = s === 4 ? 2 : 1, [x0, y0] = B.de, [x1, y1] = B.a;
      for (let y = y0; y <= y1; y++) { const x = Math.round(x0 + (x1 - x0) * (y - y0) / Math.max(1, y1 - y0)) + gl(y); for (let k = 0; k < ep; k++) put(x + k, o.b0 + y, ep > 1 && k === 0 ? 'Q' : 'q'); }
      sac.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.') put(B.sac[0] + i + gl(B.sac[1] + j), o.b0 + B.sac[1] + j, r[i]); }); }
    else if (nom === 'lanterne' && o.ou) { const T = LANTERNE[s === 1 && o.key === 'u' ? 1.5 : s], x0 = o.ou.x * f - T.a, y0 = o.ou.y * f;
      T.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.') put(x0 + i, y0 + j, r[i]); }); }
  }

  // Le bandeau du râwî sous le turban et le chèche (D193) : ses deux néons, la bande et la ceinture (Y y) — de dos, où l'on
  // ne voit ni son visage ni le néon de sa poitrine, la marque de 2084 qui le distingue des gens des récits, et d'abord des
  // Compagnons, dont le bandeau a leur couleur. Par coiffe et par taille (1 : 16 × 24 ; 2 : 32 × 48) : [ligne de la tête,
  // lettres qui deviennent néon, néon] — sans néon dit (un bandeau d'une seule ligne) : la bande et la ceinture, point par point.
  const NEON_TETE = { imama_haute: { 1: [[5, 'Aa']], 2: [[8, 'Aa', 'Y'], [9, 'Aa', 'y']] }, litham: { 1: [[5, 'Aau']], 2: [[8, 'u']] } };
  function neonTete(K, rows, e) {   // → (ligne, colonne, lettre) → la lettre à poser ; null : rien à changer
    const T = K.neon && NEON_TETE[K.coiffe] && NEON_TETE[K.coiffe][e]; if (!T) return null;
    const bouts = {}; T.forEach(([j, ls]) => { const r = rows[j] || ''; let a = -1, b = -1; for (let x = 0; x < r.length; x++) if (ls.indexOf(r[x]) >= 0) { if (a < 0) a = x; b = x; } bouts[j] = [a, b]; });
    return (j, x, m) => { const t = T.find(q => q[0] === j); if (!t || t[1].indexOf(m) < 0) return m; return t[2] || ((x - bouts[j][0]) % 2 ? 'y' : 'Y'); };
  }

  /* ---------- composition d'une image : grille de 16 × 24 matières ---------- */
  function grid(look, dir, frame, pose, opt) { // opt : demandé par le grand sprite, qui veut aussi les objets tenus à part — sans effet sur le dessin
    const K = kindOf(look), objets = opt ? [] : null; let couche = null; // objets : chaque objet tenu, seul sur sa grille, pour le grand sprite
    const key = dir === 0 ? 'd' : dir === 3 ? 'u' : 'l';
    const P = pose && POSES[pose] && POSES[pose][key] ? POSES[pose] : null;
    let bodyRows = P ? P[key] : BODIES[key][frame || 0]; const hy = P ? (P.hy || 0) : 0, kneel = !!(P && P.kneel);
    const petit = K.petit && !kneel ? 3 : 0; if (petit) bodyRows = bodyRows.filter((r, j) => j !== 3 && j !== 7 && j !== 8); // enfant : trois lignes de moins
    const extra = P ? (key === 'd' ? P.extraD : key === 'l' ? P.extraL : P.extraU) : null;
    const g = []; for (let y = 0; y < H; y++) g.push(new Array(W).fill('.'));
    const put = (x, y, m) => { if (x >= 0 && x < W && y >= 0 && y < H && m !== '.') { g[y][x] = m; if (couche) couche[y][x] = m; } };
    const b0 = kneel ? H - 8 : 11 + petit; // un corps à genoux tient en 8 lignes, posées au sol
    bodyRows.forEach((row, j) => { for (let x = 0; x < W; x++) put(x, b0 + j, row[x]); });
    // la tenue : pas de manteau, manteau sur une seule épaule, manteau ample ; rayures, bandes, écharpe
    const y1 = kneel ? H : H - 2, nu = (x, y) => { const m = g[y][x]; g[y][x] = m === 'C' ? 'R' : (m === 'c' || m === 'k') ? 'r' : (m === 'E' || m === 'e') ? '.' : m === 'B' ? 'S' : (m === 'b' || m === 'm') ? 's' : m; };
    if (K.manteau === 'aucun' || (K.manteau === 'epaule' && dir === 2)) { for (let y = b0; y < y1; y++) for (let x = 0; x < W; x++) nu(x, y); }
    else if (K.manteau === 'epaule') { for (let y = b0; y < y1; y++) for (let x = 0; x < W; x++) if (key === 'd' ? x >= 8 : key === 'u' ? x < 8 : false) nu(x, y); }
    else if (K.manteau === 'ample' && !kneel) for (let y = b0 + 1; y < y1; y++) {
      let a = 0; while (a < W && g[y][a] === '.') a++; let b = W - 1; while (b >= 0 && g[y][b] === '.') b--;
      if (a > 0 && a < W && 'CckEe'.indexOf(g[y][a]) >= 0) g[y][a - 1] = g[y][a] === 'k' ? 'c' : g[y][a];
      if (b < W - 1 && b >= 0 && 'CckEe'.indexOf(g[y][b]) >= 0) g[y][b + 1] = g[y][b] === 'C' ? 'c' : g[y][b];
    }
    if (K.motif === 'rayures') { for (let y = b0; y < y1; y++) for (let x = 0; x < W; x++) if ('RSLl'.indexOf(g[y][x]) >= 0 && x % 3 === 0) g[y][x] = 'a'; }
    else if (K.motif === 'bandes') { for (let y = b0; y < y1; y++) for (let x = 0; x < W; x++) if ('CcEe'.indexOf(g[y][x]) >= 0 && (y - b0) % 3 === 2) g[y][x] = 'A'; }
    if (K.armure) { const bas = K.armure === 'mailles' ? 8 : K.armure === 'lamelles' ? 7 : 5; // mailles en damier, lamelles en rangs, cuir uni, toile piquée
      for (let y = b0; y < Math.min(y1, b0 + bas); y++) for (let x = 0; x < W; x++) { const m = g[y][x]; if ('RrSs'.indexOf(m) < 0) continue;
        g[y][x] = K.armure === 'mailles' ? ((x + y) % 2 ? 'I' : 'i') : K.armure === 'lamelles' ? ((y - b0) % 2 ? 'i' : (x % 2 ? 'I' : 'i')) : K.armure === 'cuir' ? ((m === 'R' || m === 'S') ? 'W' : 'w') : ((x + y) % 3 === 0 ? 'r' : m); } }
    if (K.echarpe && !kneel) { const pts = key === 'd' ? [[5, 0], [6, 0], [6, 1], [7, 1], [7, 2], [8, 2], [8, 3], [9, 3]] : key === 'l' ? [[4, 1], [5, 1], [5, 2], [6, 2], [6, 3]] : [];
      pts.forEach(([x, dy]) => { if ('RrSs'.indexOf(g[b0 + dy][x]) >= 0) g[b0 + dy][x] = 'A'; }); }
    // attributs tenus ou portés (un ou plusieurs)
    const hip = b0 + 5;
    for (const it of [].concat(K.item || [], (look.porte || []).filter(o => RAWI_OBJETS.indexOf(o) < 0))) { // look.porte (2.x) : l'objet que le joueur donne à son râwî — l'équipement ne le lit pas ; les siens (D193) se dessinent plus bas, à chaque taille
    if (objets) { couche = []; for (let y = 0; y < H; y++) couche.push(new Array(W).fill('.')); objets.push({ nom: it, g: couche }); }
    // le bouclier se porte du côté libre : à droite de l'image quand la main droite tient une hampe
    const hampe = [].concat(K.item || []).some(q => ['lance', 'baton', 'masse', 'arc', 'durra', 'etendard', 'calame'].indexOf(q) >= 0), ecuX = key === 'd' ? (hampe ? 12 : 0) : key === 'u' ? (hampe ? 0 : 12) : 9;
    if (it === 'bouclier' || it === 'bouclier_cuir' || it === 'bouclier_bois') { const x0 = ecuX, fer = it === 'bouclier', m1 = fer ? 'I' : 'W', m2 = fer ? 'i' : 'w';
      [[1, -2], [2, -2], [0, -1], [1, -1], [2, -1], [3, -1], [0, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2]].forEach(([dx, dy]) => put(x0 + dx, hip + dy, it === 'bouclier_bois' && (dy === -2 || dy === 2 || dx === 0 || dx === 3) ? 'i' : (dx + dy) % 2 ? m2 : m1));
      put(x0 + 1, hip, it === 'bouclier_bois' ? 'I' : 'A'); put(x0 + 2, hip, it === 'bouclier_bois' ? 'i' : 'a'); }
    if (it === 'pavois') { const x0 = ecuX; for (let dy = -4; dy <= 3; dy++) for (let dx = 0; dx < 4; dx++) { if ((dy === -4 || dy === 3) && (dx === 0 || dx === 3)) continue; put(x0 + dx, hip + dy, (dx === 0 || dx === 3 || dy === -4 || dy === 3) ? 'i' : 'X'); } put(x0 + 1, hip - 1, 'I'); put(x0 + 2, hip - 1, 'I'); put(x0 + 1, hip, 'I'); put(x0 + 2, hip, 'i'); }
    if (it === 'arc' && key !== 'u') { const x = key === 'd' ? 0 : 0; [[2, -6], [1, -5], [1, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [1, 2], [1, 3], [2, 4]].forEach(([dx, dy]) => put(x + dx, hip + dy, dy === -1 || dy === 0 ? 'w' : 'W')); for (let dy = -5; dy <= 3; dy++) if (g[hip + dy] && g[hip + dy][x + 2] === '.') put(x + 2, hip + dy, 'P'); }
    if (it === 'masse') { const x = key === 'd' ? 1 : key === 'u' ? 14 : 2; for (let y = hip - 4; y < hip + 3; y++) put(x, y, y % 4 === 1 ? 'w' : 'W'); [[-1, -7], [0, -7], [1, -7], [-1, -6], [0, -6], [1, -6], [-1, -5], [0, -5], [1, -5]].forEach(([dx, dy]) => put(x + dx, hip + dy, (dx + dy) % 2 ? 'i' : 'I')); }
    if (it === 'dague' && key !== 'u') { if (key === 'd') { put(10, hip - 1, 'w'); put(11, hip, 'I'); put(12, hip + 1, 'I'); put(12, hip + 2, 'i'); } else { put(3, hip - 1, 'w'); put(2, hip, 'I'); put(1, hip + 1, 'I'); put(0, hip + 2, 'i'); } }
    if (it === 'calame' && key !== 'u') { const x = key === 'd' ? 2 : 3; put(x, hip - 2, 'W'); put(x, hip - 1, 'W'); put(x - 1, hip, 'W'); put(x - 1, hip + 1, 'f'); }
    if (it === 'tablette' && key !== 'u') { const x = key === 'd' ? 12 : 9; put(x, hip - 2, 'w'); put(x + 1, hip - 2, 'w'); for (let dy = -1; dy <= 1; dy++) { put(x, hip + dy, 'P'); put(x + 1, hip + dy, 'P'); } put(x, hip + 2, 'W'); put(x + 1, hip + 2, 'W'); }
    if (it === 'outre' && key !== 'u') { const x = key === 'd' ? 10 : 6; put(x, hip - 1, 'w'); put(x, hip, 'W'); put(x + 1, hip, 'W'); put(x, hip + 1, 'W'); put(x + 1, hip + 1, 'w'); }
    if (it === 'etendard') { const x = key === 'd' ? 1 : key === 'u' ? 14 : 2, sx = key === 'u' ? -1 : 1; for (let y = 1; y < H - 1; y++) put(x, y, y % 5 === 2 ? 'w' : 'W'); put(x, 0, 'I'); for (let j = 0; j < 4; j++) for (let k2 = 1; k2 <= 4 - (j === 3 ? 2 : 0); k2++) put(x + sx * k2, 1 + j, (j + k2) % 3 ? 'A' : 'a'); }
    if (it === 'baton' || it === 'lance') { const x = key === 'd' ? 1 : key === 'u' ? 14 : 2, top = it === 'lance' ? 1 : (kneel ? 9 : 5); for (let y = top; y < H - 1; y++) put(x, y, y % 5 === 2 ? 'w' : 'W'); if (it === 'lance') { put(x, 0, 'I'); put(x, 1, 'I'); put(x, 2, 'i'); } }
    if (it === 'durra') { const x = key === 'd' ? 1 : key === 'u' ? 14 : 3; for (let y = hip - 3; y < hip + 4; y++) put(x, y, y === hip - 3 ? 'w' : 'W'); }
    if (it === 'sabre') {
      if (key === 'd') { [[11, 0], [12, 1], [12, 2], [13, 3], [13, 4]].forEach(([x, y]) => { put(x, hip + y, 'f'); put(x + 1, hip + y, 'F'); }); put(10, hip - 1, 'A'); put(11, hip - 1, 'a'); }
      else if (key === 'u') { [[4, 0], [3, 1], [3, 2], [2, 3], [2, 4]].forEach(([x, y]) => { put(x, hip + y, 'F'); put(x - 1, hip + y, 'f'); }); put(5, hip - 1, 'A'); }
      else { [[10, 0], [11, 1], [12, 2], [13, 3], [14, 4]].forEach(([x, y]) => { put(x, hip + y, 'f'); put(x, hip + y - 1, 'F'); }); put(9, hip - 1, 'A'); put(9, hip - 2, 'a'); }
    }
    if (it === 'feuillets' && key !== 'u') { const x = key === 'd' ? 1 : 3; put(x, hip - 1, 'P'); put(x + 1, hip - 1, 'P'); put(x, hip, 'P'); put(x + 1, hip, 'P'); put(x, hip + 1, 'w'); put(x + 1, hip + 1, 'w'); }
    if (it === 'bourse' && key !== 'u') { const x = key === 'd' ? 10 : 6; put(x, hip, 'A'); put(x + 1, hip, 'a'); put(x, hip + 1, 'a'); put(x + 1, hip + 1, 'a'); }
    }
    couche = null;
    if (K.chale && !kneel) for (let x = 2; x < 14; x++) { if ('Cck'.indexOf(g[b0][x]) >= 0) g[b0][x] = 'T'; if ('Cck'.indexOf(g[b0 + 1][x]) >= 0) g[b0 + 1][x] = x % 3 ? 'T' : 't'; }
    if (K.drape && !kneel) for (let y = b0; y < b0 + 2; y++) for (let x = 0; x < W; x++) if ((x <= 4 || x >= 11) && 'Cck'.indexOf(g[y][x]) >= 0) g[y][x] = y === b0 ? 't' : 'u'; // l'étoffe de tête retombe sur les épaules
    if (K.raies) for (let y = b0 + 1; y < b0 + 5; y += 2) for (let x = 0; x < W; x++) if ('RrCc'.indexOf(g[y][x]) >= 0) g[y][x] = 'T';
    if (K.neon) { for (let y = b0 + 1; y < b0 + 4; y++) { const x = key === 'd' ? 7 : key === 'l' ? 5 : -1; if (x >= 0 && g[y][x] !== '.') g[y][x] = 'Y'; } for (let x = 0; x < W; x++) if ('Aa'.indexOf(g[b0 + 4][x]) >= 0) g[b0 + 4][x] = 'y'; }
    // les objets du râwî (D193), dessinés à cette taille : par-dessus l'habit et son néon, sous la tête, jamais sur une main
    const rawi = (look.porte || []).filter(o => RAWI_OBJETS.indexOf(o) >= 0);
    if (rawi.length) { const ou = rawi.indexOf('lanterne') >= 0 ? lanterneOu(g, key, b0, 1, kneel) : null;
      rawi.forEach(o => poserObjet(o, 1, (x, y, m) => { if (x >= 0 && x < W && y >= 0 && y < H && g[y][x] !== 'N') g[y][x] = m; }, { b0, key, ou })); }
    // tête (11 lignes), inclinée ou abaissée selon la pose
    const head = HEADS[K.coiffe] || HEADS.imama, hrows = head[key] || head.d, h0 = (kneel ? b0 - 11 : petit) + hy, hx = hy && key === 'l' ? -1 : 0;
    {
    const nt = neonTete(K, hrows, 1);   // le bandeau du râwî sous le turban et le chèche : ses néons (D193)
    for (let j = 0; j < 11; j++) for (let x = 0; x < W; x++) put(x + hx, h0 + j, nt ? nt(j, x, hrows[j][x]) : hrows[j][x]);
    if (K.coiffe === 'imama_queue' && !kneel) { // le pan du turban retombe sur l'épaule (de dos : entre les épaules)
      if (key === 'd') { put(13 + hx, h0 + 11, 't'); put(13 + hx, h0 + 12, 'u'); } else if (key === 'l') { put(13 + hx, h0 + 11, 't'); put(12 + hx, h0 + 12, 'u'); }
      else { put(7, h0 + 11, 'T'); put(8, h0 + 11, 't'); put(7, h0 + 12, 't'); put(8, h0 + 12, 'u'); put(7, h0 + 13, 'u'); } }
    if (K.cimier) { if (key === 'l') for (let x = 4; x < 11; x++) put(x, h0, 'X'); else for (let x = 6; x < 10; x++) { put(x, h0, 'X'); if (key === 'u') put(x, h0 + 1, 'X'); } }
    }
    if (extra) extra.forEach(([x, y, m]) => put(x, y, m));
    if (dir === 2) for (let y = 0; y < H; y++) g[y].reverse();
    return { g, K, key, b0, kneel, objets }; // objets : dans le repère non retourné
  }

  /* ---------- rendu ---------- */
  const mk = G.mk;
  function outline(c, w, h) { // liseré : la teinte voisine, très assombrie ; jamais sous les pieds
    const id = c.getImageData(0, 0, w, h), d = id.data, k = rgb(INK), add = [];
    const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 200;
    for (let y = 0; y < h - 1; y++) for (let x = 0; x < w; x++) { if (solid(x, y)) continue;
      const n = solid(x, y + 1) ? [x, y + 1] : solid(x + 1, y) ? [x + 1, y] : solid(x - 1, y) ? [x - 1, y] : solid(x, y - 1) ? [x, y - 1] : null; if (n) add.push(x, y, (n[1] * w + n[0]) * 4); }
    for (let i = 0; i < add.length; i += 3) { const o = (add[i + 1] * w + add[i]) * 4, s = add[i + 2]; for (let j = 0; j < 3; j++) d[o + j] = Math.round(d[s + j] * 0.22 + k[j] * 0.78); d[o + 3] = 255; }
    c.putImageData(id, 0, 0);
  }
  function paint(g, pal, w, h) { const cv = mk(w, h), c = cv.getContext('2d'); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const col = pal[g[y][x]]; if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); } } return cv; }
  const scache = {}, ck = (look, a, b, c) => JSON.stringify(look) + '|' + a + '|' + (b || 0) + '|' + (c || '');
  function small(look, dir, frame, pose) {
    const k = 's' + ck(look, dir, frame, pose); if (scache[k]) return scache[k];
    const { g, K } = grid(look, dir, frame, pose), cv = paint(g, palette(look, K), W, H);
    outline(cv.getContext('2d'), W, H);
    return (scache[k] = cv);
  }
  // Scale2x (EPX) sur la grille des matières : les diagonales s'arrondissent sans rien inventer
  function scale2x(g) {
    const o = []; for (let y = 0; y < H * 2; y++) o.push(new Array(W * 2));
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? '.' : g[y][x];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const p = g[y][x], a = at(x, y - 1), b = at(x + 1, y), c = at(x - 1, y), d = at(x, y + 1);
      o[y * 2][x * 2] = (c === a && c !== d && a !== b) ? a : p; o[y * 2][x * 2 + 1] = (a === b && a !== c && b !== d) ? b : p;
      o[y * 2 + 1][x * 2] = (d === c && d !== b && c !== a) ? c : p; o[y * 2 + 1][x * 2 + 1] = (b === d && b !== a && d !== c) ? d : p;
    }
    return o;
  }
  // le grand sprite d'avant : le petit, agrandi et à peine enrichi. gfx.natif = false le rend, à l'identique.
  function ancien(look, dir, frame, pose) {
    const k = 'g' + ck(look, dir, frame, pose); if (scache[k]) return scache[k];
    const { g, K } = grid(look, dir, frame, pose), pal = palette(look, K), G2 = scale2x(g), w = W * 2, h = H * 2;
    let cv = paint(G2, pal, w, h); const c = cv.getContext('2d'), px = (x, y, col) => { if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); } };
    const is = (x, y, set) => x >= 0 && y >= 0 && x < w && y < h && set.indexOf(G2[y][x]) >= 0;
    // le voile : une lumière qui se dégrade du centre vers le bord (Compagnons), une étoffe unie sinon
    let x0 = 99, x1 = -1, y0 = 99, y1 = -1; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (is(x, y, 'Vv')) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    if (x1 >= 0) { const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 - 0.5, rx = (x1 - x0) / 2 + 0.5, ry = (y1 - y0) / 2 + 0.5;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (is(x, y, 'Vv')) { const dd = Math.hypot((x - cx) / rx, (y - cy) / ry);
        px(x, y, K.lit ? (dd < 0.5 ? '#ffffff' : dd < 0.82 ? pal.V : pal.v) : (y - y0 < 2 || dd > 0.86 ? pal.v : pal.V)); } }
    // plis des étoffes, reflets, galon au bas du manteau
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const m = G2[y][x];
      if ((m === 'S' || m === 'L') && !K.court && x % 4 === 1 && is(x - 1, y, 'SL') && is(x + 1, y, 'SL')) px(x, y, pal.s);
      if ((m === 'C' || m === 'B') && y % 2 === 0 && x % 6 === 3 && is(x, y - 1, 'CB') && is(x, y + 1, 'CB')) px(x, y, pal.c);
      if (m === 'T' && is(x, y - 1, '.') ) px(x, y, mix(pal.T, '#ffffff', 0.45));
      if ((m === 'C' || m === 'R') && is(x, y - 1, '.') && !is(x - 1, y, '.')) px(x, y, mix(pal[m], '#ffffff', 0.3));
      if ('Eek'.indexOf(m) >= 0 && y > h * 0.72 && is(x, y + 1, '.Ff')) px(x, y, pal.a);
      if (m === 'Z' && !K.court && is(x, y + 1, '.Ff')) px(x, y, pal.a); }
    outline(cv.getContext('2d'), w, h);
    return (scache[k] = cv);
  }

  /* ---------- le grand sprite natif (32 × 48) ----------
     Dessiné d'après les modèles du décideur : une tête de dix-sept lignes environ, un corps de vingt-neuf.
     grid() dit toujours qui porte quoi (coiffe, manteau, motif, armure, objets, pose) ; le grand sprite le redessine avec
     ses propres gabarits :
       TETES[coiffe]   une tête par coiffe, de face (d) et de profil (l) : 20 lignes de 32, dont 2 recouvrent le col
                     (davantage si un pan retombe sur le corps) ;
       CORPS[vue]      le corps debout — repos, pas A, pas B : 30 lignes de 32, posées au sol ;
       ALLURES[pose]   le corps d'une pose, par vue.
     Mêmes lettres de matière que les petits gabarits, plus H et D (coiffe en pleine lumière, dans l'ombre), J et j (fer).
     Les règles de tenue (manteau, motif, armure, écharpe…) sont celles de grid(), écrites à cette échelle ; les objets
     tenus viennent de grid() lui-même, agrandis — sauf ceux du râwî (la besace, la lanterne : D193), dessinés à chaque taille
     (poserObjet). Ce qui n'a pas encore son gabarit garde le grand sprite d'avant.
     Le voile (V) d'une tête est une surface d'un seul tenant : le moteur refuse de démarrer sinon — personne n'a de visage. */
  const W2 = W * 2, H2 = H * 2, TETES = {}, CORPS = { d: [], l: [], u: [] }, ALLURES = {};
  const PETIT = [7, 8, 17, 18, 21, 22]; // enfant : six lignes de corps en moins
  const HAMPES = ['lance', 'baton', 'masse', 'durra', 'etendard', 'calame']; // ce qui se tient à pleine main
  const EN_MAIN = ['sabre', 'lance', 'baton', 'masse', 'dague', 'arc', 'calame', 'durra']; // ce avec quoi l'on frappe : pendant un geste, le moteur le pose dans la main
  const VIDE = '................................';
  function voileUni(rows) { // → null si le voile est d'un seul tenant, sur chaque ligne et chaque colonne ; sinon ce qui cloche
    const V = (x, y) => y >= 0 && y < rows.length && (rows[y][x] === 'V' || rows[y][x] === 'v'), lignes = [], Wl = rows[0].length;   // Wl : 32, ou 64 (le râwî)
    for (let y = 0; y < rows.length; y++) { let runs = 0, a = -1, b = -1; for (let x = 0; x < Wl; x++) if (V(x, y)) { if (!V(x - 1, y)) { runs++; a = x; } b = x; } if (runs > 1) return 'voile coupé, ligne ' + y; if (runs) lignes.push([y, a, b]); }
    for (let x = 0; x < Wl; x++) { let runs = 0; for (let y = 0; y < rows.length; y++) if (V(x, y) && !V(x, y - 1)) runs++; if (runs > 1) return 'voile coupé, colonne ' + x; }
    for (let i = 1; i < lignes.length; i++) { const p = lignes[i - 1], q = lignes[i]; if (q[0] !== p[0] + 1 || q[1] > p[2] || q[2] < p[1]) return 'voile en plusieurs morceaux, ligne ' + q[0]; }
    return null;
  }
  const gabarit = (quoi, rows, n) => { if (rows.length < n || rows.some(r => r.length !== W2)) throw new Error('gabarit natif mal formé : ' + quoi + ' — ' + rows.length + ' lignes de ' + rows.map(r => r.length).join(',')); return rows; };
  function tete(nom, vues) { Object.keys(vues).forEach(k => { const t = voileUni(gabarit('tête ' + nom + '.' + k, vues[k], 20)); if (t) throw new Error('tête native ' + nom + '.' + k + ' : ' + t); }); TETES[nom] = vues; }

  /* ---------- corps natifs ---------- */
  // De face : le manteau fait châle autour du cou et couvre les bras ; la robe paraît entre ses bords. Un vide d'un pixel
  // (que le liseré assombrit) détache le bras du buste. Sans manteau, les mêmes lettres deviennent les manches de la robe.
  CORPS.d[0] = gabarit('corps de face', [
    '.........cCCCCCccCCCCck.........', '.......CCCCCCCccccCCCCcck.......', '......CCCCCCcRRRRRRcCCCcck......', '.....CCCCCckRRRRRRRRkcCCcck.....',
    '.....CCCc.ckRRRRRRRRkc.cCck.....', '.....CCCc.ckRRRRRRRrkc.cCck.....', '.....CCcc.ckRRRRRRRrkc.cCck.....', '.....CCcc.ckRRRRRRrrkc.cCck.....',
    '.....CCcc.ckRRRRRRrrkc.cckk.....', '.....CCcc.ckrRRRRRrrkc.cckk.....', '.....Cccc.aAAAAAAAAAAa.cckk.....', '.....Cccc.aaAAAAAAAAaa.cckk.....',
    '.....kkkk.kSSSSSSSSSSk.kkkk.....', '......NNN.kSSSSSsSSSSk.NNN......', '......NNN.kSSsSSsSSSsk.NNN......', '......ENE.kSSsSSsSSSsk.ENe......',
    '......EEE.kSSsSSssSSsk.EEe......', '......EEekSSSsSSssSSSskEEe......', '......EEekSSsSSSssSSsSkEEe......', '......EEekSSsSSSssSSsSkEee......',
    '.....EEEekLLlLLLMMLLlLlkEEe.....', '.....EEEekLLlLLLMMLLlLlkEEe.....', '.....EEEekLLlLLlMMLLlLlkEee.....', '.....EEEekLlLLLlMMLLLlLkEee.....',
    '.....EEeekLlLLLlMMLLLlLkEee.....', '.....EeeekZZZZZZMMZZZZZkeee.....', '..........FFFFf..FFFFf..........', '..........FFFFf..FFFFf..........',
    '.........FFFFff..FFFFff.........', '................................'], 30);
  // De profil (tourné vers la gauche) : la robe devant, le bras au milieu, le manteau dans le dos et ses pans derrière.
  CORPS.l[0] = gabarit('corps de profil', [
    '............rRAArCCCc...........', '..........rRRRrCCCCCCcc.........', '.........RRRRRrCCCCCCcck........', '.........RRRRRr.CCCc.cck........',
    '.........RRRRRr.CCCc.cck........', '.........RRRRrr.CCcc.cck........', '.........RRRRrr.CCcc.cck........', '.........RRRRrr.CCcc.ckk........',
    '.........RRRRrr.CCcc.ckk........', '.........RRRrrr.Cccc.ckk........', '.........AAAAAa.Cccc.ckk........', '.........aAAAaa.cccc.ckk........',
    '.........SSSSSs.kkkk.ekk........', '.........SSSSSs..NNN.eek........', '.........SSSSSss.NNN.eek........', '.........SSSSSssk.N..eeE........',
    '........SSSSSSsskeeeeeeE........', '........SSSSSSsSskeeeeEE........', '........SSSSSSsSskeeeeEE........', '.......SSSSSSSsSskeeeeEE........',
    '.......LLLLLLLlLlkeeeeEE........', '.......LLLLLLLlLlkeeeeEE........', '.......LLLLLLlLLlkeeeeEEE.......', '......LLLLLLLlLLlkeeeeEEE.......',
    '......LLLLLLLlLLlkeeeeEEE.......', '......ZZZZZZZZZZZkeeeeEE........', '...........FFFFFf...............', '..........FFFFFFf...............',
    '.........FFFFFfff...............', '................................'], 30);

  /* ---------- la marche et les attitudes ----------
     Chaque corps part du corps au repos ; on n'en redessine que les lignes qui changent. */
  const varie = (quoi, rows, ch, n) => gabarit(quoi, rows.map((r, j) => ch[j] !== undefined ? ch[j] : r), n || 30);
  const ANCIENS = {}; // les pas d'avant la 2.x (un point de balancement) : gardés pour la comparaison, non dessinés
  const pose = (r, x, t) => { let o = r; for (let i = 0; i < t.length; i++) { const X = x + i; if (X >= 0 && X < W2 && t[i] !== ' ') o = o.slice(0, X) + t[i] + o.slice(X + 1); } return o; }; // écrit t dans la ligne à partir de x (' ' : ne rien changer)
  // De face ou de dos : le pas du côté `cote` ('g' : la gauche de l'image avance). Mêmes colonnes pour les deux vues.
  function foulee(quoi, V0, cote) {
    const borne = j => Math.max(10, Math.min(17, j)), G0 = r => r.slice(0, 10), M0 = r => r.slice(10, 22), D0 = r => r.slice(22), av = cote === 'g';
    const rows = V0.map((r, j) => (j >= 10 && j <= 17) ? G0(V0[borne(j - (av ? 2 : -2))]) + M0(r) + D0(V0[borne(j - (av ? -2 : 2))]) : r); // le bras qui avance descend, l'autre remonte
    // le bas de la robe : la moitié qui avance descend d'un point, l'autre remonte d'un point (lignes 20 à 25)
    const moitie = (r, gauche) => gauche ? r.slice(0, 16) : r.slice(16), vide = '.'.repeat(16);
    for (let j = 25; j >= 20; j--) { const ga = av ? V0[j - 1] : V0[Math.min(25, j + 1)], dr = av ? V0[Math.min(25, j + 1)] : V0[j - 1]; rows[j] = moitie(ga, true) + moitie(dr, false); }
    // les pieds : celui qui avance est entier et dépasse d'un point ; l'autre n'est plus qu'un talon sous la robe
    const P = V0[26], Pb = V0[28];
    rows[26] = av ? moitie(V0[25], true) + moitie(P, false) : moitie(P, true) + moitie(V0[25], false);   // l'ourlet descendu couvre le haut du pied qui avance
    rows[27] = av ? moitie(P, true) + vide : vide + moitie(P, false);
    rows[28] = av ? moitie(P, true) + vide : vide + moitie(P, false);
    rows[29] = av ? moitie(Pb, true) + vide : vide + moitie(Pb, false);
    return gabarit(quoi, rows, 30);
  }
  // De profil (tourné vers la gauche) : deux foulées dessinées à la main. Le bras que l'on voit balance depuis l'épaule —
  // loin devant, la main dépassant de la robe, puis derrière le dos ; la robe s'ouvre en triangle sur le pas (M : le pli
  // entre les jambes — en tenue courte, le vide qui les sépare) ; un pied à plat devant, l'autre sur la pointe derrière.
  // `devant` : la jambe proche est devant (elle prend la lumière) ; le bras proche part alors en arrière.
  const balance = devant => devant ? {   // le bras en arrière : la main passe derrière le dos
      5: '.........RRRRrrc.CCcc.ck........', 6: '.........RRRRrrc.CCcc.ck........', 7: '.........RRRRrrcc.CCcc.k........', 8: '.........RRRRrrcc.CCcc.k........',
      9: '.........RRRrrrccc.Cccc.........', 10: '.........AAAAAaccc.Cccc.........', 11: '.........aAAAaacccc.cccc........', 12: '.........SSSSSssske.kkkk........',
      13: '.........SSSSSssskee.NNN........', 14: '.........SSSSSssskeee.NNN.......', 15: '.........SSSSSssskeeeeeE........'
    } : {                     // le bras en avant : la main dépasse de la robe
      4: '.........RRRRR.CCCc.ccck........', 5: '.........RRRRr.CCcc.ccck........', 6: '.........RRRR.CCcc.cccck........', 7: '.........RRR.CCcc.cccckk........',
      8: '.........RRR.CCcc.cccckk........', 9: '.........RR.Cccc.ccccckk........', 10: '.........A.Cccc.cccccckk........', 11: '.........akkkk.ccccccckk........',
      12: '........NNN.SSssskkkkeee........', 13: '........NNN.SSssskkkeeee........', 14: '.........SSSSSssskkeeeee........', 15: '.........SSSSSssskeeeeeE........' };
  function jambes(devant) {
    // la robe ouverte sur le pas ; le côté de la jambe proche est dans la lumière (L), l'autre dans l'ombre (l)
    const A = devant ? 'L' : 'l', B = devant ? 'l' : 'L', P = devant ? 'F' : 'f', Q = devant ? 'f' : 'F';
    return {
      20: '......' + A.repeat(8) + 'l' + B + 'l' + B + 'keeeeEE.......',
      21: '......' + A.repeat(6) + 'M' + A + B + 'l' + B + B + 'keeeeEE.......',
      22: '.....' + A.repeat(6) + 'MMM' + B + B + 'l' + B + B + 'keeeeEE......',
      23: '....' + A.repeat(6) + 'MMMMM' + B + B + 'l' + B + B + 'keeeeEE.....',
      24: '....' + A.repeat(6) + 'MMMMMM' + B + B + 'l' + B + 'keeeeEE.....',
      25: '...ZZZZZZMMMMMMMZZZZZkeeeeE.....',
      26: '....' + P.repeat(4) + 'f..........' + Q + Q + 'f..........',   // un pied à plat devant, l'autre sur la pointe derrière
      27: '...' + P.repeat(5) + 'f.........' + Q + Q + 'f...........',
      28: '..' + P.repeat(5) + 'ff.......' + Q + Q + Q + 'f............' };
  }
  const enjambee = (L0, devant) => varie('marche de profil', L0, Object.assign({}, balance(devant), jambes(devant)));
  { // de face : un bras descend d'un pixel, l'autre monte ; un pied se lève
    const D0 = CORPS.d[0], g = r => r.slice(0, 10), m = r => r.slice(10, 22), d = r => r.slice(22), borne = j => Math.max(11, Math.min(16, j));
    // 2.x — des pas que l'on voit (demande du décideur : « qu'on voie les pas et les gestes des bras quand ils marchent »).
    // De face : le bras du côté qui avance descend de deux points, l'autre remonte d'autant ; la robe tombe sur le genou
    // qui avance et se relève sur la jambe qui reste ; le pied de devant grandit, l'autre s'efface.
    const pas = (dg, dd, leve) => gabarit('marche de face', D0.map((r, j) => j >= 11 && j <= 16 ? g(D0[borne(j - dg)]) + m(r) + d(D0[borne(j - dd)])
      : j >= 27 && j <= 28 ? (leve === 'd' ? r.slice(0, 16) + '.'.repeat(16) : '.'.repeat(16) + r.slice(16)) : r), 30);
    CORPS.d[1] = foulee('marche de face', D0, 'g'); CORPS.d[2] = foulee('marche de face', D0, 'd');
    // de profil : le bras balance depuis l'épaule, la robe s'ouvre sur la foulée, les pieds s'écartent franchement
    const L0 = CORPS.l[0];
    CORPS.l[1] = enjambee(L0, false); CORPS.l[2] = enjambee(L0, true);
    ANCIENS.d = [pas(1, -1, 'd'), pas(-1, 1, 'g')];
    // recueillement : la tête inclinée, les mains posées l'une sur l'autre
    const sansMainD = { 12: '..........kSSSSSSSSSSk..........', 13: '..........kSSSSSsSSSSk..........', 14: '..........kSSsSSsSSSsk..........', 15: '......eee.kSSsSSsSSSsk.eee......' };
    const sansMainL = { 12: '.........SSSSSs......ekk........', 13: '.........SSSSSs......eek........', 14: '.........SSSSSss.....eek........', 15: '.........SSSSSssk....eeE........' };
    ALLURES.prie = {
      d: varie('recueillement de face', D0, Object.assign({ 8: '.....CCccCCCckNNNNkcCCCcckk.....', 9: '.....CCcccCCckNNNNkcCCccckk.....', 10: '......kkk.aAAAAAAAAAAa.kkk......', 11: '..........aaAAAAAAAAaa..........' }, sansMainD)),
      l: varie('recueillement de profil', L0, Object.assign({ 8: '.......NNCCCCCCCCcc..ckk........', 9: '.......NNcCCCCCCccc..ckk........', 10: '.........AAAAAa.kkkk.ckk........', 11: '.........aAAAaa......ckk........' }, sansMainL)) };
    // salut : la main sur le cœur
    ALLURES.salut = {
      d: varie('salut de face', D0, { 6: '.....CCccCCCCNNRRRRrkc.cCck.....', 7: '.....CCcccCCCNNRRRrrkc.cCck.....', 8: '......kkk.ckRRRRRRrrkc.cckk.....', 9: '..........ckrRRRRRrrkc.cckk.....', 10: '..........aAAAAAAAAAAa.cckk.....', 11: '..........aaAAAAAAAAaa.cckk.....',
        12: '..........kSSSSSSSSSSk.kkkk.....', 13: '..........kSSSSSsSSSSk.NNN......', 14: '..........kSSsSSsSSSsk.NNN......', 15: '......eee.kSSsSSsSSSsk.eNe......' }),
      l: varie('salut de profil', L0, Object.assign({ 6: '.........RNNCCCCCCcc.cck........', 7: '.........RRRcCCCCccc.ckk........', 8: '.........RRRRrr.kkkk.ckk........', 9: '.........RRRrrr......ckk........', 10: '.........AAAAAa......ckk........', 11: '.........aAAAaa......ckk........' }, sansMainL)) };
    // surprise : les bras s'écartent (le moteur ajoute un petit sursaut)
    const buste = { 6: '..........ckRRRRRRRrkc..........', 7: '..........ckRRRRRRrrkc..........', 8: '..........ckRRRRRRrrkc..........', 9: '..........ckrRRRRRrrkc..........', 10: '..........aAAAAAAAAAAa..........', 11: '..........aaAAAAAAAAaa..........' };
    ALLURES.surpris = {
      d: varie('surprise de face', D0, Object.assign({ 3: '..NNCCCCCCckRRRRRRRRkcCCCCCCNN..', 4: '..NNcCCCCcckRRRRRRRRkccCCCccNN..', 5: '....kkkkkkckRRRRRRRrkckkkkkk....' }, buste, sansMainD)),
      l: varie('surprise de profil', L0, Object.assign({ 4: '...NNCCCCCCCCcr......cckCCNN....', 5: '...NNcCCCCCcccr......ckkccNN....', 6: '.........RRRRrr......ckk........', 7: '.........RRRRrr......ckk........', 8: '.........RRRRrr......ckk........', 9: '.........RRRrrr......ckk........',
        10: '.........AAAAAa......ckk........', 11: '.........aAAAaa......ckk........' }, sansMainL)) };
    // garde : le manteau ramené devant soi
    ALLURES.garde = {
      d: varie('garde de face', D0, Object.assign({ 3: '.....CCCCCcCCCCCCCcckcCCcck.....', 4: '.....CCCc.cCCCCCCcCcck.cCck.....', 5: '.....CCCc.cCCCCCcCCcck.cCck.....', 6: '.....CCcc.CCCCCcCCCcck.cCck.....', 7: '.....CCcc.CCCCcCCCcckk.cCck.....',
        8: '.....CCcc.CCCcCCCccckk.cckk.....', 9: '.....CCcc.CCcNNCCcckkk.cckk.....', 10: '.....Cccc.CcCNNCcckkkk.cckk.....', 11: '.....Cccc.cCCCCcckkaAa.cckk.....' }, { 12: '.....kkkk.kSSSSSSSSSSk.kkkk.....', 13: '..........kSSSSSsSSSSk..........', 14: '..........kSSsSSsSSSsk..........', 15: '......eee.kSSsSSsSSSsk.eee......' })),
      l: varie('garde de profil', L0, Object.assign({ 3: '........CCCCCCCCCCCc.cck........', 4: '.......CCCCcCCCCCCcc.cck........', 5: '.......CCCcCCCCCCccc.cck........', 6: '.......CCcCCCCCCcccc.cck........', 7: '.......CCcCCNNCCcccc.ckk........',
        8: '.......CccCCNNCcccck.ckk........', 9: '........cccCCCcccckk.ckk........', 10: '.........AAAAAakkkkk.ckk........', 11: '.........aAAAaa......ckk........' }, sansMainL)) };
    // résolution : un bras levé, la tête droite (dix lignes de plus, au-dessus des épaules)
    const leve = (x, rows) => ({ haut: 10, rows: gabarit('bras levé', [VIDE].concat(['NNN', 'NNN', 'NNN', 'kkk', 'CCc', 'CCc', 'CCc', 'CCc', 'CCc'].map(s3 => '.'.repeat(x) + s3 + '.'.repeat(W2 - 3 - x)), rows), 40) });
    ALLURES.resolu = {
      d: leve(5, varie('résolution de face', D0, { 0: '.....CCc.cCCCCCccCCCCck.........', 1: '.....CCCCCCCCCccccCCCCcck.......', 2: '.....CCCCCCCcRRRRRRcCCCcck......', 4: '..........ckRRRRRRRRkc.cCck.....', 5: '..........ckRRRRRRRrkc.cCck.....', 6: '..........ckRRRRRRRrkc.cCck.....',
        7: '..........ckRRRRRRrrkc.cCck.....', 8: '..........ckRRRRRRrrkc.cckk.....', 9: '..........ckrRRRRRrrkc.cckk.....', 10: '..........aAAAAAAAAAAa.cckk.....', 11: '..........aaAAAAAAAAaa.cckk.....', 12: '..........kSSSSSSSSSSk.kkkk.....',
        13: '..........kSSSSSsSSSSk.NNN......', 14: '..........kSSsSSsSSSsk.NNN......', 15: '......eee.kSSsSSsSSSsk.eNe......' })),
      l: leve(4, varie('résolution de profil', L0, Object.assign({ 0: '....CCc.....rRAArCCCc...........', 1: '....CCc...rRRRrCCCCCCcc.........', 2: '....CCcc.RRRRRrCCCCCCcck........', 3: '....cCCCCCCCCCr.kkkk.cck........', 4: '.....kkkkkkkkRr......cck........',
        5: '.........RRRRrr......cck........', 6: '.........RRRRrr......cck........', 7: '.........RRRRrr......ckk........', 8: '.........RRRRrr......ckk........', 9: '.........RRRrrr......ckk........', 10: '.........AAAAAa......ckk........', 11: '.........aAAAaa......ckk........' }, sansMainL))) };
    // accablement : à genoux, la tête basse — vingt lignes posées au sol
    ALLURES.accable = {
      d: gabarit('accablement de face', D0.slice(0, 12).concat(['.....kkkk.kSSSSSSSSSSk.kkkk.....', '......NNNkSSSSSsSSSSSkNNN.......', '.....eNNkSSSSSSsSSSSSSkNNe......', '....EeekLLLLLLLlLLLLLLLkeee.....',
        '...EEeekLLLLLLLLlLLLLLLLkeee....', '...EEeekLLLlLLLLlLLLLlLLkeeee...', '..EEEeekZZZZZZZZZZZZZZZZkeeee...', VIDE]), 20),
      l: gabarit('accablement de profil', L0.slice(0, 12).concat(['.........SSSSSs.kkkk.ekk........', '........SSSSSSsNNN...eek........', '......SSSSSSSSsSSskeeeeE........', '.....LLLLLLLLLlLLlkeeeeEE.......',
        '....LLLLLLLLLLlLLlkeeeeEEE......', '....LLLLLLLLLlLLLlkeeeeEEEE.....', '....ZZZZZZZZZZZZZZkeeeeEEE......', VIDE]), 20) };
  }
  D.POSES.forEach(p => { if (!ALLURES[p] || !ALLURES[p].d || !ALLURES[p].l) throw new Error('pose sans grand dessin : ' + p); });
  /* ---------- de dos ----------
     Le manteau couvre le dos : C en haut, puis B (le pan du dos : couleur du manteau ; sans manteau, la robe ; en tenue
     courte, les jambes), son pli au milieu. Mêmes colonnes que de face : les règles de tenue s'y appliquent telles quelles. */
  { const U0 = CORPS.u[0] = gabarit('corps de dos', [
      '.........cCCCCCCCCCCCck.........', '.......CCCCCCCCCCCCCCCcck.......', '......CCCCCCCCCCCCCCCCCcck......', '.....CCCCCCCCCCCCCCCCCCCcck.....',
      '.....CCCc.cCCCCCCCCCCc.cCck.....', '.....CCCc.cCCCCCCCCCCc.cCck.....', '.....CCcc.cCCCCCCCCCCc.cCck.....', '.....CCcc.cCCCCCCCCCcc.cCck.....',
      '.....CCcc.cCCCCCcCCCcc.cckk.....', '.....CCcc.cCCCCCcCCCcc.cckk.....', '.....Cccc.cCCCCCcCCCcc.cckk.....', '.....Cccc.ccCCCCcCCccc.cckk.....',
      '.....kkkk.kBBBBBBBBBBk.kkkk.....', '......NNN.kBBBBBBBBBbk.NNN......', '......NNN.kBBBBBbBBBbk.NNN......', '......ENE.kBBBBBbBBBbk.ENe......',
      '......EEE.kBBBBBbBBBbk.EEe......', '......EEekBBBBBBbBBBBbkEEe......', '......EEekBBbBBBbBBBbBkEEe......', '......EEekBBbBBBbBBBbBkEee......',
      '.....EEEekBBbBBBmmBBBbBkEEe.....', '.....EEEekBBbBBBmmBBBbBkEEe.....', '.....EEEekBBbBBBmmBBBbBkEee.....', '.....EEEekBBbBBBmmBBBbBkEee.....',
      '.....EEeekBBbBBBmmBBBbBkEee.....', '.....EeeekZZZZZZMMZZZZZkeee.....', '..........FFFFf..FFFFf..........', '..........FFFFf..FFFFf..........',
      '..........FFFFf..FFFFf..........', '................................'], 30);
    const g = r => r.slice(0, 10), m = r => r.slice(10, 22), d = r => r.slice(22), borne = j => Math.max(11, Math.min(16, j));
    const pas = (dg, dd, leve) => gabarit('marche de dos', U0.map((r, j) => j >= 11 && j <= 16 ? g(U0[borne(j - dg)]) + m(r) + d(U0[borne(j - dd)])
      : j >= 27 && j <= 28 ? (leve === 'd' ? r.slice(0, 16) + '.'.repeat(16) : '.'.repeat(16) + r.slice(16)) : r), 30);
    CORPS.u[1] = foulee('marche de dos', U0, 'd'); CORPS.u[2] = foulee('marche de dos', U0, 'g'); ANCIENS.u = [pas(1, -1, 'd'), pas(-1, 1, 'g')];
    const sansMains = rows => rows.map(r => r.replace(/NNN/g, '...').replace('ENE', 'EEE').replace('ENe', 'EEe'));
    ALLURES.prie.u = gabarit('recueillement de dos', sansMains(U0), 30);
    // résolution : le bras levé est, de dos, du côté droit de l'image
    ALLURES.resolu.u = { haut: 10, rows: gabarit('résolution de dos', [VIDE].concat(['NNN', 'NNN', 'NNN', 'kkk', 'CCc', 'CCc', 'CCc', 'CCc', 'CCc'].map(s3 => '.'.repeat(24) + s3 + '.'.repeat(5)),
      U0.map((r, j) => j >= 4 && j <= 12 ? r.slice(0, 22) + '.'.repeat(10) : j >= 13 && j <= 16 ? r.slice(0, 23) + '.'.repeat(9) : r)), 40) };
    ALLURES.accable.u = gabarit('accablement de dos', U0.slice(0, 12).concat(['.....kkkk.kBBBBbBBBBBk.kkkk.....', '......NNNkBBBBBbBBBBBkNNN.......', '.....eNNkBBBBBBbBBBBBBkNNe......', '....EeekBBBBBBBbBBBBBBBkeee.....',
      '...EEeekBBBBBBBBbBBBBBBBkeee....', '...EEeekBBBbBBBBbBBBBbBBkeeee...', '..EEEeekZZZZZZZZZZZZZZZZkeeee...', VIDE]), 20); }

  /* ---------- les gestes de frappe (2.x) ----------
     Deux attitudes de plus pour le grand personnage : l'élan (le bras armé levé) et le coup (le bras tendu vers ce qu'il
     frappe), dans les trois vues. Ce ne sont pas des poses du récit (D.POSES) : le moteur seul les prend, le temps d'un
     coup, en combat et dans les labyrinthes. Le bras est tracé d'un trait épais, de l'épaule au poignet par le coude ;
     l'arme n'est pas dans le gabarit : le moteur la pose dans la main (G.arme) et la fait tourner. */
  const GESTES = {}, HAUT_GESTE = 10;
  // un membre : la manche, son revers, la main ; un liseré d'un point le détache de ce qu'il recouvre (pas à l'épaule, où
  // il s'attache). pts : épaule, coude, poignet — en colonnes et en lignes du corps (négatif : au-dessus des épaules).
  function membre(rows, pts) {
    const L = rows.map(r => r.split('')), Hn = L.length, P = pts.map(q => [q[0], q[1] + HAUT_GESTE]), pris = new Map(), cle = (x, y) => y * W2 + x;
    const disque = (cx, cy, r, f) => { for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) if (x >= 0 && x < W2 && y >= 0 && y < Hn && Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r) f(x, y); };
    let ux = 0, uy = 0;
    for (let i = 1; i < P.length; i++) { const a = P[i - 1], dx = P[i][0] - a[0], dy = P[i][1] - a[1], l = Math.hypot(dx, dy); ux = dx / l; uy = dy / l;
      let nx = -uy, ny = ux; if (nx + ny > 0) { nx = -nx; ny = -ny; }                      /* la normale qui regarde la lumière, en haut à gauche */
      for (let t = 0; t <= l; t += 0.25) { const cx = a[0] + ux * t, cy = a[1] + uy * t;
        disque(cx, cy, 2.05, (x, y) => pris.set(cle(x, y), (x + 0.5 - cx) * nx + (y + 0.5 - cy) * ny > -0.35 ? 'C' : 'c')); } }
    const fin = P[P.length - 1], le = (x, y) => (x + 0.5 - fin[0]) * ux + (y + 0.5 - fin[1]) * uy;   /* le long de l'avant-bras, depuis le poignet */
    [...pris.keys()].forEach(k => { const x = k % W2, y = (k - x) / W2, d = le(x, y); if (d > 0.3) pris.delete(k); else if (d > -1.0) pris.set(k, 'k'); });   /* le revers de la manche */
    const main = [fin[0] + ux * 1.7, fin[1] + uy * 1.7];
    disque(main[0], main[1], 1.72, (x, y) => { if (!pris.has(cle(x, y)) || le(x, y) > 0.3) pris.set(cle(x, y), 'N'); });
    pris.forEach((m, k) => { const x = k % W2, y = (k - x) / W2; L[y][x] = m; });
    pris.forEach((m, k) => { const x = k % W2, y = (k - x) / W2; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const X = x + dx, Y = y + dy;
      if (X < 0 || X >= W2 || Y < 0 || Y >= Hn || pris.has(cle(X, Y)) || L[Y][X] === '.') return; if (Math.hypot(X + 0.5 - P[0][0], Y + 0.5 - P[0][1]) < 3.3) return; L[Y][X] = '.'; }); });
    return { rows: L.map(r => r.join('')), main };
  }
  { const D0 = CORPS.d[0], L0 = CORPS.l[0], U0 = CORPS.u[0], dessus = []; for (let i = 0; i < HAUT_GESTE; i++) dessus.push(VIDE);
    const glisse = (r, n) => n > 0 ? '.'.repeat(n) + r.slice(0, W2 - n) : n < 0 ? r.slice(-n) + '.'.repeat(-n) : r, penche = (rows, f) => rows.map((r, j) => glisse(r, f(j)));
    // de profil, le corps sans son bras : le flanc paraît, dans l'ombre du manteau
    const sansBrasL = varie('profil sans bras', L0, { 3: '.........RRRRRrcccccccck........', 4: '.........RRRRRrcccccccck........', 5: '.........RRRRrrcccccccck........', 6: '.........RRRRrrcccccccck........',
      7: '.........RRRRrrccccccckk........', 8: '.........RRRRrrccccccckk........', 9: '.........RRRrrrccccccckk........', 10: '.........AAAAAaccccccckk........', 11: '.........aAAAaaccccccckk........',
      12: '.........SSSSSssskkkkeee........', 13: '.........SSSSSssskkkeeee........', 14: '.........SSSSSssskkeeeee........', 15: '.........SSSSSssskeeeeeE........' });
    // de face, le bras qui frappe est à gauche de l'image ; de dos, à droite (le même bras)
    const sansBrasD = D0.map((r, j) => j >= 4 && j <= 14 ? '.'.repeat(10) + r.slice(10) : j === 15 ? '......eee.' + r.slice(10) : r);
    const sansBrasU = U0.map((r, j) => j >= 4 && j <= 12 ? r.slice(0, 22) + '.'.repeat(10) : j >= 13 && j <= 14 ? r.slice(0, 23) + '.'.repeat(9) : j === 15 ? r.slice(0, 22) + '.eee......' : r);
    // glisse : ce dont chaque ligne du corps a penché (les objets du râwî la suivent)
    const geste = (quoi, corps, pts, tete, glisse) => { const m = membre(dessus.concat(corps), pts); return { haut: HAUT_GESTE, rows: gabarit(quoi, m.rows, 40), main: m.main, tete: tete || [0, 0], glisse: glisse || null }; };
    const penche1 = j => j <= 8 ? 1 : 0, penche2 = j => j <= 6 ? -2 : j <= 12 ? -1 : 0;
    GESTES.elan = {   // le bras armé levé : derrière la tête de profil, sur le côté de face et de dos
      l: geste('élan de profil', penche(sansBrasL, penche1), [[19.5, 2.6], [25, 0.2], [26, -5.6]], [1, 0], penche1),
      d: geste('élan de face', sansBrasD, [[7.5, 3], [3.6, 1], [2.9, -4.4]]),
      u: geste('élan de dos', sansBrasU, [[24.5, 3], [28.2, 1], [28.9, -4.4]]) };
    GESTES.coup = {   // le bras tendu vers ce qu'il frappe ; de profil, le corps se fend
      l: geste('coup de profil', penche(varie('fente', sansBrasL, jambes(true)), penche2), [[15.5, 4], [10.6, 5.4], [6.2, 6.9]], [-3, 1], penche2),
      d: geste('coup de face', sansBrasD, [[7.5, 3.4], [7.3, 9], [11.4, 12.4]], [0, 1]),
      u: geste('coup de dos', sansBrasU, [[24.5, 3], [27.6, 0.2], [25.8, -4.4]]) };
    G.GESTES = Object.keys(GESTES);
  }

  /* ---------- têtes natives ----------
     Une tête = un haut (8 lignes : le sommet de la coiffe), un bandeau (2 lignes) et un tour de visage (10 lignes, dont
     les 2 dernières recouvrent le col). Les turbans partagent bandeau et tour de visage ; les casques, le camail. */
  const recule = (rows, n) => rows.map(r => n > 0 ? '.'.repeat(n) + r.slice(0, W2 - n) : r.slice(-n) + '.'.repeat(-n)); // n > 0 : vers la droite
  // le bandeau : la couleur du Compagnon, entre le turban et le voile
  const BAND_D = ['.........uaAAAAAAAAAAau.........', '..........aaAAAAAAAAaa..........'];
  const BAND_L = ['........aAAAAAAAAAAAaauu........', '.........aAAAAAAAAaaauu.........'];
  // le tour de visage d'un turban : l'étoffe encadre un voile en ovale, puis passe sous le menton
  const FACE_D = ['..........tuuvVVVVvuut..........', '..........TuVVVVVVVVut..........', '..........TuVVVVVVVVut..........', '..........TuVVVVVVVVut..........', '..........TuVVVVVVVVut..........',
    '..........tuVVVVVVVVuu..........', '..........tuuvVVVVvuuu..........', '...........tuuvVVvuuu...........', '............tTttuuuu............', '.............ttuuuu.............'];
  const FACE_L = ['.........vVVVVvuttttuuu.........', '........vVVVVVVutTttuuu.........', '........VVVVVVVutTttuu..........', '........VVVVVVVutTtuuu..........', '........VVVVVVVuttuuuu..........',
    '........vVVVVVvuttuuu...........', '.........vVVVVvuutuuu...........', '..........vVVvuuttuu............', '............tTttuuuu............', '.............ttuuuu.............'];
  // le camail : des mailles autour du voile et sur la nuque — rien ne traverse le voile, pas même un nasal
  const MAIL_D = ['..........iivVVVVVVvii..........', '..........iIVVVVVVVVIi..........', '..........IiVVVVVVVViI..........', '..........iIVVVVVVVVIi..........', '..........IiVVVVVVVViI..........',
    '..........iIvVVVVVVvIi..........', '..........IiIvVVVVvIiI..........', '..........iIiIvVVvIiIi..........', '...........IiIiIiIiIi...........', '............iIiIiIiI............'];
  const MAIL_L = ['.........vVVVVvIiIiIiIi.........', '........vVVVVVViIiIiIiI.........', '........VVVVVVVIiIiIiIi.........', '........VVVVVVViIiIiIiI.........', '........VVVVVVVIiIiIiIi.........',
    '........vVVVVVviIiIiIiI.........', '.........vVVVVvIiIiIiIi.........', '..........vVVviIiIiIiI..........', '...........iIiIiIiIiIi..........', '............IiIiIiIiI...........'];
  const turban = (haut, hautL) => ({ d: haut.concat(BAND_D, FACE_D), l: (hautL || haut).concat(BAND_L, FACE_L) });

  // le turban des Compagnons, d'après le premier modèle : enroulé large, ses plis en biais
  const H_IMAMA = [VIDE, '............tHTTTTtu............', '..........tTHTTTtTTTtu..........', '.........tTTTTTTTttTtTu.........', '.........TTtTTTttTTTutu.........',
    '........tTTTTTTTTTTutTtu........', '........TtttTTuuuttTTtTu........', '........uttTtuuttutTTttu........'];
  const H_IMAMA_L = [VIDE, '............tHTTTTtu............', '..........tTHTTTTtTTtu..........', '.........tTTTTTTttTTtTu.........', '........tTTtTTTttTTTuttu........',
    '........TTTTTTTTTTTutTtu........', '........TtttTTuuuttTTtTu........', '........uttTtuuttutTTttu........'];
  tete('imama', turban(H_IMAMA, H_IMAMA_L));
  // turban large et bas, d'après les deuxième et quatrième modèles
  const H_LARGE = [VIDE, VIDE, '...........tTTHTTTTtu...........', '.........tTTHTTTTTTTTtu.........', '........tTTTTTTttTTTtTtu........', '.......tTTtTTTuuTTTuutTtu.......', '.......TtTuuTTTTTuuTTTutu.......', '........uttTuuttttuuTttu........'];
  tete('imama_large', turban(H_LARGE));
  // turban haut, enroulé serré
  const H_HAUTE = ['.............tTTTtu.............', '............tTHTTTtu............', '...........tTHTTuTTtu...........', '...........TTTTuTTTtu...........', '..........tTTuuTTTTutu..........',
    '..........TTuTTTTuuTtu..........', '.........tTTTTTuuTTTTtu.........', '.........uttTuuTTTTuttu.........'];
  tete('imama_haute', turban(H_HAUTE));
  // calotte : une coiffe basse, l'étoffe serrée autour de la tête
  const H_CALOTTE = [VIDE, VIDE, VIDE, VIDE, VIDE, '...........tTTTTTTTtu...........', '..........tTTHTTTTTTtu..........', '.........tTTTTTTtTTTTtu.........'];
  tete('calotte', turban(H_CALOTTE));
  // turban dont un pan retombe sur l'épaule : le turban des Compagnons, et son pan (les lignes au-delà de la vingtième descendent sur le corps)
  { const pan = (rows, de, a, x) => rows.concat(new Array(Math.max(0, a + 1 - rows.length)).fill(VIDE)).map((r, y) => y >= de && y <= a ? r.slice(0, x) + ((y + (y >> 1)) % 2 ? 'Tt' : 'tu') + r.slice(x + 2) : r);
    const T = TETES.imama; tete('imama_queue', { d: pan(T.d, 8, 21, 22), l: pan(T.l, 9, 22, 22) }); }
  // casque pointu, d'après le troisième modèle ; ceint d'un turban, ou nu
  const H_CASQUE = ['...............Ji...............', '...............Ji...............', '..............JIIi..............', '.............JIIIii.............', '............JIIIIIii............',
    '...........JIIIIIIIii...........', '..........JIIIiIIIIiij..........', '..........IIIIiIIIIiij..........'];
  const CEINT = ['.........tTTTuTTTTuTTtu.........', '.........TuuTTTuuTTTutu.........'], BORD = ['.........JIIIIIIIIIIIIi.........', '.........iiiiiiiiiiiiij.........'];
  tete('casque_turban', { d: H_CASQUE.concat(CEINT, MAIL_D), l: recule(H_CASQUE.concat(CEINT), -1).concat(MAIL_L) });
  tete('casque', { d: H_CASQUE.concat(BORD, MAIL_D), l: recule(H_CASQUE.concat(BORD), -1).concat(MAIL_L) });
  // casque à bandes : des plaques rivées sous des bandes de cuir, sans pointe
  { const h = [VIDE, VIDE, '............IIIIIIii............', '...........JIIwIIwIii...........', '..........JIIIwIIwIIii..........', '..........IIIIwIIwIIii..........', '.........JIIIIwIIwIIIij.........', '.........IIIIIwIIwIIIij.........',
      '.........WwWwWwWwWwWwWw.........', '.........iiiiiiiiiiiiij.........'];
    tete('casque_bandes', { d: h.concat(MAIL_D), l: recule(h, -1).concat(MAIL_L) }); }
  // casque de cuir : une calotte de cuir durci, galonnée, sur l'étoffe
  { const h = [VIDE, VIDE, VIDE, '...........WWWWWWWWWw...........', '..........WWWWWWWWWWww..........', '.........WWWWWwWWWWWWww.........', '.........WWWWwWWWWWwWww.........', '.........WWwWWWWWWwWWww.........',
      '.........aaaaaaaaaaaaaa.........', '..........aaaaaaaaaaaa..........'];
    tete('casque_cuir', { d: h.concat(FACE_D), l: recule(h, -1).concat(FACE_L) }); }
  // la capuche, d'après le septième modèle : une pointe, des pans plus étroits que les épaules, le visage dans son ombre ;
  // elle se resserre au cou, puis son camail d'étoffe retombe en plis sur le col (les lignes au-delà de la vingtième
  // descendent sur le corps)
  tete('capuche', {
    d: [VIDE, '...............tu...............', '..............tTtu..............', '.............tTHTtu.............', '............tTHTTTtu............', '...........tTHTTTTTtu...........',
        '..........tTTTTTTTTTtu..........', '.........tTTTtttttttTtu.........', '.........TTtuuuuuuuutTu.........', '.........TtuuvVVVVvuutu.........', '.........TtuvVVVVVVvutu.........',
        '.........TtuVVVVVVVVutu.........', '.........TtuVVVVVVVVutu.........', '.........TtuVVVVVVVVutu.........', '.........TtuVVVVVVVVutu.........', '.........TtuvVVVVVVvutu.........',
        '.........tTtuvVVVVvuttu.........', '..........ttuuvVVvuutu..........', '........tTTtuuuuuuuuttTu........', '.......tTTTTtttuuuutttTTu.......', '......tTTTTTTTtttttTTTTTTu......',
        '......TTTTTTTTTttTTTTTTTtu......', '.......tTTTTTTttttTTTTTtu.......', '.........uttttuuuuttttu.........'],
    l: [VIDE, '..................tu............', '................tTTtu...........', '..............tTHTTtu...........', '............tTHTTTTTtu..........', '..........tTHTTTTTtTTtu.........',
        '.........tTTTTTTTTTtTTtu........', '........tTTTttTTTTTTtTtu........', '.......tTtuuuutTTTTTtTtu........', '.......TtuvVVvutTTTTtTtu........', '.......TtuVVVVVutTTTTttu........',
        '.......TtuVVVVVutTTTTttu........', '.......TtuVVVVVutTTTtttu........', '.......TtuVVVVVutTTTttu.........', '.......tTuVVVVVuttTttuu.........', '........tuvVVVvuttTttu..........',
        '........ttuvVvuutttuu...........', '.........tuuuuuuttuu............', '.......tTTtuuuttTTttu...........', '......tTTTTtttTTTTTttu..........', '......TTTTTTTTTTTTTtttu.........',
        '.......tTTTTTtTTTTtttuu.........', '.........utttttttttuuu..........']
  });
  // les mailles : « # » devient un anneau clair ou sombre selon sa place — la lumière vient d'en haut à gauche,
  // le bord droit et le bas sont dans l'ombre, et rien ne brille contre le voile
  const mailler = rows => rows.map((r, y) => r.split('').map((m, x) => { if (m !== '#') return m;
    const en = (dx, dy) => { const q = rows[y + dy]; return q ? (q[x + dx] || '.') : '.'; }, vide = c => c === '.', voile = c => c === 'V' || c === 'v';
    let n = 1; if (vide(en(-1, 0)) || vide(en(0, -1))) n--; if (vide(en(1, 0)) || vide(en(0, 1))) n++;
    if (voile(en(-1, 0)) || voile(en(1, 0)) || voile(en(0, 1))) n = Math.max(n, 1);
    return ['JI', 'Ii', 'ij'][Math.max(0, Math.min(2, n))][(x + y) & 1]; }).join(''));
  // coiffe de mailles : des anneaux ajustés au crâne, qui encadrent le voile et retombent en camail sur les épaules ;
  // le bas du camail est dans l'ombre, pour qu'il se détache d'une cotte
  tete('coiffe_mailles', {
    d: mailler([VIDE, VIDE, VIDE, VIDE, '.............######.............', '...........##########...........', '..........############..........', '..........############..........', '..........############..........',
        '..........###vvvvvv###..........', '..........##vVVVVVVv##..........', '..........##VVVVVVVV##..........', '..........##VVVVVVVV##..........', '..........##VVVVVVVV##..........', '..........##VVVVVVVV##..........',
        '..........##vVVVVVVv##..........', '..........###vVVVVv###..........', '..........####vVVv####..........', '.........##############.........', '........################........', '.......##################.......',
        '.......jjjjjjjjjjjjjjjjjj.......']),
    l: mailler([VIDE, VIDE, VIDE, VIDE, '............######..............', '..........##########............', '.........############...........', '........##############..........', '........###############.........',
        '........###############.........', '.........vVVVVv########.........', '........vVVVVVV########.........', '........VVVVVVV########.........', '........VVVVVVV########.........', '........VVVVVVV#######..........',
        '........vVVVVVv#######..........', '.........vVVVVv######...........', '..........vVVv#######...........', '.........############...........', '........##############..........', '.......################.........',
        '.......jjjjjjjjjjjjjjjjj........'])
  });
  // le chèche et son voile, d'après le sixième modèle : le rouleau du turban, une bande de visage, puis l'étoffe du voile,
  // un ton plus bas, qui se resserre au cou et retombe sur le col ; deux plis la creusent
  { const sombre = ['.........uuuuuuuuuuuuuu.........'];
    tete('litham', {
      d: H_IMAMA.concat(sombre, ['..........tuvVVVVVVvut..........', '..........TuVVVVVVVVut..........', '..........tuvVVVVVVvuu..........', '.........tTTTTTTTTTTTtu.........', '.........ttDuuuuuuuuDuu.........',
        '.........ttDuuuuuuuuDuu.........', '..........ttDuuuuuuDuu..........', '..........ttDuuuuuuDuu..........', '...........ttDuuuuDuu...........', '..........tttDuuuuDuuu..........', '.........tttttDuuDuuuuu.........',
        '.........tttttDuuDuuuuu.........', '..........DDDDDDDDDDDD..........']),
      l: H_IMAMA_L.concat(sombre, ['.........vVVVVvDttTTtuu.........', '.........VVVVVVDttTTtuu.........', '.........vVVVVvDtTTttu..........', '........tTTTTTTDtTttu...........', '........ttuuuuuDtttuu...........',
        '........ttuuuuDuttuu............', '.........ttuuDuuttuu............', '..........tuDuuutuu.............', '.........ttDuuuuttuu............', '........ttDuuuuutttuu...........', '.......ttDuuuuuuttttuu..........',
        '.......ttDuuuuuuutttuuu.........', '........DDDDDDDDDDDDDD..........']) }); }
  // la tiare : un haut bonnet ceint d'un galon
  { const h = ['...........tTTTTTTTtu...........', '..........tTTHTTTTTTtu..........', '..........TTTTTTTTTTtu..........', '..........TTTTTTTTTttu..........', '..........aAAAAAAAAAAa..........', '..........aaAAAAAAAAaa..........',
      '.........tTTTTTTTTTTTtu.........', '.........uttttttttttuuu.........', '.........uuuuuuuuuuuuuu.........', '..........uuuuuuuuuuuu..........'];
    tete('tiare', { d: h.concat(FACE_D), l: h.concat(FACE_L) }); }
  // l'étoffe de tête des gens du désert : un voile retenu par un cordon ; il tombe droit le long des joues, s'évase sur les
  // épaules et finit en deux pans, de part et d'autre de la poitrine (stylisation)
  { const h = [VIDE, '............tTTTTTtu............', '..........tTTHTTTTTTtu..........', '.........tTTTTTTTTTTTtu.........', '.........aAAAAAAAAAAAAa.........', '.........aaAAAAAAAAAAaa.........', '........tTTTtTTTTTTtTTtu........'];
    tete('keffieh', {
      d: h.slice(0, 6).concat(['.........tTTtTTTTTTtTTu.........', '.........TTtuuuuuuuutTu.........', '.........TtuvVVVVVVvutu.........', '.........TtuVVVVVVVVutu.........', '.........TtuVVVVVVVVutu.........', '.........TtuVVVVVVVVutu.........',
        '.........TtuVVVVVVVVutu.........', '........tTtuVVVVVVVVutTu........', '........TTtuvVVVVVVvutTu........', '........TtTtuvVVVVvutTtu........', '.......tTtTTtuvVVvutTtTuu.......', '.......TTtTTttuuuuttTtTtu.......',
        '......tTTtTTtTtuutTtTTtTtu......', '......TTtTTtTTtuutTTtTTttu......', '......TTtTTt........tTTtTu......', '......tTtTTt........tTtTtu......', '.......uttu..........uttu.......']),
      l: h.concat(['........TTuuuuuTTTTTTttu........', '.........vVVVVvuTTtTTTtu........', '........vVVVVVVuTTTtTTttu.......', '........VVVVVVVuTTtTTTttu.......', '........VVVVVVVuTTTTtTtuu.......', '........VVVVVVVuTtTTTttuu.......',
        '........vVVVVVvuTTTtTTtuu.......', '.........vVVVVvuTTtTTttuu.......', '..........vVVvuuTtTTTtuuu.......', '............tuuTTTtTtuuu........', '............tuTTtTTTtuuu........', '...........tTuTTTtTTtuuu........',
        '...........TtuTtTTTttuu.........']) }); }
  /* ---------- les têtes, de dos ----------
     Pas de voile : de dos, on ne voit que l'étoffe ou le fer. Les turbans partagent la nuque ; les casques, le camail. */
  { const dos = (nom, rows) => { const t = voileUni(gabarit('tête ' + nom + '.u', rows, 20)); if (t) throw new Error('tête native ' + nom + '.u : ' + t); if (rows.some(r => /[Vv]/.test(r))) throw new Error('tête native ' + nom + '.u : un voile, de dos'); TETES[nom].u = rows; };
    const NUQUE = ['..........ttTTTTTTtttu..........', '..........tttttttttuuu..........', '..........tTTTTTTttttu..........', '..........tttttttttuuu..........', '..........ttTTTTTttttu..........',
      '..........tttttttttuuu..........', '..........tttTTTtttuuu..........', '...........tttttttuuu...........', '............ttttuuuu............', '.............ttuuuu.............']; // l'étoffe enroulée, dans l'ombre du turban
    const MAIL_U = mailler(['..........############..........', '..........############..........', '..........############..........', '..........############..........', '..........############..........',
      '..........############..........', '..........############..........', '...........##########...........', '...........##########...........', '............########............']);
    dos('imama', H_IMAMA.concat(BAND_D, NUQUE)); dos('imama_large', H_LARGE.concat(BAND_D, NUQUE)); dos('imama_haute', H_HAUTE.concat(BAND_D, NUQUE)); dos('calotte', H_CALOTTE.concat(BAND_D, NUQUE));
    // le pan du turban descend au milieu du dos
    dos('imama_queue', TETES.imama.u.concat(new Array(5).fill(VIDE)).map((r, y) => y >= 8 && y <= 24 ? r.slice(0, 15) + ((y + (y >> 1)) % 2 ? 'Tt' : 'tu') + r.slice(17) : r));
    dos('casque_turban', H_CASQUE.concat(CEINT, MAIL_U)); dos('casque', H_CASQUE.concat(BORD, MAIL_U));
    dos('casque_bandes', TETES.casque_bandes.d.slice(0, 10).concat(MAIL_U)); dos('casque_cuir', TETES.casque_cuir.d.slice(0, 10).concat(NUQUE)); dos('tiare', TETES.tiare.d.slice(0, 10).concat(NUQUE));
    dos('capuche', [VIDE, '...............tu...............', '..............tTtu..............', '.............tTHTtu.............', '............tTHTTTtu............', '...........tTHTTTTTtu...........',
      '..........tTTTTTTTTTtu..........', '.........tTTTTTTtTTTTtu.........', '.........TTTTTTTtTTTTtu.........', '.........TTTTTTTtTTTTtu.........', '.........TTTTTTTtTTTTtu.........',
      '.........TTTTTTTtTTTTtu.........', '.........TTTTTTTtTTTTtu.........', '.........TTTTTTTtTTTTtu.........', '.........TTTTTTTtTTTttu.........', '.........TTTTTTTtTTTttu.........',
      '.........tTTTTTTtTTTttu.........', '..........ttTTTTtTTttu..........', '........tTTtttttttttttTu........', '.......tTTTTTtttttttTTTTu.......', '......tTTTTTTTTTTTTTTTTTTu......',
      '......TTTTTTTTTTTTTTTTTTtu......', '.......tTTTTTTTTTTTTTTTtu.......', '.........uttttttttttttu.........']);
    dos('coiffe_mailles', mailler([VIDE, VIDE, VIDE, VIDE, '.............######.............', '...........##########...........', '..........############..........', '..........############..........', '..........############..........',
      '..........############..........', '..........############..........', '..........############..........', '..........############..........', '..........############..........', '..........############..........',
      '..........############..........', '..........############..........', '..........############..........', '.........##############.........', '........################........', '.......##################.......',
      '.......jjjjjjjjjjjjjjjjjj.......']));
    dos('litham', H_IMAMA.concat(['.........uuuuuuuuuuuuuu.........', '..........tttttttttttu..........', '..........ttttttDttttu..........', '..........tttttDtttttu..........'], TETES.litham.d.slice(12)));
    dos('keffieh', TETES.keffieh.d.slice(0, 6).concat(['........tTTTtTTTTTTtTTtu........', '........TTTTTTTtTTTTTTtu........', '........TTtTTTTtTTTTtTtu........', '........TTtTTTTtTTTTtTtu........', '........TTtTTTTtTTTTtTtu........',
      '........TTtTTTTtTTTTtTtu........', '........TTtTTTTtTTTTtTtu........', '........TTtTTTTtTTTTtTtu........', '........TTtTTTTtTTTTtTtu........', '........TTtTTTTtTTTTtTtu........', '.......tTTtTTTTtTTTTtTTtu.......',
      '.......TTTtTTTTtTTTTtTTtu.......', '......tTTTtTTTTtTTTTtTTTtu......', '......TTTTtTTTTtTTTTtTTTtu......', '.......tTTTtTTTtTTTtTTTtu.......', '.........tTTtTTtTTtTTtu.........', '...........tTtTtTtTtu...........',
      '.............tTtTtu.............', '...............tu...............'])); }
  Object.keys(HEADS).forEach(c => { if (!TETES[c] || !TETES[c].d || !TETES[c].l || !TETES[c].u) throw new Error('coiffe sans tête native : ' + c); });

  // familles de tons : les lettres d'une même matière, de la plus claire à la plus sombre
  const FAM = { H: 'Ttu', T: 'Ttu', t: 'Ttu', u: 'Ttu', D: 'Ttu', C: 'Cck', c: 'Cck', k: 'Cck', E: 'Cck', e: 'Cck', B: 'Cck', b: 'Cck', m: 'Cck', R: 'Rr', r: 'Rr', S: 'Ss', s: 'Ss', M: 'LlZ',
    L: 'LlZ', l: 'LlZ', Z: 'LlZ', J: 'Ii', I: 'Ii', i: 'Ii', j: 'Ii', W: 'Ww', w: 'Ww', F: 'Ff', f: 'Ff', A: 'Aa', a: 'Aa',
    x: 'xzo', z: 'xzo', o: 'xzo' };   // x z o : l'écharpe du râwî (ses gabarits propres, plus bas)
  function rampes(pal) { // par lettre : ses cinq tons et sa place parmi eux
    const R = {}, faites = {};
    const cinq = base => [mix(base[0], '#ffffff', lum(base[0]) > 0.8 ? 0.62 : 0.34)].concat(base.length > 2 ? base : [base[0], base[base.length - 1], mix(base[base.length - 1], '#20143a', 0.32)], [mix(base[base.length - 1], '#150f1d', base.length > 2 ? 0.42 : 0.56)]);
    Object.keys(FAM).forEach(m => { const fam = FAM[m], base = fam.split('').map(ch => pal[ch]).filter((c, i, a) => c && a.indexOf(c) === i);
      if (m === 'H' || m === 'J') { if (base.length) R[m] = { t: faites[base.join()] || (faites[base.join()] = cinq(base)), i: 0 }; return; }
      if (m === 'D' || m === 'j') { if (base.length) R[m] = { t: faites[base.join()] || (faites[base.join()] = cinq(base)), i: 4 }; return; }
      const col = pal[m]; if (!col) return; const i = base.indexOf(col);
      if (i < 0) R[m] = { t: cinq([col]), i: 1 }; else R[m] = { t: faites[base.join()] || (faites[base.join()] = cinq(base)), i: i + 1 }; });
    return R;
  }
  /* ---------- le râwî, d'après la maquette du décideur (2.x, pilote du nouveau dessin) ----------
     Idris a ses gabarits propres, retranscrits de la maquette que le décideur a fournie : un homme encapuchonné, plus
     élancé que les autres personnages (la tête plus petite, jamais plus large que les épaules : D151), la capuche et le
     long manteau ouvert, la tunique et les chausses amples, l'écharpe autour du cou qui retombe sur l'épaule et dans le
     dos, la ceinture de cuir et sa besace à la hanche, les bottes ; la bande et la ceinture de néon, sa marque de 2084,
     qui n'éclairent pas. Écarts voulus : le liseré doré des manches est un fil d'étoffe sourd (d : ni or, exigence 17) ;
     ni lumière ni aura ; aucune arme sur lui (au combat, l'arme portée vient de grid(), comme pour les autres).
     Le gabarit source a la finesse de la maquette : 64 × 96 (RAWI64) ; celui de 32 × 48 (la carte en dessin fin, le combat
     et les menus du dessin d'origine) en est tiré (reduire() ; RAWI_RETOUCHES, s'il le faut, le retouche). G.rawi64 = false
     rend le 64 × 96 retracé du 32 × 48 par fine(), comme pour les autres personnages : pour comparer.
     Qui le reçoit : le râwî seul, que le moteur marque (look.rawi : perso.js la pose ; un récit ne l'écrit jamais,
     regles.js le refuse), et seulement ce que le pilote dessine : la capuche, la coupe et l'étoffe de toujours (l'étoffe
     qui a ses couleurs de dessin : D.RAWI.etoffes[…].dessin), sans pièce ni objet choisis — le néon choisi, lui, colore la
     bande et la ceinture. Ses choix de visage (teint, barbe, poil) y sont peints par visage() ; les cheveux prennent son
     poil. Tout le reste garde le dessin d'avant. Pilote : de face, de profil, de dos, au repos, et la foulée de face (d1,
     d2 : tirées de l'image au repos, foulee64()) ; les pas de profil et de dos, les poses et les gestes reprennent l'image
     au repos — le souffle (grand(…, 3)) se tire de lui-même de l'image au repos.
     Lettres : celles du grand personnage — H T t u D la capuche ; C c k le manteau ; R r la tunique, S s son bas ; L l Z
     les chausses ; F f les bottes ; O K Q q le cuir de la ceinture et de la besace, U sa boucle (un métal sombre) ; N les
     mains ; V le visage ; Y y le néon — et cinq de plus : x z o l'écharpe, h p les cheveux (leur ombre et leur lumière,
     tirées du poil du visage), d le fil des manches. */
  /*RAWI64*/const RAWI64 = {
    // de face, au repos
    d: [
      '................................................................',
      '................................................................',
      '................................................................',
      '..............................HHTTD.............................',
      '..............................HTTTTD............................',
      '.............................HTTHHHuD...........................',
      '............................HttH...TtD..........................',
      '..........................HHT........uu.........................',
      '..........................HT...pphh..TuD........................',
      '.........................HT..hhph.....TD........................',
      '.........................T..pphh..pp...T........................',
      '........................T..pph.hpppphh.TD.......................',
      '........................T..h..VVVVVVVV..D.......................',
      '........................T...VVVVVVVVVVV.u.......................',
      '.......................TT.pVVVVVVVVVVVV.t.......................',
      '.......................TT.pVVVVVVVVVVVV.........................',
      '.......................TT.pVVVVVVVVVVVV.uu......................',
      '.......................TT..VVVVVVVVVVVV..u......................',
      '.......................T...VVVVVVVVVVVV.uu......................',
      '........................uD..VVVVVVVVVV.Tt.......................',
      '.........................TT..VVVVVVVV.TTT.......................',
      '.........................TT...VVVVVV..TT........................',
      '......................zzzo.uD........tD..o......................',
      '.....................zzzzzooo.zzzzzock.o.ooo....................',
      '....................zzzzzzzooo....ook.oo.ooo....................',
      '..................k.zzzzoozzzzzooo..zooo.oooo...................',
      '.................CC.zzzzooozzzzzzzzzzoooooooo...................',
      '.................CCc.zzzzoooozzzzzoo.oozzoookkk.................',
      '.................CCCk.zzzzoooooooooozzzzooo.kkcc................',
      '................CCCCkcC.zzzzzooooozzzzzooo.kkCC.................',
      '...............CCCCCcCCCkkz.zzzozzzzzzooo.ccc...................',
      '.................cc....CCkkkozozzzzzooo..cccccccc...............',
      '.................cccc..CCk...oo.zzzooo.CCccc.cccc...............',
      '................Ccc.ckk.kkkkrrrkYY...ccCCCC..cccc...............',
      '................CCCk.kk.ckkkrrrkYYrrr...CCC.kccck...............',
      '...............CCCCkkkk.cckkrrRkYYRRrkkk....kccckk..............',
      '...............CCCckkkc.ccCkrrRkYYRRrkkkkk.kk.cCkk..............',
      '...............CCcckk.c.ccCkrr.kYYRRrkkkkk.kkkCCkk..............',
      '..............CCCCcck.k.cccCkr.kYYRRrkCckk.kk.CCkkk.............',
      '.............CCCCCcck...cccCkrRkYYRrrkCcck.kk.CCkkk.............',
      '.............CCCCccck...cccCkrRkYYRrrCcckk.kkkCCkkk.............',
      '.............CCCCccck.........r......Ccck...kkCCkkkk............',
      '............CCCCCcckk...OOOOOOOOOOOOOO......kCCCCkkk............',
      '............dCCCccckk...KUUKKKKKKKKKKQQqq....CCCCkkk............',
      '............Ccddccckk...KUUKKKyyyyyyKQQqq....cCCCdkk............',
      '............Ccccdcck....QQQQQQyyyyyyQqQq.....cdCcckk............',
      '............Ccccccdk...OOOOO.QKKQQQqQkkkk....rCCcck.............',
      '................cccc.rOOOO...k.ssssskkkkk....cCCC.r.............',
      '.............rrr..cc.rKKKOO..k.sssss.Ccckk...cC.rrr.............',
      '.............Rrrrr...rKKKO.k.k.ssssSCCcckk...c.rrrr.............',
      '..............Rrr....rO.KO..kC.ssssS.Cccck.....rRRr.............',
      '.............RRRr....rOKKO..kC.SSSSS.Cccckk.....RRrr............',
      '.............N.NN....QKOO.q.cCSSSSSSsCCcckk........N............',
      '..............NNN....K....q.c.SSSSSSsCCcckkk...NNNN.............',
      '..............NNNN...KKKQ.q.COSSSSSss.Cccckk...NNNN.............',
      '..............NN.N..NKKKQ.Q.COSSSSSSssCccckkk..NNNN.............',
      '.............NNN.N..NqqqO.qC.OSSSSSSss.Ccckk...N.NN.............',
      '..............NN.....QQQK..C.OSssSSSss.Cccckk....NN.............',
      '..............NNN.......k.kC.OSssSSSsssCCcckk...NN..............',
      '....................Ckkkccc.ssSssSSSsssCCccckk..................',
      '....................CkkCccc.sSSssSSSsss.Cccckk..................',
      '...................CCcCCccC.sSSssSSSsss.Cccckkk.................',
      '...................CCCCCcCC.sSSssSSSssss.Cccckk.................',
      '..................CCCCCccC.sSSSSsSSSSsss.Cccckk.................',
      '..................CCCCCccCssSSSSssSSSSsssCccckk.................',
      '..................CCCCCcc.ZZZ.LLLLLLZZZZZCcccckk................',
      '.................CCCCCccc.ZllZZ.kk.ZZZZZZ.Cccckk................',
      '.................CccCCccCZZllZZ.kk.ZZZZZZ.Cccckkk...............',
      '.................CcCCCccCZlllZ.kkk.llZZZZ..cccckk...............',
      '................CCCCCccC.lllLZZ.kc.llZZZZZ.cccckk...............',
      '................CCCCCccClllLLZ.kcc.lLLZLZZ.cccckkk..............',
      '................CCCCccCCllLLLZZ.cC.LLLLLLZZ.ccckkk..............',
      '...............CCCCCccC.lLLLZZZ.CC.LLLLLLZZ.ccccCCk.............',
      '.................CCcccC.lLLZZ.......LLLLLZZZcccCC...............',
      '................k.CccC.lllZZZZ......LLLLLLZZCccC................',
      '...................CCC.llZZZZ........LLLLLZZCCC.................',
      '....................CC.llLLZZ........lLLLLLZCCC.................',
      '...................l.C.LLLLZZ.......lllLLLLLCC..................',
      '...................lL..LLZZZZ.......lllllLLL.lZ.................',
      '...................ZlLLLZZ............lllllllZZ.................',
      '....................Zll...Z.............llllZ...................',
      '...................FF..ffff............FFF....f.................',
      '...................FFFffffff..........FffFFffff.................',
      '...................FFFffffff..........FffFFffff.................',
      '....................FFffff.f...........fFFF.ff..................',
      '.....................ffff................fff....................',
      '......................fff...............ffff....................',
      '....................Fffff...............ffffff..................',
      '....................fffff...............fffffff.................',
      '..................FFffffff.............fffffffff................',
      '.................FFFffffff.............fffffFFFff...............',
      '................FFFFfff.ff.............fff.fFFF..f..............',
      '................FFFFFff....................FFFFFff..............',
      '................................................................',
      '................................................................',
      '................................................................'],
    // de profil (tourné vers la gauche), au repos
    l: [
      '................................................................',
      '................................................................',
      '................................................................',
      '..............................TTTTD.............................',
      '.............................HTTTuuD............................',
      '..........................HHHTTTuuuuD...........................',
      '........................HHHTTTTuuuuuuD..........................',
      '......................HHHHTTTTTuuuuuuuD.........................',
      '.....................ph..TTTTTTuuuuuuuu.........................',
      '....................h.hp..TTTTTTuuuuuuuu........................',
      '...................phhhhph.TTTTTTuuuuuu.........................',
      '...................h..ppVVVVTTTTTTuuuDD.........................',
      '......................pVVVVVVTuuTTTuuuDD........................',
      '......................VVVVVVVHuuuuTuuuDD........................',
      '.....................pVVVVVVVHuuuuuTuuuD.p......................',
      '.....................VVVVVVVVuuuuuuTTuuD........................',
      '....................VVVVVVVVV.uuuuuuTuuD........................',
      '.....................VVVVVVVV.uuuuuuDDDDD.......................',
      '.....................VVVVVVVV.uuuuuuDDDD........................',
      '.....................VVVVVVVV.uuuuuDDDD.........................',
      '......................VVVVVVp.TuuuDDD...........................',
      '......................hVVVVpp.TuuD..............................',
      '......................oo..zz.Ck.zzzzzooo........................',
      '........................ooz.c.xxzzzzzooooo......................',
      '......................ooo...zzzzzzzzzzooooo.....................',
      '......................ooo.xxxzzzzzzzzzzzooo.....................',
      '.....................zo.xxxxozzzzzzzzzzzooo.....................',
      '.....................zzxxzzoozz.cckk..oooooo....................',
      '.....................zzzzzzozz.CCCcckk.ooooo....................',
      '.....................ozzzzzzzCCCCCCcckk.ooooo...................',
      '.....................ozzzzz.CCCCC.....kk.oooo...................',
      '.....................zzzzz.....cccckkk.k.oooo...................',
      '.....................zzzz.kk..ccccckkk.kk.ooo...................',
      '......................RYcck.k.cccccckk..c.oooo..................',
      '.....................rRYCCkkk.cccccckk....oooo..................',
      '.....................rRYCCkkk.kCCccckk.k..oooo..................',
      '......................RYCCckk.kCCccckkk...oozz..................',
      '......................RYCcckkk.CCccckkk...oozz..................',
      '......................RYccckkk.Cccckkkk...oooz..................',
      '.....................RRYccccc..Cccckkkk...oooo..................',
      '......................RYcccck..CCCcckkk....ooo..................',
      '......................RYcc.ckk.CCCccckk....ooo..................',
      '.....................OOOOOOOO.CCCCcccckk.....oz.................',
      '.....................KKKKKKKQ.CCCCrrcckk.....oz.................',
      '.....................KyyyyyyQ.Crrccczckk......z.................',
      '.....................QyyyyyyQ.rCCccccczo......z.................',
      '.....................OQ.......CC.dd.cc.k........................',
      '.....................k.OOOOQq.C.rrrr...k........................',
      '.....................CKOOOQqq..rrrrr.kk.........................',
      '......................O.OOqqq.rRRRRr............................',
      '......................O.Oqqqqq.RRRRRrk..........................',
      '......................O.QQqqq..RRRRr.kk.........................',
      '......................OQQQQQN.....NN.kk.........................',
      '.....................OOQQQKKN.NNN..Nkkk.........................',
      '....................k.OQQ..K.NNNNN.kkkkk........................',
      '....................k.OQQ.K.NNNNNN.kcckkS.......................',
      '.....................OOqQQQ.NNNNNN.kcckk........................',
      '....................OO.KqQQ.NNNNNN.kcckk........................',
      '.....................OO......NNNNNkkccckk.......................',
      '...................c.llLcckkk.NN.kkcccckk.......................',
      '...................c.llLCckkkk..kkkccccck.......................',
      '...................c.LLLCkcckkkkkkcccccckk......................',
      '...................c.LLL.Ccccckkkkkccccckk......................',
      '...................c.LLL.Cccccckkkkccccckkk.....................',
      '...................k.LLL.CccCccck..Cccccckk.....................',
      '...................k.LLL.CCCCCccc.Z.Ccccckk.....................',
      '...................k.LLL..CCCCccc.Z.Cccccck.....................',
      '...................k.L..Z.CCCCccc.ZZCCcccckk....................',
      '..................kk..ZZZ.CCCCccc.ZZCCccccck....................',
      '..................kkk.ZZZ.CCCCccc.ZZ.Cccccckk...................',
      '..................ckk.ZZZZCCCCccc.lZ.CCccccck...................',
      '..................c...ZZZZCCCCccc.llZ.Cccccckk..................',
      '..................c...LLZ.CCCCCCC.lZZZ.CCcccck..................',
      '..................c...LLZl.CCCCC.llZZZ...CCccc..................',
      '..................c....Lll.CCCC.llllZZ.....Ccc..................',
      '.......................lll.CCC.lllLLZZZ.........................',
      '.......................lll.CC..llLLLZZZ.........................',
      '.......................Lll.C.Z.llLLLLZZZ........................',
      '......................LLLLl.ZZ.LLLLLLZZZ........................',
      '......................llLlZZZZ.LLLLLLZZZ........................',
      '........................lZZ....LLLLLZZZZ........................',
      '.......................FFFfffffFFFF.............................',
      '.......................FFffffff.....ffff........................',
      '.......................FFffffff.FFffff.f........................',
      '.......................FFffffff.FFffff.f........................',
      '........................ffff.....FFf............................',
      '...........................ff.......ff..........................',
      '......................FFfffff........ff.........................',
      '.....................FFFffffff...FFFffff........................',
      '....................FFFfffffff..FFFfffff........................',
      '.................FFFFFff..ff.FFFFFFfffff........................',
      '.................fffffff....FFFFFFffffff........................',
      '..................f....f....FFFFFff..fff........................',
      '................................................................',
      '................................................................',
      '................................................................'],
    // de dos, au repos
    u: [
      '................................................................',
      '................................................................',
      '................................................................',
      '..............................Ht................................',
      '.............................HHtu...............................',
      '.............................HHuuuD.............................',
      '............................HHTuuuuD............................',
      '...........................HHTTuuuuuD...........................',
      '..........................TTTTTuuuuuuDD.........................',
      '.........................TuuTTTuuuuuuDD.........................',
      '........................TTuuTTTuuuuuuDD.........................',
      '........................TuuuTTTuuuuuuuu.........................',
      '........................TuuuTTTuuuuuuuu.........................',
      '.......................TTuuuTTTuuuuuuuuu........................',
      '.......................TTuuuuTTuuuuuuuuu........................',
      '.......................TTuuuuuuuuuuuuuDD........................',
      '.......................TTTuuuuuuuuuuuDDD........................',
      '.......................TTTTuuuuuuuuuuDDD........................',
      '.......................uuTTTuuuuuuuuDDDDD.......................',
      '.......................uuuTTTuuuuuuDDDDDD.......................',
      '......................uuuuuuTTTuuuDDDDDD........................',
      '.......................uuuuuuTTTuDDDDDD.........................',
      '.......................ozzz.cckkkkkkk..oo.......................',
      '......................oozzzz..kkkkk..zoooo......................',
      '....................oooozzzzzz....zzzooooooo....................',
      '..................xxx.ozzz.zzzzzzzzzooooooooo...................',
      '.................zxxzzz.zzzzoozzzzooooooooooz...................',
      '................Ck.xzzz..zzzzoooooooozzzoooz..C.................',
      '................Ckkxxzzo.ozzzzooooozzzzooooz.cCC................',
      '.................Cc.xzzooozzzzzoooozzzoooooz.cCC................',
      '...............C.CCcxzzzoo.oozzzzoooooooozz.ccC.................',
      '...............C..C.xzzzzzz.oozzzzoooooozz.ccc.c................',
      '..............C.c.CC.zzzzzzk.oozzzzoozzzz.....cc................',
      '..............C.cc.C.zzzzzz.k.ooozzzzzz..kkkk.ccc...............',
      '...............Cccc..zzzzzz.kk..oozzz..k.k.kk.ccc...............',
      '...............CCcc..zzzzzz.kckk.......kkkkk.cCCcc..............',
      '..............CCCCcc.xzzzzzz.ccc.kccccckk..k.cCCcc..............',
      '..............CCCCc..xzzzzzz.ccc.cccccckk...ccCCCc..............',
      '.............CCCCCcc.xzzzzzz.ccc.cccccckk...ccCCCcc.............',
      '.............CCCCccc.xzzzzzz.ccc.ccccckk....ccCCCcc.............',
      '.............CCCCccc..zzzzzz.kcc.ccccckkk..kccCCCcc.............',
      '............CCCCccccc...zzzz.kkc.cccck.kk...kcCCCccc............',
      '............CCCccckk...ozzzz.OOOOOOOO.......kccCCccc............',
      '............CCCccckk.....zzz.KKKKKKKQqqq....kccCCccc............',
      '............CCCccckk....ozzz.KyyyyKKQ.qq.....ccCCccc............',
      '............CCrrrkkk....o.zz.QyyyyQQqqqq.....ccrrrcc............',
      '............CCCcrrr........z.QQQQQQQqq.KQQ...crCCccc............',
      '.............CCcckk....CCccz...........O.QQ..CCCCc..............',
      '...............cckk...CCCCc..kkc.ccckksO.Qq..CCCc.r.............',
      '.............RR...k...CCCCCkkkcc.cccck.O.Kq..k..rrr.............',
      '..............RRrr....ccCCCkkkcc.ccccc..Q.K....rrrrr............',
      '............RRRrrr....ccCCCkkccc.ccccc..OQQQ...rRRrr............',
      '............RRRrr....CccCCcccccc.ccccc..OOQQ....................',
      '.............NNNN....CCCCCcccccc.Ccccc..OOQQ...NNNN.............',
      '.............NNNNN...ccCCCcccccc.Ccccc..OOOQ...NNNN.............',
      '.............NNNNN..CccCCccccccc.Ccccc.qqqOq..NNNNN.............',
      '.............NN..N..CcCCCcccccc.s.cccc.qqq....N..NN.............',
      '.............NN....CCcCCCcccccc.s.ccccc.q......N.NN.............',
      '..............NNN..CccCCCcccccC.s.ccccck.......NNN..............',
      '..............N....ccCCCccccccC.s.ccccckkkk.....................',
      '...................cccCCccccccC.s.ccccckkkk.....................',
      '...................ccCCccccccc.ss.cccccckkkk....................',
      '..................CccCCccccccc.ss.Ccccccckkk....................',
      '..................CccCcccccccc.sssCccccccckkk...................',
      '.................CccCCcccccccCssssCCcccccckkk...................',
      '.................CccCccccccccCssSSCCccccccckk...................',
      '................CCccCccccccccCssSSCCcccccckkkk..................',
      '................CcccccccccccC.ssSS.Cccccccckkk..................',
      '...............CCcccccccccccC.sSSs.Ccccckkkkkk..................',
      '...............CCcccccccccccC....s.kCccckkkkkkk.................',
      '...............CCccccccccccCC....s.kCccckkkkkkk.................',
      '...............CCCCCcccccccC......s.Ccccckkkkkk.................',
      '..............C...ZC.ccccccC......Z.CcccckkkCk.k................',
      '..............kk.ZlZZ.cccccC......Z.cccccccC..k.................',
      '...............k.LLllZ.Cccc.......Z.ccccccC..kk.................',
      '.................LLLLll.CCc.......ZZ.ccCCC.ZZ...................',
      '.................LLLLlll..C.......ZZ.cCC.ZZZZ...................',
      '..................LLLLlll.C........l.CC.ZZZZZ...................',
      '................LLLLLLlllZZ............ZZLLZZZ..................',
      '.................LLLLLlllZ...........ZZZZLLZZ...................',
      '...................LLLL.Z..............ZZZZ.....................',
      '.................FFFFfffff..........FFFF.ffff...................',
      '.................FFFffffff..........FFfffffff...................',
      '.................FFFffffff..........FFfffffff...................',
      '.................FFFFfff...........FFFFfffff....................',
      '................................................................',
      '...................Ffff................fff......................',
      '..................Ffffff...............Fffff....................',
      '.................Fffffff..............FFfffff...................',
      '................FFffffff..............Ffffffff..................',
      '...............FFFffffff..............fffff.fff.................',
      '...............fffffffff..............fff.f.f.f.................',
      '...................Fffff..............FFFff.f.f.................',
      '................................................................',
      '................................................................',
      '................................................................']
  };/*/RAWI64*/
  // les proportions de son visage (visage()) : les yeux au tiers, la barbe et la bouche plus bas, pas d'ombre sur le front
  // (ses cheveux la font) ; de profil, l'œil en retrait du nez
  const RAWI_VISAGE = { yeux: 0.3, barbe: 0.6, bouche: 0.7, nuit: false, oeilProfil: 2 };
  // ce que la réduction perdrait ou brouillerait à 32 × 48, retouché à la main : [colonne, ligne, lettre] (aucune retouche
  // pour l'instant : la réduction suffit)
  const RAWI_RETOUCHES = { d: [], l: [], u: [], d1: [], d2: [] };
  // 64 × 96 → 32 × 48 : chaque carré de deux points sur deux donne une lettre — le visage, le néon et les mains d'abord ;
  // le vide s'il en tient trois points ; sinon la matière la plus présente (à égalité, celle du coin en haut à gauche, du
  // côté de la lumière), au ton moyen de ses points
  const TONS = ['HTtuD', 'Cck', 'Rr', 'Ss', 'LlZ', 'xzo', 'Ff', 'OKQq'], TON = {}; TONS.forEach(f => f.split('').forEach((c, i) => { TON[c] = [f, i]; }));
  function reduire(rows) {
    const o = [], fam = c => TON[c] ? TON[c][0] : c;
    for (let y = 0; y < rows.length / 2; y++) { let s = '';
      for (let x = 0; x < rows[0].length / 2; x++) {
        const q = [rows[2 * y][2 * x], rows[2 * y][2 * x + 1], rows[2 * y + 1][2 * x], rows[2 * y + 1][2 * x + 1]], n = {}, nf = {}; q.forEach(m => { n[m] = (n[m] || 0) + 1; nf[fam(m)] = (nf[fam(m)] || 0) + 1; });
        let m = (n.V || 0) >= 2 ? 'V' : (n.Y || 0) >= 2 ? 'Y' : (n.y || 0) >= 2 ? 'y' : (n.N || 0) >= 2 ? 'N' : (n['.'] || 0) >= 3 ? '.' : null;
        if (!m) { let b = -1, f = null; q.forEach(c => { if (c !== '.' && nf[fam(c)] > b) { b = nf[fam(c)]; f = fam(c); } });
          if (TON[f[0]] && f.length > 1) { const ts = q.filter(c => fam(c) === f).map(c => TON[c][1]); m = f[Math.round(ts.reduce((a, v) => a + v, 0) / ts.length)]; } else m = f; }
        s += m; }
      o.push(s); }
    // puis, dans une même matière, chaque point prend le ton le plus présent autour de lui : à cette taille, le grain des
    // plis devient du bruit
    const g = o.map(r => r.split('')), Hn = g.length, Wn = g[0].length;
    return o.map((r, y) => r.split('').map((m, x) => { const f = TON[m] && TON[m][0]; if (!f || y === 0 || x === 0 || y === Hn - 1 || x === Wn - 1) return m;
      const n = {}; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const c = g[y + j][x + i]; if (TON[c] && TON[c][0] === f) n[c] = (n[c] || 0) + (i || j ? 1 : 2); }
      let b = m; Object.keys(n).forEach(c => { if (n[c] > n[b]) b = c; }); return b; }).join(''));
  }
  // une foulée de face, tirée de l'image au repos comme celles des autres personnages (foulee()), à l'échelle de 64 × 96 : le
  // bras du côté qui avance descend de quatre points, l'autre remonte d'autant (au-dessous, le manteau reparaît) ; des
  // hanches aux pieds, la moitié qui avance descend de deux points — son pied dépasse —, l'autre remonte de deux : le talon
  // se lève. cote : 'g', la jambe de gauche (de l'image) avance.
  const RAWI_PAS = { bras: [36, 59], gauche: 22, droite: 42, hanches: 60, pas: 2, balancier: 4 };
  function foulee64(V0, cote) {
    const P = RAWI_PAS, av = cote === 'g' ? 1 : -1, vide = '.'.repeat(64), at = y => (y >= 0 && y < V0.length ? V0[y] : vide);
    return V0.map((r, y) => {
      let row = y >= P.hanches ? at(y - P.pas * av).slice(0, 32) + at(y + P.pas * av).slice(32) : r;
      // le bras qui descend s'allonge depuis le coude (jusque sur le manteau) ; celui qui remonte découvre le manteau
      const bras = descend => descend ? (y >= P.bras[0] && y <= P.bras[1] + P.balancier ? at(Math.max(P.bras[0], y - P.balancier)) : null) : (y >= P.bras[0] && y <= P.bras[1] ? at(y + P.balancier) : null);
      const g = bras(av > 0), d = bras(av < 0);
      if (g) row = g.slice(0, P.gauche) + row.slice(P.gauche); if (d) row = row.slice(0, P.droite) + d.slice(P.droite);
      return row; });
  }
  const RAWI32 = {};
  function rawiGabarits() {
    if (RAWI64.d && !RAWI64.d1) { RAWI64.d1 = foulee64(RAWI64.d, 'g'); RAWI64.d2 = foulee64(RAWI64.d, 'd'); }
    Object.keys(RAWI64).forEach(v => { const t = RAWI64[v];
      if (t.length !== 96 || t.some(r => r.length !== 64)) throw new Error('gabarit du râwî mal formé : ' + v + ' — ' + t.length + ' lignes de ' + t.map(r => r.length).join(','));
      const r = reduire(t).map(s => s.split('')); (RAWI_RETOUCHES[v] || []).forEach(([x, y, m]) => { r[y][x] = m; }); RAWI32[v] = r.map(s => s.join(''));
      [t, RAWI32[v]].forEach(g => { const e = voileUni(g); if (e) throw new Error('râwî ' + v + ' : ' + e); });
      if (v === 'u' && t.some(r => /[Vv]/.test(r))) throw new Error('râwî ' + v + ' : un visage, de dos'); });
  }
  rawiGabarits();
  G.rawi64 = true;   // false : le 64 × 96 du râwî retracé du 32 × 48 par fine(), comme les autres personnages — pour comparer
  // l'étoffe du râwî qui a ses couleurs de dessin (D.RAWI.etoffes[…].dessin), ou null
  const rawiEtoffe = look => { const E = D.RAWI && D.RAWI.etoffes; if (!E) return null;
    const k = Object.keys(E).find(e => E[e].dessin && E[e].robe === look.robe && E[e].head === look.head && E[e].cloak === look.cloak && (E[e].legs || null) === (look.legs || null)); return k ? E[k].dessin : null; };
  // → les couleurs du dessin du râwî, ou null : ce que le pilote ne dessine pas encore garde le dessin d'avant
  function rawiDe(look, K) {
    if (!look.rawi || look.kind !== 'cyber' || !RAWI64.d) return null;
    if (K.coiffe !== 'capuche' || (K.manteau || 'long') !== 'long' || K.court === false || K.echarpe || K.armure || K.cuirasse || K.motif || (look.porte && look.porte.length)) return null;
    return rawiEtoffe(look);
  }
  // sa palette : celle du moteur (le néon, le cuir, le fer, les bottes), puis les couleurs de l'étoffe — trois tons par
  // matière, dont rampes() tire les cinq ; une couleur seule en donne trois (ramp)
  function paletteRawi(look, K, dr) {
    const tons = v => Array.isArray(v) ? v : ramp(v);   // trois tons donnés (la maquette), ou tirés d'une couleur
    const p = palette(look, K), [T, t, u] = tons(dr.capuche || dr.manteau), [C, c, k] = tons(dr.manteau), [R, r] = tons(dr.tunique), [L, l, z] = tons(dr.chausses || dr.tunique), [x, zz, o] = tons(dr.echarpe);
    const poil = (typeof look.poil === 'string' && look.poil) || POILS[(signe(look) >>> 5) % POILS.length];   // les cheveux : le poil du visage (le choix du joueur, ou celui du moteur)
    return Object.assign(p, { T, t, u, C, c, k, R, r, S: R, s: r, L, l, Z: z, M: null, E: null, e: null, B: C, b: c, m: null, x, z: zz, o, h: mix(poil, '#6b4630', 0.2), p: mix(poil, '#a06a44', 0.45), d: mix(C, R, 0.4), U: '#4c4f58' });
  }
  // la grille du râwî : 32 × 48 (L), et son gabarit de 64 × 96 (rawi.L4), les objets tenus posés aux mêmes places
  function rawiGrille(look, K0, dessin, dir, frame, pose) {
    const key = dir === 0 ? 'd' : dir === 3 ? 'u' : 'l', Ge = !!(pose && GESTES[pose]);
    const v = key === 'd' && !pose && (frame === 1 || frame === 2) ? 'd' + frame : key;   // pilote : la foulée de face ; ailleurs, l'image au repos
    const K = Object.assign({}, K0, { sombre: false, visageP: RAWI_VISAGE });   // sous la capuche de la maquette, le visage est dans la lumière ; ses proportions
    const L = RAWI32[v].map(r => r.split('')), am = L.map(r => r.map(() => 0)), fin = L.map(r => r.map(() => 0)), L4 = RAWI64[v].map(r => r.split(''));
    const mains = (t, cote) => { let n = 0, sx = 0, sy = 0; t.forEach((r, y) => r.forEach((m, x) => { if (m === 'N' && (!cote || (cote < 0 ? x < r.length / 2 : x >= r.length / 2))) { n++; sx += x; sy += y; } })); return n ? [sx / n, sy / n] : null; };
    // les objets tenus (au combat : l'arme portée) : ceux de grid(), agrandis comme pour les autres personnages, ramenés aux mains du râwî
    const r = grid(look, dir === 2 ? 1 : dir, 0, null, {});
    if (r.objets.length) { const a = mains(L), b = mains(scale2x(r.g)); const dx = a && b ? Math.round(a[0] - b[0]) : 0, dy = a && b ? Math.round(a[1] - b[1]) : 0;
      r.objets.forEach(o => { if (Ge && EN_MAIN.indexOf(o.nom) >= 0) return; const o2 = scale2x(o.g);   // l'arme qui frappe : le moteur la pose dans la main
        for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) { const m = o2[y][x], X = x + dx, Y = y + dy; if (m === '.' || X < 0 || X >= W2 || Y < 0 || Y >= H2 || L[Y][X] === 'N') continue;
          L[Y][X] = m; fin[Y][X] = 1; for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) if (L4[2 * Y + j][2 * X + i] !== 'N') L4[2 * Y + j][2 * X + i] = m; } }); }
    // la main qui frappe, le temps d'un geste (pilote : l'image au repos) — de face, celle de gauche ; de dos, celle de droite
    const mg = Ge ? mains(L, key === 'd' ? -1 : key === 'u' ? 1 : 0) : null, main = mg ? [dir === 2 ? W2 - (mg[0] + 0.5) : mg[0] + 0.5, mg[1] + 0.5] : null;
    if (dir === 2) [L, am, fin, L4].forEach(t => t.forEach(row => row.reverse()));
    return { L, K, am, fin, hors: 0, main, sans: null, natifs: null, tm: null, rawi: { dessin, L4 } };
  }
  G.rawi = look => !!rawiDe(look, kindOf(look));   // pour les outils : ce râwî a-t-il le dessin de la maquette ?
  G.RAWI = { 64: RAWI64, 32: RAWI32 };
  // la grille de 32 × 48 d'un personnage, ou null si sa tête ou son corps n'ont pas encore de gabarit natif
  function natifGrille(look, dir, frame, pose) {
    const K0 = kindOf(look), key = dir === 0 ? 'd' : dir === 3 ? 'u' : 'l', nom = HEADS[K0.coiffe] ? K0.coiffe : 'imama';
    { const dr = rawiDe(look, K0); if (dr) return rawiGrille(look, K0, dr, dir, frame, pose); }   // le râwî d'après la maquette (pilote)
    const Ge = pose && GESTES[pose] ? GESTES[pose][key] : null; if (Ge) frame = 0;   // un geste de frappe : son propre gabarit, pas une pose du récit
    const tt = TETES[nom] && TETES[nom][key], P = !Ge && pose && POSES[pose] && POSES[pose][key] ? POSES[pose] : null;
    const A = Ge || (P ? (ALLURES[pose] && ALLURES[pose][key]) : (CORPS[key] && CORPS[key][frame || 0]));
    if (!tt || !A) return null;
    const r = grid(look, dir, frame, Ge ? null : pose, {}), K = r.K, kneel = r.kneel, hy = P ? (P.hy || 0) : 0, haut = A.haut || 0;
    let rows = A.rows || A; if (K.petit && !kneel) rows = rows.filter((x, j) => PETIT.indexOf(j - haut) < 0);
    const bT = H2 - rows.length, cou = bT + haut, y1 = kneel ? H2 : H2 - 4, L = [], am = [], fin = []; let hors = 0; // am : l'armure ; fin : dessiné tel quel, sans modelé
    for (let y = 0; y < H2; y++) { L.push(new Array(W2).fill('.')); am.push(new Array(W2).fill(0)); fin.push(new Array(W2).fill(0)); }
    rows.forEach((row, j) => { for (let x = 0; x < W2; x++) if (row[x] !== '.') L[bT + j][x] = row[x]; });
    // la tenue : pas de manteau, manteau sur une seule épaule, manteau ample ; rayures, bandes, armure, écharpe
    const nu = (x, y) => { const m = L[y][x]; L[y][x] = m === 'C' ? 'R' : (m === 'c' || m === 'k') ? 'r' : (m === 'E' || m === 'e') ? '.' : m === 'B' ? 'S' : (m === 'b' || m === 'm') ? 's' : m; };
    if (K.manteau === 'aucun' || (K.manteau === 'epaule' && dir === 2)) { for (let y = cou; y < y1; y++) for (let x = 0; x < W2; x++) nu(x, y); }
    else if (K.manteau === 'epaule') { for (let y = cou; y < y1; y++) for (let x = 0; x < W2; x++) if (key === 'd' ? x >= W : key === 'u' ? x < W : false) nu(x, y); }
    else if (K.manteau === 'ample' && !kneel) for (let y = cou + 2; y < y1; y++) {
      let a = 0; while (a < W2 && L[y][a] === '.') a++; let b = W2 - 1; while (b >= 0 && L[y][b] === '.') b--;
      const n = y < cou + 9 ? 1 : 2; // il s'évase vers le bas
      if (a > 1 && a < W2 && 'CckEe'.indexOf(L[y][a]) >= 0) { const m = L[y][a] === 'k' ? 'c' : L[y][a]; for (let i = 1; i <= n; i++) L[y][a - i] = m; }
      if (b < W2 - 2 && b >= 0 && 'CckEe'.indexOf(L[y][b]) >= 0) { const m = L[y][b] === 'C' ? 'c' : L[y][b]; for (let i = 1; i <= n; i++) L[y][b + i] = m; }
    }
    if (K.motif === 'rayures') { for (let y = cou; y < y1; y++) for (let x = 0; x < W2; x++) if ('RSLl'.indexOf(L[y][x]) >= 0 && x % 4 === 1) L[y][x] = 'a'; }
    else if (K.motif === 'bandes') { for (let y = cou; y < y1; y++) for (let x = 0; x < W2; x++) if ('CcEe'.indexOf(L[y][x]) >= 0 && (y - cou) % 6 === 4) L[y][x] = 'A'; }
    if (K.armure) { const bas = K.armure === 'mailles' ? 19 : K.armure === 'lamelles' ? 16 : 12, fer = K.armure === 'mailles' || K.armure === 'lamelles'; // la cotte descend plus bas que le cuir
      for (let y = cou; y < Math.min(y1, cou + bas); y++) for (let x = 0; x < W2; x++) { const m = L[y][x]; if ('RrSs'.indexOf(m) < 0) continue;
        L[y][x] = fer ? ((m === 'R' || m === 'S') ? 'I' : 'i') : K.armure === 'cuir' ? ((m === 'R' || m === 'S') ? 'W' : 'w') : m; am[y][x] = 1; } }
    if (K.echarpe && !kneel) { const n = key === 'd' ? 10 : key === 'l' ? 6 : 0, xa = key === 'd' ? 11 : 9;
      for (let i = 0; i < n; i++) for (let e = 0; e < 2; e++) { const x = xa + i, y = cou + 2 + i + e; if ('RrSs'.indexOf(L[y][x]) >= 0) L[y][x] = e ? 'a' : 'A'; } }
    if (K.chale && !kneel) for (let y = cou; y < cou + 4; y++) for (let x = 0; x < W2; x++) if ('Cck'.indexOf(L[y][x]) >= 0) L[y][x] = (x + y) % 3 ? 'T' : 't';
    if (K.drape && !kneel) for (let y = cou; y < cou + 4; y++) for (let x = 0; x < W2; x++) if ((x <= 10 || x >= 21) && 'Cck'.indexOf(L[y][x]) >= 0) L[y][x] = y < cou + 2 ? 't' : 'u'; // l'étoffe de tête retombe sur les épaules
    if (K.raies) [3, 6, 9].forEach(dy => { for (let x = 0; x < W2; x++) if ('RrCc'.indexOf(L[cou + dy][x]) >= 0) L[cou + dy][x] = 'T'; });
    if (K.neon) { const x = key === 'd' ? 15 : key === 'l' ? 11 : -1; if (x >= 0) for (let y = cou + 3; y < cou + 10; y++) if ('RrSsIiWw'.indexOf(L[y][x]) >= 0) L[y][x] = 'Y'; /* sur le buste seulement : une manche qui passe devant le cache */
      for (let y = cou + 10; y < cou + 12; y++) for (let x2 = 0; x2 < W2; x2++) if ('Aa'.indexOf(L[y][x2]) >= 0) L[y][x2] = 'y'; }
    // les objets tenus : ceux de grid(), agrandis, ramenés à la hauteur de la main
    const dyo = kneel ? 0 : (cou + 13 - (K.petit ? 2 : 0)) - (2 * r.b0 + 10);
    r.objets.forEach(o => { if (Ge && EN_MAIN.indexOf(o.nom) >= 0) return; /* l'arme qui frappe : le moteur la pose dans la main */ const o2 = scale2x(o.g), dxo = key === 'd' ? (HAMPES.indexOf(o.nom) >= 0 ? 2 : 0) : key === 'l' && (o.nom === 'durra' || o.nom === 'calame') ? 10 : 0; // la hampe vient contre la main
      for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) { const m = o2[y][x], X = x + dxo, Y = y + dyo; if (m !== '.' && X < W2 && Y >= 0 && Y < H2 && L[Y][X] !== 'N') { L[Y][X] = m; am[Y][X] = 0; fin[Y][X] = 1; } } });
    // les objets du râwî (D193) : leur dessin de 32 × 48, ici ; celui de 64 × 96 se pose sur la grille fine (fine()), au même
    // endroit — d'où ce qu'on garde : la grille sans eux (sans), et où passe la tête (tm), qui les recouvre
    const rawi = (look.porte || []).filter(o => RAWI_OBJETS.indexOf(o) >= 0); let sans = null, natifs = null, tm = null;
    if (rawi.length) { const copie = t => t.map(row => row.slice()), glisse = Ge && Ge.glisse ? Ge.glisse : null, ou = rawi.indexOf('lanterne') >= 0 ? lanterneOu(L, key, cou, 2, kneel, glisse) : null;
      sans = { L: copie(L), am: copie(am), fin: copie(fin) }; tm = L.map(() => new Array(W2).fill(0)); natifs = { noms: rawi, key, b0: cou, ou, glisse, dir };
      rawi.forEach(o => poserObjet(o, 2, (x, y, m) => { if (x >= 0 && x < W2 && y >= 0 && y < H2 && L[y][x] !== 'N') { L[y][x] = m; am[y][x] = 0; fin[y][x] = 1; } }, { b0: cou, key, ou, glisse })); }
    // la tête, inclinée ou abaissée selon la pose ; le cimier suit le sommet du casque
    const y0 = cou - 18 + 2 * hy + (Ge ? Ge.tete[1] : 0), x0 = (hy && key === 'l' ? -2 : 0) + (Ge ? Ge.tete[0] : 0), pose1 = (x, y, m) => { if (x < 0 || x >= W2 || y < 0 || y >= H2) hors++; else { L[y][x] = m; am[y][x] = 0; fin[y][x] = 1;
      if (sans) { sans.L[y][x] = m; sans.am[y][x] = 0; sans.fin[y][x] = 1; tm[y][x] = 1; } } };
    const nt = neonTete(K, tt, 2);   // le bandeau du râwî sous le turban et le chèche : ses néons (D193)
    for (let j = 0; j < (kneel ? 20 : tt.length); j++) for (let x = 0; x < W2; x++) if (tt[j][x] !== '.') pose1(x + x0, y0 + j, nt ? nt(j, x, tt[j][x]) : tt[j][x]); // à genoux, le pan du turban ne descend pas
    if (K.cimier) { const xs = key === 'l' ? [10, 21] : [14, 17]; for (let x = xs[0]; x <= xs[1]; x++) { let y = 0; while (y < tt.length && tt[y][x] === '.') y++; if (y < tt.length) for (let dy = 1; dy <= 2; dy++) pose1(x + x0, y0 + Math.max(dy - 1, y - dy), 'X'); } }
    if (dir === 2) [L, am, fin].concat(sans ? [sans.L, sans.am, sans.fin, tm] : []).forEach(t => t.forEach(row => row.reverse()));
    const main = Ge ? [dir === 2 ? W2 - Ge.main[0] : Ge.main[0], bT + Ge.main[1]] : null;   // où est la main qui frappe, dans la grille de 32 × 48
    return { L, K, am, fin, hors, main, sans, natifs, tm };
  }
  // la même grille de matières, deux fois plus grande, ses escaliers arrondis (la règle d'EPX, sur des lettres)
  function grilleFine(g, w, h) { const o = []; for (let y = 0; y < h * 2; y++) o.push(new Array(w * 2)); const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? '.' : g[y][x];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const p = g[y][x], a = at(x, y - 1), b = at(x + 1, y), c = at(x - 1, y), d = at(x, y + 1);
      o[y * 2][x * 2] = (c === a && c !== d && a !== b) ? a : p; o[y * 2][x * 2 + 1] = (a === b && a !== c && b !== d) ? b : p;
      o[y * 2 + 1][x * 2] = (d === c && d !== b && c !== a) ? c : p; o[y * 2 + 1][x * 2 + 1] = (b === d && b !== a && d !== c) ? d : p; }
    return o; }
  const doubler = t => { const o = []; t.forEach(r => { const q = []; r.forEach(v => q.push(v, v)); o.push(q, q.slice()); }); return o; };
  // la grille fine (64 × 96) d'un grand personnage natif : celle de 32 × 48, ses escaliers arrondis — sans les objets du râwî,
  // qui y sont dessinés à cette taille même (D193), sous la tête, jamais sur une main
  function fine(n) {
    if (n.rawi && G.rawi64) return { L: n.rawi.L4.map(r => r.slice()), am: doubler(n.am), fin: doubler(n.fin) };   // le râwî : son gabarit de 64 × 96, tel quel
    const b = n.sans || n, L = grilleFine(b.L, W2, H2), am = doubler(b.am), fin = doubler(b.fin), N = n.natifs; if (!N) return { L, am, fin };
    const W4 = W2 * 2, H4 = H2 * 2, tm = doubler(n.tm), c = []; for (let y = 0; y < H4; y++) c.push(new Array(W4).fill('.'));
    N.noms.forEach(o => poserObjet(o, 4, (x, y, m) => { if (x >= 0 && x < W4 && y >= 0 && y < H4) c[y][x] = m; }, { b0: 2 * N.b0, key: N.key, ou: N.ou, glisse: N.glisse }));
    if (N.dir === 2) c.forEach(r => r.reverse());
    for (let y = 0; y < H4; y++) for (let x = 0; x < W4; x++) if (c[y][x] !== '.' && !tm[y][x] && L[y][x] !== 'N') { L[y][x] = c[y][x]; am[y][x] = 0; fin[y][x] = 1; }
    return { L, am, fin };
  }
  /* ---------- le visage (2.x) ----------
     Les Compagnons n'ont pas de visage : leur voile est une lumière. Les autres personnages en ont un (décision du décideur,
     16 novembre) : un teint, des yeux, des sourcils, une barbe selon l'âge — peints dans l'ouverture de leur coiffe, de face
     et de profil ; rien de dos. Le teint et la barbe viennent du personnage lui-même (ses couleurs), jamais de son peuple
     (exigence 10) ; l'âge, de son type (ancien, enfant). look.sansVisage : quelqu'un que le jeu ne dessine pas en Compagnon
     mais qui en est un, ou que certains comptent parmi eux — dans le doute, pas de visage (D.SANS_VISAGE).
     → une fonction (x, y) → couleur pour chaque point du voile, ou null. */
  const TEINTS = ['#ecc49a', '#deab7c', '#cb9566', '#b47d50', '#9a6540'], POILS = ['#2c1e17', '#1f1613', '#402c1e', '#4d3626'];
  const SOMBRE = Math.min.apply(null, TEINTS.map(lum)) - 0.005;   // sous ce seuil, un teint est plus sombre que tous ceux du moteur (seul le râwî composé en a)
  // ce qui distingue un personnage d'un autre : toujours le même pour le même. look.visage : la marque gardée d'une tenue à l'autre (le râwî change de tenue, pas de visage)
  const signe = look => look.visage !== undefined ? look.visage >>> 0 : I.hash((look.kind || '') + '|' + (look.robe || '') + '|' + (look.head || '') + '|' + (look.cloak || '') + '|' + (look.sel === undefined ? '' : look.sel)) >>> 0;
  G.signe = signe;
  function visage(look, K, dir, pose, s, x0, x1, y0, y1) {
    if (K.lit || look.sansVisage || dir === 3 || x1 < x0) return null;
    const h = signe(look);
    const kd = look.kind || 'homme', age = kd === 'enfant' ? 0 : kd === 'ancien' ? 2 : (kd === 'savant' || kd === 'moine') ? ((h >>> 3) % 2 ? 2 : 1.5) : 1; // 0 enfant · 1 adulte · 1,5 grisonnant · 2 âgé
    let peau = look.teint || TEINTS[h % TEINTS.length]; if (K.sombre) peau = mix(peau, '#1c1430', 0.34);            // sous une capuche, le visage est dans l'ombre
    // 2.x — le râwî composé (D.RAWI) : un teint plus sombre que tous les TEINTS garde le blanc de l'œil jusque sur le
    // personnage de 32 × 48 (sinon l'œil s'y perd) ; la même ombre pour tous, pour que la gamme reste dans l'ordre
    const fonce = !!look.teint && lum(look.teint) < SOMBRE;
    const ombre = mix(peau, '#3a1e30', 0.30), nuit = mix(peau, '#221632', 0.5), clair = mix(peau, '#fff1d6', 0.28);
    const adulte = age === 1;                                                                                          // la barbe et le poil choisis (look.barbe, look.poil) : pour un adulte seulement — l'âge vient du type
    const poil = age >= 2 ? '#ece7dc' : age > 1 ? '#aaa296' : (adulte && typeof look.poil === 'string' && look.poil) || POILS[(h >>> 5) % POILS.length], poilO = mix(poil, '#20143a', 0.4);
    const barbe = age === 0 ? 0 : age >= 2 ? 2 : adulte && [0, 1, 2].indexOf(look.barbe) >= 0 ? look.barbe : [2, 1, 2, 0, 1, 2][(h >>> 7) % 6];  // 0 : glabre · 1 : courte · 2 : pleine
    const oeil = '#1b1420', blanc = mix('#fbf3e2', peau, 0.15), levre = mix(peau, '#6a2420', 0.5), sourcil = mix(peau, age >= 1.5 ? '#8a8378' : poil, 0.7);
    const w = x1 - x0 + 1, hh = y1 - y0 + 1, fente = hh < 5 * s, profil = dir === 1 || dir === 2, clos = pose === 'prie' || pose === 'accable';
    // les proportions du visage : celles du moteur, ou celles d'un gabarit qui dit les siennes (K.visageP : le râwî d'après
    // la maquette — un front court sous les cheveux, l'œil de profil en retrait du nez)
    const Pv = K.visageP || {}, po = Pv.oeilProfil || 1;
    const yo = fente ? y0 + s : y0 + Math.round(hh * (Pv.yeux || 0.40)), yb = y0 + Math.round(hh * (Pv.barbe || 0.64)), ym = y0 + Math.round(hh * (Pv.bouche || 0.74)); // les yeux, le haut de la barbe, la bouche
    const ex = Math.round(w * 0.22);                                                                                  // de face : l'écart d'un œil au bord
    return function (x, y) {
      const fx = profil ? (dir === 2 ? x1 - x : x - x0) : x - x0, gx = w - 1 - fx, dy = y - y0;                         // fx : depuis le devant du visage (profil) ou sa gauche (face)
      const dansOeil = profil ? (fx >= po * s && fx < (po + 1) * s) : ((fx >= ex && fx < ex + s) || (gx >= ex && gx < ex + s));
      if (y >= yo && y < yo + s && dansOeil) { if (clos) return y === yo + s - 1 ? sourcil : peau; return oeil; }
      if (!clos && (s === 2 || fonce) && y >= yo && y < yo + s && (profil ? fx === (po + 1) * s : (fx === ex - 1 || gx === ex - 1))) return blanc; // en dessin fin (et, pour un teint très sombre, toujours) : le blanc de l'œil, du côté du dehors
      if (!fente && s === 2 && y === yo - 2 && (profil ? (fx >= 1 + (po - 1) * s && fx <= 4 + (po - 1) * s) : ((fx >= ex - 1 && fx <= ex + 1) || (gx >= ex - 1 && gx <= ex + 1)))) return sourcil; // les sourcils : en dessin fin seulement (à 32 points de large, ils alourdiraient le regard)
      if (!fente && barbe && y >= yb) {
        if (profil && fx >= w - s - (barbe === 2 ? 0 : s)) return ombre;                                              // vers la nuque : la joue, dans l'ombre de l'étoffe
        if (barbe === 1 && y < ym && !(profil ? fx < 2 * s : Math.abs(fx - gx) <= 2 * s)) return peau;                 // barbe courte : la moustache seule, au-dessus
        if (y === ym && (profil ? fx < s : Math.abs(fx - gx) < s + 1)) return poilO;                                   // la bouche, une ombre dans la barbe
        return ((x + y) % 3 === 0 && s === 2) ? poilO : poil;
      }
      if (!fente && !barbe && y === ym && (profil ? fx < 2 * s : Math.abs(fx - gx) <= s + (s - 1))) return levre;
      if (dy < s && Pv.nuit !== false) return nuit;                                                                    // l'ombre de la coiffe sur le front (sous les cheveux du râwî, il n'y en a pas)
      if (!fente && !profil && s === 2 && fx === (w >> 1) && y > yo + s && y < yb) return ombre;                       // l'arête du nez
      if (profil ? fx === 0 && y > yo && y < yb : false) return clair;                                                 // de profil : le nez et la pommette prennent la lumière
      if (profil ? fx >= w - s : gx < s) return ombre;                                                                 // le côté dans l'ombre
      if (!profil && fx < s && dy >= s) return clair;
      return peau;
    };
  }
  G.teint = look => { const K = kindOf(look); if (K.lit || look.sansVisage) return null; return look.teint || TEINTS[signe(look) % TEINTS.length]; };
  G.aVisage = look => !(kindOf(look).lit || look.sansVisage); // un Compagnon n'en a pas, ni ceux que le jeu laisse sans visage
  // le visage que le moteur tire d'une apparence d'adulte (sa marque) : le teint, la barbe, le poil — pour le râwî composé (perso.js)
  G.traits = look => { const h = signe(look); return { teint: TEINTS[h % TEINTS.length], barbe: [2, 1, 2, 0, 1, 2][(h >>> 7) % 6], poil: POILS[(h >>> 5) % POILS.length] }; };
  // fin = 2 : le même personnage tracé en 64 × 96 — même composition, formes arrondies, liseré, arêtes et lumière du voile
  // deux fois plus fins. C'est lui que montrent le combat et les menus en dessin fin (gfx.D = 2).
  function grand(look, dir, frame, pose, fin2) {
    const s = fin2 === 2 ? 2 : 1;
    if (frame === 3 && G.natif) { // le souffle : le personnage au repos, le haut du corps remonté d'un point (la ligne de la taille se dédouble)
      const k3 = (s === 2 ? 'N' : 'n') + ck(look, dir, 3, pose); if (scache[k3]) return scache[k3];
      const g0 = grand(look, dir, 0, pose, fin2), cv3 = mk(g0.width, g0.height), c3 = cv3.getContext('2d'), taille = Math.round(g0.height * 0.66);
      c3.drawImage(g0, 0, taille, g0.width, g0.height - taille, 0, taille, g0.width, g0.height - taille); c3.drawImage(g0, 0, 1, g0.width, taille - 1, 0, 0, g0.width, taille - 1); c3.drawImage(g0, 0, taille, g0.width, 1, 0, taille - 1, g0.width, 1);
      if (g0.hd) cv3.hd = g0.hd; return (scache[k3] = cv3); }
    if (!G.natif) { if (s === 1) return ancien(look, dir, frame, pose); const ka = 'A' + ck(look, dir, frame, pose); return scache[ka] || (scache[ka] = G.epx(ancien(look, dir, frame, pose))); }
    const k = (s === 2 ? 'N' : 'n') + (G.rawi64 ? '' : 'r') + ck(look, dir, frame, pose); if (scache[k]) return scache[k];
    const n = natifGrille(look, dir, frame, pose); if (!n) return (scache[k] = s === 2 ? G.epx(ancien(look, dir, frame, pose)) : ancien(look, dir, frame, pose));
    const K = n.K, F = s === 2 ? fine(n) : n, L = F.L, am = F.am, fin = F.fin, pal = n.rawi ? paletteRawi(look, K, n.rawi.dessin) : palette(look, K), w = W2 * s, h = H2 * s;
    const tn = G.teint(look); if (tn) pal.N = mix(K.sombre ? mix(tn, '#1c1430', 0.2) : tn, '#fff1d6', 0.1); // qui a un visage a des mains du même teint (le grand personnage seulement)
    const R = rampes(pal);
    const cv = mk(w, h), c = cv.getContext('2d'), px = (x, y, col) => { if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); } }; if (s === 2) cv.hd = 2;
    const voile = m => m === 'V' || m === 'v', at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? '.' : L[y][x];
    const plein = (x, y) => { const m = at(x, y); return m !== '.' && (voile(m) || pal[m] != null); }, meme = (x, y, f) => { const m = at(x, y); return m !== '.' && FAM[m] === f && !!R[m]; };
    // le voile : une lumière qui se dégrade du centre vers le bord (Compagnons), une étoffe unie sinon — jamais un trait.
    // En dessin fin, celle d'un Compagnon rayonne de la couleur qui lui est propre (look.rayon) : un cœur blanc, puis sa couleur.
    const ray = K.lit && G.D > 1 && look.rayon ? look.rayon : null, ray1 = ray && mix(ray, '#ffffff', 0.5), ray2 = ray && mix(ray, '#ffffff', 0.08);
    let x0 = 99, x1 = -1, y0 = 99, y1 = -1; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (voile(L[y][x])) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 - 0.5, rx = (x1 - x0) / 2 + 0.5, ry = (y1 - y0) / 2 + 0.5;
    const trait = visage(look, K, dir, pose, s, x0, x1, y0, y1); // null pour un Compagnon : son voile reste une lumière, sans un trait
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const m = L[y][x]; if (m === '.') continue;
      if (voile(m)) { if (trait) { px(x, y, trait(x, y)); continue; } const dd = Math.hypot((x - cx) / rx, (y - cy) / ry); px(x, y, K.lit ? (ray ? (dd < 0.4 ? '#ffffff' : dd < 0.74 ? ray1 : ray2) : (dd < 0.5 ? '#ffffff' : dd < 0.82 ? pal.V : pal.v)) : (y - y0 < 2 * s || dd > 0.86 ? pal.v : pal.V)); continue; }
      const r = R[m]; if (!r) { px(x, y, pal[m]); continue; }                  // main, parchemin, néon, cimier : à plat
      let i = r.i;
      if (am[y][x]) { const a = K.armure, bordG = !am[y][x - 1], bordD = !am[y][x + 1], X = (x / s) | 0, Y = (y / s) | 0;   // l'armure : mailles fines, lamelles en rangs, cuir cousu, toile piquée — le motif garde sa taille, son bord s'affine
        if (a === 'mailles') i = bordG ? 1 : bordD ? 3 : ((X + Y) & 1) ? 2 : 1 + ((X * 3 + Y) % 7 === 0 ? -1 : 0);
        else if (a === 'lamelles') i = (Y % 3 === 2) ? 3 : (X % 3 === 2 ? 2 : bordG ? 0 : 1);
        else if (a === 'cuir') { if (Y % 4 === 3 || (X + (Y >> 2) * 2) % 5 === 0) i++; }
        else if ((X + Y) % 4 === 0 || (X - Y + 48) % 4 === 0) i++; }
      else if (!fin[y][x]) { const f = FAM[m];                               // le modelé du corps : une seule lumière, en haut à gauche
        if (!plein(x, y - 1)) i--; else if (!meme(x, y - 1, f) && !voile(at(x, y - 1))) i++;   // l'arête du haut la reçoit ; sous une autre matière, son ombre
        if (!plein(x - 1, y) && meme(x + 1, y, f)) i--;                       // le bord gauche est éclairé
        if (!plein(x + 1, y) && meme(x - 1, y, f)) i++;                       // le bord droit est dans l'ombre
        const dessous = at(x, y + 1);                                         // le galon : au bas de la robe longue et des pans du manteau
        if (pal.a && y > h * 0.6 && ((m === 'Z' && !K.court && (dessous === '.' || dessous === 'F' || dessous === 'f')) || ((m === 'E' || m === 'e') && !plein(x, y + 1)))) { px(x, y, pal.a); continue; } }
      px(x, y, r.t[Math.max(0, Math.min(r.t.length - 1, i))]); }
    outline(c, w, h);
    return (scache[k] = cv);
  }

  /* ---------- interface ---------- */
  // planche de marche : 4 directions × 3 pas, comme avant ; les poses se demandent à part
  G.charSheet = function (look) {
    const k = 'S' + JSON.stringify(look); if (scache[k]) return scache[k];
    const cv = mk(48, 96), c = cv.getContext('2d');
    for (let dir = 0; dir < 4; dir++) for (let f = 0; f < 3; f++) c.drawImage(small(look, dir, f), f * 16, dir * 24);
    cv.look = look; return (scache[k] = cv);
  };
  G.charPose = (look, dir, pose) => small(look, dir, 0, pose);
  G.charGrand = (look, dir, frame, pose) => grand(look, dir, frame || 0, pose);
  // Les personnages tels que le jeu les montre, à la définition courante (gfx.D). En dessin fin, la carte montre le grand
  // personnage — un point de gabarit pour un point réel — et le combat, ce même personnage agrandi, ses escaliers arrondis.
  // charSheet, charPose et charGrand, eux, rendent toujours les dessins bruts : les outils de contrôle les lisent.
  G.planche = function (look) { if (G.D < 2) return G.charSheet(look);
    const k = 'P' + (G.natif ? 'n' : 'a') + JSON.stringify(look); if (scache[k]) return scache[k];
    const cv = mk(128, 192), c = cv.getContext('2d');   // quatre images par direction : repos, pas A, pas B, souffle
    for (let dir = 0; dir < 4; dir++) for (let f = 0; f < 4; f++) c.drawImage(grand(look, dir, f), f * 32, dir * 48);
    cv.look = look; cv.hd = 2; cv.souffle = true; return (scache[k] = cv); };
  G.pose = function (look, dir, pose) { if (G.D < 2) return small(look, dir, 0, pose);
    const k = 'Q' + (G.natif ? 'n' : 'a') + ck(look, dir, 0, pose); if (scache[k]) return scache[k];
    const g = grand(look, dir, 0, pose), cv = mk(g.width, g.height); cv.getContext('2d').drawImage(g, 0, 0); cv.hd = 2; return (scache[k] = cv); };
  G.figure = function (look, dir, frame, pose) { if (G.D < 2) return grand(look, dir, frame || 0, pose); const g = grand(look, dir, frame || 0, pose, 2); if (!G.lisse) return g;
    const k = 'F' + (G.natif ? 'n' : 'a') + ck(look, dir, frame || 0, pose); if (scache[k]) return scache[k];
    const cv = mk(g.width, g.height); cv.getContext('2d').drawImage(g, 0, 0); cv.hd = 2; return (scache[k] = G.adoucir(cv)); };
  // 2.x — l'icône d'un objet tenu, tirée de son dessin même : la couche que grid() rend pour le grand personnage, agrandie
  // comme sur le personnage fin, recadrée sur l'objet seul (les choix du râwî : D.RAWI.objets). → une toile, ou null
  G.objet = function (nom) {
    const k = 'O' + (RAWI_OBJETS.indexOf(nom) >= 0 ? G.D : '') + nom; if (scache[k] !== undefined) return scache[k];
    const look = { kind: 'cyber', robe: '#2a3048', head: '#1c2030', cloak: '#39424f', porte: [nom] }, r = grid(look, 0, 0, null, {}), o = r.objets.find(x => x.nom === nom);
    let f = null;
    if (RAWI_OBJETS.indexOf(nom) >= 0) { const s = G.D > 1 ? 4 : 2, w4 = W2 * s / 2, h4 = H2 * s / 2; f = []; for (let y = 0; y < h4; y++) f.push(new Array(w4).fill('.'));   // les objets du râwî : leur dessin même, à la taille du dessin (D193)
      poserObjet(nom, s, (x, y, m) => { if (x >= 0 && x < w4 && y >= 0 && y < h4) f[y][x] = m; }, { b0: 2, key: 'd', ou: { x: 16, y: 2, en: 'main' } }); }
    else if (o) f = grilleFine(scale2x(o.g), W2, H2);
    if (!f) return (scache[k] = null);
    const pal = palette(look, r.K), haut = nom === 'besace' ? 2 + BESACE[G.D > 1 ? 4 : 2].d.sac[1] - (G.D > 1 ? 10 : 5) : 0; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;   // la besace : le sac, et le bas de sa sangle
    f.forEach((row, y) => row.forEach((m, x) => { if (m !== '.' && pal[m] && y >= haut) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }));
    if (x1 < 0) return (scache[k] = null);
    const w = x1 - x0 + 3, h = y1 - y0 + 3, cv = mk(w, h), c = cv.getContext('2d');
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const col = pal[f[y][x]]; if (col) { c.fillStyle = col; c.fillRect(x - x0 + 1, y - y0 + 1, 1, 1); } }
    outline(c, w, h); return (scache[k] = cv);
  };
  const ucache = {}; // image du grand sprite, pour les menus
  G.charURL = (look, dir, pose) => { const k = (G.natif ? 'n' : 'a') + G.D + ck(look, dir || 0, 0, pose); return ucache[k] || (ucache[k] = grand(look, dir || 0, 0, pose, G.D).toDataURL()); }; // en dessin fin : le personnage de 64 × 96
  /* ---------- l'arme en main, le temps d'un geste (2.x) ----------
     Le moteur la dessine lui-même, son manche dans la main, et la fait tourner : du bois, du fer, une corde — des objets
     ordinaires, sans or, sans rien d'écrit (exigence 17). Chaque arme est décrite le long de son axe (u : depuis la main
     vers la pointe ; v : en travers) et rend la matière du point, ou rien. */
  const ARMES = {
    sabre: (u, v) => { if (u < -3 || u > 14) return null; if (u < 0) return Math.abs(v) <= 0.75 ? 'bois' : null; if (u < 1.2) return Math.abs(v) <= 2.2 ? 'fonte' : null;
      const c = v + 0.011 * u * u, l = u > 10.5 ? 1.25 * (14 - u) / 3.5 : 1.25; return Math.abs(c) <= l ? 'fer' : null; },
    dague: (u, v) => { if (u < -2 || u > 7) return null; if (u < 0) return Math.abs(v) <= 0.7 ? 'bois' : null; if (u < 1) return Math.abs(v) <= 1.6 ? 'fonte' : null; return Math.abs(v) <= (u > 4 ? (7 - u) / 3 : 1) ? 'fer' : null; },
    lance: (u, v) => { if (u < -10 || u > 20) return null; if (u < 15) return Math.abs(v) <= 0.62 ? 'bois' : null; return Math.abs(v) <= 1.6 * (20 - u) / 5 + 0.2 ? 'fer' : null; },
    baton: (u, v) => u >= -6 && u <= 15 && Math.abs(v) <= 0.75 ? 'bois' : null,
    masse: (u, v) => Math.hypot(u - 11.2, v) <= 2.6 ? 'fer' : (u >= -3 && u <= 9.5 && Math.abs(v) <= 0.66 ? 'bois' : null),
    calame: (u, v) => u >= -1.5 && u < 4 && Math.abs(v) <= 0.56 ? 'bois' : (u >= 4 && u <= 5.4 && Math.abs(v) <= 0.45 ? 'sombre' : null),
    durra: (u, v) => u >= -2 && u <= 8.5 && Math.abs(v) <= 0.62 ? 'bois' : null,
    arc: (u, v) => { if (Math.abs(v) > 7.9) return null; if (u >= -1.6 && Math.abs(Math.hypot(u + 7, v) - 9.5) <= 0.7) return 'bois'; return Math.abs(u + 1.75) <= 0.3 && Math.abs(v) <= 7.6 ? 'corde' : null; },
    arc_tendu: (u, v) => { if (Math.abs(v) > 7.9) return null; if (u >= -1.6 && Math.abs(Math.hypot(u + 7, v) - 9.5) <= 0.7) return 'bois'; return u <= -1.5 && u >= -6.3 && Math.abs(u + 6.2 - Math.abs(v) * 0.6) <= 0.34 ? 'corde' : null; },
    fleche: (u, v) => { if (u < -9 || u > 2.6) return null; if (u > 0) return Math.abs(v) <= 1.2 * (2.6 - u) / 2.6 + 0.15 ? 'fer' : null; if (u < -6.8) return Math.abs(v) <= 1.1 ? 'corde' : null; return Math.abs(v) <= 0.42 ? 'bois' : null; }
  };
  const MATIERES = { fer: ['#dde2ea', '#8e96a4'], fonte: ['#8e96a4', '#666d7a'], bois: ['#9a6f41', '#5a3d22'], sombre: ['#3a2a1c', '#3a2a1c'], corde: ['#efe6cc', '#cfc4a4'] }, acache = {};
  // a : l'angle, en radians (0 : vers la droite ; il croît dans le sens des aiguilles d'une montre). e : points réels par
  // point de gabarit. → une image carrée, la main en son centre (cv.r : du coin au centre, en points logiques).
  G.arme = function (nom, a, e) {
    const f = ARMES[nom]; if (!f) return null; const pas = Math.PI / 24, ai = ((Math.round(a / pas) % 48) + 48) % 48, k = nom + '|' + ai + '|' + e + '|' + G.D; if (acache[k]) return acache[k];
    a = ai * pas; const R = Math.ceil(22 * e) + 2, S = 2 * R + 1, cv = mk(S, S), c = cv.getContext('2d'), ca = Math.cos(a), sa = Math.sin(a), clair = sa - ca > 0 ? 1 : -1; // de quel côté de l'axe vient la lumière (en haut à gauche)
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const X = (x - R) / e, Y = (y - R) / e, u = X * ca + Y * sa, v = -X * sa + Y * ca, m = f(u, v); if (!m) continue;
      c.fillStyle = MATIERES[m][v * clair > 0 ? 0 : 1]; c.fillRect(x, y, 1, 1); }
    outline(c, S, S); cv.hd = G.D; cv.r = (R + 0.5) / G.D; return (acache[k] = cv); };
  G.ARMES = Object.keys(ARMES);
  // un geste de frappe, tel que le moteur le montre : l'image du corps et la place de la main (en points logiques, depuis
  // le coin de l'image). grandeur : 'carte' (le personnage des cartes — en dessin fin seulement) ou 'combat'.
  const gcache = {};
  G.geste = function (look, dir, nom, grandeur) {
    if (!G.natif || !GESTES[nom]) return null; const carte = grandeur === 'carte'; if (carte && G.D < 2) return null;
    const k = ck(look, dir, 0, nom); let m = gcache[k]; if (m === undefined) { const n = natifGrille(look, dir, 0, nom); m = gcache[k] = n && n.main ? n.main : null; } if (!m) return null;
    return { img: carte ? G.pose(look, dir, nom) : G.figure(look, dir, 0, nom), main: carte ? [m[0] / 2, m[1] / 2] : [m[0], m[1]], e: carte ? 1 : G.D, q: carte ? 0.5 : 1 };
  };
  // Celui qui frappe : l'élan (le bras levé, l'arme haute), le balai (l'arme décrit son arc, trois images la suivent) puis
  // la tenue du coup. Par manière de frapper (D.GEAR_TYPES[…].anim) : les angles de l'arme pour qui regarde à gauche, en
  // degrés, du départ à l'arrivée (a) ; de dos, les siens (h).
  const DUREES = { elan: 0.11, balai: 0.07, tenue: 0.15 };
  const MANIERES = { slash: { a: [-70, -200], h: [-5, -98] }, smash: { a: [-84, -196], h: [-18, -96] }, thrust: { a: [174, 180], h: [-96, -90], pointe: true }, arrow: { a: [180, 180], h: [-90, -90], tir: true }, geste: { a: [-60, -172], h: [-8, -100] } };
  const versDir = (A, pp, dir) => { const a = A.a[0] + (A.a[1] - A.a[0]) * pp; return (dir === 1 ? a : dir === 2 ? 180 - a : dir === 0 ? a + 270 : A.h[0] + (A.h[1] - A.h[0]) * pp) * Math.PI / 180; }; // de dos : ses propres angles (h), l'arme finit droite au-dessus de la main
  G.FRAPPE = DUREES; G.dureeFrappe = DUREES.elan + DUREES.balai + DUREES.tenue;
  // dessine le geste à l'instant tau (secondes depuis son début), le coin de l'image en (x, y). g : { anim, port }.
  // → false si le geste est fini, ou si ce dessin ne le connaît pas : l'appelant dessine alors le personnage comme avant.
  G.frappe = function (c, look, dir, x, y, g, tau, grandeur) {
    const T = DUREES; if (!(tau >= 0) || tau >= G.dureeFrappe) return false;
    const A = MANIERES[g.anim] || MANIERES.geste, enCoup = tau >= T.elan, ge = G.geste(look, dir, enCoup || A.tir ? 'coup' : 'elan', grandeur); if (!ge) return false;
    const p = !enCoup ? 0 : Math.min(1, (tau - T.elan) / T.balai), angle = pp => versDir(A, 1 - (1 - pp) * (1 - pp), dir);
    const hx = x + ge.main[0], hy = y + ge.main[1];
    const pose = (nom, ang, alpha, recul) => { const im = G.arme(nom, ang, ge.e); if (!im) return; c.globalAlpha = alpha; c.drawImage(im, hx + Math.cos(ang) * (recul || 0) * ge.q - im.r, hy + Math.sin(ang) * (recul || 0) * ge.q - im.r); c.globalAlpha = 1; };
    const arme = () => { if (!g.port || !ARMES[g.port]) return;
      if (A.tir) { const ang = angle(1); pose(enCoup ? 'arc' : 'arc_tendu', ang, 1); if (!enCoup) pose('fleche', ang, 1, 3); else { const d = (tau - T.elan) * 520; if (d < 150) pose('fleche', ang, Math.max(0, 1 - d / 150), 9 + d); } return; }
      if (A.pointe) { pose(g.port, angle(p), 1, enCoup ? 4 * p : -5); return; }
      if (enCoup && p < 1) for (let i = 3; i >= 1; i--) pose(g.port, angle(Math.max(0, p - i * 0.2)), 0.14 * (4 - i)); // le sillage de l'arme
      pose(g.port, angle(p), 1); };
    if (dir === 3) arme(); c.drawImage(ge.img, x, y); if (dir !== 3) arme(); return true;
  };
  // 2.x — pour les contrôles (silhouettes.js) : ce que le moteur tire d'une apparence — la coiffe, la coupe, la longueur de la
  // robe, le néon (la marque du râwî) — et la grille des matières du petit personnage (16 × 24 : une lettre par point)
  G.allure = look => { const K = kindOf(look); return { coiffe: HEADS[K.coiffe] ? K.coiffe : 'imama', manteau: K.manteau || 'long', court: !!K.court, neon: !!K.neon }; };
  G.petiteGrille = (look, dir, frame, pose) => grid(look, dir || 0, frame || 0, pose).g.map(l => l.join(''));
  G.KINDS = KINDS; G.COIFFES = Object.keys(HEADS); G.RAWI_OBJETS = RAWI_OBJETS.slice();
  // une coiffe montre-t-elle un liseré, à une taille ou une autre (le bandeau d'un turban, de la calotte ; le chèche, de dos,
  // dans le petit personnage) : le râwî composé ne montre alors jamais le beige doré que le moteur pose à défaut (perso.js) —
  // ni là, ni sur le reste de l'habit (sous le turban et le chèche, son bandeau est fait de ses néons : NEON_TETE)
  G.galon = c => !!HEADS[c] && [HEADS[c], TETES[c]].some(v => !!v && ['d', 'l', 'u'].some(k => (v[k] || []).some(r => /[Aa]/.test(r))));
  G.natif = true; // false : le grand sprite d'avant, pour comparer
  // la grille de matières d'un grand sprite, pour le contrôle (tools/silhouettes.js) : 48 lignes de 32 lettres
  G.charGrille = (look, dir, frame, pose, fin2) => { const r = natifGrille(look, dir || 0, frame || 0, pose); if (r) return { lignes: (fin2 === 2 ? fine(r).L : r.L).map(l => l.join('')), natif: true, hors: r.hors }; // fin2 = 2 : la grille du personnage fin (64 × 96)
    return { lignes: scale2x(grid(look, dir || 0, frame || 0, pose).g).map(l => l.join('')), natif: false, hors: 0 }; };
})();
