"use client";

import React from "react";
import { TileState } from "./TileGrid";
import { cn } from "@/lib/utils";

interface GateIndicatorProps {
  label: string;
  /** Array of segment states — each segment is a colored pill */
  segments: TileState[];
  className?: string;
  onClick?: () => void;
}

const SEGMENT_COLORS: Record<TileState, string> = {
  gray: "bg-tile-gray",
  blue: "bg-tile-blue",
  amber: "bg-tile-amber",
  red: "bg-tile-red",
};

export const GateIndicator: React.FC<GateIndicatorProps> = ({
  label,
  segments,
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 cursor-pointer group transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-tile-blue outline-none",
        className,
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`${label}: ${segments.join(", ")}`}
    >
      {/* Gate pill */}
      <div
        className="flex items-center gap-1 bg-card-bg dark:bg-foreground/10 rounded-md px-2 py-1.5"
        style={{ borderRadius: 6 }}
      >
        {segments.map((state, i) => (
          <div
            key={i}
            className={cn("rounded-[2px]", SEGMENT_COLORS[state])}
            style={{ width: 12, height: 20 }}
          />
        ))}
      </div>

      {/* Caption */}
      <span
        className="text-content-title dark:text-foreground/60"
        style={{
          fontFamily: "var(--font-poppins), sans-serif",
          fontWeight: 500,
          fontSize: 12,
        }}
      >
        {label}
      </span>
    </div>
  );
};
