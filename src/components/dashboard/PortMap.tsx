"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Power, Truck as TruckIcon, ChevronRight, Link as LinkIcon, Unlink, MousePointer2 } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Lane {
  id: string;
  enabled: boolean;
}

interface Gate {
  id: string;
  name: string;
  enabled: boolean;
  lanes: Lane[];
  connectedTerminals: string[];
}

interface TerminalData {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  capacity: number;
  occupancy: number;
}

interface TruckDot {
  id: string;
  plate: string;
  status: "entering" | "loading" | "exiting" | "idle";
  fromGate: string;
  toTerminal: string;
  progress: number;
  speed: number;
  booking?: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockGates: Gate[] = [
  { id: "G1", name: "Gate A", enabled: true, lanes: [{ id: "L1", enabled: true }, { id: "L2", enabled: true }, { id: "L3", enabled: false }], connectedTerminals: ["T1", "T2"] },
  { id: "G2", name: "Gate B", enabled: true, lanes: [{ id: "L4", enabled: true }, { id: "L5", enabled: true }], connectedTerminals: ["T2", "T3"] },
  { id: "G3", name: "Gate C", enabled: false, lanes: [{ id: "L6", enabled: false }, { id: "L7", enabled: false }], connectedTerminals: ["T3"] },
  { id: "G4", name: "Gate D", enabled: true, lanes: [{ id: "L8", enabled: true }, { id: "L9", enabled: true }, { id: "L10", enabled: true }], connectedTerminals: ["T1", "T4"] },
];

const mockTerminals: TerminalData[] = [
  { id: "T1", name: "Container Terminal North", code: "CTN", enabled: true, capacity: 500, occupancy: 420 },
  { id: "T2", name: "Bulk Terminal East", code: "BTE", enabled: true, capacity: 300, occupancy: 180 },
  { id: "T3", name: "General Cargo West", code: "GCW", enabled: true, capacity: 200, occupancy: 190 },
  { id: "T4", name: "Tanker Terminal South", code: "TTS", enabled: false, capacity: 400, occupancy: 0 },
];

const initialTrucks: TruckDot[] = [
  { id: "TR1", plate: "AB-123-CD", status: "entering", fromGate: "G1", toTerminal: "T1", progress: 0.1, speed: 0.005, booking: "BK-2026-001" },
  { id: "TR2", plate: "EF-456-GH", status: "loading", fromGate: "G1", toTerminal: "T2", progress: 0.8, speed: 0.002, booking: "BK-2026-002" },
  { id: "TR3", plate: "IJ-789-KL", status: "exiting", fromGate: "G2", toTerminal: "T2", progress: 0.2, speed: 0.007, booking: "BK-2026-003" },
  { id: "TR4", plate: "MN-012-OP", status: "entering", fromGate: "G4", toTerminal: "T1", progress: 0.4, speed: 0.004, booking: "BK-2026-004" },
  { id: "TR5", plate: "QR-345-ST", status: "idle", fromGate: "G2", toTerminal: "T3", progress: 0.1, speed: 0.003 },
];

const statusColors: Record<string, string> = {
  entering: "#3b82f6",
  loading: "#10b981",
  exiting: "#f59e0b",
  idle: "#6b7280",
};

const utilizationColor = (pct: number) =>
  pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981";

// ─── Component ───────────────────────────────────────────────────────────────
interface PortMapProps {
  mode?: "ADMIN" | "OPERATOR" | "VIEW";
}

const PortMap: React.FC<PortMapProps> = ({ mode = "VIEW" }) => {
  const [gates, setGates] = useState<Gate[]>(mockGates);
  const [terminals, setTerminals] = useState<TerminalData[]>(mockTerminals);
  const [trucks, setTrucks] = useState<TruckDot[]>(initialTrucks);
  
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  
  const [hoveredTruck, setHoveredTruck] = useState<string | null>(null);
  const [hoveredGate, setHoveredGate] = useState<string | null>(null);
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);

  const isAdmin = mode === "ADMIN";

  // Mock movement logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks(prev => prev.map(t => {
        let nextProgress = t.progress + t.speed;
        if (nextProgress > 1) nextProgress = 0;
        return { ...t, progress: nextProgress };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const toggleGate = useCallback((gateId: string) => {
    if (!isAdmin) return;
    // If we click the same gate, deselect it. Otherwise, select it for connection management.
    if (selectedGateId === gateId) {
        setSelectedGateId(null);
    } else {
        setSelectedGateId(gateId);
    }
  }, [isAdmin, selectedGateId]);

