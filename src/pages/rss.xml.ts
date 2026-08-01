import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_TITLE, SITE_DESCRIPTION, NEWS_CATEGORIES } from '../consts';

export async function GET(context: APIContext) {
  const entries = (await getCollection('news')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  return rss({
    title: `${SITE_TITLE} ふなデブくん新聞部`,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description ?? `ふなデブくんの一言 🍐 — ${entry.data.hitokoto}`,
      categories: [NEWS_CATEGORIES[entry.data.category]],
      link: `/news/${entry.id}/`,
    })),
    customData: '<language>ja</language>',
  });
}
