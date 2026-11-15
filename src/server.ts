import express, { type Express, type Request, type Response } from "express";
import { port } from "./config";
import connectDB, { pool } from "./config/db";

const app: Express = express();

// connect to the database
connectDB();

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

// Get all todos
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.status(200).send({
      success: true,
      message: "Todos retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error retrieving todos",
      error: err.message,
    });
  }
});

// Get a todo by user_id
app.get("/todos/:user_id", async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
      user_id,
    ]);
    res.status(200).send({
      success: true,
      message: "Todos retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error retrieving todos",
      error: err.message,
    });
  }
});

// Update a todo by ID
app.patch("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_id, title, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE todos SET user_id = $1, title = $2, description = $3 WHERE id = $4 RETURNING *",
      [user_id, title, description, id],
    );
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Todo updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error updating todo",
      error: err.message,
    });
  }
});

// Delete a todo by ID
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Todo deleted successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Error deleting todo",
      error: err.message,
    });
  }
});

// Handle 404 for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
