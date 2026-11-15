// Textes de la carte cadeau brunch, partagés par la page de commande
// (src/components/CarteCadeau.astro) et l'encart de la page brunch
// (src/components/Brunch.astro).
//
// Les réponses sont écrites pour être reprises telles quelles par les moteurs
// de recherche et les assistants IA : chaque réponse se suffit à elle-même
// (lieu, prix, conditions), sans renvoyer à la question. Prix, horaires et
// conditions sont redits dans public/llms.txt et dans le PDF de la carte
// (api/_lib/pdf.ts) : à modifier ensemble.

import { PRIX_CENTIMES, QUANTITE_MAX, VALIDITE_MOIS } from '../../api/_lib/config.ts';
import type { Langue } from '../i18n';

const prix = PRIX_CENTIMES / 100;

export interface Occasion {
  /** Ancre de la section, pour un lien direct (/brunch/carte-cadeau/#noel). */
  id: string;
  titre: string;
  texte: string;
}

export interface Question {
  question: string;
  reponse: string;
}

export const occasions: Record<Langue, Occasion[]> = {
  fr: [
    {
      id: 'noel',
      titre: 'Offrir un brunch pour Noël',
      texte:
        "Une idée cadeau de Noël à Lille qui se savoure : la carte arrive tout de suite par e-mail, en PDF, même commandée le 24 au soir. À glisser sous le sapin, imprimée ou transférée, pour un brunch dans le Vieux-Lille un week-end de l'année.",
    },
    {
      id: 'anniversaire',
      titre: 'Offrir un brunch pour un anniversaire',
      texte: `Un cadeau d'anniversaire à partager : offre un brunch pour deux, ou pour toute la bande (jusqu'à ${QUANTITE_MAX} sur une même carte), avec ton petit mot imprimé dessus.`,
    },
    {
      id: 'saint-valentin',
      titre: 'Offrir un brunch pour la Saint-Valentin',
      texte:
        'Deux brunchs, un mot doux sur la carte, et un week-end à deux au cœur du Vieux-Lille : en terrasse, en salle ou dans notre cave voûtée.',
    },
    {
      id: 'fete-des-meres',
      titre: 'Offrir un brunch pour la fête des mères ou des pères',
      texte: "Un week-end en famille autour d'une bonne table : choisis le nombre de brunchs, chacun compose le sien.",
    },
    {
      id: 'merci',
      titre: 'Offrir un brunch pour dire merci',
      texte:
        "Pour une collègue qui s'en va, un voisin serviable ou une nounou adorée : un cadeau simple, qui fait toujours plaisir.",
    },
  ],
  en: [
    {
      id: 'noel',
      titre: 'Give brunch for Christmas',
      texte:
        'A Christmas gift in Lille you can taste: the card arrives instantly by e-mail as a PDF, even if you order on Christmas Eve. Print it or forward it, for a weekend brunch in Vieux-Lille any time within the year.',
    },
    {
      id: 'anniversaire',
      titre: 'Give brunch for a birthday',
      texte: `A birthday gift to share: give brunch for two, or for the whole gang (up to ${QUANTITE_MAX} on one card), with your own message printed on it.`,
    },
    {
      id: 'saint-valentin',
      titre: "Give brunch for Valentine's Day",
      texte: 'Two brunches, a sweet note on the card, and a weekend for two in the heart of Vieux-Lille.',
    },
    {
      id: 'fete-des-meres',
      titre: "Give brunch for Mother's or Father's Day",
      texte: 'A family weekend around a good table: choose how many brunches, and everyone builds their own.',
    },
    {
      id: 'merci',
      titre: 'Give brunch to say thank you',
      texte:
        "For a colleague who's leaving, a helpful neighbour or a much-loved nanny: a simple gift that always goes down well.",
    },
  ],
};

