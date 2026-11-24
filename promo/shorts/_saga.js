/* Les shorts de saga (12 à 16) : un film par saga, bâtis tous les cinq de la même façon, avec ce que le jeu dit lui-même.
   Refaits le 24 novembre dans l'ambiance de D219 (le groupe en route, le combat au tour par tour, un souffle qui monte ; le
   passage d'un plan à l'autre est une lueur du montage, s.passage / s.arrivee : rien du jeu n'est changé) :
     1. l'accroche — on tombe au milieu d'un passage, dans le lieu de la saga, le groupe déjà en marche ; le nom du Compagnon,
        sa Lumière et ses années, lus dans les données du jeu, entiers dès l'image 1 (s.ouverture) ;
     2. la phrase de la saga, celle de l'écran de la Chaîne — le groupe en route : sorti par la porte de sa ville, il marche
        sur la piste de la carte du monde (2.29), sans rencontre le temps de la prise ;
     3. une parole, avec sa source : le carton du jeu ;
     4. l'idole de la saga, combattue au tour par tour comme dans le jeu, l'arène en grand : la frise des tours, et les commandes juste dessous
        (les rangées du groupe et la parole de l'idole restent hors champ, D172), joué commande par commande (s.tourParTour) :
        on voit le menu, le choix, le coup — son nom et la phrase qui l'annonce sont ceux du jeu ;
     5. le carton final.
   Le grand tambour marque chaque passage. Rien n'est retapé : un scénario ne donne que des clés et des fragments
   (v2/tools/shorts.js retrouve le reste dans le jeu). Ce qui reste un choix — quelle parole, quelle idole — est une
   proposition, à valider par le décideur ; et la parole citée reste à relire par un spécialiste, comme tout le contenu du
   jeu. Le son : percussions seules, comme les autres. */
const T = 0.3;                                                       // un demi-temps à 100 à la noire : neuf images
const PASSE = 0.45;                                                  // un passage d'un plan à l'autre, en secondes
const pas = (m, n) => m.repeat(Math.ceil(n / m.length)).slice(0, n);  // un motif, tenu pendant n pas (un pas : un quart de temps)
const LE = { 'Véracité': 'la', 'Justice': 'la', 'Courage': 'le', 'Miséricorde': 'la', 'Savoir': 'le' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// o : { recit, titre, graine, lieu: [chapitre, point de passage, route — les points du lieu où marcher, l'un après l'autre],
//       monde: [chapitre, point de passage devant la porte, bord : 'nord' | 'sud' | 'ouest'], phrase: durée en T (16 par défaut),
//       parole: [fragment, durée en T], idole: clé, combat: { groupe, niv } — le groupe aligné contre l'idole et son niveau }
module.exports = function saga(o) {
  const phrase = o.phrase || 16, parole = o.parole[1];
  return {
    titre: o.titre, bpm: 100, graine: o.graine,
    rythme: [
      { a: 'b.T.T...b...T.T.' },                                                               // 1 · l'accroche, dans le passage déjà ouvert
      { a: 'b' + pas('.....t.D...t...D', 2 * phrase - 1), b: pas('....r.......r...', 2 * phrase) },   // 2 · le groupe en route
      { a: 'b' + pas('.......t.......D', 2 * parole - 1) },                                    // 3 · la parole
      { a: 'b' + pas('.TtD.T.D.TtT.T.D', 35), b: pas('r.r.r.r.r.r.r.r.', 36) },                // 4 · l'idole
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
      await jusquauPassage(8 * T, 2.6);

      /* 2 — la phrase de la saga ; le groupe en route, sur la piste de la carte du monde (ou, sans porte, dans son lieu) */
      s.marque('route');
      if (o.monde) {
        const [mci, mcp, bord] = o.monde;
        await s.chapitre(o.recit, mci, mcp); await s.cadre('carre'); await s.propre({ cible: false });
        await s.ev(b => { window.__film.route(b); }, bord);
        await s.jusqua(() => window.__film.routeFaite && window.ISNAD.monde.surRoute(), null, 8000);
        await s.avancer(300); await s.finir();
        const vers = await s.ev(() => window.__film.surLaPiste(16)); if (!vers) s.dit('! aucune piste devant le groupe');
        await s.avancer(250);
      } else await s.ev(() => window.ISNAD.world.stop());
      await s.arrivee(1.5, 0.5);
      await s.legende(esc(r.phrase), { duree: phrase * T - PASSE - 0.1, dans: 0.25 });
      await jusquauPassage(phrase * T, 2.6, o.monde ? null : async (t, i) => { if (i % 4 === 0) etape = await marcher(etape); });
      await s.ev(() => window.ISNAD.world.stop());

      /* 3 — une parole, avec sa source : le carton est celui du jeu */
      s.marque('parole');
      await s.dire(o.recit, o.parole[0]); await s.avancer(64);
      // typographie seulement : une espace insécable devant « : ; ? ! » et dans les guillemets, pour qu'aucun de ces signes
      // n'ouvre une ligne du carton (le jeu pose là une espace ordinaire — à reporter dans le jeu ; pas un mot n'est changé)
      await s.ev(() => { const c = document.querySelector('#card'); if (!c || c.hidden) return; const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) n.nodeValue = n.nodeValue.replace(/ ([:;?!»])/g, ' $1').replace(/« /g, '« '); });
      await s.arrivee(0, 0.4);
      await jusquauPassage(parole * T, 0);

      /* 4 — l'idole de la saga, au tour par tour : la frise des tours et les commandes ; le combat se joue tout seul */
      s.marque('idole');
      const d = await s.idoleDe(o.recit, o.idole);
      // le groupe que le récit aligne contre elle, au niveau qu'un joueur y atteint (celui du parcours automatique, smoke.js auto)
      await s.chapitre(o.recit, d.ci, { obj: 0, groupe: o.combat && o.combat.groupe }); await s.cadre('carre'); await s.propre({ cible: false, bandeau: false });   // l'arène en grand ; le panneau des commandes juste dessous
      if (o.combat && o.combat.niv) await s.ev(n => { const I = window.ISNAD, W = I.world; W.party.forEach(id => { const h = W.hero(id); h.lvl = n; h.xp = 0; const st = I.calc.of(h); h.hp = st.hp; h.sp = st.sp; }); W.refreshSheets && W.refreshSheets(); }, o.combat.niv);
      await s.combat(d.groupe, { idole: true, fond: d.fond, attente: 1200 });
      await s.arrivee(0, 0.5);
      // sur le sol de l'arène, sous les figures : ni sur les noms des chimères, ni sur la frise des tours
      const n = await s.legende(esc(d.nom), { y: 286, style: 'titre', taille: 21, duree: 18 * T - 0.15, dans: 0.25 });
      await s.legende(esc(d.mot.replace(/^[^«:]{2,30} : (?=«)/, '')), { y: Math.round(n.bottom) + 6, taille: 17, duree: 18 * T - 0.5, dans: 0.55 });
      await s.tourParTour(18 * T);   // le menu du héros, « Frapper », la cible, le coup ; puis le tour des chimères
      await s.carton(12 * T);
    }
  };
};
