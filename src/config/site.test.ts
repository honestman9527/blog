import { afterEach, expect, it } from 'vitest';
import { getSiteUrl, siteConfig } from './site';

const originalUrl = siteConfig.url;
afterEach(() => {
  siteConfig.url = originalUrl;
});

it('allows a local origin for development and static builds', () => {
  siteConfig.url = 'http://localhost:4321/';
  expect(getSiteUrl().origin).toBe('http://localhost:4321');
});

it('allows a configured HTTPS origin for publishing', () => {
  siteConfig.url = 'https://blog.your-domain.tld:8443/';
  expect(getSiteUrl(true).origin).toBe('https://blog.your-domain.tld:8443');
});

it.each([
  '',
  'not a URL',
  'ftp://blog.your-domain.tld',
  'https://blog.your-domain.tld/path',
  'https://blog.your-domain.tld/?query=1',
  'https://blog.your-domain.tld/#section',
  'https://placeholder@blog.your-domain.tld',
])('rejects an invalid site origin: %s', (url) => {
  siteConfig.url = url;
  expect(() => getSiteUrl()).toThrow('siteConfig.url');
});

it.each([
  'http://blog.your-domain.tld',
  'https://example.com',
  'https://blog.example.org',
  'https://localhost',
  'https://blog.localhost',
  'https://127.0.0.1',
  'https://127.0.0.2',
  'https://[::1]',
  'https://0.0.0.0',
  'https://blog.test',
  'https://blog.invalid',
])('rejects a local or example publishing origin: %s', (url) => {
  siteConfig.url = url;
  expect(() => getSiteUrl(true)).toThrow('真实的 HTTPS 站点地址');
});
