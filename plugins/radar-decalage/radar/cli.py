"""Interface en ligne de commande : python -m radar <commande>.

  collect   relève les sources (toutes, ou --only, ou --cadence hourly)
  health    taux de succès par source sur les N derniers jours (pilote)
  sources   registre des sources et leur statut
  watchlist état de la liste de suivi
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from . import __version__, health, paths, settings
from .collectors import BY_NAME, REGISTRY
from .collectors.base import Context
from .net import HttpClient
from .storage import RawStore, RunLog, iso
from .watchlist import Watchlist, load_terms


def _state_path() -> Path:
    return paths.data_dir() / "state.json"


def _load_state() -> dict[str, Any]:
    p = _state_path()
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def _save_state(state: dict[str, Any]) -> None:
    p = _state_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=1, sort_keys=True), encoding="utf-8")
    tmp.replace(p)


def http_delta(before: dict[str, dict[str, int]], after: dict[str, dict[str, int]]) -> dict[str, dict[str, int]]:
    """Statuts HTTP comptés pendant l'exécution d'une source, par hôte."""
    out: dict[str, dict[str, int]] = {}
    for host, counts in after.items():
        diff = {st: n - before.get(host, {}).get(st, 0) for st, n in counts.items()}
        diff = {st: n for st, n in diff.items() if n > 0}
        if diff:
            out[host] = diff
    return out


def select_sources(sources_cfg: dict[str, Any], only: list[str] | None, cadence: str | None) -> list[type]:
    chosen = []
    for cls in REGISTRY:
        cfg = sources_cfg.get(cls.name, {})
        if only:
            if cls.name in only:
                chosen.append(cls)
            continue
        if not cfg.get("enabled", True):
            continue
        if cadence == "hourly" and cfg.get("cadence", cls.cadence) != "hourly":
            continue
        chosen.append(cls)
    return chosen


def cmd_collect(args: argparse.Namespace) -> int:
    sources_raw = settings.load("sources")
    sources_cfg = sources_raw.get("source", {})
    only = [s.strip() for s in args.only.split(",")] if args.only else None
    if only:
        unknown = [s for s in only if s not in BY_NAME]
        if unknown:
            print(f"sources inconnues : {', '.join(unknown)}", file=sys.stderr)
            return 2
    zones = settings.zones()
    if args.zones:
        keep = {z.strip() for z in args.zones.split(",")}
        zones.items = [z for z in zones.items if z["code"] in keep]
    client = HttpClient(host_policies=sources_raw.get("host", {}))
    store = RawStore(paths.data_dir())
    runlog = RunLog(paths.data_dir())
    watch = Watchlist(paths.workspace() / "watchlist.json")
    terms = load_terms()
    state = _load_state()
    now = datetime.now(timezone.utc)
    exit_code = 0
    for cls in select_sources(sources_cfg, only, args.cadence):
        collector = cls()
        cfg = sources_cfg.get(cls.name, {})
        ctx = Context(client=client, zones=zones, watchlist=watch, terms=terms, source_config=cfg,
                      now=now, state=state)
        before = {h: dict(v) for h, v in client.stats.items()}
        t0 = time.monotonic()
        try:
            result = collector.collect(ctx)
        except Exception as exc:  # une source en panne ne doit pas arrêter les autres
            print(f"[{cls.name}] erreur : {type(exc).__name__}: {exc}", file=sys.stderr)
            runlog.append({"ts": iso(now), "source": cls.name, "units_total": 1, "units_ok": 0, "records": 0,
                           "errors": [f"{type(exc).__name__}: {exc}"], "duration_s": round(time.monotonic() - t0, 1)})
            exit_code = 1
            continue
        written = 0 if args.dry_run else store.append(cls.name, result.records, now.date())
        added = 0
        if cls.name in ("apple_charts", "google_play"):
            added = watch.observe_ranks(result.records, now.date(), int(cfg.get("watch_max_rank", 100)))
        http = http_delta(before, client.stats)
        entry = {"ts": iso(now), "source": cls.name, "units_total": result.units_total, "units_ok": result.units_ok,
                 "records": len(result.records), "errors": result.errors[:10],
                 "duration_s": round(time.monotonic() - t0, 1), "http": http}
        if not args.dry_run:
            runlog.append(entry)
        rate = f"{result.units_ok}/{result.units_total}"
        extra = f", {added} apps ajoutées au suivi" if added else ""
        print(f"[{cls.name}] unités réussies {rate}, {len(result.records)} enregistrements{extra}"
              f"{' (essai, rien écrit)' if args.dry_run else ''}")
        for err in result.errors[:3]:
            print(f"    - {err}")
    if not args.dry_run:
        watch.save()
        _save_state(state)
    return exit_code


def cmd_health(args: argparse.Namespace) -> int:
    rows = health.report(list(RunLog(paths.data_dir()).entries()), datetime.now(timezone.utc).date(), args.days)
    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=1))
        return 0
    if not rows:
        print("Aucune exécution enregistrée.")
        return 0
    print(f"{'source':20} {'jours':>5} {'bons':>5} {'taux jours':>10} {'taux unités':>11}  verdict")
    for r in rows:
        print(f"{r['source']:20} {r['days_observed']:>5} {r['days_good']:>5} {r['day_rate']:>10.0%} "
              f"{r['unit_rate']:>11.0%}  {r['verdict']}")
        if r["last_error"]:
            print(f"{'':20} dernière erreur : {r['last_error'][:110]}")
    return 0


def cmd_sources(args: argparse.Namespace) -> int:
    cfg = settings.load("sources").get("source", {})
    for cls in REGISTRY:
        c = cfg.get(cls.name, {})
        print(f"{cls.name:20} famille={c.get('family', cls.family):10} cadence={c.get('cadence', cls.cadence):7} "
              f"active={'oui' if c.get('enabled', True) else 'non':3} publiable={'oui' if c.get('publishable') else 'non':3} "
              f"cgu={c.get('tos', '?')}")
    return 0


def cmd_watchlist(args: argparse.Namespace) -> int:
    w = Watchlist(paths.workspace() / "watchlist.json")
    for platform, apps in w.data["apps"].items():
        print(f"{platform}: {len(apps)} apps suivies")
    print(f"termes : {len(load_terms())}")
    return 0


def cmd_gaps(args: argparse.Namespace) -> int:
    from . import analysis

    targets = tuple(t.strip() for t in args.targets.split(","))
    rows = analysis.gaps(RawStore(paths.data_dir()), max_origin_rank=args.max_rank, targets=targets)
    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=1))
    else:
        print(analysis.render_gaps(rows, args.limit))
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="radar", description="Radar d'arbitrage de tendances (radar-decalage)")
    p.add_argument("--version", action="version", version=__version__)
    sub = p.add_subparsers(dest="command", required=True)
    c = sub.add_parser("collect", help="relever les sources")
    c.add_argument("--only", help="sources à relever, séparées par des virgules")
    c.add_argument("--cadence", choices=["hourly", "daily"], default="daily")
    c.add_argument("--zones", help="restreindre aux zones données (codes séparés par des virgules)")
    c.add_argument("--dry-run", action="store_true", help="interroger sans rien écrire")
    c.set_defaults(func=cmd_collect)
    h = sub.add_parser("health", help="santé des sources")
    h.add_argument("--days", type=int, default=14)
    h.add_argument("--json", action="store_true")
    h.set_defaults(func=cmd_health)
    sub.add_parser("sources", help="registre des sources").set_defaults(func=cmd_sources)
    sub.add_parser("watchlist", help="liste de suivi").set_defaults(func=cmd_watchlist)
    g = sub.add_parser("gaps", help="apps fortes à l'origine, indisponibles dans les pays cibles")
    g.add_argument("--targets", default="FR,MA")
    g.add_argument("--max-rank", type=int, default=50)
    g.add_argument("--limit", type=int, default=30)
    g.add_argument("--json", action="store_true")
    g.set_defaults(func=cmd_gaps)
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)
