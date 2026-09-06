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
