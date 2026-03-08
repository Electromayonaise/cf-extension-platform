const express = require("express");
const cors = require("cors");
const path = require("path");

const { fetchProblem } = require("./services/problemService");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/problem/:problemId", async (req, res) => {
  try {
    res.json(await fetchProblem(req.params.problemId))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});