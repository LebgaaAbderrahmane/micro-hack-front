import { Database } from '../database.types';

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type WebsocketSession = Database['public']['Tables']['websocket_sessions']['Row'];
export type BookingAuditLog = Database['public']['Tables']['booking_audit_logs']['Row'];
export type QrToken = Database['public']['Tables']['qr_tokens']['Row'];

export type NotificationType = Database['public']['Enums']['notification_type_enum'];
export type DeliveryChannel = Database['public']['Enums']['delivery_channel_enum'];
export type DeliveryStatus = Database['public']['Enums']['delivery_status_enum'];
export type ActionSource = Database['public']['Enums']['action_source_enum'];
export type BookingLogAction = Database['public']['Enums']['booking_log_action_enum'];
