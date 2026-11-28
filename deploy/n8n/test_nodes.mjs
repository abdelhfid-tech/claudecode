// Banc d'essai des nœuds Code du flux n8n, sans n8n : node deploy/n8n/test_nodes.mjs
// Chaque fichier de src/ est exécuté comme dans un nœud Code (« Run Once for All Items »),
// avec $input et $("Nom du nœud") simulés.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function node(name) {
  const code = readFileSync(join(here, "src", `${name}.js`), "utf8");
  const fn = new AsyncFunction("$input", "$", code);
  return async (inputItems, others = {}) => {
    const $input = { all: () => inputItems.map((json) => ({ json })), first: () => ({ json: inputItems[0] }) };
    const $ = (n) => {
      if (!(n in others)) throw new Error(`nœud inconnu : ${n}`);
      return { first: () => ({ json: others[n] }), item: { json: others[n] } };
    };
    const out = await fn($input, $);
    assert.ok(Array.isArray(out), `${name} doit renvoyer une liste`);
    return out.map((x) => x.json);
  };
}

const results = [];
async function test(label, f) {
  try {
    await f();
    results.push(["ok", label]);
  } catch (e) {
    results.push(["ÉCHEC", label, e.message]);
  }
}

const SETTINGS_BASE = (await node("reglages")([{}]))[0].settings;
const radarBody = {
  body: {
    candidates: [
      { id: "app:1", kind: "app", title: "Muse from Meta", presence: { FR: "indisponible", MA: "indisponible" } },
      { id: "page:Q2", kind: "page_wikipedia", title: "Joe Milton", presence: { FR: "621 vues" } },
    ],
    health: [
      { source: "apple_charts", days_observed: 5, day_rate: 0.6, last_error: "US top-free : 502" },
      { source: "autocomplete", days_observed: 5, day_rate: 1.0, last_error: "" },
    ],
  },
};
const goodDraft = {
  format: "post", angle: "Ce que Muse change", post_fr: "Texte FR", post_ary_latin: "Texte darija",
  post_ary_arabe: "نص", video_script: "", hashtags: ["#ia", "#maroc"], check_before_posting: ["date de lancement"],
  ai_generated_visuals: false,
};
const claudeReply = (obj, extra = {}) => ({
  model: "claude-opus-5-5", stop_reason: "end_turn",
  content: [{ type: "thinking", thinking: "" }, { type: "text", text: JSON.stringify(obj) }], ...extra,
});

await test("Réglages ajoute les réglages à chaque élément", async () => {
  const out = await node("reglages")([{ a: 1 }, { b: 2 }]);
  assert.equal(out.length, 2);
  assert.equal(out[0].settings.model, "claude-opus-5-5");
  assert.deepEqual(out[0].settings.blotato, []);
});

await test("Préparer : entrée radar -> requête Claude conforme", async () => {
  const [o] = await node("preparer")([{ ...radarBody, settings: SETTINGS_BASE }]);
  assert.equal(o.source, "radar");
  assert.equal(o.candidates.length, 2);
  const r = o.request;
  assert.equal(r.model, "claude-opus-5-5");
  assert.equal(r.fallbacks, "default");
  assert.equal(r.output_config.effort, "medium");
  assert.equal(r.output_config.format.type, "json_schema");
  assert.ok(!("thinking" in r) && !("temperature" in r));
  assert.equal(r.messages[0].role, "user");
  const walk = (s) => {
    if (s.type === "object") {
      assert.equal(s.additionalProperties, false);
      assert.deepEqual([...s.required].sort(), Object.keys(s.properties).sort());
      Object.values(s.properties).forEach(walk);
    }
    if (s.type === "array") walk(s.items);
  };
  walk(r.output_config.format.schema);
});

await test("Préparer : entrée formulaire", async () => {
  const form = { "Tendance (ce que vous avez vu)": "Des « run clubs » le dimanche matin",
                 "Lien (TikTok, Instagram…)": "https://www.tiktok.com/@x/video/1", settings: SETTINGS_BASE };
  const [o] = await node("preparer")([form]);
  assert.equal(o.source, "formulaire");
  assert.equal(o.candidates[0].kind, "tendance_reperee");
  assert.match(o.candidates[0].context[0], /tiktok/);
});

await test("Préparer : rien à traiter -> aucune requête", async () => {
  assert.deepEqual(await node("preparer")([{ body: { candidates: [] }, settings: SETTINGS_BASE }]), []);
  assert.deepEqual(await node("preparer")([{ "Tendance (ce que vous avez vu)": "  ", settings: SETTINGS_BASE }]), []);
});

