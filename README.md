# LÜM — Vieux-Lille

Landing page du Coffee Shop & Brunch Healthy LÜM Vieux-Lille,
94 rue Saint-André à Lille. Le second établissement, LÜM Lille Centre, a son
propre site : https://leo2662.github.io/lillecentre

En ligne : https://lumvieuxlille.fr

Une page d'accueil, une page `/menu` et une page `/afterwork`, qui vend la
privatisation du jeudi soir. `/carte` — qui portait la carte braderie —
redirige vers `/menu`.

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

### Élévation

Les blocs crème flottent au-dessus de la terre cuite. Trois niveaux d'ombres,
déclarés dans `global.css`, superposent chacun une ombre de contact et une
ombre diffuse, teintées brun très foncé — une ombre terre cuite ne se voit
pas sur un fond terre cuite :

| Niveau | Variable | Pour |
|---|---|---|
| 1 — posé | `--elevation-1` | boutons pleins, pastilles |
| 2 — détaché | `--elevation-2` | bannière, cartouches, barre d'onglets, onglet choisi |
| 3 — flottant | `--elevation-3` | cartes de contenu |

Les cartes crème ajoutent `--edge-light`, un liseré clair sur l'arête haute.
Seul ce qui est cliquable bouge : au survol, boutons et onglets montent de
2 px (`--lift`) et prennent le niveau 2, puis redescendent à l'appui. Ce
soulèvement est réservé aux appareils à survol, pour qu'il ne reste pas collé
après un toucher sur mobile.

## Structure

```
src/
├── components/Entete.astro    # logo et retour, en tête des pages intérieures
├── components/Trinquer.astro  # deux verres qui trinquent, emblème de l'afterwork
├── data/menu.ts               # contenu et prix du menu
├── layouts/BaseLayout.astro   # <head>, polices, réglages partagés
├── lib/qr.ts                  # cibles des QR codes et leur rendu SVG
├── pages/index.astro          # page d'accueil
├── pages/menu.astro           # le menu, selon le jour
├── pages/afterwork.astro      # page de vente de l'afterwork privatisé
├── pages/qr-code.astro        # les QR codes, à télécharger
├── pages/[slug].svg.ts        # un fichier .svg par QR, écrit au build
└── styles/global.css          # variables de design et composants de base
```

`public/` porte les fichiers recopiés tels quels dans `dist/` : le favicon, le
`CNAME` du domaine et le `robots.txt`.

## Menu

`/menu` présente une rubrique à la fois, derrière une barre d'onglets :
Petit déj et Déjeuner en semaine, Brunch le week-end, puis Barista, Boissons
et À la carte tous les jours. Le contenu, les prix et les horaires sont dans
`src/data/menu.ts`.

Le site est statique : le jour et l'heure ne peuvent pas être fixés au build.
Un script inline, placé juste après le menu, les lit **à l'heure de Paris**
avant le premier affichage, et :

- ne garde dans la barre que les formules du jour (semaine ou week-end) ;
- ouvre la formule servie en ce moment ou plus tard dans la journée, sinon la
  première du jour ;
- marque d'un point les formules servies à l'heure qu'il est (« En ce
  moment »), d'après le `service` de chaque rubrique. Le mardi, jour de
  fermeture, n'en allume aucun.

Un lien sous la rubrique passe aux formules de l'autre moment. Chaque onglet a
son ancre : `/menu#brunch` ouvre directement le brunch, même un jeudi. Sans
JavaScript, les onglets restent des ancres et toutes les rubriques
s'affichent à la suite.

## Afterwork

Sur l'accueil, une carte cliquable en tête de page mène à `/afterwork`, la
page de vente de la privatisation : tous les jeudis, de 18h30 à 22h30.
Accroche, atouts du lieu, occasions, déroulé en trois étapes, infos
pratiques, puis un dernier appel à l'action.

Le site n'a pas de serveur : on réserve par téléphone ou en message privé
Instagram (`ig.me/m/lum_vieuxlille`, qui ouvre la conversation directement).

