import type { APIRoute } from 'astro';
import { codes, rendreSvg } from '../lib/qr';

// Un fichier .svg par code, écrit dans dist/ au build : le bouton de
// téléchargement pointe dessus, sans JavaScript.
export function getStaticPaths() {
  return codes.map((code) => ({ params: { slug: code.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const code = codes.find((c) => c.slug === params.slug);
  if (!code) return new Response('Not found', { status: 404 });

  return new Response(await rendreSvg(code), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
};
