"""Grille de scoring du rendement des archetypes (prototype, parametres = hypotheses datees 2026-11-28).
Usage : python3 -I score.py  -> imprime les tableaux Markdown et ecrit scores.json a cote du script."""
import math, json, os

# --- Parametres par archetype (base France) -------------------------------------------------
# Horizon : 24 mois. p12 : proba d'atteindre >= 1 000 EUR/mois de revenu net a M12 ; Rs : revenu mensuel median des cas reussis a M12 (EUR)
# m : marge brute ; T1 : semaines jusqu'au premier revenu ; C : capital cash sur 6 mois (EUR) ; h : heures fondateur sur 6 mois
# L : levier Claude Code (0-1) ; D : defendabilite (0-5) ; Rp : risque plateforme/reglementaire (perte attendue, 0-1)
# hrun : heures/mois de fonctionnement de M7 a M24
# orient : 'export' (clients payant en EUR/USD hors du pays) ou 'local' ; rail : rail d'encaissement dominant ; regime : FR micro
A = {
 'micro_saas':            dict(hrun=30, p12=.12, Rs=3000, m=.85, T1=8,  C=1200, h=500, L=.70, D=2.5, Rp=.10, orient='export', rail='b2b_export', regime='bnc'),
 'clone_local':           dict(hrun=40, p12=.10, Rs=3000, m=.80, T1=10, C=1500, h=500, L=.75, D=2.0, Rp=.15, orient='local',  rail='b2c_local',  regime='bnc'),
 'ia_verticale_tpe':      dict(hrun=40, p12=.20, Rs=4000, m=.75, T1=4,  C=1200, h=450, L=.60, D=3.0, Rp=.10, orient='local',  rail='b2b_local',  regime='bnc'),
 'agent_whatsapp':        dict(hrun=40, p12=.20, Rs=3500, m=.60, T1=4,  C=1500, h=450, L=.60, D=2.0, Rp=.35, orient='local',  rail='b2b_local',  regime='bnc'),
 'seo_prog_annuaire':     dict(hrun=20, p12=.08, Rs=2000, m=.90, T1=16, C=900,  h=300, L=.80, D=1.0, Rp=.45, orient='local',  rail='ads_affil',  regime='bnc'),
 'geo_visibilite':        dict(hrun=60, p12=.30, Rs=5000, m=.70, T1=3,  C=900,  h=400, L=.60, D=2.0, Rp=.25, orient='local',  rail='b2b_local',  regime='bnc'),
 'newsletter_media':      dict(hrun=40, p12=.08, Rs=2000, m=.85, T1=16, C=600,  h=400, L=.50, D=3.5, Rp=.10, orient='local',  rail='b2c_online', regime='bnc'),
 'chaine_sans_visage':    dict(hrun=40, p12=.08, Rs=1500, m=.85, T1=30, C=900,  h=400, L=.60, D=1.0, Rp=.45, orient='local',  rail='youtube',    regime='bnc'),
 'produits_numeriques':   dict(hrun=20, p12=.10, Rs=2000, m=.90, T1=3,  C=300,  h=200, L=.50, D=1.5, Rp=.15, orient='local',  rail='b2c_online', regime='bic_vente'),
 'shopify_marque':        dict(hrun=60, p12=.10, Rs=8000, m=.20, T1=6,  C=5000, h=500, L=.40, D=2.5, Rp=.20, orient='local',  rail='ecom_local', regime='bic_vente'),
 'tiktok_affiliation':    dict(hrun=60, p12=.08, Rs=2000, m=.90, T1=6,  C=300,  h=400, L=.25, D=1.0, Rp=.40, orient='local',  rail='tiktok_shop',regime='bnc'),
 'extension_chrome':      dict(hrun=15, p12=.07, Rs=1500, m=.90, T1=10, C=300,  h=250, L=.80, D=1.5, Rp=.25, orient='export', rail='b2b_export', regime='bnc'),
 'app_mobile_virale':     dict(hrun=30, p12=.10, Rs=2500, m=.70, T1=8,  C=2500, h=400, L=.60, D=1.5, Rp=.25, orient='export', rail='app_store',  regime='bnc'),
 'mcp_plugins_skills':    dict(hrun=15, p12=.05, Rs=1500, m=.80, T1=10, C=600,  h=250, L=.90, D=1.5, Rp=.30, orient='export', rail='b2b_export', regime='bnc'),
 'agence_automatisation': dict(hrun=90, p12=.35, Rs=8000, m=.50, T1=3,  C=600,  h=600, L=.60, D=2.5, Rp=.10, orient='local',  rail='b2b_local',  regime='bnc'),
 'agence_export':        dict(hrun=90, p12=.25, Rs=6000, m=.50, T1=5,  C=600,  h=600, L=.60, D=2.0, Rp=.10, orient='export', rail='b2b_export', regime='bnc'),
 'marketplace_niche':     dict(hrun=50, p12=.05, Rs=3000, m=.80, T1=20, C=2500, h=600, L=.50, D=4.0, Rp=.15, orient='local',  rail='b2c_local',  regime='bnc'),
 'communaute_payante':    dict(hrun=40, p12=.15, Rs=5000, m=.85, T1=6,  C=400,  h=400, L=.30, D=3.5, Rp=.15, orient='local',  rail='b2c_online', regime='bnc'),
 'donnees_api':           dict(hrun=25, p12=.12, Rs=3000, m=.70, T1=6,  C=1500, h=350, L=.80, D=3.5, Rp=.30, orient='export', rail='b2b_export', regime='bnc'),
}

