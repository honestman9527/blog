import { siteConfig } from '../../../config/site';

export interface CommentConfig {
  serverURL: string;
  path: string;
}

export function normalizeCommentPath(path: string): string {
  const pathname = new URL(path, 'https://path.invalid').pathname
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
  return `${pathname}/`;
}

export function getCommentConfig(path: string, enabled = true): CommentConfig | null {
  const serverURL = siteConfig.walineServerUrl.trim().replace(/\/+$/, '');
  if (!enabled || !serverURL) return null;
  const message = 'siteConfig.walineServerUrl 必须为不含凭据、查询和片段的 http(s) 地址。';
  let url: URL;
  try {
    url = new URL(serverURL);
  } catch {
    throw new Error(message);
  }
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error(message);
  return { serverURL, path: normalizeCommentPath(path) };
}
