#!/usr/bin/env node
/* ISNAD 2.x — les langues : ce qu'il reste à écrire, et ce qui est écrit, contrôlé.
   Le jeu est écrit en français ; l'arabe, l'anglais et le japonais sont écrits à la source (v2/docs/sources/,
   v2/docs/langues/) et rangés, texte par texte, sous la clé de leur texte français (src/core/langue.js).

   Usage : node v2/tools/langues.js releve   pour chaque langue et chaque fichier du jeu, met à jour
                                              src/lang/<langue>/<fichier>.json : chaque texte français y a son entrée
                                              { fr, t, ou } ; ce qui est écrit (t) est gardé, ce qui a disparu du jeu
                                              est retiré (et compté)
           node v2/tools/langues.js etat     ce qui est écrit, fichier par fichier
           node v2/tools/langues.js poser <langue> <fichier> <écrit.json>   pose ce qu'un rédacteur a écrit ([{ k, t }])
           node v2/tools/langues.js [ar|en|ja] [fichier]  contrôle : tout est écrit, et tout ce qui est écrit passe les règles
                                              → « LANGUES CONFORMES » ; code de sortie 1 sinon

   Les fichiers : un par fichier de récit (saga_abubakr, …, frame, caid, coeur), « tables » (les tables de
   src/core/defs.js) et « moteur » (les phrases du code, dites par I.t('…') ou marquées I.T('…'), et les textes de
   src/page.html marqués data-t). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const V2 = path.join(__dirname, '..'), SRC = path.join(V2, 'src'), LANG = path.join(SRC, 'lang'), SOURCES = path.join(V2, 'docs', 'sources');
const D = require(path.join(SRC, 'core/defs.js')), L = require(path.join(SRC, 'core/langue.js')), R = require(path.join(SRC, 'core/regles.js'));
const LANGUES = L.ORDRE.filter(l => l !== 'fr');

/* ---------- les textes français, fichier par fichier ---------- */
function lireRecit(f) { const sagas = [], ctx = { ISNAD: { registerSaga: s => sagas.push(s), registerMusic() {} }, console }; ctx.window = ctx; ctx.globalThis = ctx; vm.runInNewContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f }); return sagas; }
function textes() {
  const F = {};   // fichier → Map(fr → { ou, qui })
  const met = (fichier, fr, ou, qui) => { if (typeof fr !== 'string' || !fr.trim()) return; const m = F[fichier] || (F[fichier] = new Map()); if (!m.has(fr)) m.set(fr, { ou, qui }); };
  fs.readdirSync(path.join(SRC, 'data')).filter(f => /\.js$/.test(f) && f !== 'music.js').sort().forEach(f => {
    const nom = f.replace(/\.js$/, '');
    lireRecit(path.join(SRC, 'data', f)).forEach(s => L.casesSaga(s, (o, k, ou) => met(nom, o[k], ou, /<say>2$/.test(ou) && Array.isArray(o) ? o[1] : undefined)));
  });
  L.casesDefs(D, (o, k, ou) => met('tables', o[k], ou));
  // le moteur : les chaînes écrites en toutes lettres après I.t( ou I.T(
  const LIT = /\bI\.(t|T)\(\s*('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\$]|\\.)*`)/g;
  fs.readdirSync(path.join(SRC, 'core')).filter(f => /\.js$/.test(f)).sort().forEach(f => {
    const code = fs.readFileSync(path.join(SRC, 'core', f), 'utf8'); let m;
    while ((m = LIT.exec(code))) { let fr; try { fr = vm.runInNewContext(m[2]); } catch (e) { console.log(`✗ ${f} : chaîne illisible ${m[2].slice(0, 60)}`); continue; } met('moteur', fr, f); }
  });
  // la page : data-t (le texte de l'élément), data-t-title / -aria / -placeholder (la valeur de l'attribut)
  const page = fs.readFileSync(path.join(SRC, 'page.html'), 'utf8'); let m;
  const T = /<[a-z0-9]+\b[^>]*\sdata-t(?:=["']([^"']*)["'])?(?=[\s>])[^>]*>([^<]*)</g;
  while ((m = T.exec(page))) met('moteur', (m[1] || m[2]).replace(/\s+/g, ' ').trim(), 'page.html');
  const A = /\sdata-t-(?:title|aria|placeholder)=["']([^"']*)["']/g;
  while ((m = A.exec(page))) met('moteur', m[1], 'page.html');
  return F;
}

/* ---------- les fichiers d'une langue ---------- */
const fichierDe = (l, f) => path.join(LANG, l, f + '.json');
function lire(l, f) { const p = fichierDe(l, f); if (!fs.existsSync(p)) return { textes: [] }; return JSON.parse(fs.readFileSync(p, 'utf8')); }
// une entrée par ligne : le fichier se lit, se compare et se relit ligne à ligne
function ecrire(l, f, doc) { fs.mkdirSync(path.join(LANG, l), { recursive: true });
  fs.writeFileSync(fichierDe(l, f), `{ "langue": ${JSON.stringify(l)}, "fichier": ${JSON.stringify(f)}, "textes": [\n` + (doc.textes || []).map(x => JSON.stringify(x)).join(',\n') + '\n] }\n'); }

function releve() {
  const F = textes(); let total = 0;
  LANGUES.forEach(l => Object.keys(F).forEach(f => {
    const ancien = lire(l, f), ecrits = new Map((ancien.textes || []).filter(x => x && x.t).map(x => [x.fr, x]));
    const doc = { langue: l, fichier: f, textes: [] }; let gardes = 0;
    F[f].forEach((v, fr) => { const e = ecrits.get(fr), x = { k: L.cle(fr), fr, t: e ? e.t : '', ou: v.ou }; if (v.qui) x.qui = v.qui; if (e && e.note) x.note = e.note; if (e) gardes++; doc.textes.push(x); });
    const perdus = [...ecrits.keys()].filter(fr => !F[f].has(fr)).length;
    ecrire(l, f, doc); total += doc.textes.length;
    if (perdus) console.log(`  ${l}/${f} : ${perdus} texte(s) écrit(s) dont le français a disparu du jeu, retiré(s)`);
  }));
  console.log(`✓ relevé : ${Object.keys(F).length} fichiers × ${LANGUES.length} langues, ${total / LANGUES.length} textes par langue`);
}

/* ---------- le registre des sources : ce qu'une parole et un verset doivent dire dans chaque langue ---------- */
function registre() {
  const paroles = new Map(), sources = new Map(), versets = [];
  if (!fs.existsSync(SOURCES)) return { paroles, sources, versets };
  fs.readdirSync(SOURCES).filter(f => /\.json$/.test(f)).forEach(f => JSON.parse(fs.readFileSync(path.join(SOURCES, f), 'utf8')).forEach(x => {
    if (f === 'versets.json') { if (x.fr) versets.push(x); return; }
    paroles.set(x.fr, x); if (x.source_fr) { const s = sources.get(x.source_fr) || []; s.push(x); sources.set(x.source_fr, s); }
  }));
  return { paroles, sources, versets };
}

/* ---------- le contrôle ---------- */
const ECRITURE = { ar: /[؀-ۿ]/, ja: /[぀-ヿ一-鿿]/, en: /[A-Za-z]/ };
const FORMES = { ar: 6, en: 2, ja: 1 };
const champs = s => new Set((String(s).match(/\{(\w+)\}/g) || []));
const balises = s => (String(s).match(/<\/?[a-z]+\b[^>]*>/gi) || []).map(b => b.replace(/\s+[^>]*/, '')).sort().join(' ');
function controler(l, F, REG) {
  const erreurs = [], avis = []; let faits = 0, n = 0; const cases = [];
  Object.keys(F).forEach(f => { const doc = lire(l, f), par = new Map((doc.textes || []).map(x => [x.fr, x]));
    F[f].forEach((v, fr) => { n++; const x = par.get(fr), w = `${l}/${f} ${v.ou}`;
      if (!x || !x.t) return; faits++; const t = x.t;
      cases.push({ ou: v.ou, fr, t });
      // aucun reste de français : un texte de plus de deux mots recopié tel quel, ou sans un signe de l'écriture de la langue
      const mots = fr.replace(/\{\w+\}|<[^>]+>/g, '').trim().split(/\s+/).filter(m => /[A-Za-zÀ-ÿ]/.test(m)).length;
      if (t === fr && mots > 2) erreurs.push(`${w} : le français est recopié tel quel`);
      else if (l !== 'en' && /[A-Za-zÀ-ÿ]{2}/.test(fr.replace(/\{\w+\}|<[^>]+>/g, '')) && !ECRITURE[l].test(t)) avis.push(`${w} : aucun signe de l'écriture de la langue (« ${t.slice(0, 40)} »)`);
      // les mêmes champs que le français (un champ « tourné à la française » peut manquer), aucun de plus
      const cf = champs(fr); champs(t).forEach(c => { if (!cf.has(c)) erreurs.push(`${w} : champ ${c} inconnu du français`); });
      if (t.split(L.SEP).length > FORMES[l]) erreurs.push(`${w} : ${t.split(L.SEP).length} formes selon le nombre, ${FORMES[l]} au plus`);
      if (fr.indexOf(L.SEP) < 0 && t.indexOf(L.SEP) >= 0 && !cf.has('{n}')) erreurs.push(`${w} : des formes selon le nombre, sans champ {n}`);
      if (balises(fr) !== balises(t)) erreurs.push(`${w} : pas les mêmes balises que le français (${balises(fr) || 'aucune'} / ${balises(t) || 'aucune'})`);
      if ((fr.match(/\*/g) || []).length !== (t.match(/\*/g) || []).length) avis.push(`${w} : pas la même emphase (*…*) que le français`);
      // une parole citée et sa source : celles du registre, au signe près
      const p = REG.paroles.get(fr); if (p && p[l]) { if (t !== p[l].texte) erreurs.push(`${w} : la parole n'est pas celle du registre (v2/docs/sources/)`); }
      const s = REG.sources.get(fr); if (s && s.every(e => e[l]) && !s.some(e => t === e[l].reference)) erreurs.push(`${w} : la source n'est pas celle du registre`);
      // un verset : le texte relevé dans le registre doit s'y trouver tel quel
      REG.versets.filter(e => e.fr && fr.indexOf(e.fr) >= 0 && e[l] && e[l].texte).forEach(e => { if (t.indexOf(e[l].texte) < 0) erreurs.push(`${w} : le verset ${e.sourate}:${e.versets} n'est pas cité tel que le registre le relève`); });
    }); });
  const r = R.verifierLangue(l, cases); erreurs.push(...r.erreurs); avis.push(...r.avis);
  return { erreurs, avis, faits, n };
}

// poser : ce qu'un rédacteur a écrit — une liste [{ k, t }] (ou { k: t }), la clé étant celle de l'entrée (« k ») —
// entre dans src/lang/<langue>/<fichier>.json ; une clé inconnue de ce fichier est refusée, un texte vide ignoré
function poser(l, f, fichier) {
  const doc = lire(l, f), par = new Map((doc.textes || []).map(x => [x.k, x])); if (!par.size) { console.log(`✗ ${l}/${f} : aucune liste (node v2/tools/langues.js releve)`); process.exit(1); }
  let brut = JSON.parse(fs.readFileSync(fichier, 'utf8')); if (!Array.isArray(brut)) brut = Object.keys(brut).map(k => ({ k, t: brut[k] }));
  let n = 0; const inconnues = [];
  brut.forEach(e => { if (!e || typeof e.t !== 'string' || !e.t.trim()) return; const x = par.get(e.k); if (!x) { inconnues.push(e.k); return; } x.t = e.t; if (e.note) x.note = e.note; n++; });
  ecrire(l, f, doc);
  console.log(`${inconnues.length ? '!' : '✓'} ${l}/${f} : ${n} texte(s) posé(s)` + (inconnues.length ? `, ${inconnues.length} clé(s) inconnue(s) : ${inconnues.slice(0, 8).join(' ')}` : ''));
  if (inconnues.length) process.exit(1);
}
const arg = process.argv[2] || '';
if (arg === 'releve') { releve(); process.exit(0); }
if (arg === 'poser') { poser(process.argv[3], process.argv[4], process.argv[5]); process.exit(0); }
const F = textes(), REG = registre();
// node v2/tools/langues.js <langue> <fichier> : le contrôle d'un seul fichier
if (process.argv[3] && F[process.argv[3]]) Object.keys(F).forEach(f => { if (f !== process.argv[3]) delete F[f]; });
if (arg === 'etat') {
  LANGUES.forEach(l => { const ligne = Object.keys(F).map(f => { const par = new Map((lire(l, f).textes || []).map(x => [x.fr, x])); let k = 0; F[f].forEach((v, fr) => { if (par.get(fr) && par.get(fr).t) k++; }); return `${f} ${k}/${F[f].size}`; });
    console.log(`${l} · ` + ligne.join(' · ')); });
  process.exit(0);
}
let ko = 0;
(LANGUES.includes(arg) ? [arg] : LANGUES).forEach(l => {
  const { erreurs, avis, faits, n } = controler(l, F, REG);
  const manque = n - faits;
  console.log(`${erreurs.length || manque ? '✗' : '✓'} ${l} : ${faits}/${n} textes écrits` + (erreurs.length ? `, ${erreurs.length} erreur(s)` : '') + (avis.length ? `, ${avis.length} avis` : ''));
  erreurs.slice(0, 40).forEach(e => console.log('   - ' + e)); if (erreurs.length > 40) console.log(`   … et ${erreurs.length - 40} autres`);
  avis.slice(0, 10).forEach(e => console.log('   ! ' + e)); if (avis.length > 10) console.log(`   … et ${avis.length - 10} autres avis`);
  if (erreurs.length || manque) ko++;
});
console.log(ko ? '✗ langues incomplètes ou non conformes' : '✓ LANGUES CONFORMES');
process.exit(ko ? 1 : 0);
