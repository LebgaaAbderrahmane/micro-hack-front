"use client";

import React, { useState } from "react";
import {
    Truck as TruckIcon,
    User as UserIcon,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Wrench,
    AlertTriangle,
    ChevronRight,
    TrendingUp,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Truck, Driver } from "@/types/fleet";
import { TruckModal } from "@/components/fleet/TruckModal";
import { DriverModal } from "@/components/fleet/DriverModal";
import { useToast } from "@/components/common/Toast";

const mockTrucks: Truck[] = [
    { id: "T01", licensePlate: "TX-992-BK", model: "Volvo FH16", year: 2022, status: "in_transit", lastMaintenance: "2024-01-15", nextMaintenance: "2024-07-15", fuelLevel: 65, mileage: 45000 },
    { id: "T02", licensePlate: "TX-881-AL", model: "Scania R500", year: 2023, status: "active", lastMaintenance: "2024-02-01", nextMaintenance: "2024-08-01", fuelLevel: 82, mileage: 12000 },
    { id: "T03", licensePlate: "TX-773-MN", model: "Mercedes Actros", year: 2021, status: "maintenance", lastMaintenance: "2023-11-20", nextMaintenance: "2024-02-20", fuelLevel: 15, mileage: 120000 },
    { id: "T04", licensePlate: "TX-441-CA", model: "MAN TGX", year: 2022, status: "idle", lastMaintenance: "2024-01-10", nextMaintenance: "2024-07-10", fuelLevel: 95, mileage: 38000 },
];

const mockDrivers: Driver[] = [
    { id: "D01", firstName: "John", lastName: "Doe", licenseNumber: "L-112233", phone: "+1 234 567 890", email: "john.doe@example.com", status: "active", assignedTruckId: "T01", rating: 4.8, totalTrips: 156 },
    { id: "D02", firstName: "Sarah", lastName: "Smith", licenseNumber: "L-445566", phone: "+1 234 567 891", email: "sarah.smith@example.com", status: "active", assignedTruckId: "T02", rating: 4.9, totalTrips: 210 },
    { id: "D03", firstName: "Mike", lastName: "Johnson", licenseNumber: "L-778899", phone: "+1 234 567 892", email: "mike.j@example.com", status: "on_leave", rating: 4.7, totalTrips: 89 },
];

