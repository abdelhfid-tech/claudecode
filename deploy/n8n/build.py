"""Assemble le flux n8n « Radar : contenu réactif » à partir des nœuds Code de src/.

python3 deploy/n8n/build.py   ->   deploy/n8n/radar-contenu-reactif.json (à importer dans n8n)

Versions des nœuds vérifiées sur n8n-nodes-base 2.49.8 : Webhook 2, Form Trigger 2.2,
Code 2, HTTP Request 4.2, Telegram 1.2, Wait 1.1 (reprise sur formulaire).
Les identifiants (Radar token, Anthropic, Blotato, Telegram, accès au formulaire) ne sont
pas dans le fichier : vous les choisissez sur chaque nœud après l'import.
"""

from __future__ import annotations

import json
import uuid
from pathlib import Path

HERE = Path(__file__).resolve().parent
NS = uuid.UUID("6f1d2c3a-7b8e-4f90-a1b2-c3d4e5f60718")


def uid(name: str) -> str:
    return str(uuid.uuid5(NS, name))


def code(name: str, file: str, pos: tuple[int, int]) -> dict:
    return {"id": uid(name), "name": name, "type": "n8n-nodes-base.code", "typeVersion": 2, "position": list(pos),
            "parameters": {"jsCode": (HERE / "src" / file).read_text(encoding="utf-8")}}


TELEGRAM_CHAT = "={{ $('Réglages').first().json.settings.telegram_chat_id }}"


def telegram(name: str, text: str, pos: tuple[int, int]) -> dict:
    return {"id": uid(name), "name": name, "type": "n8n-nodes-base.telegram", "typeVersion": 1.2,
            "position": list(pos),
            "parameters": {"chatId": TELEGRAM_CHAT, "text": text,
                           "additionalFields": {"appendAttribution": False, "disable_web_page_preview": True}}}


nodes = [
    {"id": uid("Candidats du radar"), "name": "Candidats du radar", "type": "n8n-nodes-base.webhook",
     "typeVersion": 2, "position": [0, 0], "webhookId": uid("webhook radar"),
     "parameters": {"httpMethod": "POST", "path": "radar-reactif", "authentication": "headerAuth",
                    "responseMode": "onReceived", "options": {}}},
    {"id": uid("Tendance repérée"), "name": "Tendance repérée", "type": "n8n-nodes-base.formTrigger",
     "typeVersion": 2.2, "position": [0, 220], "webhookId": uid("form tendance"),
     "parameters": {
         "authentication": "basicAuth",
         "formTitle": "Tendance repérée",
         "formDescription": "Une tendance vue sur TikTok, Instagram ou ailleurs. Le radar en prépare un brouillon, "
                            "que vous validerez avant toute publication.",
         "formFields": {"values": [
             {"fieldLabel": "Tendance (ce que vous avez vu)", "fieldType": "textarea", "requiredField": True},
             {"fieldLabel": "Lien (TikTok, Instagram…)", "fieldType": "text"},
             {"fieldLabel": "Pourquoi ça peut marcher ici", "fieldType": "textarea"},
         ]},
         "options": {}}},
    code("Réglages", "reglages.js", (240, 100)),
    code("Préparer la demande à Claude", "preparer.js", (480, 100)),
    {"id": uid("Claude : choisir et rédiger"), "name": "Claude : choisir et rédiger",
     "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [720, 100],
     "parameters": {
         "method": "POST", "url": "https://api.anthropic.com/v1/messages",
         "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
         "sendHeaders": True,
         "headerParameters": {"parameters": [
             {"name": "anthropic-version", "value": "2026-10-21"},
             {"name": "anthropic-beta", "value": "server-side-fallback-2026-07-01"},
         ]},
         "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.request) }}",
         "options": {"timeout": 180000}}},
    code("Lire la réponse", "lire_reponse.js", (960, 100)),
    telegram("Telegram : brouillon à valider",
             "={{ $json.message }}\n\nPour décider, ouvrez ce formulaire (valable 48 h) :\n{{ $execution.resumeFormUrl }}",
             (1200, 100)),
    {"id": uid("Attendre votre décision"), "name": "Attendre votre décision", "type": "n8n-nodes-base.wait",
     "typeVersion": 1.1, "position": [1440, 100], "webhookId": uid("wait decision"),
     "parameters": {
         "resume": "form",
         "formTitle": "Brouillon du radar",
         "formDescription": "Relisez le brouillon reçu sur Telegram, puis choisissez.",
         "formFields": {"values": [
             {"fieldLabel": "Décision", "fieldType": "dropdown", "requiredField": True,
              "fieldOptions": {"values": [{"option": "Programmer"}, {"option": "Rejeter"}]}},
         ]},
         "limitWaitTime": True, "limitType": "afterTimeInterval", "resumeAmount": 48, "resumeUnit": "hours",
         "options": {}}},
    code("Décision : Blotato", "decision_blotato.js", (1680, 0)),
    {"id": uid("Blotato : programmer"), "name": "Blotato : programmer", "type": "n8n-nodes-base.httpRequest",
     "typeVersion": 4.2, "position": [1920, 0],
     "parameters": {
         "method": "POST", "url": "https://backend.blotato.com/v2/posts",
         "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
         "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.blotato_request) }}",
         "options": {"timeout": 60000}}},
    telegram("Telegram : programmé",
             "=Programmé sur {{ $('Décision : Blotato').item.json.target_label }} au prochain créneau libre de Blotato."
             "\nSuivi : {{ $json.postSubmissionId }}",
             (2160, 0)),
    code("Décision : vous publiez", "decision_manuel.js", (1680, 220)),
    telegram("Telegram : à publier vous-même", "={{ $json.text }}", (1920, 220)),
    code("Alerte santé", "alerte_sante.js", (480, 320)),
    telegram("Telegram : alerte santé", "={{ $json.text }}", (720, 320)),
]


