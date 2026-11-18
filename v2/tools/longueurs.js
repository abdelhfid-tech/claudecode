#!/usr/bin/env node
/* ISNAD 2.x — le relevé des longueurs (D189, « un texte à la fois » ; v2/docs/propositions-texte.md, § 2.3 et 2.6).
   Un rapport, jamais un blocage : il dit ce qui serait à reprendre dans les textes de l'interface, et liste pour le
   décideur les textes des récits trop longs pour un téléphone — l'agent ne les raccourcit jamais (exigence 25).
   1. Les textes de l'interface qui passent par le fil (les annonces du moteur, les marques, les leçons, les consignes du
      labyrinthe), rendus dans le fil lui-même, dans les quatre langues, sur un téléphone de 390 points tenu en hauteur,
      texte « grand » : « À REPRENDRE » quand une annonce dépasse une ligne, ou qu'une leçon dépasse une phrase.
   2. Les deux menus — les manières de répondre à une idée noire, la liste d'un pourparler —, ouverts par le vrai récit
      (« Le Fort des Oliviers »), en 390 × 844 et en 360 × 560, dans les quatre langues : où finit la liste, combien de
      réponses se voient entières, s'il faut défiler (avec son repère). Le menu d'une idée noire en japonais, qui coupait
      sa troisième manière en 390 × 844 avant la 2.12, est un cas suivi.
   3. Les répliques et narrations des récits qui dépassent six lignes dans la boîte de dialogue en 390 × 844 : seulement
      listées.
   Usage : node v2/tools/longueurs.js [langue…]   → « LONGUEURS RELEVÉES » ; le détail dans .smoke/longueurs/longueurs.json */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium, devices } = require('playwright');
const V2 = path.join(__dirname, '..'), out = path.join(V2, '.smoke/longueurs'), URL = 'file://' + path.join(V2, 'index.html');
const LANGUES = process.argv.slice(2).filter(a => /^(fr|ar|en|ja)$/.test(a)); if (!LANGUES.length) LANGUES.push('fr', 'ar', 'en', 'ja');
fs.mkdirSync(out, { recursive: true });

