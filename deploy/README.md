# Mise en service sur votre serveur Hostinger

Deux éléments, sur le même serveur :

1. **Le radar** (Python, sans dépendance) collecte chaque jour et prépare les candidats du contenu réactif. Ses données restent sur le serveur, jamais sur GitHub : le dépôt est public.
2. **Le flux n8n « Radar : contenu réactif »** reçoit ces candidats, demande à Claude d'en choisir un et de rédiger un brouillon, vous l'envoie sur Telegram, puis attend votre décision. Rien n'est publié sans vous (niveau A).

```
cron (heure du serveur)           n8n
─────────────                     ──────────────────────────────────────────────────────────
05:17 collecte complète           Candidats du radar ─┐
toutes les 2 h : tendances                            ├─ Réglages ─ Claude choisit et rédige
06:47 candidats ── webhook ──►    Tendance repérée ───┘          │
                                  (formulaire)                   ▼
                                                     Telegram : brouillon + lien du formulaire
                                                                  │  vous choisissez
                                                      Programmer ─┴─ Rejeter
                                                          │
                                            Blotato (comptes texte) ou « à publier vous-même »
```

Durée d'installation : 30 à 45 minutes la première fois.

---

## Étape 1. Installer le radar (10 minutes)

Ouvrez un terminal sur le serveur : dans hPanel, VPS, puis « Terminal du navigateur », ou en SSH. Lancez :

```bash
curl -fsSL https://raw.githubusercontent.com/abdelhfid-tech/claudecode/claude/social-trends-europe-francophonie-qqsste/deploy/hostinger/install.sh -o install-radar.sh
less install-radar.sh            # relisez le script avant de le lancer (q pour quitter)
sudo bash install-radar.sh
```

Le script :
- vérifie Python 3.11 ou plus, git et cron, et les installe s'il le faut (Ubuntu 22.04 ou 24.04, Debian 12) ;
- installe le code dans `/opt/radar-decalage` et crée l'utilisateur système `radar`, sans droits d'administration ;
- met les données dans `/var/lib/radar-decalage` et les journaux dans `/var/log/radar-decalage` ;
- programme la collecte (fichier `/etc/cron.d/radar-decalage`) : chaque jour, toutes les 2 heures pour les tendances, et le lundi pour le relevé ville par ville (Paris, Lyon, Casablanca, Rabat, Marrakech, Fès, Tanger).

Premier relevé, tout de suite (environ 15 minutes) :

```bash
sudo -u radar radar-run collect
sudo -u radar radar-run health      # état des sources : c'est le pilote de 14 jours
sudo -u radar radar-run gaps        # premiers écarts de disponibilité des apps
sudo -u radar radar-run collect --cadence weekly   # relevé ville par ville (environ 5 minutes)
sudo -u radar radar-run villes --decalage casablanca:fes   # ce qui est installé à Casablanca et pas encore à Fès
sudo -u radar radar-run initiatives --buyer FR --seller MA --scenario petit_ia   # vous et l'IA
```

**Mise à jour** : relancez `sudo bash install-radar.sh`. Vos données, votre profil et vos réglages ne sont pas touchés.

**Profil** : `sudo -u radar nano /var/lib/radar-decalage/profile.toml` (pays vendeurs, langues, heures). Il reste sur le serveur.

---

## Étape 2. Créer le robot Telegram (5 minutes)

1. Dans Telegram, ouvrez **@BotFather**, envoyez `/newbot`, choisissez un nom. Notez le **jeton** qu'il donne.
2. Envoyez un message quelconque à votre nouveau robot.
3. Dans un navigateur, ouvrez `https://api.telegram.org/bot<JETON>/getUpdates` (remplacez `<JETON>`). Notez le nombre après `"chat":{"id":`. C'est votre **identifiant de discussion**.

---

## Étape 3. Clé de l'API Claude (5 minutes)

Le flux appelle l'API Claude une fois par jour, et une fois par tendance que vous saisissez.

1. Sur `console.anthropic.com`, créez une clé (menu API Keys) et ajoutez un moyen de paiement. Cette facturation à l'usage est distincte de votre abonnement Claude.
2. Coût estimé avec le modèle réglé dans le flux (4 $ par million de jetons en entrée, 20 $ en sortie) : environ 3 000 jetons lus et 2 000 à 4 000 écrits par brouillon, soit 5 à 10 centimes, ou 2 à 5 $ par mois. C'est une estimation : vérifiez la dépense réelle sur la console après une semaine, et fixez-y une limite mensuelle.

