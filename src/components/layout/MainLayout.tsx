"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { usePathname } from "@/i18n/routing";
import { AIAssistant } from "../common/AIAssistant";
import { Sidebar } from "./Sidebar";


export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isAuthPage = pathname?.includes("/login");

    if (isAuthPage) {
        return <main className="min-h-screen bg-background">{children}</main>;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 lg:ml-64 pt-20 min-h-screen transition-all duration-300">
                    <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>

            <AIAssistant />
        </div>
    );
};
