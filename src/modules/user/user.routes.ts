import { Router } from "express";

import { userController } from "./user.controller";

const router = Router();

// create user routes
router.post("/", userController.createUser);
// get all users routes
router.get("/", userController.getUserAll);
// get user by id routes
router.get("/:id", userController.getUserById);
// update user by id routes
router.put("/:id", userController.updateUserById);
// delete user by id routes
router.delete("/:id", userController.deleteUserById);

export const userRoutes = router;
