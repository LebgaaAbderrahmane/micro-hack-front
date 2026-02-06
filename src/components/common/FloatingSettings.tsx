"use client";

import React, { useTransition } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Sun, Moon, Languages, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const FloatingSettings = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("Theme");
    const [isPending, startTransition] = useTransition();

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    const toggleLanguage = () => {
        const nextLocale = locale === "en" ? "fr" : "en";
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className="fixed bottom-6 right-24 flex items-center gap-3 z-[100]">
            {/* Language Toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                disabled={isPending}
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-foreground hover:text-primary transition-colors shadow-2xl group disabled:opacity-50"
                title={t("switchLocale", { language: locale === "en" ? "Français" : "English" })}
            >
                <div className="relative">
                    {isPending ? (
                        <Loader2 size={20} className="animate-spin text-primary" />
                    ) : (
                        <>
                            <Languages size={20} className="transition-transform group-hover:rotate-12" />
                            <span className="absolute -top-3 -right-3 text-[8px] font-black uppercase bg-primary/20 text-primary px-1 rounded-md border border-primary/20">
                                {locale}
                            </span>
                        </>
                    )}
                </div>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-foreground hover:text-primary transition-colors shadow-2xl group"
                title={t("toggle")}
            >
                {resolvedTheme === "dark" ? (
                    <Sun size={20} className="transition-transform group-hover:rotate-90" />
                ) : (
                    <Moon size={20} className="transition-transform group-hover:-rotate-12" />
                )}
            </motion.button>
        </div>
    );
};
