
import { API_BASE_URL } from "./config";
import { getStoredSession } from "./sessionStorage";

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = getStoredSession();

  if (!session?.accessToken) {
    throw new Error("Please log in to continue.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/conversations${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
        ...options.headers,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail || `Request failed (${response.status})`
    );
  }

  return data as T;
}

export const getConversations = () =>
  apiRequest<Conversation[]>("");

export const createConversation = (title = "New Research") =>
  apiRequest<Conversation>("", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const getConversationMessages = (conversationId: number) =>
  apiRequest<ChatMessage[]>(`/${conversationId}/messages`);

export const saveConversationMessage = (
  conversationId: number,
  role: "user" | "assistant",
  content: string
) =>
  apiRequest<ChatMessage>(`/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ role, content }),
  });
