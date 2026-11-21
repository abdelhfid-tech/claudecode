#!/usr/bin/env node
/* ISNAD 2.23 (D212) — les quartiers de la Cité-Miroir, par les vrais boutons, sur un téléphone, en hauteur et en largeur.
   - « Revenir en 2084 » (la halte d'un récit) mène, une fois joués les retours dus (« retour: n »), au parvis des quartiers, à
     côté de Maître Yûnus ; la première fois, il dit qu'on peut y revenir (la leçon de l'outil « cite »).
   - Parler à Maître Yûnus : une réplique du rôle de râwî, puis « Reprendre le récit », « La Chaîne », « Rester dans la Cité » ;
     B y répond « Rester » ; « Reprendre le récit » rend le joueur exactement à sa place (saga, chapitre, objectif, carte, point,
     groupe, drapeaux) ; la halte des quartiers offre les deux mêmes sorties ; « La Cité-Miroir », au pied de la Chaîne, y
     mène — et n'y est pas offerte avant le prologue.
   - Chaque lieu nommé atteint à pied (clavier simulé, vraies collisions) et au doigt (de vrais touchers sur la scène).
   - Les voitures : elles roulent, s'arrêtent devant le joueur, repartent quand il s'écarte ; aucune ne le traverse, il n'entre
     dans aucune ; aucune ne reste bloquée quand personne n'est sur sa voie ; les voitures de course tournent.
   - Ce qui rôde : seulement les chimères de D.CITE.rodent (aucune idée noire de D.NOIRS, sur quarante tirages) ; une chimère
     passe au travers des passants, qui ne bougent pas ; « Personne d'autre ne la voit. » à la première ; son contact ouvre un
     combat, d'où l'on peut fuir ; après le combat, la prière est rappelée, puis « Revoir Maître Yûnus » / « Plus tard » :
     B et « Plus tard » ne font rien ; oui mène à côté de Maître Yûnus, qui dit une réplique du rôle de râwî.
   - La partie garde `cite`, s'exporte et se réimporte à l'identique ; aucune erreur console.
   Usage : node v2/tools/cite.js [dossier de captures]      « CITÉ CONFORME », sinon « ÉCART », « BLOQUÉ », « INACCESSIBLE »,
   « COINCÉ », « ABSENT » ; code de sortie 1. */
const path = require('path'), fs = require('fs');
const { chromium, devices } = require('playwright');
const out = process.argv[2] || path.join(__dirname, '../.smoke/cite');
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(__dirname, '../index.html');
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); }, si = (c, bien, mal, mot) => c ? ok(bien) : ko((mot || 'ÉCART') + ' ' + (mal || bien));

