import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Terminal interface based on database types
 * id: string (UUID)
 * zone_code: string (e.g., "A1")
 * zone_name: string (e.g., "Main Terminal")
 */
interface Terminal {
  id: string;
  zone_code: string;
  zone_name: string;
}

interface TerminalSelectorProps {
  terminals: Terminal[];
  selectedId: string;
  onSelect: (value: string) => void;
  className?: string;
}

export function TerminalSelector({
  terminals,
  selectedId,
  onSelect,
  className,
}: TerminalSelectorProps) {
  return (
    <Select value={selectedId} onValueChange={onSelect}>
      <SelectTrigger
        className={cn(
          "w-[240px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
          className
        )}
      >
        <SelectValue placeholder="Select Terminal" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Terminals</SelectItem>
        {terminals.map((terminal) => (
          <SelectItem key={terminal.id} value={terminal.id}>
            [{terminal.zone_code}] {terminal.zone_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
