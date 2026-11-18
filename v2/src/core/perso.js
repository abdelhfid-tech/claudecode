/* ISNAD 2.0 — le personnage du joueur : le râwî, son nom, sa tenue (2.x : et ce que le joueur compose par-dessus).
   Les textes du jeu disent « Idris » : c'est le nom d'origine, et ils ne changent pas. Le nom que choisit le joueur le
   remplace à l'affichage, élision comprise (« d’Idris » devient « de Khalil », « qu’Idris » devient « que Khalil »). Pour
   cela, chaque phrase qui nomme le râwî est relevée une fois, dans les sagas posées ; quand le nom change, ces phrases-là
   sont récrites à partir de l'original, toujours. Avec le nom d'origine, rien n'est touché.
   La tenue est l'une de celles de D.TENUES : des silhouettes faites des coiffes, des manteaux et des couleurs que le
   moteur dessine déjà. Le râwî a un visage (2.x), le même sous chaque tenue. Les Compagnons gardent leur nom et leur
   silhouette.
   2.x — le râwî composé : par-dessus sa tenue (son « ensemble »), le joueur change des pièces — le teint, la barbe et son
   poil, la coiffe, la coupe, la longueur de la robe, l'écharpe, l'étoffe, le néon, un objet porté. La partie en garde les
   identifiants (profil.compo, pris dans D.RAWI), jamais une couleur ; ce qui n'est pas reconnu est oublié, sans refuser
   la partie. Ce qui vaut déjà l'ensemble ou le visage d'origine n'est pas gardé : sans rien choisir, rien ne change, et
   le râwî reste l'objet d'origine. Le format de la partie ne change pas (un champ de plus, facultatif). */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D;
  const NOM = 'Idris', MAX = 16;
  const P = I.perso = { NOM, MAX };

  /* ---------- le profil : dans la partie (save.data.profil), avec ses valeurs d'origine ---------- */
  P.profil = function () { const p = (I.save && I.save.data && I.save.data.profil) || {}, tenue = D.TENUES.some(t => t.id === p.tenue) ? p.tenue : D.TENUES[0].id;
    return { nom: typeof p.nom === 'string' && p.nom && !P.refus(p.nom) ? p.nom : NOM, tenue, compo: P.neutraliser(P.tenue(tenue), p.compo) }; };
  P.nom = () => P.profil().nom;
  P.tenue = id => D.TENUES.find(t => t.id === (id || P.profil().tenue)) || D.TENUES[0];

  /* ---------- le râwî composé (2.x) : les pièces, contrôlées ---------- */
  const R = D.RAWI, own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k), liste = (a, v) => a.indexOf(v) >= 0;
  const VISAGE = ['teint', 'barbe', 'poil'], HABIT = ['coiffe', 'manteau', 'longue', 'echarpe', 'etoffe', 'neon'], CLES = VISAGE.concat(HABIT, ['objet']);
  const VALIDE = { teint: v => typeof v === 'string' && own(R.teints, v), barbe: v => liste(R.barbes, v), poil: v => typeof v === 'string' && own(R.poils, v),
    coiffe: v => liste(R.coiffes, v), manteau: v => liste(R.manteaux, v), longue: v => typeof v === 'boolean', echarpe: v => typeof v === 'boolean',
    etoffe: v => typeof v === 'string' && own(R.etoffes, v), neon: v => typeof v === 'string' && own(R.neons, v), objet: v => liste(R.objets, v) };
  P.VISAGE = VISAGE; P.HABIT = HABIT; P.CLES = CLES;
  // → une composition propre : les seules clés connues, lues en propriété propre, avec les seules valeurs de D.RAWI
  P.compo = function (brut) { const c = {}; if (!brut || typeof brut !== 'object' || Array.isArray(brut)) return c;
    CLES.forEach(k => { if (own(brut, k) && VALIDE[k](brut[k])) c[k] = brut[k]; }); return c; };
  // le visage d'origine du râwî, tel que le moteur le tire de sa tenue de toujours : ses identifiants dans D.RAWI
  let visage0 = null;
  const idDe = (table, couleur) => Object.keys(table).find(k => table[k] === couleur) || null;
  const visageOrigine = () => { if (visage0) return visage0; const G = I.gfx, v = G && G.traits ? G.traits(D.TENUES[0].look) : null;
    const r = { teint: v ? idDe(R.teints, v.teint) : 't3', barbe: v ? v.barbe : 1, poil: v ? idDe(R.poils, v.poil) : 'p2' }; if (v) visage0 = r; return r; };
  // l'étoffe d'un ensemble : celle de D.RAWI qui porte ses couleurs
  const etoffeDe = t => Object.keys(R.etoffes).find(k => { const e = R.etoffes[k], L = t.look; return e.robe === L.robe && e.head === L.head && e.cloak === L.cloak && (e.legs || null) === (L.legs || null); }) || null;
  // ce que donnent déjà l'ensemble et le visage d'origine, pièce par pièce
  P.base = function (t) { const L = t.look, v = visageOrigine();
    return { teint: v.teint, barbe: v.barbe, poil: v.poil, coiffe: L.coiffe || 'capuche', manteau: L.manteau || 'long', longue: L.court === false, echarpe: !!L.echarpe, etoffe: etoffeDe(t), neon: null, objet: null }; };
  // ce qu'une coiffe ne prend pas (D.RAWI.sans) : la coupe qu'elle a chez un Compagnon des récits ou chez Sâlim, qui marche
  // avec le râwî — la calotte sans manteau, le turban haut avec le manteau long —, l'étoffe claire qui ferait du turban celui
  // d'un Compagnon. → vrai si la pièce k (manteau, etoffe) peut valoir v sous cette coiffe
  const exclus = (coiffe, k) => ((R.sans || {})[coiffe] || {})[k] || [];
  P.va = (coiffe, k, v) => exclus(coiffe, k).indexOf(v) < 0;
  // quand une pièce cède : la coupe qui garde un manteau, puis la première étoffe qui va
  const REPLI = { manteau: () => ['long', 'epaule', 'ample', 'aucun'].filter(m => liste(R.manteaux, m)), etoffe: () => Object.keys(R.etoffes) };
  // ce qui diffère de l'ensemble seulement ; ce qui ne va pas avec la coiffe cède (la coupe, l'étoffe) : la coiffe, elle, reste
  P.neutraliser = function (t, brut) { const B = P.base(t), c = P.compo(brut);
    Object.keys(c).forEach(k => { if (c[k] === B[k]) delete c[k]; });
    const vaut = k => (c[k] !== undefined ? c[k] : B[k]), co = vaut('coiffe');
    ['manteau', 'etoffe'].forEach(k => { if (P.va(co, k, vaut(k))) return; delete c[k];
      if (!P.va(co, k, vaut(k))) { const v = REPLI[k]().find(x => P.va(co, k, x)); if (v !== undefined && v !== B[k]) c[k] = v; } });
    return c; };
  // une case de l'écran « Ton personnage » : une coiffe se prend toujours (ce qui ne va pas avec elle cède) ; une coupe ou une
  // étoffe qui n'irait pas avec la coiffe portée s'éteint
  P.permis = (k, v, t, brut) => { if (k !== 'manteau' && k !== 'etoffe') return true; const c = P.compo(brut), B = P.base(t);
    return P.va(c.coiffe !== undefined ? c.coiffe : B.coiffe, k, v); };
  // un liseré jaune ou doré (une teinte entre l'orangé et le jaune, franche) : celui du veilleur (#ffe08a) en est un
  const dore = h => { const n = parseInt(String(h).slice(1, 7), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
    if (!(d >= 40)) return false; let a = (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; if (a < 0) a += 360; return a >= 30 && a <= 70; };
  P.dore = dore;
  // l'apparence d'un ensemble et de ses pièces : le visage reste celui d'origine (sa marque, figée), le liseré n'est jamais
  // le beige doré que le moteur pose à défaut, ni le jaune pâle d'un ensemble (le veilleur, D146) qu'une pièce composée
  // mettrait au jour — le bandeau d'une coiffe qui en a un (gfx.galon : la calotte ; sous le turban et le chèche, le bandeau
  // du râwî est fait de ses deux néons, sprites.js), l'écharpe, le bas de la robe longue (exigence 17 : ni or) : c'est le
  // néon, ou le cyan de l'habit
  P.composer = function (t, brut) {
    const c = P.neutraliser(t, brut); if (!Object.keys(c).length) return P.look(t);
    const L = Object.assign({}, t.look); L.visage = I.gfx.signe(D.TENUES[0].look);
    if (c.coiffe) L.coiffe = c.coiffe; if (c.manteau) L.manteau = c.manteau; if (c.longue !== undefined) L.court = !c.longue; if (c.echarpe !== undefined) L.echarpe = c.echarpe;
    if (c.etoffe) { const e = R.etoffes[c.etoffe]; L.robe = e.robe; L.head = e.head; L.cloak = e.cloak; if (e.legs) L.legs = e.legs; else delete L.legs; }
    if (c.neon) { L.neon = R.neons[c.neon].slice(); L.trim = L.neon[0]; }
    else if ((!L.trim || dore(L.trim)) && ((L.coiffe && I.gfx.galon(L.coiffe)) || L.echarpe || L.court === false)) L.trim = '#39e6ff';
    if (c.objet) L.porte = [c.objet];
    if (c.teint) L.teint = R.teints[c.teint]; if (c.barbe !== undefined) L.barbe = c.barbe; if (c.poil) L.poil = R.poils[c.poil];
    return L;
  };
  // une tenue au hasard : la coiffe, la coupe, la robe, l'écharpe, l'étoffe, le néon, l'objet — jamais le visage
  P.hasard = function (t, brut, rnd) { const x = rnd || Math.random, un = a => a[Math.floor(x() * a.length) % a.length], c0 = P.compo(brut), avant = JSON.stringify(P.neutraliser(t, c0));
    for (let essai = 0; essai < 12; essai++) { const c = {}; VISAGE.forEach(k => { if (c0[k] !== undefined) c[k] = c0[k]; });
      c.coiffe = un(R.coiffes); c.manteau = un(R.manteaux.filter(m => P.va(c.coiffe, 'manteau', m)));
      c.longue = x() < 0.3; c.echarpe = x() < 0.3; c.etoffe = un(Object.keys(R.etoffes).filter(e => P.va(c.coiffe, 'etoffe', e)));
      const n = un([null].concat(Object.keys(R.neons))), o = un([null].concat(R.objets)); if (n) c.neon = n; if (o) c.objet = o;
      const r = P.neutraliser(t, c); if (JSON.stringify(r) !== avant) return r; }
    return P.neutraliser(t, c0); };

  /* ---------- les noms que l'on ne prend pas ---------- */
  // sans accents, sans majuscules, apostrophes et traits d'union ramenés à une espace : « 'Abd ar-Rahmân » → « abd ar rahman »
  const plat = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’'`ʿʾ‘\-\s]+/g, ' ').trim();
  P.propre = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  const LETTRES = /^[\p{L}\p{M}’'ʿʾ\- ]+$/u, DEBUT = /^[\p{L}’'ʿʾ]/u;
  // le Nom divin employé seul (porté avec « 'Abd », c'est un prénom que l'on donne : il passe)
  const DIVIN = ['allah', 'dieu', 'le seigneur', 'seigneur', 'rabb', 'ar rabb', 'ilah', 'al ilah', 'god', 'ar rahman', 'al rahman', 'ar rahim', 'al quddus', 'as samad', 'al khaliq', 'ar razzaq', 'al ahad', 'al qayyum', 'al malik al mulk'];
  // exigences 6 et 18 : la même garde que pour les combattants et les personnages
  const INTERDIT = /(^|[^a-zà-ÿ])(ibl[iî]s|satan|sh?a[iy]t[aâ]ne?s?|chayt[aâ]ne?s?|diables?|d[ée]mons?|d?jinns?)(?![a-zà-ÿ])/i;
  // (Proposé par l'agent, à confirmer par le décideur.) Dans ce jeu, ce nom ne désigne que le Prophète ﷺ, qui n'est jamais mis en scène.
  const RESERVE = ['muhammad', 'mohammad', 'mohammed', 'mohamed', 'muhammed', 'mouhammad', 'mouhamed', 'mahomet', 'mohamad', 'muhamad'];
  // les noms des héros et des maillons du jeu : un râwî qui s'appellerait comme eux brouillerait les dialogues
  // (l'histoire-cadre porte le nom du râwî lui-même, et son héros « idris » aussi : ceux-là ne comptent pas)
  P.prisParLeJeu = function () { const L = {}; Object.keys(I.sagas).forEach(sid => { const s = I.sagas[sid], cadre = !!s.frame && !s.veillees;
      if (!s.commun && !cadre) L[plat(s.name)] = 1; Object.keys(s.heroes || {}).forEach(h => { if (!(cadre && h === 'idris')) L[plat(s.heroes[h].name)] = 1; }); }); delete L['']; return L; };
  // → '' si le nom convient, sinon la raison, dite au joueur
  P.refus = function (brut) {
    const nom = P.propre(brut), p = plat(nom);
    if (!nom) return I.t('Il lui faut un nom.');
    if (nom.length > MAX) return I.t('Seize signes au plus.');
    if (!LETTRES.test(nom) || !DEBUT.test(nom) || !p) return I.t('Des lettres seulement, avec au besoin une espace, une apostrophe ou un trait d’union.');
    if (nom === NOM) return '';
    if (DIVIN.includes(p)) return I.t("Ce Nom n’appartient qu’à Allah. Porté avec « 'Abd », il devient un prénom.");
    if (INTERDIT.test(nom) || INTERDIT.test(p)) return I.t('Ce nom ne se porte pas ici.');
    if (RESERVE.includes(p)) return I.t('Dans ce jeu, ce nom ne désigne que le Prophète ﷺ : le râwî en porte un autre.');
    if (P.prisParLeJeu()[p]) return I.t('Un personnage du jeu porte déjà ce nom : les dialogues s’y perdraient.');
    return '';
  };

  /* ---------- le nom dans les textes ---------- */
  const BORD = '(^|[^A-Za-zÀ-ÖØ-öø-ÿ])', SUITE = '(?![A-Za-zÀ-ÖØ-öø-ÿ])';
  const ELIDE = new RegExp(BORD + '([Dd]|[A-Za-zÀ-ÖØ-öø-ÿ]*[Qq]u)[’\']' + NOM + SUITE, 'g'), SEUL = new RegExp(BORD + NOM + SUITE, 'g'), CITE = new RegExp(BORD + NOM + SUITE);
  const voyelle = nom => /^[aeiouy]/.test(plat(nom)) && !/^y[aeiou]/.test(plat(nom)) && !/^[’'ʿʾ]/.test(nom);   // « d’Elyas », mais « de Hamza », « de Yûnus », « de ’Imrân »
  // la phrase d'origine, dite avec un autre nom
  // (dans une autre langue que le français, pas d'élision : le nom que la langue donne au râwî laisse sa place à celui du joueur)
  P.dire = function (t, nom) { nom = nom || P.nom(); if (nom === NOM || typeof t !== 'string') return t;
    if (I.langue.lang !== 'fr') { const d = I.langue.rawi(); return t.indexOf(d) < 0 ? t : t.split(d).join(nom); }
    if (t.indexOf(NOM) < 0) return t;
    const e = voyelle(nom); return t.replace(ELIDE, (m, a, b) => a + (e ? b + '’' : b + 'e ') + nom).replace(SEUL, (m, a) => a + nom); };
  // le nom du râwî tel qu'on l'affiche : celui du joueur, ou celui que la langue lui donne (« Idris », « إدريس », « イドリース »)
  P.dit = () => { const n = P.nom(); return n === NOM ? I.langue.rawi() : n; };
  // relève, dans un contenu posé, chaque phrase qui nomme le râwî (une seule fois par saga)
  const cases = [], vues = new Set();
  P.relever = function (racine) { if (!racine || vues.has(racine)) return; (function va(v) { if (!v || typeof v !== 'object' || vues.has(v)) return; vues.add(v);
    Object.keys(v).forEach(k => { const x = v[k]; if (typeof x === 'string') { if (x.indexOf(NOM) >= 0 && CITE.test(x)) cases.push({ o: v, k, t: x }); } else va(x); }); })(racine); };
  P.phrases = () => cases.map(c => c.t);

  // l'apparence d'une tenue : le râwî change de tenue, pas de visage — chacune garde la marque de sa tenue de toujours
  P.look = t => { const L = Object.assign({}, t.look); if (t.id !== D.TENUES[0].id && I.gfx && I.gfx.signe) L.visage = I.gfx.signe(D.TENUES[0].look); return L; };
  /* ---------- appliquer le profil : le nom dans les phrases relevées, le sceau et la tenue du râwî ---------- */
  let origine = null;   // le sceau et la silhouette d'origine du râwî, gardés ici : sa fiche ne reçoit aucun champ de plus
  P.appliquer = function () {
    const p = P.profil();
    cases.forEach(c => { c.o[c.k] = P.dire(I.langue.de(c.t), p.nom); });   // la phrase dans la langue du joueur, puis son nom
    const fr = I.sagas.idris, h = fr && fr.heroes && fr.heroes.idris;
    if (h) { if (!origine) origine = { arabic: h.arabic, look: h.look };
      h.arabic = p.nom === NOM ? origine.arabic : '';   // le sceau porte le nom en arabe ; avec un autre nom, il montre l'étoile à huit branches, seule
      h.look = p.tenue === D.TENUES[0].id && !Object.keys(p.compo).length ? origine.look : P.composer(P.tenue(p.tenue), p.compo); }   // la tenue de toujours, sans pièce changée : l'objet d'origine, intact
    const W = I.world; if (W && W.saga && W.party && W.party.length && W.refreshSheets) { try { W.refreshSheets(); } catch (e) { /* hors chapitre */ } }
    return p;
  };
  // choisir : le nom est contrôlé, la tenue est l'une de celles du jeu, la composition est contrôlée et ne garde que ce
  // qui change (sans composition donnée : celle du profil). → '' ou la raison du refus
  P.choisir = function (nom, tenue, compo) { if (P.propre(nom) === I.langue.rawi()) nom = NOM;   // le nom que la langue donne au râwî, laissé tel quel : c'est le nom d'origine
    const r = P.refus(nom); if (r) return r; if (!D.TENUES.some(t => t.id === tenue)) return I.t('Cette tenue n’existe pas.');
    const c = P.neutraliser(P.tenue(tenue), compo === undefined ? P.profil().compo : compo);
    I.save.data.profil = Object.keys(c).length ? { nom: P.propre(nom), tenue, compo: c } : { nom: P.propre(nom), tenue }; P.appliquer(); return ''; };
})();
