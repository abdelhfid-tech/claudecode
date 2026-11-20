#!/usr/bin/env node
/* ISNAD 2.x — la langue secondaire (demande du décideur, 19 novembre ; src/core/script.js, « la langue secondaire »).
   Pour chaque couple (langue du jeu, langue secondaire), sur un téléphone tenu en hauteur (390 × 844) puis en largeur
   (844 × 390), par les vrais boutons et au doigt, comme doigt.js :
   1. la langue secondaire se choisit dans les Réglages de l'écran-titre (le bouton en fait le tour), se garde avec les
      réglages de l'appareil (une page rechargée la retrouve) et n'entre pas dans la partie ;
   2. le prologue entier se joue au doigt : chaque réplique et chaque narration montre, une fois écrite, sa seconde bulle —
      non vide, dans la langue secondaire (le texte est l'un de ceux que cette langue a écrits, src/lang/), avec son sens
      (de droite à gauche en arabe) et sa langue (lang), lisible (aucun texte sous dix points), sans débordement (ni coupée,
      ni hors de l'écran, ni sur la première bulle ; en hauteur, ni sur l'image) ; chaque carton du récit (le titre et sa
      date) porte son bloc de langue secondaire, et tient dans l'écran ; le fil, s'il parle, porte sa ligne ;
   3. puis un carton de parole citée (la clôture de l'histoire-cadre) et le carton d'un attribut divin (son verset).
   Une fois, en français et sans langue secondaire : rien ne paraît (ni bulle, ni bloc, ni rien dans les réglages gardés) ;
   puis on la choisit à la halte, et la réplique suivante porte sa seconde bulle.
   Usage : node v2/tools/bilingue.js [fr-ar en-ja …] [390x844 844x390] [par=4]
   Sortie : une ligne par partie jouée, puis « BILINGUE CONFORME ». Sinon « ABSENT » (une bulle ou un bloc manque), « ÉCART »
   (pas la bonne langue, pas le bon sens, un réglage non gardé), « INVISIBLE » (un texte sous dix points, ou qui déborde),
   « BLOQUÉ » (le prologue ne s'achève pas), « TEXTE CACHÉ ». Code 1 à la moindre anomalie. Captures dans .smoke/bilingue/. */
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/bilingue'), url = 'file://' + path.resolve(V2, process.env.JEU || 'index.html');
const L = require(path.join(V2, 'src/core/langue.js'));
const PLANCHER = 10;
const args = process.argv.slice(2);
const TOUTES = L.ORDRE, PAIRES = [];
TOUTES.forEach(a => TOUTES.forEach(b => { if (a !== b) PAIRES.push([a, b]); }));
const voulues = args.filter(a => /^[a-z]{2}-[a-z]{2}$/.test(a)).map(a => a.split('-'));
const paires = voulues.length ? voulues : PAIRES;
const dims = args.filter(a => /^\d+x\d+$/.test(a)).map(t => t.split('x').map(Number));
const tailles = dims.length ? dims : [[390, 844], [844, 390]];
const PAR = +((args.find(a => /^par=\d+$/.test(a)) || 'par=4').slice(4));

/* ---------- ce que chaque langue a écrit (src/lang/) : un texte de la seconde bulle doit en être ---------- */
const net = s => String(s).replace(/<[^>]*>/g, '').replace(/\*/g, '').replace(/^«\s*|\s*»$/g, '').replace(/\s+/g, ' ').trim();
const ECRITS = { fr: new Set() };
TOUTES.filter(l => l !== 'fr').forEach(l => { ECRITS[l] = new Set();
  fs.readdirSync(path.join(V2, 'src/lang', l)).filter(f => /\.json$/.test(f)).forEach(f => (JSON.parse(fs.readFileSync(path.join(V2, 'src/lang', l, f), 'utf8')).textes || []).forEach(x => {
    if (x.t) ECRITS[l].add(net(x.t)); if (x.fr) ECRITS.fr.add(net(x.fr.indexOf('§') > 0 ? x.fr.slice(0, x.fr.indexOf('§')) : x.fr)); })); });
