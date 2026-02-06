"use client";

import React, { useState, useMemo } from "react";
import {
    format,
    addDays,
    addHours,
    isBefore,
    differenceInDays,
    startOfDay,
    eachDayOfInterval,
} from "date-fns";
import {
    Calendar,
    Clock,
    Truck,
    Package,
    CheckCircle,
    XCircle,
    AlertCircle,
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
}

// Full 24h range (or 06:00 to 23:00)
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 -> 23:00

// ---------- TIME SLOT GENERATION ----------

function generateTimeSlotsForDay(date: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let i = 0;

    while (i < HOURS.length) {
        const hour = HOURS[i];

        // Some merged slots logic
        const durationHours =
            i < HOURS.length - 1 && Math.random() > 0.8 ? 2 : 1;

        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);

        const availableCapacity = Math.floor(Math.random() * 20);
        const totalCapacity = 20;
        const percentage = (availableCapacity / totalCapacity) * 100;

        slots.push({
            id: `slot-${date.toISOString()}-${hour}`,
            startTime,
            durationHours,
            availableCapacity,
            totalCapacity,
            status:
                percentage > 50 ? "available" : percentage > 20 ? "limited" : "full",
        });

        i += durationHours;
    }
    return slots;
}

// ---------- COMPONENT ----------

