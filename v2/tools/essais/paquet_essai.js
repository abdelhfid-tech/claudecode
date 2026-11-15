/* ISNAD 2.0 — le paquet d'essai. PURE FICTION, JAMAIS LIVRÉ.
   Il n'existe que pour les tests (tools/paquet.js) : il prouve qu'un paquet apporte, sans une ligne de code, une saga
   rangée dans un autre livre, des lieux bâtis sur un gabarit, un objet, une pièce d'équipement, un étal et une piste.
   Rien ici ne raconte l'histoire : ni Compagnon, ni événement, ni parole rapportée, ni verset. Le copiste est un
   personnage inventé, dans un lieu inventé. Le fichier est écrit en JavaScript pour porter des commentaires ; l'outil
   le change en JSON, la forme qu'un paquet a partout ailleurs. */
module.exports = {
  id: 'essai', version: 1, moteur: 1,
  titre: 'Paquet d’essai',
  note: 'Pure fiction, pour les tests. Jamais livré.',

  // un deuxième livre sur la Chaîne
  livres: { 2: { titre: 'Livre d’essai' } },

  // deux lieux, sans dessin nouveau : une ville dans sa variante « fleuve », avec sa piste et ses propres noms ; un désert
  lieux: {
    halte_essai: { gabarit: 'ville', nom: 'La Halte', variante: 'fleuve', piste: 'essai_air', noms: { halle: 'Auvent des copistes', colline: null } },
    piste_essai: { gabarit: 'desert', nom: 'La Piste' }
  },

  // un objet de la besace : un effet que le moteur connaît
  objets: {
    figues: { name: 'Figues sèches', desc: 'Rend 30 % de Constance à un compagnon.', hp: 0.3, target: 'ally', vivre: true }
  },

  // une pièce d'équipement d'une famille existante (épée) : un objet ordinaire, sans vertu
  equipement: {
    epee_essai: { t: 'epee', r: 1, name: 'Épée d’atelier', atk: 6, c: ['#c3c8d2', '#6b4a2a'], desc: 'Une lame droite, sortie d’un atelier de la Halte. Rien ne la distingue.' }
  },

  // l'étal du lieu nouveau : la pièce du paquet et des pièces du jeu de base ; et la même pièce ajoutée à un étal existant
  etals: {
    halte_essai: ['epee_essai', 'epee_fer', 'baton_marche', 'calame', 'bouclier_cuir', 'turban', 'tunique'],
    medine: ['epee_essai']
  },

  // une piste, écrite en notes : deux voix de seize temps
  pistes: {
    essai_air: { bpm: 84, beats: 16, voices: [
      { wave: 'flute', vol: 0.5, notes: 'D4/2 F4/1 G4/1 A4/2 G4/1 F4/1 D4/2 E4/1 F4/1 E4/2 D4/2' },
      { wave: 'pluck', vol: 0.4, pan: -0.2, notes: 'D3/1 A3/1 D3/1 A3/1 F3/1 C4/1 F3/1 C4/1 G3/1 D4/1 G3/1 D4/1 A3/1 E4/1 D3/2' }
    ] }
  },

  sagas: [{
    id: 'essai_copiste', order: 1, livre: 2,
    name: 'Le Copiste', epithet: 'Maillon d’essai', arabic: 'تجربة',
    years: 'hors du temps',
    light: 'ilm', lightName: 'Savoir',
    ambiance: 'essai',
    tagline: 'Saga d’essai, de pure fiction : un copiste porte ses feuillets d’une halte à un puits.',
    intro: [
      ['nar', 'Ceci est une saga d’essai. Elle ne raconte rien de l’histoire : elle montre qu’un paquet peut ajouter un maillon à la Chaîne.'],
      ['nar', 'Un copiste inventé, dans une halte inventée, porte des feuillets jusqu’à un puits.']
    ],
    outro: [
      ['nar', 'Les feuillets sont arrivés. L’essai est terminé.'],
      ['light', 'ilm']
    ],
    heroes: {
      copiste: {
        name: 'Le Copiste', title: 'personnage d’essai', arabic: 'ناسخ',
        role: 'sage', el: 'ilm',
        look: { kind: 'savant', robe: '#d8cfb8', head: '#efe7d6', cloak: '#5a4a3a', item: 'feuillets' },
        skills: [
          { lvl: 1, id: 'relire', name: 'Relire', desc: 'Relit la ligne : discerne les failles.', cost: 2, target: 'foe', el: 'ilm', pow: 0.8, fx: [{ st: 'reveal' }], anim: 'glyph' },
          { lvl: 1, id: 'trait', name: 'Trait net', desc: 'Un trait de calame, sans rature.', cost: 3, target: 'foe', el: 'ilm', pow: 1.3, anim: 'light' },
          { lvl: 1, id: 'pause', name: 'Poser la plume', desc: 'Une halte : rend de la Constance à un compagnon.', cost: 4, target: 'ally', heal: 1.0, anim: 'heal' },
          { lvl: 2, id: 'patience', name: 'Recommencer', desc: 'Reprend la page, sans hâte.', cost: 4, target: 'foe', el: 'sabr', pow: 1.3, anim: 'burst' }
        ],
        limit: { id: 'page', name: 'La Page entière', desc: 'Tout est écrit, rien ne manque.', target: 'foes', el: 'ilm', pow: 2.4, fx: [{ st: 'veil', v: -2 }], anim: 'pillar' }
      },
      porteur: {
        name: 'Le Porteur', title: 'personnage d’essai', arabic: 'حامل',
        role: 'gardien', el: 'sidq',
        look: { kind: 'homme', robe: '#7a6a52', head: '#e6dcc4', cloak: '#3d2c1e', item: 'baton' },
        skills: [
          { lvl: 1, id: 'appui', name: 'Coup d’appui', desc: 'Un coup de bâton, bien posé.', cost: 3, target: 'foe', el: 'fer', pow: 1.3, anim: 'slash' },
          { lvl: 1, id: 'tenir', name: 'Tenir la charge', desc: 'Se place devant : garde.', cost: 3, target: 'self', fx: [{ st: 'garde' }, { st: 'taunt' }], anim: 'guard' },
          { lvl: 1, id: 'dire', name: 'Dire ce qui est', desc: 'Une parole droite.', cost: 3, target: 'foe', el: 'sidq', pow: 1.3, anim: 'light' }
        ],
        limit: { id: 'arrivee', name: 'Jusqu’au bout', desc: 'La charge arrive entière.', target: 'foes', el: 'sidq', pow: 2.2, anim: 'burst' }
      }
    },
    enemies: {
      hate_essai: {
        name: 'La Hâte', art: 'wisp', hue: 30, scale: 1,
        lvl: 1, tier: 'minion', weak: ['sabr', 'ilm'], veils: 1,
        skills: [{ w: 2, name: '« Plus vite »', target: 'foe', el: 'fer', pow: 0.9, anim: 'dark' }],
        desc: 'Égrégore d’essai : l’envie d’en finir avant d’avoir bien fait. La patience le dissipe.'
      },
      oubli_essai: {
        name: 'L’Oubli', art: 'mirror', hue: 250, scale: 2,
        lvl: 2, tier: 'elite', weak: ['ilm', 'sidq'], veils: 3,
        skills: [
          { w: 2, name: 'Page blanche', target: 'foes', el: 'fer', pow: 0.7, anim: 'dark' },
          { w: 1, name: 'Effacer', target: 'foe', el: 'fer', pow: 1.0, fx: [{ st: 'mag', v: -1, chance: 0.4 }], anim: 'dark' }
        ],
        phases: [{ at: 0.5, say: 'Personne ne s’en souviendra.', fx: [{ st: 'atk', v: 1 }] }],
        desc: 'Égrégore d’essai : ce que l’on n’écrit pas se perd. Ce que l’on relit lui échappe.',
        racine: 'noir_desespoir'
      }
    },
    codex: [
      { id: 'halte', cat: 'Lieu', title: 'La Halte', text: 'Lieu d’essai, inventé pour les tests : une ville bâtie sur le gabarit « ville », dans sa variante au bord d’un fleuve.', src: 'Paquet d’essai' },
      { id: 'oubli', cat: 'Noosphère', title: 'L’Oubli', text: 'Égrégore d’essai. Il se nourrit de ce que l’on remet à plus tard.', src: 'Paquet d’essai' }
    ],
    chapters: [{
      id: 'es1', title: 'Les Feuillets', sub: 'Saga d’essai · La Halte',
      map: 'halte_essai', opts: { time: 'day' }, start: 'maison',
      party: ['copiste'],
      npcs: [
        { id: 'porteur', name: 'Le Porteur', hero: 'porteur', at: ['place', 1, 0],
          talk: [['say', 'porteur', 'Je porte, tu écris. Allons.']] },
        { id: 'marchand', name: 'Un marchand', at: ['souk', 0, 1], look: { kind: 'marchand', robe: '#8a6a3a', head: '#e6dcc4' },
          talk: [['say', 'marchand', 'Le comptoir est au bout du souk. On y vend de quoi s’équiper.']] }
      ],
      foes: [{ id: 'f1', map: 'piste_essai', at: 'rochers', group: ['hate_essai', 'hate_essai'], bg: 'desert' }],
      chests: [
        { at: ['halle', 1, 1], gear: 'epee_essai' },
        { at: ['puits', 1, 1], item: 'figues', n: 2 },
        { at: ['ecole', 1, 0], codex: 'halte' }
      ],
      intro: [['title', 'Les Feuillets', 'Saga d’essai'], ['nar', 'La Halte s’éveille. Les feuillets sont prêts.']],
      objectives: [
        { text: 'Rejoindre le Porteur sur la place', talk: 'porteur', then: [
          ['say', 'porteur', 'Les feuillets sont lourds. Je les porte.'],
          ['hide', 'porteur'], ['join', 'porteur'], ['give', 'figues', 1]
        ] },
        { text: 'Passer par l’auvent des copistes', goto: 'halle', then: [
          ['nar', 'Sous l’auvent, les calames sont taillés. Rien ne manque.'],
          ['mus', 'essai_air']
        ] },
        { text: 'Sortir par la porte du sud', goto: 'porte_sud', then: [
          ['map', 'piste_essai', 'depart', { time: 'dusk' }],
          ['nar', 'La piste s’étire jusqu’au puits. Quelque chose presse le pas.']
        ] },
        { text: 'Dissiper la Hâte, près des rochers', foe: 'f1', then: [['nar', 'Le pas redevient égal.']] },
        { text: 'Atteindre l’oasis', goto: 'oasis', then: [
          ['nar', 'Au bord de l’eau, une question : et si tout cela s’effaçait ?'],
          ['map', 'noos', 'seuil', { hue: 250 }],
          ['battle', { group: ['oubli_essai'], bg: 'noos', boss: true, intro: 'L’Oubli se dresse.' }],
          ['codex', 'oubli'],
          ['map', 'piste_essai', 'oasis', { time: 'dusk' }]
        ] }
      ],
      outro: [['nar', 'Les feuillets sont remis. Ce qui est écrit demeure.']]
    }]
  }]
};
