#!/usr/bin/env node
/* ISNAD 2.0 — les silhouettes : ce que le moteur dessine d'un personnage (src/core/sprites.js).
   Usage : node tools/silhouettes.js                    contrôle
           node tools/silhouettes.js relever            écrit les empreintes, une seule fois (refusé si elles existent déjà)
           node tools/silhouettes.js planches [modèles] planches agrandies dans .smoke/silhouettes/ ; [modèles] : une image de
                                                        sept modèles (7 × 2 cases de 32 × 48), pour la planche de comparaison
   1. Les petits sprites (16 × 24, ceux qui marchent sur les cartes) : quatre directions, trois pas, six poses, pour tous
      les personnages du jeu, les tenues du râwî, toutes les coiffes et les variantes d'équipement. Ils sont ceux relevés
      avant que le grand sprite soit redessiné (tools/essais/silhouettes.json) : sinon « ÉCART ».
   2. L'interrupteur (gfx.natif = false) rend le grand sprite d'avant, à l'identique : sinon « ÉCART ».
   3. Personne n'a de visage : dans chaque grand sprite — toutes les vues, les pas, les poses — le voile est une seule
      surface, d'un seul tenant sur chaque ligne et chaque colonne, sans trou : sinon « TRAIT ».
   4. Chaque coiffe a sa tête native de face et de profil (le dos, jamais montré en grand, garde le dessin d'avant) ;
      aucune tête ne sort de la grille, aucun sprite n'est vide : sinon « ABSENT ».
   Sortie : « OK » par preuve, puis « SILHOUETTES CONFORMES ». Code 1 à la première anomalie.
   JEU=../index.html node tools/silhouettes.js : le même contrôle sur la version légère, qui porte le même sprites.js. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const V2 = path.join(__dirname, '..'), FICHE = path.join(__dirname, 'essais', 'silhouettes.json'), out = path.join(V2, '.smoke/silhouettes');
const url = 'file://' + path.resolve(V2, process.env.JEU || 'index.html'); // JEU=../index.html : le même contrôle sur la version légère
const mode = process.argv[2] || '';
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); };
const COIFFES = ['imama', 'imama_haute', 'imama_large', 'imama_queue', 'calotte', 'casque', 'casque_turban', 'casque_cuir', 'casque_bandes', 'coiffe_mailles', 'capuche', 'tiare', 'litham', 'keffieh'];

/* ---------- dans la page : l'inventaire de ce que le jeu peut dessiner ---------- */
const INVENTAIRE = COIFFES => {
  const I = window.ISNAD, G = I.gfx, D = I.D, vus = new Map();
  const pose = (groupe, nom, look) => { const k = JSON.stringify(look); if (!vus.has(k)) vus.set(k, { groupe, nom, look }); };
  const pnj = o => { const look = Object.assign({ kind: 'homme', robe: '#8a7355', head: '#e6dcc4' }, o.look); // comme world.js
    if ((look.kind === 'soldat' || look.kind === 'romain') && !look.item && !look.coiffe) look.sel = I.hash(o.id || o.name || '') % 97; return look; };
  const heros = {};
  Object.values(I.sagas).forEach(s => {
    Object.entries(s.heroes || {}).forEach(([id, h]) => { const L = Object.assign({ kind: 'compagnon' }, h.look); heros[id] = L; pose('héros', s.id + '/' + id, L); });
    const marche = (o, sous) => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) { o.forEach(v => marche(v, sous)); return; }
      if (o.look && typeof o.look === 'object' && !Array.isArray(o.look)) pose('gens', s.id + '/' + (o.id || o.name || '?'), pnj(o));
      Object.keys(o).forEach(k => { if (k !== 'heroes' && k !== 'look') marche(o[k], k); }); };
    marche(s, '');
  });
  Object.values(D.RANGS || {}).forEach(T => pose('rangs', T.name, Object.assign({ kind: 'soldat', robe: '#8a7355', head: '#cdbf9f' }, T.look)));
  (D.TENUES || []).forEach(t => pose('tenues', t.id, Object.assign({ kind: 'compagnon' }, t.look)));
  Object.keys(G.KINDS).forEach(k => { pose('types', k, { kind: k, robe: '#8a7355', head: '#e6dcc4' });
    if (k === 'soldat' || k === 'romain') for (let i = 0; i < 7; i++) pose('types', k + ' ' + i, { kind: k, robe: '#6a5a40', head: '#e2d8c2', sel: i }); });
  // toutes les coiffes, sous chaque manteau ; puis les motifs et les étoffes
  const neutre = { kind: 'homme', robe: '#8a7355', head: '#e6dcc4', cloak: '#5a4632' };
  COIFFES.forEach(c => ['aucun', 'epaule', 'long', 'ample'].forEach(m => pose('coiffes', c + ' · ' + m, Object.assign({}, neutre, { coiffe: c, manteau: m }))));
  [{ motif: 'rayures' }, { motif: 'bandes', manteau: 'ample' }, { echarpe: true }, { chale: true }, { court: true }, { court: true, manteau: 'aucun' }, { cuirasse: true }].forEach((v, i) =>
    pose('étoffes', Object.keys(v).join('+'), Object.assign({}, neutre, { coiffe: 'imama', manteau: 'long' }, v)));
  // l'équipement, tel que gear.js le pose sur une silhouette : coiffe, armure, objets tenus
  const OBJETS = ['sabre', 'lance', 'baton', 'bouclier', 'bouclier_cuir', 'bouclier_bois', 'pavois', 'arc', 'dague', 'masse', 'calame', 'tablette', 'outre', 'durra', 'etendard', 'feuillets', 'bourse'];
  ['abubakr', 'khalid', 'umar', 'idris'].forEach(id => { const B = Object.assign({}, heros[id]); delete B.item; delete B.cuirasse; if (!heros[id]) return;
    ['casque', 'casque_turban', 'casque_cuir', 'casque_bandes', 'coiffe_mailles'].forEach(c => pose('équipement', id + ' · ' + c, Object.assign({}, B, { coiffe: c })));
    ['cuir', 'lamelles', 'mailles', 'matelasse'].forEach(a => pose('équipement', id + ' · ' + a, Object.assign({}, B, { armure: a })));
    OBJETS.forEach(o => pose('équipement', id + ' · ' + o, Object.assign({}, B, { item: [o] })));
    [['sabre', 'bouclier'], ['lance', 'pavois'], ['lance', 'bouclier_bois'], ['masse', 'bouclier_cuir'], ['baton', 'outre']].forEach(o => pose('équipement', id + ' · ' + o.join('+'), Object.assign({}, B, { item: o })));
    pose('équipement', id + ' · tout', Object.assign({}, B, { coiffe: 'casque', armure: 'mailles', item: ['sabre', 'bouclier'] })); });
  return [...vus.values()];
};
/* ---------- dans la page : l'empreinte des images d'une liste de silhouettes ---------- */
const EMPREINTES = ([looks, grands, ancien]) => {
  const G = window.ISNAD.gfx; if (ancien) G.natif = false; // l'interrupteur : le grand sprite d'avant
  const POSES = window.ISNAD.D.POSES, hx = n => ('0000000' + n.toString(16)).slice(-8);
  const fnv = (h, d) => { for (let i = 0; i < d.length; i++) { h ^= d[i]; h = Math.imul(h, 16777619); } return h >>> 0; };
  const octets = cv => cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  return looks.map(L => { let a = 2166136261, b = 0x9747b28c, c = 2166136261, e = 0x9747b28c;
    const p = cv => { const d = octets(cv); a = fnv(a, d); b = fnv(b, d); }, g = cv => { const d = octets(cv); c = fnv(c, d); e = fnv(e, d); };
    p(G.charSheet(L)); POSES.forEach(q => [0, 1, 2, 3].forEach(dir => p(G.charPose(L, dir, q))));
    if (grands) [0, 1, 2, 3].forEach(dir => { [0, 1, 2].forEach(f => g(G.charGrand(L, dir, f))); POSES.forEach(q => g(G.charGrand(L, dir, 0, q))); });
    return [hx(a) + hx(b), grands ? hx(c) + hx(e) : '']; });
};
/* ---------- dans la page : le voile de chaque grand sprite, et ce que le moteur en dit ---------- */
const VOILES = looks => {
  const G = window.ISNAD.gfx, POSES = window.ISNAD.D.POSES, faux = []; let vues = 0, natives = 0;
  const voile = rows => { const H = rows.length, W = rows[0].length, V = (x, y) => y >= 0 && y < H && x >= 0 && x < W && (rows[y][x] === 'V' || rows[y][x] === 'v');
    let n = 0, d = null; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (V(x, y)) { n++; d = d || [x, y]; }
    if (!n) return null;
    const vu = new Set(), pile = [d]; while (pile.length) { const [x, y] = pile.pop(), k = y * W + x; if (vu.has(k) || !V(x, y)) continue; vu.add(k); pile.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
    if (vu.size !== n) return 'le voile est en plusieurs morceaux';
    const hors = new Set(), bord = []; for (let x = 0; x < W; x++) bord.push([x, 0], [x, H - 1]); for (let y = 0; y < H; y++) bord.push([0, y], [W - 1, y]);
    while (bord.length) { const [x, y] = bord.pop(), k = y * W + x; if (x < 0 || y < 0 || x >= W || y >= H || hors.has(k) || V(x, y)) continue; hors.add(k); bord.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!V(x, y) && !hors.has(y * W + x)) return `une marque dans le voile (colonne ${x}, ligne ${y})`;
    for (let y = 0; y < H; y++) { let runs = 0; for (let x = 0; x < W; x++) if (V(x, y) && !V(x - 1, y)) runs++; if (runs > 1) return `le voile est coupé en deux sur la ligne ${y}`; }
    for (let x = 0; x < W; x++) { let runs = 0; for (let y = 0; y < H; y++) if (V(x, y) && !V(x, y - 1)) runs++; if (runs > 1) return `le voile est coupé en deux sur la colonne ${x}`; }
    return null; };
  let fines = 0;
  looks.forEach(({ nom, look }) => [0, 1, 2, 3].forEach(dir => [[0, null], [1, null], [2, null]].concat(POSES.map(p => [0, p])).forEach(([f, p]) => {
    const r = G.charGrille(look, dir, f, p), ou = `${nom} · ${['face', 'profil gauche', 'profil droit', 'dos'][dir]}${p ? ' · ' + p : f ? ' · pas ' + f : ''}`; vues++;
    if (r.natif) natives++;
    const pleines = r.lignes.reduce((s, l) => s + l.replace(/\./g, '').length, 0);
    if (r.lignes.length !== 48 || r.lignes.some(l => l.length !== 32)) faux.push(['ABSENT', ou + ' : la grille n’a pas 32 × 48']);
    else if (pleines < 120) faux.push(['ABSENT', ou + ` : sprite presque vide (${pleines} cases)`]);
    if (r.hors) faux.push(['ABSENT', ou + ` : ${r.hors} case(s) de la tête sortent de la grille`]);
    const t = voile(r.lignes); if (t) faux.push(['TRAIT', ou + ' : ' + t]);
    // 2.x : le même personnage tracé deux fois plus fin (le combat, les menus) — sa grille de 64 × 96 obéit à la même règle
    if (r.natif && G.figure) { const rf = G.charGrille(look, dir, f, p, 2); fines++; if (rf.lignes.length !== 96 || rf.lignes.some(l => l.length !== 64)) faux.push(['ABSENT', ou + ' : la grille fine n’a pas 64 × 96']); else { const tf = voile(rf.lignes); if (tf) faux.push(['TRAIT', ou + ' (dessin fin) : ' + tf]); } } })));
  return { faux, vues, natives, fines };
};
/* ---------- dans la page : une planche (les cases de gauche à droite, agrandies k fois) ---------- */
const PLANCHE = async ({ cases, k, cols, titre }) => {
  const G = window.ISNAD.gfx, pas = 32 * k + 14, haut = 48 * k + 30, t0 = titre ? 30 : 8, n = cases.length, rangs = Math.ceil(n / cols);
  const cv = document.createElement('canvas'); cv.width = cols * pas + 14; cv.height = rangs * haut + t0 + 6; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
  c.fillStyle = '#12101c'; c.fillRect(0, 0, cv.width, cv.height); c.textBaseline = 'top';
  if (titre) { c.fillStyle = '#e9c877'; c.font = '600 15px sans-serif'; c.fillText(titre, 14, 8); }
  const images = {}; for (const q of cases) if (q.image && !images[q.image]) { const im = new Image(); await new Promise(r => { im.onload = r; im.onerror = r; im.src = q.image; }); images[q.image] = im; }
  cases.forEach((q, i) => { const x = 14 + (i % cols) * pas, y = t0 + Math.floor(i / cols) * haut;
    c.fillStyle = '#07060d'; c.fillRect(x - 3, y - 3, 32 * k + 6, 48 * k + 6);
    if (q.image) c.drawImage(images[q.image], q.sx * 32, q.sy * 48, 32, 48, x, y, 32 * k, 48 * k);
    else if (q.look) { const avant = G.natif; if (q.ancien) G.natif = false; const g = G.charGrand(q.look, q.dir || 0, q.frame || 0, q.pose); G.natif = avant; c.drawImage(g, x, y, 32 * k, 48 * k); }
    c.fillStyle = q.ancien ? '#8f8aa6' : '#d8d2e6'; c.font = '12px sans-serif'; c.fillText(q.legende || '', x, y + 48 * k + 8); });
  return cv.toDataURL('image/png');
};

(async () => {
  const browser = await chromium.launch(); let errors = [];
  const ouvrir = async () => { const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
    page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url); await page.waitForTimeout(1500); return page; };
  // par paquets, dans une page neuve à chaque fois : le moteur garde chaque image qu'il a dessinée
  const parPaquets = async (liste, n, fn, arg) => { const res = []; for (let i = 0; i < liste.length; i += n) { const page = await ouvrir(); res.push(await page.evaluate(fn, arg ? arg(liste.slice(i, i + n)) : liste.slice(i, i + n))); await page.context().close(); } return res; };
  let page = await ouvrir();
  const inv = await page.evaluate(INVENTAIRE, COIFFES), natif = await page.evaluate(() => typeof window.ISNAD.gfx.charGrille === 'function'); await page.context().close();
  // la couleur du rayonnement (look.rayon) ne touche que le voile du grand personnage, en dessin fin : l'empreinte d'un petit sprite se cherche sans elle
  const sansRayon = look => { const L = Object.assign({}, look); delete L.rayon; return L; };
  const cles = inv.map(q => JSON.stringify(sansRayon(q.look))), groupes = {}; inv.forEach(q => { groupes[q.groupe] = (groupes[q.groupe] || 0) + 1; });
  const detail = Object.entries(groupes).map(([g, n]) => `${n} ${g}`).join(', ');

  /* ---------- relever : une seule fois, avant de toucher au dessin ---------- */
  if (mode === 'relever') {
    if (fs.existsSync(FICHE)) { console.log('✗ les empreintes existent déjà : elles ne se refont pas (tools/essais/silhouettes.json)'); await browser.close(); process.exit(1); }
    const E = (await parPaquets(inv.map(q => q.look), 60, EMPREINTES, l => [l, true])).flat(), sprites = {}; cles.forEach((k, i) => { sprites[k] = E[i]; });
    if (errors.length) { console.log('✗ erreur console : ' + errors[0]); await browser.close(); process.exit(1); }
    fs.writeFileSync(FICHE, JSON.stringify({ note: 'Empreintes des silhouettes telles que le moteur les dessinait avant le grand sprite natif : [petits sprites (4 directions × 3 pas, 6 poses × 4 directions), grands sprites]. Relevé par tools/silhouettes.js relever.', sprites }, null, 0).replace(/"\],"/g, '"],\n"') + '\n');
    console.log(`✓ empreintes relevées : ${cles.length} silhouettes (${detail})`); await browser.close(); process.exit(0);
  }

  /* ---------- planches ---------- */
  if (mode === 'planches') {
    fs.mkdirSync(out, { recursive: true });
    const ecrire = async (nom, spec) => { const p = await ouvrir(), u = await p.evaluate(PLANCHE, spec); await p.context().close(); fs.writeFileSync(path.join(out, nom + '.png'), Buffer.from(u.split(',')[1], 'base64')); console.log('   ' + path.join('.smoke/silhouettes', nom + '.png') + ` — ${spec.cases.length} cases`); };
    const de = g => inv.filter(q => q.groupe === g), H = de('héros'), ident = q => q.nom.split('/')[1], N = { 0: 'face', 1: 'profil', 3: 'dos' };
    const modele = process.argv[3] && fs.existsSync(process.argv[3]) ? 'data:image/png;base64,' + fs.readFileSync(process.argv[3]).toString('base64') : null;
    // 1. la comparaison : aujourd'hui, demain, le modèle — de face et de profil
    const SEPT = ['abubakr', 'umar', 'khalid', 'uthman', 'ali', 'caid', 'idris'], sept = SEPT.map(id => H.find(q => ident(q) === id)).filter(Boolean);
    for (const [nom, ids] of [['comparaison-1', ['abubakr', 'khalid']], ['comparaison-2', ['umar', 'uthman']], ['comparaison-3', ['ali', 'caid']], ['comparaison-4', ['idris']]]) {
      const cases = []; ids.forEach(id => { const q = sept.find(x => ident(x) === id), col = SEPT.indexOf(id); if (!q) return; [0, 1].forEach(dir => {
        cases.push({ look: q.look, dir, ancien: true, legende: `${id} · ${N[dir]} · aujourd’hui` }, { look: q.look, dir, legende: `${id} · ${N[dir]} · demain` });
        if (modele) cases.push({ image: modele, sx: col, sy: dir, legende: `${id} · ${N[dir]} · le modèle` }); }); });
      await ecrire(nom, { cases, k: 8, cols: modele ? 6 : 4, titre: 'Aujourd’hui · demain' + (modele ? ' · le modèle' : '') });
    }
    // 1 bis. les sept d'un coup d'œil : une rangée par état, de face puis de profil
    for (const [nom, dir] of [['les-sept-face', 0], ['les-sept-profil', 1]]) {
      const cases = sept.map(q => ({ look: q.look, dir, ancien: true, legende: ident(q) + ' · aujourd’hui' })).concat(sept.map(q => ({ look: q.look, dir, legende: ident(q) + ' · demain' })),
        modele ? sept.map(q => ({ image: modele, sx: SEPT.indexOf(ident(q)), sy: dir, legende: ident(q) + ' · le modèle' })) : []);
      await ecrire(nom, { cases, k: 6, cols: sept.length, titre: (dir ? 'De profil' : 'De face') + ' — aujourd’hui · demain' + (modele ? ' · le modèle' : '') });
    }
    // 2. tous les héros : face et profil (le dos, jamais montré en grand, garde le dessin d'avant)
    for (let i = 0; i < H.length; i += 7) await ecrire('heros-' + (i / 7 + 1), { cases: [0, 1].flatMap(dir => H.slice(i, i + 7).map(q => ({ look: q.look, dir, legende: ident(q) + ' · ' + N[dir] }))), k: 6, cols: Math.min(7, H.length - i), titre: 'Les héros' });
    // 3. toutes les coiffes : face et profil (manteau long)
    const C = de('coiffes').filter(q => q.nom.endsWith('long'));
    for (let i = 0; i < C.length; i += 7) await ecrire('coiffes-' + (i / 7 + 1), { cases: [0, 1].flatMap(dir => C.slice(i, i + 7).map(q => ({ look: q.look, dir, legende: q.nom.split(' · ')[0] + ' · ' + N[dir] }))), k: 6, cols: Math.min(7, C.length - i), titre: 'Les coiffes' });
    // 4. le combat : de profil, les trois pas et les poses ; puis l'équipement
    const combat = q => [0, 1, 2].map(f => ({ look: q.look, dir: 1, frame: f, legende: ident(q) + ' · pas ' + f })).concat(['garde', 'accable', 'resolu', 'salut'].map(p => ({ look: q.look, dir: 1, pose: p, legende: ident(q) + ' · ' + p })));
    for (let i = 0; i < sept.length; i += 2) await ecrire('combat-' + (i / 2 + 1), { cases: sept.slice(i, i + 2).flatMap(combat), k: 6, cols: 7, titre: 'En combat : la marche et les poses' });
    const poses = q => [null].concat(['prie', 'resolu', 'accable', 'salut', 'surpris', 'garde']).map(p => ({ look: q.look, dir: 0, pose: p, legende: ident(q) + ' · ' + (p || 'debout') }));
    for (let i = 0; i < sept.length; i += 2) await ecrire('poses-' + (i / 2 + 1), { cases: sept.slice(i, i + 2).flatMap(poses), k: 6, cols: 7, titre: 'De face : les six attitudes' });
    const Eq = de('équipement');
    for (let i = 0; i < Eq.length; i += 14) await ecrire('equipement-' + (i / 14 + 1), { cases: [0, 1].flatMap(dir => Eq.slice(i, i + 14).map(q => ({ look: q.look, dir, legende: q.nom.replace(' · ', ' ') }))), k: 4, cols: 14, titre: 'L’équipement' });
    // 5. les tenues du râwî, les types de gens
    const T = de('tenues'); if (T.length) await ecrire('tenues', { cases: [0, 1].flatMap(dir => T.map(q => ({ look: q.look, dir, legende: q.nom + ' · ' + N[dir] }))), k: 6, cols: T.length, titre: 'Les tenues du râwî' });
    const K = de('types'); for (let i = 0; i < K.length; i += 14) await ecrire('types-' + (i / 14 + 1), { cases: [0, 1].flatMap(dir => K.slice(i, i + 14).map(q => ({ look: q.look, dir, legende: q.nom }))), k: 4, cols: Math.min(14, K.length - i), titre: 'Les gens' });
    if (errors.length) console.log('ÉCART erreur console : ' + errors[0]);
    await browser.close(); process.exit(errors.length ? 1 : 0);
  }

  /* ---------- contrôle ---------- */
  if (!fs.existsSync(FICHE)) { console.log('ABSENT tools/essais/silhouettes.json : rien ne dit plus ce qu’étaient les petits sprites (node tools/silhouettes.js relever)'); await browser.close(); process.exit(1); }
  const S = JSON.parse(fs.readFileSync(FICHE, 'utf8')).sprites;
  // 1. les petits sprites
  const E = (await parPaquets(inv.map(q => q.look), 80, EMPREINTES, l => [l, false])).flat();
  let neufs = 0; const ecartsP = []; cles.forEach((k, i) => { if (!S[k]) neufs++; else if (S[k][0] !== E[i][0]) ecartsP.push(inv[i].nom); });
  const partis = Object.keys(S).filter(k => !cles.includes(k)).length;
  if (ecartsP.length) ko(`ÉCART ${ecartsP.length} petit(s) sprite(s) ne sont plus ceux d'avant : ${ecartsP.slice(0, 8).join(', ')}${ecartsP.length > 8 ? '…' : ''}`);
  else ok(`les petits sprites sont ceux d'avant, au pixel près : ${cles.length - neufs} silhouettes (${detail}) × 12 pas et 24 poses${neufs ? ` ; ${neufs} silhouette(s) nouvelle(s), sans empreinte` : ''}${partis ? ` ; ${partis} empreinte(s) sans silhouette` : ''}`);
  if (!natif) { ko('ABSENT gfx.charGrille : ce moteur ne dessine pas de grand sprite natif'); }
  else {
    // 2. l'interrupteur rend le dessin d'avant
    const avant = (await parPaquets(inv.map(q => q.look), 60, EMPREINTES, l => [l, true, true])).flat();
    const ecartsG = []; cles.forEach((k, i) => { if (S[k] && S[k][1] !== avant[i][1]) ecartsG.push(inv[i].nom); });
    if (ecartsG.length) ko(`ÉCART l'interrupteur ne rend pas le grand sprite d'avant pour ${ecartsG.length} silhouette(s) : ${ecartsG.slice(0, 8).join(', ')}${ecartsG.length > 8 ? '…' : ''}`);
    else ok(`l'interrupteur (gfx.natif = false) rend le grand sprite d'avant, à l'identique : ${cles.length - neufs} silhouettes × 36 images`);
    // 3 et 4. le voile, les têtes natives, la grille
    const R = await parPaquets(inv.map(q => ({ nom: q.nom, look: q.look })), 120, VOILES), faux = R.flatMap(r => r.faux), vues = R.reduce((s, r) => s + r.vues, 0), fines = R.reduce((s, r) => s + (r.fines || 0), 0);
    const traits = faux.filter(f => f[0] === 'TRAIT'), absents = faux.filter(f => f[0] === 'ABSENT');
    if (traits.length) { traits.slice(0, 10).forEach(f => ko('TRAIT ' + f[1])); if (traits.length > 10) console.log(`   … et ${traits.length - 10} autre(s)`); }
    else ok(`personne n'a de visage : ${vues} grands sprites (toutes les vues, les pas, les poses)${fines ? ` et leurs ${fines} tracés fins de 64 × 96` : ''} — le voile y est une seule surface, sans trou ni marque`);
    if (absents.length) { absents.slice(0, 10).forEach(f => ko('ABSENT ' + f[1])); if (absents.length > 10) console.log(`   … et ${absents.length - 10} autre(s)`); }
    page = await ouvrir();
    const T = await page.evaluate(C => { const G = window.ISNAD.gfx, sans = [], connues = G.COIFFES || []; const vuesT = G.figure ? [0, 1, 2, 3] : [0, 1, 2]; C.concat(connues.filter(c => !C.includes(c))).forEach(c => vuesT.forEach(dir => { const r = G.charGrille({ kind: 'homme', robe: '#8a7355', head: '#e6dcc4', coiffe: c, manteau: 'long' }, dir, 0, null); if (!r.natif) sans.push(c + ' (' + ['face', 'profil gauche', 'profil droit'][dir] + ')'); }));
      return { sans, connues, dos: vuesT.length > 3, oubli: connues.filter(c => !C.includes(c)), inconnues: C.filter(c => !connues.includes(c)) }; }, COIFFES); await page.context().close();
    if (T.oubli.length || T.inconnues.length) ko(`ABSENT la liste des coiffes de cet outil n'est plus celle du moteur : ${T.oubli.concat(T.inconnues).join(', ')}`);
    if (T.sans.length) ko(`ABSENT ${T.sans.length} coiffe(s) et vue(s) sans grand sprite natif : ${T.sans.slice(0, 12).join(', ')}${T.sans.length > 12 ? '…' : ''}`);
    else if (!absents.length) ok(`${T.connues.length} coiffes, chacune avec sa tête native de face${T.dos ? ', de profil et de dos' : ' et de profil'} ; aucune ne sort de la grille, aucun sprite n'est vide`);
  }
  if (errors.length) ko(`ÉCART erreur console : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`);
  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ SILHOUETTES CONFORMES');
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
