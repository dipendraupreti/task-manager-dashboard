import { z } from "zod";
import { PRIORITY_MIN, PRIORITY_MAX, PRIORITY_MEDIUM } from "../constants";

const parseDate = (val: unknown) => {
  if (val == null || val === "") {
    return undefined;
  }

  if (typeof val === "string" || val instanceof Date) {
    return new Date(val as string);
  }

  return undefined;
};

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  // priority should be a numeric value 1..3 (low=1, medium=2, high=3)
  priority: z
    .preprocess((val: unknown) => {
      if (val == null || val === "") return undefined;
      if (typeof val === "string" || typeof val === "number") return Number(val);
      return undefined;
    }, z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX))
    .optional()
    .default(PRIORITY_MEDIUM),
  end_date: z.preprocess(parseDate, z.date().optional()),
});

export const updateTaskSchema = createTaskSchema.partial();

export const fetchTasksQuerySchema = z.object({
  page: z.preprocess((val) => (val == null || val === "" ? undefined : Number(val)), z.number().int().min(1)).optional(),
  limit: z.preprocess((val) => (val == null || val === "" ? undefined : Number(val)), z.number().int().min(1)).optional(),
  sortBy: z.enum(["end_date", "priority", "created_at"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  priority: z.preprocess((val) => {
    if (val == null || val === "") return undefined;
    if (typeof val === "string" || typeof val === "number") return Number(val);
    return undefined;
  }, z.number().int().min(PRIORITY_MIN).max(PRIORITY_MAX)).optional(),
});
