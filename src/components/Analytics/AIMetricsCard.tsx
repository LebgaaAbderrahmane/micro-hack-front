"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Gauge, TriangleAlert, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
    {
        label: "Forecast Accuracy",
        value: "92.5%",
        icon: <Target className="w-3.5 h-3.5" />,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        label: "Anomaly Detection",
        value: "98.3%",
        icon: <TriangleAlert className="w-3.5 h-3.5" />,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        label: "Weekly Savings",
        value: "$14.2K",
        icon: <DollarSign className="w-3.5 h-3.5" />,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

export const AIMetricsCard = () => {
    return (
        <Card className={cn(
            "w-full h-full flex flex-col p-6 transition-all duration-300",
            "bg-background text-foreground border border-border-div",
            "rounded-lg shadow-sm hover:shadow-md"
        )}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div
                        className="shrink-0 flex items-center justify-center rounded-lg shadow-sm bg-[#9f9ff8]"
                        style={{ width: 45, height: 45 }}
                    >
                        <Sparkles size={24} color="#ffffff" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-brand-text font-poppins tracking-tight">AI Orchestrator</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] font-medium text-foreground/40 uppercase tracking-widest">Active Cluster</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto">
                {metrics.map((m, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-foreground/[0.02] border border-border-div/50 transition-all hover:bg-foreground/[0.04]"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", m.bg, m.color)}>
                                {m.icon}
                            </div>
                            <span className="text-sm font-medium font-poppins text-foreground/70">{m.label}</span>
                        </div>
                        <span className="text-base font-bold font-poppins text-foreground">{m.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-4 rounded-lg bg-[#9f9ff8]/10 border border-[#9f9ff8]/20 shrink-0">
                <div className="flex items-center gap-2 mb-2 text-[#9f9ff8]">
                    <Gauge size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Insight</span>
                </div>
                <p className="text-xs font-medium font-poppins text-foreground/80 leading-relaxed">
                    Predictive model identifies 22% underutilization in Terminal 3 buffer zone. Recommend dynamic pricing adjustment to increase throughput by 15%.
                </p>
            </div>
        </Card>
    );
};
