"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  variant?: "filled" | "outline";
  delay?: number;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  label,
  icon,
  onClick,
  color = "primary",
  variant = "outline",
  delay = 0,
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: delay * 0.05 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group w-full text-left",
        variant === "filled"
          ? `bg-${color}/10 hover:bg-${color}/20 text-${color} border border-${color}/10`
          : `bg-foreground/[0.02] hover:bg-foreground/[0.05] text-foreground border border-slate-200 dark:border-slate-800 hover:border-${color}/20`
      )}
    >
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", `bg-${color}/10 text-${color}`)}>
        {icon}
      </div>
      <span className="text-xs font-semibold flex-1">{label}</span>
      <ArrowRight size={12} className="text-foreground/20 group-hover:text-foreground/40 group-hover:translate-x-0.5 transition-all" />
    </motion.button>
  );
};

interface QuickActionsGridProps {
  actions: QuickActionProps[];
  title?: string;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ actions, title }) => (
  <div className="space-y-3">
    {title && (
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40">
        {title}
      </p>
    )}
    <div className="space-y-2">
      {actions.map((action, i) => (
        <QuickAction key={i} {...action} delay={i} />
      ))}
    </div>
  </div>
);
