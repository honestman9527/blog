---
title: 个人网站与写作空间
description: 用静态页面组织作品与文字，让内容、展示和外部服务保持清晰的边界。
slug: personal-site
stack: [Astro, TypeScript, Cloudflare]
featured: true
order: 1
demo: true
---

> 这是用于展示页面结构的示例项目，不代表真实客户或工作经历。请用自己的项目替换。

## 问题

一个个人网站既要介绍作者，也要容纳不断增长的文章。如果所有内容都混在页面组件里，更新和复用会越来越困难。

## 实现思路

将个人资料、项目与博客分别管理。Markdown 负责内容，Astro 负责预渲染，浏览器只承担必要的交互。

```ts
interface ProjectSummary {
  title: string;
  description: string;
  url: string;
}
```

## 可以展示的成果

这里可以填写实际解决的问题、你承担的职责、验证方式与结果。没有可验证的数据时，直接说明具体行为和改进。
