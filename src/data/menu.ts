// Source unique du menu. Modifier les prix ici, la page /menu suit.
// Les prix sont des chaînes : on garde la virgule décimale et l'espace
// insécable avant l'euro, comme le veut la typographie française.
//
// ⚠️  À CONFIRMER AVANT LA MISE EN PRODUCTION
// Barista, Boissons, Petit Déj et Déjeuner reprennent la carte du
// 4 septembre (src/data/carte.ts, sorti de l'arbre au commit 1170409), dont
// les prix venaient eux-mêmes de LÜM Lille Centre. La formule Brunch n'a
// encore ni composition ni prix : la page affiche « à venir » à la place.

export interface Article {
  nom: string;
  prix: string;
}

export interface Rubrique {
  titre: string;
  articles: Article[];
}

export interface Formule {
  nom: string;
  prix?: string;
  composition: string[];
  supplement?: string;
}

// Servie tous les jours, semaine comme week-end.
export const carte: Rubrique[] = [
  {
    titre: 'Barista',
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
  {
    titre: 'Boissons',
    articles: [
      { nom: 'Eau St Amand 50 cl', prix: '1,90 €' },
      { nom: 'San Pellegrino 50 cl', prix: '2,60 €' },
      { nom: 'Citronnade Maison', prix: '3,90 €' },
      { nom: "Jus d'Orange Pressé", prix: '4,50 €' },
      { nom: 'Kombucha Goodsky', prix: '4,50 €' },
      { nom: 'Ginger Beer Bio', prix: '4,50 €' },
    ],
  },
];

// Une seule série de formules s'affiche, selon le jour : la semaine du lundi
// au vendredi, le week-end le samedi et le dimanche.
export const formules: Record<'semaine' | 'weekend', Formule[]> = {
  semaine: [
    {
      nom: 'Petit Déj',
      prix: '5,50 €',
      composition: ['1 Cookie ou Cinnamon Roll', '1 Café Filtre MUDA'],
    },
    {
      nom: 'Déjeuner',
      prix: '10,50 €',
      composition: [
        '1 Focaccia : Poulet Curry, Thon Gourmand ou Œufs Crémeux',
        '1 boisson : Eau St Amand, San Pellegrino ou Citronnade',
      ],
      supplement: '+2,00 € : Kombucha Goodsky ou Ginger Beer',
    },
  ],
  weekend: [
    {
      nom: 'Brunch',
      composition: [],
    },
  ],
};
