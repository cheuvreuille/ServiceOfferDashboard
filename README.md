# Identity.ai — Service Offer Dashboard

Dashboard web statique composé de quatre espaces indépendants : **Suivi prospection**, **Suivi mission**, **Suivi stage** et **Suivi expertise**. Chaque espace dispose de ses propres KPI et de son tableau intégralement éditable, construit avec les colonnes et types de champs métier demandés.

Dans le suivi prospection, les groupes **AI4IAM** et **IAM4AI** apparaissent avant les groupes **ai contact** et **dpai contact**. La colonne **Commentaire** utilise une zone de texte multiligne éditable.

Les changements sont enregistrés automatiquement dans le `localStorage` du navigateur.

## Import et export Excel

Le partage entre utilisateurs repose uniquement sur un fichier Excel global :

- **Exporter Excel** télécharge un classeur `.xls` contenant quatre onglets : `Suivi prospection`, `Suivi mission`, `Suivi stage` et `Suivi expertise` ;
- **Importer Excel** relit les quatre onglets de ce classeur et restaure toutes leurs lignes dans le dashboard ;
- l’import vérifie la présence des quatre onglets et les intitulés de toutes les colonnes avant de remplacer les données locales ;
- un fichier invalide ou incomplet ne modifie aucune donnée existante.

Pour partager les données, un utilisateur exporte le fichier global puis le transmet à un autre utilisateur, qui l’importe depuis le dashboard.

## Lancer localement

```bash
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).

## Publier le dashboard

Le dépôt contient un workflow GitHub Pages qui publie automatiquement le dashboard à chaque push sur `main` ou `work`. Il peut aussi être lancé manuellement depuis l’onglet **Actions** de GitHub.

Pour la première publication :

1. ouvrir **Settings → Pages** dans le dépôt GitHub ;
2. sélectionner **GitHub Actions** dans **Build and deployment → Source** ;
3. pousser les changements sur `main` ou `work`, ou lancer l’action **Publier le dashboard** manuellement ;
4. récupérer l’adresse publique affichée dans l’environnement `github-pages` à la fin du déploiement.

Le site publié reste entièrement statique : les données sont conservées dans le `localStorage` de chaque navigateur et ne deviennent pas publiques. Pour transmettre les tableaux à un autre utilisateur, utiliser **Exporter Excel**, puis lui faire importer le fichier avec **Importer Excel**.
