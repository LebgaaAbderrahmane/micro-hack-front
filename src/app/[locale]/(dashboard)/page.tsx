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
  const { profile, isLoading } = useAuth();

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

  if (profile?.role === "ADMIN") return <AdminDashboard />;
  if (profile?.role === "OPERATOR") return <TerminalOpDashboard />;
  if (profile?.role === "DISPATCHER") return <CarrierDashboard />;

  // Fallback: show admin dashboard for unrecognized roles
  return <AdminDashboard />;
}
