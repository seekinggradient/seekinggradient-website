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

const books = defineCollection({
	schema: z.object({
		description: z.string(),
		read_type: z.string(),
		reading_time: z.string(),
		recommended: z.boolean(),
		verified: z.coerce.date(),
		audience: z.string(),
		companion_to: z.string().optional(),
		source_commit: z.string().optional(),
		sources: z.array(z.string()),
	}),
});

export const collections = { blog, notes, books };
