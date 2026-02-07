"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { format, addHours, isBefore, startOfWeek, addDays, eachDayOfInterval, endOfWeek, startOfMonth, endOfMonth, isSameDay, addMonths, subMonths, isSameMonth } from "date-fns";
import {
    Calendar,
    Clock,
    QrCode,
    CalendarDays,
    Search,
    MapPin,
    Filter,
    Download,
    FileUp,
    CheckCircle2,
    XCircle,
    Plus,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FiltersPanel } from "@/components/Filters/FiltersPanel";
import { ImportModal } from "@/components/ActionBar/ImportModal";
import { ExportModal } from "@/components/ActionBar/ExportModal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChartCard } from "@/components/dashboard/widgets";

// ---------- TYPES ----------

interface TimeSlot {
    id: string;
    startTime: Date;
    durationHours: number;
    occupancyRate: number;
    totalCapacity: number;
    status: "available" | "limited" | "full";
}

interface Booking {
    id: string;
    bookingCode: string;
    date: Date;
    timeSlot: string;
    containerType: string;
    status: "confirmed" | "pending" | "rejected" | "cancelled";
    terminal: string;
    gate: string;
    createdAt: Date;
    qrCode?: string;
    containerNumber?: string;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 -> 23:00

// ─── Shared Section Header (Consistency with Admin) ──────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, color = "primary", extra }: {
    icon: React.FC<{ size?: number }>;
    title: string;
    subtitle: string;
    color?: string;
    extra?: React.ReactNode;
}) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
    >
        <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", `bg-${color}/10 text-${color}`)}>
                <Icon size={22} />
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                <p className="text-foreground/50 text-xs">{subtitle}</p>
            </div>
        </div>
        {extra && <div className="hidden sm:block">{extra}</div>}
    </motion.div>
);

// ---------- STATIC DATA FALLBACKS ----------
const STATIC_BOOKINGS: Booking[] = [
    {
        id: "BK-STATIC-001",
        bookingCode: "BK-2024-001",
        date: new Date(),
        timeSlot: "10:00 - 11:00",
        containerType: "20FT",
        status: "confirmed",
        terminal: "Terminal Alpha",
        gate: "Gate 4 (South)",
        createdAt: new Date(),
        containerNumber: "CRGO-A92J"
    },
    {
        id: "BK-STATIC-002",
        bookingCode: "BK-2024-002",
        date: new Date(),
        timeSlot: "14:00 - 15:00",
        containerType: "40FT",
        status: "pending",
        terminal: "Terminal Beta",
        gate: "Gate 1 (North)",
        createdAt: new Date(),
        containerNumber: "CRGO-B11X"
    },
    {
        id: "BK-STATIC-003",
        bookingCode: "BK-2024-003",
        date: new Date(),
        timeSlot: "09:00 - 10:00",
        containerType: "20FT",
        status: "rejected",
        terminal: "Terminal Alpha",
        gate: "Gate 2 (East)",
        createdAt: new Date(),
        containerNumber: "CRGO-C55M"
    }
];

const STATIC_TRUCKS = [
    { id: "T-001", plate_number: "DEMO-001", status: "AVAILABLE" },
    { id: "T-002", plate_number: "DEMO-002", status: "IN_USE" }
];

const STATIC_DRIVERS = [
    { id: "D-001", full_name: "Demo Driver (Static)" },
    { id: "D-002", full_name: "John Doe (Static)" }
];

const STATIC_CONTAINERS = [
    { id: "C-001", container_number: "CRGO-A92J", terminal: { zone_name: "Demo Terminal Alpha" }, current_terminal_id: "demo-terminal" },
    { id: "C-002", container_number: "CRGO-B11X", terminal: { zone_name: "Demo Terminal Beta" }, current_terminal_id: "demo-terminal" },
    { id: "C-003", container_number: "CRGO-C55M", terminal: { zone_name: "Demo Terminal Alpha" }, current_terminal_id: "demo-terminal" },
    { id: "C-004", container_number: "CRGO-D88P", terminal: { zone_name: "Demo Terminal Gamma" }, current_terminal_id: "demo-terminal" }
];

const getStaticSlots = (dateStr: string) => {
    // Manually curated diverse slots to show different sizes and capacities
    const configs = [
        { h: 7, duration: 2, max: 100, occ: 82 },   // 82/100 (82%)
        { h: 10, duration: 4, max: 250, occ: 212 }, // 212/250 (84.8%)
        { h: 15, duration: 1, max: 40, occ: 5 },     // 5/40 (12.5%) 
        { h: 17, duration: 3, max: 150, occ: 95 },   // 95/150 (63.3%)
        { h: 21, duration: 1, max: 30, occ: 28 }    // 28/30 (93.3%)
    ];

    return configs.map((cfg, i) => ({
        id: `slot-static-${dateStr}-${i}`,
        slot_date: dateStr,
        start_time: `${String(cfg.h).padStart(2, "0")}:00:00`,
        end_time: `${String(cfg.h + cfg.duration).padStart(2, "0")}:00:00`,
        max_capacity: cfg.max,
        current_occupancy: cfg.occ,
        terminal_id: "demo-terminal"
    }));
};