export const faq: Record<Langue, Question[]> = {
  fr: [
    {
      question: 'Combien coûte une carte cadeau brunch au LÜM ?',
      reponse: `La carte cadeau brunch du LÜM Vieux-Lille coûte ${prix} € par brunch. Une même carte peut offrir de 1 à ${QUANTITE_MAX} brunchs : ${2 * prix} € pour deux, ${4 * prix} € pour quatre. Le prix est celui de la formule brunch sur place, taxes comprises.`,
    },
    {
      question: "Qu'est-ce qu'il y a dans le brunch offert ?",
      reponse:
        "Chaque brunch offert est la formule complète du LÜM : une douceur salée (œufs cocotte et tartines, recette chèvre, miel, pommes et noix, ou cream cheese, moutarde, effiloché de canard et oignons caramélisés), une douceur sucrée (cookie, cinnamon roll, granola bowl ou flan), une boisson chaude et une boisson froide (citron pressé, jus de pomme ou orange pressée). La personne choisit sur place.",
    },
    {
      question: 'Quand peut-on utiliser la carte cadeau ?',
      reponse:
        "Le week-end uniquement, le samedi et le dimanche de 11h à 15h30 : c'est une carte brunch, et le brunch du LÜM n'est servi que le week-end.",
    },
    {
      question: 'Faut-il réserver pour utiliser la carte ?',
      reponse:
        "Ce n'est pas obligatoire, mais c'est conseillé, surtout à plusieurs : réserve une table en ligne ou au 06 42 99 62 42.",
    },
    {
      question: 'Comment utiliser la carte cadeau ?',
      reponse:
        'Viens au LÜM, 94 rue Saint-André dans le Vieux-Lille, un samedi ou un dimanche entre 11h et 15h30, et montre la carte au comptoir, imprimée ou sur ton téléphone.',
    },
    {
      question: 'Quelle est la durée de validité ?',
      reponse: `La carte est valable ${VALIDITE_MOIS === 12 ? 'un an' : `${VALIDITE_MOIS} mois`} à partir de l'achat. La date limite est écrite dessus.`,
    },
    {
      question: 'Comment offrir la carte, et en combien de temps arrive-t-elle ?',
      reponse:
        "Choisis le nombre de brunchs, ajoute le prénom de la personne et ton petit mot, puis paie en ligne par carte bancaire, en toute sécurité avec Square. La carte cadeau arrive aussitôt par e-mail, en PDF, même commandée à la dernière minute : imprime-la ou transfère-la à la personne.",
    },
    {
      question: 'Peut-on offrir un brunch pour deux ?',
      reponse: `Oui : choisis 2 brunchs au moment de la commande (${2 * prix} €). Une même carte peut offrir jusqu'à ${QUANTITE_MAX} brunchs, pour un couple, une famille ou toute une bande d'amis.`,
    },
    {
      question: "Je n'ai pas reçu l'e-mail, que faire ?",
      reponse:
        'Regarde dans tes courriers indésirables. Toujours rien ? Appelle-nous au 06 42 99 62 42 et on te la renvoie.',
    },
  ],
  en: [
    {
      question: 'How much is a brunch gift card at LÜM?',
      reponse: `The LÜM Vieux-Lille brunch gift card costs €${prix} per brunch. One card can cover 1 to ${QUANTITE_MAX} brunches: €${2 * prix} for two, €${4 * prix} for four. It's the same price as the brunch on site, taxes included.`,
    },
    {
      question: "What's included in the brunch?",
      reponse:
        "Each brunch is LÜM's full brunch: a savoury treat (baked eggs with tartines, goat cheese, honey, apple and walnuts, or cream cheese, mustard, pulled duck and caramelised onions), a sweet treat (cookie, cinnamon roll, granola bowl or flan), a hot drink and a cold drink (fresh lemon juice, apple juice or fresh orange juice). Everything is chosen on the day.",
    },
    {
      question: 'When can the gift card be used?',
      reponse:
        "Weekends only, Saturday and Sunday from 11am to 3:30pm: it's a brunch gift card, and brunch at LÜM is only served at the weekend.",
    },
    {
      question: 'Do I need to book?',
      reponse:
        "It's not required, but it's recommended, especially for groups: book a table online or call +33 6 42 99 62 42.",
    },
    {
      question: 'How do I use the gift card?',
      reponse:
        'Come to LÜM, 94 rue Saint-André in Vieux-Lille (Old Lille), on a Saturday or Sunday between 11am and 3:30pm, and show the card at the counter, printed or on your phone.',
    },
    {
      question: 'How long is it valid?',
      reponse: `${VALIDITE_MOIS === 12 ? 'One year' : `${VALIDITE_MOIS} months`} from purchase. The expiry date is printed on the card.`,
    },
    {
      question: 'How do I give it, and how fast does it arrive?',
      reponse:
        "Choose the number of brunches, add the recipient's name and your message, then pay online by card, securely with Square. The gift card arrives straight away by e-mail as a PDF, even at the last minute: print it or forward it. The card itself is written in French.",
    },
    {
      question: 'Can I give brunch for two?',
      reponse: `Yes: choose 2 brunches when ordering (€${2 * prix}). One card can cover up to ${QUANTITE_MAX} brunches, for a couple, a family or a whole group of friends.`,
    },
    {
      question: "I didn't get the e-mail, what now?",
      reponse: "Check your spam folder. Still nothing? Call us on +33 6 42 99 62 42 and we'll resend it.",
    },
  ],
};
