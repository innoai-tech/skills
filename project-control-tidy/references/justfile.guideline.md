# justfile Guideline

用于定义 `justfile` 应如何作为统一执行入口存在。

## 目标

1. 让 agent 明确知道可用执行入口在哪里（`just --list` 即文档）。
2. 把不同语言、不同工具链的入口统一收敛到一处。
3. 让 root `justfile` 只做聚合，不堆砌具体命令。

## 核心原则

1. **root 只做聚合**，不定义具体命令。具体命令下沉到工具链或子项目的 `justfile`。
2. **每个 recipe 必须有文档注释**，`just --list` 是发现入口的唯一方式。
3. **禁止在 root 暴露无差别通配入口**（如 `bun *args`、`go *args`），这会绕过所有封装。工具链 recipe 中使用 `*args` 透传参数到已知稳定 CLI 是合法且推荐的做法。
4. **不确定语法时**，优先查阅 `just --help`、`just --man` 和官方手册。

## root justfile

root `justfile` 只做两件事：

1. `default` recipe：列出所有可用入口（`@just --list --list-submodules`），让 `just` 无参数运行即获得导航。
2. `mod` 声明：将工具链和子项目的稳定入口注册为子模块。

`default` 必须使用 `[group('meta')]`。

### 两种 mod 模式

**工具链模式**：`tool/<lang>/justfile` 是对某个语言或工具的全局封装。

```justfile
# <语言> 工具链入口
[group: 'toolchain']
mod go 'tool/go'
```

特征：
- 所有 recipe 使用 `[no-cd]`，使命令相对于调用方目录执行
- 命名空间为语言名（`just go test`、`just ts lint`）
- root 的 `group` 使用 `'toolchain'`

**子项目模式**：monorepo 子目录的 `justfile` 只暴露该目录独有的入口。

```justfile
# Web 应用
[group: 'app']
mod webapp 'webapp/justfile'
```

特征：
- 子目录 `justfile` 只暴露 dev/build 等该目录专属入口
- 不在子目录重复工具链已有的命令
- root 的 `group` 按子项目类型命名（如 `'app'`、`'lib'`、`'service'`）

### 简单项目

如果仓库只有一个模块、没有工具链分离需求，recipe 可以直接写在 root。但应使用 `[group]` 分组：

```justfile
[group('meta')]
default:
    @just --list

[group('env')]
dep:
    bun install

[group('test')]
test:
    bun test
```

## 工具链 justfile

位于 `tool/<lang>/justfile`，是对该语言/工具链中所有命令的全局封装。

1. **所有 recipe 必须使用 `[no-cd]`**——命令相对于调用方目录执行，而非 `tool/<lang>/`。
2. 覆盖该语言的标准操作：lint、fmt、test、build、dep、update、clean 等。
3. 命名简洁、直接（`tsc`、`vet`、`fmt`、`dep`），不过度缩写。
4. 参数说明最小化，透传参数使用 `*args`（仅在 recipe 本身是稳定 CLT 封装时，不是通配入口）。

示例（`tool/ts/justfile`）：

```justfile
# 类型检查
[group("lint")]
[no-cd]
tsc *args:
    @bunx -b tsgo {{ args }}

# 单元测试
[group("test")]
[no-cd]
test *args:
    @bunx -b vitest {{ args }}
```

> `*args` 在工具链 recipe 中是合法的——它把已知的稳定 CLI（如 vitest）封装为可透传参数的入口，而非无差别的通配入口。禁止的是 root 级别的 `just bun *args` 这类绕过所有封装的情况。

## 子项目 justfile

位于 monorepo 子目录下（如 `webapp/justfile`），只暴露该目录独有的入口。

1. 只写 dev/build/deploy 等该目录专属的入口。
2. 不重复工具链已有的命令（lint、test、fmt 等通过 `just ts lint` 调用）。
3. 需要调用工具链时，通过 `just ts::` 语法引用。

## recipe 文档注释

1. 每个面向使用者的 recipe 必须有紧邻的文档注释，`just --list` 只会显示注释。
2. 注释格式：`# <用途描述>（输入：<参数>，说明；其余参数透传给底层工具）`。
3. 注释只写用途和输入，不写业务背景或实现细节。
4. `mod` 行的注释格式：`# <模块用途>`，如 `# Web 应用入口`。

## attrs

只使用能直接改善可读性、可用性或安全性的 attrs：

- `[group(...)]`：必须使用。所有 recipe 和 mod 都应分组，提升 `just --list` 可读性。
- `[no-cd]`：工具链 recipe 必须使用。使命令相对于调用方目录执行。
- 其他 attrs：仅在能直接提升入口清晰度或安全性，且当前 `just` 版本已确认支持时使用。

## groups

推荐的分组：

| group | 用途 | 示例 recipe |
|-------|------|------------|
| `meta` | 元操作 | `default`、`install` |
| `toolchain` | root 注册的工具链模块 | `mod go 'tool/go'` |
| `app` | root 注册的应用模块 | `mod webapp 'webapp/justfile'` |
| `env` | 环境与依赖 | `dep`、`update`、`clean` |
| `lint` | 代码检查 | `tsc`、`vet`、`oxlint` |
| `fmt` | 格式化 | `fmt`、`prettier` |
| `test` | 测试 | `test`、`vitest`、`playwright` |
| `build` | 构建 | `build`、`bundle` |
| `dev` | 开发与运行 | `dev`、`start`、`serve`、`migrate` |

命名稳定、直接，不使用临时任务名或业务黑话。若 recipe 未分组，应有明确理由。

## 校验方式

1. `just --list`：检查所有 recipe 是否可读，分组是否合理。
2. `just --list --list-submodules`：检查 submodules 是否按预期暴露。
3. `just --usage <recipe>`：检查单个 recipe 的参数和 attrs 是否形成清晰用法。
4. `just --groups`：检查分组是否形成稳定分类。

## 不应包含

- 业务背景或项目说明 → `README.md`
- 协作规则或行为约束 → `AGENTS.md`
- 无差别通配入口（root 级别 `bun *args`、`go *args`）→ 这是绕过所有封装的逃逸口
- 没有文档注释的 recipe → `just --list` 时不可读
- 不稳定或实验性命令 → 确认稳定后再注册