---

## Étape 4. Importer le flux dans n8n (15 minutes)

1. Téléchargez [`n8n/radar-contenu-reactif.json`](n8n/radar-contenu-reactif.json) (bouton « Download raw file » sur GitHub).
2. Dans n8n : Workflows, puis « Import from File ».
3. Créez les identifiants (menu Credentials), puis choisissez-les sur chaque nœud :

| Nœud | Type d'identifiant | Contenu |
|---|---|---|
| Candidats du radar | Header Auth | Name : `X-Radar-Token` ; Value : un jeton créé sur le serveur avec `openssl rand -hex 24` |
| Tendance repérée | Basic Auth | un identifiant et un mot de passe de votre choix (le formulaire déclenche un appel payant) |
| Claude : choisir et rédiger | Header Auth | Name : `x-api-key` ; Value : votre clé Anthropic |
| Blotato : programmer | Header Auth | Name : `blotato-api-key` ; Value : votre clé Blotato (facultatif) |
| Les 4 nœuds Telegram | Telegram API | le jeton de @BotFather |

4. Ouvrez le nœud **Réglages** et remplissez `telegram_chat_id`. Pour Blotato, voir l'étape 5.
5. Activez (ou publiez) le flux.
6. Ouvrez le nœud **Candidats du radar** et copiez l'adresse **de production** (elle se termine par `/webhook/radar-reactif`).

Puis, sur le serveur :

```bash
sudo nano /etc/radar-decalage.env
# RADAR_N8N_WEBHOOK=https://<votre-n8n>/webhook/radar-reactif
# RADAR_N8N_TOKEN=<le même jeton que dans n8n>
sudo -u radar radar-run reactive --post      # test : vous devez recevoir un brouillon sur Telegram
```

Si Claude ne retient aucun candidat (par exemple un jour de sport et de célébrités), aucun message n'arrive : ce n'est pas une erreur. Pour un test sûr, utilisez le formulaire **Tendance repérée** (son adresse de production est dans le nœud).

---

## Étape 5. Blotato (facultatif, 29 $ par mois et plus)

Sans Blotato, le flux s'arrête à votre validation : vous publiez vous-même le texte reçu. Avec Blotato, un texte validé est programmé au prochain créneau libre :

1. Récupérez l'identifiant de chaque compte connecté à Blotato :
   `curl -s -H "blotato-api-key: <CLÉ>" https://backend.blotato.com/v2/users/me/accounts`
2. Dans le nœud **Réglages**, remplissez la liste `blotato`, par exemple :
   `{ accountId: "12345", platform: "linkedin", langue: "fr" }`.
   Pour Facebook, ajoutez `pageId` (voir `/v2/users/me/accounts/<id>/subaccounts`).
3. Seuls les comptes texte sont programmés (LinkedIn, Threads, X, Bluesky, Facebook). Pour TikTok, Instagram ou YouTube, vous recevez un script de vidéo à filmer vous-même : l'IA en coulisses, vous en façade.

Le nœud n8n officiel de Blotato (`@blotato/n8n-nodes-blotato`) peut remplacer l'appel HTTP si vous préférez.

---

## Au quotidien

- **06:47** (heure du serveur, UTC le plus souvent) : le radar envoie les candidats du jour. Si Claude en retient un, vous recevez le brouillon sur Telegram avec un lien vers un formulaire. Choisissez « Programmer » ou « Rejeter ». Sans réponse sous 48 heures, rien n'est publié.
- **Quand vous voyez une tendance** (TikTok, Instagram) : remplissez le formulaire **Tendance repérée**. Environ 15 minutes par semaine.
- **Alerte** : si une source du radar répond moins de 90 % des jours, un message Telegram vous prévient.
- **Bilan du pilote** : `sudo -u radar radar-run health --days 14`.

## Règles respectées

- Le radar lit et respecte le fichier robots.txt de chaque site, et ne contourne aucun refus.
- Seules des données agrégées sont stockées : aucun profil de personne.
- Le formulaire de validation ne se déclenche que par votre clic sur « Envoyer » : un aperçu de lien ne peut rien publier.
- Les visuels générés par IA sont signalés dans le brouillon ; ils doivent porter la mention « contenu généré par IA ».
