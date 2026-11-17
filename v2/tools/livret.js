#!/usr/bin/env node
/* ISNAD 2.x — le livret de présentation : douze pages au format d'un écran de téléphone, en français.
   Usage : node v2/tools/livret.js           captures dans le jeu, assemblage, contrôle, PDF
           node v2/tools/livret.js textes    après une retouche du texte : assemble, contrôle et refait le PDF, sans captures
   Le gabarit est promo/livret-2x/livret.src.html. L'outil y pose :
     · l'adresse, la devise et la réserve (v2/tools/promotion.js) ;
     · les cinq sagas, lues dans les données du jeu (nom, Lumière, années, phrase) : rien n'y est retapé ;
     · douze images, toutes capturées en jouant le jeu assemblé (v2/index.html) — aucune n'est inventée.
   Il écrit, dans promo/livret-2x/ : img/*.jpg, donnees.json, livret.html (à lire, à imprimer), livret.artifact.html (la
   même page, pour un Artifact privé) et livret.pdf (non versionné).
   Le contrôle écrit « LIVRET CONFORME », sinon « DÉBORDE » (un texte dépasse sa page), « ABSENT » (une image, une saga,
   la réserve) ou « ÉCART » (un nom qui ne doit pas paraître, un nombre de pages inattendu). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const P = require('./promotion.js');
const V2 = path.join(__dirname, '..'), RACINE = path.join(V2, '..'), DOS = path.join(RACINE, 'promo/livret-2x'), IMG = path.join(DOS, 'img');
const PAGES = 12, LE = { 'Véracité': 'la', 'Justice': 'la', 'Courage': 'le', 'Miséricorde': 'la', 'Savoir': 'le' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- 1. les images : capturées en jouant ---------- */
async function captures() {
  const { Plateau } = require('./shorts.js');
  fs.mkdirSync(IMG, { recursive: true });
  const s = new Plateau({ id: 'livret', graine: 632 }, { sansFilm: true }); await s.ouvrir();
  // une vue : une bande de l'écran du téléphone (y, h en points), en JPEG
  const vue = async (nom, y, h) => { await s.avancer(200); await s.ev(() => window.__film.anims()); await s.p.screenshot({ path: path.join(IMG, nom + '.jpg'), type: 'jpeg', quality: 84, clip: { x: 0, y, width: 360, height: h } }); console.log('  ✓ ' + nom); };
  console.log('Captures');
  // ce que le jeu dit de ses récits
  const sagas = {}; for (const id of ['abubakr', 'umar', 'khalid', 'uthman', 'ali']) sagas[id] = await s.recit(id);
  fs.writeFileSync(path.join(DOS, 'donnees.json'), JSON.stringify({ sagas }, null, 2) + '\n');
  // 1 — l'écran-titre, sans son texte : l'image seule
  await s.cadre('ecran'); await s.ev(() => { document.body.classList.add('f-titre'); window.ISNAD.ui.showTitle(); document.querySelector('#title').style.visibility = 'hidden'; }); await s.avancer(900);
  { const r = await s.ev(() => { const q = document.querySelector('#stage').getBoundingClientRect(); return [q.top, q.height]; }); await vue('01-titre', r[0], r[1]); }
  await s.ev(() => { document.querySelector('#title').style.visibility = ''; document.querySelector('#title').hidden = true; document.body.classList.remove('in-screen', 'f-titre'); });
  // 2 — Médine, la porte sud
  await s.neuf(); await s.chapitre('abubakr', 0, { obj: 1 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5); await vue('02-medine', 92, 202);
  // 4 — le voile de lumière, de près
  await s.zoom(3); await vue('04-voile', 96, 202);
  // 8 — une parole et sa source : le carton du jeu
  await s.zoom(1.5); await s.dire('abubakr', 'il a dit vrai'); await s.avancer(900); await vue('08-citation', 196, 230);
  // 9 — devant la mosquée
  await s.neuf(); await s.chapitre('abubakr', 0, { obj: 2, lieu: ['mosquee_porte', 0, 2] }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5); await vue('09-mosquee', 60, 202);
  // 3 — la Chaîne
  await s.neuf(); await s.cadre('ecran'); await s.ev(() => { window.ISNAD.ui.showChain(); }); await s.avancer(700); await s.ev(() => { document.querySelector('#chain').scrollTop = 262; }); await vue('03-chaine', 8, 240);
  // 5 — le camp de Khâlid ; 6 — Koufa
  await s.neuf(); await s.chapitre('khalid', 0, { obj: 4 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5); await vue('05-camp', 70, 202);
  await s.neuf(); await s.chapitre('ali', 0, { obj: 1 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5); await vue('06-koufa', 70, 202);
  // 7 — un combat d'idole
  await s.neuf(); await s.chapitre('umar', 2, { obj: 0 }); await s.cadre('carre'); await s.propre({ panneau: false, bandeau: false }); await s.combat(['trone'], { idole: true, fond: 'ville', attente: 2400 }); await vue('07-combat', 0, 202);
  // 10 — bâtir : une tranchée, un puits, deux palmiers
  await s.neuf(); await s.chapitre('abubakr', 1, { obj: 7 }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.5);
  await s.ev(() => { const I = window.ISNAD, W = I.world, B = I.build, tx = Math.floor(W.player.x / 16), ty = Math.floor((W.player.y - 3) / 16); ['eau', 'pise', 'palme', 'pierre', 'grain'].forEach(k => B.give(k, 9, true));
    B.placeAt(tx - 1, ty + 2, 'tranchee'); B.placeAt(tx, ty + 2, 'tranchee'); B.placeAt(tx + 1, ty + 2, 'tranchee'); B.placeAt(tx + 3, ty + 1, 'puits'); B.placeAt(tx + 4, ty + 2, 'palmier'); B.placeAt(tx + 2, ty + 3, 'palmier'); });
  await s.avancer(1200); await vue('10-batir', 140, 202);
  // 11 — la Cité-Miroir
  await s.neuf(); await s.chapitre('idris', 0, { obj: 1, lieu: ['ecran', 0, 2] }); await s.cadre('carre'); await s.propre({ cible: false }); await s.zoom(1.25); await vue('11-cite', 30, 202);
  // 12 — le labyrinthe de la noosphère
  await s.neuf(); await s.chapitre('abubakr', 0, { obj: 3 }); await s.cadre('carre');
  await s.ev(() => { const I = window.ISNAD, F = window.__film; I.debug.sansMeutes = false; I.debug.profondeur = 3; I.debug.graine = 20261117; F.parle = true; I.script.run([['map', 'noos', 'seuil', { hue: 210 }]]).then(() => { F.parle = false; }); });
  await s.jusqua(() => !window.__film.parle, null, 20000); await s.propre({ cible: false, carte: true }); await s.zoom(1.25); await s.avancer(400); await vue('12-labyrinthe', 40, 202);
  if (s.erreurs.length) console.log('  ! erreurs pendant les captures : ' + [...new Set(s.erreurs)].slice(0, 3).join(' | ').slice(0, 300));
  await s.fermer();
}

/* ---------- 2. l'assemblage ---------- */
function assembler() {
  const src = fs.readFileSync(path.join(DOS, 'livret.src.html'), 'utf8'), D = JSON.parse(fs.readFileSync(path.join(DOS, 'donnees.json'), 'utf8'));
  const saga = id => { const g = D.sagas[id]; if (!g) return '<p>ABSENT : ' + id + '</p>'; return `<p class="saga"><b>${esc(g.nom)}</b><i>${LE[g.lumiere] || 'la'} ${esc(g.lumiere)} · ${esc(g.annees.split(' · ').pop())}</i><span>${esc(g.phrase)}</span></p>`; };
  const corps = src.replace(/\{\{SAGA:(\w+)\}\}/g, (m, id) => saga(id)).replace(/\{\{(\w+)\}\}/g, (m, k) => (P[k] !== undefined ? esc(P[k]) : m));
  fs.writeFileSync(path.join(DOS, 'livret.artifact.html'), corps);
  fs.writeFileSync(path.join(DOS, 'livret.html'), '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + corps.replace(/<meta name="claude:[^>]*>\n/, '').replace(/(<\/style>\n)/, '$1</head>\n<body>\n') + '</body>\n</html>\n');
  return corps;
}

/* ---------- 3. le contrôle, puis le PDF ---------- */
async function controler(corps) {
  let anomalies = 0; const dit = (v, mot, m) => { if (!v) anomalies++; console.log((v ? 'OK  ' : mot + ' ') + m); };
  const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 400, height: 760 }, deviceScaleFactor: 2 })).newPage(), erreurs = [];
  p.on('pageerror', e => erreurs.push(e.message)); p.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
  await p.goto('file://' + path.join(DOS, 'livret.html')); await p.waitForTimeout(1200); await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => ({ pages: document.querySelectorAll('.page').length, large: document.documentElement.scrollWidth - innerWidth,
    deborde: [...document.querySelectorAll('.page')].filter(g => { const f = g.querySelector('.feuille'); return f.scrollHeight > f.clientHeight + 1 || f.scrollWidth > f.clientWidth + 1; }).map(g => g.id + ' (' + (g.querySelector('.feuille').scrollHeight - g.querySelector('.feuille').clientHeight) + ' points)'),
    images: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src')), petits: [...document.querySelectorAll('.feuille *')].filter(e => e.children.length === 0 && e.textContent.trim().length > 3 && parseFloat(getComputedStyle(e).fontSize) < 9.5).map(e => e.textContent.trim().slice(0, 24)) }));
  dit(r.pages === PAGES, 'ÉCART', `${r.pages} pages (attendu : ${PAGES})`);
  dit(!r.deborde.length, 'DÉBORDE', r.deborde.length ? 'un texte dépasse sa page : ' + r.deborde.join(', ') : 'aucun texte ne dépasse sa page (sur un téléphone de 400 points de large)');
  dit(!r.images.length, 'ABSENT', r.images.length ? 'images manquantes : ' + r.images.join(', ') : 'les douze images sont là');
  dit(r.large <= 0, 'DÉBORDE', 'la page ne défile pas en largeur sur un téléphone');
  dit(!r.petits.length, 'ÉCART', r.petits.length ? 'textes trop petits : ' + r.petits.slice(0, 4).join(' · ') : 'aucun texte sous dix points');
  const texte = corps.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<[^>]+>/g, ' ');
  dit(texte.includes(P.RESERVE.replace(/&/g, '&amp;')) || texte.includes(P.RESERVE), 'ABSENT', 'la réserve y est : « ' + P.RESERVE + ' »');
  dit(texte.includes(P.ADRESSE), 'ABSENT', 'l’adresse y est : ' + P.ADRESSE);
  dit(!/ABSENT :/.test(corps) && !/\{\{/.test(corps), 'ABSENT', 'les cinq sagas viennent des données du jeu, aucun champ n’est resté vide');
  // les noms que la promotion ne doit pas porter (exigences 14 et 24) : l'outil ne les écrit pas, il compare des empreintes
  const interdits = ['c2FpbnQtZXh1cA==', 'c2FpbnQgZXh1cA==', 'c2NoZWxlcg=='].map(x => Buffer.from(x, 'base64').toString());
  dit(!interdits.some(n => texte.toLowerCase().includes(n)), 'ÉCART', 'aucun auteur n’est nommé');
  dit(!erreurs.length, 'ÉCART', erreurs.length ? 'erreurs : ' + erreurs.slice(0, 2).join(' | ') : 'aucune erreur à l’affichage');
  await p.screenshot({ path: path.join(RACINE, 'promo/shorts/.prises', 'livret-tel.png'), fullPage: false }).catch(() => {});
  // le PDF : une page par écran
  const q = await (await b.newContext({ viewport: { width: 360, height: 640 } })).newPage(); await q.goto('file://' + path.join(DOS, 'livret.html')); await q.waitForTimeout(1200); await q.evaluate(() => document.fonts.ready);
  await q.pdf({ path: path.join(DOS, 'livret.pdf'), width: '360px', height: '640px', printBackground: true, preferCSSPageSize: true });
  await b.close();
  const pdf = fs.readFileSync(path.join(DOS, 'livret.pdf')), n = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  dit(n === PAGES, 'ÉCART', `le PDF fait ${n} pages, ${(pdf.length / 1e6).toFixed(1)} Mo`);
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : '✓ LIVRET CONFORME — promo/livret-2x/livret.html, livret.artifact.html, livret.pdf');
  return anomalies;
}

(async () => {
  fs.mkdirSync(DOS, { recursive: true });
  if (!process.argv.includes('textes')) await captures();
  const corps = assembler();
  process.exit(await controler(corps) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
