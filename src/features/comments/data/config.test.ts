import { expect, it } from 'vitest';
import { normalizeCommentPath } from './config';

it('uses one comment identity for trailing slashes, queries and fragments', () => {
  expect(normalizeCommentPath('/blog/static-first')).toBe('/blog/static-first/');
  expect(normalizeCommentPath('/blog/static-first/?ref=rss#comments')).toBe('/blog/static-first/');
  expect(normalizeCommentPath('/')).toBe('/');
});
