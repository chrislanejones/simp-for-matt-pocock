---
name: adr-best-use-cases
description: Teach when Architecture Decision Records are useful, when a lighter note is enough, and how to capture decision tradeoffs. Use for ADR Best Use Cases lessons or practice classifying real engineering decisions.
---

# ADR Best Use Cases

Teach the learner to decide what deserves an ADR and write a useful record for a real decision. This is a teaching workflow, not an instruction to automatically document every code change.

## Start from a real decision

Use `learn/adr-best-use-cases/` in the current teaching repository. Read existing mission, notes, resources, learning records, and assets before continuing. If there is no mission, ask what project or decision the learner wants this skill to help with, and what experience they already have with ADRs. Do not invent their experience or record mastery from merely reading a lesson.

Use the existing `teach` skill when available (currently `/home/clj/.agents/skills/teach/SKILL.md`). The workflow below is sufficient if it is unavailable.

## Teach the judgment

Have the learner classify concrete decisions and explain the reason before revealing feedback. Compare:

| Candidate | Judgment to practice |
|---|---|
| Worker boundary, service split, or data ownership | Does the decision change responsibilities or impose enduring constraints? |
| Database, dependency, or persistence format | Which compatibility, migration, and operational tradeoffs will future maintainers need? |
| Deliberate exception to an established pattern | Why does this case justify the exception, and when should it be revisited? |
| Replacing a previously accepted decision | What new evidence changed the tradeoff, and which record is superseded? |
| Routine fix, copy edit, or mechanical refactor | Would a PR explanation preserve enough context? |

These are teaching prompts, not universal mandates. Cost to reverse, architectural significance, recurring disagreement, and the value of preserving rationale matter more than change size. Distinguish a proposal from an accepted decision and a decision record from a design specification or task list.

## Ground the lesson

Read primary sources before making factual claims. Start with Michael Nygard's “Documenting Architecture Decisions” and the ADR GitHub organization's documentation; verify the actual pages and cite them in the lesson. Read the target project's ADR conventions when supplied. Explain which rules come from that project rather than presenting local numbering, acceptance authority, or length limits as universal ADR standards.

## Produce one small lesson

After establishing the mission, save `MISSION.md`, `NOTES.md`, and annotated `RESOURCES.md` in the track. Create one numbered HTML lesson and a short reference sheet. Reuse existing styles and quiz components where suitable. Use tables for comparisons, short explanations for causal reasoning, and one tangible exercise tied to the learner's project.

The first lesson should ask the learner to classify several decisions, then draft one record containing context, status, decision, consequences (including costs), and alternatives. Give immediate explanatory feedback on classification questions. Keep suggested answers hidden until an attempt. End with a transfer question using a different decision and invite follow-up questions.

Record demonstrated insights only after the learner responds. On later sessions, start with brief recall and apply the same judgment to a new case. Preserve accepted decision history; exercises remain clearly labeled drafts and must not silently become accepted project ADRs.
