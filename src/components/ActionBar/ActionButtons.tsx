"use client";

import React from "react";
import { Filter, ChevronDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
    onClick?: () => void;
    label: string;
    icon: React.ReactNode;
    showChevron?: boolean;
}

const ActionButton = ({ onClick, label, icon, showChevron }: ActionButtonProps) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-2.5 px-[22px] py-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-[42px]",
            "bg-background text-foreground border border-border-light rounded-lg",
            "hover:bg-foreground/5"
        )}
    >
        <div className="text-foreground">
            {icon}
        </div>
        <span className="text-sm font-poppins font-medium">
            {label}
        </span>
        {showChevron && <ChevronDown size={16} className="text-foreground/60 ml-0.5" />}
    </button>
);

export const FilterButton = ({ onClick }: { onClick?: () => void }) => (
    <ActionButton
        onClick={onClick}
        label="Filter"
        icon={<Filter size={18} />}
        showChevron
    />
);

export const ExportButton = ({ onClick }: { onClick?: () => void }) => (
    <ActionButton
        onClick={onClick}
        label="Export"
        icon={<Download size={18} />}
    />
);
