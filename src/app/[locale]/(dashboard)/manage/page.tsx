"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Search,
    Plus,
    Users,
    Ship,
    Bot,
    Pencil,
    Trash2,
    Settings,
    CirclePlay,
    CirclePause,
    CheckCircle2,
    Clock,
    LayoutDashboard,
    X,
    UserPlus,
    Save,
    DoorOpen
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { terminalsService, gatesService } from "@/services/infrastructure.service";
import { usersService } from "@/services/user.service";
=import { aiAgentsService } from "@/services/system.service";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { getGates, addGate } from "../(admin)/gates/actions";
import { getUsers, addOperator } from "../(admin)/users/actions";

// --- Types ---

type UserStatus = "Active" | "Inactive";
type UserRole = "Admin" | "Operator" | "Carrier";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastActive: string;
}

type TerminalStatus = "Operational" | "Maintenance" | "Offline";

interface TerminalData {
    id: string;
    name: string;
    location: string;
    capacity: number;
    load: number;
    status: TerminalStatus;
}

type GateStatus = "OPERATIONAL" | "CLOSED" | "MAINTENANCE";

interface GateData {
    id: string;
    number: string;
    capacity: number;
    status: GateStatus;
    lastSync: string;
}

export default function ManagePage() {
    const [activeTab, setActiveTab] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Data states
    const [users, setUsers] = useState<UserData[]>([]);
    const [terminals, setTerminals] = useState<TerminalData[]>([]);
    const [gates, setGates] = useState<GateData[]>([]);

    // Selection states
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);
    const [selectedGates, setSelectedGates] = useState<string[]>([]);

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Form states
    const [newItemName, setNewItemName] = useState("");
    const [newItemDetail, setNewItemDetail] = useState("");
    const [newItemEmail, setNewItemEmail] = useState("");
    const [newItemPassword, setNewItemPassword] = useState("");

    const fetchTabData = async (tab: string) => {
        setIsLoading(true);
        try {
            if (tab === "users") {
                const usersRes = await getUsers();
                const rawData = usersRes.data || [];
                setUsers(rawData.map((u: any) => ({
                    id: u.id,
                    name: u.username || "Unknown",
                    email: u.email || `${u.username || 'user'}@acps.dz`,
                    role: u.role === 'ADMIN' ? 'Admin' : u.role === 'OPERATOR' ? 'Operator' : 'Carrier',
                    status: 'Active',
                    lastActive: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Unknown'
                })));
            } else if (tab === "terminals") {
                const res = await terminalsService.getAll();
                const rawData = res.data || [];
                setTerminals(rawData.map((t: any) => ({
                    id: t.id,
                    name: t.zone_name,
                    location: t.zone_code,
                    capacity: t.total_capacity,
                    load: t.current_occupancy || 0,
                    status: "Operational"
                })));
            } else if (tab === "gates") {
                const res = await getGates();
                const rawData = res.data || [];
                setGates(rawData.map((g: any) => ({
                    id: g.id,
                    number: g.gate_number,
                    capacity: g.physical_capacity || 0,
                    status: g.gate_status as GateStatus,
                    lastSync: g.modified_at ? new Date(g.modified_at).toLocaleTimeString() : "Never"
                })));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTabData(activeTab);
    }, [activeTab]);

    // --- Actions ---

    const handleToggleSelection = (id: string, type: "users" | "terminals" | "gates") => {
        if (type === "users") {
            setSelectedUsers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        } else if (type === "terminals") {
            setSelectedTerminals(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        } else if (type === "gates") {
            setSelectedGates(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        }
    };

    const handleToggleAll = (type: "users" | "terminals" | "gates") => {
        if (type === "users") {
            setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));
        } else if (type === "terminals") {
            setSelectedTerminals(selectedTerminals.length === filteredTerminals.length ? [] : filteredTerminals.map(t => t.id));
        } else if (type === "gates") {
            setSelectedGates(selectedGates.length === filteredGates.length ? [] : filteredGates.map(g => g.id));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        setIsLoading(true);
        try {
            if (activeTab === "users") {
                await usersService.delete(id);
            } else if (activeTab === "terminals") {
                await terminalsService.delete(id);
            } else if (activeTab === "gates") {
                await gatesService.delete(id);
            }
            toast.success("Deleted successfully");
            fetchTabData(activeTab);
        } catch (error) {
            toast.error("Delete failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem({
            id: item.id,
            name: item.name || item.number || "",
            detail: item.email || item.location || item.status || "",
        });
        setIsEditOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingItem) return;
        setIsLoading(true);
        try {
            if (activeTab === "users") {
                await usersService.update(editingItem.id, { username: editingItem.name });
            } else if (activeTab === "terminals") {
                await terminalsService.update(editingItem.id, { zone_name: editingItem.name, zone_code: editingItem.detail });
            } else if (activeTab === "gates") {
                await gatesService.update(editingItem.id, { gate_number: editingItem.name, gate_status: editingItem.detail as GateStatus });
            }
            toast.success("Updated successfully");
            setIsEditOpen(false);
            fetchTabData(activeTab);
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            if (activeTab === "users") {
                const formData = new FormData();
                formData.append("username", newItemName);
                formData.append("email", newItemEmail);
                formData.append("password", newItemPassword);
                await addOperator(formData);
                toast.success("Operator created and email notification sent");
            } else if (activeTab === "terminals") {
                await terminalsService.create({
                    zone_name: newItemName,
                    zone_code: newItemDetail,
                    total_capacity: 100,
                    port_id: "PORT_001"
                });
                toast.success("Terminal added");
            } else if (activeTab === "gates") {
                const formData = new FormData();
                formData.append("gateVolume", newItemName);
                formData.append("capacity", newItemDetail);
                formData.append("port_id", "PORT_001");
                await addGate(formData);
                toast.success("Gate added successfully");
            }
            fetchTabData(activeTab);
            setNewItemName("");
            setNewItemDetail("");
            setNewItemEmail("");
            setNewItemPassword("");
            setIsAddOpen(false);
        } catch (error: any) {
            console.error("Add error:", error);
            toast.error(error.message || "Failed to add entry");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleGateStatus = async (gate: GateData) => {
        const newStatus: GateStatus = gate.status === "OPERATIONAL" ? "CLOSED" : "OPERATIONAL";
        try {
            await gatesService.update(gate.id, { gate_status: newStatus });
            toast.success(`Gate ${gate.number} is now ${newStatus}`);
            fetchTabData("gates");
        } catch (error) {
            toast.error("Failed to toggle gate status");
        }
    };

    // --- Filter Logic ---
    const filteredUsers = useMemo(() => {
        const res = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return res;
    }, [users, searchTerm]);

    const filteredTerminals = useMemo(() => {
        const res = terminals.filter(terminal =>
            terminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            terminal.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return res;
    }, [terminals, searchTerm]);

    const filteredGates = useMemo(() => gates.filter(gate =>
        gate.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gate.status?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [gates, searchTerm]);

    // --- Header Components ---
    const RoleBadge = ({ role }: { role: UserRole }) => {
        const roles: Record<UserRole, string> = {
            Admin: "bg-tile-blue",
            Operator: "bg-emerald-500", // explicitly green
            Carrier: "bg-accent",
        };
        return (
            <Badge className={cn("text-white font-medium text-xs px-2.5 py-0.5 border-none shadow-none font-poppins", roles[role])}>
                {role}
            </Badge>
        );
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let colorClass = "bg-slate-400";
        if (status === "Active" || status === "Operational" || status === "OPERATIONAL") colorClass = "bg-success";
        if (status === "Maintenance" || status === "MAINTENANCE") colorClass = "bg-warning";
        if (status === "Offline" || status === "CLOSED") colorClass = "bg-error";

        return (
            <Badge className={cn("text-white font-medium text-xs px-2.5 py-0.5 border-none shadow-none font-poppins", colorClass)}>
                {status}
            </Badge>
        );
    };

    const ProgressBar = ({ value, max }: { value: number; max: number }) => {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));
        let barColor = "bg-warning";
        if (percentage < 70) barColor = "bg-success";
        if (percentage > 90) barColor = "bg-error";

        return (
            <div className="w-full max-w-[140px] flex items-center gap-3">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full transition-all duration-500 rounded-full", barColor)}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-[11px] font-bold text-slate-500 w-8">{Math.round(percentage)}%</span>
            </div>
        );
    };

    return (
        <div
            className="flex flex-col gap-6 w-full max-w-[1080px] mx-auto py-8 px-6 min-h-screen relative"
        >

            {/* Header - Consistent with Analytics */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2 px-1">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 font-poppins tracking-tight">
                        Operations Suite
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            Management
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Configure network entities, user permissions and gate protocols</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-tile-blue hover:bg-tile-blue/90 text-white px-6 h-11 gap-2 font-poppins font-bold text-xs rounded-xl shadow-lg shadow-tile-blue/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Register {activeTab === "users" ? "Operator" : activeTab === "terminals" ? "Terminal" : "Gate"}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-100/50 dark:bg-slate-800/20 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/40 backdrop-blur-sm">
                    <TabsList className="bg-transparent h-auto p-0 gap-1.5 flex justify-start">
                        <TabsTrigger
                            value="users"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-800 border border-transparent rounded-xl px-5 py-2.5 flex items-center gap-2.5 text-slate-500 data-[state=active]:text-foreground font-poppins font-semibold text-sm transition-all"
                        >
                            <Users size={16} className="text-primary" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger
                            value="terminals"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-800 border border-transparent rounded-xl px-5 py-2.5 flex items-center gap-2.5 text-slate-500 data-[state=active]:text-foreground font-poppins font-semibold text-sm transition-all"
                        >
                            <Ship size={16} className="text-indigo-500" />
                            Terminals
                        </TabsTrigger>
                        <TabsTrigger
                            value="gates"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-800 border border-transparent rounded-xl px-5 py-2.5 flex items-center gap-2.5 text-slate-500 data-[state=active]:text-foreground font-poppins font-semibold text-sm transition-all"
                        >
                            <DoorOpen size={16} className="text-amber-500" />
                            Gates
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative min-w-[320px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <Input
                            placeholder={`Search through ${activeTab} data...`}
                            className="pl-11 h-11 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm rounded-xl font-poppins shadow-sm focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-100/40 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                            <TableRow className="hover:bg-transparent h-12">
                                <TableHead className="w-[60px] text-center">
                                    <Checkbox
                                        checked={
                                            activeTab === "users" ? (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) :
                                                activeTab === "terminals" ? (selectedTerminals.length === filteredTerminals.length && filteredTerminals.length > 0) :
                                                    (selectedGates.length === filteredGates.length && filteredGates.length > 0)
                                        }
                                        onCheckedChange={() => handleToggleAll(activeTab as any)}
                                        className="rounded-md border-slate-300"
                                    />
                                </TableHead>

                                {activeTab === "users" && (
                                    <>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">User Identity</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">Email Address</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-center">Role</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-center">Status</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-center">Last Active</TableHead>
                                    </>
                                )}

                                {activeTab === "terminals" && (
                                    <>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">Terminal Zone</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">Zone Code</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-center">Capacity</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">Real-time Load</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-center">Protocol</TableHead>
                                    </>
                                )}

                                {activeTab === "gates" && (
                                    <>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">Gate Identifier</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-center">Max Throughput</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-center">Status</TableHead>
                                        <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-center">Last Pulse</TableHead>
                                    </>
                                )}

                                <TableHead className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-right pr-6">Management</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeTab === "users" && filteredUsers.map((user) => (
                                <TableRow key={user.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-800/60 h-16">
                                    <TableCell className="text-center font-poppins">
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => handleToggleSelection(user.id, "users")}
                                            className="rounded-md border-slate-300"
                                        />
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-700 dark:text-slate-200 font-poppins text-sm">{user.name}</TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400 font-medium font-poppins text-sm">{user.email}</TableCell>
                                    <TableCell className="text-center"><RoleBadge role={user.role} /></TableCell>
                                    <TableCell className="text-center"><StatusBadge status={user.status} /></TableCell>
                                    <TableCell className="text-center text-slate-500 dark:text-slate-400 text-xs font-medium font-poppins tracking-tight">{user.lastActive}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="h-9 w-9 text-slate-400 hover:bg-tile-blue/10 hover:text-tile-blue transition-colors rounded-lg">
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="h-9 w-9 text-slate-400 hover:bg-error/10 hover:text-error transition-colors rounded-lg">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {activeTab === "terminals" && filteredTerminals.map((terminal) => (
                                <TableRow key={terminal.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-800/60 h-16">
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={selectedTerminals.includes(terminal.id)}
                                            onCheckedChange={() => handleToggleSelection(terminal.id, "terminals")}
                                            className="rounded-md border-slate-300"
                                        />
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-700 dark:text-slate-200 font-poppins text-sm">{terminal.name}</TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded inline-block mt-4 ml-4">{terminal.location}</TableCell>
                                    <TableCell className="text-center font-bold text-slate-700 dark:text-slate-300 font-poppins">{terminal.capacity}</TableCell>
                                    <TableCell><ProgressBar value={terminal.load} max={terminal.capacity} /></TableCell>
                                    <TableCell className="text-center"><StatusBadge status={terminal.status} /></TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(terminal)} className="h-9 w-9 text-slate-400 hover:bg-tile-blue/10 hover:text-tile-blue transition-colors rounded-lg">
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(terminal.id)} className="h-9 w-9 text-slate-400 hover:bg-error/10 hover:text-error transition-colors rounded-lg">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {activeTab === "gates" && filteredGates.map((gate) => (
                                <TableRow key={gate.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-slate-100 dark:border-slate-800/60 h-16">
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={selectedGates.includes(gate.id)}
                                            onCheckedChange={() => handleToggleSelection(gate.id, "gates")}
                                            className="rounded-md border-slate-300"
                                        />
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-700 dark:text-slate-200 font-poppins text-sm">{gate.number}</TableCell>
                                    <TableCell className="text-center font-bold text-slate-700 dark:text-slate-300 font-poppins">{gate.capacity}</TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleGateStatus(gate)}
                                            className="p-0 hover:bg-transparent"
                                        >
                                            <StatusBadge status={gate.status} />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-center text-slate-500 dark:text-slate-400 text-[10px] font-bold font-poppins tracking-tighter uppercase">{gate.lastSync}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(gate)} className="h-9 w-9 text-slate-400 hover:bg-tile-blue/10 hover:text-tile-blue transition-colors rounded-lg">
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(gate.id)} className="h-9 w-9 text-slate-400 hover:bg-error/10 hover:text-error transition-colors rounded-lg">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {((activeTab === "users" && filteredUsers.length === 0) ||
                                (activeTab === "terminals" && filteredTerminals.length === 0) ||
                                (activeTab === "gates" && filteredGates.length === 0)) && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-slate-400 font-poppins italic">
                                            No {activeTab} matching your search filter.
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </div>
            </Tabs>

            {/* Add Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl p-8 gap-6 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-poppins tracking-tight">Register {activeTab === "users" ? "Operator" : activeTab === "terminals" ? "Terminal" : "Gate"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        {activeTab === "users" ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Operator Name</label>
                                    <Input
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder="term_op_01"
                                        className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-10 font-poppins placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Operator Email</label>
                                    <Input
                                        value={newItemEmail}
                                        onChange={(e) => setNewItemEmail(e.target.value)}
                                        placeholder="operator@terminal.com"
                                        className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-10 font-poppins placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Temporary Password</label>
                                    <Input
                                        type="password"
                                        value={newItemPassword}
                                        onChange={(e) => setNewItemPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-10 font-poppins placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Name</label>
                                    <Input
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder={activeTab === "terminals" ? "Zone A-1" : "G-1"}
                                        className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-10 font-poppins"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                                        {activeTab === "terminals" ? "Zone Code" : "Capacity"}
                                    </label>
                                    <Input
                                        value={newItemDetail}
                                        onChange={(e) => setNewItemDetail(e.target.value)}
                                        placeholder={activeTab === "terminals" ? "NORTH" : "15"}
                                        className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-10 font-poppins"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full font-poppins font-bold text-xs px-6 h-10">Cancel</Button>
                        <Button onClick={handleAdd} className="bg-tile-blue text-white rounded-full font-poppins font-bold text-xs px-6 h-10">Create Entry</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl p-8 gap-6 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-poppins tracking-tight">Edit Details</DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Name</label>
                                <Input
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-10 font-poppins"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {activeTab === "users" ? "Email" : activeTab === "terminals" ? "Location" : "Status"}
                                </label>
                                <Input
                                    value={editingItem.detail}
                                    onChange={(e) => setEditingItem({ ...editingItem, detail: e.target.value })}
                                    placeholder="Details..."
                                    className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-10 font-poppins placeholder:text-slate-400 dark:placeholder:text-slate-500 text-foreground"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-full font-poppins font-bold text-xs px-6 h-10">Cancel</Button>
                        <Button onClick={handleSaveEdit} className="bg-tile-blue text-white rounded-full font-poppins font-bold text-xs px-6 h-10">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
