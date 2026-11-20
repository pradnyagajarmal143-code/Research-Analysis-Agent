
import { useEffect, useRef, useState } from "react";
import {
  Microscope,
  LogOut,
  Plus,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
} from "lucide-react";

import MessageBubble from "./MessageBubble";
import SuggestedPrompts from "./SuggestedPrompts";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";

import type { Message } from "../types";
import { sendMessage } from "@lib/chatApi";
import { useAuth } from "@/contexts/AuthContext";

import {
  getConversations,
  createConversation,
  getConversationMessages,
  saveConversationMessage,
  type Conversation,
} from "@/lib/conversationApi";

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { signOut } = useAuth();

  const bottomRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load conversation history when the component mounts
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversation history:", error);
      }
    };

    loadHistory();
  }, []);

  // Create a new conversation
  const handleNewResearch = async () => {
    if (isTyping || isLoading) return;

    setIsLoading(true);

    try {
      const conversation = await createConversation();

      setConversations((prev) => [
        conversation,
        ...prev.filter((item) => item.id !== conversation.id),
      ]);

      setActiveConversationId(conversation.id);
      setMessages([]);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not create a new conversation."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load an existing conversation
  const handleLoadConversation = async (conversationId: number) => {
    if (isTyping || isLoading) return;

    setIsLoading(true);

    try {
      const data = await getConversationMessages(conversationId);

      const loadedMessages: Message[] = data.map((item) => ({
        id: String(item.id),
        role: item.role,
        content: item.content,
        createdAt: new Date(item.created_at).getTime(),
      }));

      setMessages(loadedMessages);
      setActiveConversationId(conversationId);
    } catch (error) {
      console.error("Failed to load conversation:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not load this conversation."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Send a research question
  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping || isLoading) return;

    setIsTyping(true);

    let conversationId = activeConversationId;

    try {
      // Automatically create a conversation if none is active
      if (!conversationId) {
        const conversation = await createConversation();

        conversationId = conversation.id;
        setActiveConversationId(conversation.id);

        setConversations((prev) => [
          conversation,
          ...prev.filter((item) => item.id !== conversation.id),
        ]);
      }

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: text,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);

      // Persist user message
      await saveConversationMessage(
        conversationId,
        "user",
        text
      );

      // Run the existing research service
      const result = await sendMessage(text);

      const assistantMsg: Message = {
        id: uid(),
        role: "assistant",
        content: result.summary,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Persist assistant response
      await saveConversationMessage(
        conversationId,
        "assistant",
        result.summary
      );

      // Refresh history so the title and updated time are current
      const history = await getConversations();
      setConversations(history);

    } catch (error) {
      const reason =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: `Research failed: ${reason}`,
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-0"
        } flex shrink-0 flex-col overflow-hidden border-r border-slate-700/60 bg-slate-950 transition-all duration-300`}
      >
        <div className="flex h-full min-w-72 flex-col p-4">

          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white">
              <Microscope size={20} />
            </div>
            <span className="font-semibold text-slate-100">
              Research Agent
            </span>
          </div>

          <button
            onClick={handleNewResearch}
            disabled={isTyping || isLoading}
            className="mb-6 flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            New Research
          </button>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recent History
          </p>

          <div className="flex-1 space-y-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="px-2 py-3 text-xs text-slate-500">
                No previous research yet.
              </p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleLoadConversation(conversation.id)}
                  disabled={isTyping || isLoading}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm transition ${
                    activeConversationId === conversation.id
                      ? "bg-slate-800 text-cyan-300"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  } disabled:opacity-50`}
                >
                  <MessageSquare size={15} className="shrink-0" />
                  <span className="truncate">
                    {conversation.title}
                  </span>
                </button>
              ))
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/80 px-4 py-3 sm:px-6">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <PanelLeftClose size={18} />
              ) : (
                <PanelLeftOpen size={18} />
              )}
            </button>

            <div>
              <h1 className="text-sm font-semibold text-slate-100 sm:text-base">
                Research Analysis Agent
              </h1>

              <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {isTyping ? "Researching..." : "Ready to analyze"}
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scroll-smooth">

          {isLoading ? (
            <div className="flex h-full items-center justify-center text-slate-400">
              <Loader2 className="mr-2 animate-spin" size={20} />
              Loading conversation...
            </div>
          ) : isEmpty ? (
            <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-8 px-4 py-10">

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white">
                  <Microscope size={32} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Research Analysis Agent
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Ask a research question and get a detailed analysis.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-2xl">
                <SuggestedPrompts onPick={handleSend} />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl py-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                />
              ))}

              {isTyping && (
                <div className="mx-auto max-w-3xl">
                  <div className="ml-12 mt-1">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSend={handleSend}
          disabled={isTyping || isLoading}
        />
      </main>
    </div>
  );
}
