"use client";

import React, { useState, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    useNodesState,
    useEdgesState,
    MarkerType,
    Node,
    Edge,
    Handle,
    Position,
    BaseEdge,
    getSmoothStepPath,
    EdgeProps
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { X, Layers, Box, Calendar as CalendarIcon, MapPin, Activity, Lock } from "lucide-react";

// CSS for the animated truck effect
// In a real application, this would typically be in a global CSS file or a CSS module.
// For this exercise, it's placed here for completeness as per instruction.
const globalEdgeStyles = `
@keyframes dashoffset-animation {
    to {
        stroke-dashoffset: 0;
    }
}

.animated-truck {
    stroke-dashoffset: 120; /* Initial offset for the dash array */
    animation: dashoffset-animation 2s linear infinite;
}
`;

const TerminalNode = ({ data }: { data: any }) => {
    return (
        <div className="bg-white/90 backdrop-blur-xl p-5 border border-slate-200 w-[240px] rounded-[1.25rem] group transition-all duration-500 hover:border-primary/50 hover:shadow-sm relative overflow-hidden shadow-sm">
            <Handle type="target" position={Position.Bottom} className="!w-2 !h-2 !bg-primary !border-none" />

            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>

            <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        data.utilization > 90 ? "bg-error animate-pulse" :
                            data.utilization > 70 ? "bg-warning" :
                                "bg-success"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{data.type}</span>
                </div>
                <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    data.utilization > 80 ? "text-error" : "text-primary"
                )}>
                    {data.utilization}%
                </span>
            </div>

            <h4 className="font-bold text-sm mb-3 relative z-10 flex items-center justify-between text-slate-900 group-hover:text-primary transition-colors">
                {data.label}
                <Activity size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
            </h4>

            <div className="grid grid-cols-6 gap-1 p-1 bg-slate-50 rounded-lg border border-slate-100">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-full aspect-square rounded-[2px]",
                            i < data.count ? data.color : "bg-slate-200"
                        )}
                    />
                ))}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Inbound: {data.inbound}</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-wider">T-SYNC</span>
            </div>
        </div>
    );
};

const GateNode = ({ data }: { data: any }) => {
    return (
        <div className="bg-white/95 backdrop-blur-2xl p-6 border-2 border-slate-300 w-[280px] rounded-[1.5rem] group transition-all duration-500 hover:border-primary hover:shadow-md relative overflow-hidden shadow-lg">
            {/* Barrier Visual */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                <div className="h-full bg-primary/40 w-full animate-pulse"></div>
            </div>

            <div className="flex items-center justify-between mb-4 mt-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                        <Lock size={18} className="group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Access Point</span>
                        <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">
                            {data.label}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Gate Barrier Simulation */}
            <div className="flex gap-1.5 mb-4 px-1">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-1 h-6 bg-slate-50 border border-slate-200 rounded-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary opacity-20 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700" style={{ transitionDelay: `${i * 50}ms` }}></div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status: Open</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                </div>
            </div>

            <Handle type="source" position={Position.Top} className="!w-2 !h-2 !bg-primary !border-none" />
        </div>
    );
};

const TruckEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}: EdgeProps) => {
    const [path] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetPosition,
        targetX,
        targetY,
        borderRadius: 20,
    });

    return (
        <>
            {/* The persistent dashed conduit (lane) */}
            <path
                id={id + '-bg'}
                style={{ ...style, strokeDasharray: '6 4', opacity: 0.3, strokeWidth: 2 }}
                className="react-flow__edge-path"
                d={path}
                markerEnd={markerEnd}
            />
            {/* The high-velocity trucks */}
            <path
                id={id + '-truck'}
                style={{
                    ...style,
                    strokeDasharray: '1 60',
                    strokeLinecap: 'round',
                    strokeWidth: 10,
                    animation: 'truck-flow 1.5s linear infinite',
                    filter: `drop-shadow(0 0 4px ${style.stroke})`,
                }}
                className="react-flow__edge-path"
                d={path}
            />
        </>
    );
};

const nodeTypes = {
    terminal: TerminalNode,
    gate: GateNode,
};

const edgeTypes = {
    truck: TruckEdge,
};

