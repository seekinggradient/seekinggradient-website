import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ideas } from '../ideas/data/ideas';

const SITE_URL = 'https://seekinggradient.com';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  const urls = [
    '<url><loc>https://seekinggradient.com/</loc></url>',
    '<url><loc>https://seekinggradient.com/tracking</loc></url>',
    '<url><loc>https://seekinggradient.com/ideas</loc></url>',
    '<url><loc>https://seekinggradient.com/ideas/about</loc></url>',
    '<url><loc>https://seekinggradient.com/ideas/mockups</loc></url>',
    ...ideas.map((idea) => `<url><loc>${SITE_URL}/ideas/${idea.slug}</loc></url>`),
    ...posts.map((post) => {
      const loc = `${SITE_URL}/blog/${post.slug}`;
      const lastmod = post.data.pubDate.toISOString().split('T')[0];
      return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
