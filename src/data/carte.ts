// Source unique de la carte. Modifier les prix ici, la page suit.
// Les prix sont des chaînes : on garde la virgule décimale, comme le veut la
// typographie française.
//
// Carte réduite à l'offre des 5 & 6 septembre. L'ancienne carte complète
// (focaccias, pâtisseries, boissons, barista, formules) reste dans
// l'historique git si elle doit revenir après la braderie.

export interface Article {
  nom: string;
  prix: string;
  description?: string;
}

export interface Rubrique {
  titre: string;
  articles: Article[];
}

export const rubriques: Rubrique[] = [
  {
    titre: 'Spécial Braderie',
    articles: [
      { nom: 'Triple Bellus 8° — 25 cl (Ferme Brasserie de Beaumont)', prix: '3,50 €' },
      { nom: 'Triple Bellus 8° — 50 cl', prix: '7,00 €' },
      { nom: 'Colibri blonde 5,5° — 25 cl (Nanobrasserie du Colibri)', prix: '3,00 €' },
      { nom: 'Colibri blonde 5,5° — 50 cl', prix: '6,00 €' },
      { nom: 'Verre de Vin UBY', prix: '5,00 €' },
    ],
  },
  {
    titre: 'Formules Spécial Braderie',
    articles: [
      { nom: 'Burrata Pesto', prix: '8,50 €' },
      { nom: '2 Bières Colibri 25 cl + Burrata', prix: '14,50 €' },
      { nom: '15 Mini Saucissons', prix: '6,00 €' },
      { nom: '30 Mini Saucissons', prix: '11,50 €' },
    ],
  },
];
