/* ISNAD — Saga III : Khâlid ibn al-Walîd, « Le Sabre dégainé ».
   Thèse : le plus grand courage n'est pas de dégainer, mais de rengainer. Le plus grand capitaine de son
   temps a aussi conclu des paix : le sabre n'est que le dernier recours.
   v2 : trois pourparlers (le monastère d'al-Hîra, les Banû Zurayr au Yarmoûk, le Fort des Oliviers), prières,
   savoirs qui ouvrent des arguments, piliers, et un hypocrite de fiction : Ghâlib, l'intendant.
   Fiction signalée dans le codex : l'économe et son monastère, Wahb ibn Zurayr et son clan, le Fort des
   Oliviers, Ghâlib, les feuillets.
   Sources principales : at-Tabarî (Târîkh), al-Balâdhurî (Futûh al-Buldân), al-Bukhârî, Ibn Sa'd, Ibn Kathîr. */
ISNAD.registerSaga({
  id: 'khalid', order: 3,
  name: 'Khâlid ibn al-Walîd', epithet: 'Le Sabre dégainé', arabic: 'خالد',
  years: '13–21 H · 634–642',
  light: 'shajaa', lightName: 'Courage',
  ambiance: 'désert · romaine',
  tagline: "Il n'a jamais perdu une bataille. Il lui reste à vaincre sa propre statue.",

  intro: [
    ['title', 'Khâlid ibn al-Walîd', 'Troisième maillon · Le Sabre dégainé'],
    ['mus', 'desert'],
    ['nar', "An 13 de l'Hégire. L'Arabie est de nouveau une. Au nord, deux empires se regardent depuis des siècles par-dessus le désert : Rome et la Perse. Entre eux marche un homme que nul n'a encore vu vaincu."],
    ['nar', "Khâlid, fils d'al-Walîd, des Banû Makhzûm. À Uhud, il chargeait contre les musulmans. Depuis l'an 8, il charge avec eux. Le Messager d'Allah ﷺ l'a nommé « un sabre d'entre les sabres d'Allah »."],
    ['quote', "Neuf sabres se sont brisés dans ma main le jour de Mu'ta ; il ne m'est resté en main qu'une large lame yéménite.", 'Khâlid ibn al-Walîd — al-Bukhârî'],
    ['codex', 'khalid_bio'],
    ['codex', 'parole_sabres'],
    ['nar', "On retient d'un capitaine ses charges, parce qu'elles font du bruit. Ses traités n'en font pas : une porte qui s'ouvre ne s'entend pas de loin. Al-Hîra, Damas, vingt cités lui ont ouvert sur une parole écrite."],
    ['nar', "Mais la noosphère n'oublie rien. Chaque victoire y dépose une paillette d'or. Et les hommes, qui aiment regarder ce qui brille, commencent à y dresser quelque chose qui porte son nom."],
    ['nar', "Idris sent le maillon se refermer sur son poignet. La Chaîne murmure : « Regarde bien. Voici un homme qui devra vaincre sa propre statue. »"]
  ],

  outro: [
    ['mus', 'deuil'],
    ['title', 'Homs', "An 21 de l'Hégire"],
    ['nar', "Khâlid ne commandera plus. Il vit à Homs quatre années encore, simple croyant parmi ceux qu'il a menés. Il ne récrimine pas. Quand la mort vient, elle le trouve dans son lit, et c'est la seule chose qu'il lui reproche."],
    ['quote', "J'ai pris part à tant de combats ; il n'est pas sur mon corps un empan sans une blessure de sabre, de lance ou de flèche… et voici que je meurs sur ma couche. Que les yeux des lâches ne connaissent pas le sommeil !", "Khâlid ibn al-Walîd, sur son lit de mort — Ibn 'Asâkir ; Ibn Kathîr, al-Bidâya"],
    ['nar', "Il ne laisse ni or ni domaine : son cheval, ses armes et un serviteur, qu'il lègue pour la cause d'Allah. On rapporte que 'Umar dit : « Qu'Allah fasse miséricorde à Abû Sulaymân ; il était autre que ce que nous pensions. »"],
    ['codex', 'mort_khalid'],
    ['nar', "Les villes qu'il avait prises par un écrit étaient encore debout, et leurs portes ouvertes. Celles-là ne chantent pas son nom. Elles vivent : c'est une louange qui ne fabrique pas d'idole."],
    ['mus', 'espoir'],
    ['nar', "Idris rouvre les yeux dans les Archives basses. Sur tous les écrans de la Cité-Miroir, l'Agrégor dresse ses colosses du jour. Il sait maintenant comment on les fend : non en frappant plus fort, mais en refusant le socle."],
    ['nar', "Le courage n'est pas seulement de dégainer. C'est de rengainer quand la vérité l'exige. Une Lumière s'allume sur la Chaîne."],
    ['sfx', 'light'],
    ['light', 'shajaa']
  ],

  /* ───────────────────────────── HÉROS ───────────────────────────── */
  heroes: {
    khalid: {
      name: 'Khâlid', title: 'Le Sabre dégainé', arabic: 'خالد', stratege: true, // dans une bataille déclarée, il ordonne sans perdre son tour
      role: 'guerrier', el: 'shajaa',
      look: { robe: '#7a2f2a', head: '#e9dcc0', cloak: '#8e2f2a', aura: '#ff9a70', coiffe: 'casque_turban', cuirasse: true, manteau: 'epaule', item: 'sabre' },
      skills: [
        { lvl: 1, id: 'charge', name: 'Charge', desc: 'Charge de cavalerie sur une chimère.', cost: 3,
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
      look: { robe: '#3f5a4a', head: '#e6dcc4', cloak: '#2b3a30', aura: '#8fe0a8', coiffe: 'casque', court: true, legs: '#3a3a30', manteau: 'aucun', item: ['sabre', 'bouclier'] },
      skills: [
        { lvl: 1, id: 'estoc', name: 'Estoc', desc: 'Frappe rapide et précise.', cost: 2,
          target: 'foe', el: 'fer', pow: 1.2, anim: 'slash' },
        { lvl: 1, id: 'eclaireur', name: "Œil de l'éclaireur", desc: "Révèle les failles d'une chimère.", cost: 2,
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
      limit: { id: 'vagues', name: 'Vagues de renfort', desc: 'Les cavaliers surgissent par vagues : toutes les chimères vacillent.',
               target: 'foes', el: 'sabr', pow: 1.5, fx: [{ st: 'stun', chance: 0.4 }, { st: 'veil', v: -1 }], anim: 'wave' }
    },
    dirar: {
      name: 'Dirâr', title: 'Ibn al-Azwar', arabic: 'ضرار',
      role: 'guerrier', el: 'shajaa',
      look: { robe: '#c9a25a', head: '#f0e8d8', cloak: '#5a3a22', aura: '#ffb080', trim: '#b5462f', coiffe: 'imama_queue', manteau: 'aucun', court: true, legs: '#6b4a32', echarpe: true, item: 'lance' },
      skills: [
        { lvl: 1, id: 'ruee', name: 'Ruée', desc: "Se jette sur la chimère.", cost: 2,
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
    mirage: { racine: 'insouciance',   // 2.20 : l'aîné de la famille de la ghafla (D210) — rattaché à l'Insouciance, faible aussi devant le Savoir
      name: 'Le Mirage', art: 'wave', hue: 190, scale: 1, lvl: 2, tier: 'minion',
      weak: ['sabr', 'shajaa', 'ilm'], veils: 2,
      skills: [
        { w: 3, name: 'Eau trompeuse', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'doute', turns: 2, chance: 0.3 }], anim: 'wave' },
        { w: 1, name: 'Reculer', target: 'self', fx: [{ st: 'spd', v: 1 }], anim: 'guard' },
        { w: 1, name: 'Toujours plus loin', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' },
        { w: 1, name: '« Il te reste du temps »', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' }
      ],
      taunts: ['Viens. Encore dix pas.'],
      desc: "Né de ce que toute une armée regarde la même eau qui n'existe pas. Il recule quand on avance et détourne de la piste. La patience le dissipe."
    },
    soif: { racine: 'noir_desespoir',
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
      desc: "Chimère du désespoir : cinq jours de gorges sèches lui donnent un corps. Elle ne tue pas, elle persuade de s'asseoir. On la brise en continuant de marcher."
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
    peur_nombre: { racine: 'noir_peur',
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
        { w: 1, name: 'Flatterie', target: 'foe', fx: [{ st: 'doute', turns: 2, chance: 0.5 }], anim: 'glyph' },
        { w: 1, name: 'Redire encore', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }   // 2.20 : le temps volé (D.TEMPS, D210)
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
    idole_heros: { racine: 'ostentation',
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
      text: "Khâlid ibn al-Walîd ibn al-Mughîra, des Banû Makhzûm de Quraysh (qu'Allah l'agrée). Cavalier redouté de La Mecque, il embrasse l'islam en l'an 8 H. À Mu'ta, il ramène l'armée en bon ordre ; le Messager d'Allah ﷺ le nomme alors « un sabre d'entre les sabres d'Allah ». Sous Abû Bakr, il commande à la Yamâma, puis en Irak et au Shâm. Écarté du commandement par 'Umar, il meurt à Homs en 21 H (642).",
      src: "al-Bukhârî ; Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh" },
    { id: 'qaqa_bio', cat: 'Biographie', title: "Al-Qa'qâ' ibn 'Amr",
      text: "Al-Qa'qâ' ibn 'Amr at-Tamîmî (qu'Allah l'agrée), cavalier des Banû Tamîm. Abû Bakr l'envoie en renfort à Khâlid en Irak ; on rapporte qu'il dit de lui : « La voix d'al-Qa'qâ' dans l'armée vaut mieux que mille hommes. » Il suit Khâlid au Shâm, puis s'illustre à al-Qâdisiyya. L'essentiel de ce que l'on sait de lui vient des récits de Sayf ibn 'Umar, repris par at-Tabarî.",
      src: "at-Tabarî, Târîkh (d'après Sayf ibn 'Umar) ; Ibn Hajar, al-Isâba" },
    { id: 'dirar_bio', cat: 'Biographie', title: 'Dirâr ibn al-Azwar',
      text: "Dirâr ibn al-Azwar al-Asadî (qu'Allah l'agrée), Compagnon, cavalier et poète des Banû Asad. Les récits de la conquête du Shâm en font l'un des plus hardis cavaliers de Khâlid. Beaucoup de ses exploits viennent du Futûh ash-Shâm attribué à al-Wâqidî, dont les historiens discutent la fiabilité ; les sources divergent aussi sur le lieu et la date de sa mort.",
      src: "Ibn 'Abd al-Barr, al-Istî'âb ; Ibn Hajar, al-Isâba ; Futûh ash-Shâm (attribué à al-Wâqidî)" },
    { id: 'abu_ubayda_bio', cat: 'Biographie', title: "Abû 'Ubayda ibn al-Jarrâh",
      text: "'Âmir ibn 'Abdallâh ibn al-Jarrâh (qu'Allah l'agrée), l'un des dix à qui le Paradis fut annoncé. Le Messager d'Allah ﷺ a dit : « Chaque communauté a son homme de confiance, et l'homme de confiance de cette communauté est Abû 'Ubayda ibn al-Jarrâh. » 'Umar lui confie les armées du Shâm. Il meurt de la peste d'Emmaüs ('Amwâs) en 18 H, au milieu de ses hommes.",
      src: "al-Bukhârî ; Muslim ; Ibn Sa'd, Tabaqât" },
    { id: 'traversee', cat: 'Événement', title: 'La traversée de la Samâwa',
      text: "En 13 H, Khâlid reçoit l'ordre de porter secours aux armées du Shâm. Pour déboucher derrière les Romains, il coupe par le désert, de Qurâqir à Suwâ : cinq nuits sans point d'eau. Sur le conseil du guide Râfi' ibn 'Umayra at-Tâ'î, on abreuve des chameaux à satiété pour en faire des réserves vivantes. Au cinquième jour, Râfi', qui souffre des yeux, fait chercher un épineux dont il ne reste que la souche ; on creuse à sa racine, et l'eau paraît.",
      src: 'at-Tabarî, Târîkh ; al-Balâdhurî, Futûh al-Buldân' },
    { id: 'yarmouk', cat: 'Événement', title: 'La bataille du Yarmoûk',
      text: "Bataille décisive entre les armées musulmanes et l'armée romaine d'Orient, au bord du Yarmoûk. Khâlid y range les troupes en trente-six à quarante escadrons (karâdîs), ordonnance que les Arabes n'avaient jamais employée. Les chroniques parlent de plus de cent mille Romains ; leurs chiffres varient d'une chronique à l'autre, mais la disproportion demeure. At-Tabarî, d'après Sayf, place la bataille en 13 H ; Ibn Ishâq et al-Wâqidî en 15 H (636), date le plus souvent retenue.",
      src: 'at-Tabarî, Târîkh ; al-Balâdhurî, Futûh al-Buldân ; Ibn Kathîr, al-Bidâya' },
    { id: 'destitution', cat: 'Événement', title: 'Les deux destitutions',
      text: "Khâlid fut écarté deux fois par 'Umar. D'abord du commandement général du Shâm, à l'avènement du Calife (13 H) : selon at-Tabarî, la lettre arrive au Yarmoûk et Khâlid la garde dans son carquois jusqu'à la victoire ; selon d'autres, Abû 'Ubayda la reçoit devant Damas et tarde, par délicatesse, à la montrer. Puis de son gouvernement de Qinnasrîn (17 H), après un don de dix mille dirhams à al-Ash'ath ibn Qays. Interrogé à Homs, il répond que le don vient de son bien, et il obéit.",
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
      text: "Chimères du désespoir. Le Mirage naît quand toute une armée regarde la même eau qui n'existe pas ; la Soif, quand chacun compte en silence les gorgées qui restent. Ils ne tuent pas : ils persuadent de s'asseoir. On les brise par la patience et le courage, en continuant de marcher vers une source qu'on ne voit pas encore." },
    { id: 'idole_nombre', cat: 'Noosphère', title: 'La Peur du Nombre',
      text: "Idole faite de décomptes. Elle se nourrit de chaque regard qui dénombre l'adversaire et de chaque bouche qui répète le total. Elle fait croire que l'issue est une soustraction. Une parole vraie la fend : « Les armées ne sont nombreuses que par la victoire. » Dans la Cité-Miroir, l'Agrégor lui donne d'autres noms : audience, score, majorité." },
    { id: 'idole_heros', cat: 'Noosphère', title: "L'Idole du Héros",
      text: "La plus subtile des chimères : elle prend la silhouette d'un homme de bien. Chaque « avec lui, on ne perd jamais » lui ajoute une couche d'or. Elle ne demande pas qu'on renie Allah ; seulement qu'on oublie de Le nommer. Le fer ne l'entame pas, car elle est faite de victoires. Elle se brise quand le héros lui-même refuse le socle. Le Laurier, louange des poètes, est sa couronne." },
    /* ── v2 : pactes, savoirs, fiction signalée ── */
    { id: 'hira', cat: 'Lieu', title: 'Al-Hîra',
      text: "Sur la rive occidentale de l'Euphrate, al-Hîra fut pendant trois siècles la capitale des rois lakhmides, Arabes alliés de la Perse. Ville de palais et de monastères, peuplée d'Arabes chrétiens que l'on nommait les 'Ibâd. La tradition rapporte que c'est d'al-Hîra et d'al-Anbâr que l'écriture arabe gagna le Hijâz. Après la conquête, Koufa sera fondée à quelques lieues de là.",
      src: 'al-Balâdhurî, Futûh al-Buldân ; at-Tabarî, Târîkh' },
    { id: 'pacte_hira', cat: 'Événement', title: "Le pacte d'al-Hîra",
      text: "En 12 H (633), ses forts cernés, al-Hîra envoie ses notables traiter avec Khâlid. La ville se rend par pacte : elle garde ses églises et ses palais, et verse un tribut annuel dont le montant varie selon les transmetteurs. On rapporte l'entretien de Khâlid avec le doyen 'Amr ibn 'Abd al-Masîh : « Que font là ces forteresses ? — Nous les avons bâties pour l'insensé, afin de le retenir jusqu'à ce que vienne le sage. » Le monastère des Roseaux et son économe sont de fiction.",
      src: "at-Tabarî, Târîkh (d'après Sayf ibn 'Umar) ; al-Balâdhurî, Futûh al-Buldân" },
    { id: 'routes_desert', cat: 'Lieu', title: "Les signes de l'eau",
      text: "Ce que savent les gens du désert et qu'aucune carte ne dit. On marche de nuit et l'on se tait le jour. On abreuve les chameaux deux fois pour en faire des outres vivantes. L'eau cachée se trahit par un épineux ; mais les caravaniers coupent ces arbres pour leurs feux : c'est la souche qu'il faut chercher, et creuser à sa racine. À Suwâ, c'est ainsi que l'eau fut retrouvée.",
      src: 'at-Tabarî, Târîkh (récit de la traversée) ; le feuillet lui-même est de fiction' },
    { id: 'arabes_chretiens', cat: 'Événement', title: 'Les Arabes chrétiens du Shâm',
      text: "Ghassân, Tanûkh, Lakhm, Judhâm, Bahrâ' : des tribus arabes, chrétiennes pour la plupart, gardaient depuis des générations la frontière de Rome. Au Yarmoûk, beaucoup combattent dans les rangs romains, sous le Ghassanide Jabala ibn al-Ayham. On rapporte que la solde de certains de ces alliés n'était plus versée. Après la bataille, bien des clans traitèrent : les uns embrassèrent l'islam, d'autres gardèrent leur foi sous pacte. Wahb ibn Zurayr et son clan sont de fiction.",
      src: 'al-Balâdhurî, Futûh al-Buldân ; at-Tabarî, Târîkh ; la solde : un récit rapporté hors de ces chroniques' },
    { id: 'pacte_damas', cat: 'Événement', title: 'La lettre de sûreté de Damas',
      text: "En 14 H (635), Damas se rend par traité. Al-Balâdhurî transmet le texte attribué à Khâlid : sécurité pour les personnes, les biens et les églises ; l'enceinte ne sera pas démolie ; nul n'occupera les maisons. Les transmetteurs divergent sur le détail (une porte forcée, l'autre ouverte par accord), mais la ville entière fut traitée selon le pacte. Homs, Baalbek et d'autres cités se rendirent ensuite à des conditions voisines. Le Fort des Oliviers et son ancien sont de fiction.",
      src: 'al-Balâdhurî, Futûh al-Buldân' },
    { id: 'homs_impot', cat: 'Événement', title: "L'impôt rendu",
      text: "Avant le Yarmoûk, les armées musulmanes doivent se replier de Homs. On rapporte qu'elles rendirent alors aux habitants le tribut perçu : « Nous ne pouvons plus vous défendre. » Les gens de Homs auraient répondu que ce gouvernement et cette justice leur étaient plus chers que l'état où ils se trouvaient, et ils fermèrent leurs portes à l'armée d'Héraclius.",
      src: 'al-Balâdhurî, Futûh al-Buldân ; Abû Yûsuf, Kitâb al-Kharâj' },
    { id: 'comptes_intendant', cat: 'Noosphère', title: "Le registre de l'intendant",
      text: "Feuillet de fiction. Colonne de gauche : ce que versent les solliciteurs pour approcher l'émir. Colonne de droite : ce que touchent les poètes par vers, et les crieurs par acclamation. Ainsi se fabrique une idole : non par ferveur, mais par commerce. Celui qui tient le registre ne croit pas au héros ; il en vit." },
    { id: 'ghalib', cat: 'Biographie', title: "Ghâlib, l'intendant",
      text: "Personnage de fiction. Intendant du butin dans l'armée de Khâlid, il préfère l'assaut au traité, parce que l'assaut se chante et se partage. Il paie les poètes, fait crier le nom de l'émir dans les rangs et vend l'accès à sa tente. Il n'a jamais dit de mal de Khâlid : c'est sa manière de s'en servir. La tradition nomme hypocrite celui dont la langue sert une chose et le cœur une autre." }
  ],

  /* ──────────────────────────── CHAPITRES ──────────────────────────── */
  chapters: [
    /* ═══ 1. LA TRAVERSÉE ═══ */
    {
      id: 'k1', title: 'La Traversée', sub: 'An 13 H · 634 · Désert de la Samâwa',
      // bataille déclarée : une colonne à tenir dans le désert ; ni charge ni tir
      bataille: { base: 2, rangs: [{ t: 'fantassins', name: 'Hommes de la colonne', voie: 'centre' }, { t: 'cavaliers', name: 'Avant-garde', voie: 'nord' }], ordres: ['tenir', 'avancer', 'replier'] },
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
          talk: [['say', 'messager', "Le Calife a écrit : la moitié des hommes reste avec al-Muthannâ ibn Hâritha pour tenir l'Irak. L'autre moitié est attendue au Shâm comme on attend la pluie."]] },
        { id: 'chamelier', name: 'Chamelier', at: ['caravane', -3, 1], look: { kind: 'bedouin', robe: '#7d6a50', head: '#cfc3a8' },
          talk: [['say', 'chamelier', "On les prive d'eau, puis on les abreuve deux fois, jusqu'à satiété. Ensuite on leur lie le museau. Leur ventre sera notre outre."]] },
        { id: 'bedouin', name: 'Ancien des Kalb', at: ['caravane', 3, 2], look: { kind: 'bedouin', robe: '#4f4a44', head: '#e2d8c4', trim: '#4a6f9a', item: 'baton' },
          talk: [
            ['say', 'bedouin', "Qurâqir est la dernière eau de mon peuple. Au-delà, le vent efface les traces avant le matin."],
            ['ask', "Interroger l'ancien", [
              { t: "Qui est Râfi' ?", r: [['say', 'bedouin', "Un homme des Tayy. Il a fait cette route une fois, enfant, avec son père. Une fois suffit à qui sait regarder."]] },
              { t: "Qu'y a-t-il à Suwâ ?", r: [['say', 'bedouin', "Une eau des Bahrâ'. Et derrière elle, le Shâm, par une porte que les Romains ne gardent pas."]] },
              { t: 'Comment reconnaît-on une eau cachée ?', r: [
                ['say', 'bedouin', "À l'épineux qui boit dessus. Mais retiens ceci, que les guides oublient : les caravaniers coupent ces arbres pour leurs feux. Ne cherche pas l'arbre. Cherche la souche."],
                ['codex', 'routes_desert']] }
            ]]
          ] },
        /* ── an 12 H : le camp devant al-Hîra (ouverture du chapitre) ── */
        { id: 'amr_hira', name: "'Amr ibn 'Abd al-Masîh", map: 'camp', at: 'tente_chef', look: { kind: 'ancien', robe: '#e6dfcf', head: '#f2ecdf', cloak: '#6a5a7a' },
          talk: [['say', 'amr_hira', "J'ai vu passer bien des maîtres sur ce fleuve. Ceux qui sont restés sont ceux qui savaient écrire ce qu'ils promettaient."]] },
        { id: 'econome', name: 'Économe du monastère', map: 'camp', at: ['tente_chef', 3, 1], look: { kind: 'moine', robe: '#4a4038', head: '#4a4038' },
          talk: [['say', 'econome', "J'attendrai que les grands aient fini, émir. Les petits murs passent après les grands."]] },
        { id: 'lettre_hira', name: "Lettré d'al-Hîra", map: 'camp', at: ['feu', 1, 1], look: { kind: 'savant', robe: '#d8d0bc', head: '#efe9da' },
          talk: [
            ['say', 'lettre_hira', "Tu regardes nos palais, émir. Regarde plutôt nos écoles. On rapporte que c'est d'ici, et d'al-Anbâr, que l'écriture des Arabes est partie vers ton Hijâz."],
            ['say', 'lettre_hira', "Les rois lakhmides sont tombés ; leurs scribes sont restés. Une ville qui sait écrire sait aussi tenir un pacte : elle en garde la copie."],
            ['codex', 'hira']] },
        { id: 'ghalib', name: "Ghâlib, l'intendant", map: 'camp', at: ['tentes', 1, 1], look: { kind: 'marchand', robe: '#6a4a2c', head: '#d9c9a8', cloak: '#3a2a1c' },
          talk: [['say', 'ghalib', "J'ai fait compter les échelles, émir. Trois jours, et al-Hîra est à nous, avec ce qu'il y a dedans. Un traité ne remplit ni les sacoches ni les chansons."]] },
        { id: 'priant1', name: 'Homme de la troupe', map: 'camp', at: ['priere', 1, 0], look: { kind: 'soldat', robe: '#5c4c3a', head: '#d9cfb8' },
          talk: [['say', 'priant1', "Midi approche, émir, et les rangs se forment ici. Mon père disait : parle après avoir prié, tu parleras plus bas, et l'on t'écoutera mieux."]] }
      ],
      foes: [
        { id: 'f1', at: 'rochers', group: ['mirage', 'murmure'], bg: 'desert' },
        { id: 'f2', at: 'oasis', group: ['mirage', 'mirage'], bg: 'desert' },
        { id: 'f3', at: 'ruines', group: ['murmure', 'murmure', 'murmure'], bg: 'desert' }
      ],
      chests: [
        { at: ['rochers', 1, 1], gear: 'arc_nab' },
        { at: ['ruines', 1, 1], item: 'dattes', n: 2 },
        { at: ['dunes', 2, -1], item: 'siwak', n: 1 },
        { at: ['ruines', -1, 1], codex: 'routes_desert' },
        { map: 'camp', at: ['tentes', 3, 2], codex: 'hira' }
      ],
      intro: [
        ['title', 'La Traversée', "An 13 de l'Hégire · Désert de la Samâwa"],
        ['nar', "Mais avant le désert, il y eut une ville. La Chaîne remonte d'une année : an 12, sous les murs d'al-Hîra, la cité blanche des anciens rois arabes d'Irak."],
        ['map', 'camp', 'entree', { time: 'day' }],
        ['mus', 'conseil'],
        ['title', 'Al-Hîra', "An 12 de l'Hégire · un an plus tôt"],
        ['nar', "Les forts d'al-Hîra sont cernés. Les échelles sont prêtes, et les hommes aussi. Khâlid fait dire aux notables qu'il les recevra sous sa tente."],
        ['nar', "Une ville forcée n'est qu'un tas de pierres qu'il te faut garder. Une ville qui t'ouvre sa porte est une sentinelle de plus sur ton rempart."]
      ],
      objectives: [
        { text: "Recevoir les notables d'al-Hîra sous la tente", talk: 'amr_hira', then: [
          ['nar', "On rapporte que le doyen des notables, 'Amr ibn 'Abd al-Masîh, s'avança le premier, si vieux qu'on le disait né sous d'autres rois."],
          ['say', 'khalid', 'Êtes-vous des Arabes, ou des gens de cette terre ?'],
          ['say', 'amr_hira', "Des Arabes qui ont pris les usages de la terre, et des gens de la terre qui se sont faits Arabes."],
          ['say', 'khalid', 'Venez-vous pour la paix, ou pour la guerre ?'],
          ['say', 'amr_hira', 'Pour la paix.'],
          ['say', 'khalid', 'Alors que font là ces forteresses ?'],
          ['quote', "Nous les avons bâties pour l'insensé, afin de le retenir jusqu'à ce que vienne le sage qui l'en empêche.", "On rapporte — 'Amr ibn 'Abd al-Masîh à Khâlid, at-Tabarî, Târîkh"],
          ['nar', "Le pacte fut écrit : al-Hîra garde ses églises et ses palais, et verse un tribut dont les chroniques ne donnent pas toutes le même chiffre. Aucune échelle ne fut dressée."],
          ['codex', 'pacte_hira'],
          ['say', 'ghalib', "Un écrit, émir ? Les hommes attendaient autre chose. On ne chante pas un parchemin."],
          ['say', 'khalid', "Alors qu'ils chantent moins, Ghâlib, et qu'ils rentrent tous."],
          ['nar', "Reste un petit mur, hors des grands : le monastère des Roseaux, sur la ligne même du camp. Son économe attend près de la tente, les mains dans ses manches."]
        ] },
        { text: "Entendre l'économe du monastère hors les murs", talk: 'econome', then: [
          ['parley', {
            with: 'econome', title: 'Le monastère des Roseaux',
            intro: "Les moines craignent qu'on loge la troupe chez eux ; l'intendance y voit un grenier tout fait. Ils ont un puits, des livres, et des chameliers qui connaissent l'ouest.",
            goal: 4,
            rounds: [
              { say: "Émir, nos murs n'ont jamais gardé que des livres et un puits. Tes intendants ont déjà mesuré nos greniers.",
                opts: [
                  { t: "Nul ne logera chez vous sans votre gré, et ce qu'on prendra sera payé. Le pacte vaut hors les murs comme dedans.", el: 'adl', v: 2, r: "Payé… Aucune armée ne nous a jamais dit ce mot." },
                  { t: "Vous n'avez rien à craindre de moi.", el: 'rahma', v: 1, r: "De toi, peut-être. Mais tu n'es pas tous tes hommes." },
                  { t: "Une armée a besoin de grain. Mieux vaut me le donner que me le voir prendre.", el: 'shajaa', v: -1, r: "Alors ce n'est pas un pacte que tu proposes. C'est une rançon." }
                ] },
              { say: "On dit que vous méprisez ce qui s'écrit dans une autre langue que la vôtre. Que deviendront nos livres ?",
                opts: [
                  { t: "C'est d'al-Hîra, dit-on, que l'écriture des Arabes est venue au Hijâz. On ne brûle pas l'école où l'on a appris ses lettres.", el: 'ilm', v: 3, need: 'hira', r: "Tu sais cela ? Peu des tiens le savent. Peu des miens, d'ailleurs." },
                  { t: "Un livre est un dépôt. Garde les tiens : je mets un homme sûr à ta porte, et il me répondra de chaque feuillet.", el: 'ilm', v: 2, r: "Un garde qui veille sur des livres au lieu de s'en chauffer… Je demande à voir." },
                  { t: "Je ne lis pas le syriaque. Tes livres ne m'intéressent pas.", el: 'sidq', v: 0, r: "C'est franc. Ce n'est pas rassurant." }
                ] },
              { say: "Tu pars vers l'ouest, m'a-t-on dit. Toi parti, que devrons-nous à celui qui viendra ?",
                opts: [
                  { t: "Ce que dit l'écrit, rien de plus. Si mon successeur vous demande davantage, montrez-lui mon sceau.", el: 'sidq', v: 2, r: "Un homme qui borne lui-même ce qu'on lui doit… Soit." },
                  { t: 'Nous verrons cela à mon retour.', el: 'sabr', v: 1, r: "Ceux qui partent vers l'ouest ne reviennent pas toujours." },
                  { t: 'Priez pour ma victoire : cela suffira.', el: 'rahma', v: -1, r: "Nous prions pour la paix, émir. Ce n'est pas toujours la même chose." }
                ] }
            ],
            win: [
              ['say', 'econome', "Alors notre porte restera ouverte. Prends ceci : l'itinéraire de nos frères qui vont à pied jusqu'au Shâm. Et trois de nos chameliers ; ils savent où l'eau se cache."],
              ['codex', 'routes_desert'], ['give', 'eau', 2],
              ['flag', 'hira_amie'], ['pillar', 'lien', 1],
              ['nar', "Un mur de roseaux et de briques crues, gagné sans une échelle. Les chameliers d'al-Hîra marcheront avec l'armée."]
            ],
            lose: [
              ['say', 'econome', "Je te crois honnête, émir. Mais je ne peux pas confier mes frères à une parole que tes propres hommes n'ont pas entendue."],
              ['nar', "Khâlid interdit tout de même le monastère à la troupe. La porte, elle, resta close : ni guides, ni itinéraire. On ne force pas la confiance ; on la manque, et l'on s'en souvient."],
              ['pillar', 'lien', -1]
            ]
          }],
          ['map', 'desert', 'caravane', { time: 'dusk' }],
          ['mus', 'desert'],
          ['title', 'Qurâqir', "An 13 de l'Hégire · un an plus tard"],
          ['nar', "Al-Hîra est en paix, l'Euphrate est tenu. C'est alors qu'arrive une lettre de Médine : au Shâm, les armées musulmanes font face à la plus grande levée que Rome ait rassemblée."],
          ['quote', "Par Allah, je ferai oublier aux Romains les suggestions du diable par Khâlid ibn al-Walîd.", 'On rapporte d\'Abû Bakr as-Siddîq — at-Tabarî, Târîkh'],
          ['nar', "L'ordre est bref : laisser la moitié de l'armée en Irak, prendre l'autre, et rejoindre le Shâm au plus vite. Au puits de Qurâqir, Khâlid cherche un guide."],
          ['give', 'eau', 2],
          ['give', 'dattes', 3]
        ] },
        { text: "Consulter Râfi' ibn 'Umayra, le guide", talk: 'rafi', then: [
          ['say', 'khalid', "On dit que tu connais un chemin vers le Shâm qui passe derrière les garnisons romaines."],
          ['say', 'rafi', "Je le connais. Mais tu ne le feras pas avec des chevaux et des bagages. Par Allah, le cavalier seul y craint pour sa vie. Cinq nuits pleines, sans une goutte d'eau."],
          ['say', 'qaqa', "La route du nord est sûre, mais longue, et les forts romains la surveillent. Chaque jour perdu, nos frères du Shâm le paient."],
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
          ['ask', 'Les hommes fouillent le pied des buttes. Où porter le regard ?', [
            { t: "Reprendre le pied des buttes, pas à pas, jusqu'à trouver l'arbre.", r: [
              ['nar', "Une heure sous le soleil droit, à chercher un arbre qui n'est plus. Dans les rangs, on recommence à voir de l'eau où il n'y en a pas."],
              ['battle', { group: ['mirage', 'murmure'], bg: 'desert', intro: "La soif gagne les rangs pendant qu'on cherche." }],
              ['say', 'qaqa', "Là. Une souche. On l'a coupé : il n'en reste que la racine."]] },
            { t: 'Envoyer Dirâr au sommet de la butte, pour voir de plus haut.', r: [
              ['say', 'dirar', "D'en haut, rien que du sable. Attends… une tache sombre, au pied de la seconde butte."],
              ['nar', "La montée lui a coûté le peu de salive qui lui restait, et aux rangs une heure de plus. Les murmures de soif montent avec la chaleur."],
              ['battle', { group: ['murmure', 'murmure'], bg: 'desert', intro: 'Les murmures de soif montent avec la chaleur.' }],
              ['say', 'qaqa', "C'est une souche. On a coupé l'arbre : il n'en reste que la racine."]] },
            { t: "Chercher une souche, non un arbre : les caravaniers coupent les épineux pour leurs feux.", need: 'routes_desert', r: [
              ['say', 'qaqa', "Là. Une souche. On l'a coupé : il n'en reste que la racine."],
              ['nar', "Une ligne apprise avant le départ vient d'épargner une heure de soleil à toute une armée. Le savoir ne pèse rien dans les sacoches ; c'est la seule provision qui ne s'épuise pas."],
              ['pillar', 'savoir', 1]] }
          ]],
          ['say', 'rafi', 'Creusez à sa racine.']
        ] },
        { text: "Atteindre la souche de l'épineux", goto: 'source', then: [
          ['tp', 'rafi', ['source', 1, 1]],
          ['tint', '#ffb347'], ['sfx', 'glitch'],
          ['nar', "Mais entre les hommes et la souche, quelque chose se lève. Cinq jours de gorges sèches lui ont donné un corps."],
          ['say', 'La Soif', "Nul homme n'a franchi ces cinq nuits avant toi. Couche-toi. Le sable est doux à qui renonce."],
          ['say', 'khalid', "Je n'ai pas promis d'arriver. J'ai promis de marcher."],
          ['battle', { group: ['soif', 'mirage'], bg: 'desert', boss: true, intro: 'La Soif barre le chemin de la source.',
            allies: [{ flag: 'hira_amie', name: "Les chameliers d'al-Hîra", rang: 'gens' }] }],
          ['tint', null], ['sfx', 'light'],
          ['nar', "On creuse. Le sable devient sombre, puis humide. Puis l'eau monte, froide, entre les doigts."],
          ['say', 'rafi', "Par Allah, je ne suis venu à cette eau qu'une seule fois, enfant, avec mon père."],
          ['nar', "Nul ne but avant que les bêtes et les blessés aient bu. Puis le soleil toucha le sable ; ils firent leurs ablutions à l'eau retrouvée, et se rangèrent."],
          ['pray', 'maghrib'],
          ['nar', "Le puits ne vaut pas par l'eau qu'il garde, mais par la marche qu'il ordonne. Ôte-le, et la caravane n'est plus qu'une soif qui tourne en rond."],
          ['quote', "Qu'ils sont bénis, les yeux de Râfi' : comme il a su trouver sa route ! De Qurâqir à Suwâ il a coupé le désert — cinq nuits où le lâche, s'il s'y engage, pleure.", "Vers d'un homme de l'armée — at-Tabarî, Târîkh"]
        ] }
      ],
      outro: [
        ['codex', 'traversee'],
        ['nar', "Au sixième matin, l'armée de Khâlid sort du désert à Suwâ, sur les arrières des Romains, là où aucune sentinelle ne regardait. Le Shâm apprend son nom en une seule aube."],
        ['nar', "Dans la noosphère, une paillette d'or de plus. Les hommes disent déjà : « Avec lui, même le désert s'ouvre. »"]
      ]
    },

    /* ═══ 2. YARMOÛK ═══ */
    {
      id: 'k2', title: 'Yarmoûk', sub: 'An 13 ou 15 H · 634–636 · Vallée du Yarmoûk',
      // bataille déclarée : les trois armes. Aucun effectif n'est donné ; en face, les nuées de la Peur du Nombre.
      bataille: { base: 3, rangs: [{ t: 'fantassins', name: 'Fantassins du centre', voie: 'centre' }, { t: 'cavaliers', name: 'Cavaliers de réserve', voie: 'centre', ligne: 0 }, { t: 'archers', name: 'Archers', voie: 'sud' }, { t: 'fantassins', name: 'Fantassins de l’aile', voie: 'nord' }] },
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
          talk: [['say', 'jeune', "Mon père disait : celui qui compte ses adversaires a déjà perdu la moitié de son bras. Je m'efforce de regarder le feu."]] },
        { id: 'wahb', name: 'Wahb ibn Zurayr', at: ['etendard', -2, -1], hidden: true, look: { kind: 'bedouin', robe: '#3f4f6a', head: '#d8d2c2', cloak: '#26303f', trim: '#8a5fb0' },
          talk: [['say', 'wahb', "Je garderai le gué ou je ne le garderai pas. Mais je n'oublierai pas qu'on m'a parlé avant de me frapper."]] },
        { id: 'ermite', name: 'Ermite du ravin', at: ['tertre', -2, 1], look: { kind: 'moine', robe: '#4a4038', head: '#4a4038' },
          talk: [
            ['say', 'ermite', "Ma grotte est entre vos deux camps ; vos blessés me l'ont prise, et m'ont donné du pain. Tu veux savoir qui campe en face ? Des Arabes comme toi, pour beaucoup : Ghassân, Tanûkh, Lakhm."],
            ['say', 'ermite', "Ils gardent la frontière de César depuis leurs grands-pères. Mais César ne paie plus leur solde, dit-on ; et un serment qu'un seul des deux tient encore pèse lourd à porter."],
            ['codex', 'arabes_chretiens']] },
        { id: 'ghalib', name: "Ghâlib, l'intendant", at: ['feu', -1, -1], look: { kind: 'marchand', robe: '#6a4a2c', head: '#d9c9a8', cloak: '#3a2a1c' },
          talk: [['say', 'ghalib', "J'ai fait passer le mot de feu en feu, émir : « Avec Khâlid, on ne perd jamais. » Cela vaut mille lances, et cela ne coûte que quelques poètes."]] },
        { id: 'qari', name: 'Récitant', at: ['priere', 1, 0], look: { kind: 'savant', robe: '#d8d0bc', head: '#efe9da' },
          talk: [['say', 'qari', "Ce soir on récite la sourate al-Anfâl devant chaque escadron, comme c'est l'usage depuis Badr. Viens prier la nuit avec nous, émir, avant de parler à qui que ce soit."]] }
      ],
      foes: [
        { id: 'f1', at: ['feu', -2, 1], group: ['decompte', 'decompte'], bg: 'camp' },
        { id: 'f2', at: 'enclos', group: ['decompte', 'ombre_lance'], bg: 'camp' },
        { id: 'f3', map: 'noos', at: 'noeud2', group: ['ombre_lance', 'decompte', 'ombre_lance'], bg: 'noos' },
        { id: 'f4', map: 'noos', at: 'faille', group: ['decompte', 'decompte', 'decompte'], bg: 'noos' }
      ],
      chests: [
        { at: ['lignes', 1, 1], gear: 'lance_khatt' },
        { at: ['tentes', 2, 0], item: 'pain', n: 2 },
        { at: ['etendard', -1, 1], item: 'musc', n: 1 },
        { map: 'noos', at: 'miroir', item: 'lait', n: 1 }
      ],
      intro: [
        ['title', 'Yarmoûk', 'La veillée des émirs'],
        ['nar', "Les émirs du Shâm ont réuni leurs armées au bord du Yarmoûk. En face, la plaine est couverte de tentes romaines. Les transmetteurs divergent sur l'année ; la Chaîne suit ici le récit d'at-Tabarî."],
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
          ['pillar', 'lien', 1],
          ['say', 'abu_ubayda', "Une chose encore. Un chef des Arabes d'en face a demandé la sauvegarde pour te parler. Il attend sous l'étendard. Ce sont des hommes de notre langue : ne prenons pas par le fer ce que la parole peut obtenir."],
          ['show', 'wahb']
        ] },
        { text: "Entendre le chef des Banû Zurayr, sous l'étendard", talk: 'wahb', then: [
          ['mus', 'conseil'],
          ['nar', "Un homme en manteau sombre, une croix de bois au cou, la main loin de la garde. Les Banû Zurayr tiennent le gué du ravin, sur le flanc des Romains. Demain, ce gué décidera de bien des vies."],
          ['parley', {
            with: 'wahb', title: 'Le gué des Banû Zurayr',
            intro: "Wahb a juré à César comme son père et son grand-père. Il craint pour ses églises, ses troupeaux, et pour l'honneur de ses jeunes gens. Il ne veut pas trahir ; il veut savoir à qui il parle.",
            goal: 6,
            rounds: [
              { say: "Je suis venu parce que nous parlons la même langue. Mais mes pères ont juré à César. Pourquoi romprais-je un serment ?",
                opts: [
                  { t: "César ne paie plus la solde des siens. On me l'a dit : tes cavaliers gardent ses routes à crédit.", el: 'ilm', v: 3, need: 'arabes_chretiens', r: "Deux ans qu'elle n'est pas venue. Tu es bien renseigné, pour un homme du désert." },
                  { t: "Un serment oblige tant que celui qui l'a reçu tient le sien. César tient-il le sien envers toi ?", el: 'adl', v: 2, r: "C'est une question que je me pose la nuit. Je n'aime pas qu'un autre me la pose." },
                  { t: "Parce que demain César aura perdu, et qu'il vaut mieux se trouver du côté du vainqueur.", el: 'shajaa', v: -1, r: "Voilà ce que dirait un marchand. Je croyais parler à un homme d'armes." }
                ] },
              { say: "Si je m'écarte, que deviennent mes églises, mes morts, mes troupeaux ? Vos poètes chantent que vous prenez tout.",
                opts: [
                  { t: "À al-Hîra, des Arabes chrétiens ont traité avec moi. Leurs églises sont debout, leurs palais aussi. Envoie un homme le leur demander.", el: 'sidq', v: 3, need: 'pacte_hira', r: "J'ai des cousins à al-Hîra. Je saurai avant l'hiver si tu mens." },
                  { t: "Qui traite avec nous garde sa foi, ses biens et ses lieux de prière. C'est écrit et scellé, non chanté.", el: 'adl', v: 2, r: "Un écrit vaut mieux qu'une chanson. Continue." },
                  { t: "Je te promets davantage : des terres et des troupeaux pris à César.", el: 'rahma', v: -1, r: "Tu promets ce que tu n'as pas. Les Romains promettaient aussi." }
                ] },
              { say: "Mes jeunes gens veulent se battre. Si je leur dis de rester sous la tente, ils me diront lâche.",
                opts: [
                  { t: "Dis-leur qu'il faut plus de cœur pour retenir un cheval que pour le lancer. Qu'ils gardent le gué : nul ne blâme un homme de garder son eau.", el: 'sabr', v: 2, r: "Garder le gué… Cela, ils l'entendront." },
                  { t: "S'il leur faut une bataille, qu'ils viennent la livrer à nos côtés.", el: 'shajaa', v: 1, r: "Contre leurs cousins de Ghassân ? Tu demandes trop, et trop vite." },
                  { t: "Leur avis importe peu : c'est toi le chef.", el: 'sidq', v: -2, r: "On voit que tu n'as jamais commandé à des hommes libres de s'en aller." }
                ] },
              { say: "Et toi, Khâlid ? On dit que tu ne perds jamais. Est-ce à toi que je dois me fier ?",
                opts: [
                  { t: "Ne te fie pas à moi. Je suis un homme, et demain un autre peut commander. Fie-toi au pacte : il ne porte pas mon nom.", el: 'sidq', v: 2, r: "C'est la première parole que j'entends, dans cette guerre, qui ne soit pas de l'orgueil." },
                  { t: "Abû 'Ubayda scellera avec moi. Deux sceaux, et le Calife derrière eux.", el: 'adl', v: 1, r: "Deux sceaux valent mieux qu'un. Mais je ne connais que toi." },
                  { t: "Oui. Tant que je commande, nul ne touchera aux tiens.", el: 'shajaa', v: 0, r: "Et le jour où tu ne commanderas plus ?" }
                ] }
            ],
            win: [
              ['say', 'wahb', "Alors écoute. Demain, les Banû Zurayr garderont leur gué, et rien d'autre. Et mes éclaireurs montreront aux tiens les sentes du ravin. Je ne trahis pas César : je cesse de mourir pour lui."],
              ['flag', 'zurayr_ecart'], ['pillar', 'lien', 1],
              ['nar', "Aucun sabre n'a quitté son fourreau, et le flanc romain vient de perdre un gué. Ce que Khâlid a gagné cette nuit-là, aucun poète ne le chantera : il n'y a rien à voir."]
            ],
            lose: [
              ['say', 'wahb', "Tu parles bien, mais tu parles comme un vainqueur, et je ne remets pas mes morts à un vainqueur. Demain, je serai où mon serment me place."],
              ['pillar', 'lien', -1],
              ['nar', "Il repart sous sa sauvegarde, et nul ne le retient. La parole a été tentée ; elle n'a pas suffi. Demain, il y aura des lances de plus dans la forêt."]
            ]
          }],
          ['hide', 'wahb'],
          ['mus', 'camp'],
          ['show', 'courrier'],
          ['say', 'qaqa', "Émir, un cavalier à l'entrée du camp. Il vient de Médine et ne veut parler qu'à toi."]
        ] },
        { text: 'Aller au-devant du cavalier venu de Médine', goto: 'entree', then: [
          ['say', 'courrier', "Émir, je porte deux nouvelles et une lettre. Abû Bakr as-Siddîq est retourné à son Seigneur. 'Umar ibn al-Khattâb est le Commandeur des croyants."],
          ['nar', "Khâlid se tait longtemps. Puis il brise le sceau. La lettre confie à Abû 'Ubayda le commandement des armées du Shâm. Le sien lui est retiré."],
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
          ['nar', "Avant le jour, chaque émir range les siens pour la prière. Khâlid prie dans le rang, l'épaule contre celle d'un homme dont il ne sait pas le nom."],
          ['pray', 'fajr'],
          ['sfx', 'roll'],
          ['nar', "L'aube. En face, les rangs romains s'ébranlent, enseignes levées, dans un grondement qui fait trembler l'eau des gourdes."],
          ['nar', "Et dans la noosphère, la peur de tous ceux qui ont compté les feux se lève d'un bloc. Tant qu'elle tiendra debout, aucun escadron ne tiendra."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 270 }],
          ['say', 'dirar', "Des lances jusqu'au bout du regard. Et pas un seul bras pour les tenir."]
        ] },
        { text: 'Fendre la forêt de lances qui garde le passage', foe: 'f3', then: [
          ['nar', "Les lances n'étaient que des chiffres dressés. Derrière elles, le cœur du nœud bat comme un tambour de guerre."]
        ] },
        { text: 'Atteindre le cœur, où se tient la Peur du Nombre', goto: 'coeur', then: [
          ['say', 'La Peur du Nombre', 'Regarde l\'horizon, Khâlid. Compte avec moi : un, deux, trois… Tu n\'auras pas fini avant la nuit.'],
          ['say', 'khalid', "Les armées ne sont nombreuses que par la victoire. Tu n'es qu'un chiffre qui a pris peur de lui-même."],
          ['if', 'zurayr_ecart',
            [['battle', { group: ['decompte', 'peur_nombre', 'decompte'], bg: 'noos', boss: true, intro: 'La Peur du Nombre déploie ses mille lances. Mais un gué, sur son flanc, ne compte plus pour elle.',
              allies: [{ flag: 'zurayr_ecart', name: 'Les éclaireurs des Banû Zurayr', rang: 'cavaliers' }] }]],
            [['battle', { group: ['decompte', 'peur_nombre', 'decompte', 'ombre_lance'], bg: 'noos', boss: true, intro: 'La Peur du Nombre déploie ses mille lances, et celles du gué avec elles.' }]]],
          ['sfx', 'break'], ['flash', '#ffffff'],
          ['map', 'camp', 'tente_chef', { time: 'dusk' }],
          ['mus', 'deuil'],
          ['nar', "La bataille fut longue et rude ; les chroniques en gardent le fracas. Au plus fort de la mêlée, 'Ikrima ibn Abî Jahl et quatre cents hommes firent serment de ne pas reculer. La cavalerie de Khâlid sépara les cavaliers romains de leur infanterie, et la plaine bascula."],
          ['if', 'zurayr_ecart',
            [['nar', "Les Banû Zurayr gardèrent leur gué tout le jour, et rien d'autre. Au soir, leurs tentes étaient pleines, et pas une lance de Khâlid n'avait eu à les chercher."]],
            [['nar', "Les Banû Zurayr chargèrent avec Ghassân, comme leur serment le voulait. Beaucoup ne revirent pas leurs tentes. Khâlid fit rendre leurs morts à Wahb, sans rançon."]]],
          ['nar', "On rapporte qu'au soir, on porta de l'eau à un blessé. Il désigna son voisin : « Lui d'abord. » Le voisin désigna un troisième. Quand l'outre revint au premier, tous trois étaient morts sans avoir bu."],
          ['say', 'dirar', "Nous avons traversé cinq nuits pour de l'eau. Eux l'ont tenue dans leurs mains, et ils l'ont donnée."],
          ['nar', "Alors seulement, Khâlid tire la lettre de son carquois et la tend à Abû 'Ubayda."],
          ['say', 'khalid', "Le Commandeur des croyants t'a confié le Shâm. Je suis sous tes ordres."],
          ['pillar', 'justice', 1],
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
      // bataille déclarée, sans rangs : il n'a plus d'armée à mener
      bataille: { rangs: [], mot: 'Il n’y a pas de rangs à mener ici. L’armée est restée derrière lui : ce combat-là est le sien.' },
      map: 'romaine', opts: { time: 'day' }, start: 'palais',
      party: ['khalid', 'qaqa', 'dirar'],
      npcs: [
        { id: 'poete', name: 'Un poète', at: ['forum', 1, 0], look: { kind: 'homme', robe: '#7c4f6a', head: '#e9dfc8' },
          talk: [['say', 'poete', 'Mes vers courront plus vite que tes chevaux, émir. Demain on les chantera jusqu\'en Irak.']] },
        { id: 'soldat', name: 'Soldat de Khâlid', at: ['marche', 2, 1], look: { kind: 'soldat', robe: '#5f4a36', head: '#d6cab2' },
          talk: [['say', 'soldat', 'Avec Khâlid, on ne perd jamais. Tout le monde le sait. Même les Romains le savent.']] },
        { id: 'marchand', name: 'Marchand de Homs', at: ['fontaine', 1, 0], look: { kind: 'romain', robe: '#8a8fa3', head: '#cfc6b4' },
          talk: [['say', 'marchand', "Quand vos armées ont dû quitter Homs, avant le Yarmoûk, elles nous ont rendu l'impôt : « Nous ne pouvons plus vous protéger. » Aucun empire ne nous avait jamais rendu une pièce."],
            ['codex', 'homs_impot']] },
        { id: 'ancien_bourg', name: 'Ancien du Fort des Oliviers', at: ['palais', 2, 2], look: { kind: 'romain', robe: '#7d7466', head: '#d6cdbb' },
          talk: [['if', 'oliviers_pacte',
            [['say', 'ancien_bourg', "Nos portes sont ouvertes, émir. Je monterai chaque soir vérifier qu'elles le sont encore, et chaque soir je m'en étonnerai."]],
            [['say', 'ancien_bourg', "Nous attendrons, émir. Les murs savent attendre ; c'est même tout ce qu'ils savent."]]]] },
        { id: 'scribe', name: 'Scribe du dîwân', at: ['palais', -2, 1], look: { kind: 'savant', robe: '#d8d0bc', head: '#efe9da' },
          talk: [
            ['say', 'scribe', "J'ai recopié de ma main la lettre de sûreté que tu donnas à Damas, émir. Les délégués des bourgs me la demandent avant même de te saluer."],
            ['quote', "Voici ce que Khâlid ibn al-Walîd accorde aux habitants de Damas s'il y entre : la sécurité pour leurs personnes, leurs biens et leurs églises. L'enceinte de leur ville ne sera pas démolie, et nul n'occupera leurs maisons. Tant qu'ils s'acquittent du tribut, il ne leur sera fait que du bien.", 'al-Balâdhurî, Futûh al-Buldân — traduction du sens, abrégée'],
            ['codex', 'pacte_damas']] },
        { id: 'ghalib', name: "Ghâlib, l'intendant", at: ['forum', -2, 1], look: { kind: 'marchand', robe: '#6a4a2c', head: '#d9c9a8', cloak: '#3a2a1c' },
          talk: [['say', 'ghalib', "Les solliciteurs font la queue jusqu'à la fontaine, émir. Ne t'occupe de rien : je trie, j'ordonne, je fais patienter. C'est mon office."]] },
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
        { at: ['marche', 1, 1], gear: 'epee_inde' },
        { at: ['palais', 1, 1], item: 'eau', n: 2 },
        { at: ['jardin', 1, 0], item: 'miel', n: 1 },
        { at: ['fontaine', 2, 0], codex: 'comptes_intendant' },
        { map: 'noos', at: 'miroir', item: 'musc', n: 2 }
      ],
      intro: [
        ['title', "L'Épée au fourreau", "An 17 de l'Hégire · Qinnasrîn"],
        ['nar', "Quatre ans ont passé. Le Shâm est ouvert, d'Antioche à Jérusalem. Khâlid gouverne Qinnasrîn sous l'autorité d'Abû 'Ubayda. Il revient d'une expédition heureuse, chargé de butin."],
        ['nar', "Les gens affluent vers lui de toutes parts : solliciteurs, poètes, curieux. On vient voir l'homme qui ne perd jamais. On repart en racontant qu'on l'a vu."],
        ['nar', "Ce matin, pourtant, un homme l'attend qui ne vient pas l'admirer : l'ancien d'un bourg fortifié du district, le Fort des Oliviers, dont les portes sont closes depuis l'hiver."]
      ],
      objectives: [
        { text: 'Recevoir le délégué du Fort des Oliviers, devant le palais', talk: 'ancien_bourg', then: [
          ['mus', 'conseil'],
          ['say', 'ghalib', "Émir, ne perds pas ta matinée. Trois jours d'échelles, et ce bourg est à nous. Les hommes n'ont pas eu d'assaut depuis des mois ; les poètes non plus."],
          ['say', 'khalid', "Les hommes n'ont pas eu de morts depuis des mois, Ghâlib. Je ne les ai pas entendus s'en plaindre."],
          ['parley', {
            with: 'ancien_bourg', title: 'Le Fort des Oliviers',
            intro: "Le bourg a déjà été brûlé une fois, par les Perses. Son ancien craint le tribut, l'appétit des officiers, et la parole d'un capitaine qu'un mot de Médine peut défaire.",
            goal: 6,
            rounds: [
              { say: "Mes pères ont fermé ces portes devant les Perses, il y a vingt-cinq ans. Pourquoi les ouvrirais-je devant toi ?",
                opts: [
                  { t: "Parce que je l'ai déjà écrit pour Damas : vos vies, vos biens, vos églises ; vos murs debout ; nul soldat logé chez vous. Damas est debout.", el: 'ilm', v: 3, need: 'pacte_damas', r: "J'ai des parents à Damas. Ils m'ont écrit la même chose. Je voulais l'entendre de ta bouche." },
                  { t: "Parce que je ne te demande pas tes portes : je te propose un écrit. Vos vies, vos biens, vos églises, contre le tribut, et rien au-delà.", el: 'adl', v: 2, r: "Un écrit… Les Perses, eux, n'écrivaient rien." },
                  { t: 'Parce que tes murs ne tiendront pas trois jours, et tu le sais.', el: 'shajaa', v: -1, r: "Ils ont tenu trois mois contre les Perses. Tu connais mal mes murs." }
                ] },
              { say: "Le tribut. Rome nous taxait déjà, et ne nous défendait plus. Que ferez-vous de notre argent ?",
                noir: { name: "Le Soupçon", group: ['noir_soupcon'], intro: "L'ancien écoute, et derrière chaque mot il entend ceux d'avant : d'autres aussi avaient promis. Le bourg a déjà brûlé une fois.", after: "Tu n'es pas ceux d'avant. Je veux bien l'entendre. Continue." },
                opts: [
                  { t: "Il paie votre défense. Demande aux gens de Homs : le jour où nous n'avons plus pu les défendre, nous le leur avons rendu.", el: 'sidq', v: 3, need: 'homs_impot', r: "On me l'avait raconté. Je croyais à une fable de marchands." },
                  { t: "Il paie votre défense, et rien d'autre. Ni tes champs ni ta maison ne changent de maître.", el: 'adl', v: 2, r: "Rome disait « défense » aussi. Mais Rome ne venait plus." },
                  { t: 'Moins que César ne vous en prenait.', el: 'rahma', v: 0, r: "C'est ce que dit chaque nouveau maître, la première année." }
                ] },
              { say: "Tes officiers, derrière toi, comptent mes greniers des yeux. Lequel commande ici : toi, ou leur appétit ?",
                opts: [
                  { t: "Moi. Et le premier qui passe ta porte sans mon sceau en répondra devant l'armée entière.", el: 'shajaa', v: 2, r: "Tu parles haut. J'ai vu tes hommes t'obéir : je te crois." },
                  { t: "Laisse-moi trois jours pour les éloigner d'ici.", el: 'sabr', v: 1, r: "Trois jours, c'est long pour une porte qui hésite." },
                  { t: 'Ils ont gagné leur part. Un soldat se paie.', el: 'sidq', v: -2, r: "Alors c'est bien une rançon. Nous resterons fermés." }
                ] },
              { say: "Une dernière chose. On dit que le Calife de Médine défait d'un mot ce que font ses capitaines. Et si demain tu n'es plus là ?",
                opts: [
                  { t: "Alors l'écrit y sera encore. Je ne signe pas en mon nom : je signe pour ceux qui viendront après moi.", el: 'sidq', v: 2, r: "Voilà pourquoi j'ouvrirai. Un homme qui se sait remplaçable ne ment pas pour sa gloire." },
                  { t: "Abû 'Ubayda scellera après moi : c'est lui, l'émir du Shâm.", el: 'adl', v: 1, r: "Deux sceaux valent mieux qu'un." },
                  { t: 'Je serai là. On ne remplace pas Khâlid.', el: 'shajaa', v: 0, r: "C'est ce que disent tes poètes. Les murs de Damas, eux, ne disent rien : ils sont debout." }
                ] }
            ],
            win: [
              ['say', 'ancien_bourg', "Fais écrire, émir. Ce soir, les portes du Fort des Oliviers seront ouvertes, et je dormirai pour la première fois depuis l'hiver."],
              ['flag', 'oliviers_pacte'], ['pillar', 'lien', 1], ['pillar', 'justice', 1],
              ['nar', "Un bourg entier entre dans la paix sans qu'une seule maison ait à compter ses morts. Ghâlib, lui, compte autre chose, et fait la moue."]
            ],
            lose: [
              ['say', 'ancien_bourg', "Tu es peut-être juste, émir. Mais j'entends tes officiers plus fort que toi. Nous resterons fermés."],
              ['say', 'ghalib', "Tu vois, émir ? Les échelles sont prêtes."],
              ['say', 'khalid', "Range-les. Pas d'assaut : on tiendra les routes, et l'on attendra."],
              ['nar', "Mais dans les rangs, l'envie d'assaut que Ghâlib a nourrie a déjà pris corps. Avant de bloquer un bourg, il faut faire taire ceux qui chantent sa prise."],
              ['battle', { group: ['echo', 'echo'], bg: 'romaine', intro: "« À l'assaut ! Khâlid ! Khâlid ! » Les échos réclament leur chanson." }],
              ['pillar', 'lien', -1],
              ['nar', "Le Fort des Oliviers ouvrit au onzième jour de blocus, sans assaut, aux conditions de Damas. Mais onze jours de faim laissent dans un bourg une mémoire que nul écrit n'efface."]
            ]
          }],
          ['mus', 'rome'],
          ['nar', "L'ancien reparti, la foule du matin reflue vers le forum. On y attend Khâlid comme on attend un spectacle."]
        ] },
        { text: "Traverser Qinnasrîn jusqu'au forum", goto: 'forum', then: [
          ['say', 'poete', "Voici celui devant qui les forteresses ouvrent leurs portes ! Celui dont le nom marche devant lui comme une avant-garde !"],
          ['nar', "La foule reprend. Khâlid écoute. Il est généreux de nature : à un solliciteur de marque, il fait compter dix mille dirhams, pris sur sa part."],
          ['say', 'qaqa', 'Émir… Dix mille. Cela se saura à Médine avant la fin du mois.'],
          ['say', 'Des soldats', 'Avec Khâlid, on ne perd jamais !'],
          ['say', 'ghalib', "Tu entends, émir ? Voilà ce que valent quatre ans de victoires. Laisse-moi faire : demain, ce cri-là s'entendra jusqu'à Médine."],
          ['ask', "Que répond Khâlid à son intendant ?", [
            { t: "Lui ordonner de faire taire les poètes.", r: [
              ['say', 'ghalib', "Faire taire la reconnaissance d'un peuple ? J'obéirai, émir. Mais elle parlera plus fort demain : c'est le propre de ce qu'on interdit."],
              ['nar', "Il s'incline très bas. Un homme qui s'incline si bas a toujours quelque chose à cacher sous son manteau."]] },
            { t: "Le remercier : il sert bien l'armée.", r: [
              ['say', 'ghalib', "Je ne sers que toi, émir. Toi seul."],
              ['nar', "C'est précisément ce qui aurait dû l'inquiéter. Mais on n'examine pas volontiers la main qui vous dresse une statue."]] },
            { t: "Lire à voix haute son registre : tant par vers, tant par acclamation, tant pour approcher l'émir.", need: 'comptes_intendant', r: [
              ['say', 'khalid', "« Au poète, pour vingt vers : deux cents dirhams. Aux crieurs du forum : cinquante. Reçu de trois solliciteurs, pour une audience : mille. » C'est ton écriture, Ghâlib."],
              ['say', 'ghalib', "Émir… C'est pour ta gloire que je…"],
              ['say', 'khalid', "Non. C'est pour ta bourse, et tu la remplissais de mon nom. Tu rendras tes comptes à Abû 'Ubayda. Devant tous."],
              ['nar', "Dans les rangs, quelques acclamations s'éteignent, comme des lampes qu'on ne paie plus. Pas toutes : certaines étaient sincères, et celles-là sont les plus lourdes à porter."],
              ['flag', 'ghalib_demasque'], ['pillar', 'justice', 1], ['hide', 'ghalib']] }
          ]],
          ['nar', "Chaque acclamation, dans la noosphère, est un coup de ciseau sur un bloc d'or. Au marché, les échos de louange ont pris corps : ils répètent son nom tout seuls."]
        ] },
        { text: 'Faire taire les échos de louange au marché', foe: 'f1', then: [
          ['nar', "Les échos se dispersent — et reviennent aussitôt, un peu plus loin. On ne fait pas taire une louange à coups de sabre. Khâlid regarde sa lame ; pour la première fois, elle lui semble inutile."],
          ['show', 'estafette'],
          ['say', 'estafette', "Émir, Abû 'Ubayda te demande à Homs. Un envoyé du Commandeur des croyants est arrivé de Médine."],
          ['fade', 'out'],
          ['hide', 'poete'], ['hide', 'soldat'], ['hide', 'estafette'], ['hide', 'ancien_bourg'], ['hide', 'scribe'], ['hide', 'ghalib'],
          ['show', 'abu_ubayda'], ['show', 'bilal'],
          ['map', 'romaine', 'porte', { time: 'dusk' }],
          ['hide', 'poete'], ['hide', 'soldat'], ['hide', 'estafette'], ['hide', 'ancien_bourg'], ['hide', 'scribe'], ['hide', 'ghalib'],
          ['show', 'abu_ubayda'], ['show', 'bilal'],
          ['title', 'Homs', "L'armée est assemblée sur l'esplanade"],
          ['fade', 'in'],
        ] },
        { text: "Se présenter devant Abû 'Ubayda, sur l'esplanade", talk: 'abu_ubayda', then: [
          ['nar', "L'armée est rassemblée. Abû 'Ubayda est monté en chaire, et il se tait : l'ordre qu'il a reçu lui pèse. C'est Bilâl, l'envoyé du Calife, qui se lève."],
          ['say', 'bilal', "Le Commandeur des croyants ordonne que Khâlid soit interrogé devant tous, tête nue, les mains liées de son propre turban, jusqu'à ce qu'il ait répondu."],
          ['nar', "Un grondement parcourt les rangs. Des mains vont aux gardes des sabres. Un mot de Khâlid, un seul, et cette armée est à lui."],
          ['choice', "Bilâl s'avance vers lui. Que fait Khâlid ?", [
            { t: 'Refuser devant ses hommes : « On ne lie pas les mains qui ont ouvert le Shâm. »', r: [
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
          ['mus', 'deuil'],
          ['nar', "L'appel du couchant monte sur Homs. Khâlid, les poignets encore marqués par son propre turban, prend place dans le rang, derrière Abû 'Ubayda. Ni devant, ni à l'écart : dans le rang."],
          ['pray', 'maghrib'],
          ['nar', "Le sabre n'est beau qu'au fourreau de celui qui saurait le tirer. Qui ne sait que dégainer n'est pas un homme d'armes : c'est une arme, et d'autres mains la tiennent."],
          ['nar', "Khâlid a obéi. Mais dans les rangs, la colère enfle : « Ils ont osé. Lui ! » Et cette colère-là ne monte pas vers Allah. Elle monte vers un socle."],
          ['sfx', 'glitch'], ['shake', 500],
          ['map', 'noos', 'seuil', { hue: 48 }],
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
          ['battle', { group: ['idole_heros'], bg: 'noos', boss: true, intro: "Le fer ne l'entame pas. Seules la patience et la vérité fendent l'or.",
            allies: [{ flag: 'ghalib_demasque', name: 'Les rangs détrompés' }] }],
          ['flash', '#fff2c0'], ['sfx', 'break'],
          ['say', "L'Idole du Héros", 'Sans moi… qui se souviendra… de toi ?'],
          ['say', 'khalid', "Celui qui n'oublie rien me suffit."],
          ['nar', "Le colosse se fend du sommet au socle. Dedans, il n'y a rien : pas même un homme. Seulement le creux où d'autres avaient versé leur confiance."],
          ['map', 'romaine', 'porte', { time: 'dawn' }],
          ['hide', 'poete'], ['hide', 'soldat'], ['hide', 'estafette'], ['hide', 'ancien_bourg'], ['hide', 'scribe'], ['hide', 'ghalib'],
          ['mus', 'espoir'],
          ['nar', "Avant de monter en selle, il prie l'aube avec ceux qui restent. Personne ne l'acclame ; quelqu'un lui tient son étrier."],
          ['pray', 'fajr'],
          ['nar', "Khâlid prend la route de Médine. 'Umar l'y reçoit, examine ses comptes, et le trouve intègre. Puis le Calife écrit aux provinces."],
          ['quote', "Je n'ai pas destitué Khâlid par mécontentement ni pour trahison ; mais les gens ont été éblouis par lui, et j'ai craint qu'ils ne s'en remettent à lui. J'ai voulu qu'ils sachent que c'est Allah qui agit.", "'Umar ibn al-Khattâb, lettre aux provinces — at-Tabarî, Târîkh"]
        ] }
      ],
      outro: [
        ['codex', 'parole_umar'], ['codex', 'idole_heros'], ['codex', 'ghalib'],
        ['if', 'ghalib_demasque',
          [['nar', "Ghâlib rendit ses comptes devant l'armée, et fut renvoyé sans autre peine que la honte. Il n'avait volé personne : il avait vendu un nom. Aucune loi ne le punissait ; il fallut le savoir pour le voir."]],
          [['nar', "Ghâlib, lui, ne fut jamais inquiété. Il trouva un autre capitaine à louer : il y en a toujours un. Les idoles ont des intendants que la chute des idoles ne ruine pas."]]],
        ['nar', "Les armées continuèrent de vaincre sans lui. C'était la preuve que 'Umar cherchait — et peut-être celle dont Khâlid lui-même avait besoin."],
        ['say', 'dirar', "Émir… que ferons-nous, à présent ?"],
        ['say', 'khalid', "Ce que nous faisions avant qu'on nous regarde."]
      ]
    }
  ]
});
