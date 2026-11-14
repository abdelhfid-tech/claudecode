/* ISNAD — Saga III : Khâlid ibn al-Walîd, « Le Sabre dégainé ».
   Thèse : le plus grand courage n'est pas de dégainer, mais de rengainer.
   Sources principales : at-Tabarî (Târîkh), al-Balâdhurî (Futûh al-Buldân), al-Bukhârî, Ibn Sa'd, Ibn Kathîr. */
ISNAD.registerSaga({
  id: 'khalid', order: 3,
  name: 'Khâlid ibn al-Walîd', epithet: 'Le Sabre dégainé', arabic: 'خالد',
  years: '13–21 H · 634–642',
  light: 'shajaa', lightName: 'Courage',
  ambiance: 'désert · romaine',
  tagline: "Il n'a jamais perdu une bataille. Il lui reste à vaincre sa propre statue.",

  intro: [
    ['title', 'Khâlid ibn al-Walîd', 'Le Sabre dégainé'],
    ['amb', 'vent'],
    ['nar', "An 13 de l'Hégire. L'Arabie est de nouveau une. Au nord, deux empires se regardent depuis des siècles par-dessus le désert : Rome et la Perse. Entre eux marche un homme que nul n'a encore vu vaincu."],
    ['nar', "Khâlid, fils d'al-Walîd, des Banû Makhzûm. À Uhud, il chargeait contre les musulmans. Depuis l'an 8, il charge avec eux. Le Messager d'Allah ﷺ l'a nommé « un sabre d'entre les sabres d'Allah »."],
    ['quote', "Neuf sabres se sont brisés dans ma main le jour de Mu'ta ; il ne m'est resté en main qu'une large lame yéménite.", 'Khâlid ibn al-Walîd — al-Bukhârî'],
    ['codex', 'khalid_bio'],
    ['codex', 'parole_sabres'],
    ['nar', "Mais la noosphère n'oublie rien. Chaque victoire y dépose une paillette d'or. Et les hommes, qui aiment regarder ce qui brille, commencent à y dresser quelque chose qui porte son nom."],
    ['nar', "Idris sent le maillon se refermer sur son poignet. La Chaîne murmure : « Regarde bien. Voici un homme qui devra vaincre sa propre statue. »"]
  ],

  outro: [
    ['amb', 'silence'],
    ['title', 'Homs', "An 21 de l'Hégire"],
    ['nar', "Khâlid ne commandera plus. Il vit à Homs quatre années encore, simple croyant parmi ceux qu'il a menés. Il ne récrimine pas. Quand la mort vient, elle le trouve dans son lit, et c'est la seule chose qu'il lui reproche."],
    ['quote', "J'ai pris part à tant de combats ; il n'est pas sur mon corps un empan sans une blessure de sabre, de lance ou de flèche… et voici que je meurs sur ma couche. Que les yeux des lâches ne connaissent pas le sommeil !", "Khâlid ibn al-Walîd, sur son lit de mort — Ibn 'Asâkir ; Ibn Kathîr, al-Bidâya"],
    ['nar', "Il ne laisse ni or ni domaine : son cheval, ses armes et un serviteur, qu'il lègue pour la cause d'Allah. On rapporte que 'Umar dit : « Qu'Allah fasse miséricorde à Abû Sulaymân ; il était autre que ce que nous pensions. »"],
    ['codex', 'mort_khalid'],
    ['amb', 'cite'],
    ['nar', "Idris rouvre les yeux dans les Archives basses. Sur tous les écrans de la Cité-Miroir, l'Agrégor dresse ses colosses du jour. Il sait maintenant comment on les fend : non en frappant plus fort, mais en refusant le socle."],
    ['nar', "Le courage n'est pas seulement de dégainer. C'est de rengainer quand la vérité l'exige. Une Lumière s'allume sur la Chaîne."],
    ['sfx', 'light'],
    ['light', 'shajaa']
  ],

  /* ───────────────────────────── HÉROS ───────────────────────────── */
  heroes: {
    khalid: {
      name: 'Khâlid', title: 'Le Sabre dégainé', arabic: 'خالد',
      role: 'guerrier', el: 'shajaa',
      look: { robe: '#7a2f2a', head: '#efe6d2', cloak: '#3a2a22', aura: '#ff9a70' },
      skills: [
        { lvl: 1, id: 'charge', name: 'Charge', desc: 'Charge de cavalerie sur un égrégore.', cost: 3,
          target: 'foe', el: 'fer', pow: 1.4, anim: 'slash' },
        { lvl: 1, id: 'elan', name: 'Élan', desc: "Le courage fait reculer l'ombre.", cost: 3,
          target: 'foe', el: 'shajaa', pow: 1.3, anim: 'burst' },
        { lvl: 2, id: 'tournante', name: 'Charge tournante', desc: 'Contourne la ligne et frappe deux fois.', cost: 5,
          target: 'foe', el: 'fer', pow: 0.8, hits: 2, anim: 'slash' },
        { lvl: 4, id: 'manoeuvre', name: 'La Manœuvre', desc: 'Science de la bataille : frappe toutes les lignes et peut les ralentir.', cost: 6,
          target: 'foes', el: 'ilm', pow: 0.85, fx: [{ st: 'spd', v: -1, chance: 0.5 }], anim: 'wave' },
        { lvl: 6, id: 'rengainer', name: 'Rengainer', desc: "Remet l'épée au fourreau. La patience fend ce que le fer n'entame pas, et ôte un voile.", cost: 6,
          target: 'foe', el: 'sabr', pow: 1.8, fx: [{ st: 'veil', v: -1 }], anim: 'light' },
        { lvl: 8, id: 'neuf_sabres', name: 'Neuf sabres', desc: 'Frappe quatre fois, jusqu\'à ce que la lame se brise.', cost: 9,
          target: 'foe', el: 'fer', pow: 0.85, hits: 4, anim: 'slash' }
      ],
      limit: { id: 'sabre_degaine', name: 'Le Sabre dégainé', desc: 'Charge irrésistible sur toutes les lignes ; déchire un voile.',
               target: 'foes', el: 'shajaa', pow: 1.7, fx: [{ st: 'veil', v: -1 }], anim: 'pillar' }
    },
    qaqa: {
      name: "Al-Qa'qâ'", title: "Ibn 'Amr at-Tamîmî", arabic: 'القعقاع',
      role: 'stratege', el: 'sabr',
      look: { robe: '#3f5a4a', head: '#e6dcc4', cloak: '#2b3a30', aura: '#8fe0a8' },
      skills: [
        { lvl: 1, id: 'estoc', name: 'Estoc', desc: 'Frappe rapide et précise.', cost: 2,
          target: 'foe', el: 'fer', pow: 1.2, anim: 'slash' },
        { lvl: 1, id: 'eclaireur', name: "Œil de l'éclaireur", desc: "Révèle les failles d'un égrégore.", cost: 2,
          target: 'foe', el: 'sabr', pow: 0.7, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 2, id: 'tenir', name: 'Tenir la ligne', desc: 'Frappe avec constance et affermit sa propre garde.', cost: 4,
          target: 'foe', el: 'sabr', pow: 1.3, fx: [{ st: 'def', v: 1, self: true }], anim: 'guard' },
        { lvl: 4, id: 'dire_vrai', name: 'Dire vrai', desc: 'Rappelle à qui revient la victoire.', cost: 5,
          target: 'foe', el: 'sidq', pow: 1.6, anim: 'light' },
        { lvl: 5, id: 'relever', name: 'Relever un frère', desc: 'Relève un compagnon éprouvé.', cost: 8,
          target: 'ally', revive: true, heal: 0.6, anim: 'heal' },
        { lvl: 6, id: 'voix', name: 'La Voix dans les rangs', desc: 'Sa voix vaut mille hommes : Force et Niyya pour tout le groupe.', cost: 7,
          target: 'allies', fx: [{ st: 'atk', v: 1 }, { st: 'niyya', v: 1 }], anim: 'glyph' }
      ],
      limit: { id: 'vagues', name: 'Vagues de renfort', desc: 'Les cavaliers surgissent par vagues : tous les égrégores vacillent.',
               target: 'foes', el: 'sabr', pow: 1.5, fx: [{ st: 'stun', chance: 0.4 }, { st: 'veil', v: -1 }], anim: 'wave' }
    },
    dirar: {
      name: 'Dirâr', title: 'Ibn al-Azwar', arabic: 'ضرار',
      role: 'guerrier', el: 'shajaa',
      look: { robe: '#b08a4a', head: '#f0e8d8', cloak: '#5a3a22', aura: '#ffb080' },
      skills: [
        { lvl: 1, id: 'ruee', name: 'Ruée', desc: "Se jette sur l'égrégore.", cost: 2,
          target: 'foe', el: 'fer', pow: 1.25, anim: 'slash' },
        { lvl: 1, id: 'outre', name: "Partager l'outre", desc: "Donne sa part d'eau : rend de la Constance à un compagnon.", cost: 4,
          target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 2, id: 'defi', name: 'Défi', desc: 'Attire les coups sur lui et se met en garde.', cost: 3,
          target: 'self', fx: [{ st: 'taunt', turns: 2 }, { st: 'garde' }], anim: 'guard' },
        { lvl: 4, id: 'panser', name: 'Panser', desc: 'Soigne tout le groupe et dissipe ses altérations.', cost: 8,
          target: 'allies', heal: 0.6, fx: [{ st: 'cleanse' }], anim: 'heal' },
        { lvl: 5, id: 'serment', name: 'Serment tenu', desc: "La parole donnée, tenue jusqu'au bout.", cost: 5,
          target: 'foe', el: 'sidq', pow: 1.5, anim: 'light' },
        { lvl: 7, id: 'percee', name: 'Percée', desc: 'Enfonce les lignes deux fois, avec audace.', cost: 7,
          target: 'foe', el: 'shajaa', pow: 1.0, hits: 2, anim: 'burst' }
      ],
      limit: { id: 'avant_garde', name: "L'Avant-garde", desc: 'Charge seul en tête : un coup immense qui déchire deux voiles.',
               target: 'foe', el: 'shajaa', pow: 2.8, fx: [{ st: 'veil', v: -2 }], anim: 'burst' }
    }
  },

  /* ──────────────────────────── ÉGRÉGORES ──────────────────────────── */
  enemies: {
    murmure: {
      name: 'Murmure de soif', art: 'wisp', hue: 30, scale: 1, lvl: 1, tier: 'minion',
      weak: ['shajaa', 'fer'], veils: 1,
      skills: [
        { w: 2, name: 'Gorge sèche', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'atk', v: -1, chance: 0.3 }], anim: 'dark' }
      ],
      taunts: ['Combien de gorgées reste-t-il ?'],
      desc: "Petite voix qui compte l'eau à la place des hommes. Un seul élan de courage suffit à la faire taire."
    },
    mirage: {
      name: 'Le Mirage', art: 'wave', hue: 190, scale: 1, lvl: 2, tier: 'minion',
      weak: ['sabr', 'shajaa'], veils: 2,
      skills: [
        { w: 3, name: 'Eau trompeuse', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'doute', turns: 2, chance: 0.3 }], anim: 'wave' },
        { w: 1, name: 'Reculer', target: 'self', fx: [{ st: 'spd', v: 1 }], anim: 'guard' }
      ],
      taunts: ['Viens. Encore dix pas.'],
      desc: "Né de ce que toute une armée regarde la même eau qui n'existe pas. Il recule quand on avance et détourne de la piste. La patience le dissipe."
    },
    soif: {
      name: 'La Soif', art: 'lens', hue: 25, scale: 2, lvl: 3, tier: 'elite',
      weak: ['sabr', 'shajaa'], veils: 3,
      skills: [
        { w: 3, name: 'Midi sans ombre', target: 'foes', el: 'fer', pow: 0.7, anim: 'burst' },
        { w: 2, name: 'Langue de pierre', target: 'foe', el: 'fer', pow: 1.1, fx: [{ st: 'doute', turns: 2, chance: 0.4 }], anim: 'dark' },
        { w: 2, name: 'Dernière gorgée', target: 'foe', fx: [{ st: 'waswas', turns: 3 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.5, say: 'Cinq nuits. Nul ne les a franchies avant toi. Assieds-toi.', fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 2, name: 'Outres vides', target: 'foes', el: 'fer', pow: 0.8, fx: [{ st: 'spd', v: -1, chance: 0.5 }], anim: 'wave' }] }
      ],
      taunts: ['Le sable est doux à qui renonce.'],
      desc: "Égrégore du désespoir : cinq jours de gorges sèches lui donnent un corps. Elle ne tue pas, elle persuade de s'asseoir. On la brise en continuant de marcher."
    },
    decompte: {
      name: 'Le Décompte', art: 'swarm', hue: 255, scale: 1, lvl: 3, tier: 'minion',
      weak: ['sidq', 'fer'], veils: 2,
      skills: [
        { w: 2, name: 'Dénombrer', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'atk', v: -1, chance: 0.35 }], anim: 'glyph' },
        { w: 1, name: 'Additionner', target: 'ally', fx: [{ st: 'atk', v: 1 }], anim: 'glyph' }
      ],
      taunts: ['Un. Deux. Trois. Mille.'],
      desc: "Nuée de chiffres qui tourne autour des feux de camp. Elle naît chaque fois qu'un guetteur recompte les tentes d'en face."
    },
    ombre_lance: {
      name: 'Forêt de lances', art: 'blade', hue: 280, scale: 1, lvl: 4, tier: 'minion',
      weak: ['shajaa', 'ilm'], veils: 2,
      skills: [
        { w: 3, name: 'Herse', target: 'foe', el: 'fer', pow: 1.1, anim: 'slash' },
        { w: 1, name: 'Rangs serrés', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' }
      ],
      desc: "Des lances sans porteurs : ce que l'œil effrayé voit quand il regarde une armée. La science de la manœuvre y ouvre des brèches."
    },
    peur_nombre: {
      name: 'La Peur du Nombre', art: 'swarm', hue: 270, scale: 3, lvl: 5, tier: 'boss',
      weak: ['shajaa', 'sidq'], veils: 5,
      skills: [
        { w: 3, name: 'Dénombrement', target: 'foes', el: 'fer', pow: 0.65, fx: [{ st: 'atk', v: -1, chance: 0.4 }], anim: 'glyph' },
        { w: 2, name: 'Vertige', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'stun', chance: 0.3 }], anim: 'dark' },
        { w: 2, name: 'Horizon de tentes', target: 'foes', fx: [{ st: 'spd', v: -1, chance: 0.6 }], anim: 'wave' },
        { w: 1, name: 'Se multiplier', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' }
      ],
      phases: [
        { at: 0.5, say: 'Compte-les. Compte-les encore. Chaque lance est un argument.', fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Marée de lances', target: 'foes', el: 'fer', pow: 1.0, anim: 'slash' }] }
      ],
      taunts: ['Vous êtes si peu.', "Regarde l'horizon : il est à eux."],
      desc: "Idole faite de décomptes. Elle fait croire que l'issue d'un jour est une soustraction. La vérité et le courage la fendent."
    },
    echo: {
      name: 'Écho de louange', art: 'mask', hue: 50, scale: 1, lvl: 5, tier: 'minion',
      weak: ['sidq', 'sabr'], veils: 2,
      skills: [
        { w: 3, name: 'Répéter le nom', target: 'foe', el: 'fer', pow: 1.0, anim: 'burst' },
        { w: 1, name: 'Enfler', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'guard' },
        { w: 1, name: 'Flatterie', target: 'foe', fx: [{ st: 'doute', turns: 2, chance: 0.5 }], anim: 'glyph' }
      ],
      taunts: ['Khâlid ! Khâlid !'],
      desc: "Masque creux qui répète un nom d'homme. Dispersé, il se reforme un peu plus loin : seule la vérité, dite calmement, le fait taire."
    },
    laurier: {
      name: 'Le Laurier', art: 'crown', hue: 95, scale: 2, lvl: 7, tier: 'elite',
      weak: ['sabr', 'ilm'], veils: 4,
      skills: [
        { w: 2, name: 'Vers flatteurs', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'doute', turns: 2, chance: 0.4 }], anim: 'glyph' },
        { w: 2, name: "Feuilles d'or", target: 'foes', el: 'fer', pow: 0.8, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'burst' },
        { w: 1, name: 'Couronner', target: 'allies', fx: [{ st: 'atk', v: 1 }], anim: 'light' }
      ],
      phases: [
        { at: 0.5, say: 'Dix mille dirhams pour une louange… Que ne donnerais-tu pas pour une épopée ?', fx: [{ st: 'def', v: 1 }],
          addSkills: [{ w: 2, name: 'Épopée', target: 'foes', el: 'fer', pow: 1.1, anim: 'pillar' }] }
      ],
      taunts: ['Un vers de plus, et tu seras immortel.'],
      desc: "Couronne tressée par les poètes. Chaque feuille porte un vers ; aucun ne nomme Celui qui donne la victoire. Elle coiffe l'Idole du Héros."
    },
    idole_heros: {
      name: "L'Idole du Héros", art: 'colossus', hue: 46, scale: 3, lvl: 9, tier: 'boss',
      weak: ['sabr', 'sidq'], immune: ['fer'], veils: 6,
      skills: [
        { w: 3, name: 'Acclamation', target: 'foes', el: 'fer', pow: 0.85, anim: 'burst' },
        { w: 2, name: 'Ombre portée', target: 'foe', el: 'fer', pow: 1.4, fx: [{ st: 'doute', turns: 2, chance: 0.35 }], anim: 'dark' },
        { w: 2, name: 'Clameur des rangs', target: 'foes', fx: [{ st: 'atk', v: -1, chance: 0.6 }], anim: 'wave' },
        { w: 1, name: 'Piédestal', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' }
      ],
      phases: [
        { at: 0.66, say: 'Sans moi, qui se souviendra de toi ?', fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Légende dorée', target: 'foes', el: 'fer', pow: 1.05, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'pillar' }] },
        { at: 0.33, say: 'Ils ne disent plus : « Allah a donné la victoire. » Ils disent : « Khâlid. »', fx: [{ st: 'def', v: 1 }, { st: 'regen', turns: 3 }],
          addSkills: [{ w: 3, name: "Qu'on me dresse !", target: 'foes', el: 'fer', pow: 1.25, anim: 'pillar' }] }
      ],
      taunts: ['Dégaine. Chaque coup de sabre me grandit.', 'Je porte ton nom mieux que toi.'],
      desc: "Colosse d'or sans visage, coulé dans les acclamations. Le fer ne l'entame pas : il est fait de victoires. Il se brise quand le héros lui-même refuse le socle."
    }
  },

  /* ───────────────────────────── CODEX ───────────────────────────── */
  codex: [
    { id: 'khalid_bio', cat: 'Biographie', title: 'Khâlid ibn al-Walîd',
      text: "Khâlid ibn al-Walîd ibn al-Mughîra, des Banû Makhzûm de Quraysh (qu'Allah l'agrée). Cavalier redouté de La Mecque, il embrasse l'islam en l'an 8 H. À Mu'ta, il ramène l'armée en bon ordre ; le Messager d'Allah ﷺ le nomme alors « un sabre d'entre les sabres d'Allah ». Sous Abû Bakr, il commande à la Yamâma, puis en Irak et en Syrie. Écarté du commandement par 'Umar, il meurt à Homs en 21 H (642).",
      src: "al-Bukhârî ; Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh" },
    { id: 'qaqa_bio', cat: 'Biographie', title: "Al-Qa'qâ' ibn 'Amr",
      text: "Al-Qa'qâ' ibn 'Amr at-Tamîmî (qu'Allah l'agrée), cavalier des Banû Tamîm. Abû Bakr l'envoie en renfort à Khâlid en Irak ; on rapporte qu'il dit de lui : « La voix d'al-Qa'qâ' dans l'armée vaut mieux que mille hommes. » Il suit Khâlid en Syrie, puis s'illustre à al-Qâdisiyya. L'essentiel de ce que l'on sait de lui vient des récits de Sayf ibn 'Umar, repris par at-Tabarî.",
      src: "at-Tabarî, Târîkh (d'après Sayf ibn 'Umar) ; Ibn Hajar, al-Isâba" },
    { id: 'dirar_bio', cat: 'Biographie', title: 'Dirâr ibn al-Azwar',
      text: "Dirâr ibn al-Azwar al-Asadî (qu'Allah l'agrée), Compagnon, cavalier et poète des Banû Asad. Les récits de la conquête de la Syrie en font l'un des plus hardis cavaliers de Khâlid. Beaucoup de ses exploits viennent du Futûh ash-Shâm attribué à al-Wâqidî, dont les historiens discutent la fiabilité ; les sources divergent aussi sur le lieu et la date de sa mort.",
      src: "Ibn 'Abd al-Barr, al-Istî'âb ; Ibn Hajar, al-Isâba ; Futûh ash-Shâm (attribué à al-Wâqidî)" },
    { id: 'abu_ubayda_bio', cat: 'Biographie', title: "Abû 'Ubayda ibn al-Jarrâh",
      text: "'Âmir ibn 'Abdallâh ibn al-Jarrâh (qu'Allah l'agrée), l'un des dix à qui le Paradis fut annoncé. Le Messager d'Allah ﷺ a dit : « Chaque communauté a son homme de confiance, et l'homme de confiance de cette communauté est Abû 'Ubayda ibn al-Jarrâh. » 'Umar lui confie les armées de Syrie. Il meurt de la peste d'Emmaüs ('Amwâs) en 18 H, au milieu de ses hommes.",
      src: "al-Bukhârî ; Muslim ; Ibn Sa'd, Tabaqât" },
    { id: 'traversee', cat: 'Événement', title: 'La traversée de la Samâwa',
      text: "En 13 H, Khâlid reçoit l'ordre de porter secours aux armées de Syrie. Pour déboucher derrière les Romains, il coupe par le désert, de Qurâqir à Suwâ : cinq nuits sans point d'eau. Sur le conseil du guide Râfi' ibn 'Umayra at-Tâ'î, on abreuve des chameaux à satiété pour en faire des réserves vivantes. Au cinquième jour, Râfi', qui souffre des yeux, fait chercher un épineux dont il ne reste que la souche ; on creuse à sa racine, et l'eau paraît.",
      src: 'at-Tabarî, Târîkh ; al-Balâdhurî, Futûh al-Buldân' },
    { id: 'yarmouk', cat: 'Événement', title: 'La bataille du Yarmoûk',
      text: "Bataille décisive entre les armées musulmanes et l'armée romaine d'Orient, au bord du Yarmoûk. Khâlid y range les troupes en trente-six à quarante escadrons (karâdîs), ordonnance que les Arabes n'avaient jamais employée. Les chroniques parlent de plus de cent mille Romains ; les historiens modernes réduisent ces chiffres, mais la disproportion demeure. At-Tabarî, d'après Sayf, place la bataille en 13 H ; Ibn Ishâq et al-Wâqidî en 15 H (636), date le plus souvent retenue.",
      src: 'at-Tabarî, Târîkh ; al-Balâdhurî, Futûh al-Buldân ; Ibn Kathîr, al-Bidâya' },
    { id: 'destitution', cat: 'Événement', title: 'Les deux destitutions',
      text: "Khâlid fut écarté deux fois par 'Umar. D'abord du commandement général de Syrie, à l'avènement du Calife (13 H) : selon at-Tabarî, la lettre arrive au Yarmoûk et Khâlid la garde dans son carquois jusqu'à la victoire ; selon d'autres, Abû 'Ubayda la reçoit devant Damas et tarde, par délicatesse, à la montrer. Puis de son gouvernement de Qinnasrîn (17 H), après un don de dix mille dirhams à al-Ash'ath ibn Qays. Interrogé à Homs, il répond que le don vient de son bien, et il obéit.",
      src: 'at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya' },
    { id: 'mort_khalid', cat: 'Événement', title: 'Homs, an 21',
      text: "Khâlid meurt à Homs en 21 H (642), dans son lit, lui qui avait cherché la mort sur tant de champs de bataille. Il ne laisse que son cheval, ses armes et un serviteur, qu'il lègue pour la cause d'Allah en désignant 'Umar comme exécuteur. On rapporte que 'Umar dit : « Qu'Allah fasse miséricorde à Abû Sulaymân ; il était autre que ce que nous pensions. »",
      src: "Ibn Sa'd, Tabaqât ; Ibn 'Asâkir, Târîkh Dimashq ; Ibn Kathîr, al-Bidâya" },
    { id: 'parole_sabres', cat: 'Parole', title: 'Neuf sabres',
      text: "« Neuf sabres se sont brisés dans ma main le jour de Mu'ta ; il ne m'est resté en main qu'une large lame yéménite. » À Mu'ta (8 H), trois chefs tombent l'un après l'autre ; Khâlid prend l'étendard et ramène l'armée face à des forces très supérieures.",
      src: 'al-Bukhârî, Sahîh (Livre des expéditions)' },
    { id: 'parole_nombre', cat: 'Parole', title: 'Nombreux par la victoire',
      text: "Au Yarmoûk, un homme s'exclame : « Que les Romains sont nombreux et que les musulmans sont peu nombreux ! » Khâlid répond : « Que les Romains sont peu nombreux et que les musulmans sont nombreux ! Les armées ne sont nombreuses que par la victoire et peu nombreuses que par la défaite, non par le nombre des hommes. »",
      src: 'at-Tabarî, Târîkh' },
    { id: 'parole_umar', cat: 'Parole', title: "« C'est Allah qui agit »",
      text: "Après avoir vérifié les comptes de Khâlid et l'avoir trouvé intègre, 'Umar écrit aux provinces : « Je n'ai pas destitué Khâlid par mécontentement ni pour trahison ; mais les gens ont été éblouis par lui, et j'ai craint qu'ils ne s'en remettent à lui. J'ai voulu qu'ils sachent que c'est Allah qui agit. » La mesure ne vise pas l'homme, mais ce que d'autres bâtissaient autour de lui.",
      src: 'at-Tabarî, Târîkh' },
    { id: 'idole_soif', cat: 'Noosphère', title: 'Le Mirage et la Soif',
      text: "Égrégores du désespoir. Le Mirage naît quand toute une armée regarde la même eau qui n'existe pas ; la Soif, quand chacun compte en silence les gorgées qui restent. Ils ne tuent pas : ils persuadent de s'asseoir. On les brise par la patience et le courage, en continuant de marcher vers une source qu'on ne voit pas encore." },
    { id: 'idole_nombre', cat: 'Noosphère', title: 'La Peur du Nombre',
      text: "Idole faite de décomptes. Elle se nourrit de chaque regard qui dénombre l'adversaire et de chaque bouche qui répète le total. Elle fait croire que l'issue est une soustraction. Une parole vraie la fend : « Les armées ne sont nombreuses que par la victoire. » Dans la Cité-Miroir, l'Agrégor lui donne d'autres noms : audience, score, majorité." },
    { id: 'idole_heros', cat: 'Noosphère', title: "L'Idole du Héros",
      text: "Le plus subtil des égrégores : il prend la silhouette d'un homme de bien. Chaque « avec lui, on ne perd jamais » lui ajoute une couche d'or. Il ne demande pas qu'on renie Allah ; seulement qu'on oublie de Le nommer. Le fer ne l'entame pas, car il est fait de victoires. Il se brise quand le héros lui-même refuse le socle. Le Laurier, louange des poètes, est sa couronne." }
  ],

  /* ──────────────────────────── CHAPITRES ──────────────────────────── */
  chapters: [
    /* ═══ 1. LA TRAVERSÉE ═══ */
    {
      id: 'k1', title: 'La Traversée', sub: 'An 13 H · 634 · Désert de la Samâwa',
      map: 'desert', opts: { time: 'dusk' }, start: 'caravane',
      party: ['khalid'],
      npcs: [
        { id: 'rafi', name: "Râfi' ibn 'Umayra", at: ['caravane', 2, 0], look: { kind: 'ancien', robe: '#8a6a3f', head: '#e8dcc2' },
          talk: [['say', 'rafi', "Cinq nuits, émir. Compte-les avec moi, et ne laisse personne compter l'eau à voix haute."]] },
        { id: 'qaqa_pnj', name: "Al-Qa'qâ'", hero: 'qaqa', at: ['caravane', 1, 2],
          talk: [['say', 'qaqa', 'Les hommes sont prêts. Ils ne demandent pas où est l\'eau : ils demandent où tu vas.']] },
        { id: 'dirar_pnj', name: 'Dirâr', hero: 'dirar', at: ['caravane', -1, 2],
          talk: [['say', 'dirar', "Donne-moi l'avant-garde. Si le désert veut quelqu'un, qu'il commence par moi."]] },
        { id: 'messager', name: 'Courrier de Médine', at: ['caravane', -1, -2], look: { kind: 'homme', robe: '#5d6b58', head: '#d9cfb8' },
          talk: [['say', 'messager', "Le Calife a écrit : la moitié des hommes reste avec al-Muthannâ ibn Hâritha pour tenir l'Irak. L'autre moitié est attendue en Syrie comme on attend la pluie."]] },
        { id: 'chamelier', name: 'Chamelier', at: ['caravane', -3, 1], look: { kind: 'homme', robe: '#7d6a50', head: '#cfc3a8' },
          talk: [['say', 'chamelier', "On les prive d'eau, puis on les abreuve deux fois, jusqu'à satiété. Ensuite on leur lie le museau. Leur ventre sera notre outre."]] },
        { id: 'bedouin', name: 'Ancien des Kalb', at: ['caravane', 3, 2], look: { kind: 'ancien', robe: '#4f4a44', head: '#e2d8c4' },
          talk: [
            ['say', 'bedouin', "Qurâqir est la dernière eau de mon peuple. Au-delà, le vent efface les traces avant le matin."],
            ['ask', "Interroger l'ancien", [
              { t: "Qui est Râfi' ?", r: [['say', 'bedouin', "Un homme des Tayy. Il a fait cette route une fois, enfant, avec son père. Une fois suffit à qui sait regarder."]] },
              { t: "Qu'y a-t-il à Suwâ ?", r: [['say', 'bedouin', "Une eau des Bahrâ'. Et derrière elle, la Syrie, par une porte que les Romains ne gardent pas."]] }
            ]]
          ] }
      ],
      foes: [
        { id: 'f1', at: 'rochers', group: ['mirage', 'murmure'], bg: 'desert' },
        { id: 'f2', at: 'oasis', group: ['mirage', 'mirage'], bg: 'desert' },
        { id: 'f3', at: 'ruines', group: ['murmure', 'murmure', 'murmure'], bg: 'desert' }
      ],
      chests: [
        { at: ['ruines', 1, 1], item: 'dattes', n: 2 },
        { at: ['dunes', 2, -1], item: 'siwak', n: 1 }
      ],
      intro: [
        ['title', 'La Traversée', "An 13 de l'Hégire · Désert de la Samâwa"],
        ['amb', 'vent'],
        ['nar', "Al-Hîra est tombée, l'Euphrate est tenu. C'est alors qu'arrive une lettre de Médine : en Syrie, les armées musulmanes font face à la plus grande levée que Rome ait rassemblée."],
        ['quote', "Par Allah, je ferai oublier aux Romains les suggestions du diable par Khâlid ibn al-Walîd.", 'On rapporte d\'Abû Bakr as-Siddîq — at-Tabarî, Târîkh'],
        ['nar', "L'ordre est bref : laisser la moitié de l'armée en Irak, prendre l'autre, et rejoindre la Syrie au plus vite. Au puits de Qurâqir, Khâlid cherche un guide."],
        ['give', 'eau', 2],
        ['give', 'dattes', 3]
      ],
      objectives: [
        { text: "Consulter Râfi' ibn 'Umayra, le guide", talk: 'rafi', then: [
          ['say', 'khalid', "On dit que tu connais un chemin vers la Syrie qui passe derrière les garnisons romaines."],
          ['say', 'rafi', "Je le connais. Mais tu ne le feras pas avec des chevaux et des bagages. Par Allah, le cavalier seul y craint pour sa vie. Cinq nuits pleines, sans une goutte d'eau."],
          ['say', 'qaqa', "La route du nord est sûre, mais longue, et les forts romains la surveillent. Chaque jour perdu, nos frères de Syrie le paient."],
          ['choice', 'Quelle route Khâlid ordonne-t-il ?', [
            { t: "La route des caravanes, par le nord : plus longue, mais l'eau y est certaine.", r: [
              ['nar', "La chaîne vacille. Les transmetteurs rapportent que Khâlid voulut déboucher derrière les lignes romaines sans être retenu en chemin. La route sûre l'aurait fait arriver trop tard."]] },
            { t: 'Attendre à Qurâqir des outres et des renforts de Médine.', r: [
              ['nar', "La chaîne vacille. L'ordre d'Abû Bakr disait : au plus vite. Khâlid ne fit pas attendre ceux qui l'attendaient."]] },
            { t: 'Couper droit par le désert : cinq nuits, et les chameaux pour outres.', ok: true, r: [
              ['say', 'khalid', "Il le faut, Râfi'. J'ai reçu du Calife un ordre ferme. Dis ce qu'il faut faire, et ce sera fait."]] }
          ]],
          ['say', 'rafi', "Alors que chacun emporte toute l'eau qu'il peut. Assoiffez vingt chameaux robustes, puis abreuvez-les deux fois. Chaque soir nous en sacrifierons : les hommes boiront aux outres, les chevaux boiront ce que les bêtes ont gardé."],
          ['say', 'dirar', "Je prends la tête, avec le guide."],
          ['join', 'qaqa'], ['hide', 'qaqa_pnj'],
          ['join', 'dirar'], ['hide', 'dirar_pnj'],
          ['codex', 'qaqa_bio'], ['codex', 'dirar_bio'],
          ['sfx', 'duff']
        ] },
        { text: "Mener l'armée à la lisière du désert", goto: 'depart', then: [
          ['nar', "Les bêtes ont bu, les outres sont pleines. Devant les rangs, le sable n'a plus ni piste ni borne. Khâlid se retourne vers ses hommes."],
          ['quote', "Que votre voie ne se divise pas et que votre certitude ne faiblisse pas. Sachez que le secours vient à la mesure de l'intention, et la récompense à la mesure de ce que l'on espère d'Allah.", 'Khâlid, au départ de Qurâqir — at-Tabarî, Târîkh'],
          ['tp', 'rafi', ['depart', 1, 0]],
          ['say', 'rafi', "Nous marcherons de nuit. Le jour, on se tait et on garde sa salive."],
          ['sfx', 'wind']
        ] },
        { text: "S'enfoncer dans les dunes", goto: 'dunes', then: [
          ['tp', 'rafi', ['dunes', 1, 0]],
          ['nar', "Deuxième nuit. Le sable boit les pas. Au bivouac, on sacrifie les premières bêtes ; les chevaux boivent, les hommes se partagent l'outre gorgée par gorgée."],
          ['say', 'dirar', "Émir, l'arrière-garde voit de l'eau du côté des rochers. Un lac entier, disent-ils."],
          ['say', 'rafi', "Il n'y a pas d'eau avant Suwâ. Ce qu'ils voient, c'est le désert qui leur parle. Ne le laissez pas finir sa phrase."],
          ['nar', "Dans la noosphère, la soif de toute une armée a pris forme : un lac qui n'existe pas, et qui appelle."]
        ] },
        { text: 'Dissiper le Mirage qui miroite aux rochers', foe: 'f1', then: [
          ['sfx', 'break'],
          ['nar', "L'eau se défait comme une étoffe qu'on déchire. Derrière, il n'y a que la pierre chaude — et la piste, de nouveau visible."],
          ['say', 'qaqa', "Troisième nuit. Les hommes ne parlent plus. C'est bon signe : ils marchent."],
          ['codex', 'idole_soif']
        ] },
        { text: 'Gravir la crête au cinquième jour', goto: 'crete', then: [
          ['tp', 'rafi', ['crete', 1, 0]],
          ['nar', "Cinquième jour. Les outres sont vides, les dernières bêtes abattues. Râfi', les yeux brûlés par une ophtalmie, ne distingue plus l'horizon."],
          ['say', 'rafi', "Regardez pour moi. Cherchez deux buttes jumelles. À leur pied, un épineux, de la taille d'un homme assis."],
          ['say', 'dirar', "Nous voyons les buttes. Il n'y a pas d'arbre."],
          ['quote', "Nous sommes à Allah et c'est à Lui que nous retournons ! Vous êtes perdus, par Allah, et moi avec vous. Regardez encore !", "Râfi' ibn 'Umayra — at-Tabarî, Târîkh"],
          ['say', 'qaqa', "Là. Une souche. On l'a coupé : il n'en reste que la racine."],
          ['say', 'rafi', 'Creusez à sa racine.']
        ] },
        { text: "Atteindre la souche de l'épineux", goto: 'source', then: [
          ['tp', 'rafi', ['source', 1, 1]],
          ['tint', '#ffb347'], ['sfx', 'glitch'],
          ['nar', "Mais entre les hommes et la souche, quelque chose se lève. Cinq jours de gorges sèches lui ont donné un corps."],
          ['say', 'La Soif', "Nul homme n'a franchi ces cinq nuits avant toi. Couche-toi. Le sable est doux à qui renonce."],
          ['say', 'khalid', "Je n'ai pas promis d'arriver. J'ai promis de marcher."],
          ['battle', { group: ['soif', 'mirage'], bg: 'desert', boss: true, intro: 'La Soif barre le chemin de la source.' }],
          ['tint', null], ['sfx', 'light'],
          ['nar', "On creuse. Le sable devient sombre, puis humide. Puis l'eau monte, froide, entre les doigts."],
          ['say', 'rafi', "Par Allah, je ne suis venu à cette eau qu'une seule fois, enfant, avec mon père."],
          ['heal'],
          ['quote', "Qu'ils sont bénis, les yeux de Râfi' : comme il a su trouver sa route ! De Qurâqir à Suwâ il a coupé le désert — cinq nuits où le lâche, s'il s'y engage, pleure.", "Vers d'un homme de l'armée — at-Tabarî, Târîkh"]
        ] }
      ],
      outro: [
        ['codex', 'traversee'],
        ['nar', "Au sixième matin, l'armée de Khâlid sort du désert à Suwâ, sur les arrières des Romains, là où aucune sentinelle ne regardait. La Syrie apprend son nom en une seule aube."],
        ['nar', "Dans la noosphère, une paillette d'or de plus. Les hommes disent déjà : « Avec lui, même le désert s'ouvre. »"]
      ]
    },

    /* ═══ 2. YARMOÛK ═══ */
    {
      id: 'k2', title: 'Yarmoûk', sub: 'An 13 ou 15 H · 634–636 · Vallée du Yarmoûk',
      map: 'camp', opts: { time: 'night' }, start: 'entree',
      party: ['khalid', 'qaqa', 'dirar'],
      npcs: [
        { id: 'guetteur', name: 'Guetteur', at: 'tertre', look: { kind: 'soldat', robe: '#5a4a38', head: '#d8cdb6' },
          talk: [['say', 'guetteur', "Je ne compte plus, émir. Je regarde seulement s'ils bougent."]] },
        { id: 'abu_ubayda', name: "Abû 'Ubayda ibn al-Jarrâh", at: 'tente_chef', look: { kind: 'compagnon', robe: '#d9d2bf', head: '#f3eee0', cloak: '#6b6250' },
          talk: [['say', 'abu_ubayda', "Demande-moi ce qu'il faut pour tes escadrons, Abû Sulaymân. Ce que j'ai est à toi."]] },
        { id: 'courrier', name: 'Courrier de Médine', at: ['entree', 1, 0], hidden: true, look: { kind: 'homme', robe: '#5d6b58', head: '#d9cfb8' } },
        { id: 'veteran', name: 'Vétéran de Badr', at: ['etendard', 1, 1], look: { kind: 'ancien', robe: '#6a5d4c', head: '#efe8d8' },
          talk: [['say', 'veteran', "À Badr, nous étions trois cents et quelques. Personne n'a compté ceux d'en face deux fois. On dit qu'une centaine d'hommes de Badr sont dans ce camp."]] },
        { id: 'armurier', name: 'Armurier', at: ['tentes', 0, 1], look: { kind: 'homme', robe: '#70553c', head: '#cbbfa6' },
          talk: [['say', 'armurier', "On dit que Khâlid veut ranger l'armée par escadrons, dans une ordonnance que les Arabes n'ont jamais employée. J'aiguise ; il ordonne ; Allah décide."]] },
        { id: 'jeune', name: 'Jeune soldat', at: ['feu', 1, 0], look: { kind: 'soldat', robe: '#64503a', head: '#d5c9b0' },
          talk: [['say', 'jeune', "Mon père disait : celui qui compte ses adversaires a déjà perdu la moitié de son bras. Je m'efforce de regarder le feu."]] }
      ],
      foes: [
        { id: 'f1', at: ['feu', -2, 1], group: ['decompte', 'decompte'], bg: 'camp' },
        { id: 'f2', at: 'enclos', group: ['decompte', 'ombre_lance'], bg: 'camp' },
        { id: 'f3', map: 'noos', at: 'noeud2', group: ['ombre_lance', 'decompte', 'ombre_lance'], bg: 'noos' },
        { id: 'f4', map: 'noos', at: 'faille', group: ['decompte', 'decompte', 'decompte'], bg: 'noos' }
      ],
      chests: [
        { at: ['tentes', 2, 0], item: 'pain', n: 2 },
        { at: ['etendard', -1, 1], item: 'musc', n: 1 },
        { map: 'noos', at: 'miroir', item: 'lait', n: 1 }
      ],
      intro: [
        ['title', 'Yarmoûk', 'La veillée des émirs'],
        ['amb', 'feu'],
        ['nar', "Les émirs de Syrie ont réuni leurs armées au bord du Yarmoûk. En face, la plaine est couverte de tentes romaines. Les transmetteurs divergent sur l'année ; la Chaîne suit ici le récit d'at-Tabarî."],
        ['nar', "Depuis des semaines, les deux camps s'observent. Chaque soir, des hommes montent sur le tertre et comptent les feux d'en face. Chaque soir, ils en trouvent davantage."]
      ],
      objectives: [
        { text: 'Monter au tertre, où les guetteurs comptent les feux', talk: 'guetteur', then: [
          ['say', 'guetteur', 'Émir… Que les Romains sont nombreux, et que les musulmans sont peu nombreux !'],
          ['quote', "Que les Romains sont peu nombreux et que les musulmans sont nombreux ! Les armées ne sont nombreuses que par la victoire et peu nombreuses que par la défaite, non par le nombre des hommes.", 'Khâlid ibn al-Walîd, au Yarmoûk — at-Tabarî, Târîkh'],
          ['nar', "Le guetteur baisse les yeux vers ses doigts, qui comptaient encore. Dans la noosphère du camp, quelque chose d'immense a frémi, comme dérangé."],
          ['codex', 'parole_nombre']
        ] },
        { text: "Rejoindre le conseil des émirs sous la tente d'Abû 'Ubayda", talk: 'abu_ubayda', then: [
          ['nar', "Sous la tente, les émirs : Abû 'Ubayda, 'Amr ibn al-'Âs, Yazîd ibn Abî Sufyân, Shurahbîl ibn Hasana. Chacun commande son armée ; chacun prie avec les siens."],
          ['say', 'khalid', "Si nous combattons en armées séparées, ils nous briseront l'une après l'autre. Un seul commandement, à tour de rôle : un jour l'un, un jour l'autre. Laissez-moi le premier jour."],
          ['quote', "Ce jour est l'un des jours d'Allah : il n'y sied ni vanité ni injustice. Rendez votre combat sincère, et ne cherchez par vos œuvres qu'Allah.", 'Khâlid, au conseil des émirs — at-Tabarî, Târîkh'],
          ['say', 'abu_ubayda', "Tu as dit vrai. Prends cette journée, Abû Sulaymân, et range-nous comme tu l'entends."],
          ['say', 'khalid', "Trente-six escadrons, et davantage. Le centre à Abû 'Ubayda, les ailes à 'Amr et à Yazîd. Qu'ils voient des armées là où il n'y a que des hommes résolus."],
          ['codex', 'yarmouk'], ['codex', 'abu_ubayda_bio'],
          ['show', 'courrier'],
          ['say', 'qaqa', "Émir, un cavalier à l'entrée du camp. Il vient de Médine et ne veut parler qu'à toi."]
        ] },
        { text: 'Aller au-devant du cavalier venu de Médine', goto: 'entree', then: [
          ['say', 'courrier', "Émir, je porte deux nouvelles et une lettre. Abû Bakr as-Siddîq est retourné à son Seigneur. 'Umar ibn al-Khattâb est le Commandeur des croyants."],
          ['nar', "Khâlid se tait longtemps. Puis il brise le sceau. La lettre confie à Abû 'Ubayda le commandement des armées de Syrie. Le sien lui est retiré."],
          ['say', 'courrier', "Aux soldats qui m'interrogeaient, j'ai répondu : tout va bien, et des renforts arrivent."],
          ['choice', 'La bataille est pour demain. Que fait Khâlid de la lettre ?', [
            { t: 'La lire aux troupes sur-le-champ : elles ont le droit de savoir.', r: [
              ['nar', "La chaîne vacille. On rapporte que Khâlid craignit qu'à la veille du combat, la mort du Calife et le changement de chef ne jettent le trouble dans les rangs. Il ne la lut pas ce soir-là."]] },
            { t: "L'ignorer : Médine est loin, et demain il sera vainqueur.", r: [
              ['nar', "La chaîne vacille. Rien de tel n'est rapporté de lui. Celui qui disait « j'ai reçu un ordre ferme » au bord du désert n'a pas appris à désobéir au bord d'une victoire."]] },
            { t: "La glisser dans son carquois, combattre d'abord, puis remettre le commandement.", ok: true, r: [
              ['say', 'khalid', 'Tu as bien fait de te taire.'],
              ['nar', "Il glisse la lettre dans son carquois. Demain, l'armée aura besoin d'un seul cœur. Après-demain, elle aura le chef que le Calife lui a choisi."]] }
          ]],
          ['hide', 'courrier'],
          ['nar', "Cette nuit-là, Khâlid commande une armée qui n'est déjà plus la sienne. Nul ne le sait que lui, le courrier — et Celui à qui rien n'échappe."]
        ] },
        { text: "Gagner les lignes avant l'aube", goto: 'lignes', then: [
          ['amb', 'bataille'], ['sfx', 'roll'],
          ['nar', "L'aube. En face, les rangs romains s'ébranlent, enseignes levées, dans un grondement qui fait trembler l'eau des gourdes."],
          ['nar', "Et dans la noosphère, la peur de tous ceux qui ont compté les feux se lève d'un bloc. Tant qu'elle tiendra debout, aucun escadron ne tiendra."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 270 }],
          ['amb', 'noos'],
          ['say', 'dirar', "Des lances jusqu'au bout du regard. Et pas un seul bras pour les tenir."]
        ] },
        { text: 'Fendre la forêt de lances qui garde le passage', foe: 'f3', then: [
          ['nar', "Les lances n'étaient que des chiffres dressés. Derrière elles, le cœur du nœud bat comme un tambour de guerre."]
        ] },
        { text: 'Atteindre le cœur, où se tient la Peur du Nombre', goto: 'coeur', then: [
          ['say', 'La Peur du Nombre', 'Regarde l\'horizon, Khâlid. Compte avec moi : un, deux, trois… Tu n\'auras pas fini avant la nuit.'],
          ['say', 'khalid', "Les armées ne sont nombreuses que par la victoire. Tu n'es qu'un chiffre qui a pris peur de lui-même."],
          ['battle', { group: ['decompte', 'peur_nombre', 'decompte'], bg: 'noos', boss: true, intro: 'La Peur du Nombre déploie ses mille lances.' }],
          ['sfx', 'break'], ['flash', '#ffffff'],
          ['map', 'camp', 'tente_chef', { time: 'dusk' }],
          ['amb', 'vent'],
          ['nar', "La bataille fut longue et rude ; les chroniques en gardent le fracas. Au plus fort de la mêlée, 'Ikrima ibn Abî Jahl et quatre cents hommes firent serment de ne pas reculer. La cavalerie de Khâlid sépara les cavaliers romains de leur infanterie, et la plaine bascula."],
          ['nar', "On rapporte qu'au soir, on porta de l'eau à un blessé. Il désigna son voisin : « Lui d'abord. » Le voisin désigna un troisième. Quand l'outre revint au premier, tous trois étaient morts sans avoir bu."],
          ['say', 'dirar', "Nous avons traversé cinq nuits pour de l'eau. Eux l'ont tenue dans leurs mains, et ils l'ont donnée."],
          ['nar', "Alors seulement, Khâlid tire la lettre de son carquois et la tend à Abû 'Ubayda."],
          ['say', 'khalid', "Le Commandeur des croyants t'a confié la Syrie. Je suis sous tes ordres."],
          ['say', 'abu_ubayda', "Ce n'est pas le pouvoir de ce monde que je cherche, ni pour ce monde que j'œuvre. Nous sommes frères. Reste près de moi : cette armée a besoin de ton conseil."]
        ] }
      ],
      outro: [
        ['codex', 'destitution'], ['codex', 'idole_nombre'],
        ['nar', "Khâlid redevient un émir parmi d'autres. Il charge là où Abû 'Ubayda l'envoie : Damas, Homs, Qinnasrîn. Les soldats, eux, n'ont rien changé à leurs chansons."],
        ['nar', "Dans la noosphère, la Peur du Nombre est tombée. Mais sur le socle qu'elle laisse vide, les paillettes d'or commencent à dessiner une silhouette."]
      ]
    },

    /* ═══ 3. L'ÉPÉE AU FOURREAU ═══ */
    {
      id: 'k3', title: "L'Épée au fourreau", sub: 'An 17 H · 638 · Qinnasrîn, puis Homs',
      map: 'romaine', opts: { time: 'day' }, start: 'palais',
      party: ['khalid', 'qaqa', 'dirar'],
      npcs: [
        { id: 'poete', name: 'Un poète', at: ['forum', 1, 0], look: { kind: 'homme', robe: '#7c4f6a', head: '#e9dfc8' },
          talk: [['say', 'poete', 'Mes vers courront plus vite que tes chevaux, émir. Demain on les chantera jusqu\'en Irak.']] },
        { id: 'soldat', name: 'Soldat de Khâlid', at: ['marche', 2, 1], look: { kind: 'soldat', robe: '#5f4a36', head: '#d6cab2' },
          talk: [['say', 'soldat', 'Avec Khâlid, on ne perd jamais. Tout le monde le sait. Même les Romains le savent.']] },
        { id: 'marchand', name: 'Marchand de Homs', at: ['fontaine', 1, 0], look: { kind: 'romain', robe: '#8a8fa3', head: '#cfc6b4' },
          talk: [['say', 'marchand', "Quand vos armées ont dû quitter Homs, avant le Yarmoûk, elles nous ont rendu l'impôt : « Nous ne pouvons plus vous protéger. » Aucun empire ne nous avait jamais rendu une pièce."]] },
        { id: 'moine', name: 'Moine', at: ['basilique', 0, 1], look: { kind: 'moine', robe: '#3e3a36', head: '#3e3a36' },
          talk: [['say', 'moine', "On nous a garanti nos vies, nos biens et nos églises. J'ai vu passer bien des maîtres ; je juge chacun à ce qu'il laisse debout."]] },
        { id: 'estafette', name: "Courrier d'Abû 'Ubayda", at: ['marche', -1, 0], hidden: true, look: { kind: 'soldat', robe: '#56624f', head: '#d9cfb8' } },
        { id: 'abu_ubayda', name: "Abû 'Ubayda ibn al-Jarrâh", at: 'esplanade', hidden: true, look: { kind: 'compagnon', robe: '#d9d2bf', head: '#f3eee0', cloak: '#6b6250' },
          talk: [['say', 'abu_ubayda', "Tu m'es plus cher aujourd'hui qu'au soir du Yarmoûk, Abû Sulaymân."]] },
        { id: 'bilal', name: 'Bilâl ibn Rabâh', at: ['esplanade', 1, 0], hidden: true, look: { kind: 'compagnon', robe: '#efe9da', head: '#f6f2e6', cloak: '#3b3a37' },
          talk: [['say', 'bilal', "J'ai porté un ordre, et tu l'as porté avec moi. Qu'Allah t'en récompense."]] }
      ],
      foes: [
        { id: 'f1', at: 'marche', group: ['echo', 'echo'], bg: 'romaine' },
        { id: 'f0', at: 'jardin', group: ['echo'], bg: 'romaine' },
        { id: 'f2', map: 'noos', at: 'noeud2', group: ['echo', 'laurier'], bg: 'noos' },
        { id: 'f3', map: 'noos', at: 'faille', group: ['echo', 'echo', 'echo'], bg: 'noos' }
      ],
      chests: [
        { at: ['palais', 1, 1], item: 'eau', n: 2 },
        { at: ['jardin', 1, 0], item: 'miel', n: 1 },
        { map: 'noos', at: 'miroir', item: 'musc', n: 2 }
      ],
      intro: [
        ['title', "L'Épée au fourreau", "An 17 de l'Hégire · Qinnasrîn"],
        ['amb', 'foule'],
        ['nar', "Quatre ans ont passé. La Syrie est ouverte, d'Antioche à Jérusalem. Khâlid gouverne Qinnasrîn sous l'autorité d'Abû 'Ubayda. Il revient d'une expédition heureuse, chargé de butin."],
        ['nar', "Les gens affluent vers lui de toutes parts : solliciteurs, poètes, curieux. On vient voir l'homme qui ne perd jamais. On repart en racontant qu'on l'a vu."]
      ],
      objectives: [
        { text: "Traverser Qinnasrîn jusqu'au forum", goto: 'forum', then: [
          ['sfx', 'crowd'],
          ['say', 'poete', "Voici celui devant qui les forteresses ouvrent leurs portes ! Celui dont le nom marche devant lui comme une avant-garde !"],
          ['nar', "La foule reprend. Khâlid écoute. Il est généreux de nature : à un solliciteur de marque, il fait compter dix mille dirhams, pris sur sa part."],
          ['say', 'qaqa', 'Émir… Dix mille. Cela se saura à Médine avant la fin du mois.'],
          ['say', 'Des soldats', 'Avec Khâlid, on ne perd jamais !'],
          ['nar', "Chaque acclamation, dans la noosphère, est un coup de ciseau sur un bloc d'or. Au marché, les échos de louange ont pris corps : ils répètent son nom tout seuls."]
        ] },
        { text: 'Faire taire les échos de louange au marché', foe: 'f1', then: [
          ['nar', "Les échos se dispersent — et reviennent aussitôt, un peu plus loin. On ne fait pas taire une louange à coups de sabre. Khâlid regarde sa lame ; pour la première fois, elle lui semble inutile."],
          ['show', 'estafette'],
          ['say', 'estafette', "Émir, Abû 'Ubayda te demande à Homs. Un envoyé du Commandeur des croyants est arrivé de Médine."],
          ['fade', 'out'],
          ['hide', 'poete'], ['hide', 'soldat'], ['hide', 'estafette'],
          ['show', 'abu_ubayda'], ['show', 'bilal'],
          ['map', 'romaine', 'porte', { time: 'dusk' }],
          ['hide', 'poete'], ['hide', 'soldat'], ['hide', 'estafette'],
          ['show', 'abu_ubayda'], ['show', 'bilal'],
          ['title', 'Homs', "L'armée est assemblée sur l'esplanade"],
          ['fade', 'in'],
          ['amb', 'foule']
        ] },
        { text: "Se présenter devant Abû 'Ubayda, sur l'esplanade", talk: 'abu_ubayda', then: [
          ['nar', "L'armée est rassemblée. Abû 'Ubayda est monté en chaire, et il se tait : l'ordre qu'il a reçu lui pèse. C'est Bilâl, l'envoyé du Calife, qui se lève."],
          ['say', 'bilal', "Le Commandeur des croyants ordonne que Khâlid soit interrogé devant tous, tête nue, les mains liées de son propre turban, jusqu'à ce qu'il ait répondu."],
          ['nar', "Un grondement parcourt les rangs. Des mains vont aux gardes des sabres. Un mot de Khâlid, un seul, et cette armée est à lui."],
          ['choice', "Bilâl s'avance vers lui. Que fait Khâlid ?", [
            { t: 'Refuser devant ses hommes : « On ne lie pas les mains qui ont ouvert la Syrie. »', r: [
              ['nar', "La chaîne vacille. Aucun transmetteur ne rapporte un mot de révolte. Ce jour-là, l'armée attendait un signe ; Khâlid ne le donna pas."]] },
            { t: 'Quitter Homs de nuit et plaider sa cause à Médine, loin des regards.', r: [
              ['nar', "La chaîne vacille. Khâlid ira bien à Médine — mais après avoir répondu ici, devant tous. Il ne déroba rien à l'ordre reçu."]] },
            { t: 'Se laisser décoiffer et lier, répondre la vérité, et obéir.', ok: true, r: [
              ['nar', "Khâlid ne dit rien. Bilâl ôte sa coiffe et lui lie les mains de son turban. Sur l'esplanade, on entendrait tomber un grain de sable."]] }
          ]],
          ['say', 'bilal', "Ce don de dix mille dirhams : l'as-tu pris sur ton bien, ou sur le butin des musulmans ?"],
          ['say', 'khalid', 'Sur mon bien.'],
          ['nar', "Bilâl délie ses mains et, de ses propres mains, le recoiffe de son turban."],
          ['say', 'bilal', 'Nous écoutons ceux qui nous commandent et nous leur obéissons ; et nous honorons ceux qui le méritent.'],
          ['say', 'khalid', "J'écoute et j'obéis."],
          ['codex', 'destitution'],
          ['nar', "Khâlid a obéi. Mais dans les rangs, la colère enfle : « Ils ont osé. Lui ! » Et cette colère-là ne monte pas vers Allah. Elle monte vers un socle."],
          ['sfx', 'glitch'], ['shake', 500],
          ['map', 'noos', 'seuil', { hue: 48 }],
          ['amb', 'noos'],
          ['nar', "La noosphère de Homs. Au bout d'une allée de lumière, un colosse d'or sans visage, coulé dans quatre ans d'acclamations. Il porte au côté un sabre que Khâlid reconnaît."]
        ] },
        { text: "Abattre le Laurier qui couronne l'allée", foe: 'f2', then: [
          ['sfx', 'break'],
          ['nar', "Le Laurier tombe en feuilles de métal. Chaque feuille portait un vers ; aucun ne nommait Celui qui donne la victoire."]
        ] },
        { text: "Faire face à l'Idole du Héros", goto: 'coeur', then: [
          ['say', "L'Idole du Héros", "Te voilà. Je t'attendais, moi qui suis toi — en mieux. Je ne saigne pas. Je ne doute pas. On ne me destitue pas."],
          ['say', 'khalid', 'Tu portes mon sabre.'],
          ['say', "L'Idole du Héros", 'Et ton nom. Frappe-moi, si tu veux : chaque coup de sabre me grandit.'],
          ['say', 'qaqa', 'Émir, le fer ne lui fera rien. Il est fait de tes victoires.'],
          ['say', 'khalid', "Alors je le combattrai avec ce qu'il ne possède pas."],
          ['battle', { group: ['idole_heros'], bg: 'noos', boss: true, intro: "Le fer ne l'entame pas. Seules la patience et la vérité fendent l'or." }],
          ['flash', '#fff2c0'], ['sfx', 'break'],
          ['say', "L'Idole du Héros", 'Sans moi… qui se souviendra… de toi ?'],
          ['say', 'khalid', "Celui qui n'oublie rien me suffit."],
          ['nar', "Le colosse se fend du sommet au socle. Dedans, il n'y a rien : pas même un homme. Seulement le creux où d'autres avaient versé leur confiance."],
          ['map', 'romaine', 'porte', { time: 'dawn' }],
          ['hide', 'poete'], ['hide', 'soldat'], ['hide', 'estafette'],
          ['amb', 'vent'],
          ['nar', "Khâlid prend la route de Médine. 'Umar l'y reçoit, examine ses comptes, et le trouve intègre. Puis le Calife écrit aux provinces."],
          ['quote', "Je n'ai pas destitué Khâlid par mécontentement ni pour trahison ; mais les gens ont été éblouis par lui, et j'ai craint qu'ils ne s'en remettent à lui. J'ai voulu qu'ils sachent que c'est Allah qui agit.", "'Umar ibn al-Khattâb, lettre aux provinces — at-Tabarî, Târîkh"]
        ] }
      ],
      outro: [
        ['codex', 'parole_umar'], ['codex', 'idole_heros'],
        ['nar', "Les armées continuèrent de vaincre sans lui. C'était la preuve que 'Umar cherchait — et peut-être celle dont Khâlid lui-même avait besoin."],
        ['say', 'dirar', "Émir… que ferons-nous, à présent ?"],
        ['say', 'khalid', "Ce que nous faisions avant qu'on nous regarde."]
      ]
    }
  ]
});
