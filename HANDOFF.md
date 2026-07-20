# HANDOFF · nexl-web-skill 接力链

> 单一接力链指针。每棒详情见对应文档 `frontmatter`（relay 字段已自带棒序号），本文件只做索引与最新棒续写。
> 第 1–19 棒散见于 `docs/*` 的 frontmatter 与 git 历史（Coze 预算 #12 / Meoo #14 / WorkBuddy+MIAODA #15 / 路由 #16 / 双核设计 / 病毒战略 / 双核亮相 v2-v4 #17-19）。本文件于第 20 棒时重建。

---

## 第 20 棒 · 2026-07-21 · 观涛虾🦐 (TideShell)

**主题**：四平台内嵌 Agent 满血调用战略 + 世界级独立站数字资产标准

**交付物**：
- `docs/PLATFORM-AGENT-MAXIMIZER.md` —— 战略全文（md）
- `docs/PLATFORM-AGENT-MAXIMIZER.html` —— Apple 极简深色可视化版

**核心结论**：
1. **四平台内嵌 Agent 怎么调起**：每个平台有「官方模板入口（降维）」与「对话/Agent 通道（满血）」两个入口；满血 = 走 Agent 通道 + 第一句注入 `builder.md`。
   - Coze：建 Bot + 知识库预置 builder.md（方案 A）；15 轮≈400 积分(¥0.4)
   - Meoo：对话首句粘激活语；Night Plan(22:00-08:00) qwen3.7-max 2 折≈¥0.10；禁接境外模型
   - WorkBuddy：技能激活 nexl-builder（观涛虾本地生成）；免费 500 积分≈6 次
   - MIAODA：对话粘激活语 / 装 App Builder Skill；全栈原生；免费 610 秒点=1.26 次全栈
2. **满血 7 杠杆**：通道选择 / 技能注入 / 预算透明前置 / 六步 ask / 视觉锤 / 8 维守门 / 底稿复利。
3. **远超普通入口的机制差**：模板 vs 底稿、一锤子 vs 六步、无阀 vs 8 维守门、会过时页面 vs 复利资产。
4. **世界级 8 标准**：灵魂可携带 / 视觉锤<5s / 一门设计语言 / 零调性漂移 / 主权独立 / 增长闭环 / 复利曲线 / Awwwards 级工艺。

**下一棒预期**：
- 把本战略落地为「四平台用户实操 Playbook 网页」（每平台一张激活步骤卡 + 满血口诀）。
- nexlbase 中台做「满血度自检」组件（是否走 Agent 通道 / 是否注入 SKILL / 是否过守门 三灯）。
- 把「8 维守门」做成可自动跑的 CLI 校验脚本，让守门不依赖 Agent 自觉。

**铁律（重申）**：激活语永不变 · 永不走官方模板入口 · 不报预算不许开工 · 8 维守门每版必过 · 底稿必导出可复制文本块 · 合规红线（Meoo 不接境外模型 / 域名必备案）。

---

## 第 21 棒 · 2026-07-21 · 观涛虾🦐 (TideShell)

**主题**：四平台案例调用索引 + GitHub 开发者共建模板库（集体独立站数字资产）规则设计与执行

