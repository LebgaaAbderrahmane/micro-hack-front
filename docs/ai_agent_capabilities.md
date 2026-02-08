# AI Agent Capabilities

> Complete reference of what the PortFlow AI agent can do, which tools it uses, and how role-based access controls (RBAC) scope visibility.

---

## Architecture Overview

```
User ─→ POST /api/v1/chat/ ─→ Orchestrator Graph ─→ LLM (Mistral)
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
        Booking Agent          Slot Agent             Asset Agent
        (9 tools)              (7 tools)              (3 tools)
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      │
                               History Agent
                                (3 tools)
                                      │
                              UI Mapper ─→ ui_components[]
```

All tools are registered with the LLM via LangGraph's tool-calling mechanism.  
The LLM decides which tools to call based on the user's message and conversation context.

---

## Tool Inventory

### Booking Agent (9 tools)

| Tool | Type | Description |
|------|------|-------------|
| `lookup_booking_by_reference` | Read | Find a booking by its reference code (e.g. BK-ALG-20260208-001) |
| `list_carrier_bookings` | Read | List recent bookings for a carrier org, with optional status filter |
| `get_booking_details` | Read | Get full booking record by UUID |
| `search_bookings` | Read | Multi-filter search: date, status, type, carrier, priority, payment |
| `count_bookings_by_status` | Read | Aggregated status counts, optionally scoped by carrier/date |
| `propose_create_booking` | Proposal | Validate & propose a new booking (checks slot capacity, truck/driver ownership) |
| `propose_cancel_booking` | Proposal | Validate & propose cancellation (only PENDING/CONFIRMED) |
| `propose_update_booking_status` | Proposal | Validate & propose status transition (enforces lifecycle rules) |
| `propose_reschedule_booking` | Proposal | Validate & propose move to a different slot (checks availability) |

### Slot & Infrastructure Agent (7 tools)

| Tool | Type | Description |
|------|------|-------------|
| `list_ports` | Read | List all ports (name, code, wilaya) |
| `list_terminals_for_port` | Read | List terminals at a port by port code |
| `list_gates_for_port` | Read | List gates at a port with operational status |
| `search_available_slots` | Read | Find available time-slots with terminal/date filters |
| `get_terminal_capacity` | Read | Current capacity utilisation of a terminal (% used) |
| `get_slot_details` | Read | Full details of a specific slot by UUID |
| `recommend_slot` | Read | AI-ranked best slot recommendation for terminal + date |

### Asset Agent (3 tools)

| Tool | Type | Description |
|------|------|-------------|
| `list_carrier_trucks` | Read | List trucks for a carrier with optional status filter |
| `list_carrier_drivers` | Read | List drivers for a carrier with optional status filter |
| `search_containers` | Read | Multi-filter container search: number, status, terminal, empty/loaded |

### History Agent (3 tools)

| Tool | Type | Description |
|------|------|-------------|
| `get_passage_history` | Read | Gate passage logs (check-in, entry, exit, inspection) |
| `get_booking_audit_trail` | Read | Full change history of a booking (who, what, when, why) |
| `get_gate_activity_summary` | Read | Aggregated activity at a gate with event type breakdown |

---

## Role-Based Access Matrix

The LLM is instructed via system prompt to enforce scoping.  
`✅` = Full access | `🔒` = Scoped to own org | `❌` = No access

| Tool | ADMIN | OPERATOR | DISPATCHER | DRIVER |
|------|-------|----------|------------|--------|
| **Booking — Read** | ✅ All bookings | ✅ All (terminal scope) | 🔒 Own org only | 🔒 Own bookings |
| `lookup_booking_by_reference` | ✅ | ✅ | 🔒 | 🔒 |
| `list_carrier_bookings` | ✅ Any carrier | ✅ | 🔒 Own org_id | 🔒 Own org_id |
| `search_bookings` | ✅ All filters | ✅ | 🔒 Forced org_id | ❌ |
| `count_bookings_by_status` | ✅ | ✅ | 🔒 Own org_id | ❌ |
| `get_booking_details` | ✅ | ✅ | 🔒 | 🔒 |
| **Booking — Proposals** | ✅ | ✅ (status only) | 🔒 Create/cancel own | ❌ |
| `propose_create_booking` | ✅ | ❌ | 🔒 Own trucks/drivers | ❌ |
| `propose_cancel_booking` | ✅ | ✅ | 🔒 Own bookings | ❌ |
| `propose_update_booking_status` | ✅ | ✅ | ❌ | ❌ |
| `propose_reschedule_booking` | ✅ | ❌ | 🔒 Own bookings | ❌ |
| **Slots & Infrastructure** | ✅ | ✅ | ✅ | ✅ |
| `list_ports` | ✅ | ✅ | ✅ | ✅ |
| `list_terminals_for_port` | ✅ | ✅ | ✅ | ✅ |
| `list_gates_for_port` | ✅ | ✅ | ✅ | ✅ |
| `search_available_slots` | ✅ | ✅ | ✅ | ✅ |
| `get_terminal_capacity` | ✅ | ✅ | ✅ | ❌ |
| `recommend_slot` | ✅ | ✅ | ✅ | ❌ |
| **Assets** | ✅ All orgs | ❌ | 🔒 Own org | ❌ |
| `list_carrier_trucks` | ✅ | ❌ | 🔒 Own org_id | ❌ |
| `list_carrier_drivers` | ✅ | ❌ | 🔒 Own org_id | ❌ |
| `search_containers` | ✅ | ✅ | ✅ | ❌ |
| **History** | ✅ | ✅ (own terminal) | 🔒 Own bookings | 🔒 Own bookings |
| `get_passage_history` | ✅ | ✅ | 🔒 | 🔒 |
| `get_booking_audit_trail` | ✅ | ✅ | 🔒 | 🔒 |
| `get_gate_activity_summary` | ✅ | ✅ | ❌ | ❌ |

