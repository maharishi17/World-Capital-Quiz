import dotenv from "dotenv";
import pkg from "pg";

dotenv.config(); // Load environment variables from .env file
const { Pool } = pkg; // Import Pool from pg

const pool = new Pool({
  connectionString:  'postgresql://countries_capitals_user:OCPIXt1FiQfHYJQWxUm8zALuWwmlcp92@dpg-cthvvc56l47c738d1vgg-a/countries_capitals',
  ssl: { rejectUnauthorized: false }, // Required for secure connections
});

export default pool; // Export the pool instance
