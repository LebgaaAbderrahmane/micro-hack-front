"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    ChevronRight,
    Calendar,
    Clock,
    MapPin,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeDisplay } from "@/components/booking/QRCodeDisplay";

import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/common/Toast";

const carrierBookings = [
    { id: "BK-2401-001", terminal: "Terminal North", date: "Feb 12, 2024", time: "14:00 - 15:00", truck: "TX-992-BK", status: "confirmed", color: "#3B82F6" },
    { id: "BK-2401-002", terminal: "Terminal South", date: "Feb 12, 2024", time: "09:00 - 10:00", truck: "TX-881-AL", status: "pending", color: "#FBBF24" },
    { id: "BK-2401-003", terminal: "Terminal North", date: "Feb 10, 2024", time: "11:00 - 12:00", truck: "TX-773-MN", status: "consumed", color: "#3B82F6" },
    { id: "BK-2401-004", terminal: "Terminal West", date: "Feb 09, 2024", time: "16:00 - 17:00", truck: "TX-441-CA", status: "cancelled", color: "#EF4444" },
];

const queueBookings = [
    { id: "BK-2401-001", terminal: "Terminal North", date: "Today", time: "14:00", truck: "TX-992-BK", carrier: "TransGlobal", status: "arriving", color: "#3B82F6" },
    { id: "BK-2401-005", terminal: "Terminal North", date: "Today", time: "14:15", truck: "TX-221-OP", carrier: "PortExpress", status: "at_gate", color: "#FBBF24" },
    { id: "BK-2401-006", terminal: "Terminal North", date: "Today", time: "14:30", truck: "TX-551-ZZ", carrier: "Oceanic", status: "loading", color: "#3B82F6" },
];

export default function BookingsPage() {
    const { user } = useAuthStore();
    const [selectedBooking, setSelectedBooking] = useState<{ id: string; terminal: string; date: string; time: string; truck: string; status: string; color: string } | null>(null);
    const { show } = useToast();

    const isCarrier = user?.role === "carrier";
    const displayBookings = isCarrier ? carrierBookings : queueBookings;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isCarrier ? "Booking Management" : "Terminal Operation Queue"}
                    </h1>
                    <p className="text-foreground/50">
                        {isCarrier
                            ? "View and manage your current terminal access reservations."
                            : "Live queue of truck arrivals and processing status for Terminal North."}
                    </p>
                </div>
                {isCarrier && (
                    <Link
                        href="/bookings/new"
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Record New Booking
                    </Link>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Bookings List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-4 border border-white/5 flex flex-wrap gap-4 items-center">
                        <div className="flex-1 relative min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                            <input
                                type="text"
                                placeholder="Search by ID, truck or terminal..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => show("Advanced filters for bookings coming soon", "info")}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
                        >
                            <Filter size={16} className="text-primary" />
                            Filter
                        </button>
                    </div>

                    <div className="space-y-4">
                        {displayBookings.map((booking) => (
                            <div
                                key={booking.id}
                                onClick={() => setSelectedBooking(booking)}
                                className={cn(
                                    "p-5 rounded-2xl glass-card border flex items-center gap-6 cursor-pointer group transition-all duration-300",
                                    selectedBooking?.id === booking.id ? "border-primary bg-primary/5 shadow-primary/10" : "border-white/5 hover:border-white/20"
                                )}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                                    <span className="text-[10px] font-black uppercase text-foreground/30 leading-none mb-1">
                                        {booking.date.includes(' ') ? booking.date.split(' ')[0] : 'NOW'}
                                    </span>
                                    <span className="text-lg font-bold leading-none">
                                        {booking.date.includes(' ') ? booking.date.split(' ')[1].replace(',', '') : 'TD'}
                                    </span>
                                </div>

                                <div className="flex-1 grid md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-foreground tracking-tight">{booking.terminal}</h4>
                                        <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-bold uppercase tracking-wider">
                                            <MapPin size={10} className="text-primary" />
                                            Sector A • {booking.truck}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/60">
                                            <Clock size={12} className="text-primary" />
                                            {booking.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-foreground/30 font-medium">
                                            <Calendar size={10} />
                                            {booking.date}
                                        </div>
                                    </div>

                                    <div className="flex items-center md:justify-end gap-3">
                                        <span
                                            className="text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest bg-white/5"
                                            style={{ color: booking.color, border: `1px solid ${booking.color}30` }}
                                        >
                                            {booking.status}
                                        </span>
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden sm:block">
                                    <ChevronRight size={18} className={cn(
                                        "transition-all duration-300",
                                        selectedBooking?.id === booking.id ? "text-primary translate-x-1" : "text-white/10 group-hover:text-white/30"
                                    )} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Sidebar / QR Preview */}
                <div className="sticky top-24 space-y-8">
                    {selectedBooking ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                            <QRCodeDisplay
                                value={selectedBooking.id}
                                bookingNumber={selectedBooking.id}
                                terminalName={selectedBooking.terminal}
                            />

                            <div className="glass-card p-6 border border-white/5 space-y-6">
                                <h3 className="font-bold border-b border-white/5 pb-4">Booking Details</h3>
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block">Cargo Type</span>
                                        <p className="text-sm font-semibold">Dry Containers</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block">Est. Duration</span>
                                        <p className="text-sm font-semibold">45 mins</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block">Priority</span>
                                        <p className="text-sm font-semibold text-accent">Standard</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block">Lane Ref</span>
                                        <p className="text-sm font-semibold">LN-042</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => show("Reschedule request sent to operator", "success")}
                                        className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Modify Slot
                                    </button>
                                    <button
                                        onClick={() => show("Booking cancellation initiated", "warning")}
                                        className="flex-1 py-2.5 bg-error/10 hover:bg-error/20 text-error rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-12 border border-white/5 flex flex-col items-center text-center space-y-4 opacity-50 border-dashed">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-foreground/20">
                                <Eye size={32} />
                            </div>
                            <p className="text-sm font-medium text-foreground/40">Select a booking to view its QR permit and details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
