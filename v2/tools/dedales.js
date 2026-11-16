#!/usr/bin/env node
/* ISNAD 2.x — les labyrinthes de la noosphère, éprouvés hors du jeu.
   node v2/tools/dedales.js              dix mille graines par profondeur et par genre : chaque plan a ses lieux, du bon
                                         côté, assez grands, tous reliés ; les culs-de-sac en sont ; la même graine rend
                                         le même plan ; le chrono laisse le temps du tour. « DÉDALES CONFORMES » sinon « ÉCART ».
   node v2/tools/dedales.js 500          moins de graines (essai rapide)
   node v2/tools/dedales.js planche [fichier.png]   une planche de labyrinthes, un par profondeur et par genre */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const Dd = require(path.join(__dirname, '..', 'src', 'core', 'dedale.js'));
// le hasard du jeu (src/core/base.js, I.rng), recopié : les mêmes graines y donnent les mêmes plans
const rng = seed => { let s = (seed >>> 0) || 1; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
// le chrono (src/core/rodeurs.js le calcule de la même façon) : 30 s, plus k fois le temps du tour à la marche
const VITESSE = 62, CHRONO_K = [3.0, 2.7, 2.4, 2.1, 1.9, 1.7], chrono = (n, tour) => 30 + CHRONO_K[n] * tour * 16 / VITESSE;
const args = process.argv.slice(2);

if (args[0] === 'planche') {
  const out = args[1] || path.join(__dirname, '..', '.smoke', 'dedales', 'planche.png'); fs.mkdirSync(path.dirname(out), { recursive: true });
  const k = 5, M = 14, cols = 6, genres = ['chapitre', 'descente'], Wp = cols * (Dd.W * k + M) + M, Hp = genres.length * (Dd.H * k + M) + M, px = Buffer.alloc(Wp * Hp * 4);
  const put = (x, y, c) => { if (x < 0 || y < 0 || x >= Wp || y >= Hp) return; const i = (y * Wp + x) * 4; px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = 255; };
  for (let i = 0; i < Wp * Hp; i++) { px[i * 4] = 18; px[i * 4 + 1] = 16; px[i * 4 + 2] = 28; px[i * 4 + 3] = 255; }
  const COUL = { 0: [6, 7, 28], 1: [70, 86, 190], 2: [120, 170, 240], 3: [120, 220, 170] }, NOM = { seuil: [255, 255, 255], coeur: [255, 120, 150], issue: [255, 224, 138] };
  genres.forEach((genre, gi) => { for (let n = 0; n < 6; n++) { const p = Dd.plan(rng(1000 + n * 77 + gi * 9), n, genre), ox = M + n * (Dd.W * k + M), oy = M + gi * (Dd.H * k + M);
    for (let y = 0; y < Dd.H; y++) for (let x = 0; x < Dd.W; x++) { const c = COUL[p.g[y * Dd.W + x]]; for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) put(ox + x * k + i, oy + y * k + j, c); }
    Object.keys(p.lieux).forEach(nom => { const l = p.lieux[nom], c = NOM[nom] || [255, 240, 200]; for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (Math.abs(i) + Math.abs(j) <= 3) put(ox + l[0] * k + 2 + i, oy + l[1] * k + 2 + j, c); });
    p.loin.slice(0, 5).forEach(l => { for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) put(ox + l[0] * k + 3 + i, oy + l[1] * k + 3 + j, [255, 90, 60]); }); } });
  // un PNG sans dépendance : en-tête, une image en vraies couleurs, fin
  const crcT = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let q = 0; q < 8; q++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const bloc = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(Wp, 0); ihdr.writeUInt32BE(Hp, 4); ihdr[8] = 8; ihdr[9] = 6;
  const brut = Buffer.alloc((Wp * 4 + 1) * Hp); for (let y = 0; y < Hp; y++) px.copy(brut, y * (Wp * 4 + 1) + 1, y * Wp * 4, (y + 1) * Wp * 4);
  fs.writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), bloc('IHDR', ihdr), bloc('IDAT', zlib.deflateSync(brut)), bloc('IEND', Buffer.alloc(0))]));
  console.log('planche : ' + out + ' (' + Wp + ' × ' + Hp + ') — en haut les chapitres, en bas la descente du râwî ; de gauche à droite, de la profondeur 0 à la 5 ; en rouge, les carrefours les plus loin du seuil');
  process.exit(0);
}

const N = Math.max(10, parseInt(args[0], 10) || 10000), ecarts = []; let total = 0; const t0 = Date.now();
for (const genre of ['chapitre', 'descente']) for (let n = 0; n < 6; n++) {
  let essaisMax = 0, secours = 0, repris = 0; const m = { cellules: [1e9, 0, 0], impasses: [1e9, 0, 0], boucles: [1e9, 0, 0], tour: [1e9, 0, 0] }, vu = k => { ['cellules', 'impasses', 'boucles', 'tour'].forEach(q => { m[q][0] = Math.min(m[q][0], k[q]); m[q][1] += k[q]; m[q][2] = Math.max(m[q][2], k[q]); }); };
  for (let s = 1; s <= N; s++) { const graine = (s * 2654435761 + n * 97 + (genre === 'descente' ? 31 : 0)) >>> 0, p = Dd.plan(rng(graine), n, genre); total++;
    if (!p) { ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : aucun plan`); continue; }
    const E = Dd.verifie(p, genre); if (E.length) { ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : ${E.join(' ; ')}`); continue; }
    if (p.essais > 1) repris++; if (p.secours) secours++; essaisMax = Math.max(essaisMax, p.essais); vu(p);
    if (s % 97 === 0) { const q = Dd.plan(rng(graine), n, genre); if (!q || Buffer.compare(Buffer.from(p.g), Buffer.from(q.g)) || JSON.stringify(p.lieux) !== JSON.stringify(q.lieux)) ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : la même graine rend un autre plan`); }
    if (genre === 'descente') { ['abri', 'refuge'].forEach(a => { const l = p.lieux[a]; if (p.g[l[1] * Dd.W + l[0]] !== 3) ecarts.push(`ÉCART descente profondeur ${n} graine ${graine} : ${a} n’a pas un sol d’abri`); });
      if (!p.loin.length) ecarts.push(`ÉCART descente profondeur ${n} graine ${graine} : nulle part où poser ceux qui rôdent`); }
    if (!(chrono(n, p.tour) > p.tour * 16 / VITESSE * 1.5)) ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : le chrono ne laisse pas le temps du tour`); }
  const moy = q => Math.round(m[q][1] / N);
  console.log(`OK  ${genre} · profondeur ${n} · maille de ${Dd.PROFONDEURS[n].pas} : ${N} plans — carrefours ${m.cellules[0]}–${m.cellules[2]} (${moy('cellules')} en moyenne), impasses ${moy('impasses')}, raccourcis ${moy('boucles')}, tour ${m.tour[0]}–${m.tour[2]} cases (${moy('tour')}) → chrono ${Math.round(chrono(n, m.tour[0]))}–${Math.round(chrono(n, m.tour[2]))} s ; ${repris} retirés, ${secours} plans de repli, ${essaisMax} tirages au plus`);
}
console.log(`${total} plans tirés en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
if (ecarts.length) { console.log(ecarts.slice(0, 20).join('\n')); console.log(`✗ ${ecarts.length} ÉCART(S)`); process.exit(1); }
console.log('✓ DÉDALES CONFORMES');
