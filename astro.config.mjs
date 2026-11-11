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

  // L'ancienne carte braderie vivait sur /carte. On la redirige vers /menu :
  // les liens déjà partagés continuent d'aboutir.
  redirects: {
    '/carte': '/menu',
  },

  integrations: [
    sitemap({
      // /carte n'est qu'une redirection vers /menu, en noindex et canonique
      // vers la destination : l'annoncer aux moteurs les enverrait sur une
      // page qui leur dit aussitôt de ne pas la garder. /qr-code est une page
      // outil, et /afterwork/reservation une étape du parcours de paiement :
      // toutes deux servies en noindex elles aussi, comme la page de retour du
      // paiement d'une carte cadeau.
      // Comparaison sur le chemin exact : « /carte » ne doit pas écarter
      // /brunch/carte-cadeau/, la page de commande, qui reste indexée.
      filter: (page) =>
        ![
          '/carte/',
          '/qr-code/',
          '/afterwork/reservation/',
          '/brunch/carte-cadeau/merci/',
        ].includes(new URL(page).pathname),
      // Chaque page y renvoie à sa traduction : le français à la racine,
      // l'anglais sous /en/ (voir src/i18n.ts).
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr', en: 'en' },
      },
    }),
  ],
});