export default function FleetPage() {
    const [activeTab, setActiveTab] = useState<"trucks" | "drivers">("trucks");
    const [searchQuery, setSearchQuery] = useState("");

    const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState<Truck | undefined>();
    const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>();
    const { show } = useToast();

    const openTruckModal = (truck?: Truck) => {
        setSelectedTruck(truck);
        setIsTruckModalOpen(true);
    };

    const openDriverModal = (driver?: Driver) => {
        setSelectedDriver(driver);
        setIsDriverModalOpen(true);
    };

    const filteredTrucks = mockTrucks.filter(t =>
        t.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDrivers = mockDrivers.filter(d =>
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
            case "in_transit":
                return "text-success bg-success/10 border-success/20";
            case "maintenance":
            case "suspended":
                return "text-error bg-error/10 border-error/20";
            case "idle":
            case "on_leave":
                return "text-warning bg-warning/10 border-warning/20";
            default:
                return "text-foreground/40 bg-white/5 border-white/10";
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
                    <p className="text-foreground/50">Track vehicles, drivers, and maintenance schedules.</p>
                </div>
                <button
                    onClick={() => activeTab === "trucks" ? openTruckModal() : openDriverModal()}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Add {activeTab === "trucks" ? "Vehicle" : "Driver"}
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Vehicles" value={mockTrucks.length.toString()} icon={TruckIcon} change="+1 this month" trend="up" />
                <StatCard title="Active Drivers" value={mockDrivers.filter(d => d.status === "active").length.toString()} icon={UserIcon} change="Steady" trend="neutral" />
                <StatCard title="In Transit" value={mockTrucks.filter(t => t.status === "in_transit").length.toString()} icon={Activity} change="+12% volume" trend="up" />
                <StatCard title="Maintenance" value={mockTrucks.filter(t => t.status === "maintenance").length.toString()} icon={Wrench} change="2 urgent" trend="down" />
            </div>

            <div className="glass-card border border-white/5 overflow-hidden">
                {/* Tabs & Search */}
                <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex p-1 bg-white/5 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab("trucks")}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                activeTab === "trucks" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-foreground/40 hover:text-foreground"
                            )}
                        >
                            Vehicles
                        </button>
                        <button
                            onClick={() => setActiveTab("drivers")}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                activeTab === "drivers" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-foreground/40 hover:text-foreground"
                            )}
                        >
                            Drivers
                        </button>
                    </div>

                    <div className="flex gap-4 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => show("Advanced filters coming soon", "info")}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
                        >
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Content Table/Grid */}
                <div className="p-0">
                    {activeTab === "trucks" ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">Vehicle Info</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">Performance</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">Maintenance</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredTrucks.map((truck) => (
                                        <tr key={truck.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/5 group-hover:scale-110 transition-transform">
                                                        <TruckIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground">{truck.licensePlate}</p>
                                                        <p className="text-xs text-foreground/40">{truck.model} ({truck.year})</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn("text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border", getStatusColor(truck.status))}>
                                                    {truck.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2 max-w-[120px]">
                                                    <div className="flex justify-between text-[10px] font-bold">
                                                        <span className="text-foreground/40">Fuel</span>
                                                        <span className={truck.fuelLevel! < 20 ? "text-error" : "text-foreground/60"}>{truck.fuelLevel}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className={cn("h-full transition-all duration-500", truck.fuelLevel! < 20 ? "bg-error" : "bg-primary")} style={{ width: `${truck.fuelLevel}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Wrench size={14} className="text-foreground/20" />
                                                    <span className="text-xs font-medium">{truck.nextMaintenance}</span>
                                                    {new Date(truck.nextMaintenance) < new Date() && <AlertTriangle size={14} className="text-error animate-pulse" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openTruckModal(truck)}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-colors"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {filteredDrivers.map((driver) => (
                                <div key={driver.id} className="glass-card p-6 border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors"></div>

                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors overflow-hidden">
                                                <UserIcon size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{driver.firstName} {driver.lastName}</h3>
                                                <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border", getStatusColor(driver.status))}>
                                                    {driver.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => openDriverModal(driver)}
                                            className="text-foreground/20 hover:text-foreground transition-colors"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block">Assigned Truck</span>
                                            <p className="text-sm font-bold flex items-center gap-2">
                                                <TruckIcon size={14} className="text-primary" />
                                                {driver.assignedTruckId || "None"}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest block">Rating</span>
                                            <p className="text-sm font-bold flex items-center gap-2 text-warning">
                                                ★ {driver.rating}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                                        <div className="text-xs text-foreground/40 font-medium">{driver.totalTrips} Total Trips</div>
                                        <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                            View Profile
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <TruckModal
                isOpen={isTruckModalOpen}
                onClose={() => setIsTruckModalOpen(false)}
                truck={selectedTruck}
            />
            <DriverModal
                isOpen={isDriverModalOpen}
                onClose={() => setIsDriverModalOpen(false)}
                driver={selectedDriver}
            />
        </div>
    );
}

const StatCard = ({ title, value, icon: Icon, change, trend }: { title: string, value: string, icon: any, change: string, trend: "up" | "down" | "neutral" }) => (
    <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
        <div className="flex items-start justify-between">
            <div className="space-y-3">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest block">{title}</span>
                <h3 className="text-3xl font-black tracking-tight">{value}</h3>
                <p className={cn(
                    "text-[10px] font-bold flex items-center gap-1",
                    trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-foreground/40"
                )}>
                    {trend === "up" ? <TrendingUp size={12} /> : trend === "down" ? <AlertTriangle size={12} /> : null}
                    {change}
                </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Icon size={24} />
            </div>
        </div>
    </div>
);
