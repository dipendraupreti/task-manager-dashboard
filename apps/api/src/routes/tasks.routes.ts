import { Router } from "express";

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller";
import auth from "../middlewares/auth.middleware";

const router = Router();

router.use(auth);

router.get("/", fetchTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
