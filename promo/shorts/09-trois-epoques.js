/* Short 9 — « Trois époques, une seule chaîne » : 2084 (la Cité-Miroir), la Citadelle du Caïd, les années 632 – 661.
   Les légendes sont des propositions, à valider par le décideur. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« Trois époques, une seule chaîne »', bpm: 100, graine: 1508,
  rythme: [
    { a: 'b...............' },                                                         // l'accroche
    { a: pas('D.......t.......', 22) },                                                // 2084
    { a: pas('D.....t.D...t...', 22), b: pas('....r.......r...', 22) },                // la Citadelle
    { a: pas('D.T...T.D...T...', 22), b: pas('r...r...r...r...', 22) },                // 632 – 661
    { a: pas('D.T.t.T.D.t.T.T.', 22), b: pas('r.r.r.r.r.r.r.r.', 22) },                // la Chaîne
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    /* l'accroche, sur l'écran de la Chaîne */
    await s.cadre('ecran'); await s.ev(() => { window.ISNAD.ui.showChain(); }); await s.avancer(700);
    await s.ombre(0.72, 0);
    await s.legende('Trois époques,<br>une seule chaîne', { y: 210, style: 'accroche', taille: 36, duree: 8 * T - 0.1, dans: 0.12 });
    await s.defiler('#chain', 420, 8 * T + 0.3);
    await s.tourner(8 * T);
    /* 2084 — la Cité-Miroir */
    s.marque('2084'); await s.ombre(0, 0); await s.noir(1, 0);
    await s.chapitre('idris', 0, { obj: 0, lieu: ['ecran', -8, 2] }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
    await s.noir(0, 0.2);
    await s.legende('2084 · la Cité-Miroir', { style: 'titre', duree: 11 * T - 0.15, dans: 0.1 });
    await s.legende('Un archiviste remonte la Chaîne.', { marge: 58, duree: 11 * T - 0.3, dans: 0.3 });
    await s.tenir('ArrowRight'); await s.tourner(11 * T); await s.lacher('ArrowRight');
    /* la Citadelle, au bord du désert : les veillées du Caïd */
    s.marque('citadelle'); await s.noir(1, 0);
    await s.chapitre('caid', 0, { obj: 1 }); await s.cadre('carre'); await s.zoom(1.5);
    await s.noir(0, 0.2);
    await s.legende('La Citadelle, au bord du désert', { style: 'titre', duree: 11 * T - 0.15, dans: 0.1 });
    await s.legende('Un Caïd lit ces vies, à la veillée.', { marge: 82, duree: 11 * T - 0.3, dans: 0.3 });
    await s.tenir('ArrowDown'); await s.tourner(11 * T); await s.lacher('ArrowDown');
    /* 632 – 661 : les Compagnons */
    s.marque('632'); await s.noir(1, 0);
    await s.chapitre('khalid', 0, { obj: 4 }); await s.cadre('carre'); await s.zoom(1.5);
    await s.noir(0, 0.2);
    await s.legende('632 – 661', { style: 'titre', duree: 11 * T - 0.15, dans: 0.1 });
    await s.legende('Cinq Compagnons, cinq sagas.', { marge: 58, duree: 11 * T - 0.3, dans: 0.3 });
    await s.tenir('ArrowRight'); await s.tourner(11 * T); await s.lacher('ArrowRight');
    /* la Chaîne : on passe d'un maillon à l'autre */
    s.marque('chaine'); await s.noir(1, 0);
    await s.neuf(); await s.cadre('ecran'); await s.ev(() => { window.ISNAD.ui.showChain(); }); await s.avancer(700); await s.ev(() => { document.querySelector('#chain').scrollTop = 250; });
    await s.noir(0, 0.2);
    await s.defiler('#chain', 1500, 11 * T);
    await s.tourner(11 * T);
    await s.carton(12 * T);
  }
};
