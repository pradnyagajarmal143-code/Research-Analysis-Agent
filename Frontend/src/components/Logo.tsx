import { Microscope } from "lucide-react";

interface Props {
  showWordmark?: boolean;
  size?: "sm" | "lg";
  className?: string;
}

export default function Logo({ showWordmark = true, size = "sm", className = "" }: Props) {
  const isLarge = size === "lg";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 ${
          isLarge ? "h-16 w-16 rounded-2xl shadow-xl shadow-cyan-500/20" : "h-9 w-9"
        }`}
      >
        <Microscope size={isLarge ? 32 : 20} />
      </div>
      {showWordmark && (
        <span className="text-sm font-semibold tracking-tight text-slate-100 sm:text-base">
          Research Analysis Agent
        </span>
      )}
    </div>
  );
}
