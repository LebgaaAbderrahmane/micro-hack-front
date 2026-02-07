"use client";

import React, { useState } from "react";
import { SearchInput } from "@/components/ActionBar/SearchInput";
import { FilterButton, ExportButton } from "@/components/ActionBar/ActionButtons";
import { FiltersPanel } from "@/components/Filters/FiltersPanel";
import { ActivityList } from "@/components/Activity/ActivityList";
import { ExportModal } from "@/components/ActionBar/ExportModal";
import useDebounce from "@/hooks/useDebounce";
import { useAuth } from "@/hooks/useAuth";

export default function LoggingPage() {
    const { profile } = useAuth();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const [filters, setFilters] = useState({
        search: "",
        fromDate: "",
        toDate: "",
        users: [] as string[],
        activities: [] as string[],
        actorId: profile?.role === "ADMIN" ? undefined : profile?.id // filter by self if not admin
    });

    const handleApplyFilters = (newFilters: any) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    // Sync search with filters
    React.useEffect(() => {
        setFilters(prev => ({ ...prev, search: debouncedSearch }));
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1080px] mx-auto py-10 min-h-screen">
            {/* Header */}
            <div className="px-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {profile?.role === "ADMIN" ? "System Audit Logs" : "My Activity Logs"}
                </h1>
                <p className="text-foreground/50 text-sm mt-1">
                    {profile?.role === "ADMIN" 
                        ? "Comprehensive overview of all system orchestration events" 
                        : "History of your node interactions and booking modifications"}
                </p>
            </div>

            {/* Action Bar */}
            <div className="relative flex items-center gap-6 w-full">
                <SearchInput value={search} onChange={handleSearchChange} />
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <FilterButton onClick={() => setIsFilterOpen(!isFilterOpen)} />
                        <FiltersPanel
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            onApply={handleApplyFilters}
                        />
                    </div>
                    <ExportButton onClick={() => setIsExportOpen(true)} />
                </div>
            </div>

            {/* Activity List */}
            <div className="w-full">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-semibold font-poppins text-brand-text">Recent Activity</h2>
                </div>
                <ActivityList filters={filters} />
            </div>

            {/* Modals */}
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                data={filters} // Pass filters for exporting
            />
        </div>
    );
}
