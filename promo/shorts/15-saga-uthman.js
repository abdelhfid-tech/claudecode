/* Short 15 — la saga de 'Uthmân (la Miséricorde) : la mer ; « si tu tues un seul homme… » ; vers la halle, où les scribes sont réunis.
   Bâti par _saga.js : tout ce qu'on y lit vient du jeu. Le choix de la parole et du moment est une proposition, à valider.
   Rechange, si le décideur préfère ne pas évoquer le siège : parole ['Rattrape cette communauté', 22]. */
module.exports = require('./_saga.js')({
  recit: 'uthman', titre: 'La saga de ‘Uthmân', graine: 644,
  lieu: [1, { obj: 2, carte: 'navire', lieu: 'pont2', opts: {} }, [[440, 189], [296, 205], [150, 203]]], phrase: 18,   // d'un pont à l'autre, par la passerelle
  parole: ['Te plairait-il de tuer tous les gens', 26],
  moment: { ci: 0, cp: { obj: 3, lieu: 'place' }, obj: 3, vers: 'halle' },   // vers la halle, où les scribes sont réunis
});
