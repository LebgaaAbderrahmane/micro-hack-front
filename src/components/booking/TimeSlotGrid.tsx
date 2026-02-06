"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimeSlot {
    id: string;
    time: string;
    available: number;
    total: number;
}

interface TimeSlotGridProps {
    slots: TimeSlot[];
    onSlotSelect: (slotId: string) => void;
    selectedSlotId?: string;
}

export const TimeSlotGrid = ({ slots, onSlotSelect, selectedSlotId }: TimeSlotGridProps) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isFull = slot.available === 0;
                const isNearFull = slot.available > 0 && (slot.available / slot.total) < 0.3;

                return (
                    <button
                        key={slot.id}
                        disabled={isFull}
                        onClick={() => onSlotSelect(slot.id)}
                        className={cn(
                            "p-4 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden group",
                            isSelected
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "bg-foreground/5 border-foreground/10 hover:border-primary/50 text-foreground",
                            isFull && "opacity-40 cursor-not-allowed grayscale"
                        )}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={14} className={isSelected ? "text-white" : "text-primary"} />
                            <span className="text-sm font-bold">{slot.time}</span>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider",
                                    isSelected ? "text-white/60" : "text-foreground/40"
                                )}>
                                    Availability
                                </span>
                                <span className={cn(
                                    "text-xs font-bold",
                                    isSelected ? "text-white" : isNearFull ? "text-warning" : "text-success"
                                )}>
                                    {slot.available}/{slot.total}
                                </span>
                            </div>
                            <div className={cn("w-full h-1 rounded-full", isSelected ? "bg-white/20" : "bg-foreground/5")}>
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        isSelected ? "bg-white" : isNearFull ? "bg-warning" : "bg-success"
                                    )}
                                    style={{ width: `${(slot.available / slot.total) * 100}%` }}
                                />
                            </div>
                        </div>

                        {isFull && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] -rotate-12 border border-white/20 px-2 py-1 rounded">
                                    Fully Booked
                                </span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
