#!/usr/bin/env node
/* ISNAD 2.0 — assemble le jeu de v2/ en un seul fichier (la 1.32, à la racine du dépôt, a son propre outil et ne bouge plus).
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

const core = ['defs', 'regles', 'dedale', 'base', 'perso', 'gfx', 'sprites', 'maps', 'script', 'world', 'build', 'trade', 'oeuvres', 'gear', 'mal', 'valeurs', 'rangs', 'battle', 'rodeurs', 'ui'].map(n => `src/core/${n}.js`);
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
const NUMERO = '2.0'; // la 1.32 est le jeu léger gelé à la racine du dépôt
const version = NUMERO + (vers ? ' · essai' : '') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC' + (rev ? ' · ' + rev : '');
const js = `window.ISNAD_VERSION = ${JSON.stringify(version)};\n` + core.concat(data).map(f => `/* ==== ${f} ==== */\n` + read(f)).concat(paquets.map(poser)).join('\n') +
  '\n(window.claude && window.claude.hot && window.claude.hot.ready) ? window.claude.hot.ready(function () { ISNAD.ui.boot(); }) : ISNAD.ui.boot();\n';
if (js.includes('</script')) throw new Error('</script> trouvé dans le JS');

const page = read('src/page.html').replace('/*CSS*/', () => read('src/style.css')).replace('/*JS*/', () => js);
const cut = page.indexOf('<div id="app">');
const full = `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="ISNAD — JRPG rétro-HD en cinq sagas : les Compagnons après la mort du Prophète ﷺ.">\n${page.slice(0, cut)}</head>\n<body>\n${page.slice(cut)}\n</body>\n</html>\n`;
const resume = `${core.length + data.length} modules` + (paquets.length ? ` · ${paquets.length} paquet${paquets.length > 1 ? 's' : ''}` : '');
if (vers) {
  fs.mkdirSync(vers, { recursive: true }); fs.writeFileSync(path.join(vers, 'index.html'), full);
  console.log(`essai : ${path.relative(process.cwd(), path.join(vers, 'index.html'))} ${(full.length / 1024).toFixed(0)} Ko · ${resume}`);
} else {
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(root, 'dist/isnad.html'), page);
  fs.writeFileSync(path.join(root, 'index.html'), full);
  console.log(`index.html ${(full.length / 1024).toFixed(0)} Ko · dist/isnad.html ${(page.length / 1024).toFixed(0)} Ko · ${resume}`);
}
