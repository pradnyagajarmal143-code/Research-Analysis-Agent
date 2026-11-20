import { useRef, useState, type KeyboardEvent } from "react";
import { Send, ArrowUp } from "lucide-react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="border-t border-slate-700/60 bg-slate-800/60 px-3 py-3 backdrop-blur sm:px-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-slate-600/60 bg-slate-900/60 px-3 py-2 transition focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask a research question…"
          className="max-h-40 flex-1 resize-none bg-transparent py-2 text-sm text-slate-100 placeholder-slate-500 outline-none sm:text-[15px]"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400"
        >
          <Send size={17} className="hidden sm:block" />
          <ArrowUp size={18} className="block sm:hidden" />
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-slate-500">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
