import { Pool } from "pg";

import config from "../config";

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10,
});

pool.connect().then(() => console.log("Postgresql successfully connected ")).catch((err) => {
  console.error("❌ PostgreSQL connection error:", err);
  process.exit(1);
});
