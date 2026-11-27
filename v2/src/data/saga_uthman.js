/* ISNAD — Saga IV : 'Uthmân ibn 'Affân, « Le Généreux ». Données pures (cf. docs/schema-saga.md). */
ISNAD.registerSaga({
  id: 'uthman', order: 4,
  name: "'Uthmân ibn 'Affân", epithet: 'Le Généreux', arabic: 'عثمان',
  years: '23–35 H · 644–656',
  light: 'rahma', lightName: 'Miséricorde',
  ambiance: 'orientale · maritime · noosphère',
  tagline: "Il donna sans compter — et, assiégé, refusa qu'une seule goutte de sang fût versée pour lui.",

  intro: [
    ['mus', 'chaine'],
    ['title', "'Uthmân ibn 'Affân", 'Quatrième maillon · Le Généreux'],
    ['nar', "An 23 de l'Hégire. 'Umar est tombé à la prière de l'aube. Six hommes se concertent trois jours ; au matin, les mains se tendent vers 'Uthmân ibn 'Affân."],
    ['nar', "Il a près de soixante-dix ans. Marchand prospère, il a tant donné qu'on a cessé de compter : un puits racheté pour que tous y boivent, l'armée des jours difficiles équipée de ses deniers."],
    ['nar', "Sous son califat, la communauté s'étend de l'Ifrîqiya au Khorâsân. Les trésors affluent. Les cœurs, eux, ne grandissent pas aussi vite que les frontières."],
    ['nar', "Dans la noosphère, une idole neuve s'éveille. Elle n'a ni pierre ni trône : elle est faite de bouches. Chacun la nourrit en répétant ce qu'il n'a pas vu. On l'appelle la Rumeur."],
    ['nar', "Idris, tu connais cette voix. Dans la Cité-Miroir, elle porte un autre nom : le Flux. Regarde comment un homme lui a répondu — sans lever la main."],
    ['codex', 'bio_uthman']
  ],

  outro: [
    ['mus', 'deuil'],
    ['flash', '#ffffff'],
    ['nar', "Le vendredi 18 Dhû l-Hijja de l'an 35, on força sa porte. Il jeûnait. Le Livre était ouvert devant lui."],
    ['nar', "La Chaîne se tait ici. Elle ne montre pas. Elle dit seulement : il avait plus de quatre-vingts ans, il avait gouverné douze années, et nul n'était mort pour le défendre — parce qu'il l'avait interdit."],
    ['nar', "Ce qui suivit fut l'épreuve que redoutait Hudhayfa. Mais deux choses demeurèrent, que la discorde n'a jamais pu défaire."],
    ['nar', "La première : un Livre au tracé unique, entre toutes les mains. La seconde : l'exemple d'un homme qui tenait le pouvoir et préféra le perdre, et la vie avec, plutôt que d'ouvrir la guerre entre les siens."],
    ['quote', "« On ne s'enquérait pas de la chaîne des transmetteurs. Puis, quand survint la discorde, on dit : Nommez-nous vos hommes. »", "Muhammad ibn Sîrîn — rapporté par Muslim, introduction au Sahîh"],
    ['codex', 'nommez'],
    ['nar', "Idris, entends-tu ? C'est de cette blessure qu'est née la Chaîne que tu remontes. À la Rumeur qui dit « on dit », les transmetteurs ont répondu : de qui tiens-tu cela ? Et de qui le tenait-il ?"],
    ['nar', "Le Flux de la Cité-Miroir n'est pas autre chose. Tu ne le feras pas taire en criant plus fort que lui. Tu le briseras comme eux : en vérifiant — et en refusant de haïr sur parole."],
    ['mus', 'espoir'], ['sfx', 'light'],
    ['title', 'Lumière retrouvée', 'Rahma — la Miséricorde'],
    ['light', 'rahma']
  ],

  /* ───────────────────────────── HÉROS ───────────────────────────── */
  heroes: {
    uthman: {
      name: "'Uthmân", title: 'Le Généreux', arabic: 'عثمان',
      role: 'soigneur', el: 'rahma',
      look: { robe: '#efe9dc', head: '#f6f1e4', cloak: '#2f6d6a', aura: '#8ff0e0', coiffe: 'imama_large', manteau: 'ample', motif: 'bandes' },
      skills: [
        { lvl: 1, id: 'largesse', name: 'Largesse', desc: 'Donne sans compter : rend de la Constance à tout le groupe.', cost: 5,
          target: 'allies', heal: 0.6, anim: 'heal' },
        { lvl: 1, id: 'retenue', name: 'Retenue', desc: "Répond à la violence par la douceur : blesse l'idole et affaiblit ses coups.", cost: 3,
          target: 'foe', el: 'rahma', pow: 1.1, fx: [{ st: 'atk', v: -1 }], anim: 'light' },
        { lvl: 2, id: 'feuillets', name: 'Les Feuillets réunis', desc: 'Oppose à la discorde un tracé unique. Dégâts de Véracité.', cost: 4,
          target: 'foe', el: 'sidq', pow: 1.4, anim: 'glyph' },
        { lvl: 4, id: 'ruma', name: 'Le Puits de Rûma', desc: "L'eau offerte à tous : rend du Souffle au groupe.", cost: 8,
          target: 'allies', sp: 0.3, anim: 'wave' },
        { lvl: 6, id: 'affranchir', name: 'Affranchir', desc: 'Délivre un compagnon de ses altérations et lui rend de la Constance.', cost: 5,
          target: 'ally', heal: 1.0, fx: [{ st: 'cleanse' }], anim: 'heal' },
        { lvl: 8, id: 'patience', name: "Patience de l'assiégé", desc: "Tient sans rendre les coups : Patience sur toutes les chimères, et sa garde s'affermit.", cost: 9,
          target: 'foes', el: 'sabr', pow: 1.1, fx: [{ st: 'def', v: 1, self: true }], anim: 'wave' }
      ],
      limit: { id: 'sans_effusion', name: 'Sans effusion de sang', desc: 'Refuse le sang : relève le groupe, dissipe ses maux et le garde.',
               target: 'allies', heal: 1.6, revive: true,
               fx: [{ st: 'cleanse' }, { st: 'garde' }, { st: 'regen', turns: 3 }], anim: 'heal' }
    },
    zayd: {
      name: 'Zayd ibn Thâbit', title: 'Le Scribe', arabic: 'زيد',
      role: 'sage', el: 'ilm',
      look: { robe: '#d8ccb0', head: '#5b4a8a', cloak: '#5b4a8a', aura: '#d2b6ff', coiffe: 'calotte', manteau: 'aucun', echarpe: true, item: 'feuillets' },
      skills: [
        { lvl: 1, id: 'calame', name: 'Le Calame', desc: 'Trace net ce que la querelle brouille. Dégâts de Savoir.', cost: 3,
          target: 'foe', el: 'ilm', pow: 1.3, anim: 'glyph' },
        { lvl: 1, id: 'collation', name: 'Collation', desc: "Compare ligne à ligne : révèle les failles d'une chimère.", cost: 2,
          target: 'foe', el: 'ilm', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'light' },
        { lvl: 2, id: 'temoins', name: 'Deux témoins', desc: "N'admet rien sans deux témoins. Dégâts de Véracité.", cost: 4,
          target: 'foe', el: 'sidq', pow: 1.5, anim: 'light' },
        { lvl: 4, id: 'trace', name: 'Un seul tracé', desc: 'Ramène les lectures à une même ligne : Savoir sur toutes les chimères.', cost: 7,
          target: 'foes', el: 'ilm', pow: 0.9, anim: 'wave' },
        { lvl: 6, id: 'dictee', name: 'Dictée', desc: "Chacun écrit d'une même voix : Esprit accru et Niyya pour le groupe.", cost: 6,
          target: 'allies', fx: [{ st: 'mag', v: 1 }, { st: 'niyya', v: 1 }], anim: 'glyph' },
        { lvl: 8, id: 'reference', name: "L'Exemplaire de référence", desc: "Ce qui s'en écarte tombe de soi-même : grand Savoir, et un voile arraché.", cost: 9,
          target: 'foe', el: 'ilm', pow: 1.9, fx: [{ st: 'veil', v: -1 }], anim: 'pillar' }
      ],
      limit: { id: 'copie', name: 'La Copie fidèle', desc: 'Rien ajouté, rien retranché : Savoir sur tous, bonus dissipés, voiles déchirés.',
               target: 'foes', el: 'ilm', pow: 1.8, fx: [{ st: 'dispel' }, { st: 'veil', v: -2 }], anim: 'glyph' }
    },
    hudhayfa: {
      name: 'Hudhayfa', title: 'Le Gardien du secret', arabic: 'حذيفة',
      role: 'stratege', el: 'sidq',
      look: { robe: '#8a7355', head: '#ded3bd', cloak: '#6e5a2a', aura: '#ffe9a0', coiffe: 'imama_queue', manteau: 'long', echarpe: true },
      skills: [
        { lvl: 1, id: 'estoc', name: 'Estoc des frontières', desc: 'Un coup droit appris aux marches. Dégâts de Fer.', cost: 3,
          target: 'foe', el: 'fer', pow: 1.4, anim: 'slash' },
        { lvl: 1, id: 'alarme', name: "Cri d'alarme", desc: 'Nomme le danger avant qu’il ne grandisse. Dégâts de Véracité.', cost: 3,
          target: 'foe', el: 'sidq', pow: 1.3, anim: 'light' },
        { lvl: 2, id: 'demasquer', name: 'Démasquer', desc: "Voit ce qui se cache : révèle les failles et fend la garde d'une chimère.", cost: 4,
          target: 'foe', el: 'sidq', pow: 0.9, fx: [{ st: 'reveal' }, { st: 'def', v: -1 }], anim: 'glyph' },
        { lvl: 4, id: 'ligne', name: 'Tenir la ligne', desc: "Comme à Nihâwand, relève l'étendard tombé : Courage sur toutes les chimères.", cost: 6,
          target: 'foes', el: 'shajaa', pow: 0.9, anim: 'burst' },
        { lvl: 6, id: 'veille', name: 'Veille aux frontières', desc: 'Le groupe gagne en Élan et en Garde.', cost: 5,
          target: 'allies', fx: [{ st: 'spd', v: 1 }, { st: 'def', v: 1 }], anim: 'guard' },
        { lvl: 8, id: 'sansdetour', name: 'Parole sans détour', desc: 'Dit la chose telle qu’elle est. Grande Véracité ; peut étourdir.', cost: 8,
          target: 'foe', el: 'sidq', pow: 1.9, fx: [{ st: 'stun', chance: 0.35 }], anim: 'pillar' }
      ],
      limit: { id: 'avertisseur', name: "L'Avertisseur", desc: 'Dévoile tout ce qui menace : Véracité sur tous, failles révélées, coups affaiblis.',
               target: 'foes', el: 'sidq', pow: 1.8, fx: [{ st: 'reveal' }, { st: 'atk', v: -1 }], anim: 'pillar' }
    }
  },

  /* ──────────────────────────── ÉGRÉGORES ─────────────────────────── */
  enemies: {
    murmure: {
      name: 'Murmure', art: 'wisp', hue: 280, scale: 1, lvl: 1, tier: 'minion',
      weak: ['sidq', 'rahma'], veils: 1,
      skills: [
        { w: 2, name: 'Chuchotis', target: 'foe', el: 'fer', pow: 0.8, fx: [{ st: 'waswas', turns: 2, chance: 0.3 }], anim: 'dark' },
        { w: 1, name: 'Ressasser', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }   // 2.20 : le temps volé (D.TEMPS, D210)
      ],
      desc: "La plus petite des idoles : une phrase dite à mi-voix, que l'on n'ose ni affirmer ni retenir. Seul, un murmure n'est rien. Il attend d'être deux."
    },
    variante: {
      name: 'Variante querelleuse', art: 'swarm', hue: 265, scale: 1, lvl: 2, tier: 'minion',
      weak: ['ilm', 'sidq'], veils: 2,
      skills: [
        { w: 2, name: '« Ma lecture vaut mieux »', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'doute', turns: 2, chance: 0.25 }], anim: 'glyph' },
        { w: 1, name: 'Dispute sans fin', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }
      ],
      taunts: ['La mienne. Pas la tienne.'],
      desc: "Une lettre détachée de sa récitation, qui ne sert plus à lire mais à l'emporter sur l'autre. Le Savoir la remet à sa place dans la ligne."
    },
    babel: { racine: 'noir_soupcon',
      name: 'Babel', art: 'swarm', hue: 275, scale: 2, lvl: 3, tier: 'elite',
      weak: ['ilm', 'sidq'], veils: 4,
      skills: [
        { w: 3, name: 'Mille lectures', target: 'foes', el: 'fer', pow: 0.7, anim: 'glyph' },
        { w: 2, name: 'Surenchère', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'dark' },
        { w: 2, name: 'Confusion des langues', target: 'foe', el: 'fer', pow: 1.1, fx: [{ st: 'doute', turns: 2, chance: 0.4 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.5, say: 'Qui es-tu pour dire laquelle est la bonne ? À chacun la sienne — et moi entre tous.',
          fx: [{ st: 'spd', v: 1 }],
          addSkills: [{ w: 3, name: 'Schisme', target: 'foes', el: 'fer', pow: 0.9, fx: [{ st: 'mag', v: -1, chance: 0.4 }], anim: 'burst' }] }
      ],
      taunts: ['Récite. Je te dirai en quoi tu te trompes.', 'Ils ne se comprennent déjà plus.'],
      desc: "Chimère de la discorde des lectures. Elle naît quand une chose vraie, reçue par plusieurs voies, devient un motif de se préférer à l'autre. Le Savoir, qui compare et vérifie, et la Véracité, qui renonce à avoir raison seule, la défont."
    },
    ecume: {
      name: "Écume d'effroi", art: 'wave', hue: 200, scale: 1, lvl: 4, tier: 'minion',
      weak: ['shajaa', 'rahma'], veils: 2,
      skills: [
        { w: 2, name: 'Roulis', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'spd', v: -1, chance: 0.4 }], anim: 'wave' },
        { w: 1, name: 'Vertige', target: 'foe', fx: [{ st: 'atk', v: -1 }], anim: 'dark' }
      ],
      desc: "La peur d'un seul homme, tombée par-dessus bord. Elle ne mord pas : elle fait lâcher la rame."
    },
    abime: { racine: 'noir_peur',
      name: "L'Abîme", art: 'wave', hue: 215, scale: 3, lvl: 5, tier: 'boss',
      weak: ['shajaa', 'rahma', 'sidq'], veils: 6,
      skills: [
        { w: 3, name: 'Lame de fond', target: 'foes', el: 'fer', pow: 0.8, anim: 'wave' },
        { w: 2, name: 'Sans rivage', target: 'foe', el: 'fer', pow: 1.3, fx: [{ st: 'def', v: -1, chance: 0.5 }], anim: 'dark' },
        { w: 2, name: 'Appel du fond', target: 'foe', fx: [{ st: 'stun', chance: 0.5 }, { st: 'atk', v: -1 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.5, say: 'Vous êtes des gens de sable. Ici, rien ne porte. Lâchez prise.',
          fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Maelström', target: 'foes', el: 'fer', pow: 1.0, fx: [{ st: 'spd', v: -1, chance: 0.5 }], anim: 'wave' }] }
      ],
      taunts: ['Regarde en bas.', "Il n'y a ni piste ni puits, ici."],
      desc: "Chimère de la peur de la mer : l'effroi d'hommes du désert devant une étendue sans piste ni puits. Elle grossit de chaque regard jeté par-dessus bord. Le Courage la fend ; la Miséricorde l'apaise ; la Véracité lui rappelle que nul n'a été contraint d'embarquer."
    },
    ouidire: {
      name: 'Ouï-dire', art: 'mask', hue: 330, scale: 1, lvl: 5, tier: 'minion',
      weak: ['sidq', 'ilm'], veils: 2,
      skills: [
        { w: 2, name: '« On dit que… »', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'waswas', turns: 3, chance: 0.4 }], anim: 'dark' },
        { w: 1, name: 'Colporter', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' }
      ],
      taunts: ['On dit que…', "Je le tiens de quelqu'un qui le tenait de quelqu'un."],
      desc: "Un masque vide qui cherche une bouche. Il ne sait rien : il a entendu. Demande-lui de qui, et il se défait."
    },
    echo: {
      name: 'Écho', art: 'lens', hue: 310, scale: 1, lvl: 6, tier: 'minion',
      weak: ['sidq', 'rahma'], veils: 2,
      skills: [
        { w: 2, name: 'Redire', target: 'ally', fx: [{ st: 'atk', v: 1 }], anim: 'glyph' },
        { w: 2, name: 'Amplifier', target: 'foes', el: 'fer', pow: 0.7, anim: 'burst' },
        { w: 1, name: 'Redire encore', target: 'foe', fx: [{ st: 'recul' }], anim: 'wave' }
      ],
      desc: "Il n'invente rien. Il renvoie, plus fort, ce qu'on lui a confié. C'est par lui qu'une phrase devient une foule."
    },
    or: {
      name: "L'Or", art: 'tower', hue: 45, scale: 2, lvl: 7, tier: 'elite',
      weak: ['rahma', 'sidq'], veils: 4,
      skills: [
        { w: 2, name: 'Thésauriser', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' },
        { w: 3, name: 'Poids du trésor', target: 'foe', el: 'fer', pow: 1.4, anim: 'burst' },
        { w: 2, name: 'Envie', target: 'foes', el: 'fer', pow: 0.7, fx: [{ st: 'atk', v: -1, chance: 0.4 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.5, say: "Compare. Compte ce qu'il a, et ce que tu n'as pas. C'est tout ce que je demande.",
          fx: [{ st: 'atk', v: 1 }] }
      ],
      taunts: ['Et toi, combien as-tu reçu ?'],
      desc: "Chimère des richesses amassées. Les conquêtes firent affluer à Médine plus de biens qu'elle n'en avait jamais vus ; avec eux vinrent la comparaison et l'envie. La Miséricorde, qui donne, et la Véracité, qui rend compte, lui retirent ses voiles."
    },
    rumeur: { racine: 'noir_soupcon',
      name: 'La Rumeur', art: 'lens', hue: 320, scale: 3, lvl: 9, tier: 'boss',
      weak: ['sidq', 'rahma'], immune: ['fer'], veils: 6,
      skills: [
        { w: 3, name: 'Mille bouches', target: 'foes', el: 'fer', pow: 0.8, fx: [{ st: 'doute', turns: 2, chance: 0.3 }], anim: 'burst' },
        { w: 3, name: '« On dit que… »', target: 'foe', el: 'fer', pow: 1.3, fx: [{ st: 'waswas', turns: 3 }], anim: 'dark' },
        { w: 2, name: 'Se contredire', target: 'self', fx: [{ st: 'spd', v: 1 }, { st: 'atk', v: 1 }], anim: 'glyph' },
        { w: 1, name: 'Lettre sans auteur', target: 'foe', el: 'fer', pow: 1.5, fx: [{ st: 'def', v: -1 }], anim: 'dark' }
      ],
      phases: [
        { at: 0.66, say: "On dit qu'il a tout donné aux siens. On dit qu'il n'a rien donné. On dit, on dit — qu'importe quoi, pourvu qu'on dise.",
          fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Reprise en chœur', target: 'foes', el: 'fer', pow: 1.0, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'wave' }] },
        { at: 0.33, say: "Frappe-moi, et je dirai que tu as frappé. Tais-toi, et je dirai que tu avoues. Je n'ai pas besoin d'être vraie : il me suffit d'être redite.",
          fx: [{ st: 'spd', v: 1 }],
          addSkills: [{ w: 3, name: 'Emballement', target: 'foes', el: 'fer', pow: 0.6, hits: 2, anim: 'burst' }] }
      ],
      taunts: ['On dit que…', 'Tout le monde le sait.', "Personne ne l'a vu. Tout le monde le répète."],
      desc: "Idole sans pierre ni trône, faite de bouches. Chacun la nourrit en répétant ce qu'il n'a pas vu ; elle se contredit sans s'affaiblir, car elle ne vit pas d'être crue mais d'être redite. Le fer ne lui fait rien. Seules la Véracité, qui vérifie, et la Miséricorde, qui refuse de la venger par le sang, brisent son emprise."
    }
  },

  /* ────────────────────────────── CODEX ───────────────────────────── */
  codex: [
    { id: 'bio_uthman', cat: 'Biographie', title: "'Uthmân ibn 'Affân",
      text: "'Uthmân ibn 'Affân (qu'Allah l'agrée), du clan des Banû Umayya, compte parmi les premiers à embrasser l'islam, à l'appel d'Abû Bakr. Marchand prospère, il émigra en Abyssinie puis à Médine, et sa fortune servit la communauté sans compter. Désigné par le conseil des six après 'Umar, il fut le troisième calife (23–35 H). Sous son califat, le Coran fut copié en exemplaires de référence et la première flotte prit la mer. Il fut tué chez lui à Médine en 35 H, après avoir interdit qu'on le défende par les armes.",
      src: "Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya wa-n-Nihâya" },
    { id: 'bio_zayd', cat: 'Biographie', title: 'Zayd ibn Thâbit',
      text: "Zayd ibn Thâbit (qu'Allah l'agrée), Ansârî de Médine, avait une dizaine d'années à l'Hégire. Scribe de la Révélation, il apprit sur l'ordre du Messager d'Allah ﷺ l'écriture d'autres peuples pour sa correspondance. Abû Bakr lui confia la réunion du Coran en feuillets — tâche dont il dit qu'elle lui pesa plus qu'une montagne —, puis 'Uthmân la direction des copies envoyées aux provinces. Il mourut à Médine vers 45 H.",
      src: "al-Bukhârî, Sahîh ; Ibn Sa'd, Tabaqât" },
    { id: 'bio_hudhayfa', cat: 'Biographie', title: 'Hudhayfa ibn al-Yamân',
      text: "Hudhayfa ibn al-Yamân (qu'Allah l'agrée) était appelé le gardien du secret : le Messager d'Allah ﷺ lui avait confié les noms des hypocrites, qu'il ne divulgua jamais. Il disait : « Les gens interrogeaient le Messager d'Allah ﷺ sur le bien ; moi, je l'interrogeais sur le mal, de peur qu'il ne m'atteigne. » Gouverneur d'al-Madâ'in sous 'Umar, il reprit le commandement à Nihâwand quand le chef de l'armée tomba. Revenu du front d'Arménie, il alerta 'Uthmân sur les disputes de récitation. Il mourut à al-Madâ'in en 36 H.",
      src: "al-Bukhârî ; Muslim ; Ibn Sa'd, Tabaqât" },
    { id: 'ruma', cat: 'Lieu', title: 'Le puits de Rûma',
      text: "Quand les émigrés arrivèrent à Médine, l'eau douce du puits de Rûma se vendait. 'Uthmân l'acheta de ses propres biens et en fit don à tous : son seau n'y avait pas plus de droit que celui d'un autre. Ce legs, bien antérieur à l'an 11 H, est tenu pour l'une des premières fondations pieuses de l'islam. Assiégé et privé d'eau, il le rappela à ceux qui l'entouraient.",
      src: "al-Bukhârî ; at-Tirmidhî ; an-Nasâ'î" },
    { id: 'mushaf', cat: 'Événement', title: "Les exemplaires de 'Uthmân",
      text: "Vers l'an 25–30 H, 'Uthmân fit copier le Coran d'après les feuillets réunis sous Abû Bakr. Zayd ibn Thâbit dirigea le travail avec trois scribes qurayshites : 'Abdallâh ibn az-Zubayr, Sa'îd ibn al-'Âs et 'Abd ar-Rahmân ibn al-Hârith. Des exemplaires furent envoyés aux grandes garnisons, un autre gardé à Médine, et les copies divergentes retirées. On rapporte la parole de 'Alî : « Il n'a agi, pour les exemplaires, qu'en notre présence à tous. » Le tracé de ces exemplaires est celui que l'on lit encore.",
      src: "al-Bukhârî, Sahîh ; Ibn Abî Dâwûd, Kitâb al-Masâhif" },
    { id: 'flotte', cat: 'Événement', title: 'La première flotte',
      text: "'Umar avait refusé que l'on prît la mer, par souci de la vie des hommes. 'Uthmân l'accorda à Mu'âwiya, gouverneur du Shâm, à une condition : ne désigner personne, ne tirer personne au sort, et n'embarquer que des volontaires. En 28 H, la flotte atteignit Chypre. Les chantiers d'Égypte et du Shâm, avec leurs charpentiers et leurs pilotes, donnèrent à la communauté une marine qu'elle n'avait jamais eue.",
      src: 'at-Tabarî, Târîkh (an 28 H)' },
    { id: 'mats', cat: 'Événement', title: 'Dhât as-Sawârî, la bataille des Mâts',
      text: "En 34 H (655 ; d'autres disent 31 H), au large de la Lycie, la flotte commandée par 'Abdallâh ibn Sa'd rencontra celle de l'empereur Constant II, bien plus nombreuse. On rapporte que les deux camps veillèrent face à face, les uns en prière, les autres au son des cloches ; qu'au matin les navires furent liés bord à bord, et que l'on combattit sur les ponts comme sur la terre ferme. L'empereur échappa de peu. Ce fut la première grande victoire navale des musulmans.",
      src: "at-Tabarî, Târîkh ; Ibn 'Abd al-Hakam, Futûh Misr" },
    { id: 'siege', cat: 'Événement', title: 'Le siège de la maison',
      text: "En 35 H, des groupes venus d'Égypte, de Koufa et de Bassora gagnèrent Médine, portés par des griefs et par des lettres dont l'origine reste disputée. 'Uthmân les reçut et leur répondit ; ils repartirent, puis revinrent et assiégèrent sa maison plusieurs semaines. De jeunes Compagnons gardaient sa porte ; il leur interdit de combattre. Il fut tué le 18 Dhû l-Hijja 35 H, jeûnant, le Livre ouvert devant lui. Les historiens anciens divergent sur bien des détails ; tous s'accordent sur son refus de verser le sang.",
      src: "Ibn Sa'd, Tabaqât ; at-Tabarî, Târîkh ; Ibn Kathîr, al-Bidâya wa-n-Nihâya" },
    { id: 'parole_sang', cat: 'Parole', title: '« Si tu tues un seul homme… »',
      text: "Abû Hurayra raconte être entré chez 'Uthmân assiégé en disant : « L'heure est venue de frapper. » 'Uthmân répondit : « Te plairait-il de tuer tous les gens, et moi avec eux ? Par Allah, si tu tues un seul homme, c'est comme si tu avais tué tous les gens. » Abû Hurayra s'en retourna sans combattre. On rapporte aussi qu'il dit : « Je ne serai pas le premier à succéder au Messager d'Allah ﷺ dans sa communauté en faisant couler le sang. »",
      src: "Ibn Sa'd, Tabaqât ; Ahmad, Musnad" },
    { id: 'nommez', cat: 'Parole', title: '« Nommez-nous vos hommes »',
      text: "« Si un pervers vous apporte une nouvelle, voyez bien clair… » (Coran 49:6, traduction du sens) : le verset fonde une discipline, ne rien transmettre sans avoir vérifié. Après la discorde, rapporte Ibn Sîrîn, on cessa de recevoir une parole sans demander sa chaîne : « Nommez-nous vos hommes. » La science de l'isnâd est la réponse des transmetteurs à la Rumeur : pour chaque parole, qui l'a dite, et qui l'a entendue de lui.",
      src: 'Coran 49:6 ; Muslim, introduction au Sahîh' },
    { id: 'tabayyun', cat: 'Parole', title: "« De qui tiens-tu cela ? »",
      text: "La règle tient en deux questions : de qui tiens-tu cela ? et lui, de qui le tenait-il ? Le Coran commande de voir clair avant d'agir sur une nouvelle (49:6, traduction du sens). Une parole dont on ne peut nommer le porteur n'est pas reçue. Plus tard, Ibn Sîrîn dira : « Cette science est religion : regardez de qui vous prenez votre religion. » La Rumeur vit de ce que personne ne pose la question.",
      src: 'Coran 49:6 ; Muslim, introduction au Sahîh' },
    { id: 'sept_modes', cat: 'Parole', title: 'Les sept modes de récitation',
      text: "On rapporte que 'Umar entendit un jour Hishâm ibn Hakîm réciter une sourate autrement qu'il ne l'avait apprise. Il le mena devant le Messager d'Allah ﷺ, qui les fit réciter l'un après l'autre et approuva chacun : le Coran, leur fut-il dit, a été révélé selon sept modes. Les savants ont longuement discuté le sens précis de ces « modes » ; tous en retiennent la leçon : deux récitations reçues ne s'annulent pas. Ce sont les lecteurs qui se disputent, non les lectures.",
      src: 'al-Bukhârî, Sahîh ; Muslim, Sahîh' },
    { id: 'mosquee_29', cat: 'Lieu', title: 'La mosquée agrandie',
      text: "En 29 H, 'Uthmân fit agrandir et rebâtir la mosquée du Prophète ﷺ à Médine : murs de pierre taillée et de chaux, piliers de pierre, toit de teck. Ibn 'Umar rapporte qu'elle était d'abord de briques crues, de palmes et de troncs de palmier ; qu'Abû Bakr n'y changea rien ; que 'Umar l'agrandit dans les mêmes matériaux ; puis que 'Uthmân la transforma. À ceux qui trouvaient l'ouvrage trop beau, il rappela la promesse d'une demeure auprès d'Allah pour qui Lui bâtit une mosquée.",
      src: 'al-Bukhârî, Sahîh ; Muslim, Sahîh' },
    { id: 'deux_feux', cat: 'Lieu', title: 'Entre deux flottes',
      text: "Au milieu du VIIe siècle, Chypre relève de Constantinople et lui verse l'impôt. Quand la flotte du Shâm paraît en 28 H, ses habitants ne peuvent ni combattre ni changer de maître sans être punis par l'autre. Le pacte que rapportent les chroniqueurs tient compte de cette double contrainte : ils paieraient aux uns autant qu'aux autres, sans prendre parti. Le port et ses anciens, dans ce récit, sont de fiction ; la situation, elle, est rapportée.",
      src: 'al-Balâdhurî, Futûh al-Buldân' },
    { id: 'chypre', cat: 'Événement', title: 'Le pacte de Chypre',
      text: "En 28 H (649), la flotte levée par Mu'âwiya, rejointe par des navires d'Égypte, aborde Chypre. Les récits arabes parlent d'un accord plutôt que d'une conquête : un tribut annuel d'environ sept mille dinars, autant que l'île en versait à Constantinople, ce dont on ne l'empêcherait pas ; la neutralité entre les deux puissances ; et le devoir d'avertir des mouvements de la flotte adverse. Ce fut le premier pacte maritime de la communauté.",
      src: 'al-Balâdhurî, Futûh al-Buldân ; at-Tabarî, Târîkh (an 28 H)' },
    { id: 'griefs', cat: 'Événement', title: 'Grief par grief',
      text: "On rapporte que 'Uthmân reçut les mécontents venus d'Égypte et répondit à chacun de leurs reproches. Sur les pâturages réservés : ils l'étaient pour les chameaux de l'aumône, comme au temps de 'Umar, et s'étaient étendus avec les troupeaux. Sur les exemplaires retirés : le Livre est un, et l'on avait craint la discorde. Ce qui était fondé, il promit de le redresser. Les récits disent qu'ils repartirent satisfaits ; les historiens divergent sur les détails.",
      src: 'at-Tabarî, Târîkh (an 35 H) ; Ibn Kathîr, al-Bidâya wa-n-Nihâya' },
    { id: 'akhbar_n', cat: 'Noosphère', title: 'Abû l-Akhbâr (personnage de fiction)',
      text: "Scribe de garnison et porteur de lettres, inventé pour ce récit : « le père des nouvelles » est un sobriquet. Il ne ment presque jamais. Il arrondit, ajoute un mot, tait une réserve, et dit toujours : « je ne fais que répéter ». Il n'est pas la Rumeur : il en est la petite bouche. Une seule question le désarme : de qui tiens-tu cela ?" },
    { id: 'babel_n', cat: 'Noosphère', title: 'Babel',
      text: "Chimère de la discorde des lectures. Elle naît quand une chose vraie, reçue par plusieurs voies, devient un motif de se préférer à l'autre. Elle se nourrit d'une seule phrase : « Ma lecture vaut mieux que la tienne. » Elle est défaite par le Savoir, qui compare et vérifie, et par la Véracité, qui renonce à avoir raison seule." },
    { id: 'abime_n', cat: 'Noosphère', title: "L'Abîme",
      text: "Chimère de la peur de la mer : l'effroi d'hommes du désert devant une étendue sans piste ni puits. La contrainte l'aurait rendue invincible, car une peur imposée commande. 'Uthmân exigea que nul n'embarque contre son gré : la peur d'un homme libre reste la sienne, et il peut la regarder en face." },
    { id: 'or_n', cat: 'Noosphère', title: "L'Or",
      text: "Chimère des richesses amassées. L'Or ne ment pas : il pèse, et fait pencher les regards. Là où chacun compte ce que l'autre a reçu, il dresse sa tour. Il sert de socle à la Rumeur, qui trouve dans l'envie des bouches toutes prêtes." },
    { id: 'rumeur_n', cat: 'Noosphère', title: 'La Rumeur',
      text: "Idole faite de bouches. Elle dit une chose et son contraire, et n'en est que plus forte : elle ne vit pas d'être crue, mais d'être redite. Nul ne l'a écrite, tous la signent. Le fer ne peut rien contre elle — la frapper, c'est lui donner un récit de plus. 'Uthmân lui refusa la seule chose qu'elle demandait : du sang. Dans la Cité-Miroir, l'Agrégor lui a donné un autre nom : le Flux.",
      // 2.48 (D240) : le texte du Recueil tant que le nom de l'Agrégor n'est pas reçu (ui.js, U.codexEntry). Texte de l'agent, à valider.
      avant: "Idole faite de bouches. Elle dit une chose et son contraire, et n'en est que plus forte : elle ne vit pas d'être crue, mais d'être redite. Nul ne l'a écrite, tous la signent. Le fer ne peut rien contre elle — la frapper, c'est lui donner un récit de plus. 'Uthmân lui refusa la seule chose qu'elle demandait : du sang. Dans la Cité-Miroir, les écrans lui ont donné un autre nom : le Flux." }
  ],

  /* ──────────────────────────── CHAPITRES ─────────────────────────── */
  chapters: [
    /* ═══════ Chapitre 1 — Les Feuillets ═══════ */
    {
      id: 'ut1', title: 'Les Feuillets', sub: "Vers l'an 30 H · 650 · Médine",
      map: 'medine', opts: { time: 'day' }, start: 'maison',
      party: ['uthman'],
      npcs: [
        { id: 'hudhayfa', name: 'Hudhayfa', hero: 'hudhayfa', at: 'porte_nord', hidden: true,
          talk: [['say', 'hudhayfa', "Je n'ai pas dormi depuis l'Azerbaïdjan."]] },
        { id: 'zayd', name: 'Zayd ibn Thâbit', hero: 'zayd', at: 'mosquee_cour',
          talk: [['say', 'zayd', "Les feuillets réunis au temps d'Abû Bakr sont en lieu sûr, à Médine. Pas une ligne n'y fut portée sans deux témoins."]] },
        { id: 'rec_sham', name: 'Un récitateur du Shâm', at: ['souk', -1, 0], look: { kind: 'homme', robe: '#7a6a52', head: '#e3dac6' },
          talk: [['say', 'rec_sham', "J'ai appris à Homs, auprès d'un Compagnon. Je ne mens pas sur ce que j'ai reçu."]] },
        { id: 'rec_irak', name: "Un récitateur d'Irak", at: ['souk', 1, 0], look: { kind: 'homme', robe: '#5d6b58', head: '#d9d2bf' },
          talk: [['say', 'rec_irak', "À Koufa, notre maître récitait ainsi. Lui aussi était un Compagnon."]] },
        { id: 'ibnzubayr', name: "'Abdallâh ibn az-Zubayr", at: ['halle', -1, 0], look: { kind: 'compagnon', robe: '#b8a888', head: '#efe8d8', cloak: '#6a4a3a' },
          talk: [['say', 'ibnzubayr', "Nous sommes trois de Quraysh aux côtés de Zayd. Le calame est taillé."]] },
        { id: 'said', name: "Sa'îd ibn al-'Âs", at: ['halle', 1, 0], look: { kind: 'compagnon', robe: '#a89878', head: '#ece4d2', cloak: '#3f4f6a' },
          talk: [['say', 'said', "Un exemplaire pour chaque grande garnison, et un qui restera à Médine. Tel est l'ordre."]] },
        { id: 'ancien', name: 'Un ancien de Médine', at: ['mosquee_porte', 2, 1], look: { kind: 'ancien', robe: '#8c8272', head: '#f0ece2' },
          talk: [['say', 'ancien', "Il a fait rebâtir la mosquée en pierre taillée, avec un toit de teck. Certains murmurent que c'est trop beau. On murmure beaucoup, ces temps-ci."]] },
        { id: 'marchand', name: 'Un caravanier', at: ['place', 2, 0], look: { kind: 'bedouin', robe: '#9a7b4f', head: '#d6c9ae' },
          talk: [['say', 'marchand', "J'arrive de Fustât. Là-bas, à Koufa, au Shâm : partout on récite. Mais plus personne ne récite tout à fait comme son voisin."]] },
        { id: 'maitre', name: 'Un maître du cercle', at: 'ecole', look: { kind: 'savant', robe: '#e8e2d2', head: '#f4efe2' },
          talk: [
            ['say', 'maitre', "Nous lisions le récit de 'Umar et de Hishâm ibn Hakîm. Chacun récitait à sa façon ; chacun fut approuvé. Sept modes, et pas un qui annule l'autre."],
            ['codex', 'sept_modes'],
            ['say', 'maitre', "Retiens-le pour le souk : deux lectures reçues ne se disputent pas. Ce sont les lecteurs qui se disputent."]
          ] },
        { id: 'akhbar', name: 'Abû l-Akhbâr', at: ['souk', 0, 2], look: { kind: 'marchand', robe: '#6d5f73', head: '#cfc6b4' },
          talk: [['say', 'akhbar', "On m'appelle Abû l-Akhbâr. Je porte les lettres des garnisons, et parfois, dit-on, ce qu'il y a entre les lignes. Je ne fais que répéter."]] }
      ],
      foes: [
        { id: 'f_palm', at: ['palmeraie', 0, 2], group: ['murmure'], bg: 'ville' },
        { id: 'f_noeud', map: 'noos', at: 'noeud2', group: ['variante', 'variante', 'murmure'], bg: 'noos' }
      ],
      chests: [
        { at: ['ecole', 1, 1], gear: 'tablette' },
        { at: ['palmeraie', 1, 0], item: 'dattes', n: 2 },
        { at: ['halle', 2, 1], codex: 'tabayyun' },
        { map: 'noos', at: 'faille', item: 'musc', n: 1 }
      ],
      intro: [
        ['title', 'Les Feuillets', "Vers l'an 30 de l'Hégire · Médine"],
        ['nar', "Médine a changé. Des caravanes arrivent du Shâm, d'Égypte, d'Irak. On y parle dix accents, et le Livre se récite désormais sous des cieux que le Hijâz n'a jamais vus."],
        ['nar', "Au temps d'Abû Bakr, Zayd ibn Thâbit avait réuni la Révélation en feuillets. Ils reposent à Médine. Mais au loin, chaque garnison apprend de son maître — et chacune tient sa récitation pour la meilleure."],
        ['nar', "'Uthmân sort de chez lui. On dit qu'un cavalier approche de la porte nord, couvert de la poussière des frontières."]
      ],
      objectives: [
        { text: "Aller jusqu'à la porte nord, où un cavalier arrive du front", goto: 'porte_nord', then: [
          ['show', 'hudhayfa'],
          ['say', 'hudhayfa', "Commandeur des croyants. Je reviens des marches d'Arménie et d'Azerbaïdjan. J'y ai vu une chose qui m'a ôté le sommeil."],
          ['say', 'uthman', "Parle, Hudhayfa. Tu n'es pas homme à t'alarmer pour peu."],
          ['say', 'hudhayfa', "Les gens du Shâm et ceux d'Irak combattent côte à côte. Le soir, ils se disputent sur la récitation. L'un dit à l'autre : « Ma lecture vaut mieux que la tienne. » Peu s'en faut qu'ils ne se renient."],
          ['quote', "« Ô Commandeur des croyants ! Rattrape cette communauté avant qu'elle ne diverge au sujet du Livre… »", "Hudhayfa ibn al-Yamân à 'Uthmân — al-Bukhârî, Sahîh"],
          ['say', 'uthman', "Viens. Je veux entendre de mes oreilles ce que tu as entendu des tiennes."],
          ['join', 'hudhayfa'], ['hide', 'hudhayfa'], ['codex', 'bio_hudhayfa']
        ] },
        { text: 'Écouter les récitateurs qui se disputent au souk', goto: 'souk', then: [
          ['say', 'rec_sham', "J'ai appris ce verset à Homs, de la bouche d'un Compagnon. C'est ainsi qu'on le récite."],
          ['say', 'rec_irak', "Et moi à Koufa, d'un autre Compagnon. Ma lecture vaut mieux que la tienne."],
          ['say', 'hudhayfa', "Tu les entends. Chacun a reçu du vrai. C'est l'orgueil d'avoir raison qui en fait une arme."],
          ['say', 'akhbar', "Je ne fais que passer, Commandeur des croyants. Je porte les lettres des garnisons. On m'en dit, des choses, entre deux relais…"],
          ['nar', "Derrière chacun des deux hommes, un détachement en permission : la colonne du Gué, rentrée du Shâm, et celle des Deux-Puits, rentrée d'Irak. Garnisons de fiction ; querelle bien réelle."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'Les deux récitateurs', title: 'La querelle du souk',
            intro: "Chacun a reçu du vrai. Chacun craint qu'on lui dise qu'il a mal reçu.",
            goal: 6,
            rounds: [
              { say: "Celui du Shâm : « Il a dit devant mes hommes que ma lecture était fautive. Je l'ai reçue d'un Compagnon ! »",
                opts: [
                  { t: "Demander à chacun de qui il tient sa récitation.", el: 'ilm', v: 2,
                    r: "« D'un Compagnon, à Homs. » — « D'un Compagnon, à Koufa. » Ils se regardent, un peu moins sûrs de se haïr." },
                  { t: "Rappeler le jour où 'Umar et Hishâm se disputèrent ainsi, et furent approuvés tous deux.", el: 'ilm', v: 3, need: 'sept_modes',
                    r: "Un silence. « Tous les deux ? » — « Tous les deux. » La colère cherche où se poser, et ne trouve pas." },
                  { t: "Leur ordonner de se taire : le calife est là.", el: 'shajaa', v: -1,
                    r: "Ils se taisent. Leurs regards, non." }
                ] },
              { say: "Celui d'Irak : « Alors laquelle est la bonne ? Il faut bien que l'une vaille mieux que l'autre. »",
                opts: [
                  { t: "« Aucune ne vaut mieux. C'est de vouloir l'emporter qui est la faute. »", el: 'sidq', v: 2,
                    r: "Il ouvre la bouche pour répondre, et s'aperçoit qu'il n'a rien à répondre." },
                  { t: "« Récitez-moi le verset, l'un après l'autre. J'écouterai avant de dire un mot. »", el: 'sabr', v: 1,
                    r: "Ils récitent. Les deux voix diffèrent d'un souffle, et disent la même chose." },
                  { t: "« Celle de Médine, évidemment. »", el: 'adl', v: -1,
                    r: "Les deux hommes se rembrunissent ensemble : les voilà d'accord, contre toi." }
                ] },
              { say: "Abû l-Akhbâr, à mi-voix : « On dit que ceux du Shâm traitent ceux d'Irak d'ignorants. Je ne fais que répéter… »",
                opts: [
                  { t: "« De qui tiens-tu cela, Abû l-Akhbâr ? Et lui, de qui le tenait-il ? »", el: 'sidq', v: 3, need: 'tabayyun',
                    r: "Il cherche un nom, puis un autre. La chaîne casse au premier maillon ; les deux colonnes l'ont vue casser." },
                  { t: "Se tourner vers les deux hommes : « L'avez-vous entendu vous-mêmes ? »", el: 'sabr', v: 1,
                    r: "« Non. » — « Moi non plus. » La phrase retombe, à moitié." },
                  { t: "« S'ils l'ont dit, ils en répondront. »", el: 'adl', v: -2,
                    r: "Celui d'Irak serre les poings. La phrase vient de trouver une bouche de plus : la tienne." }
                ] },
              { say: "Les deux, presque ensemble : « Et demain, aux frontières, quand nous réciterons côte à côte ? »",
                opts: [
                  { t: "« Demain, vous lirez dans un même tracé. Ceux qui ont écrit sous la dictée y veilleront avec moi. »", el: 'ilm', v: 2,
                    r: "« Un même tracé… » Ils répètent le mot comme on essaie un manteau. Il leur va." },
                  { t: "« Demain, priez épaule contre épaule, comme vous combattez. Le reste suivra. »", el: 'rahma', v: 1,
                    r: "Ils hochent la tête. Ce n'est pas une réponse ; c'est un commencement." },
                  { t: "« Demain, que chaque colonne prie à part : il n'y aura plus de querelle. »", el: 'sabr', v: -1,
                    r: "Ils acquiescent, soulagés. C'est exactement ce que voulait la querelle." }
                ] }
            ],
            win: [
              ['nar', "Les deux récitateurs se taisent, étonnés de leur propre colère. Derrière eux, les hommes du Gué et ceux des Deux-Puits se mêlent pour la première fois depuis la porte de la ville."],
              ['flag', 'ut_garnisons'], ['pillar', 'lien', 1]
            ],
            lose: [
              ['nar', "Autour des deux hommes, l'air se trouble. Dans la noosphère du souk, des lettres se détachent des voix et tournoient — des variantes devenues querelles."],
              ['battle', { group: ['variante', 'murmure'], bg: 'ville', intro: 'La parole a manqué son heure : la querelle prend corps.' }],
              ['nar', "Les glyphes retombent. Les deux récitateurs se taisent enfin ; chaque colonne repart de son côté de la rue."]
            ]
          }],
          ['codex', 'akhbar_n'],
          ['say', 'uthman', "Ce n'est pas eux qu'il faut reprendre. C'est le chemin par lequel la discorde entre. Allons trouver Zayd."]
        ] },
        { text: 'Consulter Zayd ibn Thâbit dans la cour de la mosquée', talk: 'zayd', then: [
          ['nar', "La mosquée vient d'être rebâtie : pierre taillée, piliers de pierre, toit de teck. Certains la trouvent trop belle. L'appel de midi s'élève ; on se range."],
          ['pray', 'dhuhr'],
          ['codex', 'mosquee_29'], ['pillar', 'priere', 1],
          ['mus', 'conseil'],
          ['say', 'zayd', "Commandeur des croyants. On m'a dit ce qui se passe aux frontières."],
          ['say', 'uthman', "Tu as réuni les feuillets au temps d'Abû Bakr. Dis-moi ce que cela t'a coûté."],
          ['quote', "« Par Allah, s'ils m'avaient chargé de déplacer une montagne, cela ne m'aurait pas été plus lourd que ce qu'ils m'ordonnèrent : réunir le Coran. »", 'Zayd ibn Thâbit — al-Bukhârî, Sahîh'],
          ['say', 'uthman', "J'ai consulté les Compagnons du Messager d'Allah ﷺ. Voici le moment de décider."],
          ['choice', "Les récitations divergent de province en province. Que décide 'Uthmân ?", [
            { t: "Réunir des scribes autour de Zayd, copier d'après les feuillets conservés, et envoyer un exemplaire à chaque province.", ok: true, r: [
              ['say', 'zayd', "Alors je reprendrai le calame. Mais pas seul, cette fois."],
              ['say', 'uthman', "Pas seul. 'Abdallâh ibn az-Zubayr, Sa'îd ibn al-'Âs et 'Abd ar-Rahmân ibn al-Hârith t'attendent à la halle."]
            ] },
            { t: 'Laisser chaque province à sa récitation : le temps apaisera les querelles.', r: [
              ['nar', "La chaîne vacille. Hudhayfa a vu ce que fait le temps laissé à lui-même : la querelle durcit. 'Uthmân n'a pas attendu — c'est ce qui est rapporté."]
            ] },
            { t: 'Trancher seul, par décret, sans consulter personne.', r: [
              ['nar', "La chaîne vacille. On rapporte la parole de 'Alî : « Il n'a agi, pour les exemplaires, qu'en notre présence à tous. » 'Uthmân a consulté avant de décider."]
            ] }
          ]],
          ['join', 'zayd'], ['hide', 'zayd'], ['codex', 'bio_zayd'], ['give', 'musc', 1]
        ] },
        { text: 'Rejoindre les scribes réunis à la halle', goto: 'halle', then: [
          ['say', 'ibnzubayr', "Les feuillets sont là, Commandeur des croyants. Nous sommes prêts."],
          ['quote', "« Si vous divergez, vous et Zayd, sur un point du Coran, écrivez-le dans le parler de Quraysh : c'est dans leur langue qu'il est descendu. »", "'Uthmân aux trois scribes qurayshites — al-Bukhârî, Sahîh"],
          ['codex', 'mushaf'],
          ['nar', "Les calames crissent. Mais chaque ligne tracée dérange quelque chose, de l'autre côté. Une nuée s'amasse au-dessus de la halle : toutes les querelles de toutes les garnisons, nouées en une seule tour."],
          ['say', 'hudhayfa', "C'est elle que j'ai vue grandir aux frontières. Elle a un nom ancien."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 275 }],
          ['nar', "La noosphère de Médine. Ici, les voix ont un poids et les mots une forme. Au cœur du réseau, Babel attend."]
        ] },
        { text: 'Dénouer les variantes qui barrent le réseau', foe: 'f_noeud', then: [
          ['say', 'zayd', "Ce sont des lettres justes, arrachées à leur ligne. Remises à leur place, elles se taisent."]
        ] },
        { text: 'Atteindre le cœur, où se dresse Babel', goto: 'coeur', then: [
          ['battle', { group: ['babel'], bg: 'noos', boss: true, intro: "Mille lectures — et pas une qui écoute l'autre.",
            allies: [{ flag: 'ut_garnisons', name: 'Les deux colonnes réconciliées' }] }],
          ['nar', "La tour de voix se défait. Il n'en reste qu'une récitation, portée par plusieurs souffles — diverse dans ses tons, une dans son tracé."],
          ['map', 'medine', 'halle', { time: 'dusk' }],
          ['say', 'zayd', "C'est achevé. Nous avons comparé chaque ligne aux feuillets. Rien n'y manque, rien n'y est ajouté."]
        ] }
      ],
      outro: [
        ['mus', 'espoir'],
        ['nar', "On rapporte que des exemplaires partirent pour Koufa, Bassora et le Shâm ; un autre demeura à Médine. Les copies divergentes furent retirées. De l'Ifrîqiya au Khorâsân, on lirait désormais dans le même tracé."],
        ['pillar', 'savoir', 2],
        ['nar', "On ne bâtit pas une demeure en préférant sa pierre à celle du voisin. Le tracé unique n'ôte rien aux voix : il leur donne le mur où s'adosser."],
        ['quote', "« En vérité, c'est Nous qui avons fait descendre le Rappel, et c'est Nous qui en sommes gardien. »", 'Coran 15:9 — traduction du sens'],
        ['codex', 'babel_n'],
        ['nar', "Idris : une idole peut naître d'une chose vraie. Il suffit que chacun préfère avoir raison plutôt qu'être uni."]
      ]
    },

    /* ═══════ Chapitre 2 — La Bataille des Mâts ═══════ */
    {
      id: 'ut2', title: 'La Bataille des Mâts', sub: 'An 28–34 H · 649–655 · Médine, puis la mer',
      // bataille déclarée : des ponts à tenir ; pas de cavaliers en mer. Aucun effectif n'est donné.
      bataille: { base: 2, rangs: [{ t: 'fantassins', name: 'Hommes du pont', voie: 'centre' }, { t: 'archers', name: 'Archers du bord', voie: 'sud' }, { t: 'fantassins', name: 'Hommes de la passerelle', voie: 'nord' }] },
      map: 'medine', opts: { time: 'day' }, start: 'maison',
      party: ['uthman', 'zayd', 'hudhayfa'],
      npcs: [
        { id: 'emissaire', name: 'Émissaire du Shâm', at: 'mosquee_porte', look: { kind: 'soldat', robe: '#6b5a48', head: '#d8cfc0', cloak: '#7a2f2a' },
          talk: [['say', 'emissaire', "J'attends la réponse du Commandeur des croyants. Mon maître m'a dit de ne pas revenir sans elle."]] },
        { id: 'ancien2', name: 'Un vétéran', at: ['place', 1, 1], look: { kind: 'ancien', robe: '#8c8272', head: '#f0ece2' },
          talk: [
            ['say', 'ancien2', "'Umar avait demandé à 'Amr ibn al-'Âs de lui décrire la mer. Je me souviens de la réponse : elle a fait le tour de Médine."],
            ['quote', "« J'ai vu une créature immense que montent de petites créatures… Ils y sont comme des vers sur un bout de bois : s'il penche, ils se noient ; s'ils en réchappent, ils en restent éblouis. »", "On rapporte — 'Amr ibn al-'Âs à 'Umar, at-Tabarî, Târîkh"]
          ] },
        { id: 'maitre', name: 'Un maître du cercle', at: 'ecole', look: { kind: 'savant', robe: '#e8e2d2', head: '#f4efe2' },
          talk: [
            ['say', 'maitre', "La leçon du jour tient en une question : « De qui tiens-tu cela ? » Puis une seconde : « Et lui, de qui le tenait-il ? » Une nouvelle dont on ne peut nommer le porteur, on ne la reçoit pas."],
            ['codex', 'tabayyun'],
            ['say', 'maitre', "Le Livre le commande : si l'on vous apporte une nouvelle, voyez clair avant d'agir."]
          ] },
        { id: 'akhbar', name: 'Abû l-Akhbâr', at: ['place', -1, 1], look: { kind: 'marchand', robe: '#6d5f73', head: '#cfc6b4' },
          talk: [
            ['say', 'akhbar', "On dit, Commandeur des croyants — je ne fais que répéter — que la flotte se remplira de force, quoi qu'on promette."],
            ['ask', 'Que lui répondre ?', [
              { t: "« Qui le dit ? Nomme-le-moi. »", need: 'tabayyun', r: [
                ['say', 'akhbar', "Des gens. Des gens sûrs… Pardonne-moi, on m'attend au relais."] ] },
              { t: 'Ne rien répondre.', r: [
                ['nar', "Il sourit et s'éloigne. Une phrase qu'on ne relève pas est une phrase qui voyage."] ] }
            ]]
          ] },
        { id: 'ancien_ile', name: 'Un ancien du port', map: 'navire', at: 'mat', look: { kind: 'ancien', robe: '#5f6f7a', head: '#d8d2c4' },
          talk: [['say', 'ancien_ile', "Je parle pour un port de pêcheurs. C'est peu, mais c'est tout ce que j'ai à défendre."]] },
        { id: 'pretre', name: 'Un prêtre du port', map: 'navire', at: ['pont', 1, -1], look: { kind: 'moine', robe: '#3d3a44', head: '#3d3a44' },
          talk: [
            ['say', 'pretre', "Je ne suis venu ni vous maudire ni vous bénir. Je suis venu parce que ce port est le mien."],
            ['say', 'pretre', "Sache ce que nous sommes : un village entre deux feux. Nous versons déjà l'impôt à Constantinople. Cessons, et sa flotte nous punira ; refusons-vous, et ce sera la vôtre."],
            ['codex', 'deux_feux']
          ] },
        { id: 'ibnsad', name: "'Abdallâh ibn Sa'd", map: 'navire', at: 'mat', hidden: true, look: { kind: 'marin', robe: '#4d6470', head: '#e6dfd0', cloak: '#26404d' },
          talk: [['say', 'ibnsad', "Tenez les chaînes prêtes. Quand le vent tombera, nous ferons de ces coques une seule terre."]] },
        { id: 'vigie', name: 'Une vigie', map: 'navire', at: 'proue', hidden: true, look: { kind: 'marin', robe: '#5a6a5f', head: '#d9d2bf' },
          talk: [['say', 'vigie', "Leurs voiles couvrent l'horizon du nord. Leurs pilotes lisent les étoiles et les courants depuis des siècles. Ne les crois pas faibles parce qu'ils sont en face."]] },
        { id: 'charpentier', name: "Un charpentier d'Alexandrie", map: 'navire', at: ['pont', -1, 1], look: { kind: 'marin', robe: '#7d6a4d', head: '#cfc4ab' },
          talk: [['say', 'charpentier', "Chez nous, on construit des coques depuis toujours. Ces gens du désert apprennent vite : ils écoutent quand on leur parle du vent."]] },
        { id: 'volontaire', name: 'Un volontaire', map: 'navire', at: ['poupe', 1, 1], look: { kind: 'soldat', robe: '#6f6250', head: '#ddd4c0' },
          talk: [['say', 'volontaire', "On a demandé qui voulait partir. J'ai levé la main. Mon voisin ne l'a pas levée ; personne ne lui a rien reproché."]] }
      ],
      foes: [
        { id: 'f_large', map: 'noos', at: 'noeud1', group: ['ecume', 'ecume', 'ecume'], bg: 'mer' },
        { id: 'f_faille2', map: 'noos', at: 'faille', group: ['ecume', 'variante'], bg: 'mer' }
      ],
      chests: [
        { map: 'navire', at: ['mat', 1, 1], gear: 'dague' },
        { at: ['souk', 1, 0], item: 'pain', n: 1 },
        { map: 'navire', at: ['pont', 2, 0], item: 'eau', n: 1 },
        { map: 'noos', at: 'miroir', item: 'siwak', n: 1 }
      ],
      intro: [
        ['title', 'La Bataille des Mâts', "An 34 de l'Hégire · Dhât as-Sawârî"],
        ['nar', "Les Arabes sont gens de pistes et de puits. La mer, ils la regardent depuis le rivage du Shâm — et de la mer viennent, chaque saison, les flottes de Constantinople."],
        ['nar', "Mu'âwiya, gouverneur du Shâm, avait demandé à 'Umar la permission de prendre la mer. 'Umar avait refusé : il ne risquerait pas un seul homme sur cette étendue sans rivage."],
        ['nar', "An 28. La demande revient, cette fois devant 'Uthmân. Un émissaire du Shâm attend à la porte de la mosquée."]
      ],
      objectives: [
        { text: "Recevoir l'émissaire du Shâm à la porte de la mosquée", talk: 'emissaire', then: [
          ['say', 'emissaire', "Commandeur des croyants, le gouverneur du Shâm te salue. Les îles sont si proches de nos côtes qu'on y entend, dit-il, aboyer leurs chiens. Tant que la mer leur appartient, aucun port n'est sûr."],
          ['say', 'uthman', "'Umar a refusé cela, et il avait ses raisons : la vie d'un croyant lui pesait plus que toutes les îles."],
          ['say', 'zayd', "Les raisons de 'Umar n'ont pas disparu. Les flottes non plus."],
          ['choice', "Mu'âwiya demande à lever une flotte. Que répond 'Uthmân ?", [
            { t: 'Accorder — à condition de ne contraindre personne : seuls embarqueront ceux qui le choisissent.', ok: true, r: [
              ['say', 'emissaire', "Je porterai ta condition mot pour mot."]
            ] },
            { t: "Refuser, comme 'Umar avant lui : la mer n'est pas faite pour des gens du désert.", r: [
              ['nar', "La chaîne vacille. 'Umar a refusé en son temps ; 'Uthmân, lui, a accordé — c'est ce que rapporte at-Tabarî. Mais il y a mis une condition que tu n'as pas encore trouvée."]
            ] },
            { t: 'Accorder, et faire tirer au sort dans chaque garnison ceux qui embarqueront.', r: [
              ['nar', "La chaîne vacille. C'est précisément ce qu'il a interdit : ni désignation, ni tirage au sort. On ne jette pas un homme à la mer contre son gré."]
            ] }
          ]],
          ['quote', "« Ne choisis personne et ne tire personne au sort. Laisse-leur le choix : celui qui choisit de partir de son plein gré, transporte-le et aide-le. »", "On rapporte — 'Uthmân à Mu'âwiya, at-Tabarî, Târîkh (an 28 H)"],
          ['codex', 'flotte'], ['pillar', 'justice', 1],
          ['nar', "Cette année-là, la flotte quitte les ports du Shâm. Sa première escale n'est pas une bataille : c'est une île, si proche qu'on y entend, disait l'émissaire, aboyer les chiens."],
          ['map', 'navire', 'poupe', { time: 'dusk' }], ['mus', 'mer'],
          ['nar', "An 28, devant Chypre. 'Uthmân n'a pas embarqué : il est à Médine, et ses compagnons aussi. Mais sa consigne voyage avec ceux qu'il envoie, et c'est elle que tu portes sur ce pont, tel que les marins l'ont raconté."],
          ['nar', "Une barque se détache du rivage. Des anciens du port montent à bord, sans armes : ils viennent voir si l'on peut parler à cette flotte avant qu'elle ne parle la première."]
        ] },
        { text: 'Recevoir les anciens du port, montés à bord (au pied du mât)', talk: 'ancien_ile', then: [
          ['say', 'ancien_ile', "Je parle pour le port, pas pour l'île, et encore moins pour l'empereur. Dis-moi à qui je parle : à une flotte, ou à des hommes ?"],
          ['say', 'Un officier de la flotte', "À des hommes à qui le calife a ordonné de préférer un pacte à une prise."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'ancien_ile', title: 'Les anciens du port',
            intro: "Ils craignent deux flottes : celle qui vient d'entrer dans la baie, et celle qui reviendra les punir d'avoir traité.",
            goal: 6,
            rounds: [
              { say: "« Vos voiles sont entrées dans notre baie sans rien demander. Que veut-on à des pêcheurs ? »",
                opts: [
                  { t: "« La vérité d'abord : nous ne voulons pas votre île. Nous voulons que cette mer cesse d'être une arme contre nos côtes. »", el: 'sidq', v: 2,
                    r: "« Au moins tu ne prétends pas être venu pour notre bien. Continue. »" },
                  { t: "« Rien que vous n'ayez consenti. C'est la consigne de celui qui nous envoie. »", el: 'rahma', v: 1,
                    r: "« Consenti… devant deux cents coques. Mais je retiens le mot. »" },
                  { t: "« Vos barques, vos greniers et vos pilotes. Tout de suite. »", el: 'shajaa', v: -2,
                    r: "Il se lève à demi. « Alors prenez-les. On n'a pas besoin de ma parole pour cela. »" }
                ] },
              { say: "« Si nous traitons avec vous, Constantinople nous le fera payer. Si nous refusons, ce sera vous. »",
                noir: { name: "La Peur", group: ['noir_peur'], intro: "Ils craignent deux flottes : celle qui est entrée dans la baie, et celle qui reviendra les punir d'avoir traité. Entre les deux, c'est la peur qui parle pour eux.", after: "Bien. Nous avons peur, voilà qui est dit. Parlons maintenant de ce que tu offres." },
                opts: [
                  { t: "« Versez-nous ce que vous leur versez, pas davantage. Et continuez de leur verser : nous ne vous l'interdirons pas. »", el: 'adl', v: 3, need: 'deux_feux',
                    r: "Il te regarde longtemps. « Tu sais donc ce que c'est, vivre entre deux feux. »" },
                  { t: "« Je ne peux pas vous promettre leur clémence. Seulement la nôtre — et par écrit. »", el: 'sidq', v: 2,
                    r: "« Un écrit. Soit. Les écrits durent plus que les flottes. »" },
                  { t: "« Nous vous protégerons d'eux, quoi qu'il arrive. »", el: 'shajaa', v: -1,
                    r: "« Avec quoi ? Vous repartirez à la belle saison. Eux restent à trois jours de voile. »" }
                ] },
              { say: "« Et nos fils ? On dit que les flottes prennent leurs rameurs où elles les trouvent. »",
                opts: [
                  { t: "« Chez nous, nul n'a embarqué de force : ni désigné, ni tiré au sort. Nous ne ferons pas aux vôtres ce que nous refusons aux nôtres. »", el: 'adl', v: 2,
                    r: "« Si c'est vrai, c'est la première flotte de cette sorte que je vois. »" },
                  { t: "« Demande-le aux volontaires eux-mêmes : ils sont sur ce pont. »", el: 'sidq', v: 1,
                    r: "Il hèle un rameur. L'homme répond sans regarder ses chefs. L'ancien hoche la tête." },
                  { t: "« Quelques rameurs seulement, et bien payés. »", el: 'rahma', v: -1,
                    r: "« Voilà. On commence toujours par “quelques”. »" }
                ] },
              { say: "« Que voulez-vous de nous, à la fin, que nous puissions donner sans nous perdre ? »",
                opts: [
                  { t: "« Votre neutralité : n'aider personne contre nous, et nous avertir quand leur flotte appareille. »", el: 'adl', v: 2,
                    r: "« Avertir n'est pas combattre. Cela, un pêcheur peut le jurer. »" },
                  { t: "« Vos pilotes, s'ils y consentent, pour nous apprendre ces eaux. »", el: 'ilm', v: 1,
                    r: "« Apprendre la mer à des gens du sable… Ils en riront. Puis ils le feront : je les connais. »" },
                  { t: "« Que vous combattiez à nos côtés. »", el: 'shajaa', v: -2,
                    r: "« Contre ceux dont nous partageons les autels ? Tu demandes ce qu'un homme ne donne pas. »" }
                ] }
            ],
            win: [
              ['nar', "L'accord tient en peu de mots : un tribut égal à celui qu'ils versent déjà, la neutralité, et un avertissement quand l'autre flotte appareille. On l'écrit ; les anciens y posent le doigt."],
              ['nar', "En redescendant dans sa barque, l'ancien se retourne : trois pilotes du port resteront quelques saisons, pour apprendre ces eaux à qui veut les apprendre."],
              ['flag', 'ut_pilotes'], ['pillar', 'lien', 1]
            ],
            lose: [
              ['nar', "Le pacte se fera — les récits le rapportent — mais ce port-ci n'y mettra que sa peur. Les anciens signent sans lever les yeux, et redescendent sans un mot."],
              ['pillar', 'lien', -1],
              ['nar', "Cette nuit-là, la crainte de l'île passe d'un bord à l'autre : à quoi bon une mer où l'on n'a que des vaincus pour voisins ?"],
              ['battle', { group: ['ecume', 'murmure'], bg: 'mer', intro: "La peur de l'île a pris le large avec vous." }]
            ]
          }],
          ['hide', 'ancien_ile'], ['hide', 'pretre'], ['codex', 'chypre'],
          ['nar', "Un pacte est un puits creusé entre deux campements : chacun y descend son seau, et nul n'a besoin d'aimer l'autre pour y boire."],
          ['nar', "Six ans passent. Dans les chantiers d'Égypte et du Shâm, des cavaliers apprennent à tenir debout sur un pont."],
          ['nar', "An 34. L'empereur Constant arme cinq cents voiles pour reprendre la mer. 'Abdallâh ibn Sa'd, gouverneur d'Égypte, sort à sa rencontre au large de la Lycie."],
          ['map', 'navire', 'poupe', { time: 'dawn' }], 
          ['show', 'ibnsad'], ['show', 'vigie'],
          ['nar', "Dans la noosphère de la flotte, la décision du calife a un poids : nul n'est ici contre son gré. Rejoins l'amiral au pied du mât."]
        ] },
        { text: "Rejoindre l'amiral au pied du mât", talk: 'ibnsad', then: [
          ['say', 'ibnsad', "Deux cents coques, et la moitié de mes hommes n'avaient jamais vu la mer avant de s'engager. En face : l'empereur en personne, et des marins dont les pères naviguaient déjà."],
          ['ask', "Que demander au récit de l'amiral ?", [
            { t: 'Combien sont-ils ?', r: [
              ['say', 'ibnsad', "Cinq cents voiles, disent les vigies. Peut-être six cents. On n'a jamais vu pareil rassemblement sur cette mer."]
            ] },
            { t: 'Pourquoi ne pas combattre à terre ?', r: [
              ['say', 'ibnsad', "Nous leur avons laissé le choix : le rivage ou le large. Ils ont choisi le large. C'est leur royaume ; je ne leur en veux pas de le préférer."]
            ] },
            { t: 'Que craignent les hommes ?', r: [
              ['say', 'ibnsad', "Pas l'adversaire. Le vide sous les planches. Un cavalier sait tomber de cheval ; il ne sait pas tomber dans ce qui n'a pas de fond."]
            ] }
          ]],
          ['say', 'ibnsad', "Ils ont passé la nuit au son de leurs cloches ; nous, en prière. Au matin, nous lierons les navires bord à bord. Si mes hommes sont des gens de terre, je leur donnerai un sol."],
          ['nar', "Avant que le jour ne se lève sur les deux flottes, les rangs se forment sur les ponts, serrés comme le seront bientôt les coques."],
          ['pray', 'fajr'],
          ['nar', "Dans la noosphère, la peur n'attend pas le matin. Elle monte par les dalots, blanche et froide, et se rassemble près de la passerelle."]
        ] },
        { text: "Aller jusqu'à la passerelle, où l'effroi se rassemble", goto: 'passerelle', then: [
          ['say', 'Un jeune rameur', "Je ne sens plus mes mains. Personne ne m'a forcé à venir. Alors pourquoi ai-je si peur ?"],
          ['nar', "La réponse ne vient d'aucune bouche. Elle est dans l'ordre du calife : le rameur est venu libre. Sa peur lui appartient ; il peut la regarder en face."],
          ['battle', { group: ['ecume', 'ecume'], bg: 'mer', intro: "L'effroi gagne les ponts." }],
          ['sfx', 'roll'],
          ['nar', "L'écume retombe. Le jeune homme reprend sa rame. On jette les chaînes d'un bord à l'autre ; les coques se serrent, flanc contre flanc."]
        ] },
        { text: 'Franchir la passerelle jusqu’au second navire', goto: 'pont2', then: [
          ['nar', "On rapporte que l'on se battit ce jour-là sur les ponts comme sur la terre ferme, et que la mer changea de couleur. Les marins de l'empereur tinrent longtemps : c'étaient des hommes braves, et la mer était à eux."],
          ['nar', "Les chroniqueurs n'en disent guère plus, et la Chaîne ne montre pas ce qu'ils taisent. Mais sous les coques, autre chose se bat : la somme de toutes les peurs tombées à l'eau."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 205 }],
          ['nar', "La noosphère du large. Ni sol ni horizon : seulement des nœuds de lumière jetés sur le vide, comme des navires enchaînés."]
        ] },
        { text: "Tenir le premier nœud contre l'écume", foe: 'f_large', then: [
          ['say', 'hudhayfa', "Elles ne frappent pas pour blesser. Elles frappent pour qu'on lâche. Ne lâchons pas."]
        ] },
        { text: "Descendre au cœur, face à l'Abîme", goto: 'coeur', then: [
          ['battle', { group: ['abime'], bg: 'mer', boss: true, intro: 'Sous les coques, quelque chose ouvre les bras.',
            allies: [{ flag: 'ut_pilotes', name: 'Les pilotes du port', rang: 'gens' }] }],
          ['nar', "L'Abîme se referme. Là-haut, au même instant, la ligne de l'empereur se rompt. Constant échappe de peu ; sa flotte se disperse vers le nord."],
          ['map', 'navire', 'proue', { time: 'day' }],
          ['say', 'ibnsad', "C'est fini. Qu'on dise au Commandeur des croyants que pas un de ces hommes n'a été traîné ici. C'est pour cela qu'ils ont tenu."]
        ] }
      ],
      outro: [
        ['codex', 'mats'], ['codex', 'abime_n'],
        ['nar', "À Médine, la nouvelle arrive des semaines plus tard : la Méditerranée n'est plus une mer fermée."],
        // 2.48 (D240) : ce maillon peut se jouer avant que le nom de l'Agrégor soit reçu (étape III, dans l'ordre où l'on joue
        // les rencontres) ; jusque-là, « ce qui règne là-haut » (D214). Texte de l'agent, à valider.
        ['if', '_2084_agregor', [
          ['nar', "Idris : la contrainte fabrique des idoles de peur. Un homme libre a peur aussi — mais sa peur ne commande pas. Souviens-t'en devant l'Agrégor, qui ne force personne et tient tout le monde."]
        ], [
          ['nar', "Idris : la contrainte fabrique des idoles de peur. Un homme libre a peur aussi — mais sa peur ne commande pas. Souviens-t'en devant ce qui règne là-haut, qui ne force personne et tient tout le monde."]
        ]]
      ]
    },

    /* ═══════ Chapitre 3 — La Maison assiégée ═══════ */
    {
      id: 'ut3', title: 'La Maison assiégée', sub: 'An 35 H · 656 · Médine',
      // bataille déclarée, sans rangs : il a interdit qu'on se batte pour lui
      bataille: { rangs: [], mot: 'Il a interdit qu’on se batte pour lui : il n’y a pas de rangs à mener ici.' },
      map: 'medine', opts: { time: 'dusk' }, start: 'mosquee_porte',
      party: ['uthman', 'zayd'],
      npcs: [
        { id: 'colp1', name: 'Un colporteur', at: ['souk', -1, 0], look: { kind: 'homme', robe: '#7a6a52', head: '#d6ccb6' },
          talk: [['say', 'colp1', "Je ne fais que répéter ce qu'on m'a dit. Si c'était faux, on ne le dirait pas autant."]] },
        { id: 'colp2', name: 'Un autre colporteur', at: ['souk', 1, 0], look: { kind: 'homme', robe: '#5f5a6a', head: '#d9d2c4' },
          talk: [['say', 'colp2', "Moi, je n'ai rien vu. Mais je connais quelqu'un qui connaît quelqu'un."]] },
        { id: 'insurge', name: "Un homme venu d'Égypte", at: 'porte_sud', look: { kind: 'soldat', robe: '#6a5b45', head: '#cdbfa6', cloak: '#4a4032' },
          talk: [['say', 'insurge', "J'ai marché des semaines. Je ne voulais de mal à personne. Je voulais qu'on m'écoute."]] },
        { id: 'hasan', name: "Al-Hasan ibn 'Alî", at: ['maison', -1, 1], look: { kind: 'compagnon', robe: '#e2dccb', head: '#f3eee0', cloak: '#2d5a44' },
          talk: [['say', 'hasan', "Mon frère al-Husayn tient l'autre côté de la porte. Nul n'entrera tant que nous y serons."]] },
        { id: 'ibnzubayr3', name: "'Abdallâh ibn az-Zubayr", at: ['maison', 1, 1], look: { kind: 'compagnon', robe: '#b8a888', head: '#efe8d8', cloak: '#6a4a3a' },
          talk: [['say', 'ibnzubayr3', "J'ai copié le Livre sous ses ordres. Je ne le laisserai pas seul."]] },
        { id: 'abuhurayra', name: 'Abû Hurayra', at: ['maison', 2, 0], look: { kind: 'compagnon', robe: '#a59a84', head: '#ebe4d4', cloak: '#5a5046' },
          talk: [['say', 'abuhurayra', "Je suis venu l'épée au côté. Il m'a regardé comme on regarde un fils qui se trompe."]] },
        { id: 'affranchi', name: 'Un affranchi', at: ['maison', -2, 0], hidden: true, look: { kind: 'homme', robe: '#8a7c66', head: '#d2c7b0' },
          talk: [['say', 'affranchi', "Ce matin, il nous a rendus libres. Vingt d'entre nous. Puis il a demandé qu'on lui apporte le Livre."]] },
        { id: 'ancien3', name: 'Un ancien de Médine', at: ['puits', 1, 0], look: { kind: 'ancien', robe: '#8c8272', head: '#f0ece2' },
          talk: [['say', 'ancien3', "Ce puits me rappelle Rûma. On vendait son eau, autrefois. Il l'a acheté et nous l'a donné. Je n'ai jamais payé une gorgée."]] },
        { id: 'maitre', name: 'Un maître du cercle', at: 'ecole', look: { kind: 'savant', robe: '#e8e2d2', head: '#f4efe2' },
          talk: [
            ['say', 'maitre', "On vient au cercle me demander si les lettres disent vrai. Je réponds par deux questions : de qui tiens-tu cela ? et lui, de qui le tenait-il ?"],
            ['codex', 'tabayyun'],
            ['say', 'maitre', "Personne, ces jours-ci, n'a su me répondre jusqu'au second nom."]
          ] },
        { id: 'akhbar', name: 'Abû l-Akhbâr', at: ['place', -1, 1], hidden: true, look: { kind: 'marchand', robe: '#6d5f73', head: '#cfc6b4' },
          talk: [['say', 'akhbar', "Je ne fais que lire ce qui est écrit, Commandeur des croyants."]] }
      ],
      foes: [
        { id: 'f_or', map: 'noos', at: 'noeud2', group: ['or'], bg: 'noos' },
        { id: 'f_faille3', map: 'noos', at: 'faille', group: ['echo', 'ouidire', 'ouidire'], bg: 'noos' }
      ],
      chests: [
        { at: ['maison', 1, 1], gear: 'manteau_raye' },
        { at: 'colline', item: 'miel', n: 1 },
        { at: ['palmeraie', 1, 0], item: 'eau', n: 1 },
        { at: ['porte_sud', -2, -1], codex: 'griefs' },
        { map: 'noos', at: 'miroir', item: 'lait', n: 1 }
      ],
      intro: [
        ['title', 'La Maison assiégée', "An 35 de l'Hégire · Médine"],
        ['nar', "Douze ans de califat. Les trésors ont afflué, et avec eux les comparaisons. Dans les garnisons d'Égypte et d'Irak, des griefs circulent — certains fondés, d'autres grossis de bouche en bouche."],
        ['nar', "Des lettres passent de main en main. Nul ne sait dire qui les a écrites. Des hommes venus de Fustât, de Koufa et de Bassora campent maintenant aux portes de Médine."],
        ['nar', "Ce soir encore, il dirige la prière du couchant dans la mosquée qu'il a rebâtie. Bientôt, on l'en empêchera."],
        ['pray', 'maghrib'],
        ['nar', "'Uthmân a plus de quatre-vingts ans. Il sort de la mosquée avec Zayd. Du souk monte une rumeur — au sens propre."]
      ],
      objectives: [
        { text: "Aller jusqu'au souk, où l'on colporte des lettres", goto: 'souk', then: [
          ['say', 'colp1', "On dit qu'il a tout donné aux siens. Je le tiens d'un homme sûr, qui le tenait d'un autre."],
          ['say', 'colp2', "Et moi, on m'a dit qu'il n'a rien donné à personne. C'est encore pire."],
          ['say', 'zayd', "Ils disent le contraire l'un de l'autre, et ils sont d'accord."],
          ['quote', "« Ô vous qui avez cru ! Si un pervers vous apporte une nouvelle, voyez bien clair, de crainte que par inadvertance vous ne portiez atteinte à des gens et que vous ne regrettiez ensuite ce que vous avez fait. »", 'Coran 49:6 — traduction du sens'],
          ['nar', "Dans la noosphère du souk, chaque « on dit » laisse une trace : un masque vide qui cherche une bouche. Ils sont déjà des dizaines."],
          ['battle', { group: ['ouidire', 'echo'], bg: 'ville', intro: 'On dit que… on dit que… on dit que…' }],
          ['nar', "Deux masques tombent. Dix autres se relèvent plus loin. On ne vide pas une rumeur comme un puits : elle se remplit par le haut."]
        ] },
        { text: "Écouter un homme venu d'Égypte, à la porte sud", talk: 'insurge', then: [
          ['say', 'insurge', "On nous a lu des lettres, dans les mosquées de Fustât. Elles disaient tes gouverneurs injustes. Nous avons marché jusqu'ici pour te le dire en face."],
          ['say', 'uthman', "Alors asseyez-vous, et dites-moi chaque grief. Ce qui est fondé, je le redresserai ; ce qui ne l'est pas, vous l'entendrez de ma bouche."],
          ['mus', 'conseil'],
          ['parley', {
            with: 'insurge', title: "Les griefs des gens d'Égypte",
            intro: "Ils ont marché des semaines. Ils veulent être entendus plus encore qu'avoir raison.",
            goal: 7,
            rounds: [
              { say: "« On nous a lu des lettres, à Fustât. Elles disaient tout ce que tu as fait de travers. Nous voici. »",
                opts: [
                  { t: "« Asseyez-vous. Dites chaque grief ; je répondrai à chacun, devant tous. »", el: 'adl', v: 2,
                    r: "Il s'assoit. Derrière lui, d'autres s'assoient. C'est déjà un peu moins une foule." },
                  { t: "« Ces lettres : qui les a écrites ? Qui les a portées ? Commençons par là, ensemble. »", el: 'sidq', v: 3, need: 'tabayyun',
                    r: "Il ouvre la bouche, la referme. « On nous les a lues. Je n'ai pas demandé de qui. »" },
                  { t: "« Des lettres sans auteur ne méritent pas de réponse. »", el: 'shajaa', v: -1,
                    r: "« Et nos semaines de marche ? Elles non plus ? »" }
                ] },
              { say: "« Tu as fait retirer et brûler des exemplaires du Livre. »",
                opts: [
                  { t: "« Les copies ont été faites d'après les feuillets d'Abû Bakr, devant les Compagnons assemblés. Rien ne s'est fait à l'écart. »", el: 'ilm', v: 3, need: 'mushaf',
                    r: "« En présence de tous… Cela, on ne nous l'avait pas lu. »" },
                  { t: "« J'ai craint que vous ne vous déchiriez sur le Livre. Tu as vu ces disputes aux frontières : dis-moi si j'ai eu tort de les craindre. »", el: 'sidq', v: 2,
                    r: "Il baisse les yeux. Il les a vues." },
                  { t: "« Cela ne regarde que le calife. »", el: 'shajaa', v: -2,
                    r: "Un murmure court dans les rangs. Il n'attendait que cette phrase." }
                ] },
              { say: "« Tu as réservé des pâturages, et confié des charges aux tiens. »",
                opts: [
                  { t: "« Le pâturage est réservé aux chameaux de l'aumône, comme au temps de 'Umar ; les troupeaux ont grandi, je l'ai étendu. Envoyez qui vous voudrez le vérifier. »", el: 'adl', v: 3, need: 'griefs',
                    r: "« Vérifier… Tu nous laisserais vérifier ? » Le mot passe de rang en rang." },
                  { t: "« Ce qui est fondé dans vos griefs, je le redresserai. Et j'en demande pardon à Allah devant vous. »", el: 'rahma', v: 2,
                    r: "Quelqu'un, au fond, se détourne pour s'essuyer les yeux. On n'était pas venu entendre cela." },
                  { t: "« Tout cela est mensonge. »", el: 'shajaa', v: -1,
                    r: "« Tout ? Alors tu ne nous as pas écoutés. »" }
                ] },
              { say: "« Et si nous repartons, qui nous dit que rien ne sera oublié à la première étape ? »",
                opts: [
                  { t: "« Un écrit que vous emporterez, et des témoins que vous choisirez vous-mêmes. »", el: 'adl', v: 2,
                    r: "« Des témoins de notre choix. Soit. »" },
                  { t: "« Restez mes hôtes aussi longtemps qu'il faudra pour le voir de vos yeux. »", el: 'rahma', v: 1,
                    r: "« Tes hôtes… Nous avons des champs qui attendent. Mais nous nous en souviendrons. »" },
                  { t: "« Ma parole suffit. »", el: 'sidq', v: 0,
                    r: "« Elle nous suffisait, autrefois. Avant les lettres. »" }
                ] }
            ],
            win: [
              ['nar', "Grief après grief, la colère se défait comme un nœud qu'on prend la peine de suivre des doigts. Au soir, l'homme d'Égypte se lève : « Nous étions venus crier. Tu nous as fait parler. »"],
              ['flag', 'ut_egyptien'], ['pillar', 'justice', 1]
            ],
            lose: [
              ['nar', "Les réponses sont venues, mais pas dans l'ordre où il fallait les entendre. L'homme d'Égypte se lève sans colère et sans paix : « Nous partirons. Je ne dis pas que nous avons été entendus. »"],
              ['pillar', 'lien', -1],
              ['nar', "Dans la noosphère de la porte sud, ce qui n'a pas été écouté jusqu'au bout se met à parler tout seul."],
              ['battle', { group: ['ouidire', 'ouidire'], bg: 'ville', intro: "Un grief mal entendu cherche d'autres oreilles." }]
            ]
          }],
          ['nar', "Les récits le rapportent : ils levèrent le camp et reprirent la route de l'Égypte. Médine respira, le temps de quelques étapes."],
          ['nar', "Il faut une saison pour nouer un lien, et une phrase pour le défaire. Celui qui garde les hommes veille d'abord sur ce qu'ils se disent."],
          ['mus', 'deuil'],
          ['nar', "Puis, sur la route, une lettre les rattrapa, scellée — écrite par une main qu'on ne nomma jamais. Ils firent demi-tour. Ce que la parole avait noué en un jour, un feuillet le défit en une heure."],
          ['if', 'ut_egyptien', [
            ['say', 'insurge', "J'ai demandé qui l'avait écrite. On m'a répondu : tout le monde le sait. Je suis revenu avec les autres — mais je n'irai pas plus loin que cette porte."]
          ], [
            ['say', 'insurge', "Je ne sais pas qui a écrit cela. Mais tout le monde le répète. Comment tant de bouches pourraient-elles se tromper ?"]
          ]],
          ['codex', 'siege'],
          ['show', 'akhbar'],
          ['nar', "Sur la place, quelqu'un lit la lettre à voix haute. On dirait qu'elle s'allonge à chaque lecture."]
        ] },
        { text: 'Trouver celui qui lit la lettre à la foule, sur la place', talk: 'akhbar', then: [
          ['say', 'akhbar', "« …et il est écrit — je ne fais que lire — qu'on châtiera ceux qui sont venus se plaindre, et leurs fils après eux… »"],
          ['say', 'zayd', "J'ai tenu des feuillets toute ma vie. Celui-ci est bien court pour tout ce qu'il y lit."],
          ['ask', "Abû l-Akhbâr lève les yeux de la lettre. Que faire ?", [
            { t: "« Qui te l'a remise, Abû l-Akhbâr ? Et celui-là, de qui la tenait-il ? »", need: 'tabayyun', r: [
              ['say', 'akhbar', "D'un homme sûr. Qui la tenait… d'un autre. Je ne fais que répéter, Commandeur des croyants. Je n'ai jamais fait que répéter."],
              ['nar', "Il n'a pas de nom à donner. Ceux qui l'écoutaient l'entendent se taire : il arrondissait, ajoutait un mot, taisait une réserve. Devant la question, il ne lui reste qu'un papier sans garant."],
              ['say', 'uthman', "Laissez-le aller. Qu'il sache seulement qu'on lui a demandé son garant, et qu'on le lui redemandera."],
              ['flag', 'ut_demasque'], ['pillar', 'savoir', 1]
            ] },
            { t: 'Le prier de cesser sa lecture, sans rien lui demander.', r: [
              ['nar', "Il s'incline, roule la lettre et se fond dans la foule. On l'a fait taire sans lui demander son garant : il le racontera à sa façon, et ceux qui crient à l'arbitraire auront une phrase de plus."],
              ['pillar', 'justice', -1]
            ] },
            { t: 'Passer sans un mot.', r: [
              ['nar', "Il reprend sa lecture. Quand tu te retournes, il n'est plus là ; la foule, elle, sait déjà la lettre par cœur."]
            ] }
          ]],
          ['hide', 'akhbar'],
          ['nar', "Confondu ou non, Abû l-Akhbâr n'était qu'une bouche. La Rumeur en a mille autres, et elle marche déjà vers la maison."]
        ] },
        { text: 'Rentrer à la maison, que le cercle enserre', goto: 'maison', then: [
          ['nar', "Les jours passent. Le cercle se resserre autour de la maison ; on lui coupe l'eau — à lui qui avait offert un puits à toute la ville."],
          ['say', 'hasan', "Mon père nous a postés à ta porte, mon frère et moi. Dis un mot, et nous sortons."],
          ['say', 'ibnzubayr3', "Nous sommes des centaines, dans la maison et alentour. Laisse-nous faire : ils ne tiendront pas."],
          ['say', 'abuhurayra', "Commandeur des croyants, l'heure est venue de frapper."],
          ['say', 'zayd', "Les Ansâr sont à ta porte. Ils disent : si tu le veux, nous serons les auxiliaires d'Allah une seconde fois."],
          ['choice', "Des centaines d'hommes n'attendent qu'un mot. Que fait 'Uthmân ?", [
            { t: 'Leur interdire de combattre et les renvoyer chez eux : pas une goutte de sang ne coulera pour lui.', ok: true, r: [
              ['say', 'uthman', "Quant au combat : non."],
              ['say', 'hasan', "Alors nous resterons à la porte, l'épée au fourreau."]
            ] },
            { t: 'Accepter les sabres des Ansâr et briser le siège avant qu’il ne soit trop tard.', r: [
              ['nar', "La chaîne vacille. Il en avait le droit et les moyens ; il ne l'a pas fait. Le premier sang versé entre croyants ne se serait plus arrêté — c'est cette porte qu'il a refusé d'ouvrir."]
            ] },
            { t: 'Quitter Médine de nuit pour le Shâm, où une armée fidèle le protégerait.', r: [
              ['nar', "La chaîne vacille. On rapporte qu'on le lui proposa, et qu'il répondit : « Je ne quitterai pas la demeure de mon Hégire ni le voisinage du Messager d'Allah ﷺ. »"]
            ] }
          ]],
          ['quote', "« Te plairait-il de tuer tous les gens, et moi avec eux ? Par Allah, si tu tues un seul homme, c'est comme si tu avais tué tous les gens. »", "'Uthmân à Abû Hurayra — Ibn Sa'd, Tabaqât"],
          ['quote', "« J'adjure quiconque estime me devoir écoute et obéissance de retenir sa main et son arme… »", "On rapporte — Nu'aym ibn Hammâd, al-Fitan ; Khalîfa ibn Khayyât, Târîkh"],
          ['codex', 'parole_sang'], ['pillar', 'lien', 1],
          ['show', 'affranchi'],
          ['nar', "Le dernier matin se lève sur la maison. Avant le jour, il prie."],
          ['pray', 'fajr'],
          ['nar', "Ce matin-là, il affranchit vingt esclaves. Il jeûne. Il fait apporter le Livre et l'ouvre devant lui."],
          ['say', 'zayd', "Tu ne veux pas te défendre contre eux. Mais il y a autre chose à cette porte, qui n'est pas un homme."],
          ['say', 'uthman', "Celle-là, je veux bien la regarder en face."],
          ['sfx', 'glitch'],
          ['map', 'noos', 'seuil', { hue: 320 }],
          ['nar', "La noosphère de Médine, saturée de voix. La Rumeur ignore les distances : à al-Madâ'in, à des semaines de marche, Hudhayfa l'entend aussi — et lui tient tête. Ici, il est à tes côtés."],
          ['join', 'hudhayfa'],
          ['say', 'hudhayfa', "J'ai gardé un secret toute ma vie. Je sais ce que vaut une parole qu'on ne répète pas."]
        ] },
        { text: "Briser l'Or, dont l'envie nourrit la Rumeur", foe: 'f_or', then: [
          ['nar', "La tour s'effondre en pièces qui ne valent plus rien. Derrière elle, la voie est libre jusqu'au cœur — où mille bouches parlent à la fois."],
          ['codex', 'or_n']
        ] },
        { text: 'Faire face à la Rumeur', goto: 'coeur', then: [
          ['say', 'La Rumeur', "On dit que tu es venu te justifier. On dit que tu es venu te taire. On dit…"],
          ['say', 'uthman', "Je ne suis venu ni me justifier ni te faire taire. Je suis venu te refuser ce que tu demandes : du sang."],
          ['battle', { group: ['rumeur'], bg: 'noos', boss: true, intro: 'Mille bouches. Pas un témoin.',
            allies: [{ flag: 'ut_egyptien', name: "Ceux qui ont demandé : « qui l'a écrite ? »" }, { flag: 'ut_demasque', name: 'Les témoins de la place' }] }],
          ['nar', "L'emprise se brise. Un instant, les voix se taisent — et dans ce silence, chacun pourrait entendre qu'il ne sait pas ce qu'il répète."],
          ['nar', "Mais briser une emprise n'est pas dissoudre une foule. Dehors, les hommes sont réels, et leur colère aussi. 'Uthmân le sait. Il ne demandait pas à être sauvé : seulement que nul ne tue en son nom."],
          ['codex', 'rumeur_n'],
          ['map', 'medine', 'maison', { time: 'night' }]
        ] }
      ],
      outro: [
        ['nar', "La nuit tombe sur la maison. À la porte, al-Hasan veille, l'épée au fourreau. À l'intérieur : une lampe, un homme qui jeûne, et le Livre ouvert."],
        ['quote', "« Je vous adjure par Allah : savez-vous que j'ai acheté le puits de Rûma de mes propres biens, pour que mon seau y soit comme ceux des musulmans ? Et vous m'empêchez aujourd'hui d'en boire. »", "'Uthmân aux assiégeants (abrégé) — at-Tirmidhî ; an-Nasâ'î"],
        ['codex', 'ruma'],
        ['nar', "Nul ne lui répond. La Chaîne retient ce silence."]
      ]
    }
  ]
});
