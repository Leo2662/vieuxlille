import { getCollection, type CollectionEntry } from 'astro:content';

export type Billet = CollectionEntry<'blog'>;

/** Les articles publiés, du plus récent au plus ancien. Les brouillons ne
 *  sortent qu'en local. */
export async function billets(): Promise<Billet[]> {
  const tous = await getCollection('blog', ({ data }) => !import.meta.env.PROD || !data.brouillon);
  return tous.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** « 17 septembre 2026 ». À l'heure de Paris : une date seule, lue en UTC,
 *  ne doit pas glisser à la veille. */
export function dateLisible(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** AAAA-MM-JJ, pour l'attribut datetime et le balisage. */
export function dateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Temps de lecture arrondi à la minute, à 220 mots par minute. */
export function minutesDeLecture(texte = ''): number {
  const mots = texte.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 220));
}
