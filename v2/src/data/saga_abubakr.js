/* ISNAD — Saga I : Abû Bakr as-Siddîq (11–13 H · 632–634). Lumière : Véracité (sidq).
   Sources : al-Bukhârî, Muslim, Ibn Hishâm, at-Tabarî, Ibn Sa'd, Ibn Kathîr. Dialogues « say » dramatisés.
   v2 : la parole avant le fer — pourparlers (bords de la Saqîfa, Banû Rimth), haltes de prière, savoir, piliers.
   Fiction signalée comme telle : Thâmir le courtier (hypocrite), les Banû Rimth et leur cheikh Dirghâm. */
ISNAD.registerSaga({
  id: 'abubakr', order: 1,
  name: "Abû Bakr as-Siddîq", epithet: 'As-Siddîq', arabic: 'أبو بكر',
  years: '11–13 H · 632–634',
  light: 'sidq', lightName: 'Véracité',
  ambiance: 'orientale',
  tagline: "Le jour où tout pouvait se défaire, un homme doux a dit le vrai.",

  intro: [
    ['mus', 'chaine'],
    ['title', "Abû Bakr as-Siddîq", "Saga I · Le Véridique"],
    ['nar', "Râwî, voici le premier maillon. 'Abdallâh ibn Abî Quhâfa, marchand d'étoffes de La Mecque, que tous appelaient Abû Bakr. Un homme doux, prompt aux larmes ; parmi les tout premiers à croire."],
    ['nar', "Il donna sa fortune pour racheter des croyants opprimés. Sur la route de l'Hégire, il fut le compagnon de la Grotte, quand ils n'étaient que deux."],
    ['nar', "Un matin, La Mecque se moqua : le Messager d'Allah ﷺ disait avoir été mené de nuit jusqu'à Jérusalem. On courut chez Abû Bakr, certain de le voir vaciller."],
    ['quote', "S'il l'a dit, il a dit vrai.", "Abû Bakr — rapporté par Ibn Hishâm, as-Sîra"],
    ['nar', "De ce jour on l'appela as-Siddîq : celui qui tient pour vrai ce qui est vrai, quoi qu'il en coûte. C'est cette Lumière que tu viens chercher."],
    ['nar', "Mais retiens d'abord ceci, râwî : avant chaque combat, il parla. Aux Ansâr, aux tribus, aux envoyés. Le sabre ne vint qu'après la parole, jamais à sa place. Et la parole, il la prenait au sortir de la prière."],
    ['nar', "Trois idoles l'attendent dans la noosphère : le Déni, qui refuse la mort ; le Clan, qui déchire ; le Menteur, qui contrefait. La Chaîne s'ouvre au jour le plus sombre."]
  ],

  outro: [
    ['mus', 'deuil'],
    ['nar', "Deux ans, trois mois et quelques jours. En ce peu de temps : l'Arabie rassemblée, le Coran recueilli, les armées en marche vers l'Irak et la Syrie. Puis la fièvre le prend, à l'été de l'an 13."],
    ['nar', "Il consulte les Compagnons, puis dicte à 'Uthmân son dernier acte : il désigne 'Umar. À ceux qui redoutent la rudesse de 'Umar, il répond qu'elle s'adoucira sous la charge."],
    ['nar', "Il fait rendre au Trésor ce qu'il en a reçu pour vivre. 'Umar pleure : « Qu'Allah fasse miséricorde à Abû Bakr ; il a épuisé ceux qui viendront après lui. »"],
    ['quote', "Lavez ces deux vêtements que je porte, et ensevelissez-moi dedans. Le vivant a plus besoin du neuf que le mort.", "Abû Bakr, sur son lit de mort — al-Bukhârî, as-Sahîh"],
    ['nar', "Il s'éteint le 22 Jumâdâ al-Âkhira de l'an 13, à soixante-trois ans. On l'enterre de nuit, auprès du Messager d'Allah ﷺ, qu'il avait suivi en tout."],
    ['mus', 'espoir'],
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
      look: { robe: '#efe9dc', head: '#f6f1e4', cloak: '#b08d4a', aura: '#ffe9a8', coiffe: 'imama', manteau: 'epaule' },
      skills: [
        { lvl: 1, id: 'parole', name: 'Parole véridique', desc: "Dit le vrai sans détour. Dégâts de Véracité.", cost: 3,
          target: 'foe', el: 'sidq', pow: 1.4, anim: 'light' },
        { lvl: 1, id: 'apaisement', name: 'Apaisement', desc: "Une parole douce relève un cœur : rend de la Constance à un compagnon.", cost: 4,
          target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 2, id: 'lignees', name: 'Science des lignées', desc: "Nul ne connaissait mieux les généalogies des Arabes : révèle les failles d'une chimère.", cost: 2,
          target: 'foe', el: 'ilm', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 3, id: 'fermete', name: 'Fermeté', desc: "« Je ne dénouerai pas un étendard qu'il a noué. » Renforce la garde du groupe.", cost: 5,
          target: 'allies', fx: [{ st: 'def', v: 1, turns: 3 }], anim: 'guard' },
        { lvl: 5, id: 'affranchir', name: 'Affranchir', desc: "Il rachetait les opprimés : retire les altérations d'un compagnon et lui rend un peu de Constance.", cost: 5,
          target: 'ally', heal: 0.5, fx: [{ st: 'cleanse' }], anim: 'heal' },
        { lvl: 7, id: 'certitude', name: 'Certitude', desc: "« S'il l'a dit, il a dit vrai. » Lourds dégâts de Véracité, déchire un voile.", cost: 8,
          target: 'foe', el: 'sidq', pow: 1.9, fx: [{ st: 'veil', v: -1 }], anim: 'pillar' }
      ],
      limit: { id: 'siddiq', name: 'As-Siddîq', desc: "La véracité à nu : frappe toutes les chimères, déchire leurs voiles et révèle leurs failles.",
               target: 'foes', el: 'sidq', pow: 1.6, fx: [{ st: 'veil', v: -2 }, { st: 'reveal' }], anim: 'pillar' }
    },
    umar: {
      name: "'Umar", title: 'Al-Fârûq', arabic: 'عمر',
      role: 'gardien', el: 'adl',
      look: { robe: '#6b4a32', head: '#2f3a55', cloak: '#3d2c1e', aura: '#9fd0ff', coiffe: 'imama_large', manteau: 'ample', item: 'durra' },
      skills: [
        { lvl: 1, id: 'durra', name: 'La Durra', desc: "Coup de férule. Peut étourdir.", cost: 3,
          target: 'foe', el: 'fer', pow: 1.3, fx: [{ st: 'stun', chance: 0.3 }], anim: 'slash' },
        { lvl: 1, id: 'firasa', name: 'Firâsa', desc: "Discerne les failles d'une chimère. Légers dégâts de Justice.", cost: 2,
          target: 'foe', el: 'adl', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 2, id: 'rempart', name: 'Rempart', desc: "Se dresse devant les siens : attire les coups et les amortit.", cost: 4,
          target: 'self', fx: [{ st: 'taunt', turns: 2 }, { st: 'garde' }], anim: 'guard' },
        { lvl: 4, id: 'equite', name: 'Équité', desc: "La même mesure pour tous : dégâts de Justice à toutes les chimères.", cost: 6,
          target: 'foes', el: 'adl', pow: 0.9, anim: 'wave' },
        { lvl: 6, id: 'hardiesse', name: 'Hardiesse', desc: "Charge sans calcul. Dégâts de Courage, abaisse la garde de la cible.", cost: 6,
          target: 'foe', el: 'shajaa', pow: 1.6, fx: [{ st: 'def', v: -1 }], anim: 'burst' },
        { lvl: 8, id: 'droit', name: 'Rendre le droit', desc: "Reprend au fort ce qu'il a pris. Lourds dégâts de Justice, dissipe les bonus.", cost: 8,
          target: 'foe', el: 'adl', pow: 1.9, fx: [{ st: 'dispel' }], anim: 'pillar' }
      ],
      limit: { id: 'faruq', name: 'Al-Fârûq', desc: "Sépare le vrai du faux : frappe toutes les chimères, dissipe leurs bonus et déchire leurs voiles.",
               target: 'foes', el: 'adl', pow: 1.5, fx: [{ st: 'dispel' }, { st: 'veil', v: -2 }], anim: 'pillar' }
    },
    abuubayda: {
      name: "Abû 'Ubayda", title: 'Amîn al-Umma', arabic: 'أبو عبيدة',
      role: 'soigneur', el: 'rahma',
      look: { robe: '#6f7f6a', head: '#eae4d2', cloak: '#4b5a4a', aura: '#8ff0e0', coiffe: 'calotte', manteau: 'aucun', echarpe: true },
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
      desc: "Chimère née du deuil de tout un peuple. Elle ne veut aucun mal : elle veut que rien ne change. Mais qui s'attache à la personne plutôt qu'au message finit par adorer un souvenir."
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
    clan: { racine: 'noir_peur',
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
    avare: { racine: 'avarice',
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
      desc: "Chimère de la soustraction. Elle ne renie rien : elle garde la prière et retranche la part du pauvre. Une tour de pièces dont aucune ne tombe."
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
    kadhdhab: { racine: 'avidite',
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
      desc: "Chimère de la contrefaçon. Elle n'attaque pas le vrai de front : elle l'imite, l'allège, et promet à chacun ce qu'il désire. Un miroir tourné vers la foule ; seule la véracité le fend."
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
      text: "Chimère née du deuil de tout un peuple. Elle ne veut aucun mal : elle veut seulement que rien ne change, et murmure que l'être aimé reviendra. Mais qui s'attache à la personne plutôt qu'au message finit par adorer un souvenir. On la dissipe par la véracité, dite avec douceur, et par la patience. Elle revient chaque fois qu'une foule préfère un nom à une vérité." },
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
      text: "Chimère de la soustraction. Elle ne renie rien : elle garde la prière et retranche la part du pauvre. Elle prend la forme d'une tour de pièces dont aucune ne tombe. La justice l'ébranle, car la zakât est un droit et non une faveur ; la miséricorde et la véracité achèvent de la défaire. La plupart des idoles commencent ainsi : par une petite soustraction faite au vrai." },
    { id: 'yamama', cat: 'Événement', title: "Yamâma et le Jardin de la Mort",
      text: "À 'Aqrabâ', dans le Yamâma (fin 11 – début 12 H), l'armée de Khâlid ibn al-Walîd affronte les Banû Hanîfa rassemblés autour de Musaylima. C'est la bataille la plus dure de la Ridda ; les lignes des croyants plient avant de se reformer clan par clan. Les Banû Hanîfa se retranchent dans un verger clos qu'al-Barâ' ibn Mâlik ouvre de l'intérieur : on l'appellera le Jardin de la Mort. Musaylima y est tué. Environ douze cents musulmans tombent, dont de très nombreux récitateurs du Coran.",
      src: "at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya wa-n-Nihâya" },
    { id: 'kadhdhab', cat: 'Noosphère', title: "Al-Kadhdhâb — le Menteur",
      text: "Chimère de la contrefaçon, née autour de Musaylima. Elle n'attaque pas le vrai de front : elle l'imite, l'allège, et promet à chacun ce qu'il désire — un prophète de sa tribu, une religion sans exigence, « la moitié de la terre ». C'est un miroir tourné vers la foule. Seule la véracité le fend ; le savoir distingue l'original de la copie, et la patience refuse ses promesses rapides. Elle change de nom à chaque époque." },
    { id: 'jam_quran', cat: 'Événement', title: "Le rassemblement du Coran",
      text: "Après le Yamâma, 'Umar craint que le Coran ne se perde avec ses récitateurs et presse Abû Bakr de le rassembler. D'abord hésitant devant un acte que le Messager ﷺ n'avait pas accompli, Abû Bakr s'y résout et en charge Zayd ibn Thâbit, ancien scribe de la Révélation. Zayd recueille les versets sur les tiges de palmier, les pierres plates et dans la mémoire des hommes, en exigeant des témoins. Les feuillets restent chez Abû Bakr, puis chez 'Umar.",
      src: "al-Bukhârî, as-Sahîh (récit de Zayd ibn Thâbit)" },
    { id: 'lignees', cat: 'Parole', title: "La science des lignées",
      text: "Abû Bakr passait pour le plus savant de Quraysh en généalogies : on rapporte que le Messager d'Allah ﷺ renvoya vers lui le poète Hassân ibn Thâbit pour s'en instruire. Il savait ainsi qu'al-Aws et al-Khazraj, les deux tribus des Ansâr, descendaient de deux frères, et s'étaient pourtant fait la guerre des générations durant, jusqu'à la journée de Bu'âth, peu avant l'Hégire. Ce n'est pas le sang qui les avait unis.",
      src: "Muslim (récit de Hassân) ; Ibn Hishâm, as-Sîra" },
    { id: 'imamat', cat: 'Événement', title: "« Ordonnez à Abû Bakr de diriger la prière »",
      text: "Durant sa dernière maladie, le Messager d'Allah ﷺ ordonna qu'Abû Bakr dirige la prière à sa place, et le répéta quand on lui proposa un autre. À la Saqîfa, rapporte-t-on, 'Umar le rappela aux Ansâr : qui d'entre vous accepterait de passer devant celui que le Messager ﷺ a fait passer devant ? Ils répondirent : « Nous cherchons refuge auprès d'Allah de passer devant Abû Bakr. »",
      src: "al-Bukhârî ; Muslim ; an-Nasâ'î et Ahmad (parole de 'Umar)" },
    { id: 'priere_repos', cat: 'Parole', title: "« Donne-nous par elle le repos »",
      text: "On rapporte que le Messager d'Allah ﷺ disait à Bilâl : « Ô Bilâl, appelle à la prière : donne-nous par elle le repos. » Dans la Chaîne, la prière n'est pas une formule qui répare. C'est la halte où celui qui porte une charge la dépose un instant devant plus grand que lui, et la reprend plus légère. Qui s'y arrête avant de parler aux hommes parle ensuite plus juste.",
      src: "Abû Dâwûd, as-Sunan ; Ahmad, al-Musnad" },
    { id: 'zakat_droit', cat: 'Parole', title: "« Prise à leurs riches, rendue à leurs pauvres »",
      text: "En envoyant Mu'âdh ibn Jabal au Yémen, le Messager d'Allah ﷺ lui fit enseigner que la zakât est « prise à leurs riches et rendue à leurs pauvres ». Ce n'est donc ni un tribut versé à un homme, ni une faveur qu'un chef pourrait remettre : c'est le droit du pauvre sur le bien du riche, et il revient d'abord aux pauvres du lieu même où il est prélevé.",
      src: "al-Bukhârî ; Muslim (envoi de Mu'âdh au Yémen)" },
    { id: 'banu_rimth', cat: 'Événement', title: "Les Banû Rimth (clan de fiction)",
      text: "Des délégations vinrent bien demander à Abû Bakr la remise de la zakât : cela est rapporté. Parmi elles, la Chaîne imagine un clan de pasteurs, les Banû Rimth, et son cheikh Dirghâm ; leur histoire est inventée. Elle montre ce que les chroniques laissent dans l'ombre : toutes les tribus ne se retournèrent pas, et plusieurs furent gardées par la parole. Ainsi 'Adî ibn Hâtim apporta-t-il à Médine la zakât des Tayy, quand tant d'autres la retenaient.",
      src: "at-Tabarî, Târîkh ; Muslim (pour 'Adî ibn Hâtim)" },
    { id: 'registre_courtier', cat: 'Noosphère', title: "Le feuillet du courtier (fiction)",
      text: "Un compte oublié sur un étal du souk : trente chamelles « de zakât » rachetées aux Banû Rimth pour le prix de dix, « en attendant que le calife plie ». Pièce de fiction. Elle rappelle une règle simple de la Chaîne : avant de croire celui qui conseille, regarde ce qu'il gagne à son conseil." },
    { id: 'thamir', cat: 'Noosphère', title: "Thâmir le courtier (personnage de fiction)",
      text: "Thâmir ibn Ghânim, courtier du souk de Médine, n'a pas existé. La Chaîne l'invente pour donner un visage à l'hypocrisie (nifâq) : dire aux uns ce qu'ils veulent entendre, aux autres le contraire, et servir entre les deux son propre compte. Les sources parlent des hypocrites de Médine sans toujours les nommer ; aucun Compagnon, aucune tribu, aucune communauté n'est visé ici. L'hypocrite n'est pas l'étranger : il est du dedans." },
    { id: 'chevres', cat: 'Parole', title: "Les chèvres du quartier", text: "On rapporte qu'Abû Bakr trayait les chèvres des gens de son quartier. Devenu calife, il continua, et alla encore quelque temps au marché porter ses étoffes, jusqu'à ce qu'on lui fixe de quoi vivre sur le Trésor. Dans le jeu, bâtir un enclos donne du lait à chaque chapitre.", src: "Ibn Sa'd, at-Tabaqât al-Kubrâ" },
    { id: 'fosse', cat: 'Événement', title: "Le Fossé", text: "En l'an 5 de l'Hégire, une coalition marcha sur Médine. Sur le conseil de Salmân al-Fârisî, les musulmans creusèrent un fossé au nord de la ville : un stratagème venu de Perse, inconnu des Arabes, qui arrêta la cavalerie. Pendant la Ridda, les sources disent qu'Abû Bakr posta des gardes aux passes de Médine ; qu'on y ait creusé de nouveau est une liberté du jeu.", src: "Ibn Hishâm, as-Sîra ; at-Tabarî, Târîkh" },
    { id: 'batir', cat: 'Lieu', title: "Bâtir d'abord un lieu de prière", text: "À Qubâ' puis à Médine, la première chose bâtie fut une mosquée : des briques de terre crue, des troncs de palmier pour piliers, des palmes pour toit. Les villes fondées ensuite, Basra, Koufa, Fustât, commencèrent de même. Le jeu te laisse poser ces blocs toi-même sur chaque terre gagnée ; les sources ne disent pas qu'on bâtit à Dhû l-Qassa.", src: "Ibn Hishâm, as-Sîra ; al-Balâdhurî, Futûh al-Buldân" },
    { id: 'najran', cat: 'Événement', title: "Le pacte de Najrân confirmé",
      text: "Les chrétiens de Najrân, au sud de l'Arabie, avaient reçu du Messager d'Allah ﷺ un pacte écrit garantissant leurs personnes, leurs biens et leur culte. À sa mort, ils vinrent demander ce que valait encore l'écrit. On rapporte qu'Abû Bakr leur en fit rédiger la confirmation, dans les mêmes termes. Un pacte ne meurt pas avec celui qui l'a donné : il oblige ceux qui lui succèdent.",
      src: "at-Tabarî, Târîkh ; Abû Yûsuf, Kitâb al-Kharâj" }
  ],

  /* ───────────────────────────── CHAPITRES ───────────────────────────── */
  chapters: [
    /* ═════════ 1. LE JOUR LE PLUS SOMBRE ═════════ */
    {
      id: 'ab1', title: "Le Jour le plus sombre", sub: "An 11 H · 632 · Médine",
      // bataille déclarée, sans rangs : sous l'auvent, il n'y a que des gens à réunir
      bataille: { rangs: [], mot: 'Sous l’auvent, il n’y a pas de rangs à mener : il y a des gens à réunir.' },
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
          talk: [['say', 'bashir', "Nous n'avons pas secouru cette religion pour en tirer une part de ce monde. Ne l'oublions pas aujourd'hui."]] },
        { id: 'fidele', name: 'Un fidèle', at: ['priere', -1, 1], look: { kind: 'homme', robe: '#7a6f5a', head: '#e9e1cf' },
          talk: [
            ['say', 'fidele', "L'heure de la prière ne s'arrête pas pour le deuil. Qui doit parler aux hommes, aujourd'hui, ferait bien de s'adresser d'abord à son Seigneur."],
            ['codex', 'priere_repos'] ] },
        { id: 'maitre', name: "Maître d'école", at: ['ecole', 0, 1], look: { kind: 'savant', robe: '#e6dfcc', head: '#f2ecdc' },
          talk: [
            ['say', 'maitre', "Abû Bakr… Les enfants récitent les lignées que tu m'as apprises. Al-Aws et al-Khazraj : deux frères, et tant de sang entre leurs fils, jusqu'à Bu'âth. Ce n'est pas la lignée qui a fait d'eux des frères."],
            ['codex', 'lignees'] ] },
        { id: 'thamir', name: 'Thâmir le courtier', at: ['halle', 3, 3], look: { kind: 'marchand', robe: '#7a4f3a', head: '#d9c9a8', cloak: '#4a2f22' },
          talk: [['say', 'thamir', "Abû Bakr ! Quel jour, quel jour… Hâte-toi sous l'auvent : les Ansâr n'attendent que toi, et ils te sont tout acquis. Je le leur disais à l'instant."]] }
      ],
      foes: [
        { id: 'f_deni', map: 'noos', at: 'coeur', group: ['deni', 'murmure'], bg: 'noos' },
        { id: 'f_n1', map: 'noos', at: 'noeud2', group: ['murmure', 'murmure'], bg: 'noos' },
        { id: 'f_palm', at: 'palmeraie', group: ['murmure', 'murmure'], bg: 'ville' }
      ],
      chests: [
        { at: ['halle', 1, 1], gear: 'calame_encrier' },
        { at: ['souk', 1, 1], item: 'dattes', n: 2 },
        { at: ['priere', 1, 1], codex: 'imamat' },
        { map: 'noos', at: 'faille', item: 'musc', n: 1 }
      ],
      intro: [
        ['title', "Le Jour le plus sombre", "Lundi 12 Rabî' al-Awwal, an 11 de l'Hégire"],
        ['mus', 'deuil'],
        ['nar', "Médine, juin 632. Ce matin encore, on croyait la fièvre du Messager d'Allah ﷺ en recul, et les cœurs s'étaient rassurés. Abû Bakr était rentré chez lui, à as-Sunh, aux abords de la ville."],
        ['nar', "Puis un cavalier est venu, sans pouvoir achever sa phrase. Abû Bakr a sellé sa monture. Il entre dans Médine par le sud."],
        ['codex', 'abubakr_bio']
      ],
      objectives: [
        { text: "Rejoindre Abû 'Ubayda près de la porte", talk: 'abuubayda', then: [
          ['emote', 'abuubayda', 'salut'],
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
          ['nar', "La noosphère de la mosquée. Ici le chagrin porte un masque vide, et il a un nom : le Déni."]
        ] },
        { text: "Noosphère : affronter le Déni, au cœur", foe: 'f_deni', then: [
          ['sfx', 'light'], ['flash', '#ffe9a8'],
          ['map', 'medine', 'mosquee_cour', { time: 'day' }],
          ['tp', 'umar', ['mosquee_cour', 1, 0]],
          ['quote', "Ô gens ! Que celui qui adorait Muhammad sache que Muhammad est mort. Et que celui qui adore Allah sache qu'Allah est Vivant et ne meurt pas.", "Abû Bakr, dans la mosquée de Médine — al-Bukhârî, as-Sahîh"],
          ['quote', "Muhammad n'est qu'un messager ; des messagers avant lui sont passés. S'il mourait donc, ou s'il était tué, retourneriez-vous sur vos talons ? Quiconque retourne sur ses talons ne nuira en rien à Allah ; et Allah récompensera bientôt les reconnaissants.", "Coran 3:144 — traduction du sens"],
          ['nar', "Ibn 'Abbâs dira : « Ce fut comme si les gens n'avaient jamais su que ce verset avait été révélé, avant qu'Abû Bakr ne le récite. » Ce jour-là, toute la ville le répétait."],
          ['quote', "Par Allah, dès que j'entendis Abû Bakr le réciter, mes jambes ne me portèrent plus, et je tombai à terre. Je sus alors que le Prophète ﷺ était mort.", "'Umar ibn al-Khattâb — al-Bukhârî, as-Sahîh"],
          ['emote', 'umar', 'accable'],
          ['codex', 'jour_sombre'], ['codex', 'deni']
        ] },
        { text: "Relever 'Umar", talk: 'umar', then: [
          ['say', 'umar', "C'est donc vrai. Toi seul as eu la force de le dire. Je voulais tant qu'il revienne…"],
          ['say', 'abubakr', "Nous l'aimons tous plus que nos propres vies, 'Umar. C'est pour cela qu'il faut garder ce qu'il nous a transmis, et ne pas nous arrêter à sa personne."],
          ['emote', 'umar', null],
          ['say', 'umar', "Me voici. Dis-moi où me tenir."],
          ['hide', 'umar'], ['join', 'umar'], ['codex', 'umar_bio'],
          ['show', 'messager'], ['walk', 'messager', ['mosquee_cour', 0, 2]],
          ['say', 'messager', "Abû Bakr ! 'Umar ! Les Ansâr sont réunis sous l'auvent des Banû Sâ'ida, autour de Sa'd ibn 'Ubâda. Ils parlent de choisir un chef parmi eux."],
          ['say', 'umar', "Allons trouver nos frères les Ansâr."],
          ['say', 'abuubayda', "Je viens avec vous."],
          ['nar', "Râwî, avant de parler à des hommes, apprends d'où ils viennent : près de la mosquée, un maître d'école enseigne les lignées. Et l'heure de la prière approche ; qui s'y arrête parle ensuite plus juste."],
          ['hide', 'messager']
        ] },
        { text: "Gagner la Saqîfa des Banû Sâ'ida", goto: 'halle', then: [
          ['hide', 'thamir'],
          ['nar', "En chemin, deux hommes de bien parmi les Ansâr leur conseillent de régler l'affaire entre Émigrés. Ils poursuivent pourtant : c'est en face que l'on parle à des frères."],
          ['nar', "Sous l'auvent, les Ansâr sont assemblés. Eux qui ont tout donné — leurs maisons, leurs palmeraies, leur sang — craignent ce que demain fera d'eux."],
          ['say', 'Un orateur des Ansâr', "Nous sommes les Auxiliaires d'Allah et le bataillon de l'islam. Et vous, Émigrés, vous êtes venus à nous comme une poignée d'hommes."],
          ['say', 'hubab', "Un émir parmi nous, et un émir parmi vous !"],
          ['say', 'umar', "J'ai préparé des paroles. Laisse-moi…"],
          ['say', 'abubakr', "Doucement, 'Umar."],
          ['nar', "'Umar dira plus tard : « Il ne laissa pas un mot de ce que j'avais préparé sans le dire, et mieux que moi. » Abû Bakr loue les Ansâr, et ne retranche rien de leur mérite."],
          ['say', 'abubakr', "Tout le bien que vous dites de vous, vous en êtes dignes. Mais les Arabes ne reconnaîtront cette charge qu'à ce clan de Quraysh. Ne déchirons pas ce qui a été uni."],
          ['nar', "Râwî : les sources rapportent ce qui fut dit au centre de l'auvent. Elles se taisent sur ses bords, où des jeunes gens échauffés se pressent. Là, les mots sont à toi ; s'ils sont mauvais, ils seront de toi, non de lui."],
          ['mus', 'conseil'],
          ['parley', {
            with: "Un jeune homme des Ansâr",
            title: "Les bords de l'auvent",
            intro: "Ils ont tout donné et craignent d'être oubliés demain. Ils veulent une garantie, pas une leçon.",
            goal: 7,
            rounds: [
              { say: "Nous avons ouvert nos maisons et versé notre sang. Et demain ? Quraysh commandera, et l'on nous dira merci.",
                opts: [
                  { t: "Reconnaître tout ce que les Ansâr ont donné, sans rien en retrancher.", el: 'sidq', v: 2, r: "Du moins, tu ne nous marchandes pas notre part. Continue." },
                  { t: "Rappeler que sans les Émigrés, il n'y aurait rien eu à secourir.", el: 'shajaa', v: -1, r: "Voilà. Déjà, on nous fait la leçon sous notre propre toit." },
                  { t: "Promettre aux Ansâr la moitié des charges et des revenus.", el: 'rahma', v: 0, r: "Tu promets beaucoup, et bien vite. Qui tiendra ta promesse quand tu ne seras plus là ?" } ] },
              { say: "Un émir parmi nous, un émir parmi vous : voilà qui serait juste.",
                opts: [
                  { t: "Deux émirs, ce sont deux étendards ; et deux étendards, demain, deux communautés.", el: 'adl', v: 2, r: "… Je n'avais pas regardé si loin. Deux sabres dans un même fourreau, cela ne s'est jamais vu." },
                  { t: "Remonter les lignées : Aws et Khazraj, fils de deux frères, se sont fait la guerre jusqu'à Bu'âth. Ce n'est pas le sang qui vous a unis.", el: 'ilm', v: 3, need: 'lignees', r: "Bu'âth… Mon oncle y est resté. Tu dis vrai : ce n'est pas le sang qui nous a rendus frères." },
                  { t: "Trancher : la décision revient aux premiers Émigrés, et à eux seuls.", el: 'shajaa', v: -2, r: "Alors pourquoi être venus jusqu'ici ? Pour nous l'annoncer ?" } ] },
              { say: "On nous a soufflé que vous veniez prendre, et non demander. Un homme du souk le jurait tout à l'heure.",
                opts: [
                  { t: "Demander le nom de celui qui souffle, et pourquoi il ne parle pas à voix haute.", el: 'sidq', v: 2, r: "C'est vrai qu'il parlait bas, et qu'il a disparu quand vous êtes entrés… Thâmir, le courtier." },
                  { t: "Laisser passer : un jour pareil, les gens disent n'importe quoi.", el: 'sabr', v: 0, r: "Peut-être. Mais sa parole a déjà fait le tour de l'auvent." },
                  { t: "Jurer que jamais un Émigré n'a convoité cette charge.", el: 'sidq', v: -1, r: "Jamais ? Ne jure pas pour tous les hommes : tu n'en connais pas le fond." } ] },
              { say: "Admettons. Que nous restera-t-il, à nous ?",
                opts: [
                  { t: "« Nous serons les émirs, et vous les vizirs » : rien ne se décidera sans vous.", el: 'adl', v: 2, r: "Les vizirs… Qu'on ne tranche rien sans nous consulter, et nous tiendrons parole." },
                  { t: "Laisser 'Umar rappeler qui le Messager d'Allah ﷺ a fait passer devant pour la prière.", el: 'sidq', v: 3, need: 'imamat', r: "Nous cherchons refuge auprès d'Allah de passer devant celui-là." },
                  { t: "Rappeler pourquoi ils ont secouru cette religion : non pour une part de ce monde.", el: 'rahma', v: 1, r: "Bashîr le disait à l'instant. C'est dur à entendre, et c'est vrai." },
                  { t: "Leur laisser entendre qu'ils n'ont guère le choix.", el: 'shajaa', v: -2, r: "On a toujours le choix. C'est même pour cela que nous sommes réunis." } ] }
            ],
            win: [
              ['flag', 'saqifa_unie'], ['pillar', 'lien', 1],
              ['nar', "Les bords de l'auvent se taisent et se tournent vers le centre. Ceux qui grondaient tout à l'heure font maintenant signe aux autres d'écouter."] ],
            lose: [
              ['pillar', 'lien', -1],
              ['nar', "Le jeune homme se détourne. Autour de lui le murmure reprend, gagne de proche en proche, et couvre un instant la voix d'Abû Bakr. La parole n'a pas suffi."] ]
          }],
          ['nar', "Mais une idole ne se rend pas à un argument. Dans l'envers de l'auvent, deux mots enflent et se font face : « nous », « vous ». Ils se nouent en un faisceau d'étendards. La plus vieille idole des Arabes se réveille."],
          ['heal'],
          ['battle', { group: ['clan', 'mot_clan', 'mot_clan'], bg: 'ville', boss: true, intro: "Al-'Asabiyya : « Avant d'être croyants, vous étiez des tribus. Vous le redeviendrez. »",
            allies: [{ flag: 'saqifa_unie', name: 'Les Ansâr et les Muhâjirûn réunis' }] }],
          ['nar', "Le faisceau se dénoue. Sous l'auvent, le tumulte retombe d'un coup, comme un vent qui tourne. Il reste des hommes, des frères, et une question."],
          ['choice', "Abû Bakr tient la main de 'Umar et celle d'Abû 'Ubayda. Que propose-t-il à l'assemblée ?", [
            { t: "Tendre sa propre main : nul n'est plus digne que lui de cette charge.", r: [
              ['nar', "Il ne demanda rien pour lui-même. Celui qui convoite la charge nourrit déjà une idole : la sienne. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Accepter le partage : un émir pour les Émigrés, un émir pour les Ansâr.", r: [
              ['nar', "Deux émirs, c'eût été deux communautés avant la fin de l'année : le Clan n'attendait que cela. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Proposer 'Umar ou Abû 'Ubayda, et s'effacer.", ok: true, r: [
              ['quote', "J'agrée pour vous l'un de ces deux hommes : prêtez allégeance à celui des deux que vous voudrez.", "Abû Bakr à la Saqîfa — al-Bukhârî, as-Sahîh"],
              ['quote', "De tout ce qu'il dit, je ne détestai que cette parole. Par Allah, j'aurais préféré avoir le cou tranché, sans péché, plutôt que de commander à des gens parmi lesquels se trouve Abû Bakr.", "'Umar ibn al-Khattâb — al-Bukhârî, as-Sahîh§6830"] ] }
          ]],
          ['say', 'umar', "Tends ta main, Abû Bakr."],
          ['sfx', 'duff'],
          ['nar', "'Umar lui prête allégeance. Puis les Émigrés. Puis les Ansâr, Bashîr ibn Sa'd parmi les premiers. Pas une goutte de sang n'a coulé."],
          ['codex', 'saqifa'], ['codex', 'asabiyya'],
          ['give', 'dattes', 2]
        ] },
        { auto: true, then: [
          ['map', 'medine', 'mosquee_porte', { time: 'dawn' }],
          ['nar', "Le lendemain. La mosquée est pleine : tous viennent prêter allégeance. Abû Bakr n'a pas dormi. Il n'a jamais voulu de cette charge, et il sait ce qu'elle pèse."]
        ] },
        { text: "Prendre la parole devant les croyants", goto: 'mosquee_cour', then: [
          ['nar', "L'aube. Comme chaque jour depuis que le Messager d'Allah ﷺ l'avait ordonné durant sa maladie, c'est lui qui s'avance pour diriger la prière. Les rangs se serrent derrière lui, épaule contre épaule."],
          ['pray', 'fajr'],
          ['codex', 'imamat'],
          ['quote', "Ô gens ! J'ai été placé à votre tête, et je ne suis pas le meilleur d'entre vous. Si j'agis bien, aidez-moi ; si j'agis mal, redressez-moi. La véracité est un dépôt, et le mensonge une trahison.", "Abû Bakr, discours d'investiture — Ibn Hishâm, as-Sîra"],
          ['quote', "Le faible parmi vous est fort auprès de moi, jusqu'à ce que je lui rende son droit. Le fort parmi vous est faible auprès de moi, jusqu'à ce que je lui reprenne le droit d'autrui.", "Abû Bakr, discours d'investiture — Ibn Hishâm, as-Sîra"],
          ['quote', "Obéissez-moi tant que j'obéis à Allah et à Son Messager. Si je leur désobéis, vous ne me devez plus obéissance.", "Abû Bakr, discours d'investiture — Ibn Hishâm, as-Sîra"],
          ['codex', 'investiture'],
          ['pillar', 'justice', 1], ['mus', 'espoir']
        ] }
      ],
      outro: [
        ['nar', "Un peuple n'est pas un tas de pierres, râwî : c'est un temple, et ce qui le tient debout n'est aucune de ses pierres. Ce jour-là, on en retira la clef de voûte, et il tint. C'est qu'on l'avait bâti autour d'autre chose qu'un homme."],
        ['nar', "Râwî, retiens ceci : le premier acte du premier successeur fut de dire qu'il pouvait se tromper. Les idoles, elles, ne demandent jamais qu'on les redresse."],
        ['nar', "Mais hors de Médine, les tribus apprennent la nouvelle. Et le désert se met à murmurer."]
      ]
    },

    /* ═════════ 2. L'ARMÉE D'USÂMA ═════════ */
    {
      id: 'ab2', title: "L'Armée d'Usâma", sub: "An 11 H · 632 · Médine",
      // bataille déclarée : l'armée est au loin, la ville se garde ; ni charge ni tir
      bataille: { base: 2, rangs: [{ t: 'fantassins', name: 'Gardes des passes', voie: 'centre' }, { t: 'gens', name: 'Veilleurs de Médine', voie: 'nord' }], ordres: ['tenir', 'avancer', 'glisser', 'replier'] },
      map: 'medine', opts: { time: 'dusk' }, start: 'maison',
      party: ['abubakr'],
      npcs: [
        { id: 'umar', name: "'Umar", hero: 'umar', at: ['souk', -1, 0],
          talk: [['say', 'umar', "Où vas-tu, chargé comme un marchand ?"]] },
        { id: 'abuubayda', name: "Abû 'Ubayda", hero: 'abuubayda', at: ['souk', 1, 0],
          talk: [['say', 'abuubayda', "Paix sur toi, successeur du Messager d'Allah."]] },
        { id: 'marchand', name: 'Vieux marchand', at: ['souk', 2, 2], look: { kind: 'ancien', robe: '#7d6a4f', head: '#eee6d2' },
          talk: [
            ['say', 'marchand', "Hier on lui prêtait allégeance ; ce soir il voulait encore vendre ses étoffes lui-même. Dis-moi quel roi fait cela."],
            ['say', 'marchand', "Et prends garde aux balances trop bien huilées. Il y a par ici un courtier dont les comptes traînent sur l'étal ; un feuillet s'égare vite."] ] },
        { id: 'garde', name: 'Garde des passes', at: ['porte_sud', 1, -1], look: { kind: 'soldat', robe: '#5a4632', head: '#d8cfc0' },
          talk: [['say', 'garde', "'Alî, az-Zubayr, Talha et Ibn Mas'ûd tiennent les passes de la ville. Médine ne dort plus que d'un œil."]] },
        { id: 'usama', name: "Usâma ibn Zayd", at: ['porte_nord', 0, -1], look: { kind: 'compagnon', robe: '#4f5f73', head: '#ece6d6', aura: '#cfe4ff' },
          talk: [['say', 'usama', "L'armée est prête. Nous n'attendons qu'un mot du successeur du Messager d'Allah."]] },
        { id: 'soldat', name: "Soldat d'Usâma", at: ['porte_nord', 2, 0], look: { kind: 'soldat', robe: '#5c5140', head: '#ddd3c0' },
          talk: [['say', 'soldat', "Notre émir n'a pas vingt ans. Mais c'est le Messager d'Allah ﷺ qui a noué son étendard. Qui oserait le dénouer ?"]] },
        { id: 'delegue', name: 'Délégué des tribus', at: ['mosquee_porte', 1, 2], hidden: true, look: { kind: 'bedouin', robe: '#6e5540', head: '#cfc2a8' } },
        { id: 'recitateur', name: 'Un récitateur', at: ['ecole', 0, 1], look: { kind: 'savant', robe: '#e6dfcc', head: '#f2ecdc' },
          talk: [
            ['say', 'recitateur', "Quand le Messager d'Allah ﷺ envoya Mu'âdh au Yémen, il lui fit dire aux gens que la zakât est prise à leurs riches et rendue à leurs pauvres. Retiens le mot : *leurs* pauvres. Ce n'est pas un tribut qu'on emporte."],
            ['codex', 'zakat_droit'] ] },
        { id: 'priant', name: 'Un fidèle', at: ['priere', -1, 1], look: { kind: 'ancien', robe: '#7a6f5a', head: '#efe9dc' },
          talk: [['say', 'priant', "Le pays se retourne, et lui ne change rien à ses heures : la prière, puis les gens. Je crois que c'est pour cela qu'on le suit."]] },
        { id: 'thamir', name: 'Thâmir le courtier', at: ['souk', -2, 2], look: { kind: 'marchand', robe: '#7a4f3a', head: '#d9c9a8', cloak: '#4a2f22' },
          talk: [['say', 'thamir', "Successeur du Messager d'Allah ! Tout Médine loue ta fermeté. Si quelque délégation te cause du souci, envoie-la-moi : je sais parler aux gens des tribus."]] },
        { id: 'dirgham', name: 'Dirghâm, cheikh des Banû Rimth', at: ['puits', -1, 1], hidden: true, look: { kind: 'bedouin', robe: '#5f4a36', head: '#c9b998', cloak: '#3a2c20', trim: '#b5462f', item: 'baton' },
          talk: [['say', 'dirgham', "Mes gens m'attendent, et je ne sais pas encore ce que je leur dirai."]] }
      ],
      foes: [
        { id: 'f_d1', map: 'desert', at: 'dunes', group: ['reniement', 'reniement', 'mot_clan'], bg: 'desert' },
        { id: 'f_oasis', map: 'desert', at: 'oasis', group: ['reniement', 'mot_clan'], bg: 'desert' },
        { id: 'f_n2', map: 'noos', at: 'noeud1', group: ['mot_clan', 'mot_clan', 'reniement'], bg: 'noos' }
      ],
      chests: [
        { at: ['palmeraie', 1, 1], gear: 'turban_voyage' },
        { at: ['puits', 1, 0], item: 'eau', n: 1 },
        { at: ['souk', 3, -1], codex: 'registre_courtier' },
        { map: 'desert', at: ['oasis', 1, 1], item: 'pain', n: 2 },
        { map: 'noos', at: 'faille', item: 'siwak', n: 1 }
      ],
      intro: [
        ['title', "L'Armée d'Usâma", "Été de l'an 11 de l'Hégire"],
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
          ['hide', 'umar'], ['hide', 'abuubayda'], ['join', 'umar'], ['join', 'abuubayda'],
          ['nar', "Râwî : ce que les sources montrent de leurs mains, tu peux le refaire des tiennes. Ouvre le mode *Bâtir* (touche B, ou le bouton ▦), choisis une pièce, pose-la devant toi."],
          ['mat', 'palme', 4],
          ['nar', "Au bout du souk, les ballots d'une caravane. On y vend, on y achète, et l'on y confie une cargaison pour le Yémen ou pour le Shâm : c'est de ce commerce qu'il vivait."],
          ['lore', 'caravanes']
        ] },
        { text: "Bâtir un enclos pour les chèvres du quartier", build: { piece: 'enclos', n: 1 }, then: [
          ['nar', "On rapporte qu'il trayait les chèvres des gens de son quartier. Quand il devint calife, une voix s'inquiéta : « Maintenant, il ne nous les traira plus. »"],
          ['quote', "Si, par ma vie, je vous les trairai. J'espère que ce qui m'arrive ne me changera pas.", "On rapporte d'Abû Bakr — Ibn Sa'd, at-Tabaqât"],
          ['codex', 'chevres'], ['give', 'lait', 1], ['pillar', 'lien', 1]
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
          ['nar', "Les délégués repartent. Ils ont compté, en passant, le peu d'hommes restés dans la ville."],
          ['nar', "Un seul s'attarde près du puits, la bride de son chameau à la main. Les chroniques ne nomment pas tous les clans venus ce soir-là ; celui-ci, la Chaîne l'appelle les Banû Rimth."],
          ['show', 'dirgham'], ['codex', 'banu_rimth'],
          ['nar', "Le soleil touche les palmiers ; l'heure du Maghrib est proche. Qui veut parler juste aux hommes s'adresse d'abord à son Seigneur."]
        ] },
        { text: "Parler au cheikh des Banû Rimth, près du puits", talk: 'dirgham', then: [
          ['nar', "Râwî : le principe, le calife l'a dit, et il n'en retranchera rien. Mais pour ce cheikh-là, les sources n'ont gardé aucun mot. Ils sont à toi ; s'ils sont mauvais, ils seront de toi, non de lui."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'dirgham',
            title: "Le cheikh des Banû Rimth",
            intro: "L'année fut maigre. Il ne renie rien : il craint de rentrer les mains vides devant les siens, et quelqu'un lui a juré que le calife plierait.",
            goal: 7,
            rounds: [
              { say: "Mes chamelles ont maigri, et mes gens comptent chaque tête. Si je reviens en disant : « Il a tout pris », ils ne me suivront plus. Dispense-nous cette année.",
                opts: [
                  { t: "La zakât n'est pas à moi pour que j'en fasse remise : elle est le droit de vos propres pauvres.", el: 'adl', v: 2, r: "Nos pauvres… Il est vrai que les miens ne mangent pas tous à leur faim." },
                  { t: "Citer la règle : « prise à leurs riches, rendue à leurs pauvres ». Elle reste d'abord chez vous.", el: 'ilm', v: 3, need: 'zakat_droit', r: "Rendue à nos pauvres ? On m'avait dit qu'elle partait toute à Médine. Cela, je peux le répéter aux miens." },
                  { t: "Lui rappeler ce qu'il en coûte de se dresser contre Médine.", el: 'shajaa', v: -1, r: "Tu me menaces, et ton armée vient de partir pour le nord. J'ai des yeux." } ] },
              { say: "On m'a assuré que tu céderais. Un homme de ta ville, bien mis, me l'a juré : « Tenez bon, il n'a plus de soldats. »",
                noir: { name: "La Honte", group: ['noir_honte'], intro: "Dirghâm a baissé la voix. Ce n'est pas le calife qu'il craint : c'est le regard des siens, s'il rentre les mains vides. Tant que cela parlera, il n'entendra rien d'autre.", after: "Tu ne m'as pas humilié devant mes hommes. Je ne l'oublierai pas. Parle." },
                opts: [
                  { t: "Dire vrai : oui, l'armée est partie ; et non, cela ne change rien à ce qui est dû.", el: 'sidq', v: 2, r: "Tu ne me caches pas ta faiblesse. C'est étrange : cela me rassure plus qu'une vantardise." },
                  { t: "Montrer le feuillet : celui qui te conseille a déjà racheté à vil prix vos chamelles de zakât.", el: 'ilm', v: 3, need: 'registre_courtier', r: "Thâmir… Trente bêtes pour le prix de dix, « en attendant que le calife plie ». Par Allah, c'est lui qui nous tondait." },
                  { t: "Prétendre qu'une seconde armée campe derrière la colline.", el: 'shajaa', v: -2, r: "Mes éclaireurs reviennent de la colline. Il n'y a là que des chèvres." } ] },
              { say: "Soit. Mais donne-moi quelque chose à rapporter. Un homme ne revient pas vers sa tribu avec une défaite.",
                opts: [
                  { t: "Proposer un pacte : la zakât est versée, et les Banû Rimth gardent la piste de Dhû l-Qassa.", el: 'adl', v: 2, r: "Garder la piste… Voilà une charge, et non une aumône. Mes cavaliers savent faire cela." },
                  { t: "Accorder un délai pour les bêtes malades : un délai, non une remise.", el: 'rahma', v: 1, r: "Un délai, non une remise… C'est peu. Mais c'est honnête." },
                  { t: "Promettre que l'an prochain, on fermera les yeux.", el: 'rahma', v: -1, r: "Alors pourquoi pas cette année ? Tu vois : toi-même, tu n'y crois pas." } ] },
              { say: "Et si les autres clans apprennent que les Banû Rimth ont payé, quand eux refusaient ?",
                opts: [
                  { t: "Alors ils sauront aussi qui a tenu sa parole quand tout chancelait.", el: 'sidq', v: 2, r: "Qu'on dise cela de nous. Je préfère ce nom à celui qu'ils se font." },
                  { t: "Se taire, et lui laisser le temps de peser.", el: 'sabr', v: 1, r: "… Tu ne me presses pas. Les autres pressaient." },
                  { t: "Le flatter : un cheikh tel que lui n'a que faire de l'avis des autres.", el: 'shajaa', v: -1, r: "Garde ton miel. On m'en a déjà servi ce soir." } ] }
            ],
            win: [
              ['flag', 'rimth_allies'], ['pillar', 'lien', 1],
              ['say', 'dirgham', "Écris-le : les Banû Rimth versent leur dû, et leurs cavaliers tiennent la piste de Dhû l-Qassa. Que mes fils l'apprennent de ma bouche plutôt que de celle d'un courtier."],
              ['nar', "Il repart avant la nuit. Ce soir-là, sur la piste de l'est, des feux s'allument qui ne sont pas ennemis."] ],
            lose: [
              ['pillar', 'lien', -1],
              ['say', 'dirgham', "Je ne peux pas rapporter cela aux miens. Je ne lèverai pas la main contre Médine ; mais ne compte pas sur mes cavaliers."],
              ['nar', "Il s'éloigne sans se retourner. La parole n'a pas suffi : cette nuit, la piste de l'est restera sans gardiens."] ]
          }],
          ['hide', 'dirgham'],
          ['nar', "Reste une question : qui donc avait juré au cheikh que le calife plierait ? Un homme de la ville, bien mis. Au souk, on sait qui parle aux gens des tribus."]
        ] },
        { text: "Trouver Thâmir le courtier, au souk", talk: 'thamir', then: [
          ['codex', 'thamir'],
          ['say', 'thamir', "Le cheikh des Banû Rimth ? Un homme rude, mais je l'ai préparé de mon mieux à t'entendre. J'espère que mes pauvres paroles t'auront servi."],
          ['ask', "Thâmir sourit, les mains ouvertes. Que faire ?", [
            { t: "Poser devant lui le feuillet de ses comptes.", need: 'registre_courtier', r: [
              ['say', 'thamir', "Ce… ce n'est qu'une avance ! J'ai rendu service à ces pauvres gens. Trente bêtes, payées comptant…"],
              ['nar', "Le feuillet dit le reste : trente bêtes payées le prix de dix, et la promesse, répétée de tente en tente, que le calife plierait."],
              ['nar', "Abû Bakr ne hausse pas la voix. Thâmir rendra les bêtes au prix qu'il en a donné, et ne tiendra plus la balance du souk. Le fort est faible, ici, jusqu'à ce qu'il ait rendu le droit d'autrui."],
              ['flag', 'thamir_demasque'], ['pillar', 'justice', 1], ['hide', 'thamir'] ] },
            { t: "L'interroger, sans preuve en main.", r: [
              ['say', 'thamir', "Moi ? J'ai seulement tenu compagnie à ces gens, par égard pour toi. On m'aura mal compris : le désert déforme tout."],
              ['nar', "Sa parole glisse comme l'huile sur l'eau. Sans preuve, on ne condamne pas : cela aussi est justice. Mais il sait, désormais, qu'on le regarde."] ] },
            { t: "Le laisser : la nuit presse, et Médine d'abord.", r: [
              ['nar', "Thâmir s'incline très bas. Il s'inclinait déjà, tout à l'heure, devant le cheikh des Banû Rimth."] ] }
          ]],
          ['nar', "Abû Bakr poste des gardes aux passes de Médine et rassemble les gens dans la mosquée."],
          ['say', 'abubakr', "Le pays s'est retourné autour de vous, et leurs envoyés ont vu votre petit nombre. Vous ne savez s'ils viendront de nuit ou de jour. Tenez-vous prêts."],
          ['say', 'umar', "Nous sommes peu. Qu'au moins la ville ne soit pas prise à revers pendant que tu sors."],
          ['nar', "Sept ans plus tôt, un Persan nommé Salmân avait appris à Médine à se garder par un fossé. Les mains s'en souviennent. Creuse : ouvre le mode *Bâtir* et pose six segments de tranchée, où tu voudras."]
        ] },
        { text: "Creuser six segments de tranchée pour garder Médine", build: { piece: 'tranchee', n: 6 }, then: [
          ['flag', 'fosse_medine'], ['codex', 'fosse'], ['pillar', 'savoir', 1],
          ['nar', "La terre est retournée, les gardes sont aux passes. Celui qui sort peut maintenant sortir sans regarder derrière lui."]
        ] },
        { auto: true, then: [
          ['nar', "Trois nuits plus tard, ils vinrent."],
          ['map', 'desert', 'depart', { time: 'night' }],
          ['nar', "Les abords de Médine, sur la piste de Dhû l-Qassa. Le calife est sorti lui-même, de nuit, à la tête de ceux qui restaient. Dans l'envers du désert, le reniement a pris corps."],
          ['nar', "Pas de lune. On marche aux étoiles, comme toujours ici : al-Jady, le Chevreau qui ne bouge pas, à main gauche ; Suhayl dans le dos. Lève les yeux vers le cadran : l'étoile qui brille est ta route."],
          ['lore', 'etoiles']
        ] },
        { text: "Repousser les nuées du reniement, dans les dunes", foe: 'f_d1', then: [
          ['nar', "Les nuées refluent vers l'est. On raconte que les assaillants faisaient rouler des outres gonflées vers les chameaux pour les affoler. Cette nuit, la ruse ne suffit pas."]
        ] },
        { text: "Poursuivre jusqu'aux rochers de Dhû l-Qassa", goto: 'rochers', then: [
          ['say', 'umar', "Ils se rassemblent derrière les rochers. Ce ne sont plus des murmures : c'est une volonté."],
          ['if', 'rimth_allies', [
            ['battle', { group: ['reniement', 'reniement', 'reniement'], bg: 'desert', intro: "« Rentrons chez nos pères. » La nuée fond sur vous ; derrière elle, des cavaliers amis ferment la piste.",
              allies: [{ flag: 'rimth_allies', name: 'Les cavaliers des Banû Rimth' }, { flag: 'fosse_medine', name: 'Médine gardée par son fossé' }] }]
          ], [
            ['battle', { group: ['reniement', 'reniement', 'reniement', 'mot_clan'], bg: 'desert', intro: "« Rentrons chez nos pères. » La nuée fond sur vous. Nul ne garde la piste de l'est : un mot d'ordre s'y est joint.", allies: [{ flag: 'fosse_medine', name: 'Médine gardée par son fossé' }] }]
          ]],
          ['nar', "À l'aube, la piste est libre. Mais le refus lui-même n'est pas brisé : il a une source, et elle n'est pas faite de sable."],
          ['nar', "Ils prient l'aube sur le sable encore froid, les montures entravées derrière eux."],
          ['pray', 'fajr']
        ] },
        { text: "Trouver la source du refus, dans les ruines", goto: 'ruines', then: [
          ['nar', "Entre les pierres d'un vieux fortin, l'air tremble. Ici l'on a compté, pesé, soustrait : « La prière, soit. Mais ma part reste à moi. »"],
          ['map', 'noos', 'seuil', { hue: 42 }],
          ['heal'],
          ['nar', "La noosphère du refus. Au loin, une tour de pièces. Pas une ne tombe."]
        ] },
        { text: "Noosphère : atteindre l'Avare du dû", goto: 'coeur', then: [
          ['battle', { group: ['avare', 'mot_clan', 'mot_clan'], bg: 'noos', boss: true, intro: "L'Avare du dû : « Je prie. Je jeûne. Que veut-on de plus ? Ce qui est à moi est à moi. »",
            allies: [{ flag: 'rimth_allies', name: 'Le dû versé par les Banû Rimth' }] }],
          ['sfx', 'break'], ['flash', '#ffe08a'],
          ['nar', "La tour s'effondre en pluie claire. Ce que l'Avare retenait retourne à ceux à qui c'était dû."],
          ['map', 'medine', 'porte_nord', { time: 'dawn' }],
          ['sfx', 'duff'],
          ['nar', "Quarante jours ont passé ; d'autres disent soixante-dix. À la porte nord, une poussière : l'armée d'Usâma revient, sauve et chargée."],
          ['nar', "Les tribus qui l'avaient vue passer s'étaient dit : « Si ces gens étaient faibles, ils n'auraient pas envoyé pareille armée. » Une parole tenue avait gardé Médine mieux qu'un rempart."],
          ['mus', 'espoir'],
          ['nar', "Car une ville ne tient pas par ses murs, râwî, mais par ce qui, en chacun, monte la garde. Une parole tenue est une sentinelle qui ne dort pas."]
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
      // bataille déclarée, sans rangs : les colonnes sont parties sans lui (c'est le conseil qu'il a reçu, plus bas)
      bataille: { rangs: [], mot: 'Les colonnes sont parties sans lui : celui qui tient l’ensemble ne se risque pas comme une seule lance. Il n’a pas de rangs à mener ici.' },
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
        { id: 'zaydthabit', name: "Zayd ibn Thâbit", map: 'medine', at: ['mosquee_cour', 1, 0], hidden: true, look: { kind: 'compagnon', robe: '#5f6f84', head: '#f0eadb', aura: '#d9c2ff' } },
        { id: 'najran', name: 'Envoyé de Najrân', map: 'medine', at: ['place', -2, 1], look: { kind: 'moine', robe: '#4a3f4f', head: '#3a3040' },
          talk: [['say', 'najran', "J'attends depuis le matin. On m'a dit que ton calife reçoit le faible avant le fort ; je verrai bien."]] },
        { id: 'thamir', name: 'Thâmir le courtier', map: 'medine', at: ['souk', -1, 1], hidden: true, look: { kind: 'marchand', robe: '#7a4f3a', head: '#d9c9a8', cloak: '#4a2f22' },
          talk: [['say', 'thamir', "On dit que les lignes ont plié, là-bas… Je ne fais que répéter, bien sûr. Je prie pour eux, comme tout le monde."]] },
        { id: 'veilleur_priere', name: 'Un fidèle', map: 'medine', at: ['priere', -1, 1], look: { kind: 'ancien', robe: '#7a6f5a', head: '#efe9dc' },
          talk: [['say', 'veilleur_priere', "Il ne peut pas tenir un sabre à leur côté. Alors il tient ce qu'il peut tenir : la nuit, debout."]] }
      ],
      foes: [
        { id: 'f_k1', map: 'noos', at: 'noeud1', group: ['fausse_rime', 'fausse_rime', 'echo'], bg: 'noos' },
        { id: 'f_kopt', map: 'noos', at: 'miroir', group: ['fausse_rime', 'echo'], bg: 'noos' },
        { id: 'f_camp', at: 'enclos', group: ['reniement', 'reniement'], bg: 'camp' }
      ],
      chests: [
        { at: ['feu', 1, 1], gear: 'baton_acacia' },
        { at: ['tentes', 1, 1], item: 'lait', n: 1 },
        { map: 'medine', at: ['puits', 1, 0], item: 'musc', n: 1 },
        { map: 'noos', at: 'faille', item: 'miel', n: 1 }
      ],
      intro: [
        ['title', "Yamâma — le Menteur", "Dhû l-Qassa, fin de l'an 11 de l'Hégire"],
        ['nar', "Dhû l-Qassa, à une étape de Médine. L'armée d'Usâma est rentrée ; le calife reprend l'initiative. Partout en Arabie, des hommes se sont levés qui se disent inspirés. Le plus puissant tient le Yamâma."],
        ['nar', "Il se nomme Musaylima, des Banû Hanîfa. Naguère, il avait écrit pour réclamer « la moitié de la terre ». La réponse l'avait nommé d'un mot, qui lui est resté : al-Kadhdhâb, le Menteur."]
      ],
      objectives: [
        { text: "Nouer les onze étendards", goto: 'etendard', then: [
          ['sfx', 'roll'],
          ['nar', "Abû Bakr noue onze étendards pour onze chefs, et trace à chacun sa route : Khâlid ibn al-Walîd, 'Ikrima, Shurahbîl, 'Amr ibn al-'Âs, al-'Alâ' ibn al-Hadramî… L'Arabie entière, d'un seul geste."],
          ['say', 'khalid', "Mon étendard est noué. Tulayha d'abord ; puis le Yamâma, s'il plaît à Allah."],
          ['nar', "Puis le calife monte en selle, le sabre au côté, résolu à marcher lui-même en tête. Un homme saisit la bride de sa monture : 'Alî ibn Abî Tâlib."],
          ['quote', "Où vas-tu, successeur du Messager d'Allah ? Rengaine ton sabre, et ne nous afflige pas de ta perte. Retourne à Médine : par Allah, si nous te perdions, l'islam n'aurait plus d'ordre.", "On rapporte que 'Alî le lui dit à Dhû l-Qassa, rappelant une parole du Prophète ﷺ au jour d'Uhud — Ibn Kathîr, al-Bidâya wa-n-Nihâya (récit dit gharîb)"],
          ['choice', "'Alî tient la bride. Que fait Abû Bakr ?", [
            { t: "Passer outre : un chef doit marcher devant ses hommes.", r: [
              ['nar', "Son courage n'était pas en cause : il l'avait prouvé la nuit de Dhû l-Qassa. Mais celui qui tient l'ensemble ne se risque pas comme une seule lance. Ce n'est pas ce qui fut rapporté."] ] },
            { t: "Écouter 'Alî : confier les étendards, et rentrer à Médine.", ok: true, r: [
              ['say', 'abubakr', "Tu dis vrai. Que chacun aille où je l'ai envoyé. Je garderai Médine ; vous, gardez votre parole."],
              ['nar', "Il fait demi-tour. Reconnaître le vrai quand il vient d'un autre : cela aussi s'appelle véracité."] ] }
          ]]
        ] },
        { auto: true, then: [
          ['nar', "Dhû l-Qassa : la première terre reprise. Les sources ne disent pas qui y posa la première brique. Mais partout où ils firent halte, ils commencèrent par un lieu de prière. Pose-la, râwî."],
          ['codex', 'batir'],
          ['site', { id: 'dhulqassa', name: 'La mosquée de Dhû l-Qassa', at: ['feu', 5, 1], w: 9, h: 7, need: { mur: 10, sol: 8, pilier: 2, mihrab: 1, natte: 1 }, give: { pise: 24, palme: 6, pierre: 4 } }]
        ] },
        { text: "Fonder la mosquée de Dhû l-Qassa, dans l'enclos tracé au sol", build: { site: 'dhulqassa' }, then: [
          ['nar', "Dix blocs de terre, deux troncs, une niche, une natte. Ce n'est presque rien, et c'est assez : ceux qui partent sauront où revenir."]
        ] },
        { text: "Regarder partir les colonnes depuis le tertre", goto: 'tertre', then: [
          ['nar', "Onze colonnes s'enfoncent dans onze directions. Parmi ceux qui prendront la route du Yamâma : Zayd, le frère de 'Umar ; Sâlim, l'affranchi qui porte le Coran dans sa poitrine ; al-Barâ' ibn Mâlik. Des récitateurs par centaines."],
          ['say', 'umar', "Zayd m'a devancé en tout : il a cru avant moi. Qu'Allah le garde."]
        ] },
        { auto: true, then: [
          ['map', 'medine', 'porte_nord', { time: 'night' }],
          ['nar', "Médine, des semaines plus tard. Tulayha est défait ; les colonnes ont convergé vers le Yamâma. Depuis, plus de nouvelles. Le calife ne dort guère."],
          ['if', 'thamir_demasque', [
            ['nar', "Au souk, nul ne colporte de fausses nouvelles ce soir : la balance a changé de mains, et les langues avec elle."]
          ], [
            ['show', 'thamir'],
            ['nar', "Au souk, une voix basse court d'étal en étal : « Les lignes ont plié… et si le calife s'était trompé ? » Nul ne sait d'où elle part. Elle fait son chemin."],
            ['pillar', 'lien', -1]
          ]]
        ] },
        { auto: true, then: [
          ['nar', "Cette nuit-là, des hommes frappent à la porte nord. Une caravane de Médine, partie pour le Shâm, a été arrêtée sur la piste."],
          ['raid'],
          ['nar', "Avant l'aube, la piste du nord est rouverte. Tant que le Menteur tient le Yamâma, d'autres bandes se lèveront ; mais on saura, de Médine, qu'il vient quelqu'un."]
        ] },
        { text: "Recevoir l'envoyé de Najrân, sur la place", talk: 'najran', then: [
          ['mus', 'conseil'],
          ['nar', "Entre deux courriers, la charge continue. Un homme en habit sombre attend depuis le matin, un rouleau contre la poitrine. Il vient de Najrân, au sud, où vivent des chrétiens sous pacte."],
          ['say', 'najran', "Votre Prophète nous avait écrit une garantie : nos personnes, nos biens, nos églises. Il n'est plus, et les tribus se déchirent. Je viens savoir ce que vaut encore son écrit."],
          ['say', 'abubakr', "Ce qu'il a donné, je n'ai pas qualité pour le reprendre. Déroule ton écrit : nous le récrirons mot pour mot, et j'y mettrai mon nom sous le sien."],
          ['nar', "On rapporte qu'il leur fit rédiger la confirmation du pacte, dans les termes mêmes du Messager d'Allah ﷺ : protection pour leurs personnes, leurs biens et leur culte."],
          ['say', 'najran', "Je croyais venir marchander. Je repars avec plus que je n'apportais : la preuve qu'une parole, chez vous, survit à celui qui l'a donnée."],
          ['pillar', 'lien', 1], ['pillar', 'justice', 1], ['codex', 'najran'],
          ['hide', 'najran']
        ] },
        { text: "Veiller dans la cour de la mosquée", goto: 'mosquee_cour', then: [
          ['nar', "Celui qui veille pour les autres n'a que deux provisions : sa prière et son silence. Le reste, il l'a déjà donné."],
          ['pray', 'isha'],
          ['nar', "Râwî, la Chaîne te montre ce que Médine ignore encore. À 'Aqrabâ', les Banû Hanîfa sont des dizaines de milliers. Les lignes des croyants ont plié jusqu'à la tente de Khâlid."],
          ['nar', "Khâlid crie : « Distinguez-vous, que l'on voie d'où vient la brèche ! » Abû Hudhayfa appelle : « Gens du Coran, parez le Coran de vos actes ! » Sâlim plante l'étendard et ne recule plus."],
          ['nar', "Là-bas, le fer. Mais le Menteur ne tient pas par le fer : il tient par ce que des milliers de cœurs veulent entendre. Ce front-là n'a pas de distance. Il passe par ici."],
          ['say', 'abubakr', "Si je ne puis être à leurs côtés, que du moins rien de faux ne reste debout derrière eux."],
          ['heal'],
          ['map', 'noos', 'seuil', { hue: 305 }],
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
          ['nar', "L'aube. Les rangs de la prière sont clairsemés : tant d'hommes sont au loin, et l'on ne sait pas encore lesquels reviendront."],
          ['pray', 'fajr'],
          ['show', 'courrier']
        ] },
        { text: "Recevoir le courrier du Yamâma, à la porte de la mosquée", talk: 'courrier', then: [
          ['say', 'courrier', "Successeur du Messager d'Allah : la victoire. Le Menteur est mort, et le Yamâma est revenu à l'islam."],
          ['mus', 'deuil'],
          ['say', 'courrier', "Mais nous avons enterré douze cents des nôtres. Zayd ibn al-Khattâb. Sâlim. Abû Hudhayfa. Thâbit ibn Qays. Et des récitateurs par dizaines, de ceux qui portaient le Coran tout entier."],
          ['quote', "Il m'a devancé vers les deux biens : il a embrassé l'islam avant moi, et il est tombé martyr avant moi.", "'Umar, à la mort de son frère Zayd — Ibn 'Abd al-Barr, al-Istî'âb"],
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
          ['codex', 'jam_quran'],
          ['pillar', 'savoir', 2], ['mus', 'espoir']
        ] }
      ],
      outro: [
        ['nar', "Râwî, comprends-tu ? Le Menteur contrefaisait la Parole. La réponse ne fut pas seulement une bataille : ce fut une chaîne de témoins, verset après verset. Un isnâd."],
        ['nar', "C'est cette chaîne que tu tiens entre tes mains."]
      ]
    }
  ]
});
