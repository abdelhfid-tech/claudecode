/* ISNAD 2.x — plateformes : ce que toutes les cibles partagent.
   · lire le jeu assemblé (v2/index.html, ou JEU_SOURCE=…) et son numéro ;
   · poser les polices : la ligne <link> de Google Fonts devient des @font-face en data: (woff2), lus dans
     plateformes/polices/ (polices.json, leurs empreintes contrôlées) — sans réseau ;
   · écrire une sortie dans plateformes/sortie/<cible>/ ; faire un zip (sans dépendance) ;
   · les contrôles communs : seule la ligne des polices diffère du jeu, aucune ressource hors du fichier.
   Le jeu n'est pas modifié : on lit v2/index.html, on écrit à côté. */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib');

const V2 = path.join(__dirname, '..', '..'), RACINE = path.join(V2, '..');
const DOSSIER = path.join(RACINE, 'plateformes'), POLICES = path.join(DOSSIER, 'polices'), SORTIE = path.join(DOSSIER, 'sortie');
const JEU = path.resolve(RACINE, process.env.JEU_SOURCE || 'v2/index.html');
const LIEN = /^\s*<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)">\s*$/;

const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
const mo = n => (n / 1e6).toFixed(2) + ' Mo', ko = n => (n / 1024).toFixed(1) + ' Ko';

// le jeu assemblé : son texte, ses lignes, la ligne des polices, son numéro
function lireJeu() {
  const html = fs.readFileSync(JEU, 'utf8'), lignes = html.split('\n');
  const ou = lignes.map((l, i) => (LIEN.test(l) ? i : -1)).filter(i => i >= 0);
  if (ou.length !== 1) throw new Error(`le jeu assemblé (${path.relative(RACINE, JEU)}) n’a pas exactement une ligne de polices Google (${ou.length})`);
  const m = html.match(/ISNAD_VERSION = "([0-9]+\.[0-9]+)[^"]*"/);
  if (!m) throw new Error('le numéro du jeu (window.ISNAD_VERSION) est introuvable dans le jeu assemblé');
  const build = (fs.readFileSync(path.join(V2, 'tools/build.js'), 'utf8').match(/const NUMERO = '([^']+)'/) || [])[1];
  return { html, lignes, ligne: ou[0], feuille: lignes[ou[0]].match(LIEN)[1].replace(/&amp;/g, '&'), numero: m[1], version: html.match(/ISNAD_VERSION = "([^"]*)"/)[1], build, chemin: JEU };
}

// les polices réduites : polices.json, chaque fichier contrôlé par son empreinte
function lirePolices() {
  const fj = path.join(POLICES, 'polices.json');
  if (!fs.existsSync(fj)) throw new Error('plateformes/polices/polices.json manque : node v2/tools/plateformes.js polices');
  const P = JSON.parse(fs.readFileSync(fj, 'utf8'));
  for (const f of P.fichiers) {
    const b = fs.readFileSync(path.join(POLICES, f.fichier));
    if (b.length !== f.octets || sha256(b) !== f.sha256) throw new Error(`la police ${f.fichier} ne correspond plus à polices.json (octets ou empreinte)`);
    f.donnees = b;
  }
  return P;
}

// unicode-range d'une liste de points de code : des plages compactes
function plages(points) {
  const s = [...new Set(points)].sort((a, b) => a - b), r = []; let i = 0;
  const h = n => n.toString(16).toUpperCase().padStart(4, '0');
  while (i < s.length) { let j = i; while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++; r.push(i === j ? 'U+' + h(s[i]) : `U+${h(s[i])}-${h(s[j])}`); i = j + 1; }
  return r.join(', ');
}

// les @font-face embarqués : mêmes familles, graisses et styles que la feuille de Google, font-display: swap
function feuilleEmbarquee(P) {
  return P.fichiers.map(f => `@font-face{font-family:'${f.famille}';font-style:${f.style};font-weight:${f.graisse};font-display:swap;` +
    `src:url(data:font/woff2;base64,${f.donnees.toString('base64')}) format('woff2');unicode-range:${f.unicodeRange};}`).join('');
}

// le jeu, polices embarquées : seule la ligne <link> change
function poserPolices(J, P) {
  const lignes = J.lignes.slice();
  lignes[J.ligne] = `<style id="isnad-polices">/* polices embarquées, réduites aux caractères du jeu : plateformes/polices/ (licences à côté) */${feuilleEmbarquee(P)}</style>`;
  return lignes.join('\n');
}

