import { z } from 'astro/zod';

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 使用小写英文、数字与连字符');
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式为 YYYY-MM-DD').refine((value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}, '日期不存在');

export function assertUniqueSlugs<T extends { data: { slug: string } }>(entries: readonly T[], label: string): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.data.slug)) throw new Error(`重复${label} slug: ${entry.data.slug}`);
    seen.add(entry.data.slug);
  }
}
