"use client";

import React from "react";
import {
    LayoutDashboard,
    Calendar,
    Truck,
    Users,
    Settings,
    Search
} from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { Logo } from "../common/Logo";
import { Link, usePathname } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Navbar = () => {
    const { profile: user } = useAuth();
    const pathname = usePathname();
    const t = useTranslations('Dashboard');

    const navItems = [
        { label: t('overview'), href: "/", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "DISPATCHER"] },
        { label: t('bookings'), href: "/bookings", icon: Calendar, roles: ["OPERATOR", "DISPATCHER"] },
        { label: t('fleet'), href: "/fleet", icon: Truck, roles: ["DISPATCHER", "OPERATOR"] },
        { label: t('users'), href: "/users", icon: Users, roles: ["ADMIN"] },
    ];

    const filteredItems = navItems.filter(item =>
        user ? item.roles.includes(user.role) : false
    );

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

                <Link href="/settings" className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-foreground/40 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all">
                    <Settings size={20} />
                </Link>

                <div className="w-px h-6 bg-foreground/10 mx-2"></div>

                <Link href="/profile" className="relative group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 border border-foreground/10 flex items-center justify-center text-primary-foreground font-black text-sm shadow-xl shadow-primary/10 group-hover:scale-105 transition-all group-active:scale-95">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                </Link>
            </div>
        </nav>
    );
};
