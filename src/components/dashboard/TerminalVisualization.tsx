"use client";

import React, { } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    Panel,
    MarkerType,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Activity } from "lucide-react";

const TerminalNode = ({ data }: { data: any }) => {
    return (
        <div className="glass-card-geo p-5 border border-border/50 w-[240px] group transition-all duration-500 hover:border-primary/50 hover:shadow-lg backdrop-blur-xl relative overflow-hidden">
            <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-primary !border-none" />

            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        data.utilization > 90 ? "bg-error animate-pulse" :
                            data.utilization > 70 ? "bg-warning" :
                                "bg-success"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{data.type}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        data.utilization > 90 ? "text-error" : "text-primary"
                    )}>
                        {data.utilization}%
                    </span>
                </div>
            </div>

            <h4 className="font-bold text-base mb-4 relative z-10 flex items-center justify-between text-foreground group-hover:text-primary transition-colors">
                {data.label}
                <Activity size={14} className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
            </h4>

            <div className="grid grid-cols-6 gap-1.5 p-2 bg-background/50 rounded-xl border border-border/50 shadow-inner">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-full aspect-square rounded-[3px] shadow-sm transform transition-all duration-700",
                            i < data.count ? data.color : "bg-muted/20"
                        )}
                    />
                ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Queue Size</span>
                    <span className="text-xs font-bold text-foreground/70">{data.inbound || 0} Ships</span>
                </div>
                <div className="text-right">
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider">Active</span>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-primary !border-none" />
        </div>
    );
};



const GateNode = ({ data }: { data: any }) => {
    return (
        <div className="glass-card-geo p-6 border-2 border-primary/40 w-[300px] group transition-all duration-500 hover:border-primary backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/20 transition-all"></div>

            <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Strategic Entry</span>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-3 bg-primary/30 rounded-full" />
                    ))}
                </div>
            </div>

            <h4 className="font-extrabold text-lg mb-4 text-foreground relative z-10">
                {data.label}
            </h4>

            <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                    <span>Flow Rate</span>
                    <span className="text-foreground">840/hr</span>
                </div>
                <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[70%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-foreground/5">
                    <div>
                        <p className="text-[8px] font-black text-foreground/20 uppercase tracking-widest leading-none mb-1">Status</p>
                        <p className="text-[10px] font-black text-success uppercase">Optimal</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-foreground/20 uppercase tracking-widest leading-none mb-1">Security</p>
                        <p className="text-[10px] font-black text-primary uppercase">Active</p>
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-primary !border-none" />
        </div>
    );
};

const nodeTypes = {
    terminal: TerminalNode,
    gate: GateNode,
};

const initialNodes: Node[] = [
    // Source: Gates (Left Side) - Adjusted for tighter centering
    {
        id: 'gate-primary',
        type: 'gate',
        data: { label: 'Strategic Gate 01' },
        position: { x: 50, y: 150 },
    },
    {
        id: 'gate-secondary',
        type: 'gate',
        data: { label: 'Strategic Gate 02' },
        position: { x: 50, y: 450 },
    },
    // Terminals (3x2 Grid on Right Side)
    // Row 1
    {
        id: "t-a1",
        type: "terminal",
        data: {
            label: "Alpha Cluster • 01",
            type: "Container Hub",
            terminalId: "T-001",
            utilization: 42,
            count: 12,
            inbound: 8,
            color: "bg-blue-500 shadow-blue-500/40"
        },
        position: { x: 550, y: 0 },
    },
    {
        id: "t-a2",
        type: "terminal",
        data: {
            label: "Alpha Cluster • 02",
            type: "Bulk Terminal",
            terminalId: "T-002",
            utilization: 94,
            count: 28,
            inbound: 22,
            color: "bg-rose-500 shadow-rose-500/40"
        },
        position: { x: 850, y: 0 },
    },
    {
        id: "t-a3",
        type: "terminal",
        data: {
            label: "Alpha Cluster • 03",
            type: "Liquid Cargo",
            terminalId: "T-003",
            utilization: 12,
            count: 4,
            inbound: 0,
            color: "bg-emerald-500 shadow-emerald-500/40"
        },
        position: { x: 1150, y: 0 },
    },
    // Row 2
    {
        id: "t-b1",
        type: "terminal",
        data: {
            label: "Beta Sector • E1",
            type: "RoRo Terminal",
            terminalId: "T-004",
            utilization: 65,
            count: 19,
            inbound: 5,
            color: "bg-indigo-500 shadow-indigo-500/40"
        },
        position: { x: 550, y: 400 },
    },
    {
        id: "t-b2",
        type: "terminal",
        data: {
            label: "Beta Sector • E2",
            type: "Hazardous Unit",
            terminalId: "T-005",
            utilization: 88,
            count: 26,
            inbound: 14,
            color: "bg-amber-500 shadow-amber-500/40"
        },
        position: { x: 850, y: 400 },
    },
    {
        id: "t-rim-1",
        type: "terminal",
        data: {
            label: "Deep Sea Rim • 01",
            type: "Mega Vessel Berth",
            terminalId: "T-006",
            utilization: 72,
            count: 21,
            inbound: 12,
            color: "bg-violet-500 shadow-violet-500/40"
        },
        position: { x: 1150, y: 400 },
    },
];

