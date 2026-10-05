# Identity.ai — Service Offer Dashboard

Dashboard web statique composé de quatre espaces indépendants : **Suivi prospection**, **Suivi mission**, **Suivi stage** et **Suivi expertise**. Chaque espace dispose de ses propres KPI et de son tableau intégralement éditable, construit avec les colonnes et types de champs métier demandés.

Dans le suivi prospection, les groupes **AI4IAM** et **IAM4AI** apparaissent avant les groupes **ai contact** et **dpai contact**. La colonne **Commentaire** utilise une zone de texte multiligne éditable.

Les changements sont enregistrés automatiquement dans le `localStorage` du navigateur. Le bouton **Sauvegarder en fichier Excel** exporte uniquement le tableau de l’onglet actif dans un fichier `.xls` lisible par Excel.

## Synchronisation avec un fichier Excel SharePoint

Le bouton **Lier un Excel SharePoint** associe séparément chaque onglet à un classeur `.xlsx` hébergé sur SharePoint. Il accepte directement le lien de partage SharePoint et utilise Microsoft Graph pour lire et modifier les cellules du classeur :

- les changements du tableau sont envoyés au fichier après 700 ms ;
- le fichier est relu automatiquement toutes les 5, 15, 30 ou 60 secondes ;
- les en-têtes du fichier doivent correspondre exactement à ceux de l’onglet ;
- une feuille peut être indiquée ; à défaut, la première feuille du classeur est utilisée ;
- avant chaque écriture, le dashboard vérifie que le contenu distant n’a pas changé afin de ne pas écraser une modification SharePoint.

La synchronisation nécessite un **jeton d’accès Microsoft Graph** autorisé à lire et modifier le classeur. Ce jeton n’est jamais écrit dans le `localStorage` : il reste uniquement en mémoire et doit être renseigné à nouveau après le rechargement de la page. Le lien SharePoint, le nom de la feuille et la fréquence de lecture restent enregistrés localement.

## Lancer localement

```bash
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).
