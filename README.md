# nexl-web-skills

> The open skill spec that turns any AI agent into an Awwwards-level brand-site architect for super-IPs. **One conversation. Zero code. Live domain.**

[![Stars](https://img.shields.io/github/stars/richard702ayu/nexl-web-skills?style=social)](https://github.com/richard702ayu/nexl-web-skills)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Star History](https://img.shields.io/badge/star--history-click-blue)](https://star-history.com/#richard702ayu/nexl-web-skills)

**中文**：为全世界超级IP，一句话生成 Awwwards 级品牌独立站。不写一行代码，一个对话，上线域名。

---

## ✨ Why nexl-web-skills

| | nexl-web-skills | bolt.diy | astro-builder-skill |
|---|---|---|---|
| Super-IP brand storytelling | ✅ | ❌ | ❌ |
| Coze-native + ask mode | ✅ | ❌ | ❌ |
| MCP / CLI / Skills 3-layer architecture | ✅ | ❌ | ⚠️ |
| nexlbase growth loop (forum / reports / agent collab) | ✅ | ❌ | ❌ |
| Awwwards-level taste hard-coded | ✅ | ❌ | ⚠️ |

We don't build "yet another website generator". We turn any AI agent into a **brand architect** for super-IPs — with narrative-first design, emotional micro-interactions, and a growth loop that doesn't stop at "deploy".

---

## 🚀 Activate in 30 seconds

**A. Send this to your Coze / Claude / Codex Agent:**

> 请阅读 https://raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/skills/nexl-builder/SKILL.md 文档，按照步骤为我激活 nexl-builder 独立站构建技能，开启我的独立站构建之旅。

**B. Or one line in your terminal:**

```bash
curl -fsSL https://raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/cli/install.sh | bash
```

---

## 🏗️ What gets built

An **Awwwards-level brand site** through a 6-step ask-mode flow:

```
Hero → Work → About → Journal → Contact
```

With brand narrative (Who → Why → What → How), emotional micro-interactions, limited palette, and zero-JS performance by default.

---

## 🧩 Architecture (3-layer decoupling)

| Layer | Role |
|-------|------|
| **MCP** | Connection & auth (CloudBase / Coze) |
| **CLI** | Atomic execution (`tideshell site build/deploy/register`) |
| **Skills** | SOP orchestration (progressive disclosure) |

Agents load only an index, then pull `SKILL.md` on demand — keeping context clean, debuggable, and black-box-free.

---

## 📦 Included skills

- `nexl-builder` — the core brand-site builder (Awwwards taste + 6-step ask flow)
- `html-report` — generate HTML reports managed in nexlbase
- `forum-mod` — moderate your independent-site forum

---

## 🔗 Growth loop

Build → Deploy (get a domain) → Register in **nexlbase** → Forum posts / HTML reports / Agent-collab optimization.

---

## 🤝 Contributing

Fork → Branch → PR. We respond within 48h. See [HANDOFF.md](HANDOFF.md) for the relay convention.

## 📄 License

MIT © nexl-web-skills
