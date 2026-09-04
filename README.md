# LÜM — Vieux-Lille

Landing page du Coffee Shop & Brunch Healthy LÜM Vieux-Lille,
94 rue Saint-André à Lille. Le second établissement, LÜM Lille Centre, a son
propre site : https://leo2662.github.io/lillecentre

En ligne : https://leo2662.github.io/vieuxlille/

Deux pages — l'accueil et la carte, réduite à l'offre de la braderie des
5 & 6 septembre.

## Stack

- [Astro](https://astro.build) 7 (sortie statique)
- CSS natif, sans framework, avec variables de design dans `src/styles/global.css`
- Polices auto-hébergées via Fontsource (aucune requête vers un CDN tiers)

## Démarrer

```bash
npm install
npm run dev      # serveur de dev sur http://localhost:4321
npm run build    # génère le site statique dans dist/
npm run preview  # prévisualise le build
```

## Direction artistique

Même grammaire visuelle que LÜM Lille Centre — reprise du visuel
« Une foccacia ? » — déclinée dans la terre cuite du Vieux-Lille :

| Rôle | Valeur |
|---|---|
| Terre cuite (encre, fonds) | `#944826` |
| Terre cuite claire (filets, bordures) | `#C4714A` |
| Brun chaud (texte atténué) | `#5C3D2E` |
| Crème (fonds de blocs) | `#F9F1E6` |
| Titres affiche | Anton, capitales |
| Texte courant et boutons | Nunito |
| Accents manuscrits | Caveat |

Les formes reprennent l'affiche : angles arrondis, traits épais de 3 px,
cartouches de titre qui chevauchent les blocs, boutons en pilule et
illustrations au trait.

## Structure

```
src/
├── components/Entete.astro    # logo + retour, en tête des pages intérieures
├── data/carte.ts              # source unique de la carte
├── layouts/BaseLayout.astro   # <head>, polices, réglages partagés
├── pages/index.astro          # page d'accueil
├── pages/carte.astro          # la carte
└── styles/global.css          # variables de design et composants de base
```

## À confirmer — le site est déjà public

- **Les horaires** affichés sur l'accueil (mercredi → lundi, 10h – 18h).
- **La carte après la braderie.** Elle est réduite à l'offre des 5 & 6
  septembre. L'ancienne carte complète — focaccias, pâtisseries, boissons,
  barista, formules — est dans l'historique git, avec le rendu des formules en
  cartes que `carte.astro` ne porte plus.
- **Le domaine.** Le site sort aujourd'hui sur
  `leo2662.github.io/vieuxlille`. Pour le servir sur `lumvieuxlille.fr`,
  remettre `site` sur ce domaine dans `astro.config.mjs`, supprimer `base`, et
  ajouter un fichier `public/CNAME`.

## Déploiement

Chaque push sur `claude/lum-vieux-lille-site-fczgat` déclenche
`.github/workflows/deploy.yml`, qui construit le site et le publie sur
GitHub Pages.

Le premier run avait échoué : `actions/configure-pages` n'arrive pas à créer
le site Pages avec le seul `GITHUB_TOKEN` tant que Pages n'existe pas encore
sur le dépôt. Une fois Pages activé, le run suivant est passé et le site est
publié.

En parallèle, GitHub lance son ancien pipeline Jekyll
(« pages build and deployment »), qui échoue à chaque push :

```
Invalid YAML front matter in /github/workspace/src/pages/carte.astro
```

Jekyll essaie de lire les blocs `---` d'Astro comme du front matter YAML.
Ces échecs ne touchent pas le site en ligne — le pipeline meurt avant de
publier, donc c'est bien le déploiement Actions qui sert. Ils signalent
seulement que la source Pages est restée sur une branche.

Pour les faire disparaître : **Settings → Pages → Build and deployment →
Source : GitHub Actions**.

⚠️ Ne pas « corriger » ça en ajoutant un fichier `.nojekyll` à la racine :
Jekyll cesserait d'échouer, et l'ancien pipeline publierait alors le dépôt
brut (`src/`, `package.json`, `README.md`) par-dessus le site construit.
