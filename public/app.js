const loadBtn = document.getElementById("loadProblemBtn");
const submitBtn = document.getElementById("submitBtn");

const problemInput = document.getElementById("problemInput");

const problemTitle = document.getElementById("problemTitle");
const problemStatement = document.getElementById("problemStatement");

const codeEditor = document.getElementById("codeEditor");
const languageSelect = document.getElementById("languageSelect");

const resultPanel = document.getElementById("resultPanel");

let currentProblem = null;
let solved = false;

function setBanner(text, type = "info") {

  resultPanel.innerText = text;

  resultPanel.classList.remove("info");
  resultPanel.classList.remove("ok");
  resultPanel.classList.remove("error");

  resultPanel.classList.add(type);

}

loadBtn.onclick = async () => {

  const id = problemInput.value.trim();

  if (!id) return;

  // Disable button and show loading feedback while fetching
  loadBtn.disabled = true;
  loadBtn.textContent = "Loading...";
  setBanner("Loading problem...", "info");

  try {

    const res = await fetch(`/api/problem/${id}`);
    const data = await res.json();

    if (data.error) {
      setBanner(`Error: ${data.error}`, "error");
      return;
    }

    currentProblem = data;
    solved = false;

    submitBtn.disabled = false;
    submitBtn.style.display = "flex";

    problemTitle.innerText = data.title;
    problemStatement.innerHTML = data.statement;

    setBanner("Problem loaded. Submit your solution.", "info");

    if (window.MathJax) {
      MathJax.typeset();
    }

  } catch (err) {

    setBanner("Failed to load problem. Check the ID and try again.", "error");

  } finally {

    // Always restore the button
    loadBtn.disabled = false;
    loadBtn.textContent = "Load";

  }

};

submitBtn.onclick = () => {

  if (!currentProblem) {
    alert("Load a problem first")
    return
  }

  if (solved) return

  const code = codeEditor.value
  const languageId = languageSelect.value

  submitBtn.disabled = true

  setBanner("Sending to extension...", "info")

  window.postMessage({
    type: "CF_SUBMIT",
    contestId: currentProblem.contestId,
    problemIndex: currentProblem.index,
    code,
    languageId
  })

}

window.addEventListener("message", (event) => {

  if (!event.data) return

  if (event.data.type === "CF_SUBMIT_STATUS") {

    if (event.data.status === "submitted") {

      setBanner(
        "Submission sent successfully. Waiting for verdict...",
        "info"
      )

    }

    if (event.data.status === "finished") {

      const verdict = event.data.verdict
      const tests = event.data.passedTests

      if (verdict === "Accepted") {

        solved = true

        submitBtn.disabled = true

        submitBtn.style.display = "none"

        setBanner(
          `Submitted correctly — Verdict: ${verdict}`,
          "ok"
        )

      } else {

        submitBtn.disabled = false

        setBanner(
          `Verdict: ${verdict} (tests passed: ${tests})`,
          "error"
        )

      }

    }

  }

})