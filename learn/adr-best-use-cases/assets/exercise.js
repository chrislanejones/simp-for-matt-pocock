/* Local-only draft exercise. Requires form#adr-draft, textarea fields named
 * context/decision/benefit/cost/alternative, #draft-review, #draft-output,
 * and button#download-draft. Nothing is stored automatically.
 */
(function () {
  "use strict";

  function boot() {
    var form = document.getElementById("adr-draft");
    var review = document.getElementById("draft-review");
    var output = document.getElementById("draft-output");
    var download = document.getElementById("download-draft");
    if (!form || !review || !output || !download) return;

    var names = ["context", "decision", "benefit", "cost", "alternative"];
    var fields = names.map(function (name) { return form.elements.namedItem(name); });
    if (fields.some(function (field) { return !field; })) return;
    var markdown = "";
    review.hidden = true;
    download.disabled = true;

    fields.forEach(function (field) {
      field.required = true;
      field.addEventListener("input", function () {
        field.setCustomValidity("");
        markdown = "";
        review.hidden = true;
        download.disabled = true;
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      fields.forEach(function (field) {
        field.setCustomValidity(field.value.trim() ? "" : "Write a response for this part of your draft.");
      });
      if (!form.reportValidity()) return;
      var values = fields.map(function (field) { return field.value.trim(); });
      markdown = [
        "# Practice ADR: Your decision",
        "",
        "Status: proposed",
        "",
        "## Context",
        values[0],
        "",
        "## Decision",
        values[1],
        "",
        "## Consequences",
        "Benefit: " + values[2],
        "",
        "Cost: " + values[3],
        "",
        "## Alternatives",
        values[4],
        ""
      ].join("\n");
      output.textContent = markdown;
      review.hidden = false;
      download.disabled = false;
      review.setAttribute("tabindex", "-1");
      review.focus();
    });

    download.addEventListener("click", function () {
      if (!markdown) return;
      var url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
      var link = document.createElement("a");
      link.href = url;
      link.download = "practice-adr.md";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
