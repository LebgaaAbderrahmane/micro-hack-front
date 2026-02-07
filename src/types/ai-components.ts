// ── Rich UI Component types returned by the AI backend ──

export type UIComponentType =
  | "table"
  | "chart"
  | "stats"
  | "approval"
  | "booking_card";

export interface BaseComponent {
  type: UIComponentType;
  title?: string;
}

// ── Table ────────────────────────────────────────────────

export interface TableColumn {
  key: string;
  header: string;
  type: "text" | "number" | "date" | "status" | "currency";
}

export interface TableComponent extends BaseComponent {
  type: "table";
  columns: TableColumn[];
  data: Record<string, unknown>[];
  action_label?: string;
}

// ── Chart ────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
}

export interface ChartComponent extends BaseComponent {
  type: "chart";
  chart_type: "bar" | "line" | "pie" | "area";
  data: ChartDataPoint[];
  x_axis_label?: string;
  y_axis_label?: string;
}

// ── Stats ────────────────────────────────────────────────

export interface StatItem {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  color?: string;
}

export interface StatsComponent extends BaseComponent {
  type: "stats";
  items: StatItem[];
}

// ── Booking Card ─────────────────────────────────────────

export interface BookingCardComponent extends BaseComponent {
  type: "booking_card";
  booking_reference: string;
  status: string;
  truck_plate?: string;
  driver_name?: string;
  time_slot?: string;
  location?: string;
}

// ── Approval / Action Proposal ───────────────────────────

export interface ActionProposalComponent extends BaseComponent {
  type: "approval";
  action_type: string;
  entity_id: string;
  description: string;
  data: Record<string, unknown>;
}

// ── Discriminated union ──────────────────────────────────

export type UIComponent =
  | TableComponent
  | ChartComponent
  | StatsComponent
  | BookingCardComponent
  | ActionProposalComponent;

// ── Full agent response envelope ─────────────────────────

export interface AgentResponse {
  ai_response: string;
  ui_components: UIComponent[];
  agent_type: string;
}