# --- Parametres pays ----------------------------------------------------------------------
# ppp : multiplicateur de revenu par client pour un marche local (France = 1) [H, a remplacer par RNB/hab PPA Banque mondiale]
# w : cout d'opportunite EUR/heure [H] ; tax : prelevement social/fiscal par regime (micro FR verifie ; autres [H])
# pay : coefficient d'encaissement par rail (0 = rail indisponible -> archetype bloque)
P = {
 'France':      dict(ppp=1.00, w=25, tax=dict(bnc=.256, bic_vente=.123),
                     pay=dict(b2b_export=1, b2b_local=1, b2c_local=1, b2c_online=1, ads_affil=1, youtube=1, ecom_local=1, tiktok_shop=1, app_store=1)),
 'Belgique':    dict(ppp=1.05, w=25, tax=dict(bnc=.25, bic_vente=.25),
                     pay=dict(b2b_export=1, b2b_local=1, b2c_local=1, b2c_online=1, ads_affil=1, youtube=1, ecom_local=1, tiktok_shop=.9, app_store=1)),
 'Suisse':      dict(ppp=1.60, w=45, tax=dict(bnc=.15, bic_vente=.15),
                     pay=dict(b2b_export=1, b2b_local=1, b2c_local=.95, b2c_online=.95, ads_affil=1, youtube=1, ecom_local=.9, tiktok_shop=0, app_store=1)),
 'Quebec':      dict(ppp=0.95, w=25, tax=dict(bnc=.20, bic_vente=.20),
                     pay=dict(b2b_export=1, b2b_local=1, b2c_local=1, b2c_online=1, ads_affil=1, youtube=1, ecom_local=1, tiktok_shop=.5, app_store=1)),
 'Maroc':       dict(ppp=0.25, w=6, tax=dict(bnc=.01, bic_vente=.005),
                     pay=dict(b2b_export=.70, b2b_local=.80, b2c_local=.50, b2c_online=.40, ads_affil=.80, youtube=.90, ecom_local=.55, tiktok_shop=0, app_store=.80)),
 'UEMOA (SN, CI)': dict(ppp=0.15, w=4, tax=dict(bnc=.10, bic_vente=.10),
                     pay=dict(b2b_export=.60, b2b_local=.60, b2c_local=.70, b2c_online=.60, ads_affil=.60, youtube=.40, ecom_local=.60, tiktok_shop=0, app_store=.70)),
 'Afrique centrale (CM, RDC)': dict(ppp=0.12, w=3, tax=dict(bnc=.10, bic_vente=.10),
                     pay=dict(b2b_export=.40, b2b_local=.50, b2c_local=.60, b2c_online=.40, ads_affil=.40, youtube=0, ecom_local=.50, tiktok_shop=0, app_store=.60)),
}
# Ajustements cibles (archetype, pays) -> multiplicateur de p12, avec justification [H]
FIT = {
 ('agent_whatsapp','Maroc'): 1.3, ('agent_whatsapp','UEMOA (SN, CI)'): 1.2, ('agent_whatsapp','Afrique centrale (CM, RDC)'): 1.1,
 ('clone_local','Maroc'): 1.2, ('clone_local','UEMOA (SN, CI)'): 1.2, ('clone_local','France'): 0.8,
 ('geo_visibilite','Maroc'): 0.8, ('geo_visibilite','UEMOA (SN, CI)'): 0.6, ('geo_visibilite','Afrique centrale (CM, RDC)'): 0.5,
 ('shopify_marque','Maroc'): 0.9,
}
RET = 0.85  # part du revenu M12 conservee en moyenne sur l'annee 2 [H]
W = dict(roi=.35, t1=.15, lev=.15, dfd=.20, cap=.15)

