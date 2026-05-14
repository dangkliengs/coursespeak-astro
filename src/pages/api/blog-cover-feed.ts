import type { APIRoute } from 'astro';
import { buildBlogFeedCoverSvg } from '../../lib/blogCoverSvg';

export const GET: APIRoute = () => {
  const svg = buildBlogFeedCoverSvg();
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
