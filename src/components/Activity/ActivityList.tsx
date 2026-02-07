"use client";

import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingAuditLogsService } from "@/services/system.service";
import { ActivityCard, Activity, ActivityBadge } from "./ActivityCard";
import { createClient } from "@/utils/supabase/client";

interface ActivityListProps {
    filters: {
        search: string;
        fromDate: string;
        toDate: string;
        users: string[];
        activities: string[];
        actorId?: string;
    };
}

export const ActivityList = ({ filters }: ActivityListProps) => {
    const queryClient = useQueryClient();
    const supabase = createClient();

    const { data: logs, isLoading, error } = useQuery({
        queryKey: ["audit-logs", filters],
        queryFn: async () => {
            const { data, error } = await bookingAuditLogsService.getLogsWithUsers(filters);
            if (error) throw error;
            return data;
        },
    });

    // Real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel(`booking_audit_logs-${filters.actorId || 'all'}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "booking_audit_logs" },
                (payload) => {
                    // Optionally optimize by manually updating query cache here vs invalidating
                    console.log("Realtime log received:", payload);
                    queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient, supabase]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 w-full items-center py-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-24 bg-gray-100 animate-pulse rounded-lg max-w-[1080px]" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 py-10 text-center">Error loading logs</div>;
    }

    const mapBadge = (role: string | undefined): ActivityBadge => {
        if (!role) return "Bookmark";
        const r = role.toUpperCase();
        if (r === "ADMIN") return "Admin";
        if (r === "OPERATOR") return "Operator";
        return "Carrier";
    };

    const transformLogs = (logs: any[]): Activity[] => {
        return logs.map((log) => ({
            id: log.id,
            username: log.users?.username || "System",
            badge: mapBadge(log.users?.role),
            activityType: log.action_type.replace(/_/g, " "),
            date: new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
            time: new Date(log.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
            details: {
                oldValue: log.old_value,
                newValue: log.new_value,
                fieldChanged: log.field_changed,
                reason: log.change_reason,
                aiConfidence: log.ai_confidence,
                isAi: log.is_made_by_ai
            }
        }));
    };

    const activities = transformLogs(logs || []);

    if (activities.length === 0) {
        return (
            <div className="text-foreground/60 py-20 text-center font-poppins">
                No activity found matching your criteria.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full items-center py-6">
            {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
        </div>
    );
};
