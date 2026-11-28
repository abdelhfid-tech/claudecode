"""Wikimedia : jeu quotidien des pages vues par pays (confidentialité différentielle).

Colonnes du fichier : pays, code pays, projet, identifiant de page, titre, QID, vues.
Seuil de publication de 90 vues par jour pour les pays à risque faible. La
couverture varie dans le temps (le Maroc est passé de 1 300 lignes par jour en
2023 à 74 en 2026) : on enregistre aussi le nombre de lignes par pays, pour
normaliser plus tard et ne jamais conclure « absent » sous le seuil.

On garde, pour les pays suivis, les N pages les plus vues par projet, et, dans tous
les pays suivis, les lignes des QID qui figurent dans le top des pays d'origine ou
dans la liste suivie. L'identifiant de page permet de suivre un article renommé.

Robustesse : le fichier (environ 16 Mo) est téléchargé sur disque puis lu en flux,
en deux passes ; chaque jour traité est mémorisé, et un jour en échec est repris
au passage suivant (fenêtre de 10 jours) ; un fichier vide ou au format inattendu
est un échec, pas un succès.
"""

from __future__ import annotations

import heapq
from collections import defaultdict
from datetime import timedelta
from pathlib import Path
from typing import Any, Iterable, Iterator

from ..storage import make_record
from .base import Collector, Context, Result

URL = "https://analytics.wikimedia.org/published/datasets/country_project_page/{day}.tsv"
WINDOW_DAYS = 10
MIN_VALID_SHARE = 0.9   # part minimale de lignes lisibles pour accepter un fichier


def parse_rows(lines: Iterable[str], stats: dict[str, int] | None = None) -> Iterator[dict[str, Any]]:
    for line in lines:
        line = line.rstrip("\n")
        if not line:
            continue
        if stats is not None:
            stats["lines"] = stats.get("lines", 0) + 1
        parts = line.split("\t")
        if len(parts) != 7:
            if stats is not None:
                stats["bad"] = stats.get("bad", 0) + 1
            continue
        try:
            views = int(parts[6])
        except ValueError:
            if stats is not None:
                stats["bad"] = stats.get("bad", 0) + 1
            continue
        yield {"country": parts[0], "code": parts[1], "project": parts[2], "page_id": parts[3],
               "title": parts[4], "qid": parts[5] or None, "views": views}


def select(rows_factory, countries: set[str], projects: set[str] | None, top_n: int, qids: set[str],
           origins: set[str] | None = None, top_n_origin: int | None = None) -> tuple[list[dict[str, Any]], dict[str, int]]:
    """Deux passes sur les lignes (`rows_factory()` renvoie un itérateur neuf à chaque appel).

    Passe 1 : couverture par pays, top N par (pays, projet) gardé dans un tas borné, QID
    à suivre (top des pays d'origine et liste suivie). Passe 2 : lignes des QID suivis
    dans tous les pays suivis. La mémoire reste bornée par le nombre de lignes retenues.
    """
    coverage: dict[str, int] = defaultdict(int)
    tops: dict[tuple[str, str], list[tuple[int, int, dict[str, Any]]]] = defaultdict(list)
    origin_n = top_n_origin or top_n
    origin_tops: dict[tuple[str, str], list[tuple[int, int, dict[str, Any]]]] = defaultdict(list)
    counter = 0
    for row in rows_factory():
        if row["code"] not in countries:
            continue
        coverage[row["code"]] += 1
        if projects is not None and row["project"] not in projects:
            continue
        counter += 1
        item = (row["views"], counter, row)
        heap = tops[(row["code"], row["project"])]
        (heapq.heappush if len(heap) < top_n else heapq.heappushpop)(heap, item)
        if origins and row["code"] in origins and row["qid"]:
            oheap = origin_tops[(row["code"], row["project"])]
            (heapq.heappush if len(oheap) < origin_n else heapq.heappushpop)(oheap, item)
    follow = set(qids)
    for heap in origin_tops.values():
        follow.update(r["qid"] for _, _, r in heap)
    kept: dict[tuple[str, str, str], dict[str, Any]] = {}
    for heap in tops.values():
        for _, _, r in sorted(heap, key=lambda x: (-x[0], x[1])):
            kept[(r["code"], r["project"], r["page_id"])] = r
    if follow:
        for row in rows_factory():
            if row["code"] in countries and row["qid"] in follow:
                kept.setdefault((row["code"], row["project"], row["page_id"]), row)
    return list(kept.values()), dict(coverage)


class WikimediaCountry(Collector):
    name = "wikimedia_country"
    family = "attention"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        cfg = ctx.source_config
        countries = {c for c in cfg.get("countries", []) if ctx.zone_ok(c)}
        projects = set(cfg["projects"]) if cfg.get("projects") else None
        qids = set(cfg.get("qids", []))
        done = set(ctx.state.get("wikimedia_done_days", []))
        work = Path(ctx.work_dir) if ctx.work_dir else Path("/tmp")
        # Le fichier du jour J paraît avec un ou deux jours de retard ; on balaie une fenêtre
        # pour rattraper un jour en échec ou une panne de plusieurs jours.
        candidates = [ctx.day - timedelta(days=d) for d in range(1, WINDOW_DAYS + 1)]
        todo = sorted(d for d in candidates if d.isoformat() not in done)
        for day in todo:
            dest = work / f"wikimedia-{day.isoformat()}.tsv"
            r = ctx.client.download(URL.format(day=day.isoformat()), dest)
            if r.status == 404:
                continue  # pas encore publié : ce n'est pas une panne
            if not r.ok:
                res.unit(False, f"{day} : {r.status or r.error}")
                continue
            try:
                stats: dict[str, int] = {}

                def rows():
                    with dest.open(encoding="utf-8", errors="replace") as fh:
                        yield from parse_rows(fh, stats)

                kept, coverage = select(rows, countries, projects, int(cfg.get("top_n", 50)), qids,
                                        set(cfg.get("origins", ["US", "GB", "CA", "DE"])),
                                        int(cfg.get("top_n_origin", 50)))
            finally:
                dest.unlink(missing_ok=True)
            lines, bad = stats.get("lines", 0), stats.get("bad", 0)
            if lines == 0 or (lines - bad) / lines < MIN_VALID_SHARE or not coverage:
                res.unit(False, f"{day} : fichier vide ou au format inattendu ({lines} lignes, {bad} illisibles)")
                continue
            res.unit(True)
            for code, n in sorted(coverage.items()):
                res.records.append(make_record(self.name, code, "coverage", "rows", n,
                                               {"data_day": day.isoformat()}, ts=ctx.now))
            for row in kept:
                key = f"qid:{row['qid']}" if row["qid"] else f"page:{row['project']}:{row['page_id']}"
                res.records.append(make_record(self.name, row["code"], "pageviews", key, row["views"],
                                               {"data_day": day.isoformat(), "project": row["project"],
                                                "page_id": row["page_id"], "title": row["title"]}, ts=ctx.now))
            done.add(day.isoformat())
        # L'état ne garde que la fenêtre utile ; il n'est enregistré qu'après l'écriture des relevés (cli).
        keep_from = (ctx.day - timedelta(days=WINDOW_DAYS + 5)).isoformat()
        ctx.state["wikimedia_done_days"] = sorted(d for d in done if d >= keep_from)
        if res.units_total == 0:
            res.unit(True)  # tout est à jour, ou rien n'est encore publié : ce n'est pas une panne
        return res
