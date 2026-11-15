#!/usr/bin/env node
/* ISNAD 2.0 — contrôle le contenu contre le schéma (src/core/defs.js), avec les règles de src/core/regles.js.
   Usage : node tools/validate.js [fichiers]
   Sans argument : tout le contenu de src/data/ (sagas, histoire-cadre, veillées, contenu commun), puis les contrôles
   d'ensemble (renvois entre sagas, ordre sur la Chaîne). Code de sortie 1 à la première erreur. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const D = require('../src/core/defs.js');
const DATA = path.join(__dirname, '../src/data');

// un fichier de contenu appelle ISNAD.registerSaga : on l'exécute à blanc pour recueillir ce qu'il déclare
function lire(file) {
  const sagas = [], ctx = { ISNAD: { registerSaga: s => sagas.push(s), registerMusic() {} }, console };
  ctx.window = ctx; ctx.globalThis = ctx;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return sagas;
}
// le contexte des règles : les savoirs des autres sagas (« saga/id ») et les égrégores communs, lus dans tout src/data/
const autres = {}, communs = {}, toutes = [];
for (const f of fs.readdirSync(DATA).filter(f => /\.js$/.test(f)).sort()) {
  try { lire(path.join(DATA, f)).forEach(s => { toutes.push(s); autres[s.id] = new Set((s.codex || []).map(x => x.id)); if (s.commun) Object.assign(communs, s.enemies || {}); }); } catch (e) { /* signalé plus bas, fichier par fichier */ }
}
const R = require('../src/core/regles.js').creer(D, {
  savoirConnu: ref => { const [sid, id] = ref.split('/'); return !!(autres[sid] && autres[sid].has(id)); },
  ennemisCommuns: () => communs
});

const tout = process.argv.length <= 2;
const files = tout ? fs.readdirSync(DATA).filter(f => /^saga_.*\.js$/.test(f)).sort().concat(['frame.js', 'caid.js', 'coeur.js'].filter(f => fs.existsSync(path.join(DATA, f)))).map(f => path.join(DATA, f)) : process.argv.slice(2);
const nom = f => path.relative(process.cwd(), path.resolve(f)) || f;

let totalErr = 0;
{ const E = R.verifierEquipement(); if (E.length) { console.log(`✗ src/core/defs.js — équipement\n   ` + E.join('\n   ')); totalErr += E.length; } }
for (const file of files) {
  let sagas;
  try { sagas = lire(file); } catch (e) { console.log(`✗ ${nom(file)}\n   Erreur de syntaxe/exécution : ${e.message}`); totalErr++; continue; }
  const errs = [], warn = [];
  if (!sagas.length) errs.push('aucun appel à ISNAD.registerSaga');
  for (const s of sagas) { const r = R.verifierSaga(s); errs.push(...r.erreurs); warn.push(...r.avis); }
  if (errs.length) { totalErr += errs.length; console.log(`✗ ${nom(file)} — ${errs.length} erreur(s)`); errs.forEach(e => console.log('   - ' + e)); }
  else console.log(`✓ ${nom(file)} — ${R.stats(sagas)}`);
  warn.forEach(w => console.log('   ! ' + w));
}
if (tout) { const E = R.verifierEnsemble(toutes);
  if (E.length) { totalErr += E.length; console.log(`✗ ensemble — ${E.length} erreur(s)`); E.forEach(e => console.log('   - ' + e)); }
  else console.log(`✓ ensemble — ${toutes.filter(s => !s.commun && !s.frame).length} sagas, renvois et ordre cohérents`); }
process.exit(totalErr ? 1 : 0);
