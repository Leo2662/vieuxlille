import { randomInt } from 'node:crypto';
import { LIMITES, QUANTITE_MAX } from './config.js';

/** Ce que le client saisit dans le formulaire. */
export interface Coordonnees {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  /** Prénom du bénéficiaire, facultatif. */
  pour: string;
  /** Petit mot imprimé sur la carte, facultatif. */
  mot: string;
  /** Nombre de brunchs offerts par la carte. */
  quantite: number;
}

/** Une commande payée, prête à devenir une carte. */
export interface CartePayee extends Coordonnees {
  orderId: string;
  code: string;
  payeeLe: Date;
  valableJusquau: Date;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEPHONE = /^\+?[\d\s.\-()]{6,}$/;

/** Espaces resserrées, caractères de contrôle retirés. */
function propre(valeur: unknown, multiligne = false): string {
  if (typeof valeur !== 'string') return '';
  const sansControle = valeur.replace(multiligne ? /[^\P{Cc}\n]/gu : /\p{Cc}/gu, '');
  return multiligne
    ? sansControle.replace(/\r\n?/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
    : sansControle.replace(/\s+/g, ' ').trim();
}

/** Valide le formulaire. Renvoie les coordonnées, ou le message à afficher. */
export function lireFormulaire(
  brut: Record<string, unknown>,
): { ok: true; valeur: Coordonnees } | { ok: false; erreur: string } {
  const c: Coordonnees = {
    prenom: propre(brut.prenom),
    nom: propre(brut.nom),
    email: propre(brut.email).toLowerCase(),
    telephone: propre(brut.telephone),
    pour: propre(brut.pour),
    mot: propre(brut.mot, true),
    quantite: Number(brut.quantite ?? 1),
  };

  if (!c.prenom) return { ok: false, erreur: 'Indique ton prénom.' };
  if (!c.nom) return { ok: false, erreur: 'Indique ton nom.' };
  if (!EMAIL.test(c.email)) return { ok: false, erreur: 'Cette adresse e-mail ne semble pas valide.' };
  if (!TELEPHONE.test(c.telephone) || c.telephone.replace(/\D/g, '').length < 6) {
    return { ok: false, erreur: 'Ce numéro de téléphone ne semble pas valide.' };
  }
  if (!Number.isInteger(c.quantite) || c.quantite < 1 || c.quantite > QUANTITE_MAX) {
    return { ok: false, erreur: `Choisis entre 1 et ${QUANTITE_MAX} brunchs.` };
  }
  for (const [champ, max] of Object.entries(LIMITES)) {
    if (c[champ as keyof typeof LIMITES].length > max) {
      return { ok: false, erreur: `Le champ « ${champ} » dépasse ${max} caractères.` };
    }
  }
  return { ok: true, valeur: c };
}

/**
 * Le numéro au format E.164, quand on sait le déduire : Square refuse un
 * numéro qu'il ne comprend pas. Un 06… est supposé français.
 */
export function telephoneE164(telephone: string): string | undefined {
  const chiffres = telephone.replace(/[^\d+]/g, '');
  if (/^\+\d{8,15}$/.test(chiffres)) return chiffres;
  if (/^00\d{8,15}$/.test(chiffres)) return `+${chiffres.slice(2)}`;
  if (/^0[1-9]\d{8}$/.test(chiffres)) return `+33${chiffres.slice(1)}`;
  return undefined;
}

// Sans 0/O, 1/I/L : un code qui se recopie sans hésiter au comptoir.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Code de la carte, du type BR-7KQ2-M9XD. */
export function nouveauCode(): string {
  const bloc = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  return `BR-${bloc()}-${bloc()}`;
}

const NOMBRES = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];

/** « Un brunch », « Deux brunchs »… en toutes lettres, comme sur une carte. */
export function brunchs(quantite: number, majuscule = true): string {
  const nombre = NOMBRES[quantite] ?? String(quantite);
  const texte = `${nombre} brunch${quantite > 1 ? 's' : ''}`;
  return majuscule ? texte.charAt(0).toUpperCase() + texte.slice(1) : texte;
}

export function dateLongue(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  }).format(date);
}
