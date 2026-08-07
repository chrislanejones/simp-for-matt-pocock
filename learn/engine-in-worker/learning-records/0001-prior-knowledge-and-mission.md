# Starting point: knows the worker pieces, not the assembly

Chris states he is familiar with transferables, OffscreenCanvas, and COOP/COEP as concepts
but has never wired them together under a real engine. Evidence supports the claim: he
shipped `codec.worker.ts` + `codecWorkerClient.ts` in Image Horse, and `useEngineCore.ts`
already uses `OffscreenCanvas` for PNG decode. So the gap is integration and architecture,
not vocabulary.

**Implications:** Skip all introductory worker material — what a Worker is, `postMessage`
basics, worker client wrappers. Start at the constraint level. Lessons should assume he can
read and modify existing worker code and should reason about trade-offs rather than
mechanics.

**Mission:** Ship the engine off the main thread in Image Horse — driven by all three of
stroke jank, export/batch UI freezes, and wanting the boundary drawn while `useEngineCore.ts`
is still 741 lines. Outcome is working code, not a written recommendation. See
[[MISSION.md]].
