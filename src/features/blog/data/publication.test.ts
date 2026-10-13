import { describe, expect, it } from 'vitest';
import { dateSchema } from '../../../shared/utils/content-validation';
import { paginate, selectPosts, shanghaiToday } from './publication';

const post = (slug: string, publishedAt: string, draft = false) => ({ data: { slug, publishedAt, draft } });
describe('publication policy', () => {
  it('uses Shanghai midnight rather than the host timezone', () => {
    expect(shanghaiToday(new Date('2026-10-12T16:00:00Z'))).toBe('2026-10-13');
    expect(shanghaiToday(new Date('2026-10-12T15:59:59Z'))).toBe('2026-10-12');
  });
  it('excludes drafts and future entries and sorts published posts', () => {
    const entries = [post('old', '2026-10-01'), post('today', '2026-10-13'), post('future', '2026-10-14'), post('draft', '2026-10-01', true)];
    const now = new Date('2026-10-12T16:00:00Z');
    expect(selectPosts(entries, { now }).map((entry) => entry.data.slug)).toEqual(['today', 'old']);
    expect(selectPosts(entries, { preview: true, now })).toHaveLength(4);
  });
  it('rejects duplicate slugs even when one is hidden', () => {
    expect(() => selectPosts([post('same', '2026-01-01'), post('same', '2099-01-01', true)])).toThrow('重复文章 slug');
  });
  it('validates actual calendar dates', () => {
    expect(dateSchema.safeParse('2026-02-30').success).toBe(false);
    expect(dateSchema.safeParse('2028-02-29').success).toBe(true);
  });
  it('paginates without omitting or repeating entries', () => {
    const entries = Array.from({ length: 23 }, (_, index) => index);
    expect([1, 2, 3].flatMap((page) => paginate(entries, page, 10))).toEqual(entries);
    expect(paginate(entries, 4, 10)).toEqual([]);
    expect(() => paginate(entries, 0, 10)).toThrow();
  });
});
