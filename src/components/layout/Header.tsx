"use client";

import React, { useState } from "react";
import { usePathname, Link, useRouter } from "@/i18n/routing";
import { Settings, User, LogOut, Building2, Mail, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Logging", href: "/loggings" },
  { label: "Manage", href: "/fleet" },
  { label: "Analytics", href: "/settings" },
];

interface HeaderProps {
  onOpenSettings?: () => void;
}

export const Header = ({ onOpenSettings }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname?.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header
      className="w-full flex items-center justify-between"
      style={{ padding: "22px 64px" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div
          className="flex items-center justify-center rounded-lg bg-brand-text"
          style={{ width: 38, height: 38 }}
        >
          {/* Shipping icon placeholder */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>
        <span
          className="font-[var(--font-montserrat)] text-brand-text dark:text-foreground"
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          Test
        </span>
      </Link>

      {/* Centered Pill Nav */}
      <nav
        className="flex items-center backdrop-blur-[50px] relative"
        style={{
          background: "var(--nav-pill-bg)",
          borderRadius: 200,
          padding: "8px", 
          gap: 4,
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative px-5 py-2 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-tile-blue z-10",
                active
                  ? "text-white"
                  : "text-inactive-nav dark:text-foreground/70 hover:text-foreground",
              )}
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-[rgb(107,171,255)] to-[rgb(75,151,251)] z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-tile-blue"
          title="Settings"
        >
          <Settings size={22} />
        </button>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="p-1 rounded-xl hover:bg-foreground/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-tile-blue"
                    title="User menu"
                >
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden border border-foreground/10">
                        {profile?.username ? (
                            <span className="font-bold text-xs">{profile.username[0].toUpperCase()}</span>
                        ) : (
                            <User size={18} className="text-foreground/60" />
                        )}
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-64 glass-card-geo p-4 z-50 flex flex-col gap-4 border-none animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="flex items-center gap-3 pb-3 border-b border-foreground/5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {profile?.username?.[0]?.toUpperCase() ?? <User size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate text-foreground">{profile?.username || "User"}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Shield size={10} className="text-primary/60" />
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{profile?.role?.replace("_", " ")}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="space-y-2">
                        {profile?.organisation && (
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                                <Building2 size={14} className="text-foreground/30" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest leading-none mb-1">Organization</p>
                                    <p className="text-xs font-semibold text-foreground/70 truncate">{profile.organisation.name}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-foreground/[0.02] border border-foreground/5">
                            <Mail size={14} className="text-foreground/30" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest leading-none mb-1">Email (Internal)</p>
                                <p className="text-xs font-semibold text-foreground/70 truncate">{profile?.username}@portflow.com</p>
                            </div>
                        </div>
                    </div>

                    <DropdownMenuItem asChild>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-error/10 text-error hover:text-error transition-colors text-sm font-medium border border-transparent hover:border-error/20 outline-none"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
