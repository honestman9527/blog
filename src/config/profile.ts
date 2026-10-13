export interface ProfileConfig {
  placeholder: boolean;
  name: string;
  role: string;
  introduction: string;
  location?: string;
  availableFor?: string;
  socials: ReadonlyArray<{ label: string; href: string }>;
  skills: readonly string[];
  experience: ReadonlyArray<{
    period: string;
    title: string;
    organization: string;
    description: string;
  }>;
}

// 替换此处即可更新首页和关于页；未填写的经历与链接不展示。
export const profile: ProfileConfig = {
  placeholder: true,
  name: "爱睡觉的老实人",
  role: "学生",
  introduction: "在这里介绍你关注的问题、正在做的事情，以及希望与谁交流。",
  socials: [],
  skills: ["前端 开发", "AI", "开源"],
  experience: [],
};
