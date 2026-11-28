---
name: radar-kit
description: Kit de lancement d'un test de demande déjà briefé (canal d'abord, instrumentation, landing page, posts, visuels, script vidéo). Ne publie jamais rien.
argument-hint: "<identifiant de l'initiative>"
disable-model-invocation: true
---

# Kit de lancement

Initiative : $ARGUMENTS (le brief doit exister dans `workspace/initiatives/<identifiant>/brief.md`).

Tout va dans `workspace/initiatives/<identifiant>/kit/`. Rien n'est publié, envoyé ou programmé sans une demande explicite de l'utilisateur pour cette action précise.

1. **Plan de canal chiffré** (`canal.md`) : liste des 100 premiers prospects ou communautés, messages d'approche, calendrier sur 2 à 3 semaines, budget de test payant éventuel (50 à 100 €).
2. **Instrumentation** (`mesure.md`) : seuil du test repris du brief, liens suivis (paramètres UTM), outil de mesure de la page, tableau de suivi.
3. **Landing page** (`landing/index.html`) : une page statique, une promesse, une preuve, un appel à l'action (liste d'attente ou précommande). Utilise la skill `frontend-design` si elle est disponible. Déploiement sur Vercel seulement sur demande.
4. **Dix posts** (`posts.md`) en français, et en darija si le profil l'indique. Règle : l'IA en coulisses, l'humain en façade ; mention des contenus générés par IA quand elle s'applique ; mention « Publicité » ou « Collaboration commerciale » pour tout lien affilié ou partenariat.
5. **Visuels** (`visuels.md`) : consignes pour Canva (formats, textes, palette). Création dans Canva seulement sur demande.
6. **Script de vidéo courte** (`video.md`), et voix off ElevenLabs seulement sur demande (cela consomme des crédits).

Si l'utilisateur demande des brouillons dans Postiz, crée-les en brouillon, jamais en publication programmée, et dis où les trouver.
