"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { usePathname } from "next/navigation";
import { AIAssistant } from "../common/AIAssistant";
import { useThemeStore } from "@/stores/useThemeStore";


export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const { theme, isHydrated } = useThemeStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && isHydrated) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [theme, mounted, isHydrated]);

    if (!mounted) return null;

    const isAuthPage = pathname === "/login";

    if (isAuthPage) {
        return <main className="min-h-screen bg-background">{children}</main>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 min-h-screen transition-all duration-300">
                <div className="max-w-[1600px] mx-auto p-8">
                    {children}
                </div>
            </main>

            <AIAssistant />
        </div>
    );
};
