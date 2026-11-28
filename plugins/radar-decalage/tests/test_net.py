import http.client
import io
import urllib.error
from email.utils import format_datetime
from datetime import datetime, timedelta, timezone

from radar.net import HttpClient, Robots, default_user_agent

APPLE_ROBOTS = "User-agent: *\nDisallow: /*/rss/*\nDisallow: /*/lookup?\n"


class FakeResp:
    def __init__(self, status=200, body=b"ok", headers=None):
        self.status = status
        self._body = io.BytesIO(body)
        self.headers = headers or {}

    def read(self, n=-1):
        return self._body.read(n)

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


def make_client(script, policies=None, robots=False):
    clock = Clock()
    calls = []

    def opener(req, timeout):
        calls.append(req.full_url)
        item = script.pop(0)
        if isinstance(item, Exception):
            raise item
        return item

    client = HttpClient(host_policies=policies or {}, opener=opener, sleep=clock.sleep, clock=clock.now,
                        respect_robots=robots)
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


def test_retry_after_header_is_case_insensitive_and_accepts_http_dates():
    policies = {"x.test": {"max_retries": 2, "backoff": 0.5, "min_interval": 0, "max_retry_after": 60}}
    client, clock, _ = make_client([http_error(503, {"retry-after": "9"}), FakeResp(200)], policies)
    client.request("https://x.test/a")
    assert 9.0 in clock.sleeps
    when = format_datetime(datetime.now(timezone.utc) + timedelta(seconds=30), usegmt=True)
    client, clock, _ = make_client([http_error(503, {"Retry-After": when}), FakeResp(200)], policies)
    client.request("https://x.test/a")
    assert any(20 < s <= 31 for s in clock.sleeps)


def test_retry_after_beyond_the_cap_gives_up_instead_of_coming_back_early():
    policies = {"x.test": {"max_retries": 3, "backoff": 1.0, "min_interval": 0, "max_retry_after": 60}}
    client, clock, calls = make_client([http_error(429, {"Retry-After": "3600"}), FakeResp(200)], policies)
    r = client.request("https://x.test/a")
    assert r.status == 429 and len(calls) == 1 and clock.sleeps == []
    assert "x.test" in client.blocked  # 429 avec une attente trop longue : hôte coupé pour l'exécution
    again = client.request("https://x.test/b")
    assert again.status is None and "coupé" in again.error and len(calls) == 1


def test_403_is_respected_for_the_whole_host():
    policies = {"x.test": {"max_retries": 3, "min_interval": 0}}
    client, clock, calls = make_client([http_error(403), FakeResp(200)], policies)
    r = client.request("https://x.test/a")
    assert r.status == 403 and not r.ok and len(calls) == 1
    r2 = client.request("https://x.test/other")
    assert r2.status is None and len(calls) == 1  # aucun nouvel appel au site qui a refusé


def test_network_error_retried_then_reported():
    policies = {"x.test": {"max_retries": 1, "backoff": 0.5, "min_interval": 0}}
    client, clock, calls = make_client([urllib.error.URLError("down"), urllib.error.URLError("down")], policies)
    r = client.request("https://x.test/a")
    assert r.status is None and "URLError" in r.error and r.attempts == 2


def test_truncated_response_is_retried_not_raised():
    policies = {"x.test": {"max_retries": 1, "backoff": 0.1, "min_interval": 0}}
    client, clock, calls = make_client([http.client.IncompleteRead(b"partial", 990), FakeResp(200, b"full")],
                                       policies)
    r = client.request("https://x.test/a")
    assert r.ok and r.body == b"full" and r.attempts == 2


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


# ---------------------------------------------------------------- robots.txt

def test_robots_rules_of_the_real_sources():
    apple = Robots.parse(APPLE_ROBOTS)
    assert not apple.allowed("https://itunes.apple.com/fr/rss/topfreeapplications/limit=100/json")
    assert not apple.allowed("https://itunes.apple.com/fr/lookup?id=1")
    assert apple.allowed("https://itunes.apple.com/lookup?id=1,2&country=ma")
    assert not Robots.parse("User-Agent: *\nDisallow: /_\n").allowed("https://play.google.com/_/PlayStoreUi/data/x")
    assert not Robots.parse("User-agent: *\nDisallow: /\n").allowed("https://completion.amazon.fr/api/2017/x")
    assert Robots.parse("User-agent: *\n").allowed("https://trends.google.com/trending/rss?geo=MA")


def test_robots_precedence_and_agent_groups():
    text = "User-agent: *\nDisallow: /private\nAllow: /private/ok\n\nUser-agent: radar-decalage\nDisallow: /mine$\n"
    r = Robots.parse(text)
    # Un groupe qui nous nomme l'emporte sur « * » ; « $ » ancre la fin.
    assert not r.allowed("https://h/mine") and r.allowed("https://h/mine2") and r.allowed("https://h/private")
    star = Robots.parse("User-agent: *\nDisallow: /private\nAllow: /private/ok\n")
    assert not star.allowed("https://h/private/x") and star.allowed("https://h/private/ok/y")  # la plus longue gagne


def test_client_fetches_robots_once_and_refuses_disallowed_urls():
    client, clock, calls = make_client([FakeResp(200, APPLE_ROBOTS.encode()), FakeResp(200, b"{}")],
                                       {"itunes.apple.com": {"min_interval": 0}}, robots=True)
    denied = client.request("https://itunes.apple.com/fr/rss/topfreeapplications/limit=100/json")
    assert denied.status is None and "robots" in denied.error
    ok = client.request("https://itunes.apple.com/lookup?id=1&country=fr")
    assert ok.ok
    assert calls == ["https://itunes.apple.com/robots.txt", "https://itunes.apple.com/lookup?id=1&country=fr"]


def test_missing_robots_allows_unreachable_robots_denies():
    client, _, calls = make_client([http_error(404), FakeResp(200)], {"a.test": {"min_interval": 0}}, robots=True)
    assert client.request("https://a.test/x").ok
    client, _, calls = make_client([http_error(503), http_error(503), http_error(503)],
                                   {"b.test": {"min_interval": 0, "max_retries": 2, "backoff": 0}}, robots=True)
    r = client.request("https://b.test/x")
    assert r.status is None and "robots" in r.error
