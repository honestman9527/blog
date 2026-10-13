# 开发与验收

## 分支与提交

功能实现、验证与阶段提交都在功能分支进行。首次建设使用 feat/personal-site，按工程基础、设计外壳、作品资料、博客、搜索评论和部署文档分阶段提交。保留 DESIGN.md 原稿。

main 只接收已验证功能分支的快进合并。使用 git merge --ff-only；发生分叉时先定位原因，不以重置、强推或额外合并提交绕过。空仓库先在功能分支产生基础提交，最终以基础提交创建 main，再快进至完成的功能分支。提交不会自动 push，部署也由用户单独执行。

## 最小必要验证

以 AGENTS.md 为准：常规代码改动完成后运行 pnpm lint 即可，它包含 Astro 规则和功能依赖边界。文档修改不运行代码测试。CI 也只执行 lint，纯 Markdown 文档改动跳过 CI；不自动截图、扫描布局或部署。

出现具体错误、类型接口变化、发布规则变更时，再选择相关检查：

- pnpm check：需要时检查 Astro/TypeScript 类型与依赖边界。
- pnpm exec vitest run src/features/blog/data/publication.test.ts：仅验证日期、草稿、slug 与分页规则。
- pnpm exec vitest run src/features/comments/data/config.test.ts：仅验证评论路径身份。
- pnpm exec vitest run tests/unit/boundaries.test.ts：仅在依赖规则或 resolver 变更时验证边界工具。
- pnpm build：需要验证构建或生成交付产物时使用，包含搜索索引。
- pnpm deploy:dry-run：仅在部署配置变更需要验证时使用。

没有新改动或失败，不重复已通过检查。不为覆盖率增加大量全面测试。全局验证只在跨模块影响使局部检查不足时执行，并说明原因。

## 人工验收

布局、响应式、字体、间距和视觉效果由用户检查。可以使用 pnpm dev 查看开发内容，或先构建再用 pnpm preview / pnpm preview:worker 查看静态版本。搜索索引只在构建时生成，需要验证搜索时使用静态预览。没有自动截图、视觉回归或浏览器布局测试。
