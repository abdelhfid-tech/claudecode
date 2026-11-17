/* Short 11 — « La noosphère » : ce qu'elle est, dit par le jeu (Maître Yûnus, aux Archives basses), puis la descente du
   râwî dans la sienne (2.x, exigence 22) : un labyrinthe où rôdent ses maux du cœur et les idées noires. Seul, il ne les
   vainc pas : il frappe pour passer, et trouve l'issue.
   On y entre « en songe » — ni par la prière ni par le dhikr : un film de promotion qui montrerait la prière comme une
   porte pourrait être mal compris (exigences 13 et 15). Le râwî descend seul : aucun Compagnon n'est dans le labyrinthe.
   Tout ce qu'on lit vient du jeu : la réplique est demandée par un fragment, les deux cartons sont ceux du jeu, la règle
   est lue dans ses textes (ISNAD.rodeurs.texte). Seul le titre de l'accroche est ajouté.
   Les choix — la porte, l'issue plutôt que l'abri, la durée — ont été approuvés avec le plan (docs/decisions.md, D177). */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);  // un motif, tenu pendant n pas (un pas : un quart de temps)

/* Le labyrinthe de ce film est toujours le même : sa graine et sa profondeur sont fixées. Ce qui y rôde, en revanche, erre
   au hasard — d'une prise à l'autre, il ne serait pas au même endroit. On pose donc les « acteurs » comme sur un plateau :
   le râwî à un endroit du plan, ceux qui rôdent au milieu d'une case [colonne, ligne]. Une fois posés, ils font ce que le
   jeu leur fait faire : à moins de seize cases, ils prennent le râwî en chasse ; plus loin, ils errent. */
const GRAINE = 20261118, PROFONDEUR = 2;
const COULOIR_DU_MILIEU = { rawi: [616, 290, 1], pres: [34, 18] };   // un pont d'ouest en est, au cœur du lieu : le râwî regarde à gauche
const COULOIR_DU_HAUT = { rawi: [472, 50, 1], pres: [27, 3] };       // un autre, tout en haut
const AU_LOIN = [[10, 32], [45, 32], [37, 32], [50, 32]];            // le grand pont du bas : trop loin pour arriver pendant un plan

