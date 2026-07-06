import type { APIRoute } from 'astro';
import { buildBlogCoverSvg, formatBlogDateLabel } from '../../../lib/blogCoverSvg';
import { getAvailableDates } from '../../../lib/store.js';

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export const prerender = true;

export async function getStaticPaths() {
  const dates = await getAvailableDates();
  return dates.map((date) => ({
    params: { date },
  }));
}

export const GET: APIRoute = ({ params }) => {
  const date = params.date;
  if (!date || !ISO.test(date)) {
    return new Response('Not found', { status: 404 });
  }
  const label = formatBlogDateLabel(date);
  const svg = buildBlogCoverSvg({ dateLabel: label });
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
