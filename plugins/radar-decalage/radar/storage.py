"""Stockage en ajout seul, en texte, partitionné par source et par jour.

data/raw/<source>/<AAAA>/<AAAA-MM-JJ>/<horodatage>-<pid>.jsonl.gz   un fichier par exécution
data/runs/<AAAA-MM>.jsonl                                           journal d'exécution (santé)

Chaque exécution écrit son propre fichier, de façon atomique (fichier temporaire,
synchronisation sur disque, renommage) : un processus tué en cours d'écriture ne peut
pas corrompre les relevés déjà écrits. Les lecteurs signalent un fichier illisible au
lieu de planter. Un verrou empêche deux collectes simultanées (un seul écrivain).

Chaque enregistrement porte une enveloppe commune : ts, source, zone, kind, key, value, meta.
"""

from __future__ import annotations

import fcntl
import gzip
import io
import json
import os
import zlib
from contextlib import contextmanager
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Iterator

REQUIRED = ("ts", "source", "zone", "kind", "key", "value")
READ_ERRORS = (EOFError, gzip.BadGzipFile, zlib.error, json.JSONDecodeError, UnicodeDecodeError, OSError)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def make_record(source: str, zone: str, kind: str, key: str, value: Any, meta: dict | None = None,
                ts: datetime | None = None) -> dict[str, Any]:
    return {"ts": iso(ts or utc_now()), "source": source, "zone": zone, "kind": kind,
            "key": key, "value": value, "meta": meta or {}}


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    with tmp.open("wb") as fh:
        fh.write(data)
        fh.flush()
        os.fsync(fh.fileno())
    tmp.replace(path)


class RawStore:
    def __init__(self, root: Path):
        self.root = Path(root)
        self.warnings: list[str] = []

    def day_dir(self, source: str, day: date) -> Path:
        return self.root / "raw" / source / f"{day:%Y}" / day.isoformat()

    def append(self, source: str, records: Iterable[dict[str, Any]], day: date) -> int:
        records = list(records)
        if not records:
            return 0
        for rec in records:
            missing = [k for k in REQUIRED if k not in rec]
            if missing:
                raise ValueError(f"enregistrement incomplet ({', '.join(missing)}) : {rec}")
        buf = io.BytesIO()
        with gzip.GzipFile(fileobj=buf, mode="wb", mtime=0) as gz:
            for rec in records:
                gz.write((json.dumps(rec, ensure_ascii=False, sort_keys=True) + "\n").encode("utf-8"))
        stamp = utc_now().strftime("%Y%m%dT%H%M%S%fZ")
        atomic_write(self.day_dir(source, day) / f"{stamp}-{os.getpid()}.jsonl.gz", buf.getvalue())
        return len(records)

    def files(self, source: str, day: date) -> list[Path]:
        d = self.day_dir(source, day)
        return sorted(d.glob("*.jsonl.gz")) if d.exists() else []

    def read(self, source: str, day: date) -> Iterator[dict[str, Any]]:
        for path in self.files(source, day):
            yield from self._read_file(path)

    def _read_file(self, path: Path) -> Iterator[dict[str, Any]]:
        try:
            with gzip.open(path, "rt", encoding="utf-8") as fh:
                for line in fh:
                    line = line.strip()
                    if line:
                        yield json.loads(line)
        except READ_ERRORS as exc:
            self.warnings.append(f"fichier illisible ignoré à partir de l'erreur : {path} ({type(exc).__name__})")

    def days(self, source: str) -> list[date]:
        base = self.root / "raw" / source
        if not base.exists():
            return []
        out = []
        for p in sorted(base.glob("*/*")):
            if p.is_dir():
                try:
                    out.append(date.fromisoformat(p.name))
                except ValueError:
                    continue
        return out


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
            fh.flush()
            os.fsync(fh.fileno())

    def entries(self) -> Iterator[dict[str, Any]]:
        if not self.root.exists():
            return
        for p in sorted(self.root.glob("*.jsonl")):
            with p.open(encoding="utf-8") as fh:
                for line in fh:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        yield json.loads(line)
                    except json.JSONDecodeError:
                        continue  # ligne tronquée par une interruption : ignorée


class AlreadyRunning(RuntimeError):
    pass


@contextmanager
def run_lock(root: Path):
    """Un seul écrivain : verrou exclusif sur data/.lock pendant toute la collecte."""
    root = Path(root)
    root.mkdir(parents=True, exist_ok=True)
    fh = (root / ".lock").open("w")
    try:
        try:
            fcntl.flock(fh.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise AlreadyRunning("une collecte est déjà en cours sur cet espace de travail") from exc
        yield
    finally:
        fcntl.flock(fh.fileno(), fcntl.LOCK_UN)
        fh.close()


def load_json(path: Path, default: Any) -> tuple[Any, str | None]:
    """Lit un état JSON ; en cas de fichier abîmé, se replie sur la copie .bak. Renvoie (valeur, avertissement)."""
    for candidate in (path, path.with_name(path.name + ".bak")):
        if candidate.exists():
            try:
                return json.loads(candidate.read_text(encoding="utf-8")), (
                    None if candidate == path else f"{path.name} illisible : copie de secours utilisée")
            except (json.JSONDecodeError, UnicodeDecodeError, OSError):
                continue
    warning = f"{path.name} illisible et sans copie de secours valide : état réinitialisé" if path.exists() else None
    return default, warning


def save_json(path: Path, value: Any) -> None:
    """Écriture atomique, en gardant l'état précédent en .bak."""
    if path.exists():
        try:
            json.loads(path.read_text(encoding="utf-8"))
            atomic_write(path.with_name(path.name + ".bak"), path.read_bytes())
        except (json.JSONDecodeError, UnicodeDecodeError, OSError):
            pass  # ne pas écraser une bonne copie de secours par un fichier abîmé
    atomic_write(path, json.dumps(value, ensure_ascii=False, indent=1, sort_keys=True).encode("utf-8"))
