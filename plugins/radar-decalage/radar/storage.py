"""Stockage en ajout seul, en texte, partitionné par source et par jour.

data/raw/<source>/<AAAA>/<AAAA-MM-JJ>.jsonl.gz   instantanés (un seul écrivain : le collecteur)
data/runs/<AAAA-MM>.jsonl                         journal d'exécution, base du contrôle de santé

Chaque enregistrement porte une enveloppe commune :
  ts, source, zone, kind, key, value, meta
"""

from __future__ import annotations

import gzip
import json
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Iterator

REQUIRED = ("ts", "source", "zone", "kind", "key", "value")


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def make_record(source: str, zone: str, kind: str, key: str, value: Any, meta: dict | None = None,
                ts: datetime | None = None) -> dict[str, Any]:
    return {"ts": iso(ts or utc_now()), "source": source, "zone": zone, "kind": kind,
            "key": key, "value": value, "meta": meta or {}}


class RawStore:
    def __init__(self, root: Path):
        self.root = Path(root)

    def path(self, source: str, day: date) -> Path:
        return self.root / "raw" / source / f"{day:%Y}" / f"{day.isoformat()}.jsonl.gz"

    def append(self, source: str, records: Iterable[dict[str, Any]], day: date) -> int:
        records = list(records)
        if not records:
            return 0
        for rec in records:
            missing = [k for k in REQUIRED if k not in rec]
            if missing:
                raise ValueError(f"enregistrement incomplet ({', '.join(missing)}) : {rec}")
        path = self.path(source, day)
        path.parent.mkdir(parents=True, exist_ok=True)
        # Le mode ajout de gzip crée un nouveau membre : le fichier reste lisible d'un bloc.
        with gzip.open(path, "at", encoding="utf-8") as fh:
            for rec in records:
                fh.write(json.dumps(rec, ensure_ascii=False, sort_keys=True) + "\n")
        return len(records)

    def read(self, source: str, day: date) -> Iterator[dict[str, Any]]:
        path = self.path(source, day)
        if not path.exists():
            return iter(())
        return _read_gz(path)

    def days(self, source: str) -> list[date]:
        base = self.root / "raw" / source
        if not base.exists():
            return []
        out = []
        for p in sorted(base.glob("*/*.jsonl.gz")):
            try:
                out.append(date.fromisoformat(p.name.split(".")[0]))
            except ValueError:
                continue
        return out


def _read_gz(path: Path) -> Iterator[dict[str, Any]]:
    with gzip.open(path, "rt", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                yield json.loads(line)


class RunLog:
    """Une ligne par exécution d'une source : unités tentées et réussies, statuts HTTP."""

    def __init__(self, root: Path):
        self.root = Path(root) / "runs"

    def append(self, entry: dict[str, Any]) -> None:
        self.root.mkdir(parents=True, exist_ok=True)
        ts = entry.get("ts") or iso(utc_now())
        entry = {**entry, "ts": ts}
        path = self.root / f"{ts[:7]}.jsonl"
        with path.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(entry, ensure_ascii=False, sort_keys=True) + "\n")

    def entries(self) -> Iterator[dict[str, Any]]:
        if not self.root.exists():
            return
        for p in sorted(self.root.glob("*.jsonl")):
            with p.open(encoding="utf-8") as fh:
                for line in fh:
                    line = line.strip()
                    if line:
                        yield json.loads(line)