export default function CarrierBookingPage() {
    const supabase = createClient();
    const { profile: user } = useAuth();
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [containerType, setContainerType] = useState("20FT");
    const dateInputRef = useRef<HTMLInputElement>(null);

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return "Active Week";
        const [y, m, d] = dateStr.split('-').map(Number);
        return format(new Date(y, m - 1, d), "MMMM dd, yyyy");
    };

    // Real Data States
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [trucks, setTrucks] = useState<{ id: string; plate_number: string; status: string }[]>([]);
    const [drivers, setDrivers] = useState<{ id: string; full_name: string }[]>([]);
    const [selectedTruck, setSelectedTruck] = useState<string>("");
    const [selectedDriver, setSelectedDriver] = useState<string>("");

    const [qrBooking, setQrBooking] = useState<Booking | null>(null);

    // Container State
    const [cargoPool, setCargoPool] = useState<any[]>([]);
    const [cargoInput, setCargoInput] = useState("");
    const [isSearchingCargo, setIsSearchingCargo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Booking Wizard State
    const [bookingStep, setBookingStep] = useState(1);

    // Import Modals State
    const [isCargoImportOpen, setIsCargoImportOpen] = useState(false);
    const [isFleetImportOpen, setIsFleetImportOpen] = useState(false);
    const [importText, setImportText] = useState("");
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Filters state
    const [dateFilter, setDateFilter] = useState<string>("");
    const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [dbSlots, setDbSlots] = useState<any[]>([]);
    const [terminals, setTerminals] = useState<any[]>([]);
    const [selectedTerminal, setSelectedTerminal] = useState<string>("");

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        status: [] as string[],
        dateFrom: "",
        dateTo: "",
        searchRef: ""
    });

    const handleFinalBatchBooking = async () => {
        if (!selectedSlot || cargoPool.length === 0 || !selectedTruck || !selectedDriver) {
            toast.error("Missing batch booking payload");
            return;
        }

        setIsSubmitting(true);
        try {
            const bookingRefBase = `BK-${format(new Date(), "yyyyMMdd")}`;

            // Validation: Ensure we are not using static/demo data for real DB insertions
            if (selectedSlot.id.includes("static") ||
                selectedTruck.startsWith("T-") ||
                selectedDriver.startsWith("D-") ||
                cargoPool.some(c => c.id.startsWith("C-"))) {
                toast.error("You are selecting demo/static data. Please ensure you have real Trucks, Drivers, and Slots configured in the database before booking.");
                return;
            }

            const promises = cargoPool.map((cargo, idx) => {
                const bookingRef = `${bookingRefBase}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}-${idx}`;
                const payload = {
                    booking_reference: bookingRef,
                    scheduled_date: selectedSlot.startTime.toISOString().split("T")[0],
                    scheduled_start: selectedSlot.startTime.toISOString(),
                    scheduled_end: addHours(selectedSlot.startTime, selectedSlot.durationHours).toISOString(),
                    truck_id: selectedTruck,
                    driver_id: selectedDriver,
                    loaded_container_id: cargo.id,
                    slot_id: selectedSlot.id,
                    booking_type: "EXPORT_DELIVERY" as any,
                    carrier_org_id: user?.org_id,
                    status: "PENDING" as any,
                    qr_code: bookingRef
                };

                console.log(`[CarrierBooking] Submitting booking ${idx + 1}/${cargoPool.length}:`, payload);
                return supabase.from("bookings").insert([payload]);
            });

            const results = await Promise.all(promises);
            const errors = results.filter(r => r.error);

            if (errors.length > 0) {
                console.error("[CarrierBooking] Some bookings failed:", errors.map(e => e.error));
                const firstError = errors[0].error;
                toast.error(`Database Error: ${firstError?.message || 'Unknown error'}`);
                return;
            }

            console.log("[CarrierBooking] All bookings inserted successfully:", results);
            toast.success(`Batch for ${cargoPool.length} units finalized!`);

            setIsBookingDialogOpen(false);
            setBookingStep(1);
            setCargoPool([]); // Clear pool
            await loadMainData(); // Force immediate refresh
        } catch (err) {
            console.error("Batch failed:", err);
            toast.error("Internal processing error. Please contact port authority.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCargoSearch = async (val: string) => {
        setCargoInput(val);
        if (val.length < 4) return;

        setIsSearchingCargo(true);
        try {
            let foundCargo = null;
            // 1. Try DB
            const { data, error } = await supabase
                .from("containers")
                .select("*, terminal:terminals(*)")
                .ilike("container_number", `%${val}%`)
                .limit(1);

            if (data && data.length > 0) {
                foundCargo = data[0];
            } else {
                // 2. Try Static Fallback
                const searchVal = val.toUpperCase();
                const matchingBooking = STATIC_BOOKINGS.find(b => b.bookingCode.toUpperCase().includes(searchVal));
                const targetContainerNum = matchingBooking?.containerNumber || searchVal;
                foundCargo = STATIC_CONTAINERS.find(c =>
                    c.container_number.includes(targetContainerNum) ||
                    (matchingBooking && c.container_number === matchingBooking.containerNumber)
                );
            }

            if (foundCargo) {
                if (cargoPool.find(c => c.id === foundCargo.id)) {
                    toast.info(`Cargo ${foundCargo.container_number} is already in the pool`);
                } else {
                    setCargoPool(prev => [...prev, foundCargo]);
                    setSelectedTerminal(foundCargo.current_terminal_id || "demo-terminal");
                    toast.success(`Cargo ${foundCargo.container_number} added to pool`);
                    setCargoInput(""); // Clear for next search
                }
            }
        } catch (e) {
            console.error(e);
        }
        setIsSearchingCargo(false);
    };

    const handleImportCargoList = () => {
        if (!importText) return;

        // Simple CSV parsing (split by newline and then by comma)
        const lines = importText.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0);

        const cargoIds = lines.map(line => {
            const parts = line.split(',');
            return parts[0].trim(); // Take first column as ID
        });

        if (cargoIds.length > 0) {
            handleCargoSearch(cargoIds[0]);
            toast.success(`Imported ${cargoIds.length} cargo IDs. Filtering by first match: ${cargoIds[0]}`);
            setIsCargoImportOpen(false);
            setImportText("");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            toast.error("Please upload a CSV file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setImportText(content);
            toast.success("CSV content loaded. Review and click 'Process List'");
        };
        reader.readAsText(file);
    };

    // Real-time Data Fetching
    const loadMainData = React.useCallback(async () => {
        if (!user?.org_id) return;
        const { data: trucksData } = await supabase
            .from("trucks")
            .select("id, plate_number, status")
            .eq("org_id", user.org_id);
        if (trucksData && trucksData.length > 0) {
            setTrucks(trucksData);
        } else {
            setTrucks(STATIC_TRUCKS);
        }

        const { data: driversData } = await supabase
            .from("drivers")
            .select("id, full_name")
            .eq("org_id", user.org_id);
        if (driversData && driversData.length > 0) {
            setDrivers(driversData);
        } else {
            setDrivers(STATIC_DRIVERS);
        }

        const { data: termData } = await supabase.from("terminals").select(`
            *,
            gate:gates(gate_number)
        `);
        if (termData && termData.length > 0) {
            setTerminals(termData);
        } else {
            setTerminals([{ id: "demo-terminal", zone_name: "Demo Terminal Alpha", gate: [] }]);
        }

        const { data: contData } = await supabase.from("containers").select("*");

        const { data: bookingsData } = await supabase
            .from("bookings")
            .select(`
                *,
                loaded_container:containers!bookings_loaded_container_id_fkey(container_number),
                unloaded_container:containers!bookings_unloaded_container_id_fkey(container_number)
            `)
            .eq("carrier_org_id", user.org_id)
            .order("created_at", { ascending: false });

        if (bookingsData && bookingsData.length > 0) {
            console.log(`[CarrierBooking] Found ${bookingsData.length} bookings in DB`);
            const mappedBookings: Booking[] = bookingsData.map((b: any) => ({
                id: b.id,
                bookingCode: b.booking_reference,
                date: new Date(b.scheduled_date),
                timeSlot: `${format(new Date(b.scheduled_start), "HH:mm")} - ${format(new Date(b.scheduled_end), "HH:mm")}`,
                containerType: "20FT",
                status: b.status.toLowerCase() as any,
                terminal: "Terminal A",
                gate: "Auto-assigned",
                createdAt: new Date(b.created_at),
                qrCode: b.qr_code,
                containerNumber: b.loaded_container?.container_number || b.unloaded_container?.container_number || "N/A"
            }));
            setBookings(mappedBookings);
        } else {
            console.log("[CarrierBooking] No bookings found in DB, using fallback");
            setBookings(STATIC_BOOKINGS);
        }
    }, [user?.org_id, supabase]);

    const loadSlotData = React.useCallback(async () => {
        let query = supabase.from("active_slots").select("*");

        let start, end;
        if (viewMode === "day") {
            start = format(currentDate, "yyyy-MM-dd");
            end = start;
            query = query.eq("slot_date", start);
        } else if (viewMode === "week") {
            start = format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
            end = format(endOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
            query = query.gte("slot_date", start).lte("slot_date", end);
        } else {
            start = format(startOfMonth(currentDate), "yyyy-MM-dd");
            end = format(endOfMonth(currentDate), "yyyy-MM-dd");
            query = query.gte("slot_date", start).lte("slot_date", end);
        }

        if (selectedTerminal) query = query.eq("terminal_id", selectedTerminal);

        const { data } = await query;

        if (data && data.length > 0) {
            setDbSlots(data);
        } else {
            const rangeDays = eachDayOfInterval({
                start: new Date(start),
                end: new Date(end)
            });
            const allStaticSlots = rangeDays.flatMap(day => getStaticSlots(format(day, "yyyy-MM-dd")));
            setDbSlots(allStaticSlots);
        }
    }, [viewMode, currentDate, selectedTerminal, supabase]);

    useEffect(() => {
        if (!user?.org_id) return;

        loadMainData();

        const channel = supabase
            .channel(`carrier-bookings-${user.org_id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookings",
                    filter: `carrier_org_id=eq.${user.org_id}`
                },
                () => {
                    console.log("Realtime update received for bookings");
                    loadMainData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadMainData, user?.org_id, supabase]);

    useEffect(() => {
        loadSlotData();
    }, [loadSlotData]);

    const daySlots = useMemo(() => {
        const dateMap: Record<string, any[]> = {};
        dbSlots.forEach(s => {
            if (!dateMap[s.slot_date]) dateMap[s.slot_date] = [];
            const startTime = new Date(`${s.slot_date}T${s.start_time}`);
            const endTime = new Date(`${s.slot_date}T${s.end_time}`);
            const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
            dateMap[s.slot_date].push({
                id: s.id,
                startTime,
                durationHours: Math.max(1, Math.round(duration)),
                occupancyRate: (s.current_occupancy || 0) / s.max_capacity,
                totalCapacity: s.max_capacity,
                status: (s.current_occupancy || 0) >= s.max_capacity ? "full" :
                    (s.current_occupancy || 0) > (s.max_capacity * 0.7) ? "limited" : "available",
            });
        });

        if (viewMode === "day") {
            const dStr = format(currentDate, "yyyy-MM-dd");
            return [{ date: currentDate, slots: dateMap[dStr] || [] }];
        }

        if (viewMode === "week") {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            const weekDays = eachDayOfInterval({ start, end });
            return weekDays.map(day => {
                const dStr = format(day, "yyyy-MM-dd");
                return { date: day, slots: dateMap[dStr] || [] };
            });
        }

        // MONTH VIEW
        // To make a proper calendar grid, we need to start from the beginning of the week of the 1st of the month
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
        return monthDays.map(day => {
            const dStr = format(day, "yyyy-MM-dd");
            return { date: day, slots: dateMap[dStr] || [] };
        });
    }, [dbSlots, viewMode, currentDate]);

    const filteredBookings = useMemo(() => {
        return bookings.filter((b) => {
            const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(b.status);
            const refMatch = !activeFilters.searchRef || b.bookingCode.toLowerCase().includes(activeFilters.searchRef.toLowerCase()) || (b.containerNumber && b.containerNumber.toLowerCase().includes(activeFilters.searchRef.toLowerCase()));

            const bDateStr = format(b.date, "yyyy-MM-dd");
            const dateFromMatch = !activeFilters.dateFrom || bDateStr >= activeFilters.dateFrom;
            const dateToMatch = !activeFilters.dateTo || bDateStr <= activeFilters.dateTo;

            return statusMatch && refMatch && dateFromMatch && dateToMatch;
        });
    }, [bookings, activeFilters]);

    const handleSlotClick = (slot: TimeSlot) => {
        if (isBefore(slot.startTime, new Date())) {
            toast.error("Slot is in the past.");
            return;
        }
        setSelectedSlot(slot);
        setIsBookingDialogOpen(true);
    };

    const getStatusStyle = (status: string) => {
        const styles: Record<string, string> = {
            confirmed: "bg-success/10 text-success border-success/20",
            pending: "bg-warning/10 text-warning border-warning/20",
            rejected: "bg-error/10 text-error border-error/20",
            cancelled: "bg-foreground/5 text-foreground/40 border-foreground/10",
        };
        return cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full", styles[status] || styles.pending);
    };

    return (
        <TooltipProvider>
            <div className="space-y-6 pb-12">
                <SectionHeader
                    icon={CalendarDays}
                    title="Bookings & Scheduling"
                    subtitle="Reserve time slots for cargo drop-off or pickup"
                    color="primary"
                />

                {/* Main Content Area */}
                <div className="space-y-6">
                    <ChartCard
                        title="Available Time Slots"
                        subtitle="Select a block to start a booking"
                        accentColor="bg-primary"
                        delay={1}
                        headerRight={
                            <div className="flex items-center gap-4 px-4 py-2 bg-foreground/3 rounded-xl border border-foreground/10 backdrop-blur-md shadow-sm">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shadow-inner">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">Active Terminal</span>
                                    <p className="text-xs font-black text-foreground">
                                        {terminals.find(t => t.id === selectedTerminal)?.zone_name || "Region Alpha"}
                                    </p>
                                </div>
                            </div>
                        }
                    >
                        <div className="space-y-6 pt-4">
                            {/* Controls */}
                            <div className="flex flex-col gap-4 bg-foreground/5 p-4 rounded-xl border border-foreground/10 backdrop-blur-md shadow-inner">
                                <div className="flex flex-wrap gap-4 items-center">
                                    {/* Cargo Identification */}
                                    <div className="flex-1 min-w-[300px] flex items-center gap-3 bg-white/40 dark:bg-slate-900/40 p-1 rounded-lg border border-foreground/10 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all group">
                                        <div className="p-2.5 rounded-md bg-primary text-white shadow-lg shadow-primary/20">
                                            <Plus size={16} />
                                        </div>
                                        <Input
                                            placeholder="Add Cargo to Batch (ID or Ref)..."
                                            className="bg-transparent border-none shadow-none focus-visible:ring-0 font-bold placeholder:text-foreground/20 text-md"
                                            value={cargoInput}
                                            onChange={(e) => setCargoInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCargoSearch(cargoInput)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[9px] font-black uppercase tracking-widest text-primary px-4 rounded-md flex items-center gap-2"
                                            onClick={() => setIsCargoImportOpen(true)}
                                        >
                                            <FileUp size={12} />
                                            <span>Bulk</span>
                                        </Button>
                                    </div>

                                    {/* View Selection & Navigation */}
                                    <div className="flex flex-wrap items-center gap-4 flex-1">
                                        <div className="flex bg-white/40 dark:bg-slate-900/40 p-1 rounded-xl border border-foreground/10">
                                            {(["day", "week", "month"] as const).map((mode) => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setViewMode(mode)}
                                                    className={cn(
                                                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                                        viewMode === mode
                                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                            : "text-foreground/40 hover:text-foreground"
                                                    )}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2 bg-white/40 dark:bg-slate-900/40 p-1 rounded-xl border border-foreground/10">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg"
                                                onClick={() => {
                                                    if (viewMode === "day") setCurrentDate(prev => addDays(prev, -1));
                                                    else if (viewMode === "week") setCurrentDate(prev => addDays(prev, -7));
                                                    else setCurrentDate(prev => subMonths(prev, 1));
                                                }}
                                            >
                                                <ChevronLeft size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-8 px-3 text-[10px] font-black uppercase tracking-widest"
                                                onClick={() => setCurrentDate(new Date())}
                                            >
                                                Today
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg"
                                                onClick={() => {
                                                    if (viewMode === "day") setCurrentDate(prev => addDays(prev, 1));
                                                    else if (viewMode === "week") setCurrentDate(prev => addDays(prev, 7));
                                                    else setCurrentDate(prev => addMonths(prev, 1));
                                                }}
                                            >
                                                <ChevronRight size={16} />
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-3 px-4 h-10 bg-white/40 dark:bg-slate-900/40 rounded-xl border border-foreground/10">
                                            <CalendarDays size={16} className="text-primary" />
                                            <span className="text-xs font-black text-foreground">
                                                {viewMode === "month"
                                                    ? format(currentDate, "MMMM yyyy")
                                                    : viewMode === "week"
                                                        ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")}`
                                                        : format(currentDate, "EEEE, MMM d")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cargo Manifest Bar - NEW */}
                                {cargoPool.length > 0 && (
                                    <div className="flex items-center gap-3 pt-2 border-t border-foreground/5">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/30 min-w-fit">Manifest:</span>
                                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                                            {cargoPool.map(c => (
                                                <div key={c.id} className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 animate-in fade-in zoom-in duration-300">
                                                    <span className="text-[10px] font-bold font-mono">{c.container_number}</span>
                                                    <button onClick={() => setCargoPool(prev => prev.filter(x => x.id !== c.id))} className="hover:text-error transition-colors">
                                                        <XCircle size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setCargoPool([])}
                                                className="text-[8px] font-black uppercase text-foreground/20 hover:text-error transition-colors px-2"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Schedule Grid */}
                            {cargoPool.length === 0 ? (
                                <div className="py-16 flex flex-col items-center justify-center border border-dashed border-foreground/10 rounded-xl bg-foreground/2">
                                    <div className="p-4 rounded-full bg-foreground/5 mb-4">
                                        <Search size={24} className="text-foreground/20" />
                                    </div>
                                    <p className="text-sm font-bold text-foreground/40 italic">Add containers to your batch to unlock schedule capacity</p>
                                </div>
                            ) : viewMode === "month" ? (
                                <div className="p-1 bg-foreground/5 rounded-2xl border border-foreground/10">
                                    <div className="grid grid-cols-7 gap-px bg-foreground/10 rounded-xl overflow-hidden shadow-inner">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                                            <div key={d} className="bg-white/80 dark:bg-slate-900/80 p-3 text-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{d}</span>
                                            </div>
                                        ))}
                                        {daySlots.map(({ date, slots }) => {
                                            const totalCapacity = slots.reduce((acc, s) => acc + s.totalCapacity, 0);
                                            const totalOccupancy = slots.reduce((acc, s) => acc + (s.occupancyRate * s.totalCapacity), 0);
                                            const avgOccupancy = totalCapacity > 0 ? totalOccupancy / totalCapacity : 0;
                                            const availableCount = slots.filter(s => s.status !== "full").length;
                                            const isToday = isSameDay(date, new Date());
                                            const isCurrMonth = isSameMonth(date, currentDate);

                                            return (
                                                <div
                                                    key={date.toISOString()}
                                                    onClick={() => {
                                                        setCurrentDate(date);
                                                        setViewMode("day");
                                                    }}
                                                    className={cn(
                                                        "bg-white dark:bg-slate-900 p-2.5 min-h-[110px] transition-all cursor-pointer hover:bg-primary/5 flex flex-col gap-2 relative group",
                                                        !isCurrMonth && "bg-foreground/2 opacity-30",
                                                        isToday && "ring-2 ring-primary ring-inset z-10"
                                                    )}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className={cn(
                                                            "text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg transition-colors",
                                                            isToday ? "bg-primary text-white" : "text-foreground/30 group-hover:text-foreground"
                                                        )}>
                                                            {format(date, "d")}
                                                        </span>
                                                        {availableCount > 0 && (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-[7px] font-black text-emerald-600 uppercase tracking-tighter">Open</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {slots.length > 0 ? (
                                                        <div className="flex-1 flex flex-col justify-end gap-2">
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between items-center text-[7px] font-black uppercase text-foreground/20 tracking-widest">
                                                                    <span>Loading</span>
                                                                    <span className={cn(
                                                                        avgOccupancy > 0.8 ? "text-red-500" : avgOccupancy > 0.5 ? "text-amber-500" : "text-emerald-500"
                                                                    )}>{Math.round(avgOccupancy * 100)}%</span>
                                                                </div>
                                                                <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={cn(
                                                                            "h-full rounded-full transition-all duration-700",
                                                                            avgOccupancy > 0.8 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                                                                avgOccupancy > 0.5 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                                                                                    "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                                                        )}
                                                                        style={{ width: `${avgOccupancy * 100}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[8px] font-black text-foreground/40 whitespace-nowrap bg-foreground/3 p-1 rounded-md border border-foreground/5">
                                                                <Clock size={8} className="text-primary/40" />
                                                                <span>{availableCount} / {slots.length} Slots</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1 flex items-center justify-center border border-dashed border-foreground/8 rounded-lg m-1">
                                                            <span className="text-[7px] font-black uppercase tracking-widest text-foreground/10 italic">Empty</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <ScrollArea className="w-full border border-foreground/10 rounded-xl bg-background overflow-hidden shadow-sm">
                                    <div className="min-w-[1500px]">
                                        {/* Time Header Overlay */}
                                        <div className="grid grid-cols-[140px_1fr] bg-foreground/5 backdrop-blur-xl border-b border-foreground/10 sticky top-0 z-30">
                                            <div className="p-6 border-r border-foreground/10 flex items-center justify-center bg-white/10">
                                                <Clock size={16} className="text-primary animate-pulse" />
                                            </div>
                                            <div className="grid" style={{ gridTemplateColumns: `repeat(${HOURS.length}, 1fr)` }}>
                                                {HOURS.map((h) => (
                                                    <div key={h} className="p-6 text-center border-r border-foreground/5 last:border-r-0 relative group">
                                                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-foreground/40 group-hover:text-primary transition-colors">{String(h).padStart(2, "0")}:00</span>
                                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all group-hover:w-full opacity-30" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Schedule Grid Rows */}
                                        <div className="divide-y divide-foreground/10">
                                            {daySlots.map(({ date, slots }) => (
                                                <div key={date.toISOString()} className="grid grid-cols-[140px_1fr] group/row relative bg-white/2 hover:bg-white/5 transition-all duration-300">
                                                    {/* Date Identity Sidebar */}
                                                    <div className="p-4 border-r border-foreground/10 bg-white/40 dark:bg-black/20 flex flex-col items-center justify-center gap-0.5 sticky left-0 z-20 backdrop-blur-2xl group-hover/row:bg-white/60 dark:group-hover/row:bg-white/5 transition-all">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{format(date, "EEEE")}</span>
                                                        <span className="text-[9px] font-black uppercase text-foreground/40 tracking-widest">{format(date, "MMM dd")}</span>
                                                    </div>

                                                    {/* Unified Grid Canvas */}
                                                    <div className="relative h-20 w-full">
                                                        {/* Precision Background Lines */}
                                                        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${HOURS.length}, 1fr)` }}>
                                                            {HOURS.map((h) => (
                                                                <div key={h} className="border-r border-foreground/5 last:border-r-0 h-full relative">
                                                                    <div className="absolute top-0 right-0 w-px h-1.5 bg-foreground/10" />
                                                                    <div className="absolute bottom-0 right-0 w-px h-1.5 bg-foreground/10" />
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Interactive Slots Layer */}
                                                        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${HOURS.length}, 1fr)` }}>
                                                            {slots.map((slot) => {
                                                                const startHour = slot.startTime.getHours();
                                                                const startIndex = HOURS.indexOf(startHour);
                                                                if (startIndex === -1) return null;

                                                                const isFull = slot.occupancyRate >= 1;
                                                                const rate = slot.occupancyRate;

                                                                const getSlotStyle = () => {
                                                                    if (isFull) return "bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed";
                                                                    if (rate > 0.8) return "bg-red-50 border-red-200 text-red-700 hover:bg-red-100";
                                                                    if (rate > 0.5) return "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100";
                                                                    if (rate > 0.2) return "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100";
                                                                    return "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white";
                                                                };

                                                                return (
                                                                    <Tooltip key={slot.id}>
                                                                        <TooltipTrigger asChild>
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (!isFull) {
                                                                                        setSelectedSlot(slot);
                                                                                        setBookingStep(1);
                                                                                        setIsBookingDialogOpen(true);
                                                                                    }
                                                                                }}
                                                                                style={{
                                                                                    gridColumnStart: startIndex + 1,
                                                                                    gridColumnEnd: `span ${slot.durationHours}`
                                                                                }}
                                                                                className={cn(
                                                                                    "m-1 p-1 rounded-lg transition-all duration-200 border relative overflow-hidden flex flex-col items-center justify-center",
                                                                                    getSlotStyle()
                                                                                )}
                                                                            >
                                                                                <div className="flex items-baseline gap-0.5">
                                                                                    <span className="text-lg font-bold tabular-nums">
                                                                                        {slot.totalCapacity - Math.floor(slot.occupancyRate * slot.totalCapacity)}
                                                                                    </span>
                                                                                    <span className="text-[8px] font-bold opacity-30"> / {slot.totalCapacity}</span>
                                                                                </div>
                                                                                <span className="text-[6px] font-black uppercase tracking-tighter opacity-40">
                                                                                    {Math.round(rate * 100)}% Full
                                                                                </span>
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent
                                                                            className="p-5 border border-white/20 bg-transparent rounded-xl shadow-2xl backdrop-blur-3xl ring-1 ring-black/10 min-w-[220px] animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 duration-200"
                                                                            sideOffset={10}
                                                                        >
                                                                            <div className="space-y-4">
                                                                                <div className="flex items-center gap-4 mb-4">
                                                                                    <div className={cn(
                                                                                        "p-3 rounded-2xl shadow-inner",
                                                                                        isFull ? "bg-slate-100 text-slate-500" :
                                                                                            rate > 0.8 ? "bg-red-100 text-red-600" :
                                                                                                rate > 0.5 ? "bg-orange-100 text-orange-600" :
                                                                                                    rate > 0.2 ? "bg-amber-100 text-amber-600" :
                                                                                                        "bg-emerald-100 text-emerald-600"
                                                                                    )}>
                                                                                        <Clock size={18} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-0.5">Time Window</p>
                                                                                        <p className="text-sm font-black text-foreground">{format(slot.startTime, "HH:mm")} — {format(addHours(slot.startTime, slot.durationHours), "HH:mm")}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                    <div className="p-3 bg-foreground/2 rounded-xl flex items-center justify-between">
                                                                                        <span className="text-[9px] font-black uppercase text-foreground/40">Status</span>
                                                                                        <Badge variant="outline" className={cn(
                                                                                            "text-[8px] font-black uppercase tracking-widest px-2 py-0 border-0",
                                                                                            isFull ? "bg-slate-100 text-slate-500" :
                                                                                                rate > 0.8 ? "bg-red-500/10 text-red-600" :
                                                                                                    rate > 0.5 ? "bg-orange-500/10 text-orange-600" :
                                                                                                        rate > 0.2 ? "bg-amber-500/10 text-amber-600" :
                                                                                                            "bg-emerald-500/10 text-emerald-600"
                                                                                        )}>
                                                                                            {isFull ? "Full" : Math.round(rate * 100) + "% Occupied"}
                                                                                        </Badge>
                                                                                    </div>
                                                                                    <div className="p-3 bg-foreground/2 rounded-xl flex items-center justify-between">
                                                                                        <span className="text-[9px] font-black uppercase text-foreground/40">Capacity</span>
                                                                                        <span className="text-xs font-black text-foreground">{slot.totalCapacity - Math.floor(slot.occupancyRate * slot.totalCapacity)} / {slot.totalCapacity}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-4 pt-4 border-t border-foreground/5">
                                                                                    <p className="text-[9px] font-bold text-foreground/40 italic text-center">
                                                                                        {isFull ? "Reservations closed for this window" : "Tap slot to proceed with booking confirmation"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <ScrollBar orientation="horizontal" className="h-2 bg-foreground/5 hover:bg-foreground/10 transition-colors" />
                                </ScrollArea>
                            )}
                        </div>
                    </ChartCard>

                    {/* Detailed Booking Log - Below Calendar */}
                    <ChartCard
                        title="Detailed Booking Log"
                        subtitle="Management & verification"
                        accentColor="bg-accent"
                        delay={3}
                    >
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4 bg-foreground/2 p-4 rounded-xl border border-foreground/5 relative">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground/20" />
                                    <Input
                                        placeholder="Search by reference or Cargo ID..."
                                        className="pl-9 bg-transparent border-none outline-none focus-visible:ring-0 placeholder:text-foreground/20 font-medium"
                                        value={activeFilters.searchRef}
                                        onChange={(e) => setActiveFilters(prev => ({ ...prev, searchRef: e.target.value }))}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-xl border-foreground/10 h-10 w-10 text-foreground/60 hover:text-primary transition-all"
                                        onClick={() => {
                                            toast.promise(loadMainData(), {
                                                loading: 'Refreshing log...',
                                                success: 'Log updated',
                                                error: 'Failed to refresh'
                                            });
                                        }}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            "rounded-xl border-foreground/10 flex items-center gap-2 h-10 px-4 transition-all hover:bg-accent hover:text-white hover:border-accent",
                                            activeFilters.status.length > 0 || activeFilters.dateFrom || activeFilters.dateTo ? "bg-accent/10 border-accent/20 text-accent" : "text-foreground/60"
                                        )}
                                        onClick={() => setIsFiltersOpen(true)}
                                    >
                                        <Filter size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                                        {(activeFilters.status.length > 0 || activeFilters.dateFrom || activeFilters.dateTo) && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-foreground/10 flex items-center gap-2 h-10 px-4 hover:bg-primary hover:text-white hover:border-primary transition-all text-foreground/60"
                                        onClick={() => setIsExportOpen(true)}
                                    >
                                        <Download size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Export</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-foreground/5 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-foreground/2">
                                        <TableRow className="border-foreground/5">
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Code</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Cargo</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Slot</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Terminal</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40">Status</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Verification</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.map(booking => (
                                            <TableRow key={booking.id} className="border-foreground/5 transition-colors hover:bg-foreground/3">
                                                <TableCell className="font-mono font-bold text-xs">{booking.bookingCode}</TableCell>
                                                <TableCell className="font-bold text-xs text-accent">{booking.containerNumber}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold">{format(booking.date, "MMM dd, yyyy")}</span>
                                                        <span className="text-[10px] text-foreground/40 font-bold">{booking.timeSlot}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-bold opacity-60">{booking.terminal}</TableCell>
                                                <TableCell><span className={getStatusStyle(booking.status)}>{booking.status}</span></TableCell>
                                                <TableCell className="text-right">
                                                    {booking.status === 'confirmed' && booking.qrCode && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 rounded-lg hover:bg-secondary/20 hover:text-secondary-foreground transition-all active:scale-95"
                                                            onClick={() => setQrBooking(booking)}
                                                        >
                                                            <QrCode className="w-4 h-4 mr-2" /> View QR
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </ChartCard>
                </div>

                {/* Modals */}
                <Dialog open={!!qrBooking} onOpenChange={() => setQrBooking(null)}>
                    <DialogContent className="fixed! top-1/2! left-1/2! -translate-x-1/2! -translate-y-1/2! z-50 max-w-xs w-[90vw] glass-card-geo border-foreground/10 rounded-xl p-8 shadow-2xl">
                        <DialogHeader className="items-center">
                            <DialogTitle className="font-black text-xl uppercase tracking-widest mb-1">Pass Validated</DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-success">Scan at terminal gate</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center p-8 bg-white rounded-xl shadow-inner mt-4 border border-slate-100">
                            {qrBooking?.qrCode && (
                                <QRCodeCanvas value={qrBooking.qrCode} size={180} level="H" />
                            )}
                        </div>
                        <div className="text-center mt-6">
                            <p className="font-black text-lg tracking-widest text-primary">{qrBooking?.bookingCode}</p>
                            <p className="text-[10px] font-bold text-foreground/30 mt-1">{qrBooking && format(qrBooking.date, "EEEE, MMMM dd")}</p>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogContent className="fixed! top-1/2! left-1/2! -translate-x-1/2! -translate-y-1/2! z-50 glass-card-geo border-foreground/10 rounded-xl max-w-[650px] w-[95vw] shadow-2xl p-0 overflow-hidden">
                        <div className="p-6 border-b border-foreground/5 bg-foreground/2 flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-xl font-bold">Batch Scheduling Session</DialogTitle>
                                <DialogDescription className="text-xs font-bold text-primary italic">
                                    {selectedSlot && format(selectedSlot.startTime, "EEEE, MMM d @ HH:mm")}
                                </DialogDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className={cn("w-2.5 h-2.5 rounded-full", bookingStep >= step ? "bg-primary" : "bg-foreground/10")} />
                                ))}
                            </div>
                        </div>

                        <div className="p-6 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {bookingStep === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                                        <div className="grid gap-3">
                                            <p className="text-[10px] font-black uppercase text-foreground/40 mb-1">Verify Payload ({cargoPool.length} Units)</p>
                                            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                                                {cargoPool.map(cargo => (
                                                    <div key={cargo.id} className="p-3 rounded-lg bg-foreground/3 border border-foreground/5 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-accent/10 text-accent rounded-md"><QrCode size={14} /></div>
                                                            <div>
                                                                <p className="text-xs font-bold">{cargo.container_number}</p>
                                                                <p className="text-[8px] font-bold text-foreground/30">{cargo.terminal?.zone_name || "Port Arrival"}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="text-[8px] font-black uppercase border-foreground/10">{cargo.container_type || '20FT'}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {bookingStep === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Assign Bulk Fleet</label>
                                                <Select onValueChange={setSelectedTruck} value={selectedTruck}>
                                                    <SelectTrigger className="rounded-lg border-foreground/10 bg-white h-12 font-bold focus:ring-primary/20"><SelectValue placeholder="Select Prime Mover" /></SelectTrigger>
                                                    <SelectContent className="glass-card-geo border-foreground/10">
                                                        {trucks.map(t => <SelectItem key={t.id} value={t.id}>{t.plate_number}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Assign Primary Driver</label>
                                                <Select onValueChange={setSelectedDriver} value={selectedDriver}>
                                                    <SelectTrigger className="rounded-lg border-foreground/10 bg-white h-12 font-bold focus:ring-primary/20"><SelectValue placeholder="Assign Operator" /></SelectTrigger>
                                                    <SelectContent className="glass-card-geo border-foreground/10">
                                                        {drivers.map(d => <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-[9px] text-foreground/40 italic font-medium ml-1">Assigned resources will apply to all {cargoPool.length} containers in this batch.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {bookingStep === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 flex flex-col items-center justify-center p-8 text-center text-foreground">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><CheckCircle2 size={32} /></div>
                                        <h3 className="text-xl font-bold">Ready to Finalize?</h3>
                                        <p className="text-sm text-foreground/50 max-w-[300px]">Book <strong>{cargoPool.length} units</strong> for window <strong>{selectedSlot && format(selectedSlot.startTime, "HH:mm")}</strong>.</p>
                                        <div className="w-full h-px bg-foreground/5 my-2" />
                                        <div className="flex gap-10">
                                            <div className="text-center"><p className="text-[8px] font-black uppercase text-foreground/30">Truck</p><p className="text-sm font-bold">{trucks.find(t => t.id === selectedTruck)?.plate_number}</p></div>
                                            <div className="text-center"><p className="text-[8px] font-black uppercase text-foreground/30">Driver</p><p className="text-sm font-bold">{drivers.find(d => d.id === selectedDriver)?.full_name}</p></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-6 bg-foreground/2 border-t border-foreground/5 flex gap-3">
                            {bookingStep > 1 ? (
                                <Button variant="ghost" className="flex-1 rounded-lg h-12 font-bold uppercase text-[10px] tracking-widest" onClick={() => setBookingStep(prev => prev - 1)}>Back</Button>
                            ) : (
                                <Button variant="ghost" className="flex-1 rounded-lg h-12 font-bold uppercase text-[10px] tracking-widest text-error" onClick={() => setIsBookingDialogOpen(false)}>Cancel Session</Button>
                            )}
                            <Button
                                className="flex-2 rounded-lg h-12 font-bold uppercase text-[10px] tracking-widest bg-primary shadow-lg shadow-primary/20"
                                disabled={isSubmitting}
                                onClick={() => {
                                    if (bookingStep < 3) {
                                        if (bookingStep === 2 && (!selectedTruck || !selectedDriver)) {
                                            toast.error("Assign both a vehicle and an operator");
                                            return;
                                        }
                                        setBookingStep(prev => prev + 1);
                                    } else {
                                        handleFinalBatchBooking();
                                    }
                                }}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    bookingStep === 3 ? `Reserve ${cargoPool.length} Slots` : "Next Task"
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Standardized Import Modals */}
                <ImportModal
                    isOpen={isCargoImportOpen}
                    onClose={() => setIsCargoImportOpen(false)}
                    onImport={(data) => {
                        setImportText(data);
                        handleImportCargoList();
                    }}
                    title="Import Cargo Manifest"
                    description="Upload your logistics CSV or paste Container IDs to verify availability"
                />

                <ImportModal
                    isOpen={isFleetImportOpen}
                    onClose={() => setIsFleetImportOpen(false)}
                    onImport={(data) => {
                        toast.info("Fleet data received. Integration in progress...");
                    }}
                    title="Import Fleet Registry"
                    description="Bulk assign Trucks and Drivers from your external fleet management system"
                />

                {/* Centered Filter Popup */}
                <FiltersPanel
                    isOpen={isFiltersOpen}
                    onClose={() => setIsFiltersOpen(false)}
                    onApply={(f) => {
                        setActiveFilters(prev => ({
                            ...prev,
                            dateFrom: f.fromDate,
                            dateTo: f.toDate,
                            status: f.status
                        }));
                    }}
                    type="booking"
                    centered={true}
                />

                {/* Standardized Export Modal */}
                <ExportModal
                    isOpen={isExportOpen}
                    onClose={() => setIsExportOpen(false)}
                    data={bookings}
                    type="bookings"
                />
            </div>
        </TooltipProvider>
    );
}