// contrôle : seule la ligne des polices diffère
function seuleLaLigneDesPolices(J, html) {
  const b = html.split('\n'), diff = [];
  if (b.length !== J.lignes.length) return { ok: false, mot: `le nombre de lignes change (${J.lignes.length} → ${b.length})` };
  b.forEach((l, i) => { if (l !== J.lignes[i]) diff.push(i + 1); });
  return { ok: diff.length === 1 && diff[0] === J.ligne + 1, mot: `lignes qui diffèrent : ${diff.join(', ') || 'aucune'} (celle des polices : ${J.ligne + 1})` };
}

// contrôle : aucune ressource chargée hors du fichier (balises, url() des styles)
function ressourcesDehors(html) {
  const L = [];
  for (const re of [/<(?:link|script|img|iframe|source|audio|video)\b[^>]*\b(?:href|src)\s*=\s*["']?(https?:)?\/\/[^"'\s>]+/gi, /url\(\s*["']?(?:https?:)?\/\/[^)"']+/gi, /@import\s+["']?(?:url\()?["']?https?:/gi])
    for (const m of html.matchAll(re)) L.push(m[0].slice(0, 120));
  return L;
}

function ecrire(cible, nom, contenu) {
  const dos = path.join(SORTIE, cible); fs.mkdirSync(dos, { recursive: true });
  const f = path.join(dos, nom); fs.writeFileSync(f, contenu); return f;
}

/* un zip sans dépendance : les entrées dans l'ordre donné, compressées (deflate), datées de l'assemblage du jeu
   (le même jeu donne le même zip, octet pour octet) */
function zip(entrees, quand) {
  const d = quand || new Date(1980, 0, 1), heure = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), jour = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const locaux = [], centraux = []; let pos = 0;
  for (const e of entrees) {
    const nom = Buffer.from(e.nom, 'utf8'), brut = Buffer.isBuffer(e.donnees) ? e.donnees : Buffer.from(e.donnees, 'utf8'), comp = zlib.deflateRawSync(brut, { level: 9 }), crc = zlib.crc32(brut);
    const t = Buffer.alloc(30); t.writeUInt32LE(0x04034b50, 0); t.writeUInt16LE(20, 4); t.writeUInt16LE(0x0800, 6); t.writeUInt16LE(8, 8); t.writeUInt16LE(heure, 10); t.writeUInt16LE(jour, 12);
    t.writeUInt32LE(crc >>> 0, 14); t.writeUInt32LE(comp.length, 18); t.writeUInt32LE(brut.length, 22); t.writeUInt16LE(nom.length, 26); t.writeUInt16LE(0, 28);
    locaux.push(t, nom, comp);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(0x0314, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10); c.writeUInt16LE(heure, 12); c.writeUInt16LE(jour, 14);
    c.writeUInt32LE(crc >>> 0, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(brut.length, 24); c.writeUInt16LE(nom.length, 28); c.writeUInt32LE((0o100644 << 16) >>> 0, 38); c.writeUInt32LE(pos, 42);
    centraux.push(c, nom); pos += 30 + nom.length + comp.length;
  }
  const cd = Buffer.concat(centraux), fin = Buffer.alloc(22); fin.writeUInt32LE(0x06054b50, 0); fin.writeUInt16LE(entrees.length, 8); fin.writeUInt16LE(entrees.length, 10); fin.writeUInt32LE(cd.length, 12); fin.writeUInt32LE(pos, 16);
  return Buffer.concat([...locaux, cd, fin]);
}

// lire un zip (le nôtre, ou un autre en deflate/stocké) : ses entrées et leur contenu
function lireZip(buf) {
  let e = buf.length - 22; while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) e--;
  if (e < 0) throw new Error('ce n’est pas un zip');
  const n = buf.readUInt16LE(e + 10); let p = buf.readUInt32LE(e + 16); const L = [];
  for (let i = 0; i < n; i++) {
    const meth = buf.readUInt16LE(p + 10), cl = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28), xl = buf.readUInt16LE(p + 30), kl = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
    const nom = buf.slice(p + 46, p + 46 + nl).toString('utf8'), d0 = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28), brut = buf.slice(d0, d0 + cl);
    L.push({ nom, donnees: meth === 8 ? zlib.inflateRawSync(brut) : brut }); p += 46 + nl + xl + kl;
  }
  return L;
}

// la date d'assemblage du jeu, tirée de son numéro complet (« 2.47 · 2026-11-27 05:18 UTC · … »)
function dateDuJeu(J) { const m = J.version.match(/(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d)/); return m ? new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5]) : new Date(1980, 0, 1); }

module.exports = { V2, RACINE, DOSSIER, POLICES, SORTIE, JEU, sha256, mo, ko, lireJeu, lirePolices, plages, feuilleEmbarquee, poserPolices, seuleLaLigneDesPolices, ressourcesDehors, ecrire, zip, lireZip, dateDuJeu };
