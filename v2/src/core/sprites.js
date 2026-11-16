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
    const [T, t, u] = ramp(K.neon ? mix(head, '#6272a4', 0.3) : head), [R, r] = ramp(robe), q = ramp(robe)[2], [C, c, k] = ramp(cloak), A = mix(trim, '#ffffff', 0.12), a = mix(trim, '#20143a', 0.42);
    const legs = look.legs || '#4a3d32', [L, l, z] = K.court ? ramp(legs) : [R, r, q];
    const p = { T, t, u, R, r, S: R, s: r, C, c, k, A, a, N: mix(head, '#ffffff', 0.3), F: '#7a5433', f: '#46301e',
      L, l, Z: z, M: K.court ? null : r, E: K.court ? null : c, e: K.court ? null : k, B: K.court ? L : C, b: K.court ? l : c, m: K.court ? null : c,
      I: '#c3c8d2', i: '#7f8794', X: '#b33327', W: '#8a6238', w: '#5a3d22', P: '#f3e9cf', Y: '#39e6ff', y: '#ff4fd8' };
    if (K.lit) { p.V = '#fffbe8'; p.v = look.aura ? mix(look.aura, '#ffffff', 0.25) : '#ffe9a8'; p.N = '#fff3d6'; }
    else { p.V = mix(mix(head, '#5a4a4a', 0.6), '#2a1c3a', K.sombre ? 0.6 : 0.1); p.v = mix(p.V, '#20143a', 0.35); }
    if (K.cuirasse) { p.R = p.I; p.r = p.i; }
    return p;
  }

  /* ---------- composition d'une image : grille de 16 × 24 matières ---------- */
  function grid(look, dir, frame, pose, opt) { // opt : demandé par le grand sprite, qui veut aussi les objets tenus à part — sans effet sur le dessin
    const K = kindOf(look), it = opt ? [] : null; let couche = null; // it : les objets tenus, seuls, pour le grand sprite
    const key = dir === 0 ? 'd' : dir === 3 ? 'u' : 'l';
    const P = pose && POSES[pose] && POSES[pose][key] ? POSES[pose] : null;
    let bodyRows = P ? P[key] : BODIES[key][frame || 0]; const hy = P ? (P.hy || 0) : 0, kneel = !!(P && P.kneel);
    const petit = K.petit && !kneel ? 3 : 0; if (petit) bodyRows = bodyRows.filter((r, j) => j !== 3 && j !== 7 && j !== 8); // enfant : trois lignes de moins
    const extra = P ? (key === 'd' ? P.extraD : key === 'l' ? P.extraL : P.extraU) : null;
    const g = []; for (let y = 0; y < H; y++) { g.push(new Array(W).fill('.')); if (it) it.push(new Array(W).fill('.')); }
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
    const hip = b0 + 5; couche = it;
    for (const it of [].concat(K.item || [])) {
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
    // tête (11 lignes), inclinée ou abaissée selon la pose
    const head = HEADS[K.coiffe] || HEADS.imama, hrows = head[key] || head.d, h0 = (kneel ? b0 - 11 : petit) + hy, hx = hy && key === 'l' ? -1 : 0;
    {
    for (let j = 0; j < 11; j++) for (let x = 0; x < W; x++) put(x + hx, h0 + j, hrows[j][x]);
    if (K.coiffe === 'imama_queue' && !kneel) { // le pan du turban retombe sur l'épaule (de dos : entre les épaules)
      if (key === 'd') { put(13 + hx, h0 + 11, 't'); put(13 + hx, h0 + 12, 'u'); } else if (key === 'l') { put(13 + hx, h0 + 11, 't'); put(12 + hx, h0 + 12, 'u'); }
      else { put(7, h0 + 11, 'T'); put(8, h0 + 11, 't'); put(7, h0 + 12, 't'); put(8, h0 + 12, 'u'); put(7, h0 + 13, 'u'); } }
    if (K.cimier) { if (key === 'l') for (let x = 4; x < 11; x++) put(x, h0, 'X'); else for (let x = 6; x < 10; x++) { put(x, h0, 'X'); if (key === 'u') put(x, h0 + 1, 'X'); } }
    }
    if (extra) extra.forEach(([x, y, m]) => put(x, y, m));
    if (dir === 2) for (let y = 0; y < H; y++) g[y].reverse();
    return { g, K, key, b0, kneel, objets: it }; // objets : dans le repère non retourné
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
     tenus viennent de grid() lui-même, agrandis. Ce qui n'a pas encore son gabarit garde le grand sprite d'avant.
     Le voile (V) d'une tête est une surface d'un seul tenant : le moteur refuse de démarrer sinon — personne n'a de visage. */
  const W2 = W * 2, H2 = H * 2, TETES = {}, CORPS = { d: [], l: [] }, ALLURES = {};
  const PETIT = [7, 8, 17, 18, 21, 22]; // enfant : six lignes de corps en moins
  const VIDE = '................................';
  function voileUni(rows) { // → null si le voile est d'un seul tenant, sur chaque ligne et chaque colonne ; sinon ce qui cloche
    const V = (x, y) => y >= 0 && y < rows.length && (rows[y][x] === 'V' || rows[y][x] === 'v'), lignes = [];
    for (let y = 0; y < rows.length; y++) { let runs = 0, a = -1, b = -1; for (let x = 0; x < W2; x++) if (V(x, y)) { if (!V(x - 1, y)) { runs++; a = x; } b = x; } if (runs > 1) return 'voile coupé, ligne ' + y; if (runs) lignes.push([y, a, b]); }
    for (let x = 0; x < W2; x++) { let runs = 0; for (let y = 0; y < rows.length; y++) if (V(x, y) && !V(x, y - 1)) runs++; if (runs > 1) return 'voile coupé, colonne ' + x; }
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
  { // de face : un bras descend d'un pixel, l'autre monte ; un pied se lève
    const D0 = CORPS.d[0], g = r => r.slice(0, 10), m = r => r.slice(10, 22), d = r => r.slice(22), borne = j => Math.max(11, Math.min(16, j));
    const pas = (dg, dd, leve) => gabarit('marche de face', D0.map((r, j) => j >= 11 && j <= 16 ? g(D0[borne(j - dg)]) + m(r) + d(D0[borne(j - dd)])
      : j >= 27 && j <= 28 ? (leve === 'd' ? r.slice(0, 16) + '.'.repeat(16) : '.'.repeat(16) + r.slice(16)) : r), 30);
    CORPS.d[1] = pas(1, -1, 'd'); CORPS.d[2] = pas(-1, 1, 'g');
    // de profil : le bras balance d'un pixel, les pieds s'écartent puis se croisent
    const L0 = CORPS.l[0], balance = (r, n) => r.slice(0, 15) + (n < 0 ? r.slice(16, 22) + '.' : '.' + r.slice(15, 21)) + r.slice(22);
    CORPS.l[1] = varie('marche de profil', L0.map((r, j) => j >= 12 && j <= 15 ? balance(r, -1) : r), { 26: '.........FFFFf.....FFf..........', 27: '........FFFFFf.....Ff...........', 28: '.......FFFFFff..................' });
    CORPS.l[2] = varie('marche de profil', L0.map((r, j) => j >= 12 && j <= 15 ? balance(r, 1) : r), { 26: '...........FFf....FFFFf.........', 27: '...........Ff....FFFFFf.........', 28: '................FFFFFff.........' });
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
  // la capuche, d'après le septième modèle : profonde, le visage dans son ombre
  tete('capuche', {
    d: [VIDE, VIDE, VIDE, '............tTTTTTtu............', '..........tTTHTTTTTtuu..........', '.........tTTTTTTTTTTtuu.........', '........tTTTTtttttTTTtuu........', '........TTTtuvvvvvvutTtu........',
        '.......tTTtuvVVVVVVvutTtu.......', '.......TTtuVVVVVVVVVVutTu.......', '.......TTtuVVVVVVVVVVutTu.......', '.......TTtuVVVVVVVVVVutTu.......', '.......TTtuVVVVVVVVVVutTu.......',
        '.......TTtuVVVVVVVVVVuttu.......', '.......tTtuvVVVVVVVVvutuu.......', '........TtuuvVVVVVVvuutu........', '........ttuuuvVVVVvuuutu........', '.........ttuuuuvvuuuuuu.........',
        '..........tTtuuuuuuuuu..........', '...........ttuuuuuuuu...........'],
    l: [VIDE, VIDE, VIDE, '............tTTTTTtu............', '..........tTTHTTTTTtuu..........', '.........tTTTTTTTTTTTtuu........', '........tTTTTTTTTTTTTTtuu.......', '.......tTuvvvvTTTTTTTTttu.......',
        '.......TuvVVVVvuTTTTTTttuu......', '.......TuVVVVVVVutTTTTtttu......', '.......TuVVVVVVVutTTTTtttu......', '.......TuVVVVVVVutTTTTtttu......', '.......TuVVVVVVVutTTTttttu......',
        '.......tuVVVVVVVutTTtttuuu......', '.......tuvVVVVVvutTttttuu.......', '........tuvVVVVvuttttuuu........', '.........tuuvVVvuuttuuu.........', '..........ttuuvvuuuuuu..........',
        '...........tTtuuuuuuu...........', '............ttuuuuuu............']
  });
  // coiffe de mailles : un capuchon d'anneaux, taillé sur la capuche
  { const mail = rows => rows.map((r, y) => r.split('').map((m, x) => 'HTtuD'.indexOf(m) >= 0 ? ((x + y) % 2 ? 'I' : 'i') : m).join(''));
    tete('coiffe_mailles', { d: mail(TETES.capuche.d), l: mail(TETES.capuche.l) }); }
  // le chèche et son voile, d'après le sixième modèle : une bande de visage entre le turban et le litham
  { const sombre = ['.........uuuuuuuuuuuuuu.........'], sombreL = ['........uuuuuuuuuuuuuuuu........'];
    tete('litham', {
      d: H_IMAMA.concat(sombre, ['..........tuvVVVVVVvut..........', '..........TuVVVVVVVVut..........', '..........TuvVVVVVVvut..........', '..........TtTTTTuTTTtu..........', '..........TTTTuuTTTttu..........',
        '..........tTTuTTTTtttu..........', '..........tTTTTTtTttuu..........', '..........ttTTtTTtttuu..........', '...........tTTtTtttuu...........', '............tTtttuuu............', '.............ttuuuu.............']),
      l: H_IMAMA_L.concat(sombreL, ['.........vVVVVvuttttuuu.........', '........vVVVVVVutTttuuu.........', '........vVVVVVvutTttuu..........', '........TTTTuTTttTtuuu..........', '........tTTuTTTtuttuuu..........',
        '........tTTTTTtuttuuuu..........', '........ttTTtTtuttuuu...........', '.........tTTtttuutuuu...........', '..........tTttuuttuu............', '............tTttuuuu............', '.............ttuuuu.............']) }); }
  // la tiare : un haut bonnet ceint d'un galon
  { const h = ['...........tTTTTTTTtu...........', '..........tTTHTTTTTTtu..........', '..........TTTTTTTTTTtu..........', '..........TTTTTTTTTttu..........', '..........aAAAAAAAAAAa..........', '..........aaAAAAAAAAaa..........',
      '.........tTTTTTTTTTTTtu.........', '.........uttttttttttuuu.........', '.........uuuuuuuuuuuuuu.........', '..........uuuuuuuuuuuu..........'];
    tete('tiare', { d: h.concat(FACE_D), l: h.concat(FACE_L) }); }
  // l'étoffe de tête des gens du désert : un voile retenu par un cordon, qui retombe sur les épaules (stylisation)
  { const h = [VIDE, '............tTTTTTtu............', '..........tTTHTTTTTTtu..........', '.........tTTTTTTTTTTTtu.........', '.........aAAAAAAAAAAAAa.........', '.........aaAAAAAAAAAAaa.........', '........tTTTtTTTTTTtTTtu........'];
    tete('keffieh', {
      d: h.concat(['........TTtuuuuuuuuuutTu........', '.......tTTuuvVVVVVVvuutTu.......', '.......TTtuuVVVVVVVVuutTu.......', '.......TTtuuVVVVVVVVuutTu.......', '.......TTtuuVVVVVVVVuutTu.......', '.......TTtuuVVVVVVVVuutTu.......',
        '.......TTtuuVVVVVVVVuutTu.......', '.......TTtuuvVVVVVVvuutTu.......', '.......tTTtuuvVVVVvuuttTu.......', '.......tTtTtuuvVVvuutTtuu.......', '.......TTtTTtuuuuuutTtTuu.......', '......tTTtTTttuuuuttTtTtuu......',
        '......TTtTTtuttuuuutuTtTtu......']),
      l: h.concat(['........TTuuuuuTTTTTTttu........', '.........vVVVVvuTTtTTTtu........', '........vVVVVVVuTTTtTTttu.......', '........VVVVVVVuTTtTTTttu.......', '........VVVVVVVuTTTTtTtuu.......', '........VVVVVVVuTtTTTttuu.......',
        '........vVVVVVvuTTTtTTtuu.......', '.........vVVVVvuTTtTTttuu.......', '..........vVVvuuTtTTTtuuu.......', '............tuuTTTtTtuuu........', '............tuTTtTTTtuuu........', '...........tTuTTTtTTtuuu........',
        '...........TtuTtTTTttuu.........']) }); }
  Object.keys(HEADS).forEach(c => { if (!TETES[c]) throw new Error('coiffe sans tête native : ' + c); });

  // familles de tons : les lettres d'une même matière, de la plus claire à la plus sombre
  const FAM = { H: 'Ttu', T: 'Ttu', t: 'Ttu', u: 'Ttu', D: 'Ttu', C: 'Cck', c: 'Cck', k: 'Cck', E: 'Cck', e: 'Cck', B: 'Cck', b: 'Cck', m: 'Cck', R: 'Rr', r: 'Rr', S: 'Ss', s: 'Ss', M: 'Ss',
    L: 'LlZ', l: 'LlZ', Z: 'LlZ', J: 'Ii', I: 'Ii', i: 'Ii', j: 'Ii', W: 'Ww', w: 'Ww', F: 'Ff', f: 'Ff', A: 'Aa', a: 'Aa' };
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
  // la grille de 32 × 48 d'un personnage, ou null si sa tête ou son corps n'ont pas encore de gabarit natif
  function natifGrille(look, dir, frame, pose) {
    const K0 = kindOf(look), key = dir === 0 ? 'd' : dir === 3 ? 'u' : 'l', nom = HEADS[K0.coiffe] ? K0.coiffe : 'imama';
    const tt = TETES[nom] && TETES[nom][key], P = pose && POSES[pose] && POSES[pose][key] ? POSES[pose] : null;
    const A = P ? (ALLURES[pose] && ALLURES[pose][key]) : (CORPS[key] && CORPS[key][frame || 0]);
    if (!tt || !A) return null;
    const r = grid(look, dir, frame, pose, {}), K = r.K, kneel = r.kneel, hy = P ? (P.hy || 0) : 0, haut = A.haut || 0;
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
    if (K.neon) { const x = key === 'd' ? 15 : key === 'l' ? 11 : -1; if (x >= 0) for (let y = cou + 3; y < cou + 10; y++) if (L[y][x] !== '.') L[y][x] = 'Y';
      for (let y = cou + 10; y < cou + 12; y++) for (let x2 = 0; x2 < W2; x2++) if ('Aa'.indexOf(L[y][x2]) >= 0) L[y][x2] = 'y'; }
    // les objets tenus : ceux de grid(), agrandis, ramenés à la hauteur de la main
    const o2 = scale2x(r.objets), dyo = kneel ? 0 : (cou + 13 - (K.petit ? 2 : 0)) - (2 * r.b0 + 10);
    for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) { const m = o2[y][x], Y = y + dyo; if (m !== '.' && Y >= 0 && Y < H2) { L[Y][x] = m; am[Y][x] = 0; fin[Y][x] = 1; } }
    // la tête, inclinée ou abaissée selon la pose ; le cimier suit le sommet du casque
    const y0 = cou - 18 + 2 * hy, x0 = hy && key === 'l' ? -2 : 0, pose1 = (x, y, m) => { if (x < 0 || x >= W2 || y < 0 || y >= H2) hors++; else { L[y][x] = m; am[y][x] = 0; fin[y][x] = 1; } };
    for (let j = 0; j < (kneel ? 20 : tt.length); j++) for (let x = 0; x < W2; x++) if (tt[j][x] !== '.') pose1(x + x0, y0 + j, tt[j][x]); // à genoux, le pan du turban ne descend pas
    if (K.cimier) { const xs = key === 'l' ? [10, 21] : [14, 17]; for (let x = xs[0]; x <= xs[1]; x++) { let y = 0; while (y < tt.length && tt[y][x] === '.') y++; if (y < tt.length) for (let dy = 1; dy <= 2; dy++) pose1(x + x0, y0 + Math.max(dy - 1, y - dy), 'X'); } }
    if (dir === 2) [L, am, fin].forEach(t => t.forEach(row => row.reverse()));
    return { L, K, am, fin, hors };
  }
  function grand(look, dir, frame, pose) {
    if (!G.natif) return ancien(look, dir, frame, pose);
    const k = 'n' + ck(look, dir, frame, pose); if (scache[k]) return scache[k];
    const n = natifGrille(look, dir, frame, pose); if (!n) return (scache[k] = ancien(look, dir, frame, pose));
    const { L, K, am, fin } = n, pal = palette(look, K), R = rampes(pal), w = W2, h = H2;
    const cv = mk(w, h), c = cv.getContext('2d'), px = (x, y, col) => { if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); } };
    const voile = m => m === 'V' || m === 'v', at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? '.' : L[y][x];
    const plein = (x, y) => { const m = at(x, y); return m !== '.' && (voile(m) || pal[m] != null); }, meme = (x, y, f) => { const m = at(x, y); return m !== '.' && FAM[m] === f && !!R[m]; };
    // le voile : une lumière qui se dégrade du centre vers le bord (Compagnons), une étoffe unie sinon — jamais un trait
    let x0 = 99, x1 = -1, y0 = 99, y1 = -1; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (voile(L[y][x])) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 - 0.5, rx = (x1 - x0) / 2 + 0.5, ry = (y1 - y0) / 2 + 0.5;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const m = L[y][x]; if (m === '.') continue;
      if (voile(m)) { const dd = Math.hypot((x - cx) / rx, (y - cy) / ry); px(x, y, K.lit ? (dd < 0.5 ? '#ffffff' : dd < 0.82 ? pal.V : pal.v) : (y - y0 < 2 || dd > 0.86 ? pal.v : pal.V)); continue; }
      const r = R[m]; if (!r) { px(x, y, pal[m]); continue; }                  // main, parchemin, néon, cimier : à plat
      let i = r.i;
      if (am[y][x]) { const a = K.armure, bordG = !am[y][x - 1], bordD = !am[y][x + 1];   // l'armure : mailles fines, lamelles en rangs, cuir cousu, toile piquée
        if (a === 'mailles') i = bordG ? 1 : bordD ? 3 : ((x + y) & 1) ? 2 : 1 + ((x * 3 + y) % 7 === 0 ? -1 : 0);
        else if (a === 'lamelles') i = (y % 3 === 2) ? 3 : (x % 3 === 2 ? 2 : bordG ? 0 : 1);
        else if (a === 'cuir') { if (y % 4 === 3 || (x + (y >> 2) * 2) % 5 === 0) i++; }
        else if ((x + y) % 4 === 0 || (x - y + 48) % 4 === 0) i++; }
      else if (!fin[y][x]) { const f = FAM[m];                               // le modelé du corps : une seule lumière, en haut à gauche
        if (!plein(x, y - 1)) i--; else if (!meme(x, y - 1, f) && !voile(at(x, y - 1))) i++;   // l'arête du haut la reçoit ; sous une autre matière, son ombre
        if (!plein(x - 1, y) && meme(x + 1, y, f)) i--;                       // le bord gauche est éclairé
        if (!plein(x + 1, y) && meme(x - 1, y, f)) i++; }                     // le bord droit est dans l'ombre
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
  const ucache = {}; // image du grand sprite, pour les menus
  G.charURL = (look, dir, pose) => { const k = (G.natif ? 'n' : 'a') + ck(look, dir || 0, 0, pose); return ucache[k] || (ucache[k] = grand(look, dir || 0, 0, pose).toDataURL()); };
  G.KINDS = KINDS; G.COIFFES = Object.keys(HEADS);
  G.natif = true; // false : le grand sprite d'avant, pour comparer
  // la grille de matières d'un grand sprite, pour le contrôle (tools/silhouettes.js) : 48 lignes de 32 lettres
  G.charGrille = (look, dir, frame, pose) => { const r = natifGrille(look, dir || 0, frame || 0, pose); if (r) return { lignes: r.L.map(l => l.join('')), natif: true, hors: r.hors };
    return { lignes: scale2x(grid(look, dir || 0, frame || 0, pose).g).map(l => l.join('')), natif: false, hors: 0 }; };
})();
