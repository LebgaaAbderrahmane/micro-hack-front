"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatsComponent, StatItem } from "@/types/ai-components";

interface AIStatsProps {
  component: StatsComponent;
}

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  down: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" },
  neutral: {
    icon: Minus,
    color: "text-muted-foreground",
    bg: "bg-foreground/5",
  },
} as const;

const COLOR_MAP: Record<string, string> = {
  blue: "text-blue-500",
  green: "text-green-500",
  red: "text-red-500",
  orange: "text-amber-500",
  amber: "text-amber-500",
  purple: "text-purple-500",
  teal: "text-teal-500",
  primary: "text-primary",
};

const StatCard: React.FC<{ item: StatItem }> = ({ item }) => {
  const trend = item.trend ? TREND_CONFIG[item.trend] : null;
  const TrendIcon = trend?.icon;
  const valueColor = item.color ? COLOR_MAP[item.color] ?? "text-foreground" : "text-foreground";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition-colors hover:bg-white/[0.05]">
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60 truncate">
          {item.label}
        </p>
        <p className={cn("text-lg font-black tracking-tight leading-tight", valueColor)}>
          {typeof item.value === "number"
            ? item.value.toLocaleString()
            : item.value}
        </p>
      </div>
      {trend && TrendIcon && (
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shrink-0",
            trend.bg,
            trend.color,
          )}
        >
          <TrendIcon size={12} />
        </div>
      )}
    </div>
  );
};

export const AIStats: React.FC<AIStatsProps> = ({ component }) => {
  const { title, items } = component;

  if (!items.length) return null;

  return (
    <div className="mt-3 space-y-2">
      {title && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
          {title}
        </p>
      )}
      <div
        className={cn(
          "grid gap-2",
          items.length === 1
            ? "grid-cols-1"
            : items.length === 2
              ? "grid-cols-2"
              : items.length === 3
                ? "grid-cols-3"
                : "grid-cols-2",
        )}
      >
        {items.map((item, i) => (
          <StatCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
};
