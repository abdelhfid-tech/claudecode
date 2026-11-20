#!/usr/bin/env node
/* ISNAD 2.x — la course (le décideur, 19 novembre, devant la 2.16 : « on dirait pas que le personnage court, on dirait qu'il
   vole ou qu'il plane […] aussi il va trop vite, diminue de 30 % sa vitesse »).
   Usage : node tools/course.js                     contrôle, dans le vrai jeu (une rue de Médine, Idris et ses deux suiveurs) :
                                                    1. la vitesse : la course va 1,225 fois la marche ;
                                                    2. le pied d'appui ne glisse pas : à 60 et à 120 images par seconde, sa place
                                                       au sol est suivie point par point pendant chaque appui (de profil) ; elle
                                                       ne dérive pas d'une image d'appui à la suivante, et ne bouge, dans l'appui,
                                                       que du chemin d'une image (G.FOULEE) — sinon « GLISSE » ;
                                                    3. les suiveurs courent quand le meneur court, chacun à son pas ;
                                                    4. rien en main : aucune arme, aucun objet tenu dans une image de la course ;
                                                    5. le dessin d'origine (?def=1) garde les pas de la 1.32, à la cadence de la
                                                       marche réglée sur la vitesse.
                                                    « COURSE CONFORME » ; code 1 à la première anomalie.
           node tools/course.js images <dossier>   la planche (course-planche.png : le cycle image par image, de face, de dos,
                                                    de profil, pour Idris, Yûnus, Sâlim, l'enfant et Abû Bakr, à côté de la
                                                    marche, × 3) et les films, pris du vrai jeu une image par 1/30 s puis
                                                    assemblés par ffmpeg : course-telephone.gif (390 × 844, trois secondes),
                                                    course-lent.gif (ralenti × 4), marche-et-course.gif, course-largeur.gif
                                                    (844 × 390). */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium, devices } = require('playwright');
const V2 = path.join(__dirname, '..'), url = 'file://' + path.resolve(V2, process.env.JEU || 'index.html');
const mode = process.argv[2] || '';
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = (t, m) => { anomalies++; console.log(t + ' ' + m); };

/* ---------- dans la page : une rue de Médine, Idris, Yûnus et Sâlim ---------- */
const PREPARER = async () => {
  const I = window.ISNAD, W = I.world, G = I.gfx, S = I.sagas;
  I.save.reset(); I.save.data.started = true; I.debug.sansMeutes = true;
  const ci = S.abubakr.chapters.findIndex(c => c.map === 'medine' && c.opts && c.opts.time === 'day');
  document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen');
  I.input.reset();   // l'écran-titre fermé : ses boutons n'écoutent plus la touche Entrée (elle commencerait une partie neuve)
  I.speed = 30; W.roster = {}; W.startChapter('abubakr', Math.max(0, ci)); setTimeout(() => { I.speed = 1; }, 400);
};
const EQUIPE = () => {
  const I = window.ISNAD, W = I.world, G = I.gfx, S = I.sagas, L = id => Object.assign({ kind: 'compagnon' }, S.idris.heroes[id].look);
  document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen');   // rien par-dessus la rue
  const p0 = W.party[0]; W.party = [p0, p0, p0]; W.pose = {}; W.sheets = ['idris', 'yunus', 'salim'].map(id => G.planche(L(id)));
  // la plus longue rue droite, dans un sens et dans l'autre (où l'on peut courir sans buter), loin des bords de la carte (la vue
  // y suit les coureurs)
  const m = W.map, T = 16, libre = (x, y) => !(W.solidAt(x - 5, y - 5) || W.solidAt(x + 5, y - 5) || W.solidAt(x - 5, y) || W.solidAt(x + 5, y));
  let h = null, v = null;
  for (let ty = 6; ty < m.h - 7; ty++) { let n = 0; for (let tx = 1; tx < m.w - 1; tx++) { const x = tx * T + 8, y = ty * T + 11; if (libre(x, y) && libre(x, y - 6) && libre(x, y + 4)) { n++; if (!h || n > h.n) h = { n, x0: (tx - n + 1) * T + 8, x1: x, y }; } else n = 0; } }
  for (let tx = 8; tx < m.w - 9; tx++) { let n = 0; for (let ty = 1; ty < m.h - 1; ty++) { const x = tx * T + 8, y = ty * T + 11; if (libre(x, y) && libre(x - 6, y) && libre(x + 6, y)) { n++; if (!v || n > v.n) v = { n, y0: (ty - n + 1) * T + 11, y1: y, x }; } else n = 0; } }
  return { h, v, foulee: G.FOULEE, vitesse: W.VITESSE, course: W.COURSE, D: G.D };
};
// où le pied d'appui touche le sol, dans une image de la course : la moyenne des points du pied (F, f) sur la ligne du sol — la
// plus basse que touche un pied dans les huit images ; null : aucun pied n'y touche (les deux pieds sont en l'air, ou l'un va
// se poser)
const SOLS = () => {
  const G = window.ISNAD.gfx, W = window.ISNAD.world, R = {}, bas = g => { let y = g.length - 1; while (y > 0 && !/[Ff]/.test(g[y])) y--; return y; };
  W.sheets.forEach((sh, i) => { const L = sh.look; R[i] = {}; [0, 1, 2, 3].forEach(dir => { const gs = {}; for (let f = 4; f < 12; f++) gs[f] = G.charGrille(L, dir, f).lignes; const sol = Math.max(...Object.values(gs).map(bas));
    R[i][dir] = {}; for (let f = 4; f < 12; f++) { const g = gs[f]; let n = 0, sx = 0; for (let x = 0; x < g[sol].length; x++) if (g[sol][x] === 'F' || g[sol][x] === 'f') { n++; sx += x; }
      R[i][dir][f] = n ? [sx / n, sol] : null; } }); });
  return R; };
