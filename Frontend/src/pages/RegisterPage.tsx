import { useState, type FormEvent } from "react";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/apiError";
import AuthShell from "@/components/AuthShell";

interface Props {
  onNavigate: (path: string) => void;
}

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage({ onNavigate }: Props) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp(email, password);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? "An account with this email already exists."
          : "We couldn't create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started with your research analysis agent."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("/login")}
            className="font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            Sign in
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</span>
          <div className="flex items-center gap-2 rounded-xl border border-slate-600/60 bg-slate-900/60 px-3 transition focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
            <Mail size={16} className="text-slate-500" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Password</span>
          <div className="flex items-center gap-2 rounded-xl border border-slate-600/60 bg-slate-900/60 px-3 transition focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
            <Lock size={16} className="text-slate-500" />
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none"
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Confirm password</span>
          <div className="flex items-center gap-2 rounded-xl border border-slate-600/60 bg-slate-900/60 px-3 transition focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
            <Lock size={16} className="text-slate-500" />
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-transparent py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none"
              placeholder="Re-enter your password"
            />
          </div>
        </label>

        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Create account
        </button>
      </form>
    </AuthShell>
  );
}
