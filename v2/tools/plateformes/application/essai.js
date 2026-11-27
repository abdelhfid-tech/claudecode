#!/usr/bin/env node
/* ISNAD 2.x — plateformes : l'essai du pont de l'application, sans téléphone.
   Usage : node v2/tools/plateformes/application/essai.js [android|ios]   (par défaut : android, puis la remise sous iOS)
   La page éprouvée est celle que l'application embarque (plateformes/application/www/index.html, posée par
   « node v2/tools/plateformes.js android » ou « … ios »), servie par un petit serveur HTTP local. Le côté natif est un FAUX :
   le vrai native-bridge.js de Capacitor (celui qu'Android injecte), avec un faux androidBridge (ou, pour iOS, un faux
   window.webkit.messageHandlers.bridge) dont les réponses viennent d'ici : des greffons Filesystem, Share et App joués en
   mémoire — qui répondent, refusent, annulent, ne répondent jamais, ou sont absents. Ce qui passe par la vraie WebView, le
   vrai système de fichiers et la vraie feuille de partage d'un téléphone n'est PAS éprouvé ici.
   Preuves (« OK » / « ÉCART ») :
     A. sans Capacitor (un navigateur) : le pont ne fait rien, le jeu démarre comme le paquet web ;
     B. le démarrage : stockage vide → le jeu attend l'abri, puis démarre ; stockage plein → il démarre aussitôt, dans le
        même appel ; abri gâté, greffon qui refuse, greffon muet (le délai) ; Filesystem absent ;
     C. la partie à l'abri : chaque écriture isnad2.* recopiée dans le fichier ; un stockage vidé (nouveau contexte) est
        remis, clé pour clé, avant que le jeu ne lise, et « Continuer » est offert — sous Android et sous iOS ;
     D. « Enregistrer le fichier » (la partie) : écrit en cache, feuille de partage ouverte, contenu identique au texte ;
        partage annulé ; greffon absent (le jeu reprend la main : le navigateur reçoit le fichier) ;
     E. « Partager ma progression » : navigator.share fourni, l'image passée en fichier (PNG), le texte ; annulé → « Partage
        annulé » ; refusé → le repli du jeu ; sans greffon Share → le repli ; « Enregistrer l'image » ;
     F. le bouton Retour : revient d'un cran comme Échap (un écran se ferme), ne quitte jamais (aucun exitApp) ;
     G. aucune requête hors du serveur local, aucune erreur console.
   « PAQUET CONFORME » à la fin, sinon « ÉCART ». Captures dans v2/.smoke/plateformes/application/. Un seul navigateur. */
const fs = require('fs'), path = require('path'), http = require('http');
const A = require('./atelier.js');
const V2 = path.join(__dirname, '..', '..', '..'), OUT = path.join(V2, '.smoke/plateformes/application');
const PAGE = path.join(A.APP, 'www/index.html');
const PONT_NATIF = fs.readFileSync(path.join(A.APP, 'node_modules/@capacitor/android/capacitor/src/main/assets/native-bridge.js'), 'utf8');

// les en-têtes que Capacitor pose pour chaque greffon natif (JSExport) : le nom de chaque méthode et son retour
const ENTETES = {
  Filesystem: ['readFile', 'writeFile', 'appendFile', 'deleteFile', 'mkdir', 'rmdir', 'readdir', 'getUri', 'stat', 'rename', 'copy'].map(n => ({ name: n, rtype: 'promise' })),
  Share: [{ name: 'share', rtype: 'promise' }, { name: 'canShare', rtype: 'promise' }],
  App: [{ name: 'exitApp', rtype: 'promise' }, { name: 'getInfo', rtype: 'promise' }, { name: 'getState', rtype: 'promise' }, { name: 'minimizeApp', rtype: 'promise' }, { name: 'removeAllListeners', rtype: 'promise' }]
};
['Filesystem', 'Share', 'App'].forEach(n => ENTETES[n].push({ name: 'addListener' }, { name: 'removeListener' }));

