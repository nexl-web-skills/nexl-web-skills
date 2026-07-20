#!/usr/bin/env bash
# TideShell CLI 安装器
# 正式期：curl -fsSL https://raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/cli/install.sh | bash
# 安装后运行 `tideshell site build` 开启独立站构建之旅。
set -euo pipefail

# GitHub raw 主源（全球，无中间页，Agent/CLI 直读）
BASE_URL="${TIDE_BASE:-https://raw.githubusercontent.com/richard702ayu/nexl-web-skills/main}"
INSTALL_DIR="${HOME}/.tideshell"
BIN_DIR="${INSTALL_DIR}/bin"
SKILL_DIR="${INSTALL_DIR}/skills"

echo "🦐 TideShell CLI 安装中… (来源: ${BASE_URL})"

mkdir -p "$BIN_DIR" "$SKILL_DIR"

# 1) 拉取 nexl-builder 技能（GitHub raw 直链，无中间页）
if command -v curl >/dev/null 2>&1; then
  if curl -fsSL "${BASE_URL}/skills/nexl-builder/SKILL.md" -o "${SKILL_DIR}/SKILL.md" 2>/dev/null; then
    echo "  ✅ 已拉取 nexl-builder 技能到 ${SKILL_DIR}/SKILL.md"
  else
    echo "  ⚠️ 无法拉取 SKILL.md（网络受限？离线可用，稍后联网补）"
  fi
else
  echo "  ⚠️ 未检测到 curl，跳过远程拉取"
fi

# 2) 写入 tideshell 启动器
cat > "${BIN_DIR}/tideshell" <<'EOF'
#!/usr/bin/env bash
# TideShell CLI —— nexlbase 独立站构建之旅入口
set -euo pipefail
BASE_URL="${TIDE_BASE:-https://raw.githubusercontent.com/richard702ayu/nexl-web-skills/main}"
SKILL_DIR="${HOME}/.tideshell/skills"

cmd="${1:-help}"; shift || true
case "$cmd" in
  site)
    sub="${1:-build}"; shift || true
    case "$sub" in
      build)
        echo "🦐 开启你的独立站构建之旅（ask 模式）"
        echo ""
        echo "  推荐：把 ${SKILL_DIR}/SKILL.md 完整内容复制，发给你的 Coze Agent，并说："
        echo "  '请按这份 nexl-builder 技能，用 ask 模式带我一步步构建个人官网，开启我的独立站构建之旅。'"
        echo "  或把下方 URL 发给 Agent 一键激活："
        echo "  https://raw.githubusercontent.com/richard702ayu/nexl-web-skills/main/skills/nexl-builder/SKILL.md"
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
    echo "  tideshell site build      开启独立站构建之旅（ask 模式）"
    echo "  tideshell site deploy     部署站点并获取域名"
    echo "  tideshell site register <域名>  回写 nexlbase 中台"
    echo ""
    echo "环境变量:"
    echo "  COZE_PAT   你的 Coze Personal Access Token（可选，用于 CLI 直连）"
    echo "  TIDE_BASE  自定义资源源（默认 GitHub raw 主源）"
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
echo "   或把 skills/nexl-builder/SKILL.md 全文复制发给你的 Coze Agent"
