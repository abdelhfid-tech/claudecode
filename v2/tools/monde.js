#!/usr/bin/env node
/* ISNAD 2.29 (D220) et 2.30 (D222) — la carte du monde, les portes, les visites, les rencontres de la route : le contrôle, par
   les vrais boutons, sur un téléphone.
   1. La géographie (hors du jeu, dans la page) : chaque ville à sa place projetée, à une case près (D.MONDE, maps.js) ; les
      distances Médine–La Mecque, Médine–Damas, Koufa–Bassora, Damas–Jérusalem à 10 % près de la distance réelle (le grand
      cercle) ; toutes les villes reliées à pied (M.relie) ; aucune route dans la mer ; pas de petite carte au coin. Les dates :
      Koufa absente des chapitres de la saga I et présente dans ceux de la saga V, Fustât absente avant 21 H, Bassora avant 14 H,
      chaque chapitre sa carte du monde. Les portes : ouvertes exactement dans les chapitres de D.MONDE.depuis, sur leur carte, à
      partir de leur objectif — et nulle part ailleurs (2084, les veillées, la mer, la noosphère, le dernier maillon, les routes,
      Dhû l-Qassa, Harûrâ', Nahrawân). Les visites : chacune se bâtit, son comptoir et son tapis se rejoignent à pied ; La Mecque
      sans mosquée (ni lieu, ni mur, ni mihrab, ni minbar, ni colonnes, ni cour carrelée). 2.30 : aucune visite n'a d'étendard,
      la visite de Médine est Médine case pour case (hors des deux cases de ses étendards), et Médine garde les siens.
   2. En hauteur (390 × 844), au doigt, puis en largeur (844 × 390), au clavier : le premier chapitre d'Abû Bakr (Médine) ;
      sortir par la porte du sud (la leçon « La route », une fois) ; la carte du monde, Idris à côté de Médine, la flèche vers
      elle, « Revenir : Médine » au-dessus d'elle ; à pied jusqu'à La Mecque (« Entrer : La Mecque ») ; la visite (son carton :
      le nom et l'époque) ; ni mosquée ni chimère ; le tapis, sobre (ni œuvres comptées, ni descente) ; ressortir par sa porte ;
      revenir à Médine : le même objectif, les mêmes drapeaux, les mêmes personnages, à la porte. En largeur, une partie
      exportée sur la carte du monde se réimporte (par les vrais boutons) et s'y rouvre.
   3. (En largeur) chaque chapitre de D.MONDE.depuis : sorti par sa porte, Idris est à côté de sa ville, et y revient à son
      objectif ; chaque ville de passage se visite (sa carte, son comptoir, son tapis) et l'on en ressort. Le joueur de test du
      moteur (auto, à pied, au doigt) ne sort jamais.
   (Dans les parties 1 à 4, rien ne se croise sur la route : I.debug.rencontres les éteint.)
   5. 2.30 (D222) — les rencontres de la route, en hauteur (390 × 844) et en largeur (844 × 390) : les chimères du désert (sur le
      sable, les dunes et la steppe ; jamais à deux cases d'une ville ni à trois de La Mecque, sur cent tirages autour de Médine
      et de La Mecque ; plus nombreuses loin des routes ; aucune idée noire) ; une chimère rencontrée, combattue et vaincue,
      puis une autre, fuie par le vrai bouton « Fuir » (elle poursuit) ; les brigands — l'embuscade loin des routes, la parole
      avec le chef (gagnée en hauteur ; manquée en largeur, puis La Razzia, vaincue), sans rien de la caravane, une fois au plus
      par traversée, sans toucher aux piliers ni au compte des pourparlers ; le voyageur — assis et accablé dans le désert, loin
      des villes, il a un visage ; apaisé (en hauteur), il se relève et reprend la route ; non apaisé (en largeur), L'Abandon se
      lève, on la combat, vaincue elle le libère ; la rencontre qui attend tant que l'outil « parler » n'est pas reçu ; La Mecque,
      chances forcées : rien autour d'elle ; la Carte de la halte, sans nom qui en chevauche un autre (près de Damas, près de
      Koufa et d'al-Hîra) ; le bandeau d'une ville visitée (« … · La Mecque »). Captures dans le dossier.
   Usage : node v2/tools/monde.js [dossier de captures]       « MONDE CONFORME », sinon « ÉCART », « BLOQUÉ », « INACCESSIBLE »,
   « ABSENT » ; code de sortie 1. Captures (deviceScaleFactor 2) : la carte du monde entière, chaque ville, une sortie, une
   visite, La Mecque, en hauteur et en largeur, dans les trois dessins (fin, fin et adouci, d'origine), et leur planche. */
const path = require('path'), fs = require('fs');
const { chromium, devices } = require('playwright');
const out = process.argv[2] || path.join(__dirname, '../.smoke/monde');
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(__dirname, '../index.html');
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); }, si = (c, bien, mal, mot) => c ? ok(bien) : ko((mot || 'ÉCART') + ' ' + (mal || bien));
const captures = [], PARTIES = process.env.PARTIES || '12345', ORIENT = process.env.ORIENT || '';   // (PARTIES=2, ORIENT=haut|large : une partie, une orientation)

async function telephone(browser, w, h, qs) {
  const touch = h > w;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: touch, isMobile: touch, userAgent: touch ? devices['iPhone 13'].userAgent : undefined, acceptDownloads: true }), p = await ctx.newPage(), errors = [];
  p.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await p.goto(url + (qs || '')); await p.waitForTimeout(1600); await preparer(p);
  return { ctx, p, errors };
}
async function preparer(p) {
  await p.evaluate(() => {
    const I = window.ISNAD, W = I.world, S = I.script, q = s => document.querySelector(s);
    I.audio.setOn(false); I.debug.noOeuvres = true;
    I.debug.rencontres = { chimeres: 0, brigands: 0, voyageur: 0 };   // 2.30 : rien ne se croise sur la route, sauf dans la partie 5
    const T = window.__t = { toasts: [], cartons: [] };
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) T.toasts.push((n.textContent || '').trim()); }))).observe(q('#toasts'), { childList: true });
    { const oc = S.card; S.card = function (cls, html) { T.cartons.push(String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()); return oc.apply(this, arguments); }; }
    T.offerts = []; T.menus = []; { const om = S.menuPick; S.menuPick = function (qq, opts) { T.offerts.push({ q: typeof qq === 'string' ? qq : String((qq && qq.html) || '').replace(/<[^>]*>/g, ' '), opts: (opts || []).map(o => (o.t || '').replace(/\s+/g, ' ').trim()) });
      T.menus.push({ q: typeof qq === 'string' ? qq : String((qq && qq.html) || '').replace(/<[^>]*>/g, ' '), opts: (opts || []).map(o => ({ v: o.v, ok: !!o.ok, t: String(o.t || o.html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90) })) }); return om.apply(this, arguments); }; }
    // (2.30 : le pourparler qui se joue — ses manches disent la valeur de chaque réponse, dans l'ordre où elles s'affichent)
    { const orun = S.run; S.run = function (ops) { (function va(v) { if (!Array.isArray(v)) return; if (v[0] === 'parley' && v[1] && v[1].rounds) T.parley = v[1]; else v.forEach(va); })(ops); return orun.apply(this, arguments); }; }
    T.combats = []; { const ob = I.battle.start; I.battle.start = function (o) { T.combats.push({ group: (o.group || []).join('+'), fuite: !!o.fuite, bg: o.bg, temoins: (o.temoins || []).length, cibles: null }); setTimeout(() => { const C = I.battle.contexte(); if (C && T.combats.length) T.combats[T.combats.length - 1].cibles = C.all.filter(e => e.side === 'foe').map(e => e.def && e.def.name).join('+'); }, 400); return ob.apply(this, arguments); }; }
    // 2.30 : marcher tout droit, case par case, jusqu'à n cases ou jusqu'à ce que quelque chose se passe
    T.avancer = async (dir, n, ms) => { const h = I.input.held, t0 = performance.now(), cell = () => Math.floor(W.player.x / 16) + ',' + Math.floor(W.player.y / 16); let c0 = cell(), k = 0;
      while (performance.now() - t0 < (ms || 20000) && k < n) { if (S.busy || W.lock || I.battle.active || I.monde.occupe || W.npcs.some(x => x.route)) break; h.up = h.down = h.left = h.right = false; h[dir] = true; await new Promise(r => requestAnimationFrame(r)); const c = cell(); if (c !== c0) { c0 = c; k++; } }
      h.up = h.down = h.left = h.right = false; return { k, occupe: !!(S.busy || I.battle.active || I.monde.occupe) }; };
    // 2.30 : une rangée de n cases du désert, loin des routes (quatre cases) et des villes (six cases), la plus proche d'une case
    T.rangee = (n, depuis) => { const m = W.map, C = I.monde.champs(), bon = (x, y) => x > 0 && y > 0 && x < m.w - 1 && y < m.h - 1 && !m.solid[y * m.w + x] && ['sand', 'dune', 'steppe'].includes(m.g0(x * 16 + 8, y * 16 + 8)) && C.route[y * m.w + x] >= 4 && C.eau[y * m.w + x] >= 3 && !C.interdit[y * m.w + x] && C.lieux.every(s => Math.max(Math.abs(s[0] - x), Math.abs(s[1] - y)) >= 6);
      let best = null; for (let y = 2; y < m.h - 2; y++) for (let x = 2; x < m.w - n - 2; x++) { let b = true; for (let k = 0; k < n && b; k++) b = bon(x + k, y) && bon(x + k, y - 1) && bon(x + k, y + 1); if (!b) continue; const d = Math.hypot(x - depuis[0], y - depuis[1]); if (!best || d < best.d) best = { x, y, d }; }
      return best; };
    T.visible = s => { const e = q(s); return !!e && !e.hidden; };
    T.attendre = (cond, ms) => new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { let v = false; try { v = cond(); } catch (e) { v = false; } if (v) { clearInterval(iv); res(true); } else if (Date.now() - t0 > (ms || 60000)) { clearInterval(iv); res(false); } }, 50); });
    T.calme = () => I.scene === W && !!W.map && !S.busy && !W.lock && !I.battle.active && !I.ui.menuOpen && !(I.passages && I.passages.occupe);
    T.etat = () => ({ saga: W.saga && W.saga.id, ch: W.ch && W.ch.id, obj: W.objIndex, carte: W.map && W.map.id, x: Math.round(W.player.x), y: Math.round(W.player.y), dir: W.player.dir, monde: S.flags._monde ? JSON.parse(JSON.stringify(S.flags._monde)) : null,
      drapeaux: Object.keys(S.flags).filter(k => k !== '_monde').sort().map(k => k + '=' + JSON.stringify(S.flags[k])).join(','), pnj: W.npcs.filter(n => n.placed && !n.hidden).map(n => n.id + '@' + Math.round(n.x) + ',' + Math.round(n.y) + '/' + n.map).sort().join(' '),
      cp: I.save.data.cp ? I.save.data.cp.map : null, occupe: !!S.busy || !!W.lock || T.visible('#choice'), cible: (() => { const t = W.target(); return t ? { x: Math.round(t.gx), y: Math.round(t.gy), passage: !!t.passage } : null; })() });
    T.dialogue = () => T.visible('#dialog') ? (q('#dialog .text').textContent || '').trim() : '';
    T.lu = async () => { if (!T.visible('#dialog')) { await new Promise(r => setTimeout(r, 200)); return ''; } await T.attendre(() => T.visible('#dialog') && getComputedStyle(q('#dialog .next')).visibility === 'visible', 8000); await new Promise(r => setTimeout(r, 200)); return T.dialogue(); };
    T.poser = (x, y, dir) => { W.player.x = x; W.player.y = y; if (dir !== undefined) W.player.dir = dir; W.dest = null; W.stop(); W.resetTrail(); W.updateCam(true); };
    // marcher jusqu'à un point au clavier simulé (les flèches tenues), en suivant le chemin des cases
    T.marcher = async (x, y, ms) => { const p = W.player, h = I.input.held, t0 = performance.now(), carte = W.map; let path = W.pathTo(p.x, p.y, x, y) || [], best = 1e9, calee = 0;
      while (performance.now() - t0 < ms && W.map === carte) { const d = Math.hypot(x - p.x, y - p.y); if (d < 6) break;
        if (S.busy || W.lock || I.battle.active) { h.up = h.down = h.left = h.right = false; await new Promise(r => setTimeout(r, 100)); continue; }
        while (path.length > 1 && Math.hypot(path[0][0] - p.x, path[0][1] - p.y) < 3) path.shift();
        const wp = path.length > 1 ? path[0] : [x, y]; h.up = h.down = h.left = h.right = false; const dx = wp[0] - p.x, dy = wp[1] - p.y; if (dx > 1.2) h.right = true; else if (dx < -1.2) h.left = true; if (dy > 1.2) h.down = true; else if (dy < -1.2) h.up = true;
        await new Promise(r => requestAnimationFrame(r));
        if (d < best - 0.5) { best = d; calee = 0; } else if (++calee > 90) { calee = 0; path = W.pathTo(p.x, p.y, x, y) || path; } }
      h.up = h.down = h.left = h.right = false; return Math.round(Math.hypot(x - p.x, y - p.y)); };
    // où toucher la scène pour aller vers un point de la carte : le point lui-même s'il se voit, sinon dans sa direction —
    // jamais sur la manette, une étiquette ni un bouton de la scène
    T.ecran = (wx, wy) => { const G = I.gfx, c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect(), p = W.player;
      const X = x => (x - Math.round(W.cam.x)) / G.PW * c.width + c.left, Y = y => (y - Math.round(W.cam.y)) / G.PH * c.height + c.top;
      const hx = X(p.x), hy = Y(p.y - 6), tx = X(wx), ty = Y(wy - 4);
      const L = Math.max(s.left, 0) + 30, R = Math.min(s.right, innerWidth) - 30, H = Math.max(s.top, 0) + 60, B = Math.min(s.bottom, innerHeight) - 24;
      const pads = [...document.querySelectorAll('#pad .dpad, #pad button, #pad .joy')].filter(b => getComputedStyle(b).visibility !== 'hidden').map(b => b.getBoundingClientRect()).filter(r => r.width > 4);
      const libre = (a, b) => a > L && a < R && b > H && b < B && pads.every(r => a < r.left - 16 || a > r.right + 16 || b < r.top - 16 || b > r.bottom + 16) && [[0, 0], [-12, 0], [12, 0], [0, -12], [0, 12]].every(([u, v]) => { const e = document.elementFromPoint(a + u, b + v); return !!e && ['cv', 'stage', 'ui', 'view'].includes(e.id); });
      for (let k = 20; k > 0; k--) { const a = hx + (tx - hx) * k / 20, b = hy + (ty - hy) * k / 20; if (libre(a, b) && (k === 20 || Math.hypot(a - hx, b - hy) > 30)) return [a, b]; }
      return null; };
    // toucher la scène là où se voit un point de la carte, même tout près du bord de l'écran (le bord de la carte, sa porte)
    T.brut = (wx, wy) => { const G = I.gfx, c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect(), x = (wx - Math.round(W.cam.x)) / G.PW * c.width + c.left, y = (wy - Math.round(W.cam.y)) / G.PH * c.height + c.top; return [Math.max(s.left + 4, Math.min(s.right - 4, x)), Math.max(s.top + 4, Math.min(s.bottom - 4, y))]; };
    T.vus = []; new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) T.vus.push((n.textContent || '').trim()); }))).observe(q('#noms'), { childList: true });
    T.noms = () => [...document.querySelectorAll('#noms .nom')].filter(e => !e.classList.contains('cache')).map(e => e.textContent);
    T.lecon = () => T.toasts.filter(t => /Par la porte, la route mène aux autres villes/.test(t)).length;
  });
}
// faire avancer ce qui se dit (dialogues, cartons) jusqu'à ce que le joueur ait la main, ou qu'un choix s'ouvre
async function avancer(p, n = 160) {
  for (let i = 0; i < n; i++) {
    const e = await p.evaluate(() => { const T = window.__t; return T.calme() ? 'calme' : T.visible('#choice') ? 'choix' : (T.visible('#dialog') || (T.visible('#card') && document.querySelector('#card').classList.contains('on'))) ? 'lire' : T.visible('#chain') ? 'chaine' : ''; });
    if (e === 'calme' || e === 'choix' || e === 'chaine') return e;
    if (e === 'lire') { await p.evaluate(() => window.__t.lu()); await p.keyboard.press('Enter'); }
    await p.waitForTimeout(160);
  }
  return 'bloque';
}
const capture = async (P, nom, quoi) => { const f = path.join(out, nom + '.png'); await P.screenshot({ path: f }); captures.push({ f, quoi }); };