  const toggleGatePower = useCallback((e: React.MouseEvent, gateId: string) => {
    e.stopPropagation();
    if (!isAdmin) return;
    setGates(prev => prev.map(g =>
      g.id === gateId
        ? { ...g, enabled: !g.enabled, lanes: g.lanes.map(l => ({ ...l, enabled: !g.enabled ? l.enabled : false })) }
        : g
    ));
  }, [isAdmin]);

  const toggleLane = useCallback((gateId: string, laneId: string) => {
    if (!isAdmin) return;
    setGates(prev => prev.map(g =>
      g.id === gateId
        ? { ...g, lanes: g.lanes.map(l => l.id === laneId ? { ...l, enabled: !l.enabled } : l) }
        : g
    ));
  }, [isAdmin]);

  const toggleTerminal = useCallback((termId: string) => {
    if (!isAdmin) return;
    
    // If a gate is selected, toggle the connection instead of the terminal state
    if (selectedGateId) {
        setGates(prev => prev.map(g => {
            if (g.id !== selectedGateId) return g;
            const isConnected = g.connectedTerminals.includes(termId);
            return {
                ...g,
                connectedTerminals: isConnected 
                    ? g.connectedTerminals.filter(id => id !== termId)
                    : [...g.connectedTerminals, termId]
            };
        }));
    } else {
        // Otherwise toggle the terminal status
        setTerminals(prev => prev.map(t => t.id === termId ? { ...t, enabled: !t.enabled } : t));
    }
  }, [isAdmin, selectedGateId]);

  const SVG_W = 900;
  const SVG_H = 380;
  const GATE_Y = 50;
  const TERMINAL_Y = 300;
  const GATE_W = 160;
  const GATE_H = 65;
  const TERM_W = 170;
  const TERM_H = 55;

  const gatePositions = useMemo(() => {
    const spacing = SVG_W / (gates.length + 1);
    return gates.map((g, i) => ({ ...g, x: spacing * (i + 1) - GATE_W / 2, y: GATE_Y }));
  }, [gates]);

  const termPositions = useMemo(() => {
    const spacing = SVG_W / (terminals.length + 1);
    return terminals.map((t, i) => ({ ...t, x: spacing * (i + 1) - TERM_W / 2, y: TERMINAL_Y }));
  }, [terminals]);

  const connections = useMemo(() => {
    const lines: Array<{ gateX: number; gateY: number; termX: number; termY: number; gateEnabled: boolean; termEnabled: boolean; gateId: string; termId: string; isBeingEdited: boolean }> = [];
    gatePositions.forEach(g => {
      const gateData = gates.find(gate => gate.id === g.id);
      gateData?.connectedTerminals.forEach(tId => {
        const term = termPositions.find(t => t.id === tId);
        if (term) {
          lines.push({
            gateX: g.x + GATE_W / 2,
            gateY: g.y + GATE_H,
            termX: term.x + TERM_W / 2,
            termY: term.y,
            gateEnabled: g.enabled,
            termEnabled: term.enabled,
            gateId: g.id,
            termId: tId,
            isBeingEdited: selectedGateId === g.id
          });
        }
      });
    });
    return lines;
  }, [gatePositions, termPositions, gates, selectedGateId]);

  const truckDots = useMemo(() => {
    return trucks.map(truck => {
      const conn = connections.find(c => c.gateId === truck.fromGate && c.termId === truck.toTerminal);
      if (!conn) return null;
      const p = truck.status === "exiting" ? 1 - truck.progress : truck.progress;
      const x = conn.gateX + (conn.termX - conn.gateX) * p;
      const y = conn.gateY + (conn.termY - conn.gateY) * p;
      return { ...truck, cx: x, cy: y };
    }).filter(Boolean) as (TruckDot & { cx: number; cy: number })[];
  }, [connections, trucks]);

  return (
    <div className="w-full h-full relative select-none">
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full" style={{ minHeight: 280 }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="heavy-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Row Labels */}
        <text x={14} y={GATE_Y + GATE_H / 2 + 4} fill="var(--foreground)" fillOpacity={0.1} fontSize={9} fontWeight={800} letterSpacing={2}>GATES</text>
        <text x={14} y={TERMINAL_Y + TERM_H / 2 + 4} fill="var(--foreground)" fillOpacity={0.1} fontSize={9} fontWeight={800} letterSpacing={2}>TERMINALS</text>

