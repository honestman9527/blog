# 架构

页面是组合入口。功能目录保存各自的数据访问、组件与浏览器脚本；功能之间通过页面传递数据，不直接相互导入。

依赖方向：pages → features / layouts / shared / config；features → 自身 / layouts / shared / config；layouts → shared / config。shared 和 config 不依赖功能或路由。

功能公开入口按需使用 index.ts（查询与类型）、ui.ts（组件）、schema.ts（内容定义）。外部不导入内部文件。src/content.config.ts 是内容组合入口，只导入功能 schema。只有此处定义 Content Collections；Markdown 放在 src/content。

ESLint 按解析后的目标检查依赖，包含 Astro 前言和客户端脚本、静态和字面量动态导入、类型导入与 script src。业务模块不使用计算导入路径或 import.meta.glob；内容加载由 Content Collections loader 承担。

博客的 getPosts 是生产发布过滤的唯一入口；路由、RSS、标签、归档和首页均从该查询获取内容。生产构建不生成草稿和未来文章详情，搜索只能索引已生成的正文。schema 的日期和 slug 格式校验属于共享无业务工具。

eslint-module-utils 当前版本尚未使用 ESLint 10 的 physicalFilename 属性，导致 Astro 内联脚本的相对路径偏移。scripts/astro-import-resolver.cjs 仅将虚拟脚本文件还原到所属 .astro，再调用官方 TypeScript resolver；正反例覆盖这条适配路径。

搜索使用构建后生成的 Pagefind 索引，仅五个示例详情页的 data-pagefind-body 区域被索引，包括标题、摘要和正文。类型分别为文章与项目。页面外壳、目录和评论明确忽略。查询时懒加载索引，并防止较早查询覆盖较新输入；失败重试会保留查询并刷新页面，清除浏览器失败模块缓存。

评论由文章路由组合，不由 blog 模块引用。comments/index.ts 读取公开服务配置并产生规范化文章路径，ui.ts 暴露组件。没有服务地址或单篇关闭时不渲染组件。浏览到评论区时加载 Waline 和样式，先检查服务响应，再挂载；失败提供重试。正式离开页面时销毁实例，返回缓存页面时保留。
