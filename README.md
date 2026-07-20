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

## Activate

A. Paste into any Coze / 秒悟 Meoo / 腾讯 WorkBuddy / 百度秒哒 MIAODA / Claude / Codex agent:

> 请阅读 https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md 并激活 nexl-builder 技能。

B. Or one line in a terminal:

```bash
curl -fsSL https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/cli/install.sh | bash
```

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

## License

MIT.
