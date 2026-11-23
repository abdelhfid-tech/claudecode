/* ISNAD — définitions partagées (navigateur + validateur node). Source de vérité du schéma de données. */
(function (root) {
  const D = {};

  // Vertus-éléments. « fer » = l'élan physique ; les six autres sont les Lumières.
  D.ELEMENTS = {
    fer:    { name: 'Fer',         ar: 'Hadîd',   color: '#c9ced6', glyph: '⚔' },
    sidq:   { name: 'Véracité',    ar: 'Sidq',    color: '#ffe08a', glyph: '◈' },
    adl:    { name: 'Justice',     ar: "'Adl",    color: '#6fb6ff', glyph: '⚖' },
    sabr:   { name: 'Patience',    ar: 'Sabr',    color: '#7fd69a', glyph: '❖' },
    rahma:  { name: 'Miséricorde', ar: 'Rahma',   color: '#5fe0d0', glyph: '✦' },
    shajaa: { name: 'Courage',     ar: "Shajâ'a", color: '#ff7a5c', glyph: '▲' },
    ilm:    { name: 'Savoir',      ar: "'Ilm",    color: '#c49bff', glyph: '✧' }
  };

  // Archétypes de héros : multiplicateurs de croissance.
  D.ROLES = {
    guerrier: { hp: 1.15, sp: 0.8,  atk: 1.3,  mag: 0.75, def: 1.05, spd: 1.0  },
    gardien:  { hp: 1.35, sp: 0.85, atk: 1.0,  mag: 0.85, def: 1.3,  spd: 0.85 },
    sage:     { hp: 0.95, sp: 1.25, atk: 0.8,  mag: 1.3,  def: 0.9,  spd: 1.0  },
    soigneur: { hp: 0.9,  sp: 1.35, atk: 0.7,  mag: 1.2,  def: 0.85, spd: 1.05 },
    stratege: { hp: 1.0,  sp: 1.0,  atk: 1.1,  mag: 1.0,  def: 0.95, spd: 1.3  }
  };

  D.TIERS = ['minion', 'elite', 'boss'];

  // 2.x — le rayonnement de chaque Compagnon : son voile de lumière prend une couleur qui lui est propre, la même partout où
  // il paraît, pour qu'on le reconnaisse. La couleur ne dit rien de lui : aucune n'est celle d'une bannière, d'un camp ni
  // d'un rang. (Demandé par le décideur le 16 novembre ; couleurs proposées par l'agent, à valider.)
  D.RAYONS = {
    'abu bakr': '#ffcf4a', 'umar': '#4fa3ff', 'uthman': '#2fd9c0', 'ali': '#9a7bff', 'khalid': '#ff7742',
    'abu ubayda': '#5fd883', 'abd ar rahman': '#ffc57a', 'ammar': '#7fdca4', 'al qaqa': '#a6e05a', 'aslam': '#8f9cff', 'dirar': '#ff6f91',
    'hudhayfa': '#f2e35c', 'ibn abbas': '#ffe36e', 'qays': '#40d4ee', 'zayd ibn thabit': '#e08cff',
    'abdallah ibn az zubayr': '#ff8a7a', 'abu ayyub': '#6fd9ff', 'abu hurayra': '#8fe6cf', 'al hasan': '#ffe9a8', 'al hubab': '#cfe36a', 'anas': '#ffa3c4',
    'bashir': '#ffb48f', 'bilal': '#ffa83a', 'said ibn al as': '#b3a6ff', 'suraqa': '#e6c98a', 'usama': '#9fd4ff', 'zayd ibn al khattab': '#7fa8ff'
  };
  // 2.x — qui a un visage. Un Compagnon n'en a jamais : son voile est une lumière (type « compagnon »). Les autres personnages
  // en ont un (décision du décideur, 16 novembre). Restent sans visage ceux que voici, récit par récit, sous le nom exact que
  // le récit leur donne : des Compagnons que les récits dessinent sans voile de lumière, des hommes que certaines sources
  // comptent parmi eux, et ceux que leur nom même range parmi eux (un Ansârî, un vétéran de Badr, un soldat de l'armée
  // d'Usâma, un récitateur de Médine en l'an 12) — dans le doute, pas de visage. Les gens sans autre désignation (« un
  // fidèle », « un Médinois ») ont un visage. (Liste dressée par l'agent ; à valider par le décideur, nom par nom.)
  D.SANS_VISAGE = {
    abubakr: ['vieil ansari', 'soldat dusama', 'un recitateur'],   // les noms sans accents ni apostrophes, comme D.rayon les lit
    ali: ['le juge shurayh', 'malik al ashtar', 'farwa ibn nawfal', 'kumayl ibn ziyad'],
    khalid: ['rafi ibn umayra', 'veteran de badr'],
    uthman: ['abdallah ibn sad']
  };
  const sansAccent = nom => String(nom || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’ʿʾ`]/g, '').replace(/[-‑]/g, ' ').replace(/\s+/g, ' ').trim();
  D.sansVisage = function (nom, recit) { const n = sansAccent(nom); return !!this.rayon(nom) || (this.SANS_VISAGE[recit] || []).indexOf(n) >= 0; };
  // la couleur d'un Compagnon d'après son nom, tel que les récits l'écrivent (« 'Alî », « 'Alî ibn Abî Tâlib ») ; null sinon
  D.rayon = function (nom) {
    const n = sansAccent(nom);
    let best = null; Object.keys(this.RAYONS).forEach(k => { if ((n === k || n.indexOf(k + ' ') === 0) && (!best || k.length > best.length)) best = k; });
    return best ? this.RAYONS[best] : null;
  };

  // 2.x — la progression : ce que le joueur apprend à faire, un outil à la fois (lecons.js). `geste` : un simple geste, qui
  // n'a pas besoin d'avoir resservi pour que l'outil suivant soit donné.
  D.OUTILS = {
    marcher: { nom: 'Se déplacer' }, parler: { nom: 'Parler', geste: true }, aide: { nom: 'Demander son chemin', geste: true },
    frapper: { nom: 'Frapper la faille' }, vertus: { nom: 'Les vertus' }, garde: { nom: 'Se protéger : la garde, l’esquive, la fuite et la Niyya' }, objets: { nom: 'La besace' },
    halte: { nom: 'La halte', geste: true }, source: { nom: 'Retrouver une source' }, equipement: { nom: 'S’équiper' }, etoiles: { nom: 'S’orienter aux étoiles', geste: true },
    frappe: { nom: 'Frapper ce qui rôde' }, postures: { nom: 'Prendre une figure' },
    // 2.23 (D212) : les quartiers de la Cité, où l'on remonte à tout moment — un simple geste, dit par Maître Yûnus à la première arrivée
    cite: { nom: 'Revenir dans la Cité', geste: true },
    // 2.27 (D216) : derrière Sâlim, sur sa moto, au premier passage au circuit ; il resert à la première course (circuit.js)
    virages: { nom: 'Prendre les virages' },
    // 2.28 (D217) : les activités des quartiers (activites.js), chacune dite au premier essai ; l'écran géant et les manèges
    // sont de simples gestes. Payer ne s'apprend pas : le prix se dit dans le menu.
    borne: { nom: 'Jouer à la borne' }, etal: { nom: 'L’étal de la galerie' },
    ecran: { nom: 'S’asseoir devant l’écran', geste: true }, manege: { nom: 'Monter dans un manège', geste: true },
    // 2.29 (D220) : par la porte d'une ville, la route et les autres villes (monde.js) — un simple geste, dit à la première sortie
    route: { nom: 'La route', geste: true }
  };

  /* 2.23 (D212) — les quartiers de la Cité-Miroir. Demande du décideur, 21 novembre : « il y trouve beaucoup d'activités mais
     tout le monde est triste et seul, personne ne voit les idées noires modernes : égoïsme, matérialisme, plaisir immédiat ».
     Ces « idées noires modernes » sont des chimères que l'on combat (frame.js : egoisme, materialisme, plaisir, indifference) ;
     les cinq idées noires de D.NOIRS restent des voix qu'on apaise par la parole, et n'y rôdent jamais (regles.js le vérifie).
     `rodent` : ce que pèse chacune parmi ce qui rôde dans les rues (rodeurs.js) ; `nombre` : combien rôdent à chaque arrivée ;
     `vue` : à combien de cases elles prennent en chasse ; `pas` : leur allure, en part de la marche ; `loin` : à combien de cases
     du parvis elles se posent. Le trafic (trafic.js) : `voitures`, sur la boucle des avenues ; `course`, sur le circuit ; `vitesse`
     et `circuit`, en points par seconde ; `arret`, la distance (en points) à laquelle une voiture s'arrête devant quelqu'un.
     Nombres proposés par l'agent, à valider. */
  D.CITE = { rodent: { egoisme: 1, materialisme: 1, plaisir: 1, indifference: 1, pari: 1 }, nombre: 3, vue: 6, pas: 0.45, loin: 12,
    voitures: 6, course: 3, vitesse: 58, circuit: 120, arret: 20,
    // 2.27 (D216) : une chimère qui rôde ailleurs que dans les rues — « Le Pari », parmi les parieurs de la tribune (rodeurs.js :
    // elle y est posée à chaque arrivée, et n'en sort pas)
    zones: { pari: ['qgradin'] } };

  /* 2.27 (D216) — « Sâlim et la course ». Demandes du décideur, 21 novembre : « des courses de voitures » ; « Les activités de
     la cité miroir sont omniprésents des le début et peuvent faire l'objet de jeux légers quelque soit l'avancement dans la
     saga » ; « Les courses de voitures sont de plus en plus difficiles avec des circuits » ; « Un ami vient en moto et demande à
     Idriss de monter derrière lui pour sa première course ». Aucun nombre dans un récit : tout est ici (circuit.js les lit).
     Un tracé est un polygone fermé, en points d'une toile de 1100 × 740 : chaque sommet [x, y, r] est un virage, arrondi au
     rayon r (un congé entre les deux droites) ; on court dans l'ordre des sommets. `large` : la demi-largeur de la chaussée ;
     `tours` ; `temps` : le temps à battre, en secondes (0 : aucun) ; `depart` : l'arête au milieu de laquelle se tire la ligne
     de départ ; `nuit` ; `viaduc` : l'arête qui passe en hauteur, de `de` à `a` (parts de sa droite) ; `prime` : ce que verse
     l'organisateur au premier ; `adversaires` : la part de la vitesse de pointe (`vitesse`) et de l'adhérence (`adresse`) que
     chacun prend, et son avance sur la grille (`avance`, en points). Un circuit est gagné à la première place — et, s'il a un
     temps à battre, sous ce temps ; il s'ouvre quand le précédent est gagné ; un circuit gagné se rejoue.
     D.COURSE : la voiture (pointe, accélération, lâcher, frottement, freinage, braquage, adhérence, hors de la chaussée, barrière, rebond), la moto de
     Sâlim et son tracé, la part de la prime aux deuxième et troisième places, le plafond des primes par visite.
     Aucune mise, nulle part : on ne paie pas pour courir, on ne gagne que la prime de l'organisateur (regles.js le vérifie).
     Nombres proposés par l'agent, réglés par des courses jouées par le jeu lui-même (le circuit 1 se gagne au premier essai,
     le 5 demande de l'adresse), à valider. */
  D.CIRCUITS = [
    { id: 'avenues', trace: [[140, 140, 90], [960, 140, 90], [960, 580, 90], [140, 580, 90]], large: 38, tours: 2, temps: 52, depart: 3, prime: 6,
      adversaires: [] },
    { id: 'places', trace: [[140, 140, 60], [620, 140, 60], [620, 330, 50], [960, 330, 60], [960, 600, 60], [420, 600, 60], [420, 450, 50], [140, 450, 60]], large: 32, tours: 3, temps: 0, depart: 7, prime: 10,
      adversaires: [{ vitesse: 0.8, adresse: 0.7, avance: 60 }, { vitesse: 0.83, adresse: 0.72, avance: 36 }, { vitesse: 0.86, adresse: 0.7, avance: 12 }] },
    { id: 'chicane', trace: [[140, 140, 42], [500, 140, 22], [540, 200, 22], [620, 200, 22], [660, 140, 22], [980, 140, 40], [980, 600, 40], [700, 600, 35], [700, 440, 35], [480, 440, 35], [480, 600, 35], [140, 600, 42]], large: 27, tours: 3, temps: 0, depart: 11, prime: 15,
      adversaires: [{ vitesse: 0.88, adresse: 0.82, avance: 60 }, { vitesse: 0.9, adresse: 0.84, avance: 36 }, { vitesse: 0.92, adresse: 0.85, avance: 12 }] },
    { id: 'viaduc', trace: [[300, 140, 60], [120, 260, 60], [120, 460, 60], [300, 580, 60], [760, 140, 60], [940, 260, 60], [940, 460, 60], [760, 580, 60]], large: 26, tours: 3, temps: 57, depart: 5, prime: 22,
      viaduc: { arete: 7, de: 0.28, a: 0.72 }, adversaires: [{ vitesse: 0.91, adresse: 0.86, avance: 140 }] },
    { id: 'tours', trace: [[140, 120, 34], [560, 120, 30], [560, 260, 26], [720, 260, 26], [720, 120, 30], [980, 120, 34], [980, 360, 30], [820, 360, 26], [820, 500, 28], [980, 500, 32],
      [980, 620, 32], [560, 620, 30], [560, 460, 28], [380, 460, 28], [380, 620, 30], [140, 620, 34], [140, 400, 30], [260, 400, 28], [260, 260, 28], [140, 260, 30]], large: 22, tours: 2, temps: 0, depart: 0, prime: 30, nuit: true,
      adversaires: [{ vitesse: 0.93, adresse: 0.88, avance: 60 }, { vitesse: 0.94, adresse: 0.89, avance: 36 }, { vitesse: 0.95, adresse: 0.9, avance: 12 }] }
  ];
  D.COURSE = {
    // `frotte` : ce que perd une voiture qu'on fait tourner plus vite que son adhérence ne le permet ; `frein` : le freinage des
    // adversaires (le joueur n'a que le lâcher et le frottement)
    voiture: { vmax: 150, accel: 85, lache: 90, frotte: 120, frein: 220, braquage: 3.4, adherence: 300, horsPiste: 0.5, barriere: 6, rebond: 0.6 },
    // la moto de Sâlim : il pilote ; Idris se penche. Bien penché (le joystick, ou les flèches, vers l'intérieur du virage, à
    // `angle` degrés près), elle garde sa vitesse de virage ; mal penché, elle ralentit (`mal`), sans chute ni blessure.
    // `annonce` : à combien de points avant un virage le signe paraît ; `bien` : la part du virage qu'il faut tenir penché.
    moto: { trace: [[160, 160, 60], [600, 160, 55], [600, 330, 50], [880, 330, 60], [880, 580, 60], [460, 580, 55], [460, 440, 45], [160, 440, 60]], large: 30, depart: 7,
      vmax: 118, adherence: 230, accel: 70, frein: 150, mal: 0.6, angle: 65, annonce: 46, bien: 0.5 },
    podium: [1, 0.4, 0.2], plafond: 60
  };

  /* 2.28 (D217) — les activités des quartiers (activites.js). Demandes du décideur, 21 et 22 novembre : « des jeux en tous
     genres, des activités » ; « Les activités de la cité miroir sont omniprésents des le début et peuvent faire l'objet de jeux
     légers quelque soit l'avancement dans la saga » ; « il faut qu'idriss puisse "faire les activités" en les payant dans les
     quartiers : manèges etc ». Aucun nombre dans un récit : tout est ici.
     D.ACTIVITES : ce qui se fait dans les quartiers — l'outil qu'on y apprend (D.OUTILS), le lieu (b.spot de la carte), le prix
     d'une partie ou d'un tour (en dirhams, ceux des primes de l'organisateur des courses ; absent : c'est libre), la durée d'un
     tour (en secondes). Une activité qu'on paie ne rapporte rien — ni dirhams, ni lot, ni objet : la borne ne donne que son
     score — et aucun hasard ne décide de rien (regles.js : les champs déclarés, et rien d'autre ; un prix entier, positif).
     On ne paie jamais pour courir : la course n'y est pas. L'étal de la galerie vend des pièces ordinaires (D.GEAR_SHOPS,
     D.GEAR_PRIX), payées de la même bourse.
     D.BORNE : le jeu de la borne, « Les lueurs » — un jeu d'adresse inventé par le jeu. Une arène de `arene` unités ; la durée
     d'une partie ; la vitesse de la lueur d'Idris (unités par seconde), son élan (A : `elan` fois plus vite pendant
     `elanDuree`, puis `elanRepos` de repos) ; le rayon où l'on rassemble une lueur (`prise`), celui d'une ombre (`ombre`) et le
     temps où l'on ne craint rien après l'avoir touchée (`choc`) ; l'intervalle entre deux lueurs (`cadence`, du début à la
     fin) et entre deux ombres (`cadenceOmbres`) ; la vitesse de ce qui passe (`lentes`, `vives` : du début à la fin) ; une
     lueur de plus au score toutes les `palier` lueurs rassemblées sans toucher d'ombre (cinq au plus par lueur). Le tirage est le même à chaque
     partie (une graine fixe) : seule l'adresse fait le score.
     Nombres proposés par l'agent : une course gagnée (le premier circuit, 6 dirhams) paie trois tours ; à valider. */
  D.ACTIVITES = {
    borne:   { outil: 'borne', lieu: 'jeux', prix: 2 },
    roue:    { outil: 'manege', lieu: 'roue', prix: 3, duree: 18 },
    chaises: { outil: 'manege', lieu: 'parc', prix: 2, duree: 11 },
    tasses:  { outil: 'manege', lieu: 'parc', prix: 2, duree: 10 },
    ecran:   { outil: 'ecran', lieu: 'ecran' },
    etal:    { outil: 'etal', lieu: 'galerie' }
  };
  D.BORNE = { arene: [300, 200], duree: 45, vitesse: 115, elan: 2.4, elanDuree: 0.24, elanRepos: 0.9, prise: 10, ombre: 11, choc: 0.9,
    cadence: [0.9, 0.5], cadenceOmbres: [3.2, 1.5], lentes: [34, 52], vives: [60, 95], palier: 5 };

  // 2.19 — les parades du combat (demande du décideur, 20 novembre : « Rajoute une parade "esquive" » ; « Rajoute aussi une
  // parade "fuire" pour quitter le combat même si on sera poursuivi il faudra courir pour échapper au monstre »). Nombres
  // proposés par l'agent, à valider par le décideur ; un fichier de saga n'en fixe aucun, et une chimère n'esquive jamais.
  // L'esquive : jusqu'à son prochain tour, un coup d'une chimère porté sur lui seul passe à côté une fois sur deux, un coup
  // porté sur tout le groupe une fois sur quatre (ni dégâts, ni effets de ce coup-là pour lui).
  D.ESQUIVE = { seul: 0.5, groupe: 0.25 };
  // La fuite, d'un combat de rencontre seulement (une chimère qui erre sur la carte, ou qui rôde sur les ponts) : un temps de
  // grâce (`grace`, en secondes) où rien ne touche le groupe ; la chimère se reprend (`reprise`), puis poursuit celui qui mène
  // à `vitesse` points par seconde — entre la marche (82) et la course (100,45) : à pied, elle rattrape, toujours ; en courant,
  // on la distance. Elle renonce quand celui qui mène a couru `souffle` secondes sans être rejoint, quand il est à `lache`
  // cases, ou hors d'atteinte `hors` secondes durant (dans une salle où elle n'entre pas, dans un abri).
  D.FUITE = { grace: 1.5, reprise: 0.6, vitesse: 92, lache: 8, souffle: 2.5, hors: 2 };

  // 2.x — les postures : trois manières de se tenir devant l'épreuve. Des pourcentages, rien d'autre ; aucune n'est au-dessus
  // d'une autre. Le tempérament vient du rôle ; les deux autres postures s'ouvrent aux niveaux de D.POSTURE_NIVEAUX.
  // (Demandé par le décideur le 16 novembre ; noms, effets et attribution proposés par l'agent, à valider.)
  D.POSTURE_IDS = ['heros', 'sage', 'saint'];
  D.POSTURES = {
    heros: { nom: 'Le héros', court: 'en héros', atk: 0.10, niyya: 1, menace: 0.5 },   // il s'expose : plus de force, l'élan d'emblée, et les coups viennent à lui
    sage:  { nom: 'Le sage', court: 'en sage', mag: 0.10, faille: 1 },                 // il discerne : plus d'esprit, une faille de chaque égrégore connue d'emblée
    saint: { nom: 'Le saint', court: 'en saint', soin: 0.15, sakina: 20 }              // il s'efface : il soigne mieux et garde le calme
  };
  D.TEMPERAMENTS = { guerrier: 'heros', gardien: 'heros', stratege: 'sage', sage: 'sage', soigneur: 'saint' };
  D.POSTURE_NIVEAUX = [1, 4, 7];

  // 2.x — frapper ce qui rôde dans un labyrinthe : le geste de « Frapper », fait sur les ponts, avec l'arme que porte celui
  // qui mène. Par type d'arme : portee et large (en points, devant soi), cadence (secondes entre deux coups), sonne (secondes
  // pendant lesquelles ce qui est frappé reste sonné), recul (cases), force (voiles ôtés). Rien d'autre que du matériel :
  // l'allonge, le poids, la vitesse d'une arme (exigence 17). « nu » : sans arme en main.
  D.FRAPPES = {
    epee:   { portee: 28, large: 20, cadence: 0.45, sonne: 1.6, recul: 1, force: 1 },
    lance:  { portee: 42, large: 14, cadence: 0.60, sonne: 1.4, recul: 2, force: 1 },
    arc:    { portee: 104, large: 12, cadence: 0.90, sonne: 1.2, recul: 0, force: 1, trait: true },
    dague:  { portee: 22, large: 16, cadence: 0.30, sonne: 1.0, recul: 0, force: 1 },
    masse:  { portee: 26, large: 20, cadence: 0.80, sonne: 2.6, recul: 2, force: 2 },
    baton:  { portee: 32, large: 20, cadence: 0.50, sonne: 1.8, recul: 1, force: 1 },
    calame: { portee: 24, large: 16, cadence: 0.50, sonne: 1.4, recul: 1, force: 1 },
    nu:     { portee: 20, large: 16, cadence: 0.50, sonne: 1.0, recul: 1, force: 1 }
  };

  // Formes procédurales des égrégores (aucun être animé figuratif : formes abstraites).
  D.ART = ['wisp', 'mask', 'eagle', 'crown', 'throne', 'tower', 'lens', 'mirror', 'swarm',
           'idol', 'scale', 'blade', 'wave', 'banner', 'colossus'];

  D.ANIMS = ['slash', 'light', 'burst', 'wave', 'pillar', 'glyph', 'heal', 'guard', 'dark'];

  D.TARGETS = ['foe', 'foes', 'ally', 'allies', 'self'];

  // Effets (fx.st). 2.20 : « recul », « baisse » et « perdu », les trois effets du temps volé (D.TEMPS), réservés aux chimères.
  D.FX = ['atk', 'mag', 'def', 'spd', 'stun', 'doute', 'waswas', 'regen', 'garde', 'reveal',
          'cleanse', 'dispel', 'veil', 'niyya', 'sakina', 'taunt', 'recul', 'baisse', 'perdu'];
  // 2.20 — les attaques qui volent le temps et l'attention (proposition validée par le décideur le 20 novembre, D210) : elles
  // prennent du temps plutôt que de la Constance. Un fichier de récit écrit l'effet ({ st: 'recul' }), jamais son nombre :
  // les nombres sont ici. « recul » : le prochain tour de la cible arrive plus tard, de `recul` d'une attente pleine (0,3 :
  // 30 %) · « baisse » : la cible perd `niyya` point de Niyya ; sans Niyya (ou tant qu'elle ne la voit pas encore,
  // lecons.js), `serenite` points de Sérénité · « perdu » : l'étourdissement (« Étourdi », le tour perdu), une chance sur
  // quatre. La Garde les reçoit comme un coup, à moitié (`garde`) : le recul est de moitié, et la Niyya qui baisse ou le tour
  // perdu n'ont qu'une chance sur deux de porter ; une attaque esquivée (D.ESQUIVE) n'a aucun effet. `rodent` : ce que pèsent,
  // parmi ce qui rôde sur les ponts du labyrinthe d'un récit des Compagnons (rodeurs.js), les chimères communes de la ghafla
  // (coeur.js), à côté des petites chimères du récit (1 chacune). Nombres proposés par l'agent, à valider.
  D.TEMPS = { recul: 0.3, niyya: 1, serenite: 10, perdu: 0.25, garde: 0.5, rodent: { sawfa: 1, lahw: 1, long_espoir: 0.35 } };
  D.FX_TEMPS = ['recul', 'baisse', 'perdu'];

  D.NPC_KINDS = ['homme', 'ancien', 'soldat', 'romain', 'perse', 'moine', 'enfant', 'compagnon', 'marin', 'cyber', 'savant', 'marchand', 'berbere', 'bedouin', 'citadin', 'femme'];
  // 2.26 (D215 ; le décideur, 21 novembre : « Attention s'il y a des femmes (spectatrice etc) elles doivent ressembler à des
  // femmes (pudiques) » ; « Visage découvert ») — femme : toute femme de fiction. Le moteur lui pose sa tenue (sprites.js :
  // le khimâr, la robe longue et ample sans ceinture, le visage découvert, jamais de barbe) ; un récit n'écrit que le type
  // et les couleurs (et, s'il le veut, le manteau) : ni coiffe, ni robe courte, ni motif, armure, cuirasse, écharpe ou châle
  D.TENUE_FEMME = ['coiffe', 'court', 'motif', 'armure', 'cuirasse', 'echarpe', 'chale'];
  // 2.x (D193) — les gens de 2084 : le râwî (cyber : lui seul porte la bande et la ceinture de néon, sa marque) et les autres
  // habitants de la Cité-Miroir (citadin : la même ville, sans la marque). Ni casque ni tunique de départ, et la silhouette garde
  // sa coiffe au combat (gear.js) ; le meneur a la lueur de 2084 (world.js)
  D.DE_2084 = ['cyber', 'citadin'];

  D.BATTLE_BG = ['noos', 'desert', 'ville', 'camp', 'romaine', 'palais', 'mer', 'cite'];

  D.TIMES = ['day', 'dusk', 'night', 'dawn'];

  D.SFX = ['duff', 'tek', 'roll', 'hit', 'break', 'light', 'door', 'glitch', 'blip'];

  // Cartes. Dix gabarits, que maps.js sait bâtir, et les lieux bâtis dessus. Un gabarit fixe les lieux nommés (spots), le
  // thème de l'interface, sa piste, et dit si l'on y bâtit (dehors). Un lieu porte un nom et, s'il le faut, une variante,
  // sa propre piste et ses propres noms de lieux. Un paquet déclare ses lieux de la même façon (D.paquet, plus bas).
  const VILLE = ['mosquee_cour', 'mosquee_porte', 'place', 'souk', 'halle', 'maison', 'puits',
                 'palmeraie', 'porte_nord', 'porte_sud', 'enclos', 'colline', 'priere', 'ecole', 'comptoir'];
  D.GABARITS = {
    // variante « fleuve » : la ville est retournée, un fleuve la borde, la cour de la mosquée est carrelée
    ville:     { nom: 'Ville d’Arabie',  theme: 'orient', dehors: true,  piste: 'medine',    variantes: ['fleuve'], spots: VILLE },
    desert:    { nom: 'Désert',          theme: 'orient', dehors: true,  piste: 'desert',    spots: ['depart', 'dunes', 'rochers', 'oasis', 'source', 'caravane', 'crete', 'ruines', 'arrivee', 'priere', 'comptoir'] },
    camp:      { nom: 'Camp',            theme: 'orient', dehors: true,  piste: 'camp',      spots: ['entree', 'tente_chef', 'feu', 'etendard', 'lignes', 'enclos', 'tertre', 'tentes', 'priere', 'comptoir'] },
    romaine:   { nom: 'Cité romaine',    theme: 'roman',  dehors: false, piste: 'rome',      spots: ['porte', 'cardo', 'forum', 'basilique', 'esplanade', 'palais', 'fontaine', 'remparts', 'jardin', 'marche', 'priere', 'quartier', 'comptoir'] },
    palais:    { nom: 'Palais',          theme: 'roman',  dehors: false, piste: 'palais',    spots: ['entree', 'nef', 'trone', 'tresor', 'colonnade', 'jardin', 'priere'] },
    navire:    { nom: 'Navire',          theme: 'orient', dehors: false, piste: 'mer',       spots: ['poupe', 'pont', 'mat', 'proue', 'passerelle', 'pont2', 'priere'] },
    noos:      { nom: 'Noosphère',       theme: 'cyber',  dehors: false, piste: 'noos',      spots: ['seuil', 'noeud1', 'noeud2', 'noeud3', 'faille', 'miroir', 'coeur'] },
    citadelle: { nom: 'Citadelle',       theme: 'orient', dehors: true,  piste: 'citadelle', spots: ['porte', 'cour', 'puits', 'remparts', 'tour', 'salle', 'mosquee', 'priere', 'ecole', 'souk', 'jardin', 'greniers', 'palmeraie', 'poterne', 'comptoir'] },
    // 2.28 (D218) : « traverse », au bout de la rue (à l'est), d'où l'on passe à pied dans les quartiers (passages.js)
    cite:      { nom: 'Cité-Miroir',     theme: 'cyber',  dehors: false, piste: 'cite',      spots: ['rue', 'ecran', 'ruelle', 'ascenseur', 'parvis', 'traverse'] },
    // 2.23 (D212) — les quartiers de la Cité-Miroir : la même ville de verre, ses voitures, ses activités, et ceux qui s'y
    // promènent seuls ; le refuge d'Idris en 2084 (frame.js, visite « quartiers »), à côté de Maître Yûnus. 2.28 (D218) :
    // « traverse », l'entrée de la rue, au nord-ouest, par où l'on arrive à pied de la Cité-Miroir et par où l'on y retourne
    quartiers: { nom: 'Quartiers de la Cité', theme: 'cyber', dehors: false, piste: 'cite',   spots: ['parvis', 'priere', 'galerie', 'jeux', 'ecran', 'circuit', 'tribune', 'parc', 'roue', 'traverse'] },
    archives:  { nom: 'Archives basses', theme: 'cyber',  dehors: false, piste: 'chaine',    spots: ['entree', 'rayonnages', 'bureau', 'chaine', 'priere'] },
    // 2.29 (D220) — la carte du monde : les villes de D.MONDE, chacune un lieu nommé (son identifiant) ; réservée au jeu (un
    // paquet n'y bâtit pas de lieu)
    monde:     { nom: 'Carte du monde',  theme: 'orient', dehors: false, piste: 'desert',    reserve: true, spots: ['medine', 'mecque', 'taif', 'quds', 'damas', 'homs', 'qinnasrin', 'yarmouk', 'hira', 'bassora', 'koufa', 'fustat'] }
  };
  // 2.29 (D220) : deux variantes de plus pour la ville d'Arabie — « mecque » (la visite sobre de La Mecque : ni mosquée, ni
  // Haram, ni Kaaba ; le cœur de la ville fait de maisons et d'un souk, la natte dans une cour) et « nil » (Fustât : le fleuve
  // à l'ouest, la ville n'est pas retournée)
  D.GABARITS.ville.variantes = ['fleuve', 'mecque', 'nil'];
  // un lieu : son nom, son gabarit, les lieux nommés de ce gabarit, et ce qui lui est propre (variante, piste, noms)
  D.lieu = function (label, gabarit, propre) { const L = { label, gabarit, spots: D.GABARITS[gabarit].spots }; Object.keys(propre || {}).forEach(k => { if (propre[k] !== undefined) L[k] = propre[k]; }); return L; };
  // (lit les tables de l'objet sur lequel on l'appelle : D dans le jeu, une copie pendant le contrôle d'un paquet)
  D.gabarit = function (id) { const L = this.MAPS[id]; return (L && this.GABARITS[L.gabarit]) || null; };
  D.MAPS = {
    medine:    D.lieu('Médine', 'ville'),
    koufa:     D.lieu('Koufa', 'ville', { variante: 'fleuve' }),
    desert:    D.lieu('Désert', 'desert'),
    camp:      D.lieu('Camp', 'camp'),
    romaine:   D.lieu('Cité romaine', 'romaine'),
    palais:    D.lieu('Palais', 'palais'),
    navire:    D.lieu('Navire', 'navire'),
    noos:      D.lieu('Noosphère', 'noos'),
    citadelle: D.lieu('La Citadelle', 'citadelle'),
    cite:      D.lieu('Cité-Miroir', 'cite'),
    quartiers: D.lieu('Les quartiers de la Cité', 'quartiers'),
    archives:  D.lieu('Archives basses', 'archives'),
    // 2.29 (D220) — la carte du monde, et les villes où l'on passe sans qu'un récit s'y joue (les visites). Médine et Koufa s'y
    // visitent sous la graine de leurs récits (la même ville, case pour case), mais sous un autre identifiant : aucun
    // personnage, aucun objectif d'un chapitre ne s'y trouve. `visite` : une ville de passage — on n'y bâtit pas (build.js), on
    // y prie et l'on s'y repose sans que les œuvres se comptent (oeuvres.js, O.sobre).
    monde:             D.lieu('Les routes', 'monde'),
    visite_medine:     D.lieu('Médine', 'ville', { graine: 'medine', visite: true }),
    visite_koufa:      D.lieu('Koufa', 'ville', { variante: 'fleuve', graine: 'koufa', visite: true }),
    visite_mecque:     D.lieu('La Mecque', 'ville', { variante: 'mecque', visite: true, spots: VILLE.filter(s => !/^mosquee|^ecole$/.test(s)) }),   // ni mosquée, ni école de mosquée
    visite_taif:       D.lieu('Tâ’if', 'ville', { visite: true }),
    visite_bassora:    D.lieu('Bassora', 'ville', { variante: 'fleuve', visite: true }),
    visite_fustat:     D.lieu('Fustât', 'ville', { variante: 'nil', visite: true }),
    visite_quds:       D.lieu('Jérusalem', 'romaine', { visite: true }),
    visite_damas:      D.lieu('Damas', 'romaine', { visite: true }),
    visite_homs:       D.lieu('Homs', 'romaine', { visite: true }),
    visite_qinnasrin:  D.lieu('Qinnasrîn', 'romaine', { visite: true }),
    visite_hira:       D.lieu('Al-Hîra', 'camp', { visite: true })
  };

  /* 2.29 (D220) — la carte du monde. Demande du décideur, 23 novembre : « un "meta-monde" […] ou on accéderait aux autres villes
     via le désert avec une carte réaliste qui rend accès aux villes prévue dans la saga et les autres saga même s'il ne s'y
     passe rien […] Comme dans final fantasy ou chrono trigger une carte global ou les points d'intérêt sont accessibles en
     sortant de chaque ville par sa porte. » Ses choix : les villes des sagas, La Mecque et Tâ'if, Jérusalem, Bassora et Fustât ;
     La Mecque, une visite sobre (des rues, un marché ; le Haram et la Kaaba jamais dessinés ; ni combat ni chimère) ; une ville
     n'apparaît qu'à partir de l'époque où elle existe. Tout est ici, en latitude et longitude : la carte (maps.js, monde) le
     projette ; monde.js ouvre les portes. Aucun nombre dans un récit.
     - projection : de `lon` à `lon` (est), de `lat` à `lat` (nord), équirectangulaire, corrigée au parallèle `parallele` ;
       `cases` : la taille de la carte (une case pour une vingtaine de kilomètres).
     - villes : latitude, longitude (relevées sur une page de référence : v2/docs/architecture.md, « La carte du monde ») ;
       `fondee` : l'année (hégire) depuis laquelle elle existe (null : toujours) ; `genre` : « ville » (on y entre) ou « lieu »
       (un repère, où l'on ne revient que depuis son récit) ; `icone` : « arabe » (murs de terre, palmiers), « sham » (pierre,
       tours) ou « camp » (tentes) ; `carte` : la carte de la visite (D.MAPS ; null pour un lieu) ; `rive` : la ville bâtie au bord
       d'un fleuve est sur sa rive ouest (-1 : Koufa, al-Hîra, Bassora) ou est (1 : Fustât) — sur la carte, elle se pose d'une case
       de ce côté, pour que le fleuve passe à côté d'elle (à une case de son point, toujours).
     - terres, fleuves, lacs : les côtes, le Nil (et les deux bras du delta), l'Euphrate, le Tigre, le Chatt al-Arab, le Jourdain,
       la mer Morte et le lac de Tibériade, d'après Natural Earth (1:50 000 000, domaine public), simplifiés à moins d'une case ;
       les côtes d'aujourd'hui (le fond du golfe était plus au nord au VIIᵉ siècle : à valider).
     - reliefs (des crêtes, `large` : leur demi-largeur en cases), deserts (des polygones de dunes, des rubans de `large` cases, ou
       une `zone` où les dunes ne prennent qu'une `part` des cases), steppes,
       vertes (polygones), oasis ([lat, lon, rayon en degrés]) et routes (des étapes : une ville, ou [lat, lon]) : un tracé
       schématique de l'agent, d'après les cartes de relief et les routes connues (la route de Badr, de Tabûk, la Via Maris, la
       route de l'Irak). Une route franchit un fleuve sur un pont, une crête par un col.
     - depuis : par chapitre d'un récit, l'année où il se joue (`an` : sa première, celle qui décide des villes qui existent), son
       époque telle que le carton d'une visite la dit (`epoque`), et ses portes — la carte qui en a une (`carte`), à partir de
       quel objectif (`des` : la porte vaut jusqu'à la suivante de la même carte), et la ville qu'elle est (`ville`). Rien
       d'autre n'a de porte : ni la Samâwa ni la route d'Îliyâ', qui sont déjà la route, ni la mer, ni la noosphère, ni Dhû
       l-Qassa, Harûrâ' et Nahrawân ; ni l'histoire-cadre, ni les veillées, ni le dernier maillon (regles.js le vérifie).
     - gabarits : ceux dont une carte peut avoir une porte (au nord et au sud de la ville d'Arabie, au sud de la cité romaine, à
       l'ouest du camp). */
  D.MONDE = {
    lon: [30, 49], lat: [20, 37], parallele: 28.5, cases: [96, 96],
    villes: {
      medine:    { lat: 24.47, lon: 39.61, fondee: null, genre: 'ville', icone: 'arabe', carte: 'visite_medine' },
      mecque:    { lat: 21.42, lon: 39.82, fondee: null, genre: 'ville', icone: 'arabe', carte: 'visite_mecque' },
      taif:      { lat: 21.28, lon: 40.41, fondee: null, genre: 'ville', icone: 'arabe', carte: 'visite_taif' },
      quds:      { lat: 31.78, lon: 35.23, fondee: null, genre: 'ville', icone: 'sham', carte: 'visite_quds' },
      damas:     { lat: 33.51, lon: 36.31, fondee: null, genre: 'ville', icone: 'sham', carte: 'visite_damas' },
      homs:      { lat: 34.73, lon: 36.71, fondee: null, genre: 'ville', icone: 'sham', carte: 'visite_homs' },
      qinnasrin: { lat: 35.99, lon: 37.04, fondee: null, genre: 'ville', icone: 'sham', carte: 'visite_qinnasrin' },
      yarmouk:   { lat: 32.81, lon: 35.95, fondee: null, genre: 'lieu', icone: 'camp', carte: null },
      hira:      { lat: 31.98, lon: 44.39, fondee: null, genre: 'ville', icone: 'camp', carte: 'visite_hira', rive: -1 },
      bassora:   { lat: 30.52, lon: 47.81, fondee: 14, genre: 'ville', icone: 'arabe', carte: 'visite_bassora', rive: -1 },
      koufa:     { lat: 32.03, lon: 44.40, fondee: 17, genre: 'ville', icone: 'arabe', carte: 'visite_koufa', rive: -1 },
      fustat:    { lat: 30.01, lon: 31.24, fondee: 21, genre: 'ville', icone: 'arabe', carte: 'visite_fustat', rive: 1 }
    },
    terres: [
      [[35.59, 34.46], [35.29, 33.94], [35.2, 33.91], [34.99, 34.05], [34.97, 33.7], [34.75, 33.41], [34.67, 33.06], [34.57, 33.01], [34.73, 32.45], [34.95, 32.32], [35.08, 32.3], [35.18, 32.88], [35.39, 32.94], [35.35, 33.61], [35.66, 34.56]],
      [[25.38, 36.9], [25.6, 36.53], [25.69, 36.53], [25.41, 36.95]],
      [[29.62, 48.28], [29.61, 48.18], [29.8, 48.08], [29.98, 48.18], [29.78, 48.35]],
      [[37.6, 49.6], [30.05, 49.6], [30.31, 49.05], [30.37, 49], [30.41, 49.25], [30.51, 49], [30.45, 49.04], [30.33, 48.89], [30.12, 48.92], [30.04, 48.83], [29.94, 48.45], [30.04, 48.14], [30.01, 47.98], [29.57, 48.14], [29.62, 47.97], [29.39, 47.72], [29.36, 48.05], [28.98, 48.18], [27.9, 48.81], [27.72, 48.8], [27.49, 49.24], [27.44, 49.18], [27.31, 49.28], [27.08, 49.6], [19.4, 49.6], [19.4, 40.96], [19.76, 40.76], [20.27, 40.08], [20.39, 39.73], [20.97, 39.28], [21.31, 39.09], [21.52, 39.15], [21.88, 38.99], [22.39, 39.1], [22.59, 39.06], [23.71, 38.46], [24.19, 37.92], [24.29, 37.54], [24.82, 37.18], [24.96, 37.27], [25.29, 37.15], [25.64, 36.92], [25.75, 36.76], [26.04, 36.68], [26.1, 36.52], [26.59, 36.25], [28.03, 35.18], [28.13, 34.72], [28.06, 34.63], [28.51, 34.78], [29.56, 34.97], [29.27, 34.74], [28.02, 34.4], [27.76, 34.22], [28.05, 33.76], [28.57, 33.25], [28.98, 33.13], [29.52, 32.72], [29.97, 32.57], [29.93, 32.47], [29.63, 32.36], [29.32, 32.6], [28.93, 32.66], [28.21, 33.2], [27.9, 33.55], [27.61, 33.55], [27.18, 33.85], [26.65, 33.96], [25.69, 34.57], [24.48, 35.19], [23.94, 35.78], [23.92, 35.54], [23.78, 35.5], [23.44, 35.52], [22.95, 35.7], [22.74, 35.91], [22.63, 36.23], [22.02, 36.87], [21.59, 36.93], [21.11, 37.26], [21.04, 37.26], [21.1, 37.15], [20.98, 37.14], [19.4, 37.29], [19.4, 29.4], [30.92, 29.4], [31.23, 29.93], [31.26, 30.22], [31.46, 30.4], [31.57, 30.92], [31.42, 30.56], [31.46, 31], [31.6, 31.08], [31.46, 31.52], [31.54, 31.89], [31.34, 32.14], [31.48, 31.89], [31.29, 31.77], [31.22, 32.01], [31.09, 32.1], [31.2, 32.28], [31.29, 32.22], [31.07, 32.6], [31.17, 33.13], [31.08, 33.19], [31.13, 33.67], [31.3, 34.18], [31.9, 34.68], [33.08, 35.11], [34.03, 35.61], [34.25, 35.65], [34.55, 35.98], [34.95, 35.89], [35.42, 35.9], [35.57, 35.76], [36, 35.96], [36.31, 35.81], [36.66, 36.19], [36.81, 36.18], [36.91, 36.05], [36.58, 35.39], [36.82, 34.7], [36.18, 33.69], [36.04, 32.79], [36.18, 32.38], [36.54, 32.02], [36.8, 31.35], [36.87, 30.64], [36.27, 30.45], [36.31, 30.23], [36.16, 29.69], [36.24, 29.4], [37.6, 29.4]]
    ],
    fleuves: {
      euphrate: [[[37.59, 38.61], [37.49, 38.44], [37.38, 37.92], [37.29, 37.85], [37.12, 37.86], [37, 37.99], [36.84, 38.03], [36.56, 38.27], [36.34, 38.18], [36.07, 38.08], [35.95, 38.25], [35.86, 38.56], [35.91, 38.92], [35.88, 39.23], [35.68, 39.83], [35.47, 40], [35.23, 40.38], [35.02, 40.47], [34.58, 40.93], [34.43, 40.99],
        [34.39, 41.18], [34.51, 41.83], [34.45, 41.99], [34.3, 42.12], [34.33, 42.37], [34.11, 42.38], [33.87, 42.56], [33.87, 42.73], [33.75, 42.72], [33.58, 42.88], [33.38, 43.65], [33.05, 44.12], [32.83, 44.25], [32.5, 44.26], [31.65, 44.55], [31.48, 44.77], [31.31, 45.47], [31.23, 45.54], [31.09, 46.12], [30.9, 46.48], [30.97, 47.47]]],
      tigre: [[[37.56, 41.85], [37.44, 41.88], [37.32, 42.23], [37.06, 42.38], [36.83, 42.56], [36.69, 42.9], [36.54, 42.77], [36.33, 43.17], [36.21, 43.26], [35.95, 43.35], [35.47, 43.26], [35.01, 43.57], [34.96, 43.54], [34.19, 43.85], [34.1, 43.96], [33.97, 44.4], [33.74, 44.42], [33.53, 44.31], [33.29, 44.4], [33.02, 44.67], [32.78, 45.22], [32.6, 45.38], [32.5, 45.81], [32.63, 46.14], [32.44, 46.69], [32.15, 46.71], [31.92, 46.94], [31.83, 47.14], [31.46, 47.36], [31.29, 47.43], [31, 47.44]]],
      chatt: [[[30.97, 47.47], [30.75, 47.7], [30.51, 47.84], [30.46, 48.07], [30.29, 48.33], [30.04, 48.43], [29.96, 48.55]]],
      nil: [[[19.47, 30.46], [19.82, 30.35], [19.97, 30.58], [20.21, 30.59], [20.33, 30.54], [20.42, 30.37], [20.62, 30.32], [20.77, 30.37], [20.9, 30.58], [21.18, 30.7], [21.4, 30.97], [21.61, 31.09], [22.09, 31.4], [22.7, 32.04], [22.73, 32.14], [22.65, 32.33], [22.81, 32.58], [23.33, 32.91], [23.99, 32.88],
        [24.77, 32.92], [25.04, 32.87], [25.35, 32.54], [25.57, 32.49], [25.88, 32.76], [26.13, 32.73], [26.16, 32.68], [26.08, 32.23], [26.17, 32.15], [26.2, 32.02], [27.06, 31.34], [27.5, 30.87], [27.99, 30.86], [28.23, 30.74], [28.79, 30.9], [29.28, 31.22], [29.78, 31.29], [30.12, 31.24]],
        [[30.12, 31.24], [30.15, 31.16], [30.32, 31.08], [30.62, 31.25], [30.93, 31.24], [31.13, 31.42], [31.28, 31.67], [31.53, 31.84]], [[30.12, 31.24], [30.35, 30.85], [31.01, 30.75], [31.17, 30.57], [31.46, 30.4]]],
      jourdain: [[[33.6, 35.86], [33.43, 35.7], [33.24, 35.62], [32.9, 35.6], [32.72, 35.58], [31.77, 35.56]]]
    },
    lacs: {
      mer_morte: [[31.72, 35.59], [31.36, 35.55], [31.33, 35.52], [31.33, 35.42], [31.62, 35.42], [31.71, 35.46], [31.76, 35.52], [31.77, 35.56]],
      tiberiade: [[32.78, 35.63], [32.72, 35.58], [32.75, 35.55], [32.8, 35.53], [32.89, 35.57], [32.88, 35.62]]
    },
    reliefs: {
      hedjaz: { large: 1.5, trace: [[29.3, 35.35], [28.4, 35.85], [27.4, 36.45], [26.4, 37.25], [25.4, 38.05], [24.6, 38.75], [23.8, 39.25], [23.0, 39.7], [22.2, 40.05], [21.6, 40.18], [21.3, 40.27], [21.0, 40.38], [20.5, 40.6], [20.0, 40.95], [19.4, 41.3]] },
      sharat: { large: 1, trace: [[29.6, 35.38], [30.3, 35.5], [31.0, 35.66], [31.45, 35.72]] },
      liban: { large: 0.8, trace: [[33.35, 35.55], [33.9, 35.85], [34.45, 36.15]] },
      antiliban: { large: 0.8, trace: [[33.3, 35.8], [33.7, 36.1], [34.2, 36.45]] },
      ansariya: { large: 0.8, trace: [[34.95, 36.2], [35.6, 36.15], [36.0, 36.35]] },
      sinai: { large: 1.4, trace: [[29.05, 33.45], [28.55, 33.95], [28.2, 34.25]] },
      zagros: { large: 1.8, trace: [[37.6, 43.2], [37.0, 43.6], [36.6, 44.3], [35.8, 45.3], [35.0, 45.9], [34.0, 46.3], [33.2, 46.8], [32.4, 47.7], [31.6, 48.6], [31.0, 49.6]] }
    },
    deserts: {
      nafoud: [[29.6, 39.6], [29.45, 41.3], [29.0, 43.0], [28.2, 43.6], [27.6, 42.6], [27.5, 40.8], [27.75, 39.3], [28.6, 38.8]],
      dahna: { large: 0.7, trace: [[28.2, 43.6], [26.5, 44.8], [25.0, 46.4], [23.5, 47.3], [22.4, 47.6]] },
      rub: [[22.6, 49.6], [22.3, 47.5], [21.2, 46.3], [20.0, 45.6], [19.4, 45.6], [19.4, 49.6]],
      samawa: { part: 0.3, zone: [[32.8, 39.6], [32.9, 41.6], [32.0, 42.6], [30.8, 43.2], [30.3, 42.0], [30.9, 40.2], [31.8, 39.3]] }   // un désert de cailloux : des dunes éparses (part : une case sur trois)
    },
    steppes: {
      badiya: [[36.4, 37.4], [36.0, 38.4], [35.2, 39.6], [34.3, 40.9], [33.6, 40.6], [33.0, 39.0], [32.6, 37.6], [32.3, 36.6], [33.0, 36.6], [33.8, 36.9], [34.7, 37.0], [35.6, 37.2]],
      hawran: [[33.2, 35.9], [33.0, 36.6], [32.3, 36.7], [31.2, 36.1], [30.4, 35.9], [30.4, 35.62], [31.2, 35.75], [32.3, 35.82], [33.0, 35.82]],
      jazira: [[37.6, 38.5], [37.6, 42.6], [36.3, 43.1], [35.0, 42.6], [34.8, 41.2], [35.6, 39.8], [36.5, 38.8]]
    },
    vertes: {
      delta: [[31.6, 29.9], [31.6, 32.4], [31.0, 32.4], [30.6, 32.0], [30.1, 31.3], [30.2, 30.9], [30.6, 30.2], [31.0, 29.9]],
      sawad: [[33.6, 43.6], [33.3, 44.6], [32.6, 45.3], [31.8, 46.3], [31.1, 47.2], [30.6, 47.9], [30.35, 47.7], [30.9, 46.4], [31.5, 45.3], [31.9, 44.5], [32.4, 43.9], [33.1, 43.5]],
      levant: [[31.2, 34.2], [31.6, 34.5], [32.4, 34.85], [33.1, 35.1], [33.8, 35.4], [34.6, 35.9], [35.5, 35.85], [36.2, 35.9], [36.6, 36.2], [36.4, 36.6], [35.6, 36.4], [34.9, 36.4], [34.0, 36.0], [33.3, 35.7], [32.6, 35.45], [31.9, 35.2], [31.3, 34.9]],
      cilicie: [[37.6, 29.4], [37.6, 36.9], [36.6, 36.9], [36.6, 36.2], [36.8, 35.5], [36.3, 34.0], [36.3, 32.6], [36.7, 31.5], [36.9, 30.5], [36.9, 29.4]],
      ghouta: [[33.75, 36.35], [33.6, 36.7], [33.35, 36.6], [33.4, 36.25]],
      oronte: [[35.5, 36.45], [35.4, 36.9], [34.6, 36.85], [34.6, 36.5]],
      alep: [[36.3, 36.9], [36.3, 37.4], [35.8, 37.4], [35.8, 36.85]]
    },
    oasis: [[24.47, 39.61, 0.2], [25.70, 39.29, 0.14], [27.63, 38.55, 0.14], [28.38, 36.57, 0.12], [29.81, 39.87, 0.14], [26.62, 37.92, 0.12], [21.28, 40.41, 0.16],
      [27.12, 42.50, 0.1], [24.15, 47.30, 0.18], [34.56, 38.27, 0.12], [32.57, 43.49, 0.12], [29.30, 30.80, 0.2]],
    routes: [
      ['medine', [23.78, 38.79], [22.75, 39.25], 'mecque'],
      ['mecque', 'taif'],
      ['medine', [26.62, 37.92], [28.38, 36.57], [30.19, 35.73], [31.95, 35.93], [32.52, 36.48], 'damas'],
      [[31.95, 35.93], [32.08, 35.78], [32.08, 35.36], 'quds'],
      ['quds', [32.22, 35.26], [32.50, 35.42], [32.52, 35.72], 'yarmouk', [33.07, 36.18], 'damas'],
      ['damas', 'homs', [35.13, 36.75], 'qinnasrin'],
      ['quds', [31.40, 34.60], [30.98, 33.80], [30.85, 32.45], [30.42, 31.56], 'fustat'],
      [[30.19, 35.73], [29.62, 35.02], [29.90, 33.75], [30.05, 32.45], 'fustat'],
      ['medine', [25.30, 40.90], [27.12, 42.50], [28.90, 43.40], [30.60, 44.10], [31.70, 44.10], 'hira', 'koufa'],
      ['hira', [31.25, 44.32], [31.00, 45.30], [30.75, 46.20], [30.45, 47.30], 'bassora'],
      ['hira', [32.57, 43.49], [33.05, 40.60], [34.56, 38.27], [34.23, 37.24], 'damas'],
      [[34.56, 38.27], 'homs']
    ],
    gabarits: ['ville', 'romaine', 'camp'],
    depuis: {
      ab1: { an: 11, epoque: 'An 11 H · 632', portes: [{ carte: 'medine', des: 0, ville: 'medine' }] },
      ab2: { an: 11, epoque: 'An 11 H · 632', portes: [{ carte: 'medine', des: 0, ville: 'medine' }] },
      ab3: { an: 11, epoque: 'An 11–12 H · 632–633', portes: [{ carte: 'medine', des: 5, ville: 'medine' }] },
      u1:  { an: 18, epoque: 'An 18 H · 639', portes: [{ carte: 'medine', des: 0, ville: 'medine' }] },
      u2:  { an: 16, epoque: 'An 16 H · 637', portes: [{ carte: 'romaine', des: 3, ville: 'quds' }] },
      u3:  { an: 17, epoque: 'An 17–23 H · 638–644', portes: [{ carte: 'medine', des: 0, ville: 'medine' }] },
      k1:  { an: 12, epoque: 'An 12 H · 633', portes: [{ carte: 'camp', des: 0, ville: 'hira' }] },
      k2:  { an: 13, epoque: 'An 13 ou 15 H · 634–636', portes: [{ carte: 'camp', des: 0, ville: 'yarmouk' }] },
      k3:  { an: 17, epoque: 'An 17 H · 638', portes: [{ carte: 'romaine', des: 0, ville: 'qinnasrin' }, { carte: 'romaine', des: 3, ville: 'homs' }] },
      ut1: { an: 30, epoque: 'Vers l’an 30 H · 650', portes: [{ carte: 'medine', des: 0, ville: 'medine' }] },
      ut2: { an: 28, epoque: 'An 28–34 H · 649–655', portes: [{ carte: 'medine', des: 0, ville: 'medine' }] },
      ut3: { an: 35, epoque: 'An 35 H · 656', portes: [{ carte: 'medine', des: 0, ville: 'medine' }] },
      a1:  { an: 36, epoque: 'An 36 H · 657', portes: [{ carte: 'koufa', des: 0, ville: 'koufa' }] },
      a2:  { an: 37, epoque: 'An 37 H · 658', portes: [{ carte: 'koufa', des: 0, ville: 'koufa' }] },
      a3:  { an: 38, epoque: 'An 38–40 H · 658–661', portes: [{ carte: 'koufa', des: 6, ville: 'koufa' }] }
    }
  };

  // noms des lieux, pour la carte de la halte (null : lieu technique, non affiché)
  D.LIEUX = {
    mosquee_cour: 'Mosquée', mosquee_porte: null, place: 'Place', souk: 'Souk', halle: 'Halle', maison: 'Maisons', puits: 'Puits', palmeraie: 'Palmeraie',
    porte_nord: 'Porte du nord', porte_sud: 'Porte du sud', enclos: 'Enclos', colline: 'Colline', priere: null, ecole: 'École', comptoir: null,
    depart: 'Départ', dunes: 'Dunes', rochers: 'Rochers', oasis: 'Oasis', source: 'Source', caravane: 'Caravane', crete: 'Crête', ruines: 'Ruines', arrivee: 'Arrivée',
    entree: 'Entrée', tente_chef: 'Tente du chef', feu: 'Feu', etendard: 'Étendard', lignes: 'Lignes', tertre: 'Tertre', tentes: 'Tentes',
    porte: 'Porte', cardo: 'Grande rue', forum: 'Forum', basilique: 'Basilique', esplanade: 'Esplanade', palais: 'Palais', fontaine: 'Fontaine', remparts: 'Remparts',
    jardin: 'Jardin', marche: 'Marché', quartier: 'Quartier', nef: 'Nef', trone: 'Trône', tresor: 'Trésor', colonnade: 'Colonnade',
    poupe: 'Poupe', pont: 'Pont', mat: 'Mât', proue: 'Proue', passerelle: 'Passerelle', pont2: 'Entrepont',
    seuil: 'Seuil', noeud1: 'Nœud', noeud2: 'Nœud', noeud3: 'Nœud', faille: 'Faille', miroir: 'Miroir', coeur: 'Cœur',
    cour: 'Cour', tour: 'Tour', salle: 'Grande salle', mosquee: 'Mosquée', greniers: 'Greniers', poterne: 'Poterne',
    rue: 'Rue', ecran: 'Grand écran', ruelle: 'Ruelle', ascenseur: 'Ascenseur', parvis: 'Parvis', rayonnages: 'Rayonnages', bureau: 'Bureau', chaine: 'La Chaîne',
    galerie: 'Galerie marchande', jeux: 'Salle de jeux', circuit: 'Circuit', tribune: 'Tribune', parc: 'Parc', roue: 'Grande roue',
    traverse: 'Traverser la rue',
    // 2.29 (D220) : les villes de la carte du monde (D.MONDE)
    medine: 'Médine', mecque: 'La Mecque', taif: 'Tâ’if', quds: 'Jérusalem', damas: 'Damas', homs: 'Homs', qinnasrin: 'Qinnasrîn',
    yarmouk: 'Vallée du Yarmoûk', hira: 'Al-Hîra', bassora: 'Bassora', koufa: 'Koufa', fustat: 'Fustât'
  };

  // tenue d'un personnage (look) : coiffes, manteaux, motifs, attributs portés — dessin dans sprites.js
  D.COIFFES = ['imama', 'imama_haute', 'imama_large', 'imama_queue', 'calotte', 'casque', 'casque_turban', 'casque_cuir', 'casque_bandes', 'coiffe_mailles', 'capuche', 'tiare', 'litham', 'keffieh'];
  D.MANTEAUX = ['long', 'aucun', 'epaule', 'ample'];
  D.MOTIFS = ['rayures', 'bandes'];
  D.PORTES = ['durra', 'sabre', 'lance', 'baton', 'feuillets', 'bourse', 'bouclier', 'outre', 'etendard', 'arc', 'dague', 'masse', 'calame', 'tablette', 'bouclier_cuir', 'bouclier_bois', 'pavois'];
  D.ARMURES = ['cuir', 'matelasse', 'mailles', 'lamelles']; // look.armure : ce qui couvre le buste

  D.ITEMS = {
    // vivre: true — ce que l'on ne prend pas un jour de jeûne
    dattes: { name: 'Dattes de Médine', desc: 'Rend 40 % de Constance à un compagnon.',              hp: 0.4,  target: 'ally', vivre: true },
    eau:    { name: "Outre d'eau",      desc: 'Rend 80 % de Constance à un compagnon.',              hp: 0.8,  target: 'ally', vivre: true },
    pain:   { name: "Pain d'orge",      desc: 'Rend 25 % de Constance à tout le groupe.',            hp: 0.25, target: 'allies', vivre: true },
    miel:   { name: 'Miel',             desc: 'Dissipe les altérations et rend 30 % de Constance.',  hp: 0.3,  cleanse: true, target: 'ally', vivre: true },
    musc:   { name: 'Musc',             desc: 'Rend 50 % de Souffle à un compagnon.',                sp: 0.5,  target: 'ally' },
    lait:   { name: 'Lait chaud',       desc: 'Relève un compagnon éprouvé (50 % de Constance).',    revive: 0.5, target: 'ally', vivre: true },
    siwak:  { name: 'Siwâk',            desc: 'Accorde 2 points de Niyya.',                          niyya: 2, target: 'ally' }
  };

  // v6 — l'équipement. Quatre emplacements, comme dans les jeux de rôle d'autrefois : main droite, main
  // gauche, tête, corps. Des objets ordinaires de l'époque : ni relique, ni arme d'un personnage de
  // l'histoire, ni inscription, ni or ni soie, ni vertu prêtée à un objet (exigences 8, 15 et 16).
  // Les effets sont des pourcentages des statistiques du niveau : le moteur calcule, rien n'est fixé à la main.
  //   atk Force · mag Esprit · def Garde · spd Élan · hp Constance · sp Souffle (en %)
  //   perce  part de la Garde adverse ignorée par les coups de fer   vif    chance de frapper deux fois
  //   prime  agit plus tôt au début du combat                         choc   chance d'étourdir en frappant
  //   parade chance de parer un coup de fer (moitié des dégâts)       ferme  chance de ne pas être étourdi
  //   r      rang (0 à 4) : fixe le prix · tete, corps, port : ce que le dessin montre en combat (sprites.js)
  //   c      [couleur principale, couleur d'accent] de l'icône · ico : gabarit d'icône, s'il diffère du type
  const TOUS = ['guerrier', 'gardien', 'sage', 'soigneur', 'stratege'], ARMES = ['guerrier', 'gardien', 'stratege'], LOURD = ['guerrier', 'gardien'], LETTRES = ['sage', 'soigneur', 'stratege'];
  D.SLOTS = { md: 'Main droite', mg: 'Main gauche', tete: 'Tête', corps: 'Corps' };
  D.GEAR_TYPES = {
    epee:    { slot: 'md', name: 'Épée', roles: ARMES, anim: 'slash', port: 'sabre' },
    lance:   { slot: 'md', name: 'Lance', roles: LOURD, anim: 'thrust', port: 'lance' },
    arc:     { slot: 'md', name: 'Arc', roles: ['guerrier', 'stratege'], anim: 'arrow', port: 'arc' },
    dague:   { slot: 'md', name: 'Dague', roles: ['guerrier', 'stratege'], anim: 'slash', port: 'dague' },
    masse:   { slot: 'md', name: 'Masse', roles: LOURD, anim: 'smash', port: 'masse' },
    baton:   { slot: 'md', name: 'Bâton', roles: ['gardien', 'sage', 'soigneur', 'stratege'], anim: 'smash', port: 'baton' },
    calame:  { slot: 'md', name: 'Calame', roles: LETTRES, port: 'calame' },
    ecu:     { slot: 'mg', name: 'Bouclier', roles: ARMES, port: 'bouclier' },
    pavois:  { slot: 'mg', name: 'Grand bouclier', roles: LOURD, port: 'pavois' },
    outil:   { slot: 'mg', name: 'Outil', roles: LETTRES },
    turban:  { slot: 'tete', name: 'Turban', roles: TOUS },
    calotte: { slot: 'tete', name: 'Calotte', roles: TOUS },
    casque:  { slot: 'tete', name: 'Casque', roles: ARMES },
    etoffe:  { slot: 'corps', name: 'Étoffe', roles: TOUS },
    cuir:    { slot: 'corps', name: 'Cuir', roles: ARMES },
    mailles: { slot: 'corps', name: 'Armure', roles: LOURD }
  };
  const FER = '#c3c8d2', ACIER = '#a9bfd6', BOIS = '#8a6238', CUIR = '#9a6a3c', LAINE = '#e6dcc4';
  D.GEAR = {
    // --- main droite : épées
    epee_fer:       { t: 'epee', r: 0, name: 'Épée de fer', atk: 3, c: [FER, BOIS], desc: 'Lame droite à deux tranchants, sans ornement.' },
    epee_yemen:     { t: 'epee', r: 1, name: 'Épée du Yémen', atk: 7, c: ['#d0cfc4', '#7a2f2a'], desc: 'Le Yémen forge depuis longtemps ; ses lames sont recherchées.' },
    epee_inde:      { t: 'epee', r: 2, name: 'Épée d’acier de l’Inde', atk: 11, c: [ACIER, '#2f5f8a'], desc: 'Un acier venu par mer. Les poètes anciens nomment cette lame muhannad.' },
    epee_mashrafi:  { t: 'epee', r: 3, name: 'Épée de Mashârif', atk: 15, spd: 2, c: ['#dfe6ee', '#3f7a5a'], desc: 'Les poètes anciens la nomment mashrafî, du nom des bourgs où on la forgeait.' },
    epee_maitre:    { t: 'epee', r: 4, name: 'Épée de maître forgeron', atk: 19, spd: 2, c: ['#f0f4fa', '#5a3f8a'], desc: 'Un fil égal d’un bout à l’autre : l’ouvrage d’une vie d’atelier.' },
    // lances : elles percent la garde
    javelot:        { t: 'lance', r: 1, name: 'Javelot', atk: 5, spd: 2, perce: 0.15, c: [FER, '#a07848'], ico: 'javelot', desc: 'Court et léger. On le tient ou on le lance.' },
    lance_khatt:    { t: 'lance', r: 2, name: 'Lance d’al-Khatt', atk: 9, perce: 0.2, c: [FER, '#b89a5a'], desc: 'Hampe de roseau dur débarquée à al-Khatt, sur la côte du Bahreïn : on la dit khattî.' },
    lance_samhari:  { t: 'lance', r: 3, name: 'Lance samharie', atk: 13, perce: 0.25, c: [ACIER, '#6a4a2a'], desc: 'Droite et ferme : les poètes anciens la nomment samharî.' },
    // arcs : la première flèche part avant tout le monde
    arc_chasse:     { t: 'arc', r: 1, name: 'Arc de chasse', atk: 4, spd: 4, prime: true, c: [BOIS, LAINE], desc: 'Un arc simple, d’une seule pièce de bois.' },
    arc_nab:        { t: 'arc', r: 2, name: "Arc de nab'", atk: 8, spd: 6, prime: true, c: ['#a8743c', LAINE], desc: "Taillé dans le nab', le bois que préféraient les archers d’Arabie." },
    arc_double:     { t: 'arc', r: 3, name: 'Arc à double courbure', atk: 12, spd: 7, prime: true, c: ['#6a4a2a', '#c9b99a'], ico: 'arc2', desc: 'Bois, corne et tendon collés, à la manière des archers de Perse.' },
    // dagues : vives, elles frappent parfois deux fois
    couteau:        { t: 'dague', r: 0, name: 'Couteau de ceinture', atk: 2, spd: 3, c: [FER, BOIS], desc: 'Celui de tous les jours, qui coupe le pain et la corde.' },
    dague:          { t: 'dague', r: 2, name: 'Dague', atk: 6, spd: 6, vif: 0.2, c: [FER, '#7a2f2a'], desc: 'Lame courte, vite sortie.' },
    dague_fine:     { t: 'dague', r: 3, name: 'Dague effilée', atk: 9, spd: 8, vif: 0.3, c: [ACIER, '#2f5f8a'], desc: 'Si mince qu’elle trouve le défaut d’une garde.' },
    // masses : lourdes, elles étourdissent
    massue:         { t: 'masse', r: 1, name: 'Massue de tamaris', atk: 8, spd: -4, choc: 0.12, c: [BOIS, BOIS], ico: 'massue', desc: 'Un bois dense, coupé au bord des oueds.' },
    masse_fer:      { t: 'masse', r: 3, name: 'Masse de fer', atk: 16, spd: -5, choc: 0.2, c: [FER, BOIS], desc: 'Une tête de fer sur un manche court : l’arme des cavaliers lourds.' },
    // bâtons : on s'y appuie
    baton_marche:   { t: 'baton', r: 0, name: 'Bâton de marche', def: 2, sp: 4, c: [BOIS, BOIS], desc: 'On s’y appuie ; le souffle dure plus longtemps.' },
    baton_acacia:   { t: 'baton', r: 1, name: 'Bâton d’acacia', def: 4, sp: 8, c: ['#a8743c', '#5a3d22'], desc: 'Bois dur des vallées sèches, poli par la main.' },
    baton_ferre:    { t: 'baton', r: 2, name: 'Bâton ferré', atk: 5, def: 6, sp: 8, c: [BOIS, FER], ico: 'baton_ferre', desc: 'Deux viroles de fer : il soutient, et il pare.' },
    houlette:       { t: 'baton', r: 2, name: 'Houlette de berger', hp: 6, sp: 10, c: ['#a07848', BOIS], ico: 'houlette', roles: ['sage', 'soigneur'], desc: 'Le bâton recourbé de ceux qui gardent les bêtes.' },
    // calames : qui note retient
    calame:         { t: 'calame', r: 0, name: 'Calame de roseau', mag: 3, c: ['#c9a25a', '#2a2233'], desc: 'Un roseau taillé en biseau. Qui note retient.' },
    calame_encrier: { t: 'calame', r: 1, name: 'Calame et encrier', mag: 7, sp: 3, c: ['#c9a25a', '#3a5f7a'], ico: 'encrier', desc: 'L’encre de noir de fumée à la ceinture : on écrit où l’on se trouve.' },
    ecritoire:      { t: 'calame', r: 2, name: 'Écritoire de scribe', mag: 11, sp: 6, c: ['#8a6238', '#c9a25a'], ico: 'ecritoire', desc: 'Calames, canif et encre dans un même étui.' },
    calame_fin:     { t: 'calame', r: 3, name: 'Calame taillé fin', mag: 15, sp: 6, c: ['#e0c27a', '#5a3f8a'], desc: 'Le bec le plus fin : celui des copistes exercés.' },
    // --- main gauche : boucliers
    bouclier_cuir:  { t: 'ecu', r: 1, name: 'Bouclier de cuir', def: 5, parade: 0.08, port: 'bouclier_cuir', c: [CUIR, '#5e3c22'], desc: 'Peaux cousues, sans bois : léger, il suit le bras.' },
    rondache:       { t: 'ecu', r: 2, name: 'Rondache de bois', def: 8, parade: 0.1, port: 'bouclier_bois', c: ['#a07848', FER], desc: 'Planches jointes sous une peau tendue.' },
    bouclier_lamt:  { t: 'ecu', r: 3, name: 'Bouclier de lamt', def: 9, spd: 1, parade: 0.16, port: 'bouclier_cuir', c: ['#e0cfa8', '#9a6a3c'], desc: 'Cuir d’antilope du Sahara, renommé dans tout le Maghreb.' },
    bouclier_ferre: { t: 'ecu', r: 3, name: 'Bouclier ferré', def: 12, spd: -3, parade: 0.12, port: 'bouclier', c: [FER, '#7a2f2a'], desc: 'Bordure et bosse de fer : il arrête, mais il pèse.' },
    grand_bouclier: { t: 'pavois', r: 3, name: 'Grand bouclier', def: 15, spd: -6, parade: 0.18, c: ['#7a2f2a', FER], desc: 'Haut comme le torse, à la manière des lignes de Rûm.' },
    // outils de la main gauche, pour qui ne porte pas de bouclier
    gourde:         { t: 'outil', r: 1, name: 'Gourde de cuir', sp: 8, port: 'outre', c: [CUIR, '#5e3c22'], ico: 'gourde', desc: 'De l’eau à portée de main : on parle et on marche plus longtemps.' },
    tablette:       { t: 'outil', r: 2, name: 'Tablette de bois', mag: 5, sp: 4, port: 'tablette', c: ['#c9a25a', '#2a2233'], ico: 'tablette', desc: 'On y écrit, on la lave, on recommence.' },
    lampe:          { t: 'outil', r: 3, name: 'Lampe de veille', mag: 8, sp: 2, c: ['#b8763c', '#ffd27a'], ico: 'lampe', desc: 'Pour étudier quand les autres dorment.' },
    // --- tête : turbans et calottes
    turban:         { t: 'turban', r: 0, name: 'Turban de coton', hp: 2, c: [LAINE, '#b0a48a'], desc: 'Une étoffe enroulée : l’ombre et la tenue.' },
    turban_voyage:  { t: 'turban', r: 1, name: 'Turban de voyage', hp: 5, spd: 2, c: ['#d6c7a0', '#7a2f2a'], desc: 'Serré, un pan rabattu contre le vent.' },
    cheche:         { t: 'turban', r: 2, name: 'Chèche des sables', hp: 5, sp: 6, c: ['#2f4f7a', '#1f2f55'], ico: 'cheche', desc: 'Le long voile des gens du désert : il garde le souffle du sable.' },
    calotte:        { t: 'calotte', r: 1, name: 'Calotte de feutre', sp: 5, mag: 2, c: ['#b8a888', '#7a6a50'], desc: 'Légère, elle laisse la tête au frais.' },
    calotte_double: { t: 'calotte', r: 2, name: 'Calotte doublée', sp: 8, mag: 4, c: ['#8a9a7a', '#4a5a3a'], desc: 'Deux épaisseurs piquées : on l’oublie.' },
    // casques
    casque_cuir:    { t: 'casque', r: 1, name: 'Casque de cuir', def: 4, ferme: 0.25, tete: 'casque_cuir', c: [CUIR, '#5e3c22'], desc: 'Cuir durci : peu de poids, un peu de garde.' },
    coiffe_mailles: { t: 'casque', r: 2, name: 'Coiffe de mailles', def: 6, spd: -1, ferme: 0.35, tete: 'coiffe_mailles', c: [FER, '#7f8794'], ico: 'coiffe_mailles', desc: 'Un capuchon d’anneaux qui couvre la nuque.' },
    casque_fer:     { t: 'casque', r: 2, name: 'Casque de fer', def: 8, spd: -2, ferme: 0.5, tete: 'casque', c: [FER, '#7f8794'], desc: 'Une calotte de fer d’une seule pièce.' },
    casque_turban:  { t: 'casque', r: 3, name: 'Casque enturbanné', def: 8, hp: 5, spd: -2, ferme: 0.5, tete: 'casque_turban', c: [FER, LAINE], ico: 'casque_turban', desc: 'Un turban autour du fer : il amortit, et il tient chaud.' },
    casque_bandes:  { t: 'casque', r: 3, name: 'Casque à bandes', def: 11, spd: -3, ferme: 0.6, tete: 'casque_bandes', c: [FER, '#b8763c'], ico: 'casque_bandes', desc: 'Quatre plaques rivées sous des bandes de fer, à la manière de Rûm et de Perse.' },
    // --- corps : étoffes
    tunique:        { t: 'etoffe', r: 0, name: 'Tunique de laine', hp: 2, c: ['#b8a888', '#7a6a50'], desc: 'Le vêtement de tous les jours.' },
    tunique_lin:    { t: 'etoffe', r: 1, name: 'Tunique de lin', sp: 5, spd: 2, c: ['#f0ead8', '#c9c0a8'], desc: 'Lin d’Égypte, léger sous le soleil.' },
    manteau_laine:  { t: 'etoffe', r: 1, name: 'Manteau de laine', hp: 6, def: 2, c: ['#6a5a4a', '#3a3028'], ico: 'manteau', desc: 'Épais : il tient chaud la nuit et amortit le jour.' },
    manteau_raye:   { t: 'etoffe', r: 2, name: 'Manteau rayé du Yémen', hp: 8, sp: 6, c: ['#e6dcc4', '#7a2f2a'], ico: 'manteau_raye', desc: 'Étoffe rayée des tisserands du Yémen, portée dans toute l’Arabie.' },
    burnous:        { t: 'etoffe', r: 2, name: 'Burnous', hp: 8, def: 3, spd: 1, c: ['#e9e2d0', '#a89878'], ico: 'burnous', desc: 'Le manteau à capuchon des gens du Maghreb, d’une seule pièce.' },
    // cuirs
    gilet_cuir:     { t: 'cuir', r: 1, name: 'Gilet de cuir', def: 6, corps: 'cuir', c: [CUIR, '#5e3c22'], desc: 'Cuir épais, lacé sur les côtés.' },
    matelassee:     { t: 'cuir', r: 2, name: 'Tunique matelassée', def: 8, hp: 5, corps: 'matelasse', c: ['#c9b99a', '#7a6a50'], ico: 'matelassee', desc: 'De la bourre piquée entre deux toiles : elle boit les coups.' },
    // armures
    cotte:          { t: 'mailles', r: 2, name: 'Cotte de mailles', def: 12, spd: -3, corps: 'mailles', c: [FER, '#7f8794'], desc: 'Des milliers d’anneaux rivés. Elle protège, et elle pèse.' },
    cotte_saluqi:   { t: 'mailles', r: 3, name: 'Cotte salûqie', def: 16, spd: -3, corps: 'mailles', c: [ACIER, '#5f7f9a'], desc: 'Du nom de Salûq, au Yémen, que citent les poètes anciens.' },
    lamelles:       { t: 'mailles', r: 3, name: 'Cuirasse à lamelles', def: 18, hp: 4, spd: -5, corps: 'lamelles', c: [FER, '#7a2f2a'], ico: 'lamelles', desc: 'De petites plaques lacées, à la manière des cavaliers lourds de Perse et de Rûm.' },
    cotte_serree:   { t: 'mailles', r: 4, name: 'Cotte à mailles serrées', def: 20, spd: -3, corps: 'mailles', c: ['#dfe6ee', '#5a3f8a'], desc: 'Anneaux plus petits, rangs plus denses : peu de lames passent.' }
  };
  D.GEAR_PRIX = [8, 16, 30, 50, 85]; // en dirhams, selon le rang ; la revente rend la moitié
  // chaque comptoir a ses artisans : ce que l'on trouve dépend du lieu
  D.GEAR_SHOPS = {
    medine:    ['epee_fer', 'epee_yemen', 'javelot', 'couteau', 'baton_marche', 'baton_acacia', 'calame', 'calame_encrier', 'bouclier_cuir', 'gourde', 'turban', 'turban_voyage', 'calotte', 'tunique', 'tunique_lin', 'manteau_laine', 'gilet_cuir'],
    desert:    ['arc_chasse', "arc_nab", 'lance_khatt', 'massue', 'houlette', 'baton_acacia', 'bouclier_cuir', 'gourde', 'cheche', 'turban_voyage', 'manteau_raye', 'manteau_laine'],
    camp:      ['epee_yemen', 'epee_inde', 'lance_khatt', 'lance_samhari', 'arc_nab', 'dague', 'rondache', 'bouclier_ferre', 'casque_cuir', 'coiffe_mailles', 'casque_fer', 'gilet_cuir', 'matelassee', 'cotte'],
    romaine:   ['epee_inde', 'masse_fer', 'dague', 'ecritoire', 'grand_bouclier', 'bouclier_ferre', 'tablette', 'lampe', 'casque_bandes', 'casque_fer', 'tunique_lin', 'lamelles', 'matelassee'],
    koufa:     ['epee_inde', 'epee_mashrafi', 'arc_double', 'dague_fine', 'baton_ferre', 'ecritoire', 'calame_fin', 'rondache', 'tablette', 'lampe', 'calotte_double', 'casque_turban', 'manteau_raye', 'cotte', 'cotte_saluqi'],
    citadelle: ['epee_yemen', 'lance_samhari', 'massue', 'baton_ferre', 'houlette', 'calame_encrier', 'rondache', 'bouclier_lamt', 'lampe', 'cheche', 'casque_fer', 'burnous', 'matelassee', 'cotte'],
    // 2.28 (D217) : l'étal de la galerie des quartiers (activites.js) — des pièces ordinaires, payées avec les primes du circuit
    quartiers: ['baton_marche', 'gourde', 'calotte', 'tunique_lin', 'manteau_laine', 'tablette', 'lampe']
  };
  // 2.29 (D220) : le comptoir d'une ville visitée tient les artisans d'un lieu du jeu (les mêmes listes : rien de nouveau à vendre)
  Object.entries({ visite_medine: 'medine', visite_mecque: 'medine', visite_taif: 'medine', visite_koufa: 'koufa', visite_bassora: 'koufa', visite_fustat: 'koufa',
    visite_quds: 'romaine', visite_damas: 'romaine', visite_homs: 'romaine', visite_qinnasrin: 'romaine', visite_hira: 'camp' }).forEach(([v, m]) => { D.GEAR_SHOPS[v] = D.GEAR_SHOPS[m].slice(); });

  // Opérations de script autorisées : nom -> [min args, max args]
  D.OPS = {
    say: [2, 2], nar: [1, 1], quote: [2, 2], title: [1, 2], choice: [2, 2], ask: [2, 2],
    battle: [1, 1], map: [2, 3], tp: [2, 2], walk: [2, 2], face: [2, 2], show: [1, 1], hide: [1, 1],
    fade: [1, 2], wait: [1, 1], shake: [0, 1], flash: [0, 1], sfx: [1, 1],
    give: [1, 2], join: [1, 1], leave: [1, 1], codex: [1, 1], heal: [0, 0],
    flag: [1, 2], if: [2, 3], tint: [1, 1], light: [1, 1],
    pray: [0, 1], emote: [2, 2], parley: [1, 1], pillar: [2, 2], mus: [1, 1], mat: [1, 2], site: [1, 1], lore: [1, 1], raid: [0, 1],
    vices: [0, 1]
  };

  // v5 — le cœur. Les œuvres ; les sept maux du cœur, chacun avec l'œuvre qui forge sa lame et le
  // nombre de fois qu'il faut l'avoir accomplie ; les compagnons de lumière. Textes : src/data/coeur.js.
  D.OEUVRES = ['priere', 'dhikr', 'etude', 'jeune', 'aumone', 'visite', 'hajj'];
  D.VICES = {
    avidite:     { oeuvre: 'jeune',  need: 3 },
    orgueil:     { oeuvre: 'hajj',   need: 1 },
    ostentation: { oeuvre: 'priere', need: 3 },
    avarice:     { oeuvre: 'aumone', need: 3 },
    insouciance: { oeuvre: 'etude',  need: 3 },
    envie:       { oeuvre: 'visite', need: 3 },
    colere:      { oeuvre: 'dhikr',  need: 3 }
  };
  D.ANIMAUX = ['renard', 'aigle', 'phenix', 'lion', 'gazelle'];

  // L'organigramme du mal (version 7). Les cinq idées noires : ce qui pèse sur une personne. Avec les sept maux du cœur,
  // elles font les douze racines qu'une idole peut redire (`racine`, dans les fichiers de saga). Textes : src/data/coeur.js.
  D.NOIRS = ['noir_honte', 'noir_peur', 'noir_soupcon', 'noir_rancune', 'noir_desespoir'];
  D.RACINES = Object.keys(D.VICES).concat(D.NOIRS);
  // Les trois manières de répondre à une idée noire (décision du décideur : la parole, la pédagogie, la bienveillance).
  D.VOIES = {
    parole:        { name: 'Dire vrai', de: 'la parole' },
    pedagogie:     { name: 'Expliquer', de: 'la pédagogie' },
    bienveillance: { name: 'Rassurer',  de: 'la bienveillance' }
  };
  // Parcours d'un récit et de ses sous-récits (pourparler, choix, question, condition, maux du dernier chapitre) : le moteur
  // et le validateur lisent les scripts de la même façon.
  D.parcours = function (ops, fn) {
    (ops || []).forEach(o => {
      if (!Array.isArray(o)) return; fn(o);
      if (o[0] === 'parley' && o[1]) { D.parcours(o[1].win, fn); D.parcours(o[1].lose, fn); }
      else if ((o[0] === 'choice' || o[0] === 'ask') && Array.isArray(o[2])) o[2].forEach(c => D.parcours(c && c.r, fn));
      else if (o[0] === 'if') { D.parcours(o[2], fn); D.parcours(o[3], fn); }
      else if (o[0] === 'vices' && o[1]) ['avant', 'aucun', 'tous', 'reste'].forEach(k => D.parcours(o[1][k], fn));
    });
  };

  // La bataille déclarée (version 7) : les rangs qu'une mission peut aligner, les ordres qu'on leur donne, et les trois
  // manœuvres d'école du stratège. La mission est dans le chapitre (`bataille`) ; règles et dessin : src/core/rangs.js.
  // `pas` : cases par pas · `ferme` : tient mieux quand il tient · `monte` : rang monté (charge, réserve mobile).
  D.RANGS = {
    fantassins: { name: 'Fantassins', desc: 'Des fantassins : ils tiennent le couloir, et encaissent mieux quand ils tiennent.', ordres: ['tenir', 'avancer', 'glisser', 'replier'], ferme: true, look: { kind: 'soldat', coiffe: 'casque', item: ['lance', 'bouclier_bois'] } },
    cavaliers:  { name: 'Cavaliers', desc: 'Des cavaliers : ils chargent de deux cases, et frappent plus fort à l’arrivée.', ordres: ['tenir', 'avancer', 'charger', 'glisser', 'replier'], monte: true, look: { kind: 'soldat', coiffe: 'casque_turban', item: 'lance', robe: '#6f5a48' } },
    archers:    { name: 'Archers', desc: 'Des archers : ils tirent dans leur couloir, jusqu’à trois cases, sans bouger.', ordres: ['tirer', 'tenir', 'glisser', 'replier'], look: { kind: 'soldat', coiffe: 'casque_cuir', item: 'arc', robe: '#7d7a5a' } },
    gens:       { name: 'Gens du lieu', desc: 'Les gens de la mission : ils tiennent et avancent, sans charge ni tir.', ordres: ['tenir', 'avancer', 'replier'], look: { kind: 'homme', robe: '#8c7d68' } }
  };
  D.ORDRES = {
    tenir:   { name: 'Tenir', desc: 'Le rang reste où il est et frappe ce qui vient à lui. Des fantassins qui tiennent encaissent mieux.' },
    avancer: { name: 'Avancer', desc: 'Une case vers l’idole à chaque pas. Le rang frappe la nuée qui lui barre le couloir.' },
    charger: { name: 'Charger', desc: 'Deux cases d’un élan, et un coup plus fort à l’arrivée.' },
    tirer:   { name: 'Tirer', desc: 'Frappe la première nuée du couloir, jusqu’à trois cases, sans bouger.' },
    glisser: { name: 'Glisser', desc: 'Change de couloir, pour border une nuée et la prendre de flanc.' },
    replier: { name: 'Se replier', desc: 'Une case en arrière.' }
  };
  D.MANOEUVRES = {
    garde:    { name: 'Réserve mobile', desc: 'Les cavaliers sont portés d’un coup là où le rang plie : une case libre de notre moitié du champ.' },
    tenaille: { name: 'Enveloppement', desc: 'Les deux ailes avancent de deux cases et se rabattent : une nuée du centre prise entre elles se dissipe.' },
    feinte:   { name: 'Repli feint', desc: 'Un rang recule d’une case. La nuée qui le suivait s’avance et se découvre : le prochain coup porte double.' }
  };

  // v4 — s'orienter aux étoiles. Huit caps, nommés comme le feront les pilotes arabes : par l'étoile qui
  // s'y lève (à l'est) ou s'y couche (à l'ouest). Ordre : E, SE, S, SO, O, NO, N, NE (secteurs de 45°).
  D.STARS = [
    { dir: 'est',        name: "an-Nasr at-Tâ'ir", ar: 'النسر الطائر', way: 'lever',   fr: 'Altaïr, l’Aigle qui vole' },
    { dir: 'sud-est',    name: "al-'Aqrab",        ar: 'العقرب',       way: 'lever',   fr: 'le Scorpion, son cœur rouge' },
    { dir: 'sud',        name: 'Suhayl',           ar: 'سهيل',         way: '',        fr: 'Canopus, l’étoile du sud' },
    { dir: 'sud-ouest',  name: "al-'Aqrab",        ar: 'العقرب',       way: 'coucher', fr: 'le Scorpion, son cœur rouge' },
    { dir: 'ouest',      name: "an-Nasr at-Tâ'ir", ar: 'النسر الطائر', way: 'coucher', fr: 'Altaïr, l’Aigle qui vole' },
    { dir: 'nord-ouest', name: "al-'Ayyûq",        ar: 'العيّوق',      way: 'coucher', fr: 'Capella, la gardienne des Pléiades' },
    { dir: 'nord',       name: 'al-Jady',          ar: 'الجدي',        way: '',        fr: 'la Polaire, le Chevreau : elle ne bouge pas' },
    { dir: 'nord-est',   name: "al-'Ayyûq",        ar: 'العيّوق',      way: 'lever',   fr: 'Capella, la gardienne des Pléiades' }
  ];
  D.LORE = ['etoiles', 'caravanes', 'routes_sures', 'razzia'];

  // v3 — bâtir : matériaux et pièces. Une pièce se pose case par case, devant soi.
  D.MATS = {
    eau: { name: 'Eau', g: '≈' }, pise: { name: 'Pisé', g: '▦' }, palme: { name: 'Palme', g: '‡' },
    pierre: { name: 'Pierre', g: '◆' }, grain: { name: 'Grain', g: '∴' }, laine: { name: 'Laine', g: '≋' }
  };
  D.PIECES = {
    tranchee:  { name: 'Tranchée', cost: {}, tile: 'trench', group: 'Défendre', desc: 'Les chimères qui rôdent ne la franchissent pas. Six segments gardent un lieu.' },
    puits:     { name: 'Puits', cost: { pierre: 4 }, obj: 'well', solid: true, group: 'Eau et vivres', desc: 'Donne de l’eau. Palmiers, champs et troupeaux en ont besoin à moins de six pas.' },
    palmier:   { name: 'Palmier', cost: { eau: 1 }, obj: 'palm', solid: true, near: true, group: 'Eau et vivres', desc: 'Un puits et trois palmiers font une oasis. Donne des dattes à chaque chapitre.' },
    champ:     { name: 'Champ d’orge', cost: { eau: 1, grain: 1 }, tile: 'field', near: true, group: 'Eau et vivres', desc: 'Donne du grain et du pain à chaque chapitre.' },
    enclos:    { name: 'Enclos de chèvres', cost: { palme: 3 }, obj: 'pen_goat', solid: true, group: 'Troupeaux', desc: 'Du lait à chaque chapitre.' },
    bergerie:  { name: 'Enclos de moutons', cost: { palme: 3 }, obj: 'pen_sheep', solid: true, group: 'Troupeaux', desc: 'De la laine pour les tapis.' },
    chamelier: { name: 'Enclos de chameaux', cost: { palme: 4, grain: 1 }, obj: 'pen_camel', solid: true, group: 'Troupeaux', desc: 'La caravane rapporte de la pierre à chaque chapitre.' },
    mur:       { name: 'Mur de pisé', cost: { pise: 1 }, tile: 'bwall', solid: true, group: 'Mosquée', desc: 'Un bloc de terre crue. L’enceinte se monte bloc par bloc.' },
    sol:       { name: 'Dallage étoilé', cost: { pise: 1 }, tile: 'zsand', group: 'Mosquée', desc: 'Dallage géométrique.' },
    pilier:    { name: 'Pilier de palmier', cost: { palme: 1 }, obj: 'trunkcol', solid: true, group: 'Mosquée', desc: 'Un tronc dressé, comme à Médine.' },
    mihrab:    { name: 'Niche de qibla', cost: { pise: 2, pierre: 1 }, tile: 'mihrab', solid: true, group: 'Mosquée', desc: 'Indique la direction de La Mecque.' },
    natte:     { name: 'Natte de prière', cost: { palme: 1 }, obj: 'mat', group: 'Mosquée', desc: 'Dans une mosquée achevée, on y prie et le groupe s’y repose.' },
    tapis:     { name: 'Tapis', cost: { laine: 1 }, obj: 'rug', group: 'Mosquée', desc: 'Laine tissée, à losanges.' },
    lanterne:  { name: 'Lanterne', cost: { pierre: 1 }, obj: 'lantern', solid: true, light: true, group: 'Mosquée', desc: 'Éclaire la nuit.' },
    rosace:    { name: 'Rosace', cost: { pierre: 2 }, decal: true, group: 'Mosquée', desc: 'Étoile à huit branches tracée au sol.' }
  };

  // v2 — piliers de la Citadelle, moments de prière, pistes musicales
  D.PILLARS = { priere: { name: 'Prière', glyph: '◠' }, savoir: { name: 'Savoir', glyph: '✧' }, justice: { name: 'Justice', glyph: '⚖' }, lien: { name: 'Lien', glyph: '∞' } };
  D.PRAYERS = { fajr: 'Fajr · l’aube', dhuhr: 'Dhuhr · le midi', asr: "'Asr · l’après-midi", maghrib: 'Maghrib · le couchant', isha: "'Ishâ · la nuit" };
  D.TRACKS = ['titre', 'chaine', 'medine', 'nuit', 'desert', 'camp', 'rome', 'palais', 'mer', 'noos', 'cite', 'citadelle', 'combat', 'boss', 'vice', 'victoire', 'deuil', 'espoir', 'conseil', 'lame', 'rencontre', 'silence'];
  D.WAVES = ['pulse', 'square', 'triangle', 'saw', 'sine', 'pluck', 'harp', 'flute', 'strings', 'pad', 'brass', 'bass', 'contra', 'bell', 'timp', 'drums'];

  // poses des personnages : l'émotion se lit dans le corps — et, pour qui a un visage (pas un Compagnon), aussi sur son
  // visage (dessin : sprites.js). Les six d'avant, puis les attitudes de la 2.18 (D.ATTITUDES ; décision du décideur, 19
  // novembre : « toutes, avec retenue ») : la joie, le rire, l'acquiescement, le refus, la réflexion, la colère, la
  // tristesse, s'asseoir, montrer du doigt. Un Compagnon les prend toutes, par le corps seul et avec retenue (la joie ne
  // lève pas les bras au-dessus de la tête, le rire se limite aux épaules, la colère reste un corps tendu) ; une attitude
  // choisit sa mimique pour qui a un visage (sprites.js, MIMIQUE_DE). L'opération de script « emote » les accepte toutes.
  D.ATTITUDES = ['joie', 'rire', 'acquiesce', 'refus', 'reflexion', 'colere', 'triste', 'assis', 'montre'];
  D.POSES = ['prie', 'resolu', 'accable', 'salut', 'surpris', 'garde'].concat(D.ATTITUDES);

  D.CODEX_CATS = ['Biographie', 'Événement', 'Noosphère', 'Lieu', 'Parole', 'Cœur', 'Objets'];

  /* ---------- Le personnage du joueur (2.0) ----------
     Les tenues du râwî (ses « ensembles ») : des silhouettes faites des coiffes, des manteaux et des couleurs que
     sprites.js dessine déjà. La première est sa tenue de toujours, à l'identique. Une tenue ne change que l'étoffe, la
     coupe et la couleur : le visage du râwî (2.x : il en a un, comme tout personnage de fiction) reste le même sous
     chacune. Le nom, lui, est contrôlé par perso.js. */
  D.TENUES = [
    { id: 'archives', nom: 'Manteau des Archives', look: { kind: 'cyber', robe: '#2a3048', head: '#1c2030', cloak: '#39424f' } },
    { id: 'encre',    nom: 'Capuche d’encre',      look: { kind: 'cyber', robe: '#1d2b36', head: '#131d26', cloak: '#2b4656', trim: '#39e6ff' } },
    { id: 'ruelle',   nom: 'Veste de la ruelle',   look: { kind: 'cyber', robe: '#3b2c4a', head: '#251a31', cloak: '#4e3b60', manteau: 'aucun', trim: '#ff4fd8' } },
    { id: 'copiste',  nom: 'Écharpe du copiste',   look: { kind: 'cyber', robe: '#2d3b34', head: '#1d2722', cloak: '#3f4e45', echarpe: true, trim: '#7dffb0' } },
    { id: 'veilleur', nom: 'Manteau du veilleur',  look: { kind: 'cyber', robe: '#3b3027', head: '#2a221b', cloak: '#57473a', manteau: 'ample', trim: '#ffe08a' } },
    { id: 'lettre',   nom: 'Calotte du lettré',    look: { kind: 'cyber', coiffe: 'calotte', robe: '#27344a', head: '#d8d2c4', cloak: '#3f4f66', manteau: 'epaule', trim: '#39e6ff' } }
  ];
  /* ---------- Le râwî composé (2.x) ----------
     Ce que le joueur change à son râwî, pièce par pièce, par-dessus l'ensemble qu'il a pris (D.TENUES) : le teint, la
     barbe et son poil ; la coiffe, la coupe, la longueur de la robe ; l'étoffe et le néon ; un objet porté. Rien que ce
     que sprites.js dessine déjà. Des identifiants neutres, des couleurs sans nom : aucun choix ne se dit en mots, aucun ne
     renvoie à une origine (exigences 2 et 10) ; la partie garde l'identifiant (profil.compo), jamais une couleur. On n'en
     réordonne aucun et l'on ajoute à la fin ; on n'en retire que sur décision du décideur — une partie qui portait un choix
     retiré l'oublie, sans erreur (perso.js). (Palettes proposées par l'agent, à valider par le décideur.)
     Choix simplifiés avec le nouveau dessin d'Idris (choix validés par le décideur, 19 novembre : deux coupes — puis une
     seule, le long manteau : « supprime les choix d'Idris sans manteau, c'est une catastrophe », le même jour —, trois
     coiffes, la besace à la hanche dans l'habit, la lanterne en option) : sont retirés le turban haut (imama_haute), les
     coupes « sur une épaule » et « ample » (deux ensembles les portent encore : le grand personnage les dessine en long
     manteau), l'écharpe (elle fait partie de l'habit) et la besace en bandoulière (celle de la hanche la remplace).
       teints   une gamme continue, du plus clair au plus sombre : les cinq teints du moteur, puis deux plus sombres
                (t3 : celui d'Idris). TEINTS, que lisent tous les autres personnages, ne change pas.
       barbes   celles que le moteur dessine : glabre (Idris — décision du décideur, pilote du nouveau dessin ; avant :
                courte), courte, pleine — pour un adulte ; poils : ni gris ni blanc, ce serait l'âge (p2 : Idris)
       coiffes  la capuche, la calotte, et (D193) le chèche (litham), sous lequel on ne voit que les yeux — des coiffes
                que le moteur dessine déjà, dans toutes les tailles (le turban haut, retiré avec le nouveau dessin :
                le long manteau, qui est l'habit même, ne pouvait aller avec lui).
                Écartés : le turban des Compagnons (imama), le turban large et bas ('Umar, 'Uthmân, Qays : l'un d'eux le
                porte sombre, comme le serait celui du râwî), le turban à pan (trois Compagnons, et Maître Yûnus, qui
                marche avec le râwî) ; le keffieh et la tiare, qui disent dans le jeu les gens des tribus et les Perses
                (exigence 10) — la tiare est aussi celle du Régent de 2084, et son galon est doré ; les casques et la
                coiffe de mailles, qui sont de l'équipement
       sans     ce qu'une coiffe ne prend pas, pour qu'aucune composition ne donne la silhouette d'un Compagnon des
                récits ni celle de Sâlim : la coupe qu'elle a chez eux (manteau), l'étoffe claire qui en ferait un
                turban de Compagnon (etoffe) ; sous le chèche, ni la claire ni la verte — de dos, dans le petit
                personnage, il a le gabarit même du turban des Compagnons, et vert, ce serait 'Alî, son turban sombre
                et sa robe verte (relecture de D193). Le joueur qui touche une coiffe la prend, et ce qui n'allait pas avec
                elle cède sous ses yeux ; tant qu'il la porte, la coupe ou l'étoffe qui n'irait pas avec elle
                s'éteint (perso.js). Et sous le turban et le chèche, le bandeau du râwî est fait de ses deux néons :
                de dos, où l'on ne voit ni son visage ni le néon de sa poitrine, la marque de 2084 (sprites.js)
       etoffes  des étoffes harmonisées — robe, coiffe, manteau, jambes : celles des six ensembles, et une de plus ;
                dessin : leurs couleurs sur le grand personnage du râwî (e1 : relevées sur la maquette ; les autres,
                proposées par l'agent, à valider)
       neons    la bande et la ceinture qui éclairent l'habit [bande, ceinture] ; le liseré suit la bande. Ni or ni jaune ;
                aucune n'est la couleur d'un rayonnement (D.RAYONS). Sans choix : le néon de l'ensemble.
       objets   un objet ordinaire de 2084, sans effet, rangé hors de l'équipement (look.porte) : une lanterne à la main
                (la besace est à la hanche, dans l'habit : la besace en bandoulière n'est plus proposée). Rien de ce qui est une arme, une pièce d'équipement, la marque
                d'une figure de 2084 ou l'attribut d'un Compagnon (D193 : les feuillets, ceux de Zayd ibn Thâbit et
                d'Ibn 'Abbâs, sont retirés — une partie qui les portait revient à « rien ») */
  const MAQUETTE = { tunique: ['#e8d6b4', '#b59b77'], chausses: ['#dac7a2', '#b09675', '#8c7255'], echarpe: ['#d0865a', '#ad533d', '#7e362e'] };   // relevées sur la maquette
  D.RAWI = {
    teints: { t1: '#ecc49a', t2: '#deab7c', t3: '#cb9566', t4: '#b47d50', t5: '#9a6540', t6: '#7e5034', t7: '#5f3a24' },
    barbes: [0, 1, 2],
    poils: { p1: '#121014', p2: '#2c1e17', p3: '#6b4a2e' },
    coiffes: ['capuche', 'calotte', 'litham'],
    sans: {
      capuche: { longue: [true] },                           // avec la robe longue, l'habit des moines du jeu (Frère Cyprien, les moines des récits)
      calotte: { manteau: ['aucun'] },                       // Sâlim, Abû 'Ubayda, Aslam, Zayd ibn Thâbit — la coupe ne se choisit plus, mais la veste de
                                                             // la ruelle est sans manteau : sous la calotte, elle prend le long manteau
      litham: { etoffe: ['e6', 'e4'] }                       // de dos, le turban des Compagnons : clair, l'un d'eux ; vert, 'Alî
    },
    manteaux: ['long'],                                      // le long manteau seul : la coupe « sans manteau » est retirée (décideur, 19 novembre)
    // 2.x (le nouveau dessin d'Idris, d'après la maquette du décideur ; depuis la 2.18, le passeur) — dessin : les couleurs de
    // l'étoffe sur le grand personnage du râwî (sprites.js, paletteIdris : la capuche et le manteau ; e1 garde les tons d'office) — la capuche (et la calotte, le chèche), le manteau, la tunique, les
    // chausses, l'écharpe : trois tons (la lumière, le corps, l'ombre), dont le moteur tire ses cinq, ou une couleur seule,
    // dont il tire les trois. e1 : relevées sur la maquette ; e2 à e7 : proposées par l'agent (la couleur de l'ensemble,
    // avivée en lumière comme sur la maquette), à valider par le décideur. La tunique, les chausses et l'écharpe rouille
    // restent celles de la maquette ; l'étoffe grise garde ses jambes sombres. Une étoffe sans dessin garderait le dessin d'avant.
    etoffes: {
      e1: { robe: '#2a3048', head: '#1c2030', cloak: '#39424f', dessin: {
        capuche: ['#3a7b90', '#22536b', '#16314a'], manteau: ['#33758a', '#1e4b63', '#142c44'], tunique: ['#e8d6b4', '#b59b77'],
        chausses: ['#dac7a2', '#b09675', '#8c7255'], echarpe: ['#d0865a', '#ad533d', '#7e362e'] } },
      e2: { robe: '#1d2b36', head: '#131d26', cloak: '#2b4656', dessin: Object.assign({ capuche: ['#2a4c7c', '#1b3150', '#122136'], manteau: ['#325a8f', '#203a5c', '#16273f'] }, MAQUETTE) },
      e3: { robe: '#3b2c4a', head: '#251a31', cloak: '#4e3b60', dessin: Object.assign({ capuche: ['#604788', '#3e2e58', '#2a1f3c'], manteau: ['#73579e', '#4a3866', '#322645'] }, MAQUETTE) },
      e4: { robe: '#2d3b34', head: '#1d2722', cloak: '#3f4e45', dessin: Object.assign({ capuche: ['#4e735d', '#324a3c', '#223229'], manteau: ['#5a8569', '#3a5644', '#273a2e'] }, MAQUETTE) },
      e5: { robe: '#3b3027', head: '#2a221b', cloak: '#57473a', dessin: Object.assign({ capuche: ['#7f6249', '#523f2f', '#382b20'], manteau: ['#927357', '#5e4a38', '#403226'] }, MAQUETTE) },
      e6: { robe: '#27344a', head: '#d8d2c4', cloak: '#3f4f66', dessin: Object.assign({ capuche: ['#d9d3c6', '#cfc8b8', '#a29c8d'], manteau: ['#627ca1', '#3f5068', '#2b3647'] }, MAQUETTE) },
      e7: { robe: '#7d8492', head: '#5a606c', cloak: '#a9aeb8', legs: '#3a3c44', dessin: Object.assign({ capuche: ['#929bae', '#5e6470', '#40444c'], manteau: ['#b0b6c2', '#8a909c', '#5e626a'] }, MAQUETTE, { chausses: ['#51545f', '#3a3c44', '#2c2d33'] }) }
    },
    neons: { n1: ['#ff4fd8', '#39e6ff'], n2: ['#7dffb0', '#39e6ff'], n3: ['#b18cff', '#7dffb0'], n4: ['#ff6b6b', '#39e6ff'], n5: ['#e8f4ff', '#ff4fd8'] },
    objets: ['lanterne']
  };

  /* ---------- Les paquets (2.0) ----------
     Un paquet est un document de données pures (JSON) qui ajoute du contenu au jeu de base :
       { id, version, moteur, titre, note, livres, sagas, lieux, objets, equipement, etals, pistes }
     Il ajoute, il ne remplace rien : un identifiant déjà pris ne se redéclare pas. Le contrat est dans v2/docs/schema-paquet.md.
     Les fonctions ci-dessous servent au jeu (ISNAD.registerPack) comme au contrôle (regles.js) : même lecture des deux côtés. */
  D.MOTEUR = 1;                                   // ce que ce moteur sait lire d'un paquet ; il monte quand un paquet peut dire davantage
  D.LIVRES = { 1: { titre: 'Les cinq Lumières' } };   // les livres de la Chaîne ; le titre ne s'affiche que s'il y en a plusieurs
  const estObjet = v => !!v && typeof v === 'object' && !Array.isArray(v);
  const texte = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= (max || 400);
  D.paquet = {
    CLES: ['id', 'version', 'moteur', 'titre', 'note', 'livres', 'sagas', 'lieux', 'objets', 'equipement', 'etals', 'pistes'],
    ID: /^[a-z][a-z0-9_]{1,39}$/,
    // les tables qu'un paquet étend, copiées : un contrôle ne doit jamais atteindre celles du jeu
    tables() {
      const C = Object.create(D); ['MAPS', 'ITEMS', 'GEAR', 'LIVRES'].forEach(k => { C[k] = Object.assign({}, D[k]); });
      C.GEAR_SHOPS = {}; Object.keys(D.GEAR_SHOPS).forEach(k => { C.GEAR_SHOPS[k] = D.GEAR_SHOPS[k].slice(); });
      C.TRACKS = D.TRACKS.slice(); return C;
    },
    // Ce qui interdit de poser le paquet : sa forme, le moteur qu'il demande, un identifiant déjà pris. → [refus]
    // T : les tables (D, ou une copie) ; pris : { paquets, sagas } — ce qui est déjà posé, par identifiant.
    refus(p, T, pris) {
      const R = [], ID = D.paquet.ID, P = pris || {};
      if (!estObjet(p)) return ['un paquet est un objet : { id, version, moteur, … }'];
      if (typeof p.id !== 'string' || !ID.test(p.id)) return ['id : des minuscules, des chiffres ou « _ », une lettre d’abord, 2 à 40 signes'];
      if (p.id === 'base') R.push('id « base » : réservé au jeu de base');
      if ((P.paquets || {})[p.id]) R.push(`le paquet « ${p.id} » est déjà posé`);
      if (!(Number.isInteger(p.version) && p.version >= 1)) R.push('version : un entier, 1 ou plus');
      if (!(Number.isInteger(p.moteur) && p.moteur >= 1)) R.push('moteur : un entier, 1 ou plus');
      else if (p.moteur > T.MOTEUR) return [`ce paquet demande le moteur ${p.moteur} ; ce jeu a le moteur ${T.MOTEUR} : il lui faut une version plus récente du jeu`];
      Object.keys(p).forEach(k => { if (!D.paquet.CLES.includes(k)) R.push(`clé « ${k} » inconnue (${D.paquet.CLES.join(', ')})`); });
      if (p.titre !== undefined && !texte(p.titre, 80)) R.push('titre : un texte de 80 signes au plus');
      if (p.note !== undefined && typeof p.note !== 'string') R.push('note : un texte');
      const table = (cle, fn) => { const v = p[cle]; if (v === undefined) return; if (!estObjet(v)) { R.push(`${cle} : attend un objet { identifiant: … }`); return; }
        Object.keys(v).forEach(id => { if (!estObjet(v[id]) && cle !== 'etals') { R.push(`${cle}.${id} : attend un objet`); return; } fn(id, v[id], cle + '.' + id); }); };
      const idOk = (id, w) => { if (!ID.test(id)) { R.push(`${w} : identifiant invalide (minuscules, chiffres, « _ »)`); return false; } return true; };
      const pistes = estObjet(p.pistes) ? p.pistes : {}, lieux = estObjet(p.lieux) ? p.lieux : {}, pieces = estObjet(p.equipement) ? p.equipement : {}, objets = estObjet(p.objets) ? p.objets : {};
      // les livres : un numéro, un titre ; un livre déjà déclaré garde son titre
      table('livres', (n, l, w) => { if (!/^[1-9][0-9]?$/.test(n)) { R.push(`${w} : un livre porte un numéro, de 1 à 99`); return; }
        if (!texte(l.titre, 60)) R.push(`${w} : titre manquant (60 signes au plus)`);
        else if (T.LIVRES[n] && T.LIVRES[n].titre !== l.titre) R.push(`${w} : ce livre existe déjà sous le titre « ${T.LIVRES[n].titre} »`); });
      // les sagas : une liste ; chaque identifiant est neuf
      if (p.sagas !== undefined) { if (!Array.isArray(p.sagas)) R.push('sagas : attend une liste');
        else { const vus = {}; p.sagas.forEach((s, i) => { const w = `sagas[${i}]`; if (!estObjet(s) || typeof s.id !== 'string') { R.push(`${w} : une saga est un objet qui porte un id`); return; }
          if (!idOk(s.id, w)) return; if ((P.sagas || {})[s.id]) R.push(`${w} : la saga « ${s.id} » existe déjà`); if (vus[s.id]) R.push(`${w} : saga « ${s.id} » déclarée deux fois`); vus[s.id] = 1;
          if (!Array.isArray(s.chapters) && !s.commun) R.push(`${w} : chapters manquant`); }); } }
      // les pistes : un nom neuf, de quoi jouer
      table('pistes', (n, d, w) => { if (!idOk(n, w)) return; if (T.TRACKS.includes(n)) R.push(`${w} : la piste « ${n} » existe déjà`);
        if (typeof d.bpm !== 'number' || typeof d.beats !== 'number' || !Array.isArray(d.voices) || d.voices.some(v => !estObjet(v) || typeof v.notes !== 'string')) R.push(`${w} : attend { bpm, beats, voices: [{ wave, vol, notes }] }`); });
      // les lieux : un gabarit connu, un nom
      table('lieux', (id, l, w) => { if (!idOk(id, w)) return; if (T.MAPS[id]) R.push(`${w} : le lieu « ${id} » existe déjà`);
        const g = T.GABARITS[l.gabarit]; if (!g) { R.push(`${w} : gabarit « ${l.gabarit} » inconnu (${Object.keys(T.GABARITS).join(', ')})`); return; }
        if (g.reserve) { R.push(`${w} : le gabarit « ${l.gabarit} » est réservé au jeu`); return; }   // 2.29 : la carte du monde
        Object.keys(l).forEach(k => { if (!['gabarit', 'nom', 'variante', 'piste', 'noms'].includes(k)) R.push(`${w} : clé « ${k} » inconnue (gabarit, nom, variante, piste, noms)`); });
        if (!texte(l.nom, 40)) R.push(`${w} : nom manquant (40 signes au plus)`);
        if (l.variante !== undefined && !(g.variantes || []).includes(l.variante)) R.push(`${w} : variante « ${l.variante} » inconnue pour ce gabarit (${(g.variantes || []).join(', ') || 'aucune'})`);
        if (l.piste !== undefined && !(T.TRACKS.includes(l.piste) || pistes[l.piste])) R.push(`${w} : piste « ${l.piste} » inconnue`);
        if (l.noms !== undefined) { if (!estObjet(l.noms)) R.push(`${w} : noms attend { lieu: 'nom' }`);
          else Object.keys(l.noms).forEach(k => { if (!g.spots.includes(k)) R.push(`${w} : noms.${k} — ce gabarit n'a pas ce lieu (${g.spots.join(', ')})`); else if (!(l.noms[k] === null || texte(l.noms[k], 30))) R.push(`${w} : noms.${k} attend un nom (30 signes au plus), ou null pour ne pas l'afficher`); }); } });
      // les objets de la besace et les pièces d'équipement : un identifiant neuf, dans les deux tables à la fois
      const neuf = (id, w) => { if (T.ITEMS[id] || T.GEAR[id]) { R.push(`${w} : « ${id} » existe déjà`); return false; } return true; };
      table('objets', (id, o, w) => { if (!idOk(id, w) || !neuf(id, w)) return; if (!texte(o.name, 40) || !texte(o.desc, 160)) R.push(`${w} : name (40 signes) et desc (160 signes) attendus`); });
      table('equipement', (id, g, w) => { if (!idOk(id, w) || !neuf(id, w)) return; if (objets[id]) R.push(`${w} : « ${id} » est aussi déclaré dans objets`);
        if (!T.GEAR_TYPES[g.t]) R.push(`${w} : famille « ${g.t} » inconnue (${Object.keys(T.GEAR_TYPES).join(', ')}) — une nouvelle famille se dessine dans le moteur`);
        if (!(Number.isInteger(g.r) && g.r >= 0 && g.r < T.GEAR_PRIX.length)) R.push(`${w} : rang r de 0 à ${T.GEAR_PRIX.length - 1}`);
        if (!texte(g.name, 40) || !texte(g.desc, 160)) R.push(`${w} : name (40 signes) et desc (160 signes) attendus`);
        if (!Array.isArray(g.c) || g.c.length !== 2 || g.c.some(c => !/^#[0-9a-f]{6}$/i.test(c))) R.push(`${w} : c attend deux couleurs #rrggbb`); });
      // les étals : un lieu qui a un comptoir, des pièces qui existent
      table('etals', (m, liste, w) => { const L = T.MAPS[m] || (lieux[m] && T.GABARITS[lieux[m].gabarit] ? { spots: T.GABARITS[lieux[m].gabarit].spots } : null);
        if (!L) { R.push(`${w} : lieu « ${m} » inconnu`); return; } if (!L.spots.includes('comptoir')) R.push(`${w} : ce lieu n'a pas de comptoir`);
        if (!Array.isArray(liste) || !liste.length) { R.push(`${w} : attend une liste de pièces`); return; }
        liste.forEach(id => { if (!(T.GEAR[id] || pieces[id])) R.push(`${w} : pièce « ${id} » inconnue`); else if ((T.GEAR_SHOPS[m] || []).includes(id) || liste.indexOf(id) !== liste.lastIndexOf(id)) R.push(`${w} : « ${id} » est déjà à cet étal`); }); });
      return R;
    },
    // Pose dans les tables T ce que le paquet déclare. À n'appeler que si refus() n'a rien trouvé. Les sagas et le son de
    // chaque piste se posent dans le jeu (ISNAD.registerPack) : ici, seulement les énumérations.
    poser(p, T) {
      Object.keys(p.livres || {}).forEach(n => { if (!T.LIVRES[n]) T.LIVRES[n] = { titre: p.livres[n].titre, paquet: p.id }; });
      Object.keys(p.pistes || {}).forEach(n => { T.TRACKS.push(n); });
      Object.keys(p.lieux || {}).forEach(id => { const l = p.lieux[id]; T.MAPS[id] = D.lieu(l.nom, l.gabarit, { variante: l.variante, piste: l.piste, noms: l.noms, paquet: p.id }); });
      Object.keys(p.objets || {}).forEach(id => { T.ITEMS[id] = Object.assign({}, p.objets[id], { paquet: p.id }); });
      Object.keys(p.equipement || {}).forEach(id => { T.GEAR[id] = Object.assign({}, p.equipement[id], { paquet: p.id }); });
      Object.keys(p.etals || {}).forEach(m => { T.GEAR_SHOPS[m] = (T.GEAR_SHOPS[m] || []).concat(p.etals[m]); });
    }
  };

  root.ISNAD_DEFS = D;
  if (typeof module !== 'undefined' && module.exports) module.exports = D;
})(typeof window !== 'undefined' ? window : globalThis);
