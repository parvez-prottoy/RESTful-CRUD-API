import { Router, Request, Response } from "express";
import { pool } from "../../config/db";

const router = Router();

// create a new todo
router.post("/", async (req: Request, res: Response) => {
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
// get all todos
router.get("/", async (req: Request, res: Response) => {
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
// get a todo by user_id
router.get("/:user_id", async (req: Request, res: Response) => {
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
// update a todo by ID
router.put("/:id", async (req: Request, res: Response) => {
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
// delete a todo by ID
router.delete("/:id", async (req: Request, res: Response) => {
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

export const todoRoutes = router;
