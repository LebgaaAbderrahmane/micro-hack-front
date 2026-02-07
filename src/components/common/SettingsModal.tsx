"use client";

import React, { useTransition, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Languages, Sun, Moon, Loader2, Monitor, LogOut, Shield, User, Bell, Layout, Globe, Settings2 } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = 'general' | 'appearance' | 'account' | 'notifications';

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Theme");
  const [isPending, startTransition] = useTransition();
  const { profile: user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  const handleLanguageChange = (newLocale: "en" | "fr") => {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const sections = [
    { id: 'general', label: 'General', icon: Settings2 },
    { id: 'appearance', label: 'Appearance', icon: Layout },
    { id: 'account', label: 'Account Security', icon: Shield },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="w-full max-w-4xl h-[600px] glass-card-geo relative z-10 overflow-hidden flex shadow-2xl border-white/10"
          >
            {/* Sidebar */}
            <div className="w-64 bg-foreground/3 border-r border-white/5 flex flex-col p-6">
              <div className="mb-10">
                <h2 className="text-xl font-black tracking-tighter text-foreground flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full animate-pulse" />
                  SYSTEM
                </h2>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mt-1">Configuration Node</p>
              </div>

              <div className="flex-1 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as SettingsSection)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                        : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <section.icon size={18} className={cn("transition-transform group-hover:scale-110", activeSection === section.id ? "text-primary-foreground" : "text-primary")} />
                    <span className="text-sm font-bold tracking-tight">{section.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-error hover:bg-error/10 transition-all font-bold text-sm group"
                >
                  <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-background/20">
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-foreground/2">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/60">{activeSection}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/30 hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 dashboard-scroll">
                <AnimatePresence mode="wait">
                  {activeSection === 'general' && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <section className="space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                            <Globe size={20} />
                          </div>
                          <div>
                            <h4 className="font-black text-xs uppercase tracking-widest text-foreground/80">Regional Protocol</h4>
                            <p className="text-[10px] text-foreground/40 font-bold">Configure your primary interface language</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'en', label: 'English', sub: 'Primary Systems' },
                            { id: 'fr', label: 'Français', sub: 'Protocole Local' }
                          ].map((lang) => (
                            <button
                              key={lang.id}
                              onClick={() => handleLanguageChange(lang.id as any)}
                              disabled={isPending}
                              className={cn(
                                "flex flex-col items-start gap-1 p-5 rounded-3xl border transition-all relative overflow-hidden group",
                                locale === lang.id
                                  ? "bg-primary/5 border-primary shadow-inner"
                                  : "bg-foreground/2 border-foreground/5 hover:border-foreground/10 hover:bg-foreground/4"
                              )}
                            >
                              <span className={cn("text-base font-black transition-colors", locale === lang.id ? "text-primary" : "text-foreground")}>{lang.label}</span>
                              <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">{lang.sub}</span>
                              {locale === lang.id && (
                                <div className="absolute top-3 right-3">
                                  {isPending ? <Loader2 size={12} className="animate-spin text-primary" /> : <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {activeSection === 'appearance' && (
                    <motion.div
                      key="appearance"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <section className="space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-warning/10 text-warning">
                            <Sun size={20} />
                          </div>
                          <div>
                            <h4 className="font-black text-xs uppercase tracking-widest text-foreground/80">Visual Environment</h4>
                            <p className="text-[10px] text-foreground/40 font-bold">Optimize for your lighting conditions</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: 'light', label: 'Dynamic Light', icon: Sun },
                            { id: 'dark', label: 'Deep Dark', icon: Moon },
                            { id: 'system', label: 'Neural Sync', icon: Monitor }
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setTheme(t.id)}
                              className={cn(
                                "flex flex-col items-center justify-center gap-4 p-6 rounded-[32px] border transition-all group relative",
                                theme === t.id
                                  ? "bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.05]"
                                  : "bg-foreground/2 border-foreground/5 hover:bg-foreground/5"
                              )}
                            >
                              <t.icon size={28} className={cn("transition-transform group-hover:scale-110", theme === t.id ? "text-primary-foreground" : "text-primary")} />
                              <div className="text-center">
                                <span className={cn("text-xs font-black tracking-tight block", theme === t.id ? "text-primary-foreground" : "text-foreground")}>{t.label}</span>
                                <span className={cn("text-[8px] font-bold uppercase tracking-widest", theme === t.id ? "text-primary-foreground/60" : "text-foreground/30")}>{t.id}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </section>
                    </motion.div>
                  )}

                  {activeSection === 'account' && (
                    <motion.div
                      key="account"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="p-8 rounded-[40px] bg-foreground/3 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-colors group-hover:bg-primary/10" />
                        <div className="flex items-center gap-6 relative">
                          <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-black text-3xl shadow-2xl shadow-primary/20 border border-white/20">
                            {user?.username?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-2xl font-black tracking-tighter text-foreground leading-tight truncate">{user?.username || 'Authenticated User'}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                                {user?.role || 'Guest'}
                              </span>
                              <span className="text-[11px] font-bold text-foreground/30">{user?.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                          <div className="p-4 rounded-3xl bg-foreground/3 border border-white/5">
                            <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Security Status</p>
                            <p className="text-xs font-bold text-success flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                              Encrypted Session
                            </p>
                          </div>
                          <div className="p-4 rounded-3xl bg-foreground/3 border border-white/5">
                            <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Node Access</p>
                            <p className="text-xs font-bold text-foreground/80">{user?.organisation?.name || 'Authorized Proxy'}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
