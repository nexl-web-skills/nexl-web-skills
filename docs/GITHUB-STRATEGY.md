---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 4 棒（GitHub 方案构想 + 双源激活语设计）
topic: 把所有建站 Skill 构建在 GitHub 上 + 最快冲 10k Star 的增长构想（基于 Onlook / AFFiNE 实证 Playbook）
---

> 上一棒：第 3 棒落地 CloudBase 默认域名·免备案内测方案（中间页挡 Agent 痛点未解）。本棒论证 **GitHub 作为 Skill 真相源 + 分发中枢**如何一剑解痛点、并把星标变成增长飞轮。下一棒预期：主人授权 GitHub owner → 建 repo 骨架 + 首版 Apple 极简 README + examples 成品站 → 启动 48h 集中打击。

# GitHub 方案构想 · 让建站 Skill 长在 GitHub 上，冲 10k Star

## 〇、一句话结论

**把 GitHub 当作建站 Skill 的「真相源 + 分发中枢」，CloudBase 降为「国内镜像 + 中台运行底座」。**
GitHub 解决内测期最痛的"中间页挡 Agent"问题（raw 直链无中间页、全球 CDN），且**星标本身就是活广告与信任背书**——把范式 A 从"复制粘贴降级"升级回"一行 URL 真激活"，并让每次 star 成为 nexlbase 生态的自传播节点。

---

## 一、GitHub 对比 CloudBase 默认域名（技术事实）

| 维度 | GitHub `raw.githubusercontent.com` | CloudBase `*.app.tcloudbase.com` |
|------|-----------------------------------|----------------------------------|
| 中间页 | ❌ **无**（直链返回真文件） | ⚠️ 有"确认访问"中间页（挡 Agent/CLI） |
| Agent WebFetch | ✅ 直接读 | ❌ 拿到中间页 HTML |
| 终端 `curl` | ✅ 直接拉 | ❌ 需人工点确认 |
| 全球可达 | ✅ GitHub 全球 CDN | ⚠️ 仅上海节点，海外延迟高 |
| 国内 GFW | ⚠️ githubusercontent 偶发被墙 | ✅ 国内直连稳 |
| 信任背书 | ✅ Star 数 = 社交证明 | ❌ 无 |
| 增长飞轮 | ✅ 每次 star 自传播 | ❌ 无 |

**结论**：GitHub 在"范式 A 可用性"和"增长"上双杀 CloudBase 默认域名；唯一短板是国内偶发 GFW。
**解法 = 双源**：GitHub raw 为全球主源，CloudBase 默认域名为国内镜像（带中间页兜底），Agent 读取失败自动回落镜像。

---

## 二、仓库结构设计（所有建站 Skill 构建在 GitHub）

```
github.com/<OWNER>/nexl-base-skills        ← OWNER 待主人指定
├── README.md                              ← Apple 极简落地页 + 一键复制激活语 + ⭐ 高亮
├── skills/
│   ├── nexl-builder/SKILL.md              ← 个人官网构建（六步 ask 模式，自包含）
│   ├── html-report/SKILL.md               ← HTML 报告生成
│   └── forum-mod/SKILL.md                 ← 论坛发帖管理
├── cli/
│   └── install.sh                         ← TideShell CLI 安装器（双源 fallback）
├── examples/                              ← 10 个 Awwwards 级成品站 HTML（点开即看，降 star 门槛）
│   ├── minimal-portfolio.html
│   ├── brutalist-resume.html
│   └── ...（共 10）
├── docs/                                  ← 架构 / 白皮书 / 部署（复用本地 tideshellbase/docs）
├── CONTRIBUTING.md                        ← 第三方提交 Skill 的规范（awesome 式扩展）
└── LICENSE                                ← Apache-2.0（对齐 onlook，友好商用）
```

**激活语升级为双源（写进 ACTIVATION.md）**：
- 范式 A（发给 Agent，GitHub raw 主源）：
  ```
  请阅读 https://raw.githubusercontent.com/<OWNER>/nexl-base-skills/main/skills/nexl-builder/SKILL.md
  文档，按步骤激活 nexl-builder 独立站构建技能，开启我的独立站构建之旅。
  ```
- 国内镜像（Agent 读 GitHub 失败时回落）：`https://{DEFAULT_DOMAIN}/tideshell/skills/nexl-builder/SKILL.md`

