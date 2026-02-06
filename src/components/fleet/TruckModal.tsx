"use client";

import React from "react";
import { X, Truck as TruckIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Truck } from "@/types/fleet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const truckSchema = z.object({
    licensePlate: z.string().min(3, "Required"),
    model: z.string().min(2, "Required"),
    year: z.number().min(2000).max(new Date().getFullYear() + 1),
    status: z.enum(["active", "maintenance", "idle", "in_transit"]),
});

interface TruckModalProps {
    isOpen: boolean;
    onClose: () => void;
    truck?: Truck;
}

export const TruckModal = ({ isOpen, onClose, truck }: TruckModalProps) => {
    type TruckFormValues = z.infer<typeof truckSchema>;

    const { register, handleSubmit, formState: { errors } } = useForm<TruckFormValues>({
        resolver: zodResolver(truckSchema),
        defaultValues: truck ? {
            licensePlate: truck.licensePlate,
            model: truck.model,
            year: truck.year,
            status: truck.status as "active" | "maintenance" | "idle" | "in_transit"
        } : {
            licensePlate: "",
            model: "",
            year: new Date().getFullYear(),
            status: "active",
        },
    });

    if (!isOpen) return null;

    const onSubmit = (data: TruckFormValues) => {
        console.log("Saving truck:", data);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="glass-card w-full max-w-lg border border-foreground/10 relative z-10 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between p-6 border-b border-foreground/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <TruckIcon size={20} />
                        </div>
                        <h3 className="font-bold text-lg">{truck ? "Edit Vehicle" : "Add New Vehicle"}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                        <X size={20} className="text-foreground/40" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">License Plate</label>
                            <input
                                {...register("licensePlate")}
                                className={cn(
                                    "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                    errors.licensePlate && "border-error/50 ring-error/20"
                                )}
                                placeholder="TX-000-XX"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Model</label>
                            <input
                                {...register("model")}
                                className={cn(
                                    "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                    errors.model && "border-error/50 ring-error/20"
                                )}
                                placeholder="Volvo FH16"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Year</label>
                            <input
                                type="number"
                                {...register("year", { valueAsNumber: true })}
                                className={cn(
                                    "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                    errors.year && "border-error/50 ring-error/20"
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Initial Status</label>
                            <select
                                {...register("status")}
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                            >
                                <option value="active">Active</option>
                                <option value="idle">Idle</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="in_transit">In Transit</option>
                            </select>
                        </div>
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
                            Save Vehicle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
