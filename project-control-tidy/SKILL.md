---
name: project-control-tidy
description: 创建、补齐、重写或审计仓库控制面文件（`AGENTS.md`、`README.md`、`justfile`）。当用户需要整理仓库协作约束、文档入口或执行入口，或希望三者边界清晰、各司其职时使用。
---

# Project Control Tidy

维护仓库控制面文件（`AGENTS.md`、`README.md`、`justfile`），确保三者各司其职、边界清晰。

## 使用范围

使用本 skill 处理：

- 创建、补齐、重写或审计仓库控制面文件。
- 修复文件职责混写、边界不清或内容漂移问题。

不要用本 skill 处理：

- 只修改业务代码，不涉及控制面文件。
- 只做文案润色，不触及文件边界和职责归属。

## 必要输入

开始前必须确认：

1. 目标目录路径。
2. 本次处理范围：哪些控制面文件是目标（`AGENTS.md`、`README.md`、`justfile` 中的一部或全部）。
3. 任务类型：新建、补齐、重写还是审计。

若目标目录不存在或信息不足，先停止并要求确认。

## 参考文件

- 必须读：[`references/file-boundaries.spec.md`](references/file-boundaries.spec.md) — 裁决三个文件各承载什么、不承载什么。
- 写 `AGENTS.md` 时读：[`references/agents.guideline.md`](references/agents.guideline.md)
- 写 `README.md` 时读：[`references/readme.guideline.md`](references/readme.guideline.md)
- 写 `justfile` 时读：[`references/justfile.guideline.md`](references/justfile.guideline.md)

不加载与本次任务无关的 guideline。

## 执行流程

### 1. 盘点已有控制面

- 列出目标路径下已有的 `AGENTS.md`、`README.md`、`justfile`。
- 若为 monorepo 或目标路径含子目录，同时列出子目录中存在的 `AGENTS.md`、`README.md`、`justfile`（仅列出有独立协作边界的子目录，非全部递归）。
- 记录已有文件的职责混写、内容过期、边界不清等明显问题。

完成条件：明确当前控制面文件现状和本次需要处理的文件范围（含子目录）。

### 2. 裁决文件边界

按 [`references/file-boundaries.spec.md`](references/file-boundaries.spec.md) 为每个目标文件确认内容归属：

- `AGENTS.md`：文件约定、开发环境、编码风格、什么时候停/问、规则生效。不应放入项目背景或命令细节。
- `README.md`：What / Why / How / Where（概述、背景、快速开始、目录索引）。不应放入协作规则或命令细节。
- `justfile`：稳定可重复的命令入口（root 只做聚合，工具链用 `[no-cd]` + `mod`）。不应放入背景说明或协作约束。

已有文件存在混写时，先给出迁移方向再决定是否在本次处理。

完成条件：每个目标文件应承载和不承载的内容已明确。

### 3. 执行文件维护

按对应 guideline 执行。区分两种情况：

**审计**：不修改文件，输出问题清单。每个问题包含证据、影响和修复建议。问题按影响排序：
1. 会导致 agent 行为失控或协作边界被突破的问题最高。
2. 文件职责混写。
3. 内容过期、边界不清。
4. 命名、顺序或可读性问题。

**新建/补齐/重写**：按 guideline 生成或更新文件内容。改动原则：
- 优先原地 patch，避免整文件覆盖。
- 只修改与本次控制面任务直接相关的文件。
- 不新增未被确认需要的控制面文件。
- 内容尽量使用中文（专有名词除外）。

若改动会改变协作边界（如新增子目录控制面文件），先请求确认。

完成条件：文件内容符合对应边界和 guideline 要求。

### 4. 最小验证

- 修改 `justfile` 后，至少运行 `just --list` 检查暴露入口是否可读，并检查每个 recipe 和 `mod` 是否有文档注释（无注释时 `just --list` 空白或不可读）。
- 若可运行 `scripts/validate-control-skill.ts <目标目录>`，用它检查 skill 自身静态结构。
- 无法验证时在交付中说明原因。

## 输出要求

交付时说明：

1. 修改了哪些文件（含子目录）。
2. 修复了哪些边界、职责混写或内容问题。若发现混写，先给出迁移方向再说明落地内容。
3. 若是审计，列出主要发现及影响排序。
4. 做过哪些验证。
5. 仍保留哪些未验证项或风险。
