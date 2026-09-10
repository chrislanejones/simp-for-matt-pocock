# Starting point: practises guardrails by instinct, no shared vocabulary

Chris's global `~/.claude/CLAUDE.md` already encodes several standard agent-safety
mitigations — default-deny on destructive filesystem ops, a secrets denylist, scoped
overnight runs on task branches, human review before any force-push — written from
experience rather than from a named framework. He does not yet have the field's
vocabulary for what these are examples of (least privilege, human-in-the-loop for
irreversible actions, the "lethal trifecta" shape of risk).

**Implications:** Lessons should open by naming what he already does correctly before
introducing gaps. Don't re-explain *why* deleting things is bad — he's lived that.
Spend the budget on the parts that are genuinely missing or unverified: no `ask` tier
in permissions, sandbox mode not confirmed enabled, hook contents not yet inventoried
by either of us.

**Mission:** Coding-agent guardrails specifically (not app-embedded LLM guardrails, not
VITA governance policy — those were offered and declined). Four success criteria, all
selected: trust an unattended run, produce a team-shareable checklist, ship a guardrail
layer in one real app, and be able to explain the landscape unscripted. See
[[MISSION.md]].
