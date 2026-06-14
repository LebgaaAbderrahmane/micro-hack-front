# PortFlow - Pitch Q&A Documentation

## Problem & Solution

### Q1: What problem does PortFlow solve?

PortFlow addresses port congestion and lack of visibility in maritime port operations. Truck queues at ports cause significant delays, environmental impact, and economic losses. The system regulates truck flows through a booking system that manages time slots and terminal capacities, while providing an AI-powered conversational interface for carriers and operators.

### Q2: Why is this solution unique?

PortFlow combines three critical capabilities: (1) strict slot booking with capacity enforcement, (2) multi-role access control for different stakeholders, and (3) an intelligent AI assistant that allows natural language queries without navigating complex menus. The AI uses a multi-agent architecture (Router → Orchestrator → Specialized Agents) powered by Mistral AI and LangGraph.

### Q3: What is the core value proposition?

Reduce port congestion by 30-50% through organized truck scheduling, while providing 24/7 AI assistance for booking management and operational queries. The system ensures compliance with data protection regulations through comprehensive audit logging.

### Q4: Who are the target users?

Four user roles: (1) Port Admins - global configuration, (2) Terminal Operators - capacity management and booking validation, (3) Carriers/Dispatchers - booking requests and fleet management, (4) Drivers - self-service booking lookup.

---

## Product Overview

### Q5: What are the core features?

Key features include: (1) Truck booking management with complete lifecycle (PENDING → CONFIRMED → CHECKED_IN → AT_GATE → IN_PROGRESS → COMPLETED), (2) Slot capacity engine with real-time availability, (3) QR code generation and validation for gate entry, (4) AI conversational assistant for natural language queries, (5) Real-time dashboards with live updates via Supabase Realtime, (6) Comprehensive audit logging for compliance.

### Q6: How does the booking lifecycle work?

A booking progresses through these states: PENDING (created by carrier) → CONFIRMED (validated by operator) → CHECKED_IN (driver arrives) → AT_GATE (at terminal gate) → IN_PROGRESS (loading/unloading) → COMPLETED (exited port) or CANCELLED/NO_SHOW. Each transition triggers notifications and audit logs.

### Q7: What booking types are supported?

The system supports four booking types: IMPORT_PICKUP (collect import containers), EXPORT_DELIVERY (deliver export containers), EMPTY_PICKUP (collect empty containers), EMPTY_RETURN (return empty containers).

### Q8: How does slot capacity management work?

Terminals define time slots (e.g., hourly windows) with maximum capacity. The system tracks current occupancy and prevents overbooking. Operators can apply overrides (close slots, change capacity, modify hours) for special events.

### Q9: What notifications are supported?

Five notification types: BOOKING_CONFIRMED, SLOT_REMINDER, GATE_READY, PAYMENT_DUE, SYSTEM_ALERT. Delivery channels include EMAIL, SMS, WHATSAPP, PUSH, IN_APP. Status tracking ensures delivery confirmation.

---

## Technical Architecture

### Q10: What is the frontend tech stack?

Frontend built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase client. Features include: server-side rendering, internationalization (Arabic/French/English), responsive design, and role-based UI rendering.

### Q11: What is the backend tech stack?

Backend built with FastAPI (Python), PostgreSQL (via Supabase), LangGraph for AI orchestration, and Mistral AI for language model. Docker containerization for deployment consistency.

### Q12: How is the database structured?

PostgreSQL with comprehensive schema covering: organisations, users, ports, terminals, gates, slots, bookings, trucks, drivers, containers, gate logs, AI conversation logs, and notifications. Uses Supabase for authentication and real-time subscriptions.

### Q13: What APIs are exposed?

RESTful endpoints under `/api/v1/` for: organisations, users, ports, terminals, gates, slots, assets (trucks/drivers/containers), bookings, notifications, and AI chat (`/api/v1/chat/`). All protected with JWT authentication via Supabase.

### Q14: How does authentication work?

