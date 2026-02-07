"use client";

import React from "react";
import { motion } from "framer-motion";
import type { UIComponent } from "@/types/ai-components";
import { AITable } from "./AITable";
import { AIChart } from "./AIChart";
import { AIStats } from "./AIStats";
import { AIBookingCard } from "./AIBookingCard";
import { AIApproval } from "./AIApproval";

interface UIComponentRendererProps {
  components: UIComponent[];
  onApprovalRespond?: (
    action: "approve" | "reject",
    entityId: string,
    actionType: string,
  ) => void;
}

function renderSingleComponent(
  component: UIComponent,
  onApprovalRespond?: UIComponentRendererProps["onApprovalRespond"],
): React.ReactNode {
  switch (component.type) {
    case "table":
      return <AITable component={component} />;
    case "chart":
      return <AIChart component={component} />;
    case "stats":
      return <AIStats component={component} />;
    case "booking_card":
      return <AIBookingCard component={component} />;
    case "approval":
      return <AIApproval component={component} onRespond={onApprovalRespond} />;
    default: {
      // Fallback: render raw JSON for unknown component types
      const unknown = component as { type: string };
      return (
        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/70 mb-1">
            Unknown component: {unknown.type}
          </p>
          <pre className="text-[10px] text-foreground/60 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(component, null, 2)}
          </pre>
        </div>
      );
    }
  }
}

export const UIComponentRenderer: React.FC<UIComponentRendererProps> = ({
  components,
  onApprovalRespond,
}) => {
  if (!components.length) return null;

  return (
    <div className="space-y-1">
      {components.map((component, idx) => (
        <motion.div
          key={`${component.type}-${idx}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.08 }}
        >
          {renderSingleComponent(component, onApprovalRespond)}
        </motion.div>
      ))}
    </div>
  );
};
