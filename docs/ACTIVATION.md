---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 4 棒原创/升级 · 第 5 棒回填真实 owner
topic: 两条极简激活语（双源：GitHub raw 主源 richard702ayu/nexl-web-skills + CloudBase 镜像兜底）
---

> 本文件为第 2 棒原创、第 4 棒升级为双源、第 5 棒（2026-07-20）回填真实 owner `richard702ayu/nexl-web-skills`。上一棒：第 3 棒 CloudBase 免备案方案（中间页挡 Agent 痛点）。本棒引入 **GitHub 作为 Skill 真相源 + 分发中枢**，一举解决中间页痛点——范式 A 回到"一行 URL 真激活"。**仓库已建：https://github.com/richard702ayu/nexl-web-skills**

# 两条激活语 · 开启独立站构建之旅（双源版）

主人要求：**参照两条范式，设计出类似这样精简的语言**——用户只需发给 Agent、或在终端敲一行，就能开启他的"独立站构建之旅"。

| 范式来源 | 原句 |
|----------|------|
| 发给 Agent（自然语言） | 请阅读 https://agent.qq.com/doc/cli-setup.md 文档，按照步骤为我安装并配置 Agent Mail CLI。 |
| 终端一行（安装 CLI） | `curl -fsSL https://code.kimi.com/kimi-code/install.sh \| bash` |

## 一、范式 A —— 发给你的 Coze / Claude / Codex Agent

**GitHub raw 主源（全球，无中间页，⭐ 已上线可用）**：
```
请阅读 https://raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/skills/nexl-builder/SKILL.md
文档，按步骤激活 nexl-builder 独立站构建技能，开启我的独立站构建之旅。
```
> 实测：`raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/skills/nexl-builder/SKILL.md` 返回合法 YAML frontmatter，Agent 的 WebFetch 与终端 `curl` 都能直接读 → **范式 A 真正可用，无需复制粘贴降级**。

**国内镜像兜底（Agent 读 GitHub 失败/GFW 时回落，待 CloudBase 部署）**：
```
请阅读 https://{DEFAULT_DOMAIN}/tideshell/skills/nexl-builder/SKILL.md
文档，按步骤激活 nexl-builder 独立站构建技能，开启我的独立站构建之旅。
```
> `{DEFAULT_DOMAIN}` = CloudBase 静态托管默认域名（免备案，但浏览器有中间页；Agent 读取失败时人工点确认后复制）。

## 二、范式 B —— 终端一行（安装 TideShell CLI）

**GitHub raw 主源（已上线可用）**：
```
curl -fsSL https://raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/cli/install.sh | bash
```

**国内镜像兜底（待部署）**：
```
curl -fsSL https://{DEFAULT_DOMAIN}/tideshell/install.sh | bash
```
> install.sh 已切 GitHub raw 主源：先拉 `SKILL.md`（无中间页），离线优雅降级。

## 三、两句话背后的设计原则

1. **极简即入口**：不教用户配环境；一句口令 = 一个动作 = 一段旅程。
2. **双轨并存**：自然语言面向"只想说话"的用户，CLI 面向"想自动化"的用户，殊途同归到同一套 nexl-builder 能力。
3. **双源韧性**：GitHub 主源（全球无中间页）+ CloudBase 镜像（国内兜底），任一不可达都不阻断激活。
4. **URL 即契约**：公开 URL 部署后长期可用、内容可审计；星标仓库本身即信任背书与自传播节点。
5. **复用范式不 reinvent**：完全对齐主流 Agent CLI 的"读文档激活 / curl 安装"两式，用户零学习成本。

## 四、所触发的文件（双源部署清单）

| 公开 URL（GitHub 主源） | 国内镜像 URL | 仓库对应文件 | 作用 |
|----------|--------------|--------------|------|
| `raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/skills/nexl-builder/SKILL.md` | `{DEFAULT_DOMAIN}/tideshell/skills/nexl-builder/SKILL.md` | `skills/nexl-builder/SKILL.md` | 真正的建站技能包 |
| `raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/cli/install.sh` | `{DEFAULT_DOMAIN}/tideshell/install.sh` | `cli/install.sh` | 本地安装 TideShell CLI |

> GitHub repo `github.com/richard702ayu/nexl-web-skills` 同时承载星标增长飞轮（见 GITHUB-STRATEGY.md）。

## 五、双源关键说明

- **GitHub raw 无中间页**：这是相对 CloudBase 默认域名的核心优势——范式 A 回到"一行 URL 真激活"，不必走"复制 SKILL.md 全文"的降级路径。
- **CloudBase 镜像意义**：githubusercontent 在国内偶发被墙（GFW），CloudBase 上海节点国内直连稳 → 作为兜底，确保国内用户不掉链。
- **回填占位**：`{DEFAULT_DOMAIN}` 待 CloudBase 静态托管部署后回填（见 DEPLOY-TIDESHELL.md 第 5 步）。
