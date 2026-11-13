#!/usr/bin/env bash
# PreToolUse (Edit|Write|MultiEdit): print the checklist from AGENTS.md once per agent,
# just before its first edit. Non-blocking.
set -uo pipefail

# Read the hook payload from stdin.
input="$(cat)"

# Key on transcript_path so the main agent and each subagent are reminded once each.
key="$(printf '%s' "$input" | jq -r '.transcript_path // .session_id // empty')"

# Hash the key into a stable, filesystem-safe marker name.
hash="$(printf '%s' "$key" | shasum | cut -d' ' -f1)"
marker="${TMPDIR:-/tmp}/amir-standards-reminded-${hash}"

# Stay silent if this agent has already been reminded.
if [[ -f "$marker" ]]; then
  exit 0
fi

# Record that this agent has now been reminded.
: >"$marker"

# Read the checklist from AGENTS.md, its one source.
agents_md="$(dirname "$0")/../../AGENTS.md"
checklist="$(sed -n '/<!-- BEGIN:checklist -->/,/<!-- END:checklist -->/{//!p;}' "$agents_md")"

# Stay silent if the checklist cannot be read.
if [[ -z "$checklist" ]]; then
  exit 0
fi

# Emit the checklist as non-blocking additional context.
jq -n --arg checklist "$checklist" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    additionalContext: ("AMIR-GB CODE STANDARDS (full rules in AGENTS.md, CLAUDE.md and .agents/rules/): apply before writing code:\n" + $checklist)
  }
}'
