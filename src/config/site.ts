export interface SiteConfig {
  url: string;
  walineServerUrl: string;
  title: string;
  logo: string;
  favicon: string;
  description: string;
  locale: string;
  timezone: string;
  postsPerPage: number;
  navigation: ReadonlyArray<{ label: string; href: string }>;
}

export const siteConfig: SiteConfig = {
  url: 'https://blog.honestman.me',
  walineServerUrl: 'https://waline.honestman.me',
  title: '爱睡觉的老实人的门面',
  logo: '/hm-dark.svg',
  favicon: '/hm-light.svg',
  description: '个人作品、阅读记录。',
  locale: 'zh-CN',
  timezone: 'Asia/Shanghai',
  postsPerPage: 10,
  navigation: [
    { label: '项目', href: '/projects/' },
    { label: '文章', href: '/blog/' },
    { label: '关于', href: '/about/' },
    { label: '搜索', href: '/search/' },
  ],
};

export function getSiteUrl(publishing = false): URL {
  const message = 'siteConfig.url 必须为不含路径、凭据、查询和片段的 http(s) 站点地址。';
  let url: URL;
  try {
    url = new URL(siteConfig.url);
  } catch {
    throw new Error(message);
  }
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.pathname !== '/' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(message);
  }
  if (
    publishing &&
    (url.protocol !== 'https:' ||
      /(^|\.)(localhost|example\.(com|org|net|test)|test|invalid)$/.test(url.hostname) ||
      /^127\./.test(url.hostname) ||
      ['0.0.0.0', '[::1]'].includes(url.hostname))
  ) {
    throw new Error('发布前请将 siteConfig.url 配置为真实的 HTTPS 站点地址。');
  }
  return url;
}
