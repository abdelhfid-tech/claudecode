/* ISNAD — interprète de scripts : dialogues, cartons, choix de fidélité, mise en scène. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, $ = I.$;
  const S = I.script = { depth: 0, flags: {} };
  Object.defineProperty(S, 'busy', { get() { return S.depth > 0; } });

  const KIND_COL = { homme: '#c8b48a', ancien: '#e6dcc4', soldat: '#b9bec8', romain: '#d86a5a', perse: '#5fb4cc', moine: '#b9a58a', enfant: '#f1d9a8', compagnon: '#ffe08a', marin: '#7fc4d8', cyber: '#39e6ff' };

  function speaker(who) {
    const W = I.world, saga = W.saga;
    if (saga && saga.heroes && saga.heroes[who]) { const h = saga.heroes[who]; return { name: h.name, seal: G.sealURL(h.arabic, D.ELEMENTS[h.el].color), color: D.ELEMENTS[h.el].color }; }
    const n = W.npcs && W.npcs.find(n => n.id === who);
    if (n) {
      if (n.hero && saga.heroes[n.hero]) { const h = saga.heroes[n.hero]; return { name: n.name || h.name, seal: G.sealURL(h.arabic, D.ELEMENTS[h.el].color), color: D.ELEMENTS[h.el].color }; }
      const col = KIND_COL[(n.look && n.look.kind) || 'homme'] || '#c8b48a';
      return { name: n.name, seal: G.sealURL('', col), color: col };
    }
    return { name: who, seal: G.sealURL('', '#c8b48a'), color: '#c8b48a' };
  }

  /* ----- boîte de dialogue ----- */
  let typing = null;
  async function showLine(kind, sp, text) {
    const box = $('#dialog'); box.hidden = false; box.className = kind;
    document.body.classList.add('in-dialog');
    $('#dialog .seal').style.backgroundImage = sp ? `url(${sp.seal})` : 'none';
    $('#dialog .seal').hidden = !sp;
    const nm = $('#dialog .name'); nm.textContent = sp ? sp.name : 'La Chaîne'; nm.style.color = sp ? sp.color : '#ffe08a';
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
    $('#dialog .next').style.visibility = 'visible';
    await I.sleep(60);
    if (I.debug.auto) await I.sleep(30); else await I.input.wait(['ok', 'cancel']);
    I.audio.sfx('blip');
  }
  S.hideDialog = function () { $('#dialog').hidden = true; document.body.classList.remove('in-dialog'); };

  /* ----- cartons ----- */
  async function card(cls, html, auto) {
    const c = $('#card'); c.className = cls; c.innerHTML = html; c.hidden = false;
    void c.offsetWidth; c.classList.add('on');
    if (I.debug.auto) await I.sleep(60);
    else if (auto) await Promise.race([I.sleep(auto), I.sleep(500).then(() => I.input.wait(['ok', 'cancel']))]);
    else { await I.sleep(350); await I.input.wait(['ok', 'cancel']); }
    c.classList.remove('on'); await I.sleep(260); c.hidden = true;
  }
  S.card = card;

  /* ----- choix ----- */
  function menuPick(prompt, options) {
    return new Promise(res => {
      const box = $('#choice'); box.hidden = false; box.innerHTML = '';
      document.body.classList.add('in-dialog');
      box.appendChild(I.el('div', 'prompt', I.fmt(prompt)));
      let idx = 0; const btns = [];
      const sel = i => { idx = (i + btns.length) % btns.length; btns.forEach((b, j) => b.classList.toggle('sel', j === idx)); };
      const done = i => { I.input.pop(h); box.hidden = true; I.audio.sfx('ok'); res(i); };
      options.forEach((o, i) => { const b = I.el('button', 'opt', I.fmt(o.t)); b.type = 'button'; b.onclick = e => { e.stopPropagation(); done(i); }; b.onmouseenter = () => sel(i); btns.push(b); box.appendChild(b); });
      sel(0);
      const h = I.input.push(a => { if (a === 'up') { sel(idx - 1); I.audio.sfx('move'); } else if (a === 'down') { sel(idx + 1); I.audio.sfx('move'); } else if (a === 'ok') done(idx); return true; });
      if (I.debug.auto) setTimeout(() => { const bad = options.findIndex(o => o.ok === undefined || o.ok === false), good = options.findIndex(o => o.ok); done(I.debug.pickWrong && bad >= 0 && good >= 0 ? bad : Math.max(0, good)); }, 40);
    });
  }
  S.menuPick = menuPick;

  S.toast = function (html, ms) {
    const t = I.el('div', 'toast', html); $('#toasts').appendChild(t);
    setTimeout(() => t.classList.add('out'), (ms || 2600)); setTimeout(() => t.remove(), (ms || 2600) + 500);
  };
  S.fade = async function (dir, ms) {
    const f = $('#fade'); ms = (ms || 450) / I.speed; f.style.transition = `opacity ${ms}ms ease`; f.style.opacity = dir === 'out' ? 1 : 0;
    await new Promise(r => setTimeout(r, ms + 30));
  };

  /* ----- exécution ----- */
  S.run = async function (ops) {
    if (!ops || !ops.length) return;
    S.depth++;
    try { for (const op of ops) await exec(op); }
    finally { S.depth--; if (S.depth === 0) S.hideDialog(); }
  };

  async function exec(op) {
    const W = I.world, a = op[1], b = op[2], c = op[3];
    switch (op[0]) {
      case 'say': await showLine('say', speaker(a), b); break;
      case 'nar': await showLine('nar', null, a); break;
      case 'quote': S.hideDialog(); I.audio.sfx('light'); await card('quote', `<div class="orn">❖</div><blockquote>${I.fmt(a.replace(/^«\s*/, '').replace(/\s*»$/, ''))}</blockquote><cite>${I.fmt(b)}</cite><div class="hint">▼</div>`); break;
      case 'title': S.hideDialog(); I.audio.sfx('roll'); await card('title', `<h1>${I.fmt(a)}</h1>${b ? `<p>${I.fmt(b)}</p>` : ''}<div class="rule"></div>`, 3000); break;
      case 'choice': {
        S.hideDialog();
        let opts = b.slice(), first = true; const sv = I.save.data;
        sv.isnad.total++; const spc = sv.sagas[W.saga.id] || (sv.sagas[W.saga.id] = { ch: 0, done: false, flags: {} }); spc.cTot = (spc.cTot || 0) + 1;
        while (true) {
          const i = await menuPick(a, opts); const o = opts[i];
          if (o.ok) { if (first) { sv.isnad.ok++; spc.cOk = (spc.cOk || 0) + 1; S.toast('<b>Chaîne intacte</b> — c’est ce qui fut rapporté.'); I.audio.sfx('light'); W.gainSakina && W.gainSakina(20); } if (o.r) await S.run(o.r); break; }
          first = false; I.audio.sfx('glitch'); G.shake(260); G.flash('#7a5cff');
          S.toast('<b>La chaîne vacille…</b> ce n’est pas ce qui fut rapporté.');
          if (o.r) await S.run(o.r);
          S.hideDialog();
          opts = opts.filter(x => x !== o); if (opts.length === 1 && I.debug.auto) { /* continue */ }
        }
        break;
      }
      case 'ask': { S.hideDialog(); const i = await menuPick(a, b); if (b[i].r) await S.run(b[i].r); break; }
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
      case 'amb': I.audio.amb(a); break;
      case 'give': { const n = b || 1, it = D.ITEMS[a]; const inv = I.save.data.items; inv[a] = (inv[a] || 0) + n; S.toast(`Reçu : <b>${it.name}</b>${n > 1 ? ' ×' + n : ''}`); I.audio.sfx('ok'); break; }
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
