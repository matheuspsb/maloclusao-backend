import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { router } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.json({ status: "pong" });
});

app.use("/api", router);

app.use(errorHandler);
