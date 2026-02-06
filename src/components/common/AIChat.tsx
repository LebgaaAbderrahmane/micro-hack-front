"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MessageSquare, X, Maximize2, Minimize2, Send, Bot, User, Sparkles, Cpu, Zap, ChevronRight, LayoutDashboard, FileText, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatState = "closed" | "small" | "large";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
  hasProposal?: boolean;
}

const RECOMMENDED_PROMPTS = [
  { icon: <Activity size={14} />, text: "Analyze Terminal Yard" },
  { icon: <LayoutDashboard size={14} />, text: "Optimize Fleet Path" },
  { icon: <FileText size={14} />, text: "Generate KPI Report" },
];

export const AIChat = () => {
  const [chatState, setChatState] = useState<ChatState>("closed");
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for display
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", text: "Hello! I'm your **PortFlow AI** assistant. How can I help you optimize your terminal operations today?" }
  ]);

  const toggleOpen = () => {
    if (chatState === "closed") setChatState("small");
    else setChatState("closed");
  };

  const toggleSize = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setChatState(chatState === "small" ? "large" : "small");
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const newUserMsg: Message = { id: Date.now(), role: "user", text: messageText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    
    // Simulate generic response
    setTimeout(() => {
        const isProposal = messageText.toLowerCase().includes("report") || messageText.toLowerCase().includes("analyze");
        const response: Message = { 
            id: Date.now() + 1, 
            role: "assistant", 
            text: isProposal 
                ? "I've analyzed the current terminal metrics and generated a detailed **operational proposal** for you to review." 
                : "I'm processing your request. Based on the real-time data from the terminal yard, everything seems to be within optimal parameters.",
            hasProposal: isProposal
        };
        
        setMessages(prev => [...prev, response]);
        
        if (isProposal) {
            setChatState("large");
        }
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
      borderRadius: "16px", // More square-ish
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
      width: "400px",
      height: "620px",
      borderRadius: "24px",
      bottom: "32px",
      right: "32px",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        mass: 1
      }
    },
    large: {
      width: "calc(100vw - 64px)",
      height: "calc(100vh - 64px)",
      borderRadius: "24px",
      bottom: "32px",
      right: "32px",
      transition: { 
        type: "spring", 
        stiffness: 250, 
        damping: 28 
      }
    }
  };

  const formatText = (text: string) => {
    return text.split("**").map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="text-primary font-bold">{part}</strong> : part
    );
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
                "bg-background/30 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl",
                "before:absolute before:inset-0 before:bg-gradient-to-tr before:from-primary/5 before:to-transparent before:pointer-events-none",
                 chatState === "closed" ? "cursor-pointer hover:scale-105 active:scale-95 transition-all duration-500 hover:shadow-primary/20" : ""
            )}
            onClick={chatState === "closed" ? toggleOpen : undefined}
        >
            <AnimatePresence mode="wait">
                {chatState === "closed" ? (
                    <motion.div
                        key="icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.2 }}
                        className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground relative group"
                    >
                        <Cpu size={30} fill="currentColor" className="group-hover:animate-pulse" />
                        <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col h-full w-full relative z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-blue-500/20 flex items-center justify-center border border-white/20 shadow-inner">
                                        <Cpu size={26} className="text-primary" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-4 border-background" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base tracking-tight text-foreground/90 leading-tight">PortFlow Intelligence</h3>
                                    <p className="text-[10px] text-primary/80 font-bold uppercase tracking-[0.2em]">Neural Engine Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleSize}
                                    className="h-10 w-10 rounded-xl hover:bg-white/10 text-muted-foreground/50 hover:text-foreground transition-all"
                                >
                                    {chatState === "large" ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleOpen}
                                    className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground/50 transition-all font-bold"
                                >
                                    <X size={18} strokeWidth={3} />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 px-6 py-4">
                            <div className="space-y-6 pb-4 pt-2">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        key={msg.id}
                                        className={cn(
                                            "flex gap-4",
                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex flex-col gap-1.5 max-w-[85%]",
                                            msg.role === "user" ? "items-end" : "items-start"
                                        )}>
                                            <div className={cn(
                                                "p-4 rounded-[22px] text-sm leading-relaxed shadow-sm transition-all",
                                                msg.role === "assistant"
                                                    ? "bg-white/40 dark:bg-white/5 text-foreground rounded-tl-none border border-white/10"
                                                    : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/20"
                                            )}>
                                                {formatText(msg.text)}
                                            </div>
                                            {msg.hasProposal && (
                                                <div className="mt-2 w-full p-4 border border-primary/20 bg-primary/5 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                       <div className="p-2 bg-primary/10 rounded-xl text-primary"><Activity size={18} /></div>
                                                       <div>
                                                           <p className="text-xs font-bold">Optimization Success</p>
                                                           <p className="text-[10px] text-muted-foreground">Click to apply suggested routes</p>
                                                       </div>
                                                    </div>
                                                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold uppercase transition-all hover:bg-primary hover:text-white">Review</Button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-6 bg-white/5 border-t border-white/10 backdrop-blur-2xl">
                            {/* Recommended Prompts Stack */}
                            {messages.length <= 1 && (
                                <div className="flex flex-col gap-2 mb-4">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-1">Suggested strategies</p>
                                    {RECOMMENDED_PROMPTS.map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(prompt.text)}
                                            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-primary opacity-70 group-hover:opacity-100">{prompt.icon}</div>
                                                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-primary">{prompt.text}</span>
                                            </div>
                                            <ChevronRight size={14} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex-1 relative group">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your strategic query..."
                                        className="h-14 bg-white/5 dark:bg-black/10 border-white/10 focus-visible:ring-primary/20 focus-visible:border-primary/40 rounded-2xl pr-14 pl-5 transition-all placeholder:text-muted-foreground/30 text-sm backdrop-blur-lg"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className="absolute right-2 top-2 h-10 w-10 rounded-xl transition-all shadow-xl active:scale-90 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-white/5 disabled:text-white/20"
                                    >
                                        <Send size={18} />
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
