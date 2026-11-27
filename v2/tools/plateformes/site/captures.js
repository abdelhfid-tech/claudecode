/* ISNAD 2.x — le site : les captures, prises en jouant le jeu assemblé (v2/index.html, dans son paquet web : le même jeu,
   les polices embarquées, rien ne sort), rien d'inventé.
   Deux appareils : un téléphone tenu en hauteur (390 × 844, tactile) et un écran 16:9 (1280 × 720). Chaque vue est une
   page neuve du jeu, ouverte à un point de passage d'un récit, comme le font le livret et les shorts (v2/tools/livret.js,
   shorts.js) : l'interface du jeu reste telle qu'elle est (c'est ce que le joueur verra), le hasard est fixé.
   Ce qu'on ne montre pas : le Prophète ﷺ (le jeu ne le représente jamais), les passantes des quartiers (aucune vue n'est
   prise dans les quartiers de la Cité), les figures (exigence 24, hors champ comme dans les shorts, D172).
   Sortie : plateformes/sortie/.site-captures/ (non versionné) — <nom>-tel.jpg, <nom>-large.jpg, captures.json (le numéro
   du jeu, les sagas lues dans le jeu, le texte de remplacement de chaque vue). Le site se refait sans navigateur tant
   que le numéro du jeu ne change pas. */
const fs = require('fs'), path = require('path');

// les vues : où aller, quoi y faire ; alt : ce que montre l'image (proposition, textes-a-valider.md)
const VUES = [
  { nom: 'titre', titre: true, legende: 'L’écran-titre', alt: 'L’écran-titre du jeu : ISNAD, Chroniques des Compagnons, au-dessus d’une ville au couchant.',
    faire: async (p) => { await p.evaluate(() => { const I = window.ISNAD; I.ui.showTitle(); }); await p.waitForTimeout(1500); } },
  { nom: 'medine', legende: 'Médine', alt: 'Médine : Abû Bakr et ses compagnons, un voile de lumière pour visage.',
    faire: async (p, o) => { await chapitre(p, 'abubakr', 0, { obj: 1 }); await zoom(p, o.tel ? 1.5 : 1.25); } },
  { nom: 'chaine', legende: 'La Chaîne', alt: 'L’écran de la Chaîne : les maillons, du premier au dernier, chacun avec son Compagnon et sa Lumière.',
    faire: async (p) => { await p.evaluate(() => { window.ISNAD.ui.showChain(); }); await p.waitForTimeout(1400); } },
  { nom: 'combat', legende: 'Un combat', alt: 'Un combat au tour par tour : trois Compagnons face au Trône vide, une idole.',
    faire: async (p) => { await chapitre(p, 'umar', 2, { obj: 0 }); await combat(p, ['trone'], { idole: true, fond: 'ville' }); } },
  { nom: 'desert', legende: 'Au désert', alt: 'Un camp au désert, au couchant : Khâlid et ses compagnons près des tentes.',
    faire: async (p, o) => { await chapitre(p, 'khalid', 0, { obj: 4 }); await zoom(p, o.tel ? 1.5 : 1.25); } },
  { nom: 'labyrinthe', legende: 'La noosphère', alt: 'La noosphère : un labyrinthe tiré au hasard, sous un chrono.',
    faire: async (p, o) => { await chapitre(p, 'abubakr', 0, { obj: 3 });
      await p.evaluate(() => { const I = window.ISNAD; I.debug.profondeur = 3; I.debug.graine = 20261117; window.__site.fait = false; I.script.run([['map', 'noos', 'seuil', { hue: 210 }]]).then(() => { window.__site.fait = true; }); });
      await p.waitForFunction(() => window.__site.fait, null, { timeout: 30000 }); await p.waitForTimeout(600); await zoom(p, o.tel ? 1.25 : 1); } },
  { nom: 'cite', legende: 'La Cité-Miroir, en 2084', alt: 'La Cité-Miroir, en 2084 : une rue au crépuscule, un grand écran.',
    faire: async (p, o) => { await chapitre(p, 'idris', 0, { obj: 1, lieu: ['ecran', 0, 2] }); await zoom(p, o.tel ? 1.25 : 1); } },
  { nom: 'arabe', legende: 'En arabe', alt: 'Le jeu en arabe : la première phrase du prologue, dans la Cité-Miroir.', titre: true,
    faire: async (p) => {
      await p.locator('#title .vmenu button', { hasText: 'العربية' }).first().click(); await p.waitForTimeout(500);
      const t = s => p.evaluate(s => window.ISNAD.t(s), s);
      await p.locator('#title .vmenu button', { hasText: await t('Nouvelle partie') }).first().click();
      await p.waitForSelector('#perso:not([hidden])', { timeout: 10000 }); await p.locator('#perso button', { hasText: await t('Commencer') }).first().click();
      // jusqu'à la première réplique, écrite en entier
      for (let i = 0; i < 40; i++) {
        const r = await p.evaluate(() => { const d = document.querySelector('#dialog'), n = document.querySelector('#dialog .next'); return d && !d.hidden && n && n.style.visibility === 'visible' && d.querySelector('.name').textContent.trim() ? 1 : 0; });
        if (r) break; await p.keyboard.press('Enter'); await p.waitForTimeout(700);
      }
      await p.waitForTimeout(600); } }
];

