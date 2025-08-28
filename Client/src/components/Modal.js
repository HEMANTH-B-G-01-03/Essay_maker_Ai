export default function Modal({ open, onClose, title, children }) {
if (!open) return null;
return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
<div className="mb-3 text-lg font-semibold">{title}</div>
<div className="mb-4">{children}</div>
<button onClick={onClose} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
Close
</button>
</div>
</div>
);
}