// La descente, demandée comme le fait le contrôle du jeu (v2/tools/descente.js) : un récit est en cours — c'est là qu'on
// remonte ensuite —, et la porte du songe s'ouvre. Rend la main quand le carton du seuil est à l'écran.
async function seuil(s) {
  await s.neuf();
  await s.chapitre('abubakr', 0, { obj: 1 }); await s.cadre('carre'); await s.propre({ cible: false });
  await s.ev(([g, n]) => { const I = window.ISNAD; I.debug.sansMeutes = true; I.debug.profondeur = n; I.debug.graine = g; delete I.script.flags._o_porte_sommeil; I.rodeurs.demande('sommeil'); }, [GRAINE, PROFONDEUR]);
  const vu = await s.jusqua(() => { const c = document.querySelector('#card'); return !!c && !c.hidden && c.classList.contains('noos'); }, null, 9000);
  if (!vu) s.erreurs.push('le carton du seuil n’est pas venu');
  await s.avancer(320);
}
// Le carton passé, le labyrinthe est là et le râwî a la main.
async function entrer(s) {
  await s.touche('Enter');
  const la = await s.jusqua(() => { const I = window.ISNAD, W = I.world, c = document.querySelector('#card'); return !!W.excursion && !I.script.busy && !W.lock && (!c || c.hidden) && W.foes.some(f => f.rodeur && f.placed); }, null, 15000);
  if (!la) s.erreurs.push('la descente n’a pas commencé');
  await s.avancer(200);
  s.dit('ce qui rôde : ' + JSON.stringify(await s.ev(() => { const I = window.ISNAD, e = (I.sagas.coeur || {}).enemies || {}; return I.world.foes.filter(f => f.rodeur).map(f => (e[f.group[0]] || {}).name || f.group[0]); })));
}
// Pose les acteurs : le râwî [x, y, direction] (ou rien : il reste où il est), et ceux qui rôdent { clé: [colonne, ligne] }.
async function poser(s, rawi, rodeurs) {
  const fautes = await s.ev(([rawi, rodeurs]) => { const W = window.ISNAD.world, P = W.player, m = W.map, fautes = []; W.stop();
    Object.keys(rodeurs).forEach(id => { const f = W.foes.find(f => f.rodeur && f.group[0] === id), [cx, cy] = rodeurs[id];
      if (!f) { fautes.push(id + ' ne rôde pas ici'); return; } if (m.solid[cy * m.w + cx]) { fautes.push(id + ' : la case ' + cx + ', ' + cy + ' est un mur'); return; }
      f.x = cx * 16 + 8; f.y = cy * 16 + 8; f.cx = null; f.cy = null; f.dx = 0; f.dy = 0; f.sonne = 0; f.pousse = null; });
    if (rawi) { const [x, y, dir] = rawi; if (W.solidAt(x, y) || W.solidAt(x, y - 6)) fautes.push('le râwî serait dans un mur');
      P.x = x; P.y = y; P.dir = dir; W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([P.x, P.y, P.dir]); W.updateCam(true); }
    if (W.excursion) { W.excursion.champ = null; W.excursion.champT = 0; }   // les distances au râwî sont à refaire
    return fautes; }, [rawi, rodeurs]);
  fautes.forEach(f => s.erreurs.push('mise en place : ' + f));
}
// La descente tient-elle toujours ? (rattrapé, le râwî remonte : le plan serait à refaire)
async function tient(s, quoi) {
  if (!await s.ev(() => { const c = document.querySelector('#card'); return !!window.ISNAD.world.excursion && (!c || c.hidden); })) s.erreurs.push('le râwî a été rattrapé pendant ' + quoi);
}

