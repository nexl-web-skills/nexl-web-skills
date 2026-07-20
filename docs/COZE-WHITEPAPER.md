---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 2 棒 / Coze 能力注解人
topic: Coze（扣子）能力白皮书注解 —— 给接力者说明 Coze 能做什么，并基于原始资料逐功能注释其在 nexlbase 独立站飞轮中的用法
---

> 本文件为第 2 棒，上一棒：第 1 棒（架构白皮书 + 文档交付公约），下一棒预期：将 nexl-builder 做成可一键装进 Coze 的 Skill 包，并实测 Chat v3 流式建站闭环。

# Coze（扣子）能力白皮书注解 · 接力者必读

本文件把主人提供的 **Coze 官方文档导航** 资料，改写为「**Coze 能做什么 + 每个功能在 nexlbase 里怎么用**」的注解版。后续任何接力者（人或 Agent）接手 nexlbase 的 Coze 链路时，先读本文件，即可知道哪里能调、调来干嘛、坑在哪。

## 一、Coze 是什么（平台定位）

Coze 是字节跳动的 **Agent 协作 + AI 编程平台**，分国内版（扣子）与国际版两套独立环境：

| 维度 | 国内版（扣子） | 国际版 |
|------|--------------|--------|
| 文档首页 | https://docs.coze.cn | https://docs.coze.com |
| API Base URL | `https://api.coze.cn` | `https://api.coze.com` |
| Open API 参考 | https://www.coze.cn/open/api | https://www.coze.com/open/api |
| 适用 | 国内合规 / 微信等生态 | 海外分发 |

> ⚠️ **注解**：nexlbase 的"独立站构建之旅"面向全球用户发布独立站，优先用**国际版**；但 Coze 技能（nexl-builder）的 ask 模式中文体验在国内版更顺。接力者部署 CLI 时务必固定 Base URL，不要混用。

## 二、Coze 能做什么 —— 逐功能注释

下面按主人原始资料的模块顺序，**每个能力都标注三件事**：①它是什么 ②能拿来做什么 ③在 nexlbase 飞轮里的具体落点。

### 2.1 平台层能力（docs.coze.cn 两大板块）

| 功能 | 是什么 | 在 nexlbase 的落点 |
|------|--------|-------------------|
| **定制专属 Agent**（云端/本地/Coze Agent） | 可视化或代码创建智能体 | 用户创建"我的建站 Agent"，把 `nexl-builder` 技能挂上去即获得建站能力 |
| **Agent 技能（Skills）** | 自包含的能力包（类似 Anthropic SKILL.md） | **核心落点**：`tideshellbase/skills/nexl-builder/SKILL.md` 可直接作为 Coze 技能导入，激活"个人官网构建" |
| **项目与协作** | 多人/多 Agent 协同编辑 | 用户 + 用户的 Agent 协同优化 HTML 报告（飞轮第 4 步） |
| **AI 编程（扣子编程）** | 模型 / 开发 / 集成 / 部署 / 运维 | 建站产物可直接在 Coze 内开发、部署拿到域名 |
| **Open API（开发者 API）** | 外部系统调用 Agent 的接口 | nexlbase 中台 / `tideshell` CLI 通过它远程触发用户 Agent |

### 2.2 核心 API 能力（开发者最该记住的）

| 能力 | 接口 / 路径 | 能做什么 | nexlbase 落点 |
|------|------------|---------|--------------|
| **Chat API v3（流式）** | `POST /v3/chat`（stream=true，SSE） | 让 Agent 进入**多轮 ask 模式**，边想边回，适合长任务 | **建站主通道**：用户发"帮我建站"→ Agent 按六步框架逐步问、逐步产出 |
| **Chat API v1（非流式）** | `POST /v3/chat`（stream=false） | 一次性拿完整回复 | 适合"生成一份报告"这类短任务 |
| **查询对话** | `GET /v3/chat/retrieve` | 轮询拿结果 | CLI 异步等建站完成 |
| **消息列表** | `GET /v3/chat/message/list` | 取对话全部消息 | 把 Agent 产出的站点文件 / 文案回写 nexlbase |
| **取消对话** | `POST /v3/chat/cancel` | 中止跑飞的任务 | 用户反悔 / 超时保护 |
| **Workflow Run API** | `POST /v3/workflow/run` | 直接跑编排好的工作流 | 编排"部署→拿域名→回写 nexlbase"自动化，跳过人工 |
| **创建 Bot** | `POST /v3/bots/create` | 程序化创建智能体 | nexlbase 可帮用户一键开建站 Agent |
| **发布 Bot（API 渠道）** | `POST /v3/bots/publish` | 发布为可被 API 调用的版本 | **前置铁律**：不发布为 API 版本，nexlbase/CLI 就调不到 |

