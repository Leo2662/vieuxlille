import { PRIX_CENTIMES } from './config.js';
import { envoyerCarte, notifierEquipe } from './mail.js';
import { genererCarte } from './pdf.js';
import { commandePayee } from './square.js';

export type Livraison =
  | { statut: 'envoyee'; email: string; code: string; pour: string; quantite: number; montant: number }
  | { statut: 'en-attente' };

/**
 * Livre la carte d'une commande : vérifie auprès de Square qu'elle est
 * payée, fabrique le PDF et l'envoie. Appelée par la page de retour et par la
 * notification Square ; l'envoi est idempotent, le client ne reçoit qu'un mail.
 */
export async function livrer(orderId: string): Promise<Livraison> {
  const carte = await commandePayee(orderId);
  if (!carte) return { statut: 'en-attente' };
  const pdf = await genererCarte(carte);
  await envoyerCarte(carte, pdf);
  try {
    await notifierEquipe(carte, pdf);
  } catch (erreur) {
    console.error('[carte-cadeau] notification équipe', orderId, erreur);
  }
  return {
    statut: 'envoyee',
    email: carte.email,
    code: carte.code,
    pour: carte.pour,
    quantite: carte.quantite,
    // En euros, comme le veut la mesure d'audience.
    montant: (PRIX_CENTIMES * carte.quantite) / 100,
  };
}
