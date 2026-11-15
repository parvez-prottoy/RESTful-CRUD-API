import express, { type Express, type Request, type Response } from "express";
import { Pool, Result } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8000;

// DB
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const initDB = async () => {
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

initDB();

// use express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! This is a TypeScript Express server.");
});

app.post("/", (req: Request, res: Response) => {
  res.status(201).send({
    message: "Data received successfully",
    data: req.body,
  });
});

// ? Users CRUD operations
// Create a new user
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  // insert user into the database
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, age, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, age, phone, address],
    );
    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
});
// Get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).send({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error retrieving users",
      error: err.message,
    });
  }
});

// Get a user by ID
app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "User retrieved successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error retrieving user",
      error: err.message,
    });
  }
});

// Update a user by ID
app.patch("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, age = $3, phone = $4, address = $5, updated_at = NOW() WHERE id = $6 RETURNING *",
      [name, email, age, phone, address, id],
    );
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error updating user",
      error: err.message,
    });
  }
});
// Delete a user by ID
app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "User deleted successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
});

// ? Todos CRUD operations

// Create a new todo
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO todos (user_id, title, description) VALUES ($1,$2,$3) RETURNING *",
      [user_id, title, description],
    );
    res.status(201).send({
      success: true,
      message: "Todo created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error creating todo",
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
