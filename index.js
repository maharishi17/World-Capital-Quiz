import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';
const result = await pool.query('SELECT * FROM public.capitals');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Database configuration using Pool
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL from .env
  ssl: { rejectUnauthorized: false }, // Required for secure connections
});

// Load quiz data
let quiz = [];
async function loadQuiz() {
  try {
    const result = await pool.query("SELECT * FROM capitals");
    quiz = result.rows;
  } catch (err) {
    console.error("Error loading quiz data:", err.stack);
    quiz = []; // Fallback to empty array if database query fails
  }
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Variables for tracking the score and current question
let totalCorrect = 0;
let currentQuestion = {};

// Function to load the next random question
function nextQuestion() {
  if (quiz.length > 0) {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCountry;
  }
}

app.get("/", async (req, res) => {
  await loadQuiz(); // Ensure quiz data is loaded before rendering
  let totalScore = 0; // Define a default value for totalScore
  nextQuestion();
  res.render("index.ejs", { question: currentQuestion, totalScore });
});


// POST a new post (Submit answer)
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