// court dans la rue, à la cadence donnée (le jeu figé : chaque image est une mise à jour et un dessin du monde) ; → les traces
const COURIR = ([rue, sens, hz, n, court]) => {
  const I = window.ISNAD, W = I.world, G = I.gfx, p = W.player, dt = 1 / hz, h = I.input.held;
  I.scene = null; I.input.clearHeld(); W.dest = null;
  if (sens === 'h') { p.x = rue.x0; p.y = rue.y; p.dir = 2; } else { p.x = rue.x; p.y = rue.y0; p.dir = 0; }
  W.resetTrail(); W.updateCam(true); p.parcours = 0;
  if (sens === 'h') h.right = true; else h.down = true; I.input.maj = !!court;
  const out = [];
  for (let k = 0; k < n; k++) { W.update(dt); W.trace = []; W.render(dt); const cx = G.cale(W.cam.x), cy = G.cale(W.cam.y);
    W.trace.forEach(e => { const i = W.sheets.indexOf(e.sheet); if (i >= 0) out.push({ k, i, x: e.x + cx, y: e.y + cy, f: e.f, dir: e.dir, court: e.court }); });
    out.push({ k, i: -1, x: p.x, y: p.y, t: W.t, court: !!p.court }); }
  W.trace = null; I.input.clearHeld(); return out;
};

