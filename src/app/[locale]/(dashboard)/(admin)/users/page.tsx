"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { addOperator } from "./actions";
import {
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Shield,
    Truck,
    Clock,
    Filter,
    ArrowUpRight,
    Ban,
    UserCircle,
    CheckCircle2,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";

const UserRow = ({ user }: { user: any }) => {
    const { show } = useToast();

    const roleIcons: Record<string, React.ReactNode> = {
        ADMIN: <Shield size={14} className="text-error" />,
        OPERATOR: <UserCircle size={14} className="text-accent" />,
        DISPATCHER: <Truck size={14} className="text-primary" />
    };

    const roleColors: Record<string, string> = {
        ADMIN: "text-error bg-error/10 border-error/5",
        OPERATOR: "text-accent bg-accent/10 border-accent/5",
        DISPATCHER: "text-primary bg-primary/10 border-primary/5"
    };

    return (
        <tr className="group hover:bg-foreground/[0.02] transition-colors border-b border-white/5 last:border-0 text-white">
            <td className="py-5 px-8">
                <Link href={`/users/${user.id}`} className="flex items-center gap-3 group/link">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover/link:scale-110 transition-transform">
                        {(user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold group-hover/link:text-primary transition-colors">{user.username || "Anonymous"}</div>
                        <div className="text-xs text-foreground/40">{user.email || "No email"}</div>
                    </div>
                </Link>
            </td>
            <td className="py-5 px-8">
                <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider",
                    roleColors[user.role] || "text-foreground bg-foreground/10 border-foreground/5"
                )}>
                    {roleIcons[user.role]}
                    {user.role}
                </div>
            </td>
            <td className="py-5 px-8 text-sm font-medium">
                {user.organisation?.name || "Independent"}
            </td>
            <td className="py-5 px-8 text-right">
                <Link href={`/users/${user.id}`} className="p-2 hover:bg-white/5 rounded-lg text-foreground/40 hover:text-foreground inline-block">
                    <ArrowUpRight size={18} />
                </Link>
            </td>
        </tr>
    );
};

export default function UsersPage() {
    const { profile, isLoading: authLoading } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const { show } = useToast();
    const supabase = createClient();

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*, organisation:organisations(*)');
            
            if (error) {
                show("Error", error.message, "error");
            } else {
                setUsers(data || []);
            }
            setLoading(false);
        };

        if (profile?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [profile, supabase, show]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (profile?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <Shield className="w-16 h-16 text-error opacity-50" />
                <h1 className="text-2xl font-bold text-white">Access Denied</h1>
                <p className="text-foreground/50">Only administrators can access this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-foreground/5">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">IAM Systems</h1>
                    <p className="text-foreground/50 font-medium">Identity and Access Management for Port Operations</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <UserPlus size={18} />
                    <span>Invite Operator</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Internal Users", value: users.filter(u => u.role !== 'DISPATCHER').length, icon: Shield, color: "text-error" },
                    { label: "Active Carriers", value: users.filter(u => u.role === 'DISPATCHER').length, icon: Truck, color: "text-primary" },
                    { label: "Security Nodes", value: "3", icon: UserCircle, color: "text-accent" },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 border border-white/5 relative overflow-hidden group bg-white/5 rounded-3xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={48} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{stat.label}</p>
                        <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="glass-card border border-white/5 overflow-hidden bg-white/5 rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-foreground/[0.03] border-b border-white/5">
                            <tr>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-foreground/40">User Identity</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-foreground/40">Access Level</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-foreground/40">Associated Org</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <UserRow key={user.id} user={user} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-foreground/40 font-medium italic">
                                        No users found in organization.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#121214] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">Add Operator</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-foreground/40 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form action={async (formData) => {
                            try {
                                await addOperator(formData);
                                show("Success", "Operator added successfully", "success");
                                setShowAddModal(false);
                            } catch (e: any) {
                                show("Error", e.message, "error");
                            }
                        }} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Username</label>
                                <input name="username" placeholder="op_name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Email</label>
                                <input name="email" type="email" placeholder="op@port.dz" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Password</label>
                                <input name="password" type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white" required />
                            </div>
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 mt-4">
                                Create Operator Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-foreground/5 flex items-center justify-center text-primary font-black overflow-hidden relative">
                        {user.firstName[0]}{user.lastName[0]}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                        <p className="font-extrabold text-sm text-foreground">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="py-5 px-8">
                <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                    roleColors[user.role as keyof typeof roleColors]
                )}>
                    {roleIcons[user.role as keyof typeof roleIcons]}
                    {user.role}
                </div>
            </td>
            <td className="py-5 px-8 text-xs font-bold text-foreground/60">
                {user.company || "Internal Operations"}
            </td>
            <td className="py-5 px-8">
                <button
                    onClick={() => {
                        setStatus(!status);
                        show(`${user.firstName}'s status updated to ${!status ? 'Active' : 'Inactive'}`, !status ? "success" : "warning");
                    }}
                    className="flex items-center gap-2 group/status"
                >
                    <div className={cn("w-2 h-2 rounded-full transition-all", status ? "bg-success shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-foreground/20")}></div>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", status ? "text-success" : "text-foreground/40")}>
                        {status ? "Active" : "Disabled"}
                    </span>
                </button>
            </td>
            <td className="py-5 px-8 text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                {user.lastLogin}
            </td>
            <td className="py-5 px-8 text-right">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => show(`Resetting credentials for ${user.firstName}`, "info")}
                        className="p-2 bg-foreground/5 hover:bg-primary hover:text-white rounded-xl transition-all text-foreground/40"
                        title="Reset Password"
                    >
                        <Mail size={16} />
                    </button>
                    <button
                        onClick={() => show(`Modifying permissions for ${user.firstName}`, "info")}
                        className="p-2 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all text-foreground/40"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default function UsersPage() {
    const { show } = useToast();

    const users = [
        { id: "1", firstName: "Alex", lastName: "Admin", email: "alex@ilacs.com", role: "admin", isActive: true, lastLogin: "2m ago" },
        { id: "2", firstName: "Sarah", lastName: "Terminal", email: "sarah.t@port.com", role: "terminal_op", company: "Port North Authority", isActive: true, lastLogin: "14m ago" },
        { id: "3", firstName: "David", lastName: "Driver", email: "david@fastlogistics.com", role: "carrier", company: "Fast Logistics Corp", isActive: true, lastLogin: "1h ago" },
        { id: "4", firstName: "Emma", lastName: "Vance", email: "emma@ilacs.com", role: "admin", isActive: true, lastLogin: "Yesterday" },
        { id: "5", firstName: "James", lastName: "Harding", email: "j.harding@global.com", role: "carrier", company: "Global Carriers Inc", isActive: false, lastLogin: "12 days ago" },
        { id: "6", firstName: "Michael", lastName: "Chen", email: "m.chen@port.com", role: "terminal_op", company: "South Port Ops", isActive: true, lastLogin: "5h ago" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground uppercase tracking-widest">Access Control</h1>
                    <p className="text-foreground/40 text-xs font-bold mt-1 uppercase tracking-widest">Orchestrate system permissions and audit logs</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => show("Exporting system activity logs...", "success")}
                        className="flex items-center gap-2 px-8 py-4 bg-foreground/5 hover:bg-foreground/10 rounded-2xl text-[10px] uppercase font-black tracking-widest border border-foreground/5 transition-all"
                    >
                        <ArrowUpRight size={18} />
                        Audit Trail
                    </button>
                    <button
                        onClick={() => show("Opening user invitation portal", "info")}
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <UserPlus size={18} />
                        Identity Provision
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 glass-card border border-foreground/5 overflow-hidden">
                    <div className="p-8 border-b border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
                            <input
                                type="text"
                                placeholder="Search by identity, email or corporation..."
                                className="w-full bg-foreground/5 border border-foreground/5 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium text-foreground"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-4 bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 rounded-2xl text-foreground/60 transition-all">
                                <Filter size={20} />
                            </button>
                            <span className="text-[10px] font-black text-foreground/30 whitespace-nowrap uppercase tracking-widest leading-none">6 Identifiers</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto px-4 pb-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-foreground/5">
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Identity Detail</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Privilege</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Entity</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Lifecycle</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Last Sync</th>
                                    <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <UserRow key={user.id} user={user} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-8 border border-foreground/5 space-y-8">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-foreground/40 flex items-center gap-3">
                            <Clock size={16} className="text-primary" />
                            Security Metrics
                        </h3>
                        <div className="space-y-6">
                            <div className="p-5 rounded-3xl bg-foreground/[0.03] space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">MFA Adoption</span>
                                    <span className="text-xs font-black text-primary">84%</span>
                                </div>
                                <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[84%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-3xl bg-foreground/[0.03] border border-foreground/5">
                                    <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest leading-none mb-3">Sync Failures</p>
                                    <p className="text-2xl font-black text-error">12</p>
                                    <div className="w-6 h-6 rounded-lg bg-error/10 flex items-center justify-center text-error mt-3">
                                        <Ban size={12} />
                                    </div>
                                </div>
                                <div className="p-5 rounded-3xl bg-foreground/[0.03] border border-foreground/5">
                                    <p className="text-[9px] font-black text-foreground/30 uppercase tracking-widest leading-none mb-3">Invites</p>
                                    <p className="text-2xl font-black text-primary">05</p>
                                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-3">
                                        <Mail size={12} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Audit Status</p>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-success" />
                                    <span className="text-xs font-bold text-foreground">Next Audit: April 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                                <CheckCircle2 size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-xl leading-tight text-foreground uppercase tracking-tight">Governance Compliant</h4>
                                <p className="text-xs text-foreground/40 mt-3 font-medium leading-relaxed uppercase tracking-wider">All biometric and cryptographic protocols are active and verified.</p>
                            </div>
                            <button className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:underline flex items-center gap-2 group-hover:translate-x-1 transition-all">
                                Protocol Docs <ArrowUpRight size={14} />
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
