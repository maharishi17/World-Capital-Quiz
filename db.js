require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg'); // Import the pg module

// Configure the connection pool
const pool = new Pool({
  connectionString: 'postgresql://countries_capitals_user:OCPIXt1FiQfHYJQWxUm8zALuWwmlcp92@dpg-cthvvc56l47c738d1vgg-a/countries_capitals',
  ssl: { rejectUnauthorized: false }, // Required for secure connections on platforms like Render
});

// Export the pool for use in other parts of the application
module.exports = pool;
