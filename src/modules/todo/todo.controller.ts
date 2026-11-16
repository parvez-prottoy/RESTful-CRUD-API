import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  const { user_id, title, description } = req.body;
  try {
    const result = await todoService.createTodo(
      Number(user_id),
      title,
      description,
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
};
const getTodoAll = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getTodoAll();
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
};
const getTodoAllByUserId = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const result = await todoService.getTodoAllByUserId(Number(user_id));
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
};
const updateTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_id, title, description } = req.body;

  try {
    const result = await todoService.updateTodoById(
      Number(user_id),
      title,
      description,
      Number(id),
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
};
const deleteTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await todoService.deleteTodoById(Number(id));
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
};

export const todoController = {
  createTodo,
  getTodoAll,
  getTodoAllByUserId,
  updateTodoById,
  deleteTodoById,
};
