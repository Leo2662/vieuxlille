// Le fil de /actus : les articles du blog (src/content/blog/) et les
// articles de presse (src/data/presse.ts), mêlés du plus récent au plus
// ancien.
import { billets, dateIso, dateLisible, minutesDeLecture } from './blog';
import { parutions, moisLisible, type Lieu } from '../data/presse';

export type TypeActu = 'blog' | 'presse';

export interface Actu {
  type: TypeActu;
  /** AAAA-MM-JJ pour un article du blog, AAAA-MM pour la presse (mois seul). */
  date: string;
  dateLisible: string;
  titre: string;
  resume: string;
  url: string;
  /** Qui parle : le blog du LÜM, ou le titre de presse. */
  source: string;
  /** Sous la source : le temps de lecture, ou le site du journal. */
  detail: string;
  /** Presse seulement : l'adresse dont parle l'article. */
  lieu?: Lieu;
}

export async function actus(): Promise<Actu[]> {
  const blog: Actu[] = (await billets()).map((b) => ({
    type: 'blog',
    date: dateIso(b.data.date),
    dateLisible: dateLisible(b.data.date),
    titre: b.data.titre,
    resume: b.data.description,
    url: `/actus/${b.id}/`,
    source: 'Le blog LÜM',
    detail: `${minutesDeLecture(b.body)} min de lecture`,
  }));

  const presse: Actu[] = parutions.map((p) => ({
    type: 'presse',
    date: p.date,
    dateLisible: moisLisible(p.date),
    titre: p.titre,
    resume: p.resume,
    url: p.url,
    source: p.media,
    detail: p.site,
    lieu: p.lieu,
  }));

  // AAAA-MM-JJ et AAAA-MM se trient comme du texte. À mois égal, l'article
  // daté au jour passe devant celui daté au mois : c'est sans conséquence.
  return [...blog, ...presse].sort((a, b) => b.date.localeCompare(a.date));
}
