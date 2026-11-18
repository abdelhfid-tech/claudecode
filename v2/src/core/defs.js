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
    frapper: { nom: 'Frapper la faille' }, vertus: { nom: 'Les vertus' }, garde: { nom: 'La garde et la Niyya' }, objets: { nom: 'La besace' },
    halte: { nom: 'La halte', geste: true }, source: { nom: 'Retrouver une source' }, equipement: { nom: 'S’équiper' }, etoiles: { nom: 'S’orienter aux étoiles', geste: true },
    frappe: { nom: 'Frapper ce qui rôde' }, postures: { nom: 'Prendre une figure' }
  };

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

  // Effets (fx.st)
  D.FX = ['atk', 'mag', 'def', 'spd', 'stun', 'doute', 'waswas', 'regen', 'garde', 'reveal',
          'cleanse', 'dispel', 'veil', 'niyya', 'sakina', 'taunt'];

  D.NPC_KINDS = ['homme', 'ancien', 'soldat', 'romain', 'perse', 'moine', 'enfant', 'compagnon', 'marin', 'cyber', 'savant', 'marchand', 'berbere', 'bedouin'];

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
    cite:      { nom: 'Cité-Miroir',     theme: 'cyber',  dehors: false, piste: 'cite',      spots: ['rue', 'ecran', 'ruelle', 'ascenseur', 'parvis'] },
    archives:  { nom: 'Archives basses', theme: 'cyber',  dehors: false, piste: 'chaine',    spots: ['entree', 'rayonnages', 'bureau', 'chaine', 'priere'] }
  };
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
    archives:  D.lieu('Archives basses', 'archives')
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

  // poses des personnages : l'émotion se lit dans le corps, jamais sur un visage (dessin : sprites.js)
  D.POSES = ['prie', 'resolu', 'accable', 'salut', 'surpris', 'garde'];

  D.CODEX_CATS = ['Biographie', 'Événement', 'Noosphère', 'Lieu', 'Parole', 'Cœur', 'Objets'];

  /* ---------- Le personnage du joueur (2.0) ----------
     Les tenues du râwî : des silhouettes faites des coiffes, des manteaux et des couleurs que sprites.js dessine déjà.
     La première est sa tenue de toujours, à l'identique. Personne n'a de visage (exigence 2) : une tenue ne change que
     l'étoffe, la coupe et la couleur. Le nom, lui, est contrôlé par perso.js. */
  D.TENUES = [
    { id: 'archives', nom: 'Manteau des Archives', look: { kind: 'cyber', robe: '#2a3048', head: '#1c2030', cloak: '#39424f' } },
    { id: 'encre',    nom: 'Capuche d’encre',      look: { kind: 'cyber', robe: '#1d2b36', head: '#131d26', cloak: '#2b4656', trim: '#39e6ff' } },
    { id: 'ruelle',   nom: 'Veste de la ruelle',   look: { kind: 'cyber', robe: '#3b2c4a', head: '#251a31', cloak: '#4e3b60', manteau: 'aucun', trim: '#ff4fd8' } },
    { id: 'copiste',  nom: 'Écharpe du copiste',   look: { kind: 'cyber', robe: '#2d3b34', head: '#1d2722', cloak: '#3f4e45', echarpe: true, trim: '#7dffb0' } },
    { id: 'veilleur', nom: 'Manteau du veilleur',  look: { kind: 'cyber', robe: '#3b3027', head: '#2a221b', cloak: '#57473a', manteau: 'ample', trim: '#ffe08a' } },
    { id: 'lettre',   nom: 'Calotte du lettré',    look: { kind: 'cyber', coiffe: 'calotte', robe: '#27344a', head: '#d8d2c4', cloak: '#3f4f66', manteau: 'epaule', trim: '#39e6ff' } }
  ];

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
