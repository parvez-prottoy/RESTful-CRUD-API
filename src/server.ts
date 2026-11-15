import express, { type Express, type Request, type Response } from "express";
import { port } from "./config";
import connectDB, { pool } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";

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

// ? users routes
app.use("/users", userRoutes);

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
