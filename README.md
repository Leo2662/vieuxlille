# LÜM — Vieux-Lille

Landing page du Coffee Shop & Brunch Healthy LÜM Vieux-Lille,
94 rue Saint-André à Lille. Le second établissement, LÜM Lille Centre, a son
propre site : https://leo2662.github.io/lillecentre

En ligne : https://lumvieuxlille.fr

Une page d'accueil. Le menu est hébergé sur Canva, et `/carte` — qui portait
la carte braderie — y redirige.

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
├── layouts/BaseLayout.astro   # <head>, polices, réglages partagés
├── pages/index.astro          # page d'accueil
└── styles/global.css          # variables de design et composants de base
```

`public/` porte les fichiers recopiés tels quels dans `dist/` : le favicon, le
`CNAME` du domaine et le `robots.txt`.

## Référencement

`@astrojs/sitemap` génère `sitemap-index.xml` et `sitemap-0.xml` à chaque
build, à partir de `site` dans `astro.config.mjs`. `/carte` en est exclu par un
`filter` : ce n'est qu'une redirection vers le menu Canva, servie en `noindex`
avec une canonique vers la destination.

`public/robots.txt` déclare le sitemap. Sans cette ligne, il faut le soumettre
à la main dans la Search Console pour que Google le trouve.

## À confirmer — le site est déjà public

- **Les horaires** affichés sur l'accueil (mercredi → lundi, 10h – 18h).
- **Les liens externes.** Le menu pointe sur Canva et la réservation sur un
  autre dépôt Pages : ni l'un ni l'autre n'est vérifié par le build. Les
  cartes braderie et complète restent dans l'historique git.

## Déploiement

Chaque push sur `claude/lum-vieux-lille-site-fczgat` déclenche
`.github/workflows/deploy.yml`, qui construit le site et le publie sur
GitHub Pages, servi sur `lumvieuxlille.fr`.

Le domaine tient à `public/CNAME` : Astro recopie ce fichier dans `dist/`, et
c'est lui qui conserve le domaine personnalisé d'un déploiement à l'autre. Le
supprimer ferait retomber le site sur `leo2662.github.io/vieuxlille`.

Le premier run avait échoué : `actions/configure-pages` n'arrive pas à créer
le site Pages avec le seul `GITHUB_TOKEN` tant que Pages n'existe pas encore
sur le dépôt. Une fois Pages activé, le run suivant est passé et le site est
publié.

### L'incident du 6 septembre

Tant que la source Pages est restée sur « Deploy from a branch », GitHub a
lancé son ancien pipeline Jekyll (« pages build and deployment ») à chaque
push, **en plus** du nôtre. Il échouait systématiquement :

```
Invalid YAML front matter in /github/workspace/src/pages/carte.astro
```

Jekyll lisait le `---` d'Astro comme du front matter YAML. Cet échec était la
seule chose qui laissait notre déploiement Actions servir le site.

En supprimant `carte.astro` — devenu inutile avec la redirection de `/carte`
vers le menu Canva — cette protection accidentelle a sauté. Jekyll s'est mis
à réussir, à finir une douzaine de secondes après notre workflow, et à
publier le dépôt rendu par Jekyll : le plugin `jekyll-readme-index` affichait
le README en page d'accueil, à la place du site.

Le correctif est le réglage du dépôt, pas le code : **Settings → Pages →
Build and deployment → Source : GitHub Actions**. Avec cette source, le
pipeline Jekyll ne se déclenche plus du tout et la course disparaît.

⚠️ Deux fausses bonnes idées si le symptôme revient. Ajouter un `.nojekyll` à
la racine : Jekyll cesserait d'échouer mais servirait le dépôt brut, qui n'a
pas d'`index.html` à la racine — donc une 404. Et remettre un fichier
`.astro` cassé pour refaire échouer Jekyll : ça marche, mais le site ne tient
alors que par un build en échec.
