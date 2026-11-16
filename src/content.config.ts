// Les collections de contenu du site. Pour l'instant, une seule : le blog.
// Un article = un fichier Markdown dans src/content/blog/ ; son nom de
// fichier (sans .md) devient son adresse : /actus/<nom-du-fichier>/.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titre: z.string(),
    /** Une ou deux phrases : la liste des articles, les moteurs, les aperçus de partage. */
    description: z.string(),
    /** Date de parution, AAAA-MM-JJ. */
    date: z.coerce.date(),
    /** Un brouillon se voit en local (npm run dev) mais n'est pas publié. */
    brouillon: z.boolean().default(false),
  }),
});

export const collections = { blog };
