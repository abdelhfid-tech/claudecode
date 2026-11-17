/* Short 2 — « Cinq sagas, cinq Lumières » : cinq lieux, cinq Compagnons. Les noms, les Lumières et les années sont lus
   dans les données du jeu. Les légendes sont des propositions, à valider par le décideur. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
const LE = { 'Véracité': 'la', 'Justice': 'la', 'Courage': 'le', 'Miséricorde': 'la', 'Savoir': 'le' };
// [récit, chapitre, point de passage, touche tenue pour marcher]
const PLANS = [
  ['abubakr', 0, { obj: 1 }, 'ArrowUp'],
  ['umar', 0, { obj: 2 }, 'ArrowRight'],
  ['khalid', 0, { obj: 4 }, 'ArrowRight'],
  ['uthman', 1, { obj: 2, carte: 'navire', opts: {} }, 'ArrowLeft'],
  ['ali', 0, { obj: 1 }, 'ArrowDown']
];
module.exports = {
  titre: '« Cinq sagas, cinq Lumières »', bpm: 100, graine: 634,
  rythme: [
    { a: 'b...............' },                                                         // l'accroche
    { a: pas('D.....t.D...t...', 20), b: pas('....r.......r...', 20) },                // Abû Bakr
    { a: pas('D.t...t.D.t.t...', 20), b: pas('r...r...r...r...', 20) },                // 'Umar
    { a: pas('D.T...T.D...T...', 20), b: pas('r...r...r...r...', 20) },                // Khâlid
    { a: pas('D.T...T.D...T.T.', 20), b: pas('r.r.r.r.r.r.r.r.', 20) },                // 'Uthmân
    { a: pas('D.T.t.T.D.t.T.T.', 20), b: pas('r.r.r.r.r.r.r.r.', 20) },                // 'Alî
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    /* l'accroche, sur un plan d'ambiance (le désert à l'aube) ; dessous, Médine est déjà en place */
    let [recit, ci, cp, touche] = PLANS[0];
    await s.chapitre(recit, ci, cp); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
    const ia = await s.plan('desert', 8 * T, { fondu: 0.4 });
    if (!ia) await s.ombre(0.8, 0);
    await s.legende('Cinq sagas,<br>cinq Lumières', { y: ia ? 210 : 140, style: 'accroche', taille: 38, duree: 8 * T - 0.1, dans: 0.12 });
    await s.tourner(8 * T); await s.ombre(0, 0.3);
    /* cinq lieux, cinq Compagnons */
    for (let i = 0; i < PLANS.length; i++) {
      [recit, ci, cp, touche] = PLANS[i];
      if (i) { await s.noir(1, 0); await s.chapitre(recit, ci, cp); await s.cadre('carre'); await s.zoom(1.5); await s.noir(0, 0.2); }
      const r = await s.recit(recit); s.marque(recit);
      await s.legende(r.nom, { style: 'titre', duree: 10 * T - 0.15, dans: 0.1 });
      await s.legende((LE[r.lumiere] || 'la') + ' ' + r.lumiere + ' · ' + r.annees.split(' · ').pop(), { marge: 58, duree: 10 * T - 0.3, dans: 0.3 });
      await s.tenir(touche); await s.tourner(10 * T); await s.lacher(touche);
    }
    await s.carton(12 * T);
  }
};
