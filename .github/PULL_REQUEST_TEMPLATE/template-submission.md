---
name: "🎨 模板贡献 Template submission"
about: 向集体模板库提交一个可复用独立站模板
title: "[TEMPLATE] <模板名>"
labels: [template]
---

感谢把你的作品带进 nexl 集体独立站数字资产 🔥

## 模板元信息（必填）
- 模板 ID：`your-template-id`（小写连字符，全局唯一）
- 类目 category：portfolio / brand-site / landing / event / personal-ip
- 作者 GitHub handle：@your-handle
- 设计语言（一句话）：

## 自检清单
- [ ] 已复制 `templates/_template/` 目录结构，`template.json` 字段完整且**含 `preview_image`**
- [ ] `site/` 零 / 最小外部依赖，即拷即用（已本地打开 `index.html` 验证）
- [ ] 第一屏 5 秒内说清「你是谁」
- [ ] 附带预览图 `preview_image`（1500×1000 主图 + 900×600 缩略，3:2 比例；放 `site/preview.svg` 或 `site/preview.png`）
- [ ] 已本地跑 `npm run check`（CI 字段校验）通过
- [ ] `LICENSE` 为 MIT，未含任何侵权素材（字体 / 图片需自证授权）

## 备注
（可选）想对使用者说的话 / 设计取舍 / 灵感来源
