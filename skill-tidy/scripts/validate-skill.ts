#!/usr/bin/env bun

import {
  accessSync,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { constants } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

const namePattern = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

type IssueLevel = "error" | "warn";
type Issue = { level: IssueLevel; message: string };

function parseFrontmatter(text: string): {
  data: Record<string, string>;
  error?: string;
} {
  if (!text.startsWith("---\n")) {
    return { data: {}, error: "SKILL.md 缺少 YAML frontmatter 起始分隔符" };
  }

  const end = text.indexOf("\n---", 4);
  if (end === -1) {
    return { data: {}, error: "SKILL.md 缺少 YAML frontmatter 结束分隔符" };
  }

  const raw = text.slice(4, end);
  const data: Record<string, string> = {};

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith(" ")) {
      continue;
    }

    const separator = line.indexOf(":");
    if (separator === -1) {
      return { data, error: `frontmatter 行不是 key: value 格式：${line}` };
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (!key) {
      return { data, error: `frontmatter 存在空 key：${line}` };
    }
    if (!value) {
      continue;
    }
    data[key] = value.replace(/^['"]|['"]$/g, "");
  }

  return { data };
}

function markdownLinks(filePath: string): string[] {
  const text = readFileSync(filePath, "utf8");
  return [...text.matchAll(linkPattern)].map((match) => match[1]!);
}

function isExternalLink(link: string): boolean {
  return (
    link.includes("://") || link.startsWith("#") || link.startsWith("mailto:")
  );
}

function listMarkdownFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }
  return readdirSync(directory)
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => join(directory, entry))
    .sort();
}

function listFilesRecursive(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const output: string[] = [];
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      output.push(...listFilesRecursive(fullPath));
    } else if (stats.isFile()) {
      output.push(fullPath);
    }
  }
  return output;
}

function isExecutable(filePath: string): boolean {
  try {
    accessSync(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function validate(skillDir: string): Issue[] {
  const issues: Issue[] = [];
  const absoluteSkillDir = resolve(skillDir);
  const skillMd = join(absoluteSkillDir, "SKILL.md");

  if (!existsSync(absoluteSkillDir)) {
    return [{ level: "error", message: `目标目录不存在：${skillDir}` }];
  }
  if (!statSync(absoluteSkillDir).isDirectory()) {
    return [{ level: "error", message: `目标不是目录：${skillDir}` }];
  }
  if (!existsSync(skillMd)) {
    return [{ level: "error", message: "缺少 SKILL.md" }];
  }

  const skillText = readFileSync(skillMd, "utf8");
  const { data: frontmatter, error } = parseFrontmatter(skillText);
  if (error) {
    issues.push({ level: "error", message: error });
  }

  const name = frontmatter.name;
  const description = frontmatter.description;

  if (!name) {
    issues.push({ level: "error", message: "frontmatter 缺少 name" });
  } else if (!namePattern.test(name) || name.includes("--")) {
    issues.push({ level: "error", message: `name 不合法：${name}` });
  } else if (name !== basename(absoluteSkillDir)) {
    issues.push({
      level: "error",
      message: `name 与目录名不一致：name=${name}, dir=${basename(absoluteSkillDir)}`,
    });
  }

  if (!description) {
    issues.push({ level: "error", message: "frontmatter 缺少 description" });
  } else if (description.length > 1024) {
    issues.push({ level: "error", message: "description 超过 1024 字符" });
  } else if (description.length < 12) {
    issues.push({
      level: "warn",
      message: "description 过短，可能不足以说明功能与使用时机",
    });
  }

  const markdownFiles = [
    skillMd,
    ...listMarkdownFiles(join(absoluteSkillDir, "references")),
  ];

  for (const filePath of markdownFiles) {
    for (const link of markdownLinks(filePath)) {
      if (isExternalLink(link)) {
        continue;
      }
      const target = resolve(join(filePath, ".."), link);
      if (!existsSync(target)) {
        issues.push({
          level: "error",
          message: `${relative(absoluteSkillDir, filePath)} 存在失效链接：${link}`,
        });
      }
    }
  }

  const skillLinks = new Set(
    markdownLinks(skillMd).filter((link) => link.startsWith("references/")),
  );
  const referenceFiles = listMarkdownFiles(
    join(absoluteSkillDir, "references"),
  );
  for (const referenceFile of referenceFiles) {
    const relativePath = relative(absoluteSkillDir, referenceFile);
    if (!skillLinks.has(relativePath)) {
      issues.push({
        level: "warn",
        message: `reference 未被 SKILL.md 直接链接：${relativePath}`,
      });
    }
  }

  for (const dirname of ["references", "scripts", "assets"]) {
    const directory = join(absoluteSkillDir, dirname);
    if (
      existsSync(directory) &&
      statSync(directory).isDirectory() &&
      readdirSync(directory).length === 0
    ) {
      issues.push({ level: "warn", message: `存在空壳目录：${dirname}/` });
    }
  }

  for (const filePath of listFilesRecursive(absoluteSkillDir)) {
    if (basename(filePath) === ".DS_Store") {
      issues.push({
        level: "warn",
        message: `存在无关系统文件：${relative(absoluteSkillDir, filePath)}`,
      });
    }
  }

  const scriptsDir = join(absoluteSkillDir, "scripts");
  if (existsSync(scriptsDir)) {
    for (const entry of readdirSync(scriptsDir)) {
      const scriptPath = join(scriptsDir, entry);
      if (!statSync(scriptPath).isFile()) {
        continue;
      }
      if (
        (entry.endsWith(".ts") ||
          entry.endsWith(".js") ||
          entry.endsWith(".sh")) &&
        !isExecutable(scriptPath)
      ) {
        issues.push({
          level: "warn",
          message: `脚本不可执行：${relative(absoluteSkillDir, scriptPath)}`,
        });
      }
    }
  }

  return issues;
}

const target = Bun.argv[2];
if (!target) {
  console.error("用法：scripts/validate-skill.ts <目标 skill 目录>");
  process.exit(2);
}

const issues = validate(target);
if (issues.length === 0) {
  console.log("OK: 未发现静态结构问题");
  process.exit(0);
}

let exitCode = 0;
for (const issue of issues) {
  console.log(`${issue.level.toUpperCase()}: ${issue.message}`);
  if (issue.level === "error") {
    exitCode = 1;
  }
}
process.exit(exitCode);
