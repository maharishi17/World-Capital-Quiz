import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const app = express();
const port = 3000;

app.use(express.static("public"));

// Database configuration using Pool
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL from .env
  ssl: false, // Disable SSL for local development
});

// Variables for tracking the score and current question
let totalCorrect = 0;
let currentQuestion = {};

// Load quiz data
let quiz = [];
async function loadQuiz() {
  try {
    const result = await pool.query("SELECT * FROM capitals"); // Adjust table name if necessary
    quiz = result.rows;
  } catch (err) {
    console.error("Error loading quiz data:", err.stack);
    quiz = [];
  }
}

// Function to load the next random question
function nextQuestion() {
  if (quiz.length > 0) {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCountry;
  }
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Main route
app.get("/", async (req, res) => {
  await loadQuiz(); // Ensure quiz data is loaded before rendering
  totalCorrect = 0; // Reset score for new session
  nextQuestion();
  res.render("index.ejs", { question: currentQuestion, totalScore: totalCorrect });
});

// POST route to submit the answer
app.post("/submit", (req, res) => {
  const answer = req.body.answer?.trim();
  let isCorrect = false;

  // Check if currentQuestion.capital exists before calling toLowerCase
  if (currentQuestion.capital && answer) {
    if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
      totalCorrect++;
      isCorrect = true;
    }
  }

  nextQuestion();

  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
