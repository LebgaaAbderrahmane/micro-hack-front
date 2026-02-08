# 🤖 AI Chat Demo Mode — Prompts & Guide

> **Purpose**: This document lists every scripted prompt supported by the AI chat fake/demo mode.
> Use these prompts during live demonstrations to showcase how the AI assistant responds
> with rich interactive widgets (tables, charts, stats, booking cards, approval flows).

---

## How It Works

The demo mode uses **MSW (Mock Service Worker)** to intercept `POST /api/v1/chat/` requests
in the browser before they reach the real backend. Each prompt is pattern-matched and returns
a pre-built `ChatResponse` with realistic data and interactive `ui_components`.

- **File**: `src/mocks/ai-chat-handler.ts`
- **Wired in**: `src/mocks/handlers.ts`
- **Response delay**: 600–1200ms (randomised for realism)
- **No backend required** — works fully offline with MSW enabled

---

## 📋 Demo Prompts

### 1. Show My Recent Bookings

| Field | Value |
|---|---|
| **Prompt** | `Show my recent bookings` |
| **Also triggers on** | "my bookings", "list bookings", "show bookings" |
| **Agent Badge** | 🔵 Booking Agent |
| **Confidence** | 96% |
| **Widgets Rendered** | `stats` + `table` |

**What you'll see:**
- **Stats bar** — 4 KPIs: Total Bookings (47 ↑), Confirmed (38 ↑), Pending (6 →), Cancelled (3 ↓)
- **Table** — 5 rows showing reference, terminal, truck plate, date, and status badges

---

### 2. Check Available Slots for Today

| Field | Value |
|---|---|
| **Prompt** | `Check available slots for today` |
| **Also triggers on** | "available slots", "slots today", "free slots", "check slots" |
| **Agent Badge** | 🟢 Slot Agent |
| **Confidence** | 94% |
| **Widgets Rendered** | `chart` (bar) + `table` |

**What you'll see:**
- **Bar chart** — Hourly slot availability from 06:00 to 17:00, showing peak availability at noon
- **Table** — Top 5 open slots with terminal, gate, time window, capacity, and status

---

### 3. Show Terminal Capacity

| Field | Value |
|---|---|
| **Prompt** | `Show terminal capacity` |
| **Also triggers on** | "capacity", "terminal utilization", "utilization" |
| **Agent Badge** | 🟢 Slot Agent |
| **Confidence** | 97% |
| **Widgets Rendered** | `stats` + `chart` (area) |

**What you'll see:**
- **Stats bar** — 4 KPIs: Avg Utilization (72% ↑), Gate Throughput (186/hr ↑), Active Trucks (34 →), Avg Wait Time (12 min ↓)
- **Area chart** — 24-hour utilization curve from 00:00 to 22:00, peaking at 14:00 (88%)

---

### 4. Book a Slot at Terminal North

| Field | Value |
|---|---|
| **Prompt** | `Book a slot at Terminal North` |
| **Also triggers on** | "book a slot", "create booking", "new booking", "reserve a slot", "book at terminal" |
| **Agent Badge** | 🔵 Booking Agent |
| **Confidence** | 93% |
| **Widgets Rendered** | `booking_card` + `approval` |

**What you'll see:**
- **Booking card** — Shows proposed booking BK-2026-0452 with truck TX-992-BK, driver John Doe, time slot Feb 9 10:00–10:30, location Terminal North Gate A1, status "pending_approval"
- **Approval widget** — Two buttons: ✅ Approve / ❌ Reject

**Follow-up after clicking Approve:**
- Response confirms booking with a ✅ success message
- Shows the booking card with status "confirmed"
- Stats showing gate load, today's booking count, estimated wait time

**Follow-up after clicking Reject:**
- Response shows ❌ cancelled message
- Asks if you'd like to try a different time slot

---

### 5. Show Booking History for Last Week

| Field | Value |
|---|---|
| **Prompt** | `Show booking history for last week` |
| **Also triggers on** | "booking history", "history last week", "past bookings", "history", "audit trail" |
| **Agent Badge** | 🟠 History Agent |
| **Confidence** | 92% |
| **Widgets Rendered** | `chart` (line) + `table` |

**What you'll see:**
- **Line chart** — Daily booking volume over 7 days (Feb 2–8), showing an upward trend
- **Table** — 7-row audit log with reference, action (Created/Rescheduled/Completed/Cancelled), terminal, date, and result status

---

### 6. Show Fleet Status

| Field | Value |
|---|---|
| **Prompt** | `Show fleet status` |
| **Also triggers on** | "fleet status", "truck status", "my trucks", "show trucks", "fleet overview" |
| **Agent Badge** | 🔵 Booking Agent |
| **Confidence** | 91% |
| **Widgets Rendered** | `stats` + `chart` (pie) + `table` |

**What you'll see:**
- **Stats bar** — 4 KPIs: Total Trucks (12 →), Active/In Transit (8 ↑), In Maintenance (2 ↓), Idle (2 →)
- **Pie chart** — Fleet status distribution (Active 5, In Transit 3, Maintenance 2, Idle 2)
- **Table** — 5 trucks with plate, model, driver, fuel %, and status

---

### Fallback (Any Other Prompt)

| Field | Value |
|---|---|
| **Prompt** | Anything not matching the above |
| **Agent Badge** | None (Orchestrator) |
| **Confidence** | 85% |
| **Widgets Rendered** | None (text only) |

**What you'll see:**
- A friendly message listing the assistant's capabilities with bullet points
- Encourages the user to try one of the suggested prompts

---

## 🎬 Recommended Demo Script

For the best demonstration flow, present the prompts in this order:

1. **"Show terminal capacity"** — Opens with impressive stats + area chart to set the scene
2. **"Check available slots for today"** — Bar chart + table shows slot management
3. **"Book a slot at Terminal North"** — Interactive booking card + approval buttons
4. *(Click Approve)* — Confirmation flow with updated booking card
5. **"Show my recent bookings"** — Stats overview + table showing the full booking list
6. **"Show booking history for last week"** — Line chart trend + audit log
7. **"Show fleet status"** — Pie chart + stats + table for fleet management

This order demonstrates **all 5 widget types** (stats, chart with 4 sub-types, table, booking_card, approval) and the **full approval workflow** (propose → confirm).

---

## 🔧 Technical Reference

### Widget Types Demonstrated

| Widget | Component | Prompt(s) |
|---|---|---|
| `stats` | `AIStats.tsx` | #1, #3, #4 (confirm), #6 |
| `table` | `AITable.tsx` | #1, #2, #5, #6 |
| `chart` (bar) | `AIChart.tsx` | #2 |
| `chart` (area) | `AIChart.tsx` | #3 |
| `chart` (line) | `AIChart.tsx` | #5 |
| `chart` (pie) | `AIChart.tsx` | #6 |
| `booking_card` | `AIBookingCard.tsx` | #4, #4 (confirm) |
| `approval` | `AIApproval.tsx` | #4 |

### Agent Types Used

| Agent | Badge Color | Prompt(s) |
|---|---|---|
| `BOOKING` | 🔵 Blue | #1, #4, #6 |
| `SLOT` | 🟢 Green | #2, #3 |
| `HISTORY` | 🟠 Amber | #5 |
| `ORCHESTRATOR` | (none) | Fallback |

### Files Modified/Created

| File | Change |
|---|---|
| `src/mocks/ai-chat-handler.ts` | **New** — All scripted responses |
| `src/mocks/handlers.ts` | Imported + spread `aiChatHandlers` |
| `src/components/common/AIChat.tsx` | Extended `RECOMMENDED_PROMPTS` to 6 |
