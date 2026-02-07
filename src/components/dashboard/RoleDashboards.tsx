"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  Ship, Truck as TruckIcon, ShieldCheck, Activity, BarChart3,
  Package, Clock, Users, Fence, Box, Anchor, AlertTriangle,
  CheckCircle2, XCircle, Eye, Settings, FileText, Zap, Calendar,
  ChevronsUp, ArrowUpRight, Fuel, Shield, QrCode, MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
  RadialBarChart, RadialBar, CartesianGrid, Legend
} from "recharts";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/domain/useBookings";
import { useTerminals } from "@/hooks/domain/useTerminals";
import { useFleet } from "@/hooks/domain/useFleet";
import { useActiveSlots } from "@/hooks/domain/useSlots";
import { useGates, useGateLanes, useGateLogs } from "@/hooks/domain/useInfrastructure";
import { useNotifications } from "@/hooks/domain/useSystem";
import {
  useAdminRealtimeSubscriptions,
  useOperatorRealtimeSubscriptions,
  useDispatcherRealtimeSubscriptions,
} from "@/hooks/useRealtimeSubscription";

import {
  StatCard,
  WarningList,
  RecommendationCard,
  NotificationFeed,
  QuickActionsGrid,
  ChartCard,
  // InteractivePortPlan, // Replaced
} from "./widgets";

import TerminalYard from "./TerminalYard";
import PortMap from "./PortMap";

// ─── Chart colors ──────────────────────────────────────────────────────────
const CHART_COLORS = ["#3b82f6", "#0ea5e9", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];
const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  CHECKED_IN: "#0ea5e9",
  AT_GATE: "#8b5cf6",
  IN_PROGRESS: "#06b6d4",
  COMPLETED: "#10b981",
  CANCELLED: "#ef4444",
  NO_SHOW: "#6b7280",
};

