/* ISNAD — socle : espace de noms, utilitaires, entrées, sauvegarde, son. */
(function () {
  'use strict';
  const D = window.ISNAD_DEFS;
  const I = window.ISNAD = {
    D, sagas: {}, sagaList: [],
    registerSaga(s) { this.sagas[s.id] = s; this.sagaList.push(s); this.sagaList.sort((a, b) => a.order - b.order); },
    speed: 1, debug: {}
  };

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
    Escape: 'cancel', KeyX: 'cancel', Backspace: 'cancel', KeyM: 'menu', Tab: 'menu', KeyB: 'build', KeyC: 'prev', KeyV: 'next'
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
      items: { dattes: 3, eau: 1, musc: 1, lait: 1 }, codex: [], isnad: { ok: 0, total: 0 }, cp: null,
      opts: { sound: true, music: true, low: false }, citadel: { priere: 1, savoir: 1, justice: 1, lien: 1 }, veillees: {}, rencontres: {}, parley: { won: 0, total: 0 } };
  }
  // La progression ne s'écrit que dans une mosquée (trois emplacements). Les options, elles, se gardent à part.
  const OKEY = 'isnad.opts.v1', SLOT = n => 'isnad.slot.' + n;
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
    reset() { const o = this.data.opts; this.data = fresh(); this.data.opts = Object.assign(this.data.opts, o); }
  };

  /* ---------- son : ambiances (bruit filtré) + percussions (duff) + bruitages. Pas d'instrument mélodique. ---------- */
  const A = I.audio = { ctx: null, on: true, master: null, ambNode: null, ambName: null, rhythm: null };
  A.unlock = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      A.ctx = new AC();
      A.master = A.ctx.createGain(); A.master.gain.value = A.on ? 0.8 : 0;
      const lim = A.ctx.createDynamicsCompressor(); lim.threshold.value = -12; lim.knee.value = 8; lim.ratio.value = 8; lim.attack.value = 0.003; lim.release.value = 0.2; A.master.connect(lim); lim.connect(A.ctx.destination);
      const len = A.ctx.sampleRate * 2; A.noise = A.ctx.createBuffer(1, len, A.ctx.sampleRate);
      const d = A.noise.getChannelData(0); let b = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b = (b + 0.04 * w) / 1.04; d[i] = w * 0.5 + b * 4; }
      if (A.pendingAmb) { const n = A.pendingAmb; A.pendingAmb = null; A.amb(n); }
      if (A.pendingRhythm) { const n = A.pendingRhythm; A.pendingRhythm = null; A.beat(n); }
      A.mbus = A.ctx.createGain(); A.mbus.gain.value = A.musicOn ? 0.26 : 0; A.mbus.connect(A.master);
      const dl = A.ctx.createDelay(1), fb = A.ctx.createGain(), wet = A.ctx.createGain(); dl.delayTime.value = 0.29; fb.gain.value = 0.26; wet.gain.value = 0.22; A.mbus.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(A.master);
      if (A.wantTrack) { const n = A.wantTrack; A.curTrack = null; A.music(n); }
    } catch (e) { A.ctx = null; }
  };
  A.setOn = function (v) { A.on = v; if (A.master) A.master.gain.setTargetAtTime(v ? 0.8 : 0, A.ctx.currentTime, 0.05); };
  function noiseSrc(loop) { const s = A.ctx.createBufferSource(); s.buffer = A.noise; s.loop = !!loop; return s; }
  function env(g, t, a, d, peak) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
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
      case 'wind': A.noiseHit(t, 0.5, 300, 1.4, 'bandpass', 900); break;
      case 'door': A.dum(t, 0.6, 80); A.noiseHit(t, 0.3, 400, 0.2, 'lowpass'); break;
      case 'crowd': A.noiseHit(t, 0.4, 600, 1.2, 'bandpass', 500); break;
      case 'wave': A.noiseHit(t, 0.5, 250, 1.6, 'lowpass', 700); break;
      case 'glitch': for (let i = 0; i < 5; i++) A.tek(t + Math.random() * 0.25, 0.4, 800 + Math.random() * 6000); break;
      case 'dark': A.noiseHit(t, 0.6, 200, 0.5, 'lowpass', 60); break;
      case 'step': A.noiseHit(t, 0.06, 500, 0.05, 'lowpass'); break;
    }
  };
  // ambiances : chaînes bruit -> filtre -> gain modulé
  const AMB = {
    vent: [{ f: 420, q: 0.8, g: 0.22, lfo: 0.13, depth: 0.14 }, { f: 1500, q: 1.5, g: 0.04, lfo: 0.21, depth: 0.03 }],
    nuit: [{ f: 300, q: 0.7, g: 0.10, lfo: 0.09, depth: 0.06 }, { f: 5200, q: 9, g: 0.012, lfo: 5.5, depth: 0.012 }],
    foule: [{ f: 520, q: 1.1, g: 0.14, lfo: 0.7, depth: 0.07 }, { f: 950, q: 2, g: 0.05, lfo: 1.3, depth: 0.04 }],
    feu: [{ f: 180, q: 0.7, g: 0.16, lfo: 3.1, depth: 0.08 }, { f: 3200, q: 3, g: 0.03, lfo: 9, depth: 0.03 }],
    mer: [{ f: 320, q: 0.5, g: 0.22, lfo: 0.16, depth: 0.2 }, { f: 2400, q: 0.8, g: 0.03, lfo: 0.16, depth: 0.03 }],
    noos: [{ f: 140, q: 3, g: 0.2, lfo: 0.07, depth: 0.1 }, { f: 3800, q: 6, g: 0.02, lfo: 0.3, depth: 0.02 }],
    cite: [{ f: 5200, q: 0.4, g: 0.05, lfo: 0.3, depth: 0.02 }, { f: 110, q: 2, g: 0.2, lfo: 0.05, depth: 0.08 }],
    bataille: [{ f: 150, q: 0.8, g: 0.24, lfo: 0.9, depth: 0.14 }, { f: 700, q: 1, g: 0.06, lfo: 0.4, depth: 0.05 }],
    silence: []
  };
  A.amb = function (name) {
    if (!A.ctx) { A.pendingAmb = name; return; }
    if (A.ambName === name) return; A.ambName = name;
    const t = A.ctx.currentTime;
    if (A.ambNode) { const old = A.ambNode; old.gain.gain.setTargetAtTime(0, t, 0.5); setTimeout(() => { old.stop(); }, 2500); }
    const out = A.ctx.createGain(); out.gain.value = 0; out.connect(A.master); out.gain.setTargetAtTime(1, t, 0.8);
    const nodes = [];
    (AMB[name] || []).forEach(c => {
      const n = noiseSrc(true), f = A.ctx.createBiquadFilter(), g = A.ctx.createGain(), l = A.ctx.createOscillator(), lg = A.ctx.createGain();
      f.type = 'bandpass'; f.frequency.value = c.f; f.Q.value = c.q; g.gain.value = c.g; l.frequency.value = c.lfo; lg.gain.value = c.depth;
      l.connect(lg); lg.connect(g.gain); n.connect(f); f.connect(g); g.connect(out); n.start(0, Math.random() * 1.5); l.start(); nodes.push(n, l);
    });
    A.ambNode = { gain: out, stop() { nodes.forEach(n => { try { n.stop(); } catch (e) { /* déjà arrêté */ } }); out.disconnect(); } };
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
  /* ---------- musique : séquenceur multi-voix (timbres synthétisés, façon 16 bits) ---------- */
  I.music = {}; I.registerMusic = function (name, def) { I.music[name] = def; };
  A.musicOn = true; A.curTrack = null; A.wantTrack = null;
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freqOf(n) { const m = n.match(/^([A-G])(#|b)?(\d)$/); if (!m) return 0; const midi = 12 * (+m[3] + 1) + SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); return 440 * Math.pow(2, (midi - 69) / 12); }
  function parseTrack(def) {
    if (def._ev) return def._ev; const ev = [];
    def.voices.forEach((v, vi) => { let t = 0; String(v.notes || '').trim().split(/\s+/).forEach(tk => { const m = tk.match(/^(.+)\/(\d*\.?\d+)$/); if (!m) return; const len = parseFloat(m[2]); if (m[1] !== '-') ev.push({ t, len, v: vi, n: m[1].split('+') }); t += len; }); });
    ev.sort((a, b) => a.t - b.t); return (def._ev = ev);
  }
  function tone(wave, f, t, dur, vol) {
    const c = A.ctx, g = c.createGain(), o = c.createOscillator(); let last = o, extra = null;
    const rel = wave === 'strings' ? 0.22 : wave === 'flute' ? 0.12 : 0.06, end = t + dur;
    o.frequency.setValueAtTime(f, t);
    switch (wave) {
      case 'pulse': case 'square': o.type = 'square'; vol *= 0.5; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.linearRampToValueAtTime(vol * 0.7, t + 0.09); break;
      case 'triangle': o.type = 'triangle'; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); break;
      case 'sine': o.type = 'sine'; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); break;
      case 'saw': { o.type = 'sawtooth'; vol *= 0.5; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1900; o.connect(lp); last = lp; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.012); break; }
      case 'pluck': { o.type = 'sawtooth'; vol *= 0.7; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(500, t + 0.3); o.connect(lp); last = lp; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * 0.08), t + Math.min(dur + 0.3, 1.1)); break; }
      case 'bell': { o.type = 'sine'; vol *= 0.7; extra = c.createOscillator(); extra.type = 'sine'; extra.frequency.value = f * 2.76; const eg = c.createGain(); eg.gain.value = 0.28; extra.connect(eg); eg.connect(g); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0002, t + Math.max(0.5, Math.min(dur + 0.9, 2.2))); break; }
      case 'flute': { o.type = 'triangle'; const lf = c.createOscillator(), lg = c.createGain(); lf.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.006, t + Math.min(0.35, dur)); lf.connect(lg); lg.connect(o.frequency); lf.start(t); lf.stop(end + rel + 0.05); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.05); g.gain.linearRampToValueAtTime(vol * 0.85, t + 0.2); break; }
      case 'strings': { o.type = 'sawtooth'; vol *= 0.42; extra = c.createOscillator(); extra.type = 'sawtooth'; extra.frequency.value = f * 1.006; const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; o.connect(lp); extra.connect(lp); last = lp; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(0.12, dur * 0.5)); break; }
      default: o.type = 'triangle'; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.01);
    }
    if (wave !== 'pluck' && wave !== 'bell') { g.gain.setValueAtTime(g.gain.value || vol, Math.max(t + 0.02, end - 0.01)); g.gain.linearRampToValueAtTime(0.0001, end + rel); }
    last.connect(g); g.connect(A.mbus);
    const stop = wave === 'bell' ? t + Math.max(0.6, Math.min(dur + 1, 2.4)) : wave === 'pluck' ? t + Math.min(dur + 0.4, 1.2) : end + rel + 0.03;
    o.start(t); o.stop(stop); if (extra) { extra.start(t); extra.stop(stop); }
  }
  function drum(n, t, vol) {
    switch (n) {
      case 'D': A.dum(t, vol * 1.5, 120, A.mbus); break;
      case 'T': A.tek(t, vol * 1.5, 2400, A.mbus); break;
      case 't': A.tek(t, vol * 0.7, 3400, A.mbus); break;
      case 'k': A.dum(t, vol * 1.7, 66, A.mbus); break;
      case 's': A.noiseHit(t, vol * 1.3, 1900, 0.13, 'bandpass', 900, A.mbus); break;
      case 'h': A.noiseHit(t, vol * 0.5, 8000, 0.04, 'highpass', 0, A.mbus); break;
      case 'c': A.noiseHit(t, vol * 0.8, 6000, 0.5, 'highpass', 3000, A.mbus); break;
    }
  }
  A.music = function (name) {
    A.wantTrack = name;
    if (!A.ctx || !A.mbus) return;
    if (A.curTrack && A.curTrack.name === name) return;
    if (A.curTrack) { clearInterval(A.curTrack.timer); A.curTrack = null; }
    const def = I.music[name]; if (!def || !A.musicOn || name === 'silence') { A.hasMusic = false; return; }
    A.hasMusic = true; A.stopBeat();
    const ev = parseTrack(def), spb = 60 / def.bpm, once = name === 'victoire';
    const st = { name, i: 0, loop0: A.ctx.currentTime + 0.12, timer: 0 };
    A.mbus.gain.cancelScheduledValues(A.ctx.currentTime); A.mbus.gain.setValueAtTime(0.0001, A.ctx.currentTime); A.mbus.gain.linearRampToValueAtTime(0.26, A.ctx.currentTime + 0.5);
    const tick = () => {
      if (!A.ctx || A.curTrack !== st) return; const now = A.ctx.currentTime;
      if (now > st.loop0 + def.beats * spb + 1) { st.loop0 = now + 0.1; st.i = 0; } // onglet en veille : on repart proprement
      let guard = 0;
      while (guard++ < 400) {
        if (st.i >= ev.length) { if (once) { if (now > st.loop0 + def.beats * spb) { clearInterval(st.timer); A.curTrack = null; if (A.afterJingle) { const n = A.afterJingle; A.afterJingle = null; A.music(n); } } return; } st.loop0 += def.beats * spb; st.i = 0; if (!ev.length) return; }
        const e = ev[st.i], t = st.loop0 + e.t * spb; if (t > now + 0.3) break; st.i++;
        if (t < now - 0.05) continue;
        const v = def.voices[e.v], dur = Math.max(0.04, e.len * spb * 0.94);
        if (v.wave === 'drums') e.n.forEach(n => drum(n, t, v.vol)); else e.n.forEach(n => { const f = freqOf(n); if (f) tone(v.wave, f, t, dur, v.vol / Math.sqrt(e.n.length)); });
      }
    };
    st.timer = setInterval(tick, 70); A.curTrack = st; tick();
  };
  A.setMusic = function (on) { A.musicOn = on; if (!A.ctx) return; if (!on) { if (A.curTrack) { clearInterval(A.curTrack.timer); A.curTrack = null; } A.mbus.gain.setTargetAtTime(0, A.ctx.currentTime, 0.1); A.hasMusic = false; } else { const n = A.wantTrack; A.curTrack = null; if (n) A.music(n); } };

  A.stopBeat = function () { A.pendingRhythm = null; if (A.rhythm) { clearInterval(A.rhythm.timer); A.rhythm = null; } };
})();
