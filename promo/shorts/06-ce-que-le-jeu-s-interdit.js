/* Short 6 — « Ce que ce jeu s’interdit » : trois règles que le jeu se donne, montrées par le jeu.
   Le carton de la parole citée est celui du jeu, avec sa source. Les légendes reprennent les phrases du jeu et du livret ;
   elles restent à valider par le décideur — et la parole citée, par un spécialiste, comme tout le contenu du jeu. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« Ce que ce jeu s’interdit »', bpm: 100, graine: 632,
  rythme: [
    { a: 'b...............' },                                                         // l'accroche
    { a: pas('D.......t.......', 28) },                                                // le voile de lumière
    { a: pas('D.....t.D...t...', 32), b: pas('....r.......r...', 32) },                // la parole citée, sa source
    { a: pas('D.T...T.D...T...', 24), b: pas('r...r...r...r...', 24) },                // jamais une personne
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    /* l'accroche : Médine, devant la porte sud */
    await s.chapitre('abubakr', 0, { obj: 1 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
    await s.ombre(0.6, 0);
    await s.legende('Ce que ce jeu<br>s’interdit', { y: 150, style: 'accroche', taille: 36, duree: 8 * T - 0.1, dans: 0.12 });
    await s.tourner(8 * T); await s.ombre(0, 0.3);
    /* 1 — les Compagnons : un voile de lumière ; l'image se rapproche */
    s.marque('voile');
    await s.legende('Aucun Compagnon n’a de visage :<br>un voile de lumière en tient lieu.', { duree: 14 * T - 0.15, dans: 0.1 });
    await s.zoom(3, 3.2);
    await s.tourner(14 * T);
    /* 2 — le Prophète ﷺ n'apparaît jamais : on le cite, avec la source (le carton est celui du jeu) */
    s.marque('parole');
    await s.zoom(1.5); await s.dire('idris', 'Que celui qui est présent'); await s.avancer(64);
    await s.legende('Le Prophète ﷺ n’apparaît jamais.<br>On le cite, avec la source.', { y: 432, duree: 16 * T - 0.5, dans: 0.5 });
    await s.tourner(16 * T);
    /* 3 — l'ennemi : jamais une personne */
    s.marque('ennemi'); await s.noir(1, 0);
    await s.chapitre('umar', 1, { obj: 0 }); await s.cadre('carre'); await s.propre({ panneau: false, bandeau: false });
    await s.combat(['aigle'], { idole: true, fond: 'ville', attente: 2200 });
    await s.noir(0, 0.2);
    await s.legende('Aucun ennemi n’est une personne,<br>un peuple ni une religion.', { duree: 12 * T - 0.15, dans: 0.1 });
    await s.auto(true); await s.touche('Enter'); await s.tourner(2 * T); await s.touche('Enter');
    await s.tourner(10 * T);
    await s.carton(12 * T);
  }
};
