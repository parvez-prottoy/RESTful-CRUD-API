import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  // insert user into the database
  try {
    const result = await userService.createUser(
      name,
      email,
      age,
      phone,
      address,
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
};
const getUserAll = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserAll();
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
};
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getUserById(Number(id));
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
};
const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await userService.updateUserById(
      Number(id),
      name,
      email,
      Number(age),
      phone,
      address,
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
};
const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserById(Number(id));
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
};

export const userController = {
  createUser,
  getUserAll,
  getUserById,
  updateUserById,
  deleteUserById,
};
