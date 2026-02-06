"use client";

import React, { useState } from "react";
import {
    Bell,
    CheckCheck,
    AlertTriangle,
    Info,
    CheckCircle2,
    AlertCircle,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/components/common/Toast";

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, markAsRead, clearAll } = useNotificationStore();

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case "warning": return <AlertTriangle size={16} className="text-warning" />;
            case "success": return <CheckCircle2 size={16} className="text-success" />;
            case "error": return <AlertCircle size={16} className="text-error" />;
            default: return <Info size={16} className="text-primary" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center transition-all",
                    isOpen ? "bg-primary/10 text-primary border-primary/30" : "text-foreground/40 hover:bg-foreground/5"
                )}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in shadow-lg">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[50]" onClick={() => setIsOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 sm:w-[420px] bg-background/95 backdrop-blur-3xl border border-foreground/10 shadow-2xl rounded-[1.5rem] overflow-hidden z-[60] origin-top-right"
                        >
                            <div className="p-6 border-b border-foreground/5 flex items-center justify-between bg-foreground/[0.02]">
                                <div>
                                    <h3 className="font-black text-xs uppercase tracking-[0.3em] text-foreground">Tactical Intel</h3>
                                    <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest mt-1">Real-time status stream</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={clearAll}
                                        className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-all flex items-center gap-2 border border-transparent hover:border-primary/20"
                                    >
                                        <CheckCheck size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Clear All</span>
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[450px] overflow-y-auto no-scrollbar py-2">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => markAsRead(n.id)}
                                            className={cn(
                                                "px-6 py-5 hover:bg-foreground/[0.03] transition-all border-l-4 mb-1 cursor-pointer relative group",
                                                n.read ? "border-transparent opacity-40 grayscale" : "border-primary bg-primary/[0.02]"
                                            )}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0 border border-foreground/5 group-hover:scale-110 transition-transform">
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-black text-xs uppercase tracking-tight text-foreground">{n.title}</p>
                                                        <span className="text-[9px] text-foreground/20 font-black flex items-center gap-1 uppercase tracking-widest">
                                                            <Clock size={10} />
                                                            {n.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-[12px] text-foreground/50 leading-relaxed font-bold">
                                                        {n.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center text-foreground/10 px-10 text-center">
                                        <CheckCircle2 size={48} className="mb-4 opacity-10" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Signal stream clear</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest mt-2 whitespace-nowrap">All tactical protocols operating normally</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-foreground/5 text-center bg-foreground/[0.02]">
                                <button className="w-full py-3 text-[9px] font-black text-foreground/30 uppercase tracking-[0.3em] hover:text-primary transition-all rounded-xl border border-transparent hover:border-primary/10">
                                    Archive Log Download
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
