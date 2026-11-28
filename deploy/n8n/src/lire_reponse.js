// Lit la réponse de Claude ; ne continue que si un brouillon a été rédigé.
const res = $input.first().json;
const prep = $("Préparer la demande à Claude").first().json;
if (res.stop_reason === "refusal") return [];
const text = (res.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
let out;
try {
  out = JSON.parse(text);
} catch (e) {
  return [];
}
if (!out.choice || !out.draft || out.draft.format === "aucun") return [];
const c = prep.candidates.find((x) => x.id === out.choice) || { title: out.choice, kind: "?" };
const d = out.draft;

const parts = [
  `Brouillon du radar (${prep.source}) : ${d.format}`,
  `Tendance : ${c.title} [${c.kind}]`,
  `Pourquoi : ${out.reason}`,
  `Angle : ${d.angle}`,
  "",
  "— Français —", d.post_fr,
  "", "— Darija (latin) —", d.post_ary_latin,
  "", "— Darija (arabe) —", d.post_ary_arabe,
];
if (d.video_script) parts.push("", "— Script vidéo (à filmer vous-même) —", d.video_script);
if (d.hashtags && d.hashtags.length) parts.push("", "Hashtags : " + d.hashtags.join(" "));
if (d.check_before_posting && d.check_before_posting.length) {
  parts.push("", "À vérifier avant publication :", ...d.check_before_posting.map((x) => "• " + x));
}
if (d.ai_generated_visuals) parts.push("", "Visuels générés par IA proposés : étiquette « contenu généré par IA » obligatoire.");
const model = res.model ? ` (rédigé par ${res.model})` : "";
let message = parts.join("\n") + model;
if (message.length > 3500) message = message.slice(0, 3490) + " […]";

return [{ json: { candidate: c, draft: d, reason: out.reason, message } }];
