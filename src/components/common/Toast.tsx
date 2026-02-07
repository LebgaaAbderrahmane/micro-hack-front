"use client";

import React from "react";
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastStore {
    toasts: Toast[];
    show: (message: string, type?: ToastType) => void;
    remove: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
    toasts: [],
    show: (message, type = "success") => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3000);
    },
    remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const ToastContainer = () => {
    const { toasts, remove } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none" suppressHydrationWarning>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 border backdrop-blur-xl min-w-[300px]",
                        toast.type === "success" && "bg-primary/20 border-primary/30 text-white",
                        toast.type === "error" && "bg-error/20 border-error/30 text-white",
                        toast.type === "warning" && "bg-warning/20 border-warning/30 text-white",
                        toast.type === "info" && "bg-info/20 border-info/30 text-white"
                    )}
                >
                    <div className="shrink-0">
                        {toast.type === "success" && <CheckCircle2 size={24} className="text-primary" />}
                        {toast.type === "error" && <AlertCircle size={24} className="text-error" />}
                        {toast.type === "warning" && <AlertTriangle size={24} className="text-warning" />}
                        {toast.type === "info" && <Info size={24} className="text-info" />}
                    </div>
                    <p className="font-bold text-sm flex-1">{toast.message}</p>
                    <button
                        onClick={() => remove(toast.id)}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};
