# Identity.ai — Service Offer Dashboard

Dashboard web statique composé de quatre espaces indépendants : **Suivi prospection**, **Suivi mission**, **Suivi stage** et **Suivi expertise**. Chaque espace dispose de ses propres KPI et de son tableau intégralement éditable, construit avec les colonnes et types de champs métier demandés.

Dans le suivi prospection, les groupes **AI4IAM** et **IAM4AI** apparaissent avant les groupes **ai contact** et **dpai contact**. La colonne **Commentaire** utilise une zone de texte multiligne éditable.

Les changements sont enregistrés automatiquement dans le `localStorage` du navigateur. Le bouton **Sauvegarder en fichier Excel** exporte uniquement le tableau de l’onglet actif dans un fichier `.xls` lisible par Excel.

## Synchronisation avec un fichier Excel

Le bouton **Lier un fichier Excel** associe séparément chaque onglet à l’URL directe d’un fichier Excel XML (`.xls`) :

- les changements du tableau sont envoyés au fichier après 700 ms ;
- le fichier est relu automatiquement toutes les 5, 15, 30 ou 60 secondes ;
- les en-têtes du fichier doivent correspondre exactement à ceux de l’onglet ;
- les `ETag` HTTP sont utilisés, lorsqu’ils sont disponibles, pour éviter d’écraser une modification distante concurrente.

Le serveur qui héberge le fichier doit accepter les méthodes HTTP `GET` et `PUT`, exposer le fichier directement (et non une page de prévisualisation) et autoriser ces requêtes avec CORS. Un simple lien SharePoint ou OneDrive de consultation ne donne généralement pas de droit d’écriture HTTP : il faut alors fournir une URL WebDAV, une URL signée autorisant `PUT`, ou un connecteur Microsoft Graph configuré côté serveur.

## Lancer localement

```bash
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).
