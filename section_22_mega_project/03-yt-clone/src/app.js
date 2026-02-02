import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
app.use(
  cors({
    origin: "process.env.CORS_ORIGIN",
    credentials: true,
  })
);

// middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import healthcheckRouter from "./routes/healthcheck.route.js";
//auth routes
import authRouter from "./routes/auth.route.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/auth", authRouter);

export default app;
