/* Short 3 — « On n’y combat jamais des personnes » : trois idoles, et ce que Maître Yûnus en dit.
   Les combats sont ceux du jeu, joués par le jeu ; la réplique est la sienne. Les légendes reprennent les phrases déjà
   validées pour le livret ; elles restent à valider ici. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
// [récit, chapitre, idole, fond]
const IDOLES = [['umar', 2, ['trone'], 'ville'], ['khalid', 2, ['idole_heros'], 'ville'], ['ali', 1, ['slogan'], 'ville']];
module.exports = {
  titre: '« On n’y combat jamais des personnes »', bpm: 100, graine: 638,
  rythme: [
    { a: 'b.......b.......' },                                                         // l'accroche
    { a: pas('D.T.D.T.D.T.T.T.', 24), b: pas('r.r.r.r.r.r.r.r.', 24) },                // le Trône vide
    { a: pas('D.TtD.T.D.TtT.T.', 24), b: pas('r.r.r.r.r.r.r.r.', 24) },                // l'Idole du Héros
    { a: pas('D.TtD.TtD.TtT.Tt', 24), b: pas('r.r.r.r.r.r.r.r.', 24) },                // le Slogan
    { a: pas('D.......t.......', 32) },                                                // Maître Yûnus
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    /* l'accroche, sur le premier combat */
    let [recit, ci, idole, fond] = IDOLES[0];
    await s.chapitre(recit, ci, { obj: 0 }); await s.cadre('carre'); await s.propre({ panneau: false, bandeau: false });
    await s.combat(idole, { idole: true, fond, attente: 2200 });
    await s.ombre(0.7, 0);
    await s.legende('On n’y combat jamais<br>des personnes.', { y: 150, style: 'accroche', taille: 31, duree: 8 * T - 0.1, dans: 0.12 });
    await s.tourner(8 * T); await s.ombre(0, 0.3);
    /* trois idoles : le combat se joue tout seul, à l'allure du jeu */
    for (let i = 0; i < IDOLES.length; i++) {
      [recit, ci, idole, fond] = IDOLES[i];
      if (i) { await s.noir(1, 0); await s.chapitre(recit, ci, { obj: 0 }); await s.cadre('carre'); await s.combat(idole, { idole: true, fond, attente: 2200 }); await s.noir(0, 0.2); }
      s.marque(idole[0]);
      if (i === 0) await s.legende('Seulement des égrégores :', { style: 'titre', duree: 12 * T - 0.15, dans: 0.15 });
      if (i === 1) await s.legende('les idoles que les cœurs<br>fabriquent ensemble.', { style: 'titre', duree: 12 * T - 0.15, dans: 0.1 });
      await s.auto(true); await s.touche('Enter'); await s.tourner(2 * T); await s.touche('Enter');   // « Frapper », puis la cible : ensuite le groupe joue seul
      await s.tourner(10 * T);
    }
    /* ce qu'en dit Maître Yûnus, aux Archives basses */
    s.marque('yunus'); await s.noir(1, 0);
    await s.chapitre('idris', 0, { carte: 'archives', lieu: ['bureau', 2, 1], obj: 3 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.8);
    await s.noir(0, 0.2);
    await s.dire('idris', 'On ne détruit pas une idole');
    await s.tourner(16 * T);
    await s.carton(12 * T);
  }
};
