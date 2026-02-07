"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractivePortPlanProps {
  terminals: Array<{
    id: string;
    zone_name: string;
    zone_code: string;
    current_occupancy: number | null;
    total_capacity: number;
  }>;
  gates: Array<{
    id: string;
    gate_number: string;
    gate_status: string;
  }>;
  gateLanes: Array<{
    id: string;
    gate_id: string;
    lane_number: number;
    lane_type: string;
    current_queue: number | null;
    is_operational: boolean | null;
  }>;
  onTerminalClick?: (id: string) => void;
  onGateClick?: (id: string) => void;
}

export const InteractivePortPlan: React.FC<InteractivePortPlanProps> = ({
  terminals,
  gates,
  gateLanes,
  onTerminalClick,
  onGateClick,
}) => {
  const getOccupancyColor = (occ: number, cap: number) => {
    const pct = cap > 0 ? (occ / cap) * 100 : 0;
    if (pct >= 90) return { fill: "#ef4444", glow: "rgba(239,68,68,0.4)", label: "Critical" };
    if (pct >= 70) return { fill: "#f59e0b", glow: "rgba(245,158,11,0.3)", label: "High" };
    if (pct >= 40) return { fill: "#3b82f6", glow: "rgba(59,130,246,0.3)", label: "Normal" };
    return { fill: "#10b981", glow: "rgba(16,185,129,0.3)", label: "Low" };
  };

  const getGateStatusColor = (status: string) => {
    switch (status) {
      case "OPERATIONAL": return "#10b981";
      case "MAINTENANCE": return "#f59e0b";
      case "CLOSED": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div className="w-full h-full min-h-[420px] bg-neutral-950 rounded-2xl relative overflow-hidden border border-foreground/10">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Water effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-900/30 to-transparent" />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
        animate={{ x: [-100, 100, -100] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg viewBox="0 0 800 450" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Port outline */}
        <path d="M 30 40 L 770 40 L 770 410 L 30 410 Z" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Label */}
        <text x="400" y="25" textAnchor="middle" className="text-[10px] fill-blue-400/40 font-bold uppercase tracking-[0.3em]">
          Port Operations Plan
        </text>

        {/* Gates on the left side */}
        {gates.map((gate, i) => {
          const y = 80 + i * (320 / Math.max(gates.length, 1));
          const statusColor = getGateStatusColor(gate.gate_status);
          const lanesForGate = gateLanes.filter((l) => l.gate_id === gate.id);
          const totalQueue = lanesForGate.reduce((sum, l) => sum + (l.current_queue || 0), 0);

          return (
            <g key={gate.id} onClick={() => onGateClick?.(gate.id)} className="cursor-pointer">
              {/* Gate rectangle */}
              <motion.rect
                x={40} y={y} width={80} height={50}
                rx={6}
                fill="rgba(30,30,30,0.8)"
                stroke={statusColor}
                strokeWidth={1.5}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              />
              {/* Gate status indicator */}
              <motion.circle
                cx={52} cy={y + 12} r={3}
                fill={statusColor}
                animate={gate.gate_status === "OPERATIONAL" ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text x={60} y={y + 15} className="text-[8px] fill-white/70 font-bold">{gate.gate_number}</text>
              <text x={52} y={y + 30} className="text-[7px] fill-white/40">{gate.gate_status}</text>
              <text x={52} y={y + 42} className="text-[7px] fill-blue-400/60">Queue: {totalQueue}</text>

              {/* Lanes as small triangles */}
              {lanesForGate.map((lane, li) => (
                <motion.polygon
                  key={lane.id}
                  points={`${125 + li * 16},${y + 15} ${133 + li * 16},${y + 5} ${141 + li * 16},${y + 15}`}
                  fill={lane.is_operational ? statusColor : "rgba(100,100,100,0.3)"}
                  opacity={0.6}
                  animate={lane.is_operational ? { opacity: [0.4, 0.8, 0.4] } : {}}
                  transition={{ duration: 3, repeat: Infinity, delay: li * 0.3 }}
                />
              ))}

              {/* Connection line to terminals area */}
              <motion.line
                x1={120} y1={y + 25} x2={200} y2={y + 25}
                stroke={statusColor}
                strokeWidth={1}
                strokeDasharray="4 2"
                opacity={0.3}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </g>
          );
        })}

        {/* Terminals in a grid on the right side */}
        {terminals.map((terminal, i) => {
          const cols = Math.min(3, terminals.length);
          const row = Math.floor(i / cols);
          const col = i % cols;
          const x = 230 + col * 190;
          const y = 60 + row * 180;
          const occ = terminal.current_occupancy || 0;
          const cap = terminal.total_capacity;
          const pct = cap > 0 ? Math.round((occ / cap) * 100) : 0;
          const color = getOccupancyColor(occ, cap);

          // Capacity grid (small rectangles inside terminal)
          const gridCols = 8;
          const gridRows = 4;
          const filledCells = Math.round((pct / 100) * gridCols * gridRows);

          return (
            <g key={terminal.id} onClick={() => onTerminalClick?.(terminal.id)} className="cursor-pointer">
              {/* Terminal glow */}
              <motion.rect
                x={x - 2} y={y - 2} width={164} height={144}
                rx={10}
                fill="none"
                stroke={color.fill}
                strokeWidth={0.5}
                opacity={0.2}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              />

              {/* Terminal rectangle */}
              <motion.rect
                x={x} y={y} width={160} height={140}
                rx={8}
                fill="rgba(20,20,20,0.9)"
                stroke={color.fill}
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              />

              {/* Triangle accent in corner */}
              <polygon
                points={`${x + 140},${y} ${x + 160},${y} ${x + 160},${y + 20}`}
                fill={color.fill}
                opacity={0.3}
              />

              {/* Terminal info */}
              <circle cx={x + 14} cy={y + 16} r={4} fill={color.fill} />
              <text x={x + 24} y={y + 19} className="text-[9px] fill-white/80 font-bold">
                {terminal.zone_code}
              </text>
              <text x={x + 12} y={y + 34} className="text-[7px] fill-white/40">
                {terminal.zone_name}
              </text>

              {/* Capacity bar */}
              <rect x={x + 12} y={y + 42} width={136} height={4} rx={2} fill="rgba(255,255,255,0.05)" />
              <motion.rect
                x={x + 12} y={y + 42}
                width={0}
                height={4}
                rx={2}
                fill={color.fill}
                animate={{ width: (136 * pct) / 100 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              />

              {/* Capacity grid */}
              {Array.from({ length: gridCols * gridRows }).map((_, ci) => {
                const cr = Math.floor(ci / gridCols);
                const cc = ci % gridCols;
                return (
                  <motion.rect
                    key={ci}
                    x={x + 12 + cc * 17}
                    y={y + 55 + cr * 17}
                    width={14}
                    height={14}
                    rx={2}
                    fill={ci < filledCells ? color.fill : "rgba(255,255,255,0.03)"}
                    opacity={ci < filledCells ? 0.6 : 1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: ci < filledCells ? 0.6 : 0.3 }}
                    transition={{ delay: 0.5 + ci * 0.02 }}
                  />
                );
              })}

              {/* Stats */}
              <text x={x + 12} y={y + 132} className="text-[8px] fill-white/50">
                {occ}/{cap} slots
              </text>
              <text x={x + 120} y={y + 132} textAnchor="end" className="text-[9px] font-bold" fill={color.fill}>
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Animated trucks moving between gates and terminals */}
        {[0, 1, 2].map((i) => (
          <motion.g key={`truck-${i}`}>
            <motion.rect
              width={12} height={8} rx={2}
              fill={["#3b82f6", "#f59e0b", "#0ea5e9"][i]}
              opacity={0.8}
              animate={{
                x: [140, 220 + i * 50, 220 + i * 50],
                y: [90 + i * 120, 90 + i * 60, 90 + i * 60],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 1.5,
              }}
            />
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        {[
          { color: "#10b981", label: "Low" },
          { color: "#3b82f6", label: "Normal" },
          { color: "#f59e0b", label: "High" },
          { color: "#ef4444", label: "Critical" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} />
            <span className="text-[8px] text-white/50 font-medium">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
