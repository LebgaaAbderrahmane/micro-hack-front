/**
 * ──────────────────────────────────────────────────────────
 *  AI Chat Demo / Fake Handler for MSW
 * ──────────────────────────────────────────────────────────
 *
 *  Intercepts POST /api/v1/chat/ and returns scripted
 *  ChatResponse objects with rich ui_components for every
 *  demo prompt.  Used when the real AI backend is offline
 *  or during live demonstrations.
 *
 *  Activate by importing into src/mocks/handlers.ts.
 * ──────────────────────────────────────────────────────────
 */

import { http, HttpResponse, delay } from "msw";

// ── Types (mirroring ai.service.ts & ai-components.ts) ──

interface ChatRequest {
  message: string;
  session_id?: string | null;
  language?: "ar" | "fr" | "en";
}

interface ChatResponseBody {
  session_id: string;
  response: string;
  intent: string | null;
  confidence: number | null;
  agent_type: string | null;
  data: Record<string, unknown>[] | null;
  ui_components?: unknown[] | null;
}

// ── Helpers ──────────────────────────────────────────────

let sessionCounter = 0;
const getSessionId = (existing?: string | null) =>
  existing ?? `demo-session-${++sessionCounter}-${Date.now()}`;

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

function match(input: string, patterns: string[]): boolean {
  const n = normalise(input);
  return patterns.some((p) => n.includes(p));
}

// ── Scripted responses ───────────────────────────────────

