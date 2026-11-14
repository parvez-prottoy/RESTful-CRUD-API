import express, { type Express, type Request, type Response } from "express";

const app: Express = express();
const PORT: number = 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! This is a TypeScript Express server.");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
