# ISNAD · plateformes — réduit une tranche de police (woff2) aux caractères voulus, sans rien perdre de sa mise en forme.
# Usage : python3 -I reduire.py <entrée.woff2> <sortie.woff2> <fichier des caractères (U+XXXX, un par ligne)>
# Écrit sur la sortie standard, en JSON : les caractères gardés (le cmap de la tranche réduite) et la licence que la police
# porte elle-même (champs 0, 13 et 14 de sa table « name »). Toutes les fonctions de mise en forme (GSUB, GPOS : liaisons
# et voyelles de l'arabe, crénage) sont gardées ; les noms aussi, pour que la licence voyage avec le fichier.
import json, sys
from fontTools import subset
from fontTools.ttLib import TTFont

entree, sortie, liste = sys.argv[1:4]
def nom(f, i):
    r = f['name'].getDebugName(i)
    return r or ''
avant = TTFont(entree)
porte = set(avant.getBestCmap().keys())
voulus = set()
with open(liste) as fl:
    for ligne in fl:
        ligne = ligne.strip()
        if ligne: voulus.add(int(ligne.replace('U+', ''), 16))
garde = sorted(porte & voulus)
info = {'avant': sorted(porte), 'licence': nom(avant, 13), 'urlLicence': nom(avant, 14), 'copyright': nom(avant, 0), 'nom': nom(avant, 4)}
if not garde:
    info['garde'] = []
    print(json.dumps(info)); sys.exit(0)
o = subset.Options()
o.layout_features = ['*']      # toutes les fonctions de mise en forme
o.layout_scripts = ['*']
o.name_IDs = ['*']; o.name_languages = ['*']; o.name_legacy = True
o.notdef_outline = True; o.glyph_names = False; o.legacy_kern = True
o.hinting = True; o.drop_tables = []
o.flavor = 'woff2'
f = TTFont(entree)
s = subset.Subsetter(o); s.populate(unicodes=garde); s.subset(f)
f.flavor = 'woff2'; f.save(sortie)
info['garde'] = sorted(TTFont(sortie).getBestCmap().keys())
print(json.dumps(info))
