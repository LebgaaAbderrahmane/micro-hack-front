"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend, AreaChart, Area,
  PieChart, Pie
} from "recharts";
import { 
  Calendar, Filter, Download, TrendingUp, Users, Ship, 
  Truck, ArrowUpRight, ArrowDownRight, Clock, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ActionBar/SearchInput";
import { FilterButton, ExportButton } from "@/components/ActionBar/ActionButtons";
import { FiltersPanel } from "@/components/Filters/FiltersPanel";

// Mock data for analytics
const throughputData = [
  { name: "Mon", containers: 400, vessels: 24 },
  { name: "Tue", containers: 300, vessels: 18 },
  { name: "Wed", containers: 200, vessels: 15 },
  { name: "Thu", containers: 278, vessels: 20 },
  { name: "Fri", containers: 189, vessels: 12 },
  { name: "Sat", containers: 239, vessels: 16 },
  { name: "Sun", containers: 349, vessels: 22 },
];

const efficiencyData = [
  { name: "06:00", value: 85 },
  { name: "09:00", value: 72 },
  { name: "12:00", value: 65 },
  { name: "15:00", value: 88 },
  { name: "18:00", value: 92 },
  { name: "21:00", value: 78 },
];

export default function AnalyticsPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [search, setSearch] = useState("");

    const handleApplyFilters = (filters: any) => {
        console.log("Applying filters:", filters);
        setIsFilterOpen(false);
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1240px] mx-auto py-10 min-h-screen px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Hub</h1>
                    <p className="text-foreground/50 text-sm">Real-time performance metrics and historical trends</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <SearchInput value={search} onChange={setSearch} />
                    <div className="relative">
                        <FilterButton onClick={() => setIsFilterOpen(!isFilterOpen)} />
                        <FiltersPanel 
                            isOpen={isFilterOpen} 
                            onClose={() => setIsFilterOpen(false)} 
                            onApply={handleApplyFilters} 
                        />
                    </div>
                    <ExportButton onClick={() => {}} />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Daily Throughput", value: "1,248", change: "+12.5%", icon: Ship, trend: "up" },
                    { label: "Gate Occupancy", value: "68%", change: "-3.2%", icon: Truck, trend: "down" },
                    { label: "Avg. Turnaround", value: "42m", change: "+5.1%", icon: Clock, trend: "up" },
                    { label: "Active Operators", value: "24", change: "Stable", icon: Users, trend: "neutral" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card-geo p-5 flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <stat.icon size={20} />
                            </div>
                            <div className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                stat.trend === "up" ? "bg-success/10 text-success" : 
                                stat.trend === "down" ? "bg-error/10 text-error" : "bg-foreground/10 text-foreground/50"
                            )}>
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card-geo p-6 min-h-[400px]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                            <TrendingUp size={18} className="text-primary" />
                            Vessel & Container Throughput
                        </h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={throughputData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                                    itemStyle={{ fontSize: "12px" }}
                                />
                                <Legend />
                                <Bar dataKey="containers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="vessels" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card-geo p-6 min-h-[400px]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                            <Activity size={18} className="text-success" />
                            Efficiency Heatmap
                        </h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={efficiencyData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

