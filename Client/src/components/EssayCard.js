import CopyButton from "./CopyButton";
export default function EssayCard({ text, version }) {
return (
<div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
<div className="mb-2 flex items-center justify-between">
<div className="text-sm text-neutral-500">Version {version}</div>
<CopyButton text={text} />
</div>
<div className="max-h-80 overflow-y-auto whitespace-pre-wrap text-[15px] leading-7">
{text}
</div>
</div>
);
}