const prep = (await node("preparer")([{ ...radarBody, settings: SETTINGS_BASE }]))[0];

await test("Lire la réponse : brouillon -> message Telegram", async () => {
  const [o] = await node("lire_reponse")([claudeReply({ choice: "app:1", reason: "nouveau", rejected: [], draft: goodDraft })],
                                          { "Préparer la demande à Claude": prep });
  assert.equal(o.candidate.title, "Muse from Meta");
  assert.match(o.message, /Texte FR/);
  assert.match(o.message, /À vérifier avant publication/);
  assert.ok(o.message.length <= 3500);
});

await test("Lire la réponse : aucun candidat retenu, refus, ou JSON illisible -> arrêt", async () => {
  const none = claudeReply({ choice: "", reason: "rien", rejected: [], draft: { ...goodDraft, format: "aucun" } });
  assert.deepEqual(await node("lire_reponse")([none], { "Préparer la demande à Claude": prep }), []);
  assert.deepEqual(await node("lire_reponse")([claudeReply({}, { stop_reason: "refusal" })],
                                               { "Préparer la demande à Claude": prep }), []);
  const broken = { stop_reason: "end_turn", content: [{ type: "text", text: "pas du json" }] };
  assert.deepEqual(await node("lire_reponse")([broken], { "Préparer la demande à Claude": prep }), []);
});

const lu = { draft: goodDraft, candidate: { title: "Muse" }, message: "m" };
const withTargets = { ...SETTINGS_BASE, blotato: [
  { accountId: 123, platform: "linkedin", langue: "fr" },
  { accountId: "9", platform: "tiktok", langue: "ary_latin" },
  { accountId: "77", platform: "facebook", langue: "ary_arabe", pageId: 555 },
] };

await test("Décision Blotato : publier -> une requête par compte texte, vidéos exclues", async () => {
  const out = await node("decision_blotato")([{ "Décision": "Programmer" }],
                                             { "Lire la réponse": lu, "Réglages": { settings: withTargets } });
  assert.equal(out.length, 2);
  const li = out[0].blotato_request;
  assert.equal(li.useNextFreeSlot, true);
  assert.equal(li.post.accountId, "123");
  assert.equal(li.post.content.platform, li.post.target.targetType);
  assert.deepEqual(li.post.content.mediaUrls, []);
  assert.equal(out[1].blotato_request.post.target.pageId, "555");
});

await test("Décision Blotato : rejet ou absence de réponse -> rien", async () => {
  const ctx = { "Lire la réponse": lu, "Réglages": { settings: withTargets } };
  assert.deepEqual(await node("decision_blotato")([{ "Décision": "Rejeter" }], ctx), []);
  assert.deepEqual(await node("decision_blotato")([{}], ctx), []);
});

await test("Décision manuelle : sans compte Blotato ou pour une vidéo", async () => {
  const noTarget = { "Lire la réponse": lu, "Réglages": { settings: SETTINGS_BASE } };
  const [o] = await node("decision_manuel")([{ "Décision": "Programmer" }], noTarget);
  assert.match(o.text, /aucun compte Blotato/);
  const video = { "Lire la réponse": { ...lu, draft: { ...goodDraft, format: "video_courte" } },
                  "Réglages": { settings: withTargets } };
  assert.match((await node("decision_manuel")([{ "Décision": "Programmer" }], video))[0].text, /vidéo/);
  const withT = { "Lire la réponse": lu, "Réglages": { settings: withTargets } };
  assert.deepEqual(await node("decision_manuel")([{ "Décision": "Programmer" }], withT), []);
  assert.match((await node("decision_manuel")([{ "Décision": "Rejeter" }], withT))[0].text, /rejeté/);
});

await test("Alerte santé : seulement les sources sous 90 %", async () => {
  const [o] = await node("alerte_sante")([{ ...radarBody, settings: SETTINGS_BASE }]);
  assert.match(o.text, /apple_charts : 60 %/);
  assert.doesNotMatch(o.text, /autocomplete/);
  assert.deepEqual(await node("alerte_sante")([{ "Tendance": "x", settings: SETTINGS_BASE }]), []);
});

for (const r of results) console.log(r.join(" — "));
const failed = results.filter((r) => r[0] !== "ok").length;
console.log(`${results.length - failed}/${results.length} réussis`);
process.exit(failed ? 1 : 0);
