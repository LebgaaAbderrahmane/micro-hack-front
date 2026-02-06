"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, Link } from "@/i18n/routing";
import { Shield, Ship, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations("Login");

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
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center font-black text-3xl text-primary-foreground shadow-2xl shadow-primary/20">
              I
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-foreground">
              {t("title")}
            </h1>
            <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/login/admin"
            className="glass-card p-10 flex flex-col items-center gap-6 hover:border-primary/50 hover:bg-primary/5 group transition-all duration-500 border border-foreground/5 bg-foreground/5 rounded-[2rem] text-center"
          >
            <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl shadow-primary/10">
              <Shield size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                {t("admin")}
              </h3>
              <p className="text-xs text-foreground/40 mt-2 font-medium">
                {t("adminDesc")}
              </p>
            </div>
          </Link>

          <Link
            href="/login/operator"
            className="glass-card p-10 flex flex-col items-center gap-6 hover:border-secondary/50 hover:bg-secondary/5 group transition-all duration-500 border border-foreground/5 bg-foreground/5 rounded-[2rem] text-center"
          >
            <div className="w-20 h-20 rounded-[1.5rem] bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-500 shadow-xl shadow-secondary/10">
              <Ship size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                {t("operator")}
              </h3>
              <p className="text-xs text-foreground/40 mt-2 font-medium">
                {t("operatorDesc")}
              </p>
            </div>
          </Link>

          <Link
            href="/login/carrier"
            className="glass-card p-10 flex flex-col items-center gap-6 hover:border-accent/50 hover:bg-accent/5 group transition-all duration-500 border border-foreground/5 bg-foreground/5 rounded-[2rem] text-center"
          >
            <div className="w-20 h-20 rounded-[1.5rem] bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-500 shadow-xl shadow-accent/10">
              <Truck size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                {t("carrier")}
              </h3>
              <p className="text-xs text-foreground/40 mt-2 font-medium">
                {t("carrierDesc")}
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-foreground/30 text-xs font-bold uppercase tracking-widest">
            {t("footer")}
          </p>
        </div>
      </div>
    </div>
  );
}