export function buildResponse(
  req: ChatRequest,
): ChatResponseBody {
  const sid = getSessionId(req.session_id);
  const msg = req.message;

  // ─── 1. Show my recent bookings ─────────────────────
  if (match(msg, ["recent bookings", "my bookings", "show bookings", "list bookings"])) {
    return {
      session_id: sid,
      response:
        "Here are your **5 most recent bookings** across all terminals. I've included a quick summary of your booking stats as well.",
      intent: "list_bookings",
      confidence: 0.96,
      agent_type: "BOOKING",
      data: null,
      ui_components: [
        {
          type: "stats",
          title: "Booking Overview",
          items: [
            { label: "Total Bookings", value: 47, trend: "up", color: "blue" },
            { label: "Confirmed", value: 38, trend: "up", color: "green" },
            { label: "Pending", value: 6, trend: "neutral", color: "amber" },
            { label: "Cancelled", value: 3, trend: "down", color: "red" },
          ],
        },
        {
          type: "table",
          title: "Recent Bookings",
          columns: [
            { key: "reference", header: "Reference", type: "text" },
            { key: "terminal", header: "Terminal", type: "text" },
            { key: "truck", header: "Truck Plate", type: "text" },
            { key: "date", header: "Date", type: "date" },
            { key: "status", header: "Status", type: "status" },
          ],
          data: [
            { reference: "BK-2026-0451", terminal: "Terminal North", truck: "TX-992-BK", date: "2026-02-08T10:00:00Z", status: "confirmed" },
            { reference: "BK-2026-0450", terminal: "Terminal South", truck: "TX-881-AL", date: "2026-02-08T14:30:00Z", status: "pending" },
            { reference: "BK-2026-0449", terminal: "Terminal North", truck: "TX-773-MN", date: "2026-02-07T09:00:00Z", status: "confirmed" },
            { reference: "BK-2026-0448", terminal: "Terminal West", truck: "TX-992-BK", date: "2026-02-07T16:00:00Z", status: "completed" },
            { reference: "BK-2026-0447", terminal: "Terminal South", truck: "TX-881-AL", date: "2026-02-06T11:30:00Z", status: "cancelled" },
          ],
        },
      ],
    };
  }

  // ─── 2. Check available slots for today ─────────────
  if (match(msg, ["available slots", "slots for today", "slots today", "free slots", "check slots"])) {
    return {
      session_id: sid,
      response:
        "I've checked all terminals for **today's available time slots**. Terminal North has the most availability. Here's the hourly breakdown and top open slots.",
      intent: "search_slots",
      confidence: 0.94,
      agent_type: "SLOT",
      data: null,
      ui_components: [
        {
          type: "chart",
          title: "Available Slots by Hour (Today)",
          chart_type: "bar",
          x_axis_label: "Hour",
          y_axis_label: "Available Slots",
          data: [
            { label: "06:00", value: 8 },
            { label: "07:00", value: 5 },
            { label: "08:00", value: 3 },
            { label: "09:00", value: 2 },
            { label: "10:00", value: 6 },
            { label: "11:00", value: 9 },
            { label: "12:00", value: 12 },
            { label: "13:00", value: 10 },
            { label: "14:00", value: 7 },
            { label: "15:00", value: 4 },
            { label: "16:00", value: 3 },
            { label: "17:00", value: 5 },
          ],
        },
        {
          type: "table",
          title: "Top Available Slots",
          columns: [
            { key: "terminal", header: "Terminal", type: "text" },
            { key: "gate", header: "Gate", type: "text" },
            { key: "time", header: "Time Slot", type: "text" },
            { key: "capacity", header: "Capacity", type: "number" },
            { key: "status", header: "Status", type: "status" },
          ],
          data: [
            { terminal: "Terminal North", gate: "Gate A1", time: "12:00 – 12:30", capacity: 4, status: "available" },
            { terminal: "Terminal North", gate: "Gate A2", time: "12:30 – 13:00", capacity: 3, status: "available" },
            { terminal: "Terminal South", gate: "Gate B1", time: "11:00 – 11:30", capacity: 2, status: "available" },
            { terminal: "Terminal West", gate: "Gate C1", time: "13:00 – 13:30", capacity: 5, status: "available" },
            { terminal: "Terminal North", gate: "Gate A3", time: "11:30 – 12:00", capacity: 2, status: "limited" },
          ],
        },
      ],
    };
  }

  // ─── 3. Show terminal capacity ──────────────────────
  if (match(msg, ["terminal capacity", "capacity", "terminal utilization", "utilization"])) {
    return {
      session_id: sid,
      response:
        "Here's the **current terminal capacity overview** across all 3 terminals, along with the 24-hour utilization trend.",
      intent: "get_capacity",
      confidence: 0.97,
      agent_type: "SLOT",
      data: null,
      ui_components: [
        {
          type: "stats",
          title: "Live Terminal Metrics",
          items: [
            { label: "Avg Utilization", value: "72%", trend: "up", color: "blue" },
            { label: "Gate Throughput", value: "186/hr", trend: "up", color: "green" },
            { label: "Active Trucks", value: 34, trend: "neutral", color: "amber" },
            { label: "Avg Wait Time", value: "12 min", trend: "down", color: "green" },
          ],
        },
        {
          type: "chart",
          title: "24h Terminal Utilization (%)",
          chart_type: "area",
          x_axis_label: "Time",
          y_axis_label: "Utilization %",
          data: [
            { label: "00:00", value: 15 },
            { label: "02:00", value: 10 },
            { label: "04:00", value: 8 },
            { label: "06:00", value: 25 },
            { label: "08:00", value: 65 },
            { label: "10:00", value: 82 },
            { label: "12:00", value: 78 },
            { label: "14:00", value: 88 },
            { label: "16:00", value: 72 },
            { label: "18:00", value: 55 },
            { label: "20:00", value: 30 },
            { label: "22:00", value: 18 },
          ],
        },
      ],
    };
  }

  // ─── 4. Book a slot (booking card + approval) ───────
  if (match(msg, ["book a slot", "create booking", "book slot", "new booking", "reserve a slot", "book at terminal"])) {
    return {
      session_id: sid,
      response:
        "I've prepared a **booking proposal** for you. Please review the details below and confirm or cancel.",
      intent: "propose_create_booking",
      confidence: 0.93,
      agent_type: "BOOKING",
      data: null,
      ui_components: [
        {
          type: "booking_card",
          title: "Proposed Booking",
          booking_reference: "BK-2026-0452",
          status: "pending_approval",
          truck_plate: "TX-992-BK",
          driver_name: "John Doe",
          time_slot: "Feb 9, 2026 — 10:00 to 10:30",
          location: "Terminal North – Gate A1",
        },
        {
          type: "approval",
          title: "Confirm Booking",
          action_type: "create_booking",
          entity_id: "BK-2026-0452",
          description:
            "Create a new booking at Terminal North, Gate A1 for truck TX-992-BK on Feb 9 at 10:00.",
          data: {
            terminal: "Terminal North",
            gate: "Gate A1",
            truck_plate: "TX-992-BK",
            driver: "John Doe",
            time_slot: "2026-02-09T10:00:00Z",
          },
        },
      ],
    };
  }

  // ─── 5. Approve / Confirm a booking ─────────────────
  if (match(msg, ["approved create_booking", "confirm booking", "approved", "approve"])) {
    return {
      session_id: sid,
      response:
        "✅ **Booking confirmed!** Reference **BK-2026-0452** has been successfully created. The driver will receive a notification shortly.",
      intent: "confirm_create_booking",
      confidence: 0.99,
      agent_type: "BOOKING",
      data: null,
      ui_components: [
        {
          type: "booking_card",
          title: "Confirmed Booking",
          booking_reference: "BK-2026-0452",
          status: "confirmed",
          truck_plate: "TX-992-BK",
          driver_name: "John Doe",
          time_slot: "Feb 9, 2026 — 10:00 to 10:30",
          location: "Terminal North – Gate A1",
        },
        {
          type: "stats",
          title: "Booking Impact",
          items: [
            { label: "Gate A1 Load", value: "78%", trend: "up", color: "amber" },
            { label: "Your Bookings Today", value: 4, trend: "up", color: "blue" },
            { label: "Est. Wait Time", value: "8 min", trend: "down", color: "green" },
          ],
        },
      ],
    };
  }

  // ─── 6. Reject / Cancel a booking ───────────────────
  if (match(msg, ["rejected create_booking", "cancel booking", "rejected", "reject"])) {
    return {
      session_id: sid,
      response:
        "❌ **Booking cancelled.** The proposed booking BK-2026-0452 has been discarded. Would you like to try a different time slot?",
      intent: "cancel_create_booking",
      confidence: 0.99,
      agent_type: "BOOKING",
      data: null,
      ui_components: null,
    };
  }

  // ─── 7. Show booking history for last week ──────────
  if (match(msg, ["booking history", "history last week", "past bookings", "history", "audit trail"])) {
    return {
      session_id: sid,
      response:
        "Here's your **booking history for the past 7 days**, including daily volume trends and a detailed log.",
      intent: "booking_history",
      confidence: 0.92,
      agent_type: "HISTORY",
      data: null,
      ui_components: [
        {
          type: "chart",
          title: "Daily Booking Volume (Last 7 Days)",
          chart_type: "line",
          x_axis_label: "Date",
          y_axis_label: "Bookings",
          data: [
            { label: "Feb 2", value: 12 },
            { label: "Feb 3", value: 18 },
            { label: "Feb 4", value: 15 },
            { label: "Feb 5", value: 22 },
            { label: "Feb 6", value: 19 },
            { label: "Feb 7", value: 25 },
            { label: "Feb 8", value: 14 },
          ],
        },
        {
          type: "table",
          title: "Booking Audit Log",
          columns: [
            { key: "reference", header: "Reference", type: "text" },
            { key: "action", header: "Action", type: "text" },
            { key: "terminal", header: "Terminal", type: "text" },
            { key: "date", header: "Date", type: "date" },
            { key: "status", header: "Result", type: "status" },
          ],
          data: [
            { reference: "BK-2026-0451", action: "Created", terminal: "Terminal North", date: "2026-02-08T10:00:00Z", status: "confirmed" },
            { reference: "BK-2026-0450", action: "Created", terminal: "Terminal South", date: "2026-02-08T14:30:00Z", status: "pending" },
            { reference: "BK-2026-0449", action: "Rescheduled", terminal: "Terminal North", date: "2026-02-07T09:00:00Z", status: "confirmed" },
            { reference: "BK-2026-0448", action: "Completed", terminal: "Terminal West", date: "2026-02-07T16:00:00Z", status: "completed" },
            { reference: "BK-2026-0447", action: "Cancelled", terminal: "Terminal South", date: "2026-02-06T11:30:00Z", status: "cancelled" },
            { reference: "BK-2026-0446", action: "Created", terminal: "Terminal North", date: "2026-02-05T08:00:00Z", status: "completed" },
            { reference: "BK-2026-0445", action: "Created", terminal: "Terminal West", date: "2026-02-04T13:00:00Z", status: "completed" },
          ],
        },
      ],
    };
  }

  // ─── 8. Show fleet / trucks status ──────────────────
  if (match(msg, ["fleet status", "truck status", "my trucks", "show trucks", "fleet overview"])) {
    return {
      session_id: sid,
      response:
        "Here's your **fleet overview** with current truck statuses and a breakdown by status category.",
      intent: "list_trucks",
      confidence: 0.91,
      agent_type: "BOOKING",
      data: null,
      ui_components: [
        {
          type: "stats",
          title: "Fleet Summary",
          items: [
            { label: "Total Trucks", value: 12, trend: "neutral", color: "blue" },
            { label: "Active / In Transit", value: 8, trend: "up", color: "green" },
            { label: "In Maintenance", value: 2, trend: "down", color: "red" },
            { label: "Idle", value: 2, trend: "neutral", color: "amber" },
          ],
        },
        {
          type: "chart",
          title: "Fleet Status Distribution",
          chart_type: "pie",
          data: [
            { label: "Active", value: 5 },
            { label: "In Transit", value: 3 },
            { label: "Maintenance", value: 2 },
            { label: "Idle", value: 2 },
          ],
        },
        {
          type: "table",
          title: "Truck Details",
          columns: [
            { key: "plate", header: "License Plate", type: "text" },
            { key: "model", header: "Model", type: "text" },
            { key: "driver", header: "Driver", type: "text" },
            { key: "fuel", header: "Fuel %", type: "number" },
            { key: "status", header: "Status", type: "status" },
          ],
          data: [
            { plate: "TX-992-BK", model: "Volvo FH16", driver: "John Doe", fuel: 65, status: "in_transit" },
            { plate: "TX-881-AL", model: "Scania R500", driver: "Sarah Smith", fuel: 82, status: "active" },
            { plate: "TX-773-MN", model: "Mercedes Actros", driver: "—", fuel: 15, status: "maintenance" },
            { plate: "TX-664-QR", model: "DAF XF", driver: "Ahmed Benali", fuel: 90, status: "active" },
            { plate: "TX-555-WX", model: "MAN TGX", driver: "—", fuel: 45, status: "idle" },
          ],
        },
      ],
    };
  }

  // ─── DEFAULT FALLBACK ───────────────────────────────
  return {
    session_id: sid,
    response:
      "I understand your request. As your **PortFlow AI** assistant, I can help you with:\n\n" +
      "• **Booking management** — View, create, or cancel bookings\n" +
      "• **Slot availability** — Check open time slots across terminals\n" +
      "• **Terminal capacity** — Monitor real-time utilization\n" +
      "• **Booking history** — Review past activity and audit trails\n" +
      "• **Fleet status** — Check your trucks and drivers\n\n" +
      "Try one of the suggested prompts or ask me anything about your terminal operations!",
    intent: null,
    confidence: 0.85,
    agent_type: "ORCHESTRATOR",
    data: null,
    ui_components: null,
  };
}

// ── MSW Handler ──────────────────────────────────────────

export const aiChatHandlers = [
  http.post("*/api/v1/chat/*", async ({ request }) => {
    const body = (await request.json()) as ChatRequest;
    console.log("[AI Mock] Received message:", body.message);

    // Simulate realistic AI processing delay (600–1200ms)
    await delay(600 + Math.random() * 600);

    const response = buildResponse(body);
    console.log("[AI Mock] Responding with:", {
      intent: response.intent,
      agent_type: response.agent_type,
      components: response.ui_components?.length ?? 0,
    });

    return HttpResponse.json(response);
  }),

  // Health-check endpoint
  http.get("*/api/v1/chat/test", () => {
    return HttpResponse.json({ status: "ok", mode: "demo" });
  }),
];
