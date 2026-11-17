/* Short 1 — « Qui te l’a dit ? » : la prémisse. 2084, la Cité-Miroir ; les Archives basses ; la Chaîne ; Médine, juin 632.
   Les répliques sont celles du jeu, dites par le jeu. Les légendes sont des propositions, à valider par le décideur. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);  // un motif, tenu pendant n pas (un pas : un quart de temps)
module.exports = {
  titre: '« Qui te l’a dit ? »', bpm: 100, graine: 632,
  // percussions seules, une section par plan — D dum, T tek, t tek léger, r cymbalettes, b grand tambour
  rythme: [
    { a: 'b...............' },                                                                                   // 1 · l'accroche
    { a: pas('D.......t.......', 36) },                                                                          // 2 · 2084
    { a: 'D.....t.D...t...' + pas('D.t...t.D.t.t...', 28), b: '....r.......r...' + pas('r...r...r...r...', 28) },  // 3 · la Chaîne
    { a: pas('b...................', 20) },                                                                      // 4 · le carton « Médine »
    { a: pas('D.T...T.D...T...', 28), b: pas('r.r.r.r.r.r.r.r.', 28) },                                          // 5 · Médine
    { a: 'b.......D...............', b: 'r.......................' }                                              // 6 · le carton final
  ],
  async film(s) {
    /* 1 — l'accroche, sur un plan d'ambiance (une lampe, des rouleaux) ; dessous, le jeu est déjà en place */
    await s.chapitre('idris', 0, { lieu: ['ruelle', -4, 1], obj: 1 });
    await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
    const ia = await s.plan('cave', 8 * T, { fondu: 0.4 });
    if (!ia) await s.ombre(0.8, 0);
    await s.legende('Qui te l’a dit ?', { y: ia ? 236 : 150, style: 'accroche', taille: 40, duree: 8 * T - 0.1, dans: 0.12 });
    await s.tourner(8 * T);
    /* 2 — 2084 : un vieil homme, dans une ruelle de la Cité-Miroir */
    s.marque('2084'); await s.ombre(0, 0.3);
    await s.legende('2084 · la Cité-Miroir', { zone: 'sur', style: 'titre', duree: 2, dans: 0.05 });
    await s.toucherPnj('vieux'); await s.zoom(1.9, 4);
    await s.tourner(18 * T);
    /* 3 — sous la ville, les Archives basses : la Chaîne. Des noms, et après chaque nom : « d'après » */
    s.marque('chaine'); await s.noir(1, 0);
    await s.chapitre('idris', 0, { carte: 'archives', lieu: ['chaine', 0, 3], obj: 3 }); await s.cadre('carre'); await s.zoom(1.7);
    await s.noir(0, 0.2);
    await s.legende('Sous la ville : les Archives basses', { zone: 'sur', style: 'titre', duree: 1.9, dans: 0.05 });
    const ch = await s.ev(() => { const W = window.ISNAD.world; return W.resolve('chaine', W.map.id, W.player); });
    await s.toucherMonde(ch[0], ch[1]); await s.zoom(1.2, 4.5);
    await s.tourner(22 * T);
    /* 4 — le carton du jeu : « Médine … juin 632 » */
    s.marque('medine-carton');
    await s.jusquaReplique('Elle commence au jour'); await s.touche('Enter'); await s.avancer(760);
    await s.tourner(10 * T);
    /* 5 — Médine : Abû Bakr entre par le sud ; un voile de lumière tient lieu de visage aux Compagnons */
    s.marque('medine'); await s.noir(1, 0);
    await s.chapitre('abubakr', 0, { obj: 1 }); await s.cadre('carre'); await s.zoom(1.5);
    await s.noir(0, 0.2);
    await s.toucherPnj('abuubayda');
    await s.tourner(8 * T);
    await s.touche('Enter'); await s.avancer(64);
    await s.legende('Cinq sagas, de 632 à 661.', { style: 'titre', duree: 6 * T - 0.1, dans: 0.12 });
    await s.tenir('ArrowUp'); await s.tourner(6 * T); await s.lacher('ArrowUp');
    /* 6 — le carton final */
    s.marque('carton');
    await s.carton(12 * T);
  }
};
