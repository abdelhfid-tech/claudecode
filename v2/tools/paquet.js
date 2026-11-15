#!/usr/bin/env node
/* ISNAD 2.0 — éprouve un paquet : hors du jeu, puis dans le jeu.
   Usage : node tools/paquet.js [fichier]      fichier : un paquet en .json, ou en .js (module.exports = { … })
                                               sans argument : le paquet d'essai (tools/essais/paquet_essai.js)
   1. Le paquet est-il de la donnée pure ? Passe-t-il les règles (src/core/regles.js), face au jeu de base ?
   2. Pour le paquet d'essai seulement : des copies fautives sont-elles refusées, chacune pour la bonne raison ?
   3. Un jeu d'essai est assemblé à part (.smoke/essai/index.html) : le jeu livré n'est pas touché.
   4. Dans ce jeu : le paquet est-il posé ? Chaque lieu se bâtit-il à chaque heure, ses lieux nommés se rejoignent-ils, sa
      piste est-elle la bonne ? Chaque saga se joue-t-elle jusqu'au bout — en sautant, à pied, au doigt ? Les objets, les
      pièces et les étals sont-ils là, les pistes sonnent-elles ? Un paquet fautif est-il refusé sans arrêter le jeu ?
   Sortie : une ligne « OK » par preuve ; « REFUS », « BLOQUÉ », « ABSENT », « INACCESSIBLE » ou « ÉCART » sinon. Code 1 à la première anomalie. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { execFileSync } = require('child_process');
const V2 = path.join(__dirname, '..'), ESSAI = path.join(__dirname, 'essais/paquet_essai.js');
const fichier = path.resolve(process.argv[2] || ESSAI), estEssai = fichier === ESSAI;
const D = require('../src/core/defs.js'), RG = require('../src/core/regles.js');
const out = path.join(V2, '.smoke/essai');
let anomalies = 0;
const ok = m => console.log('OK  ' + m), ko = m => { anomalies++; console.log(m); };

/* ---------- 1. hors du jeu ---------- */
const brut = /\.json$/.test(fichier) ? JSON.parse(fs.readFileSync(fichier, 'utf8')) : require(fichier);
const impurs = []; (function pur(v, ou) { if (v === null) return; const t = typeof v;
  if (t === 'function' || t === 'undefined' || t === 'symbol' || t === 'bigint' || (t === 'number' && !Number.isFinite(v))) { impurs.push(ou + ' (' + t + ')'); return; }
  if (t !== 'object') return; if (Array.isArray(v)) { v.forEach((x, i) => pur(x, ou + '[' + i + ']')); return; } Object.keys(v).forEach(k => pur(v[k], ou + '.' + k)); })(brut, 'paquet');
if (impurs.length) { ko(`REFUS le paquet n'est pas de la donnée pure : ${impurs.slice(0, 5).join(', ')}`); process.exit(1); }
const P = JSON.parse(JSON.stringify(brut)), copie = () => JSON.parse(JSON.stringify(P));
// le jeu de base, lu comme le fait la commande de contrôle
const base = [];
for (const f of fs.readdirSync(path.join(V2, 'src/data')).filter(f => /\.js$/.test(f)).sort()) {
  const ctx = { ISNAD: { registerSaga: s => base.push(s), registerMusic() {} }, console }; ctx.window = ctx; ctx.globalThis = ctx;
  vm.runInNewContext(fs.readFileSync(path.join(V2, 'src/data', f), 'utf8'), ctx, { filename: f });
}
const tables = () => JSON.stringify([Object.keys(D.MAPS), Object.keys(D.GEAR), Object.keys(D.ITEMS), D.GEAR_SHOPS, D.TRACKS, D.LIVRES]), avant = tables();
const r = RG.verifierPaquet(D, P, { sagas: base });
console.log(r.erreurs.length ? `✗ paquet ${P.id} — ${r.erreurs.length} erreur(s)` : `✓ paquet ${P.id} (version ${P.version}) — ${r.resume} · ${(JSON.stringify(P).length / 1024).toFixed(0)} Ko`);
r.erreurs.forEach(e => console.log('   - ' + e)); r.avis.forEach(a => console.log('   ! ' + a));
if (r.erreurs.length) { anomalies += r.erreurs.length; console.log('✗ le paquet ne passe pas les règles : rien n’est assemblé'); process.exit(1); }