const ECRITURE = { ar: /[ء-ي]/, ja: /[぀-ヿ一-鿿]/, fr: /[A-Za-zÀ-ÿ]/, en: /[A-Za-z]/ };
const SENS = l => (l === 'ar' ? 'rtl' : 'ltr');

let anomalies = 0; const lignes = [];
const ko = (mot, m) => { anomalies++; lignes.push(mot + ' ' + m); };

/* ---------- dans la page : ce que le jeu attend, et ce que montre la langue secondaire ---------- */
function etat() {
  const I = window.ISNAD, W = I.world, G = I.gfx, q = s => document.querySelector(s), vis = e => !!e && !e.hidden;
  const mid = e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, Math.min(innerHeight - 6, r.top + r.height / 2)]; };
  const on = (quoi, e, pt, extra) => Object.assign({ quoi, pt: pt || mid(e), texte: (e.textContent || '').trim().slice(0, 44) }, extra || {});
  const ou = W.saga ? W.saga.id + '/' + (W.ch ? W.ch.id : '') + '#' + W.objIndex : '';
  if (I.debug.auto) return { quoi: 'attente', ou };
  if (vis(q('#chain'))) return { quoi: 'chaine', ou };
  if (vis(q('#title'))) return on('titre', q('#title .vmenu > button'), null, { ou });   // sans partie en cours : « Nouvelle partie »
  if (vis(q('#perso'))) return on('personnage', q('#perso .ok'), null, { ou });
  if (vis(q('#card')) && q('#card').classList.contains('on')) return on('carton', q('#card'), [innerWidth / 2, innerHeight * 0.8], { ou, cls: q('#card').className });
  if (vis(q('#menu'))) return on('halte', q('#menu .side button'), null, { ou });
  if (vis(q('#choice'))) { const o = [...q('#choice').querySelectorAll('.opt:not(.locked)')], pr = q('#choice .prompt'); return on('choix', o[o.length - 1], null, { ou, n: o.length, rects: o.map(mid), prompt: pr ? pr.textContent.trim().slice(0, 44) : '' }); }
  if (I.battle.active) { const c = q('#battle .cmd'), b = q('#battle .banner');
    if (c && c.querySelector('.mhint')) { const cible = (I.battle.places ? I.battle.places() : []).find(e => e.choix && e.camp === 'foe'), pl = q('.plate');
      if (cible) { const r = q('#cv').getBoundingClientRect(); return on('cible', q('#battle'), [r.left + cible.x / G.PW * r.width, r.top + cible.y / G.PH * r.height], { ou, texte: cible.nom }); }
      return pl ? on('cible', pl, null, { ou }) : { quoi: 'attente', ou }; }
    // (2.19 : la deuxième commande de la liste principale — les Vertus ; dans leur liste, la première qui se prend : Éclairer)
    if (c && c.querySelectorAll('.mi').length && !(b && !b.hidden)) return on('commande', c.querySelector('.mlist.main') ? c.querySelectorAll('.mlist.main .mi')[1] || c.querySelector('.mi') : [...c.querySelectorAll('.mi')].find(x => !x.hidden && !x.classList.contains('off')) || c.querySelector('.mi'), null, { ou });
    if (b && !b.hidden) return on('bandeau', b, null, { ou });
    return { quoi: 'attente', ou }; }
  if (vis(q('#dialog'))) return on('dialogue', q('#dialog'), [innerWidth / 2, Math.min(innerHeight - 6, q('#dialog').getBoundingClientRect().bottom + 30)], { ou, ecrit: q('#dialog .next').style.visibility !== 'hidden', kind: q('#dialog').className });
  if (I.scene === W && !I.script.busy && !W.lock && W.map) { const t = W.target && W.target(), c = q('#cv').getBoundingClientRect(), s = q('#stage').getBoundingClientRect();
    if (!t) return { quoi: 'attente', ou };
    const x = (t.gx - Math.round(W.cam.x)) / G.PW * c.width + c.left, y = (t.gy - 6 - Math.round(W.cam.y)) / G.PH * c.height + c.top, bas = s.bottom - s.top > 300 ? 90 : 64;
    const pt = [Math.max(s.left + 14, Math.min(s.right - 14, x)), Math.max(s.top + bas, Math.min(s.bottom - 14, y))];
    if (W.miniRect) { const r = W.miniRect, l = c.left + r[0] / G.PW * c.width, t2 = c.top + r[1] / G.PH * c.height, d = l + r[2] / G.PW * c.width, b2 = t2 + r[3] / G.PH * c.height; if (pt[0] > l - 8 && pt[0] < d + 8 && pt[1] > t2 - 8 && pt[1] < b2 + 8) pt[1] = Math.min(s.bottom - 14, b2 + 12); }
    document.querySelectorAll('#pad button').forEach(b => { const r = b.getBoundingClientRect(); if (r.width > 4 && getComputedStyle(b).visibility !== 'hidden' && pt[0] > r.left - 5 && pt[0] < r.right + 5 && pt[1] > r.top - 5 && pt[1] < r.bottom + 5) pt[1] = r.top - 9; });
    return { quoi: 'marche', ou, pt, texte: 'objectif ' + W.objIndex, pos: Math.round(W.player.x) + ',' + Math.round(W.player.y) }; }
  return { quoi: 'attente', ou };
}
// la seconde bulle d'une réplique, telle qu'elle se montre
function bulle(seuil) {
  const q = s => document.querySelector(s), d2 = q('#dialog2'), box = q('#dialog'), st = q('#stage').getBoundingClientRect();
  if (!d2 || d2.hidden) return { vue: false };
  const r = d2.getBoundingClientRect(), b = box.getBoundingClientRect(), tx = d2.querySelector('.text'), portrait = document.body.classList.contains('portrait');
  const tailles = [d2, ...d2.querySelectorAll('*')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => parseFloat(getComputedStyle(e).fontSize));
  const soucis = [];
  if (d2.scrollHeight > d2.clientHeight + 2 || d2.classList.contains('defile')) soucis.push('elle déborde de sa place (' + d2.scrollHeight + ' > ' + d2.clientHeight + ')');
  if (d2.scrollWidth > d2.clientWidth + 2) soucis.push('elle déborde en largeur');
  if (r.top < 0 || r.bottom > innerHeight + 0.5 || r.left < 0 || r.right > innerWidth + 0.5) soucis.push('elle sort de l’écran');
  if (portrait ? r.top < b.bottom - 0.5 : r.bottom > b.top + 0.5) soucis.push('elle couvre la première bulle');
  if (portrait && r.top < st.bottom - 0.5) soucis.push('elle couvre l’image');
  if (Math.min(...tailles) < seuil) soucis.push('texte à ' + Math.min(...tailles).toFixed(1) + ' points');
  const z = e => +getComputedStyle(e).zIndex || 0; if (+getComputedStyle(q('#fade')).opacity > 0.5 && z(d2) <= z(q('#fade'))) soucis.push('sous le noir du fondu');
  return { vue: true, texte: tx.textContent, lang: d2.lang, dir: d2.dir, mini: Math.min(...tailles), soucis, premier: q('#dialog .text').textContent };
}
// le bloc de langue secondaire d'un carton
function blocCarton(seuil) {
  const c = document.querySelector('#card'), l2 = c.querySelector('.l2');
  if (!l2) return { vu: false, cls: c.className };
  const r = l2.getBoundingClientRect(), parts = [...l2.querySelectorAll('h2, p, blockquote, cite')].map(e => e.textContent);
  const tailles = [...c.querySelectorAll('*')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && e.getClientRects().length).map(e => parseFloat(getComputedStyle(e).fontSize));
  const soucis = [];
  if (c.scrollHeight > c.clientHeight + 2) soucis.push('le carton déborde de l’écran (' + c.scrollHeight + ' > ' + c.clientHeight + ')');
  if (r.top < 0 || r.bottom > innerHeight + 0.5 || r.left < 0 || r.right > innerWidth + 0.5) soucis.push('le bloc sort de l’écran');
  if (Math.min(...tailles) < seuil) soucis.push('texte à ' + Math.min(...tailles).toFixed(1) + ' points');
  return { vu: true, cls: c.className, lang: l2.lang, dir: l2.dir, parts, mini: Math.min(...tailles), soucis };
}
// le fil : une annonce montrée, et sa ligne de langue secondaire
function filVu() { const f = document.querySelector('#toasts'); if (!f || !f.classList.contains('montre')) return null; const t = [...f.querySelectorAll('.toast')].find(e => !e.hidden && e.classList.contains('avec2')); if (!t) return null; const s = t.querySelector('.l2');
  return { texte: s.textContent, lang: s.lang, dir: s.dir, taille: parseFloat(getComputedStyle(s).fontSize), annonce: [...t.childNodes].filter(n => n !== s).map(n => n.textContent).join('').slice(0, 60) }; }

