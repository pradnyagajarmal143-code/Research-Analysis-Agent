export interface ChatResponse {
  topic: string;
  summary: string;
  sources: string[];
  tools_used: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}