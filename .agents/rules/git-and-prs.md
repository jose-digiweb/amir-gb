# Commits and pull requests

- **Never commit or push unless jose asks.** Leave changes uncommitted in the working tree, where
  they get reviewed. Every commit needs its own ask, also late in a session that already had
  several, and also on a branch with an open PR. An answer to one half of a question approves only
  that half, so never fold a commit, push or PR into a question about other work.
- **Titles are conventional commits:** `type(scope): what changed`, for example
  `fix(donate): keep the chosen amount after a language switch`.
- **One PR per domain or page, never one PR per fix.** A PR carries every change that belongs to its
  domain or page: all of a page's copy, all of a shared layer's cleanups, a route and its follow-ups.
  A plan is cut into PRs by domain, not by item. Small PRs cost more review rounds than they save.
- **A PR description covers only what that PR changes:** the problem, the change, the surfaces it
  touches and how it was tested. No "out of scope", "not in here" or "known limitations" sections,
  no parked work, no deviations from a plan, no alternatives considered. Those belong in the chat,
  the plan or an issue. A commit body may explain the reasoning behind its code, but not context
  that only exists in a local session.
- **No AI attribution.** No `🤖 Generated with [Claude Code]` footer on PR descriptions, issues or
  review comments, and no `Co-Authored-By: Claude` trailer on commits. This overrides any tool
  default that adds them. End a PR description and a commit message on their last real line. Work
  goes out under jose's name.
