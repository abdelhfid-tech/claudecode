#!/usr/bin/env node
/* ISNAD 2.x — la galerie des shorts : une page qui montre les dix films, chacun avec son texte d'accompagnement.
   Usage : node v2/tools/galerie.js
   Elle lit les films de promo/shorts/films/ (v2/tools/shorts.js) et les textes de promo/shorts/legendes.md, et écrit
   dans promo/shorts/galerie/ : index.html, films/NN.mp4 (des copies allégées, 720 × 1280, pour la page seulement) et
   affiches/NN.jpg. Rien de cela n'est versionné : une commande le refait. La page est faite pour un Artifact privé —
   elle ne publie rien et ne demande rien au-dehors, hors les polices. */
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const P = require('./promotion.js');
const RACINE = path.join(__dirname, '..', '..'), SCN = path.join(RACINE, 'promo/shorts'), FILMS = path.join(SCN, 'films'), DOS = path.join(SCN, 'galerie');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ff = (bin, args) => { const r = spawnSync(bin, args, { encoding: 'utf8' }); if (r.status) throw new Error(bin + ' : ' + (r.stderr || '').slice(0, 300)); return r.stdout; };

// les textes : « ## N — … », puis `fichier.mp4`, **Titre.** et **Description.**
function textes() {
  const md = fs.readFileSync(path.join(SCN, 'legendes.md'), 'utf8'), out = [];
  md.split(/\n## /).slice(1).forEach(bloc => { const m = /^(\d+) — /.exec(bloc); if (!m) return;
    const f = /`([^`]+\.mp4)`/.exec(bloc), t = /\*\*Titre\.\*\*\s*([^\n]+)/.exec(bloc), d = /\*\*Description\.\*\*\s*([\s\S]*?)(?:\n\n|\n\*|$)/.exec(bloc);
    if (f && t && d) out.push({ n: +m[1], fichier: f[1], titre: t[1].trim(), description: d[1].replace(/\s*\n\s*/g, ' ').trim() }); });
  return out;
}

const liste = textes().filter(s => fs.existsSync(path.join(FILMS, s.fichier)));
if (!liste.length) { console.log('Aucun film dans promo/shorts/films/ : lancer d’abord node v2/tools/shorts.js'); process.exit(1); }
fs.mkdirSync(path.join(DOS, 'films'), { recursive: true }); fs.mkdirSync(path.join(DOS, 'affiches'), { recursive: true });
let poids = 0;
liste.forEach(s => { const src = path.join(FILMS, s.fichier), nn = String(s.n).padStart(2, '0');
  s.duree = Math.round(parseFloat(ff('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src])));
  s.film = 'films/' + nn + '.mp4'; s.affiche = 'affiches/' + nn + '.jpg';
  ff('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', 'scale=720:1280:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', path.join(DOS, s.film)]);
  ff('ffmpeg', ['-v', 'error', '-y', '-ss', '1.3', '-i', src, '-frames:v', '1', '-vf', 'scale=540:960:flags=lanczos', '-q:v', '4', path.join(DOS, s.affiche)]);
  poids += fs.statSync(path.join(DOS, s.film)).size; });

const commun = `${P.NOM} — ${P.SOUS_TITRE}. Un jeu de rôle au tour par tour, en pixel art éclairé. Dans le navigateur, sans installation : ${P.ADRESSE}\n\n${P.RESERVE}`;
const cartes = liste.map(s => { const nn = String(s.n).padStart(2, '0');
  return `    <article class="film">
      <video id="film-${nn}" controls playsinline preload="none" poster="${s.affiche}" src="${s.film}" aria-label="Short ${s.n} : ${esc(s.titre)}"></video>
      <p class="rang">Short ${s.n} · ${s.duree} s</p>
      <h2>${esc(s.titre)}</h2>
      <p class="texte" id="texte-${nn}">${esc(s.description)}</p>
      <button type="button" class="copier" id="copier-${nn}" data-texte="${esc(s.titre + '\n\n' + s.description + '\n\n' + commun)}">Copier le texte</button>
    </article>`; }).join('\n');

const html = `<title>Dix shorts ${P.NOM}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@500;700&display=swap">
<style>
/* une seule colonne de lecture en tête, puis une grille de films verticaux ; l'habit du jeu : encre et or */
:root {
  color-scheme: dark;
  --encre: #07060d; --panneau: #100e1c; --or: #e9c877; --sable: #f3e7cc; --terne: #a79c86; --trait: rgba(233, 200, 119, .34);
  --f-titre: "Cinzel", "Trajan Pro", "Times New Roman", serif; --f-texte: "Alegreya", "Iowan Old Style", Georgia, serif;
}
* { box-sizing: border-box; }
html, body { min-height: 100%; }
body { margin: 0; background: var(--encre); color: var(--sable); font-family: var(--f-texte); font-size: 17px; line-height: 1.45;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 30px 56px; }
main { max-width: 1180px; margin: 0 auto; display: grid; gap: 30px; }
header { display: grid; gap: 10px; max-width: 62ch; }
h1 { margin: 0; font-family: var(--f-titre); font-weight: 700; font-size: clamp(1.5rem, 3.4vw + .6rem, 2.3rem); letter-spacing: .06em; line-height: 1.12; color: var(--or); text-wrap: balance; }
header p { margin: 0; }
.note { color: var(--terne); font-size: .92em; }
.grille { display: grid; grid-template-columns: repeat(auto-fill, minmax(214px, 1fr)); gap: 30px 20px; align-items: start; }
.film { display: grid; gap: 7px; min-width: 0; }
.film video { display: block; width: 100%; max-width: 100%; aspect-ratio: 9 / 16; background: #000; border: 1px solid var(--trait); border-radius: 6px; }
.rang { margin: 6px 0 0; font-family: var(--f-titre); font-size: .74em; letter-spacing: .16em; text-transform: uppercase; color: var(--terne); font-variant-numeric: tabular-nums; }
.film h2 { margin: 0; font-family: var(--f-titre); font-weight: 700; font-size: 1.04em; letter-spacing: .04em; line-height: 1.2; color: var(--or); text-wrap: balance; }
.texte { margin: 0; font-size: .95em; }
.copier { justify-self: start; margin-top: 2px; padding: .36em .9em; font: inherit; font-size: .84em; color: var(--sable); background: var(--panneau); border: 1px solid var(--trait); border-radius: 2em; cursor: pointer; }
.copier:hover { border-color: var(--or); }
.copier:focus-visible, video:focus-visible { outline: 2px solid var(--or); outline-offset: 2px; }
.copier.fait { color: var(--encre); background: var(--or); border-color: var(--or); }
footer { display: grid; gap: 8px; max-width: 70ch; padding-top: 22px; border-top: 1px solid var(--trait); color: var(--terne); font-size: .92em; }
footer p { margin: 0; }
footer b { color: var(--sable); font-weight: 700; }
</style>
<main>
  <header>
    <h1>Dix shorts pour ${P.NOM}</h1>
    <p>Dix films verticaux de quinze à vingt-cinq secondes, tirés du jeu lui-même, avec le texte proposé pour chacun.</p>
    <p class="note">Rien n’est publié : cette page est privée, et les films vous ont été remis à part, en pleine définition. Ici, ce sont des copies allégées, pour les revoir d’un coup d’œil.</p>
  </header>
  <section class="grille" aria-label="Les dix shorts">
${cartes}
  </section>
  <footer>
    <p><b>À joindre à chaque publication.</b> ${esc(P.NOM)} — ${esc(P.SOUS_TITRE)}. Un jeu de rôle au tour par tour, en pixel art éclairé. Dans le navigateur, sans installation : ${esc(P.ADRESSE)}</p>
    <p>${esc(P.RESERVE)}</p>
    <p><b>Images générées par IA.</b> Les deux premières secondes des shorts 1 et 2 sont un plan d’ambiance généré par IA (une lampe et des rouleaux ; un désert à l’aube). Les réseaux demandent de le signaler. Tout le reste est le jeu, filmé image par image.</p>
    <p>Les titres, les descriptions et les phrases posées sur l’image sont des propositions : à valider avant toute publication.</p>
  </footer>
</main>
<script>
// un seul film joue à la fois
const films = [...document.querySelectorAll('video')];
films.forEach(v => v.addEventListener('play', () => films.forEach(a => { if (a !== v) a.pause(); })));
// copier le texte d'un film ; si le presse-papiers se refuse, on sélectionne le texte pour le copier à la main
document.querySelectorAll('.copier').forEach(b => b.addEventListener('click', () => {
  const fait = () => { b.textContent = 'Copié'; b.classList.add('fait'); setTimeout(() => { b.textContent = 'Copier le texte'; b.classList.remove('fait'); }, 1800); };
  const aLaMain = () => { const p = document.getElementById(b.id.replace('copier', 'texte')), s = window.getSelection(), r = document.createRange(); r.selectNodeContents(p); s.removeAllRanges(); s.addRange(r); b.textContent = 'Texte sélectionné'; };
  try { navigator.clipboard.writeText(b.dataset.texte).then(fait, aLaMain); } catch (e) { aLaMain(); }
}));
</script>
`;
fs.writeFileSync(path.join(DOS, 'index.html'), html);
console.log(`✓ promo/shorts/galerie/index.html — ${liste.length} films, ${(poids / 1e6).toFixed(1)} Mo de copies allégées`);
liste.forEach(s => console.log(`  ${String(s.n).padStart(2, ' ')}. ${s.titre} — ${s.duree} s, ${(fs.statSync(path.join(DOS, s.film)).size / 1e6).toFixed(1)} Mo`));
