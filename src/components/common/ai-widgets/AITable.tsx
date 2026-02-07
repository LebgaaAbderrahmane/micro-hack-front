"use client";

import React from "react";
import { format, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import type { TableComponent } from "@/types/ai-components";

interface AITableProps {
  component: TableComponent;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  waiting: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20",
  expired: "bg-red-500/10 text-red-500 border-red-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

function formatCell(value: unknown, type: string): React.ReactNode {
  if (value == null) return <span className="text-muted-foreground/40">—</span>;

  const str = String(value);

  switch (type) {
    case "date": {
      try {
        const date = parseISO(str);
        if (isValid(date)) return format(date, "MMM dd, yyyy HH:mm");
      } catch {
        // fall through
      }
      return str;
    }
    case "currency":
      return (
        <span className="font-semibold tabular-nums">
          {typeof value === "number"
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              }).format(value)
            : str}
        </span>
      );
    case "number":
      return (
        <span className="tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : str}
        </span>
      );
    case "status": {
      const key = str.toLowerCase().replace(/\s+/g, "_");
      const colorClass =
        STATUS_COLORS[key] ?? "bg-foreground/5 text-foreground/60 border-foreground/10";
      return (
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            colorClass,
          )}
        >
          {str}
        </span>
      );
    }
    default:
      return str;
  }
}

export const AITable: React.FC<AITableProps> = ({ component }) => {
  const { title, columns, data } = component;

  if (!data.length) return null;

  return (
    <div className="mt-3 space-y-2">
      {title && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
          {title}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2.5 text-left font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 20).map((row, i) => (
              <tr
                key={i}
                className="border-t border-white/5 hover:bg-white/5 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-3 py-2 text-foreground/80 whitespace-nowrap"
                  >
                    {formatCell(row[col.key], col.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 20 && (
          <div className="px-3 py-2 text-[10px] text-muted-foreground/60 text-center border-t border-white/5">
            Showing 20 of {data.length} rows
          </div>
        )}
      </div>
    </div>
  );
};
