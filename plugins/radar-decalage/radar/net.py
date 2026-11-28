"""Client HTTP prudent : robots.txt, débit limité par hôte, reprises bornées, disjoncteur.

Règles de collecte du plan :
- robots.txt est lu pour chaque hôte et respecté (RFC 9309 : groupe de l'agent ou « * »,
  jokers « * » et « $ », règle la plus longue gagnante, « Allow » à égalité ; fichier absent
  en 4xx = tout autorisé). Hôte injoignable ou 5xx : la dernière copie obtenue fait foi
  (RFC 9309, section 2.4) ; sans copie connue, tout est interdit et une nouvelle lecture
  est tentée une minute plus tard ;
- un 403, ou un 429 qui persiste après les reprises, coupe l'hôte pour le reste de
  l'exécution (disjoncteur) : on ne contourne jamais un refus ;
- seuls 429, 5xx et les erreurs réseau déclenchent une reprise ; Retry-After est
  respecté (secondes ou date HTTP, en-tête sans tenir compte de la casse) et, s'il
  dépasse le plafond, on abandonne au lieu de revenir trop tôt.
"""

from __future__ import annotations

import http.client
import json
import os
import re
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any, Callable
from urllib.parse import urlparse

from . import __version__

RETRYABLE = {429, 500, 502, 503, 504}
NETWORK_ERRORS = (urllib.error.URLError, TimeoutError, ConnectionError, OSError, http.client.HTTPException)
AGENT_TOKEN = "radar-decalage"
ROBOTS_RETRY_S = 60.0

DEFAULT_POLICY = {"min_interval": 1.0, "max_retries": 2, "backoff": 2.0, "max_retry_after": 60.0, "timeout": 30.0}


def default_user_agent() -> str:
    """Identifiant générique ; un contact n'est ajouté que si RADAR_CONTACT est défini."""
    contact = os.environ.get("RADAR_CONTACT", "").strip()
    base = f"{AGENT_TOKEN}/{__version__}"
    return f"{base} ({contact})" if contact else f"{base} (trend research tool)"


@dataclass
class Response:
    url: str
    status: int | None
    body: bytes = b""
    headers: dict[str, str] = field(default_factory=dict)
    elapsed: float = 0.0
    attempts: int = 1
    error: str | None = None
    path: Path | None = None   # corps écrit sur disque (téléchargement en flux)

    @property
    def ok(self) -> bool:
        return self.status is not None and 200 <= self.status < 300

    def text(self) -> str:
        return self.body.decode("utf-8", "replace")

    def json(self) -> Any:
        return json.loads(self.body)


# ------------------------------------------------------------------ robots.txt

class Robots:
    """Règles robots.txt d'un hôte, pour notre agent (RFC 9309)."""

    def __init__(self, rules: list[tuple[bool, str]] | None = None, allow_all: bool = False, deny_all: bool = False):
        self.rules = rules or []
        self.allow_all = allow_all
        self.deny_all = deny_all

    @classmethod
    def parse(cls, text: str, agent: str = AGENT_TOKEN) -> "Robots":
        groups: list[tuple[list[str], list[tuple[bool, str]]]] = []
        agents: list[str] = []
        rules: list[tuple[bool, str]] = []
        last_was_agent = False
        for raw in text.splitlines():
            line = raw.split("#", 1)[0].strip()
            if ":" not in line:
                continue
            key, value = (p.strip() for p in line.split(":", 1))
            key = key.lower()
            if key == "user-agent":
                if not last_was_agent and (agents or rules):
                    groups.append((agents, rules))
                    agents, rules = [], []
                agents.append(value.lower())
                last_was_agent = True
            elif key in ("allow", "disallow"):
                last_was_agent = False
                if value:
                    rules.append((key == "allow", value))
            else:
                last_was_agent = False
        if agents or rules:
            groups.append((agents, rules))
        token = agent.lower()
        mine = [r for a, r in groups if any(x != "*" and x in token for x in a)]
        star = [r for a, r in groups if "*" in a]
        chosen = mine or star
        return cls([rule for g in chosen for rule in g]) if chosen else cls(allow_all=True)

    def allowed(self, url: str) -> bool:
        if self.deny_all:
            return False
        if self.allow_all or not self.rules:
            return True
        u = urlparse(url)
        target = (u.path or "/") + (f"?{u.query}" if u.query else "")
        best_len, best_allow = -1, True
        for allow, pattern in self.rules:
            if _match(pattern, target):
                plen = len(pattern)
                if plen > best_len or (plen == best_len and allow):
                    best_len, best_allow = plen, allow
        return best_allow


