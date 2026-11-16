import { pool } from "../../config/db";

const createTodo = async (
  user_id: number,
  title: string,
  description: string,
) => {
  const result = await pool.query(
    "INSERT INTO todos (user_id, title, description) VALUES ($1,$2,$3) RETURNING *",
    [user_id, title, description],
  );
  return result;
};
const getTodoAll = async () => {
  const result = await pool.query("SELECT * FROM todos");
  return result;
};
const getTodoAllByUserId = async (user_id: number) => {
  const result = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
    user_id,
  ]);
  return result;
};
const updateTodoById = async (
  user_id: number,
  title: string,
  description: string,
  id: number,
) => {
  const result = await pool.query(
    "UPDATE todos SET user_id = $1, title = $2, description = $3 WHERE id = $4 RETURNING *",
    [user_id, title, description, id],
  );
  return result;
};
const deleteTodoById = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM todos WHERE id = $1 RETURNING *",
    [id],
  );
  return result;
};

export const todoService = {
  createTodo,
  getTodoAll,
  getTodoAllByUserId,
  updateTodoById,
  deleteTodoById,
};
