# Engine-in-Worker Glossary

Canonical language for this workspace. Terms are promoted here only once Chris has used
them correctly — this is a record of compressed knowledge, not a dictionary to read.

## Threading

**Worker**:
A separate JavaScript realm with its own event loop, addressed only by message passing.
_Avoid_: thread, background thread, web worker (say "worker")

**Main thread**:
The realm that owns the DOM and paints. Anything blocking here is visible to the user.
_Avoid_: UI thread, browser thread

## Terms staged for promotion

Introduced in [Lesson 1](./lessons/0001-what-crosses-the-line.html), not yet promoted —
waiting on evidence Chris can use them correctly (the lesson quiz, or a conversation).

| Term | Working definition |
|---|---|
| Copy | Moving a value across a boundary by structured clone, leaving both sides an independent value |
| Move | Moving a value by detaching it from the sender and reattaching it to the receiver; O(1), sender loses access |
| Share | Exposing one block of memory to two realms at once, so writes in one become visible in the other |
| Detach | Unhooking a buffer's memory from its owning realm. The mechanism transfer is built on, and the thing WASM memory forbids |
| Cross-origin isolation | The `COOP` + `COEP` header state a document must be in before shared memory is permitted |

## Ambiguities resolved

- **"Transfer"** is overloaded in the wider field — it names both the specific detach-and-
  reattach operation and, loosely, any postMessage. In this workspace **Move** always means
  the detach operation, and "send" is the neutral word for putting anything on the wire.
- **"Zero-copy"** in Image Horse's own comments means a view into WASM memory blitted to
  canvas without an intermediate buffer. It does **not** mean zero-copy across a thread
  boundary — those are different claims, and conflating them is the trap Lesson 1 is about.
