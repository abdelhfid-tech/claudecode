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
        if (c && c.querySelector('.mhint')) { const pl = q('.plate'); return pl ? on('cible', pl, null, { ou }) : { quoi: 'attente', ou }; }
        if (c && c.querySelectorAll('.mi').length && !(b && !b.hidden)) return on('commande', c.querySelectorAll('.mi')[1], null, { ou });
        if (b && !b.hidden) return on('bandeau', b, null, { ou });
        return { quoi: 'attente', ou }; }
      if (vis(q('#dialog'))) return on('dialogue', q('#dialog'), [innerWidth / 2, Math.min(innerHeight - 6, q('#dialog').getBoundingClientRect().bottom + 30)], { ou }); // on touche sous la boîte, là où tombe le pouce
      if (I.scene === W && !I.script.busy && !W.lock && W.map) { const t = W.target && W.target(), c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect();
        if (!t) return { quoi: 'attente', ou };
        const x = (t.gx - Math.round(W.cam.x)) / G.PW * c.width + c.left, y = (t.gy - 6 - Math.round(W.cam.y)) / G.PH * c.height + c.top, bas = s.bottom - s.top > 300 ? 90 : 64;
        return { quoi: 'marche', ou, pt: [Math.max(s.left + 14, Math.min(s.right - 14, x)), Math.max(s.top + bas, Math.min(s.bottom - 14, y))], souci: +getComputedStyle(f).opacity > 0.5 ? 'scène sous le noir du fondu' : '', texte: 'objectif ' + W.objIndex, pos: Math.round(W.player.x) + ',' + Math.round(W.player.y) }; }
      return { quoi: 'attente', ou };
    });
    const t0 = Date.now(), compte = {}, tours = {}, limite = loin ? 900000 : 240000; let fini = false, dernier = '', depuis = Date.now(), prologue = 0, lieu = '';
    while (Date.now() - t0 < limite) {
      const s = await etat(); if (s.ou) lieu = s.ou;
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
      let pt = s.pt;
      if (s.quoi === 'choix' && s.rects && s.rects.length) { const k = s.prompt + '|' + s.n, i = tours[k] = (tours[k] === undefined ? s.n - 1 : (tours[k] + s.n - 1) % s.n); pt = s.rects[Math.min(i, s.rects.length - 1)]; } // une mauvaise réponse revient : on en essaie une autre
      await p.touchscreen.tap(pt[0], pt[1]);
      await p.waitForTimeout(s.quoi === 'marche' ? 850 : s.quoi === 'chaine' ? 1200 : 430);
    }
    const resume = Object.keys(compte).map(k => k + ' ' + compte[k]).join(', '), menus = await p.evaluate(() => window.__menus), quoi = loin ? 'prologue et premier chapitre de la saga I terminés' : 'prologue terminé';
    if (menus > (compte.choix || 0)) soucis.push('un menu de choix a été répondu sans avoir été touché (' + menus + ' ouverts, ' + (compte.choix || 0) + ' touchés) : toucher fantôme');
    if (!fini) { echecs++; const s = await etat(); await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-bloque.png') }); console.log(`BLOQUÉ au doigt ${w}×${h} — ${lieu || 'avant la partie'} — le jeu attend : ${s.quoi}${s.texte ? ' « ' + s.texte + ' »' : ''} (${resume})`); }
    else console.log(`OK  au doigt ${w}×${h} — ${quoi} en ${((Date.now() - t0) / 1000).toFixed(0)} s${loin && prologue ? ' (prologue : ' + (prologue / 1000).toFixed(0) + ' s)' : ''} (${resume})`);
    soucis.forEach(m => { echecs++; console.log('  INVISIBLE ' + m); });
    if (errors.length) { echecs++; [...new Set(errors)].slice(0, 8).forEach(e => console.log('  ERREUR ' + e)); }
    await p.close();
  }
  console.log(echecs ? `${echecs} échec(s).` : 'Tout ce que le jeu attend du joueur se voit et se touche.');
  await browser.close();
  process.exit(echecs ? 1 : 0);
})();
