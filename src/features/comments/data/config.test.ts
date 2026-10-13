import { afterEach, expect, it } from 'vitest';
import { siteConfig } from '../../../config/site';
import { getCommentConfig, normalizeCommentPath } from './config';

const originalServerUrl = siteConfig.walineServerUrl;
afterEach(() => {
  siteConfig.walineServerUrl = originalServerUrl;
});

it('uses one comment identity for trailing slashes, queries and fragments', () => {
  expect(normalizeCommentPath('/blog/static-first')).toBe('/blog/static-first/');
  expect(normalizeCommentPath('/blog/static-first/?ref=rss#comments')).toBe('/blog/static-first/');
  expect(normalizeCommentPath('/')).toBe('/');
});

it.each(['', '  '])('disables comments with an empty service address: %j', (serverUrl) => {
  siteConfig.walineServerUrl = serverUrl;
  expect(getCommentConfig('/blog/static-first/')).toBeNull();
});

it('disables comments for an individual post without validating the service address', () => {
  siteConfig.walineServerUrl = 'not a URL';
  expect(getCommentConfig('/blog/static-first/', false)).toBeNull();
});

it('preserves a service subpath and normalizes the discussion identity', () => {
  siteConfig.walineServerUrl = ' https://comments.your-domain.tld/waline/// ';
  expect(getCommentConfig('/blog/static-first?ref=rss#comments')).toEqual({
    serverURL: 'https://comments.your-domain.tld/waline',
    path: '/blog/static-first/',
  });
});

it('supports a local HTTP comment service', () => {
  siteConfig.walineServerUrl = 'http://localhost:8360/';
  expect(getCommentConfig('/blog/static-first/')).toEqual({
    serverURL: 'http://localhost:8360',
    path: '/blog/static-first/',
  });
});

it.each([
  'not a URL',
  'ftp://comments.your-domain.tld',
  'https://placeholder@comments.your-domain.tld',
  'https://comments.your-domain.tld/?query=1',
  'https://comments.your-domain.tld/#section',
])('rejects an invalid public service address: %s', (serverUrl) => {
  siteConfig.walineServerUrl = serverUrl;
  expect(() => getCommentConfig('/blog/static-first/')).toThrow('siteConfig.walineServerUrl');
});
