# Mission: Moving the Image Horse engine into a Web Worker

## Why

Image Horse's engine (`stamp_tool` WASM, driven by `useEngineCore.ts`) runs on the main
thread, so it competes with painting: strokes stutter, and exports and batch runs freeze
the UI outright. Chris wants the engine off the main thread — shipped in
`~/repo/rust-wasm-photo-tool`, not just understood — and wants the boundary drawn now,
while the engine hook is 741 lines rather than 3,000.

## Success looks like

- Can state, without looking it up, what may cross a worker boundary by copy, by move, and by share — and what the current flush path costs in each case.
- Can explain why the engine's zero-copy flush cannot simply be `postMessage`d, and name the mechanism that stops it.
- Can choose between the three viable engine-in-worker architectures for Image Horse and defend the choice against the ones rejected.
- Has cross-origin isolation working on the Netlify deploy, or has ruled it out on evidence.
- Ships a worker-hosted engine in Image Horse with strokes, export, and batch measurably off the main thread.

## Constraints

- Ship-focused: lessons should build toward a migration Chris can actually execute, using Image Horse as the running example rather than toy code.
- Starting point is "knows the pieces, not the assembly" — transferables, OffscreenCanvas and COOP/COEP are familiar as concepts, never wired together under a real engine. Don't re-teach what a Worker is.
- Rust-side changes belong to Silas (`silas-wasm`); lessons should say what the crate needs, not assume Chris hand-writes it.
- Prefers tables over prose (dyslexia) — see [NOTES.md](./NOTES.md).
- Existing precedent to build on, not ignore: `workers/codec.worker.ts` + `lib/codecWorkerClient.ts` already work.

## Out of scope

- Rewriting the engine's image algorithms. This is about where code runs, not what it computes.
- Multi-threading *inside* Rust (rayon / wasm-bindgen-rayon) — that is a later, separate mission and depends on this one landing first.
- GPU/WebGPU compute paths.
- The Convex sync layer and PWA service-worker behaviour, except where cross-origin isolation forces changes.
