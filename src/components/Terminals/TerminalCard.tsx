"use client";

import React from "react";
import { TileGrid, TileState } from "./TileGrid";
import { cn } from "@/lib/utils";

interface TerminalCardProps {
  label: string;
  tiles: TileState[][];
  className?: string;
  onClick?: () => void;
}

export const TerminalCard: React.FC<TerminalCardProps> = ({
  label,
  tiles,
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 group cursor-pointer transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-tile-blue focus-visible:ring-offset-2 outline-none",
        className,
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Terminal card: ${label}`}
    >
      {/* Terminal label */}
      <h3
        className="text-card-label dark:text-foreground"
        style={{
          fontFamily: "var(--font-poppins), sans-serif",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {label}
      </h3>

      {/* Card body */}
      <div
        className="bg-card-bg dark:bg-foreground/10 flex items-center justify-center"
        style={{
          padding: "7.956px",
          borderRadius: "3.536px",
        }}
      >
        <TileGrid tiles={tiles} />
      </div>
    </div>
  );
};
