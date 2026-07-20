# 贡献路径审计 · nexl 能否接受全球用户贡献？

> 审计方法：**只引用事实**，不靠推测。事实来源 = GitHub 官方文档（docs.github.com）+ 同类项目真实做法（Hugo Themes / learning-zone/website-templates / Ant Design Landing）+ 本仓库真实文件清单（已 `ls`/`find` 核查）。
> 审计日期：2026-07-21 · 接力棒 #22

---

## 一、结论（先讲结论）

**能接受全球用户贡献**，基础通道（Fork + PR、CI 字段校验、中英文档、MIT LICENSE）已具备。

但对照 **GitHub 官方列为「健康社区」的标配** 与 **同类模板库项目的真实做法**，我们仍有 **7 项缺口**，其中 2 项致命：

- 🔴 **致命 1：没有自动画廊页（gallery）**。我们定位是「独立站数字资产橱窗」，却只有 `raw.githubusercontent` 链接，全球用户无法一眼浏览集体资产——Hugo Themes 有 `themes.gohugo.io`，这是同类项目的标配体验。
- 🔴 **致命 2：`INDEX.json` 靠「维护者手动重建」**。CONTRIBUTING 写「维护者合入后手动重建」，单点瓶颈；Hugo 用**每天 UTC 00:00 定时自动重建**站点。

其余 5 项为 GitHub 官方「社区健康文件」标配缺失（PR 模板 / Issue 模板 / 行为准则 / CODEOWNERS / 截图规范）。

---

## 二、GitHub 官方「健康社区」标配对照（事实）

来源：docs.github.com → *Setting up your project for healthy contributions* 系列（社区健康文件推荐项）。

| 官方推荐文件 | 官方定位 | 我们现状 | 状态 |
|---|---|---|---|
| `CONTRIBUTING.md` | 贡献者指南 | ✅ 已存在（三套路径 + 三维评级） | PASS |
| `README.md` | 项目门面 | ✅ 已存在 | PASS |
| `LICENSE` | 授权清晰 | ✅ 已存在（MIT） | PASS |
| GitHub Actions（CI） | 自动校验 | ✅ `community-check.yml` 校验 `template.json`+`showcase` | PASS |
| **`CODE_OF_CONDUCT.md`** | 全球贡献者行为公约（Contributor Covenant 2.1） | ❌ 缺失 | **FAIL** |
| **`.github/PULL_REQUEST_TEMPLATE.md`** | PR 时自动载入引导 | ❌ 缺失（仅 CONTRIBUTING 文字，PR body 为空） | **FAIL** |
| **`.github/ISSUE_TEMPLATE/`** | 结构化 Issue（bug/特性/模板申请） | ❌ 缺失 | **FAIL** |
| **`.github/CODEOWNERS`** | 关键路径强制审核 | ❌ 缺失（CONTRIBUTING 说「不收 SKILL.md PR」但**无机制强制**） | **FAIL** |
| **GitHub Pages（gallery）** | 发布展示站点 | ❌ 缺失（预览只靠 raw 链接） | **FAIL** |

> 官方事实锚点：PR 模板须置于 `.github/pull_request_template.md`（或 `.github/PULL_REQUEST_TEMPLATE/` 多模板目录、或根/`docs/`），「Templates are available to contributors when they are merged into the repository's default branch.」Issue 模板置于 `.github/ISSUE_TEMPLATE/`。

---

## 三、同类项目架构事实（我们不是第一个做这事的人）

### 3.1 Hugo Themes（gohugoio/hugoThemesSiteBuilder / devcows/hugoThemes）
- **贡献架构 = 索引式**：Fork 主仓 → 在 `themes.txt` 按字典序加**一行外部主题仓库 URL** → 提 PR → Netlify deploy preview 校验。**主仓不存代码，只存 URL 索引**。
- **元数据格式 = 强制 `theme.toml`**（明确「Only theme.toml is accepted, not theme.yaml or theme.json」），必含 `name/license/licenselink/description/homepage/tags/features/min_version/author`。
- **截图规范 = 强制**：`/images/screenshot.png`（≥1500×1000）+ `/images/tn.png`（≥900×600），**3:2 比例**。
- **自动重建 = 每天 UTC 00:00 定时重建**站点，新主题次日反射。
- **LICENSE = 强制开源**，侵权「rejected without further discussion」。

### 3.2 learning-zone/website-templates（DeepWiki）
- **贡献架构 = monorepo 式**：Fork → 改 → PR，代码**直接进主仓**。
- **标准结构**：每个模板含 `index.html` + `README.md` + CSS + License；命名用 descriptive hyphenated（如 `business-portfolio`）。
- **索引方式**：提交时需**手动更新主 README 索引表**（`[序号] | 名称 | 描述 | demo`）。
- **Review 标准**：代码质量 / 原创性 / 响应式 / 浏览器兼容 / 文档 / 许可。

### 3.3 Ant Design Landing
- Fork → 功能分支 → lint 前钩子 → PR；模板在 `site/templates/template/element/` 含 `index.jsx` + `template.config.js`。

