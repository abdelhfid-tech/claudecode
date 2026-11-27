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
  }
};
