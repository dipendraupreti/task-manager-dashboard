import app from "./app";
import config from "./config";
import { pool } from "./utils/db";

const server = app.listen(config.PORT, () => {
  console.log(`Server listening at http://localhost:${config.PORT}`);
});

process.on("SIGINT", () => pool.end());
process.on("SIGTERM", () => server.close());
