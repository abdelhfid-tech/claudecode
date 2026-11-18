#!/usr/bin/env node
/* ISNAD 2.x — le personnage du joueur : le nom du râwî, et ce qu'il porte (son ensemble, et ce que le joueur compose).
   Usage : node tools/personnage.js
   1. Les noms : ceux qui passent, ceux qui sont refusés et pourquoi. Le nom dans les textes : chaque phrase du jeu qui
      nomme le râwî, redite avec six noms — plus un « Idris », et la bonne élision (« de Khalil », « d’Elyas »).
   2. Sans rien choisir, rien ne change : les phrases, le sceau et la silhouette sont ceux d'origine, à l'identique — même
      avec des choix qui valent ceux d'origine.
   2 bis. Le râwî composé, ses règles : une composition abîmée est oubliée ; changer d'habit ne change pas un point du
      visage ; le dé (mille tirages) ne touche jamais au visage, ne met jamais la calotte sans manteau, ne sort pas des
      listes ; les teints restent dans l'ordre sous la capuche, aucun ne donne le visage d'un autre, dans les trois dessins ;
      aucune composition n'a la coiffe et la coupe d'un Compagnon des récits, ni celles de Sâlim ; l'objet porté ne
      change ni l'équipement de départ ni le combat ; un récit ou un paquet n'écrit ni teint ni trait.
   3. Par les vrais boutons, en quatre tailles d'écran : « Nouvelle partie » ouvre « Ton personnage » sur Idris, tout
      choisi ; un nom refusé bloque ; chaque ensemble, chaque teint, chaque barbe et chaque poil se touchent et se voient ;
      un nom, un ensemble et un visage choisis, le prologue se joue en entier — tout ce qui s'affiche est relevé : le nom
      choisi y paraît (dialogue, combat, objectifs, Chaîne), « Idris » n'y paraît plus ; le râwî de la carte est celui
      que l'on a composé. Peu de mots, aucun texte sous 10,5 points, rien qui déborde, « Commencer » à l'écran ; le champ
      du nom a son nom pour les lecteurs d'écran, et le clavier du téléphone n'y corrige pas un prénom.
   3 bis. Les téléphones courants, en largeur et en hauteur (640 × 360, 667 × 375, 568 × 320, 320 × 568) : à l'ouverture
      et dans chaque onglet, aucun mot coupé dans un bouton, rien hors de l'écran, aucune case sous la taille d'un doigt.
   4. La composition entière, depuis la Chaîne : quatre onglets, chaque case touchée change l'aperçu ; la calotte et
      « sans manteau » s'excluent, la case qui ne va pas s'éteint ; le dé, ↺ ; la composition gardée (partie gardée,
      rechargée), changée depuis la halte au milieu d'un chapitre, exportée puis importée ailleurs ; un profil abîmé
      ramène Idris.
   5. En arabe : l'écran se lit de droite à gauche, sans déborder. 6. Au clavier : une souris immobile ne prend pas la
      main, les flèches vont de case en case, Entrée choisit, puis commence.
   Sortie : « OK » par preuve, « ÉCART », « BLOQUÉ », « INVISIBLE » ou « REFUS » sinon ; captures dans .smoke/personnage/
   (dont la planche des six tenues). Code 1 à la première anomalie. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/personnage'), url = 'file://' + path.resolve(V2, process.env.JEU || 'index.html');   // JEU=… : le même contrôle sur un autre assemblage
fs.mkdirSync(out, { recursive: true });
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); };

/* ---------- dans la page : l'état de l'écran « Ton personnage » ---------- */
const ETAT = () => { const s = document.querySelector('#perso'), vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 3 && r.height > 3 && r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1; };
  const grp = i => [...s.querySelectorAll('.pv-panneau .pv-groupe')][i], choisi = g => g ? [...g.querySelectorAll('.pv-c')].findIndex(b => b.getAttribute('aria-checked') === 'true') : -1;
  const textes = [...s.querySelectorAll('h2, button, input, .pv-note')].filter(e => e.offsetParent && (e.textContent || e.value || '').trim() && getComputedStyle(e).display !== 'none').map(e => parseFloat(getComputedStyle(e).fontSize));
  const mots = (s.innerText || '').split(/\s+/).filter(x => /\p{L}/u.test(x)), ok = s.querySelector('.ok'), champ = s.querySelector('input'), face = s.querySelector('.pv-fig img');
  const cases = [...s.querySelectorAll('.pv-c, .pv-onglet, .pv-rond')];
  return { ouvert: !s.hidden, nom: champ && champ.value, ensembles: s.querySelectorAll('.pv-ens .pv-c').length, ensemble: choisi(s.querySelector('.pv-ens .pv-groupe')),
    onglets: s.querySelectorAll('.pv-onglet').length, onglet: s.querySelector('.pv-onglet.choisie') ? s.querySelector('.pv-onglet.choisie').dataset.o : null, panneau: s.querySelector('.pv-panneau') ? s.querySelector('.pv-panneau').dataset.o : null,
    groupes: [...s.querySelectorAll('.pv-panneau .pv-groupe')].map(g => g.querySelectorAll('.pv-c').length), choix: [...s.querySelectorAll('.pv-panneau .pv-groupe')].map(choisi), eteintes: [...s.querySelectorAll('.pv-panneau .pv-groupe')].map(g => [...g.querySelectorAll('.pv-c')].map((b, i) => b.disabled ? i : -1).filter(i => i >= 0)),
    ok: ok && ok.textContent, okVisible: vis(ok), champVisible: vis(champ), retour: [...s.querySelectorAll('button')].some(b => /Retour/.test(b.textContent)), proche: !!s.querySelector('.pv.proche'),
    defile: s.scrollHeight > s.clientHeight + 1, large: s.scrollWidth > s.clientWidth + 1, invisibles: cases.filter(c => !vis(c)).length, petitesCases: cases.filter(c => { const r = c.getBoundingClientRect(); return r.width < 41.5 || r.height < 41.5; }).length,
    plusPetiteCase: Math.min(...cases.filter(c => c.offsetParent).map(c => { const r = c.getBoundingClientRect(); return Math.min(r.width, r.height); })),
    // un bouton dont le mot déborde (tassé par la mise en page) : « Commencer », « Garder », « ◂ Retour », « Écrire »
    coupes: [...s.querySelectorAll('button')].filter(b => b.offsetParent && b.textContent.trim() && b.scrollWidth > b.clientWidth + 1).map(b => b.textContent.trim() + ' ' + b.scrollWidth + '/' + b.clientWidth),
    horsEcran: [...s.querySelectorAll('button, input')].filter(b => b.offsetParent && !vis(b)).map(b => (b.getAttribute('aria-label') || b.textContent || b.className).trim().slice(0, 24)),
    // le champ du nom : son nom pour les lecteurs d'écran, et un clavier de téléphone qui ne corrige pas un prénom
    champ: champ ? { id: champ.id, dit: champ.getAttribute('aria-label') || '', orthographe: champ.spellcheck, majuscules: champ.autocapitalize, touche: champ.enterKeyHint } : null,
    petitTexte: textes.length ? Math.min(...textes) : 99, mots: mots.length, texte: mots.join(' '), face: face ? face.src : '', retouche: !!s.querySelector('.pv-ens .pv-c.retouche'), sel: (s.querySelector('button.sel') || {}).className || '' }; };
// les points de l'ouverture du visage dans l'image de face de l'aperçu (la coiffe dit où elle est)
const VISAGE_DE = async ([src, coiffe]) => { const G = window.ISNAD.gfx, im = new Image(); await new Promise(r => { im.onload = r; im.onerror = r; im.src = src; });
  const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height; const c = cv.getContext('2d'); c.drawImage(im, 0, 0); const d = c.getImageData(0, 0, cv.width, cv.height).data;
  const g = G.charGrille({ kind: 'cyber', robe: '#2a3048', head: '#1c2030', cloak: '#39424f', coiffe }, 0, 0, null, G.D > 1 ? 2 : 1).lignes, k = cv.width / g[0].length; const px = [];
  g.forEach((l, y) => { for (let x = 0; x < l.length; x++) if (l[x] === 'V' || l[x] === 'v') { const o = (Math.floor(y * k) * cv.width + Math.floor(x * k)) * 4; px.push(d[o] + ',' + d[o + 1] + ',' + d[o + 2]); } });
  return px.join(' '); };

