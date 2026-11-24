/* Short 8 — « Tenir les rangs » : une bataille déclarée (2.x). Le champ, nos rangs, les nuées d'une idole, les ordres.
   Ce n'est pas une reconstitution (exigence 19) : en face, jamais d'hommes ; aucune légende ne dit qu'on rejoue un jour de
   l'histoire. Les légendes sont des propositions, à valider par le décideur.
   Refait le 24 novembre dans l'ambiance de D219 : on tombe au milieu d'un passage (une lueur du montage : rien du jeu n'est
   changé), sur la bataille déjà déclarée, l'accroche entière dès l'image 1 (s.ouverture) ; la mêlée de la fin se joue au
   tour par tour, commande par commande (s.tourParTour). Les rangées du groupe et la parole de l'idole restent hors champ (D172). */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« Tenir les rangs »', bpm: 100, graine: 636,
  rythme: [
    { a: 'b.T.T...b...T.T.' },                                                         // l'accroche, dans le passage déjà ouvert
    { a: pas('D...D...D.D.D...', 24), b: pas('....r.......r...', 24) },                // le champ, les rangs
    { a: pas('D.t.D.t.D.D.D.t.', 28), b: pas('r...r...r...r...', 28) },                // un ordre
    { a: pas('D.T.D.T.D.T.T.T.', 20), b: pas('r.r.r.r.r.r.r.r.', 20) },                // la mêlée
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    // le doigt touche une ligne du menu de combat, désignée par son début
    const ligne = async debut => { const q = await s.ev(d => { const b = [...document.querySelectorAll('#battle .cmd .mi')].find(b => b.textContent.trim().replace(/^\S+\s*/, '').startsWith(d) || b.textContent.trim().startsWith(d)); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, debut);
      if (!q) { s.dit('! ligne absente : ' + debut + ' — ' + JSON.stringify(await s.ev(() => [...document.querySelectorAll('#battle .cmd .mi')].map(e => e.textContent.trim().slice(0, 24))))); return false; } await s.doigt(q[0], q[1]); await s.toucher(q[0], q[1]); return true; };
    /* le combat d'idole du chapitre, tel que le récit le lance : la bataille se déclare */
    await s.chapitre('khalid', 1, { obj: 6 }); await s.cadre('ecran'); await s.propre({ bandeau: false });
    await s.ev(() => { const I = window.ISNAD, W = I.world; const b = (function f(x) { if (!x || typeof x !== 'object') return null; if (Array.isArray(x) && x[0] === 'battle') return x; for (const k in x) { const r = f(x[k]); if (r) return r; } return null; })(W.ch.objectives[6].then); I.script.run([b]); });
    await s.jusqua(() => !!document.querySelector('.screen:not([hidden]) button, #choice:not([hidden]) .opt'), null, 8000); await s.avancer(300); await s.touche('Enter');
    await s.jusqua(() => !!document.querySelector('#battle .cmd .mi'), null, 30000); await s.avancer(2400);
    /* l'accroche : au milieu d'un passage, sur la bataille déclarée ; entière dès l'image 1 */
    await s.ouverture('Tenir les rangs', { z: 0, sec: 1.1, duree: 8 * T - 0.1, legende: { y: 120, taille: 36 } });
    await s.tourner(8 * T);
    /* « Ordonner » : le champ se montre, avec nos rangs et les nuées de l'idole */
    s.marque('champ');
    await s.legende('Des rangs à tenir,<br>des ordres à donner.', { zone: 'sur', style: 'titre', duree: 12 * T - 0.3, dans: 0.5 });
    await s.tourner(1 * T); await ligne('Ordonner');
    await s.tourner(11 * T);
    /* un ordre : la réserve avance */
    s.marque('ordre');
    await ligne('2'); await s.tourner(5 * T);
    await ligne('Avancer'); await s.legende('En face, jamais d’hommes :<br>les nuées d’une idole.', { y: 470, style: 'titre', duree: 9 * T - 0.2, dans: 0.3 });
    await s.tourner(9 * T);
    /* la mêlée reprend, au tour par tour : le menu, « Frapper », la cible, le coup */
    s.marque('melee');
    await s.tourParTour(10 * T);
    await s.carton(12 * T);
  }
};
