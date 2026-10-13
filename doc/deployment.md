# 部署

目标为 Cloudflare Workers Static Assets。Astro 预渲染输出 dist，不使用 SSR 适配器或 Worker 入口。Wrangler 中只有 assets 配置，没有 main、SSR 或数据库 binding。参考 [官方 Astro 指南](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)。首次交付不远端部署。

公开环境变量参见 .env.example。正式发布前替换 PUBLIC_SITE_URL；PUBLIC_WALINE_SERVER_URL 指向独立 Waline 服务，留空时不显示评论。Waline 数据库密码等仅放在其独立服务端。

## 本地与发布

1. 使用 Node 24.21+（24 系列）、pnpm 12.11.2，执行 pnpm install --frozen-lockfile。
2. 需要自定义配置时，将 .env.example 复制为 .env。替换站点 URL，编辑 src/config/site.ts 与 src/config/profile.ts，替换示例内容。
3. 执行 pnpm build。该命令依次构建 Astro 与 Pagefind；不要单独使用 astro build 发布，否则缺少搜索索引。
4. 若需要本地查看 Workers 的实际路由行为，执行 pnpm preview:worker。目录 URL 自动规范尾斜杠，不存在的页面使用 404.html 并返回 404；没有 SPA 回退。布局与响应式由人工验收。
5. 配置变更确需验证时，执行 pnpm deploy:dry-run；它不发布资源。
6. 由你决定正式发布时，先完成 Cloudflare 认证，修改 wrangler.jsonc 的 name，再执行 pnpm deploy。

pnpm deploy 会先拒绝未填写、示例或本地站点 URL，再执行 lint、构建和 wrangler deploy。CI 不部署。首次使用 workers.dev 时，可按账户子域确定正式 URL 后填入 PUBLIC_SITE_URL；自定义域名在 Cloudflare 为对应 Worker 绑定。网址更换后重新构建，使 canonical、RSS、robots 和 sitemap 一起更新。

所有页面、字体和搜索索引随 dist 发布。带哈希的 Astro 资源使用长期缓存；Pagefind 文件通过重新验证获取当前索引。更新文章、配置或 Waline 地址都需要重新构建和发布。

## Waline

提供独立的 Waline 服务端和数据库，填入其公开根地址，例如 https://comments.your-domain.tld。地址可带部署子路径；客户端会调用其 api/ 路径。不要填写管理登录地址或数据库连接串。

根据服务端设置放行博客来源：若启用 SECURE_DOMAINS，包含博客和 Waline 服务域名，确保服务的 CORS 允许博客。详见 [Waline 服务配置](https://waline.js.org/en/reference/server/env.html)。本站默认关闭表情源、图片上传、GIF 搜索、数学与代码高亮的额外加载；文章正文的高亮由 Astro 提供。

评论以 /blog/slug/ 作为身份，尾斜杠、查询参数和片段不产生新讨论。单篇 comments: false 禁用评论。没有服务器 URL 时不展示评论。真实留言的保存、审核、通知和备份由独立 Waline 服务负责，配置好服务后再人工验证收发。
