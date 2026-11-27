/* ISNAD 2.x — plateformes : l'atelier de l'application (Android, iOS), partagé par android.js et ios.js.
   Ce dossier n'est pas une cible (le répartiteur ne charge que les fichiers .js de v2/tools/plateformes/).
   · pageApplication : le paquet web (web.js) auquel s'ajoute, avant </head>, une seule insertion — le moteur JS de
     Capacitor (@capacitor/core, licence MIT, inerte hors d'une application) et le pont (plateformes/application/pont.js).
     Rien d'autre ne change : ôter l'insertion redonne le paquet web, octet pour octet (contrôlé ici, puis dans l'APK).
   · poserWww, cap : la page dans plateformes/application/www/, puis « npx cap sync <plateforme> » ;
   · versions : le numéro du jeu (2.47) devient versionName "2.47" / versionCode 247 (Android), MARKETING_VERSION 2.47 /
     CURRENT_PROJECT_VERSION 247 (iOS) ;
   · rendre : les PNG de l'icône et de l'écran de lancement, dessinés par plateformes/application/icone/icone.js et rendus
     dans Chromium (Playwright) ; un PNG sans couche alpha quand il le faut (l'icône d'iOS).
   Le jeu n'est pas modifié. */
const fs = require('fs'), path = require('path'), zlib = require('zlib'), { spawnSync } = require('child_process');

const APP = path.join(__dirname, '..', '..', '..', '..', 'plateformes', 'application');
const ANCRES = ['const I = window.ISNAD = {', 'const U = I.ui = {', 'U.boot = function', 'window.claude.hot.ready(function () { ISNAD.ui.boot(); }) : ISNAD.ui.boot();'];

function versionsFigees() {
  const L = JSON.parse(fs.readFileSync(path.join(APP, 'package-lock.json'), 'utf8')).packages, v = {};
  Object.keys(L).filter(k => /^node_modules\/@capacitor\/[a-z-]+$/.test(k)).forEach(k => { v[k.replace('node_modules/', '')] = L[k].version; });
  return v;
}

function installer() {
  const nm = path.join(APP, 'node_modules', '@capacitor', 'core', 'dist', 'capacitor.js');
  if (fs.existsSync(nm)) return;
  console.log('  (npm ci : les versions figées de plateformes/application/package-lock.json)');
  const r = spawnSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: APP, stdio: 'inherit' });
  if (r.status !== 0) throw new Error('npm ci a échoué dans plateformes/application');
}

// la page de l'application : le paquet web + une insertion (Capacitor, le pont)
function pageApplication(C) {
  installer();
  const w = require('../web.js').faire(C);
  const manque = ANCRES.filter(a => w.html.split(a).length !== 2);
  if (manque.length) throw new Error('ÉCART application : le jeu n’a plus la forme que le pont attend (une fois chacune) — ' + manque.join(' | '));
  const v = versionsFigees();
  const core = fs.readFileSync(path.join(APP, 'node_modules/@capacitor/core/dist/capacitor.js'), 'utf8').replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, '\n');
  const pont = fs.readFileSync(path.join(APP, 'pont.js'), 'utf8');
  for (const [n, t] of [['capacitor.js', core], ['pont.js', pont]]) if (/<\/script|<!--/i.test(t)) throw new Error(`ÉCART application : ${n} contient « </script » ou « <!-- »`);
  const insertion = `<script id="isnad-capacitor">/* @capacitor/core ${v['@capacitor/core']} (licence MIT) — le pont vers les greffons natifs de l'application ; inerte hors d'elle */\n${core.trim()}\n</script>\n<script id="isnad-pont">\n${pont.trim()}\n</script>\n`;
  const i = w.html.indexOf('</head>');
  if (i < 0 || w.html.indexOf('</head>', i + 1) >= 0 || w.html.indexOf('<script>') < i) throw new Error('ÉCART application : </head> introuvable, en double, ou après le script du jeu');
  const html = w.html.slice(0, i) + insertion + w.html.slice(i);
  if (html.split(insertion).join('') !== w.html) throw new Error('ÉCART application : ôter l’insertion ne redonne pas le paquet web');
  const dehors = C.ressourcesDehors(html);
  if (dehors.length) throw new Error('ÉCART application : une ressource au-dehors — ' + dehors.join(' | '));
  return { w, J: w.J, html, insertion, versions: v };
}

function poserWww(html) {
  const www = path.join(APP, 'www'); fs.rmSync(www, { recursive: true, force: true }); fs.mkdirSync(www, { recursive: true });
  fs.writeFileSync(path.join(www, 'index.html'), html); return path.join(www, 'index.html');
}

function cap(args) {
  const r = spawnSync(path.join(APP, 'node_modules', '.bin', 'cap'), args, { cwd: APP, encoding: 'utf8' });
  const sortie = (r.stdout || '') + (r.stderr || '');
  if (r.status !== 0) { console.log(sortie); throw new Error('npx cap ' + args.join(' ') + ' a échoué'); }
  return sortie;
}

// 2.47 → { nom: '2.47', code: 247 } (la 2.x avance par centièmes : deux chiffres après le point)
function numeros(J) {
  const m = String(J.numero).match(/^(\d+)\.(\d{2})$/);
  if (!m) throw new Error(`le numéro du jeu (${J.numero}) n’a pas la forme 2.47 : versionCode impossible à tirer`);
  return { nom: J.numero, code: +m[1] * 100 + +m[2] };
}

