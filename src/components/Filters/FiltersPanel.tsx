"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersPanelProps {
    onClose: () => void;
    isOpen: boolean;
    onApply: (filters: any) => void;
}

const userTypes = ["Admin Users", "Operators", "Carriers", "All Users"];
const activityTypes = ["User Activity", "New Booking", "Deleted Booking", "Updated Booking"];

export const FiltersPanel = ({ onClose, isOpen, onApply }: FiltersPanelProps) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [dateError, setDateError] = useState<string | null>(null);

    // Validate dates whenever they change
    useEffect(() => {
        if (fromDate && toDate && fromDate > toDate) {
            setDateError("'From' date cannot be after 'To' date");
        } else {
            setDateError(null);
        }
    }, [fromDate, toDate]);

    // Handle early return AFTER hooks to satisfy Rules of Hooks
    if (!isOpen) return null;

    const toggleUser = (user: string) => {
        if (user === "All Users") {
            setSelectedUsers(selectedUsers.includes("All Users") ? [] : [...userTypes]);
        } else {
            const nextUsers = selectedUsers.includes(user)
                ? selectedUsers.filter(u => u !== user)
                : [...selectedUsers, user];

            const specificRoles = userTypes.filter(u => u !== "All Users");
            const allSpecificSelected = specificRoles.every(role => nextUsers.includes(role));

            if (allSpecificSelected && !nextUsers.includes("All Users")) {
                setSelectedUsers([...nextUsers, "All Users"]);
            } else if (!allSpecificSelected && nextUsers.includes("All Users")) {
                setSelectedUsers(nextUsers.filter(u => u !== "All Users"));
            } else {
                setSelectedUsers(nextUsers);
            }
        }
    };

    const toggleActivity = (type: string) => {
        setSelectedActivities(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleReset = () => {
        setFromDate("");
        setToDate("");
        setSelectedUsers([]);
        setSelectedActivities([]);
        setDateError(null);
    };

    const handleApply = () => {
        if (dateError) return;

        onApply({
            fromDate,
            toDate,
            users: selectedUsers,
            activities: selectedActivities
        });
        onClose();
    };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className="fixed inset-0 z-40 bg-black/5 sm:hidden"
                onClick={onClose}
            />

            <div
                className={cn(
                    "fixed sm:absolute z-50",
                    "top-[100px] sm:top-[calc(100%+12px)]",
                    "right-4 sm:right-0",
                    "w-[calc(100vw-32px)] sm:w-[400px]",
                    "max-h-[calc(100vh-120px)] sm:max-h-[70vh]",
                    "bg-background border border-border-light rounded-xl shadow-2xl",
                    "flex flex-col animate-in fade-in slide-in-from-top-2 duration-200"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border-div flex-none rounded-t-xl">
                    <h3 className="text-lg font-semibold font-poppins text-foreground">Filters</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-foreground/5 rounded-full transition-colors"
                    >
                        <X size={20} className="text-foreground/60" />
                    </button>
                </div>

                {/* Scrollable Container */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar overflow-x-hidden">
                    <div className="space-y-8">
                        {/* Date Range */}
                        <section>
                            <div className="flex items-center gap-2 mb-4 text-foreground">
                                <CalendarIcon size={18} />
                                <span className="font-medium font-poppins">Date Range</span>
                            </div>
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/40 uppercase tracking-wider">From</label>
                                    <div className={cn(
                                        "relative border rounded-lg px-3 py-2 bg-foreground/5 flex items-center transition-colors min-w-0",
                                        dateError ? "border-red-500" : "border-border-light"
                                    )}>
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="w-full bg-transparent outline-none text-sm font-poppins min-w-0 [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/40 uppercase tracking-wider">To</label>
                                    <div className={cn(
                                        "relative border rounded-lg px-3 py-2 bg-foreground/5 flex items-center transition-colors min-w-0",
                                        dateError ? "border-red-500" : "border-border-light"
                                    )}>
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="w-full bg-transparent outline-none text-sm font-poppins min-w-0 [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>
                            {dateError && (
                                <div className="mt-2 text-red-500 text-xs flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    <span>{dateError}</span>
                                </div>
                            )}
                        </section>

                        {/* Users */}
                        <section>
                            <span className="font-medium font-poppins text-foreground block mb-4">Users</span>
                            <div className="space-y-3">
                                {userTypes.map((userType) => (
                                    <label key={userType} className="flex items-center gap-3 cursor-pointer group min-w-0">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedUsers.includes(userType)}
                                            onChange={() => toggleUser(userType)}
                                        />
                                        <div className={cn(
                                            "flex-none w-5 h-5 border-2 rounded flex items-center justify-center transition-all",
                                            selectedUsers.includes(userType) ? "bg-primary border-primary" : "border-border-light group-hover:border-primary"
                                        )}>
                                            {selectedUsers.includes(userType) && <Check size={14} className="text-white" />}
                                        </div>
                                        <span className="text-sm font-poppins text-foreground/70 truncate">{userType}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Activity Type */}
                        <section>
                            <span className="font-medium font-poppins text-foreground block mb-4">Activity Type</span>
                            <div className="space-y-3">
                                {activityTypes.map((type) => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer group min-w-0">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedActivities.includes(type)}
                                            onChange={() => toggleActivity(type)}
                                        />
                                        <div className={cn(
                                            "flex-none w-5 h-5 border-2 rounded flex items-center justify-center transition-all",
                                            selectedActivities.includes(type) ? "bg-primary border-primary" : "border-border-light group-hover:border-primary"
                                        )}>
                                            {selectedActivities.includes(type) && <Check size={14} className="text-white" />}
                                        </div>
                                        <span className="text-sm font-poppins text-foreground/70 truncate">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-border-div flex items-center justify-between gap-4 flex-none rounded-b-xl">
                    <button
                        onClick={handleReset}
                        className="flex-1 py-2.5 border border-border-light rounded-lg text-sm font-medium font-poppins hover:bg-foreground/5 text-foreground transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={!!dateError}
                        className={cn(
                            "flex-[1.5] py-2.5 text-white rounded-lg text-sm font-semibold font-poppins transition-all shadow-lg",
                            dateError
                                ? "bg-gray-300 cursor-not-allowed shadow-none"
                                : "hover:bg-primary/90 shadow-primary/20"
                        )}
                        style={!dateError ? { background: "linear-gradient(179.91deg, rgb(107,171,255) 0.2%, rgb(75,151,251) 99.8%)" } : {}}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
};
