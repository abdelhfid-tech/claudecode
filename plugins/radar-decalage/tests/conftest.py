import sys
from datetime import datetime, timezone
from pathlib import Path

import pytest

PLUGIN_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PLUGIN_ROOT))

from radar.net import Response  # noqa: E402


class FakeClient:
    """Client HTTP de test : `routes` associe un fragment d'URL à une réponse ou une fonction."""

    def __init__(self, routes):
        self.routes = routes
        self.calls = []
        self.stats = {}

    def request(self, url, data=None, headers=None, method=None):
        self.calls.append(url)
        for fragment, answer in self.routes.items():
            if fragment in url:
                if callable(answer):
                    answer = answer(url, data)
                status, body = answer
                if isinstance(body, str):
                    body = body.encode("utf-8")
                return Response(url, status, body, {}, 0.0, 1, None if status == 200 else f"HTTP {status}")
        return Response(url, 404, b"", {}, 0.0, 1, "HTTP 404")


@pytest.fixture
def now():
    return datetime(2026, 11, 28, 12, 0, tzinfo=timezone.utc)


@pytest.fixture
def workspace(tmp_path, monkeypatch):
    ws = tmp_path / "workspace"
    ws.mkdir()
    monkeypatch.setenv("RADAR_WORKSPACE", str(ws))
    return ws
