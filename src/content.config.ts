import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['discord', 'local', 'tech']),
    // ふなデブくんの一言 🍐 — 全記事に付けるサイトの署名要素
    hitokoto: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { news };
