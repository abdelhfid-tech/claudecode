// Normalise les deux entrées (radar ou formulaire) et prépare la requête à l'API Claude.
const item = $input.first().json;
const s = item.settings;
let source, candidates;

if (item.body && Array.isArray(item.body.candidates)) {
  source = "radar";
  candidates = item.body.candidates.slice(0, 8);
} else {
  // Formulaire « Tendance repérée » : une tendance vue par vous (TikTok, Instagram…).
  const label = (start) => Object.keys(item).find((k) => k.toLowerCase().startsWith(start));
  const tendance = String(item[label("tendance")] || "").trim();
  if (!tendance) return [];
  source = "formulaire";
  candidates = [{
    id: "manuel:" + Date.now(),
    kind: "tendance_reperee",
    title: tendance.slice(0, 300),
    signal: { source: "repérée par vous" },
    presence: { FR: "à vérifier", MA: "à vérifier" },
    context: [item[label("lien")], item[label("pourquoi")]].filter(Boolean).map(String),
  }];
}
if (!candidates.length) return [];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["choice", "reason", "rejected", "draft"],
  properties: {
    choice: { type: "string", description: "id du candidat retenu, ou chaîne vide si aucun ne convient" },
    reason: { type: "string" },
    rejected: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["id", "reason"],
        properties: { id: { type: "string" }, reason: { type: "string" } },
      },
    },
    draft: {
      type: "object",
      additionalProperties: false,
      required: ["format", "angle", "post_fr", "post_ary_latin", "post_ary_arabe", "video_script",
                 "hashtags", "check_before_posting", "ai_generated_visuals"],
      properties: {
        format: { type: "string", enum: ["post", "carrousel", "video_courte", "aucun"] },
        angle: { type: "string" },
        post_fr: { type: "string" },
        post_ary_latin: { type: "string" },
        post_ary_arabe: { type: "string" },
        video_script: { type: "string" },
        hashtags: { type: "array", items: { type: "string" } },
        check_before_posting: { type: "array", items: { type: "string" } },
        ai_generated_visuals: { type: "boolean" },
      },
    },
  },
};

const system = [
  "Tu prépares un brouillon de publication pour un créateur francophone qui vit entre la France et le Maroc et écrit aussi en darija.",
  "Il relira, corrigera et validera lui-même le texte avant toute publication : tu proposes, il décide.",
  "",
  "On te donne des candidats repérés aux États-Unis ou ailleurs et encore peu présents en France ou au Maroc.",
  "Choisis-en AU PLUS UN qui se prête à un contenu utile ou divertissant pour ces publics :",
  "un format, un produit, une app, un usage ou un concept transposable.",
  "Écarte : l'actualité, le sport, les résultats, les célébrités, la politique, les décès et les drames,",
  "tout ce qui vise des mineurs, les allégations de santé, les jeux d'argent et les paris, l'alcool et la nicotine,",
  "le conseil financier. Si rien ne convient, renvoie choice vide et format « aucun » : c'est une bonne réponse.",
  "",
  "Règles de rédaction :",
  "- Écris comme un humain qui partage une découverte, pas comme une marque. Phrases courtes, un seul message par texte.",
  "- N'invente aucun chiffre, aucune date ni citation. Ce qui doit être vérifié va dans check_before_posting.",
  "- Le texte français fait 1 200 caractères au plus ; les deux textes en darija disent la même chose, naturellement,",
  "  l'un en graphie latine (arabizi, chiffres 3, 7, 9 si besoin), l'autre en graphie arabe.",
  "- 5 hashtags au plus. Pas d'émoji en excès.",
  "- Si le format est une vidéo courte, écris un script de 30 à 45 secondes à filmer par l'auteur lui-même.",
  "- ai_generated_visuals vaut true seulement si tu proposes des visuels à générer par IA (ils devront alors être étiquetés).",
  "",
  `Public en français : ${s.audience_fr}. Public en darija : ${s.audience_ary}.`,
  `Date du jour : ${new Date().toISOString().slice(0, 10)}.`,
].join("\n");

const request = {
  model: s.model,
  max_tokens: 16000,
  fallbacks: "default",
  output_config: { effort: s.effort, format: { type: "json_schema", schema: SCHEMA } },
  system,
  messages: [{
    role: "user",
    content: "Candidats du jour (" + source + ") :\n" + JSON.stringify(candidates, null, 1),
  }],
};

return [{ json: { source, candidates, request } }];
