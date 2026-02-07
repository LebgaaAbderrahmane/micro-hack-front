"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";
import { Header } from "./Header";
import { AIChat } from "../common/AIChat";
import { SettingsModal } from "../common/SettingsModal";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isAuthPage = pathname?.includes("/login");

  if (isAuthPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "var(--background)" }}
    >
      {/* Dynamic Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] opacity-20" />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] bg-accent/5 rounded-full blur-[80px] opacity-10" />
      </div>

      {/* Swatch background overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.2,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onOpenSettings={() => setShowSettings(true)} />
        <main className="flex-1">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-4">
            {children}
          </div>
        </main>
      </div>

      <AIChat />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};
