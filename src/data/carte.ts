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
    titre: 'À Grignoter',
    articles: [
      { nom: '15 Mini Saucissons', prix: '6,00 €' },
      { nom: '30 Mini Saucissons', prix: '11,50 €' },
    ],
  },
  {
    titre: 'Bières',
    articles: [
      { nom: 'Triple Bellus 8° — 50 cl (Ferme Brasserie de Beaumont)', prix: '7,50 €' },
      { nom: 'Triple Bellus 8° — 25 cl', prix: '4,00 €' },
      { nom: 'Colibri blonde 5,5° — 50 cl (Nanobrasserie lilloise)', prix: '6,00 €' },
      { nom: 'Colibri blonde 5,5° — 25 cl', prix: '3,50 €' },
    ],
  },
  {
    titre: 'Vin',
    articles: [{ nom: 'Uby — 12 cl', prix: '5,00 €' }],
  },
  {
    titre: 'Formule',
    articles: [{ nom: '15 Mini Saucissons + Pain & Beurre', prix: '7,50 €' }],
  },
];
