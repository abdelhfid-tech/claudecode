# Guide d'Installation des Extensions PDF pour Google Forms

## 🎯 Objectif

Permettre l'export automatique des réponses du formulaire en PDF pour pouvoir les télécharger et les partager via WhatsApp.

---

## Méthode 1 : Form Publisher (Recommandée - La plus simple)

### Installation

1. **Ouvrez votre Google Form**
2. **Cliquez sur les trois points** en haut à droite (⋮)
3. **Sélectionnez "Modules complémentaires"** > **"Obtenir des modules complémentaires"**
4. **Recherchez "Form Publisher"** dans le Marketplace
5. **Cliquez sur "Installer"**
6. **Autorisez les permissions** demandées

### Configuration

1. **Ouvrez Form Publisher** depuis le menu Modules complémentaires
2. **Créez un nouveau modèle** :
   - Choisissez "Google Docs" comme format
   - Sélectionnez "Une réponse = un document"
3. **Configurez l'export PDF** :
   - Format : PDF
   - Destination : Google Drive
   - Notification : Email quand le PDF est généré
4. **Activez l'export automatique** à chaque nouvelle réponse

### Utilisation

- Chaque fois que vos parents remplissent le formulaire, un PDF est automatiquement créé dans votre Google Drive
- Vous recevez une notification par email
- Téléchargez le PDF et partagez-le via WhatsApp

### Coût

- Version gratuite : 10 exports/mois
- Version payante : $15/an pour exports illimités

---

## Méthode 2 : Autocrat (Alternative gratuite)

### Installation

1. **Ouvrez votre Google Form**
2. **Modules complémentaires** > **"Obtenir des modules complémentaires"**
3. **Recherchez "Autocrat"**
4. **Installez et autorisez**

### Configuration

1. **Ouvrez Autocrat** depuis Modules complémentaires
2. **New Merge Job**
3. **Créez un template** dans Google Docs avec les champs du formulaire
4. **Configurez** :
   - Format de sortie : PDF
   - Déclencheur : À chaque nouvelle réponse
5. **Lancez le job**

---

## Méthode 3 : Export Manuel (Sans extension)

Si vous ne voulez pas installer d'extension :

### Étapes

1. **Attendez la réponse** de vos parents
2. **Ouvrez Google Forms** > **Réponses**
3. **Cliquez sur les trois points** à côté du nom du répondant
4. **Sélectionnez "Imprimer"**
5. **Dans la fenêtre d'impression** :
   - Destination : Enregistrer au format PDF
   - Mise en page : Portrait
6. **Enregistrez le PDF**
7. **Partagez via WhatsApp**

---

## Méthode 4 : Google Apps Script (Pour développeurs)

Si vous êtes à l'aise avec le code :

### Étapes

1. **Ouvrez Google Forms** > **Réponses** > **Lien vers Sheets**
2. **Dans Google Sheets** > **Extensions** > **Apps Script**
3. **Copiez ce script** :

```javascript
function createPDFonFormSubmit(e) {
  // ID de votre Google Doc template
  var templateId = 'VOTRE_TEMPLATE_ID';

  // Créer une copie du template
  var docCopy = DriveApp.getFileById(templateId).makeCopy();
  var doc = DocumentApp.openById(docCopy.getId());
  var body = doc.getBody();

  // Remplacer les placeholders avec les réponses
  var responses = e.namedValues;
  for (var key in responses) {
    body.replaceText('{{' + key + '}}', responses[key][0]);
  }

  doc.saveAndClose();

  // Convertir en PDF
  var pdf = docCopy.getAs('application/pdf');

  // Sauvegarder dans un dossier spécifique
  var folder = DriveApp.getFolderById('VOTRE_FOLDER_ID');
  folder.createFile(pdf).setName('Réponse_' + new Date().toISOString() + '.pdf');

  // Supprimer le doc temporaire
  docCopy.setTrashed(true);

  // Envoyer email de notification
  MailApp.sendEmail({
    to: 'votre.email@example.com',
    subject: 'Nouvelle réponse au questionnaire',
    body: 'Un nouveau PDF a été généré dans votre Drive.'
  });
}

function setupTrigger() {
  var form = FormApp.getActiveForm();
  ScriptApp.newTrigger('createPDFonFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
}
```

4. **Créez un Google Doc template** avec des placeholders comme {{Question 1}}, {{Question 2}}, etc.
5. **Remplacez les IDs** dans le script
6. **Exécutez setupTrigger()** une fois
7. **Autorisez les permissions**

---

## 🎯 Recommandation

**Pour votre cas d'usage** (questionnaire familial, une ou deux réponses attendues) :

👉 **Utilisez la Méthode 3 (Export Manuel)**

**Pourquoi ?**
- ✅ Gratuit et simple
- ✅ Pas besoin d'apprendre de nouvelles extensions
- ✅ Contrôle total sur quand exporter
- ✅ Pas de problème de permissions ou de configuration

**Si vous attendez beaucoup de réponses** → Utilisez Form Publisher (Méthode 1)

---

## 📱 Partage via WhatsApp

Une fois le PDF créé :

### Sur ordinateur :
1. **Ouvrez WhatsApp Web** (web.whatsapp.com)
2. **Sélectionnez la conversation** avec vos parents
3. **Cliquez sur le trombone** (📎)
4. **Sélectionnez "Document"**
5. **Choisissez votre PDF**
6. **Envoyez**

### Sur téléphone :
1. **Téléchargez le PDF** depuis Google Drive sur votre téléphone
2. **Ouvrez WhatsApp**
3. **Conversation avec vos parents**
4. **Trombone** > **Document**
5. **Sélectionnez le PDF** et envoyez

---

## ❓ FAQ

**Q : Le PDF est trop long, comment le raccourcir ?**
R : Dans l'impression, sélectionnez seulement certaines sections ou réduisez la taille de la police.

**Q : Puis-je personnaliser l'apparence du PDF ?**
R : Oui, avec Form Publisher ou Apps Script, vous pouvez créer des templates personnalisés.

**Q : Le PDF ne s'envoie pas sur WhatsApp (trop gros)**
R : Compressez le PDF avec un outil comme smallpdf.com ou ilovepdf.com

**Q : Puis-je avoir plusieurs PDFs (un par section) ?**
R : Oui, avec Apps Script, vous pouvez créer plusieurs PDFs à partir d'un même formulaire.

---

**Besoin d'aide ?** N'hésitez pas à demander ! 🚀
