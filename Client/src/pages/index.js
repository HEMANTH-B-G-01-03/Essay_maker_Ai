import Head from "next/head";
import PromptForm from "@/components/PromptForm";
import EssayCard from "@/components/EssayCard";
import Modal from "@/components/Modal";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export default function Home() {
const { essay, history, loading, error, setEssay, setHistory } = useApp();
const [goodOpen, setGoodOpen] = useState(false);
const [improveOpen, setImproveOpen] = useState(false);
const [improveNote, setImproveNote] = useState("");

useEffect(() => {
function onUpdate(e) {
const next = e.detail || "";
setEssay(next);
const nextVersion = (history[history.length - 1]?.version || 1) + 1;
setHistory([...history, { version: nextVersion, text: next }]);
}
window.addEventListener("essay:updated", onUpdate);
return () => window.removeEventListener("essay:updated", onUpdate);
}, [history, setEssay, setHistory]);

async function sendFeedback(good) {
if (good) { setGoodOpen(true); return; }
setImproveOpen(true);
}

async function submitImprovement() {
if (!improveNote.trim()) return;
try {
const res = await fetch(${API_BASE}/api/essay/revise, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ original: essay, note: improveNote })
});
if (!res.ok) throw new Error(Request failed: ${res.status});
const data = await res.json();
window.scrollTo({ top: 0, behavior: "smooth" });
setImproveOpen(false);
setImproveNote("");
const event = new CustomEvent("essay:updated", { detail: data.essay });
window.dispatchEvent(event);
} catch {
alert("Failed to revise essay. Try again.");
}
}

return (
<div className="mx-auto max-w-3xl px-4 py-10">
<Head>
<title>AI Essay Writer</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
</Head>
  <header className="mb-10">
    <div className="text-center">
      <h1 className="mb-2 text-4xl font-bold">AI Essay Writer</h1>
      <p className="text-neutral-600 dark:text-neutral-300">
        Generate polished, multi-paragraph essays with one click.
      </p>
    </div>
  </header>

  <section className="mb-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
    <h2 className="mb-4 text-xl font-semibold">Start a new essay</h2>
    <PromptForm />
    {error && (
      <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
    )}
  </section>

  <section className="space-y-4">
    {loading && (
      <div className="rounded border border-neutral-200 p-4 dark:border-neutral-800">
        Generating...
      </div>
    )}
    {history.map((h) => (
      <EssayCard key={h.version} text={h.text} version={h.version} />
    ))}
    {!history.length && (
      <div className="rounded border border-dashed p-6 text-center text-neutral-500 dark:border-neutral-800">
        Your essay will appear here.
      </div>
    )}
  </section>

  <section className="mt-8 flex gap-3">
    <button
      onClick={() => sendFeedback(true)}
      className="flex-1 rounded bg-emerald-600 p-3 text-white hover:bg-emerald-700 disabled:opacity-50"
      disabled={!history.length}
    >
      👍 Good
    </button>
    <button
      onClick={() => sendFeedback(false)}
      className="flex-1 rounded bg-amber-600 p-3 text-white hover:bg-amber-700 disabled:opacity-50"
      disabled={!history.length}
    >
      👎 Needs Improvement
    </button>
  </section>

  <Modal open={goodOpen} onClose={() => setGoodOpen(false)} title="🎉 Glad you liked it!">
    <p>Feel free to copy or tweak further.</p>
  </Modal>

  <Modal open={improveOpen} onClose={() => setImproveOpen(false)} title="What should be improved?">
    <textarea
      value={improveNote}
      onChange={(e) => setImproveNote(e.target.value)}
      placeholder='e.g., "make it more formal", "add more examples"'
      className="h-28 w-full rounded border border-neutral-300 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
    />
    <div className="mt-3">
      <button
        onClick={submitImprovement}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Revise
      </button>
    </div>
  </Modal>
</div>
);
}