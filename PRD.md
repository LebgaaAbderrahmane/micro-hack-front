# Intelligent Logistics Access Control System - Frontend Phase

## 1. Project Overview

### 1.1 Project Name

Intelligent Logistics Access Control System (ILACS) - Frontend Module

### 1.2 Problem Statement

Maritime port access suffers from congestion and lack of visibility. Current booking systems require complex interactions, leading to inefficiencies for carriers and terminal operators.

### 1.3 Solution

A modern, role-based web application providing:

- Multi-role portal with distinct interfaces
- Real-time interactive dashboards
- Intelligent booking and slot management
- AI-assisted conversational interface
- Comprehensive notification system

### 1.4 Primary Objectives (Frontend Phase)

- Develop intuitive, role-based user interfaces
- Implement real-time data visualization with animations
- Create modular, flexible architecture for future enhancements
- Establish comprehensive design system and component library
- Build mock backend integration for development and testing

## 2. User Roles & Personas

### 2.1 System Administrator (Admin)

**Access Level:** Global

**Primary Responsibilities:**

- User account management (create/disable)
- Terminal assignment to operators
- Super management of terminal/states
- Audit log monitoring
- Performance analytics

### 2.2 Terminal Operator (Terminal Op)

**Access Level:** Terminal-specific (1 terminal per operator)

**Primary Responsibilities:**

- Real-time terminal monitoring
- Booking request validation
- Capacity management

### 2.3 Carrier/Courier

**Access Level:** Company-specific

**Primary Responsibilities:**

- Slot booking and management

## 3. Functional Requirements

### 3.1 Authentication & Authorization Module

#### 3.1.1 Registration Flow

**Type:** Invite-only (Admin creates accounts)

**Process:**

1. Admin creates account via admin panel
2. System sends invitation email with temporary credentials
3. User completes email verification
4. User sets permanent password
5. Account becomes active

**Required Information:**

- **All Users:** Full name, email, phone
- **Carrier:** Company name, tax ID, fleet size, address
- **Terminal Op:** Assigned terminal, employee ID
- **Admin:** Contact details

#### 3.1.2 Login System

**Method:** Email/Password authentication

**Features:**

- "Forgot Password" flow with email reset
- "Remember Me" functionality
- Session management (JWT tokens)

#### 3.1.3 Role-Based Access Control

Three-tier permission system:

- **Admin:** Full system access + user management
- **Terminal Op:** Terminal-specific operations + booking validation
- **Carrier:** Self-service booking

**UI Adaptation:** Menu items, dashboard components, and actions dynamically adjust based on role

### 3.2 Dashboard Module

#### 3.2.1 Admin Dashboard

**Layout Components:**

**Header Stats:**

- Total terminals active/inactive
- System-wide utilization percentage
- Pending approvals count
- Active alerts count
- Daily booking volume

**Interactive Port Map:**

- Schematic representation of entire port
- Terminals as interactive zones
- **Color Coding:**
  - Green: <70% capacity
  - Yellow: 70-90% capacity
  - Red: >90% capacity
- **Interactions:**
  - Hover: Show terminal name, current utilization, operator
  - Click: Zoom to terminal detailed view
- **Animations:**
  - Real-time truck movements (animated dots along routes)
  - Pulsing alerts for congested terminals
  - Smooth transitions for status changes

**System Overview Panel:**

- User activity chart (24h)
- Booking trend graph (7 days)
- Incident log (real-time feed)
- Quick action buttons (add user, configure system)

#### 3.2.2 Terminal Operator Dashboard

**Layout Components:**

**Terminal Control Panel:**

- Current capacity: X/Y trucks
- Next 3 arriving trucks (countdown timers)
- Average wait time display
- Gate status indicators

**Interactive Terminal Layout:**

- **Visual Elements:**
  - Gate icons with queue lengths
  - Parking bay occupancy
  - Loading zone status
  - Truck icons with status indicators
- **Color Coding for Trucks:**
  - Blue: Booked (arriving soon)
  - Green: Checked-in (on site)
  - Orange: Loading/unloading
  - Red: Delayed/Issue
  - Gray: Departed
- **Interactions:**
  - Click truck icon: Open details modal
  - Drag truck icon: Reassign to different bay (if enabled)
  - Right-click: Quick actions (mark delayed, add note)

**Booking Queue:**

