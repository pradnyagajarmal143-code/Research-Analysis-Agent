import { login, register } from "@/lib/authApi";
import { clearStoredSession, getStoredSession, storeSession, type StoredSession } from "@/lib/sessionStorage";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";


interface AuthContextValue {
  session: StoredSession | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => getStoredSession());

  const value = useMemo<AuthContextValue>(() => {
    const establish = (next: StoredSession) => {
      storeSession(next);
      setSession(next);
    };

    return {
      session,
      signIn: async (email, password) => {
        establish(await login({ email: email.trim(), password }));
      },
      signUp: async (email, password) => {
        establish(await register({ email: email.trim(), password }));
      },
      signOut: () => {
        clearStoredSession();
        setSession(null);
      },
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