module.exports = {
  titre: '« La noosphère »', bpm: 100, graine: 2084,
  rythme: [
    { a: 'b...............' },                                                         // 1 · l'accroche
    { a: pas('D.......t.......', 56) },                                                // 2 · ce qu'en dit Maître Yûnus
    { a: 'b.......t.......' },                                                         // 3 · le seuil : « tu y descends »
    { a: pas('D.t.t.t.D.t.t.t.', 30), b: pas('..r...r...r...r.', 30) },                // 4 · le labyrinthe
    { a: pas('D.T.D.T.D.T.T.T.', 18), b: pas('r.r.r.r.r.r.r.r.', 18) },                //     ce qui rôde, frappé
    { a: pas('D.....t.D...t...', 30), b: pas('....r.......r...', 30) },                // 5 · l'issue
    { a: 'b.......D...............', b: 'r.......................' }                    // 6 · le carton final
  ],
  async film(s) {
    // à portée, le râwî frappe : sonné, ce qui rôde n'attrape personne
    const frapper = async () => { if (await s.ev(() => { const I = window.ISNAD; return I.rodeurs.aFrapper() && !I.script.busy && !I.battle.active; })) await s.touche('Enter'); };
    /* 1 — l'accroche : le labyrinthe de la descente ; une idée noire vient sur le râwî (au ralenti), il la frappe */
    await seuil(s); await entrer(s);
    await poser(s, COULOIR_DU_MILIEU.rawi, { noir_honte: COULOIR_DU_MILIEU.pres, avidite: AU_LOIN[0], orgueil: AU_LOIN[1] });
    await s.propre({ cible: false }); await s.zoom(1.3);   // en hauteur, la scène carrée montre 216 points du lieu : à 1,3, ce qui rôde à quatre cases est dans l'image
    await s.ombre(0.38, 0);
    await s.legende('La noosphère', { y: 96, style: 'accroche', taille: 38, duree: 8 * T - 0.1, dans: 0.12 });
    s.ralenti(0.5); await s.tourner(8 * T, frapper); s.ralenti(1);
    await tient(s, 'l’accroche');
    /* 2 — ce qu'elle est : la réplique de Maître Yûnus, aux Archives basses */
    s.marque('yunus'); await s.noir(1, 0); await s.ombre(0, 0);
    await s.neuf();
    await s.chapitre('idris', 0, { carte: 'archives', lieu: ['bureau', 2, 1], obj: 3 }); await s.cadre({ haut: 0, scene: 232 }); await s.propre({ cible: false }); await s.zoom(1.8);   // une scène moins haute : la réplique, longue, tient au-dessus de ce que les applications recouvrent
    await s.noir(0, 0.2);
    await s.dire('idris', "Tu sais ce qu'est la");
    await s.zoom(2.3, 7.6);
    await s.tourner(28 * T);
    /* 3 — le seuil : le carton du jeu, « en songe » */
    s.marque('seuil'); await s.noir(1, 0);
    await seuil(s);
    await s.noir(0, 0.15);
    await s.tourner(8 * T);
    /* 4 — le labyrinthe : la règle, telle que le jeu la donne ; le râwî prend le chemin de l'issue */
    await s.noir(1, 0); await entrer(s);
    await poser(s, null, { noir_honte: AU_LOIN[2], avidite: AU_LOIN[1], orgueil: AU_LOIN[3] });
    const regle = await s.ev(() => window.ISNAD.rodeurs.texte('regle')); s.journal.push(regle);
    await s.propre({ cible: false, carte: true }); await s.zoom(1);
    s.marque('labyrinthe'); await s.noir(0, 0.2);
    await s.legende(regle, { marge: 16, taille: 19, duree: 24 * T - 0.2, dans: 0.1 });
    await s.ev(() => { const W = window.ISNAD.world, q = W.spotPx('issue'); W.goTo(q[0], q[1], { quiet: true }); });
    await s.zoom(1.5, 3);
    await s.tourner(15 * T);
    await tient(s, 'la marche');
    /*     ce qui rôde : un mal du cœur vient sur lui, il le frappe (au ralenti) — sonné, cela le laisse passer */
    s.marque('rode');
    await poser(s, COULOIR_DU_HAUT.rawi, { orgueil: COULOIR_DU_HAUT.pres, noir_honte: AU_LOIN[0], avidite: AU_LOIN[1] });
    await s.zoom(1.9); await s.avancer(32);
    s.ralenti(0.5); await s.tourner(9 * T, frapper); s.ralenti(1);
    await tient(s, 'la frappe');
    /* 5 — l'issue : quelques pas, et le carton du jeu */
    s.marque('issue'); await s.noir(1, 0);
    const ou = await s.ev(() => { const I = window.ISNAD, W = I.world, P = W.player, q = W.spotPx('issue'); W.stop();
      for (const d of [88, 96, 80, 104, 72, 62]) for (const k of [4, 3, 5, 2, 6, 1, 7, 0]) { const a = k * Math.PI / 4, x = q[0] + Math.cos(a) * d, y = q[1] + Math.sin(a) * d; if (W.solidAt(x, y) || W.solidAt(x, y - 6)) continue;
        P.x = x; P.y = y; P.dir = Math.abs(q[0] - x) > Math.abs(q[1] - y) ? (q[0] < x ? 1 : 2) : (q[1] < y ? 3 : 0); W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([P.x, P.y, P.dir]); W.updateCam(true); W.goTo(q[0], q[1], { quiet: true }); return [Math.round(x), Math.round(y), d]; }
      return null; });
    s.dit('à quelques pas de l’issue : ' + JSON.stringify(ou));
    await s.propre({ cible: true }); await s.zoom(1.5); await s.noir(0, 0.2);
    await s.tourner(15 * T);
    await s.carton(12 * T);
  }
};
