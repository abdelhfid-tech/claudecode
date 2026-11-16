#!/usr/bin/env node
/* ISNAD 2.0 — les lieux du jeu de base sortent-ils comme dans la 1.32 ?
   La 2.0 bâtit un lieu d'après son gabarit (D.MAPS, D.GABARITS) au lieu d'une liste en dur. Cet outil charge la 1.32
   gelée (../index.html, lue seulement) et la 2.0 (index.html), bâtit des deux côtés chaque carte que le contenu demande
   — le lieu de chaque chapitre, chaque opération « map », avec ses options — et compare : le dessin du sol, point par
   point, la mini-carte, les cases pleines, les lieux nommés, les objets, les lumières, l'ambiance et la piste.
   Usage : node tools/cartes.js       code de sortie 1 au premier écart (« ÉCART ») */
const path = require('path');
const { chromium } = require('playwright');
const V1 = 'file://' + path.join(__dirname, '../../index.html'), V2 = 'file://' + path.join(__dirname, '../index.html') + '?def=1'; // la comparaison se fait dans le dessin d'origine : c'est lui que la 1.32 connaît

// dans la page : toutes les cartes que le contenu demande, puis une empreinte de chacune
const releve = () => {
  const I = window.ISNAD, vus = {}, liste = [];
  const noter = (id, opts) => { const k = id + JSON.stringify(opts || {}); if (!vus[k]) { vus[k] = 1; liste.push([id, opts || {}]); } };
  const fouiller = v => { if (!Array.isArray(v)) { if (v && typeof v === 'object') Object.keys(v).forEach(k => fouiller(v[k])); return; }
    if (v[0] === 'map' && typeof v[1] === 'string') noter(v[1], v[3]); v.forEach(fouiller); };
  Object.keys(I.sagas).forEach(sid => { const s = I.sagas[sid]; (s.chapters || []).forEach(c => { if (c.map) noter(c.map, c.opts); }); fouiller(s); });
  // et chaque lieu sans option, à chaque heure : ce que le jeu peut bâtir de lui-même (reprise, halte, essais)
  Object.keys(I.D.MAPS).forEach(id => { noter(id, {}); I.D.TIMES.forEach(t => noter(id, { time: t })); });
  const fnv = a => { let h = 2166136261; for (let i = 0; i < a.length; i++) { h ^= a[i]; h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); };
  const txt = s => fnv(Array.from(String(s), c => c.charCodeAt(0)));
  return liste.map(([id, opts]) => {
    const m = I.maps.build(id, opts), px = c => fnv(c.getContext('2d').getImageData(0, 0, c.width, c.height).data);
    return { cle: id + ' ' + JSON.stringify(opts), id: m.id, taille: m.w + '×' + m.h, sol: px(m.canvas), mini: px(m.mini), pleines: fnv(m.solid),
      lieux: JSON.stringify(m.spots), objets: txt(JSON.stringify(m.objs.map(o => [o.type, o.x, o.y, o.seed, o.opt || null]))), nObjets: m.objs.length,
      lumieres: txt(JSON.stringify(m.lights)), eau: m.anim.length, ambiance: JSON.stringify(m.env) };
  });
};

(async () => {
  const browser = await chromium.launch(), erreurs = [];
  const page = async url => { const p = await browser.newPage({ viewport: { width: 960, height: 540 } }); p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
    await p.goto(url); await p.waitForFunction(() => window.ISNAD && window.ISNAD.maps && window.ISNAD.sagaList.length > 0); return p; };
  const p1 = await page(V1), p1b = await page(V1), p2 = await page(V2);
  const a = await p1.evaluate(releve), a2 = await p1b.evaluate(releve), b = await p2.evaluate(releve);
  const v1 = await p1.evaluate(() => window.ISNAD_VERSION), v2 = await p2.evaluate(() => window.ISNAD_VERSION);
  await browser.close();
  const CHAMPS = ['id', 'taille', 'sol', 'mini', 'pleines', 'lieux', 'objets', 'nObjets', 'lumieres', 'eau', 'ambiance'];
  // un champ que la 1.32 ne rend pas deux fois pareil ne prouve rien : on le dit, et on ne le compare pas
  const instables = {}; a.forEach((x, i) => CHAMPS.forEach(k => { if (x[k] !== a2[i][k]) instables[k] = (instables[k] || 0) + 1; }));
  let ecarts = 0; const parB = {}; b.forEach(x => { parB[x.cle] = x; });
  a.forEach(x => { const y = parB[x.cle]; if (!y) { ecarts++; console.log(`ÉCART ${x.cle} : la 2.0 ne bâtit pas cette carte`); return; }
    const diff = CHAMPS.filter(k => !instables[k] && x[k] !== y[k]); if (diff.length) { ecarts++; console.log(`ÉCART ${x.cle} : ${diff.join(', ')}`); } });
  console.log(`1.32 : ${v1}`); console.log(`2.0  : ${v2}`);
  console.log(`${a.length} cartes bâties des deux côtés (${new Set(a.map(x => x.id)).size} lieux) · comparé : ${CHAMPS.filter(k => !instables[k]).join(', ')}` + (Object.keys(instables).length ? ` · non comparé, instable dans la 1.32 elle-même : ${Object.keys(instables).join(', ')}` : ''));
  if (erreurs.length) { console.log('--- ERREURS ---'); [...new Set(erreurs)].slice(0, 10).forEach(e => console.log(e)); }
  console.log(ecarts || erreurs.length ? `✗ ${ecarts} écart(s)` : '✓ CARTES IDENTIQUES à celles de la 1.32');
  process.exit(ecarts || erreurs.length ? 1 : 0);
})();