// remplace dans un fichier, et dit si quelque chose a changé ; chaque motif doit être trouvé
function remplacer(fichier, paires) {
  const avant = fs.readFileSync(fichier, 'utf8'); let s = avant;
  for (const [re, par] of paires) { if (!re.test(s)) throw new Error(`motif introuvable dans ${path.relative(APP, fichier)} : ${re}`); s = s.replace(re, par); }
  if (s !== avant) fs.writeFileSync(fichier, s);
  return s !== avant;
}

/* ---------- PNG : ôter la couche alpha (8 bits, sans entrelacement : ce que rend Chromium) ---------- */
function pngSansAlpha(buf) {
  const sig = buf.slice(0, 8); let p = 8, ihdr = null; const idat = [];
  while (p < buf.length) { const n = buf.readUInt32BE(p), t = buf.slice(p + 4, p + 8).toString('latin1'), d = buf.slice(p + 8, p + 8 + n); if (t === 'IHDR') ihdr = d; else if (t === 'IDAT') idat.push(d); p += 12 + n; }
  const w = ihdr.readUInt32BE(0), h = ihdr.readUInt32BE(4), prof = ihdr[8], type = ihdr[9], entre = ihdr[12];
  if (prof !== 8 || entre !== 0 || (type !== 6 && type !== 2)) throw new Error(`PNG inattendu (profondeur ${prof}, type ${type}, entrelacement ${entre})`);
  const bpp = type === 6 ? 4 : 3, brut = zlib.inflateSync(Buffer.concat(idat)), L = w * bpp, px = Buffer.alloc(h * L);
  for (let y = 0; y < h; y++) {
    const f = brut[y * (L + 1)], src = brut.slice(y * (L + 1) + 1, (y + 1) * (L + 1)), o = y * L;
    for (let x = 0; x < L; x++) {
      const a = x >= bpp ? px[o + x - bpp] : 0, b = y ? px[o - L + x] : 0, c = (y && x >= bpp) ? px[o - L + x - bpp] : 0;
      let v = src[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c); v += (pa <= pb && pa <= pc) ? a : pb <= pc ? b : c; }
      px[o + x] = v & 255;
    }
  }
  const rgb = Buffer.alloc(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const s = y * L + x * bpp, d = y * (w * 3 + 1) + 1 + x * 3; rgb[d] = px[s]; rgb[d + 1] = px[s + 1]; rgb[d + 2] = px[s + 2]; }
  const bloc = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t, 'latin1'), d]), c = Buffer.alloc(4); c.writeUInt32BE(zlib.crc32(td) >>> 0); return Buffer.concat([l, td, c]); };
  const nh = Buffer.alloc(13); nh.writeUInt32BE(w, 0); nh.writeUInt32BE(h, 4); nh[8] = 8; nh[9] = 2;
  return Buffer.concat([sig, bloc('IHDR', nh), bloc('IDAT', zlib.deflateSync(rgb, { level: 9 })), bloc('IEND', Buffer.alloc(0))]);
}
const pngTaille = b => [b.readUInt32BE(16), b.readUInt32BE(20)];
const pngAlpha = b => b[25] === 6 || b[25] === 4;

/* ---------- les images : l'icône et l'écran de lancement ----------
   liste : [{ fichier, l, h, sorte: 'icone' | 'rond' | 'premier-plan' | 'lancement', alpha: false? }]
   N'écrit un fichier que s'il change (les PNG sont versionnés avec le projet). */
async function rendre(liste) {
  const I = require(path.join(APP, 'icone', 'icone.js')), { chromium } = require('playwright');
  const b = await chromium.launch(); let changes = 0;
  try {
    const p = await b.newPage({ deviceScaleFactor: 1 });
    for (const x of liste) {
      const fond = x.sorte === 'premier-plan' ? 'aucun' : 'encre';
      let corps;
      if (x.sorte === 'lancement') { const c = Math.round(Math.min(x.l, x.h) * 0.34); corps = `<div style="width:${x.l}px;height:${x.h}px;background:${I.COULEURS.encre};display:flex;align-items:center;justify-content:center">${I.svg({ fond: 'aucun', plein: false, cote: c })}</div>`; }
      else corps = `<div style="width:${x.l}px;height:${x.h}px;${x.sorte === 'rond' ? 'border-radius:50%;overflow:hidden;' : ''}">${I.svg({ fond, plein: x.sorte === 'rond' ? 'rond' : x.sorte !== 'premier-plan', cote: x.l })}</div>`;
      await p.setViewportSize({ width: x.l, height: x.h });
      await p.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${corps}</body></html>`);
      let png = await p.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: x.l, height: x.h } });
      if (x.alpha === false) png = pngSansAlpha(png);
      fs.mkdirSync(path.dirname(x.fichier), { recursive: true });
      if (!fs.existsSync(x.fichier) || !fs.readFileSync(x.fichier).equals(png)) { fs.writeFileSync(x.fichier, png); changes++; }
    }
  } finally { await b.close(); }
  return changes;
}

// un fichier (ou un dossier, récursivement) → entrées de zip, chemins relatifs à « base », préfixés
function entrees(base, rel, prefixe, exclure) {
  const L = [], abs = path.join(base, rel);
  const aller = r => { const a = path.join(base, r), st = fs.statSync(a);
    if (exclure && exclure(r)) return;
    if (st.isDirectory()) fs.readdirSync(a).sort().forEach(n => aller(path.join(r, n)));
    else L.push({ nom: prefixe + r.split(path.sep).join('/'), donnees: fs.readFileSync(a) }); };
  if (fs.existsSync(abs)) aller(rel);
  return L;
}

module.exports = { APP, ANCRES, versionsFigees, installer, pageApplication, poserWww, cap, numeros, remplacer, pngSansAlpha, pngTaille, pngAlpha, rendre, entrees };
