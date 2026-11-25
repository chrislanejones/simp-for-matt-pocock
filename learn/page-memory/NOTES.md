# Working Notes

## Learner context

| Item | What is established |
|---|---|
| Requested topic | "How was the box-harbor persist made" |
| Source | BoxHarbor commit `0675667` (11-25-2026), co-authored with Claude |
| Repo | `~/repo/boxharbor`, private on GitHub |
| Teaching preference | Tables over prose, short rows, bold the key number (dyslexia) |
| Prior knowledge | Not assessed. Chris shipped the feature, so he knows the outcome, maybe not every reason |
| Evidence of understanding | None yet; reading the lesson does not count |

## Teaching decisions

- Lesson 1 teaches the mechanism through BoxHarbor's own code, not toy code.
- The live demo re-implements the helper in vanilla JS so the learner can break the restore gate and see the bug.
- The public page doesn't name the adult catalog page; it's "a second catalog page."
- The `setTimeout(0)` is explained as a deferral past React's `set-state-in-effect` lint rule (`eslint-plugin-react-hooks` 7.1.1 in BoxHarbor), with its one-frame cost.

## Next-session prompts

| Prompt | Why it matters |
|---|---|
| Which BoxHarbor page should remember next? | Turns the recipe into a real change |
| Would `useSyncExternalStore` remove the `setTimeout`? | Checks the read-after-mount reasoning |
| What should happen when a saved list hits 5 MiB? | Probes the quiet-failure trade-off |
