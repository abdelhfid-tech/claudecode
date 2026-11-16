/* ISNAD — le cœur : les œuvres, les lames qu'elles forgent, les sept maux du cœur, les idées noires,
   les compagnons de lumière. Contenu commun à toutes les sagas (commun: true : aucun chapitre).

   Tout ceci est une fiction de jeu, posée sur des pratiques réelles décrites sobrement :
   - les œuvres (prière, dhikr, étude du Coran, jeûne, aumône, visite, pèlerinage) ne sont pas des
     sortilèges : elles préparent le cœur, et le jeu le traduit par une « provision » ;
   - les lames sont des images : une vertu longuement pratiquée, qui tranche le mal contraire.
     Ce ne sont pas des reliques, et aucune n'est attribuée à un personnage historique ;
   - les sept maux sont des égrégores abstraits. La liste de sept est un choix du jeu ;
   - les compagnons de lumière sont des figures du ciel : des noms d'étoiles qui prennent corps
     dans la noosphère. Aucun n'accompagne un Compagnon dans le récit historique ;
   - l'organigramme du mal (`mal`) est une lecture, pas une démonologie : Iblîs est nommé, jamais
     montré ni combattu ; les souffleurs n'ont ni nom, ni figure, ni nombre ; aucun lien n'est tracé
     d'un souffleur à un événement de l'histoire. Une idée noire ne se combat pas : on lui répond
     (`parole` : deux voiles, et pour chacun la manière qui porte). Textes proposés, à valider. */
