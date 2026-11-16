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
  await p.evaluate(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; I.debug.graine = 20261116; /* des graines fixes : chaque passage voit les mêmes labyrinthes ; leur variété, c'est dedales.js qui l'éprouve */ document.querySelectorAll('.screen').forEach(e => e.hidden = true); document.body.classList.remove('in-screen'); I.input.reset(); // l'écran-titre est contourné : son écouteur aussi, pour que les touches aillent au monde comme en jeu
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
  await b.close();
  if (errors.length) { [...new Set(errors)].slice(0, 6).forEach(e => ko('erreur console : ' + e)); } else ok('aucune erreur console');
  console.log(ecarts ? `✗ ${ecarts} ÉCART(S)` : '✓ DESCENTE CONFORME — le labyrinthe d’un chapitre et la descente du râwî (captures dans .smoke/descente)');
  process.exit(ecarts ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
