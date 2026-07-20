---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 3 棒 / 免备案内测方案设计人
topic: CloudBase 默认域名·免 ICP 备案内测方案（将 tideshellbase 静态托管，供国内用户内测）
---

> 本文件为第 3 棒，上一棒：第 2 棒（两条激活语设计），下一棒预期：执行 tcb 部署、回填默认域名、实测内测激活链路。

# 免备案内测方案 · CloudBase 默认域名

## 一、结论

✅ **可以免备案内测。** 用 CloudBase 静态网站托管的**默认域名** `*.app.tcloudbase.com`（腾讯云统一域名，备案义务在腾讯侧），**不绑定任何自定义域名** → 用户**零 ICP 备案，立即可用**。

这正是"内测 / 开发测试"的合规用法：官方明确默认域名仅限开发测试阶段。

## 二、为什么免备案（机制对照）

| 域名类型 | 备案义务 | 说明 |
|---------|---------|------|
| 自定义域名（如 `nexlbase.app`） | **用户必须 ICP 备案**（管局审核 1–20 工作日） | 需购买备案云资源 + 提交资料 |
| 默认域名 `*.app.tcloudbase.com` | **腾讯云已完成备案** | 用户在腾讯二级域名下，零备案 |

> 来源：腾讯云官方文档 `product/876/130728`（HTTP 访问服务·域名管理）、`docs.cloudbase.net/en/service/alias`（Access Reminder Intermediate Page）。

## 三、内测约束（必读，决定形态）

- ✅ 不需要备案、立即可用
- ✅ 国内访问快（环境在上海节点 `ap-shanghai`）
- ⚠️ **浏览器直接访问会弹"确认访问"中间页**（一次性，cookie 记住后不再弹）
- ⚠️ 有访问频率限制；部分高级功能不可用
- ❌ **严禁大规模分发**（流量触发风控可能关停）
- ⚠️ 境外访问可能偏慢（上海节点）
- ❌ 生产环境必须绑定已备案自定义域名

→ **内测（小范围、可控的国内用户）完全合规。**

## 四、部署步骤（tcb CLI）

```bash
# 1. 安装并登录 CLI（device-code 登录，按提示在浏览器授权）
npm i -g @cloudbase/cli
tcb login

# 2. 锁定环境
tcb env use cloudbase-d9gumwykf42c90a92

# 3. 开通静态托管（首次 detail 会自动开通）
tcb hosting detail -e cloudbase-d9gumwykf42c90a92

# 4. 部署 tideshellbase 到 /tideshell 子路径
tcb hosting deploy ./nexlbase/tideshellbase /tideshell -e cloudbase-d9gumwykf42c90a92 --yes

# 5. 拿到默认域名（形如 cloudbase-d9gumwykf42c90a92.ap-shanghai.app.tcloudbase.com）
tcb hosting detail -e cloudbase-d9gumwykf42c90a92

# 6. 验证文件已上线
tcb hosting list -e cloudbase-d9gumwykf42c90a92
```

## 五、默认域名下的激活语（部署后回填 DEFAULT_DOMAIN）

把下方 `{DEFAULT_DOMAIN}` 替换为第 4 步拿到的真实默认域名：

- **范式 A（发给 Agent）**
  ```
  请阅读 https://{DEFAULT_DOMAIN}/tideshell/nexl-builder.md 文档，按照步骤为我激活 nexl-builder 独立站构建技能，开启我的独立站构建之旅。
  ```
- **范式 B（终端一行）**
  ```
  curl -fsSL https://{DEFAULT_DOMAIN}/tideshell/install.sh | bash
  ```

## 六、⚠️ 内测期关键坑：中间页挡住 Agent / CLI 自动读取

默认域名的"确认访问"中间页是**浏览器行为**。这意味着：

- Agent 的 WebFetch / 网页抓取工具读到的是**中间页 HTML**，不是真正的 `nexl-builder.md` → 激活失败
- CLI 的 `curl` 同样可能拿到中间页 HTML 而非真脚本 → 安装失败

**内测期两招绕过（已落地到 install.sh 与 ACTIVATION）：**

1. **范式 A → 改为「复制 SKILL.md 全文发给 Agent」**：`skills/nexl-builder/SKILL.md` 是纯文本，零 URL 依赖，内测最稳路径。
2. **范式 B → install.sh 加兜底**：下载后检测首行是否为 Markdown（`#`）或 Bash（`#!/usr/bin/env bash`）；若拿到 HTML 中间页，则提示用户浏览器访问并点"确认访问"后手动复制，绝不静默失败。

→ **正式期（备案自定义域名后）**：中间页消失，URL 激活原样恢复，范式 A/B 回到"读 URL"形态。

## 七、正式期路径（备案后，全球可用）

1. 注册 `nexlbase.app` → 在腾讯云用 CloudBase 环境作备案云资源提交 ICP 备案（个人版套餐已满足备案云资源条件）
2. 控制台「域名管理」绑定自定义域名 → 配置 CNAME → SSL 自动签发
3. 把 `ACTIVATION.md/.html` 与 `cli/install.sh` 的域名回写为 `nexlbase.app/tideshell`
4. 中间页消失，国内 + 境外均可直连，回归"一句话激活"体验

## 八、放行检查（接力者部署前/后）

- [ ] `tcb login` 成功且 `tcb env use` 锁定 `cloudbase-d9gumwykf42c90a92`
- [ ] `tideshellbase/` 已部署到 `/tideshell`，`tcb hosting list` 可见文件
- [ ] 默认域名已回填到 `{DEFAULT_DOMAIN}` 占位处
- [ ] 国内浏览器实测：中间页出现 → 点确认 → 文档/脚本可访问
- [ ] 内测用户走「复制 SKILL.md 全文」路径验证 Agent 激活成功
- [ ] 在 `HANDOFF.md` 接力链补第 3 棒说明

---

**下一步**：执行第四节 tcb 命令完成部署，回填默认域名，进入内测。
