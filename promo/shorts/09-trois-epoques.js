/* Short 9 — « Trois époques, une seule chaîne » : 2084 (la Cité-Miroir), la Citadelle du Caïd, les années 632 – 661.
   Refait le 22 novembre, pilote des shorts refaits (D219 ; le décideur : « je veux retrouver l'ambiance » d'un grand JRPG
   16 bits — le voyage dans le temps, le groupe en route, le combat au tour par tour, un souffle qui monte ; pas forcément
   tout dans le même short). Celui-ci est le voyage dans le temps : chaque époque s'ouvre par un passage, une lueur du
   montage (s.passage, s.arrivee : rien du jeu n'est changé) ; puis le groupe de Khâlid en route, en plein jour, dans la cité
   romaine de Qinnasrîn, un combat au tour par tour, et la Chaîne qui défile. Les lieux, les personnages et le combat sont ceux du jeu.
   Les légendes sont celles des films livrés (09, et 03 pour le combat) : aucune phrase nouvelle.
   Le son : des percussions seules (D176), qui montent d'une époque à l'autre ; le grand tambour marque chaque passage.
   30 secondes avec le plan du soutien (25,2 s de film, puis 4,8 s).
   La première image arrête le pouce (le décideur, 22 novembre : « La première image doit être prenante on doit s'arrêter de
   scroller » ; son choix : « Le passage déjà ouvert ») : on tombe au milieu d'un passage, la lueur se déchire sur le désert
   de la Traversée au crépuscule, Khâlid marche déjà, et l'accroche est entière dès l'image 1 — ni noir, ni fondu
   (s.ouverture, la même pour tous les shorts depuis le 24 novembre). Au combat, les rangées du groupe restent hors champ (D172). */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);  // un motif, tenu pendant n pas (un pas : un quart de temps)
