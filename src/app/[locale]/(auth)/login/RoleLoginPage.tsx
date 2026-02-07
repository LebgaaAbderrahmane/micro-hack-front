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
        .single();

      if (profileError || !profileData) {
        console.error("[Client Login] Profile fetch failed:", profileError);
        await supabase.auth.signOut();
        setLocalError("Profile not found. Please contact support.");
        setIsLoggingIn(false);
        return;
      }

      // If role doesn't match, we used to block login. 
      // However, since all dashboards are accessible via /, we should just allow it 
      // and let the main layout handle the role-based dashboard rendering.
      if (profileData.role !== role) {
        console.warn(`[Client Login] Role mismatch. Required: ${role}, Found: ${profileData.role}. Proceeding anyway.`);
        // We do NOT sign out here to prevent login loops.
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

        <div className="glass-card p-8 space-y-6 bg-foreground/5 border border-foreground/10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div
            className={cn(
              "absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity",
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
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1">
                Node Identity (Email)
              </label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@portflow.dz"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-sm font-medium"
                required
                disabled={isLoggingIn}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                  Access Token (Password)
                </label>
              </div>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-sm font-medium"
                required
                disabled={isLoggingIn}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={cn(
                "w-full py-4 rounded-xl text-white font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2",
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
            <div className="pt-4 border-t border-foreground/5 text-center">
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
