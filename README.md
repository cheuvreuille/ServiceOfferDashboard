# Identity.ai — Service Offer Dashboard

Dashboard web autonome contenu intégralement dans le seul fichier `index.html`, composé de cinq espaces indépendants : **Suivi prospection**, **Suivi mission**, **Suivi stage**, **Suivi expertise** et **Publication et Communication**. Chaque espace dispose de ses propres KPI et de son tableau intégralement éditable, construit avec les colonnes et types de champs métier demandés.

L’interface utilise une palette hybride Wavestone et technologique : violet nuit, violet de marque, interactions violet électrique et vert réservé aux actions positives, leads, missions et indicateurs clés.

Les titres des colonnes sont centrés et affichés en majuscules. Chaque colonne dispose de son propre filtre : les listes utilisent les valeurs métier disponibles et les champs texte permettent une recherche partielle. Le bouton **×** situé à droite de la ligne de filtres efface tous les filtres de l’onglet actif.

Dans le suivi prospection, les groupes **AI4IAM** et **IAM4AI** apparaissent avant les groupes **ai contact** et **dpai contact**. La colonne **Commentaire** utilise une zone de texte multiligne éditable.

La colonne **Interêt** du suivi prospection permet de qualifier chaque entreprise avec l’une des valeurs `0%`, `25%`, `50%`, `75%` ou `100%`.

L’espace **Publication et Communication** suit les sujets, formats, dates cibles, statuts, porteurs, consultants, mots-clés et liens des contenus à publier.

Les changements sont enregistrés automatiquement dans le `localStorage` du navigateur lorsqu’il est disponible. Dans un aperçu SharePoint sandboxé qui interdit cet accès, le dashboard bascule automatiquement en **session temporaire** : toutes les fonctions restent utilisables, mais les données doivent être exportées avant de fermer la page.

## Import et export Excel

Le partage entre utilisateurs repose uniquement sur un fichier Excel global :

- **Exporter Excel** télécharge un classeur `.xls` contenant cinq onglets : `Suivi prospection`, `Suivi mission`, `Suivi stage`, `Suivi expertise` et `Publication et Communication` ;
- **Importer Excel** relit les cinq onglets de ce classeur et restaure toutes leurs lignes dans le dashboard ;
- l’import vérifie la présence des cinq onglets et les intitulés de toutes les colonnes avant de remplacer les données locales ;
- un fichier invalide ou incomplet ne modifie aucune donnée existante.

Lorsqu’il est autorisé par le navigateur, **Exporter Excel** ouvre une boîte de dialogue permettant de choisir le dossier et le nom du fichier — l’utilisateur peut donc sélectionner le dossier contenant `index.html`. Un aperçu SharePoint sandboxé peut interdire ce sélecteur ; dans ce cas, l’application revient automatiquement au téléchargement navigateur via un Blob et un lien temporaire ciblant une nouvelle fenêtre. La destination de ce téléchargement de secours dépend alors des réglages du navigateur. Edge historique et Internet Explorer conservent une voie dédiée via `msSaveOrOpenBlob`.

Pour partager les données, un utilisateur exporte le fichier global puis le transmet à un autre utilisateur, qui l’importe depuis le dashboard.

## Lancer localement

```bash
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000). Le fichier `index.html` peut également être ouvert directement dans un navigateur, sans installation ni compilation.

## Publier le dashboard

Le dépôt contient un workflow GitHub Pages qui publie automatiquement le dashboard à chaque push sur `main` ou `work`. Il peut aussi être lancé manuellement depuis l’onglet **Actions** de GitHub.

Pour la première publication :

1. ouvrir **Settings → Pages** dans le dépôt GitHub ;
2. sélectionner **GitHub Actions** dans **Build and deployment → Source** ;
3. pousser les changements sur `main` ou `work`, ou lancer l’action **Publier le dashboard** manuellement ;
4. récupérer l’adresse publique affichée dans l’environnement `github-pages` à la fin du déploiement.

Le site publié reste entièrement statique : les données sont conservées dans le `localStorage` de chaque navigateur et ne deviennent pas publiques. Pour transmettre les tableaux à un autre utilisateur, utiliser **Exporter Excel**, puis lui faire importer le fichier avec **Importer Excel**.

## Publier une release

Une release GitHub peut être publiée en poussant un tag de version :

```bash
git tag v1.0.0
git push origin v1.0.0
```

Le workflow **Publier une release** crée automatiquement une release GitHub contenant :

- le fichier autonome `index.html` ;
- une archive `identity-ai-dashboard-v1.0.0.zip` avec le dashboard et sa documentation ;
- le fichier `SHA256SUMS.txt` permettant de vérifier l’intégrité des téléchargements.

La publication peut aussi être lancée depuis **Actions → Publier une release → Run workflow** en renseignant une version au format `v1.2.3`.
