// L'offre afterwork, en un seul endroit : la page de vente (/afterwork) et
// la page de paiement (/afterwork/reservation) lisent toutes deux ce fichier.
// Changer le prix ici change aussi le total calculé au paiement.

export const PRIX_PAR_PERSONNE = 29;
export const CAPACITE = 20;
/** Nombre de personnes proposé d'emblée sur la page de paiement. */
export const PERSONNES_PAR_DEFAUT = 10;
export const CRENEAU = '18h30 – 22h30';

/** Ce que comprend le prix, dans l'ordre de la carte de l'offre. */
export const inclus = [
  {
    titre: 'Zéro charge mentale',
    texte: 'Vous réservez, on s’occupe du reste : rien à prévoir, rien à organiser.',
  },
  {
    titre: 'Une expérience généreuse',
    texte: 'Bière, planche apéro, planche dînatoire et planche dessert.',
  },
  {
    titre: '1 serveur dédié',
    texte: 'Rien que pour votre groupe, toute la soirée.',
  },
];

/** « 290 € », avec l'espace insécable de la typographie française. */
export function euros(montant: number): string {
  return `${montant} €`;
}