Supabase Auth handles user authentication with JWT tokens. Backend validates tokens via Supabase client. Role-based access control (RBAC) enforced at API level - different roles have different permissions.

### Q15: How does the frontend communicate with backend?

Frontend uses typed Supabase client for database operations and REST API calls for complex business logic. AI chat service communicates directly with FastAPI backend for LangGraph processing.

---

## AI & Innovation

### Q16: How does the AI assistant work?

The AI uses LangGraph multi-agent architecture with Router (classifies intent) → Orchestrator (coordinates) → Specialized Agents (Booking, Slot, Asset, History). Each agent has specific tools and follows strict proposal policies - AI never executes write operations directly.

### Q17: What can users ask the AI?

Natural language queries like: "Is there space at Terminal A tomorrow?", "Show my bookings for Friday", "What's the capacity forecast for next week?", "Create a booking for truck ABC-123". The AI returns structured responses with UI widgets (tables, charts, booking forms).

### Q18: How does the AI handle data security?

Role-Based Access Control integrated into AI prompts. ADMIN sees all data, OPERATOR sees managed terminals, DISPATCHER/CARRIER sees only their organisation data, DRIVER sees only personal bookings. AI tools automatically filter by org_id.

### Q19: What makes the AI unique for logistics?

Key innovations include: (1) Slot prediction engine forecasting 1-30 days occupancy, (2) Multi-language support (Arabic/French/English), (3) Proposal policy requiring user confirmation for write operations, (4) Structured UI components (tables, widgets) alongside text responses.

### Q20: How does slot prediction work?

The slot agent analyzes historical booking patterns and uses time-series analysis to predict terminal occupancy, helping carriers make informed booking decisions and operators anticipate congestion.

### Q21: What is the proposal policy?

When users ask to create/cancel/update bookings, AI: (1) Gathers required info using read tools, (2) Calls propose_* tool to validate and build structured proposal, (3) Presents proposal with all side-effects, (4) Waits for explicit confirmation before execution.

---

## Security & Compliance

### Q22: How is data protected?

Supabase provides enterprise-grade security with row-level security (RLS) policies, encrypted data storage, and JWT authentication. All API endpoints protected with token validation.

### Q23: What audit capabilities exist?

Comprehensive audit logging tracks: booking modifications (who changed what, when, why), AI conversation logs (intent, entities extracted, response time), gate activity logs, and user actions. All logs stored with timestamps and actor identification.

### Q24: How does RBAC work?

Four roles with distinct permissions: ADMIN (full access), OPERATOR (manage terminals, validate bookings), DISPATCHER (carrier operations, create bookings), DRIVER (view personal bookings). Each API endpoint declares required role dependencies.

### Q25: What about data privacy?

User data filtered by organisation - carriers cannot see other carriers' data. AI explicitly instructed to never expose cross-organisation data. Compliance with data protection regulations through complete audit trail.

---

## Scalability & Performance

### Q26: How does the system handle real-time updates?

Supabase Realtime enables live dashboard updates. When bookings change, terminals update, or gate events occur, all connected clients receive instant notifications. WebSocket sessions tracked per user.

### Q27: How is performance optimized?

FastAPI's async architecture handles concurrent requests efficiently. Database queries optimized with proper indexing. Frontend uses Next.js server components and code splitting. Slot generation uses database functions for efficiency.

### Q28: How is the system deployed?

Docker Compose orchestrates frontend, backend, and database services. Containerization ensures consistency across environments. Frontend Dockerfile builds Next.js app, backend Dockerfile runs FastAPI with uvicorn.

### Q29: Can this scale to large ports?

Architecture designed for horizontal scaling: stateless backend allows multiple instances, PostgreSQL handles high concurrent loads with proper tuning, Supabase provides managed database scaling, CDN for frontend assets.

---

## Demo Scenarios

### Demo 1: AI Assistant - Slot Availability Query

