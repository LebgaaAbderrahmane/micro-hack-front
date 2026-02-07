"use client";

import React from "react";
import { Package, MapPin, Clock, Truck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingCardComponent } from "@/types/ai-components";

interface AIBookingCardProps {
  component: BookingCardComponent;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  expired: "bg-red-500/10 text-red-500 border-red-500/20",
  scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export const AIBookingCard: React.FC<AIBookingCardProps> = ({ component }) => {
  const {
    title,
    booking_reference,
    status,
    truck_plate,
    driver_name,
    time_slot,
    location,
  } = component;

  const statusKey = status.toLowerCase().replace(/\s+/g, "_");
  const statusStyle =
    STATUS_STYLES[statusKey] ??
    "bg-foreground/5 text-foreground/60 border-foreground/10";

  const details = [
    { icon: Truck, label: "Truck", value: truck_plate },
    { icon: User, label: "Driver", value: driver_name },
    { icon: Clock, label: "Time Slot", value: time_slot },
    { icon: MapPin, label: "Location", value: location },
  ].filter((d) => d.value);

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Package size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {title ?? "Booking"}
            </p>
            <p className="text-sm font-bold text-foreground tracking-tight">
              {booking_reference}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            statusStyle,
          )}
        >
          {status}
        </span>
      </div>

      {/* Details */}
      {details.length > 0 && (
        <div className="grid grid-cols-2 gap-px bg-white/5">
          {details.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-background/50"
            >
              <Icon size={13} className="text-muted-foreground/40 shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  {label}
                </p>
                <p className="text-xs font-semibold text-foreground/80 truncate">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
