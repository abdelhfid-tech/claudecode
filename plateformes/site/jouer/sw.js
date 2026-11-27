/* ISNAD — le service worker de jouer/ (posé par v2/tools/plateformes/site.js : {{VERSION}} est remplacé à l'assemblage).
   Il ne garde que le jeu : la page jouer/index.html, sous un cache qui porte le numéro et l'empreinte du jeu. Une
   nouvelle version du jeu fait un nouveau service worker : il garde la nouvelle page, puis efface les anciens caches.
   Le reste (icônes, manifeste, les pages du site) passe par le réseau, sans être gardé. Rien n'est envoyé nulle part. */
const CACHE = 'isnad-jouer-{{VERSION}}';
const JEU = new URL('./', self.location).href, PAGE = new URL('./index.html', self.location).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add(new Request(PAGE, { cache: 'reload' }))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(L => Promise.all(L.filter(k => k.startsWith('isnad-jouer-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// la page du jeu : d'abord le cache (elle se rouvre sans réseau), sinon le réseau ; tout le reste : le réseau seul
self.addEventListener('fetch', e => {
  const u = e.request.url.split('#')[0].split('?')[0];
  if (e.request.method !== 'GET' || (u !== JEU && u !== PAGE)) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(PAGE).then(r => r || fetch(e.request))));
});
