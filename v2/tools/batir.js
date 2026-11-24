#!/usr/bin/env node
/* ISNAD 2.33 (D225, D226) — les gens du lieu, l'entraide et le bâtir : le contrôle, par les vrais boutons, au doigt.
   1. En hauteur (390 × 844), à Médine visitée : le « ! » au-dessus de celui qui demande ; toucher, sa demande, « Aider » ; le
      chantier tracé en pointillés à côté de lui ; ce qu'il fournit ; la barre de Bâtir qui ne montre que les pièces du chantier,
      avec leur compte ; toucher la pièce en pointillés quand il manque un matériau : ce qui manque, où le trouver, la flèche ;
      récolter en touchant le tas de pierres de la réserve, puis le tas de troncs, puis le puits (puiser, pétrir) ; chaque pièce
      posée en la touchant ; à l'achèvement, ses remerciements et la paie exacte, une seule fois ; puis la demande suivante (un
      autre des gens du lieu) — le puits, l'enclos, la petite mosquée de quartier. Revenu dans la ville : ce qui est bâti y est
      resté, et plus rien n'est demandé.
   2. En largeur (844 × 390), dans chacune des autres villes qui demandent de l'aide : la première demande, acceptée au doigt,
      chaque pièce posée en la touchant, la paie exacte ; La Mecque : personne ne demande, rien ne se récolte, rien ne se bâtit,
      pas de réserve.
   3. Les textes de l'entraide et des gens du lieu : ni pari, ni mise, ni l'Agrégor, ni verset, dans les quatre langues.
   Usage : node v2/tools/batir.js [dossier de captures]    « BÂTIR CONFORME », sinon « ÉCART », « BLOQUÉ », « ABSENT » ; code 1. */
const path = require('path'), fs = require('fs');
const { chromium, devices } = require('playwright');
const out = process.argv[2] || path.join(__dirname, '../.smoke/batir');
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(__dirname, '../index.html');
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); }, si = (c, bien, mal, mot) => c ? ok(bien) : ko((mot || 'ÉCART') + ' ' + (mal || bien));
const PORTE = { ville: 'porte_sud', romaine: 'porte', camp: 'entree' };

async function telephone(browser, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }), p = await ctx.newPage(), errors = [];
  p.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await p.goto(url); await p.waitForTimeout(1600);
  await p.evaluate(() => {
    const I = window.ISNAD, W = I.world, S = I.script, q = s => document.querySelector(s);
    I.audio.setOn(false); I.debug.noOeuvres = true; I.debug.rencontres = { chimeres: 0, brigands: 0, voyageur: 0 };
    const T = window.__t = { toasts: [] };
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) T.toasts.push((n.textContent || '').trim()); }))).observe(q('#toasts'), { childList: true });
    T.visible = s => { const e = q(s); return !!e && !e.hidden; };
    T.calme = () => I.scene === W && !!W.map && !S.busy && !W.lock && !I.battle.active && !I.ui.menuOpen;
    T.attendre = (cond, ms) => new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { let v = false; try { v = cond(); } catch (e) { v = false; } if (v) { clearInterval(iv); res(true); } else if (Date.now() - t0 > (ms || 20000)) { clearInterval(iv); res(false); } }, 60); });
    T.brut = (wx, wy) => { const G = I.gfx, c = q('#cv').getBoundingClientRect(), x = (wx - Math.round(W.cam.x)) / G.PW * c.width + c.left, y = (wy - Math.round(W.cam.y)) / G.PH * c.height + c.top; return [x, y]; };
    T.centre = s => { const e = q(s); if (!e || e.hidden) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    T.bouton = t => { const b = [...document.querySelectorAll('#choice button')].find(x => x.textContent.trim().startsWith(t)); if (!b) return null; b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    // ce point de la carte se voit-il à l'écran ? sinon, Idris s'en approche d'abord (comme un joueur qui marche jusque-là)
    T.voir = (wx, wy) => { const v = I.gfx.view, cx = Math.round(W.cam.x), cy = Math.round(W.cam.y), sx = wx - cx, sy = wy - cy; if (sx > v.x + 24 && sx < v.x + v.w - 24 && sy > v.y + 30 && sy < v.y + v.h - 30) return false;
      const m = W.map; let best = null; for (let dy = 2; dy <= 4; dy++) for (const dx of [0, -1, 1, -2, 2]) { const x = wx + dx * 16, y = wy + dy * 16; if (!W.solidAt(x, y) && !W.solidAt(x - 4, y - 3) && !W.solidAt(x + 4, y - 3)) { best = [x, y]; break; } if (best) break; }
      if (best) T.poser(best[0], best[1], 3); return true; };
    T.poser = (x, y, dir) => { W.player.x = x; W.player.y = y; if (dir !== undefined) W.player.dir = dir; W.dest = null; W.stop(); W.resetTrail(); W.updateCam(true); };
  });
  return { ctx, p, errors };
}

