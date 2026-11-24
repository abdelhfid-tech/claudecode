/* Short 3 — « On n’y combat jamais des personnes » : trois idoles, et ce que Maître Yûnus en dit.
   Les combats sont ceux du jeu, joués comme on les joue (s.tourParTour : le menu, « Frapper », la cible, le coup) ; la
   réplique est la sienne. Les légendes reprennent les phrases déjà validées pour le livret ; elles restent à valider ici.
   Refait le 24 novembre dans l'ambiance de D219 : on tombe au milieu d'un passage, dans le premier combat, l'accroche entière
   dès l'image 1 (s.ouverture) ; un passage d'une idole à l'autre (une lueur du montage : rien du jeu n'est changé) ; le
   combat au tour par tour, l'arène en grand, les commandes juste dessous — les rangées du groupe et la parole de l'idole
   restent hors champ (D172). Le grand tambour marque chaque passage.
   Un seul combat (le décideur, 24 novembre : « Diversifie les angles de présentation du jeu ! ») : après le Trône vide, les
   chimères modernes de 2084, dans les rues des quartiers de la Cité-Miroir, qu'Idris est seul à voir (2.23) — les idoles
   que les cœurs fabriquent ensemble ; le prologue est posé comme joué dans la page du film (sans lui, elles ne rôdent pas). */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const PASSE = 0.45;                                                  // un passage, en secondes
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
// [récit, chapitre, idole, fond, groupe aligné contre elle, son niveau (celui du parcours automatique, smoke.js auto)]
const IDOLE = ['umar', 2, ['trone'], 'ville', null, 9];
module.exports = {
  titre: '« On n’y combat jamais des personnes »', bpm: 100, graine: 638,
  rythme: [
    { a: 'b.T.T...b...T.T.' },                                                         // l'accroche, dans le passage déjà ouvert
    { a: 'b' + pas('.T.D.T.D.T.T.T.D', 23), b: pas('r.r.r.r.r.r.r.r.', 24) },          // le Trône vide
    { a: 'b' + pas('.t.t.T.D.t.t.T.D', 23), b: pas('..r...r...r...r.', 24) },          // les chimères de 2084, dans les rues
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

    /* l'accroche, au milieu d'un passage, dans le combat du Trône vide */
    await combat(IDOLE);
    await s.ouverture('On n’y combat jamais<br>des personnes.', { z: 0, sec: 1.1, duree: 8 * T - PASSE + 0.05, legende: { y: 150, taille: 31 } });
    await s.tourParTour(8 * T);
    /* le Trône vide, au tour par tour ; la légende sur le sol de l'arène, sous les figures */
    s.marque('trone');
    await s.legende('Seulement des égrégores :', { y: 296, style: 'titre', taille: 21, duree: 12 * T - PASSE - 0.1, dans: 0.15 });
    await jouer(12 * T);
    /* 2084 : les chimères modernes vont par les rues des quartiers ; elles passent au travers des passants, qui ne les voient pas */
    s.marque('rues');
    await s.neuf();   // une page neuve (le combat d'avant est refermé), puis le prologue posé comme joué : sans lui, les chimères ne rôdent pas
    const ciQ = await s.ev(() => { window.ISNAD.save.data.prologue = true; return window.ISNAD.sagas.idris.chapters.findIndex(c => c.id === 'c_quartiers'); });
    await s.chapitre('idris', ciQ, { obj: 0, carte: 'quartiers', lieu: 'parvis' }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.2);
    // Idris à sept cases d'une chimère, en diagonale (au-delà de sa vue : elle ne le prend pas en chasse), sur une case libre
    const vue = await s.ev(() => { const I = window.ISNAD, W = I.world, P = W.player, L = (I.rodeurs.rodent ? I.rodeurs.rodent() : W.foes.filter(f => f.rodeur && f.placed)) || [];
      for (const f of L) for (const [dx, dy] of [[-80, -80], [80, -80], [-80, 80], [80, 80], [-100, -40], [100, 40]]) { const x = f.x + dx, y = f.y + dy; if (W.solidAt(x, y) || W.solidAt(x, y - 6)) continue;
        P.x = x; P.y = y; P.dir = dy < 0 ? 0 : 3; W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([P.x, P.y, P.dir]); W.updateCam(true); return [f.group && f.group[0], Math.round(x), Math.round(y)]; }
      return null; });
    if (!vue) s.dit('! aucune chimère dans les rues'); else s.dit('dans les rues, près de : ' + JSON.stringify(vue));
    await s.arrivee(1.2, 0.5);
    await s.legende('les idoles que les cœurs<br>fabriquent ensemble.', { style: 'titre', taille: 21, duree: 12 * T - PASSE - 0.1, dans: 0.2 });
    await s.tourner(12 * T - PASSE); await s.passage(PASSE, 2.4);
    /* ce qu'en dit Maître Yûnus, aux Archives basses */
    s.marque('yunus');
    await s.chapitre('idris', 0, { carte: 'archives', lieu: ['bureau', 2, 1], obj: 3 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.8);
    await s.arrivee(1.8, 0.5);
    await s.dire('idris', 'On ne détruit pas une idole');
    await s.tourner(16 * T);
    await s.carton(12 * T);
  }
};
