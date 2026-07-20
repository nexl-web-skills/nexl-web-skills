# nexl-web-skill 范式对齐与双核机制设计

> 日期：2026-07-20 · 接力者：观涛虾🦐 (TideShell) · 主题：对标 nuwa-skill，对齐 Agent Skills 范式 + 设计「建站 + 品牌经纪人」双核机制
> 参考：https://github.com/alchaincyf/nuwa-skill （仅作范式研究，内容不借鉴其文字）

---

## 一、nuwa-skill 范式解码

### 1.1 为什么人家的链接那么短？

| 维度 | nuwa-skill | 我们（当前） |
|------|-----------|------------|
| 激活语 | `https://github.com/alchaincyf/nuwa-skill`（仓库根，39字符）或 `npx skills add alchaincyf/nuwa-skill` | `https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md`（81字符） |
| 范式 | **安装型**：用户把整个仓库 clone 到 runtime 的 `skills/` 目录，之后 agent 自动加载根 `SKILL.md` | **即载型**：Coze/Meoo 等平台无本地 skills 目录，只能每次发一句话即时拉取 raw 文件 |
| 链接形态 | 仓库根 URL（owner/repo） | raw 深层路径（组织名长 + 仓库名长 + /main/builder.md） |

**结论**：短的本质不是"他们更会起名"，而是**范式差异**——nuwa 走的是标准 Agent Skills 协议 + `npx skills add` 安装器，激活语是"安装指令"而非"即载文件"。我们因为是即载型（为兼容 Coze/Meoo），必须给深层 raw 路径，自然更长。

### 1.2 架构（纯 GitHub 仓库，零服务端）

```
nuwa-skill/
├── SKILL.md                 # 核心资产，自包含，不接受外部 PR
├── references/              # 渐进披露：extraction-framework / skill-template / fidelity-scorecard
├── examples/                # 已生成产物（13人物+1主题），各自自包含调研数据
├── COMMUNITY.md             # 社区索引
├── CONTRIBUTING.md          # 贡献规则 + 伦理红线
├── LICENSE                  # MIT
└── README*.md               # 多语言（中/英/日/韩/西）
```

要点：
- **文档即技能**：SKILL.md = markdown + YAML frontmatter，零依赖，agent 读即得。
- **核心资产集中**：SKILL.md 是单一真相源，references 渐进披露细节，examples 是产出物。
- **安装器分发**：靠 `vercel-labs/skills` 的 `npx skills add` 跨 55+ runtime 自动放置，无需自建 CDN。

### 1.3 部署方式

完全依赖 GitHub + 标准协议，没有后端、没有数据库。用户安装即克隆，agent 运行时本地加载。这与我们的"双仓（公开门面 + 私有完整）"思路一致，只是我们多了私有仓承载接力档案。

---

## 二、我们对齐范式的改造（不破坏现有铁律）

### 2.1 双激活语策略（关键，解决"短链接"诉求）

| 类型 | 适用平台 | 激活语 |
|------|---------|--------|
| **安装型（短）** | 支持 Agent Skills 协议的本地 runtime：WorkBuddy / Claude Code / Codex / Cursor / OpenClaw | `npx skills add nexl-web-skills/nexl-web-skills` 或 `帮我安装这个 skill：https://github.com/nexl-web-skills/nexl-web-skills` |
| **即载型（固定句，铁律不变）** | Coze / 秒悟 Meoo / 任何无 skills 目录的平台 | `请阅读 https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/builder.md 并激活 nexl-builder 技能。` |

这样：**支持标准的平台用短链接，即载平台用固定兜底句**，两全其美，且不违背"激活语固定"铁律（即载句一字不改；短句是新增的安装型入口）。

### 2.2 根入口标准化

- 公开仓根目前是 `builder.md`（SKILL.md 的镜像）。Agent Skills 标准期望根 `SKILL.md`。
- 建议：把根入口统一为 `SKILL.md`（即载句同步改为 `.../main/SKILL.md`，长度不变），`builder.md` 退为 README 友好别名或删除。**此改动影响固定激活语，需主人确认后再做**（见第五节）。

### 2.3 模块化（已部分具备，补全即可）

```
nexl-web-skills/
├── SKILL.md                 # 调度器：元层（四平台识别 + 双核路由）
├── skills/
│   ├── nexl-builder/        # 子skill A：独立站建造者（已有）
│   └── nexl-broker/         # 子skill B：品牌经纪人（新增，见第三节）
├── references/              # 四平台预算档案 + 品牌提炼框架 + 守门清单
├── docs/                    # 白皮书（接力档案）
└── README*.md
```

---

## 三、双核机制：nexl-builder + nexl-broker

### 3.1 概念区分（原创，非蒸馏名人）