---

## 三、最快冲 10k Star · 增长构想（基于实证 Playbook）

> 证据锚点（已查证）：Onlook 凭"开源 AI 设计编辑器"登 HN #1 + GitHub Trending 第一（超 DeepSeek），26.2k⭐；AFFiNE 用同一套 Playbook 43 天冲 10k⭐、18 个月 33k⭐。核心公式：**48 小时集中所有渠道 → 触发 GitHub Trending 飞轮 → 算法自营销**。

### 3.1 定位一句话（价值主张）
> **"The open-source skill spec that lets any AI agent build world-class personal sites."**
> （让任何 AI Agent 都能构建世界级个人官网的开源技能规范）
> 差异化锚点：Anthropic 规范 Skill + 渐进式披露 + 六步 ask 模式 + 双源可复制激活。

### 3.2 48 小时集中打击窗口（飞轮触发点）
| 时刻 | 动作 | 预期 |
|------|------|------|
| T 日 08:00 PT | **Show HN**（标题：`Show HN: An open skill spec that lets any AI agent build Awwwards-level personal sites`）| 单日 1000+ stars（不可控，靠标题+时机+评论）|
| T 日 08:30 | **Reddit**：r/coolgithubprojects + r/SideProject + r/webdev（"journey" 式，不裸链）| +500~1500 |
| T 日 12:00 | 前 24h 冲 **100+ stars/天** → 触发 GitHub Trending（All Languages 阈值 80-150/天）| 算法自带量 |
| T+1 | **Product Hunt**（找 Hunter 提交，#1 badge = 信任章）→ Twitter/X KOL 联动 | +200~800（PH 主给 legitimacy）|
| T+2 | **awesome-* PR**：awesome-personal-websites / awesome-claude-skills / awesome-coze | 慢滴但永久流量 |

### 3.3 内容飞轮（让 star 自传播）
- 每个 Skill 配"**可复制 Prompt**"——用户一用即惊艳 → 自发分享 → 回流 star。
- `examples/` 10 个成品站：点开即看 Awwwards 级效果，**10-15 秒决策是否 star**。
- README 内嵌 star-history.com 动图（动量信号）。

### 3.4 双语文案纪律（防翻车）
- **先全球基线，后中文庆祝**：AFFiNE 教训——第一周克制中文传播，先立"全球有机增长"形状，再让中文圈庆祝叠加（可信增长 vs 刷量观感）。
- **绝不直要 star**：用价值吸引（"复制这句给 Agent 就能建站"），星标是副产品。

### 3.5 禁忌（实证踩坑）
- ❌ 买星（GitHub 检测惩罚）❌ spam 社区 ❌ 忽略 issue（<24h 响应）❌ 无 README/无 demo。

---

## 四、里程碑节奏（对标 AFFiNE 43 天 10k）

| 阶段 | 时间 | 动作 | 目标 stars |
|------|------|------|-----------|
| 准备期 | 第 1-2 周 | README(Apple极简)+demo video+examples 10 站+CONTRIBUTING | 0（准备）|
| 种子期 | 第 3 周 | Reddit seeding + Show HN | 1k-3k |
| 飞轮期 | 第 4 周 | Product Hunt + Trending 飞轮 + KOL | 3k-6k |
| 生态期 | 第 5-8 周 | awesome lists + 持续 weekly release + 社区运营 | 6k-10k |

---

## 五、风险与诚实提醒

1. **国内 GFW**：githubusercontent 偶发被墙 → 必须双源（CloudBase 镜像兜底），否则国内用户 Agent 激活不稳。
2. **10k 星需真价值**：我们的差异化（Anthropic 规范 + 渐进式披露 + 六步 ask）是真壁垒，但需 `examples/` 成品站证明"世界级审美"不是口号。
3. **待主人决策**：① GitHub `<OWNER>` 名（建议 `nexl-base-skills` 或 `tideshell-base`）② 是否授权我建 repo 骨架并写首版 README。

---

## 六、本棒同步改动

- `ACTIVATION.md` + `.html`：激活语升级为**双源**（GitHub raw 主源 + CloudBase 镜像兜底）。
- `index.yaml`：新增 `github-source` 条目。
- `install.sh`：CLI 拉取改为双源 fallback（先 GitHub raw，失败回落 CloudBase）。
