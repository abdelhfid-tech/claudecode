#!/usr/bin/env node
/* ISNAD 2.0 — les silhouettes : ce que le moteur dessine d'un personnage (src/core/sprites.js).
   Usage : node tools/silhouettes.js                    contrôle
           node tools/silhouettes.js relever            écrit les empreintes, une seule fois (refusé si elles existent déjà)
           node tools/silhouettes.js relever-grands     écrit l'empreinte des grands personnages natifs, une seule fois
                                                        (tools/essais/grands.json ; refusé si elle existe déjà)
           node tools/silhouettes.js relever-nouveaux   ajoute aux deux fiches les silhouettes venues ensuite (le râwî composé,
                                                        ses coiffes et ses objets : D193), et rien d'autre — refusé si une seule
                                                        empreinte déjà relevée a changé
           node tools/silhouettes.js elaguer            retire des deux fiches les empreintes qui n'ont plus de silhouette (un
                                                        personnage retouché : D193, les habitants de 2084) — refusé si une seule
                                                        empreinte encore utile a changé
           node tools/silhouettes.js redessin « décision »
                                                        un nouveau dessin des grands personnages, validé par le décideur (la
                                                        décision, dite en toutes lettres, est inscrite dans la fiche), devient
                                                        leur référence : le contrôle entier passe d'abord — les petits sprites
                                                        au pixel près, l'interrupteur, les voiles sans trait, les visages, les
                                                        coiffes, les gestes, la marque du râwî, les ressemblances —, et seul
                                                        l'écart des grands est tenu pour voulu ; si une autre anomalie paraît,
                                                        rien n'est écrit. Puis grands.json est relevé de nouveau en entier (les
                                                        silhouettes nouvelles y entrent, celles qui n'existent plus en sortent),
                                                        et silhouettes.json reçoit les petites silhouettes nouvelles et perd
                                                        celles qui n'existent plus — aucune empreinte de petit sprite ne change.
                                                        Ensuite, le contrôle ordinaire compare à ce nouveau relevé, au point près.
           node tools/silhouettes.js planches [modèles] planches agrandies dans .smoke/silhouettes/ ; [modèles] : une image de
                                                        sept modèles (7 × 2 cases de 32 × 48), pour la planche de comparaison
   1. Les petits sprites (16 × 24, ceux qui marchent sur les cartes) : quatre directions, trois pas, six poses, pour tous
      les personnages du jeu, les tenues du râwî, toutes les coiffes et les variantes d'équipement. Ils sont ceux relevés
      avant que le grand sprite soit redessiné (tools/essais/silhouettes.json) : sinon « ÉCART ». Le râwî composé par le
      joueur (D.RAWI) y entre aussi : son visage (teint, barbe, poil) n'est pas dans le petit sprite — sans eux, sa
      silhouette doit être exactement celle qu'elle serait sans visage choisi ; ses coiffes, chacune sous chaque coupe ; ses
      objets (la besace, la lanterne, D193), sous chaque coiffe ; des compositions entières. Les silhouettes venues après
      les fiches y sont ajoutées à leur création (relever-nouveaux) : ensuite, elles aussi ne changent plus d'un point.
   1 bis. Les grands sprites natifs, tels que le jeu les montre dans ses trois dessins : 32 × 48 (la carte en dessin fin ;
      le combat et les menus dans le dessin d'origine) et 64 × 96 (le combat et les menus en dessin fin, puis fin et
      adouci), toutes les vues, les pas, les poses, les gestes. Ils sont ceux relevés avant que le joueur puisse composer
      son râwî (tools/essais/grands.json) : sinon « ÉCART » — un seul point changé sur Idris d'origine, et les films sont
      à refaire.
   2. L'interrupteur (gfx.natif = false) rend le grand sprite d'avant, à l'identique : sinon « ÉCART ».
   3. Les Compagnons n'ont pas de visage. Dans chaque grand sprite — toutes les vues, les pas, les poses, les gestes de
      frappe — le voile est une seule surface, d'un seul tenant sur chaque ligne et chaque colonne, sans trou ; et, une
      fois peint, celui d'un Compagnon (ou de qui le jeu laisse sans visage, D.SANS_VISAGE) ne porte que sa lumière ou
      son étoffe, pas un trait : sinon « TRAIT ». Les autres personnages ont un visage (2.x, décision du décideur) : de
      face et de profil, il se voit ; de dos, rien : sinon « ABSENT ».
   4. Chaque coiffe a sa tête native de face, de profil et de dos ; aucune tête ne sort de la grille, aucun sprite
      n'est vide : sinon « ABSENT ».
   5. Les gestes de frappe (2.x) : l'élan et le coup ont leur image et la place de leur main dans les quatre directions,
      sur la carte et en combat ; chaque arme que l'on peut tenir se dessine ; le geste dure, puis cesse : sinon « ABSENT ».
   6. La marque du râwî (D193 ; le décideur : « les autres habitants de la Cité-Miroir ne doivent pas ressembler à
      Idris »). La bande et la ceinture de néon (les lettres Y et y) ne sont qu'à lui : aucun autre personnage du jeu n'en a
      un point, en 16 × 24, en 32 × 48 ni dans le tracé fin de 64 × 96, et lui les porte sous chaque ensemble et chaque
      composition. Puis aucune composition, même sans sa marque, ne ressemble à un habitant de 2084 ou de la Citadelle
      (frame.js, caid.js), ni à un Compagnon, qui a la même coiffe et la même longueur de robe : la ressemblance S — la part
      des points d'une couleur presque égale (ΔE76 < 12) parmi les points que l'un ou l'autre dessine, sans ceux du néon —
      reste sous 0,85, de face, de profil et de dos, en 16 × 24 et en 32 × 48 : sinon « ÉCART ».
   Sortie : « OK » par preuve, puis « SILHOUETTES CONFORMES ». Code 1 à la première anomalie.
   JEU=../index.html node tools/silhouettes.js : le même contrôle sur la version légère, qui porte le même sprites.js. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const V2 = path.join(__dirname, '..'), FICHE = path.join(__dirname, 'essais', 'silhouettes.json'), FICHE_G = path.join(__dirname, 'essais', 'grands.json'), out = path.join(V2, '.smoke/silhouettes');
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
  // 2.x — le râwî tel que le jeu le montre : sous chaque ensemble, son visage gardé (perso.look) ; puis, s'il se compose
  // (D.RAWI), chaque valeur de chaque pièce posée sur Idris, et des compositions entières, sur plusieurs ensembles
  const X = I.perso;
  if (X && X.look) (D.TENUES || []).forEach(t => pose('râwî', 'ensemble ' + t.id, Object.assign({ kind: 'compagnon' }, X.look(t))));
  if (X && X.composer && X.neutraliser && D.RAWI) {
    const R = D.RAWI, T = id => D.TENUES.find(t => t.id === id) || D.TENUES[0];
    const c = (compo, tid) => Object.assign({ kind: 'compagnon' }, X.composer(T(tid), X.neutraliser(T(tid), compo)));
    Object.keys(R.teints).forEach(k => pose('râwî', 'teint ' + k, c({ teint: k })));
    R.barbes.forEach(n => pose('râwî', 'barbe ' + n, c({ barbe: n })));
    Object.keys(R.poils).forEach(k => pose('râwî', 'poil ' + k, c({ poil: k })));
    R.coiffes.forEach(v => pose('râwî', 'coiffe ' + v, c({ coiffe: v })));
    R.manteaux.forEach(v => pose('râwî', 'manteau ' + v, c({ manteau: v })));
    [true, false].forEach(v => { pose('râwî', 'robe longue ' + v, c({ longue: v })); pose('râwî', 'écharpe ' + v, c({ echarpe: v })); });
    Object.keys(R.etoffes).forEach(k => pose('râwî', 'étoffe ' + k, c({ etoffe: k })));
    Object.keys(R.neons).forEach(k => pose('râwî', 'néon ' + k, c({ neon: k })));
    R.objets.forEach(o => pose('râwî', 'objet ' + o, c({ objet: o })));
    // 2.x (D193) — chaque coiffe sous chaque coupe (ce qu'elle refuse cède : la même silhouette n'entre qu'une fois), chaque objet
    // sous chaque coiffe, et sur l'ensemble qui fait céder l'étoffe claire
    R.coiffes.forEach(co => { R.manteaux.forEach(m => pose('râwî', 'coiffe ' + co + ' · ' + m, c({ coiffe: co, manteau: m })));
      R.objets.forEach(o => pose('râwî', 'coiffe ' + co + ' · ' + o, c({ coiffe: co, objet: o }))); pose('râwî', 'lettre · coiffe ' + co, c({ coiffe: co }, 'lettre')); });
    // le teint le plus clair et le plus sombre sous chaque ensemble ; puis des compositions entières
    D.TENUES.forEach(t => { const ks = Object.keys(R.teints); [ks[0], ks[ks.length - 1]].forEach(k => pose('râwî', t.id + ' · teint ' + k, c({ teint: k }, t.id))); });
    [[{ teint: 't7', barbe: 2, poil: 'p3', coiffe: 'calotte', manteau: 'ample', longue: true, echarpe: true, etoffe: 'e7', neon: 'n2', objet: 'besace' }, 'archives'],
      [{ teint: 't1', barbe: 0, manteau: 'epaule', etoffe: 'e4', neon: 'n4' }, 'ruelle'],
      [{ teint: 't5', poil: 'p1', coiffe: 'capuche', longue: true, etoffe: 'e3', neon: 'n5', objet: 'lanterne' }, 'lettre'],
      [{ teint: 't6', barbe: 2, echarpe: false, manteau: 'long', neon: 'n3' }, 'copiste'],
      [{ teint: 't4', barbe: 1, coiffe: 'imama_haute', manteau: 'ample', longue: true, etoffe: 'e2', neon: 'n1', objet: 'lanterne' }, 'encre'],
      [{ teint: 't2', barbe: 2, poil: 'p3', coiffe: 'litham', manteau: 'aucun', echarpe: true, etoffe: 'e5', objet: 'besace' }, 'veilleur'],
      [{ teint: 't7', barbe: 0, coiffe: 'imama_haute', echarpe: true, etoffe: 'e7', neon: 'n3', objet: 'besace' }, 'ruelle'],
      [{ teint: 't1', poil: 'p1', coiffe: 'litham', longue: true, etoffe: 'e6', neon: 'n5', objet: 'lanterne' }, 'lettre']].forEach(([k, tid], i) => pose('râwî', 'composition ' + (i + 1) + ' · ' + tid, c(k, tid)));
  }
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
/* ---------- dans la page : l'empreinte des grands sprites natifs, dans le dessin de la page ----------
   Le dessin se choisit par l'adresse (?def=2 fin, ?def=2l fin et adouci, ?def=1 d'origine) : une page par dessin, pour
   que rien de ce qu'un dessin a déjà fait ne serve à l'autre. En dessin fin : le personnage de 32 × 48 (celui de la
   carte : quatre images par direction, souffle compris ; les poses, les gestes) et la figure de 64 × 96 (combat, menus) ;
   fin et adouci : la figure ; d'origine : la figure, qui y est le personnage de 32 × 48. */
