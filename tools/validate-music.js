#!/usr/bin/env node
/* Valide src/data/music.js : chaque voix d'une piste doit durer exactement `beats` temps. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const D = require('../src/core/defs.js');
const file = process.argv[2] || path.join(__dirname, '../src/data/music.js');
const tracks = {}; const ctx = { ISNAD: { registerMusic: (n, t) => { tracks[n] = t; } }, console }; ctx.window = ctx;
vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
let err = 0; const E = m => { err++; console.log('   - ' + m); };
const PITCH = /^[A-G](#|b)?[1-7]$/, DR = /^[DTtkshc]$/;
for (const [name, t] of Object.entries(tracks)) {
  if (!D.TRACKS.includes(name)) E(`${name}: piste inconnue (${D.TRACKS.join('|')})`);
  if (typeof t.bpm !== 'number' || t.bpm < 40 || t.bpm > 220) E(`${name}: bpm 40–220`);
  if (typeof t.beats !== 'number' || t.beats < 4 || t.beats > 128) E(`${name}: beats 4–128`);
  if (!Array.isArray(t.voices) || t.voices.length < 1 || t.voices.length > 6) { E(`${name}: 1 à 6 voix`); continue; }
  t.voices.forEach((v, i) => {
    if (!D.WAVES.includes(v.wave)) E(`${name} voix ${i}: wave « ${v.wave} » invalide (${D.WAVES.join('|')})`);
    if (typeof v.vol !== 'number' || v.vol <= 0 || v.vol > 1) E(`${name} voix ${i}: vol ]0,1]`);
    let sum = 0; const toks = String(v.notes || '').trim().split(/\s+/);
    toks.forEach((tk, k) => {
      const m = tk.match(/^(.+)\/(\d*\.?\d+)$/); if (!m) { E(`${name} voix ${i} jeton ${k} « ${tk} » : attendu note/durée`); return; }
      const len = parseFloat(m[2]); if (!(len >= 0.125 && len <= 16)) E(`${name} voix ${i} jeton ${k}: durée 0.125–16`); sum += len;
      if (m[1] === '-') return;
      m[1].split('+').forEach(n => { if (!(v.wave === 'drums' ? DR.test(n) : PITCH.test(n))) E(`${name} voix ${i} jeton ${k}: « ${n} » invalide`); });
    });
    if (Math.abs(sum - t.beats) > 0.001) E(`${name} voix ${i} (${v.wave}): dure ${sum} temps, attendu ${t.beats}`);
  });
}
const miss = D.TRACKS.filter(n => n !== 'silence' && !tracks[n]);
if (miss.length) console.log('   ! pistes absentes : ' + miss.join(', '));
console.log(err ? `✗ ${Object.keys(tracks).length} pistes, ${err} erreur(s)` : `✓ ${Object.keys(tracks).length} pistes valides`);
process.exit(err ? 1 : 0);
