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

  // Formes procédurales des égrégores (aucun être animé figuratif : formes abstraites).
  D.ART = ['wisp', 'mask', 'eagle', 'crown', 'throne', 'tower', 'lens', 'mirror', 'swarm',
           'idol', 'scale', 'blade', 'wave', 'banner', 'colossus'];

  D.ANIMS = ['slash', 'light', 'burst', 'wave', 'pillar', 'glyph', 'heal', 'guard', 'dark'];

  D.TARGETS = ['foe', 'foes', 'ally', 'allies', 'self'];

  // Effets (fx.st)
  D.FX = ['atk', 'mag', 'def', 'spd', 'stun', 'doute', 'waswas', 'regen', 'garde', 'reveal',
          'cleanse', 'dispel', 'veil', 'niyya', 'sakina', 'taunt'];

  D.NPC_KINDS = ['homme', 'ancien', 'soldat', 'romain', 'perse', 'moine', 'enfant', 'compagnon', 'marin', 'cyber', 'savant', 'marchand', 'berbere', 'bedouin'];

  D.BATTLE_BG = ['noos', 'desert', 'ville', 'camp', 'romaine', 'palais', 'mer', 'cite'];

  D.TIMES = ['day', 'dusk', 'night', 'dawn'];

  D.SFX = ['duff', 'tek', 'roll', 'hit', 'break', 'light', 'wind', 'door', 'crowd', 'wave', 'glitch', 'blip'];
  D.AMB = ['vent', 'nuit', 'foule', 'feu', 'mer', 'noos', 'cite', 'silence', 'bataille'];

  // Cartes disponibles et leurs lieux nommés (spots).
  const VILLE = ['mosquee_cour', 'mosquee_porte', 'place', 'souk', 'halle', 'maison', 'puits',
                 'palmeraie', 'porte_nord', 'porte_sud', 'enclos', 'colline', 'priere', 'ecole', 'comptoir'];
  D.MAPS = {
    medine:   { label: 'Médine',            spots: VILLE },
    koufa:    { label: 'Koufa',             spots: VILLE },
    desert:   { label: 'Désert',            spots: ['depart', 'dunes', 'rochers', 'oasis', 'source', 'caravane', 'crete', 'ruines', 'arrivee', 'priere', 'comptoir'] },
    camp:     { label: 'Camp',              spots: ['entree', 'tente_chef', 'feu', 'etendard', 'lignes', 'enclos', 'tertre', 'tentes', 'priere', 'comptoir'] },
    romaine:  { label: 'Cité romaine',      spots: ['porte', 'cardo', 'forum', 'basilique', 'esplanade', 'palais', 'fontaine', 'remparts', 'jardin', 'marche', 'priere', 'quartier', 'comptoir'] },
    palais:   { label: 'Palais',            spots: ['entree', 'nef', 'trone', 'tresor', 'colonnade', 'jardin', 'priere'] },
    navire:   { label: 'Navire',            spots: ['poupe', 'pont', 'mat', 'proue', 'passerelle', 'pont2', 'priere'] },
    noos:     { label: 'Noosphère',         spots: ['seuil', 'noeud1', 'noeud2', 'noeud3', 'faille', 'miroir', 'coeur'] },
    citadelle:{ label: 'La Citadelle',      spots: ['porte', 'cour', 'puits', 'remparts', 'tour', 'salle', 'mosquee', 'priere', 'ecole', 'souk', 'jardin', 'greniers', 'palmeraie', 'poterne', 'comptoir'] },
    cite:     { label: 'Cité-Miroir',       spots: ['rue', 'ecran', 'ruelle', 'ascenseur', 'parvis'] },
    archives: { label: 'Archives basses',   spots: ['entree', 'rayonnages', 'bureau', 'chaine', 'priere'] }
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
    rue: 'Rue', ecran: 'Grand écran', ruelle: 'Ruelle', ascenseur: 'Ascenseur', parvis: 'Parvis', rayonnages: 'Rayonnages', bureau: 'Bureau', chaine: 'La Chaîne'
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
    citadelle: ['epee_yemen', 'lance_samhari', 'massue', 'baton_ferre', 'houlette', 'calame_encrier', 'rondache', 'bouclier_lamt', 'lampe', 'cheche', 'casque_fer', 'burnous', 'matelassee', 'cotte']
  };

  // Opérations de script autorisées : nom -> [min args, max args]
  D.OPS = {
    say: [2, 2], nar: [1, 1], quote: [2, 2], title: [1, 2], choice: [2, 2], ask: [2, 2],
    battle: [1, 1], map: [2, 3], tp: [2, 2], walk: [2, 2], face: [2, 2], show: [1, 1], hide: [1, 1],
    fade: [1, 2], wait: [1, 1], shake: [0, 1], flash: [0, 1], sfx: [1, 1], amb: [1, 1],
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
    tranchee:  { name: 'Tranchée', cost: {}, tile: 'trench', group: 'Défendre', desc: 'Les égrégores qui rôdent ne la franchissent pas. Six segments gardent un lieu.' },
    puits:     { name: 'Puits', cost: { pierre: 4 }, obj: 'well', solid: true, group: 'Eau et vivres', desc: 'Donne de l’eau. Palmiers, champs et troupeaux en ont besoin à moins de six pas.' },
    palmier:   { name: 'Palmier', cost: { eau: 1 }, obj: 'palm', solid: true, near: true, group: 'Eau et vivres', desc: 'Un puits et trois palmiers font une oasis. Donne des dattes à chaque chapitre.' },
    champ:     { name: 'Champ d’orge', cost: { eau: 1, grain: 1 }, tile: 'field', near: true, group: 'Eau et vivres', desc: 'Donne du grain et du pain à chaque chapitre.' },
    enclos:    { name: 'Enclos de chèvres', cost: { palme: 3 }, obj: 'pen_goat', solid: true, group: 'Troupeaux', desc: 'Du lait à chaque chapitre.' },
    bergerie:  { name: 'Enclos de moutons', cost: { palme: 3 }, obj: 'pen_sheep', solid: true, group: 'Troupeaux', desc: 'De la laine pour les tapis.' },
    chamelier: { name: 'Enclos de chameaux', cost: { palme: 4, grain: 1 }, obj: 'pen_camel', solid: true, group: 'Troupeaux', desc: 'La caravane rapporte de la pierre à chaque chapitre.' },
    mur:       { name: 'Mur de pisé', cost: { pise: 1 }, tile: 'bwall', solid: true, group: 'Mosquée', desc: 'Un bloc de terre crue. L’enceinte se monte bloc par bloc.' },
    sol:       { name: 'Sol à étoiles', cost: { pise: 1 }, tile: 'zsand', group: 'Mosquée', desc: 'Dallage géométrique.' },
    pilier:    { name: 'Pilier de palmier', cost: { palme: 1 }, obj: 'trunkcol', solid: true, group: 'Mosquée', desc: 'Un tronc dressé, comme à Médine.' },
    mihrab:    { name: 'Niche de qibla', cost: { pise: 2, pierre: 1 }, tile: 'mihrab', solid: true, group: 'Mosquée', desc: 'Indique la direction de La Mecque.' },
    natte:     { name: 'Natte de prière', cost: { palme: 1 }, obj: 'mat', group: 'Mosquée', desc: 'Dans une mosquée achevée, on y prie et on y sauvegarde.' },
    tapis:     { name: 'Tapis', cost: { laine: 1 }, obj: 'rug', group: 'Mosquée', desc: 'Laine tissée, à losanges.' },
    lanterne:  { name: 'Lanterne', cost: { pierre: 1 }, obj: 'lantern', solid: true, light: true, group: 'Mosquée', desc: 'Éclaire la nuit.' },
    rosace:    { name: 'Rosace', cost: { pierre: 2 }, decal: true, group: 'Mosquée', desc: 'Étoile à huit branches tracée au sol.' }
  };

  // v2 — piliers de la Citadelle, moments de prière, pistes musicales
  D.PILLARS = { priere: { name: 'Prière', glyph: '◠' }, savoir: { name: 'Savoir', glyph: '✧' }, justice: { name: 'Justice', glyph: '⚖' }, lien: { name: 'Lien', glyph: '∞' } };
  D.PRAYERS = { fajr: 'Fajr · l’aube', dhuhr: 'Dhuhr · le midi', asr: '’Asr · l’après-midi', maghrib: 'Maghrib · le couchant', isha: '’Ishâ · la nuit' };
  D.TRACKS = ['titre', 'chaine', 'medine', 'nuit', 'desert', 'camp', 'rome', 'palais', 'mer', 'noos', 'cite', 'citadelle', 'combat', 'boss', 'vice', 'victoire', 'deuil', 'espoir', 'conseil', 'lame', 'rencontre', 'silence'];
  D.WAVES = ['pulse', 'square', 'triangle', 'saw', 'sine', 'pluck', 'harp', 'flute', 'strings', 'pad', 'brass', 'bass', 'contra', 'bell', 'timp', 'drums'];

  // poses des personnages : l'émotion se lit dans le corps, jamais sur un visage (dessin : sprites.js)
  D.POSES = ['prie', 'resolu', 'accable', 'salut', 'surpris', 'garde'];

  D.CODEX_CATS = ['Biographie', 'Événement', 'Noosphère', 'Lieu', 'Parole', 'Cœur', 'Objets'];

  root.ISNAD_DEFS = D;
  if (typeof module !== 'undefined' && module.exports) module.exports = D;
})(typeof window !== 'undefined' ? window : globalThis);
