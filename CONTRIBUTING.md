# 贡献指南 · nexl 案例飞轮

nexl 的增长靠**真实案例**驱动。你用 nexl 建的每一个品牌站，都是别人决策时看到的活广告。

本文件定义两套贡献路径。核心原则：**核心资产集中、UGC 开放**。

---

## 一、提交你的建站案例（showcase）— 主增长飞轮

把你在任何平台（Coze / 秒悟 Meoo / 腾讯 WorkBuddy / 百度秒哒 MIAODA）用 nexl 建的站，提交到 `showcase/`：

1. 复制 `showcase/_template.md` → `showcase/<your-brand>.md`
2. 填写：品牌名、平台、一句话定位、站点链接/截图、激活语、一句话体验
3. **必须包含 nexl 署名与激活语**（见模板）——这是裂变回流的命脉
4. 不得泄露商业机密或他人隐私

提 PR 后，`.github/workflows/community-check.yml` 自动校验格式；维护者合入即展示在 README 案例区（**star 归你**）。

---

## 二、改进核心 skill — 单一真相源保护

`skills/nexl-builder/SKILL.md` 与 `skills/nexl-broker/` 是核心资产：

- 发现 bug / 改进点 → 开 issue 讨论；被采纳的想法由维护者实现并在 commit 中致谢。
- **不接受直接改核心 SKILL.md 的外部 PR**（保持单一真相源，避免分叉）。
- 白皮书、文档、demo、脚本欢迎 PR。

---

## 三、伦理红线

1. **不蒸馏真人冒充其观点**：我们做的是"品牌资产化"（brand-profile），不是"名人思维蒸馏"，概念与产出均不同。
2. 不生成侵权 / 虚假 / 违规内容。
3. `brand-profile` 含用户商业机密，**绝不进公开仓**，只存用户私有空间。

---

## 四、License

MIT。贡献即同意以 MIT 发布你的案例文件。核心 SKILL.md 亦 MIT，但维护权归核心团队。
