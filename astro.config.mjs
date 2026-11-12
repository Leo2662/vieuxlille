// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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

  integrations: [
    sitemap({
      // /carte n'est qu'une redirection vers Canva, en noindex et canonique
      // vers la destination : l'annoncer aux moteurs les enverrait sur une
      // page qui leur dit aussitôt de ne pas la garder. /qr-code est une page
      // outil, servie en noindex elle aussi, comme la page de retour du
      // paiement d'une carte cadeau.
      // Comparaison sur le chemin exact : « /carte » ne doit pas écarter
      // /brunch/carte-cadeau/, la page de commande, qui reste indexée.
      filter: (page) =>
        !['/carte/', '/qr-code/', '/brunch/carte-cadeau/merci/'].includes(new URL(page).pathname),
      // Chaque page y renvoie à sa traduction : le français à la racine,
      // l'anglais sous /en/ (voir src/i18n.ts).
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr', en: 'en' },
      },
    }),
  ],
});
