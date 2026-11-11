// La carte cadeau en PDF : un A5 à l'italienne, à imprimer ou à transférer.
// Même grammaire que le site : fond terre cuite, carte crème aux angles
// arrondis, titres Anton, texte Nunito, accents manuscrits Caveat, et le
// œuf cocotte au trait de la page brunch.

import { readFileSync } from 'node:fs';
import fontkit from '@pdf-lib/fontkit';
import { LineCapStyle, PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { brunchs, dateLongue, type CartePayee } from './commande.js';

const hex = (h: string) =>
  rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);

const C = {
  terracotta: hex('#944826'),
  terracottaClair: hex('#c4714a'),
  brun: hex('#5c3d2e'),
  creme: hex('#f9f1e6'),
};

// Polices statiques (les fichiers variables du site ne s'embarquent pas
// dans un PDF). Licence SIL Open Font License, voir api/_fonts/.
const police = (fichier: string) => readFileSync(new URL(`../_fonts/${fichier}`, import.meta.url));

// A5 paysage, en points.
const L = 595.28;
const H = 419.53;

/** Rectangle arrondi en chemin SVG, origine en haut à gauche. */
function rectArrondi(w: number, h: number, r: number): string {
  return `M${r} 0H${w - r}A${r} ${r} 0 0 1 ${w} ${r}V${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}H${r}A${r} ${r} 0 0 1 0 ${h - r}V${r}A${r} ${r} 0 0 1 ${r} 0Z`;
}

/** Ellipse en chemin SVG, pour reprendre l'œuf cocotte tel qu'il est dessiné sur le site. */
function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
}

// L'œuf cocotte de src/components/Brunch.astro (viewBox 120 × 84).
const COCOTTE = [
  'M48 16c-3-3.5 3-6.5 0-10 M60 14c-3-3.5 3-6.5 0-10 M72 16c-3-3.5 3-6.5 0-10',
  ellipse(60, 34, 46, 13),
  ellipse(60, 34, 37, 8.5),
  ellipse(62, 33.5, 9, 4.5),
  'M37 33l3-1.2 M80 36.5l2.8.8 M44 37.5l2.6.6 M78 29.5l2.4-.6',
  'M14 34v6c0 8 3 20 8 26 6 7 21 11 38 11s32-4 38-11c5-6 8-18 8-26v-6',
  'M30 50l1.5 16 M45 52l.8 19 M60 53v20 M75 52l-.8 19 M90 50l-1.5 16',
];

/** Largeur d'un texte interlettré. */
function largeur(texte: string, font: PDFFont, taille: number, espacement = 0): number {
  return font.widthOfTextAtSize(texte, taille) + espacement * Math.max(texte.length - 1, 0);
}

/** Texte interlettré, lettre par lettre : pdf-lib n'a pas d'interlettrage. */
function texte(
  page: PDFPage,
  contenu: string,
  o: { x: number; y: number; font: PDFFont; taille: number; couleur: ReturnType<typeof rgb>; espacement?: number; aligne?: 'gauche' | 'centre' | 'droite' },
) {
  const esp = o.espacement ?? 0;
  const w = largeur(contenu, o.font, o.taille, esp);
  let x = o.aligne === 'centre' ? o.x - w / 2 : o.aligne === 'droite' ? o.x - w : o.x;
  if (!esp) {
    page.drawText(contenu, { x, y: o.y, font: o.font, size: o.taille, color: o.couleur });
    return;
  }
  for (const lettre of contenu) {
    page.drawText(lettre, { x, y: o.y, font: o.font, size: o.taille, color: o.couleur });
    x += o.font.widthOfTextAtSize(lettre, o.taille) + esp;
  }
}

