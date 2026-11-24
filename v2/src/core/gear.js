/* ISNAD — l'équipement : quatre emplacements (main droite, main gauche, tête, corps), une réserve commune,
   des pièces que l'on voit. Règles, icônes et pages de la halte ; les pièces sont déclarées dans defs.js.
   Ce sont des objets ordinaires de l'époque : une convention de jeu, ni relique ni reconstitution. Le jeu
   ne dit pas qui portait quoi, et aucun objet ne reçoit de vertu : le fer aide à tenir, il ne remplace pas le cœur. */
(function () {
  'use strict';
  const I = window.ISNAD, G = I.gfx, D = I.D, S = I.script;
  const Gr = I.gear = {};
  const SLOTS = Object.keys(D.SLOTS), STATS = ['atk', 'mag', 'def', 'spd', 'hp', 'sp'];
  const NOM = { atk: I.T('Force'), mag: I.T('Esprit'), def: I.T('Garde'), spd: I.T('Élan§stat'), hp: I.T('Constance'), sp: I.T('Souffle') };
  const TRAITS = ['perce', 'vif', 'choc', 'parade', 'ferme'];
  Gr.SLOTS = SLOTS; Gr.NOM = NOM;

  /* ================= état : la réserve, ce que chacun porte ================= */
  Gr.state = function () { const d = I.save.data; if (!d.gear) d.gear = {}; if (!d.equip) d.equip = {}; if (!d.gearInit) d.gearInit = {}; return d; };
  Gr.typeOf = id => D.GEAR_TYPES[D.GEAR[id].t];
  Gr.slotOf = id => Gr.typeOf(id).slot;
  Gr.can = (def, id) => { const g = D.GEAR[id]; return !!g && (g.roles || D.GEAR_TYPES[g.t].roles).includes(def.role); };
  Gr.prix = id => D.GEAR_PRIX[D.GEAR[id].r];
  Gr.revente = id => Math.floor(Gr.prix(id) / 2);
  Gr.key = h => h.key || (I.world.saga.id + ':' + h.id);
  Gr.stock = id => Gr.state().gear[id] || 0;
  Gr.add = function (id, n) { const d = Gr.state(); d.gear[id] = Math.max(0, (d.gear[id] || 0) + n); if (!d.gear[id]) delete d.gear[id]; };
  Gr.reserve = slot => Object.keys(Gr.state().gear).filter(id => D.GEAR[id] && (!slot || Gr.slotOf(id) === slot)).sort((a, b) => D.GEAR[b].r - D.GEAR[a].r || D.GEAR[a].name.localeCompare(D.GEAR[b].name));

  // ce avec quoi un héros commence : selon son rôle, et selon ce que son dessin montre déjà
  function depart(def) {
    const L = def.look || {}, it = [].concat(L.item || []), e = {};
    const first = list => list.find(id => id && Gr.can(def, id));
    e.md = first([it.includes('sabre') && 'epee_fer', it.includes('lance') && 'javelot', it.includes('feuillets') && 'calame', it.includes('baton') && 'baton_marche',
      { guerrier: 'epee_fer', gardien: 'baton_marche', stratege: 'couteau', sage: 'calame', soigneur: 'baton_marche' }[def.role]]);
    if (it.includes('bouclier')) e.mg = first(['bouclier_cuir']);
    if (D.DE_2084.indexOf(L.kind) < 0) {   // en 2084 (D.DE_2084) : ni casque ni tunique de départ
      e.tete = first([L.coiffe === 'casque_turban' && 'casque_turban', L.coiffe === 'casque' && 'casque_fer', 'turban']);
      e.corps = first([L.cuirasse && 'cotte', 'tunique']);
    }
    SLOTS.forEach(s => { if (!e[s]) delete e[s]; });
    return e;
  }
  // { md, mg, tete, corps } ; la première fois, la tenue de départ ; un groupe retrouvé se sert dans la réserve
  Gr.of = function (h) {
    const d = Gr.state(), k = Gr.key(h);
    if (!d.equip[k]) { if (!d.gearInit[k]) { d.gearInit[k] = 1; d.equip[k] = depart(h.def); } else { d.equip[k] = {}; Gr.best(h); } }
    return d.equip[k];
  };
  Gr.mods = function (h, eq) { const e = eq || Gr.of(h), m = { atk: 0, mag: 0, def: 0, spd: 0, hp: 0, sp: 0 }; SLOTS.forEach(s => { const g = D.GEAR[e[s]]; if (g) STATS.forEach(k => { m[k] += g[k] || 0; }); }); return m; };
  // ce que l'équipement change au combat, au-delà des chiffres
  Gr.traits = function (h) {
    const e = Gr.of(h), t = { perce: 0, vif: 0, choc: 0, parade: 0, ferme: 0, prime: false, anim: null, arme: null };
    SLOTS.forEach(s => { const g = D.GEAR[e[s]]; if (!g) return; TRAITS.forEach(k => { t[k] = Math.min(0.75, t[k] + (g[k] || 0)); }); if (g.prime) t.prime = true; });
    const a = D.GEAR[e.md]; if (a) { t.arme = a; t.anim = D.GEAR_TYPES[a.t].anim || null; }
    return t;
  };
  Gr.sync = function (h) { const st = I.calc.of(h); h.hp = Math.min(h.hp, st.hp); h.sp = Math.min(h.sp, st.sp); };
  // équiper (ou retirer : id nul). L'ancienne pièce retourne à la réserve.
  Gr.put = function (h, slot, id) {
    const e = Gr.of(h), old = e[slot]; if (id && (Gr.slotOf(id) !== slot || !Gr.can(h.def, id) || !Gr.stock(id))) return false;
    if (old) Gr.add(old, 1); if (id) { Gr.add(id, -1); e[slot] = id; } else delete e[slot];
    Gr.sync(h); return true;
  };
  // pièces portées par ceux qui ne sont pas du groupe (autre saga, compagnon resté en arrière) : on peut les rappeler
  Gr.ailleurs = function (h, slot) {
    const d = Gr.state(), W = I.world, ici = W.party.map(id => Gr.key(W.hero(id))), out = [];
    Object.keys(d.equip).forEach(k => { if (ici.includes(k)) return; const id = d.equip[k][slot]; if (!id || !Gr.can(h.def, id)) return; const [sid, hid] = k.split(':'), def = I.sagas[sid] && I.sagas[sid].heroes[hid]; out.push({ id, key: k, name: def ? def.name : '?' }); });
    return out;
  };
  Gr.rappeler = function (key, slot) { const e = Gr.state().equip[key]; if (e && e[slot]) { Gr.add(e[slot], 1); delete e[slot]; } };
  // à la fin d'une saga, ce que son groupe portait rejoint la réserve : le groupe suivant s'en servira
  // (les pièces de départ, de rang 0, ne s'y entassent pas : deux de chaque suffisent)
  Gr.deposer = function (sagaId) { const d = Gr.state(); let n = 0; Object.keys(d.equip).forEach(k => { if (k.indexOf(sagaId + ':') !== 0) return; SLOTS.forEach(s => { const id = d.equip[k][s]; if (id && D.GEAR[id] && !(D.GEAR[id].r === 0 && Gr.stock(id) >= 2)) { Gr.add(id, 1); n++; } }); delete d.equip[k]; }); return n; };

  /* ================= choisir : ce qu'une pièce vaut pour un rôle ================= */
  const POIDS = {
    guerrier: { atk: 3, def: 1.5, hp: 1.2, spd: 1.2, mag: 0.6, sp: 0.4 }, gardien: { def: 3, hp: 2, atk: 1.6, spd: 0.8, mag: 0.8, sp: 0.5 },
    sage: { mag: 3, sp: 1.6, hp: 1, def: 1, spd: 1, atk: 0.2 }, soigneur: { mag: 2.6, sp: 2, hp: 1.2, def: 1, spd: 1, atk: 0.2 },
    stratege: { spd: 2.6, atk: 2, mag: 1.6, def: 1, hp: 1, sp: 0.8 }
  };
  Gr.score = function (def, id) {
    const g = D.GEAR[id]; if (!g) return 0; const w = POIDS[def.role]; let s = 0.5; // une pièce vaut toujours mieux que rien
    STATS.forEach(k => { s += (g[k] || 0) * w[k]; });
    return s + ((g.perce || 0) + (g.vif || 0)) * 10 * w.atk + (g.choc || 0) * 30 + (g.parade || 0) * 60 + (g.ferme || 0) * 6 + (g.prime ? 4 : 0);
  };
  // « Au mieux » : pour chaque emplacement, la meilleure pièce de la réserve. Rend le nombre de pièces changées.
  Gr.best = function (h) {
    const e = Gr.of(h); let n = 0;
    SLOTS.forEach(s => { let top = e[s] || null, sc = top ? Gr.score(h.def, top) : 0;
      Gr.reserve(s).forEach(id => { if (Gr.can(h.def, id) && Gr.score(h.def, id) > sc + 0.01) { top = id; sc = Gr.score(h.def, id); } });
      if (top !== (e[s] || null) && Gr.put(h, s, top)) n++; });
    return n;
  };
  Gr.bestAll = function () { const W = I.world; let n = 0; if (!W.saga) return 0; W.party.forEach(id => { n += Gr.best(W.hero(id)); }); return n; };
  // la réserve tient-elle mieux que ce que porte quelqu'un du groupe ?
  Gr.better = function () {
    const W = I.world; if (!W.saga) return null;
    for (const id of W.party) { const h = W.hero(id), e = Gr.of(h); for (const g of Gr.reserve()) { const s = Gr.slotOf(g); if (Gr.can(h.def, g) && Gr.score(h.def, g) > (e[s] ? Gr.score(h.def, e[s]) : 0) + 0.01) return { h, id: g }; } }
    return null;
  };

  // ce qu'une victoire peut rapporter : une pièce que quelqu'un du groupe peut porter, de préférence une que l'on n'a pas ;
  // toujours après une idole, de temps en temps sinon ; d'un rang qui suit le niveau du groupe (le rang 4 ne se trouve qu'en coffre)
  Gr.prise = function (o) {
    const W = I.world, heroes = W.party.map(id => W.hero(id)); if (!heroes.length) return null;
    if (Math.random() > (o.boss ? 1 : o.elite ? 0.3 : 0.14)) return null;
    const lvl = heroes[0].lvl, rmax = lvl >= 6 ? 3 : lvl >= 3 ? 2 : 1, rmin = o.boss ? Math.max(1, rmax - 1) : Math.max(0, rmax - 2), d = Gr.state(), porte = new Set();
    Object.values(d.equip).forEach(e => SLOTS.forEach(s => { if (e[s]) porte.add(e[s]); }));
    let L = Object.keys(D.GEAR).filter(id => { const g = D.GEAR[id]; return g.r >= rmin && g.r <= rmax && heroes.some(h => Gr.can(h.def, id)); });
    const neuf = L.filter(id => !Gr.stock(id) && !porte.has(id)); if (neuf.length) L = neuf;
    return L.length ? I.pick(L) : null;
  };

  /* ================= dire : effets, comparaisons ================= */
  const pc = v => (v > 0 ? '+' : '−') + Math.abs(v) + ' %';
  Gr.effets = function (g) {
    const out = STATS.filter(k => g[k]).map(k => `${I.t(NOM[k])} ${pc(g[k])}`);
    if (g.perce) out.push(I.t('perce la garde ({n} %)', { n: Math.round(g.perce * 100) }));
    if (g.vif) out.push(I.t('frappe parfois deux fois ({n} %)', { n: Math.round(g.vif * 100) }));
    if (g.prime) out.push(I.t('agit plus tôt au début du combat'));
    if (g.choc) out.push(I.t('peut étourdir ({n} %)', { n: Math.round(g.choc * 100) }));
    if (g.parade) out.push(I.t('pare un coup de fer ({n} %)', { n: Math.round(g.parade * 100) }));
    if (g.ferme) out.push(I.t('tient bon face à l’étourdissement ({n} %)', { n: Math.round(g.ferme * 100) }));
    return out.join(' · ') || I.t('sans effet');
  };
  const avec = (h, slot, id) => { const e = Object.assign({}, Gr.of(h)); if (id) e[slot] = id; else delete e[slot]; return e; };
  const pts = (st, k) => Math.round(st[k]);
  // « Force 43 → 48 ▲ » pour chaque statistique qui bouge
  Gr.compare = function (h, slot, id) {
    const a = I.calc.of(h), b = I.calc.of(h, avec(h, slot, id));
    const L = STATS.filter(k => pts(a, k) !== pts(b, k)).map(k => `<span class="${pts(b, k) > pts(a, k) ? 'up' : 'down'}">${I.t(NOM[k])} ${pts(a, k)} → <b>${pts(b, k)}</b> ${pts(b, k) > pts(a, k) ? '▲' : '▼'}</span>`);
    return L.length ? L.join('') : '<span>' + I.t('Aucun chiffre ne change.') + '</span>';
  };
  // le même constat en une ligne, pour un choix rapide
  Gr.delta = function (h, slot, id) {
    const a = I.calc.of(h), b = I.calc.of(h, avec(h, slot, id));
    return STATS.filter(k => pts(a, k) !== pts(b, k)).map(k => `${I.t(NOM[k])} ${pts(b, k) > pts(a, k) ? '+' : '−'}${Math.abs(pts(b, k) - pts(a, k))}`).join(' · ') || I.t('rien ne change');
  };

  /* ================= montrer : le personnage équipé, tel qu'on le voit au combat ================= */
  const TENUS = ['sabre', 'lance', 'baton', 'bouclier', 'arc', 'dague', 'masse', 'calame', 'tablette', 'bouclier_cuir', 'bouclier_bois', 'pavois', 'outre'];
  const CASQUES = ['casque', 'casque_turban', 'casque_cuir', 'casque_bandes', 'coiffe_mailles'];
  Gr.look = function (h, eq) {
    const e = eq || Gr.of(h), L = Object.assign({ kind: 'compagnon' }, h.def.look), items = [].concat(L.item || []).filter(x => !TENUS.includes(x));
    delete L.porte; // 2.x : l'objet que le joueur donne à son râwî se range au combat et sur la page d'équipement (l'arme prend la main)
    const port = id => { const g = D.GEAR[id]; return g ? (g.port || D.GEAR_TYPES[g.t].port) : null; };
    [port(e.md), port(e.mg)].forEach(p => { if (p) items.push(p); });
    if (items.length) L.item = items; else delete L.item;
    if (D.DE_2084.indexOf(L.kind) >= 0) return L; // en 2084, la silhouette garde sa capuche : seul ce que l'on tient change
    const te = D.GEAR[e.tete], co = D.GEAR[e.corps];
    if (te && te.tete) L.coiffe = te.tete; else if (CASQUES.includes(L.coiffe)) L.coiffe = 'imama';
    delete L.cuirasse; if (co && co.corps) L.armure = co.corps; else delete L.armure;
    return L;
  };

  /* ================= icônes : 16 × 16, une matière par lettre =================
     C c k couleur principale (clair, moyen, sombre) · A a accent · I i fer · W w bois · P page · N encre */
  const ICO = {
    epee: ['..............Cc', '.............Cck', '............Cck.', '...........Cck..', '..........Cck...', '.........Cck....', '........Cck.....', '.......Cck......',
      '..A...Cck.......', '..aA.Cck........', '...aACk.........', '....WAa.........', '...Ww.aA........', '..Ww...a........', '.Ww.............', 'Aa..............'],
    lance: ['..............CC', '.............CCc', '............CCck', '...........Ccck.', '..........Aak...', '.........Aa.....', '........Aa......', '.......Aa.......',
      '......Aa........', '.....Aa.........', '....Aa..........', '...Aa...........', '..Aa............', '.Aa.............', 'Aa..............', 'a...............'],
    javelot: ['................', '................', '.............CC.', '............CCc.', '...........CCck.', '..........Acck..', '.........Aa.....', '........Aa......',
      '.......WW.......', '......Ww........', '.....Aa.........', '....Aa..........', '...Aa...........', '..Aa............', '................', '................'],
    arc: ['..........Cc....', '........CCcA....', '.......Cc..A....', '......Cc...A....', '.....Cc....A....', '.....Cc....A....', '....Cc.....A....', '....Ck.....A....',
      '....Ck.....A....', '....Cc.....A....', '.....Cc....A....', '.....Cc....A....', '......Cc...A....', '.......Cc..A....', '........CCcA....', '..........Cc....'],
    arc2: ['...........Cc...', '..........Cc....', '........CCcA....', '......CCc..A....', '.....Cc....A....', '.....Cc....A....', '......Cc...A....', '......Ck...A....',
      '......Ck...A....', '......Cc...A....', '.....Cc....A....', '.....Cc....A....', '......CCc..A....', '........CCcA....', '..........Cc....', '...........Cc...'],
    dague: ['................', '................', '.............C..', '............Cc..', '...........Cck..', '..........Cck...', '.........Cck....', '........Cck.....',
      '....A..Cck......', '....aA.ck.......', '.....aAa........', '.....WwaA.......', '....Ww..a.......', '...Ww...........', '..Aa............', '................'],
    masse: ['..........CC....', '........CCCCc...', '.......CCCCCck..', '......CCCCCCcck.', '......CCCCCcckk.', '.......CCCcckk..', '........cckkk...', '.......Aakk.....',
      '......Aa........', '.....Aa.........', '....Aa..........', '...Aa...........', '..Aa............', '.Aa.............', 'Aa..............', '................'],
    baton: ['.............CC.', '............CCc.', '...........CCc..', '..........CCc...', '.........CCc....', '........CCc.....', '.......CCc......', '......CCc.......',
      '.....CCc........', '....CCc.........', '...CCc..........', '..CCc...........', '.CCc............', 'CCc.............', 'Cc..............', '................'],
    baton_ferre: ['.............AA.', '............AAa.', '...........CCc..', '..........CCc...', '.........AAa....', '........CCc.....', '.......CCc......', '......CCc.......',
      '.....CCc........', '....CCc.........', '...AAa..........', '..CCc...........', '.CCc............', 'AAa.............', 'Aa..............', '................'],
    houlette: ['........CCC.....', '.......Cc.CC....', '.......C...Cc...', '...........Cc...', '..........CCc...', '.........CCc....', '........CCc.....', '.......CCc......',
      '......CCc.......', '.....CCc........', '....CCc.........', '...CCc..........', '..CCc...........', '.CCc............', 'CCc.............', 'Cc..............'],
    calame: ['................', '.............C..', '............CCc.', '...........CCc..', '..........CCc...', '.........CCc....', '........CCc.....', '.......CCc......',
      '......CCc.......', '.....CCc........', '....CCc.........', '...Ccc..........', '..aA............', '.aA.............', '.A..............', '................'],
    encrier: ['............C...', '...........CCc..', '..........CCc...', '.........CCc....', '........CCc.....', '.......CCc......', '......CCc.......', '.....Ccc........',
      '....aA....AAAA..', '...aA....AaaaaA.', '...A.....AAAAAa.', '........AAAAAAAa', '........AAAAAAaa', '........AAAAAaaa', '.........AAAaaa.', '..........aaaa..'],
    ecritoire: ['................', '................', '..........P.....', '.........PPc....', '........AAc.....', '.......AA.......', '.CCCCCCAACCCCCC.', 'CCCCCCCCCCCCCCCc',
      'CAAACCCCCCCAAACc', 'CCCCCCCCCCCCCCcc', 'CccccccccccccccK', '.kkkkkkkkkkkkkk.', '................', '................', '................', '................'],
    bouclier: ['.....CCCCCC.....', '...CCCCCCCCcc...', '..CCCCCCCCCCcc..', '.CCCCCCCCCCCCcc.', '.CCCCCCCCCCCCcc.', 'CCCCCCAAACCCCcck', 'CCCCCAAAAaCCCcck', 'CCCCCAAAaaCCCcck',
      'CCCCCAAaaaCCccck', 'CCCCCCaaaCCCccck', 'CCCCCCCCCCCcccck', '.CCCCCCCCCCcccc.', '.cCCCCCCCCccccc.', '..ccCCCCccccck..', '...cccccccckk...', '.....kkkkkk.....'],
    pavois: ['....CCCCCCCC....', '...CCCCCCCCCc...', '...CAAAAAAAAc...', '...CCCCCCCCCck..', '...CCCCCCCCCck..', '...CCCCAACCCck..', '...CCCAAAACCck..', '...CCCAAaaCCck..',
      '...CCCAaaaCCck..', '...CCCCaaCCCck..', '...CCCCCCCCCck..', '...CCCCCCCCCck..', '...CAAAAAAAAck..', '...cCCCCCCCcck..', '....ccccccckk...', '.....kkkkkk.....'],
    gourde: ['.......aa.......', '......aAAa......', '......AWWA......', '.......CC.......', '......CCCc......', '.....CCCCCc.....', '....CCCCCCCc....', '...CCCCCCCCcc...',
      '...CCCCCCCCcc...', '..CCCCCCCCCCcc..', '..CCCCCCCCCccc..', '..CCCCCCCCcccc..', '...CCCCCCccck...', '...cCCCcccckk...', '....ccccckk.....', '......kkk.......'],
    tablette: ['.......WW.......', '......WwwW......', '......W..W......', '..CCCCCCCCCCCC..', '..CPPPPPPPPPPc..', '..CPPPPPPPPPPc..', '..CPPPPPPPPPPc..', '..CPPPPPPPPPPc..',
      '..CPPPPPPPPPPc..', '..CPPPPPPPPPPc..', '..CPPPPPPPPPPc..', '..CPPPPPPPPPPc..', '..CPPPPPPPPPPc..', '..CPPPPPPPPPPc..', '..Cccccccccccc..', '...kkkkkkkkkk...'],
    lampe: ['........A.......', '.......AA.......', '.......AAa......', '......AaAa......', '.......aa.......', '.......kk.......', '..CC..CCCC......', '.CccCCCCCCCC....',
      '.C..CCCCCCCCCCC.', '.Cc.CCCCCCCCCCcc', '..CCCCCCCCCCccc.', '....CCCCCCcccc..', '.....cccccck....', '......CCCc......', '.....CCCCcc.....', '.....kkkkkk.....'],
    turban: ['................', '................', '.....CCCCCC.....', '...CCCCcCCCCc...', '..CCCccCCCcCCc..', '.CCccCCCCccCCcc.', '.CcCCCCccCCCccc.', '.CCCCccCCCCcCcc.',
      '.CCccCCCCccCccc.', '.cCCCCccCCCcccc.', '..AAAAAAAAAAaa..', '..aAAAAAAAAaaa..', '...kkkkkkkkkk...', '................', '................', '................'],
    cheche: ['................', '.....CCCCCC.....', '...CCCCcCCCCc...', '..CCCccCCCcCCc..', '.CCccCCCCccCCcc.', '.CcCCCCccCCCccc.', '.CCCCccCCCCcCcc.', '.cCccCCCCccCccc.',
      '..AAAAAAAAAAaa..', '..CccccccccCCc..', '..CCcCCCCCcCCc..', '...CccCCccCCc...', '....CCccccCCc...', '.....CCCCCCc.c..', '......cccc..Cc..', '............ck..'],
    calotte: ['................', '................', '................', '................', '.....CCCCCC.....', '...CCCCCCCCcc...', '..CCCCCCCCCCcc..', '..CCCCCCCCCccc..',
      '..CCCCCCCCcccc..', '..AaAaAaAaAaAa..', '..aAaAaAaAaAaa..', '...kkkkkkkkkk...', '................', '................', '................', '................'],
    casque: ['.......CC.......', '.......CC.......', '......CCCc......', '....CCCCCCcc....', '...CCCCCCCCcc...', '..CCCCCCCCCccc..', '..CCCCCCCCCccc..', '..CCCCCCCCcccc..',
      '..CCCCCCCccccc..', '..AAAAAAAAAAaa..', '..Ck........ck..', '..Ck........ck..', '..ck........ck..', '...k........k...', '................', '................'],
    casque_turban: ['.......II.......', '.......II.......', '......IIIi......', '....IIIIIIii....', '...IIIIIIIIii...', '..IIIIIIIIIiii..', '.AAAaAAAAaAAAaa.', '.AaAAAAaAAAAaAa.',
      '.AAAaAAAAaAAaaa.', '..aaaaaaaaaaaa..', '..Ii........ii..', '..Ii........ii..', '..ii........ii..', '...i........i...', '................', '................'],
    casque_bandes: ['................', '......CCCc......', '.....CCCCcc.....', '....CaCCCCac....', '...CCaCCCCacc...', '..CCCaCCCCaccc..', '..CCCaCCCCaccc..', '..CCCaCCCcaccc..',
      '..AAAAAAAAAAaa..', '..aAaAaAaAaAaa..', '..Ck........ck..', '..Ck........ck..', '..ck........ck..', '...k........k...', '................', '................'],
    coiffe_mailles: ['................', '......CcCc......', '....CcCcCcCc....', '...CcCcCcCcCc...', '..CcCcCcCcCcCc..', '..cCcCcCcCcCcC..', '..CcC......cCc..', '..cCc......CcC..',
      '..CcC......cCc..', '..cCc......CcC..', '..CcCc....CcCc..', '.CcCcCc..CcCcCc.', '.cCcCcCccCcCcCc.', '..cCcCcCcCcCcC..', '...kkkkkkkkkk...', '................'],
    tunique: ['.....CCC.CCC....', '..CCCCCCcCCCCCC.', '.CCCCCCCCCCCCCCc', '.CCCcCCCCCCCcCCc', '.CCc.CCCCCCC.cCc', '.cc..CCCCCCC..cc', '.....CCCCCCCc...', '.....AAAAAAAa...',
      '.....CCCCCCCc...', '....CCCCCCCCc...', '....CCCCCCCCcc..', '....CCCCCCCCcc..', '...CCCCCCCCCCc..', '...CCCCCCCCCcc..', '...cccccccccck..', '....kkkkkkkkk...'],
    manteau: ['......CCCC......', '....CCCCCCCC....', '...CCCCkkCCCC...', '..CCCCCk.CCCCc..', '..CCCCCk.cCCCc..', '.CCCCCCk.cCCCCc.', '.CCCCCCk.cCCCCc.', '.CCCCCCk.cCCCCc.',
      '.CCCCCck.ccCCCc.', 'CCCCCCck.ccCCCCc', 'CCCCCCck.ccCCCCc', 'CCCCCcck.cccCCCc', 'CCCCCcck.cccCCcc', 'AAAAAAak.aAAAAAa', '.aaaaaak.aaaaaa.', '................'],
    burnous: ['.......CC.......', '......CCCc......', '.....CCCCCc.....', '....CCCkkCCc....', '...CCCCk.CCCc...', '..CCCCCk.cCCCc..', '..CCCCCk.cCCCc..', '.CCCCCCk.cCCCCc.',
      '.CCCCCCk.cCCCCc.', '.CCCCCck.ccCCCc.', 'CCCCCCck.ccCCCCc', 'CCCCCCck.ccCCCCc', 'CCCCCcck.cccCCCc', 'CCCCCcck.cccCCcc', 'AAAAAAak.aAAAAAa', '.aaaaaak.aaaaaa.'],
    cuir: ['................', '...CCC....CCC...', '..CCCCc..CCCCc..', '..CCCCCccCCCCc..', '..CCCCCCCCCCCc..', '...CCCCaACCCc...', '...CCCCAaCCCc...', '...CCCCaACCCc...',
      '...CCCCAaCCCc...', '...CCCCaACCCc...', '...CCCCAaCCCc...', '...CCCCCCCCCc...', '...AAAAAAAAAa...', '...cCCCCCCCcc...', '....ccccccck....', '................']
  };
  Object.keys(ICO).forEach(k => { if (ICO[k].length !== 16 || ICO[k].some(r => r.length !== 16)) throw new Error('icône mal formée : ' + k); });
  // motifs posés sur une silhouette : mailles en damier, lamelles en rangs, piqûre, rayures
  const motif = (base, fn) => ICO[base].map((row, y) => row.split('').map((m, x) => fn(m, x, y)).join(''));
  ICO.mailles = motif('tunique', (m, x, y) => m === 'C' ? ((x + y) % 2 ? 'C' : 'c') : m === 'A' || m === 'a' ? 'k' : m);
  ICO.lamelles = motif('cuir', (m, x, y) => 'Cc'.indexOf(m) >= 0 ? (y % 2 ? (x % 2 ? 'C' : 'c') : 'k') : m === 'a' ? 'A' : m);
  ICO.matelassee = motif('tunique', (m, x, y) => m === 'C' && (x + y) % 3 === 0 ? 'c' : m);
  ICO.manteau_raye = motif('manteau', (m, x) => m === 'C' && x % 3 === 1 ? 'A' : m);
  ICO.massue = ICO.masse; ICO.etoffe = ICO.tunique; ICO.ecu = ICO.bouclier; ICO.outil = ICO.gourde;

  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return '#' + [0, 1, 2].map(i => Math.round(x[i] + (y[i] - x[i]) * t).toString(16).padStart(2, '0')).join(''); };
  const icache = {};
  Gr.icon = function (id) { // image de 18 × 18 : le dessin et son liseré
    if (icache[id]) return icache[id];
    const g = D.GEAR[id], T = ICO[g.ico] || ICO[g.t] || ICO.tunique, c0 = (g.c && g.c[0]) || '#c3c8d2', c1 = (g.c && g.c[1]) || '#8a6238';
    const pal = { C: mix(c0, '#fff6dc', 0.28), c: mix(c0, '#2a1c3a', 0.2), k: mix(c0, '#20143a', 0.52), A: mix(c1, '#fff6dc', 0.18), a: mix(c1, '#20143a', 0.42), I: '#c3c8d2', i: '#7f8794', W: '#8a6238', w: '#5a3d22', P: '#f3e9cf', N: '#2a2233', K: mix(c0, '#20143a', 0.52) };
    const cv = G.mk(18, 18), c = cv.getContext('2d');
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const col = pal[T[y][x]]; if (col) { c.fillStyle = col; c.fillRect(x + 1, y + 1, 1, 1); } }
    const im = c.getImageData(0, 0, 18, 18), d = im.data, solid = (x, y) => x >= 0 && y >= 0 && x < 18 && y < 18 && d[(y * 18 + x) * 4 + 3] > 200, add = [];
    for (let y = 0; y < 18; y++) for (let x = 0; x < 18; x++) if (!solid(x, y) && (solid(x + 1, y) || solid(x - 1, y) || solid(x, y + 1) || solid(x, y - 1))) add.push(x, y);
    for (let i = 0; i < add.length; i += 2) { const o = (add[i + 1] * 18 + add[i]) * 4; d[o] = 21; d[o + 1] = 15; d[o + 2] = 29; d[o + 3] = 255; }
    c.putImageData(im, 0, 0);
    return (icache[id] = cv);
  };
  const ucache = {};
  Gr.iconURL = id => ucache[id] || (ucache[id] = Gr.icon(id).toDataURL());
  Gr.img = (id, cls) => `<img class="gi${cls ? ' ' + cls : ''}" alt="" src="${Gr.iconURL(id)}">`;

  /* ================= recevoir, proposer ================= */
  Gr.learn = function () { const d = Gr.state(); if (d.vuGear) return; d.vuGear = 1; if (I.oeuvres && I.oeuvres.learn) I.oeuvres.learn('equipement'); };
  // une pièce arrive dans la réserve ; si elle améliore quelqu'un du groupe, on propose aussitôt de la porter
  Gr.receive = async function (id, n) {
    const g = D.GEAR[id], W = I.world; n = n || 1; Gr.add(id, n); I.audio.sfx('ok');
    S.toast(`${I.t('Reçu : {img} <b>{piece}</b>', { img: Gr.img(id), piece: I.esc(g.name) })}${n > 1 ? ' ×' + n : ''}<br><small>${Gr.effets(g)}</small>`, 3600);
    Gr.learn();
    if (!W.saga || !W.party.length) return;
    if (I.debug.auto) { Gr.bestAll(); return; }
    await Gr.offer(id);
  };
  Gr.offer = async function (id) {
    const W = I.world, slot = Gr.slotOf(id), g = D.GEAR[id], gain = h => Gr.score(h.def, id) - (Gr.of(h)[slot] ? Gr.score(h.def, Gr.of(h)[slot]) : 0);
    const who = W.party.map(x => W.hero(x)).filter(h => Gr.can(h.def, id) && gain(h) > 0.01).sort((a, b) => gain(b) - gain(a));
    if (!who.length) return;
    const opts = who.map(h => ({ html: `<b>${I.esc(h.def.name)}</b> · ${Gr.delta(h, slot, id)}` })).concat([{ t: I.t('Personne pour l’instant : à la réserve'), retour: true }]);
    const i = await S.menuPick({ cls: 'gear', html: `${Gr.img(id)} <span><b>${I.esc(g.name)}</b> · ${D.SLOTS[slot].toLowerCase()}<br><small>${Gr.effets(g)}</small></span><em>${I.t('Qui la porte ?')}</em>` }, opts);
    if (i < who.length && Gr.put(who[i], slot, id)) { I.audio.sfx('light'); S.toast(I.t('<b>{nom}</b> porte désormais : {piece}.', { nom: I.esc(who[i].def.name), piece: I.esc(g.name) }), 2400); }
  };

  /* ================= pages de la halte ================= */
  const roles = g => (g.roles || D.GEAR_TYPES[g.t].roles);
  const ROLE = { guerrier: I.T('guerriers'), gardien: I.T('gardiens'), sage: I.T('sages'), soigneur: I.T('soigneurs'), stratege: I.T('stratèges') };
  const NOTE = () => '<p class="src">' + I.t('Convention de jeu : des objets ordinaires de l’époque, sans relique ni inscription. Le jeu ne dit pas qui portait quoi. Le fer aide à tenir ; il ne remplace pas la provision du cœur.') + '</p>';
  Gr.ligne = (h, s) => { const id = Gr.of(h)[s], g = D.GEAR[id]; return `<div class="gslot"><small>${D.SLOTS[s]}</small>${g ? Gr.img(id) + `<span><b>${I.esc(g.name)}</b><br><small>${Gr.effets(g)}</small></span>` : '<i class="gi vide"></i><span class="rien">' + I.t('rien') + '</span>'}</div>`; };
  Gr.fiche = function (h) {
    const st = I.calc.of(h), e = D.ELEMENTS[h.def.el];
    return `<div class="stat gear"><img class="fig" alt="" src="${G.charURL(Gr.look(h))}"><div><b style="color:${e.color}">${I.esc(h.def.name)}</b> <small>· ${I.t('niveau {n}', { n: h.lvl })}</small><br><small>${I.t('Constance {hp} · Souffle {sp} · Force {atk} · Esprit {mag} · Garde {def} · Élan {spd}', { hp: st.hp, sp: st.sp, atk: Math.round(st.atk), mag: Math.round(st.mag), def: Math.round(st.def), spd: Math.round(st.spd) })}</small>${SLOTS.map(s => Gr.ligne(h, s)).join('')}</div></div>`;
  };
  Gr.paneGroupe = function () {
    const W = I.world, n = Gr.reserve().reduce((a, id) => a + Gr.stock(id), 0), b = Gr.better();
    return '<h3>' + I.t('Équipement') + '</h3>' + ((W.saga && W.party.length) ? W.party.map(id => Gr.fiche(W.hero(id))).join('') : '<p>' + I.t('Aucun groupe pour l’instant.') + '</p>') +
      `<p>${I.t('Réserve : <b>{n}</b> pièce.¦Réserve : <b>{n}</b> pièces.', { n })}${b ? ' ' + I.t('<em>{piece}</em> irait mieux à {nom}.', { piece: I.esc(D.GEAR[b.id].name), nom: I.esc(b.h.def.name) }) : ''}</p>` +
      `<p class="src">${W.map && W.map.spots.comptoir && (D.GEAR_SHOPS[W.map.id] || []).length && W.saga && (!W.saga.frame || W.saga.veillees) ? I.t('On en trouve dans les coffres, après les victoires, et à la <b>boutique d’équipement</b> : au comptoir de ce lieu (le cercle doré de la Carte).') : W.map && W.map.id === 'quartiers' ? I.t('Dans les quartiers, l’<b>étal de la galerie</b> en vend, payées avec la bourse d’Idris.') : I.t('On en trouve dans les coffres, après les victoires, et à la <b>boutique d’équipement</b> : il n’y en a pas dans ce lieu.')}</p>` + NOTE();   // (2.28 : l'étal des quartiers — activites.js)
  };
  const actuel = (h, slot, id) => { const cur = Gr.of(h)[slot], g = D.GEAR[cur]; return cur === id ? '<p class="src">' + I.t('C’est ce qu’il porte.') + '</p>' : `<p class="src">${g ? I.t('Il porte : {img} {piece} ({effets}).', { img: Gr.img(cur), piece: I.esc(g.name), effets: Gr.effets(g) }) : I.t('Il porte : rien.')}</p>`; };
  Gr.panePiece = function (h, slot, id, extra) {
    const g = D.GEAR[id]; if (!g) return `<h3>${D.SLOTS[slot]}</h3><p>${I.t('Ne rien porter ici.')}</p><div class="gcmp">${Gr.compare(h, slot, null)}</div>`;
    return `<h3>${Gr.img(id, 'big')} ${I.esc(g.name)}</h3><p class="src">${D.GEAR_TYPES[g.t].name} · ${D.SLOTS[slot].toLowerCase()} · ${I.t('pour les {roles}', { roles: roles(g).map(r => I.t(ROLE[r])).join(I.t(', ')) })}${extra ? ' · ' + extra : ''}</p><p>${I.esc(g.desc)}</p><p><b>${Gr.effets(g)}</b></p>` +
      `<p class="src">${I.t('Pour {nom} :', { nom: I.esc(h.def.name) })}</p><div class="gcmp">${Gr.compare(h, slot, id)}</div>` + actuel(h, slot, id);
  };
  Gr.paneReserve = function () {
    const L = Gr.reserve();
    return '<h3>' + I.t('La réserve') + '</h3>' + (L.length ? SLOTS.map(s => { const P = L.filter(id => Gr.slotOf(id) === s); return P.length ? `<p class="src">${D.SLOTS[s]}</p>` + P.map(id => `<div class="gslot">${Gr.img(id)}<span><b>${I.esc(D.GEAR[id].name)}</b>${Gr.stock(id) > 1 ? ' ×' + Gr.stock(id) : ''}<br><small>${Gr.effets(D.GEAR[id])}</small></span></div>`).join('') : ''; }).join('') : '<p>' + I.t('La réserve est vide. Les coffres et les comptoirs la rempliront.') + '</p>') + NOTE();
  };
  Gr.ICO = ICO;
})();
