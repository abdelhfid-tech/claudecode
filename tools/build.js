#!/usr/bin/env node
/* Assemble le jeu en un seul fichier.
   - index.html          : page autonome (dépôt, hébergement statique)
   - dist/isnad.html     : fragment sans <html>/<head>/<body> (publication en Artifact) */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const core = ['defs', 'base', 'gfx', 'sprites', 'maps', 'script', 'world', 'build', 'trade', 'battle', 'ui'].map(n => `src/core/${n}.js`);
const data = ['src/data/frame.js', 'src/data/music.js', 'src/data/caid.js'].filter(f => fs.existsSync(path.join(root, f))).concat(fs.readdirSync(path.join(root, 'src/data')).filter(f => /^saga_.*\.js$/.test(f)).sort().map(f => 'src/data/' + f));
const js = core.concat(data).map(f => `/* ==== ${f} ==== */\n` + read(f)).join('\n') +
  '\n(window.claude && window.claude.hot && window.claude.hot.ready) ? window.claude.hot.ready(function () { ISNAD.ui.boot(); }) : ISNAD.ui.boot();\n';
if (js.includes('</script')) throw new Error('</script> trouvé dans le JS');

const page = read('src/page.html').replace('/*CSS*/', () => read('src/style.css')).replace('/*JS*/', () => js);
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/isnad.html'), page);
const cut = page.indexOf('<div id="app">');
const full = `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="ISNAD — JRPG rétro-HD en cinq sagas : les Compagnons après la mort du Prophète ﷺ.">\n${page.slice(0, cut)}</head>\n<body>\n${page.slice(cut)}\n</body>\n</html>\n`;
fs.writeFileSync(path.join(root, 'index.html'), full);
console.log(`index.html ${(full.length / 1024).toFixed(0)} Ko · dist/isnad.html ${(page.length / 1024).toFixed(0)} Ko · ${core.length + data.length} modules`);
