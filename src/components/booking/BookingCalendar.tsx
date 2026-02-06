"use client";

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, startOfToday } from "date-fns";

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export const BookingCalendar = ({ onDateSelect, selectedDate }: BookingCalendarProps) => {
  const [month, setMonth] = useState<Date>(selectedDate || new Date());

  const disabledDays = {
    before: startOfToday(),
  };

  return (
    <div className="glass-card p-6 border border-foreground/5 inline-block">
      <style>{`
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #3B82F6;
          --rdp-background-color: rgba(59, 130, 246, 0.1);
          margin: 0;
        }
        .rdp-today {
          font-weight: bold;
          color: var(--rdp-accent-color);
        }
        .rdp-button:hover:not([disabled]):not(.rdp-selected) {
          background-color: var(--rdp-background-color);
        }
        .rdp-selected {
          background-color: var(--rdp-accent-color) !important;
          color: white !important;
        }
        .rdp-head_cell {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          padding-bottom: 1rem;
        }
        .rdp-nav_button {
          color: rgba(255, 255, 255, 0.6);
        }
        .rdp-month {
          color: white;
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date: Date | undefined) => date && onDateSelect(date)}
        disabled={disabledDays}
        month={month}
        onMonthChange={setMonth}
        className="font-sans"
      />
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-foreground/5 flex items-center justify-between">
          <span className="text-xs text-foreground/40 font-medium uppercase tracking-wider">Selected Date</span>
          <span className="text-sm font-bold text-primary">{format(selectedDate, "PPP")}</span>
        </div>
      )}
    </div>
  );
};
