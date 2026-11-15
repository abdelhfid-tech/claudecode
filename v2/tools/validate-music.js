#!/usr/bin/env node
/* Valide src/data/music.js : chaque voix d'une piste doit durer exactement `beats` temps, chaque mesure tomber juste,
   chaque piste de D.TRACKS exister. Format et pistes : docs/musique.md. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const D = require('../src/core/defs.js');
const file = process.argv[2] || path.join(__dirname, '../src/data/music.js');
let err = 0; const E = m => { err++; console.log('   - ' + m); };
// une mesure mal comptée est signalée par music.js lui-même (console.warn) : ici, c'est une erreur
const tracks = {}; const ctx = { ISNAD: { registerMusic: (n, t) => { if (tracks[n]) E(`${n}: piste déclarée deux fois`); tracks[n] = t; } }, console: Object.assign({}, console, { warn: m => E(String(m)) }) }; ctx.window = ctx; ctx.globalThis = ctx;
vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
const PITCH = /^[A-G](#|b)?[1-7]$/, DR = /^[DTtrkbmshca]$/;   // percussions : dum, tek, tek léger, riq, grosse caisse, grand tambour, tom, caisse claire, charleston, cymbale, enclume
for (const [name, t] of Object.entries(tracks)) {
  if (!D.TRACKS.includes(name)) E(`${name}: piste inconnue (${D.TRACKS.join('|')})`);
  if (typeof t.bpm !== 'number' || t.bpm < 40 || t.bpm > 220) E(`${name}: bpm 40–220`);
  if (typeof t.beats !== 'number' || t.beats < 4 || t.beats > 128) E(`${name}: beats 4–128`);
  if (t.intro !== undefined && !(typeof t.intro === 'number' && t.intro >= 0 && t.intro <= t.beats - 4 && Math.abs(t.intro * 2 - Math.round(t.intro * 2)) < 1e-9)) E(`${name}: intro, en temps, par demi-temps, de 0 à beats − 4`);
  if (!Array.isArray(t.voices) || t.voices.length < 1 || t.voices.length > 8) { E(`${name}: 1 à 8 voix`); continue; }
  t.voices.forEach((v, i) => {
    if (!D.WAVES.includes(v.wave)) E(`${name} voix ${i}: wave « ${v.wave} » invalide (${D.WAVES.join('|')})`);
    if (typeof v.vol !== 'number' || v.vol <= 0 || v.vol > 1) E(`${name} voix ${i}: vol ]0,1]`);
    if (v.pan !== undefined && !(typeof v.pan === 'number' && v.pan >= -1 && v.pan <= 1)) E(`${name} voix ${i}: pan de −1 à 1`);
    let sum = 0, sounding = 0; const toks = String(v.notes || '').trim().split(/\s+/);
    toks.forEach((tk, k) => {
      const m = tk.match(/^(.+)\/(\d*\.?\d+)$/); if (!m) { E(`${name} voix ${i} jeton ${k} « ${tk} » : attendu note/durée`); return; }
      const len = parseFloat(m[2]); if (!(len >= 0.125 && len <= 16)) E(`${name} voix ${i} jeton ${k}: durée 0.125–16`); sum += len;
      if (m[1] === '-') return; sounding++;
      m[1].split('+').forEach(n => { if (!(v.wave === 'drums' ? DR.test(n) : PITCH.test(n))) E(`${name} voix ${i} jeton ${k}: « ${n} » invalide`); });
    });
    if (!sounding) E(`${name} voix ${i} (${v.wave}): aucune note`);
    if (Math.abs(sum - t.beats) > 0.001) E(`${name} voix ${i} (${v.wave}): dure ${sum} temps, attendu ${t.beats}`);
  });
}
const miss = D.TRACKS.filter(n => n !== 'silence' && !tracks[n]);
if (miss.length) E('pistes absentes : ' + miss.join(', '));
console.log(err ? `✗ ${Object.keys(tracks).length} pistes, ${err} erreur(s)` : `✓ ${Object.keys(tracks).length} pistes valides`);
process.exit(err ? 1 : 0);
