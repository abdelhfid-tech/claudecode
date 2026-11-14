/* ISNAD — bande-son originale (toutes les mélodies sont composées pour le jeu).
   Une piste = ISNAD.registerMusic(nom, { bpm, beats, voices: [{ wave, vol, notes }] }).
   Jeton = hauteur/durée en temps ; accord = notes jointes par + ; silence = -.
   Le motif de la Chaîne (ré – la – sol – fa# – ré) revient dans titre, chaine, desert, citadelle, boss, espoir, victoire. */
(function () {
  'use strict';
  const R = (ISNAD.registerMusic || function () {}).bind(ISNAD);
  const sum = s => s.trim().split(/\s+/).reduce((a, t) => a + parseFloat(t.slice(t.lastIndexOf('/') + 1)), 0);
  // B(longueur, ...mesures) : joint les mesures et signale toute mesure mal comptée
  const B = (len, ...bars) => {
    bars.forEach((b, i) => { if (Math.abs(sum(b) - len) > 0.001) console.warn('musique : mesure ' + (i + 1) + ' = ' + sum(b) + ' temps au lieu de ' + len + ' → ' + b); });
    return bars.join(' ');
  };
  const N = (s, n) => Array(n).fill(s);                       // n fois la même mesure
  const E = (...n) => n.map(x => x + '/.5').join(' ');        // suite de croches
  const pick = (map, prog) => prog.split(' ').map(k => map[k]);

  const MOTIF = 'D4/1 A4/1 G4/.5 F#4/.5 D4/1';
  const MOTIF5 = 'D5/1 A5/1 G5/.5 F#5/.5 D5/1';

  /* ---------- titre : grave puis ample — ré, seconde augmentée (ré mib fa# sol la sib do) ---------- */
  (function () {
    const ch = { D: 'D3+F#3+A3/4', Eb: 'Eb3+G3+Bb3/4', Gm: 'G3+Bb3+D4/4', Cm: 'C3+Eb3+G3/4', CD: 'C3+Eb3+G3/2 D3+F#3+A3/2' };
    const ar = { D: E('D3', 'A3', 'D4', 'F#4', 'A4', 'F#4', 'D4', 'A3'), Eb: E('Eb3', 'Bb3', 'Eb4', 'G4', 'Bb4', 'G4', 'Eb4', 'Bb3'), Gm: E('G3', 'D4', 'G4', 'Bb4', 'D5', 'Bb4', 'G4', 'D4'), Cm: E('C3', 'G3', 'C4', 'Eb4', 'G4', 'Eb4', 'C4', 'G3') };
    const bs = { D: 'D2/1.5 D2/.5 A2/1 D2/1', Eb: 'Eb2/1.5 Eb2/.5 Bb2/1 Eb2/1', Gm: 'G2/1.5 G2/.5 D2/1 G2/1', Cm: 'C2/1.5 C2/.5 G2/1 C2/1' };
    R('titre', { bpm: 76, beats: 64, voices: [
      { wave: 'flute', vol: 0.5, notes: B(4,
        MOTIF, 'Eb4/1 F#4/1 G4/2', MOTIF, 'C4/1 Eb4/1 D4/2',
        'A4/1 Bb4/1 A4/.5 G4/.5 F#4/1', 'G4/1 A4/1 Bb4/2', 'C5/1 Bb4/1 A4/.5 G4/.5 F#4/1', 'G4/1 F#4/1 D4/2',
        MOTIF5, 'Eb5/.5 F#5/.5 G5/1 A5/2', 'Bb5/1 A5/1 G5/.5 F#5/.5 G5/1', 'A5/2 D5/2',
        'C5/1 D5/1 Eb5/.5 F#5/.5 G5/1', 'A5/1.5 G5/.5 F#5/1 Eb5/1', 'D5/1 A4/1 G4/.5 F#4/.5 Eb4/1', 'D4/4') },
      { wave: 'strings', vol: 0.25, notes: B(4, ...pick(ch, 'D Eb D CD D Gm Cm D D Eb Gm D Cm Gm D D')) },
      { wave: 'pluck', vol: 0.24, notes: B(4, ...N('-/4', 8), ...pick(ar, 'D Eb Gm D Cm Gm D'), 'D3/.5 A3/.5 D4/.5 F#4/.5 A4/2') },
      { wave: 'triangle', vol: 0.4, notes: B(4, 'D2/4', 'Eb2/4', 'D2/4', 'C2/2 D2/2', 'D2/4', 'G2/4', 'C2/4', 'D2/4', ...pick(bs, 'D Eb Gm D Cm Gm D'), 'D2/4') },
      { wave: 'drums', vol: 0.32, notes: B(4, ...N('D/2 t/1 t/1', 8), ...N('D/1 T/.5 t/.5 D/.5 t/.5 T/1', 7), 'D/1 T/1 D/2') }
    ] });
  })();

  /* ---------- chaine : suspendu, cloches et cordes ---------- */
  R('chaine', { bpm: 66, beats: 32, voices: [
    { wave: 'bell', vol: 0.5, notes: B(4, MOTIF5, '-/1 A4/1 D5/2', 'Eb5/1 G5/1 F#5/.5 Eb5/.5 D5/1', '-/2 A4/2', MOTIF5, '-/1 Bb4/1 A4/2', 'G4/1 A4/1 Bb4/.5 A4/.5 F#4/1', 'D4/4') },
    { wave: 'strings', vol: 0.25, notes: B(4, 'D3+A3/4', 'D3+A3/4', 'Eb3+Bb3/4', 'D3+A3/4', 'D3+F#3+A3/4', 'G3+Bb3+D4/4', 'C3+Eb3+G3/4', 'D3+A3/4') },
    { wave: 'sine', vol: 0.2, notes: B(4, 'A4/4', 'A4/4', 'Bb4/4', 'A4/4', 'A4/4', 'A4/4', 'G4/4', 'A4/4') },
    { wave: 'triangle', vol: 0.38, notes: B(4, 'D2/4', 'D2/4', 'Eb2/4', 'D2/4', 'D2/4', 'G2/4', 'C2/4', 'D2/4') }
  ] });

  /* ---------- medine : paisible, flûte et oud — sol mineur ---------- */
  (function () {
    const ar = { Gm: E('G3', 'D4', 'G4', 'D4', 'Bb3', 'D4', 'G4', 'D4'), Bb: E('Bb2', 'F3', 'Bb3', 'F3', 'D3', 'F3', 'Bb3', 'F3'), Eb: E('Eb3', 'Bb3', 'Eb4', 'Bb3', 'G3', 'Bb3', 'Eb4', 'Bb3'), F: E('F3', 'C4', 'F4', 'C4', 'A3', 'C4', 'F4', 'C4'), D: E('D3', 'A3', 'D4', 'A3', 'F#3', 'A3', 'D4', 'A3') };
    R('medine', { bpm: 92, beats: 32, voices: [
      { wave: 'flute', vol: 0.5, notes: B(4, 'D5/1 Eb5/.5 D5/.5 C5/1 Bb4/1', 'A4/.5 Bb4/.5 C5/1 D5/2', 'G5/1 F5/.5 Eb5/.5 D5/1 C5/1', 'Bb4/1 A4/1 G4/2', 'Bb4/1 C5/.5 D5/.5 Eb5/1 D5/1', 'C5/.5 Bb4/.5 A4/1 Bb4/2', 'D5/1 C5/.5 Bb4/.5 A4/1 F#4/1', 'G4/3 -/1') },
      { wave: 'pluck', vol: 0.28, notes: B(4, ...pick(ar, 'Gm Bb Eb Gm Eb F D Gm')) },
      { wave: 'triangle', vol: 0.4, notes: B(4, 'G2/2 G2/2', 'Bb2/2 Bb2/2', 'Eb2/2 Eb2/2', 'G2/2 D2/2', 'Eb2/2 Eb2/2', 'F2/2 F2/2', 'D2/2 D2/2', 'G2/4') },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('D/1 -/.5 t/.5 T/1 t/1', 8)) }
    ] });
  })();

  /* ---------- nuit : dépouillé — ré, seconde mineure ---------- */
  R('nuit', { bpm: 60, beats: 32, voices: [
    { wave: 'flute', vol: 0.48, notes: B(4, '-/2 A4/1 Bb4/1', 'A4/3 -/1', '-/1 D5/1 C5/1 Bb4/1', 'A4/4', '-/2 G4/1 A4/1', 'Bb4/2 A4/1 G4/1', 'F4/1 Eb4/1 D4/2', 'D4/2 -/2') },
    { wave: 'sine', vol: 0.22, notes: B(4, 'D4+A4/4', 'D4+A4/4', 'G3+D4/4', 'A3+D4/4', 'D4+A4/4', 'D4+A4/4', 'Eb4+G4/4', 'D4+A4/4') },
    { wave: 'bell', vol: 0.2, notes: B(4, '-/4', '-/2 D5/2', '-/4', '-/2 A4/2', '-/4', '-/2 D5/2', '-/4', '-/2 A4/2') },
    { wave: 'triangle', vol: 0.36, notes: B(4, 'D2/4', 'D2/4', 'G2/4', 'A2/4', 'D2/4', 'D2/4', 'Eb2/4', 'D2/4') }
  ] });

  /* ---------- desert : marche lente ---------- */
  (function () {
    const ar = { D: E('D3', 'A3', 'D4', 'A3', 'D3', 'A3', 'D4', 'A3'), Eb: E('Eb3', 'Bb3', 'Eb4', 'Bb3', 'Eb3', 'Bb3', 'Eb4', 'Bb3'), Gm: E('G3', 'D4', 'G4', 'D4', 'G3', 'D4', 'G4', 'D4') };
    const bs = { D: 'D2/1 -/1 D2/1 A2/1', Eb: 'Eb2/1 -/1 Eb2/1 Bb2/1', Gm: 'G2/1 -/1 G2/1 D2/1' };
    const prog = 'D Eb D D D Gm D D Gm D Eb';
    R('desert', { bpm: 72, beats: 48, voices: [
      { wave: 'flute', vol: 0.5, notes: B(4, 'D4/2 Eb4/1 F#4/1', 'G4/2 F#4/1 Eb4/1', MOTIF, 'D4/3 -/1', 'A4/2 Bb4/1 C5/1', 'Bb4/1 A4/1 G4/2', 'F#4/1 G4/1 A4/1 Bb4/1', 'A4/3 -/1', 'D5/2 C5/1 Bb4/1', 'A4/1 G4/1 F#4/2', 'G4/1 F#4/1 Eb4/1 F#4/1', 'D4/4') },
      { wave: 'pluck', vol: 0.26, notes: B(4, ...pick(ar, prog), ar.D) },
      { wave: 'triangle', vol: 0.42, notes: B(4, ...pick(bs, prog), 'D2/4') },
      { wave: 'drums', vol: 0.34, notes: B(4, ...N('D/1 t/.5 t/.5 D/1 T/1', 12)) }
    ] });
  })();

  /* ---------- camp : veillée d'armes — la, seconde mineure ---------- */
  R('camp', { bpm: 80, beats: 32, voices: [
    { wave: 'flute', vol: 0.48, notes: B(4, 'E4/1.5 F4/.5 E4/1 D4/1', 'C4/1 D4/1 E4/2', 'A4/1.5 G4/.5 F4/1 E4/1', 'F4/1 E4/1 D4/2', 'E4/1.5 F4/.5 G4/1 A4/1', 'Bb4/1 A4/1 G4/2', 'F4/1 E4/1 D4/1 C4/1', 'A4/3 -/1') },
    { wave: 'strings', vol: 0.24, notes: B(4, 'A3+C4+E4/4', 'A3+C4+E4/4', 'F3+A3+C4/4', 'D3+F3+A3/4', 'A3+C4+E4/4', 'Bb3+D4+F4/4', 'D3+F3+A3/4', 'A3+C4+E4/4') },
    { wave: 'triangle', vol: 0.4, notes: B(4, 'A2/2 E2/2', 'A2/2 E2/2', 'F2/2 C2/2', 'D2/2 A2/2', 'A2/2 E2/2', 'Bb2/2 F2/2', 'D2/2 D2/2', 'A2/4') },
    { wave: 'drums', vol: 0.32, notes: B(4, ...N('D/1.5 D/.5 T/1 t/1', 8)) }
  ] });

  /* ---------- rome : solennel — ré dorien ---------- */
  R('rome', { bpm: 70, beats: 48, voices: [
    { wave: 'saw', vol: 0.45, notes: B(4, 'D4/2 A4/2', 'G4/1 F4/1 E4/2', 'F4/1 G4/1 A4/1 B4/1', 'C5/2 A4/2', 'D5/2 C5/1 B4/1', 'A4/1 G4/1 A4/2', 'F4/1 E4/1 D4/1 E4/1', 'E4/3 -/1', 'D4/1 F4/1 A4/1 D5/1', 'C5/1.5 B4/.5 A4/2', 'G4/1 F4/1 E4/2', 'D4/4') },
    { wave: 'strings', vol: 0.26, notes: B(4, 'D3+F3+A3/4', 'C3+E3+G3/4', 'F3+A3+C4/4', 'A3+C4+E4/4', 'G3+B3+D4/4', 'A3+C4+E4/4', 'D3+F3+A3/4', 'A3+C4+E4/4', 'D3+F3+A3/4', 'F3+A3+C4/4', 'C3+E3+G3/4', 'D3+F3+A3/4') },
    { wave: 'triangle', vol: 0.42, notes: B(4, 'D2/2 D2/2', 'C2/2 C2/2', 'F2/2 F2/2', 'A2/2 A2/2', 'G2/2 G2/2', 'A2/2 A2/2', 'D2/2 D2/2', 'A2/2 E2/2', 'D2/2 D2/2', 'F2/2 F2/2', 'C2/2 C2/2', 'D2/4') },
    { wave: 'drums', vol: 0.33, notes: B(4, ...N('k/2 k/1 k/1', 11), 'k/2 c/2') }
  ] });

  /* ---------- palais : faste persan — ré, deux secondes augmentées (ré mib fa# sol la sib do#) ---------- */
  (function () {
    const bs = { D: 'D2/1 D2/.5 D2/.5 A2/1 D2/1', Eb: 'Eb2/1 Eb2/.5 Eb2/.5 Bb2/1 Eb2/1', Gm: 'G2/1 G2/.5 G2/.5 D2/1 G2/1', A: 'A2/1 A2/.5 A2/.5 G2/1 A2/1' };
    R('palais', { bpm: 100, beats: 32, voices: [
      { wave: 'pluck', vol: 0.5, notes: B(4, 'D5/.5 Eb5/.5 F#5/1 G5/.5 F#5/.5 Eb5/1', 'D5/1 C#5/.5 D5/.5 Eb5/2', 'F#5/.5 G5/.5 A5/1 Bb5/.5 A5/.5 G5/1', 'F#5/1 Eb5/1 D5/2', 'A4/.5 Bb4/.5 C#5/1 D5/.5 Eb5/.5 F#5/1', 'G5/1 F#5/.5 Eb5/.5 D5/2', 'Eb5/.5 D5/.5 C#5/1 Bb4/.5 A4/.5 C#5/1', 'D5/3 -/1') },
      { wave: 'strings', vol: 0.24, notes: B(4, 'D3+F#3+A3/4', 'Eb3+G3+Bb3/4', 'D3+F#3+A3/4', 'D3+F#3+A3/4', 'D3+F#3+A3/4', 'G3+Bb3+D4/4', 'A3+C#4+G4/4', 'D3+F#3+A3/4') },
      { wave: 'triangle', vol: 0.4, notes: B(4, ...pick(bs, 'D Eb D D D Gm A'), 'D2/2 D2/2') },
      { wave: 'drums', vol: 0.34, notes: B(4, ...N('D/1 t/.5 T/.5 D/.5 D/.5 T/1', 8)) }
    ] });
  })();

  /* ---------- mer : balancement à 6/8 (un temps = une croche) — la dorien ---------- */
  (function () {
    const ar = { Am: 'A3/1 C4/1 E4/1 A3/1 C4/1 E4/1', Em: 'E3/1 G3/1 B3/1 E3/1 G3/1 B3/1', C: 'C4/1 E4/1 G4/1 C4/1 E4/1 G4/1', G: 'G3/1 B3/1 D4/1 G3/1 B3/1 D4/1' };
    R('mer', { bpm: 138, beats: 48, voices: [
      { wave: 'flute', vol: 0.5, notes: B(6, 'A4/2 B4/1 C5/2 B4/1', 'A4/2 G4/1 E4/3', 'A4/2 B4/1 C5/2 D5/1', 'E5/2 D5/1 C5/3', 'D5/2 C5/1 B4/2 A4/1', 'G4/2 A4/1 B4/3', 'C5/2 B4/1 A4/2 G4/1', 'A4/6') },
      { wave: 'pluck', vol: 0.26, notes: B(6, ...pick(ar, 'Am Em Am C G Em Am Am')) },
      { wave: 'triangle', vol: 0.4, notes: B(6, 'A2/3 A2/3', 'E2/3 E2/3', 'A2/3 A2/3', 'C2/3 C2/3', 'G2/3 G2/3', 'E2/3 E2/3', 'A2/3 E2/3', 'A2/6') },
      { wave: 'drums', vol: 0.3, notes: B(6, ...N('D/1 t/1 t/1 T/1 t/1 t/1', 8)) }
    ] });
  })();

  /* ---------- noos : étrange — gamme par tons (do ré mi fa# lab sib) ---------- */
  (function () {
    const a = E('C4', 'E4', 'Ab4', 'C5', 'Ab4', 'E4', 'C4', 'E4'), b = E('D4', 'F#4', 'Bb4', 'D5', 'Bb4', 'F#4', 'D4', 'F#4');
    const bc = 'C2/1.5 C2/.5 -/1 C2/1', bd = 'D2/1.5 D2/.5 -/1 D2/1';
    R('noos', { bpm: 110, beats: 32, voices: [
      { wave: 'bell', vol: 0.48, notes: B(4, 'E5/2 Ab5/2', 'F#5/1 E5/1 C5/2', 'D5/2 F#5/2', 'Bb5/1 Ab5/1 F#5/2', 'E5/1 C5/1 D5/1 E5/1', 'Ab5/3 -/1', 'F#5/1 D5/1 Bb4/2', 'C5/4') },
      { wave: 'pulse', vol: 0.26, notes: B(4, a, a, b, b, a, a, b, a) },
      { wave: 'triangle', vol: 0.4, notes: B(4, bc, bc, bd, bd, bc, bc, bd, bc) },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('k/1 h/.5 h/.5 s/1 h/.5 h/.5', 8)) }
    ] });
  })();

  /* ---------- cite : cyberpunk, basse pulsée — mi mineur ---------- */
  (function () {
    const p = (n, t) => E(n, n, n, n, n, n, t, n);
    R('cite', { bpm: 118, beats: 32, voices: [
      { wave: 'pulse', vol: 0.48, notes: B(4, 'E5/1.5 D5/.5 B4/1 G4/1', 'A4/1 B4/1 E4/2', 'E5/1.5 D5/.5 C5/1 G4/1', 'A4/1 F#4/1 A4/2', 'B4/.5 E5/.5 G5/1 F#5/1 E5/1', 'C5/1 E5/1 A4/2', 'G4/1 C5/1 E5/1 G5/1', 'F#5/2 B4/2') },
      { wave: 'strings', vol: 0.22, notes: B(4, 'E3+G3+B3/4', 'E3+G3+B3/4', 'C3+E3+G3/4', 'D3+F#3+A3/4', 'E3+G3+B3/4', 'A3+C4+E4/4', 'C3+E3+G3/4', 'B3+D4+F#4/4') },
      { wave: 'saw', vol: 0.42, notes: B(4, p('E2', 'G2'), p('E2', 'G2'), p('C2', 'E2'), p('D2', 'F#2'), p('E2', 'G2'), p('A2', 'C3'), p('C2', 'E2'), p('B2', 'B2')) },
      { wave: 'drums', vol: 0.36, notes: B(4, ...N('k/1 h/.5 h/.5 s/1 h/.5 k/.5', 8)) }
    ] });
  })();

  /* ---------- citadelle : méditatif, ample — ré pentatonique mineur (ré fa sol la do) ---------- */
  (function () {
    const ar = { D: 'D3/1 A3/1 D4/1 A3/1', C: 'C3/1 G3/1 C4/1 G3/1', F: 'F3/1 C4/1 F4/1 C4/1', G: 'G3/1 D4/1 G4/1 D4/1' };
    const dr = { D: 'D3+A3/4', C: 'C3+G3/4', F: 'F3+C4/4', G: 'G3+D4/4' };
    const prog = 'D D C D F G D D D C G D';
    R('citadelle', { bpm: 63, beats: 48, voices: [
      { wave: 'flute', vol: 0.5, notes: B(4, 'D4/2 F4/1 G4/1', 'A4/3 G4/1', 'F4/1 G4/1 A4/1 C5/1', 'A4/4', 'D5/2 C5/1 A4/1', 'G4/1 A4/1 F4/2', 'G4/1 F4/1 D4/1 C4/1', 'D4/3 -/1', 'D4/1 A4/1 G4/.5 F4/.5 D4/1', 'C5/2 A4/2', 'G4/1 F4/1 G4/1 A4/1', 'D4/4') },
      { wave: 'strings', vol: 0.24, notes: B(4, ...pick(dr, prog)) },
      { wave: 'pluck', vol: 0.26, notes: B(4, ...pick(ar, prog)) },
      { wave: 'triangle', vol: 0.4, notes: B(4, 'D2/4', 'D2/4', 'C2/4', 'D2/4', 'F2/4', 'G2/4', 'D2/4', 'D2/4', 'D2/4', 'C2/4', 'G2/4', 'D2/4') },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('D/2 t/1 t/1', 12)) }
    ] });
  })();

  /* ---------- conseil : tension retenue — la mineur harmonique ---------- */
  (function () {
    const ar = { Am: E('A3', 'E4', 'A3', 'E4', 'A3', 'E4', 'C4', 'E4'), F: E('F3', 'C4', 'F3', 'C4', 'F3', 'C4', 'A3', 'C4'), Dm: E('D3', 'A3', 'D3', 'A3', 'D3', 'A3', 'F3', 'A3'), E: E('E3', 'B3', 'E3', 'B3', 'E3', 'B3', 'G#3', 'B3') };
    R('conseil', { bpm: 88, beats: 32, voices: [
      { wave: 'flute', vol: 0.46, notes: B(4, '-/2 E5/1 D5/1', 'C5/1 B4/1 A4/2', '-/2 F5/1 E5/1', 'D5/1 C5/1 B4/2', '-/1 A4/1 C5/1 E5/1', 'F5/2 D5/2', 'C5/1 A4/1 F4/1 A4/1', 'G#4/2 B4/2') },
      { wave: 'pluck', vol: 0.3, notes: B(4, ...pick(ar, 'Am Am F E Am Dm F E')) },
      { wave: 'triangle', vol: 0.4, notes: B(4, 'A2/3 A2/1', 'A2/3 A2/1', 'F2/3 F2/1', 'E2/3 E2/1', 'A2/3 A2/1', 'D2/3 D2/1', 'F2/3 F2/1', 'E2/4') },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('D/1 -/1 t/.5 t/.5 -/1', 8)) }
    ] });
  })();

  /* ---------- combat : vif — mi mineur ---------- */
  R('combat', { bpm: 150, beats: 32, voices: [
    { wave: 'pulse', vol: 0.5, notes: B(4, 'E5/.5 E5/.5 G5/.5 E5/.5 B4/1 D5/1', 'C5/.5 B4/.5 A4/1 B4/2', 'E5/.5 E5/.5 G5/.5 A5/.5 B5/1 A5/1', 'G5/.5 F#5/.5 E5/1 D5/2', 'C5/.5 D5/.5 E5/1 G5/1 E5/1', 'D5/.5 E5/.5 F#5/1 A5/1 F#5/1', 'G5/.5 F#5/.5 E5/.5 D5/.5 C5/1 B4/1', 'E5/2 -/.5 B4/.5 D5/.5 B4/.5') },
    { wave: 'square', vol: 0.22, notes: B(4, 'E3+G3+B3/4', 'A3+C4+E4/2 B3+D4+F#4/2', 'E3+G3+B3/4', 'E3+G3+B3/2 D3+F#3+A3/2', 'C3+E3+G3/4', 'D3+F#3+A3/4', 'E3+G3+B3/2 C3+E3+G3/2', 'E3+G3+B3/2 B3+D4+F#4/2') },
    { wave: 'saw', vol: 0.42, notes: B(4,
      E('E2', 'E2', 'B2', 'E2', 'E2', 'E2', 'B2', 'E2'), E('A2', 'A2', 'E2', 'A2', 'B2', 'B2', 'F#2', 'B2'),
      E('E2', 'E2', 'B2', 'E2', 'E2', 'E2', 'B2', 'E2'), E('E2', 'E2', 'B2', 'E2', 'D2', 'D2', 'A2', 'D2'),
      E('C2', 'C2', 'G2', 'C2', 'C2', 'C2', 'G2', 'C2'), E('D2', 'D2', 'A2', 'D2', 'D2', 'D2', 'A2', 'D2'),
      E('E2', 'E2', 'B2', 'E2', 'C2', 'C2', 'G2', 'C2'), E('E2', 'E2', 'B2', 'E2', 'B2', 'B2', 'B2', 'B2')) },
    { wave: 'drums', vol: 0.38, notes: B(4, ...N('k/.5 h/.5 s/.5 h/.5 k/.5 k/.5 s/.5 h/.5', 7), 'k/.5 h/.5 s/.5 h/.5 s/.5 s/.5 s/.25 s/.25 c/.5') }
  ] });

  /* ---------- boss : plus sombre, plus rapide — le motif de la Chaîne, pressé ---------- */
  (function () {
    const g = n => N(n + '/.5 ' + n + '/.25 ' + n + '/.25', 4).join(' ');
    const g2 = (a, b) => N(a + '/.5 ' + a + '/.25 ' + a + '/.25', 2).concat(N(b + '/.5 ' + b + '/.25 ' + b + '/.25', 2)).join(' ');
    const D = 'D3+F#3+A3/4', Cm = 'C3+Eb3+G3/4', Gm = 'G3+Bb3+D4/4', Eb = 'Eb3+G3+Bb3/4';
    R('boss', { bpm: 168, beats: 48, voices: [
      { wave: 'saw', vol: 0.5, notes: B(4, 'D5/.5 D5/.5 Eb5/.5 D5/.5 C5/1 D5/1', 'F#5/1 Eb5/.5 D5/.5 C5/1 Bb4/1', 'A4/.5 A4/.5 Bb4/.5 A4/.5 G4/1 A4/1', 'C5/1 Bb4/.5 A4/.5 F#4/2', 'G4/.5 A4/.5 Bb4/1 C5/.5 D5/.5 Eb5/1', 'D5/2 C5/1 Bb4/1', 'A4/.5 Bb4/.5 C5/1 D5/.5 Eb5/.5 F#5/1', 'G5/2 F#5/2', MOTIF5, 'Eb5/1 Bb5/1 A5/.5 G5/.5 Eb5/1', 'F#5/.5 G5/.5 A5/1 G5/.5 F#5/.5 Eb5/1', 'D5/3 -/1') },
      { wave: 'strings', vol: 0.24, notes: B(4, D, Cm, D, D, Gm, Gm, D, 'G3+Bb3+D4/2 D3+F#3+A3/2', D, Eb, D, D) },
      { wave: 'triangle', vol: 0.44, notes: B(4, g('D2'), g('C2'), g('D2'), g('D2'), g('G2'), g('G2'), g('D2'), g2('G2', 'D2'), g('D2'), g('Eb2'), g('D2'), g('D2')) },
      { wave: 'drums', vol: 0.4, notes: B(4, ...N('k/.5 k/.5 s/.5 k/.5 k/.5 k/.5 s/.5 h/.5', 11), 'k/.5 k/.5 s/.5 s/.5 s/.5 s/.5 c/1') }
    ] });
  })();

  /* ---------- deuil : lent, presque nu — ré mineur ---------- */
  R('deuil', { bpm: 54, beats: 32, voices: [
    { wave: 'flute', vol: 0.5, notes: B(4, 'A4/3 G4/1', 'F4/2 E4/2', 'D4/3 -/1', 'F4/1 G4/1 A4/2', 'Bb4/3 A4/1', 'G4/2 F4/2', 'E4/2 D4/1 E4/1', 'D4/4') },
    { wave: 'pluck', vol: 0.24, notes: B(4, 'D3/2 A3/2', 'D3/2 A3/2', 'Bb2/2 F3/2', 'D3/2 A3/2', 'G3/2 D4/2', 'Bb2/2 F3/2', 'A2/2 E3/2', 'D3/4') },
    { wave: 'sine', vol: 0.36, notes: B(4, 'D2/4', 'D2/4', 'Bb2/4', 'D2/4', 'G2/4', 'Bb2/4', 'A2/4', 'D2/4') }
  ] });

  /* ---------- espoir : le motif de la Chaîne en ré majeur ---------- */
  (function () {
    const ar = { D: E('D3', 'A3', 'D4', 'F#4', 'A4', 'F#4', 'D4', 'A3'), A: E('A2', 'E3', 'A3', 'C#4', 'E4', 'C#4', 'A3', 'E3'), G: E('G2', 'D3', 'G3', 'B3', 'D4', 'B3', 'G3', 'D3') };
    const ch = { D: 'D3+F#3+A3/4', A: 'A3+C#4+E4/4', G: 'G3+B3+D4/4' };
    const prog = 'D A D D G D A D';
    R('espoir', { bpm: 96, beats: 32, voices: [
      { wave: 'flute', vol: 0.5, notes: B(4, MOTIF, 'E4/1 F#4/1 A4/2', 'D4/1 A4/1 G4/.5 F#4/.5 E4/1', 'F#4/1 G4/1 A4/2', 'B4/1 A4/1 G4/.5 F#4/.5 G4/1', 'A4/1 D5/1 C#5/.5 B4/.5 A4/1', 'G4/1 F#4/1 E4/1 A4/1', 'D5/3 -/1') },
      { wave: 'strings', vol: 0.25, notes: B(4, ...pick(ch, prog)) },
      { wave: 'pluck', vol: 0.26, notes: B(4, ...pick(ar, prog)) },
      { wave: 'triangle', vol: 0.4, notes: B(4, 'D2/2 D2/2', 'A2/2 A2/2', 'D2/2 D2/2', 'D2/2 D2/2', 'G2/2 G2/2', 'D2/2 D2/2', 'A2/2 A2/2', 'D2/4') },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('D/1 t/.5 t/.5 T/1 t/1', 8)) }
    ] });
  })();

  /* ---------- victoire : courte fanfare, jouée une fois ---------- */
  R('victoire', { bpm: 132, beats: 8, voices: [
    { wave: 'pulse', vol: 0.5, notes: B(4, 'D5/.5 D5/.5 A5/1 G5/.5 F#5/.5 D5/1', 'E5/.5 F#5/.5 G5/.5 B5/.5 A5/2') },
    { wave: 'strings', vol: 0.26, notes: B(4, 'D3+F#3+A3/2 G3+B3+D4/2', 'A3+C#4+E4/2 D3+F#3+A3/2') },
    { wave: 'triangle', vol: 0.42, notes: B(4, 'D2/2 G2/2', 'A2/2 D2/2') },
    { wave: 'drums', vol: 0.36, notes: B(4, 'D/.5 t/.5 T/1 D/.5 t/.5 T/1', 'D/.5 D/.5 T/.5 T/.5 c/2') }
  ] });
})();
