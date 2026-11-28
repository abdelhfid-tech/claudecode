# Axe d'étude : spécification des plugins Claude Code et connecteurs à prévoir pour le « Radar d'arbitrage de tendances »

Dossier établi le 2026-11-28. Version de référence : Claude Code 2.1.332, publiée le 25 novembre 2026 ([changelog](https://code.claude.com/docs/en/changelog.md)), installée dans l'environnement de test (`claude --version` → `2.1.332`).

Convention de fiabilité utilisée partout :
- **[V]** fait vérifié sur une source primaire consultée le 2026-11-28 (documentation officielle, page de prix de l'éditeur, catalogue JSON officiel) ou par un test exécuté ici.
- **[S]** information secondaire (agrégateur, blog, extrait de moteur de recherche) que je n'ai pas pu confirmer sur la page primaire.
- **[H]** hypothèse ou inférence de ma part.

Limite de méthode : le quota de recherches web de la session a été épuisé en fin d'étude. Quelques points (conditions Ahrefs, texte exact de la clause non commerciale de Vercel Hobby, conditions officielles Reddit 2026) n'ont donc pas pu être revérifiés. Ils sont listés dans les questions ouvertes.

---

## 1. Synthèse

1. **Le format plugin est mûr et documenté en détail.** Un plugin est un répertoire avec un manifeste optionnel `.claude-plugin/plugin.json` (seul `name` est obligatoire). Il peut contenir des skills, des commandes (format ancien), des sous-agents, des hooks, des serveurs MCP et LSP, des *monitors*, des *workflows* (orchestrations JavaScript), des styles de sortie, des thèmes, des *channels*, un module JS appelé « mod », un dossier `bin/` et une suite d'évaluations `evals/` [V] ([manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference.md)).
2. **La chaîne qualité est complète.** `claude plugin validate --strict` vérifie le manifeste et le catalogue. `claude plugin eval` exécute des cas de test avec et sans le plugin, accepte des mocks de serveurs MCP et sert de seuil bloquant en CI. `claude plugin tag` crée les tags de version [V]. Nous avons écrit un prototype « trend-radar » (marketplace, plugin, 2 skills, 1 agent, hook, MCP, eval) : la validation passe et le plugin se charge en mode `-p` [V, test].
3. **Piège central pour l'exécution récurrente.** Une session cloud, donc aussi une tâche planifiée cloud, ne charge pas les plugins installés en scope utilisateur. Elle n'ajoute pas non plus les marketplaces déclarées dans le `.claude/settings.json` du dépôt [V] ([cloud environments](https://code.claude.com/docs/en/cloud-environments.md)). Pour qu'une tâche cloud ait le radar, deux voies : (a) ajouter le plugin au compte claude.ai, qui le synchronise dans les sessions cloud ; (b) committer skills, agents et `.mcp.json` dans le dépôt cloné à chaque exécution.
4. **Un plugin ne peut pas se planifier lui-même.** Le manifeste n'a aucun champ de planification. Les hooks ne se déclenchent que sur des événements d'une session déjà ouverte. Les monitors ne démarrent pas en mode `-p`. La récurrence passe par les tâches planifiées cloud (intervalle minimum 1 h, 100 exécutions/h par compte, en *research preview*), les tâches planifiées Desktop (machine allumée), `/loop` (session ouverte), un cron GitHub Actions (`anthropics/claude-code-action@v1`, qui sait installer des plugins) ou l'Agent SDK [V].
5. **Publication des rapports : utiliser les Artifacts.** Ils sont disponibles sur Pro/Max/Ultra/Team/Enterprise avec une connexion claude.ai. Ils sont désactivés par défaut en `-p`, dans l'Agent SDK et dans la GitHub Action. Une tâche planifiée cloud en mode auto peut publier, ou republier un artifact existant, sans demander [V] ([artifacts](https://code.claude.com/docs/en/artifacts.md), [routines](https://code.claude.com/docs/en/routines.md)). Une page publiée peut appeler les connecteurs claude.ai du lecteur, pas les serveurs MCP locaux.
6. **Connecteurs : la plupart des briques existent en version officielle.** Côté collecte, Apify, Firecrawl, Exa, Tavily, Similarweb, Ahrefs et Semrush sont des connecteurs « partner » de l'annuaire claude.com. Firecrawl, Exa, Tavily et Bright Data ont aussi un plugin dans la marketplace officielle. Apify publie sa propre marketplace `apify/agent-skills`. Brave, Perplexity et DataForSEO ont un serveur MCP officiel mais ni plugin ni connecteur. Il n'existe pas d'API Google Trends générale (alpha sur candidature), ni de MCP officiel YouTube ou Reddit [V].
7. **Côté exécution, tout est couvert.** Vercel, Supabase, Stripe, Canva, Hugging Face, Notion, Slack, Airtable, Cloudflare et Postiz ont un plugin officiel ou listé. ElevenLabs, Gmail, Google Drive et Shopify ont un connecteur officiel [V]. Contraintes structurantes pour la francophonie : Stripe n'est pas proposé au Maroc, au Sénégal, en Tunisie ni en Algérie (la Côte d'Ivoire passe par l'« Extended network ») ; Postiz n'a pas d'offre gratuite ; le plan gratuit de Supabase met en pause un projet après 1 semaine d'inactivité [V].
8. **Recommandation d'architecture.** Un plugin `trend-radar` sans `bin/`, pour rester installable sur claude.ai et donc synchronisable dans les tâches cloud. Il contient environ 7 skills (collecte US, diffusion UE, transposition pays × niche × lifestyle, initiatives, rapport, configuration, référentiel des sources), 5 sous-agents, un workflow de *fan-out* tendance × marché, des hooks de budget et de traçabilité, et un serveur MCP local « radar-store ». Les grosses charges utiles vont dans des fichiers, pas dans le contexte. MVP des connecteurs : Apify + DataForSEO + YouTube Data API + Exa (ou Firecrawl) + GitHub, puis Artifacts pour la publication.

---

## 2. Structure d'un plugin (état au 2026-11-28)

### 2.1 Arborescence standard [V]

Source : [Plugin manifest reference — Standard layout](https://code.claude.com/docs/en/plugins/manifest-reference.md), [Add components](https://code.claude.com/docs/en/plugins/components.md).

| Composant | Emplacement par défaut | Remarques clés |
|---|---|---|
| Manifeste | `.claude-plugin/plugin.json` | Optionnel. Tout le reste va à la racine du plugin, jamais dans `.claude-plugin/` |
| Skills | `skills/<nom>/SKILL.md` | Format recommandé. Un `SKILL.md` seul à la racine forme un plugin à skill unique |
| Commandes | `commands/*.md` | Format ancien, « prefer `skills/` for new plugins » |
| Sous-agents | `agents/*.md` (récursif) | Sous-dossiers intégrés au nom : `plugin:sous-dossier:agent` |
| Hooks | `hooks/hooks.json` | Enveloppe `{"hooks": {...}}` obligatoire dans le fichier |
| Serveurs MCP | `.mcp.json` | Accepte aussi les bundles `.mcpb`/`.dxt` (chemin ou URL https) |
| Serveurs LSP | `.lsp.json` | Diagnostics de code |
| Styles de sortie | `output-styles/` | |
| Workflows | `workflows/*.js` | Orchestrations de sous-agents, invoquées en `/plugin:nom` |
| Thèmes | `themes/` | Sous `experimental.themes` |
| Monitors | `monitors/monitors.json` | Sous `experimental.monitors` |
| Exécutables | `bin/` | Ajoutés au `PATH` de Bash. **claude.ai et Cowork refusent d'installer un plugin qui a un `bin/` à la racine** |
| Évaluations | `evals/` | Lues par `claude plugin eval` |
| Mod | `modules` dans `hooks/hooks.json` | Gestionnaires JS/TS exécutés dans Claude Code : panneaux, commandes, minuteries |

Un `CLAUDE.md` placé à la racine du plugin **n'est pas chargé**. Le validateur le signale par un avertissement. Les consignes permanentes doivent donc aller dans une skill [V].

### 2.2 Champs de `plugin.json` [V]

Source : [manifest reference — Fields](https://code.claude.com/docs/en/plugins/manifest-reference.md).

| Champ | Type | Statut / règle |
|---|---|---|
| `name` | string | **Seul champ obligatoire.** Kebab-case, sans espace, `@`, `:` ni `/`. Sert d'espace de noms (`plugin:skill`). Refusés : préfixes `claude-`, `anthropic-`, `anthropics-`, `cc-plugin-` ; noms `claude`, `claude-code`, etc. ; `official` accolé à `claude`/`anthropic`. Le mot entier `claude` ailleurs dans le nom donne un avertissement |
| `displayName`, `description`, `author{name,email,url}`, `homepage`, `repository`, `license` (SPDX), `keywords` | | Métadonnées. Le validateur avertit si `version`, `description` ou `author` manque |
| `version` | string | Non vérifié contre semver. **Une fois fixé, l'utilisateur reste sur cette version tant qu'elle ne change pas** |
| `defaultEnabled` | bool | `true` par défaut |
| `engines.claude-code` | plage semver | À partir de v2.1.323. Les versions 2.0.15 à 2.1.75 rejettent le manifeste s'il contient ce champ |
| `dependencies` | tableau | `"nom"`, `"nom@marketplace"` ou objet avec `version` |
| `network.hosts` | objet | Informatif depuis v2.1.328 : listé par `validate`, **n'autorise ni ne bloque aucun hôte** |
| `userConfig` | objet | Valeurs demandées à l'utilisateur. Types `string`, `number`, `boolean`, `directory`, `file`. `sensitive: true` envoie la valeur au trousseau sécurisé. `options` (v2.1.271+) affiche une liste de choix |
| `channels` | tableau | Lie un canal à un serveur MCP du plugin |
| `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`, `outputStyles`, `workflows` | chemins ou inline | `skills` **s'ajoute** au dossier par défaut. `commands`, `agents`, `outputStyles` et `workflows` **remplacent** le dossier par défaut. `hooks`, `mcpServers` et `lspServers` **fusionnent** avec le fichier par défaut |
| `experimental.{themes, monitors, evals}` | | Forme susceptible de changer |
| `icon`, `documentationUrl`, `supportUrl`, `privacyPolicyUrl`, `termsOfServiceUrl` | | Lus seulement par l'annuaire Anthropic |
| `metadata` | objet | Libre, ignoré par Claude Code |

Autres règles :
- Tout chemin commence par `./`, reste dans la racine du plugin et doit exister. `..`, les liens symboliques sortants et les barres obliques inverses sont refusés.
- Une clé inconnue au niveau supérieur est retirée avec un avertissement.
- Une clé inconnue dans `userConfig`, `channels`, `lspServers` ou `monitors` est une erreur qui empêche le chargement.

### 2.3 Variables et persistance [V]

| Variable | Valeur | Usage |
|---|---|---|
| `${CLAUDE_PLUGIN_ROOT}` | Dossier de la version installée. **Change à chaque mise à jour** | Scripts et fichiers livrés. Ne jamais y écrire d'état |
| `${CLAUDE_PLUGIN_DATA}` | `~/.claude/plugins/data/<id>/`, conservé d'une mise à jour à l'autre, supprimé à la désinstallation sauf `--keep-data` | `node_modules`, environnement Python, cache, base locale |
| `${CLAUDE_PROJECT_DIR}` | Racine du projet | |
| `${CLAUDE_SKILL_DIR}` | Dossier de la skill | Scripts propres à une skill |
| `${user_config.KEY}` / `CLAUDE_PLUGIN_OPTION_<KEY>` | Valeurs de `userConfig` | Substitution refusée dans les hooks en forme shell, les monitors et `headersHelper`. Une valeur sensible n'est pas substituée dans le texte d'une skill |

Ces variables **ne sont pas présentes** dans l'environnement des commandes que Claude lance via l'outil Bash. Il faut écrire `${CLAUDE_PLUGIN_ROOT}` dans le corps Markdown de la skill, que Claude Code substitue au chargement [V]. Claude Code installe automatiquement les dépendances Node d'un plugin copié depuis une marketplace. Pour Python, prévoir un hook `SessionStart` qui installe dans `${CLAUDE_PLUGIN_DATA}` [V] ([plugin loading](https://code.claude.com/docs/en/plugins/loading.md)).

### 2.4 Skills : frontmatter et limites [V]

Source : [Skills](https://code.claude.com/docs/en/skills.md).

| Champ | Effet |
|---|---|
| `name` | Dernier segment de la commande : `/plugin:name` |
| `description` (recommandé) + `when_to_use` | Texte présent en permanence dans le contexte. **Tronqué à 1 536 caractères** au total |
| `disable-model-invocation: true` | Seul l'utilisateur peut lancer la skill. Elle ne s'exécute pas quand une tâche planifiée de session la prend comme prompt |
| `user-invocable: false` | Seul Claude peut la lancer (connaissance de fond) |
| `allowed-tools` / `disallowed-tools` | Pré-autorise ou retire des outils **pendant le tour** de l'invocation |
| `model`, `effort` | Modèle et niveau d'effort du tour, ou du sous-agent si la skill tourne en `fork` |
| `context: fork` + `agent` + `background` | Exécute la skill dans un sous-agent isolé. En `-p` et dans le SDK, l'appelant attend toujours le résultat |
| `hooks`, `paths`, `shell`, `arguments`, `argument-hint`, `metadata`, `license`, `compatibility` | Voir la documentation |

Limites et comportements :
- Le corps de `SKILL.md` doit rester **sous 500 lignes**. Le reste va dans des fichiers de référence chargés à la demande.
- Après compaction, Claude Code ne réattache que les **5 000 premiers tokens** de chaque skill, avec un budget total de **25 000 tokens**.
- Le contenu d'une skill reste dans le contexte d'un tour à l'autre, alors que la pré-autorisation `allowed-tools` expire au message suivant.
- Injection de contexte dynamique : la syntaxe `` !`commande` `` remplace la commande par sa sortie avant envoi à Claude. Le nouvel événement de hook `PreSkillShellCommand` (v2.1.332) peut la bloquer.
- Hors Claude Code (claude.ai, API Skills), seuls six champs sont admis : `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`. Tout autre champ provoque une erreur d'upload.

### 2.5 Sous-agents de plugin [V]

Source : [components — Agents](https://code.claude.com/docs/en/plugins/components.md), [sub-agents](https://code.claude.com/docs/en/sub-agents.md).

- **Champs pris en compte** : `name`, `description`, `model` (`sonnet`, `opus`, `haiku`, `fable` ou un ID), `effort`, `maxTurns`, `autoCompactWindow`, `tools`, `disallowedTools`, `skills` (préchargement complet), `memory`, `background`, `omitClaudeMd`, `isolation: worktree`, `color`, `experimental.cacheTtl`.
- **Champs ignorés dans un plugin** : `permissionMode`, `hooks`, `mcpServers`, `initialPrompt`. Un agent de plugin ne peut pas déclarer ses propres serveurs MCP ; il faut les déclarer au niveau du plugin.
- **Limites** : 20 sous-agents simultanés par défaut (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) et 3 niveaux d'imbrication par défaut.

### 2.6 Hooks [V]

Source : [Hooks reference](https://code.claude.com/docs/en/hooks.md).

- **Cinq types de gestionnaire** : `command`, `http`, `mcp_tool`, `prompt`, `agent` (ce dernier est expérimental).
- **Délais par défaut** : 600 s pour command, http et mcp_tool ; 30 s pour prompt ; 60 s pour agent. Les hooks `SessionEnd` disposent d'un budget commun de 1,5 s.
- **Gestion des échecs** : un hook `PreToolUse` qui expire **ne bloque pas** l'appel, sauf avec `onFailure: "block"`.
- **Événements disponibles en v2.1.332** :
  - par session : `SessionStart`, `Setup`, `SessionEnd`, `InstructionsLoaded` ;
  - par tour : `UserPromptSubmit`, `UserPromptExpansion`, `Stop`, `StopFailure` ;
  - par outil : `PreToolUse`, `PermissionRequest`, `PermissionDenied`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch` ;
  - sous-agents et tâches : `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `TeammateIdle` ;
  - environnement : `ConfigChange`, `CwdChanged`, `DirectoryAdded`, `FileChanged`, `WorktreeCreate`, `WorktreeRemove` ;
  - compaction et modèle : `PreCompact`, `PostCompact`, `PreModelSwitch`, `PostModelSwitch` ;
  - MCP et affichage : `Elicitation`, `ElicitationResult`, `MessageDisplay`, `PreSkillShellCommand`, `Notification`.
- **Activation** : les hooks d'un plugin sont actifs dès que le plugin est chargé, même si aucune de ses skills ne sert. Il faut donc des `matcher` étroits.
- **Nommage des outils MCP du plugin** : `mcp__plugin_<plugin>_<serveur>__<outil>`.

### 2.7 Composants apparus ou consolidés en 2026 [V]

| Composant | Ce qu'il apporte | Limite importante |
|---|---|---|
| **Workflows** (`workflows/*.js`) | Script JS qui orchestre des dizaines à des centaines de sous-agents. Les résultats intermédiaires restent dans des variables du script, hors contexte. Le run peut reprendre après une pause | 16 agents simultanés par défaut, 1 000 agents par run, 4 096 éléments par `parallel()`. Pas d'`import()` ni d'accès direct au système de fichiers ([workflows](https://code.claude.com/docs/en/workflows.md)) |
| **Monitors** | Commande de fond dont la sortie arrive à Claude sous forme de notifications | Ne démarre **pas** avec `-p`. Ne se charge pas depuis un plugin de dépôt. Pas d'accès à `user_config` |
| **Mods** | Panneaux, boutons, commandes sans tour de Claude, minuteries, appels de modèle | Aucune isolation. CLI, Desktop et VS Code seulement ([mods](https://code.claude.com/docs/en/plugins/mods/overview.md)) |
| **Channels** | Serveur MCP qui pousse des événements (Telegram, Discord, iMessage…) dans une session ouverte | *Research preview*. Ne fonctionne qu'avec une session ouverte ([channels](https://code.claude.com/docs/en/channels.md)) |
| **Skills fournies par un serveur MCP** | Le serveur expose des skills, affichées `serveur:skill` | Bêta, ajoutée en v2.1.332 |

### 2.8 Ce qui se charge selon la surface [V]

Source : [platform support](https://claude.com/docs/plugins/platform-support.md).

| Composant | Chat claude.ai | Cowork | Claude Code (y compris cloud) |
|---|---|---|---|
| Skills | oui | oui | oui |
| Agents, hooks | ignorés | oui | oui |
| MCP distant (URL fixe) | via l'onglet Connecteurs | oui | oui |
| MCP local (stdio, `.mcpb`) | ignoré | si la session tourne sur la machine | oui |
| `bin/` | **installation refusée** | **installation refusée** | oui |
| LSP, styles de sortie, thèmes | ignorés | ignorés | oui |

Limites d'un compte claude.ai : 25 marketplaces ajoutées par l'utilisateur ; 5 000 fichiers et 200 Mo par plugin.

---

## 3. Marketplaces, distribution, validation, évaluations

### 3.1 `marketplace.json` [V]

Source : [Marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference.md), [Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace.md).

- **Emplacement** : `.claude-plugin/marketplace.json` à la racine du dépôt.
- **Champs obligatoires** : `name`, `owner.name`, `plugins[]`. Chaque entrée doit avoir `name` et `source`.
- **Champs optionnels** : `description`, `version`, `metadata.pluginRoot`, `forceRemoveDeletedPlugins`, `allowCrossMarketplaceDependenciesOn`, `renames`. Une entrée accepte aussi `category`, `tags`, `strict`, `relevance`, `dependencies`, `engines`, `defaultEnabled`, `displayName`, `headers` et `headersHelper`.
- **Types de `source`** : chemin relatif `./…`, `github` (`repo`, `ref`, `sha`), `url`, `git-subdir`, `npm`, `archive` (zip https avec `sha256`), `command`.
- **Noms réservés** : `claude-plugins-official`, `claude-code-plugins`, `claude-community`, `knowledge-work-plugins`, etc., ainsi que tout nom qui imite un nom officiel ou contient un caractère non ASCII.
- **Le nom de l'entrée doit être identique au `name` du `plugin.json`**, sinon l'installation échoue avec « not found ».
- **Limites de téléchargement** : 5 Mio pour un `marketplace.json` servi par URL ; 256 Mio pour une archive ; 1 Gio une fois décompressée.

### 3.2 Hébergement, installation et mise à jour [V]

Source : [Host and maintain a marketplace](https://code.claude.com/docs/en/plugins/host-marketplace.md), [Install](https://code.claude.com/docs/en/plugins/install.md).

- **Hébergement sur GitHub** : `/plugin marketplace add owner/repo`, avec `#ref` pour épingler une branche ou un tag. Un dépôt privé exige un *credential helper* git, par exemple celui de `gh`. Un `GITHUB_TOKEN` défini seul dans l'environnement ne suffit pas pour la mise à jour en arrière-plan.
- **Installation** : `claude plugin install nom@marketplace --scope user|project|local`. Les valeurs de configuration passent par `--config KEY=VALUE`, car l'installation en shell ne pose pas de questions.
- **La mise à jour automatique est désactivée par défaut** pour une marketplace tierce. Chaque utilisateur l'active dans `/plugin`, ou un administrateur la règle via `autoUpdate`. Sans elle, l'utilisateur lance `claude plugin update`.
- **Publier une nouvelle version** : incrémenter `version`, ou omettre `version` pour que chaque commit compte comme une version. Ne pas déclarer la version à la fois dans `plugin.json` et dans l'entrée de marketplace.
- **Développement local** : `claude --plugin-dir ./mon-plugin` (ou `--plugin-url` pour un zip) charge le plugin pour une seule session, puis `/reload-plugins` recharge les modifications.
- **Annuaire Anthropic** : soumission depuis `claude.ai/directory/manage`, réservée aux plans payants. La marketplace officielle `claude-plugins-official` ne prend pas de soumissions par ce portail ([publish](https://code.claude.com/docs/en/plugins/publish.md)).

### 3.3 Validation, tests, évaluations [V]

- **`claude plugin validate <chemin> [--strict] [--json]`**
  - Codes de sortie : 0 = succès, 1 = erreurs, 2 = erreur inattendue.
  - Contrôles : schéma, chemins, noms réservés, entrées MCP (depuis v2.1.281).
  - Il affiche aussi les contrôles de l'annuaire (README d'au moins 40 mots, icône PNG de 512 à 2048 px) et propose `--profile directory`.
  - **Test exécuté ici** : notre prototype passe `--strict` sur le plugin et sur la marketplace. Le validateur signale l'absence de README et d'icône comme bloquante pour l'annuaire.
- **`claude plugin eval`** (v2.1.269+) ([plugin evals](https://code.claude.com/docs/en/plugin-evals.md))
  - Arborescence : un dossier par cas dans `evals/<cas>/`, avec `prompt.md` ou `case.yaml` et des correcteurs dans `graders/*.md`.
  - Types de correcteurs : `regex`, `tool_used`, `tool_order`, `file_exists`, `llm`, `baseline`.
  - Chaque cas tourne 3 fois avec le plugin et 3 fois sans (bras de référence), ce qui donne l'écart Δ apporté par le plugin.
  - Les serveurs MCP peuvent être simulés par `evals/mocks/<serveur>/<outil>.md`, avec contrôle des paramètres d'appel via `expect:`.
  - Options utiles en CI : `--trust-plugin --json --threshold --max-cost-usd`. Code 0 = suite réussie, 1 = cas sous le seuil, 2 = run partiel.
  - **Chaque run est un vrai appel de modèle et est facturé.**
- **`claude plugin eval init`** rédige la suite de cas de façon interactive.
- **`claude plugin test`** sert aux tests des mods (`*.test.ts`).
- **`claude plugin tag --push`** crée le tag `<nom>--v<version>`, utilisé par la résolution des dépendances.
- **Plugin `skill-creator`** (marketplace officielle) : boucle d'évaluation pour une skill isolée, au format `evals/evals.json`. Ce format est distinct de celui de `claude plugin eval`.
- **En CI headless** : l'événement `system/init` de `--output-format stream-json` liste `plugins`, `plugin_errors`, `mcp_servers` et `mcp_server_errors` [V] ([headless](https://code.claude.com/docs/en/headless.md)). **Test exécuté ici** : `claude -p --plugin-dir ./plugins/trend-radar` charge `trend-radar:radar-scan`, `trend-radar:radar-score` et `trend-radar:diffusion-analyst`, sans `plugin_errors`.

### 3.4 Catalogues officiels (comptés le 2026-11-28) [V]

| Catalogue | Nom à saisir après `@` | Entrées | Remarque |
|---|---|---|---|
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | `claude-plugins-official` | 317 | Ajouté automatiquement. Plugins Anthropic et partenaires |
| [anthropics/claude-plugins-community](https://github.com/anthropics/claude-plugins-community) | `claude-community` | 2 280 | Plugins tiers soumis à Anthropic |
| [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | `knowledge-work-plugins` | 123 | Plugins métier (marketing, sales, small-business…) qui embarquent des connecteurs |
| [claude.com/connectors](https://claude.com/connectors) (annuaire) | n/a | environ 1 228 entrées extraites | Connecteurs « partner », distants ou locaux |
| `claude-code-plugins` (dans anthropics/claude-code) | | | **Déprécié** |

---

## 4. Exécution récurrente et autonome

### 4.1 Options comparées [V]

Sources : [scheduled tasks comparison](https://code.claude.com/docs/en/scheduled-tasks.md), [routines](https://code.claude.com/docs/en/routines.md), [github-actions](https://code.claude.com/docs/en/github-actions.md), [headless](https://code.claude.com/docs/en/headless.md), [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview.md).

| Mécanisme | Où ça tourne | Fréquence minimale | Plugins du radar | Connecteurs | Artifacts | Facturation |
|---|---|---|---|---|---|---|
| **Tâche planifiée cloud** (ex-« routine ») | Cloud Anthropic, sur un clone neuf du dépôt | 1 h (cron ; plus fréquent refusé) | **Plugins synchronisés du compte claude.ai** ou skills committées dans le dépôt. Pas les plugins en scope utilisateur | Connecteurs claude.ai choisis par tâche, ou `.mcp.json` du dépôt (dépôt unique) | Oui, publication sans confirmation en mode auto | Abonnement. 100 exécutions/h par compte. *Research preview* |
| Tâche planifiée Desktop | Machine locale (app ouverte, machine éveillée) | 1 min si Claude la crée, 1 h via les formulaires | Tous les plugins locaux | Fichiers de configuration et connecteurs | Oui (app Desktop) | Abonnement |
| `/loop` et outils cron de session | Session ouverte | 1 min | Ceux de la session | Ceux de la session | Selon la session | Abonnement |
| GitHub Actions `anthropics/claude-code-action@v1` | Runner GitHub | Cron GitHub | Entrées `plugin_marketplaces` et `plugins` | Via `claude_args` et MCP | **Désactivés par défaut** | Clé API ou jeton OAuth (`claude setup-token`) |
| `claude -p` (cron système, serveur) | Votre machine ou serveur | Libre | Plugins installés, `--plugin-dir`. `--bare` recommandé pour les scripts | `--mcp-config`. OAuth à faire au préalable en interactif | Désactivés par défaut | Abonnement ou clé API (`--bare` exige `ANTHROPIC_API_KEY`) |
| Agent SDK (Python/TS) | Votre service | Libre | Option `plugins` (chemin local) | MCP configurable | Désactivés par défaut | **Clé API** : un produit tiers ne peut pas proposer la connexion claude.ai sans accord préalable |

Détails à connaître sur les tâches cloud :
- La tâche démarre en mode *auto* : un classifieur accepte ou bloque les actions. Des blocages répétés font apparaître une demande d'autorisation qui met l'exécution en attente.
- L'exécution pousse sur une branche préfixée `claude/`.
- Si la connexion GitHub expire, les exécutions sont sautées pendant 72 h au plus, puis la tâche est désactivée.
- Une tâche peut aussi être déclenchée par un **POST HTTP** sur `/fire` avec un jeton Bearer et un champ `text` libre, ou par des événements GitHub.
- L'environnement réseau par défaut est **Limited**, avec les gestionnaires de paquets autorisés. Les connecteurs passent par Anthropic et n'ont pas besoin d'être dans la liste d'autorisation. Les API appelées en direct (DataForSEO, YouTube, Brave) doivent être ajoutées aux hôtes autorisés, avec la clé stockée en *network secret*.
- Côté GitHub Actions : GitHub ne lance les workflows planifiés que depuis la branche par défaut, et **les désactive après 60 jours sans activité sur un dépôt public**.

### 4.2 Ce qu'un plugin peut ou ne peut pas déclencher seul

| Peut | Ne peut pas |
|---|---|
| Réagir aux événements d'une session ouverte (hooks) [V] | Déclarer une planification dans son manifeste : aucun champ prévu [V] |
| Lancer un processus de fond pendant une session interactive (monitor) et recevoir ses notifications [V] | Faire tourner un monitor en `-p` ou dans un plugin de dépôt [V] |
| Fournir une skill qui prépare le prompt et guide l'utilisateur vers `/schedule` (création d'une tâche cloud depuis le CLI) [H] | Créer de lui-même une tâche cloud avec déclencheur API : le jeton se crée uniquement sur le web [V] |
| Recevoir des événements extérieurs dans une session ouverte via un channel (*research preview*) [V] | S'exécuter sans session : il faut un hôte (tâche planifiée, Action, cron + `-p`, SDK) [V] |
| Embarquer un workflow de fan-out relançable [V] | Garantir que ce workflow tourne en tâche cloud : non documenté, à tester [H] |

### 4.3 Publication des rapports : Artifacts [V]

Source : [Artifacts](https://code.claude.com/docs/en/artifacts.md).

- **Nature** : page HTML ou `.md` unique et statique, publiée sur claude.ai. Elle est privée par défaut, puis partageable à l'organisation ou en public selon le plan. Taille maximale : **16 Mio**.
- **Contraintes de sécurité (CSP stricte)** : scripts uniquement depuis cdnjs, unpkg, jsDelivr, Tailwind et jQuery ; polices Google Fonts ; images en data URI ; aucun backend.
- **Données vivantes** : la page peut appeler les **connecteurs claude.ai du lecteur** à chaque ouverture, après son accord. Elle **ne peut pas appeler les serveurs MCP locaux**.
- **Conditions d'accès** : plan Pro/Max/Ultra/Team/Enterprise, session connectée à claude.ai, API Anthropic (pas Bedrock, Vertex ni Foundry), pas de CMEK, HIPAA ni ZDR.
- **Contextes où ils sont désactivés par défaut** : `-p`, Agent SDK, GitHub Action, serveurs MCP.
- **Pour un tableau de bord récurrent** : confier à la tâche planifiée l'URL d'un artifact **déjà publié**. En mode auto, la tâche le republie sans confirmation si aucune *capability* nouvelle n'est déclarée [V] ([routines](https://code.claude.com/docs/en/routines.md)).

---

## 5. Bonnes pratiques officielles (skills et sous-agents)

Sources : [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices), [Skills](https://code.claude.com/docs/en/skills.md), [Sub-agents](https://code.claude.com/docs/en/sub-agents.md). Tout ce qui suit est [V].

**Rédaction des skills**
1. **Divulgation progressive.** `SKILL.md` sert de sommaire de moins de 500 lignes. Les références (`reference.md`, `markets/*.md`) se lisent à la demande et restent **à un seul niveau de profondeur**. Tout fichier de plus de 100 lignes commence par une table des matières.
2. **Description à la troisième personne**, précise, qui dit à la fois ce que fait la skill et quand l'utiliser. Le nom fait au plus 64 caractères, en minuscules, chiffres et tirets, sans les mots `claude` ni `anthropic`. La forme gérondive est conseillée : `scanning-trends`.
3. **Scripts embarqués** pour les étapes déterministes : collecte, normalisation, calcul de score. Ils sont plus fiables et plus économes qu'un code généré. Préciser si Claude doit *exécuter* le script ou le *lire*. Pré-autoriser par `allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/x.sh *)` pour éviter les demandes d'autorisation.
4. **Planifier, valider, exécuter.** Produire un fichier intermédiaire (`plan.json`, `scores.json`), le valider par script avec des messages d'erreur explicites, puis seulement exécuter.
5. **Évaluations d'abord.** Écrire 3 scénarios et mesurer la référence sans skill avant de rédiger la skill. Mesurer séparément le déclenchement et la qualité du résultat.
6. Nommer les outils MCP en entier (`Serveur:outil`). Ne pas mettre d'information datée dans le corps. Garder une terminologie cohérente. Utiliser `/` dans les chemins.
7. `disable-model-invocation: true` pour les actions à effet de bord (publier, dépenser, envoyer). `user-invocable: false` pour les référentiels de connaissance.

**Sous-agents**
1. Isoler les opérations volumineuses (scraping, lecture de longues pages) dans un sous-agent qui ne renvoie qu'un résumé.
2. Restreindre les outils (`tools`, `disallowedTools`) et choisir un modèle plus léger pour les tâches mécaniques.
3. Lancer les recherches indépendantes en parallèle, tout en surveillant le volume de résultats qui remonte dans le contexte principal.
4. Au-delà de quelques sous-agents ou pour un traitement relançable, passer à un **workflow**.

---

## 6. Connecteurs et serveurs MCP pour le radar

Légende :
- **Plugin OM** : présent dans `claude-plugins-official`. **KWP** : présent dans `knowledge-work-plugins`. **CM** : présent dans `claude-community`.
- **Connecteur** : présent dans l'annuaire claude.com avec le niveau « partner ».
- Les prix viennent des pages de prix des éditeurs, consultées le 2026-11-28, sauf mention [S].

### 6.1 Collecte (signaux)

| Service | Plugin / connecteur officiel | MCP | Coût (2026-11-28) | Apport pour le radar | Avis |
|---|---|---|---|---|---|
| **Apify** | Connecteur (distant, Claude Code) + marketplace de l'éditeur `apify/agent-skills` (plugin `apify-ultimate-scraper`). Pas dans OM. Le plugin `apify-scraper` de CM est tiers | `https://mcp.apify.com`, OAuth ou jeton ([docs](https://docs.apify.com/platform/integrations/mcp)) | Free 0 $ (5 $ d'usage par mois, 5 exécutions simultanées). Starter 19 $. Scale 199 $. Business 999 $. Unité de calcul de 0,2 $ à 0,13 $ ([pricing](https://apify.com/pricing)). Les actors ont souvent un prix propre au résultat | Acteurs TikTok, Instagram, YouTube, X, Reddit, Google Trends et Google Maps : **source principale de signaux sociaux US** | **Indispensable** |
| **DataForSEO** | Aucun plugin ni connecteur | Officiel, libre. Hébergé `https://mcp.dataforseo.com/v3/mcp` (authentification Basic) ([page MCP](https://dataforseo.com/model-context-protocol)) | Paiement à l'usage. **Recharge minimale 50 $**, solde sans expiration, 1 $ offert ([pricing](https://dataforseo.com/pricing)) | SERP, Keywords Data (y compris Google Trends selon la navigation du site), Labs, Business Data, AI Optimization : **demande de recherche par pays**, élément clé pour mesurer la diffusion | **Indispensable** |
| **YouTube Data API v3** | Aucun MCP officiel trouvé | n/a (API REST avec clé) | Gratuit. **10 000 unités/jour**, plus une limite séparée de **100 appels `search.list`/jour** ([quota](https://developers.google.com/youtube/v3/determine_quota_cost)) | Vidéos par `regionCode`/langue, vues : décalage de diffusion US → UE → francophonie | **Indispensable** (avec cache) |
| **Exa** | Plugin OM et KWP + connecteur | `https://mcp.exa.ai/mcp` | 10 $ de crédit par mois. Recherche 4 à 7 $ les 1 000. Deep 12 $ les 1 000. Contenus 1 $ les 1 000 pages ([pricing](https://exa.ai/pricing)) | Recherche sémantique datée, « trouver des pages similaires » : détection de reprises dans les médias européens et francophones | **Indispensable** (une seule brique de recherche web) |
| **Firecrawl** | Plugin OM et CM + connecteur | `https://mcp.firecrawl.dev/v2/mcp-search` | Free 1 000 crédits. Hobby 19 $ (5 000). Standard 99 $ (100 000). Growth 399 $. Scrape 1 crédit par page ; search 2 crédits pour 10 résultats ([pricing](https://www.firecrawl.dev/pricing)) | Extraction en markdown propre | Utile (alternative ou complément d'Exa) |
| **Tavily** | Plugin OM et KWP + connecteur | `https://mcp.tavily.com/mcp` | 1 000 crédits gratuits par mois. Paiement à l'usage 0,008 $ par crédit. Project 30 $ pour 4 000 crédits. Recherche basic 1 crédit, advanced 2 ([pricing](https://www.tavily.com/pricing), [credits](https://docs.tavily.com/documentation/api-credits)) | Recherche et extraction | Utile (redondant avec Exa) |
| **Brave Search** | Aucun plugin ni connecteur (l'entrée « Brave AppleScript » de l'annuaire est sans rapport) | Dépôt officiel `brave/brave-search-mcp-server` (lien depuis la page API) | Search 5 $ les 1 000 avec 5 $ de crédit mensuel. Answers 4 $ les 1 000 plus 5 $ par million de tokens. **Stockage ou entraînement des résultats réservé à un plan sur mesure** ([API](https://brave.com/search/api/)) | Index indépendant, actualités | Optionnel. **Clause de stockage à surveiller**, puisque le radar archive des séries |
| **Perplexity** | Pas de plugin OM. Le connecteur de l'annuaire est « Perplexity Computer » (transfert de tableaux de bord), pas la recherche | Paquet `@perplexity-ai/mcp-server` [S] | Search API 5 $ les 1 000 (mode fast 1 $). Agent API au token, plus `web_search` à 2,50 $ les 1 000 ([pricing](https://docs.perplexity.ai/getting-started/pricing)) | Synthèses sourcées | À éviter (redondant) |
| **Bright Data** | Plugin `brightdata-plugin` dans OM et KWP (`bright-data` dans CM). Pas de connecteur | Hébergé ou autohébergé | **5 000 requêtes gratuites par mois**. Paiement à l'usage 1,5 $ les 1 000. Scale 499 $/mois. Navigateurs 8 $/Go ([pricing](https://brightdata.com/pricing/mcp-server), [docs](https://docs.brightdata.com/mcp-server/overview)) | Collecte anti-blocage sur les sites difficiles | Plus tard |
| **Google Trends** | Aucun MCP officiel | **API officielle en alpha, sur candidature** : 5 ans glissants, granularité du jour à l'année, pays et sous-régions. Ni quota ni prix publiés ([Google](https://developers.google.com/search/apis/trends)) | n/a | Mesure de référence de l'intérêt par pays | Candidater à l'alpha ; en attendant, passer par DataForSEO ou un actor Apify |
| **Reddit** | Pas de connecteur officiel. « Reddit MCP Buddy » (extension Desktop locale, tierce) | Pas de MCP officiel | Selon des sources [S] : gratuit hors usage commercial et après approbation ; **contrat obligatoire en usage commercial** | Signaux de niche (subreddits) | À éviter en accès API direct ; passer par Apify et vérifier les conditions d'utilisation |
| **Similarweb** | Connecteur + inclus dans le plugin KWP `marketing` | `https://mcp.similarweb.com` | **Abonnement avec accès API/MCP requis** (API-only, Business, Enterprise), consommation de crédits de données ([docs](https://docs.similarweb.com/api-v5/mcp/mcp-setup)) | Trafic par pays, applications, mots-clés | Payant (add-on) |
| **Ahrefs** | Connecteur + inclus dans KWP `marketing` | `https://api.ahrefs.com/mcp/mcp` | Plan exigé **non vérifié** (page de documentation en erreur 404) | SEO, visibilité dans la recherche IA | Payant (add-on) |
| **Semrush** | Connecteur | `https://mcp.semrush.com/claude/v1/mcp` | SEO One Starter/Pro+ ou Classic Pro/Guru, 50 000 unités d'API incluses ; l'API Trends inclut le MCP [S] ([dev docs](https://developer.semrush.com/api/introduction/semrush-mcp)) | Mots-clés, trafic, marchés | Payant (add-on) |

Signaux supplémentaires repérés dans l'annuaire [V] :
- **Product Hunt** (`https://mcp.producthunt.com/mcp`) : lancements de produits tech US.
- **vidIQ** (`https://mcp.vidiq.com/mcp`) : recherche YouTube, Instagram et TikTok.
- **TikTok for Business** : publicité.
- **Crunchbase** : financements.

### 6.2 Exécution des initiatives

| Service | Plugin / connecteur officiel | Coût et contraintes vérifiés | Usage | Avis |
|---|---|---|---|---|
| **Vercel** | Plugin OM `vercel` + connecteur `https://mcp.vercel.com/` | Hobby gratuit (1 M d'invocations, 100 Go de transfert, 100 déploiements/jour). Pro : 20 $ par siège et par mois ([hobby](https://vercel.com/docs/plans/hobby)). Restriction « non commerciale » du plan Hobby : **non revérifiée** | Pages d'atterrissage, MVP | Utile |
| **Supabase** | Plugin OM `supabase` (supabase-community) + connecteur `https://mcp.supabase.com/mcp` | Free : 2 projets actifs, **pause après 1 semaine d'inactivité**, 500 Mo, 50 000 utilisateurs actifs mensuels. Pro à partir de 25 $/mois ([pricing](https://supabase.com/pricing)) | Persistance multi-utilisateur du radar, backend des MVP | Utile |
| **Shopify** | Connecteur `https://setup.shopify.com/mcp` (surfaces annoncées : claude, claude-api) + plugins OM `shopify-ai-toolkit` et `liquid-skills` | Prix des plans non vérifiés ici | E-commerce pour les tendances produit | Plus tard |
| **Stripe** | Plugin OM `stripe` + connecteur `https://mcp.stripe.com/` | **Absent au Maroc, au Sénégal, en Tunisie et en Algérie.** Côte d'Ivoire : « Extended network ». France, Belgique, Suisse et Canada : pris en charge ([stripe.com/global](https://stripe.com/global)) | Paiement | Utile (FR/BE/CH/QC) ; alternative à prévoir pour le Maghreb et l'Afrique de l'Ouest |
| **Postiz** | Plugin OM, KWP et CM `postiz` + MCP Postiz (pas dans l'annuaire claude.com) | Standard 29 $, Team 39 $, Pro 49 $, Ultimate 99 $ par mois. **Pas d'offre gratuite**, essai de 7 jours. API, CLI et MCP sur tous les plans. Version autohébergée sous AGPL ([plans](https://docs.postiz.com/cloud/plans.md)) | Programmation multi-réseaux pour tester les initiatives | Utile |
| **Canva** | Plugin OM et KWP `canva` + connecteur `https://mcp.canva.com/mcp` | Compte Canva (prix non vérifiés) | Visuels | Utile |
| **ElevenLabs** | Connecteur `https://api.elevenlabs.io/v1/mcp-claude-marketplace` | Free 10 000 crédits. Starter 6 $ (30 000 crédits, licence commerciale). Creator 22 $. Pro 99 $ ([pricing](https://elevenlabs.io/pricing)) | Voix-off, podcasts, contenus en darija ou en wolof (à tester) | Plus tard |
| **Hugging Face** | Plugin OM `huggingface-skills` + connecteur `https://huggingface.co/mcp` | Compte gratuit (offres Pro non vérifiées) | Modèles (classification, traduction) | Plus tard |
| **Notion** | Plugin OM `notion` (makenotion) + connecteur `https://mcp.notion.com/mcp` | Selon l'espace de travail | Base de connaissances des tendances | Utile |
| **Slack** | Plugin OM `slack` (slackapi) + KWP + connecteur `https://mcp.slack.com/mcp` | Selon l'espace de travail | Alertes | Utile |
| **Gmail / Google Drive** | Connecteurs Google + MCP Google officiels **GA** (`gmailmcp.googleapis.com/mcp/v1`, `drivemcp.googleapis.com/mcp/v1`), inclus dans le plugin KWP `small-business` | Projet Google Cloud et client OAuth à créer ([guide](https://developers.google.com/workspace/guides/configure-mcp-servers)) | Envoi du digest, archivage | Utile |
| **Airtable** | Plugin OM `airtable` + connecteur `https://mcp.airtable.com/mcp` | Non vérifié | Tableau éditorial des tendances | Optionnel |
| **Cloudflare** | Plugin OM `cloudflare` + connecteur « Cloudflare Developer Platform » | Non vérifié | Hébergement Workers, alternative à Vercel | Plus tard |

Observation faite dans cette session de test : les connecteurs claude.ai Canva, ElevenLabs, Google Drive, Hugging Face, Postiz, Shopify, Supabase et Vercel apparaissent comme outils MCP dans une session Claude Code cloud. Ils n'ont pas été appelés.

---

## 7. Architecture recommandée pour le plugin « radar »

### 7.1 Principes directeurs

1. **Pas de `bin/`** : les scripts vont dans `skills/*/scripts/` et `scripts/`. Le plugin reste ainsi installable sur claude.ai et synchronisable dans les tâches cloud [V].
2. **Nom `trend-radar`** : évite les mots réservés `claude` et `anthropic` [V].
3. **Deux topologies servies par le même code** :
   - **Développement local** avec `--plugin-dir`, une base SQLite dans `${CLAUDE_PLUGIN_DATA}` et le cycle validate + eval.
   - **Production récurrente** en tâche planifiée cloud. Elle s'appuie sur un dépôt `radar-data` (historique en JSON/CSV, commité sur une branche `claude/…` ou fusionné par PR), le plugin ajouté au compte claude.ai et les connecteurs Apify, Exa et éventuellement Similarweb. Les API directes (DataForSEO, YouTube) passent par les hôtes autorisés et des *network secrets*. Un artifact existant est republié à chaque exécution.
   - Option : GitHub Actions avec une clé API si l'on veut découpler de l'abonnement. Dans ce cas, pas d'Artifacts : publier dans le dépôt, Notion ou Slack.
4. **Les gros volumes restent hors contexte** : le serveur MCP local écrit les données brutes sur disque et ne renvoie que des identifiants et des agrégats. La sortie d'un outil MCP est plafonnée à 25 000 tokens par défaut [V].
5. **Aucune décision chiffrée sans provenance** : un hook `PostToolUse` journalise URL, horodatage et outil dans `provenance.jsonl`, et le skill de rapport refuse un score sans source.

### 7.2 Arborescence proposée

```text
trend-radar/
├── .claude-plugin/plugin.json      # name, version, description, author, license, engines, network.hosts,
│                                   # userConfig: markets[], niches[], lifestyles[], monthly_budget_usd,
│                                   # dataforseo_login (sensitive), youtube_api_key (sensitive), brave_key (sensitive)
├── README.md  .claude-plugin/icon.png
├── skills/
│   ├── radar-setup/        # disable-model-invocation: vérifie connecteurs et clés, crée la base, explique /schedule
│   ├── radar-scan/         # collecte US : scripts/collect_{youtube,dataforseo,apify}.py + references/sources.md
│   ├── radar-diffusion/    # mesure du décalage US→UE→francophonie : scripts/lag.py, references/method.md
│   ├── radar-transpose/    # score pays × niche × lifestyle : references/rubric.md, references/markets/{MA,FR,BE,CH,QC,DZ-TN,SN-CI}.md,
│   │                       # references/lifestyles.md ; context: fork
│   ├── radar-initiatives/  # initiatives réalisables par 1 à 3 personnes + stratégie : templates/initiative.md
│   ├── radar-report/       # rendu HTML compatible artifact (CSP), scripts/render.py, validate_report.py
│   └── radar-sources/      # user-invocable: false : quotas, conditions d'utilisation, coûts de chaque source (référentiel)
├── agents/
│   ├── us-signal-scout.md        # tools: MCP de collecte, Read, Write ; model: sonnet ; maxTurns borné
│   ├── eu-diffusion-analyst.md   # lecture seule ; WebSearch/WebFetch/Exa
│   ├── market-analyst.md         # un appel par marché (paramétré par le prompt)
│   ├── initiative-strategist.md  # model: opus ; skills: [radar-transpose]
│   └── skeptic-verifier.md       # contre-vérifie chaque affirmation chiffrée (source, date)
├── workflows/
│   └── weekly-radar.js           # fan-out : top N tendances × M marchés → parallel() ; consolidation ; rapport
├── hooks/hooks.json              # SessionStart : venv Python dans ${CLAUDE_PLUGIN_DATA} ; vérification de config
│                                 # PreToolUse (matcher mcp__plugin_trend-radar_radar-store__collect_.*) : garde budgétaire
│                                 # PostToolUse : journal de provenance ; Stop : validation du schéma du rapport
├── .mcp.json                     # "radar-store" (stdio, Python) : upsert_signal, query_signals, diffusion_lag,
│                                 # score_market, budget_status, export_report_data — SQLite dans ${CLAUDE_PLUGIN_DATA}
│                                 # ou dans le dépôt cloné quand l'exécution est dans le cloud
├── scripts/                      # utilitaires communs (normalisation, géocodes ISO, devises)
└── evals/                        # cas : déclenchement de radar-scan, refus de score sans source, respect du budget ;
    └── mocks/radar-store/…        # mocks MCP pour que la CI ne paie aucune collecte
```

Commandes exposées, toutes sous forme de skills : `/trend-radar:radar-setup`, `/trend-radar:radar-scan`, `/trend-radar:radar-report`, `/trend-radar:weekly-radar` (le workflow). Les skills à effet de bord, qui publient ou dépensent, portent `disable-model-invocation: true`.

### 7.3 Liste priorisée des plugins et connecteurs

| Priorité | Collecte | Exécution et diffusion | Outillage |
|---|---|---|---|
| **Indispensables (MVP)** | Apify (connecteur + `apify/agent-skills`), DataForSEO (MCP officiel), YouTube Data API (clé), Exa (plugin OM) | Artifacts (natif), GitHub (connecteur ou plugin OM `github`) | `skill-creator` et `plugin-dev` (OM), `claude plugin validate/eval` |
| **Utiles** | Firecrawl ou Tavily (secours), Product Hunt, vidIQ, Brave (avec la réserve sur le stockage), candidature à l'alpha Google Trends | Notion ou Airtable, Slack, Gmail/Drive, Supabase, Vercel, Postiz, Canva, Stripe (FR/BE/CH/QC) | Plugin `security-guidance` (OM) |
| **Plus tard / payants** | Similarweb, Semrush, Ahrefs, Bright Data, Perplexity | ElevenLabs, Shopify, Hugging Face, Cloudflare | Mods (panneau de suivi en local) |

### 7.4 Pièges connus (et parade)

1. **Plugins absents des tâches cloud** (scope utilisateur ou marketplace déclarée dans le dépôt). Parade : ajouter le plugin au compte claude.ai ou committer `.claude/skills`, `.claude/agents` et `.mcp.json` dans le dépôt [V]. Le chargement d'un *skills-dir plugin* depuis le dépôt dans un cloud hébergé par Anthropic reste à tester [H].
2. **`version` figée** : sans incrément, les utilisateurs ne reçoivent pas les correctifs, et la mise à jour automatique est désactivée par défaut [V]. Parade : `claude plugin tag` dans la CI, ou omettre `version`.
3. **`bin/`** bloque l'installation sur claude.ai et Cowork [V].
4. **`${user_config}`** est refusé dans les hooks en forme shell et dans les monitors [V]. Parade : hooks en forme exec (`args`) ou variable `CLAUDE_PLUGIN_OPTION_<KEY>`.
5. **Coût de contexte des plugins actifs** : la description de chaque skill et de chaque agent est présente à chaque tour [V]. **Mesure faite ici** : une requête `claude -p` triviale avec environ 29 plugins chargés a été estimée à **0,43 $** au prix public (`total_cost_usd`). Pour les exécutions planifiées, garder un environnement minimal, ne garder que les connecteurs utiles dans la tâche, et envisager `--bare` avec `--plugin-dir` en exécution par script.
6. **Sortie MCP plafonnée à 25 000 tokens** (avertissement à 10 000) [V]. Parade : renvoyer des identifiants et des agrégats.
7. **Monitors** inactifs en `-p` et dans les plugins de dépôt [V]. Ne pas en faire une brique de production.
8. **Tâches cloud** : *research preview*, intervalle minimum de 1 h, 100 exécutions/h, pause de 72 h si GitHub est déconnecté, attente possible sur une demande d'autorisation en mode auto [V]. Parade : prompt autonome très explicite, règles `allow` dans le `.claude/settings.json` du dépôt, surveillance de l'historique.
9. **GitHub Actions** : cron désactivé après 60 jours d'inactivité sur un dépôt public, Artifacts indisponibles, jeton OAuth lié à une personne [V].
10. **Agent SDK** : un produit tiers doit utiliser une clé API, pas la connexion claude.ai [V]. Le coût est alors à budgéter si le radar devient un SaaS.
11. **Conditions d'utilisation des données** : stockage des résultats Brave réservé à un plan sur mesure [V] ; contrat pour l'usage commercial de l'API Reddit [S] ; quota `search.list` de YouTube limité à 100 appels par jour [V] ; scraping des réseaux via Apify soumis aux conditions de chaque plateforme (aspect juridique traité par un autre axe).
12. **Paiement** : Stripe absent au Maroc et au Sénégal [V], ce qui limite les initiatives monétisées au Maghreb et en Afrique de l'Ouest.
13. **Persistance** : un projet Supabase gratuit est mis en pause après 7 jours d'inactivité [V]. Un radar hebdomadaire est juste à la limite.
14. **Évaluations payantes** : nombre de cas × 3 runs × 2 bras, plus les appels au juge [V]. Parade : mocks, `--ablation none` pendant l'itération, `--max-cost-usd` en CI.
15. **Hooks bloquants** : un `PreToolUse` qui expire laisse passer l'appel sans `onFailure: "block"` [V]. Un hook `Stop` qui renvoie le code 2 peut provoquer une boucle : prévoir un compteur.

---

## 8. Implications pour l'outil

1. Écrire le radar comme **un plugin unique `trend-radar`** sans `bin/`, versionné, dans une marketplace GitHub privée (`trend-radar-mkt`), ajoutée au compte claude.ai pour les exécutions cloud.
2. Séparer **calcul déterministe** (scripts Python et serveur MCP local `radar-store`) et **jugement** (skills et agents). Tous les scores sont recalculables et testables hors modèle.
3. Mettre la **planification hors du plugin** : une tâche cloud hebdomadaire, par exemple lundi 06:07 UTC pour éviter l'heure pile, sur le dépôt `radar-data` ; des déclencheurs API pour les relances à la demande ; un artifact de tableau de bord republié à chaque exécution.
4. Confier aux connecteurs claude.ai ce qu'ils couvrent (Apify, Exa, Similarweb), et appeler directement (hôtes autorisés et *network secrets*) ce qui n'est pas connecteur (DataForSEO, YouTube, Brave).
5. Intégrer dès la v0.1 `claude plugin validate --strict` et une suite `claude plugin eval` avec mocks dans la CI (GitHub Actions).
6. Tenir le budget dans un hook `PreToolUse` et dans `userConfig.monthly_budget_usd` ; plafonner les actors Apify avec `maxTotalChargeUsd`.
7. Faire du **référentiel marchés et lifestyles** (fichiers de référence de `radar-transpose`) l'actif principal. Il est alimenté par les autres axes de l'étude et chargé à la demande.

## 9. Questions ouvertes

1. Les workflows dynamiques livrés par un plugin s'exécutent-ils dans une tâche planifiée cloud ? Et avec quelle concurrence sur la VM ? (Non documenté, à tester.)
2. Un plugin placé dans `.claude/skills/<plugin>/` d'un dépôt se charge-t-il dans une session cloud hébergée par Anthropic, compte tenu du contrôle de confiance ? (À tester.)
3. Couverture géographique réelle de DataForSEO (Google Trends et Keywords Data) pour le Maroc, le Sénégal et la Côte d'Ivoire, et prix exact de l'endpoint Google Trends.
4. Fiabilité et coût par millier de résultats des actors Apify TikTok, Instagram et Reddit sur des requêtes en français, en darija et en arabe.
5. Conditions officielles 2026 de l'API Reddit (les chiffres disponibles viennent de blogs de revendeurs).
6. Plan Ahrefs requis pour le MCP ; version de l'endpoint Semrush (`v1` dans l'annuaire, `v2` cité par des tiers).
7. Texte actuel de la restriction commerciale du plan Vercel Hobby (non retrouvé sur les pages consultées).
8. Délai et chances d'obtenir l'alpha de l'API Google Trends.
9. Montant exact des crédits gratuits de Brave (la page affiche à la fois 5 $ et « jusqu'à 20 $ »).
10. Serveur MCP officiel de Perplexity (paquet npm identifié seulement via un annuaire tiers).
11. Une tâche cloud peut-elle être créée par API, et non seulement depuis le web, Desktop ou `/schedule` ? Cela compterait pour un futur SaaS multi-utilisateur.

## 10. Sources principales (consultées le 2026-11-28)

**Documentation Claude Code**
- Index : <https://code.claude.com/docs/llms.txt>
- Plugins : [overview](https://code.claude.com/docs/en/plugins/overview.md), [components](https://code.claude.com/docs/en/plugins/components.md), [manifest](https://code.claude.com/docs/en/plugins/manifest-reference.md), [marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference.md), [create marketplace](https://code.claude.com/docs/en/plugins/create-marketplace.md), [host marketplace](https://code.claude.com/docs/en/plugins/host-marketplace.md), [CLI](https://code.claude.com/docs/en/plugins/cli-reference.md), [evals](https://code.claude.com/docs/en/plugin-evals.md), [loading](https://code.claude.com/docs/en/plugins/loading.md), [install](https://code.claude.com/docs/en/plugins/install.md), [publish](https://code.claude.com/docs/en/plugins/publish.md), [Anthropic marketplaces](https://code.claude.com/docs/en/plugins/anthropic-marketplaces.md), [mods](https://code.claude.com/docs/en/plugins/mods/overview.md)
- Extensions : [skills](https://code.claude.com/docs/en/skills.md), [hooks](https://code.claude.com/docs/en/hooks.md), [sub-agents](https://code.claude.com/docs/en/sub-agents.md), [workflows](https://code.claude.com/docs/en/workflows.md), [mcp](https://code.claude.com/docs/en/mcp.md), [channels](https://code.claude.com/docs/en/channels.md)
- Exécution et publication : [routines](https://code.claude.com/docs/en/routines.md), [scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks.md), [desktop scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks.md), [headless](https://code.claude.com/docs/en/headless.md), [GitHub Actions](https://code.claude.com/docs/en/github-actions.md), [cloud environments](https://code.claude.com/docs/en/cloud-environments.md), [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview.md), [artifacts](https://code.claude.com/docs/en/artifacts.md), [changelog](https://code.claude.com/docs/en/changelog.md)

**Documentation claude.com et plateforme**
- [platform support](https://claude.com/docs/plugins/platform-support.md), [annuaire des connecteurs](https://claude.com/connectors) (données JSON de la page analysées)
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

**Catalogues JSON**
- [claude-plugins-official](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json), [claude-plugins-community](https://raw.githubusercontent.com/anthropics/claude-plugins-community/main/.claude-plugin/marketplace.json), [knowledge-work-plugins](https://raw.githubusercontent.com/anthropics/knowledge-work-plugins/main/.claude-plugin/marketplace.json), [apify/agent-skills](https://raw.githubusercontent.com/apify/agent-skills/main/.claude-plugin/marketplace.json)

**Pages éditeurs**
- Collecte : [Apify pricing](https://apify.com/pricing), [Apify MCP](https://docs.apify.com/platform/integrations/mcp), [Brave API](https://brave.com/search/api/), [Perplexity pricing](https://docs.perplexity.ai/getting-started/pricing), [Firecrawl](https://www.firecrawl.dev/pricing), [Exa](https://exa.ai/pricing), [Tavily](https://www.tavily.com/pricing), [Tavily credits](https://docs.tavily.com/documentation/api-credits), [Bright Data](https://brightdata.com/pricing/mcp-server), [DataForSEO MCP](https://dataforseo.com/model-context-protocol), [DataForSEO pricing](https://dataforseo.com/pricing), [Google Trends API](https://developers.google.com/search/apis/trends), [YouTube quota](https://developers.google.com/youtube/v3/determine_quota_cost), [Similarweb MCP](https://docs.similarweb.com/api-v5/mcp/mcp-setup), [Semrush MCP](https://developer.semrush.com/api/introduction/semrush-mcp)
- Exécution : [Postiz plans](https://docs.postiz.com/cloud/plans.md), [ElevenLabs](https://elevenlabs.io/pricing), [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Supabase](https://supabase.com/pricing), [Stripe global](https://stripe.com/global), [Google Workspace MCP](https://developers.google.com/workspace/guides/configure-mcp-servers)

**Tests exécutés ici le 2026-11-28**
- `claude plugin validate --strict` sur le prototype `trend-radar` et sa marketplace : succès.
- `claude -p --plugin-dir … --output-format stream-json` : plugin chargé, skills et agent namespacés, aucune erreur de plugin ; le serveur MCP d'essai, simple bouchon, échoue comme prévu.
- `claude plugin eval --help` : commande disponible.

---

## Contre-vérification

Contre-vérification indépendante du 2026-11-28. Pages officielles retéléchargées (copies dans `research/cv_plugins_dl/`), tests exécutés avec Claude Code 2.1.332 dans `research/cv_plugins_test/`. Verdicts : **confirmé**, **corrigé**, **réfuté**, **invérifiable**.

### Verdicts

| # | Affirmation contrôlée | Verdict | Preuve et correction |
|---|---|---|---|
| 1 | `plugin.json` optionnel, seul `name` requis, noms réservés | **Confirmé** | Manifest reference, sections Fields et `name`. Test : `claude-radar` et `official-anthropic-radar` échouent à `validate --strict` (code 1), `trend-radar` passe. Précisions : `claude-mods` est aussi réservé ; `claude plugin init` et `claude plugin tag` refusent ces noms, mais Claude Code installe et charge quand même un plugin ainsi nommé |
| 2 | Composants et règles de combinaison des clés | **Confirmé**, liste incomplète | Section How each key combines. Remplacent aussi le dossier par défaut : `experimental.themes` et `experimental.monitors`. La clé `agents` du manifeste n'accepte que des fichiers, pas des dossiers. Champs absents du tableau 2.2 : `$schema` et `types` (fichier `.d.ts` d'un mod) |
| 3 | `${CLAUDE_PLUGIN_ROOT}` change à chaque mise à jour, `${CLAUDE_PLUGIN_DATA}` persiste, variables absentes de l'outil Bash | **Confirmé** | Section Where each variable resolves, mot pour mot. `${CLAUDE_SKILL_DIR}` est documenté dans la page Skills, pas dans le manifeste |
| 4 | Pas de plugins en scope utilisateur ni de `extraKnownMarketplaces` en session cloud ; passer par les plugins synchronisés claude.ai ou committer `.claude/` | **Confirmé** | Tableau What carries over (cloud-environments) ; onglet Cloud session (install) ; Plugins synced (loading). Observé ici : `claude plugin list` ne montre que des plugins `@synced`. Deux réserves : la page des tâches planifiées ne parle pas des plugins (on l'infère du fait qu'une tâche est une session cloud complète) ; **les valeurs `userConfig` (`pluginConfigs`) ne sont lues qu'aux scopes utilisateur ou géré**, et les valeurs sensibles vont au trousseau. Dans une tâche cloud, aucune valeur saisie n'existe donc |
| 5 | claude.ai et Cowork refusent un plugin qui a un `bin/` à la racine | **Confirmé** | Platform support (« Can't be installed ») et org-sync (message `Plugin contains a top-level bin/ directory`). **Test : `claude plugin validate --strict` passe (code 0) avec un `bin/`** et ne signale pas le refus de claude.ai. Le contrôle doit donc être ajouté en CI |
| 6 | Tâches planifiées cloud : research preview, plans, 1 h minimum, 100 runs/h, `/fire` Bearer, mode auto, connecteurs, Limited, 72 h | **Confirmé** | Page routines. À ajouter : 30 déclenchements par heure et par tâche pour Run now et API réunis, 100 par heure et par compte pour les appels API ; jeton API créé uniquement sur le web ; cron en UTC sauf préfixe `CRON_TZ=` ; les runs consomment l'abonnement ; en-tête bêta `experimental-cc-routine-2026-04-01` |
| 7 | Un plugin ne peut pas se planifier ; monitors hors `-p` et hors plugin de dépôt | **Confirmé** | Aucune occurrence de schedule, cron ou routine dans le manifeste ni dans components. Monitors : « don't start in non-interactive mode with the `-p` flag » ; « Background monitors do not load » pour un plugin de dépôt |
| 8 | Artifacts : 16 Mio, CSP, privés, Pro et plus, désactivés en `-p`/SDK/Action, connecteurs du lecteur, republication sans demander en mode auto | **Corrigé** (règles de republication) | Contraintes et disponibilité confirmées. Mais le § 4.3 mélange deux modes. **En mode auto**, la publication dépend du classifieur (et des règles `ask`). **En mode Accept edits**, Claude ne republie sans demander que si 7 conditions tiennent : pas de capability déclarée, **aucune autorisation de connecteur sur la page existante**, artifact non public, etc. ; et un run lancé par API ou GitHub demande toujours. Une session authentifiée par clé API (Action avec `ANTHROPIC_API_KEY`, `--bare`) ne peut pas publier du tout |
| 9 | `validate` et `eval` (3 runs avec, 3 sans, mocks, codes de sortie, coût) | **Confirmé** | Test `validate --strict --json` ; `claude plugin eval --help` (options `--runs`, `--ablation`, `--max-cost-usd`, `--mocks record|off`, `-j` de 1 à 8). Précisions : les contrôles de l'annuaire exigent aussi une **LICENSE** ou un champ `license` (code `LICENSE_MISSING`, bloquant), en plus du README de 40 mots et de l'icône ; certains cas ne tournent qu'avec un bras par défaut |
| 10 | Auto-update désactivé pour une marketplace tierce ; `version` fige ; nom d'entrée égal au `name` | **Corrigé** | Auto-update et `version` confirmés. Le nom d'entrée et le nom du manifeste **peuvent différer**. L'installation échoue (`not found`) seulement si l'on installe par le nom du manifeste ; garder les deux identiques est une recommandation. Pour la voie cloud : un plugin ajouté sur claude.ai se met à jour par **Check for updates** ou **Sync automatically** (marketplace GitHub), pas par l'auto-update de Claude Code ; `version` ne fige pas un plugin d'une marketplace hébergée sur claude.ai |
| 11 | Sortie MCP plafonnée à 25 000 tokens, avertissement à 10 000 | **Confirmé**, avec un seuil de plus | Page MCP. En plus : un résultat texte de **plus de 50 000 caractères est enregistré dans un fichier**, quel que soit son nombre de tokens. Un outil peut relever ce seuil via `_meta["anthropic/maxResultSizeChars"]`, jusqu'à 500 000 |
| 12 | Connecteurs « partner » (Apify, Exa, Firecrawl, Tavily, Similarweb, Ahrefs, Semrush, Product Hunt, vidIQ) ; plugins OM exa, firecrawl, tavily, brightdata-plugin ; `apify/agent-skills` | **Confirmé** | JSON de claude.com/connectors : `verifiedTier: partner` et surface `claude-code` pour chacun. Apify a deux entrées : une distante (claude, claude-api, claude-code, desktop) et une locale réservée à Desktop. `claude-plugins-official` : 317 entrées, dont exa, firecrawl, tavily, brightdata-plugin, skill-creator, plugin-dev, postiz. `apify-ultimate-scraper` couvre bien TikTok, Instagram, YouTube, Reddit et Google Trends |
| 13 | DataForSEO (MCP hébergé, 50 $ minimum) ; Brave (5 $ les 1 000, stockage sur plan sur mesure) | **Confirmé** | Pages éditeurs. Précisions : DataForSEO documente l'ajout de son URL MCP comme **connecteur personnalisé** dans Claude (Customize → Connectors), ce qui ouvre une voie sans *network secret* ; 1 $ d'essai ; Brave affiche aussi « Up to $20 in free calls every month » en tête de page |
| 14 | API Google Trends en alpha sur candidature ; YouTube 10 000 unités et 100 `search.list` par jour | **Confirmé** | Pages Google. Précision : chaque page supplémentaire de `search.list` compte comme un appel ; `videos.list` (par exemple `chart=mostPopular` + `regionCode`) coûte 1 unité dans le budget de 10 000 |
| 15 | Stripe absent au Maroc, Sénégal, Tunisie, Algérie ; Côte d'Ivoire en Extended network ; Postiz sans offre gratuite ; Supabase en pause après 1 semaine | **Confirmé** | stripe.com/global (pays absents de la liste) ; Postiz « There is no free plan », 29 à 99 $, essai 7 jours ; Supabase « paused after 1 week of inactivity » |
| 16 | GitHub Action : plugins, cron, 60 jours, authentification | **Confirmé**, source à corriger | Inputs `plugin_marketplaces` et `plugins` confirmés. La règle des 60 jours vient de la documentation GitHub (events-that-trigger-workflows), pas de la page Claude citée |
| 17 | Coût de contexte d'un `claude -p` trivial (0,43 $) | **Confirmé** (ordre de grandeur) | Nouvelle mesure ici : 0,376 $, environ 53 000 tokens d'entrée (23 089 en création de cache, 29 908 lus en cache), modèle par défaut `claude-fable-5-2` |
| 18 | Agent SDK : pas de connexion claude.ai pour un produit tiers | **Confirmé** | Note de la page Agent SDK, mot pour mot |

Contrôles de nommage : les 34 événements de hooks listés au § 2.6 existent dans la référence actuelle ; les types `command`, `http`, `mcp_tool`, `prompt`, `agent` et le champ `onFailure` aussi. Le préfixe `mcp__plugin_<plugin>_<serveur>__<outil>` est observé dans cette session. Je n'ai trouvé aucun champ, commande ou événement inexistant ou renommé dans le dossier.

### Points nouveaux qui touchent la conception

1. **`userConfig` ne sert à rien dans une tâche cloud.** `pluginConfigs` n'est lu qu'aux scopes utilisateur ou géré, et les valeurs sensibles sont dans le trousseau local. L'arborescence du § 7.2 (`dataforseo_login`, `youtube_api_key`, `brave_key` en `sensitive`) ne fonctionne qu'en local. En cloud : *network secrets* injectés par le proxy, et paramètres (marchés, niches, budget) dans un fichier du dépôt `radar-data`. Chaque option `userConfig` doit avoir une valeur par défaut.
2. **Les scripts de collecte ne voient jamais la clé en cloud.** Le proxy ajoute l'en-tête après la sortie de la VM, et les types de secret sont Bearer, en-tête personnalisé ou identifiant/mot de passe. DataForSEO passe en identifiant/mot de passe. YouTube doit envoyer la clé en en-tête `X-Goog-Api-Key` plutôt qu'en paramètre `?key=` [H, à tester].
3. **Ajouter en CI un contrôle maison qui refuse un `bin/` à la racine**, puisque `validate --strict` ne le signale pas.
4. **Tableau de bord récurrent** : pour une republication sans intervention, publier un instantané statique, sans appel de connecteur ni partage public, et tester la publication en mode auto. Une page qui appelle les connecteurs du lecteur fera demander une confirmation en mode Accept edits.
5. **Workflows en tâche planifiée** : le mot-clé ultracode ne déclenche rien dans un prompt planifié. Sur Pro, les workflows s'activent dans `/config` (réglage utilisateur, donc peut-être absent en cloud) [H]. La pause à la limite d'usage ne vaut qu'en session interactive : ailleurs, les agents échouent. Le fan-out tendance × marché doit donc être borné et testé par un « Run now ».

### Restant invérifiable

- Chargement d'un plugin synchronisé dans une tâche planifiée (et non une session cloud ouverte à la main) : à confirmer par un « Run now ».
- Acceptation par claude.ai d'un plugin téléversé dont les skills utilisent des champs propres à Claude Code. La limite à six champs vise les skills téléversées seules. Les plugins `@synced` observés ici portent bien `argument-hint` et `user-invocable`, mais ils viennent de marketplaces officielles.
