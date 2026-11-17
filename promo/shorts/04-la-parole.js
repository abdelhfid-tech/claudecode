/* Short 4 — « La parole avant le sabre » : un pourparler. Il est pris dans l'histoire-cadre (2084) : l'interlocuteur et
   les réponses y sont de fiction. Les textes sont ceux du jeu ; les légendes sont des propositions, à valider. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« La parole avant le sabre »', bpm: 100, graine: 2084,
  rythme: [
    { a: 'b...............' },                                                         // l'accroche
    { a: pas('D.......t.......', 28) },                                                // le carton du pourparler
    { a: pas('D.....t.D...t...', 28), b: pas('....r.......r...', 28) },                // ce que dit l'opérateur
    { a: pas('D.t...t.D.t.t...', 28), b: pas('r...r...r...r...', 28) },                // que réponds-tu ?
    { a: pas('D.T...T.D...T...', 24), b: pas('r.r.r.r.r.r.r.r.', 24) },                // sa réponse
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    const cadre = { haut: 0, scene: 232 };     // une scène plus basse : les trois réponses tiennent dessous
    /* l'accroche : la rue, en 2084 ; Sâlim attend */
    await s.chapitre('idris', 1, { obj: 0, lieu: ['rue', -3, 0] }); await s.cadre(cadre); await s.propre({ cible: false }); await s.zoom(2);
    await s.ombre(0.45, 0);
    await s.legende('La parole<br>avant le sabre', { y: 250, style: 'accroche', taille: 36, duree: 8 * T - 0.1, dans: 0.12 });
    await s.tourner(8 * T); await s.ombre(0, 0.3);
    /* Idris aborde Sâlim ; le récit se déroule sans être filmé jusqu'au pourparler, qui s'ouvre sur son carton */
    await s.toucherPnj('salim_n'); await s.avancer(1500);
    await s.jusquaReplique('Il relance une alerte par heure'); await s.touche('Enter'); await s.avancer(120);
    s.marque('carton'); await s.tourner(14 * T);
    /* ce que dit l'opérateur de garde */
    await s.touche('Enter'); s.marque('operateur'); await s.tourner(14 * T);
    /* « Que réponds-tu ? » : trois réponses, une seule dit vrai */
    await s.touche('Enter'); s.marque('reponses');
    await s.legende('À toi de répondre.', { zone: 'sur', style: 'titre', duree: 14 * T - 0.4, dans: 0.3 });
    await s.tourner(14 * T);
    /* la première : dire vrai */
    await s.touche('Enter'); s.marque('reponse'); await s.tourner(12 * T);
    await s.carton(12 * T);
  }
};
