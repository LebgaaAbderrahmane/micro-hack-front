"use client";

import React, { useState, useMemo, useEffect } from "react";
import { format, addDays, addHours, isBefore, startOfDay } from "date-fns";
import {
    Truck,
    CheckCircle,
    XCircle,
    Download,
    X,
    Filter,
    Calendar,
    Clock,
    MoreHorizontal,
    QrCode,
    Mail
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// ---------- TYPES ----------

interface TimeSlot {
    id: string;
    startTime: Date;
    durationHours: number;
    availableCapacity: number;
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
    qrCode?: string; // Add QR code field
}

// Full 24h range (or 06:00 to 23:00)
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 -> 23:00

export default function CarrierBookingPage() {
    const supabase = createClient();
    const { profile: user } = useAuth();
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [containerType, setContainerType] = useState("20FT");
    const [terminal, setTerminal] = useState<"terminal-a" | "terminal-b">("terminal-a");

    // Real Data States
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [trucks, setTrucks] = useState<{ id: string; plate_number: string; status: string }[]>([]);
    const [drivers, setDrivers] = useState<{ id: string; full_name: string }[]>([]);
    const [selectedTruck, setSelectedTruck] = useState<string>("");
    const [selectedDriver, setSelectedDriver] = useState<string>("");

    const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
    const [qrBooking, setQrBooking] = useState<Booking | null>(null);

    // Filters state
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [dbSlots, setDbSlots] = useState<any[]>([]);
    const [terminals, setTerminals] = useState<any[]>([]);
    const [selectedTerminal, setSelectedTerminal] = useState<string>("");

    // Real-time Data Fetching
    useEffect(() => {
        if (!user?.org_id) return;

        const fetchData = async () => {
            // Fetch Trucks
            const { data: trucksData } = await supabase
                .from("trucks")
                .select("id, plate_number, status")
                .eq("org_id", user.org_id);
            if (trucksData) setTrucks(trucksData);

            // Fetch Drivers
            const { data: driversData } = await supabase
                .from("drivers")
                .select("id, full_name")
                .eq("org_id", user.org_id);
            if (driversData) setDrivers(driversData);

            // Fetch Terminals
            const { data: termData } = await supabase.from("terminals").select(`
                *,
                gate:gates(gate_number)
            `);
            if (termData) {
                setTerminals(termData);
                if (termData.length > 0) setSelectedTerminal(termData[0].id);
            }

            // Fetch Bookings
            const { data: bookingsData } = await supabase
                .from("bookings")
                .select("*")
                .eq("carrier_org_id", user.org_id)
                .order("created_at", { ascending: false });

            if (bookingsData) {
                const mappedBookings: Booking[] = bookingsData.map((b: any) => ({
                    id: b.id,
                    bookingCode: b.booking_reference,
                    date: new Date(b.scheduled_date),
                    timeSlot: `${format(new Date(b.scheduled_start), "HH:mm")} - ${format(new Date(b.scheduled_end), "HH:mm")}`,
                    containerType: "20FT", // Default or fetch relation if needed
                    status: b.status.toLowerCase(),
                    terminal: "Terminal A", // Map from terminal_id or relation
                    gate: "Auto-assigned",
                    createdAt: new Date(b.created_at),
                    qrCode: b.qr_code
                }));
                setBookings(mappedBookings);
            }
        };

        fetchData();

        // Real-time Subscription for Bookings
        const channel = supabase
            .channel("carrier-bookings")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookings",
                    filter: `carrier_org_id=eq.${user.org_id}`,
                },
                (payload) => {
                    console.log("Real-time update:", payload);
                    fetchData(); // Simplest way to sync state is refetch or manually merge
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.org_id, supabase]);

    // Fetch Real Slots
    useEffect(() => {
        const fetchSlots = async () => {
            let query = supabase
                .from("active_slots")
                .select("*")
                .eq("slot_date", dateFilter);

            if (selectedTerminal) {
                query = query.eq("terminal_id", selectedTerminal);
            }

            const { data, error } = await query;
            if (data) setDbSlots(data);
        };

        fetchSlots();
    }, [dateFilter, selectedTerminal, supabase]);


    // Mock Slots (For demo, usually fetch active_slots from DB)
    const days = useMemo(() => {
        const today = new Date();
        const firstDay = addDays(startOfDay(today), 1);
        return Array.from({ length: 7 }, (_, i) => addDays(firstDay, i));
    }, []);

    const daySlots = useMemo(() => {
        // Group dbSlots by date (though we filter by date, let's keep the structure for Gantt)
        const dateMap: Record<string, any[]> = {};

        dbSlots.forEach(s => {
            if (!dateMap[s.slot_date]) dateMap[s.slot_date] = [];

            // Map DB slot to TimeSlot interface
            const startTime = new Date(`${s.slot_date}T${s.start_time}`);
            const endTime = new Date(`${s.slot_date}T${s.end_time}`);
            const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

            dateMap[s.slot_date].push({
                id: s.id,
                startTime,
                durationHours: Math.max(1, Math.round(duration)),
                availableCapacity: s.max_capacity - (s.current_occupancy || 0),
                totalCapacity: s.max_capacity,
                status: (s.current_occupancy || 0) >= s.max_capacity ? "full" : "available",
            });
        });

        // Ensure we show at least the selected date or upcoming days
        const targetDates = [dateFilter]; // For now focus on filtered date

        return targetDates.map(d => ({
            date: new Date(d),
            slots: dateMap[d] || []
        }));
    }, [dbSlots, dateFilter]);

    // Filtered bookings
    const filteredBookings = useMemo(() => {
        return bookings.filter((b) => {
            const statusMatch = statusFilter.length === 0 || statusFilter.includes(b.status);
            const typeMatch = typeFilter.length === 0 || typeFilter.includes(b.containerType);
            const dateMatch =
                !dateFilter || format(b.date, "yyyy-MM-dd") === dateFilter;

            return statusMatch && typeMatch && dateMatch;
        });
    }, [bookings, statusFilter, typeFilter, dateFilter]);

    // Actions
    const handleSlotClick = (slot: TimeSlot) => {
        if (isBefore(slot.startTime, new Date())) {
            toast.error("Slot is in the past.");
            return;
        }
        setSelectedSlot(slot);
        setIsBookingDialogOpen(true);
    };

    const handleBooking = async () => {
        if (!selectedSlot || !user?.org_id || !selectedTruck || !selectedDriver) {
            toast.error("Please select a truck, driver, and slot.");
            return;
        }

        const startTime = selectedSlot.startTime;
        const endTime = addHours(selectedSlot.startTime, selectedSlot.durationHours);
        const bookingRef = `BK-${Date.now().toString().slice(-6)}`;

        try {
            const { error } = await supabase.from("bookings").insert({
                booking_reference: bookingRef,
                carrier_org_id: user.org_id,
                truck_id: selectedTruck,
                driver_id: selectedDriver,
                slot_id: selectedSlot.id,
                scheduled_date: format(startTime, "yyyy-MM-dd"),
                scheduled_start: format(startTime, "yyyy-MM-dd HH:mm:ss"),
                scheduled_end: format(endTime, "yyyy-MM-dd HH:mm:ss"),
                status: "PENDING",
                booking_type: "EXPORT_DELIVERY", // Default
                qr_code: "{}" // Placeholder until validated
            });

            if (error) throw error;

            toast.success("Booking requested successfully!");
            setIsBookingDialogOpen(false);
        } catch (err: any) {
            console.error(err);
            toast.error("Booking failed: " + err.message);
        }
    };

    const handleTruckStatusToggle = async (truckId: string, currentStatus: string) => {
        const newStatus = currentStatus === "AVAILABLE" ? "IN_USE" : "AVAILABLE";

        try {
            const { error } = await supabase
                .from("trucks")
                .update({ status: newStatus })
                .eq("id", truckId);

            if (error) throw error;

            setTrucks(prev => prev.map(t => t.id === truckId ? { ...t, status: newStatus } : t));
            toast.success(`Truck ${newStatus === 'AVAILABLE' ? 'available' : 'set to in-use'}`);
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to update truck status");
        }
    };

    const toggleSelectAll = () => {
        if (selectedBookings.size === filteredBookings.length) {
            setSelectedBookings(new Set());
        } else {
            setSelectedBookings(new Set(filteredBookings.map((b) => b.id)));
        }
    };

    const toggleBookingSelection = (id: string) => {
        const next = new Set(selectedBookings);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedBookings(next);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            confirmed: "bg-green-100 text-green-700 hover:bg-green-100",
            pending: "bg-orange-100 text-orange-700 hover:bg-orange-100",
            rejected: "bg-red-100 text-red-700 hover:bg-red-100",
            cancelled: "bg-slate-100 text-slate-700 hover:bg-slate-100",
        };
        return <Badge className={styles[status] || styles.pending}>{status}</Badge>;
    };

    const getSlotColor = (status: TimeSlot["status"]) => {
        return status === "available"
            ? "bg-green-500"
            : status === "limited"
                ? "bg-orange-500"
                : "bg-red-500";
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-slate-50 p-6 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Truck className="w-6 h-6 text-blue-600" /> Carrier Portal
                        </h1>
                        <p className="text-slate-500">Manage bookings and check availability</p>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="bookings" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="bookings">Booking Management</TabsTrigger>
                        <TabsTrigger value="traffic">Traffic Tracking</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="space-y-6">
                        {/* Gantt Chart with Horizontal Scroll */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Availability Schedule (Next 7 Days)</CardTitle>
                                    <div className="flex gap-4 text-sm">
                                        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded" /> Available</span>
                                        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded" /> Limited</span>
                                        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded" /> Full</span>
                                    </div>
                                </div>
                                <CardDescription>Scroll horizontally to select a slot</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="w-full border rounded-md">
                                    <div className="min-w-[1600px]">
                                        <div
                                            className="grid"
                                            style={{
                                                gridTemplateColumns: `120px repeat(${HOURS.length}, 1fr)`,
                                            }}
                                        >
                                            {/* Header Row */}
                                            <div className="p-3 border-b border-r bg-slate-50 font-semibold text-center sticky left-0 z-10">Day</div>
                                            {HOURS.map((h) => (
                                                <div key={h} className="p-3 border-b border-r text-center text-sm font-medium bg-slate-50">
                                                    {String(h).padStart(2, "0")}:00
                                                </div>
                                            ))}

                                            {/* Body Rows */}
                                            {daySlots.map(({ date, slots }) => (
                                                <React.Fragment key={date.toISOString()}>
                                                    <div className="p-3 border-b border-r bg-white sticky left-0 z-10 flex flex-col justify-center items-center shadow-[1px_0_3px_rgba(0,0,0,0.05)]">
                                                        <span className="text-xs text-slate-500">{format(date, "EEE")}</span>
                                                        <span className="font-bold">{format(date, "d MMM")}</span>
                                                    </div>

                                                    {slots.map((slot) => {
                                                        const startHour = slot.startTime.getHours();
                                                        const startIndex = HOURS.indexOf(startHour);
                                                        if (startIndex === -1) return null;

                                                        return (
                                                            <Tooltip key={slot.id}>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        onClick={() => handleSlotClick(slot)}
                                                                        style={{
                                                                            gridColumn: `${startIndex + 2} / span ${slot.durationHours}`,
                                                                        }}
                                                                        className={`h-16 border-b border-r p-1 transition-all ${slot.status === "full" ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-slate-50"
                                                                            }`}
                                                                    >
                                                                        <div className={`h-full w-full rounded-md ${getSlotColor(slot.status)} flex flex-col items-center justify-center text-white text-xs shadow-sm`}>
                                                                            <span className="font-bold">{slot.availableCapacity}/{slot.totalCapacity}</span>
                                                                        </div>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div className="text-xs">
                                                                        <p><strong>{format(slot.startTime, "HH:mm")}</strong></p>
                                                                        <p>Status: {slot.status}</p>
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
                            </CardContent>
                        </Card>

                        {/* Filter Bar */}
                        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg border shadow-sm items-center">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Filter className="w-4 h-4" /> Port / Terminal:
                            </div>

                            <Select value={selectedTerminal} onValueChange={setSelectedTerminal}>
                                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select Terminal" /></SelectTrigger>
                                <SelectContent>
                                    {terminals.map(t => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.zone_name} (Gate {t.gate?.gate_number || "?"})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2 text-slate-500 ml-4">
                                <Calendar className="w-4 h-4" /> Date:
                            </div>
                            <Input
                                type="date"
                                className="w-[180px]"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />

                            <div className="flex-1" />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Status Filter</Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {['confirmed', 'pending', 'rejected', 'cancelled'].map(s => (
                                        <DropdownMenuCheckboxItem
                                            key={s}
                                            checked={statusFilter.includes(s)}
                                            onCheckedChange={(checked) => {
                                                setStatusFilter(prev => checked ? [...prev, s] : prev.filter(x => x !== s))
                                            }}
                                        >
                                            {s}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setStatusFilter([]); setTypeFilter([]); setDateFilter(format(new Date(), "yyyy-MM-dd")); }}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                Reset
                            </Button>
                        </div>

                        {/* Bookings Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Log</CardTitle>
                                <CardDescription>Manage your requested slots</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-10">
                                                <Checkbox
                                                    checked={selectedBookings.size === filteredBookings.length && filteredBookings.length > 0}
                                                    onCheckedChange={toggleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Terminal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                                    No bookings found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredBookings.map(booking => (
                                                <TableRow key={booking.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedBookings.has(booking.id)}
                                                            onCheckedChange={() => toggleBookingSelection(booking.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-mono">{booking.bookingCode}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span>{format(booking.date, "MMM dd, yyyy")}</span>
                                                            <span className="text-xs text-slate-500">{booking.timeSlot}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><Badge variant="outline">{booking.containerType}</Badge></TableCell>
                                                    <TableCell>{booking.terminal}</TableCell>
                                                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        {booking.status === 'confirmed' && booking.qrCode && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => setQrBooking(booking)}
                                                            >
                                                                <QrCode className="w-4 h-4 mr-2" /> View QR
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="traffic">
                        <Card>
                            <CardHeader>
                                <CardTitle>Traffic Tracking & Fleet Availability</CardTitle>
                                <CardDescription>Manage your truck fleet status for real-time tracking</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Truck Plate Number</TableHead>
                                            <TableHead>Current Status</TableHead>
                                            <TableHead className="text-right">Availability</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {trucks.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8">No trucks found.</TableCell>
                                            </TableRow>
                                        ) : (
                                            trucks.map(truck => (
                                                <TableRow key={truck.id}>
                                                    <TableCell className="font-mono font-bold text-blue-600">{truck.plate_number}</TableCell>
                                                    <TableCell>
                                                        <Badge className={truck.status === 'AVAILABLE' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                                                            {truck.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-xs text-muted-foreground mr-2">
                                                                {truck.status === 'AVAILABLE' ? 'Online' : 'In Transit'}
                                                            </span>
                                                            <Checkbox
                                                                checked={truck.status === 'AVAILABLE'}
                                                                onCheckedChange={() => handleTruckStatusToggle(truck.id, truck.status)}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* QR Dialog */}
                <Dialog open={!!qrBooking} onOpenChange={() => setQrBooking(null)}>
                    <DialogContent className="sm:max-w-xs">
                        <DialogHeader>
                            <DialogTitle>Booking QR</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center py-4 bg-white rounded border">
                            {qrBooking && qrBooking.qrCode && (
                                <QRCodeCanvas
                                    value={qrBooking.qrCode}
                                    size={180}
                                    level="H"
                                />
                            )}
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-bold">{qrBooking?.bookingCode}</p>
                            <p className="text-sm text-slate-500">Scan at terminal gate</p>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Booking Dialog */}
                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Booking</DialogTitle>
                            <DialogDescription>
                                {selectedSlot && format(selectedSlot.startTime, "EEEE, MMMM d 'at' HH:mm")}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Select Truck</label>
                                <Select onValueChange={setSelectedTruck} value={selectedTruck}>
                                    <SelectTrigger><SelectValue placeholder="Select a truck" /></SelectTrigger>
                                    <SelectContent>
                                        {trucks.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.plate_number}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Select Driver</label>
                                <Select onValueChange={setSelectedDriver} value={selectedDriver}>
                                    <SelectTrigger><SelectValue placeholder="Select a driver" /></SelectTrigger>
                                    <SelectContent>
                                        {drivers.map(d => (
                                            <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Container Type</label>
                                <Select value={containerType} onValueChange={setContainerType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="20FT">20FT Standard</SelectItem>
                                        <SelectItem value="40FT">40FT Standard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleBooking}>Confirm Booking</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </TooltipProvider>
    );
}