/* ---------- 2. le paquet d'essai, abîmé de dix-huit façons : chacune doit être refusée, pour la bonne raison ---------- */
if (estEssai) {
  const S0 = p => p.sagas[0], C0 = p => S0(p).chapters[0];
  const FAUTES = [
    ['un égrégore qui fixe sa Constance', p => { S0(p).enemies.hate_essai.hp = 500; }, 'ne fixe ni Constance'],
    ['un égrégore au nom interdit', p => { S0(p).enemies.hate_essai.name = 'Le Djinn pressé'; }, 'djinn'],
    ['une idole sans racine connue', p => { S0(p).enemies.oubli_essai.racine = 'paresse_inconnue'; }, 'racine'],
    ['un objet sacré changé en pouvoir', p => { p.objets.figues.name = 'Eau de Zamzam'; }, 'sacré'],
    ['un objet à l’effet hors bornes', p => { p.objets.figues.hp = 3; }, 'part'],
    ['un objet à l’effet inconnu', p => { p.objets.figues.invincible = true; }, 'inconnue'],
    ['une pièce à laquelle on prête une vertu', p => { p.equipement.epee_essai.name = 'Épée bénie'; }, 'vertu'],
    ['une pièce trop forte', p => { p.equipement.epee_essai.atk = 60; }, 'hors bornes'],
    ['une pièce d’une famille que le moteur ne dessine pas', p => { p.equipement.epee_essai.t = 'cimeterre'; }, 'famille'],
    ['un chapitre dans un lieu qui n’existe pas', p => { C0(p).map = 'nulle_part'; }, 'inconnue'],
    ['un départ que le gabarit n’a pas', p => { C0(p).start = 'trone'; }, 'absent'],
    ['un lieu au nom interdit', p => { p.lieux.halte_essai.nom = 'Le Val des djinns'; }, 'djinn'],
    ['un lieu sur un gabarit inconnu', p => { p.lieux.piste_essai.gabarit = 'banquise'; }, 'gabarit'],
    ['une piste mal comptée', p => { p.pistes.essai_air.voices[0].notes += ' D4/1'; }, 'dure'],
    ['un étal dans un lieu sans comptoir', p => { p.etals.palais = ['epee_essai']; }, 'comptoir'],
    ['l’histoire-cadre dans un paquet', p => { S0(p).frame = true; }, 'jeu de base'],
    ['une saga du jeu de base redéclarée', p => { S0(p).id = 'abubakr'; }, 'existe déjà'],
    ['deux sagas au même rang du même livre', p => { const s = JSON.parse(JSON.stringify(S0(p))); s.id = 'essai_bis'; p.sagas.push(s); }, 'même ordre'],
    ['un lieu du jeu de base redéclaré', p => { p.lieux.medine = { gabarit: 'ville', nom: 'Autre' }; }, 'existe déjà'],
    ['un moteur trop récent', p => { p.moteur = 99; }, 'moteur'],
    ['une clé inconnue', p => { p.equipment = {}; }, 'inconnue']
  ];
  let bien = 0;
  FAUTES.forEach(([quoi, abimer, raison]) => { const p = copie(); abimer(p); const e = RG.verifierPaquet(D, p, { sagas: base }).erreurs;
    if (!e.length) ko(`ÉCART les règles laissent passer ${quoi}`);
    else if (!e.some(x => x.toLowerCase().includes(raison.toLowerCase()))) ko(`ÉCART ${quoi} : refusé, mais pas pour la raison attendue (« ${raison} ») — ${e[0]}`);
    else bien++; });
  if (bien === FAUTES.length) ok(`${bien} copies fautives du paquet, toutes refusées pour la bonne raison`);
}
if (tables() !== avant) ko('ÉCART le contrôle a modifié les tables du jeu'); else ok('le contrôle ne laisse aucune trace dans les tables du jeu');

