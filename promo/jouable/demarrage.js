/* ISNAD 2.x — la démo jouable : une quarantaine de secondes du vrai jeu, au doigt.
   Ce fichier est ajouté au jeu assemblé par v2/tools/jouable.js (promo/jouable/jouable.html). Il ne change rien au jeu :
   il choisit par où l'on entre, dit quoi faire en une phrase, et montre le carton final.
     1. un mot d'accueil, sur l'écran-titre du jeu ;
     2. la noosphère de 2084 : un labyrinthe, et ce qui rôde sur ses ponts — on le touche pour le frapper ;
     3. un combat : « Frapper », puis l'égrégore ;
     4. le carton final, avec le bouton « Jouer ».
   Celui qui joue est Idris, le râwî de 2084 : un personnage de fiction. Aucune partie enregistrée n'est lue ni écrite
   (le jeu assemblé pour la démo garde tout en mémoire). On ne sort de la démo que par D.allerJouer : pour une régie
   publicitaire, c'est le seul endroit à brancher. */
(function () {
  'use strict';
  const I = window.ISNAD, W = I.world, U = I.ui, S = I.script, R = I.rodeurs, $ = q => document.querySelector(q);
  const ADRESSE = '__ADRESSE__', DEVISE = '__DEVISE__', ETAT = '__ETAT__';
  const D = window.ISNAD_DEMO = { etape: 'attente', sorties: 0, journal: [] };
  const DUREE = { labyrinthe: 17000, combat: 17000 };   // au-delà, la démo avance toute seule : personne ne reste bloqué
  const voile = document.createElement('div'); voile.id = 'demo'; document.body.appendChild(voile); document.body.classList.add('demo');
  const note = m => { D.journal.push(m); };
  const poser = html => { voile.innerHTML = html; };
  const consigne = html => poser('<div class="demo-consigne">' + html + '</div>');
  // un carton (l'accueil, la fin) : il se range sous le titre du jeu, dans son écran
  const carton = html => { const vieux = $('#title .demo-carte'); if (vieux) vieux.remove(); document.body.classList.toggle('demo-carton', !!html); if (!html) return null; const c = document.createElement('div'); c.className = 'demo-carte'; c.innerHTML = html; $('#title').appendChild(c); return c; };
  const attendre = (cond, ms) => new Promise(res => { const t0 = performance.now(); (function voir() { let k = false; try { k = !!cond(); } catch (e) { k = false; } if (k || performance.now() - t0 > ms) return res(k); setTimeout(voir, 120); })(); });
  const pause = ms => new Promise(r => setTimeout(r, ms));

  /* la seule sortie : vers le jeu entier */
  D.allerJouer = function (ev) {
    const url = 'https://' + ADRESSE; D.sorties++;
    try { if (window.mraid && typeof window.mraid.open === 'function') { if (ev) ev.preventDefault(); window.mraid.open(url); return; } } catch (e) { /* pas de régie : le lien suffit */ }
    try { if (window.FbPlayableAd && typeof window.FbPlayableAd.onCTAClick === 'function') { if (ev) ev.preventDefault(); window.FbPlayableAd.onCTAClick(); return; } } catch (e) { /* idem */ }
    if (!ev) window.open(url, '_blank', 'noopener');   // appelée sans clic : on ouvre ; sinon le lien fait son travail
  };

  /* 1 — l'accueil : l'écran-titre du jeu, sans son menu */
  const titreDuJeu = U.showTitle;
  D.accueil = function () {
    D.etape = 'accueil'; titreDuJeu.call(U); poser('');
    carton('<p class="demo-mot">Une minute pour essayer.</p><button type="button" class="demo-bouton" id="demo-go">Commencer</button><p class="demo-petit">' + ETAT + '</p>');
    $('#demo-go').addEventListener('click', () => { I.audio.unlock(); D.labyrinthe().catch(e => { note('incident : ' + e.message); D.fin(); }); });
  };
  U.showTitle = function () { D.accueil(); };

  /* 2 — le labyrinthe de la noosphère, en 2084 */
  D.labyrinthe = async function () {
    D.etape = 'labyrinthe'; poser(''); carton('');
    $('#title').hidden = true; document.body.classList.remove('in-screen'); try { I.audio.stopBeat(); } catch (e) { /* le son ne compte pas ici */ }
    I.save.reset(); I.save.data.started = true; W.roster = {}; W.saga = null; I.input.reset();
    I.debug.graine = 2084; I.debug.profondeur = 1; I.debug.sansMeutes = false;
    await W.startChapter('idris', 1, { party: ['idris'], obj: 2, flags: {}, map: 'cite', opts: {}, pos: 'parvis', foes: [], chests: [], npcs: {} });
    await S.run([['map', 'noos', 'seuil', { hue: 285 }]]);
    // on entre près de ce qui rôde : la démo n'a pas le temps d'un détour
    const P = W.player, l = R.rodent().map(f => [f, Math.hypot(f.x - P.x, f.y - P.y)]).sort((a, b) => a[1] - b[1]);
    if (l.length) { const f = l[0][0]; let mis = false;
      for (const d of [44, 52, 36, 60]) { for (let k = 0; k < 8 && !mis; k++) { const a = k * Math.PI / 4, x = f.x + Math.cos(a) * d, y = f.y + Math.sin(a) * d; if (W.solidAt(x, y) || W.solidAt(x, y - 6)) continue;
          P.x = x; P.y = y; const dx = f.x - x, dy = f.y - y; P.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); W.trail = []; for (let i = 0; i < 64; i++) W.trail.push([P.x, P.y, P.dir]); W.updateCam(true); mis = true; } if (mis) break; } }
    const n0 = R.rodent().length; D.rodent = n0; note('labyrinthe : ' + n0 + ' qui rôdent');
    consigne('Quelque chose rôde sur les ponts.<br><b>Touche-le pour le frapper.</b>');
    await attendre(() => R.rodent().length < n0 || I.battle.active || D.etape !== 'labyrinthe', DUREE.labyrinthe);
    if (D.etape !== 'labyrinthe') return;
    D.dissipe = R.rodent().length < n0; note(D.dissipe ? 'un égrégore dissipé' : (I.battle.active ? 'rejoint : le combat s’ouvre' : 'temps écoulé'));
    if (D.dissipe) { consigne('<b>Dissipé.</b> Il n’y avait rien derrière.'); await pause(1300); }
    return D.combat();
  };

  /* 3 — un combat : une petite notification, comme au début du jeu */
  D.combat = async function () {
    D.etape = 'combat'; poser('');   // la consigne est dite par le jeu lui-même : c'est le bandeau d'ouverture du combat
    let fini = false; const t0 = performance.now();
    const p = I.battle.active ? attendre(() => !I.battle.active, DUREE.combat + 4000) : I.battle.start({ group: ['notif'], bg: 'cite', sansReprise: true, intro: 'Touche « Frapper », puis l’égrégore.' });
    Promise.resolve(p).then(() => { fini = true; }, () => { fini = true; });
    await attendre(() => fini || performance.now() - t0 > DUREE.combat, DUREE.combat + 500);
    note(fini ? 'combat achevé' : 'temps écoulé pendant le combat');
    if (!fini) { try { I.battle.abort(W); } catch (e) { /* il se refermait déjà */ } }
    return D.fin();
  };

  /* 4 — le carton final */
  D.fin = function () {
    D.etape = 'fin';
    try { if (I.battle.active) I.battle.abort(W); } catch (e) { /* rien à refermer */ }
    I.debug.auto = false; I.speed = 1; S.depth = 0; W.lock = false; S.hideDialog(); $('#choice').hidden = true; const c = $('#card'); c.classList.remove('on'); c.hidden = true; I.input.reset();
    $('#toasts').innerHTML = ''; titreDuJeu.call(U); poser('');
    carton('<p class="demo-devise">« ' + DEVISE + ' »</p><a class="demo-bouton" id="demo-jouer" href="https://' + ADRESSE + '" target="_blank" rel="noopener">Jouer</a><p class="demo-adresse">' + ADRESSE + '</p><button type="button" class="demo-lien" id="demo-encore">Rejouer la démo</button><p class="demo-petit">' + ETAT + '</p>');
    $('#demo-jouer').addEventListener('click', ev => D.allerJouer(ev));
    $('#demo-encore').addEventListener('click', () => { D.labyrinthe().catch(() => D.fin()); });
  };
})();
