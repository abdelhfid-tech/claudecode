/* ISNAD 2.0 — le personnage du joueur : le râwî et son nom.
   Les textes du jeu disent « Idris » : c'est le nom d'origine, et ils ne changent pas. Le nom que choisit le joueur le
   remplace à l'affichage, élision comprise (« d’Idris » devient « de Khalil », « qu’Idris » devient « que Khalil »). Pour
   cela, chaque phrase qui nomme le râwî est relevée une fois, dans les sagas posées ; quand le nom change, ces phrases-là
   sont récrites à partir de l'original, toujours. Avec le nom d'origine, rien n'est touché.
   2.37 (D231 ; le décideur, 25 novembre : « supprimer les options pour le garçon (couleurs, barbe, moustache, etc.) ; garde
   le modèle par défaut ») : le râwî n'a plus qu'une apparence, celle de D.TENUES[0] — le passeur, tel que le décideur l'a
   validé. On ne choisit plus ni ensemble, ni teint, ni barbe, ni coiffe, ni étoffe, ni néon, ni objet. Une partie d'avant
   qui en portait (profil.tenue, profil.compo) se charge sans refus : ces champs sont ignorés, le nom est gardé, et le râwî
   paraît sous son apparence de toujours. Le format de la partie ne change pas. Les Compagnons gardent leur nom et leur
   silhouette. */
