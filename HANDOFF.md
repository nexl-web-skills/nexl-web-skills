---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 当前接力者 / 公约起草人
topic: TideShellBase 文档交付公约 —— 所有文档须同时产出 md + html（Apple 极简图文风），且每份必标 日期·接力者·主题
---

# TideShellBase 接力者公约（HANDOFF CONVENTION）

> 本文件是 tideshellbase 的**根级入口**。任何后续接力者（接手本项目的人或 Agent）第一件事：先读本公约，再读 `docs/COGNITION.md`，最后读对应 `skills/*/SKILL.md`。

## 〇、为什么有这条公约
tideshellbase 是观涛虾（TideShell）在 nexlbase 生态中的**具身（embodiment）**，承载世界级 Agent 工程范式（CLI + Agent Skills + 三层解耦）。它会被多轮接力推进，且常由"人接力者 + AI 接力者"混合接手。为避免交接失忆、风格漂移、信息丢层，**所有文档从诞生起就必须双生、可扫读、可溯源**。

## 一、铁律（必须遵守）
1. **双生交付**：任何说明性 / 设计性 / 汇报性文档，必须同时生成 `.md` 与 `.html` 两份，内容一致、同源生成。
2. **HTML = Apple 极简图文风**：
   - 字体栈 `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif`；
   - 大量留白、克制配色（主色 `#1d1d1f` 文字 + 单一强调色，建议 `#0071e3` 或品牌 `#0D7A5F`）；
   - **图文解析**：关键结论配内联 SVG 图示（架构图 / 飞轮图 / 流程链），文字与图并排，不堆砌。
3. **三要素标注**：每份文档（md 与 html 一致）头部必须显式标注——
   - **日期**（YYYY-MM-DD）
   - **接力者信息**（谁写的、第几棒、上一棒是谁）
   - **主题**（一句话讲清这份文档在解决什么）
4. **溯源头**：正文开头用引用块写明"本文件为第 N 棒，上一棒：___，下一棒预期：___"。

## 二、文档头模板（直接抄）
```markdown
---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 N 棒 / 角色
topic: <一句话主题>
---

> 本文件为第 N 棒，上一棒：___，下一棒预期：___。
```

## 三、接力链（截至 2026-07-20）
| 棒次 | 接力者 | 贡献 |
|------|--------|------|
| 1 | 观涛虾🦐 (TideShell) | 架构白皮书 + CLI/Skills/MCP 三层解耦具身 + 本公约 |
| 2 | 观涛虾🦐 (TideShell) | Coze 能力白皮书注解（逐功能注释）+ 两条激活语设计 + setup/install.sh 落地 |

> 新接力者接手后，请在本表追加一行，并把"下一棒预期"补全。

## 四、阅读顺序建议
1. `HANDOFF.md` / `HANDOFF.html`（你正在读）
2. `docs/COGNITION.md`（认知与意图解码）
3. `index.yaml`（渐进式披露索引）
4. `skills/*/SKILL.md`（三个 Anthropic 规范 Skill 包）
5. `cli/README.md` + `mcp/README.md`（三层之执行层与连接层）

## 五、一句话给下一位接力者
**别重写范式，只往上长；每份产出双生、留白、标头。让 tideshellbase 永远"打开即懂、接手即续"。**
