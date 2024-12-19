import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Database configuration
const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "Fag",
  password: "asdf",
  port: 5432,
});

const app = express();
const port = 3000;

// Load quiz data
let quiz = [];
async function loadQuiz() {
  try {
    const result = await db.query("SELECT * FROM capitals");
    quiz = result.rows;
  } catch (err) {
    console.error("Error loading quiz data:", err.stack);
  }
}
loadQuiz();

let totalCorrect = 0;
let currentQuestion = {};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  const answer = req.body.answer?.trim();
  let isCorrect = false;

  if (currentQuestion.capital.toLowerCase() === answer?.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }

  nextQuestion();

  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

// Function to load the next random question
function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
