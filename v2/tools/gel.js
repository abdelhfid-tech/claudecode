#!/usr/bin/env node
/* Le gel de la version 1.32 — la version légère : la 1.31 gelée le 15 novembre, avec ses grands personnages redessinés
   le 16 novembre à la demande du décideur (seul src/core/sprites.js a changé, puis le jeu a été réassemblé une fois).
   La 1.32 est le jeu léger en un fichier : src/, index.html, dist/isnad.html et ses outils, à la racine du dépôt.
   Elle ne change plus. La 2.0 se construit à côté, dans v2/, et ne doit jamais l'atteindre.
   Cet outil compare chaque fichier gelé à son empreinte (v2/gel-1.32.json).
   Usage : node v2/tools/gel.js            contrôle ; code de sortie 1 si un fichier a changé, manque ou s'est ajouté
           node v2/tools/gel.js relever    écrit les empreintes, une seule fois (refusé si elles existent déjà) */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const RACINE = path.join(__dirname, '..', '..'), FICHE = path.join(__dirname, '..', 'gel-1.32.json');
const OUTILS = ['build', 'validate', 'validate-music', 'mesure-musique', 'smoke', 'doigt', 'bataille', 'son'].map(n => 'tools/' + n + '.js');

const sous = d => fs.readdirSync(path.join(RACINE, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? sous(d + '/' + e.name) : [d + '/' + e.name]);
const geles = () => sous('src').concat(['index.html', 'dist/isnad.html'], OUTILS).sort();
const empreinte = f => crypto.createHash('sha256').update(fs.readFileSync(path.join(RACINE, f))).digest('hex');

if (process.argv[2] === 'relever') {
  if (fs.existsSync(FICHE)) { console.log('✗ les empreintes existent déjà : le gel ne se refait pas (v2/gel-1.32.json)'); process.exit(1); }
  let commit = ''; try { commit = require('child_process').execSync('git log -1 --format=%h -- src index.html dist', { cwd: RACINE, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (e) { /* hors dépôt */ }
  const fichiers = {}; geles().forEach(f => { fichiers[f] = empreinte(f); });
  fs.writeFileSync(FICHE, JSON.stringify({ version: '1.32', publication: 'Artifact privé du jeu, version 32', commit, fichiers }, null, 1) + '\n');
  console.log(`✓ gel relevé : ${Object.keys(fichiers).length} fichiers, commit ${commit || '?'}`); process.exit(0);
}

if (!fs.existsSync(FICHE)) { console.log('✗ v2/gel-1.32.json est absent : rien ne garantit plus la 1.32'); process.exit(1); }
const G = JSON.parse(fs.readFileSync(FICHE, 'utf8')), ecarts = [], la = new Set(geles());
Object.keys(G.fichiers).forEach(f => { if (!fs.existsSync(path.join(RACINE, f))) ecarts.push('manque  ' + f); else if (empreinte(f) !== G.fichiers[f]) ecarts.push('modifié ' + f); });
la.forEach(f => { if (!G.fichiers[f]) ecarts.push('ajouté  ' + f); });
if (ecarts.length) { console.log(`✗ LA 1.32 A CHANGÉ — ${ecarts.length} écart(s)`); ecarts.forEach(e => console.log('   - ' + e)); process.exit(1); }
console.log(`✓ 1.32 INTACTE — ${Object.keys(G.fichiers).length} fichiers conformes au gel (commit ${G.commit})`);
