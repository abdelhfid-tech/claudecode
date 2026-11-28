"""Interface en ligne de commande : python -m radar <commande>.

  collect   relève les sources (toutes, ou --only, ou --cadence hourly/weekly)
  health    taux de succès par source sur les N derniers jours (pilote)
  sources   registre des sources et leur statut
  watchlist état de la liste de suivi
  villes    tendances et métiers locaux, ville par ville
  produits  produits recherchés au Maroc : installés à Casablanca, pas encore à Fès
  assortiment  familles d'un commerce de Fès : à mettre en avant, tester, vendre en ligne ou réduire
  incitations aides et freins : douane, fiscalité, aides, règles (Maroc, France)
  initiatives classement des modèles d'activité (--scenario solo, petit_ia, agence)
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
from .storage import AlreadyRunning, RawStore, RunLog, iso, load_json, run_lock, save_json
from .watchlist import Watchlist, load_terms


def _state_path() -> Path:
    return paths.data_dir() / "state.json"


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
        src = cfg.get("cadence", cls.cadence)
        if cadence == "hourly" and src != "hourly":
            continue
        if cadence == "weekly" and src != "weekly":
            continue
        if cadence == "daily" and src == "weekly":
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
    zone_filter = {z.strip() for z in args.zones.split(",")} if args.zones else None
    if zone_filter:
        zones.items = [z for z in zones.items if z["code"] in zone_filter]
    data_dir = paths.data_dir()
    try:
        with run_lock(data_dir):
            return _collect(args, sources_cfg, sources_raw, zones, zone_filter, only, data_dir)
    except AlreadyRunning as exc:
        print(f"collecte annulée : {exc}", file=sys.stderr)
        return 3


def _collect(args, sources_cfg, sources_raw, zones, zone_filter, only, data_dir) -> int:
    client = HttpClient(host_policies=sources_raw.get("host", {}), robots_cache_path=data_dir / "robots_cache.json")
    store = RawStore(data_dir)
    runlog = RunLog(data_dir)
    watch = Watchlist(paths.workspace() / "watchlist.json")
    state, warn = load_json(_state_path(), {})
    for w in (warn, watch.warning):
        if w:
            print(f"attention : {w}", file=sys.stderr)
    terms = load_terms()
    now = datetime.now(timezone.utc)
    work_dir = data_dir / "tmp"
    exit_code = 0
    for cls in select_sources(sources_cfg, only, args.cadence):
        collector = cls()
        cfg = sources_cfg.get(cls.name, {})
        snapshot = json.loads(json.dumps(state))
        ctx = Context(client=client, zones=zones, watchlist=watch, terms=terms, source_config=cfg,
                      now=now, state=state, zone_filter=zone_filter, work_dir=work_dir)
        before = {h: dict(v) for h, v in client.stats.items()}
        t0 = time.monotonic()
        try:
            result = collector.collect(ctx)
        except Exception as exc:  # une source en panne ne doit pas arrêter les autres
            state.clear()
            state.update(snapshot)  # l'état n'avance pas pour une source qui a planté
            print(f"[{cls.name}] erreur : {type(exc).__name__}: {exc}", file=sys.stderr)
            if not args.dry_run:
                runlog.append({"ts": iso(now), "source": cls.name, "units_total": 1, "units_ok": 0, "records": 0,
                               "errors": [f"{type(exc).__name__}: {exc}"],
                               "duration_s": round(time.monotonic() - t0, 1)})
            exit_code = 1
            continue
        added = 0
        if not args.dry_run:
            store.append(cls.name, result.records, now.date())
            if cls.name in ("apple_charts", "google_play"):
                added = watch.observe_ranks(result.records, now.date(), int(cfg.get("watch_max_rank", 100)))
                watch.save()
            save_json(_state_path(), state)  # après l'écriture des relevés, jamais avant
            runlog.append({"ts": iso(now), "source": cls.name, "units_total": result.units_total,
                           "units_ok": result.units_ok, "records": len(result.records),
                           "errors": result.errors[:10], "duration_s": round(time.monotonic() - t0, 1),
                           "http": http_delta(before, client.stats)})
        rate = f"{result.units_ok}/{result.units_total}"
        extra = f", {added} apps ajoutées au suivi" if added else ""
        print(f"[{cls.name}] unités réussies {rate}, {len(result.records)} enregistrements{extra}"
              f"{' (essai, rien écrit)' if args.dry_run else ''}")
        for err in result.errors[:3]:
            print(f"    - {err}")
    if not args.dry_run:
        client.save_robots_cache()
    for host, reason in sorted(client.blocked.items()):
        print(f"hôte coupé pendant l'exécution : {host} ({reason})", file=sys.stderr)
    for w in store.warnings:
        print(f"attention : {w}", file=sys.stderr)
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
    rows = analysis.gaps(RawStore(paths.data_dir()), max_origin_rank=args.max_rank, targets=targets,
                         include_established=args.established, independent_only=args.independants)
    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=1))
    else:
        print(analysis.render_gaps(rows, args.limit))
    return 0


def cmd_initiatives(args: argparse.Namespace) -> int:
    from . import initiatives

    profile = initiatives.load_profile()
    if args.scenarios:
        for name, sc in initiatives.load_scenarios().items():
            print(f"{name:16} {sc.get('label', '')}")
        return 0
    if args.scenario:
        profile = initiatives.apply_scenario(profile, args.scenario)
    trend = None
    if args.strength is not None:
        trend = initiatives.TrendInput(strength=args.strength, window_days=args.window,
                                       regulatory=[r for r in (args.regulatory or "").split(",") if r])
    ranked = initiatives.rank(args.buyer, args.seller, profile, trend)
    if args.json:
        print(json.dumps([e.__dict__ for e in ranked], ensure_ascii=False, indent=1, default=str))
        return 0
    if profile.is_default:
        print("Profil par défaut : remplissez workspace/profile.toml (modèle : config/profile.example.toml).\n")
    print(f"Acheteur {args.buyer}, vendeur {args.seller}" + (f", tendance F={args.strength}" if trend else "")
          + (f", scénario {args.scenario}" if args.scenario else ""))
    print("Chance : décoller en 12 mois. Si ça marche : marge par mois au bout d'un an. Moyenne : 24 mois, échecs compris.")
    print(f"{'archétype':32} {'P10':>5} {'chance':>7} {'si ça marche':>13} {'moyenne 24 m':>13} {'heures':>7}  remarques")
    for e in ranked:
        if e.excluded:
            continue
        note = "; ".join(e.flags + e.reasons)[:80]
        print(f"{e.archetype:32} {e.score_p10:>5} {e.chance_12m:>7.0%} {e.net_month_success:>10,.0f} €/m "
              f"{e.e24_eur_p50:>11,.0f} € {e.hours_24_months:>6,.0f}  {note}".replace(",", " "))
    excluded = [e for e in ranked if e.excluded]
    if excluded:
        print(f"\nÉcartés ({len(excluded)}) :")
        for e in excluded:
            print(f"  {e.archetype:24} {'; '.join(e.reasons)[:110]}")
    return 0


def cmd_villes(args: argparse.Namespace) -> int:
    from . import villes

    rows = villes.table(RawStore(paths.data_dir()))
    if args.decalage:
        leader, follower = args.decalage.split(":", 1)
        out = villes.lags(rows, leader, follower)
        if args.json:
            print(json.dumps(out, ensure_ascii=False, indent=1))
        else:
            for r in out:
                print(f"{r['sujet']:28} installé à {r['avance']}, {r['statut_retard']} à {r['retard']}  ({r['precisions_avance'][:70]})")
            if not out:
                print("Aucun décalage net entre ces deux villes au dernier relevé.")
        return 0
    print(json.dumps(rows, ensure_ascii=False, indent=1) if args.json else villes.render(rows))
    return 0


def cmd_assortiment(args: argparse.Namespace) -> int:
    from . import assortiment

    store = RawStore(paths.data_dir())
    rows = assortiment.table(store)
    fams = assortiment.families(rows)
    eco = assortiment.ecosystem(store)
    if args.famille:
        rows = [r for r in rows if r["famille"] == args.famille]
    if args.json:
        print(json.dumps({"concepts": rows, "familles": fams, "ecosysteme": eco}, ensure_ascii=False, indent=1))
        return 0
    if args.ecosysteme:
        for e in eco:
            print(f"{e['role'][:28]:28} {e['terme'][:22]:22} {e['statut']:>18}  {e['precisions'][:100]}")
        if not eco:
            print("Aucun relevé de l'écosystème : lancez « collect --only autocomplete_assortiment --cadence weekly ».")
        return 0
    print(assortiment.render(rows, fams, eco))
    return 0


def cmd_produits(args: argparse.Namespace) -> int:
    from . import produits

    rows = produits.table(RawStore(paths.data_dir()))
    if args.fes:
        rows = [r for r in rows if r["verdict"] == "Installé à Casablanca, pas encore à Fès"]
    print(json.dumps(rows, ensure_ascii=False, indent=1) if args.json else produits.render(rows))
    return 0


def cmd_incitations(args: argparse.Namespace) -> int:
    from . import incitations

    items = incitations.load()
    if args.archetype:
        chosen = incitations.for_initiative(items, args.archetype, args.buyer, args.seller)
    else:
        pays = [p.strip() for p in args.pays.split(",")] if args.pays else None
        usages = [u.strip() for u in args.pour.split(",")] if args.pour else None
        chosen = incitations.select(items, pays=pays, usages=usages, sens=args.sens)
    print(json.dumps(chosen, ensure_ascii=False, indent=1, default=str) if args.json else incitations.render(chosen))
    return 0


def cmd_ledger(args: argparse.Namespace) -> int:
    from .ledger import Ledger, scoreboard

    folder = paths.workspace() / "ledger"
    led = Ledger(folder / "predictions.jsonl")
    anchors = folder / "anchors.jsonl"
    if args.anchor:
        entry = led.anchor(anchors, datetime.now(timezone.utc))
        print(f"empreinte de tête à publier hors du dépôt : {entry['head']} ({entry['lines']} lignes, {entry['at']})")
        return 0
    problems = led.verify(anchors)
    board = scoreboard(led)
    print(json.dumps({"chain_ok": not problems, "problems": problems, **board}, ensure_ascii=False, indent=1))
    return 1 if problems else 0


def cmd_rules(args: argparse.Namespace) -> int:
    from . import rules

    from . import incitations

    today = datetime.now(timezone.utc).date()
    problems = rules.check(rules.load_rules(), today) + incitations.check(incitations.load(), today)
    if not problems:
        print("Règles valides et à jour.")
        return 0
    for p in problems:
        print(f"- {p}")
    return 1


def cmd_reactive(args: argparse.Namespace) -> int:
    import os

    from . import reactive

    if args.post_if_set:
        args.post = bool(os.environ.get("RADAR_N8N_WEBHOOK", "").strip())
    url = args.url or (os.environ.get("RADAR_N8N_WEBHOOK", "").strip() if args.post else "")
    if args.post and not url:
        print("aucune adresse de webhook : définissez RADAR_N8N_WEBHOOK ou passez --url", file=sys.stderr)
        return 2
    out = reactive.run(datetime.now(timezone.utc), post_url=url or None,
                       token=os.environ.get("RADAR_N8N_TOKEN", "").strip() or None, dry_run=args.dry_run)
    if args.json:
        print(json.dumps(out, ensure_ascii=False, indent=1))
        return 0
    print(f"{len(out['candidates'])} candidats pour le contenu réactif")
    for c in out["candidates"]:
        print(f"  [{c['kind']}] {c['title'][:60]}  FR : {c['presence'].get('FR')}  MA : {c['presence'].get('MA')}")
    if out["post_status"] is not None:
        ok = 200 <= out["post_status"] < 300
        print(f"envoi au flux n8n : HTTP {out['post_status']}{'' if ok else ' (échec)'}")
        return 0 if ok else 1
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="radar", description="Radar d'arbitrage de tendances (radar-decalage)")
    p.add_argument("--version", action="version", version=__version__)
    sub = p.add_subparsers(dest="command", required=True)
    c = sub.add_parser("collect", help="relever les sources")
    c.add_argument("--only", help="sources à relever, séparées par des virgules")
    c.add_argument("--cadence", choices=["hourly", "daily", "weekly"], default="daily")
    c.add_argument("--zones", help="restreindre toutes les sources aux zones données (codes séparés par des virgules)")
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
    g.add_argument("--established", action="store_true", help="ajouter les absences structurelles (apps de plus de 3 ans)")
    g.add_argument("--independants", action="store_true", help="seulement les apps de petits éditeurs (copiables)")
    g.add_argument("--json", action="store_true")
    g.set_defaults(func=cmd_gaps)
    i = sub.add_parser("initiatives", help="classer les archétypes pour une cellule acheteur × vendeur")
    i.add_argument("--buyer", default="FR")
    i.add_argument("--seller", default="FR")
    i.add_argument("--strength", type=float, help="force de la tendance (0-100)")
    i.add_argument("--window", type=float, help="fenêtre restante en jours")
    i.add_argument("--regulatory", help="catégories réglementées touchées (identifiants de regulatory.toml)")
    i.add_argument("--scenario", help="scénario de profil (voir --scenarios) : solo, petit_ia, petit_ia_fort, agence")
    i.add_argument("--scenarios", action="store_true", help="lister les scénarios")
    i.add_argument("--json", action="store_true")
    i.set_defaults(func=cmd_initiatives)
    lg = sub.add_parser("ledger", help="vérifier le journal de prédictions (chaîne et ancres) et afficher les scores")
    lg.add_argument("--anchor", action="store_true", help="noter l'empreinte de tête, à publier hors du dépôt")
    lg.set_defaults(func=cmd_ledger)
    sub.add_parser("rules", help="contrôler les règles par pays (validité, péremption)").set_defaults(func=cmd_rules)
    v = sub.add_parser("villes", help="tendances et métiers locaux, ville par ville (relevé hebdomadaire)")
    v.add_argument("--decalage", help="ville_en_avance:ville_en_retard, par exemple casablanca:fes")
    v.add_argument("--json", action="store_true")
    v.set_defaults(func=cmd_villes)
    pr = sub.add_parser("produits", help="produits recherchés au Maroc, installés à Casablanca, pas encore à Fès")
    pr.add_argument("--fes", action="store_true", help="seulement les produits installés à Casablanca et pas encore à Fès")
    pr.add_argument("--json", action="store_true")
    pr.set_defaults(func=cmd_produits)
    asr = sub.add_parser("assortiment", help="familles d'un commerce de Fès : en avant, à tester, en ligne ou à réduire")
    asr.add_argument("--famille", help="identifiant de famille (enfants, cuisine, soin…)")
    asr.add_argument("--ecosysteme", action="store_true", help="seulement l'écosystème local (clients, fournisseurs, relais)")
    asr.add_argument("--json", action="store_true")
    asr.set_defaults(func=cmd_assortiment)
    inc = sub.add_parser("incitations", help="aides et freins (douane, fiscalité, aides, règles) au Maroc et en France")
    inc.add_argument("--pays", help="MA, FR (FR inclut les règles européennes)")
    inc.add_argument("--pour", help="produit_importe, colis_ecommerce, service_numerique, concept_franchise, export_depuis_maroc, artisanat")
    inc.add_argument("--sens", choices=["facilite", "freine"])
    inc.add_argument("--archetype", help="dispositifs utiles pour un modèle d'activité (avec --buyer et --seller)")
    inc.add_argument("--buyer", default="MA")
    inc.add_argument("--seller", default="MA")
    inc.add_argument("--json", action="store_true")
    inc.set_defaults(func=cmd_incitations)
    rc = sub.add_parser("reactive", help="candidats du jour pour le contenu réactif (et envoi au flux n8n)")
    rc.add_argument("--post", action="store_true", help="envoyer au webhook n8n (RADAR_N8N_WEBHOOK, RADAR_N8N_TOKEN)")
    rc.add_argument("--post-if-set", action="store_true",
                    help="envoyer seulement si RADAR_N8N_WEBHOOK est réglé (pour la tâche planifiée)")
    rc.add_argument("--url", help="adresse du webhook, à la place de RADAR_N8N_WEBHOOK")
    rc.add_argument("--json", action="store_true")
    rc.add_argument("--dry-run", action="store_true", help="calculer sans rien écrire ni envoyer")
    rc.set_defaults(func=cmd_reactive)
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)