const GRANDES = looks => {
  const G = window.ISNAD.gfx, D = window.ISNAD.D, POSES = D.POSES.concat(G.GESTES || []), hx = n => ('0000000' + n.toString(16)).slice(-8);
  const fnv = (h, d) => { for (let i = 0; i < d.length; i++) { h ^= d[i]; h = Math.imul(h, 16777619); } return h >>> 0; };
  const octets = cv => cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  return looks.map(L => { let a = 2166136261, b = 0x9747b28c, c = 2166136261, e = 0x9747b28c;
    const p = cv => { const d = octets(cv); a = fnv(a, d); b = fnv(b, d); }, q = cv => { const d = octets(cv); c = fnv(c, d); e = fnv(e, d); };
    if (G.D > 1 && !G.lisse) [0, 1, 2, 3].forEach(dir => { [0, 1, 2, 3].forEach(f => p(G.charGrand(L, dir, f))); POSES.forEach(x => p(G.charGrand(L, dir, 0, x))); });
    [0, 1, 2, 3].forEach(dir => [null].concat(POSES).forEach(x => q(G.figure(L, dir, 0, x))));
    return [G.D > 1 && !G.lisse ? hx(a) + hx(b) : '', hx(c) + hx(e)]; });
};
const DESSINS = [['fin', '?def=2'], ['doux', '?def=2l'], ['origine', '?def=1']];

