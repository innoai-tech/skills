# 列出所有可用命令
[group('meta')]
default:
    @just --list --list-submodules

# 安装指定 skill 到 agents skills 目录
[group('meta')]
install skill:
    mkdir -p ~/.agents/skills
    ln -sfn {{ justfile_directory() }}/{{ skill }} ~/.agents/skills/{{ skill }}

# 校验 skill-tidy 静态结构
[group('validate')]
skill-tidy:
    @bun {{ justfile_directory() }}/skill-tidy/scripts/validate-skill.ts {{ justfile_directory() }}/skill-tidy

# 校验 project-control-tidy 静态结构
[group('validate')]
project-control-tidy:
    @bun {{ justfile_directory() }}/project-control-tidy/scripts/validate-control-skill.ts {{ justfile_directory() }}/project-control-tidy