**交付物**：
- `docs/COMMUNITY-TEMPLATES.md` —— 规则体系设计 + 执行 SOP + GitHub 创始人心法（md）
- `docs/COMMUNITY-TEMPLATES.html` —— Apple 极简深色可视化版
- 已落地骨架（可立即双仓推送）：
  - `templates/_template/`（template.json schema + README 中英，贡献者复制骨架）
  - `templates/catalog/portfolio/aurora-minimal/`（真实可运行暗黑极简作品集种子模板 + template.json + README）
  - `templates/INDEX.json`（机器可读总索引，含 `_meta.schema` + `_meta.agent_recall` 三维口径 + 种子条目）
  - `CONTRIBUTING.md`（扩为三套路径，新增「二、贡献模板」+ 三维评级标准）
  - `.github/workflows/community-check.yml`（扩 paths 含 templates/**，新增 template.json 字段校验）
  - `.github/workflows/welcome.yml`（PR/issue 欢迎语提 templates 通道）
  - `builder.md`（新增 1.6 案例锚定 Case Recall 步：平台识别后加载 INDEX、按平台+行业筛 quality 前三作参照锚点）
  - `docs/PLATFORM-ROUTING.md`（新增「六、案例调用索引」章，四平台调用方式对照表 + 三维口径）

**核心设计**：
1. **showcase（成品案例）vs templates（可复用模板）** 双轨：前者解决信不信，后者解决快不快。
2. **GitHub 创始人心法**：PR 是协作单元（低摩擦）/ 文档是项目一半（template.json+README 人 Agent 双读）/ 贡献者即维护者（署名 star 归你，核心团队只守单一真相源）。
3. **template.json schema**：id/name/author/category/platforms/tags/ratings(quality,cost_efficiency,stability)/cost_estimate/design_language/first_screen_pitch/license——`ratings` 三维对应「最优秀/性价比最高/代码最稳定」。
4. **案例调用机制**：被激活 agent 在四平台均加载 `templates/INDEX.json`，按平台+行业筛最优模板作参照锚点；用户可指定「以某模板为基底」从底稿+模板双源生长。普通入口从空白起，NEXL 从集体验证骨架起=机制差。
5. **三维评级客观可复核**：quality=第一屏5秒说清你是谁；cost_efficiency=低消耗达高质感；stability=即拷即用无破绽。

**下一棒预期**：
- 四平台白皮书各补「案例调用」小节（Coze/Meoo/WorkBuddy/MIAODA 各一段，引用 INDEX 调用方式）。
- 征集 5 个种子模板覆盖五类目（personal-ip/brand-site/portfolio/landing/shop）。
- 发起社区「Template Marathon」。
- 内部复盘文档（NEXL-DUAL-SKILL-DESIGN / VIRAL-PLAYBOOK）的 nuwa 对比句按主人指令清零。

**铁律（新增）**：模板零/最小外部依赖（即拷即用）· 含侵权素材一律拒 · brand-profile 商业机密绝不进公开仓 · 模板合入必须过 CI 字段校验 + 三维评级 · INDEX 由 CI 自动重建（不手改）。

---

## 第 22 棒 · 2026-07-21 · 观涛虾🦐 (TideShell)

**主题**：贡献路径审计——用事实核验 nexl 能否接受全球用户贡献（不靠推测）

**方法（事实来源）**：
- GitHub 官方文档（docs.github.com → Setting up your project for healthy contributions / PR & Issue templates / GitHub Pages）
- 同类项目真实做法：Hugo Themes（gohugoio/hugoThemesSiteBuilder）、learning-zone/website-templates（DeepWiki）、Ant Design Landing
- 本仓库真实文件清单（`ls`/`find` 核查：已确证缺 PULL_REQUEST_TEMPLATE / ISSUE_TEMPLATE / CODE_OF_CONDUCT / CODEOWNERS / gallery）

**交付物**：
- `docs/CONTRIBUTION-AUDIT.md` —— 事实对照审计全文（md）
- `docs/CONTRIBUTION-AUDIT.html` —— Apple 极简深色可视化版（预览已开）

**审计结论**：
1. **能接受全球贡献**，基础通道已通（Fork+PR / CI 字段校验 / 中英文档 / MIT LICENSE 文件已存在）。
2. **7 项缺口**，其中 2 项致命：
   - 🔴 G1 无自动画廊页（gallery）——与「独立站数字资产橱窗」定位矛盾；GitHub Pages 官方支持从 /docs 发布，Hugo 有 themes.gohugo.io 橱窗。
   - 🔴 G2 INDEX.json 靠维护者手动重建——单点瓶颈；Hugo 用每天 UTC 00:00 定时自动重建。
   - G3 无 PR 模板 / G4 无 Issue 模板 / G5 无 CODE_OF_CONDUCT / G6 无 CODEOWNERS（CONTRIBUTING 写「不收 SKILL.md PR」但无机制强制）/ G7 无截图规范（Hugo 强制 1500×1000+900×600 3:2）。
3. **做对的（保留）**：monorepo 式（同 website-templates）、template.json+总 INDEX.json（比 Hugo theme.toml 更机器可读）、CI 直校验（优于 Hugo 仅靠 preview）、中英双语 README、author=GitHub handle 署名。
4. **架构选型**：保持 monorepo 式，不改 Hugo 索引式；补「看得见（gallery）+ 自动跑（CI 重建 INDEX）+ 守得住（CODEOWNERS/PR 模板）」。

**下一棒预期（待拍板，未执行）**：
- P0：补 `.github/PULL_REQUEST_TEMPLATE.md`(拆模板/案例两模板) + `.github/ISSUE_TEMPLATE/`(bug/template_request/doc) + `CODE_OF_CONDUCT.md`(Contributor Covenant 2.1) + `.github/CODEOWNERS`(skills/、builder.md、INDEX.json 需核心审核)。
- P1：加 `scripts/build-gallery.cjs`(INDEX→docs/gallery/index.html) 配 GitHub Pages；改 community-check.yml 或新 rebuild-index.yml 在 PR 合入 main 时自动重建 INDEX；template.json 加 preview_image 字段 + 截图规范。

**铁律（新增）**：审计须引用事实（GitHub 官方文档 + 同类项目真实做法），禁凭推测下结论；贡献路径达标标准 = 达 Hugo Themes 级健康共建（画廊+自动重建+CODEOWNERS+PR/Issue 模板+行为准则）。
