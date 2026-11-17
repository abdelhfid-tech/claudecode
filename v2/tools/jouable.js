#!/usr/bin/env node
/* ISNAD 2.x — la démo jouable : une quarantaine de secondes du vrai jeu, dans un seul fichier.
   Usage : node v2/tools/jouable.js           assemble promo/jouable/jouable.html
           node v2/tools/jouable.js essai     l'assemble, puis la joue au doigt de bout en bout, en hauteur et en largeur
   Le fichier est le jeu assemblé (v2/index.html) auquel s'ajoutent trois choses :
     · un préambule : les parties tiennent en mémoire, rien n'est lu ni écrit sur l'appareil ;
     · promo/jouable/demarrage.css et demarrage.js : par où l'on entre, la consigne, le carton final.
   Le jeu n'est pas modifié. L'adresse du bouton « Jouer » vient de v2/tools/promotion.js.
   L'essai écrit « OK » par preuve, puis « JOUABLE CONFORME ». Sinon « INVISIBLE » (un bouton que l'on ne voit pas),
   « BLOQUÉ » (la démo n'arrive pas au bout), « ÉCART » (une sauvegarde touchée, une requête au-dehors, une sortie mal
   branchée). Captures dans v2/.smoke/jouable. */
const fs = require('fs'), path = require('path');
const P = require('./promotion.js');
const V2 = path.join(__dirname, '..'), RACINE = path.join(V2, '..'), DOS = path.join(RACINE, 'promo/jouable'), SORTIE = path.join(DOS, 'jouable.html');

function assembler() {
  let html = fs.readFileSync(path.join(V2, 'index.html'), 'utf8');
  const mettre = s => s.split('__ADRESSE__').join(P.ADRESSE).split('__DEVISE__').join(P.DEVISE).split('__ETAT__').join(P.ETAT);
  const js = mettre(fs.readFileSync(path.join(DOS, 'demarrage.js'), 'utf8')), css = fs.readFileSync(path.join(DOS, 'demarrage.css'), 'utf8');
  const i = html.indexOf('<script>'), j = html.lastIndexOf('</script>');
  if (i < 0 || j < i || html.indexOf('<script>', i + 1) >= 0) throw new Error('le jeu assemblé n’a pas la forme attendue (un seul script)');
  const preambule = '<script>\n/* démo : rien n’est lu ni écrit sur l’appareil — les parties tiennent en mémoire, le temps de la démo */\n(function () { var m = {}; try { var S = Storage.prototype; S.getItem = function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; }; S.setItem = function (k, v) { m[k] = String(v); }; S.removeItem = function (k) { delete m[k]; }; S.clear = function () { m = {}; }; } catch (e) { /* sans stockage : rien à détourner */ } window.ISNAD_DEMO_MEMOIRE = function () { return Object.keys(m); }; })();\n</script>\n';
  html = html.slice(0, i) + preambule + html.slice(i, j + 9) + '\n<style>\n' + css + '</style>\n<script>\n' + js + '</script>' + html.slice(j + 9);
  html = html.replace(/<title>[^<]*<\/title>/, '<title>Démo ' + P.NOM + '</title>');
  fs.mkdirSync(DOS, { recursive: true }); fs.writeFileSync(SORTIE, html);
  return html.length;
}

