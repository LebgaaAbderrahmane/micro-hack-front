"use client";

import React from "react";
import { Ship } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <div className={cn("flex items-center gap-3 select-none group cursor-pointer", className)}>
            <div className="relative">
                <div className="ml-15 w-20 h-auto flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <img
                        src="/APCS_New_Logo.svg"
                        alt="APCS Logo"
                        className="w-full h-full object-contain scale-[1.3] filter dark:invert dark:brightness-200 contrast-125"
                    />
                </div>
            </div>
        </div>
    );
};
