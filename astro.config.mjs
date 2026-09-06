// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Servi sur son propre domaine : pas de `base`, les chemins partent de la
  // racine. Le domaine est déclaré dans public/CNAME, que le build recopie
  // dans dist/ à chaque déploiement — sans ce fichier, GitHub Pages perdrait
  // le domaine personnalisé au déploiement suivant.
  site: 'https://lumvieuxlille.fr',

  // L'ancienne carte braderie vivait sur /carte. Le menu étant passé sur
  // Canva, on y redirige : les liens déjà partagés continuent d'aboutir.
  redirects: {
    '/carte': 'https://xn--lm-xka.my.canva.site/l-m/menu',
  },
});
