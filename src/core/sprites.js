/* ISNAD — personnages : silhouettes dessinées au pixel, à la manière des jeux 16 bits. Personne n'a de visage :
   ni yeux, ni bouche, ni trait. Les Compagnons portent un voile de lumière ; le caractère passe par la
   coiffe, le costume, l'attribut et la pose.
   Un personnage = une tête (11 lignes, selon la coiffe) + un corps (13 lignes, selon le pas ou la pose),
   en gabarits de 16 × 24 dont chaque lettre nomme une matière. Le « grand » sprite (32 × 48, combat et
   livret) est le même dessin agrandi par Scale2x, puis enrichi : dégradé du voile, plis, galon. */
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
  function grid(look, dir, frame, pose) {
    const K = kindOf(look);
    const key = dir === 0 ? 'd' : dir === 3 ? 'u' : 'l';
    const P = pose && POSES[pose] && POSES[pose][key] ? POSES[pose] : null;
    let bodyRows = P ? P[key] : BODIES[key][frame || 0]; const hy = P ? (P.hy || 0) : 0, kneel = !!(P && P.kneel);
    const petit = K.petit && !kneel ? 3 : 0; if (petit) bodyRows = bodyRows.filter((r, j) => j !== 3 && j !== 7 && j !== 8); // enfant : trois lignes de moins
    const extra = P ? (key === 'd' ? P.extraD : key === 'l' ? P.extraL : P.extraU) : null;
    const g = []; for (let y = 0; y < H; y++) g.push(new Array(W).fill('.'));
    const put = (x, y, m) => { if (x >= 0 && x < W && y >= 0 && y < H && m !== '.') g[y][x] = m; };
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
    if (K.chale && !kneel) for (let x = 2; x < 14; x++) { if ('Cck'.indexOf(g[b0][x]) >= 0) g[b0][x] = 'T'; if ('Cck'.indexOf(g[b0 + 1][x]) >= 0) g[b0 + 1][x] = x % 3 ? 'T' : 't'; }
    if (K.drape && !kneel) for (let y = b0; y < b0 + 2; y++) for (let x = 0; x < W; x++) if ((x <= 4 || x >= 11) && 'Cck'.indexOf(g[y][x]) >= 0) g[y][x] = y === b0 ? 't' : 'u'; // l'étoffe de tête retombe sur les épaules
    if (K.raies) for (let y = b0 + 1; y < b0 + 5; y += 2) for (let x = 0; x < W; x++) if ('RrCc'.indexOf(g[y][x]) >= 0) g[y][x] = 'T';
    if (K.neon) { for (let y = b0 + 1; y < b0 + 4; y++) { const x = key === 'd' ? 7 : key === 'l' ? 5 : -1; if (x >= 0 && g[y][x] !== '.') g[y][x] = 'Y'; } for (let x = 0; x < W; x++) if ('Aa'.indexOf(g[b0 + 4][x]) >= 0) g[b0 + 4][x] = 'y'; }
    // tête (11 lignes), inclinée ou abaissée selon la pose
    const head = HEADS[K.coiffe] || HEADS.imama, hrows = head[key] || head.d, h0 = (kneel ? b0 - 11 : petit) + hy, hx = hy && key === 'l' ? -1 : 0;
    for (let j = 0; j < 11; j++) for (let x = 0; x < W; x++) put(x + hx, h0 + j, hrows[j][x]);
    if (K.coiffe === 'imama_queue' && !kneel) { // le pan du turban retombe sur l'épaule (de dos : entre les épaules)
      if (key === 'd') { put(13 + hx, h0 + 11, 't'); put(13 + hx, h0 + 12, 'u'); } else if (key === 'l') { put(13 + hx, h0 + 11, 't'); put(12 + hx, h0 + 12, 'u'); }
      else { put(7, h0 + 11, 'T'); put(8, h0 + 11, 't'); put(7, h0 + 12, 't'); put(8, h0 + 12, 'u'); put(7, h0 + 13, 'u'); } }
    if (K.cimier) { if (key === 'l') for (let x = 4; x < 11; x++) put(x, h0, 'X'); else for (let x = 6; x < 10; x++) { put(x, h0, 'X'); if (key === 'u') put(x, h0 + 1, 'X'); } }
    if (extra) extra.forEach(([x, y, m]) => put(x, y, m));
    if (dir === 2) for (let y = 0; y < H; y++) g[y].reverse();
    return { g, K };
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
  function grand(look, dir, frame, pose) {
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
  G.charURL = (look, dir, pose) => { const k = ck(look, dir || 0, 0, pose); return ucache[k] || (ucache[k] = grand(look, dir || 0, 0, pose).toDataURL()); };
  G.KINDS = KINDS;
})();
