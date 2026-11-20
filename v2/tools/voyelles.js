#!/usr/bin/env node
/* ISNAD 2.x — l'arabe vocalisé (décideur, 20 novembre : « Ou bien arabe / arabe vocalisé »).
   Le texte arabe d'aujourd'hui (src/lang/ar/<fichier>.json, champ t) reste la référence. Sa forme vocalisée est rangée à
   part, sous la même clé, dans src/lang/ar/voyelles/<fichier>.json : une entrée par ligne, { k, fr, t, tv } — t est le
   texte d'où elle a été faite, tv la même chose avec toutes ses voyelles. On n'y écrit QUE des signes : les lettres ne
   changent pas. Le jeu la montre à qui choisit l'arabe vocalisé (src/core/langue.js), tant qu'elle suit son texte.

   Usage : node v2/tools/voyelles.js            contrôle → « VOYELLES CONFORMES » ; code 1 sinon
           node v2/tools/voyelles.js etat       la couverture, fichier par fichier (vocalisés / textes)
           node v2/tools/voyelles.js a-faire <fichier> [motif]   les textes encore sans voyelles ([{ k, fr, t, ou }],
                                                l'emplacement « ou » filtré par le motif, une expression régulière)
           node v2/tools/voyelles.js poser <fichier> <travail.json>   pose ce qu'un rédacteur a vocalisé ([{ k, tv }]) ;
                                                le t est relu dans la liste du jour, et la forme refusée si elle ne le suit pas
                                                (un verrou par fichier : plusieurs rédacteurs peuvent poser en même temps)

   Le contrôle, pour chaque forme vocalisée :
   - « PÉRIMÉ » : le texte arabe a changé depuis (ou a disparu) ; le jeu montre alors le texte tel qu'il est écrit ;
   - « ÉCART » : ôtés ses signes, elle ne redonne pas exactement ses lettres ; ou un signe que le texte porte déjà manque ;
     ou une même clé est vocalisée de deux façons ; ou une parole attestée, un verset, n'est pas recopié du registre
     (v2/docs/sources/) tel qu'il est, seul ou cité au milieu d'un texte — on ne revocalise jamais un texte du registre ;
   - « INCOMPLET » : une lettre arabe sans signe — hors d'une parole citée, de sa source et de ce que le registre donne,
     recopiés tels quels — et hors de ce qui n'en porte pas dans une édition scolaire entièrement
     vocalisée : l'alif (ا ى آ, y compris l'alif waṣla et celui qui suit un tanwîn), la lettre de prolongement (و après
     une damma, ي après une kasra), le lâm « solaire » (devant une lettre à chadda), et ces mots :
       إدريس   le nom que l'arabe donne au râwî : le jeu y pose le nom choisi par le joueur (perso.js), il reste nu ;
       هـ, م   les abréviations des dates (هجرية, ميلادية) ;
       الله, لله… (le Nom, et ses formes avec une préposition) : seule sa dernière lettre porte un signe — la ligature
               et sa chadda viennent de la police, on ne les écrit jamais à la main (ar.md, § 1.7). */
const fs = require('fs'), path = require('path');
const V2 = path.join(__dirname, '..'), LANG = path.join(V2, 'src/lang/ar'), DV = path.join(LANG, 'voyelles'), SOURCES = path.join(V2, 'docs/sources');
const L = require(path.join(V2, 'src/core/langue.js'));

