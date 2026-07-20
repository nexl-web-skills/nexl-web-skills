# TideShell CLI · 原子执行力层

CLI 是"操作诚实"的载体：确定性、可复现、人/Agent 共享操作面。
所有命令在 App 内"命令台"与用户本机终端表现一致。

## 原子命令清单（v0.1 规划）
```bash
# 独立站
tideshell site register --domain <url> --owner <uid>   # 域名登记进中台
tideshell site list    --owner <uid>
tideshell site unlist  --domain <url>

# 报告
tideshell report gen     --type monthly|digest|seo|blank --site <domain>
tideshell report optimize --id <reportId>               # 用户 Agent 协同优化

# 论坛
tideshell forum post --site <domain> --title <t> --body <b>
tideshell forum list --site <domain>

# 技能（渐进式披露）
tideshell skill load  --id <skillId>   # 按需加载 SKILL.md
tideshell skill index                  # 打印 index.yaml
```

## 设计约束（防黑盒不可控）
- 每个命令只做一件事，返回结构化 JSON + 人类可读摘要。
- 失败必返回原始错误文本（不吞异常），便于复制复现。
- 所有写操作经 CloudBase CUSTOM 安全规则（owner-only）。
