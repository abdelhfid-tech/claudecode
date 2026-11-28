#!/usr/bin/env node
/* ISNAD 2.x — la progression : un besoin, un outil, puis sans aide ; et les trois figures (les « postures » du code).
   A. Une partie neuve, par les vrais boutons (« Nouvelle partie ») : au premier écran, une seule leçon, et elle ne parle
      que de marcher ; « parler » ne vient qu'au moment de parler ; jamais deux leçons dans la même séquence ; le premier
      combat ne montre que Frapper et les Vertus, où n'est qu'Éclairer (2.19) ; les vertus de chacun, puis « se protéger »
      (la Garde, l'Esquive, et Fuir là où l'on peut fuir) et la Niyya, puis la besace viennent une à une, de combat en
      combat, une fois la précédente réemployée ; « Fuir » ne paraît qu'avec son outil, et seulement d'un combat de
      rencontre ; devant une idole, rien ne manque (sauf Fuir, qui n'y est jamais) ; la halte ne montre une page que
      lorsque son système a été rencontré ; la partie exportée garde ce qui a été appris.
   B. Une partie d'avant (sans `lecons`) : tout est là d'emblée, comme toujours.
   D. (2.23) Les quartiers de la Cité : l'outil « cite », dit par Maître Yûnus à la première arrivée, une seule fois.
   C. Les postures : chacun a d'abord celle de son tempérament ; une autre s'ouvre au niveau 4 (la leçon se dit ce
      jour-là, la page paraît) ; on en change par les boutons de la halte ; leurs effets se lisent dans le combat ; la
      partie les garde, et refuse une posture inconnue.
   Usage : node tools/progression.js [dossier de captures]      « PROGRESSION CONFORME », sinon « ÉCART » / « BLOQUÉ » */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const out = process.argv[2] || path.join(__dirname, '../.smoke/progression');
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.join(__dirname, '../index.html');
let anomalies = 0; const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); }, si = (c, bien, mal) => c ? ok(bien) : ko('ÉCART ' + (mal || bien));

