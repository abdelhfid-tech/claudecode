/* Short 14 — la saga de Khâlid (le Courage) : la traversée du désert ; « ni vanité ni injustice » ; l'Idole du Héros.
   Bâti par _saga.js : tout ce qu'on y lit vient du jeu. Le choix de la parole et de l'idole est une proposition, à valider. */
module.exports = require('./_saga.js')({
  recit: 'khalid', titre: 'La saga de Khâlid', graine: 636,
  lieu: [0, { obj: 4 }, [[264, 189]]],                       // de la caravane vers les dunes
  monde: [0, { obj: 4, lieu: 'entree' }, 'ouest'],                  // sorti du camp, vers al-Hîra
  parole: ["Ce jour est l'un des jours d'Allah", 28],
  idole: 'idole_heros',
  combat: { groupe: ['khalid', 'qaqa', 'dirar'], niv: 9 }
});
