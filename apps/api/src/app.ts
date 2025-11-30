import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

import errorHandler from "./middlewares/error.middleware";
import migrations from "./plugins/migrations.plugin";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";
import config from "./config";

const app = express();

const allowedOrigin = config.APP_ORIGIN;
const corsOptions: cors.CorsOptions = {
	origin: config.APP_ORIGIN,
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
// handle preflight for all routes (use pattern that works with path-to-regexp)
// Use a regex to match any path for OPTIONS (works with path-to-regexp)
app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/api", authRoutes);

app.use("/api/tasks", tasksRoutes);

app.use(errorHandler);

migrations().catch(console.error);

export default app;
