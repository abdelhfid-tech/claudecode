/* ISNAD 2.x — plateformes : retélécharger et réduire les polices (node v2/tools/plateformes.js polices).
   Décision du décideur (25 novembre) : « Les polices : embarquées, réduites aux caractères que le jeu emploie ».
   1. La feuille que le jeu demande (sa ligne <link>, lue dans le jeu assemblé) est demandée à Google Fonts avec l'agent
      d'un navigateur récent : elle rend du woff2, en tranches (latin, latin-ext, arabic…), chacune avec son unicode-range.
   2. Chaque tranche est téléchargée, puis réduite (fontTools, pyftsubset : toutes les fonctions de mise en forme gardées —
      l'arabe se lie et se vocalise) aux caractères voulus : tous ceux du jeu assemblé et de v2/src/lang/**, l'ASCII, le
      Latin-1, le Latin étendu A, la ponctuation générale, et, pour les polices arabes, le bloc arabe (U+0600–06FF) et les
      formes de présentation B (U+FE70–FEFC). Une tranche qui n'en garde aucun est laissée.
   3. On garde l'ordre et le découpage de Google : le navigateur choisit la même tranche pour chaque caractère, avec ou sans
      réseau, et la mise en page ne change pas.
   4. La licence de chaque famille est relevée à la source (le dépôt google/fonts, ofl/<famille>/OFL.txt), comparée à ce
      que la police déclare elle-même (table « name », champs 13 et 14), et écrite à côté.
   Sortie : plateformes/polices/*.woff2, LICENCE-*.txt, polices.json. Rien d'autre n'a besoin du réseau. */
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const C = require('./commun.js');

const AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const ARABES = ['Amiri', 'Amiri Quran', 'Noto Naskh Arabic', 'Reem Kufi'];
const DEPOT = { 'Alegreya': 'alegreya', 'Amiri': 'amiri', 'Cinzel': 'cinzel', 'Reem Kufi': 'reemkufi', 'Share Tech Mono': 'sharetechmono', 'Noto Naskh Arabic': 'notonaskharabic', 'Amiri Quran': 'amiriquran' };
const LICENCE_URL = d => `https://raw.githubusercontent.com/google/fonts/main/ofl/${d}/OFL.txt`;

const telecharger = (url, vers) => execFileSync('curl', ['-sS', '--fail', '-L', '--retry', '2', '-A', AGENT, '-o', vers, url], { stdio: ['ignore', 'ignore', 'inherit'] });
const lirePlages = r => r.split(',').flatMap(x => { const m = x.trim().match(/^U\+([0-9A-F]+)(?:-([0-9A-F]+))?$/i); return m ? plage(parseInt(m[1], 16), parseInt(m[2] || m[1], 16)) : []; });
const plage = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };

// les caractères du jeu : le jeu assemblé, et chaque texte des langues (les JSON lus, pour leurs \u…)
function caracteresDuJeu(J) {
  const S = new Set(), mettre = t => { for (const c of t) S.add(c.codePointAt(0)); };
  mettre(J.html);
  const parcourir = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
    const f = path.join(d, e.name); if (e.isDirectory()) return parcourir(f);
    const t = fs.readFileSync(f, 'utf8'); mettre(t);
    if (/\.json$/.test(e.name)) { const tout = v => (typeof v === 'string' ? mettre(v) : v && typeof v === 'object' ? Object.entries(v).forEach(([k, x]) => { mettre(k); tout(x); }) : 0); try { tout(JSON.parse(t)); } catch (x) { /* lu tel quel */ } }
  });
  parcourir(path.join(C.V2, 'src/lang'));
  return S;
}

