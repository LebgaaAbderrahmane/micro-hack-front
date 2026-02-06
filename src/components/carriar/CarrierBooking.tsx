"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    format,
    addDays,
    isBefore,
    startOfToday,
    parseISO,
} from "date-fns";
import {
    Truck,
    Download,
    X,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Database, Tables } from "@/types/database.types";

// ---------- TYPES ----------

type SlotRow = Tables<"active_slots">;
type BookingRow = Tables<"bookings">;
type DriverRow = Tables<"drivers">;
type TruckRow = Tables<"trucks">;

interface TimeSlot extends SlotRow {
    durationHours: number; // Computed
    status: Database["public"]["Enums"]["slot_status_enum"]; // Ensure enum type match if string
}

interface BookingDisplay extends BookingRow {
    // helpers if needed
}

// Full 24h range (or 06:00 to 23:00)
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 -> 23:00

// ---------- COMPONENT ----------

export default function CarrierBookingPage() {
    const supabase = createClient();
    const { user, profile } = useAuth(); // profile usually has org_id if set up correctly

    // Data State
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [bookings, setBookings] = useState<BookingDisplay[]>([]);
    const [drivers, setDrivers] = useState<DriverRow[]>([]);
    const [trucks, setTrucks] = useState<TruckRow[]>([]);

    // UI State
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

    // Form State
    const [selectedDriver, setSelectedDriver] = useState<string>("");
    const [selectedTruck, setSelectedTruck] = useState<string>("");
    // const [containerType, setContainerType] = useState("20FT"); // Not stored in DB currently

    // Selection & Loading
    const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
    const [qrBooking, setQrBooking] = useState<BookingDisplay | null>(null);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<string>("");

    // ---------- INITIALIZATION ----------

    const fetchSlots = async () => {
        try {
            const { data, error } = await supabase
                .from("active_slots")
                .select("*")
                .gte("start_time", startOfToday().toISOString())
                .order("start_time", { ascending: true });

            if (error) throw error;

            const processedSlots: TimeSlot[] = (data || []).map(slot => ({
                ...slot,
                durationHours: (new Date(slot.end_time).getTime() - new Date(slot.start_time).getTime()) / (1000 * 60 * 60)
            }));
            setSlots(processedSlots);
        } catch (error) {
            console.error("Error fetching slots:", error);
            toast.error("Failed to load availability.");
        } finally {
            setLoadingSlots(false);
        }
    };

    const fetchBookings = async () => {
        if (!user) return;
        try {
            // Need organisation_id to filter bookings properly, OR filter by created_by if permitted
            // Ideally: .eq('carrier_org_id', profile?.org_id)
            let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });

            // Fallback to fetch all or filtered by user if RLS handles it
            if (profile?.id) { // Assuming useAuth provides usable profile
                // We rely on RLS mostly, but for focus:
                // query = query.eq('carrier_org_id', ...);
            }

            const { data, error } = await query;
            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const fetchResources = async () => {
        // Fetch drivers and trucks for the dropdowns
        // We assume profile has org_id. If not, we might be unable to fetch if RLS requires org_id
        if (!profile?.org_id) return;

        const [driversRes, trucksRes] = await Promise.all([
            supabase.from("drivers").select("*").eq("org_id", profile.org_id),
            supabase.from("trucks").select("*").eq("org_id", profile.org_id)
        ]);

        if (driversRes.data) setDrivers(driversRes.data);
        if (trucksRes.data) setTrucks(trucksRes.data);
    };

    useEffect(() => {
        if (user) {
            fetchSlots();
            fetchBookings();
            if (profile?.org_id) fetchResources(); // Only if we have org info
        }

        const channel = supabase
            .channel('slots-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'active_slots' }, () => {
                fetchSlots();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user, profile]); // Re-run if profile loads

    // ---------- COMPUTED ----------

    const days = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 7 }, (_, i) => addDays(today, i));
    }, []);

    const daySlots = useMemo(() => {
        return days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const filtered = slots.filter(s => s.start_time.startsWith(dayStr));
            return { date: day, slots: filtered };
        });
    }, [days, slots]);

    const filteredBookings = useMemo(() => {
        return bookings.filter((b) => {
            const statusMatch = statusFilter.length === 0 || statusFilter.includes(b.status);
            const dateMatch = !dateFilter || (b.scheduled_start && b.scheduled_start.startsWith(dateFilter));
            return statusMatch && dateMatch;
        });
    }, [bookings, statusFilter, dateFilter]);


    // ---------- HANDLERS ----------

    const handleSlotClick = (slot: TimeSlot) => {
        if (slot.status === "FULL" || slot.status === "CLOSED") {
            toast.error("Slot unavailable.");
            return;
        }
        if (isBefore(parseISO(slot.start_time), new Date())) {
            toast.error("Slot is in the past.");
            return;
        }
        setSelectedSlot(slot);
        setIsBookingDialogOpen(true);
    };

    const handleBooking = async () => {
        if (!selectedSlot || !user || !profile?.org_id) {
            toast.error("Missing user or organization information.");
            return;
        }
        if (!selectedDriver || !selectedTruck) {
            toast.error("Please select a driver and vehicle.");
            return;
        }

        try {
            toast.loading("Creating booking...");

            const bookingRef = `BK-${format(new Date(), "yyMM")}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const { error } = await supabase
                .from("bookings")
                .insert({
                    slot_id: selectedSlot.id,
                    scheduled_date: selectedSlot.start_time.split('T')[0],
                    scheduled_start: selectedSlot.start_time,
                    scheduled_end: selectedSlot.end_time,
                    booking_reference: bookingRef,
                    carrier_org_id: profile.org_id,
                    driver_id: selectedDriver,
                    truck_id: selectedTruck,
                    booking_type: "EXPORT_DELIVERY", // Default for now
                    payment_status: "UNPAID",
                    priority: "NORMAL",
                    qr_code: bookingRef, // Simple QR content
                    status: "PENDING",
                    // booking_date: new Date().toISOString() // There is no created_at in insert? DB handles it usually default now()
                });

            if (error) throw error;

            toast.dismiss();
            toast.success("Booking requested successfully!");
            setIsBookingDialogOpen(false);
            fetchBookings();

        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Booking failed");
        }
    };

    const handleBulkDownload = () => {
        toast.info("Downloading selected QRs...");
    };

    const toggleSelectAll = (checked: boolean) => {
        if (checked) setSelectedBookings(new Set(filteredBookings.map(b => b.id)));
        else setSelectedBookings(new Set());
    };

    const toggleBookingSelection = (id: string, checked: boolean) => {
        const next = new Set(selectedBookings);
        if (checked) next.add(id);
        else next.delete(id);
        setSelectedBookings(next);
    };

    // ---------- UI HELPERS ----------

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            PENDING: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            CANCELLED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
            COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        };
        return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
    };

    const getSlotColor = (status: string) => {
        switch (status) {
            case "AVAILABLE": return "bg-emerald-500 hover:bg-emerald-600";
            case "FULL": return "bg-red-500 opacity-80";
            case "CLOSED": return "bg-slate-400 opacity-50";
            default: return "bg-slate-400";
        }
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-background p-6 space-y-6 text-foreground">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Truck className="w-8 h-8 text-primary" />
                            </div>
                            Carrier Portal
                        </h1>
                        <p className="text-muted-foreground mt-1 ml-1">Manage bookings and check live availability</p>
                    </div>
                </div>

                {/* VISUAL SCHEDULE */}
                <Card className="glass-card border-none shadow-xl bg-card/50">
                    <CardHeader>
                        <div className="flex justify-between items-center text-sm">
                            <CardTitle>Live Availability</CardTitle>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /> Available</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /> Full</div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loadingSlots ? (
                            <div className="py-12 text-center text-muted-foreground animate-pulse">Loading slots...</div>
                        ) : (
                            <ScrollArea className="w-full border rounded-xl bg-background/50">
                                <div className="min-w-[1400px]">
                                    <div className="grid" style={{ gridTemplateColumns: `100px repeat(${HOURS.length}, 1fr)` }}>
                                        <div className="p-3 border-b border-r bg-muted/30 font-semibold text-center sticky left-0 z-20 backdrop-blur-md">Day</div>
                                        {HOURS.map(h => (
                                            <div key={h} className="p-3 border-b border-r text-center text-xs font-medium bg-muted/10 text-muted-foreground">
                                                {String(h).padStart(2, "0")}:00
                                            </div>
                                        ))}

                                        {daySlots.map(({ date, slots }) => (
                                            <React.Fragment key={date.toISOString()}>
                                                <div className="p-3 border-b border-r bg-card sticky left-0 z-10 flex flex-col justify-center items-center h-16 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                                    <span className="text-xs text-muted-foreground uppercase">{format(date, "EEE")}</span>
                                                    <span className="font-bold">{format(date, "d")}</span>
                                                </div>

                                                {HOURS.map(hour => {
                                                    const slot = slots.find(s => parseISO(s.start_time).getHours() === hour);
                                                    if (!slot) return <div key={hour} className="border-b border-r bg-muted/5"></div>;

                                                    return (
                                                        <Tooltip key={slot.id}>
                                                            <TooltipTrigger asChild>
                                                                <div className="border-b border-r p-1">
                                                                    <div
                                                                        onClick={() => handleSlotClick(slot)}
                                                                        className={`w-full h-full rounded cursor-pointer flex items-center justify-center text-white text-[10px] font-bold shadow-sm transition-transform hover:scale-105 ${getSlotColor(slot.status)}`}
                                                                    >
                                                                        {slot.status === 'AVAILABLE' ? `${slot.current_occupancy}/${slot.max_capacity}` : slot.status}
                                                                    </div>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="text-xs">
                                                                    <p className="font-semibold">{format(parseISO(slot.start_time), "HH:mm")} - {format(parseISO(slot.end_time), "HH:mm")}</p>
                                                                    <p>Capacity: {slot.current_occupancy} / {slot.max_capacity}</p>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>

                {/* BOOKINGS TABLE */}
                <div className="grid gap-6">
                    <div className="flex flex-wrap gap-3 p-4 bg-card rounded-xl border items-center shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mr-2">
                            <Filter className="w-4 h-4" /> <span className="text-sm font-medium">Filters</span>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="rounded-full">Status</Button></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {['CONFIRMED', 'PENDING', 'REJECTED'].map(s => (
                                    <DropdownMenuCheckboxItem
                                        key={s}
                                        checked={statusFilter.includes(s)}
                                        onCheckedChange={(c) => setStatusFilter(prev => c ? [...prev, s] : prev.filter(x => x !== s))}
                                    >
                                        {s}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Input
                            type="date"
                            className="w-auto h-9 rounded-full bg-background"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />

                        {(statusFilter.length > 0 || dateFilter) && (
                            <Button variant="ghost" size="sm" onClick={() => { setStatusFilter([]); setDateFilter(""); }} className="text-red-500 rounded-full">Clear</Button>
                        )}
                    </div>

                    <Card className="glass-card shadow-lg bg-card/60">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Booking History</CardTitle>
                            {selectedBookings.size > 0 && (
                                <Button size="sm" variant="outline" onClick={handleBulkDownload}>
                                    <Download className="w-4 h-4 mr-2" /> QR
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedBookings.size === filteredBookings.length && filteredBookings.length > 0}
                                                onCheckedChange={(c) => toggleSelectAll(!!c)}
                                            />
                                        </TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingBookings ? (
                                        <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>
                                    ) : filteredBookings.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No bookings found.</TableCell></TableRow>
                                    ) : (
                                        filteredBookings.map(booking => (
                                            <TableRow key={booking.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedBookings.has(booking.id)}
                                                        onCheckedChange={(c) => toggleBookingSelection(booking.id, !!c)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-mono font-medium">{booking.booking_reference}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-sm">
                                                        <span>{format(parseISO(booking.scheduled_start), "MMM dd, yyyy")}</span>
                                                        <span className="text-muted-foreground">{format(parseISO(booking.scheduled_start), "HH:mm")}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="icon" variant="ghost" onClick={() => setQrBooking(booking)} disabled={booking.status !== 'CONFIRMED'}>
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* QR DIALOG */}
                <Dialog open={!!qrBooking} onOpenChange={() => setQrBooking(null)}>
                    <DialogContent className="sm:max-w-xs bg-card">
                        <DialogHeader><DialogTitle>Gate Pass</DialogTitle></DialogHeader>
                        <div className="flex justify-center py-6 bg-white rounded-xl border">
                            {qrBooking && <QRCodeCanvas value={qrBooking.qr_code} size={180} />}
                        </div>
                        <div className="text-center">
                            <p className="font-mono font-bold">{qrBooking?.booking_reference}</p>
                        </div>
                        <Button className="w-full" onClick={() => toast.success("Downloaded")}>Save to Device</Button>
                    </DialogContent>
                </Dialog>

                {/* BOOKING DIALOG */}
                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogContent className="bg-card">
                        <DialogHeader>
                            <DialogTitle>Confirm Slot Booking</DialogTitle>
                            <DialogDescription>
                                {selectedSlot && format(parseISO(selectedSlot.start_time), "EEEE, MMMM d 'at' HH:mm")}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Driver</label>
                                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                                    <SelectTrigger><SelectValue placeholder="Select Driver" /></SelectTrigger>
                                    <SelectContent>
                                        {drivers.length === 0 ? <SelectItem value="none" disabled>No drivers found</SelectItem> :
                                            drivers.map(d => <SelectItem key={d.id} value={d.id}>{d.full_name} ({d.license_number})</SelectItem>)
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Vehicle</label>
                                <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                                    <SelectTrigger><SelectValue placeholder="Select Truck" /></SelectTrigger>
                                    <SelectContent>
                                        {trucks.length === 0 ? <SelectItem value="none" disabled>No trucks found</SelectItem> :
                                            trucks.map(t => <SelectItem key={t.id} value={t.id}>{t.plate_number} ({t.status})</SelectItem>)
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsBookingDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleBooking}>Confirm Booking</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </TooltipProvider>
    );
}