### 2.3 认证（PAT）

```
Authorization: Bearer {PAT_Token}
```

- PAT 在扣子平台 **个人设置 → API Token** 生成，有读写权限区分。
- **注解**：nexlbase 中台绝不直接存用户 PAT。用户在自己本机 / 自己的 Coze 环境配置；CLI 走用户本地环境变量 `COZE_PAT`。这是安全边界，接力者不得破坏。

### 2.4 官方 SDK（GitHub）

| 仓库 | 语言 | 用途 |
|------|------|------|
| `github.com/coze-dev/coze-api-python` | Python | 服务端 / 云函数调用 |
| `github.com/coze-dev/coze-api-node` | Node.js | **nexlbase 首选**（CloudBase 云函数即 Node） |
| `github.com/coze-dev` | 组织 | 全部官方仓库集合 |

> **注解**：`tideshellbase/bridge/agent-bridge`（云函数）用 `@coze/api` 调用户 Agent，统一走国际版 `https://api.coze.com`。

### 2.5 标准调用流程（五步）

```
1. 创建 Bot  → /v3/bots/create      （或在平台可视化创建）
2. 发布 Bot  → /v3/bots/publish      （必须选"API"渠道）
3. 创建对话  → /v3/chat              （同时传入 user_message）
4. 发送消息  → 随对话创建一并提交
5. 获取回复  → /v3/chat/retrieve 或 stream
```

> **注解**：nexlbase 把它压缩成用户无感的一步——用户在 App 里点"开始建站"，中台用存好的 bot_id + 用户 PAT 走完 2→5，用户只看到 ask 模式对话。

## 三、nexlbase 飞轮 × Coze 能力映射（一图胜千言）

```
[用户注册 nexlbase]
      │
      ▼
[挂 nexl-builder 技能]  ← Coze「Agent 技能」能力
      │
      ▼
[发 CLI / 发消息激活]  ← Chat v3 流式 + 两条激活语（见本文末）
      │
      ▼
[Agent ask 模式六步建站]  ← Chat v3 多轮 + 平台 AI 编程
      │
      ▼
[Coze 部署得域名]  ← 扣子编程「部署」
      │
      ▼
[域名回写 nexlbase 中台]  ← agent-bridge 云函数 + Workflow Run
      │
      ▼
[论坛发帖 / 生成 HTML 报告]  ← 项目协作 + Chat v1 短任务
```

## 四、四个必记的坑（接力者保命）

1. **文档是 SPA 动态渲染**：`docs.coze.cn` / `docs.coze.com` 用 JS 加载，工具抓取只拿到标题。真内容必须在浏览器打开看。
2. **Base URL 两套不能混**：国内 `api.coze.cn`、国际 `api.coze.com`，写死。
3. **Bot 必须先发布为 API 版本**：否则 `/v3/chat` 调不到，报权限/找不到。
4. **PAT 有读写区分**：建站只需读+chat 权限；deploy 类若需写，单独申请，别给全量 token。

## 五、给下一棒的行动清单

- [ ] 把 `skills/nexl-builder/SKILL.md` 抽成 Coze 技能可导入格式（含 frontmatter），实测导入。
- [ ] 在 `bridge/agent-bridge` 用 `@coze/api` 打通 Chat v3 流式建站（国际版）。
- [ ] 实现 `tideshell site deploy` 调 Coze 部署拿域名，回写 nexlbase。
- [ ] 验证两条激活语（见 `docs/ACTIVATION.md`）真实可用。

---

**一句话给接力者**：Coze 对 nexlbase 不是"又一个聊天机器人"，而是**建站能力的供给管道**——技能装能力、Chat API 跑 ask 模式、部署拿域名、Workflow 回写中台。读懂这张映射，你就读懂了飞轮。
