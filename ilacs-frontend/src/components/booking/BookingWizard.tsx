"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Truck, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOKING_STEPS, COMPONENT_HEIGHTS } from "@/lib/constants";
import { useToast } from "@/components/common/Toast";

interface BookingData {
    terminalId?: string;
    date?: Date;
    timeSlot?: string;
    truckId?: string;
    driverId?: string;
    notes?: string;
}

interface BookingWizardProps {
    onClose: () => void;
    onComplete: (booking: BookingData) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [bookingData, setBookingData] = useState<BookingData>({});
    const { show } = useToast();

    const updateBookingData = (data: Partial<BookingData>) => {
        setBookingData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (currentStep < BOOKING_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        // Validate booking data
        if (!bookingData.terminalId || !bookingData.date || !bookingData.timeSlot || !bookingData.truckId) {
            show("Please complete all required fields", "error", "Incomplete Booking");
            return;
        }

        onComplete(bookingData);
        show("Booking created successfully! QR code generated.", "success", "Booking Confirmed");
        onClose();
    };

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 0:
                return !!bookingData.terminalId;
            case 1:
                return !!bookingData.date && !!bookingData.timeSlot;
            case 2:
                return !!bookingData.truckId;
            case 3:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl glass-card border border-foreground/10 overflow-hidden shadow-2xl"
                style={{ maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="p-8 border-b border-foreground/5 bg-foreground/[0.02]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">New Booking</h2>
                            <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest mt-1">
                                {BOOKING_STEPS[currentStep].description}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all flex items-center justify-center text-foreground/40"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-4">
                        {BOOKING_STEPS.map((step, idx) => (
                            <React.Fragment key={step.id}>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-500",
                                            idx === currentStep
                                                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                                                : idx < currentStep
                                                    ? "bg-success/10 text-success border border-success/20"
                                                    : "bg-foreground/5 text-foreground/20 border border-foreground/10"
                                        )}
                                    >
                                        {idx < currentStep ? <CheckCircle2 size={18} /> : step.id}
                                    </div>
                                    <div className="hidden md:block">
                                        <p className={cn(
                                            "text-xs font-black uppercase tracking-widest transition-colors",
                                            idx === currentStep ? "text-primary" : "text-foreground/30"
                                        )}>
                                            {step.name}
                                        </p>
                                    </div>
                                </div>
                                {idx < BOOKING_STEPS.length - 1 && (
                                    <div className={cn(
                                        "flex-1 h-[2px] transition-all duration-500",
                                        idx < currentStep ? "bg-success" : "bg-foreground/10"
                                    )} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8" style={{ minHeight: '400px' }}>
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <TerminalSelection key="step-0" data={bookingData} onChange={updateBookingData} />
                        )}
                        {currentStep === 1 && (
                            <DateTimeSelection key="step-1" data={bookingData} onChange={updateBookingData} />
                        )}
                        {currentStep === 2 && (
                            <TruckAssignment key="step-2" data={bookingData} onChange={updateBookingData} />
                        )}
                        {currentStep === 3 && (
                            <ReviewConfirmation key="step-3" data={bookingData} />
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-foreground/5 flex items-center justify-between bg-fore ground/[0.02]">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={cn(
                            "px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all",
                            currentStep === 0
                                ? "opacity-30 cursor-not-allowed bg-foreground/5 text-foreground/20"
                                : "bg-foreground/5 hover:bg-foreground/10 text-foreground"
                        )}
                    >
                        <ChevronLeft size={16} />
                        Back
                    </button>

                    {currentStep < BOOKING_STEPS.length - 1 ? (
                        <button
                            onClick={nextStep}
                            disabled={!isStepValid(currentStep)}
                            className={cn(
                                "px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg",
                                isStepValid(currentStep)
                                    ? "bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/30"
                                    : "opacity-30 cursor-not-allowed bg-foreground/5 text-foreground/20"
                            )}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            disabled={!isStepValid(currentStep)}
                            className={cn(
                                "px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg",
                                isStepValid(currentStep)
                                    ? "bg-success text-white hover:scale-105 active:scale-95 shadow-success/30"
                                    : "opacity-30 cursor-not-allowed bg-foreground/5 text-foreground/20"
                            )}
                        >
                            <CheckCircle2 size={16} />
                            Confirm Booking
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Step 1: Terminal Selection
const TerminalSelection: React.FC<{ data: BookingData; onChange: (data: Partial<BookingData>) => void }> = ({ data, onChange }) => {
    const terminals = [
        { id: 'T-001', name: 'Alpha Cluster • 01', capacity: 42, available: true },
        { id: 'T-002', name: 'Alpha Cluster • 02', capacity: 94, available: false },
        { id: 'T-003', name: 'Beta Sector • E1', capacity: 65, available: true },
        { id: 'T-004', name: 'Deep Sea Rim • 01', capacity: 72, available: true },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">Select Terminal</h3>
                <p className="text-sm text-foreground/40 font-bold">Choose your destination terminal based on availability</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terminals.map((terminal) => (
                    <button
                        key={terminal.id}
                        onClick={() => onChange({ terminalId: terminal.id })}
                        disabled={!terminal.available}
                        className={cn(
                            "p-6 rounded-2xl border-2 text-left transition-all duration-300 group",
                            data.terminalId === terminal.id
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                : terminal.available
                                    ? "border-foreground/10 hover:border-primary/30 bg-foreground/[0.02]"
                                    : "border-foreground/5 bg-foreground/[0.01] opacity-40 cursor-not-allowed"
                        )}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <MapPin className={cn(
                                "transition-colors",
                                data.terminalId === terminal.id ? "text-primary" : "text-foreground/30"
                            )} size={24} />
                            {terminal.available ? (
                                <span className="px-3 py-1 rounded-lg bg-success/10 text-success text-[10px] font-black uppercase tracking-widest">
                                    Available
                                </span>
                            ) : (
                                <span className="px-3 py-1 rounded-lg bg-error/10 text-error text-[10px] font-black uppercase tracking-widest">
                                    Full
                                </span>
                            )}
                        </div>
                        <h4 className="font-black text-sm uppercase tracking-tight text-foreground mb-1">{terminal.name}</h4>
                        <p className="text-xs text-foreground/40 font-bold">Utilization: {terminal.capacity}%</p>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

// Step 2: Date & Time Selection (Simplified placeholder)
const DateTimeSelection: React.FC<{ data: BookingData; onChange: (data: Partial<BookingData>) => void }> = ({ data, onChange }) => {
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">Select Date & Time</h3>
                <p className="text-sm text-foreground/40 font-bold">Choose your preferred arrival slot</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground/60 mb-3 block">Date</label>
                    <input
                        type="date"
                        value={data.date ? data.date.toISOString().split('T')[0] : ''}
                        onChange={(e) => onChange({ date: new Date(e.target.value) })}
                        className="w-full p-4 rounded-xl border border-foreground/10 bg-background text-foreground font-bold"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div>
                    <label className="text-xs font-black uppercase tracking-widest text-foreground/60 mb-3 block">Time Slot</label>
                    <div className="grid grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => onChange({ timeSlot: slot })}
                                className={cn(
                                    "p-4 rounded-xl border-2 font-black text-sm transition-all",
                                    data.timeSlot === slot
                                        ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10"
                                        : "border-foreground/10 hover:border-primary/30 text-foreground/60"
                                )}
                            >
                                <Clock size={16} className="mx-auto mb-2" />
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Step 3: Truck Assignment (Simplified placeholder)
const TruckAssignment: React.FC<{ data: BookingData; onChange: (data: Partial<BookingData>) => void }> = ({ data, onChange }) => {
    const trucks = [
        { id: 'TRK-001', plate: 'ABC-1234', model: 'Volvo FH16', driver: 'John Smith' },
        { id: 'TRK-002', plate: 'XYZ-5678', model: 'Scania R500', driver: 'Jane Doe' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">Assign Truck</h3>
                <p className="text-sm text-foreground/40 font-bold">Select the truck for this booking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trucks.map((truck) => (
                    <button
                        key={truck.id}
                        onClick={() => onChange({ truckId: truck.id, driverId: truck.driver })}
                        className={cn(
                            "p-6 rounded-2xl border-2 text-left transition-all duration-300",
                            data.truckId === truck.id
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                : "border-foreground/10 hover:border-primary/30 bg-foreground/[0.02]"
                        )}
                    >
                        <Truck className={cn(
                            "mb-4 transition-colors",
                            data.truckId === truck.id ? "text-primary" : "text-foreground/30"
                        )} size={24} />
                        <h4 className="font-black text-sm uppercase tracking-tight text-foreground mb-2">{truck.plate}</h4>
                        <p className="text-xs text-foreground/40 font-bold mb-1">{truck.model}</p>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-foreground/10">
                            <User size={14} className="text-foreground/40" />
                            <span className="text-xs font-bold text-foreground/60">{truck.driver}</span>
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

// Step 4: Review & Confirmation
const ReviewConfirmation: React.FC<{ data: BookingData }> = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">Review Booking</h3>
                <p className="text-sm text-foreground/40 font-bold">Please confirm all details are correct</p>
            </div>

            <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/10">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">Terminal</p>
                            <p className="font-bold text-foreground">{data.terminalId || 'Not selected'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">Date & Time</p>
                            <p className="font-bold text-foreground">
                                {data.date ? `${data.date.toLocaleDateString()} at ${data.timeSlot}` : 'Not selected'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">Truck</p>
                            <p className="font-bold text-foreground">{data.truckId || 'Not selected'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">Driver</p>
                            <p className="font-bold text-foreground">{data.driverId || 'Not selected'}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Important Information</p>
                    <ul className="space-y-2 text-sm text-foreground/60 font-medium">
                        <li>• Arrive 15 minutes before your scheduled time</li>
                        <li>• Present your QR code at the gate</li>
                        <li>• Cancellation requires 24 hours notice</li>
                        <li>• Late arrivals may result in slot reassignment</li>
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};
