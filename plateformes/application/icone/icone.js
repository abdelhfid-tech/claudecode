/* ISNAD 2.x — l'icône de l'application, dessinée par le code (PROPOSITION, à valider par le décideur).
   Trois maillons d'or de la Chaîne, en diagonale, sur fond d'encre : les deux maillons des bouts vus de face, celui du
   milieu vu de biais, entrelacé avec eux (il passe sous l'un de leurs bords et sur l'autre). Les couleurs sont celles du jeu (v2/src/style.css : --ink, --gold, --sand,
   --panel). Aucune lettre, aucun symbole religieux, aucun édifice, aucune personne.
   svg({ fond, plein, cote }) rend le SVG :
     fond  : 'encre' (l'icône entière), 'aucun' (le premier plan d'une icône adaptative d'Android, fond transparent) ;
     plein : true → la chaîne occupe le carré entier (icône classique) ; 'rond' → elle tient dans un disque (l'icône ronde
             des anciens Android) ; false → elle reste dans le cercle central de 66 sur 108 que garde une icône adaptative
             (le masque du téléphone rogne le reste) ;
     cote  : la taille en pixels (le SVG est vectoriel : le rendu PNG se fait à cette taille).
   Le rendu PNG se fait dans un navigateur (v2/tools/plateformes/application.js, rendreIcones). */
const COULEURS = { encre: '#07060d', panneau: '#0e0c1c', or: '#e9c877', orClair: '#f3e7cc', orSombre: '#a88a45' };

function svg({ fond = 'encre', plein = true, cote = 1024 } = {}) {
  const K = COULEURS;
  // tout se dessine dans un carré de 108 (la grille d'une icône adaptative) ; plein : on resserre le cadre
  const vb = plein === 'rond' ? '5 5 98 98' : plein ? '13 13 82 82' : '0 0 108 108';
  const anneau = (cx, cy) => `<g transform="translate(${cx} ${cy}) rotate(-45)">
      <rect x="-15" y="-8.6" width="30" height="17.2" rx="8.6" fill="none" stroke="${K.encre}" stroke-width="8"/>
      <rect x="-15" y="-8.6" width="30" height="17.2" rx="8.6" fill="none" stroke="url(#or)" stroke-width="4.6"/>
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cote}" height="${cote}" viewBox="${vb}">
  <defs>
    <linearGradient id="or" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${K.orClair}"/><stop offset=".45" stop-color="${K.or}"/><stop offset="1" stop-color="${K.orSombre}"/>
    </linearGradient>
    <clipPath id="devant"><rect x="-30" y="-9" width="60" height="9"/></clipPath>
    <radialGradient id="halo" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="${K.panneau}"/><stop offset="1" stop-color="${K.encre}"/>
    </radialGradient>
  </defs>
  ${fond === 'encre' ? `<rect x="-20" y="-20" width="148" height="148" fill="url(#halo)"/>` : ''}
  <g transform="translate(54 54)">
    <!-- le maillon du milieu, vu de biais : un anneau aplati qui passe sous les deux autres -->
    <g transform="rotate(-45)">
      <rect x="-25" y="-5" width="50" height="10" rx="5" fill="none" stroke="${K.encre}" stroke-width="7.4"/>
      <rect x="-25" y="-5" width="50" height="10" rx="5" fill="none" stroke="url(#or)" stroke-width="3.8"/>
    </g>
    ${anneau(-14.2, 14.2)}
    ${anneau(14.2, -14.2)}
    <!-- son côté de devant repasse sur eux : les maillons s'entrelacent -->
    <g transform="rotate(-45)" clip-path="url(#devant)">
      <rect x="-25" y="-5" width="50" height="10" rx="5" fill="none" stroke="${K.encre}" stroke-width="7.4"/>
      <rect x="-25" y="-5" width="50" height="10" rx="5" fill="none" stroke="url(#or)" stroke-width="3.8"/>
    </g>
  </g>
</svg>`;
}

module.exports = { svg, COULEURS };
