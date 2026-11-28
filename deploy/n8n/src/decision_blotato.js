// Après votre décision : prépare une programmation Blotato par compte réglé.
// Le formulaire de validation renvoie le champ « Décision » : « Programmer » ou « Rejeter ».
const decision = String(($input.first().json || {})["Décision"] || "").toLowerCase();
if (decision !== "programmer") return [];
const d = $("Lire la réponse").first().json.draft;
const s = $("Réglages").first().json.settings;
const texts = { fr: d.post_fr, ary_latin: d.post_ary_latin, ary_arabe: d.post_ary_arabe };
const VIDEO = ["tiktok", "instagram", "youtube", "pinterest"];
const out = [];
for (const t of s.blotato || []) {
  const text = texts[t.langue];
  if (!t.accountId || !t.platform || !text || VIDEO.includes(t.platform)) continue;
  const target = { targetType: t.platform };
  if (t.pageId) target.pageId = String(t.pageId);
  out.push({
    json: {
      target_label: `${t.platform} (${t.langue})`,
      blotato_request: {
        post: { accountId: String(t.accountId), content: { text, mediaUrls: [], platform: t.platform }, target },
        useNextFreeSlot: true,
      },
    },
  });
}
return out;
