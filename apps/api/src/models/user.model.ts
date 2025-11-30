import { pool } from "../utils/db";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export default {
  async findByEmail(email: string): Promise<UserRow | null> {
    const { rows } = await pool.query<UserRow>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    return rows[0] ?? null;
  },

  async create(name: string, email: string, hashedPassword: string) {
    const { rows } = await pool.query<UserRow>(
      `INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email, created_at`,
      [name, email, hashedPassword],
    );
    return rows[0];
  },

  async findById(id: number) {
    const { rows } = await pool.query<UserRow>(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  },
};
