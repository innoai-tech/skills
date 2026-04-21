# README Guideline

定义 `README.md` 如何作为概述、索引和起步入口。社区引用：[about-readmes](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes).

## README 要回答的问题

GitHub 推荐的 README 应覆盖以下五点：

1. **What** — 这个项目做什么。
2. **Why** — 为什么有用、解决什么问题。
3. **How** — 怎么开始使用（最小起步入口）。
4. **Where** — 去哪里了解更多（指向文档、子目录 README、关键文件）。
5. **Who** — 谁维护、如何贡献（可选，对开源项目更重要）。

在三元体系中，How 的具体命令在 `justfile`，Where 还包含指向 `AGENTS.md`（协作约束）和 `justfile`（执行入口）的引用。

## 推荐结构

```
# 项目名

一句概述。

## 背景

为什么存在、解决什么问题。2-3 句即可。

## 快速开始

最小起步入口（命令用 `just` 指代，不写具体参数）：

- `just install` — 安装依赖
- `just dev` — 启动开发模式

## 目录索引

（root README 列出子项目或主要目录，子目录 README 列出核心文件和文档）

- `packages/foo` — Foo 服务的核心实现
- `tools/cli` — 内部 CLI 工具

## 继续阅读

- 协作约束见 `AGENTS.md`
- 完整执行入口见 `justfile`
- 各子目录的详细文档见各自的 `README.md`
```

表达原则：

- 短段落、少列表、不堆砌。GitHub 自动生成目录，不需要手工列出所有标题。
- 每个链接只补一句用途说明。
- 若有完整文档站，README 应把读者导向那里，不在仓库重复。
- **「继续阅读」段仅 root README 需要**，子目录 README 聚焦自身内容，不重复导航。

## root README

root `README.md` 是仓库的第一入口，先回答 What/Why/How，再给目录索引，最后指向其他资源。

对 monorepo，目录索引应给出子项目清单，每个条目一句用途说明，不展开详细文档：

```markdown
## 子项目

- `packages/foo` — Foo 服务的核心实现，负责用户认证与授权
- `packages/bar` — Bar 数据处理流水线
```

## 子目录 README

子目录 `README.md` 聚焦该目录本身：

1. 一句话说明职责。
2. 若有独立运行入口，写最小起步命令。
3. 指向该目录内的核心文件或文档。
4. 不重复上层 README 已有的背景和索引。

## 不应包含

- 协作规则 → `AGENTS.md`
- 命令参数与执行细节 → `justfile`
- 为了"显得完整"而堆砌的文件清单
- 详细的架构文档或设计决策（类库/SDK 型目录可适度保留 API 说明，但应优先通过语言级文档工具如 Go doc / TSDoc 承载）
