"""Contrôle de santé par source, pour le pilote de 14 jours.

Un jour est « bon » pour une source si au moins 90 % de ses unités ont réussi
(une unité = une vitrine, un pays, une requête). Une source est maintenue si
elle est bonne au moins 90 % des jours observés (seuils réglables).
"""

from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta
from typing import Any, Iterable


def daily_success(entries: Iterable[dict[str, Any]]) -> dict[str, dict[str, dict[str, int]]]:
    """{source: {jour: {"total": n, "ok": m, "runs": r}}}"""
    out: dict[str, dict[str, dict[str, int]]] = defaultdict(lambda: defaultdict(lambda: {"total": 0, "ok": 0, "runs": 0}))
    for e in entries:
        day = e["ts"][:10]
        cell = out[e["source"]][day]
        cell["total"] += int(e.get("units_total", 0))
        cell["ok"] += int(e.get("units_ok", 0))
        cell["runs"] += 1
    return out


def report(entries: list[dict[str, Any]], today: date, days: int = 14, day_threshold: float = 0.9,
           keep_threshold: float = 0.9) -> list[dict[str, Any]]:
    start = (today - timedelta(days=days - 1)).isoformat()
    window = [e for e in entries if e["ts"][:10] >= start]
    per = daily_success(window)
    last_error: dict[str, str] = {}
    for e in window:
        if e.get("errors"):
            last_error[e["source"]] = e["errors"][-1]
    rows = []
    for source in sorted(per):
        cells = per[source]
        good = sum(1 for c in cells.values() if c["total"] and c["ok"] / c["total"] >= day_threshold)
        observed = len(cells)
        units_total = sum(c["total"] for c in cells.values())
        units_ok = sum(c["ok"] for c in cells.values())
        rate = good / observed if observed else 0.0
        rows.append({
            "source": source,
            "days_observed": observed,
            "days_good": good,
            "day_rate": round(rate, 3),
            "unit_rate": round(units_ok / units_total, 3) if units_total else 0.0,
            "verdict": ("maintenue" if rate >= keep_threshold else "à revoir") if observed >= days else "pilote en cours",
            "last_error": last_error.get(source, ""),
        })
    return rows