Le texte ne promet que ce qui est acquis — le créneau, l'adresse, l'esprit du
lieu. La capacité, le tarif et le contenu de la soirée sont à faire confirmer
par la boutique avant de les y écrire.

## QR codes

`/qr-code` affiche les codes et propose leur téléchargement. Image affichée et
fichier téléchargé sortent du même appel dans `src/lib/qr.ts` : ils ne peuvent
pas diverger de l'URL réelle. Les boutons pointent sur des `.svg` écrits dans
`dist/` au build, donc le téléchargement ne dépend d'aucun JavaScript.

Le niveau de correction d'erreur est réglé **par code**, et mesuré en décodant
le rendu à différentes tailles :

| Code | Niveau | Modules | Lisible dès |
|---|---|---|---|
| Site | `H` | 29×29 | 80 px |
| Avis Google | `M` | 37×37 | 80 px |

L'URL d'avis est longue : en `Q` elle passe à 45×45 et en `H` à 49×49, et le
code devient alors trop dense pour être lu sous 160 px. `M` garde une marge de
correction correcte tout en restant lisible en petit. Changer une cible sans
refaire cette mesure, c'est risquer un code qui ne scanne plus à l'impression.

## Mesure d'audience

`BaseLayout` charge le beacon Cloudflare Web Analytics en fin de `<body>`, sur
toutes les pages. Le `<script>` porte `is:inline` : sans lui Astro le passerait
dans son bundler, ce qui réécrirait le `src` et perdrait `data-cf-beacon`.

Le jeton est un identifiant de site public, destiné à figurer dans le HTML —
ce n'est pas un secret. La mesure est sans cookie.

## Référencement

`@astrojs/sitemap` génère `sitemap-index.xml` et `sitemap-0.xml` à chaque
build, à partir de `site` dans `astro.config.mjs`. Deux pages en sont exclues
par un `filter` : `/carte`, qui n'est qu'une redirection vers `/menu`
servie en `noindex` avec une canonique vers la destination, et `/qr-code`, page
outil servie en `noindex` via la propriété du même nom de `BaseLayout`.

`public/robots.txt` déclare le sitemap. Sans cette ligne, il faut le soumettre
à la main dans la Search Console pour que Google le trouve.

`public/llms.txt` suit la convention du même nom : un résumé du lieu et les
liens utiles, pour les modèles de langage. C'est une convention proposée, pas
un standard — Google a annoncé ne pas s'en servir. Le fichier redit l'adresse
et les horaires déjà présents dans `index.astro` et dans le JSON-LD de
`BaseLayout` : les trois sont à modifier ensemble.

`BaseLayout.astro` émet une fiche JSON-LD `CafeOrCoffeeShop` : nom, adresse,
coordonnées GPS, téléphone, fourchette de prix, horaires, menu et réseaux.

Il manque `image`, faute de photo hébergée — c'est l'ajout qui reste le plus
utile pour une fiche locale. N'y mettre que des valeurs fournies par la
boutique : un balisage structuré est repris tel quel dans les résultats de
recherche, donc une valeur inventée y coûte plus cher qu'un champ absent.

## À confirmer — le site est déjà public

- **Les horaires** affichés sur l'accueil (mercredi → lundi, 10h – 18h).
- **Le menu.** Les articles et les prix reprennent la carte du 4 septembre,
  aux prix de Lille Centre. La formule brunch n'a encore ni composition ni
  prix. Le menu Canva de la boutique n'est plus lié depuis le site.
- **L'afterwork.** La page `/afterwork` dit « on prépare la soirée avec
  vous » et cite « boissons, de quoi grignoter » : à valider avec la boutique,
  comme le numéro de téléphone pour les demandes de privatisation.
- **Le lien de réservation**, qui pointe sur un autre dépôt Pages : le build
  ne le vérifie pas. Les cartes braderie et complète restent dans
  l'historique git.

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
