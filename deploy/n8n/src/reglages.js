// Réglages du flux « Radar : contenu réactif ». Modifiez seulement cet objet.
const REGLAGES = {
  // Votre identifiant de discussion Telegram (voir deploy/README.md, étape 2).
  telegram_chat_id: "",

  // Modèle Claude et niveau d'effort. Environ 0,05 à 0,10 $ par jour pour un appel quotidien (estimation).
  model: "claude-opus-5-5",
  effort: "medium",

  // Public visé, pour adapter le ton.
  audience_fr: "entrepreneurs, indépendants et curieux du numérique en France et en Belgique",
  audience_ary: "jeunes actifs et créateurs au Maroc et dans la diaspora",

  // Comptes Blotato où programmer un texte validé (laisser la liste vide pour publier vous-même).
  // platform : linkedin, threads, twitter, bluesky, facebook (pageId requis) ; langue : fr, ary_latin, ary_arabe.
  // Les vidéos (TikTok, Instagram, YouTube) ne sont jamais programmées : vous recevez le script et filmez.
  blotato: [
    // { accountId: "12345", platform: "linkedin", langue: "fr" },
    // { accountId: "67890", platform: "threads", langue: "ary_latin" },
  ],

  // Alerte Telegram quand une source du radar répond moins de 90 % des jours (après 3 jours observés).
  alerte_sante: true,
};

return $input.all().map((item) => ({ json: { ...item.json, settings: REGLAGES } }));
