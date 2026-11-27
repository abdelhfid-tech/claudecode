/* ISNAD 2.x — plateformes : la cible « crazygames » (CrazyGames, « Basic Launch » : sans SDK, sans publicité, sans revenu).
   plateformes/sortie/crazygames/isnad-<numéro>-crazygames.zip : index.html à la racine, rien d'autre. C'est le paquet « web »
   plus un court préambule (crazygames/preambule.js et .css : l'anglais d'office, pas de plein écran maison, user-select
   complet) inséré avant la fin de <head> ; le jeu n'est pas modifié, et c'est contrôlé : ôtés les deux blocs, on retrouve
   le paquet web octet pour octet. L'essai propre à cette cible : node v2/tools/plateformes/crazygames/essai.js. */
const fs = require('fs'), path = require('path');
const DOS = path.join(__dirname, 'crazygames');
module.exports = {
  description: 'Basic Launch : le paquet web + un préambule (anglais d’office, pas de plein écran maison), en zip',
  async faire(C) {
    const w = require('./web.js').faire(C);
    const js = fs.readFileSync(path.join(DOS, 'preambule.js'), 'utf8'), css = fs.readFileSync(path.join(DOS, 'preambule.css'), 'utf8');
    const bloc = `<style id="crazygames-css">\n${css}</style>\n<script id="crazygames-preambule">\n${js}</script>\n`;
    if (w.html.split('</head>').length !== 2) throw new Error('ÉCART crazygames : le jeu n’a pas exactement un </head>');
    const html = w.html.replace('</head>', () => bloc + '</head>');
    if (html.replace(bloc, '') !== w.html) throw new Error('ÉCART crazygames : ôté le préambule, on ne retrouve pas le paquet web');
    const dehors = C.ressourcesDehors(html); if (dehors.length) throw new Error('ÉCART crazygames : une ressource au-dehors — ' + dehors.join(' | '));
    const z = C.zip([{ nom: 'index.html', donnees: Buffer.from(html, 'utf8') }], C.dateDuJeu(w.J));
    fs.rmSync(path.join(C.SORTIE, 'crazygames'), { recursive: true, force: true });
    const f = C.ecrire('crazygames', `isnad-${w.J.numero}-crazygames.zip`, z), L = C.lireZip(fs.readFileSync(f));
    if (L.length !== 1 || L[0].nom !== 'index.html' || !L[0].donnees.equals(Buffer.from(html, 'utf8'))) throw new Error('ÉCART crazygames : le zip relu n’est pas index.html seul');
    const taille = z.length, brut = Buffer.byteLength(html);
    if (brut > 50e6) throw new Error('ÉCART crazygames : le chargement initial dépasse 50 Mo (' + C.mo(brut) + ')');
    console.log(`✓ crazygames — ${path.relative(C.RACINE, f)} : zip ${C.mo(taille)}, index.html ${C.mo(brut)} (≤ 50 Mo initial, ≤ 250 Mo en tout, 1 fichier ≤ 1500) ; préambule ${(Buffer.byteLength(bloc) / 1024).toFixed(1)} Ko, ôté on retrouve le paquet web à l’octet`);
    return Object.assign({}, w, { html, page: C.ecrire('crazygames', 'index.html', html), zip: f, entrees: L.map(e => e.nom) });
  },
  /* « essai crazygames » : 1. l'essai propre au paquet (crazygames/essai.js : l'anglais d'office, aucun plein écran, le
     cadre d'une autre origine) ; 2. l'essai commun d'un paquet de jeu, manette.js et loupe.js compris, sur le paquet livré
     dont on n'a changé que la langue d'office, mise en français (ces contrôles lisent les libellés français) : le
     changement est contrôlé, c'est la seule différence avec le zip. */
  async essai(C, fait) {
    const { spawnSync } = require('child_process'), os = require('os');
    const r = spawnSync(process.execPath, [path.join(DOS, 'essai.js')], { stdio: 'inherit' });
    let anomalies = r.status === 0 ? 0 : 1;
    const AVANT = "o.lang = 'en'", APRES = "o.lang = 'fr'";
    if (fait.html.split(AVANT).length !== 2) throw new Error('ÉCART crazygames : la langue d’office n’est pas posée une seule fois dans le préambule');
    const html = fait.html.replace(AVANT, APRES);
    if (html.replace(APRES, AVANT) !== fait.html) throw new Error('ÉCART crazygames : la copie en français diffère du paquet par autre chose que la langue d’office');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'isnad-crazygames-fr-')), page = path.join(tmp, 'index.html');
    fs.writeFileSync(page, html);
    console.log(`— essai commun sur le paquet livré, la langue d'office mise en français (seule différence, contrôlée) : ${page}`);
    anomalies += await require('./essai.js')(C, 'crazygames', this, Object.assign({}, fait, { zip: null, entrees: null, page }));
    return anomalies;
  }
};
