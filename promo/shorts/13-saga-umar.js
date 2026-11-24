/* Short 13 — la saga de 'Umar (la Justice) : les rondes de nuit ; « Porteras-tu mon fardeau… » ; l'Accapareur.
   Bâti par _saga.js : tout ce qu'on y lit vient du jeu. Le choix de la parole et de l'idole est une proposition, à valider. */
module.exports = require('./_saga.js')({
  recit: 'umar', titre: 'La saga de ‘Umar', graine: 634,
  lieu: [0, { obj: 2 }, [[856, 141]]],                       // dans la nuit, vers la colline
  monde: [0, { obj: 2, lieu: 'porte_sud' }, 'sud'],                 // la nuit, sur la piste au sud de Médine
  parole: ['Porteras-tu mon fardeau', 20],
  idole: 'accapareur',
  combat: { groupe: ['umar', 'aslam'], niv: 3 }
});
