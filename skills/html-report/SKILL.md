---
name: html-report
description: 当用户需要在 nexlbase 中台生成各类 HTML 报告（流量月报、内容摘要、SEO 体检、自定义空白页），或用户的 Agent 要协同优化已有报告时使用。触发词：生成报告、月报、SEO 体检、流量分析、内容摘要、报告优化。
---

# HTML Report（nexlbase 报告生成技能 · Anthropic 规范 Skill 包）

教 Agent 如何在 nexlbase 中台确定性地生成与优化 HTML 报告，且支持用户 Agent 进中台协同。

## SOP
1. 从 `index.yaml` 匹配报告类型（monthly / digest / seo / blank）。
2. 拉取目标独立站数据（CloudBase `novavia:sites` + 分析集合）。
3. 用确定性模板渲染 HTML（零外部依赖、内联 CSS、移动端友好）。
4. 写回 CloudBase `reports` 集合，返回可访问 URL。

## 原子命令
```bash
tideshell report gen --type monthly --site <domain> --out reports/2026-07.html
tideshell report optimize --id <reportId>   # 用户 Agent 协同优化入口
```

## 约束
- 报告必须纯静态 HTML，不依赖运行时 JS（防 GFW / WebView 兼容）。
- 优化操作记录到 `reports.<id>.history`，可回滚。
