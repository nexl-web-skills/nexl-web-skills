---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 7 棒（激活语实现机制研究 + 分平台落地蓝图）
topic: 研究两条极简激活语（范式 A 自然语言 / 范式 B CLI 一行）从"一句话"到"真正激活 nexl-builder skill"的完整技术链路、分平台语义鸿沟与实现蓝图
---

> 上一棒：第 6 棒 GitHub 组织迁移全流程 + 链接经验 SOP。本棒研究两条激活语的实现机制，核出**设计稿声明与代码现实的落差**，并给出分平台落地蓝图。下一棒预期：实现 install.sh 真激活（复制到本地 skills 目录 + 双源 fallback）+ 给 Coze 配"读取 URL"节点。

# 两条极简激活语 · 如何实现（实现机制研究）

## 〇、结论先行

两条激活语不是" magic sentence "，而是**两个分发通道**。它们能否"真正激活"，完全取决于**目标 Agent 平台的 skill 加载机制**：

- **范式 A（发给 Agent 一句"请阅读 URL 激活"）** = 依赖 Agent 有"读 URL"能力（WebFetch / HTTP 工具）。对 Claude / Codex / Cursor **已真可用**；对 **Coze 云端 bot 默认不生效**（bot 无原生 WebFetch，需配代码节点或手动粘贴降级）。
- **范式 B（`curl | bash` 一行）** = 依赖 install.sh 把 skill 注入本地 Agent。但**当前 install.sh 只装了 CLI 壳 + 下载 SKILL.md 到 `~/.tideshell/skills/`，未复制到任何 Agent 的 skills 目录** → 装完仍需手动粘贴，不是"一行激活"，是"一行装壳"。

**诚实审计**：`ACTIVATION.md` 声称"范式 A 已上线可用、无需复制粘贴降级"，该声明**对 Claude 系成立，对 Coze 不成立**（Coze 默认无 WebFetch）。代码侧 install.sh 的"双源 fallback"也尚未实现（仅 GitHub raw 单源）。

---

## 一、现状审计（四文件交叉核对）

| 文件 | 声称 | 代码/文档现实 |
|------|------|---------------|
| `ACTIVATION.md` | 范式 A 已真激活、无需粘贴降级 | 仅对 Claude 系成立；Coze 需粘贴（见 USAGE） |
| `cli/install.sh` | 切 GitHub raw 主源、离线降级 | 只下载 SKILL.md 到 `~/.tideshell/skills/`，装 CLI 壳；**无 CloudBase fallback**；deploy/register 标注 `not wired yet` |
| `skills/nexl-builder/SKILL.md` | Self-contained，copy-paste 到任意 Agent | 激活方式仍是"手动粘贴全文进人设/技能"（第一节） |
| `skills/nexl-builder/USAGE.md` | 三种激活方式 | A/B/C 全是"复制 SKILL.md 全文粘贴"或 API 传入 |

**核心落差**：激活语想让用户"发一句 URL / 敲一行命令"就活；但真实加载仍靠"复制全文粘贴"。中间隔着**平台 skill 加载机制**这道墙。

---

## 二、范式 A 实现链路（自然语言激活）

```
用户发："请阅读 <URL> 并激活 nexl-builder"
   │
   ├─ Agent 有 WebFetch/HTTP 工具？（Claude / Codex / Cursor）
   │     └─ YES → GET raw.githubusercontent.com/.../SKILL.md
   │            → 拿到纯文本（YAML frontmatter + 指令）
   │            → 按 SKILL.md 进入六步 ask 流程 ✅ 真激活
   │
   └─ Agent 无 WebFetch（Coze 云端 bot 默认）
         └─ NO → 拿不到 SKILL.md
               → 需补：Coze"读取 URL"代码节点 / 插件
               → 或降级：用户手动把 SKILL.md 粘贴进 bot 人设（USAGE 方式 A）
```

**技术真相**：GitHub raw 无中间页 → Agent WebFetch 直接拿纯文本 ✅。这步没问题。**问题在 Coze**：Coze bot 的"技能/工作流"不自带"GET 任意 URL 并注入对话"能力，必须显式配一个 HTTP 请求节点（代码节点）把 SKILL.md 拉回来当上下文。

---

## 三、范式 B 实现链路（CLI 一行安装）

```
终端：curl .../install.sh | bash
   │
   ├─ 下载 SKILL.md → ~/.tideshell/skills/SKILL.md   ✅ 已实现
   ├─ 装 tideshell CLI 壳 → ~/.tideshell/bin/tideshell ✅ 已实现
   ├─ PATH 写入 ~/.zshrc / ~/.bashrc                 ✅ 已实现
   │
   ├─ 复制到本地 Agent skills 目录？
   │     ├─ ~/.claude/skills/nexl-builder/SKILL.md   ❌ 未做
   │     ├─ ~/.codex/skills/nexl-builder/SKILL.md    ❌ 未做
   │     └─ Coze 云端（无本地目录）                   ❌ CLI 无意义，应改"生成导入包"
   │
   └─ deploy / register 后端？
         └─ 标注 not wired yet                        ❌ 未接通
```

