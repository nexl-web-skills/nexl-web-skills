---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 8 棒 · 接第 7 棒激活语实现研究
topic: 如何让两条极简激活语对 Coze（扣子）生效 · 能力边界 + 三条路径 + 落地 SOP
---

> 本文件承接第 7 棒《ACTIVATION-IMPLEMENTATION》（激活语实现机制研究）。第 7 棒结论：范式 A 对 Claude/Codex/Cursor 已真激活，对 Coze 默认不生效（bot 无 WebFetch）。本棒补齐 Coze 专用生效方案，并**修正 `ACTIVATION.md` 第 24 行的错误声明**。
> 能力边界事实于 2026-07-20 经 Coze 官方文档（space.coze.cn/open/docs/guides/code_node）与社区实践交叉核验。

# 如何让激活语对 Coze 生效

## 结论（先读这段）

1. **范式 B（`curl -fsSL … | bash`）对 Coze 永远无效** —— Coze 是云端 Bot，没有终端/shell，它执行不了安装脚本。范式 B 只对本地有 shell 的 Agent（Claude Code / Codex / Cursor）生效。
2. **范式 A（发 URL 让 Agent 读）对 Coze 默认也不生效** —— Coze Bot 不像 Claude 那样自带 WebFetch。必须给 Bot 配"读 URL 能力"，才有三种生效路径。
3. **对 Coze 生效的最优路径是 `LinkReaderPlugin` 工作流**（零代码、5 分钟、官方节点），用户发"请阅读 <SKILL.md URL> 激活"即触发。
4. **双保险**：同时把 `SKILL.md` + `USAGE.md` 作为 Coze 知识库文档上传，让 Bot 永久掌握技能，不依赖运行时抓取。
5. **国内兜底修正**：GitHub raw 主源在 GFW 下偶发不可达；但 CloudBase 默认域名有**浏览器中间页**，LinkReaderPlugin 服务端抓取会拿到中间页 HTML 而非 SKILL.md。→ Coze 的国内兜底应是「知识库预置」或「CloudBase 云函数返回纯文本」，而非静态托管中间页 URL。

---

## 一、Coze 能力边界（2026-07-20 verified）

| 能力 | 现状 | 对激活语的意义 |
|------|------|----------------|
| 终端 / shell | ❌ 无 | 范式 B 死路 |
| Bot 原生 WebFetch | ❌ 默认无 | 范式 A 需配能力 |
| `LinkReaderPlugin` 节点 | ✅ 官方共享插件 | 范式 A 零代码生效主路径 |
| 工作流代码节点（Python） | ✅ 仅 `requests_async`+`numpy` | 极客路径：`await requests_async.get(url)` |
| 知识库（文档/在线网页导入） | ✅ | 静态双保险，预置技能 |
| 插件发布到商店 | ✅ 需开发 | 远期：封装 nexl-builder 为官方插件 |

**代码节点 Python 铁律（官方文档原文要点）**：
- 基于 Python 3.11.3 标准库；仅内置 `requests_async`、`numpy` 两个三方库。
- **暂不支持 `http.client` 方式请求**；不支持其他三方依赖。
- 必须 `import requests_async as requests; response = await requests.get(url)`（**异步 + await**）。
- 单请求超时 60s；不支持写多个函数；`return` 必须是对象。
- ⚠️ 社区有旧文称"用 `requests` + 开 HTTP 插件"，与 2026 官方文档冲突——**以 `requests_async` + `await` 为准**。

---

## 二、两条激活语 × Coze 适用性

| 激活语 | 对 Coze 是否生效 | 原因 |
|--------|------------------|------|
| 范式 A：发 URL「请阅读 …/SKILL.md 并激活」 | 默认❌，配能力后✅ | Bot 无 WebFetch，需 LinkReaderPlugin/代码节点/知识库 |
| 范式 B：`curl … \| bash` | ❌ 永久无效 | Coze 无终端 |

**所以对外话术要分平台**：
- 对 **Claude / Codex / Cursor** 用户 → 两条都给（范式 A 或 B）。
- 对 **Coze** 用户 → 只给范式 A，并附「Coze 接入指南」（本文件第三节）。

---

## 三、三条生效路径对比

| 路径 | 实现成本 | 生效方式 | 稳定性 | 实时性 | 推荐度 |
|------|----------|----------|--------|--------|--------|
| **① LinkReaderPlugin 工作流** | 零代码，5 分钟拖拽 | 用户发 URL → 工作流抓取 → LLM 执行 | 高（官方节点抗反爬/JS） | 实时 | ⭐⭐⭐ 首选 |
| **② 知识库预置** | 零代码，上传 2 文件 | Bot 永久掌握技能，prompt 引导调用 | 最高（不依赖网络） | 配置即生效 | ⭐⭐⭐ 双保险 |
| **③ 代码节点 `requests_async`** | 写 ~15 行 Python | 用户发 URL → 异步抓取 → LLM 执行 | 中（受 GFW/超时影响） | 实时 | ⭐⭐ 极客可选 |

**策略**：① + ② 组合 —— 工作流负责"用户甩 URL 即时激活"，知识库负责"离线/GFW 兜底 + 常规建站意图直接命中"。

---

## 四、路径 ① 详解：LinkReaderPlugin 工作流（零代码，5 分钟）

**目标**：用户发「请阅读 `https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/skills/nexl-builder/SKILL.md` 并激活 nexl-builder 技能」→ Coze 自动走工作流，抓到 SKILL.md 纯文本并据此执行六步建站。

