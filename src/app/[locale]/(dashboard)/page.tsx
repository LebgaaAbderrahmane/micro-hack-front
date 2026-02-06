"use client";

import React from "react";
import { TerminalCard } from "@/components/Terminals/TerminalCard";
import { GateIndicator } from "@/components/Terminals/GateIndicator";
import type { TileState } from "@/components/Terminals/TileGrid";
import { Calendar, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  AdminDashboard,
  TerminalOpDashboard,
  CarrierDashboard,
} from "@/components/dashboard/RoleDashboards";

// ---------------------------------------------------------------------------
// Helper: generate a tile grid from a pattern description
// ---------------------------------------------------------------------------
function generateGrid(
  rows: number,
  cols: number,
  fillColor: TileState,
  filledRows: number,
): TileState[][] {
  const grid: TileState[][] = [];
  const emptyRowCount = rows - filledRows;

  for (let r = 0; r < rows; r++) {
    const row: TileState[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(r < emptyRowCount ? "gray" : fillColor);
    }
    grid.push(row);
  }
  return grid;
}

// ---------------------------------------------------------------------------
// Terminal data matching the Figma screenshot
// ---------------------------------------------------------------------------
const TERMINAL_ROWS = 10;
const TERMINAL_COLS = 12;

const terminalsData: { label: string; tiles: TileState[][] }[] = [
  {
    label: "Terminal 1",
    tiles: generateGrid(TERMINAL_ROWS, TERMINAL_COLS, "blue", 6),
  },
  {
    label: "Terminal 2",
    tiles: generateGrid(TERMINAL_ROWS, TERMINAL_COLS, "amber", 6),
  },
  {
    label: "Terminal 3",
    tiles: generateGrid(TERMINAL_ROWS, TERMINAL_COLS, "blue", 5),
  },
  {
    label: "Terminal 4",
    tiles: generateGrid(TERMINAL_ROWS, TERMINAL_COLS, "red", 5),
  },
];

// ---------------------------------------------------------------------------
// Gate data matching the Figma screenshot
// ---------------------------------------------------------------------------
const gatesData: { label: string; segments: TileState[] }[] = [
  { label: "gate 1", segments: ["gray", "blue", "blue"] },
  { label: "gate 2", segments: ["gray", "gray", "gray", "gray"] },
  { label: "gate 3", segments: ["gray", "red", "red", "gray"] },
  { label: "gate 4", segments: ["gray", "gray", "gray", "gray"] },
  { label: "gate 5", segments: ["gray", "gray", "amber", "amber"] },
  { label: "gate 6", segments: ["gray", "gray", "gray", "gray"] },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Home() {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-foreground/40 animate-pulse">
            Verifying Node Identity...
          </p>
        </div>
      </div>
    );
  }

  // Show role-specific dashboard if available
  if (profile?.role === "ADMIN") return <AdminDashboard />;
  if (profile?.role === "OPERATOR") return <TerminalOpDashboard />;
  if (profile?.role === "DISPATCHER") return <CarrierDashboard />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1
          className="text-content-title dark:text-foreground"
          style={{
            fontFamily: "var(--font-poppins), sans-serif",
            fontWeight: 600,
            fontSize: 22,
          }}
        >
          Live Ports Operations
        </h1>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm text-foreground/70">
            <Calendar size={16} />
            <span>Today</span>
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm text-foreground/70">
            <span>6:00</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Cards Row */}
      <section className="flex flex-wrap justify-center gap-12 xl:gap-[100px]">
        {terminalsData.map((t, i) => (
          <TerminalCard key={i} label={t.label} tiles={t.tiles} />
        ))}
      </section>

      {/* Gate Indicators Row */}
      <section className="flex flex-wrap justify-center gap-10 xl:gap-16 pt-4">
        {gatesData.map((g, i) => (
          <GateIndicator key={i} label={g.label} segments={g.segments} />
        ))}
      </section>
    </div>
  );
}
