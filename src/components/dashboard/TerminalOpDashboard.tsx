"use client";

import React, { useState } from "react";
import { Ship, AlertTriangle, CheckCircle, XCircle, Info, Clock, Bell } from "lucide-react";
import TerminalYard from "./TerminalYard";
import { useToast } from "@/components/common/Toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const TerminalOpDashboard = () => {
    const { show } = useToast();
    const [saturation] = useState(78); // Mock saturation percentage

    const [bookings, setBookings] = useState([
        { id: "A01", time: "12m", truck: "TRUCK-AL-991", company: "TransGlobal Logistics", status: "pending" },
        { id: "A02", time: "15m", truck: "TRUCK-AL-992", company: "FastTrack Inc.", status: "pending" },
        { id: "A03", time: "22m", truck: "TRUCK-AL-993", company: "LogiCorp", status: "pending" },
        { id: "A04", time: "30m", truck: "TRUCK-AL-994", company: "Speedy Ship", status: "pending" },
    ]);

    const [notifications] = useState([
        { id: 1, type: "warning", message: "Gate 02 delayed maintenance check required", time: "2m ago" },
        { id: 2, type: "info", message: "Incoming vessel 'Sea Giant' approaching dock", time: "15m ago" },
        { id: 3, type: "error", message: "Capacity warning: Yard Section B at 95%", time: "1h ago" },
    ]);

    const handleAction = (id: string, action: "validate" | "reject") => {
        setBookings(prev => prev.filter(b => b.id !== id));
        if (action === "validate") {
            show(`Booking ${id} validated. Directing to Lane B.`, "success");
        } else {
            show(`Booking ${id} rejected.`, "error");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-[0_0_20px_rgba(var(--secondary),0.2)]">
                        <Ship size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Terminal Control Center</h1>
                        <p className="text-foreground/50">Real-time Operations & Monitoring</p>
                    </div>
                </div>

                {/* Saturation Indicator */}
                <div className="glass-card px-6 py-3 border border-foreground/5 flex items-center gap-6">
                    <div>
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Yard Saturation</p>
                        <div className="flex items-baseline gap-1">
                            <span className={cn("text-2xl font-black", saturation > 80 ? "text-error" : "text-success")}>
                                {saturation}%
                            </span>
                            <span className="text-xs text-foreground/40">Occupied</span>
                        </div>
                    </div>
                    <div className="w-32 h-2 bg-foreground/10 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-1000", saturation > 80 ? "bg-error" : "bg-success")}
                            style={{ width: `${saturation}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Visualization Area */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="glass-card p-6 min-h-[500px] flex flex-col border border-foreground/5 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                                Live Yard Visualization
                            </h3>
                            <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-green-500/10 text-green-500 rounded-full animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                LIVE
                            </span>
                        </div>
                        <div className="flex-1 w-full relative group rounded-xl overflow-hidden border border-foreground/5">
                            <TerminalYard />
                        </div>
                    </div>

                    {/* Notifications Panel */}
                    <div className="glass-card p-6 border border-foreground/5">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Bell size={20} className="text-foreground/70" />
                            Live Alerts & Events
                        </h3>
                        <div className="space-y-3">
                            {notifications.map((note) => (
                                <div key={note.id} className="flex items-start gap-4 p-4 rounded-xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 transition-colors">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        note.type === "warning" && "bg-warning/10 text-warning",
                                        note.type === "error" && "bg-error/10 text-error",
                                        note.type === "info" && "bg-info/10 text-info",
                                        !["warning", "error", "info"].includes(note.type) && "bg-primary/10 text-primary"
                                    )}>
                                        {note.type === "warning" && <AlertTriangle size={16} />}
                                        {note.type === "error" && <AlertTriangle size={16} />}
                                        {note.type === "info" && <Info size={16} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{note.message}</p>
                                        <p className="text-xs text-foreground/40 mt-1">{note.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Validation Queue */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 border border-foreground/5 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg">Validation Queue</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-md">{bookings.length} Pending</span>
                                <Link href="/operator/bookings" className="text-xs font-bold text-primary hover:underline">View All</Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {bookings.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-12 text-foreground/30 flex flex-col items-center gap-3"
                                    >
                                        <CheckCircle size={48} className="opacity-20" />
                                        <p>All clear! No pending validations.</p>
                                    </motion.div>
                                ) : (
                                    bookings.map((booking) => (
                                        <motion.div
                                            key={booking.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            className="p-5 rounded-xl bg-foreground/5 border border-foreground/5 hover:border-secondary/30 transition-all hover:shadow-lg group"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none px-2 py-1 bg-secondary/10 rounded">
                                                    Slot Request
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-foreground/40 font-mono">
                                                    <Clock size={10} />
                                                    <span>{booking.time}</span>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="font-bold text-lg text-foreground">{booking.truck}</p>
                                                <p className="text-xs text-foreground/50">{booking.company}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 opacity-100 lg:opacity-60 lg:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleAction(booking.id, "reject")}
                                                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-all text-xs font-bold uppercase tracking-wide"
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                                <button
                                                    onClick={() => handleAction(booking.id, "validate")}
                                                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-all text-xs font-bold uppercase tracking-wide"
                                                >
                                                    <CheckCircle size={14} /> Validate
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