        {/* Connections */}
        {connections.map((conn, i) => {
          const active = conn.gateEnabled && conn.termEnabled;
          const isSelected = selectedGateId === conn.gateId;
          return (
            <line key={`conn-${i}`} x1={conn.gateX} y1={conn.gateY + 4} x2={conn.termX} y2={conn.termY - 4}
              stroke={isSelected ? "#3b82f6" : "var(--foreground)"} 
              strokeOpacity={isSelected ? 0.6 : (active ? 0.12 : 0.04)}
              strokeWidth={isSelected ? 2.5 : (active ? 1.5 : 1)} 
              strokeDasharray={isSelected ? "none" : (active ? "6 4" : "3 6")} 
              markerEnd="url(#arrow)" 
              style={{ transition: "stroke 0.3s, stroke-width 0.3s, stroke-opacity 0.3s" }}
            />
          );
        })}

        {/* Selection Guidance Link Line (Dynamic) */}
        {selectedGateId && hoveredTerminal && !gates.find(g => g.id === selectedGateId)?.connectedTerminals.includes(hoveredTerminal) && (
            (() => {
                const gate = gatePositions.find(g => g.id === selectedGateId);
                const term = termPositions.find(t => t.id === hoveredTerminal);
                if (gate && term) {
                    return (
                        <line x1={gate.x + GATE_W / 2} y1={gate.y + GATE_H} x2={term.x + TERM_W / 2} y2={term.y}
                            stroke="#3b82f6" strokeOpacity={0.4} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#arrow)" />
                    );
                }
                return null;
            })()
        )}

        {/* Gates */}
        {gatePositions.map(gate => {
          const isHovered = hoveredGate === gate.id;
          const isSelected = selectedGateId === gate.id;
          return (
            <g key={gate.id}>
              {/* Selected Highlight */}
              {isSelected && (
                <rect x={gate.x - 4} y={gate.y - 4} width={GATE_W + 8} height={GATE_H + 8} rx={16}
                    fill="#3b82f6" fillOpacity={0.1} filter="url(#glow)" />
              )}
              
              <rect x={gate.x} y={gate.y} width={GATE_W} height={GATE_H} rx={12}
                fill="var(--foreground)" fillOpacity={gate.enabled ? 0.04 : 0.01}
                stroke={isSelected ? "#3b82f6" : (gate.enabled ? (isHovered ? "#3b82f6" : "var(--foreground)") : "var(--foreground)")}
                strokeOpacity={isSelected ? 1 : (gate.enabled ? (isHovered ? 0.5 : 0.1) : 0.05)}
                strokeWidth={isSelected ? 2 : (isHovered ? 1.5 : 1)} className="cursor-pointer"
                onMouseEnter={() => setHoveredGate(gate.id)} onMouseLeave={() => setHoveredGate(null)}
                onClick={() => toggleGate(gate.id)} />
              
              <text x={gate.x + 12} y={gate.y + 20} fill="var(--foreground)" fillOpacity={gate.enabled ? 0.8 : 0.3} fontSize={11} fontWeight={700}>{gate.name}</text>
              
              {/* Power Toggle Button */}
              {isAdmin && (
                  <g className="cursor-pointer" onClick={(e) => toggleGatePower(e, gate.id)}>
                      <circle cx={gate.x + GATE_W - 16} cy={gate.y + 16} r={8} fill={gate.enabled ? "#10b981" : "#ef4444"} fillOpacity={0.1} />
                      <circle cx={gate.x + GATE_W - 16} cy={gate.y + 16} r={3} fill={gate.enabled ? "#10b981" : "#ef4444"} />
                  </g>
              )}

              {/* Lanes UI Improvement */}
              {gate.lanes.map((lane, li) => {
                const lx = gate.x + 12 + li * 28;
                const ly = gate.y + 36;
                const laneHovered = hoveredGate === `${gate.id}-${lane.id}`;
                return (
                  <g key={lane.id} 
                     onMouseEnter={() => setHoveredGate(`${gate.id}-${lane.id}`)} 
                     onMouseLeave={() => setHoveredGate(null)}>
                    <rect x={lx} y={ly} width={22} height={16} rx={4}
                      fill={lane.enabled && gate.enabled ? "#3b82f6" : "var(--foreground)"}
                      fillOpacity={lane.enabled && gate.enabled ? (laneHovered ? 0.4 : 0.2) : 0.04}
                      stroke={lane.enabled && gate.enabled ? "#3b82f6" : "var(--foreground)"}
                      strokeOpacity={lane.enabled && gate.enabled ? 0.5 : 0.08} strokeWidth={0.5}
                      className={isAdmin && gate.enabled ? "cursor-pointer" : ""}
                      onClick={(e) => { e.stopPropagation(); if (gate.enabled) toggleLane(gate.id, lane.id); }} />
                    <text x={lx + 11} y={ly + 11} textAnchor="middle" fill="var(--foreground)"
                      fillOpacity={lane.enabled && gate.enabled ? 0.7 : 0.15} fontSize={7} fontWeight={800}>
                      {lane.id.replace("L", "")}
                    </text>
                    {/* Lane Status Indicator */}
                    <circle cx={lx + 11} cy={ly + 18} r={1.5} fill={lane.enabled && gate.enabled ? "#10b981" : "#ef4444"} fillOpacity={0.6} />
                  </g>
                );
              })}

              {!gate.enabled && (
                <text x={gate.x + GATE_W / 2} y={gate.y + GATE_H / 2 + 5} textAnchor="middle"
                  fill="#ef4444" fillOpacity={0.4} fontSize={9} fontWeight={800} letterSpacing={1.5}>DISABLED</text>
              )}
            </g>
          );
        })}

