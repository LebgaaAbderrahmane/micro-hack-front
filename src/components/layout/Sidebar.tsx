"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  Map as MapIcon,
  Calendar,
  Truck,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    label: "Dashboard",
    href: "/operator/dashboard",
    icon: LayoutDashboard,
    roles: ["OPERATOR"],
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: Calendar,
    roles: ["DISPATCHER"],
  },
  {
    label: "Bookings",
    href: "/operator/bookings",
    icon: Calendar,
    roles: ["OPERATOR"],
  },
  {
    label: "Fleet Status",
    href: "/fleet",
    icon: Truck,
    roles: ["DISPATCHER"],
  },
  {
    label: "Terminal Yards",
    href: "/terminals",
    icon: ShieldCheck,
    roles: ["ADMIN"],
  },
  { label: "User Identity", href: "/users", icon: Users, roles: ["ADMIN"] },
  {
    label: "My Profile",
    href: "/profile",
    icon: UserCircle,
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    label: "System Settings",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN", "DISPATCHER"],
  },
];

export const SidebarContent = () => {
  const pathname = usePathname();
  const { profile } = useAuth();

  const filteredItems = navItems.filter((item) =>
    profile ? item.roles.includes(profile.role) : false,
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
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon
                size={20}
                className={cn(
                  isActive
                    ? "text-white"
                    : "text-foreground/40 group-hover:text-primary transition-colors",
                )}
              />
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
  const { signOut } = useAuth();

  return (
    <aside className="w-64 glass fixed left-0 top-16 bottom-0 z-40 border-r border-foreground/10 hidden lg:flex flex-col">
      <SidebarContent />

      <div className="p-4 border-t border-foreground/10">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-foreground/60 hover:bg-error/10 hover:text-error transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};
