# 开发与验收

分支、提交与验证规则以 [AGENTS.md](../AGENTS.md) 为准，命令定义见 [package.json](../package.json)。

## 局部验证入口

| 验证目标                | 命令                                                              |
| ----------------------- | ----------------------------------------------------------------- |
| 日期、草稿、slug 与分页 | `pnpm exec vitest run src/features/blog/data/publication.test.ts` |
| 评论地址与路径身份      | `pnpm exec vitest run src/features/comments/data/config.test.ts`  |
| 站点地址与发布前置校验  | `pnpm exec vitest run src/config/site.test.ts`                    |
| 依赖规则与 resolver     | `pnpm exec vitest run tests/unit/boundaries.test.ts`              |

`pnpm format` 统一格式，`pnpm format:check` 只检查格式。原始 DESIGN.md、锁文件、环境文件和生成目录不参与格式化。

CI 的 [格式检查](../.github/workflows/format.yml) 覆盖源码与文档变更；[lint](../.github/workflows/quality.yml) 继续跳过纯文档变更。两者均不构建或部署。

## 本地预览

`pnpm dev` 用于开发预览。搜索索引在构建后生成，查看完整静态版本时先运行 `pnpm build`，再用 `pnpm preview`。需要核验 Workers 路由行为时参见 [部署](deployment.md)。
