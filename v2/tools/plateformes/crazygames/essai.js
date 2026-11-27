#!/usr/bin/env node
/* ISNAD 2.x — CrazyGames « Basic Launch » : l'essai du paquet (node v2/tools/plateformes/crazygames/essai.js).
   Le paquet est relu dans le zip, servi par un petit serveur local et joué dans un cadre <iframe> d'une AUTRE origine (deux
   serveurs : la page hôte, le jeu), en 960 × 540, 390 × 844 et 844 × 390 (tactile). Preuves, par taille :
     · le jeu s'ouvre en anglais (rien de choisi), le français et l'arabe se choisissent par les vrais boutons, et le choix
       gardé l'emporte au rechargement ;
     · aucun bouton plein écran (celui de la scène, le réglage des Réglages, la demande au premier toucher) ;
     · aucune requête au-dehors (seules les deux origines locales, data: et blob:), aucune erreur console ;
     · le nombre de touchers, depuis l'écran-titre, pour qu'une partie neuve commence (compté, pas supposé) ;
     · user-select: none sur le corps ; le stockage refusé (le jeu s'ouvre, en français : dit, rien n'est corrigé).
   « OK » par preuve, « ÉCART » sinon, « · » pour ce qui est constaté sans être une faute. Un seul navigateur. */
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const C = require('../commun.js');

