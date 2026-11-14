/* ISNAD — bande-son originale : toutes les mélodies sont composées pour le jeu, aucune n'est reprise d'une œuvre existante.
   Une piste = ISNAD.registerMusic(nom, { bpm, beats, intro?, voices: [{ wave, vol, pan?, notes }] }).
   Jeton = hauteur/durée en temps ; accord = notes jointes par + ; silence = - ; `intro` = temps joués une seule fois.
   Percussions : D dum, T tek, t tek léger, r riq, k grosse caisse, b grand tambour, m tom, s caisse claire, h charleston,
   c cymbale, a enclume.
   Le thème de la Chaîne — trois maillons qui montent, (ré) la–sol, si–la, ré — revient dans titre, chaine, citadelle,
   espoir, victoire ; vice le renverse avant de le retrouver. Tonalités, tempos et idées : docs/musique.md. */
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

  /* ---------- un peu d'harmonie : l'accompagnement se déduit des accords, les mélodies s'écrivent à la main ---------- */
  const STEP = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, NOTE = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  const pcOf = s => (STEP[s[0]] + (s[1] === '#' ? 1 : s[1] === 'b' ? 11 : 0)) % 12;
  const midi = n => 12 * (+n.slice(-1) + 1) + STEP[n[0]] + (n[1] === '#' ? 1 : n[1] === 'b' ? -1 : 0);
  const name = k => NOTE[k % 12] + (Math.floor(k / 12) - 1);
  const QUAL = {
    '': [0, 4, 7], m: [0, 3, 7], 5: [0, 7], sus: [0, 5, 7], dim: [0, 3, 6], aug: [0, 4, 8], 6: [0, 4, 7, 9], m6: [0, 3, 7, 9],
    7: [0, 4, 7, 10], m7: [0, 3, 7, 10], M7: [0, 4, 7, 11], '7sus': [0, 5, 7, 10], o7: [0, 3, 6, 9], m7b5: [0, 3, 6, 10], add9: [0, 2, 4, 7]
  };
  const chord = sym => {
    const m = /^([A-G][#b]?)([^/]*)(?:\/([A-G][#b]?))?$/.exec(sym), q = m && QUAL[m[2]];
    if (!q) { console.warn('musique : accord inconnu « ' + sym + ' »'); return { pcs: [0], bass: 0 }; }
    const r = pcOf(m[1]); return { pcs: q.map(i => (r + i) % 12), bass: m[3] ? pcOf(m[3]) : r };
  };
  // échelle d'un accord à partir de `lo` : la basse, puis les notes de l'accord depuis la quinte au-dessus (rien de serré
  // dans le grave). Avec '^lo' : les notes de l'accord serrées dans l'octave qui part de `lo`, puis leurs octaves.
  const ladder = (sym, lo) => {
    const c = chord(sym);
    if (lo[0] === '^') { const l = midi(lo.slice(1)), near = c.pcs.map(p => l + ((p - l % 12) + 12) % 12).sort((a, b) => a - b); return near.concat(near.map(k => k + 12), near.map(k => k + 24)); }
    let b = midi(lo); while (b % 12 !== c.bass) b++;
    const L = [b]; for (let k = b + 7; L.length < 12; k++) if (c.pcs.includes(k % 12)) L.push(k);
    return L;
  };
  // fig('Dm', 'D2', '0/.5 1/.5 2+3/1 -/2') : un motif écrit en degrés de l'échelle ; o = la basse à l'octave
  const fig = (sym, lo, pat) => {
    const L = ladder(sym, lo);
    return pat.split(' ').map(tk => { const i = tk.lastIndexOf('/'), h = tk.slice(0, i); return h === '-' ? tk : h.split('+').map(x => name(x === 'o' ? L[0] + 12 : L[+x])).join('+') + tk.slice(i); }).join(' ');
  };
  // nappe : l'accord serré dans l'octave qui part de `lo` — d'un accord au suivant, les voix bougent le moins possible
  const pad = (sym, lo, d) => { const c = chord(sym), l = midi(lo); return c.pcs.map(p => l + ((p - l % 12) + 12) % 12).sort((a, b) => a - b).map(name).join('+') + '/' + d; };
  // 'Dm Gm | A:3 A7:1' → mesures de [accord, temps] ; sans précision, les accords d'une mesure se partagent ses temps
  const prog = (str, len) => str.split('|').map(bar => { const cs = bar.trim().split(/\s+/); return cs.map(c => { const [s, b] = c.split(':'); return [s, b ? +b : len / cs.length]; }); });
  const acc = (str, len, lo, pats) => prog(str, len).map(bar => bar.map(([s, b]) => { if (!pats[b]) console.warn('musique : pas de motif pour ' + b + ' temps (' + s + ')'); return fig(s, lo, pats[b] || '-/' + b); }).join(' '));
  const pads = (str, len, lo) => prog(str, len).map(bar => bar.map(([s, b]) => pad(s, lo, b)).join(' '));
  const tr = (s, n) => s.replace(/[A-G][#b]?\d/g, x => name(midi(x) + n));              // transpose une ligne de n demi-tons
  const trp = (p, n) => p.replace(/[A-G][#b]?/g, r => NOTE[(pcOf(r) + n + 120) % 12]);   // transpose une grille d'accords
  const trs = (bars, n) => bars.map(b => tr(b, n));
  const sc = s => s.split(' ').map(pcOf);                                              // gamme → classes de hauteur
  // luth seul : chaque note sur deux cordes à l'unisson (les chœurs doublés de l'instrument) — elle sort 3 dB plus fort
  const two = line => line.replace(/([A-G][#b]?\d)\//g, '$1+$1/');
  // Hétérophonie : le luth double un chant en l'ornant. Il refrappe les notes longues et y glisse un mordant vers le degré
  // supérieur de la gamme (durée q) ; avec `re`, il redouble aussi les noires en croches. `shift` transpose (demi-tons).
  const het = (bars, scale, shift, q, re) => bars.map(bar => bar.trim().split(/\s+/).map(tk => {
    const i = tk.lastIndexOf('/'), h = tk.slice(0, i), d = parseFloat(tk.slice(i + 1)); if (h === '-' || h.includes('+')) return tk;
    const m = midi(h) + (shift || 0), n = name(m); let u = m + 1; while (!scale.includes(u % 12)) u++;
    const turn = name(u) + '/' + q + ' ' + n + '/' + q;
    if (d < 1 - 1e-9) return n + '/' + d;
    if (d < 1.5 - 1e-9) return re ? n + '/' + d / 2 + ' ' + n + '/' + d / 2 : n + '/' + d;
    if (d < 2 - 1e-9) return n + '/' + (d - 2 * q) + ' ' + turn;                       // le mordant mène à la note suivante
    let out = n + '/1 ' + turn + ' ' + n + '/' + (1 - 2 * q), rest = d - 2;             // frappe, mordant, puis une frappe par temps
    while (rest > 1e-9) { const x = Math.min(1, rest); out += ' ' + n + '/' + x; rest -= x; }
    return out;
  }).join(' '));

  /* ---------- le thème de la Chaîne ----------
     Trois maillons : chacun monte (quinte, tierce, quarte) et s'accroche un degré sous l'arrivée du précédent.
     Huit mesures à quatre temps ; la levée (un demi-temps sur la tonique) appartient à la mesure d'avant. */
  const CH = {       // forme majeure, en ré
    a1: 'A4/1.5 G4/.5 B4/1.5 A4/.5', a2: 'D5/2.5 -/1 E4/.5', a3: 'B4/1.5 A4/.5 C#5/1.5 B4/.5', a4: 'E5/3 -/1',
    b1: 'F#5/1.5 E5/.5 D5/1.5 B4/.5', b2: 'G4/1.5 A4/.5 B4/2', b3: 'A4/1.5 G4/.5 F#4/1.5 E4/.5'
  };
  const CHm = {      // forme mineure : le maillon du milieu s'abaisse, la demi-cadence prend la seconde augmentée
    a1: 'A4/1.5 G4/.5 Bb4/1.5 A4/.5', a2: 'D5/2.5 -/1 D4/.5', a3: 'Bb4/1.5 A4/.5 C#5/1.5 Bb4/.5', a4: 'A4/3 -/1',
    b1: 'F5/1.5 E5/.5 D5/1.5 Bb4/.5', b2: 'G4/1.5 A4/.5 Bb4/2', b3: 'A4/1.5 G4/.5 E4/1.5 C#4/.5'
  };
  const CHP = 'D G | D Bm | Em A | A F#/A# | Bm D/A | G Em | Gm A7 | D';            // la sous-dominante mineure avant la cadence
  const CHPm = 'Dm Gm | Dm Bb | Gm A | A | Bb Dm/A | Gm Eb | Em7b5 A7 | D';        // cadence picarde
  // contre-chant de la forme majeure : il répond quand le thème tient sa note, puis le double à la tierce
  const DESC = ['-/4', '-/1 A5/.5 F#5/.5 G5/.5 F#5/.5 D5/1', '-/4', '-/1 C#5/.5 E5/.5 F#5/1 E5/.5 C#5/.5',
    'A5/1.5 G5/.5 F#5/1.5 D5/.5', 'B4/1.5 C#5/.5 D5/2', 'C5/1.5 Bb4/.5 A4/1.5 G4/.5', 'F#4/3 -/.5 D4/.5'];
  // arpèges de harpe : une vague qui monte et se replie, en doubles croches puis en croches
  const H16 = { 4: '0/.25 1/.25 2/.25 3/.25 4/.25 3/.25 2/.25 3/.25 4/.25 5/.25 4/.25 3/.25 2/.25 3/.25 1/.25 2/.25', 2: '0/.25 1/.25 2/.25 3/.25 4/.25 3/.25 2/.25 1/.25', 1: '0/.25 1/.25 2/.25 3/.25' };
  const H8 = { 4: '0/.5 1/.5 2/.5 3/.5 4/.5 3/.5 2/.5 1/.5', 2: '0/.5 1/.5 2/.5 3/.5', 1: '0/.5 2/.5' };

  /* ---------- titre : grave puis ample — ré mineur harmonique, puis ré majeur ---------- */
  (function () {
    const pI = 'D5 | Bb/D | Gm/D | A7sus:2 A7:1 A7sus:1';   // la levée (ré) tombe sur la quarte suspendue, pas contre la sensible
    R('titre', { bpm: 72, beats: 80, intro: 16, voices: [
      { wave: 'flute', vol: 0.48, notes: B(4, ...N('-/4', 3), '-/3.5 D4/.5', CHm.a1, CHm.a2, CHm.a3, CHm.a4, CHm.b1, CHm.b2, CHm.b3, 'D4/4', ...DESC) },
      { wave: 'brass', vol: 0.6, pan: 0.15, notes: B(4, ...N('-/4', 11), '-/3.5 D4/.5', CH.a1, CH.a2, CH.a3, CH.a4, CH.b1, CH.b2, CH.b3, 'D4/4') },
      { wave: 'strings', vol: 0.24, pan: -0.2, notes: B(4, ...pads(pI, 4, 'F3'), ...pads(CHPm, 4, 'F3'), ...pads(CHP, 4, 'F3')) },
      // une touche arabo-andalouse : dans la première partie, le luth double la flûte en l'ornant
      { wave: 'pluck', vol: 0.36, pan: -0.25, notes: B(4, ...N('-/4', 3), '-/3.5 D4/.5', ...het([CHm.a1, CHm.a2, CHm.a3, CHm.a4, CHm.b1, CHm.b2, CHm.b3, 'D4/4'], sc('D E F G A Bb C'), 0, 0.125), ...N('-/4', 7), '-/3.5 D4/.5') },
      { wave: 'harp', vol: 0.4, pan: 0.25, notes: B(4, ...acc(pI, 4, 'D2', H16), ...acc(CHPm, 4, 'D2', H8), ...acc(CHP, 4, 'D2', H16)) },
      { wave: 'triangle', vol: 0.32, notes: B(4, ...acc(pI, 4, 'D2', { 4: '0/4', 2: '0/2', 1: '0/1' }), ...acc(CHPm, 4, 'D2', { 4: '0/3 0/1', 2: '0/2' }), ...acc(CHP, 4, 'D2', { 4: '0/1.5 0/.5 1/1 0/1', 2: '0/1.5 0/.5' })) },
      { wave: 'timp', vol: 0.3, notes: B(4, 'D2/4', '-/4', '-/4', '-/2 A2/.5 A2/.5 A2/.25 A2/.25 A2/.25 A2/.25',
        'D2/2 -/2', '-/4', '-/4', 'A2/2 -/2', '-/4', '-/4', '-/2 A2/1 A2/1', 'D2/2 -/1 A2/.5 A2/.5',
        'D2/1 -/1 D2/1 -/1', '-/4', '-/4', 'A2/2 -/2', '-/4', '-/4', '-/2 A2/.5 A2/.5 A2/.5 A2/.5', 'D2/2 -/2') }
    ] });
  })();

  /* ---------- chaine : suspendu — ré, à 6/8 (un temps = une croche), accords empruntés sur pédale de tonique ---------- */
  (function () {
    const p = 'D:3 G/D:3 | D | Bb/D | C/D | D:3 Gm/D:3 | D | Em7:3 A7sus:3 | A7 | G:3 D/F#:3 | Em:3 Bm:3 | Bb | Gm6:3 A7:3 | D | A/D | G/D:3 Gm/D:3 | D';
    const st = pads(p, 6, 'F#3'); for (let i = 0; i < 4; i++) st[i] = '-/6';
    R('chaine', { bpm: 132, beats: 96, voices: [
      { wave: 'bell', vol: 0.42, notes: B(6, 'A5/2 G5/1 B5/2 A5/1', 'D6/5 -/1', 'Bb5/3 A5/2 F5/1', 'G5/3 E5/2 D5/1', 'A5/2 G5/1 Bb5/2 A5/1', 'D6/5 -/1', 'B5/2 A5/1 G5/2 E5/1', 'F#5/3 E5/3',
        'F#5/2 E5/1 D5/2 B4/1', 'G4/2 A4/1 B4/3', 'D5/2 F5/1 A5/3', 'G5/2 E5/1 C#5/3', 'D5/3 F#5/3', 'E5/6', 'B4/3 Bb4/3', 'A4/5 D5/1') },
      { wave: 'harp', vol: 0.5, pan: -0.2, notes: B(6, ...acc(p, 6, 'D2', { 6: '0/1 3/1 2/1 3/1 4/1 3/1', 3: '0/1 2/1 3/1' })) },
      { wave: 'strings', vol: 0.22, pan: 0.2, notes: B(6, ...st) },
      { wave: 'triangle', vol: 0.26, notes: B(6, ...acc(p, 6, 'D2', { 6: '0/6', 3: '0/3' })) }
    ] });
  })();

  /* ---------- medine : marche souple — sol dorien, puis si bémol majeur. Couleur arabo-andalouse : un prélude de luth sans
     percussion (joué une fois) ; à la reprise, le luth quitte l'accompagnement pour doubler le chant en l'ornant, et le târ et
     la darbouka passent à un cycle en 3 + 3 + 2. ---------- */
  (function () {
    const pA = 'Gm | C | Gm | Dm | Gm | C | Bb F/A | Gm D', pB = 'Bb | F/A | Gm | Dm | Eb | Bb/D | Cm | D';
    const oud = { 4: '0/.5 3/.5 2/.5 3/.5 1/.5 3/.5 2/.5 3/.5', 2: '0/.5 3/.5 2/.5 3/.5' };
    // basse marchante : elle pose la fondamentale, puis s'approche de la suivante par degrés ou par demi-ton
    const wA = ['G2/1.5 D3/.5 G2/1 A2/.5 B2/.5', 'C3/1.5 G2/.5 C3/1 Bb2/.5 A2/.5', 'G2/1.5 D3/.5 Bb2/1 C3/.5 C#3/.5', 'D3/1.5 A2/.5 D3/1 A2/.5 F#2/.5',
      'G2/1.5 D3/.5 G2/1 A2/.5 B2/.5', 'C3/1.5 G2/.5 C3/1 D3/.5 C3/.5', 'Bb2/1.5 Bb2/.5 A2/1.5 A2/.5', 'G2/1.5 D3/.5 D3/1 A2/.5 F#2/.5'];
    const wB = ['Bb2/1.5 F3/.5 D3/1 C3/.5 Bb2/.5', 'A2/1.5 C3/.5 A2/1 F2/.5 A2/.5', 'G2/1.5 D3/.5 G2/1 F2/.5 E2/.5', 'D2/1.5 A2/.5 D3/1 C3/.5 D3/.5',
      'Eb3/1.5 Bb2/.5 G2/1 Bb2/.5 Eb3/.5', 'D3/1.5 Bb2/.5 D3/1 Eb3/.5 D3/.5', 'C3/1.5 G2/.5 Eb3/1 C3/.5 C#3/.5', 'D3/1.5 A2/.5 D3/1 A2/.5 F#2/.5'];
    const A = ['D5/1 Bb4/.5 C5/.5 D5/1 G5/1', 'E5/1.5 D5/.5 C5/1 E5/1', 'D5/1 Bb4/.5 C5/.5 D5/.5 F5/.5 E5/.5 D5/.5', 'C5/1.5 A4/.5 D5/2',
      'G5/1 F5/.5 E5/.5 D5/1 Bb4/1', 'C5/.5 D5/.5 E5/1 G5/1 E5/1', 'F5/1 D5/1 C5/1 A4/1'];
    const A2 = A.concat('Bb4/.5 A4/.5 G4/1 -/1 D5/.5 Eb5/.5');                                  // la reprise, que le luth double
    const beat = 'D/.5 T/.5 r/.5 T/.5 D/.5 r/.5 T/.5 r/.5', turn = 'D/.5 T/.5 r/.5 T/.5 D/.5 D/.5 T/.25 T/.25 T/.5';
    const cyc = 'D/.5 r/.5 r/.5 T/.5 r/.5 r/.5 T/.5 r/.5', fin = 'D/.5 r/.5 r/.5 T/.5 r/.5 D/.5 T/.25 T/.25 T/.5';   // 3 + 3 + 2
    R('medine', { bpm: 96, beats: 104, intro: 8, voices: [
      { wave: 'flute', vol: 0.5, notes: B(4, '-/4', '-/4', ...A, 'Bb4/.5 A4/.5 G4/1 -/1 A4/.5 C5/.5', ...A2,
        'F5/2 D5/1 Bb4/1', 'C5/1.5 D5/.5 C5/1 A4/1', 'Bb4/1 C5/.5 D5/.5 G5/2', 'F5/1.5 E5/.5 D5/2', 'G5/2 Eb5/1 Bb4/1', 'D5/1.5 Eb5/.5 F5/1 D5/1', 'Eb5/1 D5/.5 C5/.5 G4/1 C5/1', 'D5/1 C5/.5 Bb4/.5 A4/2') },
      // prélude : le luth seul descend par degrés vers la finale ; puis il accompagne, puis il double le chant en l'ornant
      { wave: 'pluck', vol: 0.42, pan: -0.25, notes: B(4, two('G4/1.5 A4/.25 G4/.25 F4/.5 E4/.5 D4/1'), two('Bb3/.5 C4/.5 D4/.75 C4/.25 Bb3/.5 A3/.5 G3/1'),
        ...acc(pA, 4, 'G2', oud), ...het(A2, sc('G A Bb C D E F'), -12, 0.25, true), ...acc(pB, 4, 'G2', oud)) },
      { wave: 'strings', vol: 0.28, pan: 0.2, notes: 'G3+D4/8 ' + B(4, ...N('-/4', 8), 'G3/2 Bb3/2', 'C4/2 E4/2', 'D4/2 Bb3/2', 'A3/2 F3/2', 'G3/2 Bb3/2', 'E4/2 C4/2', 'D4/2 C4/2', 'G3/2 A3/1 F#3/1', ...pads(pB, 4, 'F3')) },
      { wave: 'contra', vol: 0.32, notes: B(4, '-/4', '-/4', ...wA, ...wA, ...wB) },
      { wave: 'drums', vol: 0.32, notes: B(4, '-/4', '-/4', ...N(beat, 7), turn, ...N(cyc, 7), fin, ...N(cyc, 7), fin) }
    ] });
  })();

  /* ---------- nuit : dépouillé — sol mineur, le chant de la ville ralenti ; sixte napolitaine avant la reprise ---------- */
  (function () {
    const p = 'Gm | Eb | Cm7 | D | Gm | Eb | Am7b5 D7 | Gm | Bb | F/A | Ab | D';
    R('nuit', { bpm: 60, beats: 48, voices: [
      { wave: 'flute', vol: 0.44, notes: B(4, '-/1 D5/1 Bb4/.5 C5/.5 D5/1', 'G5/3 F5/.5 Eb5/.5', 'D5/2 C5/1 Bb4/1', 'A4/3 -/1', '-/1 D5/1 Bb4/.5 C5/.5 D5/1', 'Bb5/2 G5/1 Eb5/1',
        'C5/1 Eb5/1 D5/1 C5/.5 A4/.5', 'G4/3 -/1', '-/1 F5/1 D5/1 Bb4/1', 'C5/2 A4/2', 'Eb5/2 C5/2', 'D5/1 C5/.5 Bb4/.5 A4/2') },
      { wave: 'pluck', vol: 0.42, pan: -0.2, notes: B(4, ...acc(p, 4, 'G2', { 4: '0/1 1/1 2/1 3/1', 2: '0/1 2/1' })) },
      { wave: 'bell', vol: 0.3, pan: 0.3, notes: B(4, '-/4', '-/2 Bb5/2', '-/4', '-/2 D6/2', '-/4', '-/4', '-/4', '-/1 G5/1 D6/2', '-/4', '-/2 C6/2', '-/4', '-/2 F#5/2') },
      { wave: 'pad', vol: 0.2, notes: B(4, ...pads(p, 4, 'G3')) },
      { wave: 'triangle', vol: 0.26, notes: B(4, ...acc(p, 4, 'G2', { 4: '0/4', 2: '0/2' })) }
    ] });
  })();

  /* ---------- desert : pédale de ré et mélodie ornée — hijaz sur ré (ré mi♭ fa# sol la si♭ do). Le luth et les percussions
     groupent leurs croches par trois contre la mesure à quatre temps (3 + 3 + 2) ; dans la seconde partie les cordes tiennent
     le chant avec la flûte, puis le luth le double en l'ornant. ---------- */
  (function () {
    const strum = '0/.5 1/.5 1/.5 0/.5 1/.5 1/.5 0/.5 1/.5', d = fig('D5', 'D3', strum), g = fig('Gm/D', 'D3', strum);
    const bd = 'D2/1.5 D2/1.5 A2/1', bg = 'D2/1.5 D2/1.5 G2/1';
    const step = 'D/.5 r/.5 t/.5 D/.5 r/.5 t/.5 T/.5 r/.5', turn = 'D/.5 r/.5 t/.5 D/.5 r/.5 T/.5 T/.25 t/.25 r/.5';
    const Bm = ['G4/1 Bb4/1 D5/1.5 C5/.5', 'Bb4/1 A4/.5 G4/.5 A4/2', 'C5/1 Eb5/1 D5/1.5 C5/.5', 'Bb4/.5 A4/.5 G4/.5 F#4/.5 A4/2',
      'D5/2 Eb5/.25 D5/.25 C5/.5 Bb4/1', 'C5/1 Bb4/.5 A4/.5 G4/2', 'F#4/.5 G4/.5 A4/.5 Bb4/.5 A4/.5 G4/.5 F#4/.5 Eb4/.5', 'D4/3 -/1'];
    R('desert', { bpm: 76, beats: 64, voices: [
      { wave: 'flute', vol: 0.5, notes: B(4, 'A4/2 Bb4/.25 A4/.25 G4/.5 F#4/1', 'G4/.5 F#4/.5 Eb4/1 D4/2', 'D4/.5 Eb4/.5 F#4/.5 G4/.5 A4/1 Bb4/.25 A4/.25 G4/.5', 'A4/3 -/1',
        'D5/2 C5/.25 D5/.25 C5/.5 Bb4/1', 'A4/.5 Bb4/.5 C5/1 Bb4/.5 A4/.5 G4/1', 'F#4/.5 G4/.5 A4/.5 G4/.5 F#4/.5 Eb4/.5 D4/.5 Eb4/.5', 'D4/3 -/1', ...Bm) },
      // le luth tient la pédale et répond quand la flûte se tait ; à la fin il rejoint le chant, à l'unisson, en l'ornant
      { wave: 'pluck', vol: 0.44, pan: -0.25, notes: B(4, d, d, d, 'D3/1 A3/.5 D4/.5 F#4/.5 G4/.5 A4/1', d, d, d, 'D4/.5 Eb4/.5 F#4/.5 G4/.5 A4/.5 G4/.5 F#4/.5 Eb4/.5',
        g, g, g, d, ...het(Bm.slice(4, 7), sc('D Eb F# G A Bb C'), 0, 0.25, true), 'D4/.5 Eb4/.5 F#4/.5 G4/.5 A4/1 D4/1') },
      { wave: 'strings', vol: 0.26, pan: 0.2, notes: B(8, ...N('D3+A3/8', 4), 'D3+G3/8', 'D3+G3/4 D3+A3/4', 'D3+G3/8', 'D3+A3/8') },
      // les cordes tiennent le chant, sans ses ornements
      { wave: 'strings', vol: 0.34, pan: 0.1, notes: B(4, ...N('-/4', 8), Bm[0], Bm[1], Bm[2], Bm[3], 'D5/2.5 C5/.5 Bb4/1', Bm[5], Bm[6], Bm[7]) },
      { wave: 'contra', vol: 0.28, notes: B(4, ...N(bd, 8), bg, bg, bg, bd, bg, bg, bd, bd) },
      { wave: 'drums', vol: 0.32, notes: B(4, ...N(step, 3), turn, ...N(step, 3), turn, ...N(step, 3), turn, ...N(step, 3), turn) }
    ] });
  })();

  /* ---------- camp : veillée d'armes — la mineur ; la flûte veille, le cor répond. Couleur arabo-andalouse : un cycle
     clairsemé en 3 + 3 + 2, le luth qui double la flûte en l'ornant puis se joint à ses réponses, une cadence qui redescend
     par degrés vers la finale. ---------- */
  (function () {
    const pA = 'Am | Am/G | FM7 | E7sus E7 | Am | C/G | Dm | E', pB = 'F | G | Em | Am | Dm | Am/E | Bm7b5 E7 | Am';
    const ost = { 4: '0/.5 1/.5 2/.5 1/.5 0/.5 1/.5 3/.5 1/.5', 2: '0/.5 1/.5 2/.5 1/.5' }, low = { 4: '0/1.5 0/.5 0/2', 2: '0/2' };
    const pulse = 'D/1.5 D/1.5 T/.5 t/.5', roll = 'D/1.5 D/1.5 T/.25 t/.25 t/.25 t/.25';                    // 3 + 3 + 2
    const fA = ['E5/1.5 D5/.5 C5/1 A4/1', 'B4/1 C5/.5 D5/.5 E5/2', 'A5/1.5 G5/.5 F5/1 E5/1', 'D5/2 B4/1 G#4/1', 'A4/1 C5/.5 E5/.5 A5/2', 'G5/1.5 F5/.5 E5/1 C5/1', 'D5/1 F5/1 E5/1 D5/1', 'E5/1.5 D5/.5 B4/2'];
    const oA = acc(pA, 4, 'E2', ost), oB = acc(pB, 4, 'E2', ost), half = sym => fig(sym, 'E2', ost[2]);
    R('camp', { bpm: 84, beats: 64, voices: [
      { wave: 'flute', vol: 0.46, notes: B(4, ...fA, '-/4', '-/2 D5/.5 E5/.5 G5/1', '-/4', '-/2 E5/.5 D5/.5 C5/1', '-/4', '-/2 A5/.5 G5/.5 E5/1', 'F5/2 E5/2', 'E5/3 -/1') },
      { wave: 'brass', vol: 0.5, pan: 0.2, notes: B(4, ...N('-/4', 8), 'A4/1 C5/1 F5/1.5 E5/.5', 'D5/2 B4/1 G4/1', 'G4/1 B4/1 E5/1.5 D5/.5', 'C5/2 A4/2', 'F4/1 A4/1 D5/1.5 C5/.5', 'C5/1 B4/.5 A4/.5 E4/2', 'D5/1 B4/1 G#4/1 E4/1', 'A4/3 -/1') },
      // le luth : quatre mesures d'ostinato, puis il double la flûte en l'ornant ; dans la seconde partie il se joint
      // aux réponses de la flûte et conclut en descendant par degrés, mi ré do si la
      { wave: 'pluck', vol: 0.46, pan: -0.25, notes: B(4, ...oA.slice(0, 4), ...het(fA.slice(4), sc('A B C D E F G'), 0, 0.25, true),
        oB[0], half('G') + ' D4/.5 E4/.5 G4/1', oB[2], half('Am') + ' E4/.5 D4/.5 C4/1', oB[4], half('Am/E') + ' A4/.5 G4/.5 E4/1', oB[6], 'A2/.5 E3/.5 E4/.5 D4/.5 C4/.5 B3/.5 A3/1') },
      { wave: 'strings', vol: 0.18, notes: B(4, ...pads(pA.replace('FM7', 'F'), 4, 'G3'), ...pads(pB, 4, 'G3')) },
      { wave: 'contra', vol: 0.28, notes: B(4, ...acc(pA, 4, 'E2', low), ...acc(pB, 4, 'E2', low)) },
      { wave: 'drums', vol: 0.28, notes: B(4, ...N(pulse, 7), roll, ...N(pulse, 7), roll) }
    ] });
  })();

  /* ---------- rome : solennel — ré dorien, cuivres en quintes et quartes sur bourdon ; cadence picarde ---------- */
  (function () {
    const pA = 'Dm | C | Dm | Am | F | C | G | Dm', pB = 'Bb | F/A | Gm | A | Dm | G/B | Em7b5 A7 | D';
    R('rome', { bpm: 66, beats: 64, voices: [
      { wave: 'brass', vol: 0.6, notes: B(4, 'D4+A3/2 A4+D4/2', 'G4+C4/1.5 E4/.5 G4+C4/2', 'A4+D4/1 D5+A4/1 C5/1 A4+D4/1', 'B4/1.5 A4/.5 E4+A3/2', 'F4+C4/2 A4+F4/2', 'G4+C4/2 C5+G4/2', 'B4+G4/1.5 A4/.5 G4+D4/1 B4+G4/1', 'A4+D4/4',
        'D4/4', 'C4/4', 'D4/2 Bb3/2', 'C#4/2 E4/2', 'D4/4', 'D4/2 G4/2', 'E4/3 C#4/1', 'D4+A4/4') },
      { wave: 'flute', vol: 0.5, pan: 0.2, notes: B(4, ...N('-/4', 4), 'C5/2 F5/2', 'E5/2 G5/2', 'D5/1.5 E5/.5 D5/1 B4/1', 'D5/4',
        'D5/2 F5/1.5 E5/.5', 'C5/2 A4/2', 'Bb4/1 D5/1 G5/1.5 F5/.5', 'E5/2 C#5/2', 'D5/2 A4/1 F4/1', 'G4/1 B4/1 D5/2', 'G4/1 Bb4/1 A4/1.5 G4/.5', 'F#4/4') },
      { wave: 'strings', vol: 0.22, pan: -0.2, notes: B(4, ...pads(pA, 4, 'F3'), ...pads(pB, 4, 'F3')) },
      { wave: 'harp', vol: 0.4, pan: -0.3, notes: B(4, ...acc(pA, 4, 'D2', H8), ...acc(pB, 4, 'D2', H8)) },
      { wave: 'triangle', vol: 0.3, notes: B(4, ...acc(pA, 4, 'D2', { 4: '0/2 0/2', 2: '0/2' }), ...acc(pB, 4, 'D2', { 4: '0/2 0/2', 2: '0/2' })) },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('b/2 -/1 b/1', 7), 'b/2 -/2', ...N('b/2 -/2', 7), 'b+c/4') }
    ] });
  })();

  /* ---------- palais : faste — la mineur harmonique à 6/8, danse de cour ; sixte napolitaine à la cadence ---------- */
  (function () {
    const pA = 'Am | Dm/A | Am | E/G# | Am | Dm | Bb:3 E:3 | Am', pB = 'C | G/B | Am | E | F | C/E | Dm6:3 E:3 | Am';
    const wave = { 6: '0/1 2/1 3/1 4/1 3/1 2/1', 3: '0/1 2/1 3/1' }, low = { 6: '0/3 0/2 0/1', 3: '0/3' };
    const Bm = ['G5/2 E5/1 C5/2 E5/1', 'D5/2 B4/1 G4/2 B4/1', 'C5/1 D5/1 E5/1 A5/3', 'G#5/2 E5/1 B4/3', 'A5/2 F5/1 C5/2 F5/1', 'G5/2 E5/1 C5/3', 'F5/1 D5/1 B4/1 D5/1 B4/1 G#4/1', 'A4/6'];
    const dance = 'D/1 r/1 T/1 D/1 T/1 r/1', turn = 'D/1 r/1 T/1 D/1 T/.5 T/.5 T/1';
    R('palais', { bpm: 186, beats: 96, voices: [
      { wave: 'pluck', vol: 0.5, notes: B(6, 'A4/1 B4/1 C5/1 E5/2 C5/1', 'D5/1 E5/1 F5/1 D5/2 A4/1', 'C5/1 B4/1 A4/1 E5/3', 'D5/1 C5/1 B4/1 G#4/3', 'A4/1 B4/1 C5/1 E5/2 A5/1', 'A5/1 G5/1 F5/1 D5/2 F5/1', 'D5/2 Bb4/1 D5/1 B4/1 G#4/1', 'A4/3 E4/2 A4/1', ...Bm) },
      { wave: 'flute', vol: 0.36, pan: 0.2, notes: B(6, ...N('-/6', 8), ...Bm) },
      { wave: 'harp', vol: 0.32, pan: -0.3, notes: B(6, ...acc(pA, 6, 'E2', wave), ...acc(pB, 6, 'E2', wave)) },
      { wave: 'strings', vol: 0.2, pan: 0.25, notes: B(6, ...pads(pA, 6, 'G3'), ...pads(pB, 6, 'G3')) },
      { wave: 'contra', vol: 0.28, notes: B(6, ...acc(pA, 6, 'E2', low), ...acc(pB, 6, 'E2', low)) },
      { wave: 'drums', vol: 0.32, notes: B(6, ...N(dance, 3), turn, ...N(dance, 3), turn, ...N(dance, 3), turn, ...N(dance, 3), turn) }
    ] });
  })();

  /* ---------- mer : barcarolle à 6/8 — sol majeur, le septième degré abaissé avant la reprise ---------- */
  (function () {
    const pA = 'G | D/F# | Em | C | G/B | Am7 | C/D:3 D:3 | G', pB = 'Em | Bm | C | G | Am | Em/G | F | D';
    const wave = { 6: '0/1 1/1 2/1 3/1 2/1 1/1', 3: '0/1 1/1 2/1' }, low = { 6: '0/3 0/3', 3: '0/3' };
    const swell = 'D/2 r/1 t/2 r/1';
    R('mer', { bpm: 144, beats: 96, voices: [
      { wave: 'flute', vol: 0.48, notes: B(6, 'D5/3 B4/2 D5/1', 'A5/3 F#5/2 D5/1', 'G5/2 F#5/1 E5/2 B4/1', 'E5/4 D5/1 C5/1', 'D5/3 B4/2 D5/1', 'C5/2 E5/1 G5/3', 'E5/2 C5/1 D5/3', 'G5/5 -/1',
        'B4/2 E5/1 G5/2 F#5/1', 'F#5/3 D5/2 B4/1', 'C5/2 E5/1 G5/2 E5/1', 'D5/5 -/1', 'A4/2 C5/1 E5/2 D5/1', 'B4/3 G4/2 B4/1', 'A4/2 C5/1 F5/3', 'F#5/2 E5/1 D5/2 A4/1') },
      { wave: 'brass', vol: 0.44, pan: 0.25, notes: B(6, ...N('-/6', 7), '-/3 D4/1 G4/2', ...N('-/6', 7), '-/3 A3/1 D4/2') },
      { wave: 'harp', vol: 0.44, pan: -0.25, notes: B(6, ...acc(pA, 6, 'E2', wave), ...acc(pB, 6, 'E2', wave)) },
      { wave: 'strings', vol: 0.22, pan: 0.15, notes: B(6, ...pads(pA, 6, 'G3'), ...pads(pB, 6, 'G3')) },
      { wave: 'contra', vol: 0.28, notes: B(6, ...acc(pA, 6, 'E2', low), ...acc(pB, 6, 'E2', low)) },
      { wave: 'drums', vol: 0.24, notes: B(6, 'D+c/2 r/1 t/2 r/1', ...N(swell, 7), 'D+c/2 r/1 t/2 r/1', ...N(swell, 7)) }
    ] });
  })();

  /* ---------- noos : étrange — do mineur, la♭ mineur, mi mineur : trois accords mineurs à la tierce majeure ---------- */
  (function () {
    const p = 'Cm | Cm | Abm | Abm | Em | Em | G | Gaug | Cm | Abm | Em | Gaug | Cm | Abm | Em | G Gaug';
    R('noos', { bpm: 104, beats: 64, voices: [
      { wave: 'bell', vol: 0.42, notes: B(4, 'G5/2 Eb5/2', 'D5/1 Eb5/1 G5/2', 'Ab5/2 Eb5/2', 'B4/1 Eb5/1 Ab5/2', 'G5/2 E5/2', 'F#5/1 G5/1 B5/2', 'D5/2 B4/2', 'B4/1 D#5/1 G5/2',
        'C5/1 Eb5/1 G5/1 C6/1', 'B5/2 Ab5/1 Eb5/1', 'E5/1 G5/1 B5/2', 'G5/2 D#5/2', 'Eb5/2 D5/1 C5/1', 'Eb5/2 B4/2', 'E5/2 G5/1 F#5/1', 'D5/2 D#5/2') },
      { wave: 'pulse', vol: 0.3, pan: -0.3, notes: B(4, ...acc(p, 4, '^C4', { 4: '0/.5 1/.5 2/.5 1/.5 3/.5 1/.5 2/.5 1/.5', 2: '0/.5 1/.5 2/.5 1/.5' })) },
      { wave: 'pad', vol: 0.24, pan: 0.2, notes: B(4, ...pads(p, 4, 'G3')) },
      { wave: 'bass', vol: 0.4, notes: B(4, ...acc(p, 4, 'C2', { 4: '0/1 -/.5 0/.5 0/1 -/1', 2: '0/1 -/.5 0/.5' })) },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('k/1 t/.5 h/.5 -/.5 h/.5 t/.5 h/.5', 16)) }
    ] });
  })();

  /* ---------- cite : la Cité-Miroir — mi mineur, arpèges de synthé, pouls froid ---------- */
  (function () {
    const pA = 'Em | Em | CM7 | CM7 | Am7 | Am7 | Bm7 | B7', pB = 'G | D/F# | Em | C#m7b5 | C | G/B | Am7 | B7sus B7';
    const arp = { 4: '0/.25 2/.25 1/.25 2/.25 3/.25 2/.25 1/.25 2/.25 0/.25 2/.25 1/.25 2/.25 3/.25 2/.25 1/.25 2/.25', 2: '0/.25 2/.25 1/.25 2/.25 3/.25 2/.25 1/.25 2/.25' };
    const beat = { 4: '0/.5 0/.5 0/.5 0/.5 0/.5 0/.5 o/.5 0/.5', 2: '0/.5 0/.5 o/.5 0/.5' };
    const kit = 'k/1 h/.5 h/.5 s/1 h/.5 k/.5', fill = 'k/1 h/.5 h/.5 s/1 s/.25 s/.25 k/.5';
    R('cite', { bpm: 112, beats: 64, voices: [
      { wave: 'pulse', vol: 0.46, notes: B(4, '-/.5 B4/.5 E5/1 D5/.5 B4/1 G4/.5', 'A4/1 B4/2 -/1', '-/.5 B4/.5 E5/1 D5/.5 B4/1 G4/.5', 'E4/1 G4/2 -/1', '-/.5 C5/.5 E5/1 G5/.5 E5/1 C5/.5', 'D5/1 E5/2 -/1', '-/.5 D5/.5 F#5/1 A5/.5 F#5/1 D5/.5', 'F#5/1 D#5/1 B4/2',
        'D5/2 B4/1 D5/1', 'F#5/2 A5/1 D5/1', 'G5/1.5 F#5/.5 E5/1 B4/1', 'G5/2 E5/2', 'E5/1 G5/1 B5/1.5 A5/.5', 'G5/2 D5/2', 'C5/1 E5/1 A5/1.5 G5/.5', 'F#5/2 D#5/1 B4/1') },
      { wave: 'square', vol: 0.22, pan: -0.35, notes: B(4, ...acc(pA, 4, '^E4', arp), ...acc(pB, 4, '^E4', arp)) },
      { wave: 'pad', vol: 0.22, pan: 0.25, notes: B(4, ...pads(pA.replace(/CM7/g, 'C'), 4, 'G3'), ...pads(pB, 4, 'G3')) },
      { wave: 'bass', vol: 0.4, notes: B(4, ...acc(pA, 4, 'C2', beat), ...acc(pB, 4, 'C2', beat)) },
      { wave: 'drums', vol: 0.34, notes: B(4, ...N(kit, 7), fill, ...N(kit, 7), fill) }
    ] });
  })();

  /* ---------- citadelle : noble et grave — le thème de la Chaîne en sol dorien ; cadence picarde.
     Une citadelle berbère au bord du désert : évocation arabo-andalouse. Prélude de luth sans percussion (joué une fois) ;
     le cor appelle, le luth et les cordes répondent ; puis tout l'ensemble porte le chant : les cordes le tiennent, le luth
     l'orne, le târ et la darbouka tournent en 3 + 3 + 2. ---------- */
  (function () {
    const pA = 'Gm C | Gm C | Am Dm | Dm D | Eb Gm/D | Cm Eb | Am7b5 D7 | G', pB = 'Bb | F/A | Gm | D/F# | Eb | Cm | Dsus D | G';
    // le thème, écrit en ré puis descendu d'une quinte : la, sol, si♮, la → ré, do, mi♮, ré — la sixte dorienne éclaire le maillon du milieu
    const th = trs(['A4/1.5 G4/.5 B4/1.5 A4/.5', 'D5/2.5 -/1 E4/.5', 'B4/1.5 A4/.5 C5/1.5 B4/.5', 'E5/3 -/1', 'F5/1.5 E5/.5 D5/1.5 Bb4/.5', 'G4/1.5 A4/.5 Bb4/2', 'A4/1.5 G4/.5 E4/1.5 C#4/.5', 'D4/4'], -7);
    const chant = ['D5/2 F5/1 Bb5/1', 'A5/3 F5/1', 'Bb5/2 G5/1 D5/1', 'A5/3 D5/1', 'G5/1.5 F5/.5 Eb5/1 G5/1', 'C6/2 G5/1 Eb5/1', 'G5/2 F#5/1.5 D5/.5'];   // la seconde partie, à la flûte
    const min = sc('G A Bb C D Eb F');
    const slow = { 4: '0/1 1/1 2/1 3/1', 2: '0/1 2/1' }, low = { 4: '0/2 0/2', 2: '0/2' };
    const cyc = 'D/.5 r/.5 r/.5 T/.5 r/.5 r/.5 D/.5 r/.5', cyc2 = 'D/.5 r/.5 t/.5 T/.5 r/.5 t/.5 D/.5 T/.5', clos = 'D+b/.5 r/.5 r/.5 T/.5 r/.5 r/.5 D/.5 T/.5';   // 3 + 3 + 2
    R('citadelle', { bpm: 63, beats: 76, intro: 12, voices: [
      // le cor : l'appel (les quatre premières mesures du thème), puis il rejoint l'ensemble à la cadence
      { wave: 'brass', vol: 0.62, notes: B(4, '-/4', '-/4', '-/3.5 G3/.5', th[0], th[1], th[2], th[3], '-/4', '-/4', th[6], th[7],
        'D4/2 F4/2', 'C4/2 F4/2', 'D4/2 Bb3/2', 'A3/2 D4/2', 'Eb4/2 G4/2', 'Eb4/2 C4/2', 'D4/3 C4/1', 'B3/3.5 G3/.5') },
      { wave: 'flute', vol: 0.5, pan: 0.2, notes: B(4, ...N('-/4', 11), ...chant, 'G5/4') },
      // le luth : prélude seul, sans mesure apparente, qui redescend par degrés vers la finale ; puis les réponses au cor
      // (le premier maillon, en valeurs brèves) ; puis le chant, doublé et orné
      { wave: 'pluck', vol: 0.46, pan: -0.25, notes: B(4, two('D4/1.5 E4/.25 D4/.25 C4/.5 D4/.5 F4/1'), two('G4/1 F4/.25 G4/.25 F4/.5 E4/.5 D4/.5 C4/1'), two('Bb3/.5 A3/.5 Bb3/.25 A3/.25 G3/2 -/.5'),
        '-/4', '-/1 D4/.5 C4/.5 E4/.5 D4/.5 G4/.5 -/.5', '-/4', '-/1 E4/.5 D4/.5 F#4/.5 E4/.5 A4/.5 -/.5', ...het(th.slice(4), min, 0, 0.125),
        ...het(chant, min, -12, 0.125), 'G4/1 A4/.5 B4/.5 C5/.25 B4/.25 A4/.5 G4/1') },
      // les cordes tiennent le chant : la charpente des réponses, puis la fin du thème, puis la seconde partie sous la flûte
      { wave: 'strings', vol: 0.44, pan: 0.15, notes: B(4, ...N('-/4', 4), '-/1 D4/1 E4/1 G4/.5 -/.5', '-/4', '-/1 E4/1 F#4/1 A4/.5 -/.5', ...th.slice(4), ...trs(chant, -12), 'G4/2 B4/.5 A4/.5 G4/1') },
      { wave: 'strings', vol: 0.2, pan: -0.2, notes: 'G3+D4/6 G3+D4/6 ' + B(4, ...pads(pA, 4, 'D3'), ...pads(pB.replace('Dsus D', 'Dsus D7'), 4, 'D3')) },
      { wave: 'harp', vol: 0.42, pan: 0.3, notes: B(4, 'G2/.25 D3/.25 G3/.25 D4/3.25', '-/4', '-/2 G3/.25 D4/.25 G4/1.5', ...acc(pA, 4, 'F2', slow), ...acc(pB, 4, 'F2', H8)) },
      { wave: 'triangle', vol: 0.3, notes: 'G2/6 G2/6 ' + B(4, ...acc(pA, 4, 'F2', low), ...acc(pB, 4, 'F2', low)) },
      { wave: 'drums', vol: 0.26, notes: B(4, '-/4', '-/4', '-/4', ...N(cyc, 7), clos, ...N(cyc2, 7), clos) }
    ] });
  })();

  /* ---------- conseil : pourparlers — mi mineur à cinq temps, pédale de mi ; la tension monte et ne se résout pas.
     Couleur arabo-andalouse : la mesure balance entre trois et deux, le târ le marque ; le luth répond aux fins de phrase en
     redescendant par degrés vers la finale ; dans le dernier tiers les cordes tiennent le chant avec la flûte. ---------- */
  (function () {
    const p = 'Em | Em | F/E | Em | Am/E | Em | F#m7b5:3 B7:2 | Em | C/E | Am/E | F#m7b5 | B7';
    const ost = { 5: '0/.5 1/.5 2/.5 1/.5 2/.5 3/.5 0/.5 1/.5 3/.5 1/.5', 3: '0/.5 1/.5 2/.5 1/.5 2/.5 3/.5', 2: '0/.5 1/.5 3/.5 1/.5' };
    const oud = acc(p, 5, 'E3', ost), rep = fig('Em', 'E3', ost[3]) + ' A4/.5 G4/.5 F#4/.5 E4/.5';   // la réponse : la, sol, fa#, mi
    oud[3] = rep; oud[7] = rep;
    R('conseil', { bpm: 96, beats: 60, voices: [
      { wave: 'flute', vol: 0.44, notes: B(5, '-/3 B4/1 C5/1', 'B4/3 G4/2', 'A4/1 C5/1 F5/1 E5/2', 'E5/3 B4/2', '-/3 C5/1 D5/1', 'E5/2 G5/1 F#5/2', 'A4/1 C5/1 E5/1 D#5/1 B4/1', 'E5/3 -/2',
        'G5/2 E5/1 C5/2', 'E5/2 C5/1 A4/2', 'C5/2 A4/1 F#4/2', 'B4/1 D#5/1 F#5/1 B5/2') },
      { wave: 'pluck', vol: 0.38, pan: -0.25, notes: B(5, ...oud) },
      { wave: 'strings', vol: 0.2, pan: 0.2, notes: B(5, ...pads(p, 5, 'G3')) },
      { wave: 'strings', vol: 0.34, pan: 0.1, notes: B(5, ...N('-/5', 8), 'G5/2 E5/1 C5/2', 'E5/2 C5/1 A4/2', 'C5/2 A4/1 F#4/2', 'B4/1 D#5/1 F#5/1 B5/2') },
      { wave: 'triangle', vol: 0.28, notes: B(5, ...acc(p, 5, 'E2', { 5: '0/3 0/2', 3: '0/3', 2: '0/2' })) },
      { wave: 'drums', vol: 0.3, notes: B(5, ...N('D/1 r/1 r/1 T/1 r/1', 12)) }
    ] });
  })();

  /* ---------- combat : sol mineur — levée en fusée sur la gamme hijaz, basse en doubles croches, appels de cuivres ---------- */
  (function () {
    const pA = 'Gm | Gm | Eb | F | Gm | Gm | Cm | D', pB = 'Bb | F/A | Gm | D/F# | Eb | Bb/D | Cm7 | D';
    const rocket = 'D4/.25 Eb4/.25 F#4/.25 G4/.25 A4/.25 Bb4/.25 C5/.25 D5/.25 Eb5/.25 F#5/.25 G5/.25 A5/.25 Bb5/.25 C6/.25 D6/.5';
    // basse en doubles croches : la fondamentale martelée, l'octave qui claque, la quinte en fin de mesure
    const s16 = { 4: '0/.25 0/.25 o/.25 0/.25 0/.25 0/.25 o/.25 0/.25 0/.25 o/.25 0/.25 0/.25 o/.25 0/.25 1/.25 o/.25' }, stab = { 4: N('-/.5 0+1+2/.25 -/.25', 4).join(' ') };
    const kit = 'k/.5 h/.5 s/.5 h/.5 k/.25 k/.25 h/.5 s/.5 h/.5', crash = 'k+c/.5 h/.5 s/.5 h/.5 k/.25 k/.25 h/.5 s/.5 h/.5';
    const turn = 'k/.5 h/.5 s/.5 h/.5 k/.25 k/.25 h/.5 s/.25 s/.25 s/.5', fill = 'k/.5 h/.5 s/.5 h/.5 m/.25 m/.25 m/.25 m/.25 s/.25 s/.25 s/.25 s/.25';
    const bassA = acc(pA, 4, 'C2', s16); bassA[7] = 'D2/.25 D2/.25 D3/.25 D2/.25 D2/.25 D2/.25 D3/.25 D2/.25 D2/.25 D2/.25 D3/.25 D2/.25 D2/.25 E2/.25 F#2/.25 A2/.25';
    R('combat', { bpm: 152, beats: 72, intro: 8, voices: [
      { wave: 'pulse', vol: 0.42, notes: B(4, '-/4', rocket,
        'G5/.5 -/.25 G5/.25 F5/.5 G5/.5 Bb5/1 A5/.5 G5/.5', 'D5/1.5 F5/.5 G5/1 -/1', 'G5/.5 -/.25 G5/.25 F5/.5 G5/.5 Bb5/1 C6/.5 Bb5/.5', 'A5/1.5 G5/.5 F5/1 -/1',
        'Bb5/.5 -/.25 Bb5/.25 A5/.5 Bb5/.5 D6/1 C6/.5 Bb5/.5', 'A5/.5 G5/.5 F5/.5 D5/.5 G5/2', 'Eb5/.5 G5/.5 C6/1 Bb5/.5 G5/.5 Eb5/1', 'D5/.5 F#5/.5 A5/.5 C6/.5 D6/2',
        ...acc(pB, 4, '^D5', { 4: '-/.5 0/.5 1/.5 2/.5 -/.5 2/.5 1/.5 0/.5' }).slice(0, 7), rocket) },
      { wave: 'brass', vol: 0.48, pan: 0.15, notes: B(4, 'G4+Bb4+D5/.5 -/1 G4+Bb4+D5/.5 -/1 G4+Bb4+D5/.5 -/.5', 'F#4+A4+D5/4',
        'G4+Bb4+D5/.5 -/3.5', '-/3 D5/.5 G5/.5', 'Eb4+G4+Bb4/.5 -/3.5', '-/3 C5/.5 F5/.5', 'G4+Bb4+D5/.5 -/3.5', '-/2 D5/.5 Bb4/.5 G4/1', 'Eb4+G4+C5/.5 -/3.5', 'D4+F#4+A4/2 D4+F#4+C5/2',
        'D4/1.5 F4/.5 Bb4/2', 'A4/1.5 G4/.5 F4/1 C5/1', 'Bb4/.5 A4/.5 G4/1 D5/2', 'C5/1 A4/1 F#4/2', 'G4/1.5 Bb4/.5 Eb5/2', 'D5/1.5 C5/.5 Bb4/1 F4/1', 'Eb4/.5 G4/.5 Bb4/1 C5/1 Eb5/1', 'D5/2 -/2') },
      { wave: 'strings', vol: 0.22, pan: -0.2, notes: B(4, 'G3+Bb3+D4/4', 'F#3+A3+D4/4', ...pads(pA, 4, 'G3'), ...pads(pB, 4, 'G3')) },
      { wave: 'bass', vol: 0.36, notes: B(4, 'G2/.25 G2/.25 G3/.25 G2/.25 G2/.25 G2/.25 G3/.25 G2/.25 G2/.25 G3/.25 G2/.25 G2/.25 G3/.25 G2/.25 Bb2/.25 C3/.25', N('D2/.25 D2/.25 D3/.25 D2/.25', 4).join(' '), ...bassA, ...acc(pB, 4, 'C2', s16)) },
      { wave: 'saw', vol: 0.24, pan: 0.3, notes: B(4, '-/4', '-/4', ...acc(pA, 4, '^G3', stab), ...acc(pB, 4, '^G3', stab)) },
      { wave: 'drums', vol: 0.36, notes: B(4, 'k+c/.5 h/.5 h/.5 k/.5 h/.5 h/.5 k/.5 s/.5', N('s/.25', 8).concat(N('m/.25', 4), N('s/.25', 4)).join(' '),
        crash, kit, kit, turn, kit, kit, kit, fill, crash, kit, kit, turn, kit, kit, kit, fill) }
    ] });
  })();

  /* ---------- boss : ré mineur — plus lent, plus lourd ; un ostinato qui frotte (seconde mineure, triton) sous des accords changeants ---------- */
  (function () {
    const pA = 'Dm Ddim | Dm | Eb | Dm | Gm | C#o7 | Dm | A7', pB = 'Bb | Bb | Gm | Gm | Eb | Edim | Asus | A7';
    const riff = 'D2/.5 D2/.5 D3/.5 D2/.5 Eb2/.5 D2/.5 Ab2/.5 A2/.5';
    const kit = 'b+k/1 h/.5 k/.5 s/1 k/.5 h/.5', crash = 'b+k+c/1 h/.5 k/.5 s/1 k/.5 h/.5', fill = 'b+k/1 h/.5 k/.5 s/.5 s/.5 m/.25 m/.25 s/.25 s/.25';
    R('boss', { bpm: 126, beats: 72, intro: 8, voices: [
      { wave: 'brass', vol: 0.6, notes: B(4, '-/4', '-/4',
        'D4/1 F4/1 Ab4/1.5 G4/.5', 'F4/1 E4/1 D4/2', 'Eb4/1 G4/1 Bb4/1.5 A4/.5', 'G4/1 F4/1 D4/2', 'D4/1 G4/1 Bb4/1.5 A4/.5', 'Bb4/1 C#5/1 E5/2', 'F5/1.5 E5/.5 D5/1 A4/1', 'Bb4/1.5 A4/.5 E4/1 C#4/1',
        'Bb3+F4/4', 'Bb3+F4/4', 'G3+D4/4', 'G3+D4/4', 'Eb4+Bb4/4', 'E4+Bb4/4', 'D4+A4/4', 'C#4+A4/4') },
      { wave: 'saw', vol: 0.54, pan: 0.15, notes: B(4, ...N('-/4', 10), 'F5/2 D5/1 F5/1', 'Bb5/2 A5/1 F5/1', 'G5/2 D5/1 G5/1', 'Bb5/1.5 A5/.5 G5/2', 'G5/2 Eb5/1 G5/1', 'Bb5/2 G5/1 E5/1', 'A5/3 G5/1', 'E5/1 C#5/1 A4/2') },
      { wave: 'strings', vol: 0.24, pan: -0.2, notes: B(4, '-/4', 'F3+A3+D4/4', ...pads(pA, 4, 'F3'), ...pads(pB, 4, 'F3')) },
      { wave: 'bass', vol: 0.42, notes: B(4, ...N(riff, 10), ...acc(pB, 4, 'D2', { 4: '0/.5 0/.5 o/.5 0/.5 1/.5 0/.5 o/.5 1/.5' })) },
      { wave: 'timp', vol: 0.26, notes: B(4, 'D2/1 -/1 D2/1 A2/1', 'D2/1 -/1 A2/.5 A2/.5 A2/.25 A2/.25 A2/.25 A2/.25', ...N('D2/2 -/1.5 A2/.5', 8),
        'Bb2/2 -/2', 'Bb2/2 -/2', 'G2/2 -/2', 'G2/2 -/2', 'Eb2/2 -/2', 'E2/2 -/2', 'A2/2 -/1 A2/.5 A2/.5', 'A2/1 A2/1 A2/.5 A2/.5 A2/.25 A2/.25 A2/.25 A2/.25') },
      { wave: 'drums', vol: 0.34, notes: B(4, 'b+k/1 -/1 k/1 s/1', 'b+k/1 k/.5 k/.5 s/.5 s/.5 m/.25 m/.25 m/.25 m/.25', crash, ...N(kit, 6), fill, crash, ...N(kit, 6), fill) }
    ] });
  })();

  /* ---------- vice : l'adversaire final — do mineur. La Chaîne renversée (les maillons tombent), les accords de la Noosphère,
     puis le thème droit, qui tient jusqu'à une cadence picarde avant que tout recommence. ---------- */
  (function () {
    const pI = 'Cm | Ab/C | F#o7/C | G7', pA = 'Fm Cm | Ab | Cm G | G | Ab Fm | G7 | Cm G7 | Cm', pB = 'Cm | Abm | Em | Gaug | Cm | Abm | Em | G', pC = trp(CHPm, -2);
    const up = trs([CHm.a1, 'D5/2.5 -/1 D4/.5', CHm.a3, CHm.a4, CHm.b1, CHm.b2, CHm.b3], -2);       // le thème droit, en do mineur
    const drive = '0/.25 0/.25 o/.25 0/.25', s16 = { 4: N(drive, 4).join(' '), 2: N(drive, 2).join(' ') };
    const kit = 'k/.5 h/.5 s/.5 k/.25 k/.25 h/.5 k/.5 s/.5 h/.5', crash = 'k+c/.5 h/.5 s/.5 k/.25 k/.25 h/.5 k/.5 s/.5 h/.5', fill = 'k/.5 h/.5 s/.5 k/.25 k/.25 ' + N('m/.25', 4).concat(N('s/.25', 4)).join(' ');
    const half = 'b+k/1 h/.5 h/.5 s/1 h/.5 k/.5';
    R('vice', { bpm: 132, beats: 112, intro: 16, voices: [
      { wave: 'brass', vol: 0.6, notes: B(4, '-/4', '-/4', '-/4', 'G3+D4/3.5 C5/.5',
        'F4/1.5 G4/.5 Eb4/1.5 F4/.5', 'C4/2.5 -/1 Bb4/.5', 'Eb4/1.5 F4/.5 D4/1.5 Eb4/.5', 'B3/2.5 -/1 G4/.5', 'Ab4/1.5 G4/.5 F4/1.5 Eb4/.5', 'D4/1.5 Eb4/.5 F4/2', 'Eb4/1.5 D4/.5 C4/1.5 B3/.5', 'C4/4',
        'C4+G4/4', 'Ab3+Eb4/4', 'G3+E4/4', 'G3+D#4/4', 'C4+G4/4', 'Ab3+Eb4/4', 'G3+E4/4', 'G3+D4/3.5 C4/.5',
        ...up, 'C4/3.5 C5/.5') },
      { wave: 'saw', vol: 0.54, pan: 0.15, notes: B(4, ...N('-/4', 4),
        '-/4', '-/1 Ab5/.5 G5/.5 Eb5/.5 C5/.5 Eb5/1', '-/4', '-/1 D5/.5 G5/.5 B5/.5 G5/.5 D5/1', '-/4', '-/2 B5/.5 G5/.5 F5/.5 D5/.5', '-/4', '-/1 G5/.5 Eb5/.5 C5/1 -/1',
        'G5/2 Eb5/1 G5/1', 'Eb5/1 Ab5/1 B5/2', 'B5/1.5 G5/.5 E5/2', 'D#5/1 G5/1 B5/2', 'C6/2 G5/1 Eb5/1', 'Eb5/1 B5/1 Ab5/2', 'G5/1.5 E5/.5 B4/1 E5/1', 'D5/1 G5/1 B5/1 D6/.5 C5/.5',
        ...trs(up, 12), 'C5/4') },
      { wave: 'strings', vol: 0.24, pan: -0.2, notes: B(4, ...pads(pI, 4, 'G3'), ...pads(pA.replace('Cm G7 |', 'Cm:2 G7sus:1.5 G7:.5 |'), 4, 'G3'), ...pads(pB, 4, 'G3'), ...pads(pC, 4, 'G3')) },
      { wave: 'bell', vol: 0.3, pan: 0.3, notes: B(4, 'C5/2 -/2', 'C5/2 -/2', 'C5/2 -/2', 'G4/1 B4/1 D5/1 F5/1', ...N('-/4', 8),
        'C5/2 G4/2', 'Eb5/2 Ab4/2', 'E5/2 B4/2', 'D#5/2 G4/2', 'C5/2 G4/2', 'Eb5/2 Ab4/2', 'E5/2 B4/2', 'D5/2 G4/2', 'C5/4', ...N('-/4', 3), 'C5/4', '-/4', '-/4', 'E5/1 G5/1 C6/2') },
      { wave: 'bass', vol: 0.4, notes: B(4, 'C2/4', 'C2/4', N('C2/.5', 8).join(' '), N('G2/.25', 16).join(' '), ...acc(pA, 4, 'C2', s16), ...acc(pB, 4, 'C2', { 4: '0/1 0/.5 0/.5 o/1 0/1' }), ...acc(pC, 4, 'C2', s16)) },
      { wave: 'timp', vol: 0.26, notes: B(4, 'C3/1 -/3', 'C3/1 -/3', 'C3/1 -/1 C3/1 -/1', 'G2/.5 G2/.5 G2/.5 G2/.5 ' + N('G2/.25', 8).join(' '),
        '-/2 C3/1 -/1', '-/4', 'C3/1 -/1 G2/1 -/1', 'G2/1 -/1 G2/.5 G2/.5 G2/1', '-/4', 'G2/1 -/3', 'C3/1 -/1 G2/1 G2/1', 'C3/1 -/2 G2/.5 G2/.5',
        'C3/2 -/2', '-/4', '-/4', 'G2/2 -/2', 'C3/2 -/2', '-/4', '-/4', 'G2/1 G2/1 G2/.5 G2/.5 ' + N('G2/.25', 4).join(' '),
        'C3/1 -/3', 'C3/1 -/3', '-/2 G2/1 -/1', 'G2/1 -/1 G2/1 G2/1', '-/4', '-/4', '-/2 G2/.5 G2/.5 G2/.5 G2/.5', 'C3/2 -/1 G2/.5 G2/.5') },
      { wave: 'drums', vol: 0.32, notes: B(4, 'b/4', 'b/4', 'b/2 b/2', 'b/1 ' + N('s/.25', 8).concat(N('m/.25', 4)).join(' '),
        crash, kit, kit, fill, kit, kit, kit, fill, 'b+k+c/1 h/.5 h/.5 s/1 h/.5 k/.5', ...N(half, 6), 'b+k/1 h/.5 h/.5 s/.5 s/.5 m/.25 m/.25 s/.25 s/.25',
        crash, kit, kit, fill, kit, kit, kit, 'k+c/1 -/1 ' + N('s/.25', 4).concat(N('m/.25', 4)).join(' ')) }
    ] });
  })();

  /* ---------- victoire : fanfare sur le thème de la Chaîne (ré majeur, IV–V–I), puis boucle douce : le thème, deux fois plus lent ---------- */
  (function () {
    const pL = 'D | G | D/F# | A7sus | Bm | G | Em7 A7 | D';
    R('victoire', { bpm: 132, beats: 41, intro: 9, voices: [
      { wave: 'brass', vol: 0.6, notes: '-/.5 D4/.5 A4+F#4/1.5 G4+E4/.5 B4+G4/1.5 A4+F#4/.5 D5+B4/1.5 E5+C#5/.5 F#5+D5+A4/2 -/16 -/16' },
      { wave: 'strings', vol: 0.22, pan: -0.2, notes: '-/1 F#3+A3+D4/2 G3+B3+D4/2 G3+B3+D4/1.5 A3+C#4+E4/.5 F#3+A3+D4/2 ' + B(4, ...pads(pL, 4, 'F#3')) },
      { wave: 'flute', vol: 0.46, notes: '-/9 ' + B(4, 'A4/3 G4/1', 'B4/3 A4/1', 'D5/4', 'E5/2 D5/1 B4/1', 'F#5/3 E5/1', 'D5/3 B4/1', 'G4/1.5 A4/.5 F#4/1.5 E4/.5', 'D4/4') },
      { wave: 'harp', vol: 0.36, pan: 0.25, notes: '-/7 D4/.25 F#4/.25 A4/.25 D5/.25 F#5/.25 A5/.25 D6/.5 ' + B(4, ...acc(pL, 4, 'D2', H8)) },
      { wave: 'contra', vol: 0.28, notes: '-/1 D2/2 G2/2 G2/1.5 A2/.5 D2/2 ' + B(4, ...acc(pL, 4, 'D2', { 4: '0/2.5 0/.5 1/1', 2: '0/2' })) },
      { wave: 'drums', vol: 0.3, notes: 's/.25 s/.25 s/.25 s/.25 k+c/1 s/.5 s/.5 k/1 s/.5 s/.5 k/1 s/.25 s/.25 k/.5 k+c/2 ' + B(4, ...N('D/1 r/.5 t/.5 T/1 r/1', 8)) }
    ] });
  })();

  /* ---------- deuil : lent, à trois temps, peu de voix — ré mineur ; la fin reste ouverte, sans tierce ---------- */
  (function () {
    const p = 'Dm | Dm/C | Bb | A | Dm | Gm | A7sus:2 A:1 | Dm | F | C/E | Dm | A/C# | Bb | Gm6 | A7 | D5';
    const st = pads(p, 3, 'F3'); for (let i = 0; i < 8; i++) st[i] = '-/3';
    R('deuil', { bpm: 56, beats: 48, voices: [
      { wave: 'flute', vol: 0.44, notes: B(3, 'A4/2 D5/1', 'F5/2 E5/1', 'D5/3', 'C#5/2 A4/1', 'A4/2 D5/1', 'G5/2 F5/1', 'E5/2 C#5/1', 'D5/3',
        'A4/1 C5/1 F5/1', 'G5/2 E5/1', 'F5/2 D5/1', 'E5/3', 'D5/2 F5/1', 'E5/2 D5/1', 'E5/1 C#5/1 A4/1', 'D4/3') },
      { wave: 'harp', vol: 0.48, pan: -0.15, notes: B(3, ...acc(p, 3, 'C2', { 3: '0/.5 1/.5 2/.5 3/.5 2/.5 1/.5', 2: '0/.5 1/.5 2/.5 3/.5', 1: '0/.5 3/.5' })) },
      { wave: 'triangle', vol: 0.24, notes: B(3, ...acc(p, 3, 'C2', { 3: '0/3', 2: '0/2', 1: '0/1' })) },
      { wave: 'strings', vol: 0.2, pan: 0.15, notes: B(3, ...st) }
    ] });
  })();

  /* ---------- espoir : le thème de la Chaîne s'ouvre — ré majeur, puis fa majeur (une tierce plus haut), et retour ---------- */
  (function () {
    const pA = CHP.replace(/\| D$/, '| D C7sus'), pF = trp(CHP, 3), pT = 'Bb Gm | A7sus:2 A7:1 A7sus:1';
    const lift = { 4: '0/1.5 0/.5 1/1 0/1', 2: '0/1.5 0/.5' }, calm = { 4: '0/3 0/1', 2: '0/2', 1: '0/1' };
    const st = pads(pA, 4, 'F#3'); for (let i = 0; i < 4; i++) st[i] = '-/4';
    const soft = 'D/1 r/.5 t/.5 T/1 r/1', full = 'D/1 r/.5 t/.5 T/.5 D/.5 r/.5 t/.5';
    R('espoir', { bpm: 96, beats: 72, voices: [
      { wave: 'flute', vol: 0.48, notes: B(4, CH.a1, CH.a2, CH.a3, CH.a4, CH.b1, CH.b2, CH.b3, 'D4/2 -/2', ...trs(DESC.slice(0, 7), 3), 'A4/4', 'D5/1.5 C5/.5 Bb4/2', 'A4/3.5 D4/.5') },
      { wave: 'brass', vol: 0.58, pan: 0.15, notes: B(4, ...N('-/4', 7), '-/3.5 F4/.5', ...trs([CH.a1, CH.a2, CH.a3, CH.a4, CH.b1, CH.b2, CH.b3], 3), 'F4/4', '-/4', '-/4') },
      { wave: 'strings', vol: 0.22, pan: -0.2, notes: B(4, ...st, ...pads(pF, 4, 'F#3'), ...pads(pT, 4, 'F#3')) },
      { wave: 'harp', vol: 0.38, pan: 0.25, notes: B(4, ...acc(pA, 4, 'D2', H8), ...acc(pF, 4, 'D2', H16), ...acc(pT, 4, 'D2', H8)) },
      { wave: 'contra', vol: 0.28, notes: B(4, ...acc(pA, 4, 'D2', calm), ...acc(pF, 4, 'D2', lift), ...acc(pT, 4, 'D2', calm)) },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('-/4', 4), ...N(soft, 4), ...N(full, 8), 'D/2 T/2', 'D/1 t/1 T/.5 T/.5 t/.25 t/.25 t/.25 t/.25') }
    ] });
  })();

  /* ---------- lame : une lame se forge — ré, quartes et quintes à nu, l'enclume ; la tierce majeure n'arrive qu'au dernier accord ---------- */
  (function () {
    const p = 'D5 | C | Bb | Asus A | Dm | G | Em7b5 A7 | D';
    const strike = 'b+a/1 -/.5 a/.5 a/1 -/1';
    R('lame', { bpm: 80, beats: 32, voices: [
      { wave: 'brass', vol: 0.6, notes: B(4, 'D4+A3/2 G4+D4/1 A4+D4/1', 'C5+G4/3 G4+E4/1', 'F4+D4/2 Bb4+F4/1 D5+Bb4/1', 'D5+A4/2 C#5+A4/2', 'D5+A4/2 A4+F4/1 F4+D4/1', 'G4+D4/2 B4+G4/1 D5+B4/1', 'Bb4+G4/2 A4+E4/1 G4+E4/1', 'F#4+D4/4') },
      { wave: 'strings', vol: 0.22, pan: -0.2, notes: B(4, ...pads(p, 4, 'F3')) },
      { wave: 'timp', vol: 0.3, notes: B(4, 'D2/2 -/2', '-/4', '-/4', 'A2/2 A2/2', 'D2/2 -/2', '-/4', '-/2 A2/1 A2/1', 'D2/2 -/2') },
      { wave: 'bell', vol: 0.3, pan: 0.35, notes: B(4, '-/4', '-/3 G6/1', '-/4', '-/3 E6/1', '-/4', '-/3 D6/1', '-/4', '-/1 A5/1 D6/2') },
      { wave: 'triangle', vol: 0.28, notes: B(4, ...acc(p, 4, 'D2', { 4: '0/4', 2: '0/2' })) },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N(strike, 7), 'b+a/1 -/.5 a/.5 a/1 a/.5 a/.5') }
    ] });
  })();

  /* ---------- rencontre : un soir de 2084, un enfant pose une question — la majeur ; la boîte à musique interroge et reste
     suspendue sur la dominante, le roseau répond, la sous-dominante mineure passe comme une ombre ---------- */
  (function () {
    const p = 'AM7 | F#m7 | DM7 | Dm6 | A/C# | Bm7 | E7sus | E7sus | F#m7 | C#m7 | DM7 | A/C# | Bm7 | Dm6 | Aadd9 | Esus';
    R('rencontre', { bpm: 84, beats: 64, voices: [
      { wave: 'bell', vol: 0.5, notes: B(4, '-/1 E5/1 A5/1 G#5/1', 'E5/2 C#5/2', '-/1 D5/1 F#5/1 A5/1', 'B5/2 A5/1 F5/1', 'E5/2 C#5/1 E5/1', 'D5/1 F#5/1 A5/2', 'E5/1 F#5/1 A5/1 B5/1', 'B5/3 -/1', ...N('-/4', 8)) },
      { wave: 'flute', vol: 0.5, pan: 0.15, notes: B(4, ...N('-/4', 8), 'A4/2 C#5/1 E5/1', 'E5/2 B4/1 G#4/1', 'F#4/1 A4/1 C#5/2', 'E5/2 C#5/1 A4/1', 'D5/2 B4/1 D5/1', 'F5/2 D5/1 B4/1', 'C#5/2 B4/1 A4/1', 'A4/2 B4/2') },
      { wave: 'square', vol: 0.24, pan: -0.3, notes: B(4, ...acc(p.replace(/DM7/g, 'Dadd9'), 4, '^A3', { 4: '0/.5 1/.5 2/.5 3/.5 2/.5 1/.5 2/.5 1/.5' })) },
      { wave: 'pad', vol: 0.22, pan: 0.2, notes: B(4, ...pads(p.replace('AM7', 'A').replace(/DM7/g, 'D'), 4, 'E3')) },
      { wave: 'triangle', vol: 0.24, notes: B(4, ...acc(p, 4, 'D2', { 4: '0/2.5 0/.5 0/1' })) },
      { wave: 'drums', vol: 0.3, notes: B(4, ...N('-/1 h/1 -/1 h/1', 16)) }
    ] });
  })();
})();
