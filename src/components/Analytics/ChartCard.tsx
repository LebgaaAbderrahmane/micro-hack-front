"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Download, Maximize2, Minimize2, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    onExport?: (format: "png" | "csv") => void;
    hideActions?: boolean;
}

export const ChartCard = ({
    title,
    subtitle,
    children,
    className,
    onExport,
    hideActions = false,
}: ChartCardProps) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
        <Card className={cn(
            "flex flex-col transition-all duration-300 bg-background text-foreground border border-border-div",
            isFullScreen
                ? "fixed inset-0 z-50 rounded-none w-screen h-screen m-0 shadow-none"
                : "w-full min-h-[400px] rounded-lg shadow-sm hover:shadow-md",
            className
        )}>
            {/* Standardized Header Padding */}
            <div className="flex flex-row items-center justify-between p-6 shrink-0">
                <div className="space-y-0.5">
                    <h3 className="text-lg font-semibold text-foreground font-poppins tracking-tight line-clamp-1">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm font-normal font-poppins text-foreground/50 line-clamp-1">{subtitle}</p>
                    )}
                </div>
                {!hideActions && (
                    <div className="flex items-center gap-1 shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="h-9 w-9 text-foreground/40 hover:text-primary transition-all flex items-center justify-center rounded-md hover:bg-foreground/5"
                                    title="Download data"
                                >
                                    <Download size={16} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border border-border-div rounded-lg shadow-xl p-1">
                                <DropdownMenuItem onClick={() => onExport?.("png")} className="cursor-pointer font-poppins text-sm hover:bg-foreground/5 focus:bg-primary/5 focus:text-primary rounded-md">
                                    Export as PNG
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onExport?.("csv")} className="cursor-pointer font-poppins text-sm hover:bg-foreground/5 focus:bg-primary/5 focus:text-primary rounded-md">
                                    Export as CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button
                            onClick={toggleFullScreen}
                            className="h-9 w-9 text-foreground/40 hover:text-primary transition-all flex items-center justify-center rounded-md hover:bg-foreground/5"
                            title={isFullScreen ? "Exit full screen" : "Full screen"}
                        >
                            {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="h-9 w-9 text-foreground/40 hover:text-primary transition-all flex items-center justify-center rounded-md hover:bg-foreground/5"
                                    title="More options"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border border-border-div rounded-lg shadow-xl p-1">
                                <DropdownMenuItem className="cursor-pointer font-poppins text-sm hover:bg-foreground/5 focus:bg-primary/5 focus:text-primary rounded-md">
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer font-poppins text-sm hover:bg-foreground/5 focus:bg-primary/5 focus:text-primary rounded-md">
                                    Refresh Data
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className={cn(
                "flex-1 px-6 pb-6 pt-0 flex flex-col min-h-0",
                isFullScreen ? "h-[calc(100vh-80px)]" : ""
            )}>
                <div className="flex-1 w-full min-h-[300px] relative">
                    <div className="absolute inset-0">
                        {children}
                    </div>
                </div>
            </div>
        </Card>
    );
};
