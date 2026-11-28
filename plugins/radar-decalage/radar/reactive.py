"""Module de contenu réactif : candidats du jour pour un brouillon, envoyés au flux n8n.

Niveau A retenu : brouillons validés par vous. Le radar ne publie rien ; il prépare une
courte liste de candidats, le flux n8n en choisit au plus un, Claude rédige, vous validez.

Trois sources de candidats, toutes déjà collectées :
- tendances du jour Google aux USA absentes des tendances françaises et marocaines ;
- pages Wikipedia nouvelles dans le top américain, peu ou pas lues en France ou au Maroc ;
- apps récentes fortes aux USA et indisponibles en France ou au Maroc.

Limite connue : ces sources gratuites captent surtout des événements (sport, célébrités,
séries) et peu de formats ou de mèmes, qui vivent sur TikTok. Le tri fin est donc confié
à Claude dans le flux n8n, et une entrée manuelle (formulaire n8n) reçoit les tendances
TikTok que vous repérez vous-même.
"""

from __future__ import annotations

import json
import math
import re
import urllib.error
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from . import analysis, health, paths, settings
from .collectors.gtrends import normalize
from .storage import RawStore, RunLog, load_json, save_json


def _compile(patterns: list[str]) -> list[re.Pattern]:
    return [re.compile(p, re.I) for p in patterns]


def _excluded(text: str, patterns: list[re.Pattern]) -> bool:
    return any(p.search(text) for p in patterns)


def _days_back(store: RawStore, source: str, n: int) -> list[date]:
    days = store.days(source)
    return days[-n:] if days else []


def trend_candidates(store: RawStore, cfg: dict[str, Any], patterns: list[re.Pattern]) -> list[dict[str, Any]]:
    days = _days_back(store, "gtrends_daily", int(cfg.get("days", 2)))
    by_zone: dict[str, dict[str, dict[str, Any]]] = {"US": {}, "FR": {}, "MA": {}}
    for d in days:
        for r in store.read("gtrends_daily", d):
            if r.get("kind") != "trending" or r["zone"] not in by_zone:
                continue
            title = r["meta"].get("title", "")
            key = normalize(title)
            prev = by_zone[r["zone"]].get(key)
            if prev is None or (r.get("value") or 0) > (prev.get("value") or 0):
                by_zone[r["zone"]][key] = {**r, "title": title}
    elsewhere = set(by_zone["FR"]) | set(by_zone["MA"])
    out = []
    for key, r in by_zone["US"].items():
        traffic = r.get("value") or 0
        if traffic < int(cfg.get("min_traffic", 1000)) or _excluded(r["title"], patterns):
            continue
        if key in elsewhere or any(key in other or other in key for other in elsewhere if len(other) > 4):
            continue
        out.append({
            "id": f"trend:{key}", "kind": "tendance_recherche", "title": r["title"],
            "signal": {"source": "Google Trends, tendances du jour USA", "traffic": traffic,
                       "traffic_label": r["meta"].get("traffic_label")},
            "presence": {"FR": "absent des tendances du jour", "MA": "absent des tendances du jour"},
            "context": [n.get("title", "") for n in r["meta"].get("news", []) if n.get("title")][:3],
            "score": math.log10(max(traffic, 1)),
        })
    return out


def page_candidates(store: RawStore, cfg: dict[str, Any], patterns: list[re.Pattern]) -> list[dict[str, Any]]:
    days = store.days("wikimedia_country")
    if not days:
        return []
    views: dict[str, dict[str, dict[str, tuple[int, str, str]]]] = {}
    for d in days[-12:]:
        for r in store.read("wikimedia_country", d):
            if r.get("kind") != "pageviews" or not r["key"].startswith("qid:"):
                continue
            data_day = r["meta"]["data_day"]
            views.setdefault(data_day, {}).setdefault(r["zone"], {})[r["key"]] = (
                int(r["value"]), r["meta"].get("title", ""), r["meta"].get("project", ""))
    if not views:
        return []
    latest = max(views)
    latest_d = date.fromisoformat(latest)
    lo = (latest_d - timedelta(days=int(cfg.get("lookback_to_days", 8)))).isoformat()
    hi = (latest_d - timedelta(days=int(cfg.get("lookback_from_days", 3)))).isoformat()
    earlier = set()
    for day, zones in views.items():
        if lo <= day <= hi:
            earlier.update(zones.get("US", {}).keys())
    if not earlier:
        return []  # pas assez d'historique pour dire qu'une page est « nouvelle »
    out = []
    for qid, (v, title, project) in views[latest].get("US", {}).items():
        if project != "en.wikipedia" or v < int(cfg.get("min_views", 20000)) or qid in earlier:
            continue
        if _excluded(title, patterns):
            continue
        fr = views[latest].get("FR", {}).get(qid)
        ma = views[latest].get("MA", {}).get(qid)
        out.append({
            "id": f"page:{qid}", "kind": "page_wikipedia", "title": title.replace("_", " "),
            "signal": {"source": "Wikipedia, pages vues par pays", "us_views": v, "data_day": latest},
            "presence": {
                "FR": f"{fr[0]} vues" if fr else "sous le seuil de publication (moins de 90 vues)",
                "MA": f"{ma[0]} vues" if ma else "sous le seuil de publication (moins de 90 vues)",
            },
            "context": [f"https://en.wikipedia.org/wiki/{title}"],
            "score": math.log10(max(v, 1)) - 1.0,
        })
    return out


