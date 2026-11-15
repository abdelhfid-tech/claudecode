#!/usr/bin/env node
/* ISNAD 2.0 — contrôle src/data/music.js avec les règles de src/core/regles.js : chaque voix d'une piste dure exactement
   `beats` temps, chaque mesure tombe juste, chaque piste de D.TRACKS existe. Format et pistes : docs/musique.md. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const D = require('../src/core/defs.js');
const file = process.argv[2] || path.join(__dirname, '../src/data/music.js');
const E = [];
// une mesure mal comptée est signalée par music.js lui-même (console.warn) : ici, c'est une erreur
const tracks = {}; const ctx = { ISNAD: { registerMusic: (n, t) => { if (tracks[n]) E.push(`${n}: piste déclarée deux fois`); tracks[n] = t; } }, console: Object.assign({}, console, { warn: m => E.push(String(m)) }) };
ctx.window = ctx; ctx.globalThis = ctx;
vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
E.push(...require('../src/core/regles.js').creer(D).verifierPistes(tracks));
E.forEach(m => console.log('   - ' + m));
console.log(E.length ? `✗ ${Object.keys(tracks).length} pistes, ${E.length} erreur(s)` : `✓ ${Object.keys(tracks).length} pistes valides`);
process.exit(E.length ? 1 : 0);
