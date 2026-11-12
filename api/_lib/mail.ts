// Envoi de la carte par e-mail, via l'API Resend (sans SDK).

import { EMAIL_EQUIPE, EXPEDITEUR, PRIX_CENTIMES, env } from './config.js';
import { brunchs, dateLongue, type CartePayee } from './commande.js';

const echapper = (t: string) =>
  t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function contenu(carte: CartePayee) {
  const pour = carte.pour ? ` pour ${carte.pour}` : '';
  const valable = dateLongue(carte.valableJusquau);
  const formules = carte.quantite > 1 ? `${brunchs(carte.quantite, false)} (${carte.quantite} formules)` : 'une formule brunch';

  const texte = [
    `Merci ${carte.prenom} !`,
    '',
    `Ta carte cadeau brunch${pour} est en pièce jointe, en PDF : à imprimer ou à transférer.`,
    '',
    `Code : ${carte.code}`,
    `Valable jusqu'au ${valable}, pour ${formules} : chacune avec un salé, un sucré, une boisson chaude et une boisson froide.`,
    'Le week-end, de 11h à 15h30, au 94 rue Saint-André, Vieux-Lille.',
    'Réservation conseillée au 06 42 99 62 42.',
    '',
    'À très vite,',
    "L'équipe LÜM Vieux-Lille",
  ].join('\n');

  // Mise en page en tableaux et styles en ligne : c'est ce que les
  // messageries lisent toutes. Mêmes couleurs que le site.
  const html = `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:0;background:#944826;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#944826;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#f9f1e6;border-radius:24px;">
        <tr><td style="padding:36px 32px 32px;font-family:Nunito,'Helvetica Neue',Arial,sans-serif;color:#944826;">
          <p style="margin:0;font-family:Anton,Impact,'Arial Narrow',sans-serif;font-size:28px;letter-spacing:2px;line-height:1;">LÜM</p>
          <p style="margin:4px 0 28px;font-size:9px;font-weight:800;letter-spacing:3px;">VIEUX-LILLE</p>
          <p style="margin:0 0 6px;font-family:Anton,Impact,'Arial Narrow',sans-serif;font-size:30px;line-height:1.1;text-transform:uppercase;">Merci ${echapper(carte.prenom)}&nbsp;!</p>
          <p style="margin:0 0 22px;font-size:16px;line-height:1.6;font-weight:700;color:#5c3d2e;">
            Ta carte cadeau brunch${echapper(pour)} est en pièce jointe, en PDF&nbsp;: à imprimer ou à transférer.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">
            <tr><td style="background:#944826;border-radius:999px;padding:10px 22px;color:#f9f1e6;font-weight:800;font-size:16px;letter-spacing:2px;">
              <span style="font-size:10px;letter-spacing:2px;">CODE&nbsp;&nbsp;</span>${echapper(carte.code)}
            </td></tr>
          </table>
          <p style="margin:0 0 6px;font-size:15px;line-height:1.6;font-weight:800;">Valable jusqu'au ${valable}</p>
          <p style="margin:0 0 22px;font-size:14px;line-height:1.6;font-weight:700;color:#5c3d2e;">
            Pour ${formules}&nbsp;: chacune avec un salé, un sucré, une boisson chaude et une boisson froide.<br>
            Le week-end, de 11h à 15h30, au 94 rue Saint-André, Vieux-Lille.<br>
            Réservation conseillée au <a href="tel:+33642996242" style="color:#944826;">06 42 99 62 42</a>.
          </p>
          <p style="margin:0;font-size:15px;line-height:1.6;font-weight:700;">À très vite,<br>L'équipe LÜM Vieux-Lille</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { texte, html };
}

/**
 * Un envoi Resend. La clé d'idempotence évite un second envoi quand la page
 * de retour et la notification Square arrivent toutes deux.
 */
async function envoyer(cle: string, message: Record<string, unknown>): Promise<void> {
  const reponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': cle,
    },
    body: JSON.stringify({ from: process.env.MAIL_FROM ?? EXPEDITEUR, ...message }),
  });

  // 409 : la même clé d'idempotence a déjà servi — le message est déjà parti.
  if (reponse.status === 409) return;
  if (!reponse.ok) throw new Error(`Resend → ${reponse.status} ${await reponse.text()}`);
}

/** Envoie la carte au client. Une réponse de sa part arrive à l'équipe. */
export async function envoyerCarte(carte: CartePayee, pdf: Uint8Array): Promise<void> {
  const { texte, html } = contenu(carte);
  await envoyer(`carte-cadeau/${carte.orderId}`, {
    to: [carte.email],
    reply_to: process.env.MAIL_REPLY_TO ?? EMAIL_EQUIPE,
    subject: `Ta carte cadeau brunch LÜM${carte.pour ? ` pour ${carte.pour}` : ''}`,
    text: texte,
    html,
    attachments: [
      {
        filename: `carte-cadeau-brunch-LUM-${carte.code}.pdf`,
        content: Buffer.from(pdf).toString('base64'),
      },
    ],
  });
}

/**
 * Prévient l'équipe d'une carte vendue, PDF joint. Message distinct de celui
 * du client : s'il échoue, la carte du client part quand même.
 */
export async function notifierEquipe(carte: CartePayee, pdf: Uint8Array): Promise<void> {
  const lignes = [
    `Nouvelle carte cadeau vendue : ${brunchs(carte.quantite, false)}, ${((PRIX_CENTIMES * carte.quantite) / 100).toFixed(0)} €.`,
    '',
    `Code : ${carte.code}`,
    `Valable jusqu'au : ${dateLongue(carte.valableJusquau)}`,
    `Acheteur : ${carte.prenom} ${carte.nom}`,
    `E-mail : ${carte.email}`,
    `Téléphone : ${carte.telephone}`,
    `Pour : ${carte.pour || '—'}`,
    `Petit mot : ${carte.mot || '—'}`,
    '',
    `Commande Square : ${carte.orderId}`,
  ];
  await envoyer(`carte-cadeau/${carte.orderId}/equipe`, {
    to: (process.env.CARTE_CADEAU_COPIE ?? EMAIL_EQUIPE).split(',').map((a) => a.trim()),
    reply_to: carte.email,
    subject: `🎁 Carte cadeau brunch ${carte.code} — ${carte.prenom} ${carte.nom}`,
    text: lignes.join('\n'),
    html: `<pre style="font:15px/1.6 -apple-system,Segoe UI,Arial,sans-serif;white-space:pre-wrap;">${echapper(lignes.join('\n'))}</pre>`,
    attachments: [
      {
        filename: `carte-cadeau-brunch-LUM-${carte.code}.pdf`,
        content: Buffer.from(pdf).toString('base64'),
      },
    ],
  });
}
