#!/usr/bin/env node
/* ISNAD 2.x — assemble le jeu de v2/ en un seul fichier (la 1.32 est archivée dans archive/v1.32/, avec son propre outil).
   - index.html          : page autonome (dépôt, hébergement statique)
   - dist/isnad.html     : fragment sans <html>/<head>/<body> (publication en Artifact)
   Les paquets publiés (paquets/*.json) sont embarqués après le jeu de base ; le jeu les contrôle lui-même en les posant.
   Assemblage d'essai, qui ne touche ni index.html ni dist/ :
     node tools/build.js --avec un-paquet.json [--avec un-autre.json] --vers un-dossier     → un-dossier/index.html */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const args = process.argv.slice(2), avec = []; let vers = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--avec' && args[i + 1]) avec.push(path.resolve(args[++i]));
  else if (args[i] === '--vers' && args[i + 1]) vers = path.resolve(args[++i]);
  else { console.error('option inconnue : ' + args[i] + ' (--avec fichier.json, --vers dossier)'); process.exit(2); }
}
if (avec.length && !vers) { console.error('--avec demande --vers : un assemblage d’essai ne remplace jamais le jeu livré'); process.exit(2); }

const core = ['defs', 'regles', 'dedale', 'langue', 'base', 'perso', 'gfx', 'sprites', 'maps', 'script', 'world', 'build', 'trade', 'oeuvres', 'lecons', 'gear', 'mal', 'valeurs', 'postures', 'rangs', 'battle', 'rodeurs', 'ui', 'trafic', 'cite', 'circuit', 'activites', 'passages', 'monde', 'gens', 'entraide', 'partage'].map(n => `src/core/${n}.js`);
const data = ['src/data/frame.js', 'src/data/music.js', 'src/data/caid.js', 'src/data/coeur.js'].filter(f => fs.existsSync(path.join(root, f))).concat(fs.readdirSync(path.join(root, 'src/data')).filter(f => /^saga_.*\.js$/.test(f)).sort().map(f => 'src/data/' + f));
// les paquets : ceux du dépôt, dans l'ordre de leurs noms, puis ceux de l'essai. Un paquet est de la donnée : il entre tel quel.
const DOSSIER = path.join(root, 'paquets');
const paquets = (fs.existsSync(DOSSIER) ? fs.readdirSync(DOSSIER).filter(f => /\.json$/.test(f)).sort().map(f => path.join(DOSSIER, f)) : []).concat(avec);
const poser = f => { const p = JSON.parse(fs.readFileSync(f, 'utf8'));
  // « < » et les deux séparateurs de ligne Unicode sont écrits par leur code : rien, dans un texte, ne peut fermer la balise ni couper la ligne
  const texte = JSON.stringify(p).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return `/* ==== paquet ${String(p.id).replace(/[^a-z0-9_]/g, '?')} ==== */\nISNAD.registerPack(${texte});`; };
