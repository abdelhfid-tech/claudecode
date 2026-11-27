/* ISNAD 2.x — l'essai du site (node v2/tools/plateformes.js essai site). Un seul navigateur à la fois.
   Le dossier plateformes/sortie/site/ est servi par un petit serveur local QUI APPLIQUE son fichier _headers, comme le
   font Cloudflare Pages et Netlify (règles par chemin, « * » pour le reste du chemin ; une page absente : 404.html, avec
   le statut 404 ; un dossier : son index.html). Puis :
   a. les en-têtes : HSTS, politique de contenu sans rien au-dehors, Referrer-Policy, Permissions-Policy (ni caméra, ni
      micro, ni position), X-Content-Type-Options, noindex tant que site.json le dit ; le type de l'APK ; aucune en-tête
      donnée par deux règles qui se recouvrent ;
   b. chaque page, en 390 × 844 (téléphone, tactile) et 1280 × 800 : chargée sans erreur console, sans violation de la
      politique de contenu, sans requête au-dehors (toute requête hors du serveur est refusée et comptée) ; rien ne défile
      en largeur ; chaque image chargée, avec son texte de remplacement ; les polices du site chargées et servies ; aucun
      texte sous 12 points ; une capture pleine page dans v2/.smoke/plateformes/site/ ;
   c. les liens : chaque lien interne (pages, images, styles, téléchargements, ancres) répond 200 ; les liens au-dehors
      (mailto:, TestFlight, itch.io) sont listés, jamais suivis ;
   d. l'accueil : la réserve et la mention du soutien, le logo chargé et identique, octet pour octet, au fichier fourni ;
   e. jouer/ : sous la politique de contenu du site, le jeu démarre, « Nouvelle partie », « Commencer », des répliques ;
      aucune violation, aucune erreur, rien au-dehors ; le manifeste et ses icônes ;
   f. le service worker : il s'installe, son cache ne garde que le jeu ; hors ligne, jouer/ se recharge et une partie
      commence ;
   g. le zip : les mêmes fichiers que le dossier, octet pour octet.
   Sortie : « OK » par preuve, « ÉCART » sinon, « · » pour un constat ; « SITE CONFORME » à la fin. */
const fs = require('fs'), path = require('path'), http = require('http');
const P = require('../../promotion.js');

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8', '.apk': 'application/octet-stream' };

// _headers : [{ motif, re, entetes: [[nom, valeur]] }]
function lireEntetes(texte) {
  const R = []; let cur = null;
  for (const l of texte.split('\n')) {
    if (!l.trim() || /^\s*#/.test(l)) continue;
    if (!/^\s/.test(l)) { const motif = l.trim(); cur = { motif, re: new RegExp('^' + motif.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/:[A-Za-z]\w*/g, '[^/]+') + '$'), entetes: [] }; R.push(cur); continue; }
    const m = l.trim().match(/^([^:]+):\s*(.*)$/); if (m && cur) cur.entetes.push([m[1].trim(), m[2].trim()]);
  }
  return R;
}
function entetesPour(R, chemin) {
  const H = {}, vu = {};
  for (const r of R) if (r.re.test(chemin)) for (const [k, v] of r.entetes) { const c = k.toLowerCase(); if (H[c]) { H[c] += ', ' + v; vu[c] = (vu[c] || [r.motif]).concat(r.motif); } else { H[c] = v; vu[c] = [r.motif]; } }
  return { H, doubles: Object.entries(vu).filter(([, L]) => L.length > 1) };
}

