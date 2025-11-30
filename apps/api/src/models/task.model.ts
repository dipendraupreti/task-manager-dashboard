import { pool } from "../utils/db";
import { PRIORITY_MEDIUM } from "../constants";

export interface TaskRow {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  priority: number;
  end_date?: Date | null;
  created_at: Date;
  updated_at?: Date | null;
}
 
type FetchOptions = {
  userId: number;
  page?: number;
  limit?: number;
  sortBy?: "end_date" | "priority" | "created_at";
  order?: "asc" | "desc";
  priority?: number | undefined;
};

export default {
  async create(
    userId: number,
    payload: {
      title: string;
      description?: string | null;
      priority?: number;
      end_date?: Date | null;
    },
  ) {
    const { title, description, priority = PRIORITY_MEDIUM, end_date } = payload;
    const { rows } = await pool.query<TaskRow>(
      `INSERT INTO tasks (user_id, title, description, priority, end_date)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, title, description ?? null, priority, end_date ?? null],
    );
    return rows[0];
  },

  async update(
    userId: number,
    taskId: number,
    patch: {
      title?: string;
      description?: string | null;
      priority?: number;
      end_date?: Date | null;
    },
  ) {
    // Build dynamic set clause
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const key of [
      "title",
      "description",
      "priority",
      "end_date",
    ] as const) {
      if ((patch as any)[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push((patch as any)[key]);
        idx++;
      }
    }
    if (fields.length === 0) {
      const { rows } = await pool.query<TaskRow>(
        `SELECT * FROM tasks WHERE id=$1 AND user_id=$2`,
        [taskId, userId],
      );
      return rows[0] ?? null;
    }

    // add updated_at
    fields.push(`updated_at = now()`);
    const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING *`;
    values.push(taskId, userId);

    const { rows } = await pool.query<TaskRow>(query, values);
    return rows[0] ?? null;
  },

  async delete(userId: number, taskId: number) {
    const { rows } = await pool.query<TaskRow>(
      "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING id",
      [taskId, userId],
    );
    return rows[0] ?? null;
  },

  async findById(userId: number, taskId: number) {
    const { rows } = await pool.query<TaskRow>(
      "SELECT * FROM tasks WHERE id=$1 AND user_id=$2",
      [taskId, userId],
    );
    return rows[0] ?? null;
  },

  async fetch(opts: FetchOptions) {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.max(1, Math.min(100, opts.limit ?? 10));
    const offset = (page - 1) * limit;

    const allowedSort = ["end_date", "priority", "created_at"];
    const sortBy = allowedSort.includes(opts.sortBy ?? "")
      ? opts.sortBy
      : "end_date";
    const order = opts.order?.toLowerCase() === "desc" ? "DESC" : "ASC";

    const filterClauses: string[] = [`user_id = $1`];
    const values: any[] = [opts.userId];
    if (opts.priority) {
      values.push(opts.priority);
      filterClauses.push(`priority = $${values.length}`);
    }

    const where = filterClauses.join(" AND ");

    const dataQuery = `
      SELECT *, (end_date < now()) as overdue
      FROM tasks
      WHERE ${where}
      ORDER BY ${sortBy} ${order}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    values.push(limit, offset);

    const countQuery = `SELECT COUNT(*)::int AS total FROM tasks WHERE ${where}`;

    const [dataRes, countRes] = await Promise.all([
      pool.query<any>(dataQuery, values),
      pool.query<{ total: number }>(
        countQuery,
        values.slice(0, values.length - 2),
      ),
    ]);

    return {
      tasks: dataRes.rows,
      total: countRes.rows[0].total,
      page,
      limit,
    };
  },
};
