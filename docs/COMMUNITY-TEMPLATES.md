---
title: 集体独立站数字资产 · 模板共建与案例调用体系
date: 2026-07-21
author: NEXL
handoff: 21
subject: 三平台案例调用索引 + GitHub 开发者共建模板库的规则设计与执行
---

# 集体独立站数字资产 · 模板共建与案例调用体系
# Community Template Library & Case-Recall System

> 一份能被所有开发者贡献、被所有平台 agent 调用的独立站数字资产。
> A shared digital asset of independent sites — contributed by every developer, callable by every platform agent.

---

## 〇、为什么是现在 / Why now

用户被激活后，最自然的一句话是：「给我看看你们做得最好的站长什么样。」

今天 nexl 只有 `showcase/`——那是**成品案例**（别人建完的站，活广告）。但没有 **`templates/`**——那是**可复用的起点资产**（代码/配置，拿来即建）。

两者缺一不可：
- `showcase/` 解决「信不信」（social proof）
- `templates/` 解决「快不快」（asset reuse）

本文件定义两件事：
1. **案例调用索引**：被激活的 agent 如何在三平台内调出「最优秀 / 性价比最高 / 代码最稳定」的模板，作为用户建站的参照锚点。
2. **GitHub 共建规则**：一个欢迎所有开发者贡献模板的文件夹，及其评级、审核、执行体系——以 GitHub 创始人 Tom Preston-Werner 的「Social Coding」心法为骨。

---

## 一、GitHub 创始人的眼睛 / Through the founder's eyes

Tom Preston-Werner 把 GitHub 做成「社交编程（Social Coding）」而非「代码托管」。三条不写进文档、但刻进骨子里的原则，正是本体系的设计地基：

### 1. Pull Request 是协作的最小单元 / The PR is the unit of collaboration
不要求贡献者先成为朋友，只要求他提一个合规的 PR。低摩擦 > 高门槛。
→ 本体系：复制 `templates/_template/` 即可起步，CI 自动校验，合入即上 INDEX。

### 2. 文档是项目的另一半 / Documentation is half the project
README 与 CONTRIBUTING 不是附属品，是门面。新人三分钟能不能上手，决定生死。
→ 本体系：每个模板自带 `README.md`（中英）+ `template.json`（机器可读），人和 agent 都能读。

### 3. 每个贡献者都是潜在维护者 / Every contributor is a potential maintainer
署名即归属，star 归贡献者。资产不属于核心团队，属于集体。
→ 本体系：模板 `author` 字段即 GitHub handle；INDEX 展示贡献者；核心团队只守「单一真相源」（builder.md / broker），不独占资产。

> 资产化思维：模板不是代码，是**集体独立站数字资产**。一个人写的极简作品集，下一千人拿去长出自己的品牌。

---

## 二、目录结构 / Repository layout

```
nexl-web-skills/
├── showcase/            # 成品案例（活广告，已存在）
├── templates/           # ★ 新增：可复用模板库（集体资产）
│   ├── INDEX.json       # 机器可读总索引（agent 激活后加载）
│   ├── _template/       # 贡献者复制此骨架
│   │   ├── template.json   # 元数据 schema（必填）
│   │   ├── README.md       # 人类说明（中英）
│   │   └── site/           # 可运行站点（index.html 起）
│   └── catalog/         # 按用途分类（人类浏览）
│       ├── personal-ip/    # 个人 IP 官网
│       ├── brand-site/     # 品牌官网
│       ├── portfolio/      # 作品集
│       ├── landing/        # 活动 / 产品落地页
│       └── shop/           # 轻电商
├── skills/              # 核心资产（单一真相源，守门）
├── docs/                # 白皮书 / 战略
└── CONTRIBUTING.md      # 三套贡献路径（扩写）
```

**分类用 metadata，不靠软链**：git 不友好软链接。物理目录按 `category`（用途）分，平台适配写在 `template.json` 的 `platforms` 字段，INDEX 据此做多维检索。

---

## 三、模板元数据 schema / The template.json contract

每个模板必须有一份 `template.json`。这是 agent 调用时的唯一真相源：

```json
{
  "id": "aurora-minimal",
  "name": "Aurora · 极简作品集",
  "author": "github-handle",
  "category": "portfolio",
  "platforms": ["coze", "meoo", "workbuddy", "miaoda"],
  "tags": ["minimal", "dark", "typography"],
  "ratings": {
    "quality": 5,
    "cost_efficiency": 4,
    "stability": 5
  },
  "cost_estimate": {
    "coze_credits": 300,
    "meoo_credits": 80,
    "workbuddy_credits": 50,
    "miaoda_seconds": 420
  },
  "design_language": "暗黑极简 · 强排版 · 无渐变",
  "first_screen_pitch": "5 秒内说清你是谁",
  "files": ["site/index.html", "site/style.css"],
  "preview": "https://...",
  "license": "MIT",
  "createdAt": "2026-07-21",
  "updatedAt": "2026-07-21",
  "commit": "abc123"
}
```

**为什么是这份 schema**：`ratings` 三维对应主人要的「最优秀 / 性价比最高 / 代码最稳定」；`cost_estimate` 让 agent 在对应平台直接报预算；`platforms` 让三平台 agent 只调自己能跑的。

---

## 四、三维评级标准 / The three-axis rating

评级不是主观打分，是可复核的客观维度。1–5 分，由维护者 + 社区 PR 评审共同给出。

