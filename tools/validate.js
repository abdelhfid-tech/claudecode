#!/usr/bin/env node
/* Valide un ou plusieurs fichiers de saga contre le schéma (src/core/defs.js).
   Usage : node tools/validate.js src/data/saga_xxx.js [...]   (sans argument : tous les src/data/saga_*.js) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const D = require('../src/core/defs.js');

let files = process.argv.slice(2);
if (!files.length) {
  const dir = path.join(__dirname, '../src/data');
  files = fs.readdirSync(dir).filter(f => /^saga_.*\.js$/.test(f)).map(f => path.join(dir, f));
}

let totalErr = 0;
for (const file of files) {
  const errs = [];
  const warn = [];
  const sagas = [];
  const ctx = { ISNAD: { registerSaga: s => sagas.push(s) }, console };
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
  const W0 = `saga ${s.id || '?'}`;
  ['id', 'name', 'epithet', 'arabic', 'years', 'light', 'lightName', 'tagline'].forEach(k => req(s, k, 'string', W0));
  req(s, 'order', 'number', W0);
  if (s.light && !D.ELEMENTS[s.light]) E.push(`${W0}: light « ${s.light} » inconnue`);
  req(s, 'heroes', 'object', W0); req(s, 'enemies', 'object', W0);
  req(s, 'codex', 'array', W0); req(s, 'chapters', 'array', W0);
  req(s, 'intro', 'array', W0); req(s, 'outro', 'array', W0);
  const heroes = s.heroes || {}, enemies = s.enemies || {};
  const codexIds = new Set((s.codex || []).map(c => c.id));

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
    if (req(h, 'look', 'object', w)) ['robe', 'head'].forEach(k => req(h.look, k, 'string', w + '.look'));
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

  for (const [id, e] of Object.entries(enemies)) {
    const w = `ennemi ${id}`;
    req(e, 'name', 'string', w);
    if (!D.ART.includes(e.art)) E.push(`${w}: art « ${e.art} » invalide (${D.ART.join('|')})`);
    if (!D.TIERS.includes(e.tier)) E.push(`${w}: tier « ${e.tier} » invalide`);
    if (typeof e.lvl !== 'number' || e.lvl < 1 || e.lvl > 12) E.push(`${w}: lvl 1–12`);
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
        else if (n.look.kind && !D.NPC_KINDS.includes(n.look.kind)) E.push(`${wn}: look.kind « ${n.look.kind} » invalide`);
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
      else if (!D.ITEMS[x.item]) E.push(`${w}/coffre ${i}: objet « ${x.item} » inconnu`);
    });

    // Vérification des scripts, en suivant la carte courante.
    const state = { map: c.map };
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
          case 'give': if (!D.ITEMS[o[1]]) E.push(`${wo}: objet « ${o[1]} » inconnu (${Object.keys(D.ITEMS).join('|')})`); break;
          case 'join': case 'leave': if (!heroes[o[1]]) E.push(`${wo}: héros « ${o[1]} » inconnu`); break;
          case 'codex': if (!codexIds.has(o[1])) E.push(`${wo}: entrée de codex « ${o[1]} » inconnue`); break;
          case 'if': checkOps(o[2], wo + '.then'); if (o[3]) checkOps(o[3], wo + '.else'); break;
          case 'pray': if (o[1] !== undefined && !D.PRAYERS[o[1]]) E.push(`${wo}: pray « ${o[1]} » invalide (${Object.keys(D.PRAYERS).join('|')})`); break;
          case 'pillar': if (!D.PILLARS[o[1]]) E.push(`${wo}: pilier « ${o[1]} » invalide (${Object.keys(D.PILLARS).join('|')})`); if (typeof o[2] !== 'number' || Math.abs(o[2]) > 2 || !o[2]) E.push(`${wo}: pillar delta ±1 ou ±2`); break;
          case 'mus': if (!D.TRACKS.includes(o[1])) E.push(`${wo}: piste « ${o[1]} » inconnue (${D.TRACKS.join('|')})`); break;
          case 'parley': {
            const P = o[1] || {};
            ['with', 'title', 'intro'].forEach(k => { if (typeof P[k] !== 'string') E.push(`${wo}: parley.${k} manquant`); });
            if (typeof P.goal !== 'number') E.push(`${wo}: parley.goal manquant`);
            if (!Array.isArray(P.rounds) || P.rounds.length < 3 || P.rounds.length > 5) { E.push(`${wo}: parley.rounds de 3 à 5 manches`); break; }
            let max = 0, maxFree = 0, min = 0;
            P.rounds.forEach((r, ri) => {
              if (typeof r.say !== 'string') E.push(`${wo}: manche ${ri} sans « say »`);
              if (!Array.isArray(r.opts) || r.opts.length < 2 || r.opts.length > 4) { E.push(`${wo}: manche ${ri} : 2 à 4 options`); return; }
              let m = -9, mf = -9, mn = 9;
              r.opts.forEach((x, xi) => {
                if (typeof x.t !== 'string' || typeof x.r !== 'string') E.push(`${wo}: manche ${ri} option ${xi} : « t » et « r » (réplique) requis`);
                if (typeof x.v !== 'number' || x.v < -2 || x.v > 3) E.push(`${wo}: manche ${ri} option ${xi} : v entre -2 et 3`);
                if (!D.ELEMENTS[x.el] || x.el === 'fer') E.push(`${wo}: manche ${ri} option ${xi} : el doit être une Lumière`);
                if (x.need !== undefined && !codexIds.has(x.need)) E.push(`${wo}: manche ${ri} option ${xi} : need « ${x.need} » absent du codex`);
                m = Math.max(m, x.v); if (x.need === undefined) mf = Math.max(mf, x.v); mn = Math.min(mn, x.v);
              });
              if (mf === -9) E.push(`${wo}: manche ${ri} : au moins une option sans « need »`);
              max += m; maxFree += Math.max(mf, -2); min += mn;
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
    if (!Array.isArray(c.objectives) || !c.objectives.length) E.push(`${w}: objectives[] manquant`);
    (c.objectives || []).forEach((o, i) => {
      const wo = `${w}.obj${i}`;
      const kinds = ['goto', 'talk', 'foe', 'auto'].filter(k => o[k] !== undefined);
      if (kinds.length !== 1) E.push(`${wo}: exactement un parmi goto|talk|foe|auto`);
      if (!o.auto && typeof o.text !== 'string') E.push(`${wo}: « text » manquant`);
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
