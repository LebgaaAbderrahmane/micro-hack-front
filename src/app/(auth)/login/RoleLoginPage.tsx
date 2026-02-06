"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, ArrowLeft, AlertCircle } from "lucide-react";
import { login } from "./actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RoleLoginPageProps {
  role: "ADMIN" | "OPERATOR" | "DISPATCHER";
  roleTitle: string;
  description: string;
  icon: React.ElementType;
  themeColor: string;
}

export const RoleLoginPage = ({
  role,
  roleTitle,
  description,
  icon: Icon,
  themeColor,
}: RoleLoginPageProps) => {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!isLoading && profile) {
      router.push("/");
    }
  }, [profile, isLoading, router]);

  return (
    <div className="p-6 min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/40 hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Selection
          </Link>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl",
                themeColor,
              )}
            >
              <Icon size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">
                {roleTitle} Login
              </h1>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6 bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div
            className={cn(
              "absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity",
              themeColor,
            )}
          ></div>

          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error animate-shake">
              <AlertCircle size={18} />
              <p className="text-xs font-bold leading-none">{error}</p>
            </div>
          )}

          <form className="space-y-5">
            <input type="hidden" name="requiredRole" value={role} />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1">
                Node Identity (Email)
              </label>
              <input
                name="email"
                type="email"
                placeholder="identity@portflow.dz"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-sm font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                  Access Token (Password)
                </label>
                <a
                  href="#"
                  className="text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <input
                name="password"
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-sm font-medium"
                required
              />
            </div>

            <button
              formAction={login}
              className={cn(
                "w-full py-4 rounded-xl text-white font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-lg",
                themeColor,
              )}
            >
              Establish Connection
            </button>
          </form>

          {role === "DISPATCHER" && (
            <div className="pt-4 border-t border-white/5 text-center">
              <p className="text-foreground/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Are you a new carrier? <br />
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Register organizational node
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
