// Mesure d'audience : Google Analytics 4, alimenté par le dataLayer.
//
// - Tout passe par window.dataLayer (la file que lit gtag.js, et que lirait
//   Google Tag Manager si on en ajoutait un).
// - Consentement d'abord (CNIL) : gtag.js n'est chargé qu'après « Accepter ».
//   Les événements poussés avant restent dans la file et partent à ce
//   moment-là ; après « Refuser », rien ne quitte le navigateur.
// - GA ne se charge que sur le domaine de prod, et seulement si PUBLIC_GA_ID
//   est défini. Ailleurs (dev, local), chaque événement s'affiche dans la
//   console : c'est là qu'on vérifie le plan de marquage.
//
// Événements envoyés :
//   page_view (automatique) · ouverture_pli · clic_reservation ·
//   clic_telephone · clic_email · select_item · view_item ·
//   begin_checkout · erreur_commande · purchase · paiement_en_attente ·
//   erreur_confirmation

import { PRIX_CENTIMES } from '../../api/_lib/config.ts';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    lumConsentement?: (choix: 'oui' | 'non') => void;
  }
}

const GA_ID: string | undefined = import.meta.env.PUBLIC_GA_ID;
const DOMAINES_PROD = ['lumvieuxlille.fr', 'www.lumvieuxlille.fr'];
const enProd = DOMAINES_PROD.includes(location.hostname);
const CLE_CONSENTEMENT = 'lum-consentement';

window.dataLayer = window.dataLayer || [];
// gtag.js attend des objets « arguments », pas des tableaux : d'où la
// fonction classique plutôt qu'une flèche.
window.gtag = function gtag() {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
};

// Mode « consentement d'abord » : tout est refusé tant que le visiteur n'a
// rien dit. Aucune publicité : les signaux publicitaires restent refusés.
window.gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
});
window.gtag('js', new Date());
if (GA_ID) window.gtag('config', GA_ID);

function lireChoix(): string | null {
  try {
    return localStorage.getItem(CLE_CONSENTEMENT);
  } catch {
    return null;
  }
}

let charge = false;
function chargerGa() {
  if (charge || !GA_ID || !enProd) return;
  charge = true;
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.append(script);
}

/** Enregistre le choix du bandeau cookies (voir src/components/Cookies.astro). */
window.lumConsentement = (choix) => {
  try {
    localStorage.setItem(CLE_CONSENTEMENT, choix);
  } catch {
    // stockage indisponible : le choix vaut pour cette page seulement
  }
  if (choix === 'oui') chargerGa();
  // Un refus après un accord : GA est déjà chargé, on coupe le stockage.
  else if (charge) window.gtag('consent', 'update', { analytics_storage: 'denied' });
};

if (lireChoix() === 'oui') chargerGa();

/** Pousse un événement GA4 dans le dataLayer. */
export function suivre(evenement: string, parametres: Record<string, unknown> = {}): void {
  window.gtag('event', evenement, parametres);
  if (!enProd) console.info('[mesure]', evenement, parametres);
}

/** L'article « carte cadeau brunch », au format e-commerce GA4. */
export function articleCarteCadeau(quantite = 1) {
  return {
    item_id: 'carte-cadeau-brunch',
    item_name: 'Carte cadeau brunch',
    item_category: 'Carte cadeau',
    price: PRIX_CENTIMES / 100,
    quantity: quantite,
  };
}

export const DEVISE = 'EUR';

// --- Écoutes communes à toutes les pages ---------------------------------

// Clics : liens téléphone et e-mail partout ; ailleurs, tout élément marqué
// data-suivi="nom_evenement" (paramètres en data-suivi-xxx).
document.addEventListener('click', (e) => {
  const cible = (e.target as Element | null)?.closest?.('a, button, [data-suivi]');
  if (!cible) return;

  const href = cible.getAttribute('href') ?? '';
  if (href.startsWith('tel:')) suivre('clic_telephone', { emplacement: location.pathname });
  else if (href.startsWith('mailto:')) suivre('clic_email', { emplacement: location.pathname });

  const nom = (cible as HTMLElement).dataset?.suivi;
  if (!nom) return;
  const parametres: Record<string, unknown> = {};
  for (const [cle, valeur] of Object.entries((cible as HTMLElement).dataset)) {
    if (cle.startsWith('suivi') && cle !== 'suivi' && cle !== 'suiviArticle') {
      const nomParam = cle.slice(5).replace(/^./, (c) => c.toLowerCase()).replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
      parametres[nomParam] = valeur;
    }
  }
  if ((cible as HTMLElement).dataset.suiviArticle === 'carte-cadeau') {
    parametres.items = [articleCarteCadeau()];
  }
  suivre(nom, parametres);
});

// Accordéons : quel pli le visiteur ouvre, et dans quelle section. On suit
// le clic sur l'intitulé (le clavier en déclenche un aussi) plutôt que
// l'événement « toggle », qui part aussi pour les plis ouverts d'office.
// Au moment du clic, le pli n'a pas encore basculé : fermé = il s'ouvre.
const texte = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 100) ?? '';
document.addEventListener('click', (e) => {
  const intitule = (e.target as Element | null)?.closest?.('summary');
  const pli = intitule?.parentElement;
  if (!(pli instanceof HTMLDetailsElement) || pli.open) return;
  suivre('ouverture_pli', {
    pli: texte(intitule!.querySelector('.pli__titre') ?? intitule),
    section: texte(pli.closest('section')?.querySelector('h2')),
  });
});
