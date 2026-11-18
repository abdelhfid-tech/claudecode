/* ISNAD 2.0 — le personnage du joueur : le râwî, son nom, sa tenue.
   Les textes du jeu disent « Idris » : c'est le nom d'origine, et ils ne changent pas. Le nom que choisit le joueur le
   remplace à l'affichage, élision comprise (« d’Idris » devient « de Khalil », « qu’Idris » devient « que Khalil »). Pour
   cela, chaque phrase qui nomme le râwî est relevée une fois, dans les sagas posées ; quand le nom change, ces phrases-là
   sont récrites à partir de l'original, toujours. Avec le nom d'origine, rien n'est touché.
   La tenue est l'une de celles de D.TENUES : des silhouettes faites des coiffes, des manteaux et des couleurs que le
   moteur dessine déjà. Le râwî a un visage (2.x), le même sous chaque tenue. Les Compagnons gardent leur nom et leur
   silhouette. */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D;
  const NOM = 'Idris', MAX = 16;
  const P = I.perso = { NOM, MAX };

  /* ---------- le profil : dans la partie (save.data.profil), avec ses valeurs d'origine ---------- */
  P.profil = function () { const p = (I.save && I.save.data && I.save.data.profil) || {};
    return { nom: typeof p.nom === 'string' && p.nom && !P.refus(p.nom) ? p.nom : NOM, tenue: D.TENUES.some(t => t.id === p.tenue) ? p.tenue : D.TENUES[0].id }; };
  P.nom = () => P.profil().nom;
  P.tenue = id => D.TENUES.find(t => t.id === (id || P.profil().tenue)) || D.TENUES[0];

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
      h.look = p.tenue === D.TENUES[0].id ? origine.look : P.look(P.tenue(p.tenue)); }   // la tenue de toujours : l'objet d'origine, intact
    const W = I.world; if (W && W.saga && W.party && W.party.length && W.refreshSheets) { try { W.refreshSheets(); } catch (e) { /* hors chapitre */ } }
    return p;
  };
  // choisir : le nom est contrôlé, la tenue est l'une de celles du jeu. → '' ou la raison du refus
  P.choisir = function (nom, tenue) { if (P.propre(nom) === I.langue.rawi()) nom = NOM;   // le nom que la langue donne au râwî, laissé tel quel : c'est le nom d'origine
    const r = P.refus(nom); if (r) return r; if (!D.TENUES.some(t => t.id === tenue)) return I.t('Cette tenue n’existe pas.');
    I.save.data.profil = { nom: P.propre(nom), tenue }; P.appliquer(); return ''; };
})();
