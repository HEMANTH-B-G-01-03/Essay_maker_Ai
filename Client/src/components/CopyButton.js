import { useState } from "react";
export default function CopyButton({ text }) {
const [copied, setCopied] = useState(false);
async function onCopy() {
try {
await navigator.clipboard.writeText(text);
setCopied(true);
setTimeout(() => setCopied(false), 1500);
} catch {}
}
return (
<button
onClick={onCopy}
className="rounded border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
aria-label="Copy essay"
title={copied ? "Copied!" : "Copy to clipboard"}
>
{copied ? "Copied!" : "Copy"}
</button>
);
}

