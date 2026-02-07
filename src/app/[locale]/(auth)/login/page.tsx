"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, Link } from "@/i18n/routing";
import { Shield, Ship, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations("Login");

  useEffect(() => {
    if (!isLoading && profile) {
      router.push("/");
    }
  }, [profile, isLoading, router]);

  const cards = [
    {
      role: "admin",
      href: "/login/admin",
      icon: Shield,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "hover:border-blue-200 dark:hover:border-blue-800",
      hoverBg: "hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
      shadowColor: "shadow-blue-500/10"
    },
    {
      role: "operator",
      href: "/login/operator",
      icon: Ship,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "hover:border-emerald-200 dark:hover:border-emerald-800",
      hoverBg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10",
      shadowColor: "shadow-emerald-500/10"
    },
    {
      role: "carrier",
      href: "/login/carrier",
      icon: Truck,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "hover:border-amber-200 dark:hover:border-amber-800",
      hoverBg: "hover:bg-amber-50/50 dark:hover:bg-amber-900/10",
      shadowColor: "shadow-amber-500/10"
    }
  ];

  return (
    <div className="p-6 w-full font-poppins">
      <div className="w-full max-w-5xl mx-auto space-y-16">

        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center font-black text-4xl text-white shadow-2xl shadow-primary/30 transform hover:scale-105 transition-transform duration-500">
              I
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <Link
              key={card.role}
              href={card.href}
              className={cn(
                "group relative overflow-hidden p-10 flex flex-col items-center gap-8 text-center",
                "bg-white dark:bg-slate-900/50 backdrop-blur-xl",
                "border border-slate-200 dark:border-slate-800",
                "rounded-[2.5rem] transition-all duration-500 ease-out",
                "hover:-translate-y-2 hover:shadow-2xl",
                card.borderColor,
                card.hoverBg,
                card.shadowColor
              )}
            >
              <div
                className={cn(
                  "w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg",
                  card.bgColor,
                  card.color
                )}
              >
                <card.icon size={40} strokeWidth={2.5} />
              </div>

              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                  {t(card.role)}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-2">
                  {t(`${card.role}Desc`)}
                </p>
              </div>

              {/* Decorative background element on hover */}
              <div className={cn(
                "absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700",
                card.color.split(" ")[0].replace("text-", "bg-")
              )} />
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            {t("footer")}
          </p>
        </div>
      </div>
    </div>
  );
}
