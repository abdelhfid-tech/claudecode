/* ISNAD 2.0 — les règles du contenu, en un module.
   Ce sont les règles de la 1.31 (tools/validate.js et tools/validate-music.js), mot pour mot, sorties de leurs scripts :
   plus d'accès au disque, plus d'arrêt du programme. Ce que la 2.0 ajoute est marqué « 2.0 ». Le module se charge sous
   Node (require) comme dans un navigateur (window.ISNAD_REGLES) : la commande de contrôle, le jeu quand il reçoit un
   paquet et la page d'administration s'en servent tels quels.

   const R = creer(D, contexte)   D : les énumérations (src/core/defs.js), ou une copie étendue par un paquet
                                  contexte.savoirConnu(« saga/id ») : ce savoir existe-t-il dans une autre saga ?
                                  contexte.ennemisCommuns() : les égrégores communs à toutes les sagas
   R.verifierEquipement()         → [erreurs]
   R.verifierSaga(saga)           → { erreurs, avis }
   R.verifierPistes(pistes, opt)  → [erreurs] ; opt.partiel : ces pistes s'ajoutent, on n'attend pas toutes celles du jeu
   R.verifierObjets(objets, pieces) → [erreurs] : les objets de la besace qu'un paquet apporte
   R.verifierLieux(lieux)         → [erreurs] : les noms des lieux qu'un paquet déclare
   R.verifierEnsemble(sagas)      → [erreurs] : renvois entre sagas, ordre sur la Chaîne
   R.stats(sagas)                 → la ligne de résumé
   Aucun texte ne porte de balise (« < », « > ») : verifierSaga et verifierPaquet le refusent.

   verifierPaquet(D, paquet, { sagas, pris })   → { erreurs, avis, resume } : un paquet entier, face au contenu déjà posé */
