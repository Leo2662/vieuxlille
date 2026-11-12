// POST /api/carte-cadeau/commander
//
// Reçoit le formulaire de /brunch/carte-cadeau/, crée la commande Square et
// renvoie le lien de paiement. En JSON quand le script de la page appelle ;
// en formulaire classique (sans JavaScript), on redirige directement.

import { lireFormulaire } from '../_lib/commande.js';
import { creerLienDePaiement } from '../_lib/square.js';

export async function POST(request: Request): Promise<Response> {
  const enJson = request.headers.get('content-type')?.includes('application/json') ?? false;

  let brut: Record<string, unknown>;
  try {
    brut = enJson ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return Response.json({ erreur: 'Formulaire illisible.' }, { status: 400 });
  }

  const lu = lireFormulaire(brut);
  if (!lu.ok) {
    return enJson
      ? Response.json({ erreur: lu.erreur }, { status: 422 })
      : new Response(lu.erreur, { status: 422, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }

  // creerLienDePaiement y ajoute ?orderId=… une fois la commande créée.
  const origine = process.env.SITE_URL ?? new URL(request.url).origin;
  const retour = `${origine}/brunch/carte-cadeau/merci/`;

  try {
    const { url, orderId } = await creerLienDePaiement(lu.valeur, retour);
    return enJson ? Response.json({ url, orderId }) : Response.redirect(url, 303);
  } catch (erreur) {
    console.error('[carte-cadeau] création du lien Square', erreur);
    const message = 'Le paiement est indisponible pour le moment. Réessaie dans un instant, ou appelle-nous au 06 42 99 62 42.';
    return enJson
      ? Response.json({ erreur: message }, { status: 502 })
      : new Response(message, { status: 502, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
}
