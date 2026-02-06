"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: "ai" | "system" | "optimization";
  delay?: number;
}

const typeConfig = {
  ai: { icon: Sparkles, accent: "text-purple-500 bg-purple-500/10", badge: "AI Insight" },
  system: { icon: Lightbulb, accent: "text-info bg-info/10", badge: "System" },
  optimization: { icon: ArrowRight, accent: "text-success bg-success/10", badge: "Optimize" },
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  type = "system",
  delay = 0,
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="group"
    >
      <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5 hover:border-foreground/10 hover:bg-foreground/[0.04] transition-all duration-300 cursor-pointer"
        onClick={onAction}
      >
        <div className="flex items-start gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.accent)}>
            <Icon size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold text-foreground truncate">{title}</p>
              <span className={cn("text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full shrink-0", config.accent)}>
                {config.badge}
              </span>
            </div>
            <p className="text-[11px] text-foreground/40 leading-relaxed">{description}</p>
            {actionLabel && (
              <button className="mt-2 text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                {actionLabel} <ArrowRight size={10} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
