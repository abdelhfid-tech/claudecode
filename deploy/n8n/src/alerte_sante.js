// Alerte si une source du radar répond mal (pilote de 14 jours).
const item = $input.first().json;
if (!item.settings.alerte_sante || !item.body || !Array.isArray(item.body.health)) return [];
const bad = item.body.health.filter((r) => r.days_observed >= 3 && r.day_rate < 0.9);
if (!bad.length) return [];
const lines = bad.map((r) => `• ${r.source} : ${Math.round(r.day_rate * 100)} % de jours bons sur ${r.days_observed}`
  + (r.last_error ? ` (dernière erreur : ${String(r.last_error).slice(0, 120)})` : ""));
return [{ json: { text: "Radar : sources à surveiller\n" + lines.join("\n") } }];
