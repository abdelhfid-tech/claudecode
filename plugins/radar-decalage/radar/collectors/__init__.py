"""Registre des collecteurs. L'ordre compte : les classements alimentent la liste
de suivi avant la vérification de disponibilité."""

from .apple import AppleCharts, AppleLookup
from .autocomplete import Autocomplete
from .google_play import GooglePlayCharts
from .gtrends import GoogleTrendsDaily
from .villes import AutocompleteVilles
from .wikimedia import WikimediaCountry

REGISTRY = [AppleCharts, GooglePlayCharts, AppleLookup, GoogleTrendsDaily, Autocomplete, WikimediaCountry,
            AutocompleteVilles]

BY_NAME = {c.name: c for c in REGISTRY}
