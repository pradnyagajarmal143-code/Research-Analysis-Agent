import type { ChatResponse } from "@/types";

const ENDPOINT =
  import.meta.env.VITE_CHAT_API_URL ??
  "http://127.0.0.1:8000/api/v1/research";

export async function sendMessage(
  query: string
): Promise<ChatResponse> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || `Request failed: ${response.status}`
    );
  }

  return data as ChatResponse;
}