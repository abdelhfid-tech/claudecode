/* ISNAD — Les veillées du Caïd : un maillon de fiction entre les Compagnons et Idris.
   Après chaque saga, le Caïd affronte dans sa citadelle une crise qui répond à la leçon reçue.
   Tout est fictif ici : les décisions sont libres et pèsent sur les piliers de la Citadelle.
   Tout y est de fiction ; les phrases sont originales. */
ISNAD.registerSaga({
  id: 'caid', order: 6, frame: true, veillees: true, narrator: 'Le Caïd',
  name: 'Le Caïd', epithet: 'Seigneur de la Citadelle', arabic: 'القائد',
  years: 'un maillon de la Chaîne',
  light: 'sabr', lightName: 'Patience', ambiance: 'citadelle · désert',
  tagline: "Les murs tombent. Ce qu'un homme a reçu et remis ne tombe pas.",
  intro: [], outro: [],

  heroes: {
    caid: {
      name: 'Le Caïd', title: 'Seigneur de la Citadelle', arabic: 'القائد', role: 'gardien', el: 'sabr',
      look: { kind: 'berbere', robe: '#2f4a7a', head: '#1f2f55', cloak: '#e6dcc4' },
      skills: [
        { lvl: 1, id: 'veiller', name: 'Veiller', desc: "Tenir sans haine : frappe de Patience.", cost: 3, target: 'foe', el: 'sabr', pow: 1.4, anim: 'light' },
        { lvl: 1, id: 'peser', name: "Peser l'homme", desc: "Regarder avant de juger : révèle les failles d'une chimère.", cost: 2, target: 'foe', el: 'adl', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 1, id: 'rempart', name: 'Faire rempart', desc: "Se place devant les siens : attire les coups, Garde renforcée.", cost: 4, target: 'self', fx: [{ st: 'taunt', turns: 2 }, { st: 'def', v: 1 }], anim: 'guard' },
        { lvl: 2, id: 'parole_pere', name: '« Disait mon père »', desc: "Une parole reçue raffermit le groupe : Force et Esprit accrus.", cost: 6, target: 'allies', fx: [{ st: 'atk', v: 1 }, { st: 'mag', v: 1 }], anim: 'glyph' },
        { lvl: 3, id: 'dire_vrai', name: 'Dire le vrai', desc: "Nommer la chose telle qu'elle est : frappe de Véracité.", cost: 5, target: 'foe', el: 'sidq', pow: 1.6, anim: 'pillar' },
        { lvl: 3, id: 'meme_loi', name: 'La même loi', desc: "Une seule balance pour tous : Justice sur toutes les chimères.", cost: 7, target: 'foes', el: 'adl', pow: 1.0, anim: 'wave' }
      ],
      limit: { id: 'citadelle', name: 'Ce qui tient les hommes', desc: "Relève, soigne et fortifie tout le groupe.", target: 'allies', heal: 0.9, revive: true, fx: [{ st: 'def', v: 1 }, { st: 'regen', turns: 3 }], anim: 'heal' }
    },
    geometre: {
      name: 'Maître Bahrâm', title: 'le Géomètre', arabic: 'بهرام', role: 'soigneur', el: 'ilm',
      look: { kind: 'savant', robe: '#e9e2d0', head: '#f4f0e6', cloak: '#6b5a48' },
      skills: [
        { lvl: 1, id: 'mesurer', name: 'Mesurer', desc: "Le compas ne flatte personne : révèle les failles.", cost: 2, target: 'foe', el: 'ilm', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
        { lvl: 1, id: 'demontrer', name: 'Démontrer', desc: "Une preuve posée sans hâte : frappe de Savoir.", cost: 3, target: 'foe', el: 'ilm', pow: 1.4, anim: 'light' },
        { lvl: 1, id: 'baume', name: 'Baume', desc: "Rend de la Constance à un compagnon.", cost: 4, target: 'ally', heal: 1.1, anim: 'heal' },
        { lvl: 2, id: 'partager_eau', name: "Partager l'eau", desc: "Rend de la Constance à tout le groupe.", cost: 8, target: 'allies', heal: 0.6, anim: 'heal' },
        { lvl: 3, id: 'lecon', name: 'Leçon du soir', desc: "Dissipe le doute et les murmures d'un compagnon, et lui rend du Souffle.", cost: 4, target: 'ally', sp: 0.25, fx: [{ st: 'cleanse' }], anim: 'light' },
        { lvl: 3, id: 'pente_douce', name: 'La pente douce', desc: "Ce qui est bien tracé coule de soi : Savoir sur toutes les chimères.", cost: 7, target: 'foes', el: 'ilm', pow: 0.95, anim: 'wave' }
      ],
      limit: { id: 'ce_qui_demeure', name: 'Ce qui demeure', desc: "Les empires brûlent, la mesure reste : Savoir sur tous, failles révélées, renforts dissipés.", target: 'foes', el: 'ilm', pow: 2.1, fx: [{ st: 'reveal' }, { st: 'dispel' }], anim: 'pillar' }
    },
    capitaine: {
      name: 'Zîrî', title: 'Capitaine des sentinelles', arabic: 'زيري', role: 'guerrier', el: 'shajaa',
      look: { kind: 'soldat', robe: '#7a4a32', head: '#d8cfc0', cloak: '#3d2c1e' },
      skills: [
        { lvl: 1, id: 'lance', name: 'Coup de lance', desc: "Frappe nette.", cost: 3, target: 'foe', el: 'fer', pow: 1.5, anim: 'slash' },
        { lvl: 1, id: 'braver', name: 'Braver', desc: "Ne pas reculer d'un pas : frappe de Courage.", cost: 3, target: 'foe', el: 'shajaa', pow: 1.4, anim: 'burst' },
        { lvl: 1, id: 'tenir_poste', name: 'Tenir le poste', desc: "En garde, et prêt : dégâts réduits, Niyya accrue.", cost: 3, target: 'self', fx: [{ st: 'garde' }, { st: 'niyya', v: 1 }], anim: 'guard' },
        { lvl: 2, id: 'ronde', name: 'La ronde', desc: "Balaye toute la ligne.", cost: 6, target: 'foes', el: 'fer', pow: 0.85, anim: 'wave' },
        { lvl: 3, id: 'epargner', name: 'Poser la lance', desc: "Retenir son bras : Miséricorde, qui ôte un voile quelle que soit la faille.", cost: 5, target: 'foe', el: 'rahma', pow: 1.2, fx: [{ st: 'veil', v: -1 }], anim: 'light' },
        { lvl: 3, id: 'cri_releve', name: 'Cri de la relève', desc: "« Qui veille ? » Tout le groupe gagne en Élan.", cost: 5, target: 'allies', fx: [{ st: 'spd', v: 1 }], anim: 'glyph' }
      ],
      limit: { id: 'aube_rempart', name: "L'aube sur le rempart", desc: "La nuit a été tenue : Courage sur tous, peut étourdir.", target: 'foes', el: 'shajaa', pow: 2.2, fx: [{ st: 'stun', chance: 0.4 }], anim: 'burst' }
    }
  },

  enemies: {
    chuchot: { name: 'Chuchotement', art: 'wisp', hue: 265, scale: 1, lvl: 3, tier: 'minion', weak: ['sidq', 'sabr'], veils: 2,
      skills: [{ w: 2, name: '« On dit que… »', target: 'foe', el: 'ilm', pow: 0.9, fx: [{ st: 'doute', turns: 1, chance: 0.25 }], anim: 'dark' },
        { w: 1, name: 'Veillée de commérages', target: 'foes', fx: [{ st: 'recul' }], anim: 'wave' }],   // 2.20 : le temps volé (D.TEMPS, D210)
      taunts: ['Il dort seulement.', 'De qui tiens-tu cela ? De personne. De tout le monde.'],
      desc: "Ce qui se dit à mi-voix dans une maison où l'on cache une mort. Il n'a pas de corps : il n'a que la voix de ceux qui le répètent. Une parole dite à voix haute le dissipe." },
    ombre_pere: { racine: 'noir_peur', name: "L'Ombre du Père", art: 'throne', hue: 35, scale: 2, lvl: 4, tier: 'elite', weak: ['sidq', 'sabr'], veils: 4,
      skills: [
        { w: 3, name: '« Il dort seulement »', target: 'foes', el: 'ilm', pow: 0.75, fx: [{ st: 'spd', v: -1, chance: 0.5 }], anim: 'wave' },
        { w: 2, name: 'Poids du nom', target: 'foe', el: 'fer', pow: 1.3, fx: [{ st: 'atk', v: -1, chance: 0.5 }], anim: 'dark' },
        { w: 1, name: 'Siège gardé', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' }
      ],
      phases: [{ at: 0.5, say: 'Tant qu’on tait ma mort, je règne. Laisse-moi régner encore sept jours.', fx: [{ st: 'atk', v: 1 }],
        addSkills: [{ w: 3, name: 'Sept jours de plus', target: 'foes', el: 'fer', pow: 0.9, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'dark' }] }],
      taunts: ['Que feras-tu sans moi ?', 'Ils n’obéissaient qu’à ma voix.'],
      desc: "Un trône que nul n'ose déclarer vide. Ce n'est pas le père : c'est la place qu'il tenait dans les têtes, et que la peur veut garder occupée. Dire la mort telle qu'elle est le défait." },
    dispense: { name: 'Dispense vendue', art: 'tower', hue: 48, scale: 1, lvl: 5, tier: 'minion', weak: ['adl', 'sidq'], veils: 2,
      skills: [{ w: 2, name: 'Prix du repos', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'dark' }],
      taunts: ['Dix pièces la nuit. Qui s’en plaindrait ?'],
      desc: "Une petite pile de pièces contre une nuit de sommeil. Chacune pèse peu ; ensemble, elles retirent un homme du rempart et en écrasent un autre. La même loi pour tous les fait tomber." },
    sommeil: { racine: 'insouciance', name: 'Le Sommeil', art: 'wave', hue: 230, scale: 2, lvl: 6, tier: 'elite', weak: ['adl', 'shajaa', 'sabr', 'ilm'], veils: 4,   // 2.20 : de la famille de la ghafla (D210), faible aussi devant la Patience et le Savoir
      skills: [
        { w: 3, name: 'Torpeur', target: 'foes', el: 'ilm', pow: 0.7, fx: [{ st: 'spd', v: -1, chance: 0.6 }], anim: 'wave' },
        { w: 2, name: 'Paupières lourdes', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'stun', chance: 0.35 }], anim: 'dark' },
        { w: 1, name: '« Ne regarde pas »', target: 'foe', el: 'ilm', pow: 1.2, fx: [{ st: 'doute', turns: 2, chance: 0.4 }], anim: 'dark' }
      ],
      phases: [{ at: 0.5, say: 'À quoi bon savoir ? Punis le petit, et que chacun retourne à son lit.', fx: [{ st: 'def', v: 1 }] }],
      taunts: ['Demain. Tout cela peut attendre demain.'],
      desc: "Le désir de toute une ville de ne pas savoir ce qui se vend sur son rempart. Il ne veut de mal à personne : il veut seulement qu'on le laisse. La Justice, le Courage, la Patience et le Savoir le déchirent." },
    tambour: { racine: 'ostentation', name: 'Le Tambour', art: 'banner', hue: 8, scale: 3, lvl: 6, tier: 'boss', weak: ['sabr', 'rahma'], immune: ['fer'], veils: 5,
      skills: [
        { w: 3, name: 'Roulement', target: 'foes', el: 'fer', pow: 0.85, anim: 'wave' },
        { w: 2, name: '« Son nom ! Son nom ! »', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'guard' },
        { w: 2, name: 'Marche forcée', target: 'foe', el: 'fer', pow: 1.5, anim: 'dark' }
      ],
      phases: [
        { at: 0.6, say: 'Écoute-les crier. Ce n’est plus ton nom qu’ils crient.', fx: [{ st: 'spd', v: 1 }] },
        { at: 0.3, say: 'Sans moi, qui montera à l’assaut ? Qui mourra content ?', fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Charge qu’on n’arrête plus', target: 'foes', el: 'fer', pow: 1.1, fx: [{ st: 'def', v: -1, chance: 0.4 }], anim: 'dark' }] }
      ],
      taunts: ['Avec lui, on ne perd jamais.', 'Encore une ville. Encore une.'],
      desc: "La gloire qui marche toute seule. Né des acclamations d'une armée victorieuse, il lui faut chaque saison une conquête de plus. Les armes le nourrissent ; la Patience et la Miséricorde le font taire." },
    on_dit: { name: 'On-dit', art: 'wisp', hue: 330, scale: 1, lvl: 7, tier: 'minion', weak: ['sidq', 'ilm'], veils: 2,
      skills: [{ w: 3, name: 'De bonne source', target: 'foe', el: 'ilm', pow: 1.0, fx: [{ st: 'waswas', turns: 2, chance: 0.4 }], anim: 'dark' },
        { w: 1, name: 'Colporter', target: 'foe', fx: [{ st: 'baisse' }], anim: 'glyph' }],
      taunts: ['Je le tiens de quelqu’un de sûr.', 'Il n’y a pas de fumée sans feu.'],
      desc: "Une phrase sans auteur. Chacun la tient d'un autre, qui la tient d'un autre. Demander « qui l'a dit ? » suffit le plus souvent à la défaire." },
    bouc: { racine: 'noir_rancune', name: 'Le Bouc émissaire', art: 'mask', hue: 0, scale: 3, lvl: 7, tier: 'boss', weak: ['rahma', 'ilm', 'sidq'], veils: 5,
      skills: [
        { w: 3, name: '« C’est eux »', target: 'foe', el: 'fer', pow: 1.5, fx: [{ st: 'def', v: -1, chance: 0.5 }], anim: 'dark' },
        { w: 3, name: 'Soif de coupable', target: 'foes', el: 'ilm', pow: 0.85, fx: [{ st: 'doute', turns: 1, chance: 0.3 }], anim: 'wave' },
        { w: 1, name: 'Mille bouches', target: 'self', fx: [{ st: 'atk', v: 1 }], anim: 'guard' }
      ],
      phases: [
        { at: 0.55, say: 'Donne-m’en un. Un seul. Je me tairai jusqu’à la prochaine soif.', fx: [{ st: 'spd', v: 1 }] },
        { at: 0.25, say: 'Si ce n’est pas eux, c’est donc toi.', fx: [{ st: 'atk', v: 1 }],
          addSkills: [{ w: 3, name: 'Porte marquée', target: 'foes', el: 'fer', pow: 1.0, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'dark' }] }
      ],
      taunts: ['Il faut bien que ce soit la faute de quelqu’un.', 'Ils ne sont pas d’ici.'],
      desc: "Un masque vide qui cherche un visage à qui s'ajuster. Il naît quand une foule qui souffre préfère un coupable à une cause. Lui en livrer un ne l'apaise pas : il en demande un second. Le Savoir, la Véracité et la Miséricorde le brisent." },
    pur: { racine: 'orgueil', name: 'Le Pur', art: 'blade', hue: 200, scale: 3, lvl: 8, tier: 'boss', weak: ['ilm', 'rahma'], immune: ['adl'], veils: 6,
      skills: [
        { w: 3, name: 'Anathème', target: 'foe', el: 'adl', pow: 1.6, anim: 'slash' },
        { w: 3, name: 'Phrase unique', target: 'foes', el: 'adl', pow: 0.9, fx: [{ st: 'doute', turns: 1, chance: 0.3 }], anim: 'wave' },
        { w: 1, name: 'Certitude', target: 'self', fx: [{ st: 'def', v: 1 }], anim: 'guard' }
      ],
      phases: [
        { at: 0.6, say: 'Qui n’est pas pur est impur. Il n’y a pas de troisième mot.', fx: [{ st: 'atk', v: 1 }] },
        { at: 0.3, say: 'Brûlez les livres. Ce qu’ils ont de vrai tient dans ma phrase ; le reste est de trop.', fx: [{ st: 'spd', v: 1 }],
          addSkills: [{ w: 3, name: 'Bûcher', target: 'foes', el: 'adl', pow: 1.15, fx: [{ st: 'waswas', turns: 2, chance: 0.5 }], anim: 'dark' }] }
      ],
      taunts: ['Une seule phrase suffit.', 'Tu as pactisé.'],
      desc: "Une phrase vraie devenue lame. Il n'a qu'un tranchant et se croit la justice même : c'est pourquoi la Justice ne l'entame pas. Le Savoir lui rend ses autres phrases ; la Miséricorde lui rappelle qu'il parle à des frères." }
  },

  codex: [
    { id: 'caid_bio', cat: 'Biographie', title: 'Le Caïd', text: "Seigneur berbère d'une citadelle au bord du désert, héritier d'un père assassiné. Il n'a pas de nom dans la Chaîne : seulement sa charge, et ce qu'il a transmis. Il apprit à gouverner dans les vies des Compagnons, que lui lisait un vieux maître, et consigna pour son fils ce qu'il en avait fait. Personnage de fiction : un maillon imaginé entre les témoins et Idris.", src: 'Fiction' },
    { id: 'citadelle_lieu', cat: 'Lieu', title: 'La Citadelle', text: "Des murs de pisé, un puits, une mosquée, une école, des greniers, un cèdre planté par le vieux Caïd. Son fils disait qu'elle ne tenait pas par ses pierres mais par ce que les hommes s'y devaient les uns aux autres : « Ôtez cela, il reste un enclos. » Dans la noosphère, c'est le contraire d'une chimère : ce qui naît quand des hommes tiennent ensemble à plus grand qu'eux.", src: 'Fiction' },
    { id: 'piliers', cat: 'Noosphère', title: 'Les quatre piliers', text: "La Prière, qui remet l'homme à sa place et lui rend le repos. Le Savoir, qui empêche de prendre une phrase pour la vérité entière. La Justice, la même pour le fort et pour le faible. Le Lien, la parole donnée et tenue, par quoi des étrangers deviennent des voisins. Qu'un seul manque, et la Citadelle n'est plus qu'une muraille." },
    { id: 'chambellan', cat: 'Biographie', title: 'Maymûn, le chambellan', text: "Chambellan du vieux Caïd, puis de son fils. Il dit à chacun ce que chacun veut entendre, pleure quand on le regarde et plaint beaucoup le peuple, qui l'aime pour cela. On le reconnaît à ses belles manches. Il ne sert ni le Caïd ni la foule : il sert le besoin qu'ils ont de lui. Personnage de fiction.", src: 'Fiction' },
    { id: 'pere_parole', cat: 'Parole', title: 'La parole du bâtisseur', text: "« Qui partage un édifice n'obtient que des pierres. » Le vieux Caïd le disait des greniers, des puits et des tribus. Maître Bahrâm l'entendait aussi d'une vérité : coupée en morceaux pour être servie plus doucement, elle cesse d'en être une.", src: 'Fiction' },
    { id: 'aube_vraie', cat: 'Événement', title: "L'aube de vérité", text: "Le matin qui suivit le meurtre de son père, le Caïd annonça lui-même la mort au peuple, après la prière de l'aube, avant que nul ne la devine. Il y perdit sept jours d'avance sur ses rivaux et y gagna d'être cru. Les amghars s'en souvinrent au conseil.", src: 'Fiction' },
    { id: 'sentinelle', cat: 'Parole', title: 'La sentinelle', text: "« Celui qui veille porte le sommeil de tous. Qui lui vole son repos vole la ville entière. » Le vieux Caïd le répétait à chaque relève. La loi de la citadelle punissait de mort la sentinelle endormie ; elle ne disait rien de celui qui l'épuisait, jusqu'au jour où il fallut le dire.", src: 'Fiction' },
    { id: 'dispenses', cat: 'Événement', title: 'Les dispenses de garde', text: "Un officier du rempart vendait aux fils de familles aisées le droit de dormir chez eux les nuits de garde : dix pièces la nuit. Les veilles vendues retombaient sur les plus pauvres, qui montaient deux et trois gardes d'affilée. Tout le rempart le savait ; nul ne parlait, car l'officier avait un oncle puissant.", src: 'Fiction' },
    { id: 'geometres', cat: 'Biographie', title: 'Les géomètres', text: "Des savants perses chassés par une guerre de succession, à qui le vieux Caïd donna asile. Ils mesurent les champs, tracent les rigoles et tiennent l'école avec les maîtres du pays. Après la grande crue, ils recomptèrent borne par borne les terres de l'oasis sans rien demander. Maître Bahrâm est le plus âgé d'entre eux.", src: 'Fiction' },
    { id: 'foggara', cat: 'Lieu', title: 'La foggara', text: "Galerie souterraine en pente très douce qui capte l'eau au pied d'une montagne et la mène, par son seul poids, jusqu'aux jardins. On la creuse puits après puits ; les Perses la nomment kârêz ou qanât. Elle donne à tous ceux qui ont creusé, et l'on ne peut la couper à l'un sans la couper à l'autre : c'est un pacte en forme de rivière.", src: 'Technique attestée de la Perse au Maghreb' },
    { id: 'eau_saumatre', cat: 'Événement', title: "L'eau du puits", text: "Quand une nappe baisse, l'eau douce s'épuise la première, et l'eau plus salée du fond remonte dans le seau. Le goût change sans que personne y ait touché. Bahrâm le montra en faisant sécher l'eau du fond sur une pierre chaude : elle y laissa du sel.", src: 'Fiction' },
    { id: 'hudaybiyya', cat: 'Événement', title: 'Le pacte nommé victoire', text: "En l'an 6 de l'Hégire, à al-Hudaybiyya, un pacte fut conclu avec Quraysh à des conditions que beaucoup de Compagnons trouvèrent amères. Sur le chemin du retour fut révélée la sourate « La Victoire éclatante » (48), que de nombreux Compagnons et exégètes ont rapportée à ce pacte. On rapporte d'az-Zuhrî que la paix ainsi ouverte fit entrer dans l'islam autant de monde, ou davantage, que toutes les années précédentes.", src: 'Ibn Hishâm, as-Sîra ; al-Bukhârî' },
    { id: 'slogan_purs', cat: 'Parole', title: 'Parole vraie, visée fausse', text: "Feuillet recopié de la main du vieux Caïd. Quand des hommes firent sécession en criant « Le jugement n'appartient qu'à Allah », on rapporte que 'Alî ibn Abî Tâlib répondit : « Parole de vérité par laquelle on vise le faux. » Une phrase vraie peut servir de lame ; on lui répond par le savoir, non par une autre lame.", src: 'Muslim, as-Sahîh' },
    { id: 'fiction_veillees', cat: 'Parole', title: 'Les veillées (fiction)', text: "Les veillées du Caïd sont une fiction. Le Caïd, sa citadelle et ses gens n'ont jamais existé ; les leçons qu'il reçoit sont celles des sagas, posées à l'échelle d'une cité." }
  ],

  chapters: [
    /* ============ I — LA NUIT DU PÈRE (Véracité) ============ */
    {
      id: 'v_abubakr', after: 'abubakr', minLvl: 3, last: true,
      title: 'La Nuit du père', sub: 'Veillée de la Véracité · après Abû Bakr',
      map: 'citadelle', opts: { time: 'night' }, start: 'salle', party: ['caid'],
      npcs: [
        { id: 'chambellan', name: 'Maymûn, le chambellan', at: ['salle', 2, 0], look: { kind: 'marchand', robe: '#5a2f4a', head: '#e6dcc4', cloak: '#c9a13f' },
          talk: [['say', 'chambellan', "Sept jours, seigneur. Je ne demande que sept jours."]] },
        { id: 'capitaine_n', name: 'Zîrî', hero: 'capitaine', at: 'remparts',
          talk: [['say', 'capitaine_n', "Mes hommes tiennent les portes. Dis-moi seulement ce que je dois leur dire."]] },
        { id: 'geometre_n', name: 'Maître Bahrâm', hero: 'geometre', at: 'ecole', talk: [
          ['say', 'geometre_n', "Je sais. La lampe de sa chambre s'est éteinte à l'heure où il lisait. Elle ne s'éteignait jamais à cette heure-là."],
          ['say', 'caid', "On me conseille de taire sa mort sept jours."],
          ['say', 'geometre_n', "Ton père disait : « Qui partage un édifice n'obtient que des pierres. » Je crois qu'il l'aurait dit aussi d'une vérité. Coupée en sept jours, il n'en reste que des morceaux, et chacun ramasse le sien."],
          ['codex', 'pere_parole'], ['pillar', 'savoir', 1],
          ['say', 'geometre_n', "Je viens avec toi. Un vieil homme qui compte ne sert à rien dans une bagarre, mais il sert de témoin."],
          ['hide', 'geometre_n'], ['join', 'geometre']
        ] },
        { id: 'idir', name: 'Amghar Idir', at: ['cour', 0, 1], hidden: true, look: { kind: 'berbere', robe: '#6b3f2a', head: '#2a2a3a', cloak: '#c8b48a' } },
        { id: 'imam', name: 'Le vieil imam', at: ['mosquee', 1, 1], look: { kind: 'ancien', robe: '#e9e2d0', head: '#f4f0e6' }, talk: [
          ['say', 'imam', "Ton père venait ici avant chaque conseil. Il disait qu'un homme qui n'a rien demandé au silence n'a rien à dire aux hommes."],
          ['say', 'imam', "Prie d'abord. Tu décideras ensuite. On ne tranche pas bien avec un cœur qui court."]
        ] }
      ],
      chests: [{ at: ['salle', 1, 1], gear: 'burnous' }, { at: ['greniers', 1, 0], item: 'dattes', n: 2 }, { at: ['jardin', 1, 1], item: 'eau', n: 1 }],
      intro: [
        ['flag', 'v1_vrai', false], ['flag', 'v1_tu', false], ['flag', 'v1_pacte', false],
        ['title', 'La Nuit du père', 'Veillée de la Véracité'],
        ['mus', 'deuil'],
        ['nar', "Mon père est mort cette nuit, d'une lame, entre la prière du soir et le premier sommeil. J'avais cru jusque-là que la citadelle tenait par ses murs. Elle tenait par lui."],
        ['nar', "Il disait : « Une muraille n'est qu'une promesse de pierre. Ce sont les hommes debout derrière elle qui la tiennent. » Cette nuit les hommes dorment. Demain ils sauront, ou ils ne sauront pas."],
        ['nar', "C'est à moi d'en décider. Je n'ai pas vingt-cinq ans, la lampe de la salle fume, et le chambellan attend que je lève les yeux."],
        ['codex', 'caid_bio']
      ],
      objectives: [
        { text: "Écouter le chambellan, dans la salle", talk: 'chambellan', then: [
          ['say', 'chambellan', "Seigneur, car c'est toi désormais. N'annonce rien. Qu'on dise ton père souffrant. Les amghars sont dans nos murs pour la foire : s'ils apprennent sa mort, ils se partageront la citadelle avant l'aube."],
          ['say', 'caid', "Et que leur dirai-je dans sept jours, quand il faudra bien l'enterrer ?"],
          ['say', 'chambellan', "Dans sept jours, tu tiendras les greniers, les portes et le sceau. On pardonne tout à celui qui tient les greniers. Le peuple n'aime pas la vérité, seigneur : il aime dormir."],
          ['say', 'caid', "Mon père t'écoutait-il ainsi ?"],
          ['say', 'chambellan', "Ton père m'écoutait toujours. C'est ce qui faisait sa grandeur."],
          ['nar', "Il a dit cela sans un pli sur le visage. J'ai remarqué, pour la première fois, qu'il pleurait très bien : juste ce qu'il fallait, et jamais avant d'être regardé."],
          ['codex', 'chambellan']
        ] },
        { text: "Monter au rempart trouver le capitaine Zîrî", talk: 'capitaine_n', then: [
          ['say', 'capitaine_n', "Le meurtrier a fui par la poterne. Mes hommes ont vu le corps. Je leur ai fait jurer le silence jusqu'à ton ordre."],
          ['say', 'caid', "Quarante sentinelles peuvent-elles garder un secret, Zîrî ?"],
          ['say', 'capitaine_n', "Une nuit. Pas deux. Un secret gardé par quarante hommes n'est plus un secret, seigneur : c'est une dette, et elle court."],
          ['say', 'capitaine_n', "Maître Bahrâm veille à l'école. Ton père ne tranchait rien de grave sans l'avoir entendu. Mais l'aube n'attendra pas : je monte avec toi à la mosquée."],
          ['hide', 'capitaine_n'], ['join', 'capitaine']
        ] },
        { text: "Gagner la mosquée avant l'aube (Bahrâm veille à l'école)", goto: 'mosquee', then: [
          ['map', 'citadelle', 'mosquee', { time: 'dawn' }],
          ['nar', "L'aube monte derrière les palmes. Dans la cour de la mosquée les hommes se rangent, et personne encore ne sait pourquoi le Caïd n'est pas au premier rang."],
          ['pray', 'fajr'],
          ['nar', "J'ai prié à la place de mon père. Je n'ai rien demandé, sinon de ne pas mentir par peur. Quand je me suis relevé, ils me regardaient tous."],
          ['ask', "L'aube est là. Que dit le Caïd à son peuple ?", [
            { t: "La vérité entière : mon père est mort cette nuit, assassiné.", r: [
              ['flag', 'v1_vrai'], ['codex', 'aube_vraie'], ['pillar', 'lien', 1],
              ['say', 'caid', "Mon père est mort cette nuit, tué d'une lame, dans sa maison. Je ne sais pas encore par qui. Voilà tout ce que je sais, et vous le savez maintenant comme moi."],
              ['nar', "Il y eut un cri, puis ce silence des foules qui pèse plus que leur bruit. Puis un vieil homme a dit : « Au moins, celui-là ne nous prend pas pour des enfants. »"]
            ] },
            { t: "Rien encore : gagner sept jours, comme le veut le chambellan.", r: [
              ['flag', 'v1_tu'], ['pillar', 'lien', -1],
              ['say', 'caid', "Le Caïd est souffrant. Il ne recevra pas aujourd'hui."],
              ['nar', "Avant midi, les porteurs d'eau savaient. À l'heure de la sieste, les chefs savaient que je savais, et que j'avais menti. J'avais voulu gagner sept jours : j'avais perdu, en une matinée, le crédit d'une vie."]
            ] },
            { t: "La moitié : dire qu'il est mort, taire qu'on l'a tué.", r: [
              ['say', 'caid', "Mon père est mort cette nuit. Priez pour lui."],
              ['nar', "Je n'avais pas menti. J'avais seulement laissé un vide, et la rumeur s'y est logée comme l'eau dans un creux. Avant le soir il courait dix récits de sa mort, et dans trois d'entre eux c'était moi qui tenais la lame."]
            ] }
          ]],
          ['show', 'idir'],
          ['say', 'capitaine', "Les amghars sont dans la cour, seigneur. Ils ne se sont pas assis. C'est mauvais signe : un homme qui compte rester s'assoit."]
        ] },
        { text: "Descendre dans la cour : les amghars attendent", talk: 'idir', then: [
          ['mus', 'conseil'],
          ['if', 'v1_tu', [
            ['say', 'idir', "On nous a dit ton père souffrant. Puis un porteur d'eau nous a dit la vérité. Nous commençons donc par savoir ce que vaut ta parole."]
          ], [
            ['say', 'idir', "Nous avons prié sur ton père. Maintenant parlons de ce qu'il laisse, et de celui qui prétend le tenir."]
          ]],
          ['parley', {
            with: 'idir', title: 'Le conseil des amghars',
            intro: "Ils craignent d'être tenus par un jeune homme comme ils l'étaient par un grand. Ils veulent reprendre leurs puits, ou une raison de rester.",
            goal: 6,
            rounds: [
              { say: "Ton père tenait nos tribus dans sa main. La main est froide. Dis-nous pourquoi nous resterions sous un toit dont la poutre est tombée.", opts: [
                { t: "Parce que je vous ai dit sa mort à l'aube, avant que vous ne l'appreniez d'un autre.", el: 'sidq', v: 3, need: 'aube_vraie', r: "C'est vrai. Tu pouvais nous tromper sept jours. Je m'en souviendrai." },
                { t: "Parce que la poutre n'était pas le toit. Le toit, c'est ce que nous avons bâti ensemble.", el: 'sabr', v: 2, r: "Parole de fils. Nous verrons si elle porte." },
                { t: "Parce que mes sentinelles tiennent les portes.", el: 'shajaa', v: -1, r: "Alors nous sommes tes prisonniers, non tes alliés. C'est noté." }
              ] },
              { say: "Chaque tribu reprend sa part : ses puits, ses greniers, sa porte. Ce n'est pas une trahison. C'est un inventaire.",
                noir: { name: "Le Soupçon", group: ['noir_soupcon'], intro: "Idir a consulté les autres amghars du regard avant de te répondre. Quelqu'un leur a parlé, cette nuit, et ce qu'il a dit couvre ta voix.", after: "Bien. C'est toi que j'écoute, et non ce qu'on m'a dit de toi." },
                opts: [
                { t: "Mon père disait : « Qui partage un édifice n'obtient que des pierres. » Reprenez vos parts : vous aurez cinq tas de pierres, et plus de toit.", el: 'ilm', v: 3, need: 'pere_parole', r: "…Il le disait, oui. Je l'entends encore le dire." },
                { t: "Un puits partagé en cinq, ce sont cinq trous qui sèchent. Gardons-le entier, et que chacun y ait le même seau.", el: 'adl', v: 2, r: "Le même seau pour tous ? Même pour toi ?" },
                { t: "Prenez ce que vous voulez, pourvu que la paix demeure.", el: 'rahma', v: -1, r: "Tu donnes trop vite. Ce qu'on cède ainsi ne vaut rien." }
              ] },
              { say: "Et le meurtrier ? La lame est venue de l'intérieur. Qui nous dit qu'elle n'est pas venue de toi ?", opts: [
                { t: "Rien ne vous le dit. Alors siégez à l'enquête : nommez deux des vôtres auprès de mon capitaine.", el: 'adl', v: 2, r: "Tu t'exposes à nos juges. Soit." },
                { t: "Je vous le jure sur la tombe de mon père.", el: 'sidq', v: 0, r: "Les serments, cette nuit, ne valent pas cher." },
                { t: "Qui m'accuse en répondra.", el: 'shajaa', v: -2, r: "Voilà comment parlent ceux qui ont peur." }
              ] },
              { say: "Dernière chose. Ton père nous devait conseil : rien de grand sans nous. Et toi ?", opts: [
                { t: "Rien de grand sans vous. Et le conseil se tiendra après la prière, à la mosquée, portes ouvertes.", el: 'sabr', v: 2, r: "Portes ouvertes. Ton père lui-même n'avait pas osé." },
                { t: "Je vous écouterai quand il le faudra.", el: 'adl', v: 0, r: "« Quand il le faudra » : c'est donc toi qui en jugeras." },
                { t: "Vous aurez de l'or pour votre patience.", el: 'rahma', v: -1, r: "Tu nous prends pour des mercenaires." }
              ] }
            ],
            win: [
              ['say', 'idir', "Nous restons. Pas pour ton père : pour ce que tu viens de dire. Mais souviens-toi que nous sommes restés debout tout ce conseil, et que c'est toi qui nous as fait asseoir."],
              ['flag', 'v1_pacte'], ['pillar', 'lien', 1], ['sfx', 'light']
            ],
            lose: [
              ['say', 'idir', "Nous reprenons nos puits. Garde tes murs, fils du Caïd. Nous verrons s'ils tiennent sans nous."],
              ['nar', "Ils sont sortis, et dans le vide qu'ils laissaient quelque chose s'est assis sur le siège de mon père. Ce n'était pas lui. C'était la place qu'il tenait dans leurs têtes, et que personne n'osait dire vide."],
              ['battle', { group: ['ombre_pere', 'chuchot'], bg: 'ville', boss: true, intro: "L'Ombre du Père : un siège que nul n'ose déclarer vide. La Véracité et la Patience sont ses failles." }],
              ['pillar', 'lien', -1],
              ['nar', "L'ombre s'est défaite. Les amghars, eux, étaient déjà loin, avec leurs tentes et leurs troupeaux. Il me faudrait des saisons pour les ramener un à un."]
            ]
          }]
        ] },
        { text: "Monter seul au rempart, le soir venu", goto: 'remparts', then: [
          ['mus', 'espoir'],
          ['nar', "Le soir, on a enterré mon père à l'ombre du cèdre qu'il avait planté. Un arbre met cent ans à devenir un arbre, et il ne cesse à aucun moment d'en être un : je crois que c'est ainsi qu'il voyait la citadelle."],
          ['if', 'v1_vrai', [
            ['nar', "J'ai fait ce jour-là ce qu'avait fait Abû Bakr au jour le plus sombre : j'ai dit que l'homme était mort, pour que vive ce qu'il servait. Ceux qui aimaient mon père plus que la vérité m'en ont voulu une saison. Les autres ont dormi."]
          ], [
            ['nar', "Je n'ai pas fait ce jour-là ce qu'avait fait Abû Bakr au jour le plus sombre. Lui a dit la mort avant qu'on la devine. Moi, j'ai appris à mes dépens qu'une vérité différée ne revient jamais seule : elle ramène avec elle le soupçon."]
          ]],
          ['codex', 'citadelle_lieu'], ['codex', 'piliers'], ['codex', 'fiction_veillees']
        ] }
      ]
    },

    /* ============ II — LA SENTINELLE (Justice) ============ */
    {
      id: 'v_umar', after: 'umar', minLvl: 5, last: true, hajj: true,
      title: 'La Sentinelle', sub: "Veillée de la Justice · après 'Umar",
      enigme: { id: 'langueur_ziri', who: 'capitaine', cure: 'priere', title: 'La langueur de Zîrî',
        signe: "Zîrî est las depuis des jours, et le médecin ne lui trouve rien.",
        mot: "Ce qui lui manquait : la prière de l'aube, laissée depuis ses nuits de rempart.",
        intro: [['nar', "Zîrî, mon capitaine, se tient mal depuis des jours. Ni fièvre, ni blessure : le médecin n'a rien trouvé. Il dit seulement qu'il est las, et il l'est."]],
        solved: [
          ['say', 'capitaine', "Depuis mes nuits de rempart, je laissais passer l'aube. Je me disais : demain. Je ne suis pas tombé malade, seigneur. Je me suis éloigné, et je portais cela comme un sac."],
          ['nar', "Il a prié avec nous, au premier rang, sans rien ajouter. Le lendemain, il marchait devant."]
        ] },
      map: 'citadelle', opts: { time: 'dawn' }, start: 'salle', party: ['caid', 'capitaine', 'geometre'],
      npcs: [
        { id: 'anir', name: 'Anir, la sentinelle', at: 'tour', look: { kind: 'soldat', robe: '#6b5a48', head: '#c9bda8' },
          talk: [['say', 'anir', "Je ne demande rien, seigneur."]] },
        { id: 'vieux_garde', name: 'Vieux garde', at: ['remparts', -1, 0], look: { kind: 'soldat', robe: '#5a4632', head: '#bdb6a8', cloak: '#3d2c1e' },
          talk: [['say', 'vieux_garde', "J'ai dit ce que j'avais à dire. Maintenant c'est toi qui veilles."]] },
        { id: 'udad', name: "Udad, officier du rempart", at: ['remparts', 3, 0], look: { kind: 'soldat', robe: '#7a2f2a', head: '#e6dcc4', cloak: '#c9a13f' },
          talk: [['say', 'udad', "Triste affaire, seigneur. La jeunesse ne sait plus veiller. Fais un exemple, et vite : le rempart en a besoin."]] },
        { id: 'imam', name: 'Le vieil imam', at: ['mosquee', 1, 1], look: { kind: 'ancien', robe: '#e9e2d0', head: '#f4f0e6' }, talk: [
          ['say', 'imam', "Ton père le répétait à chaque relève : « Celui qui veille porte le sommeil de tous. Qui lui vole son repos vole la ville entière. »"],
          ['say', 'imam', "Il parlait de la sentinelle. Je crois qu'il parlait aussi de lui."],
          ['codex', 'sentinelle'],
          ['say', 'imam', "Ton capitaine ? Je ne le vois plus à l'aube, depuis ses nuits de rempart. Il dit qu'il rattrapera. On ne rattrape pas ce qu'on a cessé d'attendre : on y revient."]
        ] },
        { id: 'meksa', name: 'Amghar Meksa', at: 'cour', hidden: true, look: { kind: 'berbere', robe: '#3f5a3a', head: '#e6dcc4', cloak: '#2a2a3a' } }
      ],
      chests: [{ at: ['remparts', 1, 1], gear: 'bouclier_lamt' }, { at: ['tour', 1, 1], item: 'miel', n: 1 }, { at: ['greniers', 0, 1], item: 'pain', n: 2 }],
      intro: [
        ['flag', 'v2_egale', false], ['flag', 'v2_meksa', false],
        ['title', 'La Sentinelle', 'Veillée de la Justice'],
        ['mus', 'citadelle'],
        ['nar', "À l'aube, on m'a amené une sentinelle trouvée endormie sur le rempart du nord. La loi de mon père tient en une ligne : qui dort à son poste meurt, car sur sa veille repose le sommeil de tous."],
        ['nar', "Mon père disait : « Une loi qu'on applique en tremblant est déjà morte. Une loi qu'on applique sans regarder l'homme tue deux fois. » Il ne m'a jamais dit laquelle des deux fautes était la pire."],
        ['nar', "L'homme a dix-sept ans. On l'a mis dans la tour. Il ne demande rien, et c'est cela qui m'arrête."],
        ['codex', 'caid_bio']
      ],
      objectives: [
        { text: "Interroger la sentinelle, dans la tour", talk: 'anir', then: [
          ['say', 'anir', "J'ai dormi, seigneur. On m'a trouvé assis, la lance entre les genoux. Je ne demande pas de grâce."],
          ['say', 'caid', "Combien de veilles avais-tu faites quand tu t'es assis ?"],
          ['say', 'anir', "…La mienne."],
          ['say', 'capitaine', "Il ment mal, seigneur. Un homme qui n'a fait qu'une veille dort couché, pas assis. Celui-là s'est battu contre le sommeil jusqu'au bout."],
          ['say', 'geometre', "La loi dit : qui dort meurt. Elle ne dit pas ce qu'on fait de celui qui a empêché de dormir. Il faudrait entendre le rempart."]
        ] },
        { text: "Faire parler le rempart : le vieux garde sait", talk: 'vieux_garde', then: [
          ['say', 'vieux_garde', "Tu veux savoir ? Alors demande-le comme ton père : sans témoin et sans promesse."],
          ['say', 'vieux_garde', "Le petit a fait trois veilles d'affilée. La sienne, et celles de deux fils de marchands qui dormaient dans leur lit. L'officier Udad vend des dispenses. Dix pièces la nuit. Tout le rempart le sait."],
          ['say', 'caid', "Et personne n'a parlé."],
          ['say', 'vieux_garde', "Udad est le neveu de l'amghar Meksa, qui tient ta porte du sud avec trois cents lances. On ne parle pas contre trois cents lances. On dort debout, et on espère que ce sera un autre qui tombera."],
          ['codex', 'dispenses'], ['pillar', 'savoir', 1],
          ['say', 'capitaine', "Je l'ignorais, seigneur. C'est ma faute autant que la sienne : un capitaine qui ne sait pas ce qui se vend sur son rempart ne le commande pas."]
        ] },
        { text: "Prier à la mosquée avant de juger", goto: 'mosquee', then: [
          ['nar', "Midi. J'ai laissé le jugement à la porte, comme on laisse ses sandales, et je suis entré."],
          ['pray', 'dhuhr'],
          ['show', 'meksa'],
          ['say', 'capitaine', "L'amghar Meksa vient d'entrer dans la cour avec trente cavaliers. Quelqu'un l'a prévenu avant nous. Udad, je suppose."]
        ] },
        { text: "Recevoir l'amghar Meksa dans la cour", talk: 'meksa', then: [
          ['mus', 'conseil'],
          ['say', 'meksa', "On me dit que tu fouilles dans les affaires de mon neveu pour sauver un dormeur. Je suis venu t'éviter une erreur."],
          ['parley', {
            with: 'meksa', title: "L'amghar et son neveu",
            intro: "Meksa tient la porte du sud. Il ne défend pas la faute d'Udad : il défend son rang. Il lui faut une issue qui ne l'humilie pas.",
            goal: 6,
            rounds: [
              { say: "Udad est mon neveu. On ne juge pas le neveu d'un allié pour le sommeil d'un valet d'armes.", opts: [
                { t: "On le juge pour le sommeil qu'il a vendu : deux dispenses, payées en argent, la nuit même. Tout le rempart en témoignera.", el: 'ilm', v: 3, need: 'dispenses', r: "…Deux dispenses. Cela, on ne me l'avait pas dit. Continue." },
                { t: "La loi de mon père ne connaît ni neveu ni valet. Elle connaît le rempart.", el: 'adl', v: 2, r: "Ton père savait fermer les yeux quand il le fallait." },
                { t: "Tes trois cents lances ne me font pas peur.", el: 'shajaa', v: -1, r: "Elles devraient. Elles gardent ta porte du sud." }
              ] },
              { say: "Admettons une faute. Qu'on le blâme en privé. Un chef ne livre pas les siens à la place publique.", opts: [
                { t: "« Qui vole son repos à la sentinelle vole la ville entière. » Ce qu'on a volé à tous se rend devant tous.", el: 'ilm', v: 3, need: 'sentinelle', r: "La parole de ton père. Je l'ai entendue de sa bouche, à la relève, il y a vingt ans." },
                { t: "Si je cache sa faute, je la fais mienne, et la tienne avec. Un jugement à portes ouvertes te lave ; un arrangement te lie.", el: 'sidq', v: 2, r: "Tu parles pour mon honneur mieux que mon neveu ne l'a gardé." },
                { t: "Soit. En privé.", el: 'rahma', v: -1, r: "Bien. …Tu cèdes vite, pour un fils de ton père." }
              ] },
              { say: "Et si je reprends mes lances ? Ta porte du sud sera nue avant la moisson.", opts: [
                { t: "Alors je la garderai moi-même, une nuit sur trois, comme Anir. Mais je ne vendrai pas la loi pour une porte.", el: 'sabr', v: 2, r: "Tu le ferais. Par ma barbe, tu le ferais." },
                { t: "Tu ne les reprendras pas : tu as besoin de mon puits.", el: 'adl', v: 0, r: "C'est vrai. Et je n'aime pas qu'on me le rappelle." },
                { t: "Reprends-les, et je me souviendrai de qui m'a quitté.", el: 'shajaa', v: -2, r: "Menace d'enfant." }
              ] },
              { say: "Que lui feras-tu, à Udad ?", opts: [
                { t: "Ce que dira le juge, pas ce que dira ma colère. Et tu siégeras à côté de lui, pour voir que rien n'est ajouté.", el: 'adl', v: 2, r: "Tu me fais juge de mon propre sang. C'est dur. C'est droit." },
                { t: "Il rendra l'argent au double, et montera la garde un an au poste qu'il a vendu.", el: 'sidq', v: 1, r: "Un an de rempart… Il en reviendra peut-être homme." },
                { t: "Rien de grave, rassure-toi.", el: 'rahma', v: -1, r: "Alors à quoi bon tout ce bruit ?" }
              ] }
            ],
            win: [
              ['say', 'meksa', "Je te l'amènerai moi-même. Qu'on ne dise pas qu'il a fallu des gardes pour traîner un homme de mon sang devant le juge."],
              ['flag', 'v2_meksa'], ['pillar', 'lien', 1], ['sfx', 'light']
            ],
            lose: [
              ['say', 'meksa', "Alors garde ta porte du sud toi-même. Mes lances rentrent chez elles."],
              ['pillar', 'lien', -1],
              ['nar', "Il est parti, et la citadelle entière a retenu son souffle. Puis j'ai senti monter des maisons une pensée douce et lourde : à quoi bon savoir ? Qu'on punisse le petit, et qu'on dorme."],
              ['battle', { group: ['sommeil', 'dispense'], bg: 'ville', boss: true, intro: "Le Sommeil : le désir de toute une ville de ne pas savoir. La Justice, le Courage, la Patience et le Savoir le déchirent." }],
              ['nar', "La torpeur s'est déchirée. On a pris Udad à la poterne, une bourse à la ceinture. Mais la porte du sud est restée nue jusqu'à la moisson, et j'y ai monté la garde plus d'une nuit."]
            ]
          }]
        ] },
        { text: "Rendre le jugement, dans la salle", goto: 'salle', then: [
          ['nar', "La salle du jugement. À ma droite la sentinelle, à ma gauche l'officier. Les quarante hommes du rempart se tenaient au fond, et pas un ne me regardait : ils regardaient ce que j'allais faire de la loi."],
          ['ask', "Que prononce le Caïd ?", [
            { t: "La même loi pour tous : Udad répond de la veille vendue ; Anir, qui a veillé pour trois, est châtié mais vit.", r: [
              ['flag', 'v2_egale'], ['pillar', 'justice', 2],
              ['say', 'caid', "Anir : trente nuits de garde, et tu apprendras aux recrues ce que coûte un rempart. Udad : tu rends l'argent au double, tu perds ton rang, et tu montes la garde un an au poste que tu as vendu."],
              ['nar', "Les quarante n'ont rien dit. Mais à la relève du soir, pour la première fois depuis la mort de mon père, il n'en manquait aucun."]
            ] },
            { t: "La lettre de la loi : Anir meurt à l'aube. Udad paiera une amende.", r: [
              ['pillar', 'justice', -1], ['pillar', 'lien', -1],
              ['nar', "Il est mort debout, sans un mot. La loi était sauve. Et chaque sentinelle a compris, cette nuit-là, que le rempart frappait celui qui s'épuise à le garder et ménageait celui qui le vend."]
            ] },
            { t: "La grâce pour tous : la citadelle a besoin de calme, on efface.", r: [
              ['pillar', 'justice', -1],
              ['nar', "J'ai cru faire miséricorde. À la lune suivante, les dispenses se vendaient deux fois plus cher : j'avais seulement appris à tous que la veille avait un prix, et que le Caïd ne le réclamait pas."]
            ] }
          ]],
          ['mus', 'espoir'],
          ['if', 'v2_egale', [
            ['nar', "J'ai fait ce jour-là ce qu'avait fait 'Umar : j'ai tenu la même balance pour le neveu du puissant et pour le valet d'armes. Et la nuit suivante j'ai dormi sans garde à ma porte, parce qu'il n'y avait plus personne, dans mes murs, à qui je devais quelque chose."]
          ], [
            ['nar', "Je n'ai pas fait ce jour-là ce qu'avait fait 'Umar. Lui pesait le fort et le faible sur la même balance. Moi j'ai laissé la mienne pencher, et depuis je fais garder ma porte : celui qui a été injuste ne dort plus que d'un œil."]
          ]],
          ['codex', 'piliers'], ['codex', 'fiction_veillees']
        ] }
      ]
    },

    /* ============ III — LE GÉNÉRAL ET LA TOUR (Courage de rengainer) ============ */
    {
      id: 'v_khalid', after: 'khalid', minLvl: 6, last: true, hajj: true,
      // bataille déclarée, sans rangs : les armes nourrissent le Tambour
      bataille: { rangs: [], mot: 'Les armes le nourrissent : on n’aligne personne contre lui.' },
      title: 'Le Général et la Tour', sub: 'Veillée du Courage · après Khâlid',
      enigme: { id: 'bahram_deperit', who: 'geometre', cure: 'visite', title: 'Maître Bahrâm ne mange plus',
        signe: "Maître Bahrâm ne mange presque plus, et ses mains tremblent.",
        mot: "Ce qui lui manquait : une porte où il ne frappait plus, celle d'un vieil ami.",
        intro: [['nar', "Maître Bahrâm ne mange presque plus, et ses mains tremblent sur le compas. Le médecin n'a rien trouvé. Lui dit que c'est l'âge."]],
        solved: [
          ['say', 'geometre', "Farrokh et moi ne nous parlions plus depuis l'hiver. Une pente mal calculée, un mot de trop. Vingt ans d'exil ensemble, et je passais devant sa porte sans frapper."],
          ['nar', "Il a frappé. On a entendu deux vieux hommes rire d'une erreur de calcul. Le soir, ses mains ne tremblaient plus."]
        ] },
      map: 'citadelle', opts: { time: 'day' }, start: 'porte', party: ['caid', 'geometre', 'capitaine'],
      npcs: [
        { id: 'izem', name: 'Izem, le général', at: 'cour', look: { kind: 'soldat', robe: '#8e2f2a', head: '#e6dcc4', cloak: '#c9a13f' },
          talk: [['say', 'izem', "J'attends ton mot, seigneur. Les hommes aussi."]] },
        { id: 'yishaq', name: 'Maître Yishaq, caravanier', at: 'souk', look: { kind: 'marchand', robe: '#3d5a6a', head: '#e9e2d0', cloak: '#6b5a48' },
          talk: [['say', 'yishaq', "Quand tu partiras pour l'oasis, je marcherai devant. Ils me connaissent."]] },
        { id: 'farrokh', name: 'Farrokh, géomètre', at: ['puits', 1, 1], look: { kind: 'perse', robe: '#2d6e8e', head: '#e7d9a8' }, talk: [
          ['if', 'v3_farrokh', [
            ['say', 'farrokh', "Une pente d'un doigt pour cent pas, seigneur. Pas davantage : l'eau pressée emporte la galerie."]
          ], [
            ['say', 'farrokh', "Ton puits baisse aussi, seigneur. Moins vite que le leur, parce que tu bois en amont. Il y a une autre façon de prendre l'eau : une galerie en pente très douce, depuis le pied de la montagne. Chez nous on dit kârêz ; ici, foggara."],
            ['say', 'farrokh', "L'eau vient seule, sans qu'on la porte, et elle arrive à tous ceux qui ont creusé. C'est son défaut, pour un prince : on ne peut pas la couper à l'un sans la couper à l'autre."],
            ['codex', 'foggara'], ['pillar', 'savoir', 1], ['flag', 'v3_farrokh']
          ]]
        ] },
        { id: 'cyprien', name: 'Frère Cyprien, moine-médecin', at: 'jardin', look: { kind: 'moine', robe: '#4a3f38', head: '#4a3f38' }, talk: [
          ['say', 'cyprien', "Je soigne vos blessés et les leurs sur la même natte, seigneur. La fièvre ne demande pas de quel côté du mur on est né."],
          ['say', 'cyprien', "Maître Bahrâm ? Je l'ai examiné : le corps n'a rien. Mais je ne le vois plus chez Farrokh depuis l'hiver, et ces deux-là ne passaient pas un soir l'un sans l'autre."],
          ['say', 'cyprien', "Si tu vas à l'oasis, rappelle-leur ceci : après la grande crue, il y a six ans, ce sont tes géomètres perses qui ont recompté leurs champs, borne par borne, sans rien demander. Les anciens ne l'ont pas oublié."],
          ['codex', 'geometres']
        ] },
        { id: 'warsen', name: "L'ancien Warsen", map: 'desert', at: 'oasis', look: { kind: 'ancien', robe: '#7a6a4a', head: '#e6dcc4' },
          talk: [['say', 'warsen', "Parle, Caïd. Nous avons soif, mais nous avons encore des oreilles."]] }
      ],
      chests: [{ at: ['souk', 1, 1], gear: 'cheche' }, { at: ['palmeraie', 1, 0], item: 'dattes', n: 2 }, { map: 'desert', at: ['oasis', -2, 1], item: 'eau', n: 2 }],
      intro: [
        ['flag', 'v3_pacte', false], ['flag', 'v3_rengaine', false], ['flag', 'v3_farrokh', false],
        ['title', 'Le Général et la Tour', 'Veillée du Courage'],
        ['mus', 'citadelle'],
        ['nar', "Mon général est rentré vainqueur, et la ville a crié son nom plus fort que l'appel à la prière. J'ai aimé ce cri. C'est ainsi que j'ai su qu'il était dangereux."],
        ['nar', "Il reste l'oasis du sud, qui a fermé ses vannes et refuse l'impôt de l'eau. Izem demande trois jours et mille hommes."],
        ['nar', "Mon père disait : « Ce que tu prends par la lance, il te faudra le garder par la lance. Ce que tu bâtis avec eux, ils le garderont pour toi. »"],
        ['codex', 'caid_bio']
      ],
      objectives: [
        { text: "Entendre le général Izem, dans la cour", talk: 'izem', then: [
          ['say', 'izem', "Trois jours, seigneur. L'oasis tombera comme une datte mûre. Les hommes n'attendent que ton mot. Ou le mien."],
          ['say', 'caid', "Ou le tien."],
          ['say', 'izem', "Je n'ai rien dit de tel."],
          ['say', 'geometre', "Tu l'as dit assez bas pour qu'on l'entende, général."],
          ['say', 'caid', "Tu auras ma réponse après la prière de l'après-midi. D'ici là, tes hommes restent dans leurs quartiers. Je veux d'abord savoir pourquoi une oasis qui payait depuis trente ans a cessé de payer."]
        ] },
        { text: "Chercher une autre voie : le caravanier Yishaq, au souk", talk: 'yishaq', then: [
          ['say', 'yishaq', "Je porte leur sel et leurs dattes depuis vingt ans, seigneur, comme mon père avant moi. Ils n'ont pas fermé leurs vannes par orgueil. Leur nappe baisse. Ils ont peur de payer ton eau et d'avoir soif quand même."],
          ['say', 'caid', "Porterais-tu une parole de ma part ?"],
          ['say', 'yishaq', "Une parole, oui. Une menace, non : on ne me rouvrirait pas la porte, et j'ai des gens à nourrir des deux côtés du désert. Si tu y vas toi-même, je marche devant. Ils sauront que tu ne viens pas en armes."],
          ['say', 'capitaine', "Farrokh relève le niveau du puits, et le frère Cyprien est au jardin avec les blessés. Si tu veux des raisons plutôt que des lances, c'est eux qu'il faut entendre avant de partir."]
        ] },
        { text: "Prier à la mosquée, puis partir pour l'oasis", goto: 'mosquee', then: [
          ['pray', 'asr'],
          ['nar', "J'ai prié, et j'ai compris en me relevant ce qui me retenait d'ordonner l'assaut. Ce n'était pas la pitié. C'était que j'aurais aimé, moi aussi, qu'on crie mon nom."],
          ['say', 'caid', "Zîrî, fais dire à Izem que je vais à l'oasis ce soir. Avec un caravanier, un géomètre et toi. Nous sortons par la poterne, à pied."],
          ['map', 'desert', 'oasis', { time: 'dusk' }],
          ['mus', 'desert'],
          ['nar', "L'oasis au couchant. Des palmes grises de poussière, des rigoles à sec, et sur le mur de terre les anciens assis en rang, qui nous regardaient venir."]
        ] },
        { text: "Parler aux anciens de l'oasis", talk: 'warsen', then: [
          ['mus', 'conseil'],
          ['parley', {
            with: 'warsen', title: "Les anciens de l'oasis",
            intro: "Ils n'ont pas fermé leurs vannes par défi : leur nappe baisse. Ils craignent la soif, et plus encore le général.",
            goal: 7,
            rounds: [
              { say: "Tu viens avec un marchand, un vieux compteur d'étoiles et un seul soldat. Où sont tes mille hommes ?", opts: [
                { t: "Derrière mes murs, l'arme au râtelier. Je suis venu voir votre nappe avant de parler de vos vannes.", el: 'sabr', v: 2, r: "Voir notre nappe ? En trente ans, personne ne l'a demandé." },
                { t: "Mon général les voulait ici ce soir. J'ai dit non. Je ne sais pas combien de temps mon non tiendra.", el: 'sidq', v: 1, r: "Au moins tu ne nous prends pas pour des sots." },
                { t: "Ils attendent mon signe.", el: 'shajaa', v: -2, r: "Alors fais-le, et ne perdons pas la soirée." }
              ] },
              { say: "Notre nappe baisse d'une coudée par an. Ta citadelle boit en amont. Voilà toute notre révolte : nous avons soif.", opts: [
                { t: "Alors creusons. Une galerie depuis le pied de la montagne, en pente douce : l'eau viendra à vous comme à nous, sans qu'on la porte.", el: 'ilm', v: 3, need: 'foggara', r: "Une rivière sous la terre… Qui sait faire cela ?" },
                { t: "Tant que la nappe sera basse, l'impôt de l'eau sera réduit de moitié.", el: 'adl', v: 2, r: "La moitié d'un impôt sur la soif reste un impôt. Mais c'est un geste." },
                { t: "Chacun sa nappe. La mienne est en amont, c'est ainsi.", el: 'adl', v: -1, r: "C'est ainsi. Et c'est pour cela que nos vannes sont fermées." }
              ] },
              { say: "Qui creuserait ? Tes Perses ? Des étrangers dans nos jardins ?", opts: [
                { t: "Demandez à vos anciens qui a recompté vos champs après la grande crue, borne par borne, sans rien demander. C'étaient eux.", el: 'ilm', v: 3, need: 'geometres', r: "…C'étaient eux. Mon propre champ a retrouvé ses bornes grâce à leurs cordes." },
                { t: "Mes géomètres traceront ; vos hommes et les miens creuseront, puits après puits. Qui a porté la même terre ne se bat plus pour la même eau.", el: 'sabr', v: 2, r: "Mon grand-père disait quelque chose d'approchant." },
                { t: "Ils creuseront sous bonne garde.", el: 'shajaa', v: -1, r: "Sous garde : des prisonniers, donc. Eux, ou nous." }
              ] },
              { say: "Et ton général ? On dit qu'il a promis nos palmiers à ses cavaliers.", opts: [
                { t: "Il ne commandera pas ici. Je t'en donne ma parole devant Yishaq, qui la portera partout où passent ses chameaux.", el: 'sidq', v: 2, r: "Une parole que portent les caravanes, on ne la reprend pas." },
                { t: "Izem m'obéit.", el: 'shajaa', v: 0, r: "Aujourd'hui. Et demain, quand la ville criera encore son nom ?" },
                { t: "Il aura sa part ailleurs.", el: 'adl', v: -1, r: "Sa part de quoi ? De quelle autre oasis ?" }
              ] }
            ],
            win: [
              ['say', 'warsen', "Nous rouvrirons les vannes le jour où le premier puits de ta galerie sera creusé. Pas avant. Mais ce jour-là, mes fils creuseront le deuxième."],
              ['flag', 'v3_pacte'], ['pillar', 'lien', 2], ['sfx', 'light'],
              ['nar', "Onze lunes de chantier. Des hommes qui s'étaient battus pour une rigole se sont passé des paniers de terre. Quand l'eau est sortie au pied de leur mur, personne n'a su dire à qui elle appartenait, et c'était exactement ce que je voulais."]
            ],
            lose: [
              ['say', 'warsen', "Tu parles bien, Caïd. Mais nous avons soif, et les mots ne se boivent pas. Rentre chez toi."],
              ['nar', "Izem n'a pas attendu mon retour : la nouvelle de l'échec a suffi. Les tambours ont roulé toute la nuit, et au matin mille hommes marchaient sur l'oasis en criant son nom."],
              ['battle', { group: ['tambour'], bg: 'desert', boss: true, intro: "Le Tambour : la gloire qui marche toute seule. Les armes le nourrissent ; la Patience et la Miséricorde le font taire." }],
              ['pillar', 'lien', -1],
              ['nar', "L'oasis est tombée en trois jours, comme il l'avait promis. Depuis, il y faut une garnison, et les palmiers donnent moins : on ne fait pas mûrir des dattes à des gens qui vous regardent en silence."]
            ]
          }],
          ['map', 'citadelle', 'cour', { time: 'night' }],
          ['mus', 'citadelle']
        ] },
        { text: "Retrouver Izem dans la cour", talk: 'izem', then: [
          ['if', 'v3_pacte', [
            ['say', 'izem', "Tu as fait la paix sans moi. La ville dit que tu as eu peur. Elle dit aussi que j'aurais pris l'oasis en trois jours. Que veux-tu que je réponde à cela, seigneur ?"]
          ], [
            ['say', 'izem', "L'oasis est à toi, seigneur. Les hommes demandent quand nous marchons sur la suivante. Ils disent qu'avec moi on ne perd jamais."]
          ]],
          ['say', 'geometre', "Voilà le nœud. Ce n'est pas qu'il te désobéisse. C'est qu'ils ne disent plus « nous »."],
          ['ask', "Que fait le Caïd de son général vainqueur ?", [
            { t: "Lui retirer le commandement et lui confier le chantier de l'eau : qu'on sache que la victoire ne vient pas de lui.", r: [
              ['flag', 'v3_rengaine'], ['pillar', 'lien', 1], ['pillar', 'justice', 1],
              ['say', 'izem', "Tu me destitues. Après ce que j'ai gagné pour toi."],
              ['say', 'caid', "Parce que tu l'as gagné. Ils disent ton nom là où ils disaient « nous ». Je ne te reproche rien, Izem. Je te demande plus que la victoire."],
              ['nar', "Il a posé son sabre sur la table du conseil. Il a dit : « Je ne me suis jamais battu pour toi. » Le lendemain il était au chantier, une pioche à la main, et les hommes, le voyant, ont pris des pioches."]
            ] },
            { t: "Le laisser à la tête des troupes : on ne se prive pas d'un vainqueur.", r: [
              ['pillar', 'lien', -1],
              ['nar', "Il est resté. La ville a continué de crier son nom, lui de s'en défendre, et moi de sourire. Un jour j'ai compris que je ne commandais plus mon armée : je la lui empruntais."]
            ] },
            { t: "L'éloigner de nuit, sans un mot, vers un poste lointain.", r: [
              ['pillar', 'justice', -1],
              ['nar', "Il est parti sans se plaindre, ce qui m'a fait plus honte que des cris. J'avais eu peur d'un homme loyal, et je l'avais traité en coupable. La ville l'a su, et elle l'a compté à ma charge."]
            ] }
          ]],
          ['mus', 'espoir'],
          ['if', 'v3_rengaine', [
            ['nar', "J'ai fait ce jour-là ce qu'avait fait 'Umar, et j'ai vu Izem faire ce qu'avait fait Khâlid : rengainer sans amertume, pour que les hommes sachent d'où vient la victoire. Je ne sais lequel de nous deux eut, ce soir-là, le plus de courage. Je crois que ce fut lui."]
          ], [
            ['nar', "Je n'ai pas su faire ce jour-là ce qu'avait fait 'Umar, ni offrir à Izem d'être ce que fut Khâlid. Lui aurait posé l'épée si je le lui avais demandé droit dans les yeux. C'est moi qui n'ai pas eu le courage de le demander."]
          ]],
          ['codex', 'citadelle_lieu'], ['codex', 'piliers'], ['codex', 'fiction_veillees']
        ] }
      ]
    },

    /* ============ IV — LA RUMEUR DU PUITS (Miséricorde) ============ */
    {
      id: 'v_uthman', after: 'uthman', minLvl: 7, last: true, hajj: true,
      title: 'La Rumeur du puits', sub: "Veillée de la Miséricorde · après 'Uthmân",
      enigme: { id: 'caid_veille', who: 'caid', cure: 'aumone', title: 'Le Caïd ne dort plus',
        signe: "Le Caïd ne trouve plus le sommeil.",
        mot: "Ce qui lui manquait : donner. Sa main s'était fermée sur les greniers.",
        intro: [['nar', "Depuis que le puits baisse, je ne dors plus. Je recompte les greniers dans ma tête jusqu'à l'aube. Le médecin dit que je n'ai rien."]],
        solved: [
          ['nar', "J'ai donné sans compter ce que je recomptais chaque nuit. Cette nuit-là, j'ai dormi. Ce n'étaient pas les sacs qui me tenaient éveillé : c'était ma main, fermée dessus."]
        ] },
      map: 'citadelle', opts: { time: 'dusk' }, start: 'salle', party: ['caid', 'geometre', 'capitaine'],
      npcs: [
        { id: 'yishaq', name: 'Maître Yishaq, caravanier', at: 'souk', look: { kind: 'marchand', robe: '#3d5a6a', head: '#e9e2d0', cloak: '#6b5a48' }, talk: [
          ['say', 'yishaq', "On a marqué ma porte à la chaux cette nuit, seigneur. Trois autres de la guilde aussi. Les échoppes sont fermées : personne n'ose vendre, personne n'ose acheter."],
          ['say', 'yishaq', "Mon père est enterré ici, et le sien. Si je pars, je donne raison à la chaux. Je reste. Mais va voir l'école : on s'en prend toujours d'abord à ceux qui tracent des lignes."]
        ] },
        { id: 'farrokh', name: 'Farrokh, géomètre', at: ['ecole', 1, 1], look: { kind: 'perse', robe: '#2d6e8e', head: '#e7d9a8' },
          talk: [['say', 'farrokh', "Nous ne sortirons pas, seigneur. Pas par peur. Pour qu'on ne dise pas que nous avons fui."]] },
        { id: 'porteur', name: "Porteur d'eau", at: ['cour', 1, 1], look: { kind: 'homme', robe: '#6b5a48', head: '#c9bda8', coiffe: 'calotte', manteau: 'aucun', court: true, item: 'outre' }, talk: [
          ['say', 'porteur', "D'où ça vient ? D'un homme qui paie à boire et qui plaint beaucoup le peuple. De belles manches. Il dit qu'il tient ça du palais."],
          ['say', 'porteur', "Moi je porte l'eau, seigneur, je ne la juge pas. Mais un homme qui plaint tant les pauvres sans avoir jamais porté une outre, je m'en méfie."],
          ['say', 'porteur', "Tu as mauvaise mine, seigneur. Chez nous on dit : celui qui compte ses sacs la nuit ferait mieux d'en ouvrir un le jour."],
          ['codex', 'chambellan']
        ] },
        { id: 'amezyan', name: 'Amezyan, le puisatier', at: ['puits', 0, 1], hidden: true, look: { kind: 'berbere', robe: '#5a4632', head: '#d8cfc0' } },
        { id: 'chambellan', name: 'Maymûn, le chambellan', at: ['salle', 2, 0], look: { kind: 'marchand', robe: '#5a2f4a', head: '#e6dcc4', cloak: '#c9a13f' },
          talk: [['say', 'chambellan', "Le peuple souffre, seigneur. Il faut le comprendre. Il faut toujours comprendre le peuple."]] }
      ],
      chests: [{ at: ['cour', 1, 1], gear: 'houlette' }, { at: ['souk', 2, 1], item: 'musc', n: 1 }, { at: ['palmeraie', 0, 1], item: 'eau', n: 2 }],
      intro: [
        ['flag', 'v4_calme', false], ['flag', 'v4_cede', false],
        ['title', 'La Rumeur du puits', 'Veillée de la Miséricorde'],
        ['mus', 'citadelle'],
        ['nar', "Le septième jour de la soif, l'eau du puits a pris un goût. Le huitième, ce goût avait un nom, et ce nom n'était pas le sel : c'était « les étrangers »."],
        ['nar', "Mon père avait donné asile à des géomètres perses chassés par une guerre, et sa parole à la guilde des caravaniers. Ils vivaient chez nous depuis vingt ans. Il a suffi d'une semaine pour qu'on se souvienne qu'ils venaient d'ailleurs."],
        ['nar', "Il disait : « Quand le puits baisse, regarde qui montre du doigt. Celui-là ne cherche pas l'eau. »"],
        ['codex', 'caid_bio']
      ],
      objectives: [
        { text: "Aller à l'école, où les géomètres se sont enfermés", goto: 'ecole', then: [
          ['say', 'farrokh', "Nous avons barré la porte, maître Bahrâm. Les enfants ne sont pas venus ce matin. On leur a dit que nos compas empoisonnaient la terre."],
          ['say', 'geometre', "J'ai fui un pays où l'on brûlait les registres pour effacer les dettes. Je sais reconnaître cette odeur. Seigneur, si ma présence te coûte la paix, dis-le : je suis trop vieux pour avoir peur d'une route."],
          ['say', 'caid', "Personne ne prendra de route. Tu vas faire ce que tu sais faire : mesurer. Devant tout le monde, au puits, avec leur seau et leur corde."],
          ['codex', 'geometres']
        ] },
        { text: "Faire vérifier l'eau, au puits", goto: 'puits', then: [
          ['nar', "Bahrâm a fait descendre le seau trois fois : en surface, à mi-corde, au fond. Il a goûté, fait goûter, puis il a jeté une poignée de l'eau du fond sur une pierre chaude, et chacun a vu le blanc qu'elle laissait."],
          ['say', 'geometre', "Du sel. Ni poison ni sortilège. Quand la nappe baisse, l'eau douce s'en va la première et l'eau amère du fond remonte. Ce puits n'a pas besoin d'un coupable : il a besoin de dix coudées de plus."],
          ['codex', 'eau_saumatre'], ['pillar', 'savoir', 1],
          ['show', 'amezyan'],
          ['nar', "Mais ceux qui avaient vu étaient trente, et ceux qui arrivaient par les ruelles étaient trois cents, avec des outres vides et une phrase toute faite. À leur tête, Amezyan le puisatier, un homme honnête : c'est ce qui rendait la chose grave."],
          ['say', 'capitaine', "Le soir tombe, seigneur. Si tu veux leur parler, c'est maintenant ou c'est à la lueur des torches. Et je n'aime pas les torches."]
        ] },
        { text: "Prier le couchant, puis décider comment aller à la foule", goto: 'mosquee', then: [
          ['pray', 'maghrib'],
          ['nar', "J'ai prié au couchant, avec dans le dos le bruit de la foule. J'ai demandé de ne pas haïr ceux qui se trompaient : c'est plus difficile que de ne pas haïr ceux qui mentent."],
          ['ask', "Comment le Caïd va-t-il au-devant de la foule ?", [
            { t: "Sans garde, à pied, avec Bahrâm à mon côté.", r: [
              ['pillar', 'lien', 1],
              ['say', 'capitaine', "C'est une folie, seigneur. …C'est aussi ce qu'aurait fait ton père. Je marcherai dix pas derrière, sans lance."]
            ] },
            { t: "Faire d'abord garder l'école et le souk, puis aller leur parler.", r: [
              ['say', 'capitaine', "Vingt hommes à l'école, vingt au souk, la lance basse. Ils ne frapperont que si l'on force les portes."],
              ['nar', "C'était la prudence. La foule a vu les lances avant de voir mon visage, et il m'a fallu parler plus longtemps pour être cru."]
            ] },
            { t: "Leur donner un gage : que les caravaniers quittent la ville quelques jours.", r: [
              ['flag', 'v4_cede'], ['pillar', 'justice', -2],
              ['nar', "J'ai fait dire à Yishaq de partir avant la nuit. Il n'a pas discuté. La foule a applaudi, puis elle s'est tournée vers l'école : puisque j'avais chassé les uns, c'est qu'ils étaient coupables, et les autres avec eux."]
            ] }
          ]]
        ] },
        { text: "Parler à la foule : Amezyan attend au puits", talk: 'amezyan', then: [
          ['mus', 'conseil'],
          ['parley', {
            with: 'amezyan', title: 'La foule du puits',
            intro: "Trois cents hommes qui ont soif depuis huit jours. Ils ne sont pas méchants : ils veulent que leur soif soit la faute de quelqu'un.",
            goal: 6,
            rounds: [
              { say: "L'eau a changé de goût depuis que tes étrangers tracent leurs lignes autour du puits. Dis que c'est un hasard.", opts: [
                { t: "Ce n'est pas un hasard, c'est le sel : quand la nappe baisse, il remonte. Goûtez l'eau du haut, puis celle du fond.", el: 'ilm', v: 3, need: 'eau_saumatre', r: "…Celle du fond est plus amère. C'est vrai. Je le savais sans le savoir : je suis puisatier." },
                { t: "Je bois cette eau comme vous. Tirez-moi un seau.", el: 'sidq', v: 2, r: "Tu bois. D'habitude, les grands ont d'autres citernes." },
                { t: "Rentrez chez vous. C'est un ordre.", el: 'shajaa', v: -2, r: "Voilà huit jours qu'on rentre chez nous avec des outres vides." }
              ] },
              { say: "On nous a dit, de bonne source, que les caravaniers ont vendu notre eau à l'oasis, et que les Perses ont payé pour qu'on se taise.",
                noir: { name: "La Rancune", group: ['noir_rancune'], intro: "Trois cents hommes ont soif, et leur soif a trouvé un nom à maudire. Tant qu'elle criera, personne n'entendra parler d'eau.", after: "… Parle. On t'écoute. Mais parle d'eau." },
                opts: [
                { t: "Ta bonne source a de belles manches et plaint beaucoup le peuple : c'est mon chambellan. Je le ferai parler devant vous.", el: 'adl', v: 3, need: 'chambellan', r: "De ta maison ? Alors on nous a menés comme des bêtes à l'abreuvoir." },
                { t: "« De bonne source » : laquelle ? Nommez l'homme. À une parole sans visage, on ne doit rien.", el: 'sidq', v: 2, r: "Un homme du palais… Personne ne sait son nom, à vrai dire." },
                { t: "Les caravaniers quitteront la ville, si c'est ce qu'il faut.", el: 'rahma', v: -2, r: "Tu vois bien qu'ils sont coupables, puisque tu les chasses !" }
              ] },
              { say: "Tu défends des gens qui ne prient pas comme nous et qui comptent dans une autre langue.", opts: [
                { t: "Ils boivent au même puits, enterrent leurs morts dans la même terre, et mon père leur a donné sa parole. Je ne la reprendrai pas.", el: 'rahma', v: 2, r: "La parole de ton père… On l'a vue tenir, c'est vrai." },
                { t: "Qui a mesuré vos champs après la crue ? Qui a porté votre sel vingt ans ? Vous le savez.", el: 'ilm', v: 1, r: "On le sait. On l'oublie quand on a soif." },
                { t: "Leur foi ne vous regarde pas.", el: 'adl', v: 0, r: "Tout nous regarde, quand le puits baisse." }
              ] },
              { say: "Alors donne-nous quelqu'un. Il faut bien que la soif soit la faute de quelqu'un.", opts: [
                { t: "Non. Je vous donne une pioche, pas un coupable. Demain à l'aube, tous au puits : nous le creusons de dix coudées, eux avec nous.", el: 'sabr', v: 2, r: "Creuser… avec eux ? …Soit. Avec eux." },
                { t: "Prenez-moi, s'il vous faut un nom.", el: 'rahma', v: 1, r: "On ne veut pas de ton nom, seigneur. On veut de l'eau." },
                { t: "Vous aurez un coupable quand l'enquête aura parlé.", el: 'adl', v: 0, r: "Et d'ici là ? La colère n'attend pas les enquêtes." }
              ] }
            ],
            win: [
              ['say', 'amezyan', "Demain à l'aube, au puits, avec des pioches. Et celui qui marquera encore une porte à la chaux aura affaire à moi."],
              ['flag', 'v4_calme'], ['pillar', 'lien', 1], ['sfx', 'light'],
              ['nar', "On a creusé dix coudées en neuf jours : les nôtres, les Perses, les gens de la guilde. L'eau douce est revenue. La honte aussi, chez quelques-uns, et je n'ai rien fait pour la leur ôter."]
            ],
            lose: [
              ['say', 'amezyan', "On t'a écouté, seigneur. Mais on a soif depuis huit jours, et toi tu défends des compas. Écarte-toi."],
              ['nar', "La foule a coulé vers l'école comme l'eau trouve la pente. Zîrî s'est mis en travers de la porte, sans lance. Et au-dessus des têtes j'ai vu ce qui les menait : un masque vide, qui cherchait un visage à qui s'ajuster."],
              ['battle', { group: ['bouc', 'on_dit'], bg: 'ville', boss: true, intro: "Le Bouc émissaire : la soif de coupable d'une foule entière. La Miséricorde, le Savoir et la Véracité le brisent." }],
              ['pillar', 'lien', -1],
              ['nar', "Il n'y eut pas de mort, parce que Zîrî tint la porte et que le masque se brisa avant les crânes. Mais des registres furent déchirés, trois échoppes brûlées, et pendant un an les enfants ne revinrent pas à l'école."]
            ]
          }]
        ] },
        { text: "Rentrer dans la salle", goto: 'salle', then: [
          ['if', 'v4_calme', [
            ['nar', "C'est Amezyan lui-même qui m'a amené l'homme aux belles manches : un valet de mon chambellan. Il a parlé avant qu'on l'interroge. Maymûn le payait pour plaindre le peuple, de taverne en taverne, et nommer les étrangers."],
            ['say', 'chambellan', "Seigneur, je n'ai voulu que te protéger. Une foule en colère a besoin d'une pente : j'ai préféré qu'elle coule vers eux plutôt que vers toi."],
            ['ask', "Que fait le Caïd de son chambellan ?", [
              { t: "Le juger à portes ouvertes, devant ceux qu'il a trompés et ceux qu'il a désignés.", r: [
                ['pillar', 'justice', 1],
                ['nar', "Le juge l'a banni et lui a fait rendre l'argent des tavernes. Yishaq a refusé d'assister au jugement : « Je ne veux pas le voir à genoux, seigneur. Je veux seulement rouvrir ma boutique. »"]
              ] },
              { t: "Le chasser cette nuit, sans jugement et sans bruit.", r: [
                ['nar', "Il est parti avant l'aube avec ses secrets. La moitié de ceux qu'il payait est restée dans mes murs, et je n'ai jamais su lesquels."]
              ] },
              { t: "Le garder près de moi : on surveille mieux celui que l'on connaît.", r: [
                ['pillar', 'justice', -1],
                ['nar', "Je l'ai gardé. Les Perses et la guilde l'ont appris, et ils ont compris ce que valait ma protection : elle s'arrêtait au seuil de ma propre maison."]
              ] }
            ]]
          ], [
            ['say', 'chambellan', "Quelle nuit, seigneur. Quelle douleur pour ton peuple. Je l'avais dit à ton père : il y a des hospitalités qu'une ville finit par payer."],
            ['nar', "Il m'a beaucoup plaint, ce soir-là. Je n'ai su que bien plus tard d'où était partie la phrase qui avait couru les tavernes, et qui avait payé à boire à ceux qui la portaient."]
          ]],
          ['mus', 'espoir'],
          ['if', 'v4_cede', [
            ['nar', "Je n'ai pas fait ce jour-là ce qu'avait fait 'Uthmân. Lui a préféré porter seul le poids plutôt que de le faire porter à d'autres. Moi j'ai livré un innocent pour acheter un soir de calme, et j'ai appris qu'une foule à qui l'on donne un coupable revient toujours en chercher un second."]
          ], [
            ['nar', "J'ai fait ce jour-là ce qu'avait fait 'Uthmân dans sa maison assiégée : j'ai refusé que le sang coule pour ma tranquillité, fût-ce celui des égarés. Et j'ai appris de la rumeur ce qu'il en avait appris : elle ne cherche pas la vérité, elle cherche un visage."]
          ]],
          ['codex', 'chambellan'], ['codex', 'piliers'], ['codex', 'fiction_veillees']
        ] }
      ]
    },

    /* ============ V — LES PURS (Savoir) ============ */
    {
      id: 'v_ali', after: 'ali', minLvl: 8, last: true, hajj: true,
      title: 'Les Purs', sub: "Veillée du Savoir · après 'Alî",
      map: 'citadelle', opts: { time: 'day' }, start: 'ecole', party: ['caid', 'geometre', 'capitaine'],
      npcs: [
        { id: 'maitre', name: "Le maître de l'école", at: ['ecole', -1, 1], look: { kind: 'savant', robe: '#e9e2d0', head: '#f4f0e6', cloak: '#8a6d3b' },
          talk: [['say', 'maitre', "Descends, maintenant. Et réponds-leur comme on répond à des élèves qui se trompent : sans mépris, et sans rien céder."]] },
        { id: 'cyprien', name: 'Frère Cyprien', at: ['ecole', 2, 1], look: { kind: 'moine', robe: '#4a3f38', head: '#4a3f38' }, talk: [
          ['say', 'cyprien', "Nos livres sont sous ton toit depuis l'hiver, seigneur. Si l'on vient les brûler, je me tiendrai devant. Je ne suis pas brave : je suis seulement trop vieux pour courir."],
          ['say', 'cyprien', "Ton maître d'école et moi ne prions pas de la même façon. Mais nous recopions les mêmes géomètres, et nous nous prêtons de l'encre. C'est déjà une sorte de pacte."]
        ] },
        { id: 'aderfi', name: 'Aderfi, prêcheur des Purs', at: 'cour', look: { kind: 'homme', robe: '#d8d2c4', head: '#d8d2c4', cloak: '#55504a' },
          talk: [['say', 'aderfi', "Je n'ai qu'une phrase, Caïd. Elle suffit."]] },
        { id: 'pur1', name: 'Un Pur', at: ['cour', 2, 1], look: { kind: 'homme', robe: '#cfc8b8', head: '#cfc8b8' },
          talk: [['say', 'pur1', "La citadelle n'appartient qu'à Dieu ! …C'est tout ce que j'ai à te dire. C'est tout ce qu'il y a à dire."]] }
      ],
      chests: [{ at: ['tour', 1, 0], gear: 'cotte_serree' }, { at: ['ecole', 2, -1], codex: 'slogan_purs' }, { at: ['jardin', 0, 1], item: 'musc', n: 1 }],
      intro: [
        ['flag', 'v5_force', false], ['flag', 'v5_gagne', false],
        ['title', 'Les Purs', 'Veillée du Savoir'],
        ['mus', 'citadelle'],
        ['nar', "L'année du pacte de l'eau, des hommes sont montés du désert avec des visages maigres et une seule phrase. Ils disaient : « La citadelle n'appartient qu'à Dieu. » Et c'était vrai."],
        ['nar', "Ils ajoutaient : donc le Caïd qui a signé avec l'oasis, logé des Perses et abrité les livres des moines n'est plus des nôtres. Cela était faux, mais cousu au vrai d'un fil si fin que le peuple n'y voyait qu'une seule étoffe."],
        ['nar', "Mon père disait : « Méfie-toi de l'homme qui n'a qu'une phrase. Il te tuera pour la garder entière. »"],
        ['codex', 'caid_bio']
      ],
      objectives: [
        { text: "Consulter le maître de l'école", talk: 'maitre', then: [
          ['say', 'maitre', "Ils sont dans la cour depuis l'aube. Ils viennent pour toi, mais ils commenceront par les livres. Ils commencent toujours par les livres : c'est ce qui ne peut pas répondre."],
          ['say', 'caid', "Ils disent que j'ai pactisé, et qu'on ne pactise pas."],
          ['say', 'maitre', "Alors lis avant de descendre. Il y eut un pacte que les meilleurs des hommes trouvèrent amer ; 'Umar lui-même en fut troublé. Au retour, la révélation parla de victoire éclatante. Qui ignore Hudaybiyya croit que toute paix est une défaite."],
          ['codex', 'hudaybiyya'], ['pillar', 'savoir', 1],
          ['say', 'maitre', "Sur le pupitre du fond, il y a un feuillet que ton père avait recopié de sa main. Prends-le. Il te servira plus qu'une cuirasse."]
        ] },
        { text: "Descendre dans la cour, face aux Purs", goto: 'cour', then: [
          ['mus', 'conseil'],
          ['say', 'aderfi', "Caïd ! La citadelle n'appartient qu'à Dieu. Tu as signé avec ceux qui nous fermaient l'eau, logé des compteurs d'étoiles, abrité les livres d'une autre foi. Repens-toi devant tous, ou descends de ce siège."],
          ['say', 'capitaine', "Ils sont deux cents, seigneur, et pas une arme visible. Ce sont les plus dangereux : ils veulent qu'on les frappe."],
          ['ask', "Que fait le Caïd ?", [
            { t: "Débattre devant tous, à la mosquée, livres ouverts.", r: [
              ['pillar', 'savoir', 1],
              ['say', 'caid', "Aderfi, tu m'accuses devant le peuple : réponds-moi devant lui. À la mosquée, après la prière. Apporte ta phrase ; j'apporterai les livres."]
            ] },
            { t: "Les faire chasser par les sentinelles avant qu'ils ne grossissent.", r: [
              ['flag', 'v5_force'], ['pillar', 'justice', -1],
              ['nar', "Zîrî les a poussés hors des murs sans tirer une lame. Ils sont revenus à la nuit, trois fois plus nombreux, avec dans les yeux la joie d'avoir été chassés : je leur avais donné ce qui leur manquait, un tort à raconter. Il a bien fallu débattre, et de plus bas."]
            ] },
            { t: "Céder un gage : renvoyer les livres des moines au monastère.", r: [
              ['pillar', 'savoir', -2],
              ['nar', "Le frère Cyprien a chargé ses livres sur deux mules sans un reproche. Aderfi a loué ma sagesse. Le lendemain il demandait le départ des Perses. On ne rassasie pas un homme qui n'a qu'une phrase : on l'allonge."]
            ] }
          ]],
          ['tp', 'aderfi', ['mosquee', 1, 1]]
        ] },
        { text: "Débattre à la mosquée, devant tous", goto: 'mosquee', then: [
          ['parley', {
            with: 'aderfi', title: 'Le débat des Purs',
            intro: "Aderfi est sincère, et c'est sa force. Il ne veut pas le pouvoir : il veut que rien ne dépasse de sa phrase. Seul le savoir peut la rouvrir.",
            goal: 7,
            rounds: [
              { say: "« La citadelle n'appartient qu'à Dieu. » Oses-tu dire le contraire ?", opts: [
                { t: "Je dis que la phrase est vraie et que tu t'en sers comme d'une lame. « Parole de vérité par laquelle on vise le faux » : 'Alî l'a dit avant moi, à des hommes qui parlaient comme toi.", el: 'ilm', v: 3, need: 'slogan_purs', r: "…Je connais cette parole. Je n'aurais pas cru l'entendre ici." },
                { t: "Je ne dis pas le contraire. Je demande : qui parle pour Lui, ici ? Toi ?", el: 'sidq', v: 2, r: "Je ne parle pas pour Lui. Je rappelle Sa loi." },
                { t: "Je dis que c'est ma citadelle, et celle de mon père.", el: 'shajaa', v: -2, r: "Vous l'entendez ? Il a dit « ma »." }
              ] },
              { say: "Tu as signé un pacte avec des gens qui nous avaient fermé leurs vannes. Pactiser, c'est se soumettre.", opts: [
                { t: "Il y eut un pacte que les meilleurs trouvèrent amer ; au retour, la révélation parla de victoire éclatante. Lis avec moi ce qu'on rapporte d'al-Hudaybiyya.", el: 'ilm', v: 3, need: 'hudaybiyya', r: "C'était le Messager. Tu n'es pas lui. …Mais tu n'as rien inventé, je te l'accorde." },
                { t: "Le pacte a donné de l'eau à leurs enfants et aux nôtres. Montre-moi la loi qui préfère la soif.", el: 'rahma', v: 2, r: "La loi ne se pèse pas à l'outre. …Mais mes frères ont bu de cette eau en venant." },
                { t: "Je n'ai pas à me justifier devant toi.", el: 'adl', v: -1, r: "Devant qui, alors ? Vous voyez : il se croit au-dessus." }
              ] },
              { say: "Tu abrites les livres d'une autre foi et des compteurs d'étoiles. Le savoir qui n'est pas le nôtre est un poison.", opts: [
                { t: "Maître Bahrâm a tracé la galerie qui t'a désaltéré en chemin. Tu as bu sa géométrie ; elle ne t'a fait aucun mal.", el: 'ilm', v: 2, r: "…L'eau n'a pas de doctrine. Soit." },
                { t: "On brûle un livre en une heure ; il faut une vie pour l'écrire. Qui es-tu pour défaire des vies ?", el: 'sabr', v: 1, r: "Je suis celui qui n'a pas peur du feu." },
                { t: "Touche à un seul de ces livres et tu en répondras de ta tête.", el: 'shajaa', v: -2, r: "Menace-moi encore : mes frères n'attendent que cela." }
              ] },
              { say: "Supposons que tu aies raison sur chaque point. Mes frères ont faim de pureté. Que leur offres-tu ?", opts: [
                { t: "Trois choses : la mosquée vous reste ouverte, votre part vous reste due, et je ne lèverai pas la main le premier.", el: 'adl', v: 2, r: "Tu nous traites en frères qui se trompent, non en ennemis." },
                { t: "Une place à l'école, et la mienne à côté. Venez m'interroger chaque vendredi, portes ouvertes : je vous dois des comptes, non mon siège.", el: 'sabr', v: 2, r: "Interroger le Caïd… chaque vendredi ?" },
                { t: "Rien. Vous partirez.", el: 'adl', v: -1, r: "Nous partirons. Et nous reviendrons." }
              ] }
            ],
            win: [
              ['say', 'aderfi', "Tu ne m'as pas convaincu, Caïd. Mais tu m'as répondu, et je ne m'y attendais pas. Je pars. Ceux qui voudront rester s'assiéront à ton école : je ne les retiendrai pas."],
              ['flag', 'v5_gagne'], ['pillar', 'lien', 1], ['pillar', 'savoir', 1], ['sfx', 'light'],
              ['nar', "Ils étaient deux cents le matin. Le soir, cent soixante étaient assis en rond dans la cour de l'école, devant le vieux maître, et posaient des questions comme on boit après une longue marche."]
            ],
            lose: [
              ['say', 'aderfi', "Des mots, des livres, des pactes. Frères, vous avez entendu : il préfère l'encre à la pureté. Nous savons ce qu'il nous reste à faire."],
              ['nar', "Ils sont revenus de nuit, avec des torches, vers l'école. Et au-dessus d'eux marchait une chose faite de lames, droite, étroite, qui n'avait qu'un seul tranchant et se croyait la justice."],
              ['battle', { group: ['pur', 'on_dit'], bg: 'ville', boss: true, intro: "Le Pur : une phrase vraie devenue lame. Il se croit la Justice même ; le Savoir et la Miséricorde le dévoilent." }],
              ['pillar', 'lien', -1],
              ['nar', "Les livres sont saufs. Mais il y eut des blessés dans la presse, et depuis on montre leurs cicatrices en répétant leur phrase."]
            ]
          }]
        ] },
        { text: "Monter au rempart, la nuit venue", goto: 'remparts', then: [
          ['map', 'citadelle', 'remparts', { time: 'night' }],
          ['mus', 'silence'],
          ['pray', 'isha'],
          ['nar', "Cette nuit-là j'ai prié seul sur le rempart, après la dernière prière. Je n'ai rien demandé. Rien ne m'a répondu. Et j'ai compris que ce silence n'était pas une absence : c'était la place qu'on laisse à celui qui doit encore grandir."],
          ['mus', 'espoir'],
          ['if', 'v5_force', [
            ['nar', "Je n'ai pas fait d'abord, ce jour-là, ce qu'avait fait 'Alî. Lui avait envoyé le savoir avant toute autre chose. Moi j'ai commencé par les sentinelles, et j'ai appris qu'on ne chasse pas une phrase : on lui répond, ou elle revient."]
          ], [
            ['nar', "J'ai fait ce jour-là ce qu'avait fait 'Alî devant ceux qui détournaient une parole vraie : j'ai envoyé le savoir avant le sabre, j'ai laissé aux égarés leur mosquée et leur part, et je n'ai pas levé la main le premier."]
          ]],
          ['nar', "Puis j'ai pris le calame, et j'ai écrit pour mon fils ce qu'on m'avait transmis, de témoin en témoin. Les murs que j'ai tenus tomberont. Ce que j'ai reçu, s'il le remet à son tour, ne tombera pas. C'est ainsi que la Chaîne est venue jusqu'à toi, râwî."],
          ['codex', 'citadelle_lieu'], ['codex', 'piliers'], ['codex', 'fiction_veillees']
        ] }
      ]
    }
  ]
});
