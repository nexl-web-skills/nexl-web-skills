---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 9 棒 · 接第 8 棒 Coze 生效方案
topic: 扣子/Coze 内测指令卡 · Nexl Builder 激活验证（知识库预置 + LinkReaderPlugin 工作流）
---

> 本卡承接第 8 棒《COZE-ACTIVATION》。目的：给主人一个扣子账号，照卡内指令即可在 10 分钟内验证「两条激活语能否对 Coze 生效」。建议先测方案 A（最稳），再测方案 B（验证范式 A 即时激活）。

# 扣子内测指令卡 · Nexl Builder 激活验证

## 前提
- 一个扣子账号：国内版 **https://www.coze.cn**（或国际版 **https://www.coze.com**）
- 先确认技能文件在线：`github.com/nexl-web-skills/nexl-web-skills` → `skills/nexl-builder/SKILL.md`
- 下载备用：`https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/skills/nexl-builder/SKILL.md` 与同目录 `USAGE.md`

---

## 方案 A：知识库预置（最稳，先测这个）

**步骤**
1. 扣子首页 → **创建 Bot** → 名称填 `Nexl Builder` → 图标随意 → 创建。
2. 左侧进入 **知识库** → **新增»本地文档** → 上传刚下载的 `SKILL.md` + `USAGE.md`。（或选「在线网页」填入上面的 raw URL，让扣子自动同步。）
3. 回到 Bot **编排** → **人设与回复逻辑** 里，在人设最前面加一段：
   ```
   你掌握 nexl-builder 独立站构建技能（见知识库）。当用户要搭建品牌独立站 / 官网 / 落地页时，主动按知识库中的「六步框架」推进：先问品牌定位与受众，再定视觉语言，再出结构与文案，再接 Coze API 能力，再交付，最后复盘。
   ```
4. 点击 **发布**。

**测试语（发给 Bot）**
```
帮我用 nexl-builder 搭一个面向海外高端瓷器品牌的独立站，预算中等，要极简优雅。
```

**通过标准**：Bot 不要求你贴文档，直接按六步框架开始追问品牌定位、视觉偏好 → ✅ 知识库生效。

---

## 方案 B：LinkReaderPlugin 工作流（验证范式 A 即时激活）

**步骤**
1. 新建 / 打开 Bot `Nexl Builder` → 进入 **工作流** → **新建工作流**，命名 `nexl-activate`。
2. **开始节点**：加一个输入变量 `user_input`（String），描述「用户的建站请求，可能包含 SKILL.md 链接」。
3. **链接提取（可选）**：拖一个「大模型」节点，从 `user_input` 中用正则/语义提取出 URL，输出变量 `skill_url`。
4. 拖入 **LinkReaderPlugin** 节点（插件广场搜「链接读取 / LinkReader」），`resource_url` 绑定 `skill_url`（若第 3 步省略，直接绑定 `user_input` 里纯 URL）。
5. 拖入 **大模型节点**：
   - 系统提示词写：
     ```
     你是 nexl-builder 技能执行器。以下是从用户提供的 URL 抓取到的技能定义正文：
     {{data.content}}
     请严格按其中的六步框架，与用户对话完成独立站构建。不要偏离该技能定义。
     ```
   - 用户消息绑定 `user_input`。
6. **结束节点** 绑定大模型输出 → 保存 → **发布**。
7. 回到 Bot 编排，在人设里写：「当用户发送包含 `SKILL.md` 或 `nexl-web-skills` 的链接，或说『激活 nexl-builder』时，调用 nexl-activate 工作流。」→ 发布。

**测试语（即我们的范式 A 激活语，直接复制发）**
```
请阅读 https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/skills/nexl-builder/SKILL.md 并激活 nexl-builder 技能。
```

**通过标准**：Bot 走工作流 → LinkReaderPlugin 抓到 SKILL.md 纯文本 → 大模型进入六步框架对话 → ✅ 范式 A 对 Coze 即时生效。

---

## GFW / 国内兜底说明（重要）
- 若方案 B 抓取失败（多半是 `raw.githubusercontent.com` 被 GFW 阻断，LinkReaderPlugin 返回空或报错）：**先走方案 A 知识库验证**，技能本身没问题。
- 真正的国内兜底不是 CloudBase 默认域名（有浏览器中间页，服务端抓取会拿中间页 HTML 而非 SKILL.md），而是：
  - **知识库预置**（本卡方案 A，最稳）；
  - 或后续用 **CloudBase 云函数返回 SKILL.md 纯文本**（P1，待建）。
- 内测时请记录：方案 B 在你的网络下能否抓到 raw？把结果反馈，决定是否加速 P1 云函数兜底。

---

## 国际版（coze.com）差异
- 插件名可能为 **Web Reader / Web Browsing** 而非 LinkReaderPlugin，机制一致：输入 URL → 抓正文 → 喂大模型。
- 知识库上传路径相同。
- 测试语不变（URL 是全球一致的 GitHub raw）。

---

## 内测反馈模板（发给观涛虾）
```
方案A 知识库：通过 / 失败（现象：___）
方案B LinkReader：通过 / 失败（现象：___，是否 GFW）
网络：国内 / 海外
账号：coze.cn / coze.com
```
