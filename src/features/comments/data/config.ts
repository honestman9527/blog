export interface CommentConfig { serverURL: string; path: string; }

export function normalizeCommentPath(path: string): string {
  const pathname = new URL(path, 'https://path.invalid').pathname.replace(/\/+/g, '/').replace(/\/$/, '');
  return `${pathname}/`;
}

export function getCommentConfig(path: string, enabled = true): CommentConfig | null {
  const serverURL = import.meta.env.PUBLIC_WALINE_SERVER_URL?.trim().replace(/\/$/, '');
  if (!enabled || !serverURL) return null;
  const url = new URL(serverURL);
  if (!['https:', 'http:'].includes(url.protocol) || url.search || url.hash || url.username || url.password) throw new Error('PUBLIC_WALINE_SERVER_URL 必须为不含凭据、查询和片段的 http(s) 地址');
  return { serverURL, path: normalizeCommentPath(path) };
}
