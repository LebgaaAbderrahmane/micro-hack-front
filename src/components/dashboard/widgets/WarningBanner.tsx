"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertTriangle, X, AlertCircle, Info } from "lucide-react";

interface WarningBannerProps {
  id: string;
  title: string;
  message: string;
  severity: "critical" | "warning" | "info";
  onDismiss?: (id: string) => void;
}

const severityConfig = {
  critical: {
    icon: AlertCircle,
    bg: "bg-error/5 border-error/20 dark:bg-error/10",
    iconColor: "text-error",
    titleColor: "text-error",
    accent: "bg-error",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning/5 border-warning/20 dark:bg-warning/10",
    iconColor: "text-warning",
    titleColor: "text-warning",
    accent: "bg-warning",
  },
  info: {
    icon: Info,
    bg: "bg-info/5 border-info/20 dark:bg-info/10",
    iconColor: "text-info",
    titleColor: "text-info",
    accent: "bg-info",
  },
};

export const WarningBanner: React.FC<WarningBannerProps> = ({
  id,
  title,
  message,
  severity,
  onDismiss,
}) => {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm",
          config.bg
        )}
      >
        {/* Left accent bar */}
        <div className={cn("absolute left-0 top-2 bottom-2 w-1 rounded-full", config.accent)} />

        <div className={cn("mt-0.5 ml-2 shrink-0", config.iconColor)}>
          <Icon size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn("text-xs font-bold", config.titleColor)}>{title}</p>
          <p className="text-[11px] text-foreground/50 mt-0.5 leading-relaxed">{message}</p>
        </div>

        {onDismiss && (
          <button
            onClick={() => onDismiss(id)}
            className="shrink-0 p-1 rounded-lg hover:bg-foreground/5 text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface WarningListProps {
  warnings: Array<{
    id: string;
    title: string;
    message: string;
    severity: "critical" | "warning" | "info";
  }>;
  onDismiss?: (id: string) => void;
}

export const WarningList: React.FC<WarningListProps> = ({ warnings, onDismiss }) => (
  <div className="space-y-2">
    <AnimatePresence mode="popLayout">
      {warnings.map((w) => (
        <WarningBanner key={w.id} {...w} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
);
