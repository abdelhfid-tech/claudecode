/* ISNAD 2.x — Poki : le branchement du SDK, posé À CÔTÉ du jeu (le jeu n'est pas modifié).
   Ajouté par v2/tools/plateformes/poki.js, dans <head>, après la balise du SDK (balise-sdk.html : l'adresse que donne
   developers.poki.com/guide/sdk-html5). Le jeu est lu, jamais réécrit : on se raccroche à window.ISNAD et au DOM.
   Tout ce qui se règle est dans REGLAGES, en tête. Rien ici n'appelle le réseau : seul le SDK de Poki le fait.
     1. PokiSDK.init() d'abord ; SDK absent (bloqueur) ou init() refusé : le jeu se joue quand même, sans publicité, sans erreur.
     2. gameLoadingFinished() quand l'écran-titre est prêt.
     3. gameplayStart() / gameplayStop() d'après l'état du jeu, jamais deux fois de suite : le joueur a la main = le monde,
        un combat, une course ou une borne, sans halte, sans écran (titre, Chaîne, personnage, « Ta partie »), sans carton ;
        un dialogue ou une liste de choix en font partie (le joueur y agit). Onglet caché : arrêt.
     4. commercialBreak() aux seuls moments de REGLAGES.moments, toujours AVANT que le jeu ne reparte (jamais au milieu d'une
        scène, d'une réplique, d'un combat, d'un pourparler, d'une prière ou d'un carton) : le son est coupé, les entrées
        sont ignorées (un voile transparent + les écouteurs), aucun événement du SDK ne part pendant la publicité, puis tout
        revient. Jamais de rewardedBreak : rien dans le jeu ne s'achète ni ne se gagne ainsi.
     5. Ce que Poki exige : pas de lien sortant ni d'adresse du site dans le partage (« Partager ma progression » est
        retiré), la page ne défile pas sous les flèches et la barre d'espace, la langue suit celle de Poki tant que le
        joueur n'en a pas choisi une. */
