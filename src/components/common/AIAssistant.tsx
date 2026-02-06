"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    Minimize2,
    Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Message {
    id: string;
    role: "assistant" | "user";
    content: string;
    timestamp: Date;
}

export const AIAssistant = () => {
    const t = useTranslations("AI");
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: t("welcome"),
            timestamp: new Date(),
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevId = useRef(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages, isOpen, isMinimized]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}-${prevId.current++}`,
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: `msg-${Date.now()}-${prevId.current++}`,
                role: "assistant",
                content: getAIResponse(inputValue),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        }, 1000);
    };

    const getAIResponse = (query: string): string => {
        const q = query.toLowerCase();
        if (q.includes("booking") || q.includes("slot")) return "You can manage your bookings in the 'Bookings' section. Currently, Terminal North has high availability for tomorrow morning.";
        if (q.includes("fleet") || q.includes("truck")) return "Your fleet currently has 3 trucks active. TX-773-MN is scheduled for maintenance on Feb 20th.";
        if (q.includes("terminal")) return "Terminal North is at 92% capacity. I recommend re-routing non-urgent deliveries to Terminal West.";
        return "I'm analyzing your request. Would you like me to show you the current congestion heat map?";
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            height: isMinimized ? "64px" : "500px",
                            width: isMinimized ? "200px" : "380px"
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card shadow-2xl border border-foreground/10 flex flex-col overflow-hidden bg-background/95 backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-foreground/5 bg-primary/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm tracking-tight text-foreground">{t("title")}</h4>
                                    {!isMinimized && <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{t("online")}</span>
                                    </div>}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1.5 hover:bg-foreground/5 rounded-md transition-colors text-foreground/40 hover:text-foreground"
                                >
                                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-foreground/5 rounded-md transition-colors text-foreground/40 hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Chat Body */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-foreground/10 scrollbar-track-transparent">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={cn(
                                                "flex items-start gap-3",
                                                m.role === "user" ? "flex-row-reverse" : "flex-row"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-foreground/5",
                                                m.role === "assistant" ? "bg-primary/10 text-primary" : "bg-foreground/10 text-primary-foreground/60"
                                            )}>
                                                {m.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                                            </div>
                                            <div className={cn(
                                                "p-3 rounded-2xl text-sm max-w-[80%] shadow-sm",
                                                m.role === "assistant"
                                                    ? "bg-foreground/5 text-foreground leading-relaxed border border-foreground/5"
                                                    : "bg-primary text-primary-foreground font-medium"
                                            )}>
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick Prompts */}
                                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-foreground/5">
                                    <button
                                        onClick={() => setInputValue(t("queryCapacity"))}
                                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-[10px] font-bold text-foreground/60 border border-foreground/5 transition-colors"
                                    >
                                        {t("promptCapacity")}
                                    </button>
                                    <button
                                        onClick={() => setInputValue(t("queryMaintenance"))}
                                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-[10px] font-bold text-foreground/60 border border-foreground/5 transition-colors"
                                    >
                                        {t("promptMaintenance")}
                                    </button>
                                    <button
                                        onClick={() => setInputValue(t("queryNextSlot"))}
                                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-[10px] font-bold text-foreground/60 border border-foreground/5 transition-colors"
                                    >
                                        {t("promptNextSlot")}
                                    </button>
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-foreground/5">
                                    <div className="relative group">
                                        <input
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                            placeholder={t("placeholder")}
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/20"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!inputValue.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale hover:scale-105 active:scale-95"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 relative group",
                    isOpen ? "bg-error text-white rotate-90" : "bg-primary text-white shadow-primary/20"
                )}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div key="bot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                            <MessageSquare size={28} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background animate-pulse"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
            </motion.button>
        </div>
    );
};
