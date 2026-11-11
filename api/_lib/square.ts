// Appels à l'API Square, sans SDK : trois requêtes suffisent.
//
// Le lien fixe créé dans le tableau de bord Square ne peut rien porter : ni le
// nom du client, ni son petit mot, ni de quoi savoir ensuite qu'il a payé.
// On crée donc un lien de paiement par commande, au même prix, et la commande
// garde dans ses métadonnées tout ce qu'il faut pour fabriquer la carte. Pas
// de base de données : Square est la seule source.

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { DEVISE, PRIX_CENTIMES, PRODUIT, SOURCE, VALIDITE_MOIS, env, squareApi } from './config.js';
import { nouveauCode, telephoneE164, type CartePayee, type Coordonnees } from './commande.js';

const VERSION = '2025-01-23';

async function square<T>(chemin: string, init: RequestInit = {}): Promise<T> {
  const reponse = await fetch(squareApi() + chemin, {
    ...init,
    headers: {
      Authorization: `Bearer ${env('SQUARE_ACCESS_TOKEN')}`,
      'Square-Version': VERSION,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const corps = (await reponse.json()) as T & { errors?: { code: string; detail?: string }[] };
  if (!reponse.ok) {
    const detail = corps.errors?.map((e) => `${e.code}: ${e.detail ?? ''}`).join(' ; ');
    throw new Error(`Square ${chemin} → ${reponse.status} ${detail ?? ''}`);
  }
  return corps;
}

/** Crée le lien de paiement Square d'une carte. Renvoie l'adresse où envoyer le client. */
export async function creerLienDePaiement(c: Coordonnees, retour: string): Promise<string> {
  const code = nouveauCode();

  // Une valeur de métadonnée vide est refusée : on n'envoie que les champs remplis.
  const metadata = Object.fromEntries(
    Object.entries({
      source: SOURCE,
      code,
      prenom: c.prenom,
      nom: c.nom,
      email: c.email,
      telephone: c.telephone,
      pour: c.pour,
      mot: c.mot,
      quantite: String(c.quantite),
    }).filter(([, v]) => v),
  );

  const telephone = telephoneE164(c.telephone);

  const creer = (preRemplir: boolean) =>
    square<{ payment_link: { url: string } }>('/v2/online-checkout/payment-links', {
      method: 'POST',
      body: JSON.stringify({
        idempotency_key: randomUUID(),
        description: PRODUIT,
        order: {
          location_id: env('SQUARE_LOCATION_ID'),
          // Le code apparaît dans le détail de la transaction, côté Square :
          // c'est ce qu'on cherche au comptoir pour vérifier une carte.
          reference_id: code,
          metadata,
          line_items: [
            {
              name: PRODUIT,
              quantity: String(c.quantite),
              note: `Code ${code}${c.pour ? ` — pour ${c.pour}` : ''} — de ${c.prenom} ${c.nom}`.slice(0, 2000),
              base_price_money: { amount: PRIX_CENTIMES, currency: DEVISE },
            },
          ],
        },
        checkout_options: {
          redirect_url: retour,
          allow_tipping: false,
          ask_for_shipping_address: false,
        },
        // Pré-remplit la page de paiement Square avec ce que le client a déjà saisi.
        ...(preRemplir && {
          pre_populated_data: {
            buyer_email: c.email,
            ...(telephone && { buyer_phone_number: telephone }),
          },
        }),
      }),
    });

  // Square est plus strict que nous sur l'e-mail et le téléphone : s'il en
  // refuse un, on crée le lien sans pré-remplissage plutôt que d'échouer.
  try {
    return (await creer(true)).payment_link.url;
  } catch (erreur) {
    if (!/INVALID_(EMAIL|PHONE)/.test(String(erreur))) throw erreur;
    return (await creer(false)).payment_link.url;
  }
}

interface Commande {
  id: string;
  location_id: string;
  metadata?: Record<string, string>;
  total_money?: { amount: number; currency: string };
  tenders?: { payment_id?: string }[];
}

interface Paiement {
  status: string;
  created_at: string;
  amount_money: { amount: number; currency: string };
}

/**
 * La commande, si elle vient bien du formulaire et qu'elle est entièrement
 * payée ; `null` si le paiement n'est pas (encore) abouti.
 */
export async function commandePayee(orderId: string): Promise<CartePayee | null> {
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(orderId)) return null;

  let commande: Commande;
  try {
    ({ order: commande } = await square<{ order: Commande }>(`/v2/orders/${orderId}`));
  } catch {
    return null;
  }

  const m = commande.metadata ?? {};
  if (commande.location_id !== env('SQUARE_LOCATION_ID') || m.source !== SOURCE || !m.code) return null;

  // Payée = les paiements rattachés sont COMPLETED et couvrent le prix.
  const paiements = await Promise.all(
    (commande.tenders ?? [])
      .map((t) => t.payment_id)
      .filter((id): id is string => Boolean(id))
      .map((id) => square<{ payment: Paiement }>(`/v2/payments/${id}`).then((r) => r.payment)),
  );
  // Une commande d'avant l'arrivée de la quantité n'en porte pas : 1 brunch.
  const quantite = Number(m.quantite ?? 1);
  if (!Number.isInteger(quantite) || quantite < 1) return null;
  const reussis = paiements.filter((p) => p.status === 'COMPLETED' && p.amount_money.currency === DEVISE);
  const encaisse = reussis.reduce((somme, p) => somme + p.amount_money.amount, 0);
  if (!reussis.length || encaisse < PRIX_CENTIMES * quantite) return null;

  const payeeLe = new Date(reussis[0].created_at);
  const valableJusquau = new Date(payeeLe);
  valableJusquau.setMonth(valableJusquau.getMonth() + VALIDITE_MOIS);

  return {
    orderId: commande.id,
    code: m.code,
    prenom: m.prenom ?? '',
    nom: m.nom ?? '',
    email: m.email ?? '',
    telephone: m.telephone ?? '',
    pour: m.pour ?? '',
    mot: m.mot ?? '',
    quantite,
    payeeLe,
    valableJusquau,
  };
}

/**
 * Vérifie la signature d'une notification Square : HMAC-SHA256, en base64,
 * de l'URL de notification suivie du corps brut, avec la clé de signature.
 */
export function signatureValide(corps: string, signature: string | null, url: string): boolean {
  if (!signature) return false;
  const attendue = createHmac('sha256', env('SQUARE_WEBHOOK_SIGNATURE_KEY'))
    .update(url + corps)
    .digest();
  const recue = Buffer.from(signature, 'base64');
  return recue.length === attendue.length && timingSafeEqual(recue, attendue);
}
