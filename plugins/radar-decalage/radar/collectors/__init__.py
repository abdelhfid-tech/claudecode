"""Registre des collecteurs. L'ordre compte : les classements alimentent la liste
de suivi avant la vérification de disponibilité."""

from .apple import AppleCharts, AppleLookup
from .assortiment import AutocompleteAssortiment
from .autocomplete import Autocomplete
from .google_play import GooglePlayCharts
from .gtrends import GoogleTrendsDaily
from .produits import AutocompleteProduits
from .villes import AutocompleteVilles
from .wikimedia import WikimediaCountry

REGISTRY = [AppleCharts, GooglePlayCharts, AppleLookup, GoogleTrendsDaily, Autocomplete, WikimediaCountry,
            AutocompleteVilles, AutocompleteProduits, AutocompleteAssortiment]

BY_NAME = {c.name: c for c in REGISTRY}
