#!/usr/bin/env node
/* ISNAD 2.x — les labyrinthes de la noosphère, éprouvés hors du jeu.
   node v2/tools/dedales.js              dix mille graines par profondeur et par genre : chaque plan a ses lieux, du bon
                                         côté, assez grands, tous reliés ; les culs-de-sac en sont ; la même graine rend
                                         le même plan ; le chrono laisse le temps du tour. La pièce interdite (2.x, demande
                                         du décideur du 19 novembre) : chaque plan en a exactement une ; sa porte est une case
                                         vide bordée d'une seule case praticable, « devant », qui est un pont ; la pièce ne
                                         touche aucune case praticable hors de sa porte et reste dans la carte ; dans une
                                         descente, la porte est loin du seuil (la moitié au moins de la plus grande distance)
                                         et ne touche ni l'issue ni les abris ; g, lieux et salles sont ceux du plan sans elle,
                                         et les empreintes relevées avant elle (essais/dedales.json) sont retrouvées.
                                         « DÉDALES CONFORMES » ; sinon « ÉCART » (un plan changé, une porte praticable…) ou
                                         « ABSENT » (un plan sans pièce).
   node v2/tools/dedales.js 500          moins de graines (essai rapide)
   node v2/tools/dedales.js planche [fichier.png] [0,3,5]   une planche de labyrinthes, un par profondeur (toutes, ou
                                         celles qu'on nomme) et par genre ; la pièce interdite en rouge */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const Dd = require(path.join(__dirname, '..', 'src', 'core', 'dedale.js'));
// le hasard du jeu (src/core/base.js, I.rng), recopié : les mêmes graines y donnent les mêmes plans
const rng = seed => { let s = (seed >>> 0) || 1; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
// le chrono (src/core/rodeurs.js le calcule de la même façon) : 30 s, plus k fois le temps du tour à la marche
const VITESSE = 62, CHRONO_K = [3.0, 2.7, 2.4, 2.1, 1.9, 1.7], chrono = (n, tour) => 30 + CHRONO_K[n] * tour * 16 / VITESSE;
const args = process.argv.slice(2);

if (args[0] === 'planche') {
  const out = args[1] || path.join(__dirname, '..', '.smoke', 'dedales', 'planche.png'); fs.mkdirSync(path.dirname(out), { recursive: true });
  const prof = args[2] ? args[2].split(',').map(Number) : [0, 1, 2, 3, 4, 5];
  const k = 5, M = 14, cols = prof.length, genres = ['chapitre', 'descente'], Wp = cols * (Dd.W * k + M) + M, Hp = genres.length * (Dd.H * k + M) + M, px = Buffer.alloc(Wp * Hp * 4);
  const put = (x, y, c) => { if (x < 0 || y < 0 || x >= Wp || y >= Hp) return; const i = (y * Wp + x) * 4; px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = 255; };
  for (let i = 0; i < Wp * Hp; i++) { px[i * 4] = 18; px[i * 4 + 1] = 16; px[i * 4 + 2] = 28; px[i * 4 + 3] = 255; }
  const COUL = { 0: [6, 7, 28], 1: [70, 86, 190], 2: [120, 170, 240], 3: [120, 220, 170] }, NOM = { seuil: [255, 255, 255], coeur: [255, 120, 150], issue: [255, 224, 138] };
  genres.forEach((genre, gi) => { prof.forEach((n, ni) => { const p = Dd.plan(rng(1000 + n * 77 + gi * 9), n, genre), ox = M + ni * (Dd.W * k + M), oy = M + gi * (Dd.H * k + M);
    for (let y = 0; y < Dd.H; y++) for (let x = 0; x < Dd.W; x++) { const c = COUL[p.g[y * Dd.W + x]]; for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) put(ox + x * k + i, oy + y * k + j, c); }
    Object.keys(p.lieux).forEach(nom => { const l = p.lieux[nom], c = NOM[nom] || [255, 240, 200]; for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (Math.abs(i) + Math.abs(j) <= 3) put(ox + l[0] * k + 2 + i, oy + l[1] * k + 2 + j, c); });
    p.loin.slice(0, 5).forEach(l => { for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) put(ox + l[0] * k + 3 + i, oy + l[1] * k + 3 + j, [255, 165, 40]); });
    // la pièce interdite : sa masse en pourpre, sa porte en rouge vif barrée de blanc
    const q = p.interdite; if (q) { const s = q.salle; for (let y = s[1]; y < s[1] + s[3]; y++) for (let x = s[0]; x < s[0] + s[2]; x++) for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) put(ox + x * k + i, oy + y * k + j, (i + j) % 3 ? [120, 24, 48] : [170, 40, 70]);
      const cx = ox + q.porte[0] * k + k / 2, cy = oy + q.porte[1] * k + k / 2; // la porte : un signe d'interdit de onze points, un disque pâle cerclé et barré de rouge
      for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) { const r = Math.hypot(i, j); if (r > 5.6) continue; put(Math.floor(cx + i), Math.floor(cy + j), r > 4 || Math.abs(i - j) < 1.2 ? [235, 30, 40] : [245, 235, 232]); } } }); });
  // un PNG sans dépendance : en-tête, une image en vraies couleurs, fin
  const crcT = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let q = 0; q < 8; q++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const bloc = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(Wp, 0); ihdr.writeUInt32BE(Hp, 4); ihdr[8] = 8; ihdr[9] = 6;
  const brut = Buffer.alloc((Wp * 4 + 1) * Hp); for (let y = 0; y < Hp; y++) px.copy(brut, y * (Wp * 4 + 1) + 1, y * Wp * 4, (y + 1) * Wp * 4);
  fs.writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), bloc('IHDR', ihdr), bloc('IDAT', zlib.deflateSync(brut)), bloc('IEND', Buffer.alloc(0))]));
  console.log('planche : ' + out + ' (' + Wp + ' × ' + Hp + ') — en haut les chapitres, en bas la descente du râwî ; de gauche à droite, les profondeurs ' + prof.join(', ') + ' ; en orange, les carrefours les plus loin du seuil ; en pourpre la pièce interdite, sa porte marquée du signe d’interdit');
  process.exit(0);
}

