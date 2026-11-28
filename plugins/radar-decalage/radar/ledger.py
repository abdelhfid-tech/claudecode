"""Journal de prédictions : ajout seul, un seul écrivain, lignes chaînées par SHA-256.

Une prédiction est un événement binaire proche, avec une règle de résolution écrite
d'avance. La résolution est une nouvelle ligne, jamais une réécriture. L'empreinte de
tête se publie chaque semaine hors du dépôt (ancrage) : une chaîne gardée dans un
dépôt qu'on contrôle ne prouve aucune antériorité à elle seule.

Scores : Brier, Brier relatif au taux de base, score d'intervalle pour les délais.
Les avis de plusieurs agents nourris des mêmes données ne sont jamais extrémisés.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable, Iterator

GENESIS = "0" * 64
EVENT_TYPES = {"ios_available", "ios_rank_top", "android_rank_top", "wikimedia_arrival", "autocomplete_contains",
               "local_offer_count", "custom"}


def canonical(obj: dict[str, Any]) -> str:
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":"), default=str)


def chain_hash(prev: str, body: dict[str, Any]) -> str:
    return hashlib.sha256((prev + canonical(body)).encode("utf-8")).hexdigest()


class LedgerError(ValueError):
    pass


@dataclass
class Ledger:
    """`clock` donne l'heure courante (remplaçable dans les tests). `allow_backdate` n'est
    permis que pour un journal de backtest, jamais pour le journal de production."""
    path: Path
    clock: Any = None
    allow_backdate: bool = False

    def _now(self) -> datetime:
        return (self.clock or (lambda: datetime.now(timezone.utc)))()

    def _check_time(self, when: datetime | None, label: str) -> datetime:
        now = self._now()
        when = when or now
        if when.tzinfo is None:
            raise LedgerError(f"{label} doit porter un fuseau horaire")
        if not self.allow_backdate:
            if when > now + timedelta(minutes=5):
                raise LedgerError(f"{label} dans le futur")
            if when < now - timedelta(days=1):
                raise LedgerError(f"{label} antidaté : le journal de production n'accepte que l'heure courante")
        last = self.last_time()
        if last is not None and when < last:
            raise LedgerError(f"{label} antérieur à la dernière ligne du journal")
        return when

    def lines(self) -> Iterator[dict[str, Any]]:
        """Lignes lisibles ; une ligne illisible est rendue sous la forme {"type": "illisible"}."""
        if not self.path.exists():
            return
        with self.path.open(encoding="utf-8", errors="replace") as fh:
            for n, line in enumerate(fh, start=1):
                line = line.strip()
                if not line:
                    continue
                try:
                    yield json.loads(line)
                except json.JSONDecodeError:
                    yield {"type": "illisible", "line": n}

    def head(self) -> str:
        last = GENESIS
        for rec in self.lines():
            last = rec.get("hash", last)
        return last

    def last_time(self) -> datetime | None:
        last = None
        for rec in self.lines():
            stamp = rec.get("created") or rec.get("resolved")
            if stamp:
                last = datetime.fromisoformat(stamp)
        return last

    def _append(self, body: dict[str, Any]) -> dict[str, Any]:
        prev = self.head()
        rec = {**body, "prev": prev}
        rec["hash"] = chain_hash(prev, {k: v for k, v in rec.items() if k != "hash"})
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("a", encoding="utf-8") as fh:
            fh.write(canonical(rec) + "\n")
        return rec

    def predictions(self) -> dict[str, dict[str, Any]]:
        out = {}
        for rec in self.lines():
            if rec["type"] == "prediction":
                out[rec["id"]] = rec
        return out

    def resolutions(self) -> dict[str, dict[str, Any]]:
        out = {}
        for rec in self.lines():
            if rec["type"] == "resolution":
                out[rec["prediction_id"]] = rec
        return out

    def predict(self, *, entity: str, zone: str, question: str, event: dict[str, Any], horizon: date,
                probability: float, model_version: str, created: datetime | None = None,
                friction_class: str | None = None, justification: str = "",
                interval_days: dict[str, float] | None = None, inputs: dict[str, Any] | None = None) -> dict[str, Any]:
        created = self._check_time(created, "created")
        if not 0.0 <= probability <= 1.0:
            raise LedgerError("probabilité hors de [0 ; 1]")
        if event.get("type") not in EVENT_TYPES:
            raise LedgerError(f"type d'événement inconnu : {event.get('type')}")
        if "rule" not in event:
            raise LedgerError("règle de résolution manquante : elle doit être écrite avant la prédiction")
        if horizon <= created.date():
            raise LedgerError("l'horizon doit être postérieur à la date de la prédiction")
        if interval_days and not (interval_days["p10"] <= interval_days["p50"] <= interval_days["p90"]):
            raise LedgerError("intervalle incohérent (p10 ≤ p50 ≤ p90 attendu)")
        body = {"type": "prediction", "created": created.astimezone(timezone.utc).isoformat(),
                "entity": entity, "zone": zone, "question": question, "event": event,
                "horizon": horizon.isoformat(), "probability": round(probability, 4),
                "model_version": model_version, "friction_class": friction_class,
                "justification": justification, "interval_days": interval_days, "inputs": inputs or {}}
        body["id"] = hashlib.sha256(canonical(body).encode("utf-8")).hexdigest()[:16]
        if body["id"] in self.predictions():
            raise LedgerError("prédiction déjà enregistrée")
        return self._append(body)

    def resolve(self, prediction_id: str, *, outcome: int | None, evidence: dict[str, Any],
                resolved: datetime | None = None, observed_delay_days: float | None = None) -> dict[str, Any]:
        """outcome : 1 arrivé, 0 non arrivé à l'horizon, None annulée (données manquantes)."""
        resolved = self._check_time(resolved, "resolved")
        preds = self.predictions()
        if prediction_id not in preds:
            raise LedgerError(f"prédiction inconnue : {prediction_id}")
        pred = preds[prediction_id]
        if resolved < datetime.fromisoformat(pred["created"]):
            raise LedgerError("résolution antérieure à la prédiction")
        if outcome == 0 and resolved.date() < date.fromisoformat(pred["horizon"]):
            raise LedgerError("« non arrivé » ne se constate qu'à l'horizon, pas avant")
        if prediction_id in self.resolutions():
            raise LedgerError("prédiction déjà résolue")
        if outcome not in (0, 1, None):
            raise LedgerError("issue attendue : 0, 1 ou None (annulée)")
        return self._append({"type": "resolution", "prediction_id": prediction_id,
                             "resolved": resolved.astimezone(timezone.utc).isoformat(), "outcome": outcome,
                             "status": "annulee" if outcome is None else "resolue", "evidence": evidence,
                             "observed_delay_days": observed_delay_days})

    def verify(self, anchors_path: Path | None = None) -> list[str]:
        """Chaîne intacte, et conforme aux ancres publiées ? Renvoie la liste des ruptures."""
        problems, prev = [], GENESIS
        heads: list[str] = []
        for n, rec in enumerate(self.lines(), start=1):
            if rec.get("type") == "illisible":
                problems.append(f"ligne {n} : illisible")
                heads.append("")
                continue
            heads.append(rec.get("hash", ""))
            if rec.get("prev") != prev:
                problems.append(f"ligne {n} : maillon précédent inattendu")
            expected = chain_hash(rec.get("prev", ""), {k: v for k, v in rec.items() if k != "hash"})
            if rec.get("hash") != expected:
                problems.append(f"ligne {n} : empreinte invalide (ligne modifiée ?)")
            prev = rec.get("hash", "")
        if anchors_path is not None and Path(anchors_path).exists():
            for line in Path(anchors_path).read_text(encoding="utf-8").splitlines():
                if not line.strip():
                    continue
                anchor = json.loads(line)
                k = int(anchor["lines"])
                if k > len(heads):
                    problems.append(f"ancre du {anchor['at']} : le journal a été tronqué ({len(heads)} lignes au lieu d'au moins {k})")
                elif k and heads[k - 1] != anchor["head"]:
                    problems.append(f"ancre du {anchor['at']} : la ligne {k} ne correspond plus (journal réécrit)")
        return problems

    def anchor(self, anchors_path: Path, when: datetime) -> dict[str, Any]:
        """Note l'empreinte de tête, à publier hors du dépôt (horodatage externe)."""
        entry = {"at": when.astimezone(timezone.utc).isoformat(), "head": self.head(),
                 "lines": sum(1 for _ in self.lines())}
        anchors_path.parent.mkdir(parents=True, exist_ok=True)
        with anchors_path.open("a", encoding="utf-8") as fh:
            fh.write(canonical(entry) + "\n")
        return entry


