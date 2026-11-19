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
                                              (« partout » au lieu du fichier : dans chaque fichier où la clé revient ;
                                              un verrou par fichier : plusieurs rédacteurs peuvent poser en même temps)
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
// une entrée par ligne : le fichier se lit, se compare et se relit ligne à ligne ; il est écrit à côté puis mis en place
// d'un coup, pour qu'un contrôle qui le lit au même moment ne tombe jamais sur un fichier à moitié écrit
function ecrire(l, f, doc) { fs.mkdirSync(path.join(LANG, l), { recursive: true });
  const p = fichierDe(l, f), tmp = `${p}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `{ "langue": ${JSON.stringify(l)}, "fichier": ${JSON.stringify(f)}, "textes": [\n` + (doc.textes || []).map(x => JSON.stringify(x)).join(',\n') + '\n] }\n');
  fs.renameSync(tmp, p); }
// un verrou par fichier de langue : plusieurs rédacteurs peuvent poser en même temps sans effacer le travail l'un de
// l'autre (chacun lit, modifie et écrit le fichier sous le verrou) ; un verrou de plus d'une minute est abandonné
const dormir = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const tenus = new Set(); process.on('exit', () => tenus.forEach(v => { try { fs.unlinkSync(v); } catch (e) {} })); // même en sortant au milieu
function verrou(l, f, fn) {
  fs.mkdirSync(path.join(LANG, l), { recursive: true }); const v = fichierDe(l, f) + '.verrou';
  for (let i = 0; ; i++) {
    try { fs.closeSync(fs.openSync(v, 'wx')); tenus.add(v); break; } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      try { if (Date.now() - fs.statSync(v).mtimeMs > 60000) { fs.unlinkSync(v); continue; } } catch (e2) { continue; }
      if (i > 1200) { console.log(`✗ ${l}/${f} : le fichier reste verrouillé (${path.relative(V2, v)})`); process.exit(1); }
      dormir(100);
    }
  }
  try { return fn(); } finally { try { fs.unlinkSync(v); } catch (e) {} tenus.delete(v); }
}

function releve() {
  const F = textes(); let total = 0;
  LANGUES.forEach(l => Object.keys(F).forEach(f => verrou(l, f, () => {
    const ancien = lire(l, f), ecrits = new Map((ancien.textes || []).filter(x => x && x.t).map(x => [x.fr, x]));
    // par emplacement (ou) : si le français d'un emplacement a changé, le texte déjà écrit le suit, marqué « a_revoir »
    const parOu = new Map(); (ancien.textes || []).filter(x => x && x.t && x.ou && f !== 'moteur').forEach(x => { if (!parOu.has(x.ou)) parOu.set(x.ou, x); else parOu.set(x.ou, null); });
    const doc = { langue: l, fichier: f, textes: [] }; let gardes = 0;
    const repris = new Set();
    F[f].forEach((v, fr) => { let e = ecrits.get(fr), revoir = false;
      if (!e) { const o = parOu.get(v.ou); if (o && !F[f].has(o.fr)) { e = o; revoir = true; repris.add(o.fr); } }
      const x = { k: L.cle(fr), fr, t: e ? e.t : '', ou: v.ou }; if (v.qui) x.qui = v.qui; if (e && e.note) x.note = e.note;
      if (revoir || (e && e.a_revoir)) { x.a_revoir = true; x.fr_avant = revoir ? e.fr : e.fr_avant; } if (e) gardes++; doc.textes.push(x); });
    const perdus = [...ecrits.keys()].filter(fr => !F[f].has(fr) && !repris.has(fr)).length, arevoir = doc.textes.filter(x => x.a_revoir).length;
    ecrire(l, f, doc); total += doc.textes.length;
    if (perdus) console.log(`  ${l}/${f} : ${perdus} texte(s) écrit(s) dont le français a disparu du jeu, retiré(s)`);
    if (arevoir) console.log(`  ${l}/${f} : ${arevoir} texte(s) à revoir (le français a changé à leur place)`);
  })));
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
// un texte est-il celui de telle ligne du récit ? (le registre rattache un verset à sa ligne : le même mot ailleurs n'est pas une citation)
const SOURCES_JS = {}; const auLigne = (f, n, fr) => { const L = SOURCES_JS[f] || (SOURCES_JS[f] = fs.existsSync(path.join(SRC, 'data', f + '.js')) ? fs.readFileSync(path.join(SRC, 'data', f + '.js'), 'utf8').split('\n') : []);
  const bout = fr.replace(/[«»"']/g, '').slice(0, 40); return !n || !L.length || [L[n - 2], L[n - 1], L[n]].some(x => x && x.replace(/[«»"'\\]/g, '').indexOf(bout) >= 0); };
const ECRITURE = { ar: /[؀-ۿ]/, ja: /[぀-ヿ一-鿿]/, en: /[A-Za-z]/ };
const FORMES = { ar: 6, en: 2, ja: 1 };
const champs = s => new Set((String(s).match(/\{(\w+)\}/g) || []));
const balises = s => (String(s).match(/<\/?[a-z]+\b[^>]*>/gi) || []).map(b => b.replace(/\s+[^>]*/, '')).sort().join(' ');
function controler(l, F, REG) {
  const erreurs = [], avis = []; let faits = 0, n = 0; const cases = [];
  Object.keys(F).forEach(f => { const doc = lire(l, f), par = new Map((doc.textes || []).map(x => [x.fr, x]));
    F[f].forEach((v, fr) => { n++; const x = par.get(fr), w = `${l}/${f} ${v.ou}`;
      if (!x || !x.t) return; if (x.a_revoir) { erreurs.push(`${w} : à revoir — le français a changé (avant : « ${String(x.fr_avant).slice(0, 50)} »)`); } faits++; const t = x.t;
      cases.push({ ou: v.ou, fr, t });
      // aucun reste de français : un texte de plus de deux mots recopié tel quel, ou sans un signe de l'écriture de la langue
      const mots = fr.replace(/\{\w+\}|<[^>]+>/g, '').trim().split(/\s+/).filter(m => /[A-Za-zÀ-ÿ]/.test(m)).length;
      // un nom propre (le champ « name » d'un personnage) s'écrit en anglais comme en français quand il n'a aucun signe à retirer
      if (t === fr && mots > 2 && !(l === 'en' && /\.name$/.test(v.ou))) erreurs.push(`${w} : le français est recopié tel quel`);
      else if (l !== 'en' && /[A-Za-zÀ-ÿ]{2}/.test(fr.replace(/\{\w+\}|<[^>]+>/g, '')) && !ECRITURE[l].test(t)) avis.push(`${w} : aucun signe de l'écriture de la langue (« ${t.slice(0, 40)} »)`);
      // les mêmes champs que le français (un champ « tourné à la française » peut manquer), aucun de plus
      // un champ tourné à la française (de_nom, min_lame, le_voie, voisins_min, nombre…) a son jumeau nu (nom, lame, voie, voisins, n)
      const cf = champs(fr), nus = new Set([...cf].map(c => c.replace(/^\{(de|du|le|la|les|l|min|au|aux)_/, '{').replace(/_min\}$/, '}')));
      if (cf.has('{nombre}')) nus.add('{n}');
      champs(t).forEach(c => { if (!cf.has(c) && !nus.has(c)) erreurs.push(`${w} : champ ${c} inconnu du français`); });
      if (t.split(L.SEP).length > FORMES[l]) erreurs.push(`${w} : ${t.split(L.SEP).length} formes selon le nombre, ${FORMES[l]} au plus`);
      if (fr.indexOf(L.SEP) < 0 && t.indexOf(L.SEP) >= 0 && !cf.has('{n}')) erreurs.push(`${w} : des formes selon le nombre, sans champ {n}`);
      if (balises(fr) !== balises(t)) erreurs.push(`${w} : pas les mêmes balises que le français (${balises(fr) || 'aucune'} / ${balises(t) || 'aucune'})`);
      if ((fr.match(/\*/g) || []).length !== (t.match(/\*/g) || []).length) avis.push(`${w} : pas la même emphase (*…*) que le français`);
      // une parole citée et sa source : celles du registre, au signe près
      const p = REG.paroles.get(fr); if (p && p[l]) { if (t !== p[l].texte) erreurs.push(`${w} : la parole n'est pas celle du registre (v2/docs/sources/)`); }
      const s = /<quote>2$/.test(v.ou) && REG.sources.get(fr); if (s && s.every(e => e[l]) && !s.some(e => t === e[l].reference)) erreurs.push(`${w} : la source n'est pas celle du registre`);
      // un verset : le texte relevé dans le registre doit s'y trouver tel quel
      REG.versets.filter(e => e.fr && path.basename(String(e.fichier || ''), '.js') === f && fr.indexOf(e.fr) >= 0 && e[l] && e[l].texte && auLigne(f, e.ligne, fr)).forEach(e => { if (t.indexOf(e[l].texte) < 0) erreurs.push(`${w} : le verset ${e.sourate}:${e.versets} n'est pas cité tel que le registre le relève`); });
    }); });
  // un même texte français n'a qu'une clé : il ne peut être écrit que d'une façon, dans tous les fichiers où il revient
  const vu = new Map(); Object.keys(F).forEach(f => (lire(l, f).textes || []).forEach(x => { if (!x.t || !F[f].has(x.fr)) return; const a = vu.get(x.fr);
    if (a && a.t !== x.t) erreurs.push(`${l} : « ${x.fr.slice(0, 50)} » est écrit « ${a.t.slice(0, 40)} » dans ${a.f} et « ${x.t.slice(0, 40)} » dans ${f} — une seule façon, la même partout`); else if (!a) vu.set(x.fr, { t: x.t, f }); }));
  const r = R.verifierLangue(l, cases); erreurs.push(...r.erreurs); avis.push(...r.avis);
  return { erreurs, avis, faits, n };
}