function serveur(dos) {
  const R = lireEntetes(fs.readFileSync(path.join(dos, '_headers'), 'utf8')), doubles = new Set(), journal = [];
  const s = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0].split('#')[0]); if (u.includes('..')) { r.writeHead(400); return r.end(); }
    let f = path.join(dos, u), statut = 200;
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) { if (!u.endsWith('/')) { r.writeHead(301, { Location: u + '/' }); return r.end(); } f = path.join(f, 'index.html'); }
    if (!fs.existsSync(f) || u === '/_headers') { f = path.join(dos, '404.html'); statut = 404; }
    const e = entetesPour(R, u); e.doubles.forEach(([k, L]) => doubles.add(`${u} : ${k} (${L.join(', ')})`));
    const H = Object.assign({ 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }, e.H);
    journal.push([u, statut]); r.writeHead(statut, H); r.end(q.method === 'HEAD' ? undefined : fs.readFileSync(f));
  });
  return new Promise(res => s.listen(0, '127.0.0.1', () => res({ s, R, doubles, journal, port: s.address().port })));
}

module.exports = async function essai(C, fait) {
  const { chromium, devices } = require('playwright');
  const OUT = fait.dossier, SMOKE = path.join(C.V2, '.smoke/plateformes/site'); fs.rmSync(SMOKE, { recursive: true, force: true }); fs.mkdirSync(SMOKE, { recursive: true });
  let anomalies = 0; const dit = (v, m) => { if (!v) anomalies++; console.log((v ? 'OK  ' : 'ÉCART ') + m); }, note = m => console.log('·   ' + m);
  console.log(`— essai du site : ${path.relative(C.RACINE, OUT)}/ (${fait.fichiers.length} fichiers)`);
  const SV = await serveur(OUT), ORI = `http://localhost:${SV.port}`;   // « localhost » : un contexte sûr, où le service worker s'enregistre
  console.log(`·   servi sur ${ORI}, avec les en-têtes de _headers (${SV.R.length} règles)`);
  const get = (u, m) => new Promise((res, rej) => { const q = http.request(ORI + u, { method: m || 'GET' }, r => { const b = []; r.on('data', d => b.push(d)); r.on('end', () => res({ statut: r.statusCode, h: r.headers, corps: Buffer.concat(b) })); }); q.on('error', rej); q.end(); });
  const b = await chromium.launch();
  try {
    /* ---------- a. les en-têtes ---------- */
    const r0 = await get('/'), h = r0.h, csp = h['content-security-policy'] || '';
    dit(/max-age=\d{7,}/.test(h['strict-transport-security'] || ''), `a · Strict-Transport-Security : ${h['strict-transport-security']}`);
    const dirs = Object.fromEntries(csp.split(';').map(x => x.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
    const ouvert = Object.entries(dirs).filter(([k, v]) => v.some(x => /^(https?:|\*|wss?:)/.test(x) || (x.includes('.') && !x.startsWith("'"))));
    dit(csp && dirs['default-src'] && dirs['default-src'].join(' ') === "'self'" && dirs['connect-src'] && dirs['connect-src'].join(' ') === "'self'" && !ouvert.length && (dirs['frame-ancestors'] || []).join() === "'none'",
      `a · Content-Security-Policy : tout est 'self' (aucune adresse au-dehors, connect-src 'self', frame-ancestors 'none') — ${csp.slice(0, 150)}…`);
    dit(h['referrer-policy'] === 'no-referrer', `a · Referrer-Policy : ${h['referrer-policy']}`);
    const pp = h['permissions-policy'] || ''; dit(['camera=()', 'microphone=()', 'geolocation=()'].every(x => pp.includes(x)), `a · Permissions-Policy : ${pp}`);
    dit(h['x-content-type-options'] === 'nosniff', `a · X-Content-Type-Options : ${h['x-content-type-options']}`);
    if (!fait.S.indexable) { const rb = (await get('/robots.txt')).corps.toString(); dit(/noindex/.test(h['x-robots-tag'] || '') && /Disallow: \/\s*$/m.test(rb), `a · non indexé (site.json : indexable false) : X-Robots-Tag « ${h['x-robots-tag']} », robots.txt « Disallow: / », et la balise robots dans chaque page (b)`); }
    if (fait.apk) { const ra = await get('/telechargements/' + fait.apk.nom, 'HEAD'); dit(ra.statut === 200 && ra.h['content-type'] === 'application/vnd.android.package-archive' && /attachment/.test(ra.h['content-disposition'] || ''), `a · l’APK : ${ra.statut}, ${ra.h['content-type']}, ${ra.h['content-disposition']}`);
      dit(C.sha256(fs.readFileSync(path.join(OUT, 'telechargements', fait.apk.nom))) === fait.apk.sha256 && C.sha256(fs.readFileSync(path.join(C.SORTIE, 'android', fait.apk.nom))) === fait.apk.sha256, `a · l’APK servi est celui de plateformes/sortie/android/, et son empreinte est celle que la page affiche (${fait.apk.sha256.slice(0, 16)}…)`); }
    else note('a · pas d’APK dans plateformes/sortie/android/ : la page « Tester » dit « bientôt » (b le vérifie)');
    const rm = await get('/jouer/manifest.webmanifest'); dit(rm.h['content-type'] === 'application/manifest+json', `a · le manifeste : ${rm.h['content-type']}`);
    const rsw = await get('/jouer/sw.js'); dit(/no-cache/.test(rsw.h['cache-control'] || '') && /javascript/.test(rsw.h['content-type']), `a · sw.js : ${rsw.h['content-type']}, Cache-Control ${rsw.h['cache-control']}`);
    const r404 = await get('/nulle-part/ici'); dit(r404.statut === 404 && /Page introuvable/.test(r404.corps.toString()) && /content-security-policy/.test(Object.keys(r404.h).join()), `a · une adresse inconnue : statut ${r404.statut}, la page 404, avec les en-têtes`);

    /* ---------- b. chaque page, deux écrans ---------- */
    const PAGES = [['accueil', '/'], ['tester', '/tester/'], ['confidentialite', '/confidentialite/'], ['404', '/nulle-part/ici']];
    const APP = { tel: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }, large: { viewport: { width: 1280, height: 800 } } };
    const liens = new Set(), dehorsListes = new Set();
    for (const [nom, u] of PAGES) for (const [app, opt] of Object.entries(APP)) {
      const ctx = await b.newContext(opt), p = await ctx.newPage(), erreurs = [], dehors = [], violations = [];
      await ctx.route('**/*', r => { const x = r.request().url(); if (x.startsWith(ORI) || /^(data|blob|about):/.test(x)) return r.continue(); dehors.push(x); return r.abort(); });
      await p.addInitScript(() => { document.addEventListener('securitypolicyviolation', e => { (window.__v = window.__v || []).push(e.violatedDirective + ' ' + e.blockedURI); }); });
      p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !(nom === '404' && /status of 404/.test(m.text()))) erreurs.push(m.text()); });   // la page 404 elle-même : le navigateur note son statut
      const rep = await p.goto(ORI + u, { waitUntil: 'networkidle' });
      await p.evaluate(async () => { for (const i of document.images) { i.loading = 'eager'; } await document.fonts.ready; window.scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 400)); window.scrollTo(0, 0); await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
      const r = await p.evaluate(() => ({
        large: document.documentElement.scrollWidth - innerWidth,
        images: [...document.images].map(i => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0, alt: i.getAttribute('alt') })),
        polices: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '') + ' ' + f.weight),
        servies: ['h1', 'p', '.marque-nom'].map(q => { const e = document.querySelector(q); return e ? getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '') : ''; }),
        petits: [...document.querySelectorAll('body *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1) && e.offsetParent !== null && parseFloat(getComputedStyle(e).fontSize) < 12).map(e => e.textContent.trim().slice(0, 30)),
        liens: [...document.querySelectorAll('a[href]')].map(a => a.href), ancres: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(id => !document.getElementById(id)), robots: (document.querySelector('meta[name=robots]') || {}).content || '',
        coupes: [...document.querySelectorAll('h1, h2, h3, .bouton, .reserve-texte')].flatMap(e => { const R = []; const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { for (const m of n.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const L = [...r.getClientRects()].filter(q => q.width > 0); if (new Set(L.map(q => Math.round(q.top))).size > 1) R.push(m[0]); } } return R; }),
        texte: document.body.innerText, v: window.__v || [], titre: document.title, cibles: [...document.querySelectorAll('a, button')].filter(e => e.offsetParent !== null && !(e.closest('p, li') && e.closest('p, li').textContent.trim() !== e.textContent.trim())).map(e => { const q = e.getBoundingClientRect(); return [e.textContent.trim().slice(0, 20), Math.round(q.height)]; }).filter(([, h]) => h < 24) }));
      await p.screenshot({ path: path.join(SMOKE, `${nom}-${app}.png`), fullPage: true });
      r.liens.forEach(l => { if (!l.startsWith(ORI)) return dehorsListes.add(l); const x = new URL(l); if (x.hash && x.pathname === new URL(p.url()).pathname) return; liens.add(x.pathname + x.hash); });   // une ancre de la page même : vérifiée dans la page (ancres)
      dit(!r.ancres.length, `c · ${nom} ${app} : chaque ancre de la page a sa cible${r.ancres.length ? ' — ' + r.ancres.join(', ') : ''}`);
      const imgKo = r.images.filter(i => !i.ok || !i.alt);
      dit(!erreurs.length && !r.v.length && !dehors.length && (nom === '404' ? rep.status() === 404 : rep.status() === 200),
        `b · ${nom} ${app} (${opt.viewport.width} × ${opt.viewport.height}) : statut ${rep.status()}, aucune erreur, aucune violation de la politique de contenu, aucune requête au-dehors` + (erreurs.length ? ' — ' + erreurs.slice(0, 2).join(' | ') : '') + (r.v.length ? ' — ' + r.v.slice(0, 2).join(' | ') : '') + (dehors.length ? ' — ' + dehors.slice(0, 2).join(' | ') : ''));
      dit(r.large <= 0, `b · ${nom} ${app} : rien ne défile en largeur (${r.large > 0 ? r.large + ' points de trop' : 'scrollWidth = largeur'})`);
      dit(!imgKo.length, `b · ${nom} ${app} : ${r.images.length} images chargées, chacune avec son texte de remplacement` + (imgKo.length ? ' — ' + imgKo.map(i => i.src).join(', ') : ''));
      dit(r.servies[0] === 'Cinzel' && ['Alegreya', 'Cinzel'].every(f => r.polices.some(x => x.startsWith(f))), `b · ${nom} ${app} : les polices du site, servies par lui (${[...new Set(r.polices)].join(', ')})`);
      dit(!r.coupes.length, `b · ${nom} ${app} : aucun mot coupé dans un titre, un bouton ou la réserve` + (r.coupes.length ? ' — ' + r.coupes.join(', ') : ''));
      dit(!r.petits.length, `b · ${nom} ${app} : aucun texte sous 12 points` + (r.petits.length ? ' — ' + r.petits.slice(0, 3).join(' · ') : ''));
      if (app === 'tel') dit(!r.cibles.length, `b · ${nom} tel : chaque lien et bouton fait au moins 24 points de haut` + (r.cibles.length ? ' — ' + r.cibles.slice(0, 4).map(x => x.join(' ')).join(' · ') : ''));
      dit(fait.S.indexable || /noindex/.test(r.robots), `b · ${nom} ${app} : balise robots « ${r.robots} »`);
      if (nom === 'tester' && app === 'tel') {
        if (fait.apk) dit(r.texte.includes(fait.apk.sha256) && r.liens.some(l => l.endsWith('/telechargements/' + fait.apk.nom)), `b · tester : le bouton de l’APK et son empreinte SHA-256 (${fait.apk.taille})`);
        else dit(/Bientôt/.test(r.texte), 'b · tester : sans APK, « Bientôt »');
        dit(fait.S.testflight ? r.liens.includes(fait.S.testflight) : (r.texte.match(/Bientôt/g) || []).length >= (fait.apk ? 1 : 2), `b · tester : iPhone — ${fait.S.testflight ? 'le lien TestFlight' : '« Bientôt » (site.json : testflight vide), et le renvoi vers le navigateur'}`);
        dit(r.texte.includes(P.CONTACT) && /Enregistrer le fichier/.test(r.texte), `b · tester : « Enregistrer le fichier » et où signaler une erreur (${P.CONTACT})`);
      }
      if (nom === 'accueil' && app === 'tel') {
        /* ---------- d. l'accueil : la réserve, le soutien ---------- */
        const t = r.texte.replace(/\s+/g, ' ');
        dit(t.includes(P.RESERVE), `d · la réserve, sur l’accueil : « ${P.RESERVE} »`);
        const haut = await p.evaluate(() => { const e = document.querySelector('.reserve'); return e ? Math.round(e.getBoundingClientRect().top) : -1; });
        dit(haut > 0 && haut < 2 * 844, `d · la réserve est bien visible : un encadré, à ${haut} points du haut de l’accueil sur un téléphone (moins de deux écrans)`);
        dit(t.includes(P.SOUTIEN.replace(/\s+/g, ' ')) && t.includes(P.DEVISE), `d · la mention du soutien (« ${P.SOUTIEN} ») et la devise`);
        const lg = await p.evaluate(() => { const i = document.querySelector('img.logo'); return i ? { ok: i.complete && i.naturalWidth > 0, src: i.getAttribute('src'), w: i.naturalWidth } : null; });
        const octets = lg && (await get('/' + lg.src.replace(/^\.\//, ''))).corps;
        dit(lg && lg.ok && octets && octets.equals(fs.readFileSync(path.join(C.RACINE, P.SOUTIEN_LOGO))), `d · le logo de l’Institut : chargé (${lg && lg.w} points de large), identique octet pour octet à ${P.SOUTIEN_LOGO}`);
        const sagas = await p.evaluate(() => document.querySelectorAll('.saga').length); dit(sagas === 5, `d · les cinq récits, lus dans le jeu (${sagas})`);
      }
      await ctx.close();
    }

    /* ---------- c. les liens ---------- */
    const ressources = new Set(liens);
    for (const f of fait.pages) { const hh = fs.readFileSync(path.join(OUT, f), 'utf8'), base = '/' + f.replace(/[^/]*$/, ''); for (const m of hh.matchAll(/\b(?:src|href)="([^"#]+)/g)) { const x = m[1]; if (/^(mailto:|https?:)/.test(x)) continue; ressources.add(new URL(x, ORI + base).pathname); } }
    const casses = []; for (const u of ressources) { const ancre = u.split('#')[1], q = await get(u.split('#')[0]); if (q.statut !== 200) casses.push(`${u} (${q.statut})`); else if (ancre && !q.corps.toString().includes(`id="${ancre}"`)) casses.push(`${u} (ancre)`); }
    dit(!casses.length, `c · ${ressources.size} liens et ressources internes répondent 200${casses.length ? ' — cassés : ' + casses.join(', ') : ''}`);
    note(`c · liens au-dehors, listés, non suivis : ${[...dehorsListes].join(' · ')}`);

    /* ---------- e. jouer/ sous la politique de contenu ---------- */
    for (const [app, opt] of Object.entries(APP)) {
      const ctx = await b.newContext(Object.assign({ serviceWorkers: 'block' }, opt)), p = await ctx.newPage(), erreurs = [], dehors = [];
      await ctx.route('**/*', r => { const x = r.request().url(); if (x.startsWith(ORI) || /^(data|blob|about):/.test(x)) return r.continue(); dehors.push(x); return r.abort(); });
      await p.addInitScript(() => { document.addEventListener('securitypolicyviolation', e => { (window.__v = window.__v || []).push(e.violatedDirective + ' ' + (e.blockedURI || '') + ' ' + (e.sample || '')); }); });
      p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
      const rep = await p.goto(ORI + '/jouer/'); const hj = rep.headers();
      await p.waitForFunction(() => window.ISNAD && !document.querySelector('#title').hidden && document.querySelectorAll('#title .vmenu button').length > 0, null, { timeout: 30000 });
      const t = s => p.evaluate(s => window.ISNAD.t(s), s);
      await p.locator('#title .vmenu button', { hasText: await t('Nouvelle partie') }).first().click();
      await p.waitForSelector('#perso:not([hidden])', { timeout: 10000 }); await p.locator('#perso button', { hasText: await t('Commencer') }).first().click();
      const repliques = [];
      for (let i = 0; i < 40 && repliques.length < 2; i++) { const x = await p.evaluate(() => { const d = document.querySelector('#dialog'); return d && !d.hidden ? d.querySelector('.text').textContent.trim() : ''; }); if (x && x.length > 3 && !repliques.includes(x)) repliques.push(x); await p.keyboard.press('Enter'); await p.waitForTimeout(500); }
      await p.screenshot({ path: path.join(SMOKE, `jouer-${app}.png`) });
      const v = await p.evaluate(() => window.__v || []), sauve = await p.evaluate(() => { try { return Object.keys(localStorage).filter(k => k.startsWith('isnad2.')); } catch (e) { return ['?']; } });
      dit(/script-src 'self' 'sha256-/.test(hj['content-security-policy'] || '') && !/script-src[^;]*unsafe-inline/.test(hj['content-security-policy']), `e · jouer ${app} : servi sous la politique de contenu du site (le script du jeu admis par son empreinte, pas de 'unsafe-inline' pour les scripts)`);
      dit(repliques.length >= 2 && !v.length && !erreurs.length && !dehors.length, `e · jouer ${app} (${opt.viewport.width} × ${opt.viewport.height}) : le jeu démarre, « Nouvelle partie », « Commencer », ${repliques.length} répliques (« ${(repliques[0] || '').slice(0, 40)}… ») ; aucune violation, aucune erreur, rien au-dehors`
        + (v.length ? ' — ' + v.slice(0, 3).join(' | ') : '') + (erreurs.length ? ' — ' + erreurs.slice(0, 2).join(' | ') : '') + (dehors.length ? ' — ' + dehors.slice(0, 2).join(' | ') : ''));
      if (app === 'tel') dit(sauve.length > 0, `e · jouer : la partie se garde sur l’appareil (${sauve.join(', ')})`);
      await ctx.close();
    }
    const man = JSON.parse(rm.corps.toString()), icos = [];
    for (const i of man.icons) { const q = await get('/jouer/' + i.src); const [iw, ih] = require('../site.js').dimensions(q.corps); icos.push(`${i.src} ${iw}×${ih}${i.purpose === 'maskable' ? ' (masquable)' : ''}`); if (q.statut !== 200 || `${iw}x${ih}` !== i.sizes) icos.push('ÉCART'); }
    dit(man.start_url && man.display && !icos.includes('ÉCART') && man.icons.some(i => i.sizes === '512x512') && man.icons.some(i => i.purpose === 'maskable'), `e · le manifeste : « ${man.name} », ${man.display}, start_url ${man.start_url} ; icônes ${icos.join(', ')}`);

    /* ---------- f. le service worker, puis hors ligne ---------- */
    {
      const ctx = await b.newContext(APP.tel), p = await ctx.newPage(), erreurs = [];
      p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
      await p.goto(ORI + '/jouer/'); await p.waitForFunction(() => window.ISNAD && !document.querySelector('#title').hidden, null, { timeout: 30000 });
      await p.evaluate(() => navigator.serviceWorker.ready);
      await p.waitForFunction(() => caches.keys().then(k => k.length > 0), null, { timeout: 15000 }).catch(() => {});
      const cache = await p.evaluate(async () => { const K = await caches.keys(), R = {}; for (const k of K) R[k] = (await (await caches.open(k)).keys()).map(q => new URL(q.url).pathname); return R; });
      const ks = Object.keys(cache);
      dit(ks.length === 1 && ks[0] === 'isnad-jouer-' + fait.VERSION && cache[ks[0]].length === 1 && cache[ks[0]][0] === '/jouer/index.html', `f · le service worker s’installe ; son cache, « ${ks.join(', ')} », ne garde que le jeu : ${JSON.stringify(cache)}`);
      await p.evaluate(() => localStorage.clear());   // la partie de la première visite oubliée : une partie neuve, sans la question « remplacer ? »
      await ctx.setOffline(true);
      const avant = SV.journal.length;
      await p.reload(); await p.waitForFunction(() => window.ISNAD && !document.querySelector('#title').hidden && document.querySelectorAll('#title .vmenu button').length > 0, null, { timeout: 30000 });
      const t = s => p.evaluate(s => window.ISNAD.t(s), s);
      // l'écran-titre s'ouvre en fondu : on touche « Nouvelle partie » quand il a fini, comme le joueur (deux essais au plus)
      for (let k = 0; k < 2; k++) { await p.waitForTimeout(1000); await p.locator('#title .vmenu button', { hasText: await t('Nouvelle partie') }).first().click().catch(() => {}); if (await p.waitForSelector('#perso:not([hidden])', { timeout: 5000 }).then(() => true, () => false)) break; }
      await p.locator('#perso button', { hasText: await t('Commencer') }).first().click();
      let rep = ''; for (let i = 0; i < 30 && !rep; i++) { rep = await p.evaluate(() => { const d = document.querySelector('#dialog'); return d && !d.hidden ? d.querySelector('.text').textContent.trim() : ''; }); if (!rep) { await p.keyboard.press('Enter'); await p.waitForTimeout(500); } }
      const vus = SV.journal.slice(avant).map(([u]) => u);
      await p.screenshot({ path: path.join(SMOKE, 'jouer-hors-ligne.png') });
      dit(!!rep && !vus.includes('/jouer/') && !vus.includes('/jouer/index.html'), `f · hors ligne : jouer/ se recharge depuis le cache (le serveur n’a pas été demandé pour la page : ${vus.length ? vus.join(', ') : 'rien'}), et une partie commence (« ${rep.slice(0, 40)}… »)`);
      dit(!erreurs.filter(e => !/ERR_INTERNET_DISCONNECTED|Failed to load resource/.test(e)).length, `f · hors ligne, aucune erreur du jeu${erreurs.length ? ' (le navigateur seul note : ' + [...new Set(erreurs)].slice(0, 2).join(' | ').slice(0, 160) + ')' : ''}`);
      await ctx.close();
    }

    /* ---------- g. le zip ---------- */
    const Z = C.lireZip(fs.readFileSync(fait.zipSite)), noms = Z.map(e => e.nom);
    dit(noms.length === fait.fichiers.length && Z.every(e => fait.fichiers.includes(e.nom) && e.donnees.equals(fs.readFileSync(path.join(OUT, e.nom)))), `g · ${path.relative(C.RACINE, fait.zipSite)} : ${noms.length} entrées, les fichiers du dossier, octet pour octet`);
    dit(!SV.doubles.size, `a · aucune en-tête donnée par deux règles de _headers à la fois${SV.doubles.size ? ' — ' + [...SV.doubles].slice(0, 3).join(' | ') : ''}`);
  } finally { await b.close(); SV.s.close(); }
  console.log(`·   captures : ${path.relative(C.RACINE, SMOKE)}/`);
  console.log(anomalies ? `✗ ${anomalies} écart(s)` : '✓ SITE CONFORME');
  return anomalies;
};
