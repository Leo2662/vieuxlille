// POST /api/carte-cadeau/webhook — notifications Square (payment.updated).
//
// Filet de sécurité : si le client ferme l'onglet avant de revenir sur la
// page de remerciement, c'est cette notification qui déclenche l'envoi.
// À abonner dans le tableau de bord développeur Square, avec la clé de
// signature dans SQUARE_WEBHOOK_SIGNATURE_KEY.

import { livrer } from '../_lib/livraison.js';
import { signatureValide } from '../_lib/square.js';

interface Notification {
  type?: string;
  data?: { object?: { payment?: { status?: string; order_id?: string } } };
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) return new Response('Non configuré', { status: 503 });

  const corps = await request.text();
  // La signature porte sur l'URL exacte déclarée chez Square.
  const url = process.env.SQUARE_WEBHOOK_URL ?? request.url;
  if (!signatureValide(corps, request.headers.get('x-square-hmacsha256-signature'), url)) {
    return new Response('Signature invalide', { status: 403 });
  }

  const evenement = JSON.parse(corps) as Notification;
  const paiement = evenement.data?.object?.payment;
  if (evenement.type !== 'payment.updated' || paiement?.status !== 'COMPLETED' || !paiement.order_id) {
    return new Response('Ignoré', { status: 200 });
  }

  try {
    // Une commande qui n'est pas une carte cadeau ressort « en-attente » : rien n'est envoyé.
    const resultat = await livrer(paiement.order_id);
    return Response.json({ statut: resultat.statut });
  } catch (erreur) {
    console.error('[carte-cadeau] webhook', paiement.order_id, erreur);
    // 500 : Square renverra la notification plus tard.
    return new Response('Erreur', { status: 500 });
  }
}
