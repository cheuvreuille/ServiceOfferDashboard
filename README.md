# Identity.ai — Service Offer Dashboard

Dashboard web statique composé de quatre espaces indépendants : **Suivi prospection**, **Suivi mission**, **Suivi stage** et **Suivi expertise**. Chaque espace dispose de ses propres KPI et de son tableau intégralement éditable, construit avec les colonnes et types de champs métier demandés.

L’interface conserve son identité visuelle originale, sobre et professionnelle, fondée sur des tons bleu nuit et violet. Les titres de colonnes sont centrés et affichés en majuscules.

Chaque colonne possède son propre filtre sous son intitulé. Les listes proposent leurs valeurs métier et les champs texte acceptent une recherche partielle. Le bouton **×** en bout de ligne efface tous les filtres de l’onglet actif ; la recherche générale reste disponible en complément.

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