# ---------------------------------------------------------------- scores

def brier(pairs: Iterable[tuple[float, int]]) -> float | None:
    pairs = list(pairs)
    if not pairs:
        return None
    return sum((p - o) ** 2 for p, o in pairs) / len(pairs)


def brier_skill(pairs: Iterable[tuple[float, int]]) -> float | None:
    """1 - BS / BS de référence (taux de base observé). > 0 : mieux que le taux de base."""
    pairs = list(pairs)
    if not pairs:
        return None
    base = sum(o for _, o in pairs) / len(pairs)
    ref = brier((base, o) for _, o in pairs)
    bs = brier(pairs)
    if not ref:
        return None
    return 1.0 - bs / ref


def interval_score(lower: float, upper: float, observed: float, alpha: float = 0.2) -> float:
    """Score d'intervalle de Gneiting et Raftery (plus bas = meilleur) pour un intervalle à (1 - alpha)."""
    score = upper - lower
    if observed < lower:
        score += (2 / alpha) * (lower - observed)
    elif observed > upper:
        score += (2 / alpha) * (observed - upper)
    return score


def scoreboard(ledger: Ledger, min_per_class: int = 50) -> dict[str, Any]:
    """Scores agrégés, et par classe seulement quand une classe a assez de prédictions résolues."""
    preds, res = ledger.predictions(), ledger.resolutions()
    resolved = [(preds[pid], r) for pid, r in res.items() if r["outcome"] is not None and pid in preds]
    pairs = [(p["probability"], r["outcome"]) for p, r in resolved]
    by_class: dict[str, list[tuple[float, int]]] = {}
    for p, r in resolved:
        by_class.setdefault(p.get("friction_class") or "?", []).append((p["probability"], r["outcome"]))
    intervals = []
    for p, r in resolved:
        iv = p.get("interval_days")
        if not iv:
            continue
        observed = r.get("observed_delay_days")
        if observed is None and r["outcome"] == 0:
            # Jamais arrivé à l'horizon : le délai est au moins celui de l'horizon (observation censurée).
            observed = (date.fromisoformat(p["horizon"]) - datetime.fromisoformat(p["created"]).date()).days
        if observed is not None:
            intervals.append(interval_score(iv["p10"], iv["p90"], observed))
    return {
        "predictions": len(preds), "resolved": len(resolved),
        "cancelled": sum(1 for r in res.values() if r["outcome"] is None),
        "open": len(preds) - len(res),
        "brier": brier(pairs), "brier_skill": brier_skill(pairs),
        "mean_interval_score": sum(intervals) / len(intervals) if intervals else None,
        "by_class": {k: {"n": len(v), "brier": brier(v)} for k, v in by_class.items() if len(v) >= min_per_class},
        "by_class_note": f"détail par classe affiché à partir de {min_per_class} prédictions résolues",
    }
