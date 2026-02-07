"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Bell, TriangleAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";

const alerts = [
    {
        id: 1,
        title: "Critical: Terminal 4 Overload",
        description: "Current utilization at 92%. Buffer threshold of 90% exceeded.",
        time: "12m ago",
        type: "error",
        icon: <TriangleAlert size={14} />,
        color: "red"
    },
    {
        id: 2,
        title: "Slot Optimization",
        description: "Carrier 'Blue Logistics' optimized 5 future reservations.",
        time: "25m ago",
        type: "info",
        icon: <Bell size={14} />,
        color: "blue"
    },
    {
        id: 3,
        title: "Batch Sync Complete",
        description: "Terminal 2 identity verification nodes synced successfully.",
        time: "1h ago",
        type: "success",
        icon: <CheckCircle2 size={14} />,
        color: "green"
    },
];

const colorMap = {
    red: { bg: "#f23e3e", color: "#ffffff" },
    blue: { bg: "#4b97fb", color: "#ffffff" },
    green: { bg: "#71dd8c", color: "#ffffff" },
};

export const AlertsFeed = () => {
    const router = useRouter();

    return (
        <Card className={cn(
            "w-full h-full flex flex-col transition-all duration-300",
            "bg-background text-foreground border border-border-div",
            "rounded-lg shadow-sm"
        )}>
            <div className="p-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10 transition-transform hover:scale-105">
                        <Bell size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground font-poppins tracking-tight">System Alerts</h3>
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-none">Live Stream</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer bg-background border border-border-div rounded-lg hover:shadow-sm hover:bg-foreground/[0.02]"
                        >
                            <div
                                className="shrink-0 flex items-center justify-center rounded-lg shadow-sm"
                                style={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: colorMap[alert.color as keyof typeof colorMap].bg
                                }}
                            >
                                {React.cloneElement(alert.icon as React.ReactElement<any>, {
                                    size: 20,
                                    color: "#ffffff"
                                })}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-sm font-medium font-poppins text-foreground truncate">
                                        {alert.title}
                                    </h4>
                                    <span className="text-[10px] font-medium font-poppins text-foreground/40 whitespace-nowrap">
                                        {alert.time}
                                    </span>
                                </div>
                                <p className="text-xs font-normal font-poppins text-foreground/50 truncate mt-0.5">
                                    {alert.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 pb-6 pt-0">
                <button
                    onClick={() => router.push('/loggings')}
                    className="w-full h-[40px] px-6 text-xs font-medium font-poppins text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 rounded-lg border border-primary/20"
                >
                    Full Operations Log
                    <ArrowRight size={14} />
                </button>
            </div>
        </Card >
    );
};