async function telephone(browser, w, h, qs) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }), p = await ctx.newPage(), errors = [];
  p.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await p.goto(url + (qs || '')); await p.waitForTimeout(1600); await preparer(p);
  return { ctx, p, errors };
}
// les aides de l'outil, dans la page (à reposer après un rechargement)
async function preparer(p) {
  await p.evaluate(() => {
    const I = window.ISNAD, W = I.world, S = I.script, q = s => document.querySelector(s);
    I.audio.setOn(false); I.debug.noOeuvres = true;
    const T = window.__t = { toasts: [] };
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) T.toasts.push((n.textContent || '').trim()); }))).observe(q('#toasts'), { childList: true });
    T.journal = []; { const os = W.startChapter; W.startChapter = function (sid, ci) { const ch = I.sagas[sid].chapters[ci]; T.journal.push(ch.id); if (I.cite.refuge(ch)) I.debug.auto = false; return os.apply(this, arguments); }; } // dans les quartiers, la main revient au joueur
    { const oa = I.cite.apres; I.cite.apres = function () { I.debug.auto = false; I.speed = 1; return oa.apply(this, arguments); }; }                // après un combat mené par l'IA de test, le rappel se lit par les vrais boutons
    { const ob = I.battle.start; T.combats = []; I.battle.start = function (o) { T.combats.push({ group: (o.group || []).join('+'), fuite: !!o.fuite, bg: o.bg }); return ob.apply(this, arguments); }; }
    T.visible = s => { const e = q(s); return !!e && !e.hidden; };
    T.attendre = (cond, ms) => new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { let v = false; try { v = cond(); } catch (e) { v = false; } if (v) { clearInterval(iv); res(true); } else if (Date.now() - t0 > (ms || 60000)) { clearInterval(iv); res(false); } }, 50); });
    T.calme = () => I.scene === W && !!W.map && !S.busy && !W.lock && !I.battle.active && !I.ui.menuOpen;
    T.etat = () => ({ saga: W.saga && W.saga.id, ch: W.ch && W.ch.id, ci: W.ci, obj: W.objIndex, carte: W.map && W.map.id, x: Math.round(W.player.x), y: Math.round(W.player.y), groupe: W.party.join('+'), drapeaux: Object.keys(S.flags).filter(k => S.flags[k] && !/^(lame|tranche)_/.test(k)).sort().join(',') });
    T.yunus = () => W.npcs.find(n => n.id === 'yunus_c');
    T.pres = () => { const y = T.yunus(); return y ? Math.round(Math.hypot(y.x - W.player.x, y.y - W.player.y)) : -1; };
    T.pied = nom => [...document.querySelectorAll('#chain .chainfoot button')].find(b => b.textContent === nom);
    T.piedNoms = () => [...document.querySelectorAll('#chain .chainfoot button')].map(b => b.textContent);
    T.maillon = nom => [...document.querySelectorAll('#chain .links .link')].find(b => ((b.querySelector('h3') || {}).textContent || '').indexOf(nom) === 0);
    T.halte = () => { I.ui.pause(); return [...document.querySelectorAll('#menu .side button')].map(b => b.textContent.trim()); };
    T.halteBouton = nom => { const b = [...document.querySelectorAll('#menu .side button')].find(x => x.textContent.trim() === nom); if (!b) return false; b.click(); return true; };
    T.choix = () => T.visible('#choice') ? { prompt: (q('#choice .prompt') || {}).textContent || '', opts: [...document.querySelectorAll('#choice .opt')].map(b => b.textContent.trim()) } : null;
    T.dialogue = () => T.visible('#dialog') ? (q('#dialog .text').textContent || '').trim() : '';
    // la ligne, une fois écrite tout entière (la machine à écrire a fini : le ▼ paraît)
    // (puis un instant : une touche pressée juste avant que la ligne n'attende la suite serait perdue — comme pour un joueur)
    T.lu = async () => { if (!T.visible('#dialog')) { await new Promise(r => setTimeout(r, 200)); return ''; } await T.attendre(() => T.visible('#dialog') && getComputedStyle(q('#dialog .next')).visibility === 'visible', 8000); await new Promise(r => setTimeout(r, 200)); return T.dialogue(); };
    // jouer le récit en cours jusqu'à ce que n objectifs soient atteints, puis rendre la main
    T.jusqua = async n => { const oc = W.checkpoint; W.checkpoint = function () { const r = oc.apply(this, arguments); if (W.objIndex >= n) I.debug.auto = false; return r; };
      I.debug.auto = true; const fini = await T.attendre(() => W.objIndex >= n && !I.debug.auto && T.calme(), 180000); W.checkpoint = oc; I.debug.auto = false; return fini; };
    // le pied du joueur et une voiture l'un dans l'autre ?
    T.dans = v => { const f = I.trafic.pied(v), p = W.player; return f[0] < p.x + 4 && p.x - 4 < f[2] && f[1] < p.y && p.y - 5 < f[3]; };
    T.poser = (x, y) => { W.player.x = x; W.player.y = y; W.dest = null; W.stop(); W.resetTrail(); W.updateCam(true); };
    T.endormir = () => { W.foes.forEach(f => { if (f.rue) f.done = true; }); };   // pour marcher sans être rejoint
    // marcher jusqu'à un point au clavier simulé (les flèches tenues), en suivant le chemin des cases, comme le joueur de test « à pied »
    T.marcher = async (x, y, ms) => { const p = W.player, h = I.input.held, t0 = performance.now(); let path = W.pathTo(p.x, p.y, x, y) || [], best = 1e9, calee = 0;
      while (performance.now() - t0 < ms) { const d = Math.hypot(x - p.x, y - p.y); if (d < 18) break;
        if (S.busy || W.lock || I.battle.active) { h.up = h.down = h.left = h.right = false; await new Promise(r => setTimeout(r, 100)); continue; }
        while (path.length > 1 && Math.hypot(path[0][0] - p.x, path[0][1] - p.y) < 3) path.shift();
        const wp = path.length > 1 ? path[0] : [x, y]; h.up = h.down = h.left = h.right = false; const dx = wp[0] - p.x, dy = wp[1] - p.y; if (dx > 1.2) h.right = true; else if (dx < -1.2) h.left = true; if (dy > 1.2) h.down = true; else if (dy < -1.2) h.up = true;
        await new Promise(r => requestAnimationFrame(r));
        if (d < best - 0.5) { best = d; calee = 0; } else if (++calee > 90) { calee = 0; path = W.pathTo(p.x, p.y, x, y) || path; } }
      h.up = h.down = h.left = h.right = false; return Math.round(Math.hypot(x - p.x, y - p.y)); };
    // où toucher la scène pour aller vers un point de la carte : le point lui-même s'il se voit, sinon dans sa direction, au bord de
    // ce que l'on voit — jamais sur la manette ni sur le plan
    T.ecran = (wx, wy) => { const G = I.gfx, c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect(), p = W.player;
      const X = x => (x - Math.round(W.cam.x)) / G.PW * c.width + c.left, Y = y => (y - Math.round(W.cam.y)) / G.PH * c.height + c.top;
      const hx = X(p.x), hy = Y(p.y - 6); let tx = X(wx), ty = Y(wy - 4);
      const L = Math.max(s.left, 0) + 40, R = Math.min(s.right, innerWidth) - 40, H = Math.max(s.top, 0) + 70, B = Math.min(s.bottom, innerHeight) - 30;
      const pads = [...document.querySelectorAll('#pad .dpad, #pad button')].filter(b => getComputedStyle(b).visibility !== 'hidden').map(b => b.getBoundingClientRect()).filter(r => r.width > 4);
      const mini = W.miniRect ? [X(W.miniRect[0] + Math.round(W.cam.x)), Y(W.miniRect[1] + Math.round(W.cam.y)), X(W.miniRect[0] + W.miniRect[2] + Math.round(W.cam.x)), Y(W.miniRect[1] + W.miniRect[3] + Math.round(W.cam.y))] : null;
      // (et rien d'autre que la scène sous le doigt : ni un bouton de la scène, ni une étiquette)
      const libre = (a, b) => a > L && a < R && b > H && b < B && pads.every(r => a < r.left - 16 || a > r.right + 16 || b < r.top - 16 || b > r.bottom + 16) && !(mini && a > mini[0] - 10 && a < mini[2] + 10 && b > mini[1] - 10 && b < mini[3] + 10)
        && [[0, 0], [-14, 0], [14, 0], [0, -14], [0, 14]].every(([u, v]) => { const e = document.elementFromPoint(a + u, b + v); return !!e && ['cv', 'stage', 'ui', 'view'].includes(e.id); });   // (ce que la scène prend pour un toucher : ui.js, bare)
      for (let k = 20; k > 0; k--) { const a = hx + (tx - hx) * k / 20, b = hy + (ty - hy) * k / 20; if (libre(a, b) && Math.hypot(a - hx, b - hy) > 30) return [a, b]; }
      return null; };
  });
}
// faire avancer ce qui se dit (dialogues, cartons) jusqu'à ce que le joueur ait la main, ou qu'un choix s'ouvre
async function avancer(p, n = 120) {
  for (let i = 0; i < n; i++) {
    const e = await p.evaluate(() => { const T = window.__t; return T.calme() ? 'calme' : T.visible('#choice') ? 'choix' : (T.visible('#dialog') || (T.visible('#card') && document.querySelector('#card').classList.contains('on'))) ? 'lire' : T.visible('#chain') ? 'chaine' : ''; });
    if (e === 'calme' || e === 'choix' || e === 'chaine') return e;
    if (e === 'lire') { await p.evaluate(() => window.__t.lu()); await p.keyboard.press('Enter'); }
    await p.waitForTimeout(170);
  }
  return 'bloque';
}

