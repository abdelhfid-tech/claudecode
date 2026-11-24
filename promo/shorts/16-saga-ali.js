/* Short 16 — la saga de 'Alî (le Savoir) : Koufa ; « Parole de vérité par laquelle on vise le faux. » ; devant le juge Shurayh.
   Bâti par _saga.js : tout ce qu'on y lit vient du jeu. Le choix de la parole et du moment est une proposition, à valider. */
module.exports = require('./_saga.js')({
  recit: 'ali', titre: 'La saga de ‘Alî', graine: 656,
  lieu: [0, { obj: 1 }, [[472, 413], [760, 420]]], phrase: 18,   // de la cour de la mosquée à la place, puis vers la halle
  parole: ['Parole de vérité par laquelle on vise le faux', 16],
  moment: { ci: 0, cp: { obj: 3, lieu: ['halle', 0, 3] }, obj: 3, pnj: 'shurayh' }   // devant le juge Shurayh
});
