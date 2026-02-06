"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type TileState = "gray" | "blue" | "amber" | "red";

interface TileGridProps {
  /** 2D array of tile states, rows x cols */
  tiles: TileState[][];
  className?: string;
}

const TILE_COLORS: Record<TileState, string> = {
  gray: "bg-tile-gray",
  blue: "bg-tile-blue",
  amber: "bg-tile-amber",
  red: "bg-tile-red",
};

const TILE_WIDTH = 11.693;
const TILE_HEIGHT = 11.088;
const COL_GAP = 16.78 - TILE_WIDTH; // ~5.087px
const ROW_GAP = 15.91 - TILE_HEIGHT; // ~4.822px

export const TileGrid: React.FC<TileGridProps> = ({ tiles, className }) => {
  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ gap: `${ROW_GAP}px` }}
      role="grid"
      aria-label="Terminal grid"
    >
      {tiles.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex"
          style={{ gap: `${COL_GAP}px` }}
          role="row"
        >
          {row.map((state, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={cn(
                "rounded-[1px] transition-colors",
                TILE_COLORS[state],
              )}
              style={{
                width: `${TILE_WIDTH}px`,
                height: `${TILE_HEIGHT}px`,
                minWidth: `${TILE_WIDTH}px`,
                minHeight: `${TILE_HEIGHT}px`,
              }}
              role="gridcell"
              aria-label={`Tile ${rowIdx + 1}-${colIdx + 1}: ${state}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
