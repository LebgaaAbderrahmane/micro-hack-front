"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bell, Check, Clock, AlertTriangle, Package, Truck } from "lucide-react";
import { useNotifications } from "@/hooks/domain/useSystem";
import { Tables } from "@/types/database.types";

type Notification = Tables<"notifications">;

const typeIcons: Record<string, React.FC<{ size?: number }>> = {
  BOOKING_CONFIRMED: Package,
  SLOT_REMINDER: Clock,
  GATE_READY: Truck,
  PAYMENT_DUE: AlertTriangle,
  SYSTEM_ALERT: Bell,
};

const typeColors: Record<string, string> = {
  BOOKING_CONFIRMED: "text-success bg-success/10",
  SLOT_REMINDER: "text-info bg-info/10",
  GATE_READY: "text-primary bg-primary/10",
  PAYMENT_DUE: "text-warning bg-warning/10",
  SYSTEM_ALERT: "text-error bg-error/10",
};

interface NotificationFeedProps {
  userId?: string;
  maxItems?: number;
}

export const NotificationFeed: React.FC<NotificationFeedProps> = ({
  userId,
  maxItems = 5,
}) => {
  const { data: notifications, markAsRead } = useNotifications(userId);

  const sorted = React.useMemo(() => {
    if (!notifications) return [];
    return [...notifications]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, maxItems);
  }, [notifications, maxItems]);

  const unreadCount = sorted.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-foreground/40" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40">
            Notifications
          </span>
        </div>
        {unreadCount > 0 && (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {sorted.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-foreground/30 text-center py-6"
          >
            No notifications yet
          </motion.p>
        ) : (
          sorted.map((notification, i) => {
            const Icon = typeIcons[notification.notification_type] || Bell;
            const colorClass = typeColors[notification.notification_type] || "text-foreground/50 bg-foreground/5";

            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => !notification.is_read && markAsRead.mutate(notification.id)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                  notification.is_read
                    ? "bg-foreground/[0.01] border-foreground/5 opacity-60"
                    : "bg-foreground/[0.03] border-foreground/10 hover:border-primary/20"
                )}
              >
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", colorClass)}>
                  <Icon size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-semibold truncate", notification.is_read ? "text-foreground/50" : "text-foreground")}>
                    {notification.title}
                  </p>
                  <p className="text-[10px] text-foreground/40 mt-0.5 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-[9px] text-foreground/20 mt-1">
                    {notification.created_at
                      ? new Date(notification.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                )}
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
};
