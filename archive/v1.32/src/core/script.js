/* ISNAD — interprète de scripts : dialogues, cartons, choix de fidélité, mise en scène. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, $ = I.$;
  const S = I.script = { depth: 0, flags: {} };
  Object.defineProperty(S, 'busy', { get() { return S.depth > 0; } });

  const KIND_COL = { homme: '#c8b48a', ancien: '#e6dcc4', soldat: '#b9bec8', romain: '#d86a5a', perse: '#5fb4cc', moine: '#b9a58a', enfant: '#f1d9a8', compagnon: '#ffe08a', marin: '#7fc4d8', cyber: '#39e6ff' };

  function speaker(who) {
    const W = I.world, saga = W.saga;
    const figOf = look => G.charURL(look, 0);
    if (saga && saga.heroes && saga.heroes[who]) { const h = saga.heroes[who]; return { name: h.name, seal: G.sealURL(h.arabic, D.ELEMENTS[h.el].color), color: D.ELEMENTS[h.el].color, fig: figOf(Object.assign({ kind: 'compagnon' }, h.look)) }; }
    const n = W.npcs && W.npcs.find(n => n.id === who);
    if (n) {
      if (n.hero && saga.heroes[n.hero]) { const h = saga.heroes[n.hero]; return { name: n.name || h.name, seal: G.sealURL(h.arabic, D.ELEMENTS[h.el].color), color: D.ELEMENTS[h.el].color, fig: figOf(Object.assign({ kind: 'compagnon' }, h.look)) }; }
      const col = KIND_COL[(n.look && n.look.kind) || 'homme'] || '#c8b48a';
      return { name: n.name, seal: G.sealURL('', col), color: col, fig: n.sheet && n.sheet.look ? figOf(n.sheet.look) : null };
    }
    return { name: who, seal: G.sealURL('', '#c8b48a'), color: '#c8b48a' };
  }

  /* ----- rien de ce que le joueur doit lire ne reste sous le noir d'un fondu -----
     Un script peut fondre au noir puis raconter (« fade out », un carton, des narrations) : le texte passe alors
     au-dessus du noir (classe « noir »). Le joueur de test signale tout texte qui resterait caché. */
  const noirci = () => +($('#fade').style.opacity || 0) > 0.5;
  function lisible(el) {
    if (!noirci()) return;
    if (S.TEXTE_SUR_NOIR) document.body.classList.add('noir');
    if (I.debug.log) { const z = e => +getComputedStyle(e).zIndex || 0; if (z(el) <= z($('#fade'))) I.debug.log.push('TEXTE CACHÉ sous le fondu : #' + el.id + ' « ' + (el.textContent || '').trim().slice(0, 50) + ' »'); }
  }
  S.TEXTE_SUR_NOIR = true; // à « false », on retrouve l'ancien comportement : le joueur de test doit alors signaler « TEXTE CACHÉ »

  /* ----- boîte de dialogue ----- */
  let typing = null;
  async function showLine(kind, sp, text) {
    const box = $('#dialog'); box.hidden = false; box.className = kind;
    document.body.classList.add('in-dialog');
    $('#dialog .seal').style.backgroundImage = sp ? `url(${sp.seal})` : 'none';
    $('#dialog .seal').hidden = !sp;
    const fg = $('#dialog .fig'); fg.hidden = !(sp && sp.fig); if (sp && sp.fig) fg.src = sp.fig; box.classList.toggle('avecfig', !!(sp && sp.fig)); // la silhouette de celui qui parle
    const nm = $('#dialog .name'); nm.textContent = sp ? sp.name : ((I.world.saga && I.world.saga.narrator) || 'La Chaîne'); nm.style.color = sp ? sp.color : '#ffe08a';
    const tx = $('#dialog .text'); const html = I.fmt(text);
    // effet machine à écrire sur le texte brut, puis rendu complet
    const plain = text.replace(/\*/g, ''); let i = 0, done = false;
    tx.textContent = '';
    $('#dialog .next').style.visibility = 'hidden';
    const fast = I.speed > 3;
    await new Promise(res => {
      const finish = () => { if (done) return; done = true; clearInterval(typing); I.input.pop(h); tx.innerHTML = html; res(); };
      const h = I.input.push(a => { if (a === 'ok' || a === 'cancel') finish(); return true; });
      if (fast) return finish();
      let tick = 0;
      typing = setInterval(() => { i += 2; tx.textContent = plain.slice(0, i); if (++tick % 3 === 0) I.audio.sfx('step'); if (i >= plain.length) finish(); }, 22);
    });
    $('#dialog .next').style.visibility = 'visible'; lisible(box);
    await I.sleep(60);
    if (I.debug.auto) await I.sleep(30); else await I.input.wait(['ok', 'cancel']);
    I.audio.sfx('blip');
  }
  S.hideDialog = function () { $('#dialog').hidden = true; document.body.classList.remove('in-dialog'); if (S.depth === 0 && I.world) I.world.focus = null; };

  /* ----- cartons ----- */
  async function card(cls, html, auto) {
    const c = $('#card'); c.className = cls; c.innerHTML = html; c.hidden = false;
    void c.offsetWidth; c.classList.add('on'); lisible(c);
    if (I.debug.auto) await I.sleep(60);
    else if (auto) await I.input.waitTimed(['ok', 'cancel'], auto, 500);
    else { await I.sleep(350); await I.input.wait(['ok', 'cancel']); }
    c.classList.remove('on'); await I.sleep(260); c.hidden = true;
  }
  S.card = card;

  /* ----- choix ----- */
  const cid = id => id.indexOf('/') > 0 ? id : I.world.saga.id + '/' + id; // « saga/id » : un savoir appris ailleurs
  function known(id) { return I.save.data.codex.includes(cid(id)); }
  S.known = known;
  function lockLabel(o) { const e = I.ui.codexEntry(cid(o.need)); return `<span class="lock">✧ Savoir requis${e ? ' : ' + I.esc(e.title) + (o.need.indexOf('/') > 0 ? ' (' + I.esc(e.saga.name) + ')' : '') : ''}</span>`; }
  function menuPick(prompt, options, head) {
    return new Promise(res => {
      const box = $('#choice'); box.hidden = false; box.innerHTML = '';
      document.body.classList.add('in-dialog');
      if (head) box.appendChild(I.el('div', 'phead', head));
      box.appendChild(typeof prompt === 'object' ? I.el('div', 'prompt ' + (prompt.cls || ''), prompt.html) : I.el('div', 'prompt', I.fmt(prompt))); box.scrollTop = 0;
      let idx = 0; const btns = [];
      const locked = o => o.need !== undefined && !known(o.need);
      const sel = i => { idx = (i + btns.length) % btns.length; btns.forEach((b, j) => b.classList.toggle('sel', j === idx)); };
      const ne = performance.now(); // un menu n'accepte rien pendant un tiers de seconde : le toucher qui vient de faire avancer le texte ne répond pas à la place du joueur
      const done = i => { if (!I.debug.auto && performance.now() - ne < 350) return; if (locked(options[i])) { I.audio.sfx('dark'); return; } I.input.pop(h); box.hidden = true; I.audio.sfx('ok'); res(i); };
      options.forEach((o, i) => { const el = o.el ? `<i class="el" style="color:${D.ELEMENTS[o.el].color}">${D.ELEMENTS[o.el].glyph}</i> ` : ''; const b = I.el('button', 'opt' + (locked(o) ? ' locked' : ''), locked(o) ? lockLabel(o) : el + (o.html || I.fmt(o.t)) + (o.need !== undefined ? ' <span class="kn">✧ savoir</span>' : '')); b.type = 'button'; b.onclick = e => { e.stopPropagation(); done(i); }; b.onmouseenter = () => sel(i); btns.push(b); box.appendChild(b); });
      sel(Math.max(0, options.findIndex(o => !locked(o)))); lisible(box);
      const vue = () => { if (btns[idx].scrollIntoView) btns[idx].scrollIntoView({ block: 'nearest' }); }; // une longue liste suit la sélection
      const h = I.input.push(a => { if (a === 'up') { sel(idx - 1); vue(); I.audio.sfx('move'); } else if (a === 'down') { sel(idx + 1); vue(); I.audio.sfx('move'); } else if (a === 'ok') done(idx); return true; });
      if (I.debug.auto) setTimeout(() => {
        const open = options.map((o, i) => i).filter(i => !locked(options[i]));
        if (options.some(o => typeof o.v === 'number')) { const pick = open.slice().sort((x, y) => I.debug.pickWrong ? options[x].v - options[y].v : options[y].v - options[x].v)[0]; return done(pick); }
        const bad = open.find(i => !options[i].ok), good = open.find(i => options[i].ok);
        done(I.debug.pickWrong && bad !== undefined && good !== undefined ? bad : (good !== undefined ? good : open[0]));
      }, 40);
    });
  }
  S.menuPick = menuPick;

  /* ----- pourparler : la parole avant le sabre ----- */
  async function runParley(P) {
    const W = I.world, sv = I.save.data, sp = speaker(P.with), n = P.rounds.length;
    S.hideDialog(); I.audio.music('conseil');
    let conf = S.flags._prayed ? 1 : 0;
    const pips = () => { let h = ''; for (let i = 0; i < P.goal; i++) h += `<i class="pip${i < conf ? ' on' : ''}"></i>`; return h; };
    const head = r => `<span class="seal" style="background-image:url(${sp.seal})"></span><span class="pt"><b>${I.esc(P.title)}</b><small>${I.esc(sp.name)} · manche ${r + 1} / ${n}</small></span><span class="trust">Confiance <span class="pips">${pips()}</span></span>`;
    await card('title parley', `<p class="small">Pourparler</p><h1>${I.fmt(P.title)}</h1><p>${I.fmt(P.intro)}</p>${S.flags._prayed ? '<p class="small">Sérénité de la prière : +1 de confiance</p>' : ''}<div class="rule"></div><div class="hint">▼</div>`);
    for (let r = 0; r < n; r++) {
      const R = P.rounds[r];
      await showLine('say', sp, R.say); S.hideDialog();
      if (R.noir) {
        const N = R.noir, gain = N.v || 1;
        // L'échelle des réponses (décision du décideur) : une idée noire pèse sur une personne, on lui répond par la parole ;
        // un égrégore le tient (rencontres de la Cité-Miroir), cela se combat.
        if (I.mal.estIdee(N)) await I.mal.dissiper(N, P);
        else {
          await card('title parley noir', `<p class="small">Un égrégore le tient</p><h1>${I.fmt(N.name)}</h1><p>${I.fmt(N.intro)}</p><p class="small">On ne le combat pas contre lui, mais pour lui</p><div class="rule"></div><div class="hint">▼</div>`);
          await I.battle.start({ group: N.group, bg: N.bg || 'noos', noir: true, intro: N.say || 'Il parle plus fort que toi. Dissipe-le.' });
          I.mal.note('n', P.title + '|' + N.name, -1);
        }
        conf += gain; I.audio.music('conseil'); S.toast(`<b>Confiance +${gain}</b> — son regard s’éclaircit`, 2400);
        if (N.after) { await showLine('say', sp, N.after); S.hideDialog(); }
      }
      const i = await menuPick('Que réponds-tu ?', R.opts, head(r)); const o = R.opts[i];
      conf = Math.max(0, conf + o.v);
      S.toast(o.v > 0 ? `<b>Confiance +${o.v}</b>` : o.v < 0 ? `<b>Confiance ${o.v}</b> — il se ferme` : 'Il ne bouge pas.', 1800); I.audio.sfx(o.v > 0 ? 'light' : o.v < 0 ? 'dark' : 'blip');
      await showLine('say', sp, o.r);
    }
    S.hideDialog(); sv.parley.total++;
    const ok = conf >= P.goal;
    I.mal.note('p', P.title, ok ? -1 : 1); // la parole qui porte déracine l'idée ; la parole manquée la laisse s'enfoncer
    if (ok) {
      sv.parley.won++; I.audio.sfx('roll'); G.flash('#ffe08a');
      const xp = P.xp || Math.round(22 + 12 * W.hero(W.party[0]).lvl), lines = I.battle.grantXP(xp);
      await I.oeuvres.rally();
      await card('victory', `<p class="small">Pourparler · ${I.esc(P.title)}</p><h1>La parole a suffi</h1><ul><li>Confiance : <b>${conf} / ${P.goal}</b></li><li>Sagesse acquise : <b>+${xp}</b></li>${lines.join('')}</ul><div class="hint">▼</div>`);
      await S.run(P.win);
    } else {
      I.audio.sfx('dark'); G.shake(260);
      await card('defeat', `<p class="small">Pourparler · ${I.esc(P.title)}</p><h1>La parole n’a pas suffi</h1><p>Confiance : ${conf} / ${P.goal}. Ce qui n’a pas été noué par la parole devra l’être autrement, et coûtera davantage.</p><div class="hint">▼</div>`);
      await S.run(P.lose);
    }
    const env = W.map && W.map.env; if (env && I.scene === W) I.audio.scene(env.music || 'silence'); else I.audio.back();
  }

  S.toast = function (html, ms) {
    const box = $('#toasts'); while (box.children.length >= 4) box.firstChild.remove();
    const t = I.el('div', 'toast', html); box.appendChild(t);
    setTimeout(() => t.classList.add('out'), (ms || 2600)); setTimeout(() => t.remove(), (ms || 2600) + 500);
  };
  S.fade = async function (dir, ms) {
    const f = $('#fade'); ms = (ms || 450) / I.speed; f.style.transition = `opacity ${ms}ms ease`; f.style.opacity = dir === 'out' ? 1 : 0;
    if (dir !== 'out') document.body.classList.remove('noir'); // le jour revient : le texte reprend sa place sous les écrans
    await new Promise(r => setTimeout(r, ms + 30));
  };

  /* ----- exécution ----- */
  S.run = async function (ops) {
    if (!ops || !ops.length) return;
    S.depth++;
    try { for (const op of ops) { try { await exec(op); } catch (e) { I.report(e, 'récit (' + (op && op[0]) + ')'); } } }
    finally { S.depth--; if (S.depth === 0) S.hideDialog(); }
  };

  async function exec(op) {
    const W = I.world, a = op[1], b = op[2], c = op[3];
    switch (op[0]) {
      case 'say': W.focus = (W.npcs && W.map && W.npcs.find(n => n.id === a && !n.hidden && n.map === W.map.id && n.placed)) || null; await showLine('say', speaker(a), b); break;
      case 'nar': W.focus = null; await showLine('nar', null, a); break;
      case 'quote': S.hideDialog(); I.audio.sfx('light'); await card('quote', `<div class="orn">❖</div><blockquote>${I.fmt(a.replace(/^«\s*/, '').replace(/\s*»$/, ''))}</blockquote><cite>${I.fmt(b)}</cite><div class="hint">▼</div>`); break;
      case 'title': S.hideDialog(); I.audio.sfx('roll'); await card('title', `<h1>${I.fmt(a)}</h1>${b ? `<p>${I.fmt(b)}</p>` : ''}<div class="rule"></div>`, 3000); break;
      case 'choice': {
        S.hideDialog();
        let opts = b.slice(), first = true; const sv = I.save.data;
        sv.isnad.total++; const spc = sv.sagas[W.saga.id] || (sv.sagas[W.saga.id] = { ch: 0, done: false, flags: {} }); spc.cTot = (spc.cTot || 0) + 1;
        while (true) {
          const i = await menuPick(a, opts); const o = opts[i];
          if (o.ok) { if (first) { sv.isnad.ok++; spc.cOk = (spc.cOk || 0) + 1; S.toast('<b>Chaîne intacte</b> — c’est ce qui fut rapporté.'); I.audio.sfx('light'); W.gainSakina && W.gainSakina(20); I.mal.note('c', a, 0); } if (o.r) await S.run(o.r); break; }
          if (first) I.mal.note('c', a, 1); // un acte que les transmetteurs n'ont pas rapporté : l'idée s'enracine
          first = false; I.audio.sfx('glitch'); G.shake(260); G.flash('#7a5cff');
          S.toast('<b>La chaîne vacille…</b> ce n’est pas ce qui fut rapporté.');
          if (o.r) await S.run(o.r);
          S.hideDialog();
          opts = opts.filter(x => x !== o); if (opts.length === 1 && I.debug.auto) { /* continue */ }
        }
        break;
      }
      case 'ask': { S.hideDialog(); const i = await menuPick(a, b); if (b[i].r) await S.run(b[i].r); break; }
      case 'parley': await runParley(a); break;
      case 'pray': await W.pray(a, true); break; // jouée par le récit : pas de point de reprise au milieu d'un objectif
      case 'emote': W.emote(a, b); break;
      case 'save': await I.ui.saveMenu(); break;
      case 'pillar': W.pillar(a, b); break;
      case 'mus': I.audio.scene(a); break; // l'humeur posée par le récit devient la musique du lieu, jusqu'à la carte suivante
      case 'mat': I.build.give(a, b === undefined ? 1 : b); break;
      case 'lore': I.trade.lore(a); break;
      case 'raid': S.hideDialog(); await I.trade.raid(a || {}); break;
      case 'vices': S.hideDialog(); await I.oeuvres.finale(a || {}); break;
      case 'site': I.build.openSite(a); break;
      case 'battle': S.hideDialog(); await I.battle.start(a); break;
      case 'map': S.hideDialog(); await S.fade('out'); W.loadMap(a, c || {}, b); await S.fade('in'); break;
      case 'tp': { const e = W.ent(a); if (e) { const p = W.resolve(b, e === W.player ? W.map.id : e.map, e); if (p) { e.x = p[0]; e.y = p[1]; e.placed = true; e.placedMap = W.map.id; if (e === W.player) W.resetTrail(); } else { e.at = b; e.placed = false; } } break; }
      case 'walk': { const e = W.ent(a); if (e) { const p = W.resolve(b, e === W.player ? W.map.id : e.map, e); if (p) { if (e.hidden || I.debug.auto) { e.x = p[0]; e.y = p[1]; } else await W.walkTo(e, p[0], p[1]); if (e !== W.player) { e.placed = true; e.placedMap = W.map.id; } } else { e.at = b; e.placed = false; } } break; }
      case 'face': { const e = W.ent(a); if (e) e.dir = G.DIRS[b]; break; }
      case 'show': { const e = W.ent(a); if (e) { e.hidden = false; W.place(e); } break; }
      case 'hide': { const e = W.ent(a); if (e) e.hidden = true; break; }
      case 'fade': S.hideDialog(); await S.fade(a, b); break;
      case 'wait': await I.sleep(I.debug.auto ? 10 : a); break;
      case 'shake': G.shake(a || 400); I.audio.sfx('hit'); break;
      case 'flash': G.flash(a || '#fff'); break;
      case 'sfx': I.audio.sfx(a); break;
      case 'give': { if (D.GEAR[a]) { await I.gear.receive(a, b || 1); break; } const n = b || 1, it = D.ITEMS[a]; const inv = I.save.data.items; inv[a] = (inv[a] || 0) + n; S.toast(`Reçu : <b>${it.name}</b>${n > 1 ? ' ×' + n : ''}`); I.audio.sfx('ok'); break; }
      case 'join': W.join(a); break;
      case 'leave': W.leave(a); break;
      case 'codex': I.ui.unlockCodex(a); break;
      case 'heal': W.healAll(); S.toast('Le groupe reprend son souffle.'); break;
      case 'flag': S.flags[a] = b === undefined ? true : b; break;
      case 'if': if (S.flags[a]) await S.run(b); else if (c) await S.run(c); break;
      case 'tint': W.tint = a || null; break;
      case 'light': {
        S.hideDialog(); const e = D.ELEMENTS[a]; const sv = I.save.data; if (!sv.lights.includes(a)) sv.lights.push(a); I.save.store();
        G.flash(e.color); I.audio.sfx('roll');
        for (let i = 0; i < 60; i++) G.spawn({ x: G.PW / 2, y: G.PH / 2, vx: (Math.random() - 0.5) * 220, vy: (Math.random() - 0.5) * 160, life: 1.6 + Math.random(), size: 1 + Math.random(), color: e.color, type: 'spark' });
        await card('lightcard', `<div class="glyph" style="color:${e.color}">${e.glyph}</div><p class="small">Lumière retrouvée</p><h1 style="color:${e.color}">${e.name}</h1><p class="ar">${e.ar}</p><div class="hint">▼</div>`);
        break;
      }
    }
  }
})();
