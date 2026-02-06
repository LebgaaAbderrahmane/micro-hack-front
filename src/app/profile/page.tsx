"use client";

import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { User, Mail, Shield, Building, Clock, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground uppercase tracking-widest">Account Profile</h1>
                <p className="text-foreground/50 text-sm mt-1 uppercase font-bold tracking-widest">Manage your identity and security settings</p>
            </div>

            <div className="glass-card border border-foreground/10 overflow-hidden bg-background/50 relative">
                <div className="h-40 bg-gradient-to-br from-primary/10 via-background to-transparent border-b border-foreground/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-foreground/[0.02] bg-[center_top_-1px]"></div>
                    <div className="absolute -bottom-12 left-10">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-2xl flex items-center justify-center text-4xl font-black text-primary overflow-hidden">
                                {user.firstName[0]}{user.lastName?.[0] || ""}
                            </div>
                            <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-10 px-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black text-foreground">{user.firstName} {user.lastName || ""}</h2>
                            <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mt-1">{user.role.replace('_', ' ')}</p>
                        </div>
                        <button className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Email Address</p>
                                    <p className="text-sm font-bold">{user.email || "alex@ilacs.com"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <Building size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Company / Department</p>
                                    <p className="text-sm font-bold">{user.terminalId ? "Terminal Operations Division" : "Global Port Authority"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                                    <Shield size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Security Status</p>
                                    <p className="text-sm font-bold">MFA Required • All Clear</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Last Login</p>
                                    <p className="text-sm font-bold">2 hours ago from New York, US</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border border-foreground/5 text-center">
                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-1">Operational Rank</p>
                    <p className="text-2xl font-black text-foreground uppercase tracking-tighter">Elite Overseer</p>
                </div>
                <div className="glass-card p-6 border border-foreground/5 text-center">
                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-1">Total Activities</p>
                    <p className="text-2xl font-black text-foreground">1,482</p>
                </div>
                <div className="glass-card p-6 border border-foreground/5 text-center">
                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-1">System Trust</p>
                    <p className="text-2xl font-black text-success">98%</p>
                </div>
            </div>
        </div>
    );
}
