# 贡献指南 · nexl 资产共建

nexl 的增长靠**真实案例**与**可复用模板**双轮驱动。你建的每一个站、贡献的每一个模板，都是集体独立站数字资产的一部分。

核心原则：**核心资产集中、UGC 与模板开放**。

---

## 一、提交建站案例（showcase）— 主增长飞轮

把你在任何平台（Coze / 秒悟 Meoo / 腾讯 WorkBuddy）用 nexl 建的站，提交到 `showcase/`：

1. 复制 `showcase/_template.md` → `showcase/<your-brand>.md`
2. 填写：品牌名、平台、一句话定位、站点链接/截图、激活语、一句话体验
3. **必须包含 nexl 署名与激活语**（见模板）——这是裂变回流的命脉
4. 不得泄露商业机密或他人隐私

提 PR 后，`.github/workflows/community-check.yml` 自动校验格式；维护者合入即展示在 README 案例区（**star 归你**）。

---

## 二、贡献模板（templates）— 集体数字资产库 ★

把你的独立站模板贡献到 `templates/`，成为所有人可复用的起点资产：

1. 复制 `templates/_template/` → `templates/catalog/<category>/<your-id>/`
   - `<category>` ∈ `personal-ip` / `brand-site` / `portfolio` / `landing` / `event` / `shop`
2. 填 `template.json`（**必含**：`id` / `name` / `author` / `category` / `platforms` / `ratings` / `license`）
3. 放可运行 `site/`（index.html 起，**零或最小外部依赖**，即拷即用）
4. 写 `README.md`（中英：设计语言 / 适用场景 / 对应平台成本）
   4.5 提供预览图 `site/preview.svg`（或 `preview.png`）：**1500×1000 主图 + 900×600 缩略，3:2 比例**，并写入 `template.json` 的 `preview_image` 字段。集体画廊（GitHub Pages 自动发布）会抽取它做橱窗卡片。
5. 提 PR → CI 自动校验 `template.json` 字段完整性
6. 维护者 + 社区评审**三维评级**（quality / cost_efficiency / stability，1–5）→ 合入 → CI 重建 `templates/INDEX.json` → 上索引

**三维评级标准**（客观可复核）：
- `quality` 优秀：第一屏 5 秒能否说清「你是谁」+ 独特价值；设计语言统一；工艺精度
- `cost_efficiency` 性价比：对应平台积分/秒点消耗 vs 同类，低消耗达高质感
- `stability` 稳定：零/最小依赖、响应式断点、跨平台一致、无 console 报错

> 署名即归属，`author` 字段即你的 GitHub handle，**star 与荣誉归你**。核心团队只守单一真相源，不独占资产。

---

## 三、改进核心 skill — 单一真相源保护

`skills/nexl-builder/SKILL.md` 与 `skills/nexl-broker/` 是核心资产：

- 发现 bug / 改进点 → 开 issue 讨论；被采纳的想法由维护者实现并在 commit 中致谢。
- **不接受直接改核心 SKILL.md 的外部 PR**（保持单一真相源，避免分叉）。
- 白皮书、文档、demo、脚本欢迎 PR。

---

## 四、伦理红线

1. **不蒸馏真人冒充其观点**：我们做的是「品牌资产化」（brand-profile），不是「名人思维蒸馏」，概念与产出均不同。
2. 模板不得含侵权素材（字体 / 图片 / 代码须可商用或自产）。
3. 不生成侵权 / 虚假 / 违规内容。
4. `brand-profile` 含用户商业机密，**绝不进公开仓**，只存用户私有空间。

---

## 五、License

MIT。贡献即同意以 MIT 发布你的案例与模板文件。核心 SKILL.md 亦 MIT，但维护权归核心团队。

---

## 六、集体画廊 Gallery

所有合入的模板会自动汇入 `templates/INDEX.json`，并渲染成公开橱窗 `docs/gallery/index.html`（GitHub Pages 发布）。

- **本地预览**：`npm run gallery` 生成 `docs/gallery/index.html`，浏览器打开即可看橱窗效果。
- **本地校验**：`npm run check`（= `node scripts/build-gallery.cjs --validate`）校验 `template.json` 字段完整性。
- **自动重建**：模板合入 `main` 后，`rebuild-index.yml` 自动扫描 `templates/catalog/` 重建 `INDEX.json`；`deploy-pages.yml` 自动发布画廊。
- **首次启用 Pages**：仓库 Settings → Pages → Source 选 `GitHub Actions`（workflow 已就绪）。

> 画廊是「独立站即下一个风口」的具象橱窗——每个卡片都是社区验证过的起点资产，任何人 fork 即可拥有。
