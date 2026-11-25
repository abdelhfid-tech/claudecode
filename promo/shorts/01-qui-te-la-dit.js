/* Short 1 — « De qui tiens-tu cela ? » (le décideur, 24 novembre, au lieu de « Qui te l’a dit ? ») : la prémisse. 2084, la Cité-Miroir ; les Archives basses ; la Chaîne ; Médine, juin 632.
   Les répliques sont celles du jeu, dites par le jeu. Les légendes sont des propositions, à valider par le décideur.
   Refait le 24 novembre dans l'ambiance de D219 (le voyage dans le temps) : le plan d'ambiance gardé (le choix du décideur,
   24 novembre : « Garder les plans IA »), l'accroche entière dès l'image 1 (s.ouverture, sans lueur) ; un passage des rues
   de 2084 aux Archives, et du carton « Médine … juin 632 » à Médine (une lueur du montage : rien du jeu n'est changé). */
const PASSE = 0.45;                                                  // un passage, en secondes
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);  // un motif, tenu pendant n pas (un pas : un quart de temps)
module.exports = {
  titre: '« De qui tiens-tu cela ? »', bpm: 100, graine: 632,
  // percussions seules, une section par plan — D dum, T tek, t tek léger, r cymbalettes, b grand tambour
  rythme: [
    { a: 'b...............' },                                                                                   // 1 · l'accroche
    { a: pas('D.......t.......', 36) },                                                                          // 2 · 2084
    { a: 'b.....t.D...t...' + pas('D.t...t.D.t.t...', 28), b: '....r.......r...' + pas('r...r...r...r...', 28) },  // 3 · la Chaîne (le grand tambour : le passage)
    { a: pas('b...................', 20) },                                                                      // 4 · le carton « Médine »
    { a: 'b' + pas('.T...T.D...T...D', 27), b: pas('r.r.r.r.r.r.r.r.', 28) },                                    // 5 · Médine (le passage)
    { a: 'b.......D...............', b: 'r.......................' }                                              // 6 · le carton final
  ],
  async film(s) {
    /* 1 — l'accroche, sur un plan d'ambiance (une lampe, des rouleaux) ; dessous, le jeu est déjà en place */
    await s.chapitre('idris', 0, { lieu: ['ruelle', -4, 1], obj: 1 });
    await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
    const ia = await s.plan('cave', 8 * T, { fondu: 0.4 });
    // l'accroche entière dès l'image 1 : sur le plan d'ambiance ; sans lui, au milieu d'un passage, sur la ruelle de 2084
    await s.ouverture('De qui<br>tiens-tu cela ?', ia ? { lueur: 0, duree: 8 * T - 0.1, legende: { y: 214, taille: 36 } } : { z: 1.5, duree: 8 * T - 0.1, legende: { y: 150, taille: 36 } });
    await s.tourner(8 * T);
    /* 2 — 2084 : un vieil homme, dans une ruelle de la Cité-Miroir */
    s.marque('2084');
    await s.legende('2084 · la Cité-Miroir', { zone: 'sur', style: 'titre', duree: 2, dans: 0.05 });
    await s.toucherPnj('vieux'); await s.zoom(1.9, 4);
    await s.tourner(18 * T - PASSE); await s.passage(PASSE, 2.6);
    /* 3 — sous la ville, les Archives basses : la Chaîne. Des noms, et après chaque nom : « d'après » */
    s.marque('chaine');
    await s.chapitre('idris', 0, { carte: 'archives', lieu: ['chaine', 0, 3], obj: 3 }); await s.cadre('carre'); await s.zoom(1.7);
    await s.arrivee(1.7, 0.5);
    await s.legende('Sous la ville : les Archives basses', { zone: 'sur', style: 'titre', duree: 1.9, dans: 0.05 });
    const ch = await s.ev(() => { const W = window.ISNAD.world; return W.resolve('chaine', W.map.id, W.player); });
    await s.ev(c => { window.ISNAD.world.goTo(c[0], c[1]); }, ch); await s.zoom(1.2, 4.5);   // (le jeu l'y mène : le premier toucher après le chargement d'un lieu peut se perdre)
    await s.tourner(22 * T);
    /* 4 — le carton du jeu : « Médine … juin 632 » */
    s.marque('medine-carton');
    await s.jusquaReplique('commence au jour le plus sombre'); await s.touche('Enter'); await s.avancer(760);
    await s.tourner(10 * T - PASSE); await s.passage(PASSE, 0);
    /* 5 — Médine : Abû Bakr entre par le sud ; un voile de lumière tient lieu de visage aux Compagnons */
    s.marque('medine');
    await s.chapitre('abubakr', 0, { obj: 1 }); await s.cadre('carre'); await s.zoom(1.5);
    await s.arrivee(1.5, 0.5);
    await s.toucherPnj('abuubayda');
    await s.tourner(8 * T);
    await s.touche('Enter'); await s.avancer(64);
    await s.legende('Cinq sagas, de 632 à 661.', { style: 'titre', duree: 6 * T - 0.1, dans: 0.12 });
    await s.tenir('ArrowUp'); await s.tourner(6 * T); await s.lacher('ArrowUp');
    /* 6 — le carton final */
    s.marque('carton');
    await s.carton(12 * T - 0.2);   // (le carton s'ouvre sur 0,2 s de noir : 30 secondes en tout)
  }
};
