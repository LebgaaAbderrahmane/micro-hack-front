"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { User as UserIcon, Mail, Shield, Building, Clock, Camera, Key, Smartphone, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";

export default function ProfilePage() {
    const { profile, user, isLoading } = useAuth();
    const { show } = useToast();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <Shield className="w-16 h-16 text-error opacity-50" />
                <h1 className="text-2xl font-bold text-white">Not Authenticated</h1>
                <p className="text-foreground/50">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-foreground/5">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Account Identity</h1>
                    <p className="text-foreground/50 font-medium">Manage your system credentials and organizational presence</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => show("Updating security protocols...", "info")}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/5"
                    >
                        Security Audit
                    </button>
                    <button 
                        onClick={() => show("Feature locked: Contact administrator", "warning")}
                        className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Identity Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card border border-white/10 overflow-hidden bg-white/5 rounded-3xl relative">
                        <div className="h-32 bg-gradient-to-br from-primary/20 via-background to-transparent border-b border-white/5"></div>
                        <div className="px-8 pb-10">
                            <div className="relative -mt-12 mb-6 inline-block">
                                <div className="w-24 h-24 rounded-3xl bg-[#121214] border-4 border-[#121214] shadow-2xl flex items-center justify-center text-4xl font-black text-primary overflow-hidden ring-4 ring-primary/20">
                                    {(profile.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                                    <Camera size={16} />
                                </button>
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-black text-white">{profile.username}</h2>
                                <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mt-1 flex items-center gap-2">
                                    <Shield size={12} />
                                    {profile.role} ACCESS
                                </p>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex flex-col gap-1 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">Global ID</span>
                                    <span className="text-[10px] font-mono text-foreground/60 break-all">{user.id}</span>
                                </div>
                                <div className="flex flex-col gap-1 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest">Carrier / Org</span>
                                    <span className="text-sm font-bold">{profile.organisation?.name || "Independent Port Authority"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 border border-white/5 rounded-3xl bg-white/5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-4 flex items-center gap-2">
                            <Clock size={14} className="text-primary" />
                            Activity Pulse
                        </h3>
                        <div className="space-y-4">
                            {[
                                { event: "Login Attempt", status: "Successful", time: "2h ago" },
                                { event: "Profile Update", status: "Modified", time: "1d ago" },
                                { event: "Security Sync", status: "Verified", time: "3d ago" }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-bold">{item.event}</p>
                                        <p className="text-[10px] text-foreground/40">{item.time}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-primary/60">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Authentication & Security Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 border border-white/5 rounded-3xl bg-white/5">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Key className="text-primary" size={20} />
                            Authentication Control
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Email Communication</h4>
                                        <p className="text-xs text-foreground/40">{user.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => show("Email change requires admin override", "warning")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Change</button>
                            </div>

                            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                                        <Fingerprint size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Password Management</h4>
                                        <p className="text-xs text-foreground/40">Last updated 12 days ago</p>
                                    </div>
                                </div>
                                <button onClick={() => show("Redirecting to secure reset gateway...", "info")} className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Reset</button>
                            </div>

                            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all opacity-50 grayscale">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                                        <Smartphone size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Two-Factor Authentication</h4>
                                        <p className="text-xs text-foreground/40">Not currently enabled for this node</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-success hover:underline">Setup</button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 border border-white/5 rounded-3xl bg-white/5">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Building className="text-primary" size={20} />
                            Organizational Nexus
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Current Role</p>
                                <p className="text-lg font-black text-white">{profile.role}</p>
                                <p className="text-xs text-foreground/40 mt-2 leading-relaxed">Your access level is determined by the global port authority. Contact your administrator to request clearance level changes.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Node Permissions</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {['READ', 'EXECUTE', 'BOOK'].map((p) => (
                                        <span key={p} className="text-[9px] font-black px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">{p}</span>
                                    ))}
                                    <span className="text-[9px] font-black px-2 py-1 bg-white/5 text-foreground/20 rounded-md border border-white/5 cursor-not-allowed">WRITE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
