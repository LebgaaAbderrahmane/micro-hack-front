import { createClient } from "@/utils/supabase/client";

const AI_API_URL = (process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000").replace(/\/$/, "").replace("https://localhost", "http://localhost");

// ── Request / Response types matching the FastAPI backend ──

export interface ChatRequest {
  message: string;
  session_id?: string | null;
  language?: "ar" | "fr" | "en";
}

export interface ChatResponse {
  session_id: string;
  response: string;
  intent: string | null;
  confidence: number | null;
  agent_type: string | null;
  data: Record<string, unknown>[] | null;
}

// ── Auth helper ──

async function getAuthHeaders(
  providedToken?: string,
  providedUserId?: string,
): Promise<Record<string, string>> {
  if (providedToken && providedUserId) {
    return {
      Authorization: `Bearer ${providedToken}`,
      "Content-Type": "application/json",
      "X-User-Id": providedUserId,
    };
  }

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
    "X-User-Id": session.user.id,
  };
}

// ── Service ──

export const aiService = {
  /**
   * POST /api/v1/chat/
   * Send a user message to the PortFlow LangGraph orchestrator.
   */
  async sendMessage(
    payload: ChatRequest,
    token?: string,
    userId?: string,
  ): Promise<ChatResponse> {
    const headers = await getAuthHeaders(token, userId);

    const res = await fetch(`${AI_API_URL}/api/v1/chat/`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }).catch((err) => {
      throw new Error(
        `Connection to AI Backend failed. Is it running at ${AI_API_URL}?`,
      );
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`AI chat failed (${res.status}): ${body}`);
    }

    return (await res.json()) as ChatResponse;
  },

  /**
   * GET /api/v1/chat/test
   * Quick health-check for the LLM model.
   */
  async testModel(): Promise<{ status: string; model?: string }> {
    const headers = await getAuthHeaders();

    const res = await fetch(`${AI_API_URL}/api/v1/chat/test`, { headers });

    if (!res.ok) {
      throw new Error(`LLM health-check failed (${res.status})`);
    }

    return res.json();
  },
};
