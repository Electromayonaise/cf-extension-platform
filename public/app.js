const loadBtn = document.getElementById("loadProblemBtn");
const submitBtn = document.getElementById("submitBtn");

const problemInput = document.getElementById("problemInput");

const problemTitle = document.getElementById("problemTitle");
const problemStatement = document.getElementById("problemStatement");

const codeEditor = document.getElementById("codeEditor");
const languageSelect = document.getElementById("languageSelect");

const resultPanel = document.getElementById("resultPanel");

let currentProblem = null;

loadBtn.onclick = async () => {
  const id = problemInput.value.trim();

  if (!id) return;

  const res = await fetch(`/api/problem/${id}`);
  const data = await res.json();

  currentProblem = data;

  problemTitle.innerText = data.title;
  problemStatement.innerHTML = data.statement;

  if (window.MathJax) {
    MathJax.typeset();
  }
};

submitBtn.onclick = () => {
  if (!currentProblem) {
    alert("Load a problem first");
    return;
  }

  const code = codeEditor.value;
  const languageId = languageSelect.value;

  resultPanel.className = "status-banner info";
  resultPanel.innerText = "Sending to extension...";

  window.postMessage({
    type: "CF_SUBMIT",
    contestId: currentProblem.contestId,
    problemIndex: currentProblem.index,
    code,
    languageId,
  });
};

window.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "CF_SUBMIT_RESULT") {
    resultPanel.innerText = JSON.stringify(event.data, null, 2);
  }
});