(async () => {
  const browser = await chromium.launch(), errors = [];
  const ouvrir = async () => { const p = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
    p.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n'))); p.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForTimeout(1700);
    await p.evaluate(() => { const I = window.ISNAD; I.audio.setOn(false); window.__dits = []; // tout ce que le jeu dit en marge de l'écran, dans l'ordre
      new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) window.__dits.push({ t: (n.textContent || '').trim(), seq: (I.save.data.lecons || {}).seq, lecons: I.lecons ? I.lecons.journal.length : 0 }); }))).observe(document.querySelector('#toasts'), { childList: true }); });
    return p; };
  const outils = p => ({
    visible: sel => p.evaluate(s => { const e = document.querySelector(s); return !!e && !e.hidden; }, sel),
    entree: async () => { if (await p.evaluate(() => ['#card', '#dialog'].some(q => { const e = document.querySelector(q); return e && !e.hidden; }) || (() => { const b = document.querySelector('#battle .banner'); return window.ISNAD.battle.active && b && !b.hidden; })())) await p.keyboard.press('Enter'); },
    main: () => p.evaluate(() => { const I = window.ISNAD, W = I.world; return I.scene === W && !!W.map && !I.script.busy && !W.lock && !I.battle.active && document.querySelector('#choice').hidden; }),
    etat: () => p.evaluate(() => { const I = window.ISNAD, W = I.world, d = I.save.data.lecons || null, o = W.cur && W.cur(); return { obj: W.objIndex, sorte: o ? (o.goto ? 'goto' : o.talk ? 'talk' : o.foe ? 'foe' : 'autre') : null, lecons: d ? JSON.parse(JSON.stringify(d)) : null, journal: I.lecons.journal.slice() }; }),
  });

  /* ---------- A. une partie neuve ---------- */
  {
    const p = await ouvrir(), T = outils(p);
    const cap = n => p.screenshot({ path: path.join(out, n + '.png') });
    const calme = async (n = 80) => { for (let i = 0; i < n && !(await T.main()); i++) { await T.entree(); if (await T.visible('#choice')) break; await p.waitForTimeout(160); } await p.waitForTimeout(250); };
    await p.evaluate(() => { [...document.querySelectorAll('#title .vmenu button')].find(b => /^Nouvelle partie/.test(b.textContent)).click(); }); await p.waitForTimeout(700);
    await p.evaluate(() => { const b = document.querySelector('#perso .ok'); if (b) b.click(); }); await p.waitForTimeout(1200);
    await calme();
    const e0 = await T.etat(), d0 = await p.evaluate(() => window.__dits.map(x => x.t));
    await cap('A-1-premier-ecran');
    si(e0.lecons && e0.journal.length === 1 && e0.journal[0].id === 'marcher' && d0.length === 1 && /marcher|t’y rendre/.test(d0[0]) && !/parler|halte|que faire|Échap/i.test(d0[0]),
      `le premier écran : une seule leçon, « ${d0[0]} » — ni parler, ni halte, ni « que faire »`, `le premier écran : ${JSON.stringify({ lecons: !!e0.lecons, journal: e0.journal, dits: d0 })}`);
    // 2.47 (D238) : quatre lieux à atteindre (le grand écran, les quartiers, la ruelle, la vieille mosquée) : le premier avec la leçon, les autres sans aide
    const atteindre = async () => { const avant = (await T.etat()).obj; await p.evaluate(() => { const W = window.ISNAD.world, o = W.cur(), s = W.spotPx(o.goto); W.player.x = s[0]; W.player.y = s[1] + 4; W.dest = null; });
      for (let i = 0; i < 60 && (await T.etat()).obj === avant; i++) { await T.entree(); await p.waitForTimeout(150); } await calme(); };
    await atteindre(); await atteindre(); await atteindre(); await atteindre();
    const e1 = await T.etat();
    si(e1.obj === 4 && e1.lecons.re.marcher >= 1 && e1.journal.filter(j => j.id === 'marcher').length === 1, `marcher a resservi sans aide (${e1.lecons.re.marcher} fois) avant qu'un autre outil ne soit donné`, `après quatre lieux atteints : ${JSON.stringify(e1)}`);
    si(e1.sorte === 'talk' && e1.journal.some(j => j.id === 'parler') && e1.journal.find(j => j.id === 'parler').seq > e1.journal[0].seq, `« parler » ne vient qu'au moment de parler (séquence ${e1.journal.find(j => j.id === 'parler') ? e1.journal.find(j => j.id === 'parler').seq : '?'}), à part de « marcher » (séquence ${e1.journal[0].seq})`, `parler : ${JSON.stringify(e1.journal)}`);
    // parler à Maître Yûnus : le récit mène au premier combat
    await p.evaluate(() => { const I = window.ISNAD, W = I.world, n = W.npcs.find(q => q.id === W.cur().talk); W.player.x = n.x - 16; W.player.y = n.y; W.player.dir = 2; W.dest = null; }); await p.waitForTimeout(250); await p.keyboard.press('Enter');
    for (let i = 0; i < 120 && !(await p.evaluate(() => !!document.querySelector('#battle .cmd .mlist.main .mi'))); i++) { await T.entree(); await p.waitForTimeout(170); }
    const lire = () => p.evaluate(() => ({ commandes: [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].filter(b => !b.hidden && getComputedStyle(b).display !== 'none').map(b => b.querySelector('span').textContent.replace(/^[^A-Za-zÀ-ÿ]+/, '').trim()), niyya: document.querySelectorAll('#battle .cmd .nb').length, recus: Object.keys((window.ISNAD.save.data.lecons || {}).recus || {}) }));
    // 2.19 : la liste des Vertus, ouverte puis refermée par « Retour » (rien n'est dépensé)
    const vertus = async () => { await p.waitForTimeout(300); const L = await p.evaluate(async () => { const b = [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].find(x => !x.hidden && /Vertus/.test(x.textContent)); if (!b) return null; b.click(); await new Promise(r => setTimeout(r, 300));
      const L = [...document.querySelectorAll('#battle .cmd .mlist .mi')].map(x => x.querySelector('span').textContent.replace(/^[^A-Za-zÀ-ÿ]+/, '').trim()); const bk = document.querySelector('#battle .cmd .mback'); if (bk) bk.click(); await new Promise(r => setTimeout(r, 300)); return L; }); await p.waitForTimeout(300); return L; };
    const c1 = await lire(); await cap('A-2-premier-combat'); const v1 = await vertus();
    si(c1.commandes.join(',') === 'Frapper,Vertus' && c1.niyya === 0 && v1 && v1.join(',') === 'Éclairer', 'le premier combat : deux commandes, Frapper et les Vertus, où n’est qu’Éclairer ; ni vertu d’un compagnon, ni Garde, ni Esquive, ni besace, ni Niyya', `le premier combat : ${JSON.stringify(c1)} · Vertus ${JSON.stringify(v1)}`);
    // mener un combat par ses boutons : la commande voulue si elle est offerte, sinon Éclairer (2.19 : dans les Vertus ; « Vertus »
    // voulue : une vertu d'un compagnon, non Éclairer)
    const combat = async (voulue, tours) => { let n = 0, vus = null, banniere = ''; await p.evaluate(() => { window.__veut = null; });
      for (let i = 0; i < 400 && await p.evaluate(() => window.ISNAD.battle.active); i++) {
        const s = await p.evaluate(() => { const q = x => document.querySelector(x), b = q('#battle .banner'), c = q('#battle .cmd'); return { ban: b && !b.hidden ? b.textContent : '', cible: !!(c && c.querySelector('.mhint')), principal: !!(c && c.querySelector('.mlist.main')), sous: !!(c && c.querySelector('.mback') && !c.querySelector('.mhint') && !c.querySelector('.mlist.main')), carte: !q('#card').hidden }; });
        if (s.ban && /Nouveau/.test(s.ban)) banniere = s.ban;
        // 2.12 (D189) : la leçon d'une commande nouvelle n'est plus un bandeau qui attend ; le bandeau d'ouverture (qui
        // n'attend pas) peut encore être là quand les commandes s'ouvrent : on ne valide pas alors à l'aveugle, on touche
        if (s.carte || (s.ban && !s.principal && !s.cible && !s.sous)) { await p.keyboard.press('Enter'); await p.waitForTimeout(200); continue; }
        if (s.cible) { await p.keyboard.press('Enter'); await p.waitForTimeout(350); continue; }
        if (s.sous) { await p.evaluate(() => { const L = [...document.querySelectorAll('#battle .cmd .mlist .mi')].filter(x => !x.classList.contains('off')), ecl = x => /Éclairer/.test(x.textContent);
          const b = window.__veut === 'Vertus' ? L.find(x => !ecl(x)) || L[0] : L.find(ecl) || L[0]; if (b) b.click(); else document.querySelector('#battle .cmd .mback').click(); }); await p.waitForTimeout(350); continue; }
        if (s.principal) { if (!vus) vus = await lire(); await p.waitForTimeout(280);
          await p.evaluate(([v, n, t]) => { const L = [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].filter(b => !b.hidden && getComputedStyle(b).display !== 'none'), nom = b => b.querySelector('span').textContent; const b0 = n < t && L.find(x => nom(x).indexOf(v) >= 0), b = b0 || L.find(x => nom(x).indexOf('Vertus') >= 0); window.__veut = b0 ? v : 'Éclairer'; b.click(); }, [voulue, n, tours || 2]); n++; await p.waitForTimeout(350); continue; }
        await p.waitForTimeout(200);
      }
      // la suite d'une victoire : un carton, parfois une pièce trouvée que l'on propose de porter — jusqu'à ce que le combat ait tout à fait rendu la main
      for (let i = 0; i < 200 && await p.evaluate(() => window.__fin === false); i++) { if (await T.visible('#choice')) await p.evaluate(() => { const o = [...document.querySelectorAll('#choice .opt:not(.locked)')]; if (o.length) o[o.length - 1].click(); }); else await T.entree(); await p.waitForTimeout(160); }
      for (let i = 0; i < 40 && !(await T.main()); i++) { await T.entree(); if (await T.visible('#choice')) break; await p.waitForTimeout(160); }
      return { vus, banniere, tours: n }; };
    await combat('Frapper', 1); // Frapper une fois, puis Éclairer : l'outil ressert sans aide dès ce combat, quel que soit le hasard des coups
    // la suite du prologue : une question à Maître Yûnus, puis la Chaîne
    for (let i = 0; i < 200 && !(await T.visible('#chain')); i++) {
      if (await T.visible('#choice')) { await p.evaluate(() => { const o = [...document.querySelectorAll('#choice .opt:not(.locked)')]; o[o.length - 1].click(); }); await p.waitForTimeout(300); continue; }
      if (await T.main()) { const e = await T.etat(); if (e.sorte === 'goto') await atteindre(); else if (e.sorte === 'talk') { await p.evaluate(() => { const I = window.ISNAD, W = I.world, n = W.npcs.find(q => q.id === W.cur().talk); W.player.x = n.x - 16; W.player.y = n.y; W.player.dir = 2; }); await p.keyboard.press('Enter'); } }
      await T.entree(); await p.waitForTimeout(170);
    }
    // (2.49, D242 : un outil `libre` — une activité des quartiers, les virages de Sâlim — n'occupe pas la séquence)
    const e2 = await T.etat(), seqs = e2.journal.filter(j => !j.libre).map(j => j.seq), uniques = new Set(seqs).size === seqs.length;
    si(await T.visible('#chain'), 'le prologue se joue jusqu’à la Chaîne dans ce mode', 'BLOQUÉ le prologue ne mène pas à la Chaîne en mode d’apprentissage : ' + JSON.stringify(e2));
    { const r = await p.evaluate(() => ({ annonces: window.__dits.filter(x => /^Recueil/.test(x.t)).length, feuillets: window.ISNAD.save.data.codex.filter(k => /^idris\//.test(k)).length }));
      si(r.annonces === 0 && r.feuillets >= 5, `pendant le prologue, ${r.feuillets} feuillets sont entrés au Recueil sans une annonce : « retrouver une source » ne s'enseigne pas encore`, `les annonces du Recueil pendant le prologue : ${JSON.stringify(r)}`); }
    si(uniques && e2.journal.length >= 3 && e2.journal.filter(j => !j.libre).map(j => j.id).slice(0, 3).join(',') === 'marcher,parler,frapper', `le prologue : ${e2.journal.length} outils reçus (${e2.journal.map(j => j.id + '@' + j.seq).join(', ')}), jamais deux dans la même séquence`, `le journal des leçons : ${JSON.stringify(e2.journal)}`);
    // 2.49 (D242 ; le décideur : « Toujours jouables ») : un outil libre (la borne des quartiers) se donne au premier besoin,
    // une fois, même dans la séquence où un autre vient d'être donné — sans devenir le dernier reçu ni occuper la séquence :
    // ce qu'attendent les outils des récits n'en change pas (la partie est rendue telle quelle ensuite)
    { const r = await p.evaluate(() => { const I = window.ISNAD, L = I.lecons, d = I.save.data.lecons, avant = JSON.stringify(d), nj = L.journal.length;
        const pret0 = L.pret(), pret1 = L.pret(1), dernier = d.dernier, donne = d.donne; let dit = 0;
        const donne1 = L.proposer('borne', () => { dit++; });
        const r = { donne1, recu: d.recus.borne === d.seq, libre: (L.journal[nj] || {}).libre === true, dernier: d.dernier === dernier, donne: d.donne === donne, pret: L.pret() === pret0 && L.pret(1) === pret1, unefois: L.proposer('borne', () => { dit++; }) === false && dit === 1, regle: L.libre('borne') && !L.libre('source') && !L.libre('frapper') };
        I.save.data.lecons = JSON.parse(avant); L.journal.length = nj; return r; });
      si(Object.values(r).every(v => v === true), `un outil libre (la borne des quartiers) se donne au premier besoin, une seule fois, sans devenir le dernier reçu ni occuper la séquence ; les outils des récits ne sont pas libres`, `l'outil libre : ${JSON.stringify(r)}`); }
    // la halte, au sortir du prologue : seulement ce que l'on a rencontré
    const avantRecit = (await T.etat()).journal.length;
    await p.evaluate(() => { document.querySelector('#chain .links .link').click(); }); await p.waitForTimeout(900); await calme(120);
    const e2b = await T.etat(), neufs = e2b.journal.slice(avantRecit).map(j => j.id), ditsRecit = await p.evaluate(() => window.__dits.map(x => x.t).slice(-3));
    si(neufs.join() === 'halte' && ditsRecit.some(t => /halte/i.test(t)), `le premier récit s'ouvre : un outil, la halte (« ${ditsRecit.find(t => /halte/i.test(t)) || ''} »)`, `à l'ouverture du premier récit : ${JSON.stringify({ neufs, ditsRecit })}`);
    const pages = await p.evaluate(() => { window.ISNAD.ui.pause(); const L = [...document.querySelectorAll('#menu .side button')].map(b => b.textContent.trim()); return L; }); await cap('A-3-halte'); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    const absentes = ['Équipement', 'Œuvres et lames', 'Compagnons de lumière', 'Les degrés du mal', 'Valeurs et attributs', 'Figures'].filter(n => !pages.includes(n)), la = ['Reprendre', 'Compagnons', 'Besace', 'Recueil', 'Aide du jeu'].filter(n => pages.includes(n));
    si(la.length === 5 && absentes.length >= 4, `la halte, au début du premier récit : le groupe, la besace, le Recueil, l'aide ; pas encore ${absentes.join(', ')}`, `la halte : ${JSON.stringify(pages)}`);
    // l'aide du jeu : chaque page a son titre et son texte (une virgule oubliée entre deux pages en efface deux sans bruit)
    const aide = await p.evaluate(() => { const I = window.ISNAD, A = I.ui.AIDE || []; return { n: A.length, titres: A.map(a => Array.isArray(a) && typeof a[0] === 'string' && typeof a[1] === 'string' && a[1].length > 20 ? I.t(a[0]) : null) }; });
    si(aide.n >= 20 && aide.titres.every(Boolean), `l'aide du jeu : ${aide.n} pages, chacune avec son titre et son texte`, `l'aide du jeu : ${aide.titres.filter(t => !t).length} page(s) sans titre ou sans texte sur ${aide.n} — ${JSON.stringify(aide.titres.slice(-4))}`);
    // de combat en combat : les Vertus, puis la Garde et la Niyya, puis la besace — une à la fois, la précédente ayant resservi
    const petit = await p.evaluate(() => { const W = window.ISNAD.world, E = W.saga.enemies; W.foes.forEach(f => { f.done = true; }); /* les égrégores de la carte sont écartés : seuls comptent les combats que l'outil lance */ return Object.keys(E).find(k => E[k].tier === 'minion' && !E[k].racine); });
    // (2.12 : en attendant les commandes, on ne valide que les cartons et les répliques — le bandeau d'ouverture passe de lui-même,
    // et un « Entrée » tombé au moment où les commandes s'ouvrent choisirait « Frapper » à la place du joueur)
    // (lancé comme un combat de rencontre : « Fuir » y est permis, une fois son outil reçu)
    const lance = async groupe => { await p.evaluate(g => { const I = window.ISNAD, S = I.script; I.world.healAll(); window.__fin = false; S.depth++; I.battle.start({ group: g, bg: 'ville', fuite: true }).then(() => { S.depth--; window.__fin = true; }); }, groupe); for (let i = 0; i < 80 && !(await p.evaluate(() => !!document.querySelector('#battle .cmd .mlist.main .mi'))); i++) { if (await T.visible('#card') || await T.visible('#dialog')) await p.keyboard.press('Enter'); await p.waitForTimeout(170); } };
    const suite = [];
    for (const voulue of ['Vertus', 'Garde', 'Objets', 'Éclairer']) {
      const avant = (await T.etat()).journal.length; await lance([petit, petit]); // deux petits égrégores : le temps de se servir deux fois de la commande nouvelle
      const vus = await lire(), vv = await vertus(), r = await combat(voulue, 2), apres = await T.etat();
      suite.push({ voulue, vus: vus.commandes.join(','), vertus: (vv || []).join(','), niyya: vus.niyya, recu: apres.journal.slice(avant).map(j => j.id).join(','), re: Object.assign({}, apres.lecons.re) });
      if (voulue === 'Vertus') await cap('A-4-vertus');
    }
    // (2.19) : la commande « Vertus » est là dès le premier combat ; ce qui vient avec l'outil « vertus », ce sont les vertus de
    // chacun, à côté d'Éclairer ; « se protéger » donne ensemble la Garde, l'Esquive et — dans un combat de rencontre — Fuir
    const s = suite, bon = s[0].vertus.split(',').length > 1 && /^Éclairer,/.test(s[0].vertus) && !/Garde|Esquive|Fuir|Objets/.test(s[0].vus) && s[0].niyya === 0
      && ['Garde', 'Esquive', 'Fuir'].every(k => s[1].vus.split(',').includes(k)) && s[1].niyya === 2 && !/Objets/.test(s[1].vus) && /Objets/.test(s[2].vus)
      && ['Frapper', 'Vertus', 'Objets', 'Garde', 'Esquive', 'Fuir'].every(k => s[3].vus.split(',').includes(k)) && !s.some(x => /Éclairer/.test(x.vus)) && s.map(x => x.recu).join() === 'vertus,garde,objets,';
    si(bon, `de combat en combat, une commande à la fois : ${s.map(x => '[' + x.vus + ' · Vertus : ' + x.vertus + ']').join(' → ')}`, `les commandes reçues : ${JSON.stringify(s)}`);
    const e3 = await T.etat(), seq3 = e3.journal.map(j => j.seq);
    si(new Set(seq3).size === seq3.length && ['frapper', 'vertus', 'garde', 'objets'].every(k => (e3.lecons.re[k] | 0) >= 1), `chaque commande a resservi sans aide avant la suivante (${['frapper', 'vertus', 'garde', 'objets'].map(k => k + ' ×' + (e3.lecons.re[k] | 0)).join(', ')}) ; ${e3.journal.length} leçons, toutes dans des séquences différentes`, `réemplois : ${JSON.stringify(e3.lecons)} ${JSON.stringify(e3.journal)}`);
    // la partie voyage avec ce qui a été appris
    const v = await p.evaluate(() => { const I = window.ISNAD, avant = JSON.stringify(I.save.data.lecons), t = I.save.exporter(), r = I.save.lireTexte(t); return { ok: r.ok, meme: r.ok && JSON.stringify(r.partie.lecons) === avant }; });
    si(v.ok && v.meme, 'la partie exportée garde ce qui a été appris', `l'export : ${JSON.stringify(v)}`);
    await p.context().close();
  }
  /* une partie neuve, devant une idole dès son deuxième combat : rien ne lui manque */
  {
    const p = await ouvrir(), T = outils(p);
    await p.evaluate(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; I.lecons.ouvrir(); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
      I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter('abubakr', 0); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); }); await p.waitForTimeout(1800);
    for (let i = 0; i < 60 && !(await T.main()); i++) { await T.entree(); await p.waitForTimeout(160); }
    await p.evaluate(() => { const I = window.ISNAD; I.lecons.recevoir('frapper'); const S = I.world.saga, id = Object.keys(S.enemies).find(k => S.enemies[k].tier === 'boss' || S.enemies[k].racine); window.__idole = id; I.battle.start({ group: [id], bg: 'ville', boss: true }); });
    // la page de préparation (« Déclarer la bataille »), puis les bandeaux d'ouverture d'une bataille déclarée : on laisse le temps qu'il faut
    for (let i = 0; i < 400 && !(await p.evaluate(() => !!document.querySelector('#battle .cmd .mlist.main .mi'))); i++) { await p.evaluate(() => { const b = [...document.querySelectorAll('#menu .side button')].find(x => /Déclarer/.test(x.textContent)); if (b && !document.querySelector('#menu').hidden) b.click(); }); await T.entree(); await p.waitForTimeout(170); }
    if (!(await p.evaluate(() => !!document.querySelector('#battle .cmd .mlist.main .mi')))) await p.screenshot({ path: path.join(out, 'A-idole-bloque.png') });
    const c = await p.evaluate(() => ({ commandes: [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].filter(b => !b.hidden && getComputedStyle(b).display !== 'none').map(b => b.querySelector('span').textContent.replace(/^[^A-Za-zÀ-ÿ]+/, '').trim()), niyya: document.querySelectorAll('#battle .cmd .nb').length, idole: window.__idole }));
    si(['Frapper', 'Vertus', 'Objets', 'Garde', 'Esquive'].every(k => c.commandes.includes(k)) && !c.commandes.includes('Fuir') && c.niyya === 2, `devant une idole (${c.idole}), rien ne manque au groupe, même en tout début de partie : ${c.commandes.join(', ')} (et l'on ne fuit pas une idole)`, `devant une idole : ${JSON.stringify(c)}`);
    await p.context().close();
  }

  /* ---------- B. une partie d'avant : tout est là ---------- */
  {
    const p = await ouvrir(), T = outils(p);
    await p.evaluate(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
      I.world.roster = {}; I.world.saga = null; I.world.startChapter('idris', 0); }); await p.waitForTimeout(1500);
    for (let i = 0; i < 60 && !(await T.main()); i++) { await T.entree(); await p.waitForTimeout(160); }
    const d = await p.evaluate(() => ({ dits: window.__dits.map(x => x.t), lecons: window.ISNAD.save.data.lecons || null }));
    const pages = await p.evaluate(() => { window.ISNAD.ui.pause(); const L = [...document.querySelectorAll('#menu .side button')].map(b => b.textContent.trim()); return L; }); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    await p.evaluate(() => { window.ISNAD.battle.start({ group: ['notif'], bg: 'cite' }); });
    for (let i = 0; i < 80 && !(await p.evaluate(() => !!document.querySelector('#battle .cmd .mlist.main .mi'))); i++) { await T.entree(); await p.waitForTimeout(170); }
    const c = await p.evaluate(() => ({ commandes: [...document.querySelectorAll('#battle .cmd .mlist.main .mi')].filter(b => !b.hidden && getComputedStyle(b).display !== 'none').length, niyya: document.querySelectorAll('#battle .cmd .nb').length }));
    si(!d.lecons && d.dits.some(t => /parler/.test(t) && /halte/i.test(t)) && ['Équipement', 'Œuvres et lames', 'Les degrés du mal', 'Valeurs et attributs', 'Piliers'].every(n => pages.includes(n)) && c.commandes === 5 && c.niyya === 2,
      'une partie d’avant (sans `lecons`) : la ligne d’accueil de toujours, toutes les pages de la halte, les cinq commandes et la Niyya', `une partie d'avant : ${JSON.stringify({ d, pages, c })}`);
    await p.context().close();
  }

  /* ---------- C. les postures ---------- */
  {
    const p = await ouvrir(), T = outils(p);
    const debut = async (saga, ci) => { await p.evaluate(([s, c]) => { const I = window.ISNAD; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset();
        I.debug.auto = true; I.speed = 30; I.world.roster = {}; I.world.saga = null; I.world.startChapter(s, c); setTimeout(() => { I.debug.auto = false; I.speed = 1; }, 250); }, [saga, ci]); await p.waitForTimeout(1800);
      for (let i = 0; i < 60 && !(await T.main()); i++) { await T.entree(); await p.waitForTimeout(160); } await p.waitForTimeout(300); };
    await p.evaluate(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; });
    await debut('khalid', 0);
    const a = await p.evaluate(() => { const I = window.ISNAD, W = I.world, Po = I.postures, h = W.hero('khalid'); I.ui.pause(); const pages = [...document.querySelectorAll('#menu .side button')].map(b => b.textContent.trim()); I.input.emit('cancel');
      return { niveau: h.lvl, temperament: Po.temperament(h), ouvertes: Po.ouvertes(h), prise: Po.de(h), offertes: Po.offertes(), page: pages.includes('Figures'), su: I.save.data.codex.includes('coeur/postures') }; });
    si(a.niveau < 4 && a.temperament === 'heros' && a.ouvertes.join() === 'heros' && a.prise === 'heros' && !a.offertes && !a.page && !a.su, `au niveau ${a.niveau}, Khâlid (un guerrier) n'a que la posture de son tempérament — le héros ; rien à choisir, pas de page, pas de leçon`, `avant le niveau 4 : ${JSON.stringify(a)}`);
    await p.waitForTimeout(300); await debut('khalid', 1);
    const b = await p.evaluate(() => { const I = window.ISNAD, W = I.world, Po = I.postures; return { groupe: W.party.map(id => { const h = W.hero(id); return h.def.name + ' niv. ' + h.lvl + ' (' + h.def.role + ') : ' + Po.ouvertes(h).join('/'); }), offertes: Po.offertes(), su: I.save.data.codex.includes('coeur/postures'), dit: window.__dits.map(x => x.t).filter(t => /autre figure/i.test(t)) }; });
    si(b.offertes && b.su && b.dit.length === 1, `au niveau 4, une autre posture s'ouvre : la leçon se dit une fois (« ${b.dit[0] || ''} ») — ${b.groupe.join(' ; ')}`, `au niveau 4 : ${JSON.stringify(b)}`);
    // la halte : la page paraît, et l'on change de posture par ses boutons
    const c = await p.evaluate(() => { const I = window.ISNAD; I.ui.pause(); const B = [...document.querySelectorAll('#menu .side button')], x = B.find(q => q.textContent.trim() === 'Figures'); if (!x) return { page: false }; x.click();
      const L = [...document.querySelectorAll('#menu .side button')].map(q => q.textContent.trim()); const s = [...document.querySelectorAll('#menu .side button')].find(q => /Khâlid/.test(q.textContent) && /sage/.test(q.textContent)); if (s) s.click();
      const L2 = [...document.querySelectorAll('#menu .side button')].map(q => q.textContent.trim()), pane = document.querySelector('#menu .pane').innerText; return { page: true, choix: L, apres: L2, pane: pane.replace(/\s+/g, ' ').slice(-260), prise: I.postures.de(I.world.hero('khalid')), garde: JSON.stringify(I.save.data.postures) }; });
    await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, 'C-1-postures.png') }); await p.keyboard.press('Escape'); await p.waitForTimeout(250); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    si(c.page && c.prise === 'sage' && /● Khâlid · figure : le sage/.test((c.apres || []).join('|')) && /khalid/.test(c.garde || '') && /possède pas/.test(c.pane || ''), `à la halte, « Figures » : Khâlid prend la figure du sage d'un toucher ; la partie le garde (${c.garde})`, `la page des postures : ${JSON.stringify(c)}`);
    // les effets, lus dans le combat : le sage, le héros, le saint
    const effets = async prises => p.evaluate(async prises => { const I = window.ISNAD, W = I.world, Po = I.postures; Object.keys(prises).forEach(id => { const h = W.hero(id); h.lvl = Math.max(h.lvl, 7); Po.choisir(h, prises[id]); });
      const brut = {}; W.party.forEach(id => { const st = I.calc.of(W.hero(id)); brut[id] = { atk: st.atk, mag: st.mag }; });
      I.battle.start({ group: Object.keys(W.saga.enemies).filter(k => W.saga.enemies[k].tier === 'minion').slice(0, 2), bg: 'desert' }); await new Promise(r => setTimeout(r, 250));
      const H = I.battle.places().filter(e => e.camp === 'hero').map(e => Object.assign({ brut: brut[e.id] }, e)); await new Promise(r => setTimeout(r, 900)); // les héros dès l'ouverture (avant tout tour), les égrégores une fois apparus
      const rang = [...document.querySelectorAll('#battle .hrow small')].map(e => e.textContent.trim()); return { heros: H, connues: I.battle.places().filter(e => e.camp === 'foe').map(e => e.connues), rang }; }, prises);
    const f = await effets({ khalid: 'sage', qaqa: 'heros', dirar: 'saint' }), K = f.heros.find(e => e.id === 'khalid'), Q = f.heros.find(e => e.id === 'qaqa'), Dr = f.heros.find(e => e.id === 'dirar');
    await p.waitForTimeout(700); await p.screenshot({ path: path.join(out, 'C-2-combat.png') });
    const pres = (x, y) => Math.abs(x - y) <= 1;
    si(K && Q && Dr && K.posture === 'sage' && pres(K.mag, K.brut.mag * 1.10) && pres(K.atk, K.brut.atk) && f.connues.every(n => n >= 1) && Q.posture === 'heros' && pres(Q.atk, Q.brut.atk * 1.10) && Q.niyya === 2 && Q.menace > 0 && Dr.posture === 'saint' && Dr.soin === 0.15 && Dr.sakina >= 20 && K.niyya === 1 && f.rang.some(t => /sage/.test(t)) && f.rang.some(t => /saint/.test(t)),
      `en combat : le sage (Esprit ${K && K.brut.mag} → ${K && K.mag}, une faille de chaque égrégore connue), le héros (Force ${Q && Q.brut.atk} → ${Q && Q.atk}, Niyya ${Q && Q.niyya}, plus souvent visé), le saint (soins +15 %, Sérénité ${Dr && Dr.sakina}) — et le rang de chacun le dit`, `les effets : ${JSON.stringify(f)}`);
    // la partie : gardée, relue ; une posture inconnue est refusée
    const g = await p.evaluate(() => { const I = window.ISNAD, t = I.save.exporter(), r = I.save.lireTexte(t), o = JSON.parse(t); o.partie.postures['khalid:khalid'] = 'roi'; const r2 = I.save.lireTexte(JSON.stringify(o)); return { ok: r.ok, postures: r.ok && JSON.stringify(r.partie.postures), refus: !r2.ok && r2.erreur }; });
    si(g.ok && /"khalid:khalid":"sage"/.test(g.postures || '') && g.refus, `la partie exportée garde les postures prises ; une posture inconnue est refusée (« ${g.refus} »)`, `la partie : ${JSON.stringify(g)}`);
    await p.context().close();
  }

  /* ---------- D. 2.23 (D212) : les quartiers de la Cité — l'outil « cite », dit par Maître Yûnus à la première arrivée ---------- */
  {
    const p = await ouvrir(), T = outils(p);
    const arriver = async () => { await p.evaluate(() => { const I = window.ISNAD; document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); I.input.reset(); window.__dits.length = 0; I.cite.arriver(); });
      await p.waitForTimeout(1500); for (let i = 0; i < 80 && !(await T.main()); i++) { await T.entree(); await p.waitForTimeout(160); } await p.waitForTimeout(300); };
    // une partie neuve, le prologue joué : on y a appris à marcher et à parler
    await p.evaluate(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; I.save.data.prologue = true; I.lecons.ouvrir(); const d = I.save.data.lecons; d.recus = { marcher: 0, parler: 1 }; d.re = { marcher: 1, parler: 1 }; d.dernier = 'parler'; d.seq = 4; d.donne = 1; });
    await arriver();
    const a = await p.evaluate(() => { const I = window.ISNAD; return { ch: I.world.ch && I.world.ch.id, recu: I.save.data.lecons.recus.cite, journal: I.lecons.journal.map(j => j.id), dit: I.cite.journal.filter(j => j.quoi === 'lecon').length, toasts: window.__dits.map(x => x.t).filter(t => /revenir quand tu veux/.test(t)) }; });
    si(a.ch === 'c_quartiers' && a.recu !== undefined && a.journal.join() === 'cite' && a.dit === 1 && !a.toasts.length, 'les quartiers de la Cité, la première fois : Maître Yûnus dit qu’on peut y revenir — un seul outil (« cite »), dit par lui, aucune ligne de plus en marge', `la première arrivée : ${JSON.stringify(a)}`);
    await arriver();
    const b = await p.evaluate(() => { const I = window.ISNAD; return { dit: I.cite.journal.filter(j => j.quoi === 'lecon').length, journal: I.lecons.journal.map(j => j.id) }; });
    si(b.dit === 1 && b.journal.join() === 'cite', 'à l’arrivée suivante, la leçon ne se redit pas', `l’arrivée suivante : ${JSON.stringify(b)}`);
    await p.context().close();
  }

  if (errors.length) { anomalies++; console.log('--- ERREURS ---'); [...new Set(errors)].slice(0, 10).forEach(e => console.log(e)); } else ok('aucune erreur console');
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ PROGRESSION CONFORME — un outil à la fois, les trois figures (captures dans ${path.relative(path.join(__dirname, '..'), out)})`);
  await browser.close();
  process.exit(anomalies ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