(function () {
  'use strict';
  var REGLAGES = {
    /* les moments de publicité : vrai = on le signale à Poki (qui décide s'il montre une publicité : « not every call shows an ad »).
       chaine  : le joueur, sur la Chaîne, ouvre ou reprend un maillon — l'arrêt naturel entre deux récits ;
       reprise : le joueur, sur l'écran-titre, touche « Continuer » — sa partie reprend (Poki sert déjà sa publicité au chargement :
                 à garder si Poki le veut, à couper sinon) ;
       Pas d'autre : ni à la fermeture de la halte (on y revient au milieu d'un lieu, ce que rôde continue), ni en combat, ni en
       dialogue. Pour en changer : mettre true ou false ici, rien d'autre. */
    moments: { chaine: true, reprise: true },
    langues: ['fr', 'ar', 'en'],      // celles que le jeu offre
    langueParDefaut: 'en',            // quand Poki dit une autre langue (proposition à valider)
    suivreLaLangueDePoki: true,       // faux : l'anglais d'office, comme pour CrazyGames
    sondage: 150,                     // ms entre deux lectures de l'état du jeu ; un état doit tenir deux lectures
    gardePub: 90000                   // ms : une publicité qui ne rend jamais la main (SDK perdu en route) rend le jeu au bout de ce temps
  };

  var sdk = function () { try { return window.PokiSDK || null; } catch (e) { return null; } };
  var ok = false;                     // init() a réussi
  var pret = new Promise(function (res) {
    try { var s = sdk(); if (!s || !s.init) return res(false); s.init().then(function () { ok = true; res(true); }, function () { res(false); }); } catch (e) { res(false); }
  });
  var appeler = function (nom, a) { return pret.then(function (b) { if (!b) return; var s = sdk(); if (s && typeof s[nom] === 'function') return s[nom].apply(s, a || []); }).catch(function () { /* le SDK ne doit jamais arrêter le jeu */ }); };

  /* ---------- la langue : celle de Poki, tant que le joueur n'a rien choisi ---------- */
  try {
    var lire = Storage.prototype.getItem;
    Storage.prototype.getItem = function (cle) {
      var v = lire.apply(this, arguments);
      if (cle !== 'isnad2.opts') return v;
      try {
        var o = v ? JSON.parse(v) : {};
        /* la langue posée ici est notée à part (isnad2.poki.lang) : tant que celle que garde le jeu est encore celle-là, le
           joueur n'a rien choisi, et elle suit Poki à chaque ouverture ; s'il en choisit une autre, la sienne l'emporte */
        var posee = null; try { posee = lire.call(this, 'isnad2.poki.lang'); } catch (e) { posee = null; }
        if (o && typeof o === 'object' && !Array.isArray(o) && (!o.lang || (posee && o.lang === posee))) {
          var l = REGLAGES.langueParDefaut;
          if (REGLAGES.suivreLaLangueDePoki) { var d = ''; try { d = String(sdk() && sdk().getLanguage ? sdk().getLanguage() : (navigator.language || '')).toLowerCase().slice(0, 2); } catch (e) { d = ''; } if (REGLAGES.langues.indexOf(d) >= 0) l = d; }
          try { Storage.prototype.setItem.call(this, 'isnad2.poki.lang', l); } catch (e) { /* rien */ }
          o.lang = l; return JSON.stringify(o);
        }
      } catch (e) { /* illisible : le jeu fait comme avant */ }
      return v;
    };
  } catch (e) { /* pas de stockage : le jeu s'ouvre comme avant */ }

  /* ---------- la page ne défile pas (requirements-quality : « Prevent viewport scrolling from affecting the parent page ») ---------- */
  var champ = function (t) { return !!(t && t.closest && t.closest('input, textarea, select, [contenteditable]')); };
  window.addEventListener('keydown', function (e) { if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].indexOf(e.key) >= 0 && !champ(e.target)) { if (e.target && e.target.tagName === 'BUTTON' && e.key === ' ') return; e.preventDefault(); } }, { capture: true });
  window.addEventListener('wheel', function (e) { if (!(e.target && e.target.closest && e.target.closest('.screen, #choice, #card, #dialog, textarea'))) e.preventDefault(); }, { passive: false, capture: true });

  // une liste qui défile jusqu'au bout ne passe pas la main à la page de Poki (la molette ou le doigt en bout de course)
  try { var st = document.createElement('style'); st.id = 'poki-defilement'; st.textContent = 'html,body,.screen,#choice,#card,#dialog .text{overscroll-behavior:contain}'; (document.head || document.documentElement).appendChild(st); } catch (e) { /* rien */ }

  /* ---------- la publicité : son coupé, entrées ignorées ---------- */
  var pub = false, voile = null;
  var BLOQUES = ['keydown', 'keyup', 'keypress', 'pointerdown', 'pointerup', 'pointermove', 'mousedown', 'mouseup', 'click', 'dblclick', 'touchstart', 'touchend', 'touchmove', 'wheel', 'contextmenu'];
  var bloquer = function (e) { if (pub) { e.stopImmediatePropagation(); if (e.cancelable) e.preventDefault(); } };
  BLOQUES.forEach(function (n) { window.addEventListener(n, bloquer, { capture: true, passive: false }); });
  var gain = function (v) { var I = window.ISNAD, A = I && I.audio; try { if (A && A.master && A.ctx) { A.master.gain.cancelScheduledValues(A.ctx.currentTime); A.master.gain.setValueAtTime(v, A.ctx.currentTime); } } catch (e) { /* pas de son */ } };
  var couper = function () { pub = true; try { var I = window.ISNAD; if (I && I.input && I.input.clearHeld) I.input.clearHeld(); } catch (e) { /* rien */ }
    voile = document.createElement('div'); voile.id = 'poki-pub'; voile.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483647;background:transparent;touch-action:none'; (document.body || document.documentElement).appendChild(voile);
    gain(0); };
  var rendre = function () { var I = window.ISNAD, A = I && I.audio; gain(A && A.on === false ? 0 : 0.8); if (voile && voile.parentNode) voile.parentNode.removeChild(voile); voile = null; pub = false; };
  var touche = null;
  ['pointerdown', 'pointerup', 'keydown', 'click'].forEach(function (n) { window.addEventListener(n, function () { if (pub) return; var e = document.querySelector('.screen:not([hidden])'); touche = { ecran: e ? e.id : '', t: Date.now() }; }, true); });
  // une pause : rend une promesse qui se tient jusqu'à la fin de la publicité (ou tout de suite si aucune n'est possible)
  var pause = function (moment, ecran) {
    // le moment n'est valable que si le joueur vient de toucher quelque chose sur l'écran voulu (la Chaîne, l'écran-titre) :
    // ni un changement de langue en cours de jeu (ui.js : U.resume), ni un retour par la halte ne déclenchent de publicité
    if (!touche || touche.ecran !== ecran || Date.now() - touche.t > 1500) return Promise.resolve(false);
    if (!REGLAGES.moments[moment] || !ok || !sdk() || typeof sdk().commercialBreak !== 'function') return Promise.resolve(false);
    couper();
    return new Promise(function (fini) {
      var rendu = false, garde = null, fin = function () { if (rendu) return; rendu = true; if (garde) clearTimeout(garde); rendre(); fini(true); };
      garde = setTimeout(fin, REGLAGES.gardePub);   // jamais un jeu bloqué derrière une publicité qui ne finit pas
      try { var p = sdk().commercialBreak(function () { gain(0); }); if (p && p.then) p.then(fin, fin); else fin(); } catch (e) { fin(); }
    });
  };

  /* ---------- l'état du jeu : a-t-on la main ? ---------- */
  var enJeu = false, charge = false, candidat = null, stable = 0;
  var jouer = function () {
    var I = window.ISNAD; if (!I || !I.ui || document.hidden) return false;
    if (document.querySelector('.screen:not([hidden])') || I.ui.menuOpen) return false;
    var c = document.getElementById('card'); if (c && !c.hidden) return false;
    var s = I.scene; if (!s) return false;
    if (s === I.world) return !!I.world.map;
    return s === (I.battle && I.battle.scene) || s === (I.circuit && I.circuit.scene) || s === (I.activites && I.activites.scene);
  };
  var titrePret = function () { var t = document.getElementById('title'); return !!t && !t.hidden && t.querySelectorAll('.vmenu button').length > 0; };
  var lecture = function () {
    if (pub) return;                  // aucun événement du SDK pendant une publicité
    if (!charge && titrePret()) { charge = true; appeler('gameLoadingFinished'); }
    var v = jouer();
    if (v === candidat) stable++; else { candidat = v; stable = 1; }
    if (stable >= 2 && v !== enJeu) { enJeu = v; appeler(v ? 'gameplayStart' : 'gameplayStop'); }
  };
  setInterval(lecture, REGLAGES.sondage);
  document.addEventListener('visibilitychange', function () { if (document.hidden && enJeu && !pub) { enJeu = false; candidat = false; stable = 2; appeler('gameplayStop'); } });

  /* ---------- se raccrocher au jeu (il se charge après ce script) ---------- */
  var cable = false;
  var raccrocher = function () {
    var I = window.ISNAD, U = I && I.ui; if (cable || !U || !U.startSaga || !U.resume || !I.partage) return; cable = true;
    // la Chaîne : ouvrir ou reprendre un maillon — la publicité passe avant que le récit ne parte
    var dedans = false;   // une pause déjà faite pour ce toucher : celle qu'appelle U.reprendre n'en refait pas une
    var ouvrir = U.startSaga; U.startSaga = function () { var a = arguments, me = this; if (dedans) return ouvrir.apply(me, a); return pause('chaine', 'chain').then(function () { return ouvrir.apply(me, a); }); };
    // l'écran-titre : « Continuer »
    var reprendre = U.resume; U.resume = function () { var a = arguments, me = this; return pause('reprise', 'title').then(function () { return reprendre.apply(me, a); }); };
    // 2.48 : un récit quitté en chemin reprend par U.reprendre — choisi dans la liste de « Continuer » (avec plusieurs récits
    // en cours, l'écran-titre la montre : le moment « reprise »), ou par « Reprendre » sur la Chaîne (le moment « chaine »).
    // Une seule pause par toucher : celle-ci faite, U.startSaga, s'il est appelé dedans, n'en refait pas.
    if (U.reprendre) { var reprendreRecit = U.reprendre; U.reprendre = function () { var a = arguments, me = this, chaine = !!touche && touche.ecran === 'chain';
      return pause(chaine ? 'chaine' : 'reprise', chaine ? 'chain' : 'title').then(function () { dedans = true; try { return reprendreRecit.apply(me, a); } finally { dedans = false; } }); }; }
    // Poki : ni lien sortant ni adresse du site (requirements-quality) — « Partager ma progression » n'est pas offert
    I.partage.offert = function () { return false; };
  };
  var essai = setInterval(function () { raccrocher(); if (cable) clearInterval(essai); }, 25);
  window.ISNAD_POKI = { reglages: REGLAGES, jouer: jouer, ok: function () { return ok; }, pub: function () { return pub; } };
})();
