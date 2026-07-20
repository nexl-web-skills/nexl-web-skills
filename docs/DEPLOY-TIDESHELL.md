---
date: 2026-07-20
relay: 观涛虾🦐 (TideShell) · 第 3 棒 / 部署 SOP 编写人
topic: tideshellbase 一键部署到 CloudBase 静态托管（免备案内测）的标准作业程序
---

> 配套 `hosting-no-filing.md` 的可执行 SOP。执行前请先读方案文档了解约束。

# 部署 SOP · tideshellbase → CloudBase 静态托管

## 0. 前置
- 已安装 Node（用于 `npm i -g @cloudbase/cli`）
- 有 CloudBase 环境 `cloudbase-d9gumwykf42c90a92` 的管理权限
- 当前工作目录为 `NovaVia-app` 仓库根

## 1. 登录并锁定环境
```bash
npm i -g @cloudbase/cli
tcb login                      # 浏览器 device-code 授权
tcb env use cloudbase-d9gumwykf42c90a92
tcb env list                   # 确认当前环境
```

## 2. 开通静态托管
```bash
tcb hosting detail -e cloudbase-d9gumwykf42c90a92
# 首次执行会自动开通静态网站托管
```

## 3. 部署（部署到 /tideshell 子路径）
```bash
tcb hosting deploy ./nexlbase/tideshellbase /tideshell \
  -e cloudbase-d9gumwykf42c90a92 --yes
```
> 若需全量刷新，先 `tcb hosting delete --dry-run -e ...` 预览，确认后 `--yes` 删除再重部署。

## 4. 拿到默认域名（关键）
```bash
tcb hosting detail -e cloudbase-d9gumwykf42c90a92
```
控制台输出形如：
```
默认域名: cloudbase-d9gumwykf42c90a92.ap-shanghai.app.tcloudbase.com
```
把这段记为 **DEFAULT_DOMAIN**。

## 5. 回填占位符
将以下文件中的 `{DEFAULT_DOMAIN}` 替换为真实默认域名：
- `docs/ACTIVATION.md` / `ACTIVATION.html`
- `cli/install.sh` 的 `BASE_URL`

替换示例：
```
https://cloudbase-d9gumwykf42c90a92.ap-shanghai.app.tcloudbase.com/tideshell/nexl-builder.md
```

## 6. 验证
```bash
tcb hosting list -e cloudbase-d9gumwykf42c90a92
# 应看到 /tideshell/index.yaml、/tideshell/skills/nexl-builder/SKILL.md 等
```
浏览器访问 `https://{DEFAULT_DOMAIN}/tideshell/` → 应弹"确认访问"中间页 → 点确认 → 显示文件列表/页面。
（注：中间页是浏览器行为，curl/Agent 抓取会被挡，见方案文档第六节。）

## 7. 国内用户内测入口（内测期推荐）
- **范式 A（最稳）**：把 `skills/nexl-builder/SKILL.md` 全文复制发给用户自己的 Coze Agent → 直接激活
- **范式 B**：`curl -fsSL https://{DEFAULT_DOMAIN}/tideshell/install.sh | bash`（install.sh 已带中间页兜底）

## 8. 回滚 / 清理
```bash
tcb hosting delete /tideshell --dir -e cloudbase-d9gumwykf42c90a92 --yes
```

## 9. 放行清单
- [ ] 登录成功、环境锁定
- [ ] 托管已开通、`/tideshell` 部署成功
- [ ] DEFAULT_DOMAIN 已回填三处占位
- [ ] 浏览器实测中间页 → 确认 → 可访问
- [ ] 内测用户「复制 SKILL.md」激活验证通过
- [ ] `HANDOFF.md` 接力链补第 3 棒
