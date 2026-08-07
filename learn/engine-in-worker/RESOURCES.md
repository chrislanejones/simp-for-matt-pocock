# Engine-in-Worker Resources

## Knowledge

- [Article: "Is postMessage slow?" — Surma](https://surma.dev/things/is-postmessage-slow/)
  The load-bearing source for this whole mission. Benchmarks structured clone across five
  device/browser combinations and converts the results into budgets. Use for: deciding
  whether a given payload can cross the boundary at all, and the patching/chunking
  escape hatches when it can't. Note it predates cross-origin isolation shipping — its
  SharedArrayBuffer section is out of date, MDN below supersedes it.

- [MDN: Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects)
  The authoritative list of what can actually be transferred, plus the trap that typed
  arrays are serializable but *not* transferable — only their `.buffer` is. Use for:
  checking whether a specific type can move rather than copy.

- [Spec issue: postMessage, WebAssembly.Memory, and undetachable ArrayBuffers — whatwg/html #4601](https://github.com/whatwg/html/issues/4601)
  Primary source for the single most important constraint in this mission: WASM linear
  memory sets `[[ArrayBufferDetachKey]]`, so it cannot be detached and therefore cannot be
  transferred. Firefox and Safari throw; Chrome has silently copied instead since 2014.
  Use for: explaining why the zero-copy flush can't just be posted across.

- [MDN: SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
  Current status of the shared-memory path. Baseline widely available since Dec 2021, but
  gated behind secure context + cross-origin isolation, and **unsupported in Android
  WebView**. Also documents `WebAssembly.Memory({shared: true})`. Use for: the shared-memory
  architecture and its deployment cost.

- [MDN: Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy) and [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy)
  The two headers that buy cross-origin isolation, and what they break (third-party
  embeds, images, fonts). Use for: the Netlify header work and its blast radius.

- [MDN: OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
  The transfer-the-canvas-to-the-worker path. Already used inside `useEngineCore.ts` for
  PNG decode, but not yet for the render surface. Use for: the architecture where the
  canvas moves to the worker instead of the pixels moving back.

## Wisdom (Communities)

- [Rust and WebAssembly Discord / rustwasm](https://discord.gg/rust-lang) — `#wasm` channel
  Where wasm-bindgen and worker-threading questions get answered by people who ship it.
  Use for: crate-side questions once the architecture is chosen.

- [r/rust_gamedev](https://reddit.com/r/rust_gamedev) and [r/webdev](https://reddit.com/r/webdev)
  Lower signal than the above, but the place real-world "we tried SAB in production and
  here's what broke" reports show up. Use for: deployment reality checks on cross-origin
  isolation.

_Community preference not yet stated — ask before leaning on these._

## Gaps

Nothing found yet, actively needed:

- A credible write-up of **canvas-in-worker for an interactive paint tool** specifically —
  most OffscreenCanvas material is about animation loops and games, not pointer-driven
  brush strokes where input latency is the whole product.
- Real numbers on **`transferControlToOffscreen` + pointer event round-trip latency**. The
  budgets in Surma's piece cover payload size, not input-to-photon.
- Anything solid on **cross-origin isolation on Netlify** with a PWA service worker in play.
