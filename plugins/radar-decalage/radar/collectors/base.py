from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any

from ..net import HttpClient
from ..settings import Zones
from ..watchlist import Watchlist


@dataclass
class Context:
    client: HttpClient
    zones: Zones
    watchlist: Watchlist
    terms: list[dict[str, Any]]
    source_config: dict[str, Any]
    now: datetime
    state: dict[str, Any] = field(default_factory=dict)
    zone_filter: set[str] | None = None   # --zones : restreint toutes les sources, pas seulement les vitrines
    work_dir: Any = None                  # répertoire de travail temporaire (téléchargements)

    @property
    def day(self) -> date:
        return self.now.date()

    def zone_ok(self, code: str) -> bool:
        if not self.zone_filter:
            return True
        return code in self.zone_filter or code.split("-")[0] in self.zone_filter


@dataclass
class Result:
    records: list[dict[str, Any]] = field(default_factory=list)
    units_total: int = 0
    units_ok: int = 0
    errors: list[str] = field(default_factory=list)

    def unit(self, ok: bool, error: str | None = None) -> None:
        self.units_total += 1
        if ok:
            self.units_ok += 1
        elif error:
            self.errors.append(error)


class Collector:
    name = "base"
    family = "base"
    cadence = "daily"

    def collect(self, ctx: Context) -> Result:  # pragma: no cover - interface
        raise NotImplementedError
