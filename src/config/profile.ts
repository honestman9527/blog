export interface ProfileConfig {
  placeholder: boolean;
  name: string;
  avatar?: string;
  role: string;
  introduction: string;
  location?: string;
  availableFor?: string;
  socials: ReadonlyArray<{
    label: string;
    href: string;
    icon?: 'github' | 'bilibili' | 'email';
  }>;
  skills: readonly string[];
  experience: ReadonlyArray<{
    period: string;
    title: string;
    organization: string;
    description: string;
  }>;
}

// 首页使用按时间变化的问候语；以下资料用于关于页，社交链接由两页共用。
export const profile: ProfileConfig = {
  placeholder: false,
  name: '爱睡觉的老实人',
  avatar: '/avatar.webp',
  role: '学生',
  introduction: '我正在关注前端开发、AI、开源等领域，欢迎交流。',
  socials: [
    { label: 'GitHub', href: 'https://github.com/honestman9527', icon: 'github' },
    { label: 'Bilibili', href: 'https://space.bilibili.com/1503382902', icon: 'bilibili' },
    { label: 'Email', href: 'mailto:hello@honestman.me', icon: 'email' },
  ],
  skills: [
    '前端开发',
    'AI',
    '开源',
    'Cloudflare Workers',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
  ],
  experience: [],
};
