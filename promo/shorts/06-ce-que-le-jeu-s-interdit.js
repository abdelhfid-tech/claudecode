/* Short 6 — « Ce que ce jeu s’interdit » : trois règles que le jeu se donne, montrées par le jeu.
   Le carton de la parole citée est celui du jeu, avec sa source. Les légendes reprennent les phrases du jeu et du livret ;
   elles restent à valider par le décideur — et la parole citée, par un spécialiste, comme tout le contenu du jeu.
   Refait le 24 novembre dans l'ambiance de D219 : on tombe au milieu d'un passage, à Médine, Abû Bakr déjà en marche,
   l'accroche entière dès l'image 1 (s.ouverture) ; un passage avant la parole citée et avant le combat (une lueur du montage :
   rien du jeu n'est changé) ; le combat au tour par tour, l'arène en grand, les commandes dessous — les rangées du groupe et
   la parole de l'idole restent hors champ (D172). Ce que dit le short ne change pas. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const PASSE = 0.45;                                                  // un passage, en secondes
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« Ce que ce jeu s’interdit »', bpm: 100, graine: 632,
  rythme: [
    { a: 'b.T.T...b...T.T.' },                                                         // l'accroche, dans le passage déjà ouvert
    { a: pas('D.......t.......', 28) },                                                // le voile de lumière
    { a: 'b' + pas('.....t.D...t...D', 31), b: pas('....r.......r...', 32) },          // la parole citée, sa source (le grand tambour : le passage)
    { a: 'b' + pas('.T...T.D.T.T.T.D', 23), b: pas('r.r.r.r.r.r.r.r.', 24) },          // jamais une personne : le combat
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    /* l'accroche : au milieu d'un passage, à Médine, devant la porte sud ; Abû Bakr déjà en marche */
    await s.chapitre('abubakr', 0, { obj: 1 }); await s.cadre('carre'); await s.propre({ cible: false });
    await s.ev(() => { const W = window.ISNAD.world; if (!W._curDuJeu) { W._curDuJeu = W.cur; W.cur = function () { const c = W._curDuJeu.apply(this, arguments); return c && c.goto ? Object.assign({}, c, { goto: null }) : c; }; } W.goTo(488, 365, { quiet: true }); });
    await s.avancer(200);
    await s.ouverture('Ce que ce jeu<br>s’interdit', { z: 1.5, sec: 1.1, duree: 8 * T - 0.1, legende: { y: 150, taille: 36 } });
    await s.tourner(8 * T);
    /* 1 — les Compagnons : un voile de lumière ; l'image se rapproche */
    s.marque('voile');
    await s.legende('Aucun Compagnon n’a de visage :<br>un voile de lumière en tient lieu.', { duree: 14 * T - PASSE - 0.1, dans: 0.1 });
    await s.zoom(3, 3.2);
    await s.tourner(14 * T - PASSE); await s.passage(PASSE, 3);
    await s.ev(() => window.ISNAD.world.stop());
    /* 2 — le Prophète ﷺ n'apparaît jamais : on le cite, avec la source (le carton est celui du jeu) */
    s.marque('parole');
    await s.zoom(1.5); await s.dire('idris', 'Que celui qui est présent'); await s.avancer(64);
    await s.arrivee(0, 0.4);
    await s.legende('Le Prophète ﷺ n’apparaît jamais.<br>On le cite, avec la source.', { y: 432, duree: 16 * T - PASSE - 0.35, dans: 0.4 });
    await s.tourner(16 * T - PASSE); await s.passage(PASSE, 0);
    /* 3 — l'ennemi : jamais une personne ; le combat au tour par tour */
    s.marque('ennemi');
    await s.chapitre('umar', 1, { obj: 0 }); await s.cadre('carre'); await s.propre({ cible: false, bandeau: false });
    await s.ev(n => { const I = window.ISNAD, W = I.world; W.party.forEach(id => { const h = W.hero(id); h.lvl = n; h.xp = 0; const st = I.calc.of(h); h.hp = st.hp; h.sp = st.sp; }); }, 6);   // le niveau qu'un joueur y atteint (smoke.js auto)
    await s.combat(['aigle'], { idole: true, fond: 'ville', attente: 600 });
    await s.arrivee(0, 0.5);
    await s.legende('Aucun ennemi n’est une personne,<br>un peuple ni une religion.', { y: 286, style: 'titre', taille: 20, duree: 12 * T - 0.15, dans: 0.25 });
    await s.tourParTour(12 * T);
    await s.carton(12 * T);
  }
};
