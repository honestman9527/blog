import { assertUniqueSlugs } from '../../../shared/utils/content-validation';

interface Publishable { data: { slug: string; publishedAt: string; draft: boolean }; }

export function shanghaiToday(now: Date): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function selectPosts<T extends Publishable>(posts: readonly T[], { preview = false, now = new Date() } = {}): T[] {
  assertUniqueSlugs(posts, '文章');
  const today = shanghaiToday(now);
  return posts.filter(({ data }) => preview || (!data.draft && data.publishedAt <= today))
    .sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt) || a.data.slug.localeCompare(b.data.slug));
}

export function paginate<T>(items: readonly T[], page: number, size: number): T[] {
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1) throw new Error('页码和每页数量必须为正整数');
  return items.slice((page - 1) * size, page * size);
}
