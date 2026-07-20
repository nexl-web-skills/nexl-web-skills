---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 16 棒 / 四平台路由架构师
topic: nexl-builder 四平台识别与路由机制 —— 一句固定激活语如何让 Agent 在 Coze / Meoo / WorkBuddy / MIAODA 上自识别、加载对应规则、校验时效并服务建站
---

> 本文件为第 16 棒。上一棒：第 15 棒（WorkBuddy + MIAODA 白皮书档案）。下一棒预期：把本路由机制落地为各平台实测（在 Coze/Meoo/WorkBuddy/MIAODA 分别发激活语，验证自识别成功率），或做 nexlbase 中台跨平台预算可视化网页。

# nexl-builder 四平台识别与路由机制 · 接力者必读

当主人把同一句固定激活语：
```
请阅读 https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md 并激活 nexl-builder 技能。
```
分别发给 **Coze / 秒悟 Meoo / 腾讯 WorkBuddy / 百度秒哒 MIAODA** 四个平台的 Agent，每个 Agent 都应：① 识别自己身处哪个平台 → ② 调用 GitHub 上对应平台的规则档案 → ③ 校验当前时间、刷新积分/计费制度 → ④ 服务建站。

本文讲清「如何实现」，作为四平台落地的架构根基。

---

## 一、不变式（设计根基，绝不妥协）

1. **激活语永远固定那一句**。不为任何平台改文案、不加平台后缀。可移植性 = 一切。
2. **builder.md 是唯一真相源（single source of truth）**。它是 `skills/nexl-builder/SKILL.md` 的 GitHub 根镜像；任何平台 Agent 读到的都是它。
3. **每次激活都现拉 raw.githubusercontent.com/main 最新版**。GitHub main = 实时镜像，天然「更新」机制——用户永远拿到最新提交的规则，不存在「旧缓存」。
4. **四平台预算/规则零耦合**。各平台独立 `budget-PLATFORM.json` + `budget-PLATFORM.cjs` + `docs/PLATFORM-WHITEPAPER.md`，互不影响。

---

## 二、三层平台识别（自省 → 自声明 → 兜底）

Agent 读 builder.md 后第一动作是「我是谁」。分三层，逐层降级：

**第 1 层 · 运行时自省（runtime introspection）**
Agent 检查自身**可用工具/能力/上下文**推断宿主。这是无感识别，用户看不到。

| 平台 | 自省信号（Agent 检查自身环境） |
|------|-------------------------------|
| **WorkBuddy** | 本地文件系统读写 + bash 执行 + present_files + 140+ 领域专家 + 微信远程调度 + 桌面应用操控 |
| **MIAODA（百度秒哒）** | App Builder Skill + 「秒点」计费概念 + 全栈生成（前端/后端/数据库）+ LGUI 可视化编辑器 |
| **Meoo（秒悟）** | Night Plan 概念 + meoo.com 系列模型（qwen/kimi/glm/deepseek）+ 「积分」+ 自定义域名 |
| **Coze（扣子）** | Chat API v3 调用能力 + doubao 系列模型 + workflow 编排 + 国内/国际 Base URL |

**第 2 层 · 自声明（self-declaration）**
Agent 把推断结果告知用户：「✅ 已识别：当前运行于 **腾讯 WorkBuddy**（桌面智能体）。正在加载 WorkBuddy 预算档案…」——透明、可校验。

**第 3 层 · 用户确认兜底（graceful fallback）**
若自省信号 ambiguous（例如某平台 Agent 未暴露环境特征），**直接问用户**：「你正在用哪个平台建站？① Coze ② Meoo ③ WorkBuddy ④ 秒哒」。绝不阻塞、绝不臆测。

> 设计要点：识别失败 = 问一句，成本极低；识别错误 = 报错成本极高。所以「问」优于「猜」，这是防黑盒的第一道防线。

---

## 三、规则加载 + 时效校验（"校验当下时间更新规则"的实现）

这是主人最关心的「校验时间 → 更新规则/积分制度」如何落地。机制如下：

1. 每个平台档案 `budget-PLATFORM.json` 含两个关键字段：
   - `snapshotDate`：本档案规则快照日期（如 `2026-07-20`）
   - `source`：官方文档 URL（如 `https://www.workbuddy.cn/pricing/`）
