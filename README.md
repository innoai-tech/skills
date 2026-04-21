# skills

沉淀可复用的 agent skill，重点维护稳定工作流、控制面约束和 skill 维护方法，而不是承载具体业务实现。

## 主要入口

- [`project-control-tidy/SKILL.md`](project-control-tidy/SKILL.md)：维护仓库控制面文件（`AGENTS.md`、`README.md`、`justfile`），确保三者各司其职。
- [`skill-tidy/SKILL.md`](skill-tidy/SKILL.md)：维护已有 skill 目录，规整 `SKILL.md`、`references/`、`scripts/` 与整体结构。

## 参考资料

- [`project-control-tidy/references`](project-control-tidy/references)：控制面文件边界规范、AGENTS/README/justfile 编写指南。
- [`skill-tidy/references`](skill-tidy/references)：Agent Skills 规范参考与 skill 边界判断规则。

## 执行入口

- `just` 或 `just --list --list-submodules`：查看仓库可用入口。
- `just install <skill>`：把指定 skill 安装到 `~/.agents/skills/<skill>`。
- `just validate`：校验所有 skill 静态结构。
