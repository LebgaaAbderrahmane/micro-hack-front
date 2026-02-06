"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MessageSquare, X, Maximize2, Minimize2, Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

type ChatState = "closed" | "small" | "large";

export const AIChat = () => {
  const [chatState, setChatState] = useState<ChatState>("closed");
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for display
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Hello! I'm your PortFlow AI assistant. How can I help you optimize your terminal operations today?" }
  ]);

  const toggleOpen = () => {
    if (chatState === "closed") setChatState("small");
    else setChatState("closed");
  };

  const toggleSize = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setChatState(chatState === "small" ? "large" : "small");
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = { id: Date.now(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    
    // Simulate generic response
    setTimeout(() => {
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            role: "assistant", 
            text: "I'm processing your request regarding port operations..." 
        }]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Framer Motion Variants
  const containerVariants: Variants = {
    closed: {
      width: "64px",
      height: "64px",
      borderRadius: "18px",
      bottom: "24px",
      right: "24px",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        mass: 0.8
      }
    },
    small: {
      width: "380px",
      height: "580px",
      borderRadius: "28px",
      bottom: "32px",
      right: "32px",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 1,
        staggerChildren: 0.1
      }
    },
    large: {
      width: "calc(100vw - 64px)",
      height: "calc(100vh - 64px)",
      borderRadius: "32px",
      bottom: "32px",
      right: "32px",
      transition: { 
        type: "spring", 
        stiffness: 250, 
        damping: 28 
      }
    }
  };

  return (
    <>
        {/* Overlay backdrop for large mode */}
        <AnimatePresence>
            {chatState === "large" && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    onClick={() => setChatState("small")}
                    className="fixed inset-0 bg-background/20 z-[90]"
                />
            )}
        </AnimatePresence>

        <motion.div
            layout
            variants={containerVariants}
            initial="closed"
            animate={chatState}
            className={cn(
                "fixed z-[100] overflow-hidden flex flex-col",
                "bg-background/40 backdrop-blur-2xl border border-white/20 dark:border-white/10",
                "shadow-[0_8px_32px_rgba(0,0,0,0.12)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none",
                 chatState === "closed" ? "cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-primary/5 hover:ring-primary/10" : ""
            )}
            onClick={chatState === "closed" ? toggleOpen : undefined}
        >
            <AnimatePresence mode="wait">
                {chatState === "closed" ? (
                    <motion.div
                        key="icon"
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
                        className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground relative"
                    >
                        <MessageSquare size={28} fill="currentColor" strokeWidth={1.5} />
                        <span className="absolute top-4 right-4 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-primary"></span>
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat-content"
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="flex flex-col h-full w-full relative z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-transparent shadow-lg transition-transform group-hover:scale-105">
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
                                            <Bot size={24} />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base tracking-tight text-foreground/90">PortFlow Intelligence</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-80">System Online</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleSize}
                                    className="h-10 w-10 rounded-2xl hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all active:scale-90"
                                >
                                    {chatState === "large" ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleOpen}
                                    className="h-10 w-10 rounded-2xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all active:scale-90"
                                >
                                    <X size={20} />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 px-6 py-6 scroll-smooth">
                            <div className="space-y-8">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, x: msg.role === "user" ? 10 : -10 }}
                                        animate={{ opacity: 1, y: 0, x: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        key={msg.id}
                                        className={cn(
                                            "flex gap-4",
                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex flex-col gap-2 max-w-[85%]",
                                            msg.role === "user" ? "items-end" : "items-start"
                                        )}>
                                            <div className={cn(
                                                "p-4 rounded-[22px] text-sm leading-relaxed shadow-md transition-all",
                                                msg.role === "assistant"
                                                    ? "bg-white/50 dark:bg-white/5 text-foreground rounded-tl-none border border-white/20 backdrop-blur-sm"
                                                    : "bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-tr-none shadow-[0_8px_16px_rgba(59,130,246,0.3)]"
                                            )}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest px-2">
                                                {msg.role === "assistant" ? "Assistant" : "User Account"}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-6 bg-white/5 border-t border-white/10 backdrop-blur-md">
                            <form 
                                onSubmit={handleSend}
                                className="flex items-center gap-4"
                            >
                                <div className="flex-1 relative group">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your query..."
                                        className="h-14 bg-white/5 dark:bg-black/40 border-white/10 focus-visible:ring-primary/40 focus-visible:border-primary/40 rounded-[20px] pr-14 pl-5 transition-all placeholder:text-muted-foreground/40 text-base"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className="absolute right-2 top-2 h-10 w-10 rounded-[14px] transition-all shadow-lg active:scale-95 bg-primary hover:bg-primary/90"
                                    >
                                        <Send size={18} className={cn(inputValue.trim() ? "translate-x-0.5 -translate-y-0.5" : "")} />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </>
  );
};
