"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  Send,
  Cpu,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Loader2,
  Plus,
  History,
  Clock,
  Trash2,
  MessageSquare,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat, ChatMessage } from "@/hooks/domain/useChat";
import { useAuth } from "@/hooks/useAuth";
import { UIComponentRenderer } from "@/components/common/ai-widgets";

type ChatState = "closed" | "small" | "large";

interface ChatHistoryItem {
  id: string;
  timestamp: string;
  preview: string;
  messages: ChatMessage[];
}

const RECOMMENDED_PROMPTS = [
  { icon: <LayoutDashboard size={14} />, text: "Show my recent bookings" },
  {
    icon: <FileText size={14} />,
    text: "Check available slots for today",
  },
  { icon: <Cpu size={14} />, text: "Show terminal capacity" },
];

export const AIChat = () => {
  const [chatState, setChatState] = useState<ChatState>("closed");
  const [inputValue, setInputValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history after mount to avoid hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem("portflow_chat_history");
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const {
    messages,
    sendMessage,
    isLoading,
    resetChat,
    loadSession,
    getSessionId,
    stopGeneration,
  } = useChat({
    language: "en",
    onAutoExpand: () => setChatState("large"),
  });

  // Save history on changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(
        "portflow_chat_history",
        JSON.stringify(chatHistory),
      );
    }
  }, [chatHistory]);

  const saveCurrentSession = () => {
    const currentId = getSessionId();
    if (!currentId || messages.length <= 1) return;

    const firstUserMsg = messages.find((m) => m.role === "user");
    const preview = firstUserMsg
      ? firstUserMsg.text.slice(0, 50)
      : "New Conversation";

    // Sanitize messages: remove loading state
    const cleanMessages = messages.map((m) => ({ ...m, isLoading: false }));

    const newItem: ChatHistoryItem = {
      id: currentId,
      timestamp: new Date().toISOString(),
      preview: preview + (preview.length >= 50 ? "..." : ""),
      messages: cleanMessages,
    };

    setChatHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== currentId);
      const newHistory = [newItem, ...filtered].slice(0, 20);
      localStorage.setItem("portflow_chat_history", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleNewChat = () => {
    saveCurrentSession();
    resetChat();
    setShowSuggestions(true);
    setShowHistory(false);
  };

  const handleLoadHistory = (item: ChatHistoryItem) => {
    saveCurrentSession();
    loadSession(item.id, item.messages);
    setShowHistory(false);
    setShowSuggestions(false);
  };

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem("portflow_chat_history");
  };

  const toggleOpen = () => {
    console.log("AIChat: toggleOpen called", { currentStatus: chatState });
    if (chatState === "closed") setChatState("small");
    else setChatState("closed");
  };

  const toggleSize = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setChatState(chatState === "small" ? "large" : "small");
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    console.log("AIChat: handleSend called", { messageText, isLoading });

    if (!messageText.trim() || isLoading) return;

    console.log("AIChat: triggering sendMessage", messageText);
    sendMessage(messageText);
    setInputValue("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Framer Motion Variants
  const containerVariants: Variants = {
    closed: {
      width: "64px",
      height: "64px",
      borderRadius: "16px",
      bottom: "24px",
      right: "24px",
      transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
    },
    small: {
      width: "400px",
      height: "620px",
      borderRadius: "24px",
      bottom: "32px",
      right: "32px",
      transition: { type: "spring", stiffness: 300, damping: 25, mass: 1 },
    },
    large: {
      width: "calc(100vw - 64px)",
      height: "calc(100vh - 64px)",
      borderRadius: "24px",
      bottom: "32px",
      right: "32px",
      transition: { type: "spring", stiffness: 250, damping: 28 },
    },
  };

  const formatText = (text: string) => {
    return text.split("**").map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="text-primary font-bold">
          {part}
        </strong>
      ) : (
        part
      ),
    );
  };

  const renderAgentBadge = (msg: ChatMessage) => {
    if (!msg.agentType || msg.agentType === "ORCHESTRATOR") return null;
    const badgeMap: Record<string, { label: string; color: string }> = {
      BOOKING: {
        label: "Booking Agent",
        color: "bg-blue-500/10 text-blue-500",
      },
      SLOT: { label: "Slot Agent", color: "bg-green-500/10 text-green-500" },
      HISTORY: {
        label: "History Agent",
        color: "bg-amber-500/10 text-amber-500",
      },
    };
    const badge = badgeMap[msg.agentType];
    if (!badge) return null;
    return (
      <span
        className={cn(
          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
          badge.color,
        )}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <>
      {" "}
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

        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center bg-background/60 backdrop-blur-md p-6"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-card/80 backdrop-blur-2xl border border-border dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[70vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-foreground">
                      Chat History
                    </h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      Your previous sessions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chatHistory.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearHistory}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                      title="Clear All"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHistory(false)}
                    className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-4">
                    <MessageSquare size={64} strokeWidth={1} />
                    <p className="text-sm font-medium">
                      No conversation history
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {chatHistory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleLoadHistory(item)}
                        className="flex flex-col items-start gap-2 p-4 rounded-2xl hover:bg-accent/50 transition-all text-left group border border-transparent hover:border-border w-full"
                      >
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.preview}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                          <Clock size={10} />
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        variants={containerVariants}
        initial="closed"
        animate={chatState}
        className={cn(
          "fixed z-[200] overflow-hidden flex flex-col",
          "bg-background/30 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl",
          "before:absolute before:inset-0 before:bg-gradient-to-tr before:from-primary/5 before:to-transparent before:pointer-events-none",
          chatState === "closed"
            ? "cursor-pointer hover:scale-105 active:scale-95 transition-all duration-500 hover:shadow-primary/20"
            : "",
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
              <Cpu
                size={30}
                fill="currentColor"
                className="group-hover:animate-pulse"
              />
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
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-4 border-background",
                        isLoading
                          ? "bg-amber-400 animate-pulse"
                          : "bg-green-500",
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight text-foreground/90 leading-tight">
                      PortFlow Intelligence
                    </h3>
                    <p className="text-[10px] text-primary/80 font-bold uppercase tracking-[0.2em]">
                      {isLoading ? "Processing…" : "Neural Engine Active"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewChat}
                    className="h-10 w-10 rounded-xl hover:bg-white/10 text-muted-foreground/50 hover:text-foreground transition-all"
                    title="New Chat"
                  >
                    <Plus size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHistory(true)}
                    className="h-10 w-10 rounded-xl hover:bg-white/10 text-muted-foreground/50 hover:text-foreground transition-all"
                    title="History"
                  >
                    <History size={18} />
                  </Button>
                  <div className="w-px h-5 bg-white/10" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSize}
                    className="h-10 w-10 rounded-xl hover:bg-white/10 text-muted-foreground/50 hover:text-foreground transition-all"
                  >
                    {chatState === "large" ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleOpen}
                    className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground/50 transition-all"
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
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      key={msg.id}
                      className={cn(
                        "flex gap-4",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-col gap-1.5 max-w-[85%]",
                          msg.role === "user" ? "items-end" : "items-start",
                        )}
                      >
                        {/* Loading indicator */}
                        {msg.isLoading ? (
                          <div className="p-4 rounded-[22px] bg-white/40 dark:bg-white/5 rounded-tl-none border border-white/10 flex items-center gap-3">
                            <Loader2
                              size={16}
                              className="animate-spin text-primary"
                            />
                            <span className="text-sm text-muted-foreground">
                              Thinking…
                            </span>
                          </div>
                        ) : (
                          <>
                            {/* Agent badge */}
                            {msg.role === "assistant" && renderAgentBadge(msg)}

                            {/* Message bubble */}
                            <div
                              className={cn(
                                "p-4 rounded-[22px] text-sm leading-relaxed shadow-sm transition-all",
                                msg.role === "assistant"
                                  ? "bg-white/40 dark:bg-white/5 text-foreground rounded-tl-none border border-white/10"
                                  : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/20",
                              )}
                            >
                              {formatText(msg.text)}
                            </div>

                            {/* Rich UI Components from backend */}
                            {msg.uiComponents &&
                              msg.uiComponents.length > 0 && (
                                <UIComponentRenderer
                                  components={msg.uiComponents}
                                  onApprovalRespond={(
                                    action,
                                    entityId,
                                    actionType,
                                  ) => {
                                    sendMessage(
                                      action === "approve"
                                        ? `Approved ${actionType} for ${entityId}`
                                        : `Rejected ${actionType} for ${entityId}`,
                                    );
                                  }}
                                />
                              )}

                            {/* Legacy: fallback table for old-format data without ui_components */}
                            {msg.data &&
                              msg.data.length > 0 &&
                              (!msg.uiComponents ||
                                msg.uiComponents.length === 0) && (
                                <UIComponentRenderer
                                  components={[
                                    {
                                      type: "table" as const,
                                      columns: Object.keys(msg.data[0])
                                        .slice(0, 6)
                                        .map((k) => ({
                                          key: k,
                                          header: k.replace(/_/g, " "),
                                          type: "text" as const,
                                        })),
                                      data: msg.data,
                                    },
                                  ]}
                                />
                              )}

                            {/* Confidence indicator for assistant messages */}
                            {msg.role === "assistant" &&
                              msg.confidence != null && (
                                <span className="text-[9px] text-muted-foreground/40 px-1">
                                  Confidence: {Math.round(msg.confidence * 100)}
                                  %
                                </span>
                              )}
                          </>
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
                {showSuggestions && messages.length <= 1 && (
                  <div className="flex flex-col gap-2 mb-4 relative">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Suggested queries
                      </p>
                      <button
                        onClick={() => setShowSuggestions(false)}
                        className="text-muted-foreground/40 hover:text-foreground transition-colors p-1 hover:bg-white/5 rounded-full"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    {RECOMMENDED_PROMPTS.map((prompt, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay:
                            0.4 + (RECOMMENDED_PROMPTS.length - 1 - i) * 0.1,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        onClick={() => handleSend(prompt.text)}
                        disabled={isLoading}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 group transition-all disabled:opacity-50 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-primary opacity-70 group-hover:opacity-100">
                            {prompt.icon}
                          </div>
                          <span className="text-[11px] font-medium text-muted-foreground group-hover:text-primary">
                            {prompt.text}
                          </span>
                        </div>
                        <ChevronRight
                          size={14}
                          className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-1 relative group">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your strategic query..."
                      disabled={isLoading}
                      className="h-14 bg-white/5 dark:bg-black/10 border-white/10 focus-visible:ring-primary/20 focus-visible:border-primary/40 rounded-2xl pr-14 pl-5 transition-all placeholder:text-muted-foreground/30 text-sm backdrop-blur-lg disabled:opacity-50"
                    />
                    <Button
                      type={isLoading ? "button" : "submit"}
                      onClick={isLoading ? stopGeneration : undefined}
                      disabled={!isLoading && !inputValue.trim()}
                      className="absolute right-2 top-2 h-10 w-10 rounded-xl transition-all shadow-xl active:scale-90 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-white/5 disabled:text-white/20"
                    >
                      {isLoading ? (
                        <Square size={18} fill="currentColor" />
                      ) : (
                        <Send size={18} />
                      )}
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
