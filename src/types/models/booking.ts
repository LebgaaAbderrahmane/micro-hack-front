import { Database } from "../database.types";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Container = Database["public"]["Tables"]["containers"]["Row"];
export type GateLog = Database["public"]["Tables"]["gate_logs"]["Row"];
export type ActiveSlots = Database["public"]["Tables"]["active_slots"]["Row"];
export type SlotTemplate =
  Database["public"]["Tables"]["slot_templates"]["Row"];
export type SlotOverride =
  Database["public"]["Tables"]["slot_overrides"]["Row"];

export type BookingStatus = Database["public"]["Enums"]["booking_status_enum"];
export type BookingType = Database["public"]["Enums"]["booking_type_enum"];
export type BookingPriority =
  Database["public"]["Enums"]["booking_priority_enum"];
export type ContainerStatus =
  Database["public"]["Enums"]["container_status_enum"];
export type GateActionType =
  Database["public"]["Enums"]["gate_action_type_enum"];
export type OperationStatus =
  Database["public"]["Enums"]["operation_status_enum"];
export type SlotStatus = Database["public"]["Enums"]["slot_status_enum"];
export type SlotOverrideType =
  Database["public"]["Enums"]["slot_override_type_enum"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status_enum"];
