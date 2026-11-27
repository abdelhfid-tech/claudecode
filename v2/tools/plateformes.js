#!/usr/bin/env node
/* ISNAD 2.x — les paquets des plateformes, faits à côté du jeu (le jeu n'est pas modifié).
   Usage : node v2/tools/plateformes.js <cible…>        fait le paquet de chaque cible (web, itch, …)
           node v2/tools/plateformes.js tout            toutes les cibles connues
           node v2/tools/plateformes.js essai <cible>   le fait, puis l'éprouve dans un navigateur (« PAQUET CONFORME »)
           node v2/tools/plateformes.js polices         retélécharge les polices de Google Fonts et les réduit (le seul pas
                                                        qui demande le réseau ; le reste se fait sans lui)
   Une cible est un module, v2/tools/plateformes/<cible>.js, chargé par son nom : en ajouter une, c'est ajouter son fichier.
   Il exporte { description, faire(C) → { page, fichiers, … }, essai?(C, fait, dit) } (voir web.js et itch.js).
   Les sorties vont dans plateformes/sortie/<cible>/ (non versionné). */
const fs = require('fs'), path = require('path');
const DOS = path.join(__dirname, 'plateformes'), PAS_CIBLES = ['commun', 'polices', 'essai'];
const cibles = () => fs.readdirSync(DOS).filter(f => /\.js$/.test(f)).map(f => f.slice(0, -3)).filter(n => !PAS_CIBLES.includes(n));
const charger = nom => { if (!/^[a-z0-9-]+$/.test(nom) || !cibles().includes(nom)) throw new Error(`cible inconnue : ${nom} (connues : ${cibles().join(', ')})`); return require(path.join(DOS, nom + '.js')); };

(async () => {
  const a = process.argv.slice(2), C = require(path.join(DOS, 'commun.js'));
  if (!a.length) { console.log(`Cibles : ${cibles().map(n => `${n} (${charger(n).description})`).join(' ; ')}\nUsage : node v2/tools/plateformes.js <cible…> | tout | essai <cible> | polices`); return; }
  if (a[0] === 'polices') { require(path.join(DOS, 'polices.js'))(); return; }
  if (a[0] === 'essai') {
    if (a.length !== 2) throw new Error('essai : une cible à la fois (node v2/tools/plateformes.js essai web)');
    const m = charger(a[1]), fait = await m.faire(C);
    const anomalies = await require(path.join(DOS, 'essai.js'))(C, a[1], m, fait);
    process.exit(anomalies ? 1 : 0);
  }
  for (const nom of a[0] === 'tout' ? cibles() : a) await charger(nom).faire(C);
})().catch(e => { console.error('✗ ' + (e && e.stack || e)); process.exit(1); });
