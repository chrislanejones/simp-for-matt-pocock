# Page Memory Resources

Sources checked on **11-25-2026**.

## Knowledge

- [MDN: Window.sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
  Primary source for lifetime rules: survives reloads and restores, new tab means new session, closing the tab clears it. Lists `SecurityError` when storage is blocked.

- [MDN: Storage.setItem()](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)
  `QuotaExceededError` when the store is full. Why `writeSession` wraps everything in `try`.

- [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
  5 MiB of session storage per origin; handle the error with `try...catch`.

- [Next.js: Text content does not match server-rendered HTML](https://nextjs.org/docs/messages/react-hydration-error)
  Browser-only APIs like `localStorage` in render cause hydration errors; use `useEffect`. Why the restore runs after mount.

- [React: set-state-in-effect lint](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect)
  The rule that flags synchronous `setState` in an effect body. Why the restore is deferred with `setTimeout(0)`.

- [web.dev: Keeping things fresh with stale-while-revalidate](https://web.dev/articles/stale-while-revalidate)
  The HTTP version of the release table's "show stale, then refresh" pattern.

## Wisdom (Communities)

Community preferences are unstated. Not needed for lesson 1.
