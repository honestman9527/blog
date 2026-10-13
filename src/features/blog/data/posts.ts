import { getCollection, type CollectionEntry } from 'astro:content';
import { selectPosts } from './publication';

export type Post = CollectionEntry<'blog'>;
export interface PostSummary {
  title: string;
  description: string;
  slug: string;
  url: string;
  publishedAt: string;
  tags: string[];
  draft: boolean;
  demo: boolean;
}

export async function getPosts(): Promise<Post[]> {
  return selectPosts(await getCollection('blog'), { preview: import.meta.env.DEV });
}

export function summarizePost(post: Post): PostSummary {
  return { ...post.data, url: `/blog/${post.data.slug}/` };
}

export function getTagCounts(
  posts: readonly Post[],
): Array<{ tag: string; count: number; url: string }> {
  const counts = new Map<string, number>();
  for (const post of posts)
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts]
    .sort(([a], [b]) => a.localeCompare(b, 'zh-CN'))
    .map(([tag, count]) => ({ tag, count, url: `/tags/${encodeURIComponent(tag)}/` }));
}