// La pièce interdite d'un plan : ce qu'elle doit être. Rend la liste des manquements (vide si elle est bonne).
const FACE = { nord: [0, -1], sud: [0, 1], est: [1, 0], ouest: [-1, 0] }, V4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function piece(p, genre) {
  const q = p.interdite, E = []; if (!q) return ['ABSENT : le plan n’a pas de pièce interdite'];
  const W = p.w, H = p.h, dans = (x, y) => x >= 0 && y >= 0 && x < W && y < H, sol = (x, y) => dans(x, y) ? p.g[y * W + x] : 0, [x, y] = q.porte, f = FACE[q.face], s = q.salle;
  const dedans = (i, j) => i >= s[0] && i < s[0] + s[2] && j >= s[1] && j < s[1] + s[3];
  if (!f) E.push(`ÉCART face inconnue (${q.face})`);
  if (!dans(x, y)) E.push('ÉCART la porte est hors de la carte'); else if (sol(x, y)) E.push('ÉCART la porte est une case praticable');
  const autour = V4.filter(d => sol(x + d[0], y + d[1]) > 0).map(d => [x + d[0], y + d[1]]);
  if (autour.length !== 1) E.push(`ÉCART la porte est bordée de ${autour.length} cases praticables`);
  else if (autour[0][0] !== q.devant[0] || autour[0][1] !== q.devant[1]) E.push('ÉCART « devant » n’est pas la case qui borde la porte');
  if (f && (q.devant[0] !== x + f[0] || q.devant[1] !== y + f[1])) E.push('ÉCART « devant » n’est pas du côté où regarde la porte');
  if (sol(q.devant[0], q.devant[1]) !== 1) E.push('ÉCART « devant » n’est pas un pont (une salle nommée, un abri ?)');
  if (!(s[2] >= 1 && s[3] >= 1)) E.push('ABSENT : la pièce n’a aucune case');
  else {
    if (!dans(s[0], s[1]) || !dans(s[0] + s[2] - 1, s[1] + s[3] - 1)) E.push('ÉCART la pièce sort de la carte');
    let praticable = false, touche = false; for (let j = s[1]; j < s[1] + s[3]; j++) for (let i = s[0]; i < s[0] + s[2]; i++) { if (sol(i, j)) praticable = true; if (V4.some(d => sol(i + d[0], j + d[1]) > 0)) touche = true; }
    if (praticable) E.push('ÉCART une case de la pièce est praticable'); if (touche) E.push('ÉCART la pièce touche une case praticable');
    if (f && !dedans(x - f[0], y - f[1])) E.push('ÉCART la pièce n’est pas derrière la porte'); if (dedans(x, y)) E.push('ÉCART la porte est dans la pièce');
  }
  if (genre === 'descente') {
    const d0 = Dd.distances(p, p.lieux.seuil); let m = 0; for (const v of d0) m = Math.max(m, v); const dp = d0[q.devant[1] * W + q.devant[0]];
    if (dp < m / 2) E.push(`ÉCART la porte est trop près du seuil (${dp} pas, la plus grande distance en a ${m})`);
    ['issue', 'abri', 'refuge'].forEach(n => { const r = p.salles[n], ec = (x0, y0, x1, y1) => Math.max(0, r[0] - x1, x0 - (r[0] + r[2] - 1), r[1] - y1, y0 - (r[1] + r[3] - 1));
      if (Math.min(ec(x, y, x, y), ec(s[0], s[1], s[0] + s[2] - 1, s[1] + s[3] - 1)) < 2) E.push(`ÉCART la porte ou la pièce touche ${n === 'issue' ? 'l’issue' : n === 'abri' ? 'l’abri' : 'le refuge'}`); });
  }
  return E;
}
// un hasard qui compte ce qu'on lui demande : le plan avec sa pièce n'en demande pas plus que le plan nu
const compte = seed => { const r = rng(seed), f = () => { f.n++; return r(); }; f.n = 0; return f; };
const REPLIS = ['au fond d’un cul-de-sac', 'au fond d’un cul-de-sac, pièce plus petite', 'sur le côté d’un cul-de-sac', 'sur le pourtour, pièce dans la marge', 'dans un cul-de-sac, plus près d’un lieu', 'sur un autre pont', 'n’importe où sur un pont', 'une descente posée comme un chapitre'];
const replis = REPLIS.map(() => 0); let petites = 0, comparés = 0;

