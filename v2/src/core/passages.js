/* ISNAD 2.28 (D218) — les passages à pied de 2084 : la rue (la Cité-Miroir ↔ les quartiers) ; depuis la 2.47 (D238), la ruelle
   abandonnée (les quartiers ↔ la vieille mosquée), qui remplace l'ascenseur des Archives basses. Demandes du décideur, 22 novembre : « Dans la 2.28 je veux pouvoir accéder à la "cité vivante" sans devoir
   rencontrer maître Yunus directement dans la suite du premier monde en franchissant la rue par exemple » (dès le prologue :
   « Pendant le prologue ») ; « Meme dans le sous-sol on doit pouvoir être libre de remonter ». La « cité vivante », ce sont
   les quartiers de la Cité-Miroir ; le « sous-sol », les Archives basses.
   - La rue : sur la carte `cite`, au bout de la rue, à l'est (le lieu « traverse »), Idris passe à pied dans les quartiers — en
     marchant vers le bord, ou par A, tourné vers lui. Le chapitre qu'il quitte (le prologue, une rencontre, un retour) est
     rangé parmi les récits quittés (world.js, W.ranger : le refuge des quartiers le fait à son ouverture), exactement où il
     est ; Idris entre dans les quartiers par l'entrée de la rue, au nord-ouest (le lieu « traverse » des quartiers) — loin du
     parvis : Maître Yûnus n'y est pas, il est resté en bas (cite.js, C.depart). Retraverser (le même bord, vers l'ouest) le
     ramène sur la carte `cite`, du même côté de la rue, et le chapitre quitté reprend là où il l'a laissé (cite.js,
     C.quitter ; ui.js, U.reprendre). « Revenir en 2084 » et « La Cité-Miroir » de la Chaîne ne changent pas : le parvis, à
     côté de Maître Yûnus (D212).
   - 2.47 (D238 ; le décideur, 26 novembre : « ruelle | quartiers du centre ville sans mosquée | autre ruelle sombre abandonnée
     qui mène à une mosquée finalement où se trouve le maître et les sagas » ; « Plus d'ascenseur ») : il n'y a plus
     d'ascenseur. Le chemin de 2084 se marche : la rue de la Cité-Miroir, les quartiers, la ruelle abandonnée (`impasse`, par le
     bord est des quartiers, le lieu « ruelle »), la vieille mosquée (`archives`, par sa porte, au bout de la ruelle). Dans le
     refuge, qui commence dans la mosquée à côté de Maître Yûnus, Idris passe de l'un à l'autre dans les deux sens : c'est le
     même chapitre, une autre carte (rien n'est rangé). Dans un autre chapitre qui se joue dans la mosquée (un retour), sortir
     par la porte range ce chapitre parmi les récits quittés et ouvre le refuge dans la ruelle ; Maître Yûnus le reprend
     (« Reprendre le récit »). Le prologue, lui, mène Idris par ce chemin de ses propres objectifs (frame.js) : aucun passage
     ne s'y prend.
   - Où : l'histoire-cadre, quand Idris a la main (ni un récit qui se joue, ni un combat, ni un menu) ; jamais dans les sagas
     ni dans les veillées ; ni dans le dernier maillon (`fin`), qui se joue d'une traite. Le joueur de test du moteur ne passe
     jamais : il va à ses objectifs. Aucun outil de plus : c'est marcher. Rien n'est gardé dans la partie, sinon le point de
     reprise lui-même. */
