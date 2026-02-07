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
    if (!isLoading && profile?.role === "OPERATOR" && pathname === "/") {
      router.replace("/bookings");
    }
  }, [isLoading, profile?.role, pathname, router]);

  if (!mounted) return null;

  const isAuthPage = pathname?.includes("/login");

  if (isAuthPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  // Role-based header rendering
  const isOperator = profile?.role === "OPERATOR";

  // Show loading while waiting for auth to determine header type
  if (isLoading) {
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
    >
      {/* Dynamic Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] opacity-20" />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] bg-accent/5 rounded-full blur-[80px] opacity-10" />
      </div>

      {/* DEBUG BANNER: Remove after fixing */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] p-1 z-50 flex gap-4 justify-center font-mono items-center">
        <span>UID: {profile?.id?.slice(0, 8) || "null"}</span>
        <span>ROLE: {profile?.role || "null"}</span>
        <span>LOADING: {isLoading ? "true" : "false"}</span>
        <span>HEADER: {isOperator ? "OP" : "DEF"}</span>
        {!profile && !isLoading && (
          <button
            onClick={async () => {
              // Quick fix for missing profile
              const { createClient } = await import("@/utils/supabase/client");
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return alert("No auth user found");

              const { error } = await supabase.from("users").insert({
                id: user.id,
                role: "OPERATOR",
                email: user.email,
                username: user.email?.split("@")[0] || "Operator",
                created_at: new Date().toISOString()
              });

              if (error) alert("Fix failed: " + error.message);
              else {
                alert("Profile created! Reloading...");
                window.location.reload();
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded ml-4 font-bold"
          >
            FIX MISSING PROFILE
          </button>
        )}
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
        {isOperator ? (
          <OperatorHeader />
        ) : (
          <Header onOpenSettings={() => setShowSettings(true)} />
        )}
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

