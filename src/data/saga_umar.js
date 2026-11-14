/* ISNAD — Saga II : 'Umar ibn al-Khattâb, Al-Fârûq. Lumière : la Justice ('Adl).
   Sources principales : Ibn Sa'd (Tabaqât), at-Tabarî (Târîkh), Ibn Kathîr (al-Bidâya), al-Bukhârî, al-Hâkim, Mâlik (al-Muwatta').
   v2 : trois pourparlers (Abû Ghânim, Sophrone, Thawr), quatre prières, piliers, savoirs. Personnages de fiction : Hâzim ibn Nawfal,
   Abû Ghânim, l'ancien de Tibériade, Thawr ibn Mâlik (signalés comme tels dans le codex). */
ISNAD.registerSaga({
  id: 'umar', order: 2,
  name: "'Umar ibn al-Khattâb", epithet: 'Al-Fârûq', arabic: 'عمر',
  years: '13–23 H · 634–644',
  light: 'adl', lightName: 'Justice',
  ambiance: 'orientale · romaine',
  tagline: "Deux empires tombèrent sous son califat. Lui dormait sur une natte.",

  intro: [
    ['amb', 'vent'],
    ['title', "'Umar ibn al-Khattâb", 'Saga II · Al-Fârûq'],
    ['nar', "An 13 de l'Hégire. Abû Bakr s'éteint, et son dernier dépôt tient en un nom : 'Umar. Médine retient son souffle. On connaît sa rigueur ; on ignore encore jusqu'où elle ira contre lui-même."],
    ['nar', "En dix ans, Shâm, l'Irak, la Perse et l'Égypte s'ouvrent. Jamais tant d'or, de trônes et d'aigles n'ont regardé un seul homme. Et cet homme porte un manteau rapiécé."],
    ['nar', "Un empire qui s'ouvre n'est d'abord qu'un grenier trop plein. Il faut qu'un homme refuse d'y dormir pour que les autres y trouvent du pain, et non un maître."],
    ['nar', "Dans la noosphère, l'Empire ne meurt pas avec ses armées. Il cherche un nouveau front où poser sa couronne, un nouveau cœur où s'asseoir."],
    ['quote', "« Si une brebis périssait, égarée, au bord de l'Euphrate, je craindrais qu'Allah ne m'en demande compte au Jour de la Résurrection. »", "Abû Nu'aym, Hilyat al-Awliyâ' ; Ibn Sa'd, Tabaqât (variantes)"],
    ['nar', "Idris, suis la Chaîne. Voici la Justice : non pas une balance qu'on tient, mais un fardeau qu'on porte."]
  ],

  outro: [
    ['amb', 'silence'],
    ['mus', 'deuil'],
    ['nar', "La prière achevée, on le porte chez lui. Sa première question : qui m'a frappé ?"],
    ['quote', "« Louange à Allah, qui n'a pas placé ma mort entre les mains d'un homme se réclamant de l'islam. »", "al-Bukhârî, Sahîh (3700)"],
    ['nar', "Il fait compter ses dettes et demande qu'on les acquitte. Il refuse de désigner son fils et confie le choix du successeur à un conseil de six Compagnons."],
    ['quote', "« Je recommande à mon successeur les protégés d'Allah et de Son Messager : qu'il respecte leur pacte, qu'il les défende, et qu'on ne leur impose rien au-delà de leurs forces. »", "al-Bukhârî, Sahîh (3700) — traduction du sens"],
    ['nar', "Il fait demander la permission de reposer auprès de ses deux compagnons. Elle lui est accordée. Aucune parole, dit-il, ne lui importait davantage."],
    ['quote', "« Je voudrais en sortir quitte : rien pour moi, rien contre moi. »", "al-Bukhârî, Sahîh (3700)"],
    ['codex', 'shura'],
    ['nar', "Dix ans et demi. Les trônes sont tombés ; la natte est restée. Il repose près du Messager d'Allah ﷺ et d'Abû Bakr, comme il avait vécu : à leur suite."],
    ['mus', 'espoir'],
    ['nar', "Idris, retiens ceci : l'idole du pouvoir n'est pas brisée par celui qui la renverse, mais par celui qui refuse de s'y asseoir. La Justice commence par soi."],
    ['sfx', 'light'],
    ['light', 'adl']
  ],

  /* ───────────────────────────── HÉROS ───────────────────────────── */
  heroes: {
    umar: {
      name: "'Umar", title: 'Al-Fârûq', arabic: 'عمر',
      role: 'gardien', el: 'adl',
      look: { robe: '#7b5a3a', head: '#efe7d6', cloak: '#3d2c1e', aura: '#9fd0ff', item: 'durra' },
      skills: [
        { lvl: 1, id: 'durra', name: 'La Durra', desc: "Coup de férule. Peut étourdir.", cost: 3,
          target: 'foe', el: 'fer', pow: 1.3, fx: [{ st: 'stun', chance: 0.3 }], anim: 'slash' },
        { lvl: 1, id: 'firasa', name: 'Firâsa', desc: "Discerne les failles d'un égrégore et le frappe d'un trait de Justice.", cost: 2,
          target: 'foe', el: 'adl', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 2, id: 'ronde', name: 'Ronde de nuit', desc: "Veille sur le groupe : régénération pendant 3 tours.", cost: 5,
          target: 'allies', fx: [{ st: 'regen', turns: 3 }], anim: 'heal' },
        { lvl: 4, id: 'equite', name: 'Équité', desc: "La même mesure pour tous : Justice sur tous les égrégores.", cost: 6,
          target: 'foes', el: 'adl', pow: 0.9, anim: 'wave' },
        { lvl: 6, id: 'fardeau', name: 'Porter le fardeau', desc: "Prend la charge sur son dos : attire les coups, en garde, défense accrue.", cost: 4,
          target: 'self', fx: [{ st: 'taunt', turns: 2 }, { st: 'garde' }, { st: 'def', v: 1 }], anim: 'guard' },
        { lvl: 8, id: 'sentence', name: 'Sentence', desc: "Jugement sans appel : forte Justice, déchire un voile.", cost: 8,
          target: 'foe', el: 'adl', pow: 1.9, fx: [{ st: 'veil', v: -1 }], anim: 'light' }
      ],
      limit: { id: 'faruq', name: 'Al-Fârûq', desc: "Sépare le vrai du faux : Justice sur tous, bonus dissipés, deux voiles déchirés.",
               target: 'foes', el: 'adl', pow: 2.4, fx: [{ st: 'dispel' }, { st: 'veil', v: -2 }], anim: 'pillar' }
    },
    aslam: {
      name: 'Aslam', title: "L'affranchi de 'Umar", arabic: 'أسلم',
      role: 'soigneur', el: 'rahma',
      look: { robe: '#8a7a5c', head: '#d9cfb8', cloak: '#5b4a33', aura: '#7fe3d6' },
      skills: [
        { lvl: 1, id: 'lanterne', name: 'La Lanterne', desc: "Éclaire ce qui rôde : Miséricorde sur un égrégore.", cost: 2,
          target: 'foe', el: 'rahma', pow: 1.2, anim: 'light' },
        { lvl: 1, id: 'panser', name: 'Panser', desc: "Rend de la Constance à un compagnon.", cost: 3,
          target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 2, id: 'foyer', name: 'Ranimer le foyer', desc: "Un feu, une marmite : rend de la Constance à tout le groupe.", cost: 6,
          target: 'allies', heal: 0.6, anim: 'heal' },
        { lvl: 4, id: 'veille', name: 'Veille fidèle', desc: "Dissipe les altérations d'un compagnon et le régénère.", cost: 4,
          target: 'ally', fx: [{ st: 'cleanse' }, { st: 'regen', turns: 2 }], anim: 'heal' },
        { lvl: 6, id: 'relever', name: 'Relever', desc: "Relève un compagnon éprouvé.", cost: 8,
          target: 'ally', revive: true, heal: 0.6, anim: 'heal' },
        { lvl: 8, id: 'partage', name: 'La Part de chacun', desc: "Ce qui est partagé ne manque pas : Miséricorde sur tous, attaque ennemie réduite.", cost: 8,
          target: 'foes', el: 'rahma', pow: 1.0, fx: [{ st: 'atk', v: -1, chance: 0.6 }], anim: 'wave' }
      ],
      limit: { id: 'repas', name: 'Le Repas des humbles', desc: "Jusqu'à les voir rire : grand soin de groupe, altérations dissipées, régénération.",
               target: 'allies', heal: 1.2, fx: [{ st: 'cleanse' }, { st: 'regen', turns: 3 }], anim: 'heal' }
    },
    abuubayda: {
      name: "Abû 'Ubayda", title: "L'homme de confiance de la communauté", arabic: 'أبو عبيدة',
      role: 'stratege', el: 'sabr',
      look: { robe: '#b9ad92', head: '#f1ece0', cloak: '#6c7a5a', aura: '#9be0ae' },
      skills: [
        { lvl: 1, id: 'depot', name: 'Garde du dépôt', desc: "Ce qu'on lui confie, il le rend : Patience sur un égrégore.", cost: 3,
          target: 'foe', el: 'sabr', pow: 1.3, anim: 'light' },
        { lvl: 1, id: 'droiture', name: 'Parole droite', desc: "Véracité sur un égrégore ; dissipe ses bonus.", cost: 4,
          target: 'foe', el: 'sidq', pow: 1.1, fx: [{ st: 'dispel' }], anim: 'glyph' },
        { lvl: 2, id: 'rangs', name: 'Rangs serrés', desc: "Resserre les rangs : défense du groupe accrue.", cost: 5,
          target: 'allies', fx: [{ st: 'def', v: 1 }], anim: 'guard' },
        { lvl: 4, id: 'marche', name: 'Marche de Shâm', desc: "Presse le pas : élan du groupe accru, +1 Niyya.", cost: 6,
          target: 'allies', fx: [{ st: 'spd', v: 1 }, { st: 'niyya', v: 1 }], anim: 'wave' },
        { lvl: 6, id: 'depouillement', name: 'Dépouillement', desc: "Qui ne possède rien ne craint rien : Patience sur tous, attaque réduite.", cost: 7,
          target: 'foes', el: 'sabr', pow: 0.9, fx: [{ st: 'atk', v: -1, chance: 0.5 }], anim: 'wave' },
        { lvl: 8, id: 'demeurer', name: 'Demeurer parmi les siens', desc: "Il ne quitte pas son armée : garde et régénération pour tout le groupe.", cost: 8,
          target: 'allies', fx: [{ st: 'garde' }, { st: 'regen', turns: 3 }], anim: 'guard' }
      ],
      limit: { id: 'amin', name: 'Amîn al-Umma', desc: "La confiance tenue jusqu'au bout : Patience sur tous, deux voiles déchirés.",
               target: 'foes', el: 'sabr', pow: 2.3, fx: [{ st: 'veil', v: -2 }, { st: 'stun', chance: 0.35 }], anim: 'pillar' }
    },
    abdarrahman: {
      name: "'Abd ar-Rahmân", title: "Ibn 'Awf", arabic: 'عبد الرحمن',
      role: 'sage', el: 'sidq',
      look: { robe: '#d8d2c2', head: '#f4efe2', cloak: '#7a5c2e', aura: '#ffe7a0' },
      skills: [
        { lvl: 1, id: 'loyal', name: 'Commerce loyal', desc: "Ni fraude ni serment vain : Véracité sur un égrégore.", cost: 3,
          target: 'foe', el: 'sidq', pow: 1.3, anim: 'light' },
        { lvl: 1, id: 'peser', name: 'Peser juste', desc: "Révèle les failles d'un égrégore et déchire un voile.", cost: 4,
          target: 'foe', el: 'sidq', pow: 0.8, fx: [{ st: 'reveal' }, { st: 'veil', v: -1 }], anim: 'glyph' },
        { lvl: 2, id: 'caravane', name: 'Caravane offerte', desc: "Donne sans compter : rend de la Constance à tout le groupe.", cost: 6,
          target: 'allies', heal: 0.6, anim: 'heal' },
        { lvl: 4, id: 'aumone', name: 'Aumône discrète', desc: "Soutient un compagnon : +2 Niyya, Esprit accru.", cost: 4,
          target: 'ally', fx: [{ st: 'niyya', v: 2 }, { st: 'mag', v: 1 }], anim: 'heal' },
        { lvl: 6, id: 'desistement', name: 'Désistement', desc: "Renonce pour départager : Véracité sur tous, bonus dissipés.", cost: 7,
          target: 'foes', el: 'sidq', pow: 0.9, fx: [{ st: 'dispel' }], anim: 'wave' },
        { lvl: 8, id: 'serment', name: 'Serment tenu', desc: "Une parole qui ne plie pas : forte Véracité.", cost: 8,
          target: 'foe', el: 'sidq', pow: 1.9, anim: 'pillar' }
      ],
      limit: { id: 'garant', name: "L'or dans la main", desc: "La richesse dans la main, jamais dans le cœur : Véracité sur tous, bonus dissipés.",
               target: 'foes', el: 'sidq', pow: 2.3, fx: [{ st: 'dispel' }, { st: 'veil', v: -1 }], anim: 'pillar' }
    }
  },

  /* ──────────────────────────── ÉGRÉGORES ──────────────────────────── */
  enemies: {
    murmure_faim: {
      name: 'Murmure de la faim', art: 'wisp', hue: 28, scale: 1,
      lvl: 1, tier: 'minion', weak: ['rahma', 'adl'], veils: 1,
      skills: [
        { w: 2, name: 'Creux', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'atk', v: -1, chance: 0.3 }], anim: 'dark' }
      ],
      taunts: ['Il n\'y en aura pas pour tous…'],
      desc: "Menu égrégore né des ventres vides qui regardent ensemble vers les mêmes portes closes. Il ne veut rien : il répète seulement qu'il n'y en aura pas pour tous. Un geste de Miséricorde le dissipe."
    },
    cendre: {
      name: 'Plainte des cendres', art: 'swarm', hue: 12, scale: 1,
      lvl: 2, tier: 'minion', weak: ['rahma', 'sabr'], veils: 2,
      skills: [
        { w: 2, name: 'Vent de cendre', target: 'foes', el: 'fer', pow: 0.6, anim: 'wave' },
        { w: 1, name: 'Lassitude', target: 'foe', fx: [{ st: 'waswas', turns: 2 }], anim: 'dark' }
      ],
      desc: "Nuée grise levée par neuf mois de sécheresse. Elle se nourrit du découragement et use lentement ceux qu'elle entoure. La Patience et la Miséricorde la font retomber."
    },
    accapareur: {
      name: "L'Accapareur", art: 'tower', hue: 45, scale: 2,
      lvl: 3, tier: 'elite', weak: ['rahma', 'adl'], veils: 3,
      skills: [
        { w: 2, name: 'Thésauriser', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' },
        { w: 3, name: 'Disette', target: 'foes', el: 'fer', pow: 0.7, fx: [{ st: 'atk', v: -1, chance: 0.4 }], anim: 'dark' },
        { w: 2, name: 'Prix du grain', target: 'foe', el: 'fer', pow: 1.3, anim: 'burst' }
      ],
      phases: [
        { at: 0.5, say: "Ce que je garde, nul n'aura faim de le voir… Demain, cela vaudra le double.", fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Greniers clos', target: 'foes', el: 'fer', pow: 1.0, anim: 'dark' }] }
      ],
      taunts: ['Encore un peu. Juste un peu plus.', 'Attends que les prix montent.'],
      desc: "Égrégore de la pénurie organisée. Chaque grenier fermé par calcul l'élève d'un étage ; il se nourrit de la peur de manquer, et la fabrique. Il cède devant la Miséricorde, qui donne, et la Justice, qui répartit."
    },
    mirage: {
      name: 'Mirage de gloire', art: 'mask', hue: 200, scale: 1,
      lvl: 3, tier: 'minion', weak: ['adl', 'sabr'], veils: 2,
      skills: [
        { w: 2, name: 'Arc de triomphe', target: 'foe', el: 'fer', pow: 1.1, anim: 'burst' },
        { w: 1, name: 'Éblouir', target: 'foe', fx: [{ st: 'doute', turns: 2, chance: 0.5 }], anim: 'dark' }
      ],
      taunts: ['Ils t\'acclameront. Avance.'],
      desc: "Masque vide que le désert tend aux vainqueurs en marche : arcs, cortèges, acclamations. Il n'a de force que celle qu'on lui prête. La Justice le traverse ; la Patience le laisse se dissiper."
    },
    faste: {
      name: 'Le Faste', art: 'crown', hue: 300, scale: 1,
      lvl: 4, tier: 'minion', weak: ['sabr', 'rahma'], veils: 2,
      skills: [
        { w: 2, name: 'Cortège', target: 'foes', el: 'fer', pow: 0.7, anim: 'wave' },
        { w: 1, name: 'Pourpre', target: 'allies', fx: [{ st: 'atk', v: 1 }], anim: 'guard' }
      ],
      taunts: ['Un maître se reconnaît à sa suite.'],
      desc: "Petite couronne de pourpre, née de la pompe des cours. Elle persuade que l'autorité se mesure au cortège. La simplicité patiente la fait tomber en poussière."
    },
    aigle: {
      name: "L'Aigle d'Airain", art: 'eagle', hue: 35, scale: 3,
      lvl: 5, tier: 'boss', weak: ['sabr', 'adl'], veils: 5,
      skills: [
        { w: 3, name: "Serres d'airain", target: 'foe', el: 'fer', pow: 1.5, anim: 'slash' },
        { w: 2, name: 'Ailes déployées', target: 'foes', el: 'fer', pow: 0.85, anim: 'wave' },
        { w: 1, name: 'Triomphe', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'guard' },
        { w: 2, name: 'Entre en César', target: 'foe', fx: [{ st: 'doute', turns: 2, chance: 0.6 }, { st: 'def', v: -1 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.6, say: "Regarde ces colonnes : elles ont vu passer Pompée, Titus, Héraclius. Elles ne demandent qu'à te voir, toi.", fx: [{ st: 'spd', v: 1 }] },
        { at: 0.3, say: "Sans moi, qui tiendra ces peuples ? Un manteau rapiécé ?", fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Mille légions', target: 'foes', el: 'fer', pow: 1.1, fx: [{ st: 'def', v: -1, chance: 0.5 }], anim: 'burst' }] }
      ],
      taunts: ['Entre en César.', 'Ils veulent un maître à admirer. Donne-le-leur.'],
      desc: "Égrégore de l'orgueil d'empire. Les légions meurent, l'enseigne reste : elle passe de vaincu en vainqueur. Elle cède devant la Patience des humbles et la Justice."
    },
    reflet: {
      name: "Reflet d'or", art: 'mirror', hue: 50, scale: 1,
      lvl: 5, tier: 'minion', weak: ['rahma', 'sidq'], veils: 2,
      skills: [
        { w: 2, name: "Poids de l'or", target: 'foe', el: 'fer', pow: 1.2, fx: [{ st: 'spd', v: -1, chance: 0.4 }], anim: 'burst' },
        { w: 1, name: 'Scintiller', target: 'foe', fx: [{ st: 'mag', v: -1 }, { st: 'waswas', turns: 2, chance: 0.5 }], anim: 'dark' }
      ],
      taunts: ['Et ta part ? As-tu compté ta part ?'],
      desc: "Éclat détaché des trésors de Kisrâ. Il montre à chacun ce qu'il pourrait posséder, et sème la rivalité. La Véracité le ternit ; la Miséricorde, qui donne, l'éteint."
    },
    couronne: {
      name: 'La Couronne suspendue', art: 'crown', hue: 42, scale: 2,
      lvl: 7, tier: 'elite', weak: ['adl', 'sidq'], veils: 4,
      skills: [
        { w: 3, name: "Chaîne d'or", target: 'foe', el: 'fer', pow: 1.4, fx: [{ st: 'stun', chance: 0.25 }], anim: 'slash' },
        { w: 2, name: 'Cent joyaux', target: 'foes', el: 'fer', pow: 0.85, anim: 'burst' },
        { w: 1, name: 'Majesté', target: 'allies', fx: [{ st: 'def', v: 1 }], anim: 'guard' }
      ],
      phases: [
        { at: 0.5, say: "Nul front ne peut me porter : c'est pourquoi tous se courbent.", fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 2, name: 'Courbez-vous', target: 'foes', el: 'fer', pow: 1.0, fx: [{ st: 'spd', v: -1, chance: 0.5 }], anim: 'dark' }] }
      ],
      desc: "La couronne de Kisrâ était si lourde qu'une chaîne d'or la tenait suspendue au-dessus du trône. Son égrégore pèse de même sur les esprits. La Justice rompt la chaîne ; la Véracité dit son poids réel."
    },
    trone: {
      name: 'Le Trône vide', art: 'throne', hue: 48, scale: 3,
      lvl: 8, tier: 'boss', weak: ['adl', 'rahma'], veils: 6,
      skills: [
        { w: 3, name: 'Décret', target: 'foe', el: 'fer', pow: 1.6, anim: 'burst' },
        { w: 2, name: 'Prosternez-vous', target: 'foes', el: 'fer', pow: 0.9, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'wave' },
        { w: 1, name: 'Tapis du Printemps', target: 'self', fx: [{ st: 'regen', turns: 3 }, { st: 'def', v: 1 }], anim: 'guard' },
        { w: 1, name: 'Bracelets', target: 'foe', fx: [{ st: 'stun', chance: 0.5 }, { st: 'doute', turns: 2, chance: 0.5 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.66, say: "Tu partages l'or ? Soit. L'or revient toujours vers moi. Assieds-toi, et tu partageras mieux.", fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Trésor de Kisrâ', target: 'foes', el: 'fer', pow: 1.0, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'dark' }] },
        { at: 0.33, say: "Qui me brise me remplace. Il en fut toujours ainsi.", fx: [{ st: 'spd', v: 1 }, { st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Tyrannie', target: 'foes', el: 'fer', pow: 1.25, fx: [{ st: 'atk', v: -1, chance: 0.5 }], anim: 'burst' }] }
      ],
      taunts: ['Assieds-toi.', 'Les hommes passent. La place reste.', 'Un seul instant. Pour bien faire.'],
      desc: "Égrégore de la tyrannie. Ce n'est pas un roi, mais la place du roi : un vide qui exige d'être occupé et survit à tous ceux qui s'y asseyent. Il cède devant la Justice, qui ne s'exempte pas elle-même, et la Miséricorde."
    }
  },

  /* ───────────────────────────── CODEX ───────────────────────────── */
  codex: [
    { id: 'bio_umar', cat: 'Biographie', title: "'Umar ibn al-Khattâb",
      text: "'Umar ibn al-Khattâb (qu'Allah l'agrée), des Banû 'Adî de Quraysh, embrasse l'islam à La Mecque et devient l'un des plus proches Compagnons du Prophète ﷺ. On rapporte qu'il reçut le surnom d'al-Fârûq : celui qui distingue le vrai du faux. Deuxième calife (13–23 H), premier à porter le titre de Commandeur des croyants, il institue le calendrier de l'Hégire, le dîwân et les rondes de nuit. Sous son califat s'ouvrent Shâm, l'Irak, la Perse et l'Égypte. Il meurt en martyr à Médine.",
      src: "Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh ; adh-Dhahabî, Siyar" },
    { id: 'bio_aslam', cat: 'Biographie', title: "Aslam, l'affranchi de 'Umar",
      text: "Aslam (qu'Allah lui fasse miséricorde) entra au service de 'Umar en l'an 11 H et resta son affranchi (mawlâ). Il l'accompagna dans ses rondes nocturnes et transmit de lui de nombreux récits, dont celui de la famille affamée de la harra. Son fils Zayd ibn Aslam devint l'un des savants de Médine. Il mourut à Médine, très âgé, vers 80 H.",
      src: "Ibn Sa'd, Tabaqât ; adh-Dhahabî, Siyar" },
    { id: 'bio_abuubayda', cat: 'Biographie', title: "Abû 'Ubayda ibn al-Jarrâh",
      text: "Abû 'Ubayda 'Âmir ibn al-Jarrâh (qu'Allah l'agrée) compte parmi les dix à qui le Paradis fut annoncé. Le Prophète ﷺ a dit : « Chaque communauté a son homme de confiance, et l'homme de confiance de cette communauté est Abû 'Ubayda. » Commandant en chef en Shâm sous 'Umar, il y vécut sans faste. En 18 H, lors de la peste d'Emmaüs ('Amwâs), il refusa de quitter son armée et mourut parmi les siens.",
      src: "al-Bukhârî, Sahîh (3744) ; Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh" },
    { id: 'bio_abdarrahman', cat: 'Biographie', title: "'Abd ar-Rahmân ibn 'Awf",
      text: "'Abd ar-Rahmân ibn 'Awf (qu'Allah l'agrée), l'un des dix à qui le Paradis fut annoncé, compte parmi les tout premiers musulmans. Arrivé à Médine sans rien, il déclina l'aide offerte et demanda seulement : « Indique-moi le marché. » Devenu l'un des plus riches marchands, il resta l'un des plus généreux. C'est lui que 'Umar blessé avança pour achever la prière ; membre du conseil des six, il se désista pour départager les autres.",
      src: "al-Bukhârî, Sahîh (2048, 3700) ; Ibn Sa'd, Tabaqât" },
    { id: 'ramada', cat: 'Événement', title: "L'Année des cendres",
      text: "En 18 H, la sécheresse frappe le Hijâz près de neuf mois ; la terre prend la couleur de la cendre (ramâd). Les bédouins affluent vers Médine. 'Umar jure de ne goûter ni beurre ni viande tant que les gens n'en auront pas, dresse des tables communes et écrit aux provinces : des caravanes de vivres arrivent de Shâm, d'Irak et d'Égypte. Il sort prier pour la pluie avec les gens. Aslam rapporte la nuit où il porta lui-même la farine à une famille affamée : « Porteras-tu mon fardeau au Jour de la Résurrection ? »",
      src: "Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya" },
    { id: 'jerusalem', cat: 'Événement', title: "La reddition d'Îliyâ' (Jérusalem)",
      text: "Assiégée par l'armée d'Abû 'Ubayda, Îliyâ' se rend à condition que le calife vienne en personne (entre 15 et 17 H selon les sources). 'Umar accorde aux habitants un écrit de sécurité pour leurs personnes, leurs biens, leurs églises et leurs croix ; Khâlid ibn al-Walîd, 'Amr ibn al-'Âs, 'Abd ar-Rahmân ibn 'Awf et Mu'âwiya en sont témoins. Une source chrétienne plus tardive, Eutychius, rapporte qu'il déclina de prier dans l'église de la Résurrection pour qu'elle ne fût pas revendiquée après lui. Il fit dégager l'esplanade de ses décombres et y pria.",
      src: "at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya ; Eutychius, Annales" },
    { id: 'honneur', cat: 'Parole', title: "« Allah nous a honorés par l'islam »",
      text: "Parvenu à un gué de Shâm, 'Umar descend de sa monture, ôte ses chaussures et traverse à pied, la bride à la main. Abû 'Ubayda redoute le regard des notables du pays. 'Umar répond : « Nous étions le peuple le plus humble, et Allah nous a honorés par l'islam. Si nous cherchons l'honneur ailleurs que dans ce par quoi Allah nous a honorés, Allah nous humiliera. » La dignité, pour lui, ne se revêt pas : elle se reçoit.",
      src: "al-Hâkim, al-Mustadrak (jugé authentique par adh-Dhahabî)" },
    { id: 'bilal', cat: 'Événement', title: "L'appel de Bilâl en Shâm",
      text: "Bilâl ibn Rabâh (qu'Allah l'agrée) fut le premier muezzin de l'islam. Après la mort du Prophète ﷺ, il cessa de lancer l'appel et partit pour Shâm. On rapporte que, lors de la venue de 'Umar, on le pria d'appeler à la prière une fois encore : à sa voix, ceux qui avaient connu le temps du Prophète ﷺ pleurèrent comme jamais, et 'Umar plus que tous. Il mourut en Shâm vers 20 H.",
      src: "Ibn Kathîr, al-Bidâya ; adh-Dhahabî, Siyar ; Ibn Sa'd, Tabaqât" },
    { id: 'hurmuzan', cat: 'Parole', title: "« Tu as été juste, alors tu as dormi »",
      text: "Al-Hurmuzân, prince perse d'al-Ahwâz capturé à Tustar, fut conduit à Médine par Anas ibn Mâlik et al-Ahnaf ibn Qays. Il trouva 'Umar endormi dans la mosquée, sans garde ni chambellan. La tradition a conservé, avec des attributions diverses (un envoyé de César, de Kisrâ, ou al-Hurmuzân lui-même), la formule : « Tu as gouverné avec justice, alors tu as été en sécurité, alors tu as dormi. » Ayant obtenu la vie sauve par une ruse que 'Umar honora, il embrassa l'islam et s'établit à Médine.",
      src: "at-Tabarî, Târîkh ; al-Balâdhurî, Futûh al-Buldân ; la formule relève d'une tradition plus tardive" },
    { id: 'suraqa', cat: 'Événement', title: 'Les bracelets de Kisrâ',
      text: "Surâqa ibn Mâlik, des Banû Mudlij, avait poursuivi le Prophète ﷺ sur la route de l'Hégire avant d'y renoncer. On rapporte qu'il lui fut alors promis les bracelets de Kisrâ. Quand les dépouilles d'al-Madâ'in parvinrent à Médine, 'Umar l'en para devant tous, puis répartit le trésor. À la vue de cet or, 'Umar pleura : il craignait la rivalité et la haine qu'il ferait naître. 'Alî lui dit : « Tu t'es abstenu, alors tes sujets se sont abstenus. »",
      src: "al-Bayhaqî, Dalâ'il an-Nubuwwa ; Ibn 'Abd al-Barr, al-Istî'âb ; at-Tabarî ; Ibn Kathîr" },
    { id: 'shura', cat: 'Événement', title: "L'aube et le conseil des six",
      text: "Fin 23 H, 'Umar est frappé pendant la prière de l'aube par Abû Lu'lu'a, un esclave perse. Il loue Allah que son meurtrier ne se réclame pas de l'islam, fait compter ses dettes et recommande à son successeur les protégés (dhimma). Il confie le choix du calife à six Compagnons : 'Uthmân, 'Alî, Talha, az-Zubayr, Sa'd ibn Abî Waqqâs et 'Abd ar-Rahmân ibn 'Awf. Il est enterré auprès du Prophète ﷺ et d'Abû Bakr.",
      src: "al-Bukhârî, Sahîh (3700)" },
    { id: 'istisqa', cat: 'Événement', title: 'La prière pour la pluie',
      text: "Au plus dur de l'Année des cendres, 'Umar sort avec les gens demander la pluie. Anas ibn Mâlik rapporte qu'il faisait alors avancer al-'Abbâs ibn 'Abd al-Muttalib, l'oncle du Prophète ﷺ, et disait : « Ô Allah, nous Te sollicitions par notre Prophète et Tu nous donnais la pluie ; nous Te sollicitons par l'oncle de notre Prophète : donne-nous la pluie. » Et la pluie leur était donnée. Le calife ne se met pas en avant : il cherche, parmi les siens, celui dont la demande sera la plus humble.",
      src: "al-Bukhârî, Sahîh (1010) — traduction du sens ; Ibn Sa'd, Tabaqât" },
    { id: 'accaparement', cat: 'Parole', title: "« Pas d'accaparement sur notre marché »",
      text: "On rapporte que 'Umar disait : « Pas d'accaparement sur notre marché. » Il interdisait à ceux qui avaient de l'or en trop d'acheter les vivres arrivés à Médine pour les retenir jusqu'à la hausse ; mais celui qui apportait lui-même sa marchandise, à dos de bête, l'été comme l'hiver, restait libre de vendre ou de garder. La règle ne vise pas le marchand : elle vise le calcul fait sur la faim d'autrui.",
      src: "Mâlik, al-Muwatta' (livre des ventes) — traduction du sens" },
    { id: 'registre_farine', cat: 'Événement', title: 'Le feuillet de la Maison de la farine',
      text: "'Umar fit tenir à Médine une Maison de la farine (Dâr ad-Daqîq) : farine, dattes, raisins secs, de quoi secourir le voyageur et le nécessiteux. Le feuillet trouvé ici est une invention du jeu : il compte quarante sacs sortis l'année de la faim sans nom en face. Un registre ne nourrit personne ; mais il empêche que la faim des uns devienne, sans bruit, le commerce des autres.",
      src: "Dâr ad-Daqîq : Ibn Sa'd, Tabaqât. Le feuillet et ses chiffres sont fictifs." },
    { id: 'hazim_fiction', cat: 'Biographie', title: 'Hâzim ibn Nawfal (personnage de fiction)',
      text: "Hâzim n'a pas existé : le jeu l'invente pour donner un visage à l'hypocrite, celui qui dit au pouvoir ce qu'il veut entendre et se sert derrière la louange. Ce qu'il rencontre, en revanche, est rapporté : 'Umar faisait inventorier les biens de ses gouverneurs à leur prise de charge, leur demandait raison de tout surplus, et se méfiait de qui le louait en face.",
      src: "Pratique de 'Umar : Ibn Sa'd, Tabaqât ; al-Balâdhurî, Futûh al-Buldân. Le personnage est fictif." },
    { id: 'bannissement', cat: 'Événement', title: "L'interdit d'Aelia",
      text: "Après la révolte de 132–135, l'empereur Hadrien rebâtit Jérusalem sous le nom d'Aelia et en interdit le séjour aux juifs. L'interdit, appliqué avec plus ou moins de rigueur selon les règnes, est renouvelé par Héraclius vers 630, au lendemain de la guerre perse. Quand 'Umar arrive, il dure depuis cinq siècles. C'est une loi de César : elle a un auteur et une date.",
      src: "Eusèbe de Césarée, Histoire ecclésiastique ; chroniqueurs byzantins ; historiographie moderne" },
    { id: 'familles_tiberiade', cat: 'Événement', title: 'Les soixante-dix familles',
      text: "Le texte du pacte transmis par at-Tabarî contient une clause demandée par les gens de la ville : qu'aucun juif n'y habite avec eux, comme sous Byzance. D'autres traditions, plus tardives — un récit judéo-arabe retrouvé dans la Geniza du Caire, des chroniqueurs — rapportent que 'Umar autorisa ensuite soixante-dix familles venues de Tibériade à s'établir au sud de l'esplanade. Les historiens discutent encore ces récits. Le jeu en fait un pourparler : l'ancien de Tibériade est un personnage de fiction, et seule la manière varie, non l'issue rapportée.",
      src: "at-Tabarî, Târîkh (texte du pacte) ; fragment de la Geniza du Caire ; traditions tardives, attributions discutées" },
    { id: 'ghassan', cat: 'Lieu', title: 'Les Ghassânides, gardiens de la marche',
      text: "Arabes chrétiens établis aux confins de Shâm, les Banû Ghassân gardaient la frontière du désert pour Rome, contre une solde. Le chroniqueur Théophane rapporte que, vers 630, un trésorier d'Héraclius refusa leur solde à des Arabes fédérés de la frontière en les insultant ; plusieurs tribus s'en souvinrent. Jabala ibn al-Ayham fut leur dernier roi : il combattit au Yarmoûk dans le camp romain.",
      src: "Théophane, Chronographie ; al-Balâdhurî, Futûh al-Buldân" },
    { id: 'jabala', cat: 'Événement', title: "L'affaire de Jabala ibn al-Ayham",
      text: "On rapporte que Jabala, roi ghassânide, embrassa l'islam et vint en grand équipage. Pendant le pèlerinage, un homme des Fazâra marcha sur le pan de son manteau ; Jabala le frappa au visage. 'Umar lui donna le choix : obtenir le pardon de l'homme, ou subir la pareille. « Je suis un roi et lui un homme du commun. — L'islam vous a réunis, toi et lui. » Jabala demanda la nuit et gagna Constantinople avec les siens. Le récit est célèbre, mais sa chaîne est discutée et ses versions divergent (d'autres le placent à Damas, devant Abû 'Ubayda). Le jeu le met en scène à Médine ; Thawr ibn Mâlik est un personnage de fiction.",
      src: "Ibn Kathîr, al-Bidâya ; al-Isfahânî, Kitâb al-Aghânî ; al-Balâdhurî (autre version)" },
    { id: 'diwan', cat: 'Événement', title: 'Le dîwân',
      text: "Quand l'argent des provinces afflua, 'Umar consulta les Compagnons et fit dresser un registre des pensions, le dîwân, par tribus et par rang d'ancienneté dans l'islam. On voulut l'inscrire en tête ; il répondit : « Placez 'Umar là où Allah l'a placé », et fit commencer par les proches du Prophète ﷺ. Ce que chacun reçoit est écrit, donc vérifiable : le registre met le Trésor sous le regard de tous.",
      src: "Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh ; al-Balâdhurî, Futûh al-Buldân" },
    { id: 'hijri', cat: 'Événement', title: "Le calendrier de l'Hégire",
      text: "On rapporte qu'Abû Mûsâ al-Ash'arî écrivit de Bassora : « Il nous vient de toi des lettres sans date. » 'Umar réunit les Compagnons, vers l'an 17. Les uns proposèrent de compter depuis la naissance du Prophète ﷺ, d'autres depuis sa mort ; on retint l'Hégire, sur l'avis de 'Alî dit-on, et le mois de Muharram pour ouvrir l'année. Ni une naissance ni un deuil : le jour où une communauté quitta sa ville pour sa foi.",
      src: "at-Tabarî, Târîkh ; al-Hâkim, al-Mustadrak ; Ibn Hajar, Fath al-Bârî" },
    { id: 'ego_accapareur', cat: 'Noosphère', title: "L'Accapareur",
      text: "Égrégore de la pénurie organisée. Il naît lorsque beaucoup ferment ensemble leurs greniers en regardant monter les prix : chaque porte close l'élève d'un étage. Il se nourrit de la peur de manquer, et la fabrique à son tour. La force seule l'entame peu ; il cède devant la Miséricorde, qui donne, et la Justice, qui répartit.",
      src: 'Lecture noosphérique du jeu' },
    { id: 'ego_aigle', cat: 'Noosphère', title: "L'Aigle d'Airain",
      text: "Égrégore de l'orgueil d'empire. Les légions meurent, les aigles restent : l'enseigne passe du vaincu au vainqueur et murmure à chaque conquérant d'entrer en César. Il se nourrit des foules qui attendent un maître à admirer. À Jérusalem, 'Umar lui opposa un manteau rapiécé et un pacte. Il cède devant la Patience des humbles et la Justice.",
      src: 'Lecture noosphérique du jeu' },
    { id: 'ego_trone', cat: 'Noosphère', title: 'Le Trône vide',
      text: "Égrégore de la tyrannie. Ce n'est pas un roi, mais la place du roi : un vide qui exige d'être occupé et survit à tous ceux qui s'y asseyent. L'or est son appât ; la peur de perdre, sa chaîne. On ne le brise pas en s'y asseyant « pour bien faire ». Il cède devant la Justice, qui ne s'exempte pas elle-même, et devant la Miséricorde.",
      src: 'Lecture noosphérique du jeu' }
  ],

  /* ──────────────────────────── CHAPITRES ──────────────────────────── */
  chapters: [
    /* ═══ 1. LES RONDES DE NUIT ═══ */
    {
      id: 'u1', title: 'Les Rondes de nuit', sub: 'An 18 H · 639 · Médine',
      map: 'medine', opts: { time: 'night' }, start: 'maison',
      party: ['umar'],
      npcs: [
        { id: 'aslam_pnj', name: 'Aslam', hero: 'aslam', at: ['maison', 1, 0],
          talk: [['say', 'aslam', "La lanterne est prête, Commandeur des croyants."]] },
        { id: 'veilleur', name: 'Veilleur', at: 'porte_nord', look: { kind: 'soldat', robe: '#5a4632', head: '#d8cfc0' },
          talk: [['say', 'veilleur', "Rien à signaler, sinon le vent. On dit que le calife n'applique pas la peine du vol cette année : on ne châtie pas celui que la faim a poussé."]] },
        { id: 'bedouin', name: 'Bédouin réfugié', at: ['place', 2, 1], look: { kind: 'bedouin', robe: '#6e5b45', head: '#cbbfa9' },
          talk: [['say', 'bedouin', "Tout le désert est venu se serrer contre Médine. Le calife a fait compter les arrivants ; chaque soir on dresse des tables, et il s'y assoit le dernier."]] },
        { id: 'ancien', name: 'Ancien de Médine', at: ['mosquee_porte', 1, 0], look: { kind: 'ancien', robe: '#8c8272', head: '#eee6d6' },
          talk: [['ask', "L'ancien se chauffe les mains au-dessus d'une braise.", [
            { t: "Depuis quand dure la sécheresse ?", r: [['say', 'ancien', "Neuf lunes bientôt. La terre a pris la couleur de la cendre : on appelle déjà cette année l'Année des cendres."]] },
            { t: "Que fait le calife ?", r: [['say', 'ancien', "Il mange ce que mangent les pauvres : de l'huile et du pain d'orge. Il a écrit à l'Égypte, à Shâm et à l'Irak. Les caravanes viendront."]] },
            { t: "Et les marchands de grain ?", r: [
              ['say', 'ancien', "Les uns ont vidé leurs greniers dès le premier mois. D'autres attendent la hausse. 'Umar l'a dit au souk : pas d'accaparement sur notre marché. Mais il préfère une porte qu'on ouvre à une porte qu'on enfonce."],
              ['codex', 'accaparement'] ] },
            { t: "Le laisser à sa braise", r: [['say', 'ancien', "Qu'Allah allège cette nuit."]] }
          ]]] },
        { id: 'hazim', name: 'Hâzim, commis de la Maison de la farine', at: ['souk', 0, -1], look: { kind: 'homme', robe: '#5e6a58', head: '#e8dfc8', cloak: '#3a4236' },
          talk: [['say', 'hazim', "Dors tranquille, Commandeur des croyants. Tant que je tiens les clés, pas un grain ne s'égare. Qui te sert mieux que moi ?"]] },
        { id: 'ghanim', name: 'Abû Ghânim, marchand de grain', at: ['place', -2, -1], look: { kind: 'marchand', robe: '#6a4f3a', head: '#d9c9a8', cloak: '#4a3626' },
          talk: [['say', 'ghanim', "Le grain ? Reviens au matin. À cette heure je ne vends ni n'achète : je veille sur ce qui est à moi."]] },
        { id: 'voyageur', name: 'Voyageur', at: 'enclos', hidden: true, look: { kind: 'homme', robe: '#6b5a48', head: '#c9bda8' },
          talk: [['say', 'voyageur', "La nuit et le froid nous ont arrêtés ici."]] },
        { id: 'enfant1', name: 'Enfant', at: ['enclos', 1, 1], hidden: true, look: { kind: 'enfant', robe: '#8a7560', head: '#d6cab4' },
          talk: [['nar', "L'enfant pleure doucement, tourné vers la marmite."]] },
        { id: 'enfant2', name: 'Enfant', at: ['enclos', -1, 1], hidden: true, look: { kind: 'enfant', robe: '#7d6a58', head: '#d0c4ae' },
          talk: [['nar', "L'enfant grelotte près du feu."]] }
      ],
      foes: [
        { id: 'f1', at: 'puits', group: ['murmure_faim', 'murmure_faim'], bg: 'ville' },
        { id: 'f2', at: 'palmeraie', group: ['cendre', 'murmure_faim'], bg: 'ville' },
        { id: 'f3', map: 'noos', at: 'noeud2', group: ['cendre', 'cendre'], bg: 'noos' }
      ],
      chests: [
        { at: ['souk', 2, 1], item: 'dattes', n: 2 },
        { at: ['souk', -1, 1], codex: 'registre_farine' },
        { map: 'noos', at: ['faille', 0, 0], item: 'musc', n: 1 }
      ],
      intro: [
        ['amb', 'nuit'],
        ['title', 'Les Rondes de nuit', "An 18 de l'Hégire · l'Année des cendres"],
        ['nar', "Neuf mois sans pluie. La terre du Hijâz a pris la couleur de la cendre, et les tribus affamées campent autour de Médine."],
        ['nar', "Chaque nuit, quand la ville dort, un homme sort de chez lui sans escorte et marche dans les ruelles. Il veut voir de ses yeux ce dont il devra répondre."]
      ],
      objectives: [
        { text: 'Rejoindre Aslam devant la maison', talk: 'aslam_pnj', then: [
          ['say', 'aslam', "Commandeur des croyants, la nuit est froide et Médine a faim. Par où commence la ronde ?"],
          ['say', 'umar', "Par là où l'on pleure. Prends la lanterne, Aslam."],
          ['say', 'aslam', "Avant de partir… On a acheté pour toi une outre de beurre et une outre de lait. Quarante dirhams."],
          ['choice', "Le peuple manque de tout. Que fait 'Umar du beurre et du lait ?", [
            { t: "Les donner en aumône, et s'en tenir à l'huile et au pain d'orge", ok: true, r: [
              ['say', 'umar', "Tu as payé cher. Donne-les en aumône : je répugne à manger avec excès."],
              ['quote', "« Comment me soucierais-je du sort des gens, si ce qui les atteint ne m'atteint pas ? »", "Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh"]
            ] },
            { t: "Les accepter : un chef affaibli ne sert personne", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. Cette année-là, 'Umar jura de ne goûter ni beurre ni viande tant que les gens n'en auraient pas."]
            ] },
            { t: "Les garder en réserve pour sa maison", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. Sa maison passait après toutes les autres : il fit donner les deux outres."]
            ] }
          ]],
          ['hide', 'aslam_pnj'], ['join', 'aslam'], ['give', 'dattes', 2], ['codex', 'bio_aslam'],
          ['say', 'aslam', "On entend des murmures près du puits. Ce ne sont pas des voix d'hommes."]
        ] },
        { text: 'Dissiper les murmures de la faim près du puits', foe: 'f1', then: [
          ['nar', "Ces murmures ne sont pas des hommes. Ils naissent quand trop de ventres vides regardent ensemble vers les mêmes greniers fermés."],
          ['say', 'aslam', "Ils reviennent chaque nuit. Quelque chose les nourrit."],
          ['say', 'umar', "Nous le trouverons. Montons d'abord : de la colline, on voit toute la harra."]
        ] },
        { text: 'Monter sur la colline et scruter la nuit', goto: 'colline', then: [
          ['nar', "Au-delà des dernières maisons, vers les pierres noires de la harra, un feu tremble, seul dans l'obscurité."],
          ['say', 'aslam', "Des voyageurs, que la nuit et le froid ont arrêtés."],
          ['say', 'umar', "Allons vers eux."],
          ['show', 'voyageur'], ['show', 'enfant1'], ['show', 'enfant2']
        ] },
        { text: 'Rejoindre le feu des voyageurs, près des enclos', goto: 'enclos', then: [
          ['amb', 'feu'],
          ['say', 'umar', "Paix sur vous, gens de la lumière."],
          ['nar', "Une famille de voyageurs. Une marmite sur le feu. Autour, des enfants qui pleurent."],
          ['say', 'umar', "Pourquoi ces enfants pleurent-ils ?"],
          ['say', 'voyageur', "La faim."],
          ['say', 'umar', "Et que contient cette marmite ?"],
          ['say', 'voyageur', "De l'eau. De quoi les faire patienter jusqu'au sommeil. Allah jugera entre nous et 'Umar."],
          ['nar', "D'autres récits disent : de l'eau et des cailloux. Le voyageur ignore à qui il parle."],
          ['say', 'umar', "Qu'Allah te fasse miséricorde… Comment 'Umar saurait-il ce qui vous arrive ?"],
          ['say', 'voyageur', "Il se charge de nos affaires, puis il nous oublie ?"],
          ['nar', "'Umar ne répond rien. Il se détourne, et il court vers la ville."],
          ['sfx', 'wind']
        ] },
        { text: 'Courir aux réserves de farine du souk', goto: 'souk', then: [
          ['nar', "Dâr ad-Daqîq, la Maison de la farine. Le commis de garde se lève d'un bond."],
          ['say', 'hazim', "Commandeur des croyants, à cette heure ! Tout est compté, pesé, gardé. Nul ne veille sur la farine des pauvres comme ton serviteur : repose-toi sur moi."],
          ['say', 'umar', "Je me reposerai quand ils auront mangé. Un sac de farine, et de la graisse."],
          ['nar', "Le commis s'empresse. La réserve sonne plus creux que ne le disent ses comptes ; près de la porte traîne un feuillet que nul n'a rangé."],
          ['say', 'umar', "Charge-le sur mon dos."],
          ['say', 'aslam', "Je le porterai à ta place, Commandeur des croyants."],
          ['choice', "Aslam tend les bras vers le sac. Que répond 'Umar ?", [
            { t: "Porter lui-même le sac, sur son propre dos", ok: true, r: [
              ['quote', "« Porteras-tu mon fardeau à ma place, au Jour de la Résurrection ? »", "Récit d'Aslam — at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya"],
              ['nar', "Aslam charge le sac sur le dos du calife. Ils repartent en hâte dans la nuit."],
              ['pillar', 'justice', 1]
            ] },
            { t: "Laisser Aslam porter : c'est son office", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. Aslam insista ; 'Umar refusa chaque fois. Le fardeau d'un peuple ne se délègue pas."]
            ] },
            { t: "Réveiller les gardes et envoyer un convoi à l'aube", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. Les enfants pleuraient cette nuit-là, non à l'aube. 'Umar n'attendit pas."]
            ] }
          ]],
          ['give', 'pain', 1]
        ] },
        { text: 'Rapporter la farine à la famille', talk: 'voyageur', then: [
          ['nar', "'Umar verse la farine dans la marmite et attise lui-même le feu, penché dans la fumée."],
          ['say', 'umar', "Verse. Je remuerai pour toi."],
          ['nar', "Les enfants mangent. Puis ils rient. Puis ils dorment. 'Umar reste assis à l'écart, jusqu'à les avoir vus rire."],
          ['say', 'voyageur', "Qu'Allah te récompense. Tu serais plus digne de cette charge que le Commandeur des croyants."],
          ['say', 'umar', "Dis du bien. Quand tu iras trouver le Commandeur des croyants, tu me trouveras là-bas, si Allah le veut."],
          ['say', 'umar', "Aslam, la faim les tenait éveillés et les faisait pleurer. Je n'ai pas voulu partir avant d'avoir vu ce que j'ai vu."],
          ['codex', 'ramada'],
          ['nar', "Mais la farine d'une nuit ne brise pas la disette. Sur la place, derrière une porte close, une lampe brûle encore : le grenier d'Abû Ghânim, le plus gros marchand de grain de la ville."],
          ['say', 'aslam', "Tu pourrais le contraindre, Commandeur des croyants. La loi du marché te le permet."],
          ['say', 'umar', "Je le pourrais. J'aurais son grain, et tous les autres cacheraient le leur. Allons d'abord lui parler."]
        ] },
        { text: "Frapper à la porte du grenier, sur la place", talk: 'ghanim', then: [
          ['say', 'ghanim', "Qui frappe à cette heure ?… Commandeur des croyants. Je n'ai rien fait que la loi défende."],
          ['nar', "Un grenier plein au milieu d'une ville qui a faim n'est plus une provision : c'est un mur. Et nul n'habite longtemps derrière un mur que les siens regardent."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'ghanim',
            title: "Le grenier d'Abû Ghânim",
            intro: "Il craint d'être ruiné s'il ouvre le premier, et de passer pour un homme qui a cédé à la peur. Il s'agit d'obtenir son grain sans le lui prendre.",
            goal: 7,
            rounds: [
              { say: "Ce grain est à moi. Je l'ai acheté avant la disette, au prix du jour. Où est ma faute ?",
                opts: [
                  { t: "Nul ne t'ôte ton bien. Mais le prix d'aujourd'hui, c'est la faim des autres qui l'a fait.", el: 'adl', v: 2, r: "Je n'ai pas fait la sécheresse… Mais non, je n'ai pas fait ce prix-là non plus." },
                  { t: "Je reviens de la harra. Des enfants s'y endorment devant une marmite d'eau.", el: 'rahma', v: 1, r: "Si près des murs ? Je ne savais pas qu'on en était là." },
                  { t: "Pas d'accaparement sur notre marché : je peux te fermer le souk dès demain.", el: 'shajaa', v: -1, r: "Tu le peux. Tu auras mon grain, pas mon consentement ; et les autres cacheront le leur plus profond." }
                ] },
              { say: "Si j'ouvre le premier, les autres attendront que je sois vide, puis vendront au double. Je serai ruiné, et eux riches.",
                noir: { name: "La Peur", group: ['noir_peur'], intro: "Ghânim serre ses clés. Il se voit déjà ruiné, montré du doigt, seul à avoir ouvert. Rien de cela n'est arrivé, et il le vit déjà.", after: "Je respire. Bien. Dis-moi ce que tu proposes, exactement." },
                opts: [
                  { t: "Le registre de la Maison de la farine compte quarante sacs sortis sans nom en face. Je ne te demande pas qui te les a vendus : je te demande de les rendre aux tables.", el: 'ilm', v: 3, need: 'registre_farine', r: "Tu sais donc. On m'avait juré que personne ne comptait… Je les rendrai, ceux-là d'abord." },
                  { t: "Tu ne seras ni le premier ni le seul : ma maison a donné ce soir, et j'irai frapper à chaque porte après la tienne.", el: 'adl', v: 2, r: "Si le calife frappe à toutes les portes, nul ne pourra dire qu'il attendait." },
                  { t: "Les caravanes d'Égypte sont en route. Ton grain ne vaudra bientôt plus rien.", el: 'sidq', v: 0, r: "Bientôt ? Dans un mois ? D'ici là, il vaut ce qu'il vaut." }
                ] },
              { say: "Et qui me rendra ce que j'aurai donné ? Mes fils aussi vivent de ce commerce.",
                opts: [
                  { t: "Le Trésor te paiera au prix d'avant la disette, devant témoins. Tu ne perdras que le gain que la faim t'aurait fait.", el: 'adl', v: 2, r: "Le prix d'avant… C'est un prix dur. Mais c'est un prix honnête." },
                  { t: "Assieds-toi demain à la table commune. Tu verras à qui tu donnes ; aucun compte ne te le dira mieux.", el: 'rahma', v: 2, r: "On dit que tu t'y assois le dernier. J'irai." },
                  { t: "Ta récompense est auprès d'Allah ; ne me parle pas de dirhams cette nuit.", el: 'sabr', v: -1, r: "Elle l'est. Mais mes créanciers, eux, sont à Médine." }
                ] },
              { say: "Si j'ouvre… qu'on ne dise pas que j'ai cédé à la peur du calife. Je dois pouvoir regarder mes voisins.",
                opts: [
                  { t: "On dira ce qui est : qu'Abû Ghânim a ouvert le premier, de son plein gré, une nuit où nul ne l'y forçait.", el: 'sidq', v: 2, r: "De mon plein gré. Oui. Cela, je peux le porter." },
                  { t: "Prends la nuit. Je reviendrai à l'aube, seul.", el: 'sabr', v: 1, r: "À l'aube, les enfants auront encore faim… Mais tu reviendras, je le sais." },
                  { t: "Peu importe ce qu'on dira. Seul le grain compte.", el: 'ilm', v: -1, r: "Pour toi, peut-être. Moi, c'est ici que je vis." }
                ] }
            ],
            win: [
              ['say', 'ghanim', "Qu'on ouvre. Et qu'on porte les premiers sacs aux tables avant le jour : je veux que mes voisins me voient les charger."],
              ['nar', "Avant l'aube, trois autres greniers s'ouvrent dans la rue. Personne ne les y a contraints : il a suffi que le premier ne soit pas resté seul."],
              ['flag', 'greniers_ouverts'],
              ['pillar', 'lien', 1],
              ['give', 'pain', 1]
            ],
            lose: [
              ['say', 'ghanim', "Tu parles bien, Commandeur des croyants. Mais je n'ouvrirai pas le premier. Fais ce que la loi te permet."],
              ['nar', "'Umar fera ouvrir, au matin, par la règle du marché. Le grain sortira ; la confiance, non. Dans la rue, d'autres portes se sont refermées en entendant frapper."],
              ['pillar', 'lien', -1]
            ]
          }],
          ['codex', 'accaparement'],
          ['mus', 'nuit'],
          ['nar', "Dans l'envers de Médine, quelque chose a tout entendu — et s'en irrite."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 45 }],
          ['amb', 'noos'],
          ['nar', "La Chaîne te montre l'envers de cette nuit. Ici se dresse ce que mille greniers fermés ont bâti sans le savoir."],
          ['codex', 'ego_accapareur']
        ] },
        { text: "Atteindre le cœur de la noosphère et briser l'Accapareur", goto: 'coeur', then: [
          ['say', "L'Accapareur", "Un sac de farine ? Pour une nuit ? Demain ils auront faim de nouveau, et mes portes seront toujours closes."],
          ['say', 'umar', "Demain, je reviendrai. Et le jour d'après. Jusqu'à ce que tes portes s'ouvrent."],
          ['battle', { group: ['accapareur'], bg: 'ville', boss: true, intro: "La peur de manquer a pris corps.",
                       allies: [{ flag: 'greniers_ouverts', name: "Les greniers ouverts d'Abû Ghânim" }] }],
          ['nar', "L'Accapareur s'effondre en une pluie de grains. Dans toute la noosphère de Médine, des portes de greniers s'entrouvrent."]
        ] }
      ],
      outro: [
        ['map', 'medine', 'place', { time: 'dawn' }],
        ['amb', 'vent'],
        ['nar', "'Umar écrit aux gouverneurs : « Au secours ! Au secours ! » D'Égypte, 'Amr répond : « Je t'envoie une caravane dont la tête sera chez toi quand la queue sera encore chez moi. »"],
        ['nar', "De Shâm, Abû 'Ubayda arrive le premier, avec quatre mille montures chargées de vivres. Mais le ciel reste fermé. Alors 'Umar sort avec les gens, sans apparat, et fait avancer al-'Abbâs, l'oncle du Prophète ﷺ."],
        ['quote', "« Ô Allah, nous Te sollicitions par notre Prophète et Tu nous donnais la pluie ; nous Te sollicitons par l'oncle de notre Prophète : donne-nous la pluie. »", "Invocation de 'Umar — al-Bukhârî, Sahîh (1010), traduction du sens"],
        ['pray'],
        ['codex', 'istisqa'],
        ['mus', 'espoir'],
        ['sfx', 'wind'],
        ['nar', "Et la pluie vient. Les gens rentrent en relevant leurs manteaux ; la terre couleur de cendre boit jusqu'au soir."],
        ['nar', "On rapporte qu'il disait : si la disette avait duré, j'aurais logé chaque famille pauvre chez une famille aisée — car nul ne périt en partageant la moitié de son repas."],
        ['codex', 'bio_umar'],
        ['heal']
      ]
    },

    /* ═══ 2. LES CLÉS DE JÉRUSALEM ═══ */
    {
      id: 'u2', title: 'Les Clés de Jérusalem', sub: "An 16 H · 637 · De Médine à Îliyâ'",
      map: 'desert', opts: { time: 'day' }, start: 'depart',
      party: ['umar', 'aslam'],
      npcs: [
        { id: 'chamelier', name: 'Chamelier', at: ['oasis', 1, -1], look: { kind: 'bedouin', robe: '#7a6648', head: '#d9ccb2' },
          talk: [['say', 'chamelier', "On dit que le calife des Arabes monte vers Shâm. Je guette son cortège depuis l'aube : je n'ai vu passer que deux hommes et une monture."]] },
        { id: 'abu_pnj', name: "Abû 'Ubayda", hero: 'abuubayda', at: 'arrivee',
          talk: [['say', 'abuubayda', "Le patriarche t'attend, Commandeur des croyants."]] },
        { id: 'garde', name: 'Garde de la porte', map: 'romaine', at: ['porte', 1, 0], look: { kind: 'romain', robe: '#7a2e2e', head: '#b9a070' },
          talk: [['say', 'garde', "Nous attendions des trompettes et des étendards. Lequel est le roi ? Celui qui marche à pied ?"]] },
        { id: 'soldat', name: 'Soldat de Shâm', map: 'romaine', at: ['forum', -1, 1], look: { kind: 'soldat', robe: '#6a5a40', head: '#e2d8c2' },
          talk: [['say', 'soldat', "Khâlid ibn al-Walîd, 'Amr ibn al-'Âs, Mu'âwiya : tous sont venus servir de témoins au pacte. Pas une épée n'a été tirée dans la ville."]] },
        { id: 'marchand', name: "Marchand d'Îliyâ'", map: 'romaine', at: ['marche', 0, 1], look: { kind: 'homme', robe: '#4f5f7a', head: '#d8d0c0' },
          talk: [['say', 'marchand', "Ils promettent de laisser nos églises ouvertes et nos biens entre nos mains. Si c'est vrai, ce sera la première armée à tenir pareille promesse ici."]] },
        { id: 'moine', name: 'Moine', map: 'romaine', at: ['fontaine', 1, 0], look: { kind: 'moine', robe: '#3b3530', head: '#3b3530' },
          talk: [['ask', "Un moine remplit sa cruche à la fontaine.", [
            { t: "Qui est Sophrone ?", r: [['say', 'moine', "Notre patriarche. Un vieil homme, un lettré. Il a refusé de livrer la ville à un général : il voulait la parole du calife lui-même."]] },
            { t: "Que craint la ville ?", r: [['say', 'moine', "Ce qu'elle a déjà vu. Il y a vingt-trois ans, l'armée perse l'a prise : églises brûlées, habitants emmenés. Nous attendons de voir ce que valent les serments de ceux-ci."]] }
          ]]] },
        { id: 'sophrone', name: 'Sophrone', map: 'romaine', at: 'basilique', look: { kind: 'moine', robe: '#e8e2d2', head: '#b89a4a' },
          talk: [['say', 'sophrone', "La ville est entre tes mains, et tes serments avec elle."]] },
        { id: 'ancien_tib', name: 'Ancien de Tibériade', map: 'romaine', at: 'quartier', look: { kind: 'ancien', robe: '#4a5a6e', head: '#e6e0d0' },
          talk: [
            ['say', 'ancien_tib', "Je viens de Tibériade. Depuis l'empereur Hadrien, aucun des nôtres n'a le droit d'habiter cette ville ; Héraclius a renouvelé l'interdit voici sept ans. Cinq siècles que nous la regardons depuis ses collines."],
            ['codex', 'bannissement'],
            ['say', 'ancien_tib', "Je ne demande la maison de personne, ni la peine de personne. Je demande que cet édit ne dure pas plus longtemps que l'empire qui l'a écrit."]
          ] },
        { id: 'bilal', name: 'Bilâl', map: 'romaine', at: ['esplanade', 2, 0], hidden: true, look: { kind: 'compagnon', robe: '#e6dfd0', head: '#f2ede2' },
          talk: [['nar', "Bilâl se tient face à la ville, silencieux."]] }
      ],
      foes: [
        { id: 'f_mirage', at: 'crete', group: ['mirage', 'mirage'], bg: 'desert' },
        { id: 'f_dunes', at: 'dunes', group: ['mirage'], bg: 'desert' },
        { id: 'f_faste', map: 'romaine', at: 'palais', group: ['faste', 'faste'], bg: 'romaine' },
        { id: 'f_cardo', map: 'romaine', at: 'cardo', group: ['faste', 'mirage'], bg: 'romaine' }
      ],
      chests: [
        { at: ['oasis', -1, 1], item: 'eau', n: 1 },
        { map: 'romaine', at: ['jardin', 0, 1], item: 'miel', n: 1 },
        { map: 'romaine', at: ['quartier', 1, 1], codex: 'bannissement' },
        { map: 'romaine', at: ['remparts', 1, 0], item: 'siwak', n: 1 }
      ],
      intro: [
        ['amb', 'vent'],
        ['title', 'Les Clés de Jérusalem', "An 16 de l'Hégire"],
        ['nar', "La Chaîne remonte de deux années. Îliyâ' — Jérusalem — est assiégée par l'armée d'Abû 'Ubayda. Le patriarche Sophrone consent à ouvrir les portes, à une condition : ne remettre la ville qu'au calife en personne."],
        ['nar', "'Umar confie Médine à 'Alî et prend la route de Shâm. Ni escorte de parade, ni litière : un compagnon de route, une monture, un sac de dattes et d'orge."]
      ],
      objectives: [
        { text: "Marcher jusqu'à l'oasis", goto: 'oasis', then: [
          ['nar', "On rapporte qu'ils n'avaient qu'une monture et se la partageaient : une étape l'un, une étape l'autre."],
          ['say', 'aslam', "Commandeur des croyants, c'est ton tour de monter."],
          ['say', 'umar', "Non. C'était le mien à l'étape d'avant. Monte : la route est partagée avec justice, ou elle ne l'est pas."],
          ['give', 'eau', 1],
          ['say', 'aslam', "L'air tremble sur la crête… On dirait des arcs de triomphe."],
          ['say', 'umar', "Des mirages. Le désert sait ce que les empires promettent à ceux qui s'en approchent."]
        ] },
        { text: 'Traverser les Mirages de gloire sur la crête', foe: 'f_mirage', then: [
          ['nar', "Les arcs se dissipent. Il ne reste que le sable, et la route."]
        ] },
        { text: "Rejoindre Abû 'Ubayda au gué", talk: 'abu_pnj', then: [
          ['nar', "Un gué boueux. 'Umar descend de sa monture, ôte ses chaussures, les passe sur son épaule et traverse à pied, la bride à la main."],
          ['say', 'abuubayda', "Commandeur des croyants ! Les grands de ce pays vont te voir ainsi. Voici un cheval de parade et un vêtement blanc : je n'aimerais pas qu'ils te découvrent dans cet état."],
          ['choice', "Devant Jérusalem, comment 'Umar se présente-t-il ?", [
            { t: "Tel qu'il est : à pied, dans son vêtement rapiécé", ok: true, r: [
              ['say', 'umar', "Ah ! Si un autre que toi avait dit cela, Abû 'Ubayda…"],
              ['quote', "« Nous étions le peuple le plus humble, et Allah nous a honorés par l'islam. Si nous cherchons l'honneur ailleurs que dans ce par quoi Allah nous a honorés, Allah nous humiliera. »", "al-Hâkim, al-Mustadrak"],
              ['codex', 'honneur']
            ] },
            { t: "Revêtir le vêtement blanc : on juge un peuple à son chef", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. On lui amena un cheval de parade : il en descendit aussitôt et réclama sa propre monture."]
            ] },
            { t: "Entrer de nuit, pour que nul ne voie sa tenue", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. 'Umar n'avait rien à cacher : il entra de jour, à la vue de tous."]
            ] }
          ]],
          ['say', 'abuubayda', "Tu dis vrai. Marchons."],
          ['hide', 'abu_pnj'], ['join', 'abuubayda'], ['codex', 'bio_abuubayda'],
          ['map', 'romaine', 'porte', { time: 'day' }],
          ['amb', 'foule'],
          ['mus', 'rome'],
          ['nar', "Îliyâ'. Les remparts, les colonnes, les coupoles. Une foule muette regarde entrer le maître du nouvel empire : un homme à pied, qui mène sa monture par la bride."],
          ['say', 'abuubayda', "Le patriarche attend devant la basilique. Mais écoute d'abord la ville, si tu veux savoir ce qu'on te demandera : au quartier bas, un ancien venu de Tibériade patiente depuis l'aube."]
        ] },
        { text: 'Rencontrer le patriarche Sophrone devant la basilique', talk: 'sophrone', then: [
          ['say', 'sophrone', "Je suis Sophrone, patriarche de cette ville. Je n'ai voulu remettre ses clés qu'à toi."],
          ['say', 'sophrone', "On m'annonçait un roi. Je vois un homme dont le manteau compte plus de pièces que de fils."],
          ['say', 'umar', "Qu'on écrive. Voici ce que je leur garantis."],
          ['quote', "« Voici la sécurité qu'accorde le serviteur d'Allah, 'Umar, aux gens d'Îliyâ' : sécurité pour leurs personnes, leurs biens, leurs églises et leurs croix. Leurs églises ne seront ni occupées ni détruites. Nul ne sera contraint en sa religion, et nul d'entre eux ne sera lésé. »", "at-Tabarî, Târîkh — traduction du sens, abrégée"],
          ['codex', 'jerusalem'],
          ['sfx', 'door'],
          ['nar', "Sophrone lui fait visiter l'église de la Résurrection. L'heure de la prière arrive."],
          ['say', 'sophrone', "Prie ici, si tu le veux."],
          ['choice', "L'heure de la prière le trouve dans l'église. Que fait 'Umar ?", [
            { t: "Décliner, et sortir prier à l'écart", ok: true, r: [
              ['say', 'umar', "Si je priais ici, les musulmans après moi diraient : « 'Umar a prié là », et ils te la prendraient."],
              ['nar', "On rapporte qu'il sortit prier seul sur les marches, puis écrivit qu'on n'y tînt jamais de prière en assemblée."]
            ] },
            { t: "Prier à l'intérieur : toute la terre est un lieu de prière", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. La chose était permise ; 'Umar regarda plus loin que lui-même, vers ceux qui viendraient après lui."]
            ] },
            { t: "Remettre la prière à plus tard", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. 'Umar ne retarda pas la prière : il déplaça seulement ses pas."]
            ] }
          ]],
          ['pray', 'dhuhr'],
          ['say', 'sophrone', "Tu protèges mon église contre les tiens. Quel empire fait cela ?"],
          ['say', 'umar', "Ce n'est pas un empire."],
          ['nar', "On ne tient pas une ville par ses remparts. On la tient par ce que chacun peut encore y appeler sien : son seuil, sa prière, la tombe de ses morts."],
          ['tp', 'ancien_tib', ['basilique', -2, 1]],
          ['say', 'sophrone', "Alors entends encore ceci. Mon peuple demande ce que Rome lui garantissait : que les juifs n'habitent pas Îliyâ' avec nous. Je ne le demande pas par haine. Ma ville sort d'un sac et d'un siège ; j'ai peur de ce qu'un retour y réveillerait."],
          ['say', 'ancien_tib', "Commandeur des croyants, voilà cinq siècles que nous pleurons cette ville de loin. Nous ne voulons ni la maison d'autrui ni une revanche : seulement habiter près de nos pierres, et y prier."],
          ['say', 'abuubayda', "Chacun des deux dit vrai, depuis sa peine. Tu peux trancher seul. Tu peux aussi tenter qu'ils s'entendent."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'sophrone',
            title: 'La clause et les familles de Tibériade',
            intro: "Sophrone craint pour la paix d'une ville encore meurtrie ; l'ancien demande la fin d'un bannissement de cinq siècles. Il s'agit que le patriarche y consente de lui-même.",
            goal: 7,
            rounds: [
              { say: "Les plaies de ma ville sont ouvertes. Si tu y fais rentrer ceux que Rome en tenait éloignés, je ne réponds plus de la paix de ses rues.",
                opts: [
                  { t: "Je ne te demande pas d'oublier ce que ta ville a souffert. Je te demande si la peine des uns doit rester la loi des autres.", el: 'rahma', v: 2, r: "Tu poses la question comme un pasteur. Je l'entends." },
                  { t: "Le pacte que tu viens de recevoir garantit tes églises. Il ne te fait pas gardien des portes.", el: 'adl', v: 1, r: "C'est vrai. Mais un gardien inquiet garde mal ce qu'on lui laisse." },
                  { t: "La ville s'est rendue. Ce n'est plus à son patriarche d'en choisir les habitants.", el: 'shajaa', v: -1, r: "Alors pourquoi m'avoir fait signer ? Un pacte que l'on dicte n'est qu'un ordre." }
                ] },
              { say: "Ce bannissement n'est pas de moi. Il a l'âge des siècles ; mes pères l'ont trouvé en naissant.",
                opts: [
                  { t: "Il a un auteur et une date : Hadrien, au sortir d'une guerre ; puis Héraclius, il y a sept ans. Ce qu'un César a décrété n'est pas l'Évangile.", el: 'ilm', v: 3, need: 'bannissement', r: "Tu connais nos édits mieux que nos gouverneurs. Oui : c'était la loi de César, non celle de l'autel." },
                  { t: "Ce que les pères ont trouvé en naissant, les fils peuvent le laisser derrière eux. Tu es vieux, patriarche : laisse autre chose.", el: 'sidq', v: 2, r: "Tu frappes juste, et sans cruauté." },
                  { t: "Les siècles ne font pas le droit.", el: 'sabr', v: 0, r: "Ils font l'habitude. Et c'est d'habitude que vivent les villes." }
                ] },
              { say: "Combien ? L'ancien parle de deux cents familles. Ma ville n'a pas deux cents maisons vides.",
                opts: [
                  { t: "Alors pas deux cents. Un nombre que la ville peut porter : soixante-dix, et pas une maison prise à qui l'habite.", el: 'adl', v: 2, r: "Soixante-dix… Au sud de l'esplanade, près des eaux de Siloé, il y a des ruines que nul ne réclame." },
                  { t: "Demande-le-lui toi-même. Il est là, et tu ne lui as encore jamais parlé.", el: 'rahma', v: 1, r: "Je n'ai jamais parlé à l'un des leurs autrement que par édit. Soit." },
                  { t: "Deux cents, puisqu'ils le demandent.", el: 'shajaa', v: -1, r: "Tu donnes ce qui n'est pas vide. Ce sont mes fidèles qui paieront ta largesse." }
                ] },
              { say: "Et si, l'an prochain, une rixe éclate près de l'esplanade ? À qui demandera-t-on des comptes ?",
                opts: [
                  { t: "À moi. Les uns et les autres sont sous mon pacte : qui lèse l'un d'eux trouvera le même juge.", el: 'adl', v: 2, r: "Le même juge pour tous. Rome ne nous l'a jamais promis." },
                  { t: "Qu'une veille commune garde les abords : des tiens, des leurs, des miens. On surveille mieux ce qu'on garde ensemble.", el: 'sidq', v: 2, r: "Une veille commune… Voilà une chose que je n'aurais pas osé demander." },
                  { t: "Les rixes sont l'affaire du gouverneur, non la tienne.", el: 'ilm', v: 0, r: "Elles seront l'affaire de mes fidèles bien avant d'être la sienne." }
                ] }
            ],
            win: [
              ['nar', "Sophrone se tourne vers l'ancien de Tibériade. Pour la première fois, les deux vieillards se parlent sans édit entre eux."],
              ['say', 'sophrone', "Soixante-dix familles, au sud de l'esplanade. Et une veille commune aux abords. Qu'on l'écrive à part du pacte, de ma main et de la tienne."],
              ['say', 'ancien_tib', "Nous n'en espérions pas tant de sa bouche. Qu'il en soit remercié, et toi avec lui."],
              ['flag', 'veille_commune'],
              ['pillar', 'lien', 1]
            ],
            lose: [
              ['say', 'sophrone', "Je ne peux pas y mettre ma main. Ce que tu décideras, tu le décideras sans moi."],
              ['nar', "On rapporte que 'Umar fixa lui-même le nombre : soixante-dix familles, au sud de l'esplanade. La chose se fit ; mais sans le consentement du patriarche, et la ville le sut."],
              ['pillar', 'lien', -1]
            ]
          }],
          ['codex', 'bannissement'],
          ['codex', 'familles_tiberiade'],
          ['mus', 'rome'],
          ['say', 'umar', "Conduis-moi à l'esplanade."],
          ['say', 'sophrone', "Le palais du gouverneur barre le chemin. Depuis ce matin, quelque chose y rôde : la pompe des Césars, qui cherche un nouveau maître."]
        ] },
        { text: 'Dissiper le Faste devant le palais du gouverneur', foe: 'f_faste', then: [
          ['nar', "Les couronnes de pourpre tombent en poussière. Mais leur maître attend plus haut, là où convergent tous les regards de la ville."]
        ] },
        { text: "Monter à l'esplanade", goto: 'esplanade', then: [
          ['amb', 'silence'],
          ['nar', "L'esplanade. Des siècles d'abandon l'ont couverte de décombres. Au-dessus, dans l'envers du lieu, une enseigne d'airain déploie ses ailes."],
          ['say', "L'Aigle d'Airain", "Enfin, un vainqueur. Rome m'a porté, et d'autres avant elle. Entre en César, fils d'al-Khattâb : la ville n'attend que cela pour t'aimer."],
          ['say', 'umar', "Elle attend la justice. Toi, tu n'es que l'habitude qu'ont les hommes de se courber."],
          ['codex', 'ego_aigle'],
          ['battle', { group: ['aigle'], bg: 'romaine', boss: true, intro: "L'orgueil des empires cherche un front où se poser.",
                       allies: [{ flag: 'veille_commune', name: "La veille commune d'Îliyâ'" }] }],
          ['nar', "L'Aigle se brise. Ses plumes d'airain retombent : ce n'étaient que de vieilles pièces de monnaie."],
          ['nar', "Alors 'Umar étend son manteau, y ramasse les décombres de l'esplanade et les emporte lui-même. Les musulmans l'imitent, jusqu'à ce que le sol soit net."],
          ['show', 'bilal'],
          ['mus', 'silence'],
          ['nar', "On rapporte que, lors de ce voyage, on pria 'Umar de demander l'appel à Bilâl — qui ne l'avait plus lancé depuis la mort du Messager d'Allah ﷺ."],
          ['nar', "Bilâl se lève. À sa voix, ceux qui avaient connu le temps du Prophète ﷺ pleurent comme ils n'avaient jamais pleuré. Et 'Umar plus que tous."],
          ['codex', 'bilal'],
          ['pray', 'asr'],
          ['mus', 'espoir']
        ] }
      ],
      outro: [
        ['nar', "Jérusalem a changé de mains sans effusion de sang. Ni triomphe, ni cortège : un pacte, une prière, une esplanade balayée."],
        ['nar', "Deux ans plus tard, la peste d'Emmaüs ravagera Shâm. 'Umar voudra rappeler Abû 'Ubayda à Médine ; celui-ci refusera de quitter son armée, et mourra parmi les siens."],
        ['heal']
      ]
    },

    /* ═══ 3. LE TRÔNE ET LA NATTE ═══ */
    {
      id: 'u3', title: 'Le Trône et la Natte', sub: 'An 17–23 H · 638–644 · Médine',
      map: 'medine', opts: { time: 'day' }, start: 'mosquee_cour',
      party: ['umar', 'aslam', 'abdarrahman'],
      npcs: [
        { id: 'hurmuzan', name: 'Al-Hurmuzân', at: ['mosquee_cour', 1, 0], look: { kind: 'perse', robe: '#7a2f5a', head: '#d4af37', cloak: '#3a1f4a' },
          talk: [['say', 'hurmuzan', "J'ai vu les palais de Ctésiphon. Je n'y ai jamais vu un roi dormir sans garde."]] },
        { id: 'anas', name: 'Anas ibn Mâlik', at: ['mosquee_cour', 2, 1], look: { kind: 'compagnon', robe: '#d9d2c0', head: '#f0eadc' },
          talk: [['say', 'anas', "Nous l'avons escorté depuis Tustar, al-Ahnaf ibn Qays et moi."]] },
        { id: 'convoyeur', name: "Convoyeur d'al-Madâ'in", at: ['place', -1, 0], look: { kind: 'soldat', robe: '#5f5040', head: '#ddd3be' },
          talk: [['say', 'convoyeur', "Pas un anneau ne manque. Nous avons compté à chaque étape, et nul n'y a porté la main."]] },
        { id: 'suraqa', name: 'Surâqa ibn Mâlik', at: ['place', 1, 1], look: { kind: 'compagnon', robe: '#8c7a5c', head: '#e6dcc6' },
          talk: [['say', 'suraqa', "Je ne suis qu'un bédouin des Banû Mudlij. On m'a dit de venir sur la place ; j'ignore pourquoi."]] },
        { id: 'scribe', name: 'Scribe du dîwân', at: ['halle', 1, 0], look: { kind: 'homme', robe: '#5a6470', head: '#e4dccb' },
          talk: [['ask', "Le scribe lève son calame.", [
            { t: "Qu'est-ce que le dîwân ?", r: [['say', 'scribe', "Le registre des pensions. On voulait y inscrire 'Umar en tête ; il a dit : « Placez 'Umar là où Allah l'a placé », et il a fait commencer par les proches du Prophète ﷺ."]] },
            { t: "De quand date-t-on les lettres ?", r: [['say', 'scribe', "De l'Hégire, depuis que 'Umar a consulté les Compagnons. Ni d'une naissance, ni d'une mort : du jour où l'on a quitté sa ville pour sa foi."], ['codex', 'hijri']] }
          ]]] },
        { id: 'hazim', name: 'Hâzim, commis du Trésor', at: ['halle', -1, 0], look: { kind: 'homme', robe: '#5e6a58', head: '#e8dfc8', cloak: '#3a4236' },
          talk: [['say', 'hazim', "Depuis la Maison de la farine, on m'a confié les comptes du Trésor. C'est que le Commandeur des croyants sait reconnaître ceux qui l'aiment."]] },
        { id: 'savant', name: 'Maître du cercle', at: 'ecole', look: { kind: 'savant', robe: '#e2dccb', head: '#f3eee0' },
          talk: [['if', 'su_hijri',
            [['say', 'savant', "Compte tes années depuis l'Hégire, et tu sauras toujours d'où tu es parti."]],
            [
              ['say', 'savant', "Assieds-toi dans le cercle. Nous comptions hier : de quand dater une lettre ? Abû Mûsâ s'en plaignait depuis Bassora, dit-on : il lui venait du calife des écrits sans date."],
              ['say', 'savant', "On proposa la naissance du Prophète ﷺ, puis sa mort. On retint l'Hégire. Un peuple qui date ses jours d'un départ n'oublie pas qu'il est en chemin."],
              ['flag', 'su_hijri'], ['codex', 'hijri'], ['pillar', 'savoir', 1]
            ]]] },
        { id: 'veteran', name: 'Vétéran de Shâm', at: ['mosquee_porte', 3, 0], look: { kind: 'soldat', robe: '#6a5a40', head: '#e2d8c2' },
          talk: [
            ['say', 'veteran', "Les Banû Ghassân ? Je les ai eus en face au Yarmoûk. Ils gardaient la marche du désert pour César, contre une solde. On raconte qu'un jour son trésorier l'a refusée aux Arabes de la frontière, avec une injure. Ces choses-là ne s'oublient pas."],
            ['codex', 'ghassan']
          ] },
        { id: 'jabala', name: 'Jabala ibn al-Ayham', at: ['mosquee_porte', -1, 0], look: { kind: 'homme', robe: '#5a2f6a', head: '#d4af37', cloak: '#7a1f2a' },
          talk: [['say', 'jabala', "J'ai régné sur les Arabes de Shâm. Je suis venu à vous de moi-même, et nul ne m'y a contraint."]] },
        { id: 'fazari', name: 'Homme des Fazâra', at: ['mosquee_porte', 1, 0], look: { kind: 'bedouin', robe: '#7a6a52', head: '#cfc3ab', trim: '#5f8a4a' },
          talk: [['say', 'fazari', "Je ne demande que mon droit."]] },
        { id: 'thawr', name: 'Thawr ibn Mâlik', at: ['mosquee_porte', -2, 1], look: { kind: 'soldat', robe: '#3f4f6a', head: '#cfc6b2', cloak: '#2a2f44' },
          talk: [['say', 'thawr', "Mes cavaliers gardent la marche de Shâm, comme ceux de mon père. Je suis mon roi. Mais j'écoute."]] },
        { id: 'plaignant', name: "Voyageur d'Égypte", at: ['puits', 1, 0], look: { kind: 'homme', robe: '#4a6a5a', head: '#d8cdb8' },
          talk: [['say', 'plaignant', "Le fils du gouverneur d'Égypte m'avait frappé. Je suis venu me plaindre ici : 'Umar m'a tendu le fouet, devant le père. Il lui a dit : depuis quand asservissez-vous des gens nés libres ?"]] }
      ],
      foes: [
        { id: 'f_reflets', at: 'souk', group: ['reflet', 'reflet'], bg: 'ville' },
        { id: 'f_couronne', map: 'palais', at: 'nef', group: ['couronne', 'reflet'], bg: 'palais' },
        { id: 'f_jardin', map: 'palais', at: 'jardin', group: ['reflet', 'reflet', 'reflet'], bg: 'palais' }
      ],
      chests: [
        { at: ['palmeraie', 0, 1], item: 'pain', n: 1 },
        { map: 'palais', at: ['tresor', 0, 0], item: 'lait', n: 1 },
        { map: 'palais', at: ['colonnade', 1, 0], item: 'musc', n: 1 }
      ],
      intro: [
        ['amb', 'silence'],
        ['title', 'Le Trône et la Natte', 'Les années perses'],
        ['nar', "Al-Qâdisiyya. Al-Madâ'in. Nihâwand. En quelques années, l'empire des Chosroès s'effondre, et ses dépouilles prennent la route d'une ville de terre et de palmes."],
        ['nar', "On amène à Médine al-Hurmuzân, prince perse capturé à Tustar, en habits de brocart, couronne en tête. Il cherche le palais du roi des Arabes. On le conduit à la mosquée."],
        ['nar', "Un homme y dort, à même le sol, son manteau roulé sous la tête, sa férule à la main."],
        ['say', 'hurmuzan', "Où sont ses gardes ? Où sont ses chambellans ?"],
        ['say', 'anas', "Il n'a ni garde, ni chambellan, ni scribe, ni conseil privé."],
        ['say', 'hurmuzan', "Alors ce doit être un prophète."],
        ['say', 'anas', "Non. Mais il agit comme agissent les prophètes."],
        ['quote', "« Tu as gouverné avec justice ; alors tu as été en sécurité ; alors tu as dormi. »", "On rapporte — parole attribuée à l'envoyé d'un roi devant 'Umar endormi"],
        ['codex', 'hurmuzan']
      ],
      objectives: [
        { text: 'Entendre al-Hurmuzân', talk: 'hurmuzan', then: [
          ['nar', "'Umar s'éveille au bruit. On ôte au prince sa parure, on le vêt d'un habit simple. L'interrogatoire commence."],
          ['say', 'umar', "Parle. Qu'as-tu à dire, toi qui as rompu la trêve plus d'une fois ?"],
          ['say', 'hurmuzan', "Je crains que tu ne me tues avant que j'aie parlé. J'ai soif."],
          ['nar', "On lui apporte de l'eau dans une coupe grossière. Sa main tremble."],
          ['say', 'hurmuzan', "Je crains d'être tué pendant que je bois."],
          ['say', 'umar', "Il ne te sera fait aucun mal tant que tu ne l'auras pas bue."],
          ['nar', "Al-Hurmuzân renverse la coupe sur le sol."],
          ['say', 'hurmuzan', "Je ne voulais pas d'eau. Je voulais une sécurité. Tu viens de me l'accorder."],
          ['say', 'anas', "Il dit vrai, Commandeur des croyants. Tu lui as dit : « aucun mal tant que tu ne l'auras pas bue »."],
          ['choice', "Le prince a rusé pour obtenir la vie sauve. Que fait 'Umar ?", [
            { t: "Tenir la parole donnée, même arrachée par ruse", ok: true, r: [
              ['say', 'umar', "Tu m'as trompé. Mais la sécurité prononcée est acquise."],
              ['nar', "Al-Hurmuzân embrassa alors l'islam. 'Umar l'établit à Médine et lui assigna une pension de deux mille."]
            ] },
            { t: "Annuler : une ruse ne lie personne", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. Anas et d'autres témoignèrent que la sécurité avait été prononcée ; 'Umar s'y tint."]
            ] },
            { t: "Le châtier pour ses trahisons passées", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. La justice de 'Umar le liait lui-même le premier : sa parole pesa plus que sa colère."]
            ] }
          ]],
          ['say', 'aslam', "Commandeur des croyants, un homme des Fazâra attend devant la mosquée, le visage en sang. Il se plaint d'un roi."],
          ['say', 'abdarrahman', "Jabala, le prince des Ghassân. Un vétéran de Shâm, près de la porte, connaît ces gens mieux que nous : écoute-le si tu veux savoir ce qui les tient."]
        ] },
        { text: 'Entendre la plainte portée devant la mosquée', talk: 'fazari', then: [
          ['nar', "On rapporte que la chose advint pendant le pèlerinage : dans la presse, un homme des Fazâra marcha sur le pan du manteau de Jabala, et le roi le frappa au visage."],
          ['say', 'fazari', "Commandeur des croyants, cet homme m'a brisé le nez. J'avais foulé son vêtement sans le vouloir."],
          ['say', 'umar', "Jabala. Est-ce vrai ?"],
          ['say', 'jabala', "C'est vrai. Il a marché sur mon manteau devant tous. N'était le respect dû à ce lieu, il lui en aurait coûté davantage."],
          ['say', 'umar', "Tu as avoué. Obtiens son pardon ; sinon, il te rendra le coup."],
          ['say', 'jabala', "Comment ? Je suis un roi, et lui un homme du commun."],
          ['choice', "Un roi allié, dont dépend toute une frontière, refuse d'être l'égal d'un bédouin. Que tranche 'Umar ?", [
            { t: "Le même droit pour les deux : le pardon du bédouin, ou la pareille", ok: true, r: [
              ['quote', "« L'islam vous a réunis, toi et lui. Tu ne l'emportes sur lui en rien, sinon par la piété. »", "On rapporte — récit de Jabala : Ibn Kathîr, al-Bidâya ; al-Isfahânî, al-Aghânî (chaîne discutée), traduction du sens"],
              ['pillar', 'justice', 1]
            ] },
            { t: "Presser le bédouin de pardonner, au nom de l'alliance", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. Le pardon appartenait au bédouin seul ; 'Umar ne le lui arracha pas pour ménager un trône."]
            ] },
            { t: "Remettre l'affaire au jour où les frontières seront sûres", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. Le droit d'un homme n'attendit pas la commodité d'une alliance."]
            ] }
          ]],
          ['say', 'jabala', "Je croyais être plus honoré dans l'islam que je ne l'étais avant lui."],
          ['say', 'umar', "Laisse cela. Contente cet homme."],
          ['say', 'jabala', "Donne-moi jusqu'à demain."],
          ['nar', "'Umar accorde la nuit. Le prince croyait perdre un rang ; il ne perdait que le droit de frapper. Mais c'est de ce droit-là qu'il avait fait sa demeure."],
          ['nar', "Dans l'ombre du roi, un chef de clan n'a pas quitté 'Umar des yeux : Thawr ibn Mâlik, dont les cavaliers gardent la marche de Shâm. S'il part avec son roi, une frontière part avec lui."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'thawr',
            title: 'Le serment de Thawr',
            intro: "Thawr doit tout à son roi. Mais ses hommes ont leurs pâturages de ce côté-ci de la frontière, et il vient de voir un bédouin obtenir justice d'un prince.",
            goal: 7,
            rounds: [
              { say: "Mon roi est abaissé devant un gardien de chameaux. Demain, ce sera mon tour. Pourquoi resterais-je ?",
                opts: [
                  { t: "Demain, si un prince frappe l'un de tes cavaliers, c'est ce même droit qui le relèvera. Tu viens de voir ce qu'il vaut.", el: 'adl', v: 2, r: "Mes cavaliers… Chez César, leur nez ne valait pas un procès." },
                  { t: "Ton roi n'est pas abaissé. Il est égal ; c'est autre chose, et c'est plus dur.", el: 'sidq', v: 1, r: "Plus dur, je te l'accorde." },
                  { t: "Pars si tu le veux. Shâm se gardera sans toi.", el: 'shajaa', v: -1, r: "Alors tu n'as rien à me dire, et moi rien à entendre." }
                ] },
              { say: "J'ai prêté serment à Jabala, et mon père au sien. Un homme qui rompt son serment, que vaut ensuite sa parole pour toi ?",
                opts: [
                  { t: "Je sais ce qui liait les tiens à César : une solde, que son trésorier vous a refusée avec une injure. Ce que je te propose ne s'achète pas : cela t'oblige, et cela m'oblige.", el: 'ilm', v: 3, need: 'ghassan', r: "Tu sais cela ? Il nous a traités de chiens. Aucun de mes hommes ne l'a oublié." },
                  { t: "Je ne te demande pas de rompre un serment. Ton roi partira de lui-même. Je te demande ce que tu dois à ceux qui restent.", el: 'sidq', v: 2, r: "À ceux qui restent… Mes hommes ont des troupeaux de ce côté, et des morts dans cette terre." },
                  { t: "Les serments passent avec ceux qui les ont reçus.", el: 'sabr', v: 0, r: "Pas chez nous." }
                ] },
              { say: "Et ma foi ? Mes pères étaient chrétiens ; plus d'un de mes cavaliers l'est resté. Ton droit égal vaut-il pour eux ?",
                opts: [
                  { t: "Le pacte les couvre : leurs personnes, leurs biens, leurs églises. Qui lèse l'un d'eux me trouvera devant lui.", el: 'adl', v: 2, r: "J'ai entendu ce qu'on dit d'Îliyâ'. Si tu tiens ici ce que tu as écrit là-bas…" },
                  { t: "Je ne compte pas tes cavaliers par leur prière. Je les compte par leur parole ; et la tienne n'a pas tremblé.", el: 'rahma', v: 2, r: "Voilà longtemps qu'on ne m'avait pas compté ainsi." },
                  { t: "Ils feront ce que font les vaincus : ils s'accommoderont.", el: 'ilm', v: -1, r: "Nous ne sommes pas des vaincus. Nous sommes des hommes qui choisissent." }
                ] },
              { say: "Si je reste, que dirai-je à mes hommes quand ils demanderont ce que j'y ai gagné ?",
                opts: [
                  { t: "Rien que tu puisses compter. Dis-leur ce que tu as vu ce soir : un roi et un bédouin devant le même juge.", el: 'sidq', v: 2, r: "Ils l'ont vu aussi. C'est peut-être assez." },
                  { t: "La part de tout combattant, ni plus ni moins, inscrite au registre à ton nom.", el: 'adl', v: 1, r: "Ni plus ni moins… Tu ne sais pas acheter les gens, fils d'al-Khattâb." },
                  { t: "Que ceux qui partent n'y gagneront rien non plus.", el: 'shajaa', v: -1, r: "Ils auront gardé leur roi. C'est quelque chose." }
                ] }
            ],
            win: [
              ['say', 'thawr', "Je reste. Non contre mon roi : jamais je ne lèverai la main sur lui. Mais mes cavaliers garderont la marche, et ton juge les trouvera devant lui s'ils fautent."],
              ['flag', 'allie_thawr'],
              ['pillar', 'lien', 1]
            ],
            lose: [
              ['say', 'thawr', "Tu es juste, 'Umar. Mais on ne quitte pas son roi la nuit où il tombe. Adieu."],
              ['nar', "Les cavaliers de Thawr sellent avant l'aube. Une marche de Shâm restera sans garde ; il faudra y envoyer des hommes que l'on n'a pas."],
              ['pillar', 'lien', -1]
            ]
          }],
          ['mus', 'medine'],
          ['nar', "On rapporte qu'à la faveur de la nuit Jabala quitta la ville avec les siens et gagna Constantinople. Il ne revint pas. La tradition lui prête, plus tard, des vers de regret."],
          ['nar', "L'alliance d'un roi est perdue. 'Umar le savait en parlant. Il a parlé."],
          ['codex', 'ghassan'], ['codex', 'jabala'],
          ['say', 'abdarrahman', "Commandeur des croyants, le convoi d'al-Madâ'in vient d'atteindre la place. Les trésors de Kisrâ."],
          ['codex', 'bio_abdarrahman']
        ] },
        { text: "Recevoir le convoi d'al-Madâ'in sur la place", goto: 'place', then: [
          ['amb', 'foule'],
          ['nar', "On déroule les nattes. L'épée de Kisrâ, sa ceinture, ses bracelets, sa couronne — si lourde qu'une chaîne d'or la tenait suspendue au-dessus du trône."],
          ['say', 'umar', "Des hommes qui ont remis cela sans rien en distraire sont des hommes sûrs."],
          ['quote', "« Tu t'es abstenu, alors tes sujets se sont abstenus. Si tu t'étais servi, ils se seraient servis. »", "Parole de 'Alî à 'Umar — at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya"],
          ['nar', "'Umar regarde l'or. Et il pleure."],
          ['say', 'abdarrahman', "Pourquoi pleurer, Commandeur des croyants ? C'est un jour de gratitude."],
          ['say', 'umar', "Ce n'est pas cela qui me fait pleurer. Jamais ceci n'a été donné à un peuple sans que naissent entre eux l'envie et la haine."],
          ['choice', "Les bracelets de Kisrâ brillent sur la natte. Qu'en fait 'Umar ?", [
            { t: "En parer Surâqa le bédouin, puis tout répartir entre les gens", ok: true, r: [
              ['say', 'umar', "Surâqa ibn Mâlik ! Approche, et tends les bras."],
              ['nar', "Des années plus tôt, sur la route de l'Hégire, on rapporte que le Messager d'Allah ﷺ avait promis à ce bédouin les bracelets de Kisrâ. La promesse s'accomplit sur la place de Médine."],
              ['quote', "« Louange à Allah, qui les a ôtés à Kisrâ fils de Hurmuz et en a paré Surâqa fils de Mâlik, un bédouin des Banû Mudlij. »", "al-Bayhaqî, Dalâ'il an-Nubuwwa ; Ibn 'Abd al-Barr, al-Istî'âb"],
              ['codex', 'suraqa']
            ] },
            { t: "Les sceller dans le trésor, en réserve pour les mauvais jours", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. 'Umar ne thésaurisait pas : ce qui arrivait à Médine était réparti entre les gens."]
            ] },
            { t: "Les porter lui-même un instant, en signe de victoire", r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. L'homme au manteau rapiécé ne ceignit jamais la parure des rois."]
            ] }
          ]],
          ['sfx', 'glitch'],
          ['nar', "Mais l'or ne se laisse pas répartir sans murmurer. Au souk, des Reflets rôdent déjà entre les étals."]
        ] },
        { text: "Disperser les Reflets d'or au souk", foe: 'f_reflets', then: [
          ['say', 'aslam', "Ils se reforment. Leur source n'est pas ici."],
          ['say', 'umar', "Non. Allons sous la halle : c'est là qu'on tient le registre de ce qui revient à chacun."]
        ] },
        { text: "Gagner la halle où l'on tient le dîwân", goto: 'halle', then: [
          ['nar', "Le dîwân : le registre où 'Umar a fait inscrire, nom par nom, la part de chacun — les proches du Prophète ﷺ en tête, et les siens à leur rang."],
          ['codex', 'diwan'], ['pillar', 'savoir', 1],
          ['say', 'hazim', "Commandeur des croyants ! Tout est inscrit, tout est pesé. Si chacun servait comme toi, on se passerait de registres. Permets que j'écrive ton nom en tête : ce ne serait que justice."],
          ['say', 'umar', "Écris 'Umar là où Allah l'a placé."],
          ['nar', "L'homme s'incline très bas. 'Abd ar-Rahmân, lui, regarde ses mains : elles tiennent le registre comme on tient une porte fermée."],
          ['ask', "Le commis du Trésor loue beaucoup. Que faire vérifier ?", [
            { t: "Poser le feuillet de l'Année des cendres en face du dîwân", need: 'registre_farine', r: [
              ['nar', "Les mêmes ratures, la même main. Quarante sacs sortis sans nom l'année de la faim ; et ici, des parts inscrites deux fois, sous des noms que nul ne connaît."],
              ['say', 'hazim', "Commandeur des croyants… c'était peu de chose… d'autres en faisaient autant…"],
              ['say', 'umar', "D'où tiens-tu cela ?"],
              ['nar', "Il rend ce qu'il a pris, devant témoins, et quitte sa charge. 'Umar n'ajoute rien : le registre a parlé pour lui."],
              ['flag', 'hazim_demasque'], ['pillar', 'justice', 1]
            ] },
            { t: "Faire recompter le convoi d'al-Madâ'in", r: [
              ['nar', "Pas un anneau ne manque : le commis n'a pas touché à ce que tous regardaient. Faute de preuve, 'Umar ne condamne pas. Il fait seulement tenir les comptes en double."]
            ] },
            { t: "Lui demander raison de ses éloges", r: [
              ['say', 'hazim', "Je dis seulement ce que chacun pense, Commandeur des croyants."],
              ['nar', "Une louange n'est pas une faute. Faute de preuve, 'Umar ne condamne pas. Il fait seulement tenir les comptes en double."]
            ] }
          ]],
          ['codex', 'hazim_fiction'],
          ['say', 'abdarrahman', "L'or de Kisrâ est partagé. Mais regarde l'envers des choses : son trône, lui, ne se partage pas. Il attend."],
          ['sfx', 'glitch'],
          ['map', 'palais', 'entree', { time: 'night' }],
          ['amb', 'noos'],
          ['nar', "Le Palais blanc d'al-Madâ'in, tel que la noosphère s'en souvient. Tout y est encore debout : les tapis, les colonnes — et, au fond, une place vide qui appelle."],
          ['codex', 'ego_trone']
        ] },
        { text: 'Faire tomber la Couronne suspendue dans la nef', foe: 'f_couronne', then: [
          ['sfx', 'break'],
          ['nar', "La chaîne d'or casse. La couronne roule sur les dalles et s'y défait en reflets."]
        ] },
        { text: "Marcher jusqu'au trône", goto: 'trone', then: [
          ['amb', 'silence'],
          ['say', 'Le Trône vide', "Te voilà. J'ai porté Kisrâ, et ses pères avant lui. Les hommes passent ; la place reste. Assieds-toi."],
          ['say', 'umar', "J'ai une natte dans une mosquée. Elle me suffit."],
          ['say', 'Le Trône vide', "Tous disent cela. Puis vient l'or, et la peur de le perdre, et les gardes pour le garder. Tu as pleuré tout à l'heure : tu me connais déjà."],
          ['say', 'umar', "Je te connais. C'est pourquoi tu resteras vide."],
          ['battle', { group: ['trone'], bg: 'palais', boss: true, intro: "La tyrannie n'est pas un roi : c'est une place qui attend.",
                       allies: [{ flag: 'allie_thawr', name: 'Les cavaliers de Thawr' }] }],
          ['flash', '#ffffff'],
          ['sfx', 'break'],
          ['nar', "Le Trône se fend. Il n'y avait rien dessous : ni socle, ni fondation. Seulement le regard de tous ceux qui s'étaient inclinés."]
        ] }
      ],
      outro: [
        ['map', 'medine', 'mosquee_cour', { time: 'dawn' }],
        ['amb', 'silence'],
        ['mus', 'silence'],
        ['nar', "Médine, avant l'aube. La natte est à sa place. 'Umar aussi."],
        ['quote', "« Ô Allah, accorde-moi le martyre dans Ton sentier, et fais que ma mort ait lieu dans la ville de Ton Messager. »", "Invocation de 'Umar — al-Bukhârî, Sahîh (1890)"],
        ['title', "L'aube de Dhû l-Hijja", 'An 23 H · 644 · Médine'],
        ['nar', "Il aligne les rangs pour la prière de l'aube, comme chaque jour. Un esclave perse, Abû Lu'lu'a, s'est glissé derrière lui. La prière commence. La lame frappe."],
        ['flash', '#ffffff'],
        ['nar', "Blessé, 'Umar saisit la main de 'Abd ar-Rahmân ibn 'Awf et l'avance à sa place : la prière des gens ne doit pas se rompre."],
        ['pray', 'fajr'],
        ['heal']
      ]
    }
  ]
});
