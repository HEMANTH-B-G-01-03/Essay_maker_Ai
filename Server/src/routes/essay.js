// Server/src/routes/essay.js
import { Router } from "express";
import { z } from "zod";
import { generateEssay, reviseEssay } from "../openai.js";

const router = Router();

const genSchema = z.object({
  topic: z.string().min(2),
  tone: z.string().optional(),
});

router.post("/", async (req, res) => {
  const parsed = genSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const essay = await generateEssay(parsed.data);
    res.json({ essay });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(500).json({ error: "Failed to generate essay" });
  }
});

const revSchema = z.object({
  original: z.string().min(1),
  note: z.string().min(2),
});

router.post("/revise", async (req, res) => {
  const parsed = revSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  try {
    const essay = await reviseEssay(parsed.data);
    res.json({ essay });
  } catch (err) {
    console.error("Revise error:", err);
    res.status(500).json({ error: "Failed to revise essay" });
  }
});

export default router; // ✅ default export so your index.js import works
