/* Short 13 — la saga de 'Umar (la Justice) : les rondes de nuit ; « Porteras-tu mon fardeau… » ; la farine portée à la famille.
   Bâti par _saga.js : tout ce qu'on y lit vient du jeu. Le choix de la parole et du moment est une proposition, à valider. */
module.exports = require('./_saga.js')({
  recit: 'umar', titre: 'La saga de ‘Umar', graine: 634,
  lieu: [0, { obj: 2 }, [[856, 141]]],                       // dans la nuit, vers la colline
  parole: ['Porteras-tu mon fardeau', 20],
  moment: { ci: 0, cp: { obj: 5, lieu: ['enclos', -2, 2] }, obj: 5, pnj: 'voyageur' },   // la nuit, la farine portée à la famille
});
