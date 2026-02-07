"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { LogIn, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
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
  const { profile, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(searchParams.get("error"));

  useEffect(() => {
    if (!isAuthLoading && profile) {
      router.push("/");
    }
  }, [profile, isAuthLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLocalError(null);

    const supabase = createClient();

    try {
      console.log(`[Client Login] Attempting login for: ${email}, requiredRole: ${role}`);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setLocalError(authError.message);
        setIsLoggingIn(false);
        return;
      }

      if (!authData.user) {
        setLocalError("Authentication failed: No user returned.");
        setIsLoggingIn(false);
        return;
      }

      // Verify Role on Client
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error("[Client Login] Role verification failed.", {
          userId: authData.user.id,
          error: profileError,
          data: profileData,
        });
        await supabase.auth.signOut();
        setLocalError(
          profileError
            ? `Database Error: ${profileError.message}`
            : "Your account exists in Auth but has no Profile in the database."
        );
        setIsLoggingIn(false);
        return;
      }

      // If role doesn't match, we still allow login but warn in console
      if (profileData.role !== role) {
        console.warn(`[Client Login] Role mismatch. Required: ${role}, Found: ${profileData.role}. Proceeding anyway.`);
      }

      console.log("[Client Login] Success. Redirecting...");
      router.push("/");
    } catch (err) {
      console.error("[Client Login] Unexpected error:", err);
      setLocalError("An unexpected error occurred. Please try again.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="p-6 min-h-[60vh] flex items-center justify-center font-poppins">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Back Navigation */}
        <div className="space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Selection
          </Link>

          {/* Header */}
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transform transition-transform hover:scale-105 duration-300",
                themeColor,
              )}
            >
              <Icon size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                {roleTitle}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="relative overflow-hidden group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-8 space-y-6">

          {/* Ambient Glow */}
          <div
            className={cn(
              "absolute -top-20 -right-20 w-40 h-40 blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none",
              themeColor,
            )}
          ></div>

          {localError && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error animate-shake">
              <AlertCircle size={18} />
              <p className="text-xs font-bold leading-none">{localError}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-1">
                Node Identity (Email)
              </label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@portflow.dz"
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                required
                disabled={isLoggingIn}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Access Token (Password)
                </label>
              </div>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                required
                disabled={isLoggingIn}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={cn(
                "w-full py-4 rounded-xl text-white font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-lg shadow-current/20 hover:shadow-current/40 hover:-translate-y-0.5",
                themeColor,
                isLoggingIn && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Synchronizing...
                </>
              ) : (
                "Establish Connection"
              )}
            </button>
          </form>

          {role === "DISPATCHER" && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center relative z-10">
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
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