/* ---------- dans la page : le voile de chaque grand sprite, et ce que le moteur en dit ---------- */
const VOILES = looks => {
  const G = window.ISNAD.gfx, D = window.ISNAD.D, POSES = D.POSES.concat(D.ATTITUDES || [], G.MIMIQUES || []), faux = []; let vues = 0, natives = 0;   // 2.17 (prototype) : les attitudes nouvelles et les mimiques seules y passent aussi
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
  let fines = 0, lumieres = 0, visages = 0;
  // ce qui est peint dans le voile : les couleurs d'une image, aux cases V de sa grille (k : points d'image par case)
  const peint = (cv, lignes) => { const k = cv.width / lignes[0].length, d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, vus = new Set(); let n = 0;
    for (let y = 0; y < lignes.length; y++) for (let x = 0; x < lignes[y].length; x++) if (lignes[y][x] === 'V' || lignes[y][x] === 'v') { n++; for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) { const o = ((y * k + j) * cv.width + x * k + i) * 4; vus.add(d[o] << 16 | d[o + 1] << 8 | d[o + 2]); } }
    return { n, couleurs: vus.size, oeil: vus.has(0x1b1420) }; };
  const aVisage = look => G.aVisage ? G.aVisage(look) : false, GESTES = G.GESTES || [];
  // le voile peint : une lumière ou une étoffe (trois tons au plus, jamais la couleur d'un œil) pour qui n'a pas de visage ;
  // un visage, de face et de profil, pour les autres — et rien de dos
  const regard = (cv, lignes, look, dir, ou) => { const q = peint(cv, lignes); if (!q.n) return;
    if (!aVisage(look) || dir === 3) { lumieres++; if (q.couleurs > 3 || q.oeil) faux.push(['TRAIT', ou + ` : ${q.couleurs} couleurs dans le voile${q.oeil ? ', dont celle d’un œil' : ''}`]); }
    else { visages++; if (q.couleurs < 4) faux.push(['ABSENT', ou + ` : pas de visage (${q.couleurs} couleur(s) dans l’ouverture de la coiffe)`]); } };
  looks.forEach(({ nom, look }) => [0, 1, 2, 3].forEach(dir => [[0, null], [1, null], [2, null]].concat(POSES.map(p => [0, p]), GESTES.map(g => [0, g])).forEach(([f, p]) => {
    const r = G.charGrille(look, dir, f, p), ou = `${nom} · ${['face', 'profil gauche', 'profil droit', 'dos'][dir]}${p ? ' · ' + p : f ? ' · pas ' + f : ''}`; vues++;
    if (r.natif) natives++;
    const pleines = r.lignes.reduce((s, l) => s + l.replace(/\./g, '').length, 0);
    if (r.lignes.length !== 48 || r.lignes.some(l => l.length !== 32)) faux.push(['ABSENT', ou + ' : la grille n’a pas 32 × 48']);
    else if (pleines < 120) faux.push(['ABSENT', ou + ` : sprite presque vide (${pleines} cases)`]);
    if (r.hors) faux.push(['ABSENT', ou + ` : ${r.hors} case(s) de la tête sortent de la grille`]);
    const t = voile(r.lignes); if (t) faux.push(['TRAIT', ou + ' : ' + t]);
    if (r.natif && G.aVisage) regard(G.charGrand(look, dir, f, p), r.lignes, look, dir, ou);
    // 2.x : le même personnage tracé deux fois plus fin (le combat, les menus) — sa grille de 64 × 96 obéit à la même règle
    if (r.natif && G.figure) { const rf = G.charGrille(look, dir, f, p, 2); fines++; if (rf.lignes.length !== 96 || rf.lignes.some(l => l.length !== 64)) faux.push(['ABSENT', ou + ' : la grille fine n’a pas 64 × 96']); else { const tf = voile(rf.lignes); if (tf) faux.push(['TRAIT', ou + ' (dessin fin) : ' + tf]); else if (G.aVisage && G.D > 1 && !G.lisse) regard(G.figure(look, dir, f, p), rf.lignes, look, dir, ou + ' (dessin fin)'); } } })));
  return { faux, vues, natives, fines, lumieres, visages };
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
  const ouvrir = async q => { const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
    page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url + (q || '')); await page.waitForTimeout(1500); return page; };
  // par paquets, dans une page neuve à chaque fois : le moteur garde chaque image qu'il a dessinée (q : le dessin, par l'adresse)
  const parPaquets = async (liste, n, fn, arg, q) => { const res = []; for (let i = 0; i < liste.length; i += n) { const page = await ouvrir(q); res.push(await page.evaluate(fn, arg ? arg(liste.slice(i, i + n)) : liste.slice(i, i + n))); await page.context().close(); } return res; };
  // les grands sprites natifs, dans les trois dessins : { clé : [32 × 48 fin, 64 × 96 fin, 64 × 96 adouci, figure d'origine] }
  const grandes = async looks => { const par = {}; for (const [nom, q] of DESSINS) par[nom] = (await parPaquets(looks, 40, GRANDES, null, q)).flat();
    return looks.map((L, i) => [par.fin[i][0], par.fin[i][1], par.doux[i][1], par.origine[i][1]]); };
  let page = await ouvrir();
  const inv = await page.evaluate(INVENTAIRE, COIFFES), natif = await page.evaluate(() => typeof window.ISNAD.gfx.charGrille === 'function'); await page.context().close();
  // la couleur du rayonnement (look.rayon) ne touche que le voile du grand personnage, en dessin fin : l'empreinte d'un petit sprite se cherche sans elle
  // (de même look.sansVisage, qui ne touche que le grand personnage)
  // (et le visage du râwî — sa marque, son teint, sa barbe, son poil — qui ne se peint que sur le grand personnage)
  // (et la marque du râwî, look.rawi, que le moteur pose sur lui pour lui donner ses gabarits propres : elle ne touche que le grand personnage)
  const sansRayon = look => { const L = Object.assign({}, look); ['rayon', 'sansVisage', 'visage', 'teint', 'barbe', 'poil', 'rawi'].forEach(k => { delete L[k]; }); return L; };
  // la clé d'un grand personnage dans sa fiche : son apparence entière, sans la marque du râwî — posée après le relevé, elle
  // ne fait pas de lui une silhouette nouvelle : son dessin se compare à celui d'avant (un écart s'y voit)
  const cleG = look => { const L = Object.assign({}, look); delete L.rawi; return JSON.stringify(L); };
  // redessin : la décision qui valide le nouveau dessin, en toutes lettres (elle entre dans la fiche)
  const REDESSIN = mode === 'redessin', raison = process.argv.slice(3).join(' ').replace(/\s+/g, ' ').trim();
  if (REDESSIN && raison.length < 12) { console.log('✗ redessin : dites quelle décision du décideur valide le nouveau dessin (node tools/silhouettes.js redessin « … ») — rien n’est relevé sans elle'); await browser.close(); process.exit(1); }
  let redessin = null;   // ce que le contrôle relève, pour l'écrire à la fin s'il n'y a pas d'autre anomalie
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

  /* ---------- relever les grands : une seule fois, avant que le joueur puisse composer son râwî ---------- */
  if (mode === 'relever-grands') {
    if (fs.existsSync(FICHE_G)) { console.log('✗ l’empreinte des grands existe déjà : elle ne se refait pas (tools/essais/grands.json)'); await browser.close(); process.exit(1); }
    const looks = inv.map(q => q.look), E = await grandes(looks), grands = {}; looks.forEach((L, i) => { grands[cleG(L)] = E[i]; });
    if (errors.length) { console.log('✗ erreur console : ' + errors[0]); await browser.close(); process.exit(1); }
    fs.writeFileSync(FICHE_G, JSON.stringify({ note: 'Empreintes des grands sprites natifs, tels que le jeu les montrait avant que le joueur puisse composer son râwî : [32 × 48 en dessin fin (4 directions × 4 images, poses et gestes), figure 64 × 96 en dessin fin, la même fin et adoucie, figure du dessin d’origine (32 × 48)]. La clé : l’apparence entière (look). Relevé par tools/silhouettes.js relever-grands.', grands }, null, 0).replace(/"\],"/g, '"],\n"') + '\n');
    console.log(`✓ grands relevés : ${looks.length} silhouettes (${detail}), dans les trois dessins`); await browser.close(); process.exit(0);
  }

  /* ---------- relever les nouveaux : les silhouettes venues après les fiches, à leur création ----------
     Rien de ce qui est relevé ne change : on n'ajoute que ce qui manque, et seulement si tout ce qui est déjà relevé est encore
     juste, au point près (sinon, c'est un écart, pas une nouveauté). */
  if (mode === 'relever-nouveaux') {
    if (!fs.existsSync(FICHE) || !fs.existsSync(FICHE_G)) { console.log('✗ les fiches manquent : relever, puis relever-grands'); await browser.close(); process.exit(1); }
    const S = JSON.parse(fs.readFileSync(FICHE, 'utf8')), SG = JSON.parse(fs.readFileSync(FICHE_G, 'utf8'));
    const E = (await parPaquets(inv.map(q => q.look), 60, EMPREINTES, l => [l, true, true])).flat(), faux = [];   // le petit sprite, et le grand d'avant (l'interrupteur)
    cles.forEach((k, i) => { const a = S.sprites[k]; if (a && (a[0] !== E[i][0] || a[1] !== E[i][1])) faux.push(inv[i].nom); });
    const connus = inv.filter(q => SG.grands[cleG(q.look)]), EG = await grandes(connus.map(q => q.look));
    connus.forEach((q, i) => { if (JSON.stringify(SG.grands[cleG(q.look)]) !== JSON.stringify(EG[i])) faux.push(q.nom + ' (grand)'); });
    if (faux.length || errors.length) { console.log(`✗ rien n'est ajouté : ${faux.length ? faux.length + ' silhouette(s) déjà relevée(s) ont changé (' + faux.slice(0, 6).join(', ') + ')' : 'erreur console : ' + errors[0]}`); await browser.close(); process.exit(1); }
    let np = 0; cles.forEach((k, i) => { if (!S.sprites[k]) { S.sprites[k] = E[i]; np++; } });
    const neuves = inv.filter(q => !SG.grands[cleG(q.look)]), EN = await grandes(neuves.map(q => q.look)); neuves.forEach((q, i) => { SG.grands[cleG(q.look)] = EN[i]; });
    if (errors.length) { console.log('✗ erreur console : ' + errors[0]); await browser.close(); process.exit(1); }
    const AJOUT = ' Les silhouettes venues ensuite (le râwî composé, ses coiffes et ses objets : D193) y sont ajoutées à leur création, sans qu’aucune empreinte déjà relevée ne change (tools/silhouettes.js relever-nouveaux).';
    if (S.note.indexOf(AJOUT) < 0) S.note += AJOUT; if (SG.note.indexOf(AJOUT) < 0) SG.note += AJOUT;
    if (np) fs.writeFileSync(FICHE, JSON.stringify({ note: S.note, sprites: S.sprites }, null, 0).replace(/"\],"/g, '"],\n"') + '\n');
    if (neuves.length) fs.writeFileSync(FICHE_G, JSON.stringify({ note: SG.note, grands: SG.grands }, null, 0).replace(/"\],"/g, '"],\n"') + '\n');
    console.log(`✓ ${np} petite(s) et ${neuves.length} grande(s) silhouette(s) ajoutée(s) aux fiches ; les ${cles.length - np} et ${connus.length} déjà relevées sont toujours justes, au point près`); await browser.close(); process.exit(0);
  }

  /* ---------- élaguer : retirer des fiches les empreintes qui n'ont plus de silhouette ----------
     Un personnage que le décideur fait retoucher (D193 : les habitants de 2084, pour qu'aucun ne ressemble au râwî) n'a plus la
     silhouette relevée : son empreinte d'avant ne sert plus. On la retire, et rien d'autre — et seulement si tout ce qui est
     encore relevé et dessiné est juste, au point près (sinon, c'est un écart, pas un personnage retouché). */
  if (mode === 'elaguer') {
    if (!fs.existsSync(FICHE) || !fs.existsSync(FICHE_G)) { console.log('✗ les fiches manquent : relever, puis relever-grands'); await browser.close(); process.exit(1); }
    const S = JSON.parse(fs.readFileSync(FICHE, 'utf8')), SG = JSON.parse(fs.readFileSync(FICHE_G, 'utf8'));
    const E = (await parPaquets(inv.map(q => q.look), 60, EMPREINTES, l => [l, true, true])).flat(), faux = [];   // le petit sprite, et le grand d'avant (l'interrupteur)
    cles.forEach((k, i) => { const a = S.sprites[k]; if (a && (a[0] !== E[i][0] || a[1] !== E[i][1])) faux.push(inv[i].nom); });
    const connus = inv.filter(q => SG.grands[cleG(q.look)]), EG = await grandes(connus.map(q => q.look));
    connus.forEach((q, i) => { if (JSON.stringify(SG.grands[cleG(q.look)]) !== JSON.stringify(EG[i])) faux.push(q.nom + ' (grand)'); });
    if (faux.length || errors.length) { console.log(`✗ rien n'est retiré : ${faux.length ? faux.length + ' silhouette(s) encore relevée(s) ont changé (' + faux.slice(0, 6).join(', ') + ')' : 'erreur console : ' + errors[0]}`); await browser.close(); process.exit(1); }
    const vivantes = new Set(cles), vivantesG = new Set(inv.map(q => cleG(q.look)));
    const parties = Object.keys(S.sprites).filter(k => !vivantes.has(k)), partiesG = Object.keys(SG.grands).filter(k => !vivantesG.has(k));
    parties.forEach(k => { delete S.sprites[k]; }); partiesG.forEach(k => { delete SG.grands[k]; });
    if (parties.length) fs.writeFileSync(FICHE, JSON.stringify({ note: S.note, sprites: S.sprites }, null, 0).replace(/"\],"/g, '"],\n"') + '\n');
    if (partiesG.length) fs.writeFileSync(FICHE_G, JSON.stringify({ note: SG.note, grands: SG.grands }, null, 0).replace(/"\],"/g, '"],\n"') + '\n');
    const dit = k => { const L = JSON.parse(k); return [L.kind, L.coiffe, L.robe, L.court === false ? 'robe longue' : ''].filter(Boolean).join(' '); };
    console.log(`✓ ${parties.length} petite(s) et ${partiesG.length} grande(s) empreinte(s) retirée(s), qui n'avaient plus de silhouette${partiesG.length ? ' : ' + partiesG.map(dit).join(' · ') : ''} ; les ${cles.length} silhouettes du jeu restent relevées, au point près`); await browser.close(); process.exit(0);
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
    const gestes = q => [1, 0, 3].flatMap(dir => ['elan', 'coup'].map(g => ({ look: q.look, dir, pose: g, legende: ident(q) + ' · ' + N[dir] + ' · ' + (g === 'elan' ? 'élan' : g) })));
    if (await (async () => { const p = await ouvrir(), r = await p.evaluate(() => !!(window.ISNAD.gfx.GESTES || []).length); await p.context().close(); return r; })())
      for (let i = 0; i < sept.length; i += 2) await ecrire('gestes-' + (i / 2 + 1), { cases: sept.slice(i, i + 2).flatMap(gestes), k: 6, cols: 6, titre: 'Les gestes de frappe : l’élan, le coup (l’arme, le moteur la pose dans la main)' });
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
  // 1 bis. les grands sprites natifs, dans les trois dessins : ceux d'avant le râwî composé, au point près
  if (!fs.existsSync(FICHE_G)) ko('ABSENT tools/essais/grands.json : rien ne dit plus ce qu’étaient les grands personnages (node tools/silhouettes.js relever-grands)');
  else { const SG = JSON.parse(fs.readFileSync(FICHE_G, 'utf8')).grands, connus = inv.filter(q => SG[cleG(q.look)]), EG = await grandes(connus.map(q => q.look)), N = ['32 × 48 fin', '64 × 96 fin', 'fin et adouci', 'd’origine'];
    const ecartsGr = []; connus.forEach((q, i) => { const a = SG[cleG(q.look)]; a.forEach((h, j) => { if (h !== EG[i][j]) ecartsGr.push(`${q.nom} (${N[j]})`); }); });
    const nouveaux = inv.length - connus.length, partisG = Object.keys(SG).filter(k => !inv.some(q => cleG(q.look) === k)).length;
    if (REDESSIN) redessin = { SG, connus, EG, qui: [...new Set(ecartsGr.map(e => e.replace(/ \([^)]*\)$/, '')))], images: ecartsGr.length, nouveaux, partisG };
    if (ecartsGr.length && REDESSIN) console.log(`··· le nouveau dessin, tenu pour voulu (redessin) : ${ecartsGr.length} grand(s) sprite(s) changé(s), sur ${redessin.qui.length} silhouette(s) — relevés à la fin si rien d'autre ne cloche`);
    else if (ecartsGr.length) { const qui = [...new Set(ecartsGr.map(e => e.replace(/ \([^)]*\)$/, '')))];   // chaque silhouette touchée, une fois, et les dessins où elle l'est
      ko(`ÉCART ${ecartsGr.length} grand(s) sprite(s) ne sont plus ceux d'avant, sur ${qui.length} silhouette(s) : ${ecartsGr.slice(0, 8).join(', ')}${ecartsGr.length > 8 ? '…' : ''}`);
      console.log('   les silhouettes : ' + qui.map(n => n + ' (' + ecartsGr.filter(e => e.replace(/ \([^)]*\)$/, '') === n).map(e => e.match(/\(([^)]*)\)$/)[1]).join(', ') + ')').join(' · ')); }
    else ok(`les grands sprites sont ceux d'avant, au point près, dans les trois dessins : ${connus.length} silhouettes × 156 images (32 × 48 et 64 × 96 ; fin, fin et adouci, d’origine)${nouveaux ? ` ; ${nouveaux} silhouette(s) nouvelle(s), sans empreinte` : ''}${partisG ? ` ; ${partisG} empreinte(s) sans silhouette` : ''}`); }
  if (!natif) { ko('ABSENT gfx.charGrille : ce moteur ne dessine pas de grand sprite natif'); }
  else {
    // 2. l'interrupteur rend le dessin d'avant
    const avant = (await parPaquets(inv.map(q => q.look), 60, EMPREINTES, l => [l, true, true])).flat(); if (redessin) redessin.avant = avant;
    const ecartsG = []; cles.forEach((k, i) => { if (S[k] && S[k][1] !== avant[i][1]) ecartsG.push(inv[i].nom); });
    if (ecartsG.length) ko(`ÉCART l'interrupteur ne rend pas le grand sprite d'avant pour ${ecartsG.length} silhouette(s) : ${ecartsG.slice(0, 8).join(', ')}${ecartsG.length > 8 ? '…' : ''}`);
    else ok(`l'interrupteur (gfx.natif = false) rend le grand sprite d'avant, à l'identique : ${cles.length - neufs} silhouettes × 36 images`);
    // 3 et 4. le voile, les têtes natives, la grille
    const R = await parPaquets(inv.map(q => ({ nom: q.nom, look: q.look })), 120, VOILES), faux = R.flatMap(r => r.faux), vues = R.reduce((s, r) => s + r.vues, 0), fines = R.reduce((s, r) => s + (r.fines || 0), 0);
    const lumieres = R.reduce((s, r) => s + (r.lumieres || 0), 0), visages = R.reduce((s, r) => s + (r.visages || 0), 0);
    const traits = faux.filter(f => f[0] === 'TRAIT'), absents = faux.filter(f => f[0] === 'ABSENT');
    if (traits.length) { traits.slice(0, 10).forEach(f => ko('TRAIT ' + f[1])); if (traits.length > 10) console.log(`   … et ${traits.length - 10} autre(s)`); }
    else if (!visages && !lumieres) ok(`personne n'a de visage : ${vues} grands sprites (toutes les vues, les pas, les poses)${fines ? ` et leurs ${fines} tracés fins de 64 × 96` : ''} — le voile y est une seule surface, sans trou ni marque`);
    else ok(`les Compagnons n'ont pas de visage : ${vues} grands sprites (toutes les vues, les pas, les poses, les gestes)${fines ? ` et leurs ${fines} tracés fins de 64 × 96` : ''} — le voile y est une seule surface, sans trou ni marque ; peint, il ne porte que sa lumière ou son étoffe dans ${lumieres} images (Compagnons, ceux que le jeu laisse sans visage, tous de dos)`);
    if (visages && !absents.some(f => /pas de visage/.test(f[1]))) ok(`les autres personnages ont un visage, de face et de profil : ${visages} images`);
    if (absents.length) { absents.slice(0, 10).forEach(f => ko('ABSENT ' + f[1])); if (absents.length > 10) console.log(`   … et ${absents.length - 10} autre(s)`); }
    page = await ouvrir();
    const T = await page.evaluate(C => { const G = window.ISNAD.gfx, sans = [], connues = G.COIFFES || []; const vuesT = G.figure ? [0, 1, 2, 3] : [0, 1, 2]; C.concat(connues.filter(c => !C.includes(c))).forEach(c => vuesT.forEach(dir => { const r = G.charGrille({ kind: 'homme', robe: '#8a7355', head: '#e6dcc4', coiffe: c, manteau: 'long' }, dir, 0, null); if (!r.natif) sans.push(c + ' (' + ['face', 'profil gauche', 'profil droit'][dir] + ')'); }));
      return { sans, connues, dos: vuesT.length > 3, oubli: connues.filter(c => !C.includes(c)), inconnues: C.filter(c => !connues.includes(c)) }; }, COIFFES); await page.context().close();
    if (T.oubli.length || T.inconnues.length) ko(`ABSENT la liste des coiffes de cet outil n'est plus celle du moteur : ${T.oubli.concat(T.inconnues).join(', ')}`);
    if (T.sans.length) ko(`ABSENT ${T.sans.length} coiffe(s) et vue(s) sans grand sprite natif : ${T.sans.slice(0, 12).join(', ')}${T.sans.length > 12 ? '…' : ''}`);
    else if (!absents.length) ok(`${T.connues.length} coiffes, chacune avec sa tête native de face${T.dos ? ', de profil et de dos' : ' et de profil'} ; aucune ne sort de la grille, aucun sprite n'est vide`);
    // 6. les gestes de frappe (2.x) : chaque geste a son image et la place de sa main ; chaque arme se dessine ; le geste dure, puis cesse
    page = await ouvrir();
    const Ge = await page.evaluate(() => { const I = window.ISNAD, G = I.gfx, D = I.D; if (!G.geste || !G.frappe || !G.arme) return null; const faux = []; let n = 0;
      const look = { kind: 'compagnon', robe: '#8a7355', head: '#e6dcc4', cloak: '#5a4632' }, N = ['face', 'profil gauche', 'profil droit', 'dos'];
      (G.GESTES || []).forEach(g => [0, 1, 2, 3].forEach(dir => ['combat', 'carte'].forEach(gr => { if (gr === 'carte' && G.D < 2) return; const r = G.geste(look, dir, g, gr), ou = `${g} · ${N[dir]} · ${gr}`; n++;
        if (!r || !r.img || !r.main) { faux.push(ou + ' : pas d’image'); return; }
        const w = r.img.width / (r.img.hd || 1), h = r.img.height / (r.img.hd || 1); if (!(r.main[0] >= 0 && r.main[0] <= w && r.main[1] >= 0 && r.main[1] <= h)) faux.push(ou + ' : la main est hors de l’image'); })));
      const ports = [...new Set(Object.values(D.GEAR_TYPES).filter(t => t.slot === 'md' && t.port).map(t => t.port))];
      ports.forEach(p => { for (let a = 0; a < 8; a++) { const im = G.arme(p, a * Math.PI / 4, 1); if (!im) { faux.push('arme ' + p + ' : pas de dessin'); return; }
        const d = im.getContext('2d').getImageData(0, 0, im.width, im.height).data; let pleins = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 200) pleins++; if (pleins < 8) { faux.push('arme ' + p + ' : dessin vide'); return; } } });
      const cv = G.toile(64, 64), c = cv.getContext('2d'), g = { anim: 'slash', port: 'sabre' };
      if (![0.02, 0.12, 0.15, 0.25].every(t => G.frappe(c, look, 1, 16, 8, g, t, 'combat'))) faux.push('G.frappe ne dessine pas le geste pendant toute sa durée');
      if (G.frappe(c, look, 1, 16, 8, g, G.dureeFrappe + 0.01, 'combat')) faux.push('G.frappe ne cesse pas à la fin du geste');
      return { faux, n, ports }; });
    await page.context().close();
    if (Ge) { if (Ge.faux.length) Ge.faux.slice(0, 10).forEach(f => ko('ABSENT ' + f)); else ok(`les gestes de frappe : ${Ge.n} images (l'élan, le coup — quatre directions, sur la carte et en combat), chacune avec la place de sa main ; ${Ge.ports.length} armes dessinées sous huit angles (${Ge.ports.join(', ')}) ; le geste dure, puis cesse`); }
    // 7. la marque du râwî (D193 ; le décideur : « les autres habitants de la Cité-Miroir ne doivent pas ressembler à Idris »)
    page = await ouvrir();
    const Mq = await page.evaluate(liste => {
      const I = window.ISNAD, G = I.gfx, D = I.D, X = I.perso, R = D.RAWI; if (!G.allure || !G.petiteGrille || !X || !X.composer || !R) return null;
      const faux = [], rawi = L => L.kind === 'cyber', vues4 = [0, 1, 2, 3];
      // la marque : des cases Y (la bande) et y (la ceinture) dans les grilles — petit personnage, 32 × 48, tracé fin
      const grilles = L => vues4.map(d => G.petiteGrille(L, d, 0).join('')).concat(vues4.map(d => G.charGrille(L, d, 0, null, 1).lignes.join('')), [G.charGrille(L, 0, 0, null, 2).lignes.join('')]);
      let sans = 0, avec = 0;
      liste.forEach(q => { const L = q.look, A = G.allure(L);
        if (rawi(L)) { avec++; const g = [G.petiteGrille(L, 0, 0).join(''), G.charGrille(L, 0, 0, null, 1).lignes.join(''), G.charGrille(L, 0, 0, null, 2).lignes.join('')];
          if (!A.neon || !g.every(s => /Y/.test(s) && /y/.test(s))) faux.push(q.nom + ' : le râwî sans sa bande ou sa ceinture de néon');
          if ((q.groupe === 'héros' || q.groupe === 'gens') && q.nom !== 'idris/idris') faux.push(q.nom + ' : un autre que le râwî est du type du râwî (cyber)'); }
        else { sans++; if (A.neon || grilles(L).some(s => /[Yy]/.test(s))) faux.push(q.nom + ' : porte la marque du râwî (la bande ou la ceinture de néon)'); } });
      // la ressemblance S, sans les points de néon
      const lab = h => { const n = parseInt(h.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92; });
        const x = (c[0] * 0.4124 + c[1] * 0.3576 + c[2] * 0.1805) / 0.95047, y = c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722, z = (c[0] * 0.0193 + c[1] * 0.1192 + c[2] * 0.9505) / 1.08883;
        const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))]; };
      const hex = (d, o) => '#' + [d[o], d[o + 1], d[o + 2]].map(v => v.toString(16).padStart(2, '0')).join('');
      const NEONS = new Set(['#39e6ff', '#ff4fd8'].concat(...Object.values(R.neons)));
      const image = (cv, w, h, y0) => { const d = cv.getContext('2d').getImageData(0, y0 || 0, w, h).data, pts = []; for (let i = 0; i < w * h; i++) { const o = i * 4; pts.push(d[o + 3] > 200 ? { l: lab(hex(d, o)), neon: NEONS.has(hex(d, o)) } : null); } return pts; };
      const VUES = [[0, 1], [1, 1], [3, 1], [0, 2], [1, 2], [3, 2]];   // [direction, taille] : 1 → 16 × 24, 2 → 32 × 48
      const vue = (L, [d, e]) => e === 1 ? image(G.charSheet(L), 16, 24, d * 24) : (g => image(g, g.width, g.height))(G.charGrand(L, d, 0));
      const S = (a, b) => { let u = 0, n = 0; for (let i = 0; i < a.length; i++) { const p = a[i], q = b[i], pa = p && !p.neon, qb = q && !q.neon; if (!pa && !qb) continue; u++;
        if (pa && qb && (p.l[0] - q.l[0]) ** 2 + (p.l[1] - q.l[1]) ** 2 + (p.l[2] - q.l[2]) ** 2 < 144) n++; } return u ? n / u : 0; };
      // les compositions du râwî : les six ensembles, puis chaque coiffe, coupe, longueur, écharpe et étoffe sur sa tenue de toujours
      const t0 = D.TENUES[0], comps = [], vc = new Set(), cle = L => { const A = G.allure(L); return A.coiffe + '/' + A.court; };
      const ajoute = (L, dit) => { const k = JSON.stringify(L); if (vc.has(k)) return; vc.add(k); comps.push({ dit, cle: cle(L), L, im: null }); };
      D.TENUES.forEach(t => ajoute(Object.assign({ kind: 'compagnon' }, X.look(t)), 'ensemble ' + t.id));
      R.coiffes.forEach(co => R.manteaux.forEach(ma => [false, true].forEach(lo => [false, true].forEach(ec => Object.keys(R.etoffes).forEach(et => {
        const c = X.neutraliser(t0, { coiffe: co, manteau: ma, longue: lo, echarpe: ec, etoffe: et }), L = Object.assign({ kind: 'compagnon' }, X.composer(t0, c));
        ajoute(L, [L.coiffe || 'capuche', L.manteau || 'long', L.court === false ? 'robe longue' : 'robe courte', L.echarpe ? 'écharpe' : '', c.etoffe || 'e1'].filter(Boolean).join(' ')); })))));
      // les habitants de 2084 et de la Citadelle (frame.js, caid.js), et les Compagnons de tous les récits
      const habitants = liste.filter(q => (q.groupe === 'héros' || q.groupe === 'gens') && !rawi(q.look) && /^(idris|caid)\//.test(q.nom));
      const compagnons = liste.filter(q => (q.groupe === 'héros' || q.groupe === 'gens') && !rawi(q.look) && !/^(idris|caid)\//.test(q.nom) && (q.look.kind || 'compagnon') === 'compagnon');
      let max = { s: 0 }, paires = 0; const trop = [];
      habitants.concat(compagnons).forEach(q => { const k = cle(q.look), mes = comps.filter(c => c.cle === k); if (!mes.length) return; const im = VUES.map(v => vue(q.look, v));
        mes.forEach(c => { if (!c.im) c.im = VUES.map(v => vue(c.L, v)); paires++; im.forEach((x, n) => { const s = S(c.im[n], x), ou = ['face', 'profil', '', 'dos'][VUES[n][0]] + ', ' + (VUES[n][1] === 1 ? '16 × 24' : '32 × 48');
          if (s > max.s) max = { s, qui: q.nom, dit: c.dit, ou }; if (s >= 0.85) trop.push(`${q.nom} et « ${c.dit} » (${ou}) : ${s.toFixed(2)}`); }); }); });
      return { faux, sans, avec, comps: comps.length, habitants: habitants.length, compagnons: compagnons.length, paires, max: { s: max.s, qui: max.qui, dit: max.dit, ou: max.ou }, trop };
    }, inv.map(q => ({ groupe: q.groupe, nom: q.nom, look: q.look })));
    await page.context().close();
    if (!Mq) ko('ABSENT gfx.allure ou gfx.petiteGrille : ce moteur ne dit pas qui porte la marque du râwî');
    else {
      if (Mq.faux.length) { Mq.faux.slice(0, 10).forEach(f => ko('ÉCART ' + f)); if (Mq.faux.length > 10) console.log(`   … et ${Mq.faux.length - 10} autre(s)`); }
      else ok(`la marque du râwî : la bande et la ceinture de néon ne sont qu'à lui — ${Mq.sans} silhouettes du jeu n'en ont pas un point (16 × 24, 32 × 48 et 64 × 96, dans les quatre vues), et ses ${Mq.avec} silhouettes (ses ensembles, ses compositions, son équipement) les portent, en petit, en grand et dans le tracé fin`);
      if (Mq.trop.length) { Mq.trop.slice(0, 10).forEach(f => ko('ÉCART il ressemble à un autre : ' + f)); if (Mq.trop.length > 10) console.log(`   … et ${Mq.trop.length - 10} autre(s)`); }
      else ok(`personne ne ressemble au râwî : ses ${Mq.comps} compositions (les six ensembles, puis chaque coiffe, coupe, longueur, écharpe et étoffe), même sans leur néon, face aux ${Mq.habitants} habitants de 2084 et de la Citadelle et aux ${Mq.compagnons} Compagnons de même coiffe et de même longueur de robe (${Mq.paires} paires, de face, de profil et de dos, en 16 × 24 et en 32 × 48) : au plus ${Mq.max.s.toFixed(2)} — ${Mq.max.qui} et « ${Mq.max.dit} » (${Mq.max.ou}) —, sous le seuil de 0,85`);
    }
  }
  if (errors.length) ko(`ÉCART erreur console : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`);
  /* ---------- redessin : le nouveau dessin validé devient la référence ---------- */
  if (REDESSIN) {
    if (anomalies || !redessin || !redessin.avant) { console.log(`✗ rien n'est relevé : ${anomalies} anomalie(s) autre(s) que l'écart du dessin validé${redessin ? '' : ' (les grands n’ont pas été comparés)'}`); await browser.close(); process.exit(1); }
    const R = redessin, SP = JSON.parse(fs.readFileSync(FICHE, 'utf8')), SGf = JSON.parse(fs.readFileSync(FICHE_G, 'utf8')), grands = {};
    R.connus.forEach((q, i) => { grands[cleG(q.look)] = R.EG[i]; });
    const neuves = inv.filter(q => !grands[cleG(q.look)]), EN = await grandes(neuves.map(q => q.look)); neuves.forEach((q, i) => { grands[cleG(q.look)] = EN[i]; });
    let np = 0; cles.forEach((k, i) => { if (!SP.sprites[k]) { SP.sprites[k] = R.avant[i]; np++; } });
    const vivantes = new Set(cles), partis = Object.keys(SP.sprites).filter(k => !vivantes.has(k)); partis.forEach(k => { delete SP.sprites[k]; });
    if (errors.length) { console.log('✗ rien n’est relevé : erreur console : ' + errors[0]); await browser.close(); process.exit(1); }
    const jour = new Date().toISOString().slice(0, 10), mot = ` Relevé de nouveau le ${jour} (tools/silhouettes.js redessin), le contrôle entier passant : « ${raison} » — ${R.qui.length} silhouette(s) redessinée(s) (${R.images} images), ${neuves.length} nouvelle(s), ${R.partisG} retirée(s).`;
    fs.writeFileSync(FICHE_G, JSON.stringify({ note: SGf.note + mot, grands }, null, 0).replace(/"\],"/g, '"],\n"') + '\n');
    if (np || partis.length) fs.writeFileSync(FICHE, JSON.stringify({ note: SP.note + (np || partis.length ? ` Le ${jour} (redessin) : ${np} petite(s) silhouette(s) nouvelle(s) ajoutée(s), ${partis.length} retirée(s) — aucune empreinte de petit sprite n'a changé.` : ''), sprites: SP.sprites }, null, 0).replace(/"\],"/g, '"],\n"') + '\n');
    await browser.close();
    console.log(`✓ REDESSIN RELEVÉ : grands.json — ${Object.keys(grands).length} silhouettes, dont ${R.qui.length} redessinée(s), ${neuves.length} nouvelle(s), ${R.partisG} retirée(s) ; silhouettes.json — ${np} ajoutée(s), ${partis.length} retirée(s), aucune changée. Relancez node tools/silhouettes.js : il compare désormais à ce relevé.`);
    process.exit(0);
  }
  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ SILHOUETTES CONFORMES');
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
