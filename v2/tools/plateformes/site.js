/* ISNAD 2.x — plateformes : la cible « site » (le site qui présente le jeu et fait essayer les versions de test).
   node v2/tools/plateformes.js site        écrit plateformes/sortie/site/ (un dossier statique, à héberger tel quel) et,
                                            à côté, plateformes/sortie/isnad-site-<numéro>.zip (le même dossier)
   node v2/tools/plateformes.js essai site  le fait, puis l'éprouve (v2/tools/plateformes/site/essai.js) : « SITE CONFORME »
   Les sources sont dans plateformes/site/ (gabarit, feuille de style, pages par langue, site.json pour ce qui se règle) ;
   plateformes/site/LISEZ-MOI.md dit tout. Le jeu n'est pas modifié : jouer/ est le paquet web (web.js), auquel on ajoute
   seulement, dans <head>, ce qui le rend installable (manifeste, icônes, un script qui enregistre le service worker).
   L'adresse, la devise, l'état, la réserve, le contact et le soutien viennent de v2/tools/promotion.js, jamais recopiés.
   Les captures sont prises en jouant (site/captures.js) et gardées dans plateformes/sortie/.site-captures/ tant que le
   numéro du jeu ne change pas (SITE_CAPTURES=1 les reprend). */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const P = require('../promotion.js');
const SRC_REL = 'plateformes/site';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const LE = { 'Véracité': 'la', 'Justice': 'la', 'Courage': 'le', 'Miséricorde': 'la', 'Savoir': 'le' };
// les familles que le site emploie (les autres polices du jeu ne servent qu'au jeu, qui a les siennes en lui)
const FAMILLES = ['Alegreya', 'Cinzel', 'Reem Kufi', 'Amiri'];
// le jeu (jouer/) : ce qui est ajouté dans <head>, après <title> — rien d'autre ne change
const AJOUT_JOUER = indexable => [
  '<link rel="manifest" href="manifest.webmanifest">',
  '<meta name="theme-color" content="#07060d">',
  '<link rel="icon" href="icone-192.png" sizes="192x192" type="image/png">',
  '<link rel="apple-touch-icon" href="apple-touch-icon.png">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title" content="' + esc(P.NOM) + '">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black">',
  '<meta name="referrer" content="no-referrer">',
  ...(indexable ? [] : ['<meta name="robots" content="noindex, nofollow">']),
  '<script src="enregistrer.js" defer></script>'
];
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.apk': 'application/vnd.android.package-archive', '': 'text/plain; charset=utf-8' };

