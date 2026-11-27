/* ISNAD 2.x — plateformes : la cible « poki » (Poki, portail de jeux web ; SDK HTML5, publicité de Poki seule).
   plateformes/sortie/poki/isnad-<numéro>-poki.zip : index.html à la racine, rien d'autre. C'est le paquet « web » plus,
   avant la fin de <head>, la balise du SDK (plateformes/poki/balise-sdk.html, telle que la donne developers.poki.com/guide/sdk-html5)
   et le branchement (plateformes/poki/poki.js). Le jeu n'est pas modifié, et c'est contrôlé : ôtés ces deux blocs, on retrouve
   le paquet web octet pour octet ; la seule ressource au-dehors est la balise du SDK.
   L'essai : node v2/tools/plateformes.js essai poki (le SDK y est FAUX ; ni le vrai SDK ni aucun compte ne sont touchés ;
   SANS_D=1 : sans manette.js ni loupe.js, qui demandent un second navigateur). Fiche : plateformes/poki.md. */
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os'), { spawnSync } = require('child_process');
const SDK_URL = 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js';

function faire(C) {
  const dos = path.join(C.DOSSIER, 'poki');
  return (async () => {
    const w = require('./web.js').faire(C);
    const balise = fs.readFileSync(path.join(dos, 'balise-sdk.html'), 'utf8').trim(), js = fs.readFileSync(path.join(dos, 'poki.js'), 'utf8');
    if (!balise.includes(SDK_URL)) throw new Error('ÉCART poki : la balise du SDK n’est pas celle de la documentation (' + SDK_URL + ')');
    const bloc = balise + '\n<script id="poki-branchement">\n' + js + '</script>\n';
    if (w.html.split('</head>').length !== 2) throw new Error('ÉCART poki : le jeu n’a pas exactement un </head>');
    const html = w.html.replace('</head>', () => bloc + '</head>');
    if (html.replace(bloc, '') !== w.html) throw new Error('ÉCART poki : ôtés la balise et le branchement, on ne retrouve pas le paquet web');
    const dehors = C.ressourcesDehors(html).filter(x => !x.includes(SDK_URL));
    if (dehors.length) throw new Error('ÉCART poki : une ressource au-dehors autre que le SDK — ' + dehors.join(' | '));
    if (/rewardedBreak\s*\(/.test(js)) throw new Error('ÉCART poki : le branchement appelle rewardedBreak (aucune publicité récompensée)');
    const z = C.zip([{ nom: 'index.html', donnees: Buffer.from(html, 'utf8') }], C.dateDuJeu(w.J));
    fs.rmSync(path.join(C.SORTIE, 'poki'), { recursive: true, force: true });
    const f = C.ecrire('poki', `isnad-${w.J.numero}-poki.zip`, z), L = C.lireZip(fs.readFileSync(f));
    if (L.length !== 1 || L[0].nom !== 'index.html' || !L[0].donnees.equals(Buffer.from(html, 'utf8'))) throw new Error('ÉCART poki : le zip relu n’est pas index.html seul');
    const page = C.ecrire('poki', 'index.html', html);
    console.log(`✓ poki — ${path.relative(C.RACINE, f)} : zip ${C.mo(z.length)}, index.html ${C.mo(Buffer.byteLength(html))} ; balise du SDK + branchement ${(Buffer.byteLength(bloc) / 1024).toFixed(1)} Ko, ôtés on retrouve le paquet web à l’octet ; seule ressource au-dehors : ${SDK_URL}`);
    const fait = Object.assign({}, w, { html, page, zip: f, entrees: L.map(e => e.nom) });
    // « plateformes.js essai poki » : le répartiteur n'a pas de crochet d'essai propre à une cible ; l'essai du SDK (faux) est ici
    if (process.argv[2] === 'essai') { const code = await essai(C, fait); process.exit(code ? 1 : 0); }
    return fait;
  })();
}

/* ------------------------------------------------------------------ l'essai ------------------------------------------------------------------ */
// le FAUX SDK : il note chaque appel (nom, instant, gain du son, voile posé) ; la publicité dure tant que le test ne l'a pas finie
const FAUX_SDK = `(function(){
  var P = window.__poki = { calls: [], mode: window.__mode || 'ok' };
  var gain = function(){ try { var A = window.ISNAD && ISNAD.audio; return A && A.master ? Math.round(A.master.gain.value * 100) / 100 : null; } catch (e) { return null; } };
  var log = function(n, x){ P.calls.push({ n: n, t: performance.now(), gain: gain(), voile: !!document.getElementById('poki-pub'), x: x }); };
  window.PokiSDK = {
    init: function(){ log('init'); return P.mode === 'echec' ? Promise.reject(new Error('refusé')) : Promise.resolve(); },
    gameLoadingFinished: function(){ log('gameLoadingFinished'); },
    gameplayStart: function(){ log('gameplayStart'); },
    gameplayStop: function(){ log('gameplayStop'); },
    commercialBreak: function(cb){ log('commercialBreak:debut'); try { cb && cb(); } catch (e) {} log('commercialBreak:rappel'); var r = P.calls[P.calls.length - 1]; setTimeout(function(){ r.gain = gain(); }, 150);
      return new Promise(function(res){ P.finirPub = function(){ log('commercialBreak:fin'); res(); }; }); },
    rewardedBreak: function(){ log('rewardedBreak'); return Promise.resolve(false); },
    openExternalLink: function(u){ log('openExternalLink', u); },
    getLanguage: function(){ return window.__lang || 'fr'; },
    setDebug: function(){}, movePill: function(){}, measure: function(){}, shareableURL: function(){ return Promise.resolve(''); }, getURLParam: function(){ return ''; }
  };
})();`;

async function essai(C, fait) {
  const { chromium, devices } = require('playwright');
  const out = path.join(C.V2, '.smoke/plateformes/poki'); fs.mkdirSync(out, { recursive: true });
  let anomalies = 0; const constats = [];
  const dit = (v, m) => { if (!v) anomalies++; console.log((v ? 'OK  ' : 'ÉCART ') + m); }, note = m => { constats.push(m); console.log('·   ' + m); };
  const L = C.lireZip(fs.readFileSync(fait.zip)), html = L.find(e => e.nom === 'index.html').donnees, htmlWeb = fs.readFileSync(path.join(C.SORTIE, 'web', 'index.html'));
  console.log(`— essai du paquet poki : ${path.relative(C.RACINE, fait.zip)} (${L.map(e => e.nom).join(', ')} ; ${C.mo(fs.statSync(fait.zip).size)})`);
  dit(L.length === 1 && L[0].nom === 'index.html', 'le zip ne contient que index.html, à sa racine');

  // l'adresse du SDK répond (la seule fois qu'on la touche pour de vrai : un en-tête, rien d'autre)
  const c = spawnSync('curl', ['-sI', '-m', '25', SDK_URL], { encoding: 'utf8' }), ligne = ((c.stdout || '').match(/^HTTP\/[\d.]+ (\d+)/gm) || []).pop() || '';
  dit(/ 200$/.test(ligne), `l’adresse du SDK répond : ${ligne || 'aucune réponse'} (${SDK_URL})`);

  const servir = pages => new Promise(res => { const s = http.createServer((q, r) => { const u = q.url.split('?')[0], f = pages[u === '/' ? '/index.html' : u]; if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); r.end(f); }); s.listen(0, '127.0.0.1', () => res(s)); });
  const jeu = await servir({ '/index.html': html, '/web.html': htmlWeb });
  const oJeu = 'http://localhost:' + jeu.address().port;
  // l'hôte : un cadre d'une autre origine, et une page plus haute que l'écran (pour voir si le jeu la fait défiler)
  const hote = await servir({ '/index.html': `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>hôte</title><style>html,body{margin:0;background:#222}iframe{border:0;display:block;width:100vw;height:100vh}.espace{height:150vh}</style><iframe id="jeu" src="${oJeu}/index.html" allow="autoplay"></iframe><div class="espace"></div>` });
  const oHote = 'http://127.0.0.1:' + hote.address().port;
  note(`cadre : l’hôte sur ${oHote}, le jeu sur ${oJeu} (deux origines) ; le SDK est un faux, servi à la place de ${SDK_URL}`);

  const b = await chromium.launch(), erreursTous = [], dehorsTous = [], appelsTous = [];
  const nommes = [];                    // les appels d'une page à l'autre, pour les preuves globales
  try {
    const ouvrir = async (vp, o) => {
      o = o || {}; const tactile = vp.width < 900 && vp.height < 900;
      const ctx = await b.newContext(Object.assign({ viewport: vp }, tactile ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2, userAgent: devices['iPhone 13'].userAgent } : {}));
      // le SDK : faux, ou absent (un bloqueur), selon le cas
      await ctx.route(SDK_URL, r => o.sansSdk ? r.abort('blockedbyclient') : r.fulfill({ status: 200, contentType: 'text/javascript', body: FAUX_SDK }));
      await ctx.addInitScript(([mode, lang, port]) => { if (location.port === String(port)) { window.__mode = mode; if (lang) window.__lang = lang; } }, [o.mode || 'ok', o.lang || '', jeu.address().port]);
      const p = await ctx.newPage(), X = { ctx, p, erreurs: [], dehors: [], vp };
      p.on('pageerror', e => X.erreurs.push(e.message));
      p.on('console', m => { if (m.type() === 'error' && !(o.sansSdk && /Failed to load resource|ERR_/.test(m.text()))) X.erreurs.push(m.text()); });
      p.on('request', r => { const u = r.url(); if (!u.startsWith(oHote) && !u.startsWith(oJeu) && u !== SDK_URL && !/^(data|blob|about):/.test(u)) X.dehors.push(u); });
      await p.goto(oHote + '/index.html');
      await p.waitForSelector('iframe#jeu'); X.f = p.frames().find(f => f.url().startsWith(oJeu)) || await (await p.$('iframe#jeu')).contentFrame();
      await X.f.waitForFunction(() => { const t = document.querySelector('#title'); return t && !t.hidden && t.querySelectorAll('.vmenu button').length > 0; }, null, { timeout: 30000 });
      X.t = s => X.f.evaluate(s => window.ISNAD.t(s), s);
      X.appels = () => X.f.evaluate(() => (window.__poki ? window.__poki.calls.map(c => c.n) : null));
      X.journal = () => X.f.evaluate(() => (window.__poki ? window.__poki.calls : []));
      X.attendre = (n, k) => X.f.waitForFunction(([n, k]) => window.__poki && window.__poki.calls.filter(c => c.n === n).length >= (k || 1), [n, k || 1], { timeout: 30000 });
      X.clic = async (sel, texte) => { const l = X.f.locator(sel, texte ? { hasText: texte } : {}).first(); await l.click(); };
      return X;
    };
    const fermer = async X => { erreursTous.push(...X.erreurs); dehorsTous.push(...X.dehors); try { const j = await X.journal(); appelsTous.push(...j.map(c => c.n)); } catch (e) { /* page fermée */ } await X.ctx.close(); };
    // le journal est bien tenu : jamais deux « start » ni deux « stop » de suite ; rien pendant une publicité
    const regle = (J, nom) => {
      const ev = J.map(c => c.n).filter(n => n === 'gameplayStart' || n === 'gameplayStop'); let ok = ev.length === 0 || ev[0] === 'gameplayStart', deux = 0;
      for (let i = 1; i < ev.length; i++) if (ev[i] === ev[i - 1]) { ok = false; deux++; }
      let dans = false, pendant = [];
      J.forEach(c => { if (c.n === 'commercialBreak:debut') dans = true; else if (c.n === 'commercialBreak:fin') dans = false; else if (dans && !/^commercialBreak/.test(c.n)) pendant.push(c.n); });
      dit(ok, `${nom} : gameplayStart et gameplayStop alternent, le premier est un Start (${ev.length} événements, ${deux} doublon(s))`);
      dit(!pendant.length, `${nom} : aucun événement du SDK pendant une publicité${pendant.length ? ' — ' + pendant.join(', ') : ''}`);
      dit(!J.some(c => c.n === 'rewardedBreak'), `${nom} : aucun rewardedBreak`);
    };

    /* ---------- le parcours : titre → partie neuve → répliques → halte → Chaîne → publicité → récit → rechargement → Continuer ---------- */
    const TAILLES = [[960, 540, '960 × 540'], [390, 844, '390 × 844'], [844, 390, '844 × 390']];
    for (const [w, h, nom] of TAILLES) {
      const X = await ouvrir({ width: w, height: h }), f = X.f;
      // 1. le titre
      let a = await X.appels(); await X.attendre('gameLoadingFinished');
      a = await X.appels();
      dit(a[0] === 'init' && a.filter(n => n === 'gameLoadingFinished').length === 1 && !a.includes('gameplayStart'), `${nom} · 1 titre : init() d’abord, gameLoadingFinished() une fois, aucun gameplayStart (${a.join(' → ')})`);
      // 2. partie neuve
      await X.clic('#title .vmenu button', await X.t('Nouvelle partie')); await f.waitForSelector('#perso:not([hidden])', { timeout: 10000 });
      await X.clic('#perso button', await X.t('Commencer'));
      for (let i = 0; i < 60 && !(await X.appels()).includes('gameplayStart'); i++) { await X.p.keyboard.press('Enter'); await f.waitForTimeout(350); }
      a = await X.appels();
      dit(a.includes('gameplayStart'), `${nom} · 2 partie neuve : gameplayStart quand le joueur a la main (${a.join(' → ')})`);
      for (let i = 0; i < 6; i++) { await X.p.keyboard.press('Enter'); await f.waitForTimeout(400); }
      await X.p.screenshot({ path: path.join(out, `jeu-${w}x${h}.png`) });
      // 3. la halte : stop à l'ouverture, start à la fermeture
      const n0 = (await X.appels()).length;
      await f.evaluate(() => window.ISNAD.ui.pause()); await f.waitForSelector('#menu:not([hidden])', { timeout: 8000 });
      await X.f.waitForFunction(n0 => window.__poki.calls.length > n0 && window.__poki.calls[window.__poki.calls.length - 1].n === 'gameplayStop', n0, { timeout: 8000 }).catch(() => {});
      a = await X.appels(); dit(a[a.length - 1] === 'gameplayStop', `${nom} · 3 halte ouverte : gameplayStop (${a.slice(-3).join(' → ')})`);
      await X.p.keyboard.press('Escape'); await f.waitForFunction(() => document.querySelector('#menu').hidden, null, { timeout: 8000 });
      await f.waitForFunction(() => window.__poki.calls[window.__poki.calls.length - 1].n === 'gameplayStart', null, { timeout: 8000 }).catch(() => {});
      a = await X.appels(); dit(a[a.length - 1] === 'gameplayStart', `${nom} · 3 halte fermée : gameplayStart, aucune publicité (${a.slice(-3).join(' → ')}) ; commercialBreak : ${a.filter(n => n === 'commercialBreak:debut').length}`);
      // 4. la Chaîne, puis un maillon : stop, publicité, récit
      await f.evaluate(() => window.ISNAD.ui.showChain()); await f.waitForSelector('#chain:not([hidden])', { timeout: 8000 });
      await f.waitForFunction(() => window.__poki.calls[window.__poki.calls.length - 1].n === 'gameplayStop', null, { timeout: 8000 }).catch(() => {});
      const avant = (await X.appels()).length;
      await X.p.screenshot({ path: path.join(out, `chaine-${w}x${h}.png`) });
      await f.locator('#chain .link:not(.locked)').first().click();
      await X.attendre('commercialBreak:debut');
      let J = await X.journal(), i0 = J.map(c => c.n).lastIndexOf('commercialBreak:debut');
      dit(J[i0 - 1].n === 'gameplayStop', `${nom} · 4 Chaîne → maillon : gameplayStop, puis commercialBreak (${J.slice(avant - 1).map(c => c.n).join(' → ')})`);
      // pendant la publicité : son coupé, entrées ignorées, rien ne repart
      const pend = await f.evaluate(() => { const A = ISNAD.audio, v = document.getElementById('poki-pub'), r = v && v.getBoundingClientRect(), el = v && document.elementFromPoint(innerWidth / 2, innerHeight / 2); return { gain: A.master ? A.master.gain.value : null, voile: !!v, couvre: !!v && r.width >= innerWidth && r.height >= innerHeight && el === v, recit: !!(ISNAD.world.saga && ISNAD.world.saga.id !== 'idris') }; });
      dit(pend.voile && pend.couvre, `${nom} · 4 pendant la publicité : un voile couvre tout le cadre et reçoit les touchers`);
      dit(pend.gain === 0, `${nom} · 4 pendant la publicité : le son du jeu est coupé (gain ${pend.gain})`);
      const nAvant = (await X.appels()).length, enChaine = await f.evaluate(() => !document.querySelector('#chain').hidden);
      for (const k of ['Enter', ' ', 'ArrowRight', 'Escape']) await X.p.keyboard.press(k);
      await X.p.mouse.click(w / 2, h / 2); await f.waitForTimeout(700);
      const apres = await f.evaluate(() => ({ chaine: !document.querySelector('#chain').hidden, menu: !document.querySelector('#menu').hidden, recit: !!(ISNAD.world.saga && ISNAD.world.saga.id !== 'idris') }));
      const nApres = (await X.appels()).length;
      dit(nApres === nAvant && !apres.menu && !apres.recit, `${nom} · 4 pendant la publicité : clavier et toucher ignorés (aucun appel du SDK, ni halte, ni récit lancé ; la Chaîne ${enChaine ? 'était' : 'n’était pas'} à l’écran)`);
      await X.p.screenshot({ path: path.join(out, `pub-${w}x${h}.png`) });
      const starts0 = (await X.appels()).filter(n => n === 'gameplayStart').length;
      await f.waitForTimeout(250); await f.evaluate(() => window.__poki.finirPub());
      await X.attendre('commercialBreak:fin');
      for (let i = 0; i < 40 && (await X.appels()).filter(n => n === 'gameplayStart').length <= starts0; i++) { await X.p.keyboard.press('Enter'); await f.waitForTimeout(300); }
      const rendu = await f.evaluate(() => ({ gain: ISNAD.audio.master.gain.value, voile: !!document.getElementById('poki-pub'), on: ISNAD.audio.on }));
      J = await X.journal();
      dit(!rendu.voile && Math.abs(rendu.gain - (rendu.on ? 0.8 : 0)) < 0.01, `${nom} · 4 après la publicité : le voile est ôté, le son revient (gain ${rendu.gain})`);
      dit(J.map(c => c.n).slice(i0).filter(n => n === 'gameplayStart').length >= 1 && J.findIndex((c, i) => i > i0 && c.n === 'gameplayStart') > J.findIndex(c => c.n === 'commercialBreak:fin'), `${nom} · 4 après la publicité : le récit part, gameplayStart vient après la fin de la publicité`);
      const inters = J.slice(i0).filter(c => c.n === 'commercialBreak:rappel')[0]; await f.waitForTimeout(200);
      dit(inters && inters.gain === 0 && inters.voile, `${nom} · 4 au rappel de commercialBreak(onStart) : le son est déjà coupé (gain ${inters && inters.gain}) et le voile posé`);
      await f.waitForTimeout(600); await f.evaluate(() => window.ISNAD.ui.menuOpen); regle(await X.journal(), `${nom} · parcours`);
      // 5. rechargement : « Continuer » → publicité (reprise)
      await X.p.reload(); X.f = X.p.frames().find(fr => fr.url().startsWith(oJeu)); const g = X.f; X.attendre = (n, k) => g.waitForFunction(([n, k]) => window.__poki && window.__poki.calls.filter(c => c.n === n).length >= (k || 1), [n, k || 1], { timeout: 30000 }); X.appels = () => g.evaluate(() => (window.__poki ? window.__poki.calls.map(c => c.n) : null)); X.journal = () => g.evaluate(() => (window.__poki ? window.__poki.calls : []));
      await g.waitForFunction(() => { const t = document.querySelector('#title'); return t && !t.hidden && t.querySelectorAll('.vmenu button').length > 0; }, null, { timeout: 30000 });
      await X.attendre('gameLoadingFinished');
      const t = s => g.evaluate(s => window.ISNAD.t(s), s);
      const cont = g.locator('#title .vmenu button', { hasText: await t('Continuer') }).first();
      if (await cont.count()) {
        await cont.click(); await X.attendre('commercialBreak:debut');
        let a5 = await X.appels(); dit(a5[a5.length - 1] !== 'gameplayStart' && a5.includes('commercialBreak:debut') && !a5.includes('gameplayStart'), `${nom} · 5 « Continuer » : la publicité de reprise vient avant tout gameplayStart (${a5.join(' → ')})`);
        await g.evaluate(() => window.__poki.finirPub()); await X.attendre('commercialBreak:fin');
        for (let i = 0; i < 30 && !(await X.appels()).includes('gameplayStart'); i++) { await X.p.keyboard.press('Enter'); await g.waitForTimeout(300); }
        a5 = await X.appels(); dit(a5.includes('gameplayStart'), `${nom} · 5 après la reprise : gameplayStart (${a5.join(' → ')})`);
        regle(await X.journal(), `${nom} · reprise`);
      } else note(`${nom} · 5 : pas de « Continuer » après rechargement (aucune partie gardée à cet instant)`);
      await fermer(X);
    }

    /* ---------- le SDK absent (un bloqueur) : le jeu se joue ---------- */
    for (const [mode, o, nom] of [['absent', { sansSdk: true }, 'SDK bloqué (bloqueur de publicité)'], ['echec', { mode: 'echec' }, 'init() refusé']]) {
      const X = await ouvrir({ width: 960, height: 540 }, o), f = X.f;
      await X.clic('#title .vmenu button', await X.t('Nouvelle partie')); await f.waitForSelector('#perso:not([hidden])', { timeout: 10000 });
      await X.clic('#perso button', await X.t('Commencer'));
      const reps = []; for (let i = 0; i < 40 && reps.length < 3; i++) { const r = await f.evaluate(() => { const d = document.querySelector('#dialog'); return d && !d.hidden ? d.querySelector('.text').textContent.trim() : ''; }); if (r && r.length > 3 && !reps.includes(r)) reps.push(r); await X.p.keyboard.press('Enter'); await f.waitForTimeout(400); }
      await f.evaluate(() => window.ISNAD.ui.showChain()); await f.waitForSelector('#chain:not([hidden])'); await f.locator('#chain .link:not(.locked)').first().click(); await f.waitForFunction(() => ISNAD.world.saga && ISNAD.world.saga.id !== 'idris', null, { timeout: 20000 }).catch(() => {});
      const sdkLa = await f.evaluate(() => typeof window.PokiSDK), enJeu = await f.evaluate(() => !!(ISNAD.world.saga && ISNAD.world.saga.id !== 'idris'));
      const ap = (await X.appels()) || [];
      dit(reps.length >= 2 && enJeu, `${nom} : « Nouvelle partie », ${reps.length} répliques, la Chaîne, un maillon ouvert sans attente (PokiSDK : ${sdkLa}) — le jeu se joue`);
      dit(!ap.some(n => /^(gameplay|commercial|gameLoading)/.test(n)), `${nom} : aucun appel du SDK ne part (${ap.join(', ') || 'aucun'}) ; aucune publicité, aucun voile : ${await f.evaluate(() => !document.getElementById('poki-pub'))}`);
      dit(!X.erreurs.length, `${nom} : aucune erreur console${X.erreurs.length ? ' — ' + X.erreurs.slice(0, 3).join(' | ') : ''}`);
      await fermer(X);
    }

    /* ---------- le reste, une fois, en 960 × 540 ---------- */
    {
      const X = await ouvrir({ width: 960, height: 540 }), f = X.f;
      // le partage retiré : même avec un maillon achevé
      const part = await f.evaluate(() => { const I = ISNAD, id = Object.keys(I.sagas).find(k => !I.sagas[k].frame && !I.sagas[k].commun); I.save.data.sagas[id] = Object.assign(I.save.data.sagas[id] || { ch: 0, flags: {} }, { done: true }); return { maillons: I.save.maillons().length, offert: I.partage.offert() }; });
      await f.evaluate(() => window.ISNAD.ui.showChain()); await f.waitForSelector('#chain:not([hidden])'); const texteChaine = await f.locator('#chain').innerText();
      await f.evaluate(() => { document.querySelector('#chain .pied button, #chain button:last-child'); });
      dit(part.maillons > 0 && part.offert === false && !texteChaine.includes(await X.t('Partager ma progression')), `partage : un maillon achevé (${part.maillons}), et pourtant partage.offert() est faux et la Chaîne n’a pas « Partager ma progression »`);
      await f.evaluate(() => { window.ISNAD.ui.pause(); }); await f.waitForSelector('#menu:not([hidden])'); const halte = await f.locator('#menu').innerText();
      dit(!halte.includes(await X.t('Partager ma progression')), 'partage : la halte n’a pas « Partager ma progression »');
      await X.p.keyboard.press('Escape');
      // le témoin : le paquet web, sans branchement, l'offre
      const W = await b.newContext({ viewport: { width: 960, height: 540 } }), wp = await W.newPage(); await W.route('**/*', r => /^(http:\/\/localhost|data:|blob:)/.test(r.request().url()) ? r.continue() : r.abort());
      await wp.goto(oJeu + '/web.html'); await wp.waitForFunction(() => !document.querySelector('#title').hidden, null, { timeout: 30000 });
      const temoin = await wp.evaluate(() => { const I = ISNAD, id = Object.keys(I.sagas).find(k => !I.sagas[k].frame && !I.sagas[k].commun); I.save.data.sagas[id] = { ch: 0, flags: {}, done: true }; return I.partage.offert(); });
      dit(temoin === true, 'partage : le témoin (paquet web sans le branchement) offre bien « Partager ma progression » — le retrait vient du branchement'); await W.close();
      // la page ne défile pas
      await f.evaluate(() => window.ISNAD.ui.showChain().catch(() => {})); await f.waitForTimeout(300);
      await X.p.evaluate(() => document.getElementById('jeu').contentWindow.focus()); await X.p.mouse.move(480, 270); for (const k of [' ', 'ArrowDown', 'PageDown']) await X.p.keyboard.press(k); await X.p.mouse.wheel(0, 400); await X.p.waitForTimeout(400);
      const sy = await X.p.evaluate(() => window.scrollY);
      dit(sy === 0, `défilement : la page hôte n’a pas bougé sous Espace, flèche bas, page bas et molette dans le cadre (scrollY ${sy})`);
      // le témoin du défilement : le même geste sur le paquet web (sans branchement) dans le même cadre
      const hoteW = await servir({ '/index.html': `<!doctype html><title>h</title><style>html,body{margin:0}iframe{border:0;display:block;width:100vw;height:100vh}.e{height:150vh}</style><iframe src="${oJeu}/web.html"></iframe><div class="e"></div>` });
      const W2 = await b.newContext({ viewport: { width: 960, height: 540 } }), p2 = await W2.newPage(); await W2.route('**/*', r => /^(http:\/\/(localhost|127\.0\.0\.1)|data:|blob:)/.test(r.request().url()) ? r.continue() : r.abort());
      await p2.goto('http://127.0.0.1:' + hoteW.address().port + '/'); await p2.waitForTimeout(2500); await p2.evaluate(() => document.querySelector('iframe').contentWindow.focus()); await p2.mouse.move(480, 270); await p2.keyboard.press('ArrowDown'); await p2.keyboard.press(' '); await p2.mouse.wheel(0, 400); await p2.waitForTimeout(400);
      const sy2 = await p2.evaluate(() => window.scrollY); note(`défilement, témoin : le paquet web, sans branchement, dans le même cadre : scrollY ${sy2}${sy2 > 0 ? ' (le branchement évite bien ce défilement)' : ' (le geste ne fait pas défiler ici : le branchement n’est pas prouvé nécessaire par ce témoin)'}`); await W2.close(); hoteW.close();
      await fermer(X);
    }
    // la langue : celle de Poki, sinon l'anglais ; le choix du joueur l'emporte
    for (const [lang, attendu, nom] of [['fr', 'fr', 'Poki dit fr'], ['ar', 'ar', 'Poki dit ar'], ['de', 'en', 'Poki dit de (non offerte)'], ['pt-BR', 'en', 'Poki dit pt (non offerte)']]) {
      const X = await ouvrir({ width: 960, height: 540 }, { lang }); const code = await X.f.evaluate(() => window.ISNAD.langue.code());
      dit(code === attendu, `langue : ${nom} → le jeu s’ouvre en « ${code} » (attendu « ${attendu} »)`); await fermer(X);
    }
    { const X = await ouvrir({ width: 960, height: 540 }, { lang: 'ar' });
      await X.f.evaluate(() => { localStorage.setItem('isnad2.opts', JSON.stringify({ lang: 'fr' })); }); await X.p.reload(); const g = X.p.frames().find(fr => fr.url().startsWith(oJeu));
      await g.waitForFunction(() => window.ISNAD && ISNAD.langue && !document.querySelector('#title').hidden, null, { timeout: 30000 }); const code = await g.evaluate(() => window.ISNAD.langue.code());
      dit(code === 'fr', `langue : Poki dit « ar » mais le joueur a gardé le français → « ${code} » (le choix du joueur l’emporte)`); await fermer(X); }

    dit(!erreursTous.length, `aucune erreur console sur tous les parcours${erreursTous.length ? ' — ' + [...new Set(erreursTous)].slice(0, 3).join(' | ').slice(0, 300) : ''}`);
    dit(!dehorsTous.length, `aucune requête au-dehors, hors les deux origines locales, le SDK (faux) et data:/blob: ${dehorsTous.length ? '— ' + [...new Set(dehorsTous)].slice(0, 4).join(' | ') : ''}`);
    dit(!appelsTous.includes('rewardedBreak') && !appelsTous.includes('openExternalLink'), 'aucun rewardedBreak, aucun openExternalLink sur tous les parcours (le jeu n’a aucun lien sortant)');
    dit(appelsTous.filter(n => n === 'commercialBreak:debut').length === appelsTous.filter(n => n === 'commercialBreak:fin').length, `chaque commercialBreak a eu sa fin (${appelsTous.filter(n => n === 'commercialBreak:debut').length})`);
  } finally { await b.close(); jeu.close(); hote.close(); }

  for (const outil of process.env.SANS_D ? [] : ['manette.js', 'loupe.js']) {
    const r = spawnSync('node', ['tools/' + outil], { cwd: C.V2, env: Object.assign({}, process.env, { JEU: path.relative(C.V2, fait.page) }), encoding: 'utf8', maxBuffer: 256e6, timeout: 1800000 });
    const sortie = (r.stdout || '') + (r.stderr || ''), lignes = sortie.trim().split('\n'), alertes = [...new Set((sortie.match(/\b(REFUS|BLOQUÉ|ABSENT|INACCESSIBLE|INVISIBLE|TRAIT|ÉCART|RECOUVERT|DÉBORDE|SOMBRE|SUPERPOSÉ|COINCÉ|TEXTE CACHÉ)\b/g) || []))];
    dit(r.status === 0 && !alertes.length, `${outil} sur le paquet : code ${r.status}, alertes : ${alertes.join(', ') || 'aucune'}`);
  }
  console.log(anomalies ? `✗ ÉCART — ${anomalies} anomalie(s) (captures dans v2/.smoke/plateformes/poki)` : '✓ PAQUET CONFORME — poki (captures dans v2/.smoke/plateformes/poki)');
  if (constats.length) { console.log('Constaté, rien de corrigé dans le jeu :'); constats.forEach(x => console.log('  · ' + x)); }
  return anomalies;
}

module.exports = { description: 'Poki : le paquet web + la balise du SDK et son branchement (gameplay, publicité aux pauses), en zip', faire, SDK_URL };