/** Coupe un texte en lignes qui tiennent dans `max` points, en gardant les retours à la ligne. */
function couper(contenu: string, font: PDFFont, taille: number, max: number): string[] {
  const lignes: string[] = [];
  for (const paragraphe of contenu.split('\n')) {
    let ligne = '';
    for (const mot of paragraphe.split(' ')) {
      const essai = ligne ? `${ligne} ${mot}` : mot;
      if (font.widthOfTextAtSize(essai, taille) <= max) {
        ligne = essai;
      } else {
        if (ligne) lignes.push(ligne);
        // Un mot plus long que la ligne entière est coupé net.
        let reste = mot;
        while (font.widthOfTextAtSize(reste, taille) > max) {
          let n = reste.length;
          while (n > 1 && font.widthOfTextAtSize(reste.slice(0, n), taille) > max) n--;
          lignes.push(reste.slice(0, n));
          reste = reste.slice(n);
        }
        ligne = reste;
      }
    }
    lignes.push(ligne);
  }
  return lignes;
}

export async function genererCarte(carte: CartePayee): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  // Dates fixes : la même commande redonne le même document.
  doc.setTitle(`Carte cadeau brunch LÜM — ${carte.code}`);
  doc.setAuthor('LÜM Vieux-Lille');
  doc.setCreator('lumvieuxlille.fr');
  doc.setProducer('lumvieuxlille.fr');
  doc.setCreationDate(carte.payeeLe);
  doc.setModificationDate(carte.payeeLe);

  const [anton, nunito7, nunito8, caveat] = await Promise.all([
    doc.embedFont(police('anton.ttf'), { subset: true }),
    doc.embedFont(police('nunito-700.ttf'), { subset: true }),
    doc.embedFont(police('nunito-800.ttf'), { subset: true }),
    // Caveat est embarquée entière : le sous-ensemble de pdf-lib perd la
    // moitié de ses lettres. Le fichier est déjà réduit (voir api/_fonts/).
    doc.embedFont(police('caveat-600.ttf')),
  ]);

  const page = doc.addPage([L, H]);

  // Fond terre cuite, carte crème, filet intérieur comme les cartouches du site.
  page.drawRectangle({ x: 0, y: 0, width: L, height: H, color: C.terracotta });
  page.drawSvgPath(rectArrondi(L - 32, H - 32, 22), { x: 16, y: H - 16, color: C.creme });
  page.drawSvgPath(rectArrondi(L - 56, H - 56, 14), {
    x: 28,
    y: H - 28,
    borderColor: C.terracottaClair,
    borderWidth: 2,
  });

  // --- Colonne de gauche : à qui, de qui, le petit mot -----------------
  const g = 52;
  const largeurGauche = 290;

  texte(page, 'LÜM', { x: g, y: 350, font: anton, taille: 26, couleur: C.terracotta, espacement: 1.5 });
  texte(page, 'VIEUX-LILLE', { x: g + 1, y: 339, font: nunito8, taille: 6.5, couleur: C.terracotta, espacement: 1.6 });

  texte(page, 'CARTE CADEAU', { x: g, y: 286, font: anton, taille: 44, couleur: C.terracotta, espacement: 0.8 });

  const accroche = `${brunchs(carte.quantite)} ${carte.pour ? `pour ${carte.pour}` : 'à savourer'}`;
  let tailleAccroche = 26;
  while (tailleAccroche > 16 && caveat.widthOfTextAtSize(accroche, tailleAccroche) > largeurGauche) tailleAccroche--;
  texte(page, accroche, { x: g, y: 254, font: caveat, taille: tailleAccroche, couleur: C.terracotta });

  texte(page, `DE LA PART DE ${carte.prenom.toLocaleUpperCase('fr-FR')}`, {
    x: g,
    y: 234,
    font: nunito8,
    taille: 8.5,
    couleur: C.brun,
    espacement: 1.2,
  });

  // Le petit mot, dans un cadre ; la taille baisse jusqu'à ce qu'il tienne.
  const cadre = { x: g, haut: 218, l: largeurGauche, h: 118 };
  page.drawSvgPath(rectArrondi(cadre.l, cadre.h, 14), {
    x: cadre.x,
    y: cadre.haut,
    borderColor: C.terracottaClair,
    borderWidth: 1.6,
    borderDashArray: [4, 3],
    borderLineCap: LineCapStyle.Round,
  });
  const mot = carte.mot || 'Un salé, un sucré, une boisson chaude, une boisson froide… et tout le temps de les savourer.';
  const interieur = cadre.l - 32;
  let taille = 19;
  let lignes = couper(mot, caveat, taille, interieur);
  while (taille > 11 && lignes.length * taille * 1.12 > cadre.h - 24) {
    taille -= 0.5;
    lignes = couper(mot, caveat, taille, interieur);
  }
  const interligne = taille * 1.12;
  const blocMot = lignes.length * interligne;
  let y = cadre.haut - cadre.h / 2 + blocMot / 2 - taille * 0.8;
  for (const ligne of lignes) {
    texte(page, ligne, { x: cadre.x + 16, y, font: caveat, taille, couleur: C.terracotta });
    y -= interligne;
  }

  // --- Colonne de droite : l'œuf cocotte et ce que la carte offre -----------
  const centre = 452;
  const echelle = 1.3;
  for (const trace of COCOTTE) {
    page.drawSvgPath(trace, {
      x: centre - 60 * echelle,
      y: 362,
      scale: echelle,
      borderColor: C.terracotta,
      borderWidth: 4 * echelle,
      borderLineCap: LineCapStyle.Round,
    });
  }

  const titreFormule = carte.quantite > 1 ? `${carte.quantite} FORMULES BRUNCH` : 'LA FORMULE BRUNCH';
  texte(page, titreFormule, { x: centre, y: 220, font: anton, taille: 19, couleur: C.terracotta, espacement: 0.4, aligne: 'centre' });
  let yDroite = 202;
  for (const ligne of couper('Un salé, un sucré, une boisson chaude et une boisson froide, au choix.', nunito7, 9.5, 170)) {
    texte(page, ligne, { x: centre, y: yDroite, font: nunito7, taille: 9.5, couleur: C.brun, aligne: 'centre' });
    yDroite -= 13;
  }
  yDroite -= 6;
  texte(page, 'LE WEEK-END, 11H – 15H30', { x: centre, y: yDroite, font: nunito8, taille: 8.5, couleur: C.terracotta, espacement: 0.9, aligne: 'centre' });
  yDroite -= 14;
  texte(page, '94 rue Saint-André, Vieux-Lille', { x: centre, y: yDroite, font: nunito7, taille: 9, couleur: C.brun, aligne: 'centre' });

  // --- Bandeau du bas : le code et la validité -------------------------
  const libelle = 'CODE';
  const tailleCode = 12.5;
  const lCode = largeur(libelle, nunito8, 7.5, 1.4) + 10 + largeur(carte.code, nunito8, tailleCode, 1.2) + 36;
  page.drawSvgPath(rectArrondi(lCode, 30, 15), { x: g, y: 76, color: C.terracotta });
  texte(page, libelle, { x: g + 18, y: 57.5, font: nunito8, taille: 7.5, couleur: C.creme, espacement: 1.4 });
  texte(page, carte.code, {
    x: g + 18 + largeur(libelle, nunito8, 7.5, 1.4) + 10,
    y: 56,
    font: nunito8,
    taille: tailleCode,
    couleur: C.creme,
    espacement: 1.2,
  });

  const droite = L - 52;
  texte(page, `Valable jusqu'au ${dateLongue(carte.valableJusquau)}`, { x: droite, y: 63, font: nunito8, taille: 10, couleur: C.terracotta, aligne: 'droite' });
  texte(page, 'Réservation conseillée au 06 42 99 62 42', { x: droite, y: 49, font: nunito7, taille: 8.5, couleur: C.brun, aligne: 'droite' });

  return doc.save();
}
