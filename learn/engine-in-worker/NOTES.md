# Working Notes

## How Chris wants to be taught

- **Tables over prose.** Mild dyslexia — comparative, numeric, or enumerable material must
  be a table, not a paragraph. Lead with the table, interpret underneath in a sentence or
  two. Keep causal reasoning ("X happens because Y") as prose; it doesn't fit a grid.
- **Bold the number that matters** so it's findable without scanning.
- Short rows, one fact per cell.
- Prefers several short bullets to one long paragraph.

## Context that shapes lessons

| Thing | Value |
|---|---|
| Project | Image Horse — `~/repo/rust-wasm-photo-tool` |
| Crate | `stamp_tool` v0.2.0 |
| Engine hook | `app/src/hooks/useEngineCore.ts` (741 lines) |
| Worker precedent | `app/src/workers/codec.worker.ts` + `app/src/lib/codecWorkerClient.ts` |
| Shell | `app/src/app/AppShell.tsx` (3,474 lines — tools are mid-migration to a registry) |
| Deploy | Netlify (`netlify.toml`) |
| Rust owner | Silas (`silas-wasm` agent) — lessons specify crate needs, don't assume Chris writes them |

## Teaching decisions made

- Skipped "what is a Worker" entirely — he wrote the codec worker.
- Lesson 1 leads with the WASM-memory-is-undetachable constraint because it invalidates the
  obvious plan, and discovering it early is worth more than a gentle ramp.
- Using his real payload shapes in exercises rather than invented ones.

## Open questions to ask him

- Does the PWA service worker currently do anything that COEP would break?
- Is Android WebView a target? SharedArrayBuffer has **no support** there, which would kill
  the shared-memory architecture outright if it matters.
- Has he measured the jank yet, or is it felt-but-unmeasured? Changes whether lesson 3 is
  "how to measure" or "how to fix".
