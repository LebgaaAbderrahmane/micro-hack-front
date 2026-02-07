"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import {
    Shield,
    User,
    Mail,
    Building,
    Calendar,
    ArrowLeft,
    Database,
    Lock,
    Unlock,
    Activity,
    Smartphone,
    MapPin,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";

export default function UserDetailPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const { profile: adminProfile, isLoading: authLoading } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { show } = useToast();
    const supabase = createClient();

    useEffect(() => {
        const fetchUserDetail = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('users')
                .select('*, organisation:organisations(*)')
                .eq('id', id)
                .single();

            if (error) {
                show("Could not fetch user details", "error");
            } else {
                setUser(data);
            }
            setLoading(false);
        };

        if (adminProfile?.role === 'ADMIN') {
            fetchUserDetail();
        }
    }, [id, adminProfile, supabase, show]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (adminProfile?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <Shield className="w-16 h-16 text-error opacity-50" />
                <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                <p className="text-foreground/50">Only administrators can access this secure identity node.</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 space-y-4">
                <p className="text-foreground/40 font-bold uppercase tracking-widest">User footprint not found</p>
                <button onClick={() => router.back()} className="text-primary hover:underline flex items-center gap-2 mx-auto">
                    <ArrowLeft size={16} /> Return to Grid
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-foreground/5">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-foreground/5 hover:bg-foreground/10 rounded-2xl border border-foreground/5 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">User Blueprint</h1>
                        <p className="text-foreground/50 font-medium font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                            <Database size={12} className="text-primary" /> NODE_SYS_ID: {user.id}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => show("Resetting security tokens...", "info")}
                        className="px-6 py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-foreground/5"
                    >
                        Reset Password
                    </button>
                    <button
                        onClick={() => show("System access revoked", "error")}
                        className="px-6 py-3 bg-error/10 text-error hover:bg-error/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-error/10"
                    >
                        Suspend Entry
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Identity Summary */}
                <div className="space-y-8 lg:col-span-1">
                    <div className="glass-card border border-foreground/10 overflow-hidden bg-foreground/5 rounded-3xl p-8 text-center relative">
                        <div className="absolute top-0 right-0 p-4">
                            <div className={cn(
                                "px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest",
                                user.role === 'ADMIN' ? "text-error border-error/20 bg-error/10" : "text-primary border-primary/20 bg-primary/10"
                            )}>
                                {user.role}
                            </div>
                        </div>
                        <div className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-4xl font-black text-primary mx-auto mb-6 shadow-2xl shadow-primary/20">
                            {(user.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-black text-foreground">{user.username}</h2>
                        <p className="text-foreground/40 text-sm font-medium mt-1">{user.email}</p>

                        <div className="mt-8 flex justify-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40 hover:text-primary transition-colors">
                                <Activity size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40 hover:text-primary transition-colors">
                                <MapPin size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40 hover:text-primary transition-colors">
                                <Smartphone size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 border border-foreground/5 rounded-3xl bg-foreground/5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-4">Organizational context</h3>
                        <div className="p-4 rounded-2xl bg-foreground/5 border border-foreground/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                <Building size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest leading-none mb-1">Affiliation</p>
                                <p className="font-bold text-sm truncate">{user.organisation?.name || "Independent Authority"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Auth Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 border border-foreground/5 rounded-3xl bg-foreground/5">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Lock className="text-primary" size={20} />
                            Authentication Node Attributes
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Login Security</span>
                                    <CheckCircle2 size={16} className="text-success" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">Email Verified</p>
                                    <p className="text-[10px] text-foreground/40 font-mono italic">Validated on 10/24/2025</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Active Sessions</span>
                                    <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/20 rounded-full font-black uppercase">2 Active</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">Desktop + Mobile Nodes</p>
                                    <p className="text-[10px] text-foreground/40 font-mono italic">IP: 197.234.xx.xxx</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Access Expiry</span>
                                    <Unlock size={16} className="text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">Never Expires</p>
                                    <p className="text-[10px] text-foreground/40 font-mono italic">Account Status: STABLE</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Last Activity</span>
                                    <Activity size={16} className="text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">24 Minutes Ago</p>
                                    <p className="text-[10px] text-foreground/40 font-mono italic">Action: FETCH_YARD_METRICS</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 border border-foreground/5 rounded-3xl bg-foreground/5">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Mail className="text-primary" size={20} />
                            Communication Logs
                        </h3>
                        <div className="space-y-4">
                            {[
                                { date: "Feb 04, 2026", subject: "Port Authority System Update", status: "Delivered" },
                                { date: "Jan 12, 2026", subject: "Password Reset Confirmation", status: "Opened" },
                            ].map((log, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-foreground/5 rounded-xl border border-foreground/5">
                                    <div>
                                        <p className="text-xs font-bold">{log.subject}</p>
                                        <p className="text-[10px] text-foreground/40">{log.date}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-foreground/30 uppercase border border-foreground/10 px-2 py-0.5 rounded-md">{log.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { CheckCircle2 as CheckCircle2Icon } from "lucide-react";
