import { Request, Router, Response } from "express";
import { pool } from "../../config/db";

const router = Router();

// create user routes
router.post("/", async (req: Request, res: Response) => {
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
// get all users routes
router.get("/", async (req: Request, res: Response) => {
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
// get user by id routes
router.get("/:id", async (req: Request, res: Response) => {
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
// update user by id routes
router.put("/:id", async (req: Request, res: Response) => {
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
// delete user by id routes
router.delete("/:id", async (req: Request, res: Response) => {
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

export const userRoutes = router;
