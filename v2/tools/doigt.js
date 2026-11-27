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
     loin 844x390  : le même, téléphone en largeur — la manette y est posée sur la scène, et le pouce qui marche
                     doit passer à côté d'elle
   Dans les deux combats éprouvés à part (le groupe de Khâlid ; sa bataille déclarée, la Sérénité pleine), « Retour » à chaque
   pas — la cible, les Vertus, les Objets, la Sérénité, Ordonner et ses listes —, dans l'écran, hors de la manette, sous le
   doigt, et B qui revient d'un cran (2.19) ; « Fuir » n'y est pas.
   Sortie : une ligne par écran ; « INVISIBLE », « INACCESSIBLE » ou « BLOQUÉ » en cas d'échec ; code de sortie 1. */
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
      // chaque toucher que reçoit la manette est noté : un pouce qui voulait marcher ne doit jamais y tomber
      window.__pris = []; window.addEventListener('pointerdown', e => { const g = e.target; if (g && g.closest && g.closest('#pad')) window.__pris.push(String(g.className || g.tagName).trim()); }, true);
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
          // (2.19 : la deuxième commande de la liste principale — les Vertus ; dans la liste des Vertus, la première qui se prend : Éclairer)
          const vise = m ? c.querySelectorAll('.mlist.main .mi')[1] : [...c.querySelectorAll('.mi')].find(x => !x.hidden && !x.classList.contains('off')) || c.querySelector('.mi');
          return on('commande', vise, null, { ou, hors, commandes: m ? m.querySelectorAll('.mi').length : 0 }); }
        if (b && !b.hidden) return on('bandeau', b, null, { ou });
        return { quoi: 'attente', ou }; }
      if (vis(q('#dialog'))) return on('dialogue', q('#dialog'), [innerWidth / 2, Math.min(innerHeight - 6, q('#dialog').getBoundingClientRect().bottom + 30)], { ou }); // on touche sous la boîte, là où tombe le pouce
      if (I.scene === W && !I.script.busy && !W.lock && W.map) { const t = W.target && W.target(), c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect();
        if (!t) return { quoi: 'attente', ou };
        const x = (t.gx - Math.round(W.cam.x)) / G.PW * c.width + c.left, y = (t.gy - 6 - Math.round(W.cam.y)) / G.PH * c.height + c.top, bas = s.bottom - s.top > 300 ? 90 : 64;
        // le pouce vise la cible, ramenée dans la scène
        const pt = [Math.max(s.left + 14, Math.min(s.right - 14, x)), Math.max(s.top + bas, Math.min(s.bottom - 14, y))];
        // ni le plan, dans son coin : le toucher ouvre la carte — il vise juste en dessous
        if (W.miniRect) { const r = W.miniRect, l = c.left + r[0] / G.PW * c.width, t2 = c.top + r[1] / G.PH * c.height, d = l + r[2] / G.PW * c.width, b2 = t2 + r[3] / G.PH * c.height; if (pt[0] > l - 8 && pt[0] < d + 8 && pt[1] > t2 - 8 && pt[1] < b2 + 8) pt[1] = Math.min(s.bottom - 14, b2 + 12); }
        /* ni la manette (le joystick dans son carré, A, B) : elle prend aussi un toucher posé à côté d'elle, car Chromium,
           comme un téléphone, l'ajuste vers la commande la plus proche, jusqu'à une dizaine de points de son bord. En
           844 × 390, le pouce posé « juste au-dessus » de B tombait à 8 points de A, haussé au-dessus de B : A répondait,
           la marche s'arrêtait, et l'outil retouchait A sans fin (abubakr/ab1). Le pouce recule donc vers le héros, sur
           la ligne qui mène à la cible (la direction que lit le labyrinthe), jusqu'à seize points de la boîte de chaque
           commande ; jamais à moins de 32 points du héros, comptés sur la carte (se toucher soi-même, c'est agir devant
           soi, et le labyrinthe ne conduit vers l'objectif qu'un toucher posé à plus de 24 points). S'il n'y a pas de
           place, le toucher pris par la manette est relevé plus bas (« INACCESSIBLE »), au lieu d'un « BLOQUÉ » muet */
        const pads = [...document.querySelectorAll('#pad .dpad, #pad button')].filter(b => getComputedStyle(b).visibility !== 'hidden').map(b => b.getBoundingClientRect()).filter(r => r.width > 4);
        const libre = q => pads.every(r => q[0] < r.left - 16 || q[0] > r.right + 16 || q[1] < r.top - 16 || q[1] > r.bottom + 16);
        const hx = (W.player.x - Math.round(W.cam.x)) / G.PW * c.width + c.left, hy = (W.player.y - 6 - Math.round(W.cam.y)) / G.PH * c.height + c.top, p0 = pt.slice();
        for (let k = 19; k > 0 && !libre(pt); k--) { const q2 = [hx + (p0[0] - hx) * k / 20, hy + (p0[1] - hy) * k / 20]; if (Math.hypot((q2[0] - hx) / c.width * G.PW, (q2[1] - hy) / c.height * G.PH) < 32) break; pt[0] = q2[0]; pt[1] = q2[1]; }
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
      if (s.quoi === 'marche') await p.evaluate(() => { if (window.__pris) window.__pris.length = 0; });
      await p.touchscreen.tap(pt[0], pt[1]);
      // le pouce qui marche, pris par la manette (A, B, le joystick) : la marche s'arrête, et rien ne change jusqu'au « BLOQUÉ » — on le nomme
      if (s.quoi === 'marche') { const pr = await p.evaluate(() => (window.__pris || []).slice()); if (pr.length) { const m = 'INACCESSIBLE ' + w + '×' + h + ' : le pouce qui marche (' + pt.map(Math.round) + ') est pris par la manette (« ' + pr[0] + ' ») — ' + (s.ou || ''); if (!soucis.includes(m)) { soucis.push(m); await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-manette.png') }); } } }
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
      // (2.48 : le fil vidé, comme le fait la Chaîne quand on quitte un récit — sans elle, la même leçon s'y empilait à chaque
      // départ, partie remise à zéro, et la manette restait effacée trois fois trente secondes sur 360 × 560)
      const chapitre = async ci => { await p.evaluate(ci => { const I = window.ISNAD, W = I.world; I.script.filVide(); I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); W.roster = {}; W.saga = null; W.startChapter('khalid', ci); }, ci); // un groupe de trois : le panneau est plein
        for (let i = 0; i < 120 && !(await libre()); i++) { if (await lecture()) await p.keyboard.press('Enter'); await p.waitForTimeout(170); } };
      const commandes = async (quoi, n, nom, lancer) => { await p.evaluate(() => { const v = window.ISNAD.save.data.items; v.musc = Math.max(2, v.musc | 0); }); await p.evaluate(lancer); // (du musc dans la besace : les Objets et leur cible ont leur « Retour »)
        for (let i = 0; i < 160; i++) { const e = await p.evaluate(() => document.querySelector('.screen:not([hidden]) button, #choice:not([hidden]) .opt') ? 'prep' : !!document.querySelector('#battle .cmd .mlist.main .mi') && document.querySelector('#battle .banner').hidden ? 'cmd' : ['#card', '#dialog'].some(q => !document.querySelector(q).hidden) ? 'lit' : '');
          if (e === 'cmd') break; if (e) await p.keyboard.press('Enter'); await p.waitForTimeout(170); } // la page de préparation d'une idole, un carton : on les passe
        await p.waitForTimeout(300);
        const c = await p.evaluate(() => [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].filter(x => getComputedStyle(x).display !== 'none').map(x => { const q = x.getBoundingClientRect(), e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return { nom: x.querySelector('span').textContent.trim(), ok: q.top >= 0 && q.bottom <= innerHeight && !!e && x.contains(e) }; }));
        const hors = c.filter(x => !x.ok); if (c.length < n) { echecs++; console.log(`  INACCESSIBLE ${w}×${h} : ${quoi}, on ne voit que ${c.length} commande(s) sur ${n}`); }
        else if (hors.length) { echecs++; await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-' + nom + '.png') }); console.log(`  INACCESSIBLE ${w}×${h} : ${quoi}, ${hors.map(x => '« ' + x.nom + ' »').join(', ')} hors de l'écran ou sous un autre élément`); }
        else console.log(`      ${quoi}, les ${c.length} commandes (${c.map(x => x.nom.replace(/^\S+\s*/, '')).join(', ')}) : chacune dans l'écran, sous le doigt`);
        if (c.some(x => /Fuir/.test(x.nom))) { echecs++; console.log(`  INACCESSIBLE ${w}×${h} : ${quoi}, « Fuir » est offert là où l'on ne fuit pas`); }
        await retours(quoi, nom);
        await p.evaluate(() => { const I = window.ISNAD, W = I.world; try { I.battle.abort(W); I.script.depth = 0; W.lock = false; } catch (e) { /* refermé */ } }); await p.waitForTimeout(500); };
      /* 2.19 — « Retour », toujours (le décideur, 20 novembre : « vérifie qu'on a toujours possibilité de cliquer sur retour ») :
         à chaque pas du combat — la cible de « Frapper », les Vertus et la cible d'Éclairer, les Objets et la cible d'un objet,
         la Sérénité, Ordonner, les ordres d'un rang, la réserve mobile —, un « ◂ Retour » se voit, dans l'écran, hors de la
         manette, sous le doigt ; et B (le vrai bouton de la manette) revient d'un cran. Rien n'est dépensé : le tour reste. */
      const etape = () => p.evaluate(() => { const c = document.querySelector('#battle .cmd'); if (!c || !c.querySelector('.mi')) return ''; const t = ((c.querySelector('.mtitle') || {}).textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24); return (c.querySelector('.mhint') ? 'cible · ' : '') + (c.querySelector('.mlist.main') ? 'commandes' : t); });
      const unRetour = () => p.evaluate(() => { const L = [...document.querySelectorAll('#battle .cmd .mback')].filter(b => !b.hidden && b.getClientRects().length); if (!L.length) return { absent: true };
        const b = L[L.length - 1], r = b.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2), efface = document.body.classList.contains('pad-efface');
        const pads = efface ? [] : ['#pad .joy', '#pad .a', '#pad .b'].map(q => document.querySelector(q)).filter(q => q && q.getClientRects().length && getComputedStyle(q).visibility !== 'hidden').map(q => q.getBoundingClientRect());
        return { n: L.length, dedans: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, touche: !!e && b.contains(e), sous: pads.some(q => r.left < q.right - 1 && r.right > q.left + 1 && r.top < q.bottom - 1 && r.bottom > q.top + 1), r: [r.left, r.top, r.width, r.height].map(Math.round) }; });
      const toucherMi = async txt => { const q = await p.evaluate(t => { const b = [...document.querySelectorAll('#battle .cmd .mi')].find(x => !x.hidden && x.textContent.includes(t)); if (!b) return null; b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, txt);
        if (!q) return false; await p.waitForTimeout(300); await p.touchscreen.tap(q[0], q[1]); await p.waitForTimeout(450); return true; };
      const toucherB = async () => { const q = await p.evaluate(() => { const b = document.querySelector('#pad .b'); if (!b || document.body.classList.contains('pad-efface') || getComputedStyle(b).visibility === 'hidden' || !b.getClientRects().length) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
        if (q) await p.touchscreen.tap(q[0], q[1]); else await p.evaluate(() => window.ISNAD.input.emit('retour')); await p.waitForTimeout(450); return q ? 'B' : 'B (la manette s’efface sur cette page : son geste)'; };
      const retours = async (quoi, nom) => { const vus = [], rate = [];
        const pas = async (ou, versOu) => { const r = await unRetour(), avant = await etape();
          if (r.absent || !r.dedans || !r.touche || r.sous) { rate.push(`${ou} : ${r.absent ? 'aucun « Retour »' : !r.dedans ? 'le « Retour » sort de l’écran ' + r.r : r.sous ? 'le « Retour » est sous la manette ' + r.r : 'le « Retour » est recouvert ' + r.r}`); await p.screenshot({ path: path.join(out, `doigt-${w}x${h}-${nom}-retour-${rate.length}.png`) }); }
          const geste = await toucherB(), apres = await etape(); if (apres !== versOu) rate.push(`${ou} : ${geste} mène à « ${apres} » au lieu de « ${versOu} »`); else vus.push(ou); return apres === versOu; };
        const lim = await p.evaluate(() => { const C = window.ISNAD.battle.contexte(), h = C && C.active; return h && h.sakina >= 100 ? { nom: h.def.limit.name, vise: ['foe', 'ally'].includes(h.def.limit.target) } : null; });
        if (await toucherMi('Frapper')) await pas('la cible de « Frapper »', 'commandes');
        if (await toucherMi('Vertus')) { const t = await etape(); await pas('les Vertus', 'commandes');
          if (await toucherMi('Vertus') && await toucherMi('Éclairer')) { await pas('la cible d’Éclairer', t); await toucherB(); } }
        if (await toucherMi('Objets')) { const t = await etape(); await pas('les Objets', 'commandes');
          if (await toucherMi('Objets') && await toucherMi('Musc')) { await pas('la cible d’un objet', t); await toucherB(); } }
        if (lim && lim.vise && await toucherMi(lim.nom)) await pas('la cible de la Sérénité', 'commandes');
        if (await toucherMi('Ordonner')) { const t = await etape(); await pas('Ordonner', 'commandes');
          if (await toucherMi('Ordonner')) { const rg = await p.evaluate(() => { const b = document.querySelector('#battle .cmd .mlist .mi'); return b ? b.textContent.trim().slice(0, 6) : ''; }); if (rg && await toucherMi(rg)) { await pas('les ordres d’un rang', t); } await toucherB(); }
          const rm = await p.evaluate(() => window.ISNAD.D.MANOEUVRES.garde.name); if (await toucherMi('Ordonner') && await toucherMi(rm)) { await pas('la réserve mobile', t); await toucherB(); } else if (await etape() !== 'commandes') await toucherB(); }
        const fin = await etape(); if (fin !== 'commandes') rate.push(`à la fin, on est sur « ${fin} » et non sur les commandes`);
        if (rate.length) { echecs++; console.log(`  INACCESSIBLE ${w}×${h} : ${quoi}, « Retour » — ${rate.join(' ; ')}`); }
        else console.log(`      ${quoi}, « Retour » à chaque pas (${vus.join(', ')}) : dans l'écran, hors de la manette, sous le doigt ; B revient d'un cran`); };
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
      // 2.16 — courir (décideur, 19 novembre : « il faut que les personnages puissent courir ») ; 2.17 — « réserver le joystick
      // + B pour courir » : le joystick seul, même tiré au bord, fait marcher ; B tenu en même temps fait courir — 1,225 fois
      // plus vite qu'à la marche (« il va trop vite, diminue de 30 % » ; elle allait 1,75 fois plus vite). Mesuré dans la
      // direction la plus dégagée, le temps du jeu faisant foi : plus vite que la marche, mais pas plus d'une fois et un tiers.
      // B est tenu par un second pointeur (le premier, la souris, tient le joystick).
      const degage = await p.evaluate(() => { const W = window.ISNAD.world, P = W.player, ok = (x, y) => !(W.solidAt(x - 4, y - 5) || W.solidAt(x + 4, y - 5) || W.solidAt(x - 4, y) || W.solidAt(x + 4, y));
        return [[1, 0], [-1, 0], [0, 1], [0, -1]].map(v => { let n = 0; while (n < 140 && ok(P.x + v[0] * n, P.y + v[1] * n)) n += 2; return { v, n, x: P.x, y: P.y }; }).sort((a, b) => b.n - a.n)[0]; });
      const tenirB = on => p.evaluate(on => { const b = document.querySelector('#pad .b'); b.dispatchEvent(new PointerEvent(on ? 'pointerdown' : 'pointerup', { bubbles: true, cancelable: true, pointerId: 99, pointerType: 'touch', isPrimary: false })); }, on);
      /* 2.47 — le décideur, 27 novembre : « Les joystick et bouton peuvent disparaître de manière exceptionnelle pour laisser
         voir la scène à condition que le tactile fonctionne encore. » Sur un petit écran (360 × 560), une annonce du fil — une
         leçon qui paraît pendant qu'on marche — peut prendre la place de la manette, qui s'efface le temps qu'elle passe
         (body.pad-efface, ui.js) : la mesure de la course tombait alors à zéro, la marche ou la course selon l'instant. Chaque
         fois qu'on la trouve effacée, le toucher de la scène doit faire marcher Idris (sinon, « INACCESSIBLE ») ; la course se
         mesure une fois la manette revenue, et une mesure pendant laquelle elle s'est effacée est refaite. */
      const effacee = () => p.evaluate(() => document.body.classList.contains('pad-efface') ? ((window.ISNAD.ui.padSous || []).join(', ') || '?') : '');
      const effaces = [];
      const toucherQuandEfface = async sous => {
        const r = await p.evaluate(q => { const I = window.ISNAD, W = I.world, G = I.gfx, c = document.querySelector('#cv').getBoundingClientRect(), d = Math.max(24, Math.min(56, q.n - 10));
          W.player.x = q.x; W.player.y = q.y; W.dest = null; W.resetTrail(); W.updateCam(true);
          const wx = q.x + q.v[0] * d, wy = q.y + q.v[1] * d, x = (wx - Math.round(W.cam.x)) / G.PW * c.width + c.left, y = (wy - 6 - Math.round(W.cam.y)) / G.PH * c.height + c.top, e = document.elementFromPoint(x, y);
          return { x, y, sur: e ? (e.id || String(e.className || e.tagName).split(' ')[0]) : 'rien' }; }, degage);
        const lire = () => p.evaluate(() => [window.ISNAD.world.player.x, window.ISNAD.world.player.y]), a = await lire();
        await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(700); const b = await lire();
        const fait = (b[0] - a[0]) * degage.v[0] + (b[1] - a[1]) * degage.v[1];
        await p.evaluate(() => { window.ISNAD.world.dest = null; });
        for (let i = 0; i < 40 && !(await libre()); i++) { if (await lecture()) await p.keyboard.press('Enter'); await p.waitForTimeout(170); }   // (un toucher tombé sur quelqu'un lui parle : on referme)
        effaces.push({ sous, fait, sur: r.sur });
        if (fait <= 6) { echecs++; await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-efface.png') }); console.log(`  INACCESSIBLE ${w}×${h} : la manette s'efface (sous ${sous}) et le toucher de la scène ne fait pas marcher Idris (touché sur ${r.sur}, ${fait.toFixed(0)} points)`); } };
      /* 2.48 — une leçon reste jusqu'à ce que son outil ait resservi, trente secondes de lecture au plus (script.js, tic) : la
         manette peut donc rester effacée près de trente secondes (« Une autre figure s'ouvre à Khâlid », sur 360 × 560). On
         l'attend quarante-cinq secondes, à l'horloge, plus que la plus longue leçon ; au-delà, c'est un défaut, dit comme tel. */
      let jamaisRevenue = '', plusLong = 0; const annonces = new Set();
      const annonce = () => p.evaluate(() => [...document.querySelectorAll('#toasts.montre > .toast:not([hidden])')].map(e => e.textContent.trim().slice(0, 70)).join(' · '));
      const attendreManette = async () => { const t0 = Date.now(); while (Date.now() - t0 < 45000) { const s = await effacee(); if (!s) { plusLong = Math.max(plusLong, Date.now() - t0); return true; } const a = await annonce(); if (a) annonces.add(a); if (!effaces.some(e => e.sous === s)) await toucherQuandEfface(s); await p.waitForTimeout(250); }
        jamaisRevenue = (await effacee()) || '?'; return false; };
      const vitesse = async (f, avecB) => { for (let essai = 0; essai < 4; essai++) {
        if (!(await attendreManette())) return 0;
        await p.evaluate(q => { const W = window.ISNAD.world; W.player.x = q.x; W.player.y = q.y; W.dest = null; W.resetTrail(); }, degage);
        if (avecB) { await tenirB(true); await p.waitForTimeout(60); }
        await p.mouse.move(joy.x, joy.y); await p.mouse.down(); await p.mouse.move(joy.x + degage.v[0] * joy.r * f, joy.y + degage.v[1] * joy.r * f, { steps: 4 }); await p.waitForTimeout(120);
        const lire = () => p.evaluate(() => { const W = window.ISNAD.world; return [W.player.x, W.player.y, W.t]; }), a = await lire(), e1 = await effacee(); await p.waitForTimeout(300); const b = await lire(), e2 = await effacee();
        await p.mouse.up(); if (avecB) await tenirB(false); await p.waitForTimeout(250);
        if (!e1 && !e2) return Math.hypot(b[0] - a[0], b[1] - a[1]) / Math.max(0.01, b[2] - a[2]); }   // (effacée pendant la mesure : on la refait)
        return 0; };
      const vm = await vitesse(0.6, false), vb = await vitesse(0.97, false), vc = await vitesse(0.97, true);
      for (const e of effaces) if (e.fait > 6) console.log(`      la manette s'efface un instant (sous ${e.sous}${plusLong > 2000 ? ', revenue au plus tard en ' + Math.round(plusLong / 1000) + ' s' : ''}) : le toucher de la scène fait marcher Idris (${e.fait.toFixed(0)} points)${annonces.size ? ' — ' + [...annonces].map(a => '« ' + a + ' »').join(', ') : ''}`);
      if (jamaisRevenue) { echecs++; await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-efface-longtemps.png') }); console.log(`  INACCESSIBLE ${w}×${h} : la manette reste effacée plus de quarante-cinq secondes (sous ${jamaisRevenue}) — annonces vues : ${[...annonces].map(a => '« ' + a + ' »').join(', ')}`); }
      else if (!(vm > 70 && vm < 94 && Math.abs(vb - vm) < 0.08 * vm && vc > 1.15 * vm && vc < 1.33 * vm)) { echecs++; await p.screenshot({ path: path.join(out, 'doigt-' + w + 'x' + h + '-course.png') }); console.log(`  INACCESSIBLE ${w}×${h} : courir — joystick au milieu ${vm.toFixed(0)} points par seconde, au bord sans B ${vb.toFixed(0)}, au bord avec B tenu ${vc.toFixed(0)} (dégagé sur ${degage.n} points)`); }
      else console.log(`      courir : le joystick avec B tenu, ${vc.toFixed(0)} points par seconde, ${(vc / vm).toFixed(2)} fois la marche ; le joystick seul, même au bord, la marche (${vm.toFixed(0)}, ${vb.toFixed(0)})`); }
    if (errors.length) { echecs++; [...new Set(errors)].slice(0, 8).forEach(e => console.log('  ERREUR ' + e)); }
    await p.close();
  }
  console.log(echecs ? `${echecs} échec(s).` : 'Tout ce que le jeu attend du joueur se voit et se touche.');
  await browser.close();
  process.exit(echecs ? 1 : 0);
})();
