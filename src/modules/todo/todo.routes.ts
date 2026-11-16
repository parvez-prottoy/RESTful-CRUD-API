import { Router, Request, Response } from "express";
import { pool } from "../../config/db";
import { todoController } from "./todo.controller";

const router = Router();

// create a new todo
router.post("/", todoController.createTodo);
// get all todos
router.get("/", todoController.getTodoAll);
// get a todo by user_id
router.get("/:user_id", todoController.getTodoAllByUserId);
// update a todo by ID
router.put("/:id", todoController.updateTodoById);
// delete a todo by ID
router.delete("/:id", todoController.deleteTodoById);

export const todoRoutes = router;
