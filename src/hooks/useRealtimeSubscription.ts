import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/database.types";

type TableName = keyof Database["public"]["Tables"];
type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface RealtimeSubscriptionConfig {
  table: TableName;
  event?: RealtimeEvent;
  queryKeys: string[][];
  filter?: string;
}

/**
 * Subscribes to Supabase Realtime postgres_changes for one or more tables,
 * invalidating the specified React Query keys on each event.
 */
export function useRealtimeSubscription(configs: RealtimeSubscriptionConfig[]) {
  const queryClient = useQueryClient();
  const configKey = useMemo(
    () => configs.map((c) => `${c.table}-${c.event || "*"}-${c.filter || ""}`).join(","),
    [configs]
  );

  useEffect(() => {
    const supabase = createClient();
    const channelName = `realtime-${configKey}-${Date.now()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel = supabase.channel(channelName) as any;

    for (const config of configs) {
      channel = channel.on(
        "postgres_changes",
        {
          event: config.event || "*",
          schema: "public",
          table: config.table,
          ...(config.filter ? { filter: config.filter } : {}),
        },
        () => {
          for (const key of config.queryKeys) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        }
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, configKey]);
}

/**
 * Pre-configured subscription sets for each dashboard role.
 */
export function useAdminRealtimeSubscriptions() {
  useRealtimeSubscription([
    { table: "bookings", queryKeys: [["bookings"]] },
    { table: "terminals", queryKeys: [["terminals"]] },
    { table: "active_slots", queryKeys: [["active-slots"]] },
    { table: "gate_logs", queryKeys: [["gate-logs"]] },
    { table: "gates", queryKeys: [["gates"]] },
    { table: "gate_lanes", queryKeys: [["gate-lanes"]] },
    { table: "notifications", queryKeys: [["notifications"]] },
    { table: "containers", queryKeys: [["containers"]] },
    { table: "trucks", queryKeys: [["fleet"]] },
    { table: "drivers", queryKeys: [["fleet"]] },
    { table: "booking_audit_logs", queryKeys: [["booking-audit-logs"]] },
  ]);
}

export function useOperatorRealtimeSubscriptions() {
  useRealtimeSubscription([
    { table: "bookings", queryKeys: [["bookings"]] },
    { table: "terminals", queryKeys: [["terminals"]] },
    { table: "active_slots", queryKeys: [["active-slots"]] },
    { table: "gate_logs", queryKeys: [["gate-logs"]] },
    { table: "gates", queryKeys: [["gates"]] },
    { table: "gate_lanes", queryKeys: [["gate-lanes"]] },
    { table: "notifications", queryKeys: [["notifications"]] },
    { table: "containers", queryKeys: [["containers"]] },
  ]);
}

export function useDispatcherRealtimeSubscriptions() {
  useRealtimeSubscription([
    { table: "bookings", queryKeys: [["bookings"]] },
    { table: "active_slots", queryKeys: [["active-slots"]] },
    { table: "notifications", queryKeys: [["notifications"]] },
    { table: "trucks", queryKeys: [["fleet"]] },
    { table: "drivers", queryKeys: [["fleet"]] },
    { table: "containers", queryKeys: [["containers"]] },
  ]);
}
