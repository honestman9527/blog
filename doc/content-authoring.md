# 内容写作

文章和项目使用 Markdown，保存在 src/content。个人资料集中在 src/config/profile.ts：填写 name、role、introduction、skills、socials 与 experience 后，将 placeholder 设为 false。空社交链接与空经历不渲染。

项目放在 src/content/projects，必填 title、description、slug。slug 使用小写英文、数字和连字符，更新标题或移动文件不改变 slug。可选 stack、featured、order、draft、demo 和 links（label 与 http(s) href）。项目按 order 排列；featured 用于首页，首页最多两项。正式构建过滤 draft 项目。

目前两份项目是结构示例，demo: true 显示示例标记；没有发布真实工具或虚构成果。文章写作规则随博客阶段补齐。

示例内容明确标记示例，发布真实网站前替换或移除。不填写虚构任职、项目成绩和社交链接。
