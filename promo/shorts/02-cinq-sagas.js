/* Short 2 — « Cinq sagas, cinq Lumières » : cinq lieux, cinq Compagnons. Les noms, les Lumières et les années sont lus
   dans les données du jeu. Les légendes sont des propositions, à valider par le décideur.
   Refait le 24 novembre dans l'ambiance de D219 (le voyage dans le temps, le groupe en route) : le plan d'ambiance gardé
   (le choix du décideur, 24 novembre : « Garder les plans IA »), l'accroche entière dès l'image 1 (s.ouverture, sans lueur) ;
   d'une saga à l'autre, un passage (une lueur du montage : rien du jeu n'est changé), chaque Compagnon en marche ; à la fin,
   la Chaîne, tous ses maillons ouverts (I.debug.all, posé dans la page du film seulement — D219, 23 novembre). */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const PASSE = 0.45;                                                  // un passage, en secondes
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
    { a: 'b' + pas('.t...t.D.t.t...D', 19), b: pas('r...r...r...r...', 20) },          // 'Umar (le grand tambour : le passage)
    { a: 'b' + pas('.T...T.D...T...D', 19), b: pas('r...r...r...r...', 20) },          // Khâlid
    { a: 'b' + pas('.T...T.D...T.T.D', 19), b: pas('r.r.r.r.r.r.r.r.', 20) },          // 'Uthmân
    { a: 'b' + pas('.T.t.T.D.t.T.T.D', 19), b: pas('r.r.r.r.r.r.r.r.', 20) },          // 'Alî
    { a: 'b.T.t.T.D.t.T.T.D.TT', b: pas('r.', 20) },                                   // la Chaîne
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    /* l'accroche, sur un plan d'ambiance (le désert à l'aube) ; dessous, Médine est déjà en place */
    let [recit, ci, cp, touche] = PLANS[0];
    await s.chapitre(recit, ci, cp); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
    const ia = await s.plan('desert', 8 * T, { fondu: 0.4 });
    // l'accroche entière dès l'image 1 : sur le plan d'ambiance ; sans lui, au milieu d'un passage, sur Médine
    await s.ouverture('Cinq sagas,<br>cinq Lumières', ia ? { lueur: 0, duree: 8 * T - 0.1, legende: { y: 210, taille: 38 } } : { z: 1.5, duree: 8 * T - 0.1, legende: { y: 140, taille: 38 } });
    await s.tourner(8 * T);
    /* cinq lieux, cinq Compagnons */
    for (let i = 0; i < PLANS.length; i++) {
      [recit, ci, cp, touche] = PLANS[i];
      if (i) { await s.chapitre(recit, ci, cp); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5); await s.arrivee(1.5, 0.5); }
      const r = await s.recit(recit); s.marque(recit);
      await s.legende(r.nom, { style: 'titre', duree: 10 * T - PASSE - 0.1, dans: 0.1 });
      await s.legende((LE[r.lumiere] || 'la') + ' ' + r.lumiere + ' · ' + r.annees.split(' · ').pop(), { marge: 58, duree: 10 * T - PASSE - 0.25, dans: 0.3 });
      await s.tenir(touche); await s.tourner(10 * T - PASSE); await s.passage(PASSE, 2.6); await s.lacher(touche);
    }
    /* la Chaîne : les cinq maillons, tous ouverts — l'interrupteur de test du jeu (I.debug.all), dans cette page du film seulement */
    s.marque('chaine');
    await s.neuf(); await s.cadre('ecran'); await s.ev(() => { window.ISNAD.debug.all = true; window.ISNAD.ui.showChain(); }); await s.avancer(700); await s.ev(() => { document.querySelector('#chain').scrollTop = 250; });
    await s.arrivee(0, 0.4);
    await s.defiler('#chain', 1120, 10 * T);
    await s.tourner(10 * T);
    await s.carton(12 * T);
  }
};