### 3.4 我们的架构定位
我们采取 **monorepo 式（同 website-templates）**，但比两者都更结构化：
- 用 `template.json`（机器可读，agent 友好）+ 总 `INDEX.json`（全局索引，Hugo/website-templates 都没有对等物）
- CI 直接校验字段（优于 Hugo 仅靠 Netlify preview）
- 中英双语 README（符合 Hugo「至少英文翻译」要求）

**结论**：monorepo 式对「集体数字资产聚焦」是合理的，无需改成 Hugo 的索引式（索引式跨仓校验更复杂，且我们已有 CI 直校验）。但我们漏了 Hugo 的**截图规范**与**自动重建**两个关键工程实践。

---

## 四、差距清单（用事实，逐项可复核）

| # | 缺口 | 事实依据 | 影响 |
|---|---|---|---|
| G1 🔴 | 无自动画廊页 | GitHub Pages 官方支持从 `/docs` 或 Actions 发布；Hugo 有 themes.gohugo.io 橱窗 | 全球用户看不见「集体资产橱窗」，与定位矛盾 |
| G2 🔴 | INDEX.json 手动重建 | Hugo 用每天定时自动重建；我们 CONTRIBUTING 写「维护者手动重建」 | 单点瓶颈，维护者离职/疏忽即停更 |
| G3 | 无 PR 模板 | GitHub 官方 `.github/pull_request_template.md` 标配；Hugo/website-templates/Ant Design 全用 | 贡献者开 PR 无勾选引导，易漏 LICENSE/自测 |
| G4 | 无 Issue 模板 | 官方 `.github/ISSUE_TEMPLATE/`；同类项目均分 bug/feature/模板申请 | 全球用户报 bug/申请新类目无结构化入口 |
| G5 | 无 CODE_OF_CONDUCT | 官方社区健康文件核心项（Contributor Covenant 2.1） | 多元贡献者缺行为公约保障 |
| G6 | 无 CODEOWNERS | 官方推荐保护关键路径；我们 CONTRIBUTING 说「不收 SKILL.md PR」但无机制强制 | 任何人可提 PR 改 `skills/`、`builder.md`、`INDEX.json` |
| G7 | 无截图规范 | Hugo 强制 screenshot(1500×1000)+tn(900×600) 3:2 | 画廊页若有，也会空/不一致 |

---

## 五、我们做对的地方（事实印证，保留）

- ✅ **monorepo 式**：与 website-templates 同款，对集体资产聚焦合适，CI 直校验。
- ✅ **`template.json` + 总 `INDEX.json`**：比 Hugo `theme.toml` 更机器可读，agent 调用友好（我们的核心差异）。
- ✅ **`community-check.yml` 字段校验**：优于 Hugo 仅靠 Netlify preview，提交即拦错。
- ✅ **中英双语模板 README**：符合 Hugo「至少英文翻译」国际化要求。
- ✅ **MIT LICENSE 文件已存在**：满足官方「授权清晰」与 Hugo「强制开源」双要求。
- ✅ **`author = GitHub handle` 署名机制**：荣誉归贡献者，符合开源激励逻辑。

---

## 六、可执行改进路线图（待拍板，未执行）

**P0 — 补齐 GitHub 官方健康社区标配**
1. 加 `.github/PULL_REQUEST_TEMPLATE.md`（拆「模板贡献」「案例贡献」两模板，含勾选项）
2. 加 `.github/ISSUE_TEMPLATE/`（`bug_report` / `template_request` / `doc_improvement`）
3. 加 `CODE_OF_CONDUCT.md`（Contributor Covenant 2.1 官方原文）
4. 加 `.github/CODEOWNERS`：`skills/`、`builder.md`、`templates/INDEX.json` 列为需核心团队审核

**P1 — 解决体验与自动化致命缺口**
5. 加画廊生成器 `scripts/build-gallery.cjs`：读 `INDEX.json` → 生成 `docs/gallery/index.html`；配 GitHub Pages 从 `/docs` 发布（官方支持）
6. 改 `community-check.yml` 或新增 `rebuild-index.yml`：PR 合入 `main` 时**自动重建 `INDEX.json`**（消除 G2 单点，对齐 Hugo 自动重建理念）
7. `template.json` schema 加 `preview_image` 字段 + 截图尺寸规范（1500×1000 / 900×600，3:2，对齐 Hugo G7）

**架构选型建议**：保持 monorepo 式（事实支持其适合集体资产），**不**改 Hugo 索引式；重点补「看得见（gallery）+ 自动跑（CI 重建 INDEX）+ 守得住（CODEOWNERS/PR 模板）」三层。

---

## 七、审计的一句话结论

> 我们的贡献**通道**已通（Fork+PR+CI+MIT），但**体验与治理**还停留在「内部接力」阶段——缺画廊页让全球用户看不见资产、缺 CODEOWNERS/PR 模板让治理靠自觉。补齐 P0+P1 七项，即达到 Hugo Themes 级的健康共建标准。
