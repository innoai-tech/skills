---
name: project-control-tidy
description: 初始化、补齐、重写或审计仓库控制面文件（`AGENTS.md`、`README.md`、`justfile`）。当用户提到仓库规范、项目骨架、模块脚手架、控制面分层、README/AGENTS/justfile 边界、仓库协同约束，或希望把现有仓库整理成一套可长期维护的人与 AGENT 协同结构时，应优先使用。
metadata:
  primary_pattern: reviewer
  execution_trait: sequential
---

# Project Control Tidy

用于维护仓库控制面，使 `AGENTS.md`、`README.md`、`justfile` 各司其职，并稳定服务不同类型的编码项目。

## 目标

本 skill 只负责：

1. 裁决 `AGENTS.md`、`README.md`、`justfile` 的文件边界。
2. 按协作结构判断 root、`libs`、`projects`、toolchain 与执行面分型。
3. 按对应 guideline 直接生成、重写或审计最小控制面文件。

## 适用范围

- 开源类库或 SDK 仓库
- 业务服务或应用仓库
- 工具链或工程化仓库
- monorepo / workspace 型仓库
- 含多模块、多入口或多运行角色的仓库

本 skill 按协作结构分型，不按编程语言分型。

## 不适用

- 只是在既有控制面约束内补业务代码，不调整控制面。
- 只改某个命令实现细节，不涉及入口分层或工具聚合。
- 只做文案润色，不触及仓库协同规则、结构边界或执行面。

## 输入

最少需要：

- 目标仓库或目标子目录路径
- 本次处理范围是 root、模块、toolchain，还是它们的组合
- 目标范围内当前已有的 `AGENTS.md`、`README.md`、`justfile` 现状

可选但有帮助：

- 本次是新建、补齐、重写还是审计
- 是否允许新增子模块
- 若新增子模块，预期采用单入口还是多入口
- 目标仓库是否已有稳定工具链入口或既定命名约定
- 当前仓库是否存在不同运行角色，例如 server、worker、agent、toolchain、example、demo

若信息不足，先做最小盘点和边界裁决。涉及新增子模块、入口注册、workspace 边界或执行面模式选择时，必须在落地前得到确认。

## 先读什么

1. 先读 [`references/file-boundaries.spec.md`](references/file-boundaries.spec.md)。
2. 再读 [`references/project-classification.spec.md`](references/project-classification.spec.md)。
3. 需要写或重写 `AGENTS.md` 时，再读 [`references/agents.guideline.md`](references/agents.guideline.md)。
4. 需要审计现有 `AGENTS.md` 是否缺失军规基线、规则启用机制或停机门禁时，也应回到 [
   `references/agents.guideline.md`](references/agents.guideline.md) 对照检查。
5. 需要写或重写 `README.md` 时，再读 [`references/readme.guideline.md`](references/readme.guideline.md)。
6. 需要写或重写 `justfile` 时，再读 [`references/justfile.guideline.md`](references/justfile.guideline.md)。

## 核心工作流

1. 盘点范围与现状。
    - 明确本次处理的是 root、模块、toolchain 还是它们的组合。
    - 明确本次目标是新建、补齐、重写还是审计。
    - 枚举当前已有的 `AGENTS.md`、`README.md`、`justfile`。
    - 对 `AGENTS.md` 至少检查：规则启用机制、变更边界、验证义务、暂停条件、人工接管条件是否齐全。
2. 先按文件边界裁决。
    - 根据 [`references/file-boundaries.spec.md`](references/file-boundaries.spec.md) 判断三类文件各自该承载什么。
3. 再按协作结构分型。
    - 根据 [`references/project-classification.spec.md`](references/project-classification.spec.md) 判断当前目录属于
      root、workspace、`libs`、`projects`、toolchain、单入口或多入口。
4. 发现结构异常先说明。
    - 若当前目录结构、控制面分层或文件角色不符合预期分型，必须先明确指出问题。
    - 若问题无法在本次最小改动内消解，必须给出可执行的重构建议，再决定是否继续局部修补。
5. 遇到确认门禁先停下。
    - 涉及新增子模块、入口注册、workspace 边界或执行面模式选择时，先确认再落地。
    - 需求边界不清且存在多种互斥实现时，也应先确认再落地。
6. 按目标文件读取对应 guideline。
    - `AGENTS.md` 参考 [`references/agents.guideline.md`](references/agents.guideline.md)。
    - `README.md` 参考 [`references/readme.guideline.md`](references/readme.guideline.md)。
    - `justfile` 参考 [`references/justfile.guideline.md`](references/justfile.guideline.md)。
7. 以最小改动落地。
    - 优先原地 patch，避免整文件覆盖。
    - 保持文件边界、项目分型与 guideline 之间无冲突。
8. 做最小相关验证。
    - 若修改的是 `justfile`，至少核对 `just --list`、`just --usage` 或等价可读性校验方式。
    - 若修改的是 guideline / spec，至少核对其与 `SKILL.md`、同类 references 间不存在职责冲突。
    - 无法验证时，必须在交付中明确说明缺口、原因与风险。

## 完成标准

1. `SKILL.md` 只保留流程与导航，不重复堆叠 spec 细则。
2. `references/` 中的 spec 与 guideline 职责清晰，没有重复裁决来源。
3. 可直接生成最小可维护控制面文件，而不依赖预置模板。
4. `AGENTS.md`、`README.md`、`justfile` 的内容都符合对应边界。
5. `AGENTS.md` guideline 已覆盖规则启用机制、最小盘点、变更边界、验证义务、暂停条件与高风险护栏。
6. 若仓库结构或控制面分层不符合预期，已明确说明问题，并给出必要的重构建议或暂停理由。
7. 尽量使用中文，除非专用名称，包括但不限于文档、注释、错误和日志信息。

## 检查清单

- [ ] 已读取文件边界 spec
- [ ] 已读取项目分型 spec
- [ ] 已明确本次处理的 root / 模块 / toolchain 范围
- [ ] 已明确本次是新建、补齐、重写还是审计
- [ ] 已确认项目分型基于协作边界，而不是编程语言标签
- [ ] 已确认结构不符合预期时会明确说明，并提出必要的重构建议
- [ ] 已确认任何新增子模块、入口注册或执行面选择都先得到确认
- [ ] 已确认需求存在互斥实现时会先暂停并请求确认
- [ ] 已按目标文件读取对应 guideline
- [ ] 已检查 `AGENTS.md` 是否包含规则启用机制与军规级基线约束
- [ ] 已确认 `AGENTS.md`、`README.md`、`justfile` 没有混写
- [ ] 已确认 `SKILL.md`、`references/` 之间不存在职责冲突
- [ ] 已完成最小相关验证，或明确说明无法验证的原因与风险

## 交付说明

完成后应说明：

1. 改动了哪些控制面文件。
2. 修复了哪些边界、分层或重复定义问题。
3. 哪些 spec / guideline 被调整，以及调整原因。
4. 若执行了审计，主要 findings 是什么，按什么优先级排序。
5. 做了哪些最小相关验证；若未验证，缺口、原因与风险是什么。
6. 若发现项目结构不符合预期，具体不符合点是什么，以及建议怎样重构。
7. 哪些事项因缺少确认或仓库事实不足而暂未落地。
