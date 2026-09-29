# Identity.ai — Service Offer Dashboard

Dashboard web statique composé de quatre espaces indépendants : **Suivi prospection**, **Suivi mission**, **Suivi stage** et **Suivi expertise**. Chaque espace dispose de ses propres KPI et de son tableau intégralement éditable, construit avec les colonnes et types de champs métier demandés.

Les changements sont enregistrés automatiquement dans le `localStorage` du navigateur. Le bouton **Sauvegarder en fichier Excel** exporte uniquement le tableau de l’onglet actif dans un fichier `.xls` lisible par Excel.

## Lancer localement

```bash
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).
