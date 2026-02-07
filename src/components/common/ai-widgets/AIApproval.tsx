"use client";

import React, { useState } from "react";
import { ShieldCheck, X, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ActionProposalComponent } from "@/types/ai-components";

interface AIApprovalProps {
  component: ActionProposalComponent;
  onRespond?: (action: "approve" | "reject", entityId: string, actionType: string) => void;
}

export const AIApproval: React.FC<AIApprovalProps> = ({
  component,
  onRespond,
}) => {
  const { title, action_type, entity_id, description, data } = component;
  const [state, setState] = useState<"pending" | "approving" | "rejecting" | "approved" | "rejected">("pending");

  const handleAction = (action: "approve" | "reject") => {
    setState(action === "approve" ? "approving" : "rejecting");
    onRespond?.(action, entity_id, action_type);
    // Optimistic UI — mark as completed after a short delay
    setTimeout(() => {
      setState(action === "approve" ? "approved" : "rejected");
    }, 600);
  };

  const contextEntries = Object.entries(data).filter(
    ([, v]) => v != null && v !== "",
  );

  const isResolved = state === "approved" || state === "rejected";
  const isProcessing = state === "approving" || state === "rejecting";

  return (
    <div className="mt-3 rounded-xl border border-primary/20 bg-primary/[0.03] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border-b border-primary/10">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <AlertTriangle size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
            {title ?? "Action Proposal"}
          </p>
          <p className="text-xs font-semibold text-foreground/80">
            {description}
          </p>
        </div>
      </div>

      {/* Context data */}
      {contextEntries.length > 0 && (
        <div className="px-4 py-2.5 space-y-1.5 border-b border-primary/10">
          {contextEntries.slice(0, 6).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground/60 font-medium capitalize">
                {key.replace(/_/g, " ")}
              </span>
              <span className="text-foreground/80 font-semibold">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-end gap-2">
        {isResolved ? (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold",
              state === "approved"
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500",
            )}
          >
            {state === "approved" ? (
              <ShieldCheck size={14} />
            ) : (
              <X size={14} />
            )}
            {state === "approved" ? "Approved" : "Rejected"}
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              disabled={isProcessing}
              onClick={() => handleAction("reject")}
              className="h-8 rounded-lg text-[10px] font-bold uppercase text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              {state === "rejecting" ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : (
                <X size={14} className="mr-1" />
              )}
              Reject
            </Button>
            <Button
              size="sm"
              disabled={isProcessing}
              onClick={() => handleAction("approve")}
              className="h-8 rounded-lg text-[10px] font-bold uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              {state === "approving" ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : (
                <ShieldCheck size={14} className="mr-1" />
              )}
              Approve
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
