import express, { type Express, type Request, type Response } from "express";
import { port } from "./config";
import connectDB, { pool } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";

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
// ? todos routes
app.use("/todos", todoRoutes);

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
