"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Truck,
    QrCode,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";

// Types matching DB relations
interface Booking {
    id: string;
    booking_reference: string;
    carrier_org: { name: string };
    truck: { plate_number: string };
    driver: { full_name: string };
    scheduled_date: string;
    scheduled_start: string;
    scheduled_end: string;
    status: "PENDING" | "CONFIRMED" | "REJECTED" | "VALIDATED" | "CANCELLED";
    qr_code?: string;
    created_at: string;
}

export default function OperatorBookings() {
    const supabase = createClient();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showQRModal, setShowQRModal] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        // We need to join tables. Supabase allows this.
        const { data, error } = await supabase
            .from("bookings")
            .select(`
                *,
                carrier_org:organisations!bookings_carrier_org_id_fkey(name),
                truck:trucks(plate_number),
                driver:drivers(full_name)
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Failed to fetch bookings");
        } else if (data) {
            setBookings(data as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();

        // Real-time listener for NEW bookings
        const channel = supabase
            .channel("operator-bookings")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookings",
                },
                (payload) => {
                    console.log("Change received!", payload);
                    fetchBookings();
                    if (payload.eventType === 'INSERT') {
                        toast("New Booking Request received", {
                            description: `Booking ref: ${payload.new.booking_reference}`
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleValidate = async (id: string, ref: string) => {
        // 1. Generate QR Data
        const qrData = JSON.stringify({
            id: id,
            ref: ref,
            valid: true,
            timestamp: new Date().toISOString()
        });

        // 2. Update DB
        const { error } = await supabase
            .from("bookings")
            .update({
                status: "CONFIRMED", // Enum value
                qr_code: qrData
            })
            .eq("id", id);

        if (error) {
            toast.error("Validation failed: " + error.message);
        } else {
            toast.success(`Booking ${ref} Validated & QR Generated`);
            setShowQRModal(id); // Show preview
            // State will update via Realtime or we can optimistic update
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "CONFIRMED", qr_code: qrData } : b));
        }
    };

    const handleReject = async (id: string) => {
        const { error } = await supabase
            .from("bookings")
            .update({ status: "CANCELLED" }) 
            .eq("id", id);

        if (error) {
            toast.error("Action failed");
        } else {
            toast.info("Booking Rejected (Cancelled)");
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "CANCELLED" as any } : b));
        }
    };

    // Filter Logic
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === "all" || booking.status?.toLowerCase() === filterStatus.toLowerCase();
        const matchesSearch =
            booking.booking_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.carrier_org?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusStyle = (status: string) => {
        const s = status?.toUpperCase() || "";
        if (s === "CONFIRMED" || s === "VALIDATED") return "bg-green-100 text-green-700";
        if (s === "PENDING") return "bg-orange-100 text-orange-700";
        if (s === "CANCELLED" || s === "REJECTED") return "bg-red-100 text-red-700";
        return "bg-slate-100 text-slate-700";
    };

    const validatedBooking = bookings.find(b => b.id === showQRModal);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Booking Management</h2>
                    <p className="text-muted-foreground">Validate incoming requests from carriers</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fetchBookings()} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                    <Button>Export Data</Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 glass-card-geo p-4 rounded-xl border border-foreground/5 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reference or carrier..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="text-sm border rounded p-2 bg-transparent"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <Card>
                <CardHeader className="p-0" />
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference</TableHead>
                                <TableHead>Carrier & Driver</TableHead>
                                <TableHead>Slot Detail</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        No bookings found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-mono font-medium">
                                            {booking.booking_reference}
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(booking.created_at), "MMM d, HH:mm")}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{booking.carrier_org?.name || "Unknown Org"}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Truck className="w-3 h-3" /> {booking.truck?.plate_number || "N/A"}
                                                <span className="mx-1">•</span>
                                                {booking.driver?.full_name || "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">
                                                    {format(new Date(booking.scheduled_date), "MMM d")}
                                                </div>
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {format(new Date(booking.scheduled_start), "HH:mm")} - {format(new Date(booking.scheduled_end), "HH:mm")}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`hover:bg-opacity-80 ${getStatusStyle(booking.status)}`}>
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.booking_reference)}>
                                                        Copy Ref
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {booking.status === 'PENDING' && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleValidate(booking.id, booking.booking_reference)} className="text-green-600">
                                                                <CheckCircle className="w-4 h-4 mr-2" /> Validate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleReject(booking.id)} className="text-red-600">
                                                                <XCircle className="w-4 h-4 mr-2" /> Reject
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {booking.status === 'CONFIRMED' && (
                                                        <DropdownMenuItem onClick={() => setShowQRModal(booking.id)}>
                                                            <QrCode className="w-4 h-4 mr-2" /> View QR
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* QR Preview Modal */}
            <Dialog open={!!showQRModal} onOpenChange={() => setShowQRModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Booking Validated</DialogTitle>
                        <DialogDescription>
                            This QR code has been generated and sent to the carrier.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg">
                        {validatedBooking?.qr_code && (
                            <QRCodeCanvas
                                value={validatedBooking.qr_code}
                                size={200}
                                level="H"
                            />
                        )}
                        <div className="mt-4 text-center">
                            <h3 className="font-mono font-bold text-lg">{validatedBooking?.booking_reference}</h3>
                            <p className="text-sm text-muted-foreground">{validatedBooking?.truck?.plate_number}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
