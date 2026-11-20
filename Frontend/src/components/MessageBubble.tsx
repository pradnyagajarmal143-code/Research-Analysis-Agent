
import { User, Microscope, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Clipboard unavailable");
    }
  };

  return (
    <div
      className={`group flex w-full gap-3 px-4 py-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${
          isUser
            ? "bg-cyan-500 text-white"
            : "bg-slate-700 text-cyan-300 ring-1 ring-slate-600"
        }`}
      >
        {isUser ? <User size={18} /> : <Microscope size={18} />}
      </div>

      <div
        className={`flex max-w-[82%] min-w-0 flex-col gap-1.5 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {!isUser && (
          <span className="flex items-center gap-1.5 px-1 text-[11px] font-medium uppercase tracking-wide text-cyan-400">
            <FileText size={12} />
            Research Analysis
          </span>
        )}

        {/* Message Content */}
        <div
          className={`min-w-0 max-w-full overflow-hidden rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:text-[15px] ${
            isUser
              ? "rounded-tr-sm bg-cyan-500 text-white"
              : "rounded-tl-sm bg-slate-700/80 text-slate-100 ring-1 ring-slate-600/60"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">
              {message.content}
            </p>
          ) : (
            <div className="research-markdown break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-3 mt-2 text-xl font-bold text-white">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mb-2 mt-5 border-b border-slate-600 pb-2 text-lg font-semibold text-cyan-300">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mb-2 mt-4 text-base font-semibold text-white">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="mb-3 leading-7 text-slate-200">
                      {children}
                    </p>
                  ),

                  ul: ({ children }) => (
                    <ul className="mb-3 ml-5 list-disc space-y-2 text-slate-200">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="mb-3 ml-5 list-decimal space-y-2 text-slate-200">
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li className="pl-1">{children}</li>
                  ),

                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),

                  a: ({ href, children }) => {
                    const safeUrl = href
                      ? (() => {
                          try {
                            const url = new URL(href);
                            return ["http:", "https:"].includes(url.protocol)
                              ? url.href
                              : undefined;
                          } catch {
                            return undefined;
                          }
                        })()
                      : undefined;

                    return safeUrl ? (
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-cyan-400 underline hover:text-cyan-300"
                      >
                        {children}
                      </a>
                    ) : (
                      <span>{children}</span>
                    );
                  },

                  blockquote: ({ children }) => (
                    <blockquote className="my-3 border-l-4 border-cyan-500 pl-4 text-slate-300">
                      {children}
                    </blockquote>
                  ),

                  code: ({ children, className }) => (
                    <code
                      className={`rounded bg-slate-900 px-1.5 py-1 text-cyan-300 ${
                        className ?? ""
                      }`}
                    >
                      {children}
                    </code>
                  ),

                  pre: ({ children }) => (
                    <pre className="my-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-cyan-300">
                      {children}
                    </pre>
                  ),

                  hr: () => (
                    <hr className="my-4 border-slate-600" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy Button */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-1 text-[11px] text-slate-500 opacity-0 transition hover:text-slate-300 group-hover:opacity-100"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
