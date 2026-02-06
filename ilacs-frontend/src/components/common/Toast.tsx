"use client";

import React from "react";
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "info";

interface Notification {
    id: string;
    message: string;
    type: ToastType;
    time: string;
    read: boolean;
    title: string;
}

interface NotificationStore {
    toasts: { id: string; message: string; type: ToastType }[];
    notifications: Notification[];
    show: (message: string, type?: ToastType, title?: string) => void;
    removeToast: (id: string) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    toasts: [],
    notifications: [
        { id: "1", type: "warning", title: "Capacity Alert", message: "Terminal North has reached 92% capacity.", time: "5m ago", read: false },
        { id: "2", type: "success", title: "Booking Confirmed", message: "Booking #BK-552 has been confirmed.", time: "1h ago", read: false },
    ],
    show: (message, type = "success", title = "") => {
        const id = Math.random().toString(36).substring(2, 9);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        set((state) => ({
            toasts: [...state.toasts, { id, message, type }],
            notifications: [{ id, message, type, time, read: false, title: title || type.charAt(0).toUpperCase() + type.slice(1) }, ...state.notifications]
        }));

        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 5000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),
    clearAll: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),
}));

export const useToast = () => {
    const show = useNotificationStore(state => state.show);
    return { show };
};

export const ToastContainer = () => {
    const { toasts, removeToast } = useNotificationStore();

    return (
        <div className="fixed bottom-10 right-10 z-[99999] flex flex-col gap-4 pointer-events-none">
            <style jsx global>{`
                @keyframes progress-shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-progress-shrink {
                    animation: progress-shrink 5s linear forwards;
                }
            `}</style>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "pointer-events-auto flex items-center gap-5 p-1 pr-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in slide-in-from-right-10 duration-500 border bg-background/98 backdrop-blur-3xl min-w-[380px] group overflow-hidden",
                        toast.type === "success" && "border-primary/20",
                        toast.type === "error" && "border-error/20",
                        toast.type === "warning" && "border-warning/20",
                        toast.type === "info" && "border-info/20"
                    )}
                >
                    <div className={cn(
                        "w-2 self-stretch rounded-l-xl shrink-0",
                        toast.type === "success" && "bg-primary",
                        toast.type === "error" && "bg-error",
                        toast.type === "warning" && "bg-warning",
                        toast.type === "info" && "bg-info"
                    )} />

                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 my-3",
                        toast.type === "success" && "bg-primary/10 text-primary",
                        toast.type === "error" && "bg-error/10 text-error",
                        toast.type === "warning" && "bg-warning/10 text-warning",
                        toast.type === "info" && "bg-info/10 text-info"
                    )}>
                        {toast.type === "success" && <CheckCircle2 size={24} />}
                        {toast.type === "error" && <AlertCircle size={24} />}
                        {toast.type === "warning" && <AlertTriangle size={24} />}
                        {toast.type === "info" && <Info size={24} />}
                    </div>

                    <div className="flex-1 py-4">
                        <p className="font-black text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                            {toast.type} System Alert
                        </p>
                        <p className="font-bold text-sm text-foreground leading-tight">{toast.message}</p>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/20 hover:text-foreground hover:bg-foreground/5 transition-all"
                    >
                        <X size={16} />
                    </button>

                    <div className="absolute bottom-0 left-2 right-0 h-[3px] bg-foreground/5 overflow-hidden">
                        <div className={cn(
                            "h-full animate-progress-shrink",
                            toast.type === "success" && "bg-primary",
                            toast.type === "error" && "bg-error",
                            toast.type === "warning" && "bg-warning",
                            toast.type === "info" && "bg-info"
                        )} />
                    </div>
                </div>
            ))}
        </div>
    );
};
