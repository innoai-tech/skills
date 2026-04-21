# Agent Skills Specification 参考

本文是 `https://agentskills.io/specification` 的离线工作摘要。

在维护其他 skill 时，把它作为本地 reference 使用。若环境后续提供官方校验器或更新的正式资料，应以官方内容为准。除非目标 skill 的真实兼容性约束确实依赖某种激活行为，否则忽略 client 专属触发细节。

若不同 agent 或产品对 skill 的加载、触发、展示方式存在差异，把这些差异视为实现细节，而不是核心 specification。维护目标 skill 时，应优先保证任一 agent 都能读懂其目录结构、frontmatter 和主说明，而不是为某一实现写特化规则。

## 必需目录结构

一个 skill 目录必须包含：

1. `SKILL.md`

可选目录和文件可包括：

1. `scripts/`
2. `references/`
3. `assets/`
4. 其他支撑性文件或目录

specification 约束的是 skill 目录内部应包含什么，而不是 skill 在磁盘上的安装位置。

## `SKILL.md` 格式

`SKILL.md` 必须包含：

1. 顶部 YAML frontmatter。
2. frontmatter 结束分隔符之后的 Markdown 正文。

正文没有强制章节名，但应能有效帮助 agent 执行该 skill 对应的任务。

## frontmatter 字段

### 必填字段

`name`

- 必填。
- 长度 1 到 64 个字符。
- 只允许小写字母、数字和连字符。
- 不能以 `-` 开头或结尾。
- 不能包含连续连字符。
- 必须与父目录名一致。

`description`

- 必填。
- 长度 1 到 1024 个字符。
- 不能为空。
- 应同时说明该 skill 做什么，以及何时使用。
- 应包含足够具体的词语，帮助 agent 或用户识别适用任务。

### 可选字段

`license`

- 可选，可填写简短 license 名称，或引用 skill 内附带的 license 文件。

`compatibility`

- 可选。
- 若存在，长度为 1 到 500 个字符。
- 只用于表达真实环境约束，如目标产品、所需包、运行时版本或网络需求。

`metadata`

- 可选的字符串到字符串映射，用于附加 client 元数据。

`allowed-tools`

- 可选实验字段。
- 使用空格分隔的预批准工具列表。
- 不同实现对它的支持程度可能不同。

## 渐进式加载

specification 默认存在三层加载：

1. `name` 与 `description` 在发现阶段低成本加载。
2. `SKILL.md` 正文在 skill 被激活后加载。
3. `references/`、`scripts/`、`assets/` 仅在需要时加载。

对维护工作的直接要求是：

- 元数据保持精炼且准确。
- `SKILL.md` 聚焦于激活后立即需要的说明。
- 不需要即时加载的重内容应下沉到附属文件。
- 某个 agent 的特化触发技巧不应挤占主说明的空间。

## 建议的体量与链接规则

- 在可能的情况下，让 `SKILL.md` 控制在 500 行以内。
- 从 skill 根目录出发使用相对文件引用。
- reference 最好由 `SKILL.md` 直接链接，保持一层深度。
- 避免 reference 文件再层层转发到另一个 reference 文件。

## 可选目录

### `references/`

用于存放 agent 按需阅读的文档或详细参考材料。

适合放入：

- 规范性检查清单
- 领域细节
- 不需要每次都加载的结构化示例

### `scripts/`

用于存放追求确定性或会被反复复用的可执行逻辑。

适合放入：

- 校验辅助脚本
- 格式转换工具
- 重复使用的维护脚本

### `assets/`

用于存放会被直接消费、复制或嵌入输出的静态资源。

适合放入：

- 模板文件
- 图片
- 静态数据文件

## 校验

按以下静态规则直接校验：

1. 解析 frontmatter。
2. 检查必填字段及长度、格式限制。
3. 检查目录名与 `name` 是否一致。
4. 检查 `SKILL.md` 使用到的相对引用。
5. 检查附属文件是否符合其目录职责。
6. 检查 `SKILL.md` 是否要求执行者补全不存在的流程、命令或文档入口。
7. 检查主文档与 reference 之间是否存在明显冲突。

## 维护检查清单

- [ ] `SKILL.md` 存在。
- [ ] Frontmatter 是合法 YAML。
- [ ] `name` 存在、合法，且与目录名一致。
- [ ] `description` 存在、非空，且同时说明功能与使用时机。
- [ ] 可选字段只在承载真实信息时出现。
- [ ] `SKILL.md` 正文在激活后可直接作为说明使用。
- [ ] 附属文件已经按职责分层。
- [ ] 相对引用正确。
- [ ] 没有把 client 专属要求伪装成核心 specification。
