export interface ProfileConfig {
  placeholder: boolean;
  name: string;
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
  placeholder: true,
  name: '爱睡觉的老实人',
  role: '学生',
  introduction: '在这里介绍你关注的问题、正在做的事情，以及希望与谁交流。',
  socials: [
    { label: 'GitHub', href: '', icon: 'github' },
    { label: 'Bilibili', href: '', icon: 'bilibili' },
    { label: 'Email', href: '', icon: 'email' },
  ],
  skills: ['前端 开发', 'AI', '开源'],
  experience: [],
};
