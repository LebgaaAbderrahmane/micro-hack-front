"use client";

import React, { useState } from "react";
import { Search, Filter, CheckCircle, XCircle, MoreHorizontal, QrCode, Mail, FileText, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";
import { QRCodeDisplay } from "@/components/booking/QRCodeDisplay";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
    id: string;
    truckId: string;
    company: string;
    driver: string;
    cargoType: string;
    requestTime: string;
    status: "pending" | "validated" | "rejected";
    email: string;
}

const MOCK_BOOKINGS: Booking[] = [
    { id: "BK-2024-001", truckId: "TRUCK-TX-882", company: "TransGlobal Logistics", driver: "John Doe", cargoType: "Perishables", requestTime: "10:30 AM", status: "pending", email: "dispatch@transglobal.com" },
    { id: "BK-2024-002", truckId: "TRUCK-CA-441", company: "FastTrack Inc.", driver: "Jane Smith", cargoType: "Electronics", requestTime: "10:45 AM", status: "pending", email: "ops@fasttrack.com" },
    { id: "BK-2024-003", truckId: "TRUCK-EU-102", company: "EuroFreight", driver: "Hans Gruber", cargoType: "General", requestTime: "11:15 AM", status: "validated", email: "logistics@eurofreight.eu" },
    { id: "BK-2024-004", truckId: "TRUCK-AS-559", company: "Asian Connect", driver: "Lee Wei", cargoType: "Hazardous", requestTime: "09:00 AM", status: "rejected", email: "transport@asianconnect.asia" },
    { id: "BK-2024-005", truckId: "TRUCK-US-223", company: "AmeriHaul", driver: "Mike Ross", cargoType: "General", requestTime: "12:00 PM", status: "pending", email: "mike@amerihaul.net" },
];

export const OperatorBookings = () => {
    const { show } = useToast();
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
    const [filter, setFilter] = useState<"all" | "pending" | "validated" | "rejected">("pending");
    const [search, setSearch] = useState("");
    const [showQRModal, setShowQRModal] = useState<string | null>(null);

    const filteredBookings = bookings.filter(b => {
        const matchesFilter = filter === "all" ? true : b.status === filter;
        const matchesSearch = b.truckId.toLowerCase().includes(search.toLowerCase()) ||
            b.company.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleValidate = (id: string, email: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "validated" } : b));
        show(`Booking ${id} Validated. QR Code sent to ${email}`, "success");
        // Show QR modal as preview of what was sent
        setShowQRModal(id);
    };

    const handleReject = (id: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "rejected" } : b));
        show(`Booking ${id} Rejected.`, "error");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Booking Requests</h1>
                    <p className="text-foreground/50">Validate and manage incoming terminal access requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className="pl-10 pr-4 py-2 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 text-sm w-64 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-foreground/5 rounded-xl text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-foreground/10 pb-4 overflow-x-auto">
                {["pending", "validated", "rejected", "all"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap",
                            filter === f
                                ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                                : "text-foreground/50 hover:bg-foreground/5"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredBookings.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-foreground/30 text-center"
                        >
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">No bookings found</p>
                            <p className="text-sm">Try adjusting your filters or search query.</p>
                        </motion.div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-6 border border-foreground/5 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-lg transition-all group"
                            >
                                {/* Status Icon */}
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                    booking.status === "pending" && "bg-warning/10 text-warning",
                                    booking.status === "validated" && "bg-success/10 text-success",
                                    booking.status === "rejected" && "bg-error/10 text-error"
                                )}>
                                    {booking.status === "pending" && <Truck size={24} />}
                                    {booking.status === "validated" && <CheckCircle size={24} />}
                                    {booking.status === "rejected" && <XCircle size={24} />}
                                </div>

                                {/* Details */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                    <div>
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">ID</p>
                                        <p className="font-bold flex items-center gap-2">
                                            {booking.id}
                                            {booking.status === "validated" && <QrCode size={14} className="text-success" />}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Company</p>
                                        <p className="font-medium text-sm">{booking.company}</p>
                                        <p className="text-xs text-foreground/50">{booking.truckId}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Cargo</p>
                                        <p className="font-medium text-sm">{booking.cargoType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Time</p>
                                        <p className="font-medium text-sm">{booking.requestTime}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end">
                                    {booking.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleReject(booking.id)}
                                                className="px-4 py-2 rounded-xl border border-error/20 text-error hover:bg-error hover:text-white transition-colors text-sm font-bold"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleValidate(booking.id, booking.email)}
                                                className="px-6 py-2 rounded-xl bg-success text-white shadow-lg shadow-success/20 hover:shadow-xl hover:scale-105 transition-all text-sm font-bold flex items-center gap-2"
                                            >
                                                <Mail size={16} /> Validate
                                            </button>
                                        </>
                                    )}
                                    {booking.status === "validated" && (
                                        <button
                                            onClick={() => setShowQRModal(booking.id)}
                                            className="px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors text-sm font-bold flex items-center gap-2"
                                        >
                                            <QrCode size={16} /> View QR
                                        </button>
                                    )}
                                    <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* QR Code Modal (Simulation of Email Content) */}
            <AnimatePresence>
                {showQRModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setShowQRModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute -top-4 -right-4 z-10">
                                <button
                                    onClick={() => setShowQRModal(null)}
                                    className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-2 border border-white/20 shadow-2xl">
                                <div className="bg-white rounded-[20px] overflow-hidden">
                                    <div className="bg-green-100 p-4 text-center border-b border-green-200">
                                        <p className="text-green-800 font-bold text-sm flex items-center justify-center gap-2">
                                            <CheckCircle size={16} /> Email Sent Successfully
                                        </p>
                                    </div>
                                    <div className="p-8">
                                        <QRCodeDisplay
                                            value={`https://terminal-app.com/verify/${showQRModal}`}
                                            bookingNumber={showQRModal}
                                            terminalName="Terminal North (T-001)"
                                        />
                                        <p className="text-center text-xs text-gray-400 mt-6">
                                            This QR code has been emailed to the carrier.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
