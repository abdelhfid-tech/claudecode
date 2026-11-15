#!/usr/bin/env node
/* Valide un ou plusieurs fichiers de saga contre le schéma (src/core/defs.js).
   Usage : node tools/validate.js src/data/saga_xxx.js [...]   (sans argument : tous les src/data/saga_*.js)
   Le contenu commun (src/data/coeur.js, « commun: true ») se valide de la même façon. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const D = require('../src/core/defs.js');

let files = process.argv.slice(2);
if (!files.length) {
  const dir = path.join(__dirname, '../src/data');
  files = fs.readdirSync(dir).filter(f => /^saga_.*\.js$/.test(f)).map(f => path.join(dir, f));
}

// savoirs d'une autre saga (« saga/id ») : vérifiés dans les autres fichiers de données
const autres = {}, communs = {}; let autresLus = false;
function lireAutres() {
  if (autresLus) return; autresLus = true; const dir = path.join(__dirname, '../src/data');
  for (const f of fs.readdirSync(dir).filter(f => /\.js$/.test(f))) { const got = [], c = { ISNAD: { registerSaga: s => got.push(s), registerMusic() {} }, console }; c.window = c; c.globalThis = c;
    try { vm.runInNewContext(fs.readFileSync(path.join(dir, f), 'utf8'), c); } catch (e) { /* signalé ailleurs */ }
    got.forEach(s => { autres[s.id] = new Set((s.codex || []).map(x => x.id)); if (s.commun) Object.assign(communs, s.enemies || {}); }); }
}
function savoirConnu(ref) { lireAutres(); const [sid, id] = ref.split('/'); return !!(autres[sid] && autres[sid].has(id)); }
// égrégores communs à toutes les sagas : maux du cœur, idées noires
function ennemisCommuns() { lireAutres(); return communs; }

