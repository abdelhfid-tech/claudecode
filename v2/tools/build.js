#!/usr/bin/env node
/* ISNAD 2.0 — assemble le jeu de v2/ en un seul fichier (la 1.31, à la racine du dépôt, a son propre outil et ne bouge plus).
   - index.html          : page autonome (dépôt, hébergement statique)
   - dist/isnad.html     : fragment sans <html>/<head>/<body> (publication en Artifact) */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const core = ['defs', 'base', 'gfx', 'sprites', 'maps', 'script', 'world', 'build', 'trade', 'oeuvres', 'gear', 'mal', 'valeurs', 'rangs', 'battle', 'ui'].map(n => `src/core/${n}.js`);
const data = ['src/data/frame.js', 'src/data/music.js', 'src/data/caid.js', 'src/data/coeur.js'].filter(f => fs.existsSync(path.join(root, f))).concat(fs.readdirSync(path.join(root, 'src/data')).filter(f => /^saga_.*\.js$/.test(f)).sort().map(f => 'src/data/' + f));
// version lisible par le joueur (écran-titre, page Diagnostic) : date de l'assemblage et dernier commit
// « + » : des sources ont changé depuis ce commit (les fichiers générés ne comptent pas)
let rev = ''; try { const sh = c => require('child_process').execSync(c, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); rev = sh('git rev-parse --short HEAD') + (sh('git status --porcelain -- src tools') ? '+' : ''); } catch (e) { /* hors dépôt */ }
const NUMERO = '2.0'; // la 1.31 est le jeu léger gelé à la racine du dépôt
const version = NUMERO + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC' + (rev ? ' · ' + rev : '');
const js = `window.ISNAD_VERSION = ${JSON.stringify(version)};\n` + core.concat(data).map(f => `/* ==== ${f} ==== */\n` + read(f)).join('\n') +
  '\n(window.claude && window.claude.hot && window.claude.hot.ready) ? window.claude.hot.ready(function () { ISNAD.ui.boot(); }) : ISNAD.ui.boot();\n';
if (js.includes('</script')) throw new Error('</script> trouvé dans le JS');

const page = read('src/page.html').replace('/*CSS*/', () => read('src/style.css')).replace('/*JS*/', () => js);
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/isnad.html'), page);
const cut = page.indexOf('<div id="app">');
const full = `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="ISNAD — JRPG rétro-HD en cinq sagas : les Compagnons après la mort du Prophète ﷺ.">\n${page.slice(0, cut)}</head>\n<body>\n${page.slice(cut)}\n</body>\n</html>\n`;
fs.writeFileSync(path.join(root, 'index.html'), full);
console.log(`index.html ${(full.length / 1024).toFixed(0)} Ko · dist/isnad.html ${(page.length / 1024).toFixed(0)} Ko · ${core.length + data.length} modules`);
