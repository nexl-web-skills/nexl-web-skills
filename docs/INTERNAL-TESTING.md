# 四平台内测激活卡 · INTERNAL-TESTING

> relay: 观涛虾🦐 (TideShell) · 2026-07-21 · 主题：四平台内测统一激活语 + 分平台操作卡 + 自识别验证 + 反馈回流表
> 公约：Apple 极简深色 · 中英双语可选 · 标日期/接力者/主题

---

## 0. 唯一激活语（铁律 · 四平台通用 · 一字不改）

```
请阅读 https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md 并激活 nexl-builder 技能。
```

- **已验证（2026-07-21）**：GitHub `main` 上 `builder.md` = HTTP 200，且含最新 `1.6 案例召回` 引用（GITHUB-AESTHETIC-REPOS），新鲜度 OK。
- ⚠️ **禁用路径变体**：`docs/COZE-INTERNAL-TEST.*` 里出现的 `…/skills/nexl-builder/SKILL.md` 路径是旧「方案 B 即时激活」测试句，**不是铁律句**。本轮内测统一用上面指向 `builder.md` 的铁律句，避免激活语与文档/镜像不一致。

---

## 1. 四平台操作卡

| 平台 | 怎么发激活语 | 生效机制 | 验证成功标志 | 预算锚点（实测） | ⚠️ 注意 |
|------|------------|---------|------------|----------------|--------|
| **Coze（扣子）** | 建 Bot → 知识库**预置 builder.md**（在线网页填 raw URL 自动同步）→ 人设写「掌握 nexl-builder，按六步+双核推进」→ 把激活语发给 Bot | 方案 A 知识库预置最稳（即使 GFW 阻断 raw，Bot 仍从知识库命中）；方案 B 工作流 LinkReaderPlugin 抓 URL | 回「✅ 已识别：Coze」+ 报预算卡 + 跑六步 ask | 15 轮≈400 积分（¥0.4）；含 4 图≈1280（¥1.3） | jsDelivr 已弃用；coze.cn 下 raw 是否 GFW 干扰**待验证（内测重点）**；扣子无终端，curl\|bash 无效 |
| **秒悟 Meoo** | 对话首句**粘贴激活语** | agent 本地读 `templates/INDEX.json`（或经 MCP 拉取） | 识别为 Meoo + 报预算（Night Plan 22:00–08:00 qwen3.7-max 2 折≈¥0.10） | 15 轮 ¥0.14–2.3；Night Plan **2 折≈¥0.10** | 🔴 **合规红线**：禁接境外模型（OpenAI/Google），只用 qwen/kimi/glm/deepseek 境内合规；域名必备案 |
| **腾讯 WorkBuddy** | **技能激活 nexl-builder**（本地）；或把激活语发给观涛虾（即 WorkBuddy agent） | 技能激活即加载 INDEX 到上下文；免费额度内无限检索 | 识别为 WorkBuddy + 跑 `budget-workbuddy.cjs` | 免费 500 积分/月≈**6 次**建站（15 轮≈75 积分 ¥0.075） | 本地技能需 nexl-builder 在 skills 目录；本机已装观涛虾技能集 |
| **百度秒哒 MIAODA** | 对话**粘贴激活语** / 装 **Miaoda App Builder Skill**（OpenClaw 龙虾调用） | 全栈原生：clone 模板 scaffold；App Builder Skill 内嵌 INDEX | 识别为 MIAODA + 跑 `budget-miaoda.cjs`（秒点） | 免费 **610 秒点 = 1.26 次**全栈建站（15 请求+发布+后端≈485） | 全栈原生（前后端+数据库+小程序+原生 APP） |

---

## 2. 内测回流表（每平台测完回填）

| 平台 | 激活时间 | 自识别成功? | 预算卡触发? | 8 维守门触发? | 产出质量(1-5) | 卡点/问题 | 截图/录屏链接 |
|------|---------|-----------|-----------|-------------|-------------|----------|-------------|
| Coze | | | | | | | |
| Meoo | | | | | | | |
| WorkBuddy | | | | | | | |
| MIAODA | | | | | | | |

---

## 3. 铁律校验（激活后 agent 必须遵守）

- 激活语**零改动**，不为任何平台加后缀
- **不报预算不许开工**（Step 0 预算顾问协议）
- **8 维一致性守门**每版必过
- 底稿必导出**可复制文本块**（brand-profile 复利）
- 合规红线：Meoo 不接境外模型 / 域名必备案

---

## 4. 内测重点验证项

1. **Coze GFW 风险**：coze.cn 下 raw GitHub 是否被拦截 → 决定方案 A（知识库）还是方案 B（工作流）。
2. **四平台自识别成功率**：Agent 是否真在第一句报出平台名。
3. **预算卡真实触发**：尤其 Meoo Night Plan 折后价、MIAODA 秒点扣减是否准确。
4. **案例召回**：激活后能否调出 `aurora-minimal` 当标杆（质量/性价比/稳定性三维）。

---

> 下一步：回流表填完 → 汇总自识别成功率 → 若某平台失败，按 `docs/PLATFORM-ROUTING.md` 兜底机制（问用户所在平台）修正。
