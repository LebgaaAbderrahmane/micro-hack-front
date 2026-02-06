import { Database } from '../database.types';

export type Port = Database['public']['Tables']['ports']['Row'];
export type Terminal = Database['public']['Tables']['terminals']['Row'];
export type Gate = Database['public']['Tables']['gates']['Row'];
export type GateLane = Database['public']['Tables']['gate_lanes']['Row'];

export type GateStatus = Database['public']['Enums']['gate_status_enum'];
export type LaneType = Database['public']['Enums']['lane_type_enum'];
