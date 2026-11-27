/* ISNAD 2.x — plateformes : l'essai d'un paquet (node v2/tools/plateformes.js essai <cible>).
   La page éprouvée est celle que la cible rend (fait.page) ; pour itch, l'index.html relu dans le zip.
   a. Sans réseau : aucune requête hors du fichier (data:, blob:, about:) pendant le chargement, l'écran-titre,
      « Nouvelle partie », « Commencer » et les premières répliques — en français, puis en arabe (par les vrais boutons).
   b. Les polices : chaque famille, graisse et style est chargé (document.fonts) et sert vraiment (sa largeur n'est pas
      celle du repli) ; pour une centaine de textes tirés du jeu (français, arabe, arabe vocalisé, anglais, titres en
      Cinzel, chiffres en Share Tech Mono), la largeur mesurée dans le paquet est celle du jeu chargé avec le réseau, à
      0,5 point près (dans la page et sur un canevas) — sinon la mise en page changerait.
   c. Dans un cadre (<iframe>) servi par un petit serveur HTTP local, d'une autre origine que la page hôte (ainsi
      qu'itch.io joue un jeu HTML), en 960 × 540, 390 × 844 et 844 × 390 : le jeu démarre, une partie neuve commence, la
      partie se garde après rechargement du cadre ; « Ta partie » (« Enregistrer le fichier », « Copier le texte »),
      l'import (« Choisir un fichier ») ; « Partager ma progression » et ses replis ; le plein écran. Puis le stockage
      refusé, et un cadre qui accorde plein écran, presse-papiers et partage. Ce qu'un cadre empêche est dit (« · »), sans
      rien corriger dans le jeu.
   d. Puis, un à la fois : JEU=<paquet> node tools/manette.js et node tools/loupe.js (leur dernière ligne, leurs alertes).
   Sortie : « OK » par preuve, « ÉCART » sinon, « · » pour ce qui est constaté sans être une faute ; « PAQUET CONFORME »
   à la fin. Captures dans v2/.smoke/plateformes/<cible>/. Un seul navigateur à la fois. */
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os'), { spawnSync } = require('child_process');

const PILES = {
  corps: '"Alegreya", "Iowan Old Style", Georgia, "Amiri", serif',
  corpsAr: '"Noto Naskh Arabic", "Amiri", "Geeza Pro", "Segoe UI", serif',
  titreAr: '"Reem Kufi", "Noto Kufi Arabic", "Geeza Pro", "Segoe UI", sans-serif',
  titre: '"Cinzel", "Trajan Pro", "Times New Roman", "Amiri", serif',
  mono: '"Share Tech Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
  verset: '"Amiri Quran", "Amiri", "Noto Naskh Arabic", serif',
  amiri: '"Amiri", serif'
};

// une centaine de textes du jeu, pris dans ses langues (les mêmes à chaque essai : un tirage régulier)
function textesDuJeu(C) {
  const lire = f => JSON.parse(fs.readFileSync(path.join(C.V2, 'src/lang', f), 'utf8')).textes;
  const pris = (L, n, champ) => { const v = L.map(x => x[champ]).filter(t => typeof t === 'string' && t.length > 3 && t.length < 160); const r = []; for (let i = 0; i < n; i++) r.push(v[Math.floor(i * v.length / n)]); return [...new Set(r)]; };
  const ar = [...lire('ar/frame.json'), ...lire('ar/saga_abubakr.json'), ...lire('ar/moteur.json')], en = [...lire('en/frame.json'), ...lire('en/saga_umar.json'), ...lire('en/moteur.json')];
  const v = [...lire('ar/voyelles/frame.json'), ...lire('ar/voyelles/saga_ali.json')];
  const T = [];
  pris(ar, 25, 'fr').forEach(t => T.push({ l: 'fr', t, piles: [['corps', 'normal', 400], ['corps', 'normal', 700], ['corps', 'italic', 400]] }));
  pris(ar, 25, 't').forEach(t => T.push({ l: 'ar', t, piles: [['corpsAr', 'normal', 400], ['corpsAr', 'normal', 700], ['titreAr', 'normal', 500], ['titreAr', 'normal', 700]] }));
  pris(v, 15, 'tv').forEach(t => T.push({ l: 'arv', t, piles: [['corpsAr', 'normal', 400], ['verset', 'normal', 400], ['amiri', 'normal', 400]] }));
  pris(en, 20, 't').forEach(t => T.push({ l: 'en', t, piles: [['corps', 'normal', 400], ['corps', 'italic', 400]] }));
  ['ISNAD', 'La Chaîne', 'Chroniques des Compagnons', 'Nouvelle partie', 'Réglages', 'Halte', 'Ta partie', 'Partager ma progression', 'The Chain', 'Abû Bakr · Khâlid · ‘Umar'].forEach(t => T.push({ l: 'titre', t, piles: [['titre', 'normal', 500], ['titre', 'normal', 700]] }));
  ['0123456789', 'ISNAD 2.47 · 2026-11-27 05:18 UTC', '× 1,5 · 12:34 · 99 %', 'Niyya − 1 · Sérénité − 10', '1507 H · 2084', 'HP 120/120 MP 30/30'].forEach(t => T.push({ l: 'mono', t, piles: [['mono', 'normal', 400]] }));
  T.push({ l: 'ar', t: 'إسناد', piles: [['titreAr', 'normal', 700], ['amiri', 'normal', 400]] });
  return T;
}

