import { Search, TrendingUp, FlaskConical, BarChart3, Microscope } from "lucide-react";

interface Props {
  onPick: (text: string) => void;
}

const SUGGESTIONS = [
  {
    icon: TrendingUp,
    title: "Market analysis",
    prompt:
      "Analyze the current state of the electric vehicle market, including key growth drivers, major players, and challenges.",
  },
  {
    icon: FlaskConical,
    title: "Literature review",
    prompt:
      "Summarize the recent research on CRISPR gene therapy, highlighting the main breakthroughs and remaining limitations.",
  },
  {
    icon: BarChart3,
    title: "Data interpretation",
    prompt:
      "What factors are driving the global semiconductor shortage, and what are the projected long-term effects on the tech industry?",
  },
  {
    icon: Microscope,
    title: "Scientific deep dive",
    prompt:
      "Explain the mechanisms behind mRNA vaccines and compare their efficacy with traditional vaccine approaches.",
  },
];

export default function SuggestedPrompts({ onPick }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SUGGESTIONS.map(({ icon: Icon, title, prompt }) => (
        <button
          key={title}
          onClick={() => onPick(prompt)}
          className="group flex flex-col gap-2 rounded-2xl border border-slate-700/60 bg-slate-800/50 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-slate-800"
        >
          <span className="flex items-center gap-2 text-cyan-400">
            <Icon size={18} />
            <span className="text-sm font-medium text-slate-200">{title}</span>
          </span>
          <span className="text-xs leading-relaxed text-slate-400">
            {prompt}
          </span>
        </button>
      ))}
    </div>
  );
}
