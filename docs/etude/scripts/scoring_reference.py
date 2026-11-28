"""Reference implementation of the detection and scoring formulas proposed in
diffusion-scoring.md. Pure standard library. Not production code: it exists to
check that the formulas are computable and to run them on real series.

Usage:
  python3 -I scoring_reference.py demo   # runs detectors on Wikimedia series and a scoring example
"""
import json, math, random, statistics as st, sys, time, urllib.parse, urllib.request

# ---------------------------------------------------------------- detectors

def theil_sen(y):
    """Median of pairwise slopes (robust trend), y equally spaced."""
    sl = [(y[j] - y[i]) / (j - i) for i in range(len(y)) for j in range(i + 1, len(y))]
    return st.median(sl) if sl else 0.0

def robust_z(x, base):
    """Modified z-score (Iglewicz-Hoaglin): 0.6745 (x - median) / MAD. MAD floored at 1."""
    med = st.median(base)
    mad = st.median([abs(b - med) for b in base]) or 1.0
    return 0.6745 * (x - med) / mad

def mann_kendall(y):
    """Returns (S, tau, one-sided p for increasing trend). Normal approximation with
    continuity correction, no tie correction. For n <= 8 the exact minimum one-sided
    p-value is 1/n! (n=4: 0.042, n=5: 0.0083)."""
    n = len(y)
    s = sum((y[j] > y[i]) - (y[j] < y[i]) for i in range(n) for j in range(i + 1, n))
    var = n * (n - 1) * (2 * n + 5) / 18.0
    if s > 0: z = (s - 1) / math.sqrt(var)
    elif s < 0: z = (s + 1) / math.sqrt(var)
    else: z = 0.0
    p = 0.5 * math.erfc(z / math.sqrt(2))
    return s, s / (n * (n - 1) / 2), p

def cusum_up(y, k=0.5, h=4.0, base_n=28):
    """One-sided CUSUM (Page 1954) on standardized log values; baseline = first base_n points.
    Returns index of first alarm or None."""
    ly = [math.log1p(v) for v in y]
    if len(ly) <= base_n: return None
    b = ly[:base_n]; mu = st.mean(b); sd = st.pstdev(b) or 0.1
    c = 0.0
    for i in range(base_n, len(ly)):
        c = max(0.0, c + (ly[i] - mu) / sd - k)
        if c > h: return i
    return None

def kleinberg_two_state(r, d, s=2.0, gamma=1.0):
    """Kleinberg (2003) batched model: r[t] relevant items among d[t]. State 0 rate p0=R/D,
    state 1 rate p1=min(0.9999, s*p0). Cost = -log binomial likelihood + gamma*ln(n) per upward
    transition. Returns list of states (Viterbi)."""
    n = len(r); R = sum(r); D = sum(d)
    p = [R / D, min(0.9999, s * R / D)]
    def cost(i, t):
        pi = p[i]
        return -(math.lgamma(d[t] + 1) - math.lgamma(r[t] + 1) - math.lgamma(d[t] - r[t] + 1)
                 + r[t] * math.log(pi) + (d[t] - r[t]) * math.log(1 - pi))
    up = gamma * math.log(n)
    C = [cost(0, 0), cost(1, 0) + up]; back = []
    for t in range(1, n):
        c0 = min(C[0], C[1]); b0 = 0 if C[0] <= C[1] else 1
        c1o = C[0] + up; c1 = min(c1o, C[1]); b1 = 0 if c1o < C[1] else 1
        back.append((b0, b1)); C = [c0 + cost(0, t), c1 + cost(1, t)]
    st_ = [0 if C[0] <= C[1] else 1]
    for b in reversed(back): st_.append(b[st_[-1]])
    return list(reversed(st_))

def takeoff_index(y, base_min=50, mult=3.0, k=7):
    """Golder-Tellis style threshold adapted to attention data: first t where the k-day mean is
    >= mult x the trailing 28-day mean AND >= base_min (absolute floor for cold start)."""
    for t in range(28 + k, len(y)):
        cur = st.mean(y[t - k:t]); prev = st.mean(y[t - k - 28:t - k]) or 1.0
        if cur >= base_min and cur >= mult * prev: return t - 1
    return None

# ---------------------------------------------------------------- module A: US strength

W_A = {"velocity": .25, "level": .15, "persistence": .15, "breadth": .30, "accel": .05, "burst": .10}

def force_us(f):
    """f: dict of features already in [0,1] (percentiles or ratios). Returns 0-100 and stage."""
    score = 100 * sum(W_A[k] * f[k] for k in W_A)
    if f.get("n_families_up", 0) <= 1: score *= 0.6          # single-source penalty
    if f.get("half_life_days", 99) < 3 and f["persistence"] < .5: score = min(score, 40)  # event, not trend
    return round(score, 1)

