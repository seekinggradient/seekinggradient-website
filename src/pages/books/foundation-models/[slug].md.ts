import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { books } from '../../../books/books';

export function getStaticPaths() {
  return books.map((book) => ({
    params: { slug: book.slug },
    props: { contentSlug: book.contentSlug },
  }));
}

export const GET: APIRoute = async ({ params, props }) => {
  const contentSlug = String(props.contentSlug);
  const sourcePath = path.join(process.cwd(), 'src', 'content', 'books', `${contentSlug}.md`);
  const markdown = (await readFile(sourcePath, 'utf8')).replaceAll(
    '../../../assets/books/media/',
    '../../media/',
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${params.slug}.md"`,
    },
  });
};
