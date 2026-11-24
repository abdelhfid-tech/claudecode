/* Short 3 — « On n’y combat jamais des personnes » : trois idoles, et ce que Maître Yûnus en dit.
   Les combats sont ceux du jeu, joués comme on les joue (s.tourParTour : le menu, « Frapper », la cible, le coup) ; la
   réplique est la sienne. Les légendes reprennent les phrases déjà validées pour le livret ; elles restent à valider ici.
   Refait le 24 novembre dans l'ambiance de D219 : on tombe au milieu d'un passage, dans le premier combat, l'accroche entière
   dès l'image 1 (s.ouverture) ; un passage d'une idole à l'autre (une lueur du montage : rien du jeu n'est changé) ; le
   combat au tour par tour, l'arène en grand, les commandes juste dessous — les rangées du groupe et la parole de l'idole
   restent hors champ (D172). Le grand tambour marque chaque passage. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const PASSE = 0.45;                                                  // un passage, en secondes
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
// [récit, chapitre, idole, fond, groupe aligné contre elle, son niveau (celui du parcours automatique, smoke.js auto)]
const IDOLES = [['umar', 2, ['trone'], 'ville', null, 9], ['khalid', 2, ['idole_heros'], 'ville', null, 9], ['ali', 1, ['slogan'], 'ville', ['ali', 'ibnabbas', 'qays'], 6]];
module.exports = {
  titre: '« On n’y combat jamais des personnes »', bpm: 100, graine: 638,
  rythme: [
    { a: 'b.T.T...b...T.T.' },                                                         // l'accroche, dans le passage déjà ouvert
    { a: 'b' + pas('.T.D.T.D.T.T.T.D', 23), b: pas('r.r.r.r.r.r.r.r.', 24) },          // le Trône vide
    { a: 'b' + pas('.TtD.T.D.TtT.T.D', 23), b: pas('r.r.r.r.r.r.r.r.', 24) },          // l'Idole du Héros
    { a: 'b' + pas('.TtD.TtD.TtT.TtD', 23), b: pas('r.r.r.r.r.r.r.r.', 24) },          // le Slogan
    { a: 'b' + pas('.......t.......D', 31) },                                          // Maître Yûnus
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    const jusquauPassage = async (sec, z, fn) => { await s.tourner(sec - PASSE, fn); await s.passage(PASSE, z); };
    const combat = async ([recit, ci, idole, fond, groupe, niv]) => {
      await s.chapitre(recit, ci, { obj: 0, groupe: groupe || undefined }); await s.cadre('carre'); await s.propre({ cible: false, bandeau: false });
      if (niv) await s.ev(n => { const I = window.ISNAD, W = I.world; W.party.forEach(id => { const h = W.hero(id); h.lvl = n; h.xp = 0; const st = I.calc.of(h); h.hp = st.hp; h.sp = st.sp; }); }, niv);
      await s.combat(idole, { idole: true, fond, attente: 600 }); };
    // le combat filmé comme on le joue, jusqu'au passage
    const jouer = async sec => { await s.tourParTour(sec - PASSE); await s.passage(PASSE, 0); };

    /* l'accroche, au milieu d'un passage, dans le premier combat */
    await combat(IDOLES[0]);
    await s.ouverture('On n’y combat jamais<br>des personnes.', { z: 0, sec: 1.1, duree: 8 * T - PASSE + 0.05, legende: { y: 150, taille: 31 } });
    await s.tourParTour(8 * T);
    /* trois idoles, chacune au tour par tour ; un passage de l'une à l'autre */
    for (let i = 0; i < IDOLES.length; i++) {
      if (i) { await combat(IDOLES[i]); await s.arrivee(0, 0.5); }
      s.marque(IDOLES[i][2][0]);
      // sur le sol de l'arène, sous les figures : ni sur les noms des chimères, ni sur la frise des tours
      if (i === 0) await s.legende('Seulement des égrégores :', { y: 296, style: 'titre', taille: 21, duree: 12 * T - PASSE - 0.1, dans: 0.15 });
      if (i === 1) await s.legende('les idoles que les cœurs<br>fabriquent ensemble.', { y: 286, style: 'titre', taille: 21, duree: 12 * T - PASSE - 0.1, dans: 0.25 });
      await jouer(12 * T);
    }
    /* ce qu'en dit Maître Yûnus, aux Archives basses */
    s.marque('yunus');
    await s.chapitre('idris', 0, { carte: 'archives', lieu: ['bureau', 2, 1], obj: 3 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.8);
    await s.arrivee(1.8, 0.5);
    await s.dire('idris', 'On ne détruit pas une idole');
    await s.tourner(16 * T);
    await s.carton(12 * T);
  }
};