// ce que le navigateur mesure, pour chaque texte et chaque pile : dans la page (un span) et sur un canevas
const MESURER = ([T, PILES]) => (async () => {
  const specs = [...new Set(T.flatMap(x => x.piles.map(([p, s, g]) => `${s} ${g} 20px ${PILES[p]}`)))];
  await Promise.all(T.flatMap(x => x.piles.map(([p, s, g]) => document.fonts.load(`${s} ${g} 20px ${PILES[p]}`, x.t).catch(() => null))));
  await document.fonts.ready;
  const sp = document.createElement('span'); sp.style.cssText = 'position:absolute;left:0;top:0;white-space:pre;visibility:hidden;font-size:20px;line-height:1;font-kerning:auto';
  document.body.appendChild(sp); const cx = document.createElement('canvas').getContext('2d'), R = [];
  for (const x of T) for (const [p, s, g] of x.piles) {
    const f = `${s} ${g} 20px ${PILES[p]}`; sp.style.font = f; sp.textContent = x.t; sp.dir = /^ar/.test(x.l) ? 'rtl' : 'ltr'; cx.font = f;
    R.push({ l: x.l, t: x.t, f: `${p} ${s} ${g}`, dom: sp.getBoundingClientRect().width, canevas: cx.measureText(x.t).width });
  }
  sp.remove();
  const faces = {}; document.fonts.forEach(ff => { const k = `${ff.family.replace(/["']/g, '')} ${ff.weight} ${ff.style}`; faces[k] = faces[k] || []; faces[k].push(ff.status); });
  return { R, faces, specs: specs.length };
})();

