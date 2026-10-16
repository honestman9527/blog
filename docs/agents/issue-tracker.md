# Issue tracker: GitHub

本仓库的 issue 与 spec 记录在 honestman9527/blog 的 GitHub Issues，
使用 gh CLI 操作。在仓库目录执行命令时，从 Git remote 推断仓库。

## 常用操作

- 创建：`gh issue create --title "..." --body-file <正文文件>`
- 读取：`gh issue view <number> --json number,title,body,labels,comments`
- 列出：`gh issue list --state open --json number,title,body,labels`
- 评论：`gh issue comment <number> --body-file <正文文件>`
- 添加标签：`gh issue edit <number> --add-label "..."`
- 移除标签：`gh issue edit <number> --remove-label "..."`
- 关闭：`gh issue close <number> --comment "..."`

多行正文先写入临时文件，再通过 `--body-file` 传入。
标签角色与实际名称见 [triage-labels.md](triage-labels.md)。

## 技能指令映射

- “publish to the issue tracker”：创建 GitHub issue。
- “fetch the relevant ticket”：读取对应 GitHub issue。

## Pull requests as a triage surface

**PRs as a request surface: no.**

## Wayfinding operations

使用 wayfinder 时：

- Map：一个带 `wayfinder:map` 标签的 issue，保存 Notes、
  Decisions-so-far 与 Fog。
- 子任务：每个任务一个 issue；正文顶部写 `Part of #<parent>`，
  并在 map 正文中以任务列表关联。
- 类型：使用 `wayfinder:research`、`wayfinder:prototype`、
  `wayfinder:grilling` 或 `wayfinder:task` 标签。
- 阻塞：正文顶部记录 `Blocked by: #<number>`；所有阻塞项关闭后可执行。
- 选择：按 map 顺序选取首个未关闭、无阻塞且未分配的子任务。
- 认领：开始工作前执行 `gh issue edit <number> --add-assignee @me`。
- 完成：评论结果并关闭子任务，将结论摘要和链接补充到 map 的
  Decisions-so-far。