(function () {
  'use strict';
  const I = window.ISNAD, W = I.world, S = I.script;
  const P = I.passages = { journal: [], occupe: false, arme: false };
  const T = 16;
  const cadre = () => !!(W.saga && W.saga.id === 'idris' && W.saga.frame && !W.saga.veillees && W.ch && !W.ch.fin);
  const main = () => I.scene === W && !!W.map && !S.busy && !W.lock && !(I.ui && I.ui.menuOpen) && !I.battle.active && !W.excursion && !I.debug.auto && !I.debug.walk && !P.occupe && !(I.activites && (I.activites.occupe || I.activites.assis));
  P.main = main;   // (2.30 : les rencontres de la route ont les mêmes gardes — monde.js)
  const refuge = () => !!(I.cite && I.cite.ici());
  const prologue = () => !!(W.ch && W.ch.id === 'p1');   // (2.47 : le prologue mène Idris par le chemin de 2084 de ses propres objectifs)
  // le récit quitté par la rue, qui attend sur la carte de la Cité-Miroir (le plus récent)
  P.recitRue = () => W.rangees().find(c => { const ch = c.saga === 'idris' && I.sagas.idris.chapters[c.ci]; return !!ch && c.map === 'cite' && !ch.fin && !(I.cite && I.cite.refuge(ch)); }) || null;
  /* Les passages : où se tenir (`dans`), vers où marcher ou se tourner (`dir` : 0 bas, 1 gauche, 2 droite, 3 haut), devant quoi
     A agit (`devant`), et ce qui se fait. */
  const PASSAGES = [
    { id: 'rue', ok: () => W.map.id === 'cite' && cadre() && !refuge() && !prologue(), dir: 2,
      dans: p => p.x >= W.map.w * T - 14 && p.y >= 9 * T && p.y <= 17 * T, devant: p => p.x >= W.map.w * T - 30 && p.y >= 9 * T && p.y <= 17 * T, fn: () => P.traverser() },
    { id: 'rue-retour', ok: () => W.map.id === 'quartiers' && refuge(), dir: 1,
      dans: p => p.x <= 14 && p.y >= 8 * T && p.y <= 11 * T, devant: p => p.x <= 32 && p.y >= 8 * T && p.y <= 11 * T, fn: () => P.revenir() },
    // 2.47 (D238) — les quartiers ⇄ la ruelle abandonnée ⇄ la vieille mosquée
    { id: 'ruelle', ok: () => W.map.id === 'quartiers' && refuge(), dir: 2,
      dans: p => p.x >= W.map.w * T - 14 && p.y >= 20 * T && p.y <= 23 * T, devant: p => p.x >= W.map.w * T - 30 && p.y >= 20 * T && p.y <= 23 * T, fn: () => P.vers('impasse', 'quartiers', 2) },
    { id: 'ruelle-retour', ok: () => W.map.id === 'impasse' && refuge(), dir: 1,
      dans: p => p.x <= 14, devant: p => p.x <= 32, fn: () => P.vers('quartiers', 'ruelle', 1) },
    { id: 'mosquee', ok: () => W.map.id === 'impasse' && refuge(), dir: 2,
      dans: p => p.x >= 39 * T + 2, devant: p => p.x >= 38 * T + 4, fn: () => P.vers('archives', 'entree', 3) },
    { id: 'sortir', ok: () => W.map.id === 'archives' && cadre() && !prologue(), dir: 0,
      dans: p => p.x >= 16 * T - 4 && p.x <= 18 * T + 4 && p.y >= 23 * T + 2, devant: p => p.x >= 16 * T - 6 && p.x <= 18 * T + 6 && p.y >= 22 * T + 4,
      fn: () => (refuge() ? P.vers('impasse', 'porte', 1) : P.sortir()) }
  ];
  P.PASSAGES = PASSAGES;
  // 2.29 (D220) : un autre module inscrit ses passages ici (monde.js : les portes des villes, la carte du monde) plutôt que de
  // refaire P.tic et P.agir. Une entrée sans `dir` (null) se prend dans tous les sens ; `cible(o)`, si elle est là, dit où la
  // flèche montre, l'objectif restant ailleurs (W.target).
  P.ajouter = function (x) { PASSAGES.push(x); return x; };
  const ouverts = () => (W.map && W.saga ? PASSAGES.filter(x => x.ok()) : []);
  // marcher vers le bord, dans la zone, après en être sorti une fois (on n'y repart pas en y arrivant) ; buter contre le bord
  // en poussant vers lui compte aussi (on n'y bouge plus)
  const POUSSE = ['down', 'left', 'right', 'up'];
  P.tic = function () {
    if (!W.map) return; if (P.carte !== W.map) { P.carte = W.map; P.arme = false; }
    const p = W.player, x = ouverts().find(z => z.dans(p)); if (!x) { P.arme = true; return; }
    // (2.47 : au doigt, le toucher qui vise le passage lui-même y fait entrer, quel que soit le sens du dernier pas — on arrive souvent en biais)
    const vise = !!(W.dest && x.dans({ x: W.dest.x, y: W.dest.y }));
    if (!P.arme || !main() || (x.dir != null && p.dir !== x.dir && !vise) || !(p.moving || (x.dir != null ? I.input.held[POUSSE[x.dir]] : POUSSE.some(k => I.input.held[k])))) return;
    P.arme = false; P.journal.push({ quoi: 'pas', id: x.id }); x.fn();
  };
  const devant = () => { if (!main()) return null; const p = W.player; return ouverts().find(z => (z.dir == null || p.dir === z.dir) && z.devant(p)) || null; };
  P.aPortee = () => !!devant();
  P.agir = function () { const x = devant(); if (!x) return false; P.journal.push({ quoi: 'a', id: x.id }); x.fn(); return true; };
  // 2.47 (D238) : dans le refuge, loin de Maître Yûnus, la flèche montre le chemin de la mosquée (world.js, W.target) — le bord
  // est des quartiers, puis la porte au bout de la ruelle
  P.cible = function (o) {
    for (const x of PASSAGES) if (x.cible) { const r = x.cible(o); if (r) return r; }   // (2.29 : la carte du monde, une ville visitée — monde.js)
    if (!o || !o.talk || !W.map || !refuge()) return null;
    const n = W.npcs.find(x => x.id === o.talk); if (!n || n.map === W.map.id) return null;
    const vers = ({ quartiers: 'ruelle', impasse: 'porte' })[W.map.id], s = vers && W.spotPx(vers);
    return s ? { x: s[0], y: s[1], gx: s[0], gy: s[1], kind: 'goto', passage: true } : null;
  };

  /* ----- la rue ----- */
  P.traverser = async function () {
    if (P.occupe) return; P.occupe = true;
    try {
      const p = W.player; W.stop(); I.input.clearHeld(); p.x = Math.min(p.x, W.map.w * T - 26); p.dir = 1; W.resetTrail();
      P.journal.push({ quoi: 'traverse', ch: W.ch.id, obj: W.objIndex });
      W.checkpoint();   // le chapitre est gardé là, un pas avant le bord : le refuge le range parmi les récits quittés en s'ouvrant
      I.cite.parRue = true; await I.cite.arriver();
    } finally { P.occupe = false; }
  };
  P.revenir = async function () {
    const c = P.recitRue();
    if (!c) { S.toast(I.t('Ce soir, aucun récit n’attend Idris dans la rue de la Cité-Miroir.'), 3200); P.journal.push({ quoi: 'aucun' }); return; }
    if (P.occupe) return; P.occupe = true;
    try {
      W.stop(); I.input.clearHeld(); P.journal.push({ quoi: 'revient', ch: (I.sagas.idris.chapters[c.ci] || {}).id });
      I.cite.quitter(); await I.ui.reprendre(c);
      if (W.map && W.map.id === 'cite') W.player.dir = 1;
    } finally { P.occupe = false; }
  };

  /* ----- 2.47 (D238) : marcher d'une carte de 2084 à l'autre, dans le même chapitre (le refuge) ----- */
  P.vers = async function (carte, lieu, dir) {
    if (P.occupe) return; P.occupe = true; S.depth++;
    try {
      W.stop(); I.input.clearHeld(); P.journal.push({ quoi: 'vers', carte, de: W.map.id, ch: W.ch.id });
      await S.fade('out', 260);
      W.loadMap(carte, {}, lieu); W.player.dir = dir; W.resetTrail(); W.updateCam(true);
      if (carte === 'quartiers' && I.circuit) I.circuit.ouvre();   // (Sâlim, s'il est déjà venu, et sa moto garée : circuit.js)
      W.hud(); W.checkpoint();
      await S.fade('in', 260);
    } finally { S.depth--; P.occupe = false; }
  };
  // sortir de la mosquée pendant un autre chapitre (un retour) : il est rangé là, un pas avant la porte ; le refuge s'ouvre dans
  // la ruelle, devant la porte (cite.js, C.parRuelle)
  P.sortir = async function () {
    if (P.occupe) return; P.occupe = true;
    try {
      const p = W.player; W.stop(); I.input.clearHeld(); p.y = Math.min(p.y, 22 * T + 2); p.dir = 3; W.resetTrail();
      P.journal.push({ quoi: 'sort', ch: W.ch.id, obj: W.objIndex });
      W.checkpoint(); I.cite.parRuelle = true; await I.cite.arriver();
    } finally { P.occupe = false; }
  };
})();
