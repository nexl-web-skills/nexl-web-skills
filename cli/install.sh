#!/usr/bin/env bash
# TideShell CLI installer
# curl -fsSL https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/cli/install.sh | bash
set -euo pipefail

BASE_URL="${TIDE_BASE:-https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main}"
INSTALL_DIR="${HOME}/.tideshell"
BIN_DIR="${INSTALL_DIR}/bin"
SKILL_DIR="${INSTALL_DIR}/skills"

echo "TideShell CLI installing from ${BASE_URL}"

mkdir -p "$BIN_DIR" "$SKILL_DIR"

if command -v curl >/dev/null 2>&1; then
  if curl -fsSL "${BASE_URL}/skills/nexl-builder/SKILL.md" -o "${SKILL_DIR}/SKILL.md" 2>/dev/null; then
    echo "  fetched nexl-builder -> ${SKILL_DIR}/SKILL.md"
  else
    echo "  SKILL.md fetch failed (offline? fetch later); install continues"
  fi
else
  echo "  curl not found; skipping remote fetch"
fi

cat > "${BIN_DIR}/tideshell" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${TIDE_BASE:-https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main}"
SKILL_DIR="${HOME}/.tideshell/skills"

cmd="${1:-help}"; shift || true
case "$cmd" in
  site)
    sub="${1:-build}"; shift || true
    case "$sub" in
      build)
        echo "TideShell site build — ask-mode flow"
        echo ""
        echo "  Copy ${SKILL_DIR}/SKILL.md into your Coze / Claude / Codex agent, then say:"
        echo "  'activate nexl-builder and build my brand site in ask mode.'"
        echo "  Or send the agent this URL:"
        echo "  https://raw.githubusercontent.com/nexl-web-skills/nexl-web-skills/main/skills/nexl-builder/SKILL.md"
        ;;
      deploy)
        echo "site deploy — acquire domain via Coze (not wired yet)"
        ;;
      register)
        domain="${1:-}"; [ -z "$domain" ] && { echo "usage: tideshell site register <domain>"; exit 1; }
        echo "register ${domain} to nexlbase (agent-bridge, not wired yet)"
        ;;
      *) echo "unknown: site $sub (build / deploy / register)"; exit 1 ;;
    esac
    ;;
  help|*)
    echo "TideShell CLI"
    echo ""
    echo "  tideshell site build              ask-mode brand-site build"
    echo "  tideshell site deploy             deploy and acquire domain"
    echo "  tideshell site register <domain>  register to nexlbase"
    echo ""
    echo "env:"
    echo "  COZE_PAT    optional Coze PAT for direct CLI calls"
    echo "  TIDE_BASE   override resource source (default GitHub raw)"
    ;;
esac
EOF
chmod +x "${BIN_DIR}/tideshell"

SHELL_RC=""
case "${SHELL:-}" in
  *zsh)  SHELL_RC="${HOME}/.zshrc" ;;
  *bash) SHELL_RC="${HOME}/.bashrc" ;;
esac
if [ -n "$SHELL_RC" ] && ! grep -q '.tideshell/bin' "$SHELL_RC" 2>/dev/null; then
  printf '\n# TideShell CLI\nexport PATH="$HOME/.tideshell/bin:$PATH"\n' >> "$SHELL_RC"
  echo "  PATH written to ${SHELL_RC}; restart shell or source it"
fi

echo ""
echo "install complete"
echo "  run: tideshell site build"
echo "  or paste skills/nexl-builder/SKILL.md into your agent"
