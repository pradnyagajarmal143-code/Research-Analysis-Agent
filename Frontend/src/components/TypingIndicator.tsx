export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400/80 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400/80 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400/80" />
      </div>
      <span className="text-xs text-slate-400">Researching your question…</span>
    </div>
  );
}
