/* Live page-memory demo. A vanilla copy of BoxHarbor's session-cache helper
 * driving a tiny "browse" panel, so a learner can reload, open a new tab, and
 * switch the restore gate off to watch the bug it prevents.
 *
 * Markup: #memory-demo containing select#demo-genre, .demo-pages buttons
 * [data-page], #demo-gate (checkbox), #demo-status, #demo-reload,
 * #demo-clear. Everything lives in this tab's sessionStorage.
 */
(function () {
  "use strict";

  var PREFIX = "learn:page-memory:";
  var HOUR = 60 * 60 * 1000;

  // Same contract as src/lib/session-cache.ts: an { at, value } envelope,
  // age checked on read, and every failure means "not saved".
  function readSession(key, maxAgeMs) {
    try {
      var raw = sessionStorage.getItem(PREFIX + key);
      if (!raw) return null;
      var saved = JSON.parse(raw);
      if (!saved || typeof saved.at !== "number" || saved.value === undefined) return null;
      if (Date.now() - saved.at > maxAgeMs) return null;
      return saved;
    } catch (e) {
      return null;
    }
  }

  function writeSession(key, value) {
    try {
      sessionStorage.setItem(PREFIX + key, JSON.stringify({ at: Date.now(), value: value }));
    } catch (e) {
      // Storage full or blocked: the next visit starts fresh.
    }
  }

  function checkedAgo(at) {
    var min = Math.round((Date.now() - at) / 60000);
    if (min < 1) return "just now";
    if (min < 60) return min + " min ago";
    return Math.round(min / 60) + " hr ago";
  }

  function boot() {
    var root = document.getElementById("memory-demo");
    if (!root) return;
    var genre = root.querySelector("#demo-genre");
    var pages = Array.prototype.slice.call(root.querySelectorAll(".demo-pages button"));
    var gate = root.querySelector("#demo-gate");
    var status = root.querySelector("#demo-status");
    var reload = root.querySelector("#demo-reload");
    var clear = root.querySelector("#demo-clear");
    if (!genre || !gate || !status) return;
    status.setAttribute("aria-live", "polite");

    var DEFAULTS = { genre: "All genres", page: 1 };
    var state = { genre: DEFAULTS.genre, page: DEFAULTS.page };
    var restored = false;

    function paint() {
      genre.value = state.genre;
      pages.forEach(function (b) {
        var on = Number(b.dataset.page) === state.page;
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    function save() {
      // The gate: nothing is written until the restore has run.
      if (restored) writeSession("demo", state);
    }

    // The gate setting itself survives reloads, so the bug can be replayed.
    var gateSaved = readSession("gate", 24 * HOUR);
    gate.checked = gateSaved ? gateSaved.value !== false : true;

    if (!gate.checked) {
      // What happens without the gate: the first render's defaults are saved
      // before the restore reads, so the restore finds the defaults.
      writeSession("demo", DEFAULTS);
    }

    // Read after "mount", deferred a tick like the BoxHarbor effects.
    setTimeout(function () {
      var saved = readSession("demo", 6 * HOUR);
      if (saved) {
        state = { genre: saved.value.genre, page: saved.value.page };
        var isDefault = state.genre === DEFAULTS.genre && state.page === DEFAULTS.page;
        status.textContent = gate.checked
          ? "Restored " + state.genre + ", page " + state.page + " · saved " + checkedAgo(saved.at) + "."
          : (isDefault
            ? "Gate off: the defaults were saved before the restore ran, so your choice is gone."
            : "Restored " + state.genre + ", page " + state.page + ".");
      } else {
        status.textContent = "Nothing saved in this tab yet: starting fresh.";
      }
      restored = true;
      paint();
    }, 0);

    genre.addEventListener("change", function () {
      state.genre = genre.value;
      state.page = 1;
      paint();
      save();
      status.textContent = "Saved " + state.genre + ", page 1. Now reload.";
    });
    pages.forEach(function (b) {
      b.addEventListener("click", function () {
        state.page = Number(b.dataset.page);
        paint();
        save();
        status.textContent = "Saved " + state.genre + ", page " + state.page + ". Now reload.";
      });
    });
    gate.addEventListener("change", function () {
      writeSession("gate", gate.checked);
      status.textContent = gate.checked
        ? "Restore gate on. Pick a page, then reload."
        : "Restore gate off. Pick a genre and page, then reload and watch.";
    });
    if (reload) reload.addEventListener("click", function () { location.reload(); });
    if (clear) clear.addEventListener("click", function () {
      try { sessionStorage.removeItem(PREFIX + "demo"); } catch (e) { /* blocked */ }
      state = { genre: DEFAULTS.genre, page: DEFAULTS.page };
      paint();
      status.textContent = "Cleared. This tab now starts fresh.";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
