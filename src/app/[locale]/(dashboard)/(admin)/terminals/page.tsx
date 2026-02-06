"use client";

import React, { useState } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Activity,
    Users,
    Settings,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    BarChart2
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useToast } from "@/components/common/Toast";

interface Terminal {
    id: number;
    name: string;
    location: string;
    status: string;
    utilization: number;
    capacity: number;
    operator: string;
}

const TerminalCard = ({ terminal }: { terminal: Terminal }) => {
    const { show } = useToast();
    const statusColors = {
        active: "text-primary bg-primary/10 border-primary/20",
        maintenance: "text-accent bg-accent/10 border-accent/20",
        inactive: "text-error bg-error/10 border-error/20"
    };

    return (
        <div className="glass-card p-6 border border-foreground/5 hover:border-foreground/10 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{terminal.name}</h3>
                        <p className="text-xs text-foreground/40">{terminal.location}</p>
                    </div>
                </div>
                <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    statusColors[terminal.status as keyof typeof statusColors]
                )}>
                    {terminal.status}
                </span>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-foreground/40 font-medium">Utilization</span>
                        <span className="font-bold">{terminal.utilization}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                terminal.utilization > 90 ? "bg-error" : terminal.utilization > 70 ? "bg-accent" : "bg-primary"
                            )}
                            style={{ width: `${terminal.utilization}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-foreground/5">
                    <div>
                        <span className="text-[10px] text-foreground/30 font-bold uppercase block">Capacity</span>
                        <span className="text-sm font-bold">{terminal.capacity} Slot/hr</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-foreground/30 font-bold uppercase block">Operator</span>
                        <span className="text-sm font-bold truncate">{terminal.operator || "None"}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <button
                    onClick={() => show(`Opening configuration for ${terminal.name}`, "info")}
                    className="flex-1 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-bold transition-colors"
                >
                    Edit Settings
                </button>
                <button
                    onClick={() => show("More options coming soon", "info")}
                    className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-colors"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>
        </div>
    );
};

export default function TerminalsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { show } = useToast();

    const terminals = [
        { id: 1, name: "Terminal North", location: "Gate A-1, North Port", status: "active", utilization: 92, capacity: 45, operator: "John Smith" },
        { id: 2, name: "Terminal South", location: "Gate B-4, South Port", status: "active", utilization: 45, capacity: 60, operator: "Sarah Wilson" },
        { id: 3, name: "Terminal West", location: "Gate C-2, West Logistics", status: "maintenance", utilization: 0, capacity: 30, operator: "None" },
        { id: 4, name: "Export Hub Alpha", location: "Sector 7, Global Gate", status: "active", utilization: 78, capacity: 120, operator: "Mike Ross" },
        { id: 5, name: "Liquids Wharf", location: "Pier 12, Terminal East", status: "inactive", utilization: 0, capacity: 15, operator: "None" },
        { id: 6, name: "Container Yard 4", location: "Gate D-1, Central Port", status: "active", utilization: 62, capacity: 200, operator: "Emma V" },
    ];

    const filteredTerminals = terminals.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Terminal Management</h1>
                    <p className="text-foreground/50 text-sm mt-1">Configure terminal nodes, assign operators, and monitor capacity.</p>
                </div>
                <button
                    onClick={() => show("Terminal creation form will appear here", "info")}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 leading-none"
                >
                    <Plus size={20} />
                    New Terminal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 border border-foreground/5 flex flex-col justify-between overflow-hidden relative group">
                    <div className="flex justify-between items-start">
                        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                            <Activity size={24} />
                        </div>
                        <span className="text-xs font-bold text-primary">+2 New Today</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Active Nodes</p>
                        <h3 className="text-3xl font-black mt-1">42</h3>
                    </div>
                    <BarChart2 className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors" />
                </div>

                <div className="glass-card p-6 border border-foreground/5 flex flex-col justify-between overflow-hidden relative group">
                    <div className="flex justify-between items-start">
                        <div className="bg-accent/10 p-3 rounded-2xl text-accent">
                            <AlertTriangle size={24} />
                        </div>
                        <span className="text-xs font-bold text-accent">3 Maintenance</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Congested Zones</p>
                        <h3 className="text-3xl font-black mt-1">5</h3>
                    </div>
                    <AlertTriangle className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-accent/5 -rotate-12 group-hover:text-accent/10 transition-colors" />
                </div>

                <div className="glass-card p-6 border border-foreground/5 flex flex-col justify-between overflow-hidden relative group">
                    <div className="flex justify-between items-start">
                        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                            <CheckCircle2 size={24} />
                        </div>
                        <span className="text-xs font-bold text-primary">94.2%</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">SLA Compliance</p>
                        <h3 className="text-3xl font-black mt-1">Good</h3>
                    </div>
                    <CheckCircle2 className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors" />
                </div>

                <div className="glass-card p-6 border border-foreground/5 flex flex-col justify-between overflow-hidden relative group">
                    <div className="flex justify-between items-start">
                        <div className="bg-foreground/5 p-3 rounded-2xl text-foreground">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-foreground/40">12 Pending</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Total Staff</p>
                        <h3 className="text-3xl font-black mt-1">1,280</h3>
                    </div>
                    <Users className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-foreground/5 -rotate-12 group-hover:text-foreground/10 transition-colors" />
                </div>
            </div>

            <div className="flex items-center gap-4 py-2 border-b border-foreground/5">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                    <input
                        type="text"
                        placeholder="Search terminals by name, location or ID..."
                        className="w-full bg-foreground/5 border border-foreground/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-bold">
                    <Settings size={18} />
                    Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTerminals.map(terminal => (
                    <TerminalCard key={terminal.id} terminal={terminal} />
                ))}
            </div>

            {filteredTerminals.length === 0 && (
                <div className="py-20 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/20">
                        <Search size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl">No terminals found</h3>
                        <p className="text-foreground/40">Try adjusting your search filters.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
