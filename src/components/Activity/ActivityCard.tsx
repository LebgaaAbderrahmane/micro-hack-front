"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    Shield,
    Settings,
    Truck,
    Bookmark,
    Trash2,
    Calendar,
    Clock
} from "lucide-react";

export type ActivityBadge = "Admin" | "Operator" | "Carrier" | "Bookmark" | "Trash";

export interface Activity {
    id: string;
    username: string;
    badge: ActivityBadge;
    activityType: string;
    date: string;
    time: string;
    icon?: React.ReactNode;
}

const badgeStyles: Record<ActivityBadge, { bg: string; color: string; icon: any }> = {
    Admin: { bg: "#4b97fb", color: "#ffffff", icon: Shield },
    Operator: { bg: "#71dd8c", color: "#ffffff", icon: Settings },
    Carrier: { bg: "#9f9ff8", color: "#ffffff", icon: Truck },
    Bookmark: { bg: "#94e9b8", color: "#ffffff", icon: Bookmark },
    Trash: { bg: "#f23e3e", color: "#ffffff", icon: Trash2 },
};

interface ActivityCardProps {
    activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
    const style = badgeStyles[activity.badge];
    const Icon = activity.icon ? () => <>{activity.icon}</> : style.icon;

    return (
        <div
            className={cn(
                "w-full p-6 flex items-center gap-6 transition-all duration-300 cursor-pointer",
                "bg-background text-foreground border border-border-div",
                "rounded-lg shadow-sm hover:shadow-md hover:bg-foreground/[0.02]"
            )}
            style={{ maxWidth: "1080px" }}
        >
            {/* Avatar Block */}
            <div
                className="shrink-0 flex items-center justify-center rounded-lg shadow-sm"
                style={{
                    width: 45,
                    height: 45,
                    backgroundColor: style.bg
                }}
            >
                <Icon size={24} color={style.color} />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-base font-medium font-poppins text-foreground">
                            {activity.username}
                        </h3>
                        <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white shadow-sm"
                            style={{ backgroundColor: style.bg }}
                        >
                            {activity.badge}
                        </span>
                    </div>
                    <p className="text-sm font-normal font-poppins text-foreground/60">
                        {activity.activityType}
                    </p>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-6 sm:gap-8 sm:pr-4">
                    <div className="flex items-center gap-2 text-foreground/50">
                        <Calendar size={14} className="text-tile-blue" />
                        <span className="text-xs font-medium font-poppins">
                            {activity.date}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/50">
                        <Clock size={14} className="text-tile-blue" />
                        <span className="text-xs font-medium font-poppins">
                            {activity.time}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
