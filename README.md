# skills

沉淀可复用的 agent skill 及其最小参考资料，重点整理稳定工作流、控制面约束和 skill 维护方法，而不是承载具体业务实现。

这个仓库的价值不在于提供一组零散说明文件，而在于把可长期维护的协作约束和 skill 写法收敛成可复用的最小骨架。若你要整理仓库控制面，从 `project-control-tidy` 开始；若你要整理某个已有 skill，从 `skill-tidy` 开始。

## 从这里开始

- [`project-control-tidy/SKILL.md`](project-control-tidy/SKILL.md)：用于整理或审计仓库级控制面，处理 `AGENTS.md`、`README.md`、`justfile` 的边界、分层与生成规则。
- [`skill-tidy/SKILL.md`](skill-tidy/SKILL.md)：用于整理已有 skill 目录，收敛 `SKILL.md`、`references/` 与整体结构。

## 参考资料

- [`project-control-tidy/references`](project-control-tidy/references)：控制面文件边界、项目分型以及 `AGENTS.md`、`README.md`、`justfile` 的写法参考。
- [`skill-tidy/references`](skill-tidy/references)：skill 结构、主模式选择、生成与审计口径参考。

## 仓库边界

- root 只提供最小入口与导航，不展开具体实现细节。
- 各 skill 的主说明留在各自目录下的 `SKILL.md`。
- 仓库级协作约束见 [`AGENTS.md`](AGENTS.md)，统一执行入口见 [`justfile`](justfile)。
