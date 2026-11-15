#!/usr/bin/env node
/* Le prologue joué au doigt, comme un joueur : aucun raccourci de test, aucune avance automatique.
   À chaque attente du jeu, l'outil regarde l'écran avant de toucher : ce que le joueur doit lire ou toucher
   est-il visible (dans l'écran, ni vide, ni transparent, ni sous le noir d'un fondu) ?
   Les parcours de tools/smoke.js prouvent que le récit se déroule ; celui-ci prouve qu'il se voit.
   Usage : node tools/doigt.js [largeurxhauteur ...]   (par défaut : deux téléphones en hauteur, un en largeur)
   Sortie : une ligne par écran ; « INVISIBLE » ou « BLOQUÉ » en cas d'échec ; code de sortie 1. */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const url = 'file://' + path.join(__dirname, '../index.html');
const out = path.join(__dirname, '../.smoke'); fs.mkdirSync(out, { recursive: true });
const tailles = process.argv.slice(2).length ? process.argv.slice(2).map(t => t.split('x').map(Number)) : [[390, 844], [360, 560], [844, 390]];

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  let echecs = 0;
  for (const [w, h] of tailles) {
    const errors = [], soucis = [];
    const p = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true, isMobile: true })).newPage();
    p.on('pageerror', e => errors.push('pageerror: ' + e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForTimeout(1800);
    await p.evaluate(() => { const I = window.ISNAD, oc = I.ui.showChain; I.ui.showChain = function () { window.__chaine = true; return oc.apply(this, arguments); };
      // chaque menu de choix qui s'ouvre est compté : s'il se referme sans que l'outil l'ait touché, un toucher fantôme a répondu à la place du joueur
      window.__menus = 0; const c = document.querySelector('#choice'); new MutationObserver(() => { if (!c.hidden && !c._vu) { c._vu = true; window.__menus++; } else if (c.hidden) c._vu = false; }).observe(c, { attributes: true, attributeFilter: ['hidden'] }); });
    // ce que le jeu attend, où toucher, et si cela se voit
    const etat = () => p.evaluate(() => {
      const I = window.ISNAD, W = I.world, G = I.gfx, q = s => document.querySelector(s), vis = e => !!e && !e.hidden;
      const z = e => +getComputedStyle(e).zIndex || 0, f = q('#fade');
      const voir = e => { const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return 'vide';
        if (r.bottom < 8 || r.top > innerHeight - 8 || r.right < 8 || r.left > innerWidth - 8) return 'hors de l’écran';
        if (+getComputedStyle(f).opacity > 0.5 && z(e) <= z(f)) return 'sous le noir du fondu'; if (+getComputedStyle(e).opacity < 0.3) return 'transparent'; return ''; };
      const mid = e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, Math.min(innerHeight - 6, r.top + r.height / 2)]; };
      const on = (quoi, e, pt) => ({ quoi, pt: pt || mid(e), souci: voir(e), texte: (e.textContent || '').trim().slice(0, 44) });
      if (window.__chaine) return { quoi: 'chaine' };
      if (vis(q('#title'))) return on('titre', q('#title .vmenu button'));
      if (vis(q('#card')) && q('#card').classList.contains('on')) return on('carton', q('#card'), [innerWidth / 2, innerHeight * 0.8]);
      if (vis(q('#choice'))) { const o = [...q('#choice').querySelectorAll('.opt:not(.locked)')]; return on('choix', o[o.length - 1]); }
      if (I.battle.active) { const c = q('#battle .cmd'), b = q('#battle .banner');
        if (c && c.querySelector('.mhint')) { const pl = q('.plate'); return pl ? on('cible', pl) : { quoi: 'attente' }; }
        if (c && c.querySelectorAll('.mi').length && !(b && !b.hidden)) return on('commande', c.querySelectorAll('.mi')[1]);
        if (b && !b.hidden) return on('bandeau', b);
        return { quoi: 'attente' }; }
      if (vis(q('#dialog'))) return on('dialogue', q('#dialog'), [innerWidth / 2, Math.min(innerHeight - 6, q('#dialog').getBoundingClientRect().bottom + 30)]); // on touche sous la boîte, là où tombe le pouce
      if (I.scene === W && !I.script.busy && !W.lock && W.map) { const t = W.target && W.target(), c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect();
        if (!t) return { quoi: 'attente' };
        const x = (t.gx - Math.round(W.cam.x)) / G.PW * c.width + c.left, y = (t.gy - Math.round(W.cam.y)) / G.PH * c.height + c.top;
        return { quoi: 'marche', pt: [Math.max(s.left + 14, Math.min(s.right - 14, x)), Math.max(s.top + 64, Math.min(s.bottom - 14, y))], souci: +getComputedStyle(f).opacity > 0.5 ? 'scène sous le noir du fondu' : '', texte: 'objectif ' + W.objIndex }; }
      return { quoi: 'attente' };
    });
    const t0 = Date.now(), compte = {}; let fini = false, dernier = '', depuis = Date.now();
    while (Date.now() - t0 < 240000) {
      const s = await etat();
      if (s.quoi === 'chaine') { fini = true; break; }
      const cle = s.quoi + '|' + (s.texte || ''); if (cle !== dernier) { dernier = cle; depuis = Date.now(); }
      if (Date.now() - depuis > 45000) break; // plus rien ne change : bloqué
      if (s.quoi === 'attente') { await p.waitForTimeout(250); continue; }
      if (s.souci) { // un fondu d'apparition n'est pas un défaut : on regarde de nouveau avant de conclure
        await p.waitForTimeout(700); const s2 = await etat(); if (s2.quoi !== s.quoi || s2.texte !== s.texte) continue;
        if (s2.souci) { const m = s.quoi + ' ' + s2.souci + ' : « ' + s.texte + ' »'; if (!soucis.includes(m)) { soucis.push(m); await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-' + soucis.length + '.png') }); } } }
      compte[s.quoi] = (compte[s.quoi] || 0) + 1;
      await p.touchscreen.tap(s.pt[0], s.pt[1]);
      await p.waitForTimeout(s.quoi === 'marche' ? 850 : 430);
    }
    const resume = Object.keys(compte).map(k => k + ' ' + compte[k]).join(', '), menus = await p.evaluate(() => window.__menus);
    if (menus > (compte.choix || 0)) soucis.push('un menu de choix a été répondu sans avoir été touché (' + menus + ' ouverts, ' + (compte.choix || 0) + ' touchés) : toucher fantôme');
    if (!fini) { echecs++; const s = await etat(); await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-bloque.png') }); console.log(`BLOQUÉ au doigt ${w}×${h} — le jeu attend : ${s.quoi}${s.texte ? ' « ' + s.texte + ' »' : ''} (${resume})`); }
    else console.log(`OK  au doigt ${w}×${h} — prologue terminé en ${((Date.now() - t0) / 1000).toFixed(0)} s (${resume})`);
    soucis.forEach(m => { echecs++; console.log('  INVISIBLE ' + m); });
    if (errors.length) { echecs++; [...new Set(errors)].slice(0, 8).forEach(e => console.log('  ERREUR ' + e)); }
    await p.close();
  }
  console.log(echecs ? `${echecs} échec(s).` : 'Tout ce que le jeu attend du joueur se voit et se touche.');
  await browser.close();
  process.exit(echecs ? 1 : 0);
})();
