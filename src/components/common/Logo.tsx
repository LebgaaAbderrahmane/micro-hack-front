"use client";

import React from "react";
import { Ship } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
}

export const Logo = ({ className, iconOnly = false }: LogoProps) => {
    return (
        <div className={cn("flex items-center gap-3 select-none group cursor-pointer", className)}>
            <div className="relative">
                <div className="w-10 h-10 bg-primary/20 text-primary border border-primary/30 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Ship size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background animate-pulse"></div>
            </div>
            {!iconOnly && (
                <div className="flex flex-col mt-[-2px]">
                    <span className="font-black text-xl tracking-tight text-foreground leading-none">
                        ILACS
                    </span>
                    <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-[0.2em] mt-1 leading-none">
                        Intelligent Logistics
                    </span>
                </div>
            )}
        </div>
    );
};
