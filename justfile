# 列出所有可用命令
[group('meta')]
default:
    @just --list --list-submodules

# 安装指定 skill 到当前 Codex skill 目录
[group('install')]
install skill:
    mkdir -p ~/.codex/skills
    ln -sfn {{ justfile_directory() }}/{{ skill }} ~/.codex/skills/{{ skill }}

# 显示指定命令的用法
[group('meta')]
usage recipe:
    @just --usage {{ recipe }}
