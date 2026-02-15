import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		author: z.string(),
	}),
});

const notes = defineCollection({
	schema: z.object({
		pubDate: z.coerce.date(),
	}),
});

export const collections = { blog, notes };
