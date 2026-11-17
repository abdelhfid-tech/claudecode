/* Les shorts de saga (12 à 16) : un film par saga, bâtis tous les cinq de la même façon, avec ce que le jeu dit lui-même.
     1. l'accroche — le lieu de la saga ; le nom du Compagnon, sa Lumière et ses années, lus dans les données du jeu ;
     2. la phrase de la saga, celle de l'écran de la Chaîne ;
     3. une parole, avec sa source : le carton du jeu ;
     4. l'idole de la saga, combattue comme dans le jeu — son nom et la phrase qui l'annonce sont ceux du jeu ;
     5. le carton final.
   Rien n'est retapé : un scénario ne donne que des clés et des fragments (v2/tools/shorts.js retrouve le reste dans le jeu).
   Ce qui reste un choix — quelle parole, quelle idole — est une proposition, à valider par le décideur ; et la parole
   citée reste à relire par un spécialiste, comme tout le contenu du jeu. Le son : percussions seules, comme les autres. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);  // un motif, tenu pendant n pas (un pas : un quart de temps)
const LE = { 'Véracité': 'la', 'Justice': 'la', 'Courage': 'le', 'Miséricorde': 'la', 'Savoir': 'le' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// o : { recit, titre, graine, lieu: [chapitre, point de passage, route — les points du lieu où marcher, l'un après l'autre], phrase: durée en T (16 par défaut),
//       parole: [fragment, durée en T], idole: clé }
module.exports = function saga(o) {
  const phrase = o.phrase || 16, parole = o.parole[1];
  return {
    titre: o.titre, bpm: 100, graine: o.graine,
    rythme: [
      { a: 'b...............' },                                                               // 1 · l'accroche
      { a: pas('D.....t.D...t...', 2 * phrase), b: pas('....r.......r...', 2 * phrase) },      // 2 · la phrase de la saga
      { a: pas('D.......t.......', 2 * parole) },                                              // 3 · la parole
      { a: pas('D.TtD.T.D.TtT.T.', 36), b: pas('r.r.r.r.r.r.r.r.', 36) },                      // 4 · l'idole
      { a: 'b.......D...............', b: 'r.......................' }                          // 5 · le carton final
    ],
    async film(s) {
      const [ci, cp, route] = o.lieu;
      /* 1 — l'accroche : le lieu, le Compagnon ; l'image se rapproche */
      await s.chapitre(o.recit, ci, cp); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
      // le temps de la prise, l'objectif « aller à tel endroit » ne se déclenche pas au passage : on ne filme qu'une marche
      await s.ev(() => { const W = window.ISNAD.world; if (!W._curDuJeu) { W._curDuJeu = W.cur; W.cur = function () { const c = W._curDuJeu.apply(this, arguments); return c && c.goto ? Object.assign({}, c, { goto: null }) : c; }; } });
      const r = await s.recit(o.recit);
      await s.ombre(0.5, 0);
      const h = await s.legende(esc(r.nom), { y: 246, style: 'accroche', taille: 33, duree: 8 * T - 0.1, dans: 0.12 });   // sous le Compagnon, qui reste visible
      await s.legende((LE[r.lumiere] || 'la') + ' ' + esc(r.lumiere) + ' · ' + esc(r.annees.split(' · ').pop()), { y: Math.round(h.bottom) + 12, style: 'titre', taille: 19, duree: 8 * T - 0.3, dans: 0.3 });
      await s.zoom(1.8, 2.4);
      await s.tourner(8 * T); await s.ombre(0, 0.3);
      /* 2 — la phrase de la saga ; il se met en marche (le jeu trouve le chemin, d'un point au suivant) */
      s.marque('phrase');
      await s.legende(esc(r.phrase), { duree: phrase * T - 0.15, dans: 0.1 });
      await s.zoom(1.5, 1.2);
      let etape = 0;
      await s.tourner(phrase * T, async (t, i) => { if (i % 4 === 0) etape = await s.ev(([rt, k]) => { const W = window.ISNAD.world; if (W.dest || k >= rt.length) return k; W.goTo(rt[k][0], rt[k][1], { quiet: true }); return k + 1; }, [route, etape]); });
      await s.ev(() => window.ISNAD.world.stop());
      /* 3 — une parole, avec sa source : le carton est celui du jeu */
      s.marque('parole');
      await s.dire(o.recit, o.parole[0]); await s.avancer(64);
      // typographie seulement : une espace insécable devant « : ; ? ! » et dans les guillemets, pour qu'aucun de ces signes
      // n'ouvre une ligne du carton (le jeu pose là une espace ordinaire — à reporter dans le jeu ; pas un mot n'est changé)
      await s.ev(() => { const c = document.querySelector('#card'); if (!c || c.hidden) return; const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) n.nodeValue = n.nodeValue.replace(/ ([:;?!»])/g, '\u00a0$1').replace(/« /g, '«\u00a0'); });
      await s.tourner(parole * T);
      /* 4 — l'idole de la saga : le combat se joue tout seul, à l'allure du jeu */
      s.marque('idole'); await s.noir(1, 0);
      const d = await s.idoleDe(o.recit, o.idole);
      await s.chapitre(o.recit, d.ci, { obj: 0 }); await s.cadre('carre'); await s.propre({ panneau: false, bandeau: false });
      await s.combat(d.groupe, { idole: true, fond: d.fond, attente: 2200 });
      await s.noir(0, 0.2);
      const n = await s.legende(esc(d.nom), { style: 'titre', duree: 18 * T - 0.15, dans: 0.1 });
      await s.legende(esc(d.mot.replace(/^[^«:]{2,30} : (?=«)/, '')), { y: Math.round(n.bottom) + 10, duree: 18 * T - 0.5, dans: 0.45 });
      await s.auto(true); await s.touche('Enter'); await s.tourner(2 * T); await s.touche('Enter');   // « Frapper », puis la cible : ensuite le groupe joue seul
      await s.tourner(16 * T);
      await s.carton(12 * T);
    }
  };
};
