"use client";

import React, { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ranges = [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Custom Range", value: "custom" },
];

export const TimeRangeSelector = () => {
    const [selected, setSelected] = useState(ranges[1]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-2.5 px-[22px] py-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-[42px]",
                        "bg-background text-foreground border border-border-light rounded-lg",
                        "hover:bg-foreground/5 min-w-[160px] justify-between"
                    )}
                >
                    <div className="flex items-center gap-2.5">
                        <Calendar size={18} className="text-foreground/80" />
                        <span className="text-sm font-poppins font-medium">
                            {selected.label}
                        </span>
                    </div>
                    <ChevronDown size={16} className="text-foreground/60" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[200px] bg-background border border-border-light rounded-lg shadow-xl p-1 animate-in fade-in slide-in-from-top-2 duration-200"
            >
                {ranges.map((range) => (
                    <DropdownMenuItem
                        key={range.value}
                        onClick={() => setSelected(range)}
                        className="cursor-pointer py-2.5 px-4 focus:bg-primary/5 focus:text-primary transition-colors font-poppins text-sm rounded-md"
                    >
                        {range.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
