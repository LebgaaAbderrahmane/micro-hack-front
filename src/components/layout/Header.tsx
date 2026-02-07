"use client";

import React from "react";
import { usePathname, Link, useRouter } from "@/i18n/routing";
import { Bell, User, LogOut, Settings, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", href: "/", roles: ["ADMIN", "OPERATOR", "DISPATCHER"] },
  { label: "Bookings", href: "/bookings", roles: ["ADMIN", "OPERATOR"] },
  { label: "Manage", href: "/fleet", roles: ["ADMIN", "DISPATCHER"] },
  { label: "Analytics", href: "/settings", roles: ["ADMIN"] },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { profile: user, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname?.startsWith(href);
  };

  const filteredItems = navItems.filter(item => {
    // Fallback to OPERATOR view if no user is logged in (for development/demo)
    const userRole = user?.role || "OPERATOR";
    return item.roles.includes(userRole);
  });

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
        className="flex items-center backdrop-blur-[50px]"
        style={{
          background: "var(--nav-pill-bg)",
          borderRadius: 200,
          padding: "10px 24px",
          gap: 8,
        }}
      >
        {filteredItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative px-5 py-2 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-tile-blue focus-visible:ring-offset-2",
                active
                  ? "text-white rounded-full"
                  : "text-inactive-nav dark:text-foreground/70 hover:text-foreground rounded-full",
              )}
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 12,
                fontWeight: 500,
                ...(active
                  ? {
                    background:
                      "linear-gradient(179.92deg, rgb(107,171,255) 0.2%, rgb(75,151,251) 99.8%)",
                    borderRadius: 200,
                  }
                  : {}),
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-tile-blue"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={22} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 rounded-xl hover:bg-foreground/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-tile-blue group"
              title="User menu"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden border border-foreground/5 group-hover:border-foreground/20 transition-all">
                {user?.username ? (
                  <span className="font-bold text-sm text-foreground/70">{user.username[0].toUpperCase()}</span>
                ) : (
                  <User size={18} className="text-foreground/60" />
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
              onClick={async () => {
                const toastId = toast.loading("Signing out...");
                try {
                  console.log("[Header] Initiating logout...");
                  await signOut();
                  console.log("[Header] Logout successful, redirecting...");
                  toast.success("Signed out successfully", { id: toastId });
                  router.push("/login");
                } catch (error) {
                  console.error("[Header] Logout failed:", error);
                  toast.error("Logout failed, redirecting anyway...", { id: toastId });
                  // Force redirect even on error
                  router.push("/login");
                }
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