- Pending requests list
- Quick approve/reject with reason dropdown
- Filter by time, carrier, priority

#### 3.2.3 Carrier Dashboard

**Layout Components:**

**Performance Stats:**

- Active bookings count
- On-time arrival percentage
- Fleet utilization rate
- Upcoming booking in X hours

**Booking Calendar:**

- Month/week/day view toggle
- Color-coded bookings by status
- Quick add booking button
- Click slot to see details/edit

**Fleet Status:**

- List/Grid of trucks with status
- Filter by location (at terminal, in transit, available)
- Quick access to QR codes

### 3.3 Booking System Module

#### 3.3.1 Booking Creation (Carrier)

**Multi-step Workflow:**

**Terminal Selection:**

- Dropdown/list of available terminals
- Filter by location, service type
- Show current availability indicator

**Date & Time Selection:**

- Calendar component with availability overlay
- **Visual Indicators:**
  - Green: Available slots
  - Yellow: Limited availability
  - Red: Fully booked
- Time slot grid (30/60 minute intervals)
- Real-time availability updates

**Truck Assignment:**

- Dropdown from carrier's fleet
- Driver information auto-fill
- Cargo details form (optional)

**Review & Confirmation:**

- Summary page with all details
- Estimated processing time
- Terms acceptance checkbox
- Submit button with loading state

**Additional Features:**

- Recurring bookings (daily/weekly/monthly)
- Favorite terminals/slots
- Booking templates for frequent shipments

#### 3.3.2 Booking Management

**Carrier View:**

- List view with filter/sort options
- Status badges (Pending/Confirmed/Rejected/Consumed)
- Action buttons (Modify/Cancel/View QR)
- Modification rules enforced via UI
- Cancellation confirmation with reason prompt

**Terminal Operator View:**

- Approval queue with bulk actions
- Quick view modal for booking details
- Capacity override options (with justification)
- Drag-and-drop schedule adjustment

### 3.4 Slot Management Module

#### 3.4.1 Capacity Configuration

**Terminal Op Interface:**

- Simple slider/number input for max trucks/hour
- Time-based rules (peak/off-peak hours)
- Exception dates (holidays, maintenance)
- Visual capacity planner (calendar view)

#### 3.4.2 Availability Display

**Calendar View:**

- Month/week/day navigation
- Heat map overlay for utilization
- Tooltip with detailed availability

**List View:**

- Filter by date range, terminal
- Sort by availability percentage
- Export to CSV option

### 3.5 Notification System

#### 3.5.1 Notification Types

**Carrier Notifications:**

- Booking status changes (confirmation, rejection)
- Reminders (24h, 2h before slot)
- Delay alerts
- Capacity threshold warnings
- System announcements

**Terminal Operator Notifications:**

- New booking requests
- Capacity alerts (80%, 90%, 100%)
- Truck check-in/out events
- Incident reports
- Shift change reminders

**Admin Notifications:**

- System health alerts
- User registration requests
- Critical capacity breaches
- Audit log anomalies

#### 3.5.2 Delivery Channels

**In-App Notifications:**

- Bell icon with badge counter
- Notification center with filter options
- Mark as read/unread
- Action buttons within notifications

**Email Notifications:**

- HTML templates per notification type
- Unsubscribe options
- Branding consistency

**Push Notifications (Browser):**

- Permission prompt on first login
- Priority-based delivery
- Click to navigate to relevant page
- Grouping by type

#### 3.5.3 Priority System

- **Low Priority:** Reminders, informational updates
- **Medium Priority:** Status changes, capacity warnings
- **High Priority:** System alerts, last-minute changes, incidents
- **Critical:** System downtime, security alerts

### 3.6 QR Code System

- **Generation:** Upon booking confirmation
- **Display:** Carrier dashboard, email confirmation
- **Features:**
  - Unique per booking
  - Expiry time (e.g., 1 hour after slot)
  - Regeneration option
  - QR code preview with details
  - Download options (PNG, PDF)

### 3.7 Multi-Agent System Interface

**Initial Implementation:**

- Floating chat button (bottom right corner)
- Slide-out chat panel
- **Features:**
  - Text-based conversation
  - Message history
  - Typing indicator
  - Quick prompts (predefined questions)
  - "Ask the assistant" placeholder functionality
- **Future Ready:** API endpoint stubs for AI integration

