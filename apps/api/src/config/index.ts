import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.preprocess((val) => Number(val), z.number().default(2080)),
  HOST: z.string().default("0.0.0.0"),
  APP_ORIGIN: z.preprocess(
    (arg) => (typeof arg === "string" ? arg : "http://localhost:2080").split(", "),
    z.array(z.url())
  ),
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECURE: z.string().optional(),
  MIGRATIONS_PATH: z.string().default("migrations"),
});

export default schema.parse(process.env);
