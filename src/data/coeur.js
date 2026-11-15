/* ISNAD — le cœur : les œuvres, les lames qu'elles forgent, les sept maux du cœur, les idées noires,
   les compagnons de lumière. Contenu commun à toutes les sagas (commun: true : aucun chapitre).

   Tout ceci est une fiction de jeu, posée sur des pratiques réelles décrites sobrement :
   - les œuvres (prière, dhikr, étude du Coran, jeûne, aumône, visite, pèlerinage) ne sont pas des
     sortilèges : elles préparent le cœur, et le jeu le traduit par une « provision » ;
   - les lames sont des images : une vertu longuement pratiquée, qui tranche le mal contraire.
     Ce ne sont pas des reliques, et aucune n'est attribuée à un personnage historique ;
   - les sept maux sont des égrégores abstraits. La liste de sept est un choix du jeu ;
   - les compagnons de lumière sont des figures du ciel : des noms d'étoiles qui prennent corps
     dans la noosphère. Aucun n'accompagne un Compagnon dans le récit historique. */
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
      desc: 'Une idée noire : la peur du regard des siens. Elle ne ment pas sur la faute, elle ment sur ce qu’on vaut encore. La miséricorde et la parole vraie la dissipent.' },
    noir_peur: { name: 'La Peur', art: 'wisp', hue: 262, scale: 2, lvl: 0, tier: 'elite', weak: ['shajaa', 'sidq'], veils: 2,
      skills: [{ w: 3, name: 'Et si ?', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'spd', v: -1, chance: 0.3 }], anim: 'dark' }, { w: 1, name: 'Le pire d’abord', target: 'foes', el: 'ilm', pow: 0.55, anim: 'wave' }],
      desc: 'Une idée noire : ce qui n’est pas arrivé, vécu comme si c’était fait. Le courage et la parole vraie la dissipent.' },
    noir_soupcon: { name: 'Le Soupçon', art: 'lens', hue: 96, scale: 2, lvl: 0, tier: 'elite', weak: ['sidq', 'ilm'], veils: 2,
      skills: [{ w: 3, name: 'Il cache quelque chose', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'def', v: -1, chance: 0.3 }], anim: 'dark' }, { w: 1, name: 'On m’a déjà trompé', target: 'foes', el: 'ilm', pow: 0.55, anim: 'wave' }],
      desc: 'Une idée noire : la blessure d’hier qui lit la main d’aujourd’hui. La parole vraie et le savoir la dissipent.' },
    noir_rancune: { name: 'La Rancune', art: 'mask', hue: 2, scale: 2, lvl: 0, tier: 'elite', weak: ['rahma', 'adl'], veils: 2,
      skills: [{ w: 3, name: 'Je n’oublie pas', target: 'foe', el: 'fer', pow: 1.05, anim: 'slash' }, { w: 1, name: 'Compter les torts', target: 'foes', el: 'ilm', pow: 0.55, fx: [{ st: 'waswas', turns: 2, chance: 0.25 }], anim: 'wave' }],
      desc: 'Une idée noire : un tort que l’on garde chaud. Elle veut moins réparation que mémoire. La miséricorde et la justice rendue la dissipent.' },
    noir_desespoir: { name: 'Le Désespoir', art: 'wave', hue: 238, scale: 2, lvl: 0, tier: 'elite', weak: ['sabr', 'rahma'], veils: 2,
      skills: [{ w: 3, name: 'Il est trop tard', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'mag', v: -1, chance: 0.3 }], anim: 'dark' }, { w: 1, name: 'À quoi bon', target: 'foes', el: 'ilm', pow: 0.55, fx: [{ st: 'spd', v: -1, chance: 0.25 }], anim: 'wave' }],
      desc: 'Une idée noire : croire qu’aucune porte ne reste. La patience et la miséricorde la dissipent.' }
  },

  codex: [
    { id: 'oeuvres', cat: 'Cœur', title: 'Les œuvres', text: 'La prière, le dhikr, l’étude du Coran, le jeûne, l’aumône, la visite, le pèlerinage. Dans ISNAD, elles ne sont pas des sortilèges et ne donnent aucun pouvoir : elles préparent le cœur, et le jeu le traduit par une *provision*. Plus une épreuve est lourde, plus elle en demande. Qui s’y présente sans provision s’y présente le cœur lourd.' },
    { id: 'zad', cat: 'Cœur', title: 'La provision', text: 'Az-zâd : ce que le voyageur emporte. « Et prenez vos provisions ; mais vraiment la meilleure provision est la piété. » Chaque œuvre accomplie ajoute à la provision du groupe ; chaque épreuve en consomme selon son poids.', src: 'Traduction du sens, Coran 2:197' },
    { id: 'dhikr', cat: 'Cœur', title: 'Le dhikr', text: 'Le rappel : redire, à voix basse ou dans le cœur, les mots par lesquels on se souvient de son Seigneur. « N’est-ce point par l’évocation d’Allah que se tranquillisent les cœurs ? »', src: 'Traduction du sens, Coran 13:28' },
    { id: 'maux', cat: 'Cœur', title: 'Les sept maux du cœur', text: 'L’avidité, l’orgueil, l’ostentation, l’avarice, l’insouciance, l’envie, la colère. Les traités de morale en décrivent davantage et les rangent autrement ; al-Ghazâlî leur consacre un quart de son *Ihyâ’*, celui qu’il intitule *al-muhlikât*, « ce qui perd ». La liste de sept est un choix du jeu, et les sept égrégores qui la portent sont une image : on ne les rencontre nulle part ailleurs que dans le cœur.', src: 'D’après al-Ghazâlî, Ihyâ’ ’ulûm ad-dîn (plan de l’ouvrage) ; la liste de sept est une fiction du jeu' },
    { id: 'lames', cat: 'Cœur', title: 'Les sept lames', text: 'Dans la noosphère, une vertu longuement pratiquée prend le fil d’une lame. Le jeûne forge le Contentement, le pèlerinage l’Humilité, la prière la Sincérité, l’aumône la Largesse, l’étude l’Ardeur, la visite la Bienveillance, le dhikr la Longanimité. Sans sa lame, un mal du cœur peut être repoussé ; il revient. Avec elle, il est tranché. Ces lames sont une image du jeu : ce ne sont pas des reliques, et aucune n’a appartenu à personne.' },
    { id: 'idees_noires', cat: 'Cœur', title: 'Les idées noires', text: 'La honte, la peur, le soupçon, la rancune, le désespoir. Il arrive qu’un homme n’entende plus rien parce que l’une d’elles parle plus fort que toi. On ne la combat pas contre lui, mais pour lui : dans la noosphère, elle a un corps, et l’on peut le dissiper. Après quoi il écoute.' },
    { id: 'figures_ciel', cat: 'Cœur', title: 'Les compagnons de lumière (fiction)', text: 'Les Arabes donnaient aux étoiles des noms de bêtes : l’Aigle qui vole, le Lion, les bonds de la Gazelle. Dans la noosphère d’ISNAD, ces noms ont pris corps. Le Renard des sables et le Phénix viennent, eux, des contes. Ce sont des figures de fiction : aucune n’accompagne un Compagnon dans le récit historique.' },
    { id: 'equipement', cat: 'Objets', title: 'Ce que l’on porte', text: 'Épées, lances, arcs, boucliers, casques, cottes, turbans et manteaux : le jeu range sous quatre emplacements ce qu’un groupe pouvait porter en ce temps-là. C’est une *convention de jeu*. Aucune de ces pièces n’est une relique, aucune n’a appartenu à un personnage de l’histoire, aucune ne porte d’inscription, et le jeu ne dit pas qui portait quoi. Leurs noms viennent de la poésie arabe ancienne, où une bonne lame est dite *muhannad* (d’acier de l’Inde), *yamânî* (du Yémen) ou *mashrafî* ; une bonne lance, *khattî* (d’al-Khatt, port du Bahreïn) ou *samharî* ; un bon arc est de bois de *nab\'* ; une bonne cotte est *salûqî*. Le fer aide à tenir ; il ne remplace pas la provision du cœur.', src: 'Convention de jeu. Vocabulaire des poètes anciens, à faire vérifier.' },
    { id: 'enigmes', cat: 'Cœur', title: 'Les énigmes du cœur', text: 'Il arrive qu’un compagnon languisse sans fièvre ni blessure. Les anciens de la Citadelle disaient : « Cherche d’abord ce qu’il a cessé de faire. » Une prière laissée, une porte où l’on ne frappe plus, une main qu’on a fermée. Ce n’est pas une punition : c’est un poids, et il se pose en reprenant ce qu’on avait laissé.' }
  ],

  chapters: []
});
