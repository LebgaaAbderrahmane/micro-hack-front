"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface KPICardProps {
    title: string;
    value: string | number;
    change?: {
        value: string;
        isPositive: boolean;
    };
    icon: React.ReactNode;
    color?: "blue" | "green" | "orange" | "purple" | "red" | "lavender" | "teal";
    className?: string;
    chartData?: any[];
}

const colorStyles = {
    blue: { bg: "#4b97fb", stroke: "#4b97fb" },
    green: { bg: "#71dd8c", stroke: "#71dd8c" },
    orange: { bg: "#ffb74d", stroke: "#ffb74d" },
    purple: { bg: "#9f9ff8", stroke: "#9f9ff8" },
    red: { bg: "#f23e3e", stroke: "#f23e3e" },
    lavender: { bg: "#9f9ff8", stroke: "#9f9ff8" },
    teal: { bg: "#2dd4bf", stroke: "#2dd4bf" },
};

export const KPICard = ({
    title,
    value,
    change,
    icon,
    color = "blue",
    className,
    chartData = [
        { v: 10 }, { v: 15 }, { v: 8 }, { v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }
    ],
}: KPICardProps) => {
    const style = colorStyles[color];

    return (
        <Card className={cn(
            "w-full px-5 pt-5 pb-10 flex flex-col justify-between transition-all duration-300 cursor-pointer h-[160px]",
            "bg-background text-foreground border border-border-div",
            "rounded-lg shadow-sm hover:shadow-md hover:bg-foreground/2",
            className
        )}>
            <div className="flex items-start justify-between">
                <div
                    className="shrink-0 flex items-center justify-center rounded-lg shadow-sm font-bold transition-transform hover:scale-105"
                    style={{
                        width: 40,
                        height: 40,
                        backgroundColor: style.bg
                    }}
                >
                    {React.cloneElement(icon as React.ReactElement<any>, {
                        size: 20,
                        color: "#ffffff"
                    })}
                </div>
                {change && (
                    <div
                        className={cn(
                            "flex items-center text-xs font-bold font-poppins",
                            change.isPositive ? "text-[#71dd8c]" : "text-[#f23e3e]"
                        )}
                    >
                        {change.isPositive ? (
                            <ArrowUpIcon className="w-3.5 h-3.5 mr-1" />
                        ) : (
                            <ArrowDownIcon className="w-3.5 h-3.5 mr-1" />
                        )}
                        {change.value}
                    </div>
                )}
            </div>

            <div className="mt-2 space-y-0.5">
                <p className="text-xs font-medium font-poppins text-foreground/60 leading-tight uppercase tracking-wide">
                    {title}
                </p>

                <div className="flex items-end justify-between gap-3">
                    <h3 className="text-2xl font-bold font-poppins text-foreground tracking-tight">
                        {value}
                    </h3>

                    {/* Mini Sparkline */}
                    <div className="h-10 w-24 shrink-0 overflow-hidden rounded opacity-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={style.stroke} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={style.stroke} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="v"
                                    stroke={style.stroke}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={`url(#grad-${color})`}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Card>
    );
};