const initialEdges: Edge[] = [
    // Gate 1 connections
    { id: "e-g1-a1", source: "gate-primary", target: "t-a1", type: 'smoothstep', animated: true, style: { stroke: "#3B82F6", strokeWidth: 4, opacity: 0.8 } },
    { id: "e-g1-a2", source: "gate-primary", target: "t-a2", type: 'smoothstep', animated: true, style: { stroke: "#EF4444", strokeWidth: 4, opacity: 0.8 } },
    { id: "e-g1-a3", source: "gate-primary", target: "t-a3", type: 'smoothstep', style: { stroke: "#10B981", strokeWidth: 2, strokeDasharray: "10 10", opacity: 0.4 } },
    // Gate 2 connections
    { id: "e-g2-b1", source: "gate-secondary", target: "t-b1", type: 'smoothstep', animated: true, style: { stroke: "#0EA5E9", strokeWidth: 4, opacity: 0.8 } },
    { id: "e-g2-b2", source: "gate-secondary", target: "t-b2", type: 'smoothstep', animated: true, style: { stroke: "#F59E0B", strokeWidth: 4, opacity: 0.8 } },
    { id: "e-g2-r1", source: "gate-secondary", target: "t-rim-1", type: 'smoothstep', animated: false, style: { stroke: "#8B5CF6", strokeWidth: 2, opacity: 0.4 } },
];

import { X, Layers, Box, Calendar as CalendarIcon, MapPin } from "lucide-react";

export const TerminalVisualization = () => {
    const { profile: user } = useAuth();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedTerminal, setSelectedTerminal] = React.useState<any>(null);

    React.useEffect(() => {
        if (!user) return;

        if (user.role === 'OPERATOR') {
            const targetTerminalId = (user as any).terminalId || "T-001";
            const relevantNodes = initialNodes.filter(n =>
                n.type === 'gate' ||
                (n.data as any).terminalId === targetTerminalId
            );
            const nodeIds = new Set(relevantNodes.map(n => n.id));
            const relevantEdges = initialEdges.filter(e =>
                nodeIds.has(e.source) && nodeIds.has(e.target)
            );
            setNodes(relevantNodes);
            setEdges(relevantEdges);
        } else if (user.role === 'ADMIN') {
            setNodes(initialNodes);
            setEdges(initialEdges);
        }
    }, [user, setNodes, setEdges]);

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        if (node.type === 'terminal') {
            setSelectedTerminal(node.data);
        }
    };

    if (user?.role === 'DISPATCHER') return null;

    return (
        <div className="h-[750px] w-full glass-card-geo border-none overflow-hidden relative group transition-colors duration-500">
            {/* Background Architecture */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,var(--color-primary),transparent_50%)] opacity-[0.05]"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,var(--color-error),transparent_50%)] opacity-[0.03]"></div>
                <div className="absolute inset-0 bg-grid-foreground/[0.02] bg-[bottom_1px_center] mask-image-[linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                colorMode={"system" as any}
                minZoom={0.5}
                maxZoom={1}
                nodesDraggable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                panOnScroll={false}
                preventScrolling={false} // Allow page scroll
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--color-primary)" }
                }}
            >
                <Background gap={40} size={1} color="var(--foreground)" className="opacity-[0.05]" />

                <Panel position="top-left" className="m-6 space-y-4 pointer-events-none">
                    <div className="bg-background/80 backdrop-blur-3xl p-5 rounded-3xl border border-foreground/5 shadow-2xl max-w-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
                                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                            </div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Terminal Matrix</h2>
                        </div>
                        <p className="text-[8px] font-black text-foreground/20 ml-6 uppercase tracking-widest leading-none">Intelligence Engine • Active</p>
                    </div>

                    <div className="flex gap-4 ml-2">
                        <div className="px-6 py-3 bg-background/40 backdrop-blur-md rounded-2xl border border-foreground/5 flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                            <span className="text-[11px] font-black text-foreground/40 uppercase tracking-widest">Optimal</span>
                        </div>
                        <div className="px-6 py-3 bg-background/40 backdrop-blur-md rounded-2xl border border-foreground/5 flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></div>
                            <span className="text-[11px] font-black text-foreground/40 uppercase tracking-widest">Congested</span>
                        </div>
                    </div>
                </Panel>

                <Panel position="bottom-right" className="m-6">
                    <div className="bg-background/40 backdrop-blur-3xl px-5 py-3 rounded-2xl border border-foreground/5 text-[9px] font-black tracking-[0.2em] text-foreground/40 uppercase shadow-xl transition-all hover:bg-background/60">
                        Node Selection Active
                    </div>
                </Panel>
            </ReactFlow>

            {/* Slot Card / Modal - Reduced size */}
            {selectedTerminal && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                    <div className="pointer-events-auto w-full max-w-md bg-background/95 backdrop-blur-3xl border border-foreground/10 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={cn("w-2 h-2 rounded-full animate-pulse", selectedTerminal.color.split(' ')[0])}></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{selectedTerminal.type}</span>
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter text-foreground">{selectedTerminal.label}</h3>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedTerminal(null); }}
                                    className="p-2.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-foreground/[0.02] rounded-2xl border border-foreground/5">
                                    <div className="flex items-center gap-2 mb-2 text-primary opacity-60">
                                        <Layers size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Load</span>
                                    </div>
                                    <p className="text-xl font-black text-foreground">{selectedTerminal.utilization}%</p>
                                </div>
                                <div className="p-4 bg-foreground/[0.02] rounded-2xl border border-foreground/5">
                                    <div className="flex items-center gap-2 mb-2 text-secondary opacity-60">
                                        <Box size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Slots</span>
                                    </div>
                                    <p className="text-xl font-black text-foreground">{selectedTerminal.count}/30</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">Yard Grid</h4>
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
                                                    : "bg-foreground/5 text-foreground/10 border-foreground/5"
                                            )}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    Optimize
                                </button>
                                <button className="w-12 h-12 flex items-center justify-center bg-foreground/5 text-foreground rounded-2xl hover:bg-foreground/10 transition-all">
                                    <MapPin size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
