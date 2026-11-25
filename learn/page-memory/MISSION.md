# Mission: Page Memory (BoxHarbor)

## Why

Understand how BoxHarbor makes pages keep what they showed when you come back
(commit `0675667`, `src/lib/session-cache.ts`), well enough to add the same
memory to another page, or another app, without re-creating its bugs.

This is the working interpretation of Chris's request, "how was the
box-harbor persist made," on 11-25-2026. Confirm or revise it next session.

## Success looks like

- Name the four moves (store per tab, stamp and expire on read, read after mount, gate the save) and the bug each prevents.
- Predict what a page shows after Back, reload, a new tab, or blocked storage.
- Pick the right pattern (snapshot, show stale then refresh, restore and refresh on demand) for a new page.
- Add page memory to one more page using the recipe in the reference sheet.

## Constraints

- One short lesson, about **20 minutes**, with a live demo and quizzes.
- Tables for comparisons; short prose for causal reasoning (see [NOTES.md](./NOTES.md)).
- BoxHarbor is a private repo: quote code on the public page, don't link to it.

## Out of scope

- Server-side persistence (BoxHarbor's SQLite users, sessions and library).
- Replacing the helper with a library such as a query cache.
- Changing BoxHarbor code from this teaching repo.
