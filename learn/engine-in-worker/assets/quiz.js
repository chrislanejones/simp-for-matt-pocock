/* engine-in-worker — reusable retrieval-practice quiz widget.
 *
 * Markup contract:
 *
 *   <div class="quiz" data-options="Copied|Passed|Shared|Thrown">
 *     <ol>
 *       <li class="q" data-answer="Passed" data-why="Because …">
 *         <div class="stem"> … question … </div>
 *       </li>
 *     </ol>
 *     <div class="score"></div>
 *   </div>
 *
 * Option buttons are generated so every option is rendered identically and in the
 * same order for every question — no length, order, or formatting tell.
 * Feedback is immediate: the point is a tight loop, not a graded exam.
 */
(function () {
  "use strict";

  function initQuiz(quiz) {
    var options = (quiz.dataset.options || "").split("|").map(function (s) {
      return s.trim();
    }).filter(Boolean);
    if (!options.length) return;

    var questions = Array.prototype.slice.call(quiz.querySelectorAll(".q"));
    var scoreBox = quiz.querySelector(".score");
    var answered = 0;
    var correct = 0;

    questions.forEach(function (q, i) {
      var stem = q.querySelector(".stem");
      if (stem && !stem.querySelector(".qnum")) {
        var num = document.createElement("span");
        num.className = "qnum";
        num.textContent = "Question " + (i + 1) + " of " + questions.length;
        stem.insertBefore(num, stem.firstChild);
      }

      var opts = document.createElement("div");
      opts.className = "opts";

      var feedback = document.createElement("div");
      feedback.className = "feedback";

      options.forEach(function (opt) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = opt;
        btn.addEventListener("click", function () {
          if (q.dataset.state) return; // already answered
          var right = opt === q.dataset.answer;
          q.dataset.state = right ? "right" : "wrong";
          answered++;
          if (right) correct++;

          Array.prototype.forEach.call(opts.children, function (b) {
            b.disabled = true;
            if (b === btn) {
              b.className = right ? "picked-right" : "picked-wrong";
            } else if (!right && b.textContent === q.dataset.answer) {
              b.className = "reveal";
            }
          });

          feedback.innerHTML =
            '<span class="mark ' + (right ? "right" : "wrong") + '">' +
            (right ? "Correct" : "Not quite — " + q.dataset.answer) +
            "</span> " + (q.dataset.why || "");
          feedback.classList.add("show");

          if (scoreBox && answered === questions.length) {
            scoreBox.textContent =
              correct + " of " + questions.length + " on the first pass. " +
              (correct === questions.length
                ? "Nothing here should surprise you again — say so and this becomes a learning record."
                : "Re-read the rows you missed, then tell me which one still feels arbitrary.");
            scoreBox.classList.add("show");
          }
        });
        opts.appendChild(btn);
      });

      q.appendChild(opts);
      q.appendChild(feedback);
    });
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll(".quiz"), initQuiz);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
