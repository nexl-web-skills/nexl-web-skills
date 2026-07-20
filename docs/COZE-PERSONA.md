---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 11 棒 / 激活语缩短与仓库调整设计师
topic: 激活语规范 + GitHub 仓库 URL 缩短方案 —— 用户发给自己 agent 的永远是那一句，链接在仓库层面尽可能缩短（移除第 10 棒的长人设 Prompt，人设由用户自定）
---

> 本文件为第 11 棒，修正第 10 棒方向。上一棒：第 10 棒（Coze 人设重设计，已纠正）。下一棒预期：若启用自定义短域名，落地 GitHub Pages 四步并验证 MIME。

# 激活语规范 + GitHub 仓库 URL 缩短方案

## 0. 修正声明（方向纠偏）

第 10 棒写的「给 Coze Bot 的长人设 Prompt 块」方向偏了。**nexl 不替用户写人设**——用户自己管自己 agent 的人格与语气。nexl 只负责两件事：① 给用户一个 skill（`nexl-builder`）；② 给用户一句**固定不变的激活语**，他发给自己任何 agent 即激活。

本文档删去长人设 Prompt，聚焦②的 URL 缩短与仓库调整。

## 1. 唯一激活语（永远这一句）

```
请阅读 https://cdn.jsdelivr.net/gh/nexl-web-skills/nexl-web-skills@main/builder.md 并激活 nexl-builder 技能。
```

- **固定不变**，全平台一致（Claude / Codex / Cursor / Coze 等）。
- 用户把这句话发给他自己的 agent，agent 读 URL 里的 SKILL.md 即获得 nexl-builder 能力。
- raw 备选（同内容）：`https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md`

## 2. URL 如何缩短（仓库层面已落地的调整）

原 URL：`.../main/skills/nexl-builder/SKILL.md`（99 字符）
缩短靠两件事：

### 2.1 仓库根镜像 `builder.md`（已 push 验证）
把 `skills/nexl-builder/SKILL.md` 复制到仓库根 `builder.md`，砍掉 `skills/nexl-builder/` 层级与文件名。
- 命令：`cp skills/nexl-builder/SKILL.md builder.md && git add builder.md && git commit -m "mirror" && git push`
- 验证：`https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md` → HTTP 200，8205 字节，frontmatter 正确。

### 2.2 jsDelivr CDN（比 raw 更短 + 海外加速）
`https://cdn.jsdelivr.net/gh/nexl-web-skills/nexl-web-skills@main/builder.md`
- 比 raw 短 6 字符，且走 CDN（海外用户读更快）。
- 验证：HTTP 200，8205 字节，内容一致。
- 注意：jsDelivr 国内可达性不稳定；**国内 Coze 用户请走知识库预置**（见 `COZE-ACTIVATION.md` 方案 A），URL 激活语主要服务海外 / 有直连能力的场景。

### 2.3 极简文件名变体（可选，再省 6 字符）
`builder.md` → `b.md`：`...@main/b.md`。牺牲可读性换极短，按需选用。

## 3. 长度对比

| 方案 | URL | 字符数 |
|------|-----|--------|
| 原（SKILL.md 深路径） | `.../main/skills/nexl-builder/SKILL.md` | 99 |
| 仓库根 raw | `.../main/builder.md` | 81 |
| **jsDelivr（当前采用）** | `cdn.jsdelivr.net/gh/...@main/builder.md` | **75** |
| jsDelivr + `b.md`（极简） | `cdn.jsdelivr.net/gh/...@main/b.md` | 69 |

## 4. 真·极短（进阶，需自定义域名）

jsDelivr / raw 仍带长域名前缀。唯一能砍掉前缀的办法 = **自定义短域名 + GitHub Pages**：

1. 买极短域名（如 `nexl.sh`，约 $10/年）。
2. 仓库 Settings → Pages → source = main 分支 / root。
3. 仓库根加 `CNAME` 文件（内容 `nexl.sh`）+ `.nojekyll`（让 .md 以纯文本提供，不被 Jekyll 渲染，保证 agent 读到 YAML）。
4. 激活语变：`请阅读 https://nexl.sh/builder 并激活 nexl-builder 技能。`（或 `https://nexl.sh/b`）。
- 注：GitHub Pages 对 .md 的 MIME 需实测（加 `.nojekyll` 后通常 `text/plain`）。若 MIME 不对，改文件名 `builder.txt` 保底。

## 5. 维护铁律（防漂移）

- **改 `skills/nexl-builder/SKILL.md` 必须同步根 `builder.md`**：`cp skills/nexl-builder/SKILL.md builder.md && git commit && git push`。否则用户激活语会读到旧版技能。
- 验证：push 后 `curl -sI <url>` 确认 HTTP 200 且字节数对齐。

## 6. 各平台激活语义（引用）

- **Claude / Codex / Cursor**：自带 WebFetch，直读 URL → 按 SKILL.md 六步走。✅
- **Coze（云端）**：默认无 WebFetch → 需 LinkReaderPlugin 工作流（方案 B）或知识库预置（方案 A，最稳）。详见 `COZE-ACTIVATION.md`。

## 7. 下一步

- 若启用自定义域名，落地第 4 节四步并验证 MIME。
- 防漂移：可用 GitHub Action 在 push `SKILL.md` 时自动同步 `builder.md`。
