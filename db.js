import dotenv from "dotenv";
import pkg from "pg";

dotenv.config(); // Load environment variables from .env file
const { Pool } = pkg; // Import Pool from pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for secure connections
});

export default pool; // Export the pool instance
