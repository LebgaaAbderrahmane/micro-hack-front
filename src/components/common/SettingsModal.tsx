"use client";

import React, { useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Languages, Sun, Moon, Loader2, Monitor, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Theme"); // Assuming 'Theme' namespace exists as per FloatingSettings
  const [isPending, startTransition] = useTransition();
  const { signOut } = useAuth();

  const handleLanguageChange = (newLocale: "en" | "fr") => {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="w-[90vw] max-w-5xl h-[70vh] glass-card-geo p-10 relative z-10 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"/>
                Settings
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto pr-4 -mr-4 dashboard-scroll">
              {/* Language Section */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                  <Languages size={14} />
                  Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    disabled={isPending}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300",
                      locale === "en" 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.05]"
                    )}
                  >
                    <span className="font-bold">English</span>
                    {locale === "en" && !isPending && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    {locale === "en" && isPending && <Loader2 size={12} className="animate-spin" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    disabled={isPending}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300",
                      locale === "fr" 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.05]"
                    )}
                  >
                    <span className="font-bold">Français</span>
                    {locale === "fr" && !isPending && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    {locale === "fr" && isPending && <Loader2 size={12} className="animate-spin" />}
                  </button>
                </div>
              </div>

              {/* Theme Section */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                  <Monitor size={14} />
                  Appearance
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300",
                      theme === "light" 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.05]"
                    )}
                  >
                    <Sun size={16} />
                    <span className="font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300",
                      theme === "dark" 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.05]"
                    )}
                  >
                    <Moon size={16} />
                    <span className="font-medium">Dark</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-foreground/5">
                <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-error bg-error/5 hover:bg-error/10 transition-colors font-semibold"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
