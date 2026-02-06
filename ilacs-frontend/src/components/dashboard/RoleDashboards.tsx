"use client";

import React from "react";
import { Ship, Truck as TruckIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";


export const AdminDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck size={28} />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Port Administration</h1>
                <p className="text-foreground/50">System-wide monitoring and terminal management.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: "Active Nodes", value: "34", color: "text-primary" },
                { label: "Alerts (24h)", value: "128", color: "text-error" },
                { label: "Total Handled", value: "45.2k", color: "text-success" },
                { label: "System Uptime", value: "99.9%", color: "text-primary" }
            ].map((stat, idx) => (
                <div key={idx} className="glass-card p-6 border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{stat.label}</p>
                    <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
                </div>
            ))}
        </div>
    </div>
);

import TerminalYard from "./TerminalYard";
import { useToast } from "@/components/common/Toast";

export const TerminalOpDashboard = () => {
    const { show } = useToast();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Ship size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Terminal Control Center</h1>
                    <p className="text-foreground/50">Managing Terminal North (T-001) operations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6 min-h-[500px] flex flex-col border border-white/5">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                        Gate & Yard Visualization
                    </h3>
                    <div className="flex-1 w-full relative group">
                        <TerminalYard />
                    </div>
                </div>

                <div className="glass-card p-6 border border-white/5">
                    <h3 className="font-bold text-lg mb-6">Booking Queue</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                onClick={() => show(`Directing Truck ${i} to Lane B`, "info")}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-secondary/30 transition-all cursor-pointer hover:bg-white/10"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none">Booked</span>
                                    <span className="text-[10px] text-foreground/40 font-sans leading-none">In 12m</span>
                                </div>
                                <p className="font-semibold text-sm">TRUCK-AL-99{i}</p>
                                <p className="text-xs text-foreground/50 mt-1">TransGlobal Logistics</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CarrierDashboard = () => {
    const { show } = useToast();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <TruckIcon size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Carrier Portal</h1>
                    <p className="text-foreground/50">Fleet management and slot booking.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-6 border border-white/5">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                            Active Fleet Status
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-4 cursor-pointer hover:bg-primary/10 transition-all" onClick={() => show("Opening GPS telemetry for TX-882", "info")}>
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <TruckIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-foreground/50 font-sans leading-none mb-1">In Transit</p>
                                    <p className="font-bold">TRUCK-TX-882</p>
                                </div>
                                <div className="ml-auto">
                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">On Time</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20 flex items-center gap-4 cursor-pointer hover:bg-warning/10 transition-all" onClick={() => show("Carrier CA-441 flagged for delay inspection", "warning")}>
                                <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning">
                                    <TruckIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-foreground/50 font-sans leading-none mb-1">Delayed</p>
                                    <p className="font-bold">TRUCK-CA-441</p>
                                </div>
                                <div className="ml-auto">
                                    <span className="text-[10px] bg-warning/20 text-warning px-2 py-0.5 rounded-full font-bold">+14m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border border-white/5">
                    <h3 className="font-bold text-lg mb-6">Upcoming Bookings</h3>
                    <p className="text-foreground/30 text-sm text-center py-12">No bookings for today.</p>
                    <button
                        onClick={() => show("Redirecting to slot reservation system...", "info")}
                        className="w-full py-3 bg-accent/10 text-accent rounded-xl font-bold text-sm hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/10 active:scale-95"
                    >
                        Book a Slot
                    </button>
                </div>
            </div>
        </div>
    );
};