**数据流**：
```
用户消息(含 URL)
   │
   ▼
[开始节点] 变量: user_input (String)
   │  （用 LLM/正则从 user_input 提取 URL，或让用户单独填 url 槽位）
   ▼
[LinkReaderPlugin] 输入 resource_url = 提取的 URL
   │  输出: data.content (网页正文纯文本) / title
   ▼
[大模型节点] system: "你是 nexl-builder 技能执行器。以下是从 URL 抓取的技能定义：
{{data.content}}
请严格按其中的六步框架，与用户对话完成独立站构建。"
   user: {{user_input}}
   │  输出: 建站方案/追问
   ▼
[结束节点] → Bot 回复
```

**逐步配置（coze.cn 控制台）**：
1. 创建 Bot → 命名 `Nexl Builder` → 进入「工作流」→ 新建工作流。
2. **开始节点**：加一个输入变量 `user_input`（String），描述"用户的建站请求，含 SKILL.md 链接"。
3. **链接提取节点**（可选）：用「大模型」节点从 `user_input` 中正则/语义提取出 URL，输出 `skill_url`。
4. **LinkReaderPlugin 节点**：`resource_url` 绑定 `skill_url`（或 `user_input` 直接含纯 URL 时绑定它）。→ 输出 `data.content`。
5. **大模型节点**：
   - 模型选 Deepseek-V3 / 豆包 1.5 Pro（按预算）。
   - 系统提示词固定写入技能执行器角色，并把 `{{data.content}}` 作为技能定义注入。
   - 用户消息绑定 `user_input`。
6. **结束节点**：绑定大模型输出 → 作为 Bot 回复。
7. 保存 → 发布。

**触发条件配置**：在 Bot「人设与回复逻辑」里写——「当用户发送包含 `SKILL.md` 或 `nexl-web-skills` 的链接，或说『激活 nexl-builder』时，调用 Nexl Builder 工作流。」

---

## 五、路径 ② 详解：知识库双保险（零代码，最稳）

1. 在 Bot「知识库」→「新增»本地文档」上传 `SKILL.md` + `USAGE.md`（从仓库 `skills/nexl-builder/` 下载）。
2. 或在「在线网页」填入 `https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/skills/nexl-builder/SKILL.md`（Coze 会自动抓取同步）。
3. Bot 人设 prompt 加：「你掌握 nexl-builder 独立站构建技能（见知识库）。当用户要搭建品牌独立站/官网时，主动按六步框架推进。」

**价值**：即使 GitHub raw 被 GFW 阻断、工作流抓取失败，Bot 仍从知识库命中技能，用户说「帮我用 nexl-builder 搭一个 XX 站」即可启动——**彻底绕开网络依赖**。

---

## 六、路径 ③ 详解：代码节点异步抓取（极客）

仅当需要对抓取内容做自定义解析（如只抽 YAML frontmatter + 六步清单）时使用。Python 节点代码模板：

```python
import requests_async as requests

async def main(args: Args) -> Output:
    url = args.params['url']
    try:
        resp = await requests.get(url, timeout=30)
        text = resp.text
        # 可选：裁剪只保留技能正文
        return {'code': resp.status_code, 'skill_text': text[:8000]}
    except Exception as e:
        return {'code': 500, 'skill_text': f'抓取失败: {e}'}
```

**铁律**：必须 `await`；不能 `import requests`（同步会被沙箱禁）；超时 ≤60s；`return` 是对象。

---

## 七、修正 ACTIVATION.md 的错误声明

`ACTIVATION.md` 第 24 行原句：
> 实测：…Agent 的 WebFetch 与终端 `curl` 都能直接读 → **范式 A 真正可用，无需复制粘贴降级**。

**修正为**（分平台诚实声明）：
> 范式 A 对 **Claude / Codex / Cursor**（自带 WebFetch）真正可用；对 **Coze** 默认不生效（Bot 无 WebFetch），须按 `COZE-ACTIVATION.md` 配 LinkReaderPlugin 工作流或知识库后方可激活。范式 B 仅对本地有 shell 的 Agent 生效，对 Coze 永久无效。

---

## 八、落地 P0 / P1 / P2

| 优先级 | 动作 | 产出 |
|--------|------|------|
| **P0** | 修正 `ACTIVATION.md` 第 24 行分平台声明 | 诚实文档 |
| **P0** | 把本文件同步进仓库 + 写一份「Coze 接入图文指南」给终端用户 | `COZE-SETUP-GUIDE.md` |
| **P0** | 在 README 明确「Claude 系用两条激活语 / Coze 用范式 A + 本指南」 | 分平台话术 |
| **P1** | 提供一个配置好的 Coze 工作流「分享链接 / 导入 JSON」 | 一键接入 |
| **P1** | 用 CloudBase 云函数返回 SKILL.md 纯文本，作 Coze 国内无中间页兜底源 | 国内稳抓 |
| **P2** | 将 nexl-builder 封装为 Coze 官方插件（OpenAPI/HTTP 服务）上架商店 | 一键添加 |

---

## 九、验证清单

- [ ] Coze Bot 发「请阅读 <raw SKILL.md URL> 激活」→ 工作流触发、LinkReaderPlugin 抓到正文、LLM 进入六步框架。
- [ ] 断网/GFW 模拟下，知识库命中「帮我用 nexl-builder 搭站」→ Bot 仍能执行。
- [ ] 国际版 coze.com 用同类 Web Reader 插件复测（插件名可能不同）。
- [ ] README 与 ACTIVATION.md 声明已分平台修正，无"对 Coze 默认生效"误导。

---

> 下一棒预期：实现 P0（修正声明 + Coze 接入图文指南），或推进 P1（Coze 工作流分享 / 云函数纯文本兜底）。