(async () => {
  const browser = await chromium.launch(), errors = [];
  const ouvrir = async (q, vp, mobile) => { const ctx = await browser.newContext(Object.assign({ viewport: vp || { width: 1280, height: 720 } }, mobile ? { deviceScaleFactor: 1, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent } : {}));
    const p = await ctx.newPage(); p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await p.goto(url + (q || '')); await p.waitForFunction(() => window.ISNAD && window.ISNAD.scene && !document.querySelector('#title').hidden, null, { timeout: 20000 }); await p.waitForTimeout(300);
    await p.evaluate(PREPARER);   // l'écran-titre d'abord : il ne viendra plus se poser sur le récit await p.waitForTimeout(1800);
    // la touche Entrée seulement sur un carton ou un dialogue : sur l'écran-titre, elle commencerait une partie neuve
    for (let i = 0; i < 60 && await p.evaluate(() => window.ISNAD.script.busy || window.ISNAD.world.lock); i++) { if (await p.evaluate(() => ['#card', '#dialog'].some(q => { const e = document.querySelector(q); return e && !e.hidden; }))) await p.keyboard.press('Enter'); await p.waitForTimeout(160); }
    await p.waitForTimeout(300); return p; };

  if (mode === 'images') { await images(browser, ouvrir, errors); await browser.close(); return; }

  /* ---------- 1 à 3 : dans le jeu, en dessin fin ---------- */
  let p = await ouvrir(); const E = await p.evaluate(EQUIPE), sols = await p.evaluate(SOLS);
  if (!E.h || E.h.n < 8 || !E.v || E.v.n < 6) ko('ABSENT', `pas de rue assez longue pour courir (${JSON.stringify(E)})`);
  else {
    // 1. la vitesse
    const vit = async court => { const T = await p.evaluate(COURIR, [E.h, 'h', 60, 60, court]), P = T.filter(e => e.i < 0), a = P[10], b = P[P.length - 1]; return (b.x - a.x) / (b.t - a.t); };
    const vm = await vit(false), vc = await vit(true), r = vc / vm;
    if (Math.abs(r - 1.225) > 0.02 || Math.abs(vm - E.vitesse) > 1) ko('ÉCART', `la vitesse : marche ${vm.toFixed(1)}, course ${vc.toFixed(1)} points par seconde (${r.toFixed(3)} fois la marche, au lieu de 1,225)`);
    else ok(`la vitesse : la marche ${vm.toFixed(1)} points par seconde, la course ${vc.toFixed(1)} — ${r.toFixed(3)} fois la marche (la 2.16 courait à ${(E.vitesse * 1.75).toFixed(1)} : 30 % de moins)`);
    // 2. le pied d'appui, à 60 et à 120 images par seconde
    for (const hz of [60, 120]) for (const sens of ['h', 'v']) {
      const T = await p.evaluate(COURIR, [sens === 'h' ? E.h : E.v, sens, hz, Math.round(hz * 2.4), true]), appuis = {}, k0 = Math.round(hz * 0.3);
      T.filter(e => e.i >= 0 && e.court && e.k >= k0).forEach(e => { const s = sols[e.i][e.dir][e.f]; if (!s) return; const img = e.f - 4;
        // le pied, dans le repère de la carte : la planche est posée en (x − 8, y − 22), un point de 32 × 48 y vaut un demi-point
        const fx = e.x - 8 + (s[0] + 0.5) / 2, fy = e.y - 22 + (s[1] + 0.5) / 2, cle = e.i + ':' + (img < 4 ? 'A' : 'B');
        const L = appuis[cle] || (appuis[cle] = []); const der = L[L.length - 1];
        if (!der || e.k - der.k1 > 2) L.push({ k0: e.k, k1: e.k, x: [fx], y: [fy], img: [img] }); else { der.k1 = e.k; der.x.push(fx); der.y.push(fy); der.img.push(img); } });
      const tous = Object.entries(appuis).flatMap(([c, L]) => L.slice(1, -1).map(a => Object.assign(a, { c })));   // le premier et le dernier appui peuvent être coupés
      const ecart = a => sens === 'h' ? Math.max(...a.x) - Math.min(...a.x) : Math.max(...a.y) - Math.min(...a.y);
      const em = tous.length ? Math.max(...tous.map(ecart)) : 99, emoy = tous.length ? tous.reduce((s, a) => s + ecart(a), 0) / tous.length : 99;
      const dm = tous.length ? Math.max(...tous.map(a => { const v = sens === 'h' ? a.x : a.y; const m = q => { const s = v.filter((_, j) => a.img[j] % 4 === q); return s.length ? s.reduce((x, y) => x + y, 0) / s.length : null; }; const u = m(0), w = m(1); return u === null || w === null ? 0 : Math.abs(w - u); })) : 99;
      const qui = [...new Set(tous.map(a => +a.c.split(':')[0]))].length;
      if (process.env.DETAIL) tous.forEach(a => console.log(hz, sens, a.c, a.k0, a.img.join(''), a.x.map(v => v.toFixed(2)).join(' ')));
      const dit = `${hz} images par seconde, ${sens === 'h' ? 'de profil (la rue de gauche à droite)' : 'de face (la rue vers le bas)'} : ${tous.length} appuis de ${qui} coureur(s) suivis point par point — le pied d'appui bouge de ${emoy.toFixed(2)} point(s) en moyenne pendant son appui, ${em.toFixed(2)} au plus ; d'une image d'appui à l'autre, sa place moyenne dérive de ${dm.toFixed(2)} point(s) au plus (une image = ${E.foulee.toFixed(2)} points de chemin)`;
      if (sens === 'h' && (tous.length < 6 || qui < 3 || em > E.foulee + 0.75 || dm > 1.0)) ko('GLISSE', dit);
      else ok(dit + (sens === 'v' ? ' — de face, le pied posé reste au bas de l’image : il ne recule pas avec le sol, comme dans tous les jeux de rôle vus de haut' : ''));
    }
    // 3. les suiveurs courent
    { const T = await p.evaluate(COURIR, [E.h, 'h', 60, 90, true]), F = T.filter(e => e.i > 0 && e.k > 20), courent = F.filter(e => e.f >= 4).length, imgs = [1, 2].map(i => new Set(F.filter(e => e.i === i).map(e => e.f)).size), meme = F.filter(e => e.i === 1).filter(e => { const q = T.find(x => x.i === 0 && x.k === e.k); return q && q.f === e.f; }).length;
      if (!F.length || courent < F.length || imgs.some(n => n < 6)) ko('ÉCART', `les suiveurs ne courent pas avec le meneur (${courent} images de course sur ${F.length} ; ${imgs.join(' et ')} images différentes)`);
      else ok(`les suiveurs courent quand le meneur court : ${F.length} images, toutes de la course (${imgs.join(' et ')} images différentes du cycle), chacun à sa place sur le chemin — Yûnus a la même image qu'Idris ${Math.round(100 * meme / Math.max(1, F.filter(e => e.i === 1).length))} % du temps`); }
    // 4. rien en main
    const M = await p.evaluate(() => { const G = window.ISNAD.gfx, base = { kind: 'homme', robe: '#8a7355', head: '#e6dcc4', cloak: '#5a4632' }, objets = ['sabre', 'lance', 'baton', 'masse', 'dague', 'arc', 'calame', 'durra', 'etendard', 'bouclier', 'pavois', 'feuillets', 'bourse', 'outre', 'tablette'], faux = []; let n = 0;
      objets.forEach(o => [0, 1, 2, 3].forEach(dir => { for (let f = 4; f < 12; f++) { n++; if (G.charGrille(Object.assign({}, base, { item: [o] }), dir, f).lignes.join() !== G.charGrille(base, dir, f).lignes.join()) faux.push(o + ' ' + dir + ' ' + f); } }));
      const rawi = Object.assign({ kind: 'compagnon' }, window.ISNAD.sagas.idris.heroes.idris.look, { item: ['sabre'] }), nu = Object.assign({}, rawi); delete nu.item;
      [0, 1, 2, 3].forEach(dir => { for (let f = 4; f < 12; f++) { n++; if (G.charGrille(rawi, dir, f).lignes.join() !== G.charGrille(nu, dir, f).lignes.join()) faux.push('Idris sabre ' + dir + ' ' + f); } });
      return { faux, n }; });
    if (M.faux.length) ko('ÉCART', `un objet tenu paraît dans la course : ${M.faux.slice(0, 6).join(', ')}`);
    else ok(`rien en main : ${M.n} images de la course, quinze objets tenus et l'arme d'Idris — aucune n'en montre un point`);
  }
  await p.context().close();
  /* ---------- 5. le dessin d'origine ---------- */
  p = await ouvrir('?def=1'); const E1 = await p.evaluate(EQUIPE);
  if (E1.D !== 1) ko('ÉCART', 'le dessin d’origine ne s’ouvre pas (?def=1)');
  else { const T = await p.evaluate(COURIR, [E1.h, 'h', 60, 240, true]), P = T.filter(e => e.i === 0 && e.k > 10), fs1 = [...new Set(P.map(e => e.f))].sort();
    let ch = 0; for (let j = 1; j < P.length; j++) if (P[j].f !== P[j - 1].f) ch++; const cad = ch / ((P.length - 1) / 60), voulu = 8 * E1.course;
    if (fs1.some(f => f > 2) || Math.abs(cad - voulu) > 0.6) ko('ÉCART', `dessin d'origine : images ${fs1.join(',')}, ${cad.toFixed(2)} pas par seconde (attendu : les pas de la 1.32, ${voulu.toFixed(2)})`);
    else ok(`le dessin d'origine garde les pas de la 1.32 (images ${fs1.join(', ')}) : en courant, ${cad.toFixed(2)} pas par seconde — la cadence de la marche (8) réglée sur la vitesse (× ${E1.course})`); }
  await p.context().close(); await browser.close();
  if (errors.length) ko('ÉCART', `erreur console : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 300)}`);
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ COURSE CONFORME'); process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

/* ---------- les images : la planche, les films ---------- */
async function images(browser, ouvrir, errors) {
  const dir = path.resolve(process.argv[3] || path.join(V2, '.smoke/course')); fs.mkdirSync(dir, { recursive: true });
  // la planche : par personnage et par vue, la marche (repos, pas, repos, pas) puis les huit images de la course, × 3
  { const p = await ouvrir(); const url2 = await p.evaluate(() => {
      const I = window.ISNAD, G = I.gfx, S = I.sagas, L = (s, id) => Object.assign({ kind: 'compagnon' }, S[s].heroes[id].look);
      const gens = [['Idris', L('idris', 'idris')], ['Yûnus (robe longue)', L('idris', 'yunus')], ['Sâlim', L('idris', 'salim')], ['l’enfant', { kind: 'enfant', robe: '#3d5a6a', head: '#28343c' }], ['Abû Bakr', L('abubakr', 'abubakr')]];
      const vues = [[2, 'profil'], [1, 'profil gauche'], [0, 'face'], [3, 'dos']], k = 3, cw = 32 * k + 6, ch = 48 * k + 6, x0 = 150, cols = 4 + 8;
      const cv = document.createElement('canvas'); cv.width = x0 + cols * cw + 30; cv.height = 60 + gens.length * vues.length * (ch + 4) + gens.length * 10; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
      c.fillStyle = '#15121e'; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = '#e9c877'; c.font = '600 16px sans-serif'; c.fillText('La marche (4 images), puis la course (8 images : appui, poussée, envol, retombée ; l’autre jambe) — 32 × 48, × 3', 12, 22);
      c.font = '12px sans-serif'; c.fillStyle = '#bfb8d6'; ['marche · repos', 'pas A', 'repos', 'pas B'].concat(['appui', 'poussée', 'envol', 'retombée', 'appui', 'poussée', 'envol', 'retombée']).forEach((t, i) => c.fillText(t, x0 + i * cw + (i >= 4 ? 10 : 0), 44));
      let y = 54; gens.forEach(([nom, look]) => { vues.forEach(([d, v]) => { c.fillStyle = '#e8e2f2'; c.fillText(nom, 10, y + 40); c.fillStyle = '#9d96b4'; c.fillText(v, 10, y + 58);
        [0, 1, 0, 2].concat([4, 5, 6, 7, 8, 9, 10, 11]).forEach((f, i) => { const x = x0 + i * cw + (i >= 4 ? 10 : 0); c.fillStyle = i >= 4 ? '#2b2440' : '#221d30'; c.fillRect(x, y, cw - 4, ch - 2); c.fillStyle = '#4a4160'; c.fillRect(x, y + 46 * k + 3, cw - 4, 1);
          const g = G.charGrand(look, d, f); c.drawImage(g, x + 1, y + 1, 32 * k, 48 * k); }); y += ch + 4; }); y += 10; });
      return cv.toDataURL('image/png'); });
    fs.writeFileSync(path.join(dir, 'course-planche.png'), Buffer.from(url2.split(',')[1], 'base64')); console.log('   ' + path.join(dir, 'course-planche.png')); await p.context().close(); }
  // les films : le vrai jeu, son horloge arrêtée puis avancée de 1/30 s par image (deux battements de 1/60 s) ; au ralenti,
  // le monde reçoit quatre fois moins de temps à chaque battement
  const film = async (nom, vp, plans, ralenti) => {
    const p = await ouvrir('', vp, true), tmp = fs.mkdtempSync(path.join(dir, '.' + nom + '-')); const E = await p.evaluate(EQUIPE); let n = 0;
    await p.clock.install({ time: new Date('2026-11-19T10:00:00Z') }); await p.clock.pauseAt(new Date('2026-11-19T10:00:01Z')); await p.clock.runFor(64);
    await p.evaluate(r => { const W = window.ISNAD.world, u = W.update, d = W.render; W.update = dt => u.call(W, dt / r); W.render = dt => d.call(W, dt / r); }, ralenti || 1);
    for (const pl of plans) {
      await p.evaluate(([rue, pl]) => { const I = window.ISNAD, W = I.world, P = W.player; W.dest = null; I.input.clearHeld();
        P.x = rue.x0 + (pl.depuis || 0); P.y = rue.y; P.dir = 2; W.resetTrail(); W.updateCam(true); P.parcours = 0; I.input.held.right = true; I.input.maj = !!pl.court; }, [E.h, pl]);
      for (let i = 0; i < pl.images; i++) { await p.clock.runFor(32); await p.screenshot({ path: path.join(tmp, String(n++).padStart(4, '0') + '.png') }); } }
    await p.context().close();
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', path.join(tmp, '%04d.png'), '-vf', 'split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[pl];[b][pl]paletteuse=dither=none', '-loop', '0', path.join(dir, nom + '.gif')]);
    fs.readdirSync(tmp).forEach(f => fs.unlinkSync(path.join(tmp, f))); fs.rmdirSync(tmp); console.log('   ' + path.join(dir, nom + '.gif') + ` — ${n} images`);
  };
  await film('course-telephone', { width: 390, height: 844 }, [{ court: true, images: 90 }]);
  await film('course-lent', { width: 390, height: 844 }, [{ court: true, images: 120 }], 4);
  await film('marche-et-course', { width: 390, height: 844 }, [{ court: false, images: 75 }, { court: true, images: 75 }]);
  await film('course-largeur', { width: 844, height: 390 }, [{ court: true, images: 90 }]);
  if (errors.length) console.log('ÉCART erreur console : ' + [...new Set(errors)].slice(0, 3).join(' | ').slice(0, 300));
}