(function () {
  'use strict';
  const I = window.ISNAD, D = I.D;
  const NOM = 'Idris', MAX = 16;
  const P = I.perso = { NOM, MAX };

  /* ---------- la marque du râwî (2.x, pilote du nouveau dessin) ----------
     Le râwî est dessiné en « passeur » (2.18, D204 : sprites.js, K.passeur — sa tête, sa tenue, sa carrure). Ce n'est pas un récit
     qui le demande : le moteur pose la marque (look.rawi) sur ce qui habille le râwî — sa tenue (D.TENUES) et le
     héros de l'histoire-cadre, dès qu'elle est posée — et ce qui en est tiré (P.look) la garde. Un récit
     ou un paquet ne l'écrit jamais (regles.js). */
  const marquer = L => { if (L && typeof L === 'object' && L.kind === 'cyber') L.rawi = true; return L; };
  D.TENUES.forEach(t => marquer(t.look));
  P.marquer = marquer;

  /* ---------- le profil : dans la partie (save.data.profil), avec ses valeurs d'origine ---------- */
  P.profil = function () { const p = (I.save && I.save.data && I.save.data.profil) || {};
    return { nom: typeof p.nom === 'string' && p.nom && !P.refus(p.nom) ? p.nom : NOM, tenue: D.TENUES[0].id }; };
  P.nom = () => P.profil().nom;
  P.tenue = () => D.TENUES[0];

  /* ---------- les noms que l'on ne prend pas ---------- */
  // sans accents, sans majuscules, apostrophes et traits d'union ramenés à une espace : « 'Abd ar-Rahmân » → « abd ar rahman »
  const plat = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’'`ʿʾ‘\-\s]+/g, ' ').trim();
  P.propre = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  // (2.44, D235) les mêmes gardes en écriture arabe : sans voyelles ni tatwîl, les ligatures défaites (« ﷲ »), les formes de
  // l'alif, du yâ' et du tâ' ramenées à une seule — « اللّٰه », « أبو بكر », « مُحَمَّد » se lisent comme « الله », « ابو بكر », « محمد »
  const platAr = s => String(s).normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[’'`ʿʾ‘\-\s]+/g, ' ').trim();
  const LETTRES = /^[\p{L}\p{M}’'ʿʾ\- ]+$/u, DEBUT = /^[\p{L}’'ʿʾ]/u;
  // le Nom divin employé seul (porté avec « 'Abd », c'est un prénom que l'on donne : il passe)
  const DIVIN = ['allah', 'dieu', 'le seigneur', 'seigneur', 'rabb', 'ar rabb', 'ilah', 'al ilah', 'god', 'ar rahman', 'al rahman', 'ar rahim', 'al quddus', 'as samad', 'al khaliq', 'ar razzaq', 'al ahad', 'al qayyum', 'al malik al mulk'];
  const DIVIN_AR = ['الله', 'اله', 'الاله', 'رب', 'الرب', 'الرحمن', 'الرحيم', 'القدوس', 'الصمد', 'الخالق', 'الرزاق', 'الاحد', 'القيوم', 'مالك الملك'];   // porté avec « عبد », il passe
  // exigences 6 et 18 : la même garde que pour les combattants et les personnages
  const INTERDIT = /(^|[^a-zà-ÿ])(ibl[iî]s|satan|sh?a[iy]t[aâ]ne?s?|chayt[aâ]ne?s?|diables?|d[ée]mons?|d?jinns?)(?![a-zà-ÿ])/i;
  const INTERDIT_AR = /(^| )(ال)?(ابليس|شيطان|شياطين|جن|جني|جنيه)( |$)/;   // sur le nom mis à plat (« جان », un prénom, passe)
  // (Proposé par l'agent, à confirmer par le décideur.) Dans ce jeu, ce nom ne désigne que le Prophète ﷺ, qui n'est jamais mis en scène.
  const RESERVE = ['muhammad', 'mohammad', 'mohammed', 'mohamed', 'muhammed', 'mouhammad', 'mouhamed', 'mahomet', 'mohamad', 'muhamad'];
  const RESERVE_AR = ['محمد'];
  // les noms des héros et des maillons du jeu : un râwî qui s'appellerait comme eux brouillerait les dialogues
  // (l'histoire-cadre porte le nom du râwî lui-même, et son héros « idris » aussi : ceux-là ne comptent pas)
  // (2.44, D235 : le nom tel que chaque langue l'écrit — en lettres latines comme en arabe —, quelle que soit la langue du jeu)
  P.prisParLeJeu = function () { const L = {}, G = I.langue;
    const noter = nom => { if (typeof nom !== 'string' || !nom) return; const fr = G && G.fr ? G.fr(nom) : nom;
      [nom, fr].concat(G && G.dans ? ['ar', 'en'].map(l => G.dans(l, fr)) : []).forEach(x => { if (typeof x === 'string' && x) { L[plat(x)] = 1; L[platAr(x)] = 1; } }); };
    Object.keys(I.sagas).forEach(sid => { const s = I.sagas[sid], cadre = !!s.frame && !s.veillees;
      if (!s.commun && !cadre) noter(s.name); Object.keys(s.heroes || {}).forEach(h => { if (!(cadre && h === 'idris')) noter(s.heroes[h].name); }); }); delete L['']; return L; };
  // → '' si le nom convient, sinon la raison, dite au joueur
  P.refus = function (brut) {
    const nom = P.propre(brut), p = plat(nom), a = platAr(nom);
    if (!nom) return I.t('Il lui faut un nom.');
    if (nom.length > MAX) return I.t('Seize signes au plus.');
    if (!LETTRES.test(nom) || !DEBUT.test(nom) || !p) return I.t('Des lettres seulement, avec au besoin une espace, une apostrophe ou un trait d’union.');
    if (nom === NOM) return '';
    if (DIVIN.includes(p) || DIVIN_AR.includes(a)) return I.t("Ce Nom n’appartient qu’à Allah. Porté avec « 'Abd », il devient un prénom.");
    if (INTERDIT.test(nom) || INTERDIT.test(p) || INTERDIT_AR.test(a)) return I.t('Ce nom ne se porte pas ici.');
    if (RESERVE.includes(p) || RESERVE_AR.includes(a)) return I.t('Dans ce jeu, ce nom ne désigne que le Prophète ﷺ : le râwî en porte un autre.');
    const pris = P.prisParLeJeu(); if (pris[p] || pris[a]) return I.t('Un personnage du jeu porte déjà ce nom : les dialogues s’y perdraient.');
    return '';
  };

  /* ---------- le nom dans les textes ---------- */
  const BORD = '(^|[^A-Za-zÀ-ÖØ-öø-ÿ])', SUITE = '(?![A-Za-zÀ-ÖØ-öø-ÿ])';
  const ELIDE = new RegExp(BORD + '([Dd]|[A-Za-zÀ-ÖØ-öø-ÿ]*[Qq]u)[’\']' + NOM + SUITE, 'g'), SEUL = new RegExp(BORD + NOM + SUITE, 'g'), CITE = new RegExp(BORD + NOM + SUITE);
  const voyelle = nom => /^[aeiouy]/.test(plat(nom)) && !/^y[aeiou]/.test(plat(nom)) && !/^[’'ʿʾ]/.test(nom);   // « d’Elyas », mais « de Hamza », « de Yûnus », « de ’Imrân »
  // la phrase d'origine, dite avec un autre nom
  // (dans une autre langue que le français, pas d'élision : le nom que la langue donne au râwî laisse sa place à celui du joueur)
  // (lang : la langue du texte, celle du jeu si elle n'est pas dite — 2.x, la langue secondaire en donne une autre)
  P.dire = function (t, nom, lang) { nom = nom || P.nom(); lang = lang || I.langue.lang; if (nom === NOM || typeof t !== 'string') return t;
    if (lang !== 'fr') { const d = I.langue.LANGUES[lang].rawi; return t.indexOf(d) < 0 ? t : t.split(d).join(nom); }
    if (t.indexOf(NOM) < 0) return t;
    const e = voyelle(nom); return t.replace(ELIDE, (m, a, b) => a + (e ? b + '’' : b + 'e ') + nom).replace(SEUL, (m, a) => a + nom); };
  // 2.x — la langue secondaire : un texte de cette langue, écrit sous un français qui nomme le râwî, reçoit le nom du joueur
  // (comme les phrases relevées le reçoivent dans la langue du jeu)
  P.direDans = (t, lang, fr) => (typeof fr === 'string' && fr.indexOf(NOM) >= 0 && CITE.test(fr) ? P.dire(t, P.nom(), lang) : t);
  // le nom du râwî tel qu'on l'affiche : celui du joueur, ou celui que la langue lui donne (« Idris », « إدريس », « イドリース »)
  P.dit = () => { const n = P.nom(); return n === NOM ? I.langue.rawi() : n; };
  // relève, dans un contenu posé, chaque phrase qui nomme le râwî (une seule fois par saga)
  const cases = [], vues = new Set();
  P.relever = function (racine) { if (!racine || vues.has(racine)) return;
    if (racine.frame && !racine.veillees && racine.heroes && racine.heroes.idris) marquer(racine.heroes.idris.look);   // le râwî, héros de l'histoire-cadre : sa marque
    (function va(v) { if (!v || typeof v !== 'object' || vues.has(v)) return; vues.add(v);
    Object.keys(v).forEach(k => { const x = v[k]; if (typeof x === 'string') { if (x.indexOf(NOM) >= 0 && CITE.test(x)) cases.push({ o: v, k, t: x }); } else va(x); }); })(racine); };
  P.phrases = () => cases.map(c => c.t);

  // l'apparence du râwî : celle de sa tenue de toujours (une copie : qui la reçoit peut la marquer sans toucher la table)
  P.look = () => Object.assign({}, D.TENUES[0].look);
  /* ---------- appliquer le profil : le nom dans les phrases relevées, le sceau du râwî ---------- */
  let origine = null;   // le sceau et la silhouette d'origine du râwî, gardés ici : sa fiche ne reçoit aucun champ de plus
  P.appliquer = function () {
    const p = P.profil();
    cases.forEach(c => { c.o[c.k] = P.dire(I.langue.de(c.t), p.nom); if (I.langue.retenir) I.langue.retenir(c.o[c.k], c.t); });   // la phrase dans la langue du joueur, puis son nom (2.x : retenue, pour la langue secondaire)
    const fr = I.sagas.idris, h = fr && fr.heroes && fr.heroes.idris;
    if (h) { if (!origine) origine = { arabic: h.arabic, look: h.look };
      h.arabic = p.nom === NOM ? origine.arabic : '';   // le sceau porte le nom en arabe ; avec un autre nom, il montre l'étoile à huit branches, seule
      h.look = origine.look; }   // (2.37) son apparence de toujours : l'objet d'origine, intact
    const W = I.world; if (W && W.saga && W.party && W.party.length && W.refreshSheets) { try { W.refreshSheets(); } catch (e) { /* hors chapitre */ } }
    return p;
  };
  // choisir : le nom est contrôlé. → '' ou la raison du refus (ce qu'on passait après le nom — une tenue, une composition —
  // n'est plus lu : 2.37)
  P.choisir = function (nom) { if (P.propre(nom) === I.langue.rawi()) nom = NOM;   // le nom que la langue donne au râwî, laissé tel quel : c'est le nom d'origine
    const r = P.refus(nom); if (r) return r;
    I.save.data.profil = { nom: P.propre(nom), tenue: D.TENUES[0].id }; P.appliquer(); return ''; };
})();
