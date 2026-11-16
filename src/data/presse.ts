// Les articles qui citent le LÜM, affichés sur /actus avec ceux du blog,
// du plus récent au plus ancien. Pour en ajouter un : une entrée de plus
// dans `parutions`, l'ordre est rétabli à l'affichage (src/lib/actus.ts).
//
// N'y figure que ce qui a été vérifié sur la page de l'article : le titre
// tel que publié, le mois de parution, et ce qu'il dit du LÜM. Le résumé est
// écrit ici, avec nos mots — pas d'extrait recopié de l'article.

export type Lieu = 'Vieux-Lille' | 'Lille Centre' | 'Les deux adresses';

export interface Parution {
  /** Le titre de presse, tel qu'il se présente. */
  media: string;
  /** Le site qui publie, affiché sous le nom du titre. */
  site: string;
  /** Le titre de l'article, tel que publié. */
  titre: string;
  /** Mois de parution, AAAA-MM. */
  date: string;
  url: string;
  /** Ce que l'article dit du LÜM, en une ou deux phrases. */
  resume: string;
  /** L'adresse dont parle l'article. */
  lieu: Lieu;
}

export const parutions: Parution[] = [
  {
    media: 'Lille Actu',
    site: 'actu.fr',
    titre:
      '« Élixirs », café, matcha et délices sucrés : Élise ouvre Lüm, un coffee shop autour du bien-être à Lille',
    date: '2025-11',
    url: 'https://actu.fr/hauts-de-france/lille_59350/elixirs-cafe-matcha-et-delices-sucres-elise-ouvre-lum-un-coffee-shop-autour-du-bien-etre-a-lille_63441294.html',
    resume:
      'L’ouverture du LÜM, rue Saint-André : un coffee shop pensé autour du bien-être, entre élixirs, café, matcha et douceurs.',
    lieu: 'Vieux-Lille',
  },
  {
    media: 'Lille Actu',
    site: 'actu.fr',
    titre:
      'Moins d’un an après sa première adresse, le coffee shop Lüm ouvre en plein centre de Lille',
    date: '2026-09',
    url: 'https://actu.fr/hauts-de-france/lille_59350/moins-dun-an-apres-sa-premiere-adresse-le-coffee-shop-lum-ouvre-en-plein-centre-de-lille_64840272.html',
    resume:
      'Moins d’un an après le Vieux-Lille, le LÜM ouvre une seconde adresse rue du Molinel, dédiée à la vente à emporter.',
    lieu: 'Lille Centre',
  },
  {
    media: 'Lille Addict',
    site: 'lilleaddict.fr',
    titre: 'Les meilleurs salons de thé de Lille et aux alentours',
    date: '2026-10',
    url: 'https://lilleaddict.fr/meilleur/meilleurs-salons-de-the-lille.html',
    resume:
      'Le LÜM entre dans la sélection des salons de thé lillois, avec ses deux adresses : rue Saint-André et rue du Molinel.',
    lieu: 'Les deux adresses',
  },
];

/** Les recommandations : guides et sélections sans article dédié. */
export const recommandations = [
  {
    media: 'Office de Tourisme de Lille',
    texte:
      'Le LÜM fait partie des cafés et salons de thé recommandés par l’Office de Tourisme de Lille.',
    url: 'https://en.lilletourism.com/get-out/the-best-addresses/cafes-and-tearooms/',
    bouton: 'Voir la sélection',
  },
];

const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

/** « 2026-09 » → « Septembre 2026 ». */
export function moisLisible(date: string): string {
  const [annee, mois] = date.split('-').map(Number);
  const nom = MOIS[mois - 1];
  return `${nom[0].toUpperCase()}${nom.slice(1)} ${annee}`;
}