        {/* Terminals */}
        {termPositions.map(term => {
          const isHovered = hoveredTerminal === term.id;
          const isConnectedToSelected = selectedGateId && gates.find(g => g.id === selectedGateId)?.connectedTerminals.includes(term.id);
          const pct = term.capacity > 0 ? Math.round((term.occupancy / term.capacity) * 100) : 0;
          const barW = TERM_W - 24;
          const fillW = term.enabled ? (barW * pct) / 100 : 0;
          
          return (
            <g key={term.id}>
              {isConnectedToSelected && (
                  <rect x={term.x - 2} y={term.y - 2} width={TERM_W + 4} height={TERM_H + 4} rx={14}
                    fill="#3b82f6" fillOpacity={0.05} stroke="#3b82f6" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="4 2" />
              )}
              
              <rect x={term.x} y={term.y} width={TERM_W} height={TERM_H} rx={12}
                fill="var(--foreground)" fillOpacity={term.enabled ? 0.04 : 0.01}
                stroke={isHovered ? "#3b82f6" : (isConnectedToSelected ? "#3b82f6" : "var(--foreground)")}
                strokeOpacity={isHovered ? 0.6 : (isConnectedToSelected ? 0.4 : 0.1)}
                strokeWidth={isHovered ? 1.5 : (isConnectedToSelected ? 1.2 : 1)} className="cursor-pointer"
                onMouseEnter={() => setHoveredTerminal(term.id)} onMouseLeave={() => setHoveredTerminal(null)}
                onClick={() => toggleTerminal(term.id)} />
              
              <text x={term.x + 12} y={term.y + 18} fill="var(--foreground)" fillOpacity={term.enabled ? 0.8 : 0.3} fontSize={11} fontWeight={700}>{term.code}</text>
              
              <circle cx={term.x + TERM_W - 16} cy={term.y + 14} r={4} fill={term.enabled ? utilizationColor(pct) : "#ef4444"} />
              
              {term.enabled && (
                <text x={term.x + TERM_W - 30} y={term.y + 18} textAnchor="end" fill={utilizationColor(pct)} fontSize={9} fontWeight={800}>{pct}%</text>
              )}
              
              <rect x={term.x + 12} y={term.y + 28} width={barW} height={5} rx={2.5} fill="var(--foreground)" fillOpacity={0.06} />
              {term.enabled && <rect x={term.x + 12} y={term.y + 28} width={fillW} height={5} rx={2.5} fill={utilizationColor(pct)} fillOpacity={0.6} />}
              
              <text x={term.x + 12} y={term.y + 48} fill="var(--foreground)" fillOpacity={term.enabled ? 0.25 : 0.12} fontSize={7} fontWeight={600}>{term.name}</text>
              
              {!term.enabled && (
                <text x={term.x + TERM_W / 2} y={term.y + TERM_H / 2 + 4} textAnchor="middle"
                  fill="#ef4444" fillOpacity={0.4} fontSize={9} fontWeight={800} letterSpacing={1.5}>OFFLINE</text>
              )}

              {/* Linking Overlay Hint */}
              {selectedGateId && isHovered && (
                  <g className="pointer-events-none">
                      <rect x={term.x + TERM_W/2 - 30} y={term.y - 20} width={60} height={16} rx={8} fill="black" fillOpacity={0.8} />
                      <text x={term.x + TERM_W/2} y={term.y - 9} textAnchor="middle" fill="white" fontSize={8} fontWeight={700}>
                          {isConnectedToSelected ? "DISCONNECT" : "CONNECT"}
                      </text>
                  </g>
              )}
            </g>
          );
        })}

