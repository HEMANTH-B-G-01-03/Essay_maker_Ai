// Server/src/openai.js
const PPLX_URL = "https://api.perplexity.ai/chat/completions";
// Valid models from Perplexity docs:
//  - "sonar-small-online"
//  - "sonar-medium-online"
//  - "sonar-large-online"

const PPLX_MODEL = process.env.PPLX_MODEL || "sonar-medium-online";

function requireKey() {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error("Missing PERPLEXITY_API_KEY");
  }
}

async function pplxChat(messages) {
  requireKey();
  const resp = await fetch(PPLX_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: PPLX_MODEL,
      messages,
      max_tokens: 1024, // optional, adjust essay length
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Perplexity error ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function generateEssay({ topic, tone }) {
  const style = tone || "a clear, informative";
  const prompt = `Write a multi-paragraph essay on "${topic}" in ${style} style. Include an introduction, 2-3 body paragraphs, and a concise conclusion.`;
  return pplxChat([{ role: "user", content: prompt }]);
}

export async function reviseEssay({ original, note }) {
  const prompt = `You are revising the following essay based on the note.

Essay:
${original}

Note from user: ${note}

Return only the revised essay.`;
  return pplxChat([{ role: "user", content: prompt }]);
}

