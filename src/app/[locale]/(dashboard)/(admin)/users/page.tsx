"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
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
import { useTranslations } from "next-intl";

const UserRow = ({ user }: { user: any }) => {
    const { show } = useToast();
    const t = useTranslations("Users");

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
        <tr className="group hover:bg-foreground/[0.02] transition-colors border-b border-foreground/5 last:border-0 text-foreground">
            <td className="py-5 px-8">
                <Link href={`/users/detail?id=${user.id}`} className="flex items-center gap-3 group/link">
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
                {user.organisation?.name || t("independent")}
            </td>
            <td className="py-5 px-8 text-right">
                <Link href={`/users/detail?id=${user.id}`} className="p-2 hover:bg-foreground/5 rounded-lg text-foreground/40 hover:text-foreground inline-block">
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
    const t = useTranslations("Users");
    const supabase = createClient();

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*, organisation:organisations(*)');

            if (error) {
                show(error.message, "error");
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
                <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                <p className="text-foreground/50">Only administrators can access this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 text-foreground">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-foreground/5">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">{t("title")}</h1>
                    <p className="text-foreground/50 font-medium">{t("subtitle")}</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <UserPlus size={18} />
                    <span>{t("addUser")}</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Internal Users", value: users.filter(u => u.role !== 'DISPATCHER').length, icon: Shield, color: "text-error" },
                    { label: "Active Carriers", value: users.filter(u => u.role === 'DISPATCHER').length, icon: Truck, color: "text-primary" },
                    { label: "Security Nodes", value: "3", icon: UserCircle, color: "text-accent" },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 border border-foreground/5 relative overflow-hidden group bg-foreground/5 rounded-3xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={48} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{stat.label}</p>
                        <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="glass-card border border-foreground/5 overflow-hidden bg-foreground/5 rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-foreground/[0.03] border-b border-foreground/5">
                            <tr>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-foreground/40">{t("identity")}</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-foreground/40">{t("accessLevel")}</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-foreground/40">{t("org")}</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">{t("actions")}</th>
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
                                        {t("noUsers")}
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
                    <div className="bg-background border border-foreground/10 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">{t("addUser")}</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const username = formData.get("username") as string;
                            const email = formData.get("email") as string;
                            const password = formData.get("password") as string;

                            try {
                                if (profile?.role !== 'ADMIN') throw new Error("Unauthorized");

                                // 1. Sign up the operator
                                const { data: authData, error: authError } = await supabase.auth.signUp({
                                    email,
                                    password,
                                    options: {
                                        data: {
                                            username,
                                            role: 'OPERATOR'
                                        }
                                    }
                                });

                                if (authError || !authData.user) throw new Error(authError?.message || "Auth failed");

                                // 2. Create profile
                                const { error: profileError } = await supabase
                                    .from('users')
                                    .upsert({
                                        id: authData.user.id,
                                        username,
                                        org_id: profile.org_id,
                                        role: 'OPERATOR'
                                    }, { onConflict: 'id' });

                                if (profileError) throw new Error(profileError.message);

                                show(t("added"), "success");
                                setShowAddModal(false);
                                // Refresh list
                                const { data: newData } = await supabase
                                    .from('users')
                                    .select('*, organisation:organisations(*)');
                                if (newData) setUsers(newData);
                            } catch (e: any) {
                                show(e.message, "error");
                            }
                        }} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">{t("username")}</label>
                                <input name="username" placeholder="op_name" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">{t("email")}</label>
                                <input name="email" type="email" placeholder="op@port.dz" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">{t("password")}</label>
                                <input name="password" type="password" placeholder="••••••••" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" required />
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 mt-4">
                                {t("create")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
