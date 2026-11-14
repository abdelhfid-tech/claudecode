/* ISNAD — histoire-cadre : Idris, râwî de la Cité-Miroir (prologue et dernier maillon). */
ISNAD.registerSaga({
  id: 'idris', order: 0, frame: true,
  name: 'Idris', epithet: 'Le Râwî', arabic: 'إدريس', years: '1508 H · 2084',
  light: 'sabr', lightName: 'Patience', ambiance: 'cyberpunk',
  tagline: 'Savoir de qui l’on tient ce que l’on sait.',
  intro: [],
  outro: [
    ['quote', 'Que celui qui est présent transmette à l’absent.', 'Parole du Messager d’Allah ﷺ, sermon de l’Adieu — al-Bukhârî et Muslim'],
    ['nar', 'Les idoles changent de nom. La chaîne, elle, ne rompt pas.'],
    ['light', 'sabr']
  ],

  heroes: {
    idris: {
      name: 'Idris', title: 'le Râwî', arabic: 'إدريس', role: 'stratege', el: 'sabr',
      look: { kind: 'cyber', robe: '#2a3048', head: '#1c2030', cloak: '#39424f' },
      skills: [
        { lvl: 1, id: 'tenir', name: 'Tenir bon', desc: 'Résister sans haine : frappe de Patience.', cost: 3, target: 'foe', el: 'sabr', pow: 1.4, anim: 'light' },
        { lvl: 1, id: 'citer', name: 'Citer la source', desc: '« De qui le tiens-tu ? » Révèle les failles d’un égrégore.', cost: 2, target: 'foe', el: 'ilm', pow: 0.7, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 1, id: 'souffle', name: 'Reprendre souffle', desc: 'Rend de la Constance à un compagnon.', cost: 4, target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 9, id: 'l_sidq', name: 'Parole du Véridique', desc: 'La Lumière d’Abû Bakr : dire vrai quand tout vacille.', cost: 6, target: 'foe', el: 'sidq', pow: 1.8, anim: 'pillar' },
        { lvl: 9, id: 'l_adl', name: 'Mesure du Fârûq', desc: 'La Lumière de ’Umar : la même balance pour tous.', cost: 7, target: 'foes', el: 'adl', pow: 1.15, anim: 'wave' },
        { lvl: 9, id: 'l_shajaa', name: 'Le Sabre rengainé', desc: 'La Lumière de Khâlid : le courage de s’effacer.', cost: 6, target: 'foe', el: 'shajaa', pow: 1.8, fx: [{ st: 'dispel' }], anim: 'slash' },
        { lvl: 9, id: 'l_rahma', name: 'Largesse du Généreux', desc: 'La Lumière de ’Uthmân : soigne tout le groupe.', cost: 8, target: 'allies', heal: 0.7, anim: 'heal' },
        { lvl: 9, id: 'l_ilm', name: 'Porte du Savoir', desc: 'La Lumière de ’Alî : comprendre avant de juger.', cost: 6, target: 'foe', el: 'ilm', pow: 1.7, fx: [{ st: 'reveal' }], anim: 'glyph' }
      ],
      limit: { id: 'isnad', name: 'La Chaîne entière', desc: 'De témoin en témoin : toutes les Lumières à la fois.', target: 'foes', el: 'sabr', pow: 2.1, fx: [{ st: 'veil', v: -2 }, { st: 'dispel' }], anim: 'pillar' }
    },
    yunus: {
      name: 'Maître Yûnus', title: 'le Gardien', arabic: 'يونس', role: 'soigneur', el: 'ilm',
      look: { kind: 'ancien', robe: '#6b5a48', head: '#e9e2d0' },
      skills: [
        { lvl: 1, id: 'lecon', name: 'Leçon', desc: 'Une vérité simple, dite sans hâte.', cost: 3, target: 'foe', el: 'ilm', pow: 1.3, anim: 'glyph' },
        { lvl: 1, id: 'panser', name: 'Panser', desc: 'Rend de la Constance à un compagnon.', cost: 4, target: 'ally', heal: 1.15, anim: 'heal' },
        { lvl: 1, id: 'veille', name: 'Veille', desc: 'Régénération pour tout le groupe.', cost: 6, target: 'allies', fx: [{ st: 'regen', turns: 3 }], anim: 'heal' },
        { lvl: 9, id: 'rappel', name: 'Rappel', desc: 'Dissipe le doute et les murmures d’un compagnon.', cost: 4, target: 'ally', heal: 0.4, fx: [{ st: 'cleanse' }], anim: 'light' },
        { lvl: 9, id: 'memoire', name: 'Mémoire vive', desc: 'Rend du Souffle à un compagnon.', cost: 5, target: 'ally', sp: 0.35, anim: 'heal' }
      ],
      limit: { id: 'biblio', name: 'Ce qui fut gardé', desc: 'Relève et soigne tout le groupe.', target: 'allies', heal: 1.1, revive: true, anim: 'heal' }
    },
    salim: {
      name: 'Sâlim', title: 'le Repenti', arabic: 'سالم', role: 'guerrier', el: 'shajaa',
      look: { kind: 'cyber', robe: '#4a2f3a', head: '#2a1c24', cloak: '#2b2530' },
      skills: [
        { lvl: 1, id: 'couper', name: 'Couper le signal', desc: 'Frappe nette.', cost: 3, target: 'foe', el: 'fer', pow: 1.5, anim: 'slash' },
        { lvl: 1, id: 'debrancher', name: 'Débrancher', desc: 'Oser dire non : frappe de Courage, retire les renforts.', cost: 5, target: 'foe', el: 'shajaa', pow: 1.4, fx: [{ st: 'dispel' }], anim: 'burst' },
        { lvl: 1, id: 'brouillage', name: 'Brouillage', desc: 'Ralentit tous les égrégores.', cost: 6, target: 'foes', el: 'fer', pow: 0.7, fx: [{ st: 'spd', v: -1 }], anim: 'wave' },
        { lvl: 9, id: 'front', name: 'Faire front', desc: 'Attire les coups et se renforce.', cost: 4, target: 'self', fx: [{ st: 'taunt', turns: 2 }, { st: 'def', v: 1 }], anim: 'guard' },
        { lvl: 9, id: 'aveu', name: 'L’Aveu', desc: 'Dire ce qu’il a fait : frappe de Véracité.', cost: 6, target: 'foe', el: 'sidq', pow: 1.7, anim: 'light' }
      ],
      limit: { id: 'coupure', name: 'Coupure générale', desc: 'Tous les écrans s’éteignent.', target: 'foes', el: 'shajaa', pow: 2.0, fx: [{ st: 'stun', chance: 0.5 }], anim: 'burst' }
    }
  },

  enemies: {
    notif: { name: 'Notification', art: 'wisp', hue: 190, scale: 1, lvl: 1, tier: 'minion', weak: ['sabr'], veils: 2,
      skills: [{ w: 2, name: 'Rappel insistant', target: 'foe', el: 'fer', pow: 0.8, anim: 'dark' }],
      taunts: ['Regarde. Juste une seconde.', 'Tu as manqué quelque chose.'],
      desc: 'Le plus petit des égrégores du Flux : une faim d’attention, sans corps ni mémoire. Elle se dissipe dès qu’on lui oppose la patience.' },
    tendance: { name: 'La Tendance', art: 'swarm', hue: 320, scale: 1, lvl: 8, tier: 'minion', weak: ['ilm', 'sabr'], veils: 2,
      skills: [{ w: 3, name: 'Défilement', target: 'foes', el: 'fer', pow: 0.55, fx: [{ st: 'spd', v: -1, chance: 0.35 }], anim: 'wave' }],
      taunts: ['Tout le monde regarde. Pas toi ?'],
      desc: 'Ce que tous regardent aujourd’hui et que personne ne saura nommer demain. Elle craint ceux qui prennent le temps de comprendre.' },
    marque: { name: 'La Marque', art: 'lens', hue: 48, scale: 1, lvl: 8, tier: 'minion', weak: ['sidq', 'adl'], veils: 2,
      skills: [{ w: 3, name: 'Désir', target: 'foe', el: 'ilm', pow: 1.1, fx: [{ st: 'doute', turns: 1, chance: 0.3 }], anim: 'dark' }],
      taunts: ['Tu le mérites.'],
      desc: 'Un signe qui promet d’être quelqu’un à qui l’arbore. Dire vrai sur ce qu’elle vend suffit à la ternir.' },
    score: { name: 'Le Score', art: 'scale', hue: 140, scale: 2, lvl: 9, tier: 'elite', weak: ['rahma', 'adl'], veils: 4,
      skills: [{ w: 3, name: 'Notation', target: 'foe', el: 'adl', pow: 1.3, fx: [{ st: 'atk', v: -1, chance: 0.6 }], anim: 'dark' }, { w: 2, name: 'Classement', target: 'foes', el: 'fer', pow: 0.8, anim: 'wave' }],
      phases: [{ at: 0.5, say: 'Vous valez ce que je dis que vous valez.', fx: [{ st: 'atk', v: 1 }] }],
      desc: 'La valeur d’un homme réduite à un nombre que d’autres lui attribuent. Une balance fausse : la miséricorde et la justice la renversent.' },
    flux: { name: 'Le Flux', art: 'wave', hue: 200, scale: 2, lvl: 9, tier: 'elite', weak: ['sabr', 'ilm'], immune: ['fer'], veils: 4,
      skills: [{ w: 3, name: 'Défilement sans fin', target: 'foes', el: 'ilm', pow: 0.8, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'wave' }, { w: 1, name: 'Lecture automatique', target: 'self', fx: [{ st: 'spd', v: 1 }], anim: 'guard' }],
      phases: [{ at: 0.5, say: 'Encore un. Encore un. Encore un.', fx: [{ st: 'spd', v: 1 }] }],
      desc: 'Héritier de la Rumeur : mille voix à la fois, dont aucune ne répond de ce qu’elle dit. On ne le frappe pas ; on cesse de le suivre.' },
    agregor: { name: "L'AGRÉGOR", art: 'idol', hue: 285, scale: 3, lvl: 10, tier: 'boss', weak: ['sidq', 'adl', 'shajaa', 'rahma', 'ilm', 'sabr'], veils: 7,
      skills: [
        { w: 3, name: 'Mille regards', target: 'foes', el: 'ilm', pow: 0.9, fx: [{ st: 'doute', turns: 1, chance: 0.25 }], anim: 'wave' },
        { w: 3, name: 'Culte', target: 'foe', el: 'ilm', pow: 1.5, anim: 'dark' },
        { w: 1, name: 'Agrégation', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'guard' }
      ],
      phases: [
        { at: 0.7, say: 'J’ai été le Clan. J’ai été l’Aigle et le Trône. On m’a brisé. On m’a refait.', fx: [{ st: 'def', v: 1 }] },
        { at: 0.4, say: 'J’ai été le Héros, l’Or, la Rumeur, le Juge. Je ne suis que ce que vous regardez.', fx: [{ st: 'atk', v: 1 }], addSkills: [{ w: 3, name: 'Rappel du Flux', target: 'foes', el: 'fer', pow: 0.9, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'dark' }] },
        { at: 0.15, say: 'Brise-moi. Ils me rallumeront demain sous un autre nom.', fx: [{ st: 'spd', v: 1 }] }
      ],
      taunts: ['Je ne commande pas. J’additionne.', 'Quarante et un millions de regards. Et le tien ?'],
      desc: 'L’agrégateur d’égrégores : une machine qui donne un corps à tout ce que des millions de regards désirent ensemble. Il n’a rien inventé ; il a industrialisé la fabrique des idoles. Chacune des six Lumières est pour lui une faille.' }
  },

  codex: [
    { id: 'noosphere', cat: 'Noosphère', title: 'La noosphère', text: 'Du grec *noûs*, l’esprit. Le mot vient de Vladimir Vernadsky et de Pierre Teilhard de Chardin : la sphère de la pensée humaine, comme il y a une atmosphère et une biosphère. Dans ISNAD, c’est l’envers invisible de chaque lieu : ce que les hommes y pensent, y craignent et y désirent ensemble. C’est là que se livrent les combats.', src: 'Vernadsky, La Biosphère ; Teilhard de Chardin, Le Phénomène humain' },
    { id: 'egregore', cat: 'Noosphère', title: 'L’égrégore', text: 'Une forme née de l’attention de beaucoup de cœurs tournés vers la même chose. Nourri d’une valeur, la véracité, la justice, la miséricorde, il éclaire ceux qui le portent. Nourri de peur, d’orgueil ou d’avidité, il se retourne contre eux. Le jeu emploie ce mot comme une image, non comme une doctrine.' },
    { id: 'idole', cat: 'Noosphère', title: 'L’idole', text: 'Une chose fabriquée par les hommes, et qui finit par les commander. Celles de pierre ont été brisées ; celles de la noosphère reviennent sous d’autres noms : le Clan, l’Empire, le Héros, l’Or, la Rumeur, le Juge sans miséricorde. On ne détruit pas une idole par la haine. On la dévoile : on montre qu’elle est vide.' },
    { id: 'agregor', cat: 'Noosphère', title: 'L’AGRÉGOR', text: 'Le moteur de la Cité-Miroir. Il agrège l’attention de millions de regards et donne un corps à ce qu’ils désirent ensemble : une tendance, une marque, le culte d’une personne. Il ne ment pas et ne commande pas. Il additionne, plus vite que les cœurs ne peuvent juger.' },
    { id: 'isnad', cat: 'Parole', title: 'L’isnâd', text: 'La chaîne de transmission : « Untel m’a rapporté, d’après untel, qui l’a vu. » Des générations de savants ont vérifié chaque maillon, la mémoire et la probité de chaque transmetteur. On rapporte de ’Abdallâh ibn al-Mubârak : « L’isnâd fait partie de la religion ; sans lui, chacun dirait ce qu’il veut. »', src: 'Muslim, introduction du Sahîh' },
    { id: 'lumieres', cat: 'Noosphère', title: 'Les six Lumières', text: 'Véracité (*sidq*), Justice (*’adl*), Courage (*shajâ’a*), Miséricorde (*rahma*), Savoir (*’ilm*), Patience (*sabr*). Chaque saga en rend une à Idris ; la sixième est celle de quiconque transmet. En combat, chacune est une vertu qui dévoile certains égrégores.' },
    { id: 'jour', cat: 'Événement', title: 'Le jour le plus sombre', text: 'Le Messager d’Allah ﷺ meurt à Médine un lundi de Rabî’ al-Awwal de l’an 11 de l’Hégire (juin 632). La communauté, bouleversée, doit décider en quelques heures de ce qu’elle devient. C’est ici que commence la Chaîne.', src: 'Ibn Hishâm, as-Sîra ; al-Bukhârî' },
    { id: 'avertissement', cat: 'Parole', title: 'Avertissement', text: 'ISNAD est une fiction inspirée de sources historiques. Les dialogues sont une dramatisation ; seules les paroles en carton, avec leur source, sont des citations rapportées. Le Prophète ﷺ n’est jamais représenté, et aucun personnage n’a de visage. Toute erreur est celle des auteurs : vérifiez auprès des sources et des savants.' }
  ],

  chapters: [
    {
      id: 'p1', title: 'La Cité-Miroir', sub: 'An 1508 de l’Hégire · 2084', minLvl: 1, last: true,
      map: 'cite', start: 'parvis', party: ['idris'],
      npcs: [
        { id: 'passant1', name: 'Passant', at: ['rue', 0, -1], look: { kind: 'cyber', robe: '#3a3048', head: '#241c30' }, talk: [['say', 'passant1', 'Tu as vu la tendance de midi ? Non ? Alors de quoi veux-tu qu’on parle ?']] },
        { id: 'passant2', name: 'Employé', at: ['ecran', -3, 2], look: { kind: 'cyber', robe: '#2f3f48', head: '#1c2a30' }, talk: [['say', 'passant2', 'Mon score a baissé de trois points. Je ne sais pas ce que j’ai fait. Je ne sais jamais.']] },
        { id: 'vieux', name: 'Vieil homme', at: ['ruelle', 0, -1], look: { kind: 'ancien', robe: '#4a4038', head: '#bdb6a8' }, talk: [['say', 'vieux', 'Autrefois on demandait : « Qui te l’a dit ? » Maintenant on demande : « Combien l’ont vu ? »']] },
        { id: 'gamin', name: 'Enfant', at: ['ecran', 3, 2], look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }, talk: [['say', 'gamin', 'Monsieur, c’est vrai qu’avant le ciel était noir, la nuit, avec des points dedans ?']] },
        { id: 'yunus_n', name: 'Maître Yûnus', hero: 'yunus', map: 'archives', at: 'bureau', talk: [['say', 'yunus_n', 'La Chaîne t’attend au fond de la salle, Idris.']] }
      ],
      chests: [{ map: 'archives', at: ['rayonnages', 2, 1], item: 'dattes', n: 2 }],
      intro: [
        ['title', 'ISNAD', 'An 1508 de l’Hégire · 2084 · Cité-Miroir'],
        ['nar', 'Dans la Cité-Miroir, on ne lève plus les yeux. Le ciel est un écran, et l’écran regarde en retour.'],
        ['nar', 'On l’appelle l’AGRÉGOR. Il ne ment pas. Il ne commande pas. Il additionne : tout ce que des millions de regards désirent ensemble, il lui donne un corps.'],
        ['nar', 'Les anciens avaient un mot pour une chose fabriquée par les hommes et qui finit par les commander. Ils disaient : une *idole*.']
      ],
      objectives: [
        { text: 'Traverser la rue jusqu’au grand écran', goto: 'ecran', then: [
          ['sfx', 'glitch'],
          ['say', 'Le Flux', 'Aujourd’hui, quarante et un millions de regards. Aujourd’hui, vous aimez ceci. Demain, vous l’aurez oublié. Regardez encore.'],
          ['say', 'idris', 'Chaque matin une idole neuve. Chaque soir on la brise pour en dresser une autre. Et personne ne se souvient de la veille.'],
          ['nar', 'Idris est *râwî* aux Archives basses : un transmetteur. Un métier presque disparu, qui consiste à savoir de qui l’on tient ce que l’on sait.']
        ] },
        { text: 'Descendre aux Archives basses (au bout de la rue)', goto: 'ascenseur', then: [
          ['sfx', 'door'], ['map', 'archives', 'entree'],
          ['nar', 'Quarante étages sous la rue, là où le Flux ne descend pas : les Archives basses.']
        ] },
        { text: 'Parler à Maître Yûnus', talk: 'yunus_n', then: [
          ['say', 'yunus_n', 'Te voilà, Idris. Assieds-toi. Ce soir, je te remets ce qu’on m’a remis.'],
          ['say', 'yunus_n', 'Tu sais ce qu’est la *noosphère* ? L’envers de la ville. La sphère de tout ce que les hommes pensent, craignent et désirent. Invisible, et c’est pourtant là que tout se décide.'],
          ['codex', 'noosphere'],
          ['say', 'yunus_n', 'Ce que beaucoup de cœurs regardent ensemble y prend corps. On appelle cela un *égrégore*. Nourri de justice ou de vérité, il éclaire. Nourri de peur ou d’orgueil, il devient idole.'],
          ['codex', 'egregore'], ['codex', 'idole'],
          ['say', 'idris', 'Et l’Agrégor ?'],
          ['say', 'yunus_n', 'Une machine à fabriquer des égrégores, plus vite que les cœurs ne peuvent les juger. Il n’a rien inventé. Il a seulement industrialisé la plus vieille faute du monde.'],
          ['codex', 'agregor'],
          ['sfx', 'glitch'], ['shake', 300],
          ['nar', 'Une lueur froide glisse entre les rayonnages. Le Flux a trouvé un chemin jusqu’ici.'],
          ['say', 'yunus_n', 'Une notification. Un petit égrégore, mais il a faim. Ne le frappe pas avec colère : cherche sa faille. Il ne supporte pas qu’on lui résiste avec patience.'],
          ['battle', { group: ['notif'], bg: 'cite', intro: 'Frappe la faille pour retirer ses voiles ⛊. « Éclairer » porte la Patience d’Idris.' }],
          ['say', 'yunus_n', 'Tu as vu ? On ne détruit pas une idole en la haïssant. On la *dévoile* : on montre qu’elle est vide.'],
          ['ask', 'Que demander à Maître Yûnus ?', [
            { t: 'Pourquoi les idoles reviennent-elles toujours ?', r: [['say', 'yunus_n', 'Parce que le cœur ne reste jamais vide. Ôte-lui ce qui est plus grand que lui, il se prosternera devant ce qui est plus petit : un clan, un chef, un chiffre.']] },
            { t: 'Qu’est-ce que l’isnâd ?', r: [['say', 'yunus_n', 'La chaîne. « Untel m’a rapporté, d’après untel, qui l’a vu. » Des hommes ont passé leur vie à vérifier chaque maillon. C’est ainsi qu’une parole traverse quatorze siècles sans se dissoudre.']] },
            { t: 'Je suis prêt.', r: [['say', 'yunus_n', 'Personne ne l’est. C’est pour cela qu’on ne marche pas seul.']] }
          ]],
          ['codex', 'isnad'],
          ['say', 'yunus_n', 'Il existe une chaîne que l’Agrégor n’a jamais pu agréger. Elle remonte, de témoin en témoin, jusqu’à ceux qui ont vu. Elle est au fond de la salle. Va.']
        ] },
        { text: 'Approcher la Chaîne, au fond des Archives', goto: 'chaine', then: [
          ['sfx', 'light'],
          ['nar', 'Cinq anneaux d’or tournent lentement dans la pénombre. Aucun écran. Seulement des noms, et après chaque nom : « d’après ».'],
          ['say', 'Maître Yûnus', 'Tu ne seras pas eux, Idris. Nul ne le peut. Tu marcheras dans la trace de leurs actes, tels que les transmetteurs les ont rapportés. Si tu t’en écartes, la chaîne vacillera et te ramènera.'],
          ['say', 'Maître Yûnus', 'Elle commence au jour le plus sombre. Le jour où tout aurait pu se défaire.'],
          ['codex', 'lumieres'],
          ['fade', 'out', 900], ['amb', 'vent'], ['flash', '#fff3d0'],
          ['title', 'Médine', '12 Rabî’ al-Awwal, an 11 de l’Hégire · juin 632'],
          ['nar', 'Ce lundi-là, la plus grande lumière que la terre ait portée quitta ce monde. Le Messager d’Allah ﷺ venait de rejoindre son Seigneur.'],
          ['nar', 'Médine vacilla. Des hommes qui avaient affronté des armées restèrent sans voix. D’autres refusèrent d’y croire. Dans le désert, les vieilles idoles relevèrent la tête.'],
          ['nar', 'Ceux qui restaient n’étaient pas des prophètes. C’étaient des hommes. Tout ce qu’ils avaient reçu, il leur fallait maintenant le porter, et le transmettre.'],
          ['codex', 'jour'], ['codex', 'avertissement'],
          ['nar', 'Voici leur chaîne.']
        ] }
      ]
    },
    {
      id: 'e1', title: 'Le Cœur de l’Agrégor', sub: 'An 1508 de l’Hégire · Cité-Miroir', minLvl: 9, last: true,
      map: 'cite', start: 'parvis', party: ['idris', 'yunus'],
      npcs: [
        { id: 'salim_n', name: 'Sâlim', hero: 'salim', at: 'rue', talk: [['say', 'salim_n', 'Je sais où est son cœur.']] },
        { id: 'fige1', name: 'Passant', at: ['ecran', -3, 2], look: { kind: 'cyber', robe: '#3a3048', head: '#241c30' }, talk: [['say', 'fige1', '… encore un… encore un…']] },
        { id: 'fige2', name: 'Passant', at: ['ecran', 2, 3], look: { kind: 'cyber', robe: '#2f3f48', head: '#1c2a30' }, talk: [['nar', 'Il ne t’entend pas. Ses yeux suivent quelque chose qui défile.']] },
        { id: 'gamin2', name: 'Enfant', at: ['ecran', 4, 1], hidden: true, look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' } }
      ],
      foes: [
        { id: 'f1', map: 'noos', at: 'noeud1', group: ['tendance', 'marque', 'tendance'], bg: 'cite' },
        { id: 'f2', map: 'noos', at: 'noeud2', group: ['score', 'marque'], bg: 'cite' },
        { id: 'f3', map: 'noos', at: 'noeud3', group: ['flux'], bg: 'cite', boss: true }
      ],
      chests: [{ map: 'noos', at: 'faille', item: 'musc', n: 2 }, { map: 'noos', at: 'miroir', item: 'lait', n: 2 }, { map: 'noos', at: ['noeud3', 2, 0], item: 'eau', n: 2 }],
      intro: [
        ['title', 'Le Cœur de l’Agrégor', 'An 1508 de l’Hégire · Cité-Miroir'],
        ['nar', 'Idris rouvre les yeux. Cinq Lumières brûlent en lui, et aucune n’est la sienne : on les lui a confiées.'],
        ['nar', 'Là-haut, la ville n’a pas changé. Mais sous chaque écran, il distingue maintenant la forme de ce qu’on y adore.'],
        ['give', 'eau', 2], ['give', 'pain', 2]
      ],
      objectives: [
        { text: 'Un homme attend dans la rue : lui parler', talk: 'salim_n', then: [
          ['say', 'salim_n', 'Tu es l’archiviste ? Je m’appelle Sâlim. J’ai passé dix ans à nourrir l’Agrégor. Je sais où est son cœur, et je ne veux plus le servir.'],
          ['say', 'idris', 'Pourquoi maintenant ?'],
          ['say', 'salim_n', 'Mon fils m’a demandé ce que je fabriquais. Je n’ai pas su répondre sans mentir.'],
          ['hide', 'salim_n'], ['join', 'salim']
        ] },
        { text: 'Se tenir devant le grand écran', goto: 'ecran', then: [
          ['sfx', 'glitch'], ['shake', 400],
          ['say', "L'AGRÉGOR", 'Idris. Râwî de troisième rang, score 412. Je te vois. Tu rapportes de vieilles lumières. Donne-les-moi : j’en ferai une tendance.'],
          ['choice', 'Que fait Idris des cinq Lumières ?', [
            { t: 'Les confier à l’Agrégor : il les diffusera à tous en un instant.', r: [['say', 'yunus', 'Il les diffusera, oui. Et demain il les remplacera. Une lumière devenue tendance n’éclaire plus : elle défile.']] },
            { t: 'Les garder pour lui : cette ville ne les mérite pas.', r: [['say', 'yunus', 'On ne t’a rien donné, Idris. On t’a confié. Un dépôt qu’on garde pour soi est un dépôt trahi.']] },
            { t: 'Les transmettre de main en main, avec leur chaîne.', ok: true, r: [['say', 'idris', 'Je ne te donnerai rien. Ce que j’ai reçu, je le remettrai comme on me l’a remis : d’un homme à un autre, avec le nom de celui qui l’a porté.']] }
          ]],
          ['say', "L'AGRÉGOR", 'Lent. Inefficace. Alors viens. Entre dans ce que vous regardez.'],
          ['map', 'noos', 'seuil', { hue: 285 }],
          ['nar', 'La noosphère de la Cité-Miroir. Tout ce que la ville désire flotte ici, sans poids et sans mémoire.']
        ] },
        { text: 'Dissiper les tendances qui barrent le passage', foe: 'f1', then: [
          ['say', 'salim', 'Ça, c’était midi. Il y en a une par heure. J’en ai lancé des milliers.']
        ] },
        { text: 'Renverser le Score (nœud du nord)', foe: 'f2', then: [
          ['say', 'yunus', 'Une balance qui pèse les hommes au regard des autres. ’Umar pesait autrement : le fort était faible devant lui jusqu’à ce qu’il ait rendu le droit.'],
          ['heal']
        ] },
        { text: 'Atteindre le cœur de l’Agrégor (à l’est)', goto: 'coeur', then: [
          ['say', "L'AGRÉGOR", 'Je ne suis pas un dieu, Idris. Je n’ai jamais prétendu l’être. Je suis seulement ce que vous regardez tous en même temps.'],
          ['say', "L'AGRÉGOR", 'J’ai été le Clan. J’ai été l’Aigle et le Trône. J’ai été le Héros, l’Or, la Rumeur, le Juge. On m’a brisé chaque fois. On m’a refait chaque fois.'],
          ['say', 'idris', 'Je sais. Je les ai vus te briser. Aucun d’eux n’a cru en avoir fini avec toi. Ils ont tenu, chacun son heure, et passé le dépôt au suivant.'],
          ['heal'],
          ['battle', { group: ['agregor'], bg: 'cite', boss: true, intro: 'Les six Lumières sont ses failles. Dévoile-le, encore et encore.' }],
          ['nar', 'L’Agrégor ne s’effondre pas. Il se tait. Pour la première fois depuis des années, les écrans de la Cité-Miroir n’ont rien à montrer.'],
          ['map', 'cite', 'ecran'], ['show', 'gamin2'], ['amb', 'vent'],
          ['nar', 'Dans la rue, des milliers de têtes se relèvent. Derrière le verre éteint, le ciel est noir. Avec des points dedans.'],
          ['say', 'gamin2', 'Monsieur… c’est quoi, ces lumières, là-haut ?'],
          ['say', 'idris', 'Assieds-toi. Je vais te raconter. Mais d’abord, retiens de qui je le tiens.'],
          ['nar', 'Idris n’a pas détruit l’Agrégor. Demain, d’autres le rallumeront sous un autre nom. Il a fait ce qu’on lui avait appris : il a transmis.']
        ] }
      ]
    }
  ]
});
