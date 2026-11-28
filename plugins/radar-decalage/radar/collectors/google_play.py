"""Google Play : classements par pays.

Point d'accès non officiel (RPC « vyAe2 »). Le gabarit de requête vient de la
bibliothèque google-play-scraper 10.1.4 (licence MIT) ; il date de 2022 et peut
casser à tout moment : la source a un interrupteur dans sources.toml et le
contrôle de santé signale la panne.
"""

from __future__ import annotations

import json
from typing import Any

from .. import paths
from ..storage import make_record
from .base import Collector, Context, Result

ENDPOINT = ("https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=vyAe2&source-path=%2Fstore%2Fapps"
            "&f.sid=-4178618388443751758&bl=boq_playuiserver_20220612.08_p0&authuser=0&soc-app=121"
            "&soc-platform=1&soc-device=1&_reqid=82003&rt=c&hl={hl}&gl={gl}")

_TEMPLATE: str | None = None


def template() -> str:
    global _TEMPLATE
    if _TEMPLATE is None:
        _TEMPLATE = (paths.PACKAGE_DATA / "gplay_vyAe2.txt").read_text(encoding="utf-8").strip()
    return _TEMPLATE


def build_body(collection: str, category: str = "APPLICATION", num: int = 200) -> str:
    return (template().replace("${num}", str(num)).replace("${collection}", collection)
            .replace("${category}", category))


def _get(node: Any, *path: int) -> Any:
    for i in path:
        if not isinstance(node, list) or i >= len(node):
            return None
        node = node[i]
    return node


def parse(text: str) -> list[dict[str, Any]]:
    """Réponse batchexecute : JSON imbriqué sur la 4e ligne."""
    lines = text.split("\n")
    if len(lines) < 4:
        raise ValueError("réponse trop courte")
    outer = json.loads(lines[3])
    inner = json.loads(outer[0][2])
    items = _get(inner, 0, 1, 0, 28, 0)
    if not isinstance(items, list):
        raise ValueError("liste d'apps introuvable (structure modifiée ?)")
    rows = []
    for rank, it in enumerate(items, start=1):
        pkg = _get(it, 0, 0, 0)
        if not isinstance(pkg, str):
            continue
        rows.append({"rank": rank, "id": pkg, "name": _get(it, 0, 3) or "", "category": _get(it, 0, 5) or "",
                     "developer": _get(it, 0, 14) or "", "rating": _get(it, 0, 4, 1),
                     "installs": _get(it, 0, 15) or ""})
    return rows


class GooglePlayCharts(Collector):
    name = "google_play"
    family = "stores"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        cfg = ctx.source_config
        num = int(cfg.get("num", 200))
        collections = cfg.get("collections", ["topselling_free"])
        for zone in ctx.zones.with_flag("play"):
            for collection in collections:
                r = ctx.client.request(
                    ENDPOINT.format(hl=zone.get("hl", "en"), gl=zone["play"]),
                    data=build_body(collection, num=num).encode("utf-8"),
                    headers={"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"})
                if not r.ok:
                    res.unit(False, f"{zone['code']} {collection}: {r.status or r.error}")
                    continue
                try:
                    rows = parse(r.text())
                except (ValueError, IndexError, TypeError) as exc:
                    res.unit(False, f"{zone['code']} {collection}: illisible ({exc})")
                    continue
                res.unit(bool(rows), None if rows else f"{zone['code']} {collection}: vide")
                for row in rows:
                    res.records.append(make_record(
                        self.name, zone["code"], "rank", f"android:{row['id']}", row["rank"],
                        {"chart": collection, "name": row["name"], "category": row["category"],
                         "developer": row["developer"], "rating": row["rating"], "installs": row["installs"]},
                        ts=ctx.now))
        return res
