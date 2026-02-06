"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";
import { Header } from "./Header";
import { FloatingSettings } from "../common/FloatingSettings";

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
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "var(--background)" }}
        >
            {/* Swatch background overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    opacity: 0.2,
                }}
            />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-4">
                        {children}
                    </div>
                </main>
            </div>

            <FloatingSettings />
        </div>
    );
};
