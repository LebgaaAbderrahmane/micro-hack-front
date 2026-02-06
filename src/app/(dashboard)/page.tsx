"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronRight,
  Truck as TruckIcon,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Bell,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminDashboard, TerminalOpDashboard, CarrierDashboard } from "@/components/dashboard/RoleDashboards";
import { TerminalVisualization } from "@/components/dashboard/TerminalVisualization";
import { useToast } from "@/components/common/Toast";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: string;
}

const StatCard = ({ title, value, change, icon: Icon, trend }: StatCardProps) => (
  <div className="glass-card p-6 border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <span className={cn(
        "text-xs font-bold px-2 py-1 rounded-lg",
        trend === "up" ? "text-primary bg-primary/10" :
          trend === "down" ? "text-error bg-error/10" :
            "text-foreground/40 bg-white/5"
      )}>
        {change}
      </span>
    </div>
    <div className="relative z-10">
      <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest leading-none mb-2">{title}</p>
      <h4 className="text-2xl font-black text-foreground tracking-tight">{value}</h4>
    </div>
  </div>
);

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const chartData = [
  { name: "00:00", value: 400 },
  { name: "04:00", value: 300 },
  { name: "08:00", value: 600 },
  { name: "12:00", value: 800 },
  { name: "16:00", value: 500 },
  { name: "20:00", value: 900 },
  { name: "23:59", value: 700 },
];

export default function Home() {
  const { profile, isLoading } = useAuth();
  const { show } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-truck">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Access Restricted</h1>
          <p className="text-foreground/50 max-w-sm">
            Please log in to access the Intelligent Logistics Access Control System.
          </p>
        </div>
        <button
          onClick={() => window.location.href = "/login"}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!profile) return null;
    switch (profile.role) {
      case "ADMIN": return <AdminDashboard />;
      case "OPERATOR": return <TerminalOpDashboard />;
      case "DISPATCHER": return <CarrierDashboard />;
      default: return null;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Role-Specific Dashboard Content */}
      <section className="animate-in fade-in duration-1000">
        {renderDashboard()}
      </section>

      {/* Main Command Center Section - Full Width */}
      <section className="space-y-6">
        {profile?.role !== 'DISPATCHER' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-4">
                  <Activity className="text-primary" size={28} />
                  Live Terminal Matrix
                </h3>
                <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mt-2 ml-10">Real-time geospatial node orchestration</p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    7 Active Nodes
                  </span>
                </div>
                <div className="px-4 py-2 bg-foreground/5 rounded-2xl border border-foreground/5 flex items-center gap-3">
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                    Sync: 0.2ms
                  </span>
                </div>
              </div>
            </div>
            <TerminalVisualization />
          </div>
        )}
      </section>

      {/* Statistics & Security Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Vessel Throughput", value: "842 TEU/h", trend: "+12.5%", color: "text-primary", data: [30, 45, 35, 60, 55, 75, 80] },
              { label: "Gate Efficiency", value: "98.2%", trend: "+2.1%", color: "text-success", data: [85, 88, 92, 90, 95, 97, 98] },
            ].map((stat, idx) => (
              <div key={idx} className="glass-card p-8 border border-foreground/10 relative overflow-hidden group bg-background/50 hover:bg-background/80 transition-all duration-500">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</h3>
                    <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg bg-foreground/5", stat.color)}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-32 w-full translate-y-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.data.map((v, i) => ({ value: v, id: i }))}>
                      <defs>
                        <linearGradient id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-primary)"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill={`url(#gradient-${idx})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-8 border border-foreground/10 relative overflow-hidden bg-background/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">Operational Dynamics</h3>
                <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest mt-1">Global Traffic Analysis • Real-time</p>
              </div>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--foreground)" opacity={0.05} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "currentColor", opacity: 0.3, fontSize: 10, fontWeight: 900 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--foreground-5)",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "900",
                      textTransform: "uppercase"
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button
            onClick={() => show("Launching system diagnostic...", "info")}
            className="w-full py-5 bg-primary text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 border border-primary/20"
          >
            Run System Diagnostics
          </button>
        </div>

        {/* Tactical Tactical Intelligence & Infrastructure Column */}
        <div className="space-y-8">
          <div className="glass-card border border-foreground/10 relative overflow-hidden bg-background/50 backdrop-blur-3xl flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="p-8 border-b border-foreground/10 bg-foreground/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" />
                  Tactical Intelligence
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                  <span className="text-[10px] font-black text-success uppercase tracking-widest">Secure</span>
                </div>
              </div>
              <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">Command Center Sync Status: 0.2ms</p>
            </div>

            {/* Live Alerts Stream */}
            <div className="p-8 space-y-6 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">Signal Stream</h4>
                <span className="text-[9px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full animate-pulse">4 Live</span>
              </div>

              <div className="space-y-4">
                {[
                  { type: "Critical", msg: "Gate 02: Structural Pressure Warning", time: "12:04", color: "bg-error", icon: <ShieldAlert size={14} /> },
                  { type: "Info", msg: "Alpha-1: Automated Berth Handshake", time: "11:58", color: "bg-primary", icon: <Zap size={14} /> },
                  { type: "Action", msg: "T-005: Thermal Sync Required", time: "11:45", color: "bg-amber-500", icon: <Bell size={14} /> },
                  { type: "System", msg: "Firmware Update 2.4.0 Propagated", time: "10:30", color: "bg-success", icon: <CheckCircle2 size={14} /> },
                ].map((alert, i) => (
                  <div key={i} className="group p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 hover:bg-foreground/[0.05] transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={cn("mt-1 w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg", alert.color)}>
                        {alert.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={cn("text-[8px] font-black uppercase tracking-widest", alert.color.replace('bg-', 'text-'))}>{alert.type}</span>
                          <span className="text-[9px] font-black text-foreground/20">{alert.time}</span>
                        </div>
                        <p className="text-[11px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{alert.msg}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Health Footer */}
            <div className="p-8 border-t border-foreground/5 bg-primary/5 space-y-6">
              <h4 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Cpu size={16} className="text-primary" />
                System Core Health
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "A.I. Synapse", health: 94 },
                  { label: "Quantum Enc.", health: 100 },
                  { label: "Thermal Reg.", health: 76 },
                ].map((sys, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                      <span className="text-foreground/40">{sys.label}</span>
                      <span className="text-primary">{sys.health}%</span>
                    </div>
                    <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${sys.health}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-foreground/5 hover:bg-foreground/10 text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all border border-foreground/5 text-foreground/60">
                Protocol Archives
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