def stage(frac_of_peak, v, a, breadth_n, days_since_peak):
    if days_since_peak >= 28 and frac_of_peak < .5 and v < 0: return "declin"
    if frac_of_peak >= .8 and abs(v) < .01: return "mainstream"
    if v > 0 and a > 0 and breadth_n >= 3: return "acceleration"
    if breadth_n >= 2 and v > 0: return "emergent"
    return "signal_faible"

# ---------------------------------------------------------------- module B: lag priors

# (median_days, p10_days, p90_days) by friction class x country group. See dossier section 6.2.
LAG_PRIOR = {
 "A": {"UE_fr": (7, 0, 30), "QC": (5, 0, 21), "Maghreb": (14, 0, 60), "AfSS_fr": (21, 0, 90)},
 "B": {"UE_fr": (75, 20, 240), "QC": (45, 10, 180), "Maghreb": (180, 45, 720), "AfSS_fr": (270, 60, 1080)},
 "C": {"UE_fr": (300, 150, 600), "QC": (120, 0, 450), "Maghreb": (900, 0, 3300), "AfSS_fr": (1100, 0, 3650)},
 "D": {"UE_fr": (1100, 700, 1825), "QC": (900, 365, 1825), "Maghreb": (1825, 900, None), "AfSS_fr": (1825, 900, None)},
 "E": {"UE_fr": (1200, 700, 2100), "QC": (900, 400, 1800), "Maghreb": (1700, 900, 3000), "AfSS_fr": (2200, 1000, None)},
 "F": {"UE_fr": (1500, 1000, 2600), "QC": (900, 400, 1800), "Maghreb": (None, 1800, None), "AfSS_fr": (None, 1800, None)},
}

def p_arrival_by(t_days, cls, group, p_never=None):
    """Lognormal with median m and p90 from the prior table; p_never mass for 'never'."""
    m, p10, p90 = LAG_PRIOR[cls][group]
    if p_never is None: p_never = {"D": .35, "F": .35, "E": .2}.get(cls, .05)
    if m is None: return 0.0 if t_days < 1800 else (1 - p_never) * .2
    hi = p90 or 4 * m
    sigma = (math.log(hi) - math.log(max(m, 1))) / 1.2816
    if t_days <= 0: return 0.0
    z = (math.log(t_days) - math.log(max(m, 1))) / sigma
    return (1 - p_never) * 0.5 * math.erfc(-z / math.sqrt(2))

def update_with_sentinel(m_days, sentinel_obs_days, sentinel_prior_days, rho=.5):
    """Shift the target median by rho x the log-surprise observed in a sentinel country."""
    return m_days * math.exp(rho * (math.log(sentinel_obs_days + 1) - math.log(sentinel_prior_days + 1)))

# ---------------------------------------------------------------- module C: transposability

# Weights by niche group over C (culture), A (admin/regulation), G (geography), E (economy),
# I (infrastructure: payment, logistics, creator monetisation), L (lifestyle fit), S (no substitute)
W_C = {
 "contenu":    {"C": .30, "A": .05, "G": .05, "E": .05, "I": .15, "L": .25, "S": .15},
 "produit":    {"C": .20, "A": .15, "G": .15, "E": .20, "I": .15, "L": .10, "S": .05},
 "app_b2c":    {"C": .15, "A": .15, "G": .00, "E": .20, "I": .25, "L": .15, "S": .10},
 "reglemente": {"C": .10, "A": .45, "G": .05, "E": .10, "I": .15, "L": .10, "S": .05},
 "pratique":   {"C": .15, "A": .10, "G": .10, "E": .20, "I": .25, "L": .10, "S": .10},
 "b2b":        {"C": .05, "A": .20, "G": .00, "E": .25, "I": .30, "L": .05, "S": .15},
}

def beta_draw(mean, conf, rng):
    """Draw in [0,1] around mean; conf in [0,1] -> concentration 2 + 38*conf."""
    mean = min(max(mean, 1e-3), 1 - 1e-3); k = 2 + 38 * conf
    return rng.betavariate(mean * k, (1 - mean) * k)

