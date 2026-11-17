/* Short 12 — la saga d'Abû Bakr (la Véracité) : Médine, juin 632 ; « S'il l'a dit, il a dit vrai. » ; le Clan.
   Bâti par _saga.js : tout ce qu'on y lit vient du jeu. Le choix de la parole et de l'idole est une proposition, à valider. */
module.exports = require('./_saga.js')({
  recit: 'abubakr', titre: 'La saga d’Abû Bakr', graine: 632,
  lieu: [0, { obj: 1 }, [[488, 365]]],                       // de la porte sud vers la mosquée, par la grand-rue
  parole: ["S'il l'a dit, il a dit vrai", 14],
  idole: 'clan'
});