(async () => {
  const browser = await chromium.launch(); let toutesErreurs = [];
  const E = (P, fn, a) => P.evaluate(fn, a);
  const toucher = async (P, xy) => { if (xy) await P.touchscreen.tap(xy[0], xy[1]); await P.waitForTimeout(250); };
  // toucher un point de la carte (après s'en être approché s'il ne se voit pas)
  const toucherCarte = async (P, wx, wy) => { if (await E(P, ([x, y]) => window.__t.voir(x, y), [wx, wy])) await P.waitForTimeout(400); await toucher(P, await E(P, ([x, y]) => window.__t.brut(x, y), [wx, wy])); };
  // la ville visitée, chargée comme le fait la porte (monde.js) : le récit d'Alî, au premier chapitre, à la porte de la ville
  const visiter = async (P, carte) => {
    // (repris d'un point de reprise, comme une partie qu'on continue : l'ouverture du récit ne se rejoue pas)
    await E(P, () => { const I = window.ISNAD, W = I.world, ch = I.sagas.ali.chapters[0]; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
      W.roster = {}; W.saga = null; W.startChapter('ali', 0, { saga: 'ali', ci: 0, obj: 0, map: 'koufa', opts: {}, pos: [470, 600], party: ch.party.slice(), npcs: {}, foes: [], chests: [], flags: {} }); });
    await E(P, () => window.__t.attendre(() => { const I = window.ISNAD; return I.scene === I.world && !!I.world.saga && !I.script.busy && !I.world.lock; }, 15000)); await P.waitForTimeout(400);
    await E(P, ([carte, PORTE]) => { const I = window.ISNAD, W = I.world, g = I.D.MAPS[carte].gabarit; I.input.reset(); I.script.hideDialog(); W.loadMap(carte, { time: 'day' }, PORTE[g]); W.hud(); W.checkpoint(); }, [carte, PORTE]);
    await E(P, () => window.__t.attendre(() => window.__t.calme(), 8000)); await P.waitForTimeout(500);
  };
  const recharger = async (P, carte) => { await E(P, ([carte, PORTE]) => { const I = window.ISNAD, W = I.world, g = I.D.MAPS[carte].gabarit; W.loadMap(carte, { time: 'day' }, PORTE[g]); W.hud(); }, [carte, PORTE]); await P.waitForTimeout(600); };
  // la boîte de dialogue lue jusqu'au bout (un toucher par page), jusqu'au menu s'il en vient un
  const lire = async P => { const lu = []; for (let i = 0; i < 20; i++) { const v = await E(P, () => ({ d: window.__t.visible('#dialog'), c: window.__t.visible('#choice'), t: (document.querySelector('#dialog .text') || {}).textContent || '', n: (document.querySelector('#dialog .name') || {}).textContent || '', f: (() => { const f = document.querySelector('#dialog .fig'); return !!(f && !f.hidden && f.getAttribute('src')); })() }));
    if (v.c || !v.d) break; if (v.t && !lu.some(q => q.t === v.t)) lu.push(v); await toucher(P, await E(P, () => window.__t.centre('#dialog'))); await P.waitForTimeout(350); } return lu; };
  const etat = (P, carte) => E(P, carte => { const I = window.ISNAD, Ent = I.entraide, e = (I.save.data.entraide || {})[carte] || {}, ch = Ent.chantier(carte), n = Ent.demandeur();
    return { demande: Ent.demande(carte), k: e.k | 0, faits: (e.faits || []).slice(), chantier: ch ? { d: ch.d, x: ch.x, y: ch.y, w: ch.w, h: ch.h, n: ch.plan.length } : null, qui: n ? { role: n.role, nom: n.name, x: Math.round(n.x), y: Math.round(n.y) } : null,
      mats: Object.assign({}, I.build.mats()), dirhams: I.trade.dirhams(), bati: (I.build.peek(carte) || []).length, barre: !document.querySelector('#buildbar').hidden, btn: !document.querySelector('#buildbtn').hidden }; }, carte);
  // accepter la demande : toucher celui qui demande, lire, « Aider »
  const accepter = async (P, carte) => {
    const s = await etat(P, carte); if (!s.qui) return { s, lu: [], aide: false };
    for (let k = 0; k < 4; k++) { await toucherCarte(P, s.qui.x, s.qui.y - 12);   // (le premier toucher après l'arrivée peut se perdre : on retouche)
      if (await E(P, () => window.__t.attendre(() => window.__t.visible('#dialog') || window.__t.visible('#choice'), 4000))) break; }
    const lu = await lire(P); await E(P, () => window.__t.attendre(() => window.__t.visible('#choice'), 4000));
    const b = await E(P, () => window.__t.bouton('Aider')); await toucher(P, b);
    await E(P, () => window.__t.attendre(() => window.__t.calme(), 6000)); await P.waitForTimeout(300);
    return { s, lu, aide: !!b };
  };
  // ouvrir Bâtir (le bouton ▦) ; poser chaque pièce en pointillés en la touchant ; au besoin, des matériaux donnés d'avance
  const ouvrirBatir = async P => { if (!(await E(P, () => window.ISNAD.build.on))) await toucher(P, await E(P, () => window.__t.centre('#buildbtn'))); await P.waitForTimeout(300); return E(P, () => window.ISNAD.build.on); };
  const fermerBatir = async P => { if (await E(P, () => window.ISNAD.build.on)) await toucher(P, await E(P, () => window.__t.centre('#buildbtn'))); await P.waitForTimeout(200); };
  const barre = P => E(P, () => [...document.querySelectorAll('#buildbar .pieces .pc')].map(b => b.textContent.replace(/\s+/g, ' ').trim()));
  const poserTout = async (P, carte, max) => { let poses = 0, rates = [];
    for (let i = 0; i < (max || 30); i++) {
      const g = await E(P, carte => { const I = window.ISNAD, ch = I.entraide.chantier(carte); if (!ch) return null; const bati = I.build.peek(carte) || [], q = ch.plan.find(q => !bati.some(b => b.x === q[0] && b.y === q[1])); return q ? { x: q[0], y: q[1], t: q[2] } : null; }, carte);
      if (!g) break; const n0 = (await etat(P, carte)).bati;
      if (!(await E(P, () => window.ISNAD.build.on))) await ouvrirBatir(P);
      await toucherCarte(P, g.x * 16 + 8, g.y * 16 + 9);
      const okp = await E(P, n0 => window.__t.attendre(() => ((window.ISNAD.build.peek(window.ISNAD.world.map.id) || []).length > n0) || !window.ISNAD.entraide.chantier(window.ISNAD.world.map.id), 7000), n0);
      if (okp) poses++; else { rates.push(g); break; }
      await E(P, () => window.__t.attendre(() => !window.ISNAD.script.busy, 6000));
    } return { poses, rates }; };

  /* ---------- 1. En hauteur, à Médine : les trois demandes, par les vrais boutons ---------- */
  {
    const T = await telephone(browser, 390, 844), P = T.p, carte = 'visite_medine';
    await visiter(P, carte);
    const s0 = await etat(P, carte);
    si(s0.demande === 'puits' && s0.qui && s0.qui.role === 'porteur' && !s0.btn, `Médine visitée : un porteur d’eau demande un puits (le « ! » au-dessus de lui) ; le bouton ▦ n’est pas là tant qu’aucun chantier n’est ouvert`, `Médine : ${JSON.stringify(s0)}`, 'ABSENT');
    await P.screenshot({ path: path.join(out, 'medine-demande-390x844.png') });
    // le puits
    const a1 = await accepter(P, carte), s1 = await etat(P, carte);
    si(a1.aide && a1.lu.some(v => /second puits/.test(v.t) && v.f) && s1.chantier && s1.chantier.d === 'puits' && s1.mats.pierre === 2 && s1.btn, `toucher le porteur : sa demande (« ${(a1.lu.find(v => /puits/.test(v.t)) || {}).t || ''} »), sa silhouette ; « Aider » : le chantier est tracé à côté de lui (${s1.chantier && s1.chantier.w}×${s1.chantier && s1.chantier.h}), il fournit 2 pierres ; le bouton ▦ paraît`,
      `le puits accepté : ${JSON.stringify({ a1, s1 })}`, 'BLOQUÉ');
    await ouvrirBatir(P); const b1 = await barre(P); await P.screenshot({ path: path.join(out, 'medine-chantier-puits-390x844.png') });
    si(b1.length === 1 && /Puits/.test(b1[0]) && /0\/1/.test(b1[0]), `la barre de Bâtir ne montre que la pièce du chantier, avec son compte (« ${b1.join(' · ')} »)`, `la barre : ${JSON.stringify(b1)}`);
    const n0 = (await etat(P, carte)).toasts;
    const g1 = await E(P, carte => { const ch = window.ISNAD.entraide.chantier(carte), q = ch && ch.plan[0]; return q ? [q[0] * 16 + 8, q[1] * 16 + 9] : null; }, carte); if (g1) await toucherCarte(P, g1[0], g1[1]); await P.waitForTimeout(900);
    const m1 = await E(P, () => ({ toasts: window.__t.toasts.slice(-4).join(' | '), fleche: !!window.ISNAD.build.fleche }));
    si(/Il te manque/.test(m1.toasts) && /tas de pierres/.test(m1.toasts) && m1.fleche, `il manque deux pierres : on le dit, et où les trouver (« ${m1.toasts.slice(0, 150)} ») ; une flèche montre le tas de pierres`, `ce qui manque : ${JSON.stringify(m1)}`, 'ABSENT');
    await P.screenshot({ path: path.join(out, 'medine-manque-390x844.png') });
    // récolter : toucher le tas de pierres (le mode Bâtir refermé)
    await fermerBatir(P);
    const tas = await E(P, () => { const o = window.ISNAD.world.map.objs.find(o => o.type === 'tas_pierres'); return o ? { x: o.x, y: o.y } : null; });
    if (tas) await toucherCarte(P, tas.x, tas.y - 6);
    await E(P, () => window.__t.attendre(() => window.ISNAD.build.mats().pierre >= 4, 9000));
    const s2 = await etat(P, carte);
    si(tas && s2.mats.pierre >= 4, `récolter : toucher le tas de pierres de la réserve — Idris s’y rend, et en tire deux pierres (${s2.mats.pierre} en tout)`, `la réserve : ${JSON.stringify({ tas, s2 })}`, 'INACCESSIBLE');
    const d0 = s2.dirhams, p1 = await poserTout(P, carte, 3); const lu1 = await lire(P); await E(P, () => window.__t.attendre(() => window.__t.calme(), 5000)); const s3 = await etat(P, carte);
    si(p1.poses === 1 && !s3.chantier && s3.k === 1 && s3.dirhams - d0 === 8 && lu1.some(v => /Prends ceci/.test(v.t)), `le puits posé en touchant la pièce en pointillés : le porteur remercie (« ${(lu1.find(v => /Prends ceci/.test(v.t)) || {}).t || ''} ») et paie l’aide : +${s3.dirhams - d0} dirhams ; la demande suivante attend`,
      `le puits : ${JSON.stringify({ p1, s3, d0, lu1 })}`, 'BLOQUÉ');
    // l'enclos : un autre demande (le berger) ; le bois du tas de troncs
    const a2 = await accepter(P, carte), s4 = await etat(P, carte);
    await fermerBatir(P);
    const tr = await E(P, () => { const o = window.ISNAD.world.map.objs.find(o => o.type === 'troncs'); return o ? { x: o.x, y: o.y } : null; });
    if (tr) await toucherCarte(P, tr.x, tr.y - 6);
    await E(P, () => window.__t.attendre(() => window.ISNAD.build.mats().palme >= 3, 9000));
    const d1 = (await etat(P, carte)).dirhams, p2 = await poserTout(P, carte, 3); await lire(P); await E(P, () => window.__t.attendre(() => window.__t.calme(), 5000)); const s5 = await etat(P, carte);
    si(a2.s.qui && a2.s.qui.role === 'berger' && s4.chantier && s4.chantier.d === 'enclos' && p2.poses === 1 && s5.k === 2 && s5.dirhams - d1 === 6, `l’enclos : le berger demande à son tour ; le bois de palmier, tiré du tas de troncs en le touchant ; posé, +${s5.dirhams - d1} dirhams`, `l’enclos : ${JSON.stringify({ a2, s4, p2, s5 })}`, 'BLOQUÉ');
    // la petite mosquée de quartier : le vieil homme ; le pisé pétri au puits (puiser, puis pétrir) ; quinze pièces
    const a3 = await accepter(P, carte), s6 = await etat(P, carte);
    await E(P, () => { const B = window.ISNAD.build; B.give('palme', 1, true); B.give('pierre', 1, true); });
    await fermerBatir(P);
    const pu = await E(P, () => { const W = window.ISNAD.world, o = W.map.objs.find(o => o.type === 'well'); return o ? { x: o.x, y: o.y } : null; });
    for (const choix of ['Puiser', 'Pétrir']) { if (pu) await toucherCarte(P, pu.x, pu.y - 6); await E(P, () => window.__t.attendre(() => window.__t.visible('#choice'), 8000)); await toucher(P, await E(P, t => window.__t.bouton(t), choix)); await E(P, () => window.__t.attendre(() => window.__t.calme(), 5000)); await P.waitForTimeout(300); }
    const s7 = await etat(P, carte);
    si(a3.s.qui && a3.s.qui.role === 'ancien' && s6.chantier && s6.chantier.d === 'mosquee' && s6.chantier.n === 15 && s7.mats.pise >= 13, `la petite mosquée de quartier : le vieil homme demande ; quinze pièces en pointillés ; le pisé pétri au puits, en le touchant (puiser, puis pétrir : ${s7.mats.pise} briques)`, `la mosquée, avant : ${JSON.stringify({ a3, s6, s7 })}`, 'BLOQUÉ');
    await E(P, carte => { const W = window.ISNAD.world, ch = window.ISNAD.entraide.chantier(carte); if (ch) window.__t.poser(ch.x * 16 + 40, (ch.y + ch.h + 1) * 16 + 13, 3); }, carte); await P.waitForTimeout(500);
    await ouvrirBatir(P); await P.waitForTimeout(400); await P.screenshot({ path: path.join(out, 'medine-chantier-mosquee-390x844.png') });
    const d2 = s7.dirhams, p3 = await poserTout(P, carte, 20); await P.screenshot({ path: path.join(out, 'medine-mosquee-batie-390x844.png') }); await lire(P); await E(P, () => window.__t.attendre(() => window.__t.calme(), 5000)); const s8 = await etat(P, carte);
    si(p3.poses === 15 && s8.k === 3 && s8.dirhams - d2 === 12 && !s8.demande && !s8.qui, `les quinze pièces posées en les touchant ; +${s8.dirhams - d2} dirhams ; plus personne ne demande à Médine`, `la mosquée : ${JSON.stringify({ p3, s8 })}`, 'BLOQUÉ');
    await recharger(P, carte); const s9 = await etat(P, carte);
    const nuit = await E(P, () => { const W = window.ISNAD.world; return { priere: W.prayerPts().length, mats: W.map.objs.filter(o => o.type === 'mat').length }; });
    si(s9.bati === 17 && s9.k === 3 && !s9.qui && s9.dirhams === s8.dirhams, `revenu dans Médine : ce qui est bâti y est resté (${s9.bati} pièces), plus rien n’est demandé, la paie n’est pas versée deux fois`, `le retour : ${JSON.stringify({ s9, s8 })}`, 'ABSENT');
    si(nuit.priere === 1, `la petite mosquée de quartier n’ajoute pas de lieu de prière au jeu (${nuit.priere} lieu, celui de la ville)`, `les lieux de prière : ${JSON.stringify(nuit)}`);
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => '390×844 · ' + e)); await T.ctx.close();
  }

  /* ---------- 2. En largeur : chaque autre ville, sa première demande ; La Mecque ---------- */
  {
    const T = await telephone(browser, 844, 390), P = T.p;
    const villes = await E(P, () => Object.keys(window.ISNAD.D.ENTRAIDE.villes).filter(v => v !== 'visite_medine'));
    const bons = [], mals = [];
    for (const carte of villes) {
      await visiter(P, carte);
      const a = await accepter(P, carte), s = await etat(P, carte);
      if (s.chantier) await E(P, carte => { const I = window.ISNAD, ch = I.entraide.chantier(carte), c = {}; ch.plan.forEach(q => { const k = I.D.PIECES[q[2]].cost; Object.keys(k).forEach(m => { c[m] = (c[m] || 0) + k[m]; }); }); const M = I.build.mats(); Object.keys(c).forEach(m => { if ((M[m] || 0) < c[m]) I.build.give(m, c[m] - (M[m] || 0), true); }); }, carte);
      if (carte === 'visite_fustat' && s.chantier) { await E(P, carte => { const ch = window.ISNAD.entraide.chantier(carte); window.__t.poser(ch.x * 16 + 40, (ch.y + ch.h + 1) * 16 + 13, 3); }, carte); await ouvrirBatir(P); await P.waitForTimeout(500); await P.screenshot({ path: path.join(out, 'fustat-plan-oasis-844x390.png') }); }
      const d0 = (await etat(P, carte)).dirhams, p = await poserTout(P, carte, 20); await lire(P); await E(P, () => window.__t.attendre(() => window.__t.calme(), 5000)); const s2 = await etat(P, carte);
      const paie = a.s.demande ? await E(P, d => window.ISNAD.D.ENTRAIDE.demandes[d].paie, a.s.demande) : 0;
      if (['visite_damas', 'visite_hira', 'visite_fustat'].includes(carte)) await P.screenshot({ path: path.join(out, `${carte}-844x390.png`) });
      const bon = a.aide && s.chantier && p.poses === s.chantier.n && s2.k === 1 && s2.dirhams - d0 === paie;
      (bon ? bons : mals).push(carte.replace('visite_', '') + (bon ? ` (${a.s.demande}, ${a.s.qui && a.s.qui.nom}, +${paie})` : ' ' + JSON.stringify({ a: { aide: a.aide, s: a.s }, s, p, s2, d0, paie })));
    }
    si(!mals.length, `en largeur, chaque autre ville : la première demande acceptée au doigt, ses pièces posées en les touchant, la paie exacte — ${bons.join(' · ')}`, `les villes : ${mals.join(' · ')}`, 'BLOQUÉ');
    await visiter(P, 'visite_mecque');
    const mq = await E(P, () => { const I = window.ISNAD, W = I.world, B = I.build; return { qui: !!I.entraide.demandeur(), dehors: B.outdoor('visite_mecque'), btn: !document.querySelector('#buildbtn').hidden, reserve: W.map.objs.filter(o => o.reserve).length, recolte: W.map.objs.some(o => B.recoltable(o.x, o.y - 4)), gens: W.npcs.filter(n => n.gens).length, betes: I.gens.duLieu().length }; });
    si(!mq.qui && !mq.dehors && !mq.btn && !mq.reserve && !mq.recolte && mq.gens >= 5 && mq.betes >= 3, `La Mecque : ${mq.gens} gens du lieu et ${mq.betes} bêtes, mais personne ne demande, rien ne se récolte ni ne se bâtit, pas de réserve`, `La Mecque : ${JSON.stringify(mq)}`);
    await P.screenshot({ path: path.join(out, 'mecque-844x390.png') });
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => '844×390 · ' + e)); await T.ctx.close();
  }

  /* ---------- 3. Les textes, dans les quatre langues ---------- */
  {
    const T = await telephone(browser, 844, 390), P = T.p, interdits = [];
    for (const lang of ['fr', 'ar', 'en', 'ja']) {
      const L = await E(P, lang => { const I = window.ISNAD; if (I.langue.choisir) I.langue.choisir(lang); else I.langue.lang = lang; const out = []; Object.values(I.entraide.TX).forEach(x => ['nom', 'dit', 'merci'].forEach(k => out.push(I.t(x[k])))); Object.values(I.gens.ROLES).forEach(x => ['nom', 'dit'].forEach(k => out.push(I.t(x[k])))); return out; }, lang);
      L.forEach(t => { if (/Agr[ée]gor|\bpari|\bmise\b|parier|verset|Coran|bet\b|gambl|wager|賭|رهان|قمار|آية/i.test(t)) interdits.push(lang + ' : ' + t.slice(0, 60)); });
    }
    si(!interdits.length, `les textes de l’entraide et des gens du lieu, dans les quatre langues : ni pari, ni mise, ni l’Agrégor, ni verset`, `les textes : ${interdits.join(' · ')}`);
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => 'textes · ' + e)); await T.ctx.close();
  }

  if (toutesErreurs.length) { anomalies++; console.log('--- ERREURS ---'); [...new Set(toutesErreurs)].slice(0, 12).forEach(e => console.log(e)); }
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ BÂTIR CONFORME — les gens demandent, le chantier se trace en pointillés, chaque pièce se pose en la touchant, ce qui manque se dit et se trouve, l’aide est payée (captures dans ${out})`);
  await browser.close();
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
