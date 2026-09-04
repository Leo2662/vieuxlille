// Source unique de la carte. Modifier les prix ici, les pages suivent.
// Les prix sont des chaînes : on garde la virgule décimale et l'espace
// insécable avant l'euro, comme le veut la typographie française.
//
// ⚠️  À RELIRE — CES PRIX SONT DÉJÀ PUBLICS
// Hors rubrique Spécial Braderie, les prix sont ceux de LÜM Lille Centre :
// à confirmer boutique par boutique. Le café de torréfaction MUDA et le
// kombucha Goodsky sont propres au Vieux-Lille et ont gardé le prix de la
// ligne correspondante à Lille Centre.

export interface Article {
  nom: string;
  prix: string;
  description?: string;
}

export interface Rubrique {
  titre: string;
  articles: Article[];
}

export interface Formule {
  nom: string;
  prix: string;
  composition: string[];
  supplement?: string;
}

export const rubriques: Rubrique[] = [
  {
    titre: 'Salé',
    articles: [
      {
        nom: 'Focaccia Poulet Curry',
        prix: '8,90 €',
        description: 'Poulet au curry, salade fraîche & tomates',
      },
      {
        nom: 'Focaccia Thon Gourmand',
        prix: '8,90 €',
        description: 'Thon, mayonnaise, salade fraîche & tomates',
      },
      {
        nom: 'Focaccia Œufs Crémeux',
        prix: '8,90 €',
        description: "Salade d'œufs, ciboulette, salade fraîche & tomate",
      },
    ],
  },
  {
    titre: 'Sucré & Pâtisseries',
    articles: [
      { nom: 'Cookie', prix: '4,00 €' },
      { nom: 'Cinnamon Roll', prix: '4,50 €' },
      { nom: 'Brookie', prix: '4,90 €' },
      { nom: 'Marbré / Cake Matcha', prix: '4,50 €' },
      { nom: 'Fondant Sans Gluten', prix: '5,40 €' },
    ],
  },
  {
    // Offre des 5 & 6 septembre. À retirer une fois la braderie passée.
    titre: 'Spécial Braderie',
    articles: [
      {
        nom: 'Triple Bellus — 25 cl',
        prix: '3,50 €',
        description: 'Bière artisanale de la Ferme Brasserie de Beaumont',
      },
      { nom: 'Triple Bellus — 50 cl', prix: '7,00 €' },
      {
        nom: 'Colibri — 25 cl',
        prix: '3,00 €',
        description: 'Bière de la nanobrasserie lilloise Colibri',
      },
      { nom: 'Colibri — 50 cl', prix: '6,00 €' },
      { nom: 'Verre de Vin UBY', prix: '5,00 €' },
    ],
  },
  {
    titre: 'Boissons',
    articles: [
      { nom: 'Eau St Amand 50 cl', prix: '1,90 €' },
      { nom: 'San Pellegrino 50 cl', prix: '2,60 €' },
      { nom: 'Citronnade Maison', prix: '3,90 €' },
      { nom: "Jus d'Orange Pressé", prix: '4,50 €' },
      { nom: 'Kombucha Goodsky', prix: '4,50 €' },
      { nom: 'Ginger Beer Bio', prix: '4,50 €' },
    ],
  },
  {
    titre: 'Barista',
    articles: [
      { nom: 'Espresso', prix: '2,50 €' },
      { nom: 'Double Espresso', prix: '3,70 €' },
      { nom: 'Café Allongé', prix: '3,70 €' },
      { nom: 'Café Filtre MUDA', prix: '3,60 €' },
      { nom: 'Cappuccino', prix: '4,50 €' },
      { nom: 'Latte', prix: '5,20 €' },
      { nom: 'Chocolat Chaud', prix: '5,00 €' },
      { nom: 'Chaï Latte', prix: '5,00 €' },
      { nom: 'Matcha Latte', prix: '5,00 €' },
      { nom: 'Iced Americano', prix: '4,20 €' },
      { nom: 'Iced Latte', prix: '5,00 €' },
      { nom: 'Iced Chaï Latte', prix: '5,70 €' },
      { nom: 'Iced Matcha Latte', prix: '5,70 €' },
    ],
  },
];

export const formules: Formule[] = [
  {
    nom: 'Petit Déj Gourmand',
    prix: '5,50 €',
    composition: ['1 Cookie ou Cinnamon Roll', '1 Café Filtre MUDA'],
  },
  {
    nom: 'Déjeuner',
    prix: '10,50 €',
    composition: [
      '1 Focaccia : Poulet Curry, Thon Gourmand ou Œufs Crémeux',
      '1 boisson : Eau St Amand, San Pellegrino ou Citronnade',
    ],
    supplement: '+2,00 € : Kombucha Goodsky ou Ginger Beer',
  },
  {
    nom: 'Goûter',
    prix: '8,00 €',
    composition: [
      '1 pâtisserie : Cookie, Cinnamon Roll, Brookie ou Marbré / Cake Matcha',
      '1 boisson : Cappuccino, Latte, Chocolat Chaud ou Iced Americano',
    ],
    supplement: '+0,80 € : Fondant Sans Gluten',
  },
];
