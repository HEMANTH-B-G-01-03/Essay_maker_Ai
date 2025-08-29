import { useState } from "react";
import { useApp } from "../context/AppContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export default function PromptForm() {
  const { setEssay, setHistory, setLoading, setError } = useApp();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/essay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setEssay(data.essay || "");
      setHistory([{ version: 1, text: data.essay || "" }]);
    } catch {
      setError("Failed to generate essay. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Topic (e.g., The impact of AI on education)"
        className="w-full rounded border border-neutral-300 bg-white p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
      />

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full rounded border border-neutral-300 bg-white p-3 text-neutral-700 outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
      >
        <option value="">Tone/Style (optional)</option>
        <option value="formal">Formal</option>
        <option value="informal">Informal</option>
        <option value="persuasive">Persuasive</option>
        <option value="analytical">Analytical</option>
        <option value="narrative">Narrative</option>
      </select>

      <button
        type="submit"
        className="w-full rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700"
      >
        Generate Essay
      </button>
    </form>
  );
}
