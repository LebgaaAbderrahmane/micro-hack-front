"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
}

export const Logo = ({ className, iconOnly = false }: LogoProps) => {
    return (
        <div className={cn("flex items-center gap-3 select-none group cursor-pointer", className)}>
            <div className="relative">
                <Image 
                    src="/logo.svg" 
                    alt="Logo" 
                    width={iconOnly ? 40 : 130} 
                    height={40}
                    className="object-contain dark:brightness-0 dark:invert"
                    priority
                />
            </div>
        </div>
    );
};
