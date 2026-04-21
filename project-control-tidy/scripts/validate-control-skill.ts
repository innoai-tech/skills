#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
const namePattern = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

type Issue = { level: "error" | "warn"; message: string };

function linksOf(file: string): string[] {
  return [...readFileSync(file, "utf8").matchAll(linkPattern)].map((match) => match[1]);
}

function external(link: string): boolean {
  return link.includes("://") || link.startsWith("#") || link.startsWith("mailto:");
}

function parseFrontmatter(text: string): Record<string, string> | null {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 4);
  if (end < 0) return null;
  const data: Record<string, string> = {};
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    if (!line.trim() || line.startsWith(" ")) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key && value) data[key] = value.replace(/^['"]|['"]$/g, "");
  }
  return data;
}

function validate(skillDir: string): Issue[] {
  const issues: Issue[] = [];
  const root = resolve(skillDir);
  const skill = join(root, "SKILL.md");
  const refs = join(root, "references");

  if (!existsSync(root) || !statSync(root).isDirectory()) {
    return [{ level: "error", message: `目标 skill 目录不存在：${skillDir}` }];
  }
  if (!existsSync(skill)) {
    return [{ level: "error", message: "缺少 SKILL.md" }];
  }

  const frontmatter = parseFrontmatter(readFileSync(skill, "utf8"));
  if (!frontmatter) {
    issues.push({ level: "error", message: "SKILL.md frontmatter 不合法" });
  } else {
    if (!frontmatter.name || !namePattern.test(frontmatter.name) || frontmatter.name.includes("--")) {
      issues.push({ level: "error", message: `name 不合法：${frontmatter.name ?? "<missing>"}` });
    } else if (frontmatter.name !== basename(root)) {
      issues.push({ level: "error", message: `name 与目录名不一致：${frontmatter.name} != ${basename(root)}` });
    }
    if (!frontmatter.description) {
      issues.push({ level: "error", message: "缺少 description" });
    }
  }

  const markdown = [skill];
  if (existsSync(refs)) {
    markdown.push(...readdirSync(refs).filter((f) => f.endsWith(".md")).map((f) => join(refs, f)).sort());
  }

  for (const file of markdown) {
    for (const link of linksOf(file)) {
      if (external(link)) continue;
      if (!existsSync(resolve(join(file, ".."), link))) {
        issues.push({ level: "error", message: `${relative(root, file)} 存在失效链接：${link}` });
      }
    }
  }

  const skillLinks = new Set(linksOf(skill).filter((link) => link.startsWith("references/")));
  if (existsSync(refs)) {
    for (const file of readdirSync(refs).filter((f) => f.endsWith(".md")).sort()) {
      const rel = `references/${file}`;
      if (!skillLinks.has(rel)) {
        issues.push({ level: "warn", message: `reference 未被 SKILL.md 直接链接：${rel}` });
      }
    }
  }

  for (const required of [
    "references/file-boundaries.spec.md",
    "references/agents.guideline.md",
    "references/readme.guideline.md",
    "references/justfile.guideline.md",
  ]) {
    if (!existsSync(join(root, required))) {
      issues.push({ level: "error", message: `缺少关键 reference：${required}` });
    }
  }

  return issues;
}

const target = Bun.argv[2] ?? "project-control-tidy";
const issues = validate(target);
if (issues.length === 0) {
  console.log("OK: project-control-tidy 静态结构检查通过");
  process.exit(0);
}
let code = 0;
for (const issue of issues) {
  console.log(`${issue.level.toUpperCase()}: ${issue.message}`);
  if (issue.level === "error") code = 1;
}
process.exit(code);
