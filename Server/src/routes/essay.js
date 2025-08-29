
import { Router } from "express";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

export async function generateEssay({ topic, tone }) {
  const style = tone || "a clear, informative";
  const prompt = `Write a multi-paragraph essay on "${topic}" in ${style} style. Include an introduction, 2-3 body paragraphs, and a concise conclusion.`;

  const resp = await client.chat.completions.create({
    model: "sonar-large-online", // ✅ Perplexity model
    messages: [{ role: "user", content: prompt }],
  });

  return resp.choices[0]?.message?.content?.trim() || "";
}

export async function reviseEssay({ original, note }) {
  const prompt = `You are revising the following essay based on the note.

Essay:
${original}

Note from user: ${note}

Return only the revised essay.`;

  const resp = await client.chat.completions.create({
    model: "sonar-large-online", // ✅ same model as above
    messages: [{ role: "user", content: prompt }],
  });

  return resp.choices[0]?.message?.content?.trim() || "";
}

export default Router;