const initialNodes: Node[] = [
    // 5 Terminals positioned at the top
    {
        id: 't1',
        type: 'terminal',
        position: { x: 0, y: 0 },
        data: { label: 'T-North 01', type: 'High Priority', utilization: 94, count: 28, inbound: 12, color: "bg-error" }
    },
    {
        id: 't2',
        type: 'terminal',
        position: { x: 280, y: 0 },
        data: { label: 'T-West 02', type: 'Standard', utilization: 45, count: 14, inbound: 4, color: "bg-primary" }
    },
    {
        id: 't3',
        type: 'terminal',
        position: { x: 560, y: 0 },
        data: { label: 'T-Central 03', type: 'Automated', utilization: 78, count: 23, inbound: 8, color: "bg-secondary" }
    },
    {
        id: 't4',
        type: 'terminal',
        position: { x: 840, y: 0 },
        data: { label: 'T-East 04', type: 'Bulk Cargo', utilization: 32, count: 10, inbound: 2, color: "bg-accent" }
    },
    {
        id: 't5',
        type: 'terminal',
        position: { x: 1120, y: 0 },
        data: { label: 'T-South 05', type: 'Hazmat', utilization: 88, count: 26, inbound: 15, color: "bg-error" }
    },

    // 2 Gates positioned at the bottom
    {
        id: 'g1',
        type: 'gate',
        position: { x: 350, y: 550 },
        data: { label: 'Secure Gate Alpha' }
    },
    {
        id: 'g2',
        type: 'gate',
        position: { x: 770, y: 550 },
        data: { label: 'Secure Gate Bravo' }
    },
];

const initialEdges: Edge[] = [
    // Gate Alpha (West/North Sector)
    { id: 'eg1-t1', source: 'g1', target: 't1', type: 'truck', style: { stroke: '#EF4444' } },
    { id: 'eg1-t2', source: 'g1', target: 't2', type: 'truck', style: { stroke: '#3B82F6' } },
    { id: 'eg1-t3', source: 'g1', target: 't3', type: 'truck', style: { stroke: '#3B82F6' } },

    // Gate Bravo (East/South Sector)
    { id: 'eg2-t3', source: 'g2', target: 't3', type: 'truck', style: { stroke: '#3B82F6' } },
    { id: 'eg2-t4', source: 'g2', target: 't4', type: 'truck', style: { stroke: '#3B82F6' } },
    { id: 'eg2-t5', source: 'g2', target: 't5', type: 'truck', style: { stroke: '#EF4444' } },
];

export const TerminalVisualization = () => {
    const { user } = useAuthStore();
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);
    const [selectedTerminal, setSelectedTerminal] = useState<any>(null);

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        if (node.type === 'terminal') {
            setSelectedTerminal(node.data);
        }
    };

    if (user?.role === 'carrier') return null;

    return (
        <div className="h-[750px] w-full glass-card border border-slate-200 overflow-hidden relative group bg-slate-50 transition-all duration-500 shadow-inner flex flex-col">
            {/* External Header - Operational Telemetry */}
            <div className="px-8 py-6 border-b border-slate-200 bg-white/50 backdrop-blur-md flex items-center justify-between relative z-20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
                            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary"></div>
                        </div>
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 leading-none mb-1">Operational Matrix</h2>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Autonomous Freight Orchestration</p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200"></div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-error"></div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Congested Path</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fluid Flow</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/5 px-4 py-2 rounded-xl border border-slate-200/50 flex items-center gap-3">
                    <div className="flex -space-x-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1.5 h-3 bg-primary/20 rounded-full"></div>
                        ))}
                    </div>
                    <span className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase">Live Telemetry Active</span>
                </div>
            </div>

            <div className="flex-1 w-full relative">
                {/* Background Architecture */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,var(--color-primary),transparent_50%)] opacity-[0.06]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,var(--color-secondary),transparent_50%)] opacity-[0.04]"></div>
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    colorMode="light"
                    className="bg-transparent"
                    minZoom={0.2}
                    maxZoom={1}
                    nodesDraggable={true}
                    panOnDrag={true}
                    zoomOnScroll={false}
                    panOnScroll={false}
                    preventScrolling={false}
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                        markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" }
                    }}
                >
                    <Background gap={40} size={1} color="#cbd5e1" className="opacity-[0.1]" />
                </ReactFlow>
            </div>

            {/* Selected Terminal Detail Slot */}
            {selectedTerminal && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                    <div className="pointer-events-auto w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={cn("w-2 h-2 rounded-full animate-pulse", selectedTerminal.color)}></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{selectedTerminal.type}</span>
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter text-slate-900">{selectedTerminal.label}</h3>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedTerminal(null); }}
                                    className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-500"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2 text-primary opacity-60">
                                        <Layers size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Current Load</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">{selectedTerminal.utilization}%</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2 text-secondary opacity-60">
                                        <Box size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Stored Units</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">{selectedTerminal.count}/30</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Yard Grid</h4>
                                    <span className="text-[8px] font-black text-primary uppercase">Optimized</span>
                                </div>
                                <div className="grid grid-cols-10 gap-1.5">
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "aspect-square rounded-md border flex items-center justify-center text-[7px] font-black transition-all",
                                                i < selectedTerminal.count
                                                    ? `${selectedTerminal.color} text-white border-transparent`
                                                    : "bg-slate-100 text-slate-300 border-slate-100"
                                            )}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                                    Optimize Operations
                                </button>
                                <button className="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
                                    <MapPin size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