// version lisible par le joueur (écran-titre, page Diagnostic) : date de l'assemblage et dernier commit
// « + » : des sources ont changé depuis ce commit (les fichiers générés ne comptent pas)
let rev = ''; try { const sh = c => require('child_process').execSync(c, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); rev = sh('git rev-parse --short HEAD') + (sh('git status --porcelain -- src tools paquets') ? '+' : ''); } catch (e) { /* hors dépôt */ }
// le numéro de la 2.x : il avance d'un centième à chaque enregistrement qui change le jeu (AGENTS.md ; docs/decisions.md, D181)
const NUMERO = '2.48';
const version = NUMERO + (vers ? ' · essai' : '') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC' + (rev ? ' · ' + rev : '');
// les langues (src/lang/<langue>/<fichier>.json) : chaque texte est rangé sous la clé de son texte français (src/core/langue.js).
// Un texte laissé vide n'entre pas : le jeu dira le français à cet endroit, et v2/tools/langues.js le signale.
const LANGUE = require('../src/core/langue.js'), LANG = path.join(root, 'src/lang');
// Une langue n'est offerte au joueur qu'une fois complète (chaque texte de ses listes écrit) ; inachevée, elle n'entre
// que pour les essais (?lang=… dans l'adresse).
const langues = LANGUE.ORDRE.filter(l => l !== 'fr' && fs.existsSync(path.join(LANG, l))).map(l => { const cat = {}; let total = 0, ecrits = 0;
  fs.readdirSync(path.join(LANG, l)).filter(f => /\.json$/.test(f)).sort().forEach(f => { (JSON.parse(fs.readFileSync(path.join(LANG, l, f), 'utf8')).textes || []).forEach(x => { if (!x || typeof x.fr !== 'string') return; total++; if (typeof x.t === 'string' && x.t) { ecrits++; cat[LANGUE.cle(x.fr)] = x.t; } }); });
  const complet = total > 0 && ecrits === total;
  // 2.x \u2014 l'arabe vocalis\u00e9 (src/lang/<langue>/voyelles/<fichier>.json : { k, fr, t, tv }) : la forme vocalis\u00e9e d'un texte,
  // sous la m\u00eame cl\u00e9. Elle n'entre que si elle suit le texte d'aujourd'hui (t identique, m\u00eames lettres, ses signes gard\u00e9s :
  // LANGUE.fidele) ; sinon le jeu montre le texte tel qu'il est \u00e9crit, et v2/tools/voyelles.js dit \u00ab P\u00c9RIM\u00c9 \u00bb ou \u00ab \u00c9CART \u00bb.
  const DV = path.join(LANG, l, 'voyelles'), voy = {};
  if (fs.existsSync(DV)) fs.readdirSync(DV).filter(f => /\.json$/.test(f)).sort().forEach(f => { (JSON.parse(fs.readFileSync(path.join(DV, f), 'utf8')).textes || []).forEach(x => {
    if (!x || typeof x.tv !== 'string' || !x.tv || typeof x.k !== 'string') return; if (cat[x.k] === x.t && !LANGUE.fidele(x.t, x.tv) && x.tv !== x.t) voy[x.k] = x.tv; }); });
  const nv = Object.keys(voy).length, sur = s => JSON.stringify(s).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return { l, n: Object.keys(cat).length, nv, complet, js: `/* ==== langue ${l} ==== */\nISNAD.langue.poser(${JSON.stringify(l)}, ${sur(cat)}, { complet: ${complet} });` + (nv ? `\nISNAD.langue.poserVoyelles(${JSON.stringify(l)}, ${sur(voy)});` : '') }; }).filter(x => x.n);
// ce que le jeu reprend de la promotion (partager sa progression : src/core/partage.js) : lu dans v2/tools/promotion.js, le seul
// endroit où s'écrivent l'adresse et la réserve, et posé dans la page — jamais recopié dans le moteur
const PROMO = require('./promotion.js'), promo = {}; PROMO.JEU.forEach(k => { promo[k] = PROMO[k]; });
const js = `window.ISNAD_VERSION = ${JSON.stringify(version)};\nwindow.ISNAD_PROMO = ${JSON.stringify(promo).replace(/</g, '\\u003c')};\n` + core.concat(data).map(f => `/* ==== ${f} ==== */\n` + read(f)).concat(langues.map(x => x.js)).concat(paquets.map(poser)).join('\n') +
  '\n(window.claude && window.claude.hot && window.claude.hot.ready) ? window.claude.hot.ready(function () { ISNAD.ui.boot(); }) : ISNAD.ui.boot();\n';
if (js.includes('</script')) throw new Error('</script> trouvé dans le JS');

const page = read('src/page.html').replace(/<title>[^<]*<\/title>/, `<title>ISNAD ${NUMERO}</title>`).replace('/*CSS*/', () => read('src/style.css')).replace('/*JS*/', () => js);
const cut = page.indexOf('<div id="app">');
const full = `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="ISNAD — JRPG rétro-HD en cinq sagas : les Compagnons après la mort du Prophète ﷺ.">\n${page.slice(0, cut)}</head>\n<body>\n${page.slice(cut)}\n</body>\n</html>\n`;
const resume = `${core.length + data.length} modules` + (paquets.length ? ` · ${paquets.length} paquet${paquets.length > 1 ? 's' : ''}` : '') + (langues.length ? ' · ' + langues.map(x => `${x.l} ${x.n}${x.nv ? ` (${x.nv} vocalisés)` : ''}${x.complet ? '' : ' (inachevée)'}`).join(', ') : '');
if (vers) {
  fs.mkdirSync(vers, { recursive: true }); fs.writeFileSync(path.join(vers, 'index.html'), full);
  console.log(`essai : ${path.relative(process.cwd(), path.join(vers, 'index.html'))} ${(full.length / 1024).toFixed(0)} Ko · ${resume}`);
} else {
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dist/isnad.html'), page);
  fs.writeFileSync(path.join(root, 'index.html'), full);
  console.log(`index.html ${(full.length / 1024).toFixed(0)} Ko · dist/isnad.html ${(page.length / 1024).toFixed(0)} Ko · ${resume}`);
}