def app_candidates(store: RawStore, cfg: dict[str, Any], patterns: list[re.Pattern]) -> list[dict[str, Any]]:
    out = []
    for g in analysis.gaps(store, targets=("FR", "MA")):
        if g["class"] not in ("récente", "intermédiaire", "mondiale") or _excluded(g["name"], patterns):
            continue
        if any("récompenses" in f or "une seule vitrine" in f for f in g.get("flags", [])):
            continue
        out.append({
            "id": f"app:{g['app']}", "kind": "app", "title": g["name"],
            "signal": {"source": "App Store, classements et disponibilité", "best_origin": g["best_origin"],
                       "available": g["available_count"], "age_days": g["age_days"]},
            "presence": {t: g["target_status"].get(t, "?") for t in ("FR", "MA")},
            "context": [f"https://apps.apple.com/us/app/id{g['app']}"] + g.get("flags", []),
            "score": 5.0 - math.log10(max(g["best_rank"], 1)),
        })
        if len(out) >= int(cfg.get("max", 3)):
            break
    return out


def build(store: RawStore, today: date, cfg: dict[str, Any] | None = None,
          sent: dict[str, str] | None = None) -> list[dict[str, Any]]:
    cfg = cfg if cfg is not None else settings.load("reactive")
    patterns = _compile(cfg.get("exclude_patterns", []))
    sent = sent or {}
    cutoff = (today - timedelta(days=int(cfg.get("resend_after_days", 14)))).isoformat()
    pool = (trend_candidates(store, cfg.get("gtrends", {}), patterns)
            + page_candidates(store, cfg.get("wikimedia", {}), patterns)
            + app_candidates(store, cfg.get("apps", {}), patterns))
    fresh = [c for c in pool if sent.get(c["id"], "") < cutoff]
    fresh.sort(key=lambda c: (-c["score"], c["id"]))
    return fresh[: int(cfg.get("max_candidates", 8))]


def payload(candidates: list[dict[str, Any]], health_rows: list[dict[str, Any]], now: datetime) -> dict[str, Any]:
    return {"version": 1, "generated_at": now.astimezone(timezone.utc).isoformat(), "day": now.date().isoformat(),
            "candidates": candidates, "health": health_rows}


def post(url: str, body: dict[str, Any], token: str | None, opener=urllib.request.urlopen, timeout: float = 30.0) -> int:
    """Envoie la charge au webhook n8n (votre serveur). Renvoie le statut HTTP."""
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    headers = {"Content-Type": "application/json", "User-Agent": "radar-decalage"}
    if token:
        headers["X-Radar-Token"] = token
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with opener(req, timeout=timeout) as resp:
            return getattr(resp, "status", 200)
    except urllib.error.HTTPError as exc:
        return exc.code


def run(now: datetime, post_url: str | None = None, token: str | None = None, opener=urllib.request.urlopen,
        dry_run: bool = False) -> dict[str, Any]:
    store = RawStore(paths.data_dir())
    folder = paths.workspace() / "reactive"
    sent_path = folder / "sent.json"
    sent, _ = load_json(sent_path, {})
    candidates = build(store, now.date(), sent=sent)
    rows = health.report(list(RunLog(paths.data_dir()).entries()), now.date(), 14)
    body = payload(candidates, rows, now)
    status = None
    if not dry_run:
        folder.mkdir(parents=True, exist_ok=True)
        save_json(folder / f"candidates-{now.date().isoformat()}.json", body)
        if post_url:
            status = post(post_url, body, token, opener)
            if status and 200 <= status < 300:
                for c in candidates:
                    sent[c["id"]] = now.date().isoformat()
                save_json(sent_path, sent)
    return {"candidates": candidates, "health": rows, "post_status": status}
