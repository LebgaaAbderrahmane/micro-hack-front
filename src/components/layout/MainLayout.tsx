"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { Header } from "./Header";
import { OperatorHeader } from "./OperatorHeader";
import { AIChat } from "../common/AIChat";
import { SettingsModal } from "../common/SettingsModal";
import { useAuth } from "@/hooks/useAuth";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect operators to /bookings if they land on the dashboard homepage
  useEffect(() => {
    if (mounted && !isLoading && profile?.role === "OPERATOR" && pathname === "/") {
      router.replace("/bookings");
    }
  }, [mounted, isLoading, profile?.role, pathname, router]);

  const isAuthPage = pathname?.includes("/login");

  if (isAuthPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  // Role-based header rendering

  // Show loading while waiting for auth to determine header type on client
  if (mounted && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-foreground/40 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "var(--background)" }}
      suppressHydrationWarning
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
        {/* Conditional Header based on role */}
        {mounted ? (
            <Header onOpenSettings={() => setShowSettings(true)} />
          )
         : (
          <div className="h-[82px] w-full" /> // Placeholder for header during hydration
        )}
        <main className="flex-1">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-4">
            {children}
          </div>
        </main>
      </div>

      {mounted && (
        <>
          <AIChat />
          <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </>
      )}
    </div>
  );
};

