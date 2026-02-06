"use client";

import React, { useState, useEffect } from "react";
import {
    User,
    Lock,
    Bell,
    Shield,
    Mail,
    Smartphone,
    Globe,
    Moon,
    AlertCircle,
    ChevronRight,
    CheckCircle2,
    LogOut,
    Sun
} from "lucide-react";
import { useToast } from "@/components/common/Toast";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 px-2">{title}</h3>
        <div className="glass-card border border-foreground/5 overflow-hidden divide-y divide-foreground/5 bg-foreground/[0.02]">
            {children}
        </div>
    </div>
);

interface SettingItemProps {
    icon: any;
    title: string;
    description: string;
    badge?: string;
    onClick?: () => void;
    danger?: boolean;
    value?: boolean;
    isToggle?: boolean;
}

const SettingItem = ({ icon: Icon, title, description, badge, onClick, danger, value, isToggle }: SettingItemProps) => {
    const { show } = useToast();
    const handleClick = () => {
        if (onClick) onClick();
        else show(`Action triggered for ${title}`, "info");
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between p-5 transition-all group hover:bg-foreground/[0.02]",
                onClick && "cursor-pointer"
            )}
            onClick={onClick ? handleClick : undefined}
        >
            <div className="flex items-center gap-5">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-foreground/5",
                    danger ? "bg-error/10 text-error group-hover:bg-error/20" : "bg-foreground/[0.05] text-foreground/40 group-hover:text-primary group-hover:bg-primary/10"
                )}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className={cn("font-bold text-sm", danger && "text-error")}>{title}</h4>
                    <p className="text-xs text-foreground/40 mt-1">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {badge && (
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                        {badge}
                    </span>
                )}
                {isToggle ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleClick(); }}
                        className={cn(
                            "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                            value ? "bg-primary" : "bg-foreground/10"
                        )}
                    >
                        <div className={cn(
                            "w-4 h-4 bg-background rounded-full shadow-lg transition-all duration-300",
                            value ? "translate-x-6" : "translate-x-0"
                        )} />
                    </button>
                ) : (
                    <ChevronRight size={18} className="text-foreground/10 group-hover:text-primary transition-colors" />
                )}
            </div>
        </div>
    );
};

export default function SettingsPage() {
    const { show } = useToast();
    const [mfa, setMfa] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const { theme, toggleTheme } = useThemeStore();
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
        show("Logged out successfully", "success");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between bg-background/40 p-10 rounded-[2rem] border border-foreground/5 relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-8 relative z-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent p-1 shadow-xl transition-transform group-hover:scale-105">
                            <div className="w-full h-full rounded-[1.4rem] bg-background flex items-center justify-center overflow-hidden">
                                <User size={40} className="text-foreground/80" />
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center border-4 border-background shadow-lg hover:scale-110 transition-all">
                            <CheckCircle2 size={16} />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Admin Console</h1>
                        <p className="text-foreground/40 mt-1 flex items-center gap-2 font-bold tracking-widest text-[10px] uppercase">
                            <Shield size={12} className="text-primary" />
                            Security Level: High Priority
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => show("Updating profile profile...", "success")}
                    className="px-8 py-3 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-lg relative z-10"
                >
                    Edit Profile
                </button>
            </div>

            <div className="space-y-8">
                <SettingSection title="Account Integrity">
                    <SettingItem
                        icon={Mail}
                        title="Primary Email"
                        description="admin@ilacs-infrastructure.io"
                        badge="Verified"
                        onClick={() => show("Email update portal not available", "warning")}
                    />
                    <SettingItem
                        icon={Smartphone}
                        title="Recovery Phone"
                        description="Ends in ••42"
                        onClick={() => show("Contacting carrier...", "info")}
                    />
                </SettingSection>

                <SettingSection title="System Shield">
                    <SettingItem
                        icon={Lock}
                        title="Security Keys"
                        description="Manage physical YubiKey hardware"
                        badge="2 Active"
                        onClick={() => show("Scanning for security keys...", "info")}
                    />
                    <SettingItem
                        icon={Shield}
                        title="Multi-Factor Auth"
                        description="Require bio-metric verification for access"
                        isToggle
                        value={mfa}
                        onClick={() => { setMfa(!mfa); show(mfa ? "MFA Disabled" : "MFA Enabled", mfa ? "warning" : "success"); }}
                    />
                    <SettingItem
                        icon={AlertCircle}
                        title="Activity Logs"
                        description="View last 50 system-wide login attempts"
                        onClick={() => show("Loading audit logs...", "info")}
                    />
                </SettingSection>

                <SettingSection title="Preference Hub">
                    <SettingItem
                        icon={Bell}
                        title="Node Notifications"
                        description="Alert when terminal load exceeds 90%"
                        isToggle
                        value={notifications}
                        onClick={() => { setNotifications(!notifications); show("Notify settings updated", "info"); }}
                    />
                    <SettingItem
                        icon={theme === 'dark' ? Moon : Sun}
                        title={theme === 'dark' ? "Neural Interface (Dark)" : "Standard Interface (Light)"}
                        description="Optimize UI for ambient lighting conditions"
                        isToggle
                        value={theme === 'dark'}
                        onClick={() => { toggleTheme(); show(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} mode`, "info"); }}
                    />
                    <SettingItem
                        icon={Globe}
                        title="Telemetry Region"
                        description="North Atlantic (EU-WEST-1)"
                        onClick={() => show("Switching regional context...", "info")}
                    />
                </SettingSection>

                <div className="pt-8 border-t border-foreground/5 mx-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-error mb-4">Danger Zone</h3>
                    <div className="glass-card border border-error/20 bg-error/5 rounded-[2rem] overflow-hidden divide-y divide-foreground/5">
                        <SettingItem
                            icon={AlertCircle}
                            title="Reset Terminal Matrix"
                            description="Flush all node metadata and restart sync"
                            danger
                            onClick={() => show("Warning: This action requires senior admin clearance", "error")}
                        />
                        <SettingItem
                            icon={LogOut}
                            title="Terminate Session"
                            description="Securely logout and clear local credentials"
                            danger
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className="flex justify-center gap-10 pt-10">
                <button onClick={() => show("Displaying Terms of Service...", "info")} className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-primary transition-colors">Terms of Service</button>
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/10 mt-1.5"></div>
                <button onClick={() => show("Displaying Privacy Policy...", "info")} className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-primary transition-colors">Privacy Policy</button>
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/10 mt-1.5"></div>
                <button onClick={() => show("Opening Support Portal...", "info")} className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 hover:text-primary transition-colors">Support</button>
            </div>
        </div>
    );
}
