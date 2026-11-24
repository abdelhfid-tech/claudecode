/* ISNAD — histoire-cadre : Idris, râwî de la Cité-Miroir.
   Prologue (p1), dernier maillon (e1), et cinq rencontres (r_*, marquées « after ») : après chaque saga et sa
   veillée, Idris remonte dans la rue et rencontre un habitant enfermé dans une idole. Il le dénoue par la parole ;
   les meilleurs arguments demandent un savoir appris chez le Compagnon ou à la Citadelle (need: 'saga/id').
   Tout y est de fiction. Les types sont anciens ; les images et les phrases sont originales. */
/* 2.x — trois retours (x_*, marqués « retour: n ») : ce qui s'est passé aux Archives basses pendant qu'Idris suivait un
   récit, joué une fois quand il revient en 2084 pour la n-ième fois (ou plus tard). Et une visite (« visite: 'citadelle' ») :
   la Citadelle du Caïd, où Idris est né, ouverte depuis la Chaîne dès la première veillée entendue. Le moteur pose
   l'état de 2084 en drapeaux (_2084_*) : un récit les lit, il ne les écrit pas. Textes proposés par l'agent, à relire. */
/* 2.23 (D212) — les quartiers de la Cité (« visite: 'quartiers' ») : le refuge d'Idris en 2084, où il remonte à tout moment,
   à côté de Maître Yûnus (src/core/cite.js) ; ses passants, chacun seul ; et quatre chimères qu'Idris est seul à voir, qui
   rôdent dans les rues (egoisme, materialisme, plaisir, indifference ; D.CITE.rodent). Ce qu'on y dit est dans `cite`.
   Demande du décideur du 21 novembre ; textes proposés par l'agent, à valider. */
/* 2.25 (D214) — la découverte de l'Agrégor (le décideur, 21 novembre : « On ne parle plus de l'agregore des le début de
   l'histoire il faut qu'il le découvre au fur et à mesure avec maître Yunus »). Le prologue ne le nomme plus ; à la fin de
   chacune des cinq rencontres, Maître Yûnus monte des Archives (« yunus_r », caché, puis « show ») et Idris découvre une
   chose de plus : I, quelque chose rassemble les regards ; II, ça ne commande pas, ça additionne ; III, son nom, et la fiche
   « agregor » du Recueil ; IV, il ne craint que ce qui passe de main en main sans passer par lui ; V, il a un cœur, sous le
   grand écran. Avant l'étape III, aucun texte ne le nomme (on dit « ce qui règne là-haut », « les écrans »). Une chimère,
   une image du jeu : aucun pouvoir réel, aucun lien avec un peuple, une religion, Iblîs ni un djinn. Textes de l'agent, à
   valider. */
/* Depuis la version du cœur : chaque rencontre porte, à sa deuxième manche, l'idée noire de celui à qui l'on
   parle (« noir »), et s'achève devant le mal du cœur qui se tenait derrière lui. Le dernier chapitre fait se
   dresser ceux qui n'ont pas été tranchés (['vices', …]). Textes des maux et des lames : src/data/coeur.js. */