| 维度 | 含义 | 评审看什么 | 高分信号 |
|------|------|-----------|---------|
| **quality** 优秀 | 视觉 / 工艺 | 第一屏 5 秒能否说清「你是谁」+ 独特价值；设计语言统一性；Awwwards 级动效排版 | 视觉锤清晰、零廉价感、信息层级克制 |
| **cost_efficiency** 性价比 | 对应平台成本 | `cost_estimate` 数值 vs 同类；低消耗达高质感 | 用更少积分 / 秒点产出更高质感 |
| **stability** 稳定 | 代码质量 | 零或最小外部依赖；响应式断点；跨平台渲染一致；无 console 报错；Lighthouse 性能 | 即拷即用、无破绽、移动端无错位 |

> agent 调用规则：用户问「最优秀」→ 按 `quality` 降序；「性价比最高」→ `cost_efficiency` 降序且 `cost_estimate` 最低；「代码最稳定」→ `stability` 降序。三问三答，无需人工挑。

---

## 五、案例调用索引机制 / Case-recall for agents

被激活的 agent 在三平台中如何「调出最优模板」——这是让 NEXL 用户远超普通入口人群的关键杠杆之一。

### 5.1 SOP 新增步骤「①.5 案例锚定」
在 builder.md 平台识别（①）之后、预算顾问（③）之前，插入：

> **①.5 案例锚定（Case Recall）**：加载 `templates/INDEX.json`，按 `当前平台` + `用户行业/风格` 过滤，取该平台 `quality` 前三的模板作为参照锚点，向用户展示（名称 / 预览 / 一句话设计语言 / 对应平台成本）。用户可指定「以某模板为基底」，后续建站从底稿 + 该模板双源生长。

### 5.2 三平台白皮书各加「案例调用」小节
- **Coze**：知识库预置 `INDEX.json` 文本；Bot 在对话第二步 `read` 并推荐。
- **Meoo**：对话首句粘激活语后，agent 本地读 INDEX（或经 MCP 拉取），Night Plan 下零成本检索。
- **WorkBuddy**：技能激活即加载 INDEX 到上下文；免费额度内无限检索。

### 5.3 机器可读索引 `templates/INDEX.json`
汇总所有模板的 `id / name / category / platforms / ratings / cost_estimate / preview`，agent 一次加载、多维过滤。INDEX 由 CI 在模板 PR 合入时自动重建（见第七节）。

---

## 六、共建规则 / Contribution rules

贡献路径从原两套扩为**三套**（CONTRIBUTING.md 扩写）：

1. **showcase**（成品案例，已存在）— star 归你
2. **templates**（★ 新增模板资产）— 署名归你，上 INDEX
3. **核心 skill 改进**（issue 讨论，维护者实现）— 守单一真相源

### 模板贡献流程
1. 复制 `templates/_template/` → `templates/catalog/<category>/<your-id>/`
2. 填 `template.json`（必含 id / name / author / category / platforms / ratings / license）
3. 放可运行 `site/`（index.html 起，零或最小依赖）
4. 写 `README.md`（中英：设计语言、适用场景、对应平台成本）
5. 提 PR → `community-check.yml` 自动校验 template.json 字段完整性
6. 维护者 + 社区评审三维评级 → 合入 → CI 重建 INDEX.json → README 案例区展示

### 伦理红线（沿用并扩写）
- 不蒸馏真人冒充其观点（我们是 brand-profile，不是名人蒸馏）。
- 模板不得含侵权素材（字体 / 图片 / 代码须可商用或自产）。
- `brand-profile` 含用户商业机密，绝不进公开仓。

---

## 七、执行 / Execution — 本次落地清单

本文件不只是设计，已落地以下骨架（可立即双仓推送）：

| 动作 | 文件 | 状态 |
|------|------|------|
| 建模板库骨架 | `templates/_template/` (template.json + README.md) | ✅ |
| 种子模板 | `templates/catalog/portfolio/aurora-minimal/` (真实可运行暗黑极简作品集) | ✅ |
| 机器可读索引 | `templates/INDEX.json` (含 schema + 种子条目) | ✅ |
| 扩贡献指南 | `CONTRIBUTING.md` 增加「三、贡献模板」 | ✅ |
| 扩 CI 校验 | `.github/workflows/community-check.yml` 增加 templates 校验 | ✅ |
| 扩欢迎语 | `.github/workflows/welcome.yml` 提 templates | ✅ |
| SOP 加锚定步 | `builder.md` ①.5 案例锚定 | ✅ |
| 路由加索引说明 | `docs/PLATFORM-ROUTING.md` 案例调用章节 | ✅ |


---

## 八、世界级资产的标准 / What "world-class" means here

集体资产要配得上「世界级」。一条模板进 INDEX 即承诺：

1. **灵魂可携带**：配 `brand-profile` 底稿，换品牌不换骨架。
2. **视觉锤 < 5 秒**：第一屏说清你是谁。
3. **一门设计语言**：色彩 / 排版 / 动效 / 语气统一。
4. **零调性漂移**：8 维守门，合入即达标。
5. **主权独立**：零平台锁定，可导出自托管。
6. **即拷即用**：stability=5，无破绽。
7. **复利**：被千人复用，边际成本趋零。
8. **工艺**：Awwwards 级精度。

> 当 `templates/` 有一百个这样的模板，nexl 就不只是一个建站 skill——它是**全球开发者的独立站数字资产交易所**。

---

## 九、下一步 / Next

1. 双仓推送本体系（公开 + 私有）。
2. 三平台白皮书补「案例调用」小节。
3. 征集 5 个种子模板（五类目各一），发起社区「Template Marathon」。
4. 内部复盘文档（NEXL-DUAL-SKILL-DESIGN / VIRAL-PLAYBOOK）的 nuwa 对比句按主人指令清零。