ISNAD.registerSaga({
  id: 'coeur', commun: true, frame: true,
  name: 'Le cœur', epithet: 'Œuvres, lames et maux du cœur',

  /* ----- les œuvres : ce que le joueur lit quand il en accomplit une ----- */
  oeuvres: {
    priere: { name: 'La prière', court: 'Prière', glyph: '◠',
      desc: 'Sur la natte d’une mosquée. Le groupe se repose, la Sakîna descend. La première prière d’un chapitre nourrit la provision.' },
    dhikr: { name: 'Le dhikr', court: 'Dhikr', glyph: '∴', menu: 'Le dhikr, après la prière',
      desc: 'Le rappel, à voix basse, après la prière. Apaise : la Sakîna monte.',
      lignes: ['Ils restèrent assis après la prière. Chacun redisait à voix basse les mots du rappel, sans se presser. Quand ils se levèrent, rien n’avait changé autour d’eux, et tout pesait moins.',
        'Un moment sans rien demander. Seulement se souvenir. La journée pouvait reprendre : elle avait retrouvé son centre.'] },
    etude: { name: 'L’étude du Coran', court: 'Étude', glyph: '✧', menu: 'Apprendre du Coran',
      desc: 'Reprendre ce que l’on sait, apprendre ce qui suit, devant quelqu’un qui écoute.',
      lignes: ['Un verset repris dix fois, jusqu’à ne plus buter. Puis le suivant. On n’emporte que ce qu’on a répété.',
        'Il récita ce qu’il savait devant un autre, qui le reprit deux fois. On apprend mieux quand quelqu’un écoute.'] },
    jeune: { name: 'Le jeûne', court: 'Jeûne', glyph: '☾', menu: 'Jeûner aujourd’hui',
      desc: 'De l’aube au couchant. Jusqu’à la fin du chapitre, les vivres de la besace restent fermés pendant les combats. Le jeûne s’accomplit au coucher du soleil.',
      lignes: ['Depuis l’aube, ni eau ni pain. Personne ne le sait, et c’est très bien ainsi. Ce soir, une datte aura le goût d’un festin.',
        'La faim est là, et il reste debout. C’est tout ce que le jeûne voulait lui montrer.'],
      fin: 'Le soleil se couche. Une datte, une gorgée d’eau : le jeûne est accompli.' },
    aumone: { name: 'L’aumône', court: 'Aumône', glyph: '◎', menu: 'Donner aux pauvres', prix: 12,
      desc: 'Douze dirhams, donnés sans témoin à ceux qui ne demandent rien.',
      lignes: ['Il posa les pièces dans la main d’un homme qui ne demandait rien, et repartit avant d’être remercié. Ce qu’on donne ne manque à personne.',
        'Une part pour ceux qui dorment contre le mur de la mosquée. Il ne compta pas : il avait déjà compté ce qui lui restait, et c’était assez.'] },
    visite: { name: 'La visite', court: 'Visite', glyph: '∞', menu: 'Rendre visite à un proche, à un malade',
      desc: 'Frapper à une porte où l’on n’était pas attendu. Les liens se tiennent en les visitant.',
      lignes: ['Il frappa à une porte où l’on ne l’attendait plus. On parla peu. En repartant, il sut qu’il aurait dû venir plus tôt.',
        'Un malade, une natte, une cruche d’eau à remplir. Il resta le temps qu’il fallait, et ne parla pas de lui.'] },
    hajj: { name: 'Le pèlerinage', court: 'Pèlerinage', glyph: '⟁', menu: 'Le pèlerinage : partir avec la caravane, à la fin de la veillée',
      desc: 'Une fois, quand la caravane passe. Il s’accomplit à la fin de la veillée.',
      lignes: ['Deux pièces d’étoffe sans couture, les mêmes pour le seigneur et pour le berger. Sur la route, personne ne sait plus qui commande à qui.',
        'Il tourna avec les autres, au pas des autres. Il n’était venu chercher aucun rang, et n’en rapporta aucun.',
        'Au retour, la Citadelle lui parut plus petite, et ses gens plus grands.'] }
  },

  /* ----- les sept lames : une vertu pratiquée, qui tranche le mal contraire ----- */
  lames: {
    avidite:     { name: 'Le Contentement', ar: 'al-Qanâ’a',  couleur: '#7fd69a', texte: 'Forgée par le jeûne. Avoir faim et rester debout : il n’en faut pas plus pour savoir ce qui suffit.' },
    orgueil:     { name: 'L’Humilité',      ar: 'at-Tawâdu’', couleur: '#e6dcc4', texte: 'Forgée par le pèlerinage, où le seigneur et le berger portent la même étoffe.' },
    ostentation: { name: 'La Sincérité',    ar: 'al-Ikhlâs',  couleur: '#ffe08a', texte: 'Forgée par la prière tenue quand nul ne regarde.' },
    avarice:     { name: 'La Largesse',     ar: 'al-Karam',   couleur: '#5fe0d0', texte: 'Forgée par l’aumône donnée sans témoin.' },
    insouciance: { name: 'L’Ardeur',        ar: 'al-Himma',   couleur: '#c49bff', texte: 'Forgée par l’étude reprise chaque jour.' },
    envie:       { name: 'La Bienveillance', ar: 'an-Nasîha', couleur: '#6fb6ff', texte: 'Forgée par la visite : on ne jalouse pas longtemps celui chez qui l’on s’assied.' },
    colere:      { name: 'La Longanimité',  ar: 'al-Hilm',    couleur: '#ff9a7a', texte: 'Forgée par le dhikr, qui rend le cœur à son calme.' }
  },

  /* ----- les compagnons de lumière : figures du ciel (fiction) ----- */
  animaux: {
    renard:  { name: 'Le Renard des sables', ar: 'ath-Tha’lab', couleur: '#f2c27a', don: 'Flair', effet: 'Au début du combat, il flaire une faille de chaque égrégore.',
      vient: 'Il rejoint celui qui a résolu une énigme.', texte: 'Les chameliers disent qu’il naît d’une étoile tombée dans les dunes. Il ne suit personne ; il marche devant, et se retourne pour voir si l’on vient.' },
    aigle:   { name: 'L’Aigle', ar: 'an-Nasr', couleur: '#bfd6ff', don: 'Regard', effet: 'Le groupe agit plus tôt et gagne un point de Niyya.',
      vient: 'Il rejoint celui qui a forgé une première lame.', texte: 'An-Nasr at-Tâ’ir, « l’Aigle qui vole » : l’étoile qui se lève plein est. Dans la noosphère, le nom a pris des ailes.' },
    phenix:  { name: 'Le Phénix', ar: 'al-’Anqâ’', couleur: '#ff9a5c', don: 'Renaissance', effet: 'Une fois par combat, il relève le premier compagnon éprouvé.',
      vient: 'Il rejoint celui qui a tranché un premier mal.', texte: 'Al-’Anqâ’, l’oiseau des vieux contes arabes : personne ne l’a vu, tout le monde en parle. Il n’apparaît qu’où quelque chose a fini de brûler.' },
    lion:    { name: 'Le Lion', ar: 'al-Asad', couleur: '#ffd76a', don: 'Présence', effet: 'Pendant trois tours, les égrégores frappent moins fort.',
      vient: 'Il rejoint celui qui a remporté trois grandes épreuves le cœur prêt.', texte: 'Al-Asad : les anciens Arabes voyaient au ciel un lion immense, étendu sur plusieurs de nos constellations. Il ne rugit pas. Il est là, et cela suffit.' },
    gazelle: { name: 'La Gazelle', ar: 'az-Zaby', couleur: '#9fe8d0', don: 'Apaisement', effet: 'Le groupe se régénère pendant trois tours et reçoit un peu de Sakîna.',
      vient: 'Elle rejoint celui qui a gagné cinq pourparlers.', texte: 'Trois couples d’étoiles, au nord, portent le nom de « bonds de la gazelle ». Elle ne s’approche que de ceux qui parlent avant de frapper.' }
  },

  heroes: {},

  /* ----- les sept maux du cœur (boss) et les idées noires (pourparlers) ----- */
  enemies: {
    avidite: { name: 'L’Avidité', vice: 'avidite', art: 'swarm', hue: 28, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'sidq'], veils: 4,
      skills: [
        { w: 3, name: 'Encore', target: 'foe', el: 'fer', pow: 1.25, anim: 'slash' },
        { w: 2, name: 'Tout prendre', target: 'foes', el: 'fer', pow: 0.7, fx: [{ st: 'atk', v: -1, chance: 0.35 }], anim: 'dark' }
      ],
      phases: [{ at: 0.5, say: 'J’ai tout, et il me manque tout.', fx: [{ st: 'atk', v: 1 }] }],
      taunts: ['Encore un. Un seul. Le dernier.'],
      desc: 'Al-hirs : vouloir encore, alors qu’on a. Elle ne manque de rien et ne se rassasie de rien. Le jeûne apprend qu’on peut avoir faim et rester debout : la lame du Contentement la tranche.' },
    orgueil: { name: 'L’Orgueil', vice: 'orgueil', art: 'crown', hue: 276, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'adl'], veils: 4,
      skills: [
        { w: 3, name: 'Regard d’en haut', target: 'foes', el: 'ilm', pow: 0.75, fx: [{ st: 'doute', turns: 1, chance: 0.2 }], anim: 'wave' },
        { w: 2, name: 'Écraser', target: 'foe', el: 'fer', pow: 1.4, anim: 'dark' },
        { w: 1, name: 'Se grandir', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' }
      ],
      phases: [{ at: 0.5, say: 'Qui es-tu pour me nommer ?', fx: [{ st: 'atk', v: 1 }] }],
      taunts: ['On ne me corrige pas. On m’admire.'],
      desc: 'Al-kibr : se voir au-dessus, et tenir le vrai pour une offense. Il grandit de chaque regard levé vers lui. Le pèlerinage, où le seigneur et le berger portent la même étoffe, forge la lame de l’Humilité.' },
    ostentation: { name: 'L’Ostentation', vice: 'ostentation', art: 'mirror', hue: 318, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'shajaa'], veils: 4,
      skills: [
        { w: 3, name: 'Parade', target: 'foes', el: 'ilm', pow: 0.7, fx: [{ st: 'mag', v: -1, chance: 0.35 }], anim: 'wave' },
        { w: 2, name: 'Reflet flatteur', target: 'foe', el: 'ilm', pow: 1.3, fx: [{ st: 'doute', turns: 1, chance: 0.25 }], anim: 'dark' },
        { w: 1, name: 'Se montrer', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'guard' }
      ],
      phases: [{ at: 0.5, say: 'Regardez-moi bien : c’est pour vous que je brille.', fx: [{ st: 'spd', v: 1 }] }],
      taunts: ['Si personne ne l’a vu, cela a-t-il eu lieu ?'],
      desc: 'Ar-riyâ’ : faire le bien pour être vu le faisant. Elle ne déteste pas la vertu : elle la porte comme un vêtement. La prière tenue quand nul ne regarde forge la lame de la Sincérité.' },
    avarice: { name: 'L’Avarice', vice: 'avarice', art: 'idol', hue: 46, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'rahma'], veils: 4,
      skills: [
        { w: 3, name: 'Retenir', target: 'foe', el: 'fer', pow: 1.2, fx: [{ st: 'spd', v: -1, chance: 0.4 }], anim: 'dark' },
        { w: 2, name: 'Compter', target: 'foes', el: 'fer', pow: 0.7, fx: [{ st: 'atk', v: -1, chance: 0.35 }], anim: 'wave' },
        { w: 1, name: 'Thésauriser', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' }
      ],
      phases: [{ at: 0.5, say: 'Ce que je garde, nul ne me le reprendra.', fx: [{ st: 'def', v: 1 }] }],
      taunts: ['Donner ? Et s’il n’en restait plus ?'],
      desc: 'Al-bukhl : retenir ce qui devait circuler. Elle compte ce qu’elle garde, jamais ce qu’elle doit. L’aumône donnée sans témoin forge la lame de la Largesse.' },
    insouciance: { name: 'L’Insouciance', vice: 'insouciance', art: 'wave', hue: 212, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'ilm'], veils: 4,
      skills: [
        { w: 3, name: 'Demain', target: 'foes', el: 'ilm', pow: 0.65, fx: [{ st: 'spd', v: -1, chance: 0.45 }], anim: 'wave' },
        { w: 2, name: 'Engourdir', target: 'foe', el: 'ilm', pow: 1.15, fx: [{ st: 'stun', chance: 0.2 }], anim: 'dark' }
      ],
      phases: [{ at: 0.5, say: 'Rien ne presse. Rien n’a jamais pressé.', fx: [{ st: 'regen', turns: 2 }] }],
      taunts: ['Tu verras cela plus tard.'],
      desc: 'Al-ghafla : vivre à côté de sa vie. Ce n’est pas un refus, c’est un sommeil. L’étude reprise chaque jour forge la lame de l’Ardeur.' },
    envie: { name: 'L’Envie', vice: 'envie', art: 'lens', hue: 128, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'rahma', 'sidq'], veils: 4,
      skills: [
        { w: 3, name: 'Regard en coin', target: 'foe', el: 'ilm', pow: 1.3, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'dark' },
        { w: 2, name: 'Pourquoi lui ?', target: 'foes', el: 'ilm', pow: 0.7, fx: [{ st: 'waswas', turns: 2, chance: 0.35 }], anim: 'wave' }
      ],
      phases: [{ at: 0.5, say: 'Si je ne l’ai pas, que personne ne l’ait.', fx: [{ st: 'atk', v: 1 }] }],
      taunts: ['Regarde ce qu’il a. Regarde bien.'],
      desc: 'Al-hasad : ne pas supporter le bien d’un autre. Elle ne veut pas ce qu’il a ; elle veut qu’il ne l’ait plus. La visite rendue forge la lame de la Bienveillance.' },
    colere: { name: 'La Colère', vice: 'colere', art: 'blade', hue: 4, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'rahma', 'adl'], veils: 4,
      skills: [
        { w: 3, name: 'Emportement', target: 'foe', el: 'fer', pow: 1.45, anim: 'slash' },
        { w: 2, name: 'Tout brûler', target: 'foes', el: 'fer', pow: 0.75, anim: 'dark' },
        { w: 1, name: 'S’échauffer', target: 'self', fx: [{ st: 'atk', v: 1 }, { st: 'spd', v: 1 }], anim: 'guard' }
      ],
      phases: [{ at: 0.5, say: 'J’ai raison ! J’ai toujours eu raison !', fx: [{ st: 'atk', v: 1 }] }],
      taunts: ['Ce n’est pas de la colère. C’est de la justice.'],
      desc: 'Al-ghadab : un feu qui se croit juste. Elle a toujours une bonne raison, et c’est toujours la même. Le dhikr, qui rend le cœur à son calme, forge la lame de la Longanimité.' },

    noir_honte: { name: 'La Honte', art: 'mirror', hue: 300, scale: 2, lvl: 0, tier: 'elite', weak: ['rahma', 'sidq'], veils: 2,
      skills: [{ w: 3, name: 'Que diront-ils ?', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'atk', v: -1, chance: 0.3 }], anim: 'dark' }, { w: 1, name: 'Baisser les yeux', target: 'foes', el: 'ilm', pow: 0.55, anim: 'wave' }],
      idee: true,
      parole: { voies: ['bienveillance', 'parole'],
        dit: ['Comment veux-tu que je reparaisse devant les miens, après cela ?', 'Tu es bon de le dire. Mais ce que j’ai fait, je l’ai fait.'],
        rep: { bienveillance: '« Tu as failli, et tu restes des nôtres. L’un n’efface pas l’autre. »',
          parole: '« Appelons la faute par son nom. Elle a cette taille-là, pas davantage, et elle se répare. »',
          pedagogie: '« Laisse-moi te dire comment d’autres, avant toi, s’en sont relevés. »' },
        non: { parole: 'Il baisse la tête. La faute, il la connaît mieux que toi : c’est son poids qui l’écrase. Il lui faut d’abord une main.',
          pedagogie: 'Il n’écoute pas. On n’apprend rien tant qu’on se croit perdu aux yeux des siens.',
          bienveillance: 'Il te remercie, et rien ne bouge. La douceur seule laisse la faute sans nom, donc sans fin. Il attend qu’on la mesure.' },
        oui: ['Il relève un peu la tête.', 'Il respire. La faute a maintenant un nom et une taille : on peut la porter.'] },
      desc: 'Une idée noire : la peur du regard des siens. Elle ne ment pas sur la faute, elle ment sur ce qu’on vaut encore. On lui répond par la bienveillance, puis par la parole vraie.' },
    noir_peur: { name: 'La Peur', art: 'wisp', hue: 262, scale: 2, lvl: 0, tier: 'elite', weak: ['shajaa', 'sidq'], veils: 2,
      skills: [{ w: 3, name: 'Et si ?', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'spd', v: -1, chance: 0.3 }], anim: 'dark' }, { w: 1, name: 'Le pire d’abord', target: 'foes', el: 'ilm', pow: 0.55, anim: 'wave' }],
      idee: true,
      parole: { voies: ['pedagogie', 'parole'],
        dit: ['Et si tout tournait mal ? Je le vois déjà.', 'Soit. Mais le risque est là, tout de même.'],
        rep: { pedagogie: '« Regardons ensemble ce qui est là, aujourd’hui. Pas ce qui pourrait venir : ce qui est. »',
          parole: '« Oui, il y a un risque. Le voici, tel qu’il est. Je ne te le cache pas, et je ne le grossis pas. »',
          bienveillance: '« N’aie pas peur. Tout ira bien. »' },
        non: { parole: 'Tu nommes le danger, et il n’entend que ce mot. Sa peur vit de ce qui n’est pas arrivé : il faut d’abord la ramener à ce qui est.',
          bienveillance: '« Tout ira bien » : il n’en croit rien, et il a raison de ne pas te croire sur parole. La peur ne cède pas aux promesses.',
          pedagogie: 'Tu expliques encore, et il te soupçonne d’esquiver. Il a vu ce qui est ; il veut maintenant qu’on lui dise le risque en face.' },
        oui: ['Il compte avec toi. Ce qui est là est plus petit que ce qu’il voyait.', 'Il hoche la tête. Un danger qu’on lui dit en face, il peut le regarder.'] },
      desc: 'Une idée noire : ce qui n’est pas arrivé, vécu comme si c’était fait. On lui répond en regardant ce qui est, puis en disant le risque tel qu’il est.' },
    noir_soupcon: { name: 'Le Soupçon', art: 'lens', hue: 96, scale: 2, lvl: 0, tier: 'elite', weak: ['sidq', 'ilm'], veils: 2,
      skills: [{ w: 3, name: 'Il cache quelque chose', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'def', v: -1, chance: 0.3 }], anim: 'dark' }, { w: 1, name: 'On m’a déjà trompé', target: 'foes', el: 'ilm', pow: 0.55, anim: 'wave' }],
      idee: true,
      parole: { voies: ['parole', 'pedagogie'],
        dit: ['Tu veux quelque chose. Tout le monde veut quelque chose.', 'Admettons. Qu’est-ce qui me prouve que tu dis vrai ?'],
        rep: { parole: '« Oui, je veux quelque chose, et je vais te dire quoi. Tu jugeras. »',
          pedagogie: '« Ne me crois pas sur parole. Voici de qui je le tiens, et comment tu peux le vérifier. »',
          bienveillance: '« Je ne te veux que du bien, crois-moi. »' },
        non: { bienveillance: '« Crois-moi » : c’est ce que disait celui qui l’a trompé. Sa méfiance se referme.',
          pedagogie: 'Tu apportes tes preuves trop tôt. Il cherche d’abord ce que tu caches : tant que tu n’as pas dit ce que tu veux, tout argument est une ruse de plus.',
          parole: 'Tu répètes que tu dis vrai. Il l’a entendu. Il demande maintenant de quoi vérifier, et tu ne lui donnes que ta parole.' },
        oui: ['Il te regarde autrement : tu n’as pas nié avoir un but.', 'Il vérifiera. C’est tout ce que tu lui demandais.'] },
      desc: 'Une idée noire : la blessure d’hier qui lit la main d’aujourd’hui. On lui répond par la parole vraie, puis en donnant de quoi vérifier.' },
    noir_rancune: { name: 'La Rancune', art: 'mask', hue: 2, scale: 2, lvl: 0, tier: 'elite', weak: ['rahma', 'adl'], veils: 2,
      skills: [{ w: 3, name: 'Je n’oublie pas', target: 'foe', el: 'fer', pow: 1.05, anim: 'slash' }, { w: 1, name: 'Compter les torts', target: 'foes', el: 'ilm', pow: 0.55, fx: [{ st: 'waswas', turns: 2, chance: 0.25 }], anim: 'wave' }],
      idee: true,
      parole: { voies: ['parole', 'bienveillance'],
        dit: ['On m’a fait tort. Personne ne l’a jamais dit.', 'C’est dit. Et maintenant, je devrais oublier ?'],
        rep: { parole: '« On t’a fait tort. C’est vrai, et je le dis devant toi. »',
          bienveillance: '« Je ne te demande pas d’oublier. Je te demande de ne plus porter cela seul. »',
          pedagogie: '« Réfléchis : la rancune te coûte plus qu’à celui qui t’a lésé. »' },
        non: { pedagogie: 'Il se raidit. On ne raisonne pas un homme dont personne n’a encore reconnu le tort : ta leçon sonne comme un reproche de plus.',
          bienveillance: 'Ta douceur glisse sur lui. Elle vient trop tôt : tant que le tort n’est pas dit, toute consolation ressemble à une manière de le faire taire.',
          parole: 'Tu redis le tort. Il le sait, et tu viens de l’y ramener. Ce qu’il lui faut à présent, c’est quelqu’un à côté de lui.' },
        oui: ['Ses épaules s’abaissent. Quelqu’un l’a dit.', 'Il garde la mémoire du tort. Il n’en garde plus la braise.'] },
      desc: 'Une idée noire : un tort que l’on garde chaud. Elle veut moins réparation que mémoire. On lui répond en disant le tort, puis en restant près de celui qui le porte.' },
    noir_desespoir: { name: 'Le Désespoir', art: 'wave', hue: 238, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'rahma'], veils: 2,
      skills: [{ w: 3, name: 'Il est trop tard', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'mag', v: -1, chance: 0.3 }], anim: 'dark' }, { w: 1, name: 'À quoi bon', target: 'foes', el: 'ilm', pow: 0.55, fx: [{ st: 'spd', v: -1, chance: 0.25 }], anim: 'wave' }],
      idee: true,
      parole: { voies: ['bienveillance', 'pedagogie'],
        dit: ['À quoi bon ? Tout est joué.', 'Tu es là, c’est vrai. Mais que veux-tu que je fasse ?'],
        rep: { bienveillance: '« Je ne te dis pas que c’est facile. Je reste là, c’est tout. »',
          pedagogie: '« Pas tout. Une seule chose, la plus petite, celle qui est à ta portée ce soir. »',
          parole: '« Tu te trompes : rien n’est joué. »' },
        non: { parole: '« Tu te trompes » : il entend qu’on ne l’a pas écouté. Celui qui ne voit plus de porte n’a que faire d’un démenti.',
          pedagogie: 'Tu lui montres un chemin, et il ne lève pas les yeux. Il faut d’abord quelqu’un près de lui ; les chemins viennent après.',
          bienveillance: 'Tu restes, et il t’en sait gré. Mais rester ne suffit plus : il demande ce qu’il peut faire, et il lui faut un premier pas, un seul.' },
        oui: ['Il ne répond pas. Mais il ne te demande pas de partir.', 'Une chose. Il peut faire une chose. Le reste attendra demain.'] },
      desc: 'Une idée noire : croire qu’aucune porte ne reste. On lui répond en restant là, puis en montrant un seul pas.' }
  },

  /* ----- l'organigramme du mal : une lecture, pas une démonologie (exigence 18, proposée). Deux étages : ce qui est
     enseigné (`etage: 'enseigne'`), puis les images du jeu (`etage: 'image'`). Textes proposés par l'agent, à valider. ----- */
  // Le côté du bien (décision du décideur) : on n'y dit ni djinn, ni égrégore, ni idole, mais Valeurs et attributs, et on
  // les collectionne comme des badges. Sept Valeurs : celles des sept lames, gardées quand le mal d'en face est tranché.
  // Sept attributs divins : un Nom tiré du Coran, avec son verset et sa référence, reconnu quand l'œuvre a forgé la lame.
  // Aucun attribut n'est dessiné, personnifié ni « équipé » : on le reconnaît, on ne le possède pas (exigence 21, proposée).
  bien: {
    titre: 'Valeurs et attributs',
    chapeau: 'Du côté du bien, rien ne se nomme djinn, égrégore ou idole. On dit des *Valeurs* : ce que le cœur garde quand un mal est tranché. Et des *attributs* : ceux d’Allah, que nul ne possède, que l’on reconnaît.',
    note: 'Il n’y a pas d’organigramme du bien : Iblîs n’est qu’une créature, et rien ne se tient en face du Créateur. Les badges sont une image du jeu : ils marquent un rappel reçu, non une qualité acquise pour toujours.',
    gagner: 'Elle se garde quand ce mal est tranché par sa lame.', reconnaitre: 'Il se reconnaît quand l’œuvre a forgé la lame.'
  },
  valeurs: {
    avidite:     { texte: 'Savoir ce qui suffit, et s’y tenir sans regret.', face: 'vouloir encore, alors qu’on a' },
    orgueil:     { texte: 'Se tenir à sa place, sans se croire au-dessus de personne.', face: 'se voir au-dessus' },
    ostentation: { texte: 'Faire le bien sans chercher qui regarde.', face: 'faire le bien pour être vu le faisant' },
    avarice:     { texte: 'Laisser circuler ce que l’on a reçu.', face: 'retenir ce qui devait circuler' },
    insouciance: { texte: 'Ne pas remettre à demain ce qui compte.', face: 'vivre à côté de sa vie' },
    envie:       { texte: 'Se réjouir du bien d’autrui comme du sien.', face: 'ne pas supporter le bien d’autrui' },
    colere:      { texte: 'Garder son calme quand on pourrait frapper.', face: 'frapper avant d’avoir entendu' }
  },
  attributs: {
    avidite:     { nom: 'ar-Razzâq', sens: 'le Grand Pourvoyeur', verset: '« En vérité, c’est Allah qui est le Grand Pourvoyeur, Le Détenteur de la force, l’Inébranlable. »', ref: 'Coran 51:58',
                   mot: 'Le contentement s’appuie sur ceci : la subsistance vient de Lui.' },
    orgueil:     { nom: 'al-Kabîr, al-Muta’âl', sens: 'Le Grand, Le Sublime', verset: '« Le Connaisseur de ce qui est caché et de ce qui est apparent, Le Grand, Le Sublime. »', ref: 'Coran 13:9',
                   mot: 'L’humilité s’appuie sur ceci : la grandeur est à Lui.' },
    ostentation: { nom: 'al-Khabîr', sens: 'le Parfaitement Connaisseur', verset: '« Ne connaît-Il pas ce qu’Il a créé alors que c’est Lui le Compatissant, le Parfaitement Connaisseur. »', ref: 'Coran 67:14',
                   mot: 'La sincérité s’appuie sur ceci : Il connaît ce que les regards ne voient pas.' },
    avarice:     { nom: 'al-Wahhâb', sens: 'le Grand Donateur', verset: '« C’est Toi, certes, le Grand Donateur ! »', ref: 'Coran 3:8 (fin du verset)',
                   mot: 'La largesse s’appuie sur ceci : ce que l’on donne a d’abord été reçu.' },
    insouciance: { nom: 'al-Hayy, al-Qayyûm', sens: 'le Vivant, Celui qui subsiste par Lui-même', verset: '« Allah! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même (Al Qayyum). Ni somnolence ni sommeil ne Le saisissent. »', ref: 'Coran 2:255 (début du verset)',
                   mot: 'L’ardeur s’appuie sur ceci : Lui ne s’assoupit pas.' },
    envie:       { nom: 'al-Latîf', sens: 'doux envers Ses serviteurs', verset: '« Allah est doux envers Ses serviteurs. Il attribue [Ses biens] à qui Il veut. Et c’est Lui le Fort, le Puissant. »', ref: 'Coran 42:19',
                   mot: 'La bienveillance s’appuie sur ceci : ce que l’autre a reçu, c’est Lui qui l’a donné.' },
    colere:      { nom: 'al-Halîm', sens: 'indulgent', verset: '« Une parole agréable et un pardon valent mieux qu’une aumône suivie d’un tort. Allah n’a besoin de rien, et Il est indulgent. »', ref: 'Coran 2:263',
                   mot: 'La longanimité s’appuie sur ceci : Il est indulgent, Lui qui n’a besoin de rien.' }
  },
  // Les portes de la noosphère (décision du décideur) : la prière, le dhikr, le sommeil. On y descend pour faire face à ses
  // maux du cœur. C'est le combat du râwî, personnage de fiction, seul : jamais celui d'un Compagnon (exigences 15 et 16).
  portes: {
    priere:  { titre: 'Au sortir de la prière', invite: 'La prière est dite. Le cœur est calme, et la noosphère est toute proche.' },
    dhikr:   { titre: 'Dans le dhikr', invite: 'Le souvenir a fait silence autour de toi. La noosphère est toute proche.' },
    sommeil: { titre: 'En songe', invite: 'Le sommeil vient. Entre veille et songe, la noosphère est toute proche.', menu: 'S’endormir : un songe peut ouvrir la noosphère' },
    question: 'Veux-tu y descendre, râwî, et faire face à ce qui te pèse ? Ce que l’on appelle ses démons intérieurs ne sont pas des démons : ce sont les maux du cœur. Ce n’est pas le cœur des Compagnons que tu vas voir : c’est le tien.',
    plusTard: 'Pas maintenant', rien: 'Rien ne te pèse plus de ce côté-là : les sept maux du cœur sont tranchés.', deja: 'Cette porte s’est déjà ouverte dans ce chapitre.',
    avecLame: 'lame forgée', sansLame: 'il ne sera que repoussé', autres: 'Un mal dont la lame n’est pas forgée', lequel: 'Lequel ? Sans sa lame, il ne sera que repoussé : il reviendra.',
    seuil: 'La noosphère s’ouvre. Tu y descends.',
    // 2.x : la descente est un labyrinthe (textes proposés par l'agent, à valider par le décideur)
    descendre: 'Descendre', sousTitre: 'ta descente',
    regle: 'C’est un labyrinthe. Tes maux du cœur et les idées noires y rôdent : seul, on ne les vainc pas. Trouve l’issue, ou un abri où attendre que le temps passe.',
    // 2.x : frapper ce qui rôde (textes proposés par l'agent, à valider par le décideur)
    sonne: 'Frappé, ce qui rôde reste sonné un instant : passe. Seul, tu ne le vaincs pas.',
    dissipee: '%s se dissipe sous ta lame : tu n’étais pas seul. Elle ne reviendra pas avant le prochain chapitre.',
    rode: 'Quelque chose rôde sur les ponts. Entrée — ou touche-le — pour le frapper : chaque coup lui ôte un voile.',
    aLAbri: 'Un abri : rien de ce qui rôde n’y entre. Attends-y la fin du chrono — Entrée, ou touche ton personnage, pour laisser passer le temps.',
    face: '%s te barre le pont. Ta lame est forgée, et tu n’es pas seul : tu fais face.',
    pasDeHalte: 'Pas de halte ici : une descente se fait d’une traite.',
    sansSonge: 'Tu dors d’un sommeil sans songe. Tes forces reviennent : les portes de la noosphère se rouvriront.',
    niveau: 'Le râwî gagne un niveau.', acquis: 'Le râwî gagne en expérience.', lucide: 'Esprit +1 · Souffle +2, pour de bon.', connus: 'Ces abris ne t’apprennent plus rien : tu les connais.',
    issues: {
      issue: { titre: 'La noosphère se referme', h1: 'Tu as trouvé l’issue', texte: 'On ne traverse pas ce labyrinthe-là sans en sortir un peu grandi.' },
      abri: { titre: 'La noosphère se referme', h1: 'Tu as tenu', texte: 'À l’abri, tu as laissé passer ce qui rôdait. On en remonte plus lucide, le souffle plus long.' },
      temps: { titre: 'La noosphère se referme', h1: 'Le temps est écoulé', texte: 'Tu remontes sans avoir trouvé l’issue ni un abri. Rien n’est perdu : la porte se rouvrira.' },
      rattrape: { titre: 'La noosphère se referme', h1: '%s t’a rattrapé', texte: 'Seul, on ne vainc pas ce qui pèse sur le cœur. Tu remontes épuisé : il te faudra dormir, d’un sommeil sans songe, avant de redescendre.' } },
    remonte: { titre: 'La noosphère se referme', h1: 'Ce mal pèse encore', texte: 'On ne tranche pas un mal du cœur d’un seul coup. L’œuvre forge la lame : reviens quand elle sera prête.' }
  },

  // Le secours (décision du décideur) : avant la fin d'une bataille déclarée presque perdue, si la prière a été tenue.
  // Aucun ange n'est dessiné, nommé, compté ni mis en dialogue. Les deux versets sont cités mot à mot (traduction de
  // M. Hamidullah, lue sur api.quran.com, traduction 31) ; ils parlent de Badr, et le jeu ne dit rien d'un autre jour.
  secours: {
    titre: 'Le secours', bandeau: 'Le groupe est relevé',
    verset: '« Et (rappelez-vous) le moment où vous imploriez le secours de votre Seigneur et qu’Il vous exauça aussitôt : “Je vais vous renforcer d’un millier d’Anges déferlant les uns à la suite des autres.” »',
    ref: 'Coran 8:9, traduction du sens · c’était à Badr',
    mot: 'Tu avais tenu ta prière, et le secours est venu. On ne le commande pas. Le jeu ne montre pas les anges, ne les nomme pas, ne les compte pas.',
    pret: 'Si la bataille tourne au pire, le secours peut venir. On ne le commande pas.',
    absent: 'Le secours ne vient qu’à qui a tenu sa prière : une natte, avant l’épreuve, y suffit.'
  },

  mal: {
    titre: 'Organigramme du mal',
    chapeau: 'Qui souffle, qui consent, et ce que cela devient. À chaque étage sa réponse, et pas une de plus.',
    rangs: {
      iblis: { etage: 'enseigne', name: 'Iblîs', sous: 'l’ennemi déclaré',
        texte: 'Le Coran le dit du nombre des djinns, et l’appelle un ennemi déclaré. Il n’a reçu aucun pouvoir sur les hommes : il appelle, et c’est tout. Le jeu le nomme ; il ne le montre pas, ne le fait pas parler et ne le fait pas combattre.',
        reponse: 'On ne le combat pas. On cherche refuge contre lui, et l’on défait ce qu’il a soufflé.',
        src: 'Coran 18:50 ; 2:168 ; 14:22' },
      souffleurs: { etage: 'enseigne', name: 'Les souffleurs', sous: 'des démons d’entre les djinns, et parfois des hommes',
        texte: 'Le Coran parle de celui « qui souffle le mal dans les poitrines des hommes, qu’il (le conseiller) soit un djinn, ou un être humain ». Dans le jeu, ils n’ont ni nom, ni figure, ni nombre. Tous les djinns ne soufflent pas : il en est de vertueux, et ceux qui ne nuisent à personne vont leur chemin.',
        reponse: 'On ne les combat pas, et l’on ne s’en prend à aucun djinn. On répond à ce qui a été soufflé.',
        src: 'Traduction du sens, Coran 114:5-6 ; voir aussi 72:11' },
      coeur: { etage: 'enseigne', name: 'Le cœur', sous: 'il entend, et il consent ou refuse',
        texte: 'Le souffle s’arrête ici. Rien n’entre que le cœur n’ait laissé entrer : nul ne pourra dire qu’on l’y a forcé.',
        reponse: 'Par les œuvres. Elles ne donnent aucun pouvoir : elles tiennent le cœur éveillé.' },
      racines: { etage: 'image', name: 'Les idées noires', sous: 'ce qui pèse sur une personne',
        texte: 'La honte, la peur, le soupçon, la rancune, le désespoir. En face, dans le cœur de chacun, sept maux qui leur ouvrent la porte : l’avidité, l’orgueil, l’ostentation, l’avarice, l’insouciance, l’envie, la colère.',
        reponse: 'L’idée noire : par la parole, la pédagogie, la bienveillance. Le mal du cœur : par l’œuvre, qui forge sa lame.' },
      egregores: { etage: 'image', name: 'Les égrégores', sous: 'l’idée reprise par beaucoup de cœurs',
        texte: 'Ce que beaucoup de cœurs regardent ensemble prend corps dans la noosphère. Nourri de peur ou d’orgueil, il se retourne contre ceux qui le portent.',
        reponse: 'Par le combat : chercher la faille, retirer les voiles.' },
      idoles: { etage: 'image', name: 'Les idoles', sous: 'l’idée enracinée : elle commande',
        texte: 'Une chose fabriquée par les hommes, et qui finit par les commander. Plus l’idée a pris racine, plus l’idole pèse.',
        reponse: 'Par une bataille déclarée.' }
    },
    couture: 'Au-dessus de ce trait : ce qui est enseigné. Au-dessous : des images, que le jeu emploie pour parler de ce que les hommes pensent, craignent et désirent ensemble. Le jeu ne dit de personne, ni d’aucun jour de l’histoire, qu’un souffle l’a fait agir.',
    jauge: { note: 'La jauge appartient à l’idole, telle qu’elle se dresse devant le voyageur. Elle ne dit rien d’une époque ni de ses gens. Un pourparler gagné, une idée noire dissipée du premier coup la font baisser ; une parole manquée la fait monter.' }
  },

  codex: [
    { id: 'oeuvres', cat: 'Cœur', title: 'Les œuvres', text: 'La prière, le dhikr, l’étude du Coran, le jeûne, l’aumône, la visite, le pèlerinage. Dans ISNAD, elles ne sont pas des sortilèges et ne donnent aucun pouvoir : elles préparent le cœur, et le jeu le traduit par une *provision*. Plus une épreuve est lourde, plus elle en demande. Qui s’y présente sans provision s’y présente le cœur lourd.' },
    { id: 'zad', cat: 'Cœur', title: 'La provision', text: 'Az-zâd : ce que le voyageur emporte. « Et prenez vos provisions ; mais vraiment la meilleure provision est la piété. » Chaque œuvre accomplie ajoute à la provision du groupe ; chaque épreuve en consomme selon son poids.', src: 'Traduction du sens, Coran 2:197' },
    { id: 'dhikr', cat: 'Cœur', title: 'Le dhikr', text: 'Le rappel : redire, à voix basse ou dans le cœur, les mots par lesquels on se souvient de son Seigneur. « N’est-ce point par l’évocation d’Allah que se tranquillisent les cœurs ? »', src: 'Traduction du sens, Coran 13:28' },
    { id: 'maux', cat: 'Cœur', title: 'Les sept maux du cœur', text: 'L’avidité, l’orgueil, l’ostentation, l’avarice, l’insouciance, l’envie, la colère. Les traités de morale en décrivent davantage et les rangent autrement ; al-Ghazâlî leur consacre un quart de son *Ihyâ’*, celui qu’il intitule *al-muhlikât*, « ce qui perd ». La liste de sept est un choix du jeu, et les sept égrégores qui la portent sont une image : on ne les rencontre nulle part ailleurs que dans le cœur.', src: 'D’après al-Ghazâlî, Ihyâ’ ’ulûm ad-dîn (plan de l’ouvrage) ; la liste de sept est une fiction du jeu' },
    { id: 'lames', cat: 'Cœur', title: 'Les sept lames', text: 'Dans la noosphère, une vertu longuement pratiquée prend le fil d’une lame. Le jeûne forge le Contentement, le pèlerinage l’Humilité, la prière la Sincérité, l’aumône la Largesse, l’étude l’Ardeur, la visite la Bienveillance, le dhikr la Longanimité. Sans sa lame, un mal du cœur peut être repoussé ; il revient. Avec elle, il est tranché. Ces lames sont une image du jeu : ce ne sont pas des reliques, et aucune n’a appartenu à personne.' },
    { id: 'idees_noires', cat: 'Cœur', title: 'Les idées noires', text: 'La honte, la peur, le soupçon, la rancune, le désespoir. Il arrive qu’un homme n’entende plus rien parce que l’une d’elles parle plus fort que toi. On ne la combat pas : on lui répond, par la parole, la pédagogie ou la bienveillance, selon ce qui la tient. Chacune a deux voiles, et chaque voile sa manière. Après quoi il écoute.' },
    { id: 'echelle', cat: 'Noosphère', title: 'À chaque mal sa réponse', text: 'À l’idée noire, qui pèse sur une personne : la parole, la pédagogie, la bienveillance. À l’égrégore, que beaucoup de cœurs nourrissent : le combat. À l’idole, enracinée : une bataille déclarée. Aux souffleurs : rien, on ne les combat pas ; et l’on ne s’en prend à aucun djinn qui ne nuit à personne. Le sabre ne vient qu’après, quand la parole a tout essayé.' },
    { id: 'souffleurs', cat: 'Noosphère', title: 'Ceux qui soufflent', text: 'Le Coran enseigne à chercher protection « contre le mal du mauvais conseiller, furtif, qui souffle le mal dans les poitrines des hommes, qu’il (le conseiller) soit un djinn, ou un être humain ». Dans ISNAD, on ne les voit pas, on ne les nomme pas, on ne les compte pas, on ne les combat pas. Tous les djinns ne soufflent pas, et le jeu ne s’en prend à aucun. Ce que l’on rencontre, c’est ce qu’un cœur fait de ce qu’il a entendu.', src: 'Traduction du sens, Coran 114:4-6' },
    { id: 'iblis', cat: 'Noosphère', title: 'Iblîs, l’ennemi déclaré', text: 'Le jeu le nomme et ne le montre pas. Il ne parle dans aucune scène, et l’on ne le combat nulle part : ce n’est pas une épée qui en protège. Le Coran rapporte ce qu’il dira, quand tout sera accompli, à ceux qui l’auront suivi : « Je n’avais aucune autorité sur vous si ce n’est que je vous ai appelés, et que vous m’avez répondu. Ne me faites donc pas de reproches ; mais faites-en à vous-mêmes. » Il appelle. C’est le cœur qui répond.', src: 'Traduction du sens, Coran 14:22' },
    { id: 'bataille', cat: 'Noosphère', title: 'La bataille déclarée', text: 'Contre une idole, on ne se bat plus seul, et l’on ne se bat pas sans le dire. La bataille est déclarée : chacun sait ce qui se dresse, et qui tient les rangs. En face, il n’y a jamais d’hommes : des nuées, que l’idole envoie. Nos rangs ne tombent pas : éprouvés, ils se replient et se reforment. C’est une image du jeu. Il ne dit pas combien d’hommes il y avait tel jour, ni qui fit telle manœuvre : la réserve mobile, l’enveloppement et le repli feint sont des manœuvres d’école.' },
    { id: 'valeurs', cat: 'Cœur', title: 'Les sept Valeurs', text: 'Du côté du bien, on ne dit ni djinn, ni égrégore, ni idole : on dit des Valeurs. Il y en a sept, une en face de chaque mal du cœur : le Contentement, l’Humilité, la Sincérité, la Largesse, l’Ardeur, la Bienveillance, la Longanimité. L’œuvre forge la lame ; la lame tranche le mal ; ce qui reste alors, c’est la Valeur. Le jeu la marque d’un badge. C’est une image : une valeur ne se possède pas comme un objet, elle se garde en la pratiquant.' },
    { id: 'attributs', cat: 'Cœur', title: 'Les attributs divins', text: 'Chaque Valeur s’appuie sur un attribut d’Allah, que le jeu nomme d’après le Coran, avec son verset et sa référence : ar-Razzâq, al-Kabîr, al-Khabîr, al-Wahhâb, al-Hayy al-Qayyûm, al-Latîf, al-Halîm. On ne possède pas un attribut divin : on le reconnaît. Le jeu ne le dessine pas, ne lui prête aucune figure et n’en fait ni une arme ni un pouvoir ; le badge marque seulement que le rappel a été reçu. Il n’y a pas d’organigramme du bien : rien ne se tient en face du Créateur.', src: 'Traduction du sens : Coran 51:58, 13:9, 67:14, 3:8, 2:255, 42:19, 2:263.' },
    { id: 'frappe', cat: 'Noosphère', title: 'Frapper ce qui rôde', text: 'Dans un labyrinthe de la noosphère, de petits égrégores vont et viennent sur les ponts, jamais dans les lieux que le récit nomme. On les frappe comme en combat, avec l’arme que porte celui qui mène : Entrée, ou un toucher sur ce qui rôde. Chaque coup ôte un voile et sonne un instant ; sans voile, l’égrégore se dissipe. S’il vous rejoint avant, c’est un combat ordinaire. L’allonge, le poids et la vitesse viennent de l’arme : une lance porte loin, une masse sonne longtemps, une dague frappe vite. Dans la descente du râwî, les coups ne font que sonner : seul, on ne vainc pas ce qui pèse sur le cœur. Image du jeu.' },
    { id: 'noos_interieure', cat: 'Noosphère', title: 'Descendre en soi', text: 'Au sortir de la prière, dans le dhikr, en songe : à ces moments-là, la noosphère est toute proche, et l’on peut y descendre pour faire face à ce qui pèse. Ce que l’on appelle ses démons intérieurs ne sont pas des démons : ce sont les maux du cœur. C’est le combat du râwî, seul. Ce n’est jamais celui d’un Compagnon : le jeu ne prête à aucun d’eux un mal du cœur. Avec la lame que l’œuvre a forgée, le mal est tranché ; sans elle, il n’est que repoussé. Image du jeu, dite comme telle.' },
    { id: 'secours', cat: 'Cœur', title: 'Le secours', text: 'À Badr, les croyants étaient en petit nombre. Le Coran rapporte qu’ils implorèrent le secours, et ce qui leur fut répondu : « Je vais vous renforcer d’un millier d’Anges déferlant les uns à la suite des autres. » Puis : « Allah ne fit cela que pour (vous) apporter une bonne nouvelle et pour qu’avec cela vos cœurs se tranquillisent. Et il n’y a de victoire que de la part d’Allah. » Dans ISNAD, quand une bataille déclarée est presque perdue, le secours relève le groupe, une fois, si la prière a été tenue dans le chapitre. C’est une image du jeu. Il ne montre pas les anges, ne les nomme pas, ne les compte pas, et il ne dit pas qu’ils sont venus tel jour de l’histoire des Compagnons. On ne commande pas le secours : on tient sa prière, et l’on combat.', src: 'Traduction du sens, Coran 8:9-10. Règle de jeu.' },
    { id: 'enracinement', cat: 'Noosphère', title: 'L’enracinement', text: 'Une idée noire dans un seul cœur se dissipe par la parole. Reprise par beaucoup, elle prend corps : c’est un égrégore. Quand on ne la voit plus tant elle est partout, elle commande : c’est une idole. Le jeu mesure cela d’un à cinq, pour chaque idole. La parole qui porte la déracine ; la parole manquée la laisse s’enfoncer. Déracinée, l’idole pèse moins et garde un voile de moins ; enracinée, elle pèse davantage. C’est une image du jeu : la jauge se dit d’une idole, jamais d’une époque ni de ses gens.' },
    { id: 'figures_ciel', cat: 'Cœur', title: 'Les compagnons de lumière (fiction)', text: 'Les Arabes donnaient aux étoiles des noms de bêtes : l’Aigle qui vole, le Lion, les bonds de la Gazelle. Dans la noosphère d’ISNAD, ces noms ont pris corps. Le Renard des sables et le Phénix viennent, eux, des contes. Ce sont des figures de fiction : aucune n’accompagne un Compagnon dans le récit historique.' },
    { id: 'equipement', cat: 'Objets', title: 'Ce que l’on porte', text: 'Épées, lances, arcs, boucliers, casques, cottes, turbans et manteaux : le jeu range sous quatre emplacements ce qu’un groupe pouvait porter en ce temps-là. C’est une *convention de jeu*. Aucune de ces pièces n’est une relique, aucune n’a appartenu à un personnage de l’histoire, aucune ne porte d’inscription, et le jeu ne dit pas qui portait quoi. Leurs noms viennent de la poésie arabe ancienne, où une bonne lame est dite *muhannad* (d’acier de l’Inde), *yamânî* (du Yémen) ou *mashrafî* ; une bonne lance, *khattî* (d’al-Khatt, port du Bahreïn) ou *samharî* ; un bon arc est de bois de *nab\'* ; une bonne cotte est *salûqî*. Le fer aide à tenir ; il ne remplace pas la provision du cœur.', src: 'Convention de jeu. Vocabulaire des poètes anciens, à faire vérifier.' },
    { id: 'enigmes', cat: 'Cœur', title: 'Les énigmes du cœur', text: 'Il arrive qu’un compagnon languisse sans fièvre ni blessure. Les anciens de la Citadelle disaient : « Cherche d’abord ce qu’il a cessé de faire. » Une prière laissée, une porte où l’on ne frappe plus, une main qu’on a fermée. Ce n’est pas une punition : c’est un poids, et il se pose en reprenant ce qu’on avait laissé.' }
  ],

  chapters: []
});
