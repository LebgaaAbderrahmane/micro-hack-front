"use client";

import React, { useState } from "react";
import {
    Bell,
    Settings,
    CheckCheck,
    AlertTriangle,
    Info,
    CheckCircle2,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    type: "info" | "warning" | "success";
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    { id: "1", type: "warning", title: "Capacity Alert", message: "Terminal North has reached 92% capacity.", time: "5m ago", read: false },
    { id: "2", type: "success", title: "Booking Confirmed", message: "Booking #BK-552 has been confirmed by Terminal West.", time: "1h ago", read: false },
    { id: "3", type: "info", title: "New Feature", message: "Try the new AI Assistant for quick terminal queries!", time: "2h ago", read: true },
];

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "warning": return <AlertTriangle size={16} className="text-warning" />;
            case "success": return <CheckCircle2 size={16} className="text-success" />;
            default: return <Info size={16} className="text-primary" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2 rounded-xl transition-all",
                    isOpen ? "bg-primary/10 text-primary" : "text-primary-foreground/70 hover:bg-foreground/5"
                )}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 sm:w-96 glass-card-geo border border-foreground/10 shadow-2xl overflow-hidden z-[60]"
                        >
                            <div className="p-4 border-b border-foreground/5 flex items-center justify-between">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-foreground/40">Notifications</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={markAllRead}
                                        className="p-1.5 hover:bg-foreground/5 rounded-lg text-primary transition-colors flex items-center gap-1.5"
                                        title="Mark all as read"
                                    >
                                        <CheckCheck size={14} />
                                        <span className="text-[10px] font-bold uppercase">All Read</span>
                                    </button>
                                    <button className="p-1.5 hover:bg-foreground/5 rounded-lg text-foreground/40 transition-colors">
                                        <Settings size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={cn(
                                                "px-4 py-4 hover:bg-foreground/[0.02] transition-colors border-l-2 mb-1 cursor-pointer",
                                                n.read ? "border-transparent opacity-60" : "border-primary bg-primary/[0.03]"
                                            )}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0 border border-foreground/5">
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-bold text-sm text-foreground">{n.title}</p>
                                                        <span className="text-[10px] text-foreground/30 font-medium flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {n.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-[13px] text-foreground/60 leading-relaxed font-medium">
                                                        {n.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 flex flex-col items-center justify-center text-foreground/20 italic">
                                        <CheckCircle2 size={32} className="mb-2 opacity-10" />
                                        <span>No new notifications</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 border-t border-foreground/5 text-center bg-foreground/[0.01]">
                                <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">
                                    View All Notifications
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
