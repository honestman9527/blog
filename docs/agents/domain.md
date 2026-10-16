# Domain Docs

本仓库采用 single-context 领域文档布局。

## 探索代码前

- 阅读根目录 `GLOSSARY.md`。
- 阅读 `docs/adr/` 中与当前工作相关的 ADR。

文件不存在时静默继续。术语或决策明确后，由 domain-modeling
按需创建文档。

## 文件布局

- `GLOSSARY.md`：仓库共享的领域术语。
- `docs/adr/NNNN-<slug>.md`：按编号记录架构决策。

## 使用领域术语

issue 标题、设计建议、诊断假设与测试名称中的领域概念，
使用 `GLOSSARY.md` 定义的术语。

需要的术语尚未收录时，先判断是否符合项目用语；
确有缺口则留给 domain-modeling 补充。

## ADR 冲突

方案与已有 ADR 冲突时，明确指出对应 ADR、
冲突内容及重新讨论的理由。
