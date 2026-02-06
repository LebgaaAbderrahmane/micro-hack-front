"use client";

import React from "react";
import { useAuthStore, Role } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { Shield, Ship, Truck, LogIn } from "lucide-react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const { login: storeLogin } = useAuthStore();
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    // ... kept for demo purposes
    const mockUser = {
      id: "1",
      email: `${role}@ilacs.com`,
      role: role,
      firstName: role
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      lastName: "User",
      company: role === "carrier" ? "TransGlobal Logistics" : undefined,
      terminalId: role === "terminal_op" ? "T-001" : undefined,
    };
    storeLogin(mockUser);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-primary/20">
              I
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ILACS</h1>
              <p className="text-foreground/50 text-sm">
                Intelligent Logistics Access Control
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back.
            </h2>
            <p className="text-foreground/60 max-w-md">
              The next generation of maritime port access management. Select
              your role to enter the portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleRoleSelect("admin")}
              className="glass-card p-6 flex flex-col items-center gap-4 hover:border-primary/50 hover:bg-primary/5 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <span className="font-semibold text-sm">Admin</span>
            </button>

            <button
              onClick={() => handleRoleSelect("terminal_op")}
              className="glass-card p-6 flex flex-col items-center gap-4 hover:border-secondary/50 hover:bg-secondary/5 group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <Ship size={24} />
              </div>
              <span className="font-semibold text-sm">Terminal Op</span>
            </button>

            <button
              onClick={() => handleRoleSelect("carrier")}
              className="glass-card p-6 flex flex-col items-center gap-4 hover:border-accent/50 hover:bg-accent/5 group"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Truck size={24} />
              </div>
              <span className="font-semibold text-sm">Carrier</span>
            </button>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6 hidden md:block">
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/40">
              <LogIn size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">System Login</h3>
              <p className="text-xs text-foreground/40">
                Enter your credentials to continue
              </p>
            </div>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                formAction={login}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Sign In
              </button>
              <button
                formAction={signup}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all active:scale-95"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="text-center">
            <a
              href="#"
              className="text-xs text-primary/60 hover:text-primary underline transition-colors"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