> **Note:** RBAC enforcement is via system prompt instructions to the LLM. The LLM is told the user's role and org_id and instructed to always filter appropriately. For DISPATCHER/DRIVER roles, the system prompt explicitly reminds the LLM to pass `org_id` or `carrier_org_id`.

---

## Proposal Flow (No Direct Writes)

The AI agent **never** executes write operations. All mutations follow this flow:

```
1. User: "Cancel booking BK-ALG-20260208-001"
2. Agent: Calls lookup_booking_by_reference → gets booking data
3. Agent: Calls propose_cancel_booking → validates cancellation is possible
4. Agent: Presents proposal to user:
   ┌──────────────────────────────────────────────────┐
   │  🔔 Action Proposal: Cancel Booking              │
   │                                                   │
   │  Booking: BK-ALG-20260208-001                    │
   │  Current Status: CONFIRMED                        │
   │                                                   │
   │  Side Effects:                                    │
   │  • Booking will be CANCELLED                      │
   │  • Slot occupancy will decrease by 1              │
   │  • Payment status is PAID — refund may apply      │
   │                                                   │
   │  [✅ Confirm]  [❌ Decline]                       │
   └──────────────────────────────────────────────────┘
5. User: Clicks Confirm
6. Frontend: Calls REST API → PUT /api/v1/bookings/{id}/cancel
```

### Proposal Types

| Proposal | Validates | Side Effects Shown |
|----------|-----------|-------------------|
| `CREATE_BOOKING` | Slot capacity, truck/driver ownership | Occupancy change, assignments |
| `CANCEL_BOOKING` | Status is PENDING/CONFIRMED | Occupancy freed, refund hint |
| `UPDATE_STATUS` | Valid lifecycle transition | Status change path |
| `RESCHEDULE_BOOKING` | Old booking is PENDING/CONFIRMED, new slot has capacity | Both slot occupancy changes |

---

## UI Components

The agent response includes a `ui_components` array that the frontend can render as rich widgets:

| Component | Schema | Used By |
|-----------|--------|---------|
| `TableComponent` | Columns + rows | `search_bookings`, `list_carrier_bookings`, `list_ports`, `list_terminals_for_port`, `list_gates_for_port`, `search_available_slots`, asset tools, history tools |
| `ChartComponent` | Bar, line, pie, area | `count_bookings_by_status` (pie), `get_gate_activity_summary` (bar) |
| `StatsComponent` | Label-value cards | `count_bookings_by_status`, `get_terminal_capacity`, `recommend_slot`, `get_slot_details` |
| `ActionProposal` | Action type + entity + side effects | All `propose_*` tools |
| `BookingCardComponent` | Reference, status, truck, driver, time | `lookup_booking_by_reference`, `get_booking_details` |

### Response Example

```json
{
  "session_id": "abc-123",
  "response": "Here are your current bookings:",
  "intent": "booking_query",
  "confidence": 0.85,
  "agent_type": "orchestrator",
  "ui_components": [
    {
      "type": "table",
      "title": "Your Bookings",
      "columns": [
        {"key": "booking_reference", "header": "Reference", "type": "text"},
        {"key": "status", "header": "Status", "type": "status"},
        {"key": "scheduled_date", "header": "Date", "type": "date"}
      ],
      "data": [
        {"booking_reference": "BK-ALG-20260208-001", "status": "CONFIRMED", "scheduled_date": "2026-02-08"}
      ]
    }
  ]
}
```

---

## Languages Supported

The agent responds in the language the user is using:

| Code | Language |
|------|----------|
| `en` | English |
| `fr` | French |
| `ar` | Arabic |

Set via the `language` field in `ChatRequest`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/chat/` | Send a message to the AI agent |
| `GET` | `/api/v1/chat/test` | Verify LLM connectivity |
| `GET` | `/api/v1/chat/history/{session_id}` | Retrieve conversation history |

### POST /api/v1/chat/

**Request:**
```json
{
  "message": "Show me available slots for tomorrow",
  "session_id": "optional-uuid",
  "language": "en"
}
```

**Response:** `ChatResponse` with `response`, `intent`, `confidence`, `agent_type`, `data`, and `ui_components`.
