#!/usr/bin/env node
/* ISNAD 2.x — la relecture du joueur de 10 à 12 ans (D229 ; le décideur, 25 novembre : « une relecture / correction langue
   par langue […] dans la peau d'un joueur de 10-12 ans passionné de rpg qui maîtrise la langue en question ainsi que
   l'histoire des compagnons »).
   Cet outil ne relit rien : il prépare ce que lisent les relecteurs, et pose ce qu'ils ont corrigé.
   Usage : node v2/tools/relecture.js feuilles [lot…]   écrit v2/.smoke/relecture/<langue>/<lot>.json pour fr, ar, en, ja :
                                                         les textes du lot dans l'ordre où on les joue — { k, ou, qui, fr, t }
                                                         (en arabe, tv : la forme vocalisée ; « intouchable » : une parole
                                                         citée ou sa source ; « a_revoir » : le français a changé depuis)
           node v2/tools/relecture.js lots               la liste des lots et leur taille
   Les lots : « essai-1 » (le prologue ; de la saga d'Abû Bakr, l'en-tête, les héros, le chapitre 1 et le Recueil) et
   « essai-2 » (ses chapitres 2 et 3, ses chimères) ; puis un lot par fichier du jeu (« saga_umar », « frame », « caid »,
   « coeur », « tables », « moteur »…).
   Les cinq cases du relecteur, ce qu'il ne touche jamais et la marche à suivre sont dans v2/docs/langues/relecture-10-12.md.
   Poser une correction : node v2/tools/langues.js poser <langue> <fichier> <écrit.json> (arabe, anglais, japonais), puis
   node v2/tools/voyelles.js poser <fichier> <travail.json> ; le français se corrige dans v2/src/data/ ou v2/src/core/. */
const fs = require('fs'), path = require('path');
const V2 = path.join(__dirname, '..'), LANG = path.join(V2, 'src/lang'), OUT = path.join(V2, '.smoke/relecture');
const FICHIERS = ['saga_abubakr', 'saga_umar', 'saga_khalid', 'saga_uthman', 'saga_ali', 'frame', 'caid', 'coeur', 'tables', 'moteur'];
const TETE = /^(name|epithet|years|lightName|ambiance|tagline)/;
// l'ordre de lecture d'un récit : l'en-tête, l'ouverture, les héros, les chapitres, le Recueil, les chimères
const RANG = ou => (TETE.test(ou) ? 0 : /^intro/.test(ou) ? 1 : /^heroes/.test(ou) ? 2 : /^chapters/.test(ou) ? 3 : /^codex/.test(ou) ? 4 : /^enemies/.test(ou) ? 5 : 6);
const LOTS = {
  'essai-1': [['frame', ou => TETE.test(ou) || /^chapters\[0\]/.test(ou)], ['saga_abubakr', ou => TETE.test(ou) || /^(intro|heroes|codex|chapters\[0\])/.test(ou)]],
  'essai-2': [['saga_abubakr', ou => /^(enemies|chapters\[[12]\])/.test(ou)]]
};
FICHIERS.forEach(f => { LOTS[f] = [[f, () => true]]; });
const lire = (l, f) => JSON.parse(fs.readFileSync(path.join(LANG, l, f + '.json'), 'utf8')).textes;
const voyelles = f => { const p = path.join(LANG, 'ar/voyelles', f + '.json'); return fs.existsSync(p) ? new Map(JSON.parse(fs.readFileSync(p, 'utf8')).textes.map(x => [x.k, x.tv])) : new Map(); };
function lot(nom, langue) {
  const L = [];
  LOTS[nom].forEach(([f, garde]) => {
    const T = lire(langue === 'fr' ? 'en' : langue, f), tv = langue === 'ar' ? voyelles(f) : null;
    T.map((x, i) => [x, i]).filter(([x]) => garde(x.ou || '')).sort((a, b) => (/^(saga_|frame|caid)/.test(f) ? RANG(a[0].ou) - RANG(b[0].ou) : 0) || a[1] - b[1]).forEach(([x]) => {
      const e = { fichier: f, k: x.k, ou: x.ou }; if (x.qui) e.qui = x.qui; e.fr = x.fr;
      if (langue !== 'fr') { e.t = x.t; if (tv && tv.has(x.k)) e.tv = tv.get(x.k); if (x.a_revoir) { e.a_revoir = true; e.fr_avant = x.fr_avant; } }
      if (/<quote>[12]$/.test(x.ou || '')) e.intouchable = /1$/.test(x.ou) ? 'parole citée' : 'source de la parole';
      L.push(e); });
  });
  return L;
}
const cmd = process.argv[2], noms = process.argv.slice(3);
if (cmd === 'lots') { Object.keys(LOTS).forEach(n => { const L = lot(n, 'fr'); console.log(`${n} : ${L.length} textes, ${L.reduce((s, x) => s + x.fr.length, 0)} signes`); }); }
else if (cmd === 'feuilles') {
  (noms.length ? noms : ['essai-1', 'essai-2']).forEach(n => { if (!LOTS[n]) { console.log('✗ lot inconnu : ' + n); process.exitCode = 1; return; }
    ['fr', 'ar', 'en', 'ja'].forEach(l => { const L = lot(n, l), p = path.join(OUT, l, n + '.json'); fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, '[\n' + L.map(x => JSON.stringify(x)).join(',\n') + '\n]\n'); console.log(`✓ ${path.relative(V2, p)} — ${L.length} textes`); }); });
} else { console.log('Usage : node v2/tools/relecture.js feuilles [lot…] | lots'); process.exitCode = 1; }