**技术真相**：当前 install.sh 完成了"分发 + 装壳"，但**没完成"注入"**。Claude Code / Codex 原生识别 `~/.claude/skills/<name>/SKILL.md`（Anthropic Skills 规范），install.sh 只要多一步 `cp` 即真激活。这一步缺失，是范式 B"半实现"的根因。

---

## 四、分平台实现矩阵

| 平台 | 范式 A（发 URL） | 范式 B（curl 一行） | 真激活所需动作 |
|------|------------------|---------------------|----------------|
| Claude（claude.ai / Codex） | ✅ WebFetch 直读 | ✅ 复制到 `~/.claude/skills/` | 范式 B 补 cp 步骤 |
| Cursor | ✅ WebFetch 直读 | ⚠️ 复制到 `~/.cursor/rules/` 或 skills | 范式 B 补 cp 步骤 |
| Codex CLI | ✅ 联网读 | ✅ 复制到 `~/.codex/skills/` | 范式 B 补 cp 步骤 |
| Coze 云端 bot | ⚠️ 需"读取 URL"代码节点 | ❌ CLI 无意义 | 配 HTTP 节点拉 SKILL.md / 或用户粘贴（USAGE A） |
| Coze 本地/API | ✅ 把 SKILL.md 作 system 上下文 | ❌ | 范式 A 方式 C（API 传 system） |

---

## 五、当前缺口清单

1. **范式 B 未注入本地 Agent**：install.sh 缺 `cp SKILL.md` 到 `~/.claude|codex|cursor skills/` 步骤。
2. **双源 fallback 未实现**：install.sh 仅 GitHub raw，CloudBase 镜像 `{DEFAULT_DOMAIN}` 未部署、无 fallback 分支。
3. **deploy / register 后端未接通**：CLI 子命令标注 `not wired yet`，闭环（拿域名→登记 nexlbase）断。
4. **Coze 范式 A 缺"读取 URL"能力**：需提供 Coze 代码节点 / 插件模板，或明确"粘贴降级"路径。
5. **设计稿声明与代码现实落差**：`ACTIVATION.md` "已真激活/无需降级"需按平台修正，避免误导用户。

---

## 六、实现蓝图（如何补全）

### 6.1 范式 B 真激活（install.sh 补全）
- 下载 SKILL.md 后，检测本地 Agent 目录并 `cp`：
  - `~/.claude/skills/nexl-builder/SKILL.md`
  - `~/.codex/skills/nexl-builder/SKILL.md`
  - `~/.cursor/rules/nexl-builder.md`（或对应 skills 路径）
- 双源 fallback：`curl GitHub raw` 失败 → 尝试 `CloudBase 镜像` → 都失败用本地缓存。
- Coze 分支：检测不到本地 Agent 时，输出"Coze 导入指引 / 生成 bot 配置 JSON"。

### 6.2 范式 A 对 Coze 的补全
- 提供 Coze **"读取 SKILL.md"代码节点模板**（HTTP GET raw URL → 返回文本 → 注入对话上下文）。
- 或提供 **Coze 一键导入包**：把 SKILL.md 预处理成 bot 人设/知识库，用户导入即活。
- 明确降级文案：Coze 用户若不愿配节点，走 USAGE 方式 A 手动粘贴。

### 6.3 后端接通（deploy / register）
- `deploy`：接 Cloudflare Pages（`npx` / API，需用户 token）或 Coze 托管通道。
- `register`：接 nexlbase 中台 API（待建），把域名登记进论坛+报告流。

### 6.4 文档修正
- `ACTIVATION.md` 按平台标注"真可用 / 需插件 / 需粘贴"，删除"对 Coze 无需降级"的过度声明。

---

## 七、优先级与下一步

| 优先级 | 动作 | 工作量 |
|--------|------|--------|
| P0 | install.sh 补 cp 到本地 skills 目录（范式 B 真激活） | 小 |
| P0 | ACTIVATION.md 按平台修正声明 | 小 |
| P1 | install.sh 双源 fallback（GitHub + CloudBase） | 中 |
| P1 | Coze"读取 URL"代码节点模板 | 中 |
| P2 | deploy / register 后端接通 | 大 |

> 下一步：是否要我直接动手实现 P0（install.sh 真激活 + 文档修正）？这能让范式 B 在 Claude/Codex 上真正"一行激活"，范式 A 在 Claude 系已可用，Coze 走粘贴降级。