        {/* Truck dots with path movement */}
        {truckDots.map(truck => {
          const isHovered = hoveredTruck === truck.id;
          const color = statusColors[truck.status];
          return (
            <motion.g key={truck.id} 
                initial={false}
                animate={{ x: truck.cx, y: truck.cy }}
                transition={{ type: "tween", ease: "linear", duration: 0.05 }}
                onMouseEnter={() => setHoveredTruck(truck.id)} 
                onMouseLeave={() => setHoveredTruck(null)} 
                className="cursor-pointer">
              {truck.status === "entering" && (
                <circle cx={0} cy={0} r={12} fill={color} fillOpacity={0.08}>
                  <animate attributeName="r" values="7;14;7" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values="0.15;0;0.15" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={0} cy={0} r={isHovered ? 7 : 5} fill={color}
                stroke={isHovered ? "white" : "none"} strokeWidth={isHovered ? 1.5 : 0}
                filter={isHovered ? "url(#glow)" : undefined} style={{ transition: "r 0.2s" }} />
              <text x={0} y={3} textAnchor="middle" fill="white" fontSize={6} fontWeight={900}>▸</text>
            </motion.g>
          );
        })}
      </svg>

      {/* Admin Panel Context Labels */}
      <AnimatePresence>
          {isAdmin && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-1 right-1 flex flex-col items-end gap-1.5 p-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                      <MousePointer2 size={12} className="text-primary" />
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest whitespace-nowrap">
                          {selectedGateId ? `MANAGING: ${gates.find(g => g.id === selectedGateId)?.name}` : "SELECT A GATE TO MANAGE LINKS"}
                      </span>
                  </div>
                  {selectedGateId && (
                      <button onClick={() => setSelectedGateId(null)} className="text-[8px] font-bold text-foreground/40 hover:text-foreground uppercase tracking-tighter decoration-dotted underline underline-offset-4">
                          CANCEL EDITING
                      </button>
                  )}
              </motion.div>
          )}
      </AnimatePresence>

      {/* Truck Tooltip */}
      <AnimatePresence>
        {hoveredTruck && (() => {
          const truck = truckDots.find(t => t.id === hoveredTruck);
          if (!truck) return null;
          const leftPct = (truck.cx / SVG_W) * 100;
          const topPct = (truck.cy / SVG_H) * 100;
          return (
            <motion.div key={truck.id} initial={{ opacity: 0, scale: 0.9, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }} className="absolute glass-card-geo px-3 py-2 z-20 pointer-events-none min-w-[140px]"
              style={{ left: `${Math.min(Math.max(leftPct, 10), 80)}%`, top: `${Math.max(topPct - 18, 2)}%`, transform: "translateX(-50%)" }}>
              <div className="flex items-center gap-2 mb-1">
                <TruckIcon size={10} className="text-foreground/50" />
                <span className="text-[10px] font-bold text-foreground">{truck.plate}</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] text-foreground/40">Status: <span className="font-bold" style={{ color: statusColors[truck.status] }}>{truck.status.toUpperCase()}</span></p>
                {truck.booking && <p className="text-[8px] text-foreground/40">Booking: <span className="font-bold text-foreground/60">{truck.booking}</span></p>}
                <p className="text-[8px] text-foreground/40">{truck.fromGate} <ChevronRight size={8} className="inline" /> {truck.toTerminal}</p>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-1 left-1 flex items-center gap-3 text-[8px] text-foreground/30 font-bold uppercase tracking-widest">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            {status}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortMap;
