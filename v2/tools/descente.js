#!/usr/bin/env node
/* ISNAD 2.x — les labyrinthes de la noosphère, éprouvés dans le jeu assemblé (le tirage seul : tools/dedales.js).
   node v2/tools/descente.js
     A. La noosphère d'un chapitre : le récit dit « on descend », et l'on trouve un labyrinthe — ses sept lieux, tous
        reliés au seuil, à trois profondeurs ; le chrono est armé et se voit ; forcé à zéro, on remonte au seuil dans un
        autre labyrinthe, un cran plus simple ; une partie reprise au milieu retrouve le même labyrinthe ; sans graine,
        le lieu d'avant ; on y marche au clavier et au doigt.
     B. La descente du râwî : l'entrée, ceux qui rôdent, la cible ; l'issue (un niveau) ; l'abri (Esprit et Souffle),
        où rien n'entre ; le temps écoulé ; rattrapé (épuisé : la porte reste close, un sommeil sans songe la rouvre) ;
        lame forgée et accompagné, on fait face à une idée noire puis à un mal du cœur.
     C. Frapper ce qui rôde : dans le labyrinthe d'un chapitre, de petits égrégores vont et viennent sur les ponts, jamais
        dans les lieux nommés ; « Entrée » ou un toucher les frappe (un voile de moins, sonnés, ils laissent passer), sans
        voile ils se dissipent et ne reviennent pas ; s'ils rejoignent le groupe, c'est un combat ; après une remontée, plus
        rien ne rôde. Dans la descente du râwî : un coup sonne et ne vainc pas ; lame forgée et accompagné, les coups
        entament une idée noire jusqu'à la dissiper.
   « DESCENTE CONFORME », sinon « ÉCART ». Captures dans .smoke/descente. */
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/descente'), url = 'file://' + path.join(V2, 'index.html');
fs.mkdirSync(out, { recursive: true });
let ecarts = 0; const ok = m => console.log('OK  ' + m), ko = m => { ecarts++; console.log('ÉCART ' + m); }, si = (c, bien, mal) => c ? ok(bien) : ko(mal || bien);