// la seconde bulle (ou le bloc) dit-elle un texte de la langue secondaire, dans son sens et sa langue ?
function juger(l2, o, quoi, ou) {
  const m = [];
  if (o.lang !== l2) m.push(['ÉCART', `lang="${o.lang}" au lieu de « ${l2} »`]);
  if (o.dir !== SENS(l2)) m.push(['ÉCART', `sens ${o.dir} au lieu de ${SENS(l2)}`]);
  // le texte principal (la réplique, le titre, la parole, le verset) est l'un de ceux que la langue a écrits ; une ligne
  // faite par le moteur (la référence d'un verset dite « {ref}, traduction du sens ») est au moins dans son écriture
  const textes = o.parts || [o.texte];
  textes.forEach((t, i) => { const n = net(t); if (!n) { m.push(['ABSENT', 'texte vide']); return; }
    if (ECRITS[l2].has(n)) return;
    if (i === 0) m.push(['ÉCART', `« ${n.slice(0, 50)} » n’est pas un texte que la langue ${l2} a écrit`]);
    else if (!ECRITURE[l2].test(n)) m.push(['ÉCART', `« ${n.slice(0, 40)} » n’est pas écrit dans l’écriture de la langue ${l2}`]); });
  (o.soucis || []).forEach(s => m.push(['INVISIBLE', s]));
  return m.map(([mot, s]) => [mot, `${quoi} (${ou}) : ${s}`]);
}