const listes = () => fs.readdirSync(LANG).filter(f => /\.json$/.test(f)).sort().map(f => f.replace(/\.json$/, ''));
const lire = f => { const p = path.join(LANG, f + '.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')).textes || [] : []; };
const lireV = f => { const p = path.join(DV, f + '.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')).textes || [] : []; };
// une entrée par ligne, écrite à côté puis mise en place d'un coup (comme langues.js)
function ecrireV(f, textes) { fs.mkdirSync(DV, { recursive: true }); const p = path.join(DV, f + '.json'), tmp = `${p}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `{ "langue": "ar", "fichier": ${JSON.stringify(f)}, "textes": [\n` + textes.map(x => JSON.stringify(x)).join(',\n') + '\n] }\n'); fs.renameSync(tmp, p); }

/* ---------- le registre : ce qui ne se revocalise pas ---------- */
function registre() {
  const paroles = new Map(), versets = [];
  if (!fs.existsSync(SOURCES)) return { paroles, versets };
  fs.readdirSync(SOURCES).filter(f => /\.json$/.test(f)).forEach(f => JSON.parse(fs.readFileSync(path.join(SOURCES, f), 'utf8')).forEach(x => {
    if (!x.ar || !x.ar.texte) return; if (f === 'versets.json') versets.push(x.ar.texte); else if (x.fr) paroles.set(x.fr, x.ar.texte); }));
  return { paroles, versets };
}

/* ---------- la couverture : chaque lettre porte son signe ---------- */
const MARQUE = /[\u064B-\u0652\u0670]/, LETTRE = /[\u0621-\u063F\u0641-\u064A]/;   // (le tatwîl, U+0640, n’est pas une lettre)
const DAMMA = /[\u064C\u064F]/, KASRA = /[\u064D\u0650]/, CHADDA = '\u0651';
// (les abréviations des dates, هـ et م, une lettre seule, ne se vocalisent pas)
const NUS = new Set(['إدريس', 'ه', 'م']);
const NOM = /^(?:[وفبل]?)(?:ال|ل)له$/;   // الله, والله, بالله, فالله, لله, ولله…
// les mots arabes d'un texte, chacun avec ses lettres et leurs signes
function mots(s) {
  const r = []; let m = null;
  for (const ch of String(s)) {
    if (LETTRE.test(ch)) { if (!m) r.push(m = []); m.push({ c: ch, s: '' }); }
    else if (MARQUE.test(ch) && m) m[m.length - 1].s += ch;
    else if (ch === '\u0640' && m) { /* le tatwîl ne coupe pas un mot */ }
    else m = null;
  }
  return r;
}
// le Nom (الله, et ses formes avec une préposition) : combien de ses dernières lettres sont le Nom lui-même
const coeurDuNom = nu => (!NOM.test(nu) ? 0 : /الله$/.test(nu) ? 4 : 2);
// les lettres d'un mot qui devraient porter un signe et n'en portent pas
function nues(m) {
  const nu = m.map(x => x.c).join('');
  if (NUS.has(nu)) return [];
  const coeur = coeurDuNom(nu);
  if (coeur) { const out = m.slice(0, m.length - coeur).filter(x => !x.s).map(x => x.c); if (!m[m.length - 1].s) out.push(m[m.length - 1].c); return out; }
  const out = [];
  m.forEach((x, i) => {
    if (x.s) return;
    if (/[اىآ]/.test(x.c)) return;   // l'alif (waṣla, de prolongement, après un tanwîn), l'alif maqṣûra, l'alif madda
    const av = i > 0 ? m[i - 1].s : '';
    if (x.c === 'و' && i > 0 && DAMMA.test(av)) return;   // prolongement : ـُو (et le wâw muet de عَمْرٌو)
    if (x.c === 'و' && i === m.length - 1 && /عمرو$/.test(nu) && /[ٌٍ]/.test(av)) return;   // le wâw muet de عَمْرٍو, au génitif
    if (x.c === 'ي' && i > 0 && KASRA.test(av)) return;   // prolongement : ـِي
    if (x.c === 'ل' && i + 1 < m.length && m[i + 1].s.indexOf(CHADDA) >= 0) return;   // le lâm solaire : الشَّمْس, لِلنَّاس
    out.push(x.c);
  });
  return out;
}
// le Nom ne porte, écrit à la main, que le signe de sa dernière lettre (ar.md, § 1.7 : jamais de chadda ajoutée)
const nomCharge = m => { const coeur = coeurDuNom(m.map(x => x.c).join('')); return coeur > 0 && m.slice(m.length - coeur, -1).some(x => x.s); };
// les morceaux d'un texte que l'on contrôle : tout, sauf ce que le registre donne tel quel
// (un verset, ou une parole attestée citée au milieu d'une narration ou d'un feuillet : recopiés, ils ne se contrôlent pas)
const cites = REG => REG.versets.concat([...REG.paroles.values()]).filter(v => v.length >= 8);
function horsRegistre(t, REG) { let s = String(t); cites(REG).forEach(v => { if (s.indexOf(v) >= 0) s = s.split(v).join(' '); }); return s; }

/* ---------- le contrôle ---------- */
function controler() {
  const REG = registre(), erreurs = [], avis = [];
  const courant = new Map(); listes().forEach(f => lire(f).forEach(x => { if (x.t && !courant.has(x.k)) courant.set(x.k, { t: x.t, fr: x.fr, ou: x.ou, f }); }));
  const formes = new Map(), frais = new Set(); let n = 0, incomplets = 0;
  const fichiersV = fs.existsSync(DV) ? fs.readdirSync(DV).filter(f => /\.json$/.test(f)).sort().map(f => f.replace(/\.json$/, '')) : [];
  fichiersV.forEach(f => {
    if (!listes().includes(f)) erreurs.push(`ÉCART voyelles/${f}.json : aucune liste arabe de ce nom`);
    lireV(f).forEach((x, i) => { n++; const w = `voyelles/${f} ${x.k} « ${String(x.fr || '').slice(0, 40)} »`;
      if (!x || typeof x.k !== 'string' || typeof x.tv !== 'string' || !x.tv) { erreurs.push(`ÉCART voyelles/${f} [${i}] : entrée sans clé ou sans forme vocalisée`); return; }
      const c = courant.get(x.k);
      if (!c) { erreurs.push(`PÉRIMÉ ${w} : ce texte n’est plus dans le jeu`); return; }
      if (c.t !== x.t) { erreurs.push(`PÉRIMÉ ${w} : le texte arabe a changé depuis (avant « ${String(x.t).slice(0, 40)} », aujourd’hui « ${c.t.slice(0, 40)} »)`); return; }
      const fid = L.fidele(x.t, x.tv);
      if (fid === 'lettres') { const a = L.sansMarques(x.t), b = L.sansMarques(x.tv); let j = 0; while (j < a.length && a[j] === b[j]) j++;
        erreurs.push(`ÉCART ${w} : une lettre a changé (vers le signe ${j} : « ${a.slice(Math.max(0, j - 8), j + 8)} » / « ${b.slice(Math.max(0, j - 8), j + 8)} »)`); return; }
      if (fid === 'signes') { erreurs.push(`ÉCART ${w} : un signe que le texte porte déjà manque à sa place`); return; }
      if (formes.has(x.k) && formes.get(x.k) !== x.tv) { erreurs.push(`ÉCART ${w} : vocalisé de deux façons (une seule, la même partout)`); return; }
      // ce que le registre donne : recopié, jamais revocalisé
      const p = REG.paroles.get(c.fr); if (p && x.tv !== x.t) { erreurs.push(`ÉCART ${w} : une parole attestée se recopie du registre, sans signe ajouté`); return; }
      if (/<quote>[12]$/.test(c.ou || '') && x.tv !== x.t) { erreurs.push(`ÉCART ${w} : une parole citée ou sa source se recopie telle qu’elle est`); return; }
      const v = REG.versets.find(s => x.t.indexOf(s) >= 0 && x.tv.indexOf(s) < 0); if (v) { erreurs.push(`ÉCART ${w} : un verset n’est pas recopié tel que le registre le donne`); return; }
      const pc = [...REG.paroles.values()].find(s => s.length >= 8 && x.t.indexOf(s) >= 0 && x.tv.indexOf(s) < 0);
      if (pc) { erreurs.push(`ÉCART ${w} : une parole attestée, citée dans le texte, n’est pas recopiée telle que le registre la donne`); return; }
      formes.set(x.k, x.tv); frais.add(x.k);
      // une parole citée, sa source, une parole du registre : recopiées telles quelles (vérifié ci-dessus), elles ne se complètent pas
      if (p || /<quote>[12]$/.test(c.ou || '')) return;
      if (x.tv === x.t) avis.push(`${w} : la forme vocalisée n’ajoute aucun signe`);
      // (un signe que le texte arabe porte déjà sur le Nom y reste : seul un signe ajouté est refusé)
      const charges = s => mots(horsRegistre(s, REG)).filter(nomCharge).length;
      if (charges(x.tv) > charges(x.t)) { erreurs.push(`ÉCART ${w} : le Nom porte un signe écrit à la main ailleurs que sur sa dernière lettre`); return; }
      const manque = mots(horsRegistre(x.tv, REG)).map(m => ({ m, nu: nues(m) })).filter(o => o.nu.length);
      if (manque.length) { incomplets++; erreurs.push(`INCOMPLET ${w} : ${manque.slice(0, 4).map(o => o.m.map(y => y.c + y.s).join('') + ' (' + o.nu.join('') + ')').join(' · ')}${manque.length > 4 ? ' …' : ''}`); }
    });
  });
  return { erreurs, avis, n, frais, incomplets };
}
function couverture(frais) {
  return listes().map(f => { const tx = lire(f).filter(x => x.t); const v = tx.filter(x => frais.has(x.k)).length; return { f, v, n: tx.length }; });
}

const arg = process.argv[2] || '';
if (arg === 'a-faire') {
  const f = process.argv[3], motif = process.argv[4] ? new RegExp(process.argv[4]) : null;
  if (!f || !listes().includes(f)) { console.log(`✗ fichier inconnu : ${f || '(aucun)'} (${listes().join(', ')})`); process.exit(1); }
  const { frais } = controler();
  console.log(JSON.stringify(lire(f).filter(x => x.t && !frais.has(x.k) && (!motif || motif.test(x.ou || ''))).map(x => ({ k: x.k, fr: x.fr, t: x.t, ou: x.ou })), null, 1));
  process.exit(0);
}
// un verrou par fichier (comme langues.js) : plusieurs rédacteurs peuvent poser en même temps sans effacer le travail
// l'un de l'autre ; un verrou de plus d'une minute est abandonné
const dormir = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function verrou(f, fn) {
  fs.mkdirSync(DV, { recursive: true }); const v = path.join(DV, f + '.json.verrou');
  for (let i = 0; ; i++) {
    try { fs.closeSync(fs.openSync(v, 'wx')); break; } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      try { if (Date.now() - fs.statSync(v).mtimeMs > 60000) { fs.unlinkSync(v); continue; } } catch (e2) { continue; }
      if (i > 1200) { console.log(`✗ voyelles/${f} : le fichier reste verrouillé`); process.exit(1); }
      dormir(100);
    }
  }
  try { return fn(); } finally { try { fs.unlinkSync(v); } catch (e) { /* déjà retiré */ } }
}
if (arg === 'poser') {
  const f = process.argv[3], fichier = process.argv[4];
  if (!f || !listes().includes(f) || !fichier) { console.log('✗ usage : node v2/tools/voyelles.js poser <fichier> <travail.json>'); process.exit(1); }
  let brut = JSON.parse(fs.readFileSync(fichier, 'utf8')); if (!Array.isArray(brut)) brut = Object.keys(brut).map(k => ({ k, tv: brut[k] }));
  const refus = [];
  verrou(f, () => {
  const par = new Map(lire(f).filter(x => x.t).map(x => [x.k, x])), garde = new Map(lireV(f).map(x => [x.k, x]));
  brut.filter(e => e && typeof e.tv === 'string' && e.tv.trim()).forEach(e => { const x = par.get(e.k);
    if (!x) { refus.push(`${e.k} : clé inconnue de ${f}`); return; }
    const fid = L.fidele(x.t, e.tv); if (fid) { refus.push(`${e.k} « ${x.fr.slice(0, 30)} » : ${fid === 'lettres' ? 'une lettre a changé' : 'un signe du texte manque'}`); return; }
    garde.set(e.k, { k: e.k, fr: x.fr, t: x.t, tv: e.tv }); });
  // dans l'ordre de la liste du jour
  const ordre = lire(f).map(x => x.k), rang = new Map(ordre.map((k, i) => [k, i]));
  ecrireV(f, [...garde.values()].sort((a, b) => (rang.has(a.k) ? rang.get(a.k) : 1e9) - (rang.has(b.k) ? rang.get(b.k) : 1e9)));
  console.log(`${refus.length ? '!' : '✓'} voyelles/${f} : ${brut.length - refus.length} forme(s) posée(s), ${garde.size} en tout` + (refus.length ? `, ${refus.length} refusée(s) :\n  - ` + refus.join('\n  - ') : ''));
  });
  process.exit(refus.length ? 1 : 0);
}
const { erreurs, avis, n, frais } = controler();
const cv = couverture(frais), tot = cv.reduce((a, x) => a + x.n, 0), vt = cv.reduce((a, x) => a + x.v, 0);
console.log('couverture (textes vocalisés / textes écrits) : ' + cv.map(x => `${x.f} ${x.v}/${x.n}`).join(' · ') + ` — en tout ${vt}/${tot}`);
if (arg === 'etat') process.exit(0);
erreurs.slice(0, 60).forEach(e => console.log('   - ' + e)); if (erreurs.length > 60) console.log(`   … et ${erreurs.length - 60} autres`);
avis.slice(0, 10).forEach(e => console.log('   ! ' + e));
console.log(erreurs.length ? `✗ ${erreurs.length} anomalie(s) sur ${n} formes vocalisées` : `✓ VOYELLES CONFORMES — ${n} formes vocalisées, chacune fidèle à son texte, entièrement vocalisée`);
process.exit(erreurs.length ? 1 : 0);
