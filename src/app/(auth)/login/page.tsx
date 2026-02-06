"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Shield, Ship, Truck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && profile) {
      router.push("/");
    }
  }, [profile, isLoading, router]);

  return (
    <div className="p-6">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center font-black text-3xl text-white shadow-2xl shadow-primary/20">
              I
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              Access Gateway
            </h1>
            <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">
              Secure node entry & identity verification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/login/admin"
            className="glass-card p-10 flex flex-col items-center gap-6 hover:border-primary/50 hover:bg-primary/5 group transition-all duration-500 border border-white/5 bg-white/5 rounded-[2rem] text-center"
          >
            <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/10">
              <Shield size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Port Admin
              </h3>
              <p className="text-xs text-foreground/40 mt-2 font-medium">
                System-level node orchestration
              </p>
            </div>
          </Link>

          <Link
            href="/login/operator"
            className="glass-card p-10 flex flex-col items-center gap-6 hover:border-secondary/50 hover:bg-secondary/5 group transition-all duration-500 border border-white/5 bg-white/5 rounded-[2rem] text-center"
          >
            <div className="w-20 h-20 rounded-[1.5rem] bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-xl shadow-secondary/10">
              <Ship size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Terminal Op
              </h3>
              <p className="text-xs text-foreground/40 mt-2 font-medium">
                Yard & berth management
              </p>
            </div>
          </Link>

          <Link
            href="/login/carrier"
            className="glass-card p-10 flex flex-col items-center gap-6 hover:border-accent/50 hover:bg-accent/5 group transition-all duration-500 border border-white/5 bg-white/5 rounded-[2rem] text-center"
          >
            <div className="w-20 h-20 rounded-[1.5rem] bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl shadow-accent/10">
              <Truck size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Carrier Portal
              </h3>
              <p className="text-xs text-foreground/40 mt-2 font-medium">
                Fleet sync & slot reservation
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-foreground/30 text-xs font-bold uppercase tracking-widest">
            Protected by ILACS Quantum Encryption Node A-14
          </p>
        </div>
      </div>
    </div>
  );
}
