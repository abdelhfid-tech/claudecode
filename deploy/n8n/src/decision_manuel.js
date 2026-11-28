// Après votre décision : si aucun compte Blotato n'est utilisable, vous publiez vous-même.
// Le formulaire de validation renvoie le champ « Décision » : « Programmer » ou « Rejeter ».
const decision = String(($input.first().json || {})["Décision"] || "").toLowerCase();
const s = $("Réglages").first().json.settings;
const d = $("Lire la réponse").first().json.draft;
const VIDEO = ["tiktok", "instagram", "youtube", "pinterest"];
const usable = (s.blotato || []).filter((t) => t.accountId && t.platform && !VIDEO.includes(t.platform));
if (decision === "rejeter") return [{ json: { text: "Brouillon rejeté. Rien n'est publié." } }];
if (decision !== "programmer") return [];
if (usable.length && d.format !== "video_courte") return [];
const why = d.format === "video_courte" ? "c'est une vidéo à filmer" : "aucun compte Blotato n'est réglé";
return [{ json: { text: `Brouillon validé. À publier vous-même (${why}) : reprenez le texte du message précédent.` } }];
