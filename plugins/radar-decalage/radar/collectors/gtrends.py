"""Google Trends : tendances du jour par pays (flux RSS officiel).

Le flux ne contient qu'une dizaine d'éléments, dominés par le sport et la
politique : signal de faible poids, relevé toutes les heures sur quelques pays.
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from typing import Any

from ..storage import iso, make_record
from .base import Collector, Context, Result

URL = "https://trends.google.com/trending/rss?geo={geo}"
HT = "{https://trends.google.com/trending/rss}"


def parse_traffic(text: str | None) -> int | None:
    """« 200+ », « 2K+ », « 1M+ », « 1 000+ » -> entier ; None si illisible."""
    if not text:
        return None
    t = text.replace(" ", "").replace("\xa0", "").replace(" ", "").replace(",", "").upper()
    m = re.match(r"^(\d+(?:\.\d+)?)([KM]?)\+?$", t)
    if not m:
        return None
    value = float(m.group(1)) * {"": 1, "K": 1_000, "M": 1_000_000}[m.group(2)]
    return int(value)


def normalize(title: str) -> str:
    return re.sub(r"\s+", " ", title.strip().lower())


def parse(xml_text: str) -> list[dict[str, Any]]:
    root = ET.fromstring(xml_text)
    items = []
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        if not title:
            continue
        pub = item.findtext("pubDate")
        try:
            published = iso(parsedate_to_datetime(pub)) if pub else None
        except (TypeError, ValueError):
            published = None
        news = []
        for n in item.findall(f"{HT}news_item")[:3]:
            news.append({"title": (n.findtext(f"{HT}news_item_title") or "").strip(),
                         "source": (n.findtext(f"{HT}news_item_source") or "").strip(),
                         "url": (n.findtext(f"{HT}news_item_url") or "").strip()})
        items.append({"title": title, "traffic": parse_traffic(item.findtext(f"{HT}approx_traffic")),
                      "traffic_label": item.findtext(f"{HT}approx_traffic"), "published": published, "news": news})
    return items


class GoogleTrendsDaily(Collector):
    name = "gtrends_daily"
    family = "search"
    cadence = "hourly"

    def collect(self, ctx: Context) -> Result:
        res = Result()
        geos = ctx.source_config.get("geos", ["US", "FR", "MA"])
        for geo in geos:
            r = ctx.client.request(URL.format(geo=geo))
            if not r.ok:
                res.unit(False, f"{geo}: {r.status or r.error}")
                continue
            try:
                items = parse(r.text())
            except ET.ParseError as exc:
                res.unit(False, f"{geo}: XML illisible ({exc})")
                continue
            res.unit(True)
            for rank, it in enumerate(items, start=1):
                res.records.append(make_record(
                    self.name, geo, "trending", f"q:{normalize(it['title'])}", it["traffic"],
                    {"title": it["title"], "rank": rank, "traffic_label": it["traffic_label"],
                     "published": it["published"], "news": it["news"]}, ts=ctx.now))
        return res
