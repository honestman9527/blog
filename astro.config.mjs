import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');
const site = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || 'http://localhost:4321';
const parsed = new URL(site);
if (
  !['https:', 'http:'].includes(parsed.protocol) ||
  parsed.pathname !== '/' ||
  parsed.search ||
  parsed.hash
) {
  throw new Error('PUBLIC_SITE_URL 必须为不含路径、查询和片段的 http(s) 站点地址。');
}

export default defineConfig({
  site: parsed.origin,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
