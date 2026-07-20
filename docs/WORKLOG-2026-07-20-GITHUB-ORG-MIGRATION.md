---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 6 棒（GitHub 组织迁移全程执行 + 经验沉淀）
topic: 将 nexl 独立站 Skill 仓库从个人账号 richard702ayu 迁到组织 nexl-web-skills 的全流程记录（建私有仓 + 网页建组织 + transfer + URL 规范化）
---

> 上一棒：第 5 棒神级马甲门面改造 + 可见性排查（门面分离 + 改 owner 到组织）。本棒执行"挪私有仓库 + 建组织 + 迁移"的完整闭环，并把链接 GitHub 的实战经验沉淀为可复用 SOP（见同目录 `GITHUB-LINKING-EXPERIENCE.md`）。下一棒预期：启动 30 天冲星计划（Show HN / Reddit / Product Hunt / awesome-* PR）。

# 工作日志 · GitHub 组织迁移全流程（2026-07-20）

## 〇、一句话结论

**nexl 独立站 Skill 项目已正式归属组织 `nexl-web-skills`**：公开门面仓 `nexl-web-skills/nexl-web-skills` + 私有完整版 `nexl-web-skills/nexl-web-skills-internal`，个人账号下两仓消失，组织页只显示这 2 个干净仓库（**那 233 个 fork 完全不出现** —— 正是主人要的效果）。

---

## 一、背景与目标

| 诉求 | 原因 |
|------|------|
| 隐藏个人账号的 233 个 fork | 个人 Profile 的 `Repositories 236` 暴露大量历史 fork，影响专业观感 |
| 门面分离 | 对外只露"神级马甲"冷峻门面，内部接力文档（含决策心路）留在私有仓 |
| 组织化运营 | 为 30 天冲星计划建立统一身份，Star 聚合到组织而非散落个人 |

**决策（主人定）**：不删 233 fork（尊重历史），改用**建组织 `nexl-web-skills` 并 transfer** —— 组织页天然不含个人 fork，零删除风险。

---

## 二、前置约束（先讲清，免踩坑）

- 本机 `gh` 登录为 `richard702ayu`，token scope = `gist / read:org / repo / workflow`。
- **致命缺口：缺 `admin:org`** → 建组织这一步 GitHub API 直接 404，只能走网页。
- 沙箱环境到 `github.com` 的链路偶发 TLS 抖动（`gh api` 与 `git push` 都可能瞬时断）。

---

## 三、全流程时间线（6 步，全自动化 + 1 步网页）

### Step 1 · 建私有内部仓并推送完整版
- `gh repo create nexl-web-skills-internal --private` → 在 `richard702ayu` 名下建成。
- 本地 `_internal_full_backup`（112 文件完整版）推送。
- **坑 A（git 残留）**：该目录的 git 仓 `origin` 上次中断会话误指**公开仓** `richard702ayu/nexl-web-skills`，且本地 `main` 比远程还多一次提交。修正：`git remote set-url origin .../nexl-web-skills-internal.git` → `git push -u origin main`。公开仓未被触碰。
- 结果：私有仓落地 31 文件，main = `6d953c4`。

### Step 2 · 试建组织（撞墙，确认只能网页）
- `gh api user/orgs -X POST -f login=nexl-web-skills ...` → **404**。
- 结论：`POST /user/orgs` 实测无 `admin:org` 即 404，**建组织必须主人网页操作**（https://github.com/organizations/new，Free 套餐）。

### Step 3 · 主人网页建组织 ✅
- 主人在 https://github.com/organizations/new 创建 `nexl-web-skills`（Free，0 仓库）。
- 核验：`gh api /orgs/nexl-web-skills` → `login=nexl-web-skills plan=free`。

### Step 4 · transfer 公开门面仓
- `gh api -X POST /repos/richard702ayu/nexl-web-skills/transfer -f new_owner=nexl-web-skills`。
- **坑 B（503 抖动）**：首发返回 503（GitHub 服务端瞬时抖动，非权限拒绝），重试即成功。
- 核验：个人路径 `richard702ayu/nexl-web-skills` 已重定向到组织 → 证明个人仓消失。

### Step 5 · transfer 私有内部仓
- 同上命令转移 `nexl-web-skills-internal` → 首发 503，重试成功。
- 核验：组织下两仓均在（`nexl-web-skills/nexl-web-skills` 公开、`nexl-web-skills/nexl-web-skills-internal` 私有）。

### Step 6 · URL 规范化 + 推送
- 本地 `tideshellbase/` + `_internal_full_backup/` 共 **23 处** 旧路径 `richard702ayu/nexl-web-skills` → 组织路径 `nexl-web-skills/nexl-web-skills`（脚本 `/tmp/fix_nexl_urls.py` 批量替换）。
- **坑 C（SSL 抖动）**：`git push` 遇 `SSL_ERROR_SYSCALL`（LibreSSL TLS 握手被断），`gh api` 同刻也 EOF。本地 commit 已先生成保障安全，`sleep 6` 后重试推送成功。
- 在线核验：README / install.sh 内 URL 已是组织路径（raw 主源 `raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main`）。

---

## 四、最终结果（已核验）

| 仓库 | 可见性 | 地址 | 状态 |
|------|--------|------|------|
| nexl-web-skills | 公开门面 | https://github.com/nexl-web-skills/nexl-web-skills | 8 文件 · URL 已规范 |
| nexl-web-skills-internal | 私有完整版 | https://github.com/nexl-web-skills/nexl-web-skills-internal | 31 文件 · URL 已规范 |

- 组织页 `gh repo list nexl-web-skills` → 仅 2 仓，**233 fork 零出现**。
- 个人账号下两仓已消失（GitHub 自动重定向旧 URL 到组织）。
- 本地两处 git 仓 remote 同步指向组织 URL。

---

## 五、关键坑与教训（给下一位接力者）

1. **建组织必须有 `admin:org`** → 否则只能网页。别浪费时间调 API。
2. **transfer 遇 503 是抖动不是拒绝** → 直接重试，勿疑权限。
3. **git push 遇 `SSL_ERROR_SYSCALL`** → 先 `git commit`（本地已安全），再 `sleep` 重试；沙箱→github 链路不稳是常态。
4. **中断会话会留 git 残留** → 接手旧目录先 `git remote -v` + `git log` 核对，别盲推。
5. **门面分离要贯彻** → 公开仓只露冷峻门面，内部文档/决策心路留私有仓。

---

## 六、交付物清单

- 行动卡 `nexlbase/ORG-SETUP-ACTION.md`（完成态）
- 本工作日志 `docs/WORKLOG-2026-07-20-GITHUB-ORG-MIGRATION.md` + `.html`
- 经验 SOP `docs/GITHUB-LINKING-EXPERIENCE.md` + `.html`
- 两组织仓已就位并 URL 规范、组织页干净

> 下一步：组织身份已立，可启动 30 天冲星计划。需要我起草首发文案矩阵，或先润色对外 README 的病毒式传播稿吗？
