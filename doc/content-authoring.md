# 内容写作

文章和项目使用 Markdown，保存在 src/content。个人资料集中在 src/config/profile.ts：填写 name、role、introduction、skills、socials 与 experience 后，将 placeholder 设为 false。placeholder 为 true 时关于页隐藏模板简介；空社交链接与空经历不渲染。

首页只展示按访客本地时间变化的一句问候语和社交图标；禁用 JavaScript 时显示通用问候语。问候文案和时段在 src/features/profile/data/greeting.ts 调整。首页与关于页共用 socials：填写 GitHub、Bilibili 的个人主页 href，邮箱 href 使用 `mailto:你的公开邮箱`。icon 支持 github、bilibili、email，未指定图标时显示 label 文字（mailto 链接默认使用邮箱图标）；label 同时是可访问名称与悬停提示。项目与文章从导航进入。

项目放在 src/content/projects，必填 title、description、slug。slug 使用小写英文、数字和连字符，更新标题或移动文件不改变 slug。可选 stack、featured、order、draft、demo 和 links（label 与 http(s) href）。项目按 order 排列，正式构建过滤 draft 项目；featured 保留兼容已有内容，首页不再展示项目。

目前两份项目是结构示例，demo: true 显示示例标记；没有发布真实工具或虚构成果。

## 文章

文章放在 src/content/blog，支持 Markdown 的标题、列表、表格、引用与围栏代码。不要添加 MDX 或在内容中承担组件逻辑。

```yaml
title: 文章标题
description: 一两句摘要
slug: stable-post-name
publishedAt: '2026-10-13'
updatedAt: '2026-10-14' # 可选
tags: [工程实践, TypeScript]
draft: false
comments: true
demo: false
```

标题、摘要、slug、发布日期必填。日期为真实存在的 YYYY-MM-DD；使用 Asia/Shanghai 的发布日。标签支持中文，不能包含路径保留字符，重复标签会合并。项目和文章各自不允许重复 slug，包含草稿；改标题或移动文件时保持 slug，即可保留链接与评论身份。已有文章如需更改 slug，应另行安排重定向和评论迁移。

正式构建只发布 draft 为 false 且发布日期不晚于当天的文章。列表、详情、标签、归档、RSS、sitemap 与搜索遵循同一筛选。未来文章不是实时定时发布：到期后重新构建才会公开。开发服务可预览草稿与未来文章。

主文章列表每页 10 篇；标签页和归档展示对应的全部文章。每页数量可在 siteConfig 调整。列表仅显示标题、摘要、日期及必要标记，标签与技术栈在详情页展示。文章目录取二、三级标题。comments: false 关闭该篇评论；全站未配置 Waline 地址时也不显示评论。

首版三篇文章为排版示例。上线前替换或删除示例项目、示例文章、作者占位资料，并修改站点名称和描述。

示例内容明确标记示例，发布真实网站前替换或移除。不填写虚构任职、项目成绩和社交链接。