(async () => {
  const { chromium, devices } = require('playwright');
  await require('../crazygames.js').faire(C);
  const zip = fs.readdirSync(path.join(C.SORTIE, 'crazygames')).filter(f => f.endsWith('.zip')).map(f => path.join(C.SORTIE, 'crazygames', f))[0];
  const L = C.lireZip(fs.readFileSync(zip)), html = L.find(e => e.nom === 'index.html').donnees;
  const out = path.join(C.V2, '.smoke/plateformes/crazygames'); fs.mkdirSync(out, { recursive: true });
  let anomalies = 0; const dit = (v, m) => { if (!v) anomalies++; console.log((v ? 'OK  ' : 'ÉCART ') + m); }, note = m => console.log('·   ' + m);
  console.log('— essai du paquet crazygames : ' + path.relative(C.RACINE, zip) + ` (${L.map(e => e.nom).join(', ')} ; ${C.mo(fs.statSync(zip).size)})`);
  dit(L.length === 1 && L[0].nom === 'index.html', 'le zip ne contient que index.html, à sa racine');

  const servir = pages => new Promise(res => { const s = http.createServer((q, r) => { const u = q.url.split('?')[0], f = pages[u === '/' ? '/index.html' : u]; if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); r.end(f); }); s.listen(0, '127.0.0.1', () => res(s)); });
  const jeu = await servir({ '/index.html': html }), oJeu = 'http://localhost:' + jeu.address().port;
  const hote = await servir({ '/index.html': `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>hôte</title><style>html,body{margin:0;height:100%;background:#222}iframe{border:0;width:100vw;height:100vh;display:block}</style><iframe id="jeu" src="${oJeu}/index.html" allow="autoplay"></iframe>` }), oHote = 'http://127.0.0.1:' + hote.address().port;
  note(`cadre : l'hôte sur ${oHote}, le jeu sur ${oJeu} (deux sites différents) ; le cadre n'a ni « allowfullscreen » ni SDK`);

  const b = await chromium.launch();
  try {
    const ouvrir = async (vp, o) => { o = o || {};
      const tactile = vp.width < 900 && vp.height < 900;
      const ctx = o.ctx || await b.newContext(Object.assign({ viewport: vp }, tactile ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2, userAgent: devices['iPhone 13'].userAgent } : {}));
      if (o.sansStockage) await ctx.addInitScript(port => { if (location.port === String(port)) { const refus = () => { throw new DOMException('refusé', 'SecurityError'); }; Object.defineProperty(window, 'localStorage', { configurable: true, get: refus }); } }, jeu.address().port);
      // le jeu ne doit jamais demander le plein écran : on guette l'appel
      await ctx.addInitScript(port => { if (location.port === String(port)) { window.__plein = 0; ['requestFullscreen', 'webkitRequestFullscreen'].forEach(k => { const e = Element.prototype[k]; if (e) Element.prototype[k] = function () { window.__plein++; return e.apply(this, arguments); }; }); } }, jeu.address().port);
      const p = await ctx.newPage(), erreurs = [], dehors = [];
      p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
      p.on('request', r => { const u = r.url(); if (!u.startsWith(oHote) && !u.startsWith(oJeu) && !/^(data|blob|about):/.test(u)) dehors.push(u); });
      await p.goto(oHote + '/index.html');
      const X = { ctx, p, tactile, erreurs, dehors, touchers: 0, f: null };
      X.cadre = async () => { for (let i = 0; i < 100; i++) { const f = p.frames().find(x => x.url().startsWith(oJeu)); if (f) return (X.f = f); await p.waitForTimeout(100); } throw new Error('cadre'); };
      X.titre = async () => { const f = await X.cadre(); await f.waitForFunction(() => window.ISNAD && !document.querySelector('#title').hidden && document.querySelectorAll('#title .vmenu button').length > 0, null, { timeout: 25000 }); await X.p.waitForTimeout(900); };
      X.toucher = async (sel, texte) => { const l = X.f.locator(sel, texte ? { hasText: texte } : undefined).first(); await l.waitFor({ state: 'visible', timeout: 10000 }); if (tactile) await l.tap(); else await l.click(); X.touchers++; };
      X.code = () => X.f.evaluate(() => window.ISNAD.langue.code());
      X.boutons = () => X.f.evaluate(() => [...document.querySelectorAll('#title .vmenu button')].map(x => x.textContent.trim()));
      await X.titre(); return X; };

    for (const [nom, vp] of [['960 × 540', { width: 960, height: 540 }], ['390 × 844', { width: 390, height: 844 }], ['844 × 390', { width: 844, height: 390 }]]) {
      const X = await ouvrir(vp), cle = nom.replace(/ × /, 'x');
      const t0 = await X.f.evaluate(() => ({ code: window.ISNAD.langue.code(), btns: [...document.querySelectorAll('#title .vmenu button')].map(x => x.textContent.trim()), lang: document.documentElement.lang, us: getComputedStyle(document.body).userSelect, fe: document.fullscreenEnabled, w: innerWidth, h: innerHeight, touch: document.body.classList.contains('touch'), immersif: document.body.classList.contains('immersif') }));
      dit(t0.code === 'en', `${nom} : le jeu s'ouvre en anglais, rien n'étant choisi (langue « ${t0.code} », html lang « ${t0.lang} ») — boutons : ${t0.btns.map(x => '« ' + x.slice(0, 22) + ' »').join(' ')}`);
      dit(t0.us === 'none' && t0.fe === false, `${nom} : user-select: none sur le corps (${t0.us}) ; document.fullscreenEnabled = ${t0.fe} pour le jeu`);
      await X.p.screenshot({ path: path.join(out, `titre-en-${cle}.png`) });
      // les langues : le français et l'arabe par les vrais boutons, puis l'anglais de nouveau
      const choisir = async (texte, code) => { await X.toucher('#title .vmenu button', texte); await X.f.waitForFunction(c => window.ISNAD.langue.code() === c, code, { timeout: 5000 }).catch(() => {}); return X.code(); };
      const bl = await X.boutons(); note(`${nom} : l'écran-titre offre ${bl.map(x => '« ' + x.slice(0, 26) + ' »').join(', ')}`);
      let langueBtn = bl.find(x => /Language|Langue/i.test(x));
      const ouvrirLangues = async () => { if (langueBtn) await X.toucher('#title .vmenu button', langueBtn.slice(0, 8)); };
      await ouvrirLangues();
      const choix = await X.boutons(); const aBtn = (re) => choix.find(x => re.test(x));
      const fr = aBtn(/Fran[cç]ais/), ar = aBtn(/^العربية$|العربية(?!.*ا)/), arv = aBtn(/العَرَبِيَّة/);
      dit(!!fr && !!choix.find(x => /العربية/.test(x)), `${nom} : le français et l'arabe se proposent (« ${choix.map(x => x.slice(0, 20)).join(' | ')} »)`);
      let c = await choisir(fr || 'Français', 'fr'); dit(c === 'fr', `${nom} : « Français » choisi par le vrai bouton → langue ${c}`);
      await X.f.waitForTimeout(300); await X.f.evaluate(() => location.reload()); await X.titre();
      c = await X.code(); dit(c === 'fr', `${nom} : le choix gardé l'emporte au rechargement du cadre (langue ${c}, plus l'anglais d'office)`);
      await ouvrirLangues().catch(() => {}); 
      const bl2 = await X.boutons(); const arBtn = bl2.find(x => /العربية/.test(x) && !/العَرَبِيَّة/.test(x));
      if (arBtn) { c = await choisir(arBtn, 'ar'); dit(c === 'ar', `${nom} : « العربية » choisi par le vrai bouton → langue ${c}`); } else note(`${nom} : le bouton arabe n'est pas sur cet écran (${bl2.join(' | ').slice(0, 120)})`);
      // revenir à l'anglais : le choix est gardé, l'anglais s'ouvre alors parce que choisi
      await X.f.evaluate(() => { window.ISNAD.langue.choisir('en'); window.ISNAD.save.data.opts.lang = 'en'; window.ISNAD.save.store(); location.reload(); }); await X.titre();
      c = await X.code(); dit(c === 'en', `${nom} : de nouveau l'anglais (${c})`);
      // plein écran : le bouton de la scène, le réglage, la demande au premier toucher
      const regl = await X.f.evaluate(() => { const b = [...document.querySelectorAll('#title .vmenu button')].find(x => /Settings|Réglages/.test(x.textContent)); if (b) b.click(); return !!b; });
      await X.f.waitForTimeout(500);
      const pl = await X.f.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
        const lib = [...document.querySelectorAll('button')].filter(e => vis(e) && /Full ?screen|Plein écran|ملء الشاشة/i.test(e.textContent + (e.getAttribute('aria-label') || ''))).map(e => e.textContent.trim().slice(0, 30) || e.id);
        return { lib, btn: vis(document.getElementById('pleinbtn')), nbReglages: document.querySelectorAll('#title button, .screen:not([hidden]) button').length, ecran: [...document.querySelectorAll('.screen')].filter(e => !e.hidden).map(e => e.id).join(',') }; });
      dit(regl && !pl.lib.length && !pl.btn, `${nom} : les Réglages sont ouverts (écran « ${pl.ecran} ») et ne montrent aucun « Plein écran » (boutons trouvés : ${pl.lib.join(', ') || 'aucun'} ; #pleinbtn visible : ${pl.btn})`);
      await X.p.screenshot({ path: path.join(out, `reglages-en-${cle}.png`) });
      // retour à l'écran-titre
      await X.f.evaluate(() => location.reload()); await X.titre(); X.touchers = 0;
      // une partie neuve : combien de touchers ?
      const nouvelle = (await X.boutons()).find(x => /New Game|Nouvelle partie/.test(x));
      await X.toucher('#title .vmenu button', nouvelle.slice(0, 8));
      await X.f.waitForSelector('#perso:not([hidden])', { timeout: 10000 }).catch(async e => { await X.p.screenshot({ path: path.join(out, `echec-${cle}.png`) }); console.log('   écrans ouverts : ' + await X.f.evaluate(() => [...document.querySelectorAll('.screen')].filter(x => !x.hidden).map(x => x.id).join(',') + ' | langue ' + window.ISNAD.langue.code() + ' | ' + [...document.querySelectorAll('button')].filter(x => x.offsetWidth).map(x => x.textContent.trim().slice(0, 14)).join(' / '))); throw e; });
      const bC = await X.f.evaluate(() => [...document.querySelectorAll('#perso button')].map(x => x.textContent.trim())); await X.p.screenshot({ path: path.join(out, `perso-en-${cle}.png`) });
      await X.toucher('#perso button', bC.find(x => /Begin|Start|Commencer/i.test(x)) || bC[0]);
      await X.f.waitForFunction(() => { const d = document.querySelector('#dialog'); return d && !d.hidden && d.querySelector('.text').textContent.trim().length > 3; }, null, { timeout: 30000 }).catch(() => {});
      const rep = await X.f.evaluate(() => { const d = document.querySelector('#dialog'); return d && !d.hidden ? d.querySelector('.text').textContent.trim() : ''; });
      dit(rep.length > 3 && X.touchers <= 2, `${nom} : une partie neuve commence en ${X.touchers} touchers (« ${await X.t0 || ''}${nouvelle.slice(0, 20)} » puis « ${bC.find(x => /Begin|Start|Commencer/i.test(x)) || bC[0]} ») ; première réplique, en anglais : « ${rep.slice(0, 60)}… »`);
      await X.p.waitForTimeout(800); await X.p.screenshot({ path: path.join(out, `partie-en-${cle}.png`) });
      const demandes = await X.f.evaluate(() => window.__plein || 0);
      dit(demandes === 0, `${nom} : le jeu n'a demandé le plein écran à aucun moment (appels à requestFullscreen : ${demandes})`);
      dit(!X.dehors.length, `${nom} : aucune requête hors des deux serveurs locaux${X.dehors.length ? ' — ' + X.dehors.slice(0, 3).join(' | ') : ''}`);
      dit(!X.erreurs.length, `${nom} : aucune erreur console${X.erreurs.length ? ' — ' + [...new Set(X.erreurs)].slice(0, 3).join(' | ').slice(0, 300) : ''}`);
      await X.ctx.close();
    }
    // le stockage refusé
    { const X = await ouvrir({ width: 960, height: 540 }, { sansStockage: true }); const c = await X.code();
      note(`stockage refusé : le jeu s'ouvre quand même, en « ${c} » (le préambule lit les options par le stockage : sans lui, le jeu garde son français d'origine — rien n'est corrigé)`);
      dit(!X.erreurs.length, `stockage refusé : aucune erreur console${X.erreurs.length ? ' — ' + X.erreurs.slice(0, 2).join(' | ') : ''}`); await X.ctx.close(); }
  } finally { await b.close(); jeu.close(); hote.close(); }
  console.log(anomalies ? `✗ ÉCART — ${anomalies} anomalie(s) (captures dans v2/.smoke/plateformes/crazygames)` : '✓ PAQUET CONFORME — crazygames (captures dans v2/.smoke/plateformes/crazygames)');
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error('✗ ' + (e && e.stack || e)); process.exit(1); });