/* ---------- 3. un jeu d'essai, à part ---------- */
fs.mkdirSync(out, { recursive: true });
const json = path.join(out, P.id + '.json'); fs.writeFileSync(json, JSON.stringify(P));
const livre = f => { const h = require('crypto').createHash('sha256'); h.update(fs.readFileSync(path.join(V2, f))); return h.digest('hex'); };
const jeuAvant = fs.existsSync(path.join(V2, 'index.html')) ? livre('index.html') + livre('dist/isnad.html') : '';
console.log('    ' + execFileSync('node', [path.join(__dirname, 'build.js'), '--avec', json, '--vers', out], { cwd: V2 }).toString().trim());
if (jeuAvant && jeuAvant !== livre('index.html') + livre('dist/isnad.html')) ko('ÉCART l’assemblage d’essai a touché le jeu livré'); else ok('jeu d’essai assemblé à part : le jeu livré n’est pas touché');

/* ---------- 4. dans le jeu ---------- */
const { chromium } = require('playwright');
const url = 'file://' + path.join(out, 'index.html');
(async () => {
  const browser = await chromium.launch(); let errors = [];
  const mkPage = async vp => { const ctx = await browser.newContext({ viewport: vp || { width: 960, height: 540 }, hasTouch: !!vp && vp.width < 600 }); const page = await ctx.newPage();
    page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n'))); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url); await page.waitForTimeout(1900); return page; };
  const sansErreur = quoi => { if (errors.length) { ko(`ÉCART erreur console (${quoi}) : ${[...new Set(errors)].slice(0, 3).join(' | ').slice(0, 400)}`); errors = []; return false; } return true; };

  // le paquet est-il posé ? ses tables sont-elles là ?
  let page = await mkPage();
  const pose = await page.evaluate(id => { const I = window.ISNAD, q = I.paquets[id]; return { q: q || null, refuses: I.refuses, version: window.ISNAD_VERSION, moteur: I.D.MOTEUR,
    lieux: q ? q.lieux.filter(k => I.D.MAPS[k] && I.D.MAPS[k].paquet === id).length : 0, objets: q ? q.objets.filter(k => I.D.ITEMS[k]).length : 0, pieces: q ? q.equipement.filter(k => I.D.GEAR[k]).length : 0,
    pistes: q ? q.pistes.filter(k => I.music[k] && I.D.TRACKS.includes(k)).length : 0, sagas: q ? q.sagas.filter(k => I.sagas[k] && I.sagaList.includes(I.sagas[k])).length : 0 }; }, P.id);
  const nb = k => Object.keys(P[k] || {}).length;
  if (!pose.q) ko(`REFUS le jeu n'a pas posé le paquet : ${JSON.stringify(pose.refuses).slice(0, 400)}`);
  else if (pose.lieux !== nb('lieux') || pose.objets !== nb('objets') || pose.pieces !== nb('equipement') || pose.pistes !== nb('pistes') || pose.sagas !== (P.sagas || []).length) ko(`ABSENT une partie du paquet manque dans le jeu : ${JSON.stringify(pose)}`);
  else ok(`le jeu démarre et pose le paquet (${pose.version} · moteur ${pose.moteur}) : ${pose.sagas} saga(s), ${pose.lieux} lieu(x), ${pose.objets} objet(s), ${pose.pieces} pièce(s), ${pose.pistes} piste(s)`);
  sansErreur('au démarrage');

  // chaque lieu : à chaque heure, avec les options que les sagas lui donnent
  const lieux = await page.evaluate(id => { const I = window.ISNAD, D = I.D, M = I.maps, res = [];
    I.paquets[id].lieux.forEach(k => { const L = D.MAPS[k], G = D.GABARITS[L.gabarit], r = { id: k, gabarit: L.gabarit, variante: L.variante || '', nom: L.label, cartes: 0, coupes: [], pistes: {}, theme: D.gabarit(k).theme, dehors: !!D.gabarit(k).dehors, taille: '' };
      D.TIMES.map(t => ({ time: t })).concat([{}]).forEach(o => { const m = M.build(k, o); r.cartes++; r.taille = m.w + '×' + m.h; if (m.id !== k) r.coupes.push('identifiant ' + m.id); if (!M.relie(m)) r.coupes.push(JSON.stringify(o)); r.pistes[m.env.music] = 1;
        G.spots.forEach(s => { if (!m.spots[s]) r.coupes.push('lieu nommé ' + s + ' absent'); }); });
      r.pistes = Object.keys(r.pistes); r.attendue = L.piste || G.piste; res.push(r); });
    return res; }, P.id);
  lieux.forEach(l => { if (l.coupes.length) ko(`INACCESSIBLE lieu ${l.id} : ${l.coupes.join(', ')}`); else if (!l.pistes.includes(l.attendue)) ko(`ÉCART lieu ${l.id} : piste ${l.pistes.join('/')} au lieu de ${l.attendue}`);
    else ok(`lieu ${l.id} « ${l.nom} » (${l.gabarit}${l.variante ? ', ' + l.variante : ''}, ${l.taille}) : ${l.cartes} cartes bâties, tous les lieux nommés se rejoignent · piste ${l.pistes.join(', ')} · thème ${l.theme}${l.dehors ? ' · on y bâtit' : ''}`); });
  // et les lieux du jeu de base ? le même contrôle, pour savoir ce que vaut chaque gabarit
  const coupesBase = await page.evaluate(() => { const I = window.ISNAD, bad = []; Object.keys(I.D.MAPS).filter(k => !I.D.MAPS[k].paquet).forEach(k => I.D.TIMES.map(t => ({ time: t })).concat([{}]).forEach(o => { if (!I.maps.relie(I.maps.build(k, o))) bad.push(k + JSON.stringify(o)); })); return bad; });
  if (coupesBase.length) ko(`ÉCART un lieu du jeu de base a un lieu nommé coupé des autres : ${coupesBase.join(', ')}`); else ok('lieux du jeu de base : tous les lieux nommés se rejoignent, à chaque heure');
  sansErreur('en bâtissant les lieux');

  // chaque piste : rendue hors ligne avec les timbres du jeu, elle doit sonner
  const pistes = await page.evaluate(async id => { const I = window.ISNAD, res = [];
    for (const n of I.paquets[id].pistes) { try { const buf = await I.audio.render(n, 6), d = buf.getChannelData(0); let pk = 0; for (let i = 0; i < d.length; i++) pk = Math.max(pk, Math.abs(d[i])); res.push({ n, db: pk > 0 ? 20 * Math.log10(pk) : -Infinity }); } catch (e) { res.push({ n, err: e.message }); } }
    return res; }, P.id);
  pistes.forEach(t => { if (t.err || !(t.db > -45)) ko(`ABSENT piste ${t.n} : ${t.err || 'muette'}`); else ok(`piste ${t.n} : elle sonne (crête ${t.db.toFixed(1)} dB)`); });
  await page.close();

  // chaque saga, jouée jusqu'au bout : en sautant d'objectif en objectif, à pied (vraies collisions), au doigt
  const jouer = (pg, sid, marche) => pg.evaluate(async ([sid, marche]) => {
    const I = window.ISNAD, W = I.world, log = I.debug.log = [], stats = [];
    I.debug.auto = true; I.debug.walk = marche === 'walk' ? true : marche === 'tap' ? 'tap' : false; I.speed = 40; I.audio.setOn(false);
    I.save.reset(); I.save.data.started = true; I.save.data.prologue = true;
    const orig = I.battle.start;
    I.battle.start = async function (o) { let tries = 0; const oc = I.script.card; I.script.card = async function (cls, html, a) { if (cls === 'defeat') tries++; return oc(cls, html, a); }; await orig(o); I.script.card = oc; stats.push({ g: o.group.join('+'), boss: !!o.boss, defaites: tries, tours: I.battle.last.turns }); };
    const pistesVues = {}, ol = W.loadMap; W.loadMap = function () { const r = ol.apply(this, arguments); pistesVues[W.map.id] = W.map.env.music; return r; };
    const fini = () => new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (!document.querySelector('#chain').hidden || !document.querySelector('#title').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 240000) { clearInterval(iv); res(false); } }, 100); });
    document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null; const t0 = performance.now();
    I.ui.startSaga(I.sagas[sid]); const ok = await fini();
    I.battle.start = orig; W.loadMap = ol;
    const sv = I.save.data;
    return { ok, s: (performance.now() - t0) / 1000, log, stats, pistesVues, ou: ok ? '' : `chapitre ${W.ch && W.ch.id}, objectif ${W.objIndex}, carte ${W.map && W.map.id}`,
      fait: !!(sv.sagas[sid] && sv.sagas[sid].done), lumieres: sv.lights, objets: sv.items, pieces: JSON.stringify([sv.gear, sv.equip]), savoirs: sv.codex.filter(c => c.indexOf(sid + '/') === 0).length, musique: I.audio.wantTrack };
  }, [sid, marche]);
  const MODES = [['auto', 'en sautant d’objectif en objectif'], ['walk', 'à pied, avec les vraies collisions'], ['tap', 'au doigt, par un chemin tracé']];
  for (const s of (P.sagas || [])) {
    let dernier = null;
    for (const [mode, dit] of MODES) {
      page = await mkPage(); const j = await jouer(page, s.id, mode); dernier = mode === 'auto' ? j : dernier;
      const mauvais = j.log.filter(l => /BLOQUÉ|INACCESSIBLE|ABSENT|CACHÉ|INVISIBLE|MUSIQUE|ERR /.test(l));
      if (!j.ok) ko(`BLOQUÉ saga ${s.id} (${mode}) — ${j.ou}`);
      else if (mauvais.length) mauvais.slice(0, 6).forEach(l => ko(`${l}   [saga ${s.id}, ${mode}]`));
      else if (!j.fait) ko(`ÉCART saga ${s.id} (${mode}) : revenue à la Chaîne sans être marquée achevée`);
      else ok(`saga ${s.id} jouée ${dit} : ${j.s.toFixed(1)} s, ${j.stats.length} combat(s), ${j.stats.reduce((a, x) => a + x.defaites, 0)} défaite(s), ${j.savoirs} savoir(s), Lumière ${j.lumieres.join('+') || 'aucune'}`);
      sansErreur(`saga ${s.id}, ${mode}`);
      if (mode === 'auto') { // ce que la partie a gardé du paquet
        Object.keys(P.objets || {}).forEach(k => { if (JSON.stringify(s).includes('"' + k + '"')) { if (!(j.objets[k] > 0)) ko(`ABSENT objet ${k} : donné par la saga ${s.id}, il n'est pas dans la besace`); else ok(`objet ${k} : dans la besace après la saga (×${j.objets[k]})`); } });
        Object.keys(P.equipement || {}).forEach(k => { if (JSON.stringify(s).includes('"' + k + '"')) { if (!j.pieces.includes('"' + k + '"')) ko(`ABSENT pièce ${k} : placée par la saga ${s.id}, elle n'est ni portée ni en réserve`); else ok(`pièce ${k} : trouvée dans la saga, portée ou en réserve`); } });
        Object.keys(P.lieux || {}).forEach(k => { const L = P.lieux[k]; if (L.piste && j.pistesVues[k] !== undefined && j.pistesVues[k] !== L.piste && j.pistesVues[k] !== 'nuit') ko(`MUSIQUE lieu ${k} : piste ${j.pistesVues[k]} au lieu de ${L.piste}`); });
      }
      if (mode !== 'auto') await page.close();
      else { // la boutique et l'équipement, sur la page où la saga vient d'être jouée
        const etal = await page.evaluate(([sid, etals, pieces]) => { const I = window.ISNAD, W = I.world, D = I.D, Gr = I.gear, res = [];
          W.saga = I.sagas[sid]; W.roster = {};
          Object.keys(etals).forEach(m => etals[m].filter(id => pieces.includes(id)).forEach(id => { const r = { lieu: m, id, prix: Gr.prix(id), enVente: (D.GEAR_SHOPS[m] || []).includes(id) };
            const h = Object.keys(W.saga.heroes).map(k => W.hero(k)).find(x => Gr.can(x.def, id)); r.qui = h ? h.def.name : null;
            if (h) { // on mesure depuis une main vide, puis on rend au héros ce qu'il portait
              const sl = Gr.slotOf(id), portait = Gr.of(h)[sl]; Gr.put(h, sl, null); const a = Gr.mods(h); Gr.add(id, 1); r.mis = Gr.put(h, sl, id); const b = Gr.mods(h);
              r.effet = Object.keys(b).filter(k => b[k] !== a[k]).map(k => k + ' ' + (b[k] - a[k] > 0 ? '+' : '') + (b[k] - a[k]) + ' %').join(', '); r.icone = !!Gr.iconURL(id);
              Gr.put(h, sl, null); Gr.add(id, -1); if (portait) Gr.put(h, sl, portait); }
            res.push(r); }));
          return res; }, [s.id, P.etals || {}, Object.keys(P.equipement || {})]);
        etal.forEach(e => { if (!e.enVente) ko(`ABSENT pièce ${e.id} : pas à l'étal de ${e.lieu}`); else if (e.qui && !e.mis) ko(`ÉCART pièce ${e.id} : ${e.qui} ne peut pas la mettre`); else if (e.qui && !e.icone) ko(`INVISIBLE pièce ${e.id} : le moteur ne lui dessine pas d'icône`);
          else ok(`pièce ${e.id} : à l'étal de ${e.lieu}, ${e.prix} dirhams${e.qui ? ` · ${e.qui} la porte (${e.effet || 'aucun effet chiffré'})` : ' · aucun héros de cette saga ne la porte'}`); });
        sansErreur('à l’étal'); await page.close();
      }
    }
  }

  // chaque lieu du paquet, pour le voir : une capture du lieu, une de sa carte à la halte — où ses lieux portent les noms qu'il déclare
  // (on y entre comme on reprend une partie : par un point de reprise posé dans ce lieu, au premier chapitre de la première
  // saga du paquet — ou du jeu de base s'il n'en a pas —, sans ouverture, les ennemis visibles tenus pour vaincus)
  page = await mkPage({ width: 1280, height: 720 });
  for (const k of Object.keys(P.lieux || {})) {
    await page.evaluate(async ([sid, k]) => { const I = window.ISNAD, W = I.world, ch = I.sagas[sid].chapters[0]; I.save.reset(); I.save.data.started = true; I.debug.auto = false; I.speed = 40; I.audio.setOn(false);
      document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null;
      await W.startChapter(sid, 0, { saga: sid, ci: 0, obj: 0, map: k, opts: { time: 'day' }, pos: I.D.MAPS[k].spots[0], party: ch.party.slice(), npcs: {}, foes: (ch.foes || []).map(f => f.id), chests: [], flags: {} }); I.speed = 1; },
      [(P.sagas && P.sagas[0] && P.sagas[0].id) || 'abubakr', k]);
    await page.waitForTimeout(1300); await page.screenshot({ path: path.join(out, 'lieu-' + k + '.png') });
    const vus = await page.evaluate(() => { window.ISNAD.ui.pause('carte'); return Array.from(document.querySelectorAll('#menu .lieu')).map(e => e.textContent).sort(); });
    await page.waitForTimeout(500); await page.screenshot({ path: path.join(out, 'carte-' + k + '.png') });
    const L = P.lieux[k], attendus = D.GABARITS[L.gabarit].spots.map(s => (L.noms && L.noms[s] !== undefined ? L.noms[s] : D.LIEUX[s])).filter(Boolean).sort();
    if (JSON.stringify(vus) !== JSON.stringify(attendus)) ko(`ÉCART carte du lieu ${k} : lieux affichés « ${vus.join(', ')} », attendus « ${attendus.join(', ')} »`);
    else ok(`carte du lieu ${k} à la halte : ${vus.length} lieux nommés${L.noms ? ', dont ceux que le paquet renomme (' + Object.keys(L.noms).map(s => s + ' → ' + (L.noms[s] === null ? 'non affiché' : '« ' + L.noms[s] + ' »')).join(', ') + ')' : ''}`);
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  }
  sansErreur('en visitant les lieux'); await page.close();

  // un paquet fautif est refusé par le jeu, qui continue : cinq essais, puis un chapitre du jeu de base
  page = await mkPage();
  const refus = await page.evaluate(P => { const I = window.ISNAD, D = I.D, t = () => JSON.stringify([Object.keys(D.MAPS), Object.keys(D.GEAR), Object.keys(D.ITEMS), D.GEAR_SHOPS, D.TRACKS, D.LIVRES, Object.keys(I.sagas), I.sagaList.length, Object.keys(I.music)]), avant = t(), n0 = I.refuses.length;
    const c = () => JSON.parse(JSON.stringify(P)), neuf = (id, f) => { const p = c(); p.id = id; (p.sagas || []).forEach((s, i) => { s.id = id + '_s' + i; }); ['lieux', 'objets', 'equipement', 'pistes'].forEach(k => { delete p[k]; }); delete p.etals; delete p.livres; f(p); return p; };
    const essais = [['le même paquet, une seconde fois', c()], ['un moteur trop récent', Object.assign(c(), { id: 'trop_recent', moteur: 99 })], ['un lieu du jeu de base redéclaré', { id: 'intrus', version: 1, moteur: 1, lieux: { medine: { gabarit: 'ville', nom: 'Autre' } } }],
      ['une saga qui ne passe pas les règles', neuf('fautif', p => { p.sagas = [{ id: 'fautif_s0', order: 9, livre: 2, chapters: [] }]; })], ['autre chose qu’un paquet', 'un texte']];
    const res = essais.map(([quoi, p]) => { let r, jet = null; try { r = I.registerPack(p); } catch (e) { jet = e.message; } return { quoi, r, jet }; });
    return { res, intact: t() === avant, refuses: I.refuses.length - n0, premier: (I.refuses[n0] || {}).refus }; }, P);
  refus.res.forEach(x => { if (x.jet) ko(`ÉCART ${x.quoi} : le jeu a levé une erreur (${x.jet})`); else if (x.r !== false) ko(`ÉCART ${x.quoi} : le jeu l'a accepté`); });
  if (!refus.intact) ko('ÉCART un paquet refusé a laissé une trace dans le jeu');
  if (refus.res.every(x => x.r === false && !x.jet) && refus.intact) ok(`${refus.res.length} paquets fautifs refusés par le jeu sans laisser de trace (${refus.res.map(x => x.quoi).join(' ; ')})`);
  const attendues = errors.filter(e => /refusé/.test(e)).length; if (attendues !== refus.res.length) ko(`ÉCART ${refus.res.length} refus attendus sur la page Diagnostic, ${attendues} signalés`); errors = errors.filter(e => !/refusé/.test(e));
  const apres = await page.evaluate(async () => { const I = window.ISNAD, W = I.world, log = I.debug.log = []; I.debug.auto = true; I.speed = 40; I.audio.setOn(false); I.save.reset(); I.save.data.started = true;
    document.querySelectorAll('.screen').forEach(e => { e.hidden = true; }); W.roster = {}; W.saga = null; W.startChapter('idris', 0);
    const ok = await new Promise(res => { const t0 = Date.now(), iv = setInterval(() => { if (!document.querySelector('#chain').hidden) { clearInterval(iv); res(true); } else if (Date.now() - t0 > 120000) { clearInterval(iv); res(false); } }, 100); });
    return { ok, log, diag: I.ui.diagnostic().replace(/<[^>]+>/g, ' ').match(/Contenu[^·]*·[^·]*·?[^N]*/)[0].trim().slice(0, 260) }; });
  if (!apres.ok) ko('BLOQUÉ après les refus, le prologue ne se joue plus'); else ok('après les refus, le jeu continue : le prologue se joue jusqu’à la Chaîne');
  console.log('    page Diagnostic — ' + apres.diag);
  sansErreur('après les refus'); await page.close();

  await browser.close();
  console.log(anomalies ? `✗ ${anomalies} anomalie(s)` : `✓ PAQUET ${P.id} : contrôlé, assemblé, joué — aucune anomalie (captures dans ${path.relative(process.cwd(), out)})`);
  process.exit(anomalies ? 1 : 0);
})();
