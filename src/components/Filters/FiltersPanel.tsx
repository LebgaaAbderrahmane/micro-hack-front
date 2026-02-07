"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersPanelProps {
    onClose: () => void;
    isOpen: boolean;
    onApply: (filters: any) => void;
    type?: "activity" | "booking";
    centered?: boolean;
}

const userTypes = ["Admin Users", "Operators", "Carriers", "All Users"];
const activityTypes = ["User Activity", "New Booking", "Deleted Booking", "Updated Booking"];
const bookingStatuses = ["Confirmed", "Pending", "Rejected", "Cancelled"];

export const FiltersPanel = ({ onClose, isOpen, onApply, type = "activity", centered = false }: FiltersPanelProps) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
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
        setSelectedStatuses([]);
        setDateError(null);
    };

    const handleApply = () => {
        if (dateError) return;

        onApply({
            fromDate,
            toDate,
            users: selectedUsers,
            activities: selectedActivities,
            status: selectedStatuses
        });
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all",
                    centered ? "flex" : "sm:hidden"
                )}
                onClick={onClose}
            />

            <div
                className={cn(
                    "fixed z-50 transition-all duration-300",
                    centered
                        ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] sm:w-[500px]"
                        : "top-[100px] sm:top-[calc(100%+12px)] right-4 sm:right-0 w-[calc(100vw-32px)] sm:w-[400px] sm:absolute",
                    "max-h-[calc(100vh-120px)] sm:max-h-[80vh]",
                    "bg-background border border-border-light rounded-[2.5rem] shadow-2xl shadow-primary/10",
                    "flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-border-div flex-none">
                    <h3 className="text-xl font-bold font-poppins text-foreground">
                        {type === "booking" ? "Booking Filters" : "Filter Options"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Container */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar overflow-x-hidden">
                    <div className="space-y-10">
                        {/* Date Range Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 text-foreground">
                                <CalendarIcon size={20} className="text-primary" />
                                <span className="font-bold font-poppins uppercase tracking-widest text-[10px] opacity-40">Time Horizon</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-foreground/20 uppercase ml-1">Start Date</label>
                                    <div className={cn(
                                        "relative border rounded-2xl px-4 py-3 bg-foreground/2 flex items-center transition-all",
                                        dateError ? "border-error shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-border-light hover:border-primary/50"
                                    )}>
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="w-full bg-transparent outline-none text-sm font-bold scheme-light dark:scheme-dark"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-foreground/20 uppercase ml-1">End Date</label>
                                    <div className={cn(
                                        "relative border rounded-2xl px-4 py-3 bg-foreground/2 flex items-center transition-all",
                                        dateError ? "border-error shadow-[0_0_0_1px_rgba(239,68,68,0.2)]" : "border-border-light hover:border-primary/50"
                                    )}>
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="w-full bg-transparent outline-none text-sm font-bold scheme-light dark:scheme-dark"
                                        />
                                    </div>
                                </div>
                            </div>
                            {dateError && (
                                <div className="mt-3 text-error text-[10px] font-bold flex items-center gap-2 px-1">
                                    <AlertCircle size={14} />
                                    <span>{dateError}</span>
                                </div>
                            )}
                        </section>

                        {/* Content Sections */}
                        {type === "activity" ? (
                            <>
                                <section>
                                    <span className="font-bold text-[10px] uppercase tracking-widest text-foreground/20 block mb-6 ml-1">Identity Filter</span>
                                    <div className="grid grid-cols-2 gap-3">
                                        {userTypes.map((userType) => (
                                            <label key={userType} className="flex items-center gap-3 cursor-pointer group bg-foreground/2 p-4 rounded-[1.25rem] hover:bg-foreground/5 transition-all">
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedUsers.includes(userType)}
                                                    onChange={() => toggleUser(userType)}
                                                />
                                                <div className={cn(
                                                    "flex-none w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all",
                                                    selectedUsers.includes(userType) ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-border-light group-hover:border-primary"
                                                )}>
                                                    {selectedUsers.includes(userType) && <Check size={14} className="text-white" />}
                                                </div>
                                                <span className="text-xs font-bold text-foreground/60 truncate group-hover:text-foreground">{userType}</span>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <span className="font-bold text-[10px] uppercase tracking-widest text-foreground/20 block mb-6 ml-1">Event Type</span>
                                    <div className="grid grid-cols-2 gap-3">
                                        {activityTypes.map((type) => (
                                            <label key={type} className="flex items-center gap-3 cursor-pointer group bg-foreground/2 p-4 rounded-[1.25rem] hover:bg-foreground/5 transition-all">
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedActivities.includes(type)}
                                                    onChange={() => toggleActivity(type)}
                                                />
                                                <div className={cn(
                                                    "flex-none w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all",
                                                    selectedActivities.includes(type) ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-border-light group-hover:border-primary"
                                                )}>
                                                    {selectedActivities.includes(type) && <Check size={14} className="text-white" />}
                                                </div>
                                                <span className="text-xs font-bold text-foreground/60 truncate group-hover:text-foreground">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <section>
                                <span className="font-bold text-[10px] uppercase tracking-widest text-foreground/20 block mb-6 ml-1">Status Filter</span>
                                <div className="grid grid-cols-2 gap-3">
                                    {bookingStatuses.map((status) => (
                                        <label key={status} className="flex items-center gap-3 cursor-pointer group bg-foreground/2 p-4 rounded-[1.25rem] hover:bg-foreground/5 transition-all">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedStatuses.includes(status.toLowerCase())}
                                                onChange={() => {
                                                    const s = status.toLowerCase();
                                                    setSelectedStatuses(prev =>
                                                        prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                                                    );
                                                }}
                                            />
                                            <div className={cn(
                                                "flex-none w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all",
                                                selectedStatuses.includes(status.toLowerCase()) ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-border-light group-hover:border-primary"
                                            )}>
                                                {selectedStatuses.includes(status.toLowerCase()) && <Check size={14} className="text-white" />}
                                            </div>
                                            <span className="text-xs font-bold text-foreground/60 group-hover:text-foreground">{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-border-div flex items-center justify-between gap-6 flex-none bg-foreground/2">
                    <button
                        onClick={handleReset}
                        className="flex-1 py-4 px-6 border border-border-light rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-all active:scale-95"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={!!dateError}
                        className={cn(
                            "flex-[1.5] py-4 px-6 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95",
                            dateError
                                ? "bg-gray-300 cursor-not-allowed shadow-none"
                                : "hover:shadow-primary/30"
                        )}
                        style={!dateError ? { background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" } : {}}
                    >
                        Show Results
                    </button>
                </div>
            </div>
        </>
    );
};
