// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Servi sur son propre domaine : pas de `base`, les chemins partent de la
  // racine. Le domaine est déclaré dans public/CNAME, que le build recopie
  // dans dist/ à chaque déploiement — sans ce fichier, GitHub Pages perdrait
  // le domaine personnalisé au déploiement suivant.
  site: 'https://lumvieuxlille.fr',
});