def transposability(niche, comps, gates, n=5000, seed=7):
    """comps: {dim: (closeness_mean_in_[0,1], confidence_in_[0,1])}; gates: list of (value_mean, conf).
    Returns P10, P50, P90 on a 0-100 scale."""
    rng = random.Random(seed); w = W_C[niche]; out = []
    for _ in range(n):
        g = 1.0
        for gm, gc in gates: g *= beta_draw(gm, gc, rng) if gm not in (0, 1) else gm
        s = sum(w[d] * beta_draw(*comps[d], rng) for d in w)
        out.append(100 * g * s)
    out.sort()
    return round(out[n // 10], 1), round(out[n // 2], 1), round(out[9 * n // 10], 1)

def ks_norm(ks): return min(1.0, ks / 3.0)
def econ_dist(gdp_a, gdp_b): return min(1.0, abs(math.log(gdp_a / gdp_b)) / math.log(20))

# ---------------------------------------------------------------- module D: initiative return

def rendement(reach_users, value_per_user_eur, p0, z_force, z_transpo, window_days, build_days,
              effort_person_weeks, cash_eur, week_cost_eur=600):
    """Expected margin per euro of total cost (effort valued at week_cost_eur)."""
    logit = math.log(p0 / (1 - p0)) + 0.6 * z_force + 0.6 * z_transpo
    p = 1 / (1 + math.exp(-logit))
    f_window = min(1.0, window_days / max(build_days, 1))
    ev = reach_users * value_per_user_eur * p * f_window
    cost = effort_person_weeks * week_cost_eur + cash_eur
    return round(p, 3), round(ev), round(ev / cost, 2)

# ---------------------------------------------------------------- forecast quality

def brier(ps, os): return sum((p - o) ** 2 for p, o in zip(ps, os)) / len(ps)
def brier_skill(ps, os):
    base = sum(os) / len(os); ref = brier([base] * len(os), os)
    return 1 - brier(ps, os) / ref if ref else float("nan")

# ---------------------------------------------------------------- demo on real series

UA = {"User-Agent": "trend-radar-research/0.1 (methodology test)"}
def views(lang, title, a, b):
    t = urllib.parse.quote(title.replace(" ", "_"), safe="")
    u = f"https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{lang}.wikipedia/all-access/user/{t}/daily/{a}00/{b}00"
    for i in range(6):
        try:
            d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40)); time.sleep(2)
            return [(x["timestamp"][:8], x["views"]) for x in d["items"]]
        except Exception:
            time.sleep(5 + 5 * i)
    return []

def first_alarm_dates(series, total_series=None):
    days = [d for d, _ in series]; y = [v for _, v in series]
    res = {}
    # robust z > 3.5 on 3 consecutive days with 28-day baseline
    for i in range(28, len(y) - 2):
        if all(robust_z(y[i + k], y[i - 28:i]) > 3.5 for k in range(3)) and y[i] >= 50:
            res["robust_z"] = days[i]; break
    i = cusum_up(y); res["cusum"] = days[i] if i is not None else None
    i = takeoff_index(y); res["takeoff_abs_floor"] = days[i] if i is not None else None
    # Mann-Kendall on rolling 8 weekly sums
    wk = [sum(y[j:j + 7]) for j in range(0, len(y) - 6, 7)]
    for j in range(8, len(wk) + 1):
        s_, tau, p = mann_kendall(wk[j - 8:j])
        if p < .01 and wk[j - 1] >= 350: res["mann_kendall_8w"] = days[min(len(days) - 1, 7 * j - 1)]; break
    if total_series:
        tot = dict(total_series); r = [v for _, v in series]; d = [max(tot.get(dd, 0), v + 1) for dd, v in series]
        stt = kleinberg_two_state(r, d)
        res["kleinberg"] = next((days[i] for i, s_ in enumerate(stt) if s_ == 1), None)
    pk = max(range(len(y)), key=lambda i: y[i])
    res["d50_of_peak"] = next(days[i] for i in range(len(y)) if y[i] >= .5 * y[pk])
    res["peak"] = days[pk]
    return res

def project_total(lang, a, b):
    u = f"https://wikimedia.org/api/rest_v1/metrics/pageviews/aggregate/{lang}.wikipedia/all-access/user/daily/{a}00/{b}00"
    for i in range(5):
        try:
            d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40)); time.sleep(2)
            return [(x["timestamp"][:8], x["views"]) for x in d["items"]]
        except Exception:
            time.sleep(5 + 5 * i)
    return []

def demo():
    cases = [("en", "Labubu", "20250101", "20251031"), ("fr", "Labubu", "20250101", "20251031"),
             ("de", "Dubai-Schokolade", "20240901", "20250630"), ("en", "Dubai chocolate", "20240901", "20250630"),
             ("fr", "Chocolat Dubaï", "20240901", "20250630"), ("en", "Hyrox", "20230101", "20261031"),
             ("de", "Hyrox", "20230101", "20261031"), ("fr", "Hyrox", "20230101", "20261031"),
             ("en", "Pickleball", "20200101", "20261031"), ("fr", "Pickleball", "20200101", "20261031")]
    out = {}
    totals = {}
    for lang, title, a, b in cases:
        s = views(lang, title, a, b)
        key = (lang, a, b)
        if key not in totals: totals[key] = project_total(lang, a, b)
        r = first_alarm_dates(s, totals[key]) if len(s) > 40 else {"error": "short series", "n": len(s)}
        r["first_day"] = s[0][0] if s else None
        out[f"{lang}:{title}"] = r
        print(lang, title, r, flush=True)
    return out

if __name__ == "__main__" and len(sys.argv) > 1 and sys.argv[1] == "demo":
    res = demo()
    json.dump(res, open(sys.argv[2] if len(sys.argv) > 2 else "detect_demo.json", "w"), indent=1, ensure_ascii=False)
