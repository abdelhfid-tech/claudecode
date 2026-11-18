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
  function creer(D, contexte) {
    const C = contexte || {}, savoirConnu = C.savoirConnu || (() => false), ennemisCommuns = C.ennemisCommuns || (() => ({}));
    // (la garde des noms : définie ici parce que les lieux et les objets d'un paquet y passent aussi)
    const NOM_INTERDIT = /(^|[^a-zà-ÿ])(ibl[iî]s|satan|sh?a[iy]t[aâ]ne?s?|chayt[aâ]ne?s?|diables?|d[ée]mons?|d?jinns?)(?![a-zà-ÿ])/i;

    // l'équipement (D.GEAR) : chaque pièce a un type, un rang, un nom, une description sobre ; aucun mot qui en ferait une relique
    function verifierEquipement() { const E = [], STATS = ['atk', 'mag', 'def', 'spd', 'hp', 'sp'], TRAITS = ['perce', 'vif', 'choc', 'parade', 'ferme'], INTERDIT = /allah|dieu|proph|bén[ie]|sacr|saint|relique|talisman|amulette|miracl|\bor\b|doré|soie/i;
      Object.keys(D.GEAR).forEach(id => { const g = D.GEAR[id], T = D.GEAR_TYPES[g.t];
        if (!T) { E.push(`${id}: type « ${g.t} » inconnu`); return; }
        if (!D.SLOTS[T.slot]) E.push(`${id}: emplacement « ${T.slot} » inconnu`);
        if (!(Number.isInteger(g.r) && g.r >= 0 && g.r < D.GEAR_PRIX.length)) E.push(`${id}: rang invalide`);
        if (typeof g.name !== 'string' || typeof g.desc !== 'string') E.push(`${id}: nom ou description manquant`);
        else if (INTERDIT.test(g.name + ' ' + g.desc)) E.push(`${id}: un objet ne reçoit ni nom divin, ni vertu, ni or, ni soie (exigences 8, 15, 16)`);
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
      Object.keys(D.GEAR_SHOPS).forEach(m => { if (!D.MAPS[m] || !D.MAPS[m].spots.includes('comptoir')) E.push(`boutique « ${m} » : carte sans comptoir`); D.GEAR_SHOPS[m].forEach(id => { if (!D.GEAR[id]) E.push(`boutique ${m}: pièce « ${id} » inconnue`); }); });
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
        });
      };

      for (const [id, h] of Object.entries(heroes)) {
        const w = `héros ${id}`;
        if (h.stratege !== undefined && h.stratege !== true) E.push(`${w}: « stratege » vaut true ou s'omet`);
        req(h, 'name', 'string', w); req(h, 'arabic', 'string', w); garde(h.name, w); (h.skills || []).concat(h.limit || []).forEach(k => garde(k && k.name, w));
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
        if (typeof e.lvl !== 'number' || e.lvl < (commun ? 0 : 1) || e.lvl > 12) E.push(`${w}: lvl ${commun ? '0 (calé sur le groupe) à 12' : '1–12'}`);
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

      (s.codex || []).forEach(c => {
        const w = `codex ${c.id}`;
        ['id', 'title', 'text'].forEach(k => req(c, k, 'string', w));
        if (!D.CODEX_CATS.includes(c.cat)) E.push(`${w}: cat « ${c.cat} » invalide (${D.CODEX_CATS.join('|')})`);
      });

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
        if (c.visite !== undefined && !(typeof c.visite === 'string' && c.visite === c.map && s.frame && !s.veillees && c.last === true && !c.after && c.retour === undefined)) E.push(`${w}: « visite » nomme le lieu du chapitre (sa carte), sur un chapitre « last » de l'histoire-cadre, sans « after » ni « retour »`);
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
                  if (typeof c.t !== 'string') E.push(`${wo}: option ${j} sans texte « t »`);
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
                    if (typeof x.t !== 'string' || typeof x.r !== 'string') E.push(`${wo}: manche ${ri} option ${xi} : « t » et « r » (réplique) requis`);
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
          if (!D.MAPS[c.map].spots.includes('priere')) E.push(`${we}: la carte ${c.map} n'a pas de natte où accomplir l'œuvre`);
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
      const mots = (id, o) => { const txt = (o.name || '') + ' ' + (o.desc || ''); if (SACRE.test(txt)) E.push(`${id}: un objet ne reçoit ni nom divin, ni vertu, ni rien de sacré changé en pouvoir (exigences 8, 15 et 17)`); if (NOM_INTERDIT.test(txt)) E.push(`${id}: ni Iblîs, ni démon, ni djinn dans le nom ou la description d'un objet (exigence 18)`); };
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

    // ce qu'une saga seule ne peut pas dire : les renvois entre sagas (« after ») et l'ordre sur la Chaîne
    function verifierEnsemble(sagas) {
      const E = [], jouables = sagas.filter(s => !s.commun && !s.frame), ids = new Set(jouables.map(s => s.id)), vus = {};
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
      verset: ['﴿', '﴾'], say: 330, nar: 360
    },
    en: {
      demon: /\b(iblis|satan|shaitans?|shaytans?|shayatin|devils?|demons?|djinns?|jinns?|jinni|genies?|ifrits?|ghouls?|fiends?)\b/i,
      divin: /\b(allah|god|gods|lord)\b/i,
      sacre: /\b(allah|god|lord|prophet|blessed|sacred|holy|saint(ly)?|relics?|talismans?|amulets?|miracles?|miraculous|gold|golden|gilded|silk|silken|zamzam|qur'?an|koran|mushaf|verses?|surah?|baraka|ruqya|angels?)\b/i,
      verset: ['“', '”'], say: 330, nar: 360
    },
    ja: {
      demon: /イブリース|サタン|シャイターン|悪魔|魔王|魔神|悪霊|鬼|妖怪|ジン(?![ァ-ヴー])|ジャーン|イフリート/,
      divin: /アッラー|(?<!精)神(?!経)|主よ|創造主/,
      sacre: /アッラー|(?<!精)神(?!経)|預言者|祝福|聖|遺物|護符|お守り|魔除け|奇跡|黄金|金色|金箔|金糸|金銀|絹|ザムザム|クルアーン|コーラン|啓典|章句|天使/,
      verset: ['「', '」'], say: 110, nar: 125
    }
  };
  const EFFECTIF = /[0-9٠-٩۰-۹０-９]|百|千|万|億|مئة|مائة|ألف|آلاف|\b(hundreds?|thousands?|dozens?)\b/i;
  const AUTEURS = /exup[eé]ry|scheler|petit prince|little prince|إ?كزوبيري|شيلر|الأمير الصغير|テグジュペリ|シェーラー|星の王子/i;
  const CHIFFRES = s => String(s).replace(/[٠-٩]/g, c => c.charCodeAt(0) - 0x660).replace(/[۰-۹]/g, c => c.charCodeAt(0) - 0x6F0).replace(/[０-９]/g, c => c.charCodeAt(0) - 0xFF10);
  const NUMEROS = s => (CHIFFRES(s).match(/\d+/g) || []).join(' ');
  // le genre d'un emplacement, d'après son chemin (langue.js : casesSaga, casesDefs)
  function genreDe(ou) {
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
      if ((g === 'say' || g === 'nar') && t.length > R[g]) avis.push(`${w}: ${g === 'say' ? 'réplique' : 'narration'} longue (${t.length} signes, ${R[g]} au plus)`); });
    return { erreurs, avis };
  }
  const api = { creer, verifierPaquet, verifierLangue, genreDe, LANGUES_REGLES: LANG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else racine.ISNAD_REGLES = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
