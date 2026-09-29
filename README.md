# Identity.ai — Service Offer Dashboard

Dashboard web statique composé de quatre espaces indépendants : **Suivi prospection**, **Suivi mission**, **Suivi stage** et **Suivi expertise**. Chaque espace dispose de ses propres KPI et de son tableau intégralement éditable, construit avec les colonnes et types de champs métier demandés.

Les changements sont enregistrés automatiquement dans le `localStorage` du navigateur. Le bouton **Sauvegarder en fichier Excel** exporte uniquement le tableau de l’onglet actif dans un fichier `.xls` lisible par Excel.
Dashboard web statique de pilotage commercial pour l’offre Identity.ai. Il permet de suivre les comptes cibles, les opportunités IAM4IA et IA4IAM et les liens vers les ressources business. Chaque axe d’offre dispose d’un statut et de contacts Wavestone et client directement éditables dans le tableau. Les modifications mettent immédiatement à jour les indicateurs, sont conservées dans le navigateur et peuvent être exportées dans un fichier JSON local.

## Lancer localement

```bash
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).