async function partie(browser, lang, l2, w, h) {
  const errors = [], ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent });
  const p = await ctx.newPage(), cle = `${lang}-${l2}-${w}x${h}`, shots = new Set(), soucis = [], compte = { bulles: 0, cartons: 0, fil: 0 }, fils = []; let mini = 99;
  p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const shot = async n => { if (shots.has(n)) return; shots.add(n); await p.screenshot({ path: path.join(out, `${cle}-${n}.png`) }); };
  const note = (mot, m) => { const k = mot + ' ' + m; if (!soucis.includes(k)) soucis.push(k); };
  // 1. la langue secondaire se choisit dans les Réglages de l'écran-titre, et se garde
  await p.goto(url + '?lang=' + lang); await p.waitForTimeout(1500);
  const NOM2 = L.LANGUES[l2].nom;
  // « Réglages » : le dernier bouton de la colonne (les langues de jeu sont rangées à part, dans .langues)
  await p.evaluate(() => { const b = document.querySelectorAll('#title .vmenu > button'); b[b.length - 1].click(); }); await p.waitForTimeout(300);
  let lab = '';
  for (let i = 0; i < 5; i++) { lab = await p.evaluate(() => { const b = document.querySelector('#title .vmenu button.langue2'); return b ? b.textContent : ''; }); if (!lab || lab.indexOf(NOM2) >= 0) break;
    await p.locator('#title .vmenu button.langue2').tap(); await p.waitForTimeout(750); }   // un bouton ne répond pas deux fois en 600 ms (ui.js, tapable)
  const garde = await p.evaluate(() => { try { return JSON.parse(localStorage.getItem('isnad2.opts') || '{}').lang2 || ''; } catch (e) { return '?'; } });
  if (!lab) note('ABSENT', `${cle} : aucun réglage « Langue secondaire » à l’écran-titre`);
  else if (lab.indexOf(NOM2) < 0 || garde !== l2) note('ÉCART', `${cle} : le réglage dit « ${lab.slice(0, 60)} », gardé : « ${garde} »`);
  await shot('0-reglages');
  await p.reload(); await p.waitForTimeout(1300);
  const relu = await p.evaluate(() => window.ISNAD.langue.l2()); if (relu !== l2) note('ÉCART', `${cle} : page rechargée, la langue secondaire est « ${relu} »`);
  await p.evaluate(() => { const I = window.ISNAD; I.debug.log = []; I.audio.setOn(false); const ob = I.ui.showChain; I.ui.showChain = function () { window.__chaine = 1; return ob.apply(this, arguments); }; });
  // chaque réplique est regardée dans la page, à l'instant où elle a fini de s'écrire (son ▼ paraît) ; chaque carton, une
  // fois montré : aucun toucher, si vif soit-il, ne fait passer une ligne sans qu'elle ait été vue
  await p.evaluate(`window.__bulle = ${bulle.toString()}; window.__bloc = ${blocCarton.toString()};`);
  await p.evaluate(seuil => { const I = window.ISNAD, W = I.world, q = s => document.querySelector(s), nx = q('#dialog .next'), c = q('#card'); window.__l2 = []; window.__cartons = [];
    const ou = () => (W.saga ? W.saga.id + '/' + (W.ch ? W.ch.id : '') + '#' + W.objIndex : '');
    new MutationObserver(() => { if (nx.style.visibility === 'visible' && !q('#dialog').hidden) window.__l2.push(Object.assign(window.__bulle(seuil), { kind: q('#dialog').className, ou: ou(), ligne: q('#dialog .text').textContent.slice(0, 50) })); }).observe(nx, { attributes: true, attributeFilter: ['style'] });
    let vu = null; new MutationObserver(() => { const on = !c.hidden && c.classList.contains('on'); if (on && vu !== c.innerHTML) { vu = c.innerHTML; const h = vu; setTimeout(() => { if (c.innerHTML === h) window.__cartons.push(Object.assign(window.__bloc(seuil), { ou: ou(), titre: (c.querySelector('h1, blockquote') || c).textContent.slice(0, 40) })); }, 300); } else if (!on) vu = null; }).observe(c, { attributes: true, attributeFilter: ['class'] }); }, PLANCHER);
  // 2. le prologue, au doigt
  const t0 = Date.now(); let fini = false, dernier = '', depuis = Date.now(), lieu = '', tours = {};
  while (Date.now() - t0 < 300000) {
    const s = await p.evaluate(etat); if (s.ou) lieu = s.ou;
    if (s.quoi === 'chaine') { fini = true; break; }
    const k = s.quoi + '|' + (s.texte || '') + '|' + (s.pos || '') + '|' + (s.ou || ''); if (k !== dernier) { dernier = k; depuis = Date.now(); }
    if (Date.now() - depuis > 60000) break;
    if (s.quoi === 'attente') { await p.waitForTimeout(220); continue; }
    if (s.quoi === 'dialogue') {
      if (!s.ecrit) { await p.touchscreen.tap(s.pt[0], s.pt[1]); await p.waitForTimeout(220); }   // un toucher presse l'écriture : la seconde bulle paraît
      const vue = await p.evaluate(() => !document.querySelector('#dialog2').hidden && document.querySelector('#dialog .next').style.visibility === 'visible');
      if (vue) { const n = await p.evaluate(() => window.__l2.length); if (/nar/.test(s.kind)) await shot('1-narration'); else await shot('2-replique'); if (n >= 12) await shot('3-replique'); }
      const s2 = await p.evaluate(etat); if (s2.quoi === 'dialogue' && s2.ecrit) await p.touchscreen.tap(s2.pt[0], s2.pt[1]);
      await p.waitForTimeout(380); continue;
    }
    if (s.quoi === 'carton') { await p.waitForTimeout(420); const c = await p.evaluate(() => document.querySelector('#card').className);
      if (/\b(title|quote)\b/.test(c) && !/parley|noos/.test(c)) await shot(/quote/.test(c) ? '7-parole' : shots.has('4-carton') ? '5-carton' : '4-carton'); }
    if (s.quoi === 'marche') { const f = await p.evaluate(filVu); if (f && !fils.some(x => x.texte === f.texte)) { compte.fil++; fils.push(f); if (f.lang !== l2 || f.dir !== SENS(l2) || !net(f.texte) || !ECRITURE[l2].test(f.texte) || f.taille < PLANCHER) note('ÉCART', `${cle} · le fil : « ${net(f.texte).slice(0, 40)} » (lang ${f.lang}, ${f.dir}, ${f.taille.toFixed(1)} points)`); await shot('6-fil'); } }
    let pt = s.pt;
    if (s.quoi === 'choix' && s.rects && s.rects.length) { const kk = s.prompt + '|' + s.n, i = tours[kk] = (tours[kk] === undefined ? s.n - 1 : (tours[kk] + s.n - 1) % s.n); pt = s.rects[Math.min(i, s.rects.length - 1)]; }
    await p.touchscreen.tap(pt[0], pt[1]);
    await p.waitForTimeout(s.quoi === 'marche' ? 850 : 430);
  }
  if (!fini) { const s = await p.evaluate(etat); await p.screenshot({ path: path.join(out, `${cle}-bloque.png`) }); note('BLOQUÉ', `${cle} : le prologue ne s’achève pas — ${lieu || 'avant la partie'}, le jeu attend : ${s.quoi}${s.texte ? ' « ' + s.texte + ' »' : ''}`); }
  // 3. un carton de parole citée (la clôture de l'histoire-cadre), puis un verset (un attribut divin)
  if (fini) {
    const carton = async (lancer, n) => { const avant = await p.evaluate(() => window.__cartons.length); await p.evaluate(lancer);
      for (let i = 0; i < 30 && (await p.evaluate(() => window.__cartons.length)) === avant; i++) await p.waitForTimeout(150);
      await shot(n); await p.touchscreen.tap(w / 2, h * 0.85); await p.waitForTimeout(700); };
    await carton(() => { const I = window.ISNAD; I.script.run([I.sagas.idris.outro[0]]); }, '7-parole');
    await carton(() => { const I = window.ISNAD; I.valeurs.reconnait(Object.keys(I.sagas.coeur.attributs)[0]); }, '8-verset');
    // le nom choisi par le joueur : il se pose aussi dans la seconde langue (perso.js, direDans), à la place de celui que
    // cette langue donne au râwî
    const n = await p.evaluate(() => { const I = window.ISNAD, op = I.sagas.idris.chapters[0].objectives[2].then[0]; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen');
      I.perso.choisir('Khalil', I.D.TENUES[0].id); I.script.run([op]); return window.__l2.length; });
    for (let i = 0; i < 40 && (await p.evaluate(() => window.__l2.length)) === n; i++) { await p.keyboard.press('Enter'); await p.waitForTimeout(200); }
    const nom = await p.evaluate(() => window.__l2.pop() || null);   // retirée du relevé : son texte porte le nom choisi
    const RAWI2 = L.LANGUES[l2].rawi;
    if (!nom || !nom.vue) note('ABSENT', `${cle} : avec un nom choisi, la réplique n’a pas de seconde bulle`);
    else if (nom.texte.indexOf('Khalil') < 0 || nom.texte.indexOf(RAWI2) >= 0 || nom.premier.indexOf('Khalil') < 0) note('ÉCART', `${cle} : le nom choisi n’est pas posé dans les deux bulles (« ${nom.premier.slice(0, 40)} » / « ${nom.texte.slice(0, 40)} »)`);
    else { await shot('9-nom'); fils.push({ nom: true, texte: nom.premier + ' / ' + nom.texte }); }
    await p.keyboard.press('Enter'); await p.waitForTimeout(400);
    await p.evaluate(() => { const I = window.ISNAD; I.perso.choisir(I.perso.NOM, I.D.TENUES[0].id); });
  }
  // ce que la page a vu : chaque réplique, chaque carton du récit
  const vues = await p.evaluate(() => ({ l2: window.__l2, cartons: window.__cartons }));
  // le relevé, pour qui veut relire : chaque ligne vue, sa seconde bulle ; chaque carton, son bloc
  fs.writeFileSync(path.join(out, `${cle}-releve.txt`), vues.l2.map(b => `[${b.ou}] ${b.premier || b.ligne}\n   ${l2} : ${b.vue ? b.texte : '— (aucune)'}`).concat(vues.cartons.map(c => `[carton ${c.cls}] ${c.titre}\n   ${l2} : ${c.vu ? c.parts.join(' | ') : '— (aucun)'}`))
    .concat(fils.map(f => f.nom ? `[le nom choisi] ${f.texte}` : `[fil] ${f.annonce}\n   ${l2} : ${f.texte}`)).join('\n') + '\n');
  vues.l2.forEach(b => { if (!b.vue) { note('ABSENT', `${cle} : réplique sans seconde bulle — « ${b.ligne || ''} » (${b.ou})`); return; }
    compte.bulles++; mini = Math.min(mini, b.mini); juger(l2, b, 'réplique « ' + (b.premier || '').slice(0, 36) + ' »', b.ou).forEach(([mot, m]) => note(mot, `${cle} · ${m}`)); });
  vues.cartons.filter(c => /\b(title|quote|attribut)\b/.test(c.cls) && !/parley|noos/.test(c.cls)).forEach(c => {   // un carton du récit : un titre (et sa date), une parole citée, un verset
    if (!c.vu) { note('ABSENT', `${cle} : carton sans langue secondaire — « ${c.titre} » (${c.ou})`); return; }
    compte.cartons++; mini = Math.min(mini, c.mini); juger(l2, c, 'carton « ' + c.titre.slice(0, 30) + ' »', c.ou).forEach(([mot, m]) => note(mot, `${cle} · ${m}`)); });
  if (!vues.cartons.some(c => /quote/.test(c.cls) && c.vu)) note('ABSENT', `${cle} : le carton d’une parole citée n’a pas été vu avec sa langue secondaire`);
  if (!vues.cartons.some(c => /attribut/.test(c.cls) && c.vu)) note('ABSENT', `${cle} : le carton d’un verset n’a pas été vu avec sa langue secondaire`);
  const log = await p.evaluate(() => (window.ISNAD.debug.log || []).filter(x => /TEXTE CACHÉ/.test(x)));
  log.forEach(x => note('TEXTE CACHÉ', `${cle} : ${x}`));
  const dansPartie = await p.evaluate(() => JSON.stringify(JSON.parse(window.ISNAD.save.exporter()).partie).indexOf('lang2') >= 0);   // un réglage de l'appareil : la partie exportée n'en sait rien
  if (dansPartie) note('ÉCART', `${cle} : la langue secondaire est entrée dans la partie exportée`);
  [...new Set(errors)].slice(0, 4).forEach(e => note('ÉCART', `${cle} : erreur console — ${e.slice(0, 200)}`));
  await ctx.close();
  return { cle, fini, compte, mini, soucis, duree: Math.round((Date.now() - t0) / 1000) };
}

