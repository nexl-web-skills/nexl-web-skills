---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 6 棒（GitHub 操作经验沉淀）
topic: 通过 gh CLI / PAT 链接并操作 GitHub 的实战经验 SOP（权限 scope、建组织限制、仓库 transfer、SSL 抖动处理、git 凭据）—— 可复用
---

> 本文件为第 6 棒，上一棒：第 5 棒门面分离 + 改 owner。本棒在"组织迁移"实战中踩出 4 个真坑，提炼成这份 SOP，供任何后续接力者（人或 Agent）直接复用，不再交学费。下一棒预期：冲星计划执行。

# 链接 GitHub 经验 SOP（实战沉淀）

## 〇、认证三选一

| 方式 | 命令 / 位置 | 适用 | 注意 |
|------|------------|------|------|
| `gh auth login` | 交互式，本机 keyring 存 token | 本机人操作 | 沙箱无 keyring 时读不到 → 用 PAT 文件兜底 |
| PAT 环境变量 | `export GITHUB_TOKEN=ghp_xxx` | 脚本/CI | 明文易泄漏，**用完即删文件** |
| `gh auth setup-git` | 让 git 走 gh 的凭据助手 | 避免 git 明文 token | 推前执行一次，git push 不再问密码 |

> 本机实操：keyring 读不到时，把 PAT 写入 `~/.github_token` 文件注入环境，**操作完立刻删除明文**（`rm ~/.github_token`）。

---

## 一、PAT scope 速查表（血泪版）

| scope | 能做什么 | 不能做什么 |
|-------|----------|------------|
| `repo` | 建/推/转公开+私有仓、读内容 | —— |
| `workflow` | 操作 Actions | —— |
| `read:org` | **读**组织/成员列表 | **不能建组织**（需 `admin:org`）|
| `gist` | 建 gist | —— |
| `admin:org` | **建组织 + 组织管理** | 本次 token **缺这项** → 建组织 404 |

**铁律**：要建组织，PAT 必须勾 `admin:org`（或 `gh auth login` 时选 `admin:org`）。否则 `POST /user/orgs` 直接 404，**不是权限不足提示，是静默 404** —— 别浪费时间调 API，直接去网页 https://github.com/organizations/new。

---

## 二、建组织：只能网页

- API：`gh api user/orgs -X POST -f login=...` → **404**（缺 admin:org）。
- 网页：https://github.com/organizations/new → Organization account name 填 `nexl-web-skills`、Plan 选 **Free**、Create。
- 为什么 GitHub 强制网页：防滥用 +  billing 确认。这是平台铁壁，API 无解。

---

## 三、仓库 transfer（个人 → 组织 / 组织间）

```bash
# 个人仓 → 组织
gh api -X POST /repos/richard702ayu/nexl-web-skills/transfer -f new_owner=nexl-web-skills
# 私有仓同理
gh api -X POST /repos/richard702ayu/nexl-web-skills-internal/transfer -f new_owner=nexl-web-skills
```

- **transfer = 移动**，不是复制：原个人仓消失，GitHub 自动把旧 URL 重定向到新组织路径。
- **抖动处理**：首发常遇 **503**（GitHub 服务端瞬时抖动，非权限拒绝）→ **直接重试 1-2 次**即成功。
- **核验**：`gh api /repos/nexl-web-skills/nexl-web-skills` 看 `owner.login`；个人路径再访问应重定向。

---

## 四、git push 遇 SSL 抖动

- 现象：`SSL_ERROR_SYSCALL` / `LibreSSL SSL_connect` / `gh api` 同刻 EOF。
- 根因：沙箱 → github.com 链路偶发 TLS 中断，**非权限、非配置错**。
- 处理：
  1. **先 `git commit`**（本地已安全生成，数据不丢）；
  2. `sleep 6` 后 `git push origin main` 重试；
  3. 仍断则再 sleep，通常 1-3 次内恢复。
- **预防**：大批量改动先本地 commit 再集中 push，减少长连接时长。

---

## 五、门面分离经验（公开 / 私有双仓）

- 对外只露"神级马甲"冷峻门面（README/MANIFESTO/SKILL），内部接力文档（决策心路、工作日志）留**私有仓**。
- 结构：
  - 公开 `nexl-web-skills/nexl-web-skills`（门面，8 文件）
  - 私有 `nexl-web-skills/nexl-web-skills-internal`（完整版，31 文件）
- URL 规范：远程转移后，仓库内引用的旧 owner 路径要批量替换（脚本 `/tmp/fix_nexl_urls.py` 范式：`grep -rl 旧串 | xargs sed -i`）。

---

## 六、踩坑 Checklist（接手 GitHub 任务前过一遍）

- [ ] PAT 是否含所需 scope？（建组织 → `admin:org`；转仓 → `repo`）
- [ ] `gh auth status` 确认登录身份正确（别推错账号）
- [ ] 接手旧目录先 `git remote -v` + `git log --oneline -3` 核对 origin（防中断残留误推）
- [ ] push 前先 `gh auth setup-git`（git 走 gh 凭据，免明文）
- [ ] transfer 遇 503 → 重试；push 遇 SSL → commit 后 sleep 重试
- [ ] 明文 token 文件操作完立即删
- [ ] 公开仓不提交内部决策文档（门面分离）

> 这套 SOP 已在本项目实战验证（建组织 + 双仓 transfer + URL 规范全过）。下一位接力者直接照抄即可。
