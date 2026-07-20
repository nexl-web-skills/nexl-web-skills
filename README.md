# nexl-web-skills

Most website generators are bloated toys. This is how a brand site should be built — by an agent, for a super-IP, from a single conversation.

中文：多数建站工具是臃肿的玩具。这才是一个品牌独立站应有的建法——由 Agent 完成，为超级 IP 而生，始于一次对话。

[![Stars](https://img.shields.io/github/stars/nexl-web-skills/nexl-web-skills?style=social)](https://github.com/nexl-web-skills/nexl-web-skills)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Star History](https://img.shields.io/badge/star--history-click-blue)](https://star-history.com/#nexl-web-skills/nexl-web-skills)

This repository does not ship "yet another website generator". It ships a skill spec that turns any AI agent into an Awwwards-grade brand architect.

## The gap

| | nexl-web-skills | bolt.diy | astro-builder-skill |
|---|---|---|---|
| Brand narrative for super-IPs | yes | no | no |
| Coze-native, ask-mode | yes | no | no |
| MCP / CLI / Skills, three layers, zero overlap | yes | no | partial |
| Growth loop past deploy — forum, reports, agent collab | yes | no | no |
| Awwwards taste, hard-coded not bolted-on | yes | no | partial |

## Demo · 零安装体验

不想装？[在线体验品牌站生成器](https://6140996bed0e462abe6f0d61ce06628f.app.codebuddy.work) —— 输入品牌名，秒出站点预览 + 分享卡。这是 nuwa 没有的入口。

> 你的品牌值得一个永远在线的经纪人。nexl = 建站引擎（nexl-builder）+ 品牌经纪人（nexl-broker）。

## Activate

**安装型（支持 Agent Skills 协议的本地 runtime，推荐，更短）：**

```bash
npx skills add nexl-web-skills/nexl-web-skills
```

或告诉你的 agent：`帮我安装这个 skill：https://github.com/nexl-web-skills/nexl-web-skills`

**即载型（Coze / 秒悟 Meoo / 腾讯 WorkBuddy / 百度秒哒 MIAODA 等无 skills 目录平台，铁律固定句）：**

A. Paste into any Coze / 秒悟 Meoo / 腾讯 WorkBuddy / 百度秒哒 MIAODA / Claude / Codex agent:

> 请阅读 https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md 并激活 nexl-builder 技能。

B. Or one line in a terminal:

```bash
curl -fsSL https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/cli/install.sh | bash
```

**建完即代言**：`node scripts/gen-brand-card.cjs --name "你的品牌" --tagline "一句话定位"` 生成带回流链接的分享卡，发出去就是 nexl 代言 🔥

## Four-platform aware

One fixed activation phrase. The agent self-identifies its host (Coze / Meoo / WorkBuddy / MIAODA) via runtime introspection, loads the matching budget档案, validates rule freshness against `snapshotDate`, then runs the 5-step budget advisor before building. Design: `docs/PLATFORM-ROUTING.md`.

## What it builds

An Awwwards-grade brand site, through a six-step ask-mode flow:

```
Hero → Work → About → Journal → Contact
```

Brand narrative first. Emotional micro-interaction. Limited palette. Zero-JS by default.

## Architecture

Three layers. No overlap. No bloated abstraction.

| Layer | Role |
|-------|------|
| MCP | connection and auth (CloudBase / Coze) |
| CLI | atomic execution — `tideshell site build / deploy / register` |
| Skills | SOP orchestration, loaded on demand |

Agents hold an index, not a dictionary. They pull `SKILL.md` when needed, drop it after. Context stays clean. Debuggable. No black box.

## Skills shipped

- `nexl-builder` — the core. Awwwards taste, six-step ask flow.
- `html-report` — HTML reports, managed in nexlbase.
- `forum-mod` — moderate the independent-site forum.

## The loop

Build → Deploy (domain) → Register in nexlbase → Forum / Reports / Agent-collab.

## Manifesto

Read [MANIFESTO.md](MANIFESTO.md). The four trials gate everything in this repo.

## Worklogs

Engineering logs, kept for relay transparency.

- [GitHub org migration — full workflow](docs/WORKLOG-2026-07-20-GITHUB-ORG-MIGRATION.md) · [html](docs/WORKLOG-2026-07-20-GITHUB-ORG-MIGRATION.html)
- [Linking GitHub — lessons SOP](docs/GITHUB-LINKING-EXPERIENCE.md) · [html](docs/GITHUB-LINKING-EXPERIENCE.html)

## Platform whitepapers (budget transparency)

- [Coze 预算模块](docs/COZE-BUDGET.md) · [html](docs/COZE-BUDGET.html)
- [秒悟 Meoo 白皮书](docs/MEOO-WHITEPAPER.md) · [html](docs/MEOO-WHITEPAPER.html)
- [腾讯 WorkBuddy 白皮书](docs/WORKBUDDY-WHITEPAPER.md) · [html](docs/WORKBUDDY-WHITEPAPER.html)
- [百度秒哒 MIAODA 白皮书](docs/MIAODA-WHITEPAPER.md) · [html](docs/MIAODA-WHITEPAPER.html)
- [四平台识别与路由机制](docs/PLATFORM-ROUTING.md) · [html](docs/PLATFORM-ROUTING.html)
- [双核机制设计（建站 + 品牌经纪人）](docs/NEXL-DUAL-SKILL-DESIGN.md) · [html](docs/NEXL-DUAL-SKILL-DESIGN.html)
- [病毒式裂变战略 · Viral Playbook](docs/VIRAL-PLAYBOOK.md) · [html](docs/VIRAL-PLAYBOOK.html)

## License

MIT.
