import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteConfig } from '@/config/site';
import { getPosts } from '@/features/blog/index';

export async function GET(context: APIContext) {
  return rss({ title: siteConfig.title, description: siteConfig.description, site: context.site!, customData: '<language>zh-CN</language>', items: (await getPosts()).map(({ data }) => ({ title: data.title, description: data.description, link: `/blog/${data.slug}/`, pubDate: new Date(`${data.publishedAt}T00:00:00+08:00`), categories: data.tags })) });
}
