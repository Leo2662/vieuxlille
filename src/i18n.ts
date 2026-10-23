// Le site existe en français, à la racine, et en anglais, sous /en/. Chaque
// page traduite est un composant qui reçoit la langue ; les fichiers de
// src/pages/ ne font que l'appeler.

export const langues = ['fr', 'en'] as const;

export type Langue = (typeof langues)[number];

/**
 * Adresse d'une page dans chaque langue. `page` est le chemin sans la
 * langue, avec sa barre finale : '' pour l'accueil, 'brunch/' pour le brunch.
 * Les adresses finissent par « / », comme celles du sitemap : GitHub Pages
 * redirige sinon /brunch vers /brunch/.
 */
export function chemins(page: string): Record<Langue, string> {
  return {
    fr: `/${page}`,
    en: `/en/${page}`,
  };
}
