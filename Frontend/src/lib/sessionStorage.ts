export interface StoredSession {
  accessToken: string;
  email: string;
}

const STORAGE_KEY = "research-agent-session";

function isExpired(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return true;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: unknown };
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function getStoredSession(): StoredSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as Partial<StoredSession>;
    if (
      typeof session.accessToken === "string" &&
      typeof session.email === "string" &&
      !isExpired(session.accessToken)
    ) {
      return { accessToken: session.accessToken, email: session.email };
    }
  } catch {
    // Corrupt entry; fall through and clear it
  }

  localStorage.removeItem(STORAGE_KEY);
  return null;
}

export function storeSession(session: StoredSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
