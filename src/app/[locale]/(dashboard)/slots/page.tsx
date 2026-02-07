"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    RefreshCw,
    Plus,
    Trash,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";

// Types
interface Terminal {
    id: string;
    zone_name: string;
    gate?: { gate_number: string };
}

interface Slot {
    id: string;
    terminal_id: string;
    start_date: string; // Renamed from slot_date to test trigger
    start_time: string; // HH:MM:SS
    end_time: string; // HH:MM:SS
    max_capacity: number;
    current_occupancy: number;
    status: string;
    template_id: string | null;
    override_id: string | null;
    terminal?: { zone_name: string };
}

interface SlotTemplate {
    id: string;
    terminal_id: string;
    day_of_week: number; // 0-6, 0 = Sunday
    start_time: string;
    end_time: string;
    max_capacity: number;
    is_active: boolean;
}

export default function OperatorSlots() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [terminals, setTerminals] = useState<Terminal[]>([]);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [templates, setTemplates] = useState<SlotTemplate[]>([]);
    const [selectedTerminal, setSelectedTerminal] = useState<string>("");

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());

    // Add Mode State
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newSlotData, setNewSlotData] = useState({
        date: format(new Date(), "yyyy-MM-dd"),
        start: "08:00",
        end: "09:00",
        capacity: 10
    });

    // Constants
    const daysOfWeek = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 06:00 to 20:00

    // Fetch Data
    const fetchTerminals = async () => {
        try {
            const { data, error } = await supabase.from("terminals").select(`*, gate:gates(gate_number)`);
            if (error) {
                console.error("Error fetching terminals:", error);
                toast.error("Failed to load terminals");
                return;
            }
            if (data) {
                console.log("Terminals loaded:", data.length);
                setTerminals(data);
                if (data.length > 0 && !selectedTerminal) {
                    setSelectedTerminal(data[0].id);
                }
            }
        } catch (err) {
            console.error("Unexpected error fetching terminals:", err);
        }
    };

    const fetchSlots = async () => {
        if (!selectedTerminal) return;
        setLoading(true);
        try {
            const start = format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
            const end = format(endOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");

            console.log(`Fetching slots for ${selectedTerminal} range ${start} to ${end}`);

            const { data, error } = await supabase
                .from("active_slots")
                .select(`*, terminal:terminals(zone_name)`)
                .eq("terminal_id", selectedTerminal)
                .gte("start_date", start)
                .lte("start_date", end);

            if (error) {
                console.error("Error fetching slots:", error);
                toast.error("Failed to load slots");
            } else {
                console.log("Slots loaded:", data?.length || 0);
                if (data) setSlots(data);
            }
        } catch (err) {
            console.error("Unexpected error fetching slots:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        if (!selectedTerminal) return;
        try {
            const { data, error } = await supabase
                .from("slot_templates")
                .select("*")
                .eq("terminal_id", selectedTerminal)
                .eq("is_active", true);

            if (error) {
                console.error("Error fetching templates:", error);
            } else if (data) {
                console.log("Templates loaded:", data.length);
                setTemplates(data);
            }
        } catch (err) {
            console.error("Unexpected error fetching templates:", err);
        }
    };

    useEffect(() => {
        fetchTerminals();
    }, []);

    useEffect(() => {
        if (selectedTerminal) {
            fetchSlots();
            fetchTemplates();
        }
    }, [currentDate, selectedTerminal]);

    // Actions - Create default templates for Mon-Fri
    const handleResetToDefault = async () => {
        console.log("Reset requested", { selectedTerminal });
        if (!selectedTerminal) return toast.error("Select a terminal first");

        if (!confirm("This will create default slot TEMPLATES for this terminal (Mon-Fri). Continue?")) return;

        const toastId = toast.loading("Creating default templates...");

        // Define a mixed schedule pattern
        const mixedSchedule = [
            { start: "08:00:00", end: "09:30:00", capacity: 15 },
            { start: "09:30:00", end: "10:30:00", capacity: 10 },
            { start: "10:30:00", end: "11:30:00", capacity: 10 },
            { start: "13:00:00", end: "15:00:00", capacity: 20 },
            { start: "15:00:00", end: "16:00:00", capacity: 10 },
            { start: "16:00:00", end: "16:45:00", capacity: 8 },
        ];

        // Days: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
        const workDays = [1, 2, 3, 4, 5];
        const templatesToInsert: any[] = [];

        workDays.forEach(dayOfWeek => {
            mixedSchedule.forEach(slot => {
                templatesToInsert.push({
                    terminal_id: selectedTerminal,
                    day_of_week: dayOfWeek,
                    start_time: slot.start,
                    end_time: slot.end,
                    max_capacity: slot.capacity,
                    is_active: true
                });
            });
        });

        console.log(`Creating ${templatesToInsert.length} templates`);

        try {
            // First, deactivate existing templates for this terminal
            const { error: deactivateError } = await supabase
                .from("slot_templates")
                .update({ is_active: false })
                .eq("terminal_id", selectedTerminal);

            if (deactivateError) {
                console.error("Deactivate error:", deactivateError);
                toast.error("Failed to deactivate old templates: " + deactivateError.message, { id: toastId });
                return;
            }

            // Insert new templates
            const { error: insertError } = await supabase
                .from("slot_templates")
                .insert(templatesToInsert);

            if (insertError) {
                console.error("Insert error:", insertError);
                toast.error("Failed to create templates: " + insertError.message, { id: toastId });
            } else {
                toast.success(`Created ${templatesToInsert.length} slot templates! Slots will be generated automatically.`, { id: toastId });
                fetchTemplates();
                // Note: active_slots should be generated by a database trigger or scheduled job
                // For now, let's manually generate them for the current week
                await generateSlotsFromTemplates(templatesToInsert);
                fetchSlots();
            }
        } catch (err) {
            console.error("Unexpected error during reset:", err);
            toast.error("Unexpected error during reset", { id: toastId });
        }
    };

    // Helper to generate active_slots from templates for current week
    const generateSlotsFromTemplates = async (templates: any[]) => {
        const slotsToInsert: any[] = [];

        daysOfWeek.forEach(day => {
            const dayOfWeek = day.getDay(); // 0=Sun, 1=Mon, etc.
            const matchingTemplates = templates.filter(t => t.day_of_week === dayOfWeek);

            matchingTemplates.forEach(template => {
                slotsToInsert.push({
                    terminal_id: selectedTerminal,
                    start_date: format(day, "yyyy-MM-dd"),
                    start_time: template.start_time,
                    end_time: template.end_time,
                    max_capacity: template.max_capacity,
                    current_occupancy: 0,
                    status: "AVAILABLE",
                    template_id: template.id || null // Will be null for newly inserted templates
                });
            });
        });

        if (slotsToInsert.length > 0) {
            // Delete existing slots for this week first
            const start = format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
            const end = format(endOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");

            await supabase.from("active_slots")
                .delete()
                .eq("terminal_id", selectedTerminal)
                .gte("start_date", start)
                .lte("start_date", end);

            // We need to fetch the newly created template IDs
            const { data: newTemplates } = await supabase
                .from("slot_templates")
                .select("*")
                .eq("terminal_id", selectedTerminal)
                .eq("is_active", true);

            if (newTemplates) {
                const finalSlots: any[] = [];
                daysOfWeek.forEach(day => {
                    const dayOfWeek = day.getDay();
                    const matchingTemplates = newTemplates.filter((t: any) => t.day_of_week === dayOfWeek);

                    matchingTemplates.forEach((template: any) => {
                        finalSlots.push({
                            terminal_id: selectedTerminal,
                            start_date: format(day, "yyyy-MM-dd"),
                            start_time: template.start_time,
                            end_time: template.end_time,
                            max_capacity: template.max_capacity,
                            current_occupancy: 0,
                            status: "AVAILABLE",
                            template_id: template.id
                        });
                    });
                });

                if (finalSlots.length > 0) {
                    const { error } = await supabase.from("active_slots").insert(finalSlots);
                    if (error) {
                        console.error("Error generating slots:", error);
                    } else {
                        console.log(`Generated ${finalSlots.length} active slots`);
                    }
                }
            }
        }
    };

    // Add slot via slot_overrides (HOURS_CHANGE type)
    const handleSaveSlot = async () => {
        console.log("Save Slot requested", { selectedTerminal, newSlotData });
        if (!selectedTerminal) {
            toast.error("No terminal selected");
            return;
        }

        const toastId = toast.loading("Saving slot...");

        try {
            const date = newSlotData.date;
            const start = newSlotData.start.length === 5 ? newSlotData.start + ":00" : newSlotData.start;
            const end = newSlotData.end.length === 5 ? newSlotData.end + ":00" : newSlotData.end;

            // Create a slot_override with HOURS_CHANGE type
            const { data: override, error: overrideError } = await supabase
                .from("slot_overrides")
                .insert({
                    terminal_id: selectedTerminal,
                    start_date: date,
                    start_time: start,
                    end_time: end,
                    override_type: "HOURS_CHANGE",
                    new_max_capacity: newSlotData.capacity,
                    is_active: true,
                    reason: "Manual slot creation"
                })
                .select()
                .single();

            if (overrideError) {
                console.error("Override creation error:", overrideError);
                toast.error("Failed to create slot override: " + overrideError.message, { id: toastId });
                return;
            }

            console.log("Created override:", override);

            // Now create the active_slot referencing this override
            const { error: slotError } = await supabase.from("active_slots").insert({
                terminal_id: selectedTerminal,
                start_date: date,
                start_time: start,
                end_time: end,
                max_capacity: newSlotData.capacity,
                current_occupancy: 0,
                status: "AVAILABLE",
                override_id: override.id
            });

            if (slotError) {
                console.error("Slot creation error:", slotError);
                toast.error("Failed to save slot: " + slotError.message, { id: toastId });
            } else {
                toast.success("Slot saved successfully", { id: toastId });
                setIsAddDialogOpen(false);
                fetchSlots();
            }
        } catch (err) {
            console.error("Unexpected error saving slot:", err);
            toast.error("Unexpected error saving slot", { id: toastId });
        }
    };

    const handleEditSlot = (slot: Slot) => {
        setNewSlotData({
            date: slot.start_date,
            start: slot.start_time.slice(0, 5),
            end: slot.end_time.slice(0, 5),
            capacity: slot.max_capacity
        });
        setIsAddDialogOpen(true);
    };

    const handleDeleteSlot = async (slot: Slot) => {
        // Delete the slot and its override if it has one
        if (slot.override_id) {
            await supabase.from("slot_overrides").delete().eq("id", slot.override_id);
        }
        await supabase.from("active_slots").delete().eq("id", slot.id);
        fetchSlots();
    };

    // Helper for grid positioning
    const getSlotStyle = (slot: Slot) => {
        const startHour = parseInt(slot.start_time.split(":")[0]);
        const startMin = parseInt(slot.start_time.split(":")[1]);
        const endHour = parseInt(slot.end_time.split(":")[0]);
        const endMin = parseInt(slot.end_time.split(":")[1]);

        const startTotalMinutes = (startHour * 60) + startMin;
        const endTotalMinutes = (endHour * 60) + endMin;
        const duration = endTotalMinutes - startTotalMinutes;

        // Base hour is 6:00 (360 mins)
        const topOffset = startTotalMinutes - 360;

        return {
            top: `${(topOffset / 60) * 60}px`,
            height: `${(duration / 60) * 60}px`
        };
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            {/* Header / Controls */}
            <div className="flex justify-between items-center bg-background/50 backdrop-blur-md p-4 rounded-2xl border border-foreground/5 sticky top-0 z-10 transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(d => addDays(d, -7))}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <h2 className="text-lg font-bold w-40 text-center select-none">
                            {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} - {format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(d => addDays(d, 7))}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <select
                        className="bg-transparent border border-foreground/10 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:bg-foreground/5 transition-colors"
                        value={selectedTerminal}
                        onChange={(e) => setSelectedTerminal(e.target.value)}
                    >
                        {terminals.map(t => (
                            <option key={t.id} value={t.id}>{t.zone_name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => toast.info("AI Optimization coming soon!")}
                        className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Opt
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleResetToDefault}
                        className="gap-2 text-muted-foreground hover:text-foreground border-dashed"
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Default
                    </Button>
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                    >
                        <Plus className="w-4 h-4" />
                        Add Slot
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto border rounded-xl bg-background shadow-sm flex flex-col custom-scrollbar">
                {/* Header Row */}
                <div className="flex border-b sticky top-0 bg-background z-10 shadow-sm">
                    <div className="w-16 border-r p-2 shrink-0 bg-muted/5"></div>
                    {daysOfWeek.map(day => (
                        <div key={day.toString()} className={cn(
                            "flex-1 p-2 text-center border-r last:border-r-0",
                            isSameDay(day, new Date()) ? "bg-primary/5" : ""
                        )}>
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{format(day, "EEE")}</div>
                            <div className={cn(
                                "text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1 transition-colors",
                                isSameDay(day, new Date()) ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-foreground/70"
                            )}>
                                {format(day, "d")}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Body */}
                <div className="flex flex-1 relative min-h-[900px]">
                    {/* Time Column */}
                    <div className="w-16 border-r shrink-0 bg-muted/10 sticky left-0 z-10 select-none">
                        {hours.map(hour => (
                            <div key={hour} className="h-[60px] border-b text-xs text-muted-foreground p-1 text-right relative">
                                <span className="absolute -top-2 right-2 font-mono opacity-50">{hour}:00</span>
                            </div>
                        ))}
                    </div>

                    {/* Columns */}
                    {daysOfWeek.map(day => (
                        <div key={day.toString()} className="flex-1 border-r last:border-r-0 relative group bg-dots-pattern">
                            {hours.map(hour => (
                                <div key={hour} className="h-[60px] border-b border-foreground/[0.03]" />
                            ))}

                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 cursor-crosshair z-0"
                                onClick={() => {
                                    setNewSlotData(prev => ({ ...prev, date: format(day, "yyyy-MM-dd") }));
                                    setIsAddDialogOpen(true);
                                }}
                            />

                            {slots.filter(s => s.start_date === format(day, "yyyy-MM-dd")).map(slot => (
                                <div
                                    key={slot.id}
                                    className={cn(
                                        "absolute left-1 right-1 rounded-md p-1.5 text-[10px] hover:z-20 hover:shadow-lg transition-all cursor-pointer overflow-hidden z-10 group/slot",
                                        slot.override_id
                                            ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                                            : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                                    )}
                                    style={getSlotStyle(slot)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditSlot(slot);
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className={cn(
                                            "font-bold",
                                            slot.override_id ? "text-amber-700 dark:text-amber-300" : "text-blue-700 dark:text-blue-300"
                                        )}>
                                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                        </div>
                                        <button
                                            className="text-red-400 hover:text-red-700 dark:hover:text-red-300 opacity-0 group-hover/slot:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSlot(slot);
                                            }}
                                        >
                                            <Trash size={12} />
                                        </button>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className={cn(
                                            "font-medium",
                                            slot.override_id ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"
                                        )}>Cap: {slot.max_capacity}</span>
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                                            slot.current_occupancy >= slot.max_capacity
                                                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        )}>
                                            {slot.current_occupancy} filled
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Slot Modal */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add / Edit Slot</DialogTitle>
                        <DialogDescription>
                            Configure the slot details. This creates a one-off slot override.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Input type="date" value={newSlotData.date} onChange={e => setNewSlotData(p => ({ ...p, date: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Capacity</label>
                                <Input type="number" value={newSlotData.capacity} onChange={e => setNewSlotData(p => ({ ...p, capacity: parseInt(e.target.value) }))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start</label>
                                <Input type="time" value={newSlotData.start} onChange={e => setNewSlotData(p => ({ ...p, start: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End</label>
                                <Input type="time" value={newSlotData.end} onChange={e => setNewSlotData(p => ({ ...p, end: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleSaveSlot}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
