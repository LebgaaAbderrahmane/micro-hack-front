"use client";

import React, { useEffect, useState, useRef } from "react";
import { Download, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
    bookingId: string;
    data: string;
    expiresAt?: Date;
    status?: "active" | "expired" | "used";
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
    bookingId,
    data,
    expiresAt,
    status = "active",
}) => {
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!expiresAt) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeRemaining("Expired");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    // Simple QR placeholder using canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);

        // Draw simple QR-style pattern
        ctx.fillStyle = '#000000';
        const size = 8;
        for (let i = 0; i < 32; i++) {
            for (let j = 0; j < 32; j++) {
                if ((i + j) % 2 === 0 || i === 0 || i === 31 || j === 0 || j === 31) {
                    ctx.fillRect(i * size, j * size, size, size);
                }
            }
        }

        // Draw booking ID
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(64, 112, 128, 32);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bookingId, 128, 130);
    }, [bookingId]);

    const downloadQR = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `booking-${bookingId}.png`;
        link.href = dataUrl;
        link.click();
    };

    const statusConfig = {
        active: {
            bg: "bg-success/5",
            border: "border-success/20",
            text: "text-success",
            label: "Active",
        },
        expired: {
            bg: "bg-error/5",
            border: "border-error/20",
            text: "text-error",
            label: "Expired",
        },
        used: {
            bg: "bg-foreground/5",
            border: "border-foreground/20",
            text: "text-foreground/40",
            label: "Used",
        },
    };

    const config = statusConfig[status];

    return (
        <div className="glass-card p-8 border border-foreground/10 space-y-6">
            {/* QR Code Container */}
            <div className={cn(
                "relative rounded-3xl p-8 border-2 transition-all duration-500",
                config.bg,
                config.border
            )}>
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <div className={cn(
                        "px-4 py-2 rounded-xl border-2 backdrop-blur-xl flex items-center gap-2",
                        config.bg,
                        config.border,
                        config.text
                    )}>
                        {status === "active" && <CheckCircle2 size={14} />}
                        {status === "expired" && <Clock size={14} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* QR Code Canvas */}
                <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        width={256}
                        height={256}
                        className="w-full h-auto max-w-[256px]"
                    />
                </div>

                {/* Overlay for expired/used status */}
                {(status === "expired" || status === "used") && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                        <div className="text-center">
                            <p className={cn("text-2xl font-black uppercase tracking-tight", config.text)}>
                                {config.label}
                            </p>
                            <p className="text-sm text-foreground/40 font-bold mt-2">
                                {status === "expired" ? "This QR code has expired" : "Already used"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Info */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Booking ID</p>
                        <p className="font-black text-foreground mt-1">{bookingId}</p>
                    </div>
                    {expiresAt && status === "active" && (
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Expires In</p>
                            <p className="font-black text-primary mt-1 tabular-nums">{timeRemaining}</p>
                        </div>
                    )}
                </div>

                {/* Download Button */}
                {status === "active" && (
                    <button
                        onClick={downloadQR}
                        className="w-full py-3 px-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Download size={16} className="text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Download QR Code</span>
                    </button>
                )}

                {/* Usage Instructions */}
                <div className="p-4 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">
                        Usage Instructions
                    </p>
                    <ul className="space-y-1 text-xs text-foreground/60 font-medium">
                        <li>• Present this QR code at the terminal gate</li>
                        <li>• Arrive 15 minutes before scheduled time</li>
                        <li>• QR code is valid for single use only</li>
                        {expiresAt && <li>• Code expires at {new Date(expiresAt).toLocaleString()}</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Generate QR data string from booking info
export const generateBookingQR = (bookingId: string, terminalId: string, slot: string): string => {
    const qrData = {
        bookingId,
        terminalId,
        slot,
        timestamp: new Date().toISOString(),
        version: "1.0",
    };
    return JSON.stringify(qrData);
};
