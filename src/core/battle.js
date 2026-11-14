/* ISNAD — combat : ordre des tours visible (CTB), voiles et faiblesses, Niyya (élan), Sakîna (ultime). */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script, $ = I.$;
  const B = I.battle = { active: false };
  const TIER = { minion: { hp: 0.66, atk: 0.8, def: 0.8, spd: 0.95, xp: 1 }, elite: { hp: 2.4, atk: 1.0, def: 1.0, spd: 1.0, xp: 3.2 }, boss: { hp: 6.4, atk: 1.15, def: 1.05, spd: 1.04, xp: 7 } };
  const base = L => ({ hp: 70 + 26 * L, sp: 14 + 4 * L, atk: 9 + 3 * L, def: 7 + 2.2 * L, spd: 10 + 0.6 * L });

  I.calc = {
    hero(def, lvl) { const r = D.ROLES[def.role], b = base(lvl); return { hp: Math.round(b.hp * r.hp), sp: Math.round(b.sp * r.sp), atk: b.atk * r.atk, mag: b.atk * r.mag, def: b.def * r.def, spd: b.spd * r.spd }; },
    enemy(def, nHeroes, nFoes) {
      const t0 = TIER[def.tier], early = def.tier === 'boss' && def.lvl <= 4, t = early ? Object.assign({}, t0, { hp: t0.hp * 0.75, atk: t0.atk * 0.9 }) : t0, b = base(def.lvl), ps = nHeroes >= 3 ? 1 : nHeroes === 2 ? 0.72 : 0.42, crowd = nFoes >= 3 ? 0.85 : 1;
      return { hp: Math.round(b.hp * t.hp * ps * crowd), atk: b.atk * t.atk * (nHeroes === 1 ? 0.72 : nHeroes === 2 ? 0.9 : 1), mag: b.atk * t.atk * (nHeroes === 1 ? 0.72 : nHeroes === 2 ? 0.9 : 1), def: b.def * t.def, spd: b.spd * t.spd };
    },
    xpNeed: l => 40 + 40 * l,
    xpOf: def => Math.round((10 + 7 * def.lvl) * TIER[def.tier].xp)
  };

  const FER = { id: '_fer', name: 'Frapper', target: 'foe', el: 'fer', pow: 1.0, anim: 'slash', basic: true };
  const lightOf = h => ({ id: '_lum', name: 'Éclairer', target: 'foe', el: h.def.el, pow: 0.9, anim: 'light', basic: true });
  const ASSAUT = { name: 'Assaut', target: 'foe', el: 'fer', pow: 1.0, anim: 'dark', w: 3 };
  const STN = { atk: 'Force', mag: 'Esprit', def: 'Garde', spd: 'Élan', stun: 'Étourdi', doute: 'Doute', waswas: 'Waswâs', regen: 'Régén.', garde: 'En garde', taunt: 'Cible' };

  let C = null; // contexte du combat en cours

  /* ================= décor ================= */
  const SKY = { desert: ['#150c30', '#5c2756', '#e08a4a'], ville: ['#0c0e2c', '#35285c', '#c8785a'], camp: ['#080a20', '#281e4c', '#9a4a48'], romaine: ['#0e1232', '#383876', '#d8a070'], palais: ['#120a26', '#48205c', '#c89040'], mer: ['#051028', '#123c66', '#5fb4cc'], cite: ['#04030d', '#180e3c', '#7a2cff'], noos: ['#02021a', '#0a0d36', '#30209a'] };
  function paintBg(kind, hue) {
    const cv = G.mk(G.PW, G.PH), c = cv.getContext('2d'), sky = SKY[kind] || SKY.noos, H0 = 100, r = I.rng(I.hash(kind + hue));
    const g = c.createLinearGradient(0, 0, 0, H0); g.addColorStop(0, sky[0]); g.addColorStop(0.6, sky[1]); g.addColorStop(1, sky[2]); c.fillStyle = g; c.fillRect(0, 0, G.PW, H0);
    for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.7})`; c.fillRect(Math.floor(r() * G.PW), Math.floor(r() * 62), 1, 1); }
    // astre
    const ax = kind === 'cite' ? 300 : 250, ay = kind === 'noos' ? 44 : 64; const ag = c.createRadialGradient(ax, ay, 2, ax, ay, 60); ag.addColorStop(0, 'rgba(255,240,200,.95)'); ag.addColorStop(0.18, `hsla(${hue},90%,75%,.5)`); ag.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = ag; c.fillRect(ax - 60, ay - 60, 120, 120);
    c.strokeStyle = `hsla(${hue},100%,75%,.35)`; c.lineWidth = 1; for (let i = 1; i < 4; i++) { c.beginPath(); c.ellipse(ax, ay, 18 * i, 6 * i, -0.3, 0, 6.3); c.stroke(); }
    const sil = '#0b0818', sil2 = '#16102c';
    c.fillStyle = sil2;
    if (kind === 'desert' || kind === 'camp') { c.beginPath(); c.moveTo(0, H0); for (let x = 0; x <= G.PW; x += 4) c.lineTo(x, H0 - 14 - Math.sin(x / 46) * 9 - Math.sin(x / 17) * 3); c.lineTo(G.PW, H0); c.fill(); }
    c.fillStyle = sil;
    if (kind === 'desert') { c.beginPath(); c.moveTo(0, H0); for (let x = 0; x <= G.PW; x += 4) c.lineTo(x, H0 - 6 - Math.sin(x / 30 + 2) * 6); c.lineTo(G.PW, H0); c.fill(); }
    else if (kind === 'camp') { for (let x = 10; x < G.PW; x += 34) { const h = 14 + r() * 10; c.beginPath(); c.moveTo(x, H0); c.lineTo(x + 14, H0 - h); c.lineTo(x + 28, H0); c.fill(); if (r() < 0.5) { c.fillRect(x + 30, H0 - 30, 1, 30); c.fillRect(x + 31, H0 - 30, 7, 5); } } }
    else if (kind === 'ville') { for (let x = 0; x < G.PW;) { const w = 18 + r() * 26, h = 10 + r() * 18; c.fillRect(x, H0 - h, w, h); if (r() < 0.4) { c.fillStyle = '#ffc878'; c.fillRect(x + 4, H0 - h + 4, 2, 3); c.fillStyle = sil; } if (r() < 0.35) { c.fillRect(x + w + 3, H0 - 34, 2, 34); for (let k = 0; k < 6; k++) c.fillRect(x + w - 6 + k * 3, H0 - 36 + Math.abs(k - 2.5) * 2, 4, 2); } x += w + 6; } }
    else if (kind === 'romaine') { c.fillRect(40, H0 - 46, 150, 4); c.beginPath(); c.moveTo(36, H0 - 46); c.lineTo(115, H0 - 66); c.lineTo(194, H0 - 46); c.fill(); for (let x = 46; x < 190; x += 18) c.fillRect(x, H0 - 42, 6, 42); for (let x = 220; x < G.PW; x += 30) { c.fillRect(x, H0 - 30, 22, 30); c.fillStyle = sky[2]; c.beginPath(); c.arc(x + 11, H0 - 8, 6, Math.PI, 0); c.fillRect(x + 5, H0 - 8, 12, 8); c.fill(); c.fillStyle = sil; } }
    else if (kind === 'palais') { c.fillRect(0, H0 - 70, G.PW, 70); c.fillStyle = sky[1]; c.beginPath(); c.moveTo(130, H0); c.quadraticCurveTo(192, H0 - 150, 254, H0); c.fill(); c.fillStyle = sky[2]; c.globalAlpha = 0.5; c.beginPath(); c.moveTo(150, H0); c.quadraticCurveTo(192, H0 - 110, 234, H0); c.fill(); c.globalAlpha = 1; c.fillStyle = sil; for (let x = 20; x < 120; x += 30) { c.fillStyle = sky[1]; c.fillRect(x, H0 - 40, 12, 40); c.fillRect(G.PW - x - 12, H0 - 40, 12, 40); } }
    else if (kind === 'mer') { for (let k = 0; k < 2; k++) { const x = 60 + k * 190; c.fillRect(x, H0 - 60, 2, 60); c.beginPath(); c.moveTo(x - 18, H0 - 54); c.lineTo(x + 20, H0 - 54); c.lineTo(x + 16, H0 - 22); c.lineTo(x - 14, H0 - 22); c.fill(); c.beginPath(); c.moveTo(x - 34, H0 - 10); c.lineTo(x + 36, H0 - 10); c.lineTo(x + 26, H0); c.lineTo(x - 24, H0); c.fill(); } }
    else if (kind === 'cite') { for (let x = 0; x < G.PW;) { const w = 14 + r() * 22, h = 30 + r() * 70; c.fillStyle = sil; c.fillRect(x, H0 - h, w, h); for (let k = 0; k < h / 5; k++) if (r() < 0.5) { c.fillStyle = ['#39e6ff', '#ff4fd8', '#ffe08a'][Math.floor(r() * 3)]; c.fillRect(x + 2 + Math.floor(r() * (w - 4)), H0 - h + 3 + k * 5, 2, 1); } x += w + 2; } }
    else { c.strokeStyle = `hsla(${hue},100%,70%,.5)`; for (let i = 0; i < 9; i++) { const x = r() * G.PW, y = 20 + r() * 80, s = 4 + r() * 10; c.strokeRect(x, y, s, s * 0.6); } }
    // sol
    const gg = c.createLinearGradient(0, H0, 0, G.PH); gg.addColorStop(0, '#0b0820'); gg.addColorStop(1, '#05040f'); c.fillStyle = gg; c.fillRect(0, H0, G.PW, G.PH - H0);
    c.fillStyle = `hsla(${hue},100%,70%,.5)`; c.fillRect(0, H0, G.PW, 1);
    return cv;
  }
  function drawGrid(c, hue, t) {
    const H0 = 100, H = G.PH - H0;
    c.fillStyle = `hsla(${hue},100%,66%,.34)`;
    for (let i = 0; i < 9; i++) { const f = ((i + (t * 0.35) % 1) / 9); const y = H0 + H * f * f; c.fillRect(0, Math.round(y), G.PW, 1); }
    c.strokeStyle = `hsla(${hue},100%,66%,.22)`; c.lineWidth = 1; c.beginPath();
    for (let i = -8; i <= 8; i++) { c.moveTo(192 + i * 10, H0); c.lineTo(192 + i * 70, G.PH); } c.stroke();
  }

  /* ================= mise en place ================= */
  const FOE_POS = { 1: [[112, 146]], 2: [[80, 126], [154, 150]], 3: [[62, 122], [140, 128], [100, 156]], 4: [[54, 120], [128, 116], [86, 154], [164, 152]] };
  const HERO_POS = [[270, 120], [306, 132], [342, 144]];
  function mkHero(id, i) {
    const h = I.world.hero(id), st = I.calc.hero(h.def, h.lvl);
    return { side: 'hero', id, name: h.def.name, def: h.def, ref: h, lvl: h.lvl, max: { hp: st.hp, sp: st.sp }, hp: Math.min(h.hp, st.hp), sp: Math.min(h.sp, st.sp), atk: st.atk, mag: st.mag, df: st.def, spd: st.spd,
      buffs: {}, st: {}, niyya: 1, sakina: h.sakina || 0, x: HERO_POS[i][0], y: HERO_POS[i][1], ox: 0, flash: 0, ct: 0, alive: h.hp > 0, sheet: G.charSheet(Object.assign({ kind: 'compagnon' }, h.def.look)), color: D.ELEMENTS[h.def.el].color };
  }
  function mkFoe(id, i, n, nH) {
    const def = I.world.saga.enemies[id], st = I.calc.enemy(def, nH, n), sc = def.scale || (def.tier === 'boss' ? 3 : def.tier === 'elite' ? 2 : 1);
    const pos = n === 1 && sc >= 3 ? [118, 156] : FOE_POS[n][i];
    return { side: 'foe', id, name: def.name, def, lvl: def.lvl, max: { hp: st.hp, sp: 0 }, hp: st.hp, sp: 0, atk: st.atk, mag: st.mag, df: st.def, spd: st.spd, buffs: {}, st: {}, veils: def.veils, veilsMax: def.veils, broken: false,
      known: {}, tried: {}, phase: 0, skills: (def.skills || []).slice(), x: pos[0], y: pos[1], ox: 0, flash: 0, ct: 0, alive: true, spr: G.enemy(def.art, def.hue, sc, 0), size: sc >= 3 ? 112 : sc === 2 ? 80 : 52, ph: Math.random() * 6, fade: 1 };
  }
  const eff = (e, k) => { const bv = e.buffs[k]; const v = k === 'df' ? e.df : e[k]; return v * (bv ? (bv.v > 0 ? 1.3 : 0.72) : 1); };
  const alive = side => C.all.filter(e => e.side === side && e.alive);

  B.start = async function (opts) {
    const W = I.world; let first = true;
    while (true) {
      const res = await run(opts, first); first = false;
      if (res === 'win') break;
      W.healAll(); W.party.forEach(id => { W.hero(id).sakina = 50; });
    }
  };

  async function run(opts, first) {
    const W = I.world, prev = I.scene, prevAmb = I.audio.ambName;
    const d0 = W.saga.enemies[opts.group[0]], hue = d0.hue;
    C = { opts, hue, bg: paintBg(opts.bg || 'noos', hue), all: [], t: 0, cursor: null, log: [], turn: 0 };
    W.party.forEach((id, i) => C.all.push(mkHero(id, i)));
    const nH = C.all.length; opts.group.forEach((id, i) => C.all.push(mkFoe(id, i, opts.group.length, nH)));
    C.all.forEach(e => { e.ct = 1000 / eff(e, 'spd') * (0.6 + Math.random() * 0.4) * (e.side === 'foe' ? 1.15 : 1); });
    if (first) { I.audio.sfx('glitch'); G.flash('#fff'); await S.fade('out', 220); }
    I.setScene(B.scene); B.active = true; G.clearParts(); G.amb = { kind: 'noos', rate: 5, hue, n: 0 };
    document.body.classList.add('in-battle'); $('#hud').hidden = true; $('#toasts').innerHTML = ''; $('#battle').hidden = false; refresh();
    const prevMus = I.audio.wantTrack; C.prevMus = prevMus;
    I.audio.amb('noos'); I.audio.music(opts.boss ? 'boss' : 'combat'); I.audio.beat(opts.boss ? 'malfuf' : (opts.bg === 'romaine' || opts.bg === 'palais') ? 'marche' : (opts.bg === 'cite' || opts.bg === 'noos') ? 'cyber' : 'ayyub');
    await S.fade('in', 260);
    // piliers de la Citadelle : ce qui a été bâti pèse dans le combat
    const P = W.pillars(); C.pJust = 1 - 0.03 * (P.justice || 0); C.pLien = 1 + 0.03 * (P.lien || 0);
    C.all.forEach(e => { if (e.side === 'hero') e.sakina = Math.min(100, e.sakina + 6 * (P.priere || 0)); else { e.def.weak.slice(0, Math.floor((P.savoir || 0) / 2)).forEach(w => { e.known[w] = true; }); } });
    refresh();
    if (first && opts.intro) await banner(I.esc(opts.intro), readTime(opts.intro), true, 'speech intro');
    else if (first) await banner(opts.boss ? `${d0.name} se dresse.` : 'Une emprise se referme…', 1100);
    for (const al of (opts.allies || [])) {
      if (!S.flags[al.flag]) continue;
      await banner(`<small>Renfort</small>${I.esc(al.name)}`, 1700, false, 'speech intro'); I.audio.sfx('roll'); await I.sleep(500);
      alive('foe').forEach(e => { if (!e.broken) { e.veils = Math.max(0, e.veils - 1); if (e.veils <= 0) { e.broken = true; e.ct += 400; floater(e, 'DÉVOILÉ', 'break'); } else floater(e, 'Voile ôté', 'info'); } e.hp = Math.max(1, Math.round(e.hp - e.max.hp * 0.08)); e.flash = 1; fx('light', e, '#ffe08a'); });
      refresh(); await I.sleep(700);
    }
    let result = null;
    while (!result) {
      // prochain acteur
      const act = C.all.filter(e => e.alive).sort((a, b) => a.ct - b.ct)[0]; const dt = act.ct; C.all.forEach(e => { if (e.alive) e.ct -= dt; });
      C.active = act; C.turn++; refresh();
      await takeTurn(act);
      act.ct = 1000 / eff(act, 'spd');
      C.active = null;
      if (!alive('foe').length) result = 'win'; else if (!alive('hero').length) result = 'lose';
    }
    B.last = { turns: C.turn, kos: C.kos || 0, minHp: C.minHp === undefined ? 1 : C.minHp, result };
    I.audio.stopBeat(); $('#battle .cmd').innerHTML = ''; C.cursor = null;
    if (result === 'win') { I.audio.afterJingle = C.prevMus || null; I.audio.music('victoire'); } else I.audio.music('deuil');
    if (result === 'win') await victory(); else await defeat();
    // retour
    C.all.filter(e => e.side === 'hero').forEach(e => { const h = e.ref, st = I.calc.hero(h.def, h.lvl); h.hp = Math.min(st.hp, Math.max(1, e.hp) + Math.round(st.hp * 0.35)); h.sp = Math.min(st.sp, e.sp + Math.round(st.sp * 0.35)); h.sakina = e.sakina; });
    await S.fade('out', 260);
    $('#battle').hidden = true; document.body.classList.remove('in-battle'); B.active = false; $('#floaters').innerHTML = '';
    I.setScene(prev); G.clearParts();
    if (prev === W) { const env = W.map.env; G.amb = { kind: env.particles, rate: env.rate, hue: env.hue, n: 0 }; $('#hud').hidden = false; }
    I.audio.amb(prevAmb || 'vent'); if (result === 'win') { if (!(I.audio.curTrack && I.audio.curTrack.name === 'victoire')) I.audio.music(C.prevMus || 'silence'); else I.audio.afterJingle = C.prevMus || null; }
    if (result === 'win') await S.fade('in', 260);
    C = null;
    return result;
  }

  /* ================= tour ================= */
  async function takeTurn(e) {
    // effets de début de tour
    if (e.st.garde) delete e.st.garde;
    if (e.st.regen) { const v = Math.round(e.max.hp * 0.08); heal(e, v); tick(e, 'regen'); }
    if (e.st.waswas) { const v = Math.max(1, Math.round(e.max.hp * (e.side === 'foe' ? 0.04 : 0.06))); e.hp = Math.max(e.side === 'hero' ? 1 : 0, e.hp - v); floater(e, v, 'dmg dot'); tick(e, 'waswas'); if (e.hp <= 0) { await kill(e); return; } }
    for (const k of ['atk', 'mag', 'df', 'spd']) if (e.buffs[k] && --e.buffs[k].t <= 0) delete e.buffs[k];
    if (e.st.taunt) tick(e, 'taunt');
    if (e.side === 'foe' && e.broken) { e.broken = false; e.veils = e.veilsMax; floater(e, 'Se revoile', 'info'); refresh(); await I.sleep(500); return; }
    if (e.st.stun) { delete e.st.stun; floater(e, 'Étourdi', 'info'); refresh(); await I.sleep(550); return; }
    if (e.side === 'hero') { e.niyya = Math.min(5, e.niyya + 1); e.sakina = Math.min(100, e.sakina + 4); refresh(); }
    const cmd = e.side === 'hero' ? (I.debug.auto ? autoCmd(e) : await playerCmd(e)) : foeCmd(e);
    if (e.st.doute) tick(e, 'doute');
    await perform(e, cmd);
    refresh();
  }
  function tick(e, k) { if (e.st[k] !== undefined && --e.st[k] <= 0) delete e.st[k]; }

  function foeCmd(e) {
    if (e.def.taunts && Math.random() < 0.16) banner(`« ${I.pick(e.def.taunts)} »`, 1500);
    let pool = [ASSAUT].concat(e.st.doute ? [] : e.skills);
    if (e.def.noBasic && pool.length > 1) pool = pool.slice(1);
    // évite de se soigner/renforcer en boucle
    pool = pool.filter(k => !(k.target === 'self' && !k.pow && e.lastSelf));
    let tot = 0; pool.forEach(k => tot += (k.w || 1)); let r = Math.random() * tot, sk = pool[0];
    for (const k of pool) { r -= (k.w || 1); if (r <= 0) { sk = k; break; } }
    e.lastSelf = sk.target === 'self' && !sk.pow;
    return { type: 'skill', skill: sk, targets: targetsFor(e, sk), boost: 0 };
  }
  function targetsFor(e, sk, chosen) {
    const foes = alive(e.side === 'hero' ? 'foe' : 'hero'), allies = alive(e.side);
    switch (sk.target) {
      case 'foes': return foes;
      case 'allies': return sk.revive ? C.all.filter(x => x.side === e.side) : allies;
      case 'self': return [e];
      case 'ally': return [chosen || allies.slice().sort((a, b) => a.hp / a.max.hp - b.hp / b.max.hp)[0]];
      default: { if (chosen) return [chosen]; const t = foes.find(f => f.st.taunt); return [t || I.pick(foes)]; }
    }
  }

  /* ----- commande automatique (tests) ----- */
  function autoCmd(h) {
    const skills = h.def.skills.filter(k => k.lvl <= h.lvl && k.cost <= h.sp && !h.st.doute), foes = alive('foe'), allies = alive('hero');
    const low = allies.slice().sort((a, b) => a.hp / a.max.hp - b.hp / b.max.hp)[0];
    const down = C.all.find(x => x.side === 'hero' && !x.alive);
    if (down) { const rv = skills.find(k => k.revive); if (rv) return { type: 'skill', skill: rv, targets: targetsFor(h, rv, down), boost: 0 }; if ((I.save.data.items.lait || 0) > 0) return { type: 'item', item: 'lait', targets: [down] }; }
    if (low.hp / low.max.hp < 0.45) { const hl = skills.find(k => k.heal); if (hl) return { type: 'skill', skill: hl, targets: targetsFor(h, hl, low), boost: Math.min(h.niyya, 1) }; if (low.hp / low.max.hp < 0.3) { const it = ['eau', 'dattes', 'pain', 'miel'].find(k => (I.save.data.items[k] || 0) > 0); if (it) return { type: 'item', item: it, targets: D.ITEMS[it].target === 'allies' ? allies : [low] }; } }
    const t = foes.slice().sort((a, b) => (b.broken ? 1 : 0) - (a.broken ? 1 : 0) || a.hp - b.hp)[0];
    if (h.sakina >= 100 && h.def.limit.pow && !(t.def.immune || []).includes(h.def.limit.el)) return { type: 'skill', skill: h.def.limit, limit: true, targets: targetsFor(h, h.def.limit, t), boost: 0 };
    const atks = skills.filter(k => k.pow).concat([FER, lightOf(h)]).filter(k => !(t.tried[k.el] && (t.def.immune || []).includes(k.el)));
    const score = k => (t.known[k.el] ? 3 : t.tried[k.el] ? 0 : 1.5) + k.pow * (k.hits || 1) * 0.5 + (t.broken ? k.pow : 0) - (k.basic ? 0.3 : 0);
    atks.sort((a, b) => score(b) - score(a));
    const sk = atks[0] || FER, boost = t.broken ? Math.min(3, h.niyya) : (t.known[sk.el] && sk.basic ? Math.min(2, h.niyya) : 0);
    return { type: 'skill', skill: sk, targets: targetsFor(h, sk, t), boost };
  }

  /* ----- commande du joueur ----- */
  function listMenu(box, title, items, o) {
    o = o || {};
    return new Promise(res => {
      box.innerHTML = ''; if (title) box.appendChild(I.el('div', 'mtitle', title));
      const list = I.el('div', 'mlist' + (o.cls ? ' ' + o.cls : '')); box.appendChild(list);
      const desc = I.el('div', 'mdesc'); if (o.desc) box.appendChild(desc);
      let idx = o.start || 0; const btns = [];
      const sel = i => { idx = (i + items.length) % items.length; btns.forEach((b, j) => b.classList.toggle('sel', j === idx)); if (o.desc) desc.innerHTML = items[idx].desc || ''; if (o.onSel) o.onSel(idx); btns[idx].scrollIntoView && btns[idx].scrollIntoView({ block: 'nearest' }); };
      const done = v => { I.input.pop(h); res(v); };
      items.forEach((it, i) => {
        const b = I.el('button', 'mi' + (it.disabled ? ' off' : '') + (it.cls ? ' ' + it.cls : ''), `<span>${it.label}</span>${it.sub ? `<small>${it.sub}</small>` : ''}`); b.type = 'button';
        b.onclick = ev => { ev.stopPropagation(); sel(i); if (!it.disabled) { I.audio.sfx('ok'); done(i); } else I.audio.sfx('dark'); };
        b.onmouseenter = () => sel(i); btns.push(b); list.appendChild(b);
      });
      if (o.back) { const bk = I.el('button', 'mback', '◂ Retour'); bk.type = 'button'; bk.onclick = ev => { ev.stopPropagation(); done(-1); }; box.appendChild(bk); }
      sel(idx);
      const h = I.input.push(a => {
        if (a === 'up' || (o.grid && a === 'left')) { sel(idx - 1); I.audio.sfx('move'); }
        else if (a === 'down' || (o.grid && a === 'right')) { sel(idx + 1); I.audio.sfx('move'); }
        else if ((a === 'left' || a === 'right') && o.onLR) o.onLR(a === 'left' ? -1 : 1);
        else if (a === 'ok') { if (!items[idx].disabled) { I.audio.sfx('ok'); done(idx); } else I.audio.sfx('dark'); }
        else if (a === 'cancel' && o.back) done(-1);
        return true;
      });
    });
  }
  B.listMenu = listMenu;

  function pickTarget(pool, label) {
    return new Promise(res => {
      const box = $('#battle .cmd'); box.innerHTML = `<div class="mtitle">${label}</div><div class="mhint">Choisis une cible · ◂ ▸ puis Valider</div>`;
      const bk = I.el('button', 'mback', '◂ Retour'); bk.type = 'button'; box.appendChild(bk);
      let idx = 0; const sel = i => { idx = (i + pool.length) % pool.length; C.cursor = pool[idx]; refresh(); bind(); };
      const done = v => { I.input.pop(h); C.cursor = null; C.pickCb = null; refresh(); res(v); };
      bk.onclick = ev => { ev.stopPropagation(); done(null); };
      const bind = () => { C.pickCb = e => { if (pool.includes(e)) { I.audio.sfx('ok'); done(e); } }; };
      sel(0);
      const h = I.input.push(a => { if (a === 'up' || a === 'left') { sel(idx - 1); I.audio.sfx('move'); } else if (a === 'down' || a === 'right') { sel(idx + 1); I.audio.sfx('move'); } else if (a === 'ok') { I.audio.sfx('ok'); done(pool[idx]); } else if (a === 'cancel') done(null); return true; });
    });
  }

  async function playerCmd(h) {
    const box = $('#battle .cmd'); let boost = 0, start = 0;
    const elc = el => `<i class="el" style="color:${D.ELEMENTS[el].color}">${D.ELEMENTS[el].glyph}</i>`;
    while (true) {
      const pips = () => { let s = ''; for (let i = 0; i < 5; i++) s += `<i class="pip${i < h.niyya - boost ? ' on' : i < h.niyya ? ' use' : ''}"></i>`; return s; };
      const title = () => `<b style="color:${h.color}">${h.name}</b><span class="niyya"><button type="button" class="nb" data-d="-1">−</button>Niyya ${pips()}<button type="button" class="nb" data-d="1">+</button>${boost ? `<em>élan ×${boost}</em>` : ''}</span>`;
      const setBoost = d => { const was = boost; boost = I.clamp(boost + d, 0, Math.min(3, h.niyya)); if (boost > was) { G.spawn({ x: h.x, y: h.y - 24, type: 'ring', r0: 6, r1: 24 + boost * 4, life: 0.4, size: 2, color: h.color }); for (let q = 0; q < 8; q++) G.spawn({ x: h.x + (Math.random() - 0.5) * 20, y: h.y, vy: -50 - Math.random() * 40, life: 0.6, size: 0.9, color: h.color, type: 'spark' }); } const t = box.querySelector('.mtitle'); if (t) { t.innerHTML = title(); wire(); } I.audio.sfx('move'); };
      const wire = () => box.querySelectorAll('.nb').forEach(b => b.onclick = ev => { ev.stopPropagation(); setBoost(+b.dataset.d); });
      const lum = lightOf(h);
      const items = [
        { label: `${elc('fer')} Frapper`, sub: boost ? `${1 + boost} coups` : 'Force' },
        { label: `${elc(lum.el)} Éclairer`, sub: D.ELEMENTS[lum.el].name },
        { label: '✦ Vertus', sub: `Souffle ${h.sp}`, disabled: !!h.st.doute },
        { label: '◍ Objets' },
        { label: '⛨ Garde', sub: '+ Niyya' }
      ];
      if (h.sakina >= 100) items.push({ label: `❂ ${h.def.limit.name}`, sub: 'Sakîna', cls: 'limit' });
      const p = listMenu(box, title(), items, { start, onLR: setBoost, cls: 'main' }); wire();
      const i = await p; start = i;
      if (i === 0 || i === 1) { const sk = i === 0 ? FER : lum; const t = await pickTarget(alive('foe'), sk.name); if (!t) continue; return { type: 'skill', skill: sk, targets: [t], boost }; }
      if (i === 2) {
        const sks = h.def.skills.filter(k => k.lvl <= h.lvl);
        const j = await listMenu(box, `<b>Vertus</b> <span class="niyya">Souffle ${h.sp}/${h.max.sp}${boost ? ` · <em>élan ×${boost}</em>` : ''}</span>`, sks.map(k => ({ label: `${k.pow ? elc(k.el) : k.heal ? '<i class="el" style="color:#7fd69a">✚</i>' : '<i class="el">◇</i>'} ${k.name}`, sub: `${k.cost}`, disabled: k.cost > h.sp, desc: I.esc(k.desc) })), { back: true, desc: true });
        if (j < 0) continue; const sk = sks[j]; const tg = await chooseTargets(h, sk); if (!tg) continue; return { type: 'skill', skill: sk, targets: tg, boost };
      }
      if (i === 3) {
        const inv = I.save.data.items, ids = Object.keys(D.ITEMS).filter(k => (inv[k] || 0) > 0);
        if (!ids.length) { banner('La besace est vide.', 900); continue; }
        const j = await listMenu(box, '<b>Objets</b>', ids.map(k => ({ label: D.ITEMS[k].name, sub: '×' + inv[k], desc: D.ITEMS[k].desc })), { back: true, desc: true });
        if (j < 0) continue; const it = D.ITEMS[ids[j]];
        let tg; if (it.target === 'allies') tg = alive('hero'); else { const pool = C.all.filter(e => e.side === 'hero' && (it.revive ? !e.alive : e.alive)); if (!pool.length) { banner('Personne n’en a besoin.', 900); continue; } const t = await pickTarget(pool, it.name); if (!t) continue; tg = [t]; }
        return { type: 'item', item: ids[j], targets: tg };
      }
      if (i === 4) return { type: 'guard' };
      if (i === 5) { const sk = h.def.limit; const tg = await chooseTargets(h, sk); if (!tg) continue; return { type: 'skill', skill: sk, targets: tg, boost: 0, limit: true }; }
    }
  }
  async function chooseTargets(h, sk) {
    if (sk.target === 'foe') { const t = await pickTarget(alive('foe'), sk.name); return t ? [t] : null; }
    if (sk.target === 'ally') { const pool = C.all.filter(e => e.side === 'hero' && (sk.revive ? true : e.alive)); const t = await pickTarget(pool, sk.name); return t ? [t] : null; }
    return targetsFor(h, sk);
  }

  /* ================= résolution ================= */
  async function perform(e, cmd) {
    $('#battle .cmd').innerHTML = '';
    if (cmd.type === 'guard') { e.st.garde = 1; e.niyya = Math.min(5, e.niyya + 1); e.sakina = Math.min(100, e.sakina + 8); fx('guard', e, e.color); floater(e, 'Garde', 'info'); I.audio.sfx('tek'); await I.sleep(420); return; }
    if (cmd.type === 'item') {
      const it = D.ITEMS[cmd.item]; I.save.data.items[cmd.item]--; await banner(it.name, 700);
      cmd.targets.forEach(t => { if (it.revive && !t.alive) { t.alive = true; t.hp = Math.round(t.max.hp * it.revive); floater(t, 'Relevé', 'heal'); } if (it.hp && t.alive) heal(t, Math.round(t.max.hp * it.hp)); if (it.sp) { t.sp = Math.min(t.max.sp, t.sp + Math.round(t.max.sp * it.sp)); floater(t, '+Souffle', 'heal'); } if (it.cleanse) cleanse(t); if (it.niyya) { t.niyya = Math.min(5, t.niyya + it.niyya); floater(t, '+Niyya', 'info'); } fx('heal', t, '#7fd69a'); });
      I.audio.sfx('heal'); await I.sleep(520); return;
    }
    const sk = cmd.skill, boost = cmd.boost || 0, hero = e.side === 'hero';
    if (hero) { if (sk.cost) e.sp = Math.max(0, e.sp - sk.cost); e.niyya -= boost; if (cmd.limit) e.sakina = 0; }
    if (!sk.basic || !hero) banner(sk.name, 800, false, cmd.limit ? 'limit' : hero ? '' : 'foe');
    if (cmd.limit) { G.flash(e.color); I.audio.sfx('roll'); await I.sleep(350); }
    const col = sk.el ? D.ELEMENTS[sk.el].color : (hero ? e.color : `hsl(${e.def.hue},90%,65%)`), dir = hero ? -1 : 1;
    // élan vers l'avant
    await tween(e, 'ox', dir * 14, 110);
    const hits = (sk.hits || 1) + (sk.basic && hero ? boost : 0), mult = sk.basic ? 1 : 1 + 0.5 * boost;
    let targets = cmd.targets.filter(t => t.alive || sk.revive);
    if (sk.pow) {
      for (let hI = 0; hI < hits; hI++) {
        targets = targets.filter(t => t.alive); if (!targets.length) break;
        for (const t of targets) strike(e, t, sk, mult, col);
        I.audio.sfx(sk.el === 'fer' ? (hero ? 'slash' : 'hit') : hero ? 'light' : 'dark');
        await I.sleep(hits > 1 ? 190 : 300);
      }
      for (const t of cmd.targets) if (t.alive && t.hp <= 0) await kill(t);
      for (const t of cmd.targets) if (t.side === 'foe' && t.alive) await checkPhase(t);
    } else { fx(sk.anim || (sk.heal ? 'heal' : 'glyph'), sk.target === 'self' ? e : targets[0] || e, col); I.audio.sfx(sk.heal ? 'heal' : hero ? 'light' : 'dark'); }
    if (sk.heal || sk.revive || sk.sp) {
      for (const t of targets) {
        if (sk.revive && !t.alive) { t.alive = true; t.hp = 1; t.st = {}; floater(t, 'Relevé', 'heal'); }
        if (!t.alive) continue;
        if (sk.heal) heal(t, Math.round(eff(e, 'mag') * sk.heal * 2.7 * (1 + 0.4 * boost)));
        if (sk.sp) { t.sp = Math.min(t.max.sp, t.sp + Math.round(t.max.sp * sk.sp)); floater(t, '+Souffle', 'heal'); }
        fx('heal', t, '#7fd69a');
      }
    }
    (sk.fx || []).forEach(f => {
      const tg = f.self ? [e] : targets.filter(t => t.alive);
      tg.forEach(t => applyFx(e, t, f, boost));
    });
    await I.sleep(240);
    await tween(e, 'ox', 0, 120);
  }

  function strike(a, t, sk, mult, col) {
    const el = sk.el, stat = el === 'fer' ? eff(a, 'atk') : eff(a, 'mag');
    const immune = t.side === 'foe' && (t.def.immune || []).includes(el), weak = t.side === 'foe' && t.def.weak.includes(el);
    if (t.side === 'foe') t.tried[el] = true;
    if (immune) { t.known[el] = 'x'; floater(t, 'Sans effet', 'info'); fx('guard', t, '#889'); return; }
    let d = stat * sk.pow * mult * 2.2 * (50 / (50 + eff(t, 'df'))) * (0.92 + Math.random() * 0.16);
    if (weak) d *= 1.3; if (t.broken) d *= 1.5; if (t.st.garde) d *= 0.5;
    d *= a.side === 'hero' ? (C.pLien || 1) : (C.pJust || 1);
    d = Math.max(1, Math.round(d));
    t.hp = Math.max(0, t.hp - d); t.flash = 1; t.shake = 0.25;
    floater(t, d, 'dmg' + (weak ? ' weak' : '') + (t.side === 'hero' ? ' hero' : ''));
    fx(sk.anim || (el === 'fer' ? 'slash' : 'light'), t, col);
    if (t.side === 'hero') { t.sakina = Math.min(100, t.sakina + d / t.max.hp * 70); G.shake(160); C.minHp = Math.min(C.minHp === undefined ? 1 : C.minHp, t.hp / t.max.hp); if (t.hp <= 0) C.kos = (C.kos || 0) + 1; }
    if (weak) {
      t.known[el] = true; if (a.side === 'hero') a.sakina = Math.min(100, a.sakina + 7);
      if (!t.broken) { t.veils--; if (t.veils <= 0) { t.broken = true; t.veils = 0; t.ct += 400; floater(t, 'DÉVOILÉ', 'break'); I.audio.sfx('break'); G.flash('#fff'); G.shake(380); if (a.side === 'hero') a.sakina = Math.min(100, a.sakina + 12); for (let i = 0; i < 26; i++) G.spawn({ x: t.x, y: t.y - t.size / 2, vx: (Math.random() - 0.5) * 240, vy: (Math.random() - 0.7) * 200, grav: 300, life: 0.9, size: 1.2, color: '#fff', type: 'spark' }); } }
    }
  }
  function heal(t, v) { if (!t.alive) return; t.hp = Math.min(t.max.hp, t.hp + v); floater(t, '+' + v, 'heal'); }
  function cleanse(t) { ['atk', 'mag', 'df', 'spd'].forEach(k => { if (t.buffs[k] && t.buffs[k].v < 0) delete t.buffs[k]; }); delete t.st.doute; delete t.st.waswas; delete t.st.stun; }
  function applyFx(a, t, f, boost) {
    if (f.chance !== undefined && Math.random() > f.chance * (t.def && t.def.tier === 'boss' && (f.st === 'stun' || f.st === 'doute') ? 0.5 : 1)) return;
    const turns = (f.turns || 3) + (a.side === 'hero' ? boost : 0);
    switch (f.st) {
      case 'atk': case 'mag': case 'def': case 'spd': { const k = f.st === 'def' ? 'df' : f.st; t.buffs[k] = { v: f.v, t: turns }; floater(t, `${STN[f.st]} ${f.v > 0 ? '▲' : '▼'}`, f.v > 0 ? 'buff' : 'debuff'); break; }
      case 'stun': if (t.side === 'foe' && t.def.tier === 'boss' && t.stunned) break; t.st.stun = 1; t.stunned = true; floater(t, 'Étourdi', 'debuff'); break;
      case 'doute': t.st.doute = f.turns || 2; floater(t, 'Doute', 'debuff'); break;
      case 'waswas': t.st.waswas = turns; floater(t, 'Waswâs', 'debuff'); break;
      case 'regen': t.st.regen = turns; floater(t, 'Régén.', 'buff'); break;
      case 'garde': t.st.garde = 1; floater(t, 'Garde', 'buff'); break;
      case 'reveal': if (t.side === 'foe') { t.def.weak.forEach(w => t.known[w] = true); (t.def.immune || []).forEach(w => t.known[w] = 'x'); floater(t, 'Failles révélées', 'info'); } break;
      case 'cleanse': cleanse(t); floater(t, 'Purifié', 'buff'); break;
      case 'dispel': ['atk', 'mag', 'df', 'spd'].forEach(k => { if (t.buffs[k] && t.buffs[k].v > 0) delete t.buffs[k]; }); delete t.st.regen; floater(t, 'Dissipé', 'debuff'); break;
      case 'veil': if (t.side === 'foe' && !t.broken) { t.veils = Math.max(0, t.veils + (f.v || -1)); if (t.veils <= 0) { t.broken = true; t.ct += 400; floater(t, 'DÉVOILÉ', 'break'); I.audio.sfx('break'); G.flash('#fff'); } } break;
      case 'niyya': t.niyya = I.clamp((t.niyya || 0) + (f.v || 1), 0, 5); if (t.side === 'hero') floater(t, '+Niyya', 'buff'); break;
      case 'sakina': if (t.side === 'hero') { t.sakina = I.clamp(t.sakina + (f.v || 20), 0, 100); floater(t, '+Sakîna', 'buff'); } break;
      case 'taunt': t.st.taunt = turns; floater(t, 'Fait front', 'buff'); break;
    }
  }
  async function kill(t) {
    if (!t.alive) return; t.alive = false; t.hp = 0; t.st = {}; t.buffs = {};
    if (t.side === 'foe') { I.audio.sfx('break'); for (let i = 0; i < 40; i++) G.spawn({ x: t.x + (Math.random() - 0.5) * t.size * 0.7, y: t.y - Math.random() * t.size, vx: (Math.random() - 0.5) * 40, vy: -20 - Math.random() * 60, life: 1.2 + Math.random(), size: 1 + Math.random(), color: `hsl(${t.def.hue},100%,75%)`, type: 'glyph' }); await tween(t, 'fade', 0, 500); }
    else { floater(t, 'Éprouvé', 'debuff'); I.audio.sfx('dark'); await I.sleep(300); }
  }
  async function checkPhase(t) {
    const ph = t.def.phases; if (!ph) return;
    while (t.phase < ph.length && t.alive && t.hp / t.max.hp <= ph[t.phase].at) {
      const p = ph[t.phase++]; G.shake(500); G.flash(`hsl(${t.def.hue},90%,60%)`); I.audio.sfx('dark');
      if (p.say) await banner(`<small>${I.esc(t.name)}</small>« ${I.esc(p.say)} »`, readTime(p.say), true, 'foe speech');
      (p.fx || []).forEach(f => applyFx(t, t, f, 0)); (p.addSkills || []).forEach(k => t.skills.push(k));
      t.broken = false; t.veils = t.veilsMax; refresh();
    }
  }

  /* ================= fins ================= */
  B.grantXP = function (xp) {
    const W = I.world, lines = [];
    W.party.forEach(id => { const h = W.hero(id); h.xp += xp; let up = false;
      while (h.xp >= I.calc.xpNeed(h.lvl) && h.lvl < 12) { h.xp -= I.calc.xpNeed(h.lvl); h.lvl++; up = true; h.def.skills.filter(k => k.lvl === h.lvl).forEach(k => lines.push(`<li><b>${h.def.name}</b> apprend <em>${k.name}</em></li>`)); }
      if (up) { lines.unshift(`<li><b>${h.def.name}</b> atteint le niveau <b>${h.lvl}</b></li>`); const st = I.calc.hero(h.def, h.lvl); h.hp = st.hp; h.sp = st.sp; } });
    W.persistHeroes(); return lines;
  };
  async function victory() {
    const W = I.world, sv = I.save.data; I.audio.sfx('roll');
    let xp = 0; C.all.filter(e => e.side === 'foe').forEach(e => { xp += I.calc.xpOf(e.def); const cid = 'foe:' + W.saga.id + ':' + e.id; if (!sv.codex.includes(cid)) sv.codex.push(cid); });
    const lines = [];
    C.all.filter(e => e.side === 'hero').forEach(e => {
      const h = e.ref; h.xp += xp; let up = false;
      while (h.xp >= I.calc.xpNeed(h.lvl) && h.lvl < 12) { h.xp -= I.calc.xpNeed(h.lvl); h.lvl++; up = true; h.def.skills.filter(k => k.lvl === h.lvl).forEach(k => lines.push(`<li><b>${h.def.name}</b> apprend <em>${k.name}</em></li>`)); }
      if (up) { lines.unshift(`<li><b>${h.def.name}</b> atteint le niveau <b>${h.lvl}</b></li>`); const st = I.calc.hero(h.def, h.lvl); e.max = { hp: st.hp, sp: st.sp }; e.hp = st.hp; e.sp = st.sp; }
    });
    let drop = '';
    if (C.opts.boss || Math.random() < 0.4) { const k = C.opts.boss ? I.pick(['musc', 'lait', 'eau']) : I.pick(['dattes', 'dattes', 'pain', 'eau', 'miel', 'siwak']); sv.items[k] = (sv.items[k] || 0) + 1; drop = `<li>Trouvé : <b>${D.ITEMS[k].name}</b></li>`; }
    W.persistHeroes();
    await S.card('victory', `<p class="small">${C.opts.boss ? 'L’idole se brise' : 'L’emprise est brisée'}</p><h1>Dévoilement</h1><ul><li>Sagesse acquise : <b>+${xp}</b></li>${lines.join('')}${drop}</ul><div class="hint">▼</div>`);
  }
  async function defeat() {
    I.audio.sfx('dark');
    await S.card('defeat', `<p class="small">Le groupe est éprouvé</p><h1>La chaîne ne rompt pas</h1><p>Ce qui fut transmis ne se perd pas. Reprends, le cœur affermi : la Sakîna descend sur ceux qui persévèrent.</p><div class="hint">Reprendre ▼</div>`);
  }

  /* ================= présentation ================= */
  function tween(e, k, to, ms) { const from = e[k], t0 = performance.now(); ms = ms / I.speed; return new Promise(res => { (function st() { const f = Math.min(1, (performance.now() - t0) / ms); e[k] = from + (to - from) * f; if (f < 1) requestAnimationFrame(st); else res(); })(); }); }
  function pos(e) { return { x: e.x + e.ox, y: e.y - (e.side === 'foe' ? e.size * 0.55 : 26) }; }
  function fx(kind, e, col) {
    const p = pos(e), x = p.x, y = p.y;
    switch (kind) {
      case 'slash': G.spawn({ x, y, type: 'arc', r0: 18, a0: -2.4, sweep: 2.6, life: 0.28, size: 2, color: col }); G.spawn({ x, y, type: 'arc', r0: 14, a0: 0.7, sweep: 2.4, life: 0.32, size: 1.5, color: '#fff' }); for (let i = 0; i < 10; i++) G.spawn({ x, y, vx: (Math.random() - 0.5) * 260, vy: (Math.random() - 0.5) * 200, life: 0.35, size: 0.9, color: col, type: 'spark' }); break;
      case 'light': G.spawn({ x, y: y + 22, type: 'pillar', w: 12, life: 0.5, color: col, a: 0.8 }); G.spawn({ x, y, type: 'ring', r0: 4, r1: 30, life: 0.45, size: 2, color: col }); G.spawn({ x, y, type: 'glow', size: 5, life: 0.4, color: col }); break;
      case 'burst': for (let i = 0; i < 26; i++) { const a = Math.random() * 6.28, v = 80 + Math.random() * 200; G.spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5, size: 1.1, color: i % 3 ? col : '#fff', type: 'spark' }); } G.spawn({ x, y, type: 'ring', r0: 6, r1: 44, life: 0.4, size: 3, color: col }); break;
      case 'wave': for (let i = 0; i < 3; i++) setTimeout(() => G.spawn({ x, y, type: 'ring', r0: 4, r1: 52, life: 0.6, size: 2, color: col }), i * 110); break;
      case 'pillar': G.spawn({ x, y: y + 26, type: 'pillar', w: 26, life: 0.8, color: col, a: 0.95 }); G.spawn({ x, y: y + 26, type: 'pillar', w: 8, life: 0.9, color: '#fff', a: 0.9 }); for (let i = 0; i < 20; i++) G.spawn({ x: x + (Math.random() - 0.5) * 30, y: y + 20, vy: -60 - Math.random() * 140, life: 0.8, size: 1, color: col, type: 'spark' }); G.shake(260); break;
      case 'glyph': for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28; G.spawn({ x: x + Math.cos(a) * 20, y: y + Math.sin(a) * 12, vx: -Math.sin(a) * 30, vy: -18, life: 0.8, size: 1.6, color: col, type: 'glyph' }); } G.spawn({ x, y, type: 'ring', r0: 22, r1: 8, life: 0.6, size: 1.5, color: col }); break;
      case 'heal': for (let i = 0; i < 16; i++) G.spawn({ x: x + (Math.random() - 0.5) * 24, y: y + 18, vy: -30 - Math.random() * 40, life: 0.9, size: 1, color: i % 2 ? col : '#eaffea', type: 'mote' }); G.spawn({ x, y, type: 'glow', size: 4, life: 0.6, color: col }); break;
      case 'guard': G.spawn({ x, y, type: 'ring', r0: 18, r1: 22, life: 0.5, size: 2.5, color: col }); G.spawn({ x, y, type: 'ring', r0: 12, r1: 15, life: 0.4, size: 1.5, color: '#fff' }); break;
      case 'dark': for (let i = 0; i < 14; i++) { const a = Math.random() * 6.28, d = 34 + Math.random() * 20; G.spawn({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: -Math.cos(a) * 130, vy: -Math.sin(a) * 130, life: 0.3, size: 1.4, color: col, type: 'spark' }); } G.spawn({ x, y, type: 'ring', r0: 34, r1: 4, life: 0.32, size: 2.5, color: col }); break;
    }
  }
  function floater(e, text, cls) {
    const p = pos(e), f = I.el('div', 'fl ' + (cls || ''), String(text));
    f.style.left = ((p.x + (Math.random() - 0.5) * 14) / G.PW * 100) + '%'; f.style.top = ((p.y - 6 - (e._fl = ((e._fl || 0) + 1) % 3) * 9) / G.PH * 100) + '%';
    $('#floaters').appendChild(f); setTimeout(() => f.remove(), 1100);
  }
  const readTime = txt => I.clamp(1800 + String(txt).length * 48, 2400, 7500);
  let bannerT = null;
  function banner(html, ms, wait, cls) {
    const b = $('#battle .banner'); b.className = 'banner ' + (cls || ''); b.innerHTML = html; b.hidden = false; clearTimeout(bannerT);
    const hide = () => { b.hidden = true; };
    if (!wait) { bannerT = setTimeout(hide, ms / Math.min(I.speed, 3)); return Promise.resolve(); }
    return Promise.race([I.sleep(ms), I.sleep(450).then(() => I.input.wait(['ok', 'cancel']))]).then(hide);
  }

  function refresh() {
    if (!C) return;
    // ordre des tours (simulation)
    const sim = C.all.filter(e => e.alive).map(e => ({ e, ct: e === C.active ? -1 : e.ct })); const ord = [];
    for (let i = 0; i < 8 && sim.length; i++) { sim.sort((a, b) => a.ct - b.ct); const s = sim[0]; ord.push(s.e); const d = Math.max(0, s.ct); sim.forEach(x => x.ct -= d); s.ct = 1000 / eff(s.e, 'spd'); }
    $('#battle .order').innerHTML = '<span class="olab">Tours</span>' + ord.map((e, i) => `<i class="${e.side}${i === 0 ? ' now' : ''}${e.broken ? ' brk' : ''}" style="--c:${e.side === 'hero' ? e.color : `hsl(${e.def.hue},80%,62%)`}">${I.esc(e.name.replace(/^(L'|Le |La |Les |Al-|Abû |Ibn |')/, '').slice(0, 2))}</i>`).join('');
    // plaques ennemies
    const pl = $('#battle .plates'); pl.innerHTML = '';
    C.all.filter(e => e.side === 'foe' && e.alive).forEach(e => {
      const weak = e.def.weak.map(w => e.known[w] ? `<i style="color:${D.ELEMENTS[w].color}" title="${D.ELEMENTS[w].name}">${D.ELEMENTS[w].glyph}</i>` : '<i class="unk">?</i>').join('') + (e.def.immune || []).filter(w => e.known[w] === 'x').map(w => `<i class="imm" title="Insensible : ${D.ELEMENTS[w].name}">${D.ELEMENTS[w].glyph}</i>`).join('');
      const sts = Object.keys(e.buffs).map(k => `<b class="${e.buffs[k].v > 0 ? 'up' : 'dn'}">${STN[k === 'df' ? 'def' : k]}${e.buffs[k].v > 0 ? '▲' : '▼'}</b>`).join('') + Object.keys(e.st).map(k => `<b class="dn">${STN[k] || k}</b>`).join('');
      const d = I.el('button', 'plate' + (C.cursor === e ? ' cur' : '') + (e.broken ? ' brk' : ''), `<span class="nm">${I.esc(e.name)}</span><span class="bar"><i style="width:${Math.max(0, e.hp / e.max.hp * 100)}%"></i></span><span class="row"><span class="veil">${e.broken ? 'DÉVOILÉ' : '⛊ ' + e.veils}</span><span class="wk">${weak}</span></span>${sts ? `<span class="sts">${sts}</span>` : ''}`);
      d.type = 'button'; d.style.left = (e.x / G.PW * 100) + '%'; d.style.top = (Math.max(44, e.y - e.size - 4) / G.PH * 100) + '%';
      d.onclick = ev => { ev.stopPropagation(); if (C.pickCb) C.pickCb(e); };
      pl.appendChild(d);
    });
    // héros
    const hb = $('#battle .heroes'); hb.innerHTML = '';
    C.all.filter(e => e.side === 'hero').forEach(e => {
      let pips = ''; for (let i = 0; i < 5; i++) pips += `<i class="pip${i < e.niyya ? ' on' : ''}"></i>`;
      const sts = Object.keys(e.buffs).map(k => `<b class="${e.buffs[k].v > 0 ? 'up' : 'dn'}">${STN[k === 'df' ? 'def' : k]}${e.buffs[k].v > 0 ? '▲' : '▼'}</b>`).join('') + Object.keys(e.st).map(k => `<b class="${k === 'regen' || k === 'garde' || k === 'taunt' ? 'up' : 'dn'}">${STN[k] || k}</b>`).join('');
      const r = I.el('button', 'hrow' + (e === C.active ? ' act' : '') + (e.alive ? '' : ' ko') + (C.cursor === e ? ' cur' : ''),
        `<span class="hs" style="background-image:url(${G.sealURL(e.def.arabic, e.color)})"></span><span class="hn"><b style="color:${e.color}">${I.esc(e.name)}</b><small>Niv. ${e.ref.lvl} ${sts}</small></span>
         <span class="hbars"><span class="bar hp"><i style="width:${e.hp / e.max.hp * 100}%"></i><em>${e.alive ? Math.ceil(e.hp) : 'Éprouvé'}</em></span><span class="bar sp"><i style="width:${e.max.sp ? e.sp / e.max.sp * 100 : 0}%"></i><em>${e.sp}</em></span></span>
         <span class="hx"><span class="pips">${pips}</span><span class="bar sk${e.sakina >= 100 ? ' full' : ''}"><i style="width:${e.sakina}%"></i></span></span>`);
      r.type = 'button'; r.onclick = ev => { ev.stopPropagation(); if (C.pickCb) C.pickCb(e); };
      hb.appendChild(r);
    });
  }

  B.scene = {
    update(dt) { if (C) { C.t += dt; C.all.forEach(e => { if (e.flash > 0) e.flash -= dt * 4; if (e.shake > 0) e.shake -= dt; }); } },
    render() {
      const c = G.px; if (!C) { c.fillStyle = '#000'; c.fillRect(0, 0, G.PW, G.PH); return {}; }
      const t = C.t, lights = [];
      c.drawImage(C.bg, 0, 0); drawGrid(c, C.hue, t);
      const list = C.all.slice().sort((a, b) => a.y - b.y);
      for (const e of list) {
        const jx = e.shake > 0 ? (Math.random() - 0.5) * 4 : 0;
        if (e.side === 'foe') {
          if (e.fade <= 0) continue;
          const bob = e.broken ? 0 : Math.sin(t * 1.8 + e.ph) * 3, x = Math.round(e.x + e.ox + jx - e.size / 2), y = Math.round(e.y - e.size + bob - 6);
          c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(e.x + e.ox, e.y + 2, e.size * 0.36, e.size * 0.09, 0, 0, 6.3); c.fill();
          c.globalAlpha = e.fade * (e.broken ? 0.75 : 1); c.drawImage(e.spr, x, y);
          if (e.broken) { c.globalCompositeOperation = 'source-atop'; c.globalAlpha = 1; }
          if (e.flash > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, e.flash); c.drawImage(e.spr, x, y); }
          c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
          // glitch d'égrégore
          if (!e.broken && Math.random() < 0.05) { const sy = Math.floor(Math.random() * e.size), hh = 2 + Math.floor(Math.random() * 4); c.drawImage(e.spr, 0, sy, e.size, hh, x + (Math.random() < 0.5 ? -4 : 4), y + sy, e.size, hh); }
          lights.push({ x: e.x + e.ox, y: e.y - e.size * 0.5, r: e.size * 0.9, color: `hsl(${e.def.hue},90%,${e.broken ? 30 : 55}%)`, a: e.fade * 0.9 });
          if (C.cursor === e) cursor(c, e.x + e.ox, y - 4, t);
        } else {
          const x = Math.round(e.x + e.ox + jx), y = Math.round(e.y), act = C.active === e;
          c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(x, y + 1, 12, 4, 0, 0, 6.3); c.fill();
          if (!e.alive) { c.globalAlpha = 0.55; c.drawImage(e.sheet, 0, 24, 16, 24, x - 16, y - 28, 32, 30); c.globalAlpha = 1; }
          else {
            const f = act ? [1, 0, 2, 0][Math.floor(t * 6) % 4] : 0, bob = act ? 0 : Math.round(Math.sin(t * 2 + e.x) * 0.6);
            c.drawImage(e.sheet, f * 16, 24, 16, 24, x - 16, y - 46 + bob, 32, 48);
            if (e.flash > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, e.flash) * 0.8; c.drawImage(e.sheet, f * 16, 24, 16, 24, x - 16, y - 46 + bob, 32, 48); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; }
            if (e.st.garde) { c.strokeStyle = e.color; c.lineWidth = 1; c.beginPath(); c.ellipse(x - 14, y - 24, 4, 20, 0, 0, 6.3); c.stroke(); }
            lights.push({ x, y: y - 26, r: act ? 46 : 32, color: e.color, a: act ? 0.9 : 0.5 });
            if (e.sakina >= 100 && Math.random() < 0.3) G.spawn({ x: x + (Math.random() - 0.5) * 18, y: y - 4, vy: -30, life: 0.9, size: 0.8, color: e.color, type: 'mote' });
          }
          if (C.cursor === e) cursor(c, x, y - 52, t);
          if (act && e.alive) { c.fillStyle = e.color; c.fillRect(x - 10, y + 4, 20, 1); }
        }
      }
      return { ambient: '#9a94e0', lights, bloom: 0.34, scan: true, grade: [`hsl(${C.hue},80%,50%)`, 0.14], vignette: 0.62, tilt: false };
    }
  };
  function cursor(c, x, y, t) { const b = Math.sin(t * 8) * 2; c.fillStyle = '#1a1420'; c.beginPath(); c.moveTo(x - 6, y - 9 + b); c.lineTo(x + 6, y - 9 + b); c.lineTo(x, y + 1 + b); c.fill(); c.fillStyle = '#ffe08a'; c.beginPath(); c.moveTo(x - 4, y - 8 + b); c.lineTo(x + 4, y - 8 + b); c.lineTo(x, y - 1 + b); c.fill(); }
})();
