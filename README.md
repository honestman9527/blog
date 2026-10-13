# 个人网站

Astro 静态个人作品网站与 Markdown 博客，面向 Cloudflare Workers Static Assets。

使用 Node 24.21+（24 系列）与 pnpm 12.11.2。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

包含个人介绍、经历、Markdown 项目详情、博客、标签、归档、静态分页、目录、代码复制、RSS、SEO、中文搜索及按需加载的 Waline 评论。默认纯深色，字体自托管；React 和 shadcn/ui 仅在后续确有需求时引入。

首页只展示一句随访客本地时间变化的问候语和社交图标（Simple Icons），GitHub、Bilibili 与邮箱地址在 src/config/profile.ts 填写，空链接隐藏。项目与文章从导航进入；列表保留标题、摘要、日期及必要示例标记，标签与技术栈在详情查看。

修改 src/config/site.ts 的站点设置、src/config/profile.ts 的个人资料；项目和文章分别放在 src/content/projects 与 src/content/blog。首次交付使用明确标记的示例内容和空经历，上线前请替换。

公开配置集中在 src/config/site.ts：url 用于 canonical、RSS、robots 和 sitemap，初始值为 http://localhost:4321，正式发布前填写真实 HTTPS 地址；walineServerUrl 留空时不显示评论。Waline 服务端与数据库独立部署。

常规代码改动只需 `pnpm lint`。`pnpm build` 生成静态网站和 Pagefind 索引；随后 `pnpm preview` 或 `pnpm preview:worker` 查看构建版本。搜索需要构建后的索引。布局与响应式由人工验收，不运行自动截图或布局测试。

- [项目规则](AGENTS.md)与[工作流](doc/workflow.md)
- [架构与依赖边界](doc/architecture.md)
- [内容写作与发布规则](doc/content-authoring.md)
- [设计适配](doc/design.md)与[原始参考](DESIGN.md)
- [Workers 部署与 Waline 配置](doc/deployment.md)

`pnpm format` 统一格式，`pnpm format:check` 检查格式。GitHub Actions 执行格式检查与 lint，纯文档变更只检查格式；不自动提交、合并或部署。首次交付不 push、不远端发布。
