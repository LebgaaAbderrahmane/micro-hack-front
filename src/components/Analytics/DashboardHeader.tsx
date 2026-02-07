"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { TimeRangeSelector } from "@/components/Analytics/TimeRangeSelector";

export const DashboardHeader = () => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 w-full max-w-[1080px] mx-auto px-1">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-medium uppercase tracking-widest text-[10px]">
                    <LayoutDashboard size={14} />
                    Operations Suite
                </div>
                <h1 className="text-2xl font-semibold text-foreground font-poppins">
                    Analytics Dashboard
                </h1>
                <p className="text-sm font-normal font-poppins text-foreground/50">Monitoring real-time port logistics and terminal throughput.</p>
            </div>

            <div className="flex items-center gap-4">

                <TimeRangeSelector />
            </div>
        </div>
    );
};
