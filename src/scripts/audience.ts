// Mesure d'audience : un compteur de visites par page, hébergé par LÜM.
//
// À chaque page affichée, le navigateur envoie une seule requête à
// /api/vue (même domaine ; vercel.json la relaie vers notre serveur) avec :
//   p : le chemin de la page (sans paramètres ni ancre)
//   v : 1 si c'est une arrivée sur la page, 0 pour un rechargement ou un
//       retour arrière
//   e : 1 si l'on arrive d'un autre site ou en accès direct (début de visite)
// Le site précédent n'est pas transmis : seul le booléen « e » sort d'ici.
//
// Pas de cookie, pas de localStorage, pas d'identifiant, pas d'empreinte du
// navigateur : rien ne permet de relier deux pages vues entre elles. Le
// serveur ne garde qu'un compteur par jour et par page (dépôt lum-audience,
// sur le serveur de LÜM). Ce traitement entre dans l'exemption de
// consentement de la CNIL (lignes directrices cookies, art. 5) : pas de
// bandeau. Opposition : le signal « Global Privacy Control » ou « Do Not
// Track » du navigateur est respecté.

const DOMAINES_PROD = ['lumvieuxlille.fr', 'www.lumvieuxlille.fr'];

function refus(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || navigator.doNotTrack === '1' || navigator.webdriver === true;
}

function compter() {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const type = navigation?.type ?? 'navigate';
  const arrivee = type !== 'reload' && type !== 'back_forward';

  let depuisLeSite = false;
  try {
    depuisLeSite = Boolean(document.referrer) && new URL(document.referrer).hostname === location.hostname;
  } catch {
    // référent illisible : compté comme une arrivée de l'extérieur
  }

  const donnees = { p: location.pathname, v: arrivee ? 1 : 0, e: arrivee && !depuisLeSite ? 1 : 0 };

  if (!DOMAINES_PROD.includes(location.hostname)) {
    console.info('[audience]', donnees, refus() ? '(non envoyé : opposition du navigateur)' : '(non envoyé hors production)');
    return;
  }
  if (refus()) return;

  const corps = JSON.stringify(donnees);
  // text/plain : pas de requête préalable, et sendBeacon survit au départ de la page.
  const envoye = navigator.sendBeacon?.('/api/vue', new Blob([corps], { type: 'text/plain' }));
  if (!envoye) {
    fetch('/api/vue', { method: 'POST', body: corps, keepalive: true, credentials: 'omit' }).catch(() => {});
  }
}

// Une page préchargée par le navigateur n'est comptée que si on l'affiche.
const doc = document as Document & { prerendering?: boolean };
if (doc.prerendering) document.addEventListener('prerenderingchange', compter, { once: true });
else compter();
