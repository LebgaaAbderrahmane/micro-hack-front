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
    Save
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usersService } from "@/services/user.service";
import { terminalsService } from "@/services/infrastructure.service";
import { aiAgentsService } from "@/services/system.service";
import { addOperator } from "../(admin)/users/actions";

// --- Types & Sample Data ---

type UserStatus = "Active" | "Inactive";
type UserRole = "Admin" | "Operator" | "Carrier";

interface UserData {
    id: string; // Changed to string for UUID
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastActive: string;
}

type TerminalStatus = "Operational" | "Maintenance" | "Offline";

interface TerminalData {
    id: string; // Changed to string
    name: string;
    location: string;
    capacity: number;
    load: number;
    status: TerminalStatus;
}

type AgentType = "Optimization" | "Planning" | "Analytics" | "Inventory";
type AgentStatus = "Active" | "Inactive";

interface AgentData {
    id: string; // Changed to string
    name: string;
    type: AgentType;
    status: AgentStatus;
    lastSync: string;
}

const initialAgents: AgentData[] = []; // Replaced by real data

export default function ManagePage() {
    const [activeTab, setActiveTab] = useState("users");
    const [searchTerm, setSearchTerm] = useState("");

    // Data States
    const [users, setUsers] = useState<UserData[]>([]);
    const [terminals, setTerminals] = useState<TerminalData[]>([]);
    const [agents, setAgents] = useState<AgentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, terminalsRes, agentsRes, orgsRes, portsRes] = await Promise.all([
                usersService.getWithAuth(),
                terminalsService.getAll(),
                aiAgentsService.getAll(),
                // @ts-ignore
                import("@/services/user.service").then(m => m.organisationsService.getAll()),
                // @ts-ignore
                import("@/services/infrastructure.service").then(m => m.portsService.getAll()),
            ]);

            if (usersRes?.data) {
                const rawData = Array.isArray(usersRes.data) ? usersRes.data : [usersRes.data];
                setUsers(rawData.map((u: any) => ({
                    id: u.id,
                    name: u.username || "Unknown",
                    email: u.email || `${u.username || 'user'}@system.com`,
                    role: u.role === 'ADMIN' ? 'Admin' : u.role === 'OPERATOR' ? 'Operator' : 'Carrier',
                    status: 'Active',
                    lastActive: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Unknown'
                })));
            } else {
                setUsers([]);
            }

            if (terminalsRes?.data) {
                const rawData = Array.isArray(terminalsRes.data) ? terminalsRes.data : [terminalsRes.data];
                setTerminals(rawData.map((t: any, idx: number) => ({
                    id: t.id,
                    name: t.zone_name || `Terminal ${idx + 1}`,
                    location: t.zone_code || "Main Wing",
                    capacity: t.total_capacity || 1000,
                    load: t.current_occupancy || 0,
                    status: 'Operational'
                })));
            } else {
                setTerminals([]);
            }

            if (agentsRes?.data) {
                const rawData = Array.isArray(agentsRes.data) ? agentsRes.data : [agentsRes.data];
                setAgents(rawData.map((a: any) => ({
                    id: a.id,
                    name: a.agent_name,
                    type: a.agent_type as AgentType,
                    status: a.is_active ? 'Active' : 'Inactive',
                    lastSync: a.created_at ? new Date(a.created_at).toLocaleTimeString() : 'Just now'
                })));
            } else {
                setAgents([]);
            }

            if (orgsRes.data?.[0]) setDefaultOrgId(orgsRes.data[0].id);
            if (portsRes.data?.[0]) setDefaultPortId(portsRes.data[0].id);

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load management data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Selection States
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

    // Context States (for DB relations)
    const [defaultOrgId, setDefaultOrgId] = useState<string | null>(null);
    const [defaultPortId, setDefaultPortId] = useState<string | null>(null);

    // Modals & New/Edit Item State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const [newItemName, setNewItemName] = useState("");
    const [newItemDetail, setNewItemDetail] = useState("");
    const [newItemRole, setNewItemRole] = useState<UserRole>("Operator");
    const [newItemEmail, setNewItemEmail] = useState("");
    const [newItemPassword, setNewItemPassword] = useState("");

    const [editingItem, setEditingItem] = useState<{ id: string, name: string, detail: string } | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, type: string } | null>(null);

    // --- Selection Logic ---
    const handleSelectRow = (id: string, type: string) => {
        if (type === "users") {
            setSelectedUsers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        } else if (type === "terminals") {
            setSelectedTerminals(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        } else if (type === "agents") {
            setSelectedAgents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        }
    };

    const handleSelectAll = (checked: boolean, type: string) => {
        if (type === "users") {
            setSelectedUsers(checked ? filteredUsers.map(u => u.id) : []);
        } else if (type === "terminals") {
            setSelectedTerminals(checked ? filteredTerminals.map(t => t.id) : []);
        } else if (type === "agents") {
            setSelectedAgents(checked ? filteredAgents.map(a => a.id) : []);
        }
    };

    // --- Action Logic ---
    const handleOpenEdit = (id: string, type: string) => {
        let name = "";
        let detail = "";
        if (type === "users") {
            const u = users.find(x => x.id === id);
            if (u) { name = u.name; detail = u.email; }
        } else if (type === "terminals") {
            const t = terminals.find(x => x.id === id);
            if (t) { name = t.name; detail = t.location; }
        } else if (type === "agents") {
            const a = agents.find(x => x.id === id);
            if (a) { name = a.name; detail = a.type; }
        }
        setEditingItem({ id, name, detail });
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
            } else if (activeTab === "agents") {
                await aiAgentsService.update(editingItem.id, { agent_name: editingItem.name, agent_type: editingItem.detail });
            }
            toast.success(`${activeTab.slice(0, -1)} updated successfully`);
            await fetchData();
            setIsEditOpen(false);
            setEditingItem(null);
        } catch (error: any) {
            toast.error(error.message || "Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (id: string, type: string) => {
        setItemToDelete({ id, type });
        setIsDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsLoading(true);
        try {
            const { id, type } = itemToDelete;
            if (type === "users") await usersService.delete(id);
            if (type === "terminals") await terminalsService.delete(id);
            if (type === "agents") await aiAgentsService.delete(id);

            toast.success(`${type.slice(0, -1)} deleted successfully`);
            await fetchData();
            setIsDeleteConfirmOpen(false);
            setItemToDelete(null);
        } catch (error: any) {
            toast.error(error.message || "Delete failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleAgentStatus = async (id: string) => {
        const agent = agents.find(a => a.id === id);
        if (!agent) return;

        try {
            await aiAgentsService.update(id, { is_active: agent.status === "Inactive" });
            fetchData();
        } catch (error) {
            toast.error("Failed to toggle agent status");
        }
    };

    const handleAddItem = async () => {
        if (!newItemName || (activeTab === "users" ? !newItemEmail : !newItemDetail)) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        try {
            if (activeTab === "users") {
                const formData = new FormData();
                formData.append("username", newItemName);
                formData.append("email", newItemEmail);
                formData.append("password", newItemPassword);
                formData.append("role", newItemRole.toUpperCase());

                await addOperator(formData);
            } else if (activeTab === "terminals") {
                await terminalsService.create({
                    zone_name: newItemName,
                    zone_code: newItemDetail,
                    total_capacity: 1000,
                    port_id: defaultPortId || '',
                    current_occupancy: 0
                });
            } else if (activeTab === "agents") {
                await aiAgentsService.create({
                    agent_name: newItemName,
                    agent_type: newItemDetail,
                    is_active: true,
                    agent_key: newItemName.toLowerCase().replace(/\s+/g, '_')
                });
            }

            toast.success(`New ${activeTab.slice(0, -1)} added successfully.`);
            await fetchData();
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

    // --- Filter Logic ---
    const filteredUsers = useMemo(() => {
        const res = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.warn("DEBUG: filteredUsers", res);
        return res;
    }, [users, searchTerm]);

    const filteredTerminals = useMemo(() => terminals.filter(terminal =>
        terminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        terminal.location.toLowerCase().includes(searchTerm.toLowerCase())
    ), [terminals, searchTerm]);

    const filteredAgents = useMemo(() => agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.type.toLowerCase().includes(searchTerm.toLowerCase())
    ), [agents, searchTerm]);

    // --- Header Components ---
    const RoleBadge = ({ role }: { role: UserRole }) => {
        const roles: Record<UserRole, string> = {
            Admin: "bg-tile-blue",
            Operator: "bg-success border-success", // explicitly green via success token
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
        if (status === "Active" || status === "Operational") colorClass = "bg-success";
        if (status === "Maintenance") colorClass = "bg-warning";
        if (status === "Offline") colorClass = "bg-error";

        return (
            <Badge className={cn("text-white font-medium text-xs px-2.5 py-0.5 border-none shadow-none font-poppins", colorClass)}>
                {status}
            </Badge>
        );
    };

    const ProgressBar = ({ value, max }: { value: number; max: number }) => {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));
        let barColor = "bg-warning";
        if (percentage < 50) barColor = "bg-success";
        if (percentage > 90) barColor = "bg-error";

        return (
            <div className="w-full max-w-[120px]">
                <div className="text-[10px] font-medium mb-1 text-slate-500 font-poppins">
                    {value} / {max}
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full transition-all duration-500 rounded-full", barColor)}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div
            className="flex flex-col gap-6 w-full max-w-[1080px] mx-auto py-8 px-6 min-h-screen relative"
            style={{
                backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
                backgroundSize: '30px 30px'
            }}
        >
            {/* Header - Consistent with Analytics */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2 px-1">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-medium uppercase tracking-widest text-[10px]">
                        <LayoutDashboard size={14} />
                        Operations Suite
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground font-poppins">
                        Configuration Management
                    </h1>
                    <p className="text-sm font-normal font-poppins text-foreground/50">Manage users, terminals, and AI systems.</p>
                </div>
            </div>

            {/* Top Toolbar - Above Tabs */}
            <div className="flex items-center gap-4 mb-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder={`Search through ${activeTab} data...`}
                        className="pl-11 h-11 border-slate-200 bg-white placeholder:text-slate-400 text-sm rounded-xl font-poppins shadow-sm focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    className="bg-tile-blue hover:bg-tile-blue/90 text-white rounded-xl font-poppins font-semibold text-sm h-11 px-6 shadow-md transition-all active:scale-95 gap-2"
                    onClick={() => setIsAddOpen(true)}
                >
                    <Plus size={18} />
                    Add {activeTab.slice(0, -1)}
                </Button>
            </div>

            <Tabs defaultValue="users" value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchTerm(""); setSelectedUsers([]); setSelectedTerminals([]); setSelectedAgents([]); }} className="w-full">
                {/* Tabs List - Matching User's Screenshot */}
                <TabsList className="bg-transparent p-0 h-auto gap-0.5 border-b border-slate-200 w-full justify-start rounded-none mb-6 relative">
                    <TabsTrigger
                        value="users"
                        className="data-[state=active]:bg-white data-[state=active]:border-slate-200 data-[state=active]:border-t data-[state=active]:border-x border border-transparent border-b-0 rounded-t-lg px-6 py-3 flex items-center gap-2 text-slate-400 data-[state=active]:text-foreground font-poppins font-medium text-sm transition-all relative z-20 -mb-px active-tab-blend"
                    >
                        <Users size={18} className={cn(activeTab === "users" ? "text-indigo-500" : "text-slate-400")} />
                        Users
                    </TabsTrigger>
                    <TabsTrigger
                        value="terminals"
                        className="data-[state=active]:bg-white data-[state=active]:border-slate-200 data-[state=active]:border-t data-[state=active]:border-x border border-transparent border-b-0 rounded-t-lg px-6 py-3 flex items-center gap-2 text-slate-400 data-[state=active]:text-foreground font-poppins font-medium text-sm transition-all relative z-20 -mb-px active-tab-blend"
                    >
                        <Ship size={18} className={cn(activeTab === "terminals" ? "text-blue-500" : "text-slate-400")} />
                        Terminals
                    </TabsTrigger>
                    <TabsTrigger
                        value="agents"
                        className="data-[state=active]:bg-white data-[state=active]:border-slate-200 data-[state=active]:border-t data-[state=active]:border-x border border-transparent border-b-0 rounded-t-lg px-6 py-3 flex items-center gap-2 text-slate-400 data-[state=active]:text-foreground font-poppins font-medium text-sm transition-all relative z-20 -mb-px active-tab-blend"
                    >
                        <Bot size={18} className={cn(activeTab === "agents" ? "text-pink-500" : "text-slate-400")} />
                        AI Agents
                    </TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                    {/* Table Container */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-100/40 border-b border-slate-200">
                                <TableRow className="hover:bg-transparent h-12">
                                    <TableHead className="w-[60px] text-center">
                                        <Checkbox
                                            checked={
                                                activeTab === "users" ? (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) :
                                                    activeTab === "terminals" ? (selectedTerminals.length === filteredTerminals.length && filteredTerminals.length > 0) :
                                                        (selectedAgents.length === filteredAgents.length && filteredAgents.length > 0)
                                            }
                                            onCheckedChange={(c) => handleSelectAll(!!c, activeTab)}
                                            className="rounded border-slate-300"
                                        />
                                    </TableHead>
                                    {activeTab === "users" && (
                                        <>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider">User Identity</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider">Access Channel</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider text-center">Clearance</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider text-center">Node Status</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider text-center">Last Activity</TableHead>
                                        </>
                                    )}
                                    {activeTab === "terminals" && (
                                        <>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider">Terminal Node</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider">Geographic Lock</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider text-center">Max Capacity</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider">Operational Load</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider text-center">System Health</TableHead>
                                        </>
                                    )}
                                    {activeTab === "agents" && (
                                        <>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider">Neural Engine</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider">Cognitive Type</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider text-center">Execution State</TableHead>
                                            <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider text-center">Sync Pulse</TableHead>
                                        </>
                                    )}
                                    <TableHead className="font-poppins font-semibold text-foreground text-xs uppercase tracking-wider text-right pr-6">Operations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={activeTab === "users" ? 7 : (activeTab === "terminals" ? 7 : 6)} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3 py-12">
                                                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-slate-600 font-poppins">Synchronizing Fleet Intelligence</p>
                                                    <p className="text-xs text-slate-400 font-poppins">Connecting to secure encrypted datastreams...</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {/* USERS */}
                                        {activeTab === "users" && filteredUsers.map((user) => (
                                            <TableRow
                                                key={user.id}
                                                className={cn(
                                                    "group border-slate-50 transition-colors h-14 hover:bg-slate-50/50",
                                                    selectedUsers.includes(user.id) && "bg-primary/5"
                                                )}
                                            >
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={selectedUsers.includes(user.id)}
                                                        onCheckedChange={() => handleSelectRow(user.id, "users")}
                                                        className="rounded border-slate-300"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground font-poppins">{user.name}</TableCell>
                                                <TableCell className="text-slate-500 font-poppins text-sm">{user.email}</TableCell>
                                                <TableCell className="text-center"><RoleBadge role={user.role} /></TableCell>
                                                <TableCell className="text-center"><StatusBadge status={user.status} /></TableCell>
                                                <TableCell className="text-center text-slate-500 text-xs font-poppins">{user.lastActive}</TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex items-center justify-end gap-1 transition-all">
                                                        <Button onClick={() => handleOpenEdit(user.id, "users")} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg">
                                                            <Pencil size={18} />
                                                        </Button>
                                                        <Button onClick={() => confirmDelete(user.id, "users")} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg">
                                                            <Trash2 size={18} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {activeTab === "terminals" && filteredTerminals.map((terminal) => (
                                            <TableRow
                                                key={terminal.id}
                                                className={cn(
                                                    "group border-slate-100 h-14 transition-colors",
                                                    selectedTerminals.includes(terminal.id) ? "bg-primary/5" : "hover:bg-slate-50/50"
                                                )}
                                            >
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={selectedTerminals.includes(terminal.id)}
                                                        onCheckedChange={() => handleSelectRow(terminal.id, "terminals")}
                                                        className="rounded border-slate-300"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground font-poppins">{terminal.name}</TableCell>
                                                <TableCell className="text-slate-500 font-poppins text-sm">{terminal.location}</TableCell>
                                                <TableCell className="text-center font-semibold text-foreground font-poppins text-sm">{terminal.capacity}</TableCell>
                                                <TableCell><ProgressBar value={terminal.load} max={terminal.capacity} /></TableCell>
                                                <TableCell className="text-center"><StatusBadge status={terminal.status} /></TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex items-center justify-end gap-1 transition-all">
                                                        <Button onClick={() => handleOpenEdit(terminal.id, "terminals")} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg">
                                                            <Settings size={18} />
                                                        </Button>
                                                        <Button onClick={() => confirmDelete(terminal.id, "terminals")} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg">
                                                            <Trash2 size={18} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {activeTab === "agents" && filteredAgents.map((agent) => (
                                            <TableRow
                                                key={agent.id}
                                                className={cn(
                                                    "group border-slate-100 h-14 transition-colors",
                                                    selectedAgents.includes(agent.id) ? "bg-primary/5" : "hover:bg-slate-50/50"
                                                )}
                                            >
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={selectedAgents.includes(agent.id)}
                                                        onCheckedChange={() => handleSelectRow(agent.id, "agents")}
                                                        className="rounded border-slate-300"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground font-poppins">{agent.name}</TableCell>
                                                <TableCell className="text-slate-400 font-medium text-[10px] uppercase tracking-wider font-poppins">{agent.type}</TableCell>
                                                <TableCell className="text-center"><StatusBadge status={agent.status} /></TableCell>
                                                <TableCell className="text-center text-slate-500 text-xs font-poppins">{agent.lastSync}</TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex items-center justify-end gap-1 transition-all">
                                                        <Button
                                                            onClick={() => handleToggleAgentStatus(agent.id)}
                                                            variant="ghost"
                                                            size="icon"
                                                            className={cn(
                                                                "h-9 w-9 rounded-lg",
                                                                agent.status === "Active" ? "text-warning hover:bg-warning/10" : "text-success hover:bg-success/10"
                                                            )}
                                                        >
                                                            {agent.status === "Active" ? <CirclePause size={20} /> : <CirclePlay size={20} />}
                                                        </Button>
                                                        <Button onClick={() => handleOpenEdit(agent.id, "agents")} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg">
                                                            <Pencil size={18} />
                                                        </Button>
                                                        <Button onClick={() => confirmDelete(agent.id, "agents")} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg">
                                                            <Trash2 size={18} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Tabs>

            {/* Float Action Menu - Simplified and Consistent */}
            <div className={cn(
                "fixed bottom-10 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 h-14 rounded-full flex items-center gap-8 shadow-2xl transition-all duration-300 z-50 border border-white/10",
                (selectedUsers.length > 0 || selectedTerminals.length > 0 || selectedAgents.length > 0) ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            )}>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="font-poppins font-semibold text-xs tracking-wide">
                        {selectedUsers.length || selectedTerminals.length || selectedAgents.length} SELECTED
                    </span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-background hover:bg-white/10 font-poppins font-bold text-[10px] uppercase tracking-widest h-9 px-4 rounded-full">
                        Export
                    </Button>
                    <Button variant="ghost" className="text-error hover:bg-error/10 font-poppins font-bold text-[10px] uppercase tracking-widest h-9 px-4 rounded-full">
                        Delete
                    </Button>
                    <button
                        onClick={() => { setSelectedUsers([]); setSelectedTerminals([]); setSelectedAgents([]); }}
                        className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Add Modal - Matching Design System */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-xl border border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="font-poppins font-bold text-xl">Add New {activeTab.slice(0, -1)}</DialogTitle>
                        <DialogDescription className="font-poppins text-sm text-slate-500">
                            Register a new entry into the system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto px-1">
                        {activeTab === "users" ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Username</label>
                                    <Input
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder="admin_joe"
                                        className="rounded-lg border-slate-200 h-10 font-poppins"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                                    <Input
                                        value={newItemEmail}
                                        onChange={(e) => setNewItemEmail(e.target.value)}
                                        placeholder="joe@system.com"
                                        className="rounded-lg border-slate-200 h-10 font-poppins"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Role</label>
                                    <Select value={newItemRole} onValueChange={(v: UserRole) => setNewItemRole(v)}>
                                        <SelectTrigger className="w-full rounded-lg border-slate-200 h-10 font-poppins">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Administrator</SelectItem>
                                            <SelectItem value="Operator">Operator</SelectItem>
                                            <SelectItem value="Carrier">Carrier</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                                    <Input
                                        type="password"
                                        value={newItemPassword}
                                        onChange={(e) => setNewItemPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="rounded-lg border-slate-200 h-10 font-poppins"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Name</label>
                                    <Input
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder="Enter name"
                                        className="rounded-lg border-slate-200 h-10 font-poppins"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                        {activeTab === "terminals" ? "Location" : "Type"}
                                    </label>
                                    <Input
                                        value={newItemDetail}
                                        onChange={(e) => setNewItemDetail(e.target.value)}
                                        placeholder="Details..."
                                        className="rounded-lg border-slate-200 h-10 font-poppins"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter className="px-1 pb-2">
                        <Button variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-full font-poppins font-bold text-xs px-6 h-10 border-slate-200 hover:bg-slate-50">Cancel</Button>
                        <Button onClick={handleAddItem} className="bg-tile-blue hover:bg-tile-blue/90 text-white rounded-full font-poppins font-bold text-xs px-6 h-10 shadow-lg shadow-tile-blue/20">Create {activeTab.slice(0, -1)}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-xl border border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="font-poppins font-bold text-xl">Edit {activeTab.slice(0, -1)}</DialogTitle>
                        <DialogDescription className="font-poppins text-sm text-slate-500">
                            Update the existing information for this entry.
                        </DialogDescription>
                    </DialogHeader>
                    {editingItem && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                                <Input
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    placeholder="Enter name"
                                    className="rounded-lg border-slate-200 h-10 font-poppins"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {activeTab === "users" ? "Email" : activeTab === "terminals" ? "Location" : "Type"}
                                </label>
                                <Input
                                    value={editingItem.detail}
                                    onChange={(e) => setEditingItem({ ...editingItem, detail: e.target.value })}
                                    placeholder="Details..."
                                    className="rounded-lg border-slate-200 h-10 font-poppins"
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

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-xl border border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="font-poppins font-bold text-xl text-error">Confirm Deletion</DialogTitle>
                        <DialogDescription className="font-poppins text-sm text-slate-500">
                            Are you sure you want to delete this {itemToDelete?.type.slice(0, -1)}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)} className="rounded-full font-poppins font-bold text-xs px-6 h-10">Keep It</Button>
                        <Button onClick={handleDelete} className="bg-error text-white border-none hover:bg-error/90 rounded-full font-poppins font-bold text-xs px-6 h-10">Yes, Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


