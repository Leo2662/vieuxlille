# LÜM — Vieux-Lille

Landing page du coffee shop, brunch healthy et salon de thé LÜM Vieux-Lille,
94 rue Saint-André à Lille. Le second établissement, LÜM Lille Centre, a son
propre site : https://leo2662.github.io/lillecentre

État actuel : initialisation du projet — une page « hello world » qui pose la
direction artistique et les fondations techniques.

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
├── data/carte.ts              # source unique de la carte et des formules
├── layouts/BaseLayout.astro   # <head>, polices, réglages partagés
├── pages/index.astro          # page d'accueil
├── pages/carte.astro          # la carte
└── styles/global.css          # variables de design et composants de base
```

## À vérifier avant mise en ligne

- **Les prix de `src/data/carte.ts`.** La carte reprend la gamme commune à LÜM
  (celle affichée sur le site de Lille Centre) et y ajoute les signatures du
  Vieux-Lille : élixirs, café MUDA, matchas, kombucha Goodsky. Les prix des
  lignes propres au Vieux-Lille sont posés dans la même fourchette que ceux de
  Lille Centre — à confirmer.
- **Les horaires** affichés sur l'accueil (mercredi → lundi, 10h – 18h).
- **Le lien TikTok.** Aucun compte TikTok Vieux-Lille n'a été trouvé : le second
  bouton de l'accueil pointe pour l'instant vers l'itinéraire Google Maps.
- **Le domaine.** Pour servir le site sur `lumvieuxlille.fr`, remettre `site`
  sur ce domaine dans `astro.config.mjs`, supprimer `base`, et ajouter un
  fichier `public/CNAME`.
