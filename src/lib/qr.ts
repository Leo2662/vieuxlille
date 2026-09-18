// Les QR codes sont générés au build à partir de ces cibles : l'image et le
// fichier téléchargeable sortent de la même source, donc ils ne peuvent pas
// diverger de l'URL réelle.
import QRCode from 'qrcode';

export interface Code {
  /** Sert à la fois d'identifiant et de nom du fichier téléchargé. */
  slug: string;
  titre: string;
  libelle: string;
  cible: string;
  /**
   * Niveau de correction d'erreur. Plus il est élevé, plus le code résiste
   * aux salissures — mais plus il est dense, donc plus il exige d'être
   * imprimé grand. Niveaux mesurés par décodage du rendu :
   *
   *   site  H (29×29) : lisible dès 80 px, la robustesse est gratuite ;
   *   avis  M (37×37) : son URL est longue, et en Q comme en H le code
   *                     devient trop dense pour être lu sous 160 px.
   */
  correction: 'L' | 'M' | 'Q' | 'H';
}

export const codes: Code[] = [
  {
    slug: 'qr-lum-vieux-lille',
    titre: 'Le site',
    libelle: 'lumvieuxlille.fr',
    cible: 'https://lumvieuxlille.fr',
    correction: 'H',
  },
  {
    slug: 'qr-avis-google',
    titre: 'Avis Google',
    libelle: "Formulaire d'avis de la fiche",
    cible:
      'https://search.google.com/local/writereview?placeid=ChIJzXLWKBcrw0cRI0DdWOWtaRM',
    correction: 'M',
  },
];

export function rendreSvg(code: Code): Promise<string> {
  return QRCode.toString(code.cible, {
    type: 'svg',
    errorCorrectionLevel: code.correction,
    margin: 2,
    color: { dark: '#944826', light: '#f9f1e6' },
  });
}
