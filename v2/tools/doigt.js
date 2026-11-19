#!/usr/bin/env node
/* Le début du jeu joué au doigt, comme un joueur : aucun raccourci de test, aucune avance automatique.
   À chaque attente du jeu, l'outil regarde l'écran avant de toucher : ce que le joueur doit lire ou toucher
   est-il visible (dans l'écran, ni vide, ni transparent, ni sous le noir d'un fondu) ? Il compte aussi les
   menus de choix : un menu qui se referme sans avoir été touché trahit un toucher fantôme.
   Les parcours de tools/smoke.js prouvent que le récit se déroule ; celui-ci prouve qu'il se voit.

   Usage : node tools/doigt.js [loin] [largeurxhauteur ...]
     sans « loin » : le prologue, de l'écran-titre à la Chaîne, sur trois écrans (deux en hauteur, un en largeur)
     loin          : le prologue puis tout le premier chapitre de la saga I, sur un téléphone en hauteur ;
                     après le premier combat, joué au doigt, les suivants sont menés par l'IA de test
   Sortie : une ligne par écran ; « INVISIBLE » ou « BLOQUÉ » en cas d'échec ; code de sortie 1. */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const url = 'file://' + path.join(__dirname, '../index.html');
const out = path.join(__dirname, '../.smoke'); fs.mkdirSync(out, { recursive: true });
const args = process.argv.slice(2), loin = args.includes('loin'), dims = args.filter(a => /^\d+x\d+$/.test(a)).map(t => t.split('x').map(Number));
const tailles = dims.length ? dims : loin ? [[390, 844]] : [[390, 844], [360, 560], [844, 390]];

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  let echecs = 0;
  for (const [w, h] of tailles) {
    const errors = [], soucis = [];
    const p = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true, isMobile: true })).newPage();
    p.on('pageerror', e => errors.push('pageerror: ' + e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForTimeout(1800);
    await p.evaluate(loin => { const I = window.ISNAD, oc = I.ui.showChain; I.ui.showChain = function () { window.__chaine = (window.__chaine || 0) + 1; return oc.apply(this, arguments); };
      // chaque menu de choix qui s'ouvre est compté : s'il se referme sans que l'outil l'ait touché, un toucher fantôme a répondu à la place du joueur
      window.__menus = 0; const c = document.querySelector('#choice'); new MutationObserver(() => { if (!c.hidden && !c._vu) { c._vu = true; window.__menus++; } else if (c.hidden) c._vu = false; }).observe(c, { attributes: true, attributeFilter: ['hidden'] });
      // « loin » : le premier combat se joue au doigt ; les suivants sont menés par l'IA de test, pour aller voir la suite
      if (loin) { const ob = I.battle.start; let n = 0; I.battle.start = async function (x) { if (!n++) return ob(x); I.debug.auto = true; I.speed = 12; try { return await ob(x); } finally { I.debug.auto = false; I.speed = 1; } }; }
    }, loin);
    // ce que le jeu attend, où toucher, et si cela se voit
    const etat = () => p.evaluate(() => {
      const I = window.ISNAD, W = I.world, G = I.gfx, q = s => document.querySelector(s), vis = e => !!e && !e.hidden;
      const z = e => +getComputedStyle(e).zIndex || 0, f = q('#fade');
      const voir = e => { const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return 'vide';
        if (r.bottom < 8 || r.top > innerHeight - 8 || r.right < 8 || r.left > innerWidth - 8) return 'hors de l’écran';
        if (+getComputedStyle(f).opacity > 0.5 && z(e) <= z(f)) return 'sous le noir du fondu'; if (+getComputedStyle(e).opacity < 0.3) return 'transparent'; return ''; };
      const mid = e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, Math.min(innerHeight - 6, r.top + r.height / 2)]; };
      const on = (quoi, e, pt, extra) => Object.assign({ quoi, pt: pt || mid(e), souci: voir(e), texte: (e.textContent || '').trim().slice(0, 44) }, extra || {});
      const ou = W.saga ? W.saga.id + '/' + (W.ch ? W.ch.id : '') + '#' + W.objIndex : '';
      if (I.debug.auto) return { quoi: 'attente', ou };
      if (vis(q('#chain'))) { const l = [...q('#chain').querySelectorAll('.link')].find(b => !b.disabled && !b.classList.contains('done')) || q('#chain .link'); return l ? on('chaine', l, null, { ou }) : { quoi: 'attente', ou }; }
      if (vis(q('#title'))) return on('titre', q('#title .vmenu button'), null, { ou });
      if (vis(q('#perso'))) return on('personnage', q('#perso .ok'), null, { ou }); // 2.0 : le nom et la tenue du râwî, déjà choisis — un toucher pour commencer
      if (vis(q('#card')) && q('#card').classList.contains('on')) return on('carton', q('#card'), [innerWidth / 2, innerHeight * 0.8], { ou });
      if (vis(q('#menu'))) return on('halte', q('#menu .side button'), null, { ou }); // ouverte par mégarde : on la referme
      if (vis(q('#choice'))) { const o = [...q('#choice').querySelectorAll('.opt:not(.locked)')], pr = q('#choice .prompt'); return on('choix', o[o.length - 1], null, { ou, n: o.length, rects: o.map(mid), prompt: pr ? pr.textContent.trim().slice(0, 44) : '' }); }
      if (I.battle.active) { const c = q('#battle .cmd'), b = q('#battle .banner');
        if (c && c.querySelector('.mhint')) { const pl = q('.plate'), cible = (I.battle.places ? I.battle.places() : []).find(e => e.choix && e.camp === 'foe');
          // l'égrégore lui-même, sur la scène, et non sa plaque : c'est lui que le pouce vise
          if (cible) { const r = q('#cv').getBoundingClientRect(); return on('cible', q('#battle'), [r.left + cible.x / G.PW * r.width, r.top + cible.y / G.PH * r.height], { ou, texte: cible.nom, corps: cible.nom, plaque: pl ? mid(pl) : null }); }
          return pl ? on('cible', pl, null, { ou }) : { quoi: 'attente', ou }; }
        // 2.12 (D189) : chaque commande du combat est dans l'écran et se touche (en 360 × 560, Vertus, Objets et Garde tombaient dessous)
        if (c && c.querySelectorAll('.mi').length && !(b && !b.hidden)) { const m = c.querySelector('.mlist.main'), hors = !m ? [] : [...m.querySelectorAll('.mi')].filter(x => getComputedStyle(x).display !== 'none').filter(x => { const r = x.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return r.top < 0 || r.bottom > innerHeight || !(e && x.contains(e)); }).map(x => x.textContent.trim().slice(0, 24));
          return on('commande', c.querySelectorAll('.mi')[1], null, { ou, hors, commandes: m ? m.querySelectorAll('.mi').length : 0 }); }
        if (b && !b.hidden) return on('bandeau', b, null, { ou });
        return { quoi: 'attente', ou }; }
      if (vis(q('#dialog'))) return on('dialogue', q('#dialog'), [innerWidth / 2, Math.min(innerHeight - 6, q('#dialog').getBoundingClientRect().bottom + 30)], { ou }); // on touche sous la boîte, là où tombe le pouce
      if (I.scene === W && !I.script.busy && !W.lock && W.map) { const t = W.target && W.target(), c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect();
        if (!t) return { quoi: 'attente', ou };
        const x = (t.gx - Math.round(W.cam.x)) / G.PW * c.width + c.left, y = (t.gy - 6 - Math.round(W.cam.y)) / G.PH * c.height + c.top, bas = s.bottom - s.top > 300 ? 90 : 64;
        // le pouce ne vise pas un bouton de la manette pour marcher : s'il tombait dessus, il vise juste au-dessus
        const pt = [Math.max(s.left + 14, Math.min(s.right - 14, x)), Math.max(s.top + bas, Math.min(s.bottom - 14, y))];
        // ni le plan, dans son coin : le toucher ouvre la carte — il vise juste en dessous
        if (W.miniRect) { const r = W.miniRect, l = c.left + r[0] / G.PW * c.width, t2 = c.top + r[1] / G.PH * c.height, d = l + r[2] / G.PW * c.width, b2 = t2 + r[3] / G.PH * c.height; if (pt[0] > l - 8 && pt[0] < d + 8 && pt[1] > t2 - 8 && pt[1] < b2 + 8) pt[1] = Math.min(s.bottom - 14, b2 + 12); }
        document.querySelectorAll('#pad button').forEach(b => { const r = b.getBoundingClientRect(); if (r.width > 4 && getComputedStyle(b).visibility !== 'hidden' && pt[0] > r.left - 5 && pt[0] < r.right + 5 && pt[1] > r.top - 5 && pt[1] < r.bottom + 5) pt[1] = r.top - 9; });
        return { quoi: 'marche', ou, pt, souci: +getComputedStyle(f).opacity > 0.5 ? 'scène sous le noir du fondu' : '', texte: 'objectif ' + W.objIndex, pos: Math.round(W.player.x) + ',' + Math.round(W.player.y) }; }
      return { quoi: 'attente', ou };
    });
    const t0 = Date.now(), compte = {}, tours = {}, limite = loin ? 900000 : 240000; let fini = false, dernier = '', depuis = Date.now(), prologue = 0, lieu = '', rates = 0, corps = 0, visait = false;
    while (Date.now() - t0 < limite) {
      const s = await etat(); if (s.ou) lieu = s.ou;
      if (visait && s.quoi !== 'cible') { corps++; visait = false; } // le choix s'est refermé : le toucher sur le corps a choisi
      if (!loin && s.quoi === 'chaine') { fini = true; break; }
      if (loin && /^abubakr\/ab2/.test(s.ou || '')) { fini = true; break; } // le premier chapitre de la saga I est derrière nous
      if (s.quoi === 'chaine' && !prologue) prologue = Date.now() - t0;
      const cle = s.quoi + '|' + (s.texte || '') + '|' + (s.pos || '') + '|' + (s.ou || ''); if (cle !== dernier) { dernier = cle; depuis = Date.now(); }
      if (Date.now() - depuis > 60000) break; // plus rien ne change : bloqué
      if (s.quoi === 'attente') { await p.waitForTimeout(250); continue; }
      if (s.souci) { // un fondu d'apparition n'est pas un défaut : on regarde de nouveau avant de conclure
        await p.waitForTimeout(700); const s2 = await etat(); if (s2.quoi !== s.quoi || s2.texte !== s.texte) continue;
        if (s2.souci) { const m = s.quoi + ' ' + s2.souci + ' : « ' + s.texte + ' » (' + (s.ou || 'avant la partie') + ')'; if (!soucis.includes(m)) { soucis.push(m); await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-' + soucis.length + '.png') }); } } }
      compte[s.quoi] = (compte[s.quoi] || 0) + 1;
      if (s.quoi === 'commande' && s.commandes) { tours.cmd = (tours.cmd || 0) + 1; if (s.hors && s.hors.length) { const m = 'INACCESSIBLE en combat, ' + w + '×' + h + ' : ' + s.hors.map(x => '« ' + x + ' »').join(', ') + ' hors de l’écran ou sous un autre élément (' + (s.ou || '') + ')'; if (!soucis.includes(m)) { soucis.push(m); await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-commandes.png') }); } } }
      let pt = s.pt;
      // la cible se choisit en la touchant elle-même : si trois touchers sur son corps ne la choisissent pas, c'est un défaut ; on finit par sa plaque
      if (s.quoi === 'cible' && s.corps) { visait = true; if (++rates > 3) { visait = false; const m = 'INACCESSIBLE en combat, toucher « ' + s.corps + ' » sur la scène ne le choisit pas (' + (s.ou || '') + ')'; if (!soucis.includes(m)) soucis.push(m); if (s.plaque) pt = s.plaque; } } else rates = 0;
      if (s.quoi === 'choix' && s.rects && s.rects.length) { const k = s.prompt + '|' + s.n, i = tours[k] = (tours[k] === undefined ? s.n - 1 : (tours[k] + s.n - 1) % s.n); pt = s.rects[Math.min(i, s.rects.length - 1)]; } // une mauvaise réponse revient : on en essaie une autre
      await p.touchscreen.tap(pt[0], pt[1]);
      await p.waitForTimeout(s.quoi === 'marche' ? 850 : s.quoi === 'chaine' ? 1200 : 430);
    }
    const resume = Object.keys(compte).map(k => k + ' ' + compte[k]).join(', '), menus = await p.evaluate(() => window.__menus), quoi = loin ? 'prologue et premier chapitre de la saga I terminés' : 'prologue terminé';
    if (menus > (compte.choix || 0)) soucis.push('un menu de choix a été répondu sans avoir été touché (' + menus + ' ouverts, ' + (compte.choix || 0) + ' touchés) : toucher fantôme');
    if (!fini) { echecs++; const s = await etat(); await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-bloque.png') }); console.log(`BLOQUÉ au doigt ${w}×${h} — ${lieu || 'avant la partie'} — le jeu attend : ${s.quoi}${s.texte ? ' « ' + s.texte + ' »' : ''} (${resume})`); }
    else console.log(`OK  au doigt ${w}×${h} — ${quoi} en ${((Date.now() - t0) / 1000).toFixed(0)} s${loin && prologue ? ' (prologue : ' + (prologue / 1000).toFixed(0) + ' s)' : ''} (${resume})`);
    soucis.forEach(m => { echecs++; console.log(/^INACCESSIBLE/.test(m) ? '  ' + m : '  INVISIBLE ' + m); });
    if (fini && corps) console.log(`      en combat, la cible a été choisie ${corps} fois en la touchant elle-même, sur la scène`);
    if (fini && tours.cmd) console.log(`      en combat, les commandes, vues ${tours.cmd} fois : chacune dans l'écran, sous le doigt`);
    // 2.12 (D189) : un combat où tout est reçu (une partie d'avant), le groupe de Khâlid — les cinq commandes, chacune dans l'écran et sous le doigt
    // (en 360 × 560, Vertus, Objets et Garde tombaient sous le bord de l'écran ; en 360 × 640, Garde à moitié) ; puis sa bataille déclarée, la
    // Sérénité pleine : sept commandes, « Ordonner » et la Sérénité comprises (avant le correctif de la relecture, la Sérénité tombait sous
    // l'écran en 360 × 560, à moitié en 360 × 640). Pas avec « loin » : les combats y sont menés par l'IA de test après le premier.
    if (fini && !loin) {
      const libre = () => p.evaluate(() => { const I = window.ISNAD, W = I.world; return I.scene === W && !!W.map && !I.script.busy && !W.lock; }), lecture = () => p.evaluate(() => ['#card', '#dialog'].some(q => !document.querySelector(q).hidden));
      const chapitre = async ci => { await p.evaluate(ci => { const I = window.ISNAD, W = I.world; I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); W.roster = {}; W.saga = null; W.startChapter('khalid', ci); }, ci); // un groupe de trois : le panneau est plein
        for (let i = 0; i < 120 && !(await libre()); i++) { if (await lecture()) await p.keyboard.press('Enter'); await p.waitForTimeout(170); } };
      const commandes = async (quoi, n, nom, lancer) => { await p.evaluate(lancer);
        for (let i = 0; i < 160; i++) { const e = await p.evaluate(() => document.querySelector('.screen:not([hidden]) button, #choice:not([hidden]) .opt') ? 'prep' : !!document.querySelector('#battle .cmd .mlist.main .mi') && document.querySelector('#battle .banner').hidden ? 'cmd' : ['#card', '#dialog'].some(q => !document.querySelector(q).hidden) ? 'lit' : '');
          if (e === 'cmd') break; if (e) await p.keyboard.press('Enter'); await p.waitForTimeout(170); } // la page de préparation d'une idole, un carton : on les passe
        await p.waitForTimeout(300);
        const c = await p.evaluate(() => [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].filter(x => getComputedStyle(x).display !== 'none').map(x => { const q = x.getBoundingClientRect(), e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return { nom: x.querySelector('span').textContent.trim(), ok: q.top >= 0 && q.bottom <= innerHeight && !!e && x.contains(e) }; }));
        const hors = c.filter(x => !x.ok); if (c.length < n) { echecs++; console.log(`  INACCESSIBLE ${w}×${h} : ${quoi}, on ne voit que ${c.length} commande(s) sur ${n}`); }
        else if (hors.length) { echecs++; await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-' + nom + '.png') }); console.log(`  INACCESSIBLE ${w}×${h} : ${quoi}, ${hors.map(x => '« ' + x.nom + ' »').join(', ')} hors de l'écran ou sous un autre élément`); }
        else console.log(`      ${quoi}, les ${c.length} commandes (${c.map(x => x.nom.replace(/^\S+\s*/, '')).join(', ')}) : chacune dans l'écran, sous le doigt`);
        await p.evaluate(() => { const I = window.ISNAD, W = I.world; try { I.battle.abort(W); I.script.depth = 0; W.lock = false; } catch (e) { /* refermé */ } }); await p.waitForTimeout(500); };
      await chapitre(2);
      await commandes('en combat', 5, 'cinq-commandes', () => { const I = window.ISNAD, E = I.world.saga.enemies; I.battle.start({ group: Object.keys(E).filter(k => E[k].tier === 'minion' && !E[k].racine).slice(0, 2), bg: 'desert' }); });
      await chapitre(1);
      await commandes('dans la bataille déclarée, la Sérénité pleine', 7, 'sept-commandes', () => { const I = window.ISNAD, W = I.world; W.party.forEach(id => { W.hero(id).sakina = 100; });
        const f = x => { if (!x || typeof x !== 'object') return null; if (Array.isArray(x) && x[0] === 'battle') return x; for (const k in x) { const r = f(x[k]); if (r) return r; } return null; };
        I.script.run([f(W.ch.objectives[6].then)]); });
      // 2.x — le joystick du pouce gauche (décideur, 19 novembre : « jouer sur le téléphone comme sur une Game Boy ») : le pouce
      // tiré dans une direction fait marcher ; lâché, on s'arrête. Quatre directions essayées : un mur peut en barrer une.
      await chapitre(2);
      const joy = await p.evaluate(() => { const e = document.querySelector('#pad .joy'), b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2, vu: b.width > 0 && getComputedStyle(e).visibility !== 'hidden' }; });
      const pos = () => p.evaluate(() => [window.ISNAD.world.player.x, window.ISNAD.world.player.y]);
      let marche = 0, arret = true;
      for (const [vx, vy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = await pos(); await p.mouse.move(joy.x, joy.y); await p.mouse.down(); await p.mouse.move(joy.x + vx * joy.r * 0.8, joy.y + vy * joy.r * 0.8, { steps: 4 }); await p.waitForTimeout(600);
        const b = await pos(); await p.mouse.up(); await p.waitForTimeout(250); const c = await pos(); await p.waitForTimeout(400); const d = await pos();
        if ((b[0] - a[0]) * vx + (b[1] - a[1]) * vy > 6) marche++; if (Math.hypot(d[0] - c[0], d[1] - c[1]) > 1) arret = false; }
      if (!joy.vu || !marche || !arret) { echecs++; await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-joystick.png') }); console.log(`  INACCESSIBLE ${w}×${h} : le joystick ${!joy.vu ? 'ne se voit pas' : !marche ? 'ne fait pas marcher' : 'lâché, ne s’arrête pas'}`); }
      else console.log(`      le joystick, sous le pouce gauche : ${marche} direction(s) sur 4 font marcher, lâché, on s'arrête`);
      // 2.16 — courir (décideur, 19 novembre : « il faut que les personnages puissent courir ») : le pouce tiré au bord du
      // cercle, au-delà de 85 % de son rayon, fait courir — 1,225 fois plus vite qu'à la marche (le décideur, devant la 2.16 :
      // « il va trop vite, diminue de 30 % » ; elle allait 1,75 fois plus vite) ; plus près du centre, on marche. Mesuré dans la
      // direction la plus dégagée, le temps du jeu faisant foi : plus vite que la marche, mais pas plus d'une fois et un tiers.
      const degage = await p.evaluate(() => { const W = window.ISNAD.world, P = W.player, ok = (x, y) => !(W.solidAt(x - 4, y - 5) || W.solidAt(x + 4, y - 5) || W.solidAt(x - 4, y) || W.solidAt(x + 4, y));
        return [[1, 0], [-1, 0], [0, 1], [0, -1]].map(v => { let n = 0; while (n < 140 && ok(P.x + v[0] * n, P.y + v[1] * n)) n += 2; return { v, n, x: P.x, y: P.y }; }).sort((a, b) => b.n - a.n)[0]; });
      const vitesse = async f => { await p.evaluate(q => { const W = window.ISNAD.world; W.player.x = q.x; W.player.y = q.y; W.dest = null; W.resetTrail(); }, degage);
        await p.mouse.move(joy.x, joy.y); await p.mouse.down(); await p.mouse.move(joy.x + degage.v[0] * joy.r * f, joy.y + degage.v[1] * joy.r * f, { steps: 4 }); await p.waitForTimeout(120);
        const lire = () => p.evaluate(() => { const W = window.ISNAD.world; return [W.player.x, W.player.y, W.t]; }), a = await lire(); await p.waitForTimeout(300); const b = await lire();
        await p.mouse.up(); await p.waitForTimeout(250); return Math.hypot(b[0] - a[0], b[1] - a[1]) / Math.max(0.01, b[2] - a[2]); };
      const vm = await vitesse(0.6), vc = await vitesse(0.97);
      if (!(vm > 70 && vm < 94 && vc > 1.15 * vm && vc < 1.33 * vm)) { echecs++; await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-course.png') }); console.log(`  INACCESSIBLE ${w}×${h} : courir — au milieu du joystick ${vm.toFixed(0)} points par seconde, au bord ${vc.toFixed(0)} (dégagé sur ${degage.n} points)`); }
      else console.log(`      courir : le pouce au bord du joystick, ${vc.toFixed(0)} points par seconde, ${(vc / vm).toFixed(2)} fois la marche ; plus près du centre, la marche (${vm.toFixed(0)})`); }
    if (errors.length) { echecs++; [...new Set(errors)].slice(0, 8).forEach(e => console.log('  ERREUR ' + e)); }
    await p.close();
  }
  console.log(echecs ? `${echecs} échec(s).` : 'Tout ce que le jeu attend du joueur se voit et se touche.');
  await browser.close();
  process.exit(echecs ? 1 : 0);
})();
