#!/usr/bin/env bash
# TideShell CLI 安装器
# 正式期：curl -fsSL https://nexlbase.app/tideshell/install.sh | bash
# 内测期：curl -fsSL https://{DEFAULT_DOMAIN}/tideshell/install.sh | bash
#   （部署后请把下方 {DEFAULT_DOMAIN} 替换为 CloudBase 默认域名，见 DEPLOY-TIDESHELL.md 第 5 步）
# 安装后运行 `tideshell site build` 开启独立站构建之旅。
set -euo pipefail

# ↓↓↓ 部署后回填：把 {DEFAULT_DOMAIN} 替换为真实默认域名（形如 cloudbase-d9gumwykf42c90a92.ap-shanghai.app.tcloudbase.com）
BASE_URL="${TIDE_BASE:-https://{DEFAULT_DOMAIN}/tideshell}"
INSTALL_DIR="${HOME}/.tideshell"
BIN_DIR="${INSTALL_DIR}/bin"
SKILL_DIR="${INSTALL_DIR}/skills"

echo "🦐 TideShell CLI 安装中… (来源: ${BASE_URL})"

mkdir -p "$BIN_DIR" "$SKILL_DIR"

# 1) 拉取 nexl-builder 激活说明书（带中间页兜底）
if command -v curl >/dev/null 2>&1; then
  if curl -fsSL "${BASE_URL}/nexl-builder.md" -o "${SKILL_DIR}/nexl-builder.md" 2>/dev/null; then
    # 检测是否拿到真 Markdown（首行应为 # 开头）；否则是 CloudBase 中间页 HTML
    if [ -s "${SKILL_DIR}/nexl-builder.md" ] && ! head -1 "${SKILL_DIR}/nexl-builder.md" | grep -q '^#'; then
      echo "  ⚠️ 拉到的是 CloudBase '确认访问'中间页，不是真文档。"
      echo "     原因：默认域名 *.app.tcloudbase.com 浏览器访问会弹中间页，curl 也被挡。"
      echo "     解决：浏览器打开 ${BASE_URL}/nexl-builder.md → 点'确认访问' → 手动复制全文"
      echo "           或直接把仓库 skills/nexl-builder/SKILL.md 发给你的 Coze Agent（内测最稳）。"
      rm -f "${SKILL_DIR}/nexl-builder.md"
    else
      echo "  ✅ 已拉取 nexl-builder.md"
    fi
  else
    echo "  ⚠️ 无法拉取 nexl-builder.md（网络/域名未回填？离线可用，稍后联网补）"
  fi
else
  echo "  ⚠️ 未检测到 curl，跳过远程拉取"
fi

# 2) 写入 tideshell 启动器
cat > "${BIN_DIR}/tideshell" <<'EOF'
#!/usr/bin/env bash
# TideShell CLI —— nexlbase 独立站构建之旅入口
set -euo pipefail
# ↓↓↓ 部署后回填：把 {DEFAULT_DOMAIN} 替换为真实默认域名
BASE_URL="${TIDE_BASE:-https://{DEFAULT_DOMAIN}/tideshell}"
SKILL_DIR="${HOME}/.tideshell/skills"

cmd="${1:-help}"; shift || true
case "$cmd" in
  site)
    sub="${1:-build}"; shift || true
    case "$sub" in
      build)
        echo "🦐 开启你的独立站构建之旅（ask 模式）"
        echo ""
        echo "  内测推荐（最稳）：直接把 skills/nexl-builder/SKILL.md 完整内容复制，"
        echo "  发给你的 Coze Agent，并说："
        echo "  '请按这份 nexl-builder 技能，用 ask 模式带我一步步构建个人官网，"
        echo "   开启我的独立站构建之旅。'"
        echo "  （默认域名有'确认访问'中间页，Agent 自动抓取会被挡；复制粘贴最稳）"
        echo ""
        if [ -n "${COZE_PAT:-}" ]; then
          echo "  检测到 COZE_PAT，可走 CLI 直连（Chat v3 流式建站，待 bridge 接通）。"
        fi
        ;;
      deploy)
        echo "🚀 部署站点并获取域名（调用 Coze 扣子编程·部署，待接入）"
        ;;
      register)
        domain="${1:-}"; [ -z "$domain" ] && { echo "用法: tideshell site register <域名>"; exit 1; }
        echo "📝 将 ${domain} 回写 nexlbase 中台（调用 agent-bridge，待接入）"
        ;;
      *) echo "未知子命令: site $sub （可用: build / deploy / register）"; exit 1 ;;
    esac
    ;;
  help|*)
    echo "TideShell CLI —— nexlbase 独立站构建之旅"
    echo ""
    echo "用法:"
    echo "  tideshell site build      开启独立站构建之旅（ask 模式，推荐复制 SKILL.md 给 Agent）"
    echo "  tideshell site deploy     部署站点并获取域名"
    echo "  tideshell site register <域名>  回写 nexlbase 中台"
    echo ""
    echo "环境变量:"
    echo "  COZE_PAT   你的 Coze Personal Access Token（可选，用于 CLI 直连）"
    echo "  TIDE_BASE  自定义资源源（默认 https://{DEFAULT_DOMAIN}/tideshell）"
    ;;
esac
EOF
chmod +x "${BIN_DIR}/tideshell"

# 3) 加入 PATH（仅当前用户）
SHELL_RC=""
case "${SHELL:-}" in
  *zsh)  SHELL_RC="${HOME}/.zshrc" ;;
  *bash) SHELL_RC="${HOME}/.bashrc" ;;
esac
if [ -n "$SHELL_RC" ] && ! grep -q '.tideshell/bin' "$SHELL_RC" 2>/dev/null; then
  printf '\n# TideShell CLI\nexport PATH="$HOME/.tideshell/bin:$PATH"\n' >> "$SHELL_RC"
  echo "   已写入 PATH 到 ${SHELL_RC}（重开终端或 source 后生效）"
fi

echo ""
echo "✅ 安装完成！"
echo "   运行: tideshell site build   开启你的独立站构建之旅"
echo "   或把 skills/nexl-builder/SKILL.md 全文复制发给你的 Coze Agent（内测最稳）"
echo "   若拉取文档失败：浏览器打开 ${BASE_URL}/nexl-builder.md 点'确认访问'后手动复制。"
