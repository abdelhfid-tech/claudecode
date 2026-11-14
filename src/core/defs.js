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

  D.NPC_KINDS = ['homme', 'ancien', 'soldat', 'romain', 'perse', 'moine', 'enfant', 'compagnon', 'marin', 'cyber', 'savant', 'marchand', 'berbere'];

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

  D.ITEMS = {
    dattes: { name: 'Dattes de Médine', desc: 'Rend 40 % de Constance à un compagnon.',              hp: 0.4,  target: 'ally' },
    eau:    { name: "Outre d'eau",      desc: 'Rend 80 % de Constance à un compagnon.',              hp: 0.8,  target: 'ally' },
    pain:   { name: "Pain d'orge",      desc: 'Rend 25 % de Constance à tout le groupe.',            hp: 0.25, target: 'allies' },
    miel:   { name: 'Miel',             desc: 'Dissipe les altérations et rend 30 % de Constance.',  hp: 0.3,  cleanse: true, target: 'ally' },
    musc:   { name: 'Musc',             desc: 'Rend 50 % de Souffle à un compagnon.',                sp: 0.5,  target: 'ally' },
    lait:   { name: 'Lait chaud',       desc: 'Relève un compagnon éprouvé (50 % de Constance).',    revive: 0.5, target: 'ally' },
    siwak:  { name: 'Siwâk',            desc: 'Accorde 2 points de Niyya.',                          niyya: 2, target: 'ally' }
  };

  // Opérations de script autorisées : nom -> [min args, max args]
  D.OPS = {
    say: [2, 2], nar: [1, 1], quote: [2, 2], title: [1, 2], choice: [2, 2], ask: [2, 2],
    battle: [1, 1], map: [2, 3], tp: [2, 2], walk: [2, 2], face: [2, 2], show: [1, 1], hide: [1, 1],
    fade: [1, 2], wait: [1, 1], shake: [0, 1], flash: [0, 1], sfx: [1, 1], amb: [1, 1],
    give: [1, 2], join: [1, 1], leave: [1, 1], codex: [1, 1], heal: [0, 0],
    flag: [1, 2], if: [2, 3], tint: [1, 1], light: [1, 1],
    pray: [0, 1], parley: [1, 1], pillar: [2, 2], mus: [1, 1], mat: [1, 2], site: [1, 1], lore: [1, 1], raid: [0, 1]
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
  D.TRACKS = ['titre', 'chaine', 'medine', 'nuit', 'desert', 'camp', 'rome', 'palais', 'mer', 'noos', 'cite', 'citadelle', 'combat', 'boss', 'victoire', 'deuil', 'espoir', 'conseil', 'silence'];
  D.WAVES = ['pulse', 'square', 'triangle', 'saw', 'sine', 'pluck', 'flute', 'strings', 'bell', 'drums'];

  D.CODEX_CATS = ['Biographie', 'Événement', 'Noosphère', 'Lieu', 'Parole'];

  root.ISNAD_DEFS = D;
  if (typeof module !== 'undefined' && module.exports) module.exports = D;
})(typeof window !== 'undefined' ? window : globalThis);
