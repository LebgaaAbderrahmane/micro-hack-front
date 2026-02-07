"use client";

import React from "react";
import { Link, useRouter } from "@/i18n/routing";
import { LogOut, User, Settings, Shield, Building2, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "../common/Logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Minimal header for OPERATOR role - shows only logo and user profile dropdown
 * No navigation links - operators go directly to the booking management page
 */
export const OperatorHeader = () => {
    const router = useRouter();
    const { profile, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <header className="w-full h-16 flex items-center justify-between px-6 md:px-12 border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
            {/* Logo */}
            <Link href="/bookings" className="flex items-center gap-3 group">
                <Logo />
            </Link>

            {/* User Profile Dropdown */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="p-1 rounded-xl hover:bg-foreground/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            title="User menu"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
                                {profile?.username ? (
                                    <span className="font-black text-sm text-primary-foreground">
                                        {profile.username[0].toUpperCase()}
                                    </span>
                                ) : (
                                    <User size={18} className="text-primary-foreground" />
                                )}
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={12}
                        className="w-64 glass-card-geo p-4 z-50 flex flex-col gap-4 border border-foreground/5 animate-in fade-in zoom-in-95 duration-200"
                    >
                        {/* User Info */}
                        <div className="flex items-center gap-3 pb-3 border-b border-foreground/5">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                {profile?.username?.[0]?.toUpperCase() ?? <User size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate text-foreground">
                                    {profile?.username || "User"}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Shield size={10} className="text-primary/60" />
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                                        {profile?.role?.replace("_", " ")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="space-y-2">
                                {profile?.organisation && (
                                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                                        <Building2 size={14} className="text-foreground/30" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest leading-none mb-1">
                                                Organization
                                            </p>
                                            <p className="text-xs font-semibold text-foreground/70 truncate">
                                                {profile.organisation.name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                                    <Mail size={14} className="text-foreground/30" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest leading-none mb-1">
                                            Email
                                        </p>
                                        <p className="text-xs font-semibold text-foreground/70 truncate">
                                            {profile?.username}@portflow.com
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Settings Link */}
                            <DropdownMenuItem
                                onSelect={() => router.push("/settings")}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-colors text-sm font-medium cursor-pointer"
                            >
                                <Settings size={16} />
                                Settings
                            </DropdownMenuItem>

                            {/* Sign Out */}
                            <DropdownMenuItem
                                onSelect={handleSignOut}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-error/10 text-error hover:text-error transition-colors text-sm font-medium border border-transparent hover:border-error/20 cursor-pointer"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