(function (racine) {
  'use strict';
  // 2.0 — aucun texte ne porte de balise. « < » et « > » n'ont rien à faire dans un récit, un nom ou une description (l'emphase
  // s'écrit *ainsi*) ; et un contenu venu d'ailleurs ne doit pas pouvoir glisser du code dans la page.
  function balises(racine, ou, E) { let n = 0; (function va(v, w) { if (typeof v === 'string') { if (/[<>]/.test(v) && n++ < 5) E.push(`${w}: un texte ne contient ni « < » ni « > » (l'emphase s'écrit *ainsi*)`); }
    else if (v && typeof v === 'object') Object.keys(v).forEach(k => va(v[k], w + (Array.isArray(v) ? '[' + k + ']' : '.' + k))); })(racine, ou); }
  // 2.48 (D240) : ce qui nomme l'Agrégor, en français (« l'agrégateur de chimères » est sa description) — verifierNomAgregor, verifierLangue
  const AGREGOR = /agr[ée]g(or|ateur)/i;
  function creer(D, contexte) {
    const C = contexte || {}, savoirConnu = C.savoirConnu || (() => false), ennemisCommuns = C.ennemisCommuns || (() => ({}));
    // (la garde des noms : définie ici parce que les lieux et les objets d'un paquet y passent aussi)
    const NOM_INTERDIT = /(^|[^a-zà-ÿ])(ibl[iî]s|satan|sh?a[iy]t[aâ]ne?s?|chayt[aâ]ne?s?|diables?|d[ée]mons?|d?jinns?)(?![a-zà-ÿ])/i;
    /* 2.27 (D216) — aucun pari ni jeu de hasard ne se joue ; le pari n'est qu'une chimère. La règle, simple : aucune réponse offerte
       au joueur (un choix, une question, un pourparler, un menu de la course : cite.course), aucun nom de héros, de vertu, d'objet
       ou de pièce ne porte les mots du pari (PARI, et LANG.*.pari dans chaque langue) ; les tables de la course (D.CIRCUITS,
       D.COURSE) n'ont que leurs champs déclarés — ni mise, ni enjeu, ni cote, ni droit d'entrée — et une prime positive ou nulle.
       Le pari, une chimère (« Le Pari »), un parieur (un passant de fiction), un texte qui le dit : rien de cela n'est offert. */
    const PARI = /(^|[^a-zà-ÿ])(pari|paris|parier|parie|paries|parions|pariez|parient|parié|mise|mises|miser|misons|misez|misé|enjeux?|loteries?|casino|tirage au sort|jeux? de hasard|double ou rien|cotes?|gager|gageure)(?![a-zà-ÿ])/i;
    const pari = (t, where, E) => { if (typeof t === 'string' && PARI.test(t)) E.push(`${where}: « ${t.slice(0, 60)} » — aucun pari ni jeu de hasard ne se joue : rien de ce qu'on offre au joueur ne propose de parier ni de miser (le pari n'est qu'une chimère)`); };

    // l'équipement (D.GEAR) : chaque pièce a un type, un rang, un nom, une description sobre ; aucun mot qui en ferait une relique
    function verifierEquipement() { const E = [], STATS = ['atk', 'mag', 'def', 'spd', 'hp', 'sp'], TRAITS = ['perce', 'vif', 'choc', 'parade', 'ferme'], INTERDIT = /allah|dieu|proph|bén[ie]|sacr|saint|relique|talisman|amulette|miracl|\bor\b|doré|soie/i;
      Object.keys(D.GEAR).forEach(id => { const g = D.GEAR[id], T = D.GEAR_TYPES[g.t];
        if (!T) { E.push(`${id}: type « ${g.t} » inconnu`); return; }
        if (!D.SLOTS[T.slot]) E.push(`${id}: emplacement « ${T.slot} » inconnu`);
        if (!(Number.isInteger(g.r) && g.r >= 0 && g.r < D.GEAR_PRIX.length)) E.push(`${id}: rang invalide`);
        if (typeof g.name !== 'string' || typeof g.desc !== 'string') E.push(`${id}: nom ou description manquant`);
        else if (INTERDIT.test(g.name + ' ' + g.desc)) E.push(`${id}: un objet ne reçoit ni nom divin, ni vertu, ni or, ni soie (exigences 8, 15, 16)`);
        pari(g.name, id, E);   // 2.27 : aucune pièce n'est un enjeu
        if (D.ITEMS[id]) E.push(`${id}: même identifiant qu'un objet de la besace`);
        STATS.forEach(k => { if (g[k] !== undefined && !(typeof g[k] === 'number' && Math.abs(g[k]) <= 25)) E.push(`${id}: ${k} hors bornes (±25 %)`); });
        TRAITS.forEach(k => { if (g[k] !== undefined && !(g[k] > 0 && g[k] <= 0.6)) E.push(`${id}: ${k} hors bornes (0 à 0,6)`); });
        if (!STATS.some(k => g[k]) && !TRAITS.some(k => g[k]) && !g.prime) E.push(`${id}: pièce sans effet`);
        (g.roles || T.roles).forEach(r => { if (!D.ROLES[r]) E.push(`${id}: rôle « ${r} » inconnu`); });
        if (g.port && !D.PORTES.includes(g.port)) E.push(`${id}: port « ${g.port} » inconnu`);
        if (g.tete && !D.COIFFES.includes(g.tete)) E.push(`${id}: tete « ${g.tete} » inconnue`);
        if (g.corps && !D.ARMURES.includes(g.corps)) E.push(`${id}: corps « ${g.corps} » inconnu`);
        if (!Array.isArray(g.c) || g.c.length !== 2 || g.c.some(c => !/^#[0-9a-f]{6}$/i.test(c))) E.push(`${id}: c attend deux couleurs #rrggbb`); });
      Object.keys(D.GEAR_TYPES).forEach(t => { const T = D.GEAR_TYPES[t]; if (T.port && !D.PORTES.includes(T.port)) E.push(`type ${t}: port inconnu`); if (T.anim && !['slash', 'thrust', 'arrow', 'smash'].includes(T.anim)) E.push(`type ${t}: anim inconnue`); });
      // (2.28, D217 : l'étal de la galerie des quartiers se tient au lieu que dit D.ACTIVITES.etal, et non à un comptoir)
      const etal = m => m === 'quartiers' && D.ACTIVITES && D.ACTIVITES.etal && D.MAPS[m] && D.MAPS[m].spots.includes(D.ACTIVITES.etal.lieu);
      Object.keys(D.GEAR_SHOPS).forEach(m => { if (!D.MAPS[m] || !(D.MAPS[m].spots.includes('comptoir') || etal(m))) E.push(`boutique « ${m} » : carte sans comptoir`); D.GEAR_SHOPS[m].forEach(id => { if (!D.GEAR[id]) E.push(`boutique ${m}: pièce « ${id} » inconnue`); }); });
      Object.keys(D.ROLES).forEach(r => Object.keys(D.SLOTS).forEach(s => { if (!Object.keys(D.GEAR).some(id => D.GEAR_TYPES[D.GEAR[id].t].slot === s && (D.GEAR[id].roles || D.GEAR_TYPES[D.GEAR[id].t].roles).includes(r))) E.push(`aucune pièce pour le rôle ${r} à l'emplacement ${s}`); }));
      return E; }

    function stats(sagas) {
      let ch = 0, ops = 0, bat = 0, cho = 0, par = 0, pry = 0;
      const walk = list => (list || []).forEach(o => {
        ops++;
        if (o[0] === 'battle') bat++;
        if (o[0] === 'parley') { par++; walk(o[1].win); walk(o[1].lose); }
        if (o[0] === 'pray') pry++;
        if (o[0] === 'choice') { cho++; o[2].forEach(c => walk(c.r)); }
        if (o[0] === 'ask') o[2].forEach(c => walk(c.r));
        if (o[0] === 'if') { walk(o[2]); walk(o[3]); }
      });
      for (const s of sagas) {
        if (s.commun) return `contenu commun : ${Object.keys(s.enemies || {}).length} égrégores, ${(s.codex || []).length} entrées du Recueil, ${Object.keys(s.oeuvres || {}).length} œuvres, ${Object.keys(s.lames || {}).length} lames, ${Object.keys(s.animaux || {}).length} compagnons de lumière`;
        walk(s.intro); walk(s.outro);
        for (const c of s.chapters) {
          ch++; walk(c.intro); walk(c.outro);
          (c.objectives || []).forEach(o => walk(o.then));
          (c.npcs || []).forEach(n => walk(n.talk));
          bat += (c.foes || []).length;
        }
      }
      return `${ch} chapitres, ${ops} opérations, ${bat} combats, ${cho} choix, ${par} pourparlers, ${pry} prières`;
    }

    /* 2.27 (D216) — Sâlim et la course : ce que dit le circuit (cite.course), les tables (D.CIRCUITS, D.COURSE) et la zone du Pari.
       Le circuit s'ouvre dès le prologue joué, avant l'étape III de la découverte de l'Agrégor (2.25) : aucun de ses textes ne le
       nomme. Aucun nombre dans un récit : ils sont tous dans les tables. */
    function verifierCourse(C, E) {
      const txt = (v, w) => { if (typeof v !== 'string' || !v.trim()) { E.push(`cite.course.${w}: texte manquant`); return; } if (/agr[ée]gor/i.test(v)) E.push(`cite.course.${w}: le circuit s'ouvre avant que l'Agrégor soit nommé (2.25) : aucun de ses textes ne le nomme`); if (/\d/.test(v)) E.push(`cite.course.${w}: aucun nombre dans un récit (D.CIRCUITS, D.COURSE)`); if (NOM_INTERDIT.test(v)) E.push(`cite.course.${w}: ni Iblîs, ni démon, ni djinn`); };
      const liste = (v, w, a, b) => { if (!Array.isArray(v) || v.length < a || v.length > b) { E.push(`cite.course.${w}: de ${a} à ${b} textes`); return; } v.forEach((t, i) => txt(t, `${w}[${i}]`)); };
      if (!C || typeof C !== 'object') { E.push('cite.course: manquant (Sâlim et la course, D216)'); return; }
      const A = C.arrivee || {}; liste(A.salim, 'arrivee.salim', 2, 2); txt(A.idris, 'arrivee.idris');
      ['offre', 'monter', 'pasMaintenant', 'refus', 'revoir', 'plusTard', 'depart', 'descendu', 'encoreQ', 'encore', 'uneAutreFois'].forEach(k => txt(C[k], k));
      liste(C.fins, 'fins', 3, 3); liste(C.apres, 'apres', 1, 4); liste(C.salim, 'salim', 3, 8);
      const O = C.organisateur || {}; txt(O.avant, 'organisateur.avant'); liste(O.accueil, 'organisateur.accueil', 1, 5); txt(O.choix, 'organisateur.choix');
      if (!Array.isArray(C.circuits) || C.circuits.length !== (D.CIRCUITS || []).length) E.push(`cite.course.circuits: un nom et un mot par circuit de D.CIRCUITS (${(D.CIRCUITS || []).length})`);
      else C.circuits.forEach((c, i) => { txt(c && c.nom, `circuits[${i}].nom`); txt(c && c.dit, `circuits[${i}].dit`); pari(c && c.nom, `cite.course.circuits[${i}].nom`, E); pari(c && c.dit, `cite.course.circuits[${i}].dit`, E); });
      liste(C.couleurs, 'couleurs', 9, 9);
      const P = C.podium || {}; ['gagne', 'podium', 'perdu', 'plafond'].forEach(k => txt(P[k], 'podium.' + k));
      // ce qu'on offre au joueur au circuit : rien n'y propose de parier ni de miser
      ['offre', 'monter', 'pasMaintenant', 'encoreQ', 'encore', 'uneAutreFois'].forEach(k => pari(C[k], `cite.course.${k}`, E)); pari(O.choix, 'cite.course.organisateur.choix', E);
      // les tables : leurs champs déclarés, et rien d'autre (ni mise, ni enjeu, ni cote, ni droit d'entrée)
      const CL = ['id', 'trace', 'large', 'tours', 'temps', 'depart', 'prime', 'adversaires', 'nuit', 'viaduc'], AL = ['vitesse', 'adresse', 'avance'], num = (v, a, b) => typeof v === 'number' && isFinite(v) && v >= a && v <= b;
      (D.CIRCUITS || []).forEach((c, i) => { const w = `D.CIRCUITS[${i}]`;
        Object.keys(c).forEach(k => { if (!CL.includes(k)) E.push(`${w}: champ « ${k} » inconnu (${CL.join(', ')}) — aucune mise, aucun enjeu`); });
        if (!Array.isArray(c.trace) || c.trace.length < 3 || c.trace.some(p => !Array.isArray(p) || p.length !== 3 || !num(p[0], 0, 1100) || !num(p[1], 0, 740) || !num(p[2], 8, 200))) E.push(`${w}: trace attend au moins trois sommets [x, y, r] dans la toile (1100 × 740)`);
        if (!num(c.large, 12, 60)) E.push(`${w}: large de 12 à 60`); if (!(Number.isInteger(c.tours) && c.tours >= 1 && c.tours <= 6)) E.push(`${w}: tours de 1 à 6`);
        if (!num(c.temps, 0, 600)) E.push(`${w}: temps de 0 à 600 secondes`); if (!(Number.isInteger(c.prime) && c.prime >= 0 && c.prime <= 100)) E.push(`${w}: prime entière, de 0 à 100 dirhams (on ne paie jamais pour courir)`);
        if (!Array.isArray(c.adversaires) || c.adversaires.length > 4) E.push(`${w}: de 0 à 4 adversaires`);
        (c.adversaires || []).forEach((a, j) => { Object.keys(a || {}).forEach(k => { if (!AL.includes(k)) E.push(`${w}.adversaires[${j}]: champ « ${k} » inconnu`); }); if (!num(a.vitesse, 0.3, 1) || !num(a.adresse, 0.3, 1) || !num(a.avance, 0, 400)) E.push(`${w}.adversaires[${j}]: vitesse et adresse de 0,3 à 1, avance de 0 à 400`); });
        if (Array.isArray(c.adversaires) && !c.adversaires.length && !c.temps) E.push(`${w}: seul sur la piste, un temps à battre`); });
      const CO = D.COURSE || {}; Object.keys(CO).forEach(k => { if (!['voiture', 'moto', 'podium', 'plafond'].includes(k)) E.push(`D.COURSE: champ « ${k} » inconnu — aucune mise, aucun enjeu`); });
      if (!Array.isArray(CO.podium) || CO.podium.some(v => !num(v, 0, 1))) E.push('D.COURSE.podium: des parts de la prime, de 0 à 1'); if (!(Number.isInteger(CO.plafond) && CO.plafond >= 0)) E.push('D.COURSE.plafond: un entier positif ou nul');
      Object.keys((D.CITE && D.CITE.zones) || {}).forEach(k => { const z = D.CITE.zones[k]; if (!(D.CITE.rodent || {})[k]) E.push(`D.CITE.zones ${k}: une zone pour une chimère de D.CITE.rodent`); if (!Array.isArray(z) || !z.length || z.some(n => typeof n !== 'string')) E.push(`D.CITE.zones ${k}: une liste de cases`); });
    }

    /* 2.28 (D217) — les activités des quartiers : ce qu'on y dit (cite.activites), et leurs tables (D.ACTIVITES, D.BORNE). Elles
       s'ouvrent dès le prologue, avant l'étape III de la découverte de l'Agrégor (2.25) : aucun de leurs textes ne le nomme.
       Aucun nombre dans un récit. Une activité qu'on paie ne rapporte rien, aucun hasard ne décide de rien, on ne paie jamais pour
       courir : les tables n'ont que leurs champs déclarés (ni gain, ni prime, ni lot, ni mise, ni enjeu, ni cote) ; un prix est un
       entier positif ; rien de ce qui s'y dit ne porte les mots du pari. */
    function verifierActivites(A, E) {
      const txt = (v, w) => { if (typeof v !== 'string' || !v.trim()) { E.push(`cite.activites.${w}: texte manquant`); return; } if (/agr[ée]gor/i.test(v)) E.push(`cite.activites.${w}: les activités s'ouvrent avant que l'Agrégor soit nommé (2.25) : aucun de leurs textes ne le nomme`); if (/\d/.test(v)) E.push(`cite.activites.${w}: aucun nombre dans un récit (D.ACTIVITES, D.BORNE)`); if (NOM_INTERDIT.test(v)) E.push(`cite.activites.${w}: ni Iblîs, ni démon, ni djinn`); if (/[«»]|Coran|\d+:\d+/.test(v)) E.push(`cite.activites.${w}: ni verset ni parole citée (un texte de fiction)`); pari(v, `cite.activites.${w}`, E); };
      const liste = (v, w, a, b) => { if (!Array.isArray(v) || v.length < a || v.length > b) { E.push(`cite.activites.${w}: de ${a} à ${b} textes`); return; } v.forEach((t, i) => txt(t, `${w}[${i}]`)); };
      if (!A || typeof A !== 'object') { E.push('cite.activites: manquant (les activités des quartiers, D217)'); return; }
      ['attend', 'manque', 'etal', 'record'].forEach(k => txt(A[k], k)); liste(A.ecran, 'ecran', 2, 6); liste(A.roue, 'roue', 1, 4);
      const M = A.maneges || {}; liste(M.chaises, 'maneges.chaises', 1, 4); liste(M.tasses, 'maneges.tasses', 1, 4);
      const AL = ['outil', 'lieu', 'prix', 'duree'], BL = ['arene', 'duree', 'vitesse', 'elan', 'elanDuree', 'elanRepos', 'prise', 'ombre', 'choc', 'cadence', 'cadenceOmbres', 'lentes', 'vives', 'palier'], GAIN = /gain|prime|lot|recompense|récompense|mise|enjeu|cote|bourse|dirham/i;
      const spots = (D.MAPS.quartiers || { spots: [] }).spots, num = (v, a, b) => typeof v === 'number' && isFinite(v) && v >= a && v <= b;
      Object.keys(D.ACTIVITES || {}).forEach(id => { const x = D.ACTIVITES[id], w = `D.ACTIVITES.${id}`;
        Object.keys(x).forEach(k => { if (GAIN.test(k)) E.push(`${w}: « ${k} » — une activité qu'on paie ne rapporte rien (ni dirhams, ni lot, ni objet)`); else if (!AL.includes(k)) E.push(`${w}: champ « ${k} » inconnu (${AL.join(', ')})`); });
        if (!D.OUTILS[x.outil]) E.push(`${w}: outil « ${x.outil} » inconnu (D.OUTILS)`); if (!spots.includes(x.lieu)) E.push(`${w}: lieu « ${x.lieu} » inconnu des quartiers`);
        if (x.prix !== undefined && !(Number.isInteger(x.prix) && x.prix >= 1 && x.prix <= 50)) E.push(`${w}: un prix est un entier positif (de 1 à 50 dirhams)`);
        if (x.duree !== undefined && !num(x.duree, 3, 60)) E.push(`${w}: une durée de 3 à 60 secondes`); });
      if (D.ACTIVITES && D.ACTIVITES.etal && D.ACTIVITES.etal.prix !== undefined) E.push('D.ACTIVITES.etal: l\'étal vend au prix de chaque pièce (D.GEAR_PRIX)');
      const B = D.BORNE || {}; Object.keys(B).forEach(k => { if (!BL.includes(k)) E.push(`D.BORNE: champ « ${k} » inconnu — la borne ne donne que son score`); });
      BL.forEach(k => { const v = B[k], ok = Array.isArray(v) ? v.length === 2 && v.every(n => num(n, 0.01, 1000)) : num(v, 0.01, 1000); if (!ok) E.push(`D.BORNE.${k}: un nombre positif (ou deux)`); });
      if (num(B.duree, 0, 1000) && B.duree > 60) E.push('D.BORNE.duree: une partie dure une minute au plus');
    }

    /* 2.30 (D222) — les rencontres de la route (coeur.js, `route` ; monde.js, trade.js). Le voyageur : un pourparler de trois à
       cinq manches avec lui (« _voyageur »), dont une seule porte une idée noire, le Désespoir, à qui l'on répond ; s'il n'est
       pas apaisé, la chimère qui le tient se lève (« _voyageur_tenu ») — une chimère du contenu commun, de racine le Désespoir,
       faible devant ce qui le défait, ni idée noire, ni mal du cœur, ni idole. Ce qui se dit autour, et avant et après la parole
       avec les brigands : quelques lignes. Tout est de la fiction : ni verset, ni parole citée, ni nombre, ni nom de démon ;
       la carte du monde vient avant l'étape III de la découverte de l'Agrégor (2.25) : aucun texte ne le nomme ; et rien ne
       porte les mots du pari. */
    function verifierRoute(Rt, propres, E) {
      const w = 'route', VOY = '_voyageur', txt = (v, ou) => { if (typeof v !== 'string' || !v.trim()) { E.push(`${ou}: texte manquant`); return; }
        if (/agr[ée]gor/i.test(v)) E.push(`${ou}: la carte du monde vient avant que l'Agrégor soit nommé (2.25) : aucun texte des rencontres ne le nomme`);
        if (/\d/.test(v)) E.push(`${ou}: aucun nombre dans un texte des rencontres (D.MONDE.rencontres)`);
        if (/[«»]|Coran|\d+:\d+/.test(v)) E.push(`${ou}: ni verset ni parole citée (un texte de fiction)`);
        if (NOM_INTERDIT.test(v)) E.push(`${ou}: ni Iblîs, ni démon, ni djinn`); pari(v, ou, E); };
      // quelques lignes : nar, say (le voyageur, ou un nom en toutes lettres), emote (le voyageur), et le drapeau qui fait lever la chimère
      const lignes = (ops, ou, permis) => { if (!Array.isArray(ops) || !ops.length) { E.push(`${ou}: des lignes (un tableau d'opérations)`); return; }
        ops.forEach((o, i) => { const wo = `${ou}[${i}]`; if (!Array.isArray(o) || !permis.includes(o[0])) { E.push(`${wo}: seules ${permis.join('|')} sont permises ici`); return; }
          if (o[0] === 'nar') txt(o[1], wo); else if (o[0] === 'say') { if (typeof o[1] !== 'string' || (o[1] !== VOY && /^[a-z0-9_]+$/.test(o[1]))) E.push(`${wo}: say(« ${VOY} » ou un nom, texte)`); else if (o[1] !== VOY) txt(o[1], wo); txt(o[2], wo); }
          else if (o[0] === 'emote') { if (o[1] !== VOY || !(o[2] === null || D.POSES.includes(o[2]))) E.push(`${wo}: emote(« ${VOY} », une pose de D.POSES ou null)`); }
          else if (o[0] === 'flag') { if (o[1] !== '_voyageur_tenu' || o.length > 2) E.push(`${wo}: seul le drapeau « _voyageur_tenu » (la chimère se lève)`); } }); };
      if (!Rt || typeof Rt !== 'object') { E.push(`${w}: manquant (les rencontres de la route, D222)`); return; }
      Object.keys(Rt).forEach(k => { if (!['voyageur', 'brigands'].includes(k)) E.push(`${w}: « ${k} » inconnu (voyageur, brigands)`); });
      const V = Rt.voyageur || {}, B = Rt.brigands || {}, ch = propres[V.chimere], dz = propres.noir_desespoir || {};
      Object.keys(V).forEach(k => { if (!['chimere', 'parle', 'encore', 'libere'].includes(k)) E.push(`${w}.voyageur: « ${k} » inconnu (chimere, parle, encore, libere)`); });
      // la chimère qui tient le voyageur
      if (!ch) E.push(`${w}.voyageur.chimere: « ${V.chimere} » n'est pas une chimère du contenu commun`);
      else { if (ch.racine !== 'noir_desespoir') E.push(`${w}.voyageur.chimere: sa racine est le Désespoir (« noir_desespoir »)`);
        if (ch.idee || D.NOIRS.includes(V.chimere) || ch.vice || ch.tier === 'boss') E.push(`${w}.voyageur.chimere: une chimère, ni idée noire, ni mal du cœur, ni idole`);
        if ((dz.weak || []).some(x => !(ch.weak || []).includes(x))) E.push(`${w}.voyageur.chimere: faible devant ce qui défait le Désespoir (${(dz.weak || []).join(', ')})`); }
      // le pourparler
      const P = Array.isArray(V.parle) && V.parle.length === 1 && Array.isArray(V.parle[0]) && V.parle[0][0] === 'parley' ? V.parle[0][1] || {} : null, wp = `${w}.voyageur.parle`;
      if (!P) E.push(`${wp}: un seul pourparler (['parley', { … }])`);
      else {
        if (P.with !== VOY) E.push(`${wp}: le pourparler se tient avec le voyageur (« ${VOY} »)`); txt(P.title, `${wp}.title`); txt(P.intro, `${wp}.intro`);
        if (!Array.isArray(P.rounds) || P.rounds.length < 3 || P.rounds.length > 5) E.push(`${wp}: de 3 à 5 manches`);
        else { let max = 0, min = 0; const noirs = P.rounds.filter(r => r && r.noir);
          if (noirs.length !== 1 || JSON.stringify((noirs[0].noir || {}).group) !== JSON.stringify(['noir_desespoir'])) E.push(`${wp}: une manche, une seule, porte l'idée noire du Désespoir (noir.group: ['noir_desespoir'])`);
          P.rounds.forEach((r, ri) => { const wr = `${wp}.rounds[${ri}]`; txt(r.say, wr + '.say'); let m = -9, mn = 9;
            if (r.noir) { txt(r.noir.name, wr + '.noir.name'); txt(r.noir.intro, wr + '.noir.intro'); if (r.noir.after !== undefined) txt(r.noir.after, wr + '.noir.after'); if (r.noir.v !== undefined) E.push(`${wr}.noir: pas de « v » (une idée noire répondue vaut un point de confiance)`); }
            if (!Array.isArray(r.opts) || r.opts.length < 2 || r.opts.length > 4) { E.push(`${wr}: 2 à 4 réponses`); return; }
            r.opts.forEach((x, xi) => { const wx = `${wr}.opts[${xi}]`; txt(x.t, wx + '.t'); txt(x.r, wx + '.r');
              if (!(typeof x.v === 'number' && x.v >= -2 && x.v <= 3)) E.push(`${wx}: v entre -2 et 3`); if (!D.ELEMENTS[x.el] || x.el === 'fer') E.push(`${wx}: el doit être une Lumière`);
              if (x.need !== undefined || x.ok !== undefined) E.push(`${wx}: ni « need » ni « ok » sur la route`); m = Math.max(m, x.v); mn = Math.min(mn, x.v); });
            max += m + (r.noir ? 1 : 0); min += mn + (r.noir ? 1 : 0); });
          if (typeof P.goal !== 'number' || P.goal > max || P.goal <= min) E.push(`${wp}: goal ${P.goal} entre ${min + 1} et ${max} (atteignable, jamais acquis d'avance)`); }
        lignes(P.win, `${wp}.win`, ['nar', 'say', 'emote']); lignes(P.lose, `${wp}.lose`, ['nar', 'say', 'emote', 'flag']);
        if (!(P.lose || []).some(o => Array.isArray(o) && o[0] === 'flag' && o[1] === '_voyageur_tenu')) E.push(`${wp}.lose: le drapeau « _voyageur_tenu » (la chimère qui le tient se lève)`);
        if ((P.win || []).some(o => Array.isArray(o) && o[0] === 'flag')) E.push(`${wp}.win: apaisé, il se relève : aucun drapeau`);
        Object.keys(P).forEach(k => { if (!['with', 'title', 'intro', 'goal', 'rounds', 'win', 'lose'].includes(k)) E.push(`${wp}: « ${k} » inconnu`); }); }
      lignes(V.encore, `${w}.voyageur.encore`, ['nar', 'say', 'emote']); lignes(V.libere, `${w}.voyageur.libere`, ['nar', 'say', 'emote']);
      Object.keys(B).forEach(k => { if (!['avant', 'apres'].includes(k)) E.push(`${w}.brigands: « ${k} » inconnu (avant, apres)`); });
      lignes(B.avant, `${w}.brigands.avant`, ['nar', 'say']); lignes(B.apres, `${w}.brigands.apres`, ['nar', 'say']);
    }

    /* 2.48 (D240 ; le décideur, 27 novembre : « Dans l'ordre où on joue ») — le nom de l'Agrégor. Les sagas s'ouvrent toutes,
       et les cinq rencontres de la Cité-Miroir se jouent dans l'ordre qu'on veut ; la k-ième jouée dit l'étape k (frame.js,
       ETAPES ; ui.js, U.etapes), et le nom est reçu avec la fiche « agregor », à l'étape III. La règle de la 2.25 (D214) —
       « avant l'étape III, aucun texte ne le nomme » — devient : un texte qui le nomme ne se dit que là où le nom est reçu à
       coup sûr :
       - sous ['if', '_2084_agregor', …] (le moteur le pose quand le nom est reçu ; la branche « sinon » dit l'autre chose :
         « ce qui règne là-haut », « les écrans ») ;
       - dans une étape III, IV ou V (['if', '_2084_etape_3…5', …]) : une étape k ≥ 3 vient après la troisième rencontre jouée ;
       - dans le dernier maillon (« fin »), qui ne s'ouvre qu'après les cinq sagas et les cinq rencontres (ui.js, la Chaîne) ;
       - et la fiche « agregor » elle-même, que seule l'opération ['codex', 'agregor'] donne — vérifiée comme un texte.
       Une autre fiche qui le nomme porte « avant », son texte tant que le nom n'est pas reçu (ui.js, U.codexEntry), qui ne le
       nomme pas. Une chimère de la saga qui le nomme ne se combat que là où il est reçu, et ne rôde pas (palier « minion »).
       Partout ailleurs — l'ouverture et la fin d'une saga, ses héros, ce qu'on dit dans les quartiers, les rencontres de la
       route —, aucun texte ne le nomme. Dans chaque langue, verifierLangue : une langue ne le nomme que là où le français le nomme. */
    function verifierNomAgregor(s, E) {
      const combats = new Set(), OK = f => f === '_2084_agregor' || /^_2084_etape_[345]$/.test(f);
      const dit = (v, w) => E.push(`${w}: « ${v.slice(0, 70)} » nomme l'Agrégor là où son nom n'est peut-être pas encore reçu (D240 : il l'est à la troisième rencontre jouée) — le dire sous ['if', '_2084_agregor', …], dans une étape III à V, ou dans le dernier maillon`);
      const va = (v, w, recu) => {
        if (typeof v === 'string') { if (!recu && AGREGOR.test(v)) dit(v, w); return; }
        if (!v || typeof v !== 'object') return;
        if (Array.isArray(v) && v[0] === 'if' && typeof v[1] === 'string' && Array.isArray(v[2])) { va(v[2], w + '.si', recu || OK(v[1])); if (v[3] !== undefined) va(v[3], w + '.sinon', recu); return; }
        if (!Array.isArray(v) && Array.isArray(v.group) && !recu) v.group.forEach(g => combats.add(g));   // un combat, une manche « noir », une chimère du chapitre
        if (Array.isArray(v)) v.forEach((x, i) => va(x, `${w}[${i}]`, recu)); else Object.keys(v).forEach(k => va(v[k], `${w}.${k}`, recu));
      };
      const finale = !!(s.frame && !s.veillees);   // la clôture de l'histoire-cadre ne se joue qu'à la fin du dernier maillon
      Object.keys(s).filter(k => !['enemies', 'codex', 'chapters'].includes(k)).forEach(k => va(s[k], `saga ${s.id}.${k}`, k === 'outro' && finale));
      (s.chapters || []).forEach((c, i) => va(c, `chapitre ${c.id || i}`, !!(c.fin && finale)));
      (s.codex || []).forEach(c => { if (c.id === 'agregor' && s.frame) return; const w = `codex ${c.id}`;
        ['title', 'src', 'avant'].forEach(k => va(c[k], `${w}.${k}`, false));
        if (typeof c.text === 'string' && AGREGOR.test(c.text) && typeof c.avant !== 'string') E.push(`${w}: le texte nomme l'Agrégor ; la fiche porte « avant », son texte tant que le nom n'est pas reçu, qui ne le nomme pas (D240)`); });
      Object.keys(s.enemies || {}).forEach(k => { const e = s.enemies[k], nomme = JSON.stringify(e || {}).match(AGREGOR);
        if (nomme && (combats.has(k) || (e && e.tier === 'minion'))) E.push(`ennemi ${k}: il nomme l'Agrégor et se combat là où son nom n'est peut-être pas encore reçu, ou rôde (D240)`); });
    }
    function checkSaga(s, E, W) {
      const req = (o, k, t, where) => {
        if (o[k] === undefined || o[k] === null) { E.push(`${where}: champ « ${k} » manquant`); return false; }
        if (t === 'array' ? !Array.isArray(o[k]) : typeof o[k] !== t) { E.push(`${where}: « ${k} » doit être ${t}`); return false; }
        return true;
      };
      const W0 = `saga ${s.id || '?'}`, commun = !!s.commun;
      // exigences 6 et 18 : aucun combattant, aucune compétence, aucun personnage ne porte le nom d'Iblîs, d'un démon ou d'un djinn.
      // La garde ne regarde que les noms, jamais un texte ni une citation (mots entiers : « Démontrer » passe).
      const garde = (nom, where) => { if (typeof nom === 'string' && NOM_INTERDIT.test(nom)) E.push(`${where}: « ${nom} » — aucun combattant, aucune compétence, aucun personnage ne porte le nom d'Iblîs, d'un démon ou d'un djinn (exigences 6 et 18)`); };
      (commun ? ['id', 'name'] : ['id', 'name', 'epithet', 'arabic', 'years', 'light', 'lightName', 'tagline']).forEach(k => req(s, k, 'string', W0));
      if (!commun) req(s, 'order', 'number', W0);
      if (s.light && !D.ELEMENTS[s.light]) E.push(`${W0}: light « ${s.light} » inconnue`);
      req(s, 'heroes', 'object', W0); req(s, 'enemies', 'object', W0);
      req(s, 'codex', 'array', W0); req(s, 'chapters', 'array', W0);
      if (!commun) { req(s, 'intro', 'array', W0); req(s, 'outro', 'array', W0); }
      // le côté du bien : sept Valeurs et sept attributs, un par mal du cœur ; un attribut a son Nom, son verset et sa référence
      if (commun) {
        const vices = Object.keys(D.VICES), txt = (o, k, w) => { if (!o || typeof o[k] !== 'string' || !o[k].trim()) E.push(`${w}: « ${k} » manque`); };
        if (s.valeurs || s.attributs) vices.forEach(v => {
          const X = (s.valeurs || {})[v], A = (s.attributs || {})[v];
          if (!X) E.push(`valeurs.${v}: manque (une Valeur par mal du cœur)`); else { txt(X, 'texte', `valeurs.${v}`); txt(X, 'face', `valeurs.${v}`); }
          if (!A) E.push(`attributs.${v}: manque (un attribut par mal du cœur)`);
          else { ['nom', 'sens', 'verset', 'ref', 'mot'].forEach(k => txt(A, k, `attributs.${v}`));
            if (typeof A.ref === 'string' && !/^Coran \d+:\d+/.test(A.ref)) E.push(`attributs.${v}: la référence commence par « Coran s:v » (exigence 7)`);
            if (typeof A.verset === 'string' && !/^«.*»$/.test(A.verset.trim())) E.push(`attributs.${v}: le verset se cite entre guillemets, mot à mot`); }
        });
        Object.keys(s.valeurs || {}).concat(Object.keys(s.attributs || {})).forEach(k => { if (!D.VICES[k]) E.push(`valeurs/attributs: « ${k} » n'est pas un mal du cœur (${vices.join('|')})`); });
        if (s.portes) ['priere', 'dhikr', 'sommeil'].forEach(k => { const P = s.portes[k]; if (!P) E.push(`portes.${k}: manque`); else { txt(P, 'titre', `portes.${k}`); txt(P, 'invite', `portes.${k}`); } });
        if (s.secours) ['titre', 'bandeau', 'verset', 'ref', 'mot'].forEach(k => txt(s.secours, k, 'secours'));
        if (s.route !== undefined) verifierRoute(s.route, s.enemies || {}, E);   // 2.30 (D222)
      }
      const heroes = s.heroes || {}, propres = s.enemies || {}, enemies = Object.assign({}, commun ? {} : ennemisCommuns(), propres);
      Object.keys(propres).forEach(k => { if (!commun && ennemisCommuns()[k]) E.push(`ennemi ${k}: ce nom est déjà celui d'un égrégore commun (src/data/coeur.js)`); });
      const codexIds = new Set((s.codex || []).map(c => c.id));

      // tenue d'un personnage : coiffe, manteau, motif, attributs portés
      const checkLook = (l, where) => {
        if (!l || typeof l !== 'object') return;
        if (l.coiffe !== undefined && !D.COIFFES.includes(l.coiffe)) E.push(`${where}: look.coiffe « ${l.coiffe} » invalide (${D.COIFFES.join('|')})`);
        if (l.manteau !== undefined && !D.MANTEAUX.includes(l.manteau)) E.push(`${where}: look.manteau « ${l.manteau} » invalide (${D.MANTEAUX.join('|')})`);
        if (l.motif !== undefined && !D.MOTIFS.includes(l.motif)) E.push(`${where}: look.motif « ${l.motif} » invalide (${D.MOTIFS.join('|')})`);
        if (l.armure !== undefined && !D.ARMURES.includes(l.armure)) E.push(`${where}: look.armure « ${l.armure} » invalide (${D.ARMURES.join('|')})`);
        if (l.item !== undefined && l.item !== null) [].concat(l.item).forEach(it => { if (!D.PORTES.includes(it)) E.push(`${where}: look.item « ${it} » invalide (${D.PORTES.join('|')})`); });
        ['echarpe', 'court', 'cuirasse', 'chale'].forEach(k => { if (l[k] !== undefined && typeof l[k] !== 'boolean') E.push(`${where}: look.${k} vaut true ou false`); });
        ['robe', 'head', 'cloak', 'aura', 'trim', 'legs'].forEach(k => { if (l[k] !== undefined && !/^#[0-9a-fA-F]{6}$/.test(l[k])) E.push(`${where}: look.${k} doit être une couleur #rrggbb`); });
        // 2.x — le visage vient des couleurs du personnage lui-même : un récit n'écrit ni teint ni trait (exigences 2 et 10) ;
        // le néon et l'objet porté sont ceux que le joueur donne à son râwî (perso.js, D.RAWI) ; rawi, la marque que le moteur pose sur lui (perso.js)
        ['teint', 'barbe', 'poil', 'visage', 'neon', 'porte', 'rawi'].forEach(k => { if (l[k] !== undefined) E.push(`${where}: look.${k} est réservé au râwî : un récit ne l'écrit pas`); });
        // 2.26 (D215) — une femme porte la tenue que le moteur lui pose (le khimâr, la robe longue sans ceinture) : le récit n'en écrit rien
        if (l.kind === 'femme') (D.TENUE_FEMME || []).forEach(k => { if (l[k] !== undefined) E.push(`${where}: look.${k} — la tenue d'une femme (le khimâr, la robe longue) est posée par le moteur : un récit n'écrit que le type et les couleurs (D215)`); });
      };
      const checkSkill = (k, where, isHero) => {
        if (!k || typeof k !== 'object') { E.push(`${where}: compétence invalide`); return; }
        if (typeof k.name !== 'string') E.push(`${where}: compétence sans « name »`);
        if (isHero) {
          if (typeof k.id !== 'string') E.push(`${where}: compétence sans « id »`);
          if (typeof k.desc !== 'string') E.push(`${where}/${k.id}: « desc » manquant`);
        }
        if (!D.TARGETS.includes(k.target)) E.push(`${where}/${k.name}: target « ${k.target} » invalide (${D.TARGETS.join('|')})`);
        if (k.pow !== undefined) {
          if (typeof k.pow !== 'number' || k.pow <= 0 || k.pow > 4) E.push(`${where}/${k.name}: pow hors bornes (0–4)`);
          if (!D.ELEMENTS[k.el]) E.push(`${where}/${k.name}: el « ${k.el} » invalide`);
        }
        if (k.anim !== undefined && !D.ANIMS.includes(k.anim)) E.push(`${where}/${k.name}: anim « ${k.anim} » invalide (${D.ANIMS.join('|')})`);
        if (k.hits !== undefined && (k.hits < 1 || k.hits > 5)) E.push(`${where}/${k.name}: hits 1–5`);
        if (k.pow === undefined && k.heal === undefined && !k.fx && !k.revive && k.sp === undefined) E.push(`${where}/${k.name}: compétence sans effet`);
        (k.fx || []).forEach(f => {
          if (!D.FX.includes(f.st)) E.push(`${where}/${k.name}: fx.st « ${f.st} » invalide (${D.FX.join('|')})`);
          if (['atk', 'mag', 'def', 'spd'].includes(f.st) && f.v !== 1 && f.v !== -1) E.push(`${where}/${k.name}: fx ${f.st} exige v:1 ou v:-1`);
          // 2.20 — le temps volé (D.TEMPS) : réservé aux chimères, et ses nombres sont dans defs.js, jamais dans un récit
          if ((D.FX_TEMPS || []).includes(f.st)) {
            if (isHero) E.push(`${where}/${k.name}: fx ${f.st} — le temps volé est une attaque de chimère, jamais une vertu`);
            ['v', 'chance', 'turns', 'self'].forEach(x => { if (f[x] !== undefined) E.push(`${where}/${k.name}: fx ${f.st} ne porte pas « ${x} » : ses nombres sont dans D.TEMPS (defs.js)`); });
          }
        });
      };

      for (const [id, h] of Object.entries(heroes)) {
        const w = `héros ${id}`;
        if (h.stratege !== undefined && h.stratege !== true) E.push(`${w}: « stratege » vaut true ou s'omet`);
        req(h, 'name', 'string', w); req(h, 'arabic', 'string', w); garde(h.name, w); (h.skills || []).concat(h.limit || []).forEach(k => garde(k && k.name, w));
        pari(h.name, w, E); (h.skills || []).concat(h.limit || []).forEach(k => pari(k && k.name, w, E));   // 2.27 : ni un héros ni ce qu'il fait
        if (!D.ROLES[h.role]) E.push(`${w}: role « ${h.role} » invalide (${Object.keys(D.ROLES).join('|')})`);
        if (!D.ELEMENTS[h.el]) E.push(`${w}: el « ${h.el} » invalide`);
        if (req(h, 'look', 'object', w)) { ['robe', 'head'].forEach(k => req(h.look, k, 'string', w + '.look')); checkLook(h.look, w); }
        if (req(h, 'skills', 'array', w)) {
          if (h.skills.length < 3) E.push(`${w}: au moins 3 compétences`);
          const ids = new Set();
          h.skills.forEach(k => {
            checkSkill(k, w, true);
            if (typeof k.lvl !== 'number') E.push(`${w}/${k.id}: « lvl » manquant`);
            if (typeof k.cost !== 'number') E.push(`${w}/${k.id}: « cost » manquant`);
            if (ids.has(k.id)) E.push(`${w}: compétence en double ${k.id}`); ids.add(k.id);
          });
          if (!h.skills.some(k => k.lvl <= 1)) E.push(`${w}: aucune compétence au niveau 1`);
        }
        if (req(h, 'limit', 'object', w)) checkSkill(h.limit, w + '.limit', true);
      }

      for (const [id, e] of Object.entries(propres)) {
        const w = `ennemi ${id}`;
        if (e.vice !== undefined && (!commun || !D.VICES[e.vice] || e.vice !== id)) E.push(`${w}: « vice » réservé au contenu commun, et doit valoir l'identifiant d'un mal de D.VICES`);
        req(e, 'name', 'string', w);
        if (!D.ART.includes(e.art)) E.push(`${w}: art « ${e.art} » invalide (${D.ART.join('|')})`);
        if (!D.TIERS.includes(e.tier)) E.push(`${w}: tier « ${e.tier} » invalide`);
        // (2.23 : une chimère de l'histoire-cadre peut, comme celles du contenu commun, caler son niveau sur le groupe — lvl 0)
        { const cale = commun || (s.frame && !s.veillees); if (typeof e.lvl !== 'number' || e.lvl < (cale ? 0 : 1) || e.lvl > 12) E.push(`${w}: lvl ${cale ? '0 (calé sur le groupe) à 12' : '1–12'}`); }
        if (typeof e.hue !== 'number') E.push(`${w}: hue (0–360) manquant`);
        if (!Array.isArray(e.weak) || e.weak.length < 1) E.push(`${w}: weak[] manquant (au moins 1)`);
        (e.weak || []).concat(e.immune || []).forEach(x => { if (!D.ELEMENTS[x]) E.push(`${w}: élément « ${x} » invalide`); });
        if (typeof e.veils !== 'number' || e.veils < 1 || e.veils > 8) E.push(`${w}: veils 1–8`);
        (e.skills || []).forEach(k => checkSkill(k, w, false));
        (e.phases || []).forEach(p => {
          if (typeof p.at !== 'number' || p.at <= 0 || p.at >= 1) E.push(`${w}: phase.at doit être dans ]0,1[`);
          (p.addSkills || []).forEach(k => checkSkill(k, w + '.phase', false));
        });
        if (typeof e.desc !== 'string') E.push(`${w}: « desc » manquant`);
        // 2.0 : le moteur calcule les forces d'après le niveau et le palier ; un égrégore n'en fixe aucune (la 1.31 l'ignorait sans le dire)
        ['hp', 'sp', 'atk', 'mag', 'def', 'df', 'spd', 'xp', 'max'].forEach(k => { if (e[k] !== undefined) E.push(`${w}: « ${k} » — un égrégore ne fixe ni Constance ni dégâts : le moteur les calcule d'après son niveau et son palier`); });
        // l'organigramme du mal : la racine d'une idole est l'une des douze ; « idee » marque les cinq idées noires du contenu commun
        if (e.racine !== undefined && ![].concat(e.racine).every(r => D.RACINES.includes(r))) E.push(`${w}: racine « ${e.racine} » inconnue (${D.RACINES.join('|')})`);
        if (e.idee !== undefined && !(commun && D.NOIRS.includes(id) && e.idee === true)) E.push(`${w}: « idee » est réservé aux cinq idées noires du contenu commun (D.NOIRS)`);
        garde(e.name, w); (e.skills || []).forEach(k => garde(k && k.name, w)); (e.taunts || []).forEach(t => garde(t, w + ' (réplique)'));
        (e.phases || []).forEach(p => { garde(p.say, w + ' (phase)'); (p.addSkills || []).forEach(k => garde(k && k.name, w)); });
      }

      // 2.23 (D212) — les quartiers de la Cité : ce qui rôde dans leurs rues (D.CITE.rodent) est fait de petites chimères de
      // l'histoire-cadre, jamais d'une idée noire (D.NOIRS : elles pèsent sur une personne, on leur répond par la parole ;
      // exigences 16, 18, 22), ni d'un mal du cœur, ni d'une idole ; et ce qu'on y dit (`cite`) est de la fiction : ni verset, ni
      // parole citée
      if (s.frame && !s.veillees && (s.chapters || []).some(c => c && c.visite === 'quartiers')) {
        Object.keys((D.CITE && D.CITE.rodent) || {}).forEach(k => { const e = propres[k], w = `D.CITE.rodent ${k}`;
          if (D.NOIRS.includes(k) || (e && e.idee)) { E.push(`${w}: une idée noire ne rôde pas dans les rues des quartiers`); return; }
          if (!e) { E.push(`${w}: chimère inconnue de l'histoire-cadre`); return; }
          if (e.tier !== 'minion' || e.vice) E.push(`${w}: seulement de petites chimères (tier « minion »), ni mal du cœur ni idole`);
          if (e.racine !== undefined && [].concat(e.racine).some(r => D.NOIRS.includes(r))) E.push(`${w}: sa racine est une idée noire`);
          if (!(typeof D.CITE.rodent[k] === 'number' && D.CITE.rodent[k] > 0)) E.push(`${w}: un poids > 0`); });
        const Q = s.cite || {}, liste = (k, a, b) => { if (!Array.isArray(Q[k]) || Q[k].length < a || Q[k].length > b || Q[k].some(t => typeof t !== 'string' || !t.trim())) E.push(`cite.${k}: de ${a} à ${b} textes`); };
        ['seul', 'question'].forEach(k => { if (typeof Q[k] !== 'string' || !Q[k].trim()) E.push(`cite.${k}: texte manquant`); });
        liste('rappels', 3, 10); liste('yunus', 6, 8);
        ['rappels', 'yunus'].forEach(k => (Q[k] || []).forEach((t, i) => { if (/[«»]|Coran|\d+:\d+/.test(String(t))) E.push(`cite.${k}[${i}]: ni verset ni parole citée (un texte de fiction)`); garde(t, `cite.${k}`); }));
        verifierCourse(Q.course, E);
        verifierActivites(Q.activites, E);   // 2.28 (D217)
      }

      (s.codex || []).forEach(c => {
        const w = `codex ${c.id}`;
        ['id', 'title', 'text'].forEach(k => req(c, k, 'string', w));
        if (!D.CODEX_CATS.includes(c.cat)) E.push(`${w}: cat « ${c.cat} » invalide (${D.CODEX_CATS.join('|')})`);
        if (c.avant !== undefined && (typeof c.avant !== 'string' || !c.avant.trim())) E.push(`${w}: « avant » est le texte de la fiche tant que le nom de l'Agrégor n'est pas reçu (D240) : une chaîne`);
      });
      verifierNomAgregor(s, E);   // 2.48 (D240)

      if (commun) {
        // le cœur : chaque œuvre, chaque lame, chaque compagnon de lumière a son texte ; chaque mal a son égrégore
        const T = s.oeuvres || {}, L = s.lames || {}, A = s.animaux || {};
        D.OEUVRES.forEach(k => { const o = T[k]; if (!o) { E.push(`œuvre ${k}: texte manquant`); return; } ['name', 'court', 'glyph', 'desc'].forEach(x => req(o, x, 'string', `œuvre ${k}`)); if (k !== 'priere') { req(o, 'menu', 'string', `œuvre ${k}`); if (!Array.isArray(o.lignes) || !o.lignes.length || o.lignes.some(l => typeof l !== 'string')) E.push(`œuvre ${k}: « lignes » manquantes`); } });
        if (T.aumone && typeof T.aumone.prix !== 'number') E.push('œuvre aumone: « prix » manquant'); if (T.jeune && typeof T.jeune.fin !== 'string') E.push('œuvre jeune: « fin » manquant');
        Object.keys(T).forEach(k => { if (!D.OEUVRES.includes(k)) E.push(`œuvre ${k}: inconnue de D.OEUVRES`); });
        Object.keys(D.VICES).forEach(v => { const l = L[v]; if (!l) E.push(`lame ${v}: texte manquant`); else ['name', 'ar', 'couleur', 'texte'].forEach(x => req(l, x, 'string', `lame ${v}`)); if (!propres[v] || propres[v].vice !== v) E.push(`mal ${v}: égrégore manquant (enemies.${v} avec vice: '${v}')`); if (!D.OEUVRES.includes(D.VICES[v].oeuvre)) E.push(`mal ${v}: œuvre inconnue`); });
        D.ANIMAUX.forEach(a => { const x = A[a]; if (!x) E.push(`compagnon de lumière ${a}: texte manquant`); else ['name', 'ar', 'couleur', 'don', 'effet', 'vient', 'texte'].forEach(k => req(x, k, 'string', `compagnon de lumière ${a}`)); });
        // les idées noires : on leur répond (deux voiles, et pour chacun la manière qui porte) ; l'organigramme : six rangs
        D.NOIRS.forEach(n => { const e = propres[n], X = e && e.parole, V = Object.keys(D.VOIES);
          if (!e || e.idee !== true) { E.push(`idée noire ${n}: égrégore manquant (enemies.${n} avec idee: true)`); return; }
          if (!X || !Array.isArray(X.voies) || X.voies.length !== 2 || X.voies[0] === X.voies[1] || X.voies.some(v => !D.VOIES[v])) { E.push(`idée noire ${n}: parole.voies attend deux manières différentes (${V.join('|')})`); return; }
          if (!Array.isArray(X.dit) || X.dit.length !== 2 || X.dit.some(t => typeof t !== 'string')) E.push(`idée noire ${n}: parole.dit attend deux répliques`);
          V.forEach(v => { if (!X.rep || typeof X.rep[v] !== 'string') E.push(`idée noire ${n}: parole.rep.${v} manquant`); if (!X.non || typeof X.non[v] !== 'string') E.push(`idée noire ${n}: parole.non.${v} manquant (une manière qui ne porte pas reçoit une explication)`); });
          if (X.oui !== undefined && (!Array.isArray(X.oui) || X.oui.length !== 2 || X.oui.some(t => typeof t !== 'string'))) E.push(`idée noire ${n}: parole.oui attend deux lignes`); });
        { const Ml = s.mal || {}, Rg = Ml.rangs || {};
          ['iblis', 'souffleurs', 'coeur', 'racines', 'egregores', 'idoles'].forEach(k => { const r = Rg[k]; if (!r) { E.push(`organigramme: rang « ${k} » manquant`); return; } ['name', 'sous', 'texte', 'reponse'].forEach(x => req(r, x, 'string', `organigramme ${k}`)); if (!['enseigne', 'image'].includes(r.etage)) E.push(`organigramme ${k}: etage vaut 'enseigne' ou 'image'`); });
          ['iblis', 'souffleurs'].forEach(k => { if (Rg[k] && typeof Rg[k].src !== 'string') E.push(`organigramme ${k}: « src » requis (ce rang relève de ce qui est enseigné : il cite sa référence)`); });
          ['titre', 'chapeau', 'couture'].forEach(x => req(Ml, x, 'string', 'organigramme')); }
        if ((s.chapters || []).length) E.push(`${W0}: un contenu commun n'a pas de chapitres`);
        return;
      }

      const chIds = new Set();
      (s.chapters || []).forEach((c, ci) => {
        const w = `chapitre ${c.id || ci}`;
        ['id', 'title', 'sub', 'map', 'start'].forEach(k => req(c, k, 'string', w));
        if (chIds.has(c.id)) E.push(`${w}: id en double`); chIds.add(c.id);
        if (!D.MAPS[c.map]) { E.push(`${w}: carte « ${c.map} » inconnue`); return; }
        if (!D.MAPS[c.map].spots.includes(c.start)) E.push(`${w}: start « ${c.start} » absent de la carte ${c.map}`);
        if (c.opts && c.opts.time && !D.TIMES.includes(c.opts.time)) E.push(`${w}: opts.time invalide`);
        if (req(c, 'party', 'array', w)) {
          if (c.party.length < 1 || c.party.length > 3) E.push(`${w}: party de 1 à 3 héros`);
          c.party.forEach(p => { if (!heroes[p]) E.push(`${w}: héros « ${p} » inconnu dans party`); });
        }
        const npcIds = new Set(), foeIds = new Set(), meneurs = [];
        const npcMap = {};
        if (c.hajj !== undefined && c.hajj !== true) E.push(`${w}: « hajj » vaut true ou s'omet`);
        if (c.vice !== undefined && (!D.VICES[c.vice] || !c.after || !s.frame)) E.push(`${w}: « vice » annonce le mal du cœur d'une rencontre (chapitre « after » de l'histoire-cadre) et doit figurer dans D.VICES`);
        if (c.hajj && !s.veillees) E.push(`${w}: le pèlerinage n'est proposé que dans la fiction des veillées`);
        // 2.x : ce qui se joue au retour en 2084 (« retour: n ») et une visite ouverte depuis la Chaîne (« visite ») — l'histoire-cadre seulement
        if (c.retour !== undefined && !(Number.isInteger(c.retour) && c.retour >= 1 && s.frame && !s.veillees && c.last === true && !c.after)) E.push(`${w}: « retour » est un entier ≥ 1, sur un chapitre « last » de l'histoire-cadre, sans « after »`);
        if (c.visite !== undefined && !(typeof c.visite === 'string' && (c.visite === c.map || (c.npcs || []).some(n => n && n.map === c.visite)) && s.frame && !s.veillees && c.last === true && !c.after && c.retour === undefined)) E.push(`${w}: « visite » nomme un lieu du chapitre (sa carte, ou celle où il pose des personnages), sur un chapitre « last » de l'histoire-cadre, sans « after » ni « retour »`);
        // la bataille déclarée : les rangs que la mission aligne, les ordres qu'elle permet. Aucun effectif (exigence 19).
        if (c.bataille !== undefined) { const Bt = c.bataille || {}, wb = `${w}.bataille`;
          if (!Array.isArray(Bt.rangs) || Bt.rangs.length > 4) E.push(`${wb}: « rangs » attend un tableau de 0 à 4 rangs`);
          (Array.isArray(Bt.rangs) ? Bt.rangs : []).forEach((r, i) => { if (!r || !D.RANGS[r.t]) { E.push(`${wb}: rang ${i} : type inconnu (${Object.keys(D.RANGS).join('|')})`); return; }
            if (r.name !== undefined) { if (typeof r.name !== 'string') E.push(`${wb}: rang ${i} : « name » doit être une chaîne`); else { garde(r.name, wb); if (/\d/.test(r.name)) E.push(`${wb}: rang ${i} : aucun effectif dans le nom d'un rang (exigence 19)`); } }
            if (r.voie !== undefined && !['nord', 'centre', 'sud'].includes(r.voie)) E.push(`${wb}: rang ${i} : « voie » vaut nord, centre ou sud`);
            if (r.ligne !== undefined && r.ligne !== 0 && r.ligne !== 1) E.push(`${wb}: rang ${i} : « ligne » vaut 0 (au camp) ou 1 (en première ligne)`);
            if (r.ligne !== undefined && r.voie === undefined) E.push(`${wb}: rang ${i} : « ligne » ne va pas sans « voie »`);
            if (r.look) checkLook(r.look, wb); });
          { const vues = {}; (Array.isArray(Bt.rangs) ? Bt.rangs : []).forEach((r, i) => { if (!r || !r.voie) return; const k = r.voie + '/' + (r.ligne === 0 ? 0 : 1); if (vues[k] !== undefined) E.push(`${wb}: rangs ${vues[k]} et ${i} à la même place (${k})`); vues[k] = i; }); }
          if (Bt.ordres !== undefined && (!Array.isArray(Bt.ordres) || Bt.ordres.some(o => !D.ORDRES[o]))) E.push(`${wb}: « ordres » inconnus (${Object.keys(D.ORDRES).join('|')})`);
          if (Array.isArray(Bt.ordres) && !Bt.ordres.includes('tenir')) E.push(`${wb}: « ordres » garde au moins « tenir »`);
          if (Bt.base !== undefined && !(Number.isInteger(Bt.base) && Bt.base >= 0 && Bt.base <= 4)) E.push(`${wb}: « base » vaut de 0 à 4`);
          if (Bt.mot !== undefined && typeof Bt.mot !== 'string') E.push(`${wb}: « mot » doit être une chaîne`);
          if (Array.isArray(Bt.rangs) && !Bt.rangs.length && typeof Bt.mot !== 'string') E.push(`${wb}: une bataille sans rangs dit pourquoi (« mot »)`); }
        const checkAt = (at, mapId, where) => {
          const spot = Array.isArray(at) ? at[0] : at;
          if (!D.MAPS[mapId]) { E.push(`${where}: carte « ${mapId} » inconnue`); return; }
          if (!D.MAPS[mapId].spots.includes(spot)) E.push(`${where}: lieu « ${spot} » absent de la carte ${mapId} (${D.MAPS[mapId].spots.join(', ')})`);
          if (Array.isArray(at) && (typeof at[1] !== 'number' || typeof at[2] !== 'number')) E.push(`${where}: at doit être 'spot' ou ['spot', dx, dy]`);
        };
        (c.npcs || []).forEach(n => {
          const wn = `${w}/pnj ${n.id}`;
          req(n, 'id', 'string', wn); req(n, 'name', 'string', wn); garde(n.name, wn);
          if (npcIds.has(n.id)) E.push(`${wn}: id en double`); npcIds.add(n.id);
          npcMap[n.id] = n.map || c.map;
          checkAt(n.at, n.map || c.map, wn);
          // 2.23 : un PNJ peut se tourner (face) et prendre une attitude (pose) dès qu'il paraît
          if (n.face !== undefined && !['down', 'left', 'right', 'up'].includes(n.face)) E.push(`${wn}: « face » vaut down, left, right ou up`);
          if (n.pose !== undefined && !D.POSES.includes(n.pose)) E.push(`${wn}: pose « ${n.pose} » inconnue (${D.POSES.join('|')})`);
          if (!n.hero) {
            if (!n.look || typeof n.look !== 'object') E.push(`${wn}: « look » manquant (ou hero:'id')`);
            else { if (n.look.kind && !D.NPC_KINDS.includes(n.look.kind)) E.push(`${wn}: look.kind « ${n.look.kind} » invalide`); checkLook(n.look, wn); }
          } else if (!heroes[n.hero]) E.push(`${wn}: hero « ${n.hero} » inconnu`);
        });
        (c.foes || []).forEach(f => { (f.group || []).forEach(g => { if (D.NOIRS.includes(g)) E.push(`${w} ennemi « ${f.id} »: une idée noire (« ${g} ») ne se place pas parmi les ennemis d’un chapitre`); }); // 2.x
          const wf = `${w}/foe ${f.id}`;
          req(f, 'id', 'string', wf);
          if (foeIds.has(f.id)) E.push(`${wf}: id en double`); foeIds.add(f.id);
          checkAt(f.at, f.map || c.map, wf);
          if (!Array.isArray(f.group) || !f.group.length || f.group.length > 4) E.push(`${wf}: group de 1 à 4 ennemis`);
          (f.group || []).forEach(g => { if (!enemies[g]) E.push(`${wf}: ennemi « ${g} » inconnu`); });
          if (f.bg && !D.BATTLE_BG.includes(f.bg)) E.push(`${wf}: bg invalide`);
          if (f.boss) meneurs.push([f.group || [], wf]);
        });
        (c.chests || []).forEach((x, i) => {
          checkAt(x.at, x.map || c.map, `${w}/coffre ${i}`);
          if (x.codex !== undefined) { if (!codexIds.has(x.codex)) E.push(`${w}/coffre ${i}: codex « ${x.codex} » inconnu`); }
          else if (x.gear !== undefined) { if (!D.GEAR[x.gear]) E.push(`${w}/coffre ${i}: pièce d'équipement « ${x.gear} » inconnue`); if (x.item !== undefined) E.push(`${w}/coffre ${i}: « gear » ou « item », pas les deux`); }
          else if (!D.ITEMS[x.item]) E.push(`${w}/coffre ${i}: objet « ${x.item} » inconnu`);
        });

        // Vérification des scripts, en suivant la carte courante.
        const state = { map: c.map }; const sites = new Set();
        const checkOps = (ops, where) => {
          if (!Array.isArray(ops)) { E.push(`${where}: script doit être un tableau`); return; }
          ops.forEach((o, i) => {
            const wo = `${where}[${i}]`;
            if (!Array.isArray(o) || typeof o[0] !== 'string') { E.push(`${wo}: opération invalide`); return; }
            const def = D.OPS[o[0]];
            if (!def) { E.push(`${wo}: opération « ${o[0]} » inconnue`); return; }
            const n = o.length - 1;
            if (n < def[0] || n > def[1]) E.push(`${wo}: « ${o[0]} » attend ${def[0]}–${def[1]} argument(s), reçu ${n}`);
            switch (o[0]) {
              case 'say': garde(o[1], wo); if (typeof o[1] !== 'string' || typeof o[2] !== 'string') E.push(`${wo}: say(speaker, texte)`);
                else if (o[2].length > 330) W.push(`${wo}: réplique longue (${o[2].length} car.) — couper en deux`); break;
              case 'nar': if (typeof o[1] !== 'string') E.push(`${wo}: nar(texte)`);
                else if (o[1].length > 360) W.push(`${wo}: narration longue (${o[1].length} car.)`); break;
              case 'quote': if (typeof o[1] !== 'string' || typeof o[2] !== 'string') E.push(`${wo}: quote(texte, source)`); break;
              case 'choice': case 'ask': {
                if (typeof o[1] !== 'string' || !Array.isArray(o[2]) || o[2].length < 2 || o[2].length > 4) { E.push(`${wo}: ${o[0]}(prompt, [2–4 options])`); break; }
                if (o[0] === 'choice' && o[2].filter(c => c.ok === true).length !== 1) E.push(`${wo}: choice exige exactement une option ok:true`);
                o[2].forEach((c, j) => {
                  if (typeof c.t !== 'string') E.push(`${wo}: option ${j} sans texte « t »`); else pari(c.t, `${wo}: option ${j}`, E);
                  if (o[0] === 'choice' && !c.ok && (!Array.isArray(c.r) || !c.r.length)) E.push(`${wo}: option fausse ${j} doit avoir une réponse r:[...] qui explique`);
                  if (c.need !== undefined && (o[0] !== 'ask' || !codexIds.has(c.need))) E.push(`${wo}: option ${j} : need « ${c.need} » invalide (réservé à ask, id de codex)`);
                  if (c.r) checkOps(c.r, `${wo}.opt${j}`);
                });
                break;
              }
              case 'vices': {
                const v = o[1] || {};
                if (!s.frame) E.push(`${wo}: les maux du cœur ne se dressent que dans l'histoire-cadre`);
                if (v.bg && !D.BATTLE_BG.includes(v.bg)) E.push(`${wo}: bg « ${v.bg} » invalide`);
                ['avant', 'aucun', 'tous', 'reste'].forEach(k => { if (v[k] !== undefined) checkOps(v[k], `${wo}.${k}`); });
                break;
              }
              case 'battle': {
                const b = o[1] || {};
                if (!Array.isArray(b.group) || !b.group.length || b.group.length > 4) E.push(`${wo}: battle.group de 1 à 4`);
                (b.group || []).forEach(g => { if (!enemies[g]) E.push(`${wo}: ennemi « ${g} » inconnu`); });
                (b.group || []).forEach(g => { if (D.NOIRS.includes(g)) E.push(`${wo}: une idée noire (« ${g} ») ne se combat pas dans un récit : on lui répond, dans un pourparler ; elle ne prend corps que dans la descente du râwî`); }); // 2.x
                if (b.bg && !D.BATTLE_BG.includes(b.bg)) E.push(`${wo}: bg « ${b.bg} » invalide`);
                (b.allies || []).forEach(al => { if (!al || typeof al.flag !== 'string' || typeof al.name !== 'string') E.push(`${wo}: battle.allies attend [{flag, name}]`);
                  else { garde(al.name, wo); if (al.rang !== undefined && !D.RANGS[al.rang]) E.push(`${wo}: battle.allies : « rang » inconnu (${Object.keys(D.RANGS).join('|')})`); if (al.look) checkLook(al.look, wo); } });
                if (b.boss) meneurs.push([b.group || [], wo]);
                break;
              }
              case 'map':
                if (!D.MAPS[o[1]]) E.push(`${wo}: carte « ${o[1]} » inconnue`);
                else { state.map = o[1]; checkAt(o[2], o[1], wo); }
                if (o[3] && o[3].time && !D.TIMES.includes(o[3].time)) E.push(`${wo}: time invalide`);
                if (o[3] && ['g', 'n', 'descente'].some(k => o[3][k] !== undefined)) E.push(`${wo}: « g », « n » et « descente » sont réservés au moteur (le labyrinthe de la noosphère se tire tout seul ; la descente est celle du râwî)`); // 2.x
                break;
              case 'tp': case 'walk': {
                const who = o[1];
                if (who !== 'hero' && !npcIds.has(who)) E.push(`${wo}: « ${who} » n'est ni 'hero' ni un pnj du chapitre`);
                checkAt(o[2], who === 'hero' ? state.map : (npcMap[who] || state.map), wo);
                break;
              }
              case 'face': if (o[1] !== 'hero' && !npcIds.has(o[1])) E.push(`${wo}: pnj « ${o[1]} » inconnu`);
                if (!['up', 'down', 'left', 'right'].includes(o[2])) E.push(`${wo}: face dir up|down|left|right`); break;
              case 'show': case 'hide': if (!npcIds.has(o[1])) E.push(`${wo}: pnj « ${o[1]} » inconnu`); break;
              case 'fade': if (!['in', 'out'].includes(o[1])) E.push(`${wo}: fade in|out`); break;
              case 'sfx': if (!D.SFX.includes(o[1])) E.push(`${wo}: sfx « ${o[1]} » invalide (${D.SFX.join('|')})`); break;
              case 'give': if (!D.ITEMS[o[1]] && !D.GEAR[o[1]]) E.push(`${wo}: objet ou pièce d'équipement « ${o[1]} » inconnu (${Object.keys(D.ITEMS).join('|')}, ou une pièce de D.GEAR)`); break;
              case 'join': case 'leave': if (!heroes[o[1]]) E.push(`${wo}: héros « ${o[1]} » inconnu`); break;
              case 'codex': if (!codexIds.has(o[1])) E.push(`${wo}: entrée de codex « ${o[1]} » inconnue`); break;
              case 'if': checkOps(o[2], wo + '.then'); if (o[3]) checkOps(o[3], wo + '.else'); break;
              // les drapeaux « _2084_… » disent l'état de 2084 (veillées, maillons, nom de l'Agrégor reçu, étape) : le moteur les pose,
              // un récit — saga, histoire-cadre, veillée ou paquet — les lit par « if », il ne les écrit jamais (2.48, D240)
              case 'flag': if (typeof o[1] !== 'string' || !o[1]) E.push(`${wo}: flag(nom)`); else if (/^_2084_/.test(o[1])) E.push(`${wo}: le drapeau « ${o[1]} » est posé par le moteur (l'état de 2084) : un récit le lit par « if », il ne l'écrit pas`); break;
              case 'emote': if (o[2] !== null && !D.POSES.includes(o[2])) E.push(`${wo}: pose « ${o[2]} » inconnue (${D.POSES.join('|')}, ou null pour la quitter)`); break;
              case 'pray': if (o[1] !== undefined && !D.PRAYERS[o[1]]) E.push(`${wo}: pray « ${o[1]} » invalide (${Object.keys(D.PRAYERS).join('|')})`); break;
              case 'pillar': if (!D.PILLARS[o[1]]) E.push(`${wo}: pilier « ${o[1]} » invalide (${Object.keys(D.PILLARS).join('|')})`); if (typeof o[2] !== 'number' || Math.abs(o[2]) > 2 || !o[2]) E.push(`${wo}: pillar delta ±1 ou ±2`); break;
              case 'mat': if (!D.MATS[o[1]]) E.push(`${wo}: matériau « ${o[1]} » inconnu (${Object.keys(D.MATS).join('|')})`); break;
              case 'site': { const st = o[1] || {}; ['id', 'name'].forEach(k => { if (typeof st[k] !== 'string') E.push(`${wo}: site.${k} manquant`); }); checkAt(st.at, state.map, wo); if (!st.need || Object.keys(st.need).some(k => !D.PIECES[k])) E.push(`${wo}: site.need doit lister des pièces connues`); Object.keys(st.give || {}).forEach(k => { if (!D.MATS[k]) E.push(`${wo}: site.give : matériau « ${k} » inconnu`); }); sites.add(st.id); break; }
              case 'lore': if (!D.LORE.includes(o[1])) E.push(`${wo}: savoir commun « ${o[1]} » inconnu (${D.LORE.join('|')})`); break;
              case 'mus': if (!D.TRACKS.includes(o[1])) E.push(`${wo}: piste « ${o[1]} » inconnue (${D.TRACKS.join('|')})`); break;
              case 'parley': {
                const P = o[1] || {};
                ['with', 'title', 'intro'].forEach(k => { if (typeof P[k] !== 'string') E.push(`${wo}: parley.${k} manquant`); }); garde(P.with, wo);
                if (typeof P.goal !== 'number') E.push(`${wo}: parley.goal manquant`);
                if (!Array.isArray(P.rounds) || P.rounds.length < 3 || P.rounds.length > 5) { E.push(`${wo}: parley.rounds de 3 à 5 manches`); break; }
                let max = 0, maxFree = 0, min = 0;
                P.rounds.forEach((r, ri) => {
                  if (typeof r.say !== 'string') E.push(`${wo}: manche ${ri} sans « say »`);
                  let noirV = 0;
                  if (r.noir !== undefined) {
                    const N = r.noir || {}; noirV = N.v === undefined ? 1 : N.v;
                    ['name', 'intro'].forEach(k => { if (typeof N[k] !== 'string') E.push(`${wo}: manche ${ri} : noir.${k} manquant`); });
                    ['say', 'after'].forEach(k => { if (N[k] !== undefined && typeof N[k] !== 'string') E.push(`${wo}: manche ${ri} : noir.${k} doit être une chaîne`); });
                    if (!Array.isArray(N.group) || !N.group.length || N.group.length > 3) E.push(`${wo}: manche ${ri} : noir.group de 1 à 3`);
                    (N.group || []).forEach(g => { if (!enemies[g]) E.push(`${wo}: manche ${ri} : idée noire « ${g} » inconnue`); else if (enemies[g].vice || enemies[g].tier === 'boss') E.push(`${wo}: manche ${ri} : une idée noire n'est ni une idole ni un mal du cœur`); });
                    if (typeof noirV !== 'number' || noirV < 1 || noirV > 2) E.push(`${wo}: manche ${ri} : noir.v vaut 1 ou 2`);
                    { const ids = (N.group || []).filter(g => enemies[g]), nI = ids.filter(g => enemies[g].idee).length; if (nI && (nI !== ids.length || ids.length !== 1)) E.push(`${wo}: manche ${ri} : une manche « noir » porte une seule idée noire (on lui répond), ou bien des égrégores (on les combat)`); }
                    if (N.bg && !D.BATTLE_BG.includes(N.bg)) E.push(`${wo}: manche ${ri} : noir.bg invalide`);
                  }
                  if (!Array.isArray(r.opts) || r.opts.length < 2 || r.opts.length > 4) { E.push(`${wo}: manche ${ri} : 2 à 4 options`); return; }
                  let m = -9, mf = -9, mn = 9;
                  r.opts.forEach((x, xi) => {
                    if (typeof x.t !== 'string' || typeof x.r !== 'string') E.push(`${wo}: manche ${ri} option ${xi} : « t » et « r » (réplique) requis`); else pari(x.t, `${wo}: manche ${ri} option ${xi}`, E);
                    if (typeof x.v !== 'number' || x.v < -2 || x.v > 3) E.push(`${wo}: manche ${ri} option ${xi} : v entre -2 et 3`);
                    if (!D.ELEMENTS[x.el] || x.el === 'fer') E.push(`${wo}: manche ${ri} option ${xi} : el doit être une Lumière`);
                    if (x.need !== undefined && !(String(x.need).indexOf('/') > 0 ? savoirConnu(x.need) : codexIds.has(x.need))) E.push(`${wo}: manche ${ri} option ${xi} : need « ${x.need} » absent du codex`);
                    m = Math.max(m, x.v); if (x.need === undefined) mf = Math.max(mf, x.v); mn = Math.min(mn, x.v);
                  });
                  if (mf === -9) E.push(`${wo}: manche ${ri} : au moins une option sans « need »`);
                  max += m + noirV; maxFree += Math.max(mf, -2) + noirV; min += mn + noirV;
                });
                if (P.goal > max) E.push(`${wo}: parley.goal ${P.goal} inatteignable (max ${max})`);
                if (P.goal > maxFree + 1) W.push(`${wo}: parley gagnable seulement avec un savoir (max sans savoir ${maxFree}, +1 si prière)`);
                if (P.goal <= min) E.push(`${wo}: parley.goal ${P.goal} toujours atteint (min ${min})`);
                if (!Array.isArray(P.win) || !Array.isArray(P.lose)) E.push(`${wo}: parley.win et parley.lose (tableaux d'ops) requis`);
                else { const sm = state.map; checkOps(P.win, wo + '.win'); const m1 = state.map; state.map = sm; checkOps(P.lose, wo + '.lose'); if (state.map !== m1) E.push(`${wo}: win et lose doivent finir sur la même carte`); }
                break;
              }
              case 'light': if (!D.ELEMENTS[o[1]]) E.push(`${wo}: lumière « ${o[1]} » inconnue`); break;
            }
          });
        };
        if (c.intro) checkOps(c.intro, `${w}.intro`);
        if (c.enigme !== undefined) {
          const en = c.enigme, we = `${w}.enigme`;
          ['id', 'who', 'title', 'signe', 'mot'].forEach(k => req(en, k, 'string', we));
          if (!heroes[en.who] || !(c.party || []).includes(en.who)) E.push(`${we}: « who » doit être un héros du groupe de ce chapitre`);
          if (!s.frame) E.push(`${we}: une énigme ne touche qu'un personnage de fiction (histoire-cadre ou veillées), jamais un Compagnon`);
          if (!D.OEUVRES.includes(en.cure) || en.cure === 'hajj') E.push(`${we}: cure « ${en.cure} » doit être une œuvre (${D.OEUVRES.filter(k => k !== 'hajj').join('|')})`);
          if (!D.MAPS[c.map].spots.includes('priere')) E.push(`${we}: la carte ${c.map} n'a pas de tapis où accomplir l'œuvre`);
          { const save = state.map; if (en.intro) checkOps(en.intro, `${we}.intro`); if (en.solved) checkOps(en.solved, `${we}.solved`); state.map = save; }
        }
        if (!Array.isArray(c.objectives) || !c.objectives.length) E.push(`${w}: objectives[] manquant`);
        (c.objectives || []).forEach((o, i) => {
          const wo = `${w}.obj${i}`;
          const kinds = ['goto', 'talk', 'foe', 'auto', 'build'].filter(k => o[k] !== undefined);
          if (kinds.length !== 1) E.push(`${wo}: exactement un parmi goto|talk|foe|auto|build`);
          if (o.build !== undefined) { const bd = o.build; if (bd.site !== undefined) { if (!sites.has(bd.site)) E.push(`${wo}: site « ${bd.site} » non ouvert par un ['site', …] auparavant`); } else if (!D.PIECES[bd.piece] || typeof bd.n !== 'number') E.push(`${wo}: build attend { piece, n } ou { site }`); }
          if (!o.auto && typeof o.text !== 'string') E.push(`${wo}: « text » manquant`);
          if (o.hint !== undefined && typeof o.hint !== 'string') E.push(`${wo}: « hint » doit être une chaîne`);
          if (o.goto !== undefined) checkAt(o.goto, state.map, wo);
          if (o.talk !== undefined) {
            if (!npcIds.has(o.talk)) E.push(`${wo}: pnj « ${o.talk} » inconnu`);
            else if (npcMap[o.talk] !== state.map) E.push(`${wo}: le pnj « ${o.talk} » est sur la carte ${npcMap[o.talk]} mais le héros est sur ${state.map} à ce moment`);
          }
          if (o.foe !== undefined) {
            const f = (c.foes || []).find(f => f.id === o.foe);
            if (!f) E.push(`${wo}: foe « ${o.foe} » inconnu`);
            else if ((f.map || c.map) !== state.map) E.push(`${wo}: le foe « ${o.foe} » est sur ${f.map || c.map} mais le héros est sur ${state.map}`);
          }
          if (o.then) checkOps(o.then, `${wo}.then`);
        });
        if (c.outro) checkOps(c.outro, `${w}.outro`);
        (c.npcs || []).forEach(n => { if (n.talk) { const save = state.map; checkOps(n.talk, `${w}/pnj ${n.id}.talk`); state.map = save; } });
        if (c.bataille !== undefined && !meneurs.length) E.push(`${w}: « bataille » sans combat d'idole (boss: true) dans ce chapitre`);
        // l'idole d'un combat lancé avec boss: true (son membre de plus haut palier, maux du cœur exceptés) dit sa racine
        { const PAL = { boss: 3, elite: 2, minion: 1 };
          meneurs.forEach(([g, where]) => { const t = g.filter(x => enemies[x]).sort((a, b) => (PAL[enemies[b].tier] || 0) - (PAL[enemies[a].tier] || 0))[0]; if (t && !enemies[t].vice && enemies[t].racine === undefined) E.push(`${where}: l'idole « ${t} » n'a pas de « racine » (${D.RACINES.join('|')})`); }); }
      });
      // intro/outro de saga : pas de carte (cartons narratifs uniquement)
      const flat = ops => (ops || []).forEach((o, i) => {
        if (!Array.isArray(o) || !['nar', 'quote', 'title', 'say', 'wait', 'sfx', 'codex', 'light', 'flash', 'fade', 'tint', 'mus', 'pillar'].includes(o[0]))
          E.push(`${W0}.intro/outro[${i}]: seules nar|quote|title|say|wait|sfx|codex|light|flash|fade|tint|mus|pillar sont permises ici`);
        if (o[0] === 'codex' && !codexIds.has(o[1])) E.push(`${W0}.intro/outro[${i}]: codex « ${o[1]} » inconnu`);
      });
      flat(s.intro); flat(s.outro);
      if ((s.chapters || []).length < 3) W.push(`${W0}: moins de 3 chapitres`);
    }

    // la musique : chaque voix d'une piste dure exactement `beats` temps ; chaque piste de D.TRACKS existe
    function verifierPistes(tracks, opt) {
      const E = [];
      const PITCH = /^[A-G](#|b)?[1-7]$/, DR = /^[DTtrkbmshca]$/;   // percussions : dum, tek, tek léger, riq, grosse caisse, grand tambour, tom, caisse claire, charleston, cymbale, enclume
      for (const [name, t] of Object.entries(tracks)) {
        if (!D.TRACKS.includes(name)) E.push(`${name}: piste inconnue (${D.TRACKS.join('|')})`);
        if (typeof t.bpm !== 'number' || t.bpm < 40 || t.bpm > 220) E.push(`${name}: bpm 40–220`);
        if (typeof t.beats !== 'number' || t.beats < 4 || t.beats > 128) E.push(`${name}: beats 4–128`);
        if (t.intro !== undefined && !(typeof t.intro === 'number' && t.intro >= 0 && t.intro <= t.beats - 4 && Math.abs(t.intro * 2 - Math.round(t.intro * 2)) < 1e-9)) E.push(`${name}: intro, en temps, par demi-temps, de 0 à beats − 4`);
        if (!Array.isArray(t.voices) || t.voices.length < 1 || t.voices.length > 8) { E.push(`${name}: 1 à 8 voix`); continue; }
        t.voices.forEach((v, i) => {
          if (!D.WAVES.includes(v.wave)) E.push(`${name} voix ${i}: wave « ${v.wave} » invalide (${D.WAVES.join('|')})`);
          if (typeof v.vol !== 'number' || v.vol <= 0 || v.vol > 1) E.push(`${name} voix ${i}: vol ]0,1]`);
          if (v.pan !== undefined && !(typeof v.pan === 'number' && v.pan >= -1 && v.pan <= 1)) E.push(`${name} voix ${i}: pan de −1 à 1`);
          let sum = 0, sounding = 0; const toks = String(v.notes || '').trim().split(/\s+/);
          toks.forEach((tk, k) => {
            const m = tk.match(/^(.+)\/(\d*\.?\d+)$/); if (!m) { E.push(`${name} voix ${i} jeton ${k} « ${tk} » : attendu note/durée`); return; }
            const len = parseFloat(m[2]); if (!(len >= 0.125 && len <= 16)) E.push(`${name} voix ${i} jeton ${k}: durée 0.125–16`); sum += len;
            if (m[1] === '-') return; sounding++;
            m[1].split('+').forEach(n => { if (!(v.wave === 'drums' ? DR.test(n) : PITCH.test(n))) E.push(`${name} voix ${i} jeton ${k}: « ${n} » invalide`); });
          });
          if (!sounding) E.push(`${name} voix ${i} (${v.wave}): aucune note`);
          if (Math.abs(sum - t.beats) > 0.001) E.push(`${name} voix ${i} (${v.wave}): dure ${sum} temps, attendu ${t.beats}`);
        });
      }
      const miss = opt && opt.partiel ? [] : D.TRACKS.filter(n => n !== 'silence' && !tracks[n]);   // 2.0 : « partiel » pour les pistes d'un paquet
      if (miss.length) E.push('pistes absentes : ' + miss.join(', '));
      return E;
    }

    // 2.0 — les objets de la besace qu'un paquet apporte : des effets que le moteur connaît, dans leurs bornes, et des mots
    // sobres. Un objet soigne, relève ou rend du Souffle ; il ne porte ni nom divin, ni vertu, ni rien de sacré changé en
    // pouvoir (exigences 8, 15 et 17). Les pièces d'équipement du paquet passent la même garde des mots.
    function verifierObjets(objets, pieces) {
      const E = [], PARTS = ['hp', 'sp', 'revive'], CLES = ['name', 'desc', 'hp', 'sp', 'revive', 'cleanse', 'niyya', 'target', 'vivre', 'paquet'];
      const SACRE = /allah|dieu|proph|bén[ie]|sacr|saint|relique|talisman|amulette|miracl|\bor\b|doré|soie|zamzam|coran|mushaf|verset|sourate|baraka|ruqya|\banges?\b/i;
      const mots = (id, o) => { const txt = (o.name || '') + ' ' + (o.desc || ''); pari(o.name, id, E); if (SACRE.test(txt)) E.push(`${id}: un objet ne reçoit ni nom divin, ni vertu, ni rien de sacré changé en pouvoir (exigences 8, 15 et 17)`); if (NOM_INTERDIT.test(txt)) E.push(`${id}: ni Iblîs, ni démon, ni djinn dans le nom ou la description d'un objet (exigence 18)`); };
      Object.keys(objets || {}).forEach(id => { const o = objets[id];
        Object.keys(o).forEach(k => { if (!CLES.includes(k)) E.push(`${id}: clé « ${k} » inconnue (name, desc, hp, sp, revive, cleanse, niyya, target, vivre)`); });
        mots(id, o);
        PARTS.forEach(k => { if (o[k] !== undefined && !(typeof o[k] === 'number' && o[k] > 0 && o[k] <= 1)) E.push(`${id}: ${k} attend une part, de 0 (exclu) à 1`); });
        if (o.niyya !== undefined && !(Number.isInteger(o.niyya) && o.niyya >= 1 && o.niyya <= 3)) E.push(`${id}: niyya de 1 à 3`);
        if (o.cleanse !== undefined && o.cleanse !== true) E.push(`${id}: cleanse vaut true, ou ne s'écrit pas`);
        if (o.vivre !== undefined && typeof o.vivre !== 'boolean') E.push(`${id}: vivre vaut true ou false`);
        if (!['ally', 'allies'].includes(o.target)) E.push(`${id}: target « ${o.target} » invalide (ally : un compagnon ; allies : tout le groupe)`);
        if (o.revive !== undefined && o.target !== 'ally') E.push(`${id}: un objet qui relève s'adresse à un seul compagnon (target: 'ally')`);
        if (!PARTS.some(k => o[k]) && !o.cleanse && !o.niyya) E.push(`${id}: objet sans effet`);
        if (D.GEAR[id]) E.push(`${id}: même identifiant qu'une pièce d'équipement`); });
      Object.keys(pieces || {}).forEach(id => mots(id, pieces[id]));
      return E;
    }
    // 2.0 — les lieux qu'un paquet déclare : leur forme est contrôlée par D.paquet.refus ; ici, seulement la garde des noms
    function verifierLieux(lieux) {
      const E = [], garde = (nom, w) => { if (typeof nom === 'string' && NOM_INTERDIT.test(nom)) E.push(`${w}: « ${nom} » — ni Iblîs, ni démon, ni djinn dans le nom d'un lieu (exigence 18)`); };
      Object.keys(lieux || {}).forEach(id => { const l = lieux[id]; garde(l.nom, `lieu ${id}`); Object.keys(l.noms || {}).forEach(k => garde(l.noms[k], `lieu ${id}, noms.${k}`)); });
      return E;
    }

    /* 2.29 (D220) — la carte du monde (D.MONDE) : des villes connues, chacune à sa place dans la carte, son année de fondation
       entière, sa visite dans D.MAPS (une ville de passage) ; La Mecque visitée sans mosquée ni école de mosquée (la variante
       « mecque » : ni Haram ni Kaaba) ; des portes seulement dans les chapitres des récits (ni l'histoire-cadre, ni les veillées,
       ni le dernier maillon), sur une carte que le chapitre emploie et dont le gabarit a une porte, à partir d'un objectif qui
       existe, vers une ville qui existe l'année du chapitre ; des routes faites de villes et de points ; aucun mot du pari. */
    function verifierMonde(sagas, E) {
      const M = D.MONDE, V = M.villes || {}, w = 'D.MONDE', ent = (v, a, b) => Number.isInteger(v) && v >= a && v <= b, pt = q => Array.isArray(q) && q.length === 2 && typeof q[0] === 'number' && typeof q[1] === 'number' && q[0] >= M.lat[0] - 1 && q[0] <= M.lat[1] + 1 && q[1] >= M.lon[0] - 1 && q[1] <= M.lon[1] + 1;
      if (!Array.isArray(M.cases) || !ent(M.cases[0], 32, 128) || !ent(M.cases[1], 32, 128)) E.push(`${w}.cases : de 32 à 128 cases de côté (la toile d'un téléphone)`);
      const spots = ((D.GABARITS.monde || {}).spots) || [];
      Object.keys(V).forEach(id => { const v = V[id], wv = `${w}.villes.${id}`;
        if (typeof v.lat !== 'number' || typeof v.lon !== 'number' || v.lat < M.lat[0] || v.lat > M.lat[1] || v.lon < M.lon[0] || v.lon > M.lon[1]) E.push(`${wv} : latitude et longitude dans la carte`);
        if (!(v.fondee === null || ent(v.fondee, 1, 60))) E.push(`${wv} : fondee est une année entière de l'hégire, ou null (toujours)`);
        if (!['ville', 'lieu'].includes(v.genre)) E.push(`${wv} : genre « ville » ou « lieu »`);
        if (!['arabe', 'sham', 'camp'].includes(v.icone)) E.push(`${wv} : icone « arabe », « sham » ou « camp »`);
        if (v.genre === 'ville' && !(D.MAPS[v.carte] && D.MAPS[v.carte].visite)) E.push(`${wv} : sa visite (carte) est un lieu de D.MAPS marqué « visite »`);
        if (v.genre === 'lieu' && v.carte !== null) E.push(`${wv} : un lieu n'a pas de visite (carte: null)`);
        if (v.rive !== undefined && ![-1, 1].includes(v.rive)) E.push(`${wv} : rive -1 (ouest) ou 1 (est)`);
        if (typeof D.LIEUX[id] !== 'string') E.push(`${wv} : son nom manque dans D.LIEUX`);
        if (!spots.includes(id)) E.push(`${wv} : absente des lieux nommés du gabarit « monde »`); });
      { const m = V.mecque, L = m && D.MAPS[m.carte]; if (!m) E.push(`${w}.villes.mecque : La Mecque est l'une des villes du décideur`);
        else if (!L || L.variante !== 'mecque' || L.spots.some(s => /mosquee|ecole/.test(s))) E.push(`${w}.villes.mecque : La Mecque se visite sans mosquée ni Haram ni Kaaba (ville, variante « mecque », aucun lieu de mosquée)`); }
      (M.routes || []).forEach((R, i) => { if (!Array.isArray(R) || R.length < 2 || R.some(e => !(typeof e === 'string' ? V[e] : pt(e)))) E.push(`${w}.routes[${i}] : des étapes, une ville connue ou [lat, lon]`); });
      ['terres'].forEach(k => (M[k] || []).forEach((L, i) => { if (!Array.isArray(L) || L.length < 3 || L.some(q => !pt(q))) E.push(`${w}.${k}[${i}] : un polygone de [lat, lon]`); }));
      /* 2.30 (D222) — les rencontres de la route : leurs champs déclarés et rien d'autre, chacun un entier (des cases, un nombre)
         ou une part de 0 à 1 (une chance, une allure, un poids) ; aucune rencontre d'aucune sorte à moins de trois cases de La
         Mecque (« Ok pour tes propositions », le décideur, 23 novembre), ni à moins de deux d'une ville ; aucune idée noire ne
         rôde sur la carte du monde (exigences 16, 18 et 22) : ce qui y rôde, ce sont les petites chimères des récits
         (D.rodeDehors), et cette règle écarte les cinq idées noires du contenu commun et ce qui en porte la racine. */
      { const Rg = M.rencontres, wr = `${w}.rencontres`, CH = { villes: 1, mecque: 1, route: 1, chimeres: ['nombre', 'rayon', 'loin', 'ecart', 'vue', 'pas', 'pres', 'mecque'], brigands: ['chance', 'apres'], voyageur: ['chance', 'pres', 'eau', 'apres', 'loin', 'devant'] };
        const PART = ['chimeres.pas', 'chimeres.pres', 'brigands.chance', 'voyageur.chance', 'voyageur.pres'], nb = (v, k) => { const ok = PART.includes(k) ? typeof v === 'number' && isFinite(v) && v >= 0 && v <= 1 : Number.isInteger(v) && v >= 0 && v <= 96; if (!ok) E.push(`${wr}.${k} : ${PART.includes(k) ? 'une part de 0 à 1 (une chance, une allure, un poids)' : 'un entier de 0 à 96 (des cases, un nombre)'}`); };
        if (!Rg || typeof Rg !== 'object') E.push(`${wr} : manquant (les rencontres de la route, D222)`);
        else {
          Object.keys(Rg).forEach(k => { if (!CH[k]) E.push(`${wr} : champ « ${k} » inconnu (${Object.keys(CH).join(', ')})`); });
          Object.keys(CH).forEach(k => { if (CH[k] === 1) { nb(Rg[k], k); return; } const o = Rg[k]; if (!o || typeof o !== 'object' || Array.isArray(o)) { E.push(`${wr}.${k} : manquant`); return; }
            Object.keys(o).forEach(x => { if (!CH[k].includes(x)) E.push(`${wr}.${k} : champ « ${x} » inconnu (${CH[k].join(', ')}) — rien d'autre que ce qui se croise`); });
            CH[k].forEach(x => nb(o[x], k + '.' + x)); });
          if (!(Number.isInteger(Rg.mecque) && Rg.mecque >= 3)) E.push(`${wr}.mecque : au moins trois cases — aucune rencontre d'aucune sorte près de La Mecque, un territoire sacré`);
          if (!(Number.isInteger(Rg.villes) && Rg.villes >= 2)) E.push(`${wr}.villes : au moins deux cases — rien près d'une ville`);
          if (Rg.voyageur && !(Rg.voyageur.loin >= Rg.villes)) E.push(`${wr}.voyageur.loin : le voyageur s'assied loin des villes (au moins villes)`);
          if (Rg.chimeres && !(Rg.chimeres.loin >= Rg.mecque && Rg.chimeres.rayon > Rg.chimeres.loin)) E.push(`${wr}.chimeres : loin ≥ mecque, rayon > loin`);
          if (Rg.chimeres && !(Rg.chimeres.mecque >= Rg.mecque)) E.push(`${wr}.chimeres.mecque : une chimère reste au moins aussi loin de La Mecque que toute rencontre`);
          if (!V.mecque) E.push(`${wr} : La Mecque manque à D.MONDE.villes — la zone sans rencontre ne se tracerait pas`);
        }
        const communs = (sagas.find(s => s.commun) || {}).enemies || {};
        if (typeof D.rodeDehors !== 'function') E.push('D.rodeDehors : manquant (ce qui peut rôder sur la carte du monde)');
        else {
          D.NOIRS.forEach(n => { if (D.rodeDehors(n, communs[n] || { tier: 'minion', idee: true })) E.push(`D.rodeDehors : l'idée noire « ${n} » rôderait sur la carte du monde`); });
          Object.keys(communs).forEach(k => { const e = communs[k]; if ((e.idee || [].concat(e.racine || []).some(r => D.NOIRS.includes(r))) && D.rodeDehors(k, e)) E.push(`D.rodeDehors : « ${k} » (une idée noire, ou sa racine) rôderait sur la carte du monde`); });
          const ch = {}; Object.keys(M.depuis || {}).forEach(id => { ch[id] = 1; });
          sagas.filter(s => !s.commun && !s.frame && (s.chapters || []).some(c => ch[c.id])).forEach(s => Object.keys(s.enemies || {}).forEach(k => { const e = s.enemies[k]; if (D.rodeDehors(k, e) && (D.NOIRS.includes(k) || e.idee)) E.push(`${s.id}: « ${k} » — une idée noire ne rôde pas sur la carte du monde`); }));
        } }
      const ch = {}; sagas.forEach(s => (s.chapters || []).forEach(c => { if (c && c.id) ch[c.id] = { s, c }; }));
      const cartes = c => { const l = new Set([c.map]); (function va(v) { if (Array.isArray(v)) { if (v[0] === 'map' && typeof v[1] === 'string') l.add(v[1]); v.forEach(va); } else if (v && typeof v === 'object') Object.keys(v).forEach(k => va(v[k])); })(c); return l; };
      Object.keys(M.depuis || {}).forEach(id => { const d = M.depuis[id], x = ch[id], wd = `${w}.depuis.${id}`;
        if (!x) { E.push(`${wd} : aucun chapitre ne porte cet identifiant`); return; }
        if (x.s.frame || x.s.veillees || x.s.commun) E.push(`${wd} : aucune porte dans l'histoire-cadre ni dans les veillées`);
        if (x.c.fin) E.push(`${wd} : aucune porte dans le dernier maillon`);
        if (!ent(d.an, 1, 60)) E.push(`${wd} : an, une année entière de l'hégire`);
        if (typeof d.epoque !== 'string' || !d.epoque.trim()) E.push(`${wd} : epoque, ce que dit le carton d'une ville visitée`); else pari(d.epoque, wd, E);
        if (!Array.isArray(d.portes) || !d.portes.length) { E.push(`${wd} : portes, au moins une`); return; }
        const emploie = cartes(x.c), n = (x.c.objectives || []).length;
        d.portes.forEach((p, i) => { const wp = `${wd}.portes[${i}]`, L = D.MAPS[p.carte];
          if (!L) { E.push(`${wp} : carte « ${p.carte} » inconnue`); return; }
          if (!(M.gabarits || []).includes(L.gabarit) || L.visite) E.push(`${wp} : une porte se tient dans une ville d'un récit (${(M.gabarits || []).join(', ')}) — ni une route, ni la mer, ni la noosphère`);
          if (!emploie.has(p.carte)) E.push(`${wp} : le chapitre n'emploie pas la carte « ${p.carte} »`);
          if (!(Number.isInteger(p.des) && p.des >= 0 && p.des < n)) E.push(`${wp} : des, un objectif du chapitre (0 à ${n - 1})`);
          if (!V[p.ville]) E.push(`${wp} : ville « ${p.ville} » inconnue`);
          else if (V[p.ville].fondee && ent(d.an, 1, 60) && V[p.ville].fondee > d.an) E.push(`${wp} : ${p.ville} n'existe pas encore en l'an ${d.an}`); }); });
    }

    // 2.33 (D225) — les gens du lieu et leurs bêtes : leurs tables n'ont que leurs champs ; chaque type est un type connu (jamais
    // un Compagnon) ; chaque place est un lieu du gabarit ; une bête est une espèce dessinée ; ni Compagnon ni personnage du récit
    function verifierGens(E) {
      const Gs = D.GENS, B = D.BETES, w = 'D.GENS', seul = (o, cles, ou) => Object.keys(o || {}).forEach(k => { if (cles.indexOf(k) < 0) E.push(`${ou} : champ « ${k} » inconnu (${cles.join(', ')})`); });
      seul(Gs, ['marge', 'garde', 'regions', 'palettes', 'roles', 'ancres', 'betes'], w);
      if (!(Number.isInteger(Gs.marge) && Gs.marge >= 1)) E.push(`${w}.marge : un entier, au moins 1`);
      Object.keys(B || {}).forEach(k => { seul(B[k], ['vit', 'rayon', 'arret', 'robes'], 'D.BETES.' + k); if (!(B[k].vit > 0 && B[k].rayon >= 0 && B[k].arret > 0)) E.push(`D.BETES.${k} : allure, rayon et arrêt positifs`); if (!Array.isArray(B[k].robes) || !B[k].robes.length || B[k].robes.some(c => !/^#[0-9a-f]{6}$/i.test(c))) E.push(`D.BETES.${k} : des robes, des couleurs unies (#rrggbb)`); });
      Object.keys(Gs.roles || {}).forEach(k => { const R = Gs.roles[k]; seul(R, ['kind', 'item', 'manteau', 'pose'], `${w}.roles.${k}`);
        if (D.NPC_KINDS.indexOf(R.kind) < 0 || R.kind === 'compagnon' || D.DE_2084.indexOf(R.kind) >= 0) E.push(`${w}.roles.${k} : type « ${R.kind} » (un type du jeu, ni Compagnon ni de 2084)`);
        if (R.pose && D.POSES.indexOf(R.pose) < 0) E.push(`${w}.roles.${k} : pose « ${R.pose} » inconnue`); if (R.manteau && D.MANTEAUX.indexOf(R.manteau) < 0) E.push(`${w}.roles.${k} : manteau « ${R.manteau} » inconnu`); });
      Object.keys(Gs.regions || {}).forEach(id => { if (!D.MAPS[id] || !D.MAPS[id].visite) E.push(`${w}.regions : « ${id} » n'est pas une ville qu'on visite`); if (!(Gs.palettes || {})[Gs.regions[id]]) E.push(`${w}.regions.${id} : palette « ${Gs.regions[id]} » inconnue`); });
      Object.keys(Gs.palettes || {}).forEach(k => (Gs.palettes[k] || []).forEach((c, i) => { if (!Array.isArray(c) || c.length !== 3 || c.some(x => !/^#[0-9a-f]{6}$/i.test(x))) E.push(`${w}.palettes.${k}[${i}] : [robe, coiffe, manteau], trois couleurs unies`); }));
      const lieux = g => ((D.GABARITS[g] || {}).spots || []);
      Object.keys(Gs.ancres || {}).forEach(g => { if (!D.GABARITS[g]) { E.push(`${w}.ancres : gabarit « ${g} » inconnu`); return; }
        Object.keys(Gs.ancres[g]).forEach(r => { const a = Gs.ancres[g][r]; if (!Gs.roles[r]) E.push(`${w}.ancres.${g} : rôle « ${r} » inconnu`);
          [a, a[3]].filter(Boolean).forEach(q => { if (lieux(g).indexOf(q[0]) < 0) E.push(`${w}.ancres.${g}.${r} : « ${q[0]} » n'est pas un lieu du gabarit`); if (Gs.garde.indexOf(q[0]) >= 0) E.push(`${w}.ancres.${g}.${r} : jamais à une porte, au comptoir ni au tapis (« ${q[0]} »)`); }); }); });
      Object.keys(Gs.betes || {}).forEach(g => (Gs.betes[g] || []).forEach((q, i) => { if (!B[q[0]]) E.push(`${w}.betes.${g}[${i}] : espèce « ${q[0]} » inconnue`); if (lieux(g).indexOf(q[1]) < 0) E.push(`${w}.betes.${g}[${i}] : « ${q[1]} » n'est pas un lieu du gabarit`); if (Gs.garde.indexOf(q[1]) >= 0) E.push(`${w}.betes.${g}[${i}] : jamais à une porte, au comptoir ni au tapis`); }));
    }

    // 2.33 (D226) — l'entraide : ses tables n'ont que leurs champs ; jamais à La Mecque ; la petite mosquée de quartier seulement
    // dans les villes de `mosquee` ; chaque plan tient dans son rectangle, avec des pièces déclarées ; une paie entière et positive
    // (une aide payée, jamais une mise ni un hasard) ; ce qu'on fournit, des matériaux déclarés
    function verifierEntraide(E) {
      const X = D.ENTRAIDE, w = 'D.ENTRAIDE', seul = (o, cles, ou) => Object.keys(o || {}).forEach(k => { if (cles.indexOf(k) < 0) E.push(`${ou} : champ « ${k} » inconnu (${cles.join(', ')})`); });
      seul(X, ['villes', 'mosquee', 'demandes', 'reserve'], w);
      Object.keys(X.villes || {}).forEach(id => { if (!D.MAPS[id] || !D.MAPS[id].visite) E.push(`${w}.villes : « ${id} » n'est pas une ville qu'on visite`); if (/mecque/.test(id)) E.push(`${w}.villes : jamais à La Mecque`);
        (X.villes[id] || []).forEach(d => { if (!(X.demandes || {})[d]) E.push(`${w}.villes.${id} : demande « ${d} » inconnue`); if (d === 'mosquee' && (X.mosquee || []).indexOf(id) < 0) E.push(`${w}.villes.${id} : la petite mosquée de quartier n'est pas pour cette ville`); }); });
      (X.mosquee || []).forEach(id => { if (/mecque/.test(id)) E.push(`${w}.mosquee : jamais à La Mecque`); });
      Object.keys(X.demandes || {}).forEach(d => { const Q = X.demandes[d], ou = `${w}.demandes.${d}`; seul(Q, ['qui', 'w', 'h', 'plan', 'fournit', 'paie', 'eau'], ou);
        if (!(D.GENS && D.GENS.roles[Q.qui])) E.push(`${ou} : « ${Q.qui} » n'est pas un rôle des gens du lieu`);
        if (!(Number.isInteger(Q.paie) && Q.paie > 0)) E.push(`${ou} : la paie, un entier positif de dirhams`);
        if (!(Number.isInteger(Q.w) && Q.w >= 1 && Number.isInteger(Q.h) && Q.h >= 1)) E.push(`${ou} : w et h, des entiers positifs`);
        (Q.plan || []).forEach((q, i) => { if (!D.PIECES[q[2]]) E.push(`${ou}.plan[${i}] : pièce « ${q[2]} » inconnue`); if (!(q[0] >= 0 && q[0] < Q.w && q[1] >= 0 && q[1] < Q.h)) E.push(`${ou}.plan[${i}] : hors du rectangle`); });
        if (!(Q.plan || []).length) E.push(`${ou} : un plan, au moins une pièce`);
        Object.keys(Q.fournit || {}).forEach(k => { if (!D.MATS[k]) E.push(`${ou}.fournit : matériau « ${k} » inconnu`); else if (!(Number.isInteger(Q.fournit[k]) && Q.fournit[k] > 0)) E.push(`${ou}.fournit.${k} : un entier positif`); }); });
      Object.keys(X.reserve || {}).forEach(t => Object.keys(X.reserve[t]).forEach(k => { if (!D.MATS[k]) E.push(`${w}.reserve.${t} : matériau « ${k} » inconnu`); }));
    }

    // ce qu'une saga seule ne peut pas dire : les renvois entre sagas (« after ») et l'ordre sur la Chaîne
    function verifierEnsemble(sagas) {
      const E = [], jouables = sagas.filter(s => !s.commun && !s.frame), ids = new Set(jouables.map(s => s.id)), vus = {};
      if (D.MONDE) verifierMonde(sagas, E);   // 2.29 (D220)
      if (D.GENS) verifierGens(E);   // 2.33 (D225)
      if (D.ENTRAIDE) verifierEntraide(E);   // 2.33 (D226)
      sagas.forEach(s => (s.chapters || []).forEach(c => { if (c.after !== undefined && !ids.has(c.after)) E.push(`${s.id}/${c.id}: « after: ${c.after} » ne désigne aucune saga`); }));
      jouables.forEach(s => { const L = s.livre === undefined ? 1 : s.livre;
        if (!(Number.isInteger(L) && L >= 1)) { E.push(`saga ${s.id}: « livre » doit être un entier à partir de 1`); return; }
        if (D.LIVRES && !D.LIVRES[L]) E.push(`saga ${s.id}: le livre ${L} n'est pas déclaré (livres: { ${L}: { titre } })`);
        const k = L + ':' + s.order; if (vus[k]) E.push(`sagas ${vus[k]} et ${s.id}: même ordre ${s.order} dans le livre ${L}`); vus[k] = s.id; });
      return E;
    }

    return { verifierEquipement, verifierEnsemble, verifierSaga(s) { const erreurs = [], avis = []; checkSaga(s, erreurs, avis); balises(s, 'saga ' + (s && s.id), erreurs); return { erreurs, avis }; }, verifierPistes, verifierObjets, verifierLieux, stats };
  }

  /* 2.0 — un paquet entier. D'abord sa forme et ses identifiants (D.paquet.refus). Puis, sur une copie des tables étendue
     de ce qu'il déclare, les règles de chacune de ses parties et celles de l'ensemble, face au contenu déjà posé.
       ctx.sagas : les sagas déjà posées (jeu de base, autres paquets) ; ctx.pris : { paquets, sagas }, par identifiant.
     Les tables du jeu ne sont jamais touchées : un paquet refusé ne laisse aucune trace. → { erreurs, avis, resume } */
  function verifierPaquet(D, p, ctx) {
    const C = ctx || {}, deja = C.sagas || [], pris = C.pris || { paquets: {}, sagas: {} }, avis = [];
    if (!C.pris) deja.forEach(s => { pris.sagas[s.id] = s; });
    const erreurs = D.paquet.refus(p, D, pris).slice();
    if (erreurs.length) return { erreurs, avis, resume: '' };
    const T = D.paquet.tables(); D.paquet.poser(p, T);
    const siennes = p.sagas || [], toutes = deja.concat(siennes), savoirs = {}, communs = {};
    toutes.forEach(s => { savoirs[s.id] = (s.codex || []).map(x => x.id); if (s.commun) Object.assign(communs, s.enemies || {}); });
    const R = creer(T, { savoirConnu: ref => { const k = String(ref).split('/'); return !!(savoirs[k[0]] && savoirs[k[0]].includes(k[1])); }, ennemisCommuns: () => communs });
    balises({ titre: p.titre, note: p.note, livres: p.livres, lieux: p.lieux, objets: p.objets, equipement: p.equipement, etals: p.etals, pistes: p.pistes }, 'paquet', erreurs);
    R.verifierEquipement().forEach(e => erreurs.push('équipement — ' + e));
    R.verifierObjets(p.objets, p.equipement).forEach(e => erreurs.push('objets — ' + e));
    R.verifierLieux(p.lieux).forEach(e => erreurs.push(e));
    R.verifierPistes(p.pistes || {}, { partiel: true }).forEach(e => erreurs.push('pistes — ' + e));
    siennes.forEach(s => {
      // le contenu commun, l'histoire-cadre et les veillées appartiennent au jeu de base : un paquet apporte des maillons
      if (s.commun || s.frame || s.veillees) { erreurs.push(`saga ${s.id}: le contenu commun, l'histoire-cadre et les veillées appartiennent au jeu de base ; un paquet apporte des maillons de la Chaîne`); return; }
      // le livre I est celui du jeu de base, avec ses cinq maillons et sa fin : un paquet range ses sagas dans un autre livre
      if ((s.livre === undefined ? 1 : s.livre) === 1) erreurs.push(`saga ${s.id}: le livre I est celui du jeu de base ; un paquet range ses sagas dans un autre livre (livre: 2, ou plus)`);
      const r = R.verifierSaga(s); r.erreurs.forEach(e => erreurs.push(e)); r.avis.forEach(a => avis.push(a)); });
    R.verifierEnsemble(toutes).forEach(e => erreurs.push(e));
    // ce qui est déclaré sans jamais servir : rien de faux, mais le joueur ne le verra pas
    const ailleurs = JSON.stringify([siennes, p.etals || {}, Object.keys(p.lieux || {}).map(k => p.lieux[k].piste || '')]);
    const sert = id => ailleurs.includes('"' + id + '"');
    [['lieux', 'le lieu'], ['objets', 'l’objet'], ['equipement', 'la pièce'], ['pistes', 'la piste']].forEach(([cle, mot]) => Object.keys(p[cle] || {}).forEach(id => { if (!sert(id)) avis.push(`${mot} « ${id} » est déclaré${cle === 'lieux' || cle === 'objets' ? '' : 'e'} mais ne sert nulle part dans ce paquet`); }));
    const nb = (n, un, des) => n ? [n + ' ' + (n > 1 ? des : un)] : [];
    const resume = [].concat(nb(siennes.length, 'saga', 'sagas'), nb(Object.keys(p.lieux || {}).length, 'lieu', 'lieux'), nb(Object.keys(p.objets || {}).length, 'objet', 'objets'),
      nb(Object.keys(p.equipement || {}).length, 'pièce d’équipement', 'pièces d’équipement'), nb(Object.keys(p.etals || {}).length, 'étal', 'étals'), nb(Object.keys(p.pistes || {}).length, 'piste', 'pistes')).join(', ') || 'vide';
    return { erreurs, avis, resume };
  }
  /* 2.x — les langues (src/core/langue.js). Les récits s'écrivent en français et passent les règles ci-dessus ; leurs textes
     arabes, anglais et japonais passent celles-ci, emplacement par emplacement. Chaque emplacement a un genre, tiré de son
     chemin dans le récit (genreDe) : un nom (combattant, compétence, personnage, lieu), un rang, un objet, un verset, une
     référence de verset, ou un texte. Les mêmes exigences, dans les mots de chaque langue :
       - aucun nom d'Iblîs, de démon ni de djinn pour un combattant, une compétence, un personnage ou un lieu (exigences 6, 18) ;
       - jamais le Nom divin dans le nom d'une compétence ni de ce que l'on frappe (exigence 8) ;
       - un objet ou une pièce : ni nom divin, ni vertu, ni or, ni soie, rien de sacré (exigences 8, 15, 17) ;
       - aucun effectif dans le nom d'un rang, en chiffres de quelque écriture que ce soit (exigence 19) ;
       - un verset entre les signes de sa langue ; sa référence porte les mêmes numéros que la française (exigence 7) ;
       - ni l'auteur ni l'œuvre des exigences 14 et 24 ne sont nommés ;
       - aucune balise. */
  const AR = 'ء-ي', SANS_AR = `(^|[^${AR}])`, APRES_AR = `(?![${AR}])`, PROCLITIQUES = '(?:و|ف|ب|ل|ك)?(?:ال)?';
  const LANG = {
    ar: {
      demon: new RegExp(`إبليس|شيطان|شياط[يى]ن|${SANS_AR}${PROCLITIQUES}(?:جن|جان|جنّ|جني|جنية|عفريت|عفاريت|مارد|مردة|غول|غيلان)${APRES_AR}`),
      divin: new RegExp(`${SANS_AR}(?:و|ف|ب)?(?:الله|لله|إله|الإله|الرب|الرحمن|الرحيم)${APRES_AR}`),
      sacre: /الله|إله|مقدّ?س|مبار[كك]|برك[ةه]|معجز|كرام[ةه]|تميم|حرز|تعويذ|رقي[ةه]|ذهب|حرير|قرآن|مصحف|سورة|زمزم|ملا[ئك]|نبيّ?|رسول/,
      verset: ['﴿', '﴾'], say: 330, nar: 360,
      pari: /رهان|مراهن|[تأنيو]راهن|راهن\s*على|قمار|يقامر|مقامر|الميسر|يانصيب|كازينو/,   // (« الراهن », le présent, et « ميسّر », facile, passent)
      agregor: /(?:ال|لل)مجمع|مجمع الخيالات/   // (lu sans ses voyelles : « المُجمِّع », ar.md, § 3.6 ; et « للمُجمِّع », la préposition li- devant l'article, 2.48)
    },
    en: {
      demon: /\b(iblis|satan|shaitans?|shaytans?|shayatin|devils?|demons?|djinns?|jinns?|jinni|genies?|ifrits?|ghouls?|fiends?)\b/i,
      divin: /\b(allah|god|gods|lord)\b/i,
      sacre: /\b(allah|god|lord|prophet|blessed|sacred|holy|saint(ly)?|relics?|talismans?|amulets?|miracles?|miraculous|gold|golden|gilded|silk|silken|zamzam|qur'?an|koran|mushaf|verses?|surah?|baraka|ruqya|angels?)\b/i,
      verset: ['“', '”'], say: 330, nar: 360,
      pari: /\b(bet|bets|betting|wager|wagers|wagering|gamble|gambles|gambling|stake|stakes|odds|lottery|lotteries|casino|jackpot)\b/i,
      agregor: /\baggregor\b/i
    },
    ja: {
      demon: /イブリース|サタン|シャイターン|悪魔|魔王|魔神|悪霊|鬼|妖怪|ジン(?![ァ-ヴー])|ジャーン|イフリート/,
      divin: /アッラー|(?<!精)神(?!経)|主よ|創造主/,
      sacre: /アッラー|(?<!精)神(?!経)|預言者|祝福|聖|遺物|護符|お守り|魔除け|奇跡|黄金|金色|金箔|金糸|金銀|絹|ザムザム|クルアーン|コーラン|啓典|章句|天使/,
      verset: ['「', '」'], say: 110, nar: 125,
      pari: /賭|ギャンブル|宝くじ|カジノ|博打/,
      agregor: /アグレゴール/
    }
  };
  const EFFECTIF = /[0-9٠-٩۰-۹０-９]|百|千|万|億|مئة|مائة|ألف|آلاف|\b(hundreds?|thousands?|dozens?)\b/i;
  const AUTEURS = /exup[eé]ry|scheler|petit prince|little prince|إ?كزوبيري|شيلر|الأمير الصغير|テグジュペリ|シェーラー|星の王子/i;
  const CHIFFRES = s => String(s).replace(/[٠-٩]/g, c => c.charCodeAt(0) - 0x660).replace(/[۰-۹]/g, c => c.charCodeAt(0) - 0x6F0).replace(/[０-９]/g, c => c.charCodeAt(0) - 0xFF10);
  const NUMEROS = s => (CHIFFRES(s).match(/\d+/g) || []).join(' ');
  // le genre d'un emplacement, d'après son chemin (langue.js : casesSaga, casesDefs)
  function genreDe(ou) {
    // 2.27 (D216) : une réponse offerte au joueur — un choix, une question, un pourparler, un menu de la course (cite.course), une phrase du code de la course
    // (2.28, D217 : et ce que disent les activités des quartiers — leurs menus et leurs phrases, activites.js — et leurs lignes)
    if (/<(choice|ask)>2\[\d+\]\.t$|opts\[\d+\]\.t$|^cite\.course\.(offre|monter|pasMaintenant|encoreQ|encore|uneAutreFois|organisateur\.choix|circuits\[\d+\]\.(nom|dit))$|^circuit\.js$|^activites\.js$|^cite\.activites\./.test(ou)) return 'option';
    if (/attributs\.[^.]+\.verset$|secours\.verset$/.test(ou)) return 'verset';
    if (/attributs\.[^.]+\.ref$|secours\.ref$/.test(ou)) return 'ref';
    if (/bataille\.rangs\[\d+\]\.name$|^D\.RANGS\.[^.]+\.name$/.test(ou)) return 'rang';
    if (/^D\.(ITEMS|GEAR)\.[^.]+\.(name|desc)$/.test(ou)) return 'objet';
    if (/(skills|addSkills)\[\d+\]\.name$|\.limit\.name$|(^|\.)enemies\.[^.]+\.name$|noir\.name$/.test(ou)) return 'frappe';
    if (/heroes\.[^.]+\.name$|npcs\[\d+\]\.name$|<say>1$|<parley>1\.with$|allies\[\d+\]\.name$|<site>1\.name$|^D\.(LIEUX|MAPS|GABARITS)\./.test(ou)) return 'nom';
    if (/<say>2$/.test(ou)) return 'say';
    if (/<nar>1$/.test(ou)) return 'nar';
    return 'texte';
  }
  // cases : [{ ou, fr, t }] — t, le texte de la langue ; → { erreurs, avis }
  function verifierLangue(lang, cases) {
    const R = LANG[lang], erreurs = [], avis = []; if (!R) return { erreurs: [`langue « ${lang} » inconnue`], avis };
    (cases || []).forEach(c => { const g = genreDe(c.ou), t = c.t, w = `${lang} ${c.ou}`;
      if (typeof t !== 'string' || !t.trim()) { erreurs.push(`${w}: texte vide`); return; }
      if (/[<>]/.test(t) && !/[<>]/.test(c.fr)) erreurs.push(`${w}: un texte ne contient ni « < » ni « > »`);
      if (AUTEURS.test(t)) erreurs.push(`${w}: ni l'auteur ni l'œuvre des exigences 14 et 24 ne sont nommés`);
      if ((g === 'nom' || g === 'frappe' || g === 'rang') && R.demon.test(t)) erreurs.push(`${w}: « ${t} » — ni Iblîs, ni démon, ni djinn dans un nom (exigences 6 et 18)`);
      if (g === 'frappe' && R.divin.test(t)) erreurs.push(`${w}: « ${t} » — jamais le Nom divin dans une compétence ni dans ce que l'on frappe (exigence 8)`);
      if (g === 'objet' && R.sacre.test(t)) erreurs.push(`${w}: un objet ne reçoit ni nom divin, ni vertu, ni or, ni soie, rien de sacré (exigences 8, 15 et 17)`);
      if (g === 'rang' && EFFECTIF.test(t)) erreurs.push(`${w}: « ${t} » — aucun effectif dans le nom d'un rang (exigence 19)`);
      if (g === 'verset') { const v = t.trim(); if (!(v.startsWith(R.verset[0]) && v.endsWith(R.verset[1]))) erreurs.push(`${w}: un verset se cite entre ${R.verset[0]} ${R.verset[1]} (exigence 7)`); }
      if (g === 'ref' && NUMEROS(t).indexOf(NUMEROS(c.fr).split(' ').slice(0, 2).join(' ')) !== 0 && NUMEROS(t) !== NUMEROS(c.fr)) erreurs.push(`${w}: la référence ne porte pas les numéros de la française (${NUMEROS(c.fr)})`);
      if (g === 'option' && R.pari.test(t)) erreurs.push(`${w}: « ${t.slice(0, 60)} » — aucun pari ni jeu de hasard ne se joue : rien de ce qu'on offre au joueur ne propose de parier (le pari n'est qu'une chimère)`);
      // 2.30 (D222) : les rencontres de la route (coeur.js, route ; les phrases de monde.js) — ni l'Agrégor, ni le pari
      if (/^route\.|^monde\.js$/.test(c.ou)) { const nu = t.replace(/[\u064B-\u0652\u0670]/g, ''); if (R.agregor && R.agregor.test(nu)) erreurs.push(`${w}: la carte du monde vient avant que l'Agrégor soit nommé (2.25) : aucun texte des rencontres ne le nomme`); if (g !== 'option' && R.pari.test(nu)) erreurs.push(`${w}: « ${t.slice(0, 60)} » — aucun texte des rencontres ne porte les mots du pari`); }
      // 2.48 (D240) : une langue ne nomme l'Agrégor que là où le français le nomme — et le français ne le nomme que là où son nom est
      // reçu (verifierNomAgregor) : la variante qui dit « ce qui règne là-haut », « les écrans », le dit aussi dans chaque langue
      if (R.agregor && R.agregor.test(t.replace(/[ً-ْٰ]/g, '')) && !AGREGOR.test(c.fr)) erreurs.push(`${w}: « ${t.slice(0, 60)} » nomme l'Agrégor, et le français ne le nomme pas (D240 : il ne se nomme que là où son nom est reçu)`);
      if ((g === 'say' || g === 'nar') && t.length > R[g]) avis.push(`${w}: ${g === 'say' ? 'réplique' : 'narration'} longue (${t.length} signes, ${R[g]} au plus)`); });
    return { erreurs, avis };
  }
  const api = { creer, verifierPaquet, verifierLangue, genreDe, LANGUES_REGLES: LANG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else racine.ISNAD_REGLES = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
