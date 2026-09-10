# Mission: Guardrails for AI Coding Agents

## Why

Chris runs Claude Code across a dozen-plus projects, including unattended overnight
runs on task branches in dedicated worktrees. The global `~/.claude/CLAUDE.md` already
encodes hard rules (no destructive filesystem commands, git safety, secrets, scope,
blocked-action handling) written from instinct and hard-won experience, not from a
named threat model. Chris wants to know *why* those rules are the right shape, what
the field calls the failure modes they prevent, and what's still missing — so the
guardrails can be explained, defended, and handed to a team rather than just followed.

## Success looks like

- Can trust an unattended overnight agent run and explain, with named mechanisms, why
  it's safe to sleep through.
- Has a written guardrail checklist that could be handed to a teammate or a new
  project and adopted without Chris in the room.
- Has shipped a guardrail layer in one real app (not just the coding-agent tooling) —
  input/output protection around an LLM feature.
- Can explain the landscape on the spot: name the failure modes, the standard
  mitigations, and defend a specific guardrail choice under questioning.

## Constraints

- 20-minute lessons. One tangible win each.
- Ground everything in Chris's actual setup — `~/.claude/settings.json`,
  `~/.claude/CLAUDE.md`, the agent roster, hooks — rather than generic examples.
  See [NOTES.md](./NOTES.md) for the current state of that config.
- Tables over prose (dyslexia) — comparative/enumerable material must be gridded.
- Knowledge should cite primary sources: vendor docs, named researchers (Simon
  Willison), OWASP, NIST, and documented incidents — not parametric recall.

## Out of scope

- General AI safety / alignment theory. This is operational: what stops an agent
  from doing damage on your machine or in your product, not whether AI is "safe"
  in the abstract.
- VITA-specific AI governance/procurement policy — that's a distinct mission if it
  comes up later; don't conflate personal tooling guardrails with state-agency policy.
- Building a full moderation/eval pipeline for a production LLM product — covered only
  as far as the "ship a guardrail layer" success criterion needs.
