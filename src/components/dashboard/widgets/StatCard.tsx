"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label?: string };
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  delay?: number;
}

const colorMap = {
  primary: "from-primary/20 to-primary/5 text-primary border-primary/20",
  secondary: "from-secondary/20 to-secondary/5 text-secondary border-secondary/20",
  accent: "from-accent/20 to-accent/5 text-accent border-accent/20",
  success: "from-success/20 to-success/5 text-success border-success/20",
  warning: "from-warning/20 to-warning/5 text-warning border-warning/20",
  error: "from-error/20 to-error/5 text-error border-error/20",
};

const iconBgMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = "primary",
  delay = 0,
}) => {
  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
        ? TrendingDown
        : Minus
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="relative h-full"
    >
      <div className={cn(
        "glass-card-geo px-3 py-2.5 relative overflow-hidden group border h-full flex items-center gap-3",
        `border-${color}/20`
      )}>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", 
           `bg-${color}/10 text-${color}`)}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-foreground/40 leading-tight truncate">
            {label}
          </p>
          <p className={cn("text-lg font-black tracking-tight leading-tight", `text-${color}`)}>
            {value}
          </p>
        </div>

        {trend && TrendIcon && (
          <div className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0",
            trend.value > 0 ? "bg-success/10 text-success" : trend.value < 0 ? "bg-error/10 text-error" : "bg-foreground/5 text-foreground/50"
          )}>
            <TrendIcon size={9} />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
