"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiService, ChatResponse } from "@/services/api/ai.service";
import { useAuth } from "@/hooks/useAuth";
import type { UIComponent } from "@/types/ai-components";

// ── Types ────────────────────────────────────────────────

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  intent?: string | null;
  agentType?: string | null;
  confidence?: number | null;
  data?: Record<string, unknown>[] | null;
  uiComponents?: UIComponent[] | null;
  hasProposal?: boolean;
  isLoading?: boolean;
}

interface UseChatOptions {
  language?: "ar" | "fr" | "en";
  onAutoExpand?: () => void;
}

// ── Hook ─────────────────────────────────────────────────

let msgCounter = 100; // Global counter to ensure unique IDs during session
const generateId = () => {
  msgCounter += 1;
  return Date.now() + msgCounter;
};

export function useChat(options: UseChatOptions = {}) {
  const { language = "en", onAutoExpand } = options;
  const { session, user } = useAuth();

  // Use session or user from context, with a fallback check
  const activeToken = session?.access_token;
  const activeUserId = session?.user?.id || user?.id;

  console.log("useChat: hook rendering with identity:", {
    hasToken: !!activeToken,
    userId: activeUserId,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hello! I'm your **PortFlow AI** assistant. How can I help you optimize your terminal operations today?",
    },
  ]);

  const sessionIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ── Mutation ─────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      abortControllerRef.current = new AbortController();
      console.log("useChat: mutationFn started", {
        message,
        hasToken: !!activeToken,
        userId: activeUserId,
      });

      try {
        const result = await aiService.sendMessage(
          {
            message,
            session_id: sessionIdRef.current,
            language,
          },
          activeToken,
          activeUserId,
          abortControllerRef.current.signal,
        );
        return result;
      } finally {
        // We don't clear the ref here immediately because we might want to know if it was active,
        // but typically for one-flight-at-a-time it is fine.
        // However, if we clear it, stopGeneration might check null.
        // Actually, clearing it in finally is good practice if we don't reuse it.
        // But if `stopGeneration` is called, it calls abort(), then this finally block runs.
      }
    },

    onMutate: (variables) => {
      console.log("useChat: onMutate started", variables);
      const loadingId = generateId();
      setMessages((prev) => {
        const next: ChatMessage[] = [
          ...prev,
          {
            id: loadingId,
            role: "assistant" as const,
            text: "",
            isLoading: true,
          },
        ];
        console.log("useChat: messages state after onMutate", next);
        return next;
      });
    },

    onSuccess: (data: ChatResponse) => {
      console.log("useChat: mutation success", data);
      // Persist session for multi-turn conversation
      sessionIdRef.current = data.session_id;

      const uiComponents = data.ui_components ?? null;

      const hasProposal = Boolean(
        uiComponents?.some((c) => c.type === "approval") ||
        (data.agent_type &&
          data.agent_type !== "ORCHESTRATOR" &&
          data.data?.length),
      );

      // Replace the loading placeholder with the real response
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => !m.isLoading);
        console.log("useChat: updating messages with response", {
          withoutLoadingLength: withoutLoading.length,
        });
        return [
          ...withoutLoading,
          {
            id: generateId(),
            role: "assistant" as const,
            text: data.response,
            intent: data.intent,
            agentType: data.agent_type,
            confidence: data.confidence,
            data: data.data,
            uiComponents,
            hasProposal,
          },
        ];
      });

      // Auto-expand to large when the response contains rich UI components or structured data
      if (hasProposal || (uiComponents && uiComponents.length > 0)) {
        onAutoExpand?.();
      }
    },

    onError: (error: Error) => {
      if (error.name === "AbortError") {
        setMessages((prev) => prev.filter((m) => !m.isLoading));
        return;
      }
      console.error("useChat: mutation error", error);
      // Replace loading placeholder with error message
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => !m.isLoading);
        return [
          ...withoutLoading,
          {
            id: generateId(),
            role: "assistant" as const,
            text: `⚠️ **Error**: ${error.message}. Please try again.`,
          },
        ];
      });
    },
  });

  // ── Send handler ─────────────────────────────────────

  const sendMessage = useCallback(
    (text: string) => {
      console.log("useChat: sendMessage called", {
        text,
        isPending: mutation.isPending,
      });
      if (!text.trim() || mutation.isPending) {
        console.warn("useChat: sendMessage skipped", {
          text,
          isPending: mutation.isPending,
        });
        return;
      }

      // Add user message
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "user", text },
      ]);

      console.log("useChat: calling mutation.mutate");
      mutation.mutate(text);
    },
    [mutation],
  );

  // ── Reset conversation ───────────────────────────────

  const resetChat = useCallback(() => {
    sessionIdRef.current = null;
    setMessages([
      {
        id: 1,
        role: "assistant",
        text: "Hello! I'm your **PortFlow AI** assistant. How can I help you optimize your terminal operations today?",
      },
    ]);
  }, []);

  const loadSession = useCallback(
    (sessionId: string, pastMessages: ChatMessage[]) => {
      sessionIdRef.current = sessionId;
      setMessages(pastMessages);
    },
    [],
  );

  const getSessionId = useCallback(() => sessionIdRef.current, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    messages,
    sendMessage,
    resetChat,
    loadSession,
    getSessionId,
    stopGeneration,
    isLoading: mutation.isPending,
  };
}
