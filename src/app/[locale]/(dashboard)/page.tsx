"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  AdminDashboard,
  CarrierDashboard,
} from "@/components/dashboard/RoleDashboards";
import { TerminalOpDashboard } from "@/components/dashboard/TerminalOpDashboard";

// ---------------------------------------------------------------------------
// Page — delegates entirely to role-specific dashboards
// ---------------------------------------------------------------------------
export default function Home() {
  const { profile, isLoading, session, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-foreground/40 animate-pulse">
            Initializing Dashboard...
          </p>
        </div>
      </div>
    );
  }
  const role = profile?.role?.toUpperCase();

  if (role === "ADMIN") return <AdminDashboard />;
  if (role === "OPERATOR") return <TerminalOpDashboard />;
  if (role === "DISPATCHER") return <CarrierDashboard />;

  // Defensively handle unknown roles
  if (profile) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 glass-card p-12 rounded-[2rem] border border-foreground/5">
          <p className="text-foreground/60">Node identity established, but role <span className="font-bold text-foreground">{profile.role || "MISSING"}</span> is unrecognized.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-widest"
            >
              Retry
            </button>
            <button
              onClick={() => signOut()}
              className="px-6 py-2 bg-foreground/5 text-foreground/60 rounded-xl text-sm font-bold uppercase tracking-widest"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
