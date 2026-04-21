---
name: skill-tidy
description: 规整或重写已有 skill 目录，使维护后的 skill 符合 Agent Skills specification，并在不同 agent 间保持可移植。用于手动维护 skill 的 SKILL.md、references、scripts、assets 或相关结构。
---

# Skill Tidy

维护已有 skill 目录，使 `SKILL.md`、`references/`、`scripts/`、`assets/` 持续符合 Agent Skills specification，并保持跨 agent 可移植。

## 使用范围

使用本 skill 处理：

- 审计、整理、收敛或重写已有 skill 目录。
- 修复 `SKILL.md` 的 frontmatter、正文边界、相对引用或附属资源职责问题。
- 删除失效、冲突、重复、伪完整或不再服务该 skill 的内容。

不要用本 skill 处理：

- 只是调用某个 skill 完成业务任务。
- 只修改普通业务代码，且不触及 skill 目录。
- 只做表面文案润色，不检查 specification、边界和用途一致性。

## 必要输入

开始前必须确认：

1. 目标 skill 目录或目标 `SKILL.md` 路径。
2. 目标 skill 当前文件内容可读取。

若目标目录不存在、没有 `SKILL.md`，或用户意图可能是创建新 skill 而不是整理已有 skill，应先停止并要求确认。信息不足时，不编造运行时、平台、工具链或目标用户前提。

## 参考文件

- 总是先读 [`references/agentskills.spec.md`](references/agentskills.spec.md)，用于检查 specification 与目录职责。
- 总是再读 [`references/skill-md-boundary.spec.md`](references/skill-md-boundary.spec.md)，用于判断 `SKILL.md` 与附属文件边界。

## 执行流程

### 1. 澄清 skill 真实用途

在触碰任何文件之前，先通过与用户交互澄清以下问题。用户回答不够具体时，追问；用户跳过时，说明这一步不可跳过。

必须确认：

1. **职责边界**：这个 skill 解决什么具体问题？在什么真实场景下被触发使用？
2. **最终交付**：agent 加载这个 skill 并完成任务后，最终应该产出什么？是指令、生成物、审查结论还是其他？
3. **职责单一性**：是否一个 skill 承担了多个互不依赖、场景不同的职责？若是，是否应该拆分为多个 skill？
4. **使用约束**：是否有特定的运行时、工具、平台、权限或环境约束？
5. **可移植性**：skill 必须可跨项目使用。references/ 中的文件引用应使用跨项目路径（如 Go import path、npm package name），不应绑定某个仓库的相对路径。

必须从用户的回答中提炼出该 skill 的一句话用途说明（可作为 `description` 的参考）。如果用户无法清晰回答、或回答暴露职责模糊、边界过宽，应先建议收敛或拆分，再继续后续步骤。

禁止的行为：
- 不澄清用途就进入结构改写。
- 自行编造触发场景或交付物类型。
- 把不相关的多个职责强行合并。
- 把 SKILL.md 写成导航目录页——它应该是一个可执行的指南，不是 references 的索引。
- 在 references 中复制可通过宿主平台/工具原生文档系统获取的信息。

完成条件：能用一句话说清该 skill 的用途、触发场景和最终交付物。

### 2. 盘点目标目录

- 列出目标 skill 直接包含的文件和一级附属目录。
- 检查是否存在 `SKILL.md`、`references/`、`scripts/`、`assets/` 或其他支撑文件。
- 记录明显异常：空壳目录、失效引用、项目专属路径、重复文档、伪入口、不可执行脚本。

完成条件：已经知道本次允许维护的目标文件集合，并能说明哪些文件与目标 skill 直接相关。

### 3. 校验 specification

按 [`references/agentskills.spec.md`](references/agentskills.spec.md) 检查：

- `SKILL.md` 是否存在，且包含合法 YAML frontmatter 和 Markdown 正文。
- `name` 是否存在、合法，并与父目录名一致。
- `description` 是否存在、非空，并同时说明功能与使用时机；需与第 1 步澄清的用途一致。
- 可选字段是否只承载真实元数据，不混入流程说明。
- `SKILL.md` 中的相对引用是否存在且路径正确。
- 附属目录中的文件是否符合各自职责。

若可运行本 skill 附带脚本，可执行 `scripts/validate-skill.ts <目标 skill 目录>` 辅助检查静态结构。

完成条件：已列出必须修复的问题，以及可以保留不改的问题。

### 4. 收敛 `SKILL.md` 边界

按 [`references/skill-md-boundary.spec.md`](references/skill-md-boundary.spec.md) 判断每段内容：

**SKILL.md 放核心路径**（agent 激活后不跳转就能干活）：
- 决策树——按场景选入口
- 核心场景的最小可执行指引（代码示例、步骤清单或模板）
- 关键约定——最常违反的规则
- 扩展路径的简短引用——指向 references

**references/ 放扩展路径**：
- 迁移、自定义、边缘情况
- 详细规范和决策表
- 更多示例

**不得复制宿主工具的官方文档**：
- references 中不得复制可通过原生文档系统（go doc、tsdoc、API 参考、用户手册等）获取的信息
- 维护 skill 前先验证宿主文档完备性——不完备时先补文档再精简 reference

其他判断：

- 确定性、可复用、反复执行的逻辑下沉到 `scripts/`。
- 会被复制、嵌入或消费的静态素材放入 `assets/`。
- 历史说明、审校笔记、agent 人设、产品 UI 特化、重复或过期内容优先删除。

完成条件：`SKILL.md` 只保留核心路径的最短可执行指南，扩展路径在 references 中。

### 5. 执行最小改写

改写时必须遵守：

- 只修改与目标 skill 直接相关的文件。
- 优先修 root cause，不做无关重构或批量风格清理。
- 不为"看起来完整"新增空的 `references/`、`scripts/`、`assets/`。
- 不添加不存在的命令、入口、校验器或外部依赖。
- 不保留会误导后续 agent 的伪流程、伪模板或伪兼容性声明。
- 所有改写必须服务于第 1 步澄清的用途：让 agent 在预期场景下正确执行并交付正确产物。

完成条件：改写后的目录结构、主文档和附属资源职责一致，且与澄清的用途对齐。

### 6. 最小验收

至少检查：

- frontmatter 可解析，`name` 与目录名一致。
- `description` 同时表达功能与使用时机，且与澄清的用途一致。
- `SKILL.md` 的相对链接均存在。
- `SKILL.md` 没有引用不存在的流程、命令或文件。
- `SKILL.md` 中的内容服务于澄清的用途，没有混入无关职责。
- 附属目录无明显空壳、过期、重复或职责错位文件。

若本 skill 的 `scripts/validate-skill.ts` 可运行，应把脚本结果作为静态验证证据；若未运行，应说明原因。

若无法完成其中某项，交付时必须说明原因、风险和建议的补救动作。

## 输出要求

交付时按以下顺序说明：

1. 修改了哪些文件。
2. 目标 skill 的职责边界、触发场景和最终交付物是什么（来自第 1 步澄清）。
3. 修复了哪些 specification 或边界问题。
4. 做过哪些最小验证。
5. 仍保留哪些未验证项、假设或风险。

发现问题时应给出可执行结论，不只给泛泛建议。结论优先按影响排序：会导致 skill 无法被发现或加载的问题最高，其次是执行误导、边界漂移、可移植性风险和普通文案问题。
