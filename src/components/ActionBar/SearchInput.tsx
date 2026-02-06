"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
    return (
        <div
            className={cn(
                "relative flex items-center bg-background border border-border-light rounded-lg overflow-hidden transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm"
            )}
            style={{ height: 42, flex: 1 }}
        >
            <div className="pl-4 text-foreground/40">
                <Search size={20} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search for users, activity or status..."
                className="w-full h-full px-3 pr-10 text-base font-poppins outline-none bg-transparent text-foreground placeholder:text-foreground/30"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-2 p-1.5 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground group"
                    title="Clear search"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};