async function essai() {
  const { chromium, devices } = require('playwright');
  const out = path.join(V2, '.smoke/jouable'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); let anomalies = 0;
  const dit = (v, mot, m) => { if (!v) anomalies++; console.log((v ? 'OK  ' : mot + ' ') + m); };
  for (const [nom, cle, vp] of [['en hauteur', 'haut', { width: 390, height: 760 }], ['en largeur', 'large', { width: 844, height: 390 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }), p = await ctx.newPage(), erreurs = [], dehors = [];
    p.on('pageerror', e => erreurs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });
    p.on('request', r => { const u = r.url(); if (!/^(file|data|blob):|^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u)) dehors.push(u); });
    await p.goto('file://' + SORTIE); await p.waitForFunction(() => window.ISNAD_DEMO && window.ISNAD_DEMO.etape === 'accueil', null, { timeout: 15000 }); await p.waitForTimeout(500);
    const shot = n => p.screenshot({ path: path.join(out, `${cle}-${n}.png`) }), etape = () => p.evaluate(() => window.ISNAD_DEMO.etape);
    const visible = async sel => p.evaluate(sel => { const e = document.querySelector(sel); if (!e) return false; const r = e.getBoundingClientRect(), st = getComputedStyle(e); return st.display !== 'none' && st.visibility !== 'hidden' && r.width > 20 && r.height > 20 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth; }, sel);
    // 1. l'accueil
    dit(await visible('#demo-go') && await p.evaluate(() => getComputedStyle(document.querySelector('#title .vmenu')).display === 'none'), 'INVISIBLE', `${nom} · l’accueil : « Commencer » se voit, le menu du jeu n’y est pas`);
    await shot('1-accueil'); const t0 = Date.now(); await p.locator('#demo-go').tap();
    // 2. le labyrinthe : toucher ce qui rôde jusqu'à en dissiper un
    await p.waitForFunction(() => window.ISNAD_DEMO.etape === 'labyrinthe' && !!document.querySelector('.demo-consigne'), null, { timeout: 25000 }).catch(() => {});
    dit(await etape() === 'labyrinthe', 'BLOQUÉ', `${nom} · le labyrinthe s’ouvre, la consigne se lit : « ${(await p.evaluate(() => (document.querySelector('.demo-consigne') || {}).textContent || '')).slice(0, 60)} »`);
    await p.waitForTimeout(400); await shot('2-labyrinthe');
    let touches = 0;
    for (let i = 0; i < 60 && await etape() === 'labyrinthe'; i++) {
      const q = await p.evaluate(() => { const I = window.ISNAD, W = I.world, G = I.gfx, U = I.ui; if (I.battle.active || I.script.busy) return null; const P = W.player, l = I.rodeurs.rodent().map(f => [f, Math.hypot(f.x - P.x, f.y - P.y)]).sort((a, b) => a[1] - b[1]); if (!l.length) return null;
        const f = l[0][0], st = document.getElementById('stage').getBoundingClientRect(); return { x: st.left + (f.x - G.cale(W.cam.x) - G.view.x) * U.scale, y: st.top + (f.y - 10 - G.cale(W.cam.y) - G.view.y) * U.scale, g: st.left, h: st.top, d: st.right, b: st.bottom }; });
      if (q && q.x > q.g + 6 && q.x < q.d - 6 && q.y > q.h + 6 && q.y < q.b - 6) { await p.touchscreen.tap(q.x, q.y); touches++; }
      await p.waitForTimeout(300);
    }
    const lab = await p.evaluate(() => ({ dissipe: !!window.ISNAD_DEMO.dissipe, journal: window.ISNAD_DEMO.journal.slice() }));
    dit(lab.dissipe, 'BLOQUÉ', `${nom} · ce qui rôde se touche et se dissipe (${touches} touchers) — ${lab.journal.join(' · ')}`);
    // 3. le combat : « Frapper », puis l'égrégore ; le carton de victoire se touche
    await p.waitForFunction(() => ['combat', 'fin'].includes(window.ISNAD_DEMO.etape), null, { timeout: 25000 }).catch(() => {});
    let vuCombat = false;
    for (let i = 0; i < 90 && await etape() === 'combat'; i++) {
      const quoi = await p.evaluate(() => { const c = document.querySelector('#card'), bn = document.querySelector('#battle .banner'); if (c && !c.hidden) return 'carton'; if (bn && !bn.hidden && !document.querySelector('#battle .cmd .mi')) return 'bandeau'; const L = [...document.querySelectorAll('#battle .cmd .mi')]; if (!L.length) return 'attente'; return /Frapper/.test(L[0].textContent) ? 'commandes' : 'cible'; });
      if (quoi === 'commandes') { if (!vuCombat) { vuCombat = true; await shot('3-combat'); dit(await visible('#battle .cmd .mi'), 'INVISIBLE', `${nom} · le combat : « Frapper » se voit`); } await p.locator('#battle .cmd .mi').first().tap(); }
      else if (quoi === 'cible') await p.locator('#battle .plates .plate').first().tap().catch(() => {});
      else if (quoi === 'carton') await p.locator('#card').tap().catch(() => {});
      else if (quoi === 'bandeau') await p.locator('#battle .banner').tap().catch(() => {});
      await p.waitForTimeout(350);
    }
    // 4. le carton final
    await p.waitForFunction(() => window.ISNAD_DEMO.etape === 'fin', null, { timeout: 30000 }).catch(() => {});
    const duree = (Date.now() - t0) / 1000;
    dit(await etape() === 'fin', 'BLOQUÉ', `${nom} · la démo va jusqu’au carton final, en ${duree.toFixed(0)} s — ${(await p.evaluate(() => window.ISNAD_DEMO.journal.join(' · ')))}`);
    await p.waitForTimeout(600); await shot('4-fin');
    const fin = await p.evaluate(() => { const a = document.querySelector('#demo-jouer'); return { href: a && a.getAttribute('href'), texte: [...document.querySelectorAll('.demo-carte > *')].map(e => e.textContent.trim()) }; });
    dit(await visible('#demo-jouer') && fin.href === 'https://' + P.ADRESSE, 'INVISIBLE', `${nom} · le carton final : ${fin.texte.join(' · ')} → ${fin.href}`);
    // la sortie passe par une seule fonction : une régie branchée la reçoit
    await p.evaluate(() => { window.mraid = { open: u => { window.__ouvert = u; } }; }); await p.locator('#demo-jouer').tap(); await p.waitForTimeout(300);
    dit(await p.evaluate(() => window.__ouvert) === 'https://' + P.ADRESSE, 'ÉCART', `${nom} · « Jouer » passe par la sortie unique (une régie branchée reçoit l’adresse)`);
    // rien d'écrit sur l'appareil, rien demandé au-dehors
    const mem = await p.evaluate(() => ({ vrai: window.localStorage.length, memoire: window.ISNAD_DEMO_MEMOIRE().length }));
    dit(mem.vrai === 0, 'ÉCART', `${nom} · aucune partie n’est écrite sur l’appareil (${mem.memoire} clé(s) gardée(s) en mémoire, 0 sur l’appareil)`);
    dit(!dehors.length, 'ÉCART', `${nom} · aucune requête hors des polices${dehors.length ? ' — ' + dehors.slice(0, 3).join(' | ') : ''}`);
    dit(!erreurs.length, 'ÉCART', `${nom} · aucune erreur${erreurs.length ? ' — ' + [...new Set(erreurs)].slice(0, 3).join(' | ').slice(0, 300) : ''}`);
    await ctx.close();
  }
  await b.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ JOUABLE CONFORME — la démo se joue au doigt de bout en bout (captures dans v2/.smoke/jouable)');
  return anomalies;
}

(async () => {
  const octets = assembler();
  console.log(`✓ ${path.relative(RACINE, SORTIE)} — ${(octets / 1e6).toFixed(2)} Mo, un seul fichier`);
  if (process.argv.includes('essai')) process.exit(await essai() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