def link(*targets: str) -> dict:
    return {"main": [[{"node": t, "type": "main", "index": 0} for t in targets]]}


connections = {
    "Candidats du radar": link("Réglages"),
    "Tendance repérée": link("Réglages"),
    "Réglages": link("Préparer la demande à Claude", "Alerte santé"),
    "Préparer la demande à Claude": link("Claude : choisir et rédiger"),
    "Claude : choisir et rédiger": link("Lire la réponse"),
    "Lire la réponse": link("Telegram : brouillon à valider"),
    "Telegram : brouillon à valider": link("Attendre votre décision"),
    "Attendre votre décision": link("Décision : Blotato", "Décision : vous publiez"),
    "Décision : Blotato": link("Blotato : programmer"),
    "Blotato : programmer": link("Telegram : programmé"),
    "Décision : vous publiez": link("Telegram : à publier vous-même"),
    "Alerte santé": link("Telegram : alerte santé"),
}

workflow = {
    "name": "Radar : contenu réactif",
    "nodes": nodes,
    "connections": connections,
    "settings": {"executionOrder": "v1"},
    "pinData": {},
    "meta": {"templateCredsSetupCompleted": False},
}


def check(wf: dict) -> None:
    names = [n["name"] for n in wf["nodes"]]
    assert len(names) == len(set(names)), "noms de nœuds en double"
    for src, conn in wf["connections"].items():
        assert src in names, f"connexion depuis un nœud inconnu : {src}"
        for branch in conn["main"]:
            for c in branch:
                assert c["node"] in names, f"connexion vers un nœud inconnu : {c['node']}"
    referenced = {"Réglages", "Préparer la demande à Claude", "Lire la réponse", "Décision : Blotato"}
    assert referenced <= set(names), "un nœud référencé par $('…') n'existe pas"
    targets = {c["node"] for conn in wf["connections"].values() for b in conn["main"] for c in b}
    triggers = {"Candidats du radar", "Tendance repérée"}
    assert set(names) - targets == triggers, f"nœuds isolés : {set(names) - targets - triggers}"


if __name__ == "__main__":
    check(workflow)
    out = HERE / "radar-contenu-reactif.json"
    out.write_text(json.dumps(workflow, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{out.name} : {len(nodes)} nœuds, {sum(len(b) for c in connections.values() for b in c['main'])} liaisons")