def score(a, c):
    x, y = A[a], P[c]
    pay = y['pay'][x['rail']]
    if pay == 0:
        return dict(score=0.0, blocked=True, E24=0, roi=None)
    arpu = 1.0 if x['orient'] == 'export' else y['ppp']
    tax = y['tax'][x['regime']]
    r_net = x['Rs'] * arpu * x['m'] * (1 - tax)                       # EUR/mois net a M12 si succes
    ramp = max(0.0, 12 - x['T1'] / 4.33) / 2                           # rampe lineaire de T1 a M12 (mois equivalents)
    months = ramp + 12 * RET                                           # horizon 24 mois, annee 2 a RET du niveau M12
    p = min(1.0, x['p12'] * FIT.get((a, c), 1.0))
    E = p * pay * (1 - x['Rp']) * r_net * months                       # esperance de revenu net sur 24 mois
    cost_cash = x['C'] * 2                                             # outils et depenses sur 24 mois
    cost_time = (x['h'] + x['hrun'] * 18) * y['w']                     # temps valorise au cout d'opportunite local
    roi = (E - cost_cash) / (cost_cash + cost_time)                    # retour ajuste du risque
    s = dict(roi=0.5 + 0.5 * math.tanh(roi), t1=math.exp(-x['T1'] / 12), lev=x['L'], dfd=x['D'] / 5,
             cap=1 - math.log10(1 + x['C']) / math.log10(1 + 10000))
    return dict(score=round(100 * sum(W[k] * s[k] for k in W), 1), blocked=False, E24=round(E), roi=round(roi, 2))

if __name__ == '__main__':
    res = {c: {a: score(a, c) for a in A} for c in P}
    print('| Archetype | ' + ' | '.join(P) + ' |'); print('|' + '---|' * (len(P) + 1))
    for a in A:
        print(f'| {a} | ' + ' | '.join(('bloque' if res[c][a]['blocked'] else f"{res[c][a]['score']}") for c in P) + ' |')
    print()
    print('| Archetype | E24 France (EUR) | ROI ajuste France | E24 Maroc (EUR) | ROI ajuste Maroc | E24 UEMOA (EUR) | ROI UEMOA |'); print('|---|---|---|---|---|---|---|')
    for a in A:
        f, m, u = res['France'][a], res['Maroc'][a], res['UEMOA (SN, CI)'][a]
        print(f"| {a} | {f['E24']} | {f['roi']} | {m['E24']} | {m['roi']} | {u['E24']} | {u['roi']} |")
    print()
    for c in P:
        top = sorted(((res[c][a]['score'], a) for a in A if not res[c][a]['blocked']), reverse=True)[:6]
        print(f'- {c} : ' + ', '.join(f'{a} ({s})' for s, a in top))
    json.dump(res, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scores.json'), 'w'), indent=1)