// poser : ce qu'un rédacteur a écrit — une liste [{ k, t }] (ou { k: t }), la clé étant celle de l'entrée (« k ») —
// entre dans src/lang/<langue>/<fichier>.json ; une clé inconnue de ce fichier est refusée, un texte vide ignoré.
// « partout » à la place du fichier : chaque texte entre dans tous les fichiers de la langue où sa clé revient (un texte
// commun à plusieurs fichiers ne s'écrit que d'une façon) ; une clé qui n'est dans aucun fichier est refusée.
function poser(l, f, fichier) {
  if (!LANGUES.includes(l)) { console.log(`✗ langue inconnue : ${l} (${LANGUES.join(', ')})`); process.exit(1); }
  let brut = JSON.parse(fs.readFileSync(fichier, 'utf8')); if (!Array.isArray(brut)) brut = Object.keys(brut).map(k => ({ k, t: brut[k] }));
  brut = brut.filter(e => e && typeof e.t === 'string' && e.t.trim());
  const partout = f === 'partout', fichiers = partout ? (fs.existsSync(path.join(LANG, l)) ? fs.readdirSync(path.join(LANG, l)).filter(x => /\.json$/.test(x)).map(x => x.replace(/\.json$/, '')).sort() : []) : [f];
  const poses = new Map(); let total = 0;
  if (!partout && !lire(l, f).textes.length) { console.log(`✗ ${l}/${f} : aucune liste (node v2/tools/langues.js releve)`); process.exit(1); }
  fichiers.forEach(g => verrou(l, g, () => {
    const doc = lire(l, g), par = new Map((doc.textes || []).map(x => [x.k, x]));
    if (!par.size) return;
    let n = 0;
    brut.forEach(e => { const x = par.get(e.k); if (!x) return; x.t = e.t; if (e.note) x.note = e.note; delete x.a_revoir; delete x.fr_avant; n++; poses.set(e.k, (poses.get(e.k) || 0) + 1); });
    if (n || !partout) ecrire(l, g, doc); total += n;
    if (partout && n) console.log(`  ${l}/${g} : ${n} texte(s) posé(s)`);
  }));
  const inconnues = brut.map(e => e.k).filter(k => !poses.has(k));
  console.log(`${inconnues.length ? '!' : '✓'} ${l}/${f} : ${partout ? `${poses.size} texte(s) posé(s), ${total} emplacement(s)` : `${total} texte(s) posé(s)`}` + (inconnues.length ? `, ${inconnues.length} clé(s) inconnue(s)${partout ? ' de tous les fichiers' : ''} : ${inconnues.slice(0, 8).join(' ')}` : ''));
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
