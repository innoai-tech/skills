# Tool Wrapper Guideline

适用于主模式为 `Tool Wrapper` 的 skill。

## 主文档应强调

1. 何时使用该 skill。
2. 适用边界与非目标。
3. 应遵循的关键约定。
4. 何时打开哪个 `reference`。

## 主文档不应强调

- 冗长背景介绍
- 大量复制原始文档
- 与包装型 skill 无关的阶段门禁或模板骨架

## 附属资源倾向

- `references/`：主力目录
- `scripts/`：按需
- `assets/`：通常不需要

## 维护检查重点

1. `SKILL.md` 是否把“查什么、何时查”说清楚。
2. 详细规则是否已下沉到 `references/`。
3. 是否错误混入生成器、问答式或流水线式主流程。
