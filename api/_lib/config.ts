// Réglages de la carte cadeau brunch, partagés par les fonctions de /api.
//
// Les fichiers et dossiers de /api qui commencent par « _ » ne deviennent pas
// des routes sur Vercel : ce dossier n'est que du code partagé.

/** Prix d'un brunch : celui de la formule (voir src/components/Brunch.astro). */
export const PRIX_CENTIMES = 2500;

/** Une carte vaut de 1 à QUANTITE_MAX brunchs, payés ensemble. */
export const QUANTITE_MAX = 10;
export const DEVISE = 'EUR';

/** Libellé de la ligne de commande, tel qu'il apparaît dans Square. */
export const PRODUIT = 'Carte cadeau Brunch LÜM Vieux-Lille';

/** Durée de validité de la carte, à compter du paiement. */
export const VALIDITE_MOIS = 12;

/** Boîte de l'équipe : reçoit les réponses des clients et une notification par carte vendue. */
export const EMAIL_EQUIPE = 'lum.vieuxlille@gmail.com';

/** Expéditeur des e-mails (le domaine doit être vérifié chez Resend). */
export const EXPEDITEUR = 'LÜM Vieux-Lille <cadeau@lumvieuxlille.fr>';

/** Marque posée sur chaque commande : on ne livre que les nôtres. */
export const SOURCE = 'lum-carte-cadeau-brunch';

/** Longueurs maximales des champs du formulaire, redites dans la page. */
export const LIMITES = {
  prenom: 60,
  nom: 60,
  email: 120,
  telephone: 25,
  pour: 60,
  // Les métadonnées d'une commande Square plafonnent à 255 caractères.
  mot: 250,
} as const;

export function env(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement manquante : ${nom}`);
  return valeur;
}

/** Bac à sable tant que SQUARE_ENV ne vaut pas « production ». */
export function squareApi(): string {
  return process.env.SQUARE_ENV === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
}

export function enProduction(): boolean {
  return process.env.SQUARE_ENV === 'production';
}
