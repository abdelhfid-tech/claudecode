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
    Escape: 'cancel', KeyX: 'cancel', Backspace: 'cancel', KeyM: 'menu', Tab: 'menu'
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
      opts: { sound: true, fast: false } };
  }
  I.save = {
    data: fresh(),
    load() {
      try { const raw = localStorage.getItem(SKEY); if (raw) { const d = JSON.parse(raw); if (d && d.v === 1) { this.data = Object.assign(fresh(), d); return true; } } } catch (e) { /* stockage indisponible */ }
      return false;
    },
    store() { try { localStorage.setItem(SKEY, JSON.stringify(this.data)); } catch (e) { /* ignore */ } },
    reset() { const o = this.data.opts; this.data = fresh(); this.data.opts = o; this.store(); },
    exists() { try { return !!localStorage.getItem(SKEY) && this.data.started; } catch (e) { return false; } }
  };

  /* ---------- son : ambiances (bruit filtré) + percussions (duff) + bruitages. Pas d'instrument mélodique. ---------- */
  const A = I.audio = { ctx: null, on: true, master: null, ambNode: null, ambName: null, rhythm: null };
  A.unlock = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      A.ctx = new AC();
      A.master = A.ctx.createGain(); A.master.gain.value = A.on ? 0.8 : 0; A.master.connect(A.ctx.destination);
      const len = A.ctx.sampleRate * 2; A.noise = A.ctx.createBuffer(1, len, A.ctx.sampleRate);
      const d = A.noise.getChannelData(0); let b = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b = (b + 0.04 * w) / 1.04; d[i] = w * 0.5 + b * 4; }
      if (A.pendingAmb) { const n = A.pendingAmb; A.pendingAmb = null; A.amb(n); }
      if (A.pendingRhythm) { const n = A.pendingRhythm; A.pendingRhythm = null; A.beat(n); }
    } catch (e) { A.ctx = null; }
  };
  A.setOn = function (v) { A.on = v; if (A.master) A.master.gain.setTargetAtTime(v ? 0.8 : 0, A.ctx.currentTime, 0.05); };
  function noiseSrc(loop) { const s = A.ctx.createBufferSource(); s.buffer = A.noise; s.loop = !!loop; return s; }
  function env(g, t, a, d, peak) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  // percussions
  A.dum = function (t, vol, pitch) {
    if (!A.ctx) return; t = t || A.ctx.currentTime; const o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime((pitch || 120), t); o.frequency.exponentialRampToValueAtTime((pitch || 120) * 0.42, t + 0.16);
    env(g, t, 0.004, 0.28, (vol || 1) * 0.9); o.connect(g); g.connect(A.master); o.start(t); o.stop(t + 0.4);
    const n = noiseSrc(), ng = A.ctx.createGain(), f = A.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    env(ng, t, 0.002, 0.05, (vol || 1) * 0.3); n.connect(f); f.connect(ng); ng.connect(A.master); n.start(t, Math.random()); n.stop(t + 0.1);
  };
  A.tek = function (t, vol, freq) {
    if (!A.ctx) return; t = t || A.ctx.currentTime; const n = noiseSrc(), g = A.ctx.createGain(), f = A.ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = freq || 2600; f.Q.value = 2.5; env(g, t, 0.001, 0.07, (vol || 1) * 0.5);
    n.connect(f); f.connect(g); g.connect(A.master); n.start(t, Math.random()); n.stop(t + 0.12);
  };
  A.noiseHit = function (t, vol, freq, dur, type, sweep) {
    if (!A.ctx) return; t = t || A.ctx.currentTime; const n = noiseSrc(), g = A.ctx.createGain(), f = A.ctx.createBiquadFilter();
    f.type = type || 'bandpass'; f.frequency.setValueAtTime(freq, t); if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t + dur); f.Q.value = 1.2;
    env(g, t, 0.005, dur, vol); n.connect(f); f.connect(g); g.connect(A.master); n.start(t, Math.random()); n.stop(t + dur + 0.1);
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
  A.stopBeat = function () { A.pendingRhythm = null; if (A.rhythm) { clearInterval(A.rhythm.timer); A.rhythm = null; } };
})();
