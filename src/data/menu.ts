// Source unique du menu. Modifier les prix ici, la page /menu suit.
// Les prix sont des chaînes : on garde la virgule décimale et l'espace
// insécable avant l'euro, comme le veut la typographie française.
//
// ⚠️  À CONFIRMER AVANT LA MISE EN PRODUCTION
// Les articles et les prix reprennent la carte du 4 septembre
// (src/data/carte.ts, sorti de l'arbre au commit 1170409), dont les prix
// venaient eux-mêmes de LÜM Lille Centre. La formule Brunch n'a encore ni
// composition ni prix : la page affiche « à venir » à la place.

export type Moment = 'semaine' | 'weekend';

export type Icone = 'croissant' | 'couverts' | 'oeuf' | 'tasse' | 'verre' | 'cloche';

export interface Article {
  nom: string;
  prix: string;
  description?: string;
}

export interface Rubrique {
  titre?: string;
  articles: Article[];
}

export interface Formule {
  prix?: string;
  composition: string[];
  supplement?: string;
}

/** Créneau de service, à l'heure de Paris : il allume le point « en ce moment ». */
export interface Service {
  /** 0 = dimanche … 6 = samedi, comme Date.getDay(). */
  jours: number[];
  debut: string;
  fin: string;
}

export interface Section {
  /** Ancre de l'onglet : /menu#brunch ouvre directement le brunch. */
  id: string;
  nom: string;
  icone: Icone;
  horaires: string;
  /** Absent : l'onglet s'affiche tous les jours. */
  moment?: Moment;
  service?: Service;
  formule?: Formule;
  rubriques?: Rubrique[];
}

// Le café est fermé le mardi : il n'a pas de service ce jour-là.
const SEMAINE = [1, 3, 4, 5];
const WEEKEND = [6, 0];

export const sections: Section[] = [
  {
    id: 'petit-dej',
    nom: 'Petit déj',
    icone: 'croissant',
    horaires: 'En semaine, de 10h à 11h',
    moment: 'semaine',
    service: { jours: SEMAINE, debut: '10:00', fin: '11:00' },
    formule: {
      prix: '5,50 €',
      composition: ['1 Cookie ou Cinnamon Roll', '1 Café Filtre MUDA'],
    },
  },
  {
    id: 'dejeuner',
    nom: 'Déjeuner',
    icone: 'couverts',
    horaires: 'En semaine, toute la journée',
    moment: 'semaine',
    service: { jours: SEMAINE, debut: '10:00', fin: '18:00' },
    formule: {
      prix: '10,50 €',
      composition: [
        '1 Focaccia : Poulet Curry, Thon Gourmand ou Œufs Crémeux',
        '1 boisson : Eau St Amand, San Pellegrino ou Citronnade',
      ],
      supplement: '+2,00 € : Kombucha Goodsky ou Ginger Beer',
    },
  },
  {
    id: 'brunch',
    nom: 'Brunch',
    icone: 'oeuf',
    horaires: 'Le week-end, de 11h à 15h30',
    moment: 'weekend',
    service: { jours: WEEKEND, debut: '11:00', fin: '15:30' },
    formule: { composition: [] },
  },
  {
    id: 'barista',
    nom: 'Barista',
    icone: 'tasse',
    horaires: 'Du mercredi au lundi, 10h – 18h',
    rubriques: [
      {
        articles: [
          { nom: 'Espresso', prix: '2,50 €' },
          { nom: 'Double Espresso', prix: '3,70 €' },
          { nom: 'Café Allongé', prix: '3,70 €' },
          { nom: 'Café Filtre MUDA', prix: '3,60 €' },
          { nom: 'Cappuccino', prix: '4,50 €' },
          { nom: 'Latte', prix: '5,20 €' },
          { nom: 'Chocolat Chaud', prix: '5,00 €' },
          { nom: 'Chaï Latte', prix: '5,00 €' },
          { nom: 'Matcha Latte', prix: '5,00 €' },
          { nom: 'Iced Americano', prix: '4,20 €' },
          { nom: 'Iced Latte', prix: '5,00 €' },
          { nom: 'Iced Chaï Latte', prix: '5,70 €' },
          { nom: 'Iced Matcha Latte', prix: '5,70 €' },
        ],
      },
    ],
  },
  {
    id: 'boissons',
    nom: 'Boissons',
    icone: 'verre',
    horaires: 'Du mercredi au lundi, 10h – 18h',
    rubriques: [
      {
        articles: [
          { nom: 'Eau St Amand 50 cl', prix: '1,90 €' },
          { nom: 'San Pellegrino 50 cl', prix: '2,60 €' },
          { nom: 'Citronnade Maison', prix: '3,90 €' },
          { nom: "Jus d'Orange Pressé", prix: '4,50 €' },
          { nom: 'Kombucha Goodsky', prix: '4,50 €' },
          { nom: 'Ginger Beer Bio', prix: '4,50 €' },
        ],
      },
    ],
  },
  {
    id: 'a-la-carte',
    nom: 'À la carte',
    icone: 'cloche',
    horaires: 'Du mercredi au lundi, 10h – 18h',
    rubriques: [
      {
        titre: 'Salé',
        articles: [
          {
            nom: 'Focaccia Poulet Curry',
            prix: '8,90 €',
            description: 'Poulet au curry, salade fraîche & tomates',
          },
          {
            nom: 'Focaccia Thon Gourmand',
            prix: '8,90 €',
            description: 'Thon, mayonnaise, salade fraîche & tomates',
          },
          {
            nom: 'Focaccia Œufs Crémeux',
            prix: '8,90 €',
            description: "Salade d'œufs, ciboulette, salade fraîche & tomate",
          },
        ],
      },
      {
        titre: 'Sucré',
        articles: [
          { nom: 'Cookie', prix: '4,00 €' },
          { nom: 'Cinnamon Roll', prix: '4,50 €' },
          { nom: 'Brookie', prix: '4,90 €' },
          { nom: 'Marbré / Cake Matcha', prix: '4,50 €' },
          { nom: 'Fondant Sans Gluten', prix: '5,40 €' },
        ],
      },
    ],
  },
];
