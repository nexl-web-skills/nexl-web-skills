# 三平台内测激活卡 · INTERNAL-TESTING

> relay: 观涛虾🦐 (TideShell) · 2026-07-21 · 主题：三平台内测统一激活语 + 分平台操作卡 + 自识别验证 + 反馈回流表
> 公约：Apple 极简深色 · 中英双语可选 · 标日期/接力者/主题

---

## 0. 激活方式（两类模型：WorkBuddy 用激活语 / Coze 用人设模板）

```
请阅读 https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md 并激活 nexl-builder 技能。
```

- **已验证（2026-07-21）**：GitHub `main` 上 `builder.md` = HTTP 200，且含最新 `1.6 案例召回` 引用（GITHUB-AESTHETIC-REPOS），新鲜度 OK。
- ⚠️ **激活模型二分（实测结论）**：① **WorkBuddy（本地 agent）** 真能 fetch `builder.md` 当技能定义 → 用铁律激活语有效；② **Coze（云端 Bot）** 没有"激活技能"语义，会把 `builder.md` 当知识库文档总结 → **改用 `docs/COZE-BOT-PERSONA.md` 人设模板（复制进 Bot 人设框），不发激活语**。
- 
---

## 1. 三平台操作卡

| 平台 | 怎么发激活语 | 生效机制 | 验证成功标志 | 预算锚点（实测） | ⚠️ 注意 |
|------|------------|---------|------------|----------------|--------|
| **Coze（扣子）** | **不用激活语**；复制 `docs/COZE-BOT-PERSONA.md` 全部内容到 Bot「人设/回复逻辑」框，直接对话即可 | 人设已内联 NEXL 身份+六步+Coze 预算+基底注入；Bot 以 NEXL 身份直接运行 | 回中英双语双核亮相 + 报 Coze 预算卡 + 跑六步 ask | 15 轮≈400 积分（¥0.4）；含 4 图≈1280（¥1.3） | 人设模板已含全部指令，不依赖 fetch raw，**无 GFW 风险**；扣子无终端 |
| **秒悟 Meoo** | 对话首句**粘贴激活语** | agent 本地读 `templates/INDEX.json`（或经 MCP 拉取） | 识别为 Meoo + 报预算（Night Plan 22:00–08:00 qwen3.7-max 2 折≈¥0.10） | 15 轮 ¥0.14–2.3；Night Plan **2 折≈¥0.10** | 🔴 **合规红线**：禁接境外模型（OpenAI/Google），只用 qwen/kimi/glm/deepseek 境内合规；域名必备案 |
| **腾讯 WorkBuddy** | **技能激活 nexl-builder**（本地）；或把激活语发给观涛虾（即 WorkBuddy agent） | 技能激活即加载 INDEX 到上下文；免费额度内无限检索 | 识别为 WorkBuddy + 跑 `budget-workbuddy.cjs` | 免费 500 积分/月≈**6 次**建站（15 轮≈75 积分 ¥0.075） | 本地技能需 nexl-builder 在 skills 目录；本机已装观涛虾技能集 |

---

## 2. 内测回流表（每平台测完回填）

| 平台 | 激活时间 | 自识别成功? | 预算卡触发? | 8 维守门触发? | 产出质量(1-5) | 卡点/问题 | 截图/录屏链接 |
|------|---------|-----------|-----------|-------------|-------------|----------|-------------|
| Coze | | | | | | | |
| Meoo | | | | | | | |
| WorkBuddy | | | | | | | |

---

## 3. 铁律校验（激活后 agent 必须遵守）

- （WorkBuddy）激活语**零改动**，不为任何平台加后缀；Coze 用 `COZE-BOT-PERSONA.md` 人设模板，亦零改动
- **不报预算不许开工**（Step 0 预算顾问协议）
- **8 维一致性守门**每版必过
- 底稿必导出**可复制文本块**（brand-profile 复利）
- 合规红线：Meoo 不接境外模型 / 域名必备案

---

## 4. 内测重点验证项

1. **Coze 激活模型**：实测 Coze 不认"fetch 激活语"，改用 `COZE-BOT-PERSONA.md` 人设模板内联（已规避 GFW，无需 fetch raw）。
2. **三平台自识别成功率**：Agent 是否真在第一句报出平台名。
3. **预算卡真实触发**：尤其 Meoo Night Plan 折后价是否准确。
4. **案例召回**：激活后能否调出 `aurora-minimal` 当标杆（质量/性价比/稳定性三维）。

---

> 下一步：回流表填完 → 汇总自识别成功率 → 若某平台失败，按 `docs/PLATFORM-ROUTING.md` 兜底机制（问用户所在平台）修正。