(async () => {
  const browser = await chromium.launch(); let toutesErreurs = [];
  for (const [w, h] of [[390, 844], [844, 390]]) {
    const nom = w + '×' + h, haut = h > w;
    const T = await telephone(browser, w, h), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    // ---------- 1. une partie, le prologue joué, Abû Bakr entamé ; par l'écran-titre (« Continuer ») ----------
    // (en hauteur, le premier retour en 2084 est dû : « Ce qui est descendu » se joue d'abord ; en largeur, les retours sont joués)
    await E(haut => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; if (!haut) sv.rebonds = { x_descendu: true, x_enfant: true, x_avis: true }; I.save.auto('essai'); }, haut);
    await P.reload(); await P.waitForTimeout(1600); await preparer(P);
    {
      const b = await E(() => { const x = [...document.querySelectorAll('#title .vmenu button')].find(b => /^Continuer/.test(b.textContent)); if (x) x.click(); return !!x; });
      si(b && await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000)), `${nom} · « Continuer » rouvre la Chaîne`, `${nom} · l’écran-titre ne mène pas à la Chaîne`, 'BLOQUÉ');
      const pied0 = await E(() => window.__t.piedNoms());
      si(pied0.includes('La Cité-Miroir'), `${nom} · le pied de la Chaîne offre « La Cité-Miroir » (le prologue est joué)`, `${nom} · pas de « La Cité-Miroir » au pied de la Chaîne : ${JSON.stringify(pied0)}`, 'ABSENT');
      if (!haut) await P.screenshot({ path: path.join(out, `chaine-pied-${w}x${h}.png`) });
      await E(() => { window.ISNAD.debug.auto = true; window.__t.maillon('Abû Bakr').click(); });
      si(await E(() => window.__t.jusqua(2)), `${nom} · Abû Bakr joué jusqu’à son deuxième objectif`, `${nom} · Abû Bakr n’atteint pas son deuxième objectif`, 'BLOQUÉ');
    }
    const A = await E(() => window.__t.etat());
    // ---------- 2. « Revenir en 2084 » : (les retours dus,) puis les quartiers, à côté de Maître Yûnus ----------
    {
      const noms = await E(() => window.__t.halte());
      const offert = noms.includes('Revenir en 2084');
      si(offert, `${nom} · la halte offre « Revenir en 2084 »`, `${nom} · la halte n’offre pas « Revenir en 2084 » : ${JSON.stringify(noms)}`, 'INACCESSIBLE');
      await E(() => { window.ISNAD.debug.auto = true; window.__t.halteBouton('Revenir en 2084'); }); // ce qui se joue au retour se lit tout seul
      const arrive = await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers', 200000));
      const r = await avancer(P);
      const e = await E(() => ({ journal: window.__t.journal.slice(-3), etat: window.__t.etat(), pres: window.__t.pres(), lecon: window.ISNAD.cite.journal.some(j => j.quoi === 'lecon'), dits: window.ISNAD.cite.journal.map(j => j.quoi), cps: Object.keys(window.ISNAD.save.data.cps || {}) }));
      const attendu = haut ? ['x_descendu', 'c_quartiers'] : ['c_quartiers'];
      si(arrive && r === 'calme' && attendu.every(k => e.journal.includes(k)) && e.etat.carte === 'quartiers' && e.pres > 0 && e.pres < 40,
        `${nom} · « Revenir en 2084 » : ${haut ? '« Ce qui est descendu » se joue d’abord (un retour dû), puis ' : ''}Idris paraît au parvis des quartiers, à ${e.pres} points de Maître Yûnus`,
        `${nom} · l’arrivée dans les quartiers : ${JSON.stringify(e)} (${r})`, 'BLOQUÉ');
      si(e.lecon && e.cps.includes('abubakr'), `${nom} · Maître Yûnus dit, la première fois, qu’on peut revenir ici (leçon « cite ») ; Abû Bakr est rangé`, `${nom} · la leçon ou le récit rangé : ${JSON.stringify(e)}`);
      await E(() => window.__t.endormir()); await P.waitForTimeout(400); await P.screenshot({ path: path.join(out, `arrivee-yunus-${w}x${h}.png`) });
    }
    // ---------- 3. parler à Maître Yûnus : une réplique, puis où aller ; B : rester ----------
    const parler = async () => { await E(() => { const W = window.ISNAD.world, y = window.__t.yunus(); window.__t.poser(y.x + 18, y.y); W.player.dir = 1; }); await P.waitForTimeout(250); await P.keyboard.press('Enter'); await P.waitForTimeout(200);
      const d = await E(() => window.__t.lu()); const r = await avancer(P); await P.waitForTimeout(450); return { d, r, c: await E(() => window.__t.choix()) }; };
    {
      const m = await parler(), Y = await E(() => window.ISNAD.sagas.idris.cite.yunus);
      si(m.r === 'choix' && Y.some(t => m.d.indexOf(t.slice(0, 30)) >= 0) && m.c && m.c.opts.length === 3 && /^Reprendre le récit : Abû Bakr/.test(m.c.opts[0]) && /La Chaîne/.test(m.c.opts[1]) && /Rester/.test(m.c.opts[2]),
        `${nom} · Maître Yûnus : « ${m.d.slice(0, 60)}… », puis ${m.c ? m.c.opts.map(o => '« ' + o + ' »').join(', ') : '?'}`, `${nom} · parler à Maître Yûnus : ${JSON.stringify(m)}`);
      await P.screenshot({ path: path.join(out, `yunus-menu-${w}x${h}.png`) });
      await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(500);
      const apres = await E(() => ({ choix: window.__t.visible('#choice'), ch: window.ISNAD.world.ch.id, k: window.ISNAD.cite.journal.filter(j => j.quoi === 'menu').pop() }));
      si(!apres.choix && apres.ch === 'c_quartiers' && apres.k && apres.k.k === '', `${nom} · B répond « Rester dans la Cité » : rien ne change`, `${nom} · B devant Maître Yûnus : ${JSON.stringify(apres)}`);
    }
    // ---------- 4. chaque lieu, à pied (en hauteur) et au doigt ----------
    {
      const lieux = await E(() => Object.keys(window.ISNAD.world.map.spots));
      const rates = [];
      if (haut) for (const k of lieux) { const d = await E(async k => { const W = window.ISNAD.world, s = W.spotPx(k); return window.__t.marcher(s[0], s[1], 30000); }, k); if (d > 24) rates.push(k + ' (' + d + ' px)'); }
      si(!haut || !rates.length, `${nom} · à pied : les ${lieux.length} lieux nommés atteints (${lieux.join(', ')})`, `${nom} · à pied, lieux non atteints : ${rates.join(', ')}`, 'COINCÉ');
      const rates2 = [];
      await E(() => { const W = window.ISNAD.world, s = W.spotPx('parvis'); window.__t.poser(s[0], s[1]); });
      for (const k of lieux) {
        let d = 1e9;
        for (let i = 0; i < 40; i++) {
          // (comme un joueur : on touche le lieu s'il se voit ; sinon un point du chemin qui y mène, quelques cases plus loin — un
          // bâtiment entre les deux se contourne)
          const st = await E(k => { const T = window.__t, W = window.ISNAD.world, s = W.spotPx(k); const d = Math.hypot(s[0] - W.player.x, s[1] - W.player.y); if (d < 22) return { d };
            const ch = W.route(s[0], s[1]), q = ch.length ? ch[Math.min(ch.length - 1, 7)] : s; return { d, pt: T.ecran(q[0], q[1] + 2) || T.ecran(s[0], s[1]), calme: T.calme() }; }, k);
          d = st.d; if (d < 22) break;
          if (!st.calme) { await avancer(P, 20); await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(200); continue; } // un passant touché en chemin : on l'écoute, puis on repart
          if (st.pt) await P.touchscreen.tap(st.pt[0], st.pt[1]);
          await P.waitForTimeout(900);
        }
        if (d >= 22) { rates2.push(k + ' (' + Math.round(d) + ' px)'); await P.screenshot({ path: path.join(out, `doigt-rate-${k}-${w}x${h}.png`) }); console.log('   (dernier état : ' + JSON.stringify(await E(k => { const W = window.ISNAD.world, s = W.spotPx(k); return { joueur: [Math.round(W.player.x), Math.round(W.player.y)], lieu: s, pt: window.__t.ecran(s[0], s[1]), dest: W.dest && [Math.round(W.dest.x), Math.round(W.dest.y), W.dest.path.length] }; }, k)) + ')'); }
        else await P.screenshot({ path: path.join(out, `lieu-${k}-${w}x${h}.png`) });
      }
      si(!rates2.length, `${nom} · au doigt : les ${lieux.length} lieux nommés atteints, par des touchers sur la scène`, `${nom} · au doigt, lieux non atteints : ${rates2.join(', ')}`, 'INACCESSIBLE');
    }
    // ---------- 5. les voitures ----------
    {
      await E(() => { const W = window.ISNAD.world, s = W.spotPx('priere'); window.__t.poser(s[0], s[1]); window.ISNAD.trafic.traverses = 0; });
      const s0 = await E(() => window.ISNAD.trafic.voitures.map(v => v.s).concat(window.ISNAD.trafic.course.map(v => v.s)));
      await P.waitForTimeout(4000);
      const r1 = await E(s0 => { const TR = window.ISNAD.trafic, n = TR.voitures.length; return { n, nc: TR.course.length, roulent: TR.voitures.filter((v, i) => v.s - s0[i] > 60).length, course: TR.course.filter((v, i) => v.s - s0[n + i] > 200).length, attente: Math.max(...TR.voitures.map(v => v.attente)) }; }, s0);
      si(r1.n >= 4 && r1.roulent === r1.n && r1.course === r1.nc && r1.attente < 2, `${nom} · ${r1.n} voitures roulent sur la boucle des avenues, ${r1.nc} voitures de course tournent ; personne n’est sur leur voie : aucune ne reste arrêtée`, `${nom} · les voitures : ${JSON.stringify(r1)}`, 'BLOQUÉ');
      // devant une voiture qui va vers l'ouest, au milieu de la voie
      // (une voiture sur une avenue, vers l'est ou vers l'ouest, et devant elle, à quatre-vingt-dix points, une voie sans autre voiture)
      const v0 = await E(async () => { const TR = window.ISNAD.trafic; for (let essai = 0; essai < 40; essai++) {
          const libreEn = (x, y) => TR.voitures.every(u => Math.abs(u.x - x) > 60 || Math.abs(u.y - y) > 30);
          const v = TR.voitures.find(v => (v.d === 'g' || v.d === 'd') && v.x > 320 && v.x < 760 && libreEn(v.x + (v.d === 'd' ? 90 : -90), v.y));
          if (v) { window.__t.poser(v.x + (v.d === 'd' ? 90 : -90), v.y); TR.traverses = 0; TR.journal.length = 0; return v.i; }
          await new Promise(r => setTimeout(r, 250)); }
        return null; });
      if (v0 === null) ko(`ÉCART ${nom} · aucune voiture sur l’avenue du nord pour l’éprouver`);
      else {
        await P.waitForTimeout(400); await P.screenshot({ path: path.join(out, `voiture-arretee-${w}x${h}.png`) });
        await P.waitForTimeout(3200);
        const r2 = await E(i => { const TR = window.ISNAD.trafic, v = TR.voitures[i], W = window.ISNAD.world; return { v: v.v, ecart: Math.round(v.d === 'd' ? W.player.x - 4 - (v.x + 18) : v.x - 18 - (W.player.x + 4)), dans: window.__t.dans(v), traverses: TR.traverses, journal: TR.journal }; }, v0);
        si(r2.v === 0 && r2.ecart > 0 && r2.ecart <= 44 && !r2.dans && r2.traverses === 0, `${nom} · une voiture s’arrête devant le joueur, à ${r2.ecart} points de lui, et ne le traverse pas`, `${nom} · devant une voiture : ${JSON.stringify(r2)}`);
        // entrer dans la voiture arrêtée, par le côté : refusé
        const r3 = await E(async i => { const I = window.ISNAD, W = I.world, TR = I.trafic, v = TR.voitures[i]; window.__t.poser(v.x, v.y - 14); const h = I.input.held; h.down = true; for (let k = 0; k < 40; k++) await new Promise(r => requestAnimationFrame(r)); h.down = false; return { dans: window.__t.dans(v), y: Math.round(W.player.y), pied: TR.pied(v).map(Math.round) }; }, v0);
        si(!r3.dans, `${nom} · on n’entre pas dans une voiture : le pas vers elle est refusé`, `${nom} · le joueur est entré dans une voiture : ${JSON.stringify(r3)}`);
        await E(i => { const v = window.ISNAD.trafic.voitures[i]; window.__t.poser(v.x + (v.d === 'd' ? 60 : -60), v.y < 300 ? 168 : 534); }, v0); await P.waitForTimeout(2500);
        const r4 = await E(i => { const TR = window.ISNAD.trafic; return { v: Math.round(TR.voitures[i].v), traverses: TR.traverses, journal: TR.journal }; }, v0);
        si(r4.v > 0 && r4.traverses === 0, `${nom} · le joueur s’écarte : elle repart (${r4.v} points par seconde) ; aucune voiture n’a traversé personne`, `${nom} · après l’écart : ${JSON.stringify(r4)}`, 'BLOQUÉ');
        await P.screenshot({ path: path.join(out, `voitures-${w}x${h}.png`) });
      }
    }
    // ---------- 6. ce qui rôde : jamais une idée noire ; au travers des passants ----------
    {
      const r = await E(() => { const I = window.ISNAD, W = I.world, S = I.script, D = I.D, vus = {}; let noirs = 0, hors = 0, n = 0; const g0 = S.flags._rues;
        for (let k = 0; k < 40; k++) { S.flags._rues = 1000 + k; I.rodeurs.poserRues(); W.foes.filter(f => f.rue).forEach(f => { n++; const id = f.group[0]; vus[id] = (vus[id] || 0) + 1; if (D.NOIRS.includes(id) || (W.saga.enemies[id] || {}).idee) noirs++; if (!D.CITE.rodent[id]) hors++; }); }
        S.flags._rues = g0; I.rodeurs.poserRues(); return { n, noirs, hors, vus }; });
      si(r.n > 60 && !r.noirs && !r.hors, `${nom} · quarante tirages : ${r.n} chimères dans les rues, toutes de D.CITE.rodent (${Object.keys(r.vus).map(k => k + ' ' + r.vus[k]).join(', ')}) — aucune idée noire`, `${nom} · ce qui rôde : ${JSON.stringify(r)}`);
      const t = await E(async () => { const I = window.ISNAD, W = I.world, n = W.npcs.find(x => x.id === 'q_livreur'), f = W.foes.find(x => x.rue && !x.done); if (!n || !f) return null;
        const avant = JSON.stringify([n.x, n.y, n.dir, n.pose, n.hidden]); f.x = n.x; f.y = n.y - 3; f.cx = null; window.__t.poser(W.spotPx('priere')[0], W.spotPx('priere')[1]);
        let sur = 0; for (let k = 0; k < 60; k++) { await new Promise(r => requestAnimationFrame(r)); if (Math.abs(f.x - n.x) < 9 && Math.abs(f.y - n.y) < 9) sur++; }
        return { avant, apres: JSON.stringify([n.x, n.y, n.dir, n.pose, n.hidden]), sur, rue: I.rodeurs.rueOk(Math.floor(n.x / 16), Math.floor(n.y / 16)) }; });
      si(t && t.avant === t.apres && t.sur > 0 && t.rue, `${nom} · une chimère passe au travers d’un passant (sur lui ${t && t.sur} images) : il ne bouge pas, ne la voit pas`, `${nom} · au travers des passants : ${JSON.stringify(t)}`);
    }
    // ---------- 7. une chimère des rues : la voir, le combat, le rappel, « Plus tard » (B) ; puis « Revoir Maître Yûnus » ----------
    const rencontre = async (n) => {
      await E(() => { window.ISNAD.rodeurs.poserRues(); }); // (de nouveau en route)
      // (la première : vue d'abord dans la rue, à quelques pas)
      if (n === 1) { const vu = await E(() => { const W = window.ISNAD.world, f = W.foes.find(x => x.rue && !x.done); if (!f) return false; window.__t.poser(f.x + 56, f.y + 2); return true; });
        if (vu) { await P.waitForTimeout(250); await P.screenshot({ path: path.join(out, `chimere-rue-${w}x${h}.png`) }); } }
      const f = await E(() => { const W = window.ISNAD.world, f = W.foes.find(x => x.rue && !x.done); if (!f) return null; const T = window.__t; f.cx = null; T.poser(f.x + 10, f.y + 4); return f.group[0]; });
      if (!f) { ko(`ABSENT ${nom} · aucune chimère dans les rues`); return null; }
      const combat = await E(() => window.__t.attendre(() => window.ISNAD.battle.active, 12000));
      if (!combat) { ko(`BLOQUÉ ${nom} · la chimère « ${f} » ne rejoint pas Idris`); return null; }
      await P.waitForTimeout(1400); if (n === 1) await P.screenshot({ path: path.join(out, `chimere-combat-${w}x${h}.png`) });
      await E(() => { window.ISNAD.debug.auto = true; window.ISNAD.speed = 20; }); // le combat lui-même, l'IA de test le mène
      const fin = await E(() => window.__t.attendre(() => !window.ISNAD.battle.active && window.__t.visible('#dialog'), 90000));
      const d = await E(() => window.__t.lu()), L = await E(() => window.ISNAD.sagas.idris.cite.rappels);
      si(fin && L.some(t => d.indexOf(t.slice(0, 30)) >= 0), `${nom} · après le combat contre « ${f} », la prière rappelée : « ${d.slice(0, 70)}… »`, `${nom} · après le combat : ${JSON.stringify({ fin, d })}`);
      await P.keyboard.press('Enter'); await E(() => window.__t.attendre(() => window.__t.visible('#choice'), 5000)); await P.waitForTimeout(500);
      const c = await E(() => window.__t.choix());
      si(c && c.opts.length === 2 && /Revoir Maître Yûnus/.test(c.opts[0]) && /Plus tard/.test(c.opts[1]), `${nom} · « ${c && c.prompt} » : ${c && c.opts.join(' / ')}`, `${nom} · le choix après le rappel : ${JSON.stringify(c)}`);
      if (n === 1) await P.screenshot({ path: path.join(out, `rappel-choix-${w}x${h}.png`) });
      return { f, c };
    };
    {
      const e0 = await E(() => ({ x: window.ISNAD.world.player.x, y: window.ISNAD.world.player.y }));
      const r1 = await rencontre(1);
      if (r1) {
        const seul = await E(() => window.__t.toasts.filter(t => /Personne d’autre ne la voit\./.test(t)).length);
        si(seul === 1, `${nom} · à la première chimère vue : « Personne d’autre ne la voit. »`, `${nom} · la ligne de la première chimère : vue ${seul} fois`);
        const avant = await E(() => ({ x: Math.round(window.ISNAD.world.player.x), y: Math.round(window.ISNAD.world.player.y), pres: window.__t.pres() }));
        await E(() => window.ISNAD.input.emit('retour')); await P.waitForTimeout(600);
        const apres = await E(() => ({ choix: window.__t.visible('#choice'), x: Math.round(window.ISNAD.world.player.x), y: Math.round(window.ISNAD.world.player.y), j: window.ISNAD.cite.journal.slice(-1)[0], calme: window.__t.calme() }));
        si(!apres.choix && apres.j.quoi === 'plus-tard' && Math.hypot(apres.x - avant.x, apres.y - avant.y) < 2 && apres.calme, `${nom} · B répond « Plus tard » : Idris reste où il est`, `${nom} · B après le rappel : ${JSON.stringify({ avant, apres })}`);
      }
      const r2 = await rencontre(2);
      if (r2) {
        await P.keyboard.press('Enter'); await E(() => window.__t.attendre(() => window.__t.visible('#dialog'), 6000));
        const d = await E(() => window.__t.lu()), Y = await E(() => window.ISNAD.sagas.idris.cite.yunus), pres = await E(() => window.__t.pres());
        si(pres > 0 && pres < 32 && Y.some(t => d.indexOf(t.slice(0, 30)) >= 0), `${nom} · « Revoir Maître Yûnus » : Idris est mené à ${pres} points de lui, qui dit : « ${d.slice(0, 60)}… »`, `${nom} · revoir Maître Yûnus : ${JSON.stringify({ pres, d })}`);
        await P.screenshot({ path: path.join(out, `yunus-replique-${w}x${h}.png`) });
        await avancer(P);
      }
      const cb = await E(() => window.__t.combats.filter(c => c.group.split('+').every(g => window.ISNAD.D.CITE.rodent[g])));
      si(cb.length >= 2 && cb.every(c => c.fuite), `${nom} · chaque combat des rues est un combat de rencontre, d’où l’on peut fuir (${cb.map(c => c.group).join(', ')})`, `${nom} · les combats des rues : ${JSON.stringify(cb)}`);
    }
    // ---------- 8. « Reprendre le récit » (Maître Yûnus) : exactement à sa place ----------
    {
      const m = await parler();
      if (m.r !== 'choix' || !m.c) ko(`BLOQUÉ ${nom} · Maître Yûnus ne propose rien : ${JSON.stringify(m)}`);
      else { await P.keyboard.press('Enter'); // la première réponse : reprendre le récit
        await E(() => window.__t.attendre(() => window.ISNAD.world.saga && window.ISNAD.world.saga.id === 'abubakr' && window.__t.calme(), 30000)); await P.waitForTimeout(300);
        const e = await E(() => window.__t.etat()), sv = await E(() => ({ cps: Object.keys(window.ISNAD.save.data.cps || {}), cp: window.ISNAD.save.data.cp && window.ISNAD.save.data.cp.saga }));
        const meme = e.saga === A.saga && e.ci === A.ci && e.obj === A.obj && e.carte === A.carte && Math.hypot(e.x - A.x, e.y - A.y) < 3 && e.groupe === A.groupe && e.drapeaux === A.drapeaux;
        si(meme && !sv.cps.some(k => /^idris:/.test(k)), `${nom} · « Reprendre le récit » : Abû Bakr reprend exactement là où on l’a laissé (objectif ${e.obj}, « ${e.carte} », ${e.x}, ${e.y}) ; le refuge n’est pas rangé`,
          `${nom} · reprendre le récit :\n   laissé  ${JSON.stringify(A)}\n   repris  ${JSON.stringify(e)} ${JSON.stringify(sv)}`); }
    }
    // ---------- 9. de nouveau dans les quartiers : la halte offre la Chaîne ; la Chaîne y ramène ; Maître Yûnus offre la Chaîne ----------
    {
      await E(() => { window.__t.halte(); window.__t.halteBouton('Revenir en 2084'); });
      await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers', 60000)); await avancer(P);
      const noms = await E(() => window.__t.halte());
      si(noms.includes('Reprendre le récit') && noms.includes('La Chaîne') && !noms.includes('Revenir en 2084'), `${nom} · la halte des quartiers offre « Reprendre le récit » et « La Chaîne »`, `${nom} · la halte des quartiers : ${JSON.stringify(noms)}`, 'ABSENT');
      await E(() => window.__t.halteBouton('La Chaîne'));
      const ch = await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 15000));
      const sv = await E(() => ({ cps: Object.keys(window.ISNAD.save.data.cps || {}), cp: window.ISNAD.save.data.cp }));
      si(ch && sv.cps.includes('abubakr') && !sv.cps.some(k => /^idris:/.test(k)) && !sv.cp, `${nom} · « La Chaîne », depuis la halte : la Chaîne s’ouvre ; Abû Bakr attend, rangé ; les quartiers ne le sont pas`, `${nom} · la Chaîne depuis la halte : ${JSON.stringify({ ch, sv })}`);
      await P.waitForTimeout(300); await P.screenshot({ path: path.join(out, `chaine-${w}x${h}.png`) });
      await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); });
      const la = await E(() => window.__t.attendre(() => window.ISNAD.world.ch && window.ISNAD.world.ch.id === 'c_quartiers' && window.ISNAD.world.map && window.ISNAD.world.map.id === 'quartiers', 15000)); await avancer(P);
      const pres = await E(() => window.__t.pres());
      si(la && pres > 0 && pres < 40, `${nom} · « La Cité-Miroir », au pied de la Chaîne : Idris paraît au parvis, à ${pres} points de Maître Yûnus`, `${nom} · la Cité-Miroir depuis la Chaîne : ${JSON.stringify({ la, pres })}`, 'BLOQUÉ');
      const m = await parler();
      const i = m.c ? m.c.opts.findIndex(o => /La Chaîne/.test(o)) : -1;
      for (let k = 0; k < i; k++) { await P.keyboard.press('ArrowDown'); await P.waitForTimeout(120); }
      await P.keyboard.press('Enter');
      const ch2 = await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 15000));
      si(i >= 0 && ch2, `${nom} · Maître Yûnus : « La Chaîne, aux Archives basses » mène à la Chaîne`, `${nom} · la Chaîne par Maître Yûnus : ${JSON.stringify({ i, ch2, c: m.c })}`, 'BLOQUÉ');
    }
    // ---------- 10. la partie garde `cite`, et voyage avec ----------
    {
      const r = await E(() => { const I = window.ISNAD, c0 = JSON.stringify(I.save.data.cite), t = I.save.exporter(), l = I.save.lireTexte(t); if (!l.ok) return { ok: false, e: l.erreur };
        const ab = JSON.parse(t); ab.partie.cite = { arrivees: -1 }; const l2 = I.save.lireTexte(JSON.stringify(ab)); return { ok: true, c0, c1: JSON.stringify(l.partie.cite), refus: !l2.ok }; });
      const c = r.ok ? JSON.parse(r.c0) : {};
      si(r.ok && r.c0 === r.c1 && c.arrivees >= 3 && c.rappels >= 2 && c.yunus >= 3 && c.vue === true && c.lecon === true && r.refus, `${nom} · la partie garde « cite » (${r.c0}), l’exporte à l’identique, refuse un compte abîmé`, `${nom} · la partie et « cite » : ${JSON.stringify(r)}`);
    }
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => nom + ' · ' + e));
    await T.ctx.close();
  }
  // ---------- 11. avant le prologue, la Chaîne n'offre pas les quartiers ----------
  {
    const T = await telephone(browser, 390, 844), E = (fn, a) => T.p.evaluate(fn, a);
    const r = await E(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.ui.showChain(); return new Promise(res => setTimeout(() => res(window.__t.piedNoms()), 500)); });
    si(!r.includes('La Cité-Miroir'), 'avant le prologue, la Chaîne n’offre pas « La Cité-Miroir »', 'avant le prologue, la Chaîne offre déjà les quartiers : ' + JSON.stringify(r));
    toutesErreurs = toutesErreurs.concat(T.errors); await T.ctx.close();
  }
  // ---------- 12. le dessin des voitures, à côté des personnages, sur un téléphone, dans les trois réglages ----------
  for (const [qs, nomD] of [['', 'fin'], ['?def=2l', 'fin-adouci'], ['?def=1', 'origine']]) {
    const T = await telephone(browser, 390, 844, qs), P = T.p, E = (fn, a) => P.evaluate(fn, a);
    await E(() => { const I = window.ISNAD; I.save.reset(); const sv = I.save.data; sv.started = true; sv.prologue = true; I.save.auto('essai'); });
    await P.reload(); await P.waitForTimeout(1600); await preparer(P);
    await E(() => { const b = [...document.querySelectorAll('#title .vmenu button')].find(b => /^Continuer/.test(b.textContent)); if (b) b.click(); });
    await E(() => window.__t.attendre(() => window.__t.visible('#chain'), 8000));
    await E(() => { const b = window.__t.pied('La Cité-Miroir'); if (b) b.click(); });
    await E(() => window.__t.attendre(() => window.ISNAD.world.map && window.ISNAD.world.map.id === 'quartiers', 15000)); await avancer(P);
    // sur le trottoir du nord, entre deux voitures garées, près d'un passant ; on attend qu'une voiture passe dans l'image
    await E(() => { window.__t.endormir(); window.__t.poser(19 * 16 + 8, 9 * 16 + 13); });
    const vu = await E(() => window.__t.attendre(() => window.ISNAD.trafic.voitures.some(v => Math.abs(v.x - 312) < 70 && v.y < 300), 30000));
    await P.screenshot({ path: path.join(out, `voitures-dessin-${nomD}-390x844.png`) });
    await E(() => { const W = window.ISNAD.world, n = W.npcs.find(x => x.id === 'q_passante'); window.__t.poser(n.x + 20, n.y); W.player.dir = 1; }); await P.waitForTimeout(400);
    await P.screenshot({ path: path.join(out, `passant-triste-${nomD}-390x844.png`) });
    si(vu, `le dessin « ${nomD} » : une voiture qui passe et des voitures garées, à côté des personnages (captures)`, `le dessin « ${nomD} » : aucune voiture n’est passée dans l’image`);
    toutesErreurs = toutesErreurs.concat(T.errors.map(e => nomD + ' · ' + e)); await T.ctx.close();
  }
  if (toutesErreurs.length) { anomalies++; console.log('--- ERREURS ---'); [...new Set(toutesErreurs)].slice(0, 12).forEach(e => console.log(e)); }
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ CITÉ CONFORME — les quartiers, en hauteur et en largeur : l’arrivée à côté de Maître Yûnus, ses sorties, chaque lieu à pied et au doigt, les voitures, ce qui rôde et le rappel (captures dans ${path.relative(path.join(__dirname, '..'), out)})`);
  await browser.close();
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
