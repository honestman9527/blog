import { spawnSync } from 'node:child_process';
import { getSiteUrl } from '../src/config/site.ts';

getSiteUrl(true);
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
for (const args of [['lint'], ['build'], ['exec', 'wrangler', 'deploy']]) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
