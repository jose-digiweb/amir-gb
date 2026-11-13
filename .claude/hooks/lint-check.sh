#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): check the edited file with Oxfmt and Oxlint.
# On failure, exit 2 so the diagnostics go back to Claude to fix.
set -uo pipefail

# Read the hook payload from stdin.
input="$(cat)"

# Extract the edited file path.
file="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')"

# Nothing to check.
if [[ -z "$file" ]]; then
  exit 0
fi

# Only check source files.
case "$file" in
  *.ts | *.mts | *.js | *.mjs | *.astro | *.vue) ;;
  *) exit 0 ;;
esac

# Skip files that no longer exist (for example just deleted).
if [[ ! -f "$file" ]]; then
  exit 0
fi

# Resolve the site root (Claude Code provides CLAUDE_PROJECT_DIR for hooks).
root="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

# Skip files outside the site.
case "$file" in
  "$root"/*) ;;
  *) exit 0 ;;
esac

# Check formatting, then lint, with the site's own configs.
fmt="$(cd "$root" && node_modules/.bin/oxfmt --check "$file" 2>&1)"
fmt_status=$?
lint="$(cd "$root" && node_modules/.bin/oxlint "$file" 2>&1)"
lint_status=$?

# Surface any issues to Claude via stderr and exit 2.
if [[ $fmt_status -ne 0 || $lint_status -ne 0 ]]; then
  {
    printf 'Oxfmt or Oxlint reported issues in %s:\n\n' "$file"
    if [[ $fmt_status -ne 0 ]]; then
      printf '%s\n\nFormat it: pnpm exec oxfmt "%s"\n\n' "$fmt" "$file"
    fi
    if [[ $lint_status -ne 0 ]]; then
      printf '%s\n\nFix the lint errors; never suppress them.\n' "$lint"
    fi
  } >&2
  exit 2
fi
exit 0
