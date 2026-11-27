/* ISNAD 2.x — CrazyGames « Basic Launch » : le préambule, posé À CÔTÉ du jeu (le jeu n'est pas modifié).
   Ajouté par v2/tools/plateformes/crazygames.js, avant le script du jeu. Trois choses, et rien d'autre :
     1. l'anglais d'office, tant que l'appareil n'a rien choisi (le portail exige une version anglaise) : on lit les
        options du jeu (« isnad2.opts ») ; sans langue gardée, on lui en donne une, « en ». Le joueur choisit toujours le
        français ou l'arabe sur l'écran-titre ou dans les Réglages, et ce choix, une fois gardé, l'emporte ;
     2. pas de plein écran maison (le portail fournit le sien) : pour le jeu, le plein écran n'existe pas dans ce cadre,
        donc ni le bouton de la scène, ni le réglage, ni la demande au premier toucher (ui.js, pleinPossible) ;
     3. rien d'autre : aucun SDK, aucune publicité, aucun appel au-dehors. */
(function () {
  'use strict';
  try {
    const lire = Storage.prototype.getItem;
    Storage.prototype.getItem = function (cle) {
      const v = lire.apply(this, arguments);
      if (cle !== 'isnad2.opts') return v;
      try { const o = v ? JSON.parse(v) : {}; if (o && typeof o === 'object' && !Array.isArray(o) && !o.lang) { o.lang = 'en'; return JSON.stringify(o); } } catch (e) { /* illisible : le jeu fait comme avant */ }
      return v;
    };
  } catch (e) { /* pas de stockage : le jeu s'ouvre comme avant */ }
  try { ['fullscreenEnabled', 'webkitFullscreenEnabled'].forEach(k => Object.defineProperty(document, k, { configurable: true, get: () => false })); } catch (e) { /* rien */ }
})();
