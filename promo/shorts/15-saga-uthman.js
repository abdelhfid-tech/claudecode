/* Short 15 — la saga de 'Uthmân (la Miséricorde) : la mer ; « si tu tues un seul homme… » ; la Rumeur.
   Bâti par _saga.js : tout ce qu'on y lit vient du jeu. Le choix de la parole et de l'idole est une proposition, à valider.
   Rechange, si le décideur préfère ne pas évoquer le siège : parole ['Rattrape cette communauté', 22], idole 'babel'. */
module.exports = require('./_saga.js')({
  recit: 'uthman', titre: 'La saga de ‘Uthmân', graine: 644,
  lieu: [1, { obj: 2, carte: 'navire', lieu: 'pont2', opts: {} }, [[440, 189], [296, 205], [150, 203]]], phrase: 18,   // d'un pont à l'autre, par la passerelle
  parole: ['Te plairait-il de tuer tous les gens', 26],
  idole: 'rumeur'
});
