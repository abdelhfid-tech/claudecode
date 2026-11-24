/* Les shorts de saga (12 à 16) : un film par saga, bâtis tous les cinq de la même façon, avec ce que le jeu dit lui-même.
   Refaits le 24 novembre dans l'ambiance de D219 (le passage d'un plan à l'autre est une lueur du montage, s.passage /
   s.arrivee : rien du jeu n'est changé), et chacun sous un angle à lui (le décideur, 24 novembre : « Pourquoi autant
   d'images de asabiya ? Diversifie les angles de présentation du jeu ! ») :
     1. l'accroche — on tombe au milieu d'un passage, dans le lieu de la saga, le groupe déjà en marche ; le nom du Compagnon,
        sa Lumière et ses années, lus dans les données du jeu, entiers dès l'image 1 (s.ouverture) ;
     2. la phrase de la saga, celle de l'écran de la Chaîne, pendant que le groupe marche ;
     3. une parole, avec sa source : le carton du jeu ;
     4. un moment de la saga, le sien : une marche, une rencontre, la route du monde — sa légende est l'objectif tel que le
        jeu l'écrit (aucune phrase nouvelle) ; plus de combat d'idole ici (les combats ont leurs shorts : 3, 6, 8, 9) ;
     5. le carton final.
   Le grand tambour marque chaque passage. Rien n'est retapé : un scénario ne donne que des clés et des fragments
   (v2/tools/shorts.js retrouve le reste dans le jeu). Ce qui reste un choix — quelle parole, quel moment — est une
   proposition, à valider par le décideur ; et la parole citée reste à relire par un spécialiste, comme tout le contenu du
   jeu. Le son : percussions seules, comme les autres. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const PASSE = 0.45;                                                  // un passage d'un plan à l'autre, en secondes
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);  // un motif, tenu pendant n pas (un pas : un quart de temps)
const LE = { 'Véracité': 'la', 'Justice': 'la', 'Courage': 'le', 'Miséricorde': 'la', 'Savoir': 'le' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// o : { recit, titre, graine, lieu: [chapitre, point de passage, route — les points du lieu où marcher, l'un après l'autre],
//       phrase: durée en T (16 par défaut), parole: [fragment, durée en T],
//       moment: { ci, cp: point de passage, obj: l'objectif dont le texte sert de légende, et l'un de : vers: un lieu où marcher,
//                 pnj: celui à qui parler (la réplique est celle du jeu), monde: le bord par où sortir sur la route du monde ;
//                 zoom (1,5 par défaut), scene: true (le récit joue la scène de l'objectif atteint) } }
module.exports = function saga(o) {
  const phrase = o.phrase || 16, parole = o.parole[1];
  return {
    titre: o.titre, bpm: 100, graine: o.graine,
    rythme: [
      { a: 'b.T.T...b...T.T.' },                                                               // 1 · l'accroche, dans le passage déjà ouvert
      { a: 'b' + pas('.....t.D...t...D', 2 * phrase - 1), b: pas('....r.......r...', 2 * phrase) },   // 2 · le groupe en route
      { a: 'b' + pas('.......t.......D', 2 * parole - 1) },                                    // 3 · la parole
      { a: 'b' + pas('.T...T.D.T.t.T.D', 35), b: pas('r...r...r.r.r...', 36) },                // 4 · le moment de la saga
      { a: 'b.......D...............', b: 'r.......................' }                          // 5 · le carton final
    ],
    async film(s) {
      const [ci, cp, route] = o.lieu;
      const jusquauPassage = async (sec, z, fn) => { await s.tourner(sec - PASSE, fn); await s.passage(PASSE, z); };
      // le temps de la prise, l'objectif « aller à tel endroit » ne se déclenche pas au passage : on ne filme qu'une marche
      const sansGoto = () => s.ev(() => { const W = window.ISNAD.world; if (!W._curDuJeu) { W._curDuJeu = W.cur; W.cur = function () { const c = W._curDuJeu.apply(this, arguments); return c && c.goto ? Object.assign({}, c, { goto: null }) : c; }; } });
      const marcher = k => s.ev(([rt, k]) => { const W = window.ISNAD.world; if (W.dest || k >= rt.length) return k; W.goTo(rt[k][0], rt[k][1], { quiet: true }); return k + 1; }, [route, k]);

      /* 1 — l'accroche : au milieu d'un passage, dans le lieu de la saga ; le groupe est déjà en marche */
      await s.chapitre(o.recit, ci, cp); await s.cadre('carre'); await s.propre({ cible: false }); await sansGoto();
      const r = await s.recit(o.recit);
      let etape = await marcher(0); await s.avancer(200);
      const h = await s.ouverture(esc(r.nom), { z: 1.8, sec: 1.1, duree: 8 * T - PASSE + 0.05, legende: { y: 246, taille: 33 } });   // sous le Compagnon, qui reste visible
      await s.legende((LE[r.lumiere] || 'la') + ' ' + esc(r.lumiere) + ' · ' + esc(r.annees.split(' · ').pop()), { y: Math.round(h.bottom) + 12, style: 'titre', taille: 19, duree: 8 * T - PASSE - 0.1, dans: 0.15, fi: 0.2 });
      await s.tourner(8 * T);   // (le même lieu : pas de passage entre l'accroche et la phrase)

      /* 2 — la phrase de la saga ; le groupe marche, d'un point du lieu au suivant */
      s.marque('phrase');
      await s.legende(esc(r.phrase), { duree: phrase * T - PASSE - 0.1, dans: 0.25 });
      await s.zoom(1.5, 1.2);
      await jusquauPassage(phrase * T, 2.6, async (t, i) => { if (i % 4 === 0) etape = await marcher(etape); });
      await s.ev(() => window.ISNAD.world.stop());

      /* 3 — une parole, avec sa source : le carton est celui du jeu */
      s.marque('parole');
      await s.dire(o.recit, o.parole[0]); await s.avancer(64);
      // typographie seulement : une espace insécable devant « : ; ? ! » et dans les guillemets, pour qu'aucun de ces signes
      // n'ouvre une ligne du carton (le jeu pose là une espace ordinaire — à reporter dans le jeu ; pas un mot n'est changé)
      await s.ev(() => { const c = document.querySelector('#card'); if (!c || c.hidden) return; const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) n.nodeValue = n.nodeValue.replace(/ ([:;?!»])/g, ' $1').replace(/« /g, '« '); });
      await s.arrivee(0, 0.4);
      await jusquauPassage(parole * T, 0);

      /* 4 — un moment de la saga, le sien ; sa légende est l'objectif, tel que le jeu l'écrit */
      s.marque('moment');
      const M = o.moment;
      if (M.monde) {   // la route du monde : sorti par la porte, le groupe marche sur la piste (aucune rencontre le temps de la prise)
        await s.chapitre(o.recit, M.ci, M.cp); await s.cadre('carre'); await s.propre({ cible: false });
        await s.ev(b => { window.__film.route(b); }, M.monde);
        await s.jusqua(() => window.__film.routeFaite && window.ISNAD.monde.surRoute(), null, 8000);
        await s.avancer(300); await s.finir();
        if (!await s.ev(() => window.__film.surLaPiste(16))) s.dit('! aucune piste devant le groupe');
        await s.avancer(250);
      } else {
        await s.chapitre(o.recit, M.ci, M.cp); await s.cadre('carre'); await s.propre({ cible: false });
        await sansGoto();   // l'arrivée ne déclenche rien d'elle-même : la scène (M.scene) se joue au moment choisi, plus bas
        if (M.vers) await s.ev(l => { const W = window.ISNAD.world, p = W.resolve(l, W.map.id, W.player); if (p && !isNaN(p[0])) W.goTo(p[0], p[1], { quiet: true }); }, M.vers);
      }
      const z = M.zoom || 1.5; await s.zoom(z); await s.arrivee(z, 0.5);
      const but = await s.ev(([r, ci, k]) => ((window.ISNAD.sagas[r].chapters[ci].objectives || [])[k] || {}).text || '', [o.recit, M.ci, M.obj]);
      if (!but) s.dit('! objectif sans texte : ' + M.ci + '/' + M.obj);
      // sur l'image quand une réplique s'écrit dessous, dans la boîte de dialogue du jeu ; sinon, sous l'image
      await s.legende(esc(but), Object.assign({ style: 'titre', taille: 19, duree: 18 * T - 0.3, dans: 0.3 }, M.pnj || M.scene ? { zone: 'sur' } : {}));
      if (M.pnj) { await s.tourner(2 * T); await s.toucherPnj(M.pnj); await s.tourner(16 * T); }
      // la scène que le récit joue quand l'objectif est atteint (ses répliques, sa narration), comme le jeu la joue
      else if (M.scene) { await s.tourner(3 * T); await s.ev(() => { const W = window.ISNAD.world; W.stop(); W.complete(); }); await s.tourner(15 * T); }
      else await s.tourner(18 * T);
      await s.carton(12 * T);
    }
  };
};
