import TaskModel from "../models/task.model";
import {
  createTaskSchema,
  updateTaskSchema,
  fetchTasksQuerySchema,
} from "../validators/task.validator";

import type { Request, Response } from "express";

function getUserId(req: Request) {
  return req.user?.id as number;
}

export async function fetchTasks(req: Request, res: Response) {
  const userId = getUserId(req);

  const parsed = fetchTasksQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.format() });
  }

  const page = parsed.data.page ?? 1;
  const limit = parsed.data.limit ?? 10;
  const sortBy = (parsed.data.sortBy as any) ?? "end_date";
  const order = (parsed.data.order as any) ?? "asc";
  const priority = parsed.data.priority as any | undefined;

  const result = await TaskModel.fetch({
    userId,
    page,
    limit,
    sortBy,
    order,
    priority,
  });

  res.json(result);
}

export async function createTask(req: Request, res: Response) {
  const parsed = createTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.format() });
  }

  const userId = getUserId(req);

  const task = await TaskModel.create(userId, parsed.data);

  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response) {
  const parsed = updateTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.format() });
  }

  const userId = getUserId(req);

  const id = Number(req.params.id);

  const existing = await TaskModel.findById(userId, id);

  if (!existing) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updated = await TaskModel.update(userId, id, parsed.data);

  res.json(updated);
}

export async function deleteTask(req: Request, res: Response) {
  const userId = getUserId(req);

  const id = Number(req.params.id);

  const deleted = await TaskModel.delete(userId, id);

  if (!deleted) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Deleted" });
}
