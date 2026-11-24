/* Short 14 — la saga de Khâlid (le Courage) : la traversée du désert ; « ni vanité ni injustice » ; le groupe en route, sur la piste de la carte du monde.
   Bâti par _saga.js : tout ce qu'on y lit vient du jeu. Le choix de la parole et du moment est une proposition, à valider. */
module.exports = require('./_saga.js')({
  recit: 'khalid', titre: 'La saga de Khâlid', graine: 636,
  lieu: [0, { obj: 4 }, [[264, 189]]],                       // de la caravane vers les dunes
  parole: ["Ce jour est l'un des jours d'Allah", 28],
  moment: { ci: 0, cp: { obj: 4, carte: 'camp', lieu: 'entree' }, obj: 3, monde: 'ouest' },   // le groupe en route : sorti du camp, sur la piste
});