let totalErr = 0;
// l'équipement (D.GEAR) : chaque pièce a un type, un rang, un nom, une description sobre ; aucun mot qui en ferait une relique
{ const E = [], STATS = ['atk', 'mag', 'def', 'spd', 'hp', 'sp'], TRAITS = ['perce', 'vif', 'choc', 'parade', 'ferme'], INTERDIT = /allah|dieu|proph|bén[ie]|sacr|saint|relique|talisman|amulette|miracl|\bor\b|doré|soie/i;
  Object.keys(D.GEAR).forEach(id => { const g = D.GEAR[id], T = D.GEAR_TYPES[g.t];
    if (!T) { E.push(`${id}: type « ${g.t} » inconnu`); return; }
    if (!D.SLOTS[T.slot]) E.push(`${id}: emplacement « ${T.slot} » inconnu`);
    if (!(Number.isInteger(g.r) && g.r >= 0 && g.r < D.GEAR_PRIX.length)) E.push(`${id}: rang invalide`);
    if (typeof g.name !== 'string' || typeof g.desc !== 'string') E.push(`${id}: nom ou description manquant`);
    else if (INTERDIT.test(g.name + ' ' + g.desc)) E.push(`${id}: un objet ne reçoit ni nom divin, ni vertu, ni or, ni soie (exigences 8, 15, 16)`);
    if (D.ITEMS[id]) E.push(`${id}: même identifiant qu'un objet de la besace`);
    STATS.forEach(k => { if (g[k] !== undefined && !(typeof g[k] === 'number' && Math.abs(g[k]) <= 25)) E.push(`${id}: ${k} hors bornes (±25 %)`); });
    TRAITS.forEach(k => { if (g[k] !== undefined && !(g[k] > 0 && g[k] <= 0.6)) E.push(`${id}: ${k} hors bornes (0 à 0,6)`); });
    if (!STATS.some(k => g[k]) && !TRAITS.some(k => g[k]) && !g.prime) E.push(`${id}: pièce sans effet`);
    (g.roles || T.roles).forEach(r => { if (!D.ROLES[r]) E.push(`${id}: rôle « ${r} » inconnu`); });
    if (g.port && !D.PORTES.includes(g.port)) E.push(`${id}: port « ${g.port} » inconnu`);
    if (g.tete && !D.COIFFES.includes(g.tete)) E.push(`${id}: tete « ${g.tete} » inconnue`);
    if (g.corps && !D.ARMURES.includes(g.corps)) E.push(`${id}: corps « ${g.corps} » inconnu`);
    if (!Array.isArray(g.c) || g.c.length !== 2 || g.c.some(c => !/^#[0-9a-f]{6}$/i.test(c))) E.push(`${id}: c attend deux couleurs #rrggbb`); });
  Object.keys(D.GEAR_TYPES).forEach(t => { const T = D.GEAR_TYPES[t]; if (T.port && !D.PORTES.includes(T.port)) E.push(`type ${t}: port inconnu`); if (T.anim && !['slash', 'thrust', 'arrow', 'smash'].includes(T.anim)) E.push(`type ${t}: anim inconnue`); });
  Object.keys(D.GEAR_SHOPS).forEach(m => { if (!D.MAPS[m] || !D.MAPS[m].spots.includes('comptoir')) E.push(`boutique « ${m} » : carte sans comptoir`); D.GEAR_SHOPS[m].forEach(id => { if (!D.GEAR[id]) E.push(`boutique ${m}: pièce « ${id} » inconnue`); }); });
  Object.keys(D.ROLES).forEach(r => Object.keys(D.SLOTS).forEach(s => { if (!Object.keys(D.GEAR).some(id => D.GEAR_TYPES[D.GEAR[id].t].slot === s && (D.GEAR[id].roles || D.GEAR_TYPES[D.GEAR[id].t].roles).includes(r))) E.push(`aucune pièce pour le rôle ${r} à l'emplacement ${s}`); }));
  if (E.length) { console.log(`✗ src/core/defs.js — équipement\n   ` + E.join('\n   ')); totalErr += E.length; } }
for (const file of files) {
  const errs = [];
  const warn = [];
  const sagas = [];
  const ctx = { ISNAD: { registerSaga: s => sagas.push(s), registerMusic() {} }, console };
  ctx.window = ctx; ctx.globalThis = ctx;
  try {
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  } catch (e) {
    console.log(`✗ ${file}\n   Erreur de syntaxe/exécution : ${e.message}`);
    totalErr++;
    continue;
  }
  if (!sagas.length) errs.push('aucun appel à ISNAD.registerSaga');
  for (const s of sagas) checkSaga(s, errs, warn);
  if (errs.length) {
    totalErr += errs.length;
    console.log(`✗ ${file} — ${errs.length} erreur(s)`);
    errs.forEach(e => console.log('   - ' + e));
  } else {
    const st = stats(sagas);
    console.log(`✓ ${file} — ${st}`);
  }
  warn.forEach(w => console.log('   ! ' + w));
}
process.exit(totalErr ? 1 : 0);

function stats(sagas) {
  let ch = 0, ops = 0, bat = 0, cho = 0, par = 0, pry = 0;
  const walk = list => (list || []).forEach(o => {
    ops++;
    if (o[0] === 'battle') bat++;
    if (o[0] === 'parley') { par++; walk(o[1].win); walk(o[1].lose); }
    if (o[0] === 'pray') pry++;
    if (o[0] === 'choice') { cho++; o[2].forEach(c => walk(c.r)); }
    if (o[0] === 'ask') o[2].forEach(c => walk(c.r));
    if (o[0] === 'if') { walk(o[2]); walk(o[3]); }
  });
  for (const s of sagas) {
    if (s.commun) return `contenu commun : ${Object.keys(s.enemies || {}).length} égrégores, ${(s.codex || []).length} entrées du Recueil, ${Object.keys(s.oeuvres || {}).length} œuvres, ${Object.keys(s.lames || {}).length} lames, ${Object.keys(s.animaux || {}).length} compagnons de lumière`;
    walk(s.intro); walk(s.outro);
    for (const c of s.chapters) {
      ch++; walk(c.intro); walk(c.outro);
      (c.objectives || []).forEach(o => walk(o.then));
      (c.npcs || []).forEach(n => walk(n.talk));
      bat += (c.foes || []).length;
    }
  }
  return `${ch} chapitres, ${ops} opérations, ${bat} combats, ${cho} choix, ${par} pourparlers, ${pry} prières`;
}

function checkSaga(s, E, W) {
  const req = (o, k, t, where) => {
    if (o[k] === undefined || o[k] === null) { E.push(`${where}: champ « ${k} » manquant`); return false; }
    if (t === 'array' ? !Array.isArray(o[k]) : typeof o[k] !== t) { E.push(`${where}: « ${k} » doit être ${t}`); return false; }
    return true;
  };
  const W0 = `saga ${s.id || '?'}`, commun = !!s.commun;
  (commun ? ['id', 'name'] : ['id', 'name', 'epithet', 'arabic', 'years', 'light', 'lightName', 'tagline']).forEach(k => req(s, k, 'string', W0));
  if (!commun) req(s, 'order', 'number', W0);
  if (s.light && !D.ELEMENTS[s.light]) E.push(`${W0}: light « ${s.light} » inconnue`);
  req(s, 'heroes', 'object', W0); req(s, 'enemies', 'object', W0);
  req(s, 'codex', 'array', W0); req(s, 'chapters', 'array', W0);
  if (!commun) { req(s, 'intro', 'array', W0); req(s, 'outro', 'array', W0); }
  const heroes = s.heroes || {}, propres = s.enemies || {}, enemies = Object.assign({}, commun ? {} : ennemisCommuns(), propres);
  Object.keys(propres).forEach(k => { if (!commun && ennemisCommuns()[k]) E.push(`ennemi ${k}: ce nom est déjà celui d'un égrégore commun (src/data/coeur.js)`); });
  const codexIds = new Set((s.codex || []).map(c => c.id));

  // tenue d'un personnage : coiffe, manteau, motif, attributs portés
  const checkLook = (l, where) => {
    if (!l || typeof l !== 'object') return;
    if (l.coiffe !== undefined && !D.COIFFES.includes(l.coiffe)) E.push(`${where}: look.coiffe « ${l.coiffe} » invalide (${D.COIFFES.join('|')})`);
    if (l.manteau !== undefined && !D.MANTEAUX.includes(l.manteau)) E.push(`${where}: look.manteau « ${l.manteau} » invalide (${D.MANTEAUX.join('|')})`);
    if (l.motif !== undefined && !D.MOTIFS.includes(l.motif)) E.push(`${where}: look.motif « ${l.motif} » invalide (${D.MOTIFS.join('|')})`);
    if (l.armure !== undefined && !D.ARMURES.includes(l.armure)) E.push(`${where}: look.armure « ${l.armure} » invalide (${D.ARMURES.join('|')})`);
    if (l.item !== undefined && l.item !== null) [].concat(l.item).forEach(it => { if (!D.PORTES.includes(it)) E.push(`${where}: look.item « ${it} » invalide (${D.PORTES.join('|')})`); });
    ['echarpe', 'court', 'cuirasse', 'chale'].forEach(k => { if (l[k] !== undefined && typeof l[k] !== 'boolean') E.push(`${where}: look.${k} vaut true ou false`); });
    ['robe', 'head', 'cloak', 'aura', 'trim', 'legs'].forEach(k => { if (l[k] !== undefined && !/^#[0-9a-fA-F]{6}$/.test(l[k])) E.push(`${where}: look.${k} doit être une couleur #rrggbb`); });
  };
  const checkSkill = (k, where, isHero) => {
    if (!k || typeof k !== 'object') { E.push(`${where}: compétence invalide`); return; }
    if (typeof k.name !== 'string') E.push(`${where}: compétence sans « name »`);
    if (isHero) {
      if (typeof k.id !== 'string') E.push(`${where}: compétence sans « id »`);
      if (typeof k.desc !== 'string') E.push(`${where}/${k.id}: « desc » manquant`);
    }
    if (!D.TARGETS.includes(k.target)) E.push(`${where}/${k.name}: target « ${k.target} » invalide (${D.TARGETS.join('|')})`);
    if (k.pow !== undefined) {
      if (typeof k.pow !== 'number' || k.pow <= 0 || k.pow > 4) E.push(`${where}/${k.name}: pow hors bornes (0–4)`);
      if (!D.ELEMENTS[k.el]) E.push(`${where}/${k.name}: el « ${k.el} » invalide`);
    }
    if (k.anim !== undefined && !D.ANIMS.includes(k.anim)) E.push(`${where}/${k.name}: anim « ${k.anim} » invalide (${D.ANIMS.join('|')})`);
    if (k.hits !== undefined && (k.hits < 1 || k.hits > 5)) E.push(`${where}/${k.name}: hits 1–5`);
    if (k.pow === undefined && k.heal === undefined && !k.fx && !k.revive && k.sp === undefined) E.push(`${where}/${k.name}: compétence sans effet`);
    (k.fx || []).forEach(f => {
      if (!D.FX.includes(f.st)) E.push(`${where}/${k.name}: fx.st « ${f.st} » invalide (${D.FX.join('|')})`);
      if (['atk', 'mag', 'def', 'spd'].includes(f.st) && f.v !== 1 && f.v !== -1) E.push(`${where}/${k.name}: fx ${f.st} exige v:1 ou v:-1`);
    });
  };

  for (const [id, h] of Object.entries(heroes)) {
    const w = `héros ${id}`;
    req(h, 'name', 'string', w); req(h, 'arabic', 'string', w);
    if (!D.ROLES[h.role]) E.push(`${w}: role « ${h.role} » invalide (${Object.keys(D.ROLES).join('|')})`);
    if (!D.ELEMENTS[h.el]) E.push(`${w}: el « ${h.el} » invalide`);
    if (req(h, 'look', 'object', w)) { ['robe', 'head'].forEach(k => req(h.look, k, 'string', w + '.look')); checkLook(h.look, w); }
    if (req(h, 'skills', 'array', w)) {
      if (h.skills.length < 3) E.push(`${w}: au moins 3 compétences`);
      const ids = new Set();
      h.skills.forEach(k => {
        checkSkill(k, w, true);
        if (typeof k.lvl !== 'number') E.push(`${w}/${k.id}: « lvl » manquant`);
        if (typeof k.cost !== 'number') E.push(`${w}/${k.id}: « cost » manquant`);
        if (ids.has(k.id)) E.push(`${w}: compétence en double ${k.id}`); ids.add(k.id);
      });
      if (!h.skills.some(k => k.lvl <= 1)) E.push(`${w}: aucune compétence au niveau 1`);
    }
    if (req(h, 'limit', 'object', w)) checkSkill(h.limit, w + '.limit', true);
  }

  for (const [id, e] of Object.entries(propres)) {
    const w = `ennemi ${id}`;
    if (e.vice !== undefined && (!commun || !D.VICES[e.vice] || e.vice !== id)) E.push(`${w}: « vice » réservé au contenu commun, et doit valoir l'identifiant d'un mal de D.VICES`);
    req(e, 'name', 'string', w);
    if (!D.ART.includes(e.art)) E.push(`${w}: art « ${e.art} » invalide (${D.ART.join('|')})`);
    if (!D.TIERS.includes(e.tier)) E.push(`${w}: tier « ${e.tier} » invalide`);
    if (typeof e.lvl !== 'number' || e.lvl < (commun ? 0 : 1) || e.lvl > 12) E.push(`${w}: lvl ${commun ? '0 (calé sur le groupe) à 12' : '1–12'}`);
    if (typeof e.hue !== 'number') E.push(`${w}: hue (0–360) manquant`);
    if (!Array.isArray(e.weak) || e.weak.length < 1) E.push(`${w}: weak[] manquant (au moins 1)`);
    (e.weak || []).concat(e.immune || []).forEach(x => { if (!D.ELEMENTS[x]) E.push(`${w}: élément « ${x} » invalide`); });
    if (typeof e.veils !== 'number' || e.veils < 1 || e.veils > 8) E.push(`${w}: veils 1–8`);
    (e.skills || []).forEach(k => checkSkill(k, w, false));
    (e.phases || []).forEach(p => {
      if (typeof p.at !== 'number' || p.at <= 0 || p.at >= 1) E.push(`${w}: phase.at doit être dans ]0,1[`);
      (p.addSkills || []).forEach(k => checkSkill(k, w + '.phase', false));
    });
    if (typeof e.desc !== 'string') E.push(`${w}: « desc » manquant`);
  }

  (s.codex || []).forEach(c => {
    const w = `codex ${c.id}`;
    ['id', 'title', 'text'].forEach(k => req(c, k, 'string', w));
    if (!D.CODEX_CATS.includes(c.cat)) E.push(`${w}: cat « ${c.cat} » invalide (${D.CODEX_CATS.join('|')})`);
  });

  if (commun) {
    // le cœur : chaque œuvre, chaque lame, chaque compagnon de lumière a son texte ; chaque mal a son égrégore
    const T = s.oeuvres || {}, L = s.lames || {}, A = s.animaux || {};
    D.OEUVRES.forEach(k => { const o = T[k]; if (!o) { E.push(`œuvre ${k}: texte manquant`); return; } ['name', 'court', 'glyph', 'desc'].forEach(x => req(o, x, 'string', `œuvre ${k}`)); if (k !== 'priere') { req(o, 'menu', 'string', `œuvre ${k}`); if (!Array.isArray(o.lignes) || !o.lignes.length || o.lignes.some(l => typeof l !== 'string')) E.push(`œuvre ${k}: « lignes » manquantes`); } });
    if (T.aumone && typeof T.aumone.prix !== 'number') E.push('œuvre aumone: « prix » manquant'); if (T.jeune && typeof T.jeune.fin !== 'string') E.push('œuvre jeune: « fin » manquant');
    Object.keys(T).forEach(k => { if (!D.OEUVRES.includes(k)) E.push(`œuvre ${k}: inconnue de D.OEUVRES`); });
    Object.keys(D.VICES).forEach(v => { const l = L[v]; if (!l) E.push(`lame ${v}: texte manquant`); else ['name', 'ar', 'couleur', 'texte'].forEach(x => req(l, x, 'string', `lame ${v}`)); if (!propres[v] || propres[v].vice !== v) E.push(`mal ${v}: égrégore manquant (enemies.${v} avec vice: '${v}')`); if (!D.OEUVRES.includes(D.VICES[v].oeuvre)) E.push(`mal ${v}: œuvre inconnue`); });
    D.ANIMAUX.forEach(a => { const x = A[a]; if (!x) E.push(`compagnon de lumière ${a}: texte manquant`); else ['name', 'ar', 'couleur', 'don', 'effet', 'vient', 'texte'].forEach(k => req(x, k, 'string', `compagnon de lumière ${a}`)); });
    if ((s.chapters || []).length) E.push(`${W0}: un contenu commun n'a pas de chapitres`);
    return;
  }

  const chIds = new Set();
  (s.chapters || []).forEach((c, ci) => {
    const w = `chapitre ${c.id || ci}`;
    ['id', 'title', 'sub', 'map', 'start'].forEach(k => req(c, k, 'string', w));
    if (chIds.has(c.id)) E.push(`${w}: id en double`); chIds.add(c.id);
    if (!D.MAPS[c.map]) { E.push(`${w}: carte « ${c.map} » inconnue`); return; }
    if (!D.MAPS[c.map].spots.includes(c.start)) E.push(`${w}: start « ${c.start} » absent de la carte ${c.map}`);
    if (c.opts && c.opts.time && !D.TIMES.includes(c.opts.time)) E.push(`${w}: opts.time invalide`);
    if (req(c, 'party', 'array', w)) {
      if (c.party.length < 1 || c.party.length > 3) E.push(`${w}: party de 1 à 3 héros`);
      c.party.forEach(p => { if (!heroes[p]) E.push(`${w}: héros « ${p} » inconnu dans party`); });
    }
    const npcIds = new Set(), foeIds = new Set();
    const npcMap = {};
    if (c.hajj !== undefined && c.hajj !== true) E.push(`${w}: « hajj » vaut true ou s'omet`);
    if (c.vice !== undefined && (!D.VICES[c.vice] || !c.after || !s.frame)) E.push(`${w}: « vice » annonce le mal du cœur d'une rencontre (chapitre « after » de l'histoire-cadre) et doit figurer dans D.VICES`);
    if (c.hajj && !s.veillees) E.push(`${w}: le pèlerinage n'est proposé que dans la fiction des veillées`);
    const checkAt = (at, mapId, where) => {
      const spot = Array.isArray(at) ? at[0] : at;
      if (!D.MAPS[mapId]) { E.push(`${where}: carte « ${mapId} » inconnue`); return; }
      if (!D.MAPS[mapId].spots.includes(spot)) E.push(`${where}: lieu « ${spot} » absent de la carte ${mapId} (${D.MAPS[mapId].spots.join(', ')})`);
      if (Array.isArray(at) && (typeof at[1] !== 'number' || typeof at[2] !== 'number')) E.push(`${where}: at doit être 'spot' ou ['spot', dx, dy]`);
    };
    (c.npcs || []).forEach(n => {
      const wn = `${w}/pnj ${n.id}`;
      req(n, 'id', 'string', wn); req(n, 'name', 'string', wn);
      if (npcIds.has(n.id)) E.push(`${wn}: id en double`); npcIds.add(n.id);
      npcMap[n.id] = n.map || c.map;
      checkAt(n.at, n.map || c.map, wn);
      if (!n.hero) {
        if (!n.look || typeof n.look !== 'object') E.push(`${wn}: « look » manquant (ou hero:'id')`);
        else { if (n.look.kind && !D.NPC_KINDS.includes(n.look.kind)) E.push(`${wn}: look.kind « ${n.look.kind} » invalide`); checkLook(n.look, wn); }
      } else if (!heroes[n.hero]) E.push(`${wn}: hero « ${n.hero} » inconnu`);
    });
    (c.foes || []).forEach(f => {
      const wf = `${w}/foe ${f.id}`;
      req(f, 'id', 'string', wf);
      if (foeIds.has(f.id)) E.push(`${wf}: id en double`); foeIds.add(f.id);
      checkAt(f.at, f.map || c.map, wf);
      if (!Array.isArray(f.group) || !f.group.length || f.group.length > 4) E.push(`${wf}: group de 1 à 4 ennemis`);
      (f.group || []).forEach(g => { if (!enemies[g]) E.push(`${wf}: ennemi « ${g} » inconnu`); });
      if (f.bg && !D.BATTLE_BG.includes(f.bg)) E.push(`${wf}: bg invalide`);
    });
    (c.chests || []).forEach((x, i) => {
      checkAt(x.at, x.map || c.map, `${w}/coffre ${i}`);
      if (x.codex !== undefined) { if (!codexIds.has(x.codex)) E.push(`${w}/coffre ${i}: codex « ${x.codex} » inconnu`); }
      else if (x.gear !== undefined) { if (!D.GEAR[x.gear]) E.push(`${w}/coffre ${i}: pièce d'équipement « ${x.gear} » inconnue`); if (x.item !== undefined) E.push(`${w}/coffre ${i}: « gear » ou « item », pas les deux`); }
      else if (!D.ITEMS[x.item]) E.push(`${w}/coffre ${i}: objet « ${x.item} » inconnu`);
    });

    // Vérification des scripts, en suivant la carte courante.
    const state = { map: c.map }; const sites = new Set();
    const checkOps = (ops, where) => {
      if (!Array.isArray(ops)) { E.push(`${where}: script doit être un tableau`); return; }
      ops.forEach((o, i) => {
        const wo = `${where}[${i}]`;
        if (!Array.isArray(o) || typeof o[0] !== 'string') { E.push(`${wo}: opération invalide`); return; }
        const def = D.OPS[o[0]];
        if (!def) { E.push(`${wo}: opération « ${o[0]} » inconnue`); return; }
        const n = o.length - 1;
        if (n < def[0] || n > def[1]) E.push(`${wo}: « ${o[0]} » attend ${def[0]}–${def[1]} argument(s), reçu ${n}`);
        switch (o[0]) {
          case 'say': if (typeof o[1] !== 'string' || typeof o[2] !== 'string') E.push(`${wo}: say(speaker, texte)`);
            else if (o[2].length > 330) W.push(`${wo}: réplique longue (${o[2].length} car.) — couper en deux`); break;
          case 'nar': if (typeof o[1] !== 'string') E.push(`${wo}: nar(texte)`);
            else if (o[1].length > 360) W.push(`${wo}: narration longue (${o[1].length} car.)`); break;
          case 'quote': if (typeof o[1] !== 'string' || typeof o[2] !== 'string') E.push(`${wo}: quote(texte, source)`); break;
          case 'choice': case 'ask': {
            if (typeof o[1] !== 'string' || !Array.isArray(o[2]) || o[2].length < 2 || o[2].length > 4) { E.push(`${wo}: ${o[0]}(prompt, [2–4 options])`); break; }
            if (o[0] === 'choice' && o[2].filter(c => c.ok === true).length !== 1) E.push(`${wo}: choice exige exactement une option ok:true`);
            o[2].forEach((c, j) => {
              if (typeof c.t !== 'string') E.push(`${wo}: option ${j} sans texte « t »`);
              if (o[0] === 'choice' && !c.ok && (!Array.isArray(c.r) || !c.r.length)) E.push(`${wo}: option fausse ${j} doit avoir une réponse r:[...] qui explique`);
              if (c.need !== undefined && (o[0] !== 'ask' || !codexIds.has(c.need))) E.push(`${wo}: option ${j} : need « ${c.need} » invalide (réservé à ask, id de codex)`);
              if (c.r) checkOps(c.r, `${wo}.opt${j}`);
            });
            break;
          }
          case 'vices': {
            const v = o[1] || {};
            if (!s.frame) E.push(`${wo}: les maux du cœur ne se dressent que dans l'histoire-cadre`);
            if (v.bg && !D.BATTLE_BG.includes(v.bg)) E.push(`${wo}: bg « ${v.bg} » invalide`);
            ['avant', 'aucun', 'tous', 'reste'].forEach(k => { if (v[k] !== undefined) checkOps(v[k], `${wo}.${k}`); });
            break;
          }
          case 'battle': {
            const b = o[1] || {};
            if (!Array.isArray(b.group) || !b.group.length || b.group.length > 4) E.push(`${wo}: battle.group de 1 à 4`);
            (b.group || []).forEach(g => { if (!enemies[g]) E.push(`${wo}: ennemi « ${g} » inconnu`); });
            if (b.bg && !D.BATTLE_BG.includes(b.bg)) E.push(`${wo}: bg « ${b.bg} » invalide`);
            (b.allies || []).forEach(al => { if (!al || typeof al.flag !== 'string' || typeof al.name !== 'string') E.push(`${wo}: battle.allies attend [{flag, name}]`); });
            break;
          }
          case 'map':
            if (!D.MAPS[o[1]]) E.push(`${wo}: carte « ${o[1]} » inconnue`);
            else { state.map = o[1]; checkAt(o[2], o[1], wo); }
            if (o[3] && o[3].time && !D.TIMES.includes(o[3].time)) E.push(`${wo}: time invalide`);
            break;
          case 'tp': case 'walk': {
            const who = o[1];
            if (who !== 'hero' && !npcIds.has(who)) E.push(`${wo}: « ${who} » n'est ni 'hero' ni un pnj du chapitre`);
            checkAt(o[2], who === 'hero' ? state.map : (npcMap[who] || state.map), wo);
            break;
          }
          case 'face': if (o[1] !== 'hero' && !npcIds.has(o[1])) E.push(`${wo}: pnj « ${o[1]} » inconnu`);
            if (!['up', 'down', 'left', 'right'].includes(o[2])) E.push(`${wo}: face dir up|down|left|right`); break;
          case 'show': case 'hide': if (!npcIds.has(o[1])) E.push(`${wo}: pnj « ${o[1]} » inconnu`); break;
          case 'fade': if (!['in', 'out'].includes(o[1])) E.push(`${wo}: fade in|out`); break;
          case 'sfx': if (!D.SFX.includes(o[1])) E.push(`${wo}: sfx « ${o[1]} » invalide (${D.SFX.join('|')})`); break;
          case 'amb': if (!D.AMB.includes(o[1])) E.push(`${wo}: amb « ${o[1]} » invalide (${D.AMB.join('|')})`); break;
          case 'give': if (!D.ITEMS[o[1]] && !D.GEAR[o[1]]) E.push(`${wo}: objet ou pièce d'équipement « ${o[1]} » inconnu (${Object.keys(D.ITEMS).join('|')}, ou une pièce de D.GEAR)`); break;
          case 'join': case 'leave': if (!heroes[o[1]]) E.push(`${wo}: héros « ${o[1]} » inconnu`); break;
          case 'codex': if (!codexIds.has(o[1])) E.push(`${wo}: entrée de codex « ${o[1]} » inconnue`); break;
          case 'if': checkOps(o[2], wo + '.then'); if (o[3]) checkOps(o[3], wo + '.else'); break;
          case 'emote': if (o[2] !== null && !D.POSES.includes(o[2])) E.push(`${wo}: pose « ${o[2]} » inconnue (${D.POSES.join('|')}, ou null pour la quitter)`); break;
          case 'pray': if (o[1] !== undefined && !D.PRAYERS[o[1]]) E.push(`${wo}: pray « ${o[1]} » invalide (${Object.keys(D.PRAYERS).join('|')})`); break;
          case 'pillar': if (!D.PILLARS[o[1]]) E.push(`${wo}: pilier « ${o[1]} » invalide (${Object.keys(D.PILLARS).join('|')})`); if (typeof o[2] !== 'number' || Math.abs(o[2]) > 2 || !o[2]) E.push(`${wo}: pillar delta ±1 ou ±2`); break;
          case 'mat': if (!D.MATS[o[1]]) E.push(`${wo}: matériau « ${o[1]} » inconnu (${Object.keys(D.MATS).join('|')})`); break;
          case 'site': { const st = o[1] || {}; ['id', 'name'].forEach(k => { if (typeof st[k] !== 'string') E.push(`${wo}: site.${k} manquant`); }); checkAt(st.at, state.map, wo); if (!st.need || Object.keys(st.need).some(k => !D.PIECES[k])) E.push(`${wo}: site.need doit lister des pièces connues`); Object.keys(st.give || {}).forEach(k => { if (!D.MATS[k]) E.push(`${wo}: site.give : matériau « ${k} » inconnu`); }); sites.add(st.id); break; }
          case 'lore': if (!D.LORE.includes(o[1])) E.push(`${wo}: savoir commun « ${o[1]} » inconnu (${D.LORE.join('|')})`); break;
          case 'mus': if (!D.TRACKS.includes(o[1])) E.push(`${wo}: piste « ${o[1]} » inconnue (${D.TRACKS.join('|')})`); break;
          case 'parley': {
            const P = o[1] || {};
            ['with', 'title', 'intro'].forEach(k => { if (typeof P[k] !== 'string') E.push(`${wo}: parley.${k} manquant`); });
            if (typeof P.goal !== 'number') E.push(`${wo}: parley.goal manquant`);
            if (!Array.isArray(P.rounds) || P.rounds.length < 3 || P.rounds.length > 5) { E.push(`${wo}: parley.rounds de 3 à 5 manches`); break; }
            let max = 0, maxFree = 0, min = 0;
            P.rounds.forEach((r, ri) => {
              if (typeof r.say !== 'string') E.push(`${wo}: manche ${ri} sans « say »`);
              let noirV = 0;
              if (r.noir !== undefined) {
                const N = r.noir || {}; noirV = N.v === undefined ? 1 : N.v;
                ['name', 'intro'].forEach(k => { if (typeof N[k] !== 'string') E.push(`${wo}: manche ${ri} : noir.${k} manquant`); });
                ['say', 'after'].forEach(k => { if (N[k] !== undefined && typeof N[k] !== 'string') E.push(`${wo}: manche ${ri} : noir.${k} doit être une chaîne`); });
                if (!Array.isArray(N.group) || !N.group.length || N.group.length > 3) E.push(`${wo}: manche ${ri} : noir.group de 1 à 3`);
                (N.group || []).forEach(g => { if (!enemies[g]) E.push(`${wo}: manche ${ri} : idée noire « ${g} » inconnue`); else if (enemies[g].vice || enemies[g].tier === 'boss') E.push(`${wo}: manche ${ri} : une idée noire n'est ni une idole ni un mal du cœur`); });
                if (typeof noirV !== 'number' || noirV < 1 || noirV > 2) E.push(`${wo}: manche ${ri} : noir.v vaut 1 ou 2`);
                if (N.bg && !D.BATTLE_BG.includes(N.bg)) E.push(`${wo}: manche ${ri} : noir.bg invalide`);
              }
              if (!Array.isArray(r.opts) || r.opts.length < 2 || r.opts.length > 4) { E.push(`${wo}: manche ${ri} : 2 à 4 options`); return; }
              let m = -9, mf = -9, mn = 9;
              r.opts.forEach((x, xi) => {
                if (typeof x.t !== 'string' || typeof x.r !== 'string') E.push(`${wo}: manche ${ri} option ${xi} : « t » et « r » (réplique) requis`);
                if (typeof x.v !== 'number' || x.v < -2 || x.v > 3) E.push(`${wo}: manche ${ri} option ${xi} : v entre -2 et 3`);
                if (!D.ELEMENTS[x.el] || x.el === 'fer') E.push(`${wo}: manche ${ri} option ${xi} : el doit être une Lumière`);
                if (x.need !== undefined && !(String(x.need).indexOf('/') > 0 ? savoirConnu(x.need) : codexIds.has(x.need))) E.push(`${wo}: manche ${ri} option ${xi} : need « ${x.need} » absent du codex`);
                m = Math.max(m, x.v); if (x.need === undefined) mf = Math.max(mf, x.v); mn = Math.min(mn, x.v);
              });
              if (mf === -9) E.push(`${wo}: manche ${ri} : au moins une option sans « need »`);
              max += m + noirV; maxFree += Math.max(mf, -2) + noirV; min += mn + noirV;
            });
            if (P.goal > max) E.push(`${wo}: parley.goal ${P.goal} inatteignable (max ${max})`);
            if (P.goal > maxFree + 1) W.push(`${wo}: parley gagnable seulement avec un savoir (max sans savoir ${maxFree}, +1 si prière)`);
            if (P.goal <= min) E.push(`${wo}: parley.goal ${P.goal} toujours atteint (min ${min})`);
            if (!Array.isArray(P.win) || !Array.isArray(P.lose)) E.push(`${wo}: parley.win et parley.lose (tableaux d'ops) requis`);
            else { const sm = state.map; checkOps(P.win, wo + '.win'); const m1 = state.map; state.map = sm; checkOps(P.lose, wo + '.lose'); if (state.map !== m1) E.push(`${wo}: win et lose doivent finir sur la même carte`); }
            break;
          }
          case 'light': if (!D.ELEMENTS[o[1]]) E.push(`${wo}: lumière « ${o[1]} » inconnue`); break;
        }
      });
    };
    if (c.intro) checkOps(c.intro, `${w}.intro`);
    if (c.enigme !== undefined) {
      const en = c.enigme, we = `${w}.enigme`;
      ['id', 'who', 'title', 'signe', 'mot'].forEach(k => req(en, k, 'string', we));
      if (!heroes[en.who] || !(c.party || []).includes(en.who)) E.push(`${we}: « who » doit être un héros du groupe de ce chapitre`);
      if (!s.frame) E.push(`${we}: une énigme ne touche qu'un personnage de fiction (histoire-cadre ou veillées), jamais un Compagnon`);
      if (!D.OEUVRES.includes(en.cure) || en.cure === 'hajj') E.push(`${we}: cure « ${en.cure} » doit être une œuvre (${D.OEUVRES.filter(k => k !== 'hajj').join('|')})`);
      if (!D.MAPS[c.map].spots.includes('priere')) E.push(`${we}: la carte ${c.map} n'a pas de natte où accomplir l'œuvre`);
      { const save = state.map; if (en.intro) checkOps(en.intro, `${we}.intro`); if (en.solved) checkOps(en.solved, `${we}.solved`); state.map = save; }
    }
    if (!Array.isArray(c.objectives) || !c.objectives.length) E.push(`${w}: objectives[] manquant`);
    (c.objectives || []).forEach((o, i) => {
      const wo = `${w}.obj${i}`;
      const kinds = ['goto', 'talk', 'foe', 'auto', 'build'].filter(k => o[k] !== undefined);
      if (kinds.length !== 1) E.push(`${wo}: exactement un parmi goto|talk|foe|auto|build`);
      if (o.build !== undefined) { const bd = o.build; if (bd.site !== undefined) { if (!sites.has(bd.site)) E.push(`${wo}: site « ${bd.site} » non ouvert par un ['site', …] auparavant`); } else if (!D.PIECES[bd.piece] || typeof bd.n !== 'number') E.push(`${wo}: build attend { piece, n } ou { site }`); }
      if (!o.auto && typeof o.text !== 'string') E.push(`${wo}: « text » manquant`);
      if (o.hint !== undefined && typeof o.hint !== 'string') E.push(`${wo}: « hint » doit être une chaîne`);
      if (o.goto !== undefined) checkAt(o.goto, state.map, wo);
      if (o.talk !== undefined) {
        if (!npcIds.has(o.talk)) E.push(`${wo}: pnj « ${o.talk} » inconnu`);
        else if (npcMap[o.talk] !== state.map) E.push(`${wo}: le pnj « ${o.talk} » est sur la carte ${npcMap[o.talk]} mais le héros est sur ${state.map} à ce moment`);
      }
      if (o.foe !== undefined) {
        const f = (c.foes || []).find(f => f.id === o.foe);
        if (!f) E.push(`${wo}: foe « ${o.foe} » inconnu`);
        else if ((f.map || c.map) !== state.map) E.push(`${wo}: le foe « ${o.foe} » est sur ${f.map || c.map} mais le héros est sur ${state.map}`);
      }
      if (o.then) checkOps(o.then, `${wo}.then`);
    });
    if (c.outro) checkOps(c.outro, `${w}.outro`);
    (c.npcs || []).forEach(n => { if (n.talk) { const save = state.map; checkOps(n.talk, `${w}/pnj ${n.id}.talk`); state.map = save; } });
  });
  // intro/outro de saga : pas de carte (cartons narratifs uniquement)
  const flat = ops => (ops || []).forEach((o, i) => {
    if (!Array.isArray(o) || !['nar', 'quote', 'title', 'say', 'wait', 'sfx', 'amb', 'codex', 'light', 'flash', 'fade', 'tint', 'mus', 'pillar'].includes(o[0]))
      E.push(`${W0}.intro/outro[${i}]: seules nar|quote|title|say|wait|sfx|amb|codex|light|flash|fade|tint|mus|pillar sont permises ici`);
    if (o[0] === 'codex' && !codexIds.has(o[1])) E.push(`${W0}.intro/outro[${i}]: codex « ${o[1]} » inconnu`);
  });
  flat(s.intro); flat(s.outro);
  if ((s.chapters || []).length < 3) W.push(`${W0}: moins de 3 chapitres`);
}
