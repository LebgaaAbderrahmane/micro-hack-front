"use client";

import React from "react";
import {
    LayoutDashboard,
    Calendar,
    Truck,
    Users,
    Settings,
    Search,
    BarChart3,
    FileText,
    LogOut,
    User as UserIcon
} from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { Logo } from "../common/Logo";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
    const { profile: user, signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('Dashboard');

    const navItems = [
        { label: t('overview'), href: "/", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "DISPATCHER"] },
        { label: t('analytics'), href: "/analytics", icon: BarChart3, roles: ["ADMIN", "OPERATOR"] },
        { label: "Bookings", href: "/bookings", icon: Calendar, roles: ["DISPATCHER"] },
        { label: t('manageBookings'), href: "/bookings", icon: Calendar, roles: ["OPERATOR"] },
        { label: "Fleet", href: "/fleet", icon: Truck, roles: ["DISPATCHER"] },
        { label: t('manageUsers'), href: "/manage", icon: Users, roles: ["ADMIN"] },
        { label: t('logs'), href: "/loggings", icon: FileText, roles: ["ADMIN", "OPERATOR"] },
    ];

    const filteredItems = (() => {
        if (!user || !user.role) return [];

        const roleOrder: Record<string, string[]> = {
            ADMIN: ["/", "/analytics", "/manage", "/loggings"],
            OPERATOR: ["/", "/analytics", "/bookings", "/loggings"],
            DISPATCHER: ["/", "/bookings", "/fleet"],
        };

        const targetOrder = roleOrder[user.role] || [];

        return navItems
            .filter(item => item.roles.includes(user.role))
            .sort((a, b) => {
                const indexA = targetOrder.indexOf(a.href);
                const indexB = targetOrder.indexOf(b.href);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });
    })();

    return (
        <nav className="h-20 glass fixed top-0 left-0 right-0 z-50 px-8 border-b border-foreground/5 flex items-center justify-between">
            <div className="flex items-center gap-12">
                <Link href="/">
                    <Logo />
                </Link>

                <div className="hidden lg:flex items-center gap-1">
                    {filteredItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative px-4 py-2 group"
                            >
                                <div className={cn(
                                    "flex items-center gap-2 text-sm font-bold transition-colors duration-300 relative z-10",
                                    isActive ? "text-primary" : "text-foreground/40 group-hover:text-foreground"
                                )}>
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/20"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-2xl border border-foreground/5 group transition-all focus-within:border-primary/50">
                    <Search size={18} className="text-foreground/20 group-hover:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        className="bg-transparent border-none outline-none text-sm placeholder:text-foreground/20 w-40 text-foreground"
                    />
                </div>

                <NotificationDropdown />

                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <div className="relative group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 border border-foreground/10 flex items-center justify-center text-primary-foreground font-black text-sm shadow-xl shadow-primary/10 group-hover:scale-105 transition-all group-active:scale-95">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-card-geo border-foreground/5 dark:border-primary/10 bg-glass-bg backdrop-blur-3xl p-2 z-[60]">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-foreground/5" />
                        <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-foreground/5" />
                        <DropdownMenuItem
                            onSelect={async (e) => {
                                e.preventDefault();
                                await signOut();
                                router.push('/login');
                            }}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};
