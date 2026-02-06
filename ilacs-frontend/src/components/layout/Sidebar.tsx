"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Map as MapIcon,
    Calendar,
    Truck,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { useAuthStore, Role } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    roles: Role[];
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin", "terminal_op", "carrier"] },
    { label: "Port Map", href: "/map", icon: MapIcon, roles: ["admin"] },
    { label: "Manage Terminals", href: "/terminals", icon: ShieldCheck, roles: ["admin"] },
    { label: "Bookings", href: "/bookings", icon: Calendar, roles: ["terminal_op", "carrier"] },
    { label: "Fleet Status", href: "/fleet", icon: Truck, roles: ["carrier", "terminal_op"] },
    { label: "User Management", href: "/users", icon: Users, roles: ["admin"] },
    { label: "Settings", href: "/settings", icon: Settings, roles: ["admin", "terminal_op", "carrier"] },
];

export const SidebarContent = () => {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const filteredItems = navItems.filter(item =>
        user ? item.roles.includes(user.role) : false
    );

    return (
        <div className="flex-1 py-6 px-4 space-y-1">
            {filteredItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                            isActive
                                ? "bg-primary text-white shadow-md shadow-primary/10"
                                : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={20} className={cn(isActive ? "text-white" : "text-foreground/40 group-hover:text-primary transition-colors")} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight size={14} />}
                    </Link>
                );
            })}
        </div>
    );
};

export const Sidebar = () => {
    const { logout } = useAuthStore();

    return (
        <aside className="w-64 glass fixed left-0 top-16 bottom-0 z-40 border-r border-white/10 hidden lg:flex flex-col">
            <SidebarContent />

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-foreground/60 hover:bg-error/10 hover:text-error transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};
