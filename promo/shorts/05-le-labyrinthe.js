/* Short 5 — « Le labyrinthe » : la noosphère d'un chapitre (2.x). Un labyrinthe tiré au hasard, un chrono, de petits
   égrégores qui rôdent sur les ponts et que l'on frappe. Tout est le jeu ; les légendes sont des propositions, à valider.
   Refait le 24 novembre dans l'ambiance de D219 : on tombe au milieu d'un passage (une lueur du montage : rien du jeu n'est
   changé), dans le labyrinthe, le héros déjà en marche, l'accroche entière dès l'image 1 (s.ouverture) ; un passage d'un
   plan à l'autre. Ce que dit le short ne change pas. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const PASSE = 0.45;                                                  // un passage, en secondes
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« Le labyrinthe »', bpm: 100, graine: 20261117,
  rythme: [
    { a: 'b.T.T...b...T.T.' },                                                         // l'accroche, dans le passage déjà ouvert
    { a: pas('D.t.t.t.D.t.t.t.', 24), b: pas('..r...r...r...r.', 24) },                // on s'y enfonce
    { a: 'b' + pas('.T.D.T.D.T.T.T.D', 27), b: pas('r.r.r.r.r.r.r.r.', 28) },          // ce qui rôde (le grand tambour : le passage)
    { a: 'b' + pas('.TtD.TtD.TtT.TtD', 19), b: pas('r.r.r.r.r.r.r.r.', 20) },          // le chrono
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    /* la noosphère du premier chapitre : le récit dit « on descend », et l'on trouve un labyrinthe */
    await s.chapitre('abubakr', 0, { obj: 3 }); await s.cadre('carre');
    await s.ev(() => { const I = window.ISNAD, F = window.__film; I.debug.sansMeutes = false; I.debug.profondeur = 3; I.debug.graine = 20261117; F.parle = true; I.script.run([['map', 'noos', 'seuil', { hue: 210 }]]).then(() => { F.parle = false; }); });
    await s.jusqua(() => !window.__film.parle, null, 20000); await s.avancer(400);
    await s.propre({ cible: false, carte: true }); await s.zoom(1);
    /* l'accroche : au milieu d'un passage ; le héros a déjà pris le chemin d'un lieu que le récit nomme */
    await s.ev(() => { const W = window.ISNAD.world, q = W.spotPx('noeud1'); W.goTo(q[0], q[1], { quiet: true }); }); await s.avancer(200);
    await s.ouverture('Le labyrinthe', { z: 1, sec: 1.1, duree: 8 * T - 0.1, legende: { y: 150, taille: 38 } });
    await s.tourner(8 * T);
    /* on s'y enfonce */
    s.marque('marche');
    await s.legende('La noosphère : un labyrinthe<br>tiré au hasard.', { style: 'titre', duree: 12 * T - PASSE - 0.1, dans: 0.1 });
    await s.zoom(1.5, 2.4);
    await s.tourner(12 * T - PASSE); await s.passage(PASSE, 2.4);
    /* ce qui rôde : on se place sur son pont, on le frappe (au ralenti) */
    s.marque('rode');
    const pres = await s.ev(() => { const I = window.ISNAD, W = I.world, R = I.rodeurs, P = W.player; W.stop();
      const l = R.rodent().map(f => [f, Math.hypot(f.x - P.x, f.y - P.y)]).sort((a, b) => a[1] - b[1]); if (!l.length) return null; const f = l[0][0];
      for (const d of [26, 30, 22, 34]) for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, x = f.x + Math.cos(a) * d, y = f.y + Math.sin(a) * d; if (W.solidAt(x, y) || W.solidAt(x, y - 6)) continue;
        P.x = x; P.y = y; const dx = f.x - x, dy = f.y - y; P.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([P.x, P.y, P.dir]); W.updateCam(true); return [f.id, Math.round(x), Math.round(y), d]; }
      return null; });
    s.dit('près de ce qui rôde : ' + JSON.stringify(pres));
    await s.zoom(1.8); await s.avancer(64); await s.arrivee(1.8, 0.5);
    await s.legende('Ce qui rôde,<br>on le frappe.', { style: 'titre', duree: 14 * T - PASSE - 0.1, dans: 0.1 });
    s.ralenti(0.5);
    await s.tourner(14 * T - PASSE, async (t, i) => { if (i % 12 === 4 && await s.ev(() => { const I = window.ISNAD; return I.rodeurs.aFrapper() && !I.script.busy && !I.battle.active; })) await s.touche('Enter'); });
    s.ralenti(1); await s.passage(PASSE, 2.6);
    /* le chrono : il ne court que lorsque le joueur a la main */
    s.marque('chrono');
    await s.finir();
    await s.ev(() => { const W = window.ISNAD.world, q = W.spotPx('seuil'); W.player.x = q[0]; W.player.y = q[1]; W.updateCam(true); const c = W.spotPx('coeur'); W.goTo(c[0], c[1], { quiet: true }); });
    await s.zoom(1.25); await s.arrivee(1.25, 0.5);
    await s.legende('Et le chrono tourne.', { style: 'titre', duree: 10 * T - 0.15, dans: 0.1 });
    await s.tourner(10 * T);
    await s.carton(12 * T);
  }
};