const N = Math.max(10, parseInt(args[0], 10) || 10000), ecarts = []; let total = 0; const t0 = Date.now();
for (const genre of ['chapitre', 'descente']) for (let n = 0; n < 6; n++) {
  let essaisMax = 0, secours = 0, repris = 0, aires = []; const m = { cellules: [1e9, 0, 0], impasses: [1e9, 0, 0], boucles: [1e9, 0, 0], tour: [1e9, 0, 0] }, vu = k => { ['cellules', 'impasses', 'boucles', 'tour'].forEach(q => { m[q][0] = Math.min(m[q][0], k[q]); m[q][1] += k[q]; m[q][2] = Math.max(m[q][2], k[q]); }); };
  const rp = REPLIS.map(() => 0);
  for (let s = 1; s <= N; s++) { const graine = (s * 2654435761 + n * 97 + (genre === 'descente' ? 31 : 0)) >>> 0, h = compte(graine), p = Dd.plan(h, n, genre); total++;
    if (!p) { ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : aucun plan`); continue; }
    const E = Dd.verifie(p, genre); if (E.length) { ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : ${E.join(' ; ')}`); continue; }
    // la pièce interdite : une, bien posée ; avec ou sans elle, le même plan
    piece(p, genre).forEach(e => ecarts.push(e.replace(/^(ÉCART|ABSENT)\s*:?\s*/, `$1 ${genre} profondeur ${n} graine ${graine} : pièce interdite — `)));
    if (p.interdite) { rp[p.interdite.repli]++; replis[p.interdite.repli]++; if (p.interdite.petite) petites++; aires.push(p.interdite.salle[2] * p.interdite.salle[3]);
      const g0 = Buffer.from(p.g), avant = JSON.stringify(p.interdite), encore = Dd.interdite(p, genre);
      if (Buffer.compare(g0, Buffer.from(p.g)) || JSON.stringify(encore) !== avant) ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : la pièce interdite, choisie une seconde fois, change le plan ou change de place`); }
    if (s % 5 === 0) { const h2 = compte(graine), nu = Dd.plan(h2, n, genre, true); comparés++;
      if (!nu || nu.interdite || Buffer.compare(Buffer.from(p.g), Buffer.from(nu.g)) || JSON.stringify(p.lieux) !== JSON.stringify(nu.lieux) || JSON.stringify(p.salles) !== JSON.stringify(nu.salles) || h.n !== h2.n || p.tour !== nu.tour || JSON.stringify(p.loin) !== JSON.stringify(nu.loin))
        ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : le plan n’est plus le même avec sa pièce interdite que sans elle (hasard : ${h.n} et ${h2.n} tirages)`); }
    if (p.essais > 1) repris++; if (p.secours) secours++; essaisMax = Math.max(essaisMax, p.essais); vu(p);
    if (s % 97 === 0) { const q = Dd.plan(rng(graine), n, genre); if (!q || Buffer.compare(Buffer.from(p.g), Buffer.from(q.g)) || JSON.stringify(p.lieux) !== JSON.stringify(q.lieux)) ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : la même graine rend un autre plan`); }
    if (genre === 'descente') { ['abri', 'refuge'].forEach(a => { const l = p.lieux[a]; if (p.g[l[1] * Dd.W + l[0]] !== 3) ecarts.push(`ÉCART descente profondeur ${n} graine ${graine} : ${a} n’a pas un sol d’abri`); });
      if (!p.loin.length) ecarts.push(`ÉCART descente profondeur ${n} graine ${graine} : nulle part où poser ceux qui rôdent`); }
    if (!(chrono(n, p.tour) > p.tour * 16 / VITESSE * 1.5)) ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : le chrono ne laisse pas le temps du tour`); }
  const moy = q => Math.round(m[q][1] / N); aires.sort((a, b) => a - b);
  console.log(`OK  ${genre} · profondeur ${n} · maille de ${Dd.PROFONDEURS[n].pas} : ${N} plans — carrefours ${m.cellules[0]}–${m.cellules[2]} (${moy('cellules')} en moyenne), impasses ${moy('impasses')}, raccourcis ${moy('boucles')}, tour ${m.tour[0]}–${m.tour[2]} cases (${moy('tour')}) → chrono ${Math.round(chrono(n, m.tour[0]))}–${Math.round(chrono(n, m.tour[2]))} s ; ${repris} retirés, ${secours} plans de repli, ${essaisMax} tirages au plus`);
  console.log(`    pièce interdite : ${rp.map((k, i) => k ? `${REPLIS[i]} ${k}` : '').filter(Boolean).join(' · ')} ; de ${aires[0]} à ${aires[aires.length - 1]} cases (${aires[aires.length >> 1]} au milieu)`);
}
// les empreintes relevées avant la pièce interdite (tools/essais/dedales.json) : g, lieux et salles, puis tour, loin et le reste
{ const fnv = b => { let h = 2166136261; for (let i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0'); }, tri = o => JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]]));
  const avant = JSON.parse(fs.readFileSync(path.join(__dirname, 'essais', 'dedales.json'), 'utf8')); let diff = 0;
  Object.keys(avant).forEach(cle => { const [genre, n, graine] = cle.split('/'), p = Dd.plan(rng(+graine), +n, genre);
    const e = fnv(Buffer.concat([Buffer.from(p.g), Buffer.from(tri(p.lieux)), Buffer.from(tri(p.salles))])) + ' ' + fnv(Buffer.from(JSON.stringify([p.tour, p.loin, p.essais, !!p.secours, p.pas, p.cellules, p.impasses, p.boucles])));
    if (e !== avant[cle]) { diff++; ecarts.push(`ÉCART ${genre} profondeur ${n} graine ${graine} : son plan n’est plus celui d’avant la pièce interdite (${avant[cle]} → ${e})`); } });
  console.log(`${diff ? 'ÉCART' : 'OK '} empreintes d’avant la pièce interdite : ${Object.keys(avant).length - diff} sur ${Object.keys(avant).length} retrouvées (g, lieux, salles, tour, loin)`); }
console.log(`pièce interdite, sur ${total} plans : ${replis.map((k, i) => `${REPLIS[i]} ${k}`).join(' · ')} ; ${petites} pièces de moins de quatre cases ; ${comparés} plans comparés à leur plan nu`);
console.log(`${total} plans tirés en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
if (ecarts.length) { console.log(ecarts.slice(0, 20).join('\n')); console.log(`✗ ${ecarts.length} ÉCART(S)`); process.exit(1); }
console.log('✓ DÉDALES CONFORMES');
