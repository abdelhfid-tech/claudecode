/* ISNAD — jouer/ : le service worker qui garde le jeu pour qu'il se rouvre sans réseau (sw.js, à côté).
   Le seul script que le site ajoute au paquet web ; si le navigateur ne le permet pas, le jeu se joue tout de même. */
if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {}); });
