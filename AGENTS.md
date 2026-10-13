# 仓库工作约定

## 工作流程与 Git

1. 开始前检查 Git 状态，保留用户已有改动，在功能或文档分支完成修改。
2. 根据下表定位文件，按改动场景阅读对应约定，再选择最小范围的实现与验证。
3. 阶段完成并通过必要检查后自动提交；文档阶段以差异审阅和链接核对为完成条件。
4. 最终只用 `git merge --ff-only` 合并至 `main`，不在 `main` 创建提交。交付时说明改动、实际执行的检查和人工验收项。

分支分叉时先定位原因，保留现有提交和用户改动；不以硬重置、清理文件或强推绕过。详细流程见 [开发与验收](doc/workflow.md)。

## 文件与文档路由

按任务读取相关文档，无需每次加载全部说明。

| 改动场景 | 文件入口 | 先读的约定 |
| --- | --- | --- |
| 页面路由与功能组合 | `src/pages/` | [架构](doc/architecture.md) |
| 功能逻辑、组件与脚本、公开入口 | `src/features/<功能>/` | [架构](doc/architecture.md) |
| 通用 UI、排版、站点布局 | `src/shared/`、`src/layouts/` | [设计参考](DESIGN.md)、[设计适配](doc/design.md) |
| 站点设置、作者资料与经历 | `src/config/` | [内容写作](doc/content-authoring.md) |
| Markdown、内容 schema 与发布规则 | `src/content/`、`src/content.config.ts`、对应功能目录 | [内容写作](doc/content-authoring.md)、[架构](doc/architecture.md) |
| 依赖边界与路径解析 | `eslint.config.mjs`、`scripts/astro-import-resolver.cjs` | [架构](doc/architecture.md) |
| 构建、环境变量与部署 | `astro.config.mjs`、`wrangler.jsonc`、`.env.example`、`scripts/deploy.mjs`、`public/_headers` | [部署](doc/deployment.md) |
| 命令、CI 与验收流程 | `package.json`、`.github/workflows/` | [开发与验收](doc/workflow.md) |

## 命令优先级

- 查找文件优先用 `rg --files`，搜索文本优先用 `rg`，只读取相关范围。
- 项目命令以 [package.json](package.json) 为准，优先复用已有 pnpm 脚本。
- 下表是选择顺序，不是必须逐项执行的流水线；按改动选择足够验证问题的最低成本检查。

| 优先级 | 适用条件 | 检查方式 |
| --- | --- | --- |
| 0 | 仅修改文档 | 审阅差异、核对链接；不运行 lint、类型检查、测试或构建 |
| 1 | 常规代码改动 | `pnpm lint`，包含模块边界检查 |
| 2 | 相关行为变化或已定位的故障需要验证 | `pnpm exec vitest run <相关测试文件>` |
| 3 | 类型接口变化或类型错误 | `pnpm check`；已包含 lint，不再重复单独执行 |
| 4 | 构建行为变化或需要生成交付产物 | `pnpm build`，包含 Pagefind 索引 |
| 5 | 部署配置变化确需核验 | `pnpm deploy:dry-run`，仅本地验证 |

## 安全边界

- **用户文件**：只修改任务需要的文件，保留原始 `DESIGN.md`，不覆盖、回滚或删除用户已有改动。
- **模块职责**：目录、公开入口和依赖方向遵循架构文档；修改这些边界时通过 lint 中的依赖检查。
- **公开配置**：浏览器和静态产物仅接收公开配置。Waline 数据库、管理凭据属于独立服务端，不进入源码、静态产物、日志或 Git 提交；配置示例使用占位值。
- **远端操作**：push 和远端部署仅按用户明确指令执行；阶段自动提交与本地快进合并不代表远端发布授权。

## 验证限制与人工验收

- 常规完成后只运行 lint；追加检查必须与本次改动或具体错误直接相关。
- 全局测试仅用于确有跨模块影响且局部检查不足的情况，执行前说明具体原因。
- 已通过的检查，没有新改动或失败就不重复运行；不为流程或覆盖率增加大量全面测试。
- 不编写或执行自动截图、视觉回归和浏览器布局扫描。布局、响应式、字体、间距与视觉效果由用户人工验收。
