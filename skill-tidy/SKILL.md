---
name: skill-tidy
description: 规整或重写已有 skill 目录，使维护后的 skill 符合 Agent Skills specification，并在不同 agent 间保持可移植。用于手动维护 skill 的 SKILL.md、references、scripts、assets 或相关结构。
metadata:
  primary_pattern: reviewer
  execution_trait: sequential
---

# Skill Tidy

用于维护已有 skill 目录，使其持续符合 Agent Skills specification，并保持 cross-agent 可移植。

## 目标

本 skill 只负责：

1. 校验目标 skill 是否满足 specification 与目录边界要求。
2. 判定目标 skill 的主设计模式，并据此收敛 `SKILL.md` 与附属资源。
3. 优先把目标 skill 收敛为单一主模式；只有确有必要时才保留辅模式。
4. 删除失效、冲突、伪完整或不再服务该 skill 的内容。

## 何时使用

- 用户明确要求创建、整理、收敛、重写或审计某个 skill 目录。
- 需要重写 `SKILL.md`、整理 `references/`、`scripts/`、`assets/`。
- 需要解决 skill 结构混乱、边界漂移、引用失效或模式混写问题。

## 不适用

- 不维护 skill，只是使用 skill 完成业务任务。
- 只修改业务代码，不触及 skill 目录结构。
- 只做表面文案润色，不触及 specification、边界或模式问题。

## 输入

最少需要：

- 目标 skill 目录或 `SKILL.md` 路径
- 目标 skill 当前内容

可选但有帮助：

- 已存在的 `references/`、`scripts/`、`assets/` 或样例文件
- 若 skill 明确绑定某个环境，则提供兼容性目标说明

若信息不足，默认优先保留可移植性，不编造环境前提。

## 先读什么

1. 先读 [`references/agentskills.spec.md`](references/agentskills.spec.md)。
2. 再读 [`references/skill-md-boundary.spec.md`](references/skill-md-boundary.spec.md)。
3. 需要判定主设计模式时，再读 [`references/pattern-selection.spec.md`](references/pattern-selection.spec.md)。
4. 判定主模式后，再读对应 guideline：
   - [`references/tool-wrapper.guideline.md`](references/tool-wrapper.guideline.md)
   - [`references/generator.guideline.md`](references/generator.guideline.md)
   - [`references/reviewer.guideline.md`](references/reviewer.guideline.md)
   - [`references/inversion.guideline.md`](references/inversion.guideline.md)
   - [`references/pipeline.guideline.md`](references/pipeline.guideline.md)

## 核心工作流

1. 盘点目标 skill 目录。
   - 列出实际存在的文件。
   - 找出缺失项、过期文件、失效引用和项目专属内容。
2. 先校验 specification 与边界。
   - 根据 [`references/agentskills.spec.md`](references/agentskills.spec.md) 检查 frontmatter、目录名、相对引用与附属目录职责。
   - 根据 [`references/skill-md-boundary.spec.md`](references/skill-md-boundary.spec.md) 判断哪些内容应留在 `SKILL.md`，哪些应下沉。
3. 再判定主设计模式。
   - 根据 [`references/pattern-selection.spec.md`](references/pattern-selection.spec.md) 选择一个主模式，必要时记录辅模式。
4. 按主模式收敛内容。
   - 只按主模式重组 `SKILL.md` 骨架。
   - 优先删除不必要的辅模式控制逻辑。
   - 按需重写 `references/`、`scripts/`、`assets/`，不为凑结构补空壳。
5. 做最小化验收。
   - 检查是否仍有规则冲突、伪入口、伪完整性或跨 agent 漂移风险。

## 完成标准

1. `SKILL.md` 只保留激活后立即需要阅读的说明与导航。
2. `references/`、`scripts/`、`assets/` 各自符合目录职责。
3. 主设计模式清晰可判定，且主文档结构与之匹配。
4. 目标 skill 已尽量收敛为单一主模式；若保留辅模式，理由明确且范围受控。
5. 没有把多个设计模式的主流程混写到难以执行。
6. 维护后的 skill 不依赖某一个特定 agent 的人设、UI 或会话策略。

## 检查清单

- [ ] 已检查目标 skill 直接包含的所有文件
- [ ] 已确认 `SKILL.md` 存在且 frontmatter 合法
- [ ] 已确认 `name` 与目录名一致
- [ ] 已确认 `description` 同时说明功能与使用时机
- [ ] 已按边界规范收敛 `SKILL.md`
- [ ] 已判定主设计模式
- [ ] 已确认是否可以继续收敛为单一主模式
- [ ] 已按主模式检查内容组织
- [ ] 已删除或收敛失效、冲突或伪完整内容
- [ ] 已确认相对引用正确

## 交付说明

完成后应说明：

1. 改动了哪些文件。
2. 修复了哪些 specification、边界或模式问题。
3. 目标 skill 的主模式是什么，以及为什么这样判定。
4. 哪些缺口因信息、工具或环境限制而暂时保留。
