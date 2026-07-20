---
name: forum-mod
description: 当用户需要在 nexlbase 中台为独立站发论坛帖、管理社区内容，或用户的 Agent 要协助起草/审核帖子时使用。触发词：发帖、论坛、社区、帖子管理、评论审核。
---

# Forum Mod（nexlbase 论坛管理技能 · Anthropic 规范 Skill 包）

教 Agent 如何在 nexlbase 轻论坛（CloudBase NoSQL 自研，零新增运维）发帖与管理。

## SOP
1. 确定帖子归属（全局社区 vs 某独立站子论坛）。
2. 起草 → 用户确认 → 发布（owner-only 写权限）。
3. 支持 Agent 协同起草，但发布动作需用户显式确认。

## 原子命令
```bash
tideshell forum post --site <domain> --title "..." --body "..."
tideshell forum list --site <domain>
```

## 约束
- 发帖前必须回显完整内容供用户确认（防黑盒误发）。
- 所有写操作走 CloudBase CUSTOM 安全规则（auth.openid == doc._openid）。
