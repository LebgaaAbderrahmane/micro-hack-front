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
    Clock,
    ChevronDown,
    ChevronUp,
    Info,
    Package,
    DollarSign,
    FileText
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
    details?: {
        oldValue?: string | null;
        newValue?: string | null;
        fieldChanged?: string | null;
        reason?: string | null;
        aiConfidence?: number | null;
        isAi?: boolean | null;
        bookingRef?: string;
        status?: string;
        bookingType?: string;
        appointmentDate?: string;
        timeWindow?: string;
        carrier?: string;
        truckId?: string;
        totalAmount?: string;
        paymentStatus?: string;
    };
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

const formatValue = (val: string | null) => {
    if (!val) return null;
    try {
        if (val.startsWith('{') || val.startsWith('[')) {
            const parsed = JSON.parse(val);
            if (typeof parsed === 'object' && parsed !== null) {
                return (
                    <div className="grid grid-cols-1 gap-2 mt-1">
                        {Object.entries(parsed).map(([key, value]) => (
                            <div key={key} className="flex flex-col border-b border-foreground/5 last:border-0 pb-1 last:pb-0">
                                <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">{key.replace(/_/g, ' ')}</span>
                                <span className="text-xs font-medium text-foreground/90 overflow-anywhere">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            }
        }
        return <span className="text-sm">{val}</span>;
    } catch (e) {
        return <span className="text-sm">{val}</span>;
    }
};

export const ActivityCard = ({ activity }: ActivityCardProps) => {
    const style = badgeStyles[activity.badge];
    const Icon = activity.icon ? () => <>{activity.icon}</> : style.icon;
    const [expanded, setExpanded] = React.useState(false);

    const hasDetails = activity.details && (activity.details.oldValue || activity.details.newValue || activity.details.fieldChanged || activity.details.bookingRef);

    return (
        <div
            className={cn(
                "w-full bg-background text-foreground border border-border-div rounded-lg shadow-sm hover:shadow-md transition-all duration-300",
                expanded ? "bg-foreground/5" : "hover:bg-foreground/5"
            )}
            style={{ maxWidth: "1080px" }}
        >
            <div
                className="p-6 flex items-center gap-6 cursor-pointer"
                onClick={() => hasDetails && setExpanded(!expanded)}
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

                    {/* Timestamp & Action */}
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
                        {hasDetails && (
                            <div className={cn("text-foreground/40 transition-transform duration-300", expanded && "rotate-180")}>
                                <ChevronDown size={18} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expandable Details - Optimized Layout */}
            {expanded && hasDetails && (
                <div className="px-6 pb-5 pt-0 animate-in slide-in-from-top-2 duration-200">
                    <div className="pl-[69px]">
                        <div className="bg-background rounded-xl p-4 space-y-3 font-poppins border border-border-div">

                            {/* Core Identity and Status Section */}
                            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30">
                                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
                                    <FileText size={14} />
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Core Identity and Status</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                    <div>
                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mb-0.5 block">Booking Reference</span>
                                        <span className="text-sm font-bold text-foreground">{activity.details?.bookingRef || "BK-DZ-002"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mb-0.5 block">Status</span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                            <span className="text-sm font-bold text-foreground">{activity.details?.status || "PENDING"}</span>
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mb-0.5 block">Booking Type</span>
                                        <span className="text-sm font-bold text-foreground">{activity.details?.bookingType || "EXPORT_DELIVERY"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Logistics Information Section */}
                            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-100 dark:border-green-900/30">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                                    <Truck size={14} />
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Logistics (Who, What, When)</h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                                    <div>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold mb-0.5 block">Scheduled Date</span>
                                        <span className="text-sm font-bold text-foreground">{activity.details?.appointmentDate || "2026-02-12"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold mb-0.5 block">Time Window</span>
                                        <span className="text-sm font-bold text-foreground">{activity.details?.timeWindow || "14:00 - 16:00"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold mb-0.5 block">Carrier Organization</span>
                                        <span className="text-sm font-bold text-foreground">{activity.details?.carrier || "CARR-002"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold mb-0.5 block">Truck ID</span>
                                        <span className="text-sm font-bold text-foreground">{activity.details?.truckId || "TRK-789"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary Section */}
                            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-100 dark:border-amber-900/30">
                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
                                    <DollarSign size={14} />
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Financial Summary</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mb-0.5 block">Total Amount</span>
                                        <span className="text-sm font-bold text-foreground">{activity.details?.totalAmount || "$250.00"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mb-0.5 block">Payment Status</span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                            <span className="text-sm font-bold text-foreground">{activity.details?.paymentStatus || "PENDING"}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Section */}
                            {(activity.details?.reason || activity.details?.isAi) && (
                                <div className="bg-gray-50 dark:bg-gray-950/20 rounded-lg p-3 border border-gray-100 dark:border-gray-900/30">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400 mb-2">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider">Additional Information</h4>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        {activity.details?.reason && (
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium shrink-0">Change Reason</span>
                                                <p className="text-xs text-foreground/80 italic text-right">"{activity.details.reason}"</p>
                                            </div>
                                        )}

                                        {activity.details?.isAi && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Generated By</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-[9px] font-bold uppercase tracking-wider border border-purple-500/20">
                                                        AI Generated
                                                    </span>
                                                    {activity.details.aiConfidence && (
                                                        <span className="text-[10px] text-foreground/50 font-medium">
                                                            {(activity.details.aiConfidence * 100).toFixed(1)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};