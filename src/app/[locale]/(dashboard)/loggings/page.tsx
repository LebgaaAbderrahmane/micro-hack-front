"use client";

import React, { useState } from "react";
import { SearchInput } from "@/components/ActionBar/SearchInput";
import { FilterButton, ExportButton } from "@/components/ActionBar/ActionButtons";
import { FiltersPanel } from "@/components/Filters/FiltersPanel";
import { ActivityList } from "@/components/Activity/ActivityList";
import { ExportModal } from "@/components/ActionBar/ExportModal";
import useDebounce from "@/hooks/useDebounce";

export default function LoggingPage() {
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