const PASSE = 0.45;                                                  // un passage d'une époque à l'autre, en secondes
const Z = 1.5;                                                       // l'image d'un lieu, agrandie comme sur un téléphone
module.exports = {
  titre: '« Trois époques, une seule chaîne »', bpm: 100, graine: 1508,
  rythme: [
    { a: 'b.T.T...b...T.T.' },                                                               // l'accroche, dans le passage déjà ouvert (8 T)
    { a: 'b.......t.......D...T.T.' },                                                       // 2084 (12 T)
    { a: 'b.....t.D...t...D.T.T.T.', b: '....r.......r.......r...' },                        // la Citadelle (12 T)
    { a: 'b.T...T.D...T...D.T.T.TT', b: pas('r...', 24) },                                   // 632 – 661 : le groupe en route (12 T)
    { a: pas('D.TtD.T.D.TtT.T.', 28), b: pas('r.r.', 28) },                                  // le combat (14 T)
    { a: 'b.T.t.T.D.t.T.T.D.TT', b: pas('r.', 20) },                                         // la Chaîne (10 T)
    { a: 'b.......D' + '.'.repeat(23), b: 'r' + '.'.repeat(31) }                              // le carton final (16 T)
  ],
  async film(s) {
    // la fin d'un plan : il est filmé jusqu'au passage, puis la lueur monte (et l'image plonge, dans un lieu)
    const jusquauPassage = async sec => { await s.tourner(sec - PASSE); await s.passage(PASSE, 2.7); };
    // marcher vers un lieu nommé de la carte : le jeu trouve le chemin ; l'objectif « aller à tel endroit » ne se déclenche pas
    const marcher = lieu => s.ev(l => { const W = window.ISNAD.world;
      if (!W._curDuJeu) { W._curDuJeu = W.cur; W.cur = function () { const c = W._curDuJeu.apply(this, arguments); return c && c.goto ? Object.assign({}, c, { goto: null }) : c; }; }
      const p = W.resolve(l, W.map.id, W.player); if (p && !isNaN(p[0])) W.goTo(p[0], p[1], { quiet: true }); return !!p; }, lieu);

    /* 1 — l'accroche : on tombe au milieu d'un passage, sur le désert de la Traversée au crépuscule, à la caravane. Dès
       l'image 1 : la lueur à 0,55 (le désert doré et les rouges passent au travers), Khâlid qui marche vers nous, entre les
       tentes, l'accroche entière ; puis la lueur se déchire (1,1 s) et l'image revient de × 3 à × 2,1 — la caravane reste
       dans l'image. */
    await s.chapitre('khalid', 0, { obj: 4 }); await s.cadre('carre'); await s.propre({ cible: false });
    await s.ev(() => { const W = window.ISNAD.world;
      if (!W._curDuJeu) { W._curDuJeu = W.cur; W.cur = function () { const c = W._curDuJeu.apply(this, arguments); return c && c.goto ? Object.assign({}, c, { goto: null }) : c; }; }
      const p = W.player; W.goTo(p.x - 30, p.y + 80, { quiet: true }); });
    await s.avancer(200);                                                // il est déjà en marche à la première image
    await s.ouverture('Trois époques,<br>une seule chaîne', { z: 2.1, sec: 1.1, duree: 8 * T - PASSE + 0.05 });   // la lueur à 0,55 qui se déchire, l'accroche entière dès l'image 1
    await jusquauPassage(8 * T);
    await s.ev(() => window.ISNAD.world.stop());

    /* 2 — 2084, la Cité-Miroir */
    s.marque('2084');
    await s.chapitre('idris', 0, { obj: 0, lieu: ['ecran', -8, 2] }); await s.cadre('carre'); await s.propre({ cible: false });
    await s.arrivee(Z, 0.5);
    await s.legende('2084 · la Cité-Miroir', { style: 'titre', duree: 12 * T - PASSE - 0.1, dans: 0.2 });
    await s.legende('Un archiviste remonte la Chaîne.', { marge: 58, duree: 12 * T - PASSE - 0.25, dans: 0.4 });
    await s.tenir('ArrowRight'); await jusquauPassage(12 * T); await s.lacher('ArrowRight');

    /* 3 — la Citadelle, au bord du désert : les veillées du Caïd */
    s.marque('citadelle');
    await s.chapitre('caid', 0, { obj: 1 }); await s.cadre('carre'); await s.propre({ cible: false });
    await s.arrivee(Z, 0.5);
    await s.legende('La Citadelle, au bord du désert', { style: 'titre', duree: 12 * T - PASSE - 0.1, dans: 0.2 });
    await s.legende('Un Caïd lit ces vies, à la veillée.', { marge: 82, duree: 12 * T - PASSE - 0.25, dans: 0.4 });
    await s.tenir('ArrowDown'); await jusquauPassage(12 * T); await s.lacher('ArrowDown');

    /* 4 — 632 – 661 : Khâlid et les siens en route, en plein jour, du palais vers le forum (loin des chimères de la carte) */
    s.marque('632');
    await s.chapitre('khalid', 2, { obj: 0 }); await s.cadre('carre'); await s.propre({ cible: false });
    await s.arrivee(Z, 0.5);
    await marcher('forum');
    await s.legende('632 – 661', { style: 'titre', duree: 12 * T - PASSE - 0.1, dans: 0.2 });
    await s.legende('Cinq Compagnons, cinq sagas.', { marge: 58, duree: 12 * T - PASSE - 0.25, dans: 0.4 });
    await jusquauPassage(12 * T);
    await s.ev(() => window.ISNAD.world.stop());

    /* 5 — le combat, au tour par tour : la frise des tours, les commandes, le groupe qui joue seul */
    s.marque('combat');
    // l'arène en grand, les commandes juste dessous ; les rangées du groupe restent hors champ (D172 : les mots des figures,
    // exigence 24, ne sont pas montrés) ; joué comme on le joue, commande par commande (s.tourParTour)
    await s.chapitre('khalid', 2, { obj: 0 }); await s.cadre('carre'); await s.propre({ cible: false });
    await s.combat(['echo', 'echo'], { fond: 'romaine', attente: 500 });
    await s.arrivee(0, 0.5);
    // la légende sur le sol de l'arène, sous les figures : ni sur les noms des chimères, ni sur la frise des tours
    await s.legende('On n’y combat jamais<br>des personnes.', { y: 286, style: 'titre', taille: 21, duree: 14 * T - PASSE - 0.2, dans: 0.35 });
    await s.tourParTour(14 * T - PASSE); await s.passage(PASSE, 0);

    /* 6 — la Chaîne : on passe d'un maillon à l'autre */
    s.marque('chaine');
    // tous les maillons ouverts (le décideur, 23 novembre : « Je veux que les sagas soient débloqués dans l'image qui montre
    // les différentes sagas ») : l'interrupteur de test du jeu (I.debug.all, ui.js), posé dans cette page du film seulement ;
    // le jeu garde ses maillons qui se suivent (D211)
    await s.neuf(); await s.cadre('ecran'); await s.ev(() => { window.ISNAD.debug.all = true; window.ISNAD.ui.showChain(); }); await s.avancer(700); await s.ev(() => { document.querySelector('#chain').scrollTop = 250; });
    await s.arrivee(0, 0.4);
    await s.defiler('#chain', 1120, 10 * T);                         // jusqu'au maillon V : le dernier maillon (celui d'Idris, scellé jusqu'aux cinq Lumières) reste hors de l'image
    await s.tourner(10 * T);
    await s.carton(16 * T - 0.3);
  }
};
