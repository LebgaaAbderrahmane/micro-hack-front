"use client";

import { useState } from "react";
import {
  Shield,
  Ship,
  Truck,
  LogIn,
  User,
  Building,
  Landmark,
  Loader2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const orgName = formData.get("orgName") as string;
    const nif = formData.get("nif") as string;

    const supabase = createClient();

    try {
      // 1. Sign up user in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
          data: {
            username,
            role: "DISPATCHER",
          },
        },
      });

      if (authError || !authData.user) {
        toast.error(authError?.message || "Could not authenticate user");
        setIsLoading(false);
        return;
      }

      // 2. Create Carrier Organization
      const { data: orgData, error: orgError } = await supabase
        .from("organisations")
        .insert({
          name: orgName,
          nif: nif,
          type: "CARRIER",
        })
        .select()
        .single();

      if (orgError) {
        toast.error(`Failed to create organization: ${orgError.message}`);
        setIsLoading(false);
        return;
      }

      // 3. Create User Profile
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        username: username,
        org_id: orgData.id,
        role: "DISPATCHER",
      });

      if (profileError) {
        toast.error(`Failed to create user profile: ${profileError.message}`);
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully. Redirecting...");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 p-4 rounded-2xl border border-primary/20">
              <Ship className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Carrier Registration
          </h1>
          <p className="text-foreground/60 font-medium">
            Register your transport company
          </p>
        </div>

        <div className="bg-foreground/5 border border-foreground/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">
                Email Address
              </label>
              <div className="relative">
                <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input
                    name="orgName"
                    type="text"
                    placeholder="Logistics Co."
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-1">
                  NIF
                </label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input
                    name="nif"
                    type="text"
                    placeholder="12345678"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-foreground/40 text-sm font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
