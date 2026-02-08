import { createClient } from "@/utils/supabase/client";
import type { UIComponent } from "@/types/ai-components";
import { buildResponse as buildDemoResponse } from "@/mocks/ai-chat-handler";

const AI_API_URL = (
  process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000"
)
  .replace(/\/$/, "")
  .replace("https://localhost", "http://localhost");

// Demo mode: always on — set to false to use the real AI backend
const AI_DEMO_MODE = true;

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
  ui_components?: UIComponent[] | null;
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
    signal?: AbortSignal,
  ): Promise<ChatResponse> {
    // ── Demo mode: return scripted response without network call ──
    if (AI_DEMO_MODE) {
      console.log(`[AI Service] Demo mode — generating mock response for: "${payload.message}"`);

      // Simulate realistic AI processing delay (600–1200ms)
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(resolve, 600 + Math.random() * 600);
        // Support abort signal even in demo mode
        signal?.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });

      return buildDemoResponse(payload) as ChatResponse;
    }

    // ── Real backend mode ──
    const headers = await getAuthHeaders(token, userId);

    const baseUrl = AI_API_URL.replace(/\/$/, "");
    const url = `${baseUrl}/api/v1/chat/`;

    console.log(`[AI Service] Sending message...`, {
      url,
      params: {
        tokenPresent: !!headers.Authorization,
        tokenLength: headers.Authorization?.length || 0,
        userId: headers["X-User-Id"],
      },
    });

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal,
    }).catch((err) => {
      if (err.name === "AbortError") throw err;
      console.error("[AI Service] Fetch error:", err);
      throw new Error(
        `Connection to AI Backend failed. Is it running at ${url}?`,
      );
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[AI Service] 401/Error Detail:`, body);
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