(async () => {
  const browser = await chromium.launch(); let errors = [];
  const ouvrir = async (vp, q) => { const ctx = await browser.newContext({ viewport: vp || { width: 960, height: 540 }, hasTouch: !!vp && vp.width < 900 }); const page = await ctx.newPage();
    page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url + (q || '')); await page.waitForTimeout(1700); return page; };
  const sansErreur = quoi => { if (errors.length) { ko(`ÉCART erreur console (${quoi}) : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`); errors = []; } };
  const bouton = (page, dans, texte) => page.locator(`${dans} button`, { hasText: texte }).first();
  const cellule = (p, g, i) => p.locator('#perso .pv-panneau .pv-groupe').nth(g).locator('.pv-c').nth(i);
  const ensemble = (p, i) => p.locator('#perso .pv-ens .pv-c').nth(i);

  /* ---------- 1. les noms ---------- */
  let page = await ouvrir();
  const PASSENT = ['Idris', 'Khalil', 'Elyas', '’Imrân', 'Hamza', 'Abd al-Karîm', '’Abd Allah', 'Zayd', 'Nûr ad-Dîn', 'Yacine', 'Jean-Luc', 'Sélim', 'إلياس', 'Ibrâhîm', 'Mûsâ'];
  const REFUSES = [['', 'faut un nom'], ['   ', 'faut un nom'], ['Abdelkader ben Ali', 'Seize'], ['Khalil2', 'lettres'], ['<b>x</b>', 'lettres'], ['Idris*', 'lettres'], ['K@lil', 'lettres'], ['-Khalil', 'lettres'],
    ['Allah', 'qu’à Allah'], ['allâh', 'qu’à Allah'], ['Ar-Rahmân', 'qu’à Allah'], ['Dieu', 'qu’à Allah'], ['Iblîs', 'ne se porte pas'], ['Le Djinn', 'ne se porte pas'], ['Shaytân', 'ne se porte pas'],
    ['Muhammad', 'Prophète'], ['Mohamed', 'Prophète'], ['’Umar', 'personnage du jeu'], ['Umar', 'personnage du jeu'], ['Khâlid', 'personnage du jeu'], ['Abû Bakr', 'personnage du jeu'], ['ali', 'personnage du jeu'], ['’Uthmân', 'personnage du jeu'], ['Abd ar-Rahmân', 'personnage du jeu']];
  const noms = await page.evaluate(([P, R]) => { const X = window.ISNAD.perso; return { passent: P.map(n => [n, X.refus(n)]), refuses: R.map(([n, r]) => [n, r, X.refus(n)]), pris: Object.keys(X.prisParLeJeu()).length }; }, [PASSENT, REFUSES]);
  const mauvais = noms.passent.filter(x => x[1]).map(x => `« ${x[0]} » refusé (${x[1]})`).concat(noms.refuses.filter(x => !x[2]).map(x => `« ${x[0]} » accepté`), noms.refuses.filter(x => x[2] && !x[2].includes(x[1])).map(x => `« ${x[0]} » refusé sans la bonne raison (${x[2]})`));
  if (mauvais.length) mauvais.forEach(m => ko('ÉCART nom : ' + m)); else ok(`${PASSENT.length} noms acceptés (${PASSENT.slice(1, 8).join(', ')}…) ; ${REFUSES.length} refusés, chacun pour sa raison : vide, trop long, autre chose que des lettres, le Nom divin seul, un nom interdit, le nom du Prophète ﷺ, un des ${noms.pris} noms que le jeu porte déjà`);
  // le nom dans les textes : chaque phrase relevée, redite avec six noms
  const dit = await page.evaluate(() => { const X = window.ISNAD.perso, ph = X.phrases(), N = [['Khalil', false], ['Elyas', true], ['Hamza', false], ['’Imrân', false], ['Yacine', false], ['Abd ar-Rahmân', true]], faux = [];
    N.forEach(([n, elide]) => ph.forEach(t => { const d = X.dire(t, n);
      if (/(^|[^A-Za-zÀ-ÿ])Idris(?![A-Za-zÀ-ÿ])/.test(d)) faux.push(n + ' : il reste « Idris » — ' + d.slice(0, 80));
      if (!d.includes(n)) faux.push(n + ' : le nom manque — ' + d.slice(0, 80));
      if (/[dD][’']Idris|[qQ]u[’']Idris/.test(t)) { const attendu = elide ? /(?:d|qu)’/ : /(?:de|que) /, i = d.indexOf(n), avant = d.slice(Math.max(0, i - 4), i); if (!attendu.test(avant)) faux.push(n + ' : élision — …' + d.slice(Math.max(0, i - 16), i + n.length + 6) + '…'); } }));
    const ex = ph.filter(t => /[dD][’']Idris|[qQ]u[’']Idris/.test(t)).slice(0, 3).map(t => { const i = t.search(/[dDqQ]u?[’']Idris/); return [t.slice(Math.max(0, i - 22), i + 12), X.dire(t, 'Khalil').slice(Math.max(0, i - 22), i + 15), X.dire(t, 'Elyas').slice(Math.max(0, i - 22), i + 13)]; });
    return { n: ph.length, elisions: ph.filter(t => /[dD][’']Idris|[qQ]u[’']Idris/.test(t)).length, faux, ex }; });
  if (dit.n < 25 || dit.elisions < 3) ko(`ÉCART seulement ${dit.n} phrases relevées dans le jeu, dont ${dit.elisions} avec une élision : il en manque`);
  if (dit.faux.length) dit.faux.slice(0, 8).forEach(f => ko('ÉCART ' + f)); else ok(`${dit.n} phrases du jeu nomment le râwî, dont ${dit.elisions} avec une élision ; redites avec six noms : plus un « Idris », et l'élision juste — ${dit.ex.map(e => `« …${e[0].trim()}… » → « …${e[1].trim()}… » / « …${e[2].trim()}… »`).slice(0, 2).join(' ; ')}`);

  /* ---------- 2. sans rien choisir, rien ne change ---------- */
  const neutre = await page.evaluate(() => { const I = window.ISNAD, X = I.perso, h = I.sagas.idris.heroes.idris, avant = JSON.stringify(I.sagas), look0 = h.look;
    I.save.reset(); const a = JSON.stringify(I.sagas) === avant && h.look === look0;
    X.choisir('Khalil', 'veilleur'); const change = h.name === 'Khalil' && h.arabic === '' && h.look !== look0 && I.sagas.idris.name === 'Khalil';
    X.choisir('Idris', 'archives'); const b = JSON.stringify(I.sagas) === avant && h.look === look0 && h.arabic === 'إدريس';
    // des choix qui valent ceux d'origine (le visage d'Idris, la coupe et l'étoffe de son ensemble) : rien n'est gardé, rien ne change
    X.choisir('Idris', 'archives', { teint: 't3', barbe: 1, poil: 'p2', coiffe: 'capuche', manteau: 'long', longue: false, echarpe: false, etoffe: 'e1' });
    const c = JSON.stringify(I.sagas) === avant && h.look === look0 && !('compo' in I.save.data.profil);
    I.save.reset(); X.appliquer(); return { a, change, b, c, tenue0: JSON.stringify(I.D.TENUES[0].look) === JSON.stringify(look0) }; });
  if (!neutre.a || !neutre.b || !neutre.c || !neutre.tenue0) ko(`ÉCART le profil d'origine ne laisse pas le jeu intact : ${JSON.stringify(neutre)}`); else if (!neutre.change) ko('ÉCART choisir un nom et une tenue ne change pas le râwî');
  else ok('sans rien choisir, rien ne change : phrases, sceau et silhouette d’origine, à l’identique (le même objet) — et l’on y revient en rechoisissant « Idris » et sa tenue de toujours, même avec des choix qui valent ceux d’origine (aucun n’est gardé)');
  // la planche des six tenues : de face et de profil, telles que le jeu les montre en grand (jamais de dos)
  const planche = await page.evaluate(() => { const I = window.ISNAD, G = I.gfx, T = I.D.TENUES, k = 4, cv = document.createElement('canvas'); cv.width = T.length * 2 * 34 * k + 16; cv.height = 62 * k + 16; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
    c.fillStyle = '#12101c'; c.fillRect(0, 0, cv.width, cv.height);
    T.forEach((t, i) => { const L = Object.assign({ kind: 'compagnon' }, t.look); [0, 1].forEach((d, j) => { const g = G.charGrand(L, d); c.drawImage(g, 8 + (i * 2 + j) * 34 * k, 8, g.width * k, g.height * k); });
      c.fillStyle = '#e9c877'; c.font = '14px sans-serif'; c.fillText((i + 1) + ' · ' + t.nom, 12 + i * 2 * 34 * k, 50 * k + 28); });
    return { url: cv.toDataURL('image/png'), noms: T.map(t => t.nom), distinctes: new Set(T.map(t => G.charURL(Object.assign({ kind: 'compagnon' }, t.look), 0))).size }; });
  fs.writeFileSync(path.join(out, 'tenues.png'), Buffer.from(planche.url.split(',')[1], 'base64'));
  if (planche.distinctes !== planche.noms.length) ko(`ÉCART des tenues se dessinent pareil : ${planche.distinctes} silhouettes pour ${planche.noms.length} tenues`); else ok(`six tenues, six silhouettes différentes : ${planche.noms.join(', ')} — planche dans ${path.relative(process.cwd(), path.join(out, 'tenues.png'))}`);

  /* ---------- 2 bis. le râwî composé : ses règles ---------- */
  const regles = await page.evaluate(async () => { const I = window.ISNAD, X = I.perso, D = I.D, G = I.gfx, R = D.RAWI, t0 = D.TENUES[0], E = [];
    // une composition abîmée : rien n'en reste
    const abimee = JSON.parse('{"teint":"<script>","barbe":7,"poil":["p1"],"coiffe":"keffieh","manteau":"cape","longue":"oui","echarpe":1,"etoffe":"__proto__","neon":"constructor","objet":"durra","visage":12,"__proto__":{"teint":"t1"}}');
    if (Object.keys(X.compo(abimee)).length || Object.keys(X.compo('t1')).length || Object.keys(X.compo([1, 2])).length || Object.keys(X.compo(null)).length) E.push('une composition abîmée n’est pas oubliée : ' + JSON.stringify(X.compo(abimee)));
    // changer d'habit ne change pas un point du visage (la même coiffe) — de face et de profil, en dessin fin
    const pts = (L, dir) => { const g = G.charGrille(L, dir, 0, null, 2).lignes, cv = G.figure(L, dir, 0), d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, k = cv.width / g[0].length, s = [];
      g.forEach((l, y) => { for (let x = 0; x < l.length; x++) if (l[x] === 'V' || l[x] === 'v') { const o = (Math.floor(y * k) * cv.width + Math.floor(x * k)) * 4; s.push(d[o], d[o + 1], d[o + 2]); } }); return s.join(','); };
    const lk = c => Object.assign({ kind: 'compagnon' }, X.composer(t0, c));
    let pareils = 0; [{ teint: 't5' }, { teint: 't1', barbe: 2, poil: 'p3' }].forEach(v => { const ref = [0, 1].map(d => pts(lk(v), d));
      [{ etoffe: 'e7' }, { neon: 'n3' }, { manteau: 'ample', longue: true, echarpe: true }, { objet: 'feuillets' }, { etoffe: 'e6', neon: 'n5', manteau: 'epaule' }].forEach(h => { [0, 1].forEach(d => { if (pts(lk(Object.assign({}, v, h)), d) === ref[d]) pareils++; else E.push('changer d’habit change le visage : ' + JSON.stringify(Object.assign({}, v, h))); }); }); });
    // sous chaque ensemble, le même visage (sa marque est figée)
    const marques = new Set(D.TENUES.map(t => X.composer(t, { teint: 't4' }).visage)); if (marques.size !== 1 || !marques.has(G.signe(t0.look))) E.push('la marque du visage change d’un ensemble à l’autre');
    // le dé : mille tirages
    let visage = 0, nue = 0, hors = 0; const vus = {};
    for (let i = 0; i < 1000; i++) { const c0 = { teint: 't6', barbe: 0, poil: 'p3' }, c = X.hasard(D.TENUES[i % 6], c0); if (c.teint !== 't6' || c.barbe !== 0 || c.poil !== 'p3') visage++;
      const L = X.composer(D.TENUES[i % 6], c), co = L.coiffe || 'capuche', ma = L.manteau || 'long'; if (co === 'calotte' && ma === 'aucun') nue++; if (JSON.stringify(X.compo(c)) !== JSON.stringify(c)) hors++; vus[co + '/' + ma] = 1; }
    if (visage || nue || hors) E.push(`le dé : ${visage} visage(s) changé(s), ${nue} calotte(s) sans manteau, ${hors} valeur(s) hors des listes`);
    // aucune composition n'a la coiffe et la coupe d'un Compagnon des récits, ni celles de Sâlim (qui marche avec le râwî)
    const paires = {}, prends = (L, qui) => { const K = G.KINDS[L.kind || 'compagnon'] || {}; paires[(L.coiffe || K.coiffe || 'imama') + '/' + (L.manteau || K.manteau || 'long')] = qui; };
    Object.values(I.sagas).forEach(s => { Object.values(s.heroes || {}).forEach(h => { const L = h.look || {}; if ((L.kind || 'compagnon') === 'compagnon' || (s.frame && h.name === 'Sâlim')) prends(L, h.name); });
      (s.chapters || []).forEach(ch => (ch.npcs || []).forEach(n => { if (n.look && (n.look.kind === 'compagnon' || D.rayon(n.name))) prends(n.look, n.name); })); });
    const atteintes = new Set(); D.TENUES.forEach(t => R.coiffes.forEach(co => R.manteaux.forEach(ma => { const L = X.composer(t, { coiffe: co, manteau: ma }); atteintes.add((L.coiffe || 'capuche') + '/' + (L.manteau || 'long')); })));
    const communes = [...atteintes].filter(p => paires[p]).map(p => p + ' (' + paires[p] + ')');
    if (communes.length) E.push('une composition prend la silhouette d’un Compagnon ou de Sâlim : ' + communes.join(', '));
    // ni or ni jaune (exigence 17) : aucun néon n'est doré, et une pièce qui met le liseré au jour (le bandeau de la calotte,
    // l'écharpe, le bas de la robe longue) ne le montre jamais doré — pas même le jaune pâle du manteau du veilleur
    // (la teinte se juge ici, et sur les images mêmes : de face, de profil, de dos, chaque point jaune ou doré est compté)
    const teinte = (r, g, b) => { const mx = Math.max(r, g, b), d = mx - Math.min(r, g, b); if (d < 40 || mx < 120) return -1; const a = (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; return a < 0 ? a + 360 : a; };
    const doreHex = h => { const n = parseInt(String(h).slice(1, 7), 16), a = teinte(n >> 16, (n >> 8) & 255, n & 255); return a >= 30 && a <= 70; };
    const ors = L => { let n = 0; [0, 1, 2, 3].forEach(d => { const cv = G.figure(L, d, 0), px = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; for (let i = 0; i < px.length; i += 4) { const a = px[i + 3] > 200 ? teinte(px[i], px[i + 1], px[i + 2]) : -1; if (a >= 35 && a <= 65) n++; } }); return n; };
    const dores = []; if (!doreHex('#ffe08a') || doreHex('#39e6ff')) E.push('le contrôle ne reconnaît pas le jaune pâle du veilleur');
    Object.keys(R.neons).forEach(n => R.neons[n].forEach(c => { if (doreHex(c)) dores.push('néon ' + n + ' ' + c); }));
    D.TENUES.forEach(t => { const seul = ors(Object.assign({ kind: 'compagnon' }, X.look(t)));
      [{ coiffe: 'calotte' }, { echarpe: true }, { longue: true }, { coiffe: 'calotte', echarpe: true, longue: true }].forEach(c => { const n = ors(Object.assign({ kind: 'compagnon' }, X.composer(t, c))); if (n > seul) dores.push(`${t.id} ${JSON.stringify(c)} : ${seul} → ${n} points jaunes`); }); });
    if (dores.length) E.push('du jaune ou de l’or que l’ensemble ne montrait pas : ' + dores.join(', '));
    // l'objet porté : ni l'équipement de départ, ni le combat
    const def = I.sagas.idris.heroes.idris, gear = I.save.data;
    const depart = look => { const k = 'essai:' + Math.random(); const md = I.gear.of({ def: Object.assign({}, def, { look }), key: k }).md; delete gear.equip[k]; delete gear.gearInit[k]; return md; };
    const md0 = depart(def.look), md1 = depart(X.composer(t0, { objet: 'feuillets' })), mdItem = depart(Object.assign({}, def.look, { item: ['feuillets'] }));
    if (md1 !== md0) E.push(`l’objet porté change l’arme de départ : ${md0} → ${md1}`);
    const auCombat = I.gear.look({ def: Object.assign({}, def, { look: X.composer(t0, { objet: 'feuillets' }) }), key: 'essai:combat' }, { md: 'couteau' }); delete gear.equip['essai:combat'];
    if (auCombat.porte) E.push('au combat, l’objet porté reste en main');
    return { E, pareils, marques: marques.size, paires: Object.keys(paires).length, atteintes: atteintes.size, md0, mdItem }; });
  if (regles.E.length) regles.E.forEach(e => ko('ÉCART ' + e));
  else ok(`le râwî composé : une composition abîmée est oubliée (balise, type faux, valeur inconnue, __proto__) ; changer l’étoffe, le néon, la coupe ou l’objet laisse le visage au point près (${regles.pareils} images, de face et de profil) ; une seule marque de visage sous les six ensembles ; le dé, mille tirages : jamais le visage, jamais la calotte sans manteau, rien hors des listes ; ${regles.atteintes} silhouettes possibles, aucune n’est l’une des ${regles.paires} (coiffe, coupe) des Compagnons des récits ou de Sâlim ; ni néon doré, ni liseré doré sur une pièce composée (le jaune pâle du veilleur compris) ; l’objet porté laisse l’arme de départ (${regles.md0} ; rangé dans l’équipement, il donnerait ${regles.mdItem}) et se range au combat`);
  // un récit ou un paquet n'écrit ni teint ni trait : les règles le refusent
  { const D = require('../src/core/defs.js'), RG = require('../src/core/regles.js'), base = [];
    for (const f of fs.readdirSync(path.join(V2, 'src/data')).filter(f => /\.js$/.test(f)).sort()) { const ctx = { ISNAD: { registerSaga: s => base.push(s), registerMusic() {} }, console }; ctx.window = ctx; ctx.globalThis = ctx; vm.runInNewContext(fs.readFileSync(path.join(V2, 'src/data', f), 'utf8'), ctx, { filename: f }); }
    const P0 = JSON.parse(JSON.stringify(require('./essais/paquet_essai.js'))), net = RG.verifierPaquet(D, JSON.parse(JSON.stringify(P0)), { sagas: base }).erreurs, refus = [];
    ['teint', 'barbe', 'poil', 'visage', 'neon', 'porte'].forEach(k => { const P = JSON.parse(JSON.stringify(P0)), s = P.sagas[0], h = s.heroes[Object.keys(s.heroes)[0]]; h.look = Object.assign({}, h.look, { [k]: k === 'barbe' || k === 'visage' ? 1 : k === 'neon' ? ['#ffffff', '#000000'] : k === 'porte' ? ['feuillets'] : '#7e5034' });
      const e = RG.verifierPaquet(D, P, { sagas: base }).erreurs; if (!e.some(x => x.includes('réservé au râwî'))) refus.push(k); });
    if (net.length) ko(`ÉCART le paquet d’essai ne passe plus les règles : ${net[0]}`); else if (refus.length) ko(`REFUS manquant : un paquet qui écrit ${refus.join(', ')} sur un personnage passe les règles`);
    else ok('un paquet qui écrit un teint, une barbe, un poil, une marque de visage, un néon ou un objet porté sur un personnage est refusé : « réservé au râwî que compose le joueur »'); }
  sansErreur('sur les noms, les tenues et les règles'); await page.close();
  // les teints, dans les trois dessins : sous la capuche, dans l'ordre et tous différents ; les plus sombres gardent le blanc de l'œil
  for (const [nomD, q] of [['fin', '?def=2'], ['fin et adouci', '?def=2l'], ['d’origine', '?def=1']]) {
    const p = await ouvrir(null, q);
    const T = await p.evaluate(() => { const I = window.ISNAD, X = I.perso, G = I.gfx, R = I.D.RAWI, t0 = I.D.TENUES[0];
      const lum = (r, g, b) => (r * 0.3 + g * 0.59 + b * 0.11) / 255;
      return Object.keys(R.teints).map(id => { const L = Object.assign({ kind: 'compagnon' }, X.composer(t0, { teint: id })), g = G.charGrille(L, 0, 0, null, G.D > 1 ? 2 : 1).lignes, cv = G.figure(L, 0, 0), k = cv.width / g[0].length, d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, n = {}; let blanc = 0;
        g.forEach((l, y) => { for (let x = 0; x < l.length; x++) if (l[x] === 'V' || l[x] === 'v') { const o = (Math.floor(y * k) * cv.width + Math.floor(x * k)) * 4, h = d[o] + ',' + d[o + 1] + ',' + d[o + 2]; n[h] = (n[h] || 0) + 1; if (d[o] + d[o + 1] + d[o + 2] > 600) blanc++; } });
        const top = Object.entries(n).sort((a, b) => b[1] - a[1])[0][0].split(',').map(Number); return { id, peau: lum(...top), empreinte: Object.keys(n).sort().join(' '), blanc }; }); });
    const ordre = T.every((t, i) => i === 0 || t.peau < T[i - 1].peau - 0.02), distincts = new Set(T.map(t => t.empreinte)).size === T.length, sombres = T.slice(-2).every(t => t.blanc > 0);
    if (!ordre || !distincts || !sombres) ko(`ÉCART les teints, dessin ${nomD} : ${T.map(t => t.id + ' ' + t.peau.toFixed(3) + (t.blanc ? ' (blanc de l’œil)' : '')).join(' · ')}${distincts ? '' : ' — deux teints donnent le même visage'}`);
    else ok(`les ${T.length} teints, dessin ${nomD} : sous la capuche, du plus clair au plus sombre (${T.map(t => t.peau.toFixed(2)).join(' › ')}), aucun ne donne le visage d’un autre ; les deux plus sombres gardent le blanc de l’œil`);
    sansErreur('les teints, dessin ' + nomD); await p.context().close();
  }

  /* ---------- 3. par les vrais boutons, en quatre tailles ---------- */
  // tout ce qui s'affiche pendant le jeu, relevé au fil de l'eau
  const ecouter = p => p.evaluate(() => { window.__vu = new Set(); const noter = () => { ['#dialog', '#card', '#hud', '#toasts', '#battle', '#choice', '#chain', '#noms', '#menu'].forEach(s => { const e = document.querySelector(s); if (e && !e.hidden) { const t = e.innerText || e.textContent || ''; if (t.trim()) window.__vu.add(t.replace(/\s+/g, ' ').trim()); } }); };
    new MutationObserver(noter).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'class'] }); setInterval(noter, 60); });
  const TAILLES = [['bureau', { width: 960, height: 540 }], ['telephone', { width: 390, height: 844 }], ['paysage', { width: 844, height: 390 }], ['petit', { width: 360, height: 560 }]];
  let pageBureau = null;
  for (const [nom, vp] of TAILLES) {
    const p = await ouvrir(vp); await ecouter(p); const tactile = vp.width < 900, toucher = async loc => { await (tactile ? loc.tap() : loc.click()); await p.waitForTimeout(160); };   // sur un écran tactile, on touche
    await toucher(bouton(p, '#title .vmenu', 'Nouvelle partie')); await p.waitForTimeout(700);
    const e1 = await p.evaluate(ETAT);
    await p.screenshot({ path: path.join(out, nom + '-1-ouverture.png') });
    if (!e1.ouvert) { ko(`BLOQUÉ ${nom} : « Nouvelle partie » n'ouvre pas « Ton personnage »`); await p.close(); continue; }
    // tout est déjà choisi : Idris, son ensemble de toujours, son visage ; ni onglet, ni « Retour » ; « Commencer » sous le doigt
    if (e1.nom !== 'Idris' || e1.ensembles !== 6 || e1.ensemble !== 0 || e1.ok !== 'Commencer' || e1.retour || e1.onglets !== 0 || JSON.stringify(e1.groupes) !== '[7,3,3]' || JSON.stringify(e1.choix) !== '[2,1,1]') ko(`ÉCART ${nom} : l'écran ne s'ouvre pas sur Idris, tout choisi, l'ensemble et le visage seulement : ${JSON.stringify({ nom: e1.nom, ensembles: e1.ensembles, ensemble: e1.ensemble, ok: e1.ok, retour: e1.retour, onglets: e1.onglets, groupes: e1.groupes, choix: e1.choix })}`);
    if (!e1.okVisible) ko(`INVISIBLE ${nom} : « Commencer » n'est pas à l'écran sans défiler`); if (!e1.champVisible) ko(`INVISIBLE ${nom} : le champ du nom n'est pas à l'écran sans défiler`); if (e1.large) ko(`ÉCART ${nom} : l'écran déborde en largeur`);
    if (e1.invisibles) ko(`INVISIBLE ${nom} : ${e1.invisibles} case(s) hors de l'écran`); if (e1.mots > 4) ko(`ÉCART ${nom} : ${e1.mots} mots à l'écran (« ${e1.texte} »)`); if (tactile && e1.petitTexte < 10.5) ko(`ÉCART ${nom} : un texte de ${e1.petitTexte} points sur un écran tactile`);
    if (!/ok/.test(e1.sel)) ko(`ÉCART ${nom} : « Commencer » n'est pas la case choisie à l'ouverture (${e1.sel})`);
    if (e1.coupes.length) ko(`ÉCART ${nom} : un bouton est tassé, son mot déborde (${e1.coupes.join(' · ')})`);
    if (!e1.champ || e1.champ.id !== 'perso-nom' || !e1.champ.dit || e1.champ.orthographe !== false || e1.champ.majuscules !== 'words' || e1.champ.touche !== 'done') ko(`ÉCART ${nom} : le champ du nom n'a pas son nom pour les lecteurs d'écran, ou le clavier du téléphone y corrigerait un prénom : ${JSON.stringify(e1.champ)}`);
    // un nom refusé bloque ; un nom accepté débloque
    await p.locator('#perso input').fill('Allah'); await p.waitForTimeout(150);
    const e2 = await p.evaluate(() => ({ note: document.querySelector('#perso .pv-note').textContent, bloque: document.querySelector('#perso .ok').disabled }));
    await p.screenshot({ path: path.join(out, nom + '-2-refus.png') });
    if (!e2.bloque || !/qu’à Allah/.test(e2.note)) ko(`ÉCART ${nom} : un nom refusé ne bloque pas « Commencer » (${JSON.stringify(e2)})`);
    await p.locator('#perso input').fill('Khalil'); await p.waitForTimeout(150);
    // chaque ensemble, chaque teint, chaque barbe, chaque poil : touchés, choisis, vus
    const vus = { ensembles: [], teints: [], barbes: [], poils: [] }, faux = [];
    for (let i = 0; i < 6; i++) { await toucher(ensemble(p, i)); const e = await p.evaluate(ETAT); vus.ensembles.push(e.face); if (e.ensemble !== i) faux.push('ensemble ' + (i + 1)); }
    for (const [cle, g, n] of [['teints', 0, 7], ['barbes', 1, 3], ['poils', 2, 3]]) for (let i = 0; i < n; i++) { await toucher(cellule(p, g, i)); const e = await p.evaluate(ETAT); vus[cle].push(e.face); if (e.choix[g] !== i) faux.push(cle + ' ' + (i + 1)); if (!e.proche) faux.push('l’aperçu ne se rapproche pas du visage (' + cle + ')'); }
    if (nom === 'telephone' || nom === 'bureau') await p.screenshot({ path: path.join(out, nom + '-3-visage.png') });
    const tous = ['ensembles', 'teints', 'barbes', 'poils'].map(k => [k, new Set(vus[k]).size, vus[k].length]);
    if (faux.length || tous.some(t => t[1] !== t[2])) ko(`ÉCART ${nom} : toucher un choix ne le montre pas (${faux.slice(0, 4).join(', ')}${tous.filter(t => t[1] !== t[2]).map(t => ` ; ${t[0]} : ${t[1]} aperçus pour ${t[2]} choix`).join('')})`);
    // le choix final : le manteau du veilleur, un teint sombre, la barbe pleine, le poil clair
    await toucher(ensemble(p, 4)); await toucher(cellule(p, 0, 5)); await toucher(cellule(p, 1, 2)); await toucher(cellule(p, 2, 2));
    const e3 = await p.evaluate(ETAT);
    if (e3.ensemble !== 4 || JSON.stringify(e3.choix) !== '[5,2,2]' || e3.retouche) ko(`ÉCART ${nom} : le visage ne tient pas quand on change d'ensemble (${JSON.stringify(e3.choix)}, ensemble ${e3.ensemble})`);
    if (e3.ok !== 'Commencer' || !e3.okVisible) ko(`ÉCART ${nom} : « Khalil » ne débloque pas « Commencer »`);
    await p.screenshot({ path: path.join(out, nom + '-4-choisi.png') });
    await toucher(p.locator('#perso .ok')); await p.waitForTimeout(900);
    const e4 = await p.evaluate(() => { const I = window.ISNAD, W = I.world, h = I.sagas.idris.heroes.idris; return { ferme: document.querySelector('#perso').hidden, profil: I.save.data.profil, monde: !!(W.saga && W.saga.id === 'idris'), heros: h.name, sceau: h.arabic, look: h.look, carte: W.sheets && W.sheets[0] && W.sheets[0].look ? JSON.stringify(W.sheets[0].look) : '' }; });
    const attendu = { nom: 'Khalil', tenue: 'veilleur', compo: { teint: 't6', barbe: 2, poil: 'p3' } };
    if (!e4.ferme || !e4.monde || JSON.stringify(e4.profil) !== JSON.stringify(attendu) || e4.heros !== 'Khalil' || e4.sceau !== '') { ko(`BLOQUÉ ${nom} : « Commencer » ne lance pas le prologue avec le personnage choisi : ${JSON.stringify(e4.profil)} ${e4.heros}`); await p.close(); continue; }
    if (e4.look.teint !== '#7e5034' || e4.look.barbe !== 2 || e4.look.poil !== '#6b4a2e' || e4.carte !== JSON.stringify(Object.assign({ kind: 'compagnon' }, e4.look))) ko(`ÉCART ${nom} : le râwî de la carte n'est pas celui que l'on a composé : ${JSON.stringify(e4.look)}`);
    // le prologue en entier, joué par le joueur automatique ; tout ce qui s'affiche est relevé
    const joue = await p.evaluate(async () => { const I = window.ISNAD; I.audio.setOn(false); I.debug.auto = true; I.speed = 24; const log = I.debug.log = [];
      const fin = await new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (!document.querySelector('#chain').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 150000) { clearInterval(iv); res(false); } }, 100); });
      I.debug.auto = false; I.speed = 1; await new Promise(r => setTimeout(r, 400));
      const vu = [...window.__vu], tout = vu.join(' ¶ '), reste = vu.filter(t => /(^|[^A-Za-zÀ-ÿ])Idris(?![A-Za-zÀ-ÿ])/.test(t)).map(t => { const i = t.indexOf('Idris'); return t.slice(Math.max(0, i - 40), i + 30); });
      const ou = { dialogue: /Khalil/.test(vu.filter(t => !/MAILLON|Halte/.test(t)).join(' ')), combat: vu.some(t => /Khalil/.test(t) && /(Niv\.|Souffle|Frapper|Garde)/.test(t)), chaine: (document.querySelector('#chain').innerText || '').includes('Khalil') };
      return { fin, n: vu.length, fois: (tout.match(/Khalil/g) || []).length, reste: [...new Set(reste)].slice(0, 6), ou, log: log.filter(l => /BLOQUÉ|INACCESSIBLE|ABSENT|ERR /.test(l)), elide: (tout.match(/(?:de|que) Khalil/g) || []).length, faute: (tout.match(/(?:d|qu)[’']Khalil/g) || []).length, md: (I.save.data.equip['idris:idris'] || {}).md }; });
    await p.screenshot({ path: path.join(out, nom + '-5-chaine.png') });
    if (!joue.fin || joue.log.length) ko(`BLOQUÉ ${nom} : le prologue ne se joue pas jusqu'à la Chaîne avec un personnage choisi (${joue.log.join(' ; ')})`);
    else if (joue.reste.length) joue.reste.forEach(r => ko(`ÉCART ${nom} : « Idris » s'affiche encore — …${r}…`));
    else if (!joue.ou.dialogue || !joue.ou.combat || !joue.ou.chaine || joue.faute) ko(`ÉCART ${nom} : le nom choisi ne paraît pas partout (${JSON.stringify(joue.ou)}, élisions fautives : ${joue.faute})`);
    else ok(`${nom} ${vp.width}×${vp.height}${tactile ? ', au doigt' : ''} : « Ton personnage » s'ouvre sur Idris, tout choisi (${e1.mots} mots : « ${e1.texte} »${tactile ? `, aucun texte sous ${Math.floor(e1.petitTexte * 10) / 10} points` : ''}) ; refuse « Allah » ; six ensembles, sept teints, trois barbes, trois poils touchés, chacun vu ; Khalil, manteau du veilleur, teint et barbe choisis, joue tout le prologue — ${joue.n} textes relevés, « Khalil » ${joue.fois} fois, plus un seul « Idris » ; sur la carte, le râwî composé ; arme de départ : ${joue.md}${e1.defile ? ' · l’écran défile' : ''}`);
    sansErreur(nom); if (nom === 'bureau') pageBureau = p; else await p.close();
  }

  /* ---------- 3 bis. les téléphones courants, en largeur et en hauteur : rien de tassé, rien hors de l'écran ----------
     640 × 360 et 667 × 375 (les plus courants en largeur), 568 × 320 (le plus petit), 320 × 568 (le plus étroit) : à
     l'ouverture, puis la composition entière, onglet par onglet — aucun mot coupé dans un bouton, aucune case hors de
     l'écran ni sous la taille d'un doigt (38 points sur un écran de 320 de large), aucun texte sous 10,5 points, rien qui
     déborde. */
  for (const [nom, vp] of [['paysage 640', { width: 640, height: 360 }], ['paysage 667', { width: 667, height: 375 }], ['petit paysage', { width: 568, height: 320 }], ['étroit', { width: 320, height: 568 }]]) {
    const p = await ouvrir(vp), taille = vp.width + 'x' + vp.height; await bouton(p, '#title .vmenu', 'Nouvelle partie').tap(); await p.waitForTimeout(700);
    const vus = [['ouverture', await p.evaluate(ETAT)]]; await p.screenshot({ path: path.join(out, 'etroit-' + taille + '-ouverture.png') });
    // la composition entière : celle qu'ouvre le pied de la Chaîne, une fois le prologue joué
    await p.evaluate(() => { const I = window.ISNAD; document.querySelector('#perso').hidden = true; I.ui.menuOpen = false; I.save.data.prologue = true; I.ui.showChain(); });
    await p.waitForTimeout(600); await bouton(p, '#chain .chainfoot', 'Ton personnage').tap(); await p.waitForTimeout(700);
    for (const o of ['visage', 'habit', 'couleurs', 'objet']) { await p.locator(`#perso .pv-onglet[data-o="${o}"]`).tap(); await p.waitForTimeout(350); vus.push([o, await p.evaluate(ETAT)]);
      if (o === 'habit') await p.screenshot({ path: path.join(out, 'etroit-' + taille + '-habit.png') }); }
    const min = vp.width < 340 ? 37.5 : 41.5, fautes = [];
    vus.forEach(([quoi, e]) => { if (!e.ouvert) { fautes.push(quoi + ' : l’écran n’est pas ouvert'); return; }
      if (e.coupes.length) fautes.push(`${quoi} : un mot coupé (${e.coupes.join(' · ')})`); if (e.horsEcran.length) fautes.push(`${quoi} : hors de l'écran (${e.horsEcran.join(' · ')})`);
      if (e.large) fautes.push(quoi + ' : déborde en largeur'); if (e.plusPetiteCase < min) fautes.push(`${quoi} : une case de ${Math.round(e.plusPetiteCase)} points`);
      if (e.petitTexte < 10.5) fautes.push(`${quoi} : un texte de ${e.petitTexte} points`); if (!e.okVisible) fautes.push(`${quoi} : « ${e.ok} » hors de l’écran`); });
    if (fautes.length) ko(`ÉCART ${nom} ${vp.width}×${vp.height} : ${fautes.slice(0, 5).join(' ; ')}`);
    else ok(`${nom} ${vp.width}×${vp.height}, au doigt : à l'ouverture et dans les quatre onglets, aucun mot coupé, rien hors de l'écran ni qui déborde, aucune case sous ${Math.floor(Math.min(...vus.map(v => v[1].plusPetiteCase)))} points`);
    sansErreur(nom + ' ' + taille); await p.close();
  }

  /* ---------- 4. la composition entière ; le choix tient ; on en change ---------- */
  let texte = null;
  if (pageBureau) { const p = pageBureau, attendre = ms => p.waitForTimeout(ms || 180), cliquer = async loc => { await loc.click(); await attendre(); };
    const visageVu = async coiffe => { const src = (await p.evaluate(ETAT)).face; return p.evaluate(VISAGE_DE, [src, coiffe]); };
    await bouton(p, '#chain .chainfoot', 'Ton personnage').click(); await p.waitForTimeout(700);
    const c1 = await p.evaluate(ETAT);
    if (!c1.ouvert || c1.nom !== 'Khalil' || c1.onglets !== 4 || c1.onglet !== 'visage' || c1.ensemble !== 4 || JSON.stringify(c1.choix) !== '[5,2,2]' || c1.ok !== 'Garder' || !c1.retour) ko(`ÉCART depuis la Chaîne, « Ton personnage » ne reprend pas le choix, en quatre onglets : ${JSON.stringify({ ouvert: c1.ouvert, nom: c1.nom, onglets: c1.onglets, onglet: c1.onglet, ensemble: c1.ensemble, choix: c1.choix, ok: c1.ok })}`);
    // chaque onglet, chaque case : touchée, choisie, vue (une case déjà choisie ne change rien)
    const bilan = {}; let fautes = [];
    for (const o of ['visage', 'habit', 'couleurs', 'objet']) { await cliquer(p.locator(`#perso .pv-onglet[data-o="${o}"]`)); const e0 = await p.evaluate(ETAT); if (e0.onglet !== o || e0.panneau !== o) fautes.push('l’onglet ' + o + ' ne s’ouvre pas');
      let n = 0, vus = 0; for (let g = 0; g < e0.groupes.length; g++) for (let i = 0; i < e0.groupes[g]; i++) { const c = cellule(p, g, i); if (await c.isDisabled()) continue; const a = (await p.evaluate(ETAT)); await cliquer(c); const z = await p.evaluate(ETAT); n++;
        if (z.choix[g] !== i) fautes.push(`${o} ${g + 1}.${i + 1} ne se choisit pas`); else if (a.choix[g] !== i) { if (z.face !== a.face) vus++; else fautes.push(`${o} ${g + 1}.${i + 1} ne change pas l’aperçu`); } }
      bilan[o] = n + ' cases'; await p.screenshot({ path: path.join(out, 'bureau-6-onglet-' + o + '.png') }); }
    if (fautes.length) ko(`ÉCART la composition entière : ${fautes.slice(0, 6).join(' ; ')}`); else ok(`depuis la Chaîne : quatre onglets — ${Object.entries(bilan).map(([o, n]) => o + ' ' + n).join(', ')} —, chaque case touchée se choisit, et chacune qui change quelque chose change l’aperçu`);
    // changer d'habit ne change pas un point du visage : sous la capuche, l'étoffe, le néon, la coupe, la longueur, l'écharpe, l'objet
    await cliquer(p.locator('#perso .pv-onglet[data-o="habit"]')); await cliquer(cellule(p, 0, 0));   // la capuche
    await cliquer(p.locator('#perso .pv-onglet[data-o="visage"]')); await cliquer(cellule(p, 0, 1)); const v0 = await visageVu('capuche'); const face0 = []; let changes = 0;
    for (const [o, g, i] of [['couleurs', 0, 6], ['couleurs', 1, 2], ['habit', 3, 3], ['habit', 1, 1], ['habit', 2, 1], ['objet', 0, 1], ['couleurs', 0, 2]]) { await cliquer(p.locator(`#perso .pv-onglet[data-o="${o}"]`)); await cliquer(cellule(p, g, i)); face0.push((await visageVu('capuche')) === v0); changes++; }
    if (face0.some(x => !x) || !v0) ko(`ÉCART changer d'habit change le visage dans l'aperçu (${face0.map(x => x ? '=' : '≠').join(' ')})`); else ok(`dans l’aperçu, changer l’étoffe, le néon, la coupe, la longueur, l’écharpe ou l’objet laisse le visage au point près (${changes} changements)`);
    // la calotte et « sans manteau » s'excluent : la case qui ne va pas s'éteint, rien ne change en silence
    await cliquer(p.locator('#perso .pv-onglet[data-o="habit"]')); await cliquer(cellule(p, 3, 0)); await cliquer(cellule(p, 0, 1)); const k1 = await p.evaluate(ETAT);
    await cliquer(cellule(p, 0, 0)); await cliquer(cellule(p, 3, 1)); const k2 = await p.evaluate(ETAT); await p.screenshot({ path: path.join(out, 'bureau-7-sans-manteau.png') });
    await cliquer(cellule(p, 3, 2)); const k3 = await p.evaluate(ETAT);
    if (JSON.stringify(k1.eteintes[3]) !== '[1]' || k1.choix[0] !== 1 || k1.choix[3] !== 0 || JSON.stringify(k2.eteintes[0]) !== '[1]' || k2.choix[3] !== 1 || k2.choix[0] !== 0 || k3.eteintes.some(x => x.length)) ko(`ÉCART la calotte et « sans manteau » : ${JSON.stringify([k1.eteintes, k1.choix, k2.eteintes, k2.choix, k3.eteintes])}`);
    else ok('la calotte choisie, la case « sans manteau » s’éteint ; « sans manteau » choisi, la calotte s’éteint ; une autre coupe, tout se rallume — aucune rangée ne change en silence');
    // le dé : une autre tenue à chaque fois, jamais un autre visage ; ↺ : le râwî de toujours
    await cliquer(p.locator('#perso .pv-onglet[data-o="visage"]')); const d0 = await p.evaluate(ETAT), des = [];
    for (let i = 0; i < 3; i++) { await p.waitForTimeout(650); await cliquer(p.locator('#perso .pv-de')); const e = await p.evaluate(ETAT); des.push([e.face !== (des.length ? des[des.length - 1][2] : d0.face), JSON.stringify(e.choix) === JSON.stringify(d0.choix), e.face]); await p.screenshot({ path: path.join(out, 'bureau-8-de-' + (i + 1) + '.png') }); }
    await p.waitForTimeout(650); await cliquer(p.locator('#perso .pv-zero')); const z0 = await p.evaluate(ETAT), orig = await p.evaluate(() => { const G = window.ISNAD.gfx, L = Object.assign({ kind: 'compagnon' }, window.ISNAD.D.TENUES[0].look); return G.figure(L, 0, 0).toDataURL(); });
    if (des.some(d => !d[0] || !d[1])) ko(`ÉCART le dé : ${des.map(d => (d[0] ? 'autre tenue' : 'même tenue') + (d[1] ? '' : ', visage changé')).join(' ; ')}`);
    else if (z0.ensemble !== 0 || JSON.stringify(z0.choix) !== '[2,1,1]' || z0.face !== orig) ko(`ÉCART ↺ ne rend pas le râwî de toujours : ${JSON.stringify({ ensemble: z0.ensemble, choix: z0.choix, meme: z0.face === orig })}`);
    else ok('le dé, trois fois : une autre tenue à chaque fois, le visage choisi gardé ; ↺ : le râwî de toujours, au point près');
    // la composition finale : capuche d'encre, teint clair, glabre, poil sombre ; calotte, robe longue, écharpe, manteau ample ; étoffe claire, néon vert ; les feuillets
    await cliquer(ensemble(p, 1)); await cliquer(cellule(p, 0, 1)); await cliquer(cellule(p, 1, 0)); await cliquer(cellule(p, 2, 0));
    await cliquer(p.locator('#perso .pv-onglet[data-o="habit"]')); await cliquer(cellule(p, 0, 1)); await cliquer(cellule(p, 1, 1)); await cliquer(cellule(p, 2, 1)); await cliquer(cellule(p, 3, 3));
    await cliquer(p.locator('#perso .pv-onglet[data-o="couleurs"]')); await cliquer(cellule(p, 0, 6)); await cliquer(cellule(p, 1, 2));
    await cliquer(p.locator('#perso .pv-onglet[data-o="objet"]')); await cliquer(cellule(p, 0, 1)); const f0 = await p.evaluate(ETAT);
    await p.screenshot({ path: path.join(out, 'bureau-9-compose.png') });
    await bouton(p, '#perso', 'Garder').click(); await p.waitForTimeout(700);
    const COMPO = { teint: 't2', barbe: 0, poil: 'p1', coiffe: 'calotte', manteau: 'ample', longue: true, echarpe: true, etoffe: 'e7', neon: 'n2', objet: 'feuillets' };
    const c2 = await p.evaluate(() => { const I = window.ISNAD; return { profil: I.save.data.profil, chaine: !document.querySelector('#chain').hidden, auto: (I.save.autoGet() || {}).profil, look: I.sagas.idris.heroes.idris.look }; });
    const egal = (a, b) => JSON.stringify(Object.keys(a || {}).sort().reduce((o, k) => { o[k] = a[k]; return o; }, {})) === JSON.stringify(Object.keys(b || {}).sort().reduce((o, k) => { o[k] = b[k]; return o; }, {}));
    if (!c2.chaine || c2.profil.tenue !== 'encre' || !egal(c2.profil.compo, COMPO) || !c2.auto || !egal(c2.auto.compo, COMPO) || c2.look.porte[0] !== 'feuillets' || c2.look.teint !== '#deab7c' || c2.look.coiffe !== 'calotte' || c2.look.court !== false || !Array.isArray(c2.look.neon)) ko(`ÉCART la composition n'est pas gardée telle qu'on l'a faite : ${JSON.stringify(c2.profil)} · ${JSON.stringify(c2.look)}`);
    else ok(`composée par les vrais boutons, « Garder » : la partie gardée porte ${Object.keys(COMPO).length} pièces sur la capuche d’encre (${Object.keys(COMPO).join(', ')}) — des identifiants, jamais une couleur`);
    texte = await p.evaluate(() => window.ISNAD.save.exporter());
    // rechargée : « Continuer » retrouve le personnage
    await p.reload(); await p.waitForTimeout(1700); await bouton(p, '#title .vmenu', 'Continuer').click(); await p.waitForTimeout(1200);
    const c3 = await p.evaluate(() => { const I = window.ISNAD; return { nom: I.perso.nom(), heros: I.sagas.idris.heroes.idris.name, profil: I.perso.profil(), look: I.sagas.idris.heroes.idris.look, chaine: (document.querySelector('#chain').innerText || '').includes('Khalil') }; });
    if (c3.nom !== 'Khalil' || c3.heros !== 'Khalil' || c3.profil.tenue !== 'encre' || !egal(c3.profil.compo, COMPO) || JSON.stringify(c3.look) !== JSON.stringify(c2.look) || !c3.chaine) ko(`ÉCART après rechargement, le personnage est perdu : ${JSON.stringify(c3.profil)}`); else ok('page rechargée, « Continuer » : le râwî s’appelle toujours Khalil et porte, pièce par pièce, ce qu’on lui a composé');
    // depuis la halte, au milieu d'un chapitre : le nom change, l'ensemble aussi — le visage et l'objet restent ; la silhouette du héros change aussitôt
    const c4 = await p.evaluate(async () => { const I = window.ISNAD, W = I.world; I.audio.setOn(false); I.speed = 40; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null;
      await W.startChapter('idris', 0, { saga: 'idris', ci: 0, obj: 1, map: 'archives', opts: {}, pos: 'bureau', party: ['idris'], npcs: {}, foes: [], chests: [], flags: {} }); I.speed = 1;
      const avant = JSON.stringify(W.sheets[0].look); I.ui.pause(); const b = [...document.querySelectorAll('#menu .side button')].find(x => /Ton personnage/.test(x.textContent)); return { avant, entree: !!b }; });
    { await bouton(p, '#menu .side', 'Compagnons').click(); await p.waitForTimeout(500); const groupe = await p.evaluate(() => (document.querySelector('#menu .pane').innerText || '').replace(/\s+/g, ' ')); await p.screenshot({ path: path.join(out, 'bureau-10-halte-groupe.png') });
      if (!/Khalil/.test(groupe) || /(^|[^A-Za-zÀ-ÿ])Idris(?![A-Za-zÀ-ÿ])/.test(groupe)) ko(`ÉCART à la halte, la page du groupe ne dit pas le nom choisi : « ${groupe.slice(0, 120)} »`); else ok(`à la halte, la page du groupe dit le nom choisi — « ${groupe.slice(0, 60)}… »`); }
    if (!c4.entree) ko('ABSENT la halte ne propose pas « Ton personnage »');
    else { await bouton(p, '#menu .side', 'Ton personnage').hover(); await p.waitForTimeout(400);   // survolée, la rubrique montre sa page
      const page1 = await p.evaluate(() => { const pane = document.querySelector('#menu .pane'); return { images: pane.querySelectorAll('.perso-vue img').length, texte: (pane.innerText || '').replace(/\s+/g, ' ') }; });
      await p.screenshot({ path: path.join(out, 'bureau-10b-halte-page.png') });
      await bouton(p, '#menu .side', 'Ton personnage').click(); await p.waitForTimeout(500);
      if (page1.images !== 2 || !/Khalil/.test(page1.texte) || /tenue du veilleur|Manteau des Archives|Capuche d’encre/i.test(page1.texte)) ko(`ÉCART la page « Ton personnage » de la halte ne montre pas le râwî : ${JSON.stringify(page1)}`);
      if (await p.evaluate(() => document.querySelector('#perso').hidden)) { await bouton(p, '#menu .side', 'Ton personnage').click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(700); }   // un premier toucher qui n'aurait fait que choisir la rubrique
      const ouvert = await p.evaluate(() => !document.querySelector('#perso').hidden);
      if (!ouvert) ko('BLOQUÉ à la halte, « Ton personnage » n’ouvre pas l’écran');
      else { await p.locator('#perso input').fill('Sélim'); await cliquer(ensemble(p, 5)); await p.screenshot({ path: path.join(out, 'bureau-11-depuis-la-halte.png') }); await bouton(p, '#perso', 'Garder').click(); await p.waitForTimeout(900);
        const c5 = await p.evaluate(() => { const I = window.ISNAD, W = I.world; return { nom: I.perso.nom(), heros: W.hero('idris').def.name, profil: I.perso.profil(), apres: JSON.stringify(W.sheets[0].look), monde: I.scene === W && !I.ui.menuOpen, ferme: document.querySelector('#perso').hidden }; });
        await p.screenshot({ path: path.join(out, 'bureau-12-dans-le-chapitre.png') });
        const garde = { teint: 't2', barbe: 0, poil: 'p1', objet: 'feuillets' };
        if (c5.nom !== 'Sélim' || c5.heros !== 'Sélim' || c5.profil.tenue !== 'lettre' || !egal(c5.profil.compo, garde) || c5.apres === c4.avant || !c5.monde || !c5.ferme) ko(`ÉCART depuis la halte, le changement ne prend pas : ${JSON.stringify(c5)}`);
        else ok('depuis la halte, au milieu d’un chapitre : la page montre le râwî lui-même (sa figure, son nom) ; un nouveau nom et un autre ensemble — l’habit repart de l’ensemble, le visage et l’objet restent — et la silhouette du héros change aussitôt'); } }
    sansErreur('en changeant de personnage'); await p.close();
    // la partie exportée, importée dans un autre navigateur : le personnage vient avec elle, pièce par pièce
    const q = await ouvrir(); await bouton(q, '#title', 'Importer une partie').click(); await q.waitForSelector('#partie:not([hidden])'); await q.locator('#partie textarea').fill(texte); await q.waitForTimeout(650); await bouton(q, '#partie', 'Lire cette partie').click(); await q.waitForTimeout(700);
    await bouton(q, '#partie', /Reprendre cette partie|Remplacer ma partie/).click(); await q.waitForTimeout(1500);
    const c6 = await q.evaluate(() => { const I = window.ISNAD; return { nom: I.perso.nom(), profil: I.perso.profil(), heros: I.sagas.idris.heroes.idris.name, look: I.sagas.idris.heroes.idris.look, chaine: (document.querySelector('#chain').innerText || '').includes('Khalil') }; });
    if (c6.nom !== 'Khalil' || c6.profil.tenue !== 'encre' || !egal(c6.profil.compo, COMPO) || c6.heros !== 'Khalil' || !c6.chaine || c6.look.teint !== '#deab7c' || c6.look.porte[0] !== 'feuillets') ko(`ÉCART une partie importée perd son personnage : ${JSON.stringify(c6.profil)}`);
    else ok('une partie exportée puis importée dans un autre navigateur garde son personnage : Khalil, capuche d’encre, et ses dix pièces');
    // et un profil abîmé dans une partie importée ne passe pas : on retombe sur Idris, sa tenue et son visage d'origine
    const c7 = await q.evaluate(t => { const I = window.ISNAD, o = JSON.parse(t); o.partie.profil = { nom: '<img src=x onerror=alert(1)>', tenue: 'inconnue', compo: { teint: '<b>t1</b>', barbe: 'pleine', coiffe: 'keffieh', etoffe: '__proto__', neon: 'n9', objet: 'sabre', manteau: 'cape' } }; const r = I.save.lireTexte(JSON.stringify(o)); if (!r.ok) return { refuse: r.erreur }; I.save.adopter(r.partie);
      const h = I.sagas.idris.heroes.idris; return { nom: I.perso.nom(), profil: I.perso.profil(), heros: h.name, look: JSON.stringify(h.look) === JSON.stringify(I.D.TENUES[0].look) }; }, texte);
    if (c7.refuse || c7.nom !== 'Idris' || c7.profil.tenue !== 'archives' || c7.heros !== 'Idris' || !c7.look) ko(`ÉCART un profil abîmé n'est pas ramené au personnage d'origine : ${JSON.stringify(c7)}`);
    else { const c8 = await q.evaluate(t => { const I = window.ISNAD, o = JSON.parse(t); o.partie.profil.compo = { teint: 'x9', barbe: [1], poil: { a: 1 }, longue: 'oui', echarpe: 0, objet: 'durra' }; const r = I.save.lireTexte(JSON.stringify(o)); if (!r.ok) return { refuse: r.erreur }; I.save.adopter(r.partie); return { profil: I.perso.profil(), look: I.sagas.idris.heroes.idris.look }; }, texte);
      if (c8.refuse || c8.profil.nom !== 'Khalil' || c8.profil.tenue !== 'encre' || Object.keys(c8.profil.compo).length || c8.look.teint) ko(`ÉCART une composition abîmée n'est pas oubliée : ${JSON.stringify(c8)}`);
      else ok('un profil abîmé dans une partie importée (un nom qui n’en est pas un, une tenue inconnue, des pièces faussées) : le râwî redevient Idris, dans sa tenue et avec son visage de toujours ; une composition seule abîmée est oubliée, le nom et l’ensemble restent'); }
    sansErreur('en important un personnage'); await q.close(); }

  /* ---------- 5. en arabe : de droite à gauche ---------- */
  { const p = await ouvrir({ width: 390, height: 844 }, '?lang=ar'); const k = await p.evaluate(() => [...document.querySelectorAll('#title .vmenu button')].findIndex(b => b.textContent.trim() === window.ISNAD.t('Nouvelle partie')));
    await p.locator('#title .vmenu button').nth(Math.max(0, k)).tap(); await p.waitForTimeout(800);
    const a = await p.evaluate(() => { const s = document.querySelector('#perso'), E = [...s.querySelectorAll('.pv-ens .pv-c')], T = [...s.querySelectorAll('.pv-panneau .pv-groupe')[0].querySelectorAll('.pv-c')], x = b => b.getBoundingClientRect().left;
      const ok = s.querySelector('.ok'), r = ok.getBoundingClientRect(); return { dir: document.documentElement.dir, ouvert: !s.hidden, miroir: x(E[0]) > x(E[5]) && x(T[0]) > x(T[6]), ok: r.bottom <= innerHeight && r.top >= 0, large: s.scrollWidth > s.clientWidth + 1, defile: s.scrollHeight > s.clientHeight + 1, titre: s.querySelector('h2').textContent }; });
    await p.locator('#perso .pv-panneau .pv-groupe').first().locator('.pv-c').nth(6).tap(); await p.waitForTimeout(250); const a2 = await p.evaluate(() => [...document.querySelectorAll('#perso .pv-panneau .pv-groupe')[0].querySelectorAll('.pv-c')].findIndex(b => b.getAttribute('aria-checked') === 'true'));
    await p.screenshot({ path: path.join(out, 'arabe-telephone.png') });
    if (!a.ouvert || a.dir !== 'rtl' || !a.miroir || !a.ok || a.large || a2 !== 6) ko(`ÉCART en arabe, l'écran ne se lit pas de droite à gauche, ou déborde : ${JSON.stringify(a)} (teint choisi : ${a2})`);
    else ok(`en arabe (« ${a.titre} ») : l'écran se retourne — le premier ensemble et le premier teint à droite —, rien ne déborde, « ابدأ » reste à l'écran ; toucher un teint le choisit`);
    sansErreur('en arabe'); await p.close(); }

  /* ---------- 6. au clavier ---------- */
  { const p = await ouvrir(); await bouton(p, '#title .vmenu', 'Nouvelle partie').click(); await p.waitForTimeout(800);   // la souris reste là où était « Nouvelle partie »
    const sel = () => p.evaluate(() => { const b = document.querySelector('#perso button.sel'); if (!b) return null; const r = b.getBoundingClientRect(), g = b.closest('.pv-groupe'); return { cls: b.className, grp: g ? g.getAttribute('aria-label') : null, x: Math.round(r.left), y: Math.round(r.top), coche: b.getAttribute('aria-checked'), bas: !!b.closest('.pv-bas'), dernier: !!g && b === [...g.querySelectorAll('.pv-c')].pop() }; });
    const touche = async k => { await p.keyboard.press(k); await p.waitForTimeout(110); return sel(); };
    const s0 = await sel(); let s1 = null; for (let i = 0; i < 8 && !(s1 && s1.grp); i++) s1 = await touche(i % 2 ? 'ArrowRight' : 'ArrowUp');   // ↑ (et →) jusqu'aux cases
    const s2 = await touche(s1 && s1.dernier ? 'ArrowLeft' : 'ArrowRight'), s3 = await touche('Enter');
    let s4 = null; for (let i = 0; i < 8 && !(s4 && s4.bas); i++) s4 = await touche('ArrowDown');                    // ↓ jusqu'aux boutons
    let s5 = s4; for (let i = 0; i < 4 && !(s5 && /\bok\b/.test(s5.cls)); i++) s5 = await touche('ArrowRight');         // → jusqu'à « Commencer »
    await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
    const s6 = await p.evaluate(() => { const I = window.ISNAD; return { ferme: document.querySelector('#perso').hidden, monde: !!(I.world.saga && I.world.saga.id === 'idris'), profil: I.save.data.profil }; });
    if (!s0 || !/\bok\b/.test(s0.cls) || !s1 || !s1.grp || !s2 || s2.x === s1.x || s3.coche !== 'true' || !s4 || !s4.bas || !s5 || !/\bok\b/.test(s5.cls) || !s6.ferme || !s6.monde) ko(`ÉCART au clavier : ${JSON.stringify({ depart: s0, haut: s1, cote: s2, entree: s3, bas: s4, ok: s5, fin: s6 })}`);
    else ok(`au clavier, la souris immobile sur l’écran : « Commencer » reste choisi ; ↑ monte aux cases (« ${s1.grp} »), ← → vont à la case voisine, Entrée la choisit, ↓ redescend aux boutons, → jusqu’à « Commencer », Entrée commence — profil ${JSON.stringify(s6.profil)}`);
    sansErreur('au clavier'); await p.close(); }

  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ PERSONNAGE : le nom, l'ensemble et ce que le joueur compose — choisis par les vrais boutons, joués, gardés, exportés, réimportés — aucune anomalie (captures dans ${path.relative(process.cwd(), out)})`);
  process.exit(anomalies ? 1 : 0);
})();
