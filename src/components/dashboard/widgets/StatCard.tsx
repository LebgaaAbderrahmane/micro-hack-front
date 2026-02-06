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
        "glass-card-geo p-5 relative overflow-hidden group border h-full flex flex-col justify-between",
        `border-${color}/20`
      )}>
        
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-sm border", 
             `bg-${color}/10 border-${color}/20 text-${color}`)}>
            {icon}
          </div>
          {trend && TrendIcon && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
              trend.value > 0 ? "bg-success/10 text-success" : trend.value < 0 ? "bg-error/10 text-error" : "bg-foreground/5 text-foreground/50"
            )}>
              <TrendIcon size={10} />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-1">
          {label}
        </p>
        <p className={cn("text-2xl font-black tracking-tight", `text-${color}`)}>
          {value}
        </p>

        {trend?.label && (
          <p className="text-[9px] text-foreground/30 mt-1 font-medium">{trend.label}</p>
        )}
      </div>
    </motion.div>
  );
};