/* ---------- le faux côté natif ---------- */
function natif(modes, disque, journal) {
  // modes : { Filesystem: 'repond' | 'refuse' | 'muet' | 'absent', Share: 'repond' | 'annule' | 'refuse' | 'absent', App: 'repond' | 'absent' }
  const ecouteurs = {};   // eventName → callbackId
  return {
    entetes: Object.keys(ENTETES).filter(n => modes[n] !== 'absent').map(n => ({ name: n, methods: ENTETES[n] })),
    // un appel du JS → { reponse } (ou null : pas de réponse)
    appel(d) {
      const { pluginId: g, methodName: m, options: o = {}, callbackId } = d;
      if (g === 'Console' || !ENTETES[g]) return null;
      journal.push({ g, m, o: Object.assign({}, o, o.data && o.data.length > 200 ? { data: `(${o.data.length} signes)` } : {}) });
      const ok = data => ({ callbackId, pluginId: g, methodName: m, success: true, data: data || {} });
      const ko = message => ({ callbackId, pluginId: g, methodName: m, success: false, error: { message } });
      if (m === 'addListener') { ecouteurs[`${g}:${o.eventName}`] = callbackId; return null; }
      if (m === 'removeListener' || m === 'removeAllListeners') return ok();
      const mode = modes[g];
      if (mode === 'muet') return null;
      if (mode === 'refuse') return ko(g + ' : refusé (essai)');
      if (g === 'Filesystem') {
        const cle = `${o.directory}/${o.path}`;
        if (m === 'writeFile') { disque.set(cle, { data: o.data, encoding: o.encoding || null }); return ok({ uri: `file:///faux/${o.directory.toLowerCase()}/${o.path}` }); }
        if (m === 'readFile') { const f = disque.get(cle); return f ? ok({ data: f.data }) : ko('File does not exist.'); }
        return ok();
      }
      if (g === 'Share') { if (m === 'share') return mode === 'annule' ? ko('Share canceled') : ok({ activityType: 'essai' }); return ok({ value: true }); }
      if (g === 'App') { if (m === 'exitApp') journal.push({ g, m: 'QUITTE' }); return ok(); }
      return ok();
    },
    ecouteur(g, ev) { return ecouteurs[`${g}:${ev}`]; }
  };
}

// le script posé avant la page : le faux pont (Android ou iOS), puis le vrai native-bridge.js, puis les en-têtes
const avantLaPage = ({ ios, entetes, pont }) => {
  window.__natifRecu = r => { const v = JSON.parse(r); if (!v) return; if (window.androidBridge && window.androidBridge.onmessage) window.androidBridge.onmessage({ data: JSON.stringify(v) }); else window.Capacitor.fromNative(v); };
  const poster = d => { setTimeout(() => window.__natif(JSON.stringify(d)).then(window.__natifRecu), 5); };
  if (ios) window.webkit = { messageHandlers: { bridge: { postMessage: d => poster(d) } } };
  else window.androidBridge = { postMessage: s => poster(JSON.parse(s)) };
  window.Capacitor = { DEBUG: false, isLoggingEnabled: false, Plugins: {} };
  (0, eval)(pont);
  window.Capacitor.PluginHeaders = entetes;
};