(async () => {
  const browser = await chromium.launch(); let toutesErreurs = [];

  /* ---------- 1. la géographie, les dates, les portes, les visites (hors du jeu) ---------- */
  if (PARTIES.includes('1')) {
    const T = await telephone(browser, 960, 540), P = T.p;
    const g = await P.evaluate(() => {
      const I = window.ISNAD, D = I.D, M = I.maps, W = I.world, S = I.script, V = D.MONDE.villes, km = M.kmCase();
      const m = M.build('monde', {}), r = { places: [], distances: [], relie: M.relie(m), hors: m.horsTerre.length, mini: !!m.mini, taille: [m.w, m.h, m.canvas.width, m.canvas.height], absentes: [] };
      Object.keys(V).forEach(id => { const s = m.spots[id], pr = M.projeter(V[id].lat, V[id].lon); if (!s) { r.absentes.push(id); return; } r.places.push({ id, s, pr: pr.map(v => +v.toFixed(2)), ecart: Math.max(Math.abs(s[0] - Math.floor(pr[0])), Math.abs(s[1] - Math.floor(pr[1]))) }); });
      const gc = (a, b) => { const R = 6371, f = Math.PI / 180, dl = (b.lat - a.lat) * f, dn = (b.lon - a.lon) * f, h = Math.sin(dl / 2) ** 2 + Math.cos(a.lat * f) * Math.cos(b.lat * f) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
      [['medine', 'mecque'], ['medine', 'damas'], ['koufa', 'bassora'], ['damas', 'quds']].forEach(([a, b]) => { const A = m.spots[a], B = m.spots[b], d = Math.hypot(A[0] - B[0], A[1] - B[1]) * km, v = gc(V[a], V[b]); r.distances.push({ a, b, carte: Math.round(d), vrai: Math.round(v), ecart: +((d - v) / v * 100).toFixed(1) }); });
      // les dates : la carte de chaque chapitre
      r.dates = Object.keys(D.MONDE.depuis).map(ch => { const an = D.MONDE.depuis[ch].an, mm = M.build('monde', { an }); return { ch, an, koufa: !!mm.spots.koufa, bassora: !!mm.spots.bassora, fustat: !!mm.spots.fustat, relie: M.relie(mm) }; });
      // les portes : chaque chapitre de chaque saga, chaque carte qu'il emploie, chaque objectif — lesquelles s'ouvrent
      const cartes = c => { const l = new Set([c.map]); (function va(v) { if (Array.isArray(v)) { if (v[0] === 'map' && typeof v[1] === 'string') l.add(v[1]); v.forEach(va); } else if (v && typeof v === 'object') Object.keys(v).forEach(k => va(v[k])); })(c); return [...l]; };
      const sv = { saga: W.saga, ch: W.ch, ci: W.ci, obj: W.objIndex, map: W.map, flags: S.flags, scene: I.scene }, construites = {}; r.portes = []; r.fautes = [];
      I.scene = W; I.debug.auto = false; I.debug.walk = false;
      Object.keys(I.sagas).forEach(sid => { const sg = I.sagas[sid]; (sg.chapters || []).forEach((c, ci) => { cartes(c).forEach(mid => { if (!D.MAPS[mid]) return;
        const mp = construites[mid] || (construites[mid] = M.build(mid, {})); W.saga = sg; W.ch = c; W.ci = ci; W.map = mp; S.flags = {};
        for (let o = 0; o < (c.objectives || []).length; o++) { W.objIndex = o; const ouv = I.passages.PASSAGES.filter(x => /^porte-/.test(x.id) && x.ok()).map(x => x.id), d = D.MONDE.depuis[c.id], att = !!(d && d.portes.some(p => p.carte === mid && o >= p.des));
          if (ouv.length && !att || !ouv.length && att) r.fautes.push(`${sid}/${c.id} obj ${o} sur ${mid} : ${ouv.join('+') || 'aucune'}`); if (ouv.length) r.portes.push(`${c.id}/${mid}`); } }); }); });
      W.saga = sv.saga; W.ch = sv.ch; W.ci = sv.ci; W.objIndex = sv.obj; W.map = sv.map; S.flags = sv.flags; I.scene = sv.scene;
      r.portes = [...new Set(r.portes)];
      // les visites : chacune se bâtit, son comptoir et son tapis, reliés ; La Mecque sans mosquée
      r.visites = Object.keys(V).filter(id => V[id].carte).map(id => { const mv = M.build(V[id].carte, { time: 'day' }), tuiles = new Set(); for (let y = 0; y < mv.h; y++) for (let x = 0; x < mv.w; x++) tuiles.add(mv.g0(x * 16 + 1, y * 16 + 1));
        return { id, carte: V[id].carte, relie: M.relie(mv), comptoir: !!mv.spots.comptoir, priere: !!mv.spots.priere, mosquee: Object.keys(mv.spots).filter(k => /mosquee|ecole/.test(k)).concat(mv.objs.filter(o => ['minbar', 'basin'].includes(o.type)).map(o => o.type)).concat(['gwall', 'mihrab', 'zsand', 'zellij'].filter(t => tuiles.has(t))), foes: W.foes.filter(f => f.map === V[id].carte).length, boutique: (D.GEAR_SHOPS[V[id].carte] || []).length, etendards: mv.objs.filter(o => o.type === 'banner').length }; });
      // 2.30 : les étendards — aucune visite n'en a ; Médine garde les siens ; la visite de Médine (et celle de Koufa) est sa ville,
      // case pour case, hors des cases de ses étendards, et ses autres objets sont les mêmes
      r.etendards = ['medine', 'koufa', 'camp', 'romaine'].map(id => ({ id, n: M.build(id, { time: 'day' }).objs.filter(o => o.type === 'banner').length }));
      r.memes = [['medine', 'visite_medine'], ['koufa', 'visite_koufa']].map(([a, b]) => { const A = M.build(a, { time: 'day' }), B = M.build(b, { time: 'day' }), ban = new Set(A.objs.filter(o => o.type === 'banner').map(o => Math.floor(o.x / 16) + ',' + Math.floor((o.y - 15) / 16)));
        let tuiles = 0, pleines = 0; for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) { if (A.g0(x * 16 + 8, y * 16 + 8) !== B.g0(x * 16 + 8, y * 16 + 8)) tuiles++; if (!ban.has(x + ',' + y) && A.solid[y * A.w + x] !== B.solid[y * A.w + x]) pleines++; }
        const cle = o => o.type + '@' + o.x + ',' + o.y, oa = A.objs.filter(o => o.type !== 'banner').map(cle).sort().join(' '), ob = B.objs.map(cle).sort().join(' ');
        return { a, b, tuiles, pleines, objets: oa === ob, liberees: [...ban].filter(k => { const [x, y] = k.split(',').map(Number); return !B.solid[y * B.w + x]; }).length, etendards: ban.size }; });
      return r;
    });
    si(g.mini === false && g.taille[0] === 96 && g.taille[1] === 96, `la carte du monde : ${g.taille[0]} × ${g.taille[1]} cases, une toile de ${g.taille[2]} × ${g.taille[3]} points en dessin fin (${(g.taille[2] * g.taille[3] / 1e6).toFixed(1)} Mpx), sans petite carte au coin`, `la carte du monde : ${JSON.stringify(g.taille)}, petite carte ${g.mini}`);
    si(!g.absentes.length && g.places.every(q => q.ecart <= 1), `chaque ville à sa place projetée, à une case près : ${g.places.map(q => q.id + ' [' + q.s.join(',') + ']').join(' · ')}`, `places : ${JSON.stringify(g.places)} absentes ${g.absentes}`, 'ABSENT');
    si(g.distances.every(d => Math.abs(d.ecart) <= 10), `les distances, à 10 % près du grand cercle : ${g.distances.map(d => `${d.a}–${d.b} ${d.carte} km (réel ${d.vrai}, ${d.ecart > 0 ? '+' : ''}${d.ecart} %)`).join(' · ')}`, `distances : ${JSON.stringify(g.distances)}`);
    si(g.relie && g.hors === 0, 'toutes les villes se rejoignent à pied ; aucune route dans la mer', `reliées : ${g.relie}, routes dans la mer : ${g.hors}`, 'INACCESSIBLE');
    const dI = g.dates.filter(d => /^ab/.test(d.ch)), dV = g.dates.filter(d => /^a\d/.test(d.ch)), dF = g.dates.filter(d => d.an < 21), dB = g.dates.filter(d => d.an < 14);
    si(dI.every(d => !d.koufa) && dV.every(d => d.koufa) && dF.every(d => !d.fustat) && g.dates.filter(d => d.an >= 21).every(d => d.fustat) && dB.every(d => !d.bassora) && g.dates.every(d => d.relie),
      `les dates : Koufa absente des chapitres de la saga I (${dI.map(d => d.ch).join(', ')}), présente dans ceux de la saga V ; Fustât absente avant 21 H (${dF.map(d => d.ch + ' ' + d.an).join(', ')}) ; Bassora avant 14 H ; chaque carte d'époque reliée`, `dates : ${JSON.stringify(g.dates)}`);
    si(!g.fautes.length, `les portes : ouvertes exactement là où D.MONDE.depuis les met (${g.portes.join(', ')}) — nulle part ailleurs (2084, veillées, mer, noosphère, dernier maillon, routes, Dhû l-Qassa, Harûrâ', Nahrawân)`, `portes : ${g.fautes.slice(0, 12).join(' · ')}`);
    const vis = g.visites;
    si(vis.every(v => v.relie && v.comptoir && v.priere && v.boutique > 0 && !v.foes), `les visites : ${vis.map(v => v.carte).join(', ')} — chacune se bâtit, son comptoir (une boutique) et son tapis se rejoignent à pied, aucune chimère`, `visites : ${JSON.stringify(vis)}`, 'INACCESSIBLE');
    const mq = vis.find(v => v.id === 'mecque'), autres = vis.filter(v => v.id !== 'mecque' && v.carte !== 'visite_hira' && !/visite_(quds|damas|homs|qinnasrin)/.test(v.carte));
    si(mq && !mq.mosquee.length && autres.every(v => v.mosquee.length), 'La Mecque : ni mosquée, ni école de mosquée, ni mur ni carreaux de mosquée, ni mihrab, ni minbar — les autres villes d’Arabie gardent la leur', `La Mecque : ${JSON.stringify(mq)}`);
    const et = g.etendards, med = et.find(e => e.id === 'medine');
    si(vis.every(v => v.etendards === 0) && med && med.n === 2 && g.memes.every(q => !q.tuiles && !q.pleines && q.objets && q.liberees === q.etendards),
      `les étendards (2.30) : aucune visite n'en a (${vis.map(v => v.carte + ' ' + v.etendards).join(', ')}) ; les cartes des récits gardent les leurs (${et.map(e => e.id + ' ' + e.n).join(', ')}) ; les visites de Médine et de Koufa sont leur ville case pour case, les mêmes objets, hors des ${g.memes.map(q => q.etendards).join(' et ')} cases de leurs étendards, rendues au sol`,
      `les étendards : ${JSON.stringify({ visites: vis.map(v => [v.carte, v.etendards]), et, memes: g.memes })}`);
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'géographie · ' + e)); await T.ctx.close();
  }

  /* ---------- 2. le premier chapitre d'Abû Bakr : sortir, la route, La Mecque, revenir ---------- */
  let exporte = null;
  for (const [w, h] of PARTIES.includes('2') ? [[390, 844], [844, 390]].filter(([w, h]) => !ORIENT || (ORIENT === 'haut') === (h > w)) : []) {
    const nom = w + '×' + h, haut = h > w, T = await telephone(browser, w, h), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    // une partie d'avant en hauteur (la leçon se dit une fois), une partie neuve en largeur (l'outil « route » est donné)
    await E(neuve => { const I = window.ISNAD, W = I.world; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; if (neuve) { I.lecons.ouvrir(); }
      document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); W.roster = {}; W.saga = null; W.startChapter('abubakr', 0); }, !haut);
    await P.waitForTimeout(1500); await avancer(P);
    if (!haut) await E(() => { const l = window.ISNAD.save.data.lecons; if (l) l.dernier = null; });   // (rien d'autre à apprendre d'abord : la porte peut donner son outil)
    const e0 = await E(() => window.__t.etat());
    // vers la porte du sud : au doigt (un toucher au bord de la carte, sous la porte), ou au clavier (marcher, puis pousser)
    const versBord = async (x, y, touche, carte) => { const ici = () => E(() => window.ISNAD.world.map && window.ISNAD.world.map.id);
      if (haut) { for (let i = 0; i < 16; i++) { if ((await ici()) !== carte) break; const pt = await E(([x, y]) => { const T = window.__t, W = window.ISNAD.world; if (!T.calme() || W.dest) return null; return Math.hypot(W.player.x - x, W.player.y - y) < 140 ? T.brut(x, y) : T.ecran(x, y); }, [x, y]); if (pt) await P.touchscreen.tap(pt[0], pt[1]); await P.waitForTimeout(1100); } }
      else { await E(([x, y]) => window.__t.marcher(x, y, 20000), [x, y + (touche === 'ArrowDown' ? -14 : touche === 'ArrowUp' ? 14 : 0)]); await P.keyboard.down(touche); for (let i = 0; i < 20 && (await ici()) === carte; i++) await P.waitForTimeout(150); await P.keyboard.up(touche); }
      await E(c => window.__t.attendre(() => window.ISNAD.world.map && window.ISNAD.world.map.id !== c && window.__t.calme(), 8000), carte); await avancer(P); return (await ici()) !== carte; };
    const porteSud = await E(() => { const W = window.ISNAD.world, s = W.spotPx('porte_sud'); return [s[0], W.map.h * 16 - 3]; });
    const sorti = await versBord(porteSud[0], porteSud[1], 'ArrowDown', 'medine');
    const e1 = await E(() => { const I = window.ISNAD, W = I.world, s = W.map.spots.medine, T = window.__t; return Object.assign(T.etat(), { pres: s ? Math.round(Math.hypot(W.player.x - (s[0] * 16 + 8), W.player.y - (s[1] * 16 + 13))) : -1, sud: s ? W.player.y > s[1] * 16 + 13 : false, lecon: T.lecon(), recue: !!(I.save.data.lecons && I.save.data.lecons.recus.route !== undefined), sobre: I.oeuvres.sobre() }); });
    await P.waitForTimeout(500); const noms1 = await E(() => window.__t.vus.filter(t => /Médine/.test(t)).concat(window.__t.noms()));   // (le nom d'une ville passe sous un bouton de la scène : il s'efface, puis revient)
    await capture(P, `sortie-${w}x${h}`, `${nom} · sorti de Médine par la porte du sud`);
    si(sorti && e1.carte === 'monde' && e1.monde && e1.monde.ville === 'medine' && e1.obj === e0.obj && e1.pres > 16 && e1.pres < 90 && e1.sud && e1.cp === 'monde' && e1.cible && e1.cible.passage && e1.lecon === 1 && (haut || e1.recue) && e1.sobre && noms1.some(t => /Médine/.test(t)),
      `${nom} · sorti par la porte du sud ${haut ? 'au doigt' : 'au clavier'} : la carte du monde, Idris à ${e1.pres} points de Médine, au sud ; le même chapitre (objectif ${e1.obj}), le point de reprise pris sur la route ; la flèche montre Médine ; la leçon « La route » dite${haut ? '' : ' (l’outil donné)'} ; « ${noms1.find(t => /Médine/.test(t))} »`, `${nom} · la sortie : ${JSON.stringify({ sorti, e0, e1, noms1 })}`, 'BLOQUÉ');
    // en largeur : la partie exportée ici
    if (!haut) exporte = await E(() => window.ISNAD.save.exporter());
    // jusqu'à La Mecque, à pied
    const mecque = await E(() => { const s = window.ISNAD.world.map.spots.mecque; return [s[0] * 16 + 8, s[1] * 16 + 13]; });
    let noms2 = [];
    const devantMecque = [mecque[0], mecque[1] - 24];
    if (haut) { // au doigt : des touchers vers l'entrée de la ville, jusqu'à s'y tenir ; puis un toucher sur la ville
      for (let i = 0; i < 60; i++) { const d = await E(([x, y]) => Math.hypot(window.ISNAD.world.player.x - x, window.ISNAD.world.player.y - y), devantMecque); if (d < 18 || (await E(() => window.ISNAD.world.map.id)) !== 'monde') break;   // (pas plus près : toucher Idris lui-même, c'est agir — il entrerait)
        const pt = await E(([x, y]) => window.__t.calme() && !window.ISNAD.world.dest ? window.__t.ecran(x, y) : null, devantMecque); if (pt) await P.touchscreen.tap(pt[0], pt[1]); await P.waitForTimeout(700); }
      await P.waitForTimeout(500); noms2 = await E(() => window.__t.vus.filter(t => /La Mecque/.test(t))); if (!noms2.length) console.log('    (diagnostic) ' + JSON.stringify(await E(([x, y]) => ({ d: Math.round(Math.hypot(window.ISNAD.world.player.x - x, window.ISNAD.world.player.y - y)), carte: window.ISNAD.world.map.id, calme: window.__t.calme(), hud: document.querySelector('#hud').hidden, noms: document.querySelector('#noms').innerHTML.slice(0, 300) }), mecque)));
      for (let i = 0; i < 6 && (await E(() => window.ISNAD.world.map.id)) === 'monde'; i++) { const pt = await E(([x, y]) => window.__t.calme() ? window.__t.ecran(x, y) : null, mecque); if (pt) await P.touchscreen.tap(pt[0], pt[1]); await P.waitForTimeout(900); } }
    else { await E(([x, y]) => window.__t.marcher(x, y, 60000), devantMecque); await P.waitForTimeout(500); noms2 = await E(() => window.__t.vus.filter(t => /La Mecque/.test(t))); await E(([x, y]) => window.__t.marcher(x, y, 8000), mecque); }
    await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'visite_mecque', 8000));
    await P.waitForTimeout(900); await capture(P, `mecque-carton-${w}x${h}`, `${nom} · entrée à La Mecque : le carton`);
    await avancer(P);
    const e2 = await E(() => { const I = window.ISNAD, W = I.world, T = window.__t, s = W.map.spots; return Object.assign(T.etat(), { carton: T.cartons[T.cartons.length - 1] || '', mosquee: Object.keys(s).filter(k => /mosquee|ecole/.test(k)), comptoir: !!s.comptoir && W.reach(W.player.x, W.player.y, s.comptoir[0] * 16 + 8, s.comptoir[1] * 16 + 13), priere: !!s.priere && W.reach(W.player.x, W.player.y, s.priere[0] * 16 + 8, s.priere[1] * 16 + 13), foes: W.foes.filter(f => f.map === W.map.id && !f.done).length, rodeurs: W.foes.filter(f => f.rodeur && f.map === W.map.id).length }); });
    await capture(P, `mecque-${w}x${h}`, `${nom} · La Mecque, une visite sobre`);
    si(e2.carte === 'visite_mecque' && /La Mecque/.test(e2.carton) && /An 11 H/.test(e2.carton) && noms2.some(t => /Entrer : La Mecque/.test(t)) && !e2.mosquee.length && e2.comptoir && e2.priere && !e2.foes && !e2.rodeurs && e2.obj === e0.obj && e2.monde && e2.monde.visite === 'mecque' && e2.cp === 'visite_mecque',
      `${nom} · à pied jusqu'à La Mecque (« ${noms2.find(t => /Entrer/.test(t))} ») : la visite — le carton « ${e2.carton} » ; ni mosquée ni chimère ; le comptoir et le tapis se rejoignent ; le même chapitre`, `${nom} · La Mecque : ${JSON.stringify({ noms2, e2 })}`, 'INACCESSIBLE');
    // le tapis, sobre : prier et se reposer, sans œuvres ni descente
    await E(() => { const W = window.ISNAD.world, s = W.map.spots.priere; window.__t.poser(s[0] * 16 + 8, s[1] * 16 + 13, 0); window.__t.offerts = []; });
    await P.waitForTimeout(600); await capture(P, `mecque-tapis-${w}x${h}`, `${nom} · La Mecque : la cour du tapis`);
    await P.keyboard.press('Enter'); await P.waitForTimeout(700);
    const tapis = await E(() => window.__t.offerts.slice(-1)[0] || null); await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(400); await avancer(P);
    si(tapis && tapis.opts.length === 3 && /De passage/.test(tapis.q), `${nom} · le tapis de La Mecque : prier et se reposer, garder une copie, plus tard — de passage, les œuvres se comptent dans les récits ; aucune descente`, `${nom} · le tapis : ${JSON.stringify(tapis)}`);
    // ressortir par la porte par où l'on est entré (le nord), puis revenir à Médine
    const porteN = await E(() => { const W = window.ISNAD.world, s = W.spotPx(W.player.y < W.map.h * 8 ? 'porte_nord' : 'porte_sud'); return [s[0], s[1] < W.map.h * 8 ? 3 : W.map.h * 16 - 3, s[1] < W.map.h * 8 ? 'ArrowUp' : 'ArrowDown']; });
    // (depuis la place, sur la grand-rue : juste sous le tapis, un toucher vers la porte tombait sur lui, et Idris allait au tapis)
    await E(() => { const W = window.ISNAD.world, s = W.map.spots.place || W.map.spots.priere; window.__t.poser(s[0] * 16 + 8, s[1] * 16 + 13, 3); });
    const ressorti = await versBord(porteN[0], porteN[1], porteN[2], 'visite_mecque');
    const e3 = await E(() => { const W = window.ISNAD.world, s = W.map.spots.mecque; return Object.assign(window.__t.etat(), { pres: s ? Math.round(Math.hypot(W.player.x - (s[0] * 16 + 8), W.player.y - (s[1] * 16 + 13))) : -1 }); });
    si(ressorti && e3.carte === 'monde' && e3.pres < 90 && e3.monde && !e3.monde.visite && e3.cible && e3.cible.passage, `${nom} · ressorti de La Mecque par sa porte : sur la route, à ${e3.pres} points de la ville ; la flèche montre toujours Médine`, `${nom} · sortie de La Mecque : ${JSON.stringify({ ressorti, e3 })}`, 'BLOQUÉ');
    const medine = await E(() => { const s = window.ISNAD.world.map.spots.medine; return s ? [s[0] * 16 + 8, s[1] * 16 + 13] : [0, 0]; });
    if (haut) { for (let i = 0; i < 60; i++) { if ((await E(() => window.ISNAD.world.map.id)) !== 'monde') break; const pt = await E(([x, y]) => window.__t.calme() ? window.__t.ecran(x, y) : null, medine); if (pt) await P.touchscreen.tap(pt[0], pt[1]); await P.waitForTimeout(900); } }
    else await E(([x, y]) => window.__t.marcher(x, y, 60000), medine);
    await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'medine' && window.__t.calme(), 8000)); await avancer(P);
    const e4 = await E(() => window.__t.etat()); await capture(P, `retour-medine-${w}x${h}`, `${nom} · revenu à Médine, à la porte du sud`);
    si(e4.carte === 'medine' && !e4.monde && e4.obj === e0.obj && e4.drapeaux === e0.drapeaux && e4.pnj === e0.pnj && e4.y > 640 && Math.abs(e4.x - porteSud[0]) < 70 && e4.cp === 'medine' && e4.dir === 3,
      `${nom} · revenu à Médine ${haut ? 'au doigt' : 'au clavier'} : à la porte du sud (${e4.x}, ${e4.y}), tourné vers la ville ; le même objectif (${e4.obj}), les mêmes drapeaux, les mêmes personnages à leur place`, `${nom} · le retour : ${JSON.stringify({ e0, e4 })}`, 'BLOQUÉ');
    // une seconde sortie : la leçon ne se redit pas
    const s2 = await versBord(porteSud[0], porteSud[1], 'ArrowDown', 'medine'); const l2 = await E(() => window.__t.lecon());
    si(s2 && l2 === 1, `${nom} · une seconde sortie : la leçon ne se redit pas`, `${nom} · seconde sortie : ${JSON.stringify({ s2, l2 })}`);
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => nom + ' · ' + e)); await T.ctx.close();
  }

  /* ---------- 2 bis. la partie exportée sur la route se réimporte et s'y rouvre (par les vrais boutons) ---------- */
  if (exporte) {
    const ctx = await browser.newContext({ viewport: { width: 844, height: 390 } }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForTimeout(1700);
    const bouton = (dans, texte) => p.locator(`${dans} button`, { hasText: texte }).first();
    await bouton('#title', 'Réglages').click(); await bouton('#title', 'Importer une partie').click(); await p.waitForSelector('#partie:not([hidden])');
    await p.locator('#partie textarea').fill(exporte); await bouton('#partie', 'Lire cette partie').click(); await p.waitForTimeout(400);
    await bouton('#partie', /Reprendre cette partie|Remplacer ma partie/).click(); await p.waitForTimeout(2600);
    const ou = await p.evaluate(() => { const I = window.ISNAD, W = I.world, S = I.script; return { monde: I.scene === W, saga: W.saga && W.saga.id, ch: W.ch && W.ch.id, carte: W.map && W.map.id, ville: S.flags._monde && S.flags._monde.ville, retour: S.flags._monde && S.flags._monde.retour && S.flags._monde.retour.map }; });
    const f = path.join(out, 'reimport-844x390.png'); await p.screenshot({ path: f }); captures.push({ f, quoi: 'la partie réimportée, sur la route' });
    si(ou.monde && ou.saga === 'abubakr' && ou.ch === 'ab1' && ou.carte === 'monde' && ou.ville === 'medine' && ou.retour === 'medine', 'une partie exportée sur la route se réimporte par les vrais boutons et s’y rouvre : la carte du monde, le chapitre ab1, le chemin du retour vers Médine', `réimport : ${JSON.stringify(ou)}`, 'BLOQUÉ');
    toutesErreurs = toutesErreurs.concat(errs.map(e => 'réimport · ' + e)); await ctx.close();
  }

  /* ---------- 3. chaque chapitre à portes, chaque ville de passage ; le joueur de test du moteur ---------- */
  if (PARTIES.includes('3')) {
    const T = await telephone(browser, 844, 390), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    // (une chimère rencontrée en chemin n'ouvre pas de combat ici : ce contrôle-ci éprouve les portes)
    await E(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv._route = 1; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.world.fight = async () => {}; });
    const chapitres = await E(() => { const D = window.ISNAD.D, l = []; Object.keys(D.MONDE.depuis).forEach(ch => D.MONDE.depuis[ch].portes.forEach(p => l.push({ ch, carte: p.carte, des: p.des, ville: p.ville }))); return l; });
    const faits = [], fautes = [];
    for (const c0 of chapitres) {
      const c = Object.assign({}, c0, { des: await E(c => { const I = window.ISNAD, ch = Object.values(I.sagas).map(s => (s.chapters || []).find(x => x.id === c.ch)).find(Boolean); let o = c.des; while (ch.objectives[o] && ch.objectives[o].auto) o++; return o; }, c0) });   // (un objectif automatique passe aussitôt : le joueur a la main au suivant)
      // le chapitre, repris à cet objectif sur cette carte (un point de reprise), devant sa porte
      await E(c => { const I = window.ISNAD, W = I.world, sid = Object.keys(I.sagas).find(s => (I.sagas[s].chapters || []).some(x => x.id === c.ch)), sg = I.sagas[sid], ci = sg.chapters.findIndex(x => x.id === c.ch), ch = sg.chapters[ci];
        I.input.reset(); W.roster = {}; W.saga = null; W.startChapter(sid, ci, { saga: sid, ci, obj: c.des, map: c.carte, opts: {}, pos: [400, 300], party: ch.party.slice(), npcs: {}, foes: [], chests: [], flags: {} }); }, c);
      await P.waitForTimeout(1200); await avancer(P);
      const bord = await E(() => { const W = window.ISNAD.world, g = window.ISNAD.D.MAPS[W.map.id].gabarit, m = W.map; if (g === 'camp') { const s = W.spotPx('entree'); return { x: 3, y: s[1], k: 'ArrowLeft', depuis: [s[0], s[1]] }; } if (g === 'romaine') { const s = W.spotPx('porte'); return { x: s[0], y: m.h * 16 - 3, k: 'ArrowDown', depuis: s }; } const s = W.spotPx('porte_sud'); return { x: s[0], y: m.h * 16 - 3, k: 'ArrowDown', depuis: [s[0], s[1] - 16] }; });   // (la porte du sud : au nord, deux récits ont un objectif devant la porte)
      await E(b => window.__t.poser(b.depuis[0], b.depuis[1], 0), bord);
      await avancer(P); const avant = await E(() => window.__t.etat());
      await E(b => window.__t.marcher(b.x + (b.k === 'ArrowLeft' ? 14 : 0), b.y + (b.k === 'ArrowDown' ? -14 : b.k === 'ArrowUp' ? 14 : 0), 15000), bord); await P.keyboard.down(bord.k);
      for (let i = 0; i < 20 && (await E(() => window.ISNAD.world.map.id)) !== 'monde'; i++) await P.waitForTimeout(150); await P.keyboard.up(bord.k);
      await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'monde' && window.__t.calme(), 6000));
      const route = await E(v => { const W = window.ISNAD.world, s = W.map.spots[v]; return Object.assign(window.__t.etat(), { pres: s ? Math.round(Math.hypot(W.player.x - (s[0] * 16 + 8), W.player.y - (s[1] * 16 + 13))) : -1 }); }, c.ville);
      if (c.ch === 'k3' && c.ville === 'homs') await capture(P, 'route-homs-844x390', 'k3 · sorti de Homs');
      await E(v => { const W = window.ISNAD.world, s = W.map.spots[v]; return s && window.__t.marcher(s[0] * 16 + 8, s[1] * 16 + 13, 12000); }, c.ville);
      await E(m => window.__t.attendre(() => window.ISNAD.world.map.id === m && window.__t.calme(), 6000), c.carte);
      const apres = await E(() => window.__t.etat());
      const bon = route.carte === 'monde' && route.monde && route.monde.ville === c.ville && route.pres > 16 && route.pres < 90 && apres.carte === c.carte && apres.obj === avant.obj && apres.ch === c.ch && !apres.monde && apres.drapeaux === avant.drapeaux;
      const court = e => e && [e.carte, e.obj, e.x + ',' + e.y, e.occupe ? 'occupé' : '', e.monde ? 'route:' + e.monde.ville : ''].join(' ');
      (bon ? faits : fautes).push(`${c.ch}/${c.carte}→${c.ville}` + (bon ? '' : ` [avant ${court(avant)} · route ${court(route)} (${route.pres}) · après ${court(apres)}]`));
    }
    si(!fautes.length, `chaque chapitre à portes, sorti au clavier puis revenu : ${faits.join(', ')} — Idris paraît à côté de sa ville, et revient à son objectif`, `portes : ${fautes.join(' · ')}`, 'BLOQUÉ');
    // chaque ville de passage (au dernier maillon d'Alî : toutes existent), visitée puis quittée par sa porte
    await E(() => { const I = window.ISNAD, W = I.world, sg = I.sagas.ali, ch = sg.chapters[0]; I.input.reset(); W.roster = {}; W.saga = null; W.startChapter('ali', 0, { saga: 'ali', ci: 0, obj: 0, map: 'koufa', opts: {}, pos: [470, 600], party: ch.party.slice(), npcs: {}, foes: [], chests: [], flags: {} }); });
    await P.waitForTimeout(1200); await avancer(P);
    await E(() => { const W = window.ISNAD.world, s = W.spotPx('porte_sud'); window.__t.poser(s[0], s[1], 0); }); await E(() => window.__t.marcher(window.ISNAD.world.spotPx('porte_sud')[0], window.ISNAD.world.map.h * 16 - 16, 8000));
    await P.keyboard.down('ArrowDown'); for (let i = 0; i < 20 && (await E(() => window.ISNAD.world.map.id)) !== 'monde'; i++) await P.waitForTimeout(150); await P.keyboard.up('ArrowDown');
    await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'monde' && window.__t.calme(), 6000));
    const villes = await E(() => { const D = window.ISNAD.D; return Object.keys(D.MONDE.villes).filter(v => D.MONDE.villes[v].carte && v !== 'koufa'); });
    const vus = [], rates = [];
    for (const v of villes) {
      if ((await E(() => window.ISNAD.world.map.id)) !== 'monde') { rates.push(v + ' (pas sur la route)'); continue; }
      await E(v => { const W = window.ISNAD.world, q = W.resolve([v, 0, 2], 'monde', W.player); window.__t.poser(q[0], q[1], 3); }, v); await P.waitForTimeout(200);
      await E(v => { const W = window.ISNAD.world, s = W.map.spots[v]; return window.__t.marcher(s[0] * 16 + 8, s[1] * 16 + 13, 8000); }, v);
      const carte = await E(v => window.ISNAD.D.MONDE.villes[v].carte, v);
      await E(m => window.__t.attendre(() => window.ISNAD.world.map.id === m, 6000), carte); await P.waitForTimeout(700);
      if (['mecque', 'damas', 'fustat', 'hira', 'quds'].includes(v)) await capture(P, `visite-${v}-844x390`, `la visite de ${v}`);
      await avancer(P);
      const e = await E(() => { const W = window.ISNAD.world, s = W.map.spots, T = window.__t; return Object.assign(T.etat(), { comptoir: !!s.comptoir && W.reach(W.player.x, W.player.y, s.comptoir[0] * 16 + 8, s.comptoir[1] * 16 + 13), priere: !!s.priere && W.reach(W.player.x, W.player.y, s.priere[0] * 16 + 8, s.priere[1] * 16 + 13) }); });
      // ressortir : par la porte la plus proche
      const b = await E(() => { const W = window.ISNAD.world, g = window.ISNAD.D.MAPS[W.map.id].gabarit, m = W.map; if (g === 'camp') { const s = W.spotPx('entree'); return { x: 17, y: s[1], k: 'ArrowLeft' }; } if (g === 'romaine') { const s = W.spotPx('porte'); return { x: s[0], y: m.h * 16 - 17, k: 'ArrowDown' }; } const s = W.spotPx(W.player.y < m.h * 8 ? 'porte_nord' : 'porte_sud'); return s[1] < m.h * 8 ? { x: s[0], y: 17, k: 'ArrowUp' } : { x: s[0], y: m.h * 16 - 17, k: 'ArrowDown' }; });
      await E(b => window.__t.marcher(b.x, b.y, 15000), b); await P.keyboard.down(b.k); for (let i = 0; i < 20 && (await E(() => window.ISNAD.world.map.id)) !== 'monde'; i++) await P.waitForTimeout(150); await P.keyboard.up(b.k);
      await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'monde' && window.__t.calme(), 6000));
      const r = await E(() => window.__t.etat());
      const bon = e.carte === carte && e.comptoir && e.priere && r.carte === 'monde' && r.monde && r.monde.ville === 'koufa';
      (bon ? vus : rates).push(v + (bon ? '' : ' ' + JSON.stringify({ e, r })));
    }
    si(!rates.length, `chaque ville de passage se visite (sa carte, son comptoir, son tapis) et l'on en ressort par sa porte : ${vus.join(', ')}`, `visites : ${rates.join(' · ')}`, 'INACCESSIBLE');
    // le joueur de test du moteur ne sort jamais : à pied (walk) et au doigt (tap) — et le joueur automatique
    const jamais = [];
    for (const mode of ['walk', 'auto']) {
      await E(() => { const I = window.ISNAD, W = I.world, sg = I.sagas.abubakr, ch = sg.chapters[0]; I.input.reset(); W.roster = {}; W.saga = null; W.startChapter('abubakr', 0, { saga: 'abubakr', ci: 0, obj: 0, map: 'medine', opts: {}, pos: [488, 690], party: ch.party.slice(), npcs: {}, foes: [], chests: [], flags: {} }); });
      await P.waitForTimeout(1200); await avancer(P);
      await E(mode => { const I = window.ISNAD, W = I.world; I.debug[mode] = true; if (mode === 'auto') W._autoBusy = true; window.__t.poser(488, 722, 0); }, mode);
      await P.keyboard.down('ArrowDown'); await P.waitForTimeout(900); await P.keyboard.up('ArrowDown');
      jamais.push(await E(mode => { const I = window.ISNAD, W = I.world, r = W.map.id; I.debug[mode] = false; W._autoBusy = false; return mode + ':' + r; }, mode));
    }
    si(jamais.every(x => /:medine$/.test(x)), `le joueur de test du moteur ne sort jamais par une porte (${jamais.join(', ')})`, `joueur de test : ${jamais.join(', ')}`);
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'chapitres · ' + e)); await T.ctx.close();
  }

  /* ---------- 5. 2.30 (D222) : les rencontres de la route ---------- */
  // mener ce qui se dit jusqu'au calme : un carton, une réplique se passent d'un A (Entrée) ; un choix se fait au vrai bouton,
  // selon `choix` (« meilleur » : la réponse qui donne le plus de confiance, « pire » : le moins ; devant une idée noire, la
  // manière qui porte) ; un combat, l'IA de test le mène, ou l'on fuit par le vrai bouton « Fuir » (`combat` : 'fuir')
  async function mener(P, choix, combat, ms = 150000) {
    const t0 = Date.now(), vu = { combats: 0, choix: [], fui: false, lignes: [] };
    while (Date.now() - t0 < ms) {
      const e = await P.evaluate(() => { const T = window.__t, I = window.ISNAD; if (I.battle.active) return 'combat'; if (T.visible('#choice')) return 'choix'; if (T.visible('#dialog') || (T.visible('#card') && document.querySelector('#card').classList.contains('on'))) return 'lire'; return T.calme() && !I.monde.occupe ? 'calme' : ''; });
      if (e === 'calme') { await P.waitForTimeout(400); if (await P.evaluate(() => window.__t.calme() && !window.ISNAD.monde.occupe && !window.ISNAD.battle.active && !window.__t.visible('#dialog'))) return vu; continue; }
      if (e === 'lire') { const l = await P.evaluate(() => window.__t.lu()); if (l) vu.lignes.push(l); await P.keyboard.press('Enter'); await P.waitForTimeout(160); continue; }
      if (e === 'choix') {
        await P.waitForTimeout(450);
        const i = await P.evaluate(c => { const T = window.__t, q = document.querySelector('#choice .prompt'), pt = q ? q.textContent : '', R = T.parley && T.parley.rounds.find(r => pt.indexOf(r.say) >= 0), M = T.menus[T.menus.length - 1];
          const o = R ? R.opts.map(x => ({ v: x.v })) : M ? M.opts : null; if (!o) return 0; if (o.some(x => x.ok)) return o.findIndex(x => x.ok); if (o.some(x => typeof x.v === 'number')) { let b = 0; o.forEach((x, j) => { if (c === 'pire' ? x.v < o[b].v : x.v > o[b].v) b = j; }); return b; } return 0; }, choix);
        vu.choix.push(i); await P.evaluate(i => { const b = document.querySelectorAll('#choice .opt')[i]; if (b) b.click(); }, i); await P.waitForTimeout(350); continue; }
      if (e === 'combat') {
        vu.combats++;
        if (combat === 'fuir' && !vu.fui) {
          let pret = false; for (let k = 0; k < 160 && !pret; k++) { const r = await P.evaluate(() => { const c = document.querySelector('#battle .cmd'), b = document.querySelector('#battle .banner'); if (b && !b.hidden && b.classList.contains('attend')) return 'attend'; return c && c.querySelector('.mlist.main .mi') && !c.querySelector('.mhint') && b.hidden ? 'cmd' : ''; });
            if (r === 'cmd') { await P.waitForTimeout(350); pret = true; } else { if (r === 'attend') await P.keyboard.press('Enter'); await P.waitForTimeout(150); } }
          vu.fui = pret && await P.evaluate(() => { const b = [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].find(x => !x.hidden && /Fuir/.test(x.textContent)); if (b) b.click(); return !!b; });
          await P.evaluate(() => window.__t.attendre(() => !window.ISNAD.battle.active, 20000)); return vu; }   // (aussitôt : la chimère fuie poursuit)
        await P.evaluate(() => { const I = window.ISNAD; I.debug.auto = true; I.world._autoBusy = true; I.speed = 20; });
        await P.evaluate(() => window.__t.attendre(() => !window.ISNAD.battle.active, 150000));
        await P.evaluate(() => { const I = window.ISNAD; I.debug.auto = false; I.world._autoBusy = false; I.speed = 1; }); continue; }
      await P.waitForTimeout(120);
    }
    vu.bloque = true; return vu;
  }
  // un chapitre repris sur la route (un point de reprise sur la carte du monde) : sorti par la porte du sud de sa ville
  const surRoute = (E, sid, ville, an, depuis) => E(([sid, ville, an, depuis]) => { const I = window.ISNAD, W = I.world, sg = I.sagas[sid], ch = sg.chapters[0], T = window.__t; I.input.reset(); W.roster = {}; W.saga = null; T.menus = []; T.combats = []; I.monde.journal = [];
    const s = I.maps.casesVilles()[depuis || ville]; return W.startChapter(sid, 0, { saga: sid, ci: 0, obj: 0, map: 'monde', opts: { time: 'day', an }, pos: [s[0] * 16 + 8, (s[1] + 2) * 16 + 13], party: ch.party.slice(), npcs: {}, foes: [], chests: [], flags: { _monde: { ville, retour: { map: ville, opts: { time: 'day' }, pos: [470, 690], dir: 3, npcs: {} } } } }); }, [sid, ville, an, depuis]);
  for (const [w, h] of PARTIES.includes('5') ? [[390, 844], [844, 390]].filter(([w, h]) => !ORIENT || (ORIENT === 'haut') === (h > w)) : []) {
    const nom = w + '×' + h, haut = h > w, T = await telephone(browser, w, h), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    await E(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv._route = 1; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); });
    const rencontres = o => E(o => { window.ISNAD.debug.rencontres = o; }, o);

    // 5a. les chimères du désert : où elles se posent (cent tirages autour de Médine, cent autour de La Mecque), et rien près
    // d'une ville ni de La Mecque ; plus nombreuses loin des routes ; aucune idée noire
    if (!haut) {
      await rencontres({ brigands: 0, voyageur: 0 }); await surRoute(E, 'abubakr', 'medine', 11); await P.waitForTimeout(1200); await avancer(P);
      const t = await E(() => { const I = window.ISNAD, W = I.world, S = I.script, D = I.D, m = W.map, Ch = I.monde.champs(), R0 = D.MONDE.rencontres, tr = I.monde.traversee(), r = { n: 0, mal: [], loin: 0, pres: 0, groupes: new Set(), noirs: 0, desert: true };
        const cheb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])), lieux = Object.keys(m.spots).map(k => [k, m.spots[k]]);
        const eligibles = { loin: 0, pres: 0 };
        const loinDe = (k, c) => k === 'mecque' ? R0.chimeres.mecque : R0.villes;   // (les chimères : à douze cases de La Mecque ou moins, jamais)
        r.malOk = 0; for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (I.rodeurs.rueOk(x, y) && lieux.some(([k, s]) => cheb(s, [x, y]) <= loinDe(k))) r.malOk++;   // (une case où l'on pourrait rôder, près d'une ville)
        const c0 = tr.c;
        [['medine'], ['mecque']].forEach(([v]) => { const s = m.spots[v];
          tr.c = s.slice(); { const C = I.monde.rodent(); for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (I.rodeurs.rueOk(x, y) && C.libre(x, y)) eligibles[Ch.route[y * m.w + x] >= R0.route ? 'loin' : 'pres'] += 100; }
          for (let k = 0; k < 100; k++) { tr.g = 1000 + k; tr.c = s.slice(); delete tr.vaincues; I.rodeurs.poserRues();
            W.foes.filter(f => f.rue).forEach(f => { r.n++; const c = [Math.floor(f.x / 16), Math.floor(f.y / 16)], sol = m.g0(f.x, f.y); r.groupes.add(f.group[0]); if (D.NOIRS.includes(f.group[0]) || (I.common.enemies[f.group[0]] || {}).idee) r.noirs++;
              if (!['sand', 'dune', 'steppe'].includes(sol)) r.desert = false;
              lieux.forEach(([k2, q]) => { const d = cheb(q, c); if (d <= loinDe(k2)) r.mal.push(k2 + ':' + d); });
              r[Ch.route[c[1] * m.w + c[0]] >= R0.route ? 'loin' : 'pres']++; }); } });
        tr.c = c0; tr.g = 7; I.rodeurs.poserRues();
        r.groupes = [...r.groupes]; r.densite = +((r.loin / eligibles.loin) / Math.max(1e-9, r.pres / eligibles.pres)).toFixed(2); r.eligibles = eligibles; r.mecque = R0.chimeres.mecque; r.villes = R0.villes; return r; });
      si(t.n > 400 && !t.mal.length && !t.malOk && t.desert && !t.noirs && t.densite > 1.5,
        `les chimères du désert : ${t.n} posées en deux cents tirages (autour de Médine et de La Mecque) — sur le sable, les dunes et la steppe, aucune à ${t.villes} cases d'une ville ou moins ni à ${t.mecque} de La Mecque ou moins (et aucune case où rôder n'y est), ${t.densite} fois plus denses loin des routes ; ${t.groupes.join(', ')} — aucune idée noire`,
        `les chimères du désert : ${JSON.stringify(t)}`);
      // elles vont et viennent trois secondes : jamais hors du désert, jamais près d'une ville
      await P.waitForTimeout(3000);
      const mv = await E(() => { const I = window.ISNAD, W = I.world, m = W.map; return W.foes.filter(f => f.rue && !f.done).map(f => { const x = Math.floor(f.x / 16), y = Math.floor(f.y / 16); return { ok: I.rodeurs.rueOk(x, y) && !I.monde.interditCase(x, y), sol: m.g0(f.x, f.y) }; }); });
      si(mv.length && mv.every(q => q.ok), `${nom} · trois secondes plus tard, les ${mv.length} chimères n'ont quitté ni le désert ni ses abords permis`, `${nom} · leur ronde : ${JSON.stringify(mv)}`);
    }

    // 5b. une chimère rencontrée, combattue et vaincue ; puis une autre, fuie par le vrai bouton
    {
      await rencontres({ brigands: 0, voyageur: 0 }); await surRoute(E, 'abubakr', 'medine', 11); await P.waitForTimeout(1200); await avancer(P);
      const rangee = await E(() => { const W = window.ISNAD.world, p = W.player; return window.__t.rangee(8, [Math.floor(p.x / 16), Math.floor(p.y / 16)]); });
      // une chimère du désert, la plus proche, vient tout contre celui qui mène, posé dans le désert loin des villes
      const amener = () => E(rg => { const I = window.ISNAD, W = I.world, T = window.__t; W.healAll(); T.poser(rg.x * 16 + 8, rg.y * 16 + 13, 2); const f = W.foes.filter(q => q.rue && !q.done && !q.voyageur).sort((a, b) => Math.hypot(a.x - W.player.x, a.y - W.player.y) - Math.hypot(b.x - W.player.x, b.y - W.player.y))[0]; if (!f) return null;
        f.x = W.player.x + 10; f.y = W.player.y - 5; f.cx = null; return T.attendre(() => I.battle.active, 8000).then(v => v ? f.id : null); }, rangee);
      const id1 = rangee && await amener(); if (id1) { await P.waitForTimeout(900); await capture(P, `rencontre-chimere-${w}x${h}`, `${nom} · une chimère du désert, rencontrée`); }
      const c1 = id1 ? await mener(P, 'meilleur', 'gagner') : null;
      const e1 = await E(id => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.id === id), tr = I.monde.traversee(); return { done: !!(f && f.done), vaincue: !!(f && tr && tr.vaincues && tr.vaincues[f.cle]), combats: window.__t.combats.slice(), carte: W.map.id, dirhams: I.trade.dirhams() }; }, id1);
      si(id1 && c1 && !c1.bloque && e1.done && e1.vaincue && e1.combats.length === 1 && e1.combats[0].fuite && e1.combats[0].bg === 'desert' && e1.carte === 'monde',
        `${nom} · une chimère du désert (${e1.combats[0] && e1.combats[0].group}) : son contact ouvre un combat de rencontre (on peut fuir, le décor du désert), mené et gagné ; vaincue, elle ne revient pas de la traversée`, `${nom} · la chimère : ${JSON.stringify({ id1, c1, e1 })}`, 'BLOQUÉ');
      const id2 = await amener(); const c2 = id2 ? await mener(P, 'meilleur', 'fuir', 30000) : null;
      await E(() => window.__t.attendre(() => !!window.ISNAD.rodeurs.fuite, 4000));   // (la fuite se dit une fois le combat refermé)
      const e2 = await E(id => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.id === id); return { poursuit: !!(f && I.rodeurs.poursuit(f)), fuite: !!I.rodeurs.fuite, done: !!(f && f.done), carte: W.map.id }; }, id2);
      si(id2 && c2 && c2.fui && !e2.done && e2.carte === 'monde' && e2.poursuit, `${nom} · une autre, fuie par le vrai bouton « Fuir » : le combat se referme, la chimère poursuit celui qui mène`, `${nom} · la fuite : ${JSON.stringify({ id2, c2, e2 })}`, 'INACCESSIBLE');
      await E(id => { const I = window.ISNAD; I.rodeurs.finFuite(); I.world.foes.forEach(f => { if (f.rue) f.done = true; }); }, id2);
    }

    // 5c. les brigands : loin des routes, une embuscade ; la parole avec le chef (gagnée en hauteur, manquée en largeur — puis La
    // Razzia) ; rien de la caravane ; une fois au plus par traversée ; ni les piliers ni le compte des pourparlers ne bougent
    {
      await rencontres({ chimeres: 0, voyageur: 0, brigands: 1 }); await surRoute(E, 'abubakr', 'medine', 11); await P.waitForTimeout(1200); await avancer(P);
      const avant = await E(() => { const I = window.ISNAD, W = I.world; return { piliers: JSON.stringify(W.pillars()), parley: JSON.stringify(I.save.data.parley || {}), dirhams: I.trade.dirhams() }; });
      const rg = await E(() => { const W = window.ISNAD.world, p = W.player; return window.__t.rangee(14, [Math.floor(p.x / 16), Math.floor(p.y / 16)]); });
      await E(rg => window.__t.poser(rg.x * 16 + 8, rg.y * 16 + 13, 2), rg);
      // 2.32 (D224) : on les voit — quatre hommes devant celui qui mène, le chef avec son visage, deux chameaux chargés ; la parole
      // avec le chef montre sa silhouette ; la parole perdue, La Razzia se lève du milieu d'eux ; au combat, ils sont à l'écart
      await E(() => { window.__chefFig = 0; window.__razzia = 0; clearInterval(window.__veilleP); window.__veilleP = setInterval(() => { const I = window.ISNAD, nm = document.querySelector('#dialog .name'), f = document.querySelector('#dialog .fig');
        if (nm && /chef des pillards/i.test(nm.textContent) && f && !f.hidden && f.getAttribute('src')) window.__chefFig++; if (I.gens && I.gens.betes.some(b => b.chimere === 'razzia')) window.__razzia++; }, 80); });
      const pas1 = await E(() => window.__t.avancer('right', 12, 15000));
      await E(() => window.__t.attendre(() => window.ISNAD.monde.journal.some(j => j.etat === 'paraissent' || j.etat === 'sans-place'), 8000));
      await P.waitForTimeout(900);
      const vus = await E(() => { const I = window.ISNAD, W = I.world, D = I.D, p = W.player, H = W.npcs.filter(n => n.pillard), chef = H.find(n => n.id === '_pillards_chef');
        return { hommes: H.length, chef: !!chef, visage: !!chef && chef.sheet.look.kind !== 'compagnon' && !D.sansVisage(chef.name, W.saga.id) && chef.sheet.look.coiffe === 'litham', loin: H.map(n => Math.round(Math.hypot(n.x - p.x, n.y - p.y))),
          betes: I.gens.betes.filter(b => b.pillards && b.esp === 'chameau' && b.charge).length, cibles: W.foes.filter(f => !f.done && f.map === W.map.id && H.some(n => Math.hypot(n.x - f.x, n.y - f.y) < 4)).length }; });
      if (pas1.occupe) await capture(P, `rencontre-brigands-${w}x${h}`, `${nom} · l'embuscade des brigands : on les voit`);
      si(vus.hommes === 4 && vus.chef && vus.visage && vus.betes === 2 && !vus.cibles && vus.loin.every(d => d > 24 && d < 90),
        `${nom} · les pillards paraissent : ${vus.hommes} hommes à ${vus.loin.join(', ')} points, le chef avec son visage (les yeux sous le chèche), ${vus.betes} chameaux chargés ; aucun n'est une chimère`, `${nom} · les pillards : ${JSON.stringify(vus)}`, 'ABSENT');
      const c = await mener(P, haut ? 'meilleur' : 'pire', 'gagner');
      const apres = await E(() => { clearInterval(window.__veilleP); const I = window.ISNAD; return { chefFig: window.__chefFig, razzia: window.__razzia, restent: I.world.npcs.filter(n => n.pillard).length + I.gens.betes.filter(b => b.pillards || b.chimere).length, etats: I.monde.journal.filter(j => j.quoi === 'brigands' && j.etat).map(j => j.etat).join(',') }; });
      const pas2 = await E(() => window.__t.avancer('left', 10, 12000));   // (loin des routes encore, la chance forcée : rien de plus)
      const b = await E(() => { const I = window.ISNAD, W = I.world, T = window.__t, tr = I.monde.traversee(); return { journal: I.monde.journal.filter(j => j.quoi === 'brigands' && !j.etat).length, brig: tr && tr.brig, cartons: T.cartons.join(' | ').slice(-1200), combats: T.combats.slice(), piliers: JSON.stringify(W.pillars()), parley: JSON.stringify(I.save.data.parley || {}), dirhams: I.trade.dirhams(), carte: W.map.id,
        caravane: T.menus.some(m => /servi d’abord/.test(m.q)) }; });
      const txt = (await E(() => window.__t.toasts.concat(window.__t.cartons).join(' '))) + ' ' + c.lignes.join(' ');
      const parole = haut ? !b.combats.length : b.combats.some(x => /razzia/.test(x.group) && !x.fuite);
      si(pas1.occupe && !c.bloque && b.journal === 1 && b.brig && parole && !b.caravane && !/Un caravanier|La caravane a été pillée/.test(txt) && b.piliers === avant.piliers && b.parley === avant.parley && b.carte === 'monde' && (haut || b.dirhams > avant.dirhams),
        `${nom} · les brigands : une embuscade loin des routes (après ${pas1.k} cases), la parole avec leur chef ${haut ? 'gagnée — ils posent les armes, sans combat' : 'manquée — puis La Razzia, ses chimères, vaincues (' + (b.dirhams - avant.dirhams) + ' dirhams trouvés)'} ; rien de la caravane (ni caravanier, ni part à servir) ; ${pas2.k} cases encore loin des routes : aucune autre — une au plus par traversée ; ni les piliers ni le compte des pourparlers ne bougent`,
        `${nom} · les brigands : ${JSON.stringify({ pas1, c: Object.assign({}, c, { lignes: c.lignes.slice(0, 4) }), pas2, b, avant })}`, 'BLOQUÉ');
      const rz = b.combats.find(x => /razzia/.test(x.group)) || {};
      si(apres.chefFig > 0 && !apres.restent && (haut ? apres.etats === 'paraissent,rendent,partis' && !apres.razzia : apres.etats === 'paraissent,razzia,baissent,partis' && apres.razzia > 0 && rz.temoins === 4 && !/pillard/i.test(rz.cibles || '')),
        `${nom} · la parole avec le chef, sa silhouette dans la boîte de dialogue ; ${haut ? 'gagnée : ils rendent, puis s’en vont avec les bêtes' : 'perdue : La Razzia se lève du milieu d’eux, puis le combat, les quatre pillards à l’écart (cibles : ' + rz.cibles + ') ; ils posent les armes et s’en vont'}`,
        `${nom} · les pillards, ensuite : ${JSON.stringify({ apres, rz })}`, 'ABSENT');
      if (haut) console.log('    (les lignes de l’embuscade) ' + c.lignes.slice(0, 3).map(l => '« ' + l.slice(0, 90) + ' »').join(' · '));
    }

    // 5d. le voyageur : assis et accablé dans le désert, loin des villes ; apaisé (en hauteur) il se relève et reprend la route ;
    // non apaisé (en largeur) L'Abandon se lève, on la combat, vaincue elle le libère
    {
      await rencontres({ chimeres: 0, brigands: 0, voyageur: 1 }); await surRoute(E, 'abubakr', 'medine', 11); await P.waitForTimeout(1200); await avancer(P);
      const avant = await E(() => { const I = window.ISNAD; return { piliers: JSON.stringify(I.world.pillars()), parley: JSON.stringify(I.save.data.parley || {}), mal: JSON.stringify((I.save.data.mal || {}).ev || {}) }; });
      const rg = await E(() => { const W = window.ISNAD.world, p = W.player; return window.__t.rangee(14, [Math.floor(p.x / 16), Math.floor(p.y / 16)]); });
      await E(rg => window.__t.poser(rg.x * 16 + 8, rg.y * 16 + 13, 2), rg);
      const pas = await E(() => window.__t.avancer('right', 12, 15000));
      const v0 = await E(() => { const I = window.ISNAD, W = I.world, D = I.D, m = W.map, n = W.npcs.find(x => x.id === '_voyageur'); if (!n) return null; const c = [Math.floor(n.x / 16), Math.floor(n.y / 16)], Ch = I.monde.champs();
        return { pose: n.pose, sol: m.g0(n.x, n.y), interdit: I.monde.interditCase(c[0], c[1]), villes: Ch.lieux.reduce((d, s) => Math.min(d, Math.max(Math.abs(s[0] - c[0]), Math.abs(s[1] - c[1]))), 99), visage: !D.sansVisage(n.name, 'abubakr') && n.sheet.look && n.sheet.look.kind !== 'compagnon', nom: n.name, x: Math.round(n.x), y: Math.round(n.y) }; });
      await P.waitForTimeout(700); if (v0) await capture(P, `rencontre-voyageur-${w}x${h}`, `${nom} · un voyageur assis dans le sable`);
      si(v0 && v0.pose === 'accable' && ['sand', 'dune', 'steppe'].includes(v0.sol) && !v0.interdit && v0.villes >= 4 && v0.visage && v0.nom === 'Un voyageur',
        `${nom} · le voyageur : « ${v0 && v0.nom} », posé après ${pas.k} cases, assis et accablé (${v0 && v0.pose}) dans le désert (${v0 && v0.sol}), à ${v0 && v0.villes} cases de la ville la plus proche ; il a un visage (un homme, pas un Compagnon)`, `${nom} · le voyageur : ${JSON.stringify({ pas, v0 })}`, 'ABSENT');
      // lui parler : au doigt, le toucher ; au clavier, aller à côté de lui, tourné vers lui, et A (Entrée)
      if (v0) {
        if (haut) { for (let i = 0; i < 6 && !(await E(() => window.ISNAD.monde.occupe)); i++) { const pt = await E(v => window.__t.calme() ? window.__t.brut(v.x, v.y - 12) : null, v0); if (pt) await P.touchscreen.tap(pt[0], pt[1]); await P.waitForTimeout(1200); } }
        else { await E(v => window.__t.marcher(v.x - 20, v.y, 8000), v0); await E(() => { window.ISNAD.world.player.dir = 2; }); await P.keyboard.press('Enter'); await P.waitForTimeout(800); }
      }
      const parle = await E(() => window.ISNAD.monde.journal.some(j => j.quoi === 'voyageur' && j.etat === 'parle'));
      if (parle) await capture(P, `voyageur-pourparler-${w}x${h}`, `${nom} · le pourparler avec le voyageur`);
      const c = parle ? await mener(P, haut ? 'meilleur' : 'pire', 'gagner') : { bloque: true };
      await P.waitForTimeout(1500);
      const v1 = await E(() => { const I = window.ISNAD, W = I.world, T = window.__t, J = I.monde.journal.filter(j => j.quoi === 'voyageur').map(j => j.etat), tr = I.monde.traversee();
        return { journal: J, combats: T.combats.slice(), noir: T.menus.some(m => m.opts.some(o => o.ok)), reste: W.npcs.some(n => n.id === '_voyageur'), etat: tr && tr.voy && tr.voy.etat, chimere: W.foes.filter(f => f.voyageur).map(f => f.group[0] + (f.done ? ' vaincue' : '')),
          piliers: JSON.stringify(W.pillars()), parley: JSON.stringify(I.save.data.parley || {}), mal: JSON.stringify((I.save.data.mal || {}).ev || {}), dits: T.toasts.concat(T.cartons).join(' ') }; });
      const dialogue = await E(() => (document.querySelector('#dialog .text') || {}).textContent || '');
      const bon = haut ? (v1.journal.join(',') === 'pose,parle,apaise,parti' && !v1.combats.length)
        : (v1.journal.join(',') === 'pose,parle,combat,win,parti' && v1.combats.length === 1 && v1.combats[0].group === 'abandon' && v1.combats[0].fuite && v1.chimere.join() === 'abandon vaincue');
      si(parle && !c.bloque && bon && v1.noir && !v1.reste && v1.etat === 'parti' && v1.piliers === avant.piliers && v1.parley === avant.parley && v1.mal === avant.mal,
        haut ? `${nom} · lui parler (au doigt) : le pourparler, le Désespoir qui parle en lui — on lui répond, par la parole, la pédagogie ou la bienveillance ; apaisé, il se relève et reprend la route, sans combat ; rien ne touche au récit (piliers, pourparlers, idole)`
          : `${nom} · lui parler (A) : le pourparler, le Désespoir répondu ; la parole n'a pas suffi : L'Abandon se lève, un combat d'où l'on peut fuir, contre elle seule, gagné ; vaincue, elle le libère — il se relève et reprend la route ; rien ne touche au récit`,
        `${nom} · le voyageur : ${JSON.stringify({ parle, c: Object.assign({}, c, { lignes: c.lignes.slice(-6) }), v1: Object.assign({}, v1, { dits: v1.dits.slice(-400) }), dialogue, avant })}`, 'BLOQUÉ');
      { const L = c.lignes || []; si(L.some(l => haut ? /Je vais jusqu’à la piste/.test(l) : /C’est plus léger/.test(l)) && L.some(l => /À quoi bon/.test(l)), `${nom} · ce qu'il dit : « ${(L.find(l => /À quoi bon/.test(l)) || '').slice(0, 60)} » (le Désespoir parle en lui), puis « ${(L.find(l => /Je vais jusqu’à|C’est plus léger/.test(l)) || '').slice(0, 70)} »`, `${nom} · les lignes du voyageur : ${JSON.stringify(L.slice(-12))}`); }
    }

    // 5e. la rencontre attend tant que l'outil « parler » n'est pas reçu (une partie neuve) ; puis elle vient
    if (!haut) {
      await rencontres({ chimeres: 0, brigands: 1, voyageur: 0 }); await surRoute(E, 'abubakr', 'medine', 11); await P.waitForTimeout(1200); await avancer(P);
      await E(() => { const I = window.ISNAD; I.lecons.ouvrir(); ['marcher', 'aide', 'halte', 'route'].forEach(id => { I.lecons.recevoir(id); I.lecons.sequence(); }); I.monde.journal = []; });
      const rg = await E(() => { const W = window.ISNAD.world, p = W.player; return window.__t.rangee(14, [Math.floor(p.x / 16), Math.floor(p.y / 16)]); });
      await E(rg => window.__t.poser(rg.x * 16 + 8, rg.y * 16 + 13, 2), rg);
      const n0 = await E(() => window.__t.toasts.length), a = await E(() => window.__t.avancer('right', 10, 12000)), j1 = await E(() => window.ISNAD.monde.journal.length), n1 = await E(() => window.__t.toasts.length);
      await E(() => { const I = window.ISNAD; I.lecons.recevoir('parler'); });
      const b = await E(() => window.__t.avancer('left', 10, 12000)); const j2 = await E(() => window.ISNAD.monde.journal.filter(j => j.quoi === 'brigands' && !j.etat).length);   // (2.32 : les étapes de l'embuscade se notent à part, avec leur état)
      if (b.occupe) await mener(P, 'meilleur', 'gagner');
      await E(() => { delete window.ISNAD.save.data.lecons; });
      si(a.k >= 8 && !a.occupe && !j1 && n1 === n0 && b.occupe && j2 === 1, `${nom} · une partie neuve sans l'outil « parler » : ${a.k} cases loin des routes, la chance forcée, et rien — la rencontre attend ; l'outil reçu, elle vient (les brigands, à la ${b.k + 1}ᵉ case) ; aucun message de plus`,
        `${nom} · la rencontre qui attend : ${JSON.stringify({ a, j1, n0, n1, b, j2 })}`);
    }

    // 5f. La Mecque : sorti de sa visite, les chances forcées et trente chimères à poser — rien autour d'elle
    {
      await rencontres({ chimeres: 30, brigands: 1, voyageur: 1 });
      await surRoute(E, 'abubakr', 'medine', 11, 'mecque'); await P.waitForTimeout(1200); await avancer(P);
      const z = await E(async () => { const I = window.ISNAD, W = I.world, m = W.map, s = m.spots.mecque, R0 = I.D.MONDE.rencontres, T = window.__t, cheb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
        // tout autour de La Mecque, dans sa zone : on y marche, case après case
        const vues = []; for (let j = -R0.mecque; j <= R0.mecque; j++) for (let i = -R0.mecque; i <= R0.mecque; i++) { const x = s[0] + i, y = s[1] + j; if (m.solid[y * m.w + x]) continue; vues.push([x, y]); }
        for (const [x, y] of vues) { T.poser(x * 16 + 8, y * 16 + 13, 0); await new Promise(r => setTimeout(r, 40)); }
        const pres = W.foes.filter(f => f.rue && !f.done && cheb([Math.floor(f.x / 16), Math.floor(f.y / 16)], s) <= R0.chimeres.mecque).length;
        return { cases: vues.length, journal: I.monde.journal.filter(j => j.quoi !== 'sort').length, combat: I.battle.active, pres, chimeres: W.foes.filter(f => f.rue && !f.done).length, voyageur: W.npcs.some(n => n.route) }; });
      await E(() => { const W = window.ISNAD.world, s = W.map.spots.mecque; window.__t.poser(s[0] * 16 + 8, (s[1] + 2) * 16 + 13, 0); }); await P.waitForTimeout(900);
      await capture(P, `mecque-sans-rencontre-${w}x${h}`, `${nom} · autour de La Mecque, les chances forcées : rien`);
      si(z.cases > 30 && !z.journal && !z.combat && !z.pres && !z.voyageur && z.chimeres > 0, `${nom} · La Mecque : ${z.cases} cases de sa zone parcourues, les chances forcées, ${z.chimeres} chimères posées ailleurs sur la route — ni chimère à douze cases d'elle ou moins (on n'en voit aucune depuis elle), ni combat, ni brigands, ni voyageur`, `${nom} · autour de La Mecque : ${JSON.stringify(z)}`);
    }

    // 5g. la Carte de la halte : aucun nom n'en chevauche un autre (près de Damas, près de Koufa et d'al-Hîra : un chapitre d'Alî)
    {
      await rencontres({ chimeres: 0, brigands: 0, voyageur: 0 });
      const vues = [];
      for (const [v, dx, dy] of [['damas', 0, 1], ['koufa', 1, 0], ['hira', 0, 1]]) {
        await surRoute(E, 'ali', 'koufa', 36); await P.waitForTimeout(1000); await avancer(P);
        await E(([v, dx, dy]) => { const W = window.ISNAD.world, s = W.map.spots[v]; window.__t.poser((s[0] + dx) * 16 + 8, (s[1] + dy) * 16 + 13, 0); }, [v, dx, dy]);
        await E(() => window.ISNAD.ui.pause('carte')); await P.waitForTimeout(1200);
        const r = await E(() => { const L = [...document.querySelectorAll('#menu .carte .lieu, #menu .carte .ici')].filter(e => e.offsetWidth).map(e => ({ t: e.textContent, r: e.getBoundingClientRect() })), sur = [];
          for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i].r, b = L[j].r; if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) sur.push(L[i].t + ' / ' + L[j].t); }
          const B = document.querySelector('#menu .carte').getBoundingClientRect(), dehors = L.filter(q => q.r.left < B.left - 0.5 || q.r.right > B.right + 0.5 || q.r.top < B.top - 0.5 || q.r.bottom > B.bottom + 0.5).map(q => q.t);
          return { n: L.length, sur, dehors, noms: L.map(q => q.t) }; });
        if (v !== 'hira') await capture(P, `carte-halte-noms-${v}-${w}x${h}`, `${nom} · la Carte de la halte, près de ${v}`);
        vues.push(Object.assign({ v }, r));
        await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(500); await avancer(P);
      }
      si(vues.every(q => q.n >= 8 && !q.sur.length && !q.dehors.length), `${nom} · la Carte de la halte : ${vues.map(q => q.n + ' noms près de ' + q.v).join(', ')} — aucun n'en chevauche un autre (Koufa et al-Hîra, celui qui mène et Damas), aucun hors de la carte`,
        `${nom} · la Carte : ${JSON.stringify(vues)}`);
    }

    // 5h. le bandeau d'une ville visitée : son nom, et non celui de la ville du récit
    {
      await rencontres({ chimeres: 0, brigands: 0, voyageur: 0 }); await surRoute(E, 'abubakr', 'medine', 11, 'mecque'); await P.waitForTimeout(1200); await avancer(P);
      const sur = await E(() => document.querySelector('#hud .sub').textContent);
      await E(() => window.ISNAD.monde.entrer('mecque')); await E(() => window.__t.attendre(() => window.ISNAD.world.map.id === 'visite_mecque', 8000)); await P.waitForTimeout(900); await avancer(P);
      const dans = await E(() => document.querySelector('#hud .sub').textContent);
      await capture(P, `bandeau-mecque-${w}x${h}`, `${nom} · le bandeau, à La Mecque`);
      si(/La Mecque/.test(dans) && !/Médine/.test(dans) && /An 11 H/.test(dans) && /Médine/.test(sur), `${nom} · le bandeau d'une ville visitée : « ${dans.trim()} » (sur la route : « ${sur.trim()} »)`, `${nom} · le bandeau : ${JSON.stringify({ sur, dans })}`);
    }
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'rencontres ' + nom + ' · ' + e)); await T.ctx.close();
  }

  /* ---------- 4. les captures : la carte entière, chaque ville, dans les trois dessins, en hauteur et en largeur ---------- */
  for (const [dessin, qs] of PARTIES.includes('4') ? [['fin', ''], ['adouci', ''], ['origine', '?def=1']] : []) {
    for (const [w, h] of [[390, 844], [844, 390]]) {
      const T = await telephone(browser, w, h, qs), P = T.p, E = (fn, a) => P.evaluate(fn, a);
      if (dessin === 'adouci') await E(() => { const G = window.ISNAD.gfx, d = G.DESSINS.find(x => x[3]); if (d) G.definir(d[0]); });
      await E(() => { const I = window.ISNAD, W = I.world; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; sv._route = 1; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); W.roster = {}; W.saga = null;
        const ch = I.sagas.ali.chapters[0]; W.startChapter('ali', 0, { saga: 'ali', ci: 0, obj: 0, map: 'monde', opts: { time: 'day', an: 36 }, pos: [800, 800], party: ch.party.slice(), npcs: {}, foes: [], chests: [], flags: { _monde: { ville: 'koufa', retour: { map: 'koufa', opts: { time: 'day' }, pos: [470, 690], dir: 3, npcs: {} } } } }); });
      await P.waitForTimeout(1500); await avancer(P);
      for (const v of ['medine', 'mecque', 'damas', 'quds', 'koufa', 'fustat', 'yarmouk']) {
        await E(v => { const W = window.ISNAD.world, s = W.map.spots[v]; window.__t.poser(s[0] * 16 + 8, (s[1] + 2) * 16 + 13, 3); }, v); await P.waitForTimeout(700);
        await capture(P, `ville-${v}-${dessin}-${w}x${h}`, `${v} · ${dessin} · ${w}×${h}`);
      }
      if (dessin === 'fin' && w > h) { // la carte entière (la Carte de la halte)
        await E(() => window.ISNAD.ui.pause('carte')); await P.waitForTimeout(1200); await capture(P, 'carte-halte-844x390', 'la Carte de la halte, sur la route');
        const big = await E(() => { const W = window.ISNAD.world, cv = W.carte(); return { w: cv.width, h: cv.height, png: cv.toDataURL('image/png') }; });
        const f = path.join(out, 'monde-entier.png'); fs.writeFileSync(f, Buffer.from(big.png.split(',')[1], 'base64')); captures.push({ f, quoi: `la carte du monde entière (${big.w} × ${big.h})` });
      }
      toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'captures ' + dessin + ' · ' + e)); await T.ctx.close();
    }
  }
  // la planche : toutes les captures sur une page
  { const ctx = await browser.newContext({ viewport: { width: 1600, height: 1200 } }), p = await ctx.newPage();
    const items = captures.filter(c => !/monde-entier/.test(c.f)).map(c => `<figure><img src="file://${c.f}"><figcaption>${c.quoi}</figcaption></figure>`).join('');
    const html = path.join(out, 'planche.html'); fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#1a1420;color:#eee;font:12px sans-serif"><div style="display:flex;flex-wrap:wrap;gap:8px;padding:8px">${items}</div><style>figure{margin:0;width:190px}img{width:190px;border:1px solid #555}figcaption{font-size:10px}</style></body></html>`);
    await p.goto('file://' + html);
    await p.waitForTimeout(1500); const f = path.join(out, 'planche.png'); await p.screenshot({ path: f, fullPage: true }); await ctx.close(); console.log('    planche : ' + f); }

  if (toutesErreurs.length) { anomalies++; console.log('--- ERREURS ---'); [...new Set(toutesErreurs)].slice(0, 12).forEach(e => console.log(e)); }
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ MONDE CONFORME — la carte du monde, ses villes et leurs dates, les portes des récits et elles seules, la route et le retour, les visites (sans étendards) et La Mecque sobre ; les rencontres de la route — les chimères du désert, les brigands, le voyageur —, rien autour de La Mecque, la Carte sans noms qui se chevauchent, le bandeau des villes visitées ; en hauteur au doigt et en largeur au clavier (captures dans ${out})`);
  await browser.close();
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
