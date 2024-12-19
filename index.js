import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";  // Import the Pool from pg
import { config } from "dotenv";  // Import dotenv to load environment variables
config();  // Load environment variables from .env file

// Initialize the pool from db.js (assuming db.js exports a pool instance)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Use DATABASE_URL from .env
  ssl: { rejectUnauthorized: false },  // SSL for Render hosting
});

const app = express();
const port = 3000;

let quiz = [];
let totalCorrect = 0;
let currentQuestion = {};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Fetch quiz data from PostgreSQL on app start
async function loadQuiz() {
  try {
    const result = await pool.query("SELECT * FROM capitals");  // Query the capitals table
    quiz = result.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

// Load quiz data when the server starts
loadQuiz();

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
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
async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});