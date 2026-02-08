# PortFlow AI Agent Behavior Guide

This document defines the expected interactions between users and the PortFlow AI Intelligent Logistics Assistant. It serves as a reference for testing, prompt engineering, and user training.

## 🧠 Core Architecture
The AI operates as a **Multi-Agent System** using LangGraph.
1.  **Orchestrator**: Receives the raw query, detects intent, and routes to a sub-agent.
2.  **Specialized Agents**:
    *   **Booking Agent**: Handles booking lookup and cancellation proposals.
    *   **Slot Agent**: Handles terminal capacity and time-slot queries.
    *   **History Agent**: Handles audit trails, gate logs, and reporting.

### Proposal-Based Action Model
The AI **never executes write/destructive actions directly**. All mutations follow a strict two-step flow:

```
User Request → AI reads data → AI proposes action → User accepts/declines/modifies → AI executes (only on accept)
```

Tools follow a `propose_<action>` / `confirm_<action>` naming convention.

---

## 📋 Scenarios & Expected Behaviors

### 1. Booking Management
**Scope**: Bookings, Truck/Driver assignment, Status checks.
**Context**: User's `org_id` is automatically injected to filter results (RBAC).

| User Intent | Example Query | Expected AI Behavior | Tool Used |
| :--- | :--- | :--- | :--- |
| **Check Status** | *"What is the status of booking BK-ALG-2026-001?"* | 1. Extract reference `BK-ALG-2026-001`.<br>2. Call booking lookup tool.<br>3. Return status status cleanly (e.g., "The booking is currently **CONFIRMED** and scheduled for 14:00."). | `get_booking_details` |
| **List Bookings** | *"Show me my bookings for today."* | 1. Identify "today" relative to current server time.<br>2. Filter by authenticated user's `org_id`.<br>3. Return a table or list of bookings with time, truck plate, and status. | `list_bookings` |
| **Cancel Booking** | *"Cancel my booking for the plate 00100-116-16 tomorrow."* | 1. **Search** for the booking using read-only tools.<br>2. Call `propose_cancel_booking` to build a proposal.<br>3. **Present the proposal** to the user: "I propose to cancel booking BK-ALG-20260208-001 (CONFIRMED, 07:00–09:00 at ALG-T1). This will free one slot. Proceed?"<br>4. **Wait** for user response.<br>5. If user says "Yes" → call `confirm_cancel_booking`.<br>6. If user says "No" → acknowledge and do nothing.<br>7. If user modifies → adjust and re-propose. | `propose_cancel_booking`, then `confirm_cancel_booking` |
| **Out of Scope** | *"Book a flight to Oran."* | 1. Politely decline.<br>2. Remind user of scope (Truck/Terminal logistics). | *None* |

### 2. Slots & Capacity
**Scope**: Terminal availability, Slot templates, Occupancy.

| User Intent | Example Query | Expected AI Behavior | Tool Used |
| :--- | :--- | :--- | :--- |
| **Check Availability** | *"Is there space at Terminal 1 tomorrow morning?"* | 1. Identify "Terminal 1" matches `ALG-T1`.<br>2. Query active slots for tomorrow.<br>3. Summarize availability (e.g., "Yes, there are **15 slots available** between 08:00 and 12:00."). | `get_terminal_slots` |
| **Terminal Info** | *"How full is the container terminal right now?"* | 1. Fetch real-time occupancy data.<br>2. Report current occupancy vs. max capacity (e.g., "The Container Terminal is at **85% capacity** (102/120 spaces used)."). | `get_terminal_status` |
| **Slot Schedule** | *"What are the standard opening hours for Gate 2?"* | 1. Lookup slot templates or gate info.<br>2. Return operational hours. | `get_gate_info` |

### 3. History & Audit
**Scope**: Past events, Gate logs, Audit trails.

| User Intent | Example Query | Expected AI Behavior | Tool Used |
| :--- | :--- | :--- | :--- |
| **Gate History** | *"When did trunk 123-ABC-16 enter the port last week?"* | 1. Search gate logs for the plate number.<br>2. Return entry/exit timestamps for the requested period. | `get_gate_logs` |
| **Booking Audit** | *"Who cancelled booking BK-999?"* | 1. Retrieve audit log for that booking ID.<br>2. Identify the actor/user who performed the 'CANCELLED' action.<br>3. Return the username and timestamp. | `get_booking_audit_trail` |

---

## 🛡️ Operational Rules

### 1. Security & RBAC
*   **Carrier Constraint**: A Carrier user asking *"Show me all bookings"* must **ONLY** see bookings where `carrier_org_id` matches their own organization. The AI must strictly apply this filter using the context provided by the backend.
*   **Terminal Operator**: Can see bookings and slots for their specific terminal(s).

### 2. Hallucination Prevention
*   **Rule**: Never invent booking IDs or availability.
*   **Fallback**: If a tool returns "No results", the AI must state "I couldn't find any records matching that criteria" rather than making up a likely answer.

### 3. Language Support
*   The AI must detect the input language (English, French, or Arabic) and respond in the **same language**.
    *   *Input*: "Kayan blassa ghodwa?" (Algerian Arabic/Derja)
    *   *Response*: "Ih, kayan 5 des créneaux ghodwa sbah..."

### 4. Confirmation Protocols
For **all** write/destructive actions (Cancel, Update, Create):
1.  **User**: "Cancel booking X."
2.  **AI**: Calls `propose_cancel_booking` (read-only) → gets proposal with details and side-effects.
3.  **AI**: Presents to user: "I propose to cancel booking X scheduled for [Date] at [Terminal]. Side-effects: slot occupancy will decrease by 1, payment status is UNPAID. **Do you want to proceed?**"
4.  **User**: "Yes" / "No" / "Actually, cancel the other one instead."
5.  **AI (if accepted)**: Calls `confirm_cancel_booking` → executes the write.
6.  **AI (if declined)**: "Understood, the booking remains active."
7.  **AI (if modified)**: Re-proposes with the adjusted parameters.

---

## 🛠️ Tool Definitions (Technical Mappings)

| Agent | Python Function / Tool Name | Description |
| :--- | :--- | :--- |
| **Booking** | `search_bookings(query, org_id)` | Semantic/Fuzzy search for bookings. |
| | `get_booking_details(reference)` | Exact lookup by ref. |
| | `propose_cancel_booking(id)` | Read-only: builds cancellation proposal with side-effects. |
| | `confirm_cancel_booking(id, reason)` | Write: executes cancellation after user acceptance. |
| **Slot** | `list_active_slots(terminal_id, date)` | Returns JSON list of slots with occupancy. |
| | `get_terminal_metrics(terminal_id)` | Returns capacity aggregation. |
| **History** | `get_gate_events(plate_number)` | Returns entry/exit logs. |
