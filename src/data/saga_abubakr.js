/* ISNAD — Saga I : Abû Bakr as-Siddîq (11–13 H · 632–634). Lumière : Véracité (sidq).
   Sources : al-Bukhârî, Muslim, Ibn Hishâm, at-Tabarî, Ibn Sa'd, Ibn Kathîr. Dialogues « say » dramatisés. */
ISNAD.registerSaga({
  id: 'abubakr', order: 1,
  name: "Abû Bakr as-Siddîq", epithet: 'As-Siddîq', arabic: 'أبو بكر',
  years: '11–13 H · 632–634',
  light: 'sidq', lightName: 'Véracité',
  ambiance: 'orientale',
  tagline: "Le jour où tout pouvait se défaire, un homme doux a dit le vrai.",

  intro: [
    ['amb', 'silence'],
    ['title', "Abû Bakr as-Siddîq", "Saga I · Le Véridique"],
    ['nar', "Râwî, voici le premier maillon. 'Abdallâh ibn Abî Quhâfa, marchand d'étoffes de La Mecque, que tous appelaient Abû Bakr. Un homme doux, prompt aux larmes ; parmi les tout premiers à croire."],
    ['nar', "Il donna sa fortune pour racheter des croyants opprimés. Sur la route de l'Hégire, il fut le compagnon de la Grotte, quand ils n'étaient que deux."],
    ['nar', "Un matin, La Mecque se moqua : le Messager d'Allah ﷺ disait avoir été mené de nuit jusqu'à Jérusalem. On courut chez Abû Bakr, certain de le voir vaciller."],
    ['quote', "S'il l'a dit, il a dit vrai.", "Abû Bakr — rapporté par Ibn Hishâm, as-Sîra"],
    ['nar', "De ce jour on l'appela as-Siddîq : celui qui tient pour vrai ce qui est vrai, quoi qu'il en coûte. C'est cette Lumière que tu viens chercher."],
    ['nar', "Trois idoles l'attendent dans la noosphère : le Déni, qui refuse la mort ; le Clan, qui déchire ; le Menteur, qui contrefait. La Chaîne s'ouvre au jour le plus sombre."]
  ],

  outro: [
    ['amb', 'silence'],
    ['nar', "Deux ans, trois mois et quelques jours. En ce peu de temps : l'Arabie rassemblée, le Coran recueilli, les armées en marche vers l'Irak et la Syrie. Puis la fièvre le prend, à l'été de l'an 13."],
    ['nar', "Il consulte les Compagnons, puis dicte à 'Uthmân son dernier acte : il désigne 'Umar. À ceux qui redoutent la rudesse de 'Umar, il répond qu'elle s'adoucira sous la charge."],
    ['nar', "Il fait rendre au Trésor ce qu'il en a reçu pour vivre. 'Umar pleure : « Qu'Allah fasse miséricorde à Abû Bakr ; il a épuisé ceux qui viendront après lui. »"],
    ['quote', "Lavez ces deux vêtements que je porte, et ensevelissez-moi dedans. Le vivant a plus besoin du neuf que le mort.", "Abû Bakr, sur son lit de mort — al-Bukhârî, as-Sahîh"],
    ['nar', "Il s'éteint le 22 Jumâdâ al-Âkhira de l'an 13, à soixante-trois ans. On l'enterre de nuit, auprès du Messager d'Allah ﷺ, qu'il avait suivi en tout."],
    ['nar', "Râwî, voici la première Lumière. La Véracité : ne pas adorer le messager à la place de Celui qui l'envoie ; ne rien retrancher du vrai par peur ; ne rien y contrefaire pour plaire."],
    ['sfx', 'light'],
    ['flash', '#ffe08a'],
    ['light', 'sidq']
  ],

  /* ───────────────────────────── HÉROS ───────────────────────────── */
  heroes: {
    abubakr: {
      name: "Abû Bakr", title: 'As-Siddîq', arabic: 'أبو بكر',
      role: 'sage', el: 'sidq',
      look: { robe: '#e9e2d0', head: '#f4f0e6', cloak: '#8a6d3b', aura: '#ffe9a8' },
      skills: [
        { lvl: 1, id: 'parole', name: 'Parole véridique', desc: "Dit le vrai sans détour. Dégâts de Véracité.", cost: 3,
          target: 'foe', el: 'sidq', pow: 1.4, anim: 'light' },
        { lvl: 1, id: 'apaisement', name: 'Apaisement', desc: "Une parole douce relève un cœur : rend de la Constance à un compagnon.", cost: 4,
          target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 2, id: 'lignees', name: 'Science des lignées', desc: "Nul ne connaissait mieux les généalogies des Arabes : révèle les failles d'un égrégore.", cost: 2,
          target: 'foe', el: 'ilm', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 3, id: 'fermete', name: 'Fermeté', desc: "« Je ne dénouerai pas un étendard qu'il a noué. » Renforce la garde du groupe.", cost: 5,
          target: 'allies', fx: [{ st: 'def', v: 1, turns: 3 }], anim: 'guard' },
        { lvl: 5, id: 'affranchir', name: 'Affranchir', desc: "Il rachetait les opprimés : retire les altérations d'un compagnon et lui rend un peu de Constance.", cost: 5,
          target: 'ally', heal: 0.5, fx: [{ st: 'cleanse' }], anim: 'heal' },
        { lvl: 7, id: 'certitude', name: 'Certitude', desc: "« S'il l'a dit, il a dit vrai. » Lourds dégâts de Véracité, déchire un voile.", cost: 8,
          target: 'foe', el: 'sidq', pow: 1.9, fx: [{ st: 'veil', v: -1 }], anim: 'pillar' }
      ],
      limit: { id: 'siddiq', name: 'As-Siddîq', desc: "La véracité à nu : frappe tous les égrégores, déchire leurs voiles et révèle leurs failles.",
               target: 'foes', el: 'sidq', pow: 1.6, fx: [{ st: 'veil', v: -2 }, { st: 'reveal' }], anim: 'pillar' }
    },
    umar: {
      name: "'Umar", title: 'Al-Fârûq', arabic: 'عمر',
      role: 'gardien', el: 'adl',
      look: { robe: '#7b5a3a', head: '#efe7d6', cloak: '#3d2c1e', aura: '#9fd0ff' },
      skills: [
        { lvl: 1, id: 'durra', name: 'La Durra', desc: "Coup de férule. Peut étourdir.", cost: 3,
          target: 'foe', el: 'fer', pow: 1.3, fx: [{ st: 'stun', chance: 0.3 }], anim: 'slash' },
        { lvl: 1, id: 'firasa', name: 'Firâsa', desc: "Discerne les failles d'un égrégore. Légers dégâts de Justice.", cost: 2,
          target: 'foe', el: 'adl', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 2, id: 'rempart', name: 'Rempart', desc: "Se dresse devant les siens : attire les coups et les amortit.", cost: 4,
          target: 'self', fx: [{ st: 'taunt', turns: 2 }, { st: 'garde' }], anim: 'guard' },
        { lvl: 4, id: 'equite', name: 'Équité', desc: "La même mesure pour tous : dégâts de Justice à tous les égrégores.", cost: 6,
          target: 'foes', el: 'adl', pow: 0.9, anim: 'wave' },
        { lvl: 6, id: 'hardiesse', name: 'Hardiesse', desc: "Charge sans calcul. Dégâts de Courage, abaisse la garde de la cible.", cost: 6,
          target: 'foe', el: 'shajaa', pow: 1.6, fx: [{ st: 'def', v: -1 }], anim: 'burst' },
        { lvl: 8, id: 'droit', name: 'Rendre le droit', desc: "Reprend au fort ce qu'il a pris. Lourds dégâts de Justice, dissipe les bonus.", cost: 8,
          target: 'foe', el: 'adl', pow: 1.9, fx: [{ st: 'dispel' }], anim: 'pillar' }
      ],
      limit: { id: 'faruq', name: 'Al-Fârûq', desc: "Sépare le vrai du faux : frappe tous les égrégores, dissipe leurs bonus et déchire leurs voiles.",
               target: 'foes', el: 'adl', pow: 1.5, fx: [{ st: 'dispel' }, { st: 'veil', v: -2 }], anim: 'pillar' }
    },
    abuubayda: {
      name: "Abû 'Ubayda", title: 'Amîn al-Umma', arabic: 'أبو عبيدة',
      role: 'soigneur', el: 'rahma',
      look: { robe: '#6f7f6a', head: '#eae4d2', cloak: '#4b5a4a', aura: '#8ff0e0' },
      skills: [
        { lvl: 1, id: 'baume', name: 'Baume', desc: "Panse un compagnon : rend de la Constance.", cost: 3,
          target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 1, id: 'amana', name: 'Dépôt gardé', desc: "La loyauté frappe ce qui trahit. Dégâts de Miséricorde.", cost: 3,
          target: 'foe', el: 'rahma', pow: 1.3, anim: 'light' },
        { lvl: 2, id: 'partage', name: 'Partage du pain', desc: "Ce qu'il a, il le partage : rend de la Constance à tout le groupe.", cost: 6,
          target: 'allies', heal: 0.6, anim: 'heal' },
        { lvl: 4, id: 'douceur', name: 'Douceur', desc: "Désarme sans blesser. Dégâts de Miséricorde, affaiblit l'attaque de la cible.", cost: 4,
          target: 'foe', el: 'rahma', pow: 0.9, fx: [{ st: 'atk', v: -1 }], anim: 'wave' },
        { lvl: 5, id: 'relever', name: 'Relever', desc: "Relève un compagnon éprouvé.", cost: 8,
          target: 'ally', revive: true, heal: 0.6, anim: 'heal' },
        { lvl: 7, id: 'marcheur', name: 'Pas du marcheur', desc: "Tenir, un pas après l'autre. Dégâts de Patience.", cost: 5,
          target: 'foe', el: 'sabr', pow: 1.5, anim: 'glyph' }
      ],
      limit: { id: 'amin', name: 'Amîn al-Umma', desc: "L'homme de confiance : relève et restaure tout le groupe, dissipe ses altérations.",
               target: 'allies', heal: 1.0, revive: true, fx: [{ st: 'cleanse' }, { st: 'regen', turns: 3 }], anim: 'heal' }
    }
  },

  /* ──────────────────────────── ÉGRÉGORES ──────────────────────────── */
  enemies: {
    murmure: {
      name: 'Murmure de deuil', art: 'wisp', hue: 215, scale: 1,
      lvl: 1, tier: 'minion', weak: ['sidq', 'sabr'], veils: 1,
      skills: [
        { w: 2, name: '« Tout est fini »', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'atk', v: -1, chance: 0.4 }], anim: 'dark' }
      ],
      taunts: ['Il reviendra…', 'Tout est fini…'],
      desc: "Un chagrin qui a perdu son maître et rampe de cœur en cœur. Seul, il n'est rien ; nombreux, ils font une foule. La véracité et la patience les dissipent."
    },
    deni: {
      name: 'Le Déni', art: 'mask', hue: 220, scale: 2,
      lvl: 2, tier: 'elite', weak: ['sidq', 'sabr'], veils: 3,
      skills: [
        { w: 3, name: 'Sabre du refus', target: 'foe', el: 'fer', pow: 1.2, anim: 'slash' },
        { w: 2, name: '« Il reviendra »', target: 'self', fx: [{ st: 'regen', turns: 2 }], anim: 'guard' },
        { w: 2, name: 'Silence imposé', target: 'foe', el: 'fer', pow: 0.6, fx: [{ st: 'doute', turns: 2, chance: 0.5 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.5, say: "S'il n'est plus là, que vous reste-t-il ? Gardez au moins son souvenir, et prosternez-vous devant lui !", fx: [{ st: 'atk', v: 1 }] }
      ],
      taunts: ['Quiconque dira qu’il est mort…', 'Quarante nuits, et il reviendra.'],
      desc: "Égrégore né du deuil de tout un peuple. Il ne veut aucun mal : il veut que rien ne change. Mais qui s'attache à la personne plutôt qu'au message finit par adorer un souvenir."
    },
    mot_clan: {
      name: "Mot d'ordre", art: 'wisp', hue: 20, scale: 1,
      lvl: 2, tier: 'minion', weak: ['adl', 'rahma'], veils: 1,
      skills: [
        { w: 2, name: '« Nous » contre « vous »', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'dark' }
      ],
      taunts: ['Les nôtres d’abord.'],
      desc: "Un cri de ralliement détaché de toute bouche. Il ne demande pas qui a raison, seulement de quel côté l'on est."
    },
    clan: {
      name: "Al-'Asabiyya — le Clan", art: 'banner', hue: 15, scale: 3,
      lvl: 3, tier: 'elite', weak: ['ilm', 'rahma', 'adl'], veils: 4,
      skills: [
        { w: 3, name: 'Sang et lignée', target: 'foes', el: 'fer', pow: 0.75, anim: 'wave' },
        { w: 2, name: 'Un émir de chez nous', target: 'self', fx: [{ st: 'atk', v: 1, turns: 3 }], anim: 'guard' },
        { w: 2, name: 'Vieilles querelles', target: 'foe', el: 'fer', pow: 0.7, fx: [{ st: 'waswas', turns: 3 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.5, say: "Deux émirs ! Deux étendards ! Demain, deux communautés !", fx: [{ st: 'def', v: 1 }],
          addSkills: [ { w: 3, name: 'Déchirure', target: 'foes', el: 'fer', pow: 0.9, fx: [{ st: 'spd', v: -1, chance: 0.5 }], anim: 'burst' } ] }
      ],
      taunts: ['Avant d’être croyants, vous étiez des tribus.', 'Aws ? Khazraj ? Quraysh ? Choisis ton camp.'],
      desc: "L'esprit de corps tribal, la plus vieille idole des Arabes. Un nœud d'étendards qui se resserre dès qu'on dit « nous » contre « vous »."
    },
    reniement: {
      name: 'Nuée du reniement', art: 'swarm', hue: 280, scale: 1,
      lvl: 4, tier: 'minion', weak: ['sidq', 'shajaa'], veils: 2,
      skills: [
        { w: 2, name: '« Rentrons chez nos pères »', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'spd', v: -1, chance: 0.4 }], anim: 'dark' },
        { w: 1, name: 'Nuée', target: 'foes', el: 'fer', pow: 0.6, anim: 'wave' }
      ],
      taunts: ['L’homme est mort ; nos pactes aussi.'],
      desc: "Ce que des tribus entières se sont dit à la même heure : « L'homme est mort, nos pactes aussi. » Elle recule devant le courage et se défait devant la véracité."
    },
    avare: {
      name: "L'Avare du dû", art: 'tower', hue: 45, scale: 2,
      lvl: 5, tier: 'elite', weak: ['adl', 'rahma', 'sidq'], veils: 4,
      skills: [
        { w: 3, name: 'La prière sans le dû', target: 'self', fx: [{ st: 'def', v: 1, turns: 3 }], anim: 'guard' },
        { w: 3, name: 'Greniers clos', target: 'foes', el: 'fer', pow: 0.8, anim: 'dark' },
        { w: 2, name: 'Marchandage', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'atk', v: -1, chance: 0.6 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.5, say: "Je garde la prière. Je ne retiens que ma part. Est-ce donc trop demander ?", fx: [{ st: 'atk', v: 1 }],
          addSkills: [ { w: 3, name: 'Soustraction', target: 'foe', el: 'fer', pow: 1.4, fx: [{ st: 'def', v: -1, chance: 0.5 }], anim: 'slash' } ] }
      ],
      taunts: ['Ce qui est à moi est à moi.', 'Une entrave de chameau… pour si peu ?'],
      desc: "Égrégore de la soustraction. Il ne renie rien : il garde la prière et retranche la part du pauvre. Une tour de pièces dont aucune ne tombe."
    },
    echo: {
      name: 'Écho flatteur', art: 'wisp', hue: 300, scale: 1,
      lvl: 5, tier: 'minion', weak: ['sidq', 'ilm'], veils: 2,
      skills: [
        { w: 3, name: 'Louange creuse', target: 'allies', fx: [{ st: 'atk', v: 1, turns: 2 }], anim: 'glyph' },
        { w: 1, name: 'Flatterie', target: 'foe', el: 'fer', pow: 0.8, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'dark' }
      ],
      taunts: ['Comme tu parles bien, ô prophète de ta tribu…'],
      desc: "Il répète ce que le Menteur dit, plus fort et plus beau. Sans écho, le mensonge retombe ; c'est donc l'écho qu'il faut faire taire d'abord."
    },
    fausse_rime: {
      name: 'Fausse rime', art: 'swarm', hue: 310, scale: 1,
      lvl: 5, tier: 'minion', weak: ['sidq', 'sabr'], veils: 2,
      skills: [
        { w: 3, name: 'Contrefaçon', target: 'foe', el: 'fer', pow: 1.1, fx: [{ st: 'doute', turns: 2, chance: 0.3 }], anim: 'dark' },
        { w: 2, name: 'Cadence vide', target: 'foes', el: 'fer', pow: 0.6, anim: 'wave' }
      ],
      desc: "Musaylima imitait la cadence de la Révélation sans rien avoir à dire. Ces rimes sonnent comme le vrai, et n'en ont que le bruit."
    },
    mur_jardin: {
      name: 'Mur du Jardin', art: 'idol', hue: 330, scale: 2,
      lvl: 7, tier: 'elite', weak: ['shajaa', 'sidq'], veils: 4,
      skills: [
        { w: 3, name: 'Porte close', target: 'self', fx: [{ st: 'def', v: 1, turns: 2 }, { st: 'garde' }], anim: 'guard' },
        { w: 3, name: 'Éboulis', target: 'foes', el: 'fer', pow: 0.85, anim: 'burst' },
        { w: 2, name: 'Pierre d’angle', target: 'foe', el: 'fer', pow: 1.4, fx: [{ st: 'stun', chance: 0.25 }], anim: 'slash' }
      ],
      phases: [
        { at: 0.4, say: "Nul ne passe. Ce qui est derrière moi ne se discute pas.", fx: [{ st: 'atk', v: 1 }] }
      ],
      desc: "Le rempart derrière lequel un mensonge se met à l'abri de toute question. Le courage le franchit — comme al-Barâ' ibn Mâlik, jeté par-dessus le mur sur des boucliers."
    },
    kadhdhab: {
      name: 'Al-Kadhdhâb — le Menteur', art: 'mirror', hue: 305, scale: 3,
      lvl: 8, tier: 'boss', weak: ['sidq', 'ilm', 'sabr'], veils: 6,
      skills: [
        { w: 3, name: 'Demi-vérité', target: 'foe', el: 'fer', pow: 1.3, fx: [{ st: 'doute', turns: 2, chance: 0.4 }], anim: 'dark' },
        { w: 3, name: '« La moitié de la terre »', target: 'foes', el: 'fer', pow: 0.8, fx: [{ st: 'atk', v: -1, chance: 0.4 }], anim: 'wave' },
        { w: 2, name: 'Reflet complaisant', target: 'self', fx: [{ st: 'atk', v: 1, turns: 3 }], anim: 'glyph' }
      ],
      phases: [
        { at: 0.66, say: "Je dis ce qu'ils veulent entendre. N'est-ce pas cela, être aimé ?", fx: [{ st: 'def', v: 1 }],
          addSkills: [ { w: 3, name: 'Mille reflets', target: 'foes', el: 'fer', pow: 1.0, fx: [{ st: 'waswas', turns: 3, chance: 0.5 }], anim: 'burst' } ] },
        { at: 0.33, say: "Sans moi, que leur reste-t-il ? Le vrai est si dur… et moi, je suis si doux.", fx: [{ st: 'spd', v: 1 }],
          addSkills: [ { w: 2, name: 'Fausse promesse', target: 'self', fx: [{ st: 'regen', turns: 3 }, { st: 'def', v: 1, turns: 2 }], anim: 'guard' } ] }
      ],
      taunts: ['Un prophète pour chaque tribu : n’est-ce pas plus juste ?', 'Regarde-toi en moi. Ne te plais-tu pas ?'],
      desc: "Égrégore de la contrefaçon. Il n'attaque pas le vrai de front : il l'imite, l'allège, et promet à chacun ce qu'il désire. Un miroir tourné vers la foule ; seule la véracité le fend."
    }
  },

  /* ────────────────────────────── CODEX ────────────────────────────── */
  codex: [
    { id: 'abubakr_bio', cat: 'Biographie', title: "Abû Bakr as-Siddîq",
      text: "'Abdallâh ibn Abî Quhâfa, des Banû Taym de Quraysh, né à La Mecque vers 573. Marchand d'étoffes et généalogiste réputé des Arabes, il fut parmi les tout premiers à croire et dépensa sa fortune pour affranchir des croyants persécutés, dont Bilâl. Compagnon de l'Hégire et de la Grotte, il dirigea la prière durant la dernière maladie du Messager d'Allah ﷺ. Premier calife (11–13 H / 632–634), il mourut à soixante-trois ans. Qu'Allah l'agrée.",
      src: "Ibn Sa'd, at-Tabaqât ; Ibn Hishâm, as-Sîra ; al-Bukhârî" },
    { id: 'umar_bio', cat: 'Biographie', title: "'Umar ibn al-Khattâb",
      text: "'Umar ibn al-Khattâb, des Banû 'Adî de Quraysh. Sa conversion donna de l'assurance aux croyants de La Mecque. Homme de droiture et de franc-parler, il fut le premier à prêter allégeance à Abû Bakr à la Saqîfa, puis son plus proche conseiller. Abû Bakr le désigna pour lui succéder en l'an 13. Sa saga est le deuxième maillon de la Chaîne. Qu'Allah l'agrée.",
      src: "Ibn Sa'd, at-Tabaqât ; al-Bukhârî" },
    { id: 'abuubayda_bio', cat: 'Biographie', title: "Abû 'Ubayda ibn al-Jarrâh",
      text: "'Âmir ibn 'Abdallâh ibn al-Jarrâh, de Quraysh, l'un des dix à qui le Paradis fut annoncé. Le Messager d'Allah ﷺ dit de lui : « Chaque communauté a son homme de confiance, et l'homme de confiance de cette communauté est Abû 'Ubayda ibn al-Jarrâh. » Présent à la Saqîfa avec Abû Bakr et 'Umar, il commandera plus tard les armées de Syrie et mourra de la peste d'Emmaüs en l'an 18. Qu'Allah l'agrée.",
      src: "al-Bukhârî ; Muslim ; Ibn Sa'd, at-Tabaqât" },
    { id: 'jour_sombre', cat: 'Événement', title: "La mort du Messager d'Allah ﷺ",
      text: "Le lundi 12 Rabî' al-Awwal de l'an 11 de l'Hégire (juin 632), le Messager d'Allah ﷺ meurt à Médine après quelques jours de fièvre. La ville est frappée de stupeur ; 'Umar lui-même refuse d'abord d'y croire. Abû Bakr, revenu d'as-Sunh, rappelle aux gens qu'ils adorent Allah, le Vivant qui ne meurt pas, et récite le verset 3:144. Pour la première fois, la communauté doit tenir sans lui.",
      src: "al-Bukhârî, as-Sahîh ; Ibn Hishâm, as-Sîra" },
    { id: 'deni', cat: 'Noosphère', title: "Le Déni",
      text: "Égrégore né du deuil de tout un peuple. Il ne veut aucun mal : il veut seulement que rien ne change, et murmure que l'être aimé reviendra. Mais qui s'attache à la personne plutôt qu'au message finit par adorer un souvenir. On le dissipe par la véracité, dite avec douceur, et par la patience. Il revient chaque fois qu'une foule préfère un nom à une vérité." },
    { id: 'saqifa', cat: 'Événement', title: "La Saqîfa des Banû Sâ'ida",
      text: "Le jour même de la mort du Messager ﷺ, les Ansâr se réunissent sous l'auvent (saqîfa) des Banû Sâ'ida pour choisir un chef. Abû Bakr, 'Umar et Abû 'Ubayda les y rejoignent. Après un débat vif — « un émir parmi nous, un émir parmi vous » —, Abû Bakr propose 'Umar ou Abû 'Ubayda ; 'Umar lui prend la main et lui prête allégeance, suivi des Émigrés puis des Ansâr. L'allégeance générale a lieu le lendemain à la mosquée.",
      src: "al-Bukhârî, as-Sahîh (récit de 'Umar) ; Ibn Hishâm, as-Sîra" },
    { id: 'asabiyya', cat: 'Noosphère', title: "Al-'Asabiyya — le Clan",
      text: "L'esprit de corps tribal : « mon frère contre mon cousin, mon cousin et moi contre l'étranger ». Avant l'islam, il tenait lieu de loi aux Arabes. Dans la noosphère, c'est un nœud d'étendards qui se resserre dès qu'on dit « nous » contre « vous ». La justice le dénoue, la miséricorde le désarme, et le savoir des lignées — où Abû Bakr excellait — lui retire ses prestiges : tous descendent d'un même père." },
    { id: 'investiture', cat: 'Parole', title: "Le discours d'investiture",
      text: "Au lendemain de la Saqîfa, Abû Bakr s'adresse aux croyants dans la mosquée. Il déclare n'être pas le meilleur d'entre eux, demande à être aidé s'il agit bien et redressé s'il agit mal, pose que le faible est fort auprès de lui jusqu'à ce que son droit lui soit rendu, et borne l'obéissance qu'on lui doit à sa propre obéissance à Allah et à Son Messager. C'est le premier texte politique de l'islam après la Révélation.",
      src: "Ibn Hishâm, as-Sîra (d'après Ibn Ishâq)" },
    { id: 'usama', cat: 'Événement', title: "L'armée d'Usâma",
      text: "Peu avant sa mort, le Messager d'Allah ﷺ avait confié une armée à Usâma ibn Zayd, âgé d'une vingtaine d'années, pour marcher vers les confins de la Syrie. Malgré le soulèvement des tribus et l'avis de plusieurs Compagnons, Abû Bakr maintient l'expédition et refuse de remplacer son jeune chef. Il l'accompagne à pied jusqu'à al-Jurf. L'armée revient sauve après une quarantaine de jours ; sa seule sortie dissuade bien des tribus.",
      src: "at-Tabarî, Târîkh ; Ibn Sa'd, at-Tabaqât" },
    { id: 'consignes', cat: 'Parole', title: "Les dix consignes",
      text: "En congédiant l'armée d'Usâma, Abû Bakr lui donne dix recommandations : ne pas trahir, ne pas frauder, ne pas mutiler, épargner les êtres sans défense, ne couper ni brûler les palmiers, n'abattre aucun arbre fruitier, ne tuer de bête que pour se nourrir, laisser en paix ceux qui se sont retirés dans les ermitages. C'est l'un des plus anciens énoncés d'un droit de la guerre.",
      src: "at-Tabarî, Târîkh" },
    { id: 'ridda', cat: 'Événement', title: "Les guerres de la Ridda",
      text: "À la mort du Messager ﷺ, une grande partie des tribus d'Arabie se détache de Médine : certaines renient l'islam, d'autres suivent de faux prophètes, d'autres encore refusent la zakât. Abû Bakr refuse de séparer la prière de la zakât, défend Médine à Dhû l-Qassa, puis y noue onze étendards pour onze armées. En moins d'un an (11–12 H), l'Arabie est de nouveau rassemblée.",
      src: "at-Tabarî, Târîkh ; al-Bukhârî ; Muslim" },
    { id: 'avare', cat: 'Noosphère', title: "L'Avare du dû",
      text: "Égrégore de la soustraction. Il ne renie rien : il garde la prière et retranche la part du pauvre. Il prend la forme d'une tour de pièces dont aucune ne tombe. La justice l'ébranle, car la zakât est un droit et non une faveur ; la miséricorde et la véracité achèvent de le défaire. La plupart des idoles commencent ainsi : par une petite soustraction faite au vrai." },
    { id: 'yamama', cat: 'Événement', title: "Yamâma et le Jardin de la Mort",
      text: "À 'Aqrabâ', dans le Yamâma (fin 11 – début 12 H), l'armée de Khâlid ibn al-Walîd affronte les Banû Hanîfa rassemblés autour de Musaylima. C'est la bataille la plus dure de la Ridda ; les lignes des croyants plient avant de se reformer clan par clan. Les Banû Hanîfa se retranchent dans un verger clos qu'al-Barâ' ibn Mâlik ouvre de l'intérieur : on l'appellera le Jardin de la Mort. Musaylima y est tué. Environ douze cents musulmans tombent, dont de très nombreux récitateurs du Coran.",
      src: "at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya wa-n-Nihâya" },
    { id: 'kadhdhab', cat: 'Noosphère', title: "Al-Kadhdhâb — le Menteur",
      text: "Égrégore de la contrefaçon, né autour de Musaylima. Il n'attaque pas le vrai de front : il l'imite, l'allège, et promet à chacun ce qu'il désire — un prophète de sa tribu, une religion sans exigence, « la moitié de la terre ». C'est un miroir tourné vers la foule. Seule la véracité le fend ; le savoir distingue l'original de la copie, et la patience refuse ses promesses rapides. Il change de nom à chaque époque." },
    { id: 'jam_quran', cat: 'Événement', title: "Le rassemblement du Coran",
      text: "Après le Yamâma, 'Umar craint que le Coran ne se perde avec ses récitateurs et presse Abû Bakr de le rassembler. D'abord hésitant devant un acte que le Messager ﷺ n'avait pas accompli, Abû Bakr s'y résout et en charge Zayd ibn Thâbit, ancien scribe de la Révélation. Zayd recueille les versets sur les tiges de palmier, les pierres plates et dans la mémoire des hommes, en exigeant des témoins. Les feuillets restent chez Abû Bakr, puis chez 'Umar.",
      src: "al-Bukhârî, as-Sahîh (récit de Zayd ibn Thâbit)" }
  ],

  /* ───────────────────────────── CHAPITRES ───────────────────────────── */
  chapters: [
    /* ═════════ 1. LE JOUR LE PLUS SOMBRE ═════════ */
    {
      id: 'ab1', title: "Le Jour le plus sombre", sub: "An 11 H · 632 · Médine",
      map: 'medine', opts: { time: 'day' }, start: 'porte_sud',
      party: ['abubakr'],
      npcs: [
        { id: 'abuubayda', name: "Abû 'Ubayda", hero: 'abuubayda', at: ['porte_sud', 1, -2],
          talk: [['say', 'abuubayda', "La ville chancelle, Abû Bakr. Viens."]] },
        { id: 'umar', name: "'Umar", hero: 'umar', at: ['mosquee_porte', 0, -1],
          talk: [['say', 'umar', "Il n'est pas mort. Il ne peut pas être mort."]] },
        { id: 'medinois', name: 'Un Médinois', at: ['porte_sud', -2, -1], look: { kind: 'homme', robe: '#6b5a48', head: '#d9cfbd' },
          talk: [['say', 'medinois', "On dit… on dit que le Messager d'Allah ﷺ… Non. Je ne peux pas le dire."]] },
        { id: 'ancien', name: 'Vieil Ansârî', at: ['place', 2, 1], look: { kind: 'ancien', robe: '#7a6a55', head: '#efe9dc' },
          talk: [['say', 'ancien', "Dix ans qu'il vivait parmi nous. Dix ans, et cette ville qui s'appelait Yathrib est devenue « la Ville » tout court. Que serons-nous, demain ?"]] },
        { id: 'enfant', name: 'Un enfant', at: ['puits', 1, 0], look: { kind: 'enfant', robe: '#8a7a60', head: '#e6dcc8' },
          talk: [['say', 'enfant', "Pourquoi tout le monde pleure ? Même les grands, même les forts…"]] },
        { id: 'messager', name: 'Messager', at: 'mosquee_porte', hidden: true, look: { kind: 'homme', robe: '#5d6b58', head: '#e2d8c4' } },
        { id: 'hubab', name: "Al-Hubâb ibn al-Mundhir", at: ['halle', -1, 1], look: { kind: 'compagnon', robe: '#5b6b4f', head: '#ece4d0', aura: '#bfe6a8' },
          talk: [['say', 'hubab', "Nous avons ouvert nos maisons et nos palmeraies. Qui veillera sur les Ansâr, à présent ?"]] },
        { id: 'bashir', name: "Bashîr ibn Sa'd", at: ['halle', 1, 1], look: { kind: 'compagnon', robe: '#6a5f4a', head: '#efe7d4', aura: '#ffe9a8' },
          talk: [['say', 'bashir', "Nous n'avons pas secouru cette religion pour en tirer une part de ce monde. Ne l'oublions pas aujourd'hui."]] }
      ],
      foes: [
        { id: 'f_deni', map: 'noos', at: 'coeur', group: ['deni', 'murmure'], bg: 'noos' },
        { id: 'f_n1', map: 'noos', at: 'noeud2', group: ['murmure', 'murmure'], bg: 'noos' },
        { id: 'f_palm', at: 'palmeraie', group: ['murmure', 'murmure'], bg: 'ville' }
      ],
      chests: [
        { at: ['souk', 1, 1], item: 'dattes', n: 2 },
        { map: 'noos', at: 'faille', item: 'musc', n: 1 }
      ],
      intro: [
        ['title', "Le Jour le plus sombre", "Lundi 12 Rabî' al-Awwal, an 11 de l'Hégire"],
        ['amb', 'foule'],
        ['nar', "Médine, juin 632. Ce matin encore, on croyait la fièvre du Messager d'Allah ﷺ en recul, et les cœurs s'étaient rassurés. Abû Bakr était rentré chez lui, à as-Sunh, aux abords de la ville."],
        ['nar', "Puis un cavalier est venu, sans pouvoir achever sa phrase. Abû Bakr a sellé sa monture. Il entre dans Médine par le sud."],
        ['codex', 'abubakr_bio']
      ],
      objectives: [
        { text: "Rejoindre Abû 'Ubayda près de la porte", talk: 'abuubayda', then: [
          ['say', 'abuubayda', "Abû Bakr ! Te voilà, Allah soit loué. La ville chancelle. Les uns pleurent, les autres se taisent, et 'Umar… 'Umar jure que ce n'est pas vrai."],
          ['say', 'abubakr', "Mène-moi à la mosquée, Abû 'Ubayda. Ne disons rien à personne avant d'avoir vu."],
          ['hide', 'abuubayda'], ['join', 'abuubayda'], ['codex', 'abuubayda_bio']
        ] },
        { text: "Traverser Médine jusqu'à la place", goto: 'place', then: [
          ['nar', "Des hommes assis à même le sol. Des portes ouvertes sur des maisons muettes. Jamais Médine n'avait fait ce bruit-là : celui d'une ville qui retient son souffle."],
          ['nar', "Râwî, regarde l'envers du lieu. Quand tant de cœurs regardent ensemble la même peine, elle prend corps dans la noosphère. Ces lueurs qui rampent sont des murmures."],
          ['battle', { group: ['murmure', 'murmure'], bg: 'ville', intro: "« Tout est fini… » Les murmures du deuil se referment sur vous." }],
          ['nar', "Les murmures se défont. Mais plus loin, vers la mosquée, quelque chose de bien plus grand s'amasse."]
        ] },
        { text: "Gagner la porte de la mosquée", goto: 'mosquee_porte', then: [
          ['sfx', 'crowd'],
          ['nar', "Devant la mosquée, la foule. Au milieu d'elle, 'Umar, debout, la voix brisée, jurant à qui veut l'entendre."],
          ['quote', "Le Messager d'Allah ﷺ n'est pas mort ! Il est allé vers son Seigneur, comme y alla Mûsâ fils de 'Imrân, qui s'absenta quarante nuits puis revint aux siens.", "'Umar ibn al-Khattâb, ce jour-là — Ibn Hishâm, as-Sîra"],
          ['nar', "Abû Bakr ne dit rien à personne. Il traverse la foule et entre dans la demeure. On l'entend dire, à travers ses larmes :"],
          ['quote', "Que mon père et ma mère te soient donnés en rançon ! Tu as été bon de ton vivant, et bon dans ta mort.", "Abû Bakr — al-Bukhârî, as-Sahîh"],
          ['nar', "Quand il ressort, ses joues sont mouillées, et sa voix ne tremble pas."],
          ['say', 'abuubayda', "La foule écoute 'Umar. Elle veut le croire. Que vas-tu faire ?"],
          ['choice', "Devant la foule suspendue aux paroles de 'Umar, que fait Abû Bakr ?", [
            { t: "Laisser dire : ce peuple a besoin d'espoir, la vérité attendra demain.", r: [
              ['nar', "Un espoir bâti sur un déni est une idole qui commence : demain, on aurait adoré une absence. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Faire taire 'Umar d'autorité et disperser la foule.", r: [
              ['nar', "Il dit seulement : « Doucement, toi qui jures. » Il ne contraignit personne ; il parla, et les gens vinrent à lui. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Se lever, et dire la vérité telle qu'elle est.", ok: true, r: [
              ['say', 'abubakr', "Doucement, toi qui jures."],
              ['nar', "'Umar ne s'interrompt pas. Alors Abû Bakr se tourne vers les gens. Et les gens, un à un, se tournent vers lui."] ] }
          ]],
          ['nar', "Mais au-dessus de la cour, dans l'envers du lieu, le refus de tout un peuple a déjà pris forme. Avant que la parole porte, il faut le traverser."],
          ['map', 'noos', 'seuil', { hue: 215 }],
          ['amb', 'noos'],
          ['nar', "La noosphère de la mosquée. Ici le chagrin porte un masque vide, et il a un nom : le Déni."]
        ] },
        { text: "Noosphère : affronter le Déni, au cœur", foe: 'f_deni', then: [
          ['sfx', 'light'], ['flash', '#ffe9a8'],
          ['map', 'medine', 'mosquee_cour', { time: 'day' }],
          ['tp', 'umar', ['mosquee_cour', 1, 0]],
          ['amb', 'silence'],
          ['quote', "Ô gens ! Que celui qui adorait Muhammad sache que Muhammad est mort. Et que celui qui adore Allah sache qu'Allah est Vivant et ne meurt pas.", "Abû Bakr, dans la mosquée de Médine — al-Bukhârî, as-Sahîh"],
          ['quote', "Muhammad n'est qu'un messager ; des messagers avant lui sont passés. S'il mourait donc, ou s'il était tué, retourneriez-vous sur vos talons ? Quiconque retourne sur ses talons ne nuira en rien à Allah ; et Allah récompensera bientôt les reconnaissants.", "Coran 3:144 — traduction du sens"],
          ['nar', "Ibn 'Abbâs dira : « Ce fut comme si les gens n'avaient jamais su que ce verset avait été révélé, avant qu'Abû Bakr ne le récite. » Ce jour-là, toute la ville le répétait."],
          ['quote', "Par Allah, dès que j'entendis Abû Bakr le réciter, mes jambes ne me portèrent plus, et je tombai à terre. Je sus alors que le Prophète ﷺ était mort.", "'Umar ibn al-Khattâb — al-Bukhârî, as-Sahîh"],
          ['codex', 'jour_sombre'], ['codex', 'deni']
        ] },
        { text: "Relever 'Umar", talk: 'umar', then: [
          ['say', 'umar', "C'est donc vrai. Toi seul as eu la force de le dire. Je voulais tant qu'il revienne…"],
          ['say', 'abubakr', "Nous l'aimons tous plus que nos propres vies, 'Umar. C'est pour cela qu'il faut garder ce qu'il nous a transmis, et ne pas nous arrêter à sa personne."],
          ['say', 'umar', "Me voici. Dis-moi où me tenir."],
          ['hide', 'umar'], ['join', 'umar'], ['codex', 'umar_bio'],
          ['show', 'messager'], ['walk', 'messager', ['mosquee_cour', 0, 2]],
          ['say', 'messager', "Abû Bakr ! 'Umar ! Les Ansâr sont réunis sous l'auvent des Banû Sâ'ida, autour de Sa'd ibn 'Ubâda. Ils parlent de choisir un chef parmi eux."],
          ['say', 'umar', "Allons trouver nos frères les Ansâr."],
          ['say', 'abuubayda', "Je viens avec vous."],
          ['hide', 'messager']
        ] },
        { text: "Gagner la Saqîfa des Banû Sâ'ida", goto: 'halle', then: [
          ['nar', "En chemin, deux hommes de bien parmi les Ansâr leur conseillent de régler l'affaire entre Émigrés. Ils poursuivent pourtant : c'est en face que l'on parle à des frères."],
          ['nar', "Sous l'auvent, les Ansâr sont assemblés. Eux qui ont tout donné — leurs maisons, leurs palmeraies, leur sang — craignent ce que demain fera d'eux."],
          ['say', 'Un orateur des Ansâr', "Nous sommes les Auxiliaires d'Allah et le bataillon de l'islam. Et vous, Émigrés, vous êtes venus à nous comme une poignée d'hommes."],
          ['say', 'hubab', "Un émir parmi nous, et un émir parmi vous !"],
          ['say', 'umar', "J'ai préparé des paroles. Laisse-moi…"],
          ['say', 'abubakr', "Doucement, 'Umar."],
          ['nar', "'Umar dira plus tard : « Il ne laissa pas un mot de ce que j'avais préparé sans le dire, et mieux que moi. » Abû Bakr loue les Ansâr, et ne retranche rien de leur mérite."],
          ['say', 'abubakr', "Tout le bien que vous dites de vous, vous en êtes dignes. Mais les Arabes ne reconnaîtront cette charge qu'à ce clan de Quraysh. Ne déchirons pas ce qui a été uni."],
          ['nar', "Les voix montent. Dans l'envers de l'auvent, deux mots enflent et se font face : « nous », « vous ». Ils se nouent en un faisceau d'étendards. La plus vieille idole des Arabes se réveille."],
          ['heal'],
          ['battle', { group: ['clan', 'mot_clan', 'mot_clan'], bg: 'ville', boss: true, intro: "Al-'Asabiyya : « Avant d'être croyants, vous étiez des tribus. Vous le redeviendrez. »" }],
          ['nar', "Le faisceau se dénoue. Sous l'auvent, le tumulte retombe d'un coup, comme un vent qui tourne. Il reste des hommes, des frères, et une question."],
          ['choice', "Abû Bakr tient la main de 'Umar et celle d'Abû 'Ubayda. Que propose-t-il à l'assemblée ?", [
            { t: "Tendre sa propre main : nul n'est plus digne que lui de cette charge.", r: [
              ['nar', "Il ne demanda rien pour lui-même. Celui qui convoite la charge nourrit déjà une idole : la sienne. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Accepter le partage : un émir pour les Émigrés, un émir pour les Ansâr.", r: [
              ['nar', "Deux émirs, c'eût été deux communautés avant la fin de l'année : le Clan n'attendait que cela. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Proposer 'Umar ou Abû 'Ubayda, et s'effacer.", ok: true, r: [
              ['quote', "J'agrée pour vous l'un de ces deux hommes : prêtez allégeance à celui des deux que vous voudrez.", "Abû Bakr à la Saqîfa — al-Bukhârî, as-Sahîh"],
              ['quote', "De tout ce qu'il dit, je ne détestai que cette parole. Par Allah, j'aurais préféré avoir le cou tranché, sans péché, plutôt que de commander à des gens parmi lesquels se trouve Abû Bakr.", "'Umar ibn al-Khattâb — al-Bukhârî, as-Sahîh"] ] }
          ]],
          ['say', 'umar', "Tends ta main, Abû Bakr."],
          ['sfx', 'duff'],
          ['nar', "'Umar lui prête allégeance. Puis les Émigrés. Puis les Ansâr, Bashîr ibn Sa'd parmi les premiers. Pas une goutte de sang n'a coulé."],
          ['codex', 'saqifa'], ['codex', 'asabiyya'],
          ['give', 'dattes', 2]
        ] },
        { auto: true, then: [
          ['map', 'medine', 'mosquee_porte', { time: 'dawn' }],
          ['amb', 'silence'],
          ['nar', "Le lendemain. La mosquée est pleine : tous viennent prêter allégeance. Abû Bakr n'a pas dormi. Il n'a jamais voulu de cette charge, et il sait ce qu'elle pèse."]
        ] },
        { text: "Prendre la parole devant les croyants", goto: 'mosquee_cour', then: [
          ['quote', "Ô gens ! J'ai été placé à votre tête, et je ne suis pas le meilleur d'entre vous. Si j'agis bien, aidez-moi ; si j'agis mal, redressez-moi. La véracité est un dépôt, et le mensonge une trahison.", "Abû Bakr, discours d'investiture — Ibn Hishâm, as-Sîra"],
          ['quote', "Le faible parmi vous est fort auprès de moi, jusqu'à ce que je lui rende son droit. Le fort parmi vous est faible auprès de moi, jusqu'à ce que je lui reprenne le droit d'autrui.", "Abû Bakr, discours d'investiture — Ibn Hishâm, as-Sîra"],
          ['quote', "Obéissez-moi tant que j'obéis à Allah et à Son Messager. Si je leur désobéis, vous ne me devez plus obéissance.", "Abû Bakr, discours d'investiture — Ibn Hishâm, as-Sîra"],
          ['codex', 'investiture']
        ] }
      ],
      outro: [
        ['nar', "Râwî, retiens ceci : le premier acte du premier successeur fut de dire qu'il pouvait se tromper. Les idoles, elles, ne demandent jamais qu'on les redresse."],
        ['nar', "Mais hors de Médine, les tribus apprennent la nouvelle. Et le désert se met à murmurer."]
      ]
    },

    /* ═════════ 2. L'ARMÉE D'USÂMA ═════════ */
    {
      id: 'ab2', title: "L'Armée d'Usâma", sub: "An 11 H · 632 · Médine",
      map: 'medine', opts: { time: 'dusk' }, start: 'maison',
      party: ['abubakr'],
      npcs: [
        { id: 'umar', name: "'Umar", hero: 'umar', at: ['souk', -1, 0],
          talk: [['say', 'umar', "Où vas-tu, chargé comme un marchand ?"]] },
        { id: 'abuubayda', name: "Abû 'Ubayda", hero: 'abuubayda', at: ['souk', 1, 0],
          talk: [['say', 'abuubayda', "Paix sur toi, successeur du Messager d'Allah."]] },
        { id: 'marchand', name: 'Vieux marchand', at: ['souk', 2, 2], look: { kind: 'ancien', robe: '#7d6a4f', head: '#eee6d2' },
          talk: [['say', 'marchand', "Hier on lui prêtait allégeance ; ce soir il voulait encore vendre ses étoffes lui-même. Dis-moi quel roi fait cela."]] },
        { id: 'garde', name: 'Garde des passes', at: ['porte_sud', 1, -1], look: { kind: 'soldat', robe: '#5a4632', head: '#d8cfc0' },
          talk: [['say', 'garde', "'Alî, az-Zubayr, Talha et Ibn Mas'ûd tiennent les passes de la ville. Médine ne dort plus que d'un œil."]] },
        { id: 'usama', name: "Usâma ibn Zayd", at: ['porte_nord', 0, -1], look: { kind: 'compagnon', robe: '#4f5f73', head: '#ece6d6', aura: '#cfe4ff' },
          talk: [['say', 'usama', "L'armée est prête. Nous n'attendons qu'un mot du successeur du Messager d'Allah."]] },
        { id: 'soldat', name: "Soldat d'Usâma", at: ['porte_nord', 2, 0], look: { kind: 'soldat', robe: '#5c5140', head: '#ddd3c0' },
          talk: [['say', 'soldat', "Notre émir n'a pas vingt ans. Mais c'est le Messager d'Allah ﷺ qui a noué son étendard. Qui oserait le dénouer ?"]] },
        { id: 'delegue', name: 'Délégué des tribus', at: ['mosquee_porte', 1, 2], hidden: true, look: { kind: 'homme', robe: '#6e5540', head: '#cfc2a8' } }
      ],
      foes: [
        { id: 'f_d1', map: 'desert', at: 'dunes', group: ['reniement', 'reniement', 'mot_clan'], bg: 'desert' },
        { id: 'f_oasis', map: 'desert', at: 'oasis', group: ['reniement', 'mot_clan'], bg: 'desert' },
        { id: 'f_n2', map: 'noos', at: 'noeud1', group: ['mot_clan', 'mot_clan', 'reniement'], bg: 'noos' }
      ],
      chests: [
        { at: ['puits', 1, 0], item: 'eau', n: 1 },
        { map: 'desert', at: ['oasis', 1, 1], item: 'pain', n: 2 },
        { map: 'noos', at: 'faille', item: 'siwak', n: 1 }
      ],
      intro: [
        ['title', "L'Armée d'Usâma", "Été de l'an 11 de l'Hégire"],
        ['amb', 'vent'],
        ['nar', "La nouvelle a couru plus vite que les chameaux. De tribu en tribu, on dit : « L'homme est mort ; nos pactes aussi. » Certains renient. D'autres gardent la prière et refusent la zakât. D'autres suivent des menteurs."],
        ['nar', "Les chroniqueurs disent que les musulmans étaient alors « comme des brebis sous la pluie, par une nuit d'hiver ». Et le calife de ce peuple transi, ce soir, porte des étoffes sur son épaule."]
      ],
      objectives: [
        { text: "Porter les étoffes au marché", goto: 'souk', then: [
          ['say', 'umar', "Où vas-tu, successeur du Messager d'Allah ?"],
          ['say', 'abubakr', "Au marché."],
          ['say', 'umar', "Qu'irais-tu y faire, toi qui portes désormais la charge des musulmans ?"],
          ['say', 'abubakr', "Et de quoi nourrirai-je les miens ?"],
          ['say', 'abuubayda', "Viens. Nous te fixerons sur le Trésor la part d'un homme parmi les Émigrés : ni la plus haute, ni la plus basse."],
          ['nar', "Ainsi fut fixée la subsistance du premier calife : de quoi vivre, un vêtement pour l'été, un vêtement pour l'hiver. Ibn Sa'd l'a consigné."],
          ['hide', 'umar'], ['hide', 'abuubayda'], ['join', 'umar'], ['join', 'abuubayda']
        ] },
        { text: "Tenir conseil sur la place", goto: 'place', then: [
          ['nar', "L'armée que le Messager d'Allah ﷺ avait préparée pour les marches de Syrie campe encore à al-Jurf, sous les ordres d'Usâma ibn Zayd, qui n'a pas vingt ans."],
          ['say', 'umar', "Les tribus se retournent contre nous, et cette armée est le gros de nos forces. Les gens te demandent de la retenir : Médine est sans défense."],
          ['say', 'abuubayda', "Et certains ajoutent : s'il faut qu'elle parte, donne-lui au moins un chef plus âgé."],
          ['choice', "Faut-il laisser partir l'armée d'Usâma ?", [
            { t: "Retenir l'armée : Médine d'abord, la Syrie attendra.", r: [
              ['nar', "Défaire par prudence le dernier ordre laissé en suspens ? La peur aurait alors commandé à la place du Messager ﷺ. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "La laisser partir, mais sous un chef plus âgé et plus aguerri.", r: [
              ['nar', "Il répondit, dit-on : « Le Messager d'Allah ﷺ l'a nommé, et tu voudrais que je le destitue ? » Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Envoyer l'armée, telle que le Messager d'Allah ﷺ l'a ordonnée.", ok: true, r: [
              ['quote', "Par Celui qui tient mon âme dans Sa main, si je pensais que les fauves allaient m'emporter, j'enverrais l'armée d'Usâma comme l'a ordonné le Messager d'Allah ﷺ, dussé-je rester seul dans la cité.", "Abû Bakr — at-Tabarî, Târîkh"] ] }
          ]],
          ['nar', "Râwî, vois : ce n'est pas de l'entêtement. La véracité, c'est aussi tenir une parole quand elle coûte."]
        ] },
        { text: "Accompagner l'armée à la porte nord", goto: 'porte_nord', then: [
          ['sfx', 'duff'],
          ['nar', "Al-Jurf, à la sortie de la ville. Trois mille hommes, dit-on, sont en selle. Usâma est monté ; le calife marche à pied, à hauteur de son étrier."],
          ['say', 'usama', "Ô successeur du Messager d'Allah ! Par Allah, ou bien tu montes, ou bien je descends."],
          ['quote', "Par Allah, tu ne descendras pas, et je ne monterai pas ! Que m'en coûte-t-il de couvrir mes pieds de poussière, une heure, dans le sentier d'Allah ?", "Abû Bakr à Usâma — at-Tabarî, Târîkh"],
          ['say', 'abubakr', "Si tu juges bon de me laisser 'Umar pour m'assister, fais-le."],
          ['say', 'usama', "Je te le laisse."],
          ['nar', "Le calife demande la permission à un chef de vingt ans, devant toute l'armée. Puis il arrête les rangs et leur confie dix consignes."],
          ['nar', "Ne trahissez pas. Ne fraudez pas. Ne mutilez pas. N'attentez à la vie d'aucun être sans défense. Ne coupez ni ne brûlez les palmiers ; n'abattez aucun arbre fruitier."],
          ['nar', "N'égorgez de bête que pour vous nourrir. Et ceux que vous trouverez retirés dans leurs ermitages, laissez-les à ce à quoi ils se sont voués."],
          ['walk', 'usama', ['porte_nord', 0, -4]], ['hide', 'usama'], ['hide', 'soldat'],
          ['give', 'eau', 2],
          ['codex', 'usama'], ['codex', 'consignes'],
          ['nar', "L'armée s'éloigne vers le nord. Médine n'a plus pour rempart que ceux qui restent — et déjà des délégations se présentent à la mosquée."],
          ['show', 'delegue']
        ] },
        { text: "Recevoir les délégations des tribus, devant la mosquée", talk: 'delegue', then: [
          ['say', 'delegue', "Nous ne renions rien. Nous prierons comme avant. Mais la zakât, nous la remettions à un homme, et cet homme n'est plus. Dispense-nous-en, et nous sommes tes alliés."],
          ['say', 'umar', "Successeur du Messager d'Allah, use de douceur avec eux. Comment combattre des gens qui attestent qu'il n'est de dieu qu'Allah ? Les tribus sont partout contre nous."],
          ['choice', "Les tribus garderaient la prière, mais plus la zakât. Que décide Abû Bakr ?", [
            { t: "Suivre l'avis de 'Umar : fermer les yeux, le temps que l'orage passe.", r: [
              ['nar', "Ce qu'on retranche aujourd'hui par peur, on ne le rétablit pas demain. Et le droit du pauvre n'était pas à lui pour qu'il en fasse remise. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Les renvoyer chargés de présents, pour gagner du temps.", r: [
              ['nar', "Acheter la paix avec le dû des pauvres, c'était déjà donner raison à l'Avare. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Tenir : la prière et la zakât ne se séparent pas.", ok: true, r: [
              ['quote', "Par Allah, je combattrai quiconque sépare la prière de la zakât, car la zakât est le droit dû sur les biens. S'ils me refusaient une entrave de chameau qu'ils remettaient au Messager d'Allah ﷺ, je les combattrais pour ce refus.", "Abû Bakr — al-Bukhârî et Muslim"],
              ['quote', "Par Allah, je vis qu'Allah avait ouvert la poitrine d'Abû Bakr à cette décision, et je sus que c'était la vérité.", "'Umar ibn al-Khattâb — al-Bukhârî et Muslim"] ] }
          ]],
          ['hide', 'delegue'],
          ['nar', "Les délégués repartent. Ils ont compté, en passant, le peu d'hommes restés dans la ville. Abû Bakr poste des gardes aux passes de Médine et rassemble les gens dans la mosquée."],
          ['say', 'abubakr', "Le pays s'est retourné autour de vous, et leurs envoyés ont vu votre petit nombre. Vous ne savez s'ils viendront de nuit ou de jour. Tenez-vous prêts."]
        ] },
        { auto: true, then: [
          ['nar', "Trois nuits plus tard, ils vinrent."],
          ['map', 'desert', 'depart', { time: 'night' }],
          ['amb', 'nuit'],
          ['nar', "Les abords de Médine, sur la piste de Dhû l-Qassa. Le calife est sorti lui-même, de nuit, à la tête de ceux qui restaient. Dans l'envers du désert, le reniement a pris corps."]
        ] },
        { text: "Repousser les nuées du reniement, dans les dunes", foe: 'f_d1', then: [
          ['nar', "Les nuées refluent vers l'est. On raconte que les assaillants faisaient rouler des outres gonflées vers les chameaux pour les affoler. Cette nuit, la ruse ne suffit pas."]
        ] },
        { text: "Poursuivre jusqu'aux rochers de Dhû l-Qassa", goto: 'rochers', then: [
          ['say', 'umar', "Ils se rassemblent derrière les rochers. Ce ne sont plus des murmures : c'est une volonté."],
          ['battle', { group: ['reniement', 'reniement', 'reniement'], bg: 'desert', intro: "« Rentrons chez nos pères. » La nuée fond sur vous." }],
          ['nar', "À l'aube, la piste est libre. Mais le refus lui-même n'est pas brisé : il a une source, et elle n'est pas faite de sable."]
        ] },
        { text: "Trouver la source du refus, dans les ruines", goto: 'ruines', then: [
          ['nar', "Entre les pierres d'un vieux fortin, l'air tremble. Ici l'on a compté, pesé, soustrait : « La prière, soit. Mais ma part reste à moi. »"],
          ['map', 'noos', 'seuil', { hue: 42 }],
          ['amb', 'noos'],
          ['heal'],
          ['nar', "La noosphère du refus. Au loin, une tour de pièces. Pas une ne tombe."]
        ] },
        { text: "Noosphère : atteindre l'Avare du dû", goto: 'coeur', then: [
          ['battle', { group: ['avare', 'mot_clan', 'mot_clan'], bg: 'noos', boss: true, intro: "L'Avare du dû : « Je prie. Je jeûne. Que veut-on de plus ? Ce qui est à moi est à moi. »" }],
          ['sfx', 'break'], ['flash', '#ffe08a'],
          ['nar', "La tour s'effondre en pluie claire. Ce que l'Avare retenait retourne à ceux à qui c'était dû."],
          ['map', 'medine', 'porte_nord', { time: 'dawn' }],
          ['amb', 'vent'], ['sfx', 'duff'],
          ['nar', "Quarante jours ont passé ; d'autres disent soixante-dix. À la porte nord, une poussière : l'armée d'Usâma revient, sauve et chargée."],
          ['nar', "Les tribus qui l'avaient vue passer s'étaient dit : « Si ces gens étaient faibles, ils n'auraient pas envoyé pareille armée. » Une parole tenue avait gardé Médine mieux qu'un rempart."]
        ] }
      ],
      outro: [
        ['codex', 'ridda'], ['codex', 'avare'],
        ['nar', "Râwî : l'Avare ne reniait rien. Il retranchait. C'est ainsi que commencent la plupart des idoles — par une petite soustraction faite au vrai."]
      ]
    },

    /* ═════════ 3. YAMÂMA — LE MENTEUR ═════════ */
    {
      id: 'ab3', title: "Yamâma — le Menteur", sub: "An 11–12 H · 632–633 · Dhû l-Qassa",
      map: 'camp', opts: { time: 'day' }, start: 'entree',
      party: ['abubakr', 'umar', 'abuubayda'],
      npcs: [
        { id: 'ali', name: "'Alî ibn Abî Tâlib", at: ['etendard', 1, 1], look: { kind: 'compagnon', robe: '#3f5a47', head: '#ece6d6', aura: '#d9c2ff' },
          talk: [['say', 'ali', "Qu'il garde Médine : c'est elle, le cœur. Les étendards sauront trouver leur route."]] },
        { id: 'khalid', name: "Khâlid ibn al-Walîd", at: ['etendard', -1, 1], look: { kind: 'compagnon', robe: '#6b3b2e', head: '#e8dfcc', aura: '#ffb59c' },
          talk: [['say', 'khalid', "Onze étendards, onze routes. Le calife voit l'Arabie entière comme d'autres voient leur enclos."]] },
        { id: 'zayd_k', name: "Zayd ibn al-Khattâb", at: 'lignes', look: { kind: 'compagnon', robe: '#75604a', head: '#eee6d4', aura: '#9fd0ff' },
          talk: [['say', 'zayd_k', "Je porterai l'étendard des Émigrés au Yamâma. Dis à mon frère de ne pas s'inquiéter : si les lignes plient, je me tairai, et j'avancerai."]] },
        { id: 'veteran', name: 'Vieux soldat', at: ['feu', 1, 0], look: { kind: 'soldat', robe: '#5a4c3a', head: '#d6ccb8' },
          talk: [['say', 'veteran', "On dit qu'ils sont quarante mille, au Yamâma. Nous, nous avons le Coran dans la poitrine de nos hommes. Je sais lequel des deux pèse le plus."]] },
        { id: 'veilleur', name: 'Veilleur', map: 'medine', at: 'place', look: { kind: 'soldat', robe: '#5a4632', head: '#d8cfc0' },
          talk: [['say', 'veilleur', "Pas un cavalier depuis dix jours. Le calife passe ses nuits à la mosquée."]] },
        { id: 'courrier', name: 'Courrier du Yamâma', map: 'medine', at: ['mosquee_porte', 0, 1], hidden: true, look: { kind: 'soldat', robe: '#6a5a44', head: '#d2c7b0' } },
        { id: 'zaydthabit', name: "Zayd ibn Thâbit", map: 'medine', at: ['mosquee_cour', 1, 0], hidden: true, look: { kind: 'compagnon', robe: '#5f6f84', head: '#f0eadb', aura: '#d9c2ff' } }
      ],
      foes: [
        { id: 'f_k1', map: 'noos', at: 'noeud1', group: ['fausse_rime', 'fausse_rime', 'echo'], bg: 'noos' },
        { id: 'f_kopt', map: 'noos', at: 'miroir', group: ['fausse_rime', 'echo'], bg: 'noos' },
        { id: 'f_camp', at: 'enclos', group: ['reniement', 'reniement'], bg: 'camp' }
      ],
      chests: [
        { at: ['tentes', 1, 1], item: 'lait', n: 1 },
        { map: 'medine', at: ['puits', 1, 0], item: 'musc', n: 1 },
        { map: 'noos', at: 'faille', item: 'miel', n: 1 }
      ],
      intro: [
        ['title', "Yamâma — le Menteur", "Dhû l-Qassa, fin de l'an 11 de l'Hégire"],
        ['amb', 'feu'],
        ['nar', "Dhû l-Qassa, à une étape de Médine. L'armée d'Usâma est rentrée ; le calife reprend l'initiative. Partout en Arabie, des hommes se sont levés qui se disent inspirés. Le plus puissant tient le Yamâma."],
        ['nar', "Il se nomme Musaylima, des Banû Hanîfa. Naguère, il avait écrit pour réclamer « la moitié de la terre ». La réponse l'avait nommé d'un mot, qui lui est resté : al-Kadhdhâb, le Menteur."]
      ],
      objectives: [
        { text: "Nouer les onze étendards", goto: 'etendard', then: [
          ['sfx', 'roll'],
          ['nar', "Abû Bakr noue onze étendards pour onze chefs, et trace à chacun sa route : Khâlid ibn al-Walîd, 'Ikrima, Shurahbîl, 'Amr ibn al-'Âs, al-'Alâ' ibn al-Hadramî… L'Arabie entière, d'un seul geste."],
          ['say', 'khalid', "Mon étendard est noué. Tulayha d'abord ; puis le Yamâma, s'il plaît à Allah."],
          ['nar', "Puis le calife monte en selle, le sabre au côté, résolu à marcher lui-même en tête. Un homme saisit la bride de sa monture : 'Alî ibn Abî Tâlib."],
          ['quote', "Où vas-tu, successeur du Messager d'Allah ? Rengaine ton sabre, et ne nous afflige pas de ta perte. Retourne à Médine : par Allah, si nous te perdions, l'islam n'aurait plus d'ordre.", "On rapporte que 'Alî le lui dit à Dhû l-Qassa — Ibn Kathîr, al-Bidâya wa-n-Nihâya"],
          ['choice', "'Alî tient la bride. Que fait Abû Bakr ?", [
            { t: "Passer outre : un chef doit marcher devant ses hommes.", r: [
              ['nar', "Son courage n'était pas en cause : il l'avait prouvé la nuit de Dhû l-Qassa. Mais celui qui tient l'ensemble ne se risque pas comme une seule lance. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Écouter 'Alî : confier les étendards, et rentrer à Médine.", ok: true, r: [
              ['say', 'abubakr', "Tu dis vrai. Que chacun aille où je l'ai envoyé. Je garderai Médine ; vous, gardez votre parole."],
              ['nar', "Il fait demi-tour. Reconnaître le vrai quand il vient d'un autre : cela aussi s'appelle véracité."] ] }
          ]]
        ] },
        { text: "Regarder partir les colonnes depuis le tertre", goto: 'tertre', then: [
          ['nar', "Onze colonnes s'enfoncent dans onze directions. Parmi ceux qui prendront la route du Yamâma : Zayd, le frère de 'Umar ; Sâlim, l'affranchi qui porte le Coran dans sa poitrine ; al-Barâ' ibn Mâlik. Des récitateurs par centaines."],
          ['say', 'umar', "Zayd m'a devancé en tout : il a cru avant moi. Qu'Allah le garde."]
        ] },
        { auto: true, then: [
          ['map', 'medine', 'porte_nord', { time: 'night' }],
          ['amb', 'nuit'],
          ['nar', "Médine, des semaines plus tard. Tulayha est défait ; les colonnes ont convergé vers le Yamâma. Depuis, plus de nouvelles. Le calife ne dort guère."]
        ] },
        { text: "Veiller dans la cour de la mosquée", goto: 'mosquee_cour', then: [
          ['nar', "Râwî, la Chaîne te montre ce que Médine ignore encore. À 'Aqrabâ', les Banû Hanîfa sont des dizaines de milliers. Les lignes des croyants ont plié jusqu'à la tente de Khâlid."],
          ['nar', "Khâlid crie : « Distinguez-vous, que l'on voie d'où vient la brèche ! » Abû Hudhayfa appelle : « Gens du Coran, parez le Coran de vos actes ! » Sâlim plante l'étendard et ne recule plus."],
          ['nar', "Là-bas, le fer. Mais le Menteur ne tient pas par le fer : il tient par ce que des milliers de cœurs veulent entendre. Ce front-là n'a pas de distance. Il passe par ici."],
          ['say', 'abubakr', "Si je ne puis être à leurs côtés, que du moins rien de faux ne reste debout derrière eux."],
          ['heal'],
          ['map', 'noos', 'seuil', { hue: 305 }],
          ['amb', 'noos'],
          ['nar', "La noosphère du Yamâma. Des rimes creuses flottent comme des feuilles mortes. Tout y ressemble au vrai. Rien ne l'est."]
        ] },
        { text: "Noosphère : briser les fausses rimes", foe: 'f_k1', then: [
          ['nar', "Les rimes se taisent. Il imitait la cadence de la Révélation, sans rien avoir à dire. Derrière elles se dresse un mur : celui d'un jardin."]
        ] },
        { text: "Noosphère : franchir le mur du Jardin", goto: 'noeud3', then: [
          ['nar', "Au Yamâma, les Banû Hanîfa se sont retranchés dans un verger aux hauts murs. Al-Barâ' ibn Mâlik dit : « Jetez-moi par-dessus, sur vos boucliers. » Il retombe seul de l'autre côté, et ouvre la porte."],
          ['battle', { group: ['mur_jardin', 'echo'], bg: 'noos', intro: "Le Mur du Jardin : « Ce qui est derrière moi ne se discute pas. »" }],
          ['nar', "Le mur cède. On appellera ce verger le Jardin de la Mort, tant il en tomba des deux côtés. Au fond, sous les arbres : le cœur du mensonge."],
          ['give', 'musc', 1], ['heal']
        ] },
        { text: "Noosphère : affronter al-Kadhdhâb", goto: 'coeur', then: [
          ['nar', "Un miroir immense, tourné vers la foule. Chacun y voit ce qu'il désire : un prophète de sa tribu, une religion sans effort, la moitié de la terre."],
          ['battle', { group: ['kadhdhab'], bg: 'noos', boss: true, intro: "Al-Kadhdhâb : « Je ne mens pas. Je dis ce qu'ils veulent entendre. »" }],
          ['sfx', 'break'], ['flash', '#ffe9a8'],
          ['nar', "Le miroir se fend. Il n'y avait rien derrière. À la même heure, dans le jardin, le Menteur tombe, et les Banû Hanîfa déposent les armes."],
          ['map', 'medine', 'mosquee_cour', { time: 'dawn' }],
          ['amb', 'silence'],
          ['show', 'courrier']
        ] },
        { text: "Recevoir le courrier du Yamâma, à la porte de la mosquée", talk: 'courrier', then: [
          ['say', 'courrier', "Successeur du Messager d'Allah : la victoire. Le Menteur est mort, et le Yamâma est revenu à l'islam."],
          ['say', 'courrier', "Mais nous avons enterré douze cents des nôtres. Zayd ibn al-Khattâb. Sâlim. Abû Hudhayfa. Thâbit ibn Qays. Et des récitateurs par dizaines, de ceux qui portaient le Coran tout entier."],
          ['quote', "Il m'a devancé vers les deux biens : il a embrassé l'islam avant moi, et il est tombé martyr avant moi.", "'Umar, à la mort de son frère Zayd — Ibn Sa'd, at-Tabaqât"],
          ['hide', 'courrier'],
          ['codex', 'yamama'], ['codex', 'kadhdhab'],
          ['nar', "Quelques jours passent. 'Umar revient trouver le calife, et ce n'est plus de son frère qu'il parle."],
          ['say', 'umar', "La mort a frappé durement les récitateurs, au Yamâma. Je crains qu'elle ne les frappe ailleurs encore, et qu'une grande part du Coran ne se perde. Je suis d'avis que tu ordonnes de le rassembler."],
          ['choice', "Rassembler le Coran en un seul recueil : nul ne l'a fait avant lui. Que répond Abû Bakr ?", [
            { t: "Refuser net : on n'ajoute pas un acte à ce que le Messager ﷺ a laissé.", r: [
              ['nar', "Ce fut bien sa première parole. Mais il ne ferma pas la porte : il laissa 'Umar y revenir, encore et encore. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Accepter sur-le-champ : l'urgence commande.", r: [
              ['nar', "Il ne décida rien dans la hâte. Un homme véridique pèse d'abord ce qu'il doit à ce qui lui fut confié. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Hésiter, écouter 'Umar jusqu'au bout, puis s'y résoudre.", ok: true, r: [
              ['quote', "Comment ferais-je une chose que le Messager d'Allah ﷺ n'a pas faite ?", "Abû Bakr à 'Umar — al-Bukhârî, as-Sahîh"],
              ['say', 'umar', "Par Allah, c'est un bien."],
              ['nar', "'Umar ne cessa d'y revenir, jusqu'à ce qu'Allah ouvre la poitrine d'Abû Bakr à ce qu'Il avait ouvert celle de 'Umar. Alors le calife fit appeler un jeune homme."] ] }
          ]],
          ['show', 'zaydthabit']
        ] },
        { text: "Confier la tâche à Zayd ibn Thâbit", talk: 'zaydthabit', then: [
          ['say', 'abubakr', "Tu es un homme jeune et sensé, et nous ne te soupçonnons de rien. Tu écrivais la Révélation pour le Messager d'Allah ﷺ. Suis donc le Coran à la trace, et rassemble-le."],
          ['quote', "Par Allah, s'ils m'avaient chargé de déplacer une montagne, cela ne m'eût pas été plus lourd que ce qu'il m'ordonna : rassembler le Coran.", "Zayd ibn Thâbit — al-Bukhârî, as-Sahîh"],
          ['nar', "Zayd le recueille sur les tiges de palmier, les pierres plates, et dans la poitrine des hommes. Pour chaque verset, rapporte-t-on, il exige des témoins. Les feuillets resteront chez Abû Bakr jusqu'à sa mort."],
          ['sfx', 'light'],
          ['codex', 'jam_quran']
        ] }
      ],
      outro: [
        ['nar', "Râwî, comprends-tu ? Le Menteur contrefaisait la Parole. La réponse ne fut pas seulement une bataille : ce fut une chaîne de témoins, verset après verset. Un isnâd."],
        ['nar', "C'est cette chaîne que tu tiens entre tes mains."]
      ]
    }
  ]
});
