/* Short 10 — « Dans ta main » : le jeu sur un téléphone, tel que le joueur le voit — on touche, on écarte deux doigts,
   on lit. Les légendes sont des propositions, à valider par le décideur.
   Refait le 24 novembre (D219) avec le jeu d'aujourd'hui — la manette A et B, l'image agrandie — : on tombe au milieu d'un
   passage (une lueur du montage : rien du jeu n'est changé), le héros déjà en marche, l'accroche entière dès l'image 1
   (s.ouverture). Ce que dit le short ne change pas. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« Dans ta main »', bpm: 100, graine: 632,
  rythme: [
    { a: 'b.T.T...b...T.T.' },                                                         // l'accroche, dans le passage déjà ouvert
    { a: pas('D.t...t.D.t.t...', 24), b: pas('....r.......r...', 24) },                // toucher
    { a: pas('D.t.t.t.D.t.t.t.', 24), b: pas('r...r...r...r...', 24) },                // écarter deux doigts
    { a: pas('D.T...T.D...T...', 24), b: pas('r.r.r.r.r.r.r.r.', 24) },                // parler, lire
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    const toucherMonde = async (wx, wy) => { const q = await s.ev(a => window.__film.ecran(a[0], a[1]), [wx, wy]); await s.doigt(q[0], q[1]); await s.toucher(q[0], q[1]); };
    /* l'écran du téléphone, tel quel : Médine, devant la porte sud */
    await s.chapitre('abubakr', 0, { obj: 1 }); await s.cadre('ecran'); await s.propre({ boutons: true, hud: true, carte: true, noms: true, pad: true, cible: true });
    const p0 = await s.ev(() => [window.ISNAD.world.player.x, window.ISNAD.world.player.y]);
    /* l'accroche : au milieu d'un passage ; le héros a déjà fait quelques pas */
    await s.ev(() => { const W = window.ISNAD.world, P = W.player; W.goTo(P.x + 18, P.y - 30, { quiet: true }); }); await s.avancer(200);
    await s.ouverture('Dans ta main', { z: 0, sec: 1.1, duree: 8 * T - 0.1, legende: { y: 120, taille: 40 } });
    await s.tourner(8 * T);
    /* toucher un endroit : le héros s'y rend */
    s.marque('toucher');
    await s.legende('Tu touches : il y va.', { y: 446, style: 'titre', duree: 12 * T - 0.2, dans: 0.15 });
    await s.tourner(1 * T); await toucherMonde(p0[0] + 4, p0[1] - 64);
    await s.tourner(6 * T); await toucherMonde(p0[0] - 40, p0[1] - 96);
    await s.tourner(5 * T);
    /* deux doigts qui s'écartent : l'image s'agrandit */
    s.marque('agrandir');
    await s.legende('Deux doigts : l’image s’agrandit.', { y: 446, style: 'titre', duree: 12 * T - 0.2, dans: 0.15 });
    await s.tourner(2 * T);
    await s.doigt(165, 170, 105, 215, 1.5); await s.doigt(195, 150, 255, 105, 1.5); await s.zoom(3, 1.5);
    await s.tourner(10 * T);
    /* toucher quelqu'un : il parle, et le texte se lit */
    s.marque('parler'); await s.zoom(1.5, 0.6); await s.tourner(2 * T);
    const n = await s.ev(() => { const W = window.ISNAD.world, n = W.npcs.find(n => n.id === 'abuubayda'); return [n.x, n.y - 10]; });
    await toucherMonde(n[0], n[1]);
    await s.legende('Dans le navigateur.<br>Sans installation.', { y: 124, style: 'titre', duree: 10 * T - 0.6, dans: 0.5 });
    await s.tourner(10 * T);
    await s.carton(12 * T);
  }
};
