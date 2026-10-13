# 架构

页面是组合入口。功能目录保存各自的数据访问、组件与浏览器脚本；功能之间通过页面传递数据，不直接相互导入。

依赖方向：pages → features / layouts / shared / config；features → 自身 / layouts / shared / config；layouts → shared / config。shared 和 config 不依赖功能或路由。

功能公开入口按需使用 index.ts（查询与类型）、ui.ts（组件）、schema.ts（内容定义）。外部不导入内部文件。src/content.config.ts 是内容组合入口，只导入功能 schema。只有此处定义 Content Collections；Markdown 放在 src/content。

ESLint 按解析后的目标检查依赖，包含 Astro 前言和客户端脚本、静态和字面量动态导入、类型导入与 script src。业务模块不使用计算导入路径或 import.meta.glob；内容加载由 Content Collections loader 承担。

博客的 getPosts 是生产发布过滤的唯一入口；路由、RSS、标签、归档和首页均从该查询获取内容。生产构建不生成草稿和未来文章详情，搜索只能索引已生成的正文。schema 的日期和 slug 格式校验属于共享无业务工具。

eslint-module-utils 当前版本尚未使用 ESLint 10 的 physicalFilename 属性，导致 Astro 内联脚本的相对路径偏移。scripts/astro-import-resolver.cjs 仅将虚拟脚本文件还原到所属 .astro，再调用官方 TypeScript resolver；正反例覆盖这条适配路径。