// ouvre un chapitre à un point de passage (comme Plateau.chapitre, v2/tools/shorts.js)
async function chapitre(p, saga, ci, cp) {
  await p.evaluate(([saga, ci, cp]) => { const I = window.ISNAD, W = I.world, ch = I.sagas[saga].chapters[ci]; I.debug.auto = false; W.roster = {}; W.saga = null; window.__site.fait = false;
    const pt = { party: ch.party, obj: cp.obj || 0, flags: {}, map: cp.carte || ch.map, opts: ch.opts || {}, pos: cp.lieu || ch.start, foes: [], chests: [], npcs: {} };
    W.startChapter(saga, ci, pt).then(() => { window.__site.fait = true; }); }, [saga, ci, cp]);
  await p.waitForFunction(() => window.__site.fait, null, { timeout: 30000 });
  await p.waitForFunction(() => { const I = window.ISNAD; return !I.script.busy && !I.world.lock; }, null, { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(900);
}
const zoom = async (p, z) => { await p.evaluate(z => window.ISNAD.ui.zoomer && window.ISNAD.ui.zoomer(z, false), z); await p.waitForTimeout(500); };
async function combat(p, groupe, o) {
  await p.evaluate(([g, o]) => { window.ISNAD.battle.start({ group: g, bg: o.fond || 'noos', boss: !!o.idole, sansReprise: true }); }, [groupe, o]);
  if (o.idole) { await p.waitForFunction(() => !!document.querySelector('.screen:not([hidden]) button, #choice:not([hidden]) .opt'), null, { timeout: 10000 }); await p.waitForTimeout(400); await p.keyboard.press('Enter'); }
  await p.waitForFunction(() => !!document.querySelector('#battle .cmd .mi'), null, { timeout: 30000 }); await p.waitForTimeout(2400);
}

async function prendre(C, dos, page, seules) {
  const { chromium, devices } = require('playwright');
  const J = C.lireJeu(), jeu = 'file://' + page;
  if (!seules) fs.rmSync(dos, { recursive: true, force: true }); fs.mkdirSync(dos, { recursive: true });
  const b = await chromium.launch(), erreurs = [], R = { numero: J.numero, version: J.version, vues: [], sagas: {} };
  const APP = { tel: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, userAgent: devices['iPhone 13'].userAgent }, large: { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 } };
  try {
    for (const v of VUES.filter(v => !seules || seules.includes(v.nom))) for (const [app, opt] of Object.entries(APP)) {
      const ctx = await b.newContext(opt), p = await ctx.newPage();
      p.on('pageerror', e => erreurs.push(`${v.nom}-${app} : ${e.message}`)); p.on('console', m => { if (m.type() === 'error') erreurs.push(`${v.nom}-${app} : ${m.text()}`); });
      await ctx.route(/^https?:/, r => r.abort());   // rien ne sort : le paquet web a ses polices en lui
      await p.addInitScript(([g, lang]) => { let a = g >>> 0; Math.random = function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; window.__site = {}; }, [632]);
      await p.goto(jeu); await p.waitForFunction(() => window.ISNAD && window.ISNAD.scene && !document.querySelector('#title').hidden, null, { timeout: 20000 });
      await p.evaluate(() => document.fonts.ready);
            await p.evaluate(() => { const I = window.ISNAD; I.audio.setOn(false); if (I.postures && I.postures.offertes) I.postures.offertes = () => false; });
      if (!v.titre) await p.evaluate(() => { const I = window.ISNAD; I.save.reset(); I.save.data.started = true; I.setScene(I.ui.blank); document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); document.body.classList.remove('in-screen'); });
      await v.faire(p, { tel: app === 'tel' });
      const f = path.join(dos, `${v.nom}-${app}.jpg`); await p.screenshot({ path: f, type: 'jpeg', quality: 82 });
      console.log(`  ✓ capture ${v.nom}-${app}`);
      if (!R.sagas.abubakr) for (const id of ['abubakr', 'umar', 'khalid', 'uthman', 'ali']) R.sagas[id] = await p.evaluate(id => { const I = window.ISNAD, g = I.sagas[id]; return { nom: I.t(g.name), lumiere: I.t(g.lightName), annees: g.years, phrase: I.t(g.tagline) }; }, id);
      await ctx.close();
    }
    for (const v of VUES) R.vues.push({ nom: v.nom, legende: v.legende, alt: v.alt });
    await icones(b, dos);
  } finally { await b.close(); }
  R.erreurs = [...new Set(erreurs)];
  fs.writeFileSync(path.join(dos, 'captures.json'), JSON.stringify(R, null, 2) + '\n');
  if (R.erreurs.length) console.log('  ! erreurs pendant les captures : ' + R.erreurs.slice(0, 3).join(' | ').slice(0, 300));
  return R;
}

/* les icônes de jouer/ (l'écran d'accueil) : celle de l'application, dessinée par le code
   (plateformes/application/icone/icone.js — une PROPOSITION de l'agent de l'application, à valider par le décideur) ; lue
   sans y toucher, rendue ici en PNG : 192, 512, 512 « masquable » (la chaîne dans le cercle que garde un masque), 180
   (l'écran d'accueil de l'iPhone). */
async function icones(b, dos) {
  const { svg } = require(path.join(__dirname, '../../../../plateformes/application/icone/icone.js'));
  const ctx = await b.newContext({ deviceScaleFactor: 1 }), p = await ctx.newPage();
  for (const [nom, cote, plein] of [['icone-192.png', 192, true], ['icone-512.png', 512, true], ['icone-masquable-512.png', 512, false], ['apple-touch-icon.png', 180, true]]) {
    await p.setViewportSize({ width: cote, height: cote });
    await p.setContent(`<!doctype html><style>html,body{margin:0;background:#07060d}svg{display:block}</style>${svg({ fond: 'encre', plein, cote })}`);
    await p.screenshot({ path: path.join(dos, nom), omitBackground: false });
  }
  await ctx.close(); console.log('  ✓ icônes (192, 512, 512 masquable, 180)');
}

module.exports = { VUES, prendre };
