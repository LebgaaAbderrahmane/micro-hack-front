"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  headerRight?: React.ReactNode;
  accentColor?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
  delay = 0,
  headerRight,
  accentColor = "bg-primary",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={cn("glass-card-geo p-4 relative overflow-hidden h-full flex flex-col", className)}
    >
      <div className="flex items-center justify-between mb-3 relative z-10 shrink-0">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
            <span className={cn("w-1 h-5 rounded-full", accentColor)} />
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-foreground/40 mt-0.5 ml-3">{subtitle}</p>
          )}
        </div>
        {headerRight}
      </div>

      <div className="relative z-10 flex-1 min-h-0 min-w-0">{children}</div>
    </motion.div>
  );
};
