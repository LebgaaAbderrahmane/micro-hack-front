"use client";

import React from "react";
import { X, User, Save, Phone, Mail, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Driver } from "@/types/fleet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const driverSchema = z.object({
    firstName: z.string().min(2, "Required"),
    lastName: z.string().min(2, "Required"),
    licenseNumber: z.string().min(5, "Required"),
    phone: z.string().min(10, "Invalid phone"),
    email: z.string().email("Invalid email"),
    status: z.enum(["active", "on_leave", "suspended"]),
});

interface DriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    driver?: Driver;
}

export const DriverModal = ({ isOpen, onClose, driver }: DriverModalProps) => {
    type DriverFormValues = z.infer<typeof driverSchema>;

    const { register, handleSubmit, formState: { errors } } = useForm<DriverFormValues>({
        resolver: zodResolver(driverSchema),
        defaultValues: driver ? {
            firstName: driver.firstName,
            lastName: driver.lastName,
            licenseNumber: driver.licenseNumber,
            phone: driver.phone,
            email: driver.email,
            status: driver.status as "active" | "on_leave" | "suspended"
        } : {
            firstName: "",
            lastName: "",
            licenseNumber: "",
            phone: "",
            email: "",
            status: "active",
        },
    });

    if (!isOpen) return null;

    const onSubmit = (data: DriverFormValues) => {
        console.log("Saving driver:", data);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="glass-card w-full max-w-lg border border-foreground/10 relative z-10 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between p-6 border-b border-foreground/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <User size={20} />
                        </div>
                        <h3 className="font-bold text-lg">{driver ? "Edit Driver" : "Add New Driver"}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                        <X size={20} className="text-foreground/40" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">First Name</label>
                            <input
                                {...register("firstName")}
                                className={cn(
                                    "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                    errors.firstName && "border-error/50 ring-error/20"
                                )}
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Last Name</label>
                            <input
                                {...register("lastName")}
                                className={cn(
                                    "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                    errors.lastName && "border-error/50 ring-error/20"
                                )}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                            <input
                                {...register("email")}
                                className={cn(
                                    "w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                    errors.email && "border-error/50 ring-error/20"
                                )}
                                placeholder="john.doe@logistics.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                                <input
                                    {...register("phone")}
                                    className={cn(
                                        "w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                        errors.phone && "border-error/50 ring-error/20"
                                    )}
                                    placeholder="+1..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">License No.</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                                <input
                                    {...register("licenseNumber")}
                                    className={cn(
                                        "w-full bg-foreground/5 border border-foreground/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                        errors.licenseNumber && "border-error/50 ring-error/20"
                                    )}
                                    placeholder="L-000000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Status</label>
                        <select
                            {...register("status")}
                            className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                        >
                            <option value="active">Active</option>
                            <option value="on_leave">On Leave</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-foreground/5 hover:bg-foreground/10 rounded-xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            <Save size={18} />
                            Save Driver
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