/* ---------- les annonces et les marques du moteur, lues dans son code : chaque I.t('…') d'un S.toast(…) ou d'un S.marque(…) ---------- */
function annoncesDuCode() {
  const L = new Map(), lit = /\bI\.t\(\s*('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")/g;
  fs.readdirSync(path.join(V2, 'src/core')).filter(f => /\.js$/.test(f)).forEach(f => {
    const code = fs.readFileSync(path.join(V2, 'src/core', f), 'utf8'), ouvre = /\b(?:S|I\.script|script)\.(toast|marque)\(/g; let m;
    while ((m = ouvre.exec(code))) { let i = m.index + m[0].length, prof = 1, q = null;   // l'argument entier, jusqu'à la parenthèse qui le ferme
      for (; i < code.length && prof; i++) { const c = code[i]; if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; } if (c === "'" || c === '"' || c === '`') q = c; else if (c === '(') prof++; else if (c === ')') prof--; }
      const arg = code.slice(m.index + m[0].length, i - 1); let t; lit.lastIndex = 0;
      while ((t = lit.exec(arg))) { const fr = vm.runInNewContext(t[1]); if (/\p{L}/u.test(fr) && !L.has(fr)) L.set(fr, { ou: f, sorte: m[1] === 'marque' ? 'marque' : 'annonce' }); } }
  });
  return [...L].map(([fr, o]) => Object.assign({ fr }, o));
}

// côté page : mesurer un texte dans une boîte du jeu (ses lignes, au rendu), compter ses phrases
const PAGE = () => {
  // les lignes d'un texte posé en bloc dans sa boîte : sa hauteur, en hauteurs de ligne
  window.__lignes = el => { const d = el.style.display; if (getComputedStyle(el).display === 'inline') el.style.display = 'block'; const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.35, n = el.textContent.trim() ? Math.max(1, Math.round(el.getBoundingClientRect().height / lh)) : 0; el.style.display = d; return n; };
  window.__phrases = t => String(t).replace(/<[^>]+>/g, '').replace(/\*/g, '').split(/(?<=[.!?…。！？؟])\s*/).map(x => x.trim()).filter(x => /[\p{L}]/u.test(x)).length;
};

(async () => {
  const browser = await chromium.launch(), rapport = { annonces: {}, menus: {}, recits: {} }, ANN = annoncesDuCode(); let reprendre = 0;
  const ouvrir = async (l, vp) => { const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }); const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto(URL + (l === 'fr' ? '' : '?lang=' + l)); await p.waitForTimeout(2000); await p.evaluate(PAGE); p.__errs = errs; return p; };
  // le chapitre 3 de Khâlid, posé comme le fait loupe.js : l'IA de test un quart de seconde, puis on passe à la main ce qui
  // reste à lire, jusqu'à ce que le joueur ait la main dans le lieu (la mesure se fait dans la mise en page de l'exploration)
  const chapitre = async p => { await p.evaluate(() => { const I = window.ISNAD; I.audio.setOn(false); I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
      I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter('khalid', 2); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); });
    await p.waitForTimeout(1800);
    for (let i = 0; i < 160; i++) { const e = await p.evaluate(() => { const I = window.ISNAD, W = I.world, q = s => document.querySelector(s); if (W.excursion && !I.script.busy) I.rodeurs.finir('issue');
        return { libre: I.scene === W && !!W.map && !I.script.busy && !W.lock && !W.excursion && q('#choice').hidden && q('#dialog').hidden && q('#card').hidden, choix: !q('#choice').hidden, lire: !q('#dialog').hidden || !q('#card').hidden || I.battle.active }; });
      if (e.libre) break; if (e.choix) await p.evaluate(() => { const o = document.querySelectorAll('#choice .opt:not(.locked)'); if (o.length) o[o.length - 1].click(); }); else if (e.lire) await p.keyboard.press('Enter'); await p.waitForTimeout(180); }
    await p.evaluate(() => { window.ISNAD.script.filVide(); }); await p.waitForTimeout(500); };

  /* 1 et 3 — les textes de l'interface dans le fil ; les répliques et narrations dans la boîte de dialogue (390 × 844) */
  for (const l of LANGUES) {
    const p = await ouvrir(l, { width: 390, height: 844 }); await chapitre(p);
    const r = await p.evaluate(ANN => {
      const I = window.ISNAD, L = I.langue, D = I.D, $ = s => document.querySelector(s), C = I.sagas.coeur || {}, tactile = document.body.classList.contains('touch');
      const ex = { titre: (I.ui.codexEntry('khalid/pacte_damas') || {}).title || 'Damas', nom: I.sagas.khalid.heroes.khalid.name, piece: (D.GEAR[Object.keys(D.GEAR)[0]] || {}).name || '', img: '', n: 2, v: 2, gain: 1, route: D.MAPS.damas ? D.MAPS.damas.label : 'Damas', dons: '3', mise: 5, message: '…', emplacement: '', conf: 3, but: 4, signe: '', quete: '', poids: 2, provision: 3 };
      const textes = ANN.map(a => ({ fr: a.fr, sorte: a.sorte, ou: a.ou, html: (() => { const t = L.de(a.fr); return { ecrit: L.lang === 'fr' || t !== a.fr, t: I.t(a.fr, ex) }; })() }));
      // les leçons (coeur.js), au doigt ; la figure qui s'ouvre ; les consignes du labyrinthe
      Object.keys(C.lecons || {}).forEach(k => { const t = C.lecons[k], s = typeof t === 'string' ? t : (tactile ? t.doigt : t.clavier); if (s) textes.push({ fr: L.fr(s), sorte: 'leçon', ou: 'coeur.js lecons.' + k, html: { ecrit: true, t: I.fmt(s) } }); });
      if (C.postures && C.postures.ouverte) textes.push({ fr: L.fr(C.postures.ouverte), sorte: 'leçon', ou: 'coeur.js postures.ouverte', html: { ecrit: true, t: I.fmt(C.postures.ouverte.replace('%s', ex.nom)) } });
      const P = C.portes || {}; ['regle', 'rode', 'sonne', 'aLAbri', 'dissipee', 'face', 'pasDeHalte', 'sansSonge', 'deja'].forEach(k => { if (P[k]) textes.push({ fr: L.fr(P[k]), sorte: k === 'rode' ? 'leçon' : 'consigne', ou: 'coeur.js portes.' + k, html: { ecrit: true, t: I.esc(P[k].replace('%s', ex.nom)) } }); });
      // le fil lui-même : une ligne de mesure, posée dedans (le fil se tait : rien d'autre n'y parle pendant la mesure)
      const fil = $('#toasts'), m = I.el('div', 'toast'); fil.appendChild(m);
      const res = textes.map(x => { m.innerHTML = x.html.t; m.dir = L.sens(m.textContent); return { fr: x.fr, sorte: x.sorte, ou: x.ou, ecrit: x.html.ecrit, texte: m.textContent.trim(), signes: m.textContent.trim().length, lignes: window.__lignes(m), phrases: window.__phrases(x.html.t) }; });
      m.remove();
      const largeur = Math.round(fil.clientWidth), police = getComputedStyle(fil).fontSize;
      // les récits : chaque réplique et chaque narration, dans la boîte de dialogue
      const dlg = $('#dialog'), tx = $('#dialog .text'), longs = [], vus = new Set();
      dlg.hidden = false; dlg.className = 'say avecfig'; $('#dialog .seal').hidden = false; $('#dialog .fig').hidden = false;
      const mesure = (sorte, t, ou) => { if (!t || vus.has(sorte + t)) return; vus.add(sorte + t); dlg.className = sorte === 'narration' ? 'nar' : 'say avecfig'; tx.innerHTML = I.fmt(t); tx.dir = L.sens(t); const n = window.__lignes(tx); if (n > 6) longs.push({ sorte, ou, lignes: n, signes: t.length, debut: t.slice(0, 70) }); };
      Object.values(I.sagas).forEach(s => (s.chapters || []).forEach(ch => { const op = o => { if (o[0] === 'say') mesure('réplique', o[2], s.id + '/' + ch.id); else if (o[0] === 'nar') mesure('narration', o[1], s.id + '/' + ch.id); };
        D.parcours(ch.intro, op); D.parcours(ch.outro, op); (ch.objectives || []).forEach(x => D.parcours(x.then, op)); (ch.npcs || []).forEach(n => D.parcours(n.talk, op)); }));
      dlg.hidden = true; tx.innerHTML = ''; document.body.classList.remove('in-dialog');
      return { largeur, police, res, longs: longs.sort((a, b) => b.lignes - a.lignes) };
    }, ANN);
    rapport.annonces[l] = r;
    const faux = r.res.filter(x => (x.sorte === 'leçon' ? x.phrases > 1 : false) || (x.sorte !== 'leçon' && x.lignes > 1));
    console.log(`${l} · le fil, 390 × 844 (${r.largeur} points de texte, ${r.police}) : ${r.res.length} textes de l'interface — ${r.res.filter(x => x.lignes <= 1).length} sur une ligne, ${r.res.filter(x => x.lignes > 1).length} sur deux lignes ou plus${r.res.some(x => !x.ecrit) ? ` (${r.res.filter(x => !x.ecrit).length} encore en français)` : ''}`);
    faux.forEach(x => { reprendre++; console.log(`  À REPRENDRE ${l} · ${x.sorte} (${x.ou}) : ${x.sorte === 'leçon' && x.phrases > 1 ? x.phrases + ' phrases' : ''}${x.sorte === 'leçon' && x.phrases > 1 && x.lignes > 1 ? ', ' : ''}${x.lignes > 1 ? x.lignes + ' lignes' : ''} — « ${x.texte.slice(0, 90)}${x.texte.length > 90 ? '…' : ''} »`); });
    console.log(`  récits : ${r.longs.length} réplique(s) ou narration(s) de plus de six lignes dans la boîte de dialogue — à signaler au décideur, jamais raccourcies${r.longs.length ? ' ; la plus longue : ' + r.longs[0].lignes + ' lignes (' + r.longs[0].ou + ', « ' + r.longs[0].debut + '… »)' : ''}`);
    if (p.__errs.length) console.log('  erreurs : ' + [...new Set(p.__errs)].slice(0, 3).join(' | '));
    await p.context().close();
  }

  /* 2 — les deux menus, ouverts par le vrai récit */
  for (const [nom, vp] of [['390x844', { width: 390, height: 844 }], ['360x560', { width: 360, height: 560 }]]) for (const l of LANGUES) {
    const p = await ouvrir(l, vp); await chapitre(p);
    await p.evaluate(() => { const I = window.ISNAD, D = I.D; let op = null; I.sagas.khalid.chapters.forEach(ch => (ch.objectives || []).forEach(x => D.parcours(x.then, o => { if (o[0] === 'parley' && !op && (o[1].rounds || []).some(r => r.noir)) op = o; }))); I.script.flags._prayed = false; I.script.run([op]); });
    const vu = {};
    for (let i = 0; i < 200 && !(vu.noir && vu.liste); i++) {
      const e = await p.evaluate(() => { const q = s => document.querySelector(s), c = q('#choice'), d = q('#dialog'), k = q('#card');
        return { carton: !k.hidden && k.classList.contains('on'), dialogue: !d.hidden && q('#dialog .next').style.visibility === 'visible', choix: !c.hidden && !!c.querySelector('.opt') ? (c.querySelector('.seal.idee') ? 'noir' : 'liste') : '' }; });
      if (e.choix && !vu[e.choix]) { await p.waitForTimeout(500);
        // une réponse compte entière quand son texte finit au-dessus du repère (ou du bas de la boîte)
        vu[e.choix] = await p.evaluate(() => { const box = document.querySelector('#choice'), r = box.getBoundingClientRect(), bas = Math.min(r.bottom, innerHeight), opts = [...box.querySelectorAll('.opt')], rep = box.querySelector('.repere');
          return { monde: window.ISNAD.scene === window.ISNAD.world, haut: Math.round(r.top), bas: Math.round(r.bottom), libre: Math.round(innerHeight - r.bottom), defile: box.scrollHeight - box.clientHeight, police: box.style.fontSize || '1em', reponses: opts.length,
            entieres: opts.filter(o => { const g = document.createRange(); g.selectNodeContents(o); const q = g.getBoundingClientRect(); return q.top >= r.top - 1 && q.bottom <= (rep && !rep.classList.contains('fin') ? Math.min(bas, rep.getBoundingClientRect().top) : bas) + 2; }).length, repere: rep && !rep.classList.contains('fin') ? rep.textContent : '' }; });
        await p.screenshot({ path: path.join(out, `${nom}-${l}-${e.choix}.png`) }); }
      if (e.carton || e.dialogue) await p.keyboard.press('Enter'); else if (e.choix) await p.keyboard.press('Enter');
      await p.waitForTimeout(e.choix ? 450 : 220);
    }
    (rapport.menus[nom] = rapport.menus[nom] || {})[l] = vu;
    const dit = (quoi, m) => !m ? `${quoi} : non atteint` : `${quoi} : ${m.entieres}/${m.reponses} réponses entières, ${m.defile > 2 ? `la liste défile (${m.repere || 'repère absent'})` : `tient, ${m.libre} points libres dessous`}${m.police !== '1em' ? `, resserrée à ${m.police}` : ''}${m.monde ? '' : ' (mesure hors du lieu : à refaire)'}`;
    console.log(`${nom} ${l} · ${dit('idée noire', vu.noir)} · ${dit('pourparler', vu.liste)}`);
    if (nom === '390x844' && vu.noir && vu.noir.defile > 2 && !vu.noir.repere) { reprendre++; console.log(`  À REPRENDRE ${l} · le menu d'une idée noire déborde en 390 × 844 sans son repère`); }
    if (nom === '390x844' && l === 'ja') console.log(`  cas suivi — le menu d'une idée noire en japonais, 390 × 844 : ${vu.noir ? (vu.noir.defile > 2 ? 'il défile, avec son repère' : `il tient, ${vu.noir.libre} points libres dessous`) : 'non atteint'} (avant la 2.12, sa troisième manière était coupée)`);
    await p.context().close();
  }
  fs.writeFileSync(path.join(out, 'longueurs.json'), JSON.stringify(rapport, null, 1));
  await browser.close();
  console.log(`✓ LONGUEURS RELEVÉES — ${reprendre} point(s) à reprendre, sans blocage (détail : ${path.relative(path.join(V2, '..'), path.join(out, 'longueurs.json'))})`);
})().catch(e => { console.error(e); process.exit(1); });