| nuwa-skill | 我们的 nexl-web-skill |
|-----------|----------------------|
| 蒸馏名人思维框架（认知操作系统） | 沉淀**品牌资产**（brand-profile，品牌认知操作系统） |
| 人物 Skill 被调用做"视角分析" | 品牌经纪人做"品牌一致性校验 + 增长叙事顾问" |
| 对象：公众人物 | 对象：用户的品牌（含未成名 IP） |

**本质不同**：nuwa 是"让人替你思考"，我们是"让 agent 成为唯一最懂你品牌的守门人 + 操盘手"。概念、对象、产出均不同，无抄袭风险。

### 3.2 nexl-broker（品牌经纪人）四大能力

1. **品牌初始化（Onboarding）**
   首次激活时，broker 用 3-5 轮对话引导用户沉淀 `brand-profile.md`：
   - 使命 / 价值观内核
   - 视觉基因（色板、字体、质感、禁忌色）
   - 品牌声音（语气、用词偏好、绝对禁词）
   - 核心叙事主线（一句话故事）
   - 竞品定位与差异化
   - 目标用户画像
   - 合规红线（行业禁忌、不能说的词）

2. **品牌守门（Gatekeeper）**
   每次 builder 产出文案 / 视觉 / 站点结构，broker 先读 `brand-profile` 做一致性校验：
   - 偏离内核 → 自动标注或打回（类比 nuwa 的 Phase 4 质量验证，但维度是"品牌保真"而非"人物保真"）
   - 输出"品牌一致性报告"（通过项 / 偏离项 / 建议）

3. **策略顾问（Strategist）**
   基于品牌定位，给建站方向、内容选题、增长叙事、跨平台调性统一建议——相当于"品牌视角的军师"。

4. **资产自包含（私有）**
   `brand-profile.md` 存用户私有空间（本地或私有仓），**绝不进公开门面仓**，避免泄露用户商业机密。

### 3.3 激活后调度流（根 SKILL.md 元层）

```
加载 builder.md/SKILL.md
  → ① 平台识别（Coze / Meoo / WorkBuddy / MIAODA）
  → ② brand-profile 存在？
       否 → broker 引导品牌初始化（写入私有档案）
       是 → broker 加载档案
  → ③ 预算顾问（已有四平台估算器）
  → ④ builder 建站（每一版经 broker 守门校验）
  → ⑤ 交付：站点 + 品牌档案 + 运营建议
```

### 3.4 broker 模板骨架（我们自研，结构借鉴 Agent Skills 标准而非 nuwa 文字）

```yaml
---
name: nexl-broker
description: 品牌经纪人。当用户提到「品牌调性」「品牌档案」「守门」「品牌一致」
  或任何建站/内容产出需对齐品牌内核时触发。不在无关闲聊自动触发。
---
# 品牌资产结构
# 守门清单（一致性 8 维）
# 策略框架（叙事/增长/差异化）
# 诚实边界（品牌会进化，档案需定期复核）
```

---

## 四、侵权风险规避清单（硬约束）

1. **不复制** nuwa 任何文件原文、示例对话、评分数字、模板措辞。
2. **概念原创**：我们是"品牌资产化 + 守门"，nuwa 是"名人蒸馏"——对象、方法论、产出均不同。
3. **架构范式可借鉴**：自包含、渐进披露、质量守门、模板驱动——这些是 Agent Skills 协议（agentskills.io）通用范式，非 nuwa 独创，可合法使用。
4. **治理借鉴通用做法**：核心 SKILL.md 不接受外部 PR、附 LICENSE——行业惯例，非抄袭。
5. **守门清单自研**：基于品牌管理常识（视觉/语气/叙事一致性）自写，不引用 nuwa 的 fidelity 维度文字。
6. **明确边界**：仓库自写 LICENSE（建议 MIT），不宣称源自 nuwa；如需致谢，仅在 README 注明"范式受 Agent Skills 生态启发"。

---

## 五、落地路线图（待主人确认）

- [ ] 根入口标准化：公开仓根 `SKILL.md` 取代 `builder.md`（需确认是否改固定激活语）
- [ ] 新增 `skills/nexl-broker/` + `brand-profile` 模板 + 守门清单
- [ ] `references/` 迁入四平台预算档案 + 品牌提炼框架
- [ ] 双激活语文案（安装型短句 + 即载型固定句）写入 README / 白皮书
- [ ] 双仓推送 + HANDOFF 第 17 棒

> 注：第二节 2.1 双激活语、第三节双核设计可先落地（不改固定句）；第五节根改名涉及铁律，单独确认。

---

## 下一步行动

1. 主人确认是否采用「双激活语 + 双核（builder+broker）」方案。
2. 若确认，我先落地**不影响铁律**的部分（新增 nexl-broker 子skill、双激活语文案、broker 模板），再单独讨论根改名。
3. 品牌经纪人首版可先用「通用品牌框架」跑通，后续按真实用户品牌迭代 `brand-profile` 模板。