## 4. Non-Functional Requirements

### 4.1 Performance

- **Page Load Time:** < 3 seconds initial load, < 1 second subsequent
- **Dashboard Updates:** Real-time (WebSocket) with < 2 second latency
- **Animation Performance:** 60fps smooth animations
- **Mobile Responsiveness:** Full functionality on tablets

### 4.2 Security

**Frontend Security:**

- XSS protection
- CSRF tokens
- Secure HTTP headers
- Input validation and sanitization
- JWT token management

**Data Protection:**

- Role-based data filtering
- Secure WebSocket connections
- Encrypted local storage for tokens only

### 4.3 Usability

- **Accessibility:** WCAG 2.1 AA compliance
- **Internationalization:** RTL support, date/number formatting
- **Error Handling:** User-friendly error messages with recovery options
- **Help System:** Context-sensitive help, tooltips, guided tours

### 4.4 Maintainability

- **Modular Architecture:** Component-based, reusable patterns
- **Code Quality:** TypeScript, ESLint, Prettier enforced
- **Testing:** Component testing, integration testing, E2E testing
- **Documentation:** Component storybook, API documentation

## 5. Technical Specifications

### 5.1 Technology Stack

**Frontend Framework:**

- **Primary:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS with CSS Modules
- **Component Library:** ShadCN/ui (customizable)
- **State Management:** Zustand (global state) + React Query (server state)
- **Forms:** React Hook Form + Zod validation

**Visualization Libraries:**

- **Charts:** Recharts (lightweight, customizable)
- **Maps:** Leaflet.js (port map) + React Leaflet
- **Animations:** Framer Motion
- **Date Handling:** date-fns

**Real-time Communication:**

- **WebSocket:** Socket.io-client
- **Mocking:** Mock Service Worker (MSW)

**Development Tools:**

- **Testing:** Jest + React Testing Library + Cypress
- **Documentation:** Storybook
- **Code Quality:** ESLint, Prettier, Husky
- **Bundle Analysis:** Webpack Bundle Analyzer

### 5.2 Project Structure

```
src/
├── app/ # Next.js App Router
├── components/
│ ├── common/ # Shared components
│ ├── dashboard/ # Dashboard-specific
│ ├── booking/ # Booking system
│ └── layout/ # Layout components
├── hooks/ # Custom React hooks
├── lib/ # Utilities, configurations
├── stores/ # Zustand stores
├── services/ # API services, WebSocket
├── types/ # TypeScript definitions
├── styles/ # Global styles, Tailwind config
└── mocks/ # Mock data and APIs
```

### 5.3 Design System

#### 5.3.1 Color Palette

