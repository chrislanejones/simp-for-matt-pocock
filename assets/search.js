/* Ctrl+K / Cmd+K search, drawn as an ASCII box.
 *
 * One script tag per page: <script src="…/assets/search.js" defer></script>.
 * It loads its own stylesheet, works out the site root from its own URL, and
 * adds a small [ctrl+k] trigger unless the page has [data-search-open].
 * Also opens on "/" when you're not typing in a field.
 *
 * To add a page, add an entry to PAGES (paths are from the site root).
 */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;
  var ROOT = new URL("../", script.src);

  var PAGES = [
    { t: "Home: /teach", k: "home", u: "index.html", w: "landing index start matt pocock simp" },

    { t: "Pages that remember", k: "lesson", g: "Page Memory", u: "learn/page-memory/lessons/0001-pages-that-remember.html", w: "boxharbor sessionStorage persist cache back button restore react useEffect hydration" },
    { t: "Page memory with sessionStorage", k: "reference", g: "Page Memory", u: "learn/page-memory/reference/session-cache.html", w: "boxharbor recipe readSession writeSession checkedAgo api" },
    { t: "The problem: Back threw your work away", k: "section", g: "Page Memory", u: "learn/page-memory/lessons/0001-pages-that-remember.html#problem", w: "unmount state lost" },
    { t: "The helper: 42 lines", k: "section", g: "Page Memory", u: "learn/page-memory/lessons/0001-pages-that-remember.html#helper", w: "session-cache.ts envelope prefix try catch" },
    { t: "Try it live: restore gate demo", k: "section", g: "Page Memory", u: "learn/page-memory/lessons/0001-pages-that-remember.html#demo", w: "demo reload new tab" },
    { t: "The four moves", k: "section", g: "Page Memory", u: "learn/page-memory/lessons/0001-pages-that-remember.html#moves", w: "per tab expire mount gate setTimeout lint set-state-in-effect" },
    { t: "Three ways to use one helper", k: "section", g: "Page Memory", u: "learn/page-memory/lessons/0001-pages-that-remember.html#patterns", w: "stale-while-revalidate snapshot refresh on demand" },
    { t: "What to keep an eye on", k: "section", g: "Page Memory", u: "learn/page-memory/lessons/0001-pages-that-remember.html#watch", w: "quota 5 MiB json limits" },

    { t: "When an ADR earns its place", k: "lesson", g: "ADR Best Use Cases", u: "learn/adr-best-use-cases/lessons/0001-when-an-adr-earns-its-place.html", w: "architecture decision record nygard pr" },
    { t: "ADR or PR?", k: "reference", g: "ADR Best Use Cases", u: "learn/adr-best-use-cases/reference/adr-or-pr.html", w: "architecture decision record template status" },
    { t: "Classify the decision", k: "section", g: "ADR Best Use Cases", u: "learn/adr-best-use-cases/lessons/0001-when-an-adr-earns-its-place.html#practice", w: "quiz" },
    { t: "Write the reason, including the cost", k: "section", g: "ADR Best Use Cases", u: "learn/adr-best-use-cases/lessons/0001-when-an-adr-earns-its-place.html#draft", w: "draft exercise download" },
    { t: "A compact ADR template", k: "section", g: "ADR Best Use Cases", u: "learn/adr-best-use-cases/reference/adr-or-pr.html#template", w: "context decision consequences" },

    { t: "What crosses the line?", k: "lesson", g: "Engine in a Worker", u: "learn/engine-in-worker/lessons/0001-what-crosses-the-line.html", w: "web worker postMessage transferable structured clone wasm image horse" },
    { t: "Crossing the worker boundary", k: "reference", g: "Engine in a Worker", u: "learn/engine-in-worker/reference/boundary-crossing.html", w: "transferable SharedArrayBuffer coop coep OffscreenCanvas wasm memory" },

    { t: "The lethal trifecta", k: "lesson", g: "AI Guardrails", u: "learn/ai-guardrails/lessons/0001-lethal-trifecta.html", w: "prompt injection private data untrusted content exfiltration claude permissions" },
    { t: "Guardrail mechanics", k: "reference", g: "AI Guardrails", u: "learn/ai-guardrails/reference/guardrail-mechanics.html", w: "permission modes deny rules hooks settings" }
  ];

  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = new URL("assets/search.css", ROOT).href;
  document.head.appendChild(css);

  function lower(s) { return (s || "").toLowerCase(); }

  function score(p, terms) {
    if (!terms.length) return p.k === "section" ? -1 : 1;
    var title = lower(p.t);
    var hay = title + " " + lower(p.g) + " " + lower(p.k) + " " + lower(p.w);
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      if (hay.indexOf(term) === -1) return -1;
      if (title.indexOf(term) === 0) total += 6;
      else if (title.indexOf(" " + term) !== -1) total += 4;
      else if (title.indexOf(term) !== -1) total += 3;
      else total += 1;
    }
    if (p.k === "lesson") total += 0.5;
    return total;
  }

  function pad(s, n) {
    s = s || "";
    if (s.length > n) return s.slice(0, Math.max(0, n - 3)) + "...";
    return s + new Array(n - s.length + 1).join(" ");
  }
  function repeat(ch, n) { return new Array(Math.max(0, n) + 1).join(ch); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function art(text) { var s = el("span", "sk-art", text); s.setAttribute("aria-hidden", "true"); return s; }

  var dialog, input, list, status, cols, results = [], active = 0, lastFocus = null;

  function columns() {
    var probe = el("span", "sk-probe", "0000000000");
    dialog.appendChild(probe);
    var ch = probe.getBoundingClientRect().width / 10 || 8.4;
    probe.remove();
    var avail = Math.min(window.innerWidth - 24, 720);
    return Math.max(34, Math.min(72, Math.floor(avail / ch)));
  }

  function build() {
    dialog = el("dialog", "sk");
    dialog.setAttribute("aria-label", "Search the site");

    var box = el("div", "sk-box");
    var top = el("div", "sk-line");
    top.appendChild(art(""));
    box.appendChild(top);

    var prompt = el("div", "sk-line sk-prompt");
    prompt.appendChild(art("| > "));
    input = el("input", "sk-input");
    input.type = "text";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", "sk-list");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-label", "Search lessons and references");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("spellcheck", "false");
    input.placeholder = "search lessons, references, sections";
    prompt.appendChild(input);
    prompt.appendChild(art(" |"));
    box.appendChild(prompt);

    box.appendChild(el("div", "sk-line sk-rule"));
    list = el("div", "sk-list");
    list.id = "sk-list";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", "Results");
    box.appendChild(list);
    box.appendChild(el("div", "sk-line sk-rule2"));
    status = el("div", "sk-line sk-status");
    status.setAttribute("aria-live", "polite");
    box.appendChild(status);
    box.appendChild(el("div", "sk-line sk-bottom"));
    dialog.appendChild(box);

    dialog.addEventListener("click", function (e) { if (e.target === dialog) close(); });
    dialog.addEventListener("close", function () {
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    input.addEventListener("input", function () { active = 0; render(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        var r = results[active];
        if (r) go(r, e.ctrlKey || e.metaKey);
      }
    });
    document.body.appendChild(dialog);
  }

  function frame() {
    cols = columns();
    var inner = cols - 2;
    var title = "[ /search ]";
    var hint = "[ ctrl+k ]";
    dialog.querySelector(".sk-box").style.width = cols + "ch";
    dialog.querySelector(".sk-line .sk-art").textContent =
      "+-" + title + repeat("-", inner - title.length - hint.length - 2) + hint + "-+";
    input.style.width = (cols - 6) + "ch";
    dialog.querySelector(".sk-rule").textContent = "+" + repeat("-", inner) + "+";
    dialog.querySelector(".sk-rule2").textContent = "+" + repeat("-", inner) + "+";
    dialog.querySelector(".sk-bottom").textContent = "+" + repeat("=", inner) + "+";
  }

  function render() {
    var terms = lower(input.value).split(/\s+/).filter(Boolean);
    results = PAGES.map(function (p, i) { return { p: p, s: score(p, terms), i: i }; })
      .filter(function (r) { return r.s >= 0; })
      .sort(function (a, b) { return b.s - a.s || a.i - b.i; })
      .slice(0, 9)
      .map(function (r) { return r.p; });
    if (active >= results.length) active = Math.max(0, results.length - 1);

    list.textContent = "";
    var inner = cols - 2;
    var kindW = 11;
    var titleW = inner - 4 - kindW;
    if (!results.length) {
      var none = el("div", "sk-line sk-empty");
      none.appendChild(art("|"));
      none.appendChild(el("span", "", pad("  no matches. try fewer words.", inner)));
      none.appendChild(art("|"));
      list.appendChild(none);
    }
    results.forEach(function (p, i) {
      var a = el("a", "sk-line sk-opt");
      a.href = new URL(p.u, ROOT).href;
      a.id = "sk-opt-" + i;
      a.setAttribute("role", "option");
      a.setAttribute("aria-selected", i === active ? "true" : "false");
      a.tabIndex = -1;
      a.appendChild(art("|"));
      a.appendChild(art(i === active ? " > " : "   "));
      var label = p.k === "section" ? "  " + p.t : p.t;
      a.appendChild(el("span", "sk-title", pad(label, titleW)));
      a.appendChild(el("span", "sk-kind", pad(" " + p.k, kindW)));
      a.appendChild(art(" |"));
      a.setAttribute("aria-label", p.t + ", " + p.k + (p.g ? ", " + p.g : ""));
      a.addEventListener("mousemove", function () { if (active !== i) { active = i; paintActive(); } });
      a.addEventListener("click", function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        go(p, false);
      });
      list.appendChild(a);
    });
    var track = results[active] && results[active].g ? results[active].g : "";
    var msg = results.length + (results.length === 1 ? " result" : " results") + (track ? " · " + track : "");
    var keys = "up/down  enter  esc";
    status.textContent = "";
    status.appendChild(art("| "));
    status.appendChild(el("span", "", pad(msg, inner - 2 - keys.length)));
    status.appendChild(art(keys + " |"));
    input.setAttribute("aria-activedescendant", results.length ? "sk-opt-" + active : "");
  }

  function paintActive() {
    Array.prototype.forEach.call(list.querySelectorAll(".sk-opt"), function (a, i) {
      a.setAttribute("aria-selected", i === active ? "true" : "false");
      a.children[1].textContent = i === active ? " > " : "   ";
    });
    input.setAttribute("aria-activedescendant", "sk-opt-" + active);
    var cur = list.children[active];
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest" });
  }

  function move(d) {
    if (!results.length) return;
    active = (active + d + results.length) % results.length;
    render();
    paintActive();
  }

  function go(p, newTab) {
    var href = new URL(p.u, ROOT).href;
    if (newTab) { window.open(href, "_blank", "noopener"); return; }
    close();
    location.href = href;
  }

  function open() {
    if (!dialog) build();
    if (dialog.open) return;
    lastFocus = document.activeElement;
    frame();
    input.value = "";
    active = 0;
    render();
    dialog.showModal();
    input.focus();
  }
  function close() { if (dialog && dialog.open) dialog.close(); }

  function typing(t) {
    return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && lower(e.key) === "k") {
      e.preventDefault();
      if (dialog && dialog.open) close(); else open();
    } else if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !typing(e.target) && !(dialog && dialog.open)) {
      e.preventDefault();
      open();
    }
  });
  window.addEventListener("resize", function () { if (dialog && dialog.open) { frame(); render(); } });

  function boot() {
    var triggers = document.querySelectorAll("[data-search-open]");
    if (!triggers.length) {
      var b = el("button", "sk-trigger", "[ ctrl+k ]");
      b.type = "button";
      b.setAttribute("aria-label", "Search the site (Ctrl+K)");
      b.setAttribute("data-search-open", "");
      document.body.appendChild(b);
      triggers = [b];
    }
    var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    Array.prototype.forEach.call(triggers, function (t) {
      // "cmd+k" is one character shorter; the trailing space keeps ASCII
      // layouts around the trigger lined up.
      if (mac && t.textContent.indexOf("ctrl+k") !== -1) {
        t.textContent = t.textContent.replace("ctrl+k", "cmd+k") + " ";
        if (t.hasAttribute("aria-label")) t.setAttribute("aria-label", t.getAttribute("aria-label").replace("Ctrl+K", "Cmd+K"));
      }
      t.addEventListener("click", open);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
