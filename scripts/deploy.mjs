import { loadEnv } from 'vite';
import { spawnSync } from 'node:child_process';

const env = loadEnv('production', process.cwd(), 'PUBLIC_');
const raw = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL;
if (!raw) throw new Error('发布前请配置 PUBLIC_SITE_URL 为正式站点地址。');
const site = new URL(raw);
if (site.protocol !== 'https:' || /(^|\.)(localhost|example\.(com|org|net|test)|test|invalid)$/.test(site.hostname) || site.hostname === '127.0.0.1') {
  throw new Error('发布需要真实的 HTTPS 站点地址，请替换本地或示例域名。');
}
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
for (const args of [['lint'], ['build'], ['exec', 'wrangler', 'deploy']]) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
