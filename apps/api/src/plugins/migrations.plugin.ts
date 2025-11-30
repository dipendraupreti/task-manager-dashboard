import { migrate } from "postgres-migrations";

import config from "../config";
import { pool } from "../utils/db";

const migrationsPlugin = async () => {
  try {
    await migrate({ client: pool }, config.MIGRATIONS_PATH);

    console.log("Migrations ran successfully");
  } catch (error) {
    console.log("Failed to run migrations");
    throw error;
  }
};

export default migrationsPlugin;
