export interface SiteConfig {
  title: string;
  description: string;
  locale: string;
  timezone: string;
  postsPerPage: number;
  navigation: ReadonlyArray<{ label: string; href: string }>;
}

export const siteConfig: SiteConfig = {
  title: '个人网站',
  description: '个人作品、工程实践与阅读记录。',
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
