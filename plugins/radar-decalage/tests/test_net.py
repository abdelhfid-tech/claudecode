import io
import urllib.error

from radar.net import HttpClient, default_user_agent


class FakeResp:
    def __init__(self, status=200, body=b"ok", headers=None):
        self.status = status
        self._body = body
        self.headers = headers or {}

    def read(self):
        return self._body

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def http_error(code, headers=None):
    return urllib.error.HTTPError("https://x.test/a", code, "err", headers or {}, io.BytesIO(b"nope"))


class Clock:
    def __init__(self):
        self.t = 0.0
        self.sleeps = []

    def now(self):
        return self.t

    def sleep(self, s):
        self.sleeps.append(s)
        self.t += s


def make_client(script, policies=None):
    clock = Clock()
    calls = []

    def opener(req, timeout):
        calls.append(req)
        item = script.pop(0)
        if isinstance(item, Exception):
            raise item
        return item

    client = HttpClient(host_policies=policies or {}, opener=opener, sleep=clock.sleep, clock=clock.now)
    return client, clock, calls


def test_success_first_try():
    client, clock, calls = make_client([FakeResp(200, b"hello")])
    r = client.request("https://x.test/a")
    assert r.ok and r.body == b"hello" and r.attempts == 1
    assert clock.sleeps == []


def test_retry_on_429_honours_retry_after():
    policies = {"x.test": {"max_retries": 2, "backoff": 1.0, "min_interval": 0}}
    client, clock, calls = make_client([http_error(429, {"Retry-After": "7"}), FakeResp(200, b"ok")], policies)
    r = client.request("https://x.test/a")
    assert r.ok and r.attempts == 2
    assert 7.0 in clock.sleeps


def test_retry_after_is_capped():
    policies = {"x.test": {"max_retries": 1, "backoff": 1.0, "min_interval": 0, "max_retry_after": 5}}
    client, clock, _ = make_client([http_error(503, {"Retry-After": "600"}), FakeResp(200)], policies)
    client.request("https://x.test/a")
    assert max(clock.sleeps) == 5


def test_no_retry_on_403():
    policies = {"x.test": {"max_retries": 3, "min_interval": 0}}
    client, clock, calls = make_client([http_error(403)], policies)
    r = client.request("https://x.test/a")
    assert r.status == 403 and not r.ok and len(calls) == 1


def test_network_error_retried_then_reported():
    policies = {"x.test": {"max_retries": 1, "backoff": 0.5, "min_interval": 0}}
    client, clock, calls = make_client([urllib.error.URLError("down"), urllib.error.URLError("down")], policies)
    r = client.request("https://x.test/a")
    assert r.status is None and "URLError" in r.error and r.attempts == 2


def test_min_interval_between_calls_same_host():
    policies = {"x.test": {"min_interval": 3.0}}
    client, clock, _ = make_client([FakeResp(), FakeResp()], policies)
    client.request("https://x.test/a")
    client.request("https://x.test/b")
    assert clock.sleeps == [3.0]


def test_status_counts():
    policies = {"x.test": {"max_retries": 1, "backoff": 0, "min_interval": 0}}
    client, _, _ = make_client([http_error(502), FakeResp(200)], policies)
    client.request("https://x.test/a")
    assert client.stats["x.test"] == {"502": 1, "200": 1}


def test_user_agent_has_no_contact_by_default(monkeypatch):
    monkeypatch.delenv("RADAR_CONTACT", raising=False)
    assert "(" in default_user_agent() and "@" not in default_user_agent()
    monkeypatch.setenv("RADAR_CONTACT", "contact-choisi")
    assert default_user_agent().endswith("(contact-choisi)")
