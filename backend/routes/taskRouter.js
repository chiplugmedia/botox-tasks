import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

// Base route: /tasks
taskRouter
  .route("/gp")
  .get(authMiddleware, getTasks) // GET /tasks (list all)
  .post(authMiddleware, createTask); // POST /tasks (create new)

// Route for single task by ID
taskRouter
  .route("/:id/gp")
  .get(authMiddleware, getTaskById) // GET /tasks/:id (get one)
  .put(authMiddleware, updateTask) // PUT /tasks/:id (update)
  .delete(authMiddleware, deleteTask); // DELETE /tasks/:id (remove)

export default taskRouter;
