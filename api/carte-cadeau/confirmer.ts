// POST /api/carte-cadeau/confirmer   { orderId }
//
// Appelée par la page de retour, /brunch/carte-cadeau/merci/. Ne fait
// confiance à rien de ce que le navigateur envoie, sauf l'identifiant de
// commande : le paiement est vérifié auprès de Square avant tout envoi.

import { livrer } from '../_lib/livraison.js';

export async function POST(request: Request): Promise<Response> {
  let orderId = '';
  try {
    ({ orderId = '' } = (await request.json()) as { orderId?: string });
  } catch {
    // corps illisible : traité comme une commande inconnue
  }

  try {
    return Response.json(await livrer(String(orderId)), { headers: { 'cache-control': 'no-store' } });
  } catch (erreur) {
    console.error('[carte-cadeau] livraison', orderId, erreur);
    return Response.json({ statut: 'erreur' }, { status: 502 });
  }
}