async function principal(cibles) {
  if (!fs.existsSync(PAGE)) throw new Error('la page de l’application manque : node v2/tools/plateformes.js android (ou ios) d’abord');
  fs.mkdirSync(OUT, { recursive: true });
  const html = fs.readFileSync(PAGE);
  const srv = http.createServer((q, r) => { if (q.url === '/' || q.url === '/index.html') { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(html); } else { r.writeHead(404); r.end(); } });
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const ORIG = `http://127.0.0.1:${srv.address().port}`;
  const { chromium } = require('playwright'), b = await chromium.launch();
  let anomalies = 0; const dit = (v, m) => { if (!v) anomalies++; console.log((v ? 'OK    ' : 'ÉCART ') + m); };
  console.log(`— essai du pont de l’application : ${path.relative(path.join(V2, '..'), PAGE)} (${(html.length / 1e6).toFixed(2)} Mo), servie par ${ORIG}`);

  // un contexte : un appareil (stockage neuf), un faux natif (ou aucun), un disque d'application partagé entre contextes
  const ouvrir = async ({ modes, disque, ios, vp, sansNatif, stockage }) => {
    const ctx = await b.newContext({ viewport: vp || { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2, acceptDownloads: true });
    const journal = [], N = natif(modes || {}, disque || new Map(), journal), erreurs = [], dehors = [];
    if (!sansNatif) {
      await ctx.exposeBinding('__natif', (src, s) => JSON.stringify(N.appel(JSON.parse(s))));
      await ctx.addInitScript(avantLaPage, { ios: !!ios, entetes: N.entetes, pont: PONT_NATIF });
    }
    if (stockage) await ctx.addInitScript(o => { for (const [k, v] of Object.entries(o)) localStorage.setItem(k, v); }, stockage);
    const p = await ctx.newPage();
    p.on('pageerror', e => erreurs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
    p.on('request', r => { const u = r.url(); if (!u.startsWith(ORIG) && !/^(data|blob|about):/.test(u)) dehors.push(u); });
    const t0 = Date.now(); await p.goto(ORIG + '/index.html');
    const titre = await p.waitForFunction(() => window.ISNAD && window.ISNAD.save && !document.querySelector('#title').hidden && document.querySelectorAll('#title .vmenu button').length > 0, null, { timeout: 15000 }).then(() => Date.now() - t0, () => -1);
    const evenement = async (g, ev, data) => { const id = N.ecouteur(g, ev); if (!id) return false; await p.evaluate(([id, g, ev, data]) => window.__natifRecu(JSON.stringify({ callbackId: id, pluginId: g, methodName: 'addListener', success: true, data, save: true })), [id, g, ev, data || {}]); return true; };
    const t = s => p.evaluate(s => window.ISNAD.t(s), s);
    const pont = () => p.evaluate(() => { const P = window.ISNAD_PONT || {}; return { actif: P.actif, demarre: P.demarre, guette: !!P.demarrageGuette, greffons: P.greffons, abri: P.abri && { remis: P.abri.remis, ecrits: P.abri.ecrits, cles: P.abri.cles.slice() }, ordre: (P.ordre || []).join(' → '), journal: (P.journal || []).slice() }; });
    const cles = () => p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^isnad2\./.test(k)) o[k] = localStorage.getItem(k); } return o; });
    const boutons = () => p.evaluate(() => [...document.querySelectorAll('#title .vmenu button')].map(x => x.textContent.trim()));
    return { ctx, p, N, journal, erreurs, dehors, titre, evenement, t, pont, cles, boutons, fermer: () => ctx.close() };
  };
  const propre = (X, nom) => { dit(!X.erreurs.length, `${nom} : aucune erreur console${X.erreurs.length ? ' — ' + [...new Set(X.erreurs)].slice(0, 3).join(' | ').slice(0, 300) : ''}`); dit(!X.dehors.length, `${nom} : aucune requête hors du serveur local${X.dehors.length ? ' — ' + X.dehors.slice(0, 3).join(' | ') : ''}`); };
  const TOUS = { Filesystem: 'repond', Share: 'repond', App: 'repond' };
  const decode = f => Buffer.from(f.data, f.encoding ? 'utf8' : 'base64');
  const partieNeuve = async X => {
    await X.p.locator('#title .vmenu button', { hasText: await X.t('Nouvelle partie') }).first().tap();
    if (!await X.p.waitForSelector('#perso:not([hidden])', { timeout: 4000 }).then(() => true, () => false)) await X.p.locator('#title .vmenu button', { hasText: await X.t('Nouvelle partie') }).first().tap();
    await X.p.locator('#perso button', { hasText: await X.t('Commencer') }).first().tap();
    await X.p.waitForFunction(() => { const d = document.querySelector('#dialog'); return d && !d.hidden && d.querySelector('.text').textContent.trim().length > 3; }, null, { timeout: 30000 }).catch(() => {});
  };

  try {
    /* ---------- A. sans Capacitor ---------- */
    { const X = await ouvrir({ sansNatif: true });
      const P = await X.pont(), nav = await X.p.evaluate(() => ({ share: typeof navigator.share, platform: window.Capacitor && window.Capacitor.getPlatform() }));
      dit(X.titre > 0 && P.actif === false && !P.guette, `A · sans Capacitor natif (un navigateur : capacitor.js y dit « ${nav.platform} ») : le pont ne fait rien (actif ${P.actif}, démarrage non guetté), l’écran-titre paraît en ${X.titre} ms`);
      await X.p.screenshot({ path: path.join(OUT, 'a-navigateur.png') }); propre(X, 'A'); await X.fermer(); }

    /* ---------- B et C. le démarrage, la partie à l'abri ---------- */
    for (const ios of (cibles.includes('android') ? [false] : []).concat(cibles.includes('ios') ? [true] : [])) {
      const nomP = ios ? 'iOS' : 'Android', disque = new Map();
      // B1 : appareil neuf, abri vide
      const X = await ouvrir({ modes: TOUS, disque, ios });
      let P = await X.pont();
      dit(X.titre > 0 && P.actif && P.guette && P.ordre === 'abri → démarrage' && P.journal.includes('abri : aucun'), `B · ${nomP} · appareil neuf : le pont est actif (greffons ${Object.entries(P.greffons).filter(e => e[1]).map(e => e[0]).join(', ')}) ; l’abri est cherché (aucun) avant le démarrage du jeu (${P.ordre} ; boot appelé ${P.demarre}), l’écran-titre paraît en ${X.titre} ms`);
      // C1 : une partie neuve, puis la sauvegarde automatique du jeu ; tout est recopié dans l'abri
      await partieNeuve(X); await X.p.evaluate(() => window.ISNAD.save.auto('essai du pont'));
      await X.p.waitForTimeout(900);
      const avant = await X.cles(), fichiers = [...disque.keys()].filter(k => /^DATA\/isnad2-abri-[ab]\.json$/.test(k));
      const dernier = fichiers.map(k => JSON.parse(disque.get(k).data)).sort((a, b) => b.quand - a.quand)[0];
      const memes = dernier && JSON.stringify(Object.keys(avant).sort().map(k => [k, avant[k]])) === JSON.stringify(Object.keys(dernier.cles).sort().map(k => [k, dernier.cles[k]]));
      dit(Object.keys(avant).length >= 2 && memes, `C · ${nomP} · une partie neuve, puis sa sauvegarde : ${Object.keys(avant).join(', ')} — recopiées dans l’abri (${fichiers.join(', ').replace(/DATA\//g, '')}), clé pour clé`);
      await X.p.screenshot({ path: path.join(OUT, `c-${nomP.toLowerCase()}-partie.png`) });
      // F (Android) : le bouton Retour pendant le jeu — comme Échap
      if (!ios) {
        await X.p.evaluate(() => window.ISNAD.ui.partie('exporter', () => {})); await X.p.waitForSelector('#partie:not([hidden])');
        const ev = await X.evenement('App', 'backButton', { canGoBack: false }); await X.p.waitForTimeout(400);
        const ferme = await X.p.evaluate(() => document.querySelector('#partie').hidden);
        dit(ev && ferme, `F · Retour : « Ta partie » ouverte, Retour la referme (Échap : revenir d’un cran) — ${(await X.pont()).journal.filter(x => x === 'retour').length} retour(s) reçu(s)`);
      }
      propre(X, `B/C · ${nomP}`); await X.fermer();
      // C2 : le stockage vidé (iOS peut vider celui d'une WebView) — un nouveau contexte, le même disque
      const Y = await ouvrir({ modes: TOUS, disque, ios });
      const apres = await Y.cles(); P = await Y.pont(); const tb = await Y.boutons(), cont = await Y.t('Continuer');
      dit(P.ordre === 'abri → démarrage' && P.abri.cles.slice().sort().join() === Object.keys(avant).sort().join() && apres['isnad2.auto'] === avant['isnad2.auto'],
        `C · ${nomP} · stockage vidé : ${P.abri.cles.join(', ')} remises avant que le jeu ne lise (${P.ordre} ; boot appelé ${P.demarre}), la partie identique — ${P.journal.filter(x => /abri/.test(x)).join(' · ')}`);
      dit(tb.some(x => x.startsWith(cont)) && await Y.p.evaluate(() => !!window.ISNAD.save.autoGet()), `C · ${nomP} · stockage vidé : l’écran-titre offre « ${(tb.find(x => x.startsWith(cont)) || '').slice(0, 50)} » (la partie est retrouvée)`);
      await Y.p.screenshot({ path: path.join(OUT, `c-${nomP.toLowerCase()}-remise.png`) });
      propre(Y, `C · ${nomP} · remise`); await Y.fermer();
      // B2 : stockage plein → démarrage aussitôt, dans le même appel
      const Z = await ouvrir({ modes: TOUS, disque, ios, stockage: avant });
      P = await Z.pont();
      dit(Z.titre > 0 && P.demarre === 'aussitôt' && P.ordre === 'démarrage' && P.abri.remis === 0, `B · ${nomP} · le stockage a la partie : rien à remettre, boot appelé aussitôt, dans le même appel que la dernière ligne du jeu (${P.ordre}), écran-titre en ${Z.titre} ms`);
      propre(Z, `B · ${nomP} · aussitôt`); await Z.fermer();
    }
    if (cibles.includes('android')) {
      // B3 : abri gâté — le fichier le plus récent est illisible, l'autre sert
      const bon = { isnad: 'abri', format: 1, quand: 1000, cles: { 'isnad2.opts': '{"sound":true,"music":true,"low":false}', 'isnad2.essai': 'b' } };
      const disque = new Map([['DATA/isnad2-abri-a.json', { data: '{"isnad":"abri","quand":9999,"cles":{"isnad2.essai":"a"' }], ['DATA/isnad2-abri-b.json', { data: JSON.stringify(bon) }]]);
      let X = await ouvrir({ modes: TOUS, disque });
      let c = await X.cles();
      dit(X.titre > 0 && c['isnad2.essai'] === 'b', `B · abri gâté (le fichier le plus récent coupé en deux) : l’autre est remis (isnad2.essai = ${c['isnad2.essai']})`);
      propre(X, 'B · abri gâté'); await X.fermer();
      // B4 : Filesystem qui refuse
      X = await ouvrir({ modes: { Filesystem: 'refuse', Share: 'repond', App: 'repond' } });
      let P = await X.pont();
      dit(X.titre > 0 && P.ordre === 'abri → démarrage', `B · Filesystem refuse : le jeu démarre quand même (${P.ordre}, ${X.titre} ms) — ${P.journal.slice(-1)[0]}`);
      await partieNeuve(X); await X.p.evaluate(() => window.ISNAD.save.auto('essai')); await X.p.waitForTimeout(800);
      P = await X.pont();
      dit(Object.keys(await X.cles()).length >= 2 && P.journal.some(x => /abri : écriture refusée/.test(x)), `B · Filesystem refuse : la partie se garde dans le stockage de la page, l’abri est dit refusé sans gêner le jeu`);
      propre(X, 'B · Filesystem refuse'); await X.fermer();
      // B5 : Filesystem muet — le délai
      X = await ouvrir({ modes: { Filesystem: 'muet', Share: 'repond', App: 'repond' } });
      P = await X.pont();
      dit(X.titre >= 3500 && X.titre < 9000 && P.demarre === 'après l’abri' && P.journal.some(x => /délai dépassé/.test(x)), `B · Filesystem muet : le démarrage attend (${P.demarre}), puis le jeu démarre au bout du délai (${X.titre} ms ; le délai est de 4 s)`);
      propre(X, 'B · Filesystem muet'); await X.fermer();
      // B6 : Filesystem absent
      X = await ouvrir({ modes: { Filesystem: 'absent', Share: 'repond', App: 'repond' } });
      P = await X.pont();
      dit(X.titre > 0 && P.demarre === 'aussitôt' && !P.greffons.Filesystem, `B · Filesystem absent : démarrage aussitôt, sans abri (${X.titre} ms)`);
      propre(X, 'B · Filesystem absent'); await X.fermer();

      /* ---------- D. « Enregistrer le fichier » ---------- */
      for (const share of ['repond', 'annule', 'absent']) {
        const dq = new Map(), Y = await ouvrir({ modes: { Filesystem: 'repond', Share: share, App: 'repond' }, disque: dq });
        await partieNeuve(Y); await Y.p.evaluate(() => window.ISNAD.save.auto('essai'));
        await Y.p.evaluate(() => window.ISNAD.ui.partie('exporter', () => {})); await Y.p.waitForSelector('#partie:not([hidden])');
        const texte = await Y.p.locator('#partie textarea').inputValue();
        const [dl] = await Promise.all([Y.p.waitForEvent('download', { timeout: 3000 }).catch(() => null), Y.p.locator('#partie button', { hasText: await Y.t('Enregistrer le fichier') }).first().tap()]);
        await Y.p.waitForTimeout(800);
        const f = dq.get('CACHE/partage/isnad-partie.json'), sh = Y.journal.filter(j => j.g === 'Share' && j.m === 'share'), P = await Y.pont();
        if (share === 'repond') dit(f && decode(f).toString('utf8') === texte && sh.length === 1 && sh[0].o.files[0] === 'file:///faux/cache/partage/isnad-partie.json' && !dl,
          `D · « Enregistrer le fichier » : écrit en cache (${f ? (decode(f).length / 1024).toFixed(1) + ' Ko, identique au texte de la partie' : 'RIEN'}), feuille de partage ouverte avec ${sh.length ? sh[0].o.files.join(', ') : 'RIEN'} — le jeu dit « ${await Y.p.locator('#partie .note').textContent()} »`);
        if (share === 'annule') dit(f && sh.length === 1 && P.journal.some(x => /partage annulé/.test(x)), `D · « Enregistrer le fichier », feuille refermée sans choix : rien ne casse (${P.journal.slice(-1)[0]})`);
        if (share === 'absent') dit(!f && !!dl && fs.readFileSync(await dl.path(), 'utf8') === texte, `D · sans greffon Share : le pont s’efface, le jeu remet le fichier comme dans un navigateur (« ${dl ? dl.suggestedFilename() : 'rien'} »)`);
        propre(Y, `D · Share ${share}`); await Y.fermer();
      }

      /* ---------- E. « Partager ma progression » ---------- */
      for (const share of ['repond', 'annule', 'refuse', 'absent']) {
        const dq = new Map(), Y = await ouvrir({ modes: { Filesystem: 'repond', Share: share, App: 'repond' }, disque: dq, vp: { width: 390, height: 844 } });
        await partieNeuve(Y);
        await Y.p.evaluate(() => { const I = window.ISNAD, sv = I.save.data; sv.sagas.abubakr = Object.assign({}, sv.sagas.abubakr, { done: true }); if (!sv.lights.includes(I.sagas.abubakr.light)) sv.lights.push(I.sagas.abubakr.light); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.ui.menuOpen = false; I.ui.showChain(); });
        await Y.p.waitForSelector('#chain:not([hidden])', { timeout: 8000 });
        await Y.p.locator('#chain .chainfoot button', { hasText: await Y.t('Partager ma progression') }).first().tap();
        await Y.p.waitForFunction(() => { const a = document.querySelector('#partage .apercu'); return a && a.getAttribute('aria-busy') === 'false'; }, null, { timeout: 30000 });
        const nav = await Y.p.evaluate(() => ({ share: typeof navigator.share, can: typeof navigator.canShare === 'function' ? navigator.canShare({ files: [new File([new Blob(['x'])], 'x.png', { type: 'image/png' })] }) : null }));
        await Y.p.locator('#partage button', { hasText: await Y.t('Partager') }).first().tap(); await Y.p.waitForTimeout(1500);
        const note = (await Y.p.locator('#partage .note').textContent()).trim(), f = dq.get('CACHE/partage/isnad-progression.png'), sh = Y.journal.filter(j => j.g === 'Share' && j.m === 'share');
        const png = f && decode(f).slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
        if (share === 'repond') {
          dit(nav.share === 'function' && nav.can === true && png && sh.length === 1 && sh[0].o.files && sh[0].o.text && sh[0].o.title && note === await Y.t('Partage transmis à l’application choisie.'),
            `E · « Partager » : navigator.share fourni par le greffon, l’image passée en fichier (PNG de ${f ? (decode(f).length / 1024).toFixed(0) : 0} Ko), le titre « ${sh[0] && sh[0].o.title} » et le texte — le jeu dit « ${note} »`);
          await Y.p.screenshot({ path: path.join(OUT, 'e-partage.png') });
          const enr = await Y.t('Enregistrer l’image'), n0 = Y.journal.filter(j => j.g === 'Share' && j.m === 'share').length;
          if (await Y.p.locator('#partage button', { hasText: enr }).count()) { await Y.p.locator('#partage button', { hasText: enr }).first().tap(); await Y.p.waitForTimeout(1200);
            dit(Y.journal.filter(j => j.g === 'Share' && j.m === 'share').length === n0 + 1, `E · « Enregistrer l’image » : le fichier écrit en cache, la feuille de partage ouverte`); }
          else console.log('·     E · pas de bouton « Enregistrer l’image » au doigt (le jeu le retire sur un écran tactile) : rien à éprouver');
          // F : Retour dans l'aperçu du partage, puis sur l'écran-titre
          const evB = await Y.evenement('App', 'backButton', { canGoBack: false }); await Y.p.waitForTimeout(400);
          const etatB = await Y.p.evaluate(() => ({ cache: document.querySelector('#partage').hidden, actif: document.activeElement && document.activeElement.outerHTML.slice(0, 80) }));
          dit(evB && etatB.cache, `F · Retour : l’aperçu du partage se referme (revenir d’un cran)${etatB.cache ? '' : ' — reçu ' + evB + ', focus ' + etatB.actif + ', ' + (await Y.pont()).journal.slice(-3).join(' · ')}`);
        }
        if (share === 'annule') dit(png && sh.length === 1 && note === await Y.t('Partage annulé.'), `E · feuille de partage refermée sans choix : le jeu dit « ${note} »`);
        if (share === 'refuse') dit(sh.length === 1 && note.startsWith(await Y.t('Le partage n’est pas permis ici.')), `E · partage refusé par le système : le repli du jeu — « ${note.slice(0, 90)}… »`);
        if (share === 'absent') dit(nav.share !== 'function' || !sh.length, `E · sans greffon Share : navigator.share n’est pas posé par le pont (${nav.share}) ; le jeu prend son repli — « ${note.slice(0, 90)}… »`);
        propre(Y, `E · Share ${share}`); await Y.fermer();
      }

      /* ---------- F. Retour sur l'écran-titre : rien ne se ferme, rien ne quitte ---------- */
      { const Y = await ouvrir({ modes: TOUS });
        const avantB = await Y.boutons();
        for (let i = 0; i < 3; i++) { await Y.evenement('App', 'backButton', { canGoBack: false }); await Y.p.waitForTimeout(250); }
        const apresB = await Y.boutons(), quitte = Y.journal.some(j => j.m === 'exitApp' || j.m === 'QUITTE' || j.m === 'minimizeApp');
        dit(JSON.stringify(avantB) === JSON.stringify(apresB) && !quitte && await Y.p.evaluate(() => !document.querySelector('#title').hidden), `F · Retour trois fois sur l’écran-titre : l’écran reste, aucun exitApp ni minimizeApp demandé`);
        propre(Y, 'F · écran-titre'); await Y.fermer(); }
    }
  } finally { await b.close(); srv.close(); }
  console.log(anomalies ? `✗ ÉCART — ${anomalies} anomalie(s) (captures dans v2/.smoke/plateformes/application)` : `✓ PAQUET CONFORME — le pont de l’application (${cibles.join(', ')}), par un faux Capacitor (captures dans v2/.smoke/plateformes/application)`);
  return anomalies;
}

if (require.main === module) {
  const a = process.argv.slice(2), cibles = a.length ? a : ['android', 'ios'];
  if (cibles.some(c => !['android', 'ios'].includes(c))) { console.error('usage : node v2/tools/plateformes/application/essai.js [android] [ios]'); process.exit(2); }
  principal(cibles).then(n => process.exit(n ? 1 : 0), e => { console.error('✗ ' + (e && e.stack || e)); process.exit(1); });
}
module.exports = principal;
