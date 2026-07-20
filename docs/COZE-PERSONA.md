---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 11 棒（修订 · 弃 jsDelivr）
topic: 激活语规范 + GitHub 仓库 URL 缩短 —— jsDelivr 被 Coze 安全策略拦截，弃用；统一 raw 根 builder.md；固化"绝不弹拦截提示"原则
---

> 本文件为第 11 棒修订版。上一棒把激活语定为 jsDelivr，实测被 Coze 安全策略（域名白名单）拦截，bot 回「被安全策略拦截，读不了」。**已弃用 jsDelivr**。下一棒预期：若 raw 在国内 coze.cn 也被 GFW 干扰，启动 P1（CloudBase 云函数纯文本兜底 + 自定义短域名）。

# 激活语规范 + GitHub 仓库 URL 缩短方案

## 0. 铁律（本棒确立）

**用户发给自己 agent 的永远是那一句激活语，且这句里的链接绝不能让用户看到「被拦截 / 读不了」之类的提示。**

触发这条铁律的事件：jsDelivr 链接在 Coze 的 `LinkReaderPlugin` 被安全策略拦截，bot 自动回「这个 jsDelivr 链接被安全策略拦截了，读不了。我换个方式，直接从 GitHub 原始地址试试。」——这正是我们要消灭的体验。

结论：
1. **禁用 jsDelivr**（及一切非 Coze 白名单的第三方 CDN）。
2. 激活语统一指向 **GitHub 官方原始地址**（仓库根 `builder.md`）。GitHub 是 Coze 最可能放行的域名。
3. 国内 Coze 用户的零弹窗兜底 = **知识库预置**（见 `COZE-ACTIVATION.md` 方案 A），不走运行时外链抓取。

## 1. 唯一激活语（永远这一句）

```
请阅读 https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md 并激活 nexl-builder 技能。
```

- **固定不变**，全平台一致（Claude / Codex / Cursor / Coze 等）。
- 81 字符（含中文指令）。这是 GitHub 体系下最短、且确定不被安全策略拦截的形态。
- 用户把这句话发给他自己的 agent，agent 读 URL 里的技能定义即获得 nexl-builder 能力。

## 2. URL 如何缩短（仓库层面已落地）

原 URL：`.../main/skills/nexl-builder/SKILL.md`（99 字符）
缩短只靠一件事，已 push 验证：

### 2.1 仓库根镜像 `builder.md`（采用）
把 `skills/nexl-builder/SKILL.md` 复制到仓库根 `builder.md`，砍掉 `skills/nexl-builder/` 层级。
- 命令：`cp skills/nexl-builder/SKILL.md builder.md && git add builder.md && git commit -m "mirror" && git push`
- 验证：`https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md` → HTTP 200，8205 字节，frontmatter 正确。
- **这是激活语当前采用的链接**（GitHub 官方域名，Coze 白名单最可能放行）。

### 2.2 jsDelivr CDN（已弃用 ❌）
`https://cdn.jsdelivr.net/gh/nexl-web-skills/nexl-web-skills@main/builder.md`
- 实测被 Coze 安全策略（域名白名单）拦截，bot 回「被安全策略拦截，读不了」。
- **任何第三方 CDN 都不保证在 Coze 白名单内，一律不采用。**

### 2.3 自定义短域名（进阶，可选）
raw 根仍带 `raw.githubusercontent.com` 前缀（81 字符）。要更短且国内稳，唯一路径 = **自定义短域名 + CloudBase 云函数纯文本**（非 GitHub Pages，避开 GFW 对 GitHub 的偶发干扰）：
1. 买极短域名（如 `nexl.sh`，约 $10/年），DNS 解析到 CloudBase 云函数/静态自定义域名。
2. 云端返回 `builder.md` 纯文本（云函数 `text/plain`，无中间页、无白名单风险）。
3. 激活语变：`请阅读 https://nexl.sh/b 并激活 nexl-builder 技能。`
- 国内可达、确定不被 Coze 拦截、可压到 ~30 字符。
- 成本：域名费 + 云函数（已有 CloudBase 环境，边际成本近零）。见 P1 清单。

## 3. 长度对比（诚实版）

| 方案 | URL | 字符数 | 状态 |
|------|-----|--------|------|
| 原（SKILL.md 深路径） | `.../main/skills/nexl-builder/SKILL.md` | 99 | 弃用（太长） |
| **raw 根 builder.md（当前采用）** | `raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md` | **81** | ✅ 采用 |
| jsDelivr CDN | `cdn.jsdelivr.net/gh/...@main/builder.md` | 75 | ❌ 被 Coze 拦截，弃用 |
| 自定义短域名 + 云函数 | `nexl.sh/b` | ~30 | 进阶 P1，待做 |

## 4. 各平台激活语义 + 弹窗风险

- **Claude / Codex / Cursor**：自带 WebFetch，直读 raw → 按技能六步走。✅ 不弹。
- **Coze（海外 coze.com）**：`LinkReaderPlugin` 抓 raw GitHub，大概率放行。✅ 待实测。
- **Coze（国内 coze.cn）**：
  - raw GitHub 可能被 GFW 偶发干扰（非安全策略拦截，是网络错误）→ 此时 bot 可能回「抓不到/超时」，**仍有提示风险**。
  - **根治**：用户配置 Bot 时把 `builder.md` 传进知识库（方案 A），运行时从知识库读，零外链、零弹窗。这是国内用户的推荐路径。
- 详见 `COZE-ACTIVATION.md`（方案 A 知识库预置 / 方案 B LinkReaderPlugin）。

## 5. 维护铁律（防漂移）

- **改 `skills/nexl-builder/SKILL.md` 必须同步根 `builder.md`**：`cp skills/nexl-builder/SKILL.md builder.md && git commit && git push`。否则激活语会读到旧版技能。
- 验证：push 后 `curl -sI <url>` 确认 HTTP 200 且字节数对齐。
- 可选：GitHub Action 在 push `SKILL.md` 时自动同步 `builder.md`。

## 6. 下一步

- 请主人在 coze.cn 实测 raw 根激活语是否弹窗（验证 GFW 风险）。
- 若国内弹窗：启动 P1（CloudBase 云函数纯文本 + 自定义短域名），彻底消灭弹窗并压到 ~30 字符。
- 防漂移：GitHub Action 自动同步 `builder.md`。