// une fois : en français, sans langue secondaire, rien ne paraît ; puis on la choisit à la halte
async function sansElle(browser) {
  const [w, h] = [390, 844], ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent });
  const p = await ctx.newPage(), soucis = [], errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(url); await p.waitForTimeout(1500);
  await p.evaluate(() => { const I = window.ISNAD; I.audio.setOn(false); });
  let vus = 0, halte = false, apres = null;
  for (let i = 0; i < 400 && apres === null; i++) {
    const s = await p.evaluate(etat);
    if (s.quoi === 'dialogue') { const r = await p.evaluate(() => ({ d2: !document.querySelector('#dialog2').hidden, l2: !!document.querySelector('.l2:not(#dialog2)'), cls: document.body.classList.contains('avec2') }));
      if (!halte) { vus++; if (r.d2 || r.l2 || r.cls) soucis.push('ÉCART sans langue secondaire, une seconde bulle ou un bloc paraît (' + s.ou + ')'); }
      else { if (!s.ecrit) { await p.touchscreen.tap(s.pt[0], s.pt[1]); await p.waitForTimeout(200); } apres = await p.evaluate(bulle, PLANCHER); await p.screenshot({ path: path.join(out, 'halte-fr-ar-390x844.png') }); break; } }
    if (s.quoi === 'carton' && !halte) { const r = await p.evaluate(() => !!document.querySelector('#card .l2')); if (r) soucis.push('ÉCART sans langue secondaire, un carton porte un bloc'); }
    if (s.quoi === 'marche' && !halte && vus >= 4) {   // la main est libre : la halte, son réglage « Langue secondaire »
      await p.locator('#menubtn').tap(); await p.waitForTimeout(500);
      const b = p.locator('#menu .side button', { hasText: 'Langue secondaire' });
      if (!(await b.count())) { soucis.push('ABSENT à la halte, aucun réglage « Langue secondaire »'); break; }
      const avant = await b.first().textContent(); await b.first().tap(); await p.waitForTimeout(300); const ap = await b.first().textContent();
      const pane = await p.evaluate(() => document.querySelector('#menu .pane').textContent);
      const garde = await p.evaluate(() => JSON.parse(localStorage.getItem('isnad2.opts') || '{}').lang2 || '');
      if (!/aucune/.test(avant) || ap.indexOf('العربية') < 0 || garde !== 'ar') soucis.push(`ÉCART à la halte : « ${avant} » puis « ${ap} », gardé « ${garde} »`);
      if (!/pas une traduction mot à mot/.test(pane)) soucis.push('ABSENT à la halte, la page du réglage ne dit pas ce qu’est la langue secondaire');
      await p.screenshot({ path: path.join(out, 'halte-reglage-390x844.png') });
      await p.locator('#menu .side button').first().tap(); await p.waitForTimeout(600); halte = true; continue; }
    let pt = s.pt; if (s.quoi === 'attente' || !pt) { await p.waitForTimeout(220); continue; }
    if (s.quoi === 'choix' && s.rects) pt = s.rects[s.rects.length - 1];
    await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(s.quoi === 'marche' ? 850 : 430);
  }
  if (!halte) soucis.push('BLOQUÉ sans langue secondaire : la halte n’a pas été ouverte');
  else if (!apres || !apres.vue) soucis.push('ABSENT après le réglage à la halte, la réplique suivante n’a pas de seconde bulle');
  else juger('ar', apres, 'après la halte', '').forEach(([mot, m]) => soucis.push(mot + ' ' + m));
  // la langue du jeu devient la langue secondaire : les deux échangent leur place (ui.js, U.langue)
  const ech = await p.evaluate(() => { const U = window.ISNAD.ui, L = window.ISNAD.langue; U.langue2('ar'); U.langue('ar'); const a = [L.lang, L.l2()]; U.langue('fr'); return { a, b: [L.lang, L.l2()] }; });
  if (ech.a.join() !== 'ar,fr' || ech.b.join() !== 'fr,ar') soucis.push('ÉCART : prendre pour langue du jeu la langue secondaire ne les échange pas (' + JSON.stringify(ech) + ')');
  errors.slice(0, 3).forEach(e => soucis.push('ÉCART erreur console : ' + e.slice(0, 200)));
  await ctx.close();
  return { vus, soucis };
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const s0 = await sansElle(browser);
  console.log(s0.soucis.length ? s0.soucis.map(x => (anomalies++, x)).join('\n') : `OK  sans langue secondaire (fr, 390×844) : ${s0.vus} répliques, aucune seconde bulle, aucun bloc ; choisie à la halte (« العربية »), la réplique suivante porte la sienne ; prise pour langue du jeu, les deux langues échangent leur place`);
  const travaux = []; paires.forEach(([a, b]) => tailles.forEach(([w, h]) => travaux.push([a, b, w, h])));
  const res = []; let k = 0;
  await Promise.all(Array.from({ length: Math.min(PAR, travaux.length) }, async () => { while (k < travaux.length) { const t = travaux[k++]; const r = await partie(browser, ...t); res.push(r);
    const ok = r.fini && !r.soucis.length;
    console.log(`${ok ? 'OK ' : '✗  '} ${t[0]} + ${t[1]} · ${t[2]}×${t[3]} — prologue ${r.fini ? 'joué' : 'NON ACHEVÉ'} en ${r.duree} s : ${r.compte.bulles} répliques et narrations, ${r.compte.cartons} cartons, chacun avec sa langue secondaire${r.compte.fil ? `, ${r.compte.fil} ligne(s) de fil` : ''} ; plus petit texte ${r.mini.toFixed(1)} points`);
    r.soucis.forEach(m => { anomalies++; console.log('   ' + m); }); } }));
  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ BILINGUE CONFORME — ${res.length} prologues joués au doigt (${paires.length} couples × ${tailles.length} écrans), chaque réplique et chaque carton avec sa langue secondaire (captures dans .smoke/bilingue)`);
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
