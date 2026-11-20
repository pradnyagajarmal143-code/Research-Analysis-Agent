import type { ReactNode } from "react";
import Logo from "@/components/Logo";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-xl shadow-black/20 backdrop-blur sm:p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          </div>
          {children}
        </div>
        <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
      </div>
    </div>
  );
}
