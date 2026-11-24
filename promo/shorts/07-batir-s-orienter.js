/* Short 7 — « Bâtir, s’orienter » : creuser une tranchée, bâtir un puits, planter ; puis, de nuit, le cadran des étoiles.
   Tout est joué au doigt, comme sur un téléphone. Les légendes sont des propositions, à valider par le décideur.
   Refait le 24 novembre avec le jeu d'aujourd'hui et dans l'ambiance de D219 (le groupe en route) : on tombe au milieu d'un
   passage (une lueur du montage : rien du jeu n'est changé), à Médine, l'accroche entière dès l'image 1 (s.ouverture) ;
   bâtir comme en 2.33 — la tranchée attendue est en pointillés à sa place, on touche le pointillé et la pièce se pose ;
   puis, sorti par la porte du sud, Abû Bakr en route sur la carte du monde, la petite carte dans le coin (2.29, 2.33 ;
   aucune rencontre le temps de la prise) ; puis, de nuit, le cadran des étoiles. Aucune phrase nouvelle. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const PASSE = 0.45;                                                  // un passage, en secondes
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« Bâtir, s’orienter »', bpm: 100, graine: 633,
  rythme: [
    { a: 'b.T.T...b...T.T.' },                                                         // l'accroche, dans le passage déjà ouvert
    { a: pas('D.t...t.D.t.t...', 44), b: pas('r...r...r...r...', 44) },                // bâtir
    { a: 'b' + pas('.T...T.D...T...D', 23), b: pas('r...r...r...r...', 24) },          // la route (le grand tambour : le passage)
    { a: 'b' + pas('.......t.......D', 27), b: pas('....r.......r...', 28) },          // la nuit, les étoiles
    { a: 'b.......D...............', b: 'r.......................' }                    // le carton final
  ],
  async film(s) {
    // le doigt du joueur : on le montre, puis il touche
    const toucher = async (x, y) => { await s.doigt(x, y); await s.toucher(x, y); };
    const tuile = async (tx, ty) => { const q = await s.ev(a => window.__film.ecran(a[0] * 16 + 8, a[1] * 16 + 9), [tx, ty]); await toucher(q[0], q[1]); };
    const piece = async nom => { const q = await s.ev(n => { const b = [...document.querySelectorAll('#buildbar .pc')].find(b => b.textContent.trim().startsWith(n)); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, nom); if (q) await toucher(q[0], q[1]); else s.dit('! pièce absente de la barre : ' + nom); };
    /* Médine, au couchant : le chapitre où l'on creuse la tranchée */
    await s.chapitre('abubakr', 1, { obj: 7 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
    const t0 = await s.ev(() => { const I = window.ISNAD, W = I.world; ['eau', 'pise', 'palme', 'pierre', 'grain'].forEach(k => I.build.give(k, 9, true)); return [Math.floor(W.player.x / 16), Math.floor((W.player.y - 3) / 16)]; });
    /* l'accroche : au milieu d'un passage ; Abû Bakr fait déjà quelques pas */
    await s.ev(() => { const W = window.ISNAD.world, P = W.player; W.goTo(P.x - 20, P.y + 10, { quiet: true }); }); await s.avancer(200);
    await s.ouverture('Bâtir, s’orienter', { z: 1.5, sec: 1.1, duree: 8 * T - 0.1, legende: { y: 150, taille: 36 } });
    await s.tourner(8 * T);
    await s.ev(() => window.ISNAD.world.stop());
    /* bâtir, au doigt : la tranchée attendue est en pointillés, à sa place — on touche le pointillé, la pièce se pose ;
       puis un puits et des palmiers */
    s.marque('batir');
    await s.ev(() => window.ISNAD.build.set(true)); await s.avancer(64);
    const plan = await s.ev(() => { const L = window.ISNAD.build.plans(); return L.length ? L[0].plan.slice(0, 3) : []; });
    if (!plan.length) s.dit('! aucun pointillé : la tranchée n’a pas de plan ici');
    await s.legende('Creuser, bâtir, planter.', { zone: 'sur', style: 'titre', duree: 22 * T - 0.3, dans: 0.15 });
    await s.tourner(1 * T); if (plan[0]) await tuile(plan[0][0], plan[0][1]); else await tuile(t0[0] - 1, t0[1] + 2);
    await s.tourner(4 * T); if (plan[1]) await tuile(plan[1][0], plan[1][1]); else await tuile(t0[0], t0[1] + 2);
    await s.tourner(4 * T); await piece('Puits');
    await s.tourner(2 * T); await tuile(t0[0] + 3, t0[1] + 1);
    await s.tourner(4 * T); await piece('Palmier');
    await s.tourner(2 * T); await tuile(t0[0] + 4, t0[1] + 2);
    await s.tourner(3 * T); await tuile(t0[0] + 2, t0[1] + 3);
    await s.tourner(2 * T - PASSE); await s.passage(PASSE, 2.6);
    /* la route : sorti de Médine par la porte du sud, Abû Bakr en route sur la carte du monde ; la petite carte dans le coin */
    s.marque('route');
    await s.chapitre('abubakr', 0, { obj: 1, lieu: 'porte_sud' }); await s.cadre('carre'); await s.propre({ cible: false, carte: true });
    await s.ev(() => { window.__film.route('sud'); });
    await s.jusqua(() => window.__film.routeFaite && window.ISNAD.monde.surRoute(), null, 8000);
    await s.avancer(300); await s.finir();
    if (!await s.ev(() => window.__film.surLaPiste(14))) s.dit('! aucune piste devant le groupe');
    await s.avancer(250); await s.zoom(1.5); await s.arrivee(1.5, 0.5);
    await s.tourner(12 * T - PASSE); await s.passage(PASSE, 2.6);
    /* la nuit, au désert : on s'oriente au cadran des étoiles */
    s.marque('etoiles');
    await s.chapitre('khalid', 0, { obj: 4, carte: 'desert', lieu: 'depart', opts: { time: 'night' } }); await s.cadre('carre'); await s.propre({ cible: false, boussole: true }); await s.zoom(1.5);
    await s.arrivee(1.5, 0.5);
    await s.legende('La nuit, on s’oriente<br>aux étoiles.', { style: 'titre', duree: 14 * T - 0.15, dans: 0.1 });
    await s.tenir('ArrowRight'); await s.tourner(7 * T); await s.lacher('ArrowRight');
    await s.tenir('ArrowUp'); await s.tourner(4 * T); await s.lacher('ArrowUp');
    await s.tenir('ArrowRight'); await s.tourner(3 * T); await s.lacher('ArrowRight');
    await s.carton(12 * T);
  }
};
