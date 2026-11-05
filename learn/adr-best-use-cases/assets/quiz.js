/* Adapted from engine-in-worker/assets/quiz.js.
 * .quiz[data-options] contains .q[data-answer][data-why], each with a .stem
 * and a labeled textarea.reason. .score is optional. Feedback appears only
 * after the learner writes a reason and chooses an answer.
 */
(function () {
  "use strict";

  function initQuiz(quiz, quizIndex) {
    var options = (quiz.dataset.options || "").split("|").map(function (s) {
      return s.trim();
    }).filter(Boolean);
    if (!options.length) return;

    var questions = Array.prototype.slice.call(quiz.querySelectorAll(".q"));
    var scoreBox = quiz.querySelector(".score");
    var answered = 0;
    var correct = 0;
    if (scoreBox) scoreBox.setAttribute("aria-live", "polite");

    questions.forEach(function (q, i) {
      var stem = q.querySelector(".stem");
      var reason = q.querySelector(".reason");
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
      feedback.id = "quiz-feedback-" + quizIndex + "-" + i;
      feedback.setAttribute("aria-live", "polite");
      feedback.setAttribute("aria-atomic", "true");
      if (reason) {
        var describedBy = reason.getAttribute("aria-describedby");
        reason.setAttribute("aria-describedby", (describedBy ? describedBy + " " : "") + feedback.id);
        reason.addEventListener("input", function () {
          reason.removeAttribute("aria-invalid");
        });
      }

      options.forEach(function (opt) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = opt;
        btn.addEventListener("click", function () {
          if (q.dataset.state) return;
          if (!reason || !reason.value.trim()) {
            feedback.textContent = "Write a short reason before choosing an answer.";
            feedback.classList.add("show");
            if (reason) {
              reason.setAttribute("aria-invalid", "true");
              reason.focus();
            }
            return;
          }

          var right = opt === q.dataset.answer;
          q.dataset.state = right ? "right" : "wrong";
          reason.removeAttribute("aria-invalid");
          reason.readOnly = true;
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

          feedback.textContent = "";
          var mark = document.createElement("span");
          mark.className = "mark " + (right ? "right" : "wrong");
          mark.textContent = right ? "Correct" : "Not quite — " + q.dataset.answer;
          feedback.appendChild(mark);
          feedback.appendChild(document.createTextNode(" " + (q.dataset.why || "")));
          feedback.classList.add("show");

          if (scoreBox && answered === questions.length) {
            scoreBox.textContent = correct + " of " + questions.length + " on the first pass. " +
              "Compare the feedback with your reasons, then try a new decision. " +
              "This score checks your choices; it does not assess your reasoning or establish mastery.";
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
