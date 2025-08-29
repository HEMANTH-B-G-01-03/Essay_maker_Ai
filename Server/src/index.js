import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import essayRouter from "./routes/essay.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/essay", essayRouter);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
console.log(`API listening on http://localhost:${port}`);
});


