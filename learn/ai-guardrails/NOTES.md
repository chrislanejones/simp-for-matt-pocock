# Working Notes

## Workspace location

Lives at `~/repo/simp-for-matt-pocock/learn/ai-guardrails/` — a sibling of the
existing `learn/engine-in-worker/` course in the same repo. Chris corrected the
location twice (first "Downloads not home root", then "learn here, not Downloads or
home root") — this repo's `learn/` directory is the standing home for teaching
workspaces going forward. Don't propose Downloads or `~/` for future workspaces.

## Learner preferences (shared across all workspaces — see engine-in-worker/NOTES.md)

- Mild dyslexia. Tables over prose wherever content is comparative or enumerable.
  Lead with the table, interpret underneath in a sentence or two. Bold the cell that
  matters. Short rows, one fact per cell. Several short bullets beat one long
  paragraph. Causal reasoning ("X because Y") stays as prose.
- Wants primary sources cited, not parametric recall.
- Lesson length: 20 minutes. One tangible win per lesson.

## Chris's actual guardrail setup (as of 2026-09-10 — ground lessons in this)

| Mechanism | Current state |
|---|---|
| `~/.claude/settings.json` permission mode | `defaultMode: "auto"` |
| Deny rules | `rm -rf/-fr/-r *`, `rm -f /*`, `rm -f ~*`, `rm -f $*`, `sudo *`, reads/edits of `.env*`, `*.pem`, `*.key`, `~/.ssh/**`, `~/.aws/**` |
| Allow rules | ~188 entries — broad dev-tool allowlist (git, package managers, language toolchains, CLI utilities) |
| Ask rules | none configured |
| `skipDangerousModePermissionPrompt` | `true` |
| Hooks configured | `UserPromptSubmit`, `PostToolUse`, `PostToolUseFailure`, `PreToolUse`, `SessionStart`, `Stop`, `StopFailure`, `SubagentStart`, `SubagentStop`, `TeammateIdle`, `PermissionRequest` (contents not inventoried yet — worth reading before a lesson leans on them) |
| Global CLAUDE.md hard rules | No destructive filesystem commands; git safety (no force-push to main, no rewritten pushed history, no `git clean -fdx`); secrets (never read/edit `.env*`, `~/.ssh/`, `~/.aws/`, `*.pem`, `*.key`); scope (one target per session, `PARKING_LOT.md` for adjacent problems); blocked-action handling (log, try once, stop — never loop); WSL boundary (stay in Linux filesystem, never `/mnt/c/` unless named) |
| Overnight/autonomous convention | Git worktree on a task branch under `~/ai-repo/`, never `~/repo/`; `auto` mode is the default for unattended runs, bypass mode only inside a container |
| Agent roster | Named agents per role (Felix/refactor, Silas/Rust-WASM, Tara/tests+QC, Lacey/design, Dara/ADRs, Scotty/CI+cloud, Vivek/data layer, plus VITA-specific agents) — a form of guardrail via scoped tool grants per agent, not yet framed that way |

**Teaching angle**: Chris already implements several standard mitigations (default-deny
on destructive ops, secrets denylist, scoped/task-branch execution, human review before
push) without the vocabulary for them. Lessons should name what he's already doing
before introducing what's missing — validates existing judgment, doesn't imply the
setup is naive.

## Known gaps in the current setup (candidates for later lessons — verify, don't assume)

- No `ask` rules — everything is either silently allowed or hard-denied. No middle
  tier for "let me glance at this before you do it."
- Sandbox mode (OS-level filesystem/network isolation, distinct from permission
  rules) not confirmed enabled — check `sandbox` config, not just `permissions`.
- Hook bodies not yet read — don't claim they enforce anything specific until verified.
- No stated policy on MCP server trust review before install (`milo-mcp-docker` agent
  exists for this but that's execution, not a policy document).

## Open questions to ask Chris

- Has he read Simon Willison's "lethal trifecta" framing before, or is this new
  vocabulary for existing instinct?
- Which real app should the "ship a guardrail layer" success criterion target —
  ph-office, boxharbor, one of the WordPress sites? Ask before lesson design assumes one.
- Does he want the eventual checklist scoped to solo use, or written for a team to
  adopt (the roster suggests he already works with named collaborators/agents — is
  there a human team too)?