- **Primary:** Green (#10B981) - Port/Terminal theme
- **Secondary:** Blue (#3B82F6) - Information/Water theme
- **Accent:** Orange (#F59E0B) - Warning/Attention
- **Neutral:** Gray scale (#1F2937 to #F9FAFB)
- **Status Colors:**
  - Success: Green (#10B981)
  - Warning: Yellow (#FBBF24)
  - Error: Red (#EF4444)
  - Info: Blue (#3B82F6)

#### 5.3.2 Typography

- **Primary Font:** Inter (sans-serif)
- **Scale:** 12px → 16px → 20px → 24px → 30px → 36px → 48px
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

#### 5.3.3 Component Design

- **Glass Morphism:** Applied to cards, modals, sidebars
- **Shadows:** Subtle, layered shadows for depth
- **Border Radius:** 8px (cards), 12px (modals), 9999px (buttons)
- **Transitions:** 200ms ease-in-out standard
- **Spacing:** 4px base unit (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96)

### 5.4 API Mocking Strategy

**Phase 1 (Frontend Development):**

- Mock Service Worker (MSW) for API interception
- Faker.js for realistic mock data
- Local JSON files for static data
- WebSocket mock with simulated events

**API Endpoints to Mock:**

```
/auth/* # Authentication endpoints
/users/* # User management
/terminals/* # Terminal data
/bookings/* # Booking operations
/slots/* # Slot availability
/notifications/* # Notification system
/ai/* # AI assistant stubs
```

### 5.5 Real-time Implementation

**WebSocket Events:**

```typescript
// Server → Client Events
SOCKET_EVENTS = {
  TERMINAL_UPDATE: "terminal:update",
  BOOKING_UPDATE: "booking:update",
  TRUCK_MOVEMENT: "truck:movement",
  NOTIFICATION_NEW: "notification:new",
  CAPACITY_ALERT: "capacity:alert",
};

// Client → Server Events
CLIENT_EVENTS = {
  SUBSCRIBE_TERMINAL: "subscribe:terminal",
  UNSUBSCRIBE_TERMINAL: "unsubscribe:terminal",
  ACK_NOTIFICATION: "ack:notification",
};
```

## 6. Data Models (Frontend)

### 6.1 User Model

```typescript
interface User {
  id: string;
  email: string;
  role: "admin" | "terminal_op" | "carrier";
  firstName: string;
  lastName: string;
  company?: string; // For carriers
  terminalId?: string; // For terminal ops
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
}
```

### 6.2 Booking Model

```typescript
interface Booking {
  id: string;
  bookingNumber: string;
  carrierId: string;
  terminalId: string;
  slot: {
    date: string; // ISO
    startTime: string;
    endTime: string;
  };
  truck: {
    id: string;
    licensePlate: string;
    driverName: string;
    driverPhone: string;
  };
  status: "pending" | "confirmed" | "rejected" | "consumed" | "cancelled";
  cargoDetails?: {
    type: string;
    weight: number;
    description: string;
  };
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.3 Terminal Model

```typescript
interface Terminal {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  capacity: {
    maxPerHour: number;
    currentUtilization: number;
    peakHours: string[];
  };
  layout: {
    gates: Gate[];
    parkingBays: Bay[];
    loadingZones: Zone[];
  };
  status: "active" | "maintenance" | "inactive";
  operatorId?: string;
}
```

### 6.4 Notification Model

```typescript
interface Notification {
  id: string;
  userId: string;
  type: "info" | "warning" | "error" | "success";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  read: boolean;
  createdAt: Date;
}
```

## 7. Implementation Phases

### Phase 1: Foundation

**Deliverables:**

- Project setup with Next.js + TypeScript
- Design system implementation
- Authentication flow (mock)
- Basic layout components
- Routing structure

### Phase 2: Dashboard Development

**Deliverables:**

- Role-based dashboard skeletons
- Interactive port map component
- Terminal layout visualization
- Real-time WebSocket setup (mock)

### Phase 3: Booking System

**Deliverables:**

- Calendar and slot selection
- Multi-step booking form
- Booking management interfaces
- QR code generation/display

### Phase 4: Enhanced Features

**Deliverables:**

- Notification system
- Chat assistant interface
- Advanced filtering/search
- Export/import functionality

### Phase 5: Polish & Testing

**Deliverables:**

- Responsive design refinement
- Performance optimization
- Comprehensive testing
- Documentation
- Deployment preparation

## 8. Success Metrics

### 8.1 Development Metrics

- **Code Coverage:** > 80% test coverage
- **Performance Score:** > 90 Lighthouse score
- **Bundle Size:** < 500KB initial load
- **Component Reusability:** > 60% shared components

### 8.2 User Experience Metrics

- **Task Completion Rate:** > 90% for primary flows
- **Error Rate:** < 2% form submissions
- **Load Time:** < 3 seconds for all pages
- **User Satisfaction:** > 4/5 in initial testing

### 8.3 Business Metrics

- **Modularity:** Ability to add/remove features with minimal disruption
- **Flexibility:** Support for future role additions
- **Scalability:** Support for 1000+ concurrent users
- **Maintainability:** Clear documentation and component stories

## 9. Risk Mitigation

### 9.1 Technical Risks

- **Real-time Performance:** Use WebSocket with connection pooling
- **Large Dataset Visualization:** Implement virtual scrolling, pagination
- **Browser Compatibility:** Progressive enhancement strategy
- **State Management Complexity:** Clear separation of concerns

### 9.2 Project Risks

- **Requirement Changes:** Modular architecture allows flexibility
- **Timeline Pressure:** Prioritized feature delivery
- **Team Coordination:** Daily standups, component contracts
- **Quality Assurance:** Automated testing pipeline

## 10. Future Considerations

### 10.1 Immediate Extensions

- Multi-terminal operator support
- Sub-accounts for carriers
- Advanced analytics dashboard

### 10.2 Long-term Vision

- AI assistant integration
- Predictive analytics
- IoT device integration
- Blockchain for auditing
- Multi-port federation