// la feuille de Google : une entrée par tranche, dans l'ordre de la feuille
function lireFeuille(css) {
  const L = [], re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g; let m;
  while ((m = re.exec(css))) {
    const b = m[2], v = k => ((b.match(new RegExp(k + ':\\s*([^;]+);')) || [])[1] || '').trim();
    L.push({ tranche: m[1], famille: v('font-family').replace(/['"]/g, ''), style: v('font-style'), graisse: v('font-weight'), source: (b.match(/url\(([^)]+)\)/) || [])[1], unicodeRangeGoogle: v('unicode-range') });
  }
  return L;
}

module.exports = function polices() {
  const J = C.lireJeu(), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'isnad-polices-')), script = path.join(__dirname, 'reduire.py');
  console.log(`· la feuille du jeu ${J.numero} : ${J.feuille.slice(0, 90)}…`);
  const fc = path.join(tmp, 'feuille.css'); telecharger(J.feuille, fc);
  const faces = lireFeuille(fs.readFileSync(fc, 'utf8'));
  if (!faces.length || faces.some(f => !/\.woff2$/.test(f.source || ''))) throw new Error('la feuille rendue n’est pas en woff2 (agent du navigateur ?)');
  const jeu = caracteresDuJeu(J), base = new Set([...plage(0x20, 0x7e), ...plage(0xa0, 0xff), ...plage(0x100, 0x17f), ...plage(0x2000, 0x206f), ...jeu]);
  const arabe = new Set([...base, ...plage(0x600, 0x6ff), ...plage(0xfe70, 0xfefc)]);
  const ecrireListe = (S, f) => fs.writeFileSync(f, [...S].map(c => 'U+' + c.toString(16)).join('\n'));
  console.log(`· ${faces.length} tranches ; ${jeu.size} caractères distincts dans le jeu et ses langues`);
  // on vide le dossier des polices (les licences sont réécrites plus bas)
  fs.mkdirSync(C.POLICES, { recursive: true });
  fs.readdirSync(C.POLICES).filter(f => /\.(woff2|txt|json)$/.test(f)).forEach(f => fs.unlinkSync(path.join(C.POLICES, f)));
  const fichiers = [], laissees = [];
  faces.forEach((f, i) => {
    const brut = path.join(tmp, `t${i}.woff2`); telecharger(f.source, brut);
    const nom = `${DEPOT[f.famille]}-${f.graisse}${f.style === 'italic' ? '-italique' : ''}-${f.tranche}.woff2`, sortie = path.join(C.POLICES, nom);
    // ce que la tranche sert chez Google (son unicode-range) ∩ les caractères voulus : la même tranche pour le même caractère
    const voulus = ARABES.includes(f.famille) ? arabe : base, lt = path.join(tmp, `t${i}.txt`);
    ecrireListe(new Set(lirePlages(f.unicodeRangeGoogle).filter(c => voulus.has(c))), lt);
    const info = JSON.parse(execFileSync('python3', ['-I', script, brut, sortie, lt], { encoding: 'utf8', maxBuffer: 64e6 }));
    const b0 = fs.readFileSync(brut); f.octets0 = b0.length;
    const avant = { octets: b0.length, sha256: C.sha256(b0), caracteres: info.avant.length };
    if (!info.garde.length) { laissees.push(`${f.famille} ${f.graisse} ${f.style} ${f.tranche}`); return; }
    const b = fs.readFileSync(sortie);
    fichiers.push({ famille: f.famille, graisse: f.graisse, style: f.style, tranche: f.tranche, fichier: nom, octets: b.length, sha256: C.sha256(b), caracteres: info.garde.length,
      unicodeRange: C.plages(info.garde), source: f.source, unicodeRangeGoogle: f.unicodeRangeGoogle, avant, licencePolice: info.licence, urlLicencePolice: info.urlLicence, copyright: info.copyright });
  });
  // les licences, à la source
  const licences = {};
  for (const fam of [...new Set(faces.map(f => f.famille))]) {
    const nom = `LICENCE-${DEPOT[fam]}.txt`, dest = path.join(C.POLICES, nom); telecharger(LICENCE_URL(DEPOT[fam]), dest);
    const t = fs.readFileSync(dest, 'utf8'), ofl = /SIL OPEN FONT LICENSE\s+Version 1\.1/i.test(t);
    const declare = fichiers.find(x => x.famille === fam) || {};
    const accord = /SIL Open Font License, Version 1\.1/i.test(declare.licencePolice || '') || /OFL|openfontlicense|scripts\.sil\.org/i.test((declare.licencePolice || '') + (declare.urlLicencePolice || ''));
    if (!ofl) throw new Error(`la licence de ${fam} relevée à la source n’est pas l’OFL 1.1 : ${LICENCE_URL(DEPOT[fam])}`);
    licences[fam] = { fichier: nom, source: LICENCE_URL(DEPOT[fam]), sha256: C.sha256(t), titre: 'SIL Open Font License, Version 1.1', copyright: (t.split('\n').find(l => /Copyright/i.test(l)) || '').trim(),
      declareeParLaPolice: (declare.licencePolice || '').slice(0, 300), urlDeclaree: declare.urlLicencePolice || '', accord };
  }
  const P = { jeu: J.numero, feuille: J.feuille, agent: AGENT, quand: new Date().toISOString().slice(0, 10),
    regle: 'caractères du jeu assemblé et de v2/src/lang/** ∪ U+0020–007E ∪ U+00A0–00FF ∪ U+0100–017F ∪ U+2000–206F ; polices arabes : ∪ U+0600–06FF ∪ U+FE70–FEFC ; toutes les fonctions de mise en forme gardées (pyftsubset --layout-features=*)',
    outil: 'fontTools ' + execFileSync('python3', ['-I', '-c', 'import fontTools; print(fontTools.version)'], { encoding: 'utf8' }).trim(),
    licences, laissees, fichiers };
  fs.writeFileSync(path.join(C.POLICES, 'polices.json'), JSON.stringify(P, null, 1) + '\n');
  fs.rmSync(tmp, { recursive: true, force: true });
  // le bilan, par famille
  const parFace = {};
  fichiers.forEach(f => { const k = `${f.famille} ${f.graisse}${f.style === 'italic' ? ' italique' : ''}`; const e = parFace[k] = parFace[k] || { avant: 0, gardees: 0, apres: 0, n: 0, t: 0 }; e.apres += f.octets; e.n++; });
  faces.forEach(f => { const k = `${f.famille} ${f.graisse}${f.style === 'italic' ? ' italique' : ''}`; const e = parFace[k] = parFace[k] || { avant: 0, gardees: 0, apres: 0, n: 0, t: 0 }; e.avant += f.octets0; e.t++; if (fichiers.some(y => y.source === f.source)) e.gardees += f.octets0; });
  Object.entries(parFace).forEach(([k, e]) => console.log(`  ${k.padEnd(28)} ${e.t} tranche(s) chez Google, ${C.ko(e.avant)} ; ${e.n} gardée(s) : ${C.ko(e.gardees)} → ${C.ko(e.apres)}`));
  console.log(`  tranches laissées (aucun caractère voulu) : ${laissees.length} — ${laissees.join(' · ')}`);
  Object.entries(licences).forEach(([k, l]) => console.log(`  licence ${k} : ${l.titre} (à la source) ; la police la déclare ${l.accord ? 'aussi' : '— ÉCART : autre chose'}`));
  const tot = fichiers.reduce((s, f) => s + f.octets, 0);
  console.log(`✓ ${fichiers.length} fichiers, ${C.ko(tot)} — plateformes/polices/polices.json`);
  return P;
};
