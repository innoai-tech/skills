# justfile Guideline

用于定义 `justfile` 应如何作为统一执行入口存在。

## 目标

1. 让 agent 明确知道可用执行入口在哪里。
2. 把不同语言、不同工具链的入口统一收敛到一处。
3. 避免在多个目录、多个脚本体系间重复暴露同类命令。
4. 让 `just --list`、`just --help` 与 `just --usage` 成为可读入口。

## 基本要求

1. `justfile` 只承载执行入口，不承载背景说明或协作规则。
2. 不同语言工具链统一通过 `justfile` 暴露。
3. 参数说明保持最小，只说明运行所需输入。
4. 不确定具体语法时，优先以 `just --help`、`just --man` 和官方手册为准。

## 默认入口

1. root `justfile` 应提供稳定默认入口。
2. `just` 无参数默认执行首个 recipe；因此若没有明显默认动作，首个 recipe 应优先列出可用 recipes，而不是隐式执行高风险命令。
3. 对多模块仓库，默认入口应优先成为索引入口。

## submodules

1. root `justfile` 应使用 `mod` 暴露下层稳定入口，而不是在 root 重写下层命令。
2. 当某目录已经是独立执行面时，优先注册为 submodule，而不是继续把 recipe 摊平在 root。
3. 子模块命名应使用稳定短名；路径通过 `mod name 'PATH'` 显式指定，避免路径字面量充当模块名。
4. 对缺失也可接受的模块，才使用可选 submodule，例如 `mod? foo`。
5. 需要查看整体入口时，优先用 `just --list --list-submodules` 校验暴露结果。

## recipe 文档注释

1. 每个面向使用者的 recipe 应有紧邻的文档注释，确保 `just --list` 可直接读懂用途。
2. 注释只说明用途与输入，不扩写业务背景。
3. 若版本或语法细节不确定，先回到 `just --help`、`just --man` 或官方手册确认再使用相关 attribute。

## attrs

1. 只使用能直接改善执行入口可读性、可用性或安全性的 attrs。
2. 常用 attrs：
   - `[group(...)]`：把 recipes 按职责分组，提升 `just --list` 可读性。
   - `[no-cd]`：用于 toolchain 或路径应相对调用目录解释的 recipes。
   - 其他 attrs：只有在当前 `just` 版本已确认支持，且能直接提升入口清晰度或安全性时才使用。
3. attrs 应紧邻对应 recipe 或 `mod`。
4. 不为炫技引入罕见 attrs。

## groups

1. root `justfile` 应优先按职责分组，例如 `meta`、`env`、`lint`、`test`、`build`、`runtime`。
2. group 名称应稳定、直接，不使用临时任务名或业务黑话。
3. 对外暴露的 recipe 若未分组，应有明确理由。

## root

1. root `justfile` 聚合已确认的稳定入口。
2. root 不应重复实现下层已有的具体命令，只负责注册和聚合。

## `libs`

1. 仅在确有稳定执行需求时暴露入口。
2. 测试、生成、检查等入口优先统一到 `justfile`。

## `projects`

1. 单入口项目使用单个 `justfile` 暴露稳定目标。
2. 多入口项目通过同一 `justfile` 参数化选择目标。

## toolchain

1. toolchain `justfile` 负责聚合某类语言或构建工具入口。
2. 默认使用 `[no-cd]`。
3. 下层目录若只是收窄路径范围，优先复用 toolchain 入口。

## 校验方式

1. 用 `just --help` 确认 CLI 能力边界。
2. 用 `just --list` 检查根入口是否可读。
3. 用 `just --list --list-submodules` 检查 submodules 暴露是否符合预期。
4. 用 `just --usage <recipe>` 检查参数和 attrs 是否形成清晰用法。
5. 用 `just --groups` 检查 group 是否形成稳定分类。

## 不应包含

- 业务背景
- README 式长说明
- 与执行无关的协作约束