(async () => {
  const b = await chromium.launch(), errors = [];
  const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await p.goto(url); await p.waitForTimeout(1500);
  // la touche Entrée n'est donnée que si un carton ou un dialogue est affiché : sinon elle irait à l'écran-titre, que l'on contourne ici
  const entree = async () => { if (await p.evaluate(() => ['#card', '#dialog'].some(q => { const e = document.querySelector(q); return e && !e.hidden; }))) await p.keyboard.press('Enter'); };
  const calme = async (n = 60) => { for (let i = 0; i < n && await p.evaluate(() => window.ISNAD.script.busy || window.ISNAD.world.lock); i++) { await entree(); await p.waitForTimeout(160); } await p.waitForTimeout(250); };
  await p.evaluate(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; I.debug.sansMeutes = true; /* A et B éprouvent le labyrinthe et la descente ; ce qui rôde dans un récit, c'est C */ I.debug.graine = 20261116; /* des graines fixes : chaque passage voit les mêmes labyrinthes ; leur variété, c'est dedales.js qui l'éprouve */ document.querySelectorAll('.screen').forEach(e => e.hidden = true); document.body.classList.remove('in-screen'); I.input.reset(); // l'écran-titre est contourné : son écouteur aussi, pour que les touches aillent au monde comme en jeu
    I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter('abubakr', 0); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); });
  await p.waitForTimeout(1800); await calme();
  const empreinte = () => p.evaluate(() => { const m = window.ISNAD.world.map; let h = 2166136261; for (let i = 0; i < m.solid.length; i++) { h ^= m.solid[i]; h = Math.imul(h, 16777619); } return (h >>> 0) + ' ' + JSON.stringify(m.spots); });

  /* ---------- A. la noosphère d'un chapitre ---------- */
  for (const n of [0, 3, 5]) {
    const d = await p.evaluate(async n => { const I = window.ISNAD, W = I.world; I.debug.profondeur = n; await I.script.run([['map', 'noos', 'seuil', { hue: 210 }]]);
      const m = W.map, e = m.env.dedale, sp = Object.keys(m.spots), s0 = W.spotPx('seuil');
      return { g: W.mapOpts.g, n: W.mapOpts.n, dedale: !!e, lieux: sp.sort().join(','), relies: sp.every(k => { const q = W.spotPx(k); return W.reach(s0[0], s0[1], q[0], q[1]); }), chrono: I.rodeurs.chrono ? Math.round(I.rodeurs.chrono.total) : 0, auSeuil: Math.hypot(W.player.x - s0[0], W.player.y - s0[1]) < 40 }; }, n);
    await p.waitForTimeout(500); d.vu = await p.evaluate(() => { const el = document.getElementById('chrono'); return !!el && !el.hidden && /^\d+:\d\d$/.test(el.querySelector('.t').textContent); }); await p.screenshot({ path: path.join(out, `A-profondeur-${n}.png`) });
    si(d.dedale && d.n === n && d.g !== undefined && d.lieux === 'coeur,faille,miroir,noeud1,noeud2,noeud3,seuil' && d.relies && d.auSeuil && d.chrono > 60 && d.vu,
      `profondeur ${n} : un labyrinthe, ses sept lieux reliés au seuil, un chrono de ${d.chrono} s armé et affiché`, `profondeur ${n} : ${JSON.stringify(d)}`);
  }
  { // le chrono forcé à zéro
    const avant = await p.evaluate(() => Object.assign({}, window.ISNAD.world.mapOpts)), e0 = await empreinte();
    await p.evaluate(() => { window.ISNAD.debug.compte = 0.4; }); await p.waitForTimeout(2600); await calme();
    const r = await p.evaluate(() => { const I = window.ISNAD, W = I.world, s = W.spotPx('seuil'); return { g: W.mapOpts.g, n: W.mapOpts.n, auSeuil: Math.hypot(W.player.x - s[0], W.player.y - s[1]) < 40, chrono: I.rodeurs.chrono ? Math.round(I.rodeurs.chrono.reste) : 0, verrou: !!W.lock, remontees: I.rodeurs.remontees | 0 }; }), e1 = await empreinte();
    si(r.g !== avant.g && r.n === avant.n - 1 && r.auSeuil && r.chrono > 60 && !r.verrou && r.remontees === 1 && e1 !== e0, `chrono écoulé : on remonte au seuil, dans un autre labyrinthe, un cran plus simple (${avant.n} → ${r.n}), chrono réarmé`, `chrono écoulé : ${JSON.stringify(avant)} → ${JSON.stringify(r)}`);
    await p.screenshot({ path: path.join(out, 'A-remontee.png') });
  }
  { // au clavier, au doigt
    const x0 = await p.evaluate(() => window.ISNAD.world.player.x); await p.keyboard.down('ArrowRight'); await p.waitForTimeout(500); await p.keyboard.up('ArrowRight');
    const x1 = await p.evaluate(() => window.ISNAD.world.player.x); si(x1 > x0 + 10, `au clavier : on marche dans le labyrinthe (${Math.round(x1 - x0)} points en une demi-seconde)`, `au clavier : resté sur place (${x0} → ${x1})`);
    const but = await p.evaluate(() => { const W = window.ISNAD.world, G = window.ISNAD.gfx, s = W.spotPx('seuil'), r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left + (s[0] - 24 - G.cale(W.cam.x)) / G.PW * r.width, y: r.top + (s[1] + 8 - G.cale(W.cam.y)) / G.PH * r.height, px: s[0] - 24 }; });
    await p.mouse.click(but.x, but.y); await p.waitForTimeout(900);
    const x2 = await p.evaluate(() => window.ISNAD.world.player.x); si(Math.abs(x2 - but.px) < 14, 'au doigt : toucher un endroit du labyrinthe y conduit', `au doigt : visé ${Math.round(but.px)}, arrivé à ${Math.round(x2)}`);
  }
  { // 2.16 — courir au clavier : Maj tenue, on va plus d'une fois et demie plus vite qu'à la marche ; le chrono, lui, ne court
    // pas plus vite (il compte le temps, pas le chemin) ; Maj lâchée, on marche de nouveau. Mesuré dans le plus long couloir droit.
    const couloir = await p.evaluate(() => { const W = window.ISNAD.world, m = W.map, T = 16, ok = (x, y) => !(W.solidAt(x - 4, y - 5) || W.solidAt(x + 4, y - 5) || W.solidAt(x - 4, y) || W.solidAt(x + 4, y)); let best = null;
      for (let ty = 1; ty < m.h - 1; ty++) { let run = 0; for (let tx = 1; tx < m.w - 1; tx++) { const x = tx * T + 8, y = ty * T + 11; if (ok(x, y) && ok(x - 8, y) && ok(x + 8, y)) { run++; if (!best || run > best.n) best = { n: run, x: (tx - run + 1) * T + 8, y }; } else run = 0; } }
      return best; });
    const mesure = async maj => { await p.evaluate(c => { const W = window.ISNAD.world; W.player.x = c.x; W.player.y = c.y; W.player.dir = 2; W.dest = null; W.resetTrail(); W.updateCam(true); }, couloir);
      if (maj) await p.keyboard.down('Shift'); await p.keyboard.down('ArrowRight'); await p.waitForTimeout(80);
      const lire = () => p.evaluate(() => { const I = window.ISNAD, W = I.world; return [W.player.x, W.t, I.rodeurs.chrono ? I.rodeurs.chrono.reste : 0, !!W.player.court]; }), a = await lire(); await p.waitForTimeout(260); const b = await lire();
      await p.keyboard.up('ArrowRight'); if (maj) await p.keyboard.up('Shift'); await p.waitForTimeout(150);
      return { v: +((b[0] - a[0]) / Math.max(0.01, b[1] - a[1])).toFixed(1), chrono: +((a[2] - b[2]) / Math.max(0.01, b[1] - a[1])).toFixed(3), court: b[3] }; };
    const m0 = await mesure(false), m1 = await mesure(true), m2 = await mesure(false);
    si(couloir && couloir.n >= 5 && m1.court && !m0.court && !m2.court && m1.v > 1.5 * m0.v && Math.abs(m2.v - m0.v) < 8 && Math.abs(m0.chrono - 1) < 0.05 && Math.abs(m1.chrono - 1) < 0.05,
      `au clavier, Maj tenue : on court (${m1.v} points par seconde, ${(m1.v / m0.v).toFixed(2)} fois la marche), Maj lâchée on marche ; le chrono court au même pas (${m0.chrono} puis ${m1.chrono} seconde par seconde)`, `Maj : ${JSON.stringify({ couloir, m0, m1, m2 })}`);
  }
  { // la reprise au milieu d'un labyrinthe
    const e0 = await empreinte(), o0 = await p.evaluate(() => { const W = window.ISNAD.world; W.checkpoint(); return JSON.stringify(window.ISNAD.save.data.cp.opts); });
    await p.evaluate(async () => { const I = window.ISNAD, W = I.world, cp = JSON.parse(JSON.stringify(I.save.data.cp)); W.loadMap('medine', {}, null); await W.startChapter(cp.saga, cp.ci, cp); }); await calme();
    const e1 = await empreinte(), o1 = await p.evaluate(() => JSON.stringify(window.ISNAD.world.mapOpts));
    si(e0 === e1 && o0 === o1, 'reprise : la partie gardée au milieu d’un labyrinthe retrouve le même', `reprise : le labyrinthe a changé (${o0} → ${o1})`);
    const s = await p.evaluate(() => { const I = window.ISNAD, W = I.world; W.loadMap('noos', { hue: 210 }, 'seuil'); return { dedale: !!W.map.env.dedale, chrono: !!I.rodeurs.chrono, lieux: Object.keys(W.map.spots).length }; });
    si(!s.dedale && !s.chrono && s.lieux === 7, 'sans graine : le lieu d’avant, sans chrono (une partie gardée avant la 2.x le retrouve tel quel)', `sans graine : ${JSON.stringify(s)}`);
    await p.evaluate(async () => { const I = window.ISNAD, W = I.world, cp = JSON.parse(JSON.stringify(I.save.data.cp)); cp.map = 'medine'; cp.opts = { time: 'day' }; cp.pos = [488, 701]; I.save.data.cp = cp; await W.startChapter(cp.saga, cp.ci, cp); }); await calme();
  }

  /* ---------- B. la descente du râwî ---------- */
  await p.evaluate(() => { window.ISNAD.debug.profondeur = 2; });
  const etat = () => p.evaluate(() => { const I = window.ISNAD, W = I.world, d = I.save.data.dedale || {}; return { saga: W.saga && W.saga.id, carte: W.map && W.map.id, excursion: !!W.excursion, clos: !!d.clos, abris: d.abris | 0, rawi: (I.save.data.heroes['idris:idris'] || { lvl: 0 }).lvl, derniere: I.rodeurs.derniere, cp: (I.save.data.cp || {}).saga }; });
  const descendre = async k => { await p.evaluate(q => { delete window.ISNAD.script.flags['_o_porte_' + q]; window.ISNAD.rodeurs.demande(q); }, k); await p.waitForTimeout(500);
    for (let i = 0; i < 40 && !(await p.evaluate(() => !!window.ISNAD.world.excursion && !window.ISNAD.script.busy && !window.ISNAD.world.lock)); i++) { await entree(); await p.waitForTimeout(250); } await p.waitForTimeout(350); };
  const remonter = async () => { for (let i = 0; i < 60 && await p.evaluate(() => !!window.ISNAD.world.excursion || window.ISNAD.script.busy || window.ISNAD.world.lock); i++) { await entree(); await p.waitForTimeout(250); } await p.waitForTimeout(350); };
  const aller = lieu => p.evaluate(l => { const W = window.ISNAD.world, s = W.spotPx(l); W.player.x = s[0]; W.player.y = s[1]; W.dest = null; }, lieu);
  const e0 = await etat();
  // l'entrée, puis l'issue
  await descendre('sommeil');
  const d1 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, m = W.map, s0 = W.spotPx('seuil'); return { carte: m.id, descente: !!(m.env.dedale && m.env.dedale.descente), lieux: Object.keys(m.spots).sort().join(','), relies: Object.keys(m.spots).every(k => { const q = W.spotPx(k); return W.reach(s0[0], s0[1], q[0], q[1]); }),
    rodeurs: W.foes.filter(f => f.rodeur && f.placed).length, loin: W.foes.filter(f => f.rodeur && f.placed).every(f => Math.hypot(f.x - s0[0], f.y - s0[1]) > 120), chrono: I.rodeurs.chrono ? Math.round(I.rodeurs.chrono.reste) : 0, groupe: W.party.join(','), cible: !!W.target(), repriseGardee: (I.save.data.cp || {}).saga }; });
  await p.waitForTimeout(700); await p.screenshot({ path: path.join(out, 'B-1-descente.png') });
  si(d1.descente && d1.lieux === 'abri,issue,refuge,seuil' && d1.relies && d1.rodeurs === 3 && d1.loin && d1.chrono > 40 && d1.groupe === 'idris' && d1.cible && d1.repriseGardee === 'abubakr',
    `la descente : un labyrinthe (seuil, issue, deux abris), ${d1.rodeurs} rôdeurs posés loin du seuil, un chrono de ${d1.chrono} s, l'issue montrée ; le point de reprise reste celui du récit`, `la descente : ${JSON.stringify(d1)}`);
  { const x0 = await p.evaluate(() => window.ISNAD.world.player.x); await p.keyboard.down('ArrowRight'); await p.waitForTimeout(450); await p.keyboard.up('ArrowRight'); const x1 = await p.evaluate(() => window.ISNAD.world.player.x); si(x1 > x0 + 8, 'la descente : on y marche au clavier', `la descente : resté sur place (${x0} → ${x1})`); }
  { // ceux qui rôdent prennent en chasse, et n'entrent pas dans un abri
    const c = await p.evaluate(() => new Promise(res => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.rodeur && q.placed), T = 16, m = W.map;
      // on se place à six cases de marche du premier rôdeur (et non à vol d'oiseau : le dédale peut imposer un long détour)
      const d = new Int16Array(m.w * m.h).fill(-1), q = [Math.floor(f.y / T) * m.w + Math.floor(f.x / T)]; d[q[0]] = 0; let ou = q[0];
      for (let k = 0; k < q.length; k++) { const i = q[k], x = i % m.w, y = (i - x) / m.w; if (d[i] === 6) { ou = i; break; } [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(o => { const X = x + o[0], Y = y + o[1], j = Y * m.w + X; if (X < 0 || Y < 0 || X >= m.w || Y >= m.h || d[j] >= 0 || m.solid[j] || m.g0(X * T + 8, Y * T + 8) !== 'npont') return; d[j] = d[i] + 1; q.push(j); }); }
      W.player.x = (ou % m.w) * T + 8; W.player.y = Math.floor(ou / m.w) * T + 11; W.dest = null; const d0 = Math.hypot(f.x - W.player.x, f.y - W.player.y);
      setTimeout(() => res({ d0: Math.round(d0), d1: Math.round(Math.hypot(f.x - W.player.x, f.y - W.player.y)), fini: !W.excursion || !!W.excursion.fin }), 2600); }));
    si(c.fini || c.d1 < 40, `un rôdeur à six cases de marche prend en chasse${c.fini ? ', et rattrape en moins de 2,6 s' : ` (de ${c.d0} à ${c.d1} points en 2,6 s)`}`, `le rôdeur n'a pas pris en chasse : ${JSON.stringify(c)}`);
    if (c.fini) { await remonter(); await p.evaluate(() => window.ISNAD.rodeurs.repos()); await descendre('sommeil'); }
  }
  await aller('abri'); await p.waitForTimeout(400);
  { const a = await p.evaluate(() => new Promise(res => { const I = window.ISNAD, W = I.world, m = W.map; let dedans = 0, n = 0; const t = setInterval(() => { W.foes.forEach(f => { if (f.rodeur && f.placed && m.g0(f.x, f.y) === 'nabri') dedans++; }); if (++n >= 25) { clearInterval(t); res({ dedans, abri: !!(W.excursion && W.excursion.abri), fin: !W.excursion || !!W.excursion.fin }); } }, 100); }));
    si(a.abri && !a.dedans && !a.fin, 'un abri : le râwî y est à l’abri, et rien de ce qui rôde n’y entre (2,5 s d’observation)', `l'abri : ${JSON.stringify(a)}`); await p.screenshot({ path: path.join(out, 'B-2-abri.png') }); }
  await aller('issue'); await p.waitForTimeout(500); await p.screenshot({ path: path.join(out, 'B-3-issue.png') }); await remonter();
  const e1 = await etat();
  si(!e1.excursion && e1.saga === 'abubakr' && e1.carte === 'medine' && e1.derniere === 'issue' && e1.rawi >= 2 && !e1.clos, `l'issue : le râwî gagne un niveau (niveau ${e1.rawi}) et l'on revient au récit, là où on l'avait laissé`, `l'issue : ${JSON.stringify(e0)} → ${JSON.stringify(e1)}`);
  // l'abri, jusqu'au bout du chrono (Entrée laisse passer le temps)
  await descendre('dhikr'); await aller('refuge'); await p.waitForTimeout(500); await p.keyboard.press('Enter'); await p.waitForTimeout(500); await p.screenshot({ path: path.join(out, 'B-4-tenu.png') }); await remonter();
  const e2 = await etat(), st = await p.evaluate(() => { const I = window.ISNAD, h = I.valeurs.rawi(), a = I.calc.of(h), b = I.calc.hero(h.def, h.lvl); return { esprit: +(a.mag - b.mag).toFixed(2), souffle: a.sp - b.sp }; });
  si(e2.derniere === 'abri' && e2.abris === 1 && st.esprit === 1 && st.souffle === 2 && e2.saga === 'abubakr' && !e2.clos, 'l’abri : on y attend la fin du chrono — Esprit +1, Souffle +2, pour de bon', `l'abri : ${JSON.stringify(e2)} ${JSON.stringify(st)}`);
  // le temps écoulé hors d'un abri
  await descendre('priere'); await p.evaluate(() => { window.ISNAD.debug.compte = 0.3; }); await p.waitForTimeout(900); await remonter();
  const e3 = await etat(); si(e3.derniere === 'temps' && !e3.clos && e3.abris === 1 && e3.rawi === e2.rawi && e3.saga === 'abubakr', 'le temps écoulé hors d’un abri : on remonte, rien n’est perdu', `le temps écoulé : ${JSON.stringify(e3)}`);
  // rattrapé : sans lame ni compagnon, on remonte épuisé
  await descendre('sommeil'); await p.evaluate(() => { const W = window.ISNAD.world, f = W.foes.find(q => q.rodeur && q.placed); W.player.x = f.x + 4; W.player.y = f.y; }); await p.waitForTimeout(500); await p.screenshot({ path: path.join(out, 'B-5-rattrape.png') }); await remonter();
  const e4 = await etat(); si(e4.derniere === 'rattrape' && e4.clos && e4.saga === 'abubakr', 'rattrapé, sans lame ni compagnon : on remonte épuisé', `rattrapé : ${JSON.stringify(e4)}`);
  const f1 = await p.evaluate(async () => { const I = window.ISNAD; delete I.script.flags._o_porte_dhikr; const a = await I.valeurs.porte('dhikr'); return { rendu: a, attente: I.rodeurs.attente || null }; });
  const f2 = await p.evaluate(async () => { const I = window.ISNAD; delete I.script.flags._o_porte_sommeil; const a = await I.valeurs.porte('sommeil'); return { rendu: a, clos: I.rodeurs.clos(), attente: I.rodeurs.attente || null }; });
  si(f1.rendu === null && !f1.attente && f2.rendu === null && !f2.clos && !f2.attente, 'épuisé : la porte reste close ; un sommeil sans songe la rouvre', `épuisé : ${JSON.stringify(f1)} ${JSON.stringify(f2)}`);
  // lame forgée et accompagné : on fait face — une idée noire, puis un mal du cœur
  await p.evaluate(() => { const I = window.ISNAD, d = I.save.data, v = Object.keys(I.D.VICES)[0], a = I.D.ANIMAUX[0]; d.lames = d.lames || {}; d.lames[v] = true; d.animaux = d.animaux || {}; d.animaux[a] = true; d.animal = a; window.__v = v; });
  await descendre('sommeil');
  const face = async quoi => { const r = await p.evaluate(q => { const I = window.ISNAD, W = I.world, f = W.foes.find(x => x.rodeur && x.placed && !x.done && (q === 'noir' ? I.D.NOIRS.includes(x.group[0]) : x.group[0] === window.__v)); if (!f) return { absent: true };
      const peut = I.rodeurs.peutFaireFace(f.group[0]); W.player.x = f.x + 4; W.player.y = f.y; return { id: f.group[0], peut }; }, quoi);
    if (r.absent) return r; for (let i = 0; i < 40 && !(await p.evaluate(() => window.ISNAD.battle.active)); i++) await p.waitForTimeout(150);
    await p.evaluate(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 30; }); await p.waitForTimeout(600);
    for (let i = 0; i < 240 && await p.evaluate(() => window.ISNAD.battle.active || window.ISNAD.script.busy); i++) { await p.waitForTimeout(250); }
    await p.evaluate(() => { window.ISNAD.debug.auto = false; window.ISNAD.speed = 1; }); await p.waitForTimeout(300);
    return Object.assign(r, await p.evaluate(id => { const I = window.ISNAD, W = I.world, E = W.excursion; return { encore: !!E && !E.fin, vaincu: !!E && W.foes.some(f => f.group[0] === id && f.done), noirNote: !!(E && E.flags['_noir_' + id]), tranche: I.valeurs.acquise(id) }; }, r.id)); };
  const n1 = await face('noir');
  si(!n1.absent && n1.peut && n1.encore && n1.vaincu && n1.noirNote, `accompagné, une lame forgée : face à une idée noire (${n1.id}) — vaincue, elle est dissipée pour ce chapitre, et la descente continue`, `face à une idée noire : ${JSON.stringify(n1)}`);
  const m1 = await face('mal');
  si(!m1.absent && m1.peut && m1.encore && m1.vaincu && m1.tranche, `face à un mal du cœur dont la lame est forgée (${m1.id}) : vaincu, il est tranché`, `face à un mal du cœur : ${JSON.stringify(m1)}`);
  await p.screenshot({ path: path.join(out, 'B-6-face.png') }); await aller('issue'); await p.waitForTimeout(500); await remonter();
  const e5 = await etat(), fl = await p.evaluate(id => !!window.ISNAD.script.flags['_noir_' + id], n1.id || '');
  si(e5.saga === 'abubakr' && e5.derniere === 'issue' && fl, 'de retour au récit : l’idée noire dissipée le reste jusqu’au chapitre suivant', `de retour : ${JSON.stringify(e5)} drapeau ${fl}`);
  // … et pas au-delà : au chapitre suivant, elle rôde de nouveau (le drapeau restait autrefois pour tout le récit)
  const fl2 = await p.evaluate(id => { const S = window.ISNAD.script, avant = Object.assign({}, S.flags); window.ISNAD.oeuvres.newChapter(); const reste = !!S.flags['_noir_' + id]; Object.assign(S.flags, avant); return reste; }, n1.id || '');
  si(fl && !fl2, 'au chapitre suivant, l’idée noire dissipée rôde de nouveau', `au chapitre suivant, l’idée noire ${n1.id} resterait dissipée`);

  /* ---------- C. frapper ce qui rôde ---------- */
  await p.evaluate(() => { const I = window.ISNAD; I.debug.sansMeutes = false; I.debug.profondeur = 3; });
  const pres = (id, cases, gele) => p.evaluate(([id, cases, gele]) => { const I = window.ISNAD, W = I.world, R = I.rodeurs, f = W.foes.find(q => q.id === id), T = 16, m = W.map; if (!f) return null;
    // près du rôdeur, à « cases » cases de lui en ligne droite, tourné vers lui
    let ou = null; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(q => { if (ou) return; let bon = true; for (let k = 1; k <= cases; k++) { const x = Math.floor(f.x / T) + q[0] * k, y = Math.floor(f.y / T) + q[1] * k; if (x < 0 || y < 0 || x >= m.w || y >= m.h || m.solid[y * m.w + x] || !['npont', 'nfloor'].includes(m.g0(x * T + 8, y * T + 8))) bon = false; } if (bon) ou = [Math.floor(f.x / T) + q[0] * cases, Math.floor(f.y / T) + q[1] * cases]; }); // (dans la descente, ce qui rôde peut se trouver dans une salle : on s'y place aussi)
    if (!ou) return null; if (gele) { f.v = 0; f.sonne = 0; f.pousse = null; f.x = Math.floor(f.x / T) * T + 8; f.y = Math.floor(f.y / T) * T + 8; f.cx = null; }
    W.player.x = ou[0] * T + 8; W.player.y = ou[1] * T + 8; W.dest = null; const dx = f.x - W.player.x, dy = f.y - W.player.y; W.player.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); W.updateCam(true); R._pret = 0;
    return { d: Math.round(Math.hypot(dx, dy)), voiles: f.voiles, coups: R.coups | 0, touches: R.touches | 0 }; }, [id, cases, gele]);
  { const c = await p.evaluate(async () => { const I = window.ISNAD, W = I.world, R = I.rodeurs; await I.script.run([['map', 'noos', 'seuil', { hue: 210 }]]);
      const L = R.rodent(), m = W.map, s0 = W.spotPx('seuil'), E = W.saga.enemies; window.__depart = L.map(f => [f.id, f.x, f.y]);
      return { n: L.length, attendu: R.MEUTES[3], ponts: L.every(f => m.g0(f.x, f.y) === 'npont'), loin: L.every(f => Math.hypot(f.x - s0[0], f.y - s0[1]) > 9 * 16), petits: L.every(f => E[f.group[0]] && E[f.group[0]].tier === 'minion' && !I.D.NOIRS.includes(f.group[0])), voiles: L.map(f => f.voiles).join(','), arme: R.enMain().type }; });
    si(c.n === c.attendu && c.n > 0 && c.ponts && c.loin && c.petits, `le labyrinthe d'un chapitre : ${c.n} petits égrégores du récit rôdent, posés sur des ponts, à l'écart du seuil (voiles : ${c.voiles}) ; aucune idée noire`, `ce qui rôde : ${JSON.stringify(c)}`);
    // trente secondes de va-et-vient, le groupe restant au seuil : toujours sur les ponts, jamais dans un lieu nommé
    const v = await p.evaluate(() => { const I = window.ISNAD, W = I.world, R = I.rodeurs, m = W.map; let hors = 0; const c0 = R.chrono.reste; for (let i = 0; i < 900; i++) { R.tic(1 / 30); R.rodent().forEach(f => { if (m.g0(f.x, f.y) !== 'npont') hors++; }); } R.chrono.reste = c0;
      const bouge = R.rodent().filter(f => { const d = window.__depart.find(q => q[0] === f.id); return d && Math.hypot(f.x - d[1], f.y - d[2]) > 16; }).length; return { hors, bouge, n: R.rodent().length, combat: I.battle.active }; });
    si(!v.hors && v.bouge >= 1 && v.n === c.n && !v.combat, `trente secondes de va-et-vient : ${v.bouge} sur ${v.n} ont bougé, aucun n'a quitté les ponts ni rejoint le groupe au seuil`, `va-et-vient : ${JSON.stringify(v)}`);
    await calme(8);
    // 2.x — la manette tactile, comme sur une console de poche (décideur, 19 novembre) : A et B sous le pouce droit ; B frappe,
    // et s'éclaire quand quelque chose est à portée (ui.js, U.frapper)
    const bouton = () => p.evaluate(() => ({ frapper: document.body.classList.contains('frapper'), a: document.querySelector('#pad .a').textContent, b: document.querySelector('#pad .b').textContent }));
    const bLoin = await bouton();
    // « Entrée » frappe : un voile de moins, sonné ; sonné, il laisse passer
    let a0 = await pres('meute0', 1, true); await p.waitForTimeout(250);
    const bPres = await bouton();
    si(!bLoin.frapper && bPres.frapper && bPres.a === 'A' && bPres.b === 'B', `les boutons A et B : B s'éclaire à portée de ce qui rôde, et pas loin de lui`, `les boutons A et B : loin ${JSON.stringify(bLoin)}, à portée ${JSON.stringify(bPres)}`);
    { // la même chose sur un téléphone, en hauteur puis en largeur : le joystick sous le pouce gauche, A et B sous le pouce droit
      await p.evaluate(() => document.body.classList.add('touch'));
      for (const [w, h] of [[390, 844], [844, 390]]) { await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(400); await pres('meute0', 1, true); await p.waitForTimeout(250);
        const t = await p.evaluate(() => { const r = q => { const e = document.querySelector(q), b = e.getBoundingClientRect(); return { x: Math.round(b.left + b.width / 2), y: Math.round(b.top + b.height / 2), l: Math.round(b.width), vu: b.width > 0 && getComputedStyle(e).visibility !== 'hidden' }; };
          return { a: r('#pad .a'), b: r('#pad .b'), joy: r('#pad .joy'), frapper: document.body.classList.contains('frapper') }; });
        await p.screenshot({ path: path.join(out, `C-0-pouces-${w}x${h}.png`) });
        si(t.frapper && t.a.vu && t.b.vu && t.joy.vu && t.a.x > w * 0.6 && t.b.x > w * 0.55 && t.a.x > t.b.x && t.a.y < t.b.y && t.joy.x < w * 0.4 && t.a.l >= 56 && t.b.l >= 56, `sur un téléphone en ${w} × ${h} : le joystick sous le pouce gauche, A et B sous le pouce droit (A plus haut, B plus bas)`, `sur un téléphone en ${w} × ${h} : ${JSON.stringify(t)}`); }
      // le pouce appuie sur B : le coup part (puis on remet ce qui rôde comme il était, pour l'épreuve au clavier qui suit)
      await pres('meute0', 1, true); await p.waitForTimeout(250);
      const avB = await p.evaluate(() => ({ coups: window.ISNAD.rodeurs.coups | 0, voiles: window.ISNAD.world.foes.find(q => q.id === 'meute0').voiles }));
      const cb = await p.evaluate(() => { const b = document.querySelector('#pad .b').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
      await p.mouse.click(cb[0], cb[1]); await p.waitForTimeout(250);
      const apB = await p.evaluate(v => { const I = window.ISNAD, f = I.world.foes.find(q => q.id === 'meute0'), r = { coups: I.rodeurs.coups | 0, voiles: f.voiles }; f.voiles = v; f.sonne = 0; f.pousse = null; return r; }, avB.voiles);
      si(apB.coups === avB.coups + 1 && apB.voiles === avB.voiles - 1, `le pouce sur B : le coup part (un voile de moins)`, `le pouce sur B : ${JSON.stringify(avB)} → ${JSON.stringify(apB)}`);
      await p.evaluate(() => document.body.classList.remove('touch')); await p.setViewportSize({ width: 1280, height: 720 }); await p.waitForTimeout(400); a0 = await pres('meute0', 1, true); await p.waitForTimeout(250); }
    await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const a1 = await p.evaluate(() => { const I = window.ISNAD, R = I.rodeurs, f = I.world.foes.find(q => q.id === 'meute0'); return { coups: R.coups | 0, touches: R.touches | 0, voiles: f.voiles, sonne: f.sonne > 0, dialogue: !document.querySelector('#dialog').hidden, lecon: I.save.data.codex.includes('coeur/frappe') }; });
    await p.screenshot({ path: path.join(out, 'C-1-frappe.png') });
    si(a0 && a1.coups === a0.coups + 1 && a1.touches === a0.touches + 1 && a1.voiles === a0.voiles - 1 && a1.sonne && !a1.dialogue, `« Entrée », face à ce qui rôde, le frappe (arme en main : ${c.arme}) : un voile de moins, il est sonné`, `la frappe au clavier : ${JSON.stringify(a0)} → ${JSON.stringify(a1)}`);
    const a2 = await p.evaluate(() => new Promise(res => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.id === 'meute0'); f.sonne = 3; f.pousse = null; W.player.x = f.x; W.player.y = f.y + 2; setTimeout(() => res({ combat: I.battle.active, busy: I.script.busy, sonne: f.sonne > 0 }), 700); }));
    si(!a2.combat && !a2.busy && a2.sonne, 'sonné, il laisse passer : on le traverse sans combat', `sonné : ${JSON.stringify(a2)}`);
    // frappé jusqu'au bout, il se dissipe ; le groupe y gagne, le Recueil le connaît, il ne revient pas
    const x0 = await p.evaluate(() => { const W = window.ISNAD.world, h = W.hero(W.party[0]); return h.lvl * 1000 + h.xp; });
    for (let i = 0; i < 8 && await p.evaluate(() => !window.ISNAD.world.foes.find(q => q.id === 'meute0').done); i++) { await pres('meute0', 1, true); await p.evaluate(() => { const I = window.ISNAD; I.rodeurs.frappe(I.world.foes.find(q => q.id === 'meute0')); }); await p.waitForTimeout(120); }
    const a3 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, R = I.rodeurs, f = W.foes.find(q => q.id === 'meute0'), h = W.hero(W.party[0]); return { fini: f.done, drapeau: !!I.script.flags[f.cle], gain: h.lvl * 1000 + h.xp, recueil: I.save.data.codex.includes('foe:' + W.saga.id + ':' + f.group[0]), dissipes: R.dissipes | 0, restent: R.rodent().length }; });
    await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, 'C-2-dissipe.png') });
    si(a3.fini && a3.drapeau && a3.gain > x0 && a3.recueil && a3.restent === c.n - 1, 'sans voile, il se dissipe : le groupe y gagne de l’expérience, le Recueil le connaît, il en reste un de moins', `dissipé : ${JSON.stringify(a3)} (avant ${x0})`);
    // au doigt : toucher ce qui rôde, à trois cases, c'est s'en approcher puis le frapper
    const t0 = await pres('meute1', 3, true);
    if (t0) { const pt = await p.evaluate(() => { const I = window.ISNAD, W = I.world, G = I.gfx, f = W.foes.find(q => q.id === 'meute1'), r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left + (f.x - G.cale(W.cam.x)) / G.PW * r.width, y: r.top + (f.y - 12 - G.cale(W.cam.y)) / G.PH * r.height }; });
      await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(1800);
      const t1 = await p.evaluate(() => { const I = window.ISNAD, R = I.rodeurs, f = I.world.foes.find(q => q.id === 'meute1'); return { touches: R.touches | 0, voiles: f.voiles, d: Math.round(Math.hypot(f.x - I.world.player.x, f.y - I.world.player.y)), combat: I.battle.active }; });
      si(t1.touches > t0.touches && t1.voiles < t0.voiles && !t1.combat, `au doigt : toucher ce qui rôde, à trois cases, c'est s'en approcher puis le frapper (de ${t0.d} à ${t1.d} points, un voile de moins)`, `au doigt : ${JSON.stringify(t0)} → ${JSON.stringify(t1)}`);
    } else ko('au doigt : aucun pont droit de trois cases près du deuxième rôdeur');
    // s'il rejoint le groupe : un combat ordinaire, après quoi il n'est plus là
    // (le joueur de test ne mène que ce combat-là : sitôt fini, il rend la main — sinon il continuerait le récit)
    await p.evaluate(() => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.id === 'meute1'), os = I.battle.start; window.__combats = 0;
      I.battle.start = async function (o) { window.__combats++; I.debug.auto = true; I.speed = 30; try { return await os.call(this, o); } finally { I.debug.auto = false; I.speed = 1; I.battle.start = os; } };
      f.sonne = 0; f.pousse = null; f.v = 30; W.player.x = f.x + 3; W.player.y = f.y; W.dest = null; });
    for (let i = 0; i < 40 && !(await p.evaluate(() => window.__combats)); i++) await p.waitForTimeout(120);
    const b0 = await p.evaluate(() => window.__combats === 1); await p.waitForTimeout(400);
    for (let i = 0; i < 240 && await p.evaluate(() => window.ISNAD.battle.active || window.ISNAD.script.busy); i++) await p.waitForTimeout(250);
    await p.waitForTimeout(300);
    const b1 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.id === 'meute1'); return { fini: f.done, drapeau: !!I.script.flags[f.cle], carte: W.map.id, restent: I.rodeurs.rodent().length }; });
    si(b0 && b1.fini && b1.drapeau && b1.carte === 'noos' && b1.restent === c.n - 2, 's’il rejoint le groupe : un combat ordinaire ; vaincu, il ne rôde plus', `le contact : combat ${b0} ${JSON.stringify(b1)}`);
    // la partie reprise : ceux qui sont dissipés ou vaincus ne reviennent pas, les autres sont là
    await p.evaluate(async () => { const I = window.ISNAD, W = I.world; W.player.x = W.spotPx('seuil')[0]; W.player.y = W.spotPx('seuil')[1]; W.checkpoint(); const cp = JSON.parse(JSON.stringify(I.save.data.cp)); W.loadMap('medine', {}, null); await W.startChapter(cp.saga, cp.ci, cp); }); await calme();
    const r0 = await p.evaluate(() => window.ISNAD.rodeurs.rodent().map(f => f.id).join(','));
    si(r0 === (c.n > 2 ? 'meute2' : ''), `reprise : ce qui a été dissipé ou vaincu ne revient pas (reste : ${r0 || 'rien'})`, `reprise : il rôde « ${r0} »`);
    // le chrono écoulé : on remonte, et plus rien ne rôde ; une nouvelle descente du récit les ramène
    await p.evaluate(() => { window.ISNAD.debug.compte = 0.4; }); await p.waitForTimeout(2600); await calme();
    const r1 = await p.evaluate(() => ({ n: window.ISNAD.rodeurs.rodent().length, off: !!window.ISNAD.script.flags._meutes_off }));
    const r2 = await p.evaluate(async () => { const I = window.ISNAD; await I.script.run([['map', 'noos', 'seuil', { hue: 210 }]]); return { n: I.rodeurs.rodent().length, off: !!I.script.flags._meutes_off }; });
    si(r1.n === 0 && r1.off && r2.n === c.n && !r2.off, `après une remontée au chrono, plus rien ne rôde ; une nouvelle descente du récit en ramène ${r2.n}`, `remontée : ${JSON.stringify(r1)} ; nouvelle descente : ${JSON.stringify(r2)}`);
    await p.evaluate(async () => { const I = window.ISNAD, W = I.world; I.debug.sansMeutes = true; W.checkpoint(); const cp = JSON.parse(JSON.stringify(I.save.data.cp)); cp.map = 'medine'; cp.opts = { time: 'day' }; cp.pos = [488, 701]; I.save.data.cp = cp; await W.startChapter(cp.saga, cp.ci, cp); }); await calme();
  }
  // dans la descente : pour éprouver la frappe sur un rôdeur, on fige les autres et on le pose sur un pont à l'écart du seuil
  // et de l'issue (sans quoi l'épreuve pourrait finir la descente par l'issue, ou par un autre rôdeur)
  const isoler = id => p.evaluate(id => { const I = window.ISNAD, W = I.world, m = W.map, T = 16, f = W.foes.find(q => q.id === id), lieux = ['seuil', 'issue', 'abri', 'refuge'].map(k => W.spotPx(k)).filter(Boolean);
    W.foes.forEach(q => { if (q.rodeur) { q.v = 0; q.cx = null; } });
    const libre = (m.env.dedale.loin || []).find(c => { const x = c[0] * T + 8, y = c[1] * T + 8; if (m.g0(x, y) !== 'npont' || m.g0(x + T, y) !== 'npont' && m.g0(x - T, y) !== 'npont' && m.g0(x, y + T) !== 'npont' && m.g0(x, y - T) !== 'npont') return false;
      return lieux.every(s => Math.hypot(s[0] - x, s[1] - y) > 6 * T) && W.foes.every(q => q === f || !q.rodeur || q.done || Math.hypot(q.x - x, q.y - y) > 5 * T); });
    if (!libre) return false; f.x = libre[0] * T + 8; f.y = libre[1] * T + 8; f.sonne = 0; f.pousse = null; return true; }, id);
  { // la descente du râwî, seul : un coup sonne, il ne vainc pas
    await p.evaluate(() => { const I = window.ISNAD; I.rodeurs.repos(); window.__bete = I.save.data.animal; I.save.data.animal = null; });
    await descendre('sommeil');
    const s0 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.rodeur && q.placed && !q.done); window.__r = f.id; return { accompagne: W.excursion.accompagne, id: f.group[0], peut: I.rodeurs.peutFaireFace(f.group[0]) }; });
    const rid = await p.evaluate(() => window.__r); await isoler(rid); await pres(rid, 1, true); await p.waitForTimeout(200); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const s1 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.id === window.__r); return { sonne: f.sonne > 0, tenue: f.tenue, fini: f.done, coups: I.rodeurs.coups | 0 }; });
    await p.screenshot({ path: path.join(out, 'C-3-descente-sonne.png') });
    const s2 = await p.evaluate(() => new Promise(res => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.id === window.__r); f.sonne = 3; f.pousse = null; W.player.x = f.x; W.player.y = f.y + 2; setTimeout(() => res({ encore: !!W.excursion && !W.excursion.fin, combat: I.battle.active }), 700); }));
    si(!s0.accompagne && !s0.peut && s1.sonne && s1.tenue === undefined && !s1.fini && s2.encore && !s2.combat, `la descente, seul : frappé, ce qui rôde (${s0.id}) est sonné et laisse passer ; rien ne l'entame`, `la descente, seul : ${JSON.stringify(s0)} ${JSON.stringify(s1)} ${JSON.stringify(s2)}`);
    await p.evaluate(() => { const W = window.ISNAD.world, f = W.foes.find(q => q.id === window.__r); f.sonne = 0.05; }); await p.waitForTimeout(600); await remonter();
    const s3 = await etat(); si(s3.derniere === 'rattrape' && s3.clos, 'le coup passé, il rattrape : seul, on ne vainc pas', `après le coup : ${JSON.stringify(s3)}`);
    await p.evaluate(() => { const I = window.ISNAD; I.rodeurs.repos(); I.save.data.animal = window.__bete; });
    // lame forgée et accompagné : les coups entament une idée noire, jusqu'à la dissiper
    await descendre('sommeil');
    const n0 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.rodeur && q.placed && !q.done && I.D.NOIRS.includes(q.group[0])); if (!f) return null; window.__r = f.id; return { id: f.group[0], peut: I.rodeurs.peutFaireFace(f.group[0]), accompagne: W.excursion.accompagne }; });
    if (!n0) ko('aucune idée noire ne rôde dans cette descente');
    else { const nid = await p.evaluate(() => window.__r); let k = 0; await isoler(nid);
      for (; k < 12 && await p.evaluate(() => !window.ISNAD.world.foes.find(q => q.id === window.__r).done); k++) { await pres(nid, 1, true); await p.evaluate(() => { const I = window.ISNAD; I.rodeurs.frappe(I.world.foes.find(q => q.id === window.__r)); }); await p.waitForTimeout(100); }
      const n1b = await p.evaluate(id => { const I = window.ISNAD, W = I.world, E = W.excursion, f = W.foes.find(q => q.id === window.__r); return { fini: f.done, note: !!(E && E.flags['_noir_' + id]), encore: !!E && !E.fin, combat: I.battle.active }; }, n0.id);
      await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, 'C-4-descente-dissipee.png') });
      si(n0.peut && n0.accompagne && n1b.fini && n1b.note && n1b.encore && !n1b.combat, `lame forgée et accompagné : ${k} coups entament une idée noire (${n0.id}) jusqu'à la dissiper, sans combat ; la descente continue`, `l'idée noire frappée : ${JSON.stringify(n0)} ${JSON.stringify(n1b)} en ${k} coups`);
      // un mal du cœur, lui, ne s'entame pas : il faut lui faire face
      const m0 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.rodeur && q.placed && !q.done && !I.D.NOIRS.includes(q.group[0])); if (!f) return null; window.__r = f.id; return f.group[0]; });
      if (m0) { const mid = await p.evaluate(() => window.__r), trace = []; await isoler(mid); for (let i = 0; i < 6; i++) { const pr = await pres(mid, 1, true); const fr = await p.evaluate(() => { const I = window.ISNAD, W = I.world, f = W.foes.find(q => q.id === window.__r), r = I.rodeurs.frappe(f); return [r, Math.round(Math.hypot(f.x - W.player.x, f.y - W.player.y)), +(f.sonne || 0).toFixed(2), I.script.busy, W.lock, !!(W.excursion && (W.excursion.fin || W.excursion.combat)), W.map.g0(f.x, f.y)]; }); trace.push([pr ? pr.d : null].concat(fr)); await p.waitForTimeout(80); }
        const m1b = await p.evaluate(() => { const f = window.ISNAD.world.foes.find(q => q.id === window.__r); return { fini: f.done, tenue: f.tenue, sonne: f.sonne > 0 }; }); m1b.trace = trace;
        si(!m1b.fini && m1b.tenue === undefined && m1b.sonne, `un mal du cœur (${m0}) ne s'entame pas à coups répétés : sonné, il reste debout — il faut lui faire face`, `le mal du cœur frappé : ${JSON.stringify(m1b)}`); }
      await aller('issue'); await p.waitForTimeout(500); await remonter();
      const fin = await p.evaluate(id => ({ drapeau: !!window.ISNAD.script.flags['_noir_' + id], saga: window.ISNAD.world.saga.id }), n0.id);
      si(fin.drapeau && fin.saga === 'abubakr', 'de retour au récit : l’idée noire dissipée à coups de lame le reste jusqu’au chapitre suivant', `de retour : ${JSON.stringify(fin)}`); }
  }
  await b.close();
  if (errors.length) { [...new Set(errors)].slice(0, 6).forEach(e => ko('erreur console : ' + e)); } else ok('aucune erreur console');
  console.log(ecarts ? `✗ ${ecarts} ÉCART(S)` : '✓ DESCENTE CONFORME — le labyrinthe d’un chapitre, la descente du râwî, ce qui rôde et la frappe (captures dans .smoke/descente)');
  process.exit(ecarts ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
