import { Pool } from "pg";
import { dbConnectionString } from ".";

export const pool = new Pool({
  connectionString: dbConnectionString,
});

const connectDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          age INT NOT NULL,
          phone VARCHAR(15),
          address TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT FALSE,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )`);
    console.log("Database connection successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default connectDB;
