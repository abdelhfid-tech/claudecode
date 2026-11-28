"""Wikimedia : jeu quotidien des pages vues par pays (confidentialité différentielle).

Colonnes du fichier : pays, code pays, projet, identifiant de page, titre, QID, vues.
Seuil de publication de 90 vues par jour pour les pays à risque faible. La
couverture varie dans le temps (le Maroc est passé de 1 300 lignes par jour en
2023 à 74 en 2026) : on enregistre aussi le nombre de lignes par pays, pour
normaliser plus tard et ne jamais conclure « absent » sous le seuil.

On garde, pour les pays suivis, les N pages les plus vues par projet et toutes
les lignes des QID suivis. L'identifiant de page permet de suivre un article
renommé.
"""

from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta
from typing import Any, Iterable

from ..storage import make_record
from .base import Collector, Context, Result

URL = "https://analytics.wikimedia.org/published/datasets/country_project_page/{day}.tsv"


def parse_rows(text: str) -> Iterable[dict[str, Any]]:
    for line in text.splitlines():
        parts = line.split("\t")
        if len(parts) < 7:
            continue
        try:
            views = int(parts[6])
        except ValueError:
            continue  # ligne d'en-tête éventuelle
        yield {"country": parts[0], "code": parts[1], "project": parts[2], "page_id": parts[3],
               "title": parts[4], "qid": parts[5] or None, "views": views}


def select(rows: Iterable[dict[str, Any]], countries: set[str], projects: set[str] | None,
           top_n: int, qids: set[str], origins: set[str] | None = None,
           top_n_origin: int | None = None) -> tuple[list[dict[str, Any]], dict[str, int]]:
    """Renvoie (lignes retenues, nombre total de lignes par pays suivi).

    Lignes retenues, pour les pays suivis :
      - le top `top_n` de chaque couple (pays, projet) : tendances locales et flux inverses ;
      - toutes les lignes, dans tous les pays suivis, des QID qui figurent dans le top
        `top_n_origin` d'un pays d'origine (USA, sentinelles) ou dans la liste suivie.
    La seconde règle permet de savoir si une page en vogue aux USA est lue en France ou
    au Maroc : son absence d'un top local ne prouverait rien, son absence du fichier dit
    qu'elle est sous le seuil de publication.
    """
    coverage: dict[str, int] = defaultdict(int)
    groups: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    tracked: list[dict[str, Any]] = []
    for row in rows:
        if row["code"] not in countries:
            continue
        coverage[row["code"]] += 1
        if row["qid"]:
            tracked.append(row)
        if projects is None or row["project"] in projects:
            groups[(row["code"], row["project"])].append(row)
    follow = set(qids)
    keep_keys: set[tuple[str, str, str]] = set()
    for (code, _project), rows_ in groups.items():
        rows_.sort(key=lambda r: -r["views"])
        for r in rows_[:top_n]:
            keep_keys.add((r["code"], r["project"], r["page_id"]))
        if origins and code in origins:
            for r in rows_[: (top_n_origin or top_n)]:
                if r["qid"]:
                    follow.add(r["qid"])
    for r in tracked:
        if r["qid"] in follow:
            keep_keys.add((r["code"], r["project"], r["page_id"]))
    kept = [r for rows_ in groups.values() for r in rows_ if (r["code"], r["project"], r["page_id"]) in keep_keys]
    seen = {(r["code"], r["project"], r["page_id"]) for r in kept}
    kept += [r for r in tracked if (r["code"], r["project"], r["page_id"]) in keep_keys
             and (r["code"], r["project"], r["page_id"]) not in seen]
    return kept, dict(coverage)


class WikimediaCountry(Collector):
    name = "wikimedia_country"
    family = "attention"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        cfg = ctx.source_config
        countries = set(cfg.get("countries", []))
        projects = set(cfg["projects"]) if cfg.get("projects") else None
        qids = set(cfg.get("qids", []))
        last_done = ctx.state.get("wikimedia_last_day")
        # Le fichier du jour J paraît avec un ou deux jours de retard.
        candidates = [ctx.day - timedelta(days=d) for d in (1, 2, 3)]
        todo = [d for d in sorted(candidates) if not last_done or d.isoformat() > last_done]
        for day in todo:
            r = ctx.client.request(URL.format(day=day.isoformat()))
            if r.status == 404:
                continue  # pas encore publié : ce n'est pas une panne
            if not r.ok:
                res.unit(False, f"{day}: {r.status or r.error}")
                continue
            kept, coverage = select(parse_rows(r.text()), countries, projects, int(cfg.get("top_n", 50)), qids,
                                    set(cfg.get("origins", ["US", "GB", "CA", "DE"])),
                                    int(cfg.get("top_n_origin", 50)))
            res.unit(True)
            for code, n in sorted(coverage.items()):
                res.records.append(make_record(self.name, code, "coverage", "rows", n,
                                               {"data_day": day.isoformat()}, ts=ctx.now))
            for row in kept:
                key = f"qid:{row['qid']}" if row["qid"] else f"page:{row['project']}:{row['page_id']}"
                res.records.append(make_record(self.name, row["code"], "pageviews", key, row["views"],
                                               {"data_day": day.isoformat(), "project": row["project"],
                                                "page_id": row["page_id"], "title": row["title"]}, ts=ctx.now))
            ctx.state["wikimedia_last_day"] = day.isoformat()
        if res.units_total == 0:
            res.unit(True)  # déjà à jour, ou fichier pas encore publié : ce n'est pas une panne
        return res
