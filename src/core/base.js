/* ISNAD — socle : espace de noms, utilitaires, entrées, sauvegarde, son. */
(function () {
  'use strict';
  const D = window.ISNAD_DEFS;
  const I = window.ISNAD = {
    D, sagas: {}, sagaList: [],
    // commun: true — contenu partagé par toutes les sagas (src/data/coeur.js) : ni maillon ni chapitre
    registerSaga(s) { this.sagas[s.id] = s; if (s.commun) { if (this.common) Object.assign(this.common.enemies, s.enemies || {}); return; } this.sagaList.push(s); this.sagaList.sort((a, b) => a.order - b.order); },
    speed: 1, debug: {}
  };

  /* ---------- incidents : on les retient, on les montre, le jeu continue ---------- */
  I.errors = [];
  I.report = function (e, where) {
    const msg = (where ? where + ' : ' : '') + (e && e.message ? e.message : String(e)), st = e && e.stack ? String(e.stack).split('\n').slice(1, 4).map(l => l.trim().replace(/\(?(?:file|https?):[^)]*\/([^/)]+)\)?/, '$1')).join(' ← ') : '';
    if (I.errors.length && I.errors[I.errors.length - 1].msg === msg) { I.errors[I.errors.length - 1].n++; return; }
    I.errors.push({ t: Date.now(), msg, st, n: 1 }); if (I.errors.length > 10) I.errors.shift();
    try { console.error('[ISNAD] ' + msg, e); } catch (x) { /* console absente */ }
    if (I.onError) { try { I.onError(msg); } catch (x) { /* l'affichage ne doit pas ajouter un incident */ } }
  };
  window.addEventListener('error', ev => { I.report(ev.error || ev.message || 'erreur', 'erreur'); });
  window.addEventListener('unhandledrejection', ev => { I.report(ev.reason || 'promesse rejetée', 'suite interrompue'); });

  /* ---------- utilitaires ---------- */
  I.rng = function (seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0; let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  I.hash = function (str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  I.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  I.lerp = (a, b, t) => a + (b - a) * t;
  I.sleep = ms => new Promise(r => setTimeout(r, Math.max(0, ms / I.speed)));
  I.pick = (arr, r) => arr[Math.floor((r || Math.random)() * arr.length)];
  I.$ = sel => document.querySelector(sel);
  I.el = function (tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  I.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // *emphase* -> <em>
  I.fmt = s => I.esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');

  /* ---------- entrées ---------- */
  const held = { up: false, down: false, left: false, right: false };
  const stack = [];
  const KEY = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    Enter: 'ok', Space: 'ok', KeyZ: 'ok', KeyE: 'ok', NumpadEnter: 'ok',
    Escape: 'cancel', KeyX: 'cancel', Backspace: 'cancel', KeyM: 'menu', Tab: 'menu', KeyB: 'build', KeyC: 'prev', KeyV: 'next', KeyH: 'help', F1: 'help'
  };
  function emit(a) {
    I.audio.unlock();
    for (let i = stack.length - 1; i >= 0; i--) { if (stack[i](a) !== false) return; }
  }
  I.input = {
    held,
    push(fn) { stack.push(fn); return fn; },
    pop(fn) { const i = stack.lastIndexOf(fn); if (i >= 0) stack.splice(i, 1); },
    emit,
    clearHeld() { held.up = held.down = held.left = held.right = false; },
    // secours : on ne garde que l'écouteur du monde (le premier posé), les autres appartenaient à une suite interrompue
    mark() { return stack.length; }, trim(n) { if (stack.length > n) stack.length = Math.max(1, n); }, reset() { stack.length = Math.min(stack.length, 1); held.up = held.down = held.left = held.right = false; },
    // attend une action OU un délai ; l'écouteur est toujours retiré (sinon il avalerait les touches suivantes)
    waitTimed(actions, ms, delay) {
      return new Promise(res => {
        let h = null, done = false; const fin = v => { if (done) return; done = true; if (h) I.input.pop(h); res(v); };
        setTimeout(() => { if (!done) h = I.input.push(a => { if (actions.includes(a)) fin(a); return true; }); }, (delay || 0) / I.speed);
        setTimeout(() => fin(null), ms / I.speed);
      });
    },
    // attend l'une des actions ; renvoie l'action
    wait(actions) {
      return new Promise(res => {
        const h = I.input.push(a => { if (!actions || actions.includes(a)) { I.input.pop(h); res(a); } return true; });
      });
    }
  };
  window.addEventListener('keydown', e => {
    const a = KEY[e.code]; if (!a) return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    e.preventDefault();
    if (a in held) { held[a] = true; if (e.repeat) { emit(a); return; } }
    else if (e.repeat) return;
    emit(a);
  });
  window.addEventListener('keyup', e => { const a = KEY[e.code]; if (a && a in held) held[a] = false; });
  window.addEventListener('blur', () => I.input.clearHeld());

  /* ---------- sauvegarde ---------- */
  const SKEY = 'isnad.save.v1';
  function fresh() {
    return { v: 1, started: false, prologue: false, epilogue: false, lights: [], sagas: {}, heroes: {},
      items: { dattes: 3, eau: 1, musc: 1, lait: 1 }, gear: {}, equip: {}, gearInit: {}, codex: [], isnad: { ok: 0, total: 0 }, cp: null,
      opts: { sound: true, music: true, low: false }, citadel: { priere: 1, savoir: 1, justice: 1, lien: 1 }, veillees: {}, rencontres: {}, parley: { won: 0, total: 0 } };
  }
  // La partie se garde toute seule, à chaque point de reprise (AKEY) : fermer la page ne fait rien perdre. Les trois
  // emplacements de la mosquée restent, pour qui veut garder une copie. Les options, elles, se gardent à part.
  const OKEY = 'isnad.opts.v1', SLOT = n => 'isnad.slot.' + n, AKEY = 'isnad.auto.v1';
  I.save = {
    data: fresh(),
    slots() { return [1, 2, 3].map(n => { try { const d = JSON.parse(localStorage.getItem(SLOT(n)) || 'null'); return d && d.v === 1 ? d : null; } catch (e) { return null; } }); },
    load() {
      try {
        const o = JSON.parse(localStorage.getItem(OKEY) || 'null'); if (o) Object.assign(this.data.opts, o);
        const old = localStorage.getItem(SKEY); // reprise d'une partie de la version précédente (sauvegarde automatique)
        if (old) { const d = JSON.parse(old); if (d && d.v === 1 && d.started && !this.slots().some(Boolean)) { d.meta = { label: 'Partie de la version précédente', when: Date.now() }; localStorage.setItem(SLOT(1), JSON.stringify(d)); if (d.opts && !o) Object.assign(this.data.opts, d.opts); } localStorage.removeItem(SKEY); }
      } catch (e) { /* stockage indisponible */ }
      return this.slots().some(Boolean);
    },
    store() { try { localStorage.setItem(OKEY, JSON.stringify(this.data.opts)); } catch (e) { /* ignore */ } },
    write(n, meta) { this.data.meta = Object.assign({ when: Date.now() }, meta || {}); this.data.started = true; try { localStorage.setItem(SLOT(n), JSON.stringify(this.data)); return true; } catch (e) { return false; } },
    read(n) { const d = this.slots()[n - 1]; if (!d) return false; const o = this.data.opts; this.data = Object.assign(fresh(), d); this.data.opts = o; return true; },
    reset() { const o = this.data.opts; this.data = fresh(); this.data.opts = Object.assign(this.data.opts, o); },
    // sauvegarde automatique : l'état au dernier point de reprise. Même format que les emplacements (v: 1).
    auto(label) { if (!this.data.started) return false; this.data.meta = { when: Date.now(), auto: true, label: label || (this.data.meta && this.data.meta.label) || '' };
      try { localStorage.setItem(AKEY, JSON.stringify(this.data)); this.autoAt = Date.now(); return true; } catch (e) { this.autoKo = true; return false; } },
    autoGet() { try { const d = JSON.parse(localStorage.getItem(AKEY) || 'null'); return d && d.v === 1 && d.started ? d : null; } catch (e) { return null; } },
    readAuto() { const d = this.autoGet(); if (!d) return false; const o = this.data.opts; this.data = Object.assign(fresh(), d); this.data.opts = o; return true; },
    clearAuto() { try { localStorage.removeItem(AKEY); } catch (e) { /* ignore */ } }
  };

  /* ---------- son : percussions (duff) et bruitages brefs ; la bande-son est plus bas. Aucune voix, aucune nappe de fond
     (les nappes de bruit filtré ont été retirées à la demande du décideur, D90). ---------- */
  const A = I.audio = { ctx: null, on: true, master: null, rhythm: null };
  A.unlock = function () {
    if (A.ctx) { if (A.ctx.state !== 'running') { const p = A.ctx.resume(); if (p && p.catch) p.catch(() => {}); } return; } // suspendu, ou « interrompu » sur un téléphone : on relance
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      A.ctx = new AC();
      const oc = outChain(A.ctx); A.master = oc.master; A.limiter = oc.lim; A.master.gain.value = A.on ? 0.8 : 0;
      noiseBuf(A.ctx);
      if (A.pendingRhythm) { const n = A.pendingRhythm; A.pendingRhythm = null; A.beat(n); }
      A.mbus = musicBus(A.ctx, A.master); A.mbus.gain.value = A.musicOn ? MG : 0;
      if (A.wantTrack) { const n = A.wantTrack; A.curTrack = null; A.music(n); }
    } catch (e) { A.ctx = null; }
  };
  A.setOn = function (v) { A.on = v; if (A.master) A.master.gain.setTargetAtTime(v ? 0.8 : 0, A.ctx.currentTime, 0.05); };
  function noiseSrc(loop) { const s = A.ctx.createBufferSource(); s.buffer = A.noise; s.loop = !!loop; return s; }
  function env(g, t, a, d, peak) { g.gain.value = 0; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  // percussions
  A.dum = function (t, vol, pitch, out) {
    if (!A.ctx) return; t = t || A.ctx.currentTime; const o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime((pitch || 120), t); o.frequency.exponentialRampToValueAtTime((pitch || 120) * 0.42, t + 0.16);
    env(g, t, 0.004, 0.28, (vol || 1) * 0.9); o.connect(g); g.connect(out || A.master); o.start(t); o.stop(t + 0.4);
    const n = noiseSrc(), ng = A.ctx.createGain(), f = A.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    env(ng, t, 0.002, 0.05, (vol || 1) * 0.3); n.connect(f); f.connect(ng); ng.connect(out || A.master); n.start(t, Math.random()); n.stop(t + 0.1);
  };
  A.tek = function (t, vol, freq, out) {
    if (!A.ctx) return; t = t || A.ctx.currentTime; const n = noiseSrc(), g = A.ctx.createGain(), f = A.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = freq || 2600; f.Q.value = 2.5; env(g, t, 0.001, 0.07, (vol || 1) * 0.5);
    n.connect(f); f.connect(g); g.connect(out || A.master); n.start(t, Math.random()); n.stop(t + 0.12);
  };
  A.noiseHit = function (t, vol, freq, dur, type, sweep, out) {
    if (!A.ctx) return; t = t || A.ctx.currentTime; const n = noiseSrc(), g = A.ctx.createGain(), f = A.ctx.createBiquadFilter();
    f.type = type || 'bandpass'; f.frequency.setValueAtTime(freq, t); if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t + dur); f.Q.value = 1.2;
    env(g, t, 0.005, dur, vol); n.connect(f); f.connect(g); g.connect(out || A.master); n.start(t, Math.random()); n.stop(t + dur + 0.1);
  };
  A.sfx = function (name) {
    if (!A.ctx || !A.on) return; const t = A.ctx.currentTime;
    switch (name) {
      case 'blip': A.tek(t, 0.35, 3800); break;
      case 'move': A.tek(t, 0.2, 5200); break;
      case 'ok': A.tek(t, 0.45, 3000); A.tek(t + 0.05, 0.3, 4400); break;
      case 'duff': A.dum(t, 0.9); break;
      case 'tek': A.tek(t, 0.8); break;
      case 'roll': for (let i = 0; i < 8; i++) A.tek(t + i * 0.055, 0.3 + i * 0.07, 2200); A.dum(t + 0.46, 1); break;
      case 'hit': A.noiseHit(t, 0.7, 900, 0.12, 'bandpass', 200); A.dum(t, 0.5, 90); break;
      case 'slash': A.noiseHit(t, 0.5, 5000, 0.14, 'highpass', 1200); break;
      case 'break': A.noiseHit(t, 0.8, 6000, 0.5, 'highpass', 800); A.dum(t, 1, 70); A.tek(t + 0.02, 0.9, 5000); break;
      case 'light': A.noiseHit(t, 0.35, 1200, 0.7, 'bandpass', 7000); break;
      case 'heal': A.noiseHit(t, 0.25, 2500, 0.6, 'bandpass', 5500); break;
      case 'door': A.dum(t, 0.6, 80); A.noiseHit(t, 0.3, 400, 0.2, 'lowpass'); break;
      case 'glitch': for (let i = 0; i < 5; i++) A.tek(t + Math.random() * 0.25, 0.4, 800 + Math.random() * 6000); break;
      case 'dark': A.noiseHit(t, 0.6, 200, 0.5, 'lowpass', 60); break;
      case 'step': A.noiseHit(t, 0.06, 500, 0.05, 'lowpass'); break;
    }
  };
  // rythmes de duff : D = dum, T = tek, k = ka (léger), . = silence ; 8 ou 16 pas
  const BEATS = {
    maqsum: { bpm: 96, p: 'D.T...T.D...T...' , accent: 1 },
    ayyub: { bpm: 112, p: 'D..kD.T.D..kD.T.', accent: 1 },
    malfuf: { bpm: 132, p: 'D..T..T.D..T..T.', accent: 1.1 },
    marche: { bpm: 76, p: 'D...D...D.D.D...', accent: 1.2, low: true },
    cyber: { bpm: 124, p: 'D.k.T.k.D.kkT.k.', accent: 1, hi: true },
    veille: { bpm: 60, p: 'D.......T.......', accent: 0.5 }
  };
  A.beat = function (name) {
    if (!A.ctx) { A.pendingRhythm = name; return; }
    if (A.rhythm) { clearInterval(A.rhythm.timer); A.rhythm = null; }
    if (A.hasMusic) return;
    const b = BEATS[name]; if (!b) return;
    const step = 60 / b.bpm / 4; let next = A.ctx.currentTime + 0.1, i = 0;
    const tick = () => {
      if (!A.ctx) return;
      while (next < A.ctx.currentTime + 0.25) {
        const c = b.p[i % b.p.length];
        if (A.on) {
          if (c === 'D') A.dum(next, 0.55 * b.accent, b.low ? 80 : 125);
          else if (c === 'T') A.tek(next, 0.45 * b.accent, b.hi ? 5200 : 2400);
          else if (c === 'k') A.tek(next, 0.16, b.hi ? 7400 : 3600);
        }
        next += step / (I.speed > 2 ? 1 : 1); i++;
      }
    };
    A.rhythm = { name, timer: setInterval(tick, 80) };
  };
  /* ---------- musique : séquenceur multi-voix (timbres synthétisés, façon 16 bits) ----------
     Piste : { bpm, beats, intro?, voices: [{ wave, vol, pan?, notes }] }. `intro` : temps joués une seule fois, la boucle
     reprend ensuite à ce temps-là. Timbres : D.WAVES. Aucun timbre vocal (exigence 9) : flûte, luth, harpe, cordes,
     cuivres, cloches, timbales, synthés et percussions. Détail : docs/musique.md. */
  I.music = {}; I.registerMusic = function (name, def) { I.music[name] = def; };
  A.musicOn = true; A.curTrack = null; A.wantTrack = null;
  A.place = null;                                    // la piste du lieu : carte, écran, ou humeur posée par le récit (A.scene)
  A.stats = { notes: 0, sautees: 0, relances: 0 };  // ce que le séquenceur a vraiment programmé (page Diagnostic, tools/son.js)
  const AVANCE = 1.2;                                // secondes de musique programmées d'avance
  const MG = 0.26;                                   // gain du bus musique : la bande-son reste sous les bruitages
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freqOf(n) { const m = n.match(/^([A-G])(#|b)?(\d)$/); if (!m) return 0; const midi = 12 * (+m[3] + 1) + SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); return 440 * Math.pow(2, (midi - 69) / 12); }
  function parseTrack(def) {
    if (def._ev) return def._ev; const ev = [], intro = def.intro || 0;
    def.voices.forEach((v, vi) => { let t = 0; String(v.notes || '').trim().split(/\s+/).forEach(tk => { const m = tk.match(/^(.+)\/(\d*\.?\d+)$/); if (!m) return; const len = parseFloat(m[2]); if (m[1] !== '-') ev.push({ t, len, v: vi, n: m[1].split('+') }); t += len; }); });
    ev.sort((a, b) => a.t - b.t); let i0 = 0; while (i0 < ev.length && ev[i0].t < intro - 1e-6) i0++;
    def._i0 = i0; return (def._ev = ev);
  }
  // sortie : gain général puis limiteur — la même chaîne sert au jeu et au rendu hors ligne
  function outChain(c) {
    const m = c.createGain(), lim = c.createDynamicsCompressor(); lim.threshold.value = -12; lim.knee.value = 8; lim.ratio.value = 8; lim.attack.value = 0.003; lim.release.value = 0.2;
    m.connect(lim); lim.connect(c.destination); return { master: m, lim };
  }
  function noiseBuf(c) {
    if (A.noise) return A.noise; const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0); let b = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b = (b + 0.04 * w) / 1.04; d[i] = w * 0.5 + b * 4; }
    return (A.noise = buf);
  }
  // bus musique : écho filtré (à la manière des consoles 16 bits) et salle synthétique, calculée, sans fichier
  function musicBus(c, dest) {
    const bus = c.createGain(), dl = c.createDelay(1), fb = c.createGain(), lp = c.createBiquadFilter(), wet = c.createGain();
    dl.delayTime.value = 0.27; fb.gain.value = 0.28; lp.type = 'lowpass'; lp.frequency.value = 2400; wet.gain.value = 0.14;
    bus.connect(dest); bus.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(dest);
    try { const cv = c.createConvolver(), rv = c.createGain(); cv.buffer = room(c); rv.gain.value = 0.22; bus.connect(cv); cv.connect(rv); rv.connect(dest); } catch (e) { /* pas de convolution : l'écho suffit */ }
    return bus;
  }
  function room(c) {
    const sr = c.sampleRate, n = Math.floor(sr * 1.6), pre = Math.floor(sr * 0.012), buf = c.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch); let y = 0, s = 9301 + ch * 4241;
      for (let i = pre; i < n; i++) { const x = (i - pre) / sr; s = (s * 1664525 + 1013904223) >>> 0; y += (0.5 - 0.42 * Math.min(1, x / 0.9)) * (s / 2147483648 - 1 - y); d[i] = y * Math.exp(-x / 0.26); }
    }
    return buf;
  }
  // Tables d'ondes : des spectres fixes (amplitude de chaque harmonique), comme les échantillons d'une console 16 bits.
  // L'éclat de l'attaque est une seconde couche, vite éteinte : aucun filtre à balayer, donc presque rien à calculer.
  const SPEC = {
    oud: [1, 0.72, 0.5, 0.38, 0.3, 0.2, 0.16, 0.1, 0.08, 0.05, 0.03, 0.02],
    harp: [1, 0.42, 0.22, 0.12, 0.07, 0.04, 0.02],
    brass: [1, 0.95, 0.8, 0.6, 0.5, 0.34, 0.24, 0.16, 0.11, 0.07, 0.05, 0.03],
    bass: [1, 0.62, 0.45, 0.3, 0.2, 0.12, 0.08, 0.05],
    contra: [1, 0.55, 0.3, 0.18, 0.1, 0.06, 0.03]
  };
  function table(c, name) {
    const key = '_w_' + name; if (c[key]) return c[key]; let re, im;
    if (name === 'pulse') {                         // rectangle à 25 % : le timbre nasal des synthés de console
      const N = 28; re = new Float32Array(N); im = new Float32Array(N);
      for (let n = 1; n < N; n++) { re[n] = 2 / (Math.PI * n) * Math.sin(Math.PI * n / 2); im[n] = 2 / (Math.PI * n) * (1 - Math.cos(Math.PI * n / 2)); }
    } else { const h = SPEC[name]; re = new Float32Array(h.length + 1); im = new Float32Array(h.length + 1); h.forEach((a, i) => { im[i + 1] = a; }); }
    return (c[key] = c.createPeriodicWave(re, im));
  }
  // niveau propre à chaque timbre : à `vol` égal, les timbres sonnent à peu près aussi fort (réglé par la mesure, docs/musique.md)
  const LEVEL = { pulse: 0.87, square: 0.59, triangle: 0.8, sine: 0.66, saw: 0.67, bass: 0.89, contra: 0.9, pluck: 0.9, harp: 1.03, bell: 1.06, flute: 0.92, strings: 0.49, pad: 0.55, brass: 0.71, timp: 1.3 };
  function hit(c, out, t, vol, hz, dur, type, q) {
    const n = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter(); n.buffer = noiseBuf(c);
    f.type = type || 'bandpass'; f.frequency.value = hz; f.Q.value = q || 1.2;
    env(g, t, 0.003, dur, vol); n.connect(f); f.connect(g); g.connect(out); n.start(t, Math.random() * 1.5); n.stop(t + dur + 0.08);
  }
  function thud(c, out, t, vol, f0, f1, dur) {
    const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.6);
    env(g, t, 0.004, dur, vol); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.08);
  }
  function tone(c, out, wave, f, t, dur, vol) {
    const g = c.createGain(), G = g.gain, o = c.createOscillator(), end = t + dur, hold = Math.max(t + 0.02, end - 0.01);
    let src = o, o2 = null, stop2 = 0, rel = 0.06, ring = 0, vib = 0, lvl;
    const osc2 = (shape, ratio, cents) => { o2 = c.createOscillator(); if (SPEC[shape]) o2.setPeriodicWave(table(c, shape)); else o2.type = shape; o2.frequency.value = f * (ratio || 1); if (cents) o2.detune.value = cents; return o2; };
    const via = (node, k) => { const lg = c.createGain(); lg.gain.value = k; node.connect(lg); lg.connect(g); return lg.gain; };           // une couche à son propre niveau
    const snap = (shape, k, len) => { const p = via(osc2(shape), k); p.setValueAtTime(k, t); p.exponentialRampToValueAtTime(0.001, t + len); stop2 = t + len + 0.02; };   // l'éclat de l'attaque
    const lp = hz => { const l = c.createBiquadFilter(); l.type = 'lowpass'; l.frequency.value = hz; l.Q.value = 0.7; return l; };
    // attaque, puis chute éventuelle vers un palier ; `lvl` retient le niveau tenu, d'où part le relâchement
    const ads = (a, d, s) => { a = Math.min(a, dur * 0.45); G.linearRampToValueAtTime(vol, t + a); lvl = vol; if (d && t + a + d < hold) { lvl = vol * s; G.linearRampToValueAtTime(lvl, t + a + d); } };
    // corde pincée, cloche, peau : la note sonne puis s'éteint d'elle-même
    const decay = (first, at, total) => { ring = total; G.linearRampToValueAtTime(vol, t + 0.004); if (first) G.exponentialRampToValueAtTime(vol * first, t + at); G.exponentialRampToValueAtTime(0.0002, t + total); };
    o.frequency.value = f; G.value = 0; G.setValueAtTime(0.0001, t); vol *= LEVEL[wave] || 1;   // gain nul avant l'attaque : sans cela, un échantillon peut passer à plein niveau
    switch (wave) {
      case 'pulse': o.setPeriodicWave(table(c, 'pulse')); ads(0.008, 0.08, 0.72); vib = 0.005; break;
      case 'square': o.type = 'square'; ads(0.008, 0.08, 0.72); vib = 0.004; break;
      case 'sine': o.type = 'sine'; ads(0.02); break;
      case 'saw': o.type = 'sawtooth'; src = lp(Math.min(3400, 1500 + f)); o.connect(src); ads(0.012); vib = 0.005; break;
      case 'bass': o.setPeriodicWave(table(c, 'bass')); snap('sawtooth', 0.5, 0.07); ads(0.005, 0.12, 0.7); rel = 0.05; break;
      case 'contra': o.setPeriodicWave(table(c, 'contra')); snap('oud', 0.35, 0.05); ads(0.006, 0.3, 0.6); rel = 0.1; break;
      case 'pluck': o.setPeriodicWave(table(c, 'oud')); snap('sawtooth', 0.45, 0.06); decay(0.09, Math.min(dur + 0.3, 1.1), Math.min(dur + 0.45, 1.25)); break;
      case 'harp': o.setPeriodicWave(table(c, 'harp')); snap('oud', 0.5, 0.1); decay(0.3, 0.3, Math.max(0.6, Math.min(dur + 0.7, 1.6))); break;
      case 'bell': o.type = 'sine'; via(osc2('sine', 2.76), 0.28); decay(0, 0, Math.max(0.5, Math.min(dur + 0.9, 2.2))); break;
      case 'flute': o.type = 'triangle'; ads(0.05, 0.15, 0.85); rel = 0.12; vib = 0.006; break;
      case 'strings': o.type = 'sawtooth'; o.detune.value = -6; src = lp(Math.min(2400, 1200 + f * 1.2)); o.connect(src); osc2('sawtooth', 1, 7).connect(src); ads(0.11); rel = 0.26; break;
      case 'pad': o.type = 'sawtooth'; o.detune.value = -9; src = lp(900); o.connect(src); osc2('sawtooth', 1, 9).connect(src); ads(0.3); rel = 0.45; break;
      case 'brass': {                               // le cuivre s'ouvre : la couche ronde cède la place à la couche brillante
        o.setPeriodicWave(table(c, 'brass')); src = c.createGain(); o.connect(src); src.gain.setValueAtTime(0.25, t); src.gain.linearRampToValueAtTime(1, t + 0.07);
        const m = via(osc2('triangle'), 0.9); m.setValueAtTime(0.9, t); m.linearRampToValueAtTime(0.3, t + 0.1); ads(0.03, 0.18, 0.86); rel = 0.09; vib = 0.004; break;
      }
      case 'timp': o.type = 'sine'; o.frequency.setValueAtTime(f * 1.5, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05); via(osc2('triangle', 2), 0.3); decay(0, 0, Math.max(0.45, Math.min(dur + 0.5, 1.3))); hit(c, out, t, vol * 0.3, 600, 0.05, 'lowpass'); break;
      default: o.type = 'triangle'; ads(0.01);
    }
    if (!ring) { G.setValueAtTime(lvl, hold); G.linearRampToValueAtTime(0.0001, end + rel); }
    src.connect(g); g.connect(out);
    const stop = (ring ? t + ring : end + rel) + 0.03;
    o.start(t); o.stop(stop); if (o2) { o2.start(t); o2.stop(stop2 || stop); }
    if (vib && dur > 0.42) {                        // vibrato retardé sur les notes tenues
      const lf = c.createOscillator(), lg = c.createGain(); lf.frequency.value = 5.4; lg.gain.value = 0; lg.gain.setValueAtTime(0, t + 0.16); lg.gain.linearRampToValueAtTime(f * vib, t + 0.42);
      lf.connect(lg); lg.connect(o.frequency); if (o2 && !stop2) lg.connect(o2.frequency); lf.start(t); lf.stop(stop);
    }
    if (wave === 'flute') {                         // souffle du roseau : un peu d'air à l'attaque, un filet ensuite
      const n = c.createBufferSource(), bp = c.createBiquadFilter(), ng = c.createGain(); n.buffer = noiseBuf(c); n.loop = true; bp.type = 'bandpass'; bp.frequency.value = Math.min(7000, f * 3); bp.Q.value = 0.8;
      ng.gain.value = 0; ng.gain.setValueAtTime(0.0001, t); ng.gain.linearRampToValueAtTime(vol * 0.3, t + 0.02); ng.gain.linearRampToValueAtTime(vol * 0.07, Math.min(t + 0.13, hold)); ng.gain.setValueAtTime(vol * 0.07, hold); ng.gain.linearRampToValueAtTime(0.0001, end + rel);
      n.connect(bp); bp.connect(ng); ng.connect(out); n.start(t, Math.random() * 1.5); n.stop(stop);
    }
  }
  function drum(c, out, n, t, vol) {
    switch (n) {
      case 'D': thud(c, out, t, vol * 1.35, 120, 50, 0.28); hit(c, out, t, vol * 0.45, 500, 0.05, 'lowpass'); break;          // dum : le centre de la peau
      case 'T': hit(c, out, t, vol * 0.75, 2400, 0.07, 'bandpass', 2.5); break;                                               // tek : le bord
      case 't': hit(c, out, t, vol * 0.35, 3400, 0.06, 'bandpass', 2.5); break;
      case 'r': hit(c, out, t, vol * 0.3, 7200, 0.08, 'highpass'); hit(c, out, t + 0.035, vol * 0.14, 9000, 0.05, 'highpass'); break;   // riq : cymbalettes
      case 'k': thud(c, out, t, vol * 1.6, 150, 46, 0.2); hit(c, out, t, vol * 0.3, 1800, 0.012, 'lowpass'); break;            // grosse caisse
      case 'b': thud(c, out, t, vol * 1.5, 92, 36, 0.6); hit(c, out, t, vol * 0.5, 320, 0.1, 'lowpass'); break;                // grand tambour
      case 'm': thud(c, out, t, vol * 1.25, 200, 100, 0.22); hit(c, out, t, vol * 0.2, 900, 0.04); break;                      // tom
      case 's': hit(c, out, t, vol * 1.1, 1600, 0.14, 'bandpass', 0.9); thud(c, out, t, vol * 0.5, 240, 170, 0.08); break;      // caisse claire : timbre et fût
      case 'h': hit(c, out, t, vol * 0.45, 8000, 0.04, 'highpass'); break;                                                     // charleston
      case 'c': hit(c, out, t, vol * 0.7, 4800, 0.9, 'highpass'); break;                                                       // cymbale
      case 'a': [[1245, 1], [2960, 0.6], [4410, 0.3]].forEach(p => { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = p[0]; env(g, t, 0.001, 0.14 + 0.2 * p[1], vol * 0.5 * p[1]); o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.5); });
        hit(c, out, t, vol * 0.6, 3000, 0.03, 'bandpass', 0.8); break;                                                         // enclume
    }
  }
  function voiceOuts(c, def, dest) { return def.voices.map(v => { if (!v.pan || !c.createStereoPanner) return dest; const p = c.createStereoPanner(); p.pan.value = v.pan; p.connect(dest); return p; }); }
  function play(c, outs, def, e, t, spb) {
    const v = def.voices[e.v], out = outs[e.v];
    if (v.wave === 'drums') { e.n.forEach(n => drum(c, out, n, t, v.vol)); return; }
    const dur = Math.max(0.04, e.len * spb * 0.94), vol = v.vol / Math.sqrt(e.n.length);
    e.n.forEach(n => { const f = freqOf(n); if (f) tone(c, out, v.wave, f, t, dur, vol); });
  }
  function endTrack(tc) {                           // fond la piste en cours, puis libère son bus
    const st = A.curTrack; if (!st) return; clearInterval(st.timer); A.curTrack = null;
    const now = A.ctx.currentTime; st.bus.gain.cancelScheduledValues(now); st.bus.gain.setTargetAtTime(0, now, tc || 0.09);
    setTimeout(() => { try { st.bus.disconnect(); } catch (e) { /* déjà libéré */ } }, 2500);
  }
  A.music = function (name) {
    A.wantTrack = name;
    if (!A.ctx || !A.mbus) return;
    if (A.curTrack && A.curTrack.name === name) return;
    endTrack();
    const def = I.music[name]; if (!def || !A.musicOn || name === 'silence') { A.hasMusic = false; return; }
    A.hasMusic = true; A.stopBeat();
    const c = A.ctx, ev = parseTrack(def), spb = 60 / def.bpm, intro = def.intro || 0, t0 = c.currentTime + 0.12, bus = c.createGain();
    A.mbus.gain.cancelScheduledValues(c.currentTime); A.mbus.gain.setTargetAtTime(MG, c.currentTime, 0.03); bus.connect(A.mbus);
    const st = { name, i: 0, base: t0, pass: 0, timer: 0, bus, outs: voiceOuts(c, def, bus), leave: false, errs: 0, net: 0 };
    const tick = () => {
      if (!A.ctx || A.curTrack !== st) return; const now = c.currentTime;
      if (st.leave && now >= t0 + intro * spb - 0.03) { const n = A._after; A._after = null; A.music(n && n !== name ? n : 'silence'); return; }
      if (now > st.base + def.beats * spb + 1) { if (intro) st.pass = 1; st.base = now + 0.1 - (st.pass ? intro * spb : 0); st.i = st.pass ? def._i0 : 0; } // onglet en veille : on repart proprement
      // L'avance : plus d'une seconde, pour qu'une minuterie retardée ou un affichage qui peine ne fasse pas de trou.
      // Courte pendant une intro : la piste qui suit la fanfare doit entrer au bon moment.
      const avance = intro && !st.pass ? 0.3 : AVANCE; let guard = 0;
      while (guard++ < 600) {
        if (st.i >= ev.length) { if (def._i0 >= ev.length) return; st.base += (def.beats - intro) * spb; st.i = def._i0; st.pass++; }
        const e = ev[st.i], t = st.base + e.t * spb; if (t > now + avance) break;
        if (st.leave && !st.pass && e.t >= intro - 1e-6) break;               // on s'en va après l'intro : rien de la boucle n'est lancé
        st.i++; if (t < now - 0.25) { A.stats.sautees++; continue; }          // trop tard pour être juste : on la saute
        play(c, st.outs, def, e, Math.max(t, now + 0.005), spb); A.stats.notes++;   // un peu en retard : jouée tout de suite
      }
      if (st.errs && now - st.net > 20) { st.errs = 0; A.repos = 0; }          // vingt secondes sans incident : l'ardoise est effacée
    };
    // Un incident ne coupe plus la musique pour la séance : au sixième sur la même piste, elle se tait un moment, puis la veille la relance.
    const sur = () => { try { tick(); } catch (e) { A.fails++; st.errs++; st.net = c.currentTime; if (A.fails === 1) I.report(e, 'son (séquenceur)'); if (st.errs > 5) { clearInterval(st.timer); if (A.curTrack === st) A.curTrack = null; souffler(); } } };
    st.sur = sur; st.timer = setInterval(sur, 70); A.curTrack = st; sur();
  };
  // Après des incidents répétés : une pause qui s'allonge (15 s, 30 s… deux minutes au plus), jamais une coupure définitive.
  function souffler() { A.repos = Math.min(120000, (A.repos || 7500) * 2); A.pauseJusqua = performance.now() + A.repos; }
  // La musique du lieu : une carte, un écran, ou l'humeur que le récit pose (opération `mus`). Tout le reste est de passage
  // (combat, fanfare, deuil, forge, pourparler) : A.back() ramène la piste du lieu, quelle qu'ait été la piste de passage.
  A.scene = function (name) { A.place = name; A.music(name); };
  A.back = function () { A.music(A.place || 'silence'); };
  // Poussé à chaque image par la boucle d'affichage : le séquenceur ne dépend plus des seules minuteries. Et si aucune piste
  // ne joue alors qu'une est voulue (contexte relancé, incident passé), elle repart.
  let veille = 0;
  A.pump = function () {
    const st = A.curTrack; if (st) { st.sur(); return; }
    if (!A.ctx || !A.mbus || !A.musicOn || A.ctx.state !== 'running') return;
    const now = performance.now(); if (now - veille < 2000 || now < (A.pauseJusqua || 0)) return; veille = now;
    const n = A.wantTrack; if (n && n !== 'silence' && I.music[n]) { A.stats.relances++; A.music(n); }
  };
  // battle.js pose `afterJingle` deux fois : avant la fanfare (la piste à reprendre), puis quand la carte de victoire se ferme.
  // Posé pendant que « victoire » joue, il veut dire « on s'en va » : la piste suivante entre dès que la fanfare est finie.
  Object.defineProperty(A, 'afterJingle', {
    configurable: true, enumerable: true, get() { return A._after || null; },
    set(v) { A._after = v || null; const st = A.curTrack; if (st && st.name === 'victoire') { st.leave = true; A.wantTrack = v || 'silence'; } }
  });
  A.setMusic = function (on) { A.musicOn = on; if (!A.ctx) return; if (!on) { endTrack(0.03); A.mbus.gain.setTargetAtTime(0, A.ctx.currentTime, 0.1); A.hasMusic = false; } else { const n = A.wantTrack; endTrack(0.03); if (n) A.music(n); } };
  // Rendu hors ligne d'une piste, avec les mêmes timbres, le même bus et le même limiteur : sert à mesurer les niveaux et la
  // charge de calcul. Comme en jeu, les notes sont posées au fil de l'eau (ici par tranches d'une demi-seconde).
  A.render = function (name, seconds) {
    const def = I.music[name], OC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!def || !OC) return Promise.reject(new Error('rendu indisponible'));
    const sr = 44100, spb = 60 / def.bpm, intro = def.intro || 0, loop = (def.beats - intro) * spb, len = seconds || def.beats * spb + loop + 2.5, step = 0.5, list = [];
    const c = new OC(2, Math.ceil(len * sr), sr), oc = outChain(c), bus = musicBus(c, oc.master), ev = parseTrack(def), outs = voiceOuts(c, def, bus);
    oc.master.gain.value = 0.8; bus.gain.value = MG;
    for (let base = 0.1, pass = 0; loop > 0 && base + (pass ? intro * spb : 0) < len; base += loop, pass++) ev.forEach(e => { const t = base + e.t * spb; if ((!pass || e.t >= intro - 1e-6) && t < len - 0.05) list.push({ t, e }); });
    list.sort((a, b) => a.t - b.t); let i = 0;
    const fill = until => { for (; i < list.length && list[i].t < until; i++) play(c, outs, def, list[i].e, list[i].t, spb); };
    fill(2 * step);
    for (let k = 1; k * step < len - 0.01; k++) c.suspend(k * step).then(() => { fill((k + 2) * step); c.resume(); });
    return c.startRendering();
  };


  A.stopBeat = function () { A.pendingRhythm = null; if (A.rhythm) { clearInterval(A.rhythm.timer); A.rhythm = null; } };

  // Le son ne doit jamais arrêter le jeu. Sur un appareil qui refuse une opération sonore, l'appel devient sans effet,
  // l'incident est retenu une fois (page Diagnostic). Une piste qui ne démarre pas se tait un moment, puis la veille la
  // relance : rien ne coupe plus la musique pour toute la séance, et un bruitage en échec ne la regarde pas.
  A.fails = 0;
  ['unlock', 'setOn', 'sfx', 'beat', 'stopBeat', 'music', 'setMusic', 'scene', 'back', 'pump', 'dum', 'tek'].forEach(k => {
    const fn = A[k]; if (typeof fn !== 'function') return;
    A[k] = function () {
      try { return fn.apply(A, arguments); }
      catch (e) {
        A.fails++; if (A.fails === 1) I.report(e, 'son (' + k + ')');
        if (k === 'music' || k === 'setMusic' || k === 'scene' || k === 'back') { try { if (A.curTrack) { clearInterval(A.curTrack.timer); A.curTrack = null; } } catch (x) { /* rien */ } souffler(); }
      }
    };
  });
  { const d = Object.getOwnPropertyDescriptor(A, 'afterJingle'); if (d && d.set) Object.defineProperty(A, 'afterJingle', { configurable: true, enumerable: true, get: d.get, set(v) { try { d.set.call(A, v); } catch (e) { A._after = v || null; A.fails++; if (A.fails === 1) I.report(e, 'son (enchaînement)'); } } }); }
})();