// les dimensions d'une image, lues dans son en-tête (JPEG, PNG, WebP)
function dimensions(b) {
  if (b[0] === 0x89 && b.toString('latin1', 1, 4) === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') {
    const t = b.toString('latin1', 12, 16);
    if (t === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (t === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (t === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
  }
  if (b[0] === 0xff && b[1] === 0xd8) { let i = 2; while (i < b.length) { const m = b[i + 1], l = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + l; } }
  throw new Error('dimensions illisibles');
}
const taille = n => (n / 1e6).toFixed(1).replace('.', ',') + ' Mo';
const valeur = (ctx, cle) => cle.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx);

/* le gabarit : {{cle}} (échappé ; cle.sous.cle), {{#cle}}…{{/cle}} (si), {{^cle}}…{{/cle}} (sinon) ; les aides en
   capitales ({{SAGAS}}, {{IMG:nom:appareil}}, {{GALERIE:appareil:a,b}}, {{LOGO}}, {{SOUTIEN_HTML}}) rendent du HTML.
   brut : sans échapper (pour les champs du méta d'une page, échappés à leur pose). */
function rendre(src, ctx, aides, brut) {
  let s = src;
  for (let k = 0; k < 3; k++) s = s.replace(/\{\{([#^])([\w.]+)\}\}([\s\S]*?)\{\{\/\2\}\}\n?/g, (m, q, cle, corps) => ((q === '#') === !!valeur(ctx, cle) ? corps : ''));
  s = s.replace(/\{\{([A-Z_]+)(?::([^}]*))?\}\}/g, (m, nom, arg) => { if (aides && aides[nom]) return aides[nom](arg); return m; });
  s = s.replace(/\{\{([\w.]+)\}\}/g, (m, cle) => { const v = valeur(ctx, cle); if (v === undefined || v === null || typeof v === 'object') return m; return brut ? String(v) : esc(v); });
  return s;
}

// les fichiers d'un dossier, chemins relatifs, triés
const lister = (dos, pre = '') => fs.readdirSync(dos, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en')).flatMap(e => e.isDirectory() ? lister(path.join(dos, e.name), pre + e.name + '/') : [pre + e.name]);

/* _headers (Cloudflare Pages, Netlify) : une règle pour tout le site, puis ce qui est propre à jouer/ et aux
   téléchargements. Aucune en-tête n'est donnée par deux règles qui se recouvrent (les hébergeurs les joindraient).
   La politique de contenu laisse tourner le jeu (son script en ligne, par son empreinte ; ses styles en ligne ; ses
   polices et ses images en data: ; ses images en blob: pour « Partager ») et ne laisse rien partir au-dehors : tout est
   'self'. Les pages du site y ajoutent la leur, plus stricte, dans une balise (ni script, ni style en ligne). */
function entetes(S, hashJeu) {
  const csp = ["default-src 'self'", `script-src 'self' 'sha256-${hashJeu}'`, "style-src 'self' 'unsafe-inline'", "font-src 'self' data:", "img-src 'self' data: blob:", "media-src 'self' data: blob:",
    "connect-src 'self'", "worker-src 'self'", "manifest-src 'self'", "frame-src 'none'", "object-src 'none'", "base-uri 'none'", "form-action 'none'", "frame-ancestors 'none'"].join('; ');
  const R = [['/*', [['Strict-Transport-Security', S.hsts || 'max-age=31536000'], ['Content-Security-Policy', csp], ['Referrer-Policy', 'no-referrer'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()'], ['X-Content-Type-Options', 'nosniff'],
    ['Cross-Origin-Opener-Policy', 'same-origin'], ['X-Frame-Options', 'DENY'], ...(S.indexable ? [] : [['X-Robots-Tag', 'noindex, nofollow']])]],
  ['/jouer/', [['Cache-Control', 'no-cache']]], ['/jouer/index.html', [['Cache-Control', 'no-cache']]], ['/jouer/sw.js', [['Cache-Control', 'no-cache']]],
  ['/jouer/manifest.webmanifest', [['Content-Type', 'application/manifest+json']]],
  ['/telechargements/*', [['Content-Type', 'application/vnd.android.package-archive'], ['Content-Disposition', 'attachment'], ['Cache-Control', 'no-cache']]]];
  return { regles: R, texte: '# ISNAD — les en-têtes du site (Cloudflare Pages, Netlify). Fait par v2/tools/plateformes/site.js : ne pas le retoucher à la main.\n' +
    R.map(([ch, L]) => ch + '\n' + L.map(([k, v]) => `  ${k}: ${v}`).join('\n')).join('\n') + '\n' };
}

module.exports = {
  description: 'le site qui présente le jeu et fait essayer les versions de test (dossier statique + zip)',
  dimensions, entetes,
  async faire(C) {
    const SRC = path.join(C.RACINE, SRC_REL), OUT = path.join(C.SORTIE, 'site'), CAP = path.join(C.SORTIE, '.site-captures');
    const S = JSON.parse(fs.readFileSync(path.join(SRC, 'site.json'), 'utf8'));
    const w = require('./web.js').faire(C), J = w.J;
    // 1. les captures et les icônes (un navigateur, seulement quand le jeu a changé)
    let K = fs.existsSync(path.join(CAP, 'captures.json')) ? JSON.parse(fs.readFileSync(path.join(CAP, 'captures.json'), 'utf8')) : null;
    if (!K || K.version !== J.version || process.env.SITE_CAPTURES === '1' || !fs.existsSync(path.join(CAP, 'icone-512.png'))) {
      console.log(`  captures et icônes, prises en jouant la ${J.numero} (plateformes/sortie/.site-captures/)`);
      K = await require('./site/captures.js').prendre(C, CAP, w.page);
      if (K.erreurs.length) throw new Error('ÉCART site : erreurs pendant les captures — ' + K.erreurs.slice(0, 2).join(' | '));
    } else console.log(`  captures de la ${K.numero} reprises (plateformes/sortie/.site-captures/ ; SITE_CAPTURES=1 pour les refaire)`);
    fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
    const poser = (rel, donnees) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, donnees); return f; };

    // 2. les polices : celles du site, servies par lui (polices.json : leurs empreintes contrôlées), et leurs licences
    const PO = C.lirePolices(), prises = PO.fichiers.filter(f => FAMILLES.includes(f.famille));
    prises.forEach(f => poser('polices/' + f.fichier, f.donnees));
    [...new Set(prises.map(f => f.famille))].forEach(fam => { const l = 'LICENCE-' + fam.toLowerCase().replace(/\s+/g, '') + '.txt'; poser('polices/' + l, fs.readFileSync(path.join(C.POLICES, l))); });
    const faces = prises.map(f => `@font-face{font-family:'${f.famille}';font-style:${f.style};font-weight:${f.graisse};font-display:swap;src:url(polices/${f.fichier}) format('woff2');unicode-range:${f.unicodeRange};}`).join('\n');
    poser('site.css', '/* polices du jeu, réduites à ses caractères, servies par le site (licences : polices/LICENCE-*.txt) */\n' + faces + '\n' + fs.readFileSync(path.join(SRC, 'site.css'), 'utf8'));

    // 3. les images : les captures employées, le logo du soutien (octet pour octet), les icônes
    const logo = fs.readFileSync(path.join(C.RACINE, P.SOUTIEN_LOGO)), [lw, lh] = dimensions(logo);
    poser('img/' + path.basename(P.SOUTIEN_LOGO), logo);
    for (const n of ['icone-192.png', 'apple-touch-icon.png']) poser('img/' + n, fs.readFileSync(path.join(CAP, n)));
    const vues = Object.fromEntries(K.vues.map(v => [v.nom, v])), employees = new Set();
    const img = (nom, app, racine, o) => { const v = vues[nom]; if (!v) throw new Error('ÉCART site : capture inconnue ' + nom);
      const f = `${nom}-${app}.jpg`, b = fs.readFileSync(path.join(CAP, f)), [iw, ih] = dimensions(b); employees.add(f);
      return `<img src="${racine}img/${f}" alt="${esc(v.alt)}" width="${iw}" height="${ih}"${o && o.tot ? '' : ' loading="lazy"'} decoding="async">`; };

    // 4. l'APK de test, s'il est fait (plateformes/sortie/android/, par la cible android)
    let apk = null; const dosA = path.join(C.SORTIE, 'android');
    const apks = fs.existsSync(dosA) ? fs.readdirSync(dosA).filter(f => /^isnad-[\d.]+-test\.apk$/.test(f)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })) : [];
    if (apks.length) { const nom = apks.pop(), b = fs.readFileSync(path.join(dosA, nom)); poser('telechargements/' + nom, b);
      apk = { nom, octets: b.length, taille: taille(b.length), sha256: C.sha256(b), numero: nom.match(/^isnad-([\d.]+)-test/)[1] }; }

    // 5. jouer/ : le paquet web, rendu installable
    const lignesW = w.html.split('\n'), it = lignesW.findIndex(l => /^<title>/.test(l));
    if (it < 0) throw new Error('ÉCART site : le paquet web n’a pas de ligne <title>');
    const ajout = AJOUT_JOUER(S.indexable), jouer = [...lignesW.slice(0, it + 1), ...ajout, ...lignesW.slice(it + 1)].join('\n');
    const scripts = [...jouer.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    if (scripts.length !== 1) throw new Error(`ÉCART site : le jeu devait avoir un seul script en ligne (${scripts.length})`);
    const hashJeu = crypto.createHash('sha256').update(scripts[0][1], 'utf8').digest('base64');
    poser('jouer/index.html', jouer);
    const VERSION = J.numero + '-' + C.sha256(Buffer.from(jouer)).slice(0, 12);
    poser('jouer/sw.js', fs.readFileSync(path.join(SRC, 'jouer/sw.js'), 'utf8').replace(/\{\{VERSION\}\}/g, VERSION));
    poser('jouer/enregistrer.js', fs.readFileSync(path.join(SRC, 'jouer/enregistrer.js')));
    const jsonv = v => JSON.stringify(String(v)).slice(1, -1);
    poser('jouer/manifest.webmanifest', fs.readFileSync(path.join(SRC, 'jouer/manifest.webmanifest'), 'utf8').replace(/\{\{([\w.]+)\}\}/g, (m, k) => jsonv(valeur({ P, description: `${P.SOUS_TITRE}. ${P.ETAT}.` }, k))));
    for (const n of ['icone-192.png', 'icone-512.png', 'icone-masquable-512.png', 'apple-touch-icon.png']) poser('jouer/' + n, fs.readFileSync(path.join(CAP, n)));

    // 6. les pages, langue par langue
    const gabarit = fs.readFileSync(path.join(SRC, 'gabarit.html'), 'utf8'), pages = [];
    const i0 = P.SOUTIEN.lastIndexOf(P.SOUTIEN_NOM), soutienHtml = i0 > 0 ? esc(P.SOUTIEN.slice(0, i0).trim()) + ' <b>' + esc(P.SOUTIEN_NOM) + '</b>' : esc(P.SOUTIEN);
    for (const L of S.langues) {
      const dosL = path.join(SRC, L.code), t = JSON.parse(fs.readFileSync(path.join(dosL, 'textes.json'), 'utf8'));
      for (const f of fs.readdirSync(dosL).filter(f => /\.html$/.test(f)).sort()) {
        const src = fs.readFileSync(path.join(dosL, f), 'utf8'), m = src.match(/^<!--meta (\{[\s\S]*?\}) -->\n/);
        if (!m) throw new Error(`ÉCART site : ${L.code}/${f} n’a pas son en-tête <!--meta {…} -->`);
        const meta = JSON.parse(m[1]), sortie = (L.dossier ? L.dossier + '/' : '') + meta.sortie, prof = sortie.split('/').length - 1;
        const racine = meta.absolu ? '/' : prof ? '../'.repeat(prof) : './', base = racine + (L.dossier ? L.dossier + '/' : '');
        const ctx = { P, t, numero: J.numero, langue: L.code, dir: L.dir, racine, base, page: meta.page, indexable: !!S.indexable,
          testflight: S.testflight || '', itch: S.itch || '', apk, ['ici_' + meta.page]: true };
        const aides = {
          SAGAS: () => ['abubakr', 'umar', 'khalid', 'uthman', 'ali'].map(id => { const g = K.sagas[id]; if (!g) throw new Error('ÉCART site : saga absente des captures ' + id);
            return `    <p class="saga"><span class="saga-nom">${esc(g.nom)}</span><span class="saga-meta">${LE[g.lumiere] || 'la'} ${esc(g.lumiere)} · ${esc(g.annees)}</span><span class="saga-phrase">${esc(g.phrase)}</span></p>`; }).join('\n'),
          IMG: a => { const [n, app] = a.split(':'); return img(n, app, racine, { tot: n === 'titre' }); },
          GALERIE: a => { const [app, L2] = a.split(':'); return L2.split(',').map(n => `    <figure>${img(n, app, racine)}<figcaption>${esc(vues[n].legende)}</figcaption></figure>`).join('\n'); },
          LOGO: () => `<img class="logo" src="${racine}img/${path.basename(P.SOUTIEN_LOGO)}" alt="Logo de l’Institut Islam Actuel" width="${lw}" height="${lh}" loading="lazy" decoding="async">`,
          SOUTIEN_HTML: () => soutienHtml };
        const corps = rendre(src.slice(m[0].length), ctx, aides).trimEnd();
        const champs = Object.fromEntries(['titre', 'description'].map(k => [k, rendre(meta[k], ctx, null, true)]));
        const html = rendre(gabarit, Object.assign({}, ctx, champs), {}).replace('{{CORPS}}', () => corps);
        if (/\{\{|\}\}/.test(html)) throw new Error(`ÉCART site : un champ reste à remplir dans ${sortie} — ` + (html.match(/\{\{[^}]*\}\}/) || [''])[0]);
        poser(sortie, html); pages.push(sortie);
      }
    }
    for (const f of employees) poser('img/' + f, fs.readFileSync(path.join(CAP, f)));

    // 7. les en-têtes, robots.txt
    const H = entetes(S, hashJeu);
    poser('_headers', H.texte);
    poser('robots.txt', S.indexable ? 'User-agent: *\nAllow: /\n' : '# le site ne demande pas d’être indexé tant que le décideur ne l’a pas décidé (plateformes/site/site.json : indexable)\nUser-agent: *\nDisallow: /\n');

    // 8. les contrôles de l'assemblage
    const tous = lister(OUT), textes = pages.map(p => fs.readFileSync(path.join(OUT, p), 'utf8'));
    const dehors = textes.flatMap(h => C.ressourcesDehors(h)).concat(C.ressourcesDehors(fs.readFileSync(path.join(OUT, 'site.css'), 'utf8')));
    if (dehors.length) throw new Error('ÉCART site : une ressource est appelée au-dehors — ' + dehors.slice(0, 3).join(' | '));
    const interdits = ['c2FpbnQtZXh1cA==', 'c2FpbnQgZXh1cA==', 'c2NoZWxlcg=='].map(x => Buffer.from(x, 'base64').toString());   // exigences 14 et 24 : comparés, jamais écrits
    const nus = textes.map(h => h.replace(/<[^>]+>/g, ' ').toLowerCase());
    if (nus.some(h => interdits.some(n => h.includes(n)))) throw new Error('ÉCART site : un auteur que le jeu ne nomme pas est nommé');
    const reserve = esc(P.RESERVE); if (!textes.every(h => h.includes(reserve))) throw new Error('ÉCART site : une page n’a pas la réserve');
    const ajoutOk = jouer.split('\n').filter((l, i, T) => !ajout.includes(l)).join('\n') === w.html;
    if (!ajoutOk) throw new Error('ÉCART site : jouer/index.html diffère du paquet web ailleurs que dans ses lignes ajoutées');
    if (C.sha256(fs.readFileSync(path.join(OUT, 'img', path.basename(P.SOUTIEN_LOGO)))) !== C.sha256(logo)) throw new Error('ÉCART site : le logo n’est pas celui fourni');

    // 9. le zip, à côté du dossier (les mêmes fichiers, datés de l'assemblage du jeu)
    const zip = C.zip(tous.map(f => ({ nom: f, donnees: fs.readFileSync(path.join(OUT, f)) })), C.dateDuJeu(J));
    const fz = path.join(C.SORTIE, `isnad-site-${J.numero}.zip`); fs.writeFileSync(fz, zip);
    const octets = tous.reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
    console.log(`✓ site — ${path.relative(C.RACINE, OUT)}/ : ${tous.length} fichiers, ${C.mo(octets)} ; ${pages.length} pages (${pages.join(', ')}) ; jouer/ : le paquet web et ${ajout.length} lignes dans <head> ; ` +
      (apk ? `APK ${apk.nom} (${apk.taille})` : 'pas d’APK : la page dit « bientôt »') + ` ; TestFlight : ${S.testflight ? 'oui' : '« bientôt »'} ; ${S.indexable ? 'indexable' : 'noindex'}`);
    console.log(`✓ site — ${path.relative(C.RACINE, fz)} : ${C.mo(zip.length)}, ${tous.length} entrées`);
    const fait = { page: path.join(OUT, 'index.html'), dossier: OUT, zipSite: fz, fichiers: tous, pages, J, S, apk, VERSION, hashJeu, entetes: H, ajout };
    // « essai site » : l'essai propre au site (le répartiteur appelle sinon l'essai d'un paquet de jeu, qui ne s'y applique pas)
    const a = process.argv.slice(2);
    if (a[0] === 'essai' && a[1] === 'site') { const n = await require('./site/essai.js')(C, fait); process.exit(n ? 1 : 0); }
    return fait;
  }
};