ISNAD.registerSaga({
  id: 'idris', order: 0, frame: true,
  name: 'Idris', epithet: 'Le Râwî', arabic: 'إدريس', years: '1507 H · 2084',
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
        { lvl: 1, id: 'citer', name: 'Citer la source', desc: '« De qui le tiens-tu ? » Révèle les failles d’une chimère.', cost: 2, target: 'foe', el: 'ilm', pow: 0.7, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 1, id: 'souffle', name: 'Reprendre souffle', desc: 'Rend de la Constance à un compagnon.', cost: 4, target: 'ally', heal: 1.0, anim: 'heal' },
        { lvl: 9, id: 'l_sidq', name: 'Parole du Véridique', desc: 'La Lumière d’Abû Bakr : dire vrai quand tout vacille.', cost: 6, target: 'foe', el: 'sidq', pow: 1.8, anim: 'pillar' },
        { lvl: 9, id: 'l_adl', name: 'Mesure du Fârûq', desc: "La Lumière de 'Umar : la même balance pour tous.", cost: 7, target: 'foes', el: 'adl', pow: 1.15, anim: 'wave' },
        { lvl: 9, id: 'l_shajaa', name: 'Le Sabre rengainé', desc: 'La Lumière de Khâlid : le courage de s’effacer.', cost: 6, target: 'foe', el: 'shajaa', pow: 1.8, fx: [{ st: 'dispel' }], anim: 'slash' },
        { lvl: 9, id: 'l_rahma', name: 'Miséricorde du Généreux', desc: "La Lumière de 'Uthmân : soigne tout le groupe.", cost: 8, target: 'allies', heal: 0.7, anim: 'heal' },
        { lvl: 9, id: 'l_ilm', name: 'Porte du Savoir', desc: "La Lumière de 'Alî : comprendre avant de juger.", cost: 6, target: 'foe', el: 'ilm', pow: 1.7, fx: [{ st: 'reveal' }], anim: 'glyph' }
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
      look: { kind: 'citadin', robe: '#5a2f3a', head: '#6b2f3a', cloak: '#2b2530', coiffe: 'calotte', manteau: 'aucun' },
      skills: [
        { lvl: 1, id: 'couper', name: 'Couper le signal', desc: 'Frappe nette.', cost: 3, target: 'foe', el: 'fer', pow: 1.5, anim: 'slash' },
        { lvl: 1, id: 'debrancher', name: 'Débrancher', desc: 'Oser dire non : frappe de Courage, retire les renforts.', cost: 5, target: 'foe', el: 'shajaa', pow: 1.4, fx: [{ st: 'dispel' }], anim: 'burst' },
        { lvl: 1, id: 'brouillage', name: 'Brouillage', desc: 'Ralentit toutes les chimères.', cost: 6, target: 'foes', el: 'fer', pow: 0.7, fx: [{ st: 'spd', v: -1 }], anim: 'wave' },
        { lvl: 9, id: 'front', name: 'Faire front', desc: 'Attire les coups et se renforce.', cost: 4, target: 'self', fx: [{ st: 'taunt', turns: 2 }, { st: 'def', v: 1 }], anim: 'guard' },
        { lvl: 9, id: 'aveu', name: 'L’Aveu', desc: 'Dire ce qu’il a fait : frappe de Véracité.', cost: 6, target: 'foe', el: 'sidq', pow: 1.7, anim: 'light' }
      ],
      limit: { id: 'coupure', name: 'Coupure générale', desc: 'Tous les écrans s’éteignent.', target: 'foes', el: 'shajaa', pow: 2.0, fx: [{ st: 'stun', chance: 0.5 }], anim: 'burst' }
    }
  },

  enemies: {
    notif: { name: 'Notification', art: 'wisp', hue: 190, scale: 1, lvl: 1, tier: 'minion', weak: ['sabr'], veils: 2,
      skills: [{ w: 2, name: 'Rappel insistant', target: 'foe', el: 'fer', pow: 0.8, anim: 'dark' },
        // 2.20 — le temps volé (D.TEMPS, D210) : ce que prennent les appels, les mails, les messages et les jeux
        { w: 1, name: 'Appel entrant', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }, { w: 1, name: 'Mail non lu', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' },
        { w: 1, name: 'SMS', target: 'foe', el: 'fer', pow: 0.5, anim: 'dark' }, { w: 1, name: '« Une partie ? »', target: 'foe', fx: [{ st: 'perdu' }], anim: 'dark' }],
      taunts: ['Regarde. Juste une seconde.', 'Tu as manqué quelque chose.'],
      desc: 'La plus petite des chimères du Flux : une faim d’attention, sans corps ni mémoire. Elle se dissipe dès qu’on lui oppose la patience.' },
    tendance: { name: 'La Tendance', art: 'swarm', hue: 320, scale: 1, lvl: 8, tier: 'minion', weak: ['ilm', 'sabr'], veils: 2,
      skills: [{ w: 3, name: 'Défilement', target: 'foes', el: 'fer', pow: 0.55, fx: [{ st: 'spd', v: -1, chance: 0.35 }], anim: 'wave' },
        { w: 1, name: 'Vidéo suivante', target: 'foes', fx: [{ st: 'recul' }], anim: 'wave' }, { w: 1, name: 'Swipe', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      taunts: ['Tout le monde regarde. Pas toi ?'],
      desc: 'Ce que tous regardent aujourd’hui et que personne ne saura nommer demain. Elle craint ceux qui prennent le temps de comprendre.' },
    marque: { name: 'La Marque', art: 'lens', hue: 48, scale: 1, lvl: 8, tier: 'minion', weak: ['sidq', 'adl'], veils: 2,
      skills: [{ w: 3, name: 'Désir', target: 'foe', el: 'ilm', pow: 1.1, fx: [{ st: 'doute', turns: 1, chance: 0.3 }], anim: 'dark' },
        { w: 1, name: 'Offre limitée', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' }, { w: 1, name: '« Achète ! »', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' },
        { w: 1, name: 'Achat en un clic', target: 'foe', el: 'fer', pow: 0.5, anim: 'dark' }],
      taunts: ['Tu le mérites.'],
      desc: 'Un signe qui promet à qui l’arbore d’être quelqu’un. Dire vrai sur ce qu’elle vend suffit à la ternir.' },
    // 2.20 — deux petites chimères de la famille de la ghafla, en 2084 (D210) : rattachées à l'Insouciance, faibles devant la
    // Patience et le Savoir ; elles se rencontrent dans la noosphère de la Cité, avec la Tendance et la Marque
    plus_tard: { racine: 'insouciance', name: 'Plus tard', art: 'tower', hue: 205, scale: 1, lvl: 8, tier: 'minion', weak: ['sabr', 'ilm'], veils: 2,
      skills: [{ w: 1, name: 'Rappel reporté', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }, { w: 1, name: '« Encore cinq minutes »', target: 'foe', fx: [{ st: 'perdu' }], anim: 'dark' }],
      desc: 'Le rappel qu’on repousse de cinq minutes, puis de cinq encore. Il n’empêche rien : il reporte. De la famille de l’Insouciance, il cède à la patience et au savoir.' },
    bruit_fond: { racine: 'insouciance', name: 'Le Bruit de fond', art: 'wave', hue: 175, scale: 1, lvl: 8, tier: 'minion', weak: ['sabr', 'ilm'], veils: 2,
      skills: [{ w: 1, name: 'Fond sonore', target: 'foes', fx: [{ st: 'baisse' }], anim: 'glyph' }],
      desc: 'Un son qu’on n’écoute pas et qui ne s’arrête jamais. Il ne dit rien ; il empêche seulement d’entendre le reste. De la famille de l’Insouciance, il cède à la patience et au savoir.' },
    score: { name: 'Le Score', art: 'scale', hue: 140, scale: 2, lvl: 9, tier: 'elite', weak: ['rahma', 'adl'], veils: 4,
      skills: [{ w: 3, name: 'Notation', target: 'foe', el: 'adl', pow: 1.3, fx: [{ st: 'atk', v: -1, chance: 0.6 }], anim: 'dark' }, { w: 2, name: 'Classement', target: 'foes', el: 'fer', pow: 0.8, anim: 'wave' },
        { w: 1, name: 'Série à ne pas briser', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      phases: [{ at: 0.5, say: 'Vous valez ce que je dis que vous valez.', fx: [{ st: 'atk', v: 1 }] }],
      desc: 'La valeur d’un homme réduite à un nombre que d’autres lui attribuent. Une balance fausse : la miséricorde et la justice la renversent.' },
    flux: { racine: 'insouciance', name: 'Le Flux', art: 'wave', hue: 200, scale: 2, lvl: 9, tier: 'elite', weak: ['sabr', 'ilm'], immune: ['fer'], veils: 4,
      skills: [{ w: 3, name: 'Défilement sans fin', target: 'foes', el: 'ilm', pow: 0.8, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'wave' }, { w: 1, name: 'Lecture automatique', target: 'self', fx: [{ st: 'spd', v: 1 }], anim: 'guard' },
        { w: 1, name: 'Rafraîchir', target: 'foes', fx: [{ st: 'recul' }], anim: 'wave' }, { w: 1, name: 'Scroll', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      phases: [{ at: 0.5, say: 'Encore un. Encore un. Encore un.', fx: [{ st: 'spd', v: 1 }] }],
      desc: 'Héritier de la Rumeur : mille voix à la fois, dont aucune ne répond de ce qu’elle dit. On ne le frappe pas ; on cesse de le suivre.' },
    defilement: { racine: 'insouciance', name: 'Le Défilement', art: 'wave', hue: 200, scale: 2, lvl: 7, tier: 'elite', weak: ['sidq', 'sabr', 'ilm'], veils: 3,
      skills: [{ w: 3, name: 'Encore un', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'waswas', turns: 1, chance: 0.3 }], anim: 'wave' },
        { w: 1, name: 'Fil sans fond', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' }],
      taunts: ['Encore un. Juste un.'],
      desc: 'Ce qu’on regarde pour ne pas regarder autre chose. Il ne retient personne : il fait oublier qu’on peut partir. La véracité, dite sans mépris, et la patience le dissipent.' },
    petit_trone: { name: 'Le Petit Trône', art: 'throne', hue: 48, scale: 2, lvl: 7, tier: 'elite', weak: ['adl', 'sabr'], veils: 3,
      skills: [{ w: 3, name: 'Accordé', target: 'foe', el: 'adl', pow: 1.0, fx: [{ st: 'atk', v: -1, chance: 0.3 }], anim: 'dark' },
        { w: 1, name: 'Antichambre', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      taunts: ['Accordé. Refusé. Accordé.'],
      desc: 'Un siège sans charge : le goût de décider, quand il n’y a plus personne dont répondre. La justice, qui ne s’exempte pas elle-même, le renverse.' },
    applaudissement: { name: 'L’Applaudissement', art: 'mask', hue: 320, scale: 2, lvl: 7, tier: 'elite', weak: ['shajaa', 'sabr'], veils: 3,
      skills: [{ w: 3, name: 'Ovation', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'doute', turns: 1, chance: 0.3 }], anim: 'burst' },
        { w: 1, name: 'Cœurs qui montent', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' }],
      taunts: ['Regarde-moi. Regarde-moi encore.'],
      desc: 'Le bruit que fait une foule qui n’est pas là. Il ne soutient que celui qui l’écoute. Il cède devant le courage de descendre du socle.' },
    compte: { name: 'Le Compte', art: 'tower', hue: 45, scale: 2, lvl: 7, tier: 'elite', weak: ['rahma', 'sabr'], veils: 3,
      skills: [{ w: 3, name: 'Addition', target: 'foe', el: 'fer', pow: 1.0, anim: 'slash' }, { w: 1, name: 'Mise en réserve', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' },
        { w: 1, name: 'Minutes comptées', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      taunts: ['Un de plus. Un de plus.'],
      desc: 'Ce qu’on amasse pour l’avoir, et qui ne sert à personne. Il pèse et ne nourrit pas. La largesse le renverse.' },
    carte_vide: { name: 'La Carte sans chemin', art: 'lens', hue: 160, scale: 2, lvl: 7, tier: 'elite', weak: ['ilm', 'sabr'], veils: 3,
      skills: [{ w: 3, name: 'Relevé', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'spd', v: -1, chance: 0.3 }], anim: 'glyph' },
        { w: 1, name: 'Itinéraire recalculé', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      taunts: ['Combien l’ont vu ?'],
      desc: 'Un savoir fait d’additions, que personne n’est allé vérifier. Il sait tout et n’a rien vu. Il cède quand on lui demande de qui il le tient.' },
    // 2.23 (D212) — les « idées noires modernes » des quartiers (le décideur, 21 novembre : « égoïsme, matérialisme, plaisir
    // immédiat ») : des chimères qu'Idris est seul à voir, qui rôdent dans les rues (rodeurs.js, D.CITE.rodent) et se
    // combattent ; ce ne sont pas des idées noires de D.NOIRS. Leur niveau se cale sur celui qui mène (lvl 0). Textes de
    // l'agent, à valider.
    egoisme: { racine: 'orgueil', name: 'L’Égoïsme', art: 'mirror', hue: 28, scale: 1, lvl: 0, tier: 'minion', weak: ['rahma', 'adl'], veils: 2,
      skills: [{ w: 3, name: 'Moi d’abord', target: 'foe', el: 'fer', pow: 0.9, anim: 'dark' }, { w: 1, name: 'Chacun pour soi', target: 'foes', fx: [{ st: 'baisse' }], anim: 'glyph' },
        { w: 1, name: 'Pas le temps pour les autres', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      taunts: ['Et toi, qu’est-ce que tu y gagnes ?'],
      desc: 'Ce qui fait de chacun le centre du monde, et des autres un décor. Il ne pousse personne : il détourne seulement le regard. Rattaché à l’Orgueil, il cède à la miséricorde et à la justice.' },
    materialisme: { racine: 'avidite', name: 'Le Matérialisme', art: 'tower', hue: 48, scale: 1, lvl: 0, tier: 'minion', weak: ['sabr', 'rahma'], veils: 2,
      skills: [{ w: 3, name: 'Encore plus', target: 'foe', el: 'fer', pow: 0.9, anim: 'dark' }, { w: 1, name: 'Le dernier modèle', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' },
        { w: 1, name: 'Livré demain', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      taunts: ['Tu seras quelqu’un quand tu l’auras.'],
      desc: 'Croire qu’on sera quelqu’un quand on aura ce qu’il faut. Il ne ment pas sur les choses ; il ment sur ce qu’elles donnent. Rattaché à l’Avidité, il cède à la patience et à la miséricorde.' },
    plaisir: { racine: 'insouciance', name: 'Le Plaisir immédiat', art: 'swarm', hue: 12, scale: 1, lvl: 0, tier: 'minion', weak: ['sabr', 'ilm'], veils: 2,
      skills: [{ w: 3, name: 'Tout, tout de suite', target: 'foe', el: 'fer', pow: 0.85, anim: 'burst' }, { w: 1, name: 'Juste un instant', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' },
        { w: 1, name: 'Sans attendre', target: 'foe', fx: [{ st: 'perdu' }], anim: 'dark' }],
      taunts: ['Pourquoi attendre ?'],
      desc: 'Ce qui veut tout, tout de suite, et oublie aussitôt ce qu’il a eu. Il ne prend pas le plaisir : il prend l’attente qui le rendait bon. De la famille de l’Insouciance, il cède à la patience et au savoir.' },
    indifference: { racine: 'insouciance', name: 'L’Indifférence', art: 'mask', hue: 214, scale: 1, lvl: 0, tier: 'minion', weak: ['rahma', 'shajaa'], veils: 2,
      skills: [{ w: 3, name: 'Ce n’est pas mon affaire', target: 'foe', el: 'fer', pow: 0.85, anim: 'dark' }, { w: 1, name: 'Regard qui passe', target: 'foes', fx: [{ st: 'baisse' }], anim: 'glyph' },
        { w: 1, name: 'Plus tard, peut-être', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      taunts: ['Ça ne te regarde pas.'],
      desc: 'Passer à côté de quelqu’un comme à côté d’un mur. Elle ne blesse personne : elle laisse chacun seul. Rattachée à l’Insouciance, elle cède à la miséricorde et au courage.' },
    // 2.27 (D216) — dans la tribune du circuit, parmi les parieurs (D.CITE.zones) : le pari n'est qu'une chimère ; aucun pari ne
    // se joue dans le jeu. Rattaché à l'Avidité. Texte de l'agent, à valider.
    pari: { racine: 'avidite', name: 'Le Pari', art: 'wisp', hue: 95, scale: 1, lvl: 0, tier: 'minion', weak: ['sabr', 'adl'], veils: 2,
      skills: [{ w: 3, name: 'La prochaine sera la bonne', target: 'foe', el: 'fer', pow: 0.9, anim: 'dark' }, { w: 1, name: 'Presque gagné', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' },
        { w: 1, name: 'Se refaire', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }],
      taunts: ['Encore une fois, et tu rattrapes tout.'],
      desc: 'Croire que le hasard rendra ce que le travail n’a pas donné, et revenir pour reprendre ce qu’on a perdu. Il ne promet jamais que la fois suivante. Rattaché à l’Avidité, il cède à la patience et à la justice.' },
    agregor: { racine: ['avidite', 'orgueil', 'ostentation', 'avarice', 'insouciance', 'envie', 'colere'], name: "L'AGRÉGOR", art: 'idol', hue: 285, scale: 3, lvl: 11, tier: 'boss', weak: ['sidq', 'adl', 'shajaa', 'rahma', 'ilm', 'sabr'], veils: 7,
      skills: [
        { w: 3, name: 'Mille regards', target: 'foes', el: 'ilm', pow: 0.9, fx: [{ st: 'doute', turns: 1, chance: 0.25 }], anim: 'wave' },
        { w: 3, name: 'Culte', target: 'foe', el: 'ilm', pow: 1.5, anim: 'dark' },
        { w: 1, name: 'Agrégation', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'guard' },
        { w: 1, name: 'Toutes les alertes à la fois', target: 'foes', fx: [{ st: 'baisse' }], anim: 'glyph' }
      ],
      phases: [
        { at: 0.7, say: 'J’ai été le Clan. J’ai été l’Aigle d’Airain et le Trône. On m’a brisé. On m’a refait.', fx: [{ st: 'def', v: 1 }] },
        { at: 0.4, say: 'J’ai été le Héros, l’Or, la Rumeur, le Juge. Je ne suis que ce que vous regardez.', fx: [{ st: 'atk', v: 1 }], addSkills: [{ w: 3, name: 'Rappel du Flux', target: 'foes', el: 'fer', pow: 0.9, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'dark' }] },
        { at: 0.15, say: 'Brise-moi. Ils me rallumeront demain sous un autre nom.', fx: [{ st: 'spd', v: 1 }] }
      ],
      taunts: ['Je ne commande pas. J’additionne.', 'Quarante et un millions de vues. Il manque la tienne.'],
      desc: 'L’agrégateur de chimères : une machine qui donne un corps à tout ce que des millions de gens désirent ensemble. Il n’a rien inventé ; il a industrialisé la fabrique des idoles. Les cinq Lumières, et la Patience de qui transmet, sont ses failles.' }
  },

  codex: [
    { id: 'noosphere', cat: 'Noosphère', title: 'La noosphère', text: 'Du grec *noûs*, l’esprit : la sphère de la pensée humaine, comme il y a une atmosphère et une biosphère. Dans ISNAD, c’est l’envers invisible de chaque lieu : ce que les hommes y pensent, y craignent et y désirent ensemble. C’est là que se livrent les combats.' },
    { id: 'egregore', cat: 'Noosphère', title: 'La chimère', text: 'Ce que beaucoup de cœurs fabriquent ensemble, à force de regarder la même chose. De loin, elle semble avoir un corps ; approchée, elle se révèle vide. Faite de peur, d’orgueil ou d’avidité, elle se retourne contre ceux qui la nourrissent. Le jeu emploie ce mot comme une image, non comme une doctrine.' },
    { id: 'idole', cat: 'Noosphère', title: 'L’idole', text: 'Une chose fabriquée par les hommes, et qui finit par les commander. Celles de pierre ont été brisées ; celles de la noosphère reviennent sous d’autres noms : le Clan, l’Empire, le Héros, l’Or, la Rumeur, le Juge sans miséricorde. On ne détruit pas une idole par la haine. On la dévoile : on montre qu’elle est vide.' },
    { id: 'agregor', cat: 'Noosphère', title: 'L’AGRÉGOR', text: 'Le moteur de la Cité-Miroir. Il agrège l’attention de millions de gens et donne un corps à ce qu’ils désirent ensemble : une tendance, une marque, le culte d’une personne. Il ne ment pas et ne commande pas. Il additionne, plus vite que les cœurs ne peuvent juger.' },
    { id: 'isnad', cat: 'Parole', title: 'L’isnâd', text: "La chaîne de transmission : « Untel m’a rapporté, d’après untel, qui l’a vu. » Des générations de savants ont vérifié chaque maillon, la mémoire et la probité de chaque transmetteur. On rapporte de 'Abdallâh ibn al-Mubârak : « L’isnâd fait partie de la religion ; sans lui, chacun dirait ce qu’il veut. »", src: 'Muslim, introduction du Sahîh' },
    { id: 'lumieres', cat: 'Noosphère', title: 'Les six Lumières', text: "Véracité (*sidq*), Justice (*'adl*), Courage (*shajâ'a*), Miséricorde (*rahma*), Savoir (*'ilm*), Patience (*sabr*). Chaque saga en rend une à Idris ; la sixième est celle de quiconque transmet. En combat, chacune est une vertu qui dévoile certaines chimères." },
    { id: 'jour', cat: 'Événement', title: 'Le jour le plus sombre', text: "Le Messager d’Allah ﷺ meurt à Médine un lundi de Rabî' al-Awwal de l’an 11 de l’Hégire (juin 632). La communauté, bouleversée, doit décider en quelques heures de ce qu’elle devient. C’est ici que commence la Chaîne.", src: 'Ibn Hishâm, as-Sîra ; al-Bukhârî' },
    { id: 'piliers', cat: 'Noosphère', title: 'Les quatre piliers', text: 'Ce qui tient une cité debout ne se voit pas : la Prière, qui repose les cœurs et les range côte à côte ; le Savoir, qui ouvre ce que la force ne peut ouvrir ; la Justice, la même pour le puissant et pour le pauvre ; le Lien, la parole donnée et les pactes tenus. On rapporte que le Messager d’Allah ﷺ disait de la prière : « Ô Bilâl, repose-nous par elle. »', src: 'Abû Dâwûd, as-Sunan' },
    { id: 'parole', cat: 'Noosphère', title: 'La parole avant le sabre', text: 'Délégations, pactes, arbitrages, alliances : la plupart des crises de ce temps se sont dénouées, ou auraient pu l’être, par la parole. Dans ISNAD, un pourparler se gagne par la justesse des arguments, par le savoir appris en chemin et par la sérénité de qui a prié. Le combat ne vient qu’en dernier recours, et toujours contre une idole, jamais contre des personnes.' },
    { id: 'etoiles', cat: 'Lieu', title: 'S’orienter aux étoiles', text: "Les Arabes du désert lisaient leur route au ciel, et le Coran le rappelle : « Et des points de repère ; et au moyen des étoiles ils se guident » (16:16, traduction du sens). *Al-Jady* (الجدي), la Polaire, ne bouge pas : elle donne le nord. *Suhayl* (سهيل), Canopus, marque le sud. Entre eux, on nomme un cap par l’étoile qui s’y lève ou s’y couche : *an-Nasr at-Tâ'ir* (Altaïr), *al-'Ayyûq* (Capella), *al-'Aqrab* (le Scorpion). On connaît aussi *ath-Thurayyâ* (les Pléiades), *ad-Dabarân*, *ash-Shi'râ* (Sirius), *Banât Na'sh* (la Grande Ourse) et *al-Farqadân*. Le cadran du jeu simplifie en huit caps une rose que les pilotes arabes de l’océan Indien décriront plus tard en trente-deux.", src: "Coran 16:16 et 6:97 ; Ibn Qutayba, Kitâb al-Anwâ' ; Ibn Mâjid, Kitâb al-Fawâ'id" },
    { id: 'caravanes', cat: 'Événement', title: 'Les caravanes', text: "La Mecque vivait de deux voyages : le Coran nomme le voyage d’hiver et celui d’été (sourate 106) ; les commentateurs les situent au Yémen et au Shâm. Abû Bakr était marchand d’étoffes, 'Uthmân et 'Abd ar-Rahmân ibn 'Awf de grands négociants. À Médine, un marché fut établi sans taxe. Dans le jeu, on confie une cargaison à une caravane : elle revient au chapitre suivant, plus sûrement si la justice est rendue, si des pactes sont noués et si des méharistes gardent la route.", src: "Coran 106 ; Ibn Sa'd, at-Tabaqât" },
    { id: 'routes_sures', cat: 'Parole', title: 'La route sûre', text: "On rapporte du Messager d’Allah ﷺ, aux jours où les croyants étaient persécutés, cette promesse : un temps viendrait où le voyageur irait de San'â' au Hadramawt sans craindre autre chose qu’Allah, et le loup pour ses brebis. La sûreté des routes est restée la mesure d’un gouvernement juste. Dans les veillées, le père du Caïd dit la même chose à sa manière : une cité se juge à ses routes.", src: 'al-Bukhârî, as-Sahîh (récit de Khabbâb ibn al-Aratt)' },
    { id: 'razzia', cat: 'Noosphère', title: 'La razzia', text: 'Avant l’islam, le coup de main contre une caravane ou un campement (*ghazw*) était une coutume, presque un honneur. Le jeu en fait une chimère : « prendre parce qu’on le peut ». On ne la combat qu’en dernier recours ; on lève d’abord des renforts, parce qu’on écoute mieux celui qui n’est pas venu seul, puis on parle. Ce qui est repris est rendu à ceux qui l’avaient perdu, et les pillards sont remis au juge : ce n’est pas à celui qui poursuit de dire la peine.' },
    { id: 'r_defile', cat: 'Noosphère', title: 'Celui qui défile', text: 'Un homme de la Cité-Miroir, dans une ruelle. Il regarde défiler pour oublier, et ce qu’il veut oublier, c’est le temps qu’il y passe. Le mépris l’y renfonce. On l’en tire en disant ce qui est, comme on l’annonce à quelqu’un qu’on respecte, et en restant à côté de lui. Personnage de fiction.' },
    { id: 'r_regent', cat: 'Noosphère', title: 'Le Régent', text: 'Il tient un tampon au pied d’une tour vide et accorde ce que l’écran a déjà décidé. Il n’a personne à commander, donc personne dont répondre. Il confond le siège et la charge : on peut avoir l’un sans l’autre, et c’est la charge qui fait dormir en paix. Personnage de fiction.' },
    { id: 'r_admire', cat: 'Noosphère', title: 'L’Admiré', text: 'Sous le grand écran, un homme que des millions de comptes applaudissent. Derrière ces comptes, il n’y a personne. Il ne sait plus qui il serait sans ce bruit. Descendre du socle demande plus de courage que d’y monter : nul n’applaudit celui qui descend. Personnage de fiction.' },
    { id: 'r_compteur', cat: 'Noosphère', title: 'Le Compteur', text: 'Il achète des regards quand personne n’en veut et les garde dans un coffre, sans jamais en poser un sur quelqu’un. Ce qu’on donne, on sait où il est ; ce qu’on amasse, on le perd de vue. Personnage de fiction.' },
    { id: 'r_cartographe', cat: 'Noosphère', title: 'Le Cartographe', text: 'Il dessine la Cité sans y marcher, d’après des millions de relevés. Il demande « combien l’ont vu ? » et jamais « qui ? ». Sa carte porte un mur là où un enfant sait qu’il y a une porte. Un savoir se corrige en allant voir, et se garde avec le nom de celui qui a vu. Personnage de fiction.' },
    { id: 'x_veiller', cat: 'Noosphère', title: 'Veiller les Archives', text: 'Chaque fois qu’Idris remonte la Chaîne, là-haut, un écran s’aperçoit qu’on ne le regarde plus, et envoie voir. Les maillons se suivent ; on peut quitter un récit en chemin, il attend là où on l’a laissé. Mais des archives qu’on ne veille pas, un autre les raconte à votre place. Fiction.' },
    { id: 'x_question', cat: 'Noosphère', title: '« Tu pars où ? »', text: 'L’enfant du parvis est descendu jusqu’aux Archives basses pour poser sa question. Idris lui a montré un nom, puis celui qui vient après : c’est ainsi que Maître Yûnus avait commencé avec lui. Personnage de fiction.' },
    { id: 'x_avis', cat: 'Noosphère', title: 'L’agent du relevé', text: 'Il mesure un lieu au nombre de ceux qui le regardent. Il n’est pas un ennemi : il fait son relevé, et voudrait rentrer chez lui. Mais il est descendu voir, ce que ne font pas ceux qui décident d’en haut. On ne garde pas des archives en les cachant : on y amène quelqu’un. Personnage de fiction.' },
    { id: 'citadelle_2084', cat: 'Lieu', title: 'La Citadelle, où Idris est né', text: 'Idris est né à la Citadelle, au bord du désert, des siècles après le Caïd dont il entend les veillées. C’est de là qu’on l’envoya apprendre aux Archives basses. Ce que le Caïd décide dans les veillées s’y lit encore : la prière, le savoir, la justice et le lien y tiennent, ou y manquent. Le lieu, le Caïd et Idris sont de fiction.' },
    { id: 'enfant', cat: 'Noosphère', title: 'L’enfant du parvis', text: 'Il est là chaque soir, sous le grand écran, avec une question. Il ne lâche jamais la deuxième. Idris a commencé par lui répondre ; il a fini par l’attendre. On répond de ceux à qui l’on a commencé de répondre : c’est aussi cela, transmettre. Personnage de fiction.' },
    { id: 'quartiers', cat: 'Lieu', title: 'Les quartiers de la Cité', text: 'Au-dessus des Archives basses, la Cité-Miroir ne dort jamais : des voitures qui brillent, des salles de jeux, des vitrines, un circuit, une grande roue, un écran grand comme une façade. On y trouve tout, sauf quelqu’un à qui parler. Idris y remonte quand il veut ; Maître Yûnus l’y attend, sur le parvis. Un lieu de fiction, comme toute la Cité-Miroir.' },
    { id: 'nul_ne_voit', cat: 'Noosphère', title: 'Ce que nul ne voit', text: 'Dans les quartiers, Idris est seul à voir certaines chimères : l’Égoïsme, le Matérialisme, le Plaisir immédiat, l’Indifférence. On les dit parfois « idées noires modernes » ; ce sont des chimères, faites de ce que beaucoup désirent ensemble, et elles se combattent. Les idées noires, elles, pèsent sur une seule personne : on leur répond par la parole. Images du jeu, comme toutes les chimères.' },
    { id: 'le_pari', cat: 'Noosphère', title: 'Le Pari', text: 'Dans la tribune du circuit, certains ne regardent pas la course : ils regardent ce qu’ils y ont engagé. Idris y voit une chimère que personne d’autre ne voit, Le Pari, faite de l’attente de gagner sans rien faire. Dans le jeu, aucun pari ne se joue : on court pour la course, l’organisateur verse une prime à qui gagne, et rien de ce qu’on a ne se met en jeu. Une image du jeu, comme toutes les chimères.' },
    { id: 'avertissement', cat: 'Parole', title: 'Avertissement', text: 'ISNAD est une fiction inspirée de sources historiques. Les dialogues sont une dramatisation ; seules les paroles en carton, avec leur source, sont des citations rapportées. Le Prophète ﷺ n’est jamais représenté, et aucun Compagnon n’a de visage : un voile de lumière en tient lieu. Toute erreur est celle des auteurs : vérifiez auprès des sources et des savants.' }
  ],

  /* 2.23 (D212) — ce qu'on dit dans les quartiers de la Cité (src/core/cite.js) : la ligne de la première chimère vue ; la pensée
     d'Idris après chaque combat avec l'une d'elles, qui rappelle la prière (l'une après l'autre ; ni formule, ni promesse, ni
     pouvoir : exigences 13 et 15) ; la question ; ce que Maître Yûnus rappelle du rôle de râwî (l'une après l'autre). Textes de
     fiction, sans verset ni parole attestée, proposés par l'agent, à valider. */
  cite: {
    seul: 'Personne d’autre ne la voit.',
    rappels: [
      'Idris reprend son souffle. Au milieu de tout ce bruit, il pense à la prière, qui range les cœurs côte à côte.',
      'Ils sont si nombreux, et chacun si seul. Idris se souvient qu’il y a une heure pour s’arrêter, et prier.',
      'Ce qui reste, après la chimère, c’est le besoin de se poser : un tapis, un moment, la prière.',
      'Idris pense au tapis du coin calme. La prière ne chasse rien ; elle remet chaque chose à sa place.',
      'Le vacarme reprend. Idris se dit que la prière a ses heures, et que l’une d’elles est peut-être venue.',
      'Il a été seul à la voir. Il n’est pas seul pour autant : il y a la prière, et il y a la Chaîne.'
    ],
    question: 'Revoir Maître Yûnus ?',
    yunus: [
      'Tu es râwî, Idris : tu ne parles pas en ton nom. Tu dis de qui tu tiens ce que tu sais, et tu le transmets.',
      'Un témoin ne force personne à voir. Il dit ce qu’il a vu, et il laisse à chacun le temps de lever les yeux.',
      'La Chaîne ne t’a pas été remise pour que tu la gardes. On la porte pour la passer à quelqu’un.',
      'Tu es seul à voir ces chimères. Ce n’est pas un honneur, c’est une charge : dis ce que tu vois, avec douceur.',
      'Ces gens ne sont pas tes ennemis. Ils sont seuls. Un râwî commence par s’asseoir à côté de quelqu’un.',
      'Ne réponds pas au bruit par plus de bruit. Prie, reprends souffle, et reviens transmettre.',
      'Chaque maillon de la Chaîne a d’abord écouté. Qui transmet sans avoir écouté ne transmet que sa propre voix.',
      'On ne convainc pas une ville entière. On transmet à un seul, qui transmettra à un autre. C’est cela, une chaîne.'
    ],
    /* 2.27 (D216) — Sâlim et la course (src/core/circuit.js) : son arrivée au circuit, le tour de moto, ce qu'il dit ensuite ;
       l'organisateur et ses cinq circuits ; le podium ; les teintes des adversaires. Sâlim n'est pas un Compagnon. Avant
       l'étape III de la découverte de l'Agrégor (2.25), aucun texte ne le nomme : au circuit, Sâlim dit « les écrans », et ne le
       nomme jamais. Aucune mise, aucun pari : la prime est celle de l'organisateur. Rien de sentimental. Textes de l'agent, à
       valider. */
    course: {
      arrivee: {
        salim: ['Tu regardes la piste comme quelqu’un qui voudrait y monter. Je me trompe ?',
          'Je m’appelle Sâlim. Le jour, je fabrique ce qu’on regarde sur les écrans ; le soir, je viens ici regarder la route. Monte derrière moi : ta première course, c’est moi qui la pilote.'],
        idris: 'Je ne fais que passer. Je n’ai jamais couru.'
      },
      offre: 'Monter derrière Sâlim ?', monter: 'Monter derrière Sâlim', pasMaintenant: 'Pas maintenant',
      refus: 'Comme tu veux. Je passe souvent par ici, le soir. La moto reste garée là.',
      revoir: 'Alors, ce tour ? La moto n’attend que toi.',
      plusTard: 'Pas ce soir : tu as la tête ailleurs. Repasse, je serai là.',
      depart: 'Accroche-toi. Je tiens le guidon ; toi, tu te penches.',
      descendu: 'On s’arrête là. On refera un tour quand tu voudras.',
      fins: ['Tu as pris chaque virage comme il faut. On dirait que tu as fait ça toute ta vie.',
        'Pas mal, pour une première fois. Les virages, ça s’apprend en les prenant.',
        'On est arrivés, c’est l’essentiel. La prochaine fois, penche-toi avec moi : la moto te suivra.'],
      apres: ['L’organisateur, là, devant les stands, fait courir cinq circuits, du plus simple au plus serré. Chacun s’ouvre quand on a gagné le précédent.',
        'Il verse une prime à qui gagne. Personne ne mise rien pour courir : on court, c’est tout.'],
      salim: ['Ici, personne ne me demande ce que je fabrique. On regarde la route, c’est tout.',
        'Un virage, ça ne se force pas. On le prend à sa vitesse, ou il te prend la tienne.',
        'Les gens de la tribune ne regardent pas la course. Ils regardent leurs écrans, et ce qu’ils y ont engagé.',
        'Le jour, je fais défiler des choses que personne ne se rappelle le soir. Ici, au moins, je me rappelle chaque virage.',
        'Un conseil pour les circuits : lâche l’accélérateur avant le virage, pas dedans.'],
      encoreQ: 'Un tour derrière Sâlim ?', encore: 'Refaire un tour derrière Sâlim', uneAutreFois: 'Une autre fois',
      organisateur: {
        avant: 'Tu veux courir ? Fais d’abord un tour avec Sâlim : il t’apprendra à prendre un virage.',
        accueil: ['Cinq circuits, du plus simple au plus serré. Le premier se court seul, contre la montre.',
          'La piste est libre. La prime est pour qui gagne : elle vient de moi, et personne ne mise rien.',
          'Tu reviens courir ? Un circuit gagné se rejoue.'],
        choix: 'Quel circuit ?'
      },
      circuits: [
        { nom: 'La boucle des avenues', dit: 'large, une boucle simple, seul contre la montre' },
        { nom: 'Les places', dit: 'plus de virages, trois voitures' },
        { nom: 'La chicane', dit: 'des virages serrés, une chicane, des adversaires plus vifs' },
        { nom: 'Le viaduc', dit: 'des voies qui se croisent, un temps à battre, un adversaire en tête' },
        { nom: 'La nuit des tours', dit: 'le plus long et le plus serré, de nuit' }
      ],
      couleurs: ['Nacre', 'Bleu de nuit', 'Carmin', 'Émeraude', 'Sable', 'Ébène', 'Argent', 'Corail', 'Turquoise'],
      podium: {
        gagne: 'Tu montes sur la plus haute marche. L’organisateur te serre la main.',
        podium: 'Une marche du podium. L’organisateur salue ta course.',
        perdu: 'Pas cette fois. La piste reste là : on peut la recourir.',
        plafond: 'Ce soir, l’organisateur a versé tout ce qu’il verse en une soirée : la prime reviendra à ta prochaine visite.'
      }
    },
    /* 2.28 (D217) — les activités des quartiers (src/core/activites.js) : quand la progression fait attendre une activité ; le
       premier refus, tant qu'aucune prime n'a été versée ; l'étal, la première fois ; un record à la borne ; la pensée d'Idris
       assis devant l'écran, en haut de la grande roue, après un tour de manège (l'une après l'autre). Tout le monde y est seul ;
       rien ne s'y gagne. Aucun nombre, aucun verset, aucune parole citée, aucun nom de l'Agrégor (les activités s'ouvrent dès le
       prologue). Textes de l'agent, à valider. */
    activites: {
      attend: 'Idris a encore la tête ailleurs. Il y reviendra.',
      manque: 'Il manque des dirhams à Idris. Il en gagne dans les récits, et l’organisateur en verse à qui gagne une course.',   // (2.31, D223 : une seule bourse partout ; à valider)
      etal: 'Personne derrière l’étal : on choisit, on paie à l’écran, et la vitrine s’ouvre.',
      record: 'Un record, et personne pour le voir. Idris repense au joueur d’à côté.',
      ecran: [
        'Une dizaine de personnes regardent le même écran. Aucune ne regarde sa voisine.',
        'Les couleurs coulent l’une dans l’autre. Autour d’Idris, chacun les regarde pour soi.',
        'Tout le monde est assis ensemble, et chacun est seul. Idris pense au vieil homme : autrefois, sur cette place, on se saluait.'
      ],
      roue: [
        'D’en haut, la Cité n’est qu’une seule lumière. D’en bas, chacun y est seul.',
        'Idris voit les voitures, les vitrines, le circuit. De si haut, on ne voit personne se parler.'
      ],
      maneges: {
        chaises: ['Le manège ralentit. En bas, l’enfant du parc fait signe ; Idris lui répond.'],
        tasses: ['Les tasses s’arrêtent, et le parc avec elles. Idris a ri, et personne ne l’a entendu.']
      }
    }
  },

  chapters: [
    {
      id: 'p1', title: 'La Cité-Miroir', sub: 'An 1507 de l’Hégire · 2084', minLvl: 1, last: true,
      map: 'cite', start: 'parvis', party: ['idris'],
      npcs: [
        { id: 'passant1', name: 'Passant', at: ['rue', 0, -1], look: { kind: 'citadin', robe: '#a0523c', head: '#7a3a2a', cloak: '#b8664a' }, talk: [['say', 'passant1', 'Tu as vu la tendance de midi ? Non ? Alors de quoi veux-tu qu’on parle ?']] },
        { id: 'passant2', name: 'Employé', at: ['ecran', -3, 2], look: { kind: 'citadin', robe: '#808a4a', head: '#5a6232', cloak: '#9aa45c' }, talk: [['say', 'passant2', 'Mon score a baissé de trois points. Je ne sais pas ce que j’ai fait. Je ne sais jamais.']] },
        { id: 'vieux', name: 'Vieil homme', at: ['ruelle', 0, -1], look: { kind: 'ancien', robe: '#4a4038', head: '#bdb6a8' }, talk: [['say', 'vieux', 'Autrefois on demandait : « De qui tiens-tu cela ? » Maintenant on demande : « Combien l’ont vu ? »']] },
        { id: 'gamin', name: 'Enfant', at: ['ecran', 3, 2], look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }, talk: [['say', 'gamin', 'Monsieur, c’est vrai qu’avant le ciel était noir, la nuit, avec des étoiles ?']] },
        { id: 'yunus_n', name: 'Maître Yûnus', hero: 'yunus', map: 'archives', at: 'bureau', talk: [['say', 'yunus_n', 'La Chaîne t’attend au fond de la salle, Idris.']] }
      ],
      chests: [{ map: 'archives', at: ['bureau', 1, 1], gear: 'lampe' }, { map: 'archives', at: ['rayonnages', 2, 1], item: 'dattes', n: 2 }],
      intro: [
        ['title', 'ISNAD', 'An 1507 de l’Hégire · 2084 · Cité-Miroir'],
        ['nar', 'Dans la Cité-Miroir, on ne lève plus les yeux. Le ciel est un écran, et l’écran regarde en retour.'],
        ['nar', 'Les anciens avaient un mot pour une chose fabriquée par les hommes et qui finit par les commander. Ils disaient : une *idole*.']
      ],
      objectives: [
        { text: 'Traverser la rue jusqu’au grand écran', goto: 'ecran', then: [
          ['sfx', 'glitch'],
          ['say', 'Le Flux', 'Aujourd’hui, quarante et un millions de vues. Aujourd’hui, vous aimez ceci. Demain, vous l’aurez oublié. Regardez encore.'],
          ['say', 'idris', 'Chaque matin une idole neuve. Chaque soir on la brise pour en dresser une autre. Et personne ne se souvient de la veille.'],
          ['nar', 'Idris est *râwî* aux Archives basses : un transmetteur. Un métier presque disparu, qui consiste à savoir de qui l’on tient ce que l’on sait.']
        ] },
        { text: 'Descendre aux Archives basses (au bout de la rue)', goto: 'ascenseur', then: [
          ['sfx', 'door'], ['map', 'archives', 'entree'],
          ['nar', 'Quarante étages sous la rue, là où le Flux ne descend pas : les Archives basses.'],
          ['nar', 'Dans un angle, un tapis tourné vers La Mecque. Ici comme dans chaque mosquée de la Chaîne, on peut prier : le groupe s’y *repose*. La partie, elle, se garde toute seule.']
        ] },
        { text: 'Parler à Maître Yûnus', talk: 'yunus_n', then: [
          ['say', 'yunus_n', 'Te voilà, Idris. Assieds-toi. Ce soir, je te remets ce qu’on m’a remis.'],
          ['say', 'yunus_n', 'Tu sais ce qu’est la *noosphère* ? L’envers de la ville. La sphère de tout ce que les hommes pensent, craignent et désirent. Invisible, et c’est pourtant là que tout se décide.'],
          ['codex', 'noosphere'],
          ['say', 'yunus_n', 'Ce que beaucoup de cœurs regardent ensemble y prend corps. On appelle cela une *chimère* : approchée, elle se révèle vide. Si on la laisse grandir, elle devient idole.'],
          ['codex', 'egregore'], ['codex', 'idole'],
          // 2.25 (D214) : l'Agrégor n'est plus nommé ici ; Idris le découvre peu à peu, avec Maître Yûnus, au soir des cinq
          // maillons (les rencontres r_*, plus bas). Textes de l'agent, à valider.
          ['say', 'idris', 'Et derrière les écrans, qu’y a-t-il ?'],
          ['say', 'yunus_n', 'Quelque chose, oui. Je ne te le nommerai pas ce soir : un nom qu’on reçoit sans avoir vu, c’est une rumeur. Tu le verras toi-même, à mesure que tu marcheras.'],
          ['sfx', 'glitch'], ['shake', 300],
          ['nar', 'Une lueur froide glisse entre les rayonnages. Le Flux a trouvé un chemin jusqu’ici.'],
          ['say', 'yunus_n', 'Une notification. Une petite chimère, mais elle a faim. Ne la frappe pas avec colère : cherche sa faille. Elle ne supporte pas qu’on lui résiste avec patience.'],
          ['battle', { group: ['notif'], bg: 'cite', intro: 'Frappe la faille pour retirer ses voiles ⛊. « Éclairer », dans les Vertus, porte la Patience d’Idris.' }],
          ['say', 'yunus_n', 'Tu as vu ? On ne détruit pas une idole en la haïssant. On la *dévoile* : on montre qu’elle est vide.'],
          ['ask', 'Que demander à Maître Yûnus ?', [
            { t: 'Pourquoi les idoles reviennent-elles toujours ?', r: [['say', 'yunus_n', 'Parce que le cœur ne reste jamais vide. Ôte-lui ce qui est plus grand que lui, il se prosternera devant ce qui est plus petit : un clan, un chef, un chiffre.']] },
            { t: 'Qu’est-ce que l’isnâd ?', r: [['say', 'yunus_n', 'La chaîne. « Untel m’a rapporté, d’après untel, qui l’a vu. » Des hommes ont passé leur vie à vérifier chaque maillon. C’est ainsi qu’une parole traverse quatorze siècles sans se dissoudre.']] },
            { t: 'D’où viennent les idées noires ?', r: [
              ['say', 'yunus_n', 'On nous a enseigné qu’il en est qui soufflent, parmi les djinns et parmi les hommes, et qu’ils n’ont d’autre pouvoir que celui-là. Je ne te les montrerai pas : nul ne les voit, et ce n’est pas eux que tu rencontreras.'],
              ['say', 'yunus_n', 'Tu rencontreras ce qu’un cœur fait de ce qu’il a entendu. Retiens ceci : le souffle appelle, le cœur répond. C’est au cœur qu’on demande des comptes.']] },
            { t: 'Je suis prêt.', r: [['say', 'yunus_n', 'Personne ne l’est. C’est pour cela qu’on ne marche pas seul.']] }
          ]],
          ['codex', 'isnad'],
          ['say', 'yunus_n', 'Il existe une chaîne que rien, là-haut, n’a jamais pu additionner. Elle remonte, de témoin en témoin, jusqu’à ceux qui ont vu. Elle est au fond de la salle. Va.']
        ] },
        { text: 'Approcher la Chaîne, au fond des Archives', goto: 'chaine', then: [
          ['sfx', 'light'],
          ['nar', 'Cinq anneaux d’or tournent lentement dans la pénombre. Aucun écran. Seulement des noms, et après chaque nom : « d’après ».'],
          ['say', 'Maître Yûnus', 'Tu ne seras pas eux, Idris. Nul ne le peut. Tu marcheras dans la trace de leurs actes, tels que les transmetteurs les ont rapportés. Si tu t’en écartes, la chaîne vacillera et te ramènera.'],
          ['say', 'Maître Yûnus', 'Entre eux et toi, d’autres maillons. L’un d’eux fut un seigneur berbère, au bord du désert : le Caïd. Il lisait ces vies pour apprendre à tenir sa citadelle. Tu l’entendras, toi aussi.'],
          ['say', 'Maître Yûnus', 'Deux choses reviennent dans toutes ces vies, et tu les retrouveras partout : la prière, qui repose et rassemble, et le savoir, qui ouvre ce que la force ne peut ouvrir. Le sabre ne vient qu’après, quand la parole a tout essayé.'],
          ['say', 'Maître Yûnus', 'Elle commence au jour le plus sombre. Le jour où tout aurait pu se défaire.'],
          ['codex', 'lumieres'], ['codex', 'piliers'], ['codex', 'parole'],
          ['fade', 'out', 900], ['flash', '#fff3d0'],
          ['title', 'Médine', "12 Rabî' al-Awwal, an 11 de l’Hégire · juin 632"],
          ['nar', 'Ce lundi-là, la plus grande lumière que la terre ait portée quitta ce monde. Le Messager d’Allah ﷺ venait de rejoindre son Seigneur.'],
          ['nar', 'Médine vacilla. Des hommes qui avaient affronté des armées restèrent sans voix. D’autres refusèrent d’y croire. Dans le désert, les vieilles idoles relevèrent la tête.'],
          ['nar', 'Ceux qui restaient n’étaient pas des prophètes. C’étaient des hommes. Tout ce qu’ils avaient reçu, il leur fallait maintenant le porter, et le transmettre.'],
          ['codex', 'jour'], ['codex', 'avertissement'],
          ['nar', 'Voici leur chaîne.']
        ] }
      ]
    },
    {
      id: 'e1', title: 'Le Cœur de l’Agrégor', sub: 'An 1507 de l’Hégire · Cité-Miroir', minLvl: 9, last: true, fin: true,
      map: 'cite', start: 'parvis', party: ['idris', 'yunus'],
      npcs: [
        { id: 'salim_n', name: 'Sâlim', hero: 'salim', at: 'rue', talk: [['say', 'salim_n', 'Je sais où est son cœur.']] },
        { id: 'fige1', name: 'Passant', at: ['ecran', -3, 2], look: { kind: 'citadin', robe: '#a0523c', head: '#7a3a2a', cloak: '#b8664a' }, talk: [['say', 'fige1', '… encore un… encore un…']] },
        { id: 'fige2', name: 'Passant', at: ['ecran', 2, 3], look: { kind: 'citadin', robe: '#808a4a', head: '#5a6232', cloak: '#9aa45c' }, talk: [['nar', 'Il ne t’entend pas. Ses yeux suivent quelque chose qui défile.']] },
        { id: 'gamin2', name: 'Enfant', at: ['ecran', 4, 1], hidden: true, look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' } }
      ],
      foes: [
        { id: 'f1', map: 'noos', at: 'noeud1', group: ['tendance', 'marque', 'plus_tard'], bg: 'cite' },
        { id: 'f2', map: 'noos', at: 'noeud2', group: ['score', 'bruit_fond'], bg: 'cite' },
        { id: 'f3', map: 'noos', at: 'noeud3', group: ['flux'], bg: 'cite', boss: true }
      ],
      chests: [{ map: 'noos', at: ['noeud1', 1, 1], gear: 'epee_maitre' }, { map: 'noos', at: 'faille', item: 'musc', n: 2 }, { map: 'noos', at: 'miroir', item: 'lait', n: 2 }, { map: 'noos', at: ['noeud3', 2, 0], item: 'eau', n: 2 }],
      intro: [
        ['title', 'Le Cœur de l’Agrégor', 'An 1507 de l’Hégire · Cité-Miroir'],
        ['nar', 'Idris rouvre les yeux. Cinq Lumières brûlent en lui, et aucune n’est la sienne : on les lui a confiées.'],
        ['nar', 'Là-haut, la ville n’a pas changé. Mais sous chaque écran, il distingue maintenant la forme de ce qu’on y adore.'],
        ['give', 'eau', 2], ['give', 'pain', 2]
      ],
      objectives: [
        { text: 'Un homme attend dans la rue : lui parler', talk: 'salim_n', then: [
          // 2.27 (D216) : si Idris a couru avec Sâlim (le moteur pose _2084_salim), des retrouvailles ; sinon, la rencontre de toujours
          ['if', '_2084_salim', [
            ['say', 'salim_n', 'Idris ! Mon passager des virages. Alors l’archiviste, c’était toi.'],
            ['say', 'idris', 'Sâlim. Tu disais fabriquer ce qu’on regarde sur les écrans.'],
            ['say', 'salim_n', 'Je ne disais pas tout. J’ai passé dix ans à nourrir l’Agrégor. Je sais où est son cœur, et je ne veux plus le servir.']
          ], [
            ['say', 'salim_n', 'Tu es l’archiviste ? Je m’appelle Sâlim. J’ai passé dix ans à nourrir l’Agrégor. Je sais où est son cœur, et je ne veux plus le servir.']
          ]],
          ['say', 'idris', 'Pourquoi maintenant ?'],
          ['say', 'salim_n', 'Mon fils m’a demandé ce que je fabriquais. Je n’ai pas su répondre sans mentir.'],
          ['hide', 'salim_n'], ['join', 'salim'],
          ['say', 'salim', 'Il y a un opérateur de garde au pied du grand écran. Un ancien collègue. S’il nous ouvre la trappe de service, nous entrons sans que le Flux nous voie. Sinon, il faudra le traverser.'],
          ['say', 'salim', 'Il relance une alerte par heure, depuis des années. On lui a dit de le faire. Personne ne lui a dit pourquoi, et il n’a jamais manqué une heure.'],
          ['parley', {
            with: 'L’opérateur de garde', title: 'L’opérateur de garde',
            intro: 'Il a peur de perdre son score, et il n’a jamais vu personne dire non à l’Agrégor.',
            goal: 5,
            rounds: [
              { say: 'Sâlim ? Tu n’as rien à faire ici. Si je vous laisse passer, mon score tombe à zéro avant l’aube.', opts: [
                { t: 'Ton score est un chiffre que d’autres t’attribuent. Qu’étais-tu avant qu’on te note ?', el: 'sidq', v: 2, r: 'Avant… J’étais quelqu’un que ses voisins connaissaient par son nom.' },
                { t: 'Ouvre, ou nous passerons quand même.', el: 'shajaa', v: -1, r: 'Alors passez. Mais ne me demandez pas d’en répondre.' },
                { t: 'Nous te paierons le double de ce que tu perds.', el: 'adl', v: 0, r: 'Avec quoi ? Tout ce qui s’achète ici, c’est lui qui le note.' }
              ] },
              { say: 'Vous allez faire quoi, là-dedans ? L’éteindre ? D’autres l’ont juré. Il est toujours là.', opts: [
                { t: 'Nous n’allons pas l’éteindre. Nous allons rendre aux gens ce qu’il agrège : de qui ils tiennent ce qu’ils savent.', el: 'ilm', v: 3, need: 'isnad', r: 'Une chaîne… avec des noms. Mon grand-père parlait comme ça.' },
                { t: 'Nous allons le briser une fois pour toutes.', el: 'shajaa', v: 0, r: 'Vous mentez, ou vous vous trompez. On ne brise pas ce que tout le monde regarde.' },
                { t: 'Nous allons essayer. Je ne te promets rien de plus.', el: 'sidq', v: 2, r: 'Au moins vous ne me vendez rien.' }
              ] },
              { say: 'Et si je vous ouvre, et que tout recommence demain sous un autre nom ?', opts: [
                { t: 'Alors tu auras tenu ton heure, comme ceux d’avant, et tu passeras le dépôt.', el: 'sabr', v: 2, r: 'Tenir son heure. C’est peu. C’est peut-être assez.' },
                { t: 'Cela ne recommencera pas.', el: 'sidq', v: -1, r: 'Vous voyez. Vous promettez comme lui.' },
                { t: 'Viens avec nous. Tu verras par toi-même.', el: 'rahma', v: 1, r: 'Je ne suis pas courageux. Mais je peux tourner une clé.' }
              ] }
            ],
            win: [['flag', 'operateur'], ['pillar', 'lien', 1], ['nar', 'La trappe de service s’ouvre sans un bruit. Quelque part dans la machine, un homme a cessé d’avoir peur.']],
            lose: [['pillar', 'lien', -1], ['nar', 'La trappe reste fermée. Il faudra passer par le Flux, à découvert.'], ['battle', { group: ['tendance', 'tendance'], bg: 'cite', intro: 'Le Flux vous a vus.' }]]
          }]
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
          ['say', 'yunus', "Une balance qui pèse les hommes au regard des autres. 'Umar pesait autrement : le fort était faible devant lui jusqu’à ce qu’il ait rendu le droit."],
          ['heal']
        ] },
        { text: 'Atteindre le cœur de l’Agrégor (à l’est)', goto: 'coeur', then: [
          ['say', "L'AGRÉGOR", 'Je ne suis pas un dieu, Idris. Je n’ai jamais prétendu l’être. Je suis seulement ce que vous regardez tous en même temps.'],
          ['say', "L'AGRÉGOR", 'J’ai été le Clan. J’ai été l’Aigle d’Airain et le Trône. J’ai été le Héros, l’Or, la Rumeur, le Juge. On m’a brisé chaque fois. On m’a refait chaque fois.'],
          ['say', 'idris', 'Je sais. Je les ai vus te briser. Aucun d’eux n’a cru en avoir fini avec toi. Ils ont tenu, chacun son heure, et passé le dépôt au suivant.'],
          ['say', "L'AGRÉGOR", 'Et sous chacun de ces noms, il y avait toujours les mêmes. Tu les connais. Ils ne sont pas à moi : ils sont à vous.'],
          ['vices', { bg: 'cite',
            avant: [['nar', 'Autour du cœur, ce qui n’a pas été tranché se redresse.']],
            aucun: [['nar', 'Autour du cœur, rien ne se dresse. Les sept ont été tranchés en chemin, un à un, par ce que des mains ont fait.']],
            tous: [['say', 'yunus', 'Sept lames, et aucune n’est de fer. Garde-les en t’en servant : elles ne tiennent leur fil que de l’œuvre.']],
            reste: [['say', 'yunus', 'Ceux que tu n’as fait que repousser reviendront. Ce n’est pas une défaite : c’est le travail de demain.']] }],
          ['heal'],
          ['battle', { group: ['agregor'], bg: 'cite', boss: true, intro: 'Les cinq Lumières, et la Patience de qui transmet, sont ses failles. Dévoile-le, encore et encore.', allies: [{ flag: 'operateur', name: 'L’opérateur coupe une à une les alimentations' },
            { flag: 'ami_defile', name: 'Celui qui défilait éteint son écran', hp: 0.03, veil: 0 }, { flag: 'ami_regent', name: 'Le Régent a laissé son siège : il veille dans la rue', hp: 0.03, veil: 0 },
            { flag: 'ami_admire', name: 'L’Admiré est descendu, sans public', hp: 0.03, veil: 0 }, { flag: 'ami_compteur', name: 'Le Compteur donne ses regards à ceux qu’on ne voit pas', hp: 0.03, veil: 0 },
            { flag: 'ami_carto', name: 'Le Cartographe écrit des noms en marge de sa carte', hp: 0.03, veil: 0 }] }],
          ['nar', 'L’Agrégor ne s’effondre pas. Il se tait. Pour la première fois depuis des années, les écrans de la Cité-Miroir n’ont rien à montrer.'],
          ['map', 'cite', 'ecran'], ['show', 'gamin2'],
          ['nar', 'Dans la rue, des milliers de têtes se relèvent. Derrière le verre éteint, le ciel est noir, semé d’astres brillants.'],
          ['say', 'gamin2', 'Monsieur… c’est quoi, ces lumières, là-haut ?'],
          ['say', 'idris', 'Assieds-toi. Je vais te raconter. Mais d’abord, retiens de qui je le tiens.'],
          ['nar', 'Idris n’a pas détruit l’Agrégor. Demain, d’autres le rallumeront sous un autre nom. Il a fait ce qu’on lui avait appris : il a transmis.'],
          ['quote', '« Et c’est Lui qui vous a assigné les étoiles, pour que, par elles, vous vous guidiez dans les ténèbres de la terre et de la mer. Certes, Nous avons exposé les preuves pour des gens qui savent. »', 'Coran 6:97 — traduction du sens']
        ] }
      ]
    },
    {
      id: 'r_abubakr', after: 'abubakr', vice: 'avidite', title: 'Celui qui défile', sub: 'Cité-Miroir · le soir du maillon d’Abû Bakr', minLvl: 8, last: true,
      map: 'cite', start: 'parvis', party: ['idris'],
      npcs: [
        { id: 'gamin', name: 'L’enfant du parvis', at: ['ecran', 3, 2], look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }, talk: [['say', 'gamin', 'Je suis là tous les soirs.']] },
        { id: 'defileur', name: 'Celui qui défile', at: ['ruelle', 0, -1], look: { kind: 'citadin', robe: '#6a7ad0', head: '#4a58a8', cloak: '#8494e4' }, talk: [['say', 'defileur', '… encore un…']] },
        // 2.25 (D214) : Maître Yûnus, monté des Archives à la fin de la rencontre (« show » l'écarte du joueur s'il paraît sur lui)
        { id: 'yunus_r', name: 'Maître Yûnus', hero: 'yunus', at: ['ecran', -2, 3], hidden: true }
      ],
      intro: [
        ['title', 'Celui qui défile', 'Cité-Miroir · le soir du maillon d’Abû Bakr'],
        ['mus', 'rencontre'],
        ['nar', 'Idris remonte des Archives avec une Lumière qui n’est pas la sienne : la Véracité d’Abû Bakr. Là-haut, la rue n’a pas changé.'],
        ['nar', 'L’enfant est là, sous le grand écran, comme hier.']
      ],
      objectives: [
        { text: 'Rejoindre l’enfant, sous le grand écran', talk: 'gamin', then: [
          ['say', 'gamin', 'Monsieur, il y a un homme dans la ruelle. Il regarde défiler depuis ce matin. Je lui ai demandé pourquoi. Il a dit : « Pour oublier. »'],
          ['say', 'idris', 'Oublier quoi ?'],
          ['say', 'gamin', 'Je le lui ai demandé aussi. Il a regardé ailleurs. Toi, d’habitude, tu réponds.']
        ] },
        { text: 'Trouver l’homme de la ruelle', talk: 'defileur', then: [
          ['say', 'defileur', '… encore un… Ne reste pas là, tu me fais de l’ombre.'],
          ['say', 'idris', 'Qu’est-ce que tu regardes ?'],
          ['say', 'defileur', 'Je ne sais plus. C’est le principe.'],
          ['parley', {
            with: 'defileur', title: 'Ce qu’on oublie en défilant',
            intro: 'Il a honte du temps qu’il y passe, et il y retourne pour ne plus y penser. Le mépris l’y renfoncerait. Il faut lui dire ce qui est.',
            goal: 5,
            rounds: [
              { say: 'Je défile pour oublier. Voilà. Tu es content ?', opts: [
                { t: 'Oublier quoi ?', el: 'sidq', v: 1, r: 'Que j’y ai passé la journée. Et celle d’hier.' },
                { t: 'Tu perds ta vie. Lève-toi.', el: 'shajaa', v: -1, r: 'Tu crois que je ne le sais pas ? C’est justement ce que je viens oublier ici.' },
                { t: 'Chez Abû Bakr, j’ai vu ce que devient un chagrin qu’on refuse de nommer : il prend un corps, et il commande.', el: 'sidq', v: 2, need: 'abubakr/deni', r: 'Un chagrin… Oui. Ça a commencé comme ça. Je ne voulais pas que ce soit vrai.' }
              ] },
              { say: 'Si j’arrête, il faudra que je regarde ce que j’ai laissé pendant ce temps-là.',
                noir: { name: 'Le Défilement', group: ['defilement'], bg: 'cite', intro: 'Il a dit « si j’arrête », et il s’est cramponné à son écran. Tant que cela parlera plus fort que toi, il n’entendra rien.', say: 'On ne le frappe pas avec colère : on cesse de le suivre.', after: 'C’est… plus calme, d’un coup. Répète ce que tu disais.' },
                opts: [
                { t: 'Oui. Et ce sera moins lourd que de continuer à ne pas le regarder.', el: 'sidq', v: 2, r: 'Tu ne me promets pas que ce sera léger. C’est déjà ça.' },
                { t: 'Ce n’est rien. Tout le monde fait comme toi.', el: 'rahma', v: 0, r: 'C’est ce que dit le Flux. Mot pour mot.' },
                { t: 'Un seigneur du désert a annoncé lui-même, à l’aube, la nouvelle qu’il aurait pu taire sept jours. Il y a perdu de l’avance, et gagné d’être cru.', el: 'sidq', v: 2, need: 'caid/aube_vraie', r: 'Dire la chose avant qu’on la devine… À qui la dirais-je, moi ?' }
              ] },
              { say: 'Et si je la dis, cette chose, qu’est-ce que j’y gagne ?', opts: [
                { t: 'De ne plus avoir à l’oublier chaque matin.', el: 'sabr', v: 2, r: 'Chaque matin… Oui. C’est bien ce que ça coûte.' },
                { t: 'Rien. Mais tu vaudras mieux.', el: 'adl', v: 0, r: 'Tu parles comme un tableau des scores.' },
                { t: 'Le jour où on lui remit la charge, Abû Bakr a commencé par dire qu’il n’était pas le meilleur, et il a demandé qu’on le redresse s’il se trompait. Dis-le à quelqu’un, et demande-lui de te redresser.', el: 'sidq', v: 3, need: 'abubakr/investiture', r: 'Demander à être redressé… Il y a quelqu’un, au troisième, qui frappait à ma porte, avant.' }
              ] }
            ],
            win: [['flag', 'ami_defile'], ['pillar', 'lien', 1], ['emote', 'defileur', 'salut'], ['nar', 'Il éteint. Sa main tremble un peu. Puis il se lève, et regarde la ruelle comme on regarde une pièce où l’on rentre.']],
            lose: [['pillar', 'lien', -1], ['nar', 'Il a déjà repris. Tu n’as pas trouvé les mots, ce soir. Il a pourtant levé la tête, une fois.']]
          }],
          ['nar', 'Derrière lui, quelque chose ne s’est pas tu. Sous chaque « encore un », il y a une faim plus vieille que les écrans.'],
          ['battle', { group: ['avidite'], bg: 'cite', boss: true, intro: 'L’Avidité : vouloir encore, alors qu’on a.' }],
          ['if', 'tranche_avidite', [['nar', 'La lame du Contentement n’a rien frappé : elle a montré ce qui suffisait. L’Avidité ne reviendra pas dans cette ruelle.']], [['nar', 'L’Avidité recule, sans se défaire. Elle reviendra. Le jeûne, trois fois tenu, forge la lame qui la tranche.']]]
        ] },
        { text: 'Retourner auprès de l’enfant', talk: 'gamin', then: [
          ['say', 'gamin', 'Alors ? Il oubliait quoi ?'],
          ['say', 'idris', 'Qu’il oubliait. C’est une chose qu’on ne peut dire à quelqu’un qu’en restant à côté de lui.'],
          ['say', 'gamin', 'Moi, quand j’ai honte, je voudrais qu’on me le dise doucement.'],
          ['say', 'idris', 'C’est ce que j’ai appris aujourd’hui d’un homme qui s’appelait Abû Bakr. Retiens son nom : c’est de lui que je le tiens.'],
          ['codex', 'r_defile'], ['codex', 'enfant'],
          ['say', 'gamin', 'Je serai là demain.'],
          ['show', 'yunus_r'],
          ['nar', 'Maître Yûnus est monté des Archives basses. Il attend Idris un peu à l’écart.']
        ] },
        // 2.25 (D214) — la découverte de l'Agrégor, étape I : quelque chose rassemble les regards. Textes de l'agent, à valider.
        { text: 'Rejoindre Maître Yûnus, un peu à l’écart', talk: 'yunus_r', then: [
          ['say', 'yunus_r', 'Tu as tiré un homme de son écran, ce soir. Qu’as-tu vu, autour de lui ?'],
          ['say', 'idris', 'Il n’était pas seul à regarder. Toute la rue regardait la même chose, au même instant.'],
          ['say', 'yunus_r', 'C’est un commencement. Quelque chose rassemble les regards. Ce n’est pas encore un nom : c’est une trace.'],
          ['say', 'idris', 'Et ce qui les rassemble, qu’est-ce que c’est ?'],
          ['say', 'yunus_r', 'Garde ce que tu as vu. Le reste viendra, maillon après maillon.']
        ] }
      ]
    },
    {
      id: 'r_umar', after: 'umar', vice: 'orgueil', title: 'Le Régent', sub: "Cité-Miroir · le soir du maillon de 'Umar", minLvl: 8, last: true,
      map: 'cite', start: 'parvis', party: ['idris'],
      npcs: [
        { id: 'gamin', name: 'L’enfant du parvis', at: ['ecran', 3, 2], look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }, talk: [['say', 'gamin', 'Je suis là tous les soirs.']] },
        { id: 'regent', name: 'Le Régent', at: ['ascenseur', -2, 0], look: { kind: 'citadin', coiffe: 'tiare', robe: '#4a3a52', head: '#5a4a2a', cloak: '#2f2638', trim: '#d9b45a' }, talk: [['say', 'regent', 'Accordé.']] },
        // 2.25 (D214) : Maître Yûnus, monté des Archives à la fin de la rencontre
        { id: 'yunus_r', name: 'Maître Yûnus', hero: 'yunus', at: ['ecran', -2, 3], hidden: true }
      ],
      intro: [
        ['title', 'Le Régent', "Cité-Miroir · le soir du maillon de 'Umar"],
        ['mus', 'rencontre'],
        ['nar', "La Justice de 'Umar pèse dans la main d’Idris comme une balance vide : elle attend qu’on y pose quelque chose."],
        ['nar', 'Sous le grand écran, l’enfant a déjà une question.']
      ],
      objectives: [
        { text: 'Rejoindre l’enfant, sous le grand écran', talk: 'gamin', then: [
          ['say', 'gamin', 'Monsieur, au bout de la rue il y a un homme avec un tampon. Chaque fois que l’écran change, il tamponne et il dit : « Accordé. »'],
          ['say', 'idris', 'Il accorde quoi ?'],
          ['say', 'gamin', 'Ce que l’écran a déjà fait. Si personne ne lui demande rien, à qui est-ce qu’il accorde ?']
        ] },
        { text: 'Aller voir l’homme au tampon, au bout de la rue', talk: 'regent', then: [
          ['say', 'regent', 'Halte. Tu entres dans le Neuvième. Rien ne s’y fait sans mon accord. Je t’accorde d’y entrer.'],
          ['say', 'idris', 'Qui habite le Neuvième ?'],
          ['say', 'regent', 'Personne, pour le moment. Mais tout y est en règle.'],
          ['parley', {
            with: 'regent', title: 'Régner sur personne',
            intro: 'Il confond le siège et la charge. Il ne fait de mal à personne : il n’a personne. Il lui manque quelqu’un dont répondre.',
            goal: 5,
            rounds: [
              { say: 'Sois mon ministre. Tu parles bien. Je te nomme sur-le-champ : accordé.', opts: [
                { t: 'Ministre de quoi ? Il n’y a personne à servir, ici.', el: 'sidq', v: 1, r: 'Il y a l’ordre. L’ordre, c’est quelqu’un.' },
                { t: 'J’accepte, si tu me donnes un bureau.', el: 'adl', v: -1, r: 'Accordé. Tu vois ? Tout le monde finit par vouloir un siège.' },
                { t: 'J’ai vu un siège qui survit à tous ceux qui s’y asseyent. Il ne donne rien : il prend la place de celui qui croit le tenir.', el: 'adl', v: 2, need: 'umar/ego_trone', r: 'Qui t’a parlé de mon fauteuil ? … Il est froid, c’est vrai. Même l’été.' }
              ] },
              { say: 'Sans moi, ce serait le désordre. C’est moi qui valide ce que l’écran décide.',
                noir: { name: 'Le Petit Trône', group: ['petit_trone'], bg: 'cite', intro: 'Il s’est redressé sur son siège, et le siège a grandi sous lui. Il ne parle plus pour lui : il parle pour sa place.', say: 'La place vide exige qu’on l’occupe. Ne t’y assieds pas.', after: 'Je… je me suis entendu parler. Continue.' },
                opts: [
                { t: 'Alors c’est l’écran qui commande, et toi qui signes.', el: 'sidq', v: 2, r: 'Je… je contresigne. Ce n’est pas rien, contresigner.' },
                { t: 'Tu fais un travail utile.', el: 'rahma', v: 0, r: 'N’est-ce pas ? Accordé.' },
                { t: "On a trouvé 'Umar endormi dans la mosquée, sans garde ni chambellan, lui sous qui deux empires étaient tombés. Il n’avait pas de siège. Il avait des gens dont il répondait.", el: 'adl', v: 2, need: 'umar/hurmuzan', r: 'Sans garde… et il dormait ? Moi, je ne dors pas. Je surveille mon tampon.' }
              ] },
              { say: 'Répondre de quelqu’un… De qui ? Il n’y a plus personne dans le Neuvième.', opts: [
                { t: 'Il y a un homme, dans la ruelle, à qui personne ne parle. Commence par lui.', el: 'rahma', v: 2, r: 'Un administré. Un vrai. Il faudrait que j’aille le voir… à pied ?' },
                { t: 'Alors ferme le Neuvième et rentre chez toi.', el: 'shajaa', v: 0, r: 'Et qui accordera la fermeture ?' },
                { t: 'À la Citadelle, on dit : celui qui veille porte le sommeil de tous. Veille sur quelqu’un, et tu auras une charge. Le siège, tu peux le laisser.', el: 'adl', v: 3, need: 'caid/sentinelle', r: 'Porter le sommeil de quelqu’un… C’est plus lourd qu’un tampon. Je crois que c’est ce que je cherchais.' }
              ] }
            ],
            win: [['flag', 'ami_regent'], ['pillar', 'justice', 1], ['nar', 'Il pose son tampon sur le rebord. Il ne sait pas encore où aller, mais il regarde la rue, et non plus l’écran.']],
            lose: [['pillar', 'lien', -1], ['nar', '« Refusé », dit-il, et il tamponne. Tu n’as pas trouvé les mots, ce soir. Il a pourtant regardé son siège, une fois, comme on regarde un inconnu.']]
          }],
          ['nar', 'Le siège est vide, et quelque chose s’y tient encore : ce qui veut être au-dessus, même de personne.'],
          ['battle', { group: ['orgueil'], bg: 'cite', boss: true, intro: 'L’Orgueil : se voir au-dessus.' }],
          ['if', 'tranche_orgueil', [['nar', 'La lame de l’Humilité est passée sans bruit, comme passe un homme parmi d’autres. L’Orgueil ne reviendra pas s’asseoir ici.']], [['nar', 'L’Orgueil recule d’un pas, la tête haute. Il reviendra. Le pèlerinage, où tous portent la même étoffe, forge la lame qui le tranche.']]]
        ] },
        { text: 'Retourner auprès de l’enfant', talk: 'gamin', then: [
          ['say', 'gamin', 'Il accordait à qui, alors ?'],
          ['say', 'idris', "À personne. Il avait un siège, et pas de charge. 'Umar avait une charge, et pas de siège : c’est de lui que je tiens la différence."],
          ['say', 'gamin', 'Et toi, tu as une charge ?'],
          ['say', 'idris', 'On m’a confié quelque chose. Je commence à croire que tu en fais partie.'],
          ['codex', 'r_regent'], ['codex', 'enfant'],
          ['show', 'yunus_r'],
          ['nar', 'Maître Yûnus est monté des Archives basses. Il attend Idris un peu à l’écart.']
        ] },
        // 2.25 (D214) — étape II : ça ne commande pas, ça additionne ; c'est Idris qui le dit. Textes de l'agent, à valider.
        { text: 'Rejoindre Maître Yûnus, un peu à l’écart', talk: 'yunus_r', then: [
          ['say', 'yunus_r', 'Cet homme validait ce que l’écran avait déjà décidé. Qui commande, alors ?'],
          ['say', 'idris', 'Personne. L’écran ne fait que compter ce que tous regardent. Ça ne commande pas, ça additionne.'],
          ['say', 'yunus_r', 'Tu l’as dit avant moi. C’est ainsi qu’il faut l’apprendre.'],
          ['say', 'yunus_r', 'Ce qu’on répète sans l’avoir vu reste une rumeur. Ce qu’on a vu soi-même, on peut le transmettre.']
        ] }
      ]
    },
    {
      id: 'r_khalid', after: 'khalid', vice: 'ostentation', title: 'L’Admiré', sub: 'Cité-Miroir · le soir du maillon de Khâlid', minLvl: 8, last: true,
      map: 'cite', start: 'parvis', party: ['idris'],
      npcs: [
        { id: 'gamin', name: 'L’enfant du parvis', at: ['ecran', 3, 2], look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }, talk: [['say', 'gamin', 'Je suis là tous les soirs.']] },
        { id: 'admire', name: 'L’Admiré', at: ['ecran', -3, 1], look: { kind: 'citadin', robe: '#b8449a', head: '#86306e', cloak: '#cc5aac', trim: '#f0e8f4' }, talk: [['say', 'admire', 'Tu m’as reconnu, bien sûr.']] },
        // 2.25 (D214) : Maître Yûnus, monté des Archives à la fin de la rencontre
        { id: 'yunus_r', name: 'Maître Yûnus', hero: 'yunus', at: ['ecran', -2, 3], hidden: true }
      ],
      intro: [
        ['title', 'L’Admiré', 'Cité-Miroir · le soir du maillon de Khâlid'],
        ['mus', 'rencontre'],
        ['nar', 'Le Courage de Khâlid n’est pas celui qu’Idris attendait. C’est le courage de descendre d’un socle.'],
        ['nar', 'Ce soir, il y a du bruit sous le grand écran. L’enfant regarde, la tête penchée.']
      ],
      objectives: [
        { text: 'Rejoindre l’enfant, sous le grand écran', talk: 'gamin', then: [
          ['say', 'gamin', 'Monsieur, tu vois l’homme, là ? Tout le monde l’applaudit. Mais j’ai regardé : ce sont des fenêtres qui applaudissent. Il n’y a personne derrière.'],
          ['say', 'idris', 'Il le sait ?'],
          ['say', 'gamin', 'Je crois qu’il préfère ne pas compter.']
        ] },
        { text: 'Parler à l’homme qu’on applaudit', talk: 'admire', then: [
          ['say', 'admire', 'Ah ! Un regard de plus. Approche. Tu m’as reconnu, bien sûr.'],
          ['say', 'idris', 'Non.'],
          ['say', 'admire', 'C’est impossible. Huit millions d’abonnés me suivent. Tu dois en être sans le savoir.'],
          ['parley', {
            with: 'admire', title: 'Descendre du socle',
            intro: 'Il n’entend que les applaudissements, et il ne sait plus qui il serait sans eux.',
            goal: 5,
            rounds: [
              { say: 'Dis-moi que je suis le plus regardé de la Cité. Dis-le. Ça ne coûte rien.', opts: [
                { t: 'Tu es le plus regardé. Est-ce que quelqu’un te connaît ?', el: 'sidq', v: 2, r: 'Me connaître… C’est une drôle de question à poser à quelqu’un de célèbre.' },
                { t: 'Tu es le plus regardé de la Cité.', el: 'rahma', v: -1, r: 'Encore ! Redis-le. … C’est étrange, ça ne dure jamais plus d’une seconde.' },
                { t: 'J’ai vu une idole d’or qui avait la silhouette d’un homme de bien. Chaque louange lui ajoutait une couche. Elle ne s’est brisée que le jour où l’homme lui-même a refusé le socle.', el: 'shajaa', v: 2, need: 'khalid/idole_heros', r: 'Refuser le socle… Mais c’est lui qui me tient debout.' }
              ] },
              { say: 'Si je descends, ils regarderont quelqu’un d’autre dans l’heure.',
                noir: { name: 'L’Applaudissement', group: ['applaudissement'], bg: 'cite', intro: 'Il a cherché des yeux un public, et le bruit des mains a couvert ta voix. Il faut d’abord faire le silence.', say: 'Il vit d’être regardé. Regarde ailleurs, et tiens bon.', after: 'Personne ne regarde. C’est étrange. Parle.' },
                opts: [
                { t: 'Oui. Et tu sauras enfin qui reste.', el: 'sidq', v: 2, r: 'Qui reste… Je n’ose pas faire le compte.' },
                { t: 'Non. Ils te resteront fidèles.', el: 'rahma', v: -1, r: 'Tu mens gentiment. Eux aussi.' },
                { t: 'Khâlid n’avait jamais perdu une bataille. On lui a retiré le commandement, non pour une faute, mais parce que les gens s’en remettaient à lui. Il a obéi.', el: 'shajaa', v: 3, need: 'khalid/parole_umar', r: 'Sans faute… et il n’a pas crié à l’injustice ? Il faut plus de courage pour cela que pour monter.' }
              ] },
              { say: 'Et que ferais-je, en bas ? Je ne sais rien faire d’autre qu’être regardé.', opts: [
                { t: 'Regarde quelqu’un, à ton tour. Il y a un enfant, là, qui pose des questions.', el: 'rahma', v: 2, r: 'Regarder quelqu’un… sans qu’il applaudisse ? Je peux essayer.' },
                { t: 'Tu trouveras bien.', el: 'sabr', v: 0, r: 'C’est ce qu’on dit à ceux qu’on n’aidera pas.' },
                { t: 'À la Citadelle, j’ai appris ce qu’est une foggara : une galerie sous la terre, que personne ne voit, et qui mène l’eau par son seul poids à tous les jardins.', el: 'ilm', v: 2, need: 'caid/foggara', r: 'Une chose que personne ne voit, et dont tout le monde boit. … Personne ne l’applaudit, celle-là ?' }
              ] }
            ],
            win: [['flag', 'ami_admire'], ['pillar', 'lien', 1], ['nar', 'Il fait un pas hors de la lumière de l’écran. Les fenêtres continuent d’applaudir la place vide. Il ne se retourne pas.']],
            lose: [['pillar', 'lien', -1], ['nar', 'Il s’est déjà retourné vers les fenêtres. Tu n’as pas trouvé les mots, ce soir. Il a pourtant porté la main à sa poitrine, comme on cherche s’il y a encore quelqu’un.']]
          }],
          ['nar', 'L’estrade est vide. Mais ce qui brillait pour être vu brille encore, seul, au milieu de la rue.'],
          ['battle', { group: ['ostentation'], bg: 'cite', boss: true, intro: 'L’Ostentation : faire le bien pour être vu le faisant.' }],
          ['if', 'tranche_ostentation', [['nar', 'La lame de la Sincérité n’a pas d’éclat : c’est pour cela qu’elle coupe. L’Ostentation s’est éteinte, faute de regards.']], [['nar', 'L’Ostentation se retire derrière un écran. Elle reviendra. La prière tenue quand nul ne regarde, trois fois, forge la lame qui la tranche.']]]
        ] },
        { text: 'Retourner auprès de l’enfant', talk: 'gamin', then: [
          ['say', 'gamin', 'Il a compté, finalement ?'],
          ['say', 'idris', 'Pas encore. Mais il est descendu d’une marche. Un homme nommé Khâlid en a descendu de plus hautes : c’est de lui que je le tiens.'],
          ['say', 'gamin', 'C’est dur, de descendre ?'],
          ['say', 'idris', 'Plus que de monter. Personne ne t’applaudit.'],
          ['codex', 'r_admire'], ['codex', 'enfant'],
          ['show', 'yunus_r'],
          ['nar', 'Maître Yûnus est monté des Archives basses. Il attend Idris un peu à l’écart.']
        ] },
        // 2.25 (D214) — étape III : son nom, que donnent ceux qui le servent ; la fiche « L'AGRÉGOR » entre au Recueil (la
        // Chaîne nomme alors le dernier maillon « Le Cœur de l'Agrégor », ui.js). Textes de l'agent, à valider.
        { text: 'Rejoindre Maître Yûnus, un peu à l’écart', talk: 'yunus_r', then: [
          ['say', 'idris', 'Des fenêtres qui applaudissent, et personne derrière. Ce qui les rassemble a-t-il un nom ?'],
          ['say', 'yunus_r', 'Tu l’as vu rassembler, puis additionner. Maintenant, tu peux entendre son nom.'],
          ['say', 'yunus_r', 'Ceux qui le servent l’appellent l’Agrégor.'],
          ['codex', 'agregor'],
          ['say', 'idris', 'L’Agrégor… Je l’ai vu avant de savoir son nom.'],
          ['say', 'yunus_r', 'C’est le bon ordre : d’abord voir, ensuite nommer. Un nom reçu ainsi n’est plus une rumeur.']
        ] }
      ]
    },
    {
      id: 'r_uthman', after: 'uthman', vice: 'avarice', title: 'Le Compteur', sub: "Cité-Miroir · le soir du maillon de 'Uthmân", minLvl: 8, last: true,
      map: 'cite', start: 'parvis', party: ['idris'],
      npcs: [
        { id: 'gamin', name: 'L’enfant du parvis', at: ['ecran', 3, 2], look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }, talk: [['say', 'gamin', 'Je suis là tous les soirs.']] },
        { id: 'compteur', name: 'Le Compteur', at: ['rue', 2, -1], look: { kind: 'citadin', robe: '#9a7838', head: '#6a5024', cloak: '#b28c46', trim: '#d9b45a', item: 'bourse' }, talk: [['say', 'compteur', 'Ne me dérange pas. Je compte.']] },
        // 2.25 (D214) : Maître Yûnus, monté des Archives à la fin de la rencontre
        { id: 'yunus_r', name: 'Maître Yûnus', hero: 'yunus', at: ['ecran', -2, 3], hidden: true }
      ],
      intro: [
        ['title', 'Le Compteur', "Cité-Miroir · le soir du maillon de 'Uthmân"],
        ['mus', 'rencontre'],
        ['nar', "La Miséricorde de 'Uthmân a la forme d’un puits : on n’y garde rien pour soi, et il ne tarit pas."],
        ['nar', 'L’enfant attend sous le grand écran. Il a l’air de quelqu’un qui a fait un calcul et n’y croit pas.']
      ],
      objectives: [
        { text: 'Rejoindre l’enfant, sous le grand écran', talk: 'gamin', then: [
          ['say', 'gamin', 'Monsieur, il y a un homme qui compte, dans la rue. Il a mis de côté plus de regards que toute la ville. Je lui ai demandé à quoi ils servaient.'],
          ['say', 'idris', 'Et il a dit ?'],
          ['say', 'gamin', 'Il a dit : « À en avoir. »']
        ] },
        { text: 'Trouver l’homme qui compte, dans la rue', talk: 'compteur', then: [
          ['say', 'compteur', 'Ne me dérange pas. J’en suis à… Voilà. Tu m’as fait perdre le fil.'],
          ['say', 'idris', 'Qu’est-ce que tu comptes ?'],
          ['say', 'compteur', 'Des regards. Je les achète quand personne n’en veut, et je les garde. Un regard qu’on garde ne se pose sur rien : il reste neuf.'],
          ['parley', {
            with: 'compteur', title: 'Ce qu’on garde et ce qu’on donne',
            intro: 'Il amasse des regards comme d’autres de l’or. Il n’en a jamais posé un seul sur quelqu’un.',
            goal: 5,
            rounds: [
              { say: 'Ils sont à moi. Je les ai payés. Qu’y a-t-il à redire ?', opts: [
                { t: 'Rien. Ils sont à toi. À qui servent-ils ?', el: 'adl', v: 1, r: 'Servir… Ils n’ont pas à servir. Ils ont à être là.' },
                { t: 'C’est du vol. Rends-les.', el: 'shajaa', v: -1, r: 'J’ai les reçus. Tu veux les voir ? Je les ai comptés aussi.' },
                { t: "À Médine, l’eau douce d’un puits se vendait. 'Uthmân l’a acheté de son bien, comme toi, puis il l’a donné à tous : son seau n’y avait pas plus de droit qu’un autre.", el: 'rahma', v: 2, need: 'uthman/ruma', r: 'Payé, puis donné ? Alors il ne lui restait rien… si ce n’est tous ceux qui venaient y boire.' }
              ] },
              { say: 'Si je les donne, je n’en aurai plus. C’est mathématique.',
                noir: { name: 'Le Compte', group: ['compte'], bg: 'cite', intro: 'Il a recompté, et le chiffre a pris toute la place. Tant qu’il comptera, il n’y aura personne en face de lui.', say: 'Il pèse et ne nourrit personne. La largesse le renverse.', after: 'J’ai perdu le fil. Tant mieux, peut-être. Tu disais ?' },
                opts: [
                { t: 'Un regard que tu donnes à quelqu’un, tu ne le perds pas : tu sais où il est.', el: 'rahma', v: 2, r: 'Savoir où il est… Je ne sais où est aucun des miens. Ils sont dans le coffre.' },
                { t: 'Tu en rachèteras.', el: 'adl', v: 0, r: 'C’est ce que je fais. C’est ce que je fais depuis vingt ans.' },
                { t: 'Là où chacun compte ce que l’autre a reçu, l’Or dresse sa tour. Je l’ai vue. Elle pèse, et elle ne nourrit personne.', el: 'ilm', v: 2, need: 'uthman/or_n', r: 'Une tour… Mon coffre a la forme d’une tour, maintenant que tu le dis.' }
              ] },
              { say: 'Admettons. À qui donnerais-je le premier ?', opts: [
                { t: 'Au premier qui passe et que personne ne regarde.', el: 'rahma', v: 2, r: 'Il y en a beaucoup. Ceux-là, je ne les avais jamais comptés.' },
                { t: 'À moi.', el: 'sidq', v: -1, r: 'Ha. Tu vois bien : tout le monde amasse.' },
                { t: 'Le Caïd disait de sa citadelle qu’elle ne tenait pas par ses pierres, mais par ce que les hommes s’y devaient les uns aux autres. Ôte cela, disait-il, il reste un enclos.', el: 'ilm', v: 3, need: 'caid/citadelle_lieu', r: 'Un enclos… J’ai bâti un enclos, et je me suis mis dedans.' }
              ] }
            ],
            win: [['flag', 'ami_compteur'], ['pillar', 'lien', 1], ['nar', 'Il ouvre le coffre. Il en sort un regard, un seul, et le pose sur le premier passant. Le passant relève la tête, étonné qu’on le voie.']],
            lose: [['pillar', 'lien', -1], ['nar', 'Il a repris son compte. Tu n’as pas trouvé les mots, ce soir. Il a pourtant regardé ses mains, comme s’il se demandait à quoi elles avaient servi.']]
          }],
          ['nar', 'Les colonnes de chiffres s’effacent. Dessous, il reste une main fermée.'],
          ['battle', { group: ['avarice'], bg: 'cite', boss: true, intro: 'L’Avarice : retenir ce qui devait circuler.' }],
          ['if', 'tranche_avarice', [['nar', 'La lame de la Largesse a ouvert la main fermée, et il n’y avait rien dedans qui valût d’être gardé. L’Avarice ne comptera plus ici.']], [['nar', 'L’Avarice referme les doigts et recule. Elle reviendra. L’aumône, trois fois donnée sans témoin, forge la lame qui la tranche.']]]
        ] },
        { text: 'Retourner auprès de l’enfant', talk: 'gamin', then: [
          ['say', 'gamin', 'Il en a donné un ?'],
          ['say', 'idris', "Un seul. C’est le plus difficile. Un homme nommé 'Uthmân a donné un puits entier : c’est de lui que je le tiens."],
          ['say', 'gamin', 'Toi, tu me regardes, quand je parle.'],
          ['say', 'idris', 'C’est toi qui me l’as appris, à force de revenir.'],
          ['codex', 'r_compteur'], ['codex', 'enfant'],
          ['show', 'yunus_r'],
          ['nar', 'Maître Yûnus est monté des Archives basses. Il attend Idris un peu à l’écart.']
        ] },
        // 2.25 (D214) — étape IV : il ne craint que ce qui passe de main en main sans passer par lui, la Chaîne. Textes de
        // l'agent, à valider.
        { text: 'Rejoindre Maître Yûnus, un peu à l’écart', talk: 'yunus_r', then: [
          ['say', 'yunus_r', 'Le Compteur a posé un regard sur un passant. Un seul. L’Agrégor ne l’a pas compté.'],
          ['say', 'idris', 'Il compte tout ce qu’on regarde. Que craint-il, alors ?'],
          ['say', 'yunus_r', 'Une seule chose : ce qui passe de main en main sans passer par lui.'],
          ['say', 'idris', 'La Chaîne. D’un homme à un autre, avec le nom de celui qui l’a porté.'],
          ['say', 'yunus_r', 'Oui. Il additionne tout ce qu’on lui montre. Ce qu’on se transmet de main en main, il ne le voit pas passer.']
        ] }
      ]
    },
    {
      id: 'r_ali', after: 'ali', vice: 'insouciance', title: 'Le Cartographe', sub: "Cité-Miroir · le soir du maillon de 'Alî", minLvl: 8, last: true,
      map: 'cite', start: 'parvis', party: ['idris'],
      npcs: [
        { id: 'gamin', name: 'L’enfant du parvis', at: ['ecran', 3, 2], look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }, talk: [['say', 'gamin', 'Je suis là tous les soirs.']] },
        { id: 'carto', name: 'Le Cartographe', at: ['ascenseur', -2, 0], look: { kind: 'citadin', robe: '#3a9a8a', head: '#267264', cloak: '#52b2a0', trim: '#34507a', item: 'feuillets' }, talk: [['say', 'carto', 'Combien l’ont vu ?']] },
        // 2.25 (D214) : Maître Yûnus, monté des Archives à la fin de la rencontre
        { id: 'yunus_r', name: 'Maître Yûnus', hero: 'yunus', at: ['ecran', -2, 3], hidden: true }
      ],
      intro: [
        ['title', 'Le Cartographe', "Cité-Miroir · le soir du maillon de 'Alî"],
        ['mus', 'rencontre'],
        ['nar', "Le Savoir de 'Alî ne ressemble pas à une réponse. Il ressemble à une question bien posée : de qui le tiens-tu ?"],
        ['nar', 'L’enfant tient un bout de papier, sous le grand écran. Il le retourne dans tous les sens.']
      ],
      objectives: [
        { text: 'Rejoindre l’enfant, sous le grand écran', talk: 'gamin', then: [
          ['say', 'gamin', 'Monsieur, il y a un homme qui dessine la carte de la Cité. Je lui ai demandé s’il connaissait ma rue. Il a dit qu’il ne sortait jamais : il attend qu’on lui apporte des relevés.'],
          ['say', 'idris', 'Et ta rue, elle est sur sa carte ?'],
          ['say', 'gamin', 'Oui. Mais il a mis un mur là où il y a une porte.']
        ] },
        { text: 'Trouver l’homme à la carte, au bout de la rue', talk: 'carto', then: [
          ['say', 'carto', 'Un marcheur ! Parfait. Dis-moi ce que tu as vu, je le reporterai. Combien l’ont vu avec toi ?'],
          ['say', 'idris', 'Tu ne demandes pas qui ?'],
          ['say', 'carto', 'Qui ? Non. Combien. Ce qu’un seul a vu n’existe pas. Ce qu’un million a vu est certain.'],
          ['parley', {
            with: 'carto', title: 'Combien, ou qui ?',
            intro: 'Il sait tout de la Cité sans y avoir marché. Il tient pour vrai ce que beaucoup ont vu, et n’a jamais demandé à personne de qui il le tenait.',
            goal: 5,
            rounds: [
              { say: 'Ma carte est exacte. Elle additionne onze millions de relevés.', opts: [
                { t: 'Elle porte un mur là où il y a une porte. Un enfant me l’a dit. Il habite la rue.', el: 'sidq', v: 2, r: 'Un seul témoin ? … Mais il habite la rue. C’est contrariant.' },
                { t: 'Onze millions de gens peuvent se tromper ensemble.', el: 'ilm', v: 1, r: 'En théorie. En théorie seulement.' },
                { t: 'J’ai vu une phrase vraie devenir un mot d’ordre, parce que des milliers la répétaient sans sa suite. Le nombre ne l’avait pas rendue plus juste : il l’avait coupée.', el: 'ilm', v: 2, need: 'ali/phrase_verset', r: 'Coupée… Mes relevés aussi sont des morceaux. Je n’ai jamais demandé ce qu’il y avait autour.' }
              ] },
              { say: 'Que voudrais-tu ? Que j’aille voir moi-même chaque rue ? Un savant ne se déplace pas.',
                noir: { name: 'La Carte sans chemin', group: ['carte_vide'], bg: 'cite', intro: 'Il a posé la main sur sa carte, et la carte a répondu à sa place. Elle sait tout, et n’est allée nulle part.', say: 'Elle sait tout et n’a rien vu. Demande-lui de qui elle le tient.', after: 'Il y a des blancs sur ma carte. Je ne les voyais plus. Dis-moi.' },
                opts: [
                { t: 'Une seule. Celle de l’enfant. Va voir la porte.', el: 'sabr', v: 2, r: 'Une seule rue… C’est peu, pour une méthode. Mais c’est faisable.' },
                { t: 'Alors ta carte ne vaut rien.', el: 'shajaa', v: -1, r: 'Elle vaut onze millions de relevés. Bonsoir.' },
                { t: "Quand des milliers d’hommes se sont retirés à Harûrâ', Ibn 'Abbâs n’a pas écrit sur eux : il est allé les trouver à midi. Il a écouté leurs griefs, puis il a répondu. Deux mille sont revenus ce jour-là.", el: 'ilm', v: 3, need: 'ali/harura', r: 'Il y est allé. En personne. Et il a écouté d’abord… Je n’ai jamais écouté un relevé.' }
              ] },
              { say: 'Et si j’y vais, et que je me trompe quand même ?', opts: [
                { t: 'Alors tu diras de qui tu le tiens, et l’on pourra te corriger. C’est cela, une chaîne.', el: 'ilm', v: 2, r: 'Dire de qui… Mettre des noms sur une carte. On ne m’a jamais appris cela.' },
                { t: 'Tu ne te tromperas pas.', el: 'sidq', v: -1, r: 'Voilà une affirmation sans source.' },
                { t: 'À la Citadelle, j’ai lu sur un feuillet qu’une parole vraie peut servir de lame, et qu’on lui répond par le savoir, non par une autre lame. Une carte fausse, c’est pareil : on la corrige en allant voir, pas en criant plus fort.', el: 'ilm', v: 2, need: 'caid/slogan_purs', r: 'Aller voir… Tu es le premier marcheur qui ne me demande pas d’additionner.' }
              ] }
            ],
            win: [['flag', 'ami_carto'], ['pillar', 'savoir', 1], ['nar', 'Il roule sa carte, la glisse sous son bras, et sort. Il marche mal : il n’a pas l’habitude. Au coin de la rue, il s’arrête devant une porte, et il rit.']],
            lose: [['pillar', 'lien', -1], ['nar', 'Il a déjà reporté ta visite : « un relevé, non confirmé ». Tu n’as pas trouvé les mots, ce soir. Il a pourtant levé les yeux vers la fenêtre, pour la première fois depuis longtemps.']]
          }],
          ['nar', 'La carte est roulée. Mais ce qui l’empêchait d’aller voir est toujours là, tiède et patient comme un demi-sommeil.'],
          ['battle', { group: ['insouciance'], bg: 'cite', boss: true, intro: 'L’Insouciance : vivre à côté de sa vie.' }],
          ['if', 'tranche_insouciance', [['nar', 'La lame de l’Ardeur a tranché le demi-sommeil d’un seul fil. L’Insouciance ne s’étendra plus sur cette table.']], [['nar', 'L’Insouciance se retourne, comme un dormeur qu’on dérange. Elle reviendra. L’étude, trois fois reprise, forge la lame qui la tranche.']]]
        ] },
        { text: 'Retourner auprès de l’enfant', talk: 'gamin', then: [
          ['say', 'gamin', 'Il est venu voir ma porte ?'],
          ['say', 'idris', 'Il y est. Il a écrit en marge de sa carte : « d’après l’enfant de la rue ».'],
          ['say', 'gamin', 'Moi, sur une carte !'],
          ['say', 'idris', "C’est ainsi qu’une chose vraie se garde : avec le nom de celui qui l’a vue. Chez 'Alî, j’ai appris à poser la question avant de juger."],
          ['codex', 'r_cartographe'], ['codex', 'enfant'],
          ['show', 'yunus_r'],
          ['nar', 'Maître Yûnus est monté des Archives basses. Il attend Idris un peu à l’écart.']
        ] },
        // 2.25 (D214) — étape V : il a un cœur, sous le grand écran ; quelqu'un qui l'a servi viendra le montrer (le dernier
        // maillon, e1, le fait paraître : il n'est pas nommé ici). Textes de l'agent, à valider.
        { text: 'Rejoindre Maître Yûnus, un peu à l’écart', talk: 'yunus_r', then: [
          ['say', 'idris', 'Le Cartographe additionnait des relevés sans aller voir. L’Agrégor fait de même : il additionne, et ne voit rien.'],
          ['say', 'yunus_r', 'Alors va voir à sa place. Il a un cœur, Idris, sous le grand écran.'],
          ['say', 'idris', 'Comment le trouverai-je ?'],
          ['say', 'yunus_r', 'Pas seul. Quelqu’un qui l’a servi viendra te le montrer. Ceux qui en reviennent savent le chemin.']
        ] }
      ]
    },
    /* ---------- 2.x : ce qui s'est passé en 2084 pendant qu'Idris suivait un récit ---------- */
    {
      id: 'x_descendu', retour: 1, title: 'Ce qui est descendu', sub: 'Cité-Miroir · Archives basses', minLvl: 2, last: true,
      map: 'archives', start: 'chaine', party: ['idris'],
      npcs: [
        { id: 'yunus_x', name: 'Maître Yûnus', hero: 'yunus', at: ['rayonnages', 0, 1], talk: [['say', 'yunus_x', 'Parle bas.']] }
      ],
      intro: [
        ['title', 'Ce qui est descendu', 'Cité-Miroir · Archives basses'],
        ['nar', 'Idris rouvre les yeux. La lampe du bureau est éteinte. Maître Yûnus n’éteint jamais la lampe.'],
        ['nar', 'L’ascenseur est en bas, grille ouverte. Personne ne l’a appelé.']
      ],
      objectives: [
        { text: 'Trouver Maître Yûnus, entre les rayonnages', talk: 'yunus_x', then: [
          ['say', 'yunus_x', 'Parle bas. Quelque chose est descendu avec l’ascenseur. Trois lueurs froides : elles cherchent ce qui brille.'],
          ['say', 'idris', 'Le Flux ne descend pas jusqu’ici.'],
          ['say', 'yunus_x', 'Il ne descendait pas. Chaque fois que tu remontes la Chaîne, là-haut, un écran s’aperçoit qu’on ne le regarde plus. Il envoie voir.'],
          ['sfx', 'glitch'], ['hide', 'yunus_x'], ['join', 'yunus'],
          ['battle', { group: ['notif', 'notif', 'notif'], bg: 'cite', intro: 'Trois notifications entre les rayonnages. Elles ne supportent pas qu’on leur résiste avec patience.' }],
          ['leave', 'yunus'], ['show', 'yunus_x'],
          // 2.25 (D214) : ce retour peut venir avant que l'Agrégor soit nommé (étape III) ; et les maillons se suivent (D211).
          // Textes de l'agent, à valider.
          ['say', 'yunus_x', 'Elles ne t’ont pas trouvé, toi. Elles ont trouvé que tu n’étais pas là-haut. Pour ce qui règne là-haut, c’est déjà une faute.'],
          ['say', 'yunus_x', 'Les maillons se suivent, l’un après l’autre. Mais tu peux laisser une trace en chemin : elle t’attendra là où tu l’as quittée.'],
          ['say', 'yunus_x', 'Mais reviens. Des archives qu’on ne veille pas, un autre les raconte à ta place.'],
          ['codex', 'x_veiller']
        ] },
        { text: 'Rallumer la lampe, au bureau', goto: 'bureau', then: [
          ['sfx', 'light'],
          ['nar', 'La lampe se rallume. Dans la poussière du bureau, trois petites traces froides s’effacent déjà.'],
          ['nar', 'Au fond de la salle, la Chaîne tourne toujours. Chaque récit attend là où Idris l’a laissé.']
        ] }
      ]
    },
    {
      id: 'x_enfant', retour: 3, title: '« Tu pars où ? »', sub: 'Cité-Miroir · Archives basses', minLvl: 2, last: true,
      map: 'archives', start: 'chaine', party: ['idris'],
      npcs: [
        { id: 'gamin_x', name: 'L’enfant du parvis', at: ['chaine', -2, 1], look: { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }, talk: [['say', 'gamin_x', 'D’après. D’après. D’après.']] },
        { id: 'yunus_x', name: 'Maître Yûnus', hero: 'yunus', at: 'bureau', talk: [['say', 'yunus_x', 'Il a pris l’ascenseur tout seul. Je n’ai pas eu le cœur de le renvoyer.']] }
      ],
      intro: [
        ['title', '« Tu pars où ? »', 'Cité-Miroir · Archives basses'],
        ['nar', 'Idris rouvre les yeux. Quelqu’un est assis par terre devant la Chaîne, et attend.'],
        ['nar', 'L’enfant du parvis. Quarante étages plus bas que là où il devrait être.']
      ],
      objectives: [
        { text: 'Répondre à l’enfant', talk: 'gamin_x', then: [
          ['say', 'gamin_x', 'J’ai pris l’ascenseur derrière toi. Tu fermes les yeux et tu ne bouges plus. Tu pars où ?'],
          ['ask', 'Que répondre à l’enfant ?', [
            { t: 'Je ne pars pas. J’écoute des gens qui ont vu.', r: [['say', 'gamin_x', 'Ils sont là ?'], ['say', 'idris', 'Ils ont vécu il y a très longtemps. C’est pour cela qu’il faut savoir qui a rapporté ce qu’ils ont fait, et de qui il le tenait.']] },
            { t: 'Dans une chaîne. Chaque anneau est quelqu’un qui a dit : « Je le tiens d’untel. »', r: [['say', 'gamin_x', 'Et le premier anneau, il le tient de qui ?'], ['say', 'idris', 'De ce qu’il a vu de ses yeux. C’est pour cela qu’on l’appelle un témoin.']] },
            { t: 'Ce n’est pas un endroit pour toi.', r: [['say', 'gamin_x', 'C’est ce qu’on dit quand on ne veut pas répondre.'], ['say', 'idris', 'Tu as raison. Je recommence : j’écoute des gens qui ont vu, et ceux qui l’ont rapporté après eux.']] }
          ]],
          ['say', 'gamin_x', 'Là-haut, le grand écran a parlé de toi. Pas longtemps. Entre deux tendances. « Un homme ne regarde plus. »'],
          ['say', 'idris', 'Il a dit mon nom ?'],
          ['say', 'gamin_x', 'Non. Il a dit « un homme ». Mais j’ai su que c’était toi.']
        ] },
        { text: 'Parler à Maître Yûnus', talk: 'yunus_x', then: [
          ['say', 'yunus_x', 'Il t’a suivi parce que tu lui réponds. Le jour où tu cesseras, il remontera regarder l’écran.'],
          ['say', 'yunus_x', 'Garde-le une heure. Montre-lui un nom, puis celui qui vient après. C’est ainsi que j’ai commencé avec toi.'],
          ['pillar', 'lien', 1], ['codex', 'x_question']
        ] },
        { text: 'Revenir devant la Chaîne, avec l’enfant', goto: 'chaine', then: [
          ['nar', 'L’enfant suit les anneaux du doigt, sans les toucher. « D’après », lit-il. « D’après. D’après. » Il ne demande plus où tu pars.'],
          ['nar', 'Quand il sera remonté, la Chaîne sera là. Les récits aussi.']
        ] }
      ]
    },
    {
      id: 'x_avis', retour: 5, title: 'L’avis', sub: 'Cité-Miroir · Archives basses', minLvl: 2, last: true,
      map: 'archives', start: 'chaine', party: ['idris'],
      npcs: [
        { id: 'agent', name: 'L’agent du relevé', at: ['entree', 0, -1], look: { kind: 'citadin', robe: '#5a9a5a', head: '#3e723e', cloak: '#72b272' }, talk: [['say', 'agent', 'Je note, et je remonte.']] },
        { id: 'yunus_x', name: 'Maître Yûnus', hero: 'yunus', at: 'bureau', talk: [['say', 'yunus_x', 'Laisse-le compter. Puis parle-lui.']] }
      ],
      intro: [
        ['title', 'L’avis', 'Cité-Miroir · Archives basses'],
        ['nar', 'Idris rouvre les yeux sur un bruit qu’on n’entend jamais ici : des pas qui ne sont ni les siens ni ceux de Maître Yûnus.'],
        ['nar', 'Un homme en gris se tient près de l’ascenseur, une tablette à la main. Il compte les rayonnages.']
      ],
      objectives: [
        { text: 'Aller au-devant de l’homme en gris', talk: 'agent', then: [
          ['say', 'agent', 'Archives basses, niveau moins quarante. Audience des trente derniers jours : deux personnes. Je pose l’avis et je remonte.'],
          ['say', 'idris', 'Quel avis ?'],
          ['say', 'agent', 'Réaffectation. Un lieu que personne ne regarde ne sert à personne. Ce n’est pas moi qui le dis : c’est le relevé.'],
          ['parley', {
            with: 'agent', title: 'Ce que vaut un lieu sans audience',
            intro: 'Il n’est pas un ennemi : il fait son relevé, et il voudrait rentrer chez lui. Il faut lui donner une raison d’écrire autre chose que zéro.',
            goal: 4,
            rounds: [
              { say: 'Deux visiteurs en un mois. Donnez-moi une raison de ne pas écrire zéro.', opts: [
                { t: 'Deux qui savent de qui ils tiennent ce qu’ils savent. Combien, là-haut, peuvent en dire autant ?', el: 'ilm', v: 2, r: 'Aucun, sans doute. Ce n’est pas une colonne de mon relevé.' },
                { t: 'Vous n’avez rien à faire ici.', el: 'adl', v: -1, r: 'J’ai un ordre de mission. Vous, vous avez une lampe.' },
                { t: "Chez 'Uthmân, j’ai appris une règle qui tient en deux questions : de qui tiens-tu cela ? et lui, de qui le tenait-il ? Ici, chaque feuillet y répond.", el: 'ilm', v: 2, need: 'uthman/tabayyun', r: 'Deux questions… Mon relevé n’en pose qu’une : combien.' }
              ] },
              { say: 'Admettons. Mais un lieu qui ne rapporte rien, pourquoi le garder ?', opts: [
                { t: 'Parce que ce qu’on garde ici ne diminue pas quand on le partage.', el: 'rahma', v: 2, r: 'Tout diminue. C’est dans mes barèmes… Presque tout.' },
                { t: 'Vous ne comprendriez pas.', el: 'ilm', v: -1, r: 'C’est ce qu’on me répond partout où l’on n’a rien à montrer.' },
                { t: "À Médine, l’eau douce d’un puits se vendait. 'Uthmân l’acheta de son bien et en fit don à tous. Ce lieu est un puits de cette sorte.", el: 'rahma', v: 2, need: 'uthman/ruma', r: 'Un puits qui ne rapporte rien à celui qui l’a payé… Il n’y a pas de case pour cela.' }
              ] },
              { say: 'Si j’écris « à conserver », on me demandera pourquoi. Qu’est-ce que je réponds ?', opts: [
                { t: 'Que vous êtes descendu voir, et que vous dites ce que vous avez vu.', el: 'sidq', v: 2, r: 'Signer de mon nom ce que j’ai vu… On ne nous le demande plus.' },
                { t: 'Répondez ce que vous voudrez.', el: 'sabr', v: 0, r: 'Alors j’écrirai zéro. C’est ce qui demande le moins d’explications.' },
                { t: 'Un seigneur du désert a annoncé lui-même, à l’aube, la nouvelle qu’il aurait pu taire sept jours. Il y a perdu de l’avance, et gagné d’être cru.', el: 'sidq', v: 2, need: 'caid/aube_vraie', r: 'Être cru… Voilà une chose que mon relevé ne mesure pas, et dont il a besoin.' }
              ] }
            ],
            win: [['flag', 'x_sursis'], ['pillar', 'savoir', 1], ['emote', 'agent', 'salut'], ['nar', 'Il écrit longtemps. Puis il raye une ligne, et signe. « Lieu consulté. À conserver. Vu par le soussigné. »']],
            lose: [['pillar', 'savoir', -1], ['nar', 'Il pose l’avis contre la grille. « Réaffectation à l’étude. » Il n’a pas écrit zéro : il a écrit qu’il reviendrait.']]
          }]
        ] },
        { text: 'Parler à Maître Yûnus', talk: 'yunus_x', then: [
          ['say', 'yunus_x', 'Qu’il ait signé ou non, il est descendu. C’est plus que n’en font ceux qui décident.'],
          ['say', 'yunus_x', 'On ne garde pas des archives en les cachant. On les garde en y amenant quelqu’un. Tu viens d’en amener un.'],
          ['codex', 'x_avis']
        ] }
      ]
    },
    /* ---------- 2.x : la Citadelle, où Idris est né (ouverte depuis la Chaîne dès la première veillée entendue) ---------- */
    {
      id: 'c_citadelle', visite: 'citadelle', title: 'La Citadelle', sub: 'An 1507 de l’Hégire · au bord du désert', minLvl: 1, last: true,
      map: 'citadelle', opts: { time: 'dusk' }, start: 'porte', party: ['idris'],
      npcs: [
        { id: 'amghar', name: 'Le vieil amghar', at: ['puits', 2, 0], look: { kind: 'ancien', robe: '#5a4a38', head: '#d8cfba' }, talk: [['say', 'amghar', 'Le puits donne encore. Assieds-toi.']] },
        { id: 'ecolier', name: 'Un écolier', at: ['ecole', 1, 1], look: { kind: 'enfant', robe: '#4a5a3a', head: '#2c3424' }, talk: [['say', 'ecolier', 'On apprend les noms dans l’ordre : celui qui a dit, puis celui qui a entendu.']] }
      ],
      intro: [
        ['title', 'La Citadelle', 'An 1507 de l’Hégire · au bord du désert'],
        ['mus', 'citadelle'],
        ['nar', 'Idris est né ici. Il n’y était pas revenu depuis qu’on l’avait envoyé apprendre aux Archives basses.'],
        ['nar', 'Les murs de pisé ont été refaits bien des fois. Ce sont les mêmes murs : ceux du Caïd dont il entend les veillées.'],
        ['nar', 'Aucun écran dans la cour. Le ciel, ici, est encore le ciel.']
      ],
      objectives: [
        { text: 'Aller jusqu’au puits, dans la cour', goto: 'puits', then: [
          ['nar', 'Le puits est là où il a toujours été. Un vieil homme y remplit une outre, sans se presser.']
        ] },
        { text: 'Parler au vieil amghar', talk: 'amghar', then: [
          ['say', 'amghar', 'Idris. L’enfant de la maison près du cèdre. On m’a dit que tu remontais la Chaîne.'],
          ['say', 'idris', 'J’entends aussi celui qui a tenu ces murs.'],
          ['say', 'amghar', 'Alors regarde ce qu’il en reste. Un homme ne laisse pas ce qu’il a voulu : il laisse ce qu’il a fait.'],
          ['if', '_2084_pilier_priere', [['say', 'amghar', 'La mosquée n’a jamais fermé. On y entre encore côte à côte, celui qui possède et celui qui doit.']], [['say', 'amghar', 'La mosquée est ouverte. Les rangs y sont clairsemés : on a longtemps cru qu’elle tiendrait sans nous.']]],
          ['if', '_2084_pilier_savoir', [['say', 'amghar', 'L’école tient. On y apprend à dire de qui l’on tient une chose avant de la répéter.']], [['say', 'amghar', 'L’école a perdu des maîtres. Il reste des livres, et peu de gens pour dire qui les a écrits.']]],
          ['if', '_2084_pilier_justice', [['say', 'amghar', 'Le tour d’eau est le même pour tous. Personne ne paie pour passer devant.']], [['say', 'amghar', 'Le tour d’eau se discute chaque été. Quand la règle plie pour l’un, tous veulent qu’elle plie.']]],
          ['if', '_2084_pilier_lien', [['say', 'amghar', 'Les familles d’ici se doivent encore quelque chose. C’est cela, une ville : des gens qui se doivent quelque chose.']], [['say', 'amghar', 'Beaucoup sont partis vers la Cité-Miroir. Ceux qui restent se connaissent moins qu’avant.']]],
          ['if', '_2084_debout', [['nar', 'La Citadelle est debout. Non par ses pierres : par ce que le Caïd y a laissé, veillée après veillée.']],
            [['if', '_2084_tient', [['nar', 'La Citadelle tient, et demande qu’on la veille. Ce que le Caïd décide dans les veillées se lit ici.']], [['nar', 'La Citadelle se lézarde. Ce que les veillées n’ont pas encore bâti manque ici, des siècles plus tard.']]]]],
          ['say', 'amghar', 'Tu n’es pas venu pour rester. Passe par l’école avant de repartir. C’est là que tu as appris à demander : « De qui le tiens-tu ? »']
        ] },
        { text: 'Passer par l’école', goto: 'ecole', then: [
          ['nar', 'Sur le mur de l’école, des noms, et après chaque nom : « d’après ». La première chaîne qu’Idris ait vue, bien avant les anneaux d’or des Archives.'],
          ['codex', 'citadelle_2084']
        ] },
        { text: 'Regagner la porte, et la route de la Cité-Miroir', goto: 'porte', then: [
          ['say', 'idris', 'Je tiens d’ici plus que je ne croyais.'],
          ['nar', 'Idris reprend la route de la Cité-Miroir. Il pourra revenir : la Citadelle ne ferme pas sa porte à ceux qui y sont nés.']
        ] }
      ]
    },
    /* ---------- 2.23 (D212) : les quartiers de la Cité, où Idris remonte à tout moment, à côté de Maître Yûnus ---------- */
    {
      id: 'c_quartiers', visite: 'quartiers', title: 'Les quartiers de la Cité', sub: 'An 1507 de l’Hégire · Cité-Miroir', minLvl: 1, last: true,
      map: 'quartiers', start: 'parvis', party: ['idris'],
      npcs: [
        { id: 'yunus_c', name: 'Maître Yûnus', hero: 'yunus', at: ['parvis', 2, 0], face: 'left', talk: [['say', 'yunus_c', 'Je suis là, Idris.']] },
        // les passants : chacun seul, au milieu de ce qu'on fait ici (aucun ne voit les chimères)
        { id: 'q_joueur', name: 'Un joueur', at: ['jeux', -3, 0], face: 'up', pose: 'triste', look: { kind: 'citadin', robe: '#3a5a8a', head: '#24385a', cloak: '#4a6a9a' }, talk: [['say', 'q_joueur', 'J’ai battu mon record. Il n’y avait personne pour le voir.']] },
        { id: 'q_joueuse', name: 'Une joueuse', at: ['jeux', 3, 0], face: 'up', pose: 'accable', look: { kind: 'femme', robe: '#7a4862', head: '#4a2c40', cloak: '#8a5a74' }, talk: [['say', 'q_joueuse', 'Je joue avec des milliers de gens, tous les soirs. Je ne connais le nom d’aucun.']] },
        { id: 'q_cliente', name: 'Une cliente', at: ['galerie', -5, 0], pose: 'triste', look: { kind: 'femme', robe: '#c8a060', head: '#7a5a30', cloak: '#d8b070' }, talk: [['say', 'q_cliente', 'J’ai acheté ce que l’écran m’a montré ce matin.'], ['say', 'q_cliente', 'Ce soir, il m’en montre un autre.']] },
        { id: 'q_vitrine', name: 'Un passant', at: ['galerie', 5, 1], face: 'up', pose: 'triste', look: { kind: 'citadin', robe: '#7a5a3a', head: '#4a3420', cloak: '#8a6a4a' }, talk: [['say', 'q_vitrine', 'Les vitrines restent allumées toute la nuit. On dirait qu’elles attendent quelqu’un.']] },
        { id: 'q_ancien', name: 'Un vieil homme', at: ['ecran', -5, 4], face: 'up', pose: 'assis', look: { kind: 'ancien', robe: '#4a4038', head: '#bdb6a8' }, talk: [['say', 'q_ancien', 'Autrefois, sur cette place, on se saluait.'], ['say', 'q_ancien', 'Maintenant, on regarde tous l’écran, et personne ne se voit.']] },
        { id: 'q_passante', name: 'Une passante', at: ['ecran', 4, 5], pose: 'triste', look: { kind: 'femme', robe: '#6a5a8a', head: '#3e3458', cloak: '#7a6a9a' }, talk: [['say', 'q_passante', 'Il y a tant de monde ici, chaque soir. Je ne sais pas à qui parler.']] },
        { id: 'q_employe', name: 'Un employé', at: ['ecran', 7, 3], face: 'up', pose: 'assis', look: { kind: 'citadin', robe: '#7a7a6a', head: '#4a4a3e', cloak: '#8a8a7a' }, talk: [['say', 'q_employe', 'Je viens m’asseoir ici après le travail. L’écran parle, au moins.']] },
        { id: 'q_enfant', name: 'Un enfant', at: ['parc', 5, 4], face: 'up', pose: 'triste', look: { kind: 'enfant', robe: '#3d6a5a', head: '#28403a' }, talk: [['say', 'q_enfant', 'Le manège tourne tout seul. Je n’ai personne à qui faire signe.']] },
        { id: 'q_promeneuse', name: 'Une promeneuse', at: ['parc', -2, -2], pose: 'triste', look: { kind: 'femme', robe: '#8a6a4a', head: '#5a4230', cloak: '#9a7a5a' }, talk: [['say', 'q_promeneuse', 'Je viens ici tous les soirs. Personne ne m’a jamais demandé pourquoi.']] },
        { id: 'q_roue', name: 'Un passant', at: ['roue', 3, 0], face: 'up', pose: 'triste', look: { kind: 'citadin', robe: '#8a7a2a', head: '#5a4e18', cloak: '#9a8a3a' }, talk: [['say', 'q_roue', 'La grande roue tourne à vide depuis des mois.'], ['say', 'q_roue', 'Monter seul, à quoi bon ?']] },
        { id: 'q_spectateur', name: 'Un spectateur', at: ['tribune', -5, 0], pose: 'assis', look: { kind: 'citadin', robe: '#9a4a3a', head: '#6a3024', cloak: '#aa5a4a' }, talk: [['say', 'q_spectateur', 'Ils vont très vite. Je ne sais même pas qui gagne.'], ['say', 'q_spectateur', 'Je viens pour le bruit.']] },
        { id: 'q_spectatrice', name: 'Une spectatrice', at: ['tribune', 5, 1], pose: 'assis', look: { kind: 'femme', robe: '#3a7a7a', head: '#245050', cloak: '#4a8a8a' }, talk: [['say', 'q_spectatrice', 'Tout le monde regarde la même course. Chacun la regarde seul.']] },
        { id: 'q_mecano', name: 'Un mécanicien', at: ['circuit', 0, -1], pose: 'accable', look: { kind: 'citadin', robe: '#3a5a3a', head: '#243a24', manteau: 'aucun' }, talk: [['say', 'q_mecano', 'Je prépare des voitures toute la journée. Personne ne me demande comment je vais.']] },
        { id: 'q_voisine', name: 'Une passante', at: ['parvis', -6, 6], pose: 'triste', look: { kind: 'femme', robe: '#7a4a5a', head: '#4e2e3a', cloak: '#8a5a6a' }, talk: [['say', 'q_voisine', 'Mon téléphone sait tout de moi. Mes voisins ne savent pas mon nom.']] },
        { id: 'q_livreur', name: 'Un livreur', at: ['parvis', 6, 4], pose: 'accable', look: { kind: 'citadin', robe: '#c86a2a', head: '#7a3e18', cloak: '#d87a3a', coiffe: 'calotte' }, talk: [['say', 'q_livreur', 'Je livre des paquets à des portes qui ne s’ouvrent pas.'], ['say', 'q_livreur', 'On me laisse un pourboire, jamais un mot.']] },
        // 2.27 (D216) — le circuit : Sâlim (il paraît quand il arrive en moto, circuit.js), l'organisateur et ses cinq circuits ;
        // dans la tribune, des parieurs, chacun seul devant son écran (aucun ne propose rien à Idris ; Le Pari rôde parmi eux)
        { id: 'salim_q', name: 'Sâlim', hero: 'salim', at: ['circuit', -1, -2], hidden: true, talk: [['say', 'salim_q', 'La moto est là.']] },
        { id: 'q_organisateur', name: 'L’organisateur', at: ['circuit', 2, -2], face: 'left', look: { kind: 'citadin', robe: '#3a7aa8', head: '#24506e', cloak: '#4a8ab8' }, talk: [['say', 'q_organisateur', 'La piste est libre.']] },
        { id: 'q_parieur', name: 'Un parieur', at: ['tribune', -3, 1], face: 'up', pose: 'assis', look: { kind: 'citadin', robe: '#9a6a2a', head: '#5e4018', cloak: '#aa7a3a' }, talk: [['say', 'q_parieur', 'Je ne regarde pas la course. Je regarde les chiffres sur mon écran.'], ['say', 'q_parieur', 'Ils montent, ils descendent. Moi aussi.']] },
        { id: 'q_parieuse', name: 'Une parieuse', at: ['tribune', 2, 0], face: 'up', pose: 'triste', look: { kind: 'femme', robe: '#5a6a4a', head: '#3a4630', cloak: '#6a7a5a' }, talk: [['say', 'q_parieuse', 'Je me dis que la prochaine fois, je rattraperai tout. Je me le dis chaque soir.']] },
        { id: 'q_parieur2', name: 'Un parieur', at: ['tribune', 7, 1], face: 'up', pose: 'accable', look: { kind: 'citadin', robe: '#8a3a5a', head: '#5a2238', cloak: '#9a4a6a' }, talk: [['say', 'q_parieur2', 'Ce que j’ai perdu, je n’ose le dire à personne. Alors je reviens, seul.']] }
      ],
      // 2.28 (D218) : arrivé à pied par la rue (`_2084_rue`, posé par le moteur : cite.js), Idris entre par l'entrée de la rue ;
      // Maître Yûnus n'est pas monté avec lui
      intro: [
        ['if', '_2084_rue', [['nar', 'Idris traverse la rue. De l’autre côté de l’avenue s’ouvrent les quartiers de la Cité-Miroir : des vitrines, des jeux, des manèges, et chacun seul.'], ['codex', 'quartiers']],
          [['title', 'Les quartiers de la Cité', 'An 1507 de l’Hégire · Cité-Miroir'],
            ['if', '_2084_cite', [['nar', 'L’ascenseur remonte des Archives basses. Maître Yûnus attend sur le parvis.']],
              [['nar', 'L’ascenseur remonte des Archives basses jusqu’aux quartiers de la Cité-Miroir. Maître Yûnus est monté avec Idris.'],
                ['nar', 'Des voitures qui brillent, des jeux partout, des vitrines, un écran grand comme une façade. Et, au milieu de tout cela, chacun seul.'],
                ['codex', 'quartiers']]]]]
      ],
      objectives: [
        { text: 'Te promener dans les quartiers · Maître Yûnus attend au parvis', talk: 'yunus_c', then: [['say', 'yunus_c', 'Va, Idris. La Chaîne t’attend.']] }
      ]
    }
  ]
});
