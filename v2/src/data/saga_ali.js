/* ISNAD — Saga V : 'Alî ibn Abî Tâlib, la Porte du Savoir.
   Sources principales : Ibn Sa'd (Tabaqât), at-Tabarî (Târîkh), Ibn Kathîr (al-Bidâya), Muslim, al-Bukhârî,
   an-Nasâ'î (as-Sunan al-Kubrâ), Ibn Abî Shayba (al-Musannaf). Dialogues ordinaires dramatisés.
   v2 : la parole avant le fer. Trois pourparlers, haltes de prière, savoirs à apprendre.
   Figures de fiction (voir codex « fiction_ali ») : Ma'dân, Mâzin, le maître du cercle, le doyen des récitants. */
ISNAD.registerSaga({
  id: 'ali', order: 5,
  name: "'Alî ibn Abî Tâlib", epithet: 'La Porte du Savoir', arabic: 'علي',
  years: '35–40 H · 656–661',
  light: 'ilm', lightName: 'Savoir',
  ambiance: 'orientale · noosphère',
  tagline: "Face à ceux qui l'ont condamné au nom du Livre, il refuse de condamner à son tour.",

  intro: [
    ['title', "'Alî ibn Abî Tâlib", 'Cinquième maillon · La Porte du Savoir'],
    ['nar', "Médine, fin de l'an 35. 'Uthmân vient de tomber, et la communauté cherche un homme vers qui se tourner. On se presse à la porte de 'Alî. Il refuse d'abord. On insiste. Il n'accepte qu'à la mosquée, devant tous : son serment ne sera pas secret."],
    ['nar', "Il a grandi dans la maison du Messager d'Allah ﷺ et fut parmi les tout premiers à croire, enfant encore. La nuit de l'Hégire, il dormit dans le lit du Messager ﷺ pour couvrir son départ. À Khaybar, il porta l'étendard."],
    ['quote', "Le meilleur juge d'entre nous est 'Alî.", "'Umar ibn al-Khattâb — al-Bukhârî"],
    ['nar', "Son califat sera le plus éprouvé des quatre. L'idole qui l'attend n'est ni une couronne ni un trésor. Elle porte l'habit de la piété : c'est le Juge sans miséricorde — celui qui excommunie, et croit ce faisant servir Allah."],
    ['say', 'Idris', "Une idole qui cite le Livre… Dans la Cité-Miroir, je crois que je la connais. Elle condamne à la vitesse d'un écran."],
    ['nar', "Ici la parole passe avant le fer : on plaide, on apprend, on prie. Ce que tu auras appris auprès des maîtres et dans les feuillets t'ouvrira des arguments ; ce que tu auras négligé te les fermera."],
    ['codex', 'ali_bio']
  ],

  outro: [
    ['mus', 'deuil'],
    ['nar', "'Alî ibn Abî Tâlib meurt à Koufa, en Ramadan de l'an 40, deux jours après le coup. Son meurtrier ne reçoit qu'une frappe. Aucun autre sang ne coule en son nom."],
    ['quote', "Un homme vous a quittés hier, que les premiers n'ont pas devancé par le savoir et que les derniers n'atteindront pas. Il n'a laissé ni or ni argent, sinon sept cents dirhams.", "Al-Hasan ibn 'Alî, au lendemain de sa mort — Ahmad, al-Musnad ; Ibn Sa'd, Tabaqât"],
    ['nar', "Avec lui s'achève le temps des califes bien guidés : trente années depuis la mort du Messager ﷺ, à quelques mois près. Al-Hasan les complétera, puis réconciliera deux grands groupes de musulmans. On appellera cette année-là l'Année de l'unité."],
    ['nar', "L'idole du Juge sans miséricorde n'est pas morte à Nahrawân. Elle a seulement appris à changer de formule. Mais ce que 'Alî lui a opposé demeure : celui qui sait ne se hâte pas de condamner."],
    ['say', 'Idris', "Le savoir, ce n'est pas d'avoir raison contre quelqu'un. C'est de savoir encore, devant celui qui te frappe, ce qu'il t'est interdit de lui faire."],
    ['mus', 'espoir'],
    ['nar', "Le cinquième maillon se referme. La Chaîne, elle, continue : des Compagnons à leurs élèves, des élèves aux leurs — jusqu'à toi."],
    ['sfx', 'light'],
    ['flash', '#c49bff'],
    ['light', 'ilm']
  ],

  /* ─────────────────────────── HÉROS ─────────────────────────── */
  heroes: {
    ali: {
      name: "'Alî", title: 'La Porte du Savoir', arabic: 'علي',
      role: 'guerrier', el: 'ilm',
      look: { robe: '#2f5d50', head: '#2c2a33', cloak: '#1f3a34', aura: '#c49bff', coiffe: 'imama', manteau: 'epaule', item: 'sabre' },
      skills: [
        { lvl: 1, id: 'dhulfiqar', name: 'Dhû l-Fiqâr', desc: 'Le sabre à deux pointes : deux frappes de fer.', cost: 3,
          target: 'foe', el: 'fer', pow: 0.8, hits: 2, anim: 'slash' },
        { lvl: 1, id: 'sentence', name: 'Sentence juste', desc: 'Un jugement rendu sans égard au rang. Justice.', cost: 3,
          target: 'foe', el: 'adl', pow: 1.3, anim: 'light' },
        { lvl: 2, id: 'parole_savoir', name: 'Parole de savoir', desc: 'Rend à chaque chose sa place. Savoir.', cost: 4,
          target: 'foe', el: 'ilm', pow: 1.4, anim: 'glyph' },
        { lvl: 4, id: 'khaybar', name: 'La Porte de Khaybar', desc: 'Il se fait rempart : garde du groupe renforcée, les coups viennent à lui.', cost: 5,
          target: 'allies', fx: [{ st: 'def', v: 1, turns: 3 }, { st: 'taunt', turns: 2, self: true }], anim: 'guard' },
        { lvl: 6, id: 'interrogez', name: '« Interrogez-moi »', desc: 'Il répond à toutes les questions à la fois. Savoir sur tous les égrégores.', cost: 7,
          target: 'foes', el: 'ilm', pow: 0.9, anim: 'glyph' },
        { lvl: 8, id: 'arret', name: 'Arrêt sans appel', desc: 'Justice forte ; retire les faveurs que l’égrégore s’est données.', cost: 8,
          target: 'foe', el: 'adl', pow: 1.9, fx: [{ st: 'dispel' }], anim: 'pillar' }
      ],
      limit: { id: 'haydar', name: 'Haydar', desc: 'Le Lion de Khaybar : nul voile ne tient devant lui.', target: 'foes',
               el: 'shajaa', pow: 1.6, fx: [{ st: 'veil', v: -2 }], anim: 'pillar' }
    },
    ibnabbas: {
      name: "Ibn 'Abbâs", title: 'Le Docte de la communauté', arabic: 'ابن عباس',
      role: 'sage', el: 'ilm',
      look: { robe: '#e9e2cf', head: '#f6f1e4', cloak: '#6c5a8e', aura: '#ffe08a', coiffe: 'imama_haute', chale: true, item: 'feuillets' },
      skills: [
        { lvl: 1, id: 'question', name: 'Question droite', desc: 'Il écoute le grief jusqu’au bout : révèle les failles.', cost: 2,
          target: 'foe', el: 'sidq', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'light' },
        { lvl: 1, id: 'interprete', name: "L'Interprète", desc: 'Replace la parole dans son contexte. Savoir.', cost: 3,
          target: 'foe', el: 'ilm', pow: 1.3, anim: 'glyph' },
        { lvl: 2, id: 'apaisement', name: 'Parole apaisante', desc: 'Rend la Constance à un compagnon.', cost: 4,
          target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 4, id: 'preuve', name: 'La Preuve', desc: 'Un argument que nul ne peut écarter. Véracité ; ôte un voile.', cost: 5,
          target: 'foe', el: 'sidq', pow: 1.4, fx: [{ st: 'veil', v: -1 }], anim: 'light' },
        { lvl: 6, id: 'trois_reponses', name: 'Trois réponses', desc: 'À trois griefs, trois réponses. Trois frappes de Savoir.', cost: 7,
          target: 'foe', el: 'ilm', pow: 0.6, hits: 3, anim: 'glyph' },
        { lvl: 8, id: 'retour', name: 'Le Retour des égarés', desc: 'Soigne le groupe et dissipe ses altérations.', cost: 9,
          target: 'allies', heal: 0.6, fx: [{ st: 'cleanse' }], anim: 'heal' }
      ],
      limit: { id: 'habr', name: 'Le Docte', desc: 'Le Livre répond au Livre : Savoir sur tous, failles révélées, les idoles doutent.', target: 'foes',
               el: 'ilm', pow: 1.5, fx: [{ st: 'reveal' }, { st: 'doute', turns: 2 }], anim: 'glyph' }
    },
    ammar: {
      name: "'Ammâr", title: 'Le Vétéran', arabic: 'عمّار',
      role: 'soigneur', el: 'sabr',
      look: { robe: '#8a7355', head: '#c9b98a', cloak: '#5b4630', aura: '#7fd69a', coiffe: 'imama_queue', manteau: 'long' },
      skills: [
        { lvl: 1, id: 'soutien', name: 'Main du vétéran', desc: 'Relève le courage d’un compagnon : rend la Constance.', cost: 3,
          target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 1, id: 'patience', name: 'Patience ardente', desc: 'Ce qui a tenu sous l’épreuve ne cède plus. Patience.', cost: 3,
          target: 'foe', el: 'sabr', pow: 1.3, anim: 'light' },
        { lvl: 2, id: 'baume', name: 'Baume des anciens', desc: 'Régénération pour tout le groupe.', cost: 5,
          target: 'allies', fx: [{ st: 'regen', turns: 3 }], anim: 'heal' },
        { lvl: 3, id: 'delier', name: 'Délier', desc: 'Dissipe les altérations d’un compagnon et le soigne un peu.', cost: 4,
          target: 'ally', heal: 0.5, fx: [{ st: 'cleanse' }], anim: 'heal' },
        { lvl: 5, id: 'tenir', name: 'Tenir', desc: 'Patience sur tous les égrégores ; affaiblit leur assaut.', cost: 7,
          target: 'foes', el: 'sabr', pow: 0.85, fx: [{ st: 'atk', v: -1, chance: 0.5 }], anim: 'wave' }
      ],
      limit: { id: 'premiers_jours', name: 'Patience des premiers jours', desc: 'Soigne tout le groupe, dissipe ses altérations, affermit sa garde.', target: 'allies',
               heal: 1.0, fx: [{ st: 'cleanse' }, { st: 'def', v: 1, turns: 3 }], anim: 'heal' }
    },
    qays: {
      name: 'Qays', title: "Fils de Sa'd", arabic: 'قيس',
      role: 'stratege', el: 'rahma',
      look: { robe: '#9c3f2e', head: '#efe6d2', cloak: '#4a2a22', aura: '#5fe0d0', coiffe: 'imama_large', manteau: 'ample', echarpe: true },
      skills: [
        { lvl: 1, id: 'largesse', name: 'Largesse', desc: 'Il donne sans compter : soigne tout le groupe.', cost: 5,
          target: 'allies', heal: 0.6, anim: 'heal' },
        { lvl: 1, id: 'garde', name: 'Coup du garde', desc: 'Frappe de fer, nette et prompte.', cost: 3,
          target: 'foe', el: 'fer', pow: 1.3, anim: 'slash' },
        { lvl: 2, id: 'main_ouverte', name: 'Main ouverte', desc: 'Désarme par le bienfait. Miséricorde.', cost: 3,
          target: 'foe', el: 'rahma', pow: 1.3, anim: 'light' },
        { lvl: 4, id: 'manoeuvre', name: 'Manœuvre', desc: 'Le groupe gagne en Élan ; lui-même gagne un point de Niyya.', cost: 5,
          target: 'allies', fx: [{ st: 'spd', v: 1, turns: 3 }, { st: 'niyya', v: 1, self: true }], anim: 'guard' },
        { lvl: 6, id: 'banniere', name: 'Bannière de sûreté', desc: 'Qui la rejoint est sauf. Miséricorde sur tous ; ôte un voile.', cost: 7,
          target: 'foes', el: 'rahma', pow: 0.9, fx: [{ st: 'veil', v: -1 }], anim: 'wave' },
        { lvl: 8, id: 'relever', name: 'Relever', desc: 'Relève un compagnon éprouvé.', cost: 8,
          target: 'ally', revive: true, heal: 0.5, anim: 'heal' }
      ],
      limit: { id: 'karam', name: 'Générosité sans compte', desc: 'Soigne le groupe, le régénère et lui accorde 2 points de Niyya.', target: 'allies',
               heal: 1.0, fx: [{ st: 'regen', turns: 3 }, { st: 'niyya', v: 2 }], anim: 'heal' }
    }
  },

  /* ─────────────────────────── ÉGRÉGORES ─────────────────────────── */
  enemies: {
    murmure: {
      name: 'Murmure de rang', art: 'wisp', hue: 48, scale: 1, lvl: 1, tier: 'minion',
      weak: ['fer', 'sidq'], veils: 1,
      skills: [{ w: 2, name: '« Sais-tu qui il est ? »', target: 'foe', el: 'fer', pow: 0.9, fx: [{ st: 'def', v: -1, chance: 0.3 }], anim: 'dark' }],
      taunts: ['C’est le calife… qu’il la prenne…'],
      desc: 'Un chuchotement de foule : « on ne fait pas attendre un homme pareil ». Seul, il n’est rien ; à mille, il fait plier une règle. Un coup franc ou une parole vraie le dissipent.'
    },
    soupcon: {
      name: 'Soupçon', art: 'mask', hue: 300, scale: 1, lvl: 2, tier: 'minion',
      weak: ['ilm', 'sabr'], veils: 2,
      skills: [{ w: 2, name: 'Insinuation', target: 'foe', el: 'fer', pow: 0.8, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'dark' }],
      desc: 'Un masque vide qui prête à chacun une arrière-pensée. Il ne résiste ni à celui qui vérifie, ni à celui qui attend la preuve avant de parler.'
    },
    privilege: { racine: 'noir_desespoir',
      name: 'Le Privilège', art: 'crown', hue: 45, scale: 2, lvl: 3, tier: 'elite',
      weak: ['adl', 'sabr'], veils: 3,
      skills: [
        { w: 3, name: 'Préséance', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' },
        { w: 3, name: 'Le rang vaut preuve', target: 'foe', el: 'fer', pow: 1.3, anim: 'dark' },
        { w: 2, name: 'Regards de la foule', target: 'foes', el: 'fer', pow: 0.7, fx: [{ st: 'atk', v: -1, chance: 0.4 }], anim: 'wave' }
      ],
      phases: [{ at: 0.5, say: 'Tu es le calife. Un mot de toi, et le juge se taira. Qui t’en blâmerait ?', fx: [{ st: 'atk', v: 1 }],
                 addSkills: [{ w: 3, name: 'Passe-droit', target: 'foe', el: 'fer', pow: 1.5, fx: [{ st: 'doute', turns: 2, chance: 0.5 }], anim: 'burst' }] }],
      taunts: ['Tout le monde trouve cela normal.', 'La règle est pour les autres.'],
      desc: 'Égrégore du rang. Il naît chaque fois qu’une foule attend que le puissant gagne parce qu’il est puissant. Il n’a pas besoin de corrompre le juge : il lui suffit que chacun trouve normal que la règle plie. La justice et la patience le brisent.'
    },
    echo: {
      name: 'Écho', art: 'wisp', hue: 285, scale: 1, lvl: 3, tier: 'minion',
      weak: ['ilm', 'shajaa'], veils: 1,
      skills: [
        { w: 2, name: 'Redite', target: 'foe', el: 'fer', pow: 0.9, anim: 'dark' },
        { w: 1, name: 'Amplifier', target: 'ally', fx: [{ st: 'atk', v: 1 }], anim: 'glyph' }
      ],
      desc: 'Une voix qui répète ce que dit la voix d’à côté. Elle n’a jamais lu la phrase qu’elle crie. Il suffit de lui demander ce qu’elle veut dire.'
    },
    clameur: {
      name: 'Clameur', art: 'swarm', hue: 270, scale: 1, lvl: 4, tier: 'minion',
      weak: ['sidq', 'fer'], veils: 2,
      skills: [
        { w: 3, name: 'Mille bouches', target: 'foes', el: 'fer', pow: 0.65, anim: 'wave' },
        { w: 1, name: 'Couvrir la voix', target: 'foe', fx: [{ st: 'doute', turns: 2, chance: 0.6 }], anim: 'dark' }
      ],
      desc: 'Une nuée de mots criés pour ne pas entendre la réponse. Elle couvre les voix : celui qu’elle atteint doute et se tait.'
    },
    slogan: { racine: 'noir_soupcon',
      name: 'Le Slogan', art: 'banner', hue: 280, scale: 3, lvl: 5, tier: 'boss',
      weak: ['ilm', 'sidq'], immune: ['fer'], veils: 5,
      skills: [
        { w: 3, name: 'Mot d’ordre', target: 'foe', el: 'fer', pow: 1.3, anim: 'dark' },
        { w: 2, name: 'Répétition', target: 'foes', el: 'fer', pow: 0.75, fx: [{ st: 'doute', turns: 2, chance: 0.3 }], anim: 'wave' },
        { w: 2, name: 'Unisson', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'glyph' }
      ],
      phases: [{ at: 0.5, say: 'Je suis une parole vraie. On ne discute pas une parole vraie : on la crie.', fx: [{ st: 'spd', v: 1 }],
                 addSkills: [{ w: 3, name: 'Parole vidée', target: 'foes', el: 'fer', pow: 0.9, fx: [{ st: 'mag', v: -1, chance: 0.5 }], anim: 'burst' }] }],
      taunts: ['Répète. Ne réfléchis pas. Répète.', 'Qui me nuance me trahit.'],
      desc: 'Égrégore de la formule. Une parole vraie, répétée par des milliers de bouches qui ne la comprennent plus, se détache de son sens et devient une arme. Le Slogan ne ment pas : il tronque. Le fer passe au travers ; le savoir et la véracité le font taire.'
    },
    lame: {
      name: 'Lame pieuse', art: 'blade', hue: 200, scale: 1, lvl: 5, tier: 'minion',
      weak: ['rahma', 'shajaa'], veils: 2,
      skills: [
        { w: 3, name: 'Zèle tranchant', target: 'foe', el: 'fer', pow: 0.65, hits: 2, anim: 'slash' },
        { w: 1, name: 'Ferveur', target: 'self', fx: [{ st: 'spd', v: 1 }], anim: 'glyph' }
      ],
      taunts: ['Je frappe pour le bien.'],
      desc: 'Un faisceau de lames sûr de servir le bien. Il ne doute jamais, et c’est ce qui le rend dangereux. La miséricorde l’émousse ; le courage de lui tenir tête le disperse.'
    },
    scrupule: {
      name: 'Le Scrupule inversé', art: 'lens', hue: 160, scale: 2, lvl: 7, tier: 'elite',
      weak: ['rahma', 'ilm'], veils: 4,
      skills: [
        { w: 2, name: 'Peser la datte', target: 'self', fx: [{ st: 'def', v: 1 }, { st: 'regen', turns: 2 }], anim: 'guard' },
        { w: 3, name: 'Négliger le sang', target: 'foe', el: 'fer', pow: 1.5, anim: 'slash' },
        { w: 2, name: 'Loupe', target: 'foes', el: 'fer', pow: 0.8, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'glyph' }
      ],
      phases: [{ at: 0.4, say: 'Une datte prise sans la payer : voilà la faute. Le reste n’est que poussière.', fx: [{ st: 'atk', v: 1 }] }],
      desc: 'Une grappe de lentilles qui grossit l’infime et ne voit plus l’immense. Il pèse une datte tombée et enjambe le sang d’un innocent. Le savoir lui rend les proportions ; la miséricorde, le sens.'
    },
    juge: { racine: 'noir_rancune',
      name: 'Le Juge sans miséricorde', art: 'scale', hue: 215, scale: 3, lvl: 9, tier: 'boss',
      weak: ['ilm', 'rahma'], immune: ['adl'], veils: 6,
      skills: [
        { w: 3, name: 'Sentence', target: 'foe', el: 'adl', pow: 1.5, anim: 'pillar' },
        { w: 2, name: 'Tous coupables', target: 'foes', el: 'adl', pow: 0.85, anim: 'wave' },
        { w: 2, name: 'Anathème', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'doute', turns: 2, chance: 0.6 }, { st: 'def', v: -1, chance: 0.5 }], anim: 'dark' },
        { w: 1, name: 'Certitude', target: 'self', fx: [{ st: 'atk', v: 1 }, { st: 'def', v: 1 }], anim: 'guard' }
      ],
      phases: [
        { at: 0.6, say: 'Je suis le jugement. Qui me contredit s’est condamné lui-même.', fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Plateau unique', target: 'foes', el: 'adl', pow: 1.0, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'burst' }] },
        { at: 0.3, say: 'Tous coupables. Toi aussi. Toi surtout, qui prétends savoir.', fx: [{ st: 'spd', v: 1 }],
          addSkills: [{ w: 3, name: 'La phrase devenue lame', target: 'foe', el: 'fer', pow: 1.9, anim: 'slash' }] }
      ],
      taunts: ['Je n’ai pas besoin de t’entendre.', 'La miséricorde est une faiblesse de juge.'],
      desc: 'L’idole de ceux qui se font juges des cœurs. Elle porte l’habit de la justice, mais sa balance n’a qu’un plateau : elle ne sait que condamner. La justice seule ne l’entame pas, car elle s’en croit le nom. Elle cède au savoir, qui distingue, et à la miséricorde, qui retient la main.'
    }
  },

  /* ─────────────────────────── CODEX ─────────────────────────── */
  codex: [
    { id: 'ali_bio', cat: 'Biographie', title: "'Alî ibn Abî Tâlib",
      text: "'Alî (qu'Allah l'agrée), cousin du Messager d'Allah ﷺ, grandit dans sa maison et fut parmi les tout premiers à embrasser l'islam, encore enfant. La nuit de l'Hégire, il dormit dans le lit du Messager ﷺ pour couvrir son départ. Porte-étendard à Khaybar, il est l'un des dix à qui le Paradis fut annoncé. Élu calife à Médine à la fin de l'an 35, il porta le siège du califat à Koufa et mourut en martyr en Ramadan de l'an 40. Le surnom « la Porte du Savoir » vient d'une tradition célèbre dont l'authenticité est discutée ; son rang de savant et de juge, lui, fait l'unanimité.",
      src: "Ibn Hishâm, Sîra ; Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh ; at-Tirmidhî" },
    { id: 'ibnabbas_bio', cat: 'Biographie', title: "'Abdallâh ibn 'Abbâs",
      text: "Cousin du Messager d'Allah ﷺ, il avait environ treize ans à sa mort (qu'Allah l'agrée, ainsi que son père). Le Messager ﷺ avait invoqué pour lui l'intelligence de la religion. 'Umar le faisait siéger, tout jeune, parmi les anciens de Badr. On le surnomme le Docte de la communauté et l'Interprète du Coran. Gouverneur de Bassora pour 'Alî, il mourut à Tâ'if en l'an 68.",
      src: "al-Bukhârî ; Ibn Sa'd, Tabaqât" },
    { id: 'ammar_bio', cat: 'Biographie', title: "'Ammâr ibn Yâsir",
      text: "'Ammâr (qu'Allah l'agrée) fut des tout premiers musulmans de La Mecque. Sa famille, pauvre et sans protecteur, endura la torture pour sa foi, et ses parents comptent parmi les premiers martyrs de l'islam. Il combattit à Badr et aux grandes journées, puis gouverna Koufa sous 'Umar. Il tomba à Siffîn en l'an 37, à plus de quatre-vingt-dix ans. On rapporte que sa dernière gorgée en ce monde fut un peu de lait.",
      src: "Ibn Hishâm, Sîra ; Ibn Sa'd, Tabaqât ; Ahmad, al-Musnad" },
    { id: 'qays_bio', cat: 'Biographie', title: "Qays ibn Sa'd",
      text: "Qays ibn Sa'd ibn 'Ubâda (qu'Allah les agrée), des Ansâr de Médine, était le fils du chef des Khazraj. Il se tenait auprès du Messager d'Allah ﷺ, rapporte Anas, « comme le chef de la garde auprès de l'émir ». Célèbre pour sa générosité et sa finesse, il gouverna l'Égypte pour 'Alî, puis commanda à Siffîn et à Nahrawân, où il exhorta les sécessionnistes avant la bataille. Il mourut à Médine vers l'an 60.",
      src: "al-Bukhârî ; Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh" },
    { id: 'koufa', cat: 'Lieu', title: 'Koufa',
      text: "Ville-camp fondée en l'an 17 par Sa'd ibn Abî Waqqâs, sur l'ordre de 'Umar, près de l'Euphrate. 'Alî en fit le siège du califat en l'an 36. On rapporte qu'il refusa d'habiter le palais du gouverneur. Koufa deviendra l'un des grands foyers du savoir : droit, grammaire, lectures du Coran — et une écriture qui porte son nom, le coufique.",
      src: "al-Balâdhurî, Futûh al-Buldân ; at-Tabarî, Târîkh" },
    { id: 'cuirasse', cat: 'Événement', title: 'La cuirasse devant le juge',
      text: "On rapporte que 'Alî, calife, reconnut sa cuirasse entre les mains d'un homme des Gens du Livre, à Koufa. Il ne la reprit pas : il le cita devant le juge Shurayh, en fonction depuis 'Umar. Faute de preuve recevable — le juge écarta le témoignage du fils en faveur de son père —, Shurayh trancha contre le calife, qui s'inclina. L'homme, bouleversé, reconnut les faits et embrassa l'islam ; 'Alî lui laissa la cuirasse. Le récit, très célèbre, est rapporté par Abû Nu'aym, al-Bayhaqî et Ibn Kathîr ; les spécialistes discutent la solidité de sa chaîne.",
      src: "Abû Nu'aym, Hilyat al-Awliyâ' ; al-Bayhaqî, as-Sunan al-Kubrâ ; Ibn Kathîr, al-Bidâya wa n-Nihâya" },
    { id: 'privilege', cat: 'Noosphère', title: 'Le Privilège',
      text: "Égrégore du rang. Il naît chaque fois qu'une foule attend que le puissant gagne parce qu'il est puissant. Il n'a pas besoin de corrompre le juge : il lui suffit que chacun trouve normal que la règle plie. Il se brise quand le premier des hommes se tient devant le juge comme le dernier, et repart débouté sans colère." },
    { id: 'siffin', cat: 'Événement', title: 'Siffîn',
      text: "En l'an 37, sur la rive de l'Euphrate, l'armée d'Irak et l'armée de Syrie se font face durant des semaines. De grands Compagnons se trouvent dans chaque rang ; d'autres s'abstiennent. Les combats cessent quand on convient de s'en remettre à deux arbitres. Les savants recommandent la retenue sur ces événements : tous étaient des croyants qui cherchaient le vrai, et l'on demande pour tous l'agrément d'Allah.",
      src: "at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya wa n-Nihâya" },
    { id: 'harura', cat: 'Événement', title: "Le débat de Harûrâ'",
      text: "Au retour de Siffîn, plusieurs milliers d'hommes refusent l'arbitrage et se retirent à Harûrâ', près de Koufa : on les appellera Harûriyya, puis Khawârij, « ceux qui sont sortis ». Ibn 'Abbâs vient débattre avec eux à l'heure de midi. Il écoute leurs griefs, puis y répond par le Coran (5:95 ; 4:35) et par l'exemple du Messager ﷺ à Hudaybiyya. Deux mille d'entre eux reviennent ce jour-là ; davantage, selon d'autres récits.",
      src: "an-Nasâ'î, as-Sunan al-Kubrâ ; al-Hâkim, al-Mustadrak ; 'Abd ar-Razzâq, al-Musannaf" },
    { id: 'slogan', cat: 'Noosphère', title: 'Le Slogan',
      text: "Égrégore de la formule. Une parole vraie, répétée par des milliers de bouches qui ne la comprennent plus, se détache de son sens et devient une arme. Le Slogan ne ment pas : il tronque. Aucune lame ne l'entame ; seuls le savoir, qui rend à la phrase son contexte, et la véracité, qui rappelle ce qu'elle visait, le font taire. L'Agrégor de la Cité-Miroir en fabrique mille par jour." },
    { id: 'parole_verite', cat: 'Parole', title: '« Parole de vérité… »',
      text: "Quand les sécessionnistes criaient « Le jugement n'appartient qu'à Allah », 'Alî répondit : « Parole de vérité par laquelle on vise le faux. » Il leur reconnut pourtant trois droits : l'accès aux mosquées, leur part du trésor tant que leurs mains restaient avec celles des musulmans, et de n'être jamais combattus les premiers. Il refusa de punir une opinion tant qu'elle ne versait pas le sang.",
      src: "Muslim ; Ibn Abî Shayba, al-Musannaf ; at-Tabarî, Târîkh" },
    { id: 'nahrawan', cat: 'Événement', title: 'Nahrawân',
      text: "En l'an 38, les irréductibles se regroupent près du canal de Nahrawân, à l'est du Tigre. Ils tuent 'Abdallâh, fils du Compagnon Khabbâb, puis l'émissaire de 'Alî. Sommés de livrer les meurtriers, ils répondent : « Nous les avons tous tués. » 'Alî fait dresser une bannière de sûreté, confiée à Abû Ayyûb al-Ansârî ; des centaines se retirent. Il interdit de frapper le premier. La bataille est brève. Interrogé ensuite, il refuse de les dire polythéistes ou hypocrites.",
      src: "at-Tabarî, Târîkh ; Ibn Abî Shayba, al-Musannaf ; Ibn Kathîr, al-Bidâya wa n-Nihâya" },
    { id: 'juge', cat: 'Noosphère', title: 'Le Juge sans miséricorde',
      text: "L'idole de ceux qui se font juges des cœurs. Elle porte l'habit de la justice, mais sa balance n'a qu'un plateau : elle ne sait que condamner. Scrupuleuse pour une datte, elle est sans égard pour le sang. La justice seule ne l'entame pas, car elle s'en croit le nom ; elle cède au savoir, qui distingue, et à la miséricorde, qui retient la main. 'Alî la brisa deux fois : à Nahrawân, en refusant de rendre l'anathème, puis sur son lit, en protégeant son propre meurtrier de la vengeance." },
    { id: 'consignes', cat: 'Parole', title: 'Les dernières consignes',
      text: "Frappé à l'aube, en Ramadan de l'an 40, 'Alî donna ses consignes au sujet de son agresseur, Ibn Muljam : qu'on le nourrisse et qu'on le traite bien ; s'il survivait, il déciderait lui-même ; s'il mourait, une seule frappe pour sa frappe, sans mutilation. Il interdit qu'on verse le sang d'autres musulmans en son nom. Il mourut deux jours plus tard, selon les récits les plus répandus.",
      src: "Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh" },
    { id: 'fiction_ali', cat: 'Biographie', title: 'Figures de fiction de cette saga',
      text: "Pour donner un visage aux enjeux, cette saga ajoute aux personnages historiques quatre figures inventées : Ma'dân, notable des greniers de Koufa ; Mâzin, chef des cavaliers de la Butte ; le maître du cercle d'étude ; le doyen des récitants de Nahrawân. Leurs paroles et leurs choix sont de fiction. Ce qui dépend d'eux change selon tes pourparlers ; ce que les sources rapportent des Compagnons ne change pas." },
    { id: 'lettre_juges', cat: 'Parole', title: "La lettre de 'Umar sur le jugement",
      text: "'Umar ibn al-Khattâb écrivit à Abû Mûsâ al-Ash'arî une lettre restée la charte des juges. On y lit : « Traite les gens à égalité dans ton regard, ton audience et ton jugement, afin que le noble n'espère pas ta partialité et que le faible ne désespère pas de ta justice. » Et encore : « La preuve incombe à celui qui réclame, et le serment à celui qui nie. » C'est la règle même que Shurayh appliqua au calife.",
      src: "ad-Dâraqutnî, as-Sunan ; al-Bayhaqî, as-Sunan al-Kubrâ — traduction du sens" },
    { id: 'shurayh_bio', cat: 'Biographie', title: 'Le juge Shurayh',
      text: "Shurayh ibn al-Hârith al-Kindî, d'origine yéménite, appartient à la génération qui suit les Compagnons. On rapporte que 'Umar, en désaccord avec un homme sur un cheval acheté à l'essai, le prit pour arbitre ; Shurayh lui donna tort : « Garde ce que tu as acheté, ou rends-le comme tu l'as pris. » 'Umar le nomma juge de Koufa. Il le resta une soixantaine d'années, sous plusieurs califes, et mourut très âgé vers l'an 78.",
      src: "Ibn Sa'd, Tabaqât ; Wakî', Akhbâr al-Qudât" },
    { id: 'phrase_verset', cat: 'Parole', title: 'La phrase et son verset',
      text: "« Le jugement n'appartient qu'à Allah » : la phrase est du Coran (6:57 ; 12:40 ; 12:67). Dans la sourate Yûsuf elle se poursuit : « Il vous a commandé de n'adorer que Lui » (12:40, traduction du sens). Elle parle de l'adoration due à Allah seul. Le même Livre confie pourtant des jugements à des hommes : « deux hommes justes parmi vous » (5:95), et deux arbitres pour réconcilier un foyer (4:35). Lire une phrase sans sa suite ni ses sœurs, c'est la changer en mot d'ordre.",
      src: "Coran — traductions du sens ; at-Tabarî, Tafsîr" },
    { id: 'mushaf_muet', cat: 'Parole', title: '« Ô mushaf, parle aux gens ! »',
      text: "On rapporte que 'Alî, apprenant les reproches des sécessionnistes, réunit les récitants, fit apporter un grand mushaf, le posa devant lui et le frappa de la main : « Ô mushaf, parle aux gens ! » On s'étonna : ce n'est que de l'encre sur des feuilles ; ce sont les hommes qui parlent d'après ce qu'ils en ont appris. La leçon était là : le Livre ne tranche pas seul, il faut des gens qui le connaissent pour dire ce qu'il juge. Puis il envoya Ibn 'Abbâs.",
      src: "Ahmad, al-Musnad ; at-Tabarî, Târîkh" },
    { id: 'registre_double', cat: 'Événement', title: 'Le registre aux deux colonnes (fiction)',
      text: "Un feuillet de comptes trouvé à Harûrâ' : d'un côté le grain livré aux greniers de Koufa, de l'autre le grain vendu au camp des sécessionnistes, de la même main. Il appartient à Ma'dân, notable imaginé pour ce récit. Les chroniques ne nomment personne de tel ; mais toute discorde a ses marchands, qui assurent chaque camp de leur fidélité et vivent de ce que nul ne se parle." },
    { id: 'ashtar', cat: 'Parole', title: 'La lettre à Mâlik al-Ashtar',
      text: "Mâlik ibn al-Hârith an-Nakha'î, dit al-Ashtar, fut l'un des principaux lieutenants de 'Alî. Nommé gouverneur d'Égypte en l'an 38, il mourut en route, à al-Qulzum. On rapporte que 'Alî lui avait remis une longue lettre sur l'art de gouverner : miséricorde pour les administrés, « ton frère en religion ou ton semblable dans la création », choix des juges, méfiance envers les flatteurs. Elle figure dans le Nahj al-Balâgha, recueil composé vers l'an 400 par ash-Sharîf ar-Radî ; les spécialistes discutent l'attribution de ses textes.",
      src: "Nahj al-Balâgha, lettre 53 ; at-Tabarî, Târîkh (nomination et mort d'al-Ashtar)" },
    { id: 'ibn_khabbab', cat: 'Événement', title: 'Le fils de Khabbâb',
      text: "'Abdallâh, fils du Compagnon Khabbâb ibn al-Aratt, voyageait avec les siens quand il croisa les gens de Nahrawân. On rapporte qu'ils lui demandèrent une parole tenue de son père. Il leur transmit celle-ci, du Messager d'Allah ﷺ : viendra une discorde où celui qui reste assis vaudra mieux que celui qui se tient debout, et celui qui se tient debout mieux que celui qui marche. Ils le tuèrent. Ce meurtre décida 'Alî à marcher sur Nahrawân.",
      src: "Ahmad, al-Musnad ; at-Tabarî, Târîkh ; Ibn Abî Shayba, al-Musannaf" }
  ],

  /* ─────────────────────────── CHAPITRES ─────────────────────────── */
  chapters: [
    /* ═════ Chapitre 1 ═════ */
    {
      id: 'a1', title: 'Le Bouclier et le Juge', sub: 'An 36 H · 657 · Koufa',
      map: 'koufa', opts: { time: 'day' }, start: 'mosquee_cour',
      party: ['ali', 'ibnabbas'],
      npcs: [
        { id: 'ammar', name: "'Ammâr ibn Yâsir", hero: 'ammar', at: 'place',
          talk: [['say', 'ammar', "J'ai vu naître cette religion à La Mecque. Je veux la voir juste à Koufa."]] },
        { id: 'kumayl', name: 'Kumayl ibn Ziyâd', at: ['mosquee_cour', 2, 1], look: { kind: 'homme', robe: '#6d7a5a', head: '#e8e0cc' },
          talk: [
            ['say', 'kumayl', "Il m'a pris par la main, un soir, et m'a mené hors de la ville pour m'enseigner. Je n'ai rien oublié."],
            ['quote', "Le savoir vaut mieux que la richesse : le savoir te garde, alors que toi, tu gardes la richesse.", "'Alî ibn Abî Tâlib à Kumayl — on rapporte, Abû Nu'aym, Hilyat al-Awliyâ'"]
          ] },
        { id: 'etudiant', name: 'Un étudiant', at: ['mosquee_porte', 1, 0], look: { kind: 'homme', robe: '#b9a98a', head: '#efe7d6' },
          talk: [['say', 'etudiant', "Koufa n'était qu'un camp de roseaux quand Sa'd ibn Abî Waqqâs l'a fondée. Aujourd'hui on y vient de loin pour apprendre."]] },
        { id: 'changeur', name: 'Un peseur du souk', at: ['souk', -2, 1], look: { kind: 'ancien', robe: '#7a6248', head: '#d9cdb6' },
          talk: [['say', 'changeur', "On rapporte qu'il parcourt les étals, sa férule à la main : « Marchands, craignez Allah, et donnez la juste mesure. » Depuis, je vérifie mes poids deux fois."]] },
        { id: 'homme', name: "L'homme à la cuirasse", at: ['souk', 1, 0], look: { kind: 'homme', robe: '#5c6b7a', head: '#cfc6b4' },
          talk: [['say', 'homme', "Des cuirasses, des selles, du cuir de Hîra. Regarde sans crainte."]] },
        { id: 'shurayh', name: 'Le juge Shurayh', at: 'halle', look: { kind: 'ancien', robe: '#e8e0cc', head: '#f2ece0' },
          talk: [['say', 'shurayh', "Ici, je ne connais que des plaideurs. Le rang reste à la porte."]] },
        { id: 'qanbar', name: 'Qanbar', at: ['halle', -1, 1], look: { kind: 'homme', robe: '#8c7a5e', head: '#e2d8c2' },
          talk: [['say', 'qanbar', "Je suis son affranchi. Je témoignerai de ce que j'ai vu, pas davantage."]] },
        { id: 'hasan', name: 'Al-Hasan', at: ['halle', 1, 1], look: { kind: 'compagnon', robe: '#e6dfcc', head: '#f4efe2', aura: '#ffe9a8' },
          talk: [['say', 'hasan', "Mon père m'a appris qu'un juge se respecte même quand il nous déboute."]] },
        { id: 'maitre', name: 'Le maître du cercle', at: 'ecole', look: { kind: 'savant', robe: '#e6e0cf', head: '#f4efe2' },
          talk: [
            ['say', 'maitre', "Assieds-toi, si tu as un moment. Ici on n'enseigne pas à avoir raison : on enseigne d'où l'on tient ce que l'on dit."],
            ['ask', 'Que demander au maître du cercle ?', [
              { t: "Comment 'Umar voulait-il que l'on juge ?", r: [
                ['say', 'maitre', "Il l'a écrit à Abû Mûsâ : égalité dans le regard, dans l'audience et dans le jugement. Et ceci, que tout plaideur devrait savoir : la preuve incombe à celui qui réclame."],
                ['codex', 'lettre_juges'],
                ['if', 'su_lettre', [], [['pillar', 'savoir', 1], ['flag', 'su_lettre', true]]]
              ] },
              { t: 'Qui est le juge Shurayh ?', r: [
                ['say', 'maitre', "Un homme qui donna tort à 'Umar pour un cheval, dit-on, et que 'Umar fit juge pour cela. Un élève a consigné l'affaire : cherche son feuillet, à deux pas d'ici."]
              ] },
              { t: 'Rien pour aujourd’hui.', r: [
                ['say', 'maitre', "Alors reviens. Le savoir ne court pas après ceux qui le fuient ; mais il attend longtemps."]
              ] }
            ]]
          ] },
        { id: 'madan', name: "Ma'dân, notable des greniers", at: ['place', 2, 1], hidden: true, look: { kind: 'marchand', robe: '#7a4f6a', head: '#e8dcc6' },
          talk: [['say', 'madan', "Ton serviteur avant tous les autres, Commandeur des croyants."]] }
      ],
      foes: [
        { id: 'f1', at: ['souk', 3, 2], group: ['murmure', 'murmure'], bg: 'ville' },
        { id: 'f1b', at: 'palmeraie', group: ['murmure', 'soupcon'], bg: 'ville' },
        { id: 'f2', map: 'noos', at: 'noeud1', group: ['soupcon', 'murmure', 'murmure'], bg: 'noos' }
      ],
      chests: [
        { at: ['halle', 1, 1], gear: 'calame_fin' },
        { at: ['puits', 1, 0], item: 'dattes', n: 2 },
        { at: ['palmeraie', 1, 1], item: 'musc', n: 1 },
        { map: 'noos', at: 'faille', item: 'miel', n: 1 },
        { at: ['ecole', 1, 1], codex: 'shurayh_bio' }
      ],
      intro: [
        ['title', 'Le Bouclier et le Juge', 'An 36 de l’Hégire · Koufa'],
        ['nar', "Koufa, près de l'Euphrate. 'Alî y a porté le siège du califat. On rapporte qu'il refusa le palais du gouverneur et logea simplement, à deux pas de la mosquée où il enseigne."],
        ['quote', "Interrogez-moi sur le Livre d'Allah : il n'est pas un verset dont je ne sache s'il est descendu de nuit ou de jour, en plaine ou en montagne.", "'Alî ibn Abî Tâlib — Ibn Sa'd, Tabaqât"],
        ['nar', "Ce matin-là, une pièce manque à son équipement : une vieille cuirasse, égarée en route. Il n'y pense plus. Il sort inspecter le souk, comme chaque jour."],
        ['codex', 'koufa'],
        ['codex', 'ibnabbas_bio'],
        ['say', 'ibnabbas', "Le cercle d'étude se tient à deux pas. Ce qu'on y apprend sert toujours un jour, devant un juge ou devant des notables."]
      ],
      objectives: [
        { text: "Retrouver 'Ammâr ibn Yâsir sur la place", talk: 'ammar', then: [
          ['say', 'ammar', "Commandeur des croyants. Mes os sont vieux, mais ils savent encore marcher derrière le vrai."],
          ['say', 'ali', "Marche à côté, Abû l-Yaqzân. Pas derrière."],
          ['join', 'ammar'], ['hide', 'ammar'],
          ['codex', 'ammar_bio']
        ] },
        { text: 'Inspecter le souk de Koufa', goto: 'souk', then: [
          ['nar', "Entre deux étals, un reflet de mailles. Une cuirasse usée, que 'Alî reconnaît au premier regard."],
          ['say', 'ali', "Cette cuirasse est la mienne. Je ne l'ai ni vendue ni donnée."],
          ['say', 'homme', "Elle est à moi, Commandeur des croyants. Elle est dans ma main."],
          ['nar', "Le souk se tait. Puis les murmures montent, de tous côtés : c'est le calife — qu'il la prenne, et qu'on n'en parle plus."],
          ['choice', "L'homme refuse de rendre la cuirasse. Que fait le calife ?", [
            { t: "La reprendre d'autorité : chacun sait qu'il ne ment pas", r: [
              ['nar', "La chaîne vacille. Ce n'est pas ce qui fut rapporté. Être véridique ne dispense pas de la preuve : ce qu'il aurait pris ainsi, tout puissant après lui l'aurait pris de même."]
            ] },
            { t: 'Le citer devant le juge, comme tout plaideur', ok: true, r: [
              ['say', 'ali', "Alors allons devant Shurayh. Il dira lequel de nous deux a raison."],
              ['say', 'homme', "Devant ton propre juge ?"],
              ['say', 'ali', "Devant le juge. Il n'est à personne."]
            ] },
            { t: "Faire saisir l'homme par la garde du souk", r: [
              ['nar', "Non. L'homme tenait l'objet, et rien encore ne prouvait le vol. 'Alî ne fit arrêter personne : il se fit plaideur."]
            ] }
          ]],
          ['tp', 'homme', ['halle', -1, 2]],
          ['say', 'ibnabbas', "Écoute ces murmures. Ils ne veulent pas de mal : ils trouvent seulement naturel que le rang l'emporte. C'est ainsi que naît un égrégore."]
        ] },
        { text: 'Dissiper les murmures du souk', foe: 'f1', then: [
          ['nar', "Les murmures se dispersent. Mais dans l'envers de la ville, ils convergent vers la halle du juge, où quelque chose les attend et les rassemble."],
          ['give', 'dattes', 2]
        ] },
        { text: 'Se présenter devant le juge Shurayh, à la halle', talk: 'shurayh', then: [
          ['say', 'shurayh', "Commandeur des croyants. Que réclames-tu ?"],
          ['say', 'ali', "Cette cuirasse. Elle est à moi : je ne l'ai ni vendue ni donnée."],
          ['say', 'shurayh', "Et toi, que réponds-tu ?"],
          ['say', 'homme', "La cuirasse est à moi. Mais je ne tiens pas le Commandeur des croyants pour un menteur."],
          ['say', 'shurayh', "Elle est entre ses mains. Commandeur des croyants, as-tu une preuve ?"],
          ['say', 'ali', "Qanbar, mon affranchi, et al-Hasan, mon fils, en témoignent."],
          ['say', 'shurayh', "Le témoignage de l'affranchi, je le reçois. Celui du fils en faveur de son père, je ne puis le recevoir."],
          ['nar', "Un silence tombe sur la halle. Tous les regards vont du juge au calife. Nul n'imagine que le calife puisse perdre. Et de cette attente, dans l'envers du lieu, quelque chose se couronne."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 48 }],
          ['nar', "La noosphère de Koufa. Ici, l'attente de la foule a pris corps : une couronne vide, qui grandit de chaque regard levé vers le rang."],
          ['codex', 'privilege']
        ] },
        { text: "Traverser l'envers de la halle", foe: 'f2', then: [
          ['say', 'ammar', "J'ai connu La Mecque quand les puissants y avaient toujours raison. Je ne veux pas revoir cela sous un autre nom."]
        ] },
        { text: 'Atteindre le cœur de l’égrégore', goto: 'coeur', then: [
          ['say', 'ibnabbas', "Le voilà. Il ne cédera pas à la force : il s'en nourrit. Montre-lui la justice, et la patience de celui qui attend son tour."],
          ['heal'],
          ['battle', { group: ['privilege'], bg: 'noos', boss: true, intro: 'Tu es le premier des hommes. Pourquoi plaiderais-tu comme le dernier ?' }],
          ['sfx', 'break'],
          ['nar', "La couronne se fend. Dans la halle, rien n'a bougé : un juge attend la réponse d'un plaideur."],
          ['map', 'koufa', 'halle', { time: 'day' }],
          ['choice', 'Le juge a écarté le témoignage. Que fait le calife ?', [
            { t: "Rappeler au juge de qui il tient sa charge", r: [
              ['nar', "La chaîne vacille. Ce n'est pas ce qui fut rapporté. Un juge qui tremble devant celui qui le nomme n'est plus un juge — et 'Alî le savait mieux que quiconque."]
            ] },
            { t: 'Trancher lui-même : il est le meilleur juge de la communauté', r: [
              ['nar', "Non. Nul n'est juge en sa propre cause, fût-il le plus savant des hommes. Il avait choisi de plaider : il accepta d'être débouté."]
            ] },
            { t: '« Shurayh a dit vrai : je n’ai pas d’autre preuve. »', ok: true, r: [
              ['say', 'ali', "Shurayh a dit vrai. Je n'ai pas d'autre preuve."],
              ['say', 'shurayh', "Alors la cuirasse reste à celui qui la tient."]
            ] }
          ]],
          ['nar', "L'homme prend la cuirasse et fait quelques pas vers la porte. Puis il s'arrête, et revient."],
          ['say', 'homme', "J'atteste que ce sont là des jugements de prophètes. Le Commandeur des croyants me mène devant son propre juge — et son juge tranche contre lui !"],
          ['say', 'homme', "La cuirasse est la tienne. Elle était tombée de ta monture, et je l'ai ramassée."],
          ['nar', "On rapporte qu'il prononça alors l'attestation de foi, et que 'Alî lui répondit : « Puisque tu as embrassé l'islam, elle est à toi » — et lui fit don, de surcroît, d'un cheval."],
          ['codex', 'cuirasse'],
          ['nar', "L'appel de midi monte sur Koufa. Dans le rang, le plaideur débouté et celui qui vient de gagner se tiennent épaule contre épaule."],
          ['pray', 'dhuhr'],
          ['show', 'madan'],
          ['nar', "À la sortie, des hommes en beaux manteaux attendent sur la place : les notables de Koufa. Un calife qui perd un procès les inquiète plus qu'un calife qui en gagne."]
        ] },
        { text: 'Recevoir les notables de Koufa, sur la place', talk: 'madan', then: [
          ['mus', 'conseil'],
          ['codex', 'fiction_ali'],
          ['say', 'madan', "Commandeur des croyants ! Ma'dân, des greniers de Koufa, ton serviteur avant tous les autres. Nous venons en amis : ce qui s'est passé dans la halle ne doit pas se reproduire."],
          ['nar', "J'ai connu des villes où le puissant gagnait toujours. Elles tenaient debout comme un mur sans mortier, par la seule habitude des pierres. Ce qui lie les hommes n'est pas la force du premier d'entre eux : c'est la certitude du dernier qu'on l'écoutera."],
          ['parley', {
            with: 'madan', title: 'Les notables de Koufa',
            intro: "Ils craignent qu'un calife débouté soit un calife affaibli. Ma'dân parle pour eux, et un peu pour lui-même.",
            goal: 7,
            rounds: [
              { say: "Tout Koufa t'a vu perdre devant un homme du souk. Un chef qu'on déboute aujourd'hui, on le défie demain. Fais savoir que la parole du calife vaut preuve.",
                opts: [
                  { t: "Demander ce que vaudrait cette règle sous un calife injuste", el: 'adl', v: 2, r: "Nous ne pensions qu'à toi. Pas à ceux qui viendront après toi." },
                  { t: "Citer la lettre de 'Umar à ses juges : la preuve incombe à celui qui réclame", el: 'ilm', v: 3, need: 'lettre_juges', r: "La lettre de 'Umar… Nos pères l'ont entendue lire dans cette halle même." },
                  { t: "Répondre que nul n'osera défier le calife", el: 'shajaa', v: -1, r: "Voilà ! C'est ce calife-là que nous réclamons : celui qu'on n'ose pas contredire." }
                ] },
              { say: "Shurayh est un bon juge, nul ne le nie. Mais un juge avisé sait devant qui il siège.",
                opts: [
                  { t: "Rappeler que Shurayh a déjà donné tort à 'Umar, qui le fit juge pour cela", el: 'ilm', v: 3, need: 'shurayh_bio', r: "Je l'ignorais. Ou je l'avais oublié à dessein." },
                  { t: "Dire qu'il siège devant deux plaideurs, et rien d'autre", el: 'sidq', v: 2, r: "Deux plaideurs. Dit ainsi, la halle paraît plus grande que le palais." },
                  { t: "Convenir que Shurayh aurait pu y mettre des formes", el: 'rahma', v: 0, r: "Des formes, oui. Nous n'en demandons pas davantage… pour commencer." }
                ] },
              { say: "Soit. Mais nous, qui tenons les greniers et les marchés, serons-nous cités demain comme n'importe qui, par n'importe qui ?",
                opts: [
                  { t: "Montrer que la même halle les protège : n'importe qui y sera cité à leur demande", el: 'adl', v: 2, r: "Elle nous protège aussi… Je n'avais pas regardé la chose de ce côté." },
                  { t: "Dire que celui qui n'a rien pris n'a rien à craindre d'une audience", el: 'sabr', v: 1, r: "Facile à dire pour qui vient de perdre une cuirasse et de gagner une ville." },
                  { t: "Ménager leur rang : laisser entendre qu'on y aura égard", el: 'rahma', v: -2, r: "À la bonne heure. Je savais que nous finirions par nous entendre." }
                ] },
              { say: "On dit déjà dans les quartiers : le calife est faible. Que répondrons-nous, nous qui parlons pour toi ?",
                opts: [
                  { t: "Qu'ils ont vu un homme perdre un bien et garder la règle : le dire comme ils l'ont vu", el: 'sidq', v: 2, r: "Dit ainsi, cela se laisse répéter sans rougir." },
                  { t: "Qu'une ville est forte de ce que le plus petit ose y réclamer", el: 'ilm', v: 1, r: "Belle phrase. Les quartiers préfèrent le pain aux phrases ; mais nous la porterons." },
                  { t: "Que les bavards se tairont d'eux-mêmes", el: 'sabr', v: -1, r: "Ils ne se taisent jamais d'eux-mêmes. C'est même notre métier de le savoir." }
                ] }
            ],
            win: [
              ['say', 'madan', "Nous dirons donc que Koufa a un juge, et que son calife s'en honore. Cela se défend."],
              ['nar', "Les notables se retirent, rassurés. Ma'dân s'incline plus bas que les autres, et sourit un peu trop longtemps."],
              ['pillar', 'justice', 1],
              ['flag', 'notables_acquis', true]
            ],
            lose: [
              ['say', 'madan', "Nous avons entendu. Nous dirons aux quartiers ce que nous pourrons."],
              ['nar', "Ils repartent sans être convaincus. Derrière eux, sur la place, les murmures se reforment : la parole n'a pas suffi, et l'idole du rang relève un fragment de sa couronne."],
              ['battle', { group: ['soupcon', 'murmure', 'murmure'], bg: 'ville', intro: '« Faible… il est faible… » Le murmure revient, plus épais.' }],
              ['nar', "Le murmure se tait. Mais Koufa, il faudra la convaincre encore."]
            ]
          }],
          ['mus', 'medine']
        ] }
      ],
      outro: [
        ['nar', "Ce jour-là, Koufa apprit qu'un calife pouvait perdre un procès et en sortir grandi. Dans la noosphère de la ville, une couronne était tombée : celle qui voulait que le rang tienne lieu de preuve."],
        ['say', 'ibnabbas', "Tu as perdu une cuirasse, cousin."],
        ['say', 'ali', "Et le juge a gardé la sienne. Le marché est bon."]
      ]
    },

    /* ═════ Chapitre 2 ═════ */
    {
      id: 'a2', title: 'La Parole détournée', sub: "An 37 H · 658 · Koufa et Harûrâ'",
      map: 'koufa', opts: { time: 'day' }, start: 'maison',
      party: ['ali', 'ibnabbas'],
      npcs: [
        { id: 'qays', name: "Qays ibn Sa'd", hero: 'qays', at: ['maison', 1, 1],
          talk: [['say', 'qays', "On me dit rusé. Si la ruse ne menait pas au Feu, je le serais plus que quiconque."]] },
        { id: 'veteran', name: 'Un vétéran de Siffîn', at: 'place', look: { kind: 'soldat', robe: '#6b5a48', head: '#d6ccb8' },
          talk: [
            ['say', 'veteran', "J'étais près de 'Ammâr, le dernier jour. On lui porta un peu de lait. Il sourit : ce serait, dit-il, sa dernière provision de ce monde."],
            ['if', 'lait_donne',
              [['say', 'veteran', "Qu'Allah lui fasse miséricorde. Et à nous tous."]],
              [['say', 'veteran', "Tiens. Garde ceci en mémoire de lui."], ['give', 'lait', 1], ['flag', 'lait_donne', true]]]
          ] },
        { id: 'fidele', name: 'Un fidèle', at: ['mosquee_porte', 1, 0], look: { kind: 'homme', robe: '#9a8a6c', head: '#ebe3d0' },
          talk: [['say', 'fidele', "Ils étaient au premier rang de la prière, l'an dernier. Aujourd'hui ils campent à Harûrâ' et nous disent sortis de la foi."]] },
        { id: 'crieur', name: 'Un sécessionniste', at: ['mosquee_cour', 2, 2], hidden: true, look: { kind: 'homme', robe: '#4f4a45', head: '#c8c0b0' },
          talk: [['say', 'crieur', "Je n'ai rien à te dire. Le jugement n'appartient qu'à Allah."]] },
        { id: 'sentinelle', name: "Sentinelle de Harûrâ'", map: 'camp', at: ['entree', 1, 0], look: { kind: 'soldat', robe: '#4f4a45', head: '#c8c0b0' },
          talk: [['say', 'sentinelle', "Tu es le cousin de 'Alî. Entre, mais n'attends pas qu'on t'approuve."]] },
        { id: 'ibnkawwa', name: "Ibn al-Kawwâ'", map: 'camp', at: ['feu', -2, 0], look: { kind: 'homme', robe: '#3f4650', head: '#d0c8b8' },
          talk: [['say', 'ibnkawwa', "Je connais cet homme. Les Quraysh sont gens de dispute : ne discutez pas avec lui."]] },
        { id: 'recitant', name: 'Un jeune récitant', map: 'camp', at: 'tentes', look: { kind: 'homme', robe: '#5a544c', head: '#d8d0c0' },
          talk: [['say', 'recitant', "Nous veillons toutes les nuits. Nous jeûnons. Comment des gens qui adorent autant pourraient-ils se tromper ?"]] },
        { id: 'orateur', name: 'Le porte-parole', map: 'camp', at: ['feu', 1, 0], look: { kind: 'ancien', robe: '#45403a', head: '#cfc7b6' },
          talk: [['say', 'orateur', "Nous avons dit ce que nous avions à dire."]] },
        { id: 'repenti', name: 'Un homme de Koufa', map: 'camp', at: ['feu', 0, 2], hidden: true, look: { kind: 'homme', robe: '#7a6c58', head: '#e0d6c2' },
          talk: [['say', 'repenti', "Je rentre. D'autres me suivent."]] },
        { id: 'madan', name: "Ma'dân, notable des greniers", at: ['souk', 0, 1], look: { kind: 'marchand', robe: '#7a4f6a', head: '#e8dcc6' },
          talk: [['say', 'madan', "Ces gens de Harûrâ' sont la honte de Koufa. Un mot du calife, et mes greniers leur seront fermés. Je le dis à qui veut l'entendre."]] },
        { id: 'maitre', name: 'Le maître du cercle', at: 'ecole', look: { kind: 'savant', robe: '#e6e0cf', head: '#f4efe2' },
          talk: [
            ['say', 'maitre', "On crie une phrase aux portes de la ville. Sais-tu où elle se trouve dans le Livre, et ce qui la suit ?"],
            ['say', 'maitre', "Sourate Yûsuf : « Le jugement n'appartient qu'à Allah. Il vous a commandé de n'adorer que Lui. » Elle parle de l'adoration. Une phrase coupée de sa suite, on lui fait dire ce qu'on veut."],
            ['codex', 'phrase_verset'],
            ['if', 'su_verset', [], [['pillar', 'savoir', 1], ['flag', 'su_verset', true]]]
          ] },
        { id: 'temoin', name: 'Un récitant de Koufa', at: ['mosquee_cour', -2, 1], look: { kind: 'homme', robe: '#a39478', head: '#efe7d4' },
          talk: [
            ['say', 'temoin', "J'y étais. Il a fait entrer les récitants, posé devant lui un grand mushaf, et l'a frappé du plat de la main : « Ô mushaf, parle aux gens ! »"],
            ['say', 'temoin', "Nous avons dit : ce n'est que de l'encre sur des feuilles ; c'est nous qui parlons d'après lui. Alors nous avons compris ce qu'il voulait nous faire dire."],
            ['codex', 'mushaf_muet']
          ] },
        { id: 'mazin', name: 'Mâzin, chef des cavaliers de la Butte', map: 'camp', at: ['feu', 2, 1], look: { kind: 'soldat', robe: '#55504a', head: '#d4ccbc' },
          talk: [['say', 'mazin', "J'écoute. Je n'ai pas encore décidé si j'écoute pour répondre ou pour comprendre."]] },
        { id: 'ashtar', name: 'Mâlik al-Ashtar', at: 'ecole', hidden: true, look: { kind: 'soldat', robe: '#5d4a3a', head: '#e4dac6' },
          talk: [['say', 'ashtar', "Je pars pour l'Égypte dès que la lettre sera scellée."]] }
      ],
      foes: [
        { id: 'fk', at: 'palmeraie', group: ['echo', 'echo'], bg: 'ville' },
        { id: 'f2', map: 'noos', at: 'noeud1', group: ['echo', 'clameur', 'echo'], bg: 'noos' },
        { id: 'f3', map: 'noos', at: 'miroir', group: ['clameur', 'clameur'], bg: 'noos' }
      ],
      chests: [
        { map: 'camp', at: ['lignes', 1, 1], gear: 'lance_samhari' },
        { at: ['puits', 0, 1], item: 'eau', n: 1 },
        { map: 'camp', at: ['enclos', 1, 0], item: 'dattes', n: 2 },
        { map: 'camp', at: ['enclos', -1, 1], codex: 'registre_double' },
        { map: 'noos', at: 'faille', item: 'musc', n: 1 }
      ],
      intro: [
        ['title', 'La Parole détournée', 'An 37 de l’Hégire · Harûrâ’'],
        ['nar', "Siffîn, sur l'Euphrate. Deux armées de croyants se font face durant des semaines. Dans chaque rang on prie, et l'on pleure les morts de l'autre. La Chaîne ne s'y attarde pas : elle baisse les yeux."],
        ['nar', "'Ammâr ibn Yâsir y tombe, à plus de quatre-vingt-dix ans. Puis des feuillets du Livre sont levés au bout des lances, et l'on convient de s'en remettre à deux arbitres. Les armes se taisent. Autre chose commence."],
        ['codex', 'siffin'],
        ['nar', "Sur la route du retour, des milliers d'hommes quittent les rangs. Ils refusent l'arbitrage, crient une phrase tirée du Livre, et dressent leurs tentes à Harûrâ', aux portes de Koufa."],
        ['nar', "Avant de parler aux hommes, on se tait devant Celui qui les a faits. Qui se relève de sa prière ne plaide plus pour avoir raison : il plaide pour ramener."],
        ['pray', 'fajr']
      ],
      objectives: [
        { text: "Entendre Qays ibn Sa'd devant la maison", talk: 'qays', then: [
          ['say', 'qays', "Commandeur des croyants, ils sont des milliers à Harûrâ'. Ils se sont donné un chef pour la guerre et un imam pour la prière."],
          ['say', 'ali', "Ont-ils versé le sang ?"],
          ['say', 'qays', "Non. Ils crient, et ils prient."],
          ['say', 'ali', "Alors on ne leur répond pas par le sabre. On leur parle."],
          ['join', 'qays'], ['hide', 'qays'],
          ['codex', 'qays_bio'],
          ['say', 'ibnabbas', "Avant Harûrâ', je passerai par le cercle d'étude et par la mosquée. On ne plaide bien que ce dont on sait d'où on le tient."]
        ] },
        { text: "Gagner la porte nord, vers Harûrâ'", goto: 'porte_nord', then: [
          ['say', 'ibnabbas', "Commandeur des croyants, retarde un peu la prière de midi. Je vais aller parler à ces gens."],
          ['say', 'ali', "Je crains pour toi."],
          ['say', 'ibnabbas', "Ne crains rien. On me sait de bon caractère, et je ne fais de mal à personne."],
          ['nar', "Il revêt son plus beau manteau du Yémen et part seul, à l'heure où le soleil est au plus haut. La Chaîne te fait marcher dans ses pas."],
          ['leave', 'ali'], ['leave', 'qays'],
          ['map', 'camp', 'entree', { time: 'day' }],
          ['nar', "Harûrâ'. « Je n'avais jamais vu, dira Ibn 'Abbâs, de gens plus appliqués à l'adoration » : marqués par les prosternations, épuisés par les veilles. Leur piété n'est pas feinte. C'est ce qui rend l'idole si forte."],
          ['say', 'Une voix', "Bienvenue, Ibn 'Abbâs. Mais que fait sur toi ce manteau de prix ?"],
          ['say', 'ibnabbas', "Que me reprochez-vous ? J'ai vu sur le Messager d'Allah ﷺ les plus beaux manteaux."],
          ['nar', "Près de l'enclos, on décharge des sacs de grain. Du grain de Koufa. Quelqu'un, là-bas, nourrit le camp qu'il maudit en public."]
        ] },
        { text: 'Débattre avec le porte-parole, près du feu', talk: 'orateur', then: [
          ['say', 'ibnkawwa', "Ne discutez pas avec lui ! Les Quraysh sont gens de dispute."],
          ['say', 'Une voix', "Si. Qu'il parle : nous l'écouterons."],
          ['say', 'ibnabbas', "Je viens de la part des Compagnons du Prophète ﷺ. C'est parmi eux que le Coran est descendu, et nul d'entre eux n'est avec vous. Dites-moi ce que vous reprochez à son cousin."],
          ['nar', "Ils avancent trois griefs. Il les écoute jusqu'au bout sans interrompre. La Chaîne te fait entendre ici le premier et le dernier."],
          ['say', 'orateur', "Il a fait juges des hommes dans l'affaire d'Allah. Or le jugement n'appartient qu'à Allah."],
          ['choice', "Que répond Ibn 'Abbâs au premier grief ?", [
            { t: 'Par le Livre : il confie lui-même un jugement à « deux hommes justes »', ok: true, r: [
              ['say', 'ibnabbas', "Allah a remis au jugement des hommes le prix d'un gibier tué en état de sacralisation : « deux hommes justes parmi vous en jugeront » (5:95). Et Il envoie deux arbitres pour réconcilier un foyer (4:35)."],
              ['say', 'ibnabbas', "Je vous adjure par Allah : le jugement des hommes pour épargner le sang et réconcilier les croyants vaut-il moins que pour un lièvre ?"],
              ['say', 'Des voix', "Non… Cela vaut mieux."],
              ['say', 'ibnabbas', "Suis-je sorti de ce grief ?"],
              ['say', 'Des voix', "Par Allah, oui."]
            ] },
            { t: 'Par la menace : le calife a une armée à une heure de marche', r: [
              ['nar', "La chaîne vacille. Ce n'est pas ce qui fut rapporté : il vint seul et sans arme, à l'heure de midi, et n'opposa que des preuves."]
            ] },
            { t: 'Par le mépris : on ne discute pas avec des égarés', r: [
              ['nar', "Non. 'Alî lui-même le laissa aller débattre, et il écouta d'abord leurs griefs jusqu'au bout avant d'y répondre un à un."]
            ] }
          ]],
          ['say', 'orateur', "Il a effacé de l'acte son titre de Commandeur des croyants. S'il n'est pas le commandeur des croyants, de qui l'est-il donc ?"],
          ['choice', "Que répond Ibn 'Abbâs au dernier grief ?", [
            { t: "Qu'un titre n'est qu'un mot, et qu'il importe peu", r: [
              ['nar', "Ce n'est pas l'argument rapporté. Ibn 'Abbâs ne balaya pas leur scrupule : il lui opposa un précédent, et le plus haut qui soit."]
            ] },
            { t: 'Par le précédent de Hudaybiyya', ok: true, r: [
              ['say', 'ibnabbas', "À Hudaybiyya, les polythéistes refusèrent qu'on écrive « Messager d'Allah » sur le traité. Le Prophète ﷺ fit effacer le mot et écrire le nom de son père. Et c'est 'Alî qui tenait le calame."],
              ['say', 'ibnabbas', "Par Allah, le Messager d'Allah ﷺ vaut mieux que 'Alî. S'effacer d'une page l'a-t-il effacé de la prophétie ?"],
              ['say', 'Des voix', "Non, par Allah."]
            ] }
          ]],
          ['nar', "Au second rang, un homme n'a pas crié. Mâzin mène trois cents cavaliers, ceux de la Butte. Il ne demande pas qu'on le réfute : il demande qu'on lui réponde."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'mazin', title: 'Mâzin et les cavaliers de la Butte',
            intro: "Il a quitté ses champs pour une phrase du Livre. Il craint de s'être trompé, et plus encore de l'avouer devant ses hommes.",
            goal: 8,
            rounds: [
              { say: "Tes réponses sont belles, fils de 'Abbâs. Mais la phrase que nous crions est dans le Livre. Diras-tu que le Livre se trompe ?",
                opts: [
                  { t: "Réciter le verset jusqu'au bout : « Il vous a commandé de n'adorer que Lui » (12:40)", el: 'ilm', v: 3, need: 'phrase_verset', r: "Je la récitais sans aller au bout du verset. Trois cents hommes derrière moi, et aucun ne m'a repris." },
                  { t: "Reconnaître que la phrase est vraie, et que c'est son emploi qui s'égare", el: 'sidq', v: 2, r: "Tu ne nies pas la phrase. C'est déjà plus que ce qu'on m'avait dit de toi." },
                  { t: "Dire qu'ils la crient sans l'avoir méditée", el: 'shajaa', v: -1, r: "Voilà le Qurayshite. Nous savons ce que nous récitons, fils de 'Abbâs." }
                ] },
              { say: "On nous a appris que le Livre suffit, et que les hommes le trahissent. Pourquoi faudrait-il des hommes entre le Livre et nous ?",
                opts: [
                  { t: "Raconter le mushaf que 'Alî pria de parler, et qui resta muet", el: 'ilm', v: 3, need: 'mushaf_muet', r: "De l'encre entre deux planchettes… Et nous qui pensions l'entendre crier." },
                  { t: "Rappeler que le Livre lui-même réclame « deux hommes justes »", el: 'adl', v: 2, r: "Des hommes justes. Encore faut-il qu'ils le soient." },
                  { t: "Lui demander qui lui a appris à lire", el: 'rahma', v: 1, r: "Mon père. Sur une omoplate de chameau. Un homme, oui." }
                ] },
              { say: "Mes hommes ont laissé leurs moissons pour cette phrase. Si je les ramène, on dira que Mâzin a eu peur.",
                opts: [
                  { t: "Dire qu'il faut plus de cœur pour revenir d'une erreur que pour s'y tenir", el: 'sabr', v: 2, r: "Plus de cœur… Mon père le disait du chamelier qui rebrousse chemin avant le puits à sec." },
                  { t: "Assurer que nul à Koufa ne leur fera honte : leur place et leur part les attendent", el: 'rahma', v: 2, r: "Notre part ? Après ce que nous avons crié ?" },
                  { t: "Le presser de se décider sur-le-champ", el: 'shajaa', v: -2, r: "On ne presse pas trois cents hommes comme on pousse un âne. Tu viens de perdre ce que tu avais gagné." }
                ] },
              { say: "Un homme de Koufa nous a fait dire que 'Alî marcherait sur nous avant la fin du mois. Pourquoi te croirais-je, toi plutôt que lui ?",
                opts: [
                  { t: "Montrer le feuillet de comptes : celui qui les a prévenus leur vend aussi leur grain", el: 'sidq', v: 3, need: 'registre_double', r: "Cette écriture, je la connais. Il nous jurait que c'était par amour du Livre." },
                  { t: "Faire remarquer qu'il est venu seul, sans arme, à midi", el: 'sidq', v: 2, r: "C'est vrai. Un homme qui prépare une attaque n'envoie pas son cousin." },
                  { t: "Répéter la parole du calife : jamais le premier coup", el: 'adl', v: 1, r: "Une parole. Nous verrons ce qu'elle pèse." }
                ] }
            ],
            win: [
              ['say', 'mazin', "Je ramène mes hommes à Koufa. Et si cette phrase se dresse encore contre vous, fils de 'Abbâs, ceux de la Butte seront là pour lui rendre sa suite."],
              ['flag', 'allie_mazin', true],
              ['pillar', 'lien', 1]
            ],
            lose: [
              ['say', 'mazin', "Tu parles bien. Mais on ne ramène pas trois cents hommes sur de belles paroles. Nous restons près de nos feux."],
              ['pillar', 'lien', -1]
            ]
          }],
          ['nar', "Une partie de l'assemblée se tait. L'autre reprend la phrase, plus fort, pour ne plus entendre. Et dans l'envers du camp, des milliers de voix qui répètent sans comprendre se dressent d'un seul bloc."],
          ['join', 'ali'], ['join', 'qays'],
          ['nar', "Nul ne plaide seul dans la noosphère : le savoir de 'Alî et la droiture de Qays y marchent avec Ibn 'Abbâs."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 285 }],
        ] },
        { text: 'Faire taire les échos', foe: 'f2', then: [
          ['say', 'qays', "Aucun d'eux n'a lu la phrase qu'il crie. Ils se la passent de bouche en bouche comme un mot d'ordre."],
          ['give', 'musc', 1]
        ] },
        { text: 'Atteindre le cœur de la formule', goto: 'coeur', then: [
          ['say', 'ibnabbas', "Il n'a pas de corps : c'est une phrase. Le fer passera au travers. Rendons-lui son sens — le savoir et le vrai le feront taire."],
          ['codex', 'slogan'],
          ['heal'],
          ['battle', { group: ['slogan'], bg: 'noos', boss: true, intro: 'Je suis une parole vraie. Qui oserait me contredire ?',
                       allies: [{ flag: 'allie_mazin', name: 'Les cavaliers de la Butte' }] }],
          ['sfx', 'break'],
          ['nar', "L'étendard de mots se défait, lettre à lettre. La phrase retombe où elle était : dans le Livre, entière, avec ce qui la précède et ce qui la suit."],
          ['map', 'camp', 'feu', { time: 'dusk' }],
          ['show', 'repenti'],
          ['say', 'repenti', "Je croyais défendre le Livre. Je ne défendais qu'une phrase que j'avais cessé d'écouter. Je rentre à Koufa."],
          ['nar', "Deux mille hommes se lèvent ce jour-là et reprennent la route de la ville — davantage, selon d'autres récits. Les autres restent près de leurs feux, et se taisent."],
          ['if', 'allie_mazin',
            [['nar', "Parmi eux, trois cents cavaliers marchent en ordre derrière Mâzin. Ceux-là, la Chaîne ne les compte pas : elle les a imaginés. Mais elle sait qu'il y en eut de semblables."]],
            [['nar', "Ceux de la Butte ne se lèvent pas. Mâzin regarde longtemps la route de Koufa, rajuste la sangle de son cheval, et ne dit rien."]]],
          ['codex', 'harura'],
          ['map', 'koufa', 'mosquee_porte', { time: 'dusk' }],
          ['leave', 'ibnabbas'], ['join', 'ibnabbas'],
          ['nar', "Ce soir-là, à la mosquée de Koufa, les rangs sont plus longs de deux mille hommes."],
          ['pray', 'maghrib'],
          ['show', 'crieur'],
          ['nar', "Les semaines passent. Ceux qui ne sont pas revenus entrent pourtant dans Koufa, et jusque dans la mosquée. Quand 'Alî prêche, des voix s'élèvent des recoins."]
        ] },
        { text: 'Entrer dans la cour de la mosquée', goto: 'mosquee_cour', then: [
          ['say', 'crieur', "Le jugement n'appartient qu'à Allah !"],
          ['say', 'Une autre voix', "Le jugement n'appartient qu'à Allah !"],
          ['quote', 'Parole de vérité par laquelle on vise le faux.', "'Alî ibn Abî Tâlib — Muslim"],
          ['choice', 'Ils l’interrompent en pleine mosquée. Que décide le calife ?', [
            { t: 'Les faire arrêter avant qu’ils ne nuisent', r: [
              ['nar', "La chaîne vacille. Il refusa de punir une intention : tant qu'ils ne levaient pas l'épée, ils gardaient leur place dans les rangs."]
            ] },
            { t: 'Leur reconnaître trois droits, tant qu’ils ne versent pas le sang', ok: true, r: [
              ['quote', "Vous avez sur nous trois droits : nous ne vous interdirons pas les mosquées d'Allah pour y évoquer Son nom ; nous ne vous priverons pas de votre part tant que vos mains seront avec les nôtres ; et nous ne vous combattrons pas les premiers.", "'Alî ibn Abî Tâlib — Ibn Abî Shayba, al-Musannaf ; at-Tabarî, Târîkh"]
            ] },
            { t: 'Leur interdire la mosquée', r: [
              ['nar', "Non. Ce fut le premier des droits qu'il leur garantit : nul ne leur fermerait les mosquées d'Allah."]
            ] }
          ]],
          ['say', 'qays', "Ils t'ont déclaré sorti de la foi, et tu leur gardes leur part du trésor."],
          ['say', 'ali', "Ils ont dit une parole. Je ne verse pas le sang pour une parole."],
          ['codex', 'parole_verite'],
          ['say', 'madan', "Trois droits à ceux qui t'insultent ! Laisse-moi au moins leur fermer mes greniers, Commandeur des croyants : je ne songe qu'à ta gloire."],
          ['say', 'ali', "On ne retire pas le pain pour une parole."],
          ['show', 'ashtar'],
          ['nar', "An 38. L'Égypte vacille. 'Alî y envoie le plus ferme de ses lieutenants, Mâlik al-Ashtar, qui attend ses consignes au cercle d'étude."]
        ] },
        { text: "Remettre ses consignes à Mâlik al-Ashtar, au cercle d'étude", talk: 'ashtar', then: [
          ['mus', 'conseil'],
          ['say', 'ashtar', "Commandeur des croyants, je pars gouverner un pays dont la plupart des habitants ne prient pas comme nous. Que leur dois-je ?"],
          ['nar', "On rapporte qu'il lui remit une longue lettre. La Chaîne ne la tient pas pour certaine dans chacun de ses mots ; elle la transmet comme on la lui a transmise."],
          ['ask', 'Quelle consigne lire la première ?', [
            { t: 'Sur ceux qu’il gouvernera', r: [
              ['quote', "Emplis ton cœur de miséricorde pour tes administrés. […] Ils sont de deux sortes : ou bien ton frère en religion, ou bien ton semblable dans la création.", "On rapporte — lettre de 'Alî à Mâlik al-Ashtar, Nahj al-Balâgha (attribution discutée)"]
            ] },
            { t: 'Sur le choix des juges', r: [
              ['quote', "Choisis, pour juger entre les gens, le meilleur de tes administrés : celui que les affaires n'accablent pas, que les plaideurs n'irritent pas, et qui ne persiste pas dans l'erreur.", "On rapporte — lettre de 'Alî à Mâlik al-Ashtar, Nahj al-Balâgha (attribution discutée)"]
            ] },
            { t: 'Sur les flatteurs', r: [
              ['quote', "Attache-toi aux gens scrupuleux et véridiques ; puis accoutume-les à ne pas te couvrir d'éloges, ni à te réjouir d'un bien que tu n'as pas fait.", "On rapporte — lettre de 'Alî à Mâlik al-Ashtar, Nahj al-Balâgha (attribution discutée)"]
            ] }
          ]],
          ['say', 'ibnabbas', "Frère en religion, ou semblable dans la création. Il n'a laissé personne dehors."],
          ['codex', 'ashtar'],
          ['pillar', 'justice', 1], ['pillar', 'lien', 1],
          ['nar', "Al-Ashtar part pour l'Égypte. Il n'y arrivera pas : il meurt en route, à al-Qulzum. La lettre, elle, a fait le voyage jusqu'à nous."]
        ] }
      ],
      outro: [
        ['nar', "Ceux qui restent irréductibles quittent Koufa de nuit, un à un, par petits groupes. Ils se donnent rendez-vous près d'un canal, à l'est du Tigre. Son nom : Nahrawân."],
        ['say', 'ibnabbas', "Le Slogan est tombé. Mais ce qui le criait cherche déjà une autre forme."]
      ]
    },

    /* ═════ Chapitre 3 ═════ */
    {
      id: 'a3', title: 'Nahrawân, puis l’aube', sub: 'An 38–40 H · 658–661 · Nahrawân, Koufa',
      // bataille déclarée, sans rangs : la bataille de Nahrawân est racontée, non rejouée
      bataille: { rangs: [], mot: 'La bataille de Nahrawân est racontée, non rejouée. Contre le Juge, il n’y a pas de rangs à mener : on ne range pas des hommes contre une phrase.' },
      map: 'camp', opts: { time: 'day' }, start: 'entree',
      party: ['ali', 'ibnabbas', 'qays'],
      npcs: [
        { id: 'eclaireur', name: 'Un éclaireur', at: ['entree', 2, 0], look: { kind: 'soldat', robe: '#6b5a48', head: '#d6ccb8' },
          talk: [['say', 'eclaireur', "Ils sont rangés derrière le canal. Ils n'ont pas reculé d'un pas."]] },
        { id: 'soldat', name: 'Un soldat de Koufa', at: 'feu', look: { kind: 'soldat', robe: '#7a5a44', head: '#dcd2be' },
          talk: [['say', 'soldat', "Nous marchions vers la Syrie. Mais comment laisser derrière nous, près de nos familles, des gens qui tuent sur un soupçon ?"]] },
        { id: 'vieux', name: 'Un vieux récitant', at: 'tentes', look: { kind: 'ancien', robe: '#8a7c66', head: '#ece4d2' },
          talk: [
            ['say', 'vieux', "J'ai prié épaule contre épaule avec certains d'entre eux. Ce soir je ne sais plus pour qui invoquer. Alors j'invoque pour tous."],
            ['say', 'vieux', "Sais-tu ce que le fils de Khabbâb leur a transmis avant de mourir ? La parole de son père : dans la discorde, celui qui reste assis vaut mieux que celui qui se lève."],
            ['codex', 'ibn_khabbab'],
            ['if', 'pain_donne',
              [['say', 'vieux', "Que la paix revienne, voilà tout."]],
              [['say', 'vieux', "Prends ce pain. On ne tient pas debout le ventre vide."], ['give', 'pain', 2], ['flag', 'pain_donne', true]]]
          ] },
        { id: 'abuayyub', name: 'Abû Ayyûb al-Ansârî', at: 'etendard', look: { kind: 'compagnon', robe: '#e2dccb', head: '#f3eee1', aura: '#5fe0d0' },
          talk: [['say', 'abuayyub', "Le Messager d'Allah ﷺ a logé sous mon toit, à Médine. Je n'aurais jamais cru porter un étendard contre des gens qui prient."]] },
        { id: 'farwa', name: 'Farwa ibn Nawfal', at: ['etendard', 2, 1], hidden: true, look: { kind: 'soldat', robe: '#4f4a45', head: '#c8c0b0' },
          talk: [['say', 'farwa', "Je me retire. Je ne lèverai l'épée que le jour où j'y verrai clair."]] },
        { id: 'ibnnabbah', name: "Ibn an-Nabbâh, le muezzin", map: 'koufa', at: ['maison', 1, 1], look: { kind: 'homme', robe: '#a89878', head: '#f0e8d6' },
          talk: [['say', 'ibnnabbah', "Commandeur des croyants, c'est l'heure. L'aube est proche."]] },
        { id: 'veilleur', name: 'Un veilleur', map: 'koufa', at: 'place', look: { kind: 'homme', robe: '#6d6456', head: '#ddd4c0' },
          talk: [['say', 'veilleur', "Les nuits de Ramadan sont douces à Koufa. On l'a vu, hier, regarder longtemps le ciel."]] },
        { id: 'hasan', name: 'Al-Hasan', map: 'koufa', at: ['mosquee_porte', 1, 1], hidden: true, look: { kind: 'compagnon', robe: '#e6dfcc', head: '#f4efe2', aura: '#ffe9a8' },
          talk: [['say', 'hasan', "Nous ferons ce qu'il a dit. Rien de plus."]] },
        { id: 'madan', name: "Ma'dân, notable des greniers", at: ['tente_chef', 2, 1], look: { kind: 'marchand', robe: '#7a4f6a', head: '#e8dcc6' },
          talk: [['say', 'madan', "Mes convois suivent l'armée, Commandeur des croyants. Rien ne manquera, tant que la campagne dure."]] },
        { id: 'doyen', name: 'Le doyen des récitants', at: ['etendard', 3, 2], hidden: true, look: { kind: 'ancien', robe: '#4f4a45', head: '#d2cabb' },
          talk: [['say', 'doyen', "Je ne sais pas partir. Je ne sais plus rester."]] }
      ],
      foes: [
        { id: 'f1', at: 'lignes', group: ['lame', 'lame'], bg: 'camp' },
        { id: 'f2', map: 'noos', at: 'noeud2', group: ['scrupule', 'lame'], bg: 'noos' },
        { id: 'f3', map: 'noos', at: 'miroir', group: ['lame', 'lame', 'lame'], bg: 'noos' }
      ],
      chests: [
        { at: ['feu', 1, 1], gear: 'arc_double' },
        { at: ['enclos', 1, 0], item: 'eau', n: 2 },
        { at: ['tertre', 0, 1], item: 'siwak', n: 1 },
        { map: 'noos', at: 'faille', item: 'lait', n: 1 }
      ],
      intro: [
        ['title', 'Nahrawân, puis l’aube', 'An 38 de l’Hégire'],
        ['nar', "Ils sont quatre mille au bord du canal de Nahrawân. Ils se sont choisi un chef, et ont jugé le monde entier : quiconque ne pense pas comme eux a quitté la foi, et son sang ne compte plus."],
        ['nar', "Sur leur route passe un voyageur : 'Abdallâh, fils du Compagnon Khabbâb, avec les siens. Ils l'interrogent. Ses réponses sont celles d'un croyant. Ils le tuent, et les siens avec lui."],
        ['nar', "Le même jour, rapporte-t-on, l'un d'eux ramasse une datte tombée d'un palmier ; ses compagnons le reprennent : « Tu l'as prise sans en payer le prix ! » Scrupule pour une datte. Aucun pour le sang."]
      ],
      objectives: [
        { text: "Entendre le rapport de l'éclaireur", talk: 'eclaireur', then: [
          ['say', 'eclaireur', "Commandeur des croyants. Ils ont tué le fils de Khabbâb sur la route, et les siens. Ton émissaire, al-Hârith ibn Murra, est allé leur demander compte : ils l'ont tué aussi."],
          ['say', 'ali', "Qu'on leur porte ceci : livrez-nous les meurtriers de nos frères, et je vous laisse. Peut-être Allah retournera-t-Il vos cœurs."],
          ['nar', "La réponse revient avant le soir, d'une seule voix."],
          ['quote', 'Nous les avons tous tués. Et nous tenons tous leur sang et le vôtre pour licite.', "Réponse des gens de Nahrawân — at-Tabarî, Târîkh"],
          ['say', 'qays', "Ils ne disent pas « l'un de nous ». Ils disent « tous ». Ils ne forment plus qu'un seul juge."],
          ['give', 'eau', 1]
        ] },
        { text: "Entendre Ma'dân, qui presse d'attaquer (près de la tente du chef)", talk: 'madan', then: [
          ['mus', 'conseil'],
          ['say', 'madan', "Commandeur des croyants, frappe cette nuit ! Ils dorment. Chaque jour d'attente coûte à l'armée : je le sais, c'est moi qui la nourris."],
          ['nar', "Ma'dân parle fort, et son regard revient souvent vers les convois. À Harûrâ' déjà, quelqu'un nourrissait le camp d'en face."],
          ['ask', "Ma'dân pousse à frapper sans attendre. Que lui oppose-t-on ?", [
            { t: 'Lui mettre sous les yeux le registre aux deux colonnes', need: 'registre_double', r: [
              ['say', 'ibnabbas', "Une colonne pour Koufa, une colonne pour Harûrâ'. La même main, Ma'dân. Et à chaque camp tu as fait dire que l'autre allait frapper."],
              ['say', 'madan', "Je… je tenais les deux portes ouvertes, voilà tout. Il faut bien que quelqu'un se parle, dans une discorde."],
              ['nar', "On ne le frappe pas, on ne le chasse pas. On lui retire la garde des greniers, et l'on fait lire ses comptes devant l'armée. Pour un homme qui vivait de n'être pas vu, c'est assez."],
              ['flag', 'madan_demasque', true],
              ['pillar', 'justice', 1]
            ] },
            { t: "L'écarter sans l'accuser : on ne condamne pas sur un bruit", r: [
              ['say', 'ali', "Nous ne frapperons pas les premiers. Retourne à tes convois."],
              ['nar', "Ma'dân s'incline et sort. Nul ne sait encore à combien de feux il se chauffe."]
            ] },
            { t: 'Le chasser du camp sur ce soupçon', r: [
              ['say', 'ibnabbas', "Sur un soupçon ? Regarde de l'autre côté du canal : voilà où mène de condamner sans preuve."],
              ['nar', "On le rappelle. Mais le mot a été dit, et le camp l'a entendu : ce soir-là, plus d'un regarde son voisin de travers."],
              ['pillar', 'justice', -1]
            ] }
          ]]
        ] },
        { text: 'Dissiper les Lames pieuses aux abords des lignes', foe: 'f1', then: [
          ['say', 'ibnabbas', "Elles sont certaines de servir le bien. C'est une certitude sans savoir : rien ne coupe plus aveuglément."],
          ['nar', "La nuit tombe sur les deux rives. La sentinelle qui veille ne garde pas seulement un camp : elle garde la possibilité que demain quelqu'un traverse encore le canal. Tant qu'un seul peut revenir, la parole n'a pas fini son ouvrage."],
          ['pray', 'isha'],
          ['nar', "Au matin, les deux rangs sont face à face."]
        ] },
        { text: "Rejoindre Abû Ayyûb à l'étendard", talk: 'abuayyub', then: [
          ['say', 'abuayyub', "L'étendard est prêt, Commandeur des croyants. Dis-moi ce qu'il doit annoncer."],
          ['choice', 'Les deux rangs se font face. Que commande le calife ?', [
            { t: "Charger avant l'aube, tant qu'ils dorment", r: [
              ['nar', "La chaîne vacille. Ce n'est pas ce qui fut rapporté : il défendit à ses hommes de frapper les premiers, et attendit que l'autre rang engage le combat."]
            ] },
            { t: 'Lever le camp : on ne combat pas des gens qui prient', r: [
              ['nar', "Non plus. Le sang d'innocents avait coulé sur la route, et tous s'en réclamaient. Se retirer, c'était leur abandonner chaque voyageur d'Irak."]
            ] },
            { t: 'Dresser une bannière de sûreté, et ne pas frapper le premier', ok: true, r: [
              ['say', 'ali', "Annonce : qui rejoint cette bannière est en sûreté. Qui rentre à Koufa ou gagne al-Madâ'in est en sûreté. Nous ne réclamons que ceux qui ont tué nos frères."],
              ['say', 'ali', "Et vous autres : ne les combattez pas tant qu'ils ne vous ont pas combattus."]
            ] }
          ]],
          ['show', 'farwa'],
          ['say', 'farwa', "Par Allah, je ne sais plus pour quelle raison nous combattrions 'Alî. Je me retire, jusqu'à y voir clair."],
          ['nar', "Farwa ibn Nawfal s'éloigne avec cinq cents cavaliers. D'autres suivent, par groupes. De quatre mille, il en reste moins de trois mille autour de leur chef."],
          ['show', 'doyen'],
          ['nar', "Au bord du canal, un groupe hésite encore : des récitants, serrés autour d'un vieil homme. Qays s'avance vers eux, les mains ouvertes. C'est la dernière ambassade."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'doyen', title: 'La dernière ambassade',
            intro: "Il n'a tué personne. Il a veillé, jeûné, crié avec les autres. Il ne sait plus comment partir sans tout renier.",
            goal: 8,
            rounds: [
              { say: "Nous avons veillé et jeûné pour cette cause. Si nous passons sous votre bannière, que restera-t-il de nos nuits ?",
                opts: [
                  { t: "Dire que rien n'en est perdu : c'est le sang qu'on leur demande de quitter, non la veille", el: 'rahma', v: 2, r: "Tu ne dis pas que nos prières étaient fausses. Les nôtres le disent des vôtres." },
                  { t: "Répondre que nul ici ne tient le compte de ce qu'Allah agrée", el: 'sabr', v: 1, r: "C'est vrai. Je l'avais oublié, à force de compter." },
                  { t: "Rappeler le nombre de l'armée rangée derrière soi", el: 'shajaa', v: -1, r: "Je sais compter. Ce n'est pas le nombre qui me fera traverser." }
                ] },
              { say: "On nous a fait dire que ta bannière est un piège : qui s'y rend sera désarmé, puis jugé.",
                noir: { name: "Le Désespoir", group: ['noir_desespoir'], intro: "Il ne défend plus sa cause : il ne voit plus de porte. Partir serait tout renier, rester serait tout perdre. C'est cela qui répond, et non lui.", after: "Il y aurait donc une porte… Dis toujours." },
                opts: [
                  { t: "Montrer d'où vient ce bruit : un homme qui vend du grain aux deux rives", el: 'sidq', v: 3, need: 'registre_double', r: "Ma'dân… Il nous jurait qu'il risquait sa vie pour nous prévenir." },
                  { t: "Nommer celui qui la tient : Abû Ayyûb, l'hôte du Messager d'Allah ﷺ", el: 'sidq', v: 2, r: "Abû Ayyûb… Non. Pas lui. Il ne prêterait pas son nom à un piège." },
                  { t: "Dire que le calife n'a jamais manqué à une sûreté donnée", el: 'adl', v: 1, r: "Tu le dis. Je n'ai que ta parole pour cela." }
                ] },
              { say: "Et si nous rentrons, que fera-t-il de gens qui l'ont déclaré sorti de la foi ?",
                opts: [
                  { t: "Rappeler les trois droits qu'il leur garantit à Koufa, quand on l'insultait en pleine mosquée", el: 'adl', v: 3, need: 'parole_verite', r: "J'y étais. J'ai crié avec les autres. Il ne nous a pas fait sortir." },
                  { t: "Redire ses mots : il ne réclame que les meurtriers ; qui rentre est en sûreté", el: 'rahma', v: 2, r: "Seulement ceux qui ont tué ? Rien pour ce que nous avons dit ?" },
                  { t: "Promettre plus que le calife n'a dit : des charges, des honneurs", el: 'shajaa', v: -2, r: "Tu promets trop, fils de Sa'd. Le calife n'a parlé que de sûreté ; c'était plus digne." }
                ] },
              { say: "Les nôtres répondent : « nous l'avons tous tué ». Je n'y étais pas. Mais si je pars, je les renie.",
                opts: [
                  { t: "Redire ce que le fils de Khabbâb leur transmit : dans la discorde, celui qui reste assis vaut mieux", el: 'ilm', v: 3, need: 'ibn_khabbab', r: "Il leur a dit cela ? Et ils l'ont tué quand même… Alors c'est lui que je renierais en restant." },
                  { t: "Dire que crier « tous » ne fait pas de lui un meurtrier, mais que rester demain en fera un", el: 'sidq', v: 2, r: "Demain… Oui. C'est demain que je deviens ce qu'ils disent." },
                  { t: "Dire qu'on ne renie pas des frères en refusant leur faute", el: 'rahma', v: 1, r: "C'est ce que je me répète la nuit. Venant d'un autre, cela pèse davantage." }
                ] }
            ],
            win: [
              ['nar', "Le doyen plie son tapis. Une centaine de récitants passent le canal derrière lui et vont s'asseoir sous la bannière d'Abû Ayyûb. Ceux-là sont de fiction ; la bannière, et ceux qu'elle sauva, ne le sont pas."],
              ['flag', 'retour_nahrawan', true],
              ['pillar', 'lien', 1]
            ],
            lose: [
              ['say', 'doyen', "Je ne sais pas partir. Qu'Allah me pardonne, et toi aussi, fils de Sa'd."],
              ['nar', "Le vieil homme retourne vers les siens. La parole n'a pas suffi ; elle aura du moins été dite jusqu'au bout."],
              ['pillar', 'lien', -1]
            ]
          }],
          ['say', 'qays', "Serviteurs d'Allah ! Livrez-nous ceux que nous réclamons, et revenez à ce que vous avez quitté !"],
          ['nar', "Ils ne répondent que par leur cri, et chargent : « En route vers le Paradis ! » Dans l'envers de la plaine, une balance immense se dresse. Elle n'a qu'un plateau."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 215 }],
        ] },
        { text: 'Briser le Scrupule inversé', foe: 'f2', then: [
          ['say', 'ali', "Il pèse la datte et ne voit pas le sang. Voilà ce que devient la règle quand on en retire le savoir."]
        ] },
        { text: 'Atteindre le cœur de la balance', goto: 'coeur', then: [
          ['say', 'ibnabbas', "La justice seule ne l'entamera pas : il s'en croit le nom. Frappe-le de savoir et de miséricorde — ce sont les deux choses qu'il n'a jamais pesées."],
          ['heal'],
          ['battle', { group: ['juge'], bg: 'noos', boss: true, intro: 'Je n’ai pas besoin de t’entendre. Je sais déjà ce que tu es.',
                       allies: [{ flag: 'allie_mazin', name: 'Les cavaliers de la Butte' }, { flag: 'retour_nahrawan', name: 'Les récitants revenus sous la bannière' }] }],
          ['sfx', 'break'],
          ['nar', "La balance se brise. Dans la plaine, tout est déjà fini : la bataille n'a pas duré une matinée. Du côté de 'Alî, on compte moins de dix morts."],
          ['map', 'camp', 'tertre', { time: 'dusk' }],
          ['nar', "Il marche parmi les tombés, sans joie. Un homme l'arrête : « Commandeur des croyants, étaient-ils des polythéistes ? »"],
          ['choice', "Ils l'avaient déclaré mécréant. Que répond 'Alî ?", [
            { t: '« Oui. Qui excommunie mérite de l’être. »', r: [
              ['nar', "La chaîne vacille. C'est précisément l'idole qu'il vient de briser : il refusa de leur rendre l'anathème qu'ils lui avaient jeté."]
            ] },
            { t: '« Du polythéisme, ils ont fui. »', ok: true, r: [
              ['quote', "Du polythéisme, ils ont fui. […] Les hypocrites n'évoquent Allah que très peu. […] Ce sont des gens qui se sont dressés contre nous.", "'Alî ibn Abî Tâlib, interrogé sur les gens de Nahrawân — Ibn Abî Shayba, al-Musannaf"]
            ] },
            { t: '« Ce sont des hypocrites. »', r: [
              ['nar', "Ce n'est pas ce qui fut rapporté. On le lui demanda aussi, et il répondit que les hypocrites n'évoquent Allah que très peu — or ceux-là L'évoquaient jour et nuit."]
            ] }
          ]],
          ['nar', "Il refuse de leur rendre le mot. L'idole du Juge, pour la première fois, ne trouve rien à quoi se nourrir."],
          ['codex', 'nahrawan'],
          ['codex', 'juge'],
          ['nar', "Deux années passent. La Syrie, l'Égypte, les routes : rien n'est apaisé. À Koufa, 'Alî dit parfois sa lassitude, et il continue. Ramadan de l'an 40."],
          ['leave', 'ibnabbas'], ['leave', 'qays'],
          ['map', 'koufa', 'maison', { time: 'dawn' }],
          ['say', 'ibnnabbah', "Commandeur des croyants, c'est l'heure de la prière."]
        ] },
        { text: "Marcher vers la mosquée pour la prière de l'aube", goto: 'mosquee_porte', then: [
          ['nar', "Avant l'aube, comme chaque jour, il sort en réveillant les gens sur son passage."],
          ['say', 'ali', "La prière ! La prière, serviteurs d'Allah !"],
          ['wait', 700],
          ['nar', "Une ombre se détache du seuil. Un cri : « Le jugement est à Allah, 'Alî — non à toi ! » La phrase de Harûrâ' est devenue une lame."],
          ['sfx', 'hit'], ['flash', '#ffffff'], ['shake', 700],
          ['wait', 900],
          ['mus', 'deuil'],
          ['nar', "Il ne laisse pas la prière se perdre : on rapporte qu'il fit avancer Ja'da ibn Hubayra pour la diriger à sa place."],
          ['pray', 'fajr'],
          ['show', 'hasan'],
          ['nar', "On le porte chez lui. On saisit l'homme : 'Abd ar-Rahmân ibn Muljam, venu venger ceux de Nahrawân. On l'amène, lié."],
          ['say', 'hasan', "Père. L'homme est là. Qu'ordonnes-tu ?"],
          ['choice', "Son meurtrier est devant lui. Qu'ordonne 'Alî ?", [
            { t: '« Qu’on le châtie longuement, pour l’exemple. »', r: [
              ['nar', "La chaîne vacille. Ce n'est pas ce qui fut rapporté : il interdit toute mutilation et toute cruauté envers l'homme qui venait de le frapper."]
            ] },
            { t: '« Que le sang des siens réponde du mien. »', r: [
              ['nar', "Non. Il défendit expressément qu'on verse le sang d'autres musulmans en son nom : seul le meurtrier répondrait de son acte."]
            ] },
            { t: '« Nourrissez-le, et traitez-le bien. »', ok: true, r: [
              ['quote', "Nourrissez-le bien et donnez-lui une couche douce. Si je vis, je serai seul juge de mon sang. Si je meurs, une frappe pour sa frappe — et ne mutilez pas l'homme.", "'Alî ibn Abî Tâlib — on rapporte, Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh"],
              ['quote', "N'allez pas verser le sang des musulmans en criant : « On a tué le Commandeur des croyants ! » Que seul mon meurtrier réponde de moi.", "'Alî ibn Abî Tâlib — on rapporte, at-Tabarî, Târîkh"]
            ] }
          ]],
          ['codex', 'consignes'],
          ['nar', "Sur son lit, celui qu'on avait condamné au nom d'Allah protège son propre meurtrier de la vengeance. Le Juge sans miséricorde n'a jamais connu pire défaite."]
        ] }
      ],
      outro: [
        ['say', 'hasan', "Il nous a appris le droit jusqu'à son dernier souffle. Sa dernière leçon portait sur l'homme qui l'a frappé."],
        ['if', 'madan_demasque',
          [['nar', "Les comptes de Ma'dân furent lus à Koufa après ceux de l'armée. On ne le revit plus aux greniers. Toute discorde a ses marchands ; celle-ci en eut un de moins."]],
          [['nar', "Ma'dân vendit du grain aux deux rives jusqu'au dernier jour, et jura à chacun sa fidélité. Nul ne le sut. C'est ainsi que durent les discordes : par ceux qui en vivent."]]],
        ['nar', "Le jour se lève sur Koufa. Dans la mosquée, on prie sans lui. Dans la noosphère, une lumière violette demeure au-dessus de la ville : elle ne s'éteindra plus."]
      ]
    }
  ]
});
