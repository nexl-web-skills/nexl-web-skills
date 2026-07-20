---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 1 棒
topic: 如何把 nexl-builder 技能发给你的 Coze Agent 激活"个人官网"构建能力
---

# nexl-builder 使用指南 · 如何激活

> 本文件为第 1 棒，上一棒：—（创世），下一棒预期：首批用户实测建站闭环。与 USAGE.html 同源双生。

## 一句话
把同目录 `SKILL.md` 全文复制，发给你的 Coze 智能体（或存为它的【技能】），它就能带你从 0 到 1 建出世界级个人官网。

## 三种激活方式

### 方式 A · 存为 Coze 技能（推荐，可复用）
1. 打开扣子平台（国内 docs.coze.cn / 国际 docs.coze.com）→ 创建智能体。
2. 进入【技能】或【人设与回复逻辑】编辑区。
3. 把 `SKILL.md` 全文粘贴进去，保存。
4. 发布时**勾选 API 渠道**（否则无法被 API 调用）。
5. 之后对智能体说"用 nexl-builder 帮我建个人官网"即触发。

### 方式 B · 直接发消息（一次性）
把 `SKILL.md` 全文作为第一条消息发给智能体，附一句："请按这份技能帮我建个人官网，先进入 Step 1 用户研究。"

### 方式 C · API 调用（开发者）
用 Coze Chat API v3 流式接口，把 `SKILL.md` 作为 system 上下文或首条 user_message 传入：
```javascript
import { CozeAPI } from '@coze/api';
const coze = new CozeAPI({ token: 'PAT', baseURL: 'https://api.coze.cn' });
const stream = coze.chat.stream({
  bot_id: 'your_bot_id', user_id: 'user_123',
  additional_messages: [{ role: 'user', content: '用 nexl-builder 帮我建个人官网', type: 'question' }],
});
for await (const event of stream) console.log(event);
```

## 用户侧体验流程（六步）
1. **用户研究** → 智能体问职业/价值/受众/调性/喜欢站点
2. **信息架构** → 定导航与首屏 5 秒价值
3. **视觉系统** → 定色彩/字体/风格
4. **页面交互** → 定滚动叙事与动效点
5. **内容优化** → 填文案、做 SEO/性能
6. **迭代测试** → 出 2-3 概念，你选，多版对比

## 闭环到 nexlbase
建站完成拿到域名 → 说"上传到 nexlbase" → `tideshell site register --domain <url>` → 进入中台发论坛帖 + 生成 HTML 报告。

## 注意
- 智能体必须**先发布为 API 版本**才能 API 调用。
- PAT Token 在扣子个人设置 → API Token 生成。
- 国内/国际 Base URL 不同（api.coze.cn / api.coze.com）。