def _match(pattern: str, target: str) -> bool:
    anchored = pattern.endswith("$")
    body = pattern[:-1] if anchored else pattern
    regex = "".join(".*" if ch == "*" else re.escape(ch) for ch in body)
    return re.match(regex + ("$" if anchored else ""), target) is not None


# ------------------------------------------------------------------ client

class HttpClient:
    def __init__(
        self,
        host_policies: dict[str, dict[str, Any]] | None = None,
        user_agent: str | None = None,
        opener: Callable[..., Any] | None = None,
        sleep: Callable[[float], None] = time.sleep,
        clock: Callable[[], float] = time.monotonic,
        respect_robots: bool = True,
        robots_cache_path: Path | None = None,
    ):
        self.host_policies = host_policies or {}
        self.user_agent = user_agent or default_user_agent()
        self._open = opener or urllib.request.urlopen
        self._sleep = sleep
        self._clock = clock
        self._last: dict[str, float] = {}
        self.respect_robots = respect_robots
        self.robots: dict[str, Robots] = {}
        self._robots_retry_at: dict[str, float] = {}
        self.robots_cache_path = Path(robots_cache_path) if robots_cache_path else None
        self.robots_cache: dict[str, dict[str, str]] = {}
        if self.robots_cache_path and self.robots_cache_path.exists():
            try:
                self.robots_cache = json.loads(self.robots_cache_path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                self.robots_cache = {}
        self.blocked: dict[str, str] = {}
        self.stats: dict[str, dict[str, int]] = {}

    def policy(self, host: str) -> dict[str, Any]:
        merged = dict(DEFAULT_POLICY)
        merged.update(self.host_policies.get(host, {}))
        return merged

    def _wait_turn(self, host: str, min_interval: float) -> None:
        last = self._last.get(host)
        if last is not None:
            wait = min_interval - (self._clock() - last)
            if wait > 0:
                self._sleep(wait)
        self._last[host] = self._clock()

    def _count(self, host: str, status: int | str) -> None:
        bucket = self.stats.setdefault(host, {})
        key = str(status)
        bucket[key] = bucket.get(key, 0) + 1

    def robots_for(self, url: str) -> Robots:
        u = urlparse(url)
        host = u.hostname or ""
        known = self.robots.get(host)
        if known is not None and not (known.deny_all and self._clock() >= self._robots_retry_at.get(host, 0)):
            return known
        r = self._fetch(f"{u.scheme}://{host}/robots.txt", check=False)
        if r.ok:
            text = r.text()
            self.robots[host] = Robots.parse(text)
            self.robots_cache[host] = {"text": text, "fetched": datetime.now(timezone.utc).isoformat()}
        elif r.status is not None and 400 <= r.status < 500 and r.status != 429:
            self.robots[host] = Robots(allow_all=True)        # pas de robots.txt : tout est permis
            self.robots_cache[host] = {"text": "", "fetched": datetime.now(timezone.utc).isoformat()}
        elif host in self.robots_cache:
            self.robots[host] = Robots.parse(self.robots_cache[host]["text"])  # injoignable : dernière copie
        else:
            self.robots[host] = Robots(deny_all=True)         # injoignable, sans copie : on s'abstient
            self._robots_retry_at[host] = self._clock() + ROBOTS_RETRY_S
        return self.robots[host]

    def save_robots_cache(self) -> None:
        if self.robots_cache_path is None:
            return
        self.robots_cache_path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.robots_cache_path.with_name(self.robots_cache_path.name + ".tmp")
        tmp.write_text(json.dumps(self.robots_cache, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
        tmp.replace(self.robots_cache_path)

    def request(self, url: str, data: bytes | None = None, headers: dict[str, str] | None = None,
                method: str | None = None) -> Response:
        return self._fetch(url, data, headers, method, check=True)

    def download(self, url: str, dest: Path, headers: dict[str, str] | None = None) -> Response:
        """Écrit le corps sur disque par morceaux (gros fichiers) ; le corps n'est pas gardé en mémoire."""
        return self._fetch(url, None, headers, None, check=True, dest=dest)

    def _fetch(self, url: str, data: bytes | None = None, headers: dict[str, str] | None = None,
               method: str | None = None, check: bool = True, dest: Path | None = None) -> Response:
        host = urlparse(url).hostname or ""
        if check:
            if host in self.blocked:
                self._count(host, "bloqué")
                return Response(url, None, error=f"hôte coupé pour cette exécution : {self.blocked[host]}", attempts=0)
            if self.respect_robots and not self.robots_for(url).allowed(url):
                self._count(host, "robots")
                return Response(url, None, error="interdit par robots.txt", attempts=0)
        pol = self.policy(host)
        hdrs = {"User-Agent": pol.get("user_agent") or self.user_agent, "Accept-Encoding": "identity"}
        hdrs.update(headers or {})
        start = self._clock()
        last: Response | None = None
        attempts = 0
        max_retries = int(pol["max_retries"])
        for attempt in range(max_retries + 1):
            attempts = attempt + 1
            self._wait_turn(host, float(pol["min_interval"]))
            req = urllib.request.Request(url, data=data, headers=hdrs, method=method or ("POST" if data else "GET"))
            retry_after: float | None = None
            try:
                with self._open(req, timeout=float(pol["timeout"])) as resp:
                    status = getattr(resp, "status", 200)
                    resp_headers = _headers(getattr(resp, "headers", None))
                    if dest is not None:
                        dest.parent.mkdir(parents=True, exist_ok=True)
                        tmp = dest.with_name(dest.name + ".part")
                        with tmp.open("wb") as fh:
                            while True:
                                chunk = resp.read(1 << 20)
                                if not chunk:
                                    break
                                fh.write(chunk)
                        tmp.replace(dest)
                        body = b""
                    else:
                        body = resp.read()
                    self._count(host, status)
                    return Response(url, status, body, resp_headers, self._clock() - start, attempts, path=dest)
            except urllib.error.HTTPError as exc:
                try:
                    body = exc.read()
                except NETWORK_ERRORS:
                    body = b""
                headers_out = _headers(exc.headers)
                self._count(host, exc.code)
                last = Response(url, exc.code, body, headers_out, self._clock() - start, attempts, f"HTTP {exc.code}")
                if exc.code == 403 and check:
                    self.blocked[host] = "refus 403"
                if exc.code not in RETRYABLE:
                    return last
                retry_after = _parse_retry_after(_header(headers_out, "retry-after"))
                if retry_after is not None and retry_after > float(pol["max_retry_after"]):
                    if exc.code == 429 and check:
                        self.blocked[host] = f"429, nouvelle tentative demandée dans {retry_after:.0f} s"
                    return last  # attente demandée trop longue : on abandonne au lieu de revenir trop tôt
            except NETWORK_ERRORS as exc:
                self._count(host, type(exc).__name__)
                last = Response(url, None, b"", {}, self._clock() - start, attempts, f"{type(exc).__name__}: {exc}")
            if attempt < max_retries:
                delay = float(pol["backoff"]) * (2 ** attempt)
                if retry_after is not None:
                    delay = max(delay, retry_after)
                self._sleep(delay)
        assert last is not None
        last.attempts = attempts
        if last.status == 429 and check:
            self.blocked[host] = "429 persistant après les reprises"
        return last


def _headers(raw: Any) -> dict[str, str]:
    if raw is None:
        return {}
    try:
        return {k: v for k, v in raw.items()}
    except AttributeError:
        return dict(raw)


def _header(headers: dict[str, str], name: str) -> str | None:
    for k, v in headers.items():
        if k.lower() == name:
            return v
    return None


def _parse_retry_after(value: str | None) -> float | None:
    if not value:
        return None
    value = value.strip()
    try:
        return max(0.0, float(value))
    except ValueError:
        pass
    try:
        when = parsedate_to_datetime(value)
    except (TypeError, ValueError):
        return None
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return max(0.0, (when - datetime.now(timezone.utc)).total_seconds())