// ─── Shared Section Header ────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, color = "primary" }: {
  icon: React.FC<{ size?: number }>;
  title: string;
  subtitle: string;
  color?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-3"
  >
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `bg-${color}/10 text-${color}`)}>
      <Icon size={22} />
    </div>
    <div>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-foreground/50 text-xs">{subtitle}</p>
    </div>
    <div className="ml-auto flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      <span className="text-[9px] font-bold text-success uppercase tracking-widest">Live</span>
    </div>
  </motion.div>
);

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-3 py-2 rounded-xl text-xs shadow-xl">
      <p className="font-bold text-foreground/70 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-foreground/50">
          <span className="inline-block w-2 h-2 rounded-sm mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-bold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADMIN DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const AdminDashboard = () => {
  useAdminRealtimeSubscriptions();
  const router = useRouter();
  const { profile } = useAuth();

  const { data: bookings } = useBookings();
  const { data: terminals } = useTerminals();
  const { data: fleet } = useFleet();
  const { data: slots } = useActiveSlots();
  const { data: gates } = useGates();
  const { data: gateLanes } = useGateLanes();
  const { data: gateLogs } = useGateLogs();

  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([]);

  // KPI calculations
  const kpis = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayBookings = bookings?.filter((b) => b.scheduled_date === today) ?? [];
    const activeTerminals = terminals?.filter((t) => (t.current_occupancy ?? 0) > 0)?.length ?? 0;
    const totalTrucks = fleet?.trucks?.length ?? 0;
    const inUseTrucks = fleet?.trucks?.filter((t) => t.status === "IN_USE")?.length ?? 0;
    const completedToday = todayBookings.filter((b) => b.status === "COMPLETED").length;
    const totalCapacity = terminals?.reduce((s, t) => s + t.total_capacity, 0) ?? 1;
    const totalOccupancy = terminals?.reduce((s, t) => s + (t.current_occupancy ?? 0), 0) ?? 0;
    const utilizationPct = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

    return {
      todayBookings: todayBookings.length,
      activeTerminals,
      totalTerminals: terminals?.length ?? 0,
      totalTrucks,
      inUseTrucks,
      completedToday,
      utilizationPct,
      totalOccupancy,
      totalCapacity,
    };
  }, [bookings, terminals, fleet]);

  // Booking status distribution for pie chart
  const statusDistribution = useMemo(() => {
    if (!bookings?.length) return [];
    const counts: Record<string, number> = {};
    bookings.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  // Bookings per hour for bar chart
  const bookingsPerHour = useMemo(() => {
    const hours = Array.from({ length: 18 }, (_, i) => ({
      hour: `${(i + 6).toString().padStart(2, "0")}:00`,
      count: 0,
    }));
    const today = new Date().toISOString().split("T")[0];
    bookings
      ?.filter((b) => b.scheduled_date === today)
      .forEach((b) => {
        const h = parseInt(b.scheduled_start?.split(":")[0] ?? "0", 10);
        const idx = h - 6;
        if (idx >= 0 && idx < hours.length) hours[idx].count++;
      });
    return hours;
  }, [bookings]);

  // Terminal occupancy for bar chart
  const terminalOccupancy = useMemo(
    () =>
      (terminals ?? []).map((t) => ({
        name: t.zone_code,
        occupancy: t.current_occupancy ?? 0,
        capacity: t.total_capacity,
        pct: t.total_capacity > 0 ? Math.round(((t.current_occupancy ?? 0) / t.total_capacity) * 100) : 0,
      })),
    [terminals]
  );

  // Warnings
  const warnings = useMemo(() => {
    const w: Array<{ id: string; title: string; message: string; severity: "critical" | "warning" | "info" }> = [];
    terminals?.forEach((t) => {
      const pct = t.total_capacity > 0 ? ((t.current_occupancy ?? 0) / t.total_capacity) * 100 : 0;
      if (pct >= 90) w.push({ id: `term-${t.id}`, title: `${t.zone_code} Near Capacity`, message: `Terminal ${t.zone_name} is at ${Math.round(pct)}% — consider redirecting inbound trucks.`, severity: "critical" });
      else if (pct >= 70) w.push({ id: `term-${t.id}`, title: `${t.zone_code} High Load`, message: `Terminal ${t.zone_name} is at ${Math.round(pct)}% capacity.`, severity: "warning" });
    });
    gates?.forEach((g) => {
      if (g.gate_status === "MAINTENANCE") w.push({ id: `gate-${g.id}`, title: `Gate ${g.gate_number} Under Maintenance`, message: "This gate is currently offline for maintenance.", severity: "warning" });
      if (g.gate_status === "CLOSED") w.push({ id: `gate-closed-${g.id}`, title: `Gate ${g.gate_number} Closed`, message: "Gate is closed — traffic may be impacted.", severity: "info" });
    });
    const overdue = bookings?.filter((b) => b.status === "NO_SHOW")?.length ?? 0;
    if (overdue > 0) w.push({ id: "no-show", title: `${overdue} No-Show Booking(s)`, message: "Carriers failed to arrive for their scheduled slots.", severity: "warning" });
    return w.filter((warning) => !dismissedWarnings.includes(warning.id));
  }, [terminals, gates, bookings, dismissedWarnings]);

  return (
    <div className="space-y-4 pb-8">
      <SectionHeader icon={ShieldCheck} title="Port Administration" subtitle="System-wide monitoring & terminal management" color="primary" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Port Congestion" value={`${kpis.utilizationPct}%`} icon={<Activity size={18} />} color={kpis.utilizationPct > 85 ? "error" : kpis.utilizationPct > 60 ? "warning" : "success"} trend={{ value: kpis.utilizationPct > 70 ? 5 : -3 }} delay={0} />
        <StatCard label="Total Daily Flow" value={kpis.todayBookings} icon={<Package size={18} />} color="primary" trend={{ value: 12, label: "vs yesterday" }} delay={1} />
        <StatCard label="Active Terminals" value={`${kpis.activeTerminals}/${kpis.totalTerminals}`} icon={<Anchor size={18} />} color="secondary" delay={2} />
        <StatCard label="On-Site Trucks" value={`${kpis.inUseTrucks}/${kpis.totalTrucks}`} icon={<TruckIcon size={18} />} color="accent" trend={{ value: 8, label: "active now" }} delay={3} />
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <WarningList warnings={warnings} onDismiss={(id) => setDismissedWarnings((p) => [...p, id])} />
        </motion.div>
      )}

      {/* Interactive Port Plan + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Interactive Port Plan" subtitle="Live terminal & gate status" accentColor="bg-primary" className="lg:col-span-2 min-h-[340px]" delay={1}>
          <PortMap mode="ADMIN" />
        </ChartCard>

        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <NotificationFeed userId={profile?.id} maxItems={6} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Bookings Per Hour" subtitle="Today's distribution" accentColor="bg-secondary" delay={2}>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsPerHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} interval={2} />
                <YAxis tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Bookings" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Booking Status" subtitle="All-time distribution" accentColor="bg-accent" delay={3}>
          <div className="h-[180px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 10 }}
                  formatter={(value: string) => <span className="text-foreground/50 text-[10px]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Terminal Utilization Bar + Recommendations + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Terminal Utilization" subtitle="Current occupancy vs capacity" accentColor="bg-success" className="lg:col-span-1" delay={4}>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={terminalOccupancy} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="occupancy" name="Occupied" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="capacity" name="Capacity" fill="rgba(255,255,255,0.05)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-3">Recommendations</p>
          <div className="space-y-2">
            <RecommendationCard
              title="Redistribute Terminal Load"
              description={`Terminal utilization is at ${kpis.utilizationPct}%. Consider balancing across terminals for optimal throughput.`}
              type="ai"
              actionLabel="View Suggestions"
              delay={0}
            />
            <RecommendationCard
              title="Schedule Off-Peak Maintenance"
              description="Gate maintenance can be scheduled during low-traffic hours (21:00–05:00) to minimize disruption."
              type="optimization"
              actionLabel="Plan Schedule"
              delay={1}
            />
            <RecommendationCard
              title="Fleet Capacity Alert"
              description={`${kpis.inUseTrucks} of ${kpis.totalTrucks} trucks currently in port. Monitor for congestion patterns.`}
              type="system"
              delay={2}
            />
          </div>
        </div>

        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <QuickActionsGrid
            title="Admin Quick Actions"
            actions={[
              { label: "Manage Users", icon: <Users size={14} />, onClick: () => router.push("/users"), color: "primary", variant: "filled" },
              { label: "Analytics", icon: <BarChart3 size={14} />, onClick: () => router.push("/analytics"), color: "secondary" },
              { label: "All Logs", icon: <FileText size={14} />, onClick: () => router.push("/loggings"), color: "accent" },
              { label: "Terminal Settings", icon: <Settings size={14} />, onClick: () => router.push("/settings"), color: "success" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  OPERATOR DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const TerminalOpDashboard = () => {
  useOperatorRealtimeSubscriptions();
  const router = useRouter();
  const { profile } = useAuth();

  const { data: bookings } = useBookings();
  const { data: terminals } = useTerminals();
  const { data: slots } = useActiveSlots();
  const { data: gates } = useGates();
  const { data: gateLanes } = useGateLanes();
  const { data: gateLogs } = useGateLogs();

  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([]);

  const kpis = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayBookings = bookings?.filter((b) => b.scheduled_date === today) ?? [];
    const pending = todayBookings.filter((b) => b.status === "PENDING").length;
    const inProgress = todayBookings.filter((b) => b.status === "IN_PROGRESS" || b.status === "AT_GATE" || b.status === "CHECKED_IN").length;
    const completed = todayBookings.filter((b) => b.status === "COMPLETED").length;

    const todaySlots = slots?.filter((s) => s.slot_date === today) ?? [];
    const totalSlotCap = todaySlots.reduce((s, sl) => s + sl.max_capacity, 0) || 1;
    const totalSlotOcc = todaySlots.reduce((s, sl) => s + (sl.current_occupancy ?? 0), 0);
    const slotUtilization = Math.round((totalSlotOcc / totalSlotCap) * 100);

    const totalQueue = gateLanes?.reduce((s, l) => s + (l.current_queue ?? 0), 0) ?? 0;

    const myTerminal = terminals?.[0]; // Operator sees their assigned terminal
    const terminalPct = myTerminal && myTerminal.total_capacity > 0
      ? Math.round(((myTerminal.current_occupancy ?? 0) / myTerminal.total_capacity) * 100) : 0;

    return { pending, inProgress, completed, slotUtilization, totalQueue, todayBookings: todayBookings.length, terminalPct, todaySlots };
  }, [bookings, slots, gateLanes, terminals]);

  // Hourly throughput line chart
  const throughputData = useMemo(() => {
    const hours = Array.from({ length: 18 }, (_, i) => ({
      hour: `${(i + 6).toString().padStart(2, "0")}:00`,
      entries: 0,
      exits: 0,
    }));
    gateLogs?.forEach((log) => {
      if (!log.timestamp) return;
      const h = new Date(log.timestamp).getHours();
      const idx = h - 6;
      if (idx >= 0 && idx < hours.length) {
        if (log.action_type === "ENTRY" || log.action_type === "CHECK_IN") hours[idx].entries++;
        if (log.action_type === "EXIT") hours[idx].exits++;
      }
    });
    return hours;
  }, [gateLogs]);

  // Slot availability heatmap data
  const slotAvailability = useMemo(() => {
    if (!kpis.todaySlots?.length) return [];
    return kpis.todaySlots
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
      .slice(0, 12)
      .map((s) => ({
        time: s.start_time?.substring(0, 5),
        available: s.max_capacity - (s.current_occupancy ?? 0),
        used: s.current_occupancy ?? 0,
        total: s.max_capacity,
      }));
  }, [kpis.todaySlots]);

  // Pending bookings queue
  const bookingQueue = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return (bookings ?? [])
      .filter((b) => b.scheduled_date === today && (b.status === "PENDING" || b.status === "CONFIRMED" || b.status === "CHECKED_IN"))
      .sort((a, b) => a.scheduled_start.localeCompare(b.scheduled_start))
      .slice(0, 6);
  }, [bookings]);

  // Warnings
  const warnings = useMemo(() => {
    const w: Array<{ id: string; title: string; message: string; severity: "critical" | "warning" | "info" }> = [];
    const nearFullSlots = (kpis.todaySlots ?? []).filter(
      (s) => s.max_capacity > 0 && ((s.current_occupancy ?? 0) / s.max_capacity) >= 0.85 && s.status !== "CLOSED"
    );
    if (nearFullSlots.length > 0) w.push({ id: "near-full-slots", title: `${nearFullSlots.length} Slot(s) Near Capacity`, message: "Some time slots are almost full. Consider limiting new bookings.", severity: "warning" });
    if (kpis.totalQueue > 10) w.push({ id: "high-queue", title: "High Gate Queue", message: `${kpis.totalQueue} vehicles queued across all lanes. Consider opening additional lanes.`, severity: "critical" });
    gates?.forEach((g) => {
      if (g.gate_status === "MAINTENANCE") w.push({ id: `gate-maint-${g.id}`, title: `Gate ${g.gate_number} Maintenance`, message: "Gate offline — rerouting required.", severity: "warning" });
    });
    return w.filter((warning) => !dismissedWarnings.includes(warning.id));
  }, [kpis, gates, dismissedWarnings]);

  return (
    <div className="space-y-4 pb-8">
      <SectionHeader icon={Ship} title="Terminal Control Center" subtitle="Operations monitoring & booking management" color="secondary" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Pending Validations" value={kpis.pending} icon={<Clock size={18} />} color="warning" trend={{ value: kpis.pending > 5 ? -8 : 12 }} delay={0} />
        <StatCard label="Terminal Saturation" value={`${kpis.terminalPct}%`} icon={<Box size={18} />} color={kpis.terminalPct > 80 ? "warning" : "primary"} delay={1} />
        <StatCard label="Slot Usage" value={`${kpis.slotUtilization}%`} icon={<BarChart3 size={18} />} color={kpis.slotUtilization > 85 ? "error" : "success"} delay={2} />
        <StatCard label="Gate Congestion" value={kpis.totalQueue} icon={<ChevronsUp size={18} />} color={kpis.totalQueue > 10 ? "error" : "secondary"} delay={3} />
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <WarningList warnings={warnings} onDismiss={(id) => setDismissedWarnings((p) => [...p, id])} />
        </motion.div>
      )}

      {/* Terminal Yard + Booking Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Gate & Yard Visualization" subtitle="Live truck positions" accentColor="bg-secondary" className="lg:col-span-2 min-h-[340px]" delay={1}>
          <PortMap mode="OPERATOR" />
        </ChartCard>

        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-3">Booking Queue</p>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {bookingQueue.length === 0 ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-foreground/30 text-center py-8">
                  No pending bookings
                </motion.p>
              ) : (
                bookingQueue.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => router.push("/bookings")}
                    className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5 hover:border-secondary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={cn("text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                        booking.status === "PENDING" ? "bg-warning/10 text-warning" :
                        booking.status === "CONFIRMED" ? "bg-primary/10 text-primary" :
                        "bg-secondary/10 text-secondary"
                      )}>
                        {booking.status}
                      </span>
                      <span className="text-[10px] text-foreground/30">{booking.scheduled_start?.substring(0, 5)}</span>
                    </div>
                    <p className="font-semibold text-xs text-foreground group-hover:text-secondary transition-colors">{booking.booking_reference}</p>
                    <p className="text-[10px] text-foreground/40 mt-0.5">{booking.booking_type.replace("_", " ")}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Gate Throughput" subtitle="Entries & exits per hour" accentColor="bg-info" delay={2}>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} interval={2} />
                <YAxis tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="entries" name="Entries" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="exits" name="Exits" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Slot Availability" subtitle="Today's time slots" accentColor="bg-primary" delay={3}>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slotAvailability}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} />
                <YAxis tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="used" name="Used" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="available" name="Available" stackId="a" fill="rgba(59,130,246,0.15)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Notifications + Recommendations + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <div className="absolute -top-1 -right-1 w-14 h-14 opacity-10 bg-info" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
          <NotificationFeed userId={profile?.id} maxItems={5} />
        </div>
        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-3">Recommendations</p>
          <div className="space-y-2">
            <RecommendationCard title="Open Additional Lane" description={`Queue length is ${kpis.totalQueue}. Consider opening a bidirectional lane for faster processing.`} type="optimization" delay={0} />
            <RecommendationCard title="Slot Rebalancing" description={`Current utilization is ${kpis.slotUtilization}%. Redistribute upcoming bookings to off-peak slots.`} type="ai" actionLabel="Auto-Balance" delay={1} />
          </div>
        </div>

        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <QuickActionsGrid
            title="Operator Quick Actions"
            actions={[
              { label: "Manage Bookings", icon: <Package size={14} />, onClick: () => router.push("/bookings"), color: "secondary", variant: "filled" },
              { label: "Analytics", icon: <Activity size={14} />, onClick: () => router.push("/analytics"), color: "primary" },
              { label: "My Logs", icon: <FileText size={14} />, onClick: () => router.push("/loggings"), color: "accent" },
              { label: "Yard Settings", icon: <Settings size={14} />, onClick: () => router.push("/settings"), color: "success" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CARRIER / DISPATCHER DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const CarrierDashboard = () => {
  useDispatcherRealtimeSubscriptions();
  const router = useRouter();
  const { profile } = useAuth();

  const { data: bookings } = useBookings();
  const { data: fleet } = useFleet();
  const { data: slots } = useActiveSlots();

  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([]);

  const kpis = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const myBookings = bookings ?? [];
    const todayBookings = myBookings.filter((b) => b.scheduled_date === today);
    const activeBookings = myBookings.filter((b) => ["PENDING", "CONFIRMED", "CHECKED_IN", "AT_GATE", "IN_PROGRESS"].includes(b.status)).length;
    const completedToday = todayBookings.filter((b) => b.status === "COMPLETED").length;

    const trucks = fleet?.trucks ?? []; // Ensure fleet is defined before accessing properties
    const drivers = fleet?.drivers ?? [];
    const availableTrucks = trucks.filter((t) => t.status === "AVAILABLE").length;
    const availableDrivers = drivers.filter((d) => d.status === "ACTIVE").length;

    return {
      activeBookings,
      pendingBookings: myBookings.filter(b => b.status === "PENDING").length, // Added pending count
      completedToday,
      totalTodayBookings: todayBookings.length,
      availableTrucks,
      totalTrucks: trucks.length,
      availableDrivers,
      totalDrivers: drivers.length,
      trucks,
      drivers,
    };
  }, [bookings, fleet]);

  // Weekly booking trend
  const weeklyTrend = useMemo(() => {
    const days: Array<{ day: string; bookings: number; completed: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayBookings = bookings?.filter((b) => b.scheduled_date === dateStr) ?? [];
      days.push({
        day: d.toLocaleDateString("en", { weekday: "short" }),
        bookings: dayBookings.length,
        completed: dayBookings.filter((b) => b.status === "COMPLETED").length,
      });
    }
    return days;
  }, [bookings]);

  // Booking type distribution
  const typeDistribution = useMemo(() => {
    if (!bookings?.length) return [];
    const counts: Record<string, number> = {};
    bookings.forEach((b) => { counts[b.booking_type] = (counts[b.booking_type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
  }, [bookings]);

  // Upcoming bookings
  const upcomingBookings = useMemo(() => {
    const now = new Date();
    return (bookings ?? [])
      .filter((b) => ["PENDING", "CONFIRMED"].includes(b.status) && new Date(b.scheduled_date + "T" + b.scheduled_start) >= now)
      .sort((a, b) => (a.scheduled_date + a.scheduled_start).localeCompare(b.scheduled_date + b.scheduled_start))
      .slice(0, 5);
  }, [bookings]);

  // Fleet utilization gauge
  const fleetUtilization = useMemo(() => {
    const total = kpis.totalTrucks || 1;
    const inUse = kpis.totalTrucks - kpis.availableTrucks;
    return [{ name: "In Use", value: Math.round((inUse / total) * 100), fill: "#3b82f6" }];
  }, [kpis]);

  // Warnings
  const warnings = useMemo(() => {
    const w: Array<{ id: string; title: string; message: string; severity: "critical" | "warning" | "info" }> = [];
    const expiringDrivers = kpis.drivers.filter((d) => {
      const exp = new Date(d.license_expiry);
      const daysLeft = Math.ceil((exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 30 && daysLeft > 0;
    });
    if (expiringDrivers.length > 0) w.push({ id: "exp-license", title: `${expiringDrivers.length} License(s) Expiring Soon`, message: `Driver licenses expiring within 30 days. Renew to avoid booking disruptions.`, severity: "warning" });

    const maintTrucks = kpis.trucks.filter((t) => t.status === "MAINTENANCE");
    if (maintTrucks.length > 0) w.push({ id: "maint-trucks", title: `${maintTrucks.length} Truck(s) in Maintenance`, message: "Some trucks are unavailable. Plan bookings with available fleet.", severity: "info" });

    if (kpis.availableTrucks === 0 && kpis.totalTrucks > 0) w.push({ id: "no-trucks", title: "No Available Trucks", message: "All trucks are currently in use or under maintenance.", severity: "critical" });

    return w.filter((warning) => !dismissedWarnings.includes(warning.id));
  }, [kpis, dismissedWarnings]);

  return (
    <div className="space-y-4 pb-8">
      <SectionHeader icon={TruckIcon} title="Carrier Portal" subtitle="Fleet management & slot booking" color="accent" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Confirmed Bookings" value={kpis.activeBookings} icon={<CheckCircle2 size={18} />} color="success" delay={0} />
        <StatCard label="Pending Requests" value={kpis.pendingBookings} icon={<Clock size={18} />} color="warning" delay={1} />
        <StatCard label="Fleet Status" value={`${kpis.availableTrucks}/${kpis.totalTrucks}`} icon={<TruckIcon size={18} />} color="primary" delay={2} />
        <StatCard label="Completed Trips" value={kpis.completedToday} icon={<Package size={18} />} color="secondary" trend={{ value: 15, label: "on track" }} delay={3} />
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <WarningList warnings={warnings} onDismiss={(id) => setDismissedWarnings((p) => [...p, id])} />
        </motion.div>
      )}

      {/* Charts + Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Weekly Booking Trend" subtitle="Last 7 days" accentColor="bg-primary" className="lg:col-span-2" delay={1}>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="gradientBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradientCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--foreground)", opacity: 0.4 }} />
                <YAxis tick={{ fontSize: 9, fill: "var(--foreground)", opacity: 0.4 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#3b82f6" strokeWidth={2} fill="url(#gradientBookings)" />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} fill="url(#gradientCompleted)" />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <div className="absolute -top-1 -right-1 w-14 h-14 opacity-10 bg-accent" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-3 flex items-center gap-2">
            <Calendar size={12} />
            Upcoming Bookings
          </p>
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {upcomingBookings.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <p className="text-xs text-foreground/30 mb-3">No upcoming bookings</p>
                  <button
                    onClick={() => router.push("/carrier")}
                    className="px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-bold hover:bg-accent hover:text-white transition-all active:scale-95"
                  >
                    Book a Slot
                  </button>
                </motion.div>
              ) : (
                upcomingBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => router.push("/bookings")}
                    className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5 hover:border-accent/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-accent uppercase tracking-widest">{booking.booking_type.replace(/_/g, " ")}</span>
                      <span className="text-[10px] text-foreground/30">{booking.scheduled_date}</span>
                    </div>
                    <p className="font-semibold text-xs group-hover:text-accent transition-colors">{booking.booking_reference}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-foreground/40">{booking.scheduled_start?.substring(0, 5)} – {booking.scheduled_end?.substring(0, 5)}</span>
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                        booking.status === "PENDING" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Fleet Status + Booking Types + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Fleet Utilization" subtitle="Current truck usage" accentColor="bg-accent" delay={2}>
          <div className="h-[160px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={fleetUtilization} startAngle={180} endAngle={0}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "rgba(255,255,255,0.03)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-2xl font-black text-foreground">{fleetUtilization[0]?.value ?? 0}%</p>
              <p className="text-[9px] text-foreground/40 uppercase tracking-widest">Fleet In Use</p>
            </div>
          </div>

          {/* Fleet cards */}
          <div className="space-y-2 mt-2">
            {kpis.trucks.slice(0, 3).map((truck) => (
              <div key={truck.id} className="flex items-center gap-3 p-2 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center",
                  truck.status === "AVAILABLE" ? "bg-success/10 text-success" :
                  truck.status === "IN_USE" ? "bg-primary/10 text-primary" :
                  "bg-warning/10 text-warning"
                )}>
                  <TruckIcon size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate">{truck.plate_number}</p>
                </div>
                <span className={cn("text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                  truck.status === "AVAILABLE" ? "bg-success/10 text-success" :
                  truck.status === "IN_USE" ? "bg-primary/10 text-primary" :
                  "bg-warning/10 text-warning"
                )}>
                  {truck.status}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Booking Types" subtitle="Breakdown by type" accentColor="bg-secondary" delay={3}>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 9 }}
                  formatter={(value: string) => <span className="text-foreground/50 text-[9px]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="space-y-3">
          <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
            <QuickActionsGrid
              title="Carrier Quick Actions"
              actions={[
                { label: "Book Slot", icon: <Zap size={14} />, onClick: () => router.push("/bookings/new"), color: "accent", variant: "filled" },
                { label: "Manage Bookings", icon: <Package size={14} />, onClick: () => router.push("/bookings"), color: "primary" },
                { label: "Analytics", icon: <BarChart3 size={14} />, onClick: () => router.push("/analytics"), color: "secondary" },
              ]}
            />
          </div>

          <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-3">Suggestions</p>
            <RecommendationCard
              title="Optimal Booking Window"
              description="Based on slot patterns, 10:00–12:00 has the highest availability for tomorrow."
              type="ai"
              actionLabel="Book Now"
              onAction={() => router.push("/carrier")}
              delay={0}
            />
          </div>
        </div>
      </div>

      {/* Notification Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <NotificationFeed userId={profile?.id} maxItems={5} />
        </div>

        <div className="glass-card-geo p-4 border border-foreground/5 relative overflow-hidden h-full">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mb-3">Driver Status</p>
          <div className="space-y-2">
            {kpis.drivers.slice(0, 4).map((driver) => {
              const daysToExpiry = Math.ceil((new Date(driver.license_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={driver.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                    driver.status === "ACTIVE" ? "bg-success/10 text-success" :
                    driver.status === "SUSPENDED" ? "bg-error/10 text-error" :
                    "bg-foreground/5 text-foreground/40"
                  )}>
                    {driver.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold truncate">{driver.full_name}</p>
                    <p className="text-[9px] text-foreground/30">{driver.phone_number}</p>
                  </div>
                  {daysToExpiry <= 30 && daysToExpiry > 0 && (
                    <span className="text-[8px] font-bold bg-warning/10 text-warning px-1.5 py-0.5 rounded-full">
                      {daysToExpiry}d left
                    </span>
                  )}
                  <span className={cn("text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                    driver.status === "ACTIVE" ? "bg-success/10 text-success" :
                    driver.status === "SUSPENDED" ? "bg-error/10 text-error" :
                    "bg-foreground/5 text-foreground/40"
                  )}>
                    {driver.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