export default function CarrierBookingPage() {
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [containerType, setContainerType] = useState("20FT");
    const [terminal, setTerminal] = useState<"terminal-a" | "terminal-b">("terminal-a");

    const [bookings, setBookings] = useState<Booking[]>([
        {
            id: "1",
            bookingCode: "BK-2026-001-ALG",
            date: new Date(2026, 1, 10, 14, 0),
            timeSlot: "14:00 - 15:00",
            containerType: "40FT",
            status: "confirmed",
            terminal: "Terminal A",
            gate: "Gate 3",
            createdAt: new Date(2026, 1, 3),
        },
        {
            id: "2",
            bookingCode: "BK-2026-002-ALG",
            date: new Date(2026, 1, 12, 9, 0),
            timeSlot: "09:00 - 10:00",
            containerType: "20FT",
            status: "pending",
            terminal: "Terminal B",
            gate: "Gate 1",
            createdAt: new Date(2026, 1, 5),
        },
        {
            id: "3",
            bookingCode: "BK-2026-003-ALG",
            date: new Date(2026, 1, 8, 16, 0),
            timeSlot: "16:00 - 17:00",
            containerType: "40HC",
            status: "rejected",
            terminal: "Terminal A",
            gate: "Gate 2",
            createdAt: new Date(2026, 1, 1),
        },
    ]);

    const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
    const [qrBooking, setQrBooking] = useState<Booking | null>(null);

    // Filters state
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<string>(""); // Simple string date match for demo

    // Derived state: Next 7 days
    const days = useMemo(() => {
        const today = new Date();
        const firstDay = addDays(startOfDay(today), 1);
        return Array.from({ length: 7 }, (_, i) => addDays(firstDay, i));
    }, []);

    const daySlots = useMemo(
        () => days.map((day) => ({ date: day, slots: generateTimeSlotsForDay(day) })),
        [days]
    );

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
        if (slot.status === "full") {
            toast.error("Fully booked.");
            return;
        }
        if (isBefore(slot.startTime, new Date())) {
            toast.error("Slot is in the past.");
            return;
        }
        setSelectedSlot(slot);
        setIsBookingDialogOpen(true);
    };

    const handleBooking = () => {
        if (!selectedSlot) return;
        const endTime = addHours(selectedSlot.startTime, selectedSlot.durationHours);
        const newBooking: Booking = {
            id: Math.random().toString(36).slice(2),
            bookingCode: `BK-2026-${String(bookings.length + 1).padStart(3, "0")}-ALG`,
            date: selectedSlot.startTime,
            timeSlot: `${format(selectedSlot.startTime, "HH:mm")} - ${format(endTime, "HH:mm")}`,
            containerType,
            status: "pending",
            terminal: terminal === "terminal-a" ? "Terminal A" : "Terminal B",
            gate: "Auto-assigned",
            createdAt: new Date(),
        };
        setBookings([newBooking, ...bookings]);
        setIsBookingDialogOpen(false);
        toast.success("Booking requested.");
    };

    const handleCancelBooking = (bookingId: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
        );
        toast.success("Booking cancelled.");
    };

    // Bulk Actions
    const handleBulkDownload = () => {
        const selected = bookings.filter(b => selectedBookings.has(b.id) && b.status === 'confirmed');
        if (selected.length === 0) {
            toast.error("No confirmed bookings selected.");
            return;
        }

        // Since we need actual canvas elements to download, we'll iterate and trigger them.
        // In a real app, you might use a zip library (jszip).
        // Here we'll just open each (or simulate it). 
        // Since we only render one QR in the dialog, we need a hidden way to render them all.
        // For this demo, we'll show a toast.
        toast.info(`Downloading ${selected.length} QR codes... (Mock action)`);
    };

    const handleBulkCancel = () => {
        const selectedIds = Array.from(selectedBookings);
        setBookings(prev => prev.map(b =>
            selectedIds.includes(b.id) && b.status === 'confirmed' ? { ...b, status: 'cancelled' } : b
        ));
        setSelectedBookings(new Set());
        toast.success("Selected bookings cancelled.");
    };

    // Selection
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

    // Render Helpers
    const getStatusBadge = (status: Booking["status"]) => {
        const styles = {
            confirmed: "bg-green-100 text-green-700 hover:bg-green-100",
            pending: "bg-orange-100 text-orange-700 hover:bg-orange-100",
            rejected: "bg-red-100 text-red-700 hover:bg-red-100",
            cancelled: "bg-slate-100 text-slate-700 hover:bg-slate-100",
        };
        return <Badge className={styles[status]}>{status}</Badge>;
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
                    <Select value={terminal} onValueChange={(v: any) => setTerminal(v)}>
                        <SelectTrigger className="w-48 bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="terminal-a">Algiers Terminal A</SelectItem>
                            <SelectItem value="terminal-b">Oran Terminal B</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

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
                        <CardDescription>Scroll horizontally to see all hours (06:00 - 23:00)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="w-full border rounded-md">
                            <div className="min-w-[1600px]"> {/* Force width to enable scroll */}
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
                                                                    <span className="opacity-80 text-[10px]">{slot.durationHours}h</span>
                                                                </div>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <div className="text-xs">
                                                                <p><strong>{format(slot.startTime, "HH:mm")} - {format(addHours(slot.startTime, slot.durationHours), "HH:mm")}</strong></p>
                                                                <p>Status: {slot.status}</p>
                                                                <p>Free: {slot.availableCapacity} slots</p>
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
                        <Filter className="w-4 h-4" /> Filters:
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Status</Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {['confirmed', 'pending', 'rejected', 'cancelled'].map(s => (
                                <DropdownMenuCheckboxItem
                                    key={s}
                                    checked={statusFilter.includes(s)}
                                    onCheckedChange={(checked: boolean) => {
                                        setStatusFilter(prev => checked ? [...prev, s] : prev.filter(x => x !== s))
                                    }}
                                >
                                    {s}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Container Type</Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Filter Type</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {['20FT', '40FT', '40HC', '45HC'].map(t => (
                                <DropdownMenuCheckboxItem
                                    key={t}
                                    checked={typeFilter.includes(t)}
                                    onCheckedChange={(checked: boolean) => {
                                        setTypeFilter(prev => checked ? [...prev, t] : prev.filter(x => x !== t))
                                    }}
                                >
                                    {t}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Input
                        type="date"
                        className="w-auto h-9"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />

                    {/* Clear Filters */}
                    {(statusFilter.length > 0 || typeFilter.length > 0 || dateFilter) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setStatusFilter([]); setTypeFilter([]); setDateFilter(""); }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            Clear All
                        </Button>
                    )}
                </div>

                {/* Bookings Table with Bulk Actions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Booking Log</CardTitle>
                            <CardDescription>Manage your requested slots</CardDescription>
                        </div>
                        {selectedBookings.size > 0 && (
                            <div className="flex gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Button size="sm" variant="outline" onClick={handleBulkDownload}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download QR ({selectedBookings.size})
                                </Button>
                                <Button size="sm" variant="destructive" onClick={handleBulkCancel}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel Selected
                                </Button>
                            </div>
                        )}
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
                                            No bookings found matching filters.
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
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setQrBooking(booking)}
                                                    disabled={booking.status !== 'confirmed'}
                                                >
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

                {/* QR Dialog */}
                <Dialog open={!!qrBooking} onOpenChange={() => setQrBooking(null)}>
                    <DialogContent className="sm:max-w-xs">
                        <DialogHeader>
                            <DialogTitle>Booking QR</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center py-4 bg-white rounded border">
                            {qrBooking && (
                                <QRCodeCanvas
                                    value={qrBooking.bookingCode}
                                    size={180}
                                    level="H"
                                />
                            )}
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-bold">{qrBooking?.bookingCode}</p>
                            <p className="text-sm text-slate-500">{qrBooking?.timeSlot}</p>
                        </div>
                        <Button className="w-full mt-2" onClick={() => toast.success("Downloaded!")}>
                            <Download className="w-4 h-4 mr-2" /> Save Image
                        </Button>
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
                                <label>Container Type</label>
                                <Select value={containerType} onValueChange={setContainerType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="20FT">20FT Standard</SelectItem>
                                        <SelectItem value="40FT">40FT Standard</SelectItem>
                                        <SelectItem value="40HC">40 High Cube</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleBooking}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </TooltipProvider>
    );
}
