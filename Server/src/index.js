// Server/src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import essayRouter from "./routes/essay.js";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : "*";

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/essay", essayRouter);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
