"use client";

import React from "react";
import QRCode from "react-qr-code";
import { Download, Share2, ShieldCheck, Printer } from "lucide-react";

interface QRCodeDisplayProps {
    value: string;
    bookingNumber: string;
    terminalName: string;
}

export const QRCodeDisplay = ({ value, bookingNumber, terminalName }: QRCodeDisplayProps) => {
    return (
        <div className="glass-card p-8 border border-foreground/10 flex flex-col items-center space-y-8 max-w-sm mx-auto shadow-2xl relative overflow-hidden group">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors"></div>

            <div className="flex flex-col items-center gap-2 text-center relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <ShieldCheck size={24} />
                </div>
                <h3 className="font-black text-xl tracking-tight uppercase">Access Permit</h3>
                <p className="text-foreground/40 text-xs font-bold tracking-[0.2em]">{bookingNumber}</p>
            </div>

            <div className="p-6 bg-white rounded-[2rem] shadow-inner relative z-10">
                <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={value}
                        viewBox={`0 0 256 256`}
                        fgColor="#111827"
                    />
                </div>
            </div>

            <div className="w-full space-y-4 relative z-10">
                <div className="flex items-center justify-between px-2 pt-4 border-t border-foreground/5">
                    <div>
                        <span className="text-[10px] font-bold text-foreground/30 uppercase block">Terminal</span>
                        <p className="text-sm font-bold">{terminalName}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-foreground/30 uppercase block">Validity</span>
                        <p className="text-sm font-bold text-primary">Active</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground">
                        <Download size={18} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Save</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground">
                        <Printer size={18} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Print</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground">
                        <Share2 size={18} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
