"""Client HTTP prudent : débit limité par hôte, reprises bornées, respect de Retry-After.

Règles de collecte du plan : pas de connexion, pas de contournement d'un refus
(403, captcha), un quota par hôte. Seuls 429, 5xx et les erreurs réseau
déclenchent une reprise ; un 403 ou un 404 est rendu tel quel.
"""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Any, Callable
from urllib.parse import urlparse

from . import __version__

RETRYABLE = {429, 500, 502, 503, 504}

DEFAULT_POLICY = {"min_interval": 1.0, "max_retries": 2, "backoff": 2.0, "max_retry_after": 60.0, "timeout": 30.0}


def default_user_agent() -> str:
    """Identifiant générique ; un contact n'est ajouté que si RADAR_CONTACT est défini."""
    contact = os.environ.get("RADAR_CONTACT", "").strip()
    base = f"radar-decalage/{__version__}"
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

    @property
    def ok(self) -> bool:
        return self.status is not None and 200 <= self.status < 300

    def text(self) -> str:
        return self.body.decode("utf-8", "replace")

    def json(self) -> Any:
        return json.loads(self.body)


class HttpClient:
    def __init__(
        self,
        host_policies: dict[str, dict[str, Any]] | None = None,
        user_agent: str | None = None,
        opener: Callable[..., Any] | None = None,
        sleep: Callable[[float], None] = time.sleep,
        clock: Callable[[], float] = time.monotonic,
    ):
        self.host_policies = host_policies or {}
        self.user_agent = user_agent or default_user_agent()
        self._open = opener or urllib.request.urlopen
        self._sleep = sleep
        self._clock = clock
        self._last: dict[str, float] = {}
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

    def request(
        self,
        url: str,
        data: bytes | None = None,
        headers: dict[str, str] | None = None,
        method: str | None = None,
    ) -> Response:
        host = urlparse(url).hostname or ""
        pol = self.policy(host)
        hdrs = {"User-Agent": pol.get("user_agent") or self.user_agent, "Accept-Encoding": "identity"}
        hdrs.update(headers or {})
        attempts = 0
        start = self._clock()
        last: Response | None = None
        for attempt in range(int(pol["max_retries"]) + 1):
            attempts = attempt + 1
            self._wait_turn(host, float(pol["min_interval"]))
            req = urllib.request.Request(url, data=data, headers=hdrs, method=method or ("POST" if data else "GET"))
            retry_after: float | None = None
            try:
                with self._open(req, timeout=float(pol["timeout"])) as resp:
                    body = resp.read()
                    status = getattr(resp, "status", 200)
                    self._count(host, status)
                    return Response(url, status, body, dict(resp.headers or {}), self._clock() - start, attempts)
            except urllib.error.HTTPError as exc:
                body = exc.read() if hasattr(exc, "read") else b""
                headers_out = dict(exc.headers or {})
                self._count(host, exc.code)
                last = Response(url, exc.code, body, headers_out, self._clock() - start, attempts, f"HTTP {exc.code}")
                if exc.code not in RETRYABLE:
                    return last
                retry_after = _parse_retry_after(headers_out.get("Retry-After"))
            except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as exc:
                self._count(host, type(exc).__name__)
                last = Response(url, None, b"", {}, self._clock() - start, attempts, f"{type(exc).__name__}: {exc}")
            if attempt < int(pol["max_retries"]):
                delay = float(pol["backoff"]) * (2 ** attempt)
                if retry_after is not None:
                    delay = max(delay, min(retry_after, float(pol["max_retry_after"])))
                self._sleep(delay)
        assert last is not None
        last.attempts = attempts
        return last


def _parse_retry_after(value: str | None) -> float | None:
    if not value:
        return None
    try:
        return max(0.0, float(value))
    except ValueError:
        return None