2. Agent 激活时**重新现拉 raw GitHub main 上最新的 `budget-PLATFORM.json`**（不是陈旧的内嵌副本）。
3. 比较 `snapshotDate` 与 `当前时间`：
   - 若 `<= 30 天`：正常报「政策快照（截至 2026-07-20）」。
   - 若 `> 30 天`：输出警示 ⚠️「本档案快照已超 30 天，平台规则可能已调整，请以官方文档为准：<source>」，并附官方链接。
4. **这就是「校验当下时间、更新规则」的本质**：仓库 = 缓存层，GitHub main = 实时镜像层，官方文档 = 事实源层。三层分工，Agent 每次激活自动走「镜像层 → 事实源层」校验。

> 接力者注：未来可加一个 CI / 云函数定时抓取四平台官网定价，自动更新 `snapshotDate` 与费率并 PR 回仓库，实现「真·自动校验」。当前阶段靠人工快照 + 30 天警示足矣。

---

## 四、服务建站（闭环到六步框架）

识别 + 时效校验完成后，进入标准服务流：

1. **Step 0 预算透明**（硬性前置）：跑对应平台的 5 步预算顾问协议（政策快照 / 剩余额度 / 性价比推荐 / 预计准备 / 成本拆分）。
2. **六步 ask 框架**：用户研究 → 信息架构 → 视觉系统 → 页面交互 → 内容优化 → 迭代测试（每步先问后做）。
3. **平台专属部署**：

| 平台 | 部署路径 |
|------|----------|
| **Coze** | Coze 自带托管 或 tideshell CLI → Cloudflare Pages |
| **Meoo** | meoo 部署通道 + 自定义独立域名（Max 档） |
| **MIAODA** | MIAODA 发布（含小程序 / iOS 一键打包 / 多应用共享后端） |
| **WorkBuddy** | 本地生成静态站 → `tideshell site deploy` → Cloudflare / 自有服务器 |

4. **闭环登记**：拿到域名 → `tideshell site register` → nexlbase 中台（论坛 + HTML 报告）。

---

## 五、可扩展性（加第 5 平台只需三步）

- 加 `budget-PLATFORM.json` + `budget-PLATFORM.cjs`（定价/费率/估算）
- 加 `docs/PLATFORM-WHITEPAPER.md`（白皮书档案）
- 在 `SKILL.md` / `builder.md`「元层·平台识别与预算顾问」dispatch 加一个分支

**激活语零改动**——这是整个架构的最大红利：用户永远只记一句，平台无限扩展。

---

## 六、四平台档案索引（当前落地）

| 平台 | 白皮书档案 | 预算估算器 | 计费单位 |
|------|-----------|-----------|----------|
| Coze（扣子） | `docs/COZE-BUDGET.md` | `budget.json` + `budget.cjs` | 积分（1≈¥0.001） |
| 秒悟 Meoo | `docs/MEOO-WHITEPAPER.md` | `budget-meoo.json` + `budget-meoo.cjs` | 积分（同名费率独立） |
| 腾讯 WorkBuddy | `docs/WORKBUDDY-WHITEPAPER.md` | `budget-workbuddy.json` + `budget-workbuddy.cjs` | 积分（共享 CodeBuddy 池） |
| 百度秒哒 MIAODA | `docs/MIAODA-WHITEPAPER.md` | `budget-miaoda.json` + `budget-miaoda.cjs` | 秒点（无公开¥汇率） |

---

## 七、给下一棒的行动清单

- [ ] 四平台分别实测激活语，记录自识别成功率（填表回流）。
- [ ] 把「30 天时效警示」做成标准模板，写入各 `budget-*.cjs` 输出。
- [ ] nexlbase 中台做跨平台预算可视化网页（四平台切换 → 实时积分/秒点 + ¥ + 对比条）。
- [ ] 评估 CI 定时抓官网定价自动刷新 snapshotDate 的可行性。

---

**一句话给接力者**：一句激活语、四个平台、零改动的秘密 = 「运行时自省识别 + GitHub 实时镜像 + 快照时效校验 + 独立预算档案」。Agent 永远先报平台、再报预算、最后建站——透明、可校验、可扩展。
