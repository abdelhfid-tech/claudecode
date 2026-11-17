/* Short 7 — « Bâtir, s’orienter » : creuser une tranchée, bâtir un puits, planter ; puis, de nuit, le cadran des étoiles.
   Tout est joué au doigt, comme sur un téléphone. Les légendes sont des propositions, à valider par le décideur. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);
module.exports = {
  titre: '« Bâtir, s’orienter »', bpm: 100, graine: 633,
  rythme: [
    { a: 'b...............' },                                                         // l'accroche
    { a: pas('D.t...t.D.t.t...', 44), b: pas('r...r...r...r...', 44) },                // bâtir
    { a: pas('D.......t.......', 28), b: pas('....r.......r...', 28) },                // la nuit, les étoiles
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
    /* l'accroche */
    await s.ombre(0.6, 0);
    await s.legende('Bâtir, s’orienter', { y: 150, style: 'accroche', taille: 36, duree: 8 * T - 0.1, dans: 0.12 });
    await s.tourner(8 * T); await s.ombre(0, 0.3);
    /* bâtir, au doigt : deux segments de tranchée, un puits, deux palmiers */
    s.marque('batir');
    await s.ev(() => window.ISNAD.build.set(true)); await s.avancer(64);
    await s.legende('Creuser, bâtir, planter.', { zone: 'sur', style: 'titre', duree: 22 * T - 0.3, dans: 0.15 });
    await s.tourner(1 * T); await tuile(t0[0] - 1, t0[1] + 2);
    await s.tourner(4 * T); await tuile(t0[0], t0[1] + 2);
    await s.tourner(4 * T); await piece('Puits');
    await s.tourner(2 * T); await tuile(t0[0] + 3, t0[1] + 1);
    await s.tourner(4 * T); await piece('Palmier');
    await s.tourner(2 * T); await tuile(t0[0] + 4, t0[1] + 2);
    await s.tourner(3 * T); await tuile(t0[0] + 2, t0[1] + 3);
    await s.tourner(2 * T);
    /* la nuit, au désert : on s'oriente au cadran des étoiles */
    s.marque('etoiles'); await s.noir(1, 0);
    await s.chapitre('khalid', 0, { obj: 4, carte: 'desert', lieu: 'depart', opts: { time: 'night' } }); await s.cadre('carre'); await s.propre({ cible: false, boussole: true }); await s.zoom(1.5);
    await s.noir(0, 0.2);
    await s.legende('La nuit, on s’oriente<br>aux étoiles.', { style: 'titre', duree: 14 * T - 0.15, dans: 0.1 });
    await s.tenir('ArrowRight'); await s.tourner(7 * T); await s.lacher('ArrowRight');
    await s.tenir('ArrowUp'); await s.tourner(4 * T); await s.lacher('ArrowUp');
    await s.tenir('ArrowRight'); await s.tourner(3 * T); await s.lacher('ArrowRight');
    await s.carton(12 * T);
  }
};