**User Action:** Click AI chat icon, type "Is there space at Terminal A tomorrow morning?"

**Expected Response:** AI analyzes query, calls slot tools, returns formatted table showing available slots with times and capacity remaining. Response includes booking form widget.

**Talking Points:** Natural language processing, real-time data, structured UI response, multi-language support.

---

### Demo 2: Create New Booking Flow

**User Action:** Navigate to Bookings → New Booking, select terminal, choose slot, enter truck/driver/container details, submit.

**Expected Response:** Booking created with PENDING status, QR code generated, confirmation notification sent, booking appears in list with reference number BK-ALG-XXXXX.

**Talking Points:** Complete booking lifecycle, capacity enforcement, automated notifications, QR generation.

---

### Demo 3: Operator Dashboard - Capacity Monitoring

**User Action:** Login as Operator, view dashboard showing terminal occupancy, click on congested terminal.

**Expected Response:** Real-time dashboard shows all terminals with color-coded capacity indicators (green/yellow/red), clicking reveals detailed slot breakdown and current bookings.

**Talking Points:** Real-time updates via Supabase, visual capacity management, operator decision support.

---

### Demo 4: AI Assistant - Booking Modification Proposal

**User Action:** Ask AI "Can you cancel booking BK-ALG-12345?"

**Expected Response:** AI confirms booking details, presents cancellation proposal with consequences, waits for "Confirm" before executing cancellation, logs action in audit trail.

**Talking Points:** Safe AI operations with proposal policy, audit logging, user confirmation requirement.

---

### Demo 5: Driver Self-Service - QR Gate Entry

**User Action:** Login as Driver, view upcoming booking, show QR code at gate scanner.

**Expected Response:** Gate system validates QR token, logs gate entry, updates booking status to CHECKED_IN, driver receives confirmation notification.

**Talking Points:** End-to-end flow, QR token security, gate integration, real-time status updates.

---

### Demo 6: Slot Capacity Override - Operator Action

**User Action:** Operator selects Terminal A, clicks "Override", reduces capacity for next day due to maintenance.

**Expected Response:** Override applied with reason recorded, future bookings prevented from filling beyond new capacity, audit log records override action.

**Talking Points:** Flexible capacity management, audit trail, operator control.

---

## Quick Reference

### Architecture Diagram (Backend)

```
User Input → Router → Orchestrator (Mistral AI)
    ↓
    ├─→ Booking Tools (search, create, modify)
    ├─→ Slot Tools (capacity, availability, predictions)
    ├─→ Asset Tools (trucks, drivers, containers)
    └─→ History Tools (gate logs, audit trails)
    ↓
Response Builder + UI Components → JSON Response
```

### Database Schema Overview

```
ORGANISATIONS → Users, Trucks, Drivers
PORTS → Terminals, Gates
TERMINALS → Active Slots → Bookings
BOOKINGS → Gate Logs, QR Tokens
AI_AGENTS → Conversation Logs
```

### Key Metrics & Targets

- **Congestion Reduction Target:** 30-50% fewer truck queues
- **Booking Lifecycle:** 6 states (PENDING to COMPLETED)
- **AI Response Time:** <2 seconds
- **Real-time Updates:** <100ms latency via Supabase
- **Supported Languages:** Arabic, French, English

---

## Judging Criteria Mapping

| Criteria | Relevant Demo/Q&A | Weight |
|----------|-------------------|--------|
| Innovation & Problem-Solving | Q1-Q4, Demo 1-2 | High |
| Technical Functionality | Q10-Q15, Demo 3-5 | High |
| Real-World Applicability | Q26-Q29 | Medium |
| Technical Excellence | Q16-Q21 | High |
| Security & Compliance | Q22-Q25 | Medium |
| UI/UX & User Experience | Demo 1-6 | High |
| Presentation & Pitching | All Q&A + Demo Scripts | High |

---

*Document generated for PortFlow hackathon pitch. Last updated: February 2026.*
