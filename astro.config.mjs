// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Déploiement sur GitHub Pages : le site est servi depuis un sous-dossier
  // portant le nom du dépôt. Avec le nom de domaine lumvieuxlille.fr,
  // remettre `site` sur ce domaine et supprimer `base`.
  site: 'https://leo2662.github.io',
  base: '/vieuxlille',
});
