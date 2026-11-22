/* Short 9 — « Trois époques, une seule chaîne » : 2084 (la Cité-Miroir), la Citadelle du Caïd, les années 632 – 661.
   Refait le 22 novembre, pilote des shorts refaits (D219 ; le décideur : « je veux retrouver l'ambiance » d'un grand JRPG
   16 bits — le voyage dans le temps, le groupe en route, le combat au tour par tour, un souffle qui monte ; pas forcément
   tout dans le même short). Celui-ci est le voyage dans le temps : chaque époque s'ouvre par un passage, une lueur du
   montage (s.passage, s.arrivee : rien du jeu n'est changé) ; puis le groupe de Khâlid en route, en plein jour, dans la cité
   romaine de Qinnasrîn, un combat au tour par tour, et la Chaîne qui défile. Les lieux, les personnages et le combat sont ceux du jeu.
   Les légendes sont celles des films livrés (09, et 03 pour le combat) : aucune phrase nouvelle.
   Le son : des percussions seules (D176), qui montent d'une époque à l'autre ; le grand tambour marque chaque passage.
   30 secondes avec le plan du soutien (25,2 s de film, puis 4,8 s). */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);  // un motif, tenu pendant n pas (un pas : un quart de temps)
const PASSE = 0.45;                                                  // un passage d'une époque à l'autre, en secondes
const Z = 1.5;                                                       // l'image d'un lieu, agrandie comme sur un téléphone
module.exports = {
  titre: '« Trois époques, une seule chaîne »', bpm: 100, graine: 1508,
  rythme: [
    { a: 'b.......t...T.T.' },                                                               // l'accroche, sur la Chaîne (8 T)
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

    /* 1 — l'accroche, sur l'écran de la Chaîne */
    await s.cadre('ecran'); await s.ev(() => { window.ISNAD.ui.showChain(); }); await s.avancer(700);
    // sous l'accroche, le fond d'encre de l'outil (le calque du plan du soutien) : la Chaîne reste visible en transparence,
    // l'accroche se lit seule (le voile « ombre », un dégradé, ne fonce presque pas le milieu de l'image)
    await s.ev(() => window.__film.rampe('fond', 0.85, 0));
    await s.legende('Trois époques,<br>une seule chaîne', { y: 210, style: 'accroche', taille: 36, duree: 8 * T - PASSE, dans: 0.12 });
    await s.defiler('#chain', 420, 8 * T);
    await jusquauPassage(8 * T);

    /* 2 — 2084, la Cité-Miroir */
    s.marque('2084'); await s.ev(() => window.__film.rampe('fond', 0, 0));   // la lueur couvre encore l'image : le fond d'encre s'en va sans se voir
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
    await s.chapitre('khalid', 2, { obj: 0 }); await s.cadre('ecran'); await s.propre({ rangees: true, cible: false });
    await s.combat(['echo', 'echo'], { fond: 'romaine', attente: 500 });
    await s.arrivee(0, 0.5);
    // la légende sur le sol de l'arène, sous les figures : ni sur les noms des chimères, ni sur la frise des tours
    await s.legende('On n’y combat jamais<br>des personnes.', { y: 224, style: 'titre', taille: 22, duree: 14 * T - PASSE - 0.2, dans: 0.35 });
    await s.auto(true); await s.touche('Enter'); await s.tourner(2 * T); await s.touche('Enter');   // « Frapper », puis la cible : ensuite le groupe joue seul
    await jusquauPassage(12 * T);

    /* 6 — la Chaîne : on passe d'un maillon à l'autre */
    s.marque('chaine');
    await s.neuf(); await s.cadre('ecran'); await s.ev(() => { window.ISNAD.ui.showChain(); }); await s.avancer(700); await s.ev(() => { document.querySelector('#chain').scrollTop = 250; });
    await s.arrivee(0, 0.4);
    await s.defiler('#chain', 1500, 10 * T);
    await s.tourner(10 * T);
    await s.carton(16 * T - 0.2);
  }
};