module.exports = async function essai(C, cible, module, fait) {
  const { chromium, devices } = require('playwright');
  let page = fait.page;
  // pour un zip : la page relue dans le zip, posée dans un dossier à part
  if (fait.zip) { const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'isnad-' + cible + '-')), L = C.lireZip(fs.readFileSync(fait.zip)); L.forEach(e => fs.writeFileSync(path.join(tmp, e.nom), e.donnees)); page = path.join(tmp, 'index.html'); }
  const out = path.join(C.V2, '.smoke/plateformes', cible); fs.mkdirSync(out, { recursive: true });
  let anomalies = 0; const constats = [];
  const dit = (v, m) => { if (!v) anomalies++; console.log((v ? 'OK  ' : 'ÉCART ') + m); };
  const note = m => { constats.push(m); console.log('·   ' + m); };
  console.log(`— essai du paquet ${cible} : ${path.relative(C.RACINE, fait.zip || page)}`);
  if (fait.zip) dit(fait.entrees.length === 1 && fait.entrees[0] === 'index.html', `le zip ne contient que index.html, à sa racine (${fait.entrees.join(', ')}) ; ${C.mo(fs.statSync(fait.zip).size)}`);

  const b = await chromium.launch();
  const T = textesDuJeu(C);
  try {
    /* ---------- a. aucune requête au-dehors ---------- */
    for (const lang of ['fr', 'ar']) {
      const ctx = await b.newContext({ viewport: { width: 960, height: 540 } }), p = await ctx.newPage(), dehors = [], erreurs = [], self = 'file://' + page;
      await ctx.route('**/*', r => { const u = r.request().url(); if (u === self || /^(data|blob|about):/.test(u)) return r.continue(); dehors.push(u); return r.abort(); });
      p.on('request', r => { const u = r.url(); if (u !== self && !/^(data|blob|about):/.test(u) && !dehors.includes(u)) dehors.push(u); });
      p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
      await p.goto(self); await p.waitForFunction(() => !document.querySelector('#title').hidden && document.querySelectorAll('#title .vmenu button').length > 0, null, { timeout: 20000 });
      if (lang === 'ar') { await p.locator('#title .vmenu button', { hasText: 'العربية' }).first().click(); await p.waitForFunction(() => document.documentElement.lang === 'ar' || (window.ISNAD.langue && window.ISNAD.langue.code() === 'ar'), null, { timeout: 5000 }).catch(() => {}); }
      const t = s => p.evaluate(s => window.ISNAD.t(s), s);
      await p.locator('#title .vmenu button', { hasText: await t('Nouvelle partie') }).first().click();
      await p.waitForSelector('#perso:not([hidden])', { timeout: 10000 }); await p.locator('#perso button', { hasText: await t('Commencer') }).first().click();
      const repliques = [];
      for (let i = 0; i < 40 && repliques.length < 3; i++) {
        const r = await p.evaluate(() => { const d = document.querySelector('#dialog'); return d && !d.hidden ? d.querySelector('.text').textContent.trim() : ''; });
        if (r && !repliques.includes(r) && r.length > 3) { repliques.push(r); await p.waitForTimeout(400); }
        await p.keyboard.press('Enter'); await p.waitForTimeout(500);
      }
      if (lang === 'fr' || lang === 'ar') await p.screenshot({ path: path.join(out, `a-${lang}.png`) });
      const code = await p.evaluate(() => window.ISNAD.langue.code());
      dit(repliques.length >= 2 && code === lang, `a · ${lang} : l’écran-titre, « Nouvelle partie », « Commencer », ${repliques.length} répliques (« ${(repliques[0] || '').slice(0, 50)}… ») — langue ${code}`);
      dit(!dehors.length, `a · ${lang} : aucune requête hors du fichier${dehors.length ? ' — ' + dehors.slice(0, 4).join(' | ') : ' (seuls le fichier, data: et blob:)'}`);
      dit(!erreurs.length, `a · ${lang} : aucune erreur console${erreurs.length ? ' — ' + [...new Set(erreurs)].slice(0, 3).join(' | ').slice(0, 300) : ''}`);
      await ctx.close();
    }

    /* ---------- b. les polices : chargées, servies, mêmes largeurs que le jeu avec le réseau ---------- */
    const mesurer = async (u, reseau) => { const ctx = await b.newContext({ viewport: { width: 960, height: 540 } }), p = await ctx.newPage(); const dehors = [];
      if (!reseau) await ctx.route('**/*', r => { const x = r.request().url(); if (/^(file|data|blob|about):/.test(x)) return r.continue(); dehors.push(x); return r.abort(); });
      await p.goto(u); await p.waitForFunction(() => !document.querySelector('#title').hidden, null, { timeout: 20000 });
      const m = await p.evaluate(MESURER, [T, PILES]);
      // la largeur du repli générique de la pile (serif, sans-serif, monospace) (la police sert-elle vraiment ?)
      m.repli = await p.evaluate(([T, PILES]) => { const cx = document.createElement('canvas').getContext('2d'), R = {}; for (const x of T) for (const [pp, s, g] of x.piles) { const pile = PILES[pp].split(',').pop().trim(); cx.font = `${s} ${g} 20px ${pile}`; R[`${pp} ${s} ${g}|${x.t}`] = cx.measureText(x.t).width; } return R; }, [T, PILES]);
      await ctx.close(); return Object.assign(m, { dehors }); };
    const ref = await mesurer('file://' + path.join(C.V2, 'index.html'), true), paq = await mesurer('file://' + page, false);
    const familles = [...new Set(fait.P.fichiers.map(f => `${f.famille} ${f.graisse} ${f.style}`))];
    for (const k of familles) {
      const s = paq.faces[k] || [], r = ref.faces[k] || [];
      dit(s.includes('loaded') && r.includes('loaded'), `b · ${k} : chargée dans le paquet (${s.filter(x => x === 'loaded').length}/${s.length} tranches) comme dans le jeu avec le réseau (${r.filter(x => x === 'loaded').length}/${r.length})`);
    }
    let pire = { d: 0 }, ecarts = [], servies = {}, n = 0;
    paq.R.forEach((x, i) => { const y = ref.R[i]; n++;
      const d = Math.max(Math.abs(x.dom - y.dom), Math.abs(x.canevas - y.canevas)); if (d > pire.d) pire = { d, x }; if (d > 0.5) ecarts.push(`${x.l} « ${x.t.slice(0, 30)} » (${x.f}) : ${y.dom.toFixed(2)} → ${x.dom.toFixed(2)}`);
      const fam = x.f.split(' ')[0]; servies[fam] = servies[fam] || { oui: 0, n: 0 }; servies[fam].n++; if (Math.abs(x.canevas - paq.repli[`${x.f}|${x.t}`]) > 0.5) servies[fam].oui++; });
    dit(!ecarts.length, `b · ${T.length} textes, ${n} mesures (page et canevas) : la largeur dans le paquet est celle du jeu avec le réseau, à 0,5 point près (écart le plus grand : ${pire.d.toFixed(3)} pt${pire.x ? `, ${pire.x.l} ${pire.x.f}` : ''})${ecarts.length ? ' — ' + ecarts.slice(0, 5).join(' | ') : ''}`);
    dit(Object.values(servies).every(s => s.oui >= s.n * 0.9), `b · chaque police sert vraiment (sa largeur n’est pas celle du repli) : ${Object.entries(servies).map(([k, s]) => `${k} ${s.oui}/${s.n}`).join(', ')}`);
    dit(!paq.dehors.length, `b · le paquet mesuré sans réseau n’a rien demandé au-dehors${paq.dehors.length ? ' — ' + paq.dehors.slice(0, 3).join(' | ') : ''}`);

    /* ---------- c. dans un cadre d'une autre origine ---------- */
    const servir = (fichiers) => new Promise(res => { const s = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = fichiers[u === '/' ? '/index.html' : u]; if (!f) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': f.type, 'Cache-Control': 'no-store' }); r.end(f.donnees); }); s.listen(0, '127.0.0.1', () => res(s)); });
    const jeu = await servir({ '/index.html': { type: 'text/html; charset=utf-8', donnees: fs.readFileSync(page) } });
    const portJeu = jeu.address().port, origineJeu = `http://localhost:${portJeu}`;
    const hote = await servir({
      '/index.html': { type: 'text/html; charset=utf-8', donnees: `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>hôte</title><style>html,body{margin:0;height:100%;background:#222}iframe{border:0;width:100vw;height:100vh;display:block}</style><iframe id="jeu" src="${origineJeu}/index.html"></iframe>` },
      '/permis.html': { type: 'text/html; charset=utf-8', donnees: `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>hôte</title><style>html,body{margin:0;height:100%;background:#222}iframe{border:0;width:100vw;height:100vh;display:block}</style><iframe id="jeu" src="${origineJeu}/index.html" allow="autoplay; fullscreen; clipboard-read; clipboard-write; web-share" allowfullscreen></iframe>` } });
    const origineHote = `http://127.0.0.1:${hote.address().port}`;
    console.log(`·   cadre : la page hôte sur ${origineHote}, le jeu sur ${origineJeu} (deux sites différents)`);
    const tmpDl = fs.mkdtempSync(path.join(os.tmpdir(), 'isnad-cadre-'));

    const ouvrirCadre = async (vp, o) => { o = o || {};
      const tactile = vp.width < 900 && vp.height < 900 && vp.width !== 960;
      const ctx = await b.newContext(Object.assign({ viewport: vp, acceptDownloads: true }, tactile ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2, userAgent: devices['iPhone 13'].userAgent } : {}));
      if (o.sansStockage) await ctx.addInitScript(port => { if (location.port === String(port)) { const refus = () => { throw new DOMException('Le stockage est refusé', 'SecurityError'); }; Object.defineProperty(window, 'localStorage', { configurable: true, get: refus }); Object.defineProperty(window, 'sessionStorage', { configurable: true, get: refus }); } }, portJeu);
      const p = await ctx.newPage(), erreurs = [], dehors = [];
      const politique = []; p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() !== 'error') return; (/Permissions policy violation/.test(m.text()) ? politique : erreurs).push(m.text()); });
      p.on('request', r => { const u = r.url(); if (!u.startsWith(origineHote) && !u.startsWith(origineJeu) && !/^(data|blob|about):/.test(u)) dehors.push(u); });
      await p.goto(origineHote + (o.permis ? '/permis.html' : '/index.html'));
      const cadre = async () => { for (let i = 0; i < 100; i++) { const f = p.frames().find(x => x.url().startsWith(origineJeu)); if (f) return f; await p.waitForTimeout(100); } throw new Error('le cadre ne s’ouvre pas'); };
      let f = await cadre();
      const titre = async () => { f = await cadre(); await f.waitForFunction(() => window.ISNAD && !document.querySelector('#title').hidden && document.querySelectorAll('#title .vmenu button').length > 0, null, { timeout: 25000 }); };
      await titre();
      const toucher = async (sel, texte) => { const l = f.locator(sel, texte ? { hasText: texte } : undefined).first(); await l.waitFor({ state: 'visible', timeout: 10000 }); if (tactile) await l.tap(); else await l.click(); };
      return { ctx, p, get f() { return f; }, titre, toucher, tactile, erreurs, politique, dehors, t: s => f.evaluate(s => window.ISNAD.t(s), s) };
    };
    const partieNeuve = async X => {
      // (au premier toucher en largeur, le jeu demande le plein écran : si ce toucher ne passe pas au bouton, on le redit)
      X.touchers = 0;
      for (let i = 0; i < 3; i++) { await X.toucher('#title .vmenu button', await X.t('Nouvelle partie')); X.touchers++; if (await X.f.waitForSelector('#perso:not([hidden])', { timeout: 4000 }).then(() => true, () => false)) break; }
      await X.toucher('#perso button', await X.t('Commencer'));
      await X.f.waitForFunction(() => { const d = document.querySelector('#dialog'); return d && !d.hidden && d.querySelector('.text').textContent.trim().length > 3; }, null, { timeout: 30000 }).catch(() => {});
      return X.f.evaluate(() => { const d = document.querySelector('#dialog'); return d && !d.hidden ? d.querySelector('.text').textContent.trim() : ''; });
    };
    const titreBoutons = X => X.f.evaluate(() => [...document.querySelectorAll('#title .vmenu button')].map(x => x.textContent.trim()));

    for (const [nom, vp] of [['960 × 540', { width: 960, height: 540 }], ['390 × 844', { width: 390, height: 844 }], ['844 × 390', { width: 844, height: 390 }]]) {
      const X = await ouvrirCadre(vp), cle = nom.replace(/ × /, 'x');
      const etat = await X.f.evaluate(() => ({ touch: document.body.classList.contains('touch'), immersif: document.body.classList.contains('immersif'), w: innerWidth, h: innerHeight, plein: !!(document.fullscreenEnabled), politique: document.featurePolicy ? ['fullscreen', 'clipboard-write', 'web-share', 'autoplay'].filter(k => document.featurePolicy.allowsFeature(k)) : null }));
      dit(true, `c · ${nom} : le jeu démarre dans le cadre (${etat.w} × ${etat.h}${etat.touch ? ', tactile' : ''}${etat.immersif ? ', immersif' : ''})`);
      await X.p.screenshot({ path: path.join(out, `c-${cle}-titre.png`) });
      // le plein écran : au premier toucher en largeur, le jeu le demande (U.pleinEcran)
      const r1 = await partieNeuve(X);
      dit(r1.length > 3, `c · ${nom} : une partie neuve commence (« ${r1.slice(0, 50)}… »)`);
      if (X.tactile && vp.width > vp.height) { const fe = await X.f.evaluate(() => ({ el: !!document.fullscreenElement, permis: document.fullscreenEnabled })); note(`${nom}, cadre sans « allowfullscreen » : plein écran ${fe.el ? 'obtenu' : 'non obtenu'} (document.fullscreenEnabled = ${fe.permis}) ; politique du cadre : ${etat.politique ? etat.politique.join(', ') || 'rien de plus' : '?'}`); }
      await X.p.waitForTimeout(800); await X.p.screenshot({ path: path.join(out, `c-${cle}-partie.png`) });
      // la partie se garde : rechargement du cadre, « Continuer »
      await X.f.waitForTimeout(2500);
      const cles = await X.f.evaluate(() => { try { return Object.keys(localStorage).filter(k => /^isnad2\./.test(k)); } catch (e) { return ['refusé : ' + e.name]; } });
      await X.f.evaluate(() => location.reload()); await X.titre();
      const tb = await titreBoutons(X), cont = await X.t('Continuer');
      dit(tb.some(x => x.startsWith(cont)), `c · ${nom} : la partie se garde dans le cadre (clés ${cles.join(', ')}) ; cadre rechargé, l’écran-titre offre « ${(tb.find(x => x.startsWith(cont)) || tb[0] || '').slice(0, 60)} »`);
      // « Ta partie » : exporter (le fichier, la copie), puis importer le fichier
      await X.toucher('#title .vmenu button', cont); await X.f.waitForTimeout(1500);
      await X.f.evaluate(() => window.ISNAD.ui.partie('exporter', () => {})); await X.f.waitForSelector('#partie:not([hidden])');
      const [dl] = await Promise.all([X.p.waitForEvent('download', { timeout: 8000 }).catch(() => null), X.toucher('#partie button', await X.t('Enregistrer le fichier'))]);
      let fichier = null; if (dl) { fichier = path.join(tmpDl, `partie-${cle}.json`); await dl.saveAs(fichier); }
      const noteF = await X.f.locator('#partie .note').textContent();
      const texte = await X.f.locator('#partie textarea').inputValue();
      dit(!!fichier && fs.readFileSync(fichier, 'utf8') === texte, `c · ${nom} : « Ta partie » → « Enregistrer le fichier » : ${fichier ? `« ${dl.suggestedFilename()} » reçu, ${C.ko(fs.statSync(fichier).size)}, identique au texte` : 'aucun fichier reçu'} — le jeu dit « ${noteF} »`);
      await X.toucher('#partie button', await X.t('Copier le texte')); await X.f.waitForTimeout(600);
      const noteC = await X.f.locator('#partie .note').textContent();
      note(`${nom} : « Copier le texte » dans le cadre (sans clipboard-write) — le jeu dit « ${noteC} »`);
      await X.f.evaluate(() => { document.querySelectorAll('.screen').forEach(e => { if (e.id === 'partie') e.hidden = true; }); window.ISNAD.ui.menuOpen = false; window.ISNAD.ui.partie('importer', () => {}); });
      await X.f.waitForSelector('#partie:not([hidden]) textarea');
      const [fc] = await Promise.all([X.p.waitForEvent('filechooser', { timeout: 8000 }).catch(() => null), X.toucher('#partie button', await X.t('Choisir un fichier'))]);
      if (fc && fichier) await fc.setFiles(fichier);
      const conf = await X.f.waitForFunction(() => /Remplacer|Reprendre|استبدل|استأنف|Replace|Resume/.test([...document.querySelectorAll('#partie button')].map(x => x.textContent).join(' ')) && [...document.querySelectorAll('#partie button')].map(x => x.textContent), null, { timeout: 8000 }).then(h => h.jsonValue(), () => null);
      dit(!!fc && !!conf, `c · ${nom} : l’import — « Choisir un fichier » ouvre le sélecteur dans le cadre${fc ? '' : ' (AUCUN sélecteur)'}, le fichier lu, le jeu propose ${conf ? '« ' + conf[0] + ' »' : 'rien'}`);
      if (conf) { await X.toucher('#partie button', conf[0]); await X.f.waitForTimeout(1500); }
      const repris = await X.f.evaluate(() => document.querySelector('#partie').hidden && !!window.ISNAD.save.data.started);
      dit(repris, `c · ${nom} : la partie importée est reprise`);
      // « Partager ma progression » : un maillon achevé (posé dans la partie), la Chaîne, l'aperçu, les trois gestes
      await X.f.evaluate(() => { const I = window.ISNAD, sv = I.save.data; sv.sagas.abubakr = Object.assign({}, sv.sagas.abubakr, { done: true }); if (!sv.lights.includes(I.sagas.abubakr.light)) sv.lights.push(I.sagas.abubakr.light); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); I.ui.menuOpen = false; I.ui.showChain(); });
      await X.f.waitForSelector('#chain:not([hidden])', { timeout: 8000 });
      await X.toucher('#chain .chainfoot button', await X.t('Partager ma progression'));
      const pret = await X.f.waitForFunction(() => { const a = document.querySelector('#partage .apercu'); return a && a.getAttribute('aria-busy') === 'false'; }, null, { timeout: 30000 }).then(() => true, () => false);
      const nav = await X.f.evaluate(() => ({ share: typeof navigator.share, canShare: typeof navigator.canShare, clipboard: !!(navigator.clipboard && navigator.clipboard.writeText) }));
      dit(pret, `c · ${nav ? nom : nom} : « Partager ma progression » — l’aperçu se dessine dans le cadre`);
      await X.p.screenshot({ path: path.join(out, `c-${cle}-partage.png`) });
      const noteDe = () => X.f.locator('#partage .note').textContent();
      await X.toucher('#partage button', await X.t('Partager')); await X.f.waitForTimeout(2200);
      note(`${nom} : « Partager » (navigator.share : ${nav.share}, canShare : ${nav.canShare}) — le jeu dit « ${await noteDe()} »`);
      await X.toucher('#partage button', await X.t('Copier le texte')); await X.f.waitForTimeout(2000);
      note(`${nom} : « Copier le texte » du partage — « ${await noteDe()} »`);
      const enr = await X.t('Enregistrer l’image'), aEnr = await X.f.locator('#partage button', { hasText: enr }).count();
      if (aEnr) { const [d2] = await Promise.all([X.p.waitForEvent('download', { timeout: 8000 }).catch(() => null), X.toucher('#partage button', enr)]);
        dit(!!d2, `c · ${nom} : « Enregistrer l’image » remet ${d2 ? '« ' + d2.suggestedFilename() + ' »' : 'RIEN'} depuis le cadre — « ${await noteDe()} »`); }
      else note(`${nom} : pas de bouton « Enregistrer l’image » (au doigt, l’image se garde d’un appui long)`);
      if (X.politique.length) note(`${nom} : le navigateur signale dans la console ce que la politique du cadre bloque — ${[...new Set(X.politique)].map(x => x.replace(/ See https.*$/, '')).join(' | ')} (le jeu se replie alors sur la vieille commande de copie)`);
      dit(!X.erreurs.length, `c · ${nom} : aucune erreur console dans le cadre${X.erreurs.length ? ' — ' + [...new Set(X.erreurs)].slice(0, 3).join(' | ').slice(0, 300) : ''}`);
      dit(!X.dehors.length, `c · ${nom} : aucune requête hors des deux serveurs locaux${X.dehors.length ? ' — ' + X.dehors.slice(0, 3).join(' | ') : ''}`);
      await X.ctx.close();
    }
    // le stockage refusé (un navigateur qui bloque le stockage des cadres tiers)
    { const X = await ouvrirCadre({ width: 960, height: 540 }, { sansStockage: true });
      const r = await partieNeuve(X);
      const etat = await X.f.evaluate(() => ({ autoKo: !!window.ISNAD.save.autoKo, started: !!window.ISNAD.save.data.started }));
      await X.f.waitForTimeout(2500); await X.f.evaluate(() => location.reload()); await X.titre();
      const tb = await titreBoutons(X), cont = await X.t('Continuer');
      dit(r.length > 3, `c · stockage refusé : le jeu démarre quand même et une partie neuve commence (« ${r.slice(0, 40)}… »)`);
      note(`stockage refusé : ${etat.autoKo ? 'la sauvegarde automatique est refusée (la page Diagnostic le dit)' : 'aucune écriture tentée encore'} ; rien n’est dit au joueur pendant le jeu ; après rechargement l’écran-titre offre ${tb.map(x => '« ' + x.slice(0, 24) + ' »').join(', ')} — ${tb.some(x => x.startsWith(cont)) ? 'la partie est retrouvée' : 'la partie est PERDUE (pas de « Continuer ») ; « Ta partie » → « Enregistrer le fichier » reste le seul moyen de la garder'}`);
      dit(!X.erreurs.length, `c · stockage refusé : aucune erreur console${X.erreurs.length ? ' — ' + [...new Set(X.erreurs)].slice(0, 3).join(' | ').slice(0, 300) : ''}`);
      await X.ctx.close(); }
    // un cadre qui accorde plein écran, presse-papiers et partage (allow=…, allowfullscreen)
    { const X = await ouvrirCadre({ width: 844, height: 390 }, { permis: true });
      const pol = await X.f.evaluate(() => (document.featurePolicy ? ['fullscreen', 'clipboard-write', 'web-share', 'autoplay'].filter(k => document.featurePolicy.allowsFeature(k)) : []));
      await partieNeuve(X); await X.f.waitForTimeout(500);
      const fe = await X.f.evaluate(() => ({ el: !!document.fullscreenElement, permis: document.fullscreenEnabled }));
      note(`844 × 390, cadre permissif : « Nouvelle partie » touché ${X.touchers} fois avant que l’écran du personnage s’ouvre${X.touchers > 1 ? ' (le premier toucher en largeur passe au plein écran)' : ''}`);
      note(`844 × 390, cadre avec allow="fullscreen; clipboard-write; web-share" allowfullscreen : politique ${pol.join(', ')} ; plein écran ${fe.el ? 'obtenu au premier toucher' : 'non obtenu'} (fullscreenEnabled = ${fe.permis})`);
      await X.ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: origineJeu }).catch(() => {});
      await X.f.evaluate(() => window.ISNAD.ui.partie('exporter', () => {})); await X.f.waitForSelector('#partie:not([hidden])');
      await X.toucher('#partie button', await X.t('Copier le texte')); await X.f.waitForTimeout(600);
      note(`844 × 390, cadre permissif, presse-papiers accordé : « Copier le texte » — « ${await X.f.locator('#partie .note').textContent()} »`);
      await X.ctx.close(); }
    jeu.close(); hote.close();
  } finally { await b.close(); }

  /* ---------- d. manette.js et loupe.js sur le paquet, l'un après l'autre ---------- */
  for (const outil of process.env.SANS_D ? [] : ['manette.js', 'loupe.js']) {   // (SANS_D=1 : pour un essai rapide, sans eux)
    const r = spawnSync('node', ['tools/' + outil], { cwd: C.V2, env: Object.assign({}, process.env, { JEU: path.relative(C.V2, page) }), encoding: 'utf8', maxBuffer: 256e6, timeout: 1800000 });
    const sortie = (r.stdout || '') + (r.stderr || ''), lignes = sortie.trim().split('\n'), derniere = lignes[lignes.length - 1] || '';
    fs.writeFileSync(path.join(out, outil.replace('.js', '.txt')), sortie);
    const alertes = [...new Set((sortie.match(/\b(REFUS|BLOQUÉ|ABSENT|INACCESSIBLE|INVISIBLE|TRAIT|ÉCART|RECOUVERT|DÉBORDE|SOMBRE|SUPERPOSÉ|COINCÉ|TEXTE CACHÉ)\b/g) || []))];
    const oks = lignes.filter(l => /^OK\b/.test(l)).length;
    dit(r.status === 0 && !alertes.length, `d · JEU=${path.relative(C.V2, page)} node tools/${outil} : code ${r.status}, ${oks} « OK », alertes : ${alertes.join(', ') || 'aucune'} — dernière ligne : « ${derniere.slice(0, 200)} »`);
    if (alertes.length) lignes.filter(l => alertes.some(a => l.includes(a))).slice(0, 8).forEach(l => console.log('      ' + l.slice(0, 300)));
  }

  console.log(anomalies ? `✗ ÉCART — ${anomalies} anomalie(s) (captures dans v2/.smoke/plateformes/${cible})` : `✓ PAQUET CONFORME — ${cible} (captures dans v2/.smoke/plateformes/${cible})`);
  if (constats.length) { console.log('Ce qu’un cadre empêche ou change (constaté, rien de corrigé dans le jeu) :'); constats.forEach(c => console.log('  · ' + c)); }
  return anomalies;
};
