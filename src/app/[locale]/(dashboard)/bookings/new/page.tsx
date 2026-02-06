"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { TimeSlotGrid } from "@/components/booking/TimeSlotGrid";
import { ChevronRight, ChevronLeft, Check, Truck, User, Ship, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
    { id: 1, title: "Select Terminal", icon: Ship },
    { id: 2, title: "Date & Time", icon: CalendarIcon },
    { id: 3, title: "Fleet & Driver", icon: Truck },
    { id: 4, title: "Review", icon: Check },
];

import { QRCodeDisplay } from "@/components/booking/QRCodeDisplay";

export default function NewBookingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string | undefined>();
    const [selectedTerminal, setSelectedTerminal] = useState<string | undefined>();

    const terminals = [
        { id: "1", name: "Terminal North", location: "Sector A", type: "Container" },
        { id: "2", name: "Terminal South", location: "Sector B", type: "Bulk" },
        { id: "3", name: "Terminal West", location: "Sector C", type: "General Cargo" },
    ];

    const mockSlots = [
        { id: "s1", time: "08:00 - 09:00", available: 12, total: 20 },
        { id: "s2", time: "09:00 - 10:00", available: 5, total: 20 },
        { id: "s3", time: "10:00 - 11:00", available: 0, total: 20 },
        { id: "s4", time: "11:00 - 12:00", available: 18, total: 20 },
        { id: "s5", time: "13:00 - 14:00", available: 20, total: 20 },
        { id: "s6", time: "14:00 - 15:00", available: 2, total: 20 },
    ];

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
                <p className="text-foreground/50 text-sm">Follow the steps to reserve your terminal access slot.</p>
            </div>

            {/* Stepper */}
            <div className="glass-card p-6 border border-foreground/5">
                <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-foreground/5 -translate-y-1/2 -z-10"></div>
                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2",
                                        isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                            isActive ? "bg-background border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]" :
                                                "bg-background border-foreground/10 text-foreground/30"
                                    )}
                                >
                                    {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest",
                                    isActive ? "text-foreground" : "text-foreground/30"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                >
                    {currentStep === 1 && (
                        <div className="grid md:grid-cols-3 gap-6">
                            {terminals.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => { setSelectedTerminal(t.id); nextStep(); }}
                                    className={cn(
                                        "glass-card p-8 border hover:border-primary/50 text-left transition-all group",
                                        selectedTerminal === t.id ? "border-primary bg-primary/5" : "border-foreground/5"
                                    )}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                        <Ship size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg">{t.name}</h3>
                                    <div className="flex flex-col gap-1 mt-4">
                                        <span className="text-xs text-foreground/40 font-medium">{t.location}</span>
                                        <span className="text-xs text-foreground/60">{t.type} Logistics</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                            <BookingCalendar
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                            />
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Select Time Slot</h3>
                                    <span className="text-xs text-foreground/40 font-medium">Slots centered around {selectedDate ? format(selectedDate, "MMM do") : "selected date"}</span>
                                </div>
                                <TimeSlotGrid
                                    slots={mockSlots}
                                    selectedSlotId={selectedSlot}
                                    onSlotSelect={setSelectedSlot}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="max-w-2xl mx-auto glass-card p-8 border border-foreground/5 space-y-8">
                            <div className="space-y-6">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Truck size={20} className="text-primary" />
                                    Vehicle Assignment
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider">License Plate</label>
                                        <input type="text" placeholder="TX-992-BK" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Truck Type</label>
                                        <select className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none">
                                            <option>Semi-Trailer</option>
                                            <option>Flatbed</option>
                                            <option>Refrigerator</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-foreground/5">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <User size={20} className="text-primary" />
                                    Driver Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Full Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Contact Phone</label>
                                        <input type="text" placeholder="+1 234 567 890" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && !isConfirmed && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="glass-card p-12 border-2 border-primary/20 bg-primary/5 flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                                    <Check size={40} strokeWidth={3} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold">Ready to Confirm?</h2>
                                    <p className="text-foreground/50">Your slot for Terminal North is held for 10 minutes.</p>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-4 pt-6">
                                    <div className="bg-foreground/5 p-4 rounded-2xl text-left border border-foreground/10">
                                        <span className="text-[10px] font-bold text-foreground/30 uppercase block mb-1">Schedule</span>
                                        <p className="font-bold">{selectedDate ? format(selectedDate, "MMM do") : "TBD"}</p>
                                        <p className="text-xs text-primary font-bold">14:00 - 15:00</p>
                                    </div>
                                    <div className="bg-foreground/5 p-4 rounded-2xl text-left border border-foreground/10">
                                        <span className="text-[10px] font-bold text-foreground/30 uppercase block mb-1">Vehicle</span>
                                        <p className="font-bold">TX-992-BK</p>
                                        <p className="text-xs text-foreground/40 font-medium">Semi-Trailer</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsConfirmed(true)}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] uppercase tracking-widest"
                            >
                                Confirm Booking & Generate QR
                            </button>
                        </div>
                    )}

                    {isConfirmed && (
                        <div className="flex flex-col items-center space-y-8 animate-in zoom-in duration-500">
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest mb-2">
                                    <Check size={14} />
                                    Successfully Confirmed
                                </div>
                                <h2 className="text-4xl font-black tracking-tight">Access Permit Ready</h2>
                                <p className="text-foreground/50 max-w-md mx-auto">Your booking has been registered. Please present the QR code at the terminal gate for entry.</p>
                            </div>

                            <QRCodeDisplay
                                value="BK-2401-998"
                                bookingNumber="BK-2401-998"
                                terminalName="Terminal North"
                            />

                            <div className="flex gap-4">
                                <Link
                                    href="/bookings"
                                    className="px-8 py-4 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-2xl font-bold transition-all"
                                >
                                    Go to My Bookings
                                </Link>
                                <button
                                    onClick={() => window.print()}
                                    className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    Print Permit
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {!isConfirmed && (
                <div className="flex items-center justify-between pt-8 border-t border-foreground/5">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-foreground/10 hover:bg-foreground/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-bold text-sm">Previous Step</span>
                    </button>

                    {currentStep < 4 && currentStep > 1 && (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                        >
                            <span className="font-bold text-sm">Continue</span>
